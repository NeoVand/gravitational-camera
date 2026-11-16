"""Brute-force line integrals for the tests. Nothing here uses gravcam.

The scene is read straight from the JSON. A point is classified by the
smallest sphere that contains it, which for nested, non-overlapping spheres
is the innermost object (and is a different rule from the tree depth the
package uses). The integrand along a ray is then sampled:

* ``dense``: a plain midpoint Riemann sum with ``n_dense`` cells. For a
  piecewise-constant integrand each discontinuity is misplaced by at most
  half a cell, so the error is rigorously bounded by
  h * sum over spheres of |jump across that sphere's surface|
  (two crossings per sphere, h/2 each). No assumption about the ray.

* ``refined``: the cell edges of a coarser grid are sampled and every cell
  whose two edges carry different labels is subdivided again and again until
  it is a few float64 spacings wide. This locates each boundary to round-off.
  It could only miss a feature that hides entirely inside one coarse cell
  with equal labels at both edges; the dense sum bounds that case.

The only geometric knowledge used is a bounding test for a ball and a line:
a point of the ray can lie in a ball of radius r only if the line passes the
centre within r, and then only if its distance along the ray from the point
of closest approach to the centre is at most r. Sampling is confined to those
intervals; a coarse scan of the whole ray confirms that nothing lies outside.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np


@dataclass
class Quadrature:
    dense: np.ndarray          # midpoint sums, one entry per integrated quantity
    dense_bound: np.ndarray    # rigorous error bound of ``dense``
    refined: np.ndarray        # boundary-refined sums
    jumps: list = field(default_factory=list)   # ray distances where the label changes
    resolution: float = 0.0    # widest cell left unresolved by the refinement
    h: float = 0.0             # widest dense cell


def _refine(label_fn, table, a, b, label_a, label_b, fan, out, depth=0):
    width = b - a
    if depth >= 12 or width <= 8.0 * np.spacing(max(abs(a), abs(b))):
        out.jumps.append(0.5 * (a + b))
        out.resolution = max(out.resolution, width)
        return 0.5 * (table[label_a] + table[label_b]) * width
    t = np.linspace(a, b, fan + 1)
    labels = label_fn(t)
    labels[0], labels[-1] = label_a, label_b
    total = np.zeros(table.shape[1])
    for i in range(fan):
        if labels[i] == labels[i + 1]:
            total += table[labels[i]] * (t[i + 1] - t[i])
        else:
            total += _refine(label_fn, table, t[i], t[i + 1], labels[i], labels[i + 1], fan, out, depth + 1)
    return total


def integrate_labels(label_fn, table, lo, hi, out, n_dense=1 << 20, n_coarse=1 << 14, fan=64, chunk=1 << 18):
    """Add the integral over [lo, hi] of table[label(t)] to ``out``.

    ``label_fn`` maps an array of ray distances to integer labels;
    ``table`` has one row of values per label.
    """
    n_labels = table.shape[0]
    h = (hi - lo) / n_dense
    counts = np.zeros(n_labels)
    for start in range(0, n_dense, chunk):
        k = np.arange(start, min(start + chunk, n_dense))
        counts += np.bincount(label_fn(lo + (k + 0.5) * h), minlength=n_labels)
    out.dense += (counts @ table) * h
    out.h = max(out.h, h)

    t = np.linspace(lo, hi, n_coarse + 1)
    labels = label_fn(t)
    widths = np.diff(t)
    same = labels[:-1] == labels[1:]
    out.refined += np.bincount(labels[:-1][same], weights=widths[same], minlength=n_labels) @ table
    for i in np.nonzero(~same)[0]:
        out.refined += _refine(label_fn, table, t[i], t[i + 1], labels[i], labels[i + 1], fan, out)
    return h


class BruteScene:
    """Spheres with a per-sphere parent, read without gravcam."""

    def __init__(self, ids, centers, radii, parents, observer=None):
        self.ids = list(ids)
        self.centers = np.array(centers, dtype=np.float64).reshape(-1, 3)
        self.radii = np.array(radii, dtype=np.float64)
        self.parents = list(parents)
        self.observer = None if observer is None else np.array(observer, dtype=np.float64)

    @classmethod
    def from_file(cls, path):
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        objects = data["objects"]
        return cls(
            ids=[o["id"] for o in objects],
            centers=[o["shape"]["center"] for o in objects],
            radii=[o["shape"]["radius"] for o in objects],
            parents=[o.get("parent") for o in objects],
            observer=data["observer"]["position"],
        )

    @classmethod
    def single_sphere(cls, center, radius):
        return cls(ids=["sphere"], centers=[center], radii=[radius], parents=[None])

    def labels(self, points):
        """0 in vacuum, k + 1 inside object k's own region (smallest containing sphere)."""
        offset = points[:, None, :] - self.centers[None, :, :]
        inside = np.einsum("nkc,nkc->nk", offset, offset) <= self.radii**2
        size = np.where(inside, self.radii, np.inf)
        smallest = size.argmin(axis=1)
        return np.where(inside.any(axis=1), smallest + 1, 0)

    def spans(self, origin, direction, prune=True):
        """Per sphere, the interval of the ray outside which the ray is
        certainly outside that sphere, or None if the ray certainly misses it:
        the sphere lies behind the origin or, with ``prune``, the line passes
        the centre at more than the radius."""
        oc = self.centers - origin
        tca = oc @ direction
        p = np.linalg.norm(oc - tca[:, None] * direction, axis=1)
        pad = 1e-6 * self.radii                       # generous cover for round-off in tca and p
        spans = []
        for k in range(len(self.ids)):
            lo, hi = tca[k] - self.radii[k] - pad[k], tca[k] + self.radii[k] + pad[k]
            misses = hi <= 0.0 or (prune and p[k] > self.radii[k] + pad[k])
            spans.append(None if misses else (max(lo, 0.0), hi))
        return spans

    def windows(self, origin, direction, prune=True):
        """The spans merged into disjoint intervals, each with the indices of
        the spheres whose surfaces can be crossed inside it."""
        spans = self.spans(origin, direction, prune)
        merged = []
        for lo, hi, k in sorted((span[0], span[1], k) for k, span in enumerate(spans) if span is not None):
            if merged and lo <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], hi)
                merged[-1][2].append(k)
            else:
                merged.append([lo, hi, [k]])
        return merged

    def assert_vacuum_outside(self, label_fn, origin, windows, n=200_000):
        """Safety net for the windows: sample the whole ray, from 1 mm out to
        beyond the farthest sphere, uniformly and logarithmically; every
        sample that is not vacuum must lie inside a window."""
        reach = 1.01 * float(np.max(np.linalg.norm(self.centers - origin, axis=1) + self.radii))
        t = np.concatenate([np.linspace(0.0, reach, n), np.geomspace(1e-3, reach, n)])
        covered = np.zeros(t.shape, dtype=bool)
        for lo, hi, _ in windows:
            covered |= (t >= lo) & (t <= hi)
        assert not np.any(label_fn(t[~covered])), "matter found outside the bounding windows"

    def integrate(self, values, direction, origin=None, prune=True, **options) -> Quadrature:
        """Integrate per-object ``values`` (shape (K,) or (K, m)) along a ray.
        With ``prune=False`` every sphere ahead of the origin is sampled, even
        if the line clearly passes it by."""
        origin = self.observer if origin is None else np.asarray(origin, dtype=np.float64)
        direction = np.asarray(direction, dtype=np.float64)
        direction = direction / np.linalg.norm(direction)
        values = np.asarray(values, dtype=np.float64).reshape(len(self.ids), -1)
        table = np.vstack([np.zeros((1, values.shape[1])), values])

        def label_fn(t):
            return self.labels(origin + t[:, None] * direction)

        out = Quadrature(dense=np.zeros(values.shape[1]), dense_bound=np.zeros(values.shape[1]),
                         refined=np.zeros(values.shape[1]))
        windows = self.windows(origin, direction, prune)
        self.assert_vacuum_outside(label_fn, origin, windows)
        for lo, hi, members in windows:
            h = integrate_labels(label_fn, table, lo, hi, out, **options)
            # |jump| across the surface of each sphere that can be crossed here:
            # its own value minus its parent's.
            for k in members:
                parent = self.parents[k]
                outside = 0.0 if parent is None else values[self.ids.index(parent)]
                out.dense_bound += h * np.abs(values[k] - outside)
        return out
