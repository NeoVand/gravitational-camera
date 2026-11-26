"""The optics bound and the surface against the volume glow, each against an independent route."""
import math

import numpy as np
from scipy.integrate import quad, trapezoid
from scipy.optimize import brentq
from scipy.special import spherical_jn

from gravcam.constants import G, c, hbar, kB
from gravcam.emission import absorption_coefficient
from gravcam.lens import lens_mass, schwarzschild_radius
from gravcam.optics import (
    compactness,
    optics_bound,
    surface_absorptivity,
    surface_luminosity_sphere,
    volume_luminosity_sphere,
    volume_to_surface,
)

STEEL = dict(density=7800.0, c_shear=3200.0, c_long=5900.0)


def planck(omega: float, T: float) -> float:
    """B_omega summed over both polarizations, as in the paper (W m^-2 sr^-1 per rad/s)."""
    x = hbar * omega / (kB * T)
    return hbar * omega**3 / (4 * math.pi**3 * c**2 * math.expm1(x))


def test_optics_bound_against_its_sources():
    R, rho, omega, Q = 2.0, STEEL["density"], 2 * math.pi * 1e5, 300.0
    M = rho * 4 / 3 * math.pi * R**3
    b = optics_bound(M, R, omega, STEEL["c_shear"], Q)
    # phase: Peters' index, n - 1 = 2 pi G rho / omega^2, over the diameter
    assert math.isclose(b["phase"], 2 * math.pi * G * rho / omega**2 * omega * 2 * R / c, rel_tol=1e-12)
    # reflection: Press's dispersion k^2 = (omega/c)^2 (1 - 16 pi G mu / c^2 omega^2), |r| = |n - 1| / 2
    mu = rho * STEEL["c_shear"] ** 2
    x = 16 * math.pi * G * mu / (c**2 * omega**2)
    one_minus_n = x / (1 + math.sqrt(1 - x))  # 1 - n without the rounding of 1 - sqrt(1 - x)
    assert math.isclose(b["reflection"], one_minus_n / 2, rel_tol=1e-9)
    # depth: alpha = 16 pi G eta / c^3 with Re eta = rho c_T^2 / (omega Q), over the diameter
    eta = mu / (omega * Q)
    assert math.isclose(b["depth"], absorption_coefficient(eta) * 2 * R, rel_tol=1e-12)
    # focal ratio: the lens of Eq. lens-compactness that has this mass and radius
    assert math.isclose(lens_mass(R, b["focal_ratio"]), M, rel_tol=1e-12)
    assert math.isclose(schwarzschild_radius(M) / R, 2 * compactness(M, R), rel_tol=1e-12)


def test_surface_glow_is_kirchhoff_of_the_surface_absorptivity():
    R, T = 0.1, 30.0
    s = STEEL
    flux, _ = quad(
        lambda w: surface_absorptivity(w, s["density"], s["c_shear"], s["c_long"]) * math.pi * planck(w, T),
        0, 60 * kB * T / hbar, limit=400,
    )
    L = surface_luminosity_sphere(R, s["density"], s["c_shear"], s["c_long"], T)
    assert math.isclose(4 * math.pi * R**2 * flux, L, rel_tol=1e-6)
    # a steel ball of 10 cm at 30 K: 7e-48 W, from its surface
    assert 1e-49 < L < 1e-47


def test_volume_glow_and_the_ratio():
    R, T, Q = 0.1, 30.0, 1e3
    s = STEEL
    V = 4 / 3 * math.pi * R**3
    integrand = lambda w: absorption_coefficient(s["density"] * s["c_shear"] ** 2 / (w * Q)) * planck(w, T)
    total, _ = quad(integrand, 0, 60 * kB * T / hbar, limit=400)
    LV = volume_luminosity_sphere(R, s["density"], s["c_shear"], Q, T)
    assert math.isclose(4 * math.pi * V * total, LV, rel_tol=1e-6)
    LS = surface_luminosity_sphere(R, s["density"], s["c_shear"], s["c_long"], T)
    assert math.isclose(LV / LS, volume_to_surface(R, s["c_shear"], s["c_long"], Q, T), rel_tol=1e-12)
    # the surface wins only when sound crosses the body undamped: R below about l_s
    for R in np.geomspace(1e-6, 1.0, 7):
        r = volume_to_surface(R, s["c_shear"], s["c_long"], Q, T)
        assert (r > 1) == (R > 1.118 * Q * hbar * s["c_shear"] / (kB * T))


def test_surface_rule_gives_the_cross_section_of_a_resonant_bar():
    """A thin bar across the wave, stretched along its length. The surface rule (a traction E h / 2 on each end, which
    sends the power t^2 / (2 rho v) per area into the bar), spread over the spacing of the odd modes, gives the
    cross-section of each mode as found from the mode itself, and both are the textbook value for a wave of the best
    direction and polarization, int sigma d nu = (8 / pi) G M v^2 / (c^3 n^2) (Misner, Thorne & Wheeler, Sec. 37.6)."""
    rho, v, length, area = 2700.0, 5100.0, 1.5, 0.3
    mass = rho * area * length
    z = np.linspace(0.0, length, 400001)
    for n in (1, 3, 5):
        w = n * math.pi * v / length
        # the mode, normalized to int rho u^2 dV = 1, and its coupling q = int rho (z - L/2) u dV; a driven oscillator
        # in a wave h_zz = h cos(w t) of flux c^3 w^2 h^2 / (32 pi G) has int sigma d omega = 2 pi^2 G w^2 q^2 / c^3
        phi = np.cos(n * math.pi * z / length)
        q = rho * area * trapezoid((z - length / 2) * phi, z) / math.sqrt(rho * area * trapezoid(phi**2, z))
        from_mode = 2 * math.pi**2 * G * w**2 * q**2 / c**3
        traction = rho * v**2 / 2  # per unit h
        absorbed = 2 * area * traction**2 / (2 * rho * v)  # both ends, per unit h^2
        from_surface = absorbed * 32 * math.pi * G / (c**3 * w**2) * (2 * math.pi * v / length)
        textbook = 2 * math.pi * (8 / math.pi) * G * mass * v**2 / (c**3 * n**2)
        assert math.isclose(from_mode, textbook, rel_tol=1e-8)
        assert math.isclose(from_surface, textbook, rel_tol=1e-12)


