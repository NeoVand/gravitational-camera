// The tutorial, section 8.2 (tutorial/quantum/operators.md), its third diagram: one integral in four places. A box in
// the centre holds int rho grad h . grad g dV (rho in matter's colour). Four thin ink arrows leave it for four boxes at
// the corners: the bracket {Q_h, Q-dot_g} (section 1.7), the commutator [Q_h, Q-dot_g] (section 8.2), the tremor
// <Q-dot_h Q-dot_g> (section 4.2) and the weight of the response to a tide (section 4.5). Beside each arrow its
// factor: "x 1", "x i hbar", "x k_B T" and "the sum rule". The moments Q in matter's colour, as the chapter sets them;
// everything else ink, the sources' names grey. No orange or blue.
// Departures from the diagram's comment: each corner box holds its name on one line and, in grey on the next, the
// topic it comes from, by name and not by number ("Hamilton's mechanics", "quantum mechanics", "equipartition",
// "response and causality"), since the book and the site number the sections differently; the fourth name, which has no formula, takes two lines ("the weight of the response" / "to a
// tide"). The four boxes share one size, fitted to the largest. Each factor stands level with the middle of its arrow,
// on the side toward the figure's edge.
// Exact: the four entries, each computed and asserted against the integral (tut-operators-lib.js, `ledger`): the
// bracket by finite differences on a body of twelve particles; the commutator on a grid for one particle, both orders
// of the symmetrized rate; the tremor from equipartition's covariance of the momenta; the sum rule's energy-weighted
// integral for bound, damped particles; and, for h = g = (x^2 - y^2)/2, the moment of inertia, 0.13 kg m^2 for
// section 1.7's ball. The layout is schematic.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, LABEL_GAP, SIZE } from './tut-pot-lib.js';
import { INK, DIM, tex } from '../lib.js';
import { chapter, palette, MATTER } from './tut-operators-lib.js';

const name = 'tut-one-integral-ledger';
const check = checker(name);

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PAD = 5, PITCH = 11;               // a box's padding; baseline to baseline within it
const CORNER_R = 2.5;                    // the boxes' rounded corners
const BOX_W = 0.5, CENTRE_W = 0.8;       // their strokes
const CENTRE_SIZE = 10.5;                // the integral's type
const ARROW = 0.55, HEAD = 3.6;
const ROW_GAP = 70;                      // the top row's bottom to the bottom row's top
const COL_GAP = 92;                      // between the two columns of corner boxes
const REACH = 26;                        // how far in from a corner box's inner edge its arrow arrives
const END_AIR = 1.6;                     // air between an arrow's ends and the boxes

const M = (s) => `{\\color{${MATTER}}${s}}`;
const Q = (sub, dot = false) => `${M(dot ? '\\dot Q' : 'Q')}_${sub}`;
const BOXES = [
	{ at: 'tl', lines: [`\\text{the bracket }\\{${Q('h')}, ${Q('g', true)}\\}`], from: "Hamilton's mechanics", factor: '\\times 1' },
	{ at: 'tr', lines: [`\\text{the commutator }[${Q('h')}, ${Q('g', true)}]`], from: 'quantum mechanics', factor: '\\times i\\hbar' },
	{ at: 'bl', lines: [`\\text{the tremor }\\langle${Q('h', true)}${Q('g', true)}\\rangle`], from: 'equipartition', factor: '\\times k_BT' },
	{ at: 'br', lines: ['\\text{the weight of the response}', '\\text{to a tide}'], from: 'response and causality', factor: '\\text{the sum rule}' }
];

/** A line of type centred on x with its baseline at y, as a label. */
async function lineAt(src, x, y, color) {
	const svg = await tex(src, [x, y], SIZE, 'cB', color);
	return { src, svg, box: boxOf(svg) };
}

/** A rounded rectangle, drawn and remembered as its outline. */
function box(S, l, t, r, b, { color = DIM, width = BOX_W, what }) {
	const k = CORNER_R;
	S.raw(`<rect x="${n2(l)}" y="${n2(t)}" width="${n2(r - l)}" height="${n2(b - t)}" rx="${k}" fill="none" stroke="${color}" stroke-width="${width}"/>`, 2);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], width / 2, what);
}

