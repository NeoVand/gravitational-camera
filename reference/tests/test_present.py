"""The camera sees the present (gravcam/present.py)."""
import math

import numpy as np
import pytest

from gravcam import binary, curvature as cv, present
from gravcam.constants import c


@pytest.mark.parametrize("beta", [0.01, 0.1, 0.3])
def test_uniform_motion_points_at_the_present_position(beta):
    rng = np.random.default_rng(int(beta * 1000))
    for _ in range(3):
        p0 = rng.normal(size=3) * 2                        # where the body is now (pixel at the origin)
        v = rng.normal(size=3)
        v *= beta * c / np.linalg.norm(v)
        E, B = cv.tidal_tensors(cv.riemann(cv.boosted_masses_metric([1e3], [p0], [v]), 0.0, np.zeros(3), 1e-3))
        axis = present.stretch_axis(E)
        assert present.angle_between_lines(axis, p0) < 1e-7
        ret = present.retarded_position(p0, v, np.zeros(3))
        n = -p0 / np.linalg.norm(p0)
        v_perp = np.linalg.norm(v - (v @ n) * n)
        # light shows the retarded position, displaced by about the aberration angle
        assert present.angle_between_lines(axis, ret) == pytest.approx(math.asin(v_perp / c), rel=0.25 + beta)


def test_orbiting_pair_present_to_second_order():
    """Near the pair, the changing field matches Newton at the present positions with error ~ (kr)^2 and at the
    retarded positions with error ~ kr."""
    m, d, r = 1.0, 1.0, 50.0
    x = np.array([r * math.cos(0.4), r * math.sin(0.4), 0.0])
    errs = {}
    for kr in (0.05, 0.1, 0.2):
        pair = binary.Pair(m, d, kr * c / (2 * r))
        ts = np.linspace(0, math.pi / pair.omega, 16, endpoint=False)
        full = np.array([binary.tidal(pair, t, x[None, :])[0][0] for t in ts])
        now = np.array([present.newton_pair(pair, t, x) for t in ts])
        then = np.array([present.newton_pair(pair, t - r / c, x) for t in ts])
        dev = lambda A: A - A.mean(axis=0)
        e_now = np.linalg.norm(dev(full) - dev(now)) / np.linalg.norm(dev(now))
        e_then = np.linalg.norm(dev(full) - dev(then)) / np.linalg.norm(dev(then))
        errs[kr] = (e_now, e_then)
    assert errs[0.1][1] == pytest.approx(0.1, rel=0.05)                     # retarded: off by kr
    assert errs[0.2][1] == pytest.approx(0.2, rel=0.05)
    assert errs[0.1][0] < 0.02 and errs[0.2][0] < 0.05                       # present: second order
    assert errs[0.2][0] / errs[0.1][0] > 2.5                                  # grows faster than kr
