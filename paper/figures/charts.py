"""Chart panels drawn by matplotlib and placed into the 3D figures (figures3d/).

    python3 paper/figures/charts.py            writes paper/figures/staging/<name>-chart.svg
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import make_figures as mf  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

# the Earth's shells, crust to inner core, the same colours as the cutaway (figures3d/figs/earth-glow.js)
SHELLS = ["#f1e9de", "#f1d9bd", "#ebc59c", "#e2a86f", "#d48a46"]
EDGE = "#b0560a"


def earth_glow_chart():
    from gravcam import columns, emission
    from gravcam.scene import load_scene
    scene = load_scene(mf.ROOT / "scenes" / "sun-at-midnight.scene.json")
    layers = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]
    names = ["crust, 700 K", "upper mantle, 1700 K", "lower mantle, 2800 K", "outer core, 4500 K", "inner core, 5500 K"]
    radii = [scene[k].shape.radius for k in layers]
    angle = np.linspace(0, 89.5, 720)
    a = np.radians(angle)
    directions = np.stack([np.sin(a), -np.cos(a), np.zeros_like(a)], axis=1)
    paths = columns.own_region_paths(scene, directions)
    j = emission.number_emissivities(scene)
    parts = [paths[:, scene.index(k)] * j[scene.index(k)] for k in layers]
    total = np.sum(parts, axis=0)
    assert np.allclose(total, columns.number_radiance(scene, directions), rtol=1e-9)
    fig, ax = plt.subplots(figsize=(3.55, 2.75))
    unit = 1e-5
    base = np.zeros_like(angle)
    for part, name, col in zip(reversed(parts), reversed(names), reversed(SHELLS)):
        ax.fill_between(angle, base / unit, (base + part) / unit, facecolor=col, edgecolor="none", lw=0, label=name)
        base = base + part
    ax.plot(angle, total / unit, color=EDGE, lw=1.0)
    top = total.max() / unit
    R = radii[0]
    # each boundary's guide stops beneath its label; the lower mantle's below the legend
    for r, label, h in ((radii[4], "inner core", 1.2), (radii[3], "core", 1.2), (radii[2], "lower mantle", 0.36)):
        edge = math.degrees(math.asin(r / R))
        ax.plot([edge, edge], [0, top * (h - 0.08)], color=mf.FAINT, lw=0.45, ls=(0, (2, 2)), zorder=0.5)
        ax.text(edge + 1.0, top * h, label, fontsize=7, color=mf.DIM, va="top")
    ax.set_xlim(0, 90)
    ax.set_ylim(0, top * 1.22)
    ax.set_xticks([0, 15, 30, 45, 60, 75, 90])
    ax.set_xticklabels([rf"${t}^\circ$" for t in (0, 15, 30, 45, 60, 75, 90)])
    ax.set_xlabel("angle of the line of sight from straight down")
    ax.set_ylabel(r"$N$ ($10^{-5}$ s$^{-1}$m$^{-2}$sr$^{-1}$)")
    handles, labels = ax.get_legend_handles_labels()
    ax.legend(handles[::-1], labels[::-1], loc="upper right", bbox_to_anchor=(1.0, 0.86), handlelength=1.1,
              labelspacing=0.22, fontsize=7)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.15, right=0.955, top=0.97, bottom=0.17)
    return fig, "earth-glow-chart"


def main(names=()) -> int:
    mf.OUT = HERE / "staging"
    mf.OUT.mkdir(exist_ok=True)
    mf.setup_fonts()
    for draw in (earth_glow_chart, quadrupole_chart, voices_chart):
        if names and draw.__name__.replace("_chart", "").replace("_", "-") not in names:
            continue
        fig, name = draw()
        mf.save(fig, name, web=True)
    return 0



def quadrupole_chart():
    C = mf.C
    fig, ax = plt.subplots(figsize=(266 / 72, 180 / 72))   # the height of the diagram beside it
    v = np.logspace(-1, math.log10(C), 200)
    ax.plot(v, (math.pi / 2) * C / v, color=mf.INK, lw=1.0)
    ax.axhline(1, color=mf.RULE, lw=0.5)
    ax.axvspan(0.3, 300, color=mf.ACCENT2, alpha=0.1, lw=0, zorder=0)
    ax.text(10, 3e3, "everyday\nspeeds", ha="center", fontsize=7.5, color=mf.ACCENT2, linespacing=1.0)
    ax.text(2e6, 2.4, r"$\lambda = d$", fontsize=7.5, color=mf.DIM)
    vv = 32.0
    ax.plot([vv], [(math.pi / 2) * C / vv], "o", ms=3, color=mf.ACCENT, mec="none")
    ax.annotate(r"$32\,\mathrm{m/s}$: $\lambda \approx 1.5\times10^{7}\,d$", (vv, (math.pi / 2) * C / vv), xytext=(900, 2e8),
                textcoords="data", fontsize=7.5, arrowprops=dict(arrowstyle="-", lw=0.45, color=mf.DIM, shrinkA=1, shrinkB=2))
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
    fig.subplots_adjust(left=0.17, right=0.97, top=0.97, bottom=0.18)
    return fig, "quadrupole-chart"


def voices_chart():
    """One ear, four voices: the four waveforms, and the ten numbers the pixel reads while all four pass."""
    import json
    d = json.loads((mf.ROOT / "reference/results/figures/voices.json").read_text())
    t = np.array(d["t"])
    fig = plt.figure(figsize=(244 / 72, 214 / 72))
    top = fig.add_axes([0.1, 0.62, 0.88, 0.32])
    low = fig.add_axes([0.1, 0.07, 0.88, 0.47])
    for ax in (top, low):
        ax.set_axis_off()
        ax.set_xlim(-0.01, 1.01)
    gap = 1.25
    for i, w in enumerate(d["waves"]):
        y0 = -i * gap
        top.plot(t, y0 + 0.5 * np.array(w["im"]), color=mf.FAINT, lw=0.45)
        top.plot(t, y0 + 0.5 * np.array(w["re"]), color=mf.INK, lw=0.6)
        top.text(-0.035, y0, rf"${i + 1}$", ha="right", va="center", fontsize=7.5, color=mf.ACCENT)
    top.set_ylim(-3 * gap - 0.75, 0.75)
    top.text(0.0, 1.0, r"four waves, each with its own two polarizations", transform=top.transAxes, fontsize=7.5,
             color=mf.DIM, va="bottom")
    tr = np.array(d["traces"])
    tr = tr / np.max(np.abs(tr))
    gap = 0.75
    names = [rf"$\mathcal{{E}}_{k}$" for k in range(1, 6)] + [rf"$\mathcal{{B}}_{k}$" for k in range(1, 6)]
    for i, (row, name) in enumerate(zip(tr, names)):
        y0 = -i * gap - (0.35 if i >= 5 else 0.0)
        low.plot(t, y0 + 0.5 * row, color=mf.INK if i < 5 else mf.DIM, lw=0.5)
        low.text(-0.035, y0, name, ha="right", va="center", fontsize=7, color=mf.DIM)
    low.set_ylim(-9 * gap - 0.35 - 0.6, 0.6)
    low.text(0.0, 1.0, r"what one pixel reads: ten numbers", transform=low.transAxes, fontsize=7.5, color=mf.DIM,
             va="bottom")
    low.annotate("", xy=(1.0, -0.035), xytext=(0.0, -0.035), xycoords="axes fraction",
                 arrowprops=dict(arrowstyle="-|>", lw=0.5, color=mf.DIM, mutation_scale=6))
    low.text(1.0, -0.06, "time", transform=low.transAxes, ha="right", va="top", fontsize=7, color=mf.DIM)
    return fig, "voices-chart"


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
