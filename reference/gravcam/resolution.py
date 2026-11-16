"""How sharp a near-field image can be: the point-spread function of the best
linear reconstruction (Wiener filter) from a planar array of tidal sensors.

    python -m gravcam.resolution        # writes results/near_field_resolution.json

Setting. Sensors fill the plane z = 0 and record E_zz, the tidal field along
the normal, with white noise of spectral density N0. The sources are a sheet
of surface density sigma(x, y) at distance z. In Fourier space over the plane
(wavenumber k, 2D) the potential of the sheet is -2 pi G sigma_hat e^{-kz} / k,
so the data are

    d_hat(k) = T(k) sigma_hat(k) + noise,      T(k) = 2 pi G k e^{-kz}.

(E_zz of a uniform sheet is zero, hence the factor k: the array cannot see the
mean, only its variations.) In a one-dimensional slice, line masses below a
row of sensors, T(k) has the same form with |k|.

Signal-to-noise. For a point mass m the peak signal is 2 G m / z^3. Define
SNR as that peak divided by the noise of the field averaged over a patch z x z
(a length z in a slice): the patch the size of the signal itself. With a
white prior on the sources (point-like, power m^2), the Wiener filter's
overall transfer from true to reconstructed source, as a function of q = k z,
is then free of every other parameter:

    H(q) = S^2 / (1 + S^2),        S(q) = pi SNR q e^{-q}.

H is 1/2 where S = 1, at q_c with q_c e^{-q_c} = 1 / (pi SNR), which is
q_c = -W_{-1}(-1 / (pi SNR)) ~ ln SNR + ln ln SNR + ln pi.

The point-spread function in the source plane, in units of z, is the inverse
transform of H: (1 / 2 pi) int H(q) J0(q rho) q dq in two dimensions and
(1 / pi) int H(q) cos(q x) dq in a slice. For large SNR, H tends to a sharp
step at q_c and the PSF to the diffraction pattern of a circular (or
slit-shaped) pupil, 2 J1(q_c r) / (q_c r) or sin(q_c x) / (q_c x). A
reconstruction is an amplitude, not an intensity, so the full width at half
maximum is 4.4302 / q_c (2D) or 3.7910 / q_c (1D). The paper's estimate Delta theta ~ pi / ln SNR is the
leading term of the same law.

Nothing here needs scipy: the Bessel functions come from their integral
representations on Gauss-Legendre nodes (exact to rounding for the arguments
used, |x| < 30), and the transforms are trapezoid sums on a grid in q fine
enough that the integrand, which decays like q^3 e^{-2q} beyond q_c, is
resolved and truncated far below rounding.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
from numpy.polynomial import legendre

RESULTS_DIR = Path(__file__).resolve().parents[1] / "results"

# half maximum and first zero of the large-SNR limits, in units of 1 / q_c
JINC_HALF = 2.2150893677242376      # 2 J1(x) / x = 1/2 (amplitude, not the Airy intensity)
JINC_ZERO = 3.8317059702075125      # J1(x) = 0
SINC_HALF = 1.8954942670339809      # sin(x) / x = 1/2
SINC_ZERO = math.pi

_THETA, _W_THETA = legendre.leggauss(96)
_THETA = 0.5 * math.pi * (_THETA + 1.0)        # nodes on [0, pi]
_W_THETA = 0.5 * math.pi * _W_THETA


def bessel_j0(x):
    """J0(x) = (1 / pi) int_0^pi cos(x sin t) dt."""
    x = np.asarray(x, dtype=np.float64)
    return np.tensordot(np.cos(x[..., None] * np.sin(_THETA)), _W_THETA, axes=1) / math.pi


def bessel_j1(x):
    """J1(x) = (1 / pi) int_0^pi cos(t - x sin t) dt."""
    x = np.asarray(x, dtype=np.float64)
    return np.tensordot(np.cos(_THETA - x[..., None] * np.sin(_THETA)), _W_THETA, axes=1) / math.pi


def transfer(q, snr: float):
    """H(q), the Wiener filter's transfer from true to reconstructed source."""
    q = np.asarray(q, dtype=np.float64)
    # S^2 / (1 + S^2) = 1 / (1 + S^-2), with S^-2 formed in logs to avoid overflow
    log_s = math.log(math.pi * snr) + np.log(np.maximum(q, 1e-300)) - q
    return np.where(q > 0, 1.0 / (1.0 + np.exp(np.minimum(-2.0 * log_s, 700.0))), 0.0)


