// The tutorial, chapter 4.4 (tutorial/response/viscosity.md), its third diagram: the friction Re eta =
// eta0 / (1 + omega^2 tau^2) of two Maxwell liquids of the same illustrative stiffness mu = 1 GPa, on log-log axes,
// omega from 10^4 to 10^15 s^-1 and Re eta from 10^-14 to 10^2 Pa s. Honey (eta0 = 10 Pa s, tau = 10 ns), in the
// second accent, flat at 10 and bending near 10^8 s^-1; a Maxwell liquid with water's viscosity (10^-3 Pa s, 1 ps), in
// the first accent as the paper's water, flat at 10^-3 and bending near 10^12 s^-1. Each tail's asymptote
// mu^2 / eta0 omega^2 continued, dashed, from where it parts from its curve up to the top of the chart. A dot where the
// curves cross, at omega = mu / sqrt(eta_h eta_w) = 10^10 s^-1 and Re eta = 1.0 x 10^-3 Pa s. The paper's placeholder,
// 10^-3 Pa s, dotted from where it parts from the water's plateau (with which it coincides on the left) to the right
// edge, named there. The band of the glow at 293 K, where x^3/(e^x - 1), x = hbar omega / k_B T, exceeds a tenth of
// its peak (x from 0.420 to 8.30, omega from 1.61 x 10^13 to 3.18 x 10^14 s^-1), shaded in the neutral tint as in the
// paper's fig:materials, with a dashed line at its peak, x = 2.821, omega = 1.08 x 10^14 s^-1, where honey's friction
// is 8.5 x 10^-12 Pa s and the water's 8.5 x 10^-8.
// Exact: both curves, their asymptotes, the crossing, the band and its peak (asserted in tut-visc-lib.js, `chapter`,
// and against the marks here). Every curve is sampled so that no two neighbouring points are more than a quarter of a
// point apart. Chosen for the illustration: the stiffness of 1 GPa. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, TINT, pathOf, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DIM, ACCENT, ACCENT2, ZERO_LINE, ZERO_DASH, DOT as POINT } from './tut-bessel-lib.js';
import { chapter, reEta, tail, HONEY, WATER, PLACEHOLDER, MU_LIQUID, W_BAND, W_PEAK } from './tut-visc-lib.js';

const name = 'tut-visc-tails';
const check = checker(name);

