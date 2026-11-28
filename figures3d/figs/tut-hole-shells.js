// The tutorial, section 13.7 (tutorial/what-a-field-keeps/thermometer.md), its second diagram: the hole's shells.
// One square panel, the hole seen from above, to scale. The horizon, a disc of radius r_s in section 11.1's fixed
// near-black, edged in ink; thin grey circles at the photon sphere, 1.5 r_s, and at the critical impact parameter,
// b_c = 2.598 r_s; a dashed circle at the limit (3 sqrt 3 / e) r_s = 1.9116 r_s. Between them seven thin whole rings in
// matter's colour at the exact radii R_2 to R_8, 1.0175 to 1.7841 r_s, each tied by a hairline leader, along its own
// direction in the upper right, to its degree, "l = 2", "3", ..., "8", set between the dashed circle and b_c; each
// leader ends on its ring at a small dot of matter's colour, so that the leaders of the close outer rings (1 to 2 points
// apart) and that of l = 2, a point outside the horizon's edge, are seen to stop on their own rings.
// Under the panel, a ruler on the same scale, from the centre's place (0) to b_c, numbered 0, 1 and 2 at whole r_s: the
// step absorber, a different body, its radii for l = 2 to 6, 0.668, 1.226, 1.459, 1.580 and 1.652 r_s, as grey ticks
// below the ruler, each numbered with its degree (the three close ones by short leaders to numbers spread apart), and
// the limit as a dashed tick below it, the dashed circle's own; "step absorber, a different body" at its left.
// Departures from the diagram's comment: the rings are in matter's colour, not the paper's orange, since they stand for
// the shells of the hole's would-be body and orange means a stretch in the tutorial's figures; the step absorber's
// radii are drawn on a ruler of their own under the hole rather than across it, so that its first radius, inside r_s,
// is not drawn over the horizon as if the hole had a shell there, and its ticks can carry their degrees; the ruler is
// also the scale. The photon sphere, the limit and b_c are named on the page; each ring's leader leaves it at its own
// angle, so that no two leaders share a line, and the degrees stand in the clear band between the limit and b_c.
// Exact: every radius (tut-thermo-lib.js: the hole's from the site's hair/hole.ts, asserted against the chapter's four
// places; the step absorber's from its closed form, asserted against the chapter's three; the limit, the photon sphere
// and b_c), on one scale with the ruler. Schematic: the leaders' angles.
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
const FOOT = 0.6;                               // the dot at a leader's end on its ring
const RULER = 17;                               // the ruler under b_c, points
const STEP_TICK = 4, SCALE_TICK = 2.6;          // the step's ticks (down) and the ruler's whole r_s (up)
const SPREAD = 7.5;                             // between the close degrees' numbers on the ruler
const caption = 'Look first at the rings crowding toward the dashed circle: each degree of tide answers like a shell of the hole\'s mass at its own radius, and the radii tend to $(3\\sqrt3/e)\\,r_s$, between the photon sphere and the critical impact parameter. Below, on the same scale, the radii of a different body, the step absorber: lower, and climbing to the same limit. Radii exact.';

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

	// ---- the photon sphere, the limit and b_c
	S.path(arc(PHOTON, 0, 360), { color: FAINT, width: CIRCLE, layer: 1.2, closed: true, what: 'the photon sphere' });
	S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(LIMIT * U)}" fill="none" stroke="${DIM}" stroke-width="${CIRCLE}" stroke-dasharray="${DASH.join(' ')}"/>`, 1.2);
	S.mark(arc(LIMIT, 0, 360), CIRCLE / 2, 'the limit');
	S.path(arc(BC, 0, 360), { color: FAINT, width: CIRCLE, layer: 1.2, closed: true, what: 'b_c' });

	// ---- the hole's rings
	for (let k = 1; k < DEGREES.length; k++) check(RADII[DEGREES[k]] > RADII[DEGREES[k - 1]], 'the rings do not climb');
	check(RADII[2] > 1 && RADII[8] < LIMIT && PHOTON > RADII[3] && PHOTON < RADII[4], 'the rings\' place among the circles');
	for (const l of DEGREES) {
		const gap = ((RADII[l] - (l === 2 ? 1 : RADII[l - 1])) * U) - (RING + (l === 2 ? EDGE : RING)) / 2;
		check(gap > 0.4, `the ring ${l} touches the one inside it (${gap.toFixed(2)} pt of air)`);
		S.path(arc(RADII[l], 0, 360), { color: MATTER, width: RING, layer: 2, closed: true, what: `the ring ${l}` });
	}

	// ---- the degrees: a leader from each ring, at its own angle, out to the band between the limit and b_c
	for (const [k, l] of DEGREES.entries()) {
		const a = FAN[k], u = [Math.cos(a * DEG), -Math.sin(a * DEG)];
		const end = at(LABEL_R, a);
		S.path([at(RADII[l], a), end], { color: FAINT, width: LEADER, layer: 1.5, cap: 'butt', what: `the leader ${l}` });
		// the leader's end, a dot on its ring
		const q = at(RADII[l], a);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${FOOT}" fill="${MATTER}"/>`, 2.5);
		S.mark([q], FOOT, `the dot on ring ${l}`);
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

	// ---- under the panel, a ruler on the same scale: the step absorber's radii, a different body
	{
		const y = c[1] + BC * U + RULER, x = (r) => c[0] + r * U;
		S.path([[x(0), y], [x(BC), y]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the ruler' });
		// whole r_s, up, numbered above; b_c's end too, unnumbered
		for (const r of [0, 1, 2]) {
			S.path([[x(r), y], [x(r), y - SCALE_TICK]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: `the ruler's ${r}` });
			L.push(await placed(r === 0 ? '0' : r === 1 ? 'r_s' : '2r_s', x(r), y - SCALE_TICK - LABEL_GAP - 0.2, 0.5, 1, DIM, 7.5));
		}
		S.path([[x(BC), y], [x(BC), y - SCALE_TICK]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the ruler\'s end at b_c' });
		// the limit, a dashed tick below, longer than the step's, as the dashed circle
		S.path([[x(LIMIT), y + 1], [x(LIMIT), y + 7.6]], { color: DIM, width: CIRCLE, layer: 2, cap: 'butt', dash: [1.6, 1.2], what: 'the limit on the ruler' });
		// the step absorber's radii, grey ticks down, numbered with their degrees below
		const ls = [2, 3, 4, 5, 6];
		for (let k = 1; k < ls.length; k++) check(STEP[ls[k]] > STEP[ls[k - 1]] && STEP[ls[k]] < LIMIT, 'the step\'s radii do not climb below the limit');
		const lx = { 2: x(STEP[2]), 3: x(STEP[3]), 4: x(STEP[5]) - SPREAD, 5: x(STEP[5]), 6: x(STEP[5]) + SPREAD };
		for (const l of ls) {
			const p = x(STEP[l]);
			S.path([[p, y], [p, y + STEP_TICK]], { color: DIM, width: HAIR * 1.3, layer: 2.5, cap: 'butt', what: `the step's tick ${l}` });
			const lab = await placed(String(l), lx[l], y + STEP_TICK + 8.4, 0.5, 0, DIM, 7.5);
			if (Math.abs(lx[l] - p) > 0.3) S.path([[p, y + STEP_TICK + 0.6], [lx[l], lab.box.t - LABEL_GAP - 0.3]], { color: FAINT, width: LEADER, layer: 1.5, cap: 'butt', what: `the step's leader ${l}` });
			L.push(lab);
		}
		check(STEP[2] < 1, 'the step\'s first radius is not inside r_s');
		L.push(await placed('\\text{step absorber, a different body}', x(0) - 6, y + STEP_TICK / 2, 1, 0.5, DIM));
	}

	check(near(BC, 2.598076211353316, 1e-12) && near(LIMIT, 1.911557649506952, 1e-12), 'b_c and the limit');
	S.checkAll(L);
	window[name + '-numbers'] = { radii: RADII, step: STEP, limit: LIMIT, bc: BC };
	return finish(S, L, [260, 340]);
}
