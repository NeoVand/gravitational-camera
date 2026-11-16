"""Waves from spinning bodies (gravcam/waves.py): the closed forms against a
brute-force transverse-traceless projection of the moving masses, the total
power against an integral of the flux over the sky, and the sense of rotation
of the polarization against what the observer sees."""
import math

import numpy as np
import pytest

from conftest import room_scene_path
from gravcam import nearfield, waves
from gravcam.constants import G, c as C
from gravcam.scene import SceneError, load_scene, scene_from_dict


def dumbbell(rate=1.0, axis=(0.0, 0.0, 1.0), m=10.0, half=0.3):
    """Two point-like masses (small spheres) at +-half about the origin, on a
    line perpendicular to the axis (along x when the axis is z)."""
    density = m / (4 / 3 * math.pi * 0.01**3)
    unit = np.asarray(axis, dtype=float) / np.linalg.norm(axis)
    arm = np.array([1.0, 0.0, 0.0]) - unit[0] * unit
    arm /= np.linalg.norm(arm)
    return scene_from_dict({
        "name": "dumbbell", "title": "dumbbell",
        "observer": {"position": [0, 0, 5]},
        "materials": {"lump": {"density": density, "temperature": 293}},
        "objects": [
            {"id": f"ball-{k}", "shape": {"type": "sphere", "center": (s * half * arm).tolist(), "radius": 0.01},
             "material": "lump", "spin": {"center": [0, 0, 0], "axis": list(axis), "rate": rate}}
            for k, s in (("a", -1), ("b", 1))
        ],
    })


def test_moment_difference_of_a_dumbbell():
    [rotor] = waves.rotors(dumbbell(m=10.0, half=0.3))
    # two masses m at distance d = 2 half: Delta I = m d^2 / 2
    assert rotor.delta_inertia == pytest.approx(10.0 * 0.6**2 / 2, rel=1e-12)
    assert rotor.omega == pytest.approx(2 * math.pi)


def test_power_matches_the_paper():
    """Eq. (dumbbell) of the paper: P = (8/5) G m^2 d^4 Omega^6 / c^5."""
    [rotor] = waves.rotors(dumbbell(rate=16.0, m=1.0, half=0.5))
    expected = 8 / 5 * G * 1.0**2 * 1.0**4 * rotor.omega**6 / C**5
    assert rotor.power() == pytest.approx(expected, rel=1e-12)
    assert rotor.power() == pytest.approx(4e-41, rel=0.1)       # the number quoted in the paper


def test_flux_over_the_sky_adds_up_to_the_power():
    [rotor] = waves.rotors(dumbbell(rate=3.0, axis=(0.3, -0.4, 0.866)))
    radius = 7.0
    directions, weights = nearfield.sky_quadrature(64)
    total = 0.0
    for n, w in zip(directions, weights):
        total += w * radius**2 * waves.seen_from(rotor, rotor.center + radius * n)["flux"]
    assert total == pytest.approx(rotor.power(), rel=1e-12)


def test_on_axis_flux_is_eight_times_the_edge_on_flux():
    [rotor] = waves.rotors(dumbbell())
    along = waves.seen_from(rotor, [0, 0, 5])["flux"]
    edge = waves.seen_from(rotor, [0, 5, 0])["flux"]
    assert along / edge == pytest.approx(8.0, rel=1e-12)


@pytest.mark.parametrize("observer", [[0, 0, 5], [0, 0, -5], [3, 1, 2], [0, 4, 0.5], [-2, -3, -1]])
def test_closed_forms_against_brute_force(observer):
    [rotor] = waves.rotors(dumbbell(rate=2.0, axis=(0.2, 0.1, 1.0)))
    period = math.pi / rotor.omega                           # of the 2 Omega line
    times = np.linspace(0.0, 2 * period, 64, endpoint=False)
    h_plus, h_cross, _, _ = waves.strain_series(rotor, observer, times)
    measured = waves.stokes_from_series(h_plus, h_cross, times, rotor.omega)
    seen = waves.seen_from(rotor, observer)
    scale = seen["amplitude"] ** 2
    # intensity and circular part do not depend on the sky basis
    assert measured["I"] == pytest.approx(scale * seen["I"], rel=1e-10)
    assert measured["V"] == pytest.approx(scale * seen["V"], rel=1e-10, abs=1e-12 * scale)
    # total linear part does not either
    linear = math.hypot(measured["Q"], measured["U"])
    assert linear == pytest.approx(scale * abs(seen["Q"]), rel=1e-9, abs=1e-12 * scale)


