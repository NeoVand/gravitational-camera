// The tutorial, section 5.4 (tutorial/waves/polarization.md), its third diagram: where the camera stands. A sketch in
// light perspective, seen from the direction (5, -3.5, 1.5) toward the origin, z up, from 12 units away (so that the
// nearest and farthest marks differ in scale by less than a quarter). Thin grey axes x and y from the origin, 1.6 long,
// and z, 1.45 (it shows only above the spin), named at their tips. At the origin the rotor: two masses of radius 0.1 at
// +-0.65 (cos 35, sin 35, 0), the nugget of section 2.5 lit in matter's two colours (figs/tut-null-lib.js), on a thin
// rod; their dashed orbit, a circle of radius 0.65 in the xy plane, with an arrowhead on its near side (at -60 degrees
// from x) pointing anticlockwise as seen from +z. The spin, an ink arrow along +z, 1.3 long. The line of sight n at
// iota = 50 degrees from z in the xz plane, (0.766, 0, 0.643), an ink arrow 1.3 long, with a thin grey arc of radius
// 0.6 from the spin to it, named iota. At n's tip, the sky as the camera sees it, a faint square of side 0.9 across n;
// on it, from the tip, the camera's axes e_1 = (0.643, 0, -0.766) and e_2 = (0, 1, 0), ink arrows 0.4 long, and the
// spin's shadow, a dashed grey arrow 0.4 sin 50 = 0.31 long along -e_1.
// Departures from the diagram's comment: the view is from (5, -3.5, 1.5) rather than about (3, -4, 2), because from
// there the y axis runs behind the sky's square and its tip and name fall on it, among e_1 and e_2; from (2, -4, 4) it
// runs instead through the angle between the spin and n. From the view chosen, 18 degrees farther round z and 8
// lower, the y axis passes below the square, clear of every mark. The perspective: a camera 12 units away, each
// point's offset across the view divided by its depth. The rotor is drawn at the instant when its near mass stands in
// the gap between the x and y axes and its far one at the left, where no line runs: every line from the origin (the
// axes, the spin, n) passes clear of both masses on the page (asserted, by 4 points), so that nothing is drawn across
// a mass or behind one it should pass in front of. (At an earlier instant, the far mass at the upper right, n and the
// y axis both crossed it.)
// Exact: every point from the chapter's vectors at iota = 50 degrees (asserted: n, e_1, e_2, e_1 x e_2 = n, the shadow
// -sin(iota) e_1); the rotor's masses at the instant drawn, on their orbit; the arc in the plane of z and n. Schematic:
// the rotor (its size against the arrows) and the masses' size.
import { v3, INK, DIM, RULE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, n2, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR, DASH } from './tut-vec-lib.js';
import { UNDISTURBED_W } from './tut-five-lib.js';
import { chapter, cameraAxes, View, up, rad, nugget, dashes, drawDashes, IOTA_GEOMETRY } from './tut-pol-lib.js';

const name = 'tut-pol-geometry';
const check = checker(name);

const S = 140;                            // points per unit at the origin
const DIST = 12;
const CAMERA = [5, -3.5, 1.5];             // the view's direction, physics coordinates
const AX = 1.6, AX_Z = 1.45, ARROW = 1.3, SKY = 0.9, CAM = 0.4, ORBIT = 0.65, MASS = 0.1, ARC = 0.6;
const MASS_AT = 35;                       // the near mass, degrees round the orbit from x (the far one opposite)
const CLEAR = 4;                          // the least gap, points, between a mass and any line from the origin
const TINT = '#eeebe5';                   // the sky (drawing.ts, THEME: a neutral tint of the page)
const ROD = 0.7;                          // the rod's stroke
const ORBIT_HEAD = 3.4;                   // the orbit's arrowhead, points
const ORBIT_HEAD_AT = -60;                // its tip, degrees round the orbit from x