const X = [4, 15], Y = [-14, 2];           // log10 omega (s^-1), log10 Re eta (Pa s)
const DX = 20, DY = 10.5;                  // points per decade
const ASYM = 0.45, ASYM_DASH = [1.8, 1.4]; // the asymptotes, as chapter 4.1's free mass (figs/tut-osc-response.js)
const AIR = 1.4;                           // a line is drawn only where it stands this far clear of the curve it continues
const lg = Math.log10;

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (X[1] - X[0]) * DX, PH = (Y[1] - Y[0]) * DY;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X[0], x1: X[1], y0: Y[0], y1: Y[1] });
	const liquids = [
		{ key: 'honey', eta0: HONEY, color: ACCENT2 },
		{ key: 'water', eta0: WATER, color: ACCENT }
	];
	const curve = (eta0) => (x) => lg(reEta(10 ** x, eta0));
	const asym = (eta0) => (x) => lg(tail(10 ** x, eta0));

	// ---- the band of the glow, and the line at its peak
	const [b0, b1] = W_BAND.map(lg), xp = lg(W_PEAK);
	const band = { l: P.X(b0), r: P.X(b1), t: P.top, b: P.bottom };
	S.fill(pathOf([[band.l, band.t], [band.r, band.t], [band.r, band.b], [band.l, band.b]]), band, { color: TINT, layer: 0, what: 'the band' });
	S.path([[P.X(xp), P.top], [P.X(xp), P.bottom]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the peak' });

	// ---- the curves, and each tail's asymptote, dashed, where it stands clear of its curve
	for (const { key, eta0, color } of liquids) {
		const f = curve(eta0), g = asym(eta0);
		const pts = graph(P, f, X[0], X[1]);
		check(longest(pts) <= 0.2501, `${key}'s curve is coarse`);
		check(pts.every(([, y]) => y > P.top + 3 && y < P.bottom - 3), `${key}'s curve leaves the chart`);
		S.path(pts, { color, width: CURVE, layer: 2, what: `${key}'s curve` });
		// from the top of the chart down to where the asymptote comes within AIR of the curve (page points)
		const xTop = (lg(MU_LIQUID ** 2 / eta0) - Y[1]) / 2;
		check(near(g(xTop), Y[1], 1e-12), `${key}'s asymptote does not meet the top at ${xTop}`);
		const gap = (x) => P.Y(f(x)) - P.Y(g(x)) - (CURVE + ASYM) / 2;
		let xEnd = xTop;
		while (gap(xEnd) > AIR) xEnd += 1e-4;
		const a = graph(P, g, xTop, xEnd);
		check(longest(a) <= 0.2501, `${key}'s asymptote is coarse`);
		S.path(a, { color, width: ASYM, layer: 1.5, dash: ASYM_DASH, cap: 'butt', what: `${key}'s asymptote` });
	}

	// ---- the placeholder, dotted, from where it parts from the water's plateau to the right edge
	const fw = curve(WATER), yPh = lg(PLACEHOLDER);
	let xPh = X[0];
	while (P.Y(fw(xPh)) - P.Y(yPh) < CURVE / 2 + AIR + 0.3) xPh += 1e-4;
	check(xPh > 11 && xPh < 12.5, `the placeholder parts from the water at ${xPh}`);
	S.dots([P.X(xPh), P.Y(yPh)], [P.right, P.Y(yPh)], { color: DIM, layer: 1, what: 'the placeholder' });
	L.push(await placed('\\text{placeholder}', P.right + LABEL_GAP + 0.6, P.Y(yPh), 0, 0.5, DIM));

	// ---- the crossing
	const xX = lg(n.wX);
	check(near(xX, 10, 1e-12) && near(curve(HONEY)(xX), curve(WATER)(xX), 1e-12) && near(curve(HONEY)(xX), yPh, 1e-4), 'the crossing');
	const [cx, cy] = P.at(xX, curve(HONEY)(xX));
	S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${POINT}" fill="${DIM}"/>`, 3);
	S.mark([[cx, cy]], POINT, 'the crossing');

	// ---- at the peak, four powers of ten between the curves
	check(near(curve(WATER)(xp) - curve(HONEY)(xp), 4, 1e-3), 'the curves are not 10^4 apart at the peak');

	// ---- the axes
	const pow = (t) => `10^{${t}}`;
	const xl = await xAxis(S, P, { ticks: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], fmt: (t) => (t % 2 === 0 ? pow(t) : null), what: 'the omega axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await S.clear('\\omega\\ (\\mathrm{s^{-1}})', Math.max(last.box.r + 5, P.right + 1), (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	L.push(...(await yAxis(S, P, { ticks: [-14, -12, -10, -8, -6, -4, -2, 0, 2], fmt: (t) => ((t - 2) % 4 === 0 && t > -14 ? pow(t) : null), what: 'the eta axis' })));
	L.push(await S.clear('\\mathrm{Re}\\,\\eta\\ (\\mathrm{Pa\\,s})', P.left + 4.5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));
	L.push(await placed('\\text{glow, 293 K}', (band.l + band.r) / 2, P.top - LABEL_GAP - 0.4, 0.5, 1, DIM));

	// ---- the curves' names, under their plateaus; one asymptote's formula beside it
	for (const { key, eta0, color } of liquids) {
		const x = 5.2;
		L.push(await S.clear(`\\text{${key === 'water' ? 'Maxwell water' : key}}`, P.X(x), P.Y(lg(eta0)) + LABEL_GAP + 0.4, 0, 0, [0, 1], { color }));
	}
	{
		const g = asym(WATER), x = 10.7;
		L.push(await S.clear('\\mu_\\infty^2/\\eta_0\\omega^2', P.X(x) + 3, P.Y(g(x)), 0, 0.5, [1, 0], { color: ACCENT }));
	}

	// no label on the band
	for (const l of L) check(l.box.b <= band.t + 1e-9 || l.box.t >= band.b || l.box.r <= band.l || l.box.l >= band.r, `the label ${l.src} is on the band`);
	S.checkAll(L);
	window[name + '-numbers'] = { ...n, xPh };
	return finish(S, L, [240, 340]);
}
