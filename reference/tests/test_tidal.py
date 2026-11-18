"""Newtonian tidal tensor E_ij = d_i d_j Phi of uniform spheres and of the scene.

Finite-difference tolerances. A central second difference of step h at
distance r from a mass has

* truncation error ~ 2 (h / r)^2 of the tensor (the fourth derivative of 1/r),
* round-off error ~ 4 eps (r / h)^2 of the tensor, where eps is the relative
  noise of one potential value: 1e-16 from arithmetic, or ulp(|x|) / r when
  the point's coordinates x are large compared with r (positions near the Sun
  are only resolved to 3e-5 m).

With h = 3e-4 r the truncation is 2e-7 and the round-off is of the same order
or below; the tests assert 5e-6 (the largest deviation observed is 5e-7, for
the whole scene at the Earth's inner core, where the Sun's ten times larger
potential adds round-off). At the observer, 2 m above the ground, a float64
difference cannot work at all (h must stay below 2 m, giving round-off of
order 1); there the potential is evaluated with 60-digit decimals instead and
the agreement is asserted to 1e-11 (observed: 1e-15).

Trace tolerance: each diagonal entry 1 - 3 n_i^2 carries a few float64
spacings, so |trace| <= ~1e-15 of the tensor's norm for one sphere; the tests
allow 2e-15 for one sphere and 5e-15 for a superposition.
"""
import math
from decimal import Decimal, getcontext

import numpy as np
import pytest

import hand
from gravcam import tidal
from gravcam.scene import scene_from_dict

EARTH_CHAIN = ["earth", "upper-mantle", "lower-mantle", "outer-core", "inner-core"]


def hessian(potential, point, h):
    """Central second differences of a scalar function of position."""
    x = np.asarray(point, dtype=np.float64)
    out = np.empty((3, 3))
    steps = np.eye(3) * h
    for i in range(3):
        out[i, i] = (potential(x + steps[i]) - 2.0 * potential(x) + potential(x - steps[i])) / h**2
        for j in range(i + 1, 3):
            out[i, j] = out[j, i] = (
                potential(x + steps[i] + steps[j]) - potential(x + steps[i] - steps[j])
                - potential(x - steps[i] + steps[j]) + potential(x - steps[i] - steps[j])
            ) / (4.0 * h**2)
    return out


def relative_difference(a, b):
    return float(np.linalg.norm(np.asarray(a) - np.asarray(b)) / np.linalg.norm(b))


# --- one uniform sphere ----------------------------------------------------------------

CENTER, RADIUS, MASS = np.array([1.0, -2.0, 0.5]), 2.0, 3.0e10


def test_outside_formula_on_an_axis():
    # at distance r along z: (G M / r^3) diag(1, 1, -2)
    r = 5.0
    tensor = tidal.uniform_sphere_tidal_tensor(CENTER + [0.0, 0.0, r], CENTER, RADIUS, MASS)
    scale = hand.G * MASS / r**3
    assert tensor == pytest.approx(scale * np.diag([1.0, 1.0, -2.0]), rel=1e-14, abs=1e-30)
    assert tidal.point_mass_tidal_tensor(CENTER + [0.0, 0.0, r], CENTER, MASS) == pytest.approx(tensor, rel=1e-15, abs=1e-30)


def test_outside_formula_in_general():
    x = np.array([1.5, -2.5, 3.0])
    r = np.linalg.norm(x)
    n = x / r
    expected = hand.G * MASS / r**3 * (np.eye(3) - 3.0 * np.outer(n, n))
    assert tidal.uniform_sphere_tidal_tensor(CENTER + x, CENTER, RADIUS, MASS) == pytest.approx(expected, rel=1e-13)


def test_inside_formula():
    density = MASS / hand.ball_volume(RADIUS)
    expected = 4.0 * math.pi * hand.G * density / 3.0 * np.eye(3)
    for offset in ([0.0, 0.0, 0.0], [0.3, -0.4, 1.2], [1.9, 0.0, 0.0]):
        tensor = tidal.uniform_sphere_tidal_tensor(CENTER + offset, CENTER, RADIUS, MASS)
        assert tensor == pytest.approx(expected, rel=1e-14, abs=1e-30)
        assert np.trace(tensor) == pytest.approx(4.0 * math.pi * hand.G * density, rel=1e-14)


