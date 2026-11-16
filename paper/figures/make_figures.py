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
import os
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

# Physical Review D, two columns: figures are one column wide, or span both
COL = 3.4               # inches: the width of a column
FULL = 7.0              # inches: the width of the page's text
WIDTH = FULL
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
        report = f"{name}:\n  " + "\n  ".join(dict.fromkeys(problems))
        if os.environ.get("FIGURES_DRAFT"):       # save anyway, to look at while fixing
            print(report)
            return
        raise LayoutError(report)


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
    # one drawing at one scale, so that the three rings and their captions line
    # up; the figure has the drawing's proportions, so circles stay round
    fig, ax = plt.subplots(figsize=(FULL, FULL * 4.6 / 13.2))
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
    fig, ax = plt.subplots(figsize=(COL, 2.6))
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
    ax.set_xticks([1e-6, 1, 1e6, 1e12, 1e18])
    ax.set_yticks([1e0, 1e3, 1e6, 1e9, 1e12])
    ax.minorticks_off()
    ax.tick_params(labelsize=7)
    ax.set_xlabel(r"frequency of the source, $f$ (Hz)", fontsize=7.5)
    ax.set_ylabel(r"distance, $r$ (m)", fontsize=7.5)
    ax.text(2e-7, 1e3, r"\textit{near field}", color=ACCENT2, fontsize=8.5, va="center")
    ax.text(6e18, 1e3, r"\textit{wave zone}", color=ACCENT, fontsize=8.5, ha="right", va="center")
    ax.annotate(r"$r = c/2\pi f$", xy=(3e5, C / (2 * np.pi * 3e5)), xytext=(3e7, 3e4),
                fontsize=7, arrowprops=dict(arrowstyle="-", lw=0.5, color=DIM), color=INK, va="center")
    sources = [
        (10 ** -4.65, 10 ** 8.58, "the Moon's tide", (0, -8), "center", False),
        (10 ** -1.5, 1e6, "an earthquake's\ngravity signal", (0, -10), "center", False),
        (10 ** -0.5, 10 ** 1.5, "a passing lorry", (-5, 0), "right", False),
        (1.0, 10 ** 0.5, "a person walking", (-5, 0), "right", False),
        (10 ** 1.5, 10 ** 0.18, "LIGO's calibration rotor", (0, -7), "center", False),
        (10 ** 12.8, 10 ** 0.5, "a warm object\nin the room", (5, 0), "left", True),
        (10 ** 14.0, 10 ** 6.5, "the Earth's interior", (-5, 0), "right", True),
        (10 ** 17.5, 10 ** 11.18, "the Sun's core", (-5, 0), "right", True),
    ]
    for fx, ry, label, (dx, dy), ha, thermal in sources:
        ax.plot(fx, ry, "o", ms=3.2, color=ACCENT if thermal else ACCENT2, mec="none")
        ax.annotate(label.replace("'", "’"), (fx, ry), xytext=(dx, dy), textcoords="offset points",
                    ha=ha, va="center", fontsize=6.5, linespacing=1.0)
    ax.annotate("", xy=(3e4, 9e11), xytext=(3e4, 1e10), arrowprops=dict(arrowstyle="-|>", lw=0.7, color=INK))
    ax.text(3e4, 5e9, "neutron stars merging,\n$10^{12}$ times farther", fontsize=6.5, ha="center", va="top",
            linespacing=1.0)
    fig.subplots_adjust(left=0.15, right=0.97, top=0.98, bottom=0.15)
    save(fig, "regimes", web=True)


# --- Figure: the near-field blur, two masses under a row of pixels ------------

def nearfield():
    snr, sep = 1e6, 0.5
    u = np.linspace(-3.6, 3.6, 1441)
    sources = (-sep / 2, sep / 2)
    rec = sum((1 - (u - c) ** 2) / ((u - c) ** 2 + 1) ** 2 for c in sources)
    rec = rec / rec.max()
    # the point-spread function of a row of sensors, tabulated once
    grid = np.linspace(0, 3.6 + sep, 1801)
    psf_values = resolution.psf(grid, snr, dims=1)
    psf_at = lambda x: np.interp(np.abs(x), grid, psf_values)  # noqa: E731
    rebuilt = sum(psf_at(u - c) for c in sources)
    rebuilt = rebuilt / rebuilt.max()
    fwhm = resolution.widths(snr, dims=1)["fwhm"]

    fig, (top, bottom) = plt.subplots(2, 1, figsize=(COL, 2.6), sharex=True,
                                      gridspec_kw={"height_ratios": [1.25, 1], "hspace": 0.2})
    # (a) the geometry, to scale, and what the row records
    top.axhline(0.15, color=RULE, lw=0.5)
    top.fill_between(u, 0.15, 0.15 + 0.85 * rec, color=ACCENT2, alpha=0.12, lw=0)
    top.plot(u, 0.15 + 0.85 * rec, color=ACCENT2, lw=1.2)
    top.plot(np.linspace(-3.6, 3.6, 49), np.zeros(49), "s", ms=2.2, color=FAINT, mec="none")
    top.axhline(0, color=FAINT, lw=0.5)
    for c in sources:
        top.plot([c, c], [-1, 0], color=FAINT, lw=0.5, ls=(0, (2, 2)))
        top.plot([c], [-1], "o", ms=5, color=ACCENT, mec="none", zorder=4)
    top.annotate("", xy=(-1.4, 0), xytext=(-1.4, -1), arrowprops=dict(arrowstyle="<->", lw=0.5, color=DIM))
    top.text(-1.34, -0.5, r"$z$", va="center", color=DIM)
    top.text(sep / 2 + 0.1, -1, "two masses", va="center", fontsize=7.5)
    top.text(3.6, -0.12, "row of pixels", ha="right", va="top", fontsize=7.5, color=DIM)
    top.text(-3.6, 1.0, r"(a) recorded, $-\mathcal{E}_{zz}$", va="top", fontsize=8.5)
    top.set_ylim(-1.25, 1.05)
    top.set_axis_off()

    # (b) the Wiener reconstruction
    bottom.axhline(0, color=FAINT, lw=0.5)
    for c in sources:
        bottom.axvline(c, color=FAINT, lw=0.5, ls=(0, (2, 2)))
    bottom.plot(u, rebuilt, color=ACCENT, lw=1.2)
    x1 = 3.55
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
    fig, (left, right) = plt.subplots(1, 2, figsize=(FULL, 2.5), gridspec_kw={"wspace": 0.28})
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
    fig, (left, right) = plt.subplots(1, 2, figsize=(FULL, 2.7), gridspec_kw={"width_ratios": [1.75, 1], "wspace": 0.05})
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
    fig, (left, right) = plt.subplots(1, 2, figsize=(FULL, 2.6), gridspec_kw={"width_ratios": [1, 1.3], "wspace": 0.22})
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
    fig, ax = plt.subplots(figsize=(COL, 2.1))
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
    fig, ax = plt.subplots(figsize=(FULL, 1.8))
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

    fig, ax = plt.subplots(figsize=(COL, 2.1))
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
    ax.set_ylabel(r"$N$ ($10^{-5}$ s$^{-1}$m$^{-2}$sr$^{-1}$)", fontsize=7)
    handles, labels = ax.get_legend_handles_labels()
    ax.legend(handles[::-1], labels[::-1], loc="upper right", handlelength=1.2, labelspacing=0.2)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.12, right=0.97, top=0.97, bottom=0.2)
    save(fig, "earth-glow", web=True)


