"""A camera with a black hole in it: what a gravitational lens for the camera would take (paper, Section VII).

A mass bends a ray passing at distance b by alpha = 2 r_s / b, r_s = 2 G M / c^2, the same at every frequency in
geometric optics.

* A lens of radius R that brings its edge ray to a focus at f must bend it by R / f, so the mass inside that ray
  needs r_s = R^2 / 2f: compactness r_s / R = 1 / 4N for focal ratio N = f / 2R. Only neutron stars and black
  holes are that compact.
* Diffraction: a lens of mass M focuses only wavelengths shorter than about 4 pi r_s (sunlens.diffraction_frequency),
  and on its axis multiplies the intensity by at most 4 pi^2 r_s / lambda (sunlens.point_mass_axis_gain).
* A point mass has no single focus: rays at b cross the axis at b^2 / 2 r_s. A detector of radius a on the axis at
  distance d behind it catches, from a source far behind the lens on the axis, the rays with |b - b_E^2 / b| < a,
  b_E = sqrt(2 r_s d) (the Einstein ring), which fill an annulus of area pi a sqrt(a^2 + 4 b_E^2), close to
  2 pi a b_E, until diffraction caps the gain.
* The lens's own field: tide 2 G M / d^3, and a camera at d falls toward it, or orbits it with period
  2 pi sqrt(d^3 / G M).

The hole of Section XI that is as warm as the sky, 0.905 K, is the natural choice: it neither grows nor evaporates.

Tested in tests/test_lens.py.
"""
from __future__ import annotations

import math

from .constants import G, c, hbar, kB


def schwarzschild_radius(mass: float) -> float:
    return 2.0 * G * mass / c ** 2


def mass_for_radius(r_s: float) -> float:
    return r_s * c ** 2 / (2.0 * G)


def hawking_mass(temperature: float) -> float:
    """The mass of a black hole at this Hawking temperature, hbar c^3 / (8 pi G M k_B) = T."""
    return hbar * c ** 3 / (8.0 * math.pi * G * kB * temperature)


def lens_mass(radius: float, focal_ratio: float) -> float:
    """Mass inside the edge ray of a lens of this radius and focal ratio N = f / 2R: r_s = R / 4N."""
    return mass_for_radius(radius / (4.0 * focal_ratio))


def shortest_unfocused_wavelength(mass: float) -> float:
    """Waves longer than about 4 pi r_s are not focused (diffraction)."""
    return 4.0 * math.pi * schwarzschild_radius(mass)


def max_axis_gain(mass: float, wavelength: float) -> float:
    """The wave-optics gain on the axis, pi w / (1 - exp(-pi w)), pi w = 4 pi^2 r_s / lambda."""
    x = 4.0 * math.pi ** 2 * schwarzschild_radius(mass) / wavelength
    return x / -math.expm1(-x)


def point_lens_focus(mass: float, b: float) -> float:
    """Where the rays passing at b cross the axis."""
    return b * b / (2.0 * schwarzschild_radius(mass))


def einstein_radius(mass: float, d: float) -> float:
    """Impact parameter of the rays from far behind the lens that reach the axis at distance d."""
    return math.sqrt(2.0 * schwarzschild_radius(mass) * d)


def einstein_angle(mass: float, d: float) -> float:
    """The angular radius of the ring, seen from d, for a source far behind the lens."""
    return math.sqrt(2.0 * schwarzschild_radius(mass) / d)


def collecting_area(mass: float, d: float, a: float) -> float:
    """Area of the annulus of rays, from a source far behind the lens on its axis, that land within a of the axis
    at distance d (geometric optics, weak bending)."""
    bE = einstein_radius(mass, d)
    return math.pi * a * math.sqrt(a * a + 4.0 * bE * bE)


def tide(mass: float, d: float) -> float:
    return 2.0 * G * mass / d ** 3


def distance_for_tide(mass: float, tidal: float) -> float:
    return (2.0 * G * mass / tidal) ** (1.0 / 3.0)


def pull(mass: float, d: float) -> float:
    return G * mass / (d * d)


def orbital_period(mass: float, d: float) -> float:
    return 2.0 * math.pi * math.sqrt(d ** 3 / (G * mass))


def jeans_length(sound_speed: float, density: float) -> float:
    """c_s sqrt(pi / G rho): a slab this thick is as soft against its own weight as a gravitational superlens would
    have to be, and collapses."""
    return sound_speed * math.sqrt(math.pi / (G * density))


def time_in_focus(mass: float, d: float) -> float:
    """How long a camera orbiting the lens at d keeps a given patch of sky within the ring, per turn."""
    return 2.0 * einstein_angle(mass, d) / (2.0 * math.pi / orbital_period(mass, d))
