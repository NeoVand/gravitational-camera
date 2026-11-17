# Plan: what one pixel knows

The next major revision puts the algebra of the gravitational pixel at the centre of the paper. It covers what ten
numbers at one point can tell that light's six cannot, with derivations, tests, figures and demonstrations. Sources:
`design/TEN_NUMBERS.md` (our checks and Carbon's results, each marked as confirmed independently, plausible, or
wrong).

## 1. The paper

### New section: "What one pixel knows" (after Section II, before the regimes)

It is regime-free, so it belongs early, and the paper's claim to novelty rests on it. The current VII.c ("What one
pixel knows") moves here, and its error about I and V mixing goes. Each result is stated as a theorem or
proposition with a derivation in the text or an appendix, its exactness (exact, to stated order), its prior art,
and the reference test that checks it.

| # | Result | Status | Proof route | Prior art |
|---|---|---|---|---|
| 1 | W = E + iB; observers act by SO(3, C) (a boost is an imaginary rotation); a plane wave is c m m^T with m null; four principal directions (stars) | exact | short, with figure F1 | Petrov 1954, Penrose 1960, Newman and Penrose 1962 |
| 2 | Ten = four invariants + three of orientation + three of velocity: the exact speedometer; ego-motion invariance (real spectrum for any static scene); light's two-parameter blind spot; the one-body blind spot | exact; checked to 0.6c | polar decomposition of SO(3, C); stabilizers | new as a sensing statement |
| 3 | A moving body's sideways velocity from its four stars, exactly at any speed; time to contact for one coming straight on | exact; checked to 0.9c | aberration of the principal null directions | Carbon (new); paper's first-order sqrt 3 v/c becomes a corollary |
| 4 | Separating waves: s at one instant, s + 1 at one frequency, 2s over time (gravity 2, 3, 4; light 1, 2, 2) | exact; checked | Sylvester's apolarity: catalecticant rank, pencil, annihilating conic | Sylvester 1851; EM vector sensors (Nehorai, Hochwald) for light |
| 5 | The sky at one pixel: 2(2s+1)^2 + 2(4s+1) numbers per frequency (gravity 68 + 32 checks; light 28 + 8; sound 9 + 7); I and V never mix; the sky's chirality from one pixel | exact; checked | helicity blocks S++, S--, S+- | Allen and Ottewill 1997, Seto and Cooray 2004 (two-detector versions); Seto and Taruya (chirality) |
| 6 | How many uncorrelated sources one pixel resolves: closed-form K = 5; local identifiability up to 8 to 13 by class | K = 5 exact; table local | pencil; Jacobian ranks | array processing (MUSIC, Kruskal) |
| 7 | Ranging a wave source from one pixel: C(iota, theta)/(kr)^2 at one instant; the inclination-free frequency identity; the two-helicity split 8 \|cot iota\|/(kr), which gives range up to kr ~ SNR | to stated order; checked independently | the exact multipole field (peeling matrix) | Sachs, Teukolsky (peeling); the ranging is new |
| 8 | The camera sees the present: exact for uniform motion; to (kr)^2 near an orbiting pair; the news arrives at c | exact / to order; checked | boosted field; near-zone expansion of the retarded multipoles | Laplace 1805, Carlip 2000 |
| 9 | Beyond general relativity in one reading: B = (c/v_p)[k]x E for any metric plane wave; direction, speed of gravity, six polarizations, five checks; massive graviton against scalar by the sign of E_l/E_b | exact (linear); checked independently | the second Bianchi identity | Eardley, Lee and Lightman 1973; Fierz and Pauli 1939 |
| 10 | Cramer-Rao bounds: direction 1/rho (light sqrt 2/rho), speedometer, ranging | exact (Gaussian noise) | Fisher matrices | standard |

### Additions elsewhere

- **Section IV (near field), "What breaks the tie".** Add the magnetic part's null space: confined meridional flows
  are invisible outside (checked), so only the harmonic part of the swirl shows. Add the depth-independent shear
  zeros above two equal masses, as the exact geometric companion of the Cramer-Rao limit (checked; equal masses only).
- **Section VII (no lens).** Arrays: N pixels resolve 5N - 1 sources; the overlap is cos^8(theta/2); two distant pixels
  form a sidelobe-free interferometer once SNR > D/lambda (Capon). And no echoes, so every separation result holds
  indoors and underground.
- **Section VIII (separation).** Replace |B|/|E| = sqrt 3 v_perp/c with the exact four-star velocity; put the paper's
  one-pixel ranging (Eq. 36) next to its Cramer-Rao bound and light-time crossover.
- **Matter at the pixel** (a short subsection). tr E reads rho + 3p/c^2: dark matter, the Casimir vacuum, Lambda (to
  check), the rotation of the pixel's own frame (-2 Omega^2), and a neutrino shell pointing back to its supernova.
- **Abstract, introduction, README** rewritten to lead with what one pixel knows.

### Left out, with the reason

- Spin memory from the time integral of B: wrong as stated.
- One-pixel evidence for inflation's standing waves: shown unobservable by Allen, Flanagan and Papa (2000).
- Square-root splitting at exceptional points: no gain in signal-to-noise.
- The "gravitational eyes" framing: not needed, by decision.

## 2. Figures (vector, white background, theme-aware on the site; reference-computed)

