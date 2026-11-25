"""The friction written into the scene files (scenes/*.scene.json), material by material.

A scene gives each material one number, a friction eta constant in frequency, from which the engine and the
reference implementation get its count of gravitons, j_N = 16 G eta sigma T^3 / (2.701 k c^3) per volume and solid
angle. The paper began with one placeholder, 1e-3 Pa s, for everything. This module replaces it, where the paper has
something better, by the constant friction that sends as many gravitons as that better account does at the
material's temperature (so the counts are right; the energy then is 2.701 k T a graviton, which a real spectrum
only approximates):

  spectrum   the count of a model spectrum of materials.py (iron, with its electrons at their bound; silica glass
             for glass, and standing for concrete and plaster; copper standing for gold; water, from its simulated
             spectrum);
  hot metal  a metal's friction falls as 1/T when its collision rate grows as T (Section VI), so the hot iron has
             the cold iron's friction times 293 K / T: its count grows as T^2, about 26 times at 1500 K;
  cap        the most a relaxing shear stiffness can send, glowbounds.count_bound: the Earth's and the Moon's
             shells, with the stiffnesses of glowbounds.EARTH_SHELLS, wood, and honey. An upper bound, not an
             estimate;
  none       air: a gas whose molecules collide every 0.2 ns has next to no shear friction at the frequencies of
             heat (eta_0 / (omega tau)^2, about 1e-13 Pa s), so it is given none.

`table()` is the whole list; `python -m gravcam.scenefriction` writes it into the scene files, and
tests/test_scenefriction.py checks that the files agree with it.
"""
from __future__ import annotations

import json
import math
import pathlib
import re

from . import glowbounds as gb
from . import materials as M

PLACEHOLDER = M.PLACEHOLDER
SCENES = pathlib.Path(__file__).resolve().parents[2] / "scenes"


def count_friction(material: M.Material, temperature: float) -> float:
    """The constant friction that sends as many gravitons as the material's spectrum does at this temperature."""
    return PLACEHOLDER * 4 * math.pi * M.number_emissivity(material, temperature) / gb.placeholder_counts(temperature)


def cap_friction(delta_mu: float, temperature: float) -> float:
    """The constant friction that sends the most gravitons a relaxing shear stiffness delta_mu allows."""
    return PLACEHOLDER * min(1.0, gb.count_bound(delta_mu, temperature) / gb.placeholder_counts(temperature))


def hot_metal(friction_cold: float, temperature: float, cold: float = 293.0) -> float:
    """A metal whose collision rate grows as T: its friction at the frequencies of heat falls as 1 / T."""
    return friction_cold * cold / temperature


# Stiffnesses for the caps that are not the Earth's (Pa): wood's shear modulus is of order a gigapascal; the Moon's
# mantle has the shear modulus of the Earth's uppermost mantle, its small core the weight of two free electrons
# per atom of iron, as for the Earth's.
WOOD_STIFFNESS = 1e9
# Honey's everyday viscosity, some 10 Pa s, is the slow rearrangement of its molecules (Maxwell's model, Eq. maxwell):
# at the frequencies of heat that is frozen, and leaves of order G_inf^2 / (eta_0 omega^2), less than 1e-8 Pa s. What
# dissipates a uniform shear there are the fast vibrations of its hydrogen bonds and molecules, as in water, whose
# model (materials.water) has a weight of 15 GPa. Honey, four-fifths sugar and denser, is allowed twice that: an
# upper bound on its glow, not an estimate, which leaves it at most four times as bright as water.
HONEY_VISCOSITY = 10.0
HONEY_STIFFNESS = 30e9
MOON_MANTLE_STIFFNESS = 70e9
MOON_CORE_STIFFNESS = 220e9

# scene material -> the Earth shell of glowbounds.EARTH_SHELLS whose stiffness and temperature it has
EARTH = {"crust": "crust", "upper-mantle": "upper mantle", "lower-mantle": "lower mantle",
         "outer-core": "outer core", "inner-core": "inner core"}


def table() -> dict[str, tuple[float, str]]:
    """Scene material -> (friction in Pa s, how it was got). Materials not listed keep what their scene gives."""
    t = M.table()
    iron = count_friction(t["iron"], 293.0)
    silica = count_friction(t["silica"], 293.0)
    out = {
        "air": (0.0, "none"),
        "steel": (iron, "spectrum: iron, electrons at their bound, 293 K"),
        "cold-iron": (iron, "spectrum: iron, electrons at their bound, 293 K"),
        "hot-iron": (hot_metal(iron, 1500.0), "hot metal: the cold iron's friction times 293/1500"),
        "concrete": (silica, "spectrum: silica glass standing for concrete, 293 K"),
        "plaster": (silica, "spectrum: silica glass standing for plaster, 293 K"),
        "gold": (count_friction(t["copper"], 293.0), "spectrum: copper standing for gold, 293 K"),
        "glass": (silica, "spectrum: silica glass, 293 K"),
        "water": (count_friction(t["water"], 293.0), "spectrum: water (Schulz et al. 2020), 293 K"),
        "honey": (cap_friction(HONEY_STIFFNESS, 293.0), "cap: 30 GPa, twice the water model's weight, 293 K"),
        "wood": (cap_friction(WOOD_STIFFNESS, 293.0), "cap: shear stiffness 1 GPa, 293 K"),
        "moon-mantle": (cap_friction(MOON_MANTLE_STIFFNESS, 1200.0), "cap: 70 GPa, 1200 K"),
        "moon-core": (cap_friction(MOON_CORE_STIFFNESS, 1700.0), "cap: 220 GPa, 1700 K"),
    }
    for scene_name, shell in EARTH.items():
        _, temperature, stiffness = gb.EARTH_SHELLS[shell]
        out[scene_name] = (cap_friction(stiffness, temperature),
                           f"cap: {stiffness / 1e9:.0f} GPa, {temperature:.0f} K")
    return out


def rounded(value: float) -> float:
    """Three significant figures, as written into the files."""
    return float(f"{value:.3g}")


def apply(scenes: pathlib.Path = SCENES) -> list[str]:
    """Write the table's frictions into every scene file that has those materials, changing nothing else in them.
    Returns one line per change."""
    changes = []
    values = {name: rounded(v) for name, (v, _) in table().items()}
    for path in sorted(scenes.glob("*.scene.json")):
        text = path.read_text()
        materials = json.loads(text)["materials"]
        for name, value in values.items():
            if name not in materials or "friction" not in materials[name]:
                continue
            block = re.search(r'"%s":\s*\{' % re.escape(name), text)
            line = re.compile(r'("friction":\s*)([-0-9.eE+]+)')
            found = line.search(text, block.end())
            new = "0" if value == 0 else repr(value)
            if float(found.group(2)) != value:
                changes.append(f"{path.name}: {name} {found.group(2)} -> {new}")
                text = text[:found.start(2)] + new + text[found.end(2):]
        assert json.loads(text)["materials"].keys() == materials.keys()
        path.write_text(text)
    return changes


if __name__ == "__main__":
    for name, (value, how) in table().items():
        print(f"{name:13s} {rounded(value):9.3g} Pa s   {how}")
    for change in apply():
        print(change)
