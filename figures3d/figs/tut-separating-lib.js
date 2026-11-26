// Shared numbers for the two diagrams of the tutorial's section 9.5 (tutorial/one-point/separating-waves.md):
// tut-wave-count and tut-lens-cells. Not a figure itself. The colours are the chapter's colour roles, the curvature's
// for gravity and the light role's for light (app.css's --q-curv and --q-light, read by section 7.1's palette,
// figs/tut-metric-lib.js), imported, not copied. Orange and blue mean a stretch and a squeeze only, and are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the count: N waves seen in L snapshots of a field of spin s have N(L + 1) complex unknowns against L(2s + 1)
//    complex numbers recorded; the largest N with N(L + 1) <= L(2s + 1) is floor(L(2s + 1)/(L + 1)), found both by
//    counting and by the formula, for s = 1, 2, 4 and L = 1, 2 and every L up to 200; it gives the chapter's table,
//    gravity 2, 3, 4 and light 1, 2, 2 at L = 1, 2 and a long record; over a long record it is 2s once L >= 2s and
//    never more; the figure's long record is drawn per snapshot, N(L + 1)/L against 2s + 1, at L = 20, which gives the
//    same largest N, 4 and 2;
//  - the chirp: a neutron-star pair of chirp mass 1.2 solar masses at 100 Hz rises at the quadrupole formula's
//    fdot = (96/5) pi^(8/3) (G Mc/c^3)^(5/3) f^(11/3) = 16.9 Hz/s (printed 17); integrating that rate gives
//    f = 100 Hz (tau/(tau - t))^(3/8) with tau = (3/8) f/fdot = 2.22 s, checked by a Runge-Kutta integration from
//    t = 0 to -2.5 s and to +0.5 s; the cells are dt = 1/sqrt(fdot) = 0.243 s by 1/dt = 4.11 Hz (printed 0.24 and
//    4.1), where fdot dt = 1/dt; the second image, half a second later, is at f(-0.5) = 92.65 Hz at t = 0, 7.35 Hz
//    (printed 7.3) or 1.79 cells (printed 1.8) below the first;
//  - the diagrams' comments' numbers (kept here, since the figures replace the comments), and, once a figure stands in
//    the chapter, its name and label there and one pointer to it.
import { CURV, LIGHT, palette } from './tut-metric-lib.js';

export { CURV, LIGHT, palette };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the count ------------------------------------------------------------------------------------------------------
/** Complex unknowns of N waves over L snapshots: N directions and L N amplitudes. */
export const unknowns = (N, L) => N * (L + 1);
/** Complex numbers recorded by L snapshots of a field of spin s. */
export const recorded = (s, L) => L * (2 * s + 1);
/** The largest N whose unknowns fit within what is recorded, by counting. */
export function largest(s, L) {
	let N = 0;
	while (unknowns(N + 1, L) <= recorded(s, L)) N++;
	return N;
}
/** The paper's eq:wave-count, floor(L(2s + 1)/(L + 1)). */
export const nMax = (s, L) => Math.floor((L * (2 * s + 1)) / (L + 1));
export const GRAVITY = 2, SPIN_LIGHT = 1;
export const LONG = 20;                         // the long record's snapshots, drawn per snapshot
export const PANELS = [
	{ L: 1, title: '\\text{one instant }(L = 1)', per: false },
	{ L: 2, title: '\\text{one frequency }(L = 2)', per: false },
	{ L: LONG, title: '\\text{long record }(L\\text{ large})', per: true }
];
export const WAVES = [1, 2, 3, 4, 5, 6];        // the horizontal axis
/** What a panel draws: the unknowns (per snapshot in the long record) at each N, and the two recorded lines. */
export function panel({ L, per }) {
	const k = per ? 1 / L : 1;
	return {
		dots: WAVES.map((N) => unknowns(N, L) * k),
		gravity: recorded(GRAVITY, L) * k,
		light: recorded(SPIN_LIGHT, L) * k,
		ring: { gravity: largest(GRAVITY, L), light: largest(SPIN_LIGHT, L) }
	};
}

