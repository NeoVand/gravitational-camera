// Shared numbers for the three diagrams of the tutorial's chapter 13.6 (tutorial/what-a-field-keeps/algebra-of-moments.md):
// tut-bracket-response, tut-moment-algebra and tut-analytic-pulse. Not a figure itself. The sheet, strokes, labels and
// cropping are chapters 1.2 to 13.4's (figs/tut-pot-lib.js), the plots chapter 3.1's (figs/tut-prob-lib.js), matter's
// and the observer's colours chapter 6.1's (figs/tut-lorentz-lib.js, asserted against app.css by `palette(check)`), the
// steel of the tops the paper's (stone.js), all imported, not copied.
//
// The colours: orange and blue mean a stretch and a squeeze in the tutorial's figures and are not used here. The
// diagram comments' orange and blue (the two tops' changes of L_y, the bands of the table, the Taylor series) become
// neutral ink, stroke styles, matter's colour where a quantity of matter is meant, and direct labels.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the tops: L = (1, 2, 0.5) and (1, 2, -3) J s; a turn by eps about x takes (y, z) to (y cos eps - z sin eps,
//    y sin eps + z cos eps), whose first order is the text's (y - eps z, z + eps y); at eps = 0.01 the first order gives
//    the text's L_y = 1.995 and 2.030 J s, and delta L_y / eps = -L_z = -0.5 and +3 J s per radian; the exact turn by
//    the drawn 0.1 rad gives L_y = 1.940 and 2.290 (delta L_y = -0.060 and +0.290 J s);
//  - the brackets, in the order of the chapter's [^order] footnote, {F, G} = sum (dF/dx . dG/dp - dF/dp . dG/dx), each
//    checked here by finite differences on a few parts (masses, places, momenta) with springs between them: {Q_h, Q_g} = 0
//    (Newton's moments), {Q_h, Qdot_g} = sum m grad h . grad g, {Qdot_h, Qdot_g} = sum p . [(Hess h) grad g -
//    (Hess g) grad h], {Q_h, H} = Qdot_h, {Qdot_h, H} = Qddot_h, {H, H} = 0, and for the moments of the energy
//    {Q_h, Q_g} = (1/c^2) sum p . (g grad h - h grad g); every bracket below the diagonal is minus its mirror's,
//    {B, A} = -{A, B}; the paper's equations (paper/sections/11a-hair.tex) asserted to read as the cells print them;
//  - the pulse: e^{-1/t^2} is 0.018 at t = 0.5 and 0.37 at t = 1 (the text's A(1) = e^{-1} = 0.37), and its first
//    derivatives the text's (2/t^3) e^{-1/t^2} and (4/t^6 - 6/t^4) e^{-1/t^2}.
import { palette, OBS, MATTER } from './tut-lorentz-lib.js';

export { OBS, MATTER };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the tops ------------------------------------------------------------------------------------------------------
export const TOPS = [[1, 2, 0.5], [1, 2, -3]];          // J s
export const EPS_TEXT = 0.01, EPS_DRAWN = 0.1;          // rad
/** L turned rigidly by eps about the x axis, exactly. */
export const turn = ([x, y, z], eps) => [x, y * Math.cos(eps) - z * Math.sin(eps), y * Math.sin(eps) + z * Math.cos(eps)];
/** The same to first order in eps: (y, z) -> (y - eps z, z + eps y). */
export const turnFirst = ([x, y, z], eps) => [x, y - eps * z, z + eps * y];

// ---- the brackets ----------------------------------------------------------------------------------------------------
/** The bracket of the chapter's order for functions F(X, P) of N parts' places and momenta (flat arrays of 3N), by
 * central differences. */
export function bracket(F, G, X, P, d = 1e-5) {
	const diff = (f, Y, i, other, placesFirst) => {
		const a = [...Y], b = [...Y];
		a[i] += d; b[i] -= d;
		return placesFirst ? (f(a, other) - f(b, other)) / (2 * d) : (f(other, a) - f(other, b)) / (2 * d);
	};
	let s = 0;
	for (let i = 0; i < X.length; i++) s += diff(F, X, i, P, true) * diff(G, P, i, X, false) - diff(F, P, i, X, false) * diff(G, X, i, P, true);
	return s;
}

