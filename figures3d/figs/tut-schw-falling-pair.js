// The tutorial, chapter 11.1 (tutorial/black-holes/schwarzschild.md), its second diagram: two pairs of free balls
// falling into a hole, the exact tide of a round mass. The hole, a dark disc of radius r_s, at the left, and three thin
// radial lines fanning from it. On two neighbouring radii, delta phi apart, a pair at one r, drawn at two moments of
// their fall, faint at the earlier and solid at the later: closer together at the later one, the gap marked by a short
// arc of a circle round the hole, named "r delta phi", and squeezed together by two blue arrows, named "squeeze,
// GM/r^3". On the third radius a pair one beyond the other, drawn at the same two moments, farther apart at the later
// one and pulled apart along the radius by two orange arrows, named "stretch, 2GM/r^3". The balls and the arrows are
// chapter 1.4's (tut-tides): steel beads, orange out along the line, blue in across it, each orange arrow twice each
// blue one; everything else in ink and the page's greys.
// Departures from the diagram's comment: the hole is drawn smaller than to scale (12 points against the 20 of r_s at
// the drawing's scale), so that it stays small beside the fan; the arc that marks the gap r delta phi stands a little
// outside the solid pair, as a dimension line, so that it does not run over the blue arrows; it is concentric with the
// hole and ends on the two radii (which end it, so it has no end strokes of its own), so it subtends delta phi.
// Exact: every ball falls by the chapter's exact law d^2 r / d tau^2 = -GM/r^2, from rest far away (E = 1, so r^{3/2} =
// r0^{3/2} - (3/sqrt 2) tau, asserted to solve it), and the two moments are one proper time apart for all six balls;
// the pair across stays at one r with delta phi fixed, so its gap is r delta phi; the solid pairs' gaps are equal, so
// that the arrows, the relative accelerations -E xi of each ball from its pair's middle, are in the ratio 2 : 1 as the
// tide diag(1, 1, -2) says. Not to scale, as the caption says: the hole's size against the distances, delta phi and the
// gaps (a real pair is small beside r).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { INK, FAINT, ACCENT, ACCENT2, PAGE } from '../lib.js';
import { chapter, palette, near, HOLE, RS, fall, fallTime } from './tut-schw-lib.js';

const name = 'tut-schw-falling-pair';
const check = checker(name);

