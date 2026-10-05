#!/usr/bin/env python3
"""Flatten and unify the paper background of note-deck slide PNGs.

Image models paint the cream paper a little differently on every call (warmer, greyer,
with soft vignettes). This estimates each slide's paper colour as a smooth field — a local
80th-percentile per channel at 1/8 scale, so ink, highlighter and the robot drop out — and
divides it out, so the paper of every slide lands on exactly the same colour (default
#FCF8F2, the note-deck viewer background) while ink and accents keep their relative tone.

Usage:
    python normalize_bg.py <deck_dir> [--target FCF8F2] [--check]

Processes <deck_dir>/src-png/[0-9]*.png in place. The first run copies the untouched
originals to src-png/_prenorm/, and every run starts from those copies, so re-running is safe.
--check only prints the paper colour of each slide without changing anything.
"""
import argparse
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SCALE = 8
RANK_SIZE = 15          # 15 px at 1/8 scale ≈ 120 px window at full size
RANK_PCT = 0.80


def paper_stats(arr: np.ndarray):
    """Median colour of paper-like pixels (bright, low saturation) overall and per 4x8 cell."""
    luma = arr.mean(axis=2)
    sat = arr.max(axis=2) - arr.min(axis=2)
    mask = (luma > 205) & (sat < 45)
    overall = np.median(arr[mask], axis=0)
    h, w, _ = arr.shape
    cells = []
    for gy in range(4):
        for gx in range(8):
            sl = (slice(gy * h // 4, (gy + 1) * h // 4), slice(gx * w // 8, (gx + 1) * w // 8))
            m = mask[sl]
            if m.sum() > 500:
                cells.append(np.median(arr[sl][m], axis=0))
    cells = np.array(cells)
    spread = (cells.max(axis=0) - cells.min(axis=0)) if len(cells) else np.zeros(3)
    return overall, spread


def paper_field(img: Image.Image) -> np.ndarray:
    w, h = img.size
    small = img.resize((max(1, w // SCALE), max(1, h // SCALE)), Image.BOX)
    rank = int(RANK_SIZE * RANK_SIZE * RANK_PCT)
    chans = [c.filter(ImageFilter.RankFilter(RANK_SIZE, rank)).filter(ImageFilter.GaussianBlur(3))
             for c in small.split()]
    field = Image.merge("RGB", chans).resize((w, h), Image.BICUBIC)
    return np.asarray(field).astype(np.float32)


def normalize(src: Path, dst: Path, target: np.ndarray):
    img = Image.open(src).convert("RGB")
    arr = np.asarray(img).astype(np.float32)
    field = np.clip(paper_field(img), 1.0, 255.0)
    out = np.clip(arr * (target / field), 0, 255).round().astype(np.uint8)
    Image.fromarray(out).save(dst, "PNG")
    return arr, out.astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck_dir")
    ap.add_argument("--target", default="FCF8F2", help="paper colour as RRGGBB (default FCF8F2)")
    ap.add_argument("--check", action="store_true", help="report only, change nothing")
    args = ap.parse_args()

    target = np.array([int(args.target[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)
    src_dir = Path(args.deck_dir) / "src-png"
    pngs = sorted(src_dir.glob("[0-9]*.png"))
    if not pngs:
        sys.exit(f"no slide PNGs in {src_dir}")

    if args.check:
        for p in pngs:
            o, s = paper_stats(np.asarray(Image.open(p).convert("RGB")).astype(np.float32))
            print(f"{p.name:34s} paper={tuple(int(v) for v in o)}  within-slide spread={tuple(int(v) for v in s)}")
        return

    keep = src_dir / "_prenorm"
    keep.mkdir(exist_ok=True)
    for p in pngs:
        orig = keep / p.name
        if not orig.exists():
            shutil.copy2(p, orig)
        before, after = normalize(orig, p, target)
        b, bs = paper_stats(before)
        a, as_ = paper_stats(after)
        print(f"{p.name:34s} {tuple(int(v) for v in b)} spread {tuple(int(v) for v in bs)}"
              f"  ->  {tuple(int(v) for v in a)} spread {tuple(int(v) for v in as_)}")


if __name__ == "__main__":
    main()
