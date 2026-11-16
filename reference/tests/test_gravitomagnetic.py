"""The magnetic tidal tensor (gravcam/gravitomagnetic.py) against the
finite-difference curvature of a metric perturbation (gravcam/curvature.py),
and the properties the paper states."""
import math

import numpy as np
import pytest

from gravcam import columns, currents, curvature, gravitomagnetic as gm
from gravcam.constants import G, c
from gravcam.scene import scene_from_dict


def test_plane_wave_has_equal_electric_and_magnetic_parts():
    for plus, cross in ((1.0, 0.0), (0.0, 1.0), (0.6, 0.8)):
        h = curvature.plane_wave_metric(1e-3, 2 * math.pi, plus=plus, cross=cross)
        E, B = curvature.tidal_tensors(curvature.riemann(h, 0.11 * c, [0.1, 0.2, 0.05 * c], step=0.002 * c))
        assert np.linalg.norm(B) == pytest.approx(np.linalg.norm(E), rel=1e-9)
        # B is E turned by 45 degrees about the direction of travel
        turn = np.array([[math.cos(math.pi / 4), -math.sin(math.pi / 4), 0],
                         [math.sin(math.pi / 4), math.cos(math.pi / 4), 0], [0, 0, 1]])
        assert np.allclose(turn @ E @ turn.T, B, atol=1e-9 * np.abs(E).max()) or \
            np.allclose(turn.T @ E @ turn, B, atol=1e-9 * np.abs(E).max())


@pytest.mark.parametrize("seed", [1, 2, 3, 4])
def test_point_formulas_against_finite_difference_curvature(seed):
    rng = np.random.default_rng(seed)
    m = rng.uniform(10, 1000)
    p = rng.normal(size=3) * 2
    v = rng.normal(size=3) * 40
    h = curvature.moving_masses_metric([m], [p], [v])
    E, B = curvature.tidal_tensors(curvature.riemann(h, 0.0, [0, 0, 0], step=2e-3))
    assert np.linalg.norm(E - gm.electric_point(m, p)) < 1e-8 * np.linalg.norm(E)
    # B is ~1e-7 of E; the finite differences carry ~1e-3 of it
    assert np.linalg.norm(B - gm.magnetic_point(m, p, v)) < 5e-3 * np.linalg.norm(B)


def test_only_motion_across_the_line_of_sight_counts():
    p = np.array([0.3, -0.4, -2.0])
    n = p / np.linalg.norm(p)
    assert np.allclose(gm.magnetic_point(50.0, p, 30.0 * n), 0.0)
    across = np.cross(n, [0, 1, 0])
    v = 30.0 * across / np.linalg.norm(across)
    ratio = np.linalg.norm(gm.magnetic_point(50.0, p, v)) / np.linalg.norm(gm.electric_point(50.0, p))
    assert ratio == pytest.approx(math.sqrt(3) * 30.0 / c, rel=1e-12)
    B = gm.magnetic_point(50.0, p, v)
    assert np.allclose(B, B.T) and abs(np.trace(B)) < 1e-12 * np.abs(B).max()


def test_shell_and_ball_agree_in_E_and_differ_in_B_by_their_moments_of_inertia():
    M, R = 1000.0, 0.4
    w = np.array([0.3, -0.2, 1.0])
    w *= 2 * math.pi * 50 / np.linalg.norm(w)
    centre = np.array([0.5, -0.3, -2.0])
    for inner in (0.0, 0.2, 0.39):
        rho = M / (4 / 3 * math.pi * (R ** 3 - inner ** 3))
        E, B = gm.spinning_shell(centre, R, inner, rho, w)
        I = 0.4 * M * (R ** 5 - inner ** 5) / (R ** 3 - inner ** 3)
        # E is that of a point mass (the shell theorem) ...
        assert np.allclose(E, gm.electric_point(M, centre), rtol=0, atol=1e-12 * np.abs(E).max())
        # ... and B exactly that of a spin dipole with L = I w
        assert np.allclose(B, gm.spin_dipole(I * w, centre), rtol=0, atol=1e-10 * np.abs(B).max())
    # a thin shell against a ball: 5/3
    assert (2 / 3) / (2 / 5) == pytest.approx(5 / 3)


