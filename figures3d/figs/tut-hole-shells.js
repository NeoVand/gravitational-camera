// The tutorial, chapter 13.7 (tutorial/what-a-field-keeps/thermometer.md), its second diagram: the hole's shells.
// One square panel, the hole seen from above, to scale. The horizon, a disc of radius r_s in chapter 11.1's fixed
// near-black, edged in ink; thin grey circles at the photon sphere, 1.5 r_s, and at the critical impact parameter,
// b_c = 2.598 r_s; a dashed circle at the limit (3 sqrt 3 / e) r_s = 1.9116 r_s. Between them seven thin rings in
// matter's colour at the exact radii R_2 to R_8, 1.0175 to 1.7841 r_s, each tied by a hairline leader, along its own
// direction in the upper right, to its degree, "l = 2", "3", ..., "8", set between the dashed circle and b_c. On the
// opposite radius, lower left, a grey hairline from the centre to b_c with short grey ticks across it at the step
// absorber's radii, 0.668, 1.226, 1.459, 1.580 and 1.652 r_s, named at its end. A scale bar of 1 r_s at the lower
// right.
// Departures from the diagram's comment: the rings are in matter's colour, not the paper's orange, since they stand for
// the shells of the hole's would-be body and orange means a stretch in the tutorial's figures; the rings and the photon
// sphere leave a narrow wedge open around the step absorber's radius, since a tick across a radius lies along the
// circle there and the tick at 1.459 r_s would otherwise sit on the ring at 1.4555 r_s and touch the photon sphere;
// the photon sphere, the limit and b_c are named on the page; each ring's leader leaves it at its own angle, so that
// no two leaders share a line, and the degrees stand in the clear band between the limit and b_c.
// Exact: every radius (tut-thermo-lib.js: the hole's from the site's hair/hole.ts, asserted against the chapter's four
// places; the step absorber's from its closed form, asserted against the chapter's three; the limit, the photon sphere
// and b_c), on one scale with the scale bar. Schematic: the leaders' angles.
import { Sheet, ORIGIN, finish, checker, placed, beside, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, near, MATTER, HOLE, DEGREES, RADII, STEP, PHOTON, BC, LIMIT } from './tut-thermo-lib.js';

