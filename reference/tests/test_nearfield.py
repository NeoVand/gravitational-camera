"""The near-field image model: the tidal field at the observer equals the sky
integral of the tidal column, E_ij = G integral dOmega (delta_ij - 3 n_i n_j) S(n).

The left side comes from ``tidal.py`` (closed-form fields of uniform spheres
and boxes, superposed with their density contrasts); the right side from
``columns.tidal_column`` on a quadrature over the sky. The two share no code
beyond the scene loader, so agreement checks the formula in the paper
(eq:tidal-column) and both implementations at once.

S(n) has kinks along every silhouette, so the quadrature converges only as a
power of the node spacing: observed relative errors are about 1e-2 at 64
polar nodes, 1e-3 at 256 and 1e-4 at 512 in the room scenes.
"""
import numpy as np
import pytest

from conftest import room_scene_path
from gravcam import nearfield, tidal
from gravcam.scene import load_scene, scene_from_dict


def relative_error(a, b):
    return float(np.linalg.norm(a - b) / np.linalg.norm(b))


def test_quadrature_weights_cover_the_sphere():
    directions, weights = nearfield.sky_quadrature(32)
    assert weights.sum() == pytest.approx(4 * np.pi, rel=1e-13)
    assert np.allclose(np.linalg.norm(directions, axis=1), 1.0, atol=1e-15)
    # exact for low-order polynomials: the second moment is (4 pi / 3) delta_ij
    second = np.einsum("k,ki,kj->ij", weights, directions, directions)
    assert np.allclose(second, (4 * np.pi / 3) * np.eye(3), atol=1e-13)


def test_a_single_sphere():
    """One uniform ball: its field at the observer is that of a point mass."""
    scene = scene_from_dict({
        "name": "ball", "title": "ball",
        "observer": {"position": [0, 0, 0], "exclusion": 0.25},
        "materials": {"lead": {"density": 11340, "temperature": 293}},
        "objects": [{"id": "ball", "shape": {"type": "sphere", "center": [0.6, -0.8, -2.0], "radius": 0.5},
                     "material": "lead"}],
    })
    mass = 11340 * 4 / 3 * np.pi * 0.5**3
    exact = tidal.point_mass_tidal_tensor(np.zeros(3), np.array([0.6, -0.8, -2.0]), mass)
    coarse = nearfield.tidal_tensor_from_columns(scene, n_mu=64)
    fine = nearfield.tidal_tensor_from_columns(scene, n_mu=256)
    assert relative_error(fine, exact) < 2e-3
    assert relative_error(fine, exact) < relative_error(coarse, exact) / 3


@pytest.mark.parametrize("name", ["locked-safe", "full-or-empty", "blank-mirror"])
def test_room_scenes(name):
    scene = load_scene(room_scene_path(name))
    exact = tidal.scene_tidal_tensor(scene, scene.observer)
    coarse = nearfield.tidal_tensor_from_columns(scene, n_mu=64)
    fine = nearfield.tidal_tensor_from_columns(scene, n_mu=256)
    # traceless whatever S is: the field of matter that does not contain the point
    assert abs(np.trace(fine)) < 1e-12 * np.linalg.norm(fine)
    assert relative_error(fine, exact) < 3e-3
    assert relative_error(fine, exact) < relative_error(coarse, exact)


def test_the_room_dominates_but_does_not_decide():
    """In the safe room, nearly all of the field at the camera is the floor and
    walls; what the demos show comes from the small difference the contents
    make, which is why they offer to subtract the empty room."""
    scene = load_scene(room_scene_path("locked-safe"))
    room = [o.id for o in scene.objects if o.parent is None and ("floor" in o.id or "wall" in o.id)]
    rest = [o.id for o in scene.objects if o.parent is None and o.id not in room]
    total = tidal.scene_tidal_tensor(scene, scene.observer)
    from_room = tidal.scene_tidal_tensor(scene, scene.observer, room)
    from_rest = tidal.scene_tidal_tensor(scene, scene.observer, rest)
    assert np.allclose(from_room + from_rest, total, rtol=1e-12, atol=1e-12 * np.linalg.norm(total))
    assert np.linalg.norm(from_room) > np.linalg.norm(from_rest)
