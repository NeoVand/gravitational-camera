# The tutorial's sources (for agents adding chapters)

Read `design/tutorial/STYLE.md` (binding), `PLAN.md` and `NOTATION.md` first. This file says only how a chapter gets
from Markdown to the site.

## Files

- `parts.yaml`: the parts, chapters (id, slug, title, short title, size, status) and routes. A chapter's page is
  `/tutorial/<slug>/` and its source `tutorial/<slug>.md`. Only `status: published` chapters are built and linked.
- `macros.tex`: the colour-role macros `\matter`, `\field`, `\curv`, `\obs`, `\light`, the symbol macro
  `\sym{key}{…}`, and tutorial-only notation. `paper/macros.tex` (`\tE`, `\tB`, `\dd`, `\kB`, `\SNR`) is read too.
  Plain `\newcommand` only.
- `symbols.yaml`: the symbols a reader can click (`\sym{key}{…}`); an unknown key fails the build.
- `glossary.yaml`: the terms, for `/tutorial/glossary/`.
- `_fixtures/sample.md`: a test chapter using every block; never published (shown at `/dev/tutorial-sample/`).
- `lint.mjs`: the style lint (`pnpm run lint` in `app/`, or `node tutorial/lint.mjs [files]`).

## How content flows

1. `app/src/lib/server/sources.ts` prepends the macros to the chapter and runs pandoc
   (`markdown+tex_math_dollars+fenced_divs+footnotes+citations+raw_tex+yaml_metadata_block`, with `--citeproc` and
   the paper's `refs.bib`). pandoc expands the macros, so KaTeX sees `\htmlClass{q-curv}{…}`.
2. `app/src/lib/tutorial/render.ts` turns pandoc's tree into HTML blocks, sharing the paper's renderer
   (`app/src/lib/render/pandoc.ts`) for text, links, maths, lists and tables. It numbers equations per chapter,
   turns footnotes into margin notes, the fenced divs into boxes, and pulls the paper's equations and figures by
   label from the paper's own pandoc tree. Every unknown label, box, live figure or symbol is a build error.
3. The loader of `app/src/routes/tutorial/[part]/[chapter]/` checks the chapter against `parts.yaml` and hands the
   result to `app/src/lib/tutorial/ChapterPage.svelte`, which sets it as the paper is set.

## Adding a chapter

1. Write `tutorial/<part-slug>/<chapter-slug>.md` with the front matter below, then set its `status` in
   `parts.yaml` to `published` when it is ready (the page, the contents and the paper's margin follow).
2. Add the symbols it marks with `\sym` to `symbols.yaml` and its terms to `glossary.yaml`.
3. If the paper should point to it, add entries to `app/src/lib/tutorial/paper-links.ts`.
4. Run `pnpm run lint`, `pnpm exec vitest --run` and look at the page in both themes at 1440 and 390 px.

```markdown
---
id: '1.4'
title: 'Tides: the difference in gravity'
question: 'How does the pull of a mass change across a ring one metre wide?'
part: '1'
requires: ['1.2', '1.3']
paper: [eq:tidal, eq:newton]
figures: [fig:tidal]
live: [tidal-rings]
depth: A
---
```

## What a chapter can write

| Markdown | Result |
|---|---|
| `## A tide is a difference` | a section, listed in the contents rail |
| `$$ … \label{eq:hessian} $$` | a numbered display (numbers restart in each chapter) |
| `[](#eq:hessian)` or `\eqref{eq:hessian}` | "(2)", linked |
| `[](#a-tide-is-a-difference)` | the section's title, linked |
| `[](/paper/#eq:tidal)` | the paper's number, linked into the paper |
| `{{paper eq:tidal}}` (its own paragraph) | the paper's equation, tagged "paper (1)" and linked |
| `{{paper fig:tidal}}` (its own paragraph) | the paper's figure with its caption |
| `text[^n]` and `[^n]: note` | a margin note (right margin at 1240 px and wider, a toggle below that) |
| `[@ThorneWinstein1999]` | a numbered citation from `paper/refs.bib`, listed at the chapter's end |
| `\curv{\tE}_{ij}`, `\sym{tidal-tensor}{\curv{\tE}}` | colour role; clickable symbol card |

Fenced divs (`::: name` … `:::`):

- `plain`: "In plain words", closed.
- `derivation`: "Derivation in full: <title>", closed; the title is a heading inside (`### …`) or `title="…"`.
- `gap`: "What this sketch skips".
- `example`: "Worked example: <title>" (title as for `derivation`).
- `check`: `### Q` then the question, `### A` then the answer, repeated; or a definition list (term = question).
- `problems`: `### Practice`, `### Stretch`, `### The paper`, in that order; each problem is followed by a
  `::: solution` div.
- `paper`: "Where the paper uses this". `deeper`: "Go deeper". `history`: "A little history[: title]", closed.
- `try {#live-id}`: the interactive figure registered under that id in `app/src/lib/tutorial/live.ts`, after the
  div's text (the prediction to make, then what to do).

`try` and `{{paper fig:…}}` stand at the top level of the chapter, not inside another box.
