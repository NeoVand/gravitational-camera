// The tutorial, section 5.1 (tutorial/waves/wave-equation.md), its first diagram: a sheared block and the forces on
// one slice. A long block of solid seen from the side, x to the right and y up, its outline at rest dashed. Thin
// vertical lines mark slices a fixed distance apart; each is shifted up by u(x), a Gaussian hump, and short upright
// arrows from the outline at rest to the shifted lower edge show u where it is large enough to carry an arrow. One
// slice, between x and x + dx on the hump's rising side, is shaded; the stress T_xy = mu du/dx is positive at both of
// its faces there, so the material beyond its right face pulls it up, T_xy(x + dx) A, drawn upward from that face's
// upper end, and the material before its left face pulls it down, -T_xy(x) A, drawn downward from that face's lower
// end; beside them, from the slice's middle, the net force (d_x T_xy) dx A, which points up because the slice lies on
// the hump's foot, where the slope still grows (u'' > 0). Forces in the colour of matter.
// Exact: the hump, its slices and the shifted outline (every slice line moved by u at its own x, asserted); the signs
// of the two pulls and of the net force (asserted from u' and u''); the lengths of the three force arrows, in the
// ratio T_xy(x + dx) : T_xy(x) : their difference (asserted on the page). Schematic: the size of the hump, which is
// exaggerated, the slice's width dx, the block's height and the force arrows' common scale.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { Plot, LABEL_GAP } from './tut-prob-lib.js';
import { AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { UNDISTURBED_W, PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { MATTER, DASH } from './tut-wave-lib.js';
import { INK, DIM } from '../lib.js';

const name = 'tut-wave-slab';
const check = checker(name);

// ---- the block, in points on the page --------------------------------------------------------------------------
const W = 288, H = 38;                    // the block at rest: its length and height
const N = 18;                             // slices: N intervals, so N + 1 lines including the ends
const STEP = W / N;                       // the slices' spacing, which is also the shaded slice's width dx
const U = 17;                             // the hump's height
const SIGMA = 34;                         // its width (standard deviation)
const XC = 0.616 * W;                      // its centre, from the block's left end
const SHADED = 7;                         // the shaded slice is the interval [SHADED, SHADED + 1] of the slices
const FORCE = 56;                         // points per unit of U/SIGMA of the slope: the force arrows' common scale
const MIN_U = 4.5;
const REST_GAP = 1.1;                     // the line at rest is drawn only where the lower edge is this far above it                        // a displacement arrow is drawn only if at least this long
const CLEAR = 1.4;                        // a force arrow starts this far beyond its face's end
const GNOMON = 16;                        // the axes' length

/** The hump and its first two derivatives, x in points from the block's left end. */
const u = (x) => U * Math.exp(-((x - XC) ** 2) / (2 * SIGMA ** 2));
const du = (x) => (-(x - XC) / SIGMA ** 2) * u(x);
const ddu = (x) => (((x - XC) ** 2 / SIGMA ** 2 - 1) / SIGMA ** 2) * u(x);

export default async function () {
	const S = new Sheet(name);
	const L = [];
	const X0 = ORIGIN - W / 2, YT = ORIGIN - H / 2, YB = ORIGIN + H / 2;
	const X = (x) => X0 + x;
	// the page's y of a point of the block at rest at height y0 (page), shifted up by u
	const lift = (x, y0) => y0 - u(x);
	// a plot whose y is the displacement, for the sampling of the edges: one for the top edge, one for the bottom
	const top = new Plot({ left: X0, top: YT - U, w: W, h: U, x0: 0, x1: W, y0: 0, y1: U });
	const bottom = new Plot({ left: X0, top: YB - U, w: W, h: U, x0: 0, x1: W, y0: 0, y1: U });

	// ---- the lower edge at rest, dashed, only where the shifted edge has left it (elsewhere the two would coincide)
	{
		let a = null;
		for (let x = 0; x <= W; x += 0.05) {
			const on = u(x) >= REST_GAP;
			if (on && a === null) a = x;
			if ((!on || x + 0.05 > W) && a !== null) {
				S.path([[X(a), YB], [X(x), YB]], { color: DIM, width: UNDISTURBED_W, dash: DASH, layer: 0.5, cap: 'butt', what: 'the line at rest' });
				a = null;
			}
		}
	}

	// ---- the shaded slice, under everything
	const xa = SHADED * STEP, xb = (SHADED + 1) * STEP;
	const sliceTop = graph(top, u, xa, xb), sliceBottom = graph(bottom, u, xa, xb);
	const tint = [...sliceTop, ...[...sliceBottom].reverse()];
	S.raw(`<path d="M${tint.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${TINT}"/>`, 0.2);

	// ---- the block shifted: its edges, and the slice lines (the two ends among them)
	const upper = graph(top, u, 0, W), lower = graph(bottom, u, 0, W);
	check(longest(upper) <= 0.2501 && longest(lower) <= 0.2501, 'an edge is sampled too coarsely');
	for (const [x, y] of upper) check(near(y, lift(x - X0, YT), 1e-9), 'the upper edge is not the rest edge shifted by u');
	S.path(upper, { color: INK, width: CURVE, layer: 2, what: 'the upper edge' });
	S.path(lower, { color: INK, width: CURVE, layer: 2, what: 'the lower edge' });
	for (let i = 0; i <= N; i++) {
		const x = i * STEP, end = i === 0 || i === N;
		S.path([[X(x), lift(x, YT)], [X(x), lift(x, YB)]], { color: INK, width: end ? CURVE : AXIS * 0.8, layer: 1.5, cap: 'butt', what: `the slice line ${i}` });
	}

	// ---- u: an upright arrow from the outline at rest to the shifted lower edge, where it is long enough
	let shown = 0;
	for (let i = 1; i < N; i++) {
		const x = i * STEP;
		if (u(x) < MIN_U) continue;
		const a = S.arrow([X(x), YB], [X(x), lift(x, YB)], { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2.5, what: `u at the slice line ${i}` });
		check(near(a.L, u(x), 1e-9), 'a displacement arrow is not u long');
		shown++;
	}
	check(shown >= 5, 'too few displacement arrows');

	// ---- the forces on the shaded slice: T_xy = mu u', so the pulls go as u' at the two faces
	check(du(xa) > 0 && du(xb) > 0, 'the stress is not positive at both faces of the shaded slice');
	for (let x = xa; x <= xb; x += 0.05) check(ddu(x) > 0, `u'' is not positive across the shaded slice at ${x}`);
	const right = FORCE * du(xb) * SIGMA / U, left = FORCE * du(xa) * SIGMA / U, net = right - left;
	check(net > 0, 'the net force does not point up');
	// the right face's pull, up from its upper end; the left face's, down from its lower end; the net, up from the middle
	const fr = S.arrow([X(xb), lift(xb, YT) - CLEAR], [X(xb), lift(xb, YT) - CLEAR - right], { color: MATTER, width: VEC, head: VEC_HEAD, layer: 3, what: 'the pull on the right face' });
	const fl = S.arrow([X(xa), lift(xa, YB) + CLEAR], [X(xa), lift(xa, YB) + CLEAR + left], { color: MATTER, width: VEC, head: VEC_HEAD, layer: 3, what: 'the pull on the left face' });
	const xm = (xa + xb) / 2;
	const fn = S.arrow([X(xm), lift(xm, YT) - CLEAR], [X(xm), lift(xm, YT) - CLEAR - net], { color: MATTER, width: VEC, head: VEC_HEAD, layer: 3, what: 'the net force' });
	check(near(fr.L - fl.L, fn.L, 1e-9), 'the net arrow is not the difference of the pulls');

	// ---- the labels of the forces
	const T = `{\\color{${MATTER}}T_{xy}}`;
	L.push(await S.clear(`${T}(x + \\mathrm{d}x)\\,A`, fr.B[0] + LABEL_GAP, fr.B[1] + 1, 0, 0, [0, -1], { color: INK }));
	L.push(await S.clear(`-${T}(x)\\,A`, fl.B[0] - LABEL_GAP, fl.B[1] - 1, 1, 1, [-1, 0], { color: INK }));
	L.push(await S.clear(`(\\partial_x${T})\\,\\mathrm{d}x\\,A`, fn.B[0] - LABEL_GAP, (fn.A[1] + fn.B[1]) / 2, 1, 0.5, [-1, 0], { color: INK }));

	// ---- the axes: x to the right, y up, at the block's lower left
	const o = [X0 + 3, YB + 13 + GNOMON];
	S.arrow(o, [o[0] + GNOMON, o[1]], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis x' });
	S.arrow(o, [o[0], o[1] - GNOMON], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the axis y' });
	L.push(await placed('x', o[0] + GNOMON + LABEL_GAP, o[1], 0, 0.5, DIM));
	L.push(await placed('y', o[0], o[1] - GNOMON - LABEL_GAP, 0.5, 1, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { right, left, net, ratio: right / left, uSlice: [u(xa), u(xb)] };
	return finish(S, L, [240, 340]);
}
