"""Draw the paper's figures for the PDF, and the new ones for the website too.

    python paper/figures/make_figures.py        (from the repository root)

Every figure is written twice: a vector PDF for LaTeX, and an SVG that the
website inlines, swapping the colours below for its theme's. Numbers come
from the reference implementation in reference/gravcam, not from the site.
The pictures rendered by the engine (*.jpg) are made by app/scripts/capture.mjs.

All text is typeset by LaTeX in Latin Modern, the paper's own typeface, so the
equations in a figure match those in the text. That needs latex, dvipng and
the cm-super fonts (on Debian: texlive-latex-extra, cm-super-minimal), and
poppler's pdftocairo for the SVG copies.
Before saving, each figure is checked: no text on top of other text or of a
line, arrow or marker; nothing off the edge; no curve cut off by its axes.
"""
from __future__ import annotations

import math
import re
import pathlib
import subprocess
import sys

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "reference"))

import matplotlib  # noqa: E402

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, Ellipse, FancyArrowPatch, Polygon, Rectangle, Wedge  # noqa: E402

from gravcam import columns, emission, resolution  # noqa: E402
from gravcam.scene import load_scene  # noqa: E402
from gravcam.waves import polarization  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent

# The site's light-theme ink. The website swaps exactly these values for its
# theme variables when it inlines an SVG, so keep to them.
INK = "#1c1a16"
DIM = "#5d5a52"
FAINT = "#8b877d"
ACCENT = "#b0560a"      # thermal, and the main curve
ACCENT2 = "#2a67ad"     # near field, and a second curve
RULE = "#c9c4b8"

WIDTH = 5.0             # inches: the text width of the paper
C = 299_792_458.0


def setup_fonts() -> None:
    """LaTeX and Latin Modern for every piece of text, as in the paper."""
    plt.rcParams.update({
        "text.usetex": True,
        "text.latex.preamble": r"\usepackage[T1]{fontenc}\usepackage{lmodern}\usepackage{amsmath,amssymb}",
        "font.family": "serif",
        "font.size": 8.5,
        "axes.labelsize": 8.5,
        "axes.titlesize": 9,
        "xtick.labelsize": 7.5,
        "ytick.labelsize": 7.5,
        "legend.fontsize": 7.5,
        "axes.edgecolor": INK,
        "axes.labelcolor": INK,
        "axes.linewidth": 0.6,
        "xtick.color": INK,
        "ytick.color": INK,
        "xtick.major.width": 0.6,
        "ytick.major.width": 0.6,
        "xtick.minor.width": 0.4,
        "ytick.minor.width": 0.4,
        "xtick.direction": "in",
        "ytick.direction": "in",
        "text.color": INK,
        "lines.linewidth": 1.2,
        "legend.frameon": False,
        "svg.fonttype": "path",
        "svg.hashsalt": "gravitational-camera",
        "savefig.transparent": True,
    })


class LayoutError(Exception):
    pass


def _text_boxes(fig, renderer):
    """Every piece of text that is drawn, as (description, box in pixels); a
    legend counts as one box."""
    from matplotlib.axis import Axis
    from matplotlib.legend import Legend
    from matplotlib.text import Text

    legends = list(fig.findobj(Legend))
    skip = {id(t) for lg in legends for t in lg.findobj(Text)}
    # tick labels exist for ticks outside the view too, but only these are drawn
    for axis in fig.findobj(Axis):
        if not axis.axes.axison or not axis.get_visible():
            skip.update(id(t) for t in axis.findobj(Text))
            continue
        drawn = {id(t) for tick in axis._update_ticks() for t in (tick.label1, tick.label2)}
        for tick in axis.get_major_ticks() + axis.get_minor_ticks():
            for t in (tick.label1, tick.label2):
                if id(t) not in drawn:
                    skip.add(id(t))
    boxes = [("legend", lg.get_window_extent(renderer)) for lg in legends]
    for t in fig.findobj(Text):
        if id(t) in skip or not t.get_visible() or not t.get_text().strip():
            continue
        # the text alone: an annotation's own extent also takes in its arrow
        boxes.append((repr(t.get_text()[:40]), Text.get_window_extent(t, renderer)))
    return boxes


def _ink(fig):
    """Points along every drawn line, arrow and patch edge, and around every
    marker, in pixels and clipped as drawn: a list of (description, points)."""
    from matplotlib.collections import PathCollection, PolyCollection
    from matplotlib.legend import Legend
    from matplotlib.patches import Patch

    legend_parts = {id(a) for lg in fig.findobj(Legend) for a in lg.findobj()}
    found = []

    def densify(xy, step=1.0):
        out = [xy[:1]]
        for a, b in zip(xy[:-1], xy[1:]):
            n = max(1, int(np.hypot(*(b - a)) / step))
            out.append(a + (b - a) * np.linspace(0, 1, n + 1)[1:, None])
        return np.concatenate(out)

    def add(artist, what, pts):
        if artist.get_clip_on() and artist.get_clip_box() is not None:
            box = artist.get_clip_box()
            keep = (pts[:, 0] >= box.x0 - 0.5) & (pts[:, 0] <= box.x1 + 0.5) & (pts[:, 1] >= box.y0 - 0.5) & (pts[:, 1] <= box.y1 + 0.5)
            pts = pts[keep]
        if len(pts):
            found.append((what, pts))

    ring = np.stack([np.cos(np.linspace(0, 2 * np.pi, 12)), np.sin(np.linspace(0, 2 * np.pi, 12))], 1)
    for ax in fig.axes:
        for line in ax.lines:
            if id(line) in legend_parts or not line.get_visible():
                continue
            xy = line.get_transform().transform(line.get_xydata())
            xy = xy[np.isfinite(xy).all(axis=1)]
            if len(xy) == 0:
                continue
            what = f"line {line.get_label()}"
            if line.get_linestyle() not in ("None", "", " ") and len(xy) > 1:
                add(line, what, densify(xy))
            if line.get_marker() not in ("None", None, "", " "):
                r = line.get_markersize() * fig.dpi / 72 / 2
                add(line, what + " markers", np.concatenate([(xy[:, None, :] + r * ring[None]).reshape(-1, 2), xy]))
        for patch in ax.patches:
            if id(patch) in legend_parts or not isinstance(patch, Patch):
                continue
            if patch.get_linewidth() == 0 and patch.get_facecolor()[3] < 0.5:
                continue        # a faint fill: text may sit on it, as on a shaded region
            path = patch.get_path().transformed(patch.get_transform())
            for poly in path.to_polygons(closed_only=False):
                if len(poly) > 1:
                    add(patch, type(patch).__name__, densify(np.asarray(poly)))
        for coll in ax.collections:
            if isinstance(coll, PathCollection) and len(coll.get_offsets()):
                add(coll, "points", coll.get_offset_transform().transform(coll.get_offsets()))
            elif isinstance(coll, PolyCollection) and np.max(coll.get_linewidths(), initial=0) > 0:
                for path in coll.get_paths():
                    add(coll, "polygon edge", densify(coll.get_transform().transform(path.vertices)))
        for child in ax.texts:
            arrow_patch = getattr(child, "arrow_patch", None)
            if arrow_patch is not None:
                path = arrow_patch.get_path()
                for poly in path.to_polygons(closed_only=False):
                    if len(poly) > 1:
                        found.append((f"leader of {child.get_text()[:40]!r}", densify(np.asarray(poly))))
    return found


