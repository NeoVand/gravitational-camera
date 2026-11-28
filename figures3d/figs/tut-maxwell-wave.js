// The tutorial, section 6.6 (tutorial/relativity/maxwell-complex.md), its first diagram: a light wave's two arrows at
// one instant, and its one complex amplitude. Two panels, one above the other (side by side in the book). Above
// (left), "one instant of a wave": the axes e1 (across, to the right) and e2 (up), thin ink arrows, named; a short
// stretch of the z axis through their origin, a thin ink line that runs into the picture up and to the left and comes
// out toward the reader down and to the right, where its head is named k-hat; the arrow E in the light role's colour at
// 30 degrees above e1, length 1, named "E"; the arrow cB in the light role's colour, dashed, the same length, a quarter
// turn anticlockwise from E (k-hat toward the reader), named "cB = k x E"; a right-angle mark between them. Below, "the
// amplitude a in the complex plane": axes Re a and Im a, thin ink, at one scale; the circularly polarized wave E1 + i
// E2 = E0 e^{-i wt} has a = sqrt2 E0 e^{i wt}, drawn as a dot on the circle of radius sqrt2 E0 at the instant above (wt
// = -30 degrees, a = sqrt2 (E1 - i E2) of the arrow E), named "a", with seven faint dots at the other steps of 45
// degrees and an arrowhead on the circle for its anticlockwise motion, named "circular"; and the linearly polarized
// wave along e1, a = sqrt2 E0 cos wt, a thick segment of the real axis from -sqrt2 E0 to sqrt2 E0 with a head at each
// end, named "linear", its ends named -sqrt2 E0 and sqrt2 E0, inside the circle, under the axis.
// Departures from the diagram's comment: on the site the panels are stacked at every width, not side by side at
// 1440 px (the site shows one drawing at every width, as 6.2's tut-vectors-gradient). In the printed book
// (figureLayout 'book') they stand side by side as the comment asks, the wave at the left and the amplitude at the
// right, the real axis on one line with e1, the titles on one line, and the two scales chosen so that Im a reaches as
// high above Re a as e2 above e1 (72 points per E0 in the wave and 46.6 in the amplitude; the site's 78 and 42).
// The comment's z axis is not drawn: in an oblique view with no box its slanted line read as lying in the page, with E
// and cB not at right angles to it. The direction of travel k-hat, out of the page toward the reader since
// k = e1 x e2 with e1 to the right and e2 up, is drawn as a dot in a small circle at the origin, named "k-hat, out of
// the page" in the open quarter below and left (as u-hat in section 6.6's tut-maxwell-turn); the axes and the arrows
// start at its rim. The way E turns in the circular wave, which the comment does not draw, is a thin arc with a head
// above E, coming round to it clockwise, named "circular" as the circle of a is, so that the caption's "the other way
// from the electric field" can be seen. The dot on
// the circle is the instant of the upper panel (E at 30 degrees above e1 is wt = -30 degrees, a at 30 degrees below the
// real axis), so the two panels show one wave at one instant; it is named "a", and the ends of the segment are named
// -sqrt2 E0 and sqrt2 E0, so that the radius can be read.
// Exact: the arrows' directions and lengths (cB = k x E asserted in tut-maxwell-lib.js, with F = a m), the circle's
// radius sqrt2 E0 at the same scale as the segment's ends, the eight steps of wt and the dot at the drawn instant, the
// sense of E's turn (clockwise, asserted from E1 + i E2 = E0 e^{-i wt}) against a's (anticlockwise, asserted).
// Schematic: the scales of the two panels (each its own), the arc's radius and span.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR, RIGHT } from './tut-pot-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, LIGHT, dashedArrow, doubleArrow, amplitude, E_ANGLE, E0, WT0, STEPS } from './tut-maxwell-lib.js';

const name = 'tut-maxwell-wave';
const check = checker(name);

