// Shared numbers for the three diagrams of the tutorial's section 11.4 (tutorial/black-holes/under-tides.md):
// tut-tide-no-bulge, tut-friction-to-gamma and tut-hole-imchi. Not a figure itself. The sheet, strokes, labels and
// cropping are sections 1.2 to 11.2's (figs/tut-pot-lib.js), the plots and axes section 3.1's (figs/tut-prob-lib.js),
// the colour roles section 7.4's (figs/tut-linear-lib.js: matter's and the field's, read from app.css), the hole's
// fill section 11.1's (figs/tut-schw-lib.js), all imported, not copied.
//
// The colours: the tide's stretch and squeeze in the figures' orange and blue (section 1.4's tut-tides, 11.1's
// tut-schw-falling-pair: orange out along the line to the Moon, blue in across it), and nowhere else; the stone's reply
// in matter's colour; the wave's strain h in the field's, as the chapter colours it; everything else in ink and the
// page's greys. A reference law (Page's line, the friction law) is dashed in the page's dim grey and an asymptote dotted
// in it, as section 8.7's tut-qfd-factor draws its limits and as the chapter's interactive (TidalFriction.svelte) draws
// the same laws, neutral and dashed: orange and blue mean a stretch and a squeeze, and are not used for a law.
//
// Gamma_2: section 11.3's Regge-Wheeler table for degree two (app/src/lib/tutorial/live/hole-against-sky-data.ts, the
// row l = 2), read out below to six figures from x = 0.01 to 0.78, where it first holds Gamma_2 at 1, and read between
// its points as a power of x (a straight line on log-log axes), 1 above, exactly as the interactive's tidal-friction.ts
// (`gamma2`) reads it. `chapter(check)` fetches that data file as text and asserts that the numbers below are its own,
// so that the figures and the interactive draw the same curve. Below x = 0.01 tidal-friction.ts continues Gamma_2 as
// Page's form times 1 + ax + bx^2 through the table's first two points; the figures draw the computed curve on the table
// only, from x = 0.01, as the interactive does, so that every solid point is the solver's.
//
// `chapter(check)` asserts against the chapter's own text (outside its comments) every statement that a figure draws or
// its caption prints, and computes the numbers behind them:
//  - the static tide: H = r(r - r_s) solves Hinderer's equation (residual zero at many r), its far form r^2 - r_s r,
//    and the Earth's k_2 = 0.30, the reply being k_2 (R/r)^3 against the tide's (r/R)^2, k_2 times it at the surface;
//  - the chain: with an arbitrary hole and wave, (1/2) nu omega^6 h^2 over the flux c^3 omega^2 h^2 / 32 pi G is
//    16 pi G nu omega^4 / c^3, and that over 5 pi c^2 / omega^2 is (16/5) G nu omega^6 / c^5 = (256/225) x^6;
//  - Gamma_2 at x = 0.01: 1.217 x 10^-12, 1.070 times Page's form (the text's "1.070 times" and "about 1.2 x 10^-12");
//    the low-x continuation's a, near 2 pi, and its ratio 1.013 at x = 0.002 (the text's number);
//  - Im chi in units of M r_s^2 (GM/c^3)^2: 5 c^5 Gamma_2 / 16 G omega^5 is (5/64) Gamma_2 / x^5 and nu omega is
//    (4/45) x, both asserted in SI for an arbitrary mass and frequency; the peak of (5/64) Gamma_2 / x^5 at x = 0.39 on
//    the table; and that above x = 0.78 the curve is the asymptote (5/64)/x^5.
import { palette as rolePalette, MATTER, FIELD, G, C } from './tut-linear-lib.js';
import { HOLE } from './tut-schw-lib.js';

export { MATTER, FIELD, HOLE, G, C };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
export const palette = rolePalette;

