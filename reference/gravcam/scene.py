"""Scene loading: materials, the parent/child tree and own-region volumes.

Implements the scene format of ``scenes/README.md``, v0 with the additions of
v1: shapes are spheres or axis-aligned boxes, in any mixture and nesting. An
object's *own region* is its shape minus its children; a point belongs to the
innermost (deepest in the tree) object whose shape contains it.

Choices where the contract is silent (all raise :class:`SceneError` rather
than guess):

* a child must lie entirely inside its parent (the contract says it does);
* objects with the same parent (and root objects among themselves) must not
  overlap, so that "innermost object containing a point" is unique. They may
  touch: a safe stands on the floor, a spherical tank touches it at a point;
* ``density`` and ``temperature`` are required for every material;
* ``observer.exclusion`` must be positive (the tidal column diverges
  logarithmically at the observer if it sits in matter) and ``environment``
  must be one of the two values the contract names.

"Inside" and "overlap" for mixed shapes are the exact geometric statements:
a box is inside a sphere if its farthest corner is, a sphere is inside a box
if it fits between each pair of faces, and a sphere overlaps a box if the
point of the box nearest to its centre is closer than its radius.

Points exactly on a surface count as inside (``distance <= radius``, and
``low <= coordinate <= high`` for a box); surfaces have zero measure, so no
integral depends on this.
"""
from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

import numpy as np

# Relative slack for the containment / overlap checks, so that shapes that
# touch within rounding are accepted.
_GEOMETRY_RTOL = 1e-12

DEFAULT_EXCLUSION = 0.25                  # m, observer.exclusion when the scene gives none
ENVIRONMENTS = ("night-sky", "room")      # the first is the default


class SceneError(ValueError):
    """The scene file does not satisfy the scene contract."""


@dataclass(frozen=True)
class Material:
    name: str
    density: float                    # kg/m^3
    temperature: float                # K
    friction: float | None = None     # Pa s (effective shear viscosity)
    luminosity: float | None = None   # W (total graviton power of an object)
    light: dict | None = None         # appearance to an ordinary camera


@dataclass(frozen=True)
class Sphere:
    center: tuple[float, float, float]   # m
    radius: float                        # m

    @property
    def volume(self) -> float:
        r = self.radius
        return 4.0 / 3.0 * math.pi * (r * r * r)


@dataclass(frozen=True)
class Box:
    """Axis-aligned box. ``low`` and ``high`` are its two extreme corners."""
    center: tuple[float, float, float]   # m
    size: tuple[float, float, float]     # m, full edge lengths along x, y, z

    @property
    def half_size(self) -> tuple[float, float, float]:
        return (0.5 * self.size[0], 0.5 * self.size[1], 0.5 * self.size[2])

    @property
    def low(self) -> tuple[float, float, float]:
        h = self.half_size
        return (self.center[0] - h[0], self.center[1] - h[1], self.center[2] - h[2])

    @property
    def high(self) -> tuple[float, float, float]:
        h = self.half_size
        return (self.center[0] + h[0], self.center[1] + h[1], self.center[2] + h[2])

    @property
    def volume(self) -> float:
        return self.size[0] * self.size[1] * self.size[2]


Shape = Sphere | Box


@dataclass(frozen=True)
class SceneObject:
    id: str
    shape: Shape
    material: Material
    parent: str | None
    children: tuple[str, ...]
    depth: int            # 0 for a root object, parent's depth + 1 otherwise
    own_volume: float     # m^3: shape volume minus the children's shape volumes
    background: bool = False   # part of the empty room, which a view may subtract