def check_layout(fig, name):
    """No text on top of text, lines, arrows or markers; nothing outside the
    figure; no curve cut off by its axes."""
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    boxes = _text_boxes(fig, renderer)
    ink = _ink(fig)
    W, H = fig.bbox.width, fig.bbox.height
    problems = []
    for what, b in boxes:
        if b.x0 < -0.5 or b.y0 < -0.5 or b.x1 > W + 0.5 or b.y1 > H + 0.5:
            problems.append(f"{what} runs off the figure")
        shrunk = b.padded(-1.0)
        for where, pts in ink:
            if where == f"leader of {what}":
                continue        # a label's own leader starts at its edge
            inside = (pts[:, 0] > shrunk.x0) & (pts[:, 0] < shrunk.x1) & (pts[:, 1] > shrunk.y0) & (pts[:, 1] < shrunk.y1)
            if inside.any():
                problems.append(f"{what} lies on {where}")
    for i, (wa, a) in enumerate(boxes):
        for wb, b in boxes[i + 1:]:
            if a.padded(-0.5).overlaps(b.padded(-0.5)):
                problems.append(f"{wa} overlaps {wb}")
    for ax in fig.axes:
        if not ax.axison:
            continue
        (x0, x1), (y0, y1) = sorted(ax.get_xlim()), sorted(ax.get_ylim())
        for line in ax.lines:
            data = line.get_xydata()
            if len(data) < 3 or not line.get_clip_on() or line.get_transform() != ax.transData:
                continue
            xs, ys = data[:, 0], data[:, 1]
            ok = np.isfinite(ys) & np.isfinite(xs)
            out = (ys[ok] < y0 - 1e-9) | (ys[ok] > y1 + 1e-9) | (xs[ok] < x0 - 1e-9) | (xs[ok] > x1 + 1e-9)
            if out.any():
                problems.append(f"a curve ({line.get_label()}) is cut off by the axes")
    if problems:
        raise LayoutError(f"{name}:\n  " + "\n  ".join(dict.fromkeys(problems)))


def svg_from_pdf(name: str) -> None:
    """The website's copy, converted from the PDF by poppler so that it is the
    same drawing (matplotlib's own SVG of LaTeX text draws some maths symbols at
    the wrong size). Colours become the hex values above, which the site maps
    to its theme, and every id gets the figure's name, so that several figures
    can share one page."""
    pdf = OUT / f"{name}.pdf"
    svg = OUT / f"{name}.svg"
    subprocess.run(["pdftocairo", "-svg", str(pdf), str(svg)], check=True)
    text = svg.read_text(encoding="utf-8")

    def hex_colour(m):
        r, g, b = (round(float(v) * 2.55) for v in m.groups())
        return f"#{r:02x}{g:02x}{b:02x}"

    text = re.sub(r"rgb\(([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)%\)", hex_colour, text)
    text = re.sub(r'id="([^"]+)"', lambda m: f'id="{name}-{m.group(1)}"', text)
    text = re.sub(r'href="#([^"]+)"', lambda m: f'href="#{name}-{m.group(1)}"', text)
    text = re.sub(r"url\(#([^)]+)\)", lambda m: f"url(#{name}-{m.group(1)})", text)
    svg.write_text(text, encoding="utf-8")


def save(fig, name: str, web: bool = False) -> None:
    check_layout(fig, name)
    fig.savefig(OUT / f"{name}.pdf", metadata={"CreationDate": None, "ModDate": None})
    plt.close(fig)
    if web:
        svg_from_pdf(name)
    print(f"wrote {name}.pdf" + (" and .svg" if web else ""))


def bare(ax) -> None:
    ax.set_axis_off()
    ax.set_aspect("equal")


def arrow(ax, start, end, color=INK, width=0.8, head=5, both=False, z=3):
    """A straight arrow; `head` is the length of its head in points."""
    style = "<|-|>" if both else "-|>"
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle=f"{style},head_length={head:.2f},head_width={0.42 * head:.2f}",
                                 mutation_scale=1, color=color, lw=width, shrinkA=0, shrinkB=0, zorder=z))


def strain_arrows(ax, angle, out, inward, size=0.36, center=(0.0, 0.0)):
    """Outward arrows along `angle` (degrees) and inward ones across it, at the given radii."""
    a = math.radians(angle)
    u = np.array([math.cos(a), math.sin(a)])
    v = np.array([-u[1], u[0]])
    c = np.asarray(center)
    for s in (1, -1):
        arrow(ax, tuple(c + s * out * u), tuple(c + s * (out + size) * u))
        arrow(ax, tuple(c + s * (inward + size) * v), tuple(c + s * inward * v))


