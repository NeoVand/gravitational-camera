"""A spinning black hole, mode by mode: Kerr greybody factors of gravitational waves from the Teukolsky equation
through the Sasaki-Nakamura transformation (gravcam/kerrmodes.py).

The one test that approaches the extremal limit closest (a = 1 - 1e-10, about forty seconds) runs only with
GRAVCAM_SLOW=1 in the environment."""
import math
import os

import numpy as np
import pytest
from scipy.integrate import solve_ivp

from gravcam import kerrmodes as km
from gravcam.bhmodes import transmission

SPINS = (0.5, 0.7, 0.9, 0.99, 0.998)


def _angular_mismatch(A, m, c, s=-2):
    """Wronskian at the equator of the solutions of the angular equation regular at each pole, in x = cos th."""
    al, be = abs(m + s) / 2, abs(m - s) / 2

    def rhs(x, y):
        pot = c * c * x * x - 2 * c * s * x + s + A - (m + s * x) ** 2 / (1 - x * x)
        return [y[1], (2 * x * y[1] - pot * y[0]) / (1 - x * x)]

    e = 1e-6
    yr = solve_ivp(rhs, (1 - e, 0), [e**al, -al * e ** (al - 1) if al else 0.0], rtol=1e-11, atol=1e-14).y[:, -1]
    yl = solve_ivp(rhs, (-1 + e, 0), [e**be, be * e ** (be - 1) if be else 0.0], rtol=1e-11, atol=1e-14).y[:, -1]
    return yr[0] * yl[1] - yr[1] * yl[0]


def test_spheroidal_eigenvalue_is_a_root_of_the_angular_equation():
    for l, m, c in ((2, 2, 0.9), (2, -2, 0.9), (2, 1, 0.5), (2, 0, 2.0), (3, 1, 1.5)):
        A = km.spheroidal_eigenvalue(l, m, c)
        lo, mid, hi = (_angular_mismatch(A + d, m, c) for d in (-0.01, 0.0, 0.01))
        assert lo * hi < 0 and abs(mid) < 3e-3 * abs(hi - lo)
    # first order in c (Press and Teukolsky 1973): A = l(l+1) - 2 - 8 c m / (l(l+1))
    c = 1e-4
    for m in range(-2, 3):
        assert abs(km.spheroidal_eigenvalue(2, m, c) - (4 - 8 * c * m / 6)) < 1e-7


def test_check1_no_spin_is_regge_wheeler():
    for l in (2, 3):
        for x in (0.1, 0.3, 0.5, 0.8):
            ref = transmission(l, x, start=1e-7, reach=3000.0, far=6000.0)[0]  # bhmodes, tightened
            for m in range(-l, l + 1):
                g = km.greybody(l, m, 0.0, x)
                assert abs(g - ref) < 1e-6 * ref
                assert abs(g - transmission(l, x)[0]) < 1e-6  # against bhmodes as it stands


def test_check2_low_frequency_law():
    # Starobinsky and Page: approached as 1 + about 7 M omega, as for the hole that does not spin
    for m in range(-2, 3):
        r1 = km.greybody(2, m, 0.5, 0.01) / km.low_frequency(2, m, 0.5, 0.01)
        r3 = km.greybody(2, m, 0.5, 0.001) / km.low_frequency(2, m, 0.5, 0.001)
        assert 1.05 < r1 < 1.08 and 1.004 < r3 < 1.008
        assert abs((r1 - 1) / (r3 - 1) - 10) < 0.7  # linear in omega
    assert km.greybody(2, 2, 0.5, 0.01) < 0 < km.greybody(2, -2, 0.5, 0.01)
    x = 0.01  # at a = 0 Page's (256/225) x^6, times the product (1 + 16 x^2)(1 + 4 x^2) that he drops
    assert abs(km.low_frequency(2, 0, 0.0, x) / (256 / 225 * x**6 * (1 + 16 * x * x) * (1 + 4 * x * x)) - 1) < 1e-12


def test_check3_superradiance_has_its_edge_at_m_omega_h():
    for a in (0.7, 0.99):
        top = 2 * km.horizon_frequency(a)
        for f in (0.05, 0.3, 0.7, 0.95, 0.999):
            hor, inf = km.greybody_both(2, 2, a, f * top)
            assert hor < 0 and inf < 0
        for f in (1.001, 1.05, 1.5):
            hor, inf = km.greybody_both(2, 2, a, f * top)
            assert hor > 0 and inf > 0
        hor, inf = km.greybody_both(2, 2, a, top)
        assert hor == 0.0 and abs(inf) < 1e-8


