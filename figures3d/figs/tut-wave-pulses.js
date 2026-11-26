// The tutorial, section 5.1 (tutorial/waves/wave-equation.md), its second diagram: two equal and opposite pulses pass
// through each other. Five copies of the line, stacked from the top at the instants t = -2, -1, 0, 1, 2 in units of
// w/c, w the pulses' width, over one shared x axis. A Gaussian hump u_R(x - ct) = A e^{-(x - ct)^2 / 2w^2} starts at
// the left and moves right (orange, dashed), and the equal dip -u_R(x + ct) starts at the right and moves left (blue,
// dashed); their sum, the line itself, is drawn bold. Each dashed pulse is drawn only where both pulses are large
// enough to be seen apart: where the other is small the sum is that pulse, and a dashed copy would lie on it; where
// the pulse itself is small, it would run along the line's level at rest as a second line. At t = 0 the sum
// is flat, and short upright arrows show its velocity, -2c u_R'(x): up on the right half, ahead of the hump, and down
// on the left half. At t = 1 and 2 the hump is on the right and the dip on the left, unchanged. Each row's level at
// rest is dotted where the line has left it.
// Exact: every curve (sampled every quarter of a point), the flat line at t = 0 (asserted to vanish), the velocity's
// sign and its relative sizes at the arrows (asserted against the time derivative of the sum), the shapes after the
// meeting (asserted to be those before it, moved). Schematic: the arrows' common scale.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

const name = 'tut-wave-pulses';
const check = checker(name);

// ---- the mathematics: x in units of w, t in units of w/c, u in units of A ---------------------------------------
export const TIMES = [-2, -1, 0, 1, 2];
const uR = (s) => Math.exp(-(s * s) / 2);
const duR = (s) => -s * uR(s);
const hump = (x, t) => uR(x - t);
const dip = (x, t) => -uR(x + t);
const sum = (x, t) => hump(x, t) + dip(x, t);
const XMAX = 4.6;                         // the line runs from -XMAX to XMAX