# --- Figure: what a pixel feels ------------------------------------------------

def tidal():
    # one drawing at one scale, so that the three rings and their captions line up
    fig, ax = plt.subplots(figsize=(WIDTH, 1.9))
    a = np.linspace(0, 2 * np.pi, 16, endpoint=False)
    t = np.linspace(0, 2 * np.pi, 200)

    def ring(cx, x, y, title, sub):
        ax.plot(cx + np.cos(t), np.sin(t), color=FAINT, lw=0.6, ls=(0, (2, 2)))
        ax.plot(cx + x(t), y(t), color=INK, lw=0.5, alpha=0.35)
        ax.plot(cx + x(a), y(a), "o", ms=2.6, color=INK, mec="none", zorder=4)
        ax.text(cx, -1.78, title, ha="center", va="top", fontsize=8.5)
        ax.text(cx, -2.18, sub, ha="center", va="top", fontsize=7.5, color=DIM)

    # beside a mass: stretched by 2 along the line to it, squeezed by 1 across
    e, h = 0.13, 0.3
    ring(0.0, lambda u: (1 + 2 * e) * np.cos(u), lambda u: (1 - e) * np.sin(u),
         r"near a mass $M$", r"$\mathcal{E}_{\parallel} = -2GM/r^3,\ \ \mathcal{E}_{\perp} = GM/r^3$")
    strain_arrows(ax, 0, 1 + 2 * e + 0.06, 1 - e + 0.08)
    ax.add_patch(Circle((-2.75, 0), 0.32, color=ACCENT, lw=0, zorder=4))
    ax.text(-2.75, -0.48, r"$M$", ha="center", va="top")
    ax.plot([-2.38, -1.78], [0, 0], color=FAINT, lw=0.5, ls=(0, (2, 2)))
    ax.text(-2.08, 0.1, r"$r$", ha="center", va="bottom", color=DIM)

    ring(4.3, lambda u: (1 + h / 2) * np.cos(u), lambda u: (1 - h / 2) * np.sin(u),
         r"wave, $h_{+}$", r"stretch and squeeze along $x$, $y$")
    strain_arrows(ax, 0, 1 + h / 2 + 0.06, 1 - h / 2 + 0.08, center=(4.3, 0))

    ring(8.4, lambda u: np.cos(u) + h / 2 * np.sin(u), lambda u: np.sin(u) + h / 2 * np.cos(u),
         r"wave, $h_{\times}$", r"the same, turned by $45^\circ$")
    strain_arrows(ax, 45, 1 + h / 2 + 0.06, 1 - h / 2 + 0.08, center=(8.4, 0))

    ax.text(2.8, 1.95, r"$\ddot\xi^{\,i} = -\mathcal{E}_{ij}\,\xi^{\,j}$", ha="center", va="top", fontsize=9)
    bare(ax)
    ax.set_xlim(-3.2, 10.0)
    ax.set_ylim(-2.6, 2.0)
    fig.subplots_adjust(left=0.0, right=1.0, top=1.0, bottom=0.0)
    save(fig, "tidal", web=True)


# --- Figure: the three regimes -------------------------------------------------

def regimes():
    fig, ax = plt.subplots(figsize=(WIDTH, 3.1))
    f0, f1, r0, r1 = 1e-7, 1e19, 1e-1, 1e12
    f = np.logspace(-7, 19, 300)
    edge = C / (2 * np.pi * f)
    ax.fill_between(f, r0, np.clip(edge, r0, r1), color=ACCENT2, alpha=0.10, lw=0)
    ax.fill_between(f, np.clip(edge, r0, r1), r1, color=ACCENT, alpha=0.10, lw=0)
    # the edge itself, only where it crosses the chart
    inside = np.logspace(math.log10(C / (2 * np.pi * r1)), math.log10(C / (2 * np.pi * r0)), 100)
    ax.plot(inside, C / (2 * np.pi * inside), color=INK, lw=0.9)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlim(f0, f1)
    ax.set_ylim(r0, r1)
    ax.set_xticks([1e-6, 1e-3, 1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18])
    ax.set_yticks([1e0, 1e3, 1e6, 1e9, 1e12])
    ax.minorticks_off()
    ax.set_xlabel(r"frequency of the source, $f$ (Hz)")
    ax.set_ylabel(r"distance from the camera, $r$ (m)")
    ax.text(3e-7, 4e-1, r"\textit{near field}", color=ACCENT2, fontsize=9)
    ax.text(6e18, 4e-1, r"\textit{wave zone}", color=ACCENT, fontsize=9, ha="right")
    ax.annotate(r"$r = c/2\pi f$: edge of the near zone", xy=(3e5, C / (2 * np.pi * 3e5)), xytext=(3e7, 3e4),
                fontsize=7.5, arrowprops=dict(arrowstyle="-", lw=0.5, color=DIM), color=INK)
    sources = [
        (10 ** -4.65, 10 ** 8.58, "the Moon's tide", (0, -9), "center", False),
        (10 ** -1.5, 1e6, "an earthquake's\ngravity signal", (-6, 0), "right", False),
        (10 ** -0.5, 10 ** 1.5, "a passing lorry", (-6, 0), "right", False),
        (1.0, 10 ** 0.5, "a person walking", (-6, 0), "right", False),
        (10 ** 1.5, 10 ** 0.18, "a calibration rotor at LIGO", (0, -9), "center", False),
        (10 ** 12.8, 10 ** 0.5, "a warm object\nin the room", (-6, 2), "right", True),
        (10 ** 14.0, 10 ** 6.5, "the Earth's interior", (-6, 0), "right", True),
        (10 ** 17.5, 10 ** 11.18, "the Sun's core", (-6, 0), "right", True),
    ]
    for fx, ry, label, (dx, dy), ha, thermal in sources:
        ax.plot(fx, ry, "o", ms=3.6, color=ACCENT if thermal else ACCENT2, mec="none")
        ax.annotate(label.replace("'", "’"), (fx, ry), xytext=(dx, dy), textcoords="offset points",
                    ha=ha, va="center", fontsize=7.5, linespacing=1.0)
    ax.annotate("", xy=(3e2, 9e11), xytext=(3e2, 1e10), arrowprops=dict(arrowstyle="-|>", lw=0.7, color=INK))
    ax.text(5e2, 2.5e10, "merging neutron stars,\n$10^{12}$ times farther", fontsize=7.5, va="center", linespacing=1.0)
    fig.subplots_adjust(left=0.12, right=0.98, top=0.98, bottom=0.14)
    save(fig, "regimes", web=True)


