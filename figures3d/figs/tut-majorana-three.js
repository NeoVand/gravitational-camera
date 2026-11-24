// The tutorial, chapter 8.4 (tutorial/quantum/spin.md), its second diagram: three readings and their four stars. Three
// small spheres side by side, each drawn as chapter 6.6 draws the sky (figs/tut-spin-lib.js): a thin outline, a veil
// over what lies behind, the equator solid and faint in front and dashed behind, and a faint z axis. On each, the
// reading's four Majorana stars in the curvature's colour, coincident ones as touching dots (the paper's figure
// 'stars'), and from the centre the Bloch vector of one of its four spins, b = P/u, in ink. Left, "one wave": four
// stars at the north pole, the direction of travel k, and an arrow of length 1 up to them. Middle, "one body at
// rest": two stars at each pole (the line to the body) and a small open circle at the centre, b = 0. Right, "a body
// and a wave" along the line to it, its tide E+ equal to the body's w (the paper's type II): two stars at the north
// pole, one each at (+-0.87, 0, -0.5), and an arrow of length 0.4 up. No orange or blue.
// Departures from the diagram's comment: the arrows are named with the chapter's final text, |b| = 1, b = 0 and
// |b| = 0.4 (b = P/u, which the caption states once), not "P/u"; the spheres stand side by side at every width (the
// site shows one drawing at every width; at 390 px each is still about 100 px across). The wave's stars are named k,
// the direction of travel the comment names. The faint z axis runs from pole to pole, stopping short of the stars.
// Exact: every star, the root of the quartic m(z)^T W m(z) of each reading mapped by n(z) (a root lost from the top a
// star at the south pole), and every arrow, P/u from the reading's E and B, both computed and asserted in
// tut-spin-lib.js against the chapter's text, and P/u checked against the Bloch vector of one spin of the symmetric
// state built from the stars; the view, orthographic, from 17 degrees above the equator. Schematic: the dots' sizes.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, VEC, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { INK, RULE, PAGE } from '../lib.js';
import { chapter, palette, near, len, view, sky, CURV, STAR, STAR_STEP, STAR_EDGE } from './tut-spin-lib.js';

const name = 'tut-majorana-three';
const check = checker(name);

const R = 50;                        // each sphere's radius, points
const GAP = 12;                      // between two spheres' outlines
const AZ = -70, EL = 17;             // the view: the camera's azimuth from x toward y, and its height, degrees
const AXIS_W = 0.4, AXIS_OPACITY = 0.8;
const OPEN = 1.9, OPEN_W = 0.6;      // the open circle at the centre for b = 0
const TITLES = ['\\text{one wave}', '\\text{one body at rest}', '\\text{a body and a wave}'];

export default async function () {
	const { readings } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const v = view(AZ, EL);
	const cluster = STAR * (1 + STAR_STEP) + STAR_EDGE / 2;     // half the width of two touching dots
	const centres = [-1, 0, 1].map((k) => [ORIGIN + k * (2 * R + GAP), ORIGIN]);

	for (const [i, r] of readings.entries()) {
		const K = sky(S, check, centres[i], R, v);
		const { at, front } = K;
		const C = at([0, 0, 0]);
		// ---- behind: the equator's back half and the stars that face away; then the veil and the outline
		K.equator();
		const groups = r.groups.map((g) => ({ ...g, front: front(g.n) }));
		const drawn = [];
		for (const g of groups) if (!g.front) drawn.push({ g, dots: K.star(g.n, g.count, CURV, `${r.key}: the star at ${g.n.map((x) => x.toFixed(2))}`) });
		K.veil();
		// ---- the z axis, pole to pole, inside the ball
		{
			// clear of the stars at the south pole, which lie behind
			const south = groups.some((g) => near(g.n[2], -1));
			const a = at([0, 0, -1]), b = at([0, 0, 1]);
			if (south) a[1] -= STAR + STAR_EDGE / 2 + 0.6;
			// and under the stars at the north pole, so that it does not show between their dots
			const top = groups.find((g) => near(g.n[2], 1));
			if (top) b[1] += (top.count === 4 ? cluster : STAR + STAR_EDGE / 2) + 0.6;
			S.raw(`<path d="M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}" stroke="${RULE}" stroke-width="${AXIS_W}" stroke-opacity="${AXIS_OPACITY}" fill="none"/>`, 1);
			S.mark([a, b], AXIS_W / 2, `${r.key}: the z axis`);
		}
		for (const g of groups) if (g.front) drawn.push({ g, dots: K.star(g.n, g.count, CURV, `${r.key}: the star at ${g.n.map((x) => x.toFixed(2))}`) });
		check(groups.reduce((s, g) => s + g.count, 0) === 4, `${r.key}: not four stars`);

		// ---- one spin's Bloch vector, b = P/u, along z
		check(near(r.b[0], 0) && near(r.b[1], 0) && r.b[2] >= 0, `${r.key}: b is not along +z`);
		const size = len(r.b);
		const tip = at(r.b);
		let label;
		if (size === 0) {
			S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${OPEN}" fill="${PAGE}" stroke="${INK}" stroke-width="${OPEN_W}"/>`, 4);
			S.mark([C], OPEN + OPEN_W / 2, `${r.key}: b = 0`);
			label = await S.clear('\\mathbf b = 0', C[0] + OPEN + LABEL_GAP + 1, C[1], 0, 0.5, [1, 0]);
		} else {
			// the wave's arrow ends at the foot of its stars (the north pole), the other's at 0.4
			const top = size === 1 ? [tip[0], tip[1] + cluster + 0.9] : tip;
			check(size !== 1 || near(r.b[2], 1), 'the wave\'s arrow does not reach the pole');
			const A = S.arrow(C, top, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `${r.key}: b` });
			const txt = size === 1 ? '|\\mathbf b| = 1' : `|\\mathbf b| = ${size.toFixed(1)}`;
			check(size === 1 ? near(size, 1) : size.toFixed(1) === '0.4', `${r.key}: the printed |b|`);
			const y = size === 1 ? C[1] + (A.B[1] - C[1]) * 0.7 : A.B[1] - 3;
			label = await S.clear(txt, C[0] + VEC / 2 + LABEL_GAP + 1.2, y, 0, 0.5, [1, 0]);
		}
		L.push(label);
		if (r.key === 'wave') {
			const n = drawn.find((d) => near(d.g.n[2], 1));
			const right = Math.max(...n.dots.map((q) => q[0])) + STAR + STAR_EDGE / 2;
			L.push(await S.clear('\\hat k', right + LABEL_GAP + 0.6, n.dots[0][1] + STAR, 0, 0.5, [1, 0]));
		}
		// ---- the title, over the sphere
		L.push(await placed(TITLES[i], C[0], C[1] - R - 7, 0.5, 1, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = readings.map((r) => ({ key: r.key, stars: r.groups.map((g) => [g.n, g.count]), b: r.b }));
	return finish(S, L, [240, 340]);
}
