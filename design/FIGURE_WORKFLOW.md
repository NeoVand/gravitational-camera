# How we make paper figures (general workflow)

These are Neo's standards for scientific figures, from his feedback across several papers, and the process that has
produced figures he approved. Use them for any paper or topic.

## Standards
- **Show the real thing, beautifully.** If the paper is about graphs, draw real graphs. If it uses an analogy (a map, a
  game, a physical system), draw that analogy well. Avoid generic schematics such as circles and boxes. Rich imagery is
  welcome; clutter is not.
- **Every mark comes from real data or exact maths.** When a mark is drawn for clarity (positions, geography, layout), the
  caption says which marks are schematic.
- **One story per figure.** Each panel serves that story. Compact, no boxes around panels, no lines between panels; panel
  letters are enough.
- **Colour carries meaning.**
  - Choose a small palette, usually two accent colours on white, with structure in dark hairlines and pale greys.
  - Tie each accent to the paper's central contrast (method against baseline, one regime against another), and keep that
    mapping identical in every figure.
  - Balance the accents: no figure dominated by one colour unless the data honestly has only one side. A comparison shows
    both sides in their colours.
- **Strokes are thin and single.** Highlight with a light tint band, never a double outline. No grid lines unless they
  mean something.
- **Alignment is exact.** Side-by-side charts share baselines and tops, and nothing sits "lifted" by a hair. Snap panels to
  one grid.
- **Little text in panels.** Panels carry short labels; explanations go in the caption.
- **Use the space well.** No large empty regions and no cramped clusters. A different kind of chart gets its own panel
  letter and enough room.
- **Linear axes** that read at once are preferred to clever log plots, unless a log scale is the point.
- **Labels never overlap geometry.** Insets and magnifiers get roomy areas.
- **Accuracy comes before beauty.** Every number printed in a figure is checked against its source file.
- **Terms match the text.** A label uses the paper's own term for the thing, defined once, the same in every figure.

## Process
1. **Read Neo's words.** Collect everything he has said about figures for this paper, verbatim, plus any figures he
   approved before. Make an inventory, so no approved figure is dropped in a rebuild.
2. **Candidates before building.** For a new visual idea, make 2–3 distinct candidates and put them on one contact sheet.
   Image-model sketches may serve as style references only; the final marks come from code and data. Neo picks.
   - Never ask him to approve a design described only in words: "I have to see things."
3. **Plan.** One table mapping each figure to its story, its panels, its data files and the parts reused from earlier
   figures.
4. **Build one or two figures first and stop.** Make a contact sheet; Neo reviews the direction before the rest is built.
5. **Check each figure before anyone sees it:**
   - render at print resolution (300 dpi) and zoom into every panel; check fine strokes and tints at 600 dpi;
   - measure the colour balance (pixel area per accent colour) and report it;
   - check every printed number against its data file, ideally asserted by the same script that generates the paper's
     numbers;
   - confirm that labels and terms match the paper's text;
   - list the schematic marks for the caption.
6. **Stage, don't overwrite.**
   - New renders go to a staging folder, never over the files the paper builds from.
   - One person checks a batch and hands the writer a single list of figures and captions to move in, so a figure and its
     caption never drift apart.
7. **Integrate and rebuild** with no broken references and no unchecked numbers.
8. **Report:** what was built, the colour balance, the schematic marks, the numbers checked and the file paths.

## Mistakes that have happened once (avoid them)
- Dropping a figure Neo had already approved when rebuilding a figure set.
- Letting one colour dominate.
- Double outlines and grid artefacts.
- Panels misaligned by a hair.
- A label using a word that means something else in the paper.
- A number taken from the wrong run, or a mean presented as a worst case.
- Re-rendering a figure in place while the paper is being built, which leaves a new figure under an old caption.
