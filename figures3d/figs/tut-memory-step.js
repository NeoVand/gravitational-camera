// The tutorial, chapter 7.8 (tutorial/geometry/wave-energy.md), its third diagram: the memory as the camera reads it.
// Two panels sharing a time axis. Above, the strain h+ at the camera against time, a thin line in the field's colour:
// flat at zero, then a burst of a few cycles whose mean rises, ending flat at a new level, larger by Delta h+; a bracket
// between the two levels at the right, "Delta h+, the memory", and a faint dashed line continuing zero to the right.
// Below, the tide E+ = -(1/2) h+-double-dot in the curvature's colour, a burst that starts and ends at zero, on a time
// axis with t_1 marked before it and t_2 after it. Under the axis, two free balls before the burst, xi apart, and the
// same two after it, the second moved away by (1/2) Delta h+ xi from its old place (dashed). No orange or blue.
// Departures from the diagram's comment: the bracket's name, "Delta h+, the memory", names the plus strain, as the
// upper line does, and the balls' change is "(1/2) Delta h+ xi", for balls along e_1 (chapter 7.6's
// delta xi_i = (1/2) h_ij xi_j with h_11 = h+); the balls stand under the time axis, the pair "before" under the times
// before t_1 and the pair "after" under those after t_2.
// Exact: the tide is -(1/2) times the second derivative of the drawn strain (computed in closed form and asserted
// against finite differences); its integral from t_1 to t_2 is zero and its double integral -(1/2) Delta h+, both
// asserted on the drawn curve by quadrature; the strain is exactly constant before and after the burst. The rising mean
// is the energy radiated so far, as the nonlinear memory's is: the step follows the running integral of the burst's
// squared envelope. Schematic: the burst's shape and length, the two panels' vertical scales, the balls' size and the
// exaggerated step (1/2) Delta h+ xi (a real one, the supernova's, moves balls 4 km apart by 8 x 10^-18 m).
// Pictorial: the balls, the stone of chapter 7.7's rotor (sprites/hair/ball-face.png, embedded once), clipped to their
// exact circles.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, AXIS_HEAD, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { circle as circlePath } from '../stone.js';
import { ballFace, stoneDefs, stone as stoneOf, rim } from './tut-null-lib.js';
import { chapter, palette, FIELD, CURV } from './tut-memory-lib.js';

const name = 'tut-memory-step';
const check = checker(name);

// ---- the mathematics: t in arbitrary units, h+ in units of the step --------------------------------------------
const T0 = 0, T1 = 10;                     // the drawn time
const TC = 5, HALF = 2.4;                  // the burst: its middle and half its length (it lasts from 2.6 to 7.4)
const OMEGA = 2 * Math.PI * 1.05;          // its angular frequency: five cycles
const OSC = 0.62;                          // its oscillation's amplitude, units of the step
const STEP = 1;                            // Delta h+
const TA = 2, TB = 8;                      // t_1 and t_2
/** The burst's envelope, a smooth bump exactly zero outside |t - TC| < HALF, and its first two derivatives in t. */
function bump(t) {
	const u = (t - TC) / HALF;
	if (Math.abs(u) >= 1) return [0, 0, 0];
	const s = 1 - u * u, W = Math.exp(1 - 1 / s);
	const g1 = (-2 * u) / (s * s), g2 = -2 / (s * s) - (8 * u * u) / s ** 3;
	return [W, (W * g1) / HALF, (W * (g1 * g1 + g2)) / (HALF * HALF)];
}
/** Simpson's rule for f on [a, b] with n (even) intervals. */
function simpson(f, a, b, n = 2000) {
	if (b <= a) return 0;
	const h = (b - a) / n;
	let s = f(a) + f(b);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
}
const sq = (t) => bump(t)[0] ** 2;
const Z = simpson(sq, TC - HALF, TC + HALF, 4000);
/** The step's share at t: the energy radiated so far, the running integral of the squared envelope. */
const share = (t) => (t <= TC - HALF ? 0 : t >= TC + HALF ? 1 : simpson(sq, TC - HALF, t, 1000) / Z);
const phase = (t) => OMEGA * (t - TC);
const strain = (t) => STEP * share(t) + OSC * bump(t)[0] * Math.sin(phase(t));
const rate = (t) => { const [W, W1] = bump(t); return (STEP * W * W) / Z + OSC * (W1 * Math.sin(phase(t)) + OMEGA * W * Math.cos(phase(t))); };
const accel = (t) => {
	const [W, W1, W2] = bump(t), p = phase(t);
	return (STEP * 2 * W * W1) / Z + OSC * (W2 * Math.sin(p) + 2 * OMEGA * W1 * Math.cos(p) - OMEGA * OMEGA * W * Math.sin(p));
};
/** The tide E+ = -(1/2) h+-double-dot. */
const tide = (t) => -0.5 * accel(t);

