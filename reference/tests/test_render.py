"""The renderer and its command line."""
import math
import subprocess
import sys

import numpy as np
import pytest

import hand
from conftest import REFERENCE_DIR
from gravcam import camera, columns, render


def test_render_is_the_column_of_every_pixel_ray(scene):
    yaw, pitch, fov, width, height = 0.2, -1.1, math.radians(70), 8, 6
    image = render.render(scene, yaw, pitch, fov, width, height)
    assert image.shape == (height, width) and image.dtype == np.float64
    directions = camera.ray_directions(yaw, pitch, fov, width, height)
    assert np.array_equal(image, columns.number_radiance(scene, directions))
    for j, i in ((0, 0), (5, 7), (2, 3)):
        assert image[j, i] == float(columns.number_radiance(scene, directions[j, i]))
    assert image.max() > 0.0


def test_render_mass_column_and_unknown_quantity(scene):
    image = render.render(scene, 0.0, -math.pi / 2, math.radians(40), 5, 5, quantity="mass_column")
    # the centre pixel looks straight down: the full mass column through the Earth's centre
    assert image[2, 2] == float(columns.mass_column(scene, camera.camera_basis(0.0, -math.pi / 2)[0]))
    assert image[2, 2] == pytest.approx(1.074935e11, rel=1e-6)
    with pytest.raises(ValueError):
        render.render(scene, 0.0, 0.0, 1.0, 4, 4, quantity="colour")


def test_looking_up_is_dark_and_down_is_layered(scene):
    assert not render.render(scene, 0.0, math.pi / 2, math.radians(60), 6, 6).any()
    down = render.render(scene, 0.0, -math.pi / 2, math.radians(100), 65, 65)
    centre = down[32, 32]
    assert centre == down.max()                       # the longest, hottest path is through the centre
    assert np.allclose(down, down[::-1, :], rtol=1e-9) and np.allclose(down, down[:, ::-1], rtol=1e-9)
    assert np.all(np.diff(down[32, 32:]) <= 0)        # dimmer towards the limb


def test_cli_writes_the_number_radiance_image(scene, scene_path, tmp_path, capsys):
    out = tmp_path / "image.npy"
    code = render.main([str(scene_path), "--yaw", "0.3", "--pitch", "-1.2", "--fov", "0.9",
                        "--size", "7", "4", "--out", str(out)])
    assert code == 0
    image = np.load(out)
    assert image.shape == (4, 7) and image.dtype == np.float64        # (H, W)
    assert np.array_equal(image, render.render(scene, 0.3, -1.2, 0.9, 7, 4))
    assert "number_radiance" in capsys.readouterr().out


def test_cli_degrees_and_quantity(scene, scene_path, tmp_path):
    out = tmp_path / "column.dat"             # the name is used as given, no suffix added
    render.main([str(scene_path), "--yaw", "10", "--pitch", "-80", "--fov", "50", "--degrees",
                 "--size", "3", "5", "--quantity", "mass_column", "--out", str(out)])
    image = np.load(out)
    expected = render.render(scene, math.radians(10), math.radians(-80), math.radians(50), 3, 5, quantity="mass_column")
    assert np.array_equal(image, expected)


def test_cli_as_a_module(scene, scene_path, tmp_path):
    out = tmp_path / "sun.npy"
    done = subprocess.run(
        [sys.executable, "-m", "gravcam.render", str(scene_path), "--yaw", "0", "--pitch", "-0.87",
         "--fov", "0.02", "--size", "16", "12", "--out", str(out)],
        cwd=REFERENCE_DIR, capture_output=True, text=True,
    )
    assert done.returncode == 0, done.stderr
    assert done.stderr == ""
    image = np.load(out)
    assert image.shape == (12, 16)
    assert np.array_equal(image, render.render(scene, 0.0, -0.87, 0.02, 16, 12))


def test_image_of_the_suns_core_integrates_to_its_graviton_flux(scene, raw_scene):
    """End to end (camera, solid angles, columns, emission): the radiance image
    of the core, integrated over solid angle, is the graviton flux at the
    observer, L / (4 pi d^2) / (2.701 k T), up to the finite-size factor
    1 + R^2 / (5 d^2) of a uniformly emitting ball (1.7e-7 here).

    The pixel sum is a midpoint rule over a disc about 200 pixels across whose
    integrand ends like a square root at the limb, so its error is of order
    (pixel / radius)^1.5 = 1e-3 times a small coefficient; between 64 and 512
    pixels it is observed below 5e-5. Asserted: 2e-4."""
    center = np.array(hand.center_of(raw_scene, "sun-core"))
    radius = hand.radius_of(raw_scene, "sun-core")
    material = hand.material_of(raw_scene, "sun-core")
    offset = center - scene.observer
    distance = float(np.linalg.norm(offset))
    yaw, pitch = camera.yaw_pitch_toward(offset)
    fov, size = 2.5 * math.asin(radius / distance), 256

    image = render.render(scene, yaw, pitch, fov, size, size)
    flux = float(np.sum(image * camera.pixel_solid_angles(fov, size, size)))

    point_source = material["luminosity"] / (4 * math.pi * distance**2) / (2.701 * hand.KB * material["temperature"])
    expected = point_source * (1 + radius**2 / (5 * distance**2))
    assert flux == pytest.approx(expected, rel=2e-4)
    assert flux == pytest.approx(0.7334, rel=1e-3)          # gravitons m^-2 s^-1 at the observer
    # the brightest pixel is next to the centre of the disc: just under 2 r j_N
    peak = 2 * radius * material["luminosity"] / (4 * math.pi * hand.ball_volume(radius)) / (2.701 * hand.KB * material["temperature"])
    assert 0.999 * peak < image.max() <= peak * (1 + 1e-12)
    # the Earth in front contributes eleven orders of magnitude less
    assert 0 < image.min() < 1e-9 * image.max()
