"""What a passing mass leaves in a body (gravcam/passing.py): the thin shell three ways, the moment series, the
twins of Fig. ladder, what the passes determine of a body that is not round, and the full Newtonian motion."""
import math

import numpy as np
import pytest

from gravcam import passing as ps
from gravcam import readings

IMPACTS = (1.1, 1.2, 1.5, 2.0, 3.0, 10.0)


def test_the_thin_shell_three_ways():
    for r in (0.3, 1 / math.sqrt(2), 1.0):
        for b in IMPACTS:
            closed = ps.shell_F(b, r)
            assert ps.shell_F_by_quadrature(b, r) == pytest.approx(closed, rel=1e-10)
            assert ps.body_F_by_series([(1.0, r)], b) == pytest.approx(closed, rel=1e-10)
    assert ps.shell_F(2.0, 0.0, 3.0) == 3.0 / 4.0                                 # a point at the centre, m / b^2
    # close to the shell the quadrature needs more points, and still agrees
    assert ps.shell_F_by_quadrature(1.02, 1.0, n_theta=128, n_phi=2048) == pytest.approx(ps.shell_F(1.02, 1.0),
                                                                                         rel=1e-8)


def test_the_twins_three_ways():
    for body in ps.twins():
        for b in (1.2, 1.5, 2.0, 3.0):
            closed = ps.body_F(body, b)
            assert abs(ps.body_F_by_quadrature(body, b) - closed) < 1e-8 * closed
            assert abs(ps.body_F_by_series(body, b) - closed) < 1e-8 * closed
    assert ps.twins() == readings.ladder_pair(1.0, 1.0)                           # the bodies of Fig. ladder


def test_the_series_coefficients():
    assert [ps.series_coefficient(p) for p in range(4)] == pytest.approx([1, 2 / 3, 8 / 15, 16 / 35], rel=1e-15)
    # they are those of arcsin(u) / sqrt(1 - u^2) = sum c_p u^(2p+1)
    u = 0.3
    assert sum(ps.series_coefficient(p) * u ** (2 * p + 1) for p in range(60)) == pytest.approx(
        math.asin(u) / math.sqrt(1 - u * u), rel=1e-14)
    # and the first three terms of F for a uniform ball: M / b^2 + (2/3) (3/5) R^2 M / b^4 + (8/15) (3/7) R^4 M / b^6
    ball = readings.uniform_layer(1.0, 0.0, 1.0, n=16)
    b = 25.0
    three = 1 / b**2 + (2 / 3) * (3 / 5) / b**4 + (8 / 15) * (3 / 7) / b**6
    assert ps.body_F(ball, b) == pytest.approx(three, rel=1e-9)


def test_the_recoil_takes_the_first_term():
    # for a round body Delta P = C M b / b^2: the planar sum over the projected particles of a twin says so
    for body in ps.twins():
        p, m = ps.particles(body, 24, 48)
        s = p[:, 0] + 1j * p[:, 1]
        for b in (1.5, 2.0, 3.0):
            assert complex(ps.planar_kick(m, s, b)) == pytest.approx(1.0 / b, rel=1e-6)
            assert float(ps.planar_F(m, s, b)) == pytest.approx(ps.body_F(body, b), rel=1e-6)
            assert ps.recoil_F(body, b) == pytest.approx(1.0 / b**2, rel=1e-15)
    shell = [(2.0, 1.0)]
    assert ps.internal_energy(shell, 1.5, 0.1) == pytest.approx(0.005 * (ps.body_F(shell, 1.5) - 2.0 / 1.5**2),
                                                                rel=1e-15)


def test_the_twins_internal_energies():
    a, b = ps.twin_energies(1.5)                                                   # in units of M C^2 / 2 R^2
    assert f"{a:.4f}" == "0.0803" and f"{b:.4f}" == "0.1041"
    assert f"{100 * ps.twin_excess(1.5):.1f}" == "29.6"                            # B takes 30 per cent more
    assert f"{100 * ps.twin_excess(1.5):.0f}" == "30"
    assert f"{100 * ps.twin_excess(1.2):.0f}" == "76"
    assert f"{100 * ps.twin_excess(2.0):.0f}" == "13"
    assert f"{100 * ps.twin_excess(3.0):.1f}" == "4.9"
    # B always more, by less as the pass is further
    excess = [ps.twin_excess(b) for b in (1.2, 1.5, 2.0, 3.0, 5.0)]
    assert np.all(np.diff(excess) < 0) and excess[-1] > 0


def test_far_away_the_twins_differ_by_their_fourth_moments():
    # E_B - E_A -> M C^2 R^4 / 15 b^6, (2/15) (R / b)^6 in units of M C^2 / 2 R^2, with a correction in (R / b)^2
    for b in (10.0, 30.0, 100.0):
        ea, eb = ps.twin_energies(b)
        assert (eb - ea) / ps.twin_far_difference(b) == pytest.approx(1.0, abs=1.5 / b**2)
    # the <r^2> agree, so the b^-4 terms cancel; the <r^4> are R^4 / 4 and R^4 / 2
    A, B = ps.twins()
    assert ps.radial_moment(A, 1) == pytest.approx(ps.radial_moment(B, 1), rel=1e-15)
    assert ps.radial_moment(B, 2) - ps.radial_moment(A, 2) == pytest.approx(0.25, rel=1e-14)
    assert ps.series_coefficient(2) * 0.25 == pytest.approx(2 / 15, rel=1e-15)


SCENE = (np.array([0.5, 0.3, 0.15, 0.05]), np.array([0.1 + 0.05j, -0.6 + 0.3j, 0.4 - 0.7j, 0.2 + 0.9j]))