const name = 'tut-hole-shells';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const DEG = Math.PI / 180;
const U = 50;                                   // points per r_s
const EDGE = 0.45;                              // the horizon's edge
const RING = 0.4;                               // the hole's rings
const CIRCLE = 0.4, DASH = [2.6, 1.8];          // the photon sphere and b_c; the limit, dashed
const LEADER = 0.3;
const FAN = [62, 56, 50, 44, 38, 32, 26];       // each ring's leader, degrees anticlockwise from the right
const LABEL_R = 2.08;                           // where the leaders end, r_s
const STEP_AT = 225, WEDGE = 9;                 // the step absorber's radius, and the half-width of the rings' gap
const STEP_TICK = 2.4;                          // half a tick
const SCALE_AT = [1.75, 2.35];                  // the scale bar's left end, r_s right of and below the centre
const caption = 'Look first at the rings crowding toward the dashed circle: each degree of tide answers like a shell of the hole\'s mass at its own radius, and the radii tend to $(3\\sqrt3/e)\\,r_s$, between the photon sphere and the critical impact parameter. Grey ticks: the step absorber\'s radii, lower and climbing to the same limit. Radii exact.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'hole-shells', caption);
	const S = new Sheet(name);
	const L = [];
	const c = [ORIGIN, ORIGIN];
	// a point at radius r (r_s) and angle a (degrees, anticlockwise from the right)
	const at = (r, a) => [c[0] + r * U * Math.cos(a * DEG), c[1] - r * U * Math.sin(a * DEG)];
	const arc = (r, a0, a1) => { const n = Math.ceil(Math.abs(a1 - a0) / 1.5); return Array.from({ length: n + 1 }, (_, k) => at(r, a0 + ((a1 - a0) * k) / n)); };

	// ---- the horizon
	S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(U)}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 1);
	S.mark(arc(1, 0, 360), EDGE / 2, 'the horizon');

	// ---- the photon sphere, open in the wedge round the step absorber's radius, as the rings are (the step's tick at
	// 1.459 r_s would otherwise touch it); the limit and b_c, which belong to the step absorber too, whole
	S.path(arc(PHOTON, STEP_AT + WEDGE, STEP_AT - WEDGE + 360), { color: FAINT, width: CIRCLE, layer: 1.2, cap: 'butt', what: 'the photon sphere' });
	S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(LIMIT * U)}" fill="none" stroke="${DIM}" stroke-width="${CIRCLE}" stroke-dasharray="${DASH.join(' ')}"/>`, 1.2);
	S.mark(arc(LIMIT, 0, 360), CIRCLE / 2, 'the limit');
	S.path(arc(BC, 0, 360), { color: FAINT, width: CIRCLE, layer: 1.2, closed: true, what: 'b_c' });

	// ---- the hole's rings, open in the wedge round the step absorber's radius
	for (let k = 1; k < DEGREES.length; k++) check(RADII[DEGREES[k]] > RADII[DEGREES[k - 1]], 'the rings do not climb');
	check(RADII[2] > 1 && RADII[8] < LIMIT && PHOTON > RADII[3] && PHOTON < RADII[4], 'the rings\' place among the circles');
	for (const l of DEGREES) {
		const gap = ((RADII[l] - (l === 2 ? 1 : RADII[l - 1])) * U) - (RING + (l === 2 ? EDGE : RING)) / 2;
		check(gap > 0.4, `the ring ${l} touches the one inside it (${gap.toFixed(2)} pt of air)`);
		S.path(arc(RADII[l], STEP_AT + WEDGE, STEP_AT - WEDGE + 360), { color: MATTER, width: RING, layer: 2, cap: 'butt', what: `the ring ${l}` });
	}

	// ---- the degrees: a leader from each ring, at its own angle, out to the band between the limit and b_c
	for (const [k, l] of DEGREES.entries()) {
		const a = FAN[k], u = [Math.cos(a * DEG), -Math.sin(a * DEG)];
		const end = at(LABEL_R, a);
		S.path([at(RADII[l], a), end], { color: FAINT, width: LEADER, layer: 1.5, cap: 'butt', what: `the leader ${l}` });
		const lab = await beside(l === 2 ? '\\ell = 2' : String(l), end, u, LABEL_GAP + 0.2, INK);
		// the degree stands clear of the dashed circle and of b_c
		const far = Math.max(...[[lab.box.l, lab.box.t], [lab.box.r, lab.box.t], [lab.box.l, lab.box.b], [lab.box.r, lab.box.b]].map(([x, y]) => Math.hypot(x - c[0], y - c[1])));
		check(far < BC * U - LABEL_GAP, `the degree ${l} reaches b_c`);
		L.push(lab);
	}

	// ---- the circles' names: the limit's and b_c's at the top, the photon sphere's inside, at the bottom
	{
		const y0 = c[1] - LIMIT * U, y1 = c[1] - BC * U;
		L.push(await placed('(3\\sqrt3/e)\\,r_s', c[0], (y0 + y1) / 2 + 1, 0.5, 0.5, DIM));
		L.push(await placed('b_c', c[0], y1 - LABEL_GAP - 0.6, 0.5, 1, DIM));
	}
	{
		const lab = await placed('\\text{photon sphere}', c[0], c[1] + 1.2 * U - 0.8, 0.5, 0.5, DIM);
		S.path([[c[0], lab.box.b + LABEL_GAP + 0.1], [c[0], c[1] + PHOTON * U]], { color: FAINT, width: LEADER, layer: 1.5, cap: 'butt', what: 'the photon sphere\'s leader' });
		L.push(lab);
	}

	// ---- the step absorber: a hairline from the centre to b_c, ticks across it, its name at its end
	{
		const u = [Math.cos(STEP_AT * DEG), -Math.sin(STEP_AT * DEG)], w = [-u[1], u[0]];
		S.path([c, at(BC, STEP_AT)], { color: FAINT, width: HAIR * 0.8, layer: 1.6, cap: 'butt', what: 'the step absorber\'s radius' });
		for (const l of [2, 3, 4, 5, 6]) {
			const p = at(STEP[l], STEP_AT);
			S.path([[p[0] - w[0] * STEP_TICK, p[1] - w[1] * STEP_TICK], [p[0] + w[0] * STEP_TICK, p[1] + w[1] * STEP_TICK]], { color: l === 2 ? FAINT : DIM, width: HAIR * 1.3, layer: 2.5, cap: 'butt', what: `the step's tick ${l}` });
		}
		// the ticks lie in the wedge, clear of the rings' ends
		const half = Math.atan(STEP_TICK / (STEP[2] * U)) / DEG;
		check(half < WEDGE - 2, 'a tick reaches the rings');
		L.push(await beside('\\text{step absorber}', at(BC, STEP_AT), u, 2.4, DIM));
	}

	// ---- the scale bar
	{
		const x0 = c[0] + SCALE_AT[0] * U, y = c[1] + SCALE_AT[1] * U, x1 = x0 + U;
		check(Math.hypot(x0 - c[0], y - c[1]) > BC * U + 6, 'the scale bar is inside b_c');
		S.path([[x0, y], [x1, y]], { color: INK, width: 0.55, layer: 2, cap: 'butt', what: 'the scale bar' });
		for (const x of [x0, x1]) S.path([[x, y - 2], [x, y + 2]], { color: INK, width: 0.55, layer: 2, cap: 'butt', what: 'the scale bar\'s end' });
		L.push(await placed('r_s', (x0 + x1) / 2, y + 2 + LABEL_GAP + 0.4, 0.5, 0, INK));
	}

	check(near(BC, 2.598076211353316, 1e-12) && near(LIMIT, 1.911557649506952, 1e-12), 'b_c and the limit');
	S.checkAll(L);
	window[name + '-numbers'] = { radii: RADII, step: STEP, limit: LIMIT, bc: BC };
	return finish(S, L, [260, 340]);
}