# --- Figure: the near-field blur, two masses under a row of pixels ------------

def nearfield():
    snr, sep = 1e6, 0.5
    u = np.linspace(-2.2, 2.2, 881)
    sources = (-sep / 2, sep / 2)
    rec = sum((1 - (u - c) ** 2) / ((u - c) ** 2 + 1) ** 2 for c in sources)
    rec = rec / rec.max()
    # the point-spread function of a row of sensors, tabulated once
    grid = np.linspace(0, 2.2 + sep, 1201)
    psf_values = resolution.psf(grid, snr, dims=1)
    psf_at = lambda x: np.interp(np.abs(x), grid, psf_values)  # noqa: E731
    rebuilt = sum(psf_at(u - c) for c in sources)
    rebuilt = rebuilt / rebuilt.max()
    fwhm = resolution.widths(snr, dims=1)["fwhm"]

    fig, (top, bottom) = plt.subplots(2, 1, figsize=(WIDTH, 2.95), sharex=True,
                                      gridspec_kw={"height_ratios": [1.25, 1], "hspace": 0.2})
    # (a) the geometry, to scale, and what the row records
    top.axhline(0.15, color=RULE, lw=0.5)
    top.fill_between(u, 0.15, 0.15 + 0.85 * rec, color=ACCENT2, alpha=0.12, lw=0)
    top.plot(u, 0.15 + 0.85 * rec, color=ACCENT2, lw=1.2)
    top.plot(np.linspace(-2.2, 2.2, 33), np.zeros(33), "s", ms=2.6, color=FAINT, mec="none")
    top.axhline(0, color=FAINT, lw=0.5)
    for c in sources:
        top.plot([c, c], [-1, 0], color=FAINT, lw=0.5, ls=(0, (2, 2)))
        top.plot([c], [-1], "o", ms=5, color=ACCENT, mec="none", zorder=4)
    top.annotate("", xy=(-1.9, 0), xytext=(-1.9, -1), arrowprops=dict(arrowstyle="<->", lw=0.5, color=DIM))
    top.text(-1.84, -0.5, r"$z$", va="center", color=DIM)
    top.text(sep / 2 + 0.1, -1, "two masses", va="center", fontsize=7.5)
    top.text(2.2, -0.12, "row of pixels", ha="right", va="top", fontsize=7.5, color=DIM)
    top.text(-2.2, 1.0, r"(a) recorded $\mathcal{E}_{zz}$", va="top", fontsize=8.5)
    top.set_ylim(-1.25, 1.05)
    top.set_axis_off()

    # (b) the Wiener reconstruction
    bottom.axhline(0, color=FAINT, lw=0.5)
    for c in sources:
        bottom.axvline(c, color=FAINT, lw=0.5, ls=(0, (2, 2)))
    bottom.plot(u, rebuilt, color=ACCENT, lw=1.2)
    x1 = 2.15
    bottom.plot([x1 - fwhm, x1], [0.78, 0.78], color=INK, lw=0.8)
    for x in (x1 - fwhm, x1):
        bottom.plot([x, x], [0.72, 0.84], color=INK, lw=0.8)
    bottom.text(x1, 0.9, rf"blur at $\mathrm{{SNR}}=10^6$: ${fwhm:.2f}\,z$", ha="right", va="bottom", fontsize=7.5)
    bottom.set_title("(b) the sharpest reconstruction the noise allows", loc="left", fontsize=8.5, pad=2)
    bottom.set_ylim(-0.5, 1.1)
    bottom.set_yticks([0, 0.5, 1])
    bottom.set_xlabel(r"position along the row, $x/z$")
    for side in ("top", "right"):
        bottom.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.07, right=0.99, top=0.99, bottom=0.13)
    save(fig, "nearfield", web=True)


# --- Figure (new): the exact resolution law ------------------------------------