def test_pattern_turns_the_way_the_rotor_appears_to_turn():
    """Seen from the side the angular velocity points to, a rotor turns
    anticlockwise; so does the axis of stretching in the observer's sky (e1
    to the right, e2 up), and V is positive."""
    for rate, sense in ((1.0, +1), (-1.0, -1)):
        [rotor] = waves.rotors(dumbbell(rate=rate))
        times = np.linspace(0.0, 0.2, 41)
        h_plus, h_cross, e1, e2 = waves.strain_series(rotor, [0, 0, 5], times)
        assert np.allclose(np.cross(e1, e2), [0, 0, 1])     # e1 x e2 toward the observer
        stretch = 0.5 * np.unwrap(2 * np.arctan2(h_cross, h_plus)) / 2
        turning = np.sign(np.diff(stretch))
        assert np.all(turning == sense)
        assert np.sign(waves.seen_from(rotor, [0, 0, 5])["V"]) == sense


def test_still_and_symmetric_rotors_are_dark():
    assert waves.rotors(dumbbell(rate=0.0)) == []
    [rotor] = waves.rotors(dumbbell())
    ring = waves.Rotor(members=("x",), center=np.zeros(3), axis=np.array([0, 0, 1.0]), omega=1.0,
                       masses=np.full(4, 2.0),
                       offsets=np.array([[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]], dtype=float))
    assert ring.delta_inertia == pytest.approx(0.0, abs=1e-15)
    assert rotor.delta_inertia > 0


def test_wavelength():
    [rotor] = waves.rotors(dumbbell(rate=1.0))
    assert rotor.wavelength() == pytest.approx(C / 2.0)           # waves at twice the rotation rate
    assert rotor.wavelength(c=0.2) == pytest.approx(0.1)


def test_the_drums_scene():
    scene = load_scene(room_scene_path("which-way"))
    found = {r.members[0].split("-ball")[0]: r for r in waves.rotors(scene)}
    assert set(found) == {"drum-top", "drum-middle"}               # the bottom pair is still
    top = waves.seen_from(found["drum-top"], scene.observer)
    middle = waves.seen_from(found["drum-middle"], scene.observer)
    assert top["circular"] < -0.99 and middle["circular"] > 0.99   # nearly circular, opposite senses


def test_a_spinning_box_is_refused():
    with pytest.raises(SceneError, match="only spheres may spin"):
        scene_from_dict({
            "name": "x", "title": "x", "observer": {"position": [0, 0, 5]},
            "materials": {"m": {"density": 1, "temperature": 1}},
            "objects": [{"id": "b", "shape": {"type": "box", "center": [0, 0, 0], "size": [1, 1, 1]},
                         "material": "m", "spin": {"center": [0, 0, 0], "axis": [0, 0, 1], "rate": 1}}],
        })


def test_a_ball_that_would_leave_its_drum_is_refused():
    with pytest.raises(SceneError, match="leaves its parent"):
        scene_from_dict({
            "name": "x", "title": "x", "observer": {"position": [0, 0, 5]},
            "materials": {"m": {"density": 1, "temperature": 1}},
            "objects": [
                {"id": "drum", "shape": {"type": "box", "center": [0, 0, 0], "size": [2, 0.5, 2]}, "material": "m"},
                {"id": "ball", "parent": "drum", "shape": {"type": "sphere", "center": [0.7, 0, 0], "radius": 0.2},
                 "material": "m", "spin": {"center": [0, 0, 0], "axis": [0, 0, 1], "rate": 1}},
            ],
        })
