"""The pinhole camera convention shared with the engine."""
import math

import numpy as np
import pytest

from gravcam.camera import camera_basis, pixel_solid_angles, ray_directions, yaw_pitch_toward


def test_basis_at_rest():
    forward, right, up = camera_basis(0.0, 0.0)
    assert forward.tolist() == [0.0, 0.0, -1.0]      # looks along -z
    assert right.tolist() == [1.0, 0.0, 0.0]
    assert up.tolist() == [0.0, 1.0, 0.0]            # +y is up


def test_basis_formulas():
    for yaw, pitch in [(0.3, 0.2), (-1.1, 0.7), (2.5, -1.2), (4.0, 0.0), (0.0, -math.pi / 2)]:
        forward, right, up = camera_basis(yaw, pitch)
        assert forward.tolist() == [-math.sin(yaw) * math.cos(pitch), math.sin(pitch), -math.cos(yaw) * math.cos(pitch)]
        assert right.tolist() == [math.cos(yaw), 0.0, -math.sin(yaw)]
        assert np.allclose(up, np.cross(right, forward), rtol=0, atol=0)
        # orthonormal and right-handed: right x up = -forward (the camera looks along -"z_cam")
        basis = np.array([right, up, -forward])
        assert np.allclose(basis @ basis.T, np.eye(3), atol=1e-15)
        assert np.linalg.det(basis) == pytest.approx(1.0, abs=1e-15)


def test_yaw_turns_left_and_pitch_looks_up():
    forward, _, _ = camera_basis(0.1, 0.0)
    assert forward[0] < 0 and forward[1] == 0 and forward[2] < 0          # towards -x
    assert camera_basis(math.pi / 2, 0.0)[0] == pytest.approx([-1.0, 0.0, 0.0], abs=1e-15)
    # counter-clockwise seen from above (+y): -z -> -x -> +z -> +x
    assert camera_basis(math.pi, 0.0)[0] == pytest.approx([0.0, 0.0, 1.0], abs=1e-15)
    assert camera_basis(3 * math.pi / 2, 0.0)[0] == pytest.approx([1.0, 0.0, 0.0], abs=1e-15)
    assert camera_basis(0.0, 0.1)[0][1] > 0                                # looks up
    assert camera_basis(0.7, math.pi / 2)[0] == pytest.approx([0.0, 1.0, 0.0], abs=1e-15)
    assert camera_basis(0.0, -math.pi / 2)[0] == pytest.approx([0.0, -1.0, 0.0], abs=1e-15)


def pixel_direction(i, j, yaw, pitch, fov, width, height):
    """The stated formula, one pixel at a time, in plain Python."""
    forward = (-math.sin(yaw) * math.cos(pitch), math.sin(pitch), -math.cos(yaw) * math.cos(pitch))
    right = (math.cos(yaw), 0.0, -math.sin(yaw))
    up = (right[1] * forward[2] - right[2] * forward[1],
          right[2] * forward[0] - right[0] * forward[2],
          right[0] * forward[1] - right[1] * forward[0])
    a = ((i + 0.5) / width * 2 - 1) * math.tan(fov / 2) * (width / height)
    b = (1 - (j + 0.5) / height * 2) * math.tan(fov / 2)
    v = [forward[k] + a * right[k] + b * up[k] for k in range(3)]
    norm = math.sqrt(sum(x * x for x in v))
    return [x / norm for x in v]


@pytest.mark.parametrize("yaw, pitch, fov, width, height", [
    (0.0, 0.0, math.radians(60), 4, 3),
    (0.4, -0.3, math.radians(90), 7, 5),
    (-2.0, 1.0, 0.02, 3, 8),
    (0.0, -math.pi / 2, math.radians(120), 5, 5),
])
def test_pixel_directions_follow_the_formula(yaw, pitch, fov, width, height):
    directions = ray_directions(yaw, pitch, fov, width, height)
    assert directions.shape == (height, width, 3) and directions.dtype == np.float64
    for j in range(height):
        for i in range(width):
            assert directions[j, i] == pytest.approx(pixel_direction(i, j, yaw, pitch, fov, width, height), abs=1e-15)
    assert np.allclose(np.linalg.norm(directions, axis=-1), 1.0, rtol=0, atol=1e-15)


