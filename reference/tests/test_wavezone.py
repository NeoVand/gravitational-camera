"""The wave zone of a general source: the Fourier formula against an exact sum, the antenna limits, the image."""
import math

import numpy as np

from gravcam.constants import G, c as C
from gravcam.wavezone import (
    exact_strain,
    far_strain,
    image_of_pair,
    power_ratio,
    resolved,
    single_rotor_strain,
)

OMEGA_ROT = 2 * np.pi * 50.0
LAM = 2 * np.pi * C / (2 * OMEGA_ROT)


def test_one_rotor_matches_the_papers_amplitudes():
    # along the axis: circular, |h+| = |hx| = A = 4 G dI Omega^2 / (c^4 r); in the plane: h+ = A/2, hx = 0
    dI, r = 2.0, 1e6
    A = 4 * G * dI * OMEGA_ROT**2 / (C**4 * r)
    h = single_rotor_strain([0, 0, 1], dI, OMEGA_ROT, r)
    assert math.isclose(abs(h[0, 0]), A, rel_tol=1e-12) and math.isclose(abs(h[0, 1]), A, rel_tol=1e-12)
    h = single_rotor_strain([1, 0, 0], dI, OMEGA_ROT, r)
    assert math.isclose(abs(h[1, 1]), A / 2, rel_tol=1e-12) and abs(h[1, 2]) < 1e-12 * A


def test_the_fourier_formula_is_the_far_limit_of_the_exact_sum():
    pos = np.array([[-1.5 * LAM, 0, 0], [1.5 * LAM, 0, 0], [0, 2 * LAM, 0.5 * LAM]])
    phases = [0.0, 0.7, -1.2]
    n = np.array([0.3, 0.2, math.sqrt(1 - 0.13)])
    errors = []
    for R in (1e3 * LAM, 1e5 * LAM):
        a = far_strain(n, pos, phases, 1.0, OMEGA_ROT, R)
        b = exact_strain(R * n, pos, phases, 1.0, OMEGA_ROT)
        errors.append(np.abs(a - b).max() / np.abs(a).max())
    # the neglected Fresnel term falls as L^2 / (lambda R)
    assert errors[1] < 2e-4 and 80 < errors[0] / errors[1] < 120


def test_in_step_rotors_close_together_add_their_amplitudes_far_apart_their_powers():
    omega = 2 * OMEGA_ROT
    line = lambda s: np.array([[i * s * LAM, 0, 0] for i in range(4)])
    assert math.isclose(power_ratio(line(0.01), [0] * 4, omega, 120), 4.0, rel_tol=1e-2)
    assert math.isclose(power_ratio(line(5.0), [0] * 4, omega, 120), 1.0, rel_tol=2e-2)


def test_the_image_separates_a_pair_once_the_aperture_exceeds_about_lambda_R_over_s():
    s, R = 10.0, 1000.0
    assert not resolved(s, R, 100.0, 1.0)  # lambda R / D = s: one blob, for sources in step
    assert resolved(s, R, 160.0, 1.0)
    u, I = image_of_pair(s, R, 300.0, 1.0)
    assert abs(abs(u[np.argmax(I)]) - s / 2) < 0.1 * s  # the peaks sit at the sources
