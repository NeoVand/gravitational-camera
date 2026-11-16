"""Hand calculations for the tests, written without gravcam.

Literal constants and algebraically reduced formulas, so that an error in
``gravcam.constants`` or ``gravcam.emission`` cannot cancel out of a test.
"""
import math

G = 6.67430e-11
C = 299792458.0
KB = 1.380649e-23
SIGMA = 5.670374419e-8
AU = 1.495978707e11
M_SUN = 1.98847e30


def alpha(eta):
    """16 pi G eta / c^3."""
    return 16.0 * math.pi * G * eta / (C * C * C)


def j_E_thermal(temperature, eta):
    """alpha sigma T^4 / pi with the pi cancelled: 16 G eta sigma T^4 / c^3."""
    return 16.0 * G * eta * SIGMA * temperature**4 / C**3


def j_N_thermal(temperature, eta):
    """j_E / (2.701 k T) reduced to 16 G eta sigma T^3 / (2.701 k c^3)."""
    return 16.0 * G * eta * SIGMA * temperature**3 / (2.701 * KB * C**3)


def ball_volume(radius):
    return 4.0 * math.pi * radius**3 / 3.0


def radius_of(raw_scene, object_id):
    return float(_object(raw_scene, object_id)["shape"]["radius"])


def center_of(raw_scene, object_id):
    return [float(v) for v in _object(raw_scene, object_id)["shape"]["center"]]


def material_of(raw_scene, object_id):
    return raw_scene["materials"][_object(raw_scene, object_id)["material"]]


def _object(raw_scene, object_id):
    return next(o for o in raw_scene["objects"] if o["id"] == object_id)