def test_symmetric_and_traceless_outside():
    rng = np.random.default_rng(2)
    for _ in range(200):
        direction = rng.standard_normal(3)
        direction /= np.linalg.norm(direction)
        point = CENTER + direction * RADIUS * rng.uniform(1.0001, 50.0)
        tensor = tidal.uniform_sphere_tidal_tensor(point, CENTER, RADIUS, MASS)
        assert np.array_equal(tensor, tensor.T)
        assert abs(np.trace(tensor)) <= 2e-15 * np.linalg.norm(tensor)


def test_jump_across_the_surface():
    # tangential components continuous, the radial one jumps by 3 G M / R^3 = 4 pi G rho
    inside = tidal.uniform_sphere_tidal_tensor(CENTER + [0.0, 0.0, RADIUS * (1 - 1e-12)], CENTER, RADIUS, MASS)
    outside = tidal.uniform_sphere_tidal_tensor(CENTER + [0.0, 0.0, RADIUS * (1 + 1e-12)], CENTER, RADIUS, MASS)
    scale = hand.G * MASS / RADIUS**3
    assert (inside - outside) == pytest.approx(scale * np.diag([0.0, 0.0, 3.0]), abs=1e-10 * scale)
    on_surface = tidal.uniform_sphere_tidal_tensor(CENTER + [0.0, 0.0, RADIUS], CENTER, RADIUS, MASS)
    assert np.trace(on_surface) == pytest.approx(0.0, abs=1e-15 * scale)     # the surface counts as outside


def test_potential_is_continuous_and_correct():
    surface = CENTER + [RADIUS, 0.0, 0.0]
    assert float(tidal.uniform_sphere_potential(surface, CENTER, RADIUS, MASS)) == pytest.approx(-hand.G * MASS / RADIUS, rel=1e-15)
    assert float(tidal.uniform_sphere_potential(CENTER, CENTER, RADIUS, MASS)) == pytest.approx(-1.5 * hand.G * MASS / RADIUS, rel=1e-15)
    just_in = float(tidal.uniform_sphere_potential(CENTER + [RADIUS * (1 - 1e-9), 0.0, 0.0], CENTER, RADIUS, MASS))
    assert just_in == pytest.approx(-hand.G * MASS / RADIUS, rel=1e-8)


@pytest.mark.parametrize("offset", [[5.0, 0.0, 0.0], [1.5, -2.5, 3.0], [-0.2, 2.2, 0.4], [0.3, -0.4, 1.2], [0.0, 0.0, 0.0]])
def test_uniform_sphere_matches_finite_difference_hessian(offset):
    point = CENTER + offset
    scale = max(np.linalg.norm(offset), RADIUS)
    numeric = hessian(lambda x: float(tidal.uniform_sphere_potential(x, CENTER, RADIUS, MASS)), point, 3e-4 * scale)
    tensor = tidal.uniform_sphere_tidal_tensor(point, CENTER, RADIUS, MASS)
    assert relative_difference(numeric, tensor) < 5e-6


def test_vectorised_over_points():
    points = CENTER + np.array([[[5.0, 0.0, 0.0], [0.3, -0.4, 1.2]], [[0.0, 0.0, 0.0], [1.5, -2.5, 3.0]]])
    tensors = tidal.uniform_sphere_tidal_tensor(points, CENTER, RADIUS, MASS)
    assert tensors.shape == (2, 2, 3, 3)
    assert np.all(np.isfinite(tensors))
    for index in np.ndindex(2, 2):
        assert np.array_equal(tensors[index], tidal.uniform_sphere_tidal_tensor(points[index], CENTER, RADIUS, MASS))
    assert tidal.uniform_sphere_potential(points, CENTER, RADIUS, MASS).shape == (2, 2)


# --- the scene: nested spheres by superposition ----------------------------------------