// ---- the chirp, SI --------------------------------------------------------------------------------------------------
export const GM_SUN = 1.32712440018e20;         // m^3 s^-2 (IAU)
export const C = 299792458;                     // m s^-1
export const CHIRP_MASS = 1.2;                  // solar masses
export const F0 = 100;                          // Hz at t = 0, the first image
export const LAG = 0.5;                         // s: the second image arrives this much later
const TM = (CHIRP_MASS * GM_SUN) / C ** 3;      // G Mc / c^3, seconds
const K = (96 / 5) * Math.PI ** (8 / 3) * TM ** (5 / 3);
/** The quadrupole formula's rate, Hz/s, at the frequency f. */
export const rate = (f) => K * f ** (11 / 3);
export const FDOT = rate(F0);
export const TAU = (3 / 8) * (F0 / FDOT);       // s from t = 0 to the merger
/** The first image's frequency at the time t (s), Hz. */
export const first = (t) => F0 * (TAU / (TAU - t)) ** (3 / 8);
/** The second image's, half a second behind. */
export const second = (t) => first(t - LAG);
export const DT = 1 / Math.sqrt(FDOT);          // a cell's duration, s
export const DF = 1 / DT;                       // and its width in frequency, Hz
export const APART = first(0) - second(0);      // Hz at t = 0
export const CELLS = APART / DF;
/** Runge-Kutta on fdot = K f^(11/3) from (0, F0) to the time t, in n steps. */
function integrate(t, n = 20000) {
	let f = F0;
	const h = t / n;
	for (let i = 0; i < n; i++) {
		const k1 = rate(f), k2 = rate(f + (h * k1) / 2), k3 = rate(f + (h * k2) / 2), k4 = rate(f + h * k3);
		f += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
	}
	return f;
}

// ---- the numbers of the diagrams' comments, which the figures replace -----------------------------------------------
export const COMMENT = {
	count: ['(s = 2: 5, 10, 5L)', '(s = 1: 3, 6, 3L)', 'gravity 2, 3, 4; light 1, 2, 2', 'N(L + 1)/L and 2s + 1, with L = 20', '"unknowns N(L + 1)"', '"recorded L(2s + 1)"'],
	cells: ['from −2 to 0.5', '0.24 s wide and 4.1 Hz tall', 'chirp mass 1.2 solar masses', '(t_c − t)^(−3/8)', 'the first at 100 Hz at t = 0', 'the second shifted 0.5 s later', '"7.4 Hz: 1.8 cells"']
};
export const FIGURES = [['tut-wave-count', 'wave-count'], ['tut-lens-cells', 'lens-cells']];

