// The tutorial, section 7.4 (tutorial/geometry/linearized-gravity.md), its second diagram: the four steps from the
// curvature of a weak field to the linearized field equation, four boxes joined by thin ink arrows. Each box, outlined
// in thin ink, holds a short name and under it one equation: 1, "the curvature, contracted" (7.2's), eq:ricci; 2, "harmonic
// gauge, d^mu hbar_mu nu = 0", R_mu nu = -(1/2) box h_mu nu; 3, "the Einstein tensor", G_mu nu = -(1/2) box hbar_mu nu;
// 4, "Einstein's equation" (7.3's; the drawing names topics, never section numbers, which differ between the book
// and the site), box hbar_mu nu = -16 pi G T_mu nu / c^4, its outline heavier. Beside the arrow from 1 to 2,
// "three terms cancel". The curvature's symbols (R, G) in the curvature's colour, h and hbar in the field's, T in
// matter's; Newton's G, the derivatives and the numbers in ink.
// Departures from the diagram's comment: on the site the boxes stand in one column at every width, read downward, not
// in a strip at 1440 px and a 2 x 2 grid on a phone, so that one drawing about 200 points wide keeps the first equation
// on one line and its text readable on a phone; the note "three terms cancel" therefore stands beside its arrow, not
// under it. In the printed book (figureLayout 'book') the same four boxes stand in a 2 x 2 grid read as text is, about
// 440 points wide: 1 -> 2 across the top, an elbowed arrow from 2 down and back to 3, 3 -> 4 across the bottom; the
// horizontal arrows join the boxes at their equations' height, and the note stands above the first, in two lines.
// Exact: the equations, each asserted in tut-linear-lib.js on a test field (a sum of plane waves of arbitrary
// amplitudes and wavevectors): 7.2's curvature contracted is eq:ricci term by term; for the field made harmonic,
// R_mu nu = -(1/2) box h_mu nu and G_mu nu = -(1/2) box hbar_mu nu, so G = (8 pi G / c^4) T gives the last box.
// Nothing is drawn to scale.
import { Sheet, ORIGIN, finish, checker, placed, near, boxOf, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, SIZE } from './tut-pot-lib.js';
import { INK, tex } from '../lib.js';
import { chapter, palette, stack, CURV, FIELD, MATTER } from './tut-linear-lib.js';

const name = 'tut-linear-steps';
const check = checker(name);