# --- Figure: how sharply a camera tells directions apart ----------------------

def array():
    from scipy.special import j1

    fig, ax = plt.subplots(figsize=(COL, 2.1))
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
    ax.legend(title="width at half height", title_fontsize=6.5, fontsize=6.5, loc="upper left",
              handlelength=1.6, labelspacing=0.2, borderaxespad=0.2)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.13, right=0.96, top=0.97, bottom=0.2)
    save(fig, "array", web=True)


# --- Figure: the graviton budget ------------------------------------------------

def budget():
    rows = [
        ("The Sun", 2.1e23, True),
        ("The Earth's interior*", 5.2e10, True),
        ("Steel beam spun to breaking", 3.8e3, False),
        ("Two 1-t masses, 48 turns/s", 8.1, False),
        ("Two 1-kg masses, 16 turns/s", 2.1e-9, False),
        ("A person", 1.6e-15, True),
        ("A litre of boiling water", 3.9e-17, True),
    ]
    fig, ax = plt.subplots(figsize=(COL, 2.5))
    y = np.arange(len(rows))[::-1]
    lo = 1e-19
    for (name, rate, thermal), yy in zip(rows, y):
        ax.barh(yy, rate - lo, left=lo, height=0.55, color=ACCENT if thermal else ACCENT2, alpha=0.85, lw=0)
    ax.set_yticks(y)
    ax.set_yticklabels([r[0].replace("'", "’") for r in rows], fontsize=6.5)
    ax.tick_params(axis="y", length=0)
    ax.set_xscale("log")
    ax.set_xlim(lo, 1e25)
    ax.set_xticks([1e-18, 1e-9, 1, 1e9, 1e18])
    ax.minorticks_off()
    ax.tick_params(axis="x", labelsize=6.5)
    ax.set_xlabel("gravitons per second, whole object", fontsize=7)
    marks = ((1 / 4.35e17, "one per age\nof universe"), (1.0, "one a\nsecond"))
    for value, _ in marks:
        ax.axvline(value, color=FAINT, lw=0.5, ls=(0, (2, 2)))
    top = ax.secondary_xaxis("top")
    top.set_xticks([m[0] for m in marks])
    top.set_xticklabels([m[1] for m in marks], fontsize=6.5, color=DIM, linespacing=1.0)
    top.tick_params(length=0, pad=2)
    top.spines["top"].set_visible(False)
    ax.plot([], [], "s", color=ACCENT, ms=5, label="thermal glow")
    ax.plot([], [], "s", color=ACCENT2, ms=5, label="bulk motion")
    ax.legend(loc="lower right", handlelength=0.8, fontsize=6.5)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.set_ylim(-0.6, len(rows) - 0.3)
    fig.subplots_adjust(left=0.45, right=0.97, top=0.88, bottom=0.17)
    save(fig, "budget", web=True)


# --- Computed images of the demonstration scenes --------------------------------
#
# These replace pictures from the engine: each is the exact line integral of
# the reference implementation, pixel by pixel, on a grid uniform in angle.

def _on_image(text_artist, dark: bool = False):
    """Plain text over an image: white on its darker parts, the page's ink on
    its pale ones (with the leader line, if any, in the same colour)."""
    # a dark that is not one of the theme colours the website swaps, so that
    # on its dark theme the label stays dark against the pale image
    colour = "#15140f" if dark else "#ffffff"
    text_artist.set_color(colour)
    arrow = getattr(text_artist, "arrow_patch", None)
    if arrow is not None:
        arrow.set_color(colour)
    return text_artist


def _sci(value):
    exponent = int(math.floor(math.log10(abs(value))))
    mantissa = value / 10 ** exponent
    return rf"{mantissa:.0f}\times10^{{{exponent}}}" if round(mantissa) != 1 else rf"10^{{{exponent}}}"


def _colormap(name, ink):
    from matplotlib.colors import LinearSegmentedColormap
    return LinearSegmentedColormap.from_list(name, ["#0b0c10", ink, "#f6dcb5" if ink == ACCENT else "#cfe0f6", "#ffffff"])


def _first_surface(scene, dirs):
    """Index of the first root object each ray meets (-1 for none): the
    outline of what light would show, drawn over the gravitational image."""
    from gravcam.scene import Box
    flat = dirs.reshape(-1, 3)
    best = np.full(flat.shape[0], np.inf)
    label = np.full(flat.shape[0], -1)
    for k, obj in enumerate(scene.objects):
        if obj.parent is not None:
            continue
        if isinstance(obj.shape, Box):
            near, far = columns.ray_box_distances(scene.observer, flat, obj.shape.center, obj.shape.size)
        else:
            near, far = columns.ray_sphere_distances(scene.observer, flat, obj.shape.center, obj.shape.radius)
        hit = (far > np.maximum(near, 0.0)) & (np.maximum(near, 0.0) < best)
        best = np.where(hit, np.maximum(near, 0.0), best)
        label = np.where(hit, k, label)
    return label.reshape(dirs.shape[:-1])


def _outline(ax, labels, extent, scene):
    """Thin, smooth outlines of the objects light would show (not the room's
    walls and floor), drawn over a gravitational image."""
    h, w = labels.shape
    x = np.linspace(extent[0], extent[1], w)
    y = np.linspace(extent[3], extent[2], h)
    for k, obj in enumerate(scene.objects):
        if obj.parent is not None or obj.background:
            continue
        mask = (labels == k).astype(float)
        if mask.any():
            ax.contour(x, y, mask, levels=[0.5], colors="#ffffff", linewidths=0.55, alpha=0.75, zorder=3)


def _perspective(yaw_deg, pitch_deg, fov_deg, width, height):
    """Ray directions of the demos' pinhole camera, shape (height, width, 3)."""
    from gravcam import camera
    return camera.ray_directions(math.radians(yaw_deg), math.radians(pitch_deg), math.radians(fov_deg),
                                 width, height)


