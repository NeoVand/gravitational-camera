# Scene format (v0)

One JSON file describes a scene for every renderer: the WebGPU engine in
`app/` and the Python reference in `reference/`. All quantities are SI.

## Fields

- `observer.position` — where the camera sits, in scene coordinates (metres).
- `materials` — named bulk properties:
  - `density` (kg/m³)
  - `temperature` (K)
  - `friction` (Pa·s) — effective shear viscosity at thermal frequencies
  - `luminosity` (W, optional) — total graviton power of the object, spread
    uniformly over its own region; overrides `friction` for emission
  - `light` (optional) — appearance to an ordinary camera: `color` (linear
    RGB), `emissive` (0 or 1)
- `objects` — solids. Each has an `id`, a `shape`, a `material` and an optional
  `parent`. A child lies entirely inside its parent and replaces the parent's
  material there. An object's *own region* is its shape minus its children.
- `shape` — `{ "type": "sphere", "center": [x, y, z], "radius": r }`.
  Boxes and capsules come later.

## Thermal emission model

With G, c, the Stefan–Boltzmann constant σ and Boltzmann's constant k:

- absorption coefficient: α = 16πGη/c³ (per metre), with η = `friction`
- energy emissivity: j_E = α σ T⁴ / π (W m⁻³ sr⁻¹)
- if `luminosity` L is given: j_E = L / (4π V), with V the volume of the
  object's own region
- number emissivity: j_N = j_E / (2.701 k T) (gravitons s⁻¹ m⁻³ sr⁻¹)

Matter is transparent, so the thermal image is a line integral: the number
radiance along a ray from the observer is N = ∫ j_N ds
(gravitons s⁻¹ m⁻² sr⁻¹), with no occlusion.

## Additions in v1

- `shape` may also be an axis-aligned box:
  `{ "type": "box", "center": [x, y, z], "size": [sx, sy, sz] }`.
  Volumes, containment and line integrals follow in the obvious way.
- `observer.exclusion` (metres, default 0.25) is the radius around the observer
  inside which matter is ignored by the near-field image.
- `environment` is `"night-sky"` (default) or `"room"`; it only affects the
  ordinary-light view.
- `light.finish` is `"matte"` (default), `"mirror"`, `"screen"` (a lit picture)
  or `"print"` (a page of text). It too affects only the ordinary-light view:
  images carry no mass.
- An object may set `"background": true` to mark it as part of the empty room
  (floor, walls, fixed furniture). The physics is unchanged; a view may offer
  to subtract these objects, which is exact because both the near field and the
  thermal glow add linearly. A child of a background object still contributes
  its contrast with it.

## Additions in v2

- A sphere may carry `"spin": { "center": [x, y, z], "axis": [x, y, z],
  "rate": r }`: steady rotation about the line through `center` along `axis`,
  at `rate` revolutions per second, positive anticlockwise seen from the tip of
  `axis` (the right-hand rule). The sphere's `shape.center` is its position at
  time zero and must lie in the plane through `center` across the axis; it must
  stay inside its parent as it turns. Spheres with the same spin form one rigid
  *rotor*. A rotor whose mass is not symmetric about its axis radiates
  gravitational waves at twice its rate (`reference/gravcam/waves.py`). Static
  views use the time-zero positions.
- An object may set `"cutaway": true`: the light view can cut it away to show
  what it holds (a sealed drum, say). Like `background`, it changes no
  physics.

## Near-field image model

The tidal field at the observer from all mass beyond the exclusion radius is

    E_ij = G ∫ dΩ (δ_ij − 3 n_i n_j) S(n)

with the *tidal column* along the unit vector n

    S(n) = ∫ ρ(r n) dr / r        (kg/m³), from r = exclusion to infinity.

S(n) is the sky map that a near-field camera reconstructs: mass along the line
of sight, weighted by the inverse of its distance. For a ray that is inside a
uniform region from r = a to r = b the contribution is ρ ln(b/a).
