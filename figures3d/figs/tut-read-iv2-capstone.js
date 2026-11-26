// The tutorial, reading section R3 (tutorial/noise/reading-section-iv-2.md), its second diagram: the capstone, the
// locked safe imaged from start to finish, in six small panels, one for each step of the chapter. One drawing serves
// the desktop and the phone, so the six are laid out to be read at 390 px: (a) beside (b), (c) beside (d), then (e) and
// (f) each across the whole width.
//  (a) Find the safe. Above: the gold's own E_xx along the row of pixels of panel (f) of fig:locked-safe (3.5 m long,
//      at the camera), in 10^-10 s^-2 against x from -1.75 to 1.75 m (orange), peaking at 4.1 at x = 1.1 m; around
//      zero the noise sigma_n of one reading at SNR 10^3, +-0.35 (blue), and at SNR 10, +-35 (the blue tint); the
//      vertical axis runs from -40 to 40 so that the wide band fits. Below: the two safes' scores as two unit Gaussians
//      (section 3.3's colours: blue for the left safe, orange for the right), their centres D = 1.81 apart, the
//      midline dashed and the tail of each beyond it in its tint, 18.3% each.
//  (b) See the blur. A plan from above, to scale: the camera's array as a bar 1 m wide at the left; the two safes,
//      squares 0.8 m wide centred 2.2 m apart, their centres 3.5 m from it (scenes/locked-safe.scene.json); from the
//      array's centre, along its axis, the blur of an array as wide as the scene is deep at SNR 10^3 (24.0 degrees, the
//      full width at half maximum of the Wiener point spread, two grey hairlines) and of this array (pi / l_max =
//      32.4 degrees, eq:handheld with 2r/D = 7, orange, its wedge in the orange tint), and that blur's arc of 1.98 m at
//      3.5 m, marked by a dimension arc; both are wider than the 1.4 m gap between the safes.
//  (c) Fail to weigh it. The whitened gains of section 3.4 (the locked safe's design matrix over the noise at
//      SNR 10^3, times the gold's mass) on a logarithmic scale, largest first; the 17 above one in orange, the rest
//      pale; the line at one in the noise's blue. Only the 118 above 10^-10 are drawn: the other 113 of the 231 lie
//      below it, where double precision cannot resolve them.
//  (d) Weigh it by positivity. The histogram of the mass the positive image finds in the right safe over 3000 draws
//      of the noise (figs/tut-read-iv2-lib.js), in 10 kg bins from 40 kg to the bin that holds the highest draw, so that
//      every draw is held, counted on a logarithmic scale so that the single draws of the long tail show; their mean,
//      315 kg (orange), and the true 324 kg (dashed). Above it, on small axes of its own, the Cramer-Rao ellipse of a
//      point of gold at SNR 10^3: the error in mass across (kg) and in depth up (cm), one standard deviation, ticked at
//      +-25 kg and +-9.1 cm, leaning along "farther and heavier" (correlation 0.996), in section 3.3's blue.
//  (e) Count the bits. A bar of 38 cells, one per bit of a patch at SNR 10^3 (eq:capacity-integral, 37.9): the first
//      cell, the safe (one bit), in ink; the next four, the mass (log2(324/20) = 4.0 bits), in orange; the rest pale.
//  (f) The quantum ceiling. The bar's face, 30 cm by 14 cm as the camera sees it, drawn twice: blurred by the Wiener
//      point spread at the ceiling SNR = 1.2 x 10^71 (full width 1.49 degrees, 9 cm at 3.5 m), and by the same pattern
//      widened to this array's 2.09 degrees, 13 cm. Each image's opacity is its value against the face's own (the
//      paper's maps: orange above zero, blue below); the face's true outline in a hairline.
// Exact: every number above, recomputed here and asserted against the chapter and against the reference code's
// numbers (figs/tut-read-iv2-lib.js): the gold's readings by the prism formulas (figs/tut-measure-lib.js), the gains by
// Jacobi rotations (figs/tut-svd-lib.js), the bits (figs/tut-bits-lib.js), the point spreads as Hankel transforms of
// the Wiener filter, the images as their convolution with the face, the Fisher matrix of a point of gold by central
// differences, and the 3000 draws' statistics. Schematic: the shape of the
// small camera's blur in (f), which is the wide array's pattern widened to its width.
import { INK, DIM, FAINT, ACCENT, ACCENT2, RULE, LETTER } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, AXIS, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, pathOf, gauss, upper, NUM, DATA, CURVE, MARK, TINT, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, boxTide, arrayPixels, readBox, noiseForSnr, G, GOLD_MASS, GOLD_SIZE, GOLD_DENSITY, RIGHT, LEFT, CAMERA, SIDE, DEPTH } from './tut-measure-lib.js';
import { safeGains } from './tut-svd-lib.js';
import { capacity, cutoff } from './tut-bits-lib.js';
import { J0 } from './tut-bessel-lib.js';
import { REF, DRAWS } from './tut-read-iv2-lib.js';

const name = 'tut-read-iv2-capstone';
const check = checker(name);