def _light(name):
    """The engine's picture of the scene in ordinary light, from the same camera
    (captured by app/scripts/capture.mjs from the page /dev/render)."""
    return plt.imread(OUT / "light" / f"{name}.png")[..., :3]


def _panel(ax, title):
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_linewidth(0.4)
    ax.set_title(title, fontsize=8, loc="left", pad=3)


def _blur(image, fov_deg, snr, dims=2):
    """Convolve with the near-field point spread at this SNR, in the image plane
    (angle per pixel taken at the centre of the view)."""
    from scipy.signal import fftconvolve
    height = image.shape[0]
    step = 2 * math.tan(math.radians(fov_deg) / 2) / height
    reach = int(math.ceil(math.radians(8.0) / step))
    ky, kx = np.mgrid[-reach:reach + 1, -reach:reach + 1]
    radius = np.hypot(kx, ky) * step
    grid = np.linspace(0, radius.max(), 400)
    kernel = np.interp(radius, grid, resolution.psf(grid, snr, dims=dims))
    kernel /= kernel.sum()
    return fftconvolve(np.pad(image, reach, mode="edge"), kernel, mode="same")[reach:-reach, reach:-reach]


def _panels(n, bar=False, aspect=9 / 16):
    """A row of n picture panels of exactly the renders' shape (16:9), equal in
    size, with room for titles and, if asked, a colour bar at the right.
    Returns (fig, axes, colour-bar axes or None)."""
    left, gap, title = 0.02, 0.07, 0.19
    bottom = 0.07 if bar else 0.03
    right = 0.66 if bar else 0.02
    pw = (FULL - left - right - (n - 1) * gap) / n
    ph = pw * aspect
    height = bottom + ph + title
    fig = plt.figure(figsize=(FULL, height))
    axes = [fig.add_axes([(left + i * (pw + gap)) / FULL, bottom / height, pw / FULL, ph / height])
            for i in range(n)]
    cax = None
    if bar:
        x = left + n * pw + (n - 1) * gap + 0.09
        cax = fig.add_axes([x / FULL, bottom / height, 0.075 / FULL, ph / height])
    return fig, axes, cax


def _logscale_bar(fig, im, cax, low, high, label):
    cb = fig.colorbar(im, cax=cax)
    ticks = list(range(int(math.ceil(low)), int(math.floor(high)) + 1))
    cb.set_ticks(ticks)
    cb.set_ticklabels([f"$10^{{{t}}}$" for t in ticks])
    cb.set_label(label, fontsize=7)
    cb.ax.tick_params(labelsize=6.5)
    return cb


def sun_at_midnight():
    """Figure 1: the demonstration's view at midnight, in light and in thermal
    gravitons, computed pixel by pixel from the same camera."""
    scene = load_scene(ROOT / "scenes" / "sun-at-midnight.scene.json")
    yaw, pitch, fov = 0, -22, 80
    w, h = 640, 360
    d = _perspective(yaw, pitch, fov, w, h)
    N = columns.number_radiance(scene, d.reshape(-1, 3)).reshape(h, w)
    sun_dir = np.asarray(scene["sun-core"].shape.center) - scene.observer
    sun_dir /= np.linalg.norm(sun_dir)
    sun_N = float(columns.number_radiance(scene, sun_dir[None, :])[0])
    # where the Sun's core lies in the picture
    from gravcam import camera
    forward, right, up = camera.camera_basis(math.radians(yaw), math.radians(pitch))
    t = math.tan(math.radians(fov) / 2)
    px = (sun_dir @ right) / (sun_dir @ forward) / (t * w / h)
    py = (sun_dir @ up) / (sun_dir @ forward) / t
    fig, axes, cax = _panels(2, bar=True)
    axes[0].imshow(_light("sun-at-midnight"), extent=(-1, 1, -1, 1), aspect="auto")
    # in light the Sun is hidden: mark where it is
    axes[0].add_patch(plt.Circle((px, py), 0.055, fill=False, ec="#ffffff", lw=0.8, ls=(0, (1.5, 1.5))))
    _on_image(axes[0].annotate("the Sun, behind\nthe Earth", (px, py), xytext=(px + 0.34, py - 0.06),
                               fontsize=7, ha="left", va="center", linespacing=1.1,
                               arrowprops=dict(arrowstyle="-", lw=0.6, color="#ffffff", shrinkA=2, shrinkB=5)))
    # The Sun's core is a tenth of a degree across, smaller than a pixel, so
    # sampling at pixel centres would miss it: add its flux, spread over a spot
    # a few pixels wide as a camera's resolution would, where it lies.
    core = scene["sun-core"].shape
    radius = core.radius / np.linalg.norm(np.asarray(core.center) - scene.observer)
    flux = (2.0 / 3.0) * sun_N * math.pi * radius ** 2          # mean over the disc of a sphere's chord
    pixel = (2 * t / h) ** 2                                       # solid angle of a pixel, steradians
    cols = (px + 1) / 2 * w - 0.5
    rows = (1 - py) / 2 * h - 0.5
    jj, ii = np.meshgrid(np.arange(w), np.arange(h))
    sigma = 1.3
    spot = np.exp(-((jj - cols) ** 2 + (ii - rows) ** 2) / (2 * sigma ** 2)) / (2 * math.pi * sigma ** 2)
    N = N + flux / pixel * spot
    low, high = -7.0, -3.4
    im = axes[1].imshow(np.log10(np.clip(N, 10 ** low, None)), extent=(-1, 1, -1, 1), aspect="auto",
                        cmap=_colormap("thermal", ACCENT), vmin=low, vmax=high, interpolation="bilinear")
    _on_image(axes[1].annotate(r"Sun's core", (px + 0.03, py), xytext=(px + 0.34, py - 0.06),
                               fontsize=7, ha="left", va="center",
                               arrowprops=dict(arrowstyle="-", lw=0.6, shrinkA=2, shrinkB=4)), dark=True)
    # the horizon, which light shows as the edge of the ground
    y_h = math.tan(math.radians(-pitch)) / t
    axes[1].axhline(y_h, color="#ffffff", lw=0.5, ls=(0, (2, 2)), alpha=0.7)
    _on_image(axes[1].text(0.95, y_h + 0.04, "horizon", fontsize=6.5, ha="right", va="bottom"))
    # the bands are the Earth's shells: name each where it crosses the left of the picture
    nadir = np.degrees(np.arccos(np.clip(-d[..., 1], -1, 1)))
    col = int(0.04 * w)
    rows = np.arange(h)
    edges = {"crust and upper mantle": (63.5, 90.0), "lower mantle": (33.1, 63.5)}
    for name, (lo, hi) in edges.items():
        inside = rows[(nadir[:, col] > lo) & (nadir[:, col] < hi)]
        if inside.size:
            y = 1 - 2 * (inside.mean() + 0.5) / h
            _on_image(axes[1].text(-0.95, y, name, fontsize=6.5, ha="left", va="center"),
                      dark=(name == "lower mantle"))
    _panel(axes[0], "(a) light, long exposure")
    _panel(axes[1], "(b) thermal gravitons")
    _logscale_bar(fig, im, cax, low, high, r"$N$ (s$^{-1}$ m$^{-2}$ sr$^{-1}$)")
    print(f"  Sun's core: N = {sun_N:.3g} per s m^2 sr, flux {flux:.2f} per s m^2, at ({px:.2f}, {py:.2f})")
    save(fig, "sun-at-midnight", web=True)


