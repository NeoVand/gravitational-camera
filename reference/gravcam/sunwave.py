"""The transparent Sun as a lens in wave optics (paper, Section XI, "The transparent Sun as a lens").

A plane wave from a source far behind the Sun, of wavenumber k, reaches an observer at distance d behind it, at
distance rho from the axis, with the amplitude (thin screen, Fresnel-Kirchhoff, unlensed amplitude 1)

    U(rho) = (k / i d) ∫_0^∞ b db J0(k b rho / d) exp{i k [b^2 / 2d - Phi(b)]},

where Phi is the extra path through the Sun's field, Phi'(b) = alpha(b) = 4 G M_cyl(b) / (c^2 b) = 2 r_s m(b) / b,
m = M_cyl / M, taken as zero at the limb. On the axis, in t = b^2:

    U(0) = (k / 2 i d) [ ∫_0^{R^2} e^{i k t / 2d - i k Phi} dt  +  R^{2 i mu} (-i a)^{-s} Gamma(s, -i a R^2) ],

s = 1 - i mu, mu = k r_s, a = k / 2d: inside the disc Phi(t) = -∫_t^{R^2} r_s m dt' / t', smooth since m ~ t near the
centre, integrated numerically; outside, the point mass's Phi = r_s ln(t / R^2), integrated exactly (an incomplete
gamma function). Splitting instead into a whole point mass plus a correction would leave the point mass's ring
image, inside the disc, to cancel to one part in 2 pi mu: hopeless at high frequency. For a point mass the whole
integral gives 2 pi mu / (1 - e^{-2 pi mu}), the paper's pi w / (1 - e^{-pi w}) with w = 2 mu.
"""
from __future__ import annotations

import math
from functools import lru_cache

import mpmath
import numpy as np

from .constants import G, M_sun, c as C
from .sunlens import R_sun, cylinder_mass, focal_distance

R_S = 2 * G * M_sun / C**2
AU = 1.495978707e11


@lru_cache(maxsize=1)
def _profile(n: int = 401):
    """m and Phi inside the disc, on a grid in t = b^2 from 0 to R^2."""
    t = np.linspace(0.0, R_sun**2, n)
    m = np.array([cylinder_mass(math.sqrt(x)) / M_sun if x > 0 else 0.0 for x in t])
    g = np.empty(n)
    g[1:] = R_S * m[1:] / t[1:]
    g[0] = 1.0 / (2.0 * focal_distance(0.0))  # r_s m / t -> 1 / 2 f0 at the centre
    seg = (g[1:] + g[:-1]) / 2 * np.diff(t)
    phi = -np.concatenate([np.cumsum(seg[::-1])[::-1], [0.0]])
    return t, m, phi


def inside_phase(t):
    """Phi(t) inside the disc (m), zero at the limb."""
    grid, _, phi = _profile()
    return np.interp(t, grid, phi)


def axis_amplitude(frequency: float, d: float, points: int = 200_001, mass_profile: bool = True) -> complex:
    """U(0), at distance d behind the transparent Sun (Eddington's model); with mass_profile=False, a point mass
    of the Sun's mass computed the same way, for checking."""
    k = 2 * math.pi * frequency / C
    mu = k * R_S
    a = k / (2 * d)
    n = int(max(points, 40 * a * R_sun**2 / (2 * math.pi)))  # forty points per turn of the Fresnel phase
    s = mpmath.mpc(1.0, -mu)
    outside = mpmath.exp(2j * mu * math.log(R_sun)) * mpmath.power(mpmath.mpc(0, -a), -s) * mpmath.gammainc(
        s, mpmath.mpc(0, -a * R_sun**2)
    )
    if mass_profile:
        t = np.linspace(0.0, R_sun**2, n)
        inside = np.trapezoid(np.exp(1j * (a * t - k * inside_phase(t))), t)
    else:  # the point mass's own disc: (-i a)^{-s} times the lower incomplete gamma function
        inside = complex(
            mpmath.exp(2j * mu * math.log(R_sun)) * mpmath.power(mpmath.mpc(0, -a), -s)
            * (mpmath.gamma(s) - mpmath.gammainc(s, mpmath.mpc(0, -a * R_sun**2)))
        )
    return complex(k / (2j * d) * (inside + complex(outside)))


def axis_gain(frequency: float, d: float) -> float:
    return abs(axis_amplitude(frequency, d)) ** 2


def geometric_axis_gain(d: float) -> float:
    """Short waves, an observer nearer than the central focus f0: only the central ray, magnified 1/(1 - d/f0)^2."""
    return 1.0 / (1.0 - d / focal_distance(0.0)) ** 2
