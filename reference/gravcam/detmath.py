"""Logarithm and arctangent built only from exactly rounded operations.

The exported fixtures must regenerate byte-identically on any machine, so
every number in them is built from the operations IEEE 754 defines exactly
(+, -, *, /, sqrt), in a fixed order. The near-field quantities need ln (the
tidal column) and arctan and ln (the tidal tensor of a rectangular prism), and
neither the platform's libm nor numpy's vectorised loops promise the same last
bit everywhere. The two functions here do: they are plain series after an
exact argument reduction, evaluated elementwise with numpy's basic arithmetic.

Accuracy: about 1 unit in the last place (at most 2 for ``log`` and 3 for
``atan`` over 5e5 random arguments; the tests allow 4 against the platform's
own ``math.log`` and ``math.atan``). They are NOT correctly
rounded; they are reproducible.

``log``     x = m 2^e with m in [sqrt(1/2), sqrt(2)); ln m = 2 atanh(s) with
            s = (m - 1) / (m + 1), |s| <= 0.1716, by its Taylor series to
            s^25; e ln 2 is added with ln 2 split in two parts (the fdlibm
            constants), so that e * LN2_HI is exact.
``atan``    |t| > 1 is mapped to pi/2 - atan(1/|t|); one half-angle step
            a -> a / (1 + sqrt(1 + a^2)) brings the argument below
            tan(pi/8) = 0.414; then the Taylor series to a^51 (the first
            neglected term is below 1e-20 of the result).
"""
from __future__ import annotations

import numpy as np

LN2_HI = 6.93147180369123816490e-01     # the upper 32 bits of ln 2 (fdlibm)
LN2_LO = 1.90821492927058770002e-10     # ln 2 - LN2_HI
PI_OVER_2 = 1.5707963267948966          # float64 nearest pi / 2
_SQRT_HALF = 0.7071067811865476

_LOG_ODD = tuple(range(25, 1, -2))      # 25, 23, ..., 3
_ATAN_ODD = tuple(range(51, 1, -2))     # 51, 49, ..., 3


def log(x) -> np.ndarray:
    """Natural logarithm, elementwise. log(0) = -inf, log(negative) = nan."""
    x = np.asarray(x, dtype=np.float64)
    with np.errstate(invalid="ignore", divide="ignore", over="ignore"):
        mantissa, exponent = np.frexp(x)                 # x = mantissa 2^exponent, exact
        low = mantissa < _SQRT_HALF
        mantissa = np.where(low, mantissa + mantissa, mantissa)
        e = exponent.astype(np.float64) - low            # now mantissa in [sqrt(1/2), sqrt(2))
        s = (mantissa - 1.0) / (mantissa + 1.0)
        s2 = s * s
        tail = np.zeros_like(s)                          # sum over n = 3, 5, ..., 25 of s^(n-1) / n
        for n in _LOG_ODD:
            tail = (tail + 1.0 / n) * s2
        result = e * LN2_HI + (e * LN2_LO + (2.0 * s + 2.0 * s * tail))
    result = np.where(x == 0.0, -np.inf, result)
    result = np.where(x == np.inf, np.inf, result)
    return np.where((x < 0.0) | np.isnan(x), np.nan, result)


def _atan_unit(a):
    """atan(a) for 0 <= a <= 1."""
    a = a / (1.0 + np.sqrt(1.0 + a * a))                 # atan(a) = 2 atan(a / (1 + sqrt(1 + a^2)))
    a2 = a * a
    tail = np.zeros_like(a)                              # sum over n = 3, 5, ... of (-1)^((n-1)/2 + 1) a^(n-1) / n
    for n in _ATAN_ODD:
        tail = (1.0 / n - tail) * a2
    return 2.0 * (a - a * tail)


def atan(t) -> np.ndarray:
    """Arctangent, elementwise, in [-pi/2, pi/2]."""
    t = np.asarray(t, dtype=np.float64)
    a = np.abs(t)
    big = a > 1.0
    with np.errstate(divide="ignore", invalid="ignore"):
        reduced = np.where(big, 1.0 / np.where(big, a, 1.0), a)
    value = _atan_unit(reduced)
    value = np.where(big, PI_OVER_2 - value, value)
    return np.copysign(value, t)


def atan_ratio(numerator, denominator) -> np.ndarray:
    """atan(numerator / denominator) in [-pi/2, pi/2], without forming a
    quotient that overflows: a zero denominator gives +-pi/2 with the sign of
    the numerator, and 0 / 0 gives 0."""
    numerator = np.asarray(numerator, dtype=np.float64)
    denominator = np.asarray(denominator, dtype=np.float64)
    an, ad = np.abs(numerator), np.abs(denominator)
    swap = an > ad
    larger = np.where(swap, an, ad)
    smaller = np.where(swap, ad, an)
    positive = larger > 0.0
    value = _atan_unit(np.where(positive, smaller / np.where(positive, larger, 1.0), 0.0))
    value = np.where(swap, PI_OVER_2 - value, value)
    negative = (numerator < 0.0) != (denominator < 0.0)
    return np.where(negative, -value, value)
