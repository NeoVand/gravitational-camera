// The tutorial, chapter 4.2 (tutorial/response/temperature.md), its first diagram: why the chance of a state falls
// exponentially with its energy. Left, a small box (the small system, holding the energy E) inside a large one (the
// bath, holding E_tot - E), with two thin arrows across the small box's wall, one each way, labelled "energy".
// Middle, the logarithm of the bath's count of states, ln Omega, against the bath's energy: a smooth rising concave
// curve, (3N/2) ln E for a gas, shown schematically, with the point at E_tot marked. Right, a short stretch near
// E_tot magnified in an inset, joined to that point by two thin lines: there the curve is indistinguishable from its
// tangent, of slope 1/k_BT, and the small system's energy E is a step to the left of E_tot, over which ln Omega falls
// by E/k_BT. Below the inset, on the same scale of energy, the resulting e^{-E/k_BT} against E, falling by e per k_BT,
// with ticks at k_BT, 2 k_BT and 3 k_BT and the levels 1, e^{-1} and e^{-2} marked.
// Exact: the inset's curve, ln Omega(E_tot + x k_BT) - ln Omega(E_tot) = (3N/2) ln(1 + x / (3N/2)) for a gas of
// N = 1000 atoms (k_BT = 2 E_tot / 3N, the chapter's gap box), asserted to lie within 0.1 pt of its tangent across the
// inset; the step and its fall (E = 2 k_BT, a fall of 2 in ln Omega); the exponential and its levels, sampled every
// quarter of a point. Schematic: the middle curve's scales (its shape is (3N/2) ln E, but for N = 1000 the two
// axes could not both be read), the inset's place, and the boxes.
import { INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NUM, LABEL_GAP, dimension, merge, TINT } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { chapter } from './tut-temp-lib.js';

const name = 'tut-temp-bath';
const check = checker(name);

// ---- the mathematics ----------------------------------------------------------------------------------------------
export const ATOMS = 1000;
const A = 1.5 * ATOMS;                          // 3N/2
/** ln Omega(E_tot + x k_BT) - ln Omega(E_tot), x in units of k_BT = E_tot / A. */
const lnOmega = (x) => A * Math.log1p(x / A);
export const STEP = 2;                          // the small system's energy, in units of k_BT

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const BOX = [86, 64], SMALL = [24, 22];         // the bath and the small system
const BOX_W = 0.55, ARROW_W = 0.5, ARROW_LEN = 15, ARROW_GAP = 6, ARROW_HEAD = 3.4;
const GAP_BOXES = 20;                           // from the boxes down to the middle chart
const MW = 100, MH = 84;                         // the middle chart
const E0 = 0.12, E1 = 1;                     // its curve, in units of E_tot
const KT_PT = 28;                               // the inset and the exponential: points per k_BT
const IX = [-3.8, 1.2], IY = [-4.4, 1.6];     // the inset's ranges, k_BT and units of ln Omega
const FRAME = 0.4;
const EH = 60;                                  // the exponential's height
const GAP_INSET = 26, GAP_BELOW = 24;