export default async function () {
	chapter(check);
	const iota = rad(IOTA_GEOMETRY);
	const { n, e1, e2 } = cameraAxes(iota);
	const P = new View({ x: ORIGIN - 40, y: ORIGIN + 80, w: 0, h: 0, scale: S, toward: up(...CAMERA), dist: DIST });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const W = (a) => up(...a);                            // a physics vector to the page's world
	const O = up(0, 0, 0);
	const L = [];
	const f = [O, W([0, 0, 1.6]), W([1.3, 0, 1.3])].map((p) => P.f(p));
	check(Math.max(...f) / Math.min(...f) < 1.25, 'the perspective is not light');

	// ---- the sky: a faint square of side 0.9 across n at its tip, under every mark
	const T = n.map((v) => ARROW * v);
	const corner = (a, b) => W([0, 1, 2].map((i) => T[i] + (a * SKY * e1[i]) / 2 + (b * SKY * e2[i]) / 2));
	const sq = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)];
	P.polygon(sq, { fill: TINT, stroke: RULE, width: HAIR, layer: -1 });
	ink.mark([...sq, sq[0]].map((p) => ink.at(p)), HAIR / 2, 'the sky');
	for (let i = 0; i < 4; i++) check(near(Math.hypot(...[0, 1, 2].map((k) => [sq[i].x - T[0], sq[i].z + T[1], sq[i].y - T[2]][k])) ** 2, SKY ** 2 / 2, 1e-12), 'the sky is not a square of side 0.9 about n\'s tip');

	// ---- the axes, thin and grey, named at their tips
	const axes = [['x', [1, 0, 0], [0.2, 1]], ['y', [0, 1, 0], [1, -0.3]], ['z', [0, 0, 1], [0, -1]]];
	const REACH = { x: AX, y: AX, z: AX_Z };
	const tips = {};
	for (const [k, d] of axes) {
		const tip = W(d.map((v) => REACH[k] * v));
		ink.arrow(O, tip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `the ${k} axis` });
		tips[k] = tip;
	}

	// ---- the rotor: the rod, the orbit (dashed) and the two masses
	const m = [Math.cos(rad(MASS_AT)), Math.sin(rad(MASS_AT)), 0].map((v) => ORBIT * v);
	const masses = [m, m.map((v) => -v)];
	for (const q of masses) check(near(Math.hypot(...q), ORBIT, 1e-15) && near(q[2], 0, 1e-15), 'a mass is off its orbit');
	const orbitPts = Array.from({ length: 721 }, (_, k) => W([ORBIT * Math.cos((2 * Math.PI * k) / 720), ORBIT * Math.sin((2 * Math.PI * k) / 720), 0]));
	const F = orbitPts.map((p) => ink.at(p));
	const massAt = masses.map((q) => ({ q, c: ink.at(W(q)), r: MASS * S * P.f(W(q)), depth: P.cam(W(q)).z }));
	// the orbit's head, on its near side, pointing anticlockwise as seen from +z
	const a1 = rad(ORBIT_HEAD_AT);
	const onOrbit = (a) => ink.at(W([ORBIT * Math.cos(a), ORBIT * Math.sin(a), 0]));
	const tip = onOrbit(a1);
	let a0 = a1;
	while (Math.hypot(onOrbit(a0)[0] - tip[0], onOrbit(a0)[1] - tip[1]) < ORBIT_HEAD) a0 -= 1e-4;
	const base = onOrbit(a0);
	{
		const u = [(tip[0] - base[0]) / ORBIT_HEAD, (tip[1] - base[1]) / ORBIT_HEAD], w = [-u[1], u[0]], hw = 0.36 * ORBIT_HEAD;
		const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
		raw(`<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${DIM}"/>`, 2.2);
		ink.mark([...tri, tri[0]], 0, 'the orbit\'s head');
		// anticlockwise from +z: the tangent at a1 is (-sin a1, cos a1, 0), and the head points along its image
		const t0 = ink.at(W([ORBIT * Math.cos(a1), ORBIT * Math.sin(a1), 0])), t1 = ink.at(W([ORBIT * Math.cos(a1) - 1e-4 * Math.sin(a1), ORBIT * Math.sin(a1) + 1e-4 * Math.cos(a1), 0]));
		check((t1[0] - t0[0]) * u[0] + (t1[1] - t0[1]) * u[1] > 0, 'the orbit\'s head does not point anticlockwise');
		check(P.cam(W([ORBIT * Math.cos(a1), ORBIT * Math.sin(a1), 0])).z > 0, 'the orbit\'s head is on the far side');
	}
	const headBox = (q) => Math.hypot(q[0] - tip[0], q[1] - tip[1]) < ORBIT_HEAD + 0.9 || Math.hypot(q[0] - base[0], q[1] - base[1]) < 1.6;
	const underMass = (q) => massAt.some((s) => Math.hypot(q[0] - s.c[0], q[1] - s.c[1]) < s.r + 0.4);
	drawDashes(ink, dashes(F, { dash: DASH, skip: (q) => headBox(q) || underMass(q) }), { color: DIM, width: UNDISTURBED_W + 0.05, layer: 2, what: 'the orbit' });
	// the rod between the masses' centres, under them
	{
		const [A, B] = massAt.map((s) => s.c);
		raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${INK}" stroke-width="${ROD}" stroke-linecap="butt"/>`, 2.4);
		ink.mark([A, B], ROD / 2, 'the rod');
	}
	// the masses: the far one under the spin and the axes' bases, the near one over them
	const order = [...massAt].sort((a, b) => a.depth - b.depth);
	order.forEach((s, i) => {
		raw(nugget(`${name}-m${i}`, s.c[0], s.c[1], s.r), i === 0 ? 2.5 : 4.5);
		ink.mark([s.c], s.r, `mass ${i}`);
	});

	// ---- the spin and the line of sight
	const spinTip = W([0, 0, ARROW]);
	ink.arrow(O, spinTip, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the spin' });
	ink.arrow(O, W(T), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'n' });
	// every line from the origin (the axes, the spin and n) passes clear of both masses on the page
	{
		const A = ink.at(O);
		const seg = (B, c) => { const u = [B[0] - A[0], B[1] - A[1]], l2 = u[0] ** 2 + u[1] ** 2, t = Math.max(0, Math.min(1, ((c[0] - A[0]) * u[0] + (c[1] - A[1]) * u[1]) / l2)); return Math.hypot(c[0] - A[0] - t * u[0], c[1] - A[1] - t * u[1]); };
		const lines = { x: tips.x, y: tips.y, z: tips.z, n: W(T) };
		for (const s of massAt) for (const [k, B] of Object.entries(lines)) check(seg(ink.at(B), s.c) > s.r + CLEAR, `the line ${k} crosses a mass (${(seg(ink.at(B), s.c) - s.r).toFixed(1)} pt)`);
	}
	// the angle iota, a thin grey arc in the xz plane from z to n
	{
		const pts = Array.from({ length: 121 }, (_, k) => { const g = (iota * k) / 120; return W([ARC * Math.sin(g), 0, ARC * Math.cos(g)]); });
		ink.curve(pts, { color: DIM, width: HAIR, layer: 1, what: 'the arc of iota' });
		for (const p of pts) check(near(Math.hypot(p.x, p.y), ARC, 1e-12) && near(p.z, 0, 1e-15), 'the arc is not in the xz plane at radius 0.6');
		const mid = W([ARC * Math.sin(iota / 2), 0, ARC * Math.cos(iota / 2)]);
		const out = ink.at(W([1.4 * ARC * Math.sin(iota / 2), 0, 1.4 * ARC * Math.cos(iota / 2)])), at = ink.at(mid);
		const d = [out[0] - at[0], out[1] - at[1]], l = Math.hypot(...d);
		L.push(await ink.label('\\iota', at, [d[0] / l, d[1] / l], 2.2, INK));
	}

	// ---- on the sky: e_1, e_2 and the spin's shadow along -e_1
	const Tw = W(T);
	const e1Tip = W([0, 1, 2].map((i) => T[i] + CAM * e1[i])), e2Tip = W([0, 1, 2].map((i) => T[i] + CAM * e2[i]));
	ink.arrow(Tw, e1Tip, { color: INK, width: VEC - 0.1, head: VEC_HEAD - 0.4, layer: 3, what: 'e_1' });
	ink.arrow(Tw, e2Tip, { color: INK, width: VEC - 0.1, head: VEC_HEAD - 0.4, layer: 3, what: 'e_2' });
	const shadowLen = CAM * Math.sin(iota);
	check(shadowLen.toFixed(2) === '0.31', 'the shadow is not 0.31 long');
	const shTip = W([0, 1, 2].map((i) => T[i] - shadowLen * e1[i]));
	{
		// a dashed shaft and a filled head, grey
		const A = ink.at(Tw), B = ink.at(shTip), Lp = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const u = [(B[0] - A[0]) / Lp, (B[1] - A[1]) / Lp], w = [-u[1], u[0]], hd = Math.min(AXIS_HEAD + 0.4, 0.4 * Lp), hw = 0.36 * hd;
		const bs = [B[0] - u[0] * hd, B[1] - u[1] * hd];
		// the shaft starts clear of n's head, at the tip
		const s0 = [A[0] + u[0] * 1.2, A[1] + u[1] * 1.2], s1 = [B[0] - u[0] * hd * 0.8, B[1] - u[1] * hd * 0.8];
		drawDashes(ink, dashes([s0, s1], { dash: [1.4, 1.0], closed: false }), { color: DIM, width: AXIS + 0.1, layer: 3, what: 'the shadow' });
		raw(`<path d="M${n2(B[0])},${n2(B[1])}L${n2(bs[0] + w[0] * hw)},${n2(bs[1] + w[1] * hw)}L${n2(bs[0] - w[0] * hw)},${n2(bs[1] - w[1] * hw)}Z" fill="${DIM}"/>`, 3);
		ink.mark([B, [bs[0] + w[0] * hw, bs[1] + w[1] * hw], [bs[0] - w[0] * hw, bs[1] - w[1] * hw], B], 0, 'the shadow\'s head');
		check(hd <= 0.4 * Lp + 1e-9, 'the shadow\'s head');
	}

	// ---- the names
	const away = (p, from, k = 1) => { const a = ink.at(p), b = ink.at(from); const d = [a[0] - b[0], a[1] - b[1]], l = Math.hypot(...d); return [d[0] / l * k, d[1] / l * k]; };
	for (const [k, , dir] of axes) { const l = Math.hypot(...dir); L.push(await ink.label(k, ink.at(tips[k]), [dir[0] / l, dir[1] / l], 2.2, DIM)); }
	L.push(await ink.label('\\text{spin}', ink.at(spinTip), [-1, 0], 2.2, INK));
	{
		// n's name beside its shaft, three quarters of the way out, on the side away from z
		const q = W(n.map((v) => 0.72 * ARROW * v)), d = away(Tw, O);
		L.push(await ink.label('\\hat n', ink.at(q), [d[1], -d[0]], 2.2, INK));
	}
	// e_1's name beside its tip, on the sky, on the side away from e_2
	{ const d = away(e1Tip, Tw); L.push(await ink.label('\\boldsymbol e_1', ink.at(e1Tip), [-0.8 * d[1] - 0.6 * d[0], 0.8 * d[0] - 0.6 * d[1]].map((v, i, a) => v / Math.hypot(...a)), 2.2, INK)); }
	L.push(await ink.label('\\boldsymbol e_2', ink.at(e2Tip), away(e2Tip, Tw), 2.2, INK));
	L.push(await ink.label('\\text{spin\'s shadow}', ink.at(shTip), away(shTip, Tw), 2.2, DIM));

	ink.checkAll(L);
	window[name + '-numbers'] = { n, e1, e2, shadow: shadowLen, f: f.map((v) => +v.toFixed(3)) };
	return finish(name, P, L, [240, 340]);
}
