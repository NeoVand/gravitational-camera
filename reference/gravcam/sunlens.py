"""The transparent Sun as a lens for gravitational waves.

Waves short enough for geometric optics (the Fresnel scale sqrt(lambda D) much
smaller than the Sun, true for thermal gravitons) pass through the Sun and are
bent by the mass inside the cylinder of their impact parameter b:

    alpha(b) = 4 G M_cyl(b) / (c^2 b),

with M_cyl(b) = int_0^b 2 pi b' Sigma(b') db' and Sigma the column density.
Outside the Sun this is the familiar 1.75 arcseconds times R / b. Inside, the
bending first grows as the enclosed column rises faster than b, then falls to
zero at the centre, and rays at b focus a distance F(b) = b / alpha(b) behind
the Sun. The shortest focus is that of the central rays,
F(0) = c^2 / (4 pi G Sigma(0)).

The Sun here is Eddington's standard model, a polytrope of index 3, with the
solar mass and radius. Its centre (76 g/cm^3) is half as dense as that of the
standard solar model (150 g/cm^3), so its focal distances are longer than
those Patla and Nemiroff (2008) found from the standard model.
"""
from __future__ import annotations

import math

import numpy as np
from scipy.integrate import quad, solve_ivp

from .constants import G, M_sun, c

R_sun = 6.957e8                 # m, IAU nominal solar radius
INDEX = 3.0


def _lane_emden(n: float = INDEX):
    x0 = 1e-6

    def rhs(x, y):
        return [y[1], -np.clip(y[0], 0, None) ** n - 2.0 * y[1] / x]

    surface = lambda x, y: y[0]  # noqa: E731
    surface.terminal = True
    sol = solve_ivp(rhs, [x0, 20.0], [1.0 - x0 * x0 / 6.0, -x0 / 3.0], dense_output=True,
                    rtol=1e-11, atol=1e-13, events=surface)
    return sol, float(sol.t_events[0][0])


_SOL, XI1 = _lane_emden()
DTHETA1 = float(_SOL.sol(XI1)[1])
RHO_CENTRE = M_sun / (4.0 / 3.0 * math.pi * R_sun ** 3) * XI1 / (3.0 * -DTHETA1)


def density(r):
    """kg/m^3 at radius r (m)."""
    r = np.asarray(r, dtype=np.float64)
    x = np.clip(r / R_sun * XI1, 1e-6, XI1)
    theta = np.clip(_SOL.sol(x)[0], 0.0, None)
    return np.where(r < R_sun, RHO_CENTRE * theta ** INDEX, 0.0)


def column(b: float) -> float:
    """Column density through the Sun at impact parameter b, kg/m^2."""
    if b >= R_sun:
        return 0.0
    half = math.sqrt(R_sun * R_sun - b * b)
    return 2.0 * quad(lambda z: float(density(math.hypot(b, z))), 0.0, half, limit=200)[0]


def cylinder_mass(b: float) -> float:
    """Mass within the cylinder of radius b about the line of sight, kg."""
    b = min(b, R_sun)
    return quad(lambda s: 2.0 * math.pi * s * column(s), 0.0, b, limit=200)[0]


def deflection(b: float) -> float:
    """Bending angle at impact parameter b, radians."""
    mass = M_sun if b >= R_sun else cylinder_mass(b)
    return 4.0 * G * mass / (c * c * b)


def focal_distance(b: float) -> float:
    """How far behind the Sun the rays at impact parameter b cross the axis, m."""
    if b <= 0:
        return c * c / (4.0 * math.pi * G * column(0.0))
    return b / deflection(b)


def diffraction_frequency(mass: float = M_sun) -> float:
    """The frequency below which diffraction erases the focus of a lens of this
    mass, whatever its size: w = 8 pi G M f / c^3 = 1, 8.1 kHz for the Sun.
    A lens delays the wave by about 4 G M / c^3; it focuses only if that
    delay spans a radian of the wave's phase."""
    return c ** 3 / (8.0 * math.pi * G * mass)


def point_mass_axis_gain(frequency: float, mass: float = M_sun) -> float:
    """|F|^2 on the axis behind a point mass, in wave optics: pi w / (1 - exp(-pi w))
    with w = 8 pi G M f / c^3. It tends to 1 + pi w / 2 for small w and to pi w,
    the geometric focus growing with frequency, for large w. A transparent
    lens, whose focusing mass is only the part inside the ray, gains less."""
    w = 8.0 * math.pi * G * mass * frequency / c ** 3
    return math.pi * w / -math.expm1(-math.pi * w)
