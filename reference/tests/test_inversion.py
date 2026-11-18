"""The worked near-field inversion of the locked safe: each piece against an independent route."""
import math

import numpy as np

from gravcam.constants import G
from gravcam.inversion import (
    CAMERA,
    DEPTH,
    GOLD_MASS,
    RIGHT,
    array_pixels,
    decision_error,
    design,
    distance,
    grid,
    noise_for_snr,
    posterior,
    read_box,
    read_point,
    read_sphere,
    worked_case,
)


def test_noise_follows_the_papers_definition_of_snr():
    # SNR = 2 G m / (z^2 sqrt(N0)), N0 = sigma^2 a^2; and -E_zz of a point straight ahead is 2 G m / z^3
    a, snr = 0.1, 1e3
    assert math.isclose(noise_for_snr(snr, a) * a * snr, 2 * G * GOLD_MASS / DEPTH**2, rel_tol=1e-12)
    ahead = CAMERA + np.array([0.0, 0.0, -DEPTH])
    yy = read_point(CAMERA[None], ahead, GOLD_MASS)
    E_zz = -(yy[0] + yy[1])
    assert math.isclose(-E_zz, 2 * G * GOLD_MASS / DEPTH**3, rel_tol=1e-12)


def test_a_sphere_and_a_point_of_the_same_mass_cannot_be_told_apart():
    px = array_pixels()
    p, s = read_point(px, RIGHT, GOLD_MASS), read_sphere(px, RIGHT, 0.2, GOLD_MASS)
    assert np.abs(p - s).max() < 1e-13 * np.abs(p).max()


def test_decisions():
    assert math.isclose(decision_error(0.0), 0.5)
    assert 0.9e-3 < decision_error(6.18) < 1.1e-3
    # readings scale with 1/sigma, so the distance between two scenes grows in proportion to the SNR
    assert math.isclose(worked_case(100)["left_right"], 10 * worked_case(10)["left_right"], rel_tol=1e-9)


def test_posterior_against_a_closed_form_and_a_direct_inversion():
    # one cell read by one pixel: posterior variance 1 / (|a|^2 / sigma^2 + 1 / s^2)
    px = array_pixels(n=2)[:1]
    cell = grid()[[100]]
    A = design(px, cell)
    sigma, s = 1e-10, 300.0
    _, cov = posterior(A, A[:, 0] * 50.0, sigma, s)
    assert math.isclose(cov[0, 0], 1 / (A[:, 0] @ A[:, 0] / sigma**2 + 1 / s**2), rel_tol=1e-10)
    # many cells, well conditioned: the same as inverting the posterior precision directly
    px = array_pixels()
    A = design(px, grid())
    sigma = noise_for_snr(10, 0.1)
    y = read_box(px, RIGHT)
    mean, cov = posterior(A, y, sigma, GOLD_MASS)
    P = A.T @ A / sigma**2 + np.eye(A.shape[1]) / GOLD_MASS**2
    direct = np.linalg.inv(P)
    assert np.abs(cov - direct).max() < 1e-9 * np.abs(direct).max()
    assert np.abs(mean - direct @ A.T @ y / sigma**2).max() < 1e-9 * np.abs(mean).max()


def test_the_numbers_the_paper_quotes():
    low, mid = worked_case(10), worked_case(1e3)
    assert 1.7 < low["left_right"] < 1.9 and 0.15 < low["error_left_right"] < 0.2
    assert 0.5 < mid["bar_point"] < 0.65  # the bar's shape shows only near SNR 1e4
    assert mid["point_sphere"] == 0.0
    assert 700 < mid["right"][1] < 760  # a 1 m array weighs a safe's footprint to about +-730 kg
    wide = worked_case(1e6, side=6.0)
    assert 330 < wide["right"][1] < 370
    turned = worked_case(1e3, tilt_deg=70)
    assert 1.05 < turned["left_right"] / mid["left_right"] < 1.12


def test_positivity_finds_the_gold_where_the_gaussian_image_cannot():
    from gravcam.inversion import positive_case

    linear = worked_case(1e3)
    positive = positive_case(1e3, trials=20)
    m, s = positive["right"]
    assert abs(m - GOLD_MASS) < 0.1 * GOLD_MASS and s < 30.0      # 316 +- 20 kg over 3000 draws
    assert positive["left"][0] < 5.0                                 # nothing in the empty safe
    assert linear["right"][1] > 20 * s                               # against +-730 kg without positivity


def test_posterior_with_fewer_readings_than_cells():
    """A small array reads fewer numbers than there are cells: the posterior still exists, the patterns the data
    do not reach keep their prior, and the worked case runs."""
    import numpy as np
    from gravcam.inversion import posterior, worked_case
    rng = np.random.default_rng(0)
    A = rng.standard_normal((20, 50))
    y = A @ rng.standard_normal(50)
    mean, cov = posterior(A, y, 0.1, 2.0)
    assert mean.shape == (50,) and cov.shape == (50, 50) and np.all(np.isfinite(mean))
    # the prior is kept exactly in the directions A cannot see
    _, _, Vt = np.linalg.svd(A, full_matrices=True)
    unseen = Vt[20:]
    assert np.allclose(unseen @ mean, 0.0, atol=1e-10)
    assert np.allclose(unseen @ cov @ unseen.T, 4.0 * np.eye(30), atol=1e-10)
    # and it agrees with the direct formula where that is well conditioned
    direct = np.linalg.solve(A.T @ A / 0.01 + np.eye(50) / 4.0, A.T @ y / 0.01)
    assert np.allclose(mean, direct, atol=1e-8)
    for n in (3, 4, 6):
        assert worked_case(1e3, n=n)
