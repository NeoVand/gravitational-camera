"""Cut the bodies of the `hair` figure out of the image model's sheets.

    .venv/bin/python design/hair_sprites.py [--sheet out.png]

The sheets are drawn by design/imagegen.py from design/prompts/hair-sprites.json, twice (run1, run2), into
design/candidates/hair-sprites/ (not committed): A, three balls cut open; B, their three sawn faces seen face-on;
C, a stone cut open. PICK says which run each piece is taken from. Each piece is found by its silhouette against
the white, and redrawn in polar coordinates about its centre so that its outline becomes an exact circle of
RADIUS pixels (the model draws its spheres a few per cent taller than wide), on a transparent background. The
sawn faces are also made exact inside, whatever the model drew: the ring's skin is brought to run from
SHELL_INNER of the radius to the rim; the rock of the third face is carried in under its core (the model's rock
where there is some, and under the model's too large core the same tone with the grain of the first face), and
its core is cut as a separate patch of metal, core-metal.png. Every sprite's ink runs GROW pixels past its exact
edge: the figure (figures3d/figs/hair.js) clips each to its own exact circle, so its edges are the figure's, in
vector. The cut sprites go to figures3d/sprites/hair/.
"""
from __future__ import annotations

import argparse
import pathlib

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, gaussian_filter1d, map_coordinates, median_filter

ROOT = pathlib.Path(__file__).resolve().parent
SHEETS = ROOT / "candidates" / "hair-sprites"
OUT = ROOT.parent / "figures3d" / "sprites" / "hair"

SHELL_INNER = 0.92      # as in figures3d/figs/hair.js
CORE_RADIUS = 0.4
RADIUS = 180            # pixels: a body 54 pt across is then drawn at 480 dots per inch
MARGIN = 4              # pixels of canvas around the exact circle (figures3d/figs/hair.js knows this number)
ANGLES = 1440
EDGE = 1.5              # pixels of each edge left out: where the model's ink is mixed with the white
SEAM = 4.0              # the same at the core's edge, where the model drew a groove
GROW = 2.0              # pixels of ink past each exact edge, for the figure's clip to cut
METAL = 0.46            # the patch of the core's metal reaches this far, in units of the radius

# Both runs were clean (no text, no stray marks, no shadow on the ground). All pieces are taken from run1: its
# three balls are of one size to the pixel and more softly lit (run2's differ by one per cent and are flatter);
# its sawn faces are of the same sand as those balls (run2's are yellower); its stone is rounder (run2's is five
# per cent taller than wide, with a lumpier outline).
#        name          run     sheet  place in the row, kind
PICK = {
    "ball":       ("run1", "A", 0, "body"),
    "shell":      ("run1", "A", 1, "body"),
    "core":       ("run1", "A", 2, "body"),
    "ball-face":  ("run1", "B", 0, "body"),
    "shell-face": ("run1", "B", 1, "ring"),
    "core-face":  ("run1", "B", 2, "core"),
    "stone":      ("run1", "C", 0, "body"),
}
COUNT = {"A": 3, "B": 3, "C": 1}


def darkness(a: np.ndarray) -> np.ndarray:
    """How far a pixel is from white: 0 on the background."""
    return 255.0 - a.min(axis=2)


def isolate(sheet: Image.Image, index: int, count: int, pad: int = 40) -> np.ndarray:
    """The piece alone on white: the index-th of the `count` widest runs of inked columns."""
    a = np.asarray(sheet.convert("RGB")).astype(float)
    ink = darkness(a) > 18
    cols = ink.sum(axis=0) > 3
    edges = np.flatnonzero(np.diff(np.r_[0, cols.astype(int), 0]))
    runs = sorted(sorted(zip(edges[::2], edges[1::2]), key=lambda r: r[0] - r[1])[:count])
    x0, x1 = runs[index]
    rows = np.flatnonzero(ink[:, x0:x1].sum(axis=1) > 3)
    y0, y1 = rows[0], rows[-1] + 1
    out = np.full((y1 - y0 + 2 * pad, x1 - x0 + 2 * pad, 3), 255.0)
    out[pad:-pad, pad:-pad] = a[y0:y1, x0:x1]
    return out


def rays(field: np.ndarray, centre, rmax: float, step: float = 0.25):
    th = np.arange(ANGLES) * 2 * np.pi / ANGLES
    rr = np.arange(0, rmax, step)
    x = centre[0] + np.outer(np.cos(th), rr)
    y = centre[1] - np.outer(np.sin(th), rr)
    return th, rr, map_coordinates(field, [y, x], order=1, mode="nearest")