def test_sky_integral_of_the_current_column_gives_B():
    """B from the current column on a fine grid of directions equals the sum
    of the point formula over the spinning ball's volume."""
    centre = [0.2, -0.1, -2.5]
    radius, rate = 0.35, 20.0
    scene = scene_from_dict({
        "name": "spin", "title": "spin",
        "observer": {"position": [0, 0, 0], "exclusion": 0.25},
        "materials": {"steel": {"density": 7850, "temperature": 293}},
        "objects": [{"id": "ball", "shape": {"type": "sphere", "center": centre, "radius": radius},
                     "material": "steel", "spin": {"center": centre, "axis": [0.2, 0.9, 0.39], "rate": rate}}],
    })
    axis = np.asarray(scene.objects[0].spin.axis)
    w = 2 * math.pi * rate * axis
    _, B_volume = gm.spinning_shell(centre, radius, 0.0, 7850.0, w)
    # tangent-plane grid around the ball's direction, with exact solid-angle weights
    k = np.asarray(centre) / np.linalg.norm(centre)
    e1 = np.cross(k, [0, 1, 0]); e1 /= np.linalg.norm(e1)
    e2 = np.cross(k, e1)
    half = 1.1 * radius / math.sqrt(np.dot(centre, centre) - radius ** 2)
    n = 900
    u = (np.arange(n) + 0.5) / n * 2 * half - half
    U, V = np.meshgrid(u, u, indexing="ij")
    d = k[None, :] + U.reshape(-1, 1) * e1 + V.reshape(-1, 1) * e2
    norm = np.linalg.norm(d, axis=1)
    d /= norm[:, None]
    weights = (2 * half / n) ** 2 / norm ** 3
    J = currents.current_column(scene, d, exclusion=0.0)
    B_sky = gm.magnetic_from_current_columns(d, weights, J)
    assert np.linalg.norm(B_sky - B_volume) < 2e-3 * np.linalg.norm(B_volume)


@pytest.mark.parametrize("direction", [1, -1])
def test_a_beam_of_light_has_the_field_of_a_plane_wave_and_shows_its_direction(direction):
    """Beside a steady beam of power P along z, at distance b: E has
    eigenvalues (-1, +1, 0) 4GP/(c^3 b^2), |B| = |E| as in a plane wave, and
    reversing the beam reverses B but not E."""
    P, L, b = 1e5, 2000.0, 0.5
    lin = P / c

    def h(x0, x):
        rho = math.hypot(x[0], x[1])
        F = math.asinh((L / 2 - x[2]) / rho) - math.asinh((-L / 2 - x[2]) / rho)
        A = 4 * G * lin / c ** 4 * F
        out = np.zeros((4, 4))
        out[0, 0] = out[3, 3] = A
        out[0, 3] = out[3, 0] = -direction * A
        return out

    E, B = curvature.tidal_tensors(curvature.riemann(h, 0.0, [b, 0.0, 0.0], step=1e-3))
    scale = 4 * G * P / (c ** 3 * b ** 2)
    assert np.allclose(np.sort(np.linalg.eigvalsh(E)), [-scale, 0.0, scale], rtol=0, atol=1e-6 * scale)
    # the stretch points at the beam, the squeeze runs across it, nothing along it
    assert np.allclose(np.diag(E), [-scale, scale, 0.0], rtol=0, atol=1e-6 * scale)
    assert np.linalg.norm(B) == pytest.approx(np.linalg.norm(E), rel=1e-6)
    assert B[0, 1] == pytest.approx(-direction * scale, rel=1e-6)