const BLUE_TINT = '#dce7f3';       // drawing.ts THEME: the second accent's tint
const ORANGE_TINT = '#f3dfcb';     // and the first's
const DASH = [2.2, 1.4];
const DEG = 180 / Math.PI;

// ---- the physics --------------------------------------------------------------------------------------------------

/** The Wiener filter's weight on the ripple q = kz at SNR = 10^d (app/src/lib/engine/resolution.ts, transfer). */
function transfer(q, d) {
	if (q <= 0) return 0;
	const logS = Math.log(Math.PI) + d * Math.LN10 + Math.log(q) - q;
	return 1 / (1 + Math.exp(Math.min(-2 * logS, 700)));
}
/** The Wiener point spread of a flat array at SNR = 10^d, a function of the angle rho (radians, = distance / depth):
 * (1 / 2 pi) int H(q) J0(q rho) q dq, by Simpson's rule in q up to q_c + 16; its integral over the plane is one. */
function pointSpread(d) {
	const qc = cutoff(d), top = qc + 16, n = 2 * Math.ceil(top / 0.04);
	const h = top / n, w = new Float64Array(n + 1);
	for (let i = 0; i <= n; i++) w[i] = (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * transfer(i * h, d) * i * h * (h / 3);
	return (rho) => { let s = 0; for (let i = 1; i <= n; i++) s += w[i] * J0(i * h * rho); return s / (2 * Math.PI); };
}
/** The full width at half maximum of a radial profile f (bisection on the half value). */
function fullWidth(f, hi) {
	const half = f(0) / 2;
	let a = 0, b = hi;
	for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(m) > half) a = m; else b = m; }
	return a + b;
}
/** A small camera's highest degree, eq:handheld: l_max = 2 + ln SNR / ln(2r/D), here 2r/D = 7. */
const lmax = (d) => 2 + (d * Math.LN10) / Math.log(7);

/** The five readings of a point mass m at c from the pixel p: (G m / r^3)(delta - 3 n n), xx yy xy xz yz. */
function pointReadings(p, c, m) {
	const x = [p[0] - c[0], p[1] - c[1], p[2] - c[2]], r = Math.hypot(...x), n = x.map((v) => v / r), k = (G * m) / r ** 3;
	return [k * (1 - 3 * n[0] * n[0]), k * (1 - 3 * n[1] * n[1]), -3 * k * n[0] * n[1], -3 * k * n[0] * n[2], -3 * k * n[1] * n[2]];
}

