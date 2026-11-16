"""The room-scene fixtures that the engine is tested against
(``fixtures/<scene>.json``, written by ``python -m gravcam.export_fixtures``)."""
import json

import numpy as np
import pytest

from conftest import FIXTURES_DIR, ROOM_SCENES, room_scene_path
from gravcam import columns, export_fixtures, tidal
from gravcam.scene import load_scene


@pytest.fixture(scope="module", params=ROOM_SCENES)
def case(request):
    name = request.param
    path = FIXTURES_DIR / f"{name}.json"
    return name, load_scene(room_scene_path(name)), path.read_text(encoding="utf-8")


def test_file_is_byte_identical_to_a_fresh_export(case):
    name, _, text = case
    assert text == export_fixtures.dumps(export_fixtures.build_room_fixture(room_scene_path(name))), (
        f"fixtures/{name}.json is stale: run python -m gravcam.export_fixtures")


def test_background_is_what_can_be_subtracted(case):
    """Background objects are roots without children (so subtracting them is
    exact), every floor and wall is one, and something is left once they are
    gone."""
    _, scene, text = case
    fixture = json.loads(text)
    background = set(fixture["background"])
    assert background == {o.id for o in scene.objects if o.background}
    for object_id in background:
        assert scene[object_id].parent is None and not scene[object_id].children
    for o in scene.objects:
        if "floor" in o.id or "wall" in o.id:
            assert o.id in background
    assert any(o.id not in background for o in scene.objects)


def test_rays_match_the_package_to_the_written_precision(case):
    _, scene, text = case
    rays = json.loads(text)["rays"]
    directions = np.array([r["direction"] for r in rays])
    fresh = columns.tidal_column(scene, directions)
    written = np.array([r["tidal_column"] for r in rays])
    assert np.allclose(written, fresh, rtol=6e-10, atol=0)
    assert any(r["label"] == "down" and r["tidal_column"] > 0 for r in rays)


def test_sensor_tensors(case):
    _, scene, text = case
    fixture = json.loads(text)
    background = fixture["background"]
    assert len(fixture["sensors"]) == 9
    for sensor in fixture["sensors"]:
        full = np.array(sensor["tensor"])
        kept = np.array(sensor["tensor_without_room"])
        scale = np.linalg.norm(full)
        for m in (full, kept):
            assert np.allclose(m, m.T, rtol=0, atol=1e-9 * scale)
            assert abs(np.trace(m)) < 1e-9 * scale        # outside matter: traceless
        # what was taken away is exactly the field of the empty room
        room = tidal.scene_tidal_tensor(scene, np.array(sensor["point"]), background)
        assert np.allclose(full - kept, room, rtol=0, atol=2e-9 * scale)


def test_sensors_straddle_the_observer(case):
    _, scene, text = case
    points = np.array([s["point"] for s in json.loads(text)["sensors"]])
    assert np.allclose(points.mean(axis=0), scene.observer)
    assert np.allclose(np.ptp(points, axis=0), [1.0, 1.0, 0.0])
