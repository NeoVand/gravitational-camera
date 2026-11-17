"""A camera with a black hole in it (gravcam/lens.py): the numbers of Section VII, and the collecting area of a
point-mass lens checked by tracing rays."""
import math

import numpy as np
import pytest

from gravcam import lens, primordial, sunlens
from gravcam.constants import G, c

M_SUN = 1.98892e30
MOON = 7.342e22          # kg, the Moon's mass


@pytest.fixture(scope="module")
def hole():
    return lens.hawking_mass(primordial.graviton_temperature())


def test_the_hole_as_warm_as_the_sky(hole):
    assert hole == pytest.approx(1.36e23, rel=5e-3)
    assert lens.schwarzschild_radius(hole) == pytest.approx(2.0e-4, rel=1e-2)
    assert hole / MOON == pytest.approx(1.85, rel=1e-2)


def test_a_lens_built_of_mass():
    """f/10 and 5 cm in radius: r_s = R/4N = 1.25 mm, eleven Moons, seven billion times nuclear density as a ball."""
    m = lens.lens_mass(0.05, 10.0)
    assert lens.schwarzschild_radius(m) == pytest.approx(1.25e-3, rel=1e-12)
    assert m / MOON == pytest.approx(11.4, rel=1e-2)
    density = m / (4 / 3 * math.pi * 0.05 ** 3)
    assert density / 2.3e17 == pytest.approx(7e9, rel=0.05)
    # the edge ray is bent by R/f
    f = 2 * 0.05 * 10.0
    assert 2 * lens.schwarzschild_radius(m) / 0.05 == pytest.approx(0.05 / f, rel=1e-12)


def test_diffraction(hole):
    lam = lens.shortest_unfocused_wavelength(hole)
    assert lam == pytest.approx(2.53e-3, rel=1e-2)
    assert c / lam == pytest.approx(sunlens.diffraction_frequency(hole), rel=1e-12)   # the same cut-off
    assert lens.max_axis_gain(hole, 1e-5) == pytest.approx(sunlens.point_mass_axis_gain(c / 1e-5, hole), rel=1e-12)
    assert lens.max_axis_gain(hole, 1e-5) == pytest.approx(795, rel=1e-2)
    # bulk-motion waves at 1 kHz need a lens of at least eight Suns
    assert lens.mass_for_radius(c / 1e3 / (4 * math.pi)) / M_SUN == pytest.approx(8.08, rel=1e-2)


def test_the_camera_and_its_lens(hole):
    """At a metre the tide is 2e13 s^-2; the camera sits where it is 1 s^-2, 26 km off, where the ring is 25
    arcseconds in radius and 3.25 m in radius at the lens; the pull there is 1,340 g, so the camera must orbit,
    at 19 km/s, once every 9 seconds. The lens out-pulls
    a person a metre from the camera until the camera is 12,500 km away."""
    assert lens.tide(hole, 1.0) == pytest.approx(1.81e13, rel=1e-2)
    assert math.degrees(lens.einstein_angle(hole, 1.0)) == pytest.approx(1.15, rel=1e-2)
    d = lens.distance_for_tide(hole, 1.0)
    assert d == pytest.approx(2.625e4, rel=1e-3)
    assert lens.tide(hole, d) == pytest.approx(1.0, rel=1e-12)
    assert lens.einstein_angle(hole, d) * 206264.8 == pytest.approx(25.5, rel=1e-2)
    assert lens.einstein_radius(hole, d) == pytest.approx(3.25, rel=1e-2)
    assert lens.point_lens_focus(hole, lens.einstein_radius(hole, d)) == pytest.approx(d, rel=1e-12)
    assert lens.pull(hole, d) / 9.80665 == pytest.approx(1340, rel=1e-2)
    assert 2 * math.pi * d / lens.orbital_period(hole, d) == pytest.approx(18.6e3, rel=1e-2)
    assert lens.orbital_period(hole, d) == pytest.approx(8.9, rel=1e-2)
    person = 2 * G * 70.0 / 1.0 ** 3
    assert lens.distance_for_tide(hole, person) == pytest.approx(1.25e7, rel=1e-2)


def test_collecting_area_by_tracing_rays(hole):
    """Rays from far behind, parallel to the axis, bent by 2 r_s / b, counted where they land within a of the axis at
    d: the annulus pi a sqrt(a^2 + 4 b_E^2), about a square metre for a detector 10 cm across."""
    d = lens.distance_for_tide(hole, 1.0)
    rs = lens.schwarzschild_radius(hole)
    for a in (0.01, 0.05, 0.3):
        b = np.linspace(1e-3, 10.0, 4_000_001)
        land = b - (2 * rs / b) * d                      # distance from the axis at d (negative: crossed it)
        hit = np.abs(land) < a
        db = b[1] - b[0]
        area = np.sum(2 * np.pi * b[hit]) * db
        assert area == pytest.approx(lens.collecting_area(hole, d, a), rel=2e-3)
    assert lens.collecting_area(hole, d, 0.05) == pytest.approx(1.02, rel=1e-2)
    gain = lens.collecting_area(hole, d, 0.05) / (math.pi * 0.05 ** 2)
    assert gain == pytest.approx(130, rel=1e-2)
    assert gain < lens.max_axis_gain(hole, 1e-5)          # geometric optics holds at thermal wavelengths


def test_a_superlens_would_collapse():
    """Steel at the Jeans length: some ten thousand kilometres, between its shear and its bulk sound speeds."""
    assert 7e6 < lens.jeans_length(3200.0, 7800.0) < lens.jeans_length(5900.0, 7800.0) < 1.5e7


def test_a_third_of_a_millisecond(hole):
    d = lens.distance_for_tide(hole, 1.0)
    assert lens.time_in_focus(hole, d) == pytest.approx(3.5e-4, rel=2e-2)
