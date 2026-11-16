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
