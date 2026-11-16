# The Gravitational Camera

What would a camera see if every pixel were an ideal, arbitrarily small detector
of gravitational waves and tidal fields?

This repository holds a theory of gravitational image formation, an engine that
renders everyday scenes through such a camera, and the paper, all published as
one website: a landing page, the paper with live figures, and playable demos.

**Site:** <https://neovand.github.io/gravitational-camera/> (deployed from `main`)

## Status

Six demos, covering two of the three regimes:

| Demo | Regime | What it shows |
|---|---|---|
| The Sun at midnight | thermal | The Sun's core through the Earth |
| The locked safe | near field | Gold inside steel; blur set by sensitivity |
| Full or empty | near field | Weighing by looking |
| The blank mirror | near field | Pictures, print and reflections carry no mass |
| The closed furnace | thermal | Temperature inside a closed box |
| Honey and water | thermal | Glow set by internal friction |

The waves regime (moving bodies, with a labelled slowed-light teaching mode)
is next. Material properties that are assumptions are labelled in each scene
file and on the page.

The paper has eleven sections with derivations, plain-language summaries and
eight figures. Every number the engine draws is checked against the Python
reference, on the CPU in double precision and on the GPU in single precision.

## Layout

| Path | What it is |
|---|---|
| `app/` | The website: SvelteKit, TypeScript, WebGPU. Engine in `app/src/lib/engine/`. |
| `scenes/` | Scene files shared by the engine and the reference; the format is in `scenes/README.md`. |
| `reference/` | Independent Python implementation of the physics, with tests. Exports the fixtures the engine is checked against. |
| `paper/` | The paper's LaTeX source. The site renders it with pandoc; the same files go to the journal. |
| `reports/`, `research_notes/` | The prior-work survey and its raw notes. |
| `calc/` | Early order-of-magnitude checks. |

## Running it

The site needs Node 22, pnpm and pandoc:

```bash
cd app
pnpm install
pnpm dev
```

The engine needs a browser with WebGPU. Without one, pages fall back to still
images.

The reference implementation needs Python 3.11 or later:

```bash
cd reference
python -m pip install -e '.[test]'
python -m pytest
```

## Tests

```bash
cd app
pnpm run check            # types
pnpm run lint
pnpm exec vitest --run    # engine physics against reference/fixtures
pnpm exec playwright test # pages, and the shaders against the reference
```

The end-to-end tests run the shaders on a software WebGPU adapter and compare
them with the Python reference; the same comparison is available in any browser
at `/dev/selftest/`. Headless browsers do not show WebGPU canvases, so tests and
`app/scripts/capture.mjs` read frames back through `?present=readback`.

After changing a scene or the reference code, regenerate the fixtures (one
file per scene the engine is tested against):

```bash
cd reference
python -m gravcam.export_fixtures
```
