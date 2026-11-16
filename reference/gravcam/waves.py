"""Waves from spinning bodies: what a wave camera sees of a rotor.

A *rotor* is a set of spheres sharing one ``spin`` (scenes/README.md): the
same axis, centre and rate. It turns rigidly at angular speed Omega and, if it
is not symmetric about its axis, radiates at 2 Omega.

Closed forms (Maggiore, Gravitational Waves vol. 1, sec. 3.3, for a binary;
a rigid rotor is the same with mu a^2 replaced by Delta I):

* Delta I = I_1 - I_2, the difference of the two principal second moments of
  the mass in the plane of rotation (for two masses m at distance d,
  m d^2 / 2);
* at distance r and inclination iota (the angle between the angular velocity
  and the direction from the rotor to the observer)

      h_+ = A (1 + cos^2 iota) / 2  cos(2 Omega t),
      h_x = A cos iota              sin(2 Omega t),     A = 4 G Delta I Omega^2 / (c^4 r);

* energy flux F = c^3 / (16 pi G) <dh_+/dt^2 + dh_x/dt^2>, and total power
  P = (32 / 5) G Delta I^2 Omega^6 / c^5;
* wavelength lambda = pi c / Omega.

Polarization is described by the Stokes parameters of the complex amplitudes
H_+ and H_x of the 2 Omega line, in the basis e_1, e_2 of the observer's sky
with e_1 x e_2 along the direction of travel (toward the observer): seen by
the observer, e_1 is to the right and e_2 up. Then

      I = |H_+|^2 + |H_x|^2,    Q = |H_+|^2 - |H_x|^2,    V = -2 Im(H_+^* H_x).

V > 0 means the pattern of stretching turns anticlockwise as the observer sees
it, which is the sense in which the rotor itself appears to turn. For a rotor
V / I = 2 a_+ a_x / (a_+^2 + a_x^2) with a_+ = (1 + cos^2 iota) / 2 and
a_x = cos iota: +1 seen along the axis from the side the angular velocity
points to, 0 seen edge-on (linear polarization, along the projected axis).

``strain_series`` computes h_+ and h_x without any of these formulas: from
the moving point masses it forms the second time derivative of the mass
quadrupole and applies the transverse-traceless projection. The tests compare
the two.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np

from .constants import G, c as C
from .scene import Scene, Sphere


@dataclass(frozen=True)
class Rotor:
    members: tuple[str, ...]
    center: np.ndarray       # a point on the axis, m
    axis: np.ndarray         # unit vector along the angular velocity
    omega: float             # rad/s, not negative
    masses: np.ndarray       # kg, each sphere's mass contrast with its parent
    offsets: np.ndarray      # (n, 3) m, sphere centres relative to ``center`` at t = 0

    @property
    def delta_inertia(self) -> float:
        """I_1 - I_2 (kg m^2) of the mass in the plane of rotation."""
        e1, e2 = perpendicular_pair(self.axis)
        x = self.offsets @ e1
        y = self.offsets @ e2
        mxx = float(np.sum(self.masses * x * x))
        myy = float(np.sum(self.masses * y * y))
        mxy = float(np.sum(self.masses * x * y))
        return math.sqrt((mxx - myy) ** 2 + 4.0 * mxy * mxy)

    def wavelength(self, c: float = C) -> float:
        return math.pi * c / self.omega if self.omega > 0 else math.inf

    def power(self, c: float = C) -> float:
        """Total radiated power, W."""
        return 32.0 / 5.0 * G * self.delta_inertia**2 * self.omega**6 / c**5

    def amplitude(self, distance: float, c: float = C) -> float:
        """A = 4 G Delta I Omega^2 / (c^4 r)."""
        return 4.0 * G * self.delta_inertia * self.omega**2 / (c**4 * distance)


def perpendicular_pair(u) -> tuple[np.ndarray, np.ndarray]:
    """Unit vectors (e1, e2) with e1 x e2 = u: e1 is the coordinate axis least
    aligned with u, made orthogonal to it."""
    u = np.asarray(u, dtype=np.float64)
    k = int(np.argmin(np.abs(u)))
    e1 = np.zeros(3)
    e1[k] = 1.0
    e1 = e1 - (e1 @ u) * u
    e1 /= np.linalg.norm(e1)
    return e1, np.cross(u, e1)


def rotors(scene: Scene) -> list[Rotor]:
    """The scene's rotors: spinning spheres grouped by their spin. Spheres
    whose rate is zero are still and are left out."""
    groups: dict[tuple, list] = {}
    for obj in scene.objects:
        if obj.spin is None or obj.spin.rate == 0:
            continue
        key = (obj.spin.center, obj.spin.axis, obj.spin.rate)
        groups.setdefault(key, []).append(obj)
    out = []
    for (center, axis, rate), members in groups.items():
        masses, offsets = [], []
        for obj in members:
            assert isinstance(obj.shape, Sphere)
            parent = scene[obj.parent].material.density if obj.parent else 0.0
            masses.append((obj.material.density - parent) * obj.shape.volume)
            offsets.append(np.subtract(obj.shape.center, center))
        spin = members[0].spin
        out.append(Rotor(members=tuple(o.id for o in members), center=np.array(center, dtype=np.float64),
                         axis=np.array(spin.angular_direction), omega=spin.omega,
                         masses=np.array(masses), offsets=np.array(offsets)))
    return out


def polarization(cos_iota: float) -> dict:
    """Relative amplitudes and Stokes parameters for unit A."""
    a_plus = 0.5 * (1.0 + cos_iota * cos_iota)
    a_cross = cos_iota
    intensity = a_plus * a_plus + a_cross * a_cross
    return {
        "a_plus": a_plus,
        "a_cross": a_cross,
        "I": intensity,
        "Q": a_plus * a_plus - a_cross * a_cross,
        "V": 2.0 * a_plus * a_cross,
        "circular": 2.0 * a_plus * a_cross / intensity,
    }


def seen_from(rotor: Rotor, observer, c: float = C) -> dict:
    """What an observer at ``observer`` receives from the rotor."""
    toward = np.asarray(observer, dtype=np.float64) - rotor.center
    distance = float(np.linalg.norm(toward))
    n = toward / distance
    cos_iota = float(rotor.axis @ n)
    pol = polarization(cos_iota)
    amplitude = rotor.amplitude(distance, c)
    flux = c**3 / (16.0 * math.pi * G) * (2.0 * rotor.omega) ** 2 * amplitude**2 * pol["I"] / 2.0
    return {"distance": distance, "direction": n, "cos_iota": cos_iota, "amplitude": amplitude,
            "flux": flux, **pol}


def strain_series(rotor: Rotor, observer, times, c: float = C):
    """h_+ and h_x at the observer, by brute force: the second derivative of the
    mass quadrupole of the moving point masses, projected transverse-traceless.
    Retardation is a fixed delay and is left out. Returns (h_plus, h_cross,
    e1, e2) with e1, e2 the sky basis described in the module docstring."""
    toward = np.asarray(observer, dtype=np.float64) - rotor.center
    distance = float(np.linalg.norm(toward))
    n = toward / distance
    e1, e2 = perpendicular_pair(n)
    w = rotor.omega * rotor.axis
    P = np.eye(3) - np.outer(n, n)
    h_plus, h_cross = [], []
    for t in np.atleast_1d(times):
        angle = rotor.omega * t
        # Rodrigues: positions, then velocity w x x and acceleration w x (w x x)
        k = rotor.axis
        x = (rotor.offsets * math.cos(angle) + np.cross(k, rotor.offsets) * math.sin(angle)
             + np.outer(rotor.offsets @ k, k) * (1 - math.cos(angle)))
        v = np.cross(w, x)
        a = np.cross(w, v)
        q2 = np.zeros((3, 3))
        for m, xi, vi, ai in zip(rotor.masses, x, v, a):
            q2 += m * (np.outer(ai, xi) + 2.0 * np.outer(vi, vi) + np.outer(xi, ai))
        q2 -= np.trace(q2) / 3.0 * np.eye(3)
        projected = P @ q2 @ P
        tt = projected - 0.5 * P * np.trace(projected)
        h = 2.0 * G / (c**4 * distance) * tt
        h_plus.append(0.5 * (e1 @ h @ e1 - e2 @ h @ e2))
        h_cross.append(e1 @ h @ e2)
    return np.array(h_plus), np.array(h_cross), e1, e2


def stokes_from_series(h_plus, h_cross, times, omega):
    """Stokes parameters of the 2 Omega line in sampled series covering whole periods."""
    phase = np.exp(-2j * omega * np.asarray(times))
    big_plus = 2.0 * np.mean(h_plus * phase)
    big_cross = 2.0 * np.mean(h_cross * phase)
    return {
        "I": abs(big_plus) ** 2 + abs(big_cross) ** 2,
        "Q": abs(big_plus) ** 2 - abs(big_cross) ** 2,
        "U": 2.0 * float(np.real(np.conj(big_plus) * big_cross)),
        "V": -2.0 * float(np.imag(np.conj(big_plus) * big_cross)),
    }
