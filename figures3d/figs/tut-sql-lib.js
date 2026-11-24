// Shared numbers for the four diagrams of the tutorial's chapter 8.6 (tutorial/quantum/quantum-limit.md):
// tut-sql-compromise, tut-sql-pixel, tut-sql-interferometer and tut-snr-ladder. Not a figure itself. The palette is
// chapter 8.1's (read from app.css by `palette(check)`, with matter's and the curvature's colours), the relative `near`
// chapter 8.2's, G and c chapter 7.1's (figs/tut-einstein-lib.js), the blur law's cut-off chapter 3.8's Newton solver
// (figs/tut-bits-lib.js, `cutoff`, a port of the site's engine), and the sheet, strokes, labels and cropping those of
// chapters 6.1 to 8.5 (figs/tut-pot-lib.js), all imported, not copied. Ink and the page's greys only; orange, which
// means a stretch, appears only in tut-sql-pixel's two arrows, and blue (a squeeze) nowhere.
//
// Every number is computed here with hbar = 1.0546 x 10^-34 J s, G = 6.674 x 10^-11 and the chapters' masses, times
// and lengths, and `chapter(check)` asserts it against the chapter's own text (fetched, outside its comments):
//  - the free mass: sigma_x(tau)^2 = sigma_0^2 + (hbar tau / 2 m sigma_0)^2, in units of sigma_SQL = sqrt(hbar tau / m)
//    the sum s^2 + 1/(4 s^2) at s = sigma_0 / sigma_SQL, least (1) at s = 1/sqrt 2, and 7.07 at s = 0.0707 and 7.07;
//    for 1 g and 1 s, sigma_SQL = 3.25 x 10^-16 m and the best sigma_0 = 2.30 x 10^-16 m;
//  - the tides: 2 sigma_SQL / xi tau^2 = 6.5 x 10^-14 s^-2 for xi = 1 cm, sqrt 2 times that, 9.2 x 10^-14, for the
//    distance of the two; the person's 2 G M / r^3 = 9.34 x 10^-9 s^-2 (70 kg, 1 m); the gradiometer's 0.02 E =
//    2 x 10^-11 s^-2; the ratios 467 and 1.44 x 10^5;
//  - the interferometer: h_SQL = sqrt(8 hbar / m omega^2 L^2) for 40 kg and 4 km, 3.65, 1.83 and 0.914 x 10^-24
//    Hz^-1/2 at 50, 100 and 200 Hz; the quantum noise S = A/P + B P / f^4 with sqrt(A B) fixed so that its least value
//    over P at each f is h_SQL^2, which touches h_SQL^2 once, where the two terms are equal, at f = (B P / A)^(1/4):
//    31.6, 100 and 316 Hz for P0/10, P0 and 10 P0;
//  - the ladder: the ratios on the person of 467, 1.44 x 10^5, 9.5 x 10^16 (stretches of 10^3 s, shorter than the hour in which the pair falls together, averaged over
//    4.35 x 10^17 s), 4.1 x 10^31 (tau^3/2 carried to the age of the universe), 1.7 x 10^55 (the ceiling over the
//    1.5 x 10^15 by which a camera of mass z c^2 / 2G at 3 m outpulls the Earth) and 2.6 x 10^70 (M_s c^2 tau / hbar);
//    their blurs by chapter 3.7's exact calculation (step 7, the one that reproduces the paper's table): the full
//    width at half maximum of the picture of a point under a plane of sensors, int H(q) J0(q r) q dq with the Wiener
//    filter H, found by bisection, ported line by line from the site's BlurLaw interactive
//    (app/src/lib/tutorial/live/blur-law.ts, planePointSpread) and asserted against chapter 3.7's table:
//    26.0, 16.0, 5.47, 3.24, 1.91 and 1.51 degrees (4.43 / q_c, the law of step 6, gives 26.6 and 16.1 for the first two).
import { palette, MATTER, CURV } from './tut-memory-lib.js';
import { near } from './tut-operators-lib.js';
import { G, C } from './tut-einstein-lib.js';
import { cutoff } from './tut-bits-lib.js';
import { J0, J1 } from './tut-bessel-lib.js';