def _j2(x, d=0):
    """Spherical Bessel function of order two and its first two derivatives."""
    if d < 2:
        return spherical_jn(2, x, derivative=bool(d))
    return -(2 / x) * spherical_jn(2, x, derivative=True) - (1 - 6 / x**2) * spherical_jn(2, x)


def _free_surface(w, gamma):
    """Rows: the radial and tangential tractions at r = 1 of the two l = 2 solutions, grad[j2(k_L r) Y] and
    curl curl[r j2(k_T r) Y], of a free elastic sphere in units R = rho = c_T = 1, c_L = gamma (Lamb 1882)."""
    kl, kt = w / gamma, w
    a, da, dda = _j2(kl), kl * _j2(kl, 1), kl**2 * _j2(kl, 2)
    b, db, ddb = _j2(kt), _j2(kt, 1), _j2(kt, 2)
    return (
        -(gamma**2 - 2) * kl**2 * a + 2 * dda,
        12 * (kt * db - b),
        2 * (da - a),
        2 * kt * db + kt**2 * ddb - 2 * (b + kt * db) + 6 * b,
    )


def _quadrupole_modes(gamma, w_max, step=0.002):
    """Frequencies of the spheroidal l = 2 modes below w_max, and for each |q_0|^2, the squared coupling
    q_ij = int rho x_j u_i dV of one of its five modes normalized to int rho u^2 dV = 1."""
    det = lambda w: (lambda m: m[0] * m[3] - m[1] * m[2])(_free_surface(w, gamma))
    ws = np.arange(0.05, w_max, step)
    d = det(ws)
    roots = np.array([brentq(det, ws[i], ws[i + 1], xtol=1e-13) for i in np.nonzero(d[:-1] * d[1:] < 0)[0]])
    x, weight = np.polynomial.legendre.leggauss(3000)
    r, weight = 0.5 * (x + 1), 0.5 * weight
    q0 = []
    for w in roots:
        m = _free_surface(w, gamma)
        A, B = m[1], -m[0]
        kl, kt = w / gamma, w
        U = A * kl * _j2(kl * r, 1) + 6 * B * _j2(kt * r) / r
        V = A * _j2(kl * r) / r + B * (_j2(kt * r) + kt * r * _j2(kt * r, 1)) / r
        norm = np.sum(weight * r**2 * (U**2 * 4 * math.pi / 5 + V**2 * 24 * math.pi / 5))
        q_zz = (8 * math.pi / 15) * np.sum(weight * r**3 * (U + 3 * V))
        q0.append(1.5 * q_zz**2 / norm)
    return roots, np.array(q0)


def test_surface_glow_is_the_sum_over_the_modes_of_a_sphere():
    """The coefficient of Eq. surface-glow against the exact quadrupole modes of a free elastic sphere smaller than the
    wave. Each multiplet has int sigma d omega = 4 pi^2 G w_n^2 |q_0|^2 / c^3, so the cross-section averaged over a
    band is 4 pi^2 G s / (c^3 w^2), with s the slope of the running sum of w_n^4 |q_0|^2; the surface rule says
    s = (32 / 5)(1 + 2 c_T / 3 c_L). Dehnen, Romero & Schaefer's coefficient would need (pi / 4)(1 + 3 c_T / 2 c_L)."""
    for gamma in (STEEL["c_long"] / STEEL["c_shear"], 1.5):
        w, q0 = _quadrupole_modes(gamma, 600.0)
        # Weyl's count of the two families of modes
        assert abs(len(w) - 600.0 / math.pi * (1 + 1 / gamma)) < 6
        upper = w > 200.0
        slope = np.polyfit(w[upper], np.cumsum(w**4 * q0)[upper], 1)[0]
        assert math.isclose(slope, 32 / 5 * (1 + 2 / (3 * gamma)), rel_tol=1e-3)
        assert 5.8 < slope / (math.pi / 4 * (1 + 3 / (2 * gamma))) < 6.3
    # the lowest mode of a steel ball, w R / c_T = 2.65
    w, _ = _quadrupole_modes(STEEL["c_long"] / STEEL["c_shear"], 5.0)
    assert math.isclose(w[0], 2.645, abs_tol=2e-3)
    # the same slope in the module's units: the cross-section 4 pi R^2 (a / 4) of a ball of radius R
    R, omega, s = 0.1, 2 * math.pi * 1e9, STEEL
    a = surface_absorptivity(omega, s["density"], s["c_shear"], s["c_long"])
    slope = 32 / 5 * (1 + 2 * s["c_shear"] / (3 * s["c_long"]))
    in_units = 4 * math.pi**2 * G * slope * s["density"] * s["c_shear"] ** 3 * R**2 / (c**3 * omega**2)
    assert math.isclose(4 * math.pi * R**2 * a / 4, in_units, rel_tol=1e-12)
