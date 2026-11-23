// The tutorial, chapter 2.7 (tutorial/outside/evanescent.md), the three sensors' factors. Against q = kz from 0 to 8,
// the transforms of the three kernels up to constant factors: the tide's q e^{-q}, multiplied by e so that its peak, at
// q = 1, is 1 (a dot there); the pull's e^{-q}, which starts at 1 and has no peak; and the potential's q^{-1} e^{-q},
// which has no peak and grows without limit as q -> 0, on the same axes but clipped at 3.
// Exact: the three curves (sampled every quarter of a point along their length, and each drawn only while it stands
// 1.4 pt or more above the axis, so that none runs along it), the peak of the tide at q = 1 with height 1 (found numerically and
// asserted), and the potential's crossing of 3 (solved by bisection), where it is clipped.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, peak, INK, DIM, ACCENT, ACCENT2, CURVE } from './tut-fourier-lib.js';

const name = 'tut-evan-kernel';
const check = checker(name);

// ---- the mathematics -----------------------------------------------------------------------------------------------
export const Q = 8, TOP = 3;
export const tide = (q) => Math.E * q * Math.exp(-q);
export const pull = (q) => Math.exp(-q);
export const potential = (q) => Math.exp(-q) / q;

/** The q > 0 at which a decreasing f falls to v, by bisection on [a, b]. */
function fall(f, v, a, b) {
	for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (f(m) > v) a = m; else b = m; }
	return (a + b) / 2;
}

function mathematics() {
	const p = peak(tide, 0, Q);
	check(near(p.x, 1, 1e-6) && near(p.y, 1, 1e-12), `the tide's peak is at ${p.x}, ${p.y}`);
	// the tide's slope (1 - q) e^{1 - q} vanishes at q = 1, and the pull and the potential have none in (0, Q]
	for (let i = 1; i <= 8000; i++) {
		const q = i / 1000, d = 1e-6;
		check(pull(q + d) < pull(q) && potential(q + d) < potential(q), `a peak of the pull or the potential at ${q}`);
	}
	const clip = fall(potential, TOP, 1e-6, 1);
	check(near(potential(clip), TOP, 1e-9), 'the clip');
	return { peak: p, clip };
}

// ---- the drawing (points) ------------------------------------------------------------------------------------------
const PW = 214, PH = 118;
const DOT = 1.5;
const LIFT = 1.4;

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: Q, y0: 0, y1: TOP });
	// a curve stops where its centre comes within LIFT points of the axis's, before its tail can run along the axis
	const clear = (LIFT * (P.y1 - P.y0)) / P.h;
	check(clear > merge(P, CURVE), 'the curves stop where they already merge with the axis');

	// ---- the curves, where they stand clear of the axis
	const curves = [
		{ f: potential, color: INK, from: nums.clip, to: fall(potential, clear, nums.clip, Q), what: 'the potential' },
		{ f: pull, color: ACCENT2, from: 0, to: fall(pull, clear, 0, Q), what: 'the pull' },
		{ f: tide, color: ACCENT, from: fall((q) => -tide(q), -clear, 0, 1), to: fall(tide, clear, 1, Q), what: 'the tide' }
	];
	for (const c of curves) {
		check(c.f(c.from) >= clear - 1e-9 && c.f(c.to) >= clear - 1e-9, `${c.what} runs along the axis`);
		const pts = graph(P, c.f, c.from, c.to);
		check(longest(pts) <= 0.2501, `${c.what} has a step of ${longest(pts)} pt`);
		S.path(pts, { color: c.color, width: CURVE, layer: 2, what: c.what });
	}

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8], what: 'the q axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('q = kz', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3], what: 'the vertical axis' })));

	// ---- the tide's peak
	const c = P.at(nums.peak.x, nums.peak.y);
	S.fill(`M${n2(c[0] - DOT)},${n2(c[1])}a${DOT},${DOT} 0 1,0 ${2 * DOT},0a${DOT},${DOT} 0 1,0 ${-2 * DOT},0Z`,
		{ l: c[0] - DOT, r: c[0] + DOT, t: c[1] - DOT, b: c[1] + DOT }, { color: ACCENT, layer: 3, what: 'the peak' });

	// ---- the names, beside their curves
	const at = (f, q) => P.at(q, f(q));
	const [xp, yp] = at(potential, 0.42);
	L.push(await S.clear('\\text{potential}', xp + LABEL_GAP, yp, 0, 0.5, [1, 0], { color: INK }));
	const [xt, yt] = at(tide, 2.1);
	L.push(await S.clear('\\text{tide}', xt + LABEL_GAP, yt - LABEL_GAP, 0, 1, [0.6, -0.8], { color: ACCENT }));
	const [xu, yu] = at(pull, 2.0);
	L.push(await S.clear('\\text{pull}', xu + LABEL_GAP, yu - LABEL_GAP, 0, 1, [0.6, -0.8], { color: ACCENT2 }));

	S.checkAll(L);
	window.tutEvanKernel = { peak: [nums.peak.x, nums.peak.y], clip: nums.clip, ends: curves.map((k) => [k.from, k.to]) };
	return finish(S, L, [240, 340]);
}
