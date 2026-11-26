// The tutorial, section 6.3 (tutorial/relativity/aberration.md), its first diagram: one ray of light in two frames.
// One panel, 110 points to the unit of omega/c, x across and y up. From the centre O, a small ink dot: the observer's
// velocity, a thick arrow in the observer's colour pointing right, beta = 0.6 units long, named "beta = 0.6" under
// it; the wave's direction of travel in the source's frame, k = (0, -1), for light coming straight down from a source
// straight above (alpha = 90 degrees), an ink arrow of length 1, named "omega, source's frame"; the same ray for the
// observer, (omega'/omega) k' = (-0.75, -1), an arrow in the observer's colour of length 1.25, named
// "omega' = 1.25 omega, observer". From O, thin dashed lines along the directions of view, (0, 1) in ink, named "seen
// at rest", and (0.6, 0.8) in the observer's colour, named "seen moving". Two arcs from the beta arrow: alpha = 90
// degrees to the first (ink, the inner one) and alpha' = 53.1 degrees to the second (the observer's colour, the outer).
// Exact: the two arrows' ends and lengths, 1 and 1.25 units (eq:ray-boost, asserted in tut-aberration-lib.js and here
// on the page), the two directions of view and the arcs' angles. Schematic: the dashed lines' lengths, the arcs' radii.
// The beta arrow is drawn 0.6 units long: in eq:ray-boost beta is subtracted from the parallel part of k, in these
// units, so its length is the one the boost uses.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, VEC, VEC_HEAD, HAIR } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, RAY, rayBoost, BETA, GAMMA, rad } from './tut-aberration-lib.js';

const name = 'tut-aberration-ray';
const check = checker(name);

const U = 110;                             // points per unit of omega/c
const EVENT = DOT + 0.25;                  // O's dot, radius (section 6.1's events)
const CLEAR = 1.2;                         // the air between O's dot and the lines from it
const THICK = 1.2, THICK_HEAD = 5.2;       // the velocity's stroke and head
const SIGHT = 1.0;                         // the dashed lines of view, units
const ARC_IN = 38, ARC_OUT = 54;           // the arcs' radii, points
const ARC = 0.5;                           // their stroke

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const o = [ORIGIN, ORIGIN];
	const at = ([x, y]) => [o[0] + U * x, o[1] - U * y];
	const out = (u, s) => [o[0] + u[0] * s, o[1] - u[1] * s];       // s points from O along the unit vector u (y up)

	// ---- the ray in both frames
	const ray = rayBoost(RAY.k, RAY.beta);
	const ink = RAY.k, obs = ray.num;                                // (omega/omega) k and (omega'/omega) k'
	check(near(Math.hypot(...ink), 1, 1e-15) && near(Math.hypot(...obs), GAMMA, 1e-15), 'the arrows\' lengths are not 1 and 1.25');
	const view = [-ray.k[0], -ray.k[1]];                             // the observer's direction of view, (0.6, 0.8)
	check(near(view[0], 0.6, 1e-15) && near(view[1], 0.8, 1e-15), `the direction of view ${view}`);

	// ---- O
	S.raw(`<circle cx="${o[0]}" cy="${o[1]}" r="${EVENT}" fill="${INK}"/>`, 3);
	S.mark([o], EVENT, 'O');
	const from = EVENT + CLEAR;

	// ---- the two arrows: their tips at the frequencies, on the page at one scale
	for (const [v, color, what] of [[ink, INK, 'the ray at rest'], [obs, OBS, 'the ray moving']]) {
		const l = Math.hypot(...v), u = [v[0] / l, v[1] / l];
		const A = S.arrow(out(u, from), at(v), { color, width: VEC, head: VEC_HEAD, what });
		check(near(Math.hypot(A.B[0] - o[0], A.B[1] - o[1]) / U, l, 1e-12), `${what}: its length on the page`);
	}
	// ---- the velocity, beta units long
	const beta = S.arrow(out([1, 0], from), at(RAY.beta), { color: OBS, width: THICK, head: THICK_HEAD, what: 'the velocity' });
	check(near((beta.B[0] - o[0]) / U, BETA, 1e-12), 'the velocity is not 0.6 units long');

	// ---- the directions of view, dashed
	dashed(S, out([0, 1], from), out([0, 1], from + SIGHT * U), { color: INK, width: THIN, dash: DASH, what: 'the view at rest' });
	dashed(S, out(view, from), out(view, from + SIGHT * U), { color: OBS, width: THIN, dash: DASH, what: 'the view moving' });

	// ---- the arcs from the velocity: alpha = 90 degrees (inner, ink) and alpha' = 53.1 degrees (outer)
	const alpha = Math.PI / 2, alphaSeen = Math.atan2(view[1], view[0]);
	check(near(alphaSeen, rad(nums.alphaSeen), 1e-12) && (alphaSeen * 180 / Math.PI).toFixed(1) === '53.1', 'the arc of alpha\'');
	const arc = (r, a1, color, what) => {
		const n = 90, pts = Array.from({ length: n + 1 }, (_, i) => out([Math.cos((a1 * i) / n), Math.sin((a1 * i) / n)], r));
		S.path(pts, { color, width: ARC, layer: 1, what });
	};
	arc(ARC_IN, alpha, DIM, 'the arc of alpha');
	arc(ARC_OUT, alphaSeen, OBS, 'the arc of alpha\'');

	// ---- the names
	// beta under its arrow
	L.push(await placed('\\beta = 0.6', (beta.A[0] + beta.B[0]) / 2 + 4, o[1] + THICK / 2 + LABEL_GAP + 1.4, 0.5, 0, OBS));
	// the ink arrow's at its right, a little below its middle; the observer's beside its middle, away from the other
	L.push(await S.clear('\\omega,\\ \\text{source\'s frame}', o[0] + LABEL_GAP + 1, at([0, -0.62])[1], 0, 0.5, [1, 0]));
	{
		const l = Math.hypot(...obs), u = [obs[0] / l, obs[1] / l];          // y up
		const n = [u[1], -u[0]];                                               // the normal away from the ink arrow, y up
		check(n[0] < 0 && n[1] > 0, 'the observer\'s name is not on the outer side');
		const m = at([obs[0] * 0.56, obs[1] * 0.56]);
		L.push(await beside("\\omega' = 1.25\\,\\omega,\\ \\text{observer}", m, [n[0], -n[1]], LABEL_GAP + 0.6, OBS));
	}
	// the views at their far ends
	{
		const top = out([0, 1], from + SIGHT * U);
		L.push(await placed('\\text{seen at rest}', top[0], top[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
		const end = out(view, from + SIGHT * U);
		L.push(await beside('\\text{seen moving}', end, [view[0], -view[1]], LABEL_GAP + 0.6, OBS));
	}
	// alpha' outside its arc on the bisector; alpha in the wedge between the two views, which only its arc spans
	{
		const b = alphaSeen / 2, u = [Math.cos(b), -Math.sin(b)];
		L.push(await beside("\\alpha' = 53.1^\\circ", out([Math.cos(b), Math.sin(b)], ARC_OUT), u, LABEL_GAP + 0.6, OBS));
		const w = (alpha + alphaSeen) / 2;
		L.push(await S.clear('\\alpha = 90^\\circ', out([Math.cos(w), Math.sin(w)], ARC_IN + 6)[0], out([Math.cos(w), Math.sin(w)], ARC_IN + 6)[1], 0.5, 0.5, [Math.cos(w), -Math.sin(w)]));
	}
	check(GAMMA.toFixed(2) === '1.25' && nums.D === GAMMA, 'the printed factor');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [200, 300]);
}
