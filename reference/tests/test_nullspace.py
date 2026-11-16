"""Same outside, different inside (gravcam/nullspace.py): a point mass in a ball, its harmonic projection and its
balayage onto the surface have the same potential everywhere outside, computed independently; the projection is
harmonic, with its extremes on the surface; the three differ in int rho r^2, which the moment of inertia carries."""
import math

import numpy as np
import pytest

from scipy.integrate import quad

from gravcam import nullspace as ns

M, S, R = 2.0, 0.5, 1.0


def test_closed_form_is_the_series():
    for r, mu in [(0.0, 0.3), (0.3, 0.2), (0.6, -1.0), (1.0, 1.0), (1.0, -0.4), (0.85, 0.97)]:
        assert ns.harmonic_point(M, S, R, r, mu) == pytest.approx(ns.harmonic_point_series(M, S, R, r, mu), rel=1e-12)


def test_projection_is_harmonic():
    """The Laplacian of rho_h, by finite differences in Cartesian coordinates, vanishes inside the ball."""
    def f(p):
        r = np.linalg.norm(p)
        return float(ns.harmonic_point(M, S, R, r, p[2] / r if r > 0 else 1.0))
    rng = np.random.default_rng(3)
    h = 1e-3
    for _ in range(12):
        p = rng.uniform(-0.6, 0.6, 3)
        lap = sum((f(p + h * e) - 2 * f(p) + f(p - h * e)) / h ** 2 for e in np.eye(3))
        assert abs(lap) < 1e-5 * ns.harmonic_point_peak(M, S, R)


@pytest.mark.parametrize("l", [0, 1, 2, 3, 5, 8, 12])
def test_same_moments(l):
    """All three have the exterior moments m s^l, so the same field outside."""
    want = M * S ** l
    vol = ns.volume_moment(lambda r, mu: float(ns.harmonic_point(M, S, R, r, mu)), R, l)
    surf = ns.surface_moment(lambda mu: float(ns.balayage_point(M, S, R, mu)), R, l)
    assert vol == pytest.approx(want, rel=1e-8, abs=1e-12)
    assert surf == pytest.approx(want, rel=1e-8, abs=1e-12)


@pytest.mark.parametrize("point", [(0.0, 1.05), (0.3, 1.02), (1.2, 0.4), (0.0, -1.3), (2.0, 2.0), (1.01, 0.0)])
def test_same_potential_outside(point):
    """Direct integration over rings, at points just outside the surface and farther away."""
    want = ns.potential_point(M, S, point)
    vol = ns.potential_volume(lambda r, mu: float(ns.harmonic_point(M, S, R, r, mu)), R, point)
    surf = ns.potential_surface(lambda mu: float(ns.balayage_point(M, S, R, mu)), R, point)
    assert vol == pytest.approx(want, rel=1e-7)
    assert surf == pytest.approx(want, rel=1e-7)


def test_extremes_on_the_surface():
    """Maximum principle: the projection is largest at the wall nearest the mass and smallest on the surface too;
    for s = R/2 the peak is 46 m/(4 pi R^3), fifteen times the mass spread evenly, and the far wall dips below zero."""
    unit = M / (4 * math.pi * R ** 3)
    assert ns.harmonic_point_peak(M, S, R) == pytest.approx(46 * unit, rel=1e-12)
    assert float(ns.harmonic_point(M, S, R, R, 1.0)) == pytest.approx(46 * unit, rel=1e-12)
    assert float(ns.harmonic_point(M, S, R, R, -1.0)) == pytest.approx(-2 / 27 * unit, rel=1e-9)
    r, mu = np.meshgrid(np.linspace(0, R, 401), np.linspace(-1, 1, 401))
    v = ns.harmonic_point(M, S, R, r, mu)
    inside = r < 0.999 * R
    assert v[inside].max() < v[~inside].max() and v[inside].min() > v[~inside].min()
    # a steel ball with a gold nugget: the projection, steel included, is a real density everywhere
    steel, gold, b = 7800.0, 19300.0, 0.15 * R
    nugget = (gold - steel) * 4 / 3 * math.pi * b ** 3
    assert steel + ns.harmonic_point(nugget, S, R, r, mu).min() > 0.99 * steel


def test_balayage_carries_the_mass():
    total = 2 * math.pi * R * R * quad(lambda mu: float(ns.balayage_point(M, S, R, mu)), -1, 1)[0]
    assert total == pytest.approx(M, rel=1e-10)


def test_what_spin_sees():
    """The trace moment int rho r^2: m s^2, (3/5) m R^2, m R^2, by integration; the moments of inertia follow."""
    vol = 2 * math.pi * quad(lambda r: quad(lambda mu: float(ns.harmonic_point(M, S, R, r, mu)), -1, 1,
                                                  epsrel=1e-12)[0] * r ** 4, 0, R, epsrel=1e-11)[0]
    surf = 2 * math.pi * R ** 4 * quad(lambda mu: float(ns.balayage_point(M, S, R, mu)), -1, 1, epsrel=1e-12)[0]
    t = ns.trace_moments(M, S, R)
    assert vol == pytest.approx(t["harmonic"], rel=1e-9)
    assert surf == pytest.approx(t["balayage"], rel=1e-9)
    assert t["point"] == pytest.approx(M * S * S)
    # about the x axis, by integration of rho (y^2 + z^2) = rho r^2 (1 - (1 - mu^2)/2)
    ix = 2 * math.pi * quad(lambda r: quad(
        lambda mu: float(ns.harmonic_point(M, S, R, r, mu)) * (1 - (1 - mu * mu) / 2), -1, 1, epsrel=1e-12)[0] * r ** 4,
        0, R, epsrel=1e-11)[0]
    i = ns.inertia(M, S, R, "x")
    assert ix == pytest.approx(i["harmonic"], rel=1e-9)
    assert i["point"] == pytest.approx(M * S * S)
    assert i["point"] < i["harmonic"] < i["balayage"]
    assert ns.inertia(M, S, R, "z")["point"] == pytest.approx(0.0, abs=1e-15)


def test_the_earth_from_outside():
    """Seen from outside, the layered Earth is a uniform ball of its mean density; with the core's radius from the
    glow, its mass and its moment of inertia give a two-layer Earth."""
    radii = [1221.5e3, 3480e3, 5701e3, 6346e3, 6371e3]
    dens = [12900, 11000, 4900, 3400, 2800]
    mean = ns.mean_density(radii, dens)
    edges = np.concatenate([[0.0], radii])
    mass = 4 / 3 * math.pi * np.sum(np.array(dens) * (edges[1:] ** 3 - edges[:-1] ** 3))
    assert mean == pytest.approx(mass / (4 / 3 * math.pi * radii[-1] ** 3), rel=1e-12)
    Me, Re = 5.9722e24, 6.3710e6
    I = 0.3307 * Me * Re ** 2
    core, mantle = ns.two_layer(Me, I, Re, 3.480e6)
    assert core == pytest.approx(12506, rel=1e-3) and mantle == pytest.approx(4152, rel=1e-3)
    assert Me / (4 / 3 * math.pi * Re ** 3) == pytest.approx(5513, rel=1e-3)
