"""A reading as four spins (gravcam/spins.py): the state of one spin is the super-Poynting vector over the
super-energy; it is pure for one plane wave and maximally mixed in the field's rest frame, where the reading is
least."""
import math

import numpy as np
import pytest
from scipy.optimize import minimize
from scipy.spatial.transform import Rotation

from gravcam import pixel, spins


def random_reading(rng) -> np.ndarray:
    A = rng.normal(size=(3, 3)) + 1j * rng.normal(size=(3, 3))
    A = A + A.T
    return A - np.trace(A) / 3 * np.eye(3)


def test_a_reading_is_a_symmetric_state_of_four_spins():
    t, q = spins.ladders()
    for m in t:                                                      # the same ladder on both sides
        assert np.allclose(spins.spin_two(2, t[m]), m * t[m]) and np.allclose(spins.total_spin(2) @ q[m], m * q[m])
        assert np.allclose(t[m], t[m].T) and abs(np.trace(t[m])) < 1e-12
        for n in t:
            assert np.vdot(t[m], t[n]) == pytest.approx(float(m == n), abs=1e-12)
            assert np.vdot(q[m], q[n]) == pytest.approx(float(m == n), abs=1e-12)
    rng = np.random.default_rng(5)
    W = random_reading(rng)
    state = spins.four_spins(W)
    assert np.vdot(state, state).real == pytest.approx(np.sum(np.abs(W) ** 2), rel=1e-12)
    cube = state.reshape(2, 2, 2, 2)
    for a in range(4):
        for b in range(a):
            assert np.allclose(np.swapaxes(cube, a, b), cube, atol=1e-12)                 # any two spins exchanged
    # so each of the four is in the same state, and the spins add up to the spin of the tensor
    last = np.outer(state, state.conj()).reshape(8, 2, 8, 2).trace(axis1=0, axis2=2) / np.vdot(state, state).real
    assert np.allclose(last, spins.one_spin(state), atol=1e-12)
    for k in range(3):
        assert np.vdot(state, spins.total_spin(k) @ state) == pytest.approx(np.vdot(W, spins.spin_two(k, W)), rel=1e-12)


def test_one_spin_carries_the_super_poynting_vector_over_the_super_energy():
    rng = np.random.default_rng(5)
    worst = 0.0
    for _ in range(200):
        W = random_reading(rng)
        rho = spins.one_spin(spins.four_spins(W))
        assert np.trace(rho).real == pytest.approx(1.0, rel=1e-12) and np.allclose(rho, rho.conj().T)
        w, P = spins.super_energy(W), spins.super_poynting(W)
        E, B = W.real, W.imag
        assert w == pytest.approx((np.sum(E * E) + np.sum(B * B)) / 2, rel=1e-12)
        assert P == pytest.approx(np.array([(E @ B)[1, 2] - (E @ B)[2, 1], (E @ B)[2, 0] - (E @ B)[0, 2],
                                            (E @ B)[0, 1] - (E @ B)[1, 0]]), rel=1e-12, abs=1e-12)
        assert np.linalg.norm(P) < w                                                      # mixed: not one wave
        assert np.allclose(rho, (np.eye(2) + sum(n * s for n, s in zip(P / w, spins.SIGMA))) / 2, atol=1e-12)
        worst = max(worst, np.abs(spins.bloch_vector(rho) - spins.speedometer(W)).max())
    assert worst < 1e-12
    # it turns with the pixel, as a vector does
    R = Rotation.from_rotvec([0.4, -1.1, 0.7]).as_matrix()
    turned = spins.bloch_vector(spins.one_spin(spins.four_spins(R @ W @ R.T)))
    assert np.allclose(turned, R @ spins.speedometer(W), atol=1e-12)


