"""The optics bound and the surface against the volume glow, each against an independent route."""
import math

import numpy as np
from scipy.integrate import quad

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
    # a steel ball of 10 cm at 30 K: 1e-48 W, from its surface
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
    # the surface wins only when sound crosses the body undamped: R below about l_s / 10
    for R in np.geomspace(1e-6, 1.0, 7):
        r = volume_to_surface(R, s["c_shear"], s["c_long"], Q, T)
        assert (r > 1) == (R > 0.18 * Q * hbar * s["c_shear"] / (kB * T))
