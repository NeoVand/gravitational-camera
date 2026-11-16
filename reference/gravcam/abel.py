"""The thermal Earth, inverted: what one camera on the surface learns of the layers below (paper, Section IX).

From a camera at distance rho from the centre of a spherically symmetric body of radius R <= rho, the line of
sight at angle theta from straight down passes the centre at the impact parameter p = rho sin(theta) and, when
p < R, crosses the whole chord at that distance. Its brightness, Eq. (column), is then

    N(p) = 2 int_p^R j(r) r dr / sqrt(r^2 - p^2),

the Abel transform of the emissivity profile j(r), whose inverse is

    j(r) = -(1/pi) int_r^R N'(p) dp / sqrt(p^2 - r^2).

One camera therefore holds the whole radial profile, not a projection of it: the body's symmetry supplies the
other viewpoints that tomography would need.

For shells of uniform emissivity, j_k between the radii r_k and r_{k+1}, the inversion is a peeling. The line of
sight that grazes the inner edge of a shell crosses only that shell and the ones above it, so the outermost
emissivity is read first and each deeper one in turn (onion peeling). Where j jumps, at a boundary of radius r,
dN/dp diverges as (r - p)^{-1/2}: the brightness has a kink at sin(theta) = r / rho. Its place is geometry alone;
the friction, the temperature and the exposure set only the heights.

What the heights measure. With j_E = alpha sigma T^4 / pi, alpha = 16 pi G eta / c^3, and j_N = j_E / (2.701 k T),

    j_N = 16 G eta sigma T^3 / (2.701 k c^3):

counted gravitons measure eta T^3 in each shell, their energy eta T^4, and the two together, if the friction is
flat across the thermal band, the temperature (the mean energy, 2.701 k T) and the friction separately.

Counts. A detector of area A that collects from every direction for a time tau, with the counts pooled over
azimuth in rings theta_a < theta < theta_b, expects A tau sum_k j_k X_k counts in each ring, where X_k is the
solid-angle-weighted chord length of shell k over the ring. In u = cos(theta), with a^2 = 1 - r^2 / rho^2 for a
boundary of radius r,

    int 2 sqrt(r^2 - rho^2 sin^2 theta) 2 pi sin(theta) d(theta)  =  G_r(cos theta_a) - G_r(cos theta_b),
    G_r(u) = 2 pi rho [u s - a^2 ln((u + s) / a)],  s = sqrt(u^2 - a^2),  for u >= a (and 0 below),

with dG_r/dr = 4 pi (r / rho) ln((u + s) / a): the binned model and its derivatives are exact, and the maximum
likelihood fit of emissivities and radii together, and its Fisher matrix, need no quadrature.

Tested in tests/test_abel.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import quad
from scipy.interpolate import CubicSpline

from .constants import G, c, kB, mean_energy_kT, sigma


# --- the forward problem -------------------------------------------------------------------------------------------

def chord_matrix(radii, p) -> np.ndarray:
    """L[i, k]: length of the line at impact parameter p_i inside shell k, for shells with outer radii
    radii[0] < radii[1] < ... (the innermost shell is a ball)."""
    edges = np.concatenate([[0.0], np.asarray(radii, dtype=float)])
    p = np.atleast_1d(np.asarray(p, dtype=float))[:, None]
    half = np.sqrt(np.clip(edges[None, :] ** 2 - p ** 2, 0.0, None))
    return 2.0 * (half[:, 1:] - half[:, :-1])


def radiance(radii, j, theta, rho=None) -> np.ndarray:
    """N(theta) = sum_k j_k L_k(rho sin theta): the brightness seen at angle theta from straight down."""
    rho = float(radii[-1]) if rho is None else float(rho)
    return chord_matrix(radii, rho * np.sin(np.asarray(theta, dtype=float))) @ np.asarray(j, dtype=float)


def grazing_angles(radii, rho=None) -> np.ndarray:
    """The angles from straight down, arcsin(r / rho), at which lines of sight graze each boundary."""
    radii = np.asarray(radii, dtype=float)
    rho = float(radii[-1]) if rho is None else float(rho)
    return np.arcsin(radii / rho)


def abel_forward(f, R: float, p) -> np.ndarray:
    """F(p) = 2 int_p^R f(r) r dr / sqrt(r^2 - p^2) for a callable profile f, by quadrature (r = sqrt(p^2 + t^2))."""
    out = []
    for pi in np.atleast_1d(p):
        top = math.sqrt(max(R * R - pi * pi, 0.0))
        out.append(2.0 * quad(lambda t: f(math.sqrt(pi * pi + t * t)), 0.0, top, epsabs=0, epsrel=1e-12)[0])
    return np.array(out)


# --- inversions ----------------------------------------------------------------------------------------------------

def onion_peel(radii, N_inner) -> np.ndarray:
    """Exact inversion for uniform shells. N_inner[i] is the brightness along the line at impact parameter equal to
    the inner radius of shell i (0 for the innermost, straight down); the lines are taken outside in."""
    radii = np.asarray(radii, dtype=float)
    inner = np.concatenate([[0.0], radii[:-1]])
    L = chord_matrix(radii, inner)          # upper triangular: the line at inner[i] misses every shell below i
    j = np.zeros(len(radii))
    for i in range(len(radii) - 1, -1, -1):
        j[i] = (N_inner[i] - L[i, i + 1:] @ j[i + 1:]) / L[i, i]
    return j


def abel_inverse(p, F, r) -> np.ndarray:
    """f(r) = -(1/pi) int_r^R F'(p) dp / sqrt(p^2 - r^2) for a smooth profile sampled at p (increasing, ending at R),
    through a cubic spline of F and the substitution p = sqrt(r^2 + t^2)."""
    p = np.asarray(p, dtype=float)
    dF = CubicSpline(p, np.asarray(F, dtype=float)).derivative()
    R = p[-1]
    out = []
    for ri in np.atleast_1d(r):
        top = math.sqrt(max(R * R - ri * ri, 0.0))
        g = lambda t: float(dF(math.sqrt(ri * ri + t * t))) / math.sqrt(ri * ri + t * t)
        out.append(-quad(g, 0.0, top, limit=200, epsabs=1e-13, epsrel=1e-9)[0] / math.pi)
    return np.array(out)


def find_edges(theta, N, count: int) -> np.ndarray:
    """The angles of the `count` strongest kinks in a sampled brightness: where -dN/dtheta peaks, just inside each
    boundary at which the emissivity falls outward."""
    theta = np.asarray(theta, dtype=float)
    slope = -np.gradient(np.asarray(N, dtype=float), theta)
    peaks = [i for i in range(1, len(slope) - 1) if slope[i] > slope[i - 1] and slope[i] >= slope[i + 1]]
    peaks = sorted(peaks, key=lambda i: slope[i], reverse=True)[:count]
    return np.sort(theta[peaks])


# --- what the heights measure --------------------------------------------------------------------------------------

def number_emissivity(friction: float, temperature: float) -> float:
    """j_N = 16 G eta sigma T^3 / (2.701 k c^3), gravitons s^-1 m^-3 sr^-1."""
    return 16.0 * G * friction * sigma * temperature ** 3 / (mean_energy_kT * kB * c ** 3)


def friction_from_counts(j_N: float, temperature: float) -> float:
    """eta from a shell's number emissivity and its temperature."""
    return j_N * mean_energy_kT * kB * c ** 3 / (16.0 * G * sigma * temperature ** 3)


