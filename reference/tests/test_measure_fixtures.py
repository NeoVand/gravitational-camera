"""The blocks the site's simulated exposures are tested against: the counts a thermal view expects
(export_fixtures.count_block) and the noise of a near-field reconstruction (export_fixtures.build_noise_fixture),
present, current, and consistent with what does not go through them."""
import json
import math

import numpy as np
import pytest

from gravcam import columns, emission, export_fixtures, resolution
from gravcam.scene import load_scene

REGENERATE = "run `python -m gravcam.export_fixtures` from reference/ to regenerate the fixtures"
NOISE_PATH = export_fixtures.DEFAULT_OUT_DIR / export_fixtures.NOISE_FIXTURE
SCENES = export_fixtures.SCENES_DIR


def test_noise_fixture_is_what_the_exporter_writes_now():
    assert NOISE_PATH.exists(), REGENERATE
    committed = json.loads(NOISE_PATH.read_text(encoding="utf-8"))
    assert committed == json.loads(json.dumps(export_fixtures.build_noise_fixture())), REGENERATE


@pytest.mark.parametrize("row", json.loads(NOISE_PATH.read_text(encoding="utf-8"))["rows"],
                         ids=lambda r: f"1e{r['snr_decades']}")
def test_noise_lives_in_a_band_at_the_cutoff(row):
    """Where H falls through a half the noise's spectrum H (1 - H) peaks at a quarter, and it is narrow: so its
    variance, (1 / 2 pi) int H (1 - H) q dq, is close to q_c / 4 pi (the band about a unit wide in q), while a
    point's image peaks at (1 / 2 pi) int H q dq, close to q_c^2 / 4 pi."""
    qc = row["q_c"]
    assert row["spectrum"][row["q"].index(qc)] == pytest.approx(0.25, rel=1e-6)
    assert row["variance"] == pytest.approx(qc / (4 * math.pi), rel=0.15)
    assert row["peak"] == pytest.approx(qc * qc / (4 * math.pi), rel=0.15)
    # far from the cutoff, almost nothing: the noise is no white noise
    assert row["spectrum"][0] < 1e-3 and row["spectrum"][-1] < 1e-3


def test_noise_integrals_converge():
    """The trapezoid grid of resolution.py is fine enough: halving its step changes the variance by under 1e-6."""
    snr = 1e20
    q = np.linspace(0.0, resolution.cutoff(snr) + 40.0, 2 * 64 * int(resolution.cutoff(snr) + 40.0) + 1)
    h = resolution.transfer(q, snr)
    fine = np.trapezoid(h * (1 - h) * q, q) / (2 * math.pi)
    row = next(r for r in export_fixtures.build_noise_fixture()["rows"] if r["snr_decades"] == 20)
    assert fine == pytest.approx(row["variance"], rel=1e-6)


def test_the_suns_core_is_counted_whole_at_the_flux_of_its_luminosity():
    scene = load_scene(SCENES / "sun-at-midnight.scene.json")
    direction, tan_x, tan_y = export_fixtures.COUNT_VIEWS["sun-at-midnight"]
    block = export_fixtures.count_block(scene, direction, tan_x, tan_y)
    assert "sun-core" in block["points"]
    core = scene["sun-core"]
    distance = math.dist(core.shape.center, scene.observer)
    flux = emission.number_flux_at_distance(core.material.luminosity, core.material.temperature, distance)
    # the element that holds the core: the ball's integral of dV / r^2 is V / D^2 to 1e-6 at this size
    assert max(max(row) for row in block["rate"]) == pytest.approx(flux, rel=1e-5)


@pytest.mark.parametrize("name", ["closed-furnace", "honey-and-water"])
def test_counts_add_up_to_a_finer_sampling(name):
    """Three rays along an element's side are enough: nine give the same total to within two per cent."""
    scene = load_scene(SCENES / f"{name}.scene.json")
    direction, tan_x, tan_y = export_fixtures.COUNT_VIEWS[name]
    coarse = export_fixtures.count_block(scene, direction, tan_x, tan_y)
    fine = export_fixtures.count_block(scene, direction, tan_x, tan_y, samples=9)
    total = lambda b: sum(map(sum, b["rate"]))
    assert total(coarse) == pytest.approx(total(fine), rel=0.02)


def test_a_count_element_is_the_number_radiance_times_its_solid_angle():
    """A single element sampled by one ray is N times its solid angle, from columns.number_radiance directly."""
    scene = load_scene(SCENES / "closed-furnace.scene.json")
    direction, tan_x, tan_y = export_fixtures.COUNT_VIEWS["closed-furnace"]
    block = export_fixtures.count_block(scene, direction, tan_x, tan_y, cells=(1, 1), samples=1)
    forward = np.array(block["view"]["forward"])
    radiance = float(columns.number_radiance(scene, forward[None, :])[0])
    solid = (2 * tan_x) * (2 * tan_y)
    assert block["rate"][0][0] == pytest.approx(radiance * solid, rel=1e-9)