const U = globalThis.figureLayout === 'book' ? 72 : 78;   // points per unit of E0, the upper panel (the book's: see A)
const AX = 1.3;                            // the axes e1 and e2, units
const K_RING = 3.4;                        // k-hat, out of the page: the small circle's radius, points
const TURN_R = 0.74, TURN_FROM = -36, TURN_SPAN = 28;  // E's turn: its radius (units), its start (degrees below E: above it) and its span
const REACH = 1.42;                        // the lower panel's axes, in units of the radius
const BOOK = globalThis.figureLayout === 'book';
// points per unit of E0, the lower panel: the circle's radius is sqrt2 A; in the book, where the panels stand side by
// side, the axis Im a reaches as high above Re a as e2 above e1
const A = BOOK ? (AX * U) / (REACH * Math.SQRT2) : 42;
const POINT = DOT + 0.75;                  // the dot a, radius
const FAINT_DOT = DOT + 0.3;               // the other instants
const SEG = 1.6;                           // the segment's stroke
const GAP = 14;                            // the air between the upper panel's ink and the lower panel's title, points
const ROW = 6;                             // from a title to its panel's ink, points
const BESIDE = 24;                         // the book's: the air between the left panel's ink and the right panel's axis

const rad = Math.PI / 180;
const dir = (deg) => [Math.cos(deg * rad), -Math.sin(deg * rad)];   // a direction on the page, y down

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - 130;

	// ---- the upper panel: one instant of a wave
	const t1 = await placed('\\text{one instant of a wave}', left, ORIGIN - 250, 0, 0, INK);
	L.push(t1);
	const O = [ORIGIN - 20, t1.box.b + ROW + 14 + AX * U];
	const at = (deg, len) => [O[0] + dir(deg)[0] * len * U, O[1] + dir(deg)[1] * len * U];
	// k-hat out of the page, toward the reader: a dot in a small circle at the origin (k = e1 x e2 with e1 to the right
	// and e2 up); the axes and the arrows start at its rim
	const rim = (deg) => [O[0] + dir(deg)[0] * (K_RING + 0.6), O[1] + dir(deg)[1] * (K_RING + 0.6)];
	const e1 = S.arrow(rim(0), at(0, AX), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis e1' });
	const e2 = S.arrow(rim(90), at(90, AX), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis e2' });
	S.raw(`<circle cx="${O[0].toFixed(2)}" cy="${O[1].toFixed(2)}" r="${K_RING}" fill="none" stroke="${INK}" stroke-width="${AXIS}"/><circle cx="${O[0].toFixed(2)}" cy="${O[1].toFixed(2)}" r="0.9" fill="${INK}"/>`, 3);
	S.mark([O], K_RING + AXIS / 2, 'k-hat');
	L.push(await placed('\\mathbf e_1', e1.B[0] + LABEL_GAP + 1.2, e1.B[1], 0, 0.5, INK));
	L.push(await placed('\\mathbf e_2', e2.B[0], e2.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	{
		const w = [-Math.SQRT1_2, Math.SQRT1_2];
		L.push(await S.clear('\\hat k\\text{, out of the page}', O[0] + w[0] * (K_RING + 3), O[1] + w[1] * (K_RING + 3), 1, 0, w, { color: INK }));
	}

	// E at 30 degrees; cB = k x E, a quarter turn anticlockwise, the same length
	const E = [Math.cos(E_ANGLE * rad), Math.sin(E_ANGLE * rad)];
	const cB = [-E[1], E[0]];                          // k x E with k = e1 x e2
	check(near(Math.hypot(...cB), 1) && near(E[0] * cB[0] + E[1] * cB[1], 0), 'cB is not E turned a quarter');
	// each from the origin, drawn from the rim of k-hat's circle
	const from = (v) => [O[0] + v[0] * (K_RING + 0.6), O[1] - v[1] * (K_RING + 0.6)];
	const Ea = S.arrow(from(E), [O[0] + E[0] * U, O[1] - E[1] * U], { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow E' });
	const Ba = dashedArrow(S, from(cB), [O[0] + cB[0] * U, O[1] - cB[1] * U], { color: LIGHT, width: VEC, head: VEC_HEAD, dash: DASH, layer: 3, what: 'the arrow cB' });
	check(near(Ea.L, Ba.L, 1e-9) && near(Ea.L + K_RING + 0.6, E0 * U, 1e-9), 'E and cB are not the same length');
	{
		// the right-angle mark between them, outside k-hat's circle
		const u = [E[0], -E[1]], w = [cB[0], -cB[1]], s = K_RING + RIGHT;
		const p = [O[0] + u[0] * s, O[1] + u[1] * s], q = [O[0] + w[0] * s, O[1] + w[1] * s];
		S.path([p, [p[0] + w[0] * s, p[1] + w[1] * s], q], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'the right-angle mark' });
	}
	L.push(await S.clear('\\mathbf E', Ea.B[0] + 2, Ea.B[1] - 2, 0, 1, [0.5, -0.87], { color: LIGHT }));
	L.push(await S.clear('c\\mathbf B = \\hat k\\times\\mathbf E', Ba.B[0] - 3, Ba.B[1], 1, 0.5, [-1, 0], { color: LIGHT }));
	// the way E turns in the circular wave, E1 + i E2 = E0 e^{-i wt}: its angle -wt falls, so it turns clockwise on the
	// page; a thin arc with a head, above E, coming round to it, named "circular" as the circle of a is
	{
		const turn = -1;                           // d(angle of E)/d(wt): E1 + i E2 = E0 e^{-i wt}
		check(near(Math.atan2(Math.sin(-(WT0 + 1) * rad), Math.cos(-(WT0 + 1) * rad)) / rad - E_ANGLE, turn, 1e-9), 'E does not turn clockwise');
		const a0 = E_ANGLE - TURN_FROM, a1 = a0 + turn * TURN_SPAN, R0 = TURN_R * U;
		const pt = (deg) => [O[0] + Math.cos(deg * rad) * R0, O[1] - Math.sin(deg * rad) * R0];
		const hd = VEC_HEAD - 0.6, back = a1 - (turn * hd) / R0 / rad;
		const arc = Array.from({ length: 61 }, (_, k) => pt(a0 + ((back - a0) * k) / 60));
		S.path(arc, { color: LIGHT, width: VEC - 0.15, layer: 2.5, cap: 'butt', what: 'the turn of E' });
		const tip = pt(a1), b = pt(back), u = [(tip[0] - b[0]) / hd, (tip[1] - b[1]) / hd], w = [-u[1], u[0]], hw = 0.36 * hd;
		const p = [b[0] + w[0] * hw, b[1] + w[1] * hw], q = [b[0] - w[0] * hw, b[1] - w[1] * hw];
		S.raw(`<path d="M${tip[0].toFixed(2)},${tip[1].toFixed(2)}L${p[0].toFixed(2)},${p[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}Z" fill="${LIGHT}"/>`, 2.5);
		S.mark([tip, p, q, tip], 0, 'the turn of E\'s head');
		// clockwise on the page: the head points the way the angle falls
		check(Math.sin(a1 * rad) * u[0] + Math.cos(a1 * rad) * u[1] > 0.9, 'the head of E\'s turn does not point clockwise');
		// its name above its start
		const m = pt(a0);
		L.push(await S.clear('\\text{circular}', m[0], m[1] - LABEL_GAP - 0.6, 0.5, 1, [0, -1], { color: LIGHT }));
	}

	// ---- the lower panel: the amplitude a in the complex plane
	// on the site below the upper panel; in the book at its right, the real axis level with e1 and the title on the
	// same line as the upper panel's
	const top = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
	const right1 = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[0] + m.r)), ...L.map((l) => l.box.r));
	const r = Math.SQRT2 * E0 * A;                     // the circle's radius, points
	const left2 = BOOK ? right1 + BESIDE : left;
	const t2 = await placed('\\text{the amplitude } a \\text{ in the complex plane}', left2, BOOK ? t1.box.t : top + GAP, 0, 0, INK);
	L.push(t2);
	const Q = BOOK ? [left2 + REACH * r, O[1]] : [ORIGIN - 20, t2.box.b + ROW + 12 + REACH * r];
	if (BOOK) check(Q[1] - REACH * r >= t2.box.b + ROW + 12, 'the lower panel\'s axis reaches its title');
	const cp = ([re, im]) => [Q[0] + re * A, Q[1] - im * A];   // a complex number on the page
	const re = S.arrow(cp([-REACH * Math.SQRT2, 0]), cp([REACH * Math.SQRT2, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis Re a' });
	const im = S.arrow(cp([0, -REACH * Math.SQRT2]), cp([0, REACH * Math.SQRT2]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis Im a' });
	check(near(re.L, im.L, 1e-9), 'the two axes are not at one scale');
	L.push(await placed('\\mathrm{Re}\\,a', re.B[0] + LABEL_GAP + 1.2, re.B[1], 0, 0.5, INK));
	L.push(await placed('\\mathrm{Im}\\,a', im.B[0], im.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));

	// the circle of radius sqrt2 E0, in the light role's colour; the eight instants on it
	const circle = Array.from({ length: 361 }, (_, k) => cp([Math.SQRT2 * E0 * Math.cos(k * rad), Math.SQRT2 * E0 * Math.sin(k * rad)]));
	S.path(circle, { color: LIGHT, width: THIN, layer: 2, what: 'the circle' });
	for (const wt of STEPS) {
		// a = sqrt2 (E1 - i E2) with E1 + i E2 = E0 e^{-i wt}
		const a = amplitude([E0 * Math.cos(-wt * rad), E0 * Math.sin(-wt * rad)]);
		check(near(Math.hypot(...a), Math.SQRT2 * E0) && near(Math.atan2(a[1], a[0]), Math.atan2(Math.sin(wt * rad), Math.cos(wt * rad))), `the instant ${wt}`);
		const p = cp(a);
		if (wt === WT0) continue;
		S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${FAINT_DOT}" fill="${LIGHT}" fill-opacity="0.42"/>`, 3);
		S.mark([p], FAINT_DOT, `the instant ${wt}`);
	}
	// the instant of the upper panel: a = sqrt2 (E1 - i E2) of the arrow E
	const a0 = amplitude(E);
	check(near(nums.a[0], a0[0]) && near(nums.a[1], a0[1]) && near(Math.atan2(a0[1], a0[0]) / rad, WT0), 'the dot is not the upper panel\'s instant');
	const pa = cp(a0);
	S.raw(`<circle cx="${pa[0].toFixed(2)}" cy="${pa[1].toFixed(2)}" r="${POINT}" fill="${LIGHT}"/>`, 4);
	S.mark([pa], POINT, 'the dot a');
	L.push(await S.clear('a', pa[0] + POINT + 2, pa[1] + POINT, 0, 0, [0.7, 0.7], { color: LIGHT }));
	// the arrowhead on the circle, half a step ahead of a step, pointing anticlockwise
	{
		const th = (WT0 + 3 * 45 + 22.5) * rad, R2 = Math.SQRT2 * E0;
		const tip = cp([R2 * Math.cos(th), R2 * Math.sin(th)]);
		const back = th - 5.2 / r;                     // 5.2 points of arc behind the tip
		const b = cp([R2 * Math.cos(back), R2 * Math.sin(back)]);
		const hd = Math.hypot(tip[0] - b[0], tip[1] - b[1]), u = [(tip[0] - b[0]) / hd, (tip[1] - b[1]) / hd], w = [-u[1], u[0]], hw = 0.36 * hd;
		const p = [b[0] + w[0] * hw, b[1] + w[1] * hw], q = [b[0] - w[0] * hw, b[1] - w[1] * hw];
		S.raw(`<path d="M${tip[0].toFixed(2)},${tip[1].toFixed(2)}L${p[0].toFixed(2)},${p[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}Z" fill="${LIGHT}"/>`, 3);
		S.mark([tip, p, q, tip], 0, 'the circle\'s head');
		// anticlockwise on the page: the head points the way the angle grows
		check(-Math.sin(th) * u[0] + -Math.cos(th) * u[1] > 0, 'the circle\'s head does not point anticlockwise');
		const out = [Math.cos(th), -Math.sin(th)];
		L.push(await S.clear('\\text{circular}', tip[0] + out[0] * 4, tip[1] + out[1] * 4, 1, 1, [out[0], out[1]], { color: LIGHT }));
	}
	// the linear wave: a thick segment of the real axis, a head at each end
	{
		const R2 = Math.SQRT2 * E0;
		const lin = [0, 30, 60, 90, 120, 150, 180].map((d) => amplitude([E0 * Math.cos(d * rad), 0])[0]);
		check(near(Math.max(...lin), R2) && near(Math.min(...lin), -R2), 'the segment\'s ends are not +-sqrt2 E0');
		const a = cp([-R2, 0]), b = cp([R2, 0]), m = [(a[0] + b[0]) / 2, a[1]];
		doubleArrow(S, a, b, { color: LIGHT, width: SEG, head: VEC_HEAD + 1, layer: 2.5, what: 'the segment' });
		check(near(m[0], Q[0], 1e-9), 'the segment is not centred on zero');
		L.push(await S.clear('\\text{linear}', Q[0] - 0.5 * r, Q[1] - SEG / 2 - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: LIGHT }));
		L.push(await S.clear('\\sqrt2\\,E_0', b[0] - 2, b[1] + SEG / 2 + LABEL_GAP + 0.4, 1, 0, [-1, 0], { color: DIM }));
		L.push(await S.clear('-\\sqrt2\\,E_0', a[0] + 2, a[1] + SEG / 2 + LABEL_GAP + 0.4, 0, 0, [1, 0], { color: DIM }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: [U, A] };
	return finish(S, L, BOOK ? [380, 460] : [220, 340]);
}