def temperature_from_energy(j_E: float, j_N: float) -> float:
    """T from the mean energy of the gravitons a shell emits, j_E / j_N = 2.701 k T (friction flat across the band)."""
    return j_E / (j_N * mean_energy_kT * kB)


# --- counts: the exact binned model, its Fisher matrix, and the fit -------------------------------------------------

def _G(r: float, rho: float, u) -> np.ndarray:
    """2 pi rho [u s - a^2 ln((u + s)/a)] for u >= a, else 0; a^2 = 1 - r^2/rho^2."""
    u = np.asarray(u, dtype=float)
    a2 = max(1.0 - (r / rho) ** 2, 0.0)
    a = math.sqrt(a2)
    s = np.sqrt(np.clip(u * u - a2, 0.0, None))
    with np.errstate(divide="ignore", invalid="ignore"):
        log = np.where(u > a, np.log((u + s) / a), 0.0) if a > 0 else np.zeros_like(u)
    return np.where(u > a, 2.0 * math.pi * rho * (u * s - a2 * log), 0.0)


def _dG_dr(r: float, rho: float, u) -> np.ndarray:
    """dG/dr = 4 pi (r/rho) ln((u + s)/a) for u >= a, else 0."""
    u = np.asarray(u, dtype=float)
    a2 = 1.0 - (r / rho) ** 2
    a = math.sqrt(a2)
    s = np.sqrt(np.clip(u * u - a2, 0.0, None))
    with np.errstate(divide="ignore", invalid="ignore"):
        return np.where(u > a, 4.0 * math.pi * (r / rho) * np.log((u + s) / a), 0.0)


