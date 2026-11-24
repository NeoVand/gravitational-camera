// The tutorial, chapter 13.5 (tutorial/what-a-field-keeps/impulsive-waves.md), its first diagram: what crosses the
// front. Two spacetime diagrams side by side that share the height ct, each at one scale on both axes, so that light
// runs at 45 degrees in the first. Left, z across: the front u = 0, the line ct = z, thick in the field's colour; three
// paths in ink, each straight before and after the front: (1) slow matter at rest, (2) light along +z, a 45-degree line
// behind the front that never meets it, (3) light along -z, a -45-degree line; (1) and (3) cross where H = 0, so that they
// are continuous here, and a dot marks each crossing. A dashed copy of (1) crosses where H > 0: its far part starts
// shifted by H/2 in z and in ct along the front, the jump of v by H, named so. Right, the place x across the front, taken
// along gradH: the same paths, with the same heights; there the kinks are seen, slow matter and light against the
// front turning toward +x_perp, light with the front never turning. Under the right diagram, gradH and the three kicks
// (1/2) q gradH for q = mc, 0 and 2E/c, to one scale.
// Departures from the diagram's comment: the kinks out of the plane of z and ct are drawn in a second diagram of
// x_perp and ct, which shares the first's heights, rather than by an arrow across the first, so that each kink is a
// true angle in the page; the side panel's plane of the front is replaced by that diagram, and its arrows, gradH and
// the three kicks to one scale, stand under it. The paths are named.
// Exact (tut-impulsive-lib.js): the front and light along +z at 45 degrees on the page (asserted), light along -z at
// -45 degrees before the front; each path after the front from q and the rest mass kept and Delta p_perp = (1/2) q
// gradH with |gradH| = 0.3: slow matter's velocity per unit of ct (0.148 along x_perp, 0.011 along z), light against the
// front (0.293, -0.956), light with it unchanged; the copy crossing at x_perp = 2/3, where H = 0.2, its far part shifted
// by (0.1, 0.1) in (z, ct) and by 0.1 in ct on the right; the arrows 0.3, 0.15, 0 and 0.3 to one scale. Exaggerated, as
// the caption says: |gradH| = 0.3, against the text's 10^-6 (the turn of light is then 0.298 rad, |gradH| to first
// order).
import { INK, DIM, FAINT, tex } from '../lib.js';
import { text } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, SIZE, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, LINE, n2 } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { lines } from './tut-stress-lib.js';
import { chapter, GRAD, FIELD } from './tut-impulsive-lib.js';

const name = 'tut-impulsive-front';
const check = checker(name);

// ---- the events (units: z, ct and x_perp alike) -------------------------------------------------------------------
const U = 58;                                  // points per unit, both diagrams, both axes
const BOTTOM = -1.45, TOP = 1.45;              // the paths' ends in ct
const ZL = [-1.62, 1.62], XL = [-0.72, 1.25];  // the diagrams' widths: z, x_perp
const GAP = 30;                                // between the diagrams, points
const Z1 = -0.95;                              // (1) slow matter at z = Z1, x_perp = 0
const BEHIND = 0.62;                           // (2) light along +z: ct = z + BEHIND, at x_perp = X2
const X2 = 1.08;
const Z3 = 0.62, START3 = -0.25;               // (3) light along -z crosses at z = ct = Z3, x_perp = 0; starts at ct = START3
const XC = 2 / 3, ZC = -0.28;                  // the copy of (1): x_perp = XC, crossing at z = ct = ZC
const COPY = [0.72, 0.72];                     // its lengths in ct before and after the front (a short copy)
const FRONT_W = 1.5;                           // the front's stroke
const DOT_R = 1.15;                            // a crossing
const KS = 1.55;                               // the arrows: units of x_perp per unit of gradH and of momentum (mc)
const ROW = 12.5;                              // between the arrows under the right diagram, points
const caption = 'Look first at the two kinks on the right: slow matter and light running against the front turn, while light riding with it does not. Left, the paths against $z$: they cross the front where the profile is zero, and where it is not, the dashed path shows the far part shifted along the front. Right, the same paths against the place $x$ across the front, taken along $\\nabla H$, and under them $\\nabla H$ and the kicks $\\tfrac12q\\nabla H$ to one scale. Kinks drawn for one value of $\\nabla H$, exaggerated.';

