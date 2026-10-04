#!/usr/bin/env python3
"""Generate note-deck slides through OpenRouter image models (default: google/gemini-3.1-flash-image).

Drop-in sibling of note-deck's gen_deck.py: same deck-spec.json, same output folder, but the
image is made by an OpenRouter model instead of codex's built-in image_gen. Style reference
images are sent as real image inputs, so the deck keeps one look.

Usage:
    python gen_openrouter.py deck-spec.json [--parallel 2] [--retries 2] [--only 01,14,29b]
    python gen_openrouter.py --one out.png --prompt-file p.txt [--ref a.png --ref b.png]
    python gen_openrouter.py --one fixed.png --prompt-file recipe3.txt --ref original.png --edit

API key: environment variable OPENROUTER_API_KEY (never put the key in a file under ~ —
the home directory is a git repo with a GitHub remote).

deck-spec.json (same as note-deck):
{
  "deck_dir": "E:/path/to/presentations/my-deck",
  "style_refs_dir": "(optional, defaults to note-deck's assets/style-refs)",
  "model": "(optional, overrides --model)",
  "slides": [
    {"file": "01-cover", "layout": "cover", "prompt": "STYLE ... LAYOUT ...",
     "style_refs": ["(optional) explicit ref image paths, overrides layout default"]}
  ]
}
Outputs <deck_dir>/src-png/<file>.png, logs in <deck_dir>/src-png/logs/.
"""
import argparse
import base64
import io
import json
import mimetypes
import os
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "google/gemini-3.1-flash-image"
# note-deck lives next to this skill when the repo ships it (.claude/skills/note-deck), else in the global skills dir
_REPO_NOTE_DECK = Path(__file__).resolve().parents[2] / "note-deck"
NOTE_DECK_DIR = _REPO_NOTE_DECK if _REPO_NOTE_DECK.exists() else Path.home() / ".claude" / "skills" / "note-deck"
DEFAULT_STYLE_REFS = NOTE_DECK_DIR / "assets" / "style-refs"
LAYOUT_REF = {
    "cover": "cover.png",
    "divider": "divider.png",
    "cards": "cards.png",
    "flow": "flow.png",
    "contrast": "contrast-banner.png",
    "stat": "cards.png",
    "banner": "cards.png",
}
GEN_INSTRUCTION = (
    "Generate exactly one image: a 16:9 landscape presentation slide. The attached image(s) "
    "are STYLE REFERENCES only — match their visual style, handwriting, stroke weight, color "
    "palette and robot mascot exactly, but create a new composition per the spec below. "
    "Do not copy the text from the reference images.\n\n"
)
MIN_BYTES = 50_000

print_lock = threading.Lock()


def log(msg):
    with print_lock:
        print(msg, flush=True)


def data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key and sys.platform == "win32":
        # sessions started before `setx` don't inherit it — read the user env from the registry
        try:
            import winreg
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as k:
                key = winreg.QueryValueEx(k, "OPENROUTER_API_KEY")[0]
        except OSError:
            key = None
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")
    return key


def call_openrouter(prompt: str, refs, model: str, timeout: int = 300):
    key = api_key()
    content = [{"type": "text", "text": prompt}]
    for r in refs:
        content.append({"type": "image_url", "image_url": {"url": data_url(r)}})
    body = {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "modalities": ["image", "text"],
        "image_config": {"aspect_ratio": "16:9"},
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "X-Title": "note-deck-openrouter",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def extract_image(resp: dict) -> bytes:
    choices = resp.get("choices") or []
    if not choices:
        raise RuntimeError(f"no choices in response: {json.dumps(resp)[:500]}")
    msg = choices[0].get("message", {})
    urls = [im.get("image_url", {}).get("url") for im in (msg.get("images") or [])]
    if not urls and isinstance(msg.get("content"), list):
        urls = [p.get("image_url", {}).get("url") for p in msg["content"] if p.get("type") == "image_url"]
    urls = [u for u in urls if u]
    if not urls:
        text = msg.get("content") if isinstance(msg.get("content"), str) else ""
        raise RuntimeError(f"no image in response; model said: {text[:300]!r}")
    url = urls[0]
    if url.startswith("data:"):
        return base64.b64decode(url.split(",", 1)[1])
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()


def save_png(raw: bytes, out_png: Path):
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(raw))
        im.save(out_png, "PNG")
        return im.size
    except ImportError:
        out_png.write_bytes(raw)
        return None


