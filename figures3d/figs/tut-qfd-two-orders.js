// The tutorial, chapter 8.7 (tutorial/quantum/quantum-fluctuation.md), its second diagram: the two orders of a
// correlation. One panel: across, omega / omega_0 from -2 to 2; up, spectral density in units of hbar Im chi(omega_0),
// from 0 to 3.4. One cart with a narrow line, chi = c^2 / (omega_0^2 - omega^2 - i Gamma omega) with Gamma = 0.08
// omega_0 (Q = 12.5), at k_B T = hbar omega_0. Three thin curves: S(omega) = 2 hbar (nbar + 1) Im chi, solid ink, 3.164
// at +omega_0 and 1.164 at -omega_0; S-bar(omega) = hbar coth(hbar omega / 2 k_B T) Im chi, dashed ink, 2.164 at both;
// the classical 2 k_B T Im chi / omega, dotted grey, 2.0 at both. "absorption" and "emission" beside the two peaks; the
// two solid peak tops carried by dotted leaders to a bracket at omega = 0, named by their ratio, exp(hbar omega_0 /
// k_B T) = 2.72. An inset with the same axes at k_B T = 0.1 hbar omega_0, "nearly at absolute zero": the solid peak at
// -omega_0 gone (9 x 10^-5), the dashed ones at 1, the solid one at +omega_0 at 2 and the dotted ones at 0.2. Ink and
// greys only.
// Departures from the diagram's comment: the unit up is hbar Im chi at omega_0, where the heights are the ones the
// comment gives (the curves' maxima, a hair inside +-omega_0, are within 0.3 per cent of them, and the bracket marks
// the heights at +-omega_0, whose ratio is e exactly); the ratio is written exp(hbar omega_0 / k_B T), so that no
// script sits inside a script, too small on a phone; "absorption" and "emission" stand beside the peaks' tops rather
// than over them, and the inset sits at the upper left rather than the upper right, since over each peak the space
// is taken by the other curves' taller tops and by the key; a key names the three curves; the inset also draws the
// dotted classical curve, at 0.2. Each curve is left out where it is within 1.5 pt of the axis, so that the three
// never run along the axis as a band (between the peaks they fall to 0.013).
// Exact: every curve (S(-omega) = e^{-hbar omega / k_B T} S(omega), S(omega) - S(-omega) = 2 hbar Im chi and the average
// S-bar are asserted at 600 frequencies at both temperatures in tut-qfd-lib.js), the heights and the ratio.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, spec, specBar, classical, WARM, COLD } from './tut-qfd-lib.js';

const name = 'tut-qfd-two-orders';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X0 = -2, X1 = 2, Y0 = 0, Y1 = 3.4;
const UNIT = 72, DY = 50;                // points per unit across and up
const W_LINE = 0.6, W_DOT = 0.8;
const DASH = [3, 2], DOTS = [0, 1.7];
const END = 2.2;                         // half the bracket's end strokes
const KEY_LINE = 13, PITCH = 12.5;
const CLEAR = 1.5;                       // a curve is left out where it is nearer the axis than this, points
const INSET = { w: 96, h: 30, x1: 2.3 };  // the inset's plot, points, and its range up

const STYLES = {
	solid: { color: INK, width: W_LINE, layer: 2.2, cap: 'round' },
	dashed: { color: INK, width: W_LINE, layer: 2, dash: DASH, cap: 'butt' },
	dotted: { color: FAINT, width: W_DOT, layer: 1.8, dash: DOTS, cap: 'round' }
};

