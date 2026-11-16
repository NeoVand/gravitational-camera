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

## Style: engraving (Neo, 16 Nov 2026)

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
