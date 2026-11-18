"""The figure of paper/drafts/separation_noise.tex: telling a wave from nearby pull, and depth, with noise.

    python3 paper/figures/fig_separation_noise.py        (from the repository root)

writes paper/figures/separation-noise.pdf and .svg with the helpers of make_figures.py. Every curve is computed here
by reference/gravcam/separation_noise.py: thin black lines are closed forms, blue lines the Cramer-Rao bounds of the
full models, and orange dots the spread of maximum-likelihood fits to simulated noisy readings.
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

from gravcam import separation_noise as sn  # noqa: E402
from gravcam.constants import G  # noqa: E402
from scipy.optimize import least_squares  # noqa: E402

R = 3.0                         # m, the source's distance
THETA, PHI = 1.1, 0.7           # direction of the mass in (b) and (c)
X = np.logspace(math.log10(0.02), math.log10(0.5), 40)      # b / r
TRIALS = 2000                   # simulated readings per point: the spread of a point about its bound, ~1/sqrt(2 TRIALS)
TRIALS_FAST = 10000             # the same for (b) and (c), whose fits are quick


def separation_curves(rng):
    omega, k, xs, Q = sn.example_geometry()
    theta = sn.example_theta()
    curves, dots = {}, {}
    for channels in ("E", "EB"):
        curves[channels] = [sn.array_cost(sn.ArrayModel(k, omega, sn.cross_stencil(x * R), channels), theta)[0]
                            for x in X]
        pts = []
        for x in (0.05, 0.1, 0.2, 0.4):
            model = sn.ArrayModel(k, omega, sn.cross_stencil(x * R), channels)
            truth = model.signal(theta)
            # the wave alone, fitted from the same pixels and channels, and the joint fit, both simulated
            Ew, Bw = sn.wave_fields(k, 1e-21, 0.0, omega, np.zeros((1, 3)))
            sigma_f = np.linalg.norm(sn.as_real(sn.readings(Ew, Bw))) / 20.0
            fits = np.array([model.fit(truth + rng.normal(size=truth.shape) * sigma_f, xs) for _ in range(TRIALS)])
            alone = sn.covariance(model.wave_columns, sigma_f)
            pts.append((x, math.sqrt(np.sum(fits[:, :4].var(axis=0)) / np.trace(alone))))
        dots[channels] = np.array(pts)
    # one pixel, E and B, any near field: sqrt 2, by simulation with the rotor present
    En, _ = sn.rotor_fields(np.zeros((1, 3)), xs, sn.EXAMPLE["rotor_axis"], 1.0, 0.12, omega / 2)
    Ew, Bw = sn.wave_fields(k, 1e-21, 0.0, omega, np.zeros((1, 3)))
    wave = sn.as_real(sn.readings(Ew, Bw))
    truth = sn.as_real(sn.readings(Ew + En, Bw))
    sigma_f = np.linalg.norm(wave) / 10.0
    Jw = sn._wave_columns(k, omega, np.zeros((1, 3)), "EB")
    J = np.hstack([Jw, sn._free_near_columns(1, "EB")])
    joint = np.array([np.linalg.lstsq(J, truth + rng.normal(size=truth.shape) * sigma_f, rcond=None)[0][:4]
                      for _ in range(4000)])
    dots["pixel"] = math.sqrt(np.sum(joint.var(axis=0)) / np.trace(sn.covariance(Jw, sigma_f)))
    return curves, dots


def depth_curves(rng):
    M = 70.0
    sigma1 = math.sqrt(6.0) * G * M / R ** 3                  # rho = 1
    exact = [math.sqrt(sn.depth_covariance(M, R, THETA, PHI, sn.cross_stencil(x * R), sigma1)[1, 1]) for x in X]
    closed = [sn.depth_bound(1.0, x)[0] for x in X]
    pts = []
    for x in (0.03, 0.08, 0.2, 0.4):
        rho = 50.0 * sn.depth_bound(1.0, x)[0]               # sigma_r / r near 2 per cent: the linear regime
        pos = sn.cross_stencil(x * R)
        sigma = sigma1 / rho
        p0 = np.array([math.log(M), math.log(R), THETA, PHI])
        truth = sn.point_mass_readings(p0, pos)
        est = [least_squares(lambda p: (sn.point_mass_readings(p, pos) - y) / sigma, p0).x[1]
               for y in truth + rng.normal(size=(TRIALS_FAST, truth.size)) * sigma]
        pts.append((x, np.std(est) * rho))
    return np.array(exact), np.array(closed), np.array(pts)


def two_body_curves(rng):
    """sqrt(rho) Delta_min / r, Delta_min = r sqrt(sigma_u) the separation at which two equal masses on one line are
    told from one at one standard deviation (u = (Delta/r)^2, Var(s)/r^2 = u/4)."""
    M = 70.0
    sigma1 = math.sqrt(6.0) * G * M / R ** 3
    n = sn.direction(THETA, PHI)
    exact = [math.sqrt(math.sqrt(sn.two_body_covariance(M, R, 1e-6, THETA, PHI, sn.cross_stencil(x * R),
                                                        sigma1)[2, 2])) for x in X]
    closed = [2.0 / math.sqrt(sn.curvature_snr(1.0, x, n)) for x in X]
    pts = []
    for x in (0.03, 0.08, 0.2):
        rho = 4e4 / sn.curvature_snr(1.0, x, n)              # sigma_u = 1e-4, so that u stays small
        pos = sn.cross_stencil(x * R)
        sigma = sigma1 / rho
        u0 = 8e-4
        p0 = np.array([math.log(M), math.log(R), u0, THETA, PHI])
        truth = sn.two_body_readings(p0, pos)
        est = [least_squares(lambda p: (sn.two_body_readings(p, pos) - y) / sigma, p0,
                             x_scale=[1, 1, u0, 1, 1]).x[2]
               for y in truth + rng.normal(size=(TRIALS_FAST, truth.size)) * sigma]
        pts.append((x, math.sqrt(np.std(est) * rho)))
    return np.array(exact), np.array(closed), np.array(pts)


def compute():
    rng = np.random.default_rng(20261117)
    return {"sep": separation_curves(rng), "depth": depth_curves(rng), "two": two_body_curves(rng)}


def separation_noise(data=None):
    data = compute() if data is None else data
    curves, dots = data["sep"]
    d_exact, d_closed, d_pts = data["depth"]
    t_exact, t_closed, t_pts = data["two"]

    fig, (a, b, c) = plt.subplots(1, 3, figsize=(mf.FULL, 2.3))
    for ax in (a, b, c):                    # scales first: setting them later resets the ticks
        ax.set_xscale("log")
        ax.set_yscale("log")
    dot = dict(ms=3.0, color=mf.ACCENT, mec="none", zorder=4, ls="none", marker="o")
    # (a) the cost of the rotor to the wave
    a.plot(X, np.full_like(X, math.sqrt(2.0)), color=mf.INK, lw=0.7)
    a.plot([0.025], [dots["pixel"]], **dot)
    a.plot(X, curves["E"], color=mf.ACCENT2, lw=1.0)
    a.plot(X, curves["EB"], color=mf.ACCENT2, lw=1.0, ls=(0, (3.5, 2)))
    for key in ("E", "EB"):
        a.plot(dots[key][:, 0], dots[key][:, 1], **dot)
    # each label beside its own line: the one pixel's above it, the array's with B below the dashed line, the
    # array's with E alone just right of its line
    a.text(0.021, 1.56, r"one pixel, $\mathcal{E}$ and $\mathcal{B}$", fontsize=7, color=mf.INK, va="bottom")
    a.text(0.021, 1.175, r"array, $\mathcal{E}$ and $\mathcal{B}$", fontsize=7, color=mf.ACCENT2, ha="left",
           va="center")
    at = math.exp(np.interp(math.log(5.0), np.log(curves["E"][::-1]), np.log(X[::-1])))
    a.text(at * 1.22, 5.0, r"array, $\mathcal{E}$", fontsize=7, color=mf.ACCENT2, ha="left", va="center")
    a.set_ylim(0.9, 25)
    a.set_yticks([1, 2, 5, 10, 20])
    a.set_yticklabels(["1", "2", "5", "10", "20"])
    a.set_ylabel(r"cost to the wave, $D$")
    mf.letter(a, "(a)")
    # (b) the range of one mass
    b.plot(X, d_closed, color=mf.INK, lw=0.7)
    b.plot(X, d_exact, color=mf.ACCENT2, lw=1.0)
    b.plot(d_pts[:, 0], d_pts[:, 1], **dot)
    b.text(0.12, 2.0, r"$\bigl(\tfrac17 + \tfrac{r^2}{30 b^2}\bigr)^{1/2}$", fontsize=7.5, ha="left",
           va="bottom")
    b.set_ylim(0.2, 15)
    b.set_yticks([0.3, 1, 3, 10])
    b.set_yticklabels(["0.3", "1", "3", "10"])
    b.set_ylabel(r"$\rho\,\sigma_r/r$")
    mf.letter(b, "(b)")
    # (c) two masses on one line
    c.plot(X, t_closed, color=mf.INK, lw=0.7)
    c.plot(X, t_exact, color=mf.ACCENT2, lw=1.0)
    c.plot(t_pts[:, 0], t_pts[:, 1], **dot)
    c.text(0.1, 8.5, r"$2\,(\rho/\rho_H)^{1/2}$", fontsize=7.5, ha="left", va="bottom")
    c.set_ylim(0.8, 50)
    c.set_yticks([1, 3, 10, 30])
    c.set_yticklabels(["1", "3", "10", "30"])
    c.set_ylabel(r"$\rho^{1/2}\,\Delta_{\min}/r$")
    mf.letter(c, "(c)")
    for ax in (a, b, c):
        ax.minorticks_off()
        ax.set_xlim(0.018, 0.55)
        ax.set_xticks([0.02, 0.05, 0.1, 0.2, 0.5])
        ax.set_xticklabels(["0.02", "0.05", "0.1", "0.2", "0.5"])
        ax.set_xlabel(r"$b/r$", labelpad=2)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
    fig.subplots_adjust(left=0.07, right=0.99, top=0.91, bottom=0.18, wspace=0.36)
    mf.centre(fig)
    def over_bound(pts, curve):
        return pts[:, 1] / np.exp(np.interp(np.log(pts[:, 0]), np.log(X), np.log(curve)))

    print(f"  separation-noise, simulated spread over its bound ({TRIALS} and {TRIALS_FAST} trials): (a) E",
          np.round(over_bound(dots["E"], curves["E"]), 3), "E and B", np.round(over_bound(dots["EB"], curves["EB"]), 3),
          f"one pixel {dots['pixel'] / math.sqrt(2):.3f}; (b)", np.round(over_bound(d_pts, d_exact), 3),
          "(c)", np.round(over_bound(t_pts, t_exact), 3))
    # the numbers this figure shows agree with the closed forms where they apply
    assert abs(d_exact[0] / d_closed[0] - 1) < 0.01 and abs(t_exact[0] / t_closed[0] - 1) < 0.02
    assert abs(dots["pixel"] / math.sqrt(2.0) - 1) < 0.05
    mf.save(fig, "separation-noise", web=True)


if __name__ == "__main__":
    mf.setup_fonts()
    separation_noise()