def crossing(rr, values, level, outermost: bool, rising: bool = True) -> np.ndarray:
    """Along each ray, the radius at which `values` crosses `level`: the first from the centre, or the last."""
    above = values > level if rising else values < level
    out = np.empty(len(values))
    for k, row in enumerate(above):
        idx = np.flatnonzero(row)
        i = idx[-1] if outermost else idx[0]
        j = min(i + 1, len(rr) - 1) if outermost else max(i - 1, 0)
        v0, v1 = values[k, i], values[k, j]
        t = 0.0 if v0 == v1 else (v0 - level) / (v0 - v1)
        out[k] = rr[i] + (rr[j] - rr[i]) * min(1.0, max(0.0, t))
    return gaussian_filter1d(median_filter(out, size=15, mode="wrap"), 4, mode="wrap")


def centre_of(a: np.ndarray):
    ink = darkness(a) > 45
    # the middle of the outline (a ring has no ink at its centre, and a cut ball's ink is not even)
    rows = np.flatnonzero(ink.sum(axis=1) > 3)
    cols = np.flatnonzero(ink.sum(axis=0) > 3)
    return (cols[0] + cols[-1] + 1) / 2, (rows[0] + rows[-1] + 1) / 2


def sample(a: np.ndarray, c, src: np.ndarray, phi: np.ndarray) -> np.ndarray:
    sx, sy = c[0] + src * np.cos(phi), c[1] - src * np.sin(phi)
    return np.stack([map_coordinates(a[:, :, k], [sy, sx], order=3, mode="nearest") for k in range(3)], axis=2)