def resolution_law():
    fig, (left, right) = plt.subplots(1, 2, figsize=(WIDTH, 2.25), gridspec_kw={"wspace": 0.32})
    q = np.logspace(-1, math.log10(400), 800)
    styles = [(3, INK, "-"), (6, ACCENT2, "-"), (20, ACCENT, "-"), (60, DIM, (0, (4, 2)))]
    for decades, color, ls in styles:
        snr = 10.0 ** decades
        left.plot(q, resolution.transfer(q, snr), color=color, ls=ls, lw=1.1, label=rf"$10^{{{decades}}}$")
        qc = resolution.cutoff(snr)
        left.plot([qc], [0.5], "o", ms=2.6, color=color, mec="none")
    left.set_xscale("log")
    left.set_xlim(0.1, 400)
    left.set_xticks([1, 10, 100])
    left.set_ylim(0, 1.06)
    left.axhline(0.5, color=RULE, lw=0.5, zorder=0)
    left.text(0.13, 0.53, r"$H = \frac{1}{2}$ at $kz = q_c$", fontsize=7.5, color=DIM, va="bottom")
    left.set_xlabel(r"spatial frequency, $kz$")
    left.set_ylabel(r"Wiener transfer, $H$")
    left.legend(title=r"$\mathrm{SNR}$", title_fontsize=7.5, loc="lower left", bbox_to_anchor=(0.0, 0.0),
                handlelength=1.6, labelspacing=0.2, borderaxespad=0.3)
    left.text(0.97, 0.97, "(a)", transform=left.transAxes, ha="right", va="top")

    study = __import__("json").loads((ROOT / "reference/results/near_field_resolution.json").read_text())
    rows = study["rows"]
    d = np.array([r["snr_decades"] for r in rows])
    deg = 180 / math.pi
    array = np.array([r["array"]["fwhm"] for r in rows]) * deg
    row = np.array([r["slice"]["fwhm"] for r in rows]) * deg
    dense = np.linspace(2, 100, 200)
    qcs = np.array([resolution.cutoff(10.0 ** x) for x in dense])
    lim = study["limits"]
    right.plot(dense, lim["array_fwhm_times_q_c"] / qcs * deg, color=INK, lw=1.0, label=r"array, $4.43/q_c$")
    right.plot(dense, lim["slice_fwhm_times_q_c"] / qcs * deg, color=ACCENT2, lw=1.0, label=r"row, $3.79/q_c$")
    right.plot(d, array, "o", ms=2.6, color=INK, mec="none")
    right.plot(d, row, "o", ms=2.6, color=ACCENT2, mec="none")
    right.plot(dense, math.pi / (dense * math.log(10)) * deg, color=ACCENT, ls=(0, (4, 2)), lw=1.0,
               label=r"estimate, $\pi/\ln\mathrm{SNR}$")
    right.set_xscale("log")
    right.set_yscale("log")
    right.set_xlim(2, 100)
    right.set_xticks([2, 5, 10, 20, 50, 100])
    right.set_xticklabels([rf"$10^{{{x}}}$" for x in (2, 5, 10, 20, 50, 100)])
    right.set_yticks([1, 2, 5, 10, 20, 50])
    right.set_yticklabels(["1°", "2°", "5°", "10°", "20°", "50°"])
    right.minorticks_off()
    right.set_xlabel(r"signal-to-noise ratio, $\mathrm{SNR}$")
    right.set_ylabel(r"blur, $\Delta\theta$ (FWHM)")
    right.legend(loc="lower left", handlelength=1.8, labelspacing=0.25)
    right.text(0.97, 0.97, "(b)", transform=right.transAxes, ha="right", va="top")
    for ax in (left, right):
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.1, right=0.97, top=0.97, bottom=0.2)
    save(fig, "resolution-law", web=True)


# --- Figure (new): the geometry of the sky integral ---------------------------

def sky_integral():
    fig, (left, right) = plt.subplots(1, 2, figsize=(WIDTH, 2.2), gridspec_kw={"width_ratios": [1.75, 1], "wspace": 0.05})
    ax = left
    # a body crossed by a thin cone of directions about n
    theta = math.radians(14)
    n = np.array([math.cos(theta), math.sin(theta)])
    perp = np.array([-n[1], n[0]])
    half = math.radians(4.5)
    blob_t = np.linspace(0, 2 * np.pi, 200)
    blob = np.stack([3.9 + 1.25 * np.cos(blob_t) + 0.12 * np.cos(3 * blob_t),
                     0.95 + 0.85 * np.sin(blob_t) + 0.08 * np.sin(2 * blob_t)], axis=1)
    ax.add_patch(Polygon(blob, closed=True, fc=ACCENT2, alpha=0.12, ec=ACCENT2, lw=0.7))
    ax.text(4.95, 1.95, r"$\rho(\mathbf{x})$", color=ACCENT2, fontsize=8.5)
    reach = 5.55
    for s in (-1, 1):
        d = np.array([math.cos(theta + s * half), math.sin(theta + s * half)])
        ax.plot([0, reach * d[0]], [0, reach * d[1]], color=INK, lw=0.6)
    # the shell element at distance r, thickness dr
    r, dr = 3.75, 0.32
    shell = Wedge((0, 0), r + dr, math.degrees(theta - half), math.degrees(theta + half), width=dr,
                  fc=ACCENT, ec=ACCENT, lw=0.4, alpha=0.85)
    ax.add_patch(shell)
    ax.annotate(r"$\mathrm{d}m = \rho\, r^{2}\, \mathrm{d}r\, \mathrm{d}\Omega$", xy=(r + dr / 2) * n + 0.05 * perp, xytext=(3.2, -1.15),
                fontsize=8.5, arrowprops=dict(arrowstyle="-", lw=0.5, color=DIM))
    # distance r along the lower edge of the cone
    lower = np.array([math.cos(theta - half), math.sin(theta - half)])
    off = -0.28 * np.array([-lower[1], lower[0]])
    ax.annotate("", xy=r * lower + off, xytext=off, arrowprops=dict(arrowstyle="<->", lw=0.5, color=DIM))
    ax.text(*(0.5 * r * lower + 1.6 * off), r"$r$", color=DIM, ha="center", va="center")
    arrow(ax, (0, 0), tuple(1.35 * n), head=6, width=0.9)
    ax.text(*(1.0 * n + 0.32 * perp), r"$\hat n$", ha="center", va="center")
    ax.text(*(2.0 * n + 0.18 * perp), r"$\mathrm{d}\Omega$", ha="center", va="bottom", fontsize=7.5, color=DIM)
    ax.add_patch(Rectangle((-0.17, -0.17), 0.34, 0.34, fc=INK, ec="none", zorder=5))
    ax.text(0, -0.38, "pixel", ha="center", va="top", fontsize=7.5)
    ax.text(0.35, 2.45, r"$\mathrm{d}\mathcal{E}_{ij} = \frac{G\,\mathrm{d}m}{r^{3}}\,(\delta_{ij} - 3\hat n_i\hat n_j)$", fontsize=8.5)
    ax.text(-0.35, -2.05, r"$\mathcal{E}_{ij} = G \int \mathrm{d}\Omega\,(\delta_{ij} - 3\hat n_i \hat n_j)\,S(\hat n),"
            r"\qquad S(\hat n) = \int \rho\,\frac{\mathrm{d}r}{r}$", fontsize=8.5)
    ax.set_xlim(-0.45, 6.3)
    ax.set_ylim(-2.3, 2.8)
    bare(ax)
    ax.text(-0.45, 2.8, "(a)", va="top")

    # the angular weight with which one component, E_zz, takes the sky
    ax = right
    t = np.linspace(0, 2 * np.pi, 721)
    w = 1 - 3 * np.cos(t) ** 2           # angle from the z axis (vertical)
    x, y = np.abs(w) * np.sin(t), np.abs(w) * np.cos(t)
    ax.fill(np.where(w < 0, x, 0), np.where(w < 0, y, 0), color=ACCENT, alpha=0.18, lw=0)
    ax.fill(np.where(w > 0, x, 0), np.where(w > 0, y, 0), color=ACCENT2, alpha=0.18, lw=0)
    ax.plot(np.where(w < 0, x, np.nan), np.where(w < 0, y, np.nan), color=ACCENT, lw=1.0)
    ax.plot(np.where(w > 0, x, np.nan), np.where(w > 0, y, np.nan), color=ACCENT2, lw=1.0)
    ax.plot([0, 0], [-2.25, 2.45], color=FAINT, lw=0.5, ls=(0, (2, 2)))
    ax.text(0.1, 2.5, r"$z$", va="top", color=DIM)
    ax.text(0.72, 1.3, "mass here\nstretches $z$", color=ACCENT, fontsize=7, linespacing=1.0)
    ax.text(0.8, -0.32, "mass here\nsqueezes $z$", color=ACCENT2, fontsize=7, va="top", linespacing=1.0)
    ax.text(0, -2.35, r"$\delta_{zz} - 3\hat n_z^{2} = 1 - 3\cos^{2}\vartheta$", ha="center", va="top", fontsize=8.5)
    ax.set_xlim(-1.7, 1.9)
    ax.set_ylim(-2.75, 2.6)
    bare(ax)
    ax.text(-1.6, 2.6, "(b)", va="top")
    fig.subplots_adjust(left=0.0, right=1.0, top=0.98, bottom=0.02)
    save(fig, "sky-integral", web=True)