/** Every bracket of the table checked on four parts with springs, against its formula; returns the worst error. */
export function checkBrackets(check) {
	const N = 4, k = 0.7, c = 3;
	const m = [0.8, 1.3, 1.1, 0.6];
	const X0 = [0.3, -0.2, 0.5, -0.4, 0.1, 0.2, 0.6, 0.4, -0.3, -0.1, -0.5, 0.2];
	const P0 = [0.5, -0.9, 0.3, 0.2, 0.7, -0.4, -0.6, 0.1, 0.8, 0.4, -0.3, -0.7];
	const part = (Y, a) => Y.slice(3 * a, 3 * a + 3);
	// h = x^2 - y^2 + xz and g = xy + yz - 2xz: harmonic, with Hessians that do not commute
	const h = ([x, y, z]) => x * x - y * y + x * z, g = ([x, y, z]) => x * y + y * z - 2 * x * z;
	const gh = ([x, y, z]) => [2 * x + z, -2 * y, x], gg = ([x, y, z]) => [y - 2 * z, x + z, y - 2 * x];
	const Hh = [[2, 0, 1], [0, -2, 0], [1, 0, 0]], Hg = [[0, 1, -2], [1, 0, 1], [-2, 1, 0]];
	const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2], times = (T, v) => T.map((r) => dot(r, v));
	const V = (X) => { let s = 0; for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) s += 0.5 * k * part(X, a).reduce((t, v, i) => t + (v - part(X, b)[i]) ** 2, 0); return s; };
	const H = (X, P) => Array.from({ length: N }, (_, a) => dot(part(P, a), part(P, a)) / (2 * m[a])).reduce((s, v) => s + v, 0) + V(X);
	const Q = (f) => (X) => Array.from({ length: N }, (_, a) => m[a] * f(part(X, a))).reduce((s, v) => s + v, 0);
	const Qd = (gf) => (X, P) => Array.from({ length: N }, (_, a) => dot(part(P, a), gf(part(X, a)))).reduce((s, v) => s + v, 0);
	const Qh = (X) => Q(h)(X), Qg = (X) => Q(g)(X), Qdh = Qd(gh), Qdg = Qd(gg);
	const asF = (f) => (X) => f(X);
	const B = (F, G) => bracket(F, G, X0, P0);
	const F = (q) => (X) => q(X);       // a function of the places alone
	const sum = (f) => Array.from({ length: N }, (_, a) => f(a)).reduce((s, v) => s + v, 0);
	const x = (a) => part(X0, a), p = (a) => part(P0, a);
	// the rate of Qdot_h: d/dt sum p . grad h = sum [F_a . grad h + (p/m) . (Hess h) p]
	const force = (a) => { const f = [0, 0, 0]; for (let b = 0; b < N; b++) if (b !== a) for (let i = 0; i < 3; i++) f[i] -= k * (x(a)[i] - x(b)[i]); return f; };
	const Qddh = sum((a) => dot(force(a), gh(x(a))) + dot(p(a).map((v) => v / m[a]), times(Hh, p(a))));
	const rows = [
		['{Q_h, Q_g}', B((X) => Qh(X), (X) => Qg(X)), 0],
		['{Q_h, Qdot_g}', B((X) => Qh(X), Qdg), sum((a) => m[a] * dot(gh(x(a)), gg(x(a))))],
		['{Q_h, H}', B((X) => Qh(X), H), Qdh(X0, P0)],
		['{Qdot_h, Qdot_g}', B(Qdh, Qdg), sum((a) => dot(p(a), times(Hh, gg(x(a)))) - dot(p(a), times(Hg, gh(x(a)))))],
		['{Qdot_h, H}', B(Qdh, H), Qddh],
		['{H, H}', B(H, H), 0],
		// below the diagonal: minus the mirror
		['{Qdot_h, Q_g}', B(Qdh, (X) => Qg(X)), -sum((a) => m[a] * dot(gh(x(a)), gg(x(a))))],
		['{H, Q_g}', B(H, (X) => Qg(X)), -Qd(gg)(X0, P0)],
		['{H, Qdot_g}', B(H, Qdg), -sum((a) => dot(force(a), gg(x(a))) + dot(p(a).map((v) => v / m[a]), times(Hg, p(a))))]
	];
	// the moments of the energy, Q = sum E h / c^2 with E = sqrt(m^2 c^4 + p^2 c^2), free parts
	const E = (P, a) => Math.sqrt(m[a] ** 2 * c ** 4 + dot(part(P, a), part(P, a)) * c * c);
	const QE = (f) => (X, P) => sum((a) => (E(P, a) * f(part(X, a))) / (c * c));
	rows.push(['{Q_h, Q_g} of the energy', bracket(QE(h), QE(g), X0, P0),
		sum((a) => dot(p(a), gh(x(a)).map((v, i) => (g(x(a)) * v - h(x(a)) * gg(x(a))[i]))) / (c * c))]);
	void asF; void F;
	let worst = 0;
	for (const [what, got, want] of rows) {
		const err = Math.abs(got - want) / Math.max(1, Math.abs(want));
		check(err < 1e-6, `the bracket ${what} is ${got}, not ${want}`);
		worst = Math.max(worst, err);
	}
	check(Math.abs(rows[3][2]) > 0.1 && Math.abs(rows.at(-1)[2]) > 0.01, 'the test brackets are too small to test');
	return worst;
}

