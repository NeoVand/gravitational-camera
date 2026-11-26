// The tutorial, section 3.5 (tutorial/noise/wiener-filter.md), its second diagram: a sharp cut in wavenumber rings in
// space. Left, the weights against q = kz from 0 to 25: the ideal low-pass filter, H = 1 for q < q_c and 0 beyond,
// a box drawn with a dashed blue edge; and the Wiener filter of SNR = 10^6, H = s^2 / (1 + s^2) with
// s = pi SNR q e^{-q} (section 3.7), in neutral ink, which falls through 1/2 at the box's edge q_c = 17.8. Right,
// their point-spread functions on a row, each divided by its peak, against u = k_c a = q_c a / z from -12 to 12: the
// ideal filter's sin u / u (blue, dashed) and the Wiener filter's (ink). A dimension line at the half maximum spans
// the full width 2 x 1.8955 = 3.79; the first negative lobe is marked at u = 4.49 with its depth, -0.217 for sin u / u
// and -0.211 for the Wiener filter.
// Exact: the box, the Wiener weight (q_c from Newton's method on q - ln q = ln(pi SNR), asserted 17.8); sin u / u
// (its half maximum by bisection, asserted 1.8955; its lobe where tan u = u, asserted 4.493 and -0.217); the Wiener
// filter's point-spread function, (1/pi) int_0^inf H(q) cos(q x) dq on a row, by the trapezoid rule on a grid of 64
// points per unit of q up to q_c + 40, as reference/gravcam/resolution.py computes it, with the shallow halo that the
// drop of H to zero at q = 0 adds, -e^{-|x|/l} / 2l with l = pi SNR (it changes nothing drawn); asserted against the
// chapter's width 0.2118 depths and lobe -0.211 at 0.251 depths. Every curve is sampled every quarter of a point along
// its length and drawn only where it stands clear of the horizontal axis. The fall of the Wiener weight to zero at
// q = 0 happens below q = 10^-6, far narrower than a line, and is not seen.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, dimension, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, peak, INK, DIM, ACCENT2, CURVE } from './tut-fourier-lib.js';

const name = 'tut-wiener-sinc';
const check = checker(name);

// ---- the mathematics: q = kz, x = a/z, u = q_c x ------------------------------------------------------------------
export const SNR = 1e6;
/** q_c, the larger root of q e^{-q} = 1/(pi SNR): q - ln q = ln(pi SNR), by Newton's method (resolution.py, cutoff). */
export function cutoff(snr = SNR) {
	const target = Math.log(Math.PI * snr);
	let q = target + Math.log(target);
	for (let i = 0; i < 60; i++) { const step = (q - Math.log(q) - target) / (1 - 1 / q); q -= step; if (Math.abs(step) < 1e-15 * q) break; }
	return q;
}
export const QC = cutoff();
/** The Wiener weight, 1 / (1 + s^-2) with s^-2 formed in logarithms. */
export const wiener = (q) => (q > 0 ? 1 / (1 + Math.exp(-2 * (Math.log(Math.PI * SNR) + Math.log(q) - q))) : 0);
export const sinc = (u) => (u === 0 ? 1 : Math.sin(u) / u);

// the Wiener filter's point-spread function on a row: trapezoid weights times H, the end point at q = 0 taking H's
// right-hand limit 1, with the halo of the drop at q = 0 added in closed form
const PER = 64, QMAX = QC + 40;
const NQ = Math.floor(PER * QMAX) + 1, DQ = QMAX / (NQ - 1);
const QS = Float64Array.from({ length: NQ }, (_, i) => i * DQ);
const WH = Float64Array.from(QS, (q, i) => (i === 0 ? 1 : wiener(q)) * DQ * (i === 0 || i === NQ - 1 ? 0.5 : 1));
const ELL = Math.PI * SNR;
const raw = (x) => {
	let s = 0;
	for (let i = 0; i < NQ; i++) s += WH[i] * Math.cos(QS[i] * x);
	return s / Math.PI - Math.exp(-Math.abs(x) / ELL) / (2 * ELL);
};
const H0 = raw(0);
/** The Wiener filter's point-spread function, divided by its peak, at x = a/z. */
export const psf = (x) => raw(x) / H0;

