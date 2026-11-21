"""The ring that remembers (gravcam/ring.py): the shape equations against the wave they define, the turn of the
labels as half a hyperbolic area, the worked example, the deadline on a family of circuits, and weak waves."""
import math

import numpy as np
import pytest
from numpy.polynomial import Polynomial

from gravcam import ring


def test_the_ring_as_radius_turn_and_shape():
    rho, theta, r, psi = 0.7, 0.4, 0.9, 2.2
    X = ring.ring_map(rho, theta, r, psi)
    root = ring.root_shape(r, psi)
    assert np.allclose(root, root.T) and np.linalg.det(root) == pytest.approx(1.0, rel=1e-12)
    assert np.allclose(X.T @ X, rho**2 * root @ root, rtol=1e-12)                    # X^T X = rho^2 C forgets the turn
    assert ring.radius(X) == pytest.approx(rho, rel=1e-12) and ring.polar_angle(X) == pytest.approx(theta, rel=1e-12)
    assert ring.shape(X) == pytest.approx((r, psi), rel=1e-12)
    # the shape is stretched by e^(r/2) along the direction at psi / 2 and squeezed as much across it
    along = np.array([math.cos(psi / 2), math.sin(psi / 2)])
    assert np.allclose(root @ along, math.exp(r / 2) * along)
    stretch = np.diag([math.exp(r), math.exp(-r)])
    assert np.allclose(root @ root, ring.rotation(psi / 2) @ stretch @ ring.rotation(-psi / 2))


@pytest.mark.parametrize("sign", [+1, -1])
def test_the_worked_example_from_its_shape_and_from_its_wave(sign):
    r0, dpsi, power = ring.EXAMPLE
    path = ring.petal(r0, sign * dpsi, power)
    sol = ring.shape_run(path)
    theta, rho, drho = sol.y[:, -1]
    assert math.degrees(theta) == pytest.approx(sign * 9.0521, abs=1e-4)             # the labels have turned
    assert rho == pytest.approx(0.2691, abs=1e-4)                                    # the ring has shrunk
    Y = -drho / rho
    assert Y == pytest.approx(5.2542, abs=1e-4) and 1 / Y == pytest.approx(0.1903, abs=1e-4)
    # the wave that the path defines is a vacuum wave: symmetric, and trace-free by the equation for rho
    waves = [ring.wave(path, sol, u) for u in np.linspace(0.05, 0.95, 19)]
    assert max(abs(H[0, 1] - H[1, 0]) for H in waves) < 1e-9
    assert max(abs(np.trace(H)) for H in waves) < 1e-6 and max(np.abs(H).max() for H in waves) > 10
    # and integrating that wave forwards, on its own, gives the same ring: half way through, shape and all
    H = lambda u: ring.wave(path, sol, u)
    X, dX = ring.forward(H, 0.37)
    r, _, psi, _ = path(0.37)
    theta_mid, rho_mid, drho_mid = sol.sol(0.37)
    assert r > 0.4 and np.allclose(X, ring.ring_map(rho_mid, theta_mid, r, psi), atol=1e-7)
    assert ring.shape(X) == pytest.approx((r, math.remainder(psi, 2 * math.pi)), abs=1e-6)
    # and at the end, where it is round again
    X, dX = ring.forward(H)
    assert math.degrees(ring.polar_angle(X)) == pytest.approx(sign * 9.0521, abs=1e-4)
    assert ring.polar_angle(X) == pytest.approx(theta, abs=1e-7) and ring.radius(X) == pytest.approx(rho, abs=1e-7)
    assert np.allclose(X, rho * ring.rotation(theta), atol=1e-7)
    assert ring.convergence(X, dX) == pytest.approx(Y, abs=1e-6)
    assert np.abs(dX + Y * X).max() < 1e-6                                           # X' = -Y X: all aim at the centre
    # so after the wave, X + (u - T) X' vanishes when u - T = 1 / Y: the whole ring comes to a point
    assert np.abs(X + dX / Y).max() < 1e-6


