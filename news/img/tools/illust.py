"""Finish a generated illustration for a news issue: center-crop to 16:9, scale to
1600x900, optionally neutralize a color cast, and encode webp (quality 85, method 6).

    python news/img/tools/illust.py <raw.png> news/img/<issue>/feature-illust.webp [--neutral] [--png PREVIEW]

--neutral scales R/G/B so the average of the light pixels becomes gray (removes a
yellow/warm cast). Without it the colors are left as generated. No posterize/filter.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageStat

W, H = 1600, 900


def light_mean(im: Image.Image):
    gray = im.convert("L").point(lambda v: 255 if v >= 190 else 0)
    return ImageStat.Stat(im, mask=gray).mean if gray.getbbox() else None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("raw")
    ap.add_argument("out")
    ap.add_argument("--neutral", action="store_true")
    ap.add_argument("--png")
    a = ap.parse_args()
    im = Image.open(a.raw).convert("RGB")
    w, h = im.size
    cw, ch = (w, round(w * 9 / 16)) if w * 9 <= h * 16 else (round(h * 16 / 9), h)
    left, top = (w - cw) // 2, (h - ch) // 2
    im = im.crop((left, top, left + cw, top + ch)).resize((W, H), Image.LANCZOS)
    m = light_mean(im)
    print("light-pixel mean RGB:", [round(v, 1) for v in m] if m else "n/a")
    if a.neutral and m:
        target = sum(m) / 3
        bands = [b.point(lambda v, k=target / c: min(255, round(v * k))) for b, c in zip(im.split(), m)]
        im = Image.merge("RGB", bands)
    if a.png:
        im.save(a.png)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    im.save(a.out, "WEBP", quality=85, method=6)
    print(f"{a.out}  {Path(a.out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