def _without_room(scene_path):
    """The scene with its background (floor and walls) left out."""
    import json
    from gravcam.scene import scene_from_dict
    raw = json.loads(pathlib.Path(scene_path).read_text())
    raw["objects"] = [o for o in raw["objects"] if not o.get("background")]
    return scene_from_dict(raw)


def locked_safe():
    """The locked safe in light, and its tidal column with the room left out:
    exact, and blurred by the near-field point spread at SNR 10^20."""
    path = ROOT / "scenes" / "locked-safe.scene.json"
    full = load_scene(path)
    scene = _without_room(path)
    w, h = 640, 360
    d = _perspective(0, -14, 52, w, h)
    S = columns.tidal_column(scene, d.reshape(-1, 3), origin=full.observer).reshape(h, w)
    blurred = _blur(S, 52, 1e20)
    labels = _first_surface(full, d)
    extent = (-1, 1, -1, 1)
    fig, axes, _ = _panels(3)
    axes[0].imshow(_light("locked-safe"), extent=extent, aspect="auto")
    top = np.percentile(S, 99.7)
    for ax, image in ((axes[1], S), (axes[2], blurred)):
        ax.imshow(image, extent=extent, aspect="auto", cmap=_colormap("near", ACCENT2), vmin=0, vmax=top,
                  interpolation="bilinear")
        _outline(ax, labels, extent, full)
    _panel(axes[0], "(a) light")
    _panel(axes[1], r"(b) tidal column $S$")
    _panel(axes[2], r"(c) blurred, $\mathrm{SNR} = 10^{20}$")
    save(fig, "locked-safe", web=True)


def closed_furnace():
    """The closed furnace in light, and its thermal number radiance, room
    included, on a logarithmic scale."""
    path = ROOT / "scenes" / "closed-furnace.scene.json"
    scene = load_scene(path)
    w, h = 640, 360
    d = _perspective(0, -14, 52, w, h)
    N = columns.number_radiance(scene, d.reshape(-1, 3)).reshape(h, w)
    labels = _first_surface(scene, d)
    extent = (-1, 1, -1, 1)
    fig, axes, cax = _panels(2, bar=True)
    axes[0].imshow(_light("closed-furnace"), extent=extent, aspect="auto")
    hi = np.log10(N.max())
    im = axes[1].imshow(np.log10(np.clip(N, 10 ** (hi - 3), None)), extent=extent, aspect="auto",
                        cmap=_colormap("thermal", ACCENT), vmin=hi - 3, vmax=hi, interpolation="bilinear")
    _outline(axes[1], labels, extent, scene)
    _on_image(axes[1].text(0.47, -0.78, "1500 K", ha="center", va="center", fontsize=7))
    _on_image(axes[1].text(-0.47, -0.78, "293 K", ha="center", va="center", fontsize=7))
    _panel(axes[0], "(a) light")
    _panel(axes[1], "(b) thermal gravitons")
    _logscale_bar(fig, im, cax, hi - 3, hi, r"$N$ (s$^{-1}$ m$^{-2}$ sr$^{-1}$)")
    save(fig, "closed-furnace", web=True)


def which_way():
    """The which-way scene in light and in waves, in the teaching mode with
    light slowed to 20 cm/s: each turning pair an Airy spot of a 1.5 m array,
    coloured by its circular polarization V/I as the camera sees it."""
    from gravcam import waves
    from matplotlib.cm import ScalarMappable
    from matplotlib.colors import LinearSegmentedColormap, Normalize
    from scipy.special import j1
    path = ROOT / "scenes" / "which-way.scene.json"
    scene = load_scene(path)
    c_slow, aperture = 0.2, 1.5
    w, h = 640, 360
    d = _perspective(0, 0, 50, w, h)
    I_map = np.zeros((h, w))
    V_map = np.zeros((h, w))
    for rotor in waves.rotors(scene):
        seen = waves.seen_from(rotor, scene.observer, c=c_slow)
        to_source = -seen["direction"]
        lam = rotor.wavelength(c_slow)
        cosg = np.clip(d @ to_source, -1, 1)
        x = math.pi * aperture / lam * np.sqrt(1 - cosg ** 2)
        airy = np.where(x < 1e-9, 1.0, (2 * j1(np.maximum(x, 1e-9)) / np.maximum(x, 1e-9)) ** 2)
        airy = np.where(cosg > 0, airy, 0.0)
        I_map += seen["I"] * airy
        V_map += seen["V"] * airy
    labels = _first_surface(scene, d)
    extent = (-1, 1, -1, 1)
    ratio = V_map / np.maximum(I_map, 1e-300)
    pol = LinearSegmentedColormap.from_list("pol", ["#2f9e44", "#f2f2f2", "#c2255c"])
    # colour from V/I, brightness from I, on the dark ground of the picture
    shade = np.sqrt(np.clip(I_map / I_map.max(), 0, 1))[..., None]
    composite = 0.043 * (1 - shade) + pol((ratio + 1) / 2)[..., :3] * shade
    fig, axes, cax = _panels(2, bar=True)
    axes[0].imshow(_light("which-way"), extent=extent, aspect="auto")
    axes[1].imshow(composite, extent=extent, aspect="auto", interpolation="bilinear")
    _outline(axes[1], labels, extent, scene)
    _panel(axes[0], "(a) light")
    _panel(axes[1], r"(b) waves, coloured by $V/I$")
    cb = fig.colorbar(ScalarMappable(norm=Normalize(-1, 1), cmap=pol), cax=cax)
    cb.set_ticks([-1, 0, 1])
    cb.set_ticklabels(["$-1$", "$0$", "$+1$"])
    cb.set_label(r"$V/I$", fontsize=7)
    cb.ax.tick_params(labelsize=6.5)
    save(fig, "which-way", web=True)


# --- Figure (new): the tidal field itself -------------------------------------