def ring_exposure(radii, theta_edges, rho=None) -> np.ndarray:
    """X[i, k]: chord length in shell k weighted by solid angle over the ring theta_edges[i] < theta < theta_edges[i+1]
    (m sr). Expected counts are area * seconds * X @ j."""
    radii = np.asarray(radii, dtype=float)
    rho = float(radii[-1]) if rho is None else float(rho)
    u = np.cos(np.asarray(theta_edges, dtype=float))
    bounds = np.stack([_G(r, rho, u) for r in radii], axis=1)
    bounds = np.concatenate([np.zeros((len(u), 1)), bounds], axis=1)       # the centre: G = 0
    per_edge = bounds[:-1] - bounds[1:]                                     # u falls as theta rises
    return per_edge[:, 1:] - per_edge[:, :-1]


def expected_counts(radii, j, theta_edges, exposure: float, rho=None) -> np.ndarray:
    """Counts expected in each ring for exposure = area * seconds (m^2 s)."""
    return exposure * ring_exposure(radii, theta_edges, rho) @ np.asarray(j, dtype=float)


def _jacobian(radii, j, theta_edges, exposure, rho):
    """d(counts)/d(j_0..j_{K-1}, r_0..r_{K-2}); the outer radius is known (from light) and held fixed."""
    radii = np.asarray(radii, dtype=float)
    rho = float(radii[-1]) if rho is None else float(rho)
    u = np.cos(np.asarray(theta_edges, dtype=float))
    Jj = exposure * ring_exposure(radii, theta_edges, rho)
    cols = []
    for b in range(len(radii) - 1):            # boundary b: outer edge of shell b, inner edge of shell b + 1
        d = _dG_dr(radii[b], rho, u)
        cols.append(exposure * (j[b] - j[b + 1]) * (d[:-1] - d[1:]))
    return np.concatenate([Jj, np.stack(cols, axis=1)], axis=1)


def fisher(radii, j, theta_edges, exposure: float, rho=None, fit_radii: bool = True) -> np.ndarray:
    """Fisher matrix of Poisson counts in rings for (j, inner radii) or, with fit_radii False, for j alone."""
    mu = expected_counts(radii, j, theta_edges, exposure, rho)
    J = _jacobian(radii, np.asarray(j, dtype=float), theta_edges, exposure, rho)
    if not fit_radii:
        J = J[:, : len(radii)]
    keep = mu > 0
    return (J[keep].T / mu[keep]) @ J[keep]


def forecast(radii, j, theta_edges, exposure: float, rho=None, fit_radii: bool = True):
    """One-standard-deviation errors: (fractional errors of j, errors of the inner radii in metres or None)."""
    cov = np.linalg.inv(fisher(radii, j, theta_edges, exposure, rho, fit_radii))
    err = np.sqrt(np.diag(cov))
    K = len(radii)
    return err[:K] / np.asarray(j, dtype=float), (err[K:] if fit_radii else None)


def fit_counts(counts, theta_edges, exposure: float, radii_start, j_start=None, rho=None, fit_radii: bool = True,
               iterations: int = 60):
    """Maximum likelihood emissivities (and inner radii) from Poisson counts in rings, by Fisher scoring.
    Returns (radii, j, covariance)."""
    counts = np.asarray(counts, dtype=float)
    radii = np.array(radii_start, dtype=float)
    K = len(radii)
    if j_start is None:                          # a linear start: weighted least squares at the starting radii
        X = exposure * ring_exposure(radii, theta_edges, rho)
        w = 1.0 / np.maximum(counts, 1.0)
        j = np.linalg.lstsq(X * np.sqrt(w)[:, None], counts * np.sqrt(w), rcond=None)[0]
        j = np.maximum(j, 1e-3 * np.max(j))
    else:
        j = np.array(j_start, dtype=float)
    for _ in range(iterations):
        mu = expected_counts(radii, j, theta_edges, exposure, rho)
        J = _jacobian(radii, j, theta_edges, exposure, rho)
        if not fit_radii:
            J = J[:, :K]
        keep = mu > 0
        F = (J[keep].T / mu[keep]) @ J[keep]
        score = J[keep].T @ ((counts[keep] - mu[keep]) / mu[keep])
        step = np.linalg.solve(F, score)
        scale = 1.0                               # keep emissivities positive and radii ordered
        for _ in range(30):
            jn = j + scale * step[:K]
            rn = radii.copy()
            if fit_radii:
                rn[:-1] = radii[:-1] + scale * step[K:]
            if np.all(jn > 0) and np.all(np.diff(np.concatenate([[0.0], rn])) > 0):
                break
            scale *= 0.5
        j, radii = jn, rn
        if np.max(np.abs(scale * step) / np.sqrt(np.diag(np.linalg.inv(F)))) < 1e-8:
            break
    cov = np.linalg.inv(fisher(radii, j, theta_edges, exposure, rho, fit_radii))
    return radii, j, cov