class Scene:
    """A loaded scene. Objects keep the order of the scene file."""

    def __init__(self, name, observer, objects, materials, source=None,
                 exclusion=DEFAULT_EXCLUSION, environment=ENVIRONMENTS[0]):
        self.name = name
        self.observer = np.asarray(observer, dtype=np.float64)
        self.exclusion = float(exclusion)       # m, radius ignored by the near-field image
        self.environment = environment          # only affects the ordinary-light view
        self.objects: tuple[SceneObject, ...] = tuple(objects)
        self.materials: dict[str, Material] = dict(materials)
        self.source = source
        self.ids: tuple[str, ...] = tuple(o.id for o in self.objects)
        self._index = {o.id: k for k, o in enumerate(self.objects)}
        # Arrays in object order, for the vectorised routines. ``radii`` is
        # NaN for a box; ``lows`` and ``highs`` (the extreme corners) are NaN
        # for a sphere.
        nan3 = (math.nan, math.nan, math.nan)
        self.is_box = np.array([isinstance(o.shape, Box) for o in self.objects], dtype=bool)
        self.centers = np.array([o.shape.center for o in self.objects], dtype=np.float64).reshape(-1, 3)
        self.radii = np.array([math.nan if isinstance(o.shape, Box) else o.shape.radius
                               for o in self.objects], dtype=np.float64)
        self.lows = np.array([o.shape.low if isinstance(o.shape, Box) else nan3
                              for o in self.objects], dtype=np.float64).reshape(-1, 3)
        self.highs = np.array([o.shape.high if isinstance(o.shape, Box) else nan3
                               for o in self.objects], dtype=np.float64).reshape(-1, 3)
        self.depths = np.array([o.depth for o in self.objects], dtype=np.int64)
        self.densities = np.array([o.material.density for o in self.objects], dtype=np.float64)
        self.temperatures = np.array([o.material.temperature for o in self.objects], dtype=np.float64)
        self.own_volumes = np.array([o.own_volume for o in self.objects], dtype=np.float64)

    def __len__(self):
        return len(self.objects)

    def __getitem__(self, object_id: str) -> SceneObject:
        return self.objects[self.index(object_id)]

    def index(self, object_id: str) -> int:
        try:
            return self._index[object_id]
        except KeyError:
            raise KeyError(f"no object with id {object_id!r} in scene {self.name!r}") from None

    @property
    def roots(self) -> tuple[str, ...]:
        return tuple(o.id for o in self.objects if o.parent is None)

    def subtree(self, object_id: str) -> tuple[str, ...]:
        """``object_id`` and all its descendants, in scene order."""
        wanted = {object_id}
        stack = [object_id]
        while stack:
            for child in self[stack.pop()].children:
                wanted.add(child)
                stack.append(child)
        return tuple(i for i in self.ids if i in wanted)

    def locate(self, points) -> np.ndarray:
        """Index of the innermost object containing each point, -1 in vacuum.

        ``points`` has shape (..., 3); the result has shape (...).
        """
        p = np.asarray(points, dtype=np.float64)
        if p.shape[-1] != 3:
            raise ValueError("points must have shape (..., 3)")
        flat = p.reshape(-1, 3)
        best = np.full(flat.shape[0], -1, dtype=np.int64)
        best_depth = np.full(flat.shape[0], -1, dtype=np.int64)
        for k in range(len(self.objects)):
            if self.is_box[k]:
                low, high = self.lows[k], self.highs[k]
                inside = ((flat[:, 0] >= low[0]) & (flat[:, 0] <= high[0])
                          & (flat[:, 1] >= low[1]) & (flat[:, 1] <= high[1])
                          & (flat[:, 2] >= low[2]) & (flat[:, 2] <= high[2]))
            else:
                offset = flat - self.centers[k]
                distance2 = offset[:, 0] * offset[:, 0] + offset[:, 1] * offset[:, 1] + offset[:, 2] * offset[:, 2]
                inside = distance2 <= self.radii[k] * self.radii[k]
            deeper = inside & (self.depths[k] > best_depth)
            best[deeper] = k
            best_depth[deeper] = self.depths[k]
        return best.reshape(p.shape[:-1])

    def object_at(self, point) -> SceneObject | None:
        """The innermost object containing ``point``, or None in vacuum."""
        k = int(self.locate(np.asarray(point, dtype=np.float64)))
        return None if k < 0 else self.objects[k]


