// The tutorial, reading section R4 (tutorial/response/reading-section-iv-3.md), its second diagram: the capstone, the
// paper's steel ball followed through Part 4 in eight small panels, one for each step of the chapter. Two layouts
// (globalThis.figureLayout), as R3's capstone (figs/tut-read-iv2-capstone.js): the site's, one drawing for the desktop
// and the phone, read at 390 px, four rows of two, (a) beside (b) to (g) beside (h); and the printed book's, two rows
// of four as wide as the text, (a) to (d) over (e) to (h), the last column wider for the tide's numbers. In the book
// the ball's numbers stand under the disc, the frequency scale under the section (13 points per kHz, the section's
// radius 25 points), the title of (e) takes two lines, the words of (f) stand over the trial shape's bar, "same area,
// k_B T / K" and the thermometer's formula take two lines, and the charts of (c), (d), (e), (f) and (g) are as tall as
// their row: the first row's foot is that of (a) and (b), the second's that of (h).
//  (a) The body. A section of the ball, a disc of radius 10 cm in the steel ball's grey, holding 36 atoms at seeded
//      places, each with an arrow along two seeded standard normal deviates; beside it the ball's mass,
//      32.9 kg, its number of iron atoms, 3.5 x 10^26 "atoms", and their root mean square speed, sqrt(3 k_B T / m),
//      "rms speed 366 m s^-1" (on two lines on the site, where the words stand beside the disc).
//  (b) Its note. Left: a section through the axis with Appendix A's displacement u = (q/R)(-x/2, z) at twelve points on
//      a circle of half the radius, every 30 degrees (orange where u has an outward part, within 54.7 degrees of the
//      axis; blue round the equator), as tut-elastic-trial. Right: a frequency scale from 11 to 16 kHz with the twist
//      at 11.9 kHz (grey: it makes no tide), Lamb's exact mass-quadrupole note at 12.6 kHz (solid) and Rayleigh's
//      bound at 15.1 kHz (dashed), the roots of the free sphere's frequency equations (figs/tut-elastic-lib.js).
//  (c) Its jitter. The Gaussian exp(-q^2 / 2 q_rms^2) of the swing of the poles against q in 10^-16 m, with
//      q_rms = sqrt(k_B T / K) = 2.16 x 10^-16 m for K = 3 mu V / R^2 and mu = rho c_T^2; the two points +-q_rms
//      marked by thin verticals up to the curve.
//  (d) Its tide. Titled "tide on the axis, s^-2" on the letter's line, as (c), (e) and (f) are. Log-log axes, r from
//      0.1 to 10 m and the tide from 10^-30 to 10^-19 s^-2; the tide on the axis,
//      36 G M R q_rms / 5 r^5 = 3.41 x 10^-25 (r / 1 m)^-5 s^-2, in the tide's orange; dots at 0.2 m (1.07 x 10^-21)
//      and 1 m (3.41 x 10^-25); a slope triangle from 2 to 5 m, "r^-5".
//  (e) What the tremor holds. Two bars, <Qdot_xy^2> = k_B T int rho (x^2 + y^2) dV for the ball, 2/5 M R^2 k_B T =
//      5.45 x 10^-22, and for a thin shell of the same mass and radius, 2/3 M R^2 k_B T = 9.08 x 10^-22 kg^2 m^4 s^-2,
//      their ratio 5 : 3 marked by a thin elbow between their tops.
//  (f) Its static answer. Two bars, the Love number k_2 from Kelvin's formula 3/2 / (1 + 19 mu / 2 rho g_s R),
//      3.83 x 10^-16, and from the trial shape, 3 rho g_s R / 25 mu = 2.91 x 10^-16, both for the text's mu = 71 GPa.
//  (g) Its line. S_q(omega) = 2 k_B T (Gamma / m_eff) / [(omega_0^2 - omega^2)^2 + Gamma^2 omega^2] against
//      omega / omega_0 from 0.5 to 1.5, in units of 2 k_B T / K omega_0, for Q = 5 (thin) and Q = 20 (thicker), the
//      area under each in a light neutral grey; over all frequencies both areas are k_B T / K. The Q values are
//      chosen for the drawing; the window holds 90% and 97% of the two areas.
//  (h) The thermometer. The shell drive of tut-fd-thermometer: a circle whose stroke is orange where mass is added and
//      blue where it is removed, its weight |n.D.n| for D = diag(-1/2, -1/2, 1) (the shell's own line, in ink, where
//      the weight is small); at its centre the pixel, a ring of twelve beads; the steel ball outside at the right;
//      T = omega S_yy / 2 k_B Im chi_yy = 300 K, which the oscillator's spectrum and response return at every frequency.
// Exact: every number above, computed here and asserted against the chapter's. Schematic: the atoms' places and the
// arrows' scale in (a), the arrows' scale in (b), the sizes and places in (h).
import { INK, DIM, ACCENT, ACCENT2, LETTER } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, AXIS, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf, normals, uniforms, merge, NUM, DATA, CURVE, TINT, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { STEEL, PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { EDGE } from './tut-gauss-lib.js';
import { chapter as elastic, trial, P2, C_T, RHO, R_BALL } from './tut-elastic-lib.js';
import { chapter as fd, spectrum, dissipation, pattern, ZERO } from './tut-fd-lib.js';
import { quadrupoleTide } from './tut-osc-lib.js';

const name = 'tut-read-iv3-capstone';
const check = checker(name);

const G = 6.674e-11;
const KB = 1.380649e-23;
const TEMP = 300;
const KT = KB * TEMP;
const U = 1.66053906660e-27;               // kg, the atomic mass unit
const IRON = 55.845;                       // the atomic mass of iron
const MU_TEXT = 71e9;                      // Pa, the chapter's rounded shear modulus, for the Love numbers
const QS = [5, 20];
const DASH = [2.2, 1.4];

// ---- the numbers --------------------------------------------------------------------------------------------------
function numbers() {
	const N = {};
	const R = R_BALL, V = (4 / 3) * Math.PI * R ** 3, M = RHO * V, mu = RHO * C_T ** 2;
	N.M = M;
	check(M.toFixed(1) === '32.9' && (mu / 1e9).toFixed(0) === '71', `M = ${M}, mu = ${mu}`);
	// (a) the atoms
	const m = IRON * U;
	N.atoms = M / m;
	N.speed = Math.sqrt((3 * KT) / m);
	check(N.atoms.toPrecision(2) === '3.5e+26' && N.speed.toFixed(0) === '366', `the atoms: ${N.atoms}, ${N.speed}`);
	// (b) the notes, from the free sphere's frequency equations (asserted in tut-elastic-lib)
	const notes = elastic(check);
	Object.assign(N, notes);
	check(N.twist.toFixed(1) === '11.9' && N.lamb.toFixed(1) === '12.6' && N.rayleigh.toFixed(1) === '15.1', 'the notes');
	// (c) the jitter: equipartition in the trial shape's stiffness 3 mu V / R^2
	const K = (3 * mu * V) / R ** 2;
	N.qrms = Math.sqrt(KT / K);
	check((K / 1e10).toFixed(1) === '8.9' && (N.qrms * 1e16).toFixed(2) === '2.16' && N.qrms.toPrecision(2) === '2.2e-16', `q_rms = ${N.qrms}`);
	// the same from the push (section 4.6): the trial shape's k_2, its static compliance 2 k_2 R^5 / 3G, the jitter
	// k_B T chi(0) of the moment Q_h for the axial U, and Q_h = 0.490 M R q
	const gs = (G * M) / R ** 2;
	const k2trial = (mu_) => (3 * RHO * gs * R) / (25 * mu_);
	const dQ = ((0.1 + 0.1 + 0.4) / Math.sqrt(1.5)) * M * R;     // U_ij times the change of the second moment per q
	check(near(dQ / (M * R), 0.490, 5e-4) && dQ.toFixed(2) === '1.61', `dQ_h/dq = ${dQ}`);
	const jitter = KT * ((2 * k2trial(mu) * R ** 5) / (3 * G));
	check(near(Math.sqrt(jitter) / dQ, N.qrms, 1e-12 * N.qrms), 'the push does not give equipartition\'s swing');
	// (d) the tide on the axis: 36 G M R q / 5 r^5, and against the quadrupole's tide by differences
	N.tide = (r) => (36 * G * M * R * N.qrms) / 5 / r ** 5;
	check(N.tide(1).toPrecision(3) === '3.41e-25' && N.tide(0.2).toPrecision(3) === '1.07e-21', `the tide ${N.tide(1)}, ${N.tide(0.2)}`);
	const Qm = [[-0.6, 0, 0], [0, -0.6, 0], [0, 0, 1.2]].map((row) => row.map((v) => v * M * R * N.qrms));
	check(near(-quadrupoleTide(Qm, [0, 0, 1])[2][2], N.tide(1), 1e-5 * N.tide(1)), 'the tide is not the quadrupole\'s');
	check(near(N.tide(0.2) / N.tide(1), 5 ** 5, 1e-9), 'the tide does not fall as r^-5');
	// (e) <Qdot_xy^2> = k_B T int rho |grad xy|^2 dV = k_B T int rho (x^2 + y^2) dV, by a grid over the ball
	let s = 0;
	const n = 80, h = (2 * R) / n;
	for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
		const x = -R + (i + 0.5) * h, y = -R + (j + 0.5) * h, z = -R + (k + 0.5) * h;
		if (x * x + y * y + z * z <= R * R) s += RHO * (x * x + y * y) * h ** 3;
	}
	N.ball = 0.4 * M * R ** 2 * KT;
	N.shell = (2 / 3) * M * R ** 2 * KT;
	check(near(s * KT, N.ball, 5e-3 * N.ball), `the grid gives ${s * KT}, not 2/5 M R^2 k_B T`);
	check((N.ball / 1e-22).toFixed(2) === '5.45' && (N.shell / 1e-22).toFixed(2) === '9.08' && near(N.shell / N.ball, 5 / 3, 1e-12), `the bars ${N.ball}, ${N.shell}`);
	check((N.ball / KT).toFixed(3) === '0.132' && (N.shell / KT).toFixed(3) === '0.219', 'the sum rule\'s areas 0.132 and 0.219 kg m^2');
	// (f) the Love numbers for mu = 71 GPa
	N.kelvin = 1.5 / (1 + (19 * MU_TEXT) / (2 * RHO * gs * R));
	N.trial = k2trial(MU_TEXT);
	check((N.kelvin / 1e-16).toFixed(2) === '3.83' && (N.trial / 1e-16).toFixed(2) === '2.91', `k_2 = ${N.kelvin}, ${N.trial}`);
	check(((19 * MU_TEXT) / (2 * RHO * gs * R)).toPrecision(2) === '3.9e+15' && (N.trial / N.kelvin).toFixed(2) === '0.76', 'rigidity over gravity; 19/25');
	check((gs / 1e-7).toFixed(1) === '2.2', `g_s = ${gs}`);
	// (g) the lines (tut-fd-lib: S_q = 2 k_B T Im chi / omega at every frequency, the area pi/2 in these units for
	// any Q); the drawn window's share of each area
	fd(check);
	N.window = QS.map((Q) => {
		let a = 0; const m2 = 20000, d = 1 / m2;
		for (let i = 0; i < m2; i++) a += spectrum(0.5 + (i + 0.5) * d, Q) * d;
		return a / (Math.PI / 2);
	});
	check(N.window[0].toFixed(2) === '0.90' && N.window[1].toFixed(2) === '0.97', `the window holds ${N.window}`);
	for (const Q of QS) check(near(spectrum(1, Q), Q, 1e-12), `the line's peak for Q = ${Q}`);
	// (h) the thermometer: omega S / 2 k_B Im chi returns T at every frequency of the line
	for (const Q of QS) for (let x = 0.5; x <= 1.5; x += 0.01) {
		// in units of omega_0 and K: S = (2 k_B T / K omega_0) spectrum, Im chi = Im(K chi) / K
		const S = ((2 * KT) / (K * 1)) * spectrum(x, Q), imChi = (x * dissipation(x, Q)) / K;
		check(near((x * S) / (2 * KB * imChi), TEMP, 1e-9), `the thermometer at ${x}`);
	}
	return N;
}

