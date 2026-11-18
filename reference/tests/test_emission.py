"""Emission model of scenes/README.md, checked against hand calculations."""
import math

import numpy as np
import pytest

import hand
from gravcam import constants, emission
from gravcam.scene import SceneError, scene_from_dict

EARTH_CHAIN = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]


def test_constants_are_codata():
    assert constants.G == 6.67430e-11
    assert constants.c == 299792458
    assert constants.kB == 1.380649e-23
    assert constants.sigma == 5.670374419e-8
    assert constants.mean_energy_kT == 2.701
    assert all(isinstance(v, float) for v in constants.as_dict().values())


def test_absorption_coefficient():
    # 16 pi * 6.6743e-11 * 1e-3 / (2.99792458e8)^3 = 1.2451e-37 per metre for water-like friction
    assert emission.absorption_coefficient(1e-3) == pytest.approx(1.24513e-37, rel=1e-5)
    assert emission.absorption_coefficient(1e-3) == pytest.approx(hand.alpha(1e-3), rel=1e-15)
    assert emission.absorption_coefficient(0.0) == 0.0
    assert emission.absorption_coefficient(2.5) == pytest.approx(2500 * emission.absorption_coefficient(1e-3), rel=1e-15)


def test_thermal_emissivities_of_earth_layers(scene, raw_scene):
    per_object = emission.object_emission(scene)
    for object_id in EARTH_CHAIN:
        material = hand.material_of(raw_scene, object_id)
        temperature, eta = material["temperature"], material["friction"]
        found = per_object[object_id]
        assert found.source == "friction"
        assert found.alpha == pytest.approx(hand.alpha(eta), rel=1e-14)
        assert found.j_E == pytest.approx(hand.j_E_thermal(temperature, eta), rel=1e-14)
        assert found.j_N == pytest.approx(hand.j_N_thermal(temperature, eta), rel=1e-14)
        # j_N (2.701 k T) = j_E, and Kirchhoff: 4 pi j_E = 4 alpha sigma T^4
        assert found.j_N * 2.701 * hand.KB * temperature == pytest.approx(found.j_E, rel=1e-14)
        assert 4 * math.pi * found.j_E == pytest.approx(4 * found.alpha * hand.SIGMA * temperature**4, rel=1e-14)


def test_crust_numbers_by_hand(scene):
    # T = 700 K, eta = 1e-3 Pa s:
    #   j_E = 1.24513e-37 * 5.670374e-8 * 700^4 / pi = 5.3959e-34 W m^-3 sr^-1
    #   j_N = j_E / (2.701 * 1.380649e-23 * 700)    = 2.0671e-14 s^-1 m^-3 sr^-1
    crust = emission.object_emission(scene)["earth"]
    assert crust.j_E == pytest.approx(5.3959e-34, rel=2e-5)
    assert crust.j_N == pytest.approx(2.0671e-14, rel=2e-5)


def test_temperature_scaling(scene):
    per_object = emission.object_emission(scene)
    # j_E goes as the friction times T^4 and j_N as the friction times T^3
    a, b = per_object["earth"], per_object["inner-core"]
    ratio = scene["inner-core"].material.temperature / scene["earth"].material.temperature
    friction = scene["inner-core"].material.friction / scene["earth"].material.friction
    assert b.j_E / a.j_E == pytest.approx(friction * ratio**4, rel=1e-13)
    assert b.j_N / a.j_N == pytest.approx(friction * ratio**3, rel=1e-13)


def test_zero_friction_does_not_emit(scene):
    envelope = emission.object_emission(scene)["sun"]
    assert envelope.alpha == 0.0 and envelope.j_E == 0.0 and envelope.j_N == 0.0


def test_solar_core_returns_its_luminosity(scene, raw_scene):
    # j_N integrated over the core's volume and 4 pi sr, times 2.701 k T, is L
    core = emission.object_emission(scene)["sun-core"]
    material = hand.material_of(raw_scene, "sun-core")
    volume = hand.ball_volume(hand.radius_of(raw_scene, "sun-core"))
    recovered = core.j_N * volume * 4.0 * math.pi * 2.701 * hand.KB * material["temperature"]
    assert material["luminosity"] == 1.0e8
    assert recovered == pytest.approx(material["luminosity"], rel=1e-14)
    assert core.source == "luminosity"
    assert core.alpha is None                 # no friction in the material: alpha is not defined
    assert core.j_E * 4.0 * math.pi * volume == pytest.approx(1.0e8, rel=1e-14)