def cut(name: str, run: str, letter: str, index: int, kind: str, grain: np.ndarray | None = None):
    a = isolate(Image.open(SHEETS / run / f"{letter}.png"), index, COUNT[letter])
    # bring the piece to about the size it will have, so that the redrawing below is nearly one to one
    c = centre_of(a)
    _, rr, d = rays(darkness(a), c, 0.75 * max(a.shape[:2]))
    scale = RADIUS / crossing(rr, d, 45, True).mean()
    size = (round(a.shape[1] * scale), round(a.shape[0] * scale))
    a = np.asarray(Image.fromarray(a.astype(np.uint8)).resize(size, Image.LANCZOS)).astype(float)
    c = centre_of(a)
    th, rr, d = rays(darkness(a), c, 0.75 * max(a.shape[:2]))
    ro = crossing(rr, d, 45, True)
    note = {"semi-axes": (round((ro[0] + ro[ANGLES // 2]) / 2, 1), round((ro[ANGLES // 4] + ro[3 * ANGLES // 4]) / 2, 1))}

    n = 2 * (RADIUS + MARGIN)
    yy, xx = np.mgrid[0:n, 0:n] + 0.5 - n / 2
    rho = np.hypot(xx, yy) / RADIUS
    phi = np.mod(np.arctan2(-yy, xx), 2 * np.pi)
    at = lambda r: np.interp(phi, np.r_[th, 2 * np.pi], np.r_[r, r[0]])   # an outline, at each pixel's angle
    outer = at(ro) - EDGE
    if kind == "body":
        src = np.clip(rho, 0, 1) * outer
        alpha_in = None
    elif kind == "ring":
        ri = crossing(rr, d, 45, False)
        note["inner over outer"] = (round(float((ri / ro).mean()), 3), round(float((ri / ro).min()), 3), round(float((ri / ro).max()), 3))
        inner = at(ri) + EDGE
        t = np.clip((rho - SHELL_INNER) / (1 - SHELL_INNER), 0, 1)
        src = inner + t * (outer - inner)
        alpha_in = SHELL_INNER
    elif kind == "core":
        lum = a.mean(axis=2)
        _, _, values = rays(lum, c, 0.75 * max(a.shape[:2]))
        dark, pale = np.percentile(values[:, : int(0.3 * RADIUS / 0.25)], 50), np.percentile(values[:, int(0.7 * RADIUS / 0.25): int(0.9 * RADIUS / 0.25)], 50)
        rc = crossing(rr, values, (dark + pale) / 2, False)
        note["core over outer"] = (round(float((rc / ro).mean()), 3), round(float((rc / ro).min()), 3), round(float((rc / ro).max()), 3))
        core = at(rc)
        src = np.clip(rho, 0, 1) * outer
        alpha_in = None
    rgb = sample(a, c, src, phi)
    extra = {}
    if kind == "core":
        # the rock: the model's own outside its core; under the core, the rock's tone carried inward along each
        # radius, with the grain of the first face (`grain`, already cut, of the same size and lighting)
        edge = (core + SEAM) / outer                                  # where the model's rock begins
        valid = (rho >= edge).astype(float)
        blur = lambda x: gaussian_filter(x, 7)
        tone = np.stack([blur(rgb[:, :, k] * valid) for k in range(3)], axis=2) / np.maximum(blur(valid), 1e-3)[:, :, None]
        hold = np.maximum(rho, edge + 0.07)                           # the tone at a little way into the rock
        hx, hy = n / 2 + hold * RADIUS * np.cos(phi) - 0.5, n / 2 - hold * RADIUS * np.sin(phi) - 0.5
        tone = np.stack([map_coordinates(tone[:, :, k], [hy, hx], order=1, mode="nearest") for k in range(3)], axis=2)
        fine = grain - np.stack([blur(grain[:, :, k]) for k in range(3)], axis=2)
        own = rgb - np.stack([blur(rgb[:, :, k] * valid) for k in range(3)], axis=2) / np.maximum(blur(valid), 1e-3)[:, :, None]
        ring = (rho > edge + 0.1) & (rho < 0.85)
        gain = own[ring].std() / fine[ring].std()
        note["grain borrowed at"] = round(float(gain), 2)
        w = np.clip((rho - edge - 0.02) / 0.08, 0, 1)
        w = (w * w * (3 - 2 * w))[:, :, None]
        rgb = w * rgb + (1 - w) * (tone + gain * fine)
        # the core: the model's metal, shrunk evenly so that its edge would fall at CORE_RADIUS, and carried on
        # past that edge so that the figure's clip cuts into metal
        m = round(METAL * RADIUS)
        metal = sample(a, c, np.minimum(rho / CORE_RADIUS, 1) * (core - SEAM), phi)[n // 2 - m: n // 2 + m, n // 2 - m: n // 2 + m]
        extra["core-metal"] = np.dstack([np.clip(metal, 0, 255), np.full(metal.shape[:2], 255.0)]).round().astype(np.uint8)
    # the edge: one pixel of ramp, GROW pixels outside the exact circle
    alpha = np.clip((1 - rho) * RADIUS + GROW + 0.5, 0, 1)
    if alpha_in is not None:
        alpha *= np.clip((rho - alpha_in) * RADIUS + GROW + 0.5, 0, 1)
    rgb[alpha == 0] = 255                                             # nothing to store where nothing shows
    out = np.dstack([np.clip(rgb, 0, 255), 255 * alpha]).round().astype(np.uint8)
    OUT.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out, "RGBA").save(OUT / f"{name}.png", optimize=True)
    for other, im in extra.items():
        Image.fromarray(im, "RGBA").save(OUT / f"{other}.png", optimize=True)
    note["outline, least over greatest"] = round(float(ro.min() / ro.max()), 3)
    return out, note, extra


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheet", type=pathlib.Path, help="also write the cut sprites side by side, on white and on grey")
    args = ap.parse_args()
    cuts = {}
    for name, (run, letter, index, kind) in PICK.items():
        grain = cuts["ball-face"][:, :, :3].astype(float) if kind == "core" else None
        cuts[name], note, extra = cut(name, run, letter, index, kind, grain)
        print(f"{name:11s} from {run}/{letter}, piece {index + 1}: {note}  ({(OUT / (name + '.png')).stat().st_size // 1024} kB)")
        for other, im in extra.items():
            big = np.zeros_like(cuts[name]); k = (big.shape[0] - im.shape[0]) // 2
            big[k:k + im.shape[0], k:k + im.shape[1]] = im
            cuts[other] = big
    if args.sheet:
        n = 2 * (RADIUS + MARGIN)
        sheet = Image.new("RGB", (len(cuts) * (n + 20) + 20, 2 * (n + 20) + 20), "white")
        sheet.paste((120, 120, 124), (0, n + 30, sheet.width, sheet.height))
        for k, im in enumerate(cuts.values()):
            piece = Image.fromarray(im, "RGBA")
            for row in (0, 1):
                sheet.paste(piece, (20 + k * (n + 20), 20 + row * (n + 20)), piece)
        sheet.save(args.sheet)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