def tidal_field():
    """The tidal tensor drawn as the distortion of a small ring at each point
    of a plane, over a map of one component, for one mass, two masses, and a
    plane wave."""
    from matplotlib.colors import LinearSegmentedColormap
    signed = LinearSegmentedColormap.from_list("signed", [ACCENT, "#f7f3ec", ACCENT2])

    def mass_field(masses, X, Z):
        E = np.zeros(X.shape + (3, 3))
        for m, (mx, mz) in masses:
            rel = np.stack([X - mx, np.zeros_like(X), Z - mz], axis=-1)    # pixel minus mass
            r = np.maximum(np.linalg.norm(rel, axis=-1), 1e-6)
            n = -rel / r[..., None]                                         # toward the mass
            E += (m / r ** 3)[..., None, None] * (np.eye(3) - 3 * n[..., :, None] * n[..., None, :])
        return E

    def wave_field(X, Z):
        E = np.zeros(X.shape + (3, 3))
        E[..., 0, 0] = np.cos(2 * np.pi * Z / 2.4)
        E[..., 1, 1] = -E[..., 0, 0]
        return E

    fig, axes = plt.subplots(1, 3, figsize=(FULL, 2.55), gridspec_kw={"wspace": 0.06})
    span = 2.4
    fine = np.linspace(-span, span, 300)
    FX, FZ = np.meshgrid(fine, fine)
    coarse = np.linspace(-span * 0.86, span * 0.86, 9)
    CX, CZ = np.meshgrid(coarse, coarse)
    panels = [
        ("(a) one mass", lambda X, Z: mass_field([(1.0, (0.0, 0.0))], X, Z), [(0.0, 0.0)]),
        ("(b) two masses", lambda X, Z: mass_field([(1.0, (-0.8, 0.0)), (1.0, (0.8, 0.0))], X, Z),
         [(-0.8, 0.0), (0.8, 0.0)]),
        (r"(c) a wave, $h_+$, moving up", wave_field, []),
    ]
    for ax, (title, field, masses) in zip(axes, panels):
        E = field(FX, FZ)
        comp = E[..., 2, 2] if masses else E[..., 0, 0]
        scale = np.abs(comp).max() if not masses else 1.0
        shown = np.sign(comp) * (np.abs(comp) / scale) ** (1 / 3) if masses else comp / scale
        away = np.ones(FX.shape, dtype=bool)
        for mx, mz in masses:
            away &= np.hypot(FX - mx, FZ - mz) > 0.5
        lim = np.nanmax(np.abs(shown[away])) if masses else 1.0
        ax.imshow(shown, extent=(-span, span, -span, span), origin="lower", cmap=signed, vmin=-lim, vmax=lim,
                  interpolation="bilinear")
        Ec = field(CX, CZ)
        for i in range(CX.shape[0]):
            for j in range(CX.shape[1]):
                if masses and min(np.hypot(CX[i, j] - mx, CZ[i, j] - mz) for mx, mz in masses) < 0.5:
                    continue
                block = Ec[i, j][np.ix_([0, 2], [0, 2])]
                vals, vecs = np.linalg.eigh(block)
                # one strength scale for the whole panel, compressed for the masses' 1/r^3
                strain = (np.sign(vals) * np.abs(vals) ** (1 / 3) * 0.38) if masses else vals * 0.35
                axes_len = 0.19 * (1 - np.clip(strain, -0.6, 0.6))
                angle = math.degrees(math.atan2(vecs[1, 0], vecs[0, 0]))
                ax.add_patch(Ellipse((CX[i, j], CZ[i, j]), 2 * axes_len[0], 2 * axes_len[1], angle=angle,
                                     fill=False, ec=INK, lw=0.6, zorder=4))
        for mx, mz in masses:
            ax.add_patch(Circle((mx, mz), 0.13, color=INK, lw=0, zorder=5))
        ax.set_title(title, fontsize=8, loc="left", pad=3)
        ax.set_xlim(-span, span)
        ax.set_ylim(-span, span)
        ax.set_aspect("equal")
        ax.set_xticks([])
        ax.set_yticks([])
    fig.subplots_adjust(left=0.01, right=0.99, top=0.9, bottom=0.02)
    save(fig, "tidal-field", web=True)