function mathematics() {
	const nums = chapter(check);
	// the closed forms against finite differences of the strain
	const d = 1e-3;
	for (const t of [3.1, 4.4, 5.02, 6.37, 7.2]) {
		check(Math.abs((strain(t + d) - strain(t - d)) / (2 * d) - rate(t)) < 1e-4, `h-dot at ${t}`);
		check(Math.abs((strain(t + d) - 2 * strain(t) + strain(t - d)) / (d * d) - accel(t)) < 2e-3, `h-double-dot at ${t}`);
	}
	// constant before and after; t_1 before the burst and t_2 after it
	check(TA < TC - HALF && TB > TC + HALF, 't_1 and t_2 do not enclose the burst');
	for (const t of [T0, 1, TA, TC - HALF]) check(strain(t) === 0 && rate(t) === 0 && tide(t) === 0, `the strain moves before the burst at ${t}`);
	for (const t of [TC + HALF, TB, 9, T1]) check(strain(t) === STEP && rate(t) === 0 && tide(t) === 0, `the strain moves after the burst at ${t}`);
	// the integrals of the tide from t_1 to t_2: zero once, -(1/2) Delta h+ twice
	const once = simpson(tide, TA, TB, 6000);
	const twice = simpson((t) => simpson(tide, TA, t, 600), TA, TB, 600);
	const size = simpson((t) => Math.abs(tide(t)), TA, TB, 6000);
	check(Math.abs(once) < 1e-9 * size, `the tide's integral is ${once}`);
	check(Math.abs(twice + 0.5 * STEP) < 1e-6, `the tide's double integral is ${twice}`);
	// the mean rises: the strain averaged over each cycle grows from 0 to Delta h+
	{
		const period = (2 * Math.PI) / OMEGA;
		let last = -1;
		for (let t = TC - HALF; t + period <= TC + HALF + period; t += period) {
			const mean = simpson(strain, t, t + period, 400) / period;
			check(mean >= last - 1e-12, `the mean falls at ${t}`);
			last = mean;
		}
		check(near(last, STEP, 0.01), 'the mean does not reach the new level');
	}
	return { nums, once, twice };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const UNIT = 27;                           // points per unit of time
const UP = { lo: -0.85, hi: 1.75, amp: 30 };   // the strain's panel: its range and points per unit of h+
const LOW = 30;                            // the tide's panel: points from its axis to its largest
const PANEL_GAP = 16;                      // between the strain's lowest and the tide's highest
const BRACKET = { at: 8.25, hook: 2.2, width: 0.6 };
const BALL = 4.2, XI = 30, DRAWN_STEP = 7;   // the balls: radius, separation and the drawn (1/2) Delta h+ xi
const BALLS_DOWN = 27;                     // the time axis to the balls' centres
const DIM_LINE = 0.45, DIM_END = 1.8;      // the balls' dimension lines

export default async function () {
	const { nums } = mathematics();
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (T1 - T0) * UNIT;
	const left = ORIGIN - PW / 2;
	const U = new Plot({ left, top: ORIGIN - 120, w: PW, h: (UP.hi - UP.lo) * UP.amp, x0: T0, x1: T1, y0: UP.lo, y1: UP.hi });

	// ---- the strain, its dashed zero continued, and the bracket
	const hPts = graph(U, strain, T0, T1);
	check(longest(hPts) <= 0.2501, `the strain has a step of ${longest(hPts)} pt`);
	S.path(hPts, { color: FIELD, width: CURVE, layer: 2, what: 'the strain' });
	S.path([U.at(TC + HALF, 0), U.at(T1, 0)], { color: FAINT, width: ZERO_LINE + 0.15, dash: [1.8, 1.4], cap: 'butt', layer: 1, what: 'zero continued' });
	{
		const x = U.X(BRACKET.at), y0 = U.Y(0), y1 = U.Y(STEP);
		const pts = [[x - BRACKET.hook, y0 - ZERO_LINE / 2 - 0.9], [x, y0 - ZERO_LINE / 2 - 0.9], [x, y1 + CURVE / 2 + 0.9], [x - BRACKET.hook, y1 + CURVE / 2 + 0.9]];
		S.path(pts, { color: INK, width: BRACKET.width, cap: 'butt', layer: 3, what: 'the bracket' });
		check(near(U.Y(0) - U.Y(STEP), STEP * UP.amp, 1e-9), 'the bracket is not the step');
		L.push(await placed(`\\Delta{\\color{${FIELD}}h_+}\\text{, the memory}`, x + BRACKET.width / 2 + LABEL_GAP + 0.6, (y0 + y1) / 2, 0, 0.5, INK));
	}
	L.push(await S.clear(`{\\color{${FIELD}}h_+}`, U.X(0.35), U.Y(0) - CURVE / 2 - LABEL_GAP - 0.4, 0, 1, [0, -1]));

	// ---- the tide: below, on its own axis
	const top = Math.max(...hPts.map((p) => p[1])) + PANEL_GAP;
	let big = 0;
	for (let t = TC - HALF; t <= TC + HALF; t += 1e-4) big = Math.max(big, Math.abs(tide(t)));
	const D = new Plot({ left, top, w: PW, h: 2 * LOW, x0: T0, x1: T1, y0: -big, y1: big });
	const axisY = D.Y(0);
	S.arrow([D.X(T0), axisY], [D.X(T1) + 6, axisY], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the time axis' });
	const ePts = graph(D, tide, TC - HALF, TC + HALF);
	check(longest(ePts) <= 0.2501, `the tide has a step of ${longest(ePts)} pt`);
	S.path(ePts, { color: CURV, width: CURVE, layer: 2, what: 'the tide' });
	check(near(ePts[0][1], axisY, 1e-9) && near(ePts[ePts.length - 1][1], axisY, 1e-9), 'the tide does not start and end on its axis');
	for (const [t, src] of [[TA, 't_1'], [TB, 't_2']]) {
		S.path([[D.X(t), axisY], [D.X(t), axisY + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick ${src}` });
		L.push(await placed(src, D.X(t), axisY + TICK + LABEL_GAP + 0.3, 0.5, 0, DIM));
	}
	L.push(await placed('t', D.X(T1) + 6 + LABEL_GAP, axisY, 0, 0.5, DIM));
	L.push(await S.clear(`{\\color{${CURV}}\\mathcal E_+} = -\\tfrac12\\ddot{\\color{${FIELD}}h}_+`, D.X(0.35), axisY - AXIS / 2 - LABEL_GAP - 0.4, 0, 1, [0, -1]));

	// ---- the balls: before, under the times before t_1; after, under those after t_2
	const art = await ballFace();
	S.raw(stoneDefs(`${name}-face`, art, BALL), 0);
	const by = axisY + BALLS_DOWN;
	const stone = (c, id) => {
		S.raw(stoneOf(`${name}-${id}`, `${name}-face`, c[0], c[1], BALL) + rim(c[0], c[1], BALL), 3);
		S.mark([c], BALL, id);
	};
	const before = [D.X(0.3) + BALL, by], after = [D.X(TB + 0.2) + BALL, by];
	stone(before, 'ball-1'); stone([before[0] + XI, by], 'ball-2');
	stone(after, 'ball-3'); stone([after[0] + XI + DRAWN_STEP, by], 'ball-4');
	check(after[0] + XI + DRAWN_STEP + BALL <= D.X(T1) + 6 && before[0] + XI + BALL < D.X(TA), 'the balls stand outside their times');
	// the old place, dashed
	{
		const c = [after[0] + XI, by];
		S.raw(`<path d="${circlePath(c[0], c[1], BALL)}" fill="none" stroke="${DIM}" stroke-width="0.4" stroke-dasharray="1.1 0.9"/>`, 2);
		S.mark([c], BALL + 0.2, 'the old place');
	}
	// xi under the pair before; (1/2) Delta h+ xi over the pair after, from the old centre to the new
	const dimension = (xa, xb, y, what) => {
		S.path([[xa, y], [xb, y]], { color: DIM, width: DIM_LINE, cap: 'butt', layer: 3, what });
		for (const x of [xa, xb]) S.path([[x, y - DIM_END], [x, y + DIM_END]], { color: DIM, width: DIM_LINE, cap: 'butt', layer: 3, what: `${what}'s end` });
	};
	const yBelow = by + BALL + 3.2;
	dimension(before[0], before[0] + XI, yBelow, 'xi');
	L.push(await placed('\\xi', before[0] + XI / 2, yBelow + DIM_END + DIM_LINE / 2 + LABEL_GAP + 0.2, 0.5, 0, INK));
	dimension(after[0], after[0] + XI, yBelow, 'xi after');
	L.push(await placed('\\xi', after[0] + XI / 2, yBelow + DIM_END + DIM_LINE / 2 + LABEL_GAP + 0.2, 0.5, 0, INK));
	const yAbove = by - BALL - 3.2;
	dimension(after[0] + XI, after[0] + XI + DRAWN_STEP, yAbove, 'the step');
	L.push(await placed(`\\tfrac12\\Delta{\\color{${FIELD}}h_+}\\,\\xi`, after[0] + XI + DRAWN_STEP / 2, yAbove - DIM_END - DIM_LINE / 2 - LABEL_GAP - 0.2, 0.5, 1, INK));
	L.push(await placed('\\text{before}', before[0] + XI / 2, yBelow + DIM_END + DIM_LINE / 2 + LABEL_GAP + 0.2 + 11, 0.5, 0, DIM));
	L.push(await placed('\\text{after}', after[0] + XI / 2, yBelow + DIM_END + DIM_LINE / 2 + LABEL_GAP + 0.2 + 11, 0.5, 0, DIM));
	check(nums.moved.toExponential(0) === '8e-18', 'the supernova\'s step');

	S.checkAll(L);
	window[name + '-numbers'] = { step: STEP, bigTide: big };
	return finish(S, L, [240, 340]);
}