# --- Figure: radiation from a spinning pair ------------------------------------

def quadrupole():
    fig, (left, right) = plt.subplots(1, 2, figsize=(WIDTH, 2.35), gridspec_kw={"width_ratios": [1, 1.3], "wspace": 0.25})
    ax = left
    t = np.linspace(0, 2 * np.pi, 721)
    p = (1 + 6 * np.cos(t) ** 2 + np.cos(t) ** 4) / 8
    ax.fill(p * np.sin(t), p * np.cos(t), color=ACCENT, alpha=0.12, lw=0)
    ax.plot(p * np.sin(t), p * np.cos(t), color=ACCENT, lw=1.1)
    ax.plot([0, 0], [-1.15, 1.15], color=FAINT, lw=0.5, ls=(0, (2, 2)))
    ax.add_patch(Ellipse((0, 0), 0.36, 0.1, fc="none", ec=DIM, lw=0.5))
    ax.plot([0.15, -0.15], [0.03, -0.03], "o", ms=2.6, color=INK, mec="none")
    # the angle from the axis
    io = math.radians(40)
    ax.plot([0, 0.95 * math.sin(io)], [0, 0.95 * math.cos(io)], color=INK, lw=0.5)
    arc = np.linspace(0, io, 30)
    ax.plot(0.42 * np.sin(arc), 0.42 * np.cos(arc), color=INK, lw=0.5)
    ax.text(0.2, 0.5, r"$\iota$", fontsize=8.5)
    # polarization marks: a turning arrow on the axis, a double arrow in the plane
    cx, cy, rr = 0.36, 1.02, 0.09
    arc = np.linspace(math.radians(-30), math.radians(230), 60)
    ax.plot(cx + rr * np.cos(arc), cy + rr * np.sin(arc), color=INK, lw=0.7)
    end = np.array([cx + rr * math.cos(arc[0]), cy + rr * math.sin(arc[0])])
    tangent = np.array([math.sin(arc[0]), -math.cos(arc[0])])
    normal = np.array([math.cos(arc[0]), math.sin(arc[0])])
    ax.add_patch(Polygon([end + 0.07 * tangent, end + 0.035 * normal, end - 0.035 * normal], closed=True, fc=INK, ec="none"))
    ax.text(cx + 0.15, cy, "circular", va="center", fontsize=7.5)
    arrow(ax, (0.55, -0.13), (0.55, 0.13), both=True, head=3.5, width=0.7)
    ax.text(0.62, 0, r"linear, $\frac{1}{8}$", va="center", fontsize=7.5)
    ax.text(0, -1.25, r"$\frac{\mathrm{d}P}{\mathrm{d}\Omega} \propto \frac{1 + 6\cos^{2}\iota + \cos^{4}\iota}{8}$", ha="center", va="top", fontsize=8.5)
    ax.set_xlim(-1.0, 1.05)
    ax.set_ylim(-1.62, 1.18)
    bare(ax)
    ax.text(-1.0, 1.18, "(a)", va="top")

    ax = right
    v = np.logspace(-1, math.log10(C), 200)
    ax.plot(v, (math.pi / 2) * C / v, color=INK, lw=1.1)
    ax.axhline(1, color=RULE, lw=0.5)
    ax.axvspan(0.3, 300, color=ACCENT2, alpha=0.08, lw=0)
    ax.text(10, 3e3, "everyday\nspeeds", ha="center", fontsize=7.5, color=ACCENT2, linespacing=1.0)
    ax.text(2e6, 2.4, r"$\lambda = d$", fontsize=7.5, color=DIM)
    vv = 32.0
    ax.plot([vv], [(math.pi / 2) * C / vv], "o", ms=3, color=ACCENT, mec="none")
    ax.annotate(r"$32\,\mathrm{m/s}$: $\lambda \approx 1.5\times10^{7}\,d$", (vv, (math.pi / 2) * C / vv), xytext=(8, 4),
                textcoords="offset points", fontsize=7.5)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlim(0.1, C)
    ax.set_ylim(0.5, 1e10)
    ax.set_xticks([1e-1, 1e1, 1e3, 1e5, 1e7])
    ax.set_yticks([1, 1e2, 1e4, 1e6, 1e8, 1e10])
    ax.minorticks_off()
    ax.set_xlabel(r"speed of the moving parts, $v$ (m/s)")
    ax.set_ylabel(r"$\lambda/d = \frac{\pi}{2}\,c/v$")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.text(0.97, 0.97, "(b)", transform=ax.transAxes, ha="right", va="top")
    fig.subplots_adjust(left=0.0, right=0.99, top=0.98, bottom=0.17)
    save(fig, "quadrupole", web=True)


