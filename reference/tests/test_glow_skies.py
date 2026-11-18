"""How bright matter can glow, and the further vistas: each against an independent route."""
import math

import numpy as np
import pytest

from gravcam import glowbounds as B
from gravcam import materials as M
from gravcam import skies as S
from gravcam.constants import G, c, hbar, kB
from gravcam.pixel import direction, invariants, motion_alarm, null_vector, stars


def test_the_bounds_against_an_independent_calculation():
    # the numbers of the review that proposed them (its Sec. 5)
    assert math.isclose(B.X3, 2.82143937212, rel_tol=1e-10) and math.isclose(B.PEAK3, 1.42143547275, rel_tol=1e-10)
    assert math.isclose(B.X2, 1.59362426004, rel_tol=1e-10) and math.isclose(B.PEAK2, 0.647610237892, rel_tol=1e-10)
    assert math.isclose(B.power_bound(30e9, 293), 5.59682e-35, rel_tol=1e-5)
    assert math.isclose(B.count_bound(30e9, 293), 6.30343e-15, rel_tol=1e-5)
    assert math.isclose(B.optical_depth_integral(1.0, 30e9), 5.86752e-24, rel_tol=1e-5)


def test_a_line_at_the_best_frequency_reaches_the_bound():
    T, dmu = 293.0, 30e9
    w3 = B.X3 * kB * T / hbar
    line = M.Material("line", (M.Term("line", lambda w, T_: M.lorentz_line(w, dmu, w3, 1e-4 * w3), dmu,
                                      lines=((w3, 1e-4 * w3),)),))
    assert math.isclose(M.power_per_volume(line, T), B.power_bound(dmu, T), rel_tol=2e-3)


@pytest.mark.parametrize("name", ["copper", "silicon", "diamond", "silica", "water"])
def test_every_material_stays_below_what_its_weight_allows(name):
    r = B.how_close(M.table()[name])
    assert 0 < r["power_fraction"] <= 1 and 0 < r["count_fraction"] <= 1
    if name == "silicon":
        assert r["power_fraction"] > 0.95       # its line sits near the best frequency


def test_the_placeholder_cannot_be_matched_at_the_earths_temperatures():
    lo, _ = B.least_weight_for_placeholder(293.0)
    hot, _ = B.least_weight_for_placeholder(5500.0)
    assert 100e9 < lo < 125e9 and 2.0e12 < hot < 2.2e12          # 112 GPa and 2.1 TPa (the review's E10)
    for shell in B.earth_bounded().values():
        assert shell["ratio"] < 0.4


def test_the_earths_lifetime_budget_with_the_bound():
    # the scene holds each shell at its bound; dividing the bounds out again gives the placeholder's Earth
    bounded = B.earth_lifetime()
    base = B.earth_lifetime({k: 1 / v["ratio"] for k, v in B.earth_bounded().items()})
    assert 1.3e5 < base["counts"] < 1.5e5
    assert 3e4 < bounded["counts"] < 4e4
    assert bounded["errors"][1] > 3 * base["errors"][1]          # the core's boundary, from 6 km to tens of km


def test_the_core_is_a_colour_step():
    eV = 1.602176634e-19
    core = [B.mean_energy(B.liquid_iron(r), 4500.0) / eV for r in (0.5e-6, 1e-6, 3e-6)]
    mantle = [B.mean_energy(B.mantle(top), 2800.0) / eV for top in (33.0, 66.0)]
    assert all(0.85 < e < 1.1 for e in core)
    assert all(0.05 < e < 0.2 for e in mantle)
    assert min(core) / max(mantle) > 5


def test_a_crystal_line_glows_polarized():
    for n, (bright, degree) in (([1, 0, 0], (1.0, 1.0)), ([1, 1, 0], (1.25, 0.6)), ([1, 1, 1], (4 / 3, 0.0))):
        b, d = B.line_polarization(n)
        assert math.isclose(b, bright, abs_tol=1e-12) and math.isclose(d, degree, abs_tol=1e-12)
    # averaged over all directions, three shears of five give 3/5 of the two polarizations' total of 2
    rng = np.random.default_rng(1)
    mean = np.mean([B.line_polarization(n)[0] for n in rng.normal(size=(4000, 3))])
    assert math.isclose(mean, 6 / 5, rel_tol=0.02)