// ---- Gamma_2, section 11.3's table (the row l = 2, x = 0.01 to 0.78) --------------------------------------------------
/** The table's x, 0.01 to 0.78 in hundredths. */
export const X = Array.from({ length: 78 }, (_, i) => +((i + 1) / 100).toFixed(2));
/** Gamma_2 at each X, six figures; the last, at 0.78, is the first the table holds at 1. */
export const GAMMA2 = [
	1.21721e-12, 8.40217e-11, 1.03999e-9, 6.39459e-9, 2.68744e-8, 8.89757e-8, 2.50294e-7, 6.25789e-7, 1.43144e-6,
	3.05512e-6, 6.16958e-6, 1.19096e-5, 2.21466e-5, 3.99079e-5, 7.00135e-5, 1.20029e-4, 2.01688e-4, 3.32986e-4,
	5.41255e-4, 8.67629e-4, 1.37349e-3, 2.14969e-3, 3.32954e-3, 5.107e-3, 7.76147e-3, 1.16908e-2, 1.74533e-2,
	2.58182e-2, 3.7818e-2, 5.47905e-2, 7.83808e-2, 0.110459, 0.152889, 0.20711, 0.273536, 0.350954, 0.436224, 0.524603,
	0.610715, 0.689793, 0.758626, 0.815852, 0.861677, 0.897309, 0.924406, 0.944678, 0.95967, 0.970667, 0.97869,
	0.984525, 0.98876, 0.991831, 0.994057, 0.995672, 0.996845, 0.997697, 0.998316, 0.998768, 0.999097, 0.999338,
	0.999514, 0.999643, 0.999738, 0.999807, 0.999858, 0.999896, 0.999923, 0.999943, 0.999958, 0.999969, 0.999977,
	0.999983, 0.999987, 0.999991, 0.999993, 0.999995, 0.999996, 1
];
export const TABLE_START = X[0], TABLE_ONE = X[X.length - 1];

/** Page's coefficient, (16/5)(16/45), and his limit, the friction law as a greybody factor. */
export const PAGE = 256 / 225;
export const page = (x) => PAGE * x ** 6;

/** Gamma_2 on the table, a power of x between its points, 1 above it (tidal-friction.ts's `gamma2` on x >= 0.01). */
export function gamma2(x) {
	if (x < TABLE_START - 1e-12) throw new Error(`Gamma_2 is drawn only on the table, not at ${x}`);
	if (x >= TABLE_ONE) return 1;
	let lo = 0, hi = X.length - 1;
	while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (X[mid] <= x) lo = mid; else hi = mid; }
	const t = Math.log(x / X[lo]) / Math.log(X[hi] / X[lo]);
	return Math.exp(Math.log(GAMMA2[lo]) + t * Math.log(GAMMA2[hi] / GAMMA2[lo]));
}

/** Im chi in units of M r_s^2 (GM/c^3)^2, (5/64) Gamma_2 / x^5; the friction law (4/45) x; the asymptote (5/64)/x^5. */
export const imChi = (x) => ((5 / 64) * gamma2(x)) / x ** 5;
export const law = (x) => (4 / 45) * x;
export const tail = (x) => 5 / 64 / x ** 5;

/** The peak of Im chi on the table (between its points Im chi is a power of x, so the peak is at one of them). */
export const PEAK = (() => {
	let best = { x: X[0], value: imChi(X[0]) };
	for (const x of X) if (imChi(x) > best.value) best = { x, value: imChi(x) };
	return best;
})();

/** tidal-friction.ts's continuation below the table: Page's form times 1 + ax + bx^2 through the first two points. */
export const LOW = (() => {
	const [x1, x2] = X, r1 = GAMMA2[0] / page(x1) - 1, r2 = GAMMA2[1] / page(x2) - 1, det = x1 * x2 ** 2 - x2 * x1 ** 2;
	return { a: (r1 * x2 ** 2 - r2 * x1 ** 2) / det, b: (x1 * r2 - x2 * r1) / det };
})();