export { palette, MATTER, CURV, near, cutoff };

export const HBAR = 1.0546e-34;          // J s, as the brief fixes it (the chapter prints 1.055)

// ---- the free mass, in units of sigma_SQL ------------------------------------------------------------------------
/** The first reading's own term, the back-action's and the spread, at s = sigma_0 / sigma_SQL. */
export const reading = (s) => s;
export const kick = (s) => 1 / (2 * s);
export const spread = (s) => Math.hypot(reading(s), kick(s));
export const BEST = Math.SQRT1_2;        // sigma_0 / sigma_SQL at the least spread
export const sqlOf = (m, tau) => Math.sqrt((HBAR * tau) / m);
export const MASS = 1e-3, TAU = 1, XI = 0.01;   // kg, s, m: the paper's pixel
/** sigma_x(tau) in metres, from eq:spread, for a first reading sigma_0 (m). */
export const spreadSI = (s0, m = MASS, tau = TAU) => Math.sqrt(s0 * s0 + ((HBAR * tau) / (2 * m * s0)) ** 2);

// ---- tides -------------------------------------------------------------------------------------------------------
export const PERSON = 70, R_PERSON = 1;  // kg, m
export const personTide = () => (2 * G * PERSON) / R_PERSON ** 3;
export const EOTVOS = 1e-9;              // s^-2
export const GRADIOMETER = 0.02 * EOTVOS;
export const pixelTide = (two = false) => ((two ? Math.SQRT2 : 1) * 2 * sqlOf(MASS, TAU)) / (XI * TAU * TAU);

// ---- the interferometer ------------------------------------------------------------------------------------------
export const MIRROR = 40, ARM = 4000;    // kg, m
export const hSQL = (f) => Math.sqrt((8 * HBAR) / (MIRROR * (2 * Math.PI * f) ** 2 * ARM * ARM));
export const F0 = 100;                   // Hz: P0 touches the limit here
export const POWERS = [0.1, 1, 10];      // P / P0
/** The one-sided spectra of shot noise and radiation pressure, at P = p P0: A/P and B P / f^4, with the two equal at
 * F0 for P0 and sqrt(A B) = hbar / (pi^2 m L^2), so that 2 sqrt(A B) / f^2 = h_SQL(f)^2. */
const AB = HBAR / (Math.PI ** 2 * MIRROR * ARM * ARM);
const A_P0 = AB / F0 ** 2;               // A / P0: S_shot at P0
const B_P0 = AB * F0 ** 2;               // B P0
export const shot = (f, p) => A_P0 / p;
export const pressure = (f, p) => (B_P0 * p) / f ** 4;
export const noise = (f, p) => Math.sqrt(shot(f, p) + pressure(f, p));
export const touch = (p) => (B_P0 * p / (A_P0 / p)) ** 0.25;

// ---- the ladder --------------------------------------------------------------------------------------------------
export const AGE = 4.35e17;              // s
export const STRETCH = 1e3;              // s
export const Z = 3, EARTH_G = 9.81;      // m, m s^-2
export const ladder = () => {
	const pix = personTide() / pixelTide();
	const camera = (Z * C * C) / (2 * G), pull = (G * camera) / (Z * Z) / EARTH_G;
	const ceiling = (PERSON * C * C * AGE) / HBAR;
	return {
		grad: personTide() / GRADIOMETER,
		pix,
		avg: pix * (STRETCH / TAU) ** 1.5 * Math.sqrt(AGE / STRETCH),
		formal: pix * (AGE / TAU) ** 1.5,
		earth: ceiling / pull,
		ceiling,
		pull,
		camera
	};
};
/** Chapter 3.7's law of step 6, 4.43 / q_c, in degrees, for SNR = 10^d: only the estimate. */
export const LAW = 4.43;
export const lawBlur = (d) => ((LAW / cutoff(d)) * 180) / Math.PI;