def test_image_orientation():
    yaw, pitch, fov = 0.5, 0.2, math.radians(50)
    forward, right, up = camera_basis(yaw, pitch)
    directions = ray_directions(yaw, pitch, fov, 6, 4)
    assert np.all(directions[:, 0] @ right < 0) and np.all(directions[:, -1] @ right > 0)   # i runs left to right
    assert np.all(directions[0] @ up > 0) and np.all(directions[-1] @ up < 0)               # j runs top to bottom
    assert np.all(np.diff(directions @ right, axis=1) > 0)
    assert np.all(np.diff(directions @ up, axis=0) < 0)


def test_centre_pixel_is_forward():
    for yaw, pitch in [(0.0, 0.0), (1.2, -0.4), (0.0, -math.pi / 2)]:
        forward, _, _ = camera_basis(yaw, pitch)
        assert ray_directions(yaw, pitch, 1.0, 1, 1)[0, 0] == pytest.approx(forward, abs=1e-15)
        assert ray_directions(yaw, pitch, 1.0, 5, 3)[1, 2] == pytest.approx(forward, abs=1e-15)


def test_field_of_view_is_vertical():
    fov, width, height = math.radians(40), 9, 5
    forward, right, up = camera_basis(0.3, 0.1)
    directions = ray_directions(0.3, 0.1, fov, width, height)
    column = directions[:, width // 2]                    # the central column lies in the forward-up plane
    assert np.allclose(column @ right, 0.0, atol=1e-15)
    tangent = (column @ up) / (column @ forward)
    expected = [(1 - (j + 0.5) / height * 2) * math.tan(fov / 2) for j in range(height)]
    assert tangent == pytest.approx(expected, abs=1e-15)
    # the outer pixel edges span exactly the field of view vertically, and W/H times that horizontally
    assert tangent[0] * height / (height - 1) == pytest.approx(math.tan(fov / 2), rel=1e-14)
    row = directions[height // 2]
    assert (row[-1] @ right) / (row[-1] @ forward) * width / (width - 1) == pytest.approx(
        math.tan(fov / 2) * width / height, rel=1e-14)


def test_pixel_solid_angles():
    # they tile the image's solid angle: for a rectangle 2a x 2b at unit distance, 4 atan(a b / sqrt(1 + a^2 + b^2))
    fov, width, height = math.radians(70), 400, 300
    a, b = math.tan(fov / 2) * width / height, math.tan(fov / 2)
    exact = 4.0 * math.atan(a * b / math.sqrt(1 + a * a + b * b))
    omega = pixel_solid_angles(fov, width, height)
    assert omega.shape == (height, width)
    # midpoint rule, error ~ (pixel size)^2
    assert omega.sum() == pytest.approx(exact, rel=1e-5)
    side = 2 * math.tan(fov / 2) / height
    assert omega.max() == pytest.approx(side * side, rel=1e-4)       # on axis: the pixel's area at unit distance
    assert omega[0, 0] == pytest.approx(omega.min(), rel=1e-12)      # smallest in the corners
    assert omega[0, 0] == pytest.approx(side * side / (1 + a * a + b * b) ** 1.5, rel=2e-2)


def test_yaw_pitch_toward_round_trip():
    rng = np.random.default_rng(11)
    for _ in range(50):
        direction = rng.standard_normal(3)
        direction /= np.linalg.norm(direction)
        yaw, pitch = yaw_pitch_toward(3.0 * direction)
        assert camera_basis(yaw, pitch)[0] == pytest.approx(direction, abs=1e-15)
    assert yaw_pitch_toward([0.0, 0.0, -1.0]) == (0.0, 0.0)
    assert yaw_pitch_toward([0.0, -2.0, 0.0]) == (0.0, -math.pi / 2)
    assert yaw_pitch_toward([-1.0, 0.0, 0.0]) == pytest.approx((math.pi / 2, 0.0))


def test_invalid_arguments():
    with pytest.raises(ValueError):
        ray_directions(0.0, 0.0, 0.0, 4, 4)
    with pytest.raises(ValueError):
        ray_directions(0.0, 0.0, math.pi, 4, 4)
    with pytest.raises(ValueError):
        ray_directions(0.0, 0.0, 1.0, 0, 4)
    with pytest.raises(ValueError):
        ray_directions(0.0, 0.0, 1.0, 4.5, 4)
