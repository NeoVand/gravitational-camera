// Shared numbers for the four diagrams of the tutorial's chapter 13.2 (tutorial/what-a-field-keeps/calderon.md):
// tut-calderon-pair, tut-sixteen-weighings, tut-cone-ellipse and tut-detail-cost. Not a figure itself. The sheet,
// strokes, labels and cropping are chapters 1.2 to 13.1's (figs/tut-pot-lib.js), the plots and axes chapter 3.1's
// (figs/tut-prob-lib.js), matter's colour chapter 7.4's (figs/tut-linear-lib.js, asserted against app.css by
// `palette(check)`), all imported, not copied.
//
// The colours: the density rho, where a label names it, in matter's colour; everything else in ink and the page's
// greys, and the inside of the cone in the page's neutral tint. Orange and blue, which mean a stretch and a squeeze,
// are not used. The paper's fig:two-readings draws the cone's outline in its blue (a reading at one time) and the
// inside in its orange (readings at two times); in the tutorial those two colours are kept for stretch and squeeze, so
// tut-cone-ellipse draws the same two things in ink and a grey shade.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the pair: zeta_+- = (i xi +- eta)/2 with xi . eta = 0 and |eta| = |xi|; zeta . zeta = 0 for each, zeta_+ . zeta_-
//    = -|xi|^2/2 and zeta_+ + zeta_- = i xi, checked for the text's xi = (2, 1, -0.5) m^-1 (5.25 and -2.625 m^-2) with a
//    built eta; |h_+-| = e^{+- eta.x/2} spans e^{-|xi|R/2} to e^{|xi|R/2} across the disc; the drawing's |xi| R = 6, so
//    the crests 2 pi/|xi| apart are 1.047 R apart, and the product |h_+||h_-| is 1 everywhere;
//  - the tree: 1 complex component, 2 parts, 4 real integrals, 8 squares, 16 weighings, 4 x 2 x 2 = 16; the expansion
//    of grad h_+ . grad h_- into the four real integrals, and the polarization identity, checked on random vectors;
//  - the ellipse: k = (1.3, 0.4), k' = (-0.2, 0.9) m^-1, K = k + k' = (1.1, 1.3), |K| = 1.70, kappa = |k| + |k'| =
//    2.28, the semi-axes kappa/2 = 1.141 and sqrt(kappa^2 - K^2)/2 = 0.760, the factor (kappa^2 - K^2)/2 = 1.154 =
//    |k||k'| - k.k'; every point of the drawn ellipse has |k| + |K - k| = kappa;
//  - the cost: e^{|xi|R} with |xi| = 2 pi / d and R = 0.5 m: 6.6 x 10^6, 4.4 x 10^13 and 1.9 x 10^27 at d = 20, 10 and
//    5 cm; the curve meets the clocks' 10^18 at d = 7.6 cm ("about 8 cm"); squaring the first span gives the second.
import { palette, MATTER } from './tut-linear-lib.js';

export { MATTER };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a));

// ---- the pair -----------------------------------------------------------------------------------------------------
export const XI_R = 6;                                      // |xi| R, for the drawing
export const CREST = (2 * Math.PI) / XI_R;                  // the crests' spacing, in R
/** log |h_+-| at the point s R along eta (s from -1 to 1 across the disc): +- (|eta| R/2) s. */
export const logH = (sign, s) => (sign * XI_R * s) / 2;

/** Complex arithmetic on [re, im] pairs, for the null vectors. */
const cmul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const cdot = (u, v) => u.reduce((s, z, i) => { const p = cmul(z, v[i]); return [s[0] + p[0], s[1] + p[1]]; }, [0, 0]);
/** zeta_+- = (i xi +- eta)/2 as three complex components. */
export const zeta = (xi, eta, sign) => xi.map((x, i) => [(sign * eta[i]) / 2, x / 2]);