def _number(value, what: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise SceneError(f"{what} must be a number, got {value!r}")
    value = float(value)
    if not math.isfinite(value):
        raise SceneError(f"{what} must be finite, got {value!r}")
    return value


def _vector(value, what: str) -> tuple[float, float, float]:
    if not isinstance(value, (list, tuple)) or len(value) != 3:
        raise SceneError(f"{what} must be a list of three numbers, got {value!r}")
    return tuple(_number(v, what) for v in value)


def _material(name: str, spec: dict) -> Material:
    if not isinstance(spec, dict):
        raise SceneError(f"material {name!r} must be an object")
    for required in ("density", "temperature"):
        if required not in spec:
            raise SceneError(f"material {name!r} has no {required!r}")

    def optional(key):
        return None if spec.get(key) is None else _number(spec[key], f"material {name!r} {key}")

    material = Material(
        name=name,
        density=_number(spec["density"], f"material {name!r} density"),
        temperature=_number(spec["temperature"], f"material {name!r} temperature"),
        friction=optional("friction"),
        luminosity=optional("luminosity"),
        light=spec.get("light"),
    )
    for key in ("density", "temperature", "friction", "luminosity"):
        value = getattr(material, key)
        if value is not None and value < 0:
            raise SceneError(f"material {name!r} {key} must not be negative, got {value!r}")
    return material


def _shape(object_id: str, spec) -> Shape:
    if not isinstance(spec, dict) or "type" not in spec:
        raise SceneError(f"object {object_id!r} needs a shape with a type")
    if spec["type"] == "box":
        if "center" not in spec or "size" not in spec:
            raise SceneError(f"object {object_id!r}: a box needs 'center' and 'size'")
        size = _vector(spec["size"], f"object {object_id!r} size")
        if not all(edge > 0 for edge in size):
            raise SceneError(f"object {object_id!r}: every box size must be positive, got {list(size)!r}")
        return Box(center=_vector(spec["center"], f"object {object_id!r} center"), size=size)
    if spec["type"] != "sphere":
        raise SceneError(f"object {object_id!r}: unsupported shape type {spec['type']!r} "
                         "(only 'sphere' and 'box' in v1)")
    if "center" not in spec or "radius" not in spec:
        raise SceneError(f"object {object_id!r}: a sphere needs 'center' and 'radius'")
    radius = _number(spec["radius"], f"object {object_id!r} radius")
    if radius <= 0:
        raise SceneError(f"object {object_id!r}: radius must be positive, got {radius!r}")
    return Sphere(center=_vector(spec["center"], f"object {object_id!r} center"), radius=radius)


def _slack(*shapes: Shape) -> float:
    """Absolute slack (m) for comparing box faces: the relative tolerance
    times the largest coordinate or extent involved."""
    scale = 0.0
    for shape in shapes:
        extent = shape.size if isinstance(shape, Box) else (shape.radius,) * 3
        scale = max(scale, *(abs(c) for c in shape.center), *extent)
    return _GEOMETRY_RTOL * scale


def _farthest_corner_distance(box: Box, point) -> float:
    return math.sqrt(sum(max(abs(lo - p), abs(hi - p)) ** 2 for lo, hi, p in zip(box.low, box.high, point)))


def _distance_to_box(box: Box, point) -> float:
    """Distance from ``point`` to the nearest point of the box (0 inside)."""
    return math.sqrt(sum(max(lo - p, 0.0, p - hi) ** 2 for lo, hi, p in zip(box.low, box.high, point)))


def shape_inside(child: Shape, outer: Shape) -> bool:
    """Whether ``child`` lies entirely inside ``outer`` (touching allowed)."""
    if isinstance(outer, Sphere):
        if isinstance(child, Sphere):
            return math.dist(child.center, outer.center) + child.radius <= outer.radius * (1 + _GEOMETRY_RTOL)
        return _farthest_corner_distance(child, outer.center) <= outer.radius * (1 + _GEOMETRY_RTOL)
    slack = _slack(child, outer)
    if isinstance(child, Sphere):
        low = tuple(c - child.radius for c in child.center)
        high = tuple(c + child.radius for c in child.center)
    else:
        low, high = child.low, child.high
    return all(lo >= outer_lo - slack and hi <= outer_hi + slack
               for lo, hi, outer_lo, outer_hi in zip(low, high, outer.low, outer.high))


def shapes_overlap(a: Shape, b: Shape) -> bool:
    """Whether the interiors of ``a`` and ``b`` intersect (touching does not count)."""
    if isinstance(a, Sphere) and isinstance(b, Sphere):
        return math.dist(a.center, b.center) < (a.radius + b.radius) * (1 - _GEOMETRY_RTOL)
    if isinstance(a, Box) and isinstance(b, Box):
        slack = _slack(a, b)
        return all(min(a_hi, b_hi) - max(a_lo, b_lo) > slack
                   for a_lo, a_hi, b_lo, b_hi in zip(a.low, a.high, b.low, b.high))
    sphere, box = (a, b) if isinstance(a, Sphere) else (b, a)
    return _distance_to_box(box, sphere.center) < sphere.radius * (1 - _GEOMETRY_RTOL)


def scene_from_dict(data: dict, source=None) -> Scene:
    """Build a :class:`Scene` from parsed scene JSON, validating the contract."""
    try:
        observer = _vector(data["observer"]["position"], "observer.position")
    except (KeyError, TypeError):
        raise SceneError("scene has no observer.position") from None
    exclusion = DEFAULT_EXCLUSION
    if data["observer"].get("exclusion") is not None:
        exclusion = _number(data["observer"]["exclusion"], "observer.exclusion")
        if not exclusion > 0:
            raise SceneError(f"observer.exclusion must be positive, got {exclusion!r}")
    environment = data.get("environment", ENVIRONMENTS[0])
    if environment not in ENVIRONMENTS:
        raise SceneError(f"environment must be one of {list(ENVIRONMENTS)!r}, got {environment!r}")
    if not isinstance(data.get("materials"), dict):
        raise SceneError("scene has no materials")
    if not isinstance(data.get("objects"), list):
        raise SceneError("scene has no objects list")

    materials = {name: _material(name, spec) for name, spec in data["materials"].items()}

    shapes: dict[str, Shape] = {}
    parents: dict[str, str | None] = {}
    object_materials: dict[str, Material] = {}
    backgrounds: dict[str, bool] = {}
    for spec in data["objects"]:
        if not isinstance(spec, dict) or "id" not in spec:
            raise SceneError(f"every object needs an id, got {spec!r}")
        object_id = spec["id"]
        if object_id in shapes:
            raise SceneError(f"duplicate object id {object_id!r}")
        shapes[object_id] = _shape(object_id, spec.get("shape"))
        if spec.get("material") not in materials:
            raise SceneError(f"object {object_id!r}: unknown material {spec.get('material')!r}")
        object_materials[object_id] = materials[spec["material"]]
        parents[object_id] = spec.get("parent")
        backgrounds[object_id] = spec.get("background", False)
        if not isinstance(backgrounds[object_id], bool):
            raise SceneError(f"object {object_id!r}: background must be true or false")

    for object_id, parent in parents.items():
        if parent is not None and parent not in shapes:
            raise SceneError(f"object {object_id!r}: unknown parent {parent!r}")

    depths: dict[str, int] = {}
    for object_id in shapes:
        depth, node, seen = 0, object_id, {object_id}
        while parents[node] is not None:
            node = parents[node]
            if node in seen:
                raise SceneError(f"object {object_id!r}: the parent chain forms a cycle")
            seen.add(node)
            depth += 1
        depths[object_id] = depth

    children: dict[str, list[str]] = {object_id: [] for object_id in shapes}
    for object_id, parent in parents.items():
        if parent is not None:
            children[parent].append(object_id)

    for object_id, parent in parents.items():
        if parent is None:
            continue
        if not shape_inside(shapes[object_id], shapes[parent]):
            raise SceneError(f"object {object_id!r} does not lie entirely inside its parent {parent!r}")

    siblings: dict[str | None, list[str]] = {}
    for object_id, parent in parents.items():
        siblings.setdefault(parent, []).append(object_id)
    for parent, group in siblings.items():
        for i, a in enumerate(group):
            for b in group[i + 1:]:
                if shapes_overlap(shapes[a], shapes[b]):
                    where = "root objects" if parent is None else f"children of {parent!r}"
                    raise SceneError(f"{where} {a!r} and {b!r} overlap; the contract does not say which wins")

    objects = []
    for object_id, shape in shapes.items():
        own_volume = shape.volume - sum(shapes[child].volume for child in children[object_id])
        objects.append(SceneObject(
            id=object_id,
            shape=shape,
            material=object_materials[object_id],
            parent=parents[object_id],
            children=tuple(children[object_id]),
            depth=depths[object_id],
            own_volume=own_volume,
            background=backgrounds[object_id],
        ))
    return Scene(name=data.get("name", ""), observer=observer, objects=objects, materials=materials, source=source,
                 exclusion=exclusion, environment=environment)


def load_scene(path) -> Scene:
    """Load and validate a ``*.scene.json`` file."""
    path = Path(path)
    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)
    return scene_from_dict(data, source=path)