def test_the_spin_is_pure_exactly_for_one_plane_wave():
    rng = np.random.default_rng(5)
    k = rng.normal(size=3)
    k /= np.linalg.norm(k)
    m = pixel.null_frame(k)
    wave = (0.3 - 1.7j) * np.outer(m, m)                              # any amplitude and phase
    rho = spins.one_spin(spins.four_spins(wave))
    assert pixel.petrov(wave) == "N" and spins.purity(rho) == pytest.approx(1.0, abs=1e-12)
    assert np.allclose(spins.bloch_vector(rho), k, atol=1e-12)        # along the wave's direction of travel
    assert np.linalg.norm(spins.super_poynting(wave)) == pytest.approx(spins.super_energy(wave), rel=1e-12)
    # two waves are not: the spin is mixed
    two = np.outer(m, m) + 0.8 * np.outer(pixel.null_frame([0.0, 0.6, 0.8]), pixel.null_frame([0.0, 0.6, 0.8]))
    assert spins.purity(spins.one_spin(spins.four_spins(two))) < 0.99
    # type III is the W state of four spins: three quarters up along the repeated direction
    a = np.cross(k, [0.3, -0.5, 0.8])
    a /= np.linalg.norm(a)
    null = (a + 1j * np.cross(k, a)) / math.sqrt(2)
    three = np.outer(null, k) + np.outer(k, null)
    rho = spins.one_spin(spins.four_spins(three))
    assert pixel.petrov(three) == "III" and np.allclose(spins.bloch_vector(rho), k / 2, atol=1e-12)
    assert np.linalg.eigvalsh(rho) == pytest.approx([0.25, 0.75], abs=1e-12)
    # the tide of a mass at rest (type D, W real) has no super-Poynting vector: the spin is maximally mixed
    x = np.array([0.7, -0.4, 1.1])
    r = np.linalg.norm(x)
    tide = (np.eye(3) - 3 * np.outer(x, x) / r**2) / r**3
    rho = spins.one_spin(spins.four_spins(tide))
    assert pixel.petrov(tide) == "D" and np.allclose(rho, np.eye(2) / 2, atol=1e-12)
    assert spins.purity(rho) == pytest.approx(0.5, abs=1e-12)


@pytest.mark.parametrize("seed", [11, 12, 13, 14])
def test_in_the_fields_rest_frame_every_spin_is_maximally_mixed_and_the_reading_is_least(seed):
    rng = np.random.default_rng(seed)
    W = random_reading(rng)
    assert np.linalg.norm(spins.speedometer(W)) > 0.05                # the pixel is not at rest in this field
    V, theta = spins.rest_frame(W)
    E, B = V.real, V.imag
    assert np.abs(E @ B - B @ E).max() < 1e-10 * np.sum(np.abs(V) ** 2)                   # E and B share their axes
    assert np.abs(spins.super_poynting(V)).max() < 1e-10 * spins.super_energy(V)
    assert np.allclose(spins.one_spin(spins.four_spins(V)), np.eye(2) / 2, atol=1e-10)
    assert np.sum(np.abs(V) ** 2) == pytest.approx(spins.least_reading(W), rel=1e-10)     # sum of |eigenvalue|^2
    assert spins.least_reading(W) < np.sum(np.abs(W) ** 2)
    assert np.sort_complex(np.linalg.eigvals(V)) == pytest.approx(np.sort_complex(np.linalg.eigvals(W)), rel=1e-9)
    assert np.allclose(spins.boosted(theta, V), W, rtol=1e-10, atol=1e-10)                # and back again
    # a small boost changes the super-energy by 4 P . d theta: nothing in the rest frame, something elsewhere
    d = 1e-5 * rng.normal(size=3)
    change = lambda V: (spins.super_energy(spins.boosted(d, V)) - spins.super_energy(spins.boosted(-d, V))) / 2
    assert change(W) == pytest.approx(4 * spins.super_poynting(W) @ d, rel=1e-6)
    assert abs(change(V)) < 1e-9 * spins.super_energy(V) * np.linalg.norm(d)
    # every other observer reads more
    for _ in range(20):
        assert np.sum(np.abs(spins.boosted(rng.normal(size=3), V)) ** 2) > np.sum(np.abs(V) ** 2)
    # and a search over all boosts, started at the pixel, ends there
    size = lambda t: float(np.sum(np.abs(spins.boosted(t, W)) ** 2))
    found = minimize(size, np.zeros(3), method="BFGS", tol=1e-12)
    assert found.fun == pytest.approx(spins.least_reading(W), rel=1e-8)
    assert np.allclose(found.x, -theta, atol=1e-5)