function numbers() {
	const N = {};
	// (a) the gold's own E_xx along the row: the prism formulas, against the reference
	N.exx = (x) => boxTide(GOLD_DENSITY, RIGHT, GOLD_SIZE, [x, CAMERA[1], CAMERA[2]])[0][0] / 1e-10;
	let best = { x: 0, v: -Infinity };
	for (let i = 0; i <= 3500; i++) { const x = -1.75 + i / 1000; const v = N.exx(x); if (v > best.v) best = { x, v }; }
	check(near(best.v, REF.exxPeak, 1e-9) && near(best.x, REF.exxPeakX, 1e-9), `the gold's E_xx peaks at ${best.v} at ${best.x}`);
	check(best.v.toFixed(1) === '4.1' && best.x.toFixed(1) === '1.1', 'the chapter: 4.1 at x = 1.1 m');
	N.sig3 = noiseForSnr(1e3) / 1e-10; N.sig1 = noiseForSnr(10) / 1e-10;
	check(near(N.sig3, REF.sigma1e3, 1e-12) && near(N.sig1, REF.sigma10, 1e-10), 'the noise of one reading');
	check(N.sig3.toFixed(2) === '0.35' && N.sig1.toFixed(0) === '35', 'the chapter: sigma_n = 0.035 E and 3.5 E');
	// the gold's largest recorded reading on the array, E_yz, and how many times the noise at 10 exceeds it
	const gold = readBox(arrayPixels(), RIGHT);
	const most = Math.max(...gold.map(Math.abs)) / 1e-10;
	check(near(most, REF.arrayMax, 1e-9) && (N.sig1 / most).toFixed(1) === '8.6', `the largest reading ${most}`);
	// the two safes' separation at 10, and the share of wrong choices
	const s10 = noiseForSnr(10), left = readBox(arrayPixels(), LEFT);
	N.D = Math.sqrt(gold.reduce((s, v, i) => s + ((v - left[i]) / s10) ** 2, 0));
	N.wrong = upper(N.D / 2);
	check(near(N.D, REF.D, 1e-9) && near(N.wrong, REF.wrong, 1e-9), `D = ${N.D}`);
	check(N.D.toFixed(2) === '1.81' && (100 * N.wrong).toFixed(1) === '18.3', 'the chapter: 1.81 apart, 18.3%');

	// (b) the blurs at 10^3: the Wiener point spread's full width, and the small camera's pi / l_max
	N.psf3 = pointSpread(3);
	N.wide = fullWidth(N.psf3, 1);
	N.small = Math.PI / lmax(3);
	check((N.wide * DEG).toFixed(1) === '24.0' && (N.wide * DEPTH).toFixed(2) === '1.47', `the wide array's blur ${N.wide * DEG}`);
	check(lmax(3).toFixed(2) === '5.55' && (N.small * DEG).toFixed(1) === '32.4' && (N.small * DEPTH).toFixed(2) === '1.98', `this array's blur ${N.small * DEG}`);

	// (c) the whitened gains
	const g = safeGains();
	N.gains = g.s;
	check(g.s.length === REF.gains.n && g.s.filter((s) => s > 1).length === REF.gains.above1 && REF.gains.above1 === 17, 'the gains: 231, 17 above one');
	check(near(g.s[0], REF.gains.s1, 1e-9 * REF.gains.s1) && near(g.s[16], REF.gains.s17, 1e-8) && near(g.s[17], REF.gains.s18, 1e-8), 'the gains against numpy');

	// (d) the 3000 draws
	const n = DRAWS.length, mean = DRAWS.reduce((s, x) => s + x, 0) / n;
	const sd = Math.sqrt(DRAWS.reduce((s, x) => s + (x - mean) ** 2, 0) / n);
	N.mean = mean; N.min = Math.min(...DRAWS); N.max = Math.max(...DRAWS);
	const below = DRAWS.filter((x) => x < 200).length / n;
	check(n === 3000 && near(mean, REF.mean, 0.005) && near(sd, REF.sd, 0.005) && near(N.min, REF.min, 0.005) && near(N.max, REF.max, 0.005) && near(below, REF.below200, 1e-12), 'the draws against the reference');
	check(mean.toFixed(0) === '315' && sd.toFixed(0) === '20' && N.min.toFixed(0) === '44' && (100 * below).toFixed(2) === '0.17', 'the chapter: 315 +- 20, lowest 44, 0.17% below 200');
	check(REF.left < 1 && REF.total.toFixed(0) === '341' && GOLD_MASS.toFixed(0) === '324', 'less than a kilogram in the left safe; 340 in all; the gold 324');
	// the Cramer-Rao bounds of a point of gold: the Fisher matrix of (x, y, depth, mass) by central differences
	const px = arrayPixels(), s3 = noiseForSnr(1e3);
	const at = (p) => px.flatMap((q) => pointReadings(q, [p[0], p[1], -p[2]], p[3]));
	const p0 = [RIGHT[0], RIGHT[1], -RIGHT[2], GOLD_MASS], steps = [1e-5, 1e-5, 1e-5, 1e-4];
	const J = steps.map((h, i) => { const a = p0.slice(), b = p0.slice(); a[i] += h; b[i] -= h; const A = at(a), B = at(b); return A.map((v, k) => (v - B[k]) / (2 * h) / s3); });
	const F = J.map((u) => J.map((v) => u.reduce((s, x, k) => s + x * v[k], 0)));
	const C = invert(F);
	check(near(C[2][2], REF.crDepth2, 1e-6 * REF.crDepth2) && near(C[2][3], REF.crDepthMass, 1e-5 * REF.crDepthMass) && near(C[3][3], REF.crMass2, 1e-6 * REF.crMass2), 'the Cramer-Rao covariance against the reference');
	N.cr = { dd: C[2][2], dm: C[2][3], mm: C[3][3] };
	const rho = C[2][3] / Math.sqrt(C[2][2] * C[3][3]);
	check((100 * Math.sqrt(C[2][2])).toFixed(1) === '9.1' && Math.sqrt(C[3][3]).toFixed(0) === '25' && rho.toFixed(3) === '0.996' && rho > 0, `the bounds ${Math.sqrt(C[2][2])}, ${Math.sqrt(C[3][3])}, ${rho}`);
	check((100 * Math.sqrt(C[0][0])).toFixed(1) === '2.9' && (100 * Math.sqrt(C[1][1])).toFixed(1) === '3.5', 'the bounds across');
	check(Math.sqrt(C[3][3] - C[2][3] ** 2 / C[2][2]).toFixed(1) === '2.2', 'the mass bound with the depth known');

	// (e) the bits
	N.bits = Math.round(capacity(3));
	check(capacity(3).toFixed(1) === '37.9' && N.bits === 38, 'the bits per patch at 10^3');
	N.mass = Math.round(Math.log2(324 / 20));
	check(Math.log2(324 / 20).toFixed(1) === '4.0' && N.mass === 4, 'the bits of the mass');

	// (f) the ceiling for 324 kg watched for the age of the universe, and the two blurs there
	const ceiling = (GOLD_MASS * 3.00e8 ** 2 * 4.35e17) / 1.055e-34;
	N.dc = Math.log10(ceiling);
	check((ceiling / 1e71).toFixed(1) === '1.2', `the ceiling ${ceiling}`);
	N.psfC = pointSpread(N.dc);
	N.wideC = fullWidth(N.psfC, 0.1);
	N.smallC = Math.PI / lmax(N.dc);
	check((N.wideC * DEG).toFixed(2) === '1.49' && (N.wideC * DEPTH * 100).toFixed(0) === '9', `the wide blur at the ceiling ${N.wideC * DEG}`);
	check(lmax(N.dc).toFixed(1) === '86.1' && (N.smallC * DEG).toFixed(2) === '2.09' && (N.smallC * DEPTH * 100).toFixed(0) === '13', `this array's blur at the ceiling ${N.smallC * DEG}`);
	// the point spread's integral over a disc of radius R is nearly 1 - J0(q_c R), as for a sharp cut-off
	let tot = 0;
	const RR = 0.05;
	for (let i = 0; i < 2000; i++) { const r = ((i + 0.5) * RR) / 2000; tot += N.psfC(r) * 2 * Math.PI * r * (RR / 2000); }
	check(Math.abs(tot - (1 - J0(cutoff(N.dc) * RR))) < 0.01, `the point spread's integral out to ${RR} rad is ${tot}`);
	return N;
}