// ---- chapter 3.7's exact blur (step 7): ported from app/src/lib/tutorial/live/blur-law.ts --------------------------
/** H(q) for SNR = 10^d (app/src/lib/engine/resolution.ts, transfer). */
export function transfer(q, d) {
	if (q <= 0) return 0;
	const logS = Math.log(Math.PI) + d * Math.LN10 + Math.log(q) - q;
	return 1 / (1 + Math.exp(Math.min(-2 * logS, 700)));
}
/** The low crossing of S = 1, the smaller root (blur-law.ts, lowCrossing). */
function lowCrossing(d) {
	const L = Math.log(Math.PI) + d * Math.LN10;
	let q = Math.exp(-L);
	for (let i = 0; i < 60; i++) { const next = Math.exp(q - L); if (Math.abs(next - q) <= 1e-15 * q) return next; q = next; }
	return q;
}
/** The nodes and trapezoid weights of f(r) = int 2 H (1 - H) (q - 1) J1(q r) / r dq, the picture of a point after
 * one integration by parts (blur-law.ts, planeNodes). */
function planeNodes(d) {
	const qc = cutoff(d), nodes = [], weights = [];
	const weight = (q) => { const H = transfer(q, d); return 2 * H * (1 - H) * (q - 1); };
	const add = (qs) => {
		for (let i = 0; i < qs.length; i++) {
			const left = i > 0 ? qs[i] - qs[i - 1] : 0, right = i < qs.length - 1 ? qs[i + 1] - qs[i] : 0;
			nodes.push(qs[i]);
			weights.push((weight(qs[i]) * (left + right)) / 2);
		}
	};
	const lnLow = Math.log(lowCrossing(d)) - 8;
	add(Array.from({ length: 241 }, (_, i) => Math.exp(lnLow * (1 - i / 240))));
	const a = Math.max(1, qc - 25), b = qc + 15, n = Math.ceil((b - a) / 0.04);
	add(Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n));
	return { qc, nodes, weights };
}
function evaluate(nodes, weights, r) {
	let s = 0;
	if (r === 0) { for (let i = 0; i < nodes.length; i++) s += weights[i] * nodes[i] * 0.5; return s; }
	for (let i = 0; i < nodes.length; i++) s += weights[i] * J1(nodes[i] * r);
	return s / r;
}
function halfPoint(f, lo, hi) {
	for (let i = 0; i < 80 && hi - lo > 1e-13 * hi; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0.5) lo = mid; else hi = mid; }
	return (lo + hi) / 2;
}
/** The exact full width at half maximum under a plane of sensors, radians, for SNR = 10^d (planePointSpread). */
export function exactWidth(d) {
	const { qc, nodes, weights } = planeNodes(d);
	const peak = evaluate(nodes, weights, 0);
	const f = (r) => evaluate(nodes, weights, r) / peak;
	return 2 * halfPoint(f, (0.5 * 4.4302) / (2 * qc), (2 * 4.4302) / (2 * qc));
}
/** Chapter 3.7's blur, exact, in degrees. */
export const blur = (d) => (exactWidth(d) * 180) / Math.PI;
/** A check by a second route: the same picture without the integration by parts, (1 / 2 pi) int H J0(q r) q dq by
 * Simpson's rule (as figs/tut-read-iv2-capstone.js computes it), its half maximum by bisection. */
export function directWidth(d, J0) {
	const qc = cutoff(d), top = qc + 16, n = 2 * Math.ceil(top / 0.02), h = top / n;
	const w = Array.from({ length: n + 1 }, (_, i) => (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * transfer(i * h, d) * i * h * (h / 3));
	const f = (r) => { let s = 0; for (let i = 1; i <= n; i++) s += w[i] * J0(i * h * r); return s; };
	const half = f(0) / 2;
	let a = 0, b = 8 / qc;
	for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(m) > half) a = m; else b = m; }
	return a + b;
}

