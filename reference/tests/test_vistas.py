"""The vistas of the paper's last section: rays near a black hole
(gravcam/schwarzschild.py), the primordial graviton background
(gravcam/primordial.py) and the Milky Way model (gravcam/galaxy.py)."""
import math

import numpy as np
import pytest
from scipy.integrate import quad

from gravcam import galaxy, primordial, schwarzschild as sw
from gravcam.constants import c, kB


# ---- black hole -------------------------------------------------------------

def test_the_photon_sphere_and_the_shadow():
    u1, u2, u3 = sw._roots(sw.B_CRITICAL * (1 + 1e-12))
    assert u2 == pytest.approx(1 / 3, abs=1e-5) and u3 == pytest.approx(1 / 3, abs=1e-5)
    # far away the shadow subtends sqrt(27) G M / c^2 over the distance
    assert sw.shadow_radius(1e6) == pytest.approx(math.sqrt(27) / 1e6, rel=1e-5)
    # rays just outside the shadow escape, just inside fall in
    r_o = 15.0
    edge = sw.shadow_radius(r_o)
    inside, outside = sw.sweep(r_o, np.array([edge * (1 - 1e-6), edge * (1 + 1e-6)]))
    assert math.isnan(inside) and math.isfinite(outside)


def test_weak_deflection_matches_the_post_newtonian_series():
    for b in (1e3, 1e4):
        series = 4 / b + 15 * math.pi / (4 * b * b)
        assert sw.deflection(b)[0] == pytest.approx(series, rel=60 / b ** 2)


def test_strong_deflection_grows_logarithmically_near_the_photon_sphere():
    # Bozza (2002): alpha = -log(b / b_c - 1) + log(216 (7 - 4 sqrt 3)) - pi
    for eps in (1e-4, 1e-6):
        b = sw.B_CRITICAL * (1 + eps)
        expected = -math.log(eps) + math.log(216 * (7 - 4 * math.sqrt(3))) - math.pi
        assert sw.deflection(b)[0] == pytest.approx(expected, abs=5 * math.sqrt(eps) + 1e-6)


@pytest.mark.parametrize("psi_deg", [21.0, 35.0, 80.0, 150.0])
def test_elliptic_sweep_matches_direct_integration(psi_deg):
    r_o = 15.0
    psi = math.radians(psi_deg)
    b = float(sw.impact_parameter(r_o, psi))
    assert sw.sweep(r_o, psi)[0] == pytest.approx(sw.trace(b, r_o, inward=psi < math.pi / 2), rel=1e-8)


def test_far_from_the_hole_the_sky_is_where_it_is():
    observer = np.array([-1e7, 0.0, 0.0])
    dirs = np.array([[0.0, 0.0, 1.0], [0.3, 0.8, -0.52], [-1.0, 0.0, 0.0]])
    dirs /= np.linalg.norm(dirs, axis=1)[:, None]
    out, shadow = sw.sky_directions(observer, dirs)
    assert not shadow.any()
    assert np.allclose(out, dirs, atol=1e-6)


# ---- primordial gravitons ---------------------------------------------------

def test_thermal_history_ends_at_the_three_temperatures():
    # the counts, species by species: fermions 7/8 of their states
    f = 7 / 8
    counts = [106.75]
    for gone in (12 * f, 9 + 1, 12 * f, 4 * f, 12 * f, 16 + 36 * f - 3, 4 * f + 3):
        counts.append(counts[-1] - gone)
    assert [row[2] for row in primordial.THERMAL_HISTORY[:-1]] == pytest.approx(counts[1:])
    assert primordial.THERMAL_HISTORY[-1][2] == pytest.approx(43 / 11) and counts[-1] == 10.75
    energies = [row[1] for row in primordial.THERMAL_HISTORY]
    assert energies == sorted(energies, reverse=True)
    # hot, all three share one temperature; today the photons are at 1, the neutrinos at 1.945 K, the gravitons 0.905 K
    hot = primordial.comoving_temperatures(1e20)
    assert hot[0] == pytest.approx(hot[1]) and hot[0] == pytest.approx(hot[2])
    photons, neutrinos, gravitons = (float(v) for v in primordial.comoving_temperatures(primordial.T_CMB))
    assert photons == pytest.approx(1.0)
    assert neutrinos * primordial.T_CMB == pytest.approx(1.945, abs=0.001)
    assert gravitons * primordial.T_CMB == pytest.approx(primordial.graviton_temperature())
    # the neutrinos part before the electrons go, and so miss their heat
    assert primordial.NEUTRINOS_PART > primordial.THERMAL_HISTORY[-1][1] * primordial.GEV / kB


