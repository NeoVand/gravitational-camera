"""The thermal tremor of a ball and a shell of the same mass and radius, whose static fields are identical.

    python paper/figures/fig_tremor.py        (from the repository root)

Writes paper/figures/tremor.pdf with the helpers of make_figures.py. Numbers come from reference/gravcam/response.py.
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

from gravcam import response as r  # noqa: E402

U = np.diag([-0.5, -0.5, 1.0]) / math.sqrt(1.5)


def spectrum(inner: float):
    p, m, K = r.lattice_body(6.0, inner=inner)
    w2, V = r.normal_modes(m, K)
    c2 = r.thermal_moments(w2, r.multipole_couplings(p, m, V, r.quadrupole_gradient(p, U)))["weights"]
    return np.sqrt(w2), c2, r.second_moment(p, m)


def tremor_figure():
    mf.setup_fonts()
    (wb, cb, Ib), (ws, cs, Is) = spectrum(0.0), spectrum(4.0)
    scale = wb[np.argmax(cb)]
    total = cb.sum()
    fig = plt.figure(figsize=(mf.COL, 2.3))
    ax = fig.add_axes([0.15, 0.19, 0.80, 0.77])
    for w, c2, colour, name in ((wb, cb, mf.ACCENT2, "ball"), (ws, cs, mf.ACCENT, "shell")):
        x = w / scale
        order = np.argsort(x)
        cum = np.concatenate([[0.0], np.cumsum(c2[order]) / total])
        xs = np.concatenate([[0.0], x[order]])
        # to the right edge of the axes, x = 4
        inside = xs < 4.0
        ax.step(np.append(xs[inside], 4.0), np.append(cum[inside], cum[inside][-1]), where="post", color=colour,
                lw=mf.CURVE)
        ax.text(3.9, cum[-1] + 0.03, f"{name}: {cum[-1]:.2f}", color=colour, ha="right", va="bottom", fontsize=7.5)
    ax.set_xlim(0, 4)
    ax.set_ylim(-0.04, 1.36)                 # the first tick labels of the two axes apart
    ax.set_xlabel(r"frequency / that of the ball's strongest mode")
    ax.set_ylabel(r"$\langle\dot q^2\rangle$, ball's total $=1$")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    mf.centre(fig)
    mf.trim(fig)
    mf.save(fig, "tremor", web=True)
    return Is / Ib


if __name__ == "__main__":
    print("shell / ball second moment:", tremor_figure())
