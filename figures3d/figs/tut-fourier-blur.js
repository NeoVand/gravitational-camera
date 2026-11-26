// The tutorial, section 2.6 (tutorial/outside/fourier.md), a blur multiplies each ripple by a number. Top, three rows
// on one x axis: a pattern f made of a coarse ripple and a fine one of equal size, (cos k1 x + cos k2 x) / 2 with
// k2 = 4 k1; the kernel g, a Gaussian of width eps, drawn at three places along it; and the blurred pattern g * f, in
// which the coarse ripple keeps e^{-eps^2 k1^2 / 2} = 0.88 of its size and the fine one e^{-eps^2 k2^2 / 2} = 0.14.
// Bottom, the same in wavenumber (k > 0): the pattern's two spikes at k1 and k2, of equal weight, drawn pale and
// reaching the height 1; the kernel's transform e^{-eps^2 k^2 / 2}, a curve from 1 at k = 0; and the products, drawn
// in full over the spikes, whose tips lie on the curve.
// Exact: the ripples, the width of the kernel (eps k1 = 0.5, eps k2 = 2), the blurred pattern (the formula, asserted
// against a numerical convolution at many points), the curve and the products (asserted on the curve); every curve
// sampled every quarter of a point along its length. Schematic: the kernel's height on the page (its area is 1) and
// the scales of the two axes.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, PATTERN, RIPPLE, KERNEL, CURVE, DIM } from './tut-fourier-lib.js';

const PALE_BLUE = '#dce7f3';           // the kernel's fill (drawing.ts, THEME: a pale tint of the second accent)

const name = 'tut-fourier-blur';
const check = checker(name);

// ---- the mathematics: x in units of the coarse wavelength --------------------------------------------------------
export const K1 = 2 * Math.PI, K2 = 4 * K1;
export const EPS = 0.5 / K1;
export const keep = (k) => Math.exp(-(EPS * EPS * k * k) / 2);
export const pattern = (x) => (Math.cos(K1 * x) + Math.cos(K2 * x)) / 2;
export const kernel = (x) => Math.exp(-(x * x) / (2 * EPS * EPS)) / (Math.sqrt(2 * Math.PI) * EPS);
export const blurred = (x) => (keep(K1) * Math.cos(K1 * x) + keep(K2) * Math.cos(K2 * x)) / 2;
export const PLACES = [0.3, 0.9, 1.5];   // where the kernel is drawn

function mathematics() {
	check(keep(K1).toFixed(2) === '0.88' && keep(K2).toFixed(2) === '0.14', `the factors ${keep(K1)}, ${keep(K2)}`);
	check(near(EPS * K2, 2, 1e-12), 'eps k2');
	// the blur, done as the integral (g * f)(x) = int g(x - x') f(x') dx' by Simpson's rule over eight widths each side
	for (let i = 0; i <= 40; i++) {
		const x = i * 0.05, m = 4000, a = x - 8 * EPS, h = (16 * EPS) / m;
		let s = 0;
		for (let j = 0; j <= m; j++) s += (j === 0 || j === m ? 1 : j % 2 ? 4 : 2) * kernel(x - (a + j * h)) * pattern(a + j * h);
		check(near((s * h) / 3, blurred(x), 1e-9), `the blur at x = ${x}: ${(s * h) / 3} against ${blurred(x)}`);
	}
	return { coarse: keep(K1), fine: keep(K2) };
}

