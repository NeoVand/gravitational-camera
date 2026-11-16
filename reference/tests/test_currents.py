"""The current column (gravcam/currents.py) against brute-force sampling along
the ray, and the shape of the image of a smooth spinning ball."""
import math

import numpy as np
import pytest

from gravcam import currents
from gravcam.scene import scene_from_dict


def ball(rate=50.0, axis=(0.0, 0.0, 1.0), center=(0.3, -0.2, -3.0), radius=0.4, exclusion=0.25):
    return scene_from_dict({
        "name": "ball", "title": "ball",
        "observer": {"position": [0, 0, 0], "exclusion": exclusion},
        "materials": {"steel": {"density": 7850, "temperature": 293}},
        "objects": [{"id": "ball", "shape": {"type": "sphere", "center": list(center), "radius": radius},
                     "material": "steel", "spin": {"center": list(center), "axis": list(axis), "rate": rate}}],
    })


def brute(scene, direction, steps=400_000):
    """Midpoint sum of rho v dr / r along the ray, from the exclusion radius out."""
    obj = scene.objects[0]
    c = np.asarray(obj.shape.center)
    w = 2 * math.pi * obj.spin.rate * np.asarray(obj.spin.axis)
    s = np.asarray(obj.spin.center)
    n = np.asarray(direction) / np.linalg.norm(direction)
    r_max = np.linalg.norm(c) + obj.shape.radius + 1.0
    edges = np.linspace(scene.exclusion, r_max, steps + 1)
    r = 0.5 * (edges[1:] + edges[:-1])
    dr = edges[1] - edges[0]
    x = r[:, None] * n[None, :]
    inside = np.linalg.norm(x - c, axis=1) <= obj.shape.radius
    v = np.cross(w, x - s)
    return obj.material.density * np.sum((v * (inside * dr / r)[:, None]), axis=0)


@pytest.mark.parametrize("axis", [(0, 0, 1), (0.3, 0.8, 0.2), (1, 0, 0)])
def test_against_brute_force(axis):
    scene = ball(axis=axis)
    rng = np.random.default_rng(7)
    c = np.asarray(scene.objects[0].shape.center)
    for _ in range(12):
        target = c + rng.uniform(-0.35, 0.35, size=3)
        d = target / np.linalg.norm(target)
        exact = currents.current_column(scene, d)[0]
        approx = brute(scene, d)
        # midpoint sampling misplaces each of the two boundaries by at most half a
        # step, where the integrand jumps by at most rho |w| (radius + |c - s|) / r_min
        obj = scene.objects[0]
        r_max = np.linalg.norm(c) + obj.shape.radius + 1.0
        dr = (r_max - scene.exclusion) / 400_000
        w = 2 * math.pi * abs(obj.spin.rate)
        jump = obj.material.density * w * obj.shape.radius / (np.linalg.norm(c) - obj.shape.radius)
        assert np.linalg.norm(exact - approx) <= 2 * (dr / 2) * jump * 1.01


def test_a_still_ball_carries_no_current():
    scene = ball(rate=0.0)
    assert np.allclose(currents.current_column(scene, [[0.1, -0.07, -1.0]]), 0.0)


def test_a_ball_spinning_toward_the_camera_shows_a_vortex():
    """Spinning about the line of sight, the current column circulates around
    the ball's centre, anticlockwise as seen when the spin points at the camera,
    and vanishes at the centre."""
    centre = (0.0, 0.0, -3.0)
    scene = ball(rate=10.0, axis=(0, 0, 1), center=centre)
    c = np.asarray(centre)
    centre_dir = c / np.linalg.norm(c)
    assert np.linalg.norm(currents.current_column(scene, centre_dir)[0]) < 1e-9
    for angle in np.linspace(0, 2 * math.pi, 8, endpoint=False):
        offset = 0.2 * np.array([math.cos(angle), math.sin(angle), 0.0])
        d = (c + offset) / np.linalg.norm(c + offset)
        j = currents.current_column(scene, d)[0]
        # tangential, anticlockwise about +z (toward the camera at the origin)
        tangent = np.cross([0, 0, 1], offset)
        assert np.dot(j, tangent) > 0.99 * np.linalg.norm(j) * np.linalg.norm(tangent)


def test_current_over_tidal_column_is_the_mean_speed():
    """J / S is the speed along the line of sight, weighted by 1 / r: for a
    ball spinning about the line of sight, Omega times the distance from the
    axis. So the magnetic signal is about v / c of the electric one."""
    from gravcam import columns
    scene = ball(rate=50.0, axis=(0, 0, 1), center=(0.0, 0.0, -30.0), radius=0.4)
    d = np.array([0.25, 0.0, -30.0])
    d /= np.linalg.norm(d)
    j = np.linalg.norm(currents.current_column(scene, d)[0])
    s = columns.tidal_column(scene, d[None, :])[0]
    # far away the ray is nearly parallel to the axis, 0.25 m from it
    assert j / s == pytest.approx(2 * math.pi * 50.0 * 0.25, rel=1e-3)
