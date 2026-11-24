// The tutorial, chapter 7.4 (tutorial/geometry/linearized-gravity.md), its second diagram: the four steps from the
// curvature of a weak field to the linearized field equation, four boxes joined by thin ink arrows. Each box, outlined
// in thin ink, holds a short name and under it one equation: 1, "7.2's curvature, contracted", eq:ricci; 2, "harmonic
// gauge, d^mu hbar_mu nu = 0", R_mu nu = -(1/2) box h_mu nu; 3, "the Einstein tensor", G_mu nu = -(1/2) box hbar_mu nu;
// 4, "7.3's equation", box hbar_mu nu = -16 pi G T_mu nu / c^4, its outline heavier. Beside the arrow from 1 to 2,
// "three terms cancel". The curvature's symbols (R, G) in the curvature's colour, h and hbar in the field's, T in
// matter's; Newton's G, the derivatives and the numbers in ink.
// Departures from the diagram's comment: the boxes stand in one column at every width, read downward, not in a strip
// at 1440 px and a 2 x 2 grid on a phone, so that one drawing about 200 points wide keeps the first equation on one
// line and its text readable on a phone; the note "three terms cancel" therefore stands beside its arrow, not under it.
// Exact: the equations, each asserted in tut-linear-lib.js on a test field (a sum of plane waves of arbitrary
// amplitudes and wavevectors): 7.2's curvature contracted is eq:ricci term by term; for the field made harmonic,
// R_mu nu = -(1/2) box h_mu nu and G_mu nu = -(1/2) box hbar_mu nu, so G = (8 pi G / c^4) T gives the last box.
// Nothing is drawn to scale.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, HAIR } from './tut-pot-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, CURV, FIELD, MATTER } from './tut-linear-lib.js';

const name = 'tut-linear-steps';
const check = checker(name);

const PAD_X = 6.5;                         // a box's ink to its outline, across
const PAD_Y = 4.6;                         // and up and down
const NAME_AIR = 3.6;                      // a box's name to its equation
const OUTLINE = HAIR + 0.1;                // a box's outline
const HEAVY = 1.05;                        // the last box's outline
const ROUND = 2;                           // the outlines' corners
const ARROW = 14;                          // between the boxes, the arrows' length

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const R = `{\\color{${CURV}}R}`, Gc = `{\\color{${CURV}}G}`, h = `{\\color{${FIELD}}h}`, hb = `{\\color{${FIELD}}\\bar h}`, T = `{\\color{${MATTER}}T}`;
	const steps = [
		{ name: "\\text{7.2's curvature, contracted}",
			eq: `${R}_{\\mu\\nu} = \\tfrac12\\bigl(\\partial_\\alpha\\partial_\\mu${h}^\\alpha{}_\\nu + \\partial_\\alpha\\partial_\\nu${h}^\\alpha{}_\\mu - \\partial_\\mu\\partial_\\nu${h}^\\alpha{}_\\alpha - \\Box${h}_{\\mu\\nu}\\bigr)` },
		{ name: `\\text{harmonic gauge, }\\partial^\\mu${hb}_{\\mu\\nu} = 0`, eq: `${R}_{\\mu\\nu} = -\\tfrac12\\Box${h}_{\\mu\\nu}` },
		{ name: '\\text{the Einstein tensor}', eq: `${Gc}_{\\mu\\nu} = -\\tfrac12\\Box${hb}_{\\mu\\nu}` },
		{ name: "\\text{7.3's equation}", eq: `\\Box${hb}_{\\mu\\nu} = -16\\pi G\\,${T}_{\\mu\\nu}/c^4`, heavy: true }
	];
	// every name carries a strut, so that the names share their height
	const strut = (src) => `\\vphantom{(}${src}`;
	const probes = await Promise.all(steps.flatMap((s) => [placed(strut(s.name), 0, 0, 0, 0, INK), placed(s.eq, 0, 0, 0, 0, INK)]));
	const wide = Math.max(...probes.map((p) => p.box.r - p.box.l));
	const nameH = Math.max(...probes.filter((_, i) => i % 2 === 0).map((p) => p.box.b - p.box.t));
	const eqH = Math.max(...probes.filter((_, i) => i % 2 === 1).map((p) => p.box.b - p.box.t));
	const W = wide + 2 * PAD_X, H = nameH + NAME_AIR + eqH + 2 * PAD_Y;
	const l = ORIGIN - W / 2, r = ORIGIN + W / 2;
	check(probes[1].box.r - probes[1].box.l === wide, 'the first equation is not the widest line');

	let top = ORIGIN - 2 * (H + ARROW);
	const boxes = [];
	for (const [k, s] of steps.entries()) {
		const w = s.heavy ? HEAVY : OUTLINE, o = w / 2;
		const b = { l, r, t: top, b: top + H };
		S.raw(`<rect x="${(l + o).toFixed(2)}" y="${(top + o).toFixed(2)}" width="${(W - w).toFixed(2)}" height="${(H - w).toFixed(2)}" rx="${ROUND}" fill="none" stroke="${INK}" stroke-width="${w}"/>`, 1);
		S.mark([[l + o, top + o], [r - o, top + o], [r - o, b.b - o], [l + o, b.b - o], [l + o, top + o]], o, `box ${k + 1}`);
		const nm = await placed(strut(s.name), ORIGIN, top + PAD_Y, 0.5, 0, INK);
		// the equation centred in the room under the name
		const eq = await placed(s.eq, ORIGIN, top + PAD_Y + nameH + NAME_AIR + eqH / 2, 0.5, 0.5, INK);
		L.push(nm, eq);
		check(eq.box.l >= l + PAD_X - 1e-6 && eq.box.r <= r - PAD_X + 1e-6, `box ${k + 1}: the equation leaves its box`);
		boxes.push(b);
		top = b.b + ARROW;
	}
	check(boxes.every((b) => near(b.b - b.t, H, 1e-9) && near(b.r - b.l, W, 1e-9)), 'the boxes differ in size');

	// ---- the arrows, from each box to the next, and the note beside the first
	const arrows = [];
	for (let k = 0; k < 3; k++) {
		const y0 = boxes[k].b + 1.6, y1 = boxes[k + 1].t - 1.2;
		arrows.push(S.arrow([ORIGIN, y0], [ORIGIN, y1], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 2, what: `the arrow ${k + 1} to ${k + 2}` }));
	}
	check(arrows.every((a) => near(a.L, arrows[0].L, 1e-9)), 'the arrows differ');
	const note = await placed('\\text{three terms cancel}', ORIGIN + LABEL_GAP + 2.4, (boxes[0].b + boxes[1].t) / 2, 0, 0.5, INK);
	L.push(note);
	check(note.box.r < r, 'the note reaches past the boxes');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, boxes: { W, H } };
	return finish(S, L, [180, 300]);
}
