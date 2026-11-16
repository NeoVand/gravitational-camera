"""The field of an orbiting pair in every zone (gravcam/binary.py): the exact
linearized solution against Newton's law near the pair and the quadrupole wave
far from it, and the vacuum properties of the curvature."""
import numpy as np
import pytest

from gravcam import binary
from gravcam.constants import G, M_sun, c


def _directions(seed, n=6):
    d = np.random.default_rng(seed).normal(size=(n, 3))
    return d / np.linalg.norm(d, axis=1)[:, None]


def _monopole(mass, x):
    r = np.linalg.norm(x, axis=1)
    n = x / r[:, None]
    return (G * mass / r ** 3)[:, None, None] * (np.eye(3) - 3 * n[:, :, None] * n[:, None, :])


def test_near_the_pair_the_field_is_newtons():
    # a pair turning so slowly that the waves are a billion times its size
    pair = binary.Pair(30 * M_sun, 1e6, 1e-6)
    dirs = _directions(1)
    errors = []
    for R in (10.0, 30.0):
        x = R * pair.d * dirs
        E, _ = binary.tidal(pair, 1e5, x)
        newton = pair.newtonian_tidal(1e5, x)
        quadrupole = np.linalg.norm(newton - _monopole(pair.mass, x), axis=(1, 2))
        err = np.linalg.norm(E - newton, axis=(1, 2)) / quadrupole
        # what is left is the hexadecapole, smaller by (d / r)^2
        assert np.all(err < 0.7 / R ** 2)
        errors.append(err.mean())
    assert errors[0] / errors[1] == pytest.approx(9.0, rel=0.05)


def test_far_from_the_pair_the_field_is_the_quadrupole_wave():
    pair = binary.Pair.bound(30 * M_sun, 300e3)
    dirs = _directions(2)
    errors = []
    for R in (200.0, 2000.0):
        x = R * pair.wavelength * dirs
        E, B = binary.tidal(pair, 0.01, x)
        wave = pair.wave_tidal(0.01, x)
        moving = E - _monopole(pair.mass, x)
        err = np.linalg.norm(moving - wave, axis=(1, 2)) / np.linalg.norm(wave, axis=(1, 2))
        # the next term falls off one power of r faster: c / (omega r) = lambda / (2 pi r)
        assert np.all(err < 4.0 / (2 * np.pi * R))
        errors.append(err.mean())
        # in the waves the magnetic part is as large as the electric
        ratio = np.linalg.norm(B, axis=(1, 2)) / np.linalg.norm(moving, axis=(1, 2))
        assert np.allclose(ratio, 1.0, atol=2.0 / (2 * np.pi * R))
    assert errors[0] / errors[1] == pytest.approx(10.0, rel=0.05)


@pytest.mark.parametrize("where", [0.3, 1.0, 5.0])
def test_the_curvature_is_that_of_vacuum(where):
    pair = binary.Pair.bound(30 * M_sun, 300e3)
    x = where * pair.wavelength * _directions(3) + np.array([pair.d, 0, 0])
    E, B = binary.tidal(pair, 0.002, x)
    scale = np.linalg.norm(E, axis=(1, 2))
    assert np.all(np.abs(np.einsum("nii->n", E)) < 1e-7 * scale)
    assert np.all(np.abs(np.einsum("nii->n", B)) < 1e-7 * scale)
    assert np.all(np.linalg.norm(B - B.transpose(0, 2, 1), axis=(1, 2)) < 1e-7 * scale)
    assert np.all(np.linalg.norm(E - E.transpose(0, 2, 1), axis=(1, 2)) < 1e-12 * scale)


def test_the_field_turns_with_the_pair():
    """Half a turn later the pair looks the same, and the field everywhere is
    the same; a quarter turn later the field is turned by 90 degrees."""
    pair = binary.Pair.bound(30 * M_sun, 300e3)
    x = 2.0 * pair.wavelength * _directions(4)
    half = np.pi / pair.omega
    E0, _ = binary.tidal(pair, 0.0, x)
    E1, _ = binary.tidal(pair, half, x)
    assert np.allclose(E0, E1, atol=1e-9 * np.abs(E0).max())
    turn = np.array([[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]])
    E2, _ = binary.tidal(pair, 0.5 * half, x @ turn.T)
    assert np.allclose(turn @ E0 @ turn.T, E2, atol=1e-9 * np.abs(E0).max())