def test_the_stars_of_a_pair_move_from_pull_to_wave():
    static, wave = 1.0, 0.7 * np.exp(0.4j)
    W = S.pair_reading(static, wave)
    z = np.polynomial.Polynomial([0, 1])
    m = [1 - z**2, 1j * (1 + z**2), -2 * z]
    poly = sum(m[i] * W[i, j] * m[j] for i in range(3) for j in range(3))
    assert np.allclose(poly.coef[:4], [0, 0, -12 * static, 0]) and np.isclose(poly.coef[4], 4 * wave)
    expected = sorted(tuple(np.round(direction(null_vector(q)) if q != 0 else np.array([0, 0, 1.0]), 6))
                      for q in S.migrating_stars(static, wave))
    found = sorted(tuple(np.round(d, 6)) for d in stars(W))
    assert np.allclose(np.array(expected), np.array(found), atol=1e-6)
    # turning the wave's phase by 2 phi turns the moving pair by phi about the axis
    z1 = S.migrating_stars(static, wave)[2]
    z2 = S.migrating_stars(static, wave * np.exp(-2j * 0.3))[2]
    assert math.isclose(np.angle(z2 / z1) % math.pi, 0.3, abs_tol=1e-12)
    radii = S.crossover_radii(2 * math.pi * 100, 0.1 * c)
    assert math.isclose(radii["whole"] / radii["magnetic"], 10.0)


def test_spin_memory_records_the_sense_of_the_orbit():
    iota = np.linspace(0, math.pi, 200001)
    p = S.spin_memory_pattern(iota)
    assert math.isclose(iota[np.argmax(p)], math.acos(1 / math.sqrt(3)), abs_tol=1e-4)
    assert np.allclose(S.spin_memory_pattern(math.pi - iota), -p)
    assert np.allclose(S.displacement_memory_pattern(math.pi - iota), S.displacement_memory_pattern(iota))


def test_falling_into_a_black_hole():
    assert math.isclose(math.degrees(S.shadow_static(40.0)), 7.27, abs_tol=0.01)
    assert math.isclose(math.degrees(S.shadow_falling(40.0)), 5.80, abs_tol=0.01)
    assert math.isclose(math.degrees(S.shadow_falling(3.0)), 35.26, abs_tol=0.01)
    assert math.isclose(S.shadow_falling(2.0 + 1e-9), S.shadow_at_horizon(), abs_tol=1e-6)
    assert math.isclose(math.degrees(S.shadow_at_horizon()), 42.10, abs_tol=0.01)
    assert math.isclose((1 - math.cos(S.shadow_at_horizon())) / 2, 4 / 31)    # 13% of the sky
    for r in (10.0, 3.0, 2.0, 1.5):
        if r > 2.0:
            W = S.falling_tide(r)
            assert np.abs(W.imag).max() < 1e-12 * np.abs(W).max()
            assert np.allclose(W.real, np.diag([1, 1, -2]) / r**3, rtol=1e-12)


@pytest.mark.parametrize("beta", [0.5, 0.9, 0.99])
def test_flying_through_a_still_room(beta):
    W0 = np.diag([1.0, 2.0, -3.0]).astype(complex)
    W = S.flown(W0, beta)
    assert motion_alarm(W) < 1e-9
    assert np.allclose(np.array(invariants(W)), np.array(invariants(W0)), rtol=1e-9)
    ang = S.star_angles_from_forward(W)
    assert np.allclose(ang, math.acos(beta), atol=1e-6)               # every star on one cone about the way ahead
    E, Bm = W.real, W.imag
    assert np.linalg.norm(Bm) / np.linalg.norm(E) > beta - 1e-12 if beta > 0.8 else True


def test_flying_any_way_the_stars_crowd_ahead_as_one_over_gamma():
    rng = np.random.default_rng(3)
    for _ in range(4):
        A = rng.normal(size=(3, 3))
        A = A + A.T
        A -= np.eye(3) * np.trace(A) / 3
        axis = rng.normal(size=3)
        scaled = []
        for beta in (0.999, 0.99999):
            gamma = 1 / math.sqrt(1 - beta**2)
            W = S.flown(A.astype(complex), beta, axis)
            assert np.linalg.norm(W.imag) / np.linalg.norm(W.real) > 0.9999
            scaled.append(np.sort(S.star_angles_from_forward(W, axis) * gamma))
        assert np.allclose(scaled[0], scaled[1], rtol=0.05)


def test_intensity_correlations():
    for n in (0.01, 0.3, 2.0):
        cross, own = S.g2_pair_from_state(n, cutoff=4000)
        assert math.isclose(cross, S.g2_pair(n), rel_tol=1e-9)
        assert math.isclose(own, 2.0, rel_tol=1e-9)                     # each direction alone looks thermal
        assert S.g2_pair(n) > 2                                         # beyond any classical pair of fields


def test_a_string_is_flat_outside():
    mu = 1e-6 * c**2 / G                                               # G mu / c^2 = 1e-6, 1.3e21 kg/m
    assert math.isclose(G * mu / c**2, 1.0e-6, rel_tol=2e-3)
    assert math.isclose(S.string_deficit(mu), 8 * math.pi * 1e-6, rel_tol=2e-3)
    assert S.string_step(mu, 0.5 * c) < S.string_deficit(mu)