def binary_field():
    """A pair of black holes before they merge, in the plane of their orbit:
    the changing part of the tidal field from the pair out to the waves,
    from the exact linearized solution (gravcam/binary.py)."""
    from gravcam import binary
    from gravcam.constants import G as G_SI, M_sun
    from matplotlib.colors import LinearSegmentedColormap
    signed = LinearSegmentedColormap.from_list("signed", [ACCENT, "#f7f3ec", ACCENT2])
    v = 0.1                                   # orbital speed of each hole, in units of c
    m = 30 * M_sun
    d = G_SI * 2 * m / (4 * v * v * C * C)    # the separation of a bound pair at that speed
    pair = binary.Pair.bound(m, d)
    lam = pair.wavelength
    period = math.pi / pair.omega             # one period of the waves: half a turn
    times = [0.0, period / 4, period / 2, 3 * period / 4]

    def moving_zz(points):
        """Cosine and amplitude of the changing part of E_zz at the points."""
        snaps = []
        for t in times:
            parts = []
            for chunk in np.array_split(points, max(1, len(points) // 8000)):
                E, _ = binary.tidal(pair, t, chunk)
                parts.append(E[:, 2, 2])
            snaps.append(np.concatenate(parts))
        a = 0.5 * (snaps[0] - snaps[2])
        b = 0.5 * (snaps[1] - snaps[3])
        amp = np.hypot(a, b)
        return a / np.where(amp > 0, amp, 1), amp

    fig = plt.figure(figsize=(FULL, 2.45))
    grid = fig.add_gridspec(1, 3, width_ratios=[1, 1, 1.25], wspace=0.08)
    axes = [fig.add_subplot(grid[0, i]) for i in range(3)]
    for ax, half, title in ((axes[0], 8.0 * d, "(a) near the pair"), (axes[1], 3.6 * lam, "(b) out to the waves")):
        n = 241
        u = np.linspace(-half, half, n)
        X, Y = np.meshgrid(u, u)
        pts = np.stack([X.ravel(), Y.ravel(), np.zeros(X.size)], axis=-1)
        r = np.linalg.norm(pts, axis=-1)
        keep = r > 1.25 * d
        shown = np.full(X.size, np.nan)
        cosine, _ = moving_zz(pts[keep])
        shown[keep] = cosine
        ax.imshow(shown.reshape(X.shape), extent=(-half / d, half / d, -half / d, half / d), origin="lower",
                  cmap=signed, vmin=-1, vmax=1, interpolation="bilinear")
        # the pair at t = 0, and the edge of the near zone, r = lambda / 2 pi
        for sx in (-0.5, 0.5):
            ax.add_patch(Circle((sx, 0), 0.32 if half < 20 * d else 1.4, color=INK, lw=0, zorder=5))
        t = np.linspace(0, 2 * np.pi, 300)
        rn = lam / (2 * np.pi) / d
        ax.plot(rn * np.cos(t), rn * np.sin(t), color=INK, lw=0.6, ls=(0, (2, 2)))
        ax.set_xlim(-half / d, half / d)
        ax.set_ylim(-half / d, half / d)
        ax.set_aspect("equal")
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_title(title, fontsize=8, loc="left", pad=3)
    # scale bars, in units of the separation and of the wavelength
    axes[0].plot([3.0, 7.0], [-7.0, -7.0], color=INK, lw=0.8)
    axes[0].text(5.0, -6.6, "$4d$", ha="center", va="bottom", fontsize=7)
    span_l = lam / d
    axes[1].plot([3.6 * span_l - 0.4 * span_l - span_l, 3.6 * span_l - 0.4 * span_l], [-3.2 * span_l] * 2,
                 color=INK, lw=0.8)
    axes[1].text(3.6 * span_l - 0.9 * span_l, -3.05 * span_l, r"$\lambda$", ha="center", va="bottom", fontsize=7)

    # (c) how strongly the field changes, along a line in the plane
    radii = np.geomspace(1.6 * d, 60 * lam, 160)
    pts = np.stack([radii, np.zeros_like(radii), np.zeros_like(radii)], axis=-1)
    _, amp = moving_zz(pts)
    def amplitude(field):
        snaps = [field(t, pts)[:, 2, 2] for t in times]
        return np.hypot(0.5 * (snaps[0] - snaps[2]), 0.5 * (snaps[1] - snaps[3]))

    newton = amplitude(pair.newtonian_tidal)
    wave = amplitude(pair.wave_tidal)
    wave_level = (radii * wave).max()
    ax = axes[2]
    x = radii / lam
    low, high = 0.3, 3e3

    def curve(y, **style):
        y = y / wave_level
        inside = (y >= low) & (y <= high)
        ax.loglog(x[inside], y[inside], **style)

    curve(radii * amp, color=INK, lw=1.2, zorder=4)
    curve(radii * newton, color=ACCENT2, lw=0.9, ls=(0, (3, 2)))
    curve(radii * wave, color=ACCENT, lw=0.9, ls=(0, (3, 2)))
    ax.axvline(1 / (2 * np.pi), color=RULE, lw=0.6)
    ax.text(1 / (2 * np.pi) * 1.15, 1500, r"$\lambda/2\pi$", fontsize=7, ha="left", va="top", color=DIM)
    ax.set_xlim(x[0], x[-1])
    ax.set_ylim(low, high)
    ax.set_xlabel(r"distance $r/\lambda$", fontsize=7.5, labelpad=1)
    ax.set_ylabel(r"$r\,|\delta \mathcal{E}_{zz}|$ (waves $=1$)", fontsize=7.5, labelpad=1)
    ax.tick_params(labelsize=7, pad=1)
    ax.yaxis.tick_right()
    ax.yaxis.set_label_position("right")
    ax.text(0.6, 0.4, "Newton", color=ACCENT2, fontsize=7, ha="left", va="center")
    ax.text(3.0, 1.6, "waves", color=ACCENT, fontsize=7, ha="left")
    ax.set_title("(c) strength", fontsize=8, loc="left", pad=3)
    fig.subplots_adjust(left=0.01, right=0.9, top=0.9, bottom=0.17)
    save(fig, "binary-field", web=True)


STAR_TINT = np.array([1.0, 0.93, 0.84])     # old stars, a little warmer than white


def _light_tone(light, top, decades):
    """Light on a logarithmic scale of `decades` below `top`, per colour."""
    v = (np.log10(np.clip(light * STAR_TINT / top, 1e-30, None)) + decades) / decades
    return np.clip(v, 0, 1)


def _star_texture(width=4096, seed=7):
    """An all-sky (l, b) texture of stars for orientation in the light views:
    random, crowded toward the plane of the Galaxy, a few bright and many faint."""
    from scipy.ndimage import gaussian_filter
    rng = np.random.default_rng(seed)
    height = width // 2
    n = 14000
    l = rng.uniform(-np.pi, np.pi, 4 * n)
    b = np.arcsin(rng.uniform(-1, 1, 4 * n))
    keep = rng.uniform(0, 1, 4 * n) < 0.35 + 0.65 * np.exp(-np.abs(np.degrees(b)) / 10.0)
    l, b = l[keep][:n], b[keep][:n]
    flux = rng.uniform(0, 1, len(l)) ** -1.5
    flux *= 1.2 / np.percentile(flux, 75)
    warm = rng.uniform(0, 1, len(l))
    colour = np.stack([0.85 + 0.15 * warm, 0.88 + 0.06 * warm, 1.0 - 0.25 * warm], axis=-1)
    tex = np.zeros((height, width, 3))
    i = np.clip(((np.pi / 2 - b) / np.pi * height).astype(int), 0, height - 1)
    j = np.clip(((np.pi - l) / (2 * np.pi) * width).astype(int), 0, width - 1)
    for k in range(3):
        np.add.at(tex[..., k], (i, j), flux * colour[:, k])
        tex[..., k] = gaussian_filter(tex[..., k], 0.7, mode="wrap")
    return tex


def _sample_sky_texture(tex, dirs):
    from scipy.ndimage import map_coordinates
    height, width = tex.shape[:2]
    l = np.arctan2(dirs[..., 1], dirs[..., 0])
    b = np.arcsin(np.clip(dirs[..., 2], -1, 1))
    rows = (np.pi / 2 - b) / np.pi * height - 0.5
    cols = (np.pi - l) / (2 * np.pi) * width - 0.5
    return np.stack([map_coordinates(tex[..., k], [rows, cols], order=1, mode="grid-wrap")
                     for k in range(3)], axis=-1)


def milky_way():
    """The Milky Way from the Sun, all sky, in light dimmed by dust and in the
    gravitational waves of its white-dwarf pairs (gravcam/galaxy.py), on one
    logarithmic scale of brightness."""
    from gravcam import galaxy
    from matplotlib.colors import LinearSegmentedColormap
    w, h = 720, 360
    l, b = galaxy.mollweide_grid(w, h)
    inside = np.isfinite(l)
    light = np.zeros((h, w, 3))
    waves = np.full((h, w), np.nan)
    lt, wv = galaxy.sky(galaxy.direction(l[inside], b[inside]), steps=900)
    light[inside] = lt
    waves[inside] = wv
    top = np.nanmax(waves)
    decades = 3.0
    rgb = _light_tone(light, top, decades)
    rgb[~inside] = 1.0
    map_w = COL - 0.62
    map_h = map_w / 2
    height = 2 * map_h + 0.58
    fig = plt.figure(figsize=(COL, height))
    rows = [(0.04 + map_h + 0.27) / height, 0.04 / height]
    axes = [fig.add_axes([0.01 / COL, y, map_w / COL, map_h / height]) for y in rows]
    extent = (-2 * math.sqrt(2), 2 * math.sqrt(2), -math.sqrt(2), math.sqrt(2))
    axes[0].imshow(rgb, extent=extent, interpolation="bilinear")
    shown = np.log10(np.clip(waves / top, 10 ** -decades, None))
    thermal = _colormap("thermal", ACCENT)
    im = axes[1].imshow(np.where(inside, shown, np.nan), extent=extent, cmap=thermal, vmin=-decades, vmax=0,
                        interpolation="bilinear")
    t = np.linspace(0, 2 * np.pi, 400)
    for ax in axes:
        ax.plot(2 * math.sqrt(2) * np.cos(t), math.sqrt(2) * np.sin(t), color=INK, lw=0.6)
        ax.set_xlim(-2 * math.sqrt(2) - 0.03, 2 * math.sqrt(2) + 0.03)
        ax.set_ylim(-math.sqrt(2) - 0.03, math.sqrt(2) + 0.03)
        ax.set_axis_off()
    axes[0].set_title("(a) light, through the dust", fontsize=8, loc="left", pad=3)
    axes[1].set_title("(b) gravitational waves, near a millihertz", fontsize=8, loc="left", pad=3)
    _on_image(axes[0].annotate("dust lane", (-0.55, 0.0), xytext=(-1.25, 0.72), fontsize=7, ha="center",
                               va="center", arrowprops=dict(arrowstyle="-", lw=0.6, color="#ffffff",
                                                            shrinkA=2, shrinkB=2)))
    _on_image(axes[1].annotate("the Galaxy's centre", (0.0, 0.0), xytext=(-1.25, 0.72), fontsize=7,
                               ha="center", va="center", arrowprops=dict(arrowstyle="-", lw=0.6,
                                                                         color="#ffffff", shrinkA=2,
                                                                         shrinkB=4)))
    grey = LinearSegmentedColormap.from_list("grey", ["#000000", "#ffffff"])
    ticks = [-3, -2, -1, 0]
    names = [r"$10^{-3}$", r"$10^{-2}$", r"$10^{-1}$", "1"]
    for ax, cmap in ((axes[0], grey), (axes[1], thermal)):
        pos = ax.get_position()
        cax = fig.add_axes([pos.x1 + 0.08 / COL, pos.y0 + 0.1 * pos.height, 0.07 / COL, 0.8 * pos.height])
        from matplotlib.cm import ScalarMappable
        from matplotlib.colors import Normalize
        cb = fig.colorbar(ScalarMappable(norm=Normalize(-decades, 0), cmap=cmap), cax=cax)
        cb.set_ticks(ticks)
        cb.set_ticklabels(names)
        cb.ax.tick_params(labelsize=7)
        cb.set_label("brightness", fontsize=7.5, labelpad=2)
    print(f"  waves: centre / anticentre = {waves[h // 2, w // 2] / waves[h // 2, 3]:.0f}; "
          f"light: {light[h // 2 + 3, w // 2, 1] / light[h // 2, 3, 1]:.2f}")
    save(fig, "milky-way", web=True)


def black_hole():
    """A black hole against the sky, in light and in the primordial graviton
    background: exact Schwarzschild rays (gravcam/schwarzschild.py)."""
    from gravcam import galaxy, primordial, schwarzschild as sw
    from matplotlib.colors import LinearSegmentedColormap
    r_obs = 40.0
    # the hole lies 9 degrees above the Galaxy's centre, as seen by the camera
    lift = math.radians(9.0)
    forward = np.array([math.cos(lift), 0.0, math.sin(lift)])
    right = np.array([0.0, -1.0, 0.0])
    up = np.cross(right, forward)
    observer = -r_obs * forward
    w, h = 640, 360
    fov = math.radians(76.0)                         # across
    tx = math.tan(fov / 2)
    xs = (np.arange(w) + 0.5) / w * 2 - 1
    ys = 1 - (np.arange(h) + 0.5) / h * 2
    X, Y = np.meshgrid(xs * tx, ys * tx * h / w)
    d = forward + X[..., None] * right + Y[..., None] * up
    d /= np.linalg.norm(d, axis=-1, keepdims=True)
    sky, shadow = sw.sky_directions(observer, d)
    # (a) light: the model Galaxy and a field of stars, carried along the bent rays
    light = np.zeros((h, w, 3))
    lt, _ = galaxy.sky(sky[~shadow], steps=900)
    light[~shadow] = lt
    l_all, b_all = galaxy.mollweide_grid(360, 180)
    ok = np.isfinite(l_all)
    ref, _ = galaxy.sky(galaxy.direction(l_all[ok], b_all[ok]), steps=600)
    x = light * STAR_TINT / np.percentile(ref[:, 1], 99.9)
    rgb = np.clip(np.arcsinh(4 * x) / np.arcsinh(4) + _sample_sky_texture(_star_texture(), sky), 0, 1)
    rgb[shadow] = 0.0
    # (b) the graviton background, warmed by the depth of the well, with the dipole of our motion
    T0 = primordial.graviton_temperature()
    beta = primordial.DIPOLE_SPEED / C
    T = sw.blueshift(r_obs) * primordial.doppler_temperature(T0, beta, sky @ primordial.dipole_direction())
    mean = sw.blueshift(r_obs) * T0
    dT = np.where(shadow, np.nan, (T - mean) * 1e3)
    temp = LinearSegmentedColormap.from_list("temp", [ACCENT2, "#f7f3ec", ACCENT])
    temp.set_bad("#0b0c10")
    fig, axes, cax = _panels(2, bar=True)
    axes[0].imshow(rgb, extent=(-1, 1, -1, 1), aspect="auto", interpolation="bilinear")
    lim = 1e3 * beta * T0 * sw.blueshift(r_obs) * 1.02
    im = axes[1].imshow(dT, extent=(-1, 1, -1, 1), aspect="auto", cmap=temp, vmin=-lim, vmax=lim,
                        interpolation="bilinear")
    _panel(axes[0], "(a) light")
    _panel(axes[1], "(b) primordial gravitons")
    _on_image(axes[1].annotate("shadow", (0.1, -0.13), xytext=(0.42, -0.62), fontsize=7, ha="left",
                               va="center", arrowprops=dict(arrowstyle="-", lw=0.6, color="#ffffff",
                                                            shrinkA=2, shrinkB=2)), dark=True)
    cb = fig.colorbar(im, cax=cax)
    cb.ax.tick_params(labelsize=6.5)
    cb.set_label(r"$T - %.3f\,\mathrm{K}$, in mK" % mean, fontsize=7, labelpad=2)
    print(f"  shadow radius {math.degrees(sw.shadow_radius(r_obs)):.1f} deg; mean T {mean:.4f} K")
    save(fig, "black-hole", web=True)


def sun_lens():
    """The transparent Sun as a lens: bending and focal distance against the
    impact parameter, inside and outside the Sun (gravcam/sunlens.py)."""
    from gravcam import sunlens
    AU = 1.495978707e11
    b = np.concatenate([np.linspace(0.004, 0.99, 70), np.linspace(1.0, 3.0, 30)])
    alpha = np.array([sunlens.deflection(x * sunlens.R_sun) for x in b])
    arcsec = np.degrees(alpha) * 3600
    focus = b * sunlens.R_sun / alpha / AU
    fig, axes = plt.subplots(2, 1, figsize=(COL, 3.7), gridspec_kw={"hspace": 0.55})
    ax = axes[0]
    ax.axvline(1, color=RULE, lw=0.6)
    ax.plot(b, arcsec, color=ACCENT, lw=1.2)
    ax.plot(b[b >= 1], 1.7512 / b[b >= 1], color=ACCENT, lw=1.2)
    inner = (b < 1) & (1.7512 / b < 5.4)
    ax.plot(b[inner], 1.7512 / b[inner], color=FAINT, lw=0.8, ls=(0, (3, 2)))
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 5.5)
    ax.set_xlabel(r"impact parameter $b/R_\odot$")
    ax.set_ylabel("bending (arcseconds)")
    ax.text(1.06, 5.3, "the Sun's surface", fontsize=6.5, color=DIM, ha="left", va="top")
    ax.text(1.75, 1.55, r"$1.75''\,R_\odot/b$", fontsize=7, color=DIM, ha="left")
    ax.text(0.13, 4.4, r"$4.2''$", fontsize=7, color=ACCENT, ha="center", va="bottom")
    ax.annotate("a point mass", (0.45, 1.7512 / 0.45), xytext=(1.06, 4.3), fontsize=6.5, color=FAINT,
                ha="left", va="center", arrowprops=dict(arrowstyle="-", lw=0.5, color=FAINT, shrinkA=1, shrinkB=2))
    ax.set_title("(a) bending", fontsize=8, loc="left", pad=3)
    ax = axes[1]
    ax.axvline(1, color=RULE, lw=0.6)
    ax.semilogy(b, focus, color=ACCENT2, lw=1.2)
    ax.axhline(23.5, color=FAINT, lw=0.7, ls=(0, (3, 2)))
    ax.text(2.95, 26, "23.5 AU, standard model", fontsize=6.5, color=DIM, ha="right", va="bottom")
    ax.annotate(f"{focus[0]:.1f} AU at the centre", (0.02, focus[0]), xytext=(1.12, 15), fontsize=7,
                color=ACCENT2, ha="left", va="center",
                arrowprops=dict(arrowstyle="-", lw=0.5, color=ACCENT2, shrinkA=1, shrinkB=2))
    ax.text(1.05, 548 / 1.6, "548 AU", fontsize=7, color=ACCENT2, ha="left", va="top")
    ax.set_xlim(0, 3)
    ax.set_ylim(10, 1e4)
    ax.set_yticks([1e2, 1e3, 1e4])
    ax.minorticks_off()
    ax.set_xlabel(r"impact parameter $b/R_\odot$")
    ax.set_ylabel("focal distance (AU)")
    ax.set_title("(b) where it focuses", fontsize=8, loc="left", pad=3)
    for a in axes:
        for side in ("top", "right"):
            a.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.17, right=0.97, top=0.95, bottom=0.11)
    peak = b[np.argmax(arcsec)]
    print(f"  peak bending {arcsec.max():.2f} arcsec at b = {peak:.2f} R; shortest focus {focus[0]:.1f} AU")
    save(fig, "sun-lens", web=True)