/** The inverse of a small symmetric matrix (Gauss-Jordan). */
function invert(A) {
	const n = A.length, M = A.map((r, i) => [...r, ...A.map((_, j) => (i === j ? 1 : 0))]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		[M[c], M[p]] = [M[p], M[c]];
		const d = M[c][c];
		for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
		for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; for (let k = 0; k < 2 * n; k++) M[r][k] -= f * M[c][k]; }
	}
	return M.map((r) => r.slice(n));
}

// ---- the drawing (figure points, y down) --------------------------------------------------------------------------
const CW = 150;                 // a column's width
const GUT = 18;                 // between the columns
const W = 2 * CW + GUT;
const ROW_GAP = 15;             // between rows of panels, from the lowest ink of one to the next row's letters
const BELOW_LETTER = 4;         // from a letter's bottom to its panel's highest mark
const YL = 22;                  // the room for the vertical axes' numbers, left of a chart

export default async function () {
	const N = numbers();
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const x0 = ORIGIN - W / 2, xR = x0 + CW + GUT;
	const letter = async (l, x, y) => { const g = await placed(`\\text{(${l})}`, x, y, 0, 0, INK, LETTER); L.push(g); return g.box; };
	const lowest = () => Math.max(...L.map((g) => g.box.b));

	// =============== row 1: (a) and (b) ===============
	const T1 = ORIGIN - 220;
	const la = await letter('a', x0, T1);
	// (a), above: E_xx along the row against the two bands
	const P1 = new Plot({ left: x0 + YL, top: la.b + BELOW_LETTER + 2, w: CW - YL, h: 56, x0: -1.75, x1: 1.75, y0: -40, y1: 40 });
	const band = (v, color, what) => S.fill(pathOf([P1.at(P1.x0, v), P1.at(P1.x1, v), P1.at(P1.x1, -v), P1.at(P1.x0, -v)]), { l: P1.left, r: P1.right, t: P1.Y(v), b: P1.Y(-v) }, { color, layer: 0, what, solid: false });
	band(N.sig1, BLUE_TINT, 'the band at 10');
	band(N.sig3, ACCENT2, 'the band at 10^3');
	const exx = graph(P1, N.exx, -1.75, 1.75, 0.2);
	check(longest(exx) <= 0.2 + 1e-9, 'E_xx is sampled too coarsely');
	S.path(exx, { color: ACCENT, width: CURVE, layer: 2, what: 'E_xx' });
	L.push(...await yAxis(S, P1, { ticks: [-40, 0, 40], fmt: (t) => String(t), what: 'the readings axis' }));
	L.push(...await xAxis(S, P1, { ticks: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], fmt: (t) => (Number.isInteger(t) ? String(t) : null), what: 'the row axis' }));
	// the peak stands above the narrow band and inside the wide one
	check(N.exx(1.1) > 10 * N.sig3 && N.exx(1.1) < N.sig1 / 8, 'the peak against the bands');
	// (a), below: the two safes' scores
	const P2 = new Plot({ left: P1.left, top: lowest() + 8, w: P1.w, h: 30, x0: -4, x1: 4, y0: 0, y1: 0.42 });
	const half = N.D / 2, cut = merge(P2, CURVE);
	for (const [mu, color, tint, side] of [[-half, ACCENT2, BLUE_TINT, 1], [half, ACCENT, ORANGE_TINT, -1]]) {
		const f = (x) => gauss(x - mu);
		// where the curve stands clear of the axis
		const reach = Math.sqrt(-2 * Math.log(cut * Math.sqrt(2 * Math.PI)));
		const a = Math.max(P2.x0, mu - reach), b = Math.min(P2.x1, mu + reach);
		const pts = graph(P2, f, a, b, 0.2);
		check(longest(pts) <= 0.2 + 1e-9, 'a Gaussian is sampled too coarsely');
		// the tail beyond the midline, in the tint
		const tail = side > 0 ? graph(P2, f, 0, b, 0.2) : graph(P2, f, a, 0, 0.2);
		const poly = side > 0 ? [P2.at(0, 0), ...tail, P2.at(b, 0)] : [P2.at(a, 0), ...tail, P2.at(0, 0)];
		S.fill(pathOf(poly), { l: 0, r: 0, t: 0, b: 0 }, { color: tint, layer: 0, what: 'a tail', solid: false });
		S.path(pts, { color, width: CURVE, layer: 2, what: 'a score' });
		check(near(upper(Math.abs(mu)), N.wrong, 1e-12), 'the tail is not the share of wrong choices');
	}
	S.path([P2.at(0, 0), P2.at(0, 0.42)], { color: INK, width: HAIR, layer: 2, dash: DASH, cap: 'butt', what: 'the midline' });
	L.push(...await xAxis(S, P2, { ticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4], fmt: (t) => (t % 2 === 0 ? String(t) : null), what: 'the score axis' }));
	const aBottom = lowest();

	// (b) the plan
	const lb = await letter('b', xR, T1);
	const K = (CW - 4) / 4.25;                                   // points per metre
	const scene = await (await fetch('/scenes/locked-safe.scene.json')).json();
	const shape = (id) => scene.objects.find((o) => o.id === id).shape;
	const safes = ['safe-left', 'safe-right'].map(shape);
	check(safes.every((s) => s.size[0] === 0.8 && s.size[2] === 0.8 && Math.abs(s.center[2]) === DEPTH) && safes[1].center[0] - safes[0].center[0] === 2.2, 'the safes: 0.8 m squares, 2.2 m apart, 3.5 m away');
	check(near(safes[1].center[0] - safes[0].center[0] - 0.8, 1.4, 1e-12), 'the gap of 1.4 m');
	check(near(RIGHT[0], safes[1].center[0], 0) && near(LEFT[0], safes[0].center[0], 0) && SIDE === 1, 'the reference code\'s safes and array');
	const cy = (aBottom + T1) / 2 + 3;                           // the camera's axis, across the middle of the row
	const bx = xR + 3;                                           // the array's plane
	const plan = (depth, across) => [bx + K * depth, cy - K * across];   // across: + to the camera's left (up)
	// the wedges: this array's in the orange tint with orange edges, the wide array's as two grey hairlines
	const R0 = 4.15;
	const fan = (ang) => { const pts = [plan(0, 0)]; for (let i = 0; i <= 60; i++) { const t = -ang / 2 + (ang * i) / 60; pts.push(plan(R0 * Math.cos(t), R0 * Math.sin(t))); } return pts; };
	S.fill(pathOf(fan(N.small)), { l: 0, r: 0, t: 0, b: 0 }, { color: ORANGE_TINT, layer: 0, what: 'the wedge', solid: false });
	for (const s of [-1, 1]) {
		S.path([plan(0, 0), plan(R0 * Math.cos(N.small / 2), s * R0 * Math.sin(N.small / 2))], { color: ACCENT, width: HAIR, layer: 2, what: 'this array\'s wedge' });
		S.path([plan(0, 0), plan(R0 * Math.cos(N.wide / 2), s * R0 * Math.sin(N.wide / 2))], { color: DIM, width: HAIR, layer: 2, what: 'the wide array\'s wedge' });
	}
	// the arc of this array's blur at 3.5 m, with radial ends
	const arc = []; for (let i = 0; i <= 80; i++) { const t = -N.small / 2 + (N.small * i) / 80; arc.push(plan(DEPTH * Math.cos(t), DEPTH * Math.sin(t))); }
	// (its ends are the wedge's edges, so it needs no end strokes, which would lie along them)
	S.path(arc, { color: ACCENT, width: 0.55, layer: 3, cap: 'butt', what: 'the arc' });
	check(near(DEPTH * N.small, 1.98, 0.005) && DEPTH * Math.sin(N.wide / 2) > 0.7, 'both blurs span the gap');
	// the safes and the camera
	for (const s of safes) {
		const [cxs, , czs] = s.center, h = s.size[0] / 2;
		const d = -czs, a = cxs;
		S.path([plan(d - h, a - h), plan(d + h, a - h), plan(d + h, a + h), plan(d - h, a + h)], { color: INK, width: 0.55, closed: true, cap: 'butt', layer: 2, what: 'a safe' });
	}
	const cam = [plan(-0.03, SIDE / 2), plan(0.03, -SIDE / 2)];
	S.fill(`M${n2(cam[0][0])},${n2(cam[0][1])}H${n2(cam[1][0])}V${n2(cam[1][1])}H${n2(cam[0][0])}Z`, { l: cam[0][0], r: cam[1][0], t: cam[0][1], b: cam[1][1] }, { color: INK, layer: 3, what: 'the array' });
	check(lb.b + LABEL_GAP < plan(0, 1.55)[1] || lb.r + LABEL_GAP < plan(0.4, 0)[0], 'the letter (b) is in the plan');

	// =============== row 2: (c) and (d) ===============
	const T2 = lowest() + ROW_GAP;
	const lc = await letter('c', x0, T2);
	const ld = await letter('d', xR, T2);
	const chartTop = lc.b + BELOW_LETTER + 2;

	// (d), above: the Cramer-Rao ellipse of a point of gold, on axes of its own: the error in mass across (kg), the
	// error in depth up (cm, counted away from the camera), ticks at the bounds
	const { dd, dm, mm } = N.cr;
	const sm = Math.sqrt(mm), sz = 100 * Math.sqrt(dd);
	const E = new Plot({ left: xR + YL, top: chartTop, w: 70, h: 34, x0: -35, x1: 35, y0: -13, y1: 13 });
	const l11 = sm, l21 = (100 * dm) / l11, l22 = Math.sqrt(100 * 100 * dd - l21 * l21);   // C = L L^T, in (kg, cm)
	const ell = [];
	for (let i = 0; i <= 1440; i++) {
		const t = (2 * Math.PI * i) / 1440, u = Math.cos(t), v = Math.sin(t);
		ell.push(E.at(l11 * u, l21 * u + l22 * v));
	}
	check(longest(ell) <= 0.25, 'the ellipse is sampled too coarsely');
	const xs = ell.map((p) => p[0]), ys = ell.map((p) => p[1]);
	check(near((Math.max(...xs) - Math.min(...xs)) / 2, E.X(sm) - E.X(0), 0.01), 'the ellipse\'s shadow is not 25 kg');
	check(near((Math.max(...ys) - Math.min(...ys)) / 2, E.Y(0) - E.Y(sz), 0.01), 'the ellipse\'s shadow is not 9.1 cm');
	S.raw(`<path d="${pathOf(ell)}" fill="${ACCENT2}" fill-opacity="0.12" stroke="${ACCENT2}" stroke-width="0.5"/>`, 2);
	S.mark(ell, 0.25, 'the ellipse');
	L.push(...await yAxis(S, E, { ticks: [-sz, 0, sz], fmt: (t) => (t === 0 ? '0' : (t < 0 ? '-' : '') + Math.abs(t).toFixed(1)), what: 'the depth error axis' }));
	L.push(...await xAxis(S, E, { ticks: [-sm, 0, sm], fmt: (t) => (t === 0 ? '0' : (t < 0 ? '-' : '') + Math.abs(t).toFixed(0)), what: 'the mass error axis' }));

	// (d), below: the histogram, in 10 kg bins from 40 kg, on a logarithmic count
	const BIN = 10, lo = 40, nb = Math.ceil((N.max - lo) / BIN);
	const hi = lo + nb * BIN;
	check(N.min >= lo && N.max < hi && hi === 340, 'the bins hold every draw');
	const counts = new Array(nb).fill(0);
	for (const v of DRAWS) counts[Math.floor((v - lo) / BIN)]++;
	check(counts.reduce((s, c) => s + c, 0) === 3000, 'a draw is not counted');
	const BASE = Math.log10(0.6);
	// its vertical axis stands 10 kg before the first bin, so that no bar's edge runs along it
	const A0 = lo - 10;
	const P4 = new Plot({ left: xR + YL, top: lowest() + 9, w: CW - YL, h: 50, x0: A0, x1: hi, y0: BASE, y1: Math.log10(1500) });
	const lg = (v) => Math.log10(v);
	// each run of non-empty bins: its tinted area, and its outline up, across and down (never along the axis)
	for (let i = 0; i < nb;) {
		if (!counts[i]) { i++; continue; }
		let j = i; while (j + 1 < nb && counts[j + 1]) j++;
		const pts = [P4.at(lo + i * BIN, BASE)];
		for (let k = i; k <= j; k++) pts.push(P4.at(lo + k * BIN, lg(counts[k])), P4.at(lo + (k + 1) * BIN, lg(counts[k])));
		pts.push(P4.at(lo + (j + 1) * BIN, BASE));
		S.fill(pathOf(pts), { l: 0, r: 0, t: 0, b: 0 }, { color: TINT, layer: 0, what: 'the histogram', solid: false });
		S.path(pts, { color: INK, width: DATA, layer: 1, what: 'the histogram' });
		i = j + 1;
	}
	S.path([P4.at(N.mean, BASE), P4.at(N.mean, P4.y1)], { color: ACCENT, width: MARK, layer: 3, cap: 'butt', what: 'the mean' });
	S.path([P4.at(GOLD_MASS, BASE), P4.at(GOLD_MASS, P4.y1)], { color: INK, width: MARK, layer: 3, dash: DASH, cap: 'butt', what: 'the true mass' });
	check(P4.X(GOLD_MASS) - P4.X(N.mean) > 2.5, 'the mean and the true mass are not told apart');
	// neither line runs beside an edge of a bin
	for (const v of [N.mean, GOLD_MASS]) { const e = (v - lo) % BIN; check(Math.min(e, BIN - e) * (P4.w / (P4.x1 - P4.x0)) > 1.2, `the line at ${v} kg runs beside a bin's edge`); }
	L.push(...await yAxis(S, P4, { ticks: [0, 1, 2, 3], fmt: (t) => (t === 0 ? '1' : t === 1 ? '10' : `10^{${t}}`), what: 'the count axis' }));
	L.push(...await xAxis(S, P4, { ticks: [50, 100, 150, 200, 250, 300], fmt: (t) => (t % 100 === 0 ? String(t) : null), what: 'the mass axis' }));

	// (c) the gains, as tall as (d): only those above 10^-10. Below that the floating-point floor of the
	// decomposition (about 2 x 10^-16 times the largest gain, near 5 x 10^-13) would show as a false plateau. The
	// count above 10^-10 is exact: rounding moves a gain by at most about 3 x 10^-12 (Weyl), and the gains on either side
	// of 10^-10 are more than 10^-11 from it.
	const LOW = 1e-10;
	const shown = N.gains.filter((g) => g > LOW);
	check(shown.length === 118 && N.gains.length - shown.length === 113, `${shown.length} gains above 10^-10`);
	check(N.gains[117] - LOW > 1e-11 && LOW - N.gains[118] > 1e-11, 'a gain is too near 10^-10 to count');
	const P3 = new Plot({ left: x0 + YL, top: chartTop, w: CW - YL, h: P4.bottom - chartTop, x0: 0, x1: 232, y0: -10.3, y1: 4 });
	S.path([P3.at(P3.x0, 0), P3.at(P3.x1, 0)], { color: ACCENT2, width: MARK, layer: 1, cap: 'butt', what: 'the line at one' });
	// the dots of each colour as one shape, so that where they overlap the pale ones do not darken
	const DOTR = 0.75, dots = { kept: '', rest: '' };
	for (const [i, s] of shown.entries()) {
		const [px, py] = P3.at(i + 1, lg(s));
		check(py > P3.top && py < P3.bottom - DOTR - 0.5, `the gain ${i + 1} is outside the chart`);
		dots[s > 1 ? 'kept' : 'rest'] += `M${n2(px - DOTR)},${n2(py)}a${DOTR},${DOTR} 0 1,0 ${2 * DOTR},0a${DOTR},${DOTR} 0 1,0 ${-2 * DOTR},0Z`;
	}
	S.raw(`<path d="${dots.rest}" fill="${RULE}"/>`, 2);
	S.raw(`<path d="${dots.kept}" fill="${ACCENT}"/>`, 3);
	S.mark([P3.at(1, lg(shown[0])), P3.at(shown.length, lg(shown[shown.length - 1]))], 0.75, 'the gains');
	L.push(...await yAxis(S, P3, { ticks: [4, 0, -4, -8], fmt: (t) => (t === 0 ? '1' : `10^{${t}}`), what: 'the gains axis' }));
	L.push(...await xAxis(S, P3, { ticks: [1, 17, 50, 100, 118, 150, 200, 231], fmt: (t) => ([1, 17, 118, 231].includes(t) ? String(t) : null), from: 0, what: 'the index axis' }));

	// =============== row 3: (e) ===============
	const T3 = lowest() + ROW_GAP;
	const le = await letter('e', x0, T3);
	const CH = 9, CGAP = 1.2, bl = le.r + 6;
	const pitch = (x0 + W - bl + CGAP) / N.bits;
	const ct = (le.t + le.b) / 2 - CH / 2;
	for (let i = 0; i < N.bits; i++) {
		const l = bl + i * pitch, r = l + pitch - CGAP;
		const color = i === 0 ? INK : i <= N.mass ? ACCENT : '#eeebe5';
		S.fill(`M${n2(l)},${n2(ct)}H${n2(r)}V${n2(ct + CH)}H${n2(l)}Z`, { l, r, t: ct, b: ct + CH }, { color, layer: 1, what: 'a bit' });
	}

	// =============== row 4: (f) ===============
	const T4 = Math.max(lowest(), ct + CH) + ROW_GAP;
	const lf = await letter('f', x0, T4);
	const CM = 2.1;                                    // points per centimetre
	const HX = 34, HY = 30, STEP = 0.5;                // the images' half extent and pixel, cm
	const FLOOR = 0.15;                                // values within this share of the greatest are not drawn
	const FACE = [30, 14];                             // cm
	const img = (psf, scale) => {
		// the face's samples, every quarter centimetre, each standing for its own cell
		const fs = 0.25, src = [];
		for (let i = 0; i < FACE[0] / fs; i++) for (let j = 0; j < FACE[1] / fs; j++) src.push([-FACE[0] / 2 + (i + 0.5) * fs, -FACE[1] / 2 + (j + 0.5) * fs]);
		// the point spread as a table in distance (cm), at a twentieth of a centimetre
		const reach = Math.hypot(HX + FACE[0] / 2, HY + FACE[1] / 2) + 1, dr = 0.05, tab = new Float64Array(Math.ceil(reach / dr) + 2);
		const cmPerRad = DEPTH * 100;
		for (let k = 0; k < tab.length; k++) tab[k] = (psf((k * dr * scale) / cmPerRad) * scale * scale) / cmPerRad ** 2;
		const look = (r) => { const u = r / dr, k = Math.floor(u); return tab[k] + (u - k) * (tab[k + 1] - tab[k]); };
		const nx = Math.round((2 * HX) / STEP) + 1, ny = Math.round((2 * HY) / STEP) + 1, v = new Float64Array(nx * ny);
		for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) {
			const x = -HX + a * STEP, y = HY - b * STEP;
			let s = 0;
			for (const [u, w] of src) s += look(Math.hypot(x - u, y - w));
			v[b * nx + a] = s * fs * fs;
		}
		return { nx, ny, v };
	};
	const ratio = N.wideC / N.smallC;                  // the small camera's pattern is the wide one's widened by 1 / ratio
	const images = [img(N.psfC, 1), img(N.psfC, ratio)];
	const top = Math.max(...images.flatMap((m) => [...m.v]));
	const edge = Math.max(...images.flatMap((m) => { const o = []; for (let a = 0; a < m.nx; a++) o.push(Math.abs(m.v[a]), Math.abs(m.v[(m.ny - 1) * m.nx + a])); for (let b = 0; b < m.ny; b++) o.push(Math.abs(m.v[b * m.nx]), Math.abs(m.v[b * m.nx + m.nx - 1])); return o; }));
	check(edge / top < 0.9 * FLOOR, `the images do not fade out by their edges (${edge / top})`);
	const DEEP = 0.85;                                 // the strongest opacity, at the images' greatest value
	// the drawn part: the pixels whose value clears the floor, in both images, and one more on every side
	let ca = Infinity, cb = -1, ra = Infinity, rb = -1;
	for (const m of images) for (let b = 0; b < m.ny; b++) for (let a = 0; a < m.nx; a++) if (Math.abs(m.v[b * m.nx + a]) / top > FLOOR) {
		ca = Math.min(ca, a); cb = Math.max(cb, a); ra = Math.min(ra, b); rb = Math.max(rb, b);
	}
	ca -= 1; cb += 1; ra -= 1; rb += 1;
	check(ca > 0 && ra > 0 && cb < images[0].nx - 1 && rb < images[0].ny - 1, 'the drawn part reaches the computed edge');
	// symmetric about the face's centre, as the images are
	const ha = Math.max(images[0].nx - 1 - cb, ca) === ca ? ca : images[0].nx - 1 - cb, hb = Math.min(ra, images[0].ny - 1 - rb);
	const c0 = Math.min(ca, images[0].nx - 1 - cb), r0 = hb;
	void ha;
	const cols = images[0].nx - 2 * c0, rows = images[0].ny - 2 * r0;
	const iw = (cols - 1) * STEP * CM, ih = (rows - 1) * STEP * CM, igap = 14;
	const il = lf.r + 8 + (x0 + W - (lf.r + 8) - 2 * iw - igap) / 2, it = lf.t;
	check(il > lf.r + LABEL_GAP, 'the letter (f) touches the first image');
	for (const [k, m] of images.entries()) {
		const l = il + k * (iw + igap);
		for (const [sign, color] of [[1, ACCENT], [-1, ACCENT2]]) {
			const c = document.createElement('canvas');
			c.width = cols; c.height = rows;
			const ctx = c.getContext('2d'), data = ctx.createImageData(cols, rows);
			for (let b = 0; b < rows; b++) for (let a = 0; a < cols; a++) {
				const v = m.v[(b + r0) * m.nx + a + c0];
				const o = Math.round(255 * DEEP * Math.max(0, ((sign * v) / top - FLOOR) / (1 - FLOOR)));
				data.data.set([o, o, o, 255], 4 * (b * cols + a));
			}
			ctx.putImageData(data, 0, 0);
			const id = `${name}-mask-${k}-${sign > 0 ? 'pos' : 'neg'}`;
			// pixel centres from the first to the last drawn: the image runs half a pixel beyond them
			const px0 = l - (STEP / 2) * CM, py0 = it - (STEP / 2) * CM, pw = iw + STEP * CM, ph = ih + STEP * CM;
			defs += `<mask id="${id}" maskUnits="userSpaceOnUse" x="${n2(px0)}" y="${n2(py0)}" width="${n2(pw)}" height="${n2(ph)}"><image href="${c.toDataURL('image/png')}" x="${n2(px0)}" y="${n2(py0)}" width="${n2(pw)}" height="${n2(ph)}" preserveAspectRatio="none"/></mask>`;
			S.raw(`<rect x="${n2(px0)}" y="${n2(py0)}" width="${n2(pw)}" height="${n2(ph)}" fill="${color}" mask="url(#${id})"/>`, 1);
		}
		// the face's true outline, about the images' centre
		const fl = l + iw / 2 - (FACE[0] / 2) * CM, ft = it + ih / 2 - (FACE[1] / 2) * CM;
		S.path([[fl, ft], [fl + FACE[0] * CM, ft], [fl + FACE[0] * CM, ft + FACE[1] * CM], [fl, ft + FACE[1] * CM]], { color: INK, width: HAIR, closed: true, cap: 'butt', layer: 2, what: 'the face' });
	}
	S.mark([[il, it], [il + 2 * iw + igap, it + ih]], 0, 'the images');
	const negative = Math.min(...images.flatMap((m) => [...m.v])) / top;

	// ---- checks
	for (const g of L) g.on = [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIv2Capstone = { N: { wide: N.wide * DEG, small: N.small * DEG, wideC: N.wideC * DEG, smallC: N.smallC * DEG, mean: N.mean, bits: N.bits }, top, negative, counts };
	return finish(S, L, [240, 340], defs);
}
