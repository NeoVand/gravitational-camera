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
