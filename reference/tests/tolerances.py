"""The round-off model behind the geometric tolerances of the tests.

A position at distance D from the origin of a ray is resolved by float64 to
about one spacing ulp(D): 2e-9 m across the Earth, 3e-5 m at 1 AU. Whatever
computes "is this point of the ray inside that sphere" (the package's solver,
a brute-force membership test, a hand formula) therefore misplaces the
sphere's surface radially by a few spacings. The tests allow

    delta = 16 ulp(D + r)

for two such computations taken together.

A radial error delta moves a crossing along the ray by delta * r / hc, where
hc is half the chord of the full line and r / hc = 1 / cos(angle of
incidence); and never by more than sqrt(2 r delta), reached at tangency
(from s^2 = hc^2 + 2 r delta). So per crossing:

    slack = min(2 r delta / hc, sqrt(2 r delta))

(the factor 2 covers hc itself being known only to the same round-off).

Examples: a chord through the centre of a sphere of r = 1.4e8 m at 1.5e11 m:
delta = 5e-4 m, slack 1e-3 m per crossing (4e-12 of the chord). The same
sphere at 0.99 r: 7e-3 m. Passing 1 m inside its limb (chord 33 km): 8 m.
Grazing chords are ill-conditioned in any float64 method.
"""
import numpy as np


def radial_roundoff(scale):
    """delta: joint radial round-off of two float64 computations at range ``scale``."""
    return 16.0 * np.spacing(scale)


def crossing_slack(radius, half_chord, delta):
    """How far round-off ``delta`` can move one crossing along the ray.
    ``half_chord`` may be an array."""
    worst = np.sqrt(2.0 * radius * delta)
    half_chord = np.asarray(half_chord, dtype=np.float64)
    return np.where(half_chord < 4.0 * worst, worst, 2.0 * radius * delta / np.maximum(half_chord, worst))