// ---- the drawing (points); radii in GM/c^2 --------------------------------------------------------------------------
const K = 10;                                   // points per GM/c^2
const HOLE_R = 12;                              // the hole's radius on the page (schematic: K r_s would be 20)
const ANGLES = { across: [20, 2], along: -24 };  // the three radii, degrees above the horizontal, from the hole's centre
const R_LATE = 11, R_EARLY = 18;                // the pair across at its two moments, GM/c^2 (5.5 and 9 r_s)
const LINE_END = 23.5;                          // the radial lines run from the horizon to here
const BEAD = 3.2;                               // tut-tides: a bead's radius, colour and lighting
const BEAD_COLOUR = '#868b92';
const BEAD_LOOK = { spec: 0.6, shininess: 36 };
const EARLY = 0.38;                             // the earlier moment's opacity
const ARROW = { width: 0.55, head: 3.2, tail: 1.35, blue: 11 };   // tut-tides' arrows; the blue one's length
const RADIAL = 0.4;                             // the radial lines
const EDGE = 0.45;                              // the hole's edge
const ARC = { out: 9, width: HAIR, end: 2.2 };  // the gap's arc: how far outside the solid pair, its stroke; its name's offset
const caption = 'Look first at the pair on two radii: both fall by the exact law of a single body, so their gap $r\\,\\delta\\varphi$ shrinks with $r$, a squeeze $G\\matter M/r^3$ across. Empty space has no trace of tide, so the stretch along the radius is twice as large. Distances are not to scale.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'schw-falling-pair', caption);

	const S = new Sheet(name);
	const L = [];
	const hole = [ORIGIN - 110, ORIGIN];
	const rad = (d) => (d * Math.PI) / 180;
	/** The page point at r (GM/c^2) on the radius at `deg` degrees. */
	const at = (r, deg) => [hole[0] + K * r * Math.cos(rad(deg)), hole[1] - K * r * Math.sin(rad(deg))];

	// ---- the falls: the two moments are one proper time apart
	const dtau = fallTime(R_EARLY, R_LATE);
	check(near(fall(R_EARLY, dtau), R_LATE, 1e-9), 'the pair across does not reach R_LATE');
	const dphi = rad(ANGLES.across[0] - ANGLES.across[1]);
	// the solid pairs' gaps, equal: the chord of the pair across, and the same distance along the third radius
	const chord = 2 * R_LATE * Math.sin(dphi / 2);
	const along = { late: [R_LATE, R_LATE + chord] };
	// each ball of the pair along fell for the same dtau: back in time on its own E = 1 path
	const before = (r) => ((r ** 1.5) + (3 / Math.SQRT2) * dtau) ** (2 / 3);
	along.early = along.late.map(before);
	along.late.forEach((r, i) => check(near(fall(along.early[i], dtau), r, 1e-9), `the ball ${i} along does not fall in dtau`));
	const gapEarly = along.early[1] - along.early[0], gapLate = chord;
	check(gapEarly < gapLate, 'the pair along is not farther apart later');
	check(2 * R_EARLY * Math.sin(dphi / 2) > chord && near(chord / (2 * R_EARLY * Math.sin(dphi / 2)), R_LATE / R_EARLY, 1e-12), 'the gap across does not shrink as r');
	check(along.early[1] < LINE_END - 2, 'the lines are too short');

	// ---- the hole and the radial lines
	S.raw(`<circle cx="${n2(hole[0])}" cy="${n2(hole[1])}" r="${HOLE_R}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 2);
	S.mark(Array.from({ length: 73 }, (_, i) => [hole[0] + HOLE_R * Math.cos((i * Math.PI) / 36), hole[1] + HOLE_R * Math.sin((i * Math.PI) / 36)]), EDGE / 2, 'the hole');
	for (const deg of [...ANGLES.across, ANGLES.along])
		S.path([at((HOLE_R + EDGE / 2) / K, deg), at(LINE_END, deg)], { color: FAINT, width: RADIAL, layer: 1, cap: 'butt', what: `the radius at ${deg}` });

	// ---- the balls, faint at the earlier moment, solid at the later
	// a faint ball stands on a disc of the page, so that the radial line under it does not show through
	const bead = (p, early, what) => {
		if (early) S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${BEAD}" fill="${PAGE}"/>`, 2.4);
		S.sphere(p, BEAD, BEAD_COLOUR, { ...BEAD_LOOK, layer: early ? 2.5 : 3, ...(early ? { opacity: EARLY } : {}) }, what);
	};
	for (const deg of ANGLES.across) { bead(at(R_EARLY, deg), true, `the earlier ball at ${deg}`); bead(at(R_LATE, deg), false, `the later ball at ${deg}`); }
	along.early.forEach((r, i) => bead(at(r, ANGLES.along), true, `the earlier ball ${i} along`));
	along.late.forEach((r, i) => bead(at(r, ANGLES.along), false, `the later ball ${i} along`));

	// ---- the arrows on the solid pairs: -E xi of each ball from its pair's middle, at one scale
	const per = ARROW.blue / (chord / 2);           // points of arrow per GM/c^2 of xi, per GM/r^3
	const arrows = [];
	const arrow = (from, u, len, color, what) => {
		const A = [from[0] + u[0] * (BEAD + ARROW.tail), from[1] + u[1] * (BEAD + ARROW.tail)];
		const B = [A[0] + u[0] * len, A[1] + u[1] * len];
		arrows.push({ ...S.arrow(A, B, { color, width: ARROW.width, head: ARROW.head, layer: 4, what }), color });
	};
	{
		// across: each toward the other, along the chord, |E xi| = (GM/r^3)(chord/2)
		const [p, q] = ANGLES.across.map((deg) => at(R_LATE, deg));
		const d = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / d, (q[1] - p[1]) / d];
		check(near(d, K * chord, 1e-9), 'the pair across is not a chord apart');
		arrow(p, u, per * 1 * (chord / 2), ACCENT2, 'the squeeze on the upper ball');
		arrow(q, [-u[0], -u[1]], per * 1 * (chord / 2), ACCENT2, 'the squeeze on the lower ball');
		// along: each away from the other, |E xi| = (2GM/r^3)(gap/2)
		const v = [Math.cos(rad(ANGLES.along)), -Math.sin(rad(ANGLES.along))];
		const [a, b] = along.late.map((r) => at(r, ANGLES.along));
		arrow(b, v, per * 2 * (gapLate / 2), ACCENT, 'the stretch on the outer ball');
		arrow(a, [-v[0], -v[1]], per * 2 * (gapLate / 2), ACCENT, 'the stretch on the inner ball');
	}
	const blue = arrows.filter((a) => a.color === ACCENT2), orange = arrows.filter((a) => a.color === ACCENT);
	for (const o of orange) for (const b of blue) check(near(o.L / b.L, 2, 1e-9), 'an orange arrow is not twice a blue one');
	{
		// the two blue arrows leave air between their tips
		const [s, t] = blue;
		check(Math.hypot(s.B[0] - t.B[0], s.B[1] - t.B[1]) >= 2, 'the blue arrows meet');
		// the inner orange arrow stays clear of the hole
		const inner = orange[1];
		check(Math.hypot(inner.B[0] - hole[0], inner.B[1] - hole[1]) > HOLE_R + 6, 'the inner orange arrow reaches the hole');
	}

	// ---- the gap's arc: concentric with the hole, ARC.out outside the solid pair, ending on the two radii
	const rArc = K * R_LATE + ARC.out;
	{
		const [d0, d1] = ANGLES.across.map(rad);
		const pts = Array.from({ length: 121 }, (_, i) => { const t = d1 + ((d0 - d1) * i) / 120; return [hole[0] + rArc * Math.cos(t), hole[1] - rArc * Math.sin(t)]; });
		S.path(pts, { color: INK, width: ARC.width, layer: 2, cap: 'butt', what: 'the gap\'s arc' });
		// its name beyond its middle, on the bisector
		const m = rad((ANGLES.across[0] + ANGLES.across[1]) / 2), u = [Math.cos(m), -Math.sin(m)];
		L.push(await S.clear('r\\,\\delta\\varphi', hole[0] + (rArc + ARC.end) * u[0] + 1, hole[1] + (rArc + ARC.end) * u[1], 0, 0.5, u));
	}

	// ---- the names of the arrows
	{
		const top = at(R_LATE, ANGLES.across[0]);
		L.push(await S.clear('\\text{squeeze, }GM/r^3', top[0], top[1] - BEAD - LABEL_GAP, 0.5, 1, [0, -1]));
		// under the pair along, at its middle, moved off the line at right angles
		const [a, b] = along.late.map((r) => at(r, ANGLES.along));
		const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t = rad(ANGLES.along), n = [Math.sin(t), Math.cos(t)];
		check(n[1] > 0, 'the stretch\'s name is not under its line');
		L.push(await S.clear('\\text{stretch, }2GM/r^3', m[0] + n[0] * 6, m[1] + n[1] * 6, 0.5, 0.5, n));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { dtau, along, chord, gapEarly, ratioAcross: R_LATE / R_EARLY, ratioAlong: gapLate / gapEarly };
	return finish(S, L, [240, 300]);
}
