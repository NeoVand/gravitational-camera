// The tutorial, section 3.4 (tutorial/noise/symmetric-matrices.md), its fourth diagram: the four spaces of the
// singular value decomposition. Left, the space of scenes, split into the plane of the patterns v_1 and v_2 that have
// gains (s_i > 0) and, at right angles to it, the null space, the scenes that give no reading. Right, the space of
// readings, split into the plane of the reading patterns u_1 and u_2, where every signal lands, and, at right angles
// to it, the rest, which only noise reaches. Across the middle, thin arrows carry v_1 to s_1 u_1 and v_2 to s_2 u_2,
// labelled with the gains, and a scene of the null space to the dot at zero. Each space is drawn in true 3D (an
// orthographic view, turned and tilted as lib.js's Panel does, as section 2.5's figs/tut-null-split.js), the right one
// seen as the mirror image of the left, so that the two face each other across the gap.
// Exact: a camera of three cells and three readings, A = s_1 u_1 v_1^T + s_2 u_2 v_2^T with s_1 = 1.5 and s_2 = 0.6, each
// space in its own coordinates: A v_i = s_i u_i and A v_3 = 0 (asserted), the v_i and the u_i perpendicular unit vectors
// (asserted), the planes spanned by the first two of each, the lines by the third, at right angles to the planes.
// Schematic: the particular camera, in units of the drawing; the planes' extent; and the dimensions, since the safe's
// scenes have K = 231 numbers and its readings N = 605, drawn as a plane and a line.
import { Panel, v3, tex, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, boxOf, VEC, VEC_HEAD, DASH, LABEL_GAP } from './tut-vec-lib.js';

const name = 'tut-svd-spaces';
const check = checker(name);

export const GAINS = [1.5, 0.6];
const TILT = 36, TURN = 24;                  // the view, degrees: the left space turned by -TURN, the right by +TURN
const SC = 40;                               // points per unit
const HALF = [1.6, 1.15];                    // the planes' half-sides along x and z, units
const APART = 160;                           // points between the two origins on the page
const LINE = [-0.6, 1.25];                   // the perpendicular lines, from and to (units)
const ANGLE = 8;                             // degrees: v_1 in its plane, from x toward the viewer (z)
const TINT = '#eeebe5';                      // the site's neutral tint of the page (drawing.ts THEME)
const MAP = 0.45;                            // the maps' stroke
const MAP_HEAD = 3.4;

