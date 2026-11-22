# Figures: inventory, Neo's words, plan

Follows design/FIGURE_WORKFLOW.md. Image-model candidates (design/imagegen.py,
prompts in design/prompts/, images in design/candidates/, not committed) are
style references; the figures in the paper are drawn by
paper/figures/make_figures.py from data and exact maths.

## What Neo has said about figures in this project (verbatim)

- "I think we need some nice figures and a really good explanation of things, so anyone watching or anyone reading the
  paper with a background in gravity can understand everything. Even the people who don't, they can still get something
  out of it. I think it's going to require a bunch of really nice figures to show how image formation works and
  everything."
- "half of the image is electromagnetic and the other half is gravitational" (every gravity render has a light render
  beside it).
- "there is a clipping issue with the oscillating mass. Also there are issues with the arrows."
- "the circular arrow above Figure 6 is weird and broken."
- "Make sure the content of the figures is centered properly. It looks like that is not done correctly. There is more
  empty space to the left than to the right of some figures."
- "Most of the figures and equations in the paper don't fit the width of the screen."
- "In the first figure the sun is invisible even in the gravity view."
- "In most rendered images there are white lines and dots that look like artifacts."
- "two column and only horizontally expanded figures will take whole width and most of them will take the column width"
- "Remove the thick black outline from white text in figure one. There is enough contrast to leave it just white no need
  for black outline. It is in figure 13 and 19 and 20 too"
- "Still, the figures, I mean the conceptual ones, are kind of bad."
- "tons of very well-done figures"

## Inventory (PDF of 16 Nov 2026)

Kind: C conceptual drawing, D chart of data, R computed render (light beside gravity).
Status: "fixed" means Neo's requested changes are in; none has been explicitly approved yet.

| Fig | File | Kind | Story | Status |
|---|---|---|---|---|
| 1 | sun-at-midnight | R | Looking down at midnight: dark ground in light, the Earth's layers and the Sun's core in gravity | fixed (Sun visible, plain labels) |
| 2 | tidal | C | What a pixel feels: a ring of free masses beside a mass and in a wave | to redo (candidates out) |
| 3 | tidal-field | D | The tidal field around one and two masses and in a wave | keep, restyle |
| 4 | regimes | D | Where sources lie: near zone against frequency and distance | keep |
| 5 | sky-integral | C | The sky integral: cone, r^2 dr / r^3, the weight of E_zz | to redo |
| 6 | resolution-law | D | Wiener filter and the logarithmic blur law | keep |
| 7 | nearfield | C+D | Two line masses, the data, the reconstruction | keep, restyle panel (a) |
| 8 | locked-safe | R | Gold in a safe through steel; blurred | keep; candidate for "three interiors, one exterior" |
| 9 | quadrupole | D | Rotor radiation pattern; lambda/d against speed | keep |
| 10 | polarization | D | h+, hx and V/I against inclination | keep |
| 11 | which-way | R | Sense of turning from polarization (slow-light mode) | keep |
| 12 | line-integral | C | Light stops at the first surface; gravity sums the line | to redo (candidates out) |
| 13 | closed-furnace | R | Hot iron glows through steel | fixed (plain labels) |
| 14 | array | D | Response against steering angle; one pixel's 50 degree blur | keep |
| 15 | earth-glow | D | Brightness of the Earth's interior against angle | to extend: step angles are radii |
| 16 | budget | D | Gravitons per second from whole objects | keep; may become spectra |
| 17 | binary-field | D | Two black holes, near field to spiral | keep |
| 18 | memory | D | Memory of a merger and of jets | keep |
| 19 | milky-way | R | The Galaxy in light (dust) and in waves | fixed (plain labels) |
| 20 | black-hole | R | A black hole against the Milky Way and the 0.905 K sky | fixed (plain labels) |
| 21 | sun-lens | D | Bending inside the Sun; focal distance | keep |

## Open decisions

- Colour mapping. The two accents now mean several things: stretch and squeeze, gravity and light, near field and
  waves, h+ and hx. The workflow asks for one mapping tied to the paper's central contrast, the same in every figure.
  To be decided with Neo from candidates, not in words.

## Style: modelled in 3D, drawn as vector (16 Nov 2026)