def test_graviton_temperature_and_brightness():
    T = primordial.graviton_temperature()
    assert T == pytest.approx(0.905, abs=0.001)
    # the number radiance against the Planck spectrum integrated directly
    integral = quad(lambda x: x * x / math.expm1(x), 0, 80)[0]
    direct = 2 * (kB * T / primordial.H) ** 3 / c ** 2 * integral
    assert primordial.number_radiance(T) == pytest.approx(direct, rel=1e-10)
    # and the energy density against the spectral radiance
    energy = 4 * math.pi / c * quad(lambda nu: float(primordial.spectral_radiance(nu, T)), 1e6, 2e13,
                                    limit=200)[0]
    assert primordial.energy_density(T) == pytest.approx(energy, rel=1e-6)
    # it would count as about 0.05 of an extra neutrino species, within today's bounds
    assert primordial.extra_neutrino_species(T) == pytest.approx(0.0535, abs=0.001)


def test_doppler_dipole():
    beta = primordial.DIPOLE_SPEED / c
    T = 1.0
    hot, cold = primordial.doppler_temperature(T, beta, np.array([1.0, -1.0]))
    assert (hot - cold) / 2 == pytest.approx(beta, rel=1e-6)


# ---- the Milky Way ----------------------------------------------------------

def test_model_masses():
    # integrate the stellar density over a box that holds the Galaxy
    x = np.linspace(-40, 40, 321)
    z = np.linspace(-8, 8, 641)
    X, Y, Z = np.meshgrid(x, x, z, indexing="ij", sparse=True)
    rho = galaxy.stellar_density(X, Y, Z)
    dV = (x[1] - x[0]) ** 2 * (z[1] - z[0])
    total = galaxy.THIN["mass"] + galaxy.THICK["mass"] + galaxy.BULGE["mass"]
    assert rho.sum() * dV == pytest.approx(total, rel=0.02)


def test_column_toward_the_pole_and_extinction_toward_the_centre():
    pole = galaxy.direction(0.0, math.pi / 2)[None, :]
    _, waves = galaxy.sky(pole, steps=4000)
    # above the Sun: half the surface density of each disc, plus the bulge's tail
    expected = 0.0
    for disc in (galaxy.THIN, galaxy.THICK):
        sigma = disc["mass"] / (2 * math.pi * disc["length"] ** 2) * math.exp(-galaxy.R_SUN / disc["length"])
        expected += 0.5 * sigma * math.exp(-galaxy.Z_SUN / disc["height"])
    assert waves[0] == pytest.approx(expected, rel=0.02)
    # dust: thirty to forty magnitudes of visual extinction to the Galactic centre, as observed
    centre = galaxy.direction(0.0, 0.0)[None, :]
    to_centre = galaxy.visual_extinction(centre, reach=galaxy.R_SUN)[0]
    assert 30 < to_centre < 45


def test_dust_hides_the_centre_from_light_but_not_from_waves():
    d = galaxy.direction(np.radians([0.0, 180.0]), np.radians([0.0, 0.0]))
    light, waves = galaxy.sky(d)
    assert waves[0] / waves[1] > 50
    assert light[0, 1] / light[1, 1] < 3
    # the blue light is dimmed more than the red
    assert light[0, 2] < light[0, 0]


def test_the_background_carries_more_energy_than_the_pulsar_timing_one():
    # Omega = rho / rho_crit with H0 = 67.4 km/s/Mpc
    H0 = 67.4e3 / 3.0857e22
    G = 6.6743e-11
    critical = 3 * H0 ** 2 * c ** 2 / (8 * math.pi * G)
    omega = primordial.energy_density(primordial.graviton_temperature()) / critical
    assert omega == pytest.approx(6.6e-7, rel=0.01)
    # the pulsar-timing background at one cycle a year, h_c = 2.4e-15
    f = 1 / 3.15576e7
    pta = 2 * math.pi ** 2 / (3 * H0 ** 2) * f ** 2 * (2.4e-15) ** 2
    assert 50 < omega / pta < 150
