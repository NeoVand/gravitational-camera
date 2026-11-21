"""The numbers behind the drawn figures (gravcam/figure_data.py): the changing part of a turning pair's field, taken
alone so that the curvature's finite differences are not swamped by the static potential of its mass."""
import math

import numpy as np
import pytest

from gravcam import binary, figure_data, pixel

PAIR = binary.Pair(1.0, 1.0, 1.0e6)
LAMR = PAIR.wavelength / (2 * math.pi)
OMEGA = 2 * PAIR.omega


def _readings(pair, iota, kr, N=16):
    x = kr * LAMR * np.array([math.sin(iota), 0.0, math.cos(iota)])
    ts = np.linspace(0, 2 * math.pi / OMEGA, N, endpoint=False)
    Ws = []
    for t in ts:
        E, B = binary.tidal(pair, t, x[None, :])
        Ws.append(pixel.weyl(E[0], B[0]))
    return ts, np.array(Ws)


def test_the_changing_part_is_the_full_field_less_its_mean():
    # close in, where the static part spoils the full field's differences least (1e-6 here, 1e-5 at kr = 3)
    _, full = _readings(PAIR, math.radians(50), 1)
    _, changing = _readings(figure_data._changing_part(PAIR), math.radians(50), 1)
    scale = np.abs(changing).max()
    assert np.abs(changing.mean(axis=0)).max() < 1e-10 * scale
    assert np.allclose(full - full.mean(axis=0), changing, atol=1e-5 * scale)


@pytest.mark.parametrize("iota_deg, tolerance", [(35, 3e-3), (70, 5e-4)])
def test_range_from_the_frequency_parts_converges(iota_deg, tolerance):
    """kr read from W_+ and W_- over the true kr approaches 1 as the next order dies away, as 1/(kr)^2, without the
    scatter of a per cent that the static potential left in the full field's differences at kr near 100."""
    pair = figure_data._changing_part(PAIR)
    ratios = []
    for kr in (45, 68, 100):
        ts, Ws = _readings(pair, math.radians(iota_deg), kr)
        Wp, Wm = pixel.frequency_parts(ts, Ws, OMEGA)
        ratios.append(pixel.range_from_frequency_parts(Wp, Wm) / kr)
    excess = np.array(ratios) - 1
    assert np.all(excess > 0) and np.all(np.diff(excess) < 0)
    assert excess[-1] < tolerance
    # the departure falls as 1/(kr)^2
    assert excess[0] / excess[-1] == pytest.approx((100 / 45) ** 2, rel=0.1)


# --- the figures of the exterior response (Section XII) and of the near field's geometry (Section IV) ----------------


def test_ladder_figure_two_bodies_alike_under_degree_two_and_one_to_two_under_degree_three():
    d = figure_data.ladder()
    assert d["bodies"] == [[[1.0, 1 / math.sqrt(2)]], [[0.5, 0.0], [0.5, 1.0]]]
    two, three = d["tides"]
    assert (two["degree"], three["degree"]) == (2, 3)
    assert two["gain"] == pytest.approx([1 / 3, 1 / 3], rel=1e-12)             # in units of M R^2
    assert three["gain"] == pytest.approx([2 / 15, 4 / 15], rel=1e-12)         # in units of M R^4
    # the impulse at the angle t on the unit circle is (cos (n - 1) t, -sin (n - 1) t)
    for tide in d["tides"]:
        t = np.radians(tide["angle_deg"])
        n = tide["degree"]
        assert np.allclose(tide["kick"], np.stack([np.cos((n - 1) * t), -np.sin((n - 1) * t)], axis=1), atol=1e-12)


def test_ladder_figure_beads_are_the_polynomials_reached():
    """2L + 1 beads of each degree L on each floor j < m make, at each degree d = L + 2j, the number of polynomials
    with Lap^m P = 0."""
    d = figure_data.ladder()
    for m, dims in d["dimension"].items():
        for degree, dim in enumerate(dims):
            beads = sum(2 * (degree - 2 * j) + 1 for j in range(int(m)) if degree - 2 * j >= 0)
            assert beads == dim


def test_two_readings_figure_pair_on_the_outline_reads_a_point_inside_the_cone():
    d = figure_data.two_readings()
    k, kp, K = (np.array(d[name]) for name in ("k", "kp", "K"))
    assert np.allclose(k + kp, K) and np.linalg.norm(k) + np.linalg.norm(kp) == pytest.approx(d["kap"], rel=1e-12)
    assert np.linalg.norm(K) < d["kap"] < 1.0                                  # inside the cone that is drawn
    # each of the pair lies on a generator at which the cone turns away from the reader: tan(tilt) from the middle
    tilt, turn = (math.radians(d[name]) for name in ("tilt_deg", "turn_deg"))
    toward = np.array([math.cos(math.pi / 2 + turn), math.sin(math.pi / 2 + turn)])
    for v in (k, kp):
        assert v @ toward / np.linalg.norm(v) == pytest.approx(math.tan(tilt), rel=1e-12)
    # every point of the ellipse is a pair with the same sum, and every pair reads the same value of the transform
    for q in d["ellipse"] + d["others"]:
        q = np.array(q)
        assert np.linalg.norm(q) + np.linalg.norm(K - q) == pytest.approx(d["kap"], rel=1e-12)
    assert d["disagreement"] < 1e-12
    assert d["symbol"] == pytest.approx(0.5 * (d["kap"] ** 2 - K @ K), rel=1e-12) and d["symbol"] > 0


def test_hidden_flow_figure_parts_cancel_for_degree_two_and_not_for_degree_three():
    d = figure_data.hidden_flow()
    u = d["inner_radius"]
    assert u**5 == pytest.approx(0.5, rel=1e-12)
    assert d["spin"] == pytest.approx([0.2, -0.2], rel=1e-10)                  # in units of M Omega R^2
    assert d["quadrupolar"] == pytest.approx([-0.4, 0.4], rel=1e-10)
    # the integrand over the radius is -c_n Omega(r) r^(2n), c_3 = 32/5
    assert d["octupolar"] == pytest.approx([-(32 / 35) * u**7, (32 / 35) * (1 - u**7)], rel=1e-10)
    assert sum(d["octupolar"]) == pytest.approx(d["bracket"], rel=1e-12)
    assert f"{d['bracket']:.3f}" == "0.221"


def test_near_field_geometry_figure_cells_of_one_size_and_patterns_as_wide_as_deep():
    d = figure_data.near_field_geometry()
    assert d["tops"] == pytest.approx([d["pitch"] * 2**n for n in range(4)])
    assert d["cell_areas"] == pytest.approx([0.5] * 4, rel=1e-12)
    assert d["width_at_half_height"] == pytest.approx(1.0014, abs=1e-4)
    row = np.array(d["row"])
    for (place, depth), recorded in zip(d["masses"], d["recorded"]):
        recorded = np.array(recorded)
        assert recorded.max() == pytest.approx(1.0) and row[recorded.argmax()] == pytest.approx(place)
        above = row[recorded > 0.5]
        assert above[-1] - above[0] == pytest.approx(d["width_at_half_height"] * depth, abs=2 * (row[1] - row[0]))
        # it changes sign sqrt 2 of the depth to either side, and beyond is small
        positive = row[recorded > 0]
        if place - math.sqrt(2) * depth > row[0]:
            assert positive[0] == pytest.approx(place - math.sqrt(2) * depth, abs=row[1] - row[0])
        assert recorded.min() > -0.018
