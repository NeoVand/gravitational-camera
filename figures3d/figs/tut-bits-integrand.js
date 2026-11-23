// The tutorial, chapter 3.8 (tutorial/noise/bits.md), its second diagram: the integrand of the paper's
// eq:capacity-integral, q log2(1 + s^2) with s = pi SNR q e^{-q}, against q = kz from 0 to 25, at SNR = 10^3 and at
// SNR = 10^6, each curve in the first accent (orange) with the area under it shaded in the accent's pale tint (the
// 10^6 area paler, behind). Over each, dashed in the second accent (blue), the approximation 2q log2 s kept up to the
// cut-off q_c, where s = 1 and it falls to zero. At each cut-off, q_c = 10.39 and 17.84, a hairline rises from the axis
// to the curve, which there has the value q_c (s = 1, so log2(1 + s^2) = 1); the axis carries the two cut-offs as its
// ticks. The shaded areas are 4 pi times the bits per area z^2, 4 pi x 37.9 and 4 pi x 200.9.
// Exact: both curves and both approximations (sampled every quarter of a point along their length; the curves stop
// where they would merge with the horizontal axis, the soft tails beyond q_c included), the cut-offs (q_c by
// resolution.ts's fixed point, asserted 10.39 and 17.84), the peaks (asserted at q = 5.37 and 9.08, the chapter's
// 5.4 and 9.1), the areas (adaptive Simpson, checked against Gauss-Legendre to 10^-6, asserted 37.9 and 200.9 bits
// times 4 pi; the integrand beyond q = 25 adds less than 10^-5 of a bit). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, peak, DIM, ACCENT, ACCENT2, CURVE } from './tut-fourier-lib.js';
import { cutoff, integrand, approx, area, chapterNumbers } from './tut-bits-lib.js';

const name = 'tut-bits-integrand';
const check = checker(name);

export const DIGITS = [3, 6];                  // SNR = 10^3 and 10^6
export const QMAX = 25;
const TOP = 232;

const bisect = (f, a, b) => { const fa = f(a) > 0; for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if ((f(m) > 0) === fa) a = m; else b = m; } return (a + b) / 2; };

