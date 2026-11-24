// The tutorial, chapter 13.1 (tutorial/what-a-field-keeps/push-and-pass.md), its second diagram: the terms of the
// loss pulled apart by radius and by turn. Left, the lopsided body of the chapter's interactive seen along the path: two
// stone lumps, 0.7 M at (0.27 - 0.09i) R and 0.3 M at (-0.63 + 0.21i) R, their centre of mass the origin (a small ink
// dot), inside the faint dotted circle |w| = R that holds the body; round it, impact points as steel beads on three
// circles of radii 1.5, 2.2 and 3 R, twelve beads each, on twelve common directions; the annulus between the inner and
// the outer circle faintly shaded. Right, the grid of the terms (p, q) for p + q from 0 to 4: a row for each total
// degree, labelled at the left with its power |b|^-(p+q+2), a column for each q - p from -4 to 4, numbered along the
// top under e^{i(q-p) phi}; one dot per term at its exact place, so that the row p + q = n has n + 1 dots; the dots
// (0, q) and (q, 0), the bending's terms, filled, on the two outer diagonals, the others open.
// Departures from the diagram's comment: the columns are numbered by q - p under the one heading e^{i(q-p) phi}, since
// nine exponentials would not fit over the columns; the circles of beads are named by their radii, each just outside
// it at the bottom, half-way between two beads, and one bead is named b, the impact point of the chapter's text.
// Exact: the grid (tut-pass-lib.js asserts each term's place, the counts p + q + 1 per row, (n + 1)(n + 2)/2 in all and
// 1 + 2n on the edges, against the chapter's table); the lumps' places and the origin at their centre of mass; the
// radii of the circles in units of R; the beads' directions. Schematic, as the caption says: the body, the number of
// beads; the lumps' sizes (radii as the cube roots of their masses, equal densities) and the beads' size. Pictorial:
// the stone (the sawn stone of sprites/hair/ball-face.png, lit as a ball by tut-pass-lib.js).
import { INK, DIM, FAINT, tex } from '../lib.js';
import { STEEL } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, HAIR, SIZE, n2 } from './tut-pot-lib.js';
import { chapter, row, TOP, LUMPS, RINGS, BEADS, View, body, stonePicture, stoneColours, near } from './tut-pass-lib.js';

const name = 'tut-pass-annulus';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const R = 21;                                   // the body's radius
const SMALL = 0.235;                            // the lighter lump's radius, in R; the heavier's is (7/3)^(1/3) times it
const BEAD = 1.75;
const TURN = 15;                                // the first bead's direction, degrees from the right
const BAND = '#eeebe5';                          // the annulus: the page's neutral tint (drawing.ts)
const GAP = 34;                                 // from the outer circle to the grid's row labels
const DX = 13, DY = 15;                         // the grid's columns and rows
const DOT = 2.15, RING_LINE = 0.6;              // a term's dot, and an open dot's ring
const caption = 'Look first at the grid: every term of the loss has its own power of the distance (its row) and its own number of turns round the body (its column), so losses over a band of radii pull every term apart. The filled dots on the two edges are the only terms the bending holds. The body and the number of beads are chosen for the drawing.';

/** A TeX label whose baseline is at y, its ink box's point ax (0 left, 1 right) at x. */
async function onBaseline(src, x, y, ax, color = INK, size = SIZE) {
	const g = await tex(src, [0, 0], size, 'lB', color);
	const b = boxOf(g);
	const dx = x - (b.l + ax * (b.r - b.l));
	return { src, svg: `<g transform="translate(${n2(dx)},${n2(y)})">${g}</g>`, box: { l: b.l + dx, r: b.r + dx, t: b.t + y, b: b.b + y } };
}

