"""The cases the site's pixel algebra is tested against (fixtures/pixel.json) match the reference that makes them."""
import json
import math

from gravcam import export_pixel


def _same(a, b):
    if isinstance(a, dict):
        return a.keys() == b.keys() and all(_same(a[k], b[k]) for k in a)
    if isinstance(a, list):
        return len(a) == len(b) and all(_same(x, y) for x, y in zip(a, b))
    if isinstance(a, str):
        return a == b
    return math.isclose(a, b, rel_tol=1e-8, abs_tol=1e-12)


def test_committed_cases_match_a_fresh_build():
    committed = json.loads(export_pixel.OUT.read_text())
    fresh = json.loads(json.dumps(export_pixel.build()))
    for key in ("scenes", "waves", "charges", "four_waves", "light_two_waves", "beyond"):
        assert _same(committed[key], fresh[key]), key