const bisect = (f, a, b) => { const fa = f(a) > 0; for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if ((f(m) > 0) === fa) a = m; else b = m; } return (a + b) / 2; };

function mathematics() {
	check(QC.toFixed(1) === '17.8', `q_c = ${QC}`);
	check(near(wiener(QC), 0.5, 1e-12), 'the Wiener weight is not 1/2 at q_c');
	// the lower root, where H is also 1/2: 3.2 x 10^-7
	const qLow = bisect((q) => wiener(q) - 0.5, 1e-9, 1e-3);
	check((qLow / 1e-7).toFixed(1) === '3.2', `the lower root ${qLow}`);
	// sin u / u: half maximum at 1.8955, first lobe at tan u = u, 4.493, depth -0.217
	const half = bisect((u) => sinc(u) - 0.5, 1, 3);
	check(half.toFixed(4) === '1.8955' && (2 * half).toFixed(2) === '3.79', `the half maximum ${half}`);
	const lobe = bisect((u) => Math.tan(u) - u, Math.PI + 0.1, 1.5 * Math.PI - 1e-9);
	check(lobe.toFixed(3) === '4.493' && sinc(lobe).toFixed(3) === '-0.217', `the lobe ${lobe}, ${sinc(lobe)}`);
	check(near(peak((u) => -sinc(u), Math.PI, 2 * Math.PI).x, lobe, 1e-6), 'the lobe is not the deepest point');
	// the Wiener filter's: full width 0.2118 depths, lobe -0.211 at 0.251 depths
	const wHalf = bisect((x) => psf(x) - 0.5, 0.05, 0.15);
	check((2 * wHalf).toFixed(4) === '0.2118', `the Wiener width ${2 * wHalf}`);
	const wl = peak((x) => -psf(x), 0.2, 0.3, 2000);
	check(wl.x.toFixed(3) === '0.251' && psf(wl.x).toFixed(3) === '-0.211', `the Wiener lobe ${wl.x}, ${psf(wl.x)}`);
	// the ideal filter's width at this cut-off, 3.79/17.8 = 0.2125 depths
	check((2 * half / QC).toFixed(4) === '0.2125', `the ideal width ${2 * half / QC}`);
	// the halo is negligible: below 10^-6 of the peak
	check(1 / (2 * ELL) / H0 < 1e-6, 'the halo is not negligible');
	return { half, lobe, lobeDepth: sinc(lobe), wHalfU: wHalf * QC, wLobeU: wl.x * QC, wLobe: psf(wl.x) };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const UNIT = 52;                         // points per unit of H or h, the same in both charts
const LW = 100, QR = 25;                 // the weights' chart: q from 0 to 25
const RW = 160, UR = 12;                 // the point-spread functions': u from -12 to 12
const GAP = 30;                          // between the charts
const TOP = 1.15, BOTTOM = -0.45;        // the vertical range (room under the lobe for its depths); the left chart stops at 0
const DASH = [2.2, 1.4];
const INSET = 0.25;                      // the curves stop this far (in u) inside the right chart, clear of its axis
const DOT = 1.05;

export default async function () {
	const n = mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - (LW + GAP + RW) / 2, top = ORIGIN - ((TOP - BOTTOM) * UNIT) / 2;
	const A = new Plot({ left, top, w: LW, h: TOP * UNIT, x0: 0, x1: QR, y0: 0, y1: TOP });
	const B = new Plot({ left: left + LW + GAP, top, w: RW, h: (TOP - BOTTOM) * UNIT, x0: -UR, x1: UR, y0: BOTTOM, y1: TOP });
	check(near(A.Y(0), B.Y(0), 1e-9) && near(A.Y(1), B.Y(1), 1e-9), 'the two charts do not share 0 and 1');

	// ---- left: the box, its top and edge dashed; the Wiener weight under its top
	const aClear = merge(A, CURVE);
	const qEnd = bisect((q) => wiener(q) - aClear, QC, QR);
	const wpts = graph(A, wiener, 1e-3, qEnd);
	check(longest(wpts) <= 0.2501, `the Wiener weight has a step of ${longest(wpts)} pt`);
	check(1 - wiener(1e-3) < 1e-6, 'the Wiener weight is not 1 at the chart\'s left edge');
	S.path(wpts, { color: INK, width: CURVE, layer: 2, what: 'the Wiener weight' });
	S.path([A.at(0, 1), A.at(QC, 1), A.at(QC, aClear)], { color: ACCENT2, width: CURVE, layer: 2.2, dash: DASH, cap: 'butt', what: 'the box' });
	const [cx, cy] = A.at(QC, 0.5);
	S.raw(`<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([[cx, cy]], DOT, 'the half at q_c');

	// ---- right: the zero line, then the two point-spread functions
	S.path([[B.left, B.Y(0)], [B.right, B.Y(0)]], { color: DIM, width: 0.3, layer: 0.5, cap: 'butt', dash: [1.2, 1.6], what: 'the zero line' });
	const wPsf = (u) => psf(u / QC);
	for (const [f, o, what] of [[wPsf, { color: INK }, 'the Wiener filter\'s'], [sinc, { color: ACCENT2, dash: DASH, cap: 'butt' }, 'sin u / u']]) {
		const pts = graph(B, f, -UR + INSET, UR - INSET);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= B.top && y <= B.bottom - 4), `${what} leaves its chart or meets its axis`);
		S.path(pts, { width: CURVE, layer: o.dash ? 2.2 : 2, what, ...o });
	}
	// the full width at half maximum
	dimension(S, B.X(-n.half), B.X(n.half), B.Y(0.5), { color: ACCENT2, what: 'the full width' });
	// the first lobe: a dot at the bottom of sin u / u
	const [lx, ly] = B.at(n.lobe, n.lobeDepth);
	S.raw(`<circle cx="${lx.toFixed(2)}" cy="${ly.toFixed(2)}" r="${DOT}" fill="${ACCENT2}"/>`, 3);
	S.mark([[lx, ly]], DOT, 'the lobe');

	// ---- the axes
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	const al = await xAxis(S, A, { ticks: [0, 10, QC], fmt: (t) => (t === QC ? '17.8' : fmt(t)), what: 'the q axis' });
	L.push(...al);
	const aLast = al[al.length - 1];
	L.push(await placed('q', Math.max(A.right, aLast.box.r) + 4, (aLast.box.t + aLast.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, A, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '\\tfrac12' : fmt(t)), what: 'the weights\' axis' })));
	const bl = await xAxis(S, B, { ticks: [-12, -6, 0, n.lobe, 12], fmt: (t) => (t === n.lobe ? '4.49' : fmt(t)), what: 'the u axis' });
	L.push(...bl);
	const bLast = bl[bl.length - 1];
	L.push(await placed('u', bLast.box.r + 4, (bLast.box.t + bLast.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, B, { ticks: [0, 1], fmt, what: 'the point-spread functions\' axis' })));
	L.push(await placed('H', A.left + 4.5, A.Y(TOP), 0, 0.5, DIM));
	L.push(await placed('h/h(0)', B.left + 4.5, B.Y(TOP), 0, 0.5, DIM));

	// ---- the names and numbers
	L.push(await S.clear('\\text{ideal}', A.X(QC / 2), A.Y(0.5), 0.5, 0.5, [0, 1], { color: ACCENT2 }));
	const qn = bisect((q) => wiener(q) - 0.25, QC, QR);
	L.push(await S.clear('\\text{Wiener}', A.X(qn) + LABEL_GAP + 1, A.Y(0.25), 0, 0, [1, 0], { color: INK }));
	L.push(await S.clear('3.79', B.X(n.half) + LABEL_GAP + 1.5, B.Y(0.5), 0, 0.5, [1, 0], { color: ACCENT2 }));
	// the lobe's depths, side by side under its bottom: the Wiener filter's on the left, sin u / u's on the right
	L.push(await S.clear('-0.211', lx - 2.6, ly + DOT + LABEL_GAP, 1, 0, [0, 1], { color: INK }));
	L.push(await S.clear('-0.217', lx + 2.6, ly + DOT + LABEL_GAP, 0, 0, [0, 1], { color: ACCENT2 }));

	S.checkAll(L);
	window.tutWienerSinc = { ...n, qc: QC };
	return finish(S, L, [240, 340]);
}
