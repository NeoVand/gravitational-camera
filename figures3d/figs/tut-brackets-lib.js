// Shared numbers for the three diagrams of the tutorial's section 13.4 (tutorial/what-a-field-keeps/flows-inside.md):
// tut-tides-in-turn, tut-flow-transverse and tut-shares-by-degree. Not a figure itself. The sheet, strokes, labels
// and cropping are sections 1.2 to 13.3's (figs/tut-pot-lib.js, and section 1.1's figs/tut-vec-lib.js for the
// drawing in 3D), the plots section 3.1's (figs/tut-prob-lib.js), matter's colour section 7.4's (figs/tut-linear-lib.js,
// asserted against app.css by `palette(check)`), the shares the paper's live figure's (app/src/lib/hair/flow.ts, whose
// formulas are restated here and asserted against the chapter), all imported or restated, not copied.
//
// The colours: the moments and the flow's transform carry matter's colour where their symbols are printed; every
// mark is ink, the page's greys or matter's colour. Orange and blue, which mean a stretch and a squeeze, are not used:
// the diagram comments' orange and blue for the two orders of the response become two stroke styles with direct labels
// in ink, and those for the inner ball's and the shell's shares become a grey and matter's colour.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the twelve parts of the margin note [^sim]: the masses, places and momenta below are those the chapter's own
//    check drew (numpy's default_rng(11): places with spread 0.5, momenta with spread 1, masses from 0.5 to 2),
//    written out to the last digit; springs of stiffness 0.7 between every two and the trap -0.3 m x. For
//    h = (x^2 - y^2)/2 + xyz and g = (x^3 - 3xy^2)/3 + 0.4 yz: the first-order rate S = sum m grad h . grad g = -5.80,
//    its rate of change dS/dt = sum p . [(Hess h) grad g + (Hess g) grad h], half of it 0.80, and the bracket
//    {dQ_h/dt, dQ_g/dt} = sum p . [(Hess h) grad g - (Hess g) grad h] = 5.323 (reference/gravcam/readings.py,
//    rate_bracket). The forces are linear, so the motion is exp(A t) applied to the state, summed here as its Taylor
//    series to the last digit; the exact responses, read with eps -> 0, give the difference over tau^2 5.043 at
//    tau = 0.02 and 5.268 at tau = 0.004, as the text prints;
//  - the shares: for the pair (x + iy)^n / n on a uniform sphere whose inner ball, out to a, turns at +Omega and the
//    rest at -Omega, the share of the radius r, per unit of r/R and in units of M Omega R^(2n-2), is
//    -c_n (2n + 1) Omega(r) r^(2n), with c_n = 2 (n - 1) <sin^(2n-2) theta> 3/(2n + 1) the rigid ball's value (4/5,
//    32/35, 32/35 for n = 2, 3, 4); the sum is c_n (1 - 2 a^(2n+1)): at a = 2^(-1/5) R, 0, +0.221 and +0.389; the
//    zeros 2^(-1/(2n+1)) = 0.871, 0.906, 0.926. The inner ball's shares are negative, the shell's positive.
import { palette, MATTER } from './tut-linear-lib.js';

export { MATTER };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the twelve parts ------------------------------------------------------------------------------------------------
/** Each part: [m, x, y, z, p_x, p_y, p_z]. */
export const PARTS = [
	[0.5269430534788342, 0.017096383626592083, 0.6798737701549808, 0.6123605392929662, 0.5446678079208929, 1.0428754765829538, -0.20695643620832396],
	[0.939462600518129, -0.25515353839383376, -0.14898475555322355, -0.2636920965167126, -0.8135155419815723, 0.3476505985155095, 0.24754574096284754],
	[1.5906676159728772, 0.28486317878598005, -0.028032219522808797, 0.37344280812827196, 1.0988127684144084, -1.284580778805345, -0.6616129303555477],
	[1.2397684265121753, -0.9236623994870548, 0.7832743873497603, -0.048216080077810274, -0.8381669607156745, -1.7340148462328515, 0.1264345551969962],
	[1.7793799916817916, 0.34018922663707307, -0.06828316698841387, -0.18954928353742664, 0.527804212495524, -0.7387900314758065, 1.3856470744961586],
	[0.8258169552822354, 0.23155507929879338, 0.4122567637650565, -0.10126493534672576, 0.8219243366604353, 0.6273764788355353, 0.4017070914409699],
	[0.9727741207151475, -0.07639308928509854, 0.342849305404629, -0.4351703209735856, 0.955669564448635, -1.3319798395431022, 0.6139296582498643],
	[0.8872112777818826, -0.7571917518656978, 0.197490931374765, -0.3352829118439397, 0.6027768335334479, -1.7677185771429749, 0.34703010205437973],
	[1.9674517059713255, -0.9601702950590143, -0.40702683197267975, -0.2337987794463735, -0.2504213467099684, 0.7815226960616993, -0.4390621876376686],
	[1.9115089919771524, -0.5966012387161306, -0.7462319420315169, 0.018318913472402543, -0.01824085764910033, 0.3428515173176555, -0.8762616887442077],
	[1.0110292637847635, 0.4486246283638738, -0.11656603898022842, -0.3717980147544224, 0.5985966481803844, -0.10496318852366823, 0.49248262367924284],
	[1.1540022553884965, 0.19249690437395414, 0.3586179035971919, -0.1500052992442387, -0.5218375063367878, 1.0862015432775176, 0.6052019784294742]
];
export const SPRING = 0.7, TRAP = 0.3;