Neo, on the engraved figures drawn by code: "The cross-hatching doesn't work. I think if you did 3D modeling with
3.js, you would have a better chance at making really nice ones." And: "we're not going to put raster images, or at
least we're going to try to avoid it ... Figures should not have a background, and they should work very well on a
white background in particular. In some cases, they should be theme-aware for the website as well."

So the conceptual figures are modelled in 3D (figures3d/, three.js for the geometry) and drawn as SVG by a small
renderer of our own (figures3d/lib.js): every primitive projected by an orthographic camera and ordered by depth, with
explicit layers where something must lie on top; spheres as circles with radial gradients computed from the lights;
curves as single paths (so dashes run on); meshes as triangles shaded from the same lights, merged by colour; a
translucent body drawn opaque inside a group that is faded once. Labels are TeX set by MathJax as paths. The PDF is
the same SVG printed by Chromium. Charts stay in matplotlib (paper/figures/charts.py) and are placed into the figure.

    cd figures3d && npm install && node render.mjs tidal sky-integral quadrupole line-integral earth-glow

writes paper/figures/staging/ for review; --final writes over the paper's figures. Ink colours are the site's
theme colours (mapped to its variables); shaded bodies keep their own colours on either theme.

## Earlier attempt: engraving (abandoned)

"The engraving style is probably really good, and the physics community is used to it from textbooks ... It's okay if
it has subtle colors or, for example, shows the heat or something like that, or the beam. I think that can be something
we can adopt for the whole paper, the website, and everything."

Two routes, both exact:

1. Diagrams of exact maths (rings, fields, curves): drawn wholly by code in an engraved manner (design/engrave_proto.py:
   hatching that follows each surface, width set by a Lambert shadow, cross-hatching only in the core shadow).
2. Pictorial plates (the Earth, a furnace, a person): code draws an exact base (design/bases/), the model engraves it
   through the edit endpoint (design/imageedit.py), and the result is measured against the base. First test, the
   Earth plate: the line of sight stayed within 1 px of the exact straight line at 40 of 40 samples. Generated
   without a base, all five candidates bent that line at the Earth's centre.

## Audit of November 2026 (all 38 figures, by three independent readers, each number recomputed)