def cutoff(snr: float) -> float:
    """q_c: the larger root of q e^{-q} = 1 / (pi SNR), where H = 1/2."""
    if not math.pi * snr > math.e:
        raise ValueError("SNR too small: S(q) never reaches 1")
    target = math.log(math.pi * snr)            # q - ln q = target, q > 1
    q = target + math.log(target)
    for _ in range(60):
        step = (q - math.log(q) - target) / (1.0 - 1.0 / q)
        q -= step
        if abs(step) < 1e-15 * q:
            break
    return q


def _grid(snr: float, per_unit: int = 64):
    q_max = cutoff(snr) + 40.0                  # H < 1e-30 beyond
    n = int(per_unit * q_max) + 1
    q = np.linspace(0.0, q_max, n)
    w = np.full(n, q[1] - q[0])
    w[0] = w[-1] = 0.5 * w[0]
    return q, w


def _weighted_transfer(snr: float):
    """Trapezoid weights times H on the grid. H(0) = 0, but H climbs to 1
    within q ~ 1 / (pi SNR), far inside the first cell, so the end point takes
    the right-hand limit 1; what this leaves out is 1 / (2 SNR) of the
    integral, below 1e-5 of it for SNR >= 100."""
    q, w = _grid(snr)
    h = transfer(q, snr)
    h[0] = 1.0
    return q, h * w


def psf(r, snr: float, dims: int = 2):
    """The point-spread function at distances r (units of z) from the source,
    normalised to 1 at r = 0."""
    r = np.atleast_1d(np.asarray(r, dtype=np.float64))
    q, h = _weighted_transfer(snr)
    if dims == 2:
        values = np.array([np.sum(h * q * bessel_j0(q * x)) for x in r])
        peak = np.sum(h * q)
    elif dims == 1:
        values = np.array([np.sum(h * np.cos(q * x)) for x in r])
        peak = np.sum(h)
    else:
        raise ValueError("dims must be 1 or 2")
    return values / peak


def psf_curvature(r, snr: float, dims: int = 2):
    """Second derivative of the PSF along a line through its centre, at r > 0
    (same normalisation as ``psf``)."""
    r = np.atleast_1d(np.asarray(r, dtype=np.float64))
    q, h = _weighted_transfer(snr)
    if dims == 2:
        # d^2/dr^2 J0(q r) = q^2 (-J0(x) + J1(x) / x), x = q r
        out = []
        for x in r:
            arg = q * x
            safe = np.where(arg > 0, arg, 1.0)
            second = np.where(arg > 0, -bessel_j0(arg) + bessel_j1(arg) / safe, -0.5)
            out.append(np.sum(h * q**3 * second))
        return np.array(out) / np.sum(h * q)
    return np.array([-np.sum(h * q**2 * np.cos(q * x)) for x in r]) / np.sum(h)


def _bisect(f, a: float, b: float, tol: float = 1e-12) -> float:
    fa = f(a)
    if fa * f(b) > 0:
        raise ValueError("no sign change")
    for _ in range(200):
        m = 0.5 * (a + b)
        fm = f(m)
        if (fm > 0) == (fa > 0):
            a, fa = m, fm
        else:
            b = m
        if b - a < tol * b:
            break
    return 0.5 * (a + b)


def _first_crossing(f, a: float, b: float, steps: int = 64):
    """The first root of f in (a, b), located on a grid then bisected; None if
    f keeps its sign."""
    xs = np.linspace(a, b, steps + 1)
    previous = f(xs[0])
    for x0, x1 in zip(xs[:-1], xs[1:]):
        current = f(x1)
        if (current > 0) != (previous > 0):
            return _bisect(f, x0, x1)
        previous = current
    return None