def test_check4_and_A_peak_amplification():
    # -Gamma_max and M omega there for l = m = 2, as printed; the band's width m Omega_H M
    table = {0.5: (0.000119186, 0.23593, 0.26795), 0.7: (0.00273209, 0.36830, 0.40837),
             0.9: (0.0642007, 0.58195, 0.62679), 0.99: (0.555223, 0.83411, 0.86761),
             0.998: (0.909191, 0.91771, 0.93866), 0.99999: (1.33223, 0.99295, 0.99554)}
    for a, (amp, w, band) in table.items():
        g, x = km.peak_amplification(a)
        assert abs(g / amp - 1) < 1e-5 and abs(x - w) < 2e-5 and abs(2 * km.horizon_frequency(a) - band) < 1e-5


@pytest.mark.skipif(not os.environ.get("GRAVCAM_SLOW"), reason="slow: set GRAVCAM_SLOW=1")
def test_check4_towards_the_extremal_limit():
    g8, _ = km.peak_amplification(1 - 1e-8)
    g10, x10 = km.peak_amplification(1 - 1e-10)
    assert abs(g8 - 1.37544) < 1e-4 and abs(g10 - 1.37694) < 1e-4 and abs(x10 - 0.99997) < 1e-4
    assert g10 > g8 > km.peak_amplification(0.99999)[0]


def test_check5_short_waves_are_absorbed():
    for a in (0.0, 0.7, 0.99):
        for m in (-2, 0, 2):
            assert abs(km.greybody(2, m, a, 2.5) - 1) < 1e-6
        assert 0.99 < km.greybody(2, 2, a, 1.6) <= 1 + 1e-8


def test_check6_horizon_and_infinity_agree():
    for a in (0.0, 0.5, 0.9, 0.99, 0.99999):
        top = 2 * km.horizon_frequency(a)
        for w in (0.2, 0.5, 0.8, 1.2, 0.9 * top if top else 0.6):
            for m in (-2, 0, 2):
                hor, inf = km.greybody_both(2, m, a, w)
                assert abs(hor - inf) < 1e-9, (a, w, m, hor, inf)


def test_B_brighter_than_the_sky():
    meq = km.equilibrium_mass()
    assert abs(meq / 1.36e23 - 1) < 0.01  # the paper's equilibrium mass at 0.905 K
    # n_out / n_bg of the l = m = 2 mode, for holes of 10 and 100 M_eq: (spin, where, mass ratio): printed value
    expected = {(0.7, "peak", 10): 1.0087, (0.7, "peak", 100): 1.0031, (0.7, "half", 10): 1.0004,
                (0.7, "half", 100): 1.0002, (0.998, "peak", 10): 10.226, (0.998, "peak", 100): 2.1479,
                (0.998, "half", 10): 1.1241, (0.998, "half", 100): 1.0429}
    for (a, where, mr), value in expected.items():
        w = km.peak_amplification(a)[1] if where == "peak" else km.horizon_frequency(a)
        b = km.brightness(a, w, mr)
        assert abs(b["ratio"] - value) < 6e-4 * value
        # the parts: stimulated 1 - Gamma, spontaneous |Gamma| / n_bg, and the hole's own thermal part
        assert abs(b["stimulated"] + b["spontaneous"] + b["thermal"] - b["ratio"]) < 1e-12
        assert abs(b["cold"] - (1 - b["gamma"] + abs(b["gamma"]) / b["n_bg"])) < 1e-12


def test_C_tidal_moment_of_a_spinning_hole():
    assert abs(km.tidal_moment(0.0, 2) - 6.938) < 2e-3  # holeresponse's I_2
    expected = {(0.5, -2): 10.858, (0.5, -1): 8.405, (0.5, 0): 6.389, (0.5, 1): 4.769, (0.5, 2): 3.485,
                (0.9, -2): 14.308, (0.9, -1): 8.908, (0.9, 0): 5.024, (0.9, 1): 2.486, (0.9, 2): 0.844}
    for (a, m), value in expected.items():
        assert abs(km.tidal_moment(a, m) - value) < 1.5e-3 * value
    # the integrand at long waves: Gamma ~ x^5 for m != 0 (the factor omega - m Omega_H tends to -m Omega_H), x^6
    # for m = 0, so Gamma x^-4 -> 0 and the integral exists
    for m, p in ((2, 5), (-1, 5), (0, 6)):
        g1, g2 = km.low_frequency(2, m, 0.9, 1e-4), km.low_frequency(2, m, 0.9, 2e-4)
        assert abs(math.log2(g2 / g1) - p) < 0.01
