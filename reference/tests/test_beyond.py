"""Beyond general relativity in one reading (gravcam/beyond.py), checked against curvature computed from the metric
by finite differences."""
import math

import numpy as np
import pytest

from gravcam import beyond, curvature as cv
from gravcam.constants import c

OMEGA = 2 * math.pi * 100.0
K = np.array([0.6, 0.0, 0.8])
E1 = np.array([0.8, 0.0, -0.6])


def reading(eps, n, x0=0.37 * c / OMEGA):
    h = beyond.metric_wave(eps, n, K, OMEGA)
    return cv.tidal_tensors(cv.riemann(h, x0, np.zeros(3), c / OMEGA * 1e-3))


@pytest.mark.parametrize("n", [0.8, 1.0, 1.3])
def test_bianchi_relation_for_any_polarization(n):
    rng = np.random.default_rng(int(10 * n))
    for _ in range(3):
        eps = rng.normal(size=(4, 4))
        eps = (eps + eps.T) * 1e-3
        E, B = reading(eps, n)
        assert np.linalg.norm(B - n * beyond.cross_matrix(K) @ E) < 1e-8 * np.linalg.norm(B)


@pytest.mark.parametrize("n", [0.8, 1.0, 1.3])
def test_one_reading_gives_direction_speed_and_six_polarizations(n):
    rng = np.random.default_rng(int(20 * n))
    eps = rng.normal(size=(4, 4))
    eps = (eps + eps.T) * 1e-3
    E, B = reading(eps, n)
    k, n_found, pol, residual = beyond.invert_one_reading(E, B, e1=E1)
    np.testing.assert_allclose(k, K, atol=1e-8)
    assert n_found == pytest.approx(n, rel=1e-8)
    assert residual < 1e-8
    f1, f2, f3 = beyond.wave_frame(K, E1)
    Rw = np.stack([f1, f2, f3])
    Ew = Rw @ E @ Rw.T
    assert pol["l"] == pytest.approx(Ew[2, 2]) and pol["b"] == pytest.approx(0.5 * (Ew[0, 0] + Ew[1, 1]))


def test_general_relativity_has_only_tensor_modes():
    eps = np.zeros((4, 4))
    f1, f2, _ = beyond.wave_frame(K, E1)
    T = 1e-3 * (np.outer(f1, f1) - np.outer(f2, f2)) + 0.4e-3 * (np.outer(f1, f2) + np.outer(f2, f1))
    eps[1:, 1:] = T
    E, B = reading(eps, 1.0)
    k, n, pol, residual = beyond.invert_one_reading(E, B, e1=E1)
    assert n == pytest.approx(1.0, rel=1e-8)
    scale = abs(pol["plus"]) + abs(pol["cross"])
    for key in ("x", "y", "b", "l"):
        assert abs(pol[key]) < 1e-7 * scale


@pytest.mark.parametrize("n", [0.8, 0.6])
def test_massive_graviton_against_scalar(n):
    E, B = reading(beyond.fierz_pauli_helicity0(n, K) * 1e-3, n, x0=0.0)
    _, n_found, pol, _ = beyond.invert_one_reading(E, B, e1=E1)
    assert n_found == pytest.approx(n, rel=1e-7)
    assert pol["l"] / pol["b"] == pytest.approx(-2 * (1 - n * n), rel=1e-6)
    E, B = reading(beyond.scalar_mode() * 1e-3, n, x0=0.0)
    _, _, pol, _ = beyond.invert_one_reading(E, B, e1=E1)
    assert pol["l"] / pol["b"] == pytest.approx(1 - n * n, rel=1e-6)
