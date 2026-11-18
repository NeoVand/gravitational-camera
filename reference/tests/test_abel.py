"""The thermal Earth, inverted (gravcam/abel.py): the brightness seen from the surface is the Abel transform of the
emissivity profile; its kinks fall at arcsin(r/R) whatever the friction; peeling recovers the shells; and Poisson
counts determine the emissivities and radii to the errors the Fisher matrix forecasts."""
import math
import pathlib

import numpy as np
import pytest

from gravcam import abel, columns, emission
from gravcam.scene import load_scene

ROOT = pathlib.Path(__file__).resolve().parents[2]
LAYERS = ["inner-core", "outer-core", "lower-mantle", "upper-mantle", "earth"]
YEAR = 3.15576e7


@pytest.fixture(scope="module")
def earth():
    scene = load_scene(ROOT / "scenes" / "sun-at-midnight.scene.json")
    radii = np.array([scene[k].shape.radius for k in LAYERS])
    jN = emission.number_emissivities(scene)
    jE = emission.energy_emissivities(scene)
    rho = float(np.linalg.norm(scene.observer))
    temps = np.array([scene[k].material.temperature for k in LAYERS])
    friction = np.array([scene[k].material.friction for k in LAYERS])
    return dict(scene=scene, radii=radii, rho=rho, temps=temps, friction=friction,
                jN=np.array([jN[scene.index(k)] for k in LAYERS]), jE=np.array([jE[scene.index(k)] for k in LAYERS]))


def test_shell_radiance_matches_ray_integrals(earth):
    """The shell model agrees with the general line integrals of columns.py along lines of sight away from the Sun."""
    theta = np.radians([0.0, 3.0, 10.0, 11.5, 25.0, 40.0, 63.5, 80.0, 89.0])
    d = np.stack([np.sin(theta), -np.cos(theta), np.zeros_like(theta)], axis=1)
    ref = columns.number_radiance(earth["scene"], d)
    ours = abel.radiance(earth["radii"], earth["jN"], theta, earth["rho"])
    np.testing.assert_allclose(ours, ref, rtol=1e-9)


def test_abel_pair_and_inverse():
    """f = 1 - r^2 on the unit ball has F = (4/3)(1 - p^2)^{3/2}; the inverse recovers f."""
    p = np.linspace(0.0, 1.0, 801)
    F = abel.abel_forward(lambda r: 1.0 - r * r, 1.0, p)
    np.testing.assert_allclose(F, (4.0 / 3.0) * (1.0 - p * p) ** 1.5, atol=1e-12)
    r = np.linspace(0.0, 0.9, 10)
    np.testing.assert_allclose(abel.abel_inverse(p, F, r), 1.0 - r * r, atol=2e-5)


def test_onion_peel_is_exact(earth):
    radii, j, rho = earth["radii"], earth["jN"], earth["radii"][-1]
    inner = np.concatenate([[0.0], radii[:-1]])
    N = abel.radiance(radii, j, np.arcsin(inner / rho), rho)
    np.testing.assert_allclose(abel.onion_peel(radii, N), j, rtol=1e-12)


@pytest.mark.parametrize("scale", [1.0, 7.0, 1e-3])
def test_kinks_mark_the_radii_whatever_the_friction(earth, scale):
    """The kinks fall at arcsin(r/R) and do not move when the friction (every emissivity) is scaled; the heights do."""
    radii, rho = earth["radii"], earth["radii"][-1]
    theta = np.radians(np.linspace(0.0, 89.0, 89001))
    N = abel.radiance(radii, scale * earth["jN"], theta, rho)
    found = abel.find_edges(theta, N, 4)
    want = abel.grazing_angles(radii[:-1], rho)
    np.testing.assert_allclose(found, want, atol=np.radians(0.002))
    base = abel.radiance(radii, earth["jN"], theta, rho)
    np.testing.assert_allclose(N, scale * base, rtol=1e-12)


def test_heights_measure_friction_and_temperature(earth):
    """j_N = 16 G eta sigma T^3/(2.701 k c^3); with the energy as well, T and then eta follow."""
    for jN, jE, T, eta in zip(earth["jN"], earth["jE"], earth["temps"], earth["friction"]):
        assert abel.number_emissivity(eta, T) == pytest.approx(jN, rel=1e-12)
        assert abel.temperature_from_energy(jE, jN) == pytest.approx(T, rel=1e-12)
        assert abel.friction_from_counts(jN, T) == pytest.approx(eta, rel=1e-12)