def test_the_terms_of_F_vary_as_powers_and_harmonics_of_the_impact_point():
    m, z = SCENE
    moments = ps.complex_moments(m, z, order=40)
    for b in (3.0 * np.exp(0.7j), 5.0 * np.exp(-2.1j)):
        assert complex(ps.F_from_moments(moments, b)) == pytest.approx(float(ps.planar_F(m, z, b)), rel=1e-12)
        rho, phi = abs(b), np.angle(b)
        for (p, q), v in list(moments.items())[:12]:
            assert v * b ** -(p + 1) * np.conj(b) ** -(q + 1) == pytest.approx(
                v * rho ** -(p + q + 2) * np.exp(1j * (q - p) * phi), rel=1e-12)


def test_two_circles_of_passes_return_the_moments_up_to_the_third_order():
    m, z = SCENE
    true = ps.complex_moments(m, z, order=3)
    F = lambda b: ps.planar_F(m, z, b)
    errors = []
    for radii in ((6.0, 8.0), (12.0, 16.0), (24.0, 32.0)):
        got = ps.moments_from_passes(F, radii, order=3)
        assert sorted(got) == sorted(true) and len(got) == 10                      # p + q <= 3
        errors.append(max(abs(got[k] - true[k]) for k in true))
    assert errors[-1] < 1e-3
    assert errors[0] / errors[1] == pytest.approx(4.0, rel=0.1)                    # falling as (size / |b|)^2
    assert errors[1] / errors[2] == pytest.approx(4.0, rel=0.1)
    # the moments are those of the body, not of a round one: m_01 and m_02 are not zero here
    assert abs(true[(0, 1)]) > 0.05 and abs(true[(0, 2)]) > 0.05


def test_the_momentum_knows_only_the_harmonic_moments():
    m, z = SCENE
    order = 30
    moments = ps.complex_moments(m, z, order)
    for b in (2.5 * np.exp(0.4j), 4.0 * np.exp(2.9j)):
        assert complex(ps.kick_from_harmonic_moments(moments, b)) == pytest.approx(
            complex(ps.planar_kick(m, z, b)), rel=1e-12)
    # a pair: the third mass replaced by a ring of its mass about its place
    rm, rz = ps.ring(m[2], z[2], 0.25)
    m2 = np.concatenate([np.delete(m, 2), rm])
    z2 = np.concatenate([np.delete(z, 2), rz])
    one, two = ps.complex_moments(m, z, 6), ps.complex_moments(m2, z2, 6)
    for q in range(7):
        assert two[(0, q)] == pytest.approx(one[(0, q)], abs=1e-14)               # the same harmonic moments
    assert (two[(1, 1)] - one[(1, 1)]).real == pytest.approx(m[2] * 0.25**2, rel=1e-12)   # a different m_11
    for b in (2.0 * np.exp(0.3j), 2.5 * np.exp(-1.9j), 4.0 * np.exp(2.2j)):
        assert complex(ps.planar_kick(m2, z2, b)) == pytest.approx(complex(ps.planar_kick(m, z, b)), abs=1e-14)
        assert float(ps.planar_F(m2, z2, b)) > float(ps.planar_F(m, z, b)) * (1 + 1e-4)  # but more energy


@pytest.mark.parametrize("which", [0, 1])
def test_the_full_motion_tends_to_the_impulse_formula(which):
    body = ps.twins()[which]
    p, m = ps.particles(body)
    assert 500 <= len(m) <= 1000
    misses = []
    for V2 in (400.0, 6400.0):                                                     # V^2 R / G M
        r = ps.full_pass(p, m, 1e-3, math.sqrt(V2), 1.5)
        formula = ps.internal_energy(body, 1.5, r["C"])
        assert r["impulse_internal"] == pytest.approx(formula, rel=1e-5)          # the particles are the body
        misses.append(r["internal"] / formula - 1)
        # the energy the mass lost, carried to large distance, is the energy the particles gained
        assert r["lost"] == pytest.approx(r["gained"], rel=1e-6)
        assert r["gained"] == pytest.approx(r["impulse_gained"], rel=3e-3)
    assert abs(misses[0]) < 0.03                                                   # a few per cent at 400 (0.5-0.6)
    assert abs(misses[1]) < 0.003                                                  # a few per mil at 6400 (0.3-0.4)
    assert misses[0] / misses[1] == pytest.approx(16.0, rel=0.1)                   # as 1 / V^2


def test_the_tonne_that_passes_a_steel_ball_a_metre_across():
    """Section XII: a tonne passing a metre from the edge of a steel ball a metre across at 44 km/s gives that edge
    3e-12 m/s and leaves with its speed lower by five parts in 10^33."""
    import math
    G, mu, V, R, b = 6.674e-11, 1000.0, 4.4e4, 0.5, 1.5
    M = 7850.0 * 4 / 3 * math.pi * R**3
    C = 2 * G * mu / V
    assert f"{C / (b - R):.0e}" == "3e-12"
    # a uniform ball: <r^(2p)> = 3 R^(2p) / (2p + 3); F = M sum_p [(2p)!!/(2p+1)!!] <r^(2p)> / b^(2p+2)
    F, coefficient = 0.0, 1.0
    for p in range(60):
        F += M * coefficient * 3 * R**(2 * p) / (2 * p + 3) / b**(2 * p + 2)
        coefficient *= (2 * p + 2) / (2 * p + 3)
    lost = 0.5 * C**2 * F / (mu * V**2)
    assert f"{lost:.0e}" == "5e-33"