/** The three curves on the plot P at k_B T = t hbar omega_0, each drawn only where it stands clear of the axis. */
function curves(S, P, t, tag) {
	const out = {};
	for (const [key, f] of [['dotted', classical], ['dashed', specBar], ['solid', spec]]) {
		const style = STYLES[key];
		const floor = (CLEAR / P.h) * (P.y1 - P.y0);
		const pts = graph(P, (x) => f(x, t), X0, X1, 0.2);
		check(longest(pts) <= 0.2001, `${key} ${tag} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top - 1e-6), `${key} ${tag} leaves the panel`);
		// split where the curve sinks onto the axis
		const runs = [];
		let run = [];
		for (const p of pts) {
			if (P.bottom - p[1] > (floor / (P.y1 - P.y0)) * P.h) run.push(p);
			else if (run.length) { runs.push(run); run = []; }
		}
		if (run.length) runs.push(run);
		// each run cut at its tops and troughs, and every piece drawn outwards from a top, so that a dashed or dotted
		// curve always has ink at a peak's top, never a gap
		for (const r of runs) {
			if (r.length < 2) continue;
			const cuts = [0];
			for (let i = 1; i < r.length - 1; i++) if ((r[i][1] - r[i - 1][1]) * (r[i + 1][1] - r[i][1]) < 0) cuts.push(i);
			cuts.push(r.length - 1);
			for (let k = 1; k < cuts.length; k++) {
				const piece = r.slice(cuts[k - 1], cuts[k] + 1);
				const topAtEnd = piece[piece.length - 1][1] < piece[0][1];
				S.path(topAtEnd ? piece.reverse() : piece, { ...style, what: `${key} ${tag}` });
			}
		}
		out[key] = runs;
	}
	return out;
}

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * UNIT, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });

	// ---- the axes
	const minus = (t) => (t < 0 ? `{-}${-t}` : String(t));
	const xl = await xAxis(S, P, { ticks: [-2, -1, 0, 1, 2], fmt: minus, what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3], fmt: (t) => (t === 0 ? null : String(t)), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('\\omega/\\omega_0', P.X(0), below + 4, 0.5, 0, DIM));
	const yName = await placed('\\text{spectral density}\\ \\ (\\hbar\\,\\mathrm{Im}\\,\\chi(\\omega_0))', P.left - 4, P.top - 9, 0, 1, DIM);
	L.push(yName);

	// ---- the warm cart's curves
	const warm = curves(S, P, WARM, 'warm');
	const holds = (runs, x, Pl) => runs.some((r) => r[0][0] < Pl.X(x) && r[r.length - 1][0] > Pl.X(x));
	check(['solid', 'dashed', 'dotted'].every((k) => holds(warm[k], 1, P) && holds(warm[k], -1, P)), 'a warm curve has not both peaks');
	const hp = spec(1, WARM), hm = spec(-1, WARM);
	check(hp.toFixed(3) === '3.164' && hm.toFixed(3) === '1.164' && near(hp / hm, Math.E, 1e-12), 'the solid heights');
	check(P.Y(hp) > P.top + 8, 'the solid peak reaches the top');

	// ---- the bracket at omega = 0 between the two solid heights, with dotted leaders from the peaks' tops
	const bx = P.X(0), yTop = P.Y(hp), yBot = P.Y(hm);
	const reach = 2.2;                    // the leaders stop this far from the curves and the bracket
	// the upper leader stops short of the solid peak's left flank where it crosses the height 3.164 (the curve's top
	// lies a hair left of omega_0, and a little higher)
	let xl0;
	{
		let a = 0.95, b = 0.9987;
		check(spec(b, WARM) > hp && spec(a, WARM) < hp, 'the left flank of the solid peak');
		for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (spec(m, WARM) < hp) a = m; else b = m; }
		xl0 = (a + b) / 2;
	}
	S.dots([P.X(xl0) - reach - W_LINE / 2, yTop], [bx + END + reach / 2, yTop], { color: FAINT, what: 'the upper leader' });
	// the lower leader starts clear of the taller dashed and dotted peaks that rise through its height
	let xf;
	{
		let a = -1, b = -0.8;
		for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (specBar(m, WARM) > hm) a = m; else b = m; }
		xf = (a + b) / 2;
		check(classical(xf, WARM) < hm && near(specBar(xf, WARM), hm, 1e-9), 'the dashed flank');
	}
	S.dots([P.X(xf) + reach + W_LINE / 2, yBot], [bx - END - reach / 2, yBot], { color: FAINT, what: 'the lower leader' });
	S.path([[bx, yTop], [bx, yBot]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'the bracket' });
	for (const y of [yTop, yBot]) S.path([[bx - END, y], [bx + END, y]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'the bracket\'s end' });
	{
		const mid = (yTop + yBot) / 2;
		const a = await placed('\\exp(\\hbar\\omega_0/k_BT)', bx + END + LABEL_GAP + 1, mid - 1.6, 0, 1, INK);
		const b = await placed('= 2.72', a.box.l, mid + 1.6, 0, 0, INK);
		L.push(a, b);
	}

	// ---- absorption and emission, beside the tops of their peaks
	L.push(await S.clear('\\text{absorption}', P.X(1) + 3, yTop + 1, 0, 0.5, [1, 0]));
	L.push(await S.clear('\\text{emission}', P.X(-1) - 3, P.Y(1.5), 1, 0.5, [-1, 0]));

	// ---- the key, at the right, under "absorption"
	{
		const x = P.X(1.17);
		let y = P.Y(2.55);
		for (const [key, src] of [['solid', 'S(\\omega)'], ['dashed', '\\bar S(\\omega)'], ['dotted', '\\text{classical}']]) {
			S.path([[x, y], [x + KEY_LINE, y]], { ...STYLES[key], layer: 2, what: `the key's ${key} line` });
			L.push(await placed(src, x + KEY_LINE + LABEL_GAP + 1, y, 0, 0.5, INK));
			y += PITCH;
		}
	}

	// ---- the inset: the same axes at k_B T = 0.1 hbar omega_0, at the upper left
	{
		const left = P.left + 36, top = yName.box.b + 17;
		const I = new Plot({ left, top, w: INSET.w, h: INSET.h, x0: X0, x1: X1, y0: 0, y1: INSET.x1 });
		L.push(...(await xAxis(S, I, { ticks: [-2, -1, 0, 1, 2], fmt: (t) => (Math.abs(t) === 1 ? minus(t) : null), what: 'the inset\'s axis across' })));
		L.push(...(await yAxis(S, I, { ticks: [0, 1, 2], fmt: String, what: 'the inset\'s axis up' })));
		const cold = curves(S, I, COLD, 'cold');
		check(['dashed', 'dotted'].every((k) => holds(cold[k], 1, I) && holds(cold[k], -1, I)) && holds(cold.solid, 1, I), 'a cold curve has lost a peak');
		check(cold.solid.every((r) => r.every(([x]) => x > I.X(0))), 'the cold emission has not vanished');
		check(near(specBar(1, COLD), 1, 1e-4) && near(spec(1, COLD), 2, 1e-4) && near(classical(1, COLD), 0.2, 1e-12), 'the cold heights');
		L.push(await placed('\\text{nearly at absolute zero}', I.left - 3, I.top - LABEL_GAP - 2, 0, 1, INK));
		check(I.bottom + 16 < P.Y(specBar(-1, WARM)), `the inset reaches down to the dashed peak: ${I.bottom + 16 - P.Y(specBar(-1, WARM))}`);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { warm: [hp, hm, specBar(1, WARM), classical(1, WARM)], cold: [spec(1, COLD), spec(-1, COLD), specBar(1, COLD)] };
	return finish(S, L, [260, 340]);
}