const PAD_X = 6.5;                         // a box's ink to its outline, across
const PAD_Y = 4.6;                         // and up and down
const NAME_AIR = 3.6;                      // a box's name to its equation
const OUTLINE = HAIR + 0.1;                // a box's outline
const HEAVY = 1.05;                        // the last box's outline
const ROUND = 2;                           // the outlines' corners
const ARROW = 14;                          // between the boxes, the arrows' length
const BOOK = globalThis.figureLayout === 'book';
const GAP_X = 48;                          // the book: between the columns (the note, two lines, stands in it)
const GAP_Y = 20;                          // the book: between the rows (the elbow runs along its middle)

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const R = `{\\color{${CURV}}R}`, Gc = `{\\color{${CURV}}G}`, h = `{\\color{${FIELD}}h}`, hb = `{\\color{${FIELD}}\\bar h}`, T = `{\\color{${MATTER}}T}`;
	const steps = [
		{ name: "\\text{the curvature, contracted}",
			eq: `${R}_{\\mu\\nu} = \\tfrac12\\bigl(\\partial_\\alpha\\partial_\\mu${h}^\\alpha{}_\\nu + \\partial_\\alpha\\partial_\\nu${h}^\\alpha{}_\\mu - \\partial_\\mu\\partial_\\nu${h}^\\alpha{}_\\alpha - \\Box${h}_{\\mu\\nu}\\bigr)` },
		{ name: `\\text{harmonic gauge, }\\partial^\\mu${hb}_{\\mu\\nu} = 0`, eq: `${R}_{\\mu\\nu} = -\\tfrac12\\Box${h}_{\\mu\\nu}` },
		{ name: '\\text{the Einstein tensor}', eq: `${Gc}_{\\mu\\nu} = -\\tfrac12\\Box${hb}_{\\mu\\nu}` },
		{ name: "\\text{Einstein's equation}", eq: `\\Box${hb}_{\\mu\\nu} = -16\\pi G\\,${T}_{\\mu\\nu}/c^4`, heavy: true }
	];
	// every line is set on a baseline, so that the names (and the equations) of boxes side by side share theirs: a
	// line's ink rises `up` above its baseline and falls `down` below it
	const onBase = async (src, x, y) => {
		const g = await tex(src, [x, y], SIZE, 'cB', INK), b = boxOf(g), dx = x - (b.l + b.r) / 2;   // its ink centred on x
		return { src, svg: `<g transform="translate(${dx.toFixed(3)},0)">${g}</g>`, box: { ...b, l: b.l + dx, r: b.r + dx } };
	};
	const probes = await Promise.all(steps.flatMap((s) => [onBase(s.name, 0, 0), onBase(s.eq, 0, 0)]));
	const wide = Math.max(...probes.map((p) => p.box.r - p.box.l));
	const up = (odd) => Math.max(...probes.filter((_, i) => i % 2 === odd).map((p) => -p.box.t));
	const down = (odd) => Math.max(...probes.filter((_, i) => i % 2 === odd).map((p) => p.box.b));
	const nameH = up(0) + down(0), eqH = up(1) + down(1);
	const W = wide + 2 * PAD_X, H = nameH + NAME_AIR + eqH + 2 * PAD_Y;
	const l = ORIGIN - W / 2, r = ORIGIN + W / 2;
	check(probes[1].box.r - probes[1].box.l === wide, 'the first equation is not the widest line');

	// where each box stands: one column on the site; in the book a 2 x 2 grid, read row by row
	const at = BOOK
		? [0, 1, 2, 3].map((k) => [ORIGIN + (k % 2 === 0 ? -1 : 1) * (W + GAP_X) / 2 - W / 2, ORIGIN + (k < 2 ? -1 : 1) * (H + GAP_Y) / 2 - H / 2])
		: [0, 1, 2, 3].map((k) => [l, ORIGIN - 2 * (H + ARROW) + k * (H + ARROW)]);
	const boxes = [];
	for (const [k, s] of steps.entries()) {
		const w = s.heavy ? HEAVY : OUTLINE, o = w / 2;
		const [bl, top] = at[k], cx = bl + W / 2;
		const b = { l: bl, r: bl + W, t: top, b: top + H, cx };
		S.raw(`<rect x="${(bl + o).toFixed(2)}" y="${(top + o).toFixed(2)}" width="${(W - w).toFixed(2)}" height="${(H - w).toFixed(2)}" rx="${ROUND}" fill="none" stroke="${INK}" stroke-width="${w}"/>`, 1);
		S.mark([[bl + o, top + o], [b.r - o, top + o], [b.r - o, b.b - o], [bl + o, b.b - o], [bl + o, top + o]], o, `box ${k + 1}`);
		const nm = await onBase(s.name, cx, top + PAD_Y + up(0));
		const eq = await onBase(s.eq, cx, top + PAD_Y + nameH + NAME_AIR + up(1));
		b.eqY = top + PAD_Y + nameH + NAME_AIR + eqH / 2;
		L.push(nm, eq);
		check(eq.box.l >= bl + PAD_X - 1e-6 && eq.box.r <= b.r - PAD_X + 1e-6, `box ${k + 1}: the equation leaves its box`);
		boxes.push(b);
	}
	check(boxes.every((b) => near(b.b - b.t, H, 1e-9) && near(b.r - b.l, W, 1e-9)), 'the boxes differ in size');

	// ---- the arrows, from each box to the next, and the note beside (the book: above) the first
	const arrows = [];
	const head = { color: INK, width: AXIS, head: AXIS_HEAD, layer: 2 };
	let note;
	if (!BOOK) {
		for (let k = 0; k < 3; k++) {
			const y0 = boxes[k].b + 1.6, y1 = boxes[k + 1].t - 1.2;
			arrows.push(S.arrow([ORIGIN, y0], [ORIGIN, y1], { ...head, what: `the arrow ${k + 1} to ${k + 2}` }));
		}
		check(arrows.every((a) => near(a.L, arrows[0].L, 1e-9)), 'the arrows differ');
		note = await placed('\\text{three terms cancel}', ORIGIN + LABEL_GAP + 2.4, (boxes[0].b + boxes[1].t) / 2, 0, 0.5, INK);
		check(note.box.r < r, 'the note reaches past the boxes');
	} else {
		// across: at the equations' height, from one box's right side to the next one's left
		const across = (p, q, what) => S.arrow([p.r + 1.6, p.eqY], [q.l - 1.2, q.eqY], { ...head, what });
		arrows.push(across(boxes[0], boxes[1], 'the arrow 1 to 2'));
		// the elbow: down from box 2, back along the middle of the gap between the rows, and down into box 3
		const ym = (boxes[1].b + boxes[2].t) / 2;
		S.path([[boxes[1].cx, boxes[1].b + 1.6], [boxes[1].cx, ym], [boxes[2].cx, ym], [boxes[2].cx, ym + 0.5]], { color: INK, width: AXIS, cap: 'butt', layer: 2, what: 'the elbow 2 to 3' });
		arrows.push(S.arrow([boxes[2].cx, ym], [boxes[2].cx, boxes[2].t - 1.2], { ...head, what: 'the arrow 2 to 3' }));
		arrows.push(across(boxes[2], boxes[3], 'the arrow 3 to 4'));
		check(near(arrows[0].L, arrows[2].L, 1e-9) && near(boxes[0].eqY, boxes[1].eqY, 1e-9), 'the arrows across differ');
		const mid = (boxes[0].r + boxes[1].l) / 2;
		const probe = await stack(['\\text{three terms}', '\\text{cancel}'], mid, 0, 0.5, INK);
		note = await stack(['\\text{three terms}', '\\text{cancel}'], mid, boxes[0].eqY - LABEL_GAP - 1.2 - (probe.box.b - probe.box.t), 0.5, INK);
		check(note.box.l > boxes[0].r + LABEL_GAP && note.box.r < boxes[1].l - LABEL_GAP && note.box.t > boxes[0].t, 'the note leaves the gap between the boxes');
	}
	L.push(note);

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, boxes: { W, H } };
	return finish(S, L, BOOK ? [400, 460] : [180, 300]);
}