function mathematics() {
	const { C3, C6 } = chapterNumbers(check);
	const qc = DIGITS.map(cutoff);
	// at the cut-off s = 1, so the integrand is q_c itself
	qc.forEach((q, i) => check(near(integrand(q, DIGITS[i]), q, 1e-9) && near(approx(q, DIGITS[i]), 0, 1e-9), `the integrand at q_c = ${q}`));
	// the peaks: the chapter's 5.4 and 9.1
	const peaks = DIGITS.map((d) => peak((q) => integrand(q, d), 0.5, 20));
	check(peaks[0].x.toFixed(1) === '5.4' && peaks[1].x.toFixed(1) === '9.1', `the peaks at ${peaks.map((p) => p.x)}`);
	check(peaks[1].y < TOP - 15, 'the 10^6 peak is too near the top of the chart');
	// the areas as drawn, to q = 25: 4 pi C, within 10^-5 bits (the 10^6 tail beyond 25 holds 3 x 10^-6)
	const drawn = DIGITS.map((d) => area(d, QMAX));
	check(near(drawn[0] / (4 * Math.PI), C3, 1e-5) && near(drawn[1] / (4 * Math.PI), C6, 1e-5), 'the drawn areas are not 4 pi C');
	check((drawn[0] / (4 * Math.PI)).toFixed(1) === '37.9' && Math.round(drawn[1] / (4 * Math.PI)) === 201, 'the areas\' bits');
	// the 10^6 curve lies above the 10^3 curve everywhere, so its area can be drawn behind
	for (let q = 0.01; q < QMAX; q += 0.01) check(integrand(q, 6) > integrand(q, 3), `the curves cross at q = ${q}`);
	// the approximation stays below the curve: log2(1 + s^2) > 2 log2 s
	for (const d of DIGITS) for (let q = 0.01; q < cutoff(d); q += 0.01) check(approx(q, d) < integrand(q, d), 'the approximation is above the curve');
	return { qc, peaks: peaks.map((p) => [p.x, p.y]), areas: drawn, C: [C3, C6] };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PW = 252, PH = 132;
const DASH = [2.2, 1.4];
const PALE = '#f3dfcb';                        // drawing.ts, THEME: the pale tint of the first accent
const PALER = 0.5;                             // the 10^6 area: the same tint at this opacity

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: QMAX, y0: 0, y1: TOP });
	const clear = merge(P, CURVE);
	const f = (d) => (q) => integrand(q, d);
	const g = (d) => (q) => approx(q, d);

	// ---- the areas: 10^6 behind, paler; 10^3 in front; each closed down to the axis
	for (const [i, d] of [[1, 6], [0, 3]]) {
		const pts = graph(P, f(d), 0, QMAX);
		check(longest(pts) <= 0.2501, `the area at 10^${d} has a coarse edge`);
		const dd = 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + `L${n2(P.right)},${n2(P.bottom)}L${n2(P.left)},${n2(P.bottom)}Z`;
		S.raw(`<path d="${dd}" fill="${PALE}"${i ? ` fill-opacity="${PALER}"` : ''}/>`, 0.5 + 0.1 * (1 - i));
	}

	// ---- the curves, each from where it leaves the axis to where its tail meets it again
	for (const [i, d] of DIGITS.entries()) {
		const a = bisect((q) => integrand(q, d) - clear, 1e-9, 1), b = bisect((q) => integrand(q, d) - clear, nums.qc[i], 60);
		const pts = graph(P, f(d), a, Math.min(b, QMAX));
		check(longest(pts) <= 0.2501, `the curve at 10^${d} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y <= P.bottom - (CURVE + 0.45) / 2 + 1e-6 && y >= P.top), `the curve at 10^${d} meets the axis`);
		S.path(pts, { color: ACCENT, width: CURVE, layer: 2, what: `the curve at 10^${d}` });
		// the approximation, dashed, beneath the curve, so it shows only where the two part near q_c
		const a2 = bisect((q) => approx(q, d) - clear, 1e-6, 1), b2 = bisect((q) => approx(q, d) - clear, nums.peaks[i][0], nums.qc[i]);
		const pa = graph(P, g(d), a2, b2);
		check(longest(pa) <= 0.2501, `the approximation at 10^${d} has a coarse step`);
		S.path(pa, { color: ACCENT2, width: CURVE, layer: 1.9, dash: DASH, cap: 'butt', what: `the approximation at 10^${d}` });
		// the cut-off: a hairline from the axis to the curve
		const x = P.X(nums.qc[i]);
		S.path([[x, P.bottom - 0.2], [x, P.Y(nums.qc[i]) + CURVE / 2]], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: `the cut-off at 10^${d}` });
	}

	// ---- the axes
	const fmtQ = (t) => (t === 0 ? '0' : t === QMAX ? '25' : t.toFixed(1));
	const xl = await xAxis(S, P, { ticks: [0, nums.qc[0], nums.qc[1], QMAX], fmt: fmtQ, what: 'the q axis' });
	L.push(...xl);
	check(xl[1].src === '10.4' && xl[2].src === '17.8', 'the cut-offs on the axis');
	const last = xl[xl.length - 1];
	L.push(await placed('q', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 100, 200], what: 'the vertical axis' })));
	L.push(await S.clear('q\\log_2(1 + s^2)', P.left + 5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));

	// ---- the names: each SNR inside its own area, under the peak
	L.push(await S.clear('\\mathrm{SNR} = 10^3', P.X(nums.peaks[0][0]), P.Y(nums.peaks[0][1] * 0.42), 0.5, 0.5, [0, 1], { color: ACCENT }));
	const q6 = nums.peaks[0][0] + 0.8;
	L.push(await S.clear('\\mathrm{SNR} = 10^6', P.X(q6), P.Y((integrand(q6, 3) + integrand(q6, 6)) / 2), 0.5, 0.5, [0, 1], { color: ACCENT }));

	S.checkAll(L);
	window.tutBitsIntegrand = nums;
	return finish(S, L, [240, 340]);
}