def test_scene_mass_is_density_times_own_volume(scene):
    for roots in (None, ["earth"], ["sun"], ["moon"], ["outer-core"]):
        ids = scene.ids if roots is None else scene.subtree(roots[0])
        direct = math.fsum(scene[i].material.density * scene[i].own_volume for i in ids)
        assert tidal.scene_mass(scene, roots) == pytest.approx(direct, rel=1e-13)
    assert tidal.scene_mass(scene) == pytest.approx(
        math.fsum(tidal.scene_mass(scene, [root]) for root in scene.roots), rel=1e-15)
    # the rounded textbook layers give the Earth's mass to better than 1 %
    assert tidal.scene_mass(scene, ["earth"]) == pytest.approx(5.9722e24, rel=1e-2)
    # ... and the Moon's two layers give its mass (7.342e22 kg) closely
    assert tidal.scene_mass(scene, ["moon"]) == pytest.approx(7.342e22, rel=2e-3)
    # ... and the Sun's two layers are given densities that add to the solar mass
    assert tidal.scene_mass(scene, ["sun"]) == pytest.approx(1.98847e30, rel=1e-4)


def test_nested_roots_are_refused(scene):
    with pytest.raises(ValueError):
        tidal.uniform_spheres(scene, ["earth", "outer-core"])


def interior_points(scene, raw_scene):
    """A point in the middle of each object's own region, off the axes."""
    direction = np.array([0.48, -0.6, 0.64])
    points = {}
    radii = [hand.radius_of(raw_scene, i) for i in EARTH_CHAIN]
    for object_id, outer, inner in zip(EARTH_CHAIN, radii, radii[1:] + [0.0]):
        points[object_id] = 0.5 * (outer + inner) * direction
    sun = np.array(hand.center_of(raw_scene, "sun"))
    points["sun"] = sun + 0.6 * hand.radius_of(raw_scene, "sun") * direction
    points["sun-core"] = sun + 0.5 * hand.radius_of(raw_scene, "sun-core") * direction
    for object_id, point in points.items():
        assert scene.object_at(point).id == object_id
    return points


def vacuum_points(scene, raw_scene):
    sun = np.array(hand.center_of(raw_scene, "sun"))
    points = {
        "observer": scene.observer,
        "low orbit": np.array([4.0e6, 4.0e6, 4.0e6]),
        "between Earth and Sun": 0.5 * sun,
        "above the Sun": sun + [0.0, 2.0e9, 1.0e9],
    }
    for point in points.values():
        assert scene.object_at(point) is None
    return points


def test_trace_is_4_pi_G_rho_inside(scene, raw_scene):
    for object_id, point in interior_points(scene, raw_scene).items():
        density = hand.material_of(raw_scene, object_id)["density"]
        tensor = tidal.scene_tidal_tensor(scene, point)
        assert np.trace(tensor) == pytest.approx(4.0 * math.pi * hand.G * density, rel=1e-12)
        assert np.array_equal(tensor, tensor.T)


def test_traceless_and_symmetric_outside_all_mass(scene, raw_scene):
    for point in vacuum_points(scene, raw_scene).values():
        tensor = tidal.scene_tidal_tensor(scene, point)
        assert np.array_equal(tensor, tensor.T)
        assert abs(np.trace(tensor)) <= 5e-15 * np.linalg.norm(tensor)
        assert np.linalg.norm(tensor) > 0.0


def test_earth_tide_at_the_observer_by_hand(scene, raw_scene):
    """Outside concentric shells the field is that of the total mass at the
    centre: (G M / r^3) diag(1, -2, 1) with the observer on the y axis."""
    radii = [hand.radius_of(raw_scene, i) for i in EARTH_CHAIN]
    densities = [hand.material_of(raw_scene, i)["density"] for i in EARTH_CHAIN]
    mass = math.fsum(rho * (hand.ball_volume(outer) - hand.ball_volume(inner))
                     for rho, outer, inner in zip(densities, radii, radii[1:] + [0.0]))
    r = float(raw_scene["observer"]["position"][1])
    assert raw_scene["observer"]["position"][0] == 0 and raw_scene["observer"]["position"][2] == 0
    expected = hand.G * mass / r**3 * np.diag([1.0, -2.0, 1.0])
    tensor = tidal.scene_tidal_tensor(scene, scene.observer, roots=["earth"])
    assert tensor == pytest.approx(expected, rel=1e-12, abs=1e-25)
    # the familiar free-air gradient, about -3.08e-6 s^-2 (3080 Eotvos), vertically
    assert tensor[1, 1] == pytest.approx(-3.08e-6, rel=1e-2)


