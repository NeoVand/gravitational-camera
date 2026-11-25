// The tutorial, chapter 10.2 (tutorial/glow/kirchhoff.md), its fourth diagram: heat capacities. Two panels side by
// side, sharing their tops and bottoms. Left: one mode's C_mode / k_B against k_B T / hbar omega from 0 to 3 (solid),
// rising from 0 towards the dotted line at 1, and Debye's C / 3 N k_B against T / Theta_D on the same axes (dashed),
// with two dots on it, "diamond, 293 K" at T / Theta_D = 0.133 (0.16) and "copper, 293 K" at 0.854 (0.93). Right, on
// its own axes: a black hole's heat capacity C = -M c^2 / T against its temperature from 0 to 3 K, with M = hbar c^3 /
// 8 pi G k_B T, so that C = -hbar c^5 / 8 pi G k_B T^2, drawn below zero, with one dot at 0.905 K, "the paper's hole,
// -1.35 x 10^40 J/K". Ink and the page's greys only: no orange or blue.
// Departures from the diagram's comment: the right panel's axis up is numbered, in units of 10^40 J/K, from -7 to 0,
// so that its curve and its dot are exact rather than schematic, and the caption no longer calls its scale schematic;
// its axis across stands at the panel's foot, level with the left panel's, and C = 0 is the panel's top edge, drawn
// as a hairline; a key under the left panel's plateau names its curves ("one mode", "Debye's solid"), since the two
// rise within a few points of each other; copper's dot is named "copper, 293 K" like diamond's, above the dotted line;
// each curve on the left is left out where it is within 1.5 pt of its axis. The two panels stay side by side on a phone, the figure being one drawing.
// Exact: C_mode (asserted against the derivative of the mode's energy), Debye's curve (Simpson's rule, with its hot
// and cold limits), the two dots and their values 0.16 and 0.93, the hole's curve and its dot (T_H and C asserted
// against the chapter's 1.356 x 10^23 kg, 0.905 K and -1.35 x 10^40 J/K in tut-balance-lib.js). Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, cMode, debye, holeC, hawking, HOLE } from './tut-balance-lib.js';

const name = 'tut-heat-capacity';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const H = 112;                                   // both panels' height
const LEFT = { w: 152, x1: 3, y1: 1.16 };        // across k_B T / hbar omega (or T / Theta_D); up C / k_B
const RIGHT = { w: 122, x1: 3, y0: -7 };         // across T in K; up C in 10^40 J/K
const BETWEEN = 44;                              // from the left panel's right edge to the right panel's axis
const CURVE = 0.7, DASH = [3, 2], W_DOT = 0.8, DOTS = [0, 1.7];
const DOT = 1.55;
const CLEAR = 1.5;                               // a curve is left out where it is nearer its axis than this
const NAME = 7;                                  // from the panels' top to the axes' names' baseline region
const KEY_LINE = 15, PITCH = 12.5;              // the key: its samples, baseline to baseline
const KEY_AT = [1.45, 0.5];                     // the key's first sample's left end and height, left panel units
const caption = 'Look first at the left panel\'s dots: at room temperature copper\'s modes are nearly all awake and diamond\'s mostly frozen. On the right, a black hole\'s heat capacity is negative at every temperature. Curves exact.';

