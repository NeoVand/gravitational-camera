// The tutorial, chapter 1.7 (tutorial/newton/hamilton.md), its second diagram: an impulsive tide in phase space.
// The plane (x, p_x) of three parts of a body, of equal mass m, at x = -0.5, 0.1 and 0.6 (arbitrary units). Each
// part's state before the kick is an open circle; the tide g = x^2/2, whose gradient is g'(x) = x, gives each part
// the impulse eps m g'(x) = eps m x along x, so that its state jumps straight up or down by that much, to the filled
// dot: down by 0.5 for the part at -0.5, up by 0.1 at 0.1 and up by 0.6 at 0.6, with eps m = 1. No state moves
// sideways: the dotted lines drop from each part's states to its place on the x axis, which the kick leaves unchanged.
// The jumps are orange, the colour of a stretch in the paper's figures: every kick points away from x = 0.
// Exact: each jump, centre to centre, is eps m x on the one scale of p_x (asserted), and vertical (asserted); the
// places on the x axis. Chosen for the drawing: the momenta before the kick, the value eps m = 1, and the two scales.
import { INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, AXIS_HEAD, HAIR, TICK, DOT, DOT_STEP, n2 } from './tut-pot-lib.js';

const name = 'tut-ham-kick';
const check = checker(name);

// ---- the physics (arbitrary units) ----------------------------------------------------------------------------
export const X = [-0.5, 0.1, 0.6];             // the parts' places
export const P0 = [-0.15, 0.25, 0.15];         // their momenta before the kick (chosen)
export const EPS_M = 1;                         // eps m, the same for every part
export const gradG = (x) => x;                  // g = x^2/2
export const kick = (x) => EPS_M * gradG(x);    // the jump in p_x
export const P1 = X.map((x, i) => P0[i] + kick(x));

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const SX = 165;                                 // points per unit of x
const SP = 118;                                 // points per unit of p_x: the one scale of every jump
const X_AXIS = [-0.7, 0.82], P_AXIS = [-0.76, 0.87];
const BEFORE = 1.7, BEFORE_W = 0.5;            // the open circle: radius, stroke
const AFTER = 1.3;                              // the filled dot
const JUMP = 0.75, JUMP_HEAD = 4.4;            // the jumps: stroke, head (or two fifths of the arrow)
const TAIL = 0.9, TIP = 0.7;                   // air between an arrow and its two dots
const GAP = 2.2;

export default async function () {
	check(near(kick(-0.5), -0.5, 1e-15) && near(kick(0.1), 0.1, 1e-15) && near(kick(0.6), 0.6, 1e-15), 'the jumps are not eps m x');
	check(kick(X[0]) < 0 && kick(X[1]) > 0 && kick(X[2]) > kick(X[1]), 'the jumps are not down, a little up and more up');
	// no jump crosses the x axis, so that every arrow stands clear of it
	X.forEach((x, i) => check(Math.sign(P0[i]) === Math.sign(P1[i]), `the jump of the part at ${x} crosses the x axis`));

	const S = new Sheet(name);
	const X0 = ORIGIN, Y0 = ORIGIN;
	const at = (x, p) => [X0 + SX * x, Y0 - SP * p];
	const labels = [];

	// ---- the axes
	S.arrow(at(X_AXIS[0], 0), at(X_AXIS[1], 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the x axis' });
	S.arrow(at(0, P_AXIS[0]), at(0, P_AXIS[1]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the p axis' });
	const xTip = at(X_AXIS[1], 0), pTip = at(0, P_AXIS[1]);
	labels.push(await placed('x', xTip[0] + GAP, xTip[1], 0, 0.5, DIM));
	labels.push(await placed('p_x', pTip[0], pTip[1] - GAP, 0.5, 1, DIM));

	// ---- each part: its place on the axis, its two states, the jump between them
	for (const [i, x] of X.entries()) {
		const a = at(x, P0[i]), b = at(x, P1[i]), o = at(x, 0);
		check(near(a[0], b[0], 1e-12), `the part at ${x} moves sideways`);
		check(near(a[1] - b[1], SP * kick(x), 1e-9), `the jump of the part at ${x} is not eps m x on the scale of p_x`);
		const up = Math.sign(P1[i] - P0[i]), side = Math.sign(P0[i]);      // the jump's sense; the states' side of the axis
		// the tick on the axis, on the side away from the states, and its value beyond it
		S.path([o, [o[0], o[1] + side * TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${x}` });
		labels.push(await placed(`${x < 0 ? '-' : ''}${Math.abs(x)}`, o[0], o[1] + side * (TICK + GAP + 0.4), 0.5, side > 0 ? 0 : 1, DIM));
		// the dotted line from the axis to the nearer state (the one before the kick, for these momenta)
		check(Math.abs(P0[i]) < Math.abs(P1[i]), `the state before the kick of the part at ${x} is not the nearer to the axis`);
		const near0 = a;
		{
			const L = Math.abs(near0[1] - o[1]) - (AXIS / 2 + 1.4) - (BEFORE + BEFORE_W / 2 + 1.4);
			const n = Math.max(1, Math.round(L / DOT_STEP)), step = L / n, dir = -side;
			const y0 = o[1] + dir * (AXIS / 2 + 1.4);
			const dots = Array.from({ length: n + 1 }, (_, k) => [o[0], y0 + dir * k * step]);
			S.raw(`<path d="${dots.map(([u, v]) => `M${n2(u)},${n2(v)}h0`).join('')}" stroke="${FAINT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 0.5);
			S.mark([dots[0], dots[n]], DOT / 2, `the dotted line at ${x}`);
		}
		// the state before: an open circle; after: a filled dot
		S.raw(`<circle cx="${n2(a[0])}" cy="${n2(a[1])}" r="${BEFORE}" fill="none" stroke="${INK}" stroke-width="${BEFORE_W}"/>`, 3);
		S.mark([a], BEFORE + BEFORE_W / 2, `the state before, at ${x}`);
		S.raw(`<circle cx="${n2(b[0])}" cy="${n2(b[1])}" r="${AFTER}" fill="${INK}"/>`, 3);
		S.mark([b], AFTER, `the state after, at ${x}`);
		// the jump, from the open circle to the dot
		const from = [a[0], a[1] - up * (BEFORE + BEFORE_W / 2 + TAIL)], to = [b[0], b[1] + up * (AFTER + TIP)];
		const j = S.arrow(from, to, { color: ACCENT, width: JUMP, head: JUMP_HEAD, layer: 2, what: `the jump at ${x}` });
		check(near(j.u[0], 0, 1e-12) && near(j.u[1], -up, 1e-12), `the jump at ${x} is not vertical`);
		if (i === 2) labels.push(await S.clear('\\epsilon m x', to[0] + GAP + 0.6, (from[1] + to[1]) / 2, 0, 0.5, [1, 0], { color: ACCENT }));
	}

	// the tide's name, in the empty quarter above the part that is kicked down
	labels.push(await placed('g = \\tfrac12 x^2', ...at(-0.36, 0.5), 0.5, 0.5, DIM));

	S.checkAll(labels);
	window.tutHamKick = { jumps: X.map(kick), before: P0, after: P1 };
	return finish(S, labels, [240, 340]);
}