# --- Figure (new): polarization against inclination ---------------------------

def polarization_curves():
    fig, ax = plt.subplots(figsize=(WIDTH * 0.7, 2.1))
    iota = np.linspace(0, 180, 361)
    values = [polarization(math.cos(math.radians(x))) for x in iota]
    ax.axhline(0, color=RULE, lw=0.5)
    ax.plot(iota, [p["a_plus"] for p in values], color=ACCENT, lw=1.1, label=r"$h_+/A = (1+\cos^{2}\iota)/2$")
    ax.plot(iota, [p["a_cross"] for p in values], color=ACCENT2, lw=1.1, label=r"$h_\times/A = \cos\iota$")
    ax.plot(iota, [p["circular"] for p in values], color=INK, lw=1.1, ls=(0, (4, 2)), label=r"$V/I$")
    ax.set_xlim(0, 180)
    ax.set_ylim(-1.08, 1.08)
    ax.set_xticks([0, 45, 90, 135, 180])
    ax.set_xticklabels(["0°\ntoward", "45°", "90°\nedge-on", "135°", "180°\naway"])
    ax.set_yticks([-1, 0, 1])
    ax.set_xlabel(r"angle between the spin and the direction of the camera, $\iota$")
    ax.legend(loc="lower left", handlelength=1.8, labelspacing=0.25)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.1, right=0.93, top=0.97, bottom=0.3)
    save(fig, "polarization", web=True)


# --- Figure: light stops at the first surface, gravity adds up ----------------

def line_integral():
    fig, ax = plt.subplots(figsize=(WIDTH, 1.5))
    rows = {"light": 1.7, "gravity": 0.0}
    bodies = [("slab", 2.0, 0.26), ("ball", 3.6, 0.4), ("ball", 5.4, 0.55)]
    labels = [(r"$j_1$", r"$\ell_1$"), (r"$j_2$", r"$\ell_2$"), (r"$j_3$", r"$\ell_3$")]
    for name, y in rows.items():
        ax.add_patch(Rectangle((-0.16, y - 0.16), 0.32, 0.32, fc=INK, ec="none", zorder=5))
        ax.text(-0.35, y, name, ha="right", va="center", fontsize=8.5)
        for kind, x, size in bodies:
            alpha = 0.55 if name == "light" and kind == "slab" else 0.16
            if kind == "slab":
                ax.add_patch(Rectangle((x - size / 2, y - 0.55), size, 1.1, fc=DIM if name == "light" else ACCENT,
                                       alpha=alpha, ec="none"))
            else:
                ax.add_patch(Circle((x, y), size, fc=ACCENT, alpha=alpha, ec="none"))
    y = rows["light"]
    ax.plot([0.16, 2.0 - 0.14], [y, y], color=INK, lw=0.8)
    ax.plot([2.0 - 0.14], [y], "o", ms=3.2, color=ACCENT2, mec="none", zorder=6)
    ax.text(6.95, y, r"$I(\hat n)$ = the first surface", va="center", fontsize=8.5)
    y = rows["gravity"]
    ax.plot([0.16, 6.6], [y, y], color=INK, lw=0.8)
    arrow(ax, (6.45, y), (6.7, y), head=5)
    for (kind, x, size), (j, ell) in zip(bodies, labels):
        half = size / 2 if kind == "slab" else size
        ax.plot([x - half, x + half], [y, y], color=ACCENT, lw=3.0, solid_capstyle="butt")
        ax.text(x, y + (0.6 if kind == "slab" else size + 0.06), j, ha="center", va="bottom", fontsize=8.5, color=ACCENT)
        ax.text(x, y - 0.12, ell, ha="center", va="top", fontsize=8.5)
    ax.text(6.95, y, r"$N(\hat n) = \int j_N\,\mathrm{d}l = \sum_k j_k\,\ell_k$", va="center", fontsize=8.5)
    ax.set_xlim(-1.3, 10.9)
    ax.set_ylim(-0.85, 2.4)
    bare(ax)
    fig.subplots_adjust(left=0.0, right=1.0, top=1.0, bottom=0.0)
    save(fig, "line-integral", web=True)


# --- Figure (new): the thermal glow of the Earth's interior ---------------------

def earth_glow():
    scene = load_scene(ROOT / "scenes" / "sun-at-midnight.scene.json")
    angle = np.linspace(0, 89.5, 720)                      # from straight down
    a = np.radians(angle)
    directions = np.stack([np.sin(a), -np.cos(a), np.zeros_like(a)], axis=1)   # a plane clear of the Sun
    paths = columns.own_region_paths(scene, directions)
    j = emission.number_emissivities(scene)
    layers = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]
    names = ["crust, 700 K", "upper mantle, 1700 K", "lower mantle, 2800 K", "outer core, 4500 K", "inner core, 5500 K"]
    parts = [paths[:, scene.index(k)] * j[scene.index(k)] for k in layers]
    total = np.sum(parts, axis=0)
    assert np.allclose(total, columns.number_radiance(scene, directions), rtol=1e-9)

    fig, ax = plt.subplots(figsize=(WIDTH, 2.2))
    shades = [0.10, 0.18, 0.28, 0.45, 0.7]
    base = np.zeros_like(angle)
    unit = 1e-5
    for part, name, alpha in zip(reversed(parts), reversed(names), reversed(shades)):
        ax.fill_between(angle, base / unit, (base + part) / unit, color=ACCENT, alpha=alpha, lw=0, label=name)
        base = base + part
    total = total / unit
    ax.plot(angle, total, color=ACCENT, lw=1.1)
    radius = 6371000.0
    for r, label in ((3480000.0, "core"), (1221500.0, "inner core")):
        edge = math.degrees(math.asin(r / (radius + 2)))
        ax.axvline(edge, color=FAINT, lw=0.5, ls=(0, (2, 2)))
        ax.text(edge + 0.8, total.max() * 1.1, label, fontsize=7, color=DIM, va="top")
    ax.set_xlim(0, 90)
    ax.set_ylim(0, total.max() * 1.15)
    ax.set_xticks([0, 15, 30, 45, 60, 75, 90])
    ax.set_xticklabels(["0°", "15°", "30°", "45°", "60°", "75°", "90°"])
    ax.set_xlabel("angle of the line of sight from straight down")
    ax.set_ylabel(r"$N$ ($10^{-5}$ s$^{-1}$ m$^{-2}$ sr$^{-1}$)")
    handles, labels = ax.get_legend_handles_labels()
    ax.legend(handles[::-1], labels[::-1], loc="upper right", handlelength=1.2, labelspacing=0.2)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.08, right=0.97, top=0.97, bottom=0.2)
    save(fig, "earth-glow", web=True)


