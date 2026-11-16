"""How much a gravitational picture can hold: the information capacity of each channel.

The near field. A flat array at height z over a sheet of sources records the
normal tidal field with white noise (paper, Section IV); each Fourier
component of the scene, at q = k z, reaches the array with signal-to-noise
ratio s(q) = pi SNR q e^{-q} under the prior of independent masses one per
area z^2 (the Wiener filter of Eq. 11). Each real degree of freedom is a
Gaussian channel and carries (1/2) log2(1 + s^2) bits (Shannon); there are
d^2k / (2 pi)^2 of them per unit area. Per area z^2 of the scene, then,

    C(SNR) = (1 / 4 pi) integral_0^inf q log2(1 + pi^2 SNR^2 q^2 e^{-2q}) dq  bits.

Where s > 1, log2(1 + s^2) ~ 2 log2 s, and s > 1 for 0 < q < q_c with
q_c e^{-q_c} = 1 / (pi SNR), the cut-off of the resolution law. Integrating
2 q (L + ln q - q) over that range, with L = ln(pi SNR) = q_c - ln q_c, gives

    C ~ (q_c^3 / 3 - q_c^2 / 2) / (4 pi ln 2) ~ (ln SNR)^3 / (12 pi ln 2):

the information in a near-field picture grows as the cube of the logarithm of
the sensitivity. The patterns resolved are the q_c^2 / 4 pi real modes inside
the cut-off, and each carries on average (q_c / 3 - 1/2) / ln 2 bits: more
sensitivity buys both more patterns and more bits in each, which is why the
power is three. At SNR = 10^3 a near-field picture holds about 38 bits per area
z^2; at 10^30, 1.6 x 10^4; at the heuristic quantum ceiling of a person
watched for the age of the universe, 10^70, about 1.8 x 10^5, some 22 kB.

The other channels, for comparison (standard results, stated for scale):

- a coherent aperture of width D at wavelength lambda resolves about
  Omega (D / lambda)^2 directions in a field of view Omega, each a channel of
  log2 SNR bits: linear in the logarithm, with a resolution fixed by D;
- a single pixel sees only the 25 spherical-harmonic coefficients of degree
  four and below of the brightness (Section VII), however sensitive it is;
- the thermal glow, recorded by counting, holds at most about
  N log2(M) bits from N gravitons over M resolution cells.

Tested in tests/test_capacity.py.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import quad
from scipy.optimize import brentq


def cutoff(snr: float) -> float:
    """q_c with q_c e^{-q_c} = 1 / (pi SNR), the larger root (the resolution law's cut-off)."""
    target = 1.0 / (math.pi * snr)
    return brentq(lambda q: math.log(q) - q - math.log(target), 1.0, 1e4)


def near_field(snr: float) -> float:
    """C(SNR), bits per area z^2 of the scene, by quadrature."""
    a = math.log(math.pi * snr)

    def integrand(q):
        log_s2 = 2.0 * (a + math.log(q) - q)       # ln s^2, computed without overflow
        if log_s2 > 30:
            return q * log_s2 / math.log(2)
        return q * math.log1p(math.exp(log_s2)) / math.log(2)

    qc = cutoff(snr)
    edges = sorted({1e-12, 1.0 / (math.pi * snr), 0.5, 1.0, qc, qc + 10.0, qc + 60.0})
    total = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        total += quad(integrand, lo, hi, limit=200, epsabs=0, epsrel=1e-11)[0]
    return total / (4.0 * math.pi)


def near_field_asymptotic(snr: float) -> float:
    """(q_c^3 / 3 - q_c^2 / 2) / (4 pi ln 2): the leading terms."""
    qc = cutoff(snr)
    return (qc ** 3 / 3.0 - qc ** 2 / 2.0) / (4.0 * math.pi * math.log(2))


def near_field_modes(snr: float) -> float:
    """Real Fourier modes per area z^2 inside the cut-off, q < q_c: q_c^2 / 4 pi."""
    return cutoff(snr) ** 2 / (4.0 * math.pi)


def counting_bound(gravitons: float, cells: float) -> float:
    """At most N log2 M bits from N detected gravitons over M resolution cells."""
    return gravitons * math.log2(cells)
