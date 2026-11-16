"""All-sky textures for the vista demos, from the reference model of the Galaxy.

    python3 app/scripts/sky_textures.py          (from the repository root)

writes, in equirectangular projection (galactic longitude decreasing from
+180 deg at the left edge to -180 deg at the right, latitude from +90 deg at
the top):

  app/static/sky/light.jpg   4096 x 2048: the model Milky Way in light, dimmed
                             and reddened by its dust, with a random field of
                             stars for orientation (as in the paper's
                             black-hole figure), on an asinh stretch.
  app/static/sky/waves.png   1024 x 512: the same stars' white-dwarf pairs in
                             millihertz gravitational waves, no dust:
                             brightness on a logarithmic scale of three
                             decades below the brightest point, 0 to 255.

The light texture is normalised to the brightest light; the waves texture to
the brightest waves. Both come from gravcam/galaxy.py.
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "reference"))

from gravcam import galaxy  # noqa: E402

OUT = ROOT / "app" / "static" / "sky"
TINT = np.array([1.0, 0.93, 0.84])
DECADES = 3.0


def grid(width: int, height: int):
    l = math.pi - (np.arange(width) + 0.5) / width * 2 * math.pi
    b = math.pi / 2 - (np.arange(height) + 0.5) / height * math.pi
    L, B = np.meshgrid(l, b)
    return galaxy.direction(L, B)


def stars(width: int, height: int, seed: int = 7) -> np.ndarray:
    """Random stars, crowded toward the Galaxy's plane, a few bright, many faint."""
    rng = np.random.default_rng(seed)
    n = 14000
    l = rng.uniform(-np.pi, np.pi, 4 * n)
    b = np.arcsin(rng.uniform(-1, 1, 4 * n))
    keep = rng.uniform(0, 1, 4 * n) < 0.35 + 0.65 * np.exp(-np.abs(np.degrees(b)) / 10.0)
    l, b = l[keep][:n], b[keep][:n]
    flux = rng.uniform(0, 1, len(l)) ** -1.5
    flux *= 0.9 / np.percentile(flux, 75)
    warm = rng.uniform(0, 1, len(l))
    colour = np.stack([0.85 + 0.15 * warm, 0.88 + 0.06 * warm, 1.0 - 0.25 * warm], axis=-1)
    tex = np.zeros((height, width, 3))
    i = np.clip(((np.pi / 2 - b) / np.pi * height).astype(int), 0, height - 1)
    j = np.clip(((np.pi - l) / (2 * np.pi) * width).astype(int), 0, width - 1)
    for k in range(3):
        np.add.at(tex[..., k], (i, j), flux * colour[:, k])
        tex[..., k] = gaussian_filter(tex[..., k], 0.55, mode="wrap")
    return tex


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    # the Galaxy's glow is smooth: compute it at half the size and enlarge it;
    # the stars are drawn at full size, so that they stay points
    w, h = 2048, 1024
    light, _ = galaxy.sky(grid(w, h), steps=700)
    top = np.percentile(light[..., 1], 99.9)
    x = light * TINT / top
    glow = np.arcsinh(4 * x) / np.arcsinh(4)
    big = np.stack([np.asarray(Image.fromarray(glow[..., k].astype(np.float32)).resize((2 * w, 2 * h),
                                                                                    Image.BILINEAR))
                    for k in range(3)], axis=-1)
    rgb = np.clip(big + stars(2 * w, 2 * h), 0, 1)
    Image.fromarray((rgb * 255 + 0.5).astype(np.uint8)).save(OUT / "light.jpg", quality=90, optimize=True)
    w, h = 1024, 512
    _, waves = galaxy.sky(grid(w, h), steps=700)
    v = (np.log10(np.clip(waves / waves.max(), 10 ** -DECADES, None)) + DECADES) / DECADES
    Image.fromarray((v * 255 + 0.5).astype(np.uint8), mode="L").save(OUT / "waves.png", optimize=True)
    for f in ("light.jpg", "waves.png"):
        print(f"wrote {OUT / f} ({(OUT / f).stat().st_size // 1024} kB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
