"""The weight of a black hole's response to a tide, by frequency (Eq. hole-sum-rule).

    python paper/figures/fig_hole_response.py        (from the repository root)

Writes paper/figures/hole-response.pdf and .svg with the helpers of make_figures.py. The fraction Gamma_2 of a
quadrupole wave that a hole absorbs comes from reference/gravcam/bhmodes.py (transmission), on a grid fine enough
to draw; the sum it is checked against is reference/gravcam/holeresponse.py (sum_rule), which uses its own grid.

(a) The integrand of the sum, (5 / 32 pi) Gamma_2 / x^4 with x = G M omega / c^3, in units of M r_s^2 per unit of
x. (b) The sum up to each frequency, which tends to 0.345 M r_s^2; the levels drawn are the sums of two round
bodies of the hole's mass, (1/3) M <r^2>: a thin shell at r_s, 1/3, and a uniform ball of radius r_s, 1/5. Both
curves are drawn from zero frequency (below the grid by Page's law, which is all but zero there) to the right edge
of the axes, where the sum is still 0.004 short of its limit. (c) The same weight for the tide of each degree l, as
the radius R_l of the thin shell of the hole's mass that has it (holeresponse.degree_shell_radius), with the limit
3 sqrt 3 / e of large l (holeresponse.SHARP_LIMIT).
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

from gravcam import holeresponse as hr  # noqa: E402
from gravcam.bhmodes import transmission  # noqa: E402

DEGREES = range(2, 9)                    # the tides of panel (c), l = 2 to 8
X_SHOWN = 1.8                            # the right edge of the axes
X_LOW, X_HIGH, N = 0.03, X_SHOWN, 241    # the grid of the drawing, equally spaced in ln x
PREFACTOR = 5.0 / (32.0 * math.pi)       # (2/pi) int omega Im chi d omega = PREFACTOR M r_s^2 int Gamma_2 x^-4 dx


def response():
    """x, the integrand and the sum up to x, with the whole sum: the part below the grid by Page's law, Gamma_2 =
    (256/225) x^6, and the part above it with Gamma_2 = 1."""
    x = np.geomspace(X_LOW, X_HIGH, N)
    gamma = np.array([transmission(2, float(v), reach=60.0, far=120.0)[0] for v in x])
    integrand = PREFACTOR * gamma / x**4
    steps = 0.5 * (integrand[1:] * x[1:] + integrand[:-1] * x[:-1]) * np.diff(np.log(x))
    below = PREFACTOR * hr.PAGE * x[0] ** 3 / 3
    upto = below + np.concatenate([[0.0], np.cumsum(steps)])
    total = upto[-1] + PREFACTOR * x[-1] ** -3 / 3
    # from zero frequency to the grid: Page's law
    start = np.linspace(0.0, x[0], 12, endpoint=False)
    x = np.concatenate([start, x])
    integrand = np.concatenate([PREFACTOR * hr.PAGE * start**2, integrand])
    upto = np.concatenate([PREFACTOR * hr.PAGE * start**3 / 3, upto])
    return x, integrand, upto, total


C_HEIGHT = 0.80                          # inches: the height of panel (c)
C_BOTTOM = 0.38                          # inches: its bottom, room for its x label
C_DROP = C_BOTTOM + C_HEIGHT + 0.183     # inches: how far (a) and (b) are raised to make room for (c)


def hole_response_figure():
    mf.setup_fonts()
    x, integrand, upto, total = response()
    # the drawing's own sum against the reference implementation's, and against the number in the text
    assert abs(total - hr.sum_rule()) < 2e-4, (total, hr.sum_rule())
    assert f"{total:.3f}" == "0.345" and f"{hr.shell_radius():.2f}" == "1.02"
    assert f"{x[integrand.argmax()]:.2f}" == "0.40"            # the caption: where the integrand is greatest

    radii = [hr.degree_shell_radius(l) for l in DEGREES]
    # the caption's numbers, pinned where they are drawn
    assert f"{radii[0]:.2f}" == "1.02" and f"{hr.SHARP_LIMIT:.2f}" == "1.91"
    assert all(r < s for r, s in zip(radii, radii[1:])) and radii[-1] < hr.SHARP_LIMIT
    assert f"{hr.three_tide_minimum(hr.hole_moments())[0]:.2f}" == "-2.04"

    # in inches from the bottom of the figure before it is trimmed: (a) and (b) as they were, (c) below (b)
    H = 2.62 + C_DROP
    def box(y0, h):
        return [0.135, y0 / H, 0.835, h / H]
    fig = plt.figure(figsize=(mf.COL, H))
    a = fig.add_axes(box(C_DROP + 0.635 * 2.62, 0.275 * 2.62))
    b = fig.add_axes(box(C_DROP + 0.145 * 2.62, 0.385 * 2.62), sharex=a)
    c = fig.add_axes(box(C_BOTTOM, C_HEIGHT))
    assert x[0] == 0.0 and abs(x[-1] - X_SHOWN) < 1e-12
    a.fill_between(x, 0, integrand, color=mf.ACCENT, alpha=0.16, lw=0)
    a.plot(x, integrand, color=mf.ACCENT, lw=mf.CURVE, solid_capstyle="butt", clip_on=False)
    a.set_ylim(0, 1.62)                      # the top tick below the panel's letter
    a.set_yticks([0, 0.5, 1.0, 1.5])
    a.set_ylabel(r"density")
    a.tick_params(labelbottom=False)

    for level, name in ((1 / 3, r"a shell at $r_s$"), (1 / 5, r"a ball of radius $r_s$")):
        b.axhline(level, color=mf.RULE, lw=0.6, zorder=0)
        b.text(X_SHOWN - 0.03, level - 0.014, name, fontsize=7, color=mf.DIM, va="top", ha="right")
    b.plot(x, upto, color=mf.ACCENT, lw=mf.CURVE, solid_capstyle="butt", clip_on=False)
    b.text(X_SHOWN - 0.03, total + 0.016, rf"a black hole, ${total:.3f}$", fontsize=7, color=mf.ACCENT, ha="right", va="bottom")
    b.set_xlim(0, X_SHOWN)
    b.set_ylim(0, 0.44)
    b.set_xticks([0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8])
    b.set_yticks([0, 0.1, 0.2, 0.3, 0.4])
    b.set_xlabel(r"frequency, $GM\omega/c^3$")
    b.set_ylabel(r"weight ($Mr_s^2$)")
    # the limit's label under its line at the left, where the radii are small; the horizon's over its line at the
    # right, where they are large
    for level, name, x, gap, where, side in ((hr.SHARP_LIMIT, rf"the limit, ${hr.SHARP_LIMIT:.2f}$", 1.85, -0.035, "top", "left"),
                                             (1.0, "the horizon", 8.15, 0.035, "bottom", "right")):
        c.axhline(level, color=mf.RULE, lw=0.6, zorder=0)
        c.text(x, level + gap, name, fontsize=7, color=mf.DIM, va=where, ha=side)
    c.plot(list(DEGREES), radii, color=mf.ACCENT, lw=mf.CURVE2, solid_capstyle="butt", zorder=2)
    c.plot(list(DEGREES), radii, "o", color=mf.ACCENT, ms=2.6, mew=0, zorder=3)
    c.set_xlim(1.75, 8.25)
    c.set_ylim(0.9, 2.0)
    c.set_xticks(list(DEGREES))
    c.set_yticks([1.0, 1.5])                 # no tick at the top, under the panel's letter
    c.set_xlabel("degree of the tide")
    c.set_ylabel(r"radius ($r_s$)")
    for ax in (a, b, c):
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
    mf.letter(a, r"(a) the weight of the response, by frequency")
    mf.letter(b, "(b) the weight below each frequency")
    mf.letter(c, "(c) the same, for the tide of each degree")
    mf.centre(fig)
    mf.trim(fig)
    mf.save(fig, "hole-response", web=True)
    return total


if __name__ == "__main__":
    import os

    if os.environ.get("FIGURES_STAGING"):       # while a figure is being worked on: paper/figures/staging/
        mf.OUT = HERE / "staging"
    print("the sum:", hole_response_figure(), " the shell's radius:", hr.shell_radius())