export default async function () {
	const { state, dots, hole } = await chapter(check);
	await palette(check);
	state(name, 'heat-capacity', caption);

	const S = new Sheet(name);
	const L = [];
	const total = LEFT.w + BETWEEN + RIGHT.w;
	const top = ORIGIN - H / 2;
	const A = new Plot({ left: ORIGIN - total / 2, top, w: LEFT.w, h: H, x0: 0, x1: LEFT.x1, y0: 0, y1: LEFT.y1 });
	const B = new Plot({ left: A.right + BETWEEN, top, w: RIGHT.w, h: H, x0: 0, x1: RIGHT.x1, y0: RIGHT.y0, y1: 0 });
	check(near(A.top, B.top, 0) && near(A.bottom, B.bottom, 0), 'the panels do not share their tops and bottoms');

	/** A curve on the plot Q, sampled finely and kept inside it. */
	const curve = (Q, f, a, b, style, what, clear = 0) => {
		const pts = graph(Q, f, a, b, 0.2).filter(([, y]) => y >= Q.top - 1e-9 && y <= Q.bottom + 1e-9 && Q.bottom - y > clear);
		check(longest(pts) <= 0.2001, `${what} has a step of ${longest(pts)} pt, or leaves the panel and comes back`);
		S.path(pts, { ...style, what });
		return pts;
	};
	const dot = (q, what) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([q], DOT, what); };

	// ---- the left panel: axes, the classical line, one mode and Debye's solid
	{
		const xl = await xAxis(S, A, { ticks: [0, 1, 2, 3], what: 'the left axis across' });
		L.push(...xl);
		L.push(await placed('k_BT/\\hbar\\omega,\\ \\ T/\\Theta_D', A.X(LEFT.x1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, A, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0 ? null : String(t)), what: 'the left axis up' });
		L.push(...yl);
		L.push(await placed('C_{\\rm mode}/k_B,\\ \\ C/3Nk_B', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
		S.path([A.at(0, 1), A.at(LEFT.x1, 1)], { color: FAINT, width: W_DOT, dash: DOTS, cap: 'round', layer: 1.8, what: 'the classical line' });

		const mode = curve(A, (t) => cMode(1 / t), 1e-4, LEFT.x1, { color: INK, width: CURVE, layer: 2.2 }, 'one mode', CLEAR);
		curve(A, (t) => debye(t), 1e-4, LEFT.x1, { color: INK, width: CURVE, dash: DASH, cap: 'butt', layer: 2 }, 'Debye\'s curve', CLEAR);
		check(cMode(1 / LEFT.x1) < 1 && debye(LEFT.x1) < 1 && cMode(1 / LEFT.x1) > 0.99, 'the curves at the right edge');
		check(mode.length > 10, 'one mode');

		const qd = A.at(dots.diamond.t, dots.diamond.c), qc = A.at(dots.copper.t, dots.copper.c);
		dot(qd, 'diamond\'s dot');
		dot(qc, 'copper\'s dot');
		L.push(await S.clear('\\text{diamond, 293 K}', qd[0] + DOT + LABEL_GAP, qd[1] + DOT + LABEL_GAP, 0, 0, [0.8, 0.6]));
		L.push(await S.clear('\\text{copper, 293 K}', qc[0], A.Y(1) - LABEL_GAP - 0.6, 0.5, 1, [0, -1]));
		// the key, in the free space under the plateau
		let y = A.Y(KEY_AT[1]);
		const x = A.X(KEY_AT[0]);
		for (const [dash, src] of [[null, '\\text{one mode}'], [DASH, '\\text{Debye\'s solid}']]) {
			S.path([[x, y], [x + KEY_LINE, y]], { color: INK, width: CURVE, dash, cap: 'butt', layer: 2, what: `the key's line ${src}` });
			L.push(await placed(src, x + KEY_LINE + LABEL_GAP + 1, y, 0, 0.5, INK));
			y += PITCH;
		}
	}

	// ---- the right panel: the hole
	{
		const xl = await xAxis(S, B, { ticks: [0, 1, 2, 3], what: 'the right axis across' });
		L.push(...xl);
		L.push(await placed('\\text{temperature (K)}', B.X(RIGHT.x1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const minus = (t) => (t < 0 ? `{-}${-t}` : String(t));
		const yl = await yAxis(S, B, { ticks: [0, -2, -4, -6], fmt: minus, what: 'the right axis up' });
		L.push(...yl);
		L.push(await placed('C\\ \\ (10^{40}\\ \\text{J/K})', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
		S.path([B.at(0, 0), B.at(RIGHT.x1, 0)], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the line C = 0' });

		const c = (T) => holeC(T) / 1e40;
		const T0 = Math.sqrt(holeC(1) / 1e40 / RIGHT.y0);          // where the curve enters at the foot
		check(near(c(T0), RIGHT.y0, 1e-12), 'the curve does not enter at the foot');
		curve(B, c, T0, RIGHT.x1, { color: INK, width: CURVE, layer: 2.2 }, 'the hole\'s curve');
		check(c(RIGHT.x1) < 0 && B.Y(c(RIGHT.x1)) - B.top > 1.5, 'the hole\'s curve reaches zero');
		const q = B.at(hole.T, hole.C / 1e40);
		check(near(hawking(HOLE), hole.T, 1e-15), 'the dot\'s temperature');
		dot(q, 'the hole\'s dot');
		const a = await S.clear('\\text{the paper\'s hole,}', q[0] + DOT + LABEL_GAP + 1, q[1] + DOT + LABEL_GAP + 2, 0, 0, [0.6, 0.8]);
		const b = await placed('-1.35\\times10^{40}\\ \\text{J/K}', a.box.l, a.box.b + 3.2, 0, 0, INK);
		L.push(a, b);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { diamond: dots.diamond, copper: dots.copper, hole };
	return finish(S, L, [320, 372]);
}
