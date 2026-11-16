"""Shared paths and fixtures for the reference tests."""
import json
from pathlib import Path

import pytest

from gravcam.scene import load_scene

REFERENCE_DIR = Path(__file__).resolve().parents[1]
SCENE_PATH = REFERENCE_DIR.parent / "scenes" / "sun-at-midnight.scene.json"
FIXTURE_PATH = REFERENCE_DIR / "fixtures" / "sun-at-midnight.json"
SCENES_DIR = REFERENCE_DIR.parent / "scenes"
FIXTURES_DIR = REFERENCE_DIR / "fixtures"
ROOM_SCENES = ("locked-safe", "full-or-empty", "blank-mirror", "closed-furnace", "honey-and-water", "which-way")  # v1: boxes in a room


@pytest.fixture(scope="session")
def scene_path():
    return SCENE_PATH


@pytest.fixture(scope="session")
def scene():
    """The first scene, loaded by the package."""
    return load_scene(SCENE_PATH)


@pytest.fixture(scope="session")
def raw_scene():
    """The first scene as plain parsed JSON, untouched by the package."""
    return json.loads(SCENE_PATH.read_text(encoding="utf-8"))


def room_scene_path(name):
    return SCENES_DIR / f"{name}.scene.json"


@pytest.fixture(scope="session", params=ROOM_SCENES)
def room_name(request):
    return request.param


@pytest.fixture(scope="session")
def room(room_name):
    """Each room scene in turn, loaded by the package."""
    return load_scene(room_scene_path(room_name))


@pytest.fixture(scope="session")
def raw_room(room_name):
    """Each room scene in turn as plain parsed JSON, untouched by the package."""
    return json.loads(room_scene_path(room_name).read_text(encoding="utf-8"))


@pytest.fixture(scope="session")
def safe_scene():
    return load_scene(room_scene_path("locked-safe"))


@pytest.fixture(scope="session")
def raw_safe_scene():
    return json.loads(room_scene_path("locked-safe").read_text(encoding="utf-8"))


@pytest.fixture(scope="session")
def tank_scene():
    return load_scene(room_scene_path("full-or-empty"))


@pytest.fixture(scope="session")
def raw_tank_scene():
    return json.loads(room_scene_path("full-or-empty").read_text(encoding="utf-8"))
