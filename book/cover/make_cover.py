"""The cover's picture: the Earth seen from the distance of the Moon, the Sun hidden behind it, cut by the seam.

    .venv/bin/python book/cover/make_cover.py         writes book/cover/build/art.png (then book/cover/build.sh)

The page is 189 x 246 mm with 3 mm of bleed on every side (195 x 252 mm), drawn at PX pixels per millimetre.
Left of the seam the Earth is seen in light: its night side, dark, with no light but a thin ring of sunlight bent
round the limb by the air (the ring of a lunar eclipse), under stars. Right of the seam it is seen in gravity, as
the gravitational camera sees it: every pixel is the thermal number radiance N along its line of sight, computed by
the reference implementation (gravcam.columns.number_radiance) for the paper's scene of the Sun at midnight
(scenes/sun-at-midnight.scene.json), from an observer at the Moon's distance placed so that the Sun's core lies
behind the Earth, a little right of and below its centre. Exact: the Earth's disc (its angular radius from there),
the radiance of every pixel, the steps where lines of sight graze the inner core, the core and the lower mantle, and
the Sun's core (the only part of the Sun that emits in the scene), its size and place. Brightness is a piecewise-linear
ramp in N, scaled to the Earth's brightest line of sight (RAMP); the Sun's core, 3e10 times brighter, is shown on its
own scale, pale gold at its rim to white at its centre.
Schematic: the stars, the eclipse ring's width and colour, and the night side's surface, which is the stone texture
of an image-model picture (stone-earth.png, candidate F of run1 in design/candidates/book-cover/,
prompt design/prompts/book-cover.json), flat-fielded so that its own lighting is gone.
"""
from __future__ import annotations

import json
import pathlib
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "reference"))
from gravcam import columns  # noqa: E402
from gravcam.scene import load_scene  # noqa: E402

PX = 12                                   # pixels per mm (304.8 dpi)
BLEED = 3.0
W_MM, H_MM = 189 + 2 * BLEED, 246 + 2 * BLEED
W, H = round(W_MM * PX), round(H_MM * PX)
# the Earth on the page (mm, from the bleed's top left corner): centred across, its centre CY down, radius RE
CX, CY, RE = W_MM / 2, BLEED + 145.0, 58.0
SEAM = CX                                  # the seam runs down the page through the Earth's centre
# where the Sun's core is to appear, in units of the Earth's radius on the page: right and down from its centre
SUN_AT = (0.40, 0.24)
MOON = 384_400e3                           # the observer's distance from the Earth (m)

# colours, sRGB
SKY_LIGHT = (17, 21, 30)                   # the night sky, left of the seam
SKY_GRAVITY = (27, 19, 12)                 # the empty sky of gravity, right of it (the site's umber, darker)
STONE = (58, 54, 52)                       # the night side's stone at the centre of the disc
# the Earth in gravity: a ramp in N, as a fraction of its brightest line of sight (sRGB stops)
RAMP_V = [0.0, 0.12, 0.45, 1.0]
RAMP = [SKY_GRAVITY, (78, 46, 24), (170, 98, 46), (242, 184, 112)]
# the Sun's core, on its own scale (N over its own peak, SUN_PEAK): from its rim to its centre
SUN_EDGE, SUN_CENTRE = (250, 214, 160), (255, 251, 242)
SUN_PEAK = 4.048e5                         # the Sun's core's brightest line of sight (printed by a run)
RING = (214, 118, 66)                      # the eclipse ring


def lin(c):
    c = np.asarray(c, float) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def srgb(x):
    x = np.clip(x, 0, 1)
    return np.where(x <= 0.0031308, 12.92 * x, 1.055 * x ** (1 / 2.4) - 0.055)


def grid():
    """Page coordinates (mm) of every pixel's centre."""
    y, x = np.mgrid[0:H, 0:W].astype(float)
    return (x + 0.5) / PX, (y + 0.5) / PX


