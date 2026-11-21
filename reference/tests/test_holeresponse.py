"""A black hole's answer to a tide (gravcam/holeresponse.py): the sum rule and its shell, the dispersive Love number
that the hole does not have, and the response at imaginary frequencies. The frequency grid is coarse, to keep these
tests to a few seconds; the tolerances below allow for it (see the module's last paragraph)."""
import math

import numpy as np
import pytest

from gravcam import hair
from gravcam import holeresponse as hr
from gravcam.constants import G, c


def test_the_grid_of_absorption_probabilities():
    x, gamma = hr.greybody_grid()
    assert len(x) == 41 and x[0] == pytest.approx(0.03) and x[-1] == pytest.approx(1.0)
    assert np.all(gamma > 0) and np.all(np.diff(gamma)[gamma[1:] < 0.999] > 0)      # rising, until all of it goes in
    assert gamma[0] / (hr.PAGE * x[0] ** 6) == pytest.approx(1.25, abs=0.03)        # Page's law, 25 per cent off there
    assert np.max(np.abs(gamma[x > 0.8] - 1.0)) < 1e-5                              # all of a short wave goes in
    half = math.exp(np.interp(0.5, gamma[gamma < 0.999], np.log(x[gamma < 0.999])))
    assert half == pytest.approx(0.377, abs=0.003)                                  # and half of it at x = 0.377
    assert hr.greybody_grid() is hr.greybody_grid()                                 # computed once


def test_the_sum_rule_is_that_of_a_shell_at_the_horizon():
    assert hr.greybody_moment(4) == pytest.approx(6.938, abs=3e-3)                  # 6.9381 on the fine grid
    assert hr.sum_rule() == pytest.approx(0.345, abs=5e-4)                          # in units of M r_s^2
    assert hr.sum_rule() == pytest.approx(5 / (32 * math.pi) * hr.greybody_moment(4), rel=1e-12)
    assert hr.shell_radius() == pytest.approx(1.017, abs=1e-3)                      # in units of r_s
    # twice the sum rule is a moment of inertia: 0.69 M r_s^2, between a ball's 2/5 and the hole's own J / Omega_H = 1,
    # and next to a shell's 2/3
    assert 2 / 5 < 2 / 3 < 2 * hr.sum_rule() < 1
    assert 2 * hr.sum_rule() == pytest.approx(0.690, abs=1e-3)
    M = 1.989e30
    r_s = hair.schwarzschild_radius(M)
    assert hr.sum_rule_si(M) == pytest.approx(0.345 * M * r_s**2, rel=2e-3)
    assert hr.sum_rule_si(M) == pytest.approx(M * (hr.shell_radius() * r_s) ** 2 / 3, rel=1e-12)


def test_the_dispersive_love_number_that_a_hole_does_not_have():
    assert hr.greybody_moment(6) == pytest.approx(36.13, abs=0.02)                  # 36.130 on the fine grid
    k2 = hr.dispersive_love_number()
    assert k2 == pytest.approx(0.674, abs=1e-3)                                     # a uniform fluid ball has 0.75
    # the paper quotes it on Love's scale (Section IV: k_2 R^5 / 3G times the tide, a uniform fluid ball 3/2): twice this
    assert f"{2 * k2:.2f}" == "1.35"
    assert k2 == pytest.approx(hr.LOVE_SCALE * hr.greybody_moment(6), rel=1e-9)
    assert 0.5 < k2 < 0.75
    # the mean frequency of the sum rule against the fundamental quasi-normal mode, 0.374
    assert hr.mean_frequency() == pytest.approx(0.438, abs=1e-3)
    assert hr.mean_frequency() == pytest.approx(math.sqrt(hr.greybody_moment(4) / hr.greybody_moment(6)), rel=1e-12)
    assert (0.374 / hr.mean_frequency()) ** 2 == pytest.approx(0.73, abs=5e-3)     # one mode does not exhaust the rule


def test_the_response_at_imaginary_frequencies_is_negative_throughout():
    k2 = hr.dispersive_love_number()
    table = [(0.005, -0.00030), (0.02, -0.00271), (0.05, -0.01388), (0.1, -0.04779), (0.2, -0.14678),
             (0.5, -0.40716), (1.0, -0.57212), (3.0, -0.66000), (10.0, -0.67258)]
    for y, want in table:
        got = hr.love_number_at_imaginary_frequency(y)
        assert got == pytest.approx(want, abs=2e-4)                                 # the fine grid's values
        assert got == pytest.approx(hr.dispersive_love_number(y) - k2, abs=1e-9)    # the same, as a difference
    ys = np.geomspace(1e-4, 1e4, 33)
    curve = np.array([hr.love_number_at_imaginary_frequency(float(y)) for y in ys])
    assert np.all(curve < 0) and np.all(np.diff(curve) < 0)                         # negative, and falling
    assert curve[-1] == pytest.approx(-k2, abs=1e-6)                                # to minus the dispersive number
    assert hr.love_number_at_imaginary_frequency(0.0) == 0.0
    # it leaves zero with the slope of the friction alone, -1/30, and is soon steeper
    assert curve[0] / ys[0] == pytest.approx(hr.FRICTION_SLOPE, rel=0.02)
    assert hr.love_number_at_imaginary_frequency(0.005) / (0.005 * hr.FRICTION_SLOPE) == pytest.approx(1.8, abs=0.1)
    assert hr.love_number_at_imaginary_frequency(0.2) == pytest.approx(-0.15, abs=5e-3)


def test_for_long_waves_the_response_is_the_friction_of_the_horizon():
    M = 1.989e30
    excess = []
    for x in (0.01, 0.005):
        omega = x * c**3 / (G * M)
        excess.append(hr.im_chi(M, omega) / (hair.horizon_friction(M) * omega) - 1)
        # the same statement as the absorption of hair.py: Gamma_2 = (16 / 5) G omega^5 Im chi / c^5
        assert 16 * G * omega**5 * hr.im_chi(M, omega) / (5 * c**5) == pytest.approx(
            hair.quadrupole_absorption(M, omega) * (1 + excess[-1]), rel=1e-12)
    assert excess[0] == pytest.approx(0.07, abs=0.02)                               # 7 per cent above at x = 0.01
    assert excess[1] == pytest.approx(excess[0] / 2, rel=0.1)                       # half that at half the frequency
