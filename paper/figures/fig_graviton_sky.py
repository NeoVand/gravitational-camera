"""The graviton sky's temperature, and the black holes that glow against it (Section XI).

    python paper/figures/fig_graviton_sky.py        (from the repository root)

Writes paper/figures/graviton-sky.pdf and .svg with the helpers of make_figures.py.

(a) The temperature of the photons, the neutrinos and the gravitons times the scale factor, in units of today's
photons', against the temperature of the photons, from the Planck temperature to today
(reference/gravcam/primordial.py: THERMAL_HISTORY, comoving_temperatures). Entropy is conserved, so each species that
annihilates heats whatever still shares the photons' bath: the photons end at 1, the neutrinos, parted before the
electrons went, at (4/11)^(1/3), and the gravitons, parted at the start, at (3.91/106.75)^(1/3): 2.7255, 1.945 and
0.905 K. The heights of the steps are exact; each step is drawn sharp, where k_B T is the species' rest energy,
though an annihilation is gradual. Where lines share a value they are drawn side by side, a line's width apart.

(b) The Hawking temperature of a hole against its mass (one scale read two ways, k_B T = hbar c^3 / 8 pi G M:
reference/gravcam/lens.py, hawking_mass). A hole lighter than 4.50e22 kg is hotter than the microwave sky and glows
against both skies; one between that and 1.356e23 kg glows against the graviton sky alone; a heavier one is a shadow
on both. Marks: holes of the mass of the Moon, the Earth, the Sun and Sgr A* (4.0e6 solar masses).
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import make_figures as mf  # noqa: E402  (also puts reference/ on the path)
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.transforms import offset_copy  # noqa: E402

from gravcam import primordial as pr  # noqa: E402
from gravcam.constants import G, M_sun, c, hbar, kB  # noqa: E402
from gravcam.lens import hawking_mass  # noqa: E402

T_PLANCK = math.sqrt(hbar * c**5 / G) / kB           # K, 1.417e32
BODIES = (("Moon", 7.342e22), ("Earth", 5.972e24), ("Sun", M_sun), (r"Sgr A$^*$", 4.0e6 * M_sun))
MASSES = (1e11, 2e40)                                # kg: the ends of panel (b)
APART = 1.0                                          # points: lines that share a value, centre to centre


def history():
    """The photons' temperature (K), hottest first, with every step drawn sharp, and the three lines."""
    edges = [row[1] * pr.GEV / kB for row in pr.THERMAL_HISTORY] + [pr.NEUTRINOS_PART]
    T = [T_PLANCK, pr.T_CMB]
    for e in edges:
        T += [e * (1 + 1e-9), e * (1 - 1e-9)]
    T = np.array(sorted(T, reverse=True))
    return (T, *pr.comoving_temperatures(T))