def widths(snr: float, dims: int = 2) -> dict:
    """Full width at half maximum, the two-point (Sparrow) limit and the first
    zero of the PSF (None if a soft cutoff leaves it without one), in units of z."""
    qc = cutoff(snr)
    half, zero = (JINC_HALF, JINC_ZERO) if dims == 2 else (SINC_HALF, SINC_ZERO)
    f = lambda x: float(psf(x, snr, dims)[0])
    r_half = _first_crossing(lambda x: f(x) - 0.5, 1e-3 * half / qc, 4.0 * half / qc)
    r_zero = _first_crossing(f, r_half, 4.0 * zero / qc)
    # two equal points at separation s show a dip between them once the PSF
    # curves upward at s / 2: its first inflection point
    r_inflect = _first_crossing(lambda x: float(psf_curvature(x, snr, dims)[0]), 1e-3 * half / qc,
                                r_zero if r_zero is not None else 4.0 * zero / qc)
    return {"fwhm": 2.0 * r_half, "sparrow": 2.0 * r_inflect, "first_zero": r_zero, "q_c": qc}


DECADES = (2, 3, 4, 6, 10, 15, 20, 30, 40, 60, 100)


def study(decades=DECADES) -> dict:
    rows = []
    for n in decades:
        snr = 10.0**n
        ln = math.log(snr)
        row = {"snr_decades": n, "ln_snr": ln, "q_c": cutoff(snr)}
        for dims, key in ((2, "array"), (1, "slice")):
            w = widths(snr, dims)
            row[key] = {
                "fwhm": w["fwhm"], "sparrow": w["sparrow"], "first_zero": w["first_zero"],
                "fwhm_times_ln_snr": w["fwhm"] * ln,
                "fwhm_times_q_c": w["fwhm"] * w["q_c"],
            }
        rows.append(row)
    return {
        "what": "Point-spread function of the Wiener reconstruction of point masses at depth z from a planar "
                "array (2D, 'array') or a row (1D, 'slice') of sensors recording E_zz with white noise.",
        "snr_definition": "peak E_zz of a point mass divided by the noise of E_zz averaged over a z x z patch "
                          "(a length z in a slice)",
        "transfer": "H(q) = S^2 / (1 + S^2), S = pi SNR q e^{-q}, q = k z",
        "units": "widths in units of the depth z (equivalently, radians of angle at the array)",
        "limits": {
            "array_fwhm_times_q_c": 2 * JINC_HALF, "slice_fwhm_times_q_c": 2 * SINC_HALF,
            "note": "as SNR -> infinity H becomes a step at q_c and the PSF a jinc (2D) or sinc (1D)",
        },
        "generator": "python -m gravcam.resolution",
        "rows": rows,
        "profiles": profiles(),
    }


PROFILE_DECADES = (3, 6, 20)
PROFILE_POINTS = (0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 9.0)    # distance x q_c


def profiles() -> list[dict]:
    """The point-spread function sampled at a few distances, for checking
    other implementations; distances are given in units of z and of 1 / q_c."""
    out = []
    for n in PROFILE_DECADES:
        qc = cutoff(10.0**n)
        r = np.array(PROFILE_POINTS) / qc
        out.append({
            "snr_decades": n,
            "q_c": qc,
            "r_times_q_c": list(PROFILE_POINTS),
            "r": r.tolist(),
            "array": psf(r, 10.0**n, 2).tolist(),
            "slice": psf(r, 10.0**n, 1).tolist(),
        })
    return out


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="python -m gravcam.resolution", description=__doc__.split("\n")[0])
    parser.add_argument("--out", type=Path, default=RESULTS_DIR / "near_field_resolution.json")
    args = parser.parse_args(argv)
    result = study()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(f"{'SNR':>8} {'q_c':>7} {'FWHM ln SNR (2D)':>17} {'(1D)':>7} {'Sparrow ln SNR (2D)':>20}")
    for row in result["rows"]:
        print(f"  1e{row['snr_decades']:<4d} {row['q_c']:7.2f} {row['array']['fwhm_times_ln_snr']:17.3f} "
              f"{row['slice']['fwhm_times_ln_snr']:7.3f} {row['array']['sparrow'] * row['ln_snr']:20.3f}")
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