@pytest.mark.parametrize("sign", [+1, -1])
def test_the_turn_is_half_the_hyperbolic_area_enclosed(sign):
    r0, dpsi, power = ring.EXAMPLE
    path = ring.petal(r0, sign * dpsi, power)
    area = ring.hyperbolic_area(path)
    assert math.degrees(area / 2) == pytest.approx(sign * 9.0521, abs=1e-4)
    assert area / 2 == pytest.approx(ring.shape_run(path).y[0, -1], abs=1e-8)
    # the area of a circle of radius r in that plane is 2 pi (cosh r - 1); a petal of width 2 pi lies inside r0
    assert abs(area) < 2 * math.pi * (math.cosh(r0) - 1)
    # the triangles are hyperbolic ones: two sides to infinity enclose pi minus the angle between them
    wedge = lambda u: (40.0, 0.0, 0.5 * u, 0.5)
    assert ring.hyperbolic_area(wedge, n=2) == pytest.approx(math.pi - 0.5, rel=1e-9)
    # and a small one is half the product of its sides times the sine
    small = lambda u: (1e-3 * (1 + u), 0.0, 0.7 * u, 0.7)
    assert ring.hyperbolic_area(small, n=2) == pytest.approx(0.5 * 1e-3 * 2e-3 * math.sin(0.7), rel=1e-5)


def test_a_rotation_is_paid_for_in_focusing():
    worst, admitted = math.inf, 0
    for r0 in (0.05, 0.3, 1.0, 2.0, 3.0):
        for dpsi in (0.5, math.pi / 2, math.pi, 2 * math.pi):
            for power in (2, 4):
                sol = ring.shape_run(ring.petal(r0, dpsi, power))
                if ring.has_caustic(sol):
                    continue                                   # a caustic inside the wave: outside the statement
                theta, rho, drho = sol.y[:, -1]
                ratio = (-drho / rho) / ring.deadline_bound(theta)
                assert ratio >= 1                              # T Y >= sinh^2 sqrt(Theta^2 + 2 pi |Theta|)
                worst, admitted = min(worst, ratio), admitted + 1
    assert admitted == 21                                      # of forty: the large ones focus before the wave ends
    assert worst == pytest.approx(1.1672, abs=1e-3)            # the closest of the family
    # the example: T Y = 5.2542 against the bound 1.4132, which alone would allow 0.708 T after the wave
    theta = math.radians(9.0521)
    assert ring.deadline_bound(theta) == pytest.approx(1.4132, abs=1e-4)
    assert 1 / ring.deadline_bound(theta) == pytest.approx(0.708, abs=1e-3)
    assert ring.deadline_bound(-theta) == ring.deadline_bound(theta) and ring.deadline_bound(0.0) == 0.0
    # above 6.95 degrees the time left is shorter than the wave itself
    assert ring.deadline_bound(math.radians(6.95)) == pytest.approx(1.0, abs=1e-3)


def test_weak_waves_turn_and_focus_at_second_order():
    base = Polynomial([0, 1]) ** 3 * Polynomial([1, -1]) ** 3 * 64     # vanishes with its slope at both ends
    a, b = base * Polynomial([1, -2]) * 3.0, base
    assert ring.weak_rotation(a, b) == pytest.approx(2.04595, abs=1e-5)
    assert ring.weak_focusing(a, b) == pytest.approx(-16.36763, abs=1e-5)
    # the same by plain sums
    u = np.linspace(0.0, 1.0, 20001)
    da, db = a.deriv(), b.deriv()
    assert ring.weak_rotation(a, b) == pytest.approx(np.trapezoid(a(u) * db(u) - b(u) * da(u), u), rel=1e-6)
    assert ring.weak_focusing(a, b) == pytest.approx(-np.trapezoid(da(u) ** 2 + db(u) ** 2, u), rel=1e-6)
    off = []
    for eps in (0.04, 0.02, 0.01):
        X, dX = ring.forward(ring.weak_wave(a, b, eps))
        turn = ring.polar_angle(X) / eps**2
        slope = -ring.convergence(X, dX) * ring.radius(X) / eps**2                    # rho'(T) / eps^2
        off.append((abs(turn / ring.weak_rotation(a, b) - 1), abs(slope / ring.weak_focusing(a, b) - 1)))
    assert off[0][0] < 0.01 and off[0][1] < 0.002                      # at eps = 0.04: 0.9 and 0.1 per cent
    for coarse, fine in zip(off, off[1:]):                             # the remainder is of the order eps^2 again
        assert fine[0] == pytest.approx(coarse[0] / 4, rel=0.1) and fine[1] == pytest.approx(coarse[1] / 4, rel=0.1)
    # one polarization alone turns nothing, and the mirror wave turns the other way
    X, _ = ring.forward(ring.weak_wave(a, 0 * b, 0.04))
    assert abs(ring.polar_angle(X)) < 1e-9
    X, _ = ring.forward(ring.weak_wave(a, -b, 0.04))
    assert ring.polar_angle(X) / 0.04**2 == pytest.approx(-2.04595, rel=0.01)
