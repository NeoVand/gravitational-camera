// The tutorial, chapter 6.5 (tutorial/relativity/stress-energy.md), its third diagram: a ray meets a particle. One
// panel, a spacetime diagram with z across and ct upward at one scale, thin faint axes named "z" and "ct". The null
// ray ct = z + u0 at 45 degrees, in ink, named "ray, u = u0", and the rays u = u0 +- 0.3 thin, dotted and faint on
// either side of it. The worldline of a particle moving along +z at 0.4c, the straight line of slope 1/0.4 in
// matter's colour, named "particle, v_z = 0.4c", with a filled dot where the ray meets it. Along the ray, a thin
// bracket between the points level with the two meetings of the dotted rays with the worldline, named
// "dl = du/(1 - v_z/c)"; on the z axis, a bracket of the same du between the dotted rays' feet, named "du".
// Departures from the diagram's comment: the ray's bracket runs parallel to the ray, 11 points to its left, so that
// its ends stay level with the meetings, and two short, faint, level ties run from the dotted rays' meetings with the
// worldline to its ends: the bracket's ends stand at the meetings' ct, the ray's parameter l = ct. The meetings carry
// small open rings. The bracket's name stands in the empty corner beyond the upper dotted ray; the ray's name stands
// at its upper end, right of the panel.
// Exact: the ray and the dotted rays at 45 degrees on the page and du = 0.6 apart along z (asserted), the worldline's
// slope 2.5 (asserted), the crossing at (z, ct) = (1.45, 1), the meetings at ct = 0.5 and 1.5, so that the ray's
// bracket spans dl = 1.0 = 0.6/(1 - 0.4) (asserted on the page and in tut-stress-lib.js). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, LINE, HAIR } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { measure } from './tut-rad-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, MATTER, VZ, HALF_DU, stretch, lines } from './tut-stress-lib.js';

const name = 'tut-stress-null-crossing';
const check = checker(name);

