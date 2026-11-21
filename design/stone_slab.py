"""A flat slab of the sandstone of the `hair` figures, for a figure that needs a large sawn face of it.

    .venv/bin/python design/stone_slab.py            (from the repository root)

The grain is that of the first sawn face (figures3d/sprites/hair/ball-face.png, cut by design/hair_sprites.py from the
image model's sheet), with its lighting taken out. It is laid down many times over at random places, turned and
flipped at random, under smooth windows, and brought back to the grain's own contrast: a slab as large as wanted,
evenly lit and without a repeat or a seam (tiling the face, or mirroring it, shows). Writes
figures3d/sprites/slab.jpg, WIDTH by HEIGHT pixels, which figures3d/figs/near-field-geometry.js clips to its block.
"""
from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = pathlib.Path(__file__).resolve().parents[1]
FACE = ROOT / "figures3d" / "sprites" / "hair" / "ball-face.png"
OUT = ROOT / "figures3d" / "sprites" / "slab.jpg"

WIDTH, HEIGHT = 1440, 720       # a face 216 pt by 108 pt is then drawn at 480 dots per inch, as the bodies are
HALF = 120                      # half the side of the square of grain taken from the middle of the face, pixels
COVER = 6.0                     # how many times over the slab is covered
SEED = 3


def slab(width: int = WIDTH, height: int = HEIGHT, seed: int = SEED) -> np.ndarray:
    a = np.asarray(Image.open(FACE).convert("RGBA")).astype(float)
    c = a.shape[0] // 2
    crop = a[c - HALF:c + HALF, c - HALF:c + HALF, :3]
    assert a[c - HALF:c + HALF, c - HALF:c + HALF, 3].min() == 255          # all of it stone
    tone = crop.reshape(-1, 3).mean(axis=0)
    grain = crop - np.stack([gaussian_filter(crop[:, :, k], 30, mode="reflect") for k in range(3)], axis=2)
    n = 2 * HALF
    window = np.outer(np.hanning(n + 2)[1:-1], np.hanning(n + 2)[1:-1])
    rng = np.random.default_rng(seed)
    total = np.zeros((height + 2 * n, width + 2 * n, 3))
    weight = np.zeros((height + 2 * n, width + 2 * n))
    for _ in range(int(COVER * (width + n) * (height + n) / (n * n / 4))):
        piece = np.rot90(grain, rng.integers(4))
        if rng.integers(2):
            piece = piece[:, ::-1]
        y, x = rng.integers(0, height + n), rng.integers(0, width + n)
        total[y:y + n, x:x + n] += window[:, :, None] * piece
        weight[y:y + n, x:x + n] += window**2
    out = total[n:-n, n:-n] / np.sqrt(np.maximum(weight[n:-n, n:-n], 1e-6))[:, :, None]
    out *= grain.std(axis=(0, 1)) / out.std(axis=(0, 1))
    return np.clip(tone + out, 0, 255).round().astype(np.uint8)


if __name__ == "__main__":
    image = slab()
    Image.fromarray(image).save(OUT, quality=90, subsampling=0)
    print(f"wrote {OUT.relative_to(ROOT)}: {image.shape[1]} x {image.shape[0]}, {OUT.stat().st_size // 1024} kB, "
          f"mean tone {image.reshape(-1, 3).mean(axis=0).round(1)}")