const inPlane = (deg) => v3(Math.cos((deg * Math.PI) / 180), 0, Math.sin((deg * Math.PI) / 180));
const unit2 = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	// ---- the two spaces, each its own panel; the right one's turn is the left one's mirrored
	const PL = new Panel({ x: ORIGIN - APART / 2, y: ORIGIN, w: 0, h: 0, scale: SC, tilt: TILT, turn: -TURN });
	const PR = new Panel({ x: ORIGIN + APART / 2, y: ORIGIN, w: 0, h: 0, scale: SC, tilt: TILT, turn: TURN });
	const ink = new Sheet(PL, name), right = new Sheet(PR, name);
	const O = v3(0, 0, 0), up = v3(0, 1, 0);
	// the mirror: a world point (x, y, z) on the right is seen where (-x, y, z) is seen on the left, mirrored
	const probe = v3(0.7, 0.3, -0.4);
	check(near(PR.at(probe)[0] - PR.at(O)[0], -(PL.at(v3(-probe.x, probe.y, probe.z))[0] - PL.at(O)[0]), 1e-9) &&
		near(PR.at(probe)[1], PL.at(v3(-probe.x, probe.y, probe.z))[1], 1e-9), 'the right space is not the left one mirrored');

	// ---- the camera: v_1, v_2, v_3 and u_1, u_2, u_3 perpendicular unit vectors, A = sum s_i u_i v_i^T; u_1 and u_2
	// are the mirror images of v_1 and v_2, so that each image faces its pattern across the gap
	const V = [inPlane(ANGLE), inPlane(ANGLE + 90), up];
	const U = [inPlane(180 - ANGLE), inPlane(90 - ANGLE), up];
	for (const B of [V, U]) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) check(near(B[i].dot(B[j]), i === j ? 1 : 0, 1e-12), 'a basis is not orthonormal');
	const A = (x) => U[0].clone().multiplyScalar(GAINS[0] * V[0].dot(x)).add(U[1].clone().multiplyScalar(GAINS[1] * V[1].dot(x)));
	V.forEach((v, i) => {
		const want = i < 2 ? U[i].clone().multiplyScalar(GAINS[i]) : v3(0, 0, 0);
		check(A(v).distanceTo(want) < 1e-12, `A v${i + 1} is not ${i < 2 ? `s${i + 1} u${i + 1}` : 'zero'}`);
	});
	const img = [0, 1].map((i) => A(V[i]));
	check(img.every((p) => Math.abs(p.x) < HALF[0] - 0.08 && Math.abs(p.z) < HALF[1] - 0.08) && V.slice(0, 2).every((p) => Math.abs(p.x) < HALF[0] - 0.08 && Math.abs(p.z) < HALF[1] - 0.08), 'an arrow leaves its plane');

	// ---- the planes, and the lines at right angles to them: the null space in ink's dim tone, the readings' rest in
	// the noise's colour; below the plane dashed, as seen through it
	const square = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, c]) => v3(HALF[0] * a, 0, HALF[1] * c));
	for (const [S, color, what] of [[ink, DIM, 'the null space'], [right, ACCENT2, 'the rest']]) {
		S.P.polygon(square, { fill: TINT, layer: -3 });
		S.mark([...square, square[0]].map((p) => S.at(p)), 0, `${what}'s plane`);
		S.line(up.clone().multiplyScalar(LINE[0]), O, { color, width: 0.5, dash: DASH, layer: 0, what: `${what} below` });
		S.line(O, up.clone().multiplyScalar(LINE[1]), { color, width: 0.55, layer: 1, what });
	}

	// ---- the patterns and their images, in the first accent
	V.slice(0, 2).forEach((v, i) => ink.arrow(O, v, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: `v${i + 1}` }));
	img.forEach((p, i) => right.arrow(O, p, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: `s${i + 1} u${i + 1}` }));
	ink.dot(O);
	right.dot(O);
	const nullPoint = up.clone().multiplyScalar(0.85);
	ink.dot(nullPoint, { r: 1.05, color: DIM, what: 'a scene of the null space' });

	// ---- the right panel joins the left one's drawing and checks: its planes beneath, the rest above
	const sub = (items) => { const q = new Panel({ x: PR.x, y: PR.y, w: 0, h: 0, scale: SC }); q.rot = PR.rot; q.centre = PR.centre; q.items = items; return q.render('pr').body; };
	PL.items.push({ kind: 'raw', layer: -3, depth: 0, svg: sub(PR.items.filter((it) => it.layer < -1)) });
	PL.items.push({ kind: 'raw', layer: 1, depth: 0, svg: sub(PR.items.filter((it) => it.layer >= -1)) });
	ink.marks.push(...right.marks);
	ink.arrows.push(...right.arrows);

	// ---- the maps across the middle: quadratic arcs from each pattern's tip to its image's, and from the scene of the
	// null space to the zero of the readings, bowed by `bow` points (positive: down the page), their heads at the end
	const arc = (A2, B2, bow, gapA, gapB, what) => {
		const d = [B2[0] - A2[0], B2[1] - A2[1]], l = Math.hypot(...d), n = [-d[1] / l, d[0] / l];
		if (n[1] < 0) { n[0] = -n[0]; n[1] = -n[1]; }
		const c = [(A2[0] + B2[0]) / 2 + n[0] * bow, (A2[1] + B2[1]) / 2 + n[1] * bow];
		const q = (t) => [(1 - t) ** 2 * A2[0] + 2 * t * (1 - t) * c[0] + t * t * B2[0], (1 - t) ** 2 * A2[1] + 2 * t * (1 - t) * c[1] + t * t * B2[1]];
		const pts = Array.from({ length: 1201 }, (_, k) => q(k / 1200));
		const len = [0];
		for (let k = 1; k < pts.length; k++) len.push(len[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
		const total = len[len.length - 1];
		const kept = pts.filter((_, k) => len[k] >= gapA && len[k] <= total - gapB);
		const tip = kept[kept.length - 1];
		// the head points along the chord from where it begins to the tip; the shaft stops inside the head
		const bi = kept.findIndex((p) => Math.hypot(tip[0] - p[0], tip[1] - p[1]) <= MAP_HEAD);
		const e = unit2(tip[0] - kept[bi][0], tip[1] - kept[bi][1]), w = [-e[1], e[0]], hw = 0.36 * MAP_HEAD;
		const base = [tip[0] - e[0] * MAP_HEAD, tip[1] - e[1] * MAP_HEAD];
		const shaft = kept.filter((p) => Math.hypot(tip[0] - p[0], tip[1] - p[1]) >= 0.8 * MAP_HEAD);
		const f = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
		PL.items.push({ kind: 'raw', layer: 2, depth: 0, svg: `<path d="M${shaft.map(f).join('L')}" fill="none" stroke="${DIM}" stroke-width="${MAP}" stroke-linecap="butt" stroke-linejoin="round"/><path d="M${f(tip)}L${f([base[0] + w[0] * hw, base[1] + w[1] * hw])}L${f([base[0] - w[0] * hw, base[1] - w[1] * hw])}Z" fill="${DIM}"/>` });
		ink.mark(shaft, MAP / 2, what);
		ink.mark([tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], tip], 0, `${what}'s head`);
		ink.arrows.push({ L: total - gapA - gapB, head: MAP_HEAD, what });
		return { mid: q(0.5), n };
	};
	const B1 = -5, B2 = 26, B0 = -16;
	const m1 = arc(ink.at(V[0]), right.at(img[0]), B1, 4.5, 4.5, 'the map of v1');
	const m2 = arc(ink.at(V[1]), right.at(img[1]), B2, 4.5, 4.5, 'the map of v2');
	arc(ink.at(nullPoint), right.at(O), B0, 2.6, 2.4, 'the map of the null space');
	// each map keeps clear of every arrow but its own two: no stroke of it within AIR points of another's ink, beyond
	// the crossings with the lines through the origins, which it passes over
	const segDist = (q, a, b) => {
		const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
		const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2)) : 0;
		return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
	};
	const AIR = 1.6;
	for (const [map, own] of [['the map of v1', ['v1', 's1 u1']], ['the map of v2', ['v2', 's2 u2']], ['the map of the null space', ['a scene of the null space', 'the origin']]]) {
		const m = ink.marks.find((k) => k.what === map);
		for (const o of ink.marks.filter((k) => /^(v\d|s\d u\d)/.test(k.what) && !own.some((w) => k.what.startsWith(w)))) {
			let d = Infinity;
			for (const q of m.pts) for (let i = 1; i < o.pts.length; i++) d = Math.min(d, segDist(q, o.pts[i - 1], o.pts[i]) - o.r - MAP / 2);
			check(d >= AIR, `${map} passes ${d.toFixed(2)} pt from ${o.what}`);
		}
	}

	// ---- labels
	const L = [];
	L.push(await ink.label('\\mathbf v_1', ink.at(V[0].clone().multiplyScalar(1.04)), unit2(0, -1), LABEL_GAP, ACCENT));
	L.push(await ink.label('\\mathbf v_2', ink.at(V[1].clone().multiplyScalar(1.04)), unit2(-1, 0), LABEL_GAP, ACCENT));
	L.push(await ink.label('s_1\\mathbf u_1', right.at(img[0].clone().multiplyScalar(1.02)), unit2(0, -1), LABEL_GAP, ACCENT));
	L.push(await ink.label('s_2\\mathbf u_2', right.at(img[1].clone().multiplyScalar(1.04)), unit2(1, 0), LABEL_GAP, ACCENT));
	// the gains beside their arcs' middles, on the outside of the bow
	L.push(await ink.label('s_1', m1.mid, unit2(Math.sign(B1) * m1.n[0], Math.sign(B1) * m1.n[1]), LABEL_GAP, DIM));
	L.push(await ink.label('s_2', m2.mid, unit2(Math.sign(B2) * m2.n[0], Math.sign(B2) * m2.n[1]), LABEL_GAP, DIM));
	L.push(await ink.label('\\text{null space}', ink.at(up.clone().multiplyScalar(LINE[1])), unit2(0, -1), LABEL_GAP, DIM));
	L.push(await ink.label('\\text{noise only}', right.at(up.clone().multiplyScalar(LINE[1])), unit2(0, -1), LABEL_GAP, ACCENT2));

	// the spaces' names, under each plane, below its nearest corner, level with each other
	const lowest = (S) => square.map((p) => S.at(p)).reduce((a, b) => (b[1] > a[1] ? b : a));
	const yName = Math.max(lowest(ink)[1], lowest(right)[1]) + LABEL_GAP + 1;
	// on one baseline: the top of the taller name's ink at yName
	const named = async (src, x, base) => { const g = await tex(`\\text{${src}}`, [x, base], 8.5, 'cB', DIM); return { src, svg: g, box: boxOf(g) }; };
	const probeName = await named('readings', 0, 0);
	const base = yName - probeName.box.t;
	L.push(await named('scenes', ink.at(O)[0], base));
	L.push(await named('readings', right.at(O)[0], base));

	ink.checkAll(L);
	window.tutSvdSpaces = { gains: GAINS };
	void INK;
	return finish(name, PL, L, [240, 340]);
}