// ---- the drawing (figure points, y down) --------------------------------------------------------------------------
// Two layouts (globalThis.figureLayout): the site's, four rows of two columns, to be read at 390 px; the printed
// book's, two rows of four columns, as wide as the text.
const BOOK = globalThis.figureLayout === 'book';
const CWS = BOOK ? [100, 104, 98, 124] : [150, 150];   // the columns' widths: in the book the last is wider, for the tide's numbers
const NCOL = CWS.length;
const GUT = BOOK ? 12 : 18;     // between the columns
const W = CWS.reduce((a, b) => a + b, 0) + (NCOL - 1) * GUT;
const ROW_GAP = 15;             // between rows of panels, from the lowest ink of one to the next row's letters
const BELOW_LETTER = 4;         // from a letter's bottom to its panel's highest mark
const SIZE = 8.5;
const PITCH = 11;               // baseline to baseline of the lines of words

export default async function () {
	const N = numbers();
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - W / 2, col = (k) => x0 + CWS.slice(0, k).reduce((a, b) => a + b, 0) + k * GUT;
	// the width of the column whose left edge is x
	const width = (x) => CWS[CWS.findIndex((_, k) => near(col(k), x, 1e-9))];
	const letter = async (l, x, y) => { const g = await placed(`\\text{(${l})}`, x, y, 0, 0, INK, LETTER); L.push(g); return g.box; };
	// the lowest ink drawn since a mark: of the labels and of the marks
	const since = () => { const l = L.length, m = S.marks.length; return () => Math.max(...L.slice(l).map((g) => g.box.b), ...S.marks.slice(m).flatMap((k) => k.pts.map((p) => p[1] + k.r))); };
	const circle = (c, r, k = 360) => Array.from({ length: k + 1 }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / k), c[1] + r * Math.sin((2 * Math.PI * i) / k)]);
	/** Lines of TeX, left-aligned at x, the first line's middle at y, PITCH apart; returns their labels. */
	const tall = async (src) => { const g = await placed(src, 0, 0, 0, 0, INK, SIZE); return g.box.b - g.box.t; };
	const lines = async (srcs, x, y, color = INK) => { const out = []; for (const [k, src] of srcs.entries()) out.push(await placed(src, x, y + k * PITCH, 0, 0.5, color, SIZE)); L.push(...out); return out; };

	// ---- (a) the body: a section of the ball with its atoms, and the ball's numbers, beside it (site) or under it (book)
	const panelA = async (x, top) => {
		const CW = width(x);
		const low = since();
		const la = await letter('a', x, top);
		const mant = N.atoms.toPrecision(2).split('e+')[0], expo = N.atoms.toPrecision(2).split('e+')[1];
		// the speed named: on one line in the book, on two beside the disc on the site
		const speed = [`\\text{rms speed}`, `${N.speed.toFixed(0)}\\ \\mathrm{m\\,s^{-1}}`];
		const words = [`${N.M.toFixed(1)}\\ \\mathrm{kg}`, `${mant}\\times10^{${expo}}\\ \\text{atoms}`, ...(BOOK ? [speed.join('\\ ')] : speed)];
		// set as one left-aligned array, so that the baselines are evenly spaced whatever each line's powers
		const block = `\\begin{array}{l}${words.join('\\\\[1.5pt]')}\\end{array}`;
		const blockP = await placed(block, 0, 0, 0, 0, INK, SIZE), blockW = blockP.box.r - blockP.box.l;
		const RD = 37;                                           // the disc's radius, points (10 cm)
		const cA = BOOK ? [x + CW / 2 + 4, la.b + BELOW_LETTER + RD] : [x + 3 + RD, top + RD + 1];
		S.raw(`<circle cx="${n2(cA[0])}" cy="${n2(cA[1])}" r="${RD}" fill="${STEEL}" fill-opacity="0.28" stroke="${STEEL}" stroke-width="0.6"/>`, 0);
		S.mark(circle(cA, RD), 0.3, 'the ball');
		if (BOOK) {
			// under the disc, a block of lines centred on it
			check(cA[0] - RD > la.r + 3, 'the letter (a) is on the ball');
			L.push(await placed(block, cA[0] - blockW / 2, cA[1] + RD + 4, 0, 0, INK, SIZE));
		} else {
			// left-aligned at the right of the column, the block's middle level with the disc's centre
			const xWords = x + CW - blockW;
			check(xWords - (cA[0] + RD) > 8, 'the words crowd the ball');
			L.push(await placed(block, xWords, cA[1], 0, 0.5, INK, SIZE));
		}
		// the atoms: 36 places at least DMIN apart within the disc, and an arrow from each along two standard normal
		// deviates, STEM points long plus ARROW points per unit of their size (schematic); the first seed whose arrows
		// clear every other atom and arrow is used
		const ATOMS = 36, DMIN = 8.2, STEM = 2.4, ARROW = 1.6, DOTR = 0.9, AIR = 0.5;
		const seg = (p, a, b) => { const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2; const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / l2)); return Math.hypot(p[0] - a[0] - t * d[0], p[1] - a[1] - t * d[1]); };
		const segSeg = (a, b, c, d) => Math.min(...Array.from({ length: 21 }, (_, i) => seg([a[0] + ((b[0] - a[0]) * i) / 20, a[1] + ((b[1] - a[1]) * i) / 20], c, d)));
		let atoms = null, seed = 0, devs = [];
		while (!atoms && seed < 3000) {
			seed++;
			const u = uniforms(seed), z = normals(1000 + seed), pts = [], vs = [];
			let tries = 0;
			while (pts.length < ATOMS && tries < 20000) {
				tries++;
				const p = [cA[0] + (2 * u() - 1) * RD, cA[1] + (2 * u() - 1) * RD];
				if (Math.hypot(p[0] - cA[0], p[1] - cA[1]) > RD - 4 || pts.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < DMIN)) continue;
				// the letter's corner stays clear
				if (p[0] < la.r + 5 && p[1] < la.b + 5) continue;
				pts.push(p);
				vs.push([z(), z()]);
			}
			if (pts.length < ATOMS) continue;
			const arrows = pts.map((p, i) => { const v = vs[i], l = Math.hypot(...v), e = [v[0] / l, v[1] / l]; return { a: [p[0] + e[0] * (DOTR + 0.5), p[1] + e[1] * (DOTR + 0.5)], b: [p[0] + e[0] * (DOTR + 0.5 + STEM + ARROW * l), p[1] + e[1] * (DOTR + 0.5 + STEM + ARROW * l)], l: STEM + ARROW * l }; });
			let ok = true;
			for (let i = 0; i < ATOMS && ok; i++) {
				const A = arrows[i];
				if (Math.hypot(A.b[0] - cA[0], A.b[1] - cA[1]) > RD - 1.5) ok = false;
				for (let j = 0; j < ATOMS && ok; j++) {
					if (i === j) continue;
					if (seg(pts[j], A.a, A.b) < DOTR + AIR + 0.5) ok = false;
					if (j > i && segSeg(A.a, A.b, arrows[j].a, arrows[j].b) < AIR + 0.5) ok = false;
				}
			}
			if (ok) { atoms = { pts, arrows }; devs = vs.flat(); }
		}
		check(atoms, 'no seed gives atoms whose arrows stand clear');
		// the deviates are standard normal: mean within three standard errors, spread within 25% (72 draws)
		const dm = devs.reduce((a, b) => a + b, 0) / devs.length, ds = Math.sqrt(devs.reduce((a, b) => a + (b - dm) ** 2, 0) / (devs.length - 1));
		check(Math.abs(dm) < 3 / Math.sqrt(devs.length) && Math.abs(ds - 1) < 0.25, `the deviates have mean ${dm} and spread ${ds}`);
		S.raw(atoms.pts.map(([px, py]) => `<circle cx="${n2(px)}" cy="${n2(py)}" r="${DOTR}" fill="${INK}"/>`).join(''), 2);
		for (const p of atoms.pts) S.mark([p], DOTR, 'an atom');
		for (const [i, A] of atoms.arrows.entries()) S.arrow(A.a, A.b, { color: INK, width: 0.45, head: 2.4, layer: 2, what: `an atom's arrow ${i}` });
		window.atomSeed = seed;
		return { bottom: low(), seed };
	};

	// ---- (b) its note: the section with the trial shape's arrows, and the frequency scale beside it (site) or under it
	// (book)
	const panelB = async (x, top) => {
		const CW = width(x);
		const low = since();
		const lb = await letter('b', x, top);
		const PER = BOOK ? 13 : 15;                              // points per kHz
		const F0 = 11, F1 = 16, NOTE = 9, GAP_N = 2.6;
		const RB = BOOK ? 25 : 29;
		const KAPPA = 0.8 * RB / 29;
		const noteList = [
			{ f: N.rayleigh, name: '\\text{Rayleigh}', color: INK, dash: DASH },
			{ f: N.lamb, name: '\\text{exact}', color: INK, dash: null },
			{ f: N.twist, name: '\\text{twist, no tide}', color: DIM, dash: null }
		];
		const nameW = [];
		for (const nt of noteList) { const p = await placed(nt.name, 0, 0, 0, 0, nt.color, SIZE); nameW.push(p.box.r - p.box.l); }
		// the section's centre and the scale's top (16 kHz): side by side, or the section over the scale
		const scaleTop = BOOK ? lb.b + BELOW_LETTER + 2 * RB + 14 : top + 9;
		const fy = (f) => scaleTop + (F1 - f) * PER;
		const xAx = BOOK ? x + CW / 2 - (NOTE + GAP_N + Math.max(...nameW)) / 2 + 12 : x + CW - Math.max(...nameW) - GAP_N - NOTE;
		const fromB = L.length;
		S.path([[xAx, fy(F0)], [xAx, fy(F1)]], { color: DIM, width: AXIS, cap: 'butt', what: 'the frequency scale' });
		for (const f of [F0, F1]) {
			S.path([[xAx, fy(f)], [xAx - TICK, fy(f)]], { color: DIM, width: HAIR, cap: 'butt', what: `the scale's tick at ${f}` });
			L.push(await placed(String(f), xAx - TICK - NUM, fy(f), 1, 0.5, DIM, SIZE));
		}
		L.push(await placed('\\text{kHz}', xAx + 3, fy(F1), 0, 0.5, DIM, SIZE));
		for (const nt of noteList) {
			const y = fy(nt.f);
			check(near(y, scaleTop + (F1 - nt.f) * PER, 1e-9) && nt.f > F0 && nt.f < F1, `the note ${nt.f} is not at its value`);
			S.path([[xAx, y], [xAx + NOTE, y]], { color: nt.color, width: 0.6, cap: 'butt', dash: nt.dash, layer: 2, what: `the note at ${nt.f}` });
			L.push(await placed(nt.name, xAx + NOTE + GAP_N, y, 0, 0.5, nt.color, SIZE));
			L.push(await placed(nt.f.toFixed(1), xAx - TICK - NUM, y, 1, 0.5, nt.color, SIZE));
		}
		// the section: a circle over the neutral tint, and twelve arrows of u = (q/R)(-x/2, z) at half its radius
		const numbersLeft = Math.min(...L.slice(fromB).map((g) => g.box.l));
		const cB = BOOK ? [x + CW / 2 + 4, lb.b + BELOW_LETTER + RB] : [x + 2 + RB, (fy(F0) + fy(F1)) / 2 + 2];
		if (!BOOK) check(numbersLeft - (cB[0] + RB) > 6, 'the section crowds the scale\'s numbers');
		else check(fy(F1) - 6 > cB[1] + RB + 3 && cB[0] - RB > lb.r + 3, 'the section crowds the scale or the letter');
		S.raw(`<path d="${pathOf(circle(cB, RB))}" fill="${TINT}"/>`, -1);
		S.path(circle(cB, RB), { color: INK, width: EDGE, layer: 1, what: 'the section' });
		let orange = 0;
		for (let k = 0; k < 12; k++) {
			const th = (k * Math.PI) / 6, rho = RB / 2;
			const px = rho * Math.sin(th), pz = rho * Math.cos(th);
			const u = trial([px, 0, pz], 1, 1);
			const outward = u[0] * px + u[2] * pz > 0;
			check(outward === P2(Math.cos(th)) > 0, `the arrow at ${k * 30} degrees: its colour does not follow P2`);
			orange += outward;
			const a = [cB[0] + px, cB[1] - pz], b = [cB[0] + px + KAPPA * u[0], cB[1] - pz - KAPPA * u[2]];
			check(Math.hypot(b[0] - cB[0], b[1] - cB[1]) < RB - 2.5, 'an arrow leaves the section');
			S.arrow(a, b, { color: outward ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 3, what: `the arrow at ${k * 30} degrees` });
		}
		check(orange === 6, `${orange} orange arrows, not six`);
		check(lb.b + 2 < cB[1] - RB || lb.r + 2 < cB[0] - RB * 0.7, 'the letter (b) is in the section');
		return { bottom: low() };
	};

	// ---- (c) its jitter: the Gaussian of the swing, down to its axis label at bottom (or of its own height)
	const panelC = async (x, top, bottom) => {
		const CW = width(x);
		const low = since();
		const lc = await letter('c', x, top);
		// its root mean square on the letter's line, as the titles of (e) and (f)
		L.push(await placed(`q_{\\rm rms} = ${N.qrms.toPrecision(2).replace(/e-(\d+)/, '\\times10^{-$1}')}\\ \\mathrm m`, lc.r + 6, (lc.t + lc.b) / 2, 0, 0.5, DIM, SIZE));
		const qr = N.qrms * 1e16;
		const ptop = low() + BELOW_LETTER + 2;
		// from the axis to the foot of its label
		const BELOW = TICK + NUM + Math.max(...await Promise.all(['-8', '0', '4'].map(tall))) + 3.4 + await tall('q\\ \\ (10^{-16}\\ \\mathrm m)');
		const PC = new Plot({ left: x + 6, top: ptop, w: CW - 12, h: bottom ? bottom - BELOW - ptop : 52, x0: -8, x1: 8, y0: 0, y1: 1.18 });
		const gq = (q) => Math.exp(-(q * q) / (2 * qr * qr));
		const cut = merge(PC, CURVE), reach = qr * Math.sqrt(-2 * Math.log(cut));
		const gpts = graph(PC, gq, -reach, reach);
		check(longest(gpts) <= 0.25 + 1e-9, 'the Gaussian is sampled too coarsely');
		S.path(gpts, { color: INK, width: CURVE, layer: 2, what: 'the Gaussian' });
		for (const sg of [-1, 1]) S.path([PC.at(sg * qr, 0), PC.at(sg * qr, gq(qr))], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the vertical at ${sg} q_rms` });
		check(near(gq(qr), Math.exp(-0.5), 1e-12), 'the verticals do not meet the curve at e^-1/2');
		L.push(...await xAxis(S, PC, { ticks: [-8, -6, -4, -2, 0, 2, 4, 6, 8], fmt: (t) => (t % 4 === 0 ? (t < 0 ? `-${-t}` : String(t)) : null), what: 'the swing axis' }));
		const ql = await placed('q\\ \\ (10^{-16}\\ \\mathrm m)', PC.X(0), low() + 3.4, 0.5, 0, DIM, SIZE);
		L.push(ql);
		if (bottom) check(Math.abs(ql.box.b - bottom) < 4, `(c) ends ${ql.box.b - bottom} pt off the row's foot`);
		return { bottom: low() };
	};

	// ---- (d) its tide against distance, log-log, its axis at the foot of its numbers at bottom (or of its own height)
	const panelD = async (x, top, bottom) => {
		const CW = width(x);
		const low = since();
		const ld = await letter('d', x, top);
		// its title on the letter's line, as those of (c), (e) and (f): the quantity and its unit
		L.push(await placed('\\text{tide on the axis},\\ \\mathrm{s^{-2}}', ld.r + 6, (ld.t + ld.b) / 2, 0, 0.5, DIM, SIZE));
		const YLD = 25, ptop = ld.b + BELOW_LETTER + 3;
		const BELOW = TICK + NUM + Math.max(...await Promise.all(['0.1\\ \\mathrm m', '1\\ \\mathrm m', '10\\ \\mathrm m'].map(tall)));
		const PD = new Plot({ left: x + YLD, top: ptop, w: CW - YLD - 9, h: bottom ? bottom - BELOW - ptop : 66, x0: -1, x1: 1, y0: -30, y1: -19 });
		const lt = (r) => Math.log10(N.tide(r));
		S.path([PD.at(-1, lt(0.1)), PD.at(1, lt(10))], { color: ACCENT, width: CURVE, layer: 2, what: 'the tide' });
		check(lt(0.1) < PD.y1 && lt(10) > PD.y0, 'the tide leaves the chart');
		check(near((lt(10) - lt(0.1)) / 2, -5, 1e-12), 'the line\'s slope is not -5');
		// ticks every two decades, at the odd ones, so that the lowest number stands clear of the distances under the axis
		L.push(...await yAxis(S, PD, { ticks: [-29, -27, -25, -23, -21, -19], fmt: (t) => `10^{${t}}`, what: 'the tide axis' }));
		L.push(...await xAxis(S, PD, { ticks: [-1, 0, 1], fmt: (t) => ({ '-1': '0.1\\ \\mathrm m', 0: '1\\ \\mathrm m', 1: '10\\ \\mathrm m' })[t], what: 'the distance axis' }));
		// the slope triangle under the line, from 2 to 5 m
		const A2 = PD.at(Math.log10(2), lt(2)), A5 = PD.at(Math.log10(5), lt(5)), corner = [A2[0], A5[1]];
		S.path([A2, corner, A5], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the slope triangle' });
		check(near((lt(5) - lt(2)) / Math.log10(5 / 2), -5, 1e-12), 'the triangle\'s slope');
		L.push(await S.clear('r^{-5}', corner[0] - LABEL_GAP - 0.3, (A2[1] + corner[1]) / 2, 1, 0.5, [-1, 0], { color: DIM }));
		// the two dots and their values
		for (const r of [0.2, 1]) {
			const p = PD.at(Math.log10(r), lt(r));
			S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="1.25" fill="${INK}"/>`, 3);
			S.mark([p], 1.25, `the dot at ${r} m`);
			const [mt, ex] = N.tide(r).toPrecision(3).split('e');
			L.push(await S.clear(`${mt}\\times10^{${Number(ex)}}`, p[0] + 3, p[1] - 1, 0, 1, [0.6, -0.8]));
		}
		return { bottom: low() };
	};

	// ---- (e) and (f): two bars each, under a title; the bars' names at bottom (or the bars of their own height)
	const titled = async (l, x, top, srcs) => {
		const lt = await letter(l, x, top);
		// the first line level with the letter, the next under it with the labels' air between
		let g = await placed(srcs[0], lt.r + 6, (lt.t + lt.b) / 2, 0, 0.5, DIM, SIZE);
		L.push(g);
		for (const src of srcs.slice(1)) { g = await placed(src, lt.r + 6, g.box.b + LABEL_GAP + 0.6, 0, 0, DIM, SIZE); L.push(g); }
		return lt;
	};
	const bars = async (x, barTop, bottom, top, ticks, items, what) => {
		const YL = 16, BW = 27, BGAP = 17, BELOW = 3.2 + Math.max(...await Promise.all(items.map((it) => tall(it.name))));
		const P = new Plot({ left: x + YL, top: barTop, w: 2 * BW + BGAP + 12, h: bottom ? bottom - BELOW - barTop : 54, x0: 0, x1: 1, y0: 0, y1: top });
		L.push(...await yAxis(S, P, { ticks, fmt: (t) => String(t), what: `${what}'s axis` }));
		S.path([[P.left, P.bottom], [P.left + 6 + 2 * BW + BGAP + 6, P.bottom]], { color: DIM, width: AXIS, cap: 'butt', what: `${what}'s base` });
		const out = [];
		for (const [k, it] of items.entries()) {
			const l = P.left + 6 + k * (BW + BGAP), r = l + BW, t = P.Y(it.v);
			check(near(P.bottom - t, (it.v / top) * P.h, 1e-9), `the bar ${it.name} is not at its value`);
			S.fill(`M${n2(l)},${n2(P.bottom)}V${n2(t)}H${n2(r)}V${n2(P.bottom)}Z`, { l, r, t, b: P.bottom }, { color: TINT, layer: 0, what: `the bar ${it.name}`, solid: false });
			S.path([[l, P.bottom], [l, t], [r, t], [r, P.bottom]], { color: INK, width: DATA, cap: 'butt', layer: 1, what: `the bar ${it.name}` });
			const val = await placed(it.v.toFixed(2), (l + r) / 2, t + DATA / 2 + LABEL_GAP + 0.4, 0.5, 0, INK, SIZE);
			val.on = [`the bar ${it.name}`];
			L.push(val);
			L.push(await placed(it.name, (l + r) / 2, P.bottom + 3.2, 0.5, 0, INK, SIZE));
			out.push({ l, r, t });
		}
		return { P, out };
	};
	const qdot = '\\langle\\dot Q_{xy}^2\\rangle', qunit = '10^{-22}\\ \\mathrm{kg^2\\,m^4\\,s^{-2}}';
	const panelEF = async (xe, xf, top, bottom) => {
		const low = since();
		const le = await titled('e', xe, top, BOOK ? [qdot + ',', qunit] : [`${qdot},\\ ${qunit}`]);
		const lf = await titled('f', xf, top, ['k_2,\\ 10^{-16}']);
		void le; void lf;
		const barTop = low() + 7;
		// (e) the tremor of the quadrupole xy, for the ball and the thin shell
		const E = await bars(xe, barTop, bottom, 10, [0, 5, 10],
			[{ v: N.ball / 1e-22, name: '\\text{ball}' }, { v: N.shell / 1e-22, name: '\\text{thin shell}' }], 'the tremor');
		// the elbow from the ball's top to the shell's, and its ratio
		const [eb, es] = E.out, xm = (eb.r + es.l) / 2;
		S.path([[eb.r + 1.6, eb.t], [xm, eb.t], [xm, es.t], [es.l - 1.6, es.t]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the elbow' });
		check(near(E.P.bottom - es.t, (5 / 3) * (E.P.bottom - eb.t), 1e-9), 'the bars are not as 5 : 3');
		L.push(await S.clear('5/3', xm - LABEL_GAP - 0.3, (eb.t + es.t) / 2, 1, 0.5, [-1, 0], { color: DIM }));
		// (f) the Love number from Kelvin's formula and from the trial shape
		const F = await bars(xf, barTop, bottom, 4, [0, 2, 4],
			[{ v: N.kelvin / 1e-16, name: '\\text{Kelvin}' }, { v: N.trial / 1e-16, name: '\\text{trial shape}' }], 'the Love number');
		const ft = F.out[1];
		if (BOOK) {
			// over the trial shape's bar, which is the lower
			const g2 = await placed('\\text{is stiffer}', (ft.l + ft.r) / 2, ft.t - DATA / 2 - LABEL_GAP - 0.4, 0.5, 1, DIM, SIZE);
			const g1 = await placed('\\text{the guess}', (ft.l + ft.r) / 2, g2.box.t - 3.2, 0.5, 1, DIM, SIZE);
			L.push(g1, g2);
		} else {
			const g1 = await placed('\\text{the guess}', ft.r + 7, ft.t + 1, 0, 0.5, DIM, SIZE);
			const g2 = await placed('\\text{is stiffer}', ft.r + 7, g1.box.b + 3.2, 0, 0, DIM, SIZE);
			L.push(g1, g2);
		}
		return { bottom: low() };
	};

	// ---- (g) its line: the two lines and their areas, down to the axis label at bottom (or of its own height)
	const panelG = async (x, top, bottom) => {
		const CW = width(x);
		const low = since();
		const lg = await letter('g', x, top);
		const ptop = lg.b + BELOW_LETTER + 2;
		const BELOW = TICK + NUM + Math.max(...await Promise.all(['0.5', '1', '1.5'].map(tall))) + 3.4 + await tall('\\omega/\\omega_0');
		const PG = new Plot({ left: x + 8, top: ptop, w: CW - 16, h: bottom ? bottom - BELOW - ptop : 60, x0: 0.5, x1: 1.5, y0: 0, y1: 21.5 });
		// a line is drawn only where it stands at least twice the strokes' half-widths clear of the axis, so that neither
		// runs along it; the areas run over the whole window
		const cutG = 2 * merge(PG, 0.9);
		const WIDTH = { 5: 0.45, 20: 0.9 };
		for (const Q of QS) {
			const f = (z) => spectrum(z, Q);
			let a = 0.5; while (f(a) < cutG) a += 1e-4;
			let b = 1.5; while (f(b) < cutG) b -= 1e-4;
			const pts = graph(PG, f, a, b, 0.2);
			check(longest(pts) <= 0.2 + 1e-9, `the line for Q = ${Q} is sampled too coarsely`);
			const area = [PG.at(0.5, 0), ...graph(PG, f, 0.5, 1.5, 0.2), PG.at(1.5, 0)];
			S.raw(`<path d="${pathOf(area)}" fill="${INK}" fill-opacity="0.075"/>`, 0);
			S.path(pts, { color: INK, width: WIDTH[Q], layer: 2, what: `the line for Q = ${Q}` });
			check(near(f(1), Q, 1e-12) && PG.Y(Q) > PG.top, `the line for Q = ${Q} peaks at ${f(1)}`);
		}
		L.push(...await xAxis(S, PG, { ticks: [0.5, 1, 1.5], fmt: (t) => String(t), what: 'the frequency axis' }));
		const wl = await placed('\\omega/\\omega_0', PG.X(1), low() + 3.4, 0.5, 0, DIM, SIZE);
		L.push(wl);
		if (bottom) check(Math.abs(wl.box.b - bottom) < 4, `(g) ends ${wl.box.b - bottom} pt off the row's foot`);
		L.push(await S.clear('Q = 20', PG.X(0.985), PG.Y(17.5), 1, 0.5, [-1, 0]));
		L.push(await S.clear('Q = 5', PG.X(1.1), PG.Y(4.2), 0, 0.5, [1, 0]));
		if (BOOK) {
			// in two lines, right of the tall line's peak
			const a1 = await S.clear('\\text{same area,}', x + CW, PG.Y(14), 1, 0.5, [0, -1]);
			const a2 = await placed('k_BT/K', a1.box.r, a1.box.b + 3.2, 1, 0, INK, SIZE);
			L.push(a1, a2);
		} else L.push(await S.clear('\\text{same area, } k_BT/K', x + CW, PG.Y(13), 1, 0.5, [0, -1]));
		return { bottom: low() };
	};

	// ---- (h) the thermometer: the shell drive, the pixel and the ball, and the temperature they return
	const panelH = async (x, top) => {
		const CW = width(x);
		const low = since();
		const lh = await letter('h', x, top);
		const A = 31, WEIGHT = 2.4, BASE = 0.5, NS = 3600;
		// the shell's centre: 4 points in from the column's left on the site; in the book the shell and the ball centred
		// in the column, whose ink runs from the shell's left to the ball's right, 2 A + 1.5 WEIGHT + 10 + 0.84 A
		const span = 2 * A + 1.5 * WEIGHT + 10 + 0.84 * A;
		const O = [(BOOK ? x + (CW - span) / 2 + WEIGHT / 2 : x + 4 + 3) + A, lh.b + BELOW_LETTER + WEIGHT + A];
		const at = (psi, r = A) => [O[0] + r * Math.sin(psi), O[1] - r * Math.cos(psi)];
		S.path(Array.from({ length: 721 }, (_, k) => at((k * Math.PI) / 360)), { color: INK, width: BASE, layer: 1, what: 'the shell' });
		const w = (psi) => WEIGHT * Math.abs(pattern(psi));
		const bands = [];
		let run = null;
		for (let k = 0; k <= NS; k++) {
			const psi = (2 * Math.PI * k) / NS, v = pattern(psi), on = w(psi) >= BASE;
			if (on && (!run || Math.sign(v) !== run.sign)) { if (run) bands.push(run); run = { sign: Math.sign(v), psis: [] }; }
			if (on) run.psis.push(psi);
			else if (run) { bands.push(run); run = null; }
		}
		if (run) bands.push(run);
		if (bands.length === 5 && bands[0].sign === bands[4].sign) { bands[0].psis = [...bands[4].psis.map((p) => p - 2 * Math.PI), ...bands[0].psis]; bands.pop(); }
		check(bands.length === 4 && bands.filter((b) => b.sign > 0).length === 2, `the pattern has ${bands.length} bands`);
		for (const b of bands) {
			const outer = b.psis.map((p) => at(p, A + w(p) / 2)), inner = b.psis.map((p) => at(p, A - w(p) / 2)).reverse();
			S.fill(pathOf([...outer, ...inner]), { l: 0, r: 0, t: 0, b: 0 }, { color: b.sign > 0 ? ACCENT : ACCENT2, layer: 1.2, what: 'a band', solid: false });
			S.mark(b.psis.map((p) => at(p)), Math.max(...b.psis.map(w)) / 2, 'a band');
		}
		check(pattern(Math.PI / 2) > 0 && pattern(0) < 0 && near(w(ZERO), 0, 1e-12), 'orange at the equator, blue at the poles');
		// the pixel: twelve beads on a small ring
		const rp = A / 6;
		S.path(circle(O, rp), { color: INK, width: 0.4, layer: 2, what: 'the pixel\'s ring' });
		for (let k = 0; k < 12; k++) S.sphere([O[0] + rp * Math.cos((k * Math.PI) / 6), O[1] + rp * Math.sin((k * Math.PI) / 6)], 1.05 * A / 31, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `a bead ${k}`);
		// the ball outside the shell at the right
		const RBALL = 0.42 * A, cBall = [O[0] + A + WEIGHT + 10 + RBALL, O[1]];
		S.raw(`<circle cx="${n2(cBall[0])}" cy="${n2(cBall[1])}" r="${n2(RBALL)}" fill="${STEEL}"/>`, 1);
		S.mark(circle(cBall, RBALL), 0, 'the ball');
		check(cBall[0] + RBALL < x + CW, 'the ball leaves the column');
		const T = 'T = \\omega S_{yy}/2k_B\\,\\mathrm{Im}\\,\\chi_{yy}', K300 = '300\\ \\mathrm K';
		const yT = O[1] + A + WEIGHT + 6;
		if (BOOK) {
			// in two lines, centred under the drawing
			const t1 = await placed(T, x + CW / 2, yT, 0.5, 0, INK, SIZE);
			const t2 = await placed(`{} = ${K300}`, x + CW / 2, t1.box.b + 3.2, 0.5, 0, INK, SIZE);
			L.push(t1, t2);
		} else L.push(await placed(`${T} = ${K300}`, x + CW / 2, yT, 0.5, 0, INK, SIZE));
		return { bottom: low() };
	};

	let seed;
	if (!BOOK) {
		const T1 = ORIGIN - 300;
		const A = await panelA(col(0), T1);
		seed = A.seed;
		const B = await panelB(col(1), T1);
		const T2 = Math.max(A.bottom, B.bottom) + ROW_GAP;
		const C = await panelC(col(0), T2, 0);
		const D = await panelD(col(1), T2, 0);
		const T3 = Math.max(C.bottom, D.bottom) + ROW_GAP;
		const EF = await panelEF(col(0), col(1), T3, 0);
		const T4 = EF.bottom + ROW_GAP;
		await panelG(col(0), T4, 0);
		await panelH(col(1), T4);
	} else {
		// the first row's foot is set by (a) and (b), whose heights are their drawings'; (c) and (d) fill it. The second
		// row's by (h); (e), (f) and (g) fill it
		const T1 = ORIGIN - 160;
		const A = await panelA(col(0), T1);
		seed = A.seed;
		const B = await panelB(col(1), T1);
		const foot1 = Math.max(A.bottom, B.bottom);
		await panelC(col(2), T1, foot1);
		await panelD(col(3), T1, foot1);
		const T2 = foot1 + ROW_GAP;
		const H = await panelH(col(3), T2);
		await panelEF(col(0), col(1), T2, H.bottom);
		await panelG(col(2), T2, H.bottom);
	}

	// ---- checks: the columns keep to their widths, and nothing touches
	for (const g of L) {
		const inside = Array.from({ length: NCOL }, (_, k) => g.box.l >= col(k) - 0.01 && g.box.r <= col(k) + CWS[k] + 0.01).some(Boolean);
		check(inside, `the label ${g.src} crosses a gutter`);
	}
	for (const g of L) g.on = g.on ?? [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIv3Capstone = { seed, window: N.window, notes: [N.twist, N.lamb, N.rayleigh], qrms: N.qrms, k2: [N.kelvin, N.trial] };
	return finish(S, L, BOOK ? [420, 470] : [240, 340]);
}