// ---- the tree -----------------------------------------------------------------------------------------------------
/** The four real integrals, under the real part and the imaginary part, as pairs (a, b) of the real profiles. */
export const INTEGRALS = [
	{ part: 're', a: 'u_+', b: 'u_-' },
	{ part: 're', a: 'v_+', b: 'v_-' },
	{ part: 'im', a: 'u_+', b: 'v_-' },
	{ part: 'im', a: 'v_+', b: 'u_-' }
];
export const COUNTS = [1, 2, 4, 8, 16];

// ---- the ellipse --------------------------------------------------------------------------------------------------
export const k1 = [1.3, 0.4], k1p = [-0.2, 0.9];             // m^-1
export const KV = [k1[0] + k1p[0], k1[1] + k1p[1]];
export const KMOD = norm(KV);
export const KAPPA = norm(k1) + norm(k1p);
export const SEMI_MAJOR = KAPPA / 2;
export const SEMI_MINOR = Math.sqrt(KAPPA * KAPPA - KMOD * KMOD) / 2;
export const FACTOR = (KAPPA * KAPPA - KMOD * KMOD) / 2;
/** The point of the ellipse at the parameter t: K/2 + a cos t u + b sin t v, u along K and v a quarter turn from it. */
export const U = [KV[0] / KMOD, KV[1] / KMOD], V = [-U[1], U[0]];
export const onEllipse = (t) => [KV[0] / 2 + SEMI_MAJOR * Math.cos(t) * U[0] + SEMI_MINOR * Math.sin(t) * V[0],
	KV[1] / 2 + SEMI_MAJOR * Math.cos(t) * U[1] + SEMI_MINOR * Math.sin(t) * V[1]];
/** The parameter of the text's k on the ellipse. */
export const T1 = (() => {
	const d = [k1[0] - KV[0] / 2, k1[1] - KV[1] / 2];
	return Math.atan2(dot(d, V) / SEMI_MINOR, dot(d, U) / SEMI_MAJOR);
})();
/** The second (pale) pair: a point on the other side of K, clear of both axes in the drawing. */
export const T2 = 2.2;

// ---- the cost -----------------------------------------------------------------------------------------------------
export const BALL_R = 0.5;                                   // m
export const CLOCKS = 1e18;
/** log10 of the span e^{|xi| R} for the detail d (m): 2 pi R / (d ln 10). */
export const log10Span = (d) => (2 * Math.PI * BALL_R) / (d * Math.LN10);
export const DETAILS = [0.2, 0.1, 0.05];                     // m
/** A number as the chapter prints it, a.b x 10^n, in TeX. */
export const sci = (log10) => { const e = Math.floor(log10 + 1e-12); return [(10 ** (log10 - e)).toFixed(1), e]; };
/** The detail at which the span reaches the clocks' 10^18. */
export const CLOCK_DETAIL = (2 * Math.PI * BALL_R) / (Math.log10(CLOCKS) * Math.LN10);