// the two profiles, their gradients and Hessians
const hOf = ([x, y, z]) => 0.5 * (x * x - y * y) + x * y * z;
const gOf = ([x, y, z]) => (x ** 3 - 3 * x * y * y) / 3 + 0.4 * y * z;
const gradH = ([x, y, z]) => [x + y * z, -y + x * z, x * y];
const gradG = ([x, y, z]) => [x * x - y * y, -2 * x * y + 0.4 * z, 0.4 * y];
const hessH = ([x, y, z]) => [[1, z, y], [z, -1, x], [y, x, 0]];
const hessG = ([x, y]) => [[2 * x, -2 * y, 0], [-2 * y, -2 * x, 0.4], [0, 0.4, 0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const times = (T, v) => T.map((row) => dot(row, v));

/** The series' coefficients from the parts: S, dS/dt and the bracket. */
export function coefficients() {
	let S = 0, Sdot = 0, B = 0;
	for (const [m, ...s] of PARTS) {
		const x = s.slice(0, 3), p = s.slice(3);
		S += m * dot(gradH(x), gradG(x));
		const a = times(hessH(x), gradG(x)), b = times(hessG(x), gradH(x));
		Sdot += dot(p, a) + dot(p, b);
		B += dot(p, a) - dot(p, b);
	}
	return { S, Sdot, B };
}

/** The state (places, momenta: 12 x 3 each) after the time t: exp(A t) summed as its Taylor series. The forces on
 * each coordinate are F_a = -SPRING sum_b (x_a - x_b) - TRAP m_a x_a, linear, the same for x, y and z. */
function evolve(X, P, t) {
	const n = X.length;
	const deriv = ([x, p]) => {
		const sum = [0, 1, 2].map((i) => x.reduce((s, q) => s + q[i], 0));
		return [p.map((q, a) => q.map((v) => v / PARTS[a][0])),
			x.map((q, a) => q.map((v, i) => -SPRING * (n * v - sum[i]) - TRAP * PARTS[a][0] * v))];
	};
	let term = [X, P], out = [X.map((q) => [...q]), P.map((q) => [...q])];
	for (let k = 1; k < 60; k++) {
		const [dx, dp] = deriv(term);
		term = [dx.map((q) => q.map((v) => (v * t) / k)), dp.map((q) => q.map((v) => (v * t) / k))];
		let size = 0;
		for (let a = 0; a < n; a++) for (let i = 0; i < 3; i++) {
			out[0][a][i] += term[0][a][i]; out[1][a][i] += term[1][a][i];
			size = Math.max(size, Math.abs(term[0][a][i]), Math.abs(term[1][a][i]));
		}
		if (size < 1e-20) break;
	}
	return out;
}

/** The exact responses at tau, per unit of the kick's strength, read with eps -> 0: [kick g read h, kick h read g].
 * The kick changes only the momenta, by m grad f; the motion is linear, so the change of the places is the motion of
 * that change, and the reading changes by sum m grad (read) . (change of place). */
export function exact(tau) {
	const X = PARTS.map((q) => q.slice(1, 4)), P = PARTS.map((q) => q.slice(4, 7));
	const [Xt] = evolve(X, P, tau);
	const zero = X.map(() => [0, 0, 0]);
	const resp = (kick, read) => {
		const [dX] = evolve(zero, X.map((x, a) => kick(x).map((v) => PARTS[a][0] * v)), tau);
		return Xt.reduce((s, x, a) => s + PARTS[a][0] * dot(read(x), dX[a]), 0);
	};
	return [resp(gradG, gradH), resp(gradH, gradG)];
}
export { hOf, gOf };

// ---- the shares ------------------------------------------------------------------------------------------------------
export const HIDDEN = 2 ** (-1 / 5);                           // section 2.8's inner radius, in R
export const DEGREES = [2, 3, 4];
/** <sin^(2k) theta> over directions, 1.8's average: (2k)!! / (2k + 1)!!. */
export const sinAverage = (k) => { let s = 1; for (let j = 1; j <= k; j++) s *= (2 * j) / (2 * j + 1); return s; };
/** The rigid ball's bracket for the pair of degree n, in units of -M Omega R^(2n-2): 2 (n - 1) <sin^(2n-2)> 3/(2n + 1). */
export const rigid = (n) => 2 * (n - 1) * sinAverage(n - 1) * (3 / (2 * n + 1));
/** The share of the radius r (units of R) per unit of r/R, the inner ball out to a turning at +Omega: -rigid(n) (2n + 1)
 * Omega(r) r^(2n), as app/src/lib/hair/flow.ts's `share`. Its integral over r from 0 to 1 is the bracket. */
export const share = (n, r, a = HIDDEN) => -rigid(n) * (2 * n + 1) * (r < a ? 1 : -1) * r ** (2 * n);
/** The bracket (the sum of the shares) for the hidden swirl of inner radius a, in units of M Omega R^(2n-2). */
export const bracket = (n, a = HIDDEN) => rigid(n) * (1 - 2 * a ** (2 * n + 1));
/** Where the inner ball would have to end for the sum of degree n to vanish. */
export const zeroOf = (n) => 2 ** (-1 / (2 * n + 1));

/** Every number of the chapter that the three diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/flows-inside.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the twelve parts
	has(r`The profiles are $h = \tfrac12(x^2 - y^2) + xyz$ and $g = \tfrac13(x^3 - 3xy^2) + 0.4\,yz$. The parts have
		masses from 0.5 to 2, random places and momenta (spreads 0.5 and 1), a spring of stiffness 0.7 between every two,
		and a trap force $-0.3\,\matter m_a\vect x_a$`, 'the twelve parts');
	has(r`For twelve parts on springs in a trap, the difference over $\tau^2$ is 5.043 at $\tau = 0.02$ and 5.268
		at $\tau = 0.004$, against the bracket's 5.323.`, 'the twelve parts\' numbers');
	has(r`$$\boxed{\;\frac{\delta_g\matter{Q_h}}{\epsilon} = \tau\int\matter\rho\,\nabla g\cdot\nabla h\,\dd V + \tau^2\sum_a\vect p_a\cdot(\nabla\nabla h)\,\nabla g + O(\tau^3) .\;}$$`, 'the boxed series');
	has(r`so the symmetric part is $\tau$ times $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ taken halfway through the wait.`, 'the symmetric part');
	check(PARTS.length === 12 && PARTS.every(([m]) => m >= 0.5 && m <= 2), 'the parts\' masses');
	for (const [, ...s] of PARTS) {
		const x = s.slice(0, 3), e = 1e-6;
		for (let i = 0; i < 3; i++) {
			const u = x.map((v, j) => v + (j === i ? e : 0)), w = x.map((v, j) => v - (j === i ? e : 0));
			check(near((hOf(u) - hOf(w)) / (2 * e), gradH(x)[i], 1e-8) && near((gOf(u) - gOf(w)) / (2 * e), gradG(x)[i], 1e-8), 'a gradient');
			for (let j = 0; j < 3; j++) {
				const uj = x.map((v, k) => v + (k === j ? e : 0)), wj = x.map((v, k) => v - (k === j ? e : 0));
				check(near((gradH(uj)[i] - gradH(wj)[i]) / (2 * e), hessH(x)[i][j], 1e-8) && near((gradG(uj)[i] - gradG(wj)[i]) / (2 * e), hessG(x)[i][j], 1e-8), 'a Hessian');
			}
		}
	}
	const { S, Sdot, B } = coefficients();
	check(S.toFixed(2) === '-5.80' && (Sdot / 2).toFixed(2) === '0.80' && B.toFixed(3) === '5.323', `the coefficients ${S}, ${Sdot / 2}, ${B}`);
	for (const [tau, printed] of [[0.02, '5.043'], [0.004, '5.268']]) {
		const [a, b] = exact(tau);
		check(((a - b) / tau ** 2).toFixed(3) === printed, `the difference over tau^2 at ${tau}: ${(a - b) / tau ** 2}`);
	}
	// the exact responses leave the series at the third order: the remainder is eight times larger at twice the wait
	{
		const rest = (tau) => { const [a, b] = exact(tau); return [a - (tau * S + tau * tau * (Sdot + B) / 2), b - (tau * S + tau * tau * (Sdot - B) / 2)]; };
		const [r1, r2] = [rest(1e-3), rest(2e-3)];
		check([0, 1].every((k) => Math.abs(r2[k] / r1[k] - 8) < 0.05), `the remainder is not of the third order: ${r1}, ${r2}`);
	}

	// ---- the transform's two parts
	has(r`The bracket gives the component of $\matter{\tilde{\vect J}}$ along $\vect\eta$, and
		$\vect\eta$ may be any vector at right angles to $\vect\xi$ and as long. Turning it a right angle about $\vect\xi$
		gives a second component, and the two make the **transverse part** of the transform`, 'the transverse part');
	has(r`The part along $\vect\xi$, the **longitudinal part**, comes from the continuity equation of
		section 2.8`, 'the longitudinal part');
	has(r`$$\frac{\dd\matter{\tilde\rho}}{\dd t} = i\vect\xi\cdot\matter{\tilde{\vect J}}(\vect\xi)`, 'the rate of the density');
	has(r`h_\pm = e^{\vect\zeta_\pm\cdot\vect x} ,$$`, 'the pair');

	// ---- the shares
	has(r`Its inner ball, out to 0.871 of the radius, turns one way`, 'the inner radius');
	has(r`Let a uniform sphere's inner ball, out to the radius $a$, turn at $+\Omega$ and the rest at
		$-\Omega$.`, 'the sign of the swirl');
	has(r`So the layer's **share** of the bracket goes as
		$\matter\rho\,\Omega(r)\,r^{2n}\,\dd r$`, 'the share');
	has(r`$$\boxed{\;\{\matter{\dot Q_h}, \matter{\dot Q_g}\} = -2(n - 1)\int\matter\rho\,\Omega(r)\,\varpi^{2n-2}\,\dd V .\;}$$`, 'the sign of the bracket');
	has(r`$$\boxed{\;a = 2^{-1/7}R = 0.906\,R ,\;}$$`, 'the octupolar zero');
	has(r`The pair of degree four gives $\tfrac{32}{35}(1 - 2^{-4/5}) = 0.389\,\matter M\Omega R^6$ on the hidden
		swirl`, 'the sum of degree four');
	has(r`For $n = 2$ the factor is $2a^5/R^5 - 1$, zero at the same radius, so the two areas of panel (b) are
		equal.`, 'the sum of degree two');
	has(r`At the radius $a = 2^{-1/5}R$ of section 2.8, where $\vect L = 0$, the factor $2a^7/R^7$ is $2^{-2/5}$`, 'the octupolar sum');
	check(near(bracket(3), (32 / 35) * (1 - 2 ** (-2 / 5)), 1e-15) && near(bracket(4), (32 / 35) * (1 - 2 ** (-4 / 5)), 1e-15), 'the sums\' closed forms');
	check(near(HIDDEN, 0.8705505632961241, 1e-15) && HIDDEN.toFixed(3) === '0.871', 'the inner radius');
	check(near(rigid(2), 4 / 5) && near(rigid(3), 32 / 35) && near(rigid(4), 32 / 35), 'the rigid values');
	check(near(sinAverage(2), 8 / 15) && near(sinAverage(3), 16 / 35), 'the averages over directions');
	// the shares integrate to the sums (five-point Gauss-Legendre on each part, exact for polynomials of degree 9)
	const GL = [[0, 0.5688888888888889], [0.5384693101056831, 0.4786286704993665], [-0.5384693101056831, 0.4786286704993665],
		[0.906179845938664, 0.2369268850561891], [-0.906179845938664, 0.2369268850561891]];
	const integral = (f, a, b) => GL.reduce((s, [x, w]) => s + w * f((a + b) / 2 + ((b - a) / 2) * x), 0) * (b - a) / 2;
	for (const n of DEGREES) {
		const total = integral((q) => share(n, q), 0, HIDDEN * (1 - 1e-15)) + integral((q) => share(n, q), HIDDEN, 1);
		check(near(total, bracket(n), 1e-12), `the shares of degree ${n} do not add up to the sum`);
		check(near(bracket(n, zeroOf(n)), 0, 1e-15), `the zero of degree ${n}`);
	}
	check(Math.abs(bracket(2)) < 1e-15 && bracket(3).toFixed(3) === '0.221' && bracket(4).toFixed(3) === '0.389', 'the sums');
	check(DEGREES.map((n) => zeroOf(n).toFixed(3)).join() === '0.871,0.906,0.926', 'the zeros');
	check(share(3, 0.5) < 0 && share(3, 0.95) > 0, 'the inner ball\'s shares are not negative');

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
	return { md, flat, has, state, S, Sdot, B };
}