export default async function () {
	const { state, kicks } = await chapter(check);
	state(name, 'impulsive-front', caption);
	const [mat, wit, ag] = kicks;
	check(wit.kick === 0 && near(mat.kick, 0.15) && near(ag.kick, 0.3), 'the kicks');
	const S = new Sheet(name);
	const L = [];
	const W1 = (ZL[1] - ZL[0]) * U;
	const left = ORIGIN - (W1 + GAP + (XL[1] - XL[0]) * U) / 2;
	const o1 = [left - ZL[0] * U, ORIGIN];                     // the page point of z = 0, ct = 0
	const o2 = [left + W1 + GAP - XL[0] * U, ORIGIN];          // of x_perp = 0, ct = 0
	const A = ([z, ct]) => [o1[0] + U * z, o1[1] - U * ct];
	const B = ([x, ct]) => [o2[0] + U * x, o2[1] - U * ct];
	const H = (x) => GRAD * x;                                   // the profile along gradH, zero at x_perp = 0

	/** A path through the front: before from ct0 to the crossing at z = ct = zx (place x_perp = x), after, shifted by
	 * H(x)/2 in z and ct, to TOP with the velocity per unit of ct (vz before, vz1 and vx1 after). */
	const through = ({ ct0, zx, x, vz, k, top = TOP }) => {
		const z0 = zx + vz * (ct0 - zx);
		check(near(z0 + vz * (zx - ct0), zx, 1e-12), 'a path misses its crossing');
		const jump = H(x) / 2, X = [zx + jump, zx + jump];
		const vz1 = k.vz, vx1 = k.vperp;
		const t = top - X[1];
		return {
			zct: { before: [[z0, ct0], [zx, zx]], after: [X, [X[0] + vz1 * t, top]] },
			xct: { before: [[x, ct0], [x, zx]], after: [[x, X[1]], [x + vx1 * t, top]] },
			jump
		};
	};
	const p1 = through({ ct0: BOTTOM, zx: Z1, x: 0, vz: 0, k: mat });
	const p3 = through({ ct0: START3, zx: Z3, x: 0, vz: -1, k: ag });
	const pc = through({ ct0: ZC - COPY[0], zx: ZC, x: XC, vz: 0, k: mat, top: ZC + GRAD * XC / 2 + COPY[1] });
	check(p1.jump === 0 && p3.jump === 0 && near(pc.jump, 0.1, 1e-12) && near(H(XC), 0.2, 1e-12), 'the crossings\' H');
	check(near(mat.vperp, 0.148, 1e-3) && near(mat.vz, 0.011, 1e-3) && near(ag.vperp, 0.293, 1e-3) && near(ag.vz, -0.956, 1e-3), 'the velocities after');

	// ---- the axes, thin and faint, at each diagram's lower left
	const base = BOTTOM - 0.12;
	{
		const a = A([ZL[0], base]);
		const z = S.arrow(a, A([ZL[1], base]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the z axis' });
		const t = S.arrow(a, A([ZL[0], TOP + 0.12]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis' });
		L.push(await placed('z', z.B[0] + LABEL_GAP + 0.6, z.B[1], 0, 0.5, DIM));
		L.push(await placed('ct', t.B[0], t.B[1] - LABEL_GAP - 0.6, 0.5, 1, DIM));
		const b = B([XL[0], base]);
		const x = S.arrow(b, B([XL[1], base]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
		const t2 = S.arrow(b, B([XL[0], TOP + 0.12]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis 2' });
		L.push(await placed('x', x.B[0] + LABEL_GAP + 0.6, x.B[1], 0, 0.5, DIM));
		L.push(await placed('ct', t2.B[0], t2.B[1] - LABEL_GAP - 0.6, 0.5, 1, DIM));
	}

	// ---- the front, left
	{
		const a = A([ZL[0] + 0.14, ZL[0] + 0.14]), b = A([TOP, TOP]);
		check(near(b[0] - a[0], a[1] - b[1], 1e-9), 'the front is not at 45 degrees');
		S.path([a, b], { color: FIELD, width: FRONT_W, layer: 1.5, cap: 'butt', what: 'the front' });
		L.push(await placed('u = 0', b[0] + LABEL_GAP + 1.2, b[1] + 1, 0, 0.5, FIELD));
	}

	// ---- the paths
	const solid = (P, pts, what) => S.path(pts.map(P), { color: INK, width: LINE, layer: 3, cap: 'butt', what });
	const dash = (P, [a, b], what) => dashed(S, P(a), P(b), { color: INK, width: LINE, layer: 3, what });
	for (const [P, view] of [[A, 'zct'], [B, 'xct']]) {
		solid(P, [p1[view].before[0], p1[view].before[1], p1[view].after[1]], `slow matter ${view}`);
		solid(P, [p3[view].before[0], p3[view].before[1], p3[view].after[1]], `light along -z ${view}`);
		dash(P, pc[view].before, `the copy before ${view}`);
		dash(P, pc[view].after, `the copy after ${view}`);
		for (const p of [p1, p3]) { const q = P(p[view].before[1]); S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT_R}" fill="${INK}"/>`, 4); S.mark([q], DOT_R, `a crossing ${view}`); }
		for (const q of [P(pc[view].before[1]), P(pc[view].after[0])]) { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT_R * 0.8}" fill="${INK}"/>`, 4); S.mark([q], DOT_R * 0.8, `the copy's ends ${view}`); }
	}
	check(near(A(p3.zct.before[0])[0] - A(p3.zct.before[1])[0], A(p3.zct.before[0])[1] - A(p3.zct.before[1])[1], 1e-9), 'light along -z is not at 45 degrees');
	// (2), light along +z behind the front, at x_perp = X2
	{
		const a = [ZL[0] + 0.06, ZL[0] + 0.06 + BEHIND], b = [TOP - BEHIND, TOP];
		check(near(A(b)[0] - A(a)[0], A(a)[1] - A(b)[1], 1e-9), 'light along +z is not at 45 degrees');
		solid(A, [a, b], 'light along +z zct');
		solid(B, [[X2, a[1]], [X2, TOP]], 'light along +z xct');
	}

	// ---- the names, left, at the paths' upper ends
	{
		// on two baselines shared by all three names (MathJax's baseline, lib.js tex's anchor 'cB'), the second row
		// LABEL_GAP + 2 points above the paths' upper ends, so that the signs' small descent clears them
		const base2 = A([0, TOP])[1] - LABEL_GAP - 2, base1 = base2 - 10.2;
		const at = async (src, x, y) => { const svg = await tex(src, [x, y], SIZE, 'cB', INK); return { src, svg, box: boxOf(svg) }; };
		const names = [[['\\text{slow matter}'], A(p1.zct.after[1])[0]], [['\\text{light along}', '-z'], A(p3.zct.after[1])[0]], [['\\text{light along}', '+z'], A([TOP - BEHIND, TOP])[0]]];
		for (const [srcs, x] of names) {
			if (srcs.length === 1) L.push(await at(srcs[0], x, base2));
			else { L.push(await at(srcs[0], x, base1)); L.push(await at(srcs[1], x, base2)); }
		}
	}
	{
		const q = A(pc.zct.after[0]);
		L.push(await S.clear('\\Delta v = H', q[0] + LABEL_GAP + 2.5, q[1] + 2, 0, 0.5, [1, 0], { color: INK }));
	}

	// ---- the names, right: each path's q, beside its crossing (left of it) or above its end
	for (const [p, lab] of [[p1, 'q = mc'], [p3, 'q = 2E/c']]) {
		const q = B(p.xct.before[1]);
		L.push(await placed(lab, q[0] - DOT_R - LABEL_GAP - 1.2, q[1], 1, 0.5, INK));
	}
	{
		// on the left names' second baseline
		const svg = await tex('q = 0', [B([X2, TOP])[0], A([0, TOP])[1] - LABEL_GAP - 2], SIZE, 'cB', INK);
		L.push({ src: 'q = 0', svg, box: boxOf(svg) });
	}

	// ---- gradH and the kicks, under the right diagram, to one scale
	{
		const x0 = B([0, 0])[0];
		const y0 = B([0, base])[1] + 14;
		const rows = [['\\nabla H', GRAD, FIELD], ['q = mc', mat.kick, INK], ['q = 0', wit.kick, INK], ['q = 2E/c', ag.kick, INK]];
		const tipMost = x0 + KS * U * Math.max(...rows.map((r) => r[1]));
		for (const [i, [lab, len, color]] of rows.entries()) {
			const y = y0 + i * ROW;
			if (len > 0) S.arrow([x0, y], [x0 + KS * U * len, y], { color: i === 0 ? INK : INK, width: VEC, head: VEC_HEAD, layer: 3, what: `the arrow ${lab}` });
			else { S.raw(`<circle cx="${n2(x0)}" cy="${n2(y)}" r="${DOT_R}" fill="${INK}"/>`, 3); S.mark([[x0, y]], DOT_R, `the arrow ${lab}`); }
			L.push(await placed(lab, tipMost + LABEL_GAP + 2, y, 0, 0.5, i === 0 ? INK : INK));
			void color;
		}
		check(near(GRAD, 2 * mat.kick) && near(ag.kick, GRAD), 'the arrows are not 0.3, 0.15, 0, 0.3');
	}

	S.checkAll(L);
	return finish(S, L, [300, 420]);
}
