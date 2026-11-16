"""Shared paths and fixtures for the reference tests."""
import json
from pathlib import Path

import pytest

from gravcam.scene import load_scene

REFERENCE_DIR = Path(__file__).resolve().parents[1]
SCENE_PATH = REFERENCE_DIR.parent / "scenes" / "sun-at-midnight.scene.json"
FIXTURE_PATH = REFERENCE_DIR / "fixtures" / "sun-at-midnight.json"


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
