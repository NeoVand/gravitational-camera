"""Thermal graviton emission, per the scene contract (``scenes/README.md``).

    alpha = 16 pi G eta / c^3                  absorption coefficient (1/m)
    j_E   = alpha sigma T^4 / pi               energy emissivity (W m^-3 sr^-1)
    j_E   = L / (4 pi V_own)                   if the material has a luminosity
    j_N   = j_E / (2.701 k T)                  number emissivity (s^-1 m^-3 sr^-1)

Choices where the contract is silent:

* ``luminosity`` is per object: every object whose material carries a
  luminosity L radiates L from its own region.
* With a luminosity, alpha plays no part in the emission. It is still reported
  from ``friction`` when the material has one, and is ``None`` when it has not
  (the solar core): the contract defines alpha only through friction.
* A material with neither ``friction`` nor ``luminosity`` is an error.
* If j_E is zero, j_N is zero whatever the temperature.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np

from .constants import G, c, kB, mean_energy_kT, sigma
from .scene import Scene, SceneError


def absorption_coefficient(friction: float) -> float:
    """alpha = 16 pi G eta / c^3, per metre, for shear viscosity eta (Pa s)."""
    return 16.0 * math.pi * G * friction / (c * c * c)


def thermal_energy_emissivity(alpha: float, temperature: float) -> float:
    """j_E = alpha sigma T^4 / pi (W m^-3 sr^-1)."""
    t2 = temperature * temperature
    return alpha * sigma * (t2 * t2) / math.pi


def luminosity_energy_emissivity(luminosity: float, own_volume: float) -> float:
    """j_E = L / (4 pi V) for a power L spread uniformly over a volume V."""
    return luminosity / (4.0 * math.pi * own_volume)


def mean_quantum_energy(temperature: float) -> float:
    """Mean energy of a thermal graviton, 2.701 k T (J)."""
    return mean_energy_kT * kB * temperature


def number_emissivity(energy_emissivity: float, temperature: float) -> float:
    """j_N = j_E / (2.701 k T) (gravitons s^-1 m^-3 sr^-1)."""
    if energy_emissivity == 0.0:
        return 0.0
    if not temperature > 0.0:
        raise SceneError("a material that emits needs a positive temperature")
    return energy_emissivity / mean_quantum_energy(temperature)


def flux_at_distance(luminosity: float, distance: float) -> float:
    """Energy flux L / (4 pi d^2) of an isotropic point source (W/m^2)."""
    return luminosity / (4.0 * math.pi * (distance * distance))


def number_flux_at_distance(luminosity: float, temperature: float, distance: float) -> float:
    """Graviton flux L / (4 pi d^2) / (2.701 k T) (gravitons m^-2 s^-1)."""
    return flux_at_distance(luminosity, distance) / mean_quantum_energy(temperature)


@dataclass(frozen=True)
class Emission:
    alpha: float | None   # 1/m; None if the material has no friction
    j_E: float            # W m^-3 sr^-1
    j_N: float            # gravitons s^-1 m^-3 sr^-1
    source: str           # "luminosity" or "friction": which rule set j_E


def object_emission(scene: Scene) -> dict[str, Emission]:
    """Emission coefficients of every object's own region, keyed by object id."""
    result = {}
    for obj in scene.objects:
        material = obj.material
        alpha = None if material.friction is None else absorption_coefficient(material.friction)
        if material.luminosity is not None:
            if not obj.own_volume > 0.0:
                raise SceneError(f"object {obj.id!r} has a luminosity but no own region to radiate from")
            j_E = luminosity_energy_emissivity(material.luminosity, obj.own_volume)
            source = "luminosity"
        elif alpha is not None:
            j_E = thermal_energy_emissivity(alpha, material.temperature)
            source = "friction"
        else:
            raise SceneError(f"material {material.name!r} has neither friction nor luminosity")
        result[obj.id] = Emission(alpha=alpha, j_E=j_E, j_N=number_emissivity(j_E, material.temperature), source=source)
    return result


def number_emissivities(scene: Scene) -> np.ndarray:
    """j_N of each object's own region, as an array in scene object order."""
    per_object = object_emission(scene)
    return np.array([per_object[i].j_N for i in scene.ids], dtype=np.float64)


def energy_emissivities(scene: Scene) -> np.ndarray:
    """j_E of each object's own region, as an array in scene object order."""
    per_object = object_emission(scene)
    return np.array([per_object[i].j_E for i in scene.ids], dtype=np.float64)
