"""Render news chart cards (HTML) to PNG previews + webp.

    python news/img/tools/render.py 2026-10-12 [name ...] [--png-dir DIR]

Each news/img/tools/<issue>/<name>.html is screenshotted by headless Chrome at
1600x900 (device scale 2, then downsampled) and written to
news/img/<issue>/<name>.webp (quality 85, method 6). PNG previews go to --png-dir
(default: <system temp>/news-img/<issue>). Web fonts load from the network.
"""
import argparse
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

CHROME = os.environ.get("CHROME", r"C:/Program Files/Google/Chrome/Application/chrome.exe")
TOOLS = Path(__file__).resolve().parent
W, H, SCALE = 1600, 900, 2


def shoot(html: Path, png: Path) -> None:
    raw = png.with_suffix(".raw.png")
    subprocess.run([
        CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        f"--window-size={W},{H}", f"--force-device-scale-factor={SCALE}",
        "--virtual-time-budget=10000", f"--screenshot={raw}", html.as_uri(),
    ], check=True, capture_output=True, timeout=120)
    Image.open(raw).convert("RGB").resize((W, H), Image.LANCZOS).save(png)
    raw.unlink()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("issue")
    ap.add_argument("names", nargs="*")
    ap.add_argument("--png-dir")
    a = ap.parse_args()
    src = TOOLS / a.issue
    out = TOOLS.parent / a.issue
    png_dir = Path(a.png_dir or Path(tempfile.gettempdir()) / "news-img" / a.issue)
    png_dir.mkdir(parents=True, exist_ok=True)
    out.mkdir(parents=True, exist_ok=True)
    pages = [src / f"{n}.html" for n in a.names] or sorted(src.glob("*.html"))
    for html in pages:
        png = png_dir / f"{html.stem}.png"
        shoot(html, png)
        webp = out / f"{html.stem}.webp"
        Image.open(png).save(webp, "WEBP", quality=85, method=6)
        print(f"{webp.relative_to(TOOLS.parent.parent.parent)}  {webp.stat().st_size // 1024} KB  (preview {png})")
    sys.stdout.flush()


if __name__ == "__main__":
    main()
