"""The oldest light a gravitational camera could see: a thermal background of
gravitons from the Big Bang, if the early universe was ever hot enough to
make them in equilibrium.

Gravitons stop interacting near the Planck temperature. If they were in
equilibrium then, they kept a black-body spectrum as the universe expanded,
and every species that later annihilated heated the photons but not them. By
conservation of entropy their temperature today is

    T_g = (g_now / g_then)^(1/3) T_cmb ,

with g_now = 2 + (7/8) 2 3 (4/11) = 3.909 for photons and neutrinos and
g_then = 106.75 for the particles of the Standard Model: T_g = 0.905 K
(Kolb and Turner 1990). More particles would make it colder. A black body
of two polarizations has the number radiance

    N = 4 zeta(3) (k T / h)^3 / c^2 ,

per second, per square metre, per steradian. Moving at velocity beta c
through it, one sees T(theta) = T_g / (gamma (1 - beta cos theta)), and at rest
deep in a potential well the whole sky is warmer by the gravitational
blueshift.
"""
from __future__ import annotations

import math

import numpy as np

from .constants import c, hbar, kB

T_CMB = 2.7255                    # K (Fixsen 2009)
G_NOW = 2.0 + 7.0 / 8.0 * 2.0 * 3.0 * 4.0 / 11.0
G_STANDARD_MODEL = 106.75
ZETA3 = 1.2020569031595942
H = 2.0 * math.pi * hbar
# the Solar System's velocity relative to the cosmic rest frame, from the
# dipole of the microwave background (Planck 2018): speed and galactic direction
DIPOLE_SPEED = 369.82e3           # m/s
DIPOLE_L, DIPOLE_B = math.radians(264.021), math.radians(48.253)


def graviton_temperature(g_then: float = G_STANDARD_MODEL, t_cmb: float = T_CMB) -> float:
    return (G_NOW / g_then) ** (1.0 / 3.0) * t_cmb


def number_radiance(T: float) -> float:
    """Gravitons (or photons) per second per square metre per steradian from a
    black body of two polarizations at temperature T."""
    return 4.0 * ZETA3 * (kB * T / H) ** 3 / c ** 2


def spectral_radiance(nu, T: float):
    """Energy per second per square metre per steradian per hertz."""
    nu = np.asarray(nu, dtype=np.float64)
    x = np.minimum(H * nu / (kB * T), 700.0)
    return 2.0 * H * nu ** 3 / c ** 2 / np.expm1(x)


def energy_density(T: float) -> float:
    """J/m^3 of a black body of two polarizations."""
    return math.pi ** 2 / 15.0 * (kB * T) ** 4 / (hbar * c) ** 3


def extra_neutrino_species(T: float, t_cmb: float = T_CMB) -> float:
    """The background's energy density counted as extra neutrino species,
    Delta N_eff = (8/7) (11/4)^(4/3) (T / T_cmb)^4."""
    return 8.0 / 7.0 * (11.0 / 4.0) ** (4.0 / 3.0) * (T / t_cmb) ** 4


def doppler_temperature(T: float, beta: float, cos_theta):
    """Temperature seen at angle theta from the direction of motion."""
    gamma = 1.0 / math.sqrt(1.0 - beta * beta)
    return T / (gamma * (1.0 - beta * np.asarray(cos_theta)))


def dipole_direction():
    """Unit vector, in the galactic frame of gravcam/galaxy.py, toward which
    the Solar System moves through the background."""
    l, b = DIPOLE_L, DIPOLE_B
    return np.array([math.cos(b) * math.cos(l), math.cos(b) * math.sin(l), math.sin(b)])
