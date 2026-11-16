"""Trace an engraved sprite (black ink on white) into vector paths for the figures.

    python3 design/vectorize.py design/candidates/sprites/furnace.png paper/figures/sprites/furnace.json

The ink is traced by potrace (the pure-Python port, `pip install potracer`)
into closed outlines whose holes wind the other way, so they fill correctly.
The output is JSON: the image's size, and each outline as vertices and
matplotlib path codes in pixel units, y up. paper/figures/engrave.py draws it
at any place and size, in any of the paper's colours. Only the JSON is
committed, so building the figures needs neither the image model nor potrace.
"""
from __future__ import annotations

import json
import pathlib
import sys

import numpy as np
import potrace
from PIL import Image, ImageFilter

MOVETO, LINETO, CURVE4, CLOSEPOLY = 1, 2, 4, 79


def trace(png: pathlib.Path, upscale: int = 2, threshold: int = 140) -> dict:
    im = Image.open(png).convert("L")
    if upscale > 1:
        im = im.resize((im.width * upscale, im.height * upscale), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    ink = np.asarray(im) < threshold
    bitmap = potrace.Bitmap(ink)
    path = bitmap.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0,
                        opticurve=True, opttolerance=0.2)
    H = ink.shape[0]
    outlines = []
    for curve in path:
        verts, codes = [], []
        start = curve.start_point
        verts.append((start.x / upscale, (H - start.y) / upscale))
        codes.append(MOVETO)
        for seg in curve.segments:
            if seg.is_corner:
                for p in (seg.c, seg.end_point):
                    verts.append((p.x / upscale, (H - p.y) / upscale))
                    codes.append(LINETO)
            else:
                for p in (seg.c1, seg.c2, seg.end_point):
                    verts.append((p.x / upscale, (H - p.y) / upscale))
                    codes.append(CURVE4)
        verts.append(verts[0])
        codes.append(CLOSEPOLY)
        outlines.append({"v": np.round(np.array(verts), 2).tolist(), "c": codes})
    return {"size": [im.width / upscale, H / upscale], "outlines": outlines}


def main() -> int:
    src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    data = trace(src)
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(data, separators=(",", ":")))
    n = sum(len(o["c"]) for o in data["outlines"])
    print(f"{dst}: {len(data['outlines'])} outlines, {n} path elements, {dst.stat().st_size // 1024} kB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
