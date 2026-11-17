"""The cases the site's pixel algebra is tested against (fixtures/pixel.json) match the reference that makes them."""
import json
import math

from gravcam import export_pixel


def _same_stars(a, b):
    """Stars as a set of unit vectors. Where two coincide (type D) they are double roots, fixed only to about the
    square root of the rounding error, so their last digits depend on the numerical library: compare to 1e-6."""
    return len(a) == len(b) and all(min(math.dist(x, y) for y in b) < 1e-6 for x in a)


def _same(a, b):
    if isinstance(a, dict):
        return a.keys() == b.keys() and all(
            _same_stars(a[k], b[k]) if k == "stars" else _same(a[k], b[k]) for k in a
        )
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