def gravity_image(xmm, ymm, tone, ss=3):
    """The colour (linear light) of the pixels at page coordinates (xmm, ymm) (only those given): N on each of
    ss x ss lines of sight a pixel, each toned by `tone` (N -> linear colour), then averaged. Also the largest N."""
    scene = load_scene(ROOT / "scenes" / "sun-at-midnight.scene.json")
    data = json.loads((ROOT / "scenes" / "sun-at-midnight.scene.json").read_text())
    obj = {o["id"]: o for o in data["objects"]}
    R = obj["earth"]["shape"]["radius"]
    sun = np.array(obj["sun-core"]["shape"]["center"], float)
    AU = np.linalg.norm(sun)
    s = sun / AU
    # the picture's axes: right (ex) and up (ey) across the line of sight
    ex = np.cross(s, [1.0, 0, 0]); ex /= np.linalg.norm(ex)
    ey = np.cross(ex, s)
    # the observer, MOON from the Earth, moved sideways by p so that the Sun's core appears at SUN_AT: for small
    # angles the Sun's direction moves against the Earth's by p (1/D - 1/(AU + D)); refined by iteration below
    theta = np.arcsin(R / MOON)
    want = np.array([SUN_AT[0], -SUN_AT[1]]) * np.tan(theta)
    p = want / (1 / MOON - 1 / (AU + MOON))
    for _ in range(5):
        o = -MOON * s + p[0] * ex + p[1] * ey
        v = -o / np.linalg.norm(o)
        # the picture's axes, square to the line of sight to the Earth's centre
        bx = ex - v * (ex @ v); bx /= np.linalg.norm(bx)
        by = np.cross(bx, v)
        q = (sun - o) / np.linalg.norm(sun - o)
        got = np.array([q @ bx, q @ by]) / (q @ v)
        p = p + (want - got) / (1 / MOON - 1 / (AU + MOON))
    tE = np.tan(np.arcsin(R / np.linalg.norm(o)))          # the Earth's radius in the tangent plane
    scale = tE / RE                                        # tangent-plane units per mm on the page
    print(f"observer {np.linalg.norm(o) / 1e3:.0f} km from the Earth, {np.linalg.norm(p) / 1e3:.0f} km off the "
          f"Sun's line; Sun's core at ({got[0] / tE:.4f}, {-got[1] / tE:.4f}) Earth radii, its radius "
          f"{np.tan(obj['sun-core']['shape']['radius'] / np.linalg.norm(sun - o)) / tE:.4f}")
    out = np.zeros(xmm.shape + (3,))
    peak = 0.0
    offs = (np.arange(ss) + 0.5) / ss - 0.5
    for dy in offs:
        for dx in offs:
            tx = (xmm + dx / PX - CX) * scale
            ty = -(ymm + dy / PX - CY) * scale
            d = v[None, :] + tx[:, None] * bx[None, :] + ty[:, None] * by[None, :]
            N = columns.number_radiance(scene, d, origin=o)
            peak = max(peak, N.max())
            out += tone(N)
    return out / ss ** 2, peak, (got[0] / tE, -got[1] / tE)


def earth_peak():
    """N along the line of sight through the Earth's centre, with the Sun not behind it: the scale of the glow."""
    scene = load_scene(ROOT / "scenes" / "sun-at-midnight.scene.json")
    R = 6371e3
    o = np.array([0.0, 0.0, MOON])                         # any side the Sun is not on (the Sun lies at z < 0)
    return float(columns.number_radiance(scene, np.array([[0.0, 0.0, -1.0]]), origin=o)[0])


def flat_field(path, cx, cy, r):
    """The stone texture of the picture's Earth (disc centre cx, cy, radius r, its pixels): luminance divided by
    its own blur, so that the picture's glow and shading are gone and only the surface's grain and relief remain."""
    im = np.asarray(Image.open(path).convert("RGB")).astype(float) / 255
    L = lin(im * 255).mean(2)
    yy, xx = np.mgrid[0:L.shape[0], 0:L.shape[1]]
    inside = (np.hypot(xx - cx, yy - cy) < r).astype(float)
    blur = gaussian_filter(L * inside, 18) / np.maximum(gaussian_filter(inside, 18), 1e-6)
    T = np.where(inside > 0, L / np.maximum(blur, 1e-6), 1.0)
    return np.clip(T, 0.25, 2.2)


