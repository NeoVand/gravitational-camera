"""The transparent Sun as a lens in wave optics: the method against closed forms, and its two limits."""
import math

from gravcam.sunlens import focal_distance, point_mass_axis_gain
from gravcam.sunwave import AU, axis_amplitude, axis_gain, geometric_axis_gain


def test_the_split_integrals_give_the_point_mass_closed_form():
    for f in (10.0, 1e3, 1e5):
        assert math.isclose(abs(axis_amplitude(f, AU, mass_profile=False)) ** 2, point_mass_axis_gain(f), rel_tol=1e-9)


def test_long_waves_see_only_the_suns_whole_mass():
    assert math.isclose(axis_gain(10.0, 20 * AU), point_mass_axis_gain(10.0), rel_tol=1e-4)


def test_short_waves_nearer_than_the_focus_see_the_central_ray():
    assert focal_distance(0.0) > 33 * AU
    assert math.isclose(axis_gain(1e6, 20 * AU), geometric_axis_gain(20 * AU), rel_tol=0.01)
    assert math.isclose(axis_gain(1e5, AU), geometric_axis_gain(AU), rel_tol=1e-3)


def test_beyond_the_focus_the_gain_grows_with_frequency():
    g5, g6 = axis_gain(1e5, 50 * AU), axis_gain(1e6, 50 * AU)
    assert 8.5 < g6 / g5 < 12
    assert 1.0 < g6 / point_mass_axis_gain(1e6) < 1.4


def test_at_the_earth_the_central_focusing_is_reached_only_in_part_below_ten_kilohertz():
    """Section XI: on Earth's orbit the Sun gives 27% of the central ray's geometric gain at 100 Hz, 88% at 1 kHz
    and all of it at 10 kHz; the gain itself is never more than six per cent."""
    geometric = geometric_axis_gain(AU) - 1.0
    assert 0.06 < geometric < 0.065
    share = {f: (axis_gain(f, AU) - 1.0) / geometric for f in (100.0, 1e3, 1e4)}
    assert round(100 * share[100.0]) == 27
    assert round(100 * share[1e3]) == 88
    assert 0.995 < share[1e4] < 1.001
