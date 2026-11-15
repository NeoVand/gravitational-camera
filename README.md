# gravitational-camera

A theoretical-physics and visualization project: what would a camera see if
every pixel were an ideal, arbitrarily small detector of gravitational waves
and tidal fields?

The goals are a theory of gravitational image formation, a simulation engine
(SvelteKit + WebGPU) that shows everyday scenes through such a camera, and a
paper, "The Gravitational Camera".

## Status

Early groundwork only: a prior-work survey and a few numerical checks. No
engine or paper draft yet.

## Layout

- `reports/` — the prior-work survey. Sources are confirmed at abstract level
  only; the report lists what still needs checking against full texts.
- `research_notes/` — the raw notes behind the survey, one file per thread.
- `calc/` — small scripts backing the numbers quoted in discussion:
  - `orders_of_magnitude.py` — near-zone radii, tidal fields, radiated powers,
    graviton rates, absorption and lens bounds (read its header for the
    assumptions).
  - `single_pixel_bandlimit.py` — numerical check that a point pixel recording
    the full tidal tensors sees only sky multipoles l ≤ 4.

Run the scripts with `python3 calc/<name>.py` (the second needs numpy).