def main():
    x, y = grid()
    rho = np.hypot(x - CX, y - CY) / RE                    # distance from the Earth's centre, in its radii
    left = x < SEAM
    img = np.empty((H, W, 3))
    img[left] = lin(SKY_LIGHT)
    img[~left] = lin(SKY_GRAVITY)
    # a faint grain on both skies, as of printed paper
    rng = np.random.default_rng(7)
    grain = gaussian_filter(rng.normal(0, 1, (H, W)), 0.8)
    img *= (1 + 0.035 * grain)[..., None]

    # --- light: stars, the night side's stone, the eclipse ring -----------------------------------------------
    n = 70
    sx, sy = rng.uniform(4, SEAM - 2, n), rng.uniform(4, H_MM - 4, n)
    keep = np.hypot(sx - CX, sy - CY) > RE + 4
    # none near the type (cover.tex): the title and subtitle's band, the author's line
    keep &= ~((abs(sx - CX) < 82) & (sy > 28) & (sy < 64)) & ~((abs(sx - CX) < 40) & (sy > 222) & (sy < 240))
    for a, b, m in zip(sx[keep], sy[keep], rng.uniform(0, 1, keep.sum()) ** 3):
        rr = (0.10 + 0.16 * m) * PX
        i0, j0 = int(b * PX), int(a * PX)
        k = int(np.ceil(4 * rr)) + 1                       # four sigmas: no edge to the star's blur
        sl = np.s_[max(i0 - k, 0):i0 + k + 1, max(j0 - k, 0):min(j0 + k + 1, int(SEAM * PX))]
        g = np.exp(-((x[sl] - a) ** 2 + (y[sl] - b) ** 2) * PX ** 2 / (2 * rr ** 2))
        img[sl] += (0.10 + 0.55 * m) * g[..., None] * lin((226, 230, 240))

    # the stone: the texture mapped onto the disc, the picture's disc (centre, radius) fitted to its outline
    T = flat_field(HERE / "stone-earth.png", 507.6, 1074.3, 345.0)
    fr = 340.0                                             # the picture's radius used: clear of its own bright rim
    ii = 1074.3 + (y - CY) / RE * fr
    jj = 507.6 + (x - CX) / RE * fr
    # the eclipse ring: sunlight bent through the air round the limb, a thin band just outside it (light only)
    out = left & (rho >= 1 - 2 / (RE * PX))
    h = np.maximum(rho[out] - 1, 0) * RE                    # mm above the limb
    ring = 0.9 * np.exp(-h / 0.22) + 0.10 * np.exp(-h / 1.6)
    img[out] += ring[:, None] * lin(RING)[None, :]
    sel = left & (rho < 1 + 1 / (RE * PX))
    cover = np.clip((1 - rho[sel]) * RE * PX + 0.5, 0, 1)   # the share of each pixel inside the limb
    tex = map_coordinates(T, [ii[sel] - 0.5, jj[sel] - 0.5], order=3, mode="nearest")
    mu = np.sqrt(np.clip(1 - rho[sel] ** 2, 0, 1))
    shade = 0.45 + 0.55 * mu ** 0.6                         # darker toward the limb
    stone = lin(STONE)[None, :] * (tex * shade)[:, None]
    img[sel] = cover[:, None] * stone + (1 - cover[:, None]) * img[sel]

    # --- gravity: the radiance of every pixel right of the seam, inside a square round the disc -----------------
    # the Earth's brightest line of sight, the one through its centre (hidden here behind the Sun's core): the scale
    box = (~left) & (rho < 1.03)
    EARTH_PEAK = earth_peak()
    SUN_FLOOR = 1e-3                                       # any N above this is the Sun's core (the Earth's < 2e-5)

    def tone(N):
        v = N / EARTH_PEAK
        c = np.stack([np.interp(v, RAMP_V, [c[k] for c in RAMP]) for k in range(3)], -1)
        sun = N > SUN_FLOOR
        if sun.any():
            t = np.sqrt(np.clip(N[sun] / SUN_PEAK, 0, 1))
            c[sun] = (1 - t)[:, None] * np.array(SUN_EDGE) + t[:, None] * np.array(SUN_CENTRE)
        return lin(c)

    col, peak, sun = gravity_image(x[box], y[box], tone)
    print(f"Earth's brightest line of sight N = {EARTH_PEAK:.4g}; the Sun's core up to {peak:.4g} "
          f"({peak / EARTH_PEAK:.2g} times)")
    img[box] = col

    (HERE / "build").mkdir(exist_ok=True)
    Image.fromarray((srgb(img) * 255 + 0.5).astype(np.uint8)).save(HERE / "build" / "art.png", dpi=(PX * 25.4,) * 2)
    print(f"wrote book/cover/build/art.png, {W} x {H} px; Sun's core drawn at {sun[0]:.3f}, {sun[1]:.3f} Earth radii")


if __name__ == "__main__":
    main()
