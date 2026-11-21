"""A draft figure of the marked ring in an exact plane wave: a result that is not in the paper
(design/SYNTHESIS.md, Section 10.1; reference/gravcam/ring.py), kept staged for the day it has a place.

    python3 paper/figures/draft_marked_ring.py      writes paper/figures/staging/draft-marked-ring.pdf

The name of this file does not begin with fig_, so `make figures` does not run it. Every number drawn is computed
from gravcam.ring and asserted against the value quoted for the worked example. The drafts that stood beside it
(the ladder, the cone, the hidden flow, the hole's response, the geometry of the near field) are now figures of the
paper: figures3d/figs/{ladder,two-readings,hidden-flow,near-field-geometry}.js and paper/figures/fig_hole_response.py.
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
from matplotlib.patches import FancyArrowPatch  # noqa: E402

A_COL, B_COL = mf.ACCENT, mf.ACCENT2


def ring_draft():
    """A ring of free particles in an exact plane wave (not in the paper; Section 10.1 of
    design/SYNTHESIS.md). The worked example r = 0.60 sin^4(pi u / T), psi = +-2 pi u / T, from gravcam.ring."""
    from gravcam import ring as rg
    T = 1.0
    runs = {}
    for sign, col in ((1, A_COL), (-1, B_COL)):
        path = rg.petal(0.60, sign * 2 * math.pi)
        sol = rg.shape_run(path, T)
        runs[sign] = (path, sol, col)
        theta, rho, _ = sol.y[:, -1]
        assert abs(abs(math.degrees(theta)) - 9.0521) < 2e-4 and abs(rho - 0.2691) < 1e-4
        assert abs(0.5 * rg.hyperbolic_area(path, T) - theta) < 1e-6
    fig = plt.figure(figsize=(7.0, 2.2))
    times = (0.0, 0.3, 0.5, 0.75, 1.0)
    names = ("before", "", "during", "", "after")
    beads = np.radians(np.arange(12) * 30.0)
    circle = np.stack([np.cos(np.linspace(0, 2 * math.pi, 181)), np.sin(np.linspace(0, 2 * math.pi, 181))])
    cell = 0.113
    for row, sign in enumerate((1, -1)):
        path, sol, col = runs[sign]
        for k, u in enumerate(times):
            ax = fig.add_axes([0.012 + k * (cell + 0.004), 0.50 - row * 0.44, cell, cell * 7.0 / 2.2])
            mf.bare(ax)
            theta, rho, _ = sol.sol(u)
            r, _, psi, _ = path(u)
            X = rg.ring_map(1.0, theta, r, psi)                  # each ring at its own scale; its radius is in (c)
            ax.plot(*circle, color=mf.FAINT, lw=0.4, ls=(0, (2, 2)))
            ax.plot(*(X @ circle), color=mf.INK, lw=0.6)
            pts = X @ np.stack([np.cos(beads), np.sin(beads)])
            ax.plot(pts[0, 1:], pts[1, 1:], "o", ms=1.9, color=mf.DIM, mec="none")
            ax.plot([0, 1.22], [0, 0], color=mf.INK, lw=0.5, solid_capstyle="butt")       # the gyroscope's axis
            ax.plot([0, pts[0, 0]], [0, pts[1, 0]], color=col, lw=0.8)
            ax.plot([pts[0, 0]], [pts[1, 0]], "o", ms=3.0, color=col, mec="none")
            ax.set_xlim(-1.5, 1.5)
            ax.set_ylim(-1.5, 1.5)
            if row == 0 and names[k]:
                ax.set_title(names[k], fontsize=7, pad=2, color=mf.DIM)
            if row == 0 and k == 0:
                fig.text(0.012, 0.975, "(a) the ring in a wave, and in its mirror image", fontsize=8, va="top")
    # the shape's path, in Poincare's disc
    ax = fig.add_axes([0.625, 0.12, 0.155, 0.155 * 7.0 / 2.2])
    mf.bare(ax)
    us = np.linspace(0, T, 400)
    path = runs[1][0]
    rr = np.array([path(u)[0] for u in us])
    ps = np.array([path(u)[2] for u in us])
    x, y = np.tanh(rr / 2) * np.cos(ps), np.tanh(rr / 2) * np.sin(ps)
    ax.fill(x, y, color=mf.RULE, alpha=0.45, lw=0)
    ax.plot(x, y, color=mf.INK, lw=0.8)
    arrow = dict(arrowstyle="-|>", mutation_scale=6, lw=0.9, shrinkA=0, shrinkB=0)
    for sign, col, i in ((1, A_COL, 120), (-1, B_COL, 280)):         # the two senses in which the loop is run
        j = i + 6 * sign
        ax.add_patch(FancyArrowPatch((x[i], y[i]), (x[j], y[j]), color=col, **arrow))
    ax.plot([0], [0], "o", ms=2.2, color=mf.INK, mec="none")
    ax.set_xlim(-0.40, 0.14)
    ax.set_ylim(-0.27, 0.27)
    fig.text(0.625, 0.975, "(b) the shape's path", fontsize=8, va="top")
    # the turn of the marks and the radius
    ax1 = fig.add_axes([0.845, 0.56, 0.145, 0.30])
    ax2 = fig.add_axes([0.845, 0.165, 0.145, 0.30], sharex=ax1)
    for sign in (1, -1):
        path, sol, col = runs[sign]
        ax1.plot(us, np.degrees(sol.sol(us)[0]), color=col, lw=1.1)
    ax2.plot(us, runs[1][1].sol(us)[1], color=mf.INK, lw=1.1)
    ax1.set_ylim(-10.5, 10.5)
    ax1.set_yticks([-9, 0, 9])
    ax1.set_yticklabels([r"$-9^\circ$", r"$0$", r"$9^\circ$"])
    ax1.tick_params(labelbottom=False)
    ax2.set_ylim(0, 1.05)
    ax2.set_yticks([0, 0.5, 1])
    ax2.set_xlim(0, 1)
    ax2.set_xticks([0, 0.5, 1])
    ax2.set_xticklabels(["0", "", "$T$"])
    ax2.set_xlabel("time", labelpad=1)
    for ax in (ax1, ax2):
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
    fig.text(0.805, 0.975, "(c) turn, and radius", fontsize=8, va="top")
    return fig, "draft-marked-ring"


def main() -> int:
    mf.OUT = HERE / "staging"
    mf.OUT.mkdir(exist_ok=True)
    mf.setup_fonts()
    fig, name = ring_draft()
    mf.save(fig, name)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