# --- Figure: how sharply a camera tells directions apart ----------------------

def array():
    from scipy.special import j1

    fig, ax = plt.subplots(figsize=(WIDTH, 2.15))
    g = np.linspace(-90, 90, 1441)
    c = np.cos(np.radians(g))
    legendre = [np.ones_like(c), c, (3 * c**2 - 1) / 2, (5 * c**3 - 3 * c) / 2, (35 * c**4 - 30 * c**2 + 3) / 8]
    single = sum((2 * l + 1) * p for l, p in enumerate(legendre)) / 25

    def airy(d):
        x = np.pi * d * np.sin(np.radians(g))
        safe = np.where(np.abs(x) < 1e-9, 1.0, x)
        return np.where(np.abs(x) < 1e-9, 1.0, (2 * j1(safe) / safe) ** 2)

    def fwhm(curve):
        above = g[(curve >= 0.5) & (g >= 0)]
        return 2 * above.max()

    curves = [(single, "one pixel", DIM, (0, (4, 2))), (airy(2), r"$D = 2\lambda$", ACCENT2, "-"),
              (airy(5), r"$D = 5\lambda$", INK, "-"), (airy(30), r"$D = 30\lambda$", ACCENT, "-")]
    ax.axhline(0, color=RULE, lw=0.5)
    for curve, name, color, ls in curves:
        ax.plot(g, curve, color=color, ls=ls, lw=1.1, label=f"{name}: {fwhm(curve):.0f}°" if fwhm(curve) >= 10
                else f"{name}: {fwhm(curve):.1f}°")
    ax.set_xlim(-90, 90)
    ax.set_ylim(-0.3, 1.05)
    ax.set_xticks([-90, -60, -30, 0, 30, 60, 90])
    ax.set_xticklabels([f"${a}^\\circ$" for a in (-90, -60, -30, 0, 30, 60, 90)])
    ax.set_yticks([0, 0.5, 1])
    ax.set_xlabel("angle away from the source")
    ax.set_ylabel("response")
    ax.legend(title="width at half height", title_fontsize=7.5, loc="upper right", handlelength=1.8, labelspacing=0.25)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.09, right=0.97, top=0.97, bottom=0.2)
    save(fig, "array", web=True)


# --- Figure: the graviton budget ------------------------------------------------

def budget():
    rows = [
        ("The Sun", 2.1e23, True),
        ("The Earth's interior (assumed friction)", 5.2e10, True),
        ("490-tonne steel beam, spun to breaking", 3.8e3, False),
        ("Two 1-tonne masses, 48 turns a second", 8.1, False),
        ("Two 1-kg masses, 16 turns a second", 2.1e-9, False),
        ("A person", 1.6e-15, True),
        ("A litre of boiling water", 3.9e-17, True),
    ]
    fig, ax = plt.subplots(figsize=(WIDTH, 2.3))
    y = np.arange(len(rows))[::-1]
    lo = 1e-19
    for (name, rate, thermal), yy in zip(rows, y):
        ax.barh(yy, rate - lo, left=lo, height=0.55, color=ACCENT if thermal else ACCENT2, alpha=0.85, lw=0)
    ax.set_yticks(y)
    ax.set_yticklabels([r[0].replace("'", "’") for r in rows], fontsize=7)
    ax.tick_params(axis="y", length=0)
    ax.set_xscale("log")
    ax.set_xlim(lo, 1e25)
    ax.set_xticks([1e-18, 1e-12, 1e-6, 1, 1e6, 1e12, 1e18, 1e24])
    ax.minorticks_off()
    ax.set_xlabel("gravitons emitted per second, by the whole object")
    marks = ((1 / 4.35e17, "one in the age\nof the universe"), (1 / 3.156e7, "one a\nyear"), (1.0, "one a\nsecond"))
    for value, _ in marks:
        ax.axvline(value, color=FAINT, lw=0.5, ls=(0, (2, 2)))
    top = ax.secondary_xaxis("top")
    top.set_xticks([m[0] for m in marks])
    top.set_xticklabels([m[1] for m in marks], fontsize=6.5, color=DIM, linespacing=1.0)
    top.tick_params(length=0, pad=2)
    top.spines["top"].set_visible(False)
    ax.plot([], [], "s", color=ACCENT, ms=5, label="thermal glow")
    ax.plot([], [], "s", color=ACCENT2, ms=5, label="bulk motion")
    ax.legend(loc="lower right", handlelength=0.8)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.set_ylim(-0.6, len(rows) - 0.3)
    fig.subplots_adjust(left=0.43, right=0.97, top=0.88, bottom=0.18)
    save(fig, "budget", web=True)


def main() -> int:
    setup_fonts()
    for draw in (tidal, regimes, sky_integral, nearfield, resolution_law, quadrupole, polarization_curves,
                 line_integral, earth_glow, array, budget):
        draw()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