// ---- the pulse -----------------------------------------------------------------------------------------------------
/** The text's reading: e^{-1/t^2} for t > 0, 0 for t <= 0. */
export const pulse = (t) => (t > 0 ? Math.exp(-1 / (t * t)) : 0);

/** Every number of the chapter that the three diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/algebra-of-moments.md')).text();
	const tex = await (await fetch('/paper/sections/11a-hair.tex')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const flatTex = tex.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const paper = (s, what) => check(flatTex.includes(s.replace(/\s+/g, ' ')), `the paper does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the tops
	has(r`one with $\vect L = (1, 2, 0.5)\unit{J\,s}$ and the other with $\vect L = (1, 2, -3)\unit{J\,s}$`, 'the tops');
	has(r`The first top's $L_y$ falls by $0.5\unit{J\,s}$ per radian of the turn, and the second's rises by
		$3\unit{J\,s}$ per radian.`, 'the rates of the turn');
	has(r`$(y, z) \to (y - \epsilon z,\ z + \epsilon y)$`, 'the turn to first order');
	has(r`$$\boxed{\;\{L_y, L_x\} = -L_z ,\qquad \{L_x, L_y\} = L_z .\;}$$`, 'the bracket of the tops');
	has(r`For the two tops and $\epsilon = 0.01$ rad, to first order in $\epsilon$, $L_y$ becomes $1.995$ and
		$2.030\unit{J\,s}$`, 'the tops at 0.01 rad');
	has(r`one turn of 0.01 rad reads the hidden $L_z$ of the two tops`, 'the turn of 0.01 rad');
	{
		const printed = TOPS.map((L) => turnFirst(L, EPS_TEXT)[1].toFixed(3));
		check(printed.join() === '1.995,2.030', `the first-order L_y at 0.01 rad: ${printed}`);
		for (const L of TOPS) {
			const e = 1e-7, rate = (turn(L, e)[1] - turn(L, -e)[1]) / (2 * e);
			check(near(rate, -L[2], 1e-6), `the rate of L_y per radian is ${rate}, not -L_z`);
			// the first-order turn is the exact one's first order: they part as eps^2
			const gap = (eps) => Math.hypot(...turn(L, eps).map((v, i) => v - turnFirst(L, eps)[i]));
			check(Math.abs(gap(1e-3) / gap(2e-3) - 0.25) < 1e-3, 'the first-order turn is not the exact one\'s first order');
			check(near(Math.hypot(...turn(L, EPS_DRAWN)), Math.hypot(...L), 1e-12) && turn(L, EPS_DRAWN)[0] === L[0], 'the turn is not rigid about x');
		}
		const drawn = TOPS.map((L) => turn(L, EPS_DRAWN)[1] - L[1]);
		check(drawn.map((v) => v.toFixed(3)).join() === '-0.060,0.290', `the exact changes at 0.1 rad: ${drawn}`);
	}

	// ---- the brackets
	has(r`$$\{F, \matter{Q_h}\} = -\sum_a\matter m_a\nabla h(\vect x_a)\cdot\frac{\partial F}{\partial\vect p_a} .$$`, 'the bracket with a moment');
	has(r`For $F = H$ the first bracket is the energy's response, $\{\matter{Q_g}, H\} = \matter{\dot Q_g}$. The second is
		the response of that response, $\{\matter{Q_g}, \matter{\dot Q_g}\} = \int\matter\rho\,|\nabla g|^2\,\dd V$.`, 'the push');
	has(r`\boxed{\;\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle = \kB T\,\langle\{\matter{Q_g}, \matter{\dot Q_h}\}\rangle = \kB T\,\Bigl\langle\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V\Bigr\rangle`, 'the bracket of a moment and a rate');
	has(r`In Newton's theory every moment is a function of the places alone, and any two functions of the places have the
		bracket zero.`, 'Newton\'s moments commute');
	has(r`$$\boxed{\;\{\matter{Q_h}, \matter{Q_g}\} = \frac{1}{c^2}\sum_a\vect p_a\cdot(g\nabla h - h\nabla g)(\vect x_a) .\;}$$`, 'the bracket of the moments of the energy');
	has(r`As $c$ grows the bracket falls as $1/c^2$, and Newton's moments commute again.`, 'the order of the bracket');
	has(r`{{paper eq:moment-bracket}}`, 'the paper\'s moment bracket');
	has(r`the paper's [](/paper/#eq:hair-commutator) divided by $i\hbar$, $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$`, 'the hair commutator over i hbar');
	has(r`13.4's integrand $\matter{\vect J}\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]$`, 'the bracket of two rates');
	has(r`Chapter 1.7 read the Poisson bracket two ways. As a rate, $\dot F = \{F, H\}$.`, 'the rate as a bracket with the energy');
	has(r`[^order]: $\{F, G\} = \sum_a(\partial F/\partial\vect x_a\cdot\partial G/\partial\vect p_a - \partial F/\partial\vect
		p_a\cdot\partial G/\partial\vect x_a)$, the order of the paper's Appendix C.`, 'the order of the bracket');
	paper(r`\{Q_h, Q_g\} = \frac{1}{c^2}\int\mathbf J\cdot(g\,\nabla h - h\,\nabla g)\,\dd V .`, 'eq:moment-bracket');
	paper(r`[\,Q_h,\,\dot Q_g\,] = i\hbar\int\rho\,\nabla h\cdot\nabla g\,\dd V ,`, 'eq:hair-commutator');
	paper(r`\{\dot Q_h, \dot Q_g\} = \int\mathbf J\cdot\bigl[(\nabla\nabla h)\,\nabla g - (\nabla\nabla g)\,\nabla h\bigr]\,\dd V ,`, 'eq:flow-bracket');
	const worst = checkBrackets(check);

	// ---- the pulse
	has(r`$$A(t) = e^{-1/t^2} \text{ for } t > 0, \qquad A(t) = 0 \text{ for } t \le 0 .$$`, 'the reading');
	has(r`Every derivative at $t = 0$ is therefore zero, and so is the series for all time, while $A(1) = e^{-1} = 0.37$`, 'A(1)');
	has(r`$A' = (2/t^3)\,e^{-1/t^2}$, $A'' = (4/t^6 - 6/t^4)\,e^{-1/t^2}$`, 'the derivatives');
	check(pulse(0.5).toFixed(3) === '0.018' && pulse(1).toFixed(2) === '0.37', `the pulse: ${pulse(0.5)}, ${pulse(1)}`);
	for (const t of [0.4, 0.8, 1.7]) {
		const e = 1e-5, d1 = (pulse(t + e) - pulse(t - e)) / (2 * e), d2 = (pulse(t + e) - 2 * pulse(t) + pulse(t - e)) / (e * e);
		check(near(d1, (2 / t ** 3) * pulse(t), 1e-7) && near(d2, (4 / t ** 6 - 6 / t ** 4) * pulse(t), 1e-4), `the derivatives at ${t}`);
	}

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
	return { md, flat, has, state, worst };
}
