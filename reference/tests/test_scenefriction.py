"""The friction in the scene files is the friction of gravcam/scenefriction.py, and that is what the paper says of
each material (Sections VI and IX)."""
import json
import math

import pytest

from gravcam import glowbounds as gb
from gravcam import materials as M
from gravcam import scenefriction as sf


def test_the_scene_files_carry_the_table():
    values = {name: sf.rounded(v) for name, (v, _) in sf.table().items()}
    seen = set()
    for path in sorted(sf.SCENES.glob("*.scene.json")):
        for name, material in json.loads(path.read_text())["materials"].items():
            if name in values and "friction" in material:
                assert material["friction"] == pytest.approx(values[name], rel=1e-12, abs=0.0), (path.name, name)
                seen.add(name)
    assert seen == set(values)                     # every entry of the table is used by some scene
    assert sf.apply() == []                        # and writing it again changes nothing


def test_a_friction_of_the_table_sends_the_count_it_stands_for():
    t = M.table()
    # a constant friction eta sends eta / placeholder times the placeholder's count
    for material, T in ((t["iron"], 293.0), (t["silica"], 293.0), (t["copper"], 293.0)):
        eta = sf.count_friction(material, T)
        assert eta / sf.PLACEHOLDER * gb.placeholder_counts(T) == pytest.approx(
            4 * math.pi * M.number_emissivity(material, T), rel=1e-12)
    # the placeholder is its own equivalent
    assert sf.count_friction(M.placeholder(), 1700.0) == pytest.approx(sf.PLACEHOLDER, rel=1e-9)
    # iron sends more gravitons than the placeholder though less power: its glow is redder
    iron = sf.table()["steel"][0]
    assert iron == pytest.approx(1.09e-3, rel=0.01)
    assert M.effective_friction(t["iron"], 293.0) == pytest.approx(5.9e-4, rel=0.02)


def test_hot_iron_sends_about_twenty_five_times_the_cold():
    table = sf.table()
    cold, hot = table["cold-iron"][0], table["hot-iron"][0]
    counts = (hot * 1500.0**3) / (cold * 293.0**3)                 # j_N goes as eta T^3
    assert counts == pytest.approx((1500.0 / 293.0) ** 2, rel=1e-12)
    assert 25 < counts < 27


def test_the_earth_and_the_moon_are_at_their_caps_and_air_has_none():
    table = sf.table()
    caps = gb.earth_bounded()
    for scene_name, shell in sf.EARTH.items():
        assert table[scene_name][0] == pytest.approx(sf.PLACEHOLDER * caps[shell]["ratio"], rel=1e-12)
    fractions = sorted(table[name][0] / sf.PLACEHOLDER for name in sf.EARTH)
    assert fractions[0] == pytest.approx(0.16, abs=0.005) and fractions[-1] == pytest.approx(0.34, abs=0.005)
    assert 0 < table["moon-mantle"][0] < sf.PLACEHOLDER and 0 < table["moon-core"][0] < sf.PLACEHOLDER
    assert table["air"][0] == 0.0
    # air: its everyday viscosity, cut down by (omega tau)^2 at the peak of the glow, is some 1e-13 Pa s
    eta0, pressure = 1.8e-5, 1.0e5
    tau = eta0 / pressure
    omega = 2.82 * M.kB * 293.0 / M.hbar
    assert 1e-14 < eta0 / (omega * tau) ** 2 < 1e-12
