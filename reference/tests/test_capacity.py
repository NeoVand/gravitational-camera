"""The information capacity of the near-field channel (gravcam/capacity.py)."""
import math

import numpy as np
import pytest

from gravcam import capacity as cap


@pytest.mark.parametrize("snr,tol", [(1e2, 0.06), (1e3, 0.03), (1e6, 0.01), (1e20, 0.0015), (1e70, 0.0002)])
def test_the_closed_form_approaches_the_integral(snr, tol):
    exact, approx = cap.near_field(snr), cap.near_field_asymptotic(snr)
    assert abs(exact / approx - 1) < tol


def test_the_capacity_grows_as_the_cube_of_the_logarithm():
    # doubling ln SNR multiplies the capacity by nearly eight, ever more closely
    r1 = cap.near_field(1e60) / cap.near_field(1e30)
    r2 = cap.near_field(1e200) / cap.near_field(1e100)
    assert 7.0 < r1 < 8.0 and 7.5 < r2 < 8.0 and abs(r2 - 8) < abs(r1 - 8)


def test_the_normalization_by_summing_modes_on_a_periodic_patch():
    """An independent count: a periodic patch of side L z holds the modes k = 2 pi (m, n) / (L z); each real degree of
    freedom carries (1/2) log2(1 + s^2), and a complex mode with its conjugate is two of them. The sum, per area z^2,
    must approach the integral."""
    snr, L = 1e6, 60.0
    m = np.arange(-400, 401)
    M, N = np.meshgrid(m, m)
    q = 2 * math.pi * np.hypot(M, N) / L
    s2 = (math.pi * snr * q * np.exp(-q)) ** 2
    bits = 0.5 * np.log2(1 + s2).sum()          # one real degree of freedom per lattice point of the full plane
    assert bits / L ** 2 == pytest.approx(cap.near_field(snr), rel=2e-3)


def test_modes_and_bits_per_mode():
    snr = 1e30
    qc = cap.cutoff(snr)
    assert qc * math.exp(-qc) == pytest.approx(1 / (math.pi * snr), rel=1e-10)
    per_mode = cap.near_field_asymptotic(snr) / cap.near_field_modes(snr)
    assert per_mode == pytest.approx((qc / 3 - 0.5) / math.log(2), rel=1e-12)


def test_the_numbers_quoted():
    assert cap.near_field(1e3) == pytest.approx(37.9, abs=0.1)
    assert cap.near_field(1e30) == pytest.approx(1.55e4, rel=0.01)
    assert cap.near_field(1e70) / 8 / 1024 == pytest.approx(21.7, rel=0.01)   # kB per area z^2