export default async function () {
	const { ledger, inertia } = await chapter(check);
	check(ledger.commutator < 1e-4 && Math.abs(ledger.bracket / ledger.integral - 1) < 1e-7, 'the ledger');
	check(inertia.toFixed(2) === '0.13', 'the moment of inertia');
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the corner boxes' contents, measured, and one size for all four
	const sets = [];
	for (const B of BOXES) {
		const rows = [...B.lines.map((src) => ({ src, color: INK })), { src: `\\text{${B.from}}`, color: DIM }];
		const trial = await Promise.all(rows.map((r, i) => lineAt(r.src, 0, i * PITCH, r.color)));
		const up = Math.min(...trial.map((p) => p.box.t)), dn = Math.max(...trial.map((p) => p.box.b));
		sets.push({ B, rows, up, h: dn - up, w: Math.max(...trial.map((p) => p.box.r - p.box.l)) });
	}
	const bw = Math.max(...sets.map((s) => s.w)) + 2 * PAD;
	const bh = Math.max(...sets.map((s) => s.h)) + 2 * PAD;
	const W = 2 * bw + COL_GAP, left = ORIGIN - W / 2, top = ORIGIN - (2 * bh + ROW_GAP) / 2;
	const frame = {
		tl: [left, top], tr: [left + bw + COL_GAP, top],
		bl: [left, top + bh + ROW_GAP], br: [left + bw + COL_GAP, top + bh + ROW_GAP]
	};

	// ---- the centre box
	const integral = await placed(`\\int${M('\\rho')}\\,\\nabla h\\cdot\\nabla g\\,\\mathrm dV`, ORIGIN, ORIGIN, 0.5, 0.5, INK, CENTRE_SIZE);
	const cb = { l: integral.box.l - PAD - 2, r: integral.box.r + PAD + 2, t: integral.box.t - PAD - 1, b: integral.box.b + PAD + 1 };
	box(S, cb.l, cb.t, cb.r, cb.b, { color: INK, width: CENTRE_W, what: 'the centre box' });
	L.push(integral);
	check(cb.l > left + bw + 4 && cb.r < left + bw + COL_GAP - 4, 'the centre box reaches under the corner boxes');

	for (const { B, rows, up, h } of sets) {
		const [l, t] = frame[B.at];
		const r = l + bw, b = t + bh;
		box(S, l, t, r, b, { what: `the box ${B.at}` });
		// the rows, each centred, on baselines PITCH apart, the block's ink centred in the box
		const y0 = (t + b) / 2 - h / 2 - up;
		for (const [i, row] of rows.entries()) L.push(await lineAt(row.src, (l + r) / 2, y0 + i * PITCH, row.color));
		// the arrow: from the centre box's corner to the corner box's inner edge, REACH in from its inner corner
		const right = B.at[1] === 'r', down = B.at[0] === 'b';
		const sx = right ? 1 : -1, sy = down ? 1 : -1;
		const from = [right ? cb.r : cb.l, down ? cb.b : cb.t];
		const to = [right ? l + REACH : r - REACH, down ? t : b];
		const d = [to[0] - from[0], to[1] - from[1]], n = Math.hypot(...d), u = [d[0] / n, d[1] / n];
		const A = [from[0] + u[0] * (END_AIR + CENTRE_W / 2), from[1] + u[1] * (END_AIR + CENTRE_W / 2)];
		const Z = [to[0] - u[0] * (END_AIR + BOX_W / 2) / Math.abs(u[1]), to[1] - u[1] * (END_AIR + BOX_W / 2) / Math.abs(u[1])];
		const a = S.arrow(A, Z, { color: INK, width: ARROW, head: HEAD, what: `the arrow to ${B.at}` });
		check(Math.sign(a.u[0]) === sx && Math.sign(a.u[1]) === sy, `the arrow to ${B.at} points the wrong way`);
		// the factor beside it, level with its middle, on the side toward the figure's edge, moved out until clear
		const mid = [(A[0] + Z[0]) / 2, (A[1] + Z[1]) / 2];
		L.push(await S.clear(B.factor, mid[0], mid[1], sx < 0 ? 1 : 0, 0.5, [sx, 0], { color: INK, gap: LABEL_GAP + 0.6 }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = ledger;
	return finish(S, L, [240, 340]);
}