def memory_patterns():
    """What a burst leaves behind: the memory against the direction of the
    camera, for a merger and for an explosion (gravcam/memory.py)."""
    from gravcam import memory
    angles = np.radians(np.linspace(1, 179, 120))
    toward = lambda a: np.array([math.sin(a), 0.0, math.cos(a)])  # noqa: E731
    merger = np.array([abs(memory.epstein(memory.binary_flux, toward(a))[0]) for a in angles])
    ci = np.cos(angles)
    wave = np.hypot((1 + ci * ci) / 2, ci)                 # amplitude of the oscillating wave
    fig, axes = plt.subplots(2, 1, figsize=(COL, 3.7), gridspec_kw={"hspace": 0.55})
    deg = np.degrees(angles)
    ax = axes[0]
    ax.plot(deg, wave / wave.max(), color=ACCENT2, lw=1.1, label="oscillating wave")
    ax.plot(deg, merger / merger.max(), color=ACCENT, lw=1.2, label="memory")
    ax.legend(loc="lower center", bbox_to_anchor=(0.5, 0.02), fontsize=7, handlelength=1.6, labelspacing=0.2,
              frameon=False)
    ax.set_title("(a) a merger", fontsize=8, loc="left", pad=3)
    ax.set_ylabel("strain (largest = 1)")
    ax = axes[1]
    one = 0.5 * (1 + ci)
    ax.plot(deg, one, color=ACCENT, lw=1.2, label="one jet")
    ax.plot(deg, np.full_like(deg, 0.5), color=ACCENT2, lw=1.1, label="two opposite jets")
    ax.plot(deg, np.zeros_like(deg), color=INK, lw=1.1, ls=(0, (4, 2)), label="spherical")
    ax.legend(loc="upper right", fontsize=7, handlelength=1.6, labelspacing=0.2, frameon=False)
    ax.set_title("(b) an explosion", fontsize=8, loc="left", pad=3)
    ax.set_ylabel(r"$\Delta h \,/\, (4GE/c^4 r)$")
    for a in axes:
        a.set_xlim(0, 180)
        a.set_ylim(-0.04, 1.08)
        a.set_xticks([0, 90, 180])
        a.set_xlabel(r"angle from the axis (degrees)")
        for side in ("top", "right"):
            a.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.17, right=0.95, top=0.95, bottom=0.11)
    save(fig, "memory", web=True)


def main() -> int:
    setup_fonts()
    for draw in (tidal, tidal_field, regimes, sky_integral, nearfield, resolution_law, quadrupole,
                 polarization_curves, line_integral, earth_glow, array, budget,
                 sun_at_midnight, locked_safe, which_way, closed_furnace, binary_field,
                 milky_way, black_hole, sun_lens, memory_patterns):
        draw()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