def generate(name, prompt, refs, out_png: Path, log_dir: Path, model, retries, edit=False):
    log_dir.mkdir(parents=True, exist_ok=True)
    # edit=True (Recipe 3): the ref IS the original slide, so skip the "new composition" instruction
    full = GEN_INSTRUCTION + prompt if refs and not edit else prompt
    (log_dir / f"{name}.prompt.txt").write_text(full, encoding="utf-8")
    for attempt in range(1, retries + 2):
        log(f"[{name}] attempt {attempt} ({model}; refs: {', '.join(r.name for r in refs) or 'none'})")
        t0 = time.time()
        try:
            resp = call_openrouter(full, refs, model)
            raw = extract_image(resp)
            size = save_png(raw, out_png)
            usage = resp.get("usage", {})
            (log_dir / f"{name}.usage.json").write_text(json.dumps(usage, indent=2), encoding="utf-8")
            if out_png.stat().st_size < MIN_BYTES:
                raise RuntimeError(f"image too small ({out_png.stat().st_size} bytes)")
            cost = usage.get("cost")
            log(f"[{name}] OK ({time.time() - t0:.0f}s, {size}, {out_png.stat().st_size // 1024} KB"
                + (f", ${cost:.4f}" if isinstance(cost, (int, float)) else "") + ")")
            return True
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", errors="replace")[:600]
            (log_dir / f"{name}.error.txt").write_text(detail, encoding="utf-8")
            if e.code == 429:
                log(f"[{name}] 429 rate limit — waiting 60s")
                time.sleep(60)
            elif e.code in (401, 402, 403):
                log(f"[{name}] HTTP {e.code} (auth/credit) — not retrying: {detail[:200]}")
                return False
            else:
                log(f"[{name}] HTTP {e.code}: {detail[:200]}")
                time.sleep(5)
        except Exception as e:  # network, parse, no-image replies
            (log_dir / f"{name}.error.txt").write_text(str(e), encoding="utf-8")
            log(f"[{name}] FAILED: {e}")
            time.sleep(5)
    return False


def run_spec(args):
    spec = json.loads(Path(args.spec).read_text(encoding="utf-8"))
    deck_dir = Path(spec["deck_dir"])
    refs_dir = Path(spec.get("style_refs_dir", DEFAULT_STYLE_REFS))
    model = spec.get("model", args.model)
    slides = spec["slides"]
    if args.only:
        keys = [k.strip() for k in args.only.split(",")]
        slides = [s for s in slides if any(s["file"].startswith(k) for k in keys)]
    if not slides:
        sys.exit("no slides selected")
    src = deck_dir / "src-png"
    src.mkdir(parents=True, exist_ok=True)
    log(f"Generating {len(slides)} slide(s) → {src} (model={model}, parallel={args.parallel})")

    def job(s):
        refs = [Path(p) for p in s.get("style_refs", [])]
        if not refs:
            refs = [refs_dir / LAYOUT_REF.get(s.get("layout", "cards"), "cards.png")]
        missing = [r for r in refs if not r.exists()]
        if missing:
            log(f"[{s['file']}] WARNING: style ref(s) not found, skipped: {', '.join(str(m) for m in missing)}")
        refs = [r for r in refs if r.exists()]
        return s["file"], generate(s["file"], s["prompt"], refs, src / f"{s['file']}.png",
                                   src / "logs", model, args.retries)

    results = {}
    with ThreadPoolExecutor(max_workers=args.parallel) as ex:
        for fut in as_completed([ex.submit(job, s) for s in slides]):
            name, ok = fut.result()
            results[name] = ok
    failed = sorted(n for n, ok in results.items() if not ok)
    log(f"\nDone: {len(results) - len(failed)}/{len(results)} succeeded")
    if failed:
        log("FAILED: " + ", ".join(failed))
        sys.exit(1)


def run_one(args):
    out = Path(args.one)
    out.parent.mkdir(parents=True, exist_ok=True)
    prompt = Path(args.prompt_file).read_text(encoding="utf-8")
    refs = [Path(r) for r in (args.ref or [])]
    missing = [str(r) for r in refs if not r.exists()]
    if missing:
        sys.exit(f"missing ref(s): {missing}")
    ok = generate(out.stem, prompt, refs, out, out.parent / "logs", args.model, args.retries, edit=args.edit)
    sys.exit(0 if ok else 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec", nargs="?")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--parallel", type=int, default=2)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--only", help="comma-separated slide file prefixes, e.g. 01,14,29b")
    ap.add_argument("--one", help="single-image mode: output PNG path")
    ap.add_argument("--prompt-file", help="single-image mode: prompt text file")
    ap.add_argument("--ref", action="append", help="single-image mode: reference image (repeatable)")
    ap.add_argument("--edit", action="store_true", help="single-image mode: Recipe 3 edit — send the prompt as-is, no style-reference preamble")
    args = ap.parse_args()
    if args.one:
        if not args.prompt_file:
            sys.exit("--one needs --prompt-file")
        run_one(args)
    elif args.spec:
        run_spec(args)
    else:
        ap.error("give a deck-spec.json or --one")


if __name__ == "__main__":
    main()