/** Every number of the chapter that the four diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/calderon.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the pair
	has(r`the ripple's crests are $2\pi/|\vect\xi|$ apart`, 'the crests\' spacing');
	has(r`$$\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12\,(i\vect\xi \pm \vect\eta), \qquad h_\pm = e^{\vect\zeta_\pm\cdot\vect x} .$$`, 'the pair');
	has(r`at right angles to $\vect\xi$ and as long`, 'eta at right angles and as long');
	has(r`because of them $h_+$ grows along $\vect\eta$ and $h_-$ along $-\vect\eta$`, 'the growths');
	has(r`$$|h_\pm| = e^{\pm\vect\eta\cdot\vect x/2} .$$`, 'the moduli');
	has(r`so each profile grows to $\boxed{\,|h_\pm| \le e^{|\vect\xi|R/2}\,}$, and from one side of the body to the other it
		spans the factor $e^{|\vect\xi|R}$. Their product is a ripple of modulus one.`, 'the spans');
	has(r`$\vect\xi = (2, 1, -0.5)\unit{m^{-1}}$. Then $|\vect\xi|^2 = 5.25\unit{m^{-2}}$ and $\vect\zeta_+\cdot\vect\zeta_- = -2.625\unit{m^{-2}}$`, 'the number');
	{
		const xi = [2, 1, -0.5];
		// eta: at right angles to xi and as long, built from xi x (0, 0, 1)
		const c = [xi[1], -xi[0], 0], eta = c.map((x) => (x * norm(xi)) / norm(c));
		check(near(dot(xi, eta), 0) && near(norm(eta), norm(xi)), 'eta');
		const zp = zeta(xi, eta, 1), zm = zeta(xi, eta, -1);
		for (const z of [zp, zm]) { const s = cdot(z, z); check(near(s[0], 0) && near(s[1], 0), 'a zeta is not null'); }
		const pm = cdot(zp, zm);
		check(near(dot(xi, xi), 5.25) && near(pm[0], -2.625) && near(pm[1], 0), `zeta+.zeta- = ${pm}`);
		zp.forEach((z, i) => check(near(z[0] + zm[i][0], 0) && near(z[1] + zm[i][1], xi[i]), 'zeta+ + zeta- is not i xi'));
	}
	check(near(logH(1, 1), XI_R / 2) && near(logH(1, -1), -XI_R / 2) && near(logH(1, 0.37) + logH(-1, 0.37), 0), 'the ramps');
	check(CREST.toFixed(3) === '1.047', `the crests' spacing ${CREST}`);

	// ---- the tree
	has(r`$$\nabla h_+\cdot\nabla h_- = \bigl(\nabla u_+\cdot\nabla u_- - \nabla v_+\cdot\nabla v_-\bigr) + i\,\bigl(\nabla u_+\cdot\nabla v_- + \nabla v_+\cdot\nabla u_-\bigr) .$$`, 'the four integrals');
	has(r`$$\int\matter\rho\,\nabla a\cdot\nabla b\,\dd V = \tfrac14\bigl[A(a + b) - A(a - b)\bigr], \qquad A(f) = \int\matter\rho\,|\nabla f|^2\,\dd V .$$`, 'the polarization identity');
	has(r`$$A(f) = \frac{E_+ + E_-}{\epsilon^2} .$$`, 'the square from two weighings');
	has(r`$$\boxed{\;4 \times 2 \times 2 = 16\ \text{weighings for one complex Fourier component,}\;}$$`, 'the sixteen');
	check(COUNTS.every((n, i) => n === 2 ** i) && INTEGRALS.length === 4 && 4 * 2 * 2 === COUNTS[4], 'the counts');
	{
		// the expansion and the identity on random gradients
		let seed = 11;
		const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
		for (let n = 0; n < 50; n++) {
			const g = () => [rnd(), rnd(), rnd()];
			const up = g(), vp = g(), um = g(), vm = g();
			const hp = up.map((x, i) => [x, vp[i]]), hm = um.map((x, i) => [x, vm[i]]);
			const p = cdot(hp, hm);
			const re = dot(up, um) - dot(vp, vm), im = dot(up, vm) + dot(vp, um);
			check(near(p[0], re, 1e-12) && near(p[1], im, 1e-12), 'the expansion');
			const sq = (f) => dot(f, f);
			const pol = (a, b) => (sq(a.map((x, i) => x + b[i])) - sq(a.map((x, i) => x - b[i]))) / 4;
			check(near(pol(up, um), dot(up, um), 1e-12) && near(pol(vp, um), dot(vp, um), 1e-12), 'the polarization identity');
		}
	}

	// ---- the ellipse
	has(r`For $\vect k = (1.3, 0.4)$ and $\vect k' = (-0.2, 0.9)\unit{m^{-1}}$, $K = 1.70$ and $\kappa = 2.28\unit{m^{-1}}$, and the
		factor is $1.154\unit{m^{-2}}$ by either side.`, 'the pair of the check');
	has(r`$$|\vect k| + |\vect K - \vect k| = \kappa .$$`, 'the ellipse');
	has(r`$$\text{semi-major axis} = \frac\kappa2, \qquad \text{semi-minor axis} = \tfrac12\sqrt{\kappa^2 - K^2} .$$`, 'the semi-axes');
	has(r`On the cone the semi-minor axis is zero, and the ellipse shrinks to the segment from $0$ to $\vect K$`, 'the segment');
	has(r`For the pair of the last section the semi-axes are 1.14 and $0.760\unit{m^{-1}}$, so the long axis is 1.5 times the short one.`, 'the semi-axes\' values');
	has(r`In the space of $(\vect K, \kappa)$ the surface $\kappa = K$ is a cone, which we call **the cone** of the scene transform.`, 'the cone');
	check(near(KV[0], 1.1, 1e-15) && near(KV[1], 1.3, 1e-15), `K = ${KV}`);
	check(KMOD.toFixed(2) === '1.70' && KAPPA.toFixed(2) === '2.28' && FACTOR.toFixed(3) === '1.154', `K, kappa, factor: ${KMOD} ${KAPPA} ${FACTOR}`);
	check(near(FACTOR, norm(k1) * norm(k1p) - dot(k1, k1p), 1e-12), 'the factor by either side');
	check(SEMI_MAJOR.toFixed(3) === '1.141' && SEMI_MINOR.toFixed(3) === '0.760' && SEMI_MAJOR.toFixed(2) === '1.14', `the semi-axes ${SEMI_MAJOR} ${SEMI_MINOR}`);
	check((SEMI_MAJOR / SEMI_MINOR).toFixed(1) === '1.5', 'the ratio of the axes');
	for (let i = 0; i < 360; i++) {
		const p = onEllipse((i * Math.PI) / 180);
		check(near(norm(p) + norm([KV[0] - p[0], KV[1] - p[1]]), KAPPA, 1e-12), 'a point of the ellipse');
	}
	{
		const p = onEllipse(T1);
		check(near(p[0], k1[0], 1e-12) && near(p[1], k1[1], 1e-12), 'the text\'s k is not at T1');
		const q = onEllipse(T2);
		check(q[0] < -0.3 && q[1] > 0.45 && dot(q, V) > 0, `the pale pair ${q} is not on the other side, clear of the axes`);
	}

	// ---- the cost
	has(r`For the steel ball one metre across, of chapter 13.1, $R = 0.5\unit m$. Detail of 20 cm, 10 cm and 5 cm needs spans of
		$6.6 \times 10^6$, $4.4 \times 10^{13}$ and $1.9 \times 10^{27}$`, 'the spans');
	has(r`The best clocks compare frequencies to about one part in $10^{18}$, so detail finer than about 8 cm is out of reach`, 'the clocks');
	has(r`A check is in the numbers, since $6.6 \times 10^6$ squared is $4.4 \times 10^{13}$: squaring the precision halves the
		finest detail, from 20 to 10 cm.`, 'the squaring');
	has(r`We estimate the precision that a detail of size $2\pi/|\vect\xi|$ needs.`, 'the detail');
	const spans = DETAILS.map((d) => sci(log10Span(d)));
	check(spans.map(([m, e]) => `${m}e${e}`).join() === '6.6e6,4.4e13,1.9e27', `the spans ${spans}`);
	check(near(log10Span(0.1), 2 * log10Span(0.2), 1e-12), 'halving the detail does not square the span');
	check(Math.round(CLOCK_DETAIL * 100) === 8 && CLOCK_DETAIL.toFixed(4) === '0.0758', `the clocks' detail ${CLOCK_DETAIL}`);
	check((10 ** (log10Span(0.1) - 13)).toFixed(1) === '4.4' && near(log10Span(0.1) * Math.LN10, 31.4159, 1e-4), 'e^31.4');

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
	return { md, flat, has, state };
}