Corrected in the code or the captions, and waiting to be redrawn (`make figures` needs LaTeX; the 3D ones need
`make setup-3d` and a Playwright on NODE_PATH, e.g. the site's):

- budget: the Earth's bar was 5.2e10 (now 2.4e10); a person and a litre of water were drawn with the placeholder
  friction, ten times the text's values (now from the spectrum of water: 1.3e-16 and 2.7e-18 per second).
- array: the legend's "1.8 deg" for D = 30 wavelengths was read off the plotting grid; it is 2.0 deg.
- quadrupole (b): the marked point was "32 m/s", which is in no text; the pair of the text moves at 50 m/s.
- sun-lens (b): "23.5 AU, standard model" read as Eddington's; now "standard solar model".
- milky-way (b): the panel said "near a millihertz", the caption three.
- every computed image was set into its figure at 100 dots per inch; `save` now asks for 300.
- earth-glow (a): the camera stood on the north pole; the globe now leans so that it stands at latitude 40 north
  with the Sun below the northern horizon (staged: paper/figures/staging/earth-glow.pdf).
- captions only: tidal (the arrows are displacements: in a wave the acceleration at greatest stretch points
  inward); nearfield (a) (not to scale); two-pixels (b) (the source is 55 deg from broadside, fringe spacing 1.8
  lambda/D); binary-field (c) (the two power laws cross at 0.3 lambda, not at lambda/2pi); tremor.

Found and not yet done (craft, to be judged on a redrawn figure):

- regimes: four labels are struck through by the axes; the neutron-star arrow sits at 3e4 Hz.
- speedometer: (a) and (b) share the path coordinate but are not aligned (the moving mass sits above the wrong
  dip); (b) has no y title and 33-point curves; the "at rest" floor is finite-difference noise, not rounding.
- which-way, closed-furnace, black-hole: colour bar offset from its frame; white sliver at a frame; black seams
  where wall meets floor in closed-furnace (b).
- stars, sky-count: far-side dots that overlap the limb are two-toned; content off-centre (4 pt against 22 pt).
- silent-flows: streamlines broken, doubled on the axis, not mirror-symmetric. same-outside (b): white seams
  between bands; (c) double outline. buried-ruler: thick black outlines on white marks. sky-integral: sawtooth
  on the cap boundaries; the r arrowhead on the element.
- sun-at-midnight (a): the dashed "circle" is an ellipse; the core is unlabelled. locked-safe: no colour bar, and
  the gold saturates the scale. nearfield: make (a) to scale; label the y axis of (b). capacity: "38" wedged
  against a tick; end dots half-clipped (also resolution-law).
- materials: "C, 1333 cm^-1" cut by the frame. line-integral: "person" 1.4 pt above "door" and "iron".
  beyond: "plus" 1.5 pt above its neighbours; orange means general relativity in (a), the massive graviton in (b).
- ranging (b): jitter of 1-2 per cent in the "exact" points; (c) two points 1-3 per cent off at kr = 200.
  separation-noise: one point 5 per cent below its bound (too few trials). earth-inverted: three of four fitted
  boundaries dashed; the crust's bar is 21 per cent where the text says 25.
- colour: the sense of turning is magenta/green in which-way and orange/blue in quadrupole.

New, staged: `hair` (figures3d/figs/hair.js, built from image candidate A's layout with D's beads, two runs of
candidates in design/candidates/hair/: one look, a push, weighed, for a ball, a shell and a dense core; and the
169 numbers outside a stone at SNR 10^6 from three radii against a black hole's 7; paper/figures/staging/hair.pdf),
and `hair-scale` (make_figures.py hair_scale: form factors of a ball and a shell read by weighing; bits against SNR;
a draft with stand-in fonts at paper/figures/staging/hair-scale-draft.png). Neither is in the paper yet.

### 17 November 2026, later: the placeholder friction is gone from the paper's scenes

The scene files now carry material values (reference/gravcam/scenefriction.py; the Earth's shells at the most their
stiffness allows, iron from its spectrum and falling as 1/T when hot, silica glass for concrete and plaster, none
for air). Every figure drawn from a scene changes and must be redrawn once LaTeX is installed: sun-at-midnight
(colour scale moved to 10^-7.6 .. 10^-4), earth-glow's chart (so the staged earth-glow.pdf still shows the old
chart), earth-inverted (panel b in 10^-4 Pa s, with each shell's own line), closed-furnace (both blocks now show
through the steel; the cold one could not be seen before because the air inside was given the friction of steel),
budget (the Earth's bar from its scene, 5.7e9 per second). Previews without LaTeX were looked at; the captions and
the text of Sections VI and IX already describe the new figures.

### 21 November 2026: five figures for the exterior response, built and in the paper

Neo's words on the first code-drawn drafts (flat charts from a script since removed): "The figure is going to require
more polish ... look for inconsistencies, bad overlaps, bad placement of things, asymmetries, bad arrowheads ...
Also, nice textures, 3D, really good presentation." The drafts were not patched but rebuilt in the pipeline of
`hair`, from the looks chosen among the image candidates (design/candidates/REVIEW-2026-11-22.md). Every point drawn
as a result comes from reference/gravcam/figure_data.py (tested in reference/tests/test_figure_data.py), and each
script throws if what it draws disagrees with those numbers.

| Figure | Where | Built by | Pictorial or schematic (said in its caption) |
|---|---|---|---|
| `ladder` (full width) | Section XII, the reach of a tide | figures3d/figs/ladder.js, with the bodies of `hair` (figures3d/stone.js) | the bodies cut open; the thickness of the skins and the size of the central mass |
| `two-readings` | Section XII, the two readings as one transform | figures3d/figs/two-readings.js | nothing |
| `hidden-flow` | Section XII, the flow | figures3d/figs/hidden-flow.js | the stone of the section; the places of the arrows |
| `hole-response` | Section XII, the weight of a hole's response | paper/figures/fig_hole_response.py | nothing |
| `near-field-geometry` | Section IV, the geometry of the near field | figures3d/figs/near-field-geometry.js, on a slab from design/stone_slab.py | the stone; the depth of the block behind its face |

What the pedantic pass changed, so that it is not undone:
- ladder: the bars lie in their body's row (no colour or letter is needed to say whose they are); the impulses of
  the two tides are on one scale, so the first body's are visibly shorter; short arrows have heads of at most two
  fifths of their length; the rows of beads do not touch; the moment at which the two bodies first differ is an
  orange bead, not a ringed one (no second outline).
- two-readings: in a view from the side every generator of the near half of a cone crowds its outline, so the pair
  is drawn exactly on the outline (the light-cone picture) and the section of the cone that holds all the pairs,
  which that view sees edge-on, is drawn only in the plan, where one further pair is all that fits without crossing.
- hidden-flow: two rings of paths, all spanning one angle; every arrow has the same halo.
- hole-response: the curves run from zero frequency to the right edge (the first draft's grid showed as a polygon
  and stopped short at both ends).
- near-field-geometry: the recorded patterns are drawn between their changes of sign (their tails, 0.018 of the
  peak at most, doubled the block's top edge); what is drawn on the stone keeps a fixed dark ink, since the site
  swaps the paper's ink for its theme's and the stone stays pale on the dark theme.

Colour balance (share of pixels near each accent, orange / blue, at 300 dpi): ladder 1.49 / 0.43, two-readings
0.27 / 1.24, hidden-flow 0.69 / 0.39, near-field-geometry 0 / 0.52, hole-response 1.05 / 0 (`hair` itself is
2.16 / 0.25). The marked ring remains a staged draft (paper/figures/draft_marked_ring.py): it is not in the paper.

## 21 November 2026, later: the audit of all 44 figures before arXiv

Every included figure was rendered at 300 dpi and looked at one by one (doubtful regions at 600 to 1800 dpi), and
measured: ink margins against the page box, stroke weights, dash patterns, glyph sizes, colours. What changed:

- **Charts (make_figures.py, charts.py, fig_*.py).** One weight for a principal curve (`CURVE`, 1.1) and one for a
  secondary (`CURVE2`, 0.7); one dashed and one dotted pattern (`DASH`, `DOT`, fixed lengths on the page); curves
  written in full (`path.simplify` off: the ripples of `nearfield` were visible polygons at 900 dpi); every chart
  centred by its ink (`centre`, now by the rendered ink box) and trimmed to 2 pt above and below (`trim`), so the
  gap between a figure and its caption no longer varies by up to 12 pt. `materials` redrawn in the palette (two
  accents, ink and dim, told apart by pattern) with open spines; `budget` in lower case with solid accents;
  `present` with its two letters on one vertical; `binary-field` with equal gaps; `regimes`, `silent-flows`,
  `earth-inverted`, `sun-lens`, `speedometer`, `buried-ruler` small repairs. Thin spaces in every unit.
- **3D figures.** `tidal` rebuilt: arrows start clear of their beads and are moved off the ring where they run
  along it, heads at most two fifths of an arrow, dashes left out whole near an arrow, the three panels to the
  page's edges. `quadrupole`, `two-readings`, `earth-glow` centred by their ink (`inkBox` in lib.js); the globe
  sampled bilinearly at 648 ppi; `sky-integral`'s label off the cone's edge; `stars` without the doubled limb;
  `voices` with the heading of (a) set as those of (b) and (c); `line-integral`'s bar in the accent.
- **Lettering to agree with the text.** The rotor's spin is `\boldsymbol\Omega` (quadrupole); the pixel spacing is
  `b` (near-field-geometry).
- **Tried and not done.** Forcing Latin Modern's 10 pt designs in the charts to match MathJax's face in the 3D
  figures: widths then agree to 0.2 %, but the weight gap grows from 12 % to 21 %, so the faces were left.
  Blue stays the colour of the near field in `buried-ruler`, `nearfield` (a) and `near-field-geometry`, although
  the sign code would make a stretch orange. `array`'s legend stays at 6.5 pt (no room at 7).
- **Left for a larger texture.** At 900 dpi the globe of `earth-glow` still shows the texels of its 1024 x 512
  map, softly.

## 22 November 2026: a figure for the passing mass, and a third panel for the hole

- `passing` (figures3d/figs/passing.js, data `passing_mass` in figure_data.py): the two bodies of `ladder` seen
  along the path of a passing mass, with the impulses less the recoil at the four places where they are radial,
  bars for the internal energies (0.0803, 0.1041), and the energy against b/R drawn by the script. Sparser than
  `ladder`: with b fixed at 1.5 R the near arrow must stop short of the bead, which caps the scale of all of them.
- `hole-response` gains panel (c): the shell radius for the tide of each degree, 2 to 8, with the limit 1.91.