// ---- the static tide, lengths in units of r_s (the hole) or R (the stone) ------------------------------------------------
/** The Earth's Love number, section 4.6's. */
export const K2 = 0.3;
/** The tide's part of the potential, (r/R)^2, and the stone's reply, k_2 (R/r)^3; the hole's whole H, r(r - r_s). */
export const tide = (r) => r * r;
export const reply = (r) => K2 / r ** 3;
export const holeH = (r) => r * (r - 1);
/** The residual of Hinderer's equation at r (r_s = 1), times r^2 (r - 1)^2, for H with its derivatives h1, h2. */
export const hinderer = (H, h1, h2, r) => r * r * (r - 1) ** 2 * h2(r) + r * (r - 1) * (2 * r - 1) * h1(r) - (6 * r * (r - 1) + 1) * H(r);
/** The drawn bulge: section 11.4's interactive (tidal-friction.ts, bulgeAxes): semi-axes 1 + k_2/2 and its root's
 * reciprocal, a prolate spheroid of the sphere's volume. */
export const BULGE = (() => { const a = 1 + 0.5 * K2; return { a, b: 1 / Math.sqrt(a) }; })();

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/black-holes/under-tides.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);

	// ---- the table is the interactive's: the data file's x and its row l = 2, number for number
	{
		const ts = await (await fetch('/app/src/lib/tutorial/live/hole-against-sky-data.ts')).text();
		const xs = ts.match(/export const X[^=]*=\s*\[([\s\S]*?)\]/)[1].split(',').map(Number);
		const row = ts.match(/\{\s*l: 2,\s*from: (\d+),\s*values: \[([\s\S]*?)\]/);
		check(row && +row[1] === 0, 'the row l = 2 does not start at the table\'s first x');
		const vs = row[2].split(',').map(Number);
		X.forEach((x, i) => check(xs[i] === x, `the table's x ${i}: ${xs[i]}, not ${x}`));
		GAMMA2.slice(0, -1).forEach((g, i) => check(vs[i] === g, `Gamma_2 at x = ${X[i]}: ${vs[i]}, not ${g}`));
		check(vs.length === GAMMA2.length - 1 && vs.at(-1) < 1, 'the row does not end below 1 just before x = 0.78 (the table then holds 1)');
	}
	for (let i = 1; i < X.length; i++) check(GAMMA2[i] > GAMMA2[i - 1] || GAMMA2[i] === 1, `Gamma_2 does not rise at ${X[i]}`);

	// ---- the static tide
	has('At the surface the first is $k_2$ times the second.', 'the reply at the surface');
	has('the Earth $0.30$', 'the Earth\'s Love number');
	has('and we write $H = r(r - r_s)$.', 'the solution');
	has('It has no part falling as $r^{-3}$.', 'the hole\'s missing reply');
	has('$$\\boxed{\\;k_2 = 0\\;} .$$', 'k_2 = 0');
	for (const r of [1.3, 2, 3.7, 8, 40]) check(Math.abs(hinderer(holeH, (q) => 2 * q - 1, () => 2, r)) < 1e-9 * r ** 4, `H = r(r - r_s) does not solve Hinderer's equation at ${r}`);
	// far away the equation is Laplace's for degree two, solved by r^2 and r^-3
	const laplace = (H, r, d = 1e-3) => (H(r + d) - 2 * H(r) + H(r - d)) / (d * d) + ((2 / r) * (H(r + d) - H(r - d))) / (2 * d) - (6 * H(r)) / (r * r);
	for (const r of [2, 5, 8]) check(Math.abs(laplace(tide, r)) < 1e-6 && Math.abs(laplace(reply, r)) < 1e-6, `r^2 and r^-3 do not solve Laplace's equation at ${r}`);
	check(near(reply(1) / tide(1), K2, 1e-15), 'the reply at the surface is not k_2 times the tide');
	check(near(BULGE.a * BULGE.b ** 2, 1, 1e-15) && near(BULGE.a, 1.15, 1e-15), 'the drawn bulge');

	// ---- the chain, in SI for an arbitrary hole and wave
	has('$$\\bar P = \\tfrac12\\,\\nu\\,\\omega^6\\field h^2 .$$', 'the power');
	has('so $F = c^3\\omega^2\\field h^2/32\\pi G$', 'the flux');
	has('$$\\boxed{\\;\\sigma_{\\rm abs} = \\frac{16\\pi G\\nu\\,\\omega^4}{c^3}\\;} .$$', 'the cross-section');
	has('With $\\sigma_{\\rm abs} = (5\\pi c^2/\\omega^2)\\Gamma_2$,', 'the degree two\'s area');
	has('&= \\frac{256}{225}\\Bigl(\\frac{G\\matter M\\omega}{c^3}\\Bigr)^6', 'Page\'s limit');
	has('$\\nu = \\tfrac{16}{45}G^5\\matter M^6/c^{13}$', 'nu');
	has('This is **Page\'s limit**', 'Page\'s limit\'s name');
	const M = 4.1e31, w = 270, h = 3e-21;
	const nu = ((16 / 45) * G ** 5 * M ** 6) / C ** 13, x = (G * M * w) / C ** 3;
	const P = 0.5 * nu * w ** 6 * h * h, F = (C ** 3 * w * w * h * h) / (32 * Math.PI * G), sigma = P / F;
	check(near(sigma / ((16 * Math.PI * G * nu * w ** 4) / C ** 3), 1, 1e-12), 'the cross-section is not P / F');
	check(near(sigma / ((5 * Math.PI * C * C) / (w * w)) / page(x), 1, 1e-12), 'Gamma_2 is not (256/225) x^6');
	check(near((16 / 5) * (16 / 45), PAGE, 1e-15), '256/225');

	// ---- Gamma_2 at the slow end
	has('its $\\Gamma_2$ is 1.013 times Page\'s form at $x = 0.002$ and 1.070 times at $x = 0.01$', 'the ratios');
	has('and the excess shrinks in proportion to $x$, as about $2\\pi x$', 'the excess');
	has('at $x = 0.01$ the hole absorbs about $1.2\\times10^{-12}$', 'Gamma_2 at 0.01');
	check((GAMMA2[0] / page(0.01)).toFixed(3) === '1.070' && (GAMMA2[0] / page(0.01)).toFixed(2) === '1.07', `the ratio at 0.01: ${GAMMA2[0] / page(0.01)}`);
	check(GAMMA2[0].toPrecision(2) === '1.2e-12', 'Gamma_2 at 0.01');
	check((1 + LOW.a * 0.002 + LOW.b * 0.002 ** 2).toFixed(3) === '1.013' && Math.abs(LOW.a / (2 * Math.PI) - 1) < 0.01, `the low end: ${LOW.a}, ${LOW.b}`);

	// ---- the response, in units of M r_s^2 (GM/c^3)^2, in SI for an arbitrary mass and frequency
	has('$$\\boxed{\\;\\mathrm{Im}\\,\\chi(\\omega) = \\frac{5c^5\\,\\Gamma_2(\\omega)}{16\\,G\\omega^5}\\;} ,$$', 'Im chi');
	has('$$\\boxed{\\;\\mathrm{Im}\\,\\chi = \\nu\\omega\\;} .$$', 'the friction law');
	has('$G\\matter M\\omega/c^3 \\approx 0.5$ it falls as $\\omega^{-5}$', 'the fall');
	{
		const rs = (2 * G * M) / (C * C), unit = M * rs * rs * ((G * M) / C ** 3) ** 2;
		for (const xx of [0.01, 0.05, 0.39, 1.7]) {
			const ww = (xx * C ** 3) / (G * M);
			const g = gamma2(xx);
			check(near(((5 * C ** 5 * g) / (16 * G * ww ** 5)) / unit / imChi(xx), 1, 1e-12), `(5/64) Gamma_2 / x^5 at ${xx}`);
			check(near((nu * ww) / unit / law(xx), 1, 1e-12), `(4/45) x at ${xx}`);
		}
	}
	check(PEAK.x.toFixed(2) === '0.39', `the peak at ${PEAK.x}`);
	check(imChi(PEAK.x - 0.01) < PEAK.value && imChi(PEAK.x + 0.01) < PEAK.value, 'the peak');
	for (const xx of [0.78, 1, 2, 3]) check(near(imChi(xx), tail(xx), 1e-15), `the curve is not the asymptote at ${xx}`);
	check(near(imChi(0.01) / law(0.01), GAMMA2[0] / page(0.01), 1e-12), 'Im chi over the law is Gamma_2 over Page');

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, state };
}