export default async function () {
	chapter(check);
	// ---- the inset's curve against its tangent at E_tot: within 0.1 pt across the inset
	// the slope at E_tot is 1/k_BT: d ln Omega / d x = 1 there, and k_BT = 2 E_tot / 3N
	check(near((lnOmega(1e-6) - lnOmega(-1e-6)) / 2e-6, 1, 1e-9), 'the slope at E_tot is not 1/k_BT');
	check(near(lnOmega(-STEP), -STEP, 0.005), 'ln Omega does not fall by E / k_BT over the step');
	// the exponential falls by e per k_BT
	for (const k of [1, 2, 3]) check(near(Math.exp(-k) * Math.E ** k, 1, 1e-15), 'e^{-E/k_BT} does not fall by e per k_BT');

	const S = new Sheet(name);
	const L = [];

	// ---- the left column: the boxes above the middle chart
	const M = new Plot({ left: ORIGIN - 150, top: ORIGIN - 10, w: MW, h: MH, x0: 0, x1: 1.3, y0: -0.05, y1: 1.08 });
	const bx = M.left, by = M.top - GAP_BOXES - BOX[1];
	S.path([[bx, by], [bx + BOX[0], by], [bx + BOX[0], by + BOX[1]], [bx, by + BOX[1]]], { color: INK, width: BOX_W, closed: true, cap: 'butt', what: 'the bath' });
	const sx = bx + 9, sy = by + BOX[1] - 9 - SMALL[1];
	S.raw(`<path d="M${n2(sx)},${n2(sy)}h${SMALL[0]}v${SMALL[1]}h${-SMALL[0]}Z" fill="${TINT}" stroke="${INK}" stroke-width="${BOX_W}"/>`, 1.5);
	S.mark([[sx, sy], [sx + SMALL[0], sy], [sx + SMALL[0], sy + SMALL[1]], [sx, sy + SMALL[1]], [sx, sy]], BOX_W / 2, 'the small system');
	L.push(Object.assign(await placed('E', sx + SMALL[0] / 2, sy + SMALL[1] / 2, 0.5, 0.5, INK), { on: ['the small system'] }));
	L.push(await placed('E_{\\rm tot} - E', bx + BOX[0] / 2, by + 9, 0.5, 0, INK));
	const ay = sy + SMALL[1] / 2, ax = sx + SMALL[0];
	S.arrow([ax + 1.5, ay - ARROW_GAP / 2], [ax + 1.5 + ARROW_LEN, ay - ARROW_GAP / 2], { color: INK, width: ARROW_W, head: ARROW_HEAD, what: 'energy out' });
	S.arrow([ax + 1.5 + ARROW_LEN, ay + ARROW_GAP / 2], [ax + 1.5, ay + ARROW_GAP / 2], { color: INK, width: ARROW_W, head: ARROW_HEAD, what: 'energy in' });
	L.push(await placed('\\text{energy}', ax + 1.5 + ARROW_LEN + LABEL_GAP + 0.5, ay, 0, 0.5, INK));

	// ---- the middle chart: ln Omega against the bath's energy, schematic
	const f = (e) => Math.log(e / E0) / Math.log(E1 / E0);
	const mc = graph(M, f, E0, E1);
	check(longest(mc) <= 0.2501, `the middle curve has a step of ${longest(mc)} pt`);
	S.path(mc, { color: INK, width: CURVE, layer: 2, what: 'the middle curve' });
	S.path([[M.left, M.bottom], [M.right, M.bottom]], { color: DIM, width: 0.45, cap: 'butt', what: 'the energy axis' });
	S.path([[M.left, M.bottom], [M.left, M.top]], { color: DIM, width: 0.45, cap: 'butt', what: 'the ln Omega axis' });
	const pT = M.at(1, f(1));
	S.path([[pT[0], M.bottom], [pT[0], M.bottom + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at E_tot' });
	L.push(await placed('E_{\\rm tot}', pT[0], M.bottom + TICK + NUM, 0.5, 0, DIM));
	S.raw(`<circle cx="${n2(pT[0])}" cy="${n2(pT[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([pT], DOT, 'the point at E_tot');
	L.push(await placed('\\ln\\Omega', M.left + 4, M.top, 0, 0, DIM));
	L.push(await placed('\\text{bath\'s energy}', M.left + 4, M.bottom + TICK + NUM, 0, 0, DIM));

	// ---- the right column: the inset, and the exponential below it on the same scale of energy, its axis on the
	// middle chart's
	const ex1 = 3.8;
	const ax1 = 4.1;                              // the axis reaches past the curve's end
	const X = new Plot({ left: M.right + GAP_INSET + 12, top: M.bottom - EH, w: ax1 * KT_PT, h: EH, x0: 0, x1: ax1, y0: 0, y1: 1.06 });
	// the inset reaches from the boxes' top down to GAP_BELOW above the exponential
	const iw = (IX[1] - IX[0]) * KT_PT, ih = X.top - GAP_BELOW - by;
	const LN_PT = ih / (IY[1] - IY[0]);
	const I = new Plot({ left: X.left - 12, top: X.top - GAP_BELOW - ih, w: iw, h: ih, x0: IX[0], x1: IX[1], y0: IY[0], y1: IY[1] });
	check(near(X.bottom, M.bottom, 1e-9), 'the two charts do not share their baseline');
	check(near(X.X(1) - X.X(0), I.X(1) - I.X(0), 1e-9), 'the inset and the exponential do not share their scale of energy');
	S.path([[I.left, I.top], [I.right, I.top], [I.right, I.bottom], [I.left, I.bottom]], { color: FAINT, width: FRAME, closed: true, cap: 'butt', layer: 1, what: 'the inset\'s frame' });
	const line = graph(I, lnOmega, IX[0] + 0.12, IX[1] - 0.12);
	check(longest(line) <= 0.2501, `the inset's curve has a step of ${longest(line)} pt`);
	S.path(line, { color: INK, width: CURVE, layer: 2, what: 'the inset\'s curve' });
	let worst = 0;
	for (let x = IX[0]; x <= IX[1]; x += 0.001) worst = Math.max(worst, Math.abs(lnOmega(x) - x) * LN_PT);
	check(worst < 0.1, `the inset's curve is ${worst} pt from its tangent`);
	// the step: from E_tot - E to E_tot along, and the fall E / k_BT up
	const pA = I.at(-STEP, lnOmega(-STEP)), pB = I.at(0, 0), corner = [pB[0], pA[1]];
	dimension(S, pA[0], corner[0], pA[1] + 7, { color: DIM, width: 0.45, what: 'the step E' });
	S.path([pA, corner, pB], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: 'the triangle' });
	for (const p of [pA, pB]) { S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([p], DOT, 'a marked point'); }
	L.push(await placed('E', (pA[0] + corner[0]) / 2, pA[1] + 7 + 2.2 + LABEL_GAP, 0.5, 0, DIM));
	L.push(await placed('E/k_BT', corner[0] + LABEL_GAP + 0.6, (pA[1] + pB[1]) / 2, 0, 0.5, DIM));
	L.push(await placed('\\text{slope } 1/k_BT', I.left + 5, I.top + 5, 0, 0, INK));
	S.path([[pB[0], I.bottom], [pB[0], I.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the tick at E_tot' });
	L.push(await placed('E_{\\rm tot}', pB[0], I.bottom + TICK + NUM, 0.5, 0, DIM));
	// the lines from the point at E_tot to the inset
	for (const c of [[I.left, I.top], [I.left, I.bottom]]) {
		const d = Math.hypot(c[0] - pT[0], c[1] - pT[1]), u = [(c[0] - pT[0]) / d, (c[1] - pT[1]) / d];
		S.path([[pT[0] + u[0] * (DOT + 1.2), pT[1] + u[1] * (DOT + 1.2)], c], { color: FAINT, width: FRAME, layer: 1, cap: 'butt', what: 'a line to the inset' });
		// clear of the bath's box by 3 pt
		const k = [bx + BOX[0], by + BOX[1]], t = ((k[0] - pT[0]) * u[0] + (k[1] - pT[1]) * u[1]);
		check(Math.hypot(k[0] - pT[0] - t * u[0], k[1] - pT[1] - t * u[1]) > 3 && (k[0] - pT[0]) * u[1] - (k[1] - pT[1]) * u[0] > 0, 'a line to the inset passes over the bath\'s box');
	}

	// ---- the exponential
	const cut = merge(X, CURVE);
	check(Math.exp(-ex1) > cut, 'the exponential merges with its axis before the chart ends');
	const ex = graph(X, (x) => Math.exp(-x), 0, ex1);
	check(longest(ex) <= 0.2501, `the exponential has a step of ${longest(ex)} pt`);
	S.path(ex, { color: INK, width: CURVE, layer: 2, what: 'the exponential' });
	const kt = (k) => (k === 0 ? '0' : k === 1 ? 'k_BT' : `${k}k_BT`);
	L.push(...(await xAxis(S, X, { ticks: [0, 1, 2, 3], fmt: kt, what: 'the E axis' })));
	L.push(await placed('E', X.right + 4, X.bottom, 0, 0.5, DIM));
	const lv = { 0: null, [Math.exp(-2)]: 'e^{-2}', [Math.exp(-1)]: 'e^{-1}', 1: '1' };
	L.push(...(await yAxis(S, X, { ticks: [0, Math.exp(-2), Math.exp(-1), 1], fmt: (t) => lv[t], what: 'the probability axis' })));
	L.push(await S.clear('e^{-E/k_BT}', X.X(1.3), X.Y(Math.exp(-1.3)), 0, 1, [1, -1].map((v) => v / Math.SQRT2), { color: INK }));

	S.checkAll(L);
	window[name + '-numbers'] = { worst, kT: 1 / A };
	return finish(S, L, [240, 340]);
}