export default async function () {
	const { state } = await chapter(check);
	state(name, 'pass-annulus', caption);
	const S = new Sheet(name);
	const L = [];
	const c = [ORIGIN - 80, ORIGIN];
	const P = ([x, y]) => [c[0] + x * R, c[1] - y * R];

	// ---- the annulus, the circles, the beads
	const outer = RINGS[2] * R, inner = RINGS[0] * R;
	const circ = (r) => `M${n2(c[0] - r)},${n2(c[1])}a${n2(r)},${n2(r)} 0 1,0 ${n2(2 * r)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-2 * r)},0Z`;
	S.raw(`<path d="${circ(outer)}${circ(inner)}" fill="${BAND}" fill-rule="evenodd"/>`, 0);
	for (const k of RINGS) {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(k * R)}" fill="none" stroke="${FAINT}" stroke-width="${HAIR}"/>`, 0.5);
		S.mark(Array.from({ length: 181 }, (_, j) => P([k * Math.cos((j * Math.PI) / 90), k * Math.sin((j * Math.PI) / 90)])), HAIR / 2, `the circle ${k}`);
		for (let j = 0; j < BEADS; j++) {
			const a = ((TURN + (360 * j) / BEADS) * Math.PI) / 180;
			S.sphere(P([k * Math.cos(a), k * Math.sin(a)]), BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `a bead on ${k}`);
		}
	}
	check(RINGS[0] > 1.05, 'the inner circle is not outside the body');
	// the circle that holds the body, dotted (figs/passing.js)
	S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${R}" fill="none" stroke="${FAINT}" stroke-width="0.35" stroke-dasharray="1.1 1.7"/>`, 0.5);
	S.mark(Array.from({ length: 181 }, (_, j) => P([Math.cos((j * Math.PI) / 90), Math.sin((j * Math.PI) / 90)])), 0.2, 'the circle R');

	// ---- the lumps, lit stone balls of equal density, seen along the path
	const V = new View({ turn: 0, tilt: 0, scale: R, o: c });
	const colours = await stoneColours();
	for (const [i, l] of LUMPS.entries()) {
		const r = SMALL * Math.cbrt(l.m / LUMPS[1].m);
		check(Math.hypot(...l.w) + r < 0.95, `the lump ${i} reaches the circle R`);
		const B = body([l.w[0], l.w[1], 0], () => r);
		const pic = await stonePicture(`${name}-lump${i}`, B, V, { reach: r * 1.2, size: 0.9, colours, px: 8 });
		S.raw(pic.svg, 1);
		S.mark(pic.outline, 0.2, `the lump ${i}`);
		// the outline is the exact circle
		check(pic.outline.every(([x, y]) => near(Math.hypot(x - P(l.w)[0], y - P(l.w)[1]), r * R, 0.02)), `the lump ${i}'s outline`);
	}
	// the radii, each just outside its circle at the bottom, half-way between two beads; one bead named b
	check(((270 - TURN) * BEADS) % 360 === 180, 'the bottom is not half-way between two beads');
	for (const [k, rad] of RINGS.entries()) {
		const q = P([0, -rad]);
		L.push(await S.clear(`${rad}R`, q[0], q[1] + HAIR / 2 + LABEL_GAP + 0.2, 0.5, 0, [0, 1], { color: DIM, size: 7.5 }));
		void k;
	}
	{
		const a = ((TURN + 30) * Math.PI) / 180, q = P([RINGS[2] * Math.cos(a), RINGS[2] * Math.sin(a)]);
		L.push(await S.clear('b', q[0] + BEAD + LABEL_GAP, q[1] - BEAD - LABEL_GAP, 0, 1, [Math.cos(a), -Math.sin(a)], { color: INK }));
	}

	// ---- the grid
	const x0 = c[0] + outer + GAP + 28;              // the column q - p = 0 is at x0 + 4 DX
	const y0 = c[1] - 1.5 * DY;                        // the row p + q = 0
	const at = (t) => [x0 + (t.col + TOP) * DX, y0 + t.row * DY];
	for (let n = 0; n <= TOP; n++) {
		for (const t of row(n)) {
			const [x, y] = at(t);
			if (t.bending) {
				S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${INK}"/>`, 2);
				S.mark([[x, y]], DOT, `the term ${t.p},${t.q}`);
			} else {
				S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(DOT - RING_LINE / 2)}" fill="none" stroke="${INK}" stroke-width="${RING_LINE}"/>`, 2);
				S.mark([[x, y]], DOT, `the term ${t.p},${t.q}`);
			}
		}
		// the row's power of the distance, at the left
		L.push(await placed(`|b|^{-${n + 2}}`, x0 - DX - 6, y0 + n * DY, 1, 0.5, DIM));
	}
	// the columns' numbers along the top, and their heading
	const numbers = [];
	for (let j = -TOP; j <= TOP; j++) {
		const lab = await placed(j < 0 ? `{-}${-j}` : String(j), x0 + (j + TOP) * DX, y0 - DY + 1, 0.5, 0.5, DIM, 7.5);
		numbers.push(lab);
		L.push(lab);
	}
	// the two headings on one baseline, the lower of them clear of the numbers
	const head = Math.min(...numbers.map((l) => l.box.t));
	const probe = await Promise.all([onBaseline('e^{i(q - p)\\varphi}', 0, 0, 0.5), onBaseline('|b|^{-(p + q + 2)}', 0, 0, 1)]);
	const base = head - 4 - Math.max(...probe.map((l) => l.box.b));
	L.push(await onBaseline('e^{i(q - p)\\varphi}', x0 + TOP * DX, base, 0.5));
	L.push(await onBaseline('|b|^{-(p + q + 2)}', x0 - DX - 6, base, 1));
	// every row p + q = n holds n + 1 dots, each at its own column
	for (let n = 0; n <= TOP; n++) check(new Set(row(n).map((t) => at(t)[0])).size === n + 1, `the row ${n}`);

	S.checkAll(L);
	return finish(S, L, [280, 380]);
}
