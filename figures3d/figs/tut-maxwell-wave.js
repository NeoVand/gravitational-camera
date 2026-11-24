// The tutorial, chapter 6.6 (tutorial/relativity/maxwell-complex.md), its first diagram: a light wave's two arrows at
// one instant, and its one complex amplitude. Two panels, one above the other. Above, "one instant of a wave": the
// axes e1 (across, to the right) and e2 (up), thin ink arrows, named; a short stretch of the z axis through their
// origin, a thin ink line that runs into the picture up and to the left and comes out toward the reader down and to
// the right, where its head is named k-hat; the arrow E in the light role's colour at 30 degrees above e1, length 1,
// named "E"; the arrow cB in the light role's colour, dashed, the same length, a quarter turn anticlockwise from E
// (k-hat toward the reader), named "cB = k x E"; a right-angle mark between them. Below, "the amplitude a in the
// complex plane": axes Re a and Im a, thin ink, at one scale; the circularly polarized wave E1 + i E2 = E0 e^{-i wt}
// has a = sqrt2 E0 e^{i wt}, drawn as a dot on the circle of radius sqrt2 E0 at the instant above (wt = -30 degrees,
// a = sqrt2 (E1 - i E2) of the arrow E), named "a", with seven faint dots at the other steps of 45 degrees and an
// arrowhead on the circle for its anticlockwise motion, named "circular"; and the linearly polarized wave along e1,
// a = sqrt2 E0 cos wt, a thick segment of the real axis from -sqrt2 E0 to sqrt2 E0 with a head at each end, named
// "linear", its ends named -sqrt2 E0 and sqrt2 E0, inside the circle, under the axis.
// Departures from the diagram's comment: the panels are stacked at every width, not side by side at 1440 px (the
// site shows one drawing at every width, as 6.2's tut-vectors-gradient). The z axis's head points out of the page,
// toward the reader, since k = e1 x e2 with e1 to the right and e2 up; the axis runs into the picture behind the
// origin, up and to the left, the one side where it crosses neither the arrows nor the right-angle mark. The dot on
// the circle is the instant of the upper panel (E at 30 degrees above e1 is wt = -30 degrees, a at 30 degrees below the
// real axis), so the two panels show one wave at one instant; it is named "a", and the ends of the segment are named
// -sqrt2 E0 and sqrt2 E0, so that the radius can be read.
// Exact: the arrows' directions and lengths (cB = k x E asserted in tut-maxwell-lib.js, with F = a m), the circle's
// radius sqrt2 E0 at the same scale as the segment's ends, the eight steps of wt and the dot at the drawn instant.
// Schematic: the slant of the z axis (an oblique view), the scales of the two panels (each its own).
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR, RIGHT } from './tut-pot-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, LIGHT, dashedArrow, doubleArrow, amplitude, E_ANGLE, E0, WT0, STEPS } from './tut-maxwell-lib.js';

const name = 'tut-maxwell-wave';
const check = checker(name);

const U = 78;                              // points per unit of E0, the upper panel
const AX = 1.3;                            // the axes e1 and e2, units
const Z_BACK = 0.42, Z_FRONT = 0.62;       // the z axis behind and in front of the origin, units
const Z_ANGLE = 150;                       // the z axis's direction into the picture, degrees from e1
const A = 42;                              // points per unit of E0, the lower panel: the circle's radius is sqrt2 A
const REACH = 1.42;                        // the lower panel's axes, in units of the radius
const POINT = DOT + 0.75;                  // the dot a, radius
const FAINT_DOT = DOT + 0.3;               // the other instants
const SEG = 1.6;                           // the segment's stroke
const GAP = 14;                            // the air between the upper panel's ink and the lower panel's title, points
const ROW = 6;                             // from a title to its panel's ink, points

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
	const e1 = S.arrow(O, at(0, AX), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis e1' });
	const e2 = S.arrow(O, at(90, AX), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis e2' });
	const zb = at(Z_ANGLE, Z_BACK);
	S.path([zb, O], { color: INK, width: AXIS, layer: 1, cap: 'butt', what: 'the z axis behind' });
	const kh = S.arrow(O, at(Z_ANGLE + 180, Z_FRONT), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the z axis in front' });
	L.push(await placed('\\mathbf e_1', e1.B[0] + LABEL_GAP + 1.2, e1.B[1], 0, 0.5, INK));
	L.push(await placed('\\mathbf e_2', e2.B[0], e2.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	L.push(await S.clear('\\hat k', kh.B[0] + 1.5, kh.B[1] + 1.5, 0, 0, [0.5, 0.87], { color: INK }));

	// E at 30 degrees; cB = k x E, a quarter turn anticlockwise, the same length
	const E = [Math.cos(E_ANGLE * rad), Math.sin(E_ANGLE * rad)];
	const cB = [-E[1], E[0]];                          // k x E with k = e1 x e2
	check(near(Math.hypot(...cB), 1) && near(E[0] * cB[0] + E[1] * cB[1], 0), 'cB is not E turned a quarter');
	const Ea = S.arrow(O, [O[0] + E[0] * U, O[1] - E[1] * U], { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow E' });
	const Ba = dashedArrow(S, O, [O[0] + cB[0] * U, O[1] - cB[1] * U], { color: LIGHT, width: VEC, head: VEC_HEAD, dash: DASH, layer: 3, what: 'the arrow cB' });
	check(near(Ea.L, Ba.L, 1e-9) && near(Ea.L, E0 * U, 1e-9), 'E and cB are not the same length');
	{
		// the right-angle mark between them
		const u = [E[0], -E[1]], w = [cB[0], -cB[1]], s = RIGHT + 0.6;
		const p = [O[0] + u[0] * s, O[1] + u[1] * s], q = [O[0] + w[0] * s, O[1] + w[1] * s];
		S.path([p, [p[0] + w[0] * s, p[1] + w[1] * s], q], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'the right-angle mark' });
	}
	L.push(await S.clear('\\mathbf E', Ea.B[0] + 2, Ea.B[1] - 2, 0, 1, [0.5, -0.87], { color: LIGHT }));
	L.push(await S.clear('c\\mathbf B = \\hat k\\times\\mathbf E', Ba.B[0] - 3, Ba.B[1], 1, 0.5, [-1, 0], { color: LIGHT }));

	// ---- the lower panel: the amplitude a in the complex plane
	const top = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
	const t2 = await placed('\\text{the amplitude } a \\text{ in the complex plane}', left, top + GAP, 0, 0, INK);
	L.push(t2);
	const r = Math.SQRT2 * E0 * A;                     // the circle's radius, points
	const Q = [ORIGIN - 20, t2.box.b + ROW + 12 + REACH * r];
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
	return finish(S, L, [220, 340]);
}