def test_ring_exposure_is_the_integral_over_the_ring(earth):
    """The closed form of the ring weights against direct quadrature of N(theta) 2 pi sin(theta)."""
    from scipy.integrate import quad
    radii, j, rho = earth["radii"], earth["jN"], earth["rho"]
    edges = np.radians([0.0, 5.0, 11.0, 11.2, 33.0, 40.0, 63.0, 64.0, 89.0, 90.0])
    model = abel.ring_exposure(radii, edges, rho) @ j
    kinks = list(abel.grazing_angles(radii, rho))
    for i in range(len(edges) - 1):
        a, b = edges[i], edges[i + 1]
        pts = [k for k in kinks if a < k < b]
        direct = quad(lambda t: abel.radiance(radii, j, [t], rho)[0] * 2 * math.pi * math.sin(t), a, b,
                      points=pts or None, limit=400, epsabs=0, epsrel=1e-11)[0]
        assert model[i] == pytest.approx(direct, rel=1e-8)


def test_radius_derivative(earth):
    radii, j, rho = earth["radii"], earth["jN"], earth["rho"]
    edges = np.radians(np.linspace(0.0, 90.0, 181))
    J = abel._jacobian(radii, j, edges, 1.0, rho)
    for b in range(4):
        h = 5.0
        up, dn = radii.copy(), radii.copy()
        up[b] += h
        dn[b] -= h
        fd = (abel.expected_counts(up, j, edges, 1.0, rho) - abel.expected_counts(dn, j, edges, 1.0, rho)) / (2 * h)
        np.testing.assert_allclose(J[:, 5 + b], fd, rtol=1e-5, atol=1e-6 * np.max(np.abs(fd)))


def test_a_lifetime_of_counts(earth):
    """Eighty years on a square metre: at most 3.6e4 gravitons (the shells at the most their stiffness allows,
    scenefriction.py), which fix the core's radius to some twenty kilometres. A simulated record is fitted, starting two per cent off
    in the deep radii, and lands within the forecast errors."""
    radii, j, rho = earth["radii"], earth["jN"], earth["rho"]
    edges = np.radians(np.linspace(0.0, 90.0, 901))
    exposure = 80 * YEAR
    mu = abel.expected_counts(radii, j, edges, exposure, rho)
    assert 3.5e4 < mu.sum() < 3.7e4
    fj, fr = abel.forecast(radii, j, edges, exposure, rho)
    assert fj[1] < 0.02 and fj[2] < 0.01 and 1.5e4 < fr[1] < 2.5e4 and fr[2] < 5e3      # rings of 0.1 degree
    # errors scale as one over the square root of the exposure (or of the friction)
    fj4, fr4 = abel.forecast(radii, j, edges, 4 * exposure, rho)
    np.testing.assert_allclose(fj4, fj / 2, rtol=1e-9)
    np.testing.assert_allclose(fr4, fr / 2, rtol=1e-9)
    rng = np.random.default_rng(20261116)
    counts = rng.poisson(mu)
    start = radii.copy()
    start[:3] *= [1.02, 0.98, 1.02]
    start[3] -= 6e3                       # the base of the crust, 25 km down, started at 31 km
    r_fit, j_fit, cov = abel.fit_counts(counts, edges, exposure, start, rho=rho)
    err = np.sqrt(np.diag(cov))
    assert np.all(np.abs(j_fit - j) < 4 * err[:5])
    assert np.all(np.abs(r_fit[:-1] - radii[:-1]) < 4 * err[5:])


def test_fit_errors_match_the_scatter(earth):
    """Over many simulated records the spread of the fitted emissivities matches the Fisher forecast."""
    radii, j, rho = earth["radii"], earth["jN"], earth["rho"]
    edges = np.radians(np.linspace(0.0, 90.0, 181))
    exposure = 80 * YEAR
    mu = abel.expected_counts(radii, j, edges, exposure, rho)
    fj, _ = abel.forecast(radii, j, edges, exposure, rho, fit_radii=False)
    rng = np.random.default_rng(7)
    fits = np.array([abel.fit_counts(rng.poisson(mu), edges, exposure, radii, j_start=j, rho=rho,
                                     fit_radii=False)[1] for _ in range(300)])
    spread = fits.std(axis=0) / j
    np.testing.assert_allclose(spread[:4], fj[:4], rtol=0.15)