def graviton_sky_figure():
    mf.setup_fonts()
    T, photons, neutrinos, gravitons = history()
    t_nu, t_g = neutrinos[-1] * pr.T_CMB, gravitons[-1] * pr.T_CMB
    m_eq, m_cmb = hawking_mass(t_g), hawking_mass(pr.T_CMB)
    # the text's numbers, pinned where they are drawn
    assert f"{t_g:.3f}" == "0.905" and f"{t_nu:.3f}" == "1.945" and abs(photons[-1] - 1) < 1e-12
    assert f"{m_eq:.3e}" == "1.356e+23" and f"{m_cmb:.2e}" == "4.50e+22"
    assert m_cmb < BODIES[0][1] < m_eq < BODIES[1][1]            # a hole of the Moon's mass lies between the skies

    H = 3.22
    fig = plt.figure(figsize=(mf.COL, H))
    a = fig.add_axes([0.135, 1.86 / H, 0.835, 1.04 / H])
    b = fig.add_axes([0.135, 0.36 / H, 0.835, 0.56 / H])

    # (a)
    up = offset_copy(a.transData, fig=fig, y=APART, units="points")
    down = offset_copy(a.transData, fig=fig, y=-APART, units="points")
    a.plot(T, neutrinos, color=mf.DIM, lw=mf.CURVE2, solid_capstyle="butt", solid_joinstyle="miter", zorder=2)
    # the photons beside the neutrinos while they share a value, and on their own value once the electrons have gone
    electrons = pr.THERMAL_HISTORY[7][1] * pr.GEV / kB
    shared = T > electrons
    a.plot(T[shared], photons[shared], color=mf.ACCENT2, lw=mf.CURVE2, transform=up, solid_capstyle="butt", solid_joinstyle="miter", zorder=3)
    a.plot(T[~shared | (T == T[shared][-1])], photons[~shared | (T == T[shared][-1])], color=mf.ACCENT2, lw=mf.CURVE2,
           solid_capstyle="butt", solid_joinstyle="miter", zorder=3)
    a.plot(T, gravitons, color=mf.ACCENT, lw=mf.CURVE2, transform=down, solid_capstyle="butt", zorder=3)
    a.set_xscale("log")
    a.set_xlim(T_PLANCK, pr.T_CMB)
    a.set_ylim(0, 1.24)
    a.set_yticks([0, 0.5, 1.0])
    a.set_xticks([1e30, 1e20, 1e10, pr.T_CMB])
    a.set_xticklabels([r"$10^{30}$", r"$10^{20}$", r"$10^{10}$", "today"])
    a.set_xticks([10.0**k for k in range(1, 32)], minor=True)
    a.tick_params(axis="x", which="minor", labelbottom=False)
    a.set_xlabel(r"temperature of the photons (K)")
    a.set_ylabel(r"$Ta$ (today's photons, 1)")
    right = pr.T_CMB * 1.6
    a.text(right, 1.0 + 0.05, rf"photons, ${pr.T_CMB:.4f}$\,K", fontsize=7, color=mf.ACCENT2, ha="right", va="bottom")
    a.text(right, neutrinos[-1] - 0.06, rf"neutrinos, ${t_nu:.3f}$\,K", fontsize=7, color=mf.DIM, ha="right", va="top")
    a.text(right, gravitons[-1] - 0.07, rf"gravitons, ${t_g:.3f}$\,K", fontsize=7, color=mf.ACCENT, ha="right", va="top")
    # the two large steps, named beside them
    confined = pr.THERMAL_HISTORY[5][1] * pr.GEV / kB
    a.text(confined * 4, 0.55, "quarks confined", fontsize=7, color=mf.DIM, ha="right", va="center")
    a.text(electrons * 4, 0.87, "electrons", fontsize=7, color=mf.DIM, ha="right", va="center")

    # (b)
    b.set_xscale("log")
    b.set_xlim(*MASSES)
    b.set_ylim(0, 1)
    b.set_yticks([])
    b.axvspan(m_eq, MASSES[1], color=mf.RULE, alpha=0.45, lw=0, zorder=0)
    b.axvspan(m_cmb, m_eq, color=mf.ACCENT, alpha=0.30, lw=0, zorder=0)
    b.set_xticks([10.0**k for k in range(12, 41, 4)])
    b.set_xticks([10.0**k for k in range(11, 41)], minor=True)
    b.tick_params(axis="x", which="minor", labelbottom=False)
    b.set_xlabel(r"mass of the hole (kg)")
    with np.errstate(divide="ignore"):       # matplotlib tries the scale at zero
        top = b.secondary_xaxis("top", functions=(lambda M: hawking_mass(1.0) / M, lambda t: hawking_mass(1.0) / t))
    top.set_xticks([10.0**k for k in range(-16, 13, 4)])
    top.set_xticklabels([r"$1$" if k == 0 else rf"$10^{{{k}}}$" for k in range(-16, 13, 4)])
    top.set_xticks([10.0**k for k in range(-17, 13)], minor=True)
    top.tick_params(axis="x", which="minor", labeltop=False)
    top.set_xlabel(r"Hawking temperature (K)")
    for name, M in BODIES:
        b.plot([M, M], [0, 0.2], color=mf.INK, lw=0.6, solid_capstyle="butt", zorder=3)
        if name == "Moon":
            b.text(M / 2.2, 0.06, name, fontsize=7, color=mf.INK, ha="right", va="bottom")
        else:
            b.text(M * 2.2, 0.06, name, fontsize=7, color=mf.INK, ha="left", va="bottom")
    b.text(math.sqrt(MASSES[0] * m_cmb), 0.76, "glows against both", fontsize=7, color=mf.DIM, ha="center", va="center")
    b.text(math.sqrt(m_eq * MASSES[1]), 0.76, "a shadow on both", fontsize=7, color=mf.DIM, ha="center", va="center")
    # the narrow band between the two skies, named beside it at the end of a hairline
    b.plot([math.sqrt(m_cmb * m_eq), 1.2e24], [0.46, 0.46], color=mf.INK, lw=0.4, solid_capstyle="butt", zorder=3)
    b.plot([math.sqrt(m_cmb * m_eq)], [0.46], "o", color=mf.INK, ms=1.6, mew=0, zorder=4)
    b.text(2.4e24, 0.46, "glows against the graviton sky", fontsize=7, color=mf.INK, ha="left", va="center")
    for ax in (a,):
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
    for side in ("left", "right"):
        b.spines[side].set_visible(False)
    mf.letter(a, "(a) three backgrounds, as the universe cools")
    b.set_title("(b) a black hole against the two skies", loc="left", fontsize=8, pad=26)
    mf.centre(fig)
    mf.trim(fig)
    mf.save(fig, "graviton-sky", web=True)
    return t_g, m_eq


if __name__ == "__main__":
    import os

    if os.environ.get("FIGURES_STAGING"):       # while a figure is being worked on: paper/figures/staging/
        mf.OUT = HERE / "staging"
    print(graviton_sky_figure())