// ---- the drawing (points) -------------------------------------------------------------------------------------
const W = 232;                           // the x axis: two coarse wavelengths
const U = 14;                            // points per unit of the pattern
const GH = 17;                          // the kernel's height on the page
const SEP = 9;                           // between the rows
const KW = 232, KH = 52;                 // the wavenumber panel
const KMAX = 6.2 * K1;
const DROP = 22;                         // from the top panel's last row to the wavenumber panel's top

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - W / 2;
	let y = ORIGIN - 110;
	const row = (h) => { const top = y; y += h + SEP; return top; };
	const Pf = new Plot({ left, top: row(2 * U), w: W, h: 2 * U, x0: 0, x1: 2, y0: -1, y1: 1 });
	const Pg = new Plot({ left, top: row(GH), w: W, h: GH, x0: 0, x1: 2, y0: 0, y1: kernel(0) });
	const Pb = new Plot({ left, top: row(2 * U), w: W, h: 2 * U, x0: 0, x1: 2, y0: -1, y1: 1 });
	const zero = (P, what) => S.path([[P.left, P.Y(0)], [P.right, P.Y(0)]], { color: DIM, width: 0.3, layer: 0.5, cap: 'butt', dash: [1.2, 1.6], what });

	// ---- the pattern and the blurred pattern
	for (const [P, f, what] of [[Pf, pattern, 'the pattern'], [Pb, blurred, 'the blurred pattern']]) {
		zero(P, `${what}'s zero`);
		const pts = graph(P, f, 0, 2);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		S.path(pts, { color: PATTERN, width: CURVE, layer: 2, what });
	}
	// ---- the kernel at three places, on its own base line
	S.path([[Pg.left, Pg.bottom], [Pg.right, Pg.bottom]], { color: DIM, width: 0.3, layer: 0.5, cap: 'butt', dash: [1.2, 1.6], what: 'the kernel\'s base' });
	const clear = merge(Pg, CURVE);
	const reach = EPS * Math.sqrt(2 * Math.log(kernel(0) / clear));      // where the bump meets its base line
	for (const c of PLACES) {
		const pts = graph(Pg, (x) => kernel(x - c), c - reach, c + reach);
		check(longest(pts) <= 0.2501, 'the kernel has a coarse step');
		S.raw(`<path d="M${pts.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join('L')}Z" fill="${PALE_BLUE}"/>`, 1);
		S.path(pts, { color: KERNEL, width: CURVE, layer: 2, what: `the kernel at ${c}` });
	}
	// ---- the rows' names
	for (const [P, s, color] of [[Pf, 'f', PATTERN], [Pg, 'g', KERNEL], [Pb, 'g * f', PATTERN]]) {
		L.push(await placed(s, P.left - 6, P.Y(P === Pg ? 0.5 * kernel(0) : 0), 1, 0.5, color));
	}
	L.push(await placed('x', Pb.right + 4, Pb.Y(0), 0, 0.5, DIM));

	// ---- the same in wavenumber
	const K = new Plot({ left, top: Pb.bottom + DROP, w: KW, h: KH, x0: 0, x1: KMAX, y0: 0, y1: 1.12 });
	const kc = merge(K, CURVE);
	const kend = Math.min(KMAX, Math.sqrt((2 * Math.log(1 / kc)) / (EPS * EPS)));
	const curve = graph(K, keep, 0, kend);
	check(longest(curve) <= 0.2501, 'the kernel\'s transform has a coarse step');
	S.path(curve, { color: KERNEL, width: CURVE, layer: 1.8, what: 'the kernel\'s transform' });
	for (const k of [K1, K2]) {
		// the pattern's spike, pale, to the height 1; the product over it, to the curve
		S.raw(`<g opacity="0.4">`, 2);
		S.arrow([K.X(k), K.bottom - 0.2], [K.X(k), K.Y(1)], { color: RIPPLE, width: CURVE, layer: 2, what: `the spike at ${k}` });
		S.raw(`</g>`, 2);
		const top = K.Y(keep(k));
		// the spike's weight is 1 on this scale, so the product's tip is the curve's value at k
		check(near(K.Y(1 * keep(k)), K.at(k, keep(k))[1], 1e-12), 'the product is not on the curve');
		S.arrow([K.X(k), K.bottom - 0.2], [K.X(k), top], { color: RIPPLE, width: CURVE, layer: 2.2, what: `the product at ${k}` });
	}
	L.push(...(await xAxis(S, K, { ticks: [0, K1, K2], fmt: (t) => (t ? (t === K1 ? 'k_1' : 'k_2') : '0'), what: 'the k axis' })));
	L.push(...(await yAxis(S, K, { ticks: [0, 1], fmt: String, what: 'the vertical axis' })));
	L.push(await placed('k', K.right + 4, K.bottom + 2.5 + 2.4 + 3.2, 0, 0.5, DIM));
	// the names: the spikes at the pale tip, the curve beside its fall, the products at the fine one's tip
	L.push(await placed('\\tilde f', K.X(K2) + LABEL_GAP + 2, K.Y(1), 0, 0.5, RIPPLE));
	const kg = 2.6 * K1;
	L.push(await S.clear('\\tilde g', K.X(kg) + 1, K.Y(keep(kg)), 0, 1, [0.6, -0.8], { color: KERNEL }));
	L.push(await placed('\\tilde g\\,\\tilde f', K.X(K1) + LABEL_GAP + 2, K.Y(0.45), 0, 0.5, RIPPLE));

	S.checkAll(L);
	window.tutFourierBlur = nums;
	return finish(S, L, [240, 340]);
}
