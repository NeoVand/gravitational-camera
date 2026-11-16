"""The near-field resolution study (gravcam/resolution.py)."""
import json
import math

import numpy as np
import pytest

from gravcam import resolution
from gravcam.resolution import bessel_j0, bessel_j1, cutoff, psf, transfer, widths

RESULTS = resolution.RESULTS_DIR / "near_field_resolution.json"


def test_bessel_functions():
    # values from Abramowitz & Stegun, table 9.1, and the first zeros
    assert bessel_j0(1.0) == pytest.approx(0.7651976865579666, abs=1e-15)
    assert bessel_j1(1.0) == pytest.approx(0.4400505857449335, abs=1e-15 * 2)
    assert bessel_j0(10.0) == pytest.approx(-0.2459357644513483, abs=1e-14)
    assert abs(bessel_j0(2.404825557695773)) < 1e-14
    assert abs(bessel_j1(3.8317059702075125)) < 1e-14


def test_hankel_quadrature_on_a_known_pair():
    """int_0^inf e^{-a q} J0(q r) q dq = a / (a^2 + r^2)^{3/2}: the transform
    machinery that the 2D point-spread function uses. The trapezoid rule's end
    correction, h^2 f'(0) / 12 = 2e-5 here, is the whole of the difference; in
    the point-spread function it is diluted by an integral of order q_c^2."""
    a = 0.7
    q = np.linspace(0.0, 80.0, 80 * 64 + 1)
    w = np.full(q.size, q[1] - q[0])
    w[0] = w[-1] = 0.5 * w[0]
    for r in (0.0, 0.3, 1.0, 2.5):
        numeric = np.sum(w * np.exp(-a * q) * bessel_j0(q * r) * q)
        exact = a / (a * a + r * r) ** 1.5
        assert numeric == pytest.approx(exact - (q[1] - q[0]) ** 2 / 12, rel=1e-7)


@pytest.mark.parametrize("decades", [2, 6, 20, 100])
def test_cutoff_is_where_half_survives(decades):
    snr = 10.0**decades
    qc = cutoff(snr)
    assert qc * math.exp(-qc) == pytest.approx(1 / (math.pi * snr), rel=1e-12)
    assert transfer(qc, snr) == pytest.approx(0.5, abs=1e-12)
    assert qc > 1                                             # the larger root
    assert transfer(qc - 5, snr) > 0.999 and transfer(qc + 5, snr) < 1e-3


def test_cutoff_needs_some_signal():
    with pytest.raises(ValueError):
        cutoff(0.5)


def test_large_snr_limits_are_the_pupil_patterns():
    """H tends to a step at q_c: the PSF tends to 2 J1(x) / x (2D) and
    sin(x) / x (1D) of x = q_c r, whose half maxima are known."""
    snr = 1e100
    for dims, half in ((2, resolution.JINC_HALF), (1, resolution.SINC_HALF)):
        w = widths(snr, dims)
        assert w["fwhm"] * w["q_c"] == pytest.approx(2 * half, rel=2e-3)
    assert 2 * bessel_j1(resolution.JINC_HALF) / resolution.JINC_HALF == pytest.approx(0.5, abs=1e-14)
    assert math.sin(resolution.SINC_HALF) / resolution.SINC_HALF == pytest.approx(0.5, abs=1e-14)


def test_psf_is_one_at_the_centre_and_rings():
    snr = 1e6
    qc = cutoff(snr)
    for dims in (1, 2):
        values = psf(np.array([0.0, 1.0, 5.0]) / qc, snr, dims)
        assert values[0] == pytest.approx(1.0, abs=1e-12)
        assert 0 < values[1] < 1 and values[2] < 0                # a negative first ring


def test_two_points_need_a_little_more_than_the_half_width():
    w = widths(1e20, 2)
    assert w["fwhm"] < w["sparrow"] < w["first_zero"] * 2


def test_results_file_is_current():
    stored = json.loads(RESULTS.read_text(encoding="utf-8"))
    for row in stored["rows"]:
        if row["snr_decades"] not in (3, 20):
            continue                                              # two rows keep the suite quick
        snr = 10.0 ** row["snr_decades"]
        assert cutoff(snr) == pytest.approx(row["q_c"], rel=1e-12)
        for dims, key in ((2, "array"), (1, "slice")):
            fresh = widths(snr, dims)
            for name in ("fwhm", "sparrow"):
                assert fresh[name] == pytest.approx(row[key][name], rel=1e-9), (key, name)
    for profile in stored["profiles"]:
        fresh = psf(np.array(profile["r"]), 10.0 ** profile["snr_decades"], 1)
        assert np.allclose(fresh, profile["slice"], rtol=0, atol=1e-12)


def test_the_simple_law_is_the_right_size():
    """The paper's first estimate, pi / ln SNR, is within a factor 1.5 of the
    exact half width wherever an array could plausibly operate."""
    stored = json.loads(RESULTS.read_text(encoding="utf-8"))
    for row in stored["rows"]:
        ratio = row["array"]["fwhm_times_ln_snr"] / math.pi
        assert 0.75 < ratio < 1.45