def test_solar_core_luminosity_by_integrating_the_emissivity_field(scene, raw_scene):
    """Integrate j_N(x) over all space around the Sun numerically: radial
    midpoint rule on 4 pi r^2 j_N(r), with j_N(r) looked up through the
    scene's point membership. One discontinuity (the core's surface), misplaced
    by at most half a cell h/2: relative error <= (h/2) 4 pi r_c^2 / V_c
    = 1.5 h / r_c = 1.5 * 6 / n."""
    n = 400_000
    j_N = np.append(emission.number_emissivities(scene), 0.0)       # index -1 -> vacuum
    center = np.array(hand.center_of(raw_scene, "sun"))
    r_max = 1.2 * hand.radius_of(raw_scene, "sun")
    h = r_max / n
    r = (np.arange(n) + 0.5) * h
    axis = np.array([0.36, -0.48, 0.8])                              # any unit vector
    field = j_N[scene.locate(center + r[:, None] * axis)]
    rate = float(np.sum(4.0 * math.pi * r * r * field) * h) * 4.0 * math.pi      # gravitons / s
    temperature = hand.material_of(raw_scene, "sun-core")["temperature"]
    bound = 1.5 * h / hand.radius_of(raw_scene, "sun-core")
    assert bound < 5e-5
    assert rate * 2.701 * hand.KB * temperature == pytest.approx(1.0e8, rel=bound + 1e-9)


def test_flux_at_one_au(raw_scene):
    # 1e8 W / (4 pi (1.495978707e11 m)^2) = 3.5558e-16 W/m^2; divided by the mean
    # quantum energy 2.701 k * 1.3e7 K = 4.8478e-16 J: 0.7335 gravitons m^-2 s^-1
    material = hand.material_of(raw_scene, "sun-core")
    luminosity, temperature = material["luminosity"], material["temperature"]
    flux = emission.flux_at_distance(luminosity, constants.AU)
    assert flux == pytest.approx(luminosity / (4 * math.pi * hand.AU**2), rel=1e-15)
    assert flux == pytest.approx(3.5558e-16, rel=2e-5)
    number_flux = emission.number_flux_at_distance(luminosity, temperature, constants.AU)
    assert number_flux == pytest.approx(flux / (2.701 * hand.KB * temperature), rel=1e-15)
    assert number_flux == pytest.approx(0.7335, rel=2e-4)
    assert emission.mean_quantum_energy(temperature) == pytest.approx(4.8478e-16, rel=2e-5)


def test_flux_equals_emissivity_times_volume_over_distance_squared(scene):
    # far from a source, flux = (4 pi j_E V) / (4 pi d^2) = j_E V / d^2
    core = emission.object_emission(scene)["sun-core"]
    volume = scene["sun-core"].own_volume
    assert core.j_E * volume / constants.AU**2 == pytest.approx(emission.flux_at_distance(1.0e8, constants.AU), rel=1e-14)


def test_array_helpers_follow_scene_order(scene):
    per_object = emission.object_emission(scene)
    assert emission.number_emissivities(scene).tolist() == [per_object[i].j_N for i in scene.ids]
    assert emission.energy_emissivities(scene).tolist() == [per_object[i].j_E for i in scene.ids]
    assert emission.number_emissivities(scene).dtype == np.float64


# --- the luminosity override on small synthetic scenes -----------------------------

def synthetic(material, with_child=False):
    data = {
        "observer": {"position": [0, 0, 100]},
        "materials": {"m": material, "inert": {"density": 1, "temperature": 10, "friction": 0}},
        "objects": [{"id": "a", "shape": {"type": "sphere", "center": [0, 0, 0], "radius": 3}, "material": "m"}],
    }
    if with_child:
        data["objects"].append({"id": "hole", "parent": "a", "material": "inert",
                                "shape": {"type": "sphere", "center": [1, 0, 0], "radius": 1}})
    return scene_from_dict(data)


def test_luminosity_overrides_friction():
    scene = synthetic({"density": 1, "temperature": 500, "friction": 7.0, "luminosity": 42.0})
    found = emission.object_emission(scene)["a"]
    assert found.source == "luminosity"
    assert found.j_E == pytest.approx(42.0 / (4 * math.pi * hand.ball_volume(3)), rel=1e-15)
    assert found.alpha == pytest.approx(hand.alpha(7.0), rel=1e-15)      # still reported, unused
    assert found.j_N == pytest.approx(found.j_E / (2.701 * hand.KB * 500), rel=1e-15)


def test_luminosity_is_spread_over_the_own_region_only():
    scene = synthetic({"density": 1, "temperature": 500, "luminosity": 42.0}, with_child=True)
    per_object = emission.object_emission(scene)
    own = hand.ball_volume(3) - hand.ball_volume(1)
    assert per_object["a"].j_E == pytest.approx(42.0 / (4 * math.pi * own), rel=1e-14)
    assert per_object["a"].j_E * 4 * math.pi * scene["a"].own_volume == pytest.approx(42.0, rel=1e-14)
    assert per_object["hole"].j_E == 0.0


def test_material_without_friction_or_luminosity_is_an_error():
    scene = synthetic({"density": 1, "temperature": 500})
    with pytest.raises(SceneError, match="neither friction nor luminosity"):
        emission.object_emission(scene)


def test_emitting_material_needs_a_temperature():
    scene = synthetic({"density": 1, "temperature": 0, "luminosity": 5.0})
    with pytest.raises(SceneError, match="positive temperature"):
        emission.object_emission(scene)
    cold = synthetic({"density": 1, "temperature": 0, "friction": 1e-3})
    assert emission.object_emission(cold)["a"].j_N == 0.0       # nothing emitted, nothing to divide
