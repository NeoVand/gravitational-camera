"""The reproducible logarithm and arctangent (``gravcam.detmath``).

They are compared with the platform's ``math.log`` and ``math.atan``, which
are themselves good to about 1 unit in the last place (ulp); the series here
add 1 to 2 more (observed over the samples below: at most 2 ulp for log, 3 for
atan). The tests allow 4 ulp. What the fixtures need is not the last bit but
that the same bits come out everywhere, which holds because only +, -, *, /,
sqrt and frexp are used; that part cannot be tested on one machine, only kept
true by construction (see the test of the source at the end).
"""
import inspect
import math

import numpy as np
import pytest

from gravcam import detmath

ULPS = 4.0


def ulp_error(found, expected):
    spacing = np.spacing(np.abs(expected))
    return np.max(np.abs(found - expected) / spacing)


def test_log_against_libm():
    rng = np.random.default_rng(11)
    x = np.concatenate([
        10.0 ** rng.uniform(-300, 300, 50000),        # every binade
        rng.uniform(0.5, 2.0, 50000),                 # around 1, where the result is small
        1.0 + rng.uniform(-1e-6, 1e-6, 20000),
        1.0 + rng.uniform(-1e-12, 1e-12, 20000),
        [2.0, 0.5, 4.0, 1e-310, 5e-324, 1.7e308, math.sqrt(0.5), math.sqrt(2.0)],
    ])
    x = x[x != 1.0]
    expected = np.array([math.log(v) for v in x])
    assert ulp_error(detmath.log(x), expected) <= ULPS


def test_log_special_values():
    assert float(detmath.log(1.0)) == 0.0                      # exactly: unused segments must add nothing
    assert float(detmath.log(2.0)) == pytest.approx(math.log(2.0), rel=2e-16)
    assert detmath.log(0.0) == -np.inf and detmath.log(np.inf) == np.inf
    assert np.isnan(detmath.log(-1.0)) and np.isnan(detmath.log(np.nan))
    assert detmath.log(np.ones((2, 3))).shape == (2, 3)


def test_log_of_a_product_and_a_power():
    # identities that do not go through libm: ln(a b) = ln a + ln b, ln 2^n = n ln 2
    rng = np.random.default_rng(12)
    a, b = rng.uniform(1.0, 3.0, 1000), rng.uniform(1.0, 3.0, 1000)
    assert detmath.log(a * b) == pytest.approx(detmath.log(a) + detmath.log(b), rel=1e-15, abs=1e-15)
    n = np.arange(-1000, 1001)
    assert detmath.log(np.ldexp(1.0, n)) == pytest.approx(n * 0.6931471805599453, rel=4e-16, abs=0.0)


def test_atan_against_libm():
    rng = np.random.default_rng(13)
    t = np.concatenate([
        rng.standard_normal(50000) * 10.0 ** rng.uniform(-10, 10, 50000),
        rng.uniform(-2.0, 2.0, 50000),
        [1.0, -1.0, 1e-300, 1e300, math.tan(math.pi / 8), 0.4142135623730951],
    ])
    expected = np.array([math.atan(v) for v in t])
    assert ulp_error(detmath.atan(t), expected) <= ULPS


def test_atan_special_values():
    assert float(detmath.atan(0.0)) == 0.0
    assert float(detmath.atan(1.0)) == pytest.approx(math.pi / 4, rel=2e-16)
    assert float(detmath.atan(np.inf)) == math.pi / 2 and float(detmath.atan(-np.inf)) == -math.pi / 2
    assert np.isnan(detmath.atan(np.nan))
    # odd, and atan(t) + atan(1/t) = pi/2
    rng = np.random.default_rng(14)
    t = rng.uniform(0.01, 100.0, 1000)
    assert np.array_equal(detmath.atan(-t), -detmath.atan(t))
    assert detmath.atan(t) + detmath.atan(1.0 / t) == pytest.approx(math.pi / 2, rel=4e-16)


def test_atan_ratio():
    rng = np.random.default_rng(15)
    num = rng.standard_normal(50000) * 10.0 ** rng.uniform(-5, 5, 50000)
    den = rng.standard_normal(50000) * 10.0 ** rng.uniform(-5, 5, 50000)
    expected = np.array([math.atan(a / b) for a, b in zip(num, den)])
    assert ulp_error(detmath.atan_ratio(num, den), expected) <= ULPS
    # the cases the prism formula meets in the plane of a face and on an edge's line
    found = detmath.atan_ratio([1.0, -1.0, 0.0, 0.0, 3.0, -0.0], [0.0, 0.0, 0.0, 5.0, -3.0, 0.0])
    assert found.tolist() == [math.pi / 2, -math.pi / 2, 0.0, 0.0, -float(detmath.atan(1.0)), 0.0]
    # no overflow where the quotient would
    assert float(detmath.atan_ratio(1e300, 1e-300)) == math.pi / 2


def test_the_three_corner_arctangents_add_up_to_a_right_angle():
    """atan(yz/(xr)) + atan(zx/(yr)) + atan(xy/(zr)) = pi/2 for x, y, z > 0:
    the identity behind the trace of the prism's tidal tensor."""
    rng = np.random.default_rng(16)
    x, y, z = rng.uniform(0.01, 10.0, (3, 5000))
    r = np.sqrt(x * x + y * y + z * z)
    total = detmath.atan_ratio(y * z, x * r) + detmath.atan_ratio(z * x, y * r) + detmath.atan_ratio(x * y, z * r)
    assert total == pytest.approx(math.pi / 2, rel=1e-15)


def test_results_do_not_depend_on_batching():
    rng = np.random.default_rng(17)
    x = rng.uniform(0.1, 10.0, 1000)
    whole = detmath.log(x)
    assert all(float(detmath.log(v)) == w for v, w in zip(x, whole))
    whole = detmath.atan(x)
    assert all(float(detmath.atan(v)) == w for v, w in zip(x, whole))


def test_only_exactly_rounded_operations_are_used():
    """No transcendental numpy or math function in the module: that is what
    makes the results the same on every platform."""
    source = inspect.getsource(detmath)
    body = source.split('"""', 2)[2]                       # everything after the module docstring
    code = "\n".join(line.split("#")[0] for line in body.splitlines())
    for name in ("np.log", "np.arctan", "np.exp", "np.power", "math.", "**", "np.sin", "np.cos", "np.tan",
                 "np.dot", "einsum", "@"):
        assert name not in code, name