function mathematics() {
	for (let x = -XMAX; x <= XMAX; x += 0.01) {
		// flat at the meeting, and moving with the velocity -2c u_R'(x), up where x > 0
		check(Math.abs(sum(x, 0)) < 1e-15, `the line is not flat at t = 0, x = ${x}`);
		const h = 1e-5, v = (sum(x, h) - sum(x, -h)) / (2 * h);
		check(near(v, -2 * duR(x), 1e-8), `the velocity at x = ${x} is not -2c u_R'`);
		if (Math.abs(x) > 1e-9) check(Math.sign(v) === Math.sign(x), `the velocity at x = ${x} has the wrong sign`);
		// after the meeting the shapes are those before it, moved: the hump at +t is the hump at -t moved by 2t
		for (const t of [1, 2]) check(near(hump(x, t), hump(x - 2 * t, -t), 1e-15) && near(dip(x, t), dip(x + 2 * t, -t), 1e-15), 'a pulse changed its shape');
		// and the line at t is the line at -t turned over: the hump on the right and the dip on the left
		for (const t of [1, 2]) check(near(sum(x, t), -sum(-x, t), 1e-15) && near(sum(x, t), -sum(x, -t), 1e-15), 'the line after the meeting');
	}
	// at t = +-2 the pulses are apart: the other pulse is below 1e-3 of A at each one's peak
	check(uR(4) < 1e-3, 'the pulses at t = 2 still overlap');
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const UNIT = 31;                          // points per w
const AMP = 25;                           // A, points
const BOLD = 0.95;                        // the sum
const THIN = 0.5;                         // the two pulses, dashed
const PULSE_DASH = [2.2, 1.4];
const PART = (BOLD + THIN) / 2 + 0.7;     // a dashed pulse is drawn only where it and the other are this far from zero
const ARROWS = [0.3, 0.6, 0.9, 1.2, 1.5];      // the velocity arrows at x = +-these
const SPEED = 12.5;                       // points per unit of x e^{-x^2/2} (the velocity in units of 2cA/w)
const ROW_GAP = 4;                        // the least air between neighbouring rows' ink
const INSIDE = 1.4;                       // an arrow ends at least this far inside its dashed pulse

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const L = [];
	const W = 2 * XMAX * UNIT;
	const left = ORIGIN - W / 2;
	const rowPlot = (y0) => new Plot({ left, top: y0 - AMP, w: W, h: 2 * AMP, x0: -XMAX, x1: XMAX, y0: -1, y1: 1 });

	// the parts of a pulse to draw at the time t: where it and the other pulse are both at least PART from zero
	const parts = (f, g, t) => {
		const out = [];
		let a = null;
		const step = 0.002;
		for (let x = -XMAX; x <= XMAX + 1e-9; x += step) {
			const on = Math.abs(g(x, t)) * AMP >= PART && Math.abs(f(x, t)) * AMP >= PART;
			if (on && a === null) a = x;
			if ((!on || x + step > XMAX) && a !== null) { out.push([a, x]); a = null; }
		}
		return out;
	};

	// ---- the rows' heights: each row as close under the last as ROW_GAP allows, from the extents of what it draws
	const reach = (t) => {
		// for each x on a grid, how far the row's ink rises above and falls below its line, in points
		const n = 2000, up = [], down = [];
		for (let i = 0; i <= n; i++) {
			const x = -XMAX + (2 * XMAX * i) / n;
			let hi = Math.max(0, sum(x, t)), lo = Math.min(0, sum(x, t));
			for (const [f, g] of [[hump, dip], [dip, hump]]) if (Math.abs(g(x, t)) * AMP >= PART && Math.abs(f(x, t)) * AMP >= PART) { hi = Math.max(hi, f(x, t)); lo = Math.min(lo, f(x, t)); }
			up.push(hi * AMP + BOLD / 2); down.push(-lo * AMP + BOLD / 2);
		}
		return { up, down };
	};
	const R = TIMES.map(reach);
	const ys = [ORIGIN - 2 * AMP * 2];
	for (let r = 1; r < TIMES.length; r++) {
		let need = 0;
		for (let i = 0; i < R[r].up.length; i++) need = Math.max(need, R[r - 1].down[i] + R[r].up[i]);
		ys.push(ys[r - 1] + need + ROW_GAP);
	}

	// ---- the rows
	for (const [r, t] of TIMES.entries()) {
		const P = rowPlot(ys[r]);
		const line = graph(P, (x) => sum(x, t), -XMAX, XMAX);
		check(longest(line) <= 0.2501, `the line at t = ${t} has a step of ${longest(line)} pt`);
		S.path(line, { color: INK, width: BOLD, layer: 2, what: `the line at t = ${t}` });
		// the line's level at rest, dotted, between the first and the last place where the line has left it (beyond them
		// the two would coincide)
		const off = [];
		for (let x = -XMAX; x <= XMAX; x += 0.002) if (Math.abs(sum(x, t)) * AMP >= PART) off.push(x);
		if (off.length) S.path([P.at(off[0], 0), P.at(off[off.length - 1], 0)], { color: DIM, width: ZERO_LINE, dash: ZERO_DASH, cap: 'butt', layer: 1, what: `the level at rest at t = ${t}` });
		check(t !== 0 || off.length === 0, 'the line at t = 0 has left its level');
		for (const [f, g, color, what] of [[hump, dip, ACCENT, 'the hump'], [dip, hump, ACCENT2, 'the dip']]) {
			for (const [a, b] of parts(f, g, t)) {
				const pts = graph(P, (x) => f(x, t), a, b);
				check(longest(pts) <= 0.2501, `${what} at t = ${t} is sampled too coarsely`);
				S.path(pts, { color, width: THIN, dash: PULSE_DASH, cap: 'butt', layer: 1.5, what: `${what} at t = ${t}` });
			}
		}
		// the instant, to the left of the line
		L.push(await placed(t < 0 ? `-${-t}` : `${t}`, left - LABEL_GAP - 1, ys[r], 1, 0.5, DIM));

		// ---- at the meeting, the velocity
		if (t === 0) {
			for (const x of ARROWS.flatMap((a) => [-a, a])) {
				const v = -2 * duR(x);                          // in units of cA/w
				const len = (SPEED / 2) * v;                    // points, signed: up for v > 0
				const pulse = (v > 0 ? hump(x, 0) : -dip(x, 0)) * AMP;
				check(Math.abs(len) <= pulse - INSIDE - BOLD / 2, `the arrow at x = ${x} reaches its pulse`);
				const a = S.arrow(P.at(x, 0), [P.X(x), P.Y(0) - len], { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2.5, what: `the velocity at x = ${x}` });
				check(near(a.L, (SPEED / 2) * Math.abs(v), 1e-9) && Math.sign(P.Y(0) - a.B[1]) === Math.sign(x), `the arrow at x = ${x}`);
			}
		}
	}
	L.push(await placed('ct/w', left - LABEL_GAP - 1, ys[0] - AMP - 2, 1, 1, DIM));

	// ---- the shared x axis, under the last row
	const lowest = ys[ys.length - 1] + Math.max(...R[R.length - 1].down) + ROW_GAP + 1;
	const A = new Plot({ left, top: lowest - 1, w: W, h: 1, x0: -XMAX, x1: XMAX, y0: 0, y1: 1 });
	const xl = await xAxis(S, A, { ticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], fmt: (v) => (v % 2 ? null : v < 0 ? `-${-v}` : `${v}`), what: 'the x axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('x/w', last.box.r + 8, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { rows: ys, part: PART };
	return finish(S, L, [240, 340]);
}