/** The chapter's statements behind the four figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/quantum-limit.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sig = (v, d) => Number(v).toPrecision(d);

	// ---- hbar
	has('$\\hbar = 1.055\\times10^{-34}\\unit{J\\,s}$', 'hbar');
	check(sig(HBAR, 4) === '1.055e-34' && near(HBAR, 1.054571817e-34, 1e-4), 'hbar is not 1.0546 x 10^-34');

	// ---- the free mass
	has('$$\\sigma_x(\\tau)^2 \\ge \\sigma_0^2 + \\Bigl(\\frac{\\hbar\\tau}{2\\matter m\\sigma_0}\\Bigr)^2 . \\label{eq:spread}$$', 'the spread');
	has('$$\\boxed{\\sym{sql-width}{\\sigma_{\\rm SQL}} = \\sqrt{\\frac{\\hbar\\tau}{\\matter m}}} ,$$', 'the limit');
	has('with equality when $\\sigma_0^2 = \\hbar\\tau/2\\matter m$', 'the best first reading');
	has('A gram watched for a second has $\\sigma_{\\rm SQL} = 3.25\\times10^{-16}$ m', 'sigma_SQL for a gram');
	has('The best first reading is $\\sigma_0 = \\sqrt{\\hbar\\tau/2\\matter m} = 2.30\\times10^{-16}$ m', 'the best sigma_0');
	has('If the first reading is ten times sharper than the best, the second term of [](#eq:spread) is a hundred times larger than there, and the final spread is seven times $\\sigma_{\\rm SQL}$', 'the sevenfold spread');
	const sql = sqlOf(MASS, TAU), s0 = Math.sqrt((HBAR * TAU) / (2 * MASS));
	check(sig(sql, 3) === '3.25e-16' && sig(s0, 3) === '2.30e-16', `sigma_SQL ${sql}, sigma_0 ${s0}`);
	check(near(s0 / sql, BEST, 1e-14), 'the best sigma_0 is not sigma_SQL / sqrt 2');
	// the scaled curve is eq:spread over sigma_SQL, at several first readings
	for (const s of [0.03, 0.2, BEST, 1.7, 30]) check(near(spreadSI(s * sql) / sql, spread(s), 1e-12), `the scaled spread at ${s}`);
	// the least value 1 at 1/sqrt 2, by a scan
	{
		let best = 1;
		for (let i = 0; i <= 60000; i++) { const s = 0.03 * 1000 ** (i / 60000); if (spread(s) < spread(best)) best = s; }
		check(Math.abs(best - BEST) < 2e-4 && near(spread(BEST), 1, 1e-15), `the least spread at ${best}`);
	}
	check(near(spread(BEST / 10), spread(BEST * 10), 1e-12) && spread(BEST * 10).toFixed(2) === '7.07', `the spread ten times off the best: ${spread(BEST * 10)}`);
	check((BEST / 10).toFixed(4) === '0.0707' && (BEST * 10).toFixed(2) === '7.07', 'the points 0.0707 and 7.07');
	check(near(kick(BEST / 10) / kick(BEST), 10, 1e-12), 'the back-action ten times sharper');

	// ---- the tides
	has('&= 6.5\\times10^{-14}\\unit{s^{-2}} ,', 'the tide of the pixel');
	has('The person a metre away makes $9.34\\times10^{-9}\\unit{s^{-2}}$ (1.4), 144,000 times more', 'the person\'s tide');
	has('this pixel reads a signal-to-noise ratio of $1.44\\times10^5$ in a second', 'the pixel\'s ratio');
	has('$\\sqrt2\\,\\sigma_{\\rm SQL} = \\sqrt{2\\hbar\\tau/\\matter m} = 4.6\\times10^{-16}$ m', 'the spread of the distance');
	has('and the tide is $9.2\\times10^{-14}\\unit{s^{-2}}$', 'the tide of the distance');
	has('reaches $0.02\\unit{E}$ in a second, $2\\times10^{-11}\\unit{s^{-2}}$ (*stated in the paper*), and so gives the person R1\'s ratio of 467', 'the gradiometer');
	has('are moved relative to each other by $\\tfrac12\\curv{\\tE}\\xi\\tau^2$ in the time $\\tau$', 'the stretch');
	check(sig(pixelTide(), 2) === '6.5e-14' && sig(pixelTide(true), 2) === '9.2e-14' && sig(Math.SQRT2 * sql, 2) === '4.6e-16', `the pixel's tides ${pixelTide()}, ${pixelTide(true)}`);
	check(sig(personTide(), 3) === '9.34e-9' && (Math.round(personTide() / pixelTide() / 1000) * 1000).toLocaleString('en') === '144,000', `the person's ${personTide()}`);
	check(sig(GRADIOMETER, 1) === '2e-11', 'the gradiometer');

	// ---- the interferometer
	has('$$\\sym{sql-strain}{h_{\\rm SQL}} = \\sqrt{\\frac{8\\hbar}{\\matter m\\omega^2L^2}} ,$$', 'h_SQL');
	has('$\\sym{arm-length}{L}$ = 4 km, with laser light reflected from mirrors of $\\matter m = 40$ kg', 'LIGO\'s arms and mirrors');
	has('At 100 Hz, $\\omega = 628\\unit{s^{-1}}$ and $h_{\\rm SQL} = 1.8\\times10^{-24}\\unit{Hz^{-1/2}}$', 'h_SQL at 100 Hz');
	has('**shot noise**, falls as $P^{-1/2}$', 'the shot noise\'s power law');
	has('**radiation-pressure noise**, the random push of the photons\' momenta, grows as $P^{1/2}$ and moves free mirrors less at higher frequency', 'radiation pressure');
	check(sig(hSQL(50), 3) === '3.65e-24' && sig(hSQL(100), 3) === '1.83e-24' && sig(hSQL(200), 3) === '9.14e-25', `h_SQL ${hSQL(50)}, ${hSQL(100)}, ${hSQL(200)}`);
	check((2 * Math.PI * 100).toFixed(0) === '628', 'omega at 100 Hz');
	for (const p of POWERS) {
		const ft = touch(p);
		check(near(shot(ft, p), pressure(ft, p), 1e-12), `the two noises are not equal at the touching point of ${p} P0`);
		check(near(noise(ft, p), hSQL(ft), 1e-9), `${p} P0 does not touch h_SQL`);
		for (let i = 0; i <= 400; i++) {
			const f = 10 * 100 ** (i / 400);
			check(noise(f, p) >= hSQL(f) * (1 - 1e-12), `${p} P0 dips below h_SQL at ${f} Hz`);
			// the least noise over the power at f is h_SQL(f)
			const pBest = (f / F0) ** 2;
			check(near(noise(f, pBest), hSQL(f), 1e-9), `no power reaches h_SQL at ${f} Hz`);
		}
		// shot noise as P^-1/2, radiation pressure as P^1/2 (amplitudes)
		check(near(Math.sqrt(shot(100, p) / shot(100, 1)), p ** -0.5, 1e-12) && near(Math.sqrt(pressure(100, p) / pressure(100, 1)), p ** 0.5, 1e-12), 'the power laws');
	}
	check(touch(0.1).toFixed(1) === '31.6' && near(touch(1), 100, 1e-9) && touch(10).toFixed(0) === '316', `the touching points ${POWERS.map(touch)}`);

	// ---- the ladder
	has('For the person of 70 kg watched for the age of the universe, $4.35\\times10^{17}$ s, the ceiling is $2.6\\times10^{70}$', 'the ceiling');
	has('blur law gives $1.51°$', 'the ceiling\'s blur');
	has('pulls at 3 m with $1.5\\times10^{15}$ times the Earth\'s gravity $g$', 'the camera\'s pull');
	has('the paper\'s ceiling falls by the same factor to $1.7\\times10^{55}$, a blur of $1.91°$', 'the Earth-bound ceiling');
	has('$$\\SNR \\lesssim \\frac{\\matter M_sc^2\\tau}{\\hbar} .$$', 'the ceiling\'s form');
	has('Its ratio on the person grows as $\\tau^{3/2}$, from $1.44\\times10^5$ in a second', 'the growth');
	has('would part them only after $\\sqrt{2/\\curv{\\tE}} = 1.5\\times10^4$ s', 'the tide\'s parting time');
	has('$\\sqrt{\\xi^3/G\\matter m} = 3.9\\times10^3$ s, an hour', 'the pair\'s fall');
	has('stretches of $10^3$ s and averaged over the age of the universe, the pixel reaches about $10^{17}$, a blur of 5.8°', 'the averaged pixel');
	has('The rule carried to the age of the universe would give $4.1\\times10^{31}$ and 3.2°, a formal extrapolation', 'the formal pixel');
	const R = ladder();
	check(sig(Math.sqrt(2 / personTide()), 2) === '1.5e+4' && sig(Math.sqrt(XI ** 3 / (G * MASS)), 2) === '3.9e+3' && STRETCH < Math.sqrt(XI ** 3 / (G * MASS)), 'the stretches are not shorter than the pair\'s fall');
	check(sig(R.grad, 3) === '467' && sig(R.pix, 3) === '1.44e+5' && sig(R.avg, 2) === '9.5e+16' && sig(R.formal, 2) === '4.1e+31' &&
		sig(R.earth, 2) === '1.7e+55' && sig(R.ceiling, 2) === '2.6e+70', `the ratios ${Object.values(R)}`);
	check(sig(R.pull, 2) === '1.5e+15' && sig(R.camera, 2) === '2.0e+27', `the camera ${R.camera} kg pulls ${R.pull} g`);
	const logs = { grad: '2.67', pix: '5.16', avg: '17.0', formal: '31.6', earth: '55.2', ceiling: '70.4' };
	for (const [k, s] of Object.entries(logs)) check(Math.log10(R[k]).toFixed(s.length - s.indexOf('.') - 1) === s, `log10 of ${k} is ${Math.log10(R[k])}, not ${s}`);

	// ---- the blur, by chapter 3.7's exact calculation (step 7), checked against its table and its law
	const law = await (await fetch('/tutorial/noise/blur-law.md')).text();
	const lawFlat = law.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const said = (t, what) => check(lawFlat.includes(t), `chapter 3.7 does not say ${what}: ${t}`);
	said('$$\\boxed{q_c\\,e^{-q_c} = \\frac{1}{\\pi\\,\\SNR}}. \\label{eq:cutoff-here}$$', 'the cut-off');
	said('The **cut-off** $\\sym{cutoff}{q_c}$ is the larger root of', 'the larger root');
	said('## Step 7: an exact calculation reproduces the paper\'s table', 'step 7');
	said('to compute the picture of a point by numerical integration of $\\int_0^\\infty H(q)\\,J_0(qa/z)\\,q\\,\\dd q$ on the plane', 'the exact picture');
	said('and to find its half maximum by bisection', 'the half maximum');
	// the table's Plane column, and its 4.43 / q_c column, at every row
	for (const [d, plane, est] of [[3, '24.0', '24.4'], [6, '14.1', '14.2'], [10, '9.2', '9.2'], [20, '5.0', '5.0'], [30, '3.4', '3.4'], [60, '1.8', '1.8']]) {
		said(`| $10^{${d}}$ | ${cutoff(d).toFixed(1)} | ${plane}° |`, `the table's row at 10^${d}`);
		check(blur(d).toFixed(1) === plane && lawBlur(d).toFixed(1) === est, `the exact blur at 10^${d} is ${blur(d)}, the law ${lawBlur(d)}`);
	}
	check(cutoff(3).toFixed(2) === '10.39' && lawBlur(3).toFixed(1) === '24.4', 'the law at 10^3');
	const blurs = {};
	for (const k of ['grad', 'pix', 'avg', 'formal', 'earth', 'ceiling']) {
		const d = Math.log10(R[k]), q = cutoff(d);
		check(q > 1 && near(Math.log(q) - q, -(Math.log(Math.PI) + d * Math.LN10), 1e-10), `q_c at ${k}`);
		blurs[k] = blur(d);
		// a second route to the same width, within 0.1%
		check(near(directWidth(d, J0), exactWidth(d), 1e-3), `the two routes to the blur of ${k}: ${directWidth(d, J0)} and ${exactWidth(d)}`);
	}
	check(blurs.ceiling.toFixed(2) === '1.51' && blurs.earth.toFixed(2) === '1.91' && blurs.formal.toFixed(1) === '3.2' && blurs.avg.toFixed(1) === '5.8', `the chapter's blurs ${Object.values(blurs)}`);
	check(blurs.grad.toFixed(0) === '26' && blurs.pix.toFixed(0) === '16', `the blurs of the gradiometer and the pixel ${blurs.grad}, ${blurs.pix}`);
	return { md, sql, s0, R, blurs };
}