def test_scene_matches_finite_difference_hessian_near_the_earth(scene, raw_scene):
    points = {k: v for k, v in interior_points(scene, raw_scene).items() if k in EARTH_CHAIN}
    points["low orbit"] = vacuum_points(scene, raw_scene)["low orbit"]
    for label, point in points.items():
        h = 3e-4 * np.linalg.norm(point)
        for roots, tolerance in ((["earth"], 5e-6), (None, 5e-6)):
            numeric = hessian(lambda x: float(tidal.scene_potential(scene, x, roots)), point, h)
            assert relative_difference(numeric, tidal.scene_tidal_tensor(scene, point, roots)) < tolerance, label


def test_scene_matches_finite_difference_hessian_near_the_sun(scene, raw_scene):
    sun = np.array(hand.center_of(raw_scene, "sun"))
    points = {k: v for k, v in interior_points(scene, raw_scene).items() if k.startswith("sun")}
    points["above the Sun"] = vacuum_points(scene, raw_scene)["above the Sun"]
    for label, point in points.items():
        h = 3e-4 * np.linalg.norm(point - sun)
        numeric = hessian(lambda x: float(tidal.scene_potential(scene, x)), point, h)
        assert relative_difference(numeric, tidal.scene_tidal_tensor(scene, point)) < 5e-6, label


# --- at the observer, with 60-digit arithmetic ----------------------------------------

getcontext().prec = 60
PI = Decimal("3.14159265358979323846264338327950288419716939937510582097494")


def decimal_potential(spheres, point):
    """Phi of uniform spheres (centre, radius, mass) in exact-ish decimals."""
    total = Decimal(0)
    for center, radius, mass in spheres:
        r = sum((p - c) ** 2 for p, c in zip(point, center)).sqrt()
        if r >= radius:
            total += -Decimal(hand.G) * mass / r
        else:
            total += -Decimal(hand.G) * mass * (3 * radius**2 - r**2) / (2 * radius**3)
    return total


def decimal_hessian(spheres, point, h=Decimal("0.25")):
    def phi(shift):
        return decimal_potential(spheres, [p + s for p, s in zip(point, shift)])

    zero = Decimal(0)
    out = np.empty((3, 3))
    for i in range(3):
        for j in range(i, 3):
            a = [h if k == i else zero for k in range(3)]
            b = [h if k == j else zero for k in range(3)]
            plus = [x + y for x, y in zip(a, b)]
            cross = [x - y for x, y in zip(a, b)]
            minus = [-x for x in plus]
            anti = [-x for x in cross]
            if i == j:
                value = (phi(a) - 2 * phi([zero] * 3) + phi([-x for x in a])) / h**2
            else:
                value = (phi(plus) - phi(cross) - phi(anti) + phi(minus)) / (4 * h**2)
            out[i, j] = out[j, i] = float(value)
    return out


def test_earth_tide_at_the_observer_against_decimal_finite_differences(scene, raw_scene):
    spheres = []
    for obj in raw_scene["objects"]:
        if obj["id"] not in EARTH_CHAIN:
            continue
        density = Decimal(raw_scene["materials"][obj["material"]]["density"])
        parent = obj.get("parent")
        if parent is not None:
            density -= Decimal(hand.material_of(raw_scene, parent)["density"])
        radius = Decimal(obj["shape"]["radius"])
        spheres.append(([Decimal(v) for v in obj["shape"]["center"]], radius, density * 4 * PI * radius**3 / 3))
    assert len(spheres) == 5
    observer = [Decimal(v) for v in raw_scene["observer"]["position"]]
    # the stencil (h = 0.25 m) stays in the 2 m of vacuum above the ground
    assert min(obj["shape"]["radius"] for obj in raw_scene["objects"] if obj["id"] == "earth") + 1 < observer[1]
    numeric = decimal_hessian(spheres, observer)
    tensor = tidal.scene_tidal_tensor(scene, scene.observer, roots=["earth"])
    assert relative_difference(tensor, numeric) < 1e-11