/** The chapter's statements behind the two figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/one-point/separating-waves.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	for (const [n, id] of FIGURES) {
		const drawn = flat.includes(`](${n}){#fig:${id}}`), planned = comments.some((c) => c.includes(`diagram: ${n} `));
		check(drawn !== planned, `the diagram ${n} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) check(flat.split(`(Figure [](#fig:${id}))`).length === 2, `not one pointer to fig:${id}`);
	}
	const comment = (n) => comments.find((c) => c.includes(`diagram: ${n} `)) ?? null;

	// ---- the count
	has(String.raw`$N$ waves have $N$ directions and $LN$ amplitudes, $N(L + 1)$ complex unknowns, against the $L(2s + 1)$ complex numbers recorded: the same inequality`, 'the count of unknowns');
	has(String.raw`$$\boxed{\;\sym{wave-count}{N_{\max}} = \left\lfloor\frac{L(2s + 1)}{L + 1}\right\rfloor ,\;}$$`, 'the largest N');
	has(String.raw`| | one instant, $L = 1$ | one frequency, $L = 2$ | long record, $L \to \infty$ |`, 'the table\'s columns');
	has(String.raw`Over a long record $N_{\max} = 2s$, because $L(2s + 1)/(L + 1)$ stays below $2s + 1$ and reaches $2s$ once $L \ge 2s$`, 'the long record');
	has('two, three and four for gravity, and one, two and two for light', 'the idea to keep');
	const rows = { 1: 'light, $s = 1$', 2: 'gravity, $s = 2$', 4: 'spin four (hypothetical), $s = 4$' };
	for (const s of [1, 2, 4]) {
		for (let L = 1; L <= 200; L++) {
			check(largest(s, L) === nMax(s, L), `counting and the formula differ at s = ${s}, L = ${L}`);
			check(nMax(s, L) <= 2 * s && (L < 2 * s || nMax(s, L) === 2 * s), `the long record at s = ${s}, L = ${L}`);
			// the count is the text's inequality L(2s - N + 1) >= N
			check(L * (2 * s - largest(s, L) + 1) >= largest(s, L) && L * (2 * s - largest(s, L)) < largest(s, L) + 1, `the equations at s = ${s}, L = ${L}`);
		}
		has(`| ${rows[s]} | ${nMax(s, 1)} | ${nMax(s, 2)} | ${nMax(s, 1000)} |`, `the table's row for s = ${s}`);
	}
	const counts = PANELS.map(panel);
	check(counts.map((p) => p.ring.gravity).join() === '2,3,4' && counts.map((p) => p.ring.light).join() === '1,2,2', `the rings ${JSON.stringify(counts.map((p) => p.ring))}`);
	check(counts[2].ring.gravity === nMax(GRAVITY, 1e6) && counts[2].ring.light === nMax(SPIN_LIGHT, 1e6), 'L = 20 does not give the long record\'s count');
	check(counts.map((p) => p.gravity).join() === '5,10,5' && counts.map((p) => p.light).join() === '3,6,3', 'the recorded lines');
	check(counts[0].dots.join() === '2,4,6,8,10,12' && counts[1].dots.join() === '3,6,9,12,15,18', 'the unknowns');
	check(counts[2].dots.every((v, i) => near(v, 1.05 * WAVES[i], 1e-12)), 'the unknowns per snapshot');
	// the ring is the last dot at or below its line, and the next is above it
	for (const p of counts) for (const k of ['gravity', 'light']) {
		const N = p.ring[k];
		check(p.dots[N - 1] <= p[k] + 1e-12 && p.dots[N] > p[k] + 1e-12, `the ${k} ring at ${N}`);
	}
	const c1 = comment('tut-wave-count');
	if (c1) check(COMMENT.count.every((s) => c1.includes(s)), 'the first comment\'s numbers');

	// ---- the chirp
	has('A pair of neutron stars at 100 Hz rises in frequency at the rate $\\dot f = 17\\unit{Hz\\,s^{-1}}$', 'the rate');
	has(String.raw`$\dot f\,\Delta t = 1/\Delta t$, so the cells are $\Delta t = 1/\sqrt{\dot f} = 0.24\unit{s}$ long and $4.1\unit{Hz}$ wide.`, 'the cells');
	has(String.raw`Two images half a second apart differ by $7.3\unit{Hz}$, 1.8 cells`, 'the two images');
	has(String.raw`$\dot f = \tfrac{96}{5}\pi^{8/3}(G\mathcal M/c^3)^{5/3}f^{11/3}$ for a chirp mass $\mathcal M$ of 1.2 solar masses`, 'the quadrupole formula');
	has(String.raw`A stretch of record of duration $\Delta t$ resolves frequencies about $1/\Delta t$ apart`, 'the resolution');
	check(FDOT.toFixed(1) === '16.9' && FDOT.toPrecision(2) === '17', `fdot = ${FDOT}`);
	check(DT.toFixed(3) === '0.243' && DT.toFixed(2) === '0.24' && DF.toFixed(2) === '4.11' && DF.toFixed(1) === '4.1', `the cells ${DT} s by ${DF} Hz`);
	check(near(FDOT * DT, 1 / DT, 1e-12), 'fdot dt is not 1/dt');
	check(TAU.toFixed(2) === '2.22', `tau = ${TAU}`);
	check(near(first(0), F0, 1e-12) && near(second(LAG), F0, 1e-12), 'the images are not at 100 Hz when they reach t = 0');
	// the closed form against the rate: its derivative, and a Runge-Kutta integration of the rate
	for (const t of [-2.5, -2, -1, -0.5, 0, 0.3, 0.5]) {
		const h = 1e-5, d = (first(t + h) - first(t - h)) / (2 * h);
		check(near(d, rate(first(t)), 1e-6 * rate(first(t))), `the derivative of f at ${t} is not the rate`);
	}
	for (const t of [-2.5, -0.5, 0.5]) check(near(integrate(t), first(t), 1e-9), `the integrated chirp at ${t}: ${integrate(t)} against ${first(t)}`);
	check(second(0).toFixed(2) === '92.65' && APART.toFixed(2) === '7.35' && APART.toFixed(1) === '7.3', `the images are ${APART} Hz apart`);
	check(CELLS.toFixed(2) === '1.79' && CELLS.toFixed(1) === '1.8', `the images are ${CELLS} cells apart`);
	const c2 = comment('tut-lens-cells');
	if (c2) check(COMMENT.cells.every((s) => c2.includes(s)), 'the second comment\'s numbers');

	return { counts, FDOT, TAU, DT, DF, APART, CELLS };
}
