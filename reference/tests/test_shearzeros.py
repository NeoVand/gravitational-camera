"""Where the in-plane shear of a buried body vanishes (gravcam/shearzeros.py): far above it, at the body's centre
plus and minus i times the root of its complex quadrupole over its mass, whatever the depth."""
import numpy as np
import pytest

from gravcam import shearzeros as sz
from gravcam.constants import G
from gravcam.response import tidal_of_points

DEPTHS = (2.0, 5.0, 12.0, 30.0, 100.0)


def a_planar_body(seed: int):
    """Three to eight masses on a plane, about a metre across: their places (complex) and their masses."""
    rng = np.random.default_rng(seed)
    n = int(rng.integers(3, 9))
    return (rng.normal(size=n) + 1j * rng.normal(size=n)) * 0.5, rng.random(n) + 0.2


def test_the_shear_is_that_of_the_tidal_tensor():
    w0, m = a_planar_body(3)
    for w, z in ((0.3 - 0.8j, 1.7), (-2.0 + 0.1j, 0.4), (0.0j, 6.0)):
        sources = np.stack([w0.real, w0.imag, np.full(len(w0), -z)], axis=1)
        E = tidal_of_points(np.array([w.real, w.imag, 0.0]), sources, m)
        assert sz.in_plane_shear(w, w0, m, z) == pytest.approx(E[0, 0] - E[1, 1] + 2j * E[0, 1], rel=1e-12)
    # and 4 d^2 Phi / d wbar^2, by differences of the potential across the plane
    w, z, h = 0.3 - 0.8j, 1.7, 1e-3
    phi = lambda v: -G * np.sum(m / np.sqrt(np.abs(v - w0) ** 2 + z * z))
    dxx = (phi(w + h) - 2 * phi(w) + phi(w - h)) / h**2
    dyy = (phi(w + 1j * h) - 2 * phi(w) + phi(w - 1j * h)) / h**2
    dxy = (phi(w + h + 1j * h) - phi(w + h - 1j * h) - phi(w - h + 1j * h) + phi(w - h - 1j * h)) / (4 * h**2)
    assert sz.in_plane_shear(w, w0, m, z) == pytest.approx(dxx - dyy + 2j * dxy, rel=1e-5)


@pytest.mark.parametrize("seed", [3, 4, 5])
def test_far_above_a_body_the_zeros_stand_at_its_centre_and_quadrupole(seed):
    w0, m = a_planar_body(seed)
    M, centre, Q = sz.complex_quadrupole(w0, m)
    assert M == pytest.approx(m.sum()) and centre == pytest.approx((m * w0).sum() / m.sum())
    predicted = sz.far_zeros(w0, m)
    assert predicted[0] + predicted[1] == pytest.approx(2 * centre, rel=1e-12)
    assert (predicted[0] - centre) ** 2 == pytest.approx(-Q / M, rel=1e-12)
    # they are the zeros of M w^2 - 2 D w + Q_2
    for p in predicted:
        assert abs(M * p * p - 2 * (m * w0).sum() * p + (m * w0**2).sum()) < 1e-12 * M
    R = np.abs(w0 - centre).max()                                     # the body's size
    off = []
    for z in DEPTHS:
        found = [sz.zero_near(p, w0, m, z) for p in predicted]
        assert all(abs(sz.in_plane_shear(f, w0, m, z)) < 1e-10 * 3 * G * M / z**3 for f in found)
        off.append(max(abs(f - p) for f, p in zip(found, predicted)))
    # the error is a fraction of R (R / z)^2 (0.36 to 0.56 of it for the bodies of the check), and falls as z^-2
    for z, err in zip(DEPTHS[1:], off[1:]):
        assert err < R * (R / z) ** 2
    assert off[3] / off[4] == pytest.approx((100.0 / 30.0) ** 2, rel=0.01)
    assert off[2] / off[3] == pytest.approx((30.0 / 12.0) ** 2, rel=0.03)


def test_the_numbers_of_the_check():
    # the first body of design/checks/shear_zeros.py, written out: seven masses, 1.87 from its centre to its edge
    w0 = np.array([-1.277833 - 0.432607j, 0.209049 + 1.661500j, -0.283885 + 0.112893j, -0.226325 - 0.176315j,
                   -0.107799 - 0.140644j, -1.009993 - 0.334023j, -0.115966 - 0.527575j])
    m = np.array([1.156267, 0.484201, 0.848547, 0.896216, 0.492721, 0.201490, 1.173460])
    predicted = sz.far_zeros(w0, m)
    assert np.allclose(predicted, [-0.8773 + 0.2140j, 0.0348 - 0.4095j], atol=1e-4)
    assert np.abs(w0 - sz.complex_quadrupole(w0, m)[1]).max() == pytest.approx(1.87, abs=5e-3)
    off = [max(abs(sz.zero_near(p, w0, m, z) - p) for p in predicted) for z in (2.0, 5.0, 12.0, 30.0)]
    assert off == pytest.approx([3.32e-1, 8.87e-2, 1.63e-2, 2.62e-3], rel=5e-3)        # the zeros off by this much


@pytest.mark.parametrize("z", [0.9, 2.0, 7.0])
def test_for_two_equal_masses_it_is_exact_at_every_depth(z):
    d = 1.0
    w0, m = np.array([-d / 2, d / 2], dtype=complex), np.array([1.0, 1.0])
    zeros = sz.far_zeros(w0, m)
    assert zeros == pytest.approx((0.5j * d, -0.5j * d), abs=1e-15)                  # d apart, across the pair
    scale = 3 * G * m.sum() / z**3
    for w in zeros:
        assert abs(sz.in_plane_shear(w, w0, m, z)) < 1e-15 * scale
        assert sz.zero_near(w + 0.05 + 0.03j, w0, m, z) == pytest.approx(w, abs=1e-9)
    assert abs(sz.in_plane_shear(0.3j * d, w0, m, z)) > 1e-3 * scale                 # and not elsewhere on that line
    # unequal masses: the zeros are no longer where the far field puts them
    lopsided = np.array([1.0, 3.0])
    assert abs(sz.in_plane_shear(sz.far_zeros(w0, lopsided)[0], w0, lopsided, z)) > 1e-4 * scale