def test_sun_tide_at_the_observer_against_decimal_finite_differences(scene, raw_scene):
    center = hand.center_of(raw_scene, "sun")
    radius = hand.radius_of(raw_scene, "sun")
    spheres = [([Decimal(v) for v in center], Decimal(radius), Decimal(hand.M_SUN))]
    observer = [Decimal(v) for v in raw_scene["observer"]["position"]]
    numeric = decimal_hessian(spheres, observer)
    tensor = tidal.uniform_sphere_tidal_tensor(scene.observer, center, radius, hand.M_SUN)
    assert relative_difference(tensor, numeric) < 1e-11
    # by hand: G M / d^3 = 3.96e-14 s^-2 at 1 AU; the x axis is perpendicular to the Sun's direction
    assert tensor[0, 0] == pytest.approx(3.96e-14, rel=1e-2)
    distance = math.dist(center, raw_scene["observer"]["position"])
    assert tensor[0, 0] == pytest.approx(hand.G * hand.M_SUN / distance**3, rel=1e-13)


# --- far away everything is a point mass ---------------------------------------------

def test_point_mass_limit_of_the_scene(scene):
    spheres = tidal.uniform_spheres(scene)
    total = math.fsum(mass for _, _, _, mass in spheres)
    barycentre = sum(mass * np.array(center) for _, center, _, mass in spheres) / total
    rng = np.random.default_rng(4)
    for _ in range(10):
        direction = rng.standard_normal(3)
        direction /= np.linalg.norm(direction)
        point = barycentre + 1.0e15 * direction
        tensor = tidal.scene_tidal_tensor(scene, point)
        # corrections are of relative order (M_earth / M_sun) (1.5e11 / 1e15)^2 ~ 1e-13
        assert relative_difference(tensor, tidal.point_mass_tidal_tensor(point, barycentre, total)) < 1e-10
        assert abs(np.trace(tensor)) <= 5e-15 * np.linalg.norm(tensor)


def test_point_mass_limit_is_a_limit():
    """Two comparable spheres a distance d apart: the tidal tensor approaches
    that of the total mass at the barycentre as (d / r)^2."""
    data = {
        "observer": {"position": [0, 0, 0]},
        "materials": {"a": {"density": 3000, "temperature": 1, "friction": 0},
                      "b": {"density": 5000, "temperature": 1, "friction": 0}},
        "objects": [
            {"id": "a", "shape": {"type": "sphere", "center": [-40, 0, 0], "radius": 10}, "material": "a"},
            {"id": "b", "shape": {"type": "sphere", "center": [60, 0, 0], "radius": 8}, "material": "b"},
        ],
    }
    scene = scene_from_dict(data)
    masses = [3000 * hand.ball_volume(10), 5000 * hand.ball_volume(8)]
    total = sum(masses)
    barycentre = np.array([(-40 * masses[0] + 60 * masses[1]) / total, 0.0, 0.0])
    assert tidal.scene_mass(scene) == pytest.approx(total, rel=1e-14)
    direction = np.array([0.6, 0.48, 0.64])
    errors = []
    for distance in (1.0e3, 1.0e4, 1.0e5):
        point = barycentre + distance * direction
        tensor = tidal.scene_tidal_tensor(scene, point)
        errors.append(relative_difference(tensor, tidal.point_mass_tidal_tensor(point, barycentre, total)))
    assert errors[0] > 1e-3 > errors[1] > 1e-5 > errors[2]
    assert errors[0] / errors[1] == pytest.approx(100.0, rel=0.1)       # second order in d / r
    assert errors[1] / errors[2] == pytest.approx(100.0, rel=0.1)