const U = 84;                              // points per unit, both axes
const Z1 = 2.5, T1 = 2.3;                  // the panel: z from 0 to Z1, ct from 0 to T1
const U0 = -0.45;                          // the ray u = ct - z = u0
const Z0 = 1.05;                           // the particle's z at ct = 0
const POINT = DOT + 0.45;                  // the crossing's dot, radius
const RING = 1.5, RING_W = 0.4;            // the meetings' open rings
const SHIFT = 11;                          // the ray's bracket, this far left of the ray, points
const BELOW = 6.5;                         // the z axis's bracket, this far below the axis
const RAY = 0.7;                           // the ray's stroke

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - (Z1 * U) / 2, top: ORIGIN - (T1 * U) / 2, w: Z1 * U, h: T1 * U, x0: 0, x1: Z1, y0: 0, y1: T1 });
	const at = ([z, ct]) => P.at(z, ct);
	const o = at([0, 0]);

	// ---- the axes, thin and faint
	const zA = S.arrow(o, at([Z1 + 0.12, 0]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the z axis' });
	const tA = S.arrow(o, at([0, T1 + 0.12]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis' });
	L.push(await placed('z', zA.B[0] + LABEL_GAP + 0.6, zA.B[1], 0, 0.5, DIM));
	L.push(await placed('ct', tA.B[0], tA.B[1] - LABEL_GAP - 0.6, 0.5, 1, DIM));

	// ---- the rays u = ct - z, from the z axis to the panel's edge
	const ray = (u) => {
		const a = [-u, 0];
		const b = T1 + -u <= Z1 ? [T1 - u, T1] : [Z1, Z1 + u];      // the top edge, or the right one
		return [a, b];
	};
	const rays = {};
	for (const u of [U0 - HALF_DU, U0, U0 + HALF_DU]) {
		const [a, b] = ray(u);
		const A = at(a), B = at(b);
		check(near(Math.abs(B[0] - A[0]), Math.abs(B[1] - A[1]), 1e-9), `the ray ${u} is not at 45 degrees`);
		check(near(b[1] - b[0], u, 1e-12) && near(a[1] - a[0], u, 1e-12), `the ray ${u} is off u = ct - z`);
		if (u === U0) S.path([A, B], { color: INK, width: RAY, layer: 2, cap: 'butt', what: 'the ray' });
		else S.dots(A, B, { color: FAINT, clear0: AXIS / 2 + 0.9, layer: 1.5, what: `the dotted ray ${u}` });
		rays[u] = { a, b, A, B };
	}
	const du = 2 * HALF_DU;
	check(near((U0 + HALF_DU) - (U0 - HALF_DU), du, 1e-15) && near(rays[U0 - HALF_DU].a[0] - rays[U0 + HALF_DU].a[0], du, 1e-15), 'the dotted rays are not du = 0.6 apart along z');

	// ---- the worldline z = Z0 + 0.4 ct, to the top edge
	const world = (ct) => [Z0 + VZ * ct, ct];
	{
		const A = at(world(0)), B = at(world(T1));
		check(near((A[1] - B[1]) / (B[0] - A[0]), 1 / VZ, 1e-9) && near(1 / VZ, 2.5, 1e-15), 'the worldline\'s slope is not 1/0.4 on the page');
		check(world(T1)[0] < Z1, 'the worldline leaves the panel by its side');
		S.path([A, B], { color: MATTER, width: LINE, layer: 2.1, cap: 'butt', what: 'the worldline' });
	}
	/** Where the ray u meets the worldline: ct - (Z0 + 0.4 ct) = u. */
	const meet = (u) => world((u + Z0) / (1 - VZ));
	const X = meet(U0), lo = meet(U0 - HALF_DU), hi = meet(U0 + HALF_DU);
	check(near(X[0], 1.45, 1e-12) && near(X[1], 1, 1e-12), `the crossing ${X}`);
	check(near(lo[1], 0.5, 1e-12) && near(hi[1], 1.5, 1e-12), `the meetings at ct ${lo[1]} and ${hi[1]}`);
	check(near(hi[1] - lo[1], stretch(du), 1e-12) && near(stretch(du), 1, 1e-12), 'the meetings are not dl = du/(1 - v_z/c) apart');
	// each meeting is on its dotted ray
	for (const [m, u] of [[lo, U0 - HALF_DU], [hi, U0 + HALF_DU]]) check(near(m[1] - m[0], u, 1e-12), 'a meeting is off its ray');

	// ---- the bracket along the ray, SHIFT to its left (so its ends stay level with the meetings), from ct = 0.5 to
	// 1.5; the level ties from the meetings to its ends
	const onRay = (ct) => at([ct - U0, ct]);
	const e0 = onRay(lo[1]), e1 = onRay(hi[1]);
	const b0 = [e0[0] - SHIFT, e0[1]], b1 = [e1[0] - SHIFT, e1[1]];
	measure(S, b0, b1, { color: INK, layer: 2.5, what: 'the ray\'s bracket' });
	check(near(b1[1] - b0[1], -stretch(du) * U, 1e-9) && near(b1[0] - b0[0], stretch(du) * U, 1e-9), 'the ray\'s bracket does not span dl = 1.0 of ct along the ray');
	for (const [m, e, what] of [[lo, b0, 'the lower tie'], [hi, b1, 'the upper tie']]) {
		const q = at(m);
		check(near(q[1], e[1], 1e-9), `${what} is not level`);
		// from the meeting's ring to the bracket's end, level: the meetings stand at the bracket's ct
		const s = Math.sign(e[0] - q[0]);
		S.path([[q[0] + s * (RING + 0.9), q[1]], [e[0] - s * (HAIR + 0.6), e[1]]], { color: DIM, width: HAIR, layer: 1.8, cap: 'butt', what });
		S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${RING}" fill="none" stroke="${MATTER}" stroke-width="${RING_W}"/>`, 3);
		S.mark([q], RING + RING_W / 2, `${what}'s ring`);
	}
	const n = [-Math.SQRT1_2, -Math.SQRT1_2];          // the page's normal to the ray, up and to the left

	// ---- the crossing's dot
	{
		const q = at(X);
		S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${POINT}" fill="${MATTER}"/>`, 4);
		S.mark([q], POINT, 'the crossing');
	}

	// ---- the bracket on the z axis, between the dotted rays' feet
	{
		const a = at([rays[U0 + HALF_DU].a[0], 0]), b = at([rays[U0 - HALF_DU].a[0], 0]);
		const y = o[1] + BELOW;
		measure(S, [a[0], y], [b[0], y], { color: INK, layer: 2.5, what: 'the z axis\'s bracket' });
		check(near(b[0] - a[0], du * U, 1e-9), 'the z axis\'s bracket does not span du = 0.6');
		L.push(await placed('du', (a[0] + b[0]) / 2, y + 2.5 + LABEL_GAP + 0.3, 0.5, 0, INK));
	}

	// ---- the names
	{
		const m = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
		L.push(await lines(S, ['d\\ell = du/(1 - v_z/c)'], m[0] + n[0] * 3, m[1] + n[1] * 3, 1, 1, n, INK, L));
		const end = rays[U0].B;
		L.push(await lines(S, ['\\text{ray,}', 'u = u_0'], end[0] + LABEL_GAP + 1.2, end[1], 0, 0.5, [0, -1], INK, L));
		const top = at(world(T1));
		L.push(await lines(S, ['\\text{particle,}', 'v_z = 0.4c'], top[0], top[1] - LABEL_GAP - 0.6, 0.5, 1, [0, -1], MATTER, L));
	}
	check(VZ === 0.4 && HALF_DU === 0.3, 'the printed speed and the rays\' spacing');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, crossing: X, meetings: [lo, hi] };
	return finish(S, L, [240, 300]);
}