| | Figure | Content | Tool |
|---|---|---|---|
| F1 | The four stars | Celestial spheres around a pixel: one wave (a quadruple star); a body at rest (two double stars, antipodal); the same body at 0.5c and 0.9c (stars folding toward v_perp, midpoint marked); two bodies (four stars); a body plus a weak wave (split) | figures3d |
| F2 | Ten = four + three + three | The complex eigenvalues of W on the complex plane, the field's axes, the velocity of its rest frame; beside it light's blind boost and roll | figures3d + chart |
| F3 | One ear, four voices | Four sources on the sky; the pixel's ten traces; the null conic and the annihilating conic meeting at the four directions | figures3d + chart |
| F4 | Sound, light, gravity | Side by side: numbers per point, invariants, speedometer dimensions, waves separated (instant / frequency / time), sky numbers and checks, direction bound | table-figure |
| F5 | Ranging a wave source | (a) s2/s1 against kr for several inclinations, with C/(kr)^2; (b) the helicity split times kr against inclination, with 8 \|cot iota\|; (c) range against SNR: sqrt(rho) and rho | matplotlib |
| F6 | The present and the past | (a) a moving body: the tidal axis points at the present position, light at the retarded one; (b) near an orbiting pair, error against kr: kr for retarded positions, (kr)^2 for present ones | figures3d + chart |
| F7 | The sky at one pixel | The 100 numbers per frequency partitioned (25 I, 25 V, 18 linear, 32 checks), against light and sound; the l <= 4 patterns | chart |
| F8 | Beyond Einstein in one reading | The six polarizations' E and B; how one reading inverts them | figures3d |
| F9 | A ruler under the ground | The phase of the in-plane shear above two buried equal masses at three depths, the two zeros d apart | matplotlib |
| F10 | The speedometer in the dark | A pixel crossing a room of masses: real eigenvalues, its velocity read out; a person moves and the eigenvalues turn complex | chart |
| F11 | Two pixels far apart | cos^8 envelope against a scalar pair's fringes; Capon grating-lobe suppression against SNR | chart |
| F12 | Silent flows | A ball with a swirl and with meridional rolls; the swirl's external B, and none from the rolls | figures3d |

## 3. Demonstrations (site)

These are computed on the CPU in TypeScript (complex 3x3 algebra), checked against fixtures exported by the reference,
and drawn with the site's existing canvas and SVG tools. Like the other demos, each sets a gravity view beside a light
view where that makes sense.

| | Demo | Interaction |
|---|---|---|
| D1 | The four stars | A sky sphere around the pixel. Add bodies and waves, drag them, set a body's speed; the four stars move live, and the midpoint reads v_perp/c. Light's two stars alongside. |
| D2 | One ear, four voices | Place up to four sources with different waveforms (audible); the pixel's ten traces; the directions found live. Light's sensor fails at three. Echoes on or off (light only). |
| D3 | The present and the past | A body crossing the scene in the labelled slow-light mode: light shows it where it was, gravity where it is; make it stop and watch the news spread. |
| D4 | The speedometer in the dark | Drag the pixel through a room of masses: it reads its own velocity; set something moving and the motion alarm lights. |
| D5 | How far is that binary? | Distance and SNR sliders: s2/s1, the helicity split, the estimated range with its error bar. |
| D6 | One pixel's sky | Choose a sky (twelve sources on an icosahedron, a uniform sky, a chiral background): what one pixel recovers at second order; the icosahedron indistinguishable, then broken at fourth order. |
| D7 | Beyond Einstein | A wave with chosen polarizations and speed; one reading inverts it; the consistency checks light up if the input is not a single metric wave. |

## 4. Reference implementation and tests

- `gravcam/pixel.py`: W and invariants; the four stars; the SO(3, C) polar decomposition and exact speedometer; the
  motion alarm; separation at one instant, one frequency and over time; helicity blocks and sky counts for spin 0, 1
  and 2; the K = 5 pencil; ranging (C, frequency identity, helicity split) on the binary model; Cramer-Rao matrices.
- `gravcam/present.py`: aberration-free near field (boosted fields, orbiting pair).
- `gravcam/beyond.py`: general metric plane waves, the six polarizations, the one-reading inversion, Fierz-Pauli and
  scalar modes.
- Additions to `nullspace.py` (meridional flows) and `tidal.py` (shear zeros).
- Tests for each result in section 1, written against our own fields (curvature by finite differences, the binary
  model, boosted metrics), not against Carbon's code; Carbon's suite kept as a cross-check.
- Fixtures exported for the site's tests of the TypeScript algebra.

## 5. Order of work, each phase tested and pushed

1. Reference modules and tests for results 1 to 10, plus the additions.
2. The new section, the corrections, the abstract and introduction; PDF and site checked.
3. Figures F1, F3, F5, F6, F9 first; then F2, F4, F7, F8, F10, F11, F12.
4. The TypeScript algebra with fixture tests; demos D1, D2, D3 first; then D4 to D7.
5. README and landing page; the literature read in full for each novelty claim.

## 6. Decisions needed

- Where the new section goes: after Section II (proposed) or as a new part after the regimes.
- How Carbon's contributions are credited (acknowledgement, named in the text, or otherwise).
- Whether Carbon's treatise and suite are kept in the repository (under `design/sources/`) or only cited.
- Which demos come first (proposed: D1, D2, D3).
