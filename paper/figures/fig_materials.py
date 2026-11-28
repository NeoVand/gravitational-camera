"""The friction of real materials at the frequencies of heat, and the colour of their glow.

    python paper/figures/fig_materials.py        (from the repository root)

Writes paper/figures/materials.pdf and .svg with the helpers of make_figures.py. Numbers come from
reference/gravcam/materials.py.
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import make_figures as mf  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

from gravcam import materials as M  # noqa: E402

# the paper's palette only: each colour twice at most, told apart by the dash (the bound iron dotted, as before);
# the two Raman lines are also named on their peaks in (b)
STYLES = {
    "copper": (mf.ACCENT2, "-"),
    "iron": (mf.ACCENT, mf.DOT),
    "silicon": (mf.INK, "-"),
    "diamond": (mf.DIM, "-"),
    "silica": (mf.ACCENT2, mf.DASH),
    "water": (mf.ACCENT, "-"),
}
NAMES = {"copper": "copper", "iron": "iron (upper bound)", "silicon": "silicon", "diamond": "diamond",
         "silica": "silica glass", "water": "water"}


def materials_figure():
    mf.setup_fonts()
    T = M.ROOM
    tab = M.table()
    flat = M.placeholder()
    f = np.geomspace(1.0, 100.0, 6000)                  # THz
    # resolve the narrow Raman lines
    for key in ("silicon", "diamond"):
        centre, width = tab[key].term("Raman line").lines[0]
        f = np.union1d(f, (centre + width * np.linspace(-40, 40, 801)) / M.THZ)
    w = f * M.THZ

    fig = plt.figure(figsize=(mf.FULL, 2.55))
    # both panels a little narrower than they could be, to leave room for the longest name in the legend
    a = fig.add_axes([0.075, 0.17, 0.355, 0.76])
    b = fig.add_axes([0.515, 0.17, 0.285, 0.76])

    # the band of heat at room temperature: where B_omega exceeds a tenth of its peak
    band = M.planck(w, T)
    hot = f[band > 0.1 * band.max()]
    for ax in (a,):
        ax.axvspan(hot[0], hot[-1], color=mf.RULE, alpha=0.35, lw=0, zorder=0)

    # (a) the friction
    a.axhline(M.PLACEHOLDER, color=mf.INK, lw=0.8, ls=mf.DASH, zorder=2)
    for key, m in tab.items():
        eta = m.re_eta(w, T)
        colour, ls = STYLES[key]
        assert (ls == mf.DOT) == m.bound
        a.plot(f, np.where(eta >= 1e-8, eta, np.nan), color=colour, lw=1.0, ls=ls, zorder=3, label=NAMES[key])
    a.set_xscale("log")
    a.set_yscale("log")
    a.set_xlim(1, 100)
    a.set_ylim(1e-8, 1e-1)
    a.set_xlabel(r"frequency $\omega/2\pi$ (THz)")
    a.set_ylabel(r"$\mathrm{Re}\,\eta(\omega)$ (Pa\,s)")
    a.set_xticks([1, 10, 100])
    a.set_xticklabels(["1", "10", "100"])
    a.text(hot[0] * 1.08, 4.5e-2, r"heat at 293\,K", fontsize=6.5, color=mf.DIM, va="bottom")
    mf.letter(a, "(a)")

    # (b) the glow: power per volume per unit frequency, 4 pi j_omega domega/df
    fb = np.linspace(0.05, 60.0, 6000)
    for key in ("silicon", "diamond"):
        centre, width = tab[key].term("Raman line").lines[0]
        fb = np.union1d(fb, (centre + width * np.linspace(-40, 40, 801)) / M.THZ)
    wb = fb * M.THZ
    per_thz = 4 * np.pi * M.THZ
    b.plot(fb, per_thz * M.spectral_emissivity(flat, wb, T), color=mf.INK, lw=0.8, ls=mf.DASH, zorder=2)
    for key, m in tab.items():
        g = per_thz * M.spectral_emissivity(m, wb, T)
        colour, ls = STYLES[key]
        b.plot(fb, np.where(g >= 1e-40, g, np.nan), color=colour, lw=1.0, ls=ls, zorder=3)
    b.set_yscale("log")
    b.set_xlim(0, 60)
    b.set_ylim(1e-40, 1e-33)
    b.set_xlabel(r"frequency $\omega/2\pi$ (THz)")
    b.set_ylabel(r"glow (W\,m$^{-3}$\,THz$^{-1}$)")
    mf.letter(b, "(b)")
    si_f = M.SI["omega0"] / M.THZ
    di_f = M.DIAMOND["omega0"] / M.THZ
    peak = lambda key, x: 4 * np.pi * M.THZ * float(M.spectral_emissivity(tab[key], x * M.THZ, T))
    b.annotate(r"Si, 520\,cm$^{-1}$", xy=(si_f + 0.6, peak("silicon", si_f)), xytext=(23, 2.4e-34), fontsize=6.5,
               color=mf.DIM, va="center", arrowprops=dict(arrowstyle="-", lw=0.5, color=mf.FAINT, shrinkA=1, shrinkB=1))
    # ending short of the frame at the right, above the line's peak
    b.annotate(r"C, 1333\,cm$^{-1}$", xy=(di_f + 0.5, peak("diamond", di_f)), xytext=(57.5, 1.0e-34), fontsize=6.5,
               color=mf.DIM, ha="right", va="center", arrowprops=dict(arrowstyle="-", lw=0.5, color=mf.FAINT,
                                                                      shrinkA=1, shrinkB=1))

    # open at the top and the right, as the other charts
    for ax in (a, b):
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        ax.tick_params(which="both", top=False, right=False)
    handles, labels = a.get_legend_handles_labels()
    ph, = a.plot([], [], color=mf.INK, lw=0.8, ls=mf.DASH)
    # hung on (b), so that it moves with the axes when the figure is centred
    b.legend(handles + [ph], labels + ["placeholder"], loc="center left", bbox_to_anchor=(1.03, 0.5), fontsize=7,
             handlelength=2.2)
    mf.centre(fig)
    mf.trim(fig)
    mf.save(fig, "materials", web=True)


if __name__ == "__main__":
    materials_figure()
