// The tutorial, reading section R13b (tutorial/what-a-field-keeps/reading-sections-xiv-and-xv.md), its second diagram:
// the capstone, the paper's Table VIII (tab:hair) redrawn for two bodies of one mass, the 0.905 K black hole and a
// uniform rocky moon of 3000 kg m^-3. The chapter's table of seven rows (a) to (g) stands directly under the figure, so
// the figure draws only what the table cannot: the two bodies and the tide, and row (d) as two rulers.
//  At the top, the two bodies, not to scale: the hole a near-black disc (11.1's fill) with a thin grey ring for its
//  horizon, tagged "0.905 K" and "r_s = 0.201 mm"; the moon a disc in matter's pale fill with an edge of matter's colour
//  (R13's ball, figs/tut-read-ball-shell.js), tagged "3000 kg m^-3" and "R_m = 2210 km". Between them the one tide, a
//  small bell curve of its strength against time, "one tide, about a second" (the chapter's standard deviation of one
//  second), with a grey arrow to each body, "slow" to the hole and "fast" to the moon. "not to scale" at the left,
//  level with the discs.
//  Below, "(d) the sums" at the left, and under each body a short line with a tick at each degree's shell radius: the
//  hole's five, 1.0175, 1.4555, 1.6100, 1.6868 and 1.7324 r_s, on a line from r_s to 2 r_s, with the limit
//  (3 sqrt3 / e) r_s = 1.9116 r_s dashed; the moon's three, R_m [3/(2l + 1)]^(1/(2l - 2)) for l = 2, 3, 4, on a line
//  from R_m/2 to R_m, with its surface dashed; each line's ends named beside it, "r_s" and "2r_s", "R_m/2" and "R_m";
//  under it the first tick numbered, "1.02 r_s" and "0.775 R_m", and the dashed one, "1.91 r_s" and "surface";
//  "fails the test of positive mass" | "passes the test of positive mass" above (no section number, which differs between site and book).
//  The head's row is named in the names' column, as (d) is: "the bodies", and under it "not to scale".
// The colours: matter's colour for the moon's disc only (the moon's side); the hole's fill fixed dark, as 11.1's;
// everything else in ink and the page's greys. Orange and blue, a stretch and a squeeze, are not used: nothing here is
// stretched or squeezed.
// Departures from the diagram's comment, where the chapter's text decides: rows (a) to (c) and (e) to (g) are left to
// the chapter's table, which the figure repeated word for word; (d)'s tags are "fails the test of positive mass" and
// "passes the test of positive mass", and the dashed lines are named "1.91 r_s" and "surface"; each body's line has its
// own scale, given by its two numbers,
// and the ticks are to scale along it, so the caption says so instead of calling them schematic; the caption's "too
// slowly at the third step", which the chapter does not say, becomes "fail it".
// Exact: every number, the table's included (the figure checks the chapter's table though it draws only (d)), computed
// here from G, c, hbar, k_B (the tutorial's, figs/tut-hawking-lib.js), the hole's 0.905 K, the moon's 3000 kg m^-3, 61
// GPa and the tide's impulse 10^-10 s^-1 over a standard deviation of one second, and asserted against the chapter's
// text, except the hole's shell radii beyond the first (13.7's numerical integrals), 13.8's count of 2.8 x 10^5 cells
// and 1176 bits' model, which are asserted against the chapter and checked where a formula allows; the ticks' places.
// Schematic: the discs, the bell's size and the arrows.
import { tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { G, C, HBAR, KB, HOLE, MATTER, palette, massAt } from './tut-hawking-lib.js';

const name = 'tut-read-hole-moon';
const check = checker(name);
const FILE = '/tutorial/what-a-field-keeps/reading-sections-xiv-and-xv.md';

// ---- the scene (SI) -------------------------------------------------------------------------------------------------
const T = 0.905;                          // K, the hole's temperature
const RHO = 3000;                         // kg m^-3, the moon's density
const MU = 61e9;                          // Pa, the moon's rigidity
const SIGMA = 1;                          // s, the tide's standard deviation
const EPS = 1e-10;                        // s^-1, the tide's time integral, R13's impulse strength
const SNR1 = 1e6;                         // (a)'s signal-to-noise ratio
const T_MOON = 1000;                      // K, (e)'s chosen temperature
const HOLE_RADII = [1.0175, 1.4555, 1.6100, 1.6868, 1.7324];   // r_s, l = 2 to 6 (13.7's integrals)
const CELLS = 2.8e5;                      // (g): 13.8's count for the moon

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const SIZE = 9.6;                         // every label: R11's and R13's capstones
const NW = 62;                            // the names' column: "not to scale" and (d)'s name
const CW = 140;                           // each body's column
const GUT = 10;                           // between the columns
const LEAD = 12;                          // baseline to baseline within a tag
const D_GAP = 13;                         // the head's ink to (d)'s
const R_HOLE = 8.5, R_MOON = 14;          // the discs' radii (not to scale)
const RING = 0.6, EDGE = 0.6;             // the horizon's ring, the moon's edge
const BELL = { w: 30, h: 15, width: 0.6 };// the tide's bell: its width (six standard deviations) and height
const ARROW = { head: 3.6, air: 2.6 };    // the arrows from the tide: their heads, and their air at each end
const AXIS = { len: 84, width: 0.45 };    // (d): each body's line, its ends named beside it
const TICK = { h: 3.6, width: 0.6 };      // (d): half a tick, its stroke
const LIMIT = { h: 5.4, width: 0.5, dash: [1.4, 1.1] };   // (d): the dashed limit, half its height
const PALE = 'light-dark(color-mix(in srgb, #f1dc86 72%, #fffffe), color-mix(in srgb, #f1dc86 20%, #fffffe))';   // matter's pale fill (R13's ball)
const CAPTION = 'The hole and the moon under one tide of about a second, and row (d) of the table below as two rulers of shell radii: the moon\'s climb toward its surface and pass the test of positive mass, while the hole\'s climb toward $1.91\\,r_s$ and fail it. The numbers are exact and the ticks are to scale along each line; the discs are not to scale.';

/** The numbers, computed and checked against the chapter's text. */
async function numbers() {
	const md = await (await fetch(FILE)).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sci = (x, d) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(d)}e${e}`; };
	// the bodies
	const M = massAt(T), rs = (2 * G * M) / C ** 2, Rm = Math.cbrt((3 * M) / (4 * Math.PI * RHO));
	check(sci(M, 3) === '1.356e23' && (rs * 1e3).toFixed(3) === '0.201' && (Rm / 1e3).toFixed(0) === '2210', `the bodies ${M} ${rs} ${Rm}`);
	has('The capstone sets the 0.905 K hole beside a rocky moon of the same mass, $\\matter M = 1.356\\times10^{23}$ kg, uniform at 3000 kg m⁻³, of radius $R_{\\rm m} = (3\\matter M/4\\pi\\matter\\rho)^{1/3} = 2210$ km.', 'the bodies');
	has('$\\matter M = 1.356\\times10^{23}$ kg, $r_s = 0.201$ mm', 'the hole\'s radius');
	// the tide: a bell of standard deviation one second whose time integral is epsilon; slow for the hole, fast for the moon
	const e0 = EPS / (SIGMA * Math.sqrt(2 * Math.PI)), x1 = (G * M * 1) / C ** 3;
	check(sci(e0, 1) === '4.0e-11' && sci(x1, 1) === '3.4e-13', `the tide ${e0} ${x1}`);
	has('whose strength rises and falls as a bell curve with a standard deviation of one second. It peaks at $4.0\\times10^{-11}\\unit{s^{-2}}$, and its time integral, the impulse strength $\\epsilon$ of the ball and shell above, is $10^{-10}\\unit{s^{-1}}$. The tide is slow for the hole, with $x = 3.4\\times10^{-13}$ at $\\omega = 1\\unit{s^{-1}}$, and fast for the moon', 'the tide');
	// (a) one time at 10^6: the hole's seven numbers, the moon's bits from 3 R_m (the paper's eq:hair-bits, as R13's)
	const bitsHole = 7 * Math.log2(SNR1);
	const L = Math.log(SNR1), Lam = Math.log(3), H = (L ** 3 / (3 * Lam * Lam) + (L * L) / (2 * Lam)) / Math.LN2;
	check(bitsHole.toFixed(1) === '139.5' && H.toFixed(0) === '1176', `(a) ${bitsHole} ${H}`);
	has('| (a) one time, $\\SNR = 10^6$ | seven numbers, $7\\log_2\\SNR = 139.5$ bits | 1176 bits from $3R_{\\rm m}$ | 3.8, 11.2 |', '(a)');
	// (b) Kelvin's rule with 61 GPa
	const gs = (G * M) / Rm ** 2, k2 = 1.5 / (1 + (19 * MU) / (2 * RHO * gs * Rm));
	check(gs.toFixed(2) === '1.85' && k2.toFixed(3) === '0.031', `(b) ${gs} ${k2}`);
	has('| (b) a steady tide | $k_2 = 0$ | $k_2 = 0.031$ | 4.6, 11.4 |', '(b)');
	has('with $g_{\\rm s} = 1.85\\unit{m\\,s^{-2}}$ the moon\'s surface gravity and $\\sym{shear-modulus}{\\matter\\mu}$ its rigidity, gives 0.031 for 61 GPa', '(b)\'s rigidity');
	// (c) the reply at omega = 1 s^-1: the hole's friction nu omega, the moon's dust -A/omega^2
	const nu = (M * rs ** 5) / (90 * C ** 3), A = (M * Rm * Rm) / 5;
	check(sci(nu, 2) === '1.85e-23' && sci(A, 2) === '1.32e35', `(c) ${nu} ${A}`);
	// the two forms of the friction agree: nu = (16/45) G^5 M^6 / c^13 = M r_s^5 / 90 c^3
	check(near(nu / ((16 / 45) * G ** 5 * M ** 6 / C ** 13), 1, 1e-12), `the friction's two forms ${nu}`);
	has('| (c) the tide, at $\\omega = 1\\unit{s^{-1}}$ | slow: $\\mathrm{Im}\\,\\chi = \\nu\\omega = 1.85\\times10^{-23}\\unit{kg\\,m^2\\,s^2}$ | fast: $\\chi = -A/\\omega^2 = -1.32\\times10^{35}\\unit{kg\\,m^2\\,s^2}$, $A = \\tfrac15\\matter MR_{\\rm m}^2$ | 4.5, 11.4 |', '(c)');
	has('(c) The hole answers with friction, a quarter of a cycle behind. The moon, driven faster than its bonds, answers as dust, in step', '(c)\'s words');
	// (d) the sums: the shells' radii, the limit, and the test of positive mass
	const first = Math.sqrt(3 * (5 / (32 * Math.PI)) * 6.938), limit = (3 * Math.sqrt(3)) / Math.E;
	check(Math.abs(first - HOLE_RADII[0]) < 1e-4 && limit.toFixed(4) === '1.9116', `(d) the hole's first radius ${first}, the limit ${limit}`);
	has('they are 1.0175, 1.4555, 1.6100, 1.6868 and $1.7324\\,r_s$ for $\\ell = 2$ to 6', 'the hole\'s radii');
	has('Their limit is $(3\\sqrt3/e)\\,r_s = 1.9116\\,r_s$', 'the hole\'s limit');
	check(HOLE_RADII.every((r, j) => j === 0 || r > HOLE_RADII[j - 1]) && HOLE_RADII.at(-1) < limit, 'the hole\'s radii do not climb toward the limit');
	const [m1, m2, m3] = [HOLE_RADII[0] ** 2, HOLE_RADII[1] ** 4, HOLE_RADII[2] ** 6];
	check((m2 * m2 / (m1 * m3)).toFixed(3) === '1.117', `the hole's test ${m2 * m2 / (m1 * m3)}`);
	has('so $m_2^2/m_1m_3 = 1.117$', 'the hole\'s test');
	const moonRadii = [2, 3, 4].map((l) => (3 / (2 * l + 1)) ** (1 / (2 * l - 2)));
	check(moonRadii.map((r) => r.toFixed(3)).join() === '0.775,0.809,0.833', `the moon's radii ${moonRadii}`);
	const [n1, n2_, n3] = [moonRadii[0] ** 2, moonRadii[1] ** 4, moonRadii[2] ** 6];
	check(near(n2_ * n2_ / (n1 * n3), 45 / 49, 1e-12) && 45 / 49 < 1, 'the moon\'s test is not 45/49');
	has('$R_{\\rm m}[3/(2\\ell + 1)]^{1/(2\\ell - 2)}$, or $0.775$, $0.809$ and $0.833\\,R_{\\rm m}$, climbing toward its surface', 'the moon\'s radii');
	has('| (d) the sums | $0.345\\,\\matter Mr_s^2 = 1.90\\times10^{15}\\unit{kg\\,m^2}$; shell at 0.205 mm; fails | $A$; shell at $0.775R_{\\rm m}$; passes, $\\tfrac{45}{49}$ | 4.5, 13.7 |', '(d)');
	// (e) the tremor: S_Q = 2 k_B T nu returns 0.905 K; the moon's whole interior
	const SQ = 2 * KB * T * nu;
	check(sci(SQ, 2) === '4.62e-46', `(e) ${SQ}`);
	has('| (e) the tremor | $S_Q = 4.62\\times10^{-46}\\unit{kg^2\\,m^4\\,s}$: 0.905 K |', '(e)');
	has('(e) The hole\'s thermometer returns 0.905 K, and so its mass.', '(e)\'s hole');
	has('and with every pair of profiles it holds the whole interior.', '(e)\'s moon');
	// (f) the weighing: the hole's nu times the integral of the tide's rate squared, the moon's epsilon^2 A
	const rate2 = 2 * e0 * e0 * Math.sqrt(Math.PI) / (2 * SIGMA);   // E_xx = -E_yy = e(t): E_ij E_ij = 2 e^2; the integral of edot^2
	const Ehole = nu * rate2, Emoon = EPS * EPS * A;
	check(sci(rate2, 1) === '2.8e-21' && sci(Ehole, 1) === '5.2e-44' && sci(Emoon, 2) === '1.32e15' && (Emoon / C ** 2 * 1e3).toFixed(0) === '15', `(f) ${rate2} ${Ehole} ${Emoon}`);
	has('| (f) a weighing after the tide | $\\nu\\int\\dot{\\curv\\tE}_{ij}\\dot{\\curv\\tE}_{ij}\\,\\dd t = 5.2\\times10^{-44}$ J | $\\tfrac12\\epsilon^2\\int\\matter\\rho\\,\\lvert\\nabla g\\rvert^2\\,\\dd V = 1.32\\times10^{15}$ J | 1.7, 6.4, 11.4 |', '(f)');
	has('(f) Weighed after the tide, the moon has gained $\\epsilon^2A$, or 15 g, a reading of its density', '(f)\'s moon');
	has('$\\int\\dot{\\curv\\tE}_{ij}\\dot{\\curv\\tE}_{ij}\\,\\dd t = 2.8\\times10^{-21}\\unit{s^{-5}}$; the gain returns its mass again.', '(f)\'s hole');
	// (g) the ceilings M c l / hbar within three radii: the hole's 1450 bits, the moon's cells of 55 km
	const ceilHole = (M * C * 3 * rs) / HBAR, ceilMoon = (M * C * 3 * Rm) / HBAR, bitsMax = 7 * Math.log2(ceilHole);
	const cell = Rm * Math.cbrt((4 * Math.PI) / (3 * CELLS));
	check(sci(ceilHole, 1) === '2.3e62' && bitsMax.toFixed(0) === '1450' && sci(ceilMoon, 1) === '2.6e72' && Math.abs(cell / 1e3 - 55) < 1, `(g) ${ceilHole} ${bitsMax} ${ceilMoon} ${cell}`);
	has('| (g) the most any camera could read | 1450 bits at $2.3\\times10^{62}$ | at most $2.8\\times10^5$ cells at $2.6\\times10^{72}$ | 8.6, 13.8 |', '(g)');
	has('There pairs of held masses could resolve at most $2.8\\times10^5$ cells, each 55 km across', '(g)\'s cells');
	// the rows' names, the table's first column
	const steps = [...text.matchAll(/^\| \(([a-g])\) ([^|]*?) \|/gm)].map((m) => `(${m[1]}) ${m[2]}`);
	check(steps.join('; ') === ROWS.map((r) => r[0].replace('|', ' ').replace('\\mathrm{SNR}', '\\SNR').replace('\\ \\mathrm{s^{-1}}', '\\unit{s^{-1}}')).join('; '), `the steps ${steps.join('; ')}`);
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-hole-moon}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-hole-moon}`, 'the caption');
	return { M, rs, Rm, moonRadii, limit };
}

// ---- the table's rows' names, (a) to (g), checked against the chapter's first column; the drawing shows (d) only, the
// one row that is a picture (the others are the chapter's table).
const ROWS = [
	['(a) one time,|$\\mathrm{SNR} = 10^6$'],
	['(b) a steady tide'],
	['(c) the tide, at|$\\omega = 1\\ \\mathrm{s^{-1}}$'],
	['(d) the sums'],
	['(e) the tremor'],
	['(f) a weighing|after the tide'],
	['(g) the most any|camera could read']
];

/** A label's TeX: text, with any $...$ set in maths. */
const textOf = (s) => s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');

export default async function () {
	const N = await numbers();
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	const lbl = (src, x, y, ax, ay, color = INK) => placed(src, x, y, ax, ay, color, SIZE);
	const widthOf = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	// a label with its baseline at y, its ink centred on x (or, with `left`, its ink's left at x)
	const atBase = async (src, x, y, color = INK, left = false) => {
		const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
		const g = await tex(src, [x - (left ? probe.l : (probe.l + probe.r) / 2), y], SIZE, 'lB', color);
		return { src, svg: g, box: boxOf(g) };
	};
	// lines one under another: each baseline LEAD below the last, or lower if its ink would come within LABEL_GAP of
	// the line above
	const stack = async (srcs, x, base, color = INK, left = false) => {
		const out = [];
		let b = base;
		for (const [j, src] of srcs.entries()) {
			if (j) {
				const pr = await atBase(src, x, 0, color, left);
				b = Math.max(b + LEAD, out.at(-1).box.b + LABEL_GAP + 0.2 - pr.box.t);
			}
			out.push(await atBase(src, x, b, color, left));
		}
		return out;
	};
	const circlePts = (c, rr, n = 96) => Array.from({ length: n + 1 }, (_, i) => [c[0] + rr * Math.cos((2 * Math.PI * i) / n), c[1] + rr * Math.sin((2 * Math.PI * i) / n)]);

	// ---- the columns ------------------------------------------------------------------------------------------------
	const W = NW + 2 * (GUT + CW);
	const X0 = ORIGIN - W / 2, X1 = X0 + W;
	const HX = X0 + NW + GUT + CW / 2, MX = HX + CW + GUT;      // the hole's and the moon's columns' centres
	const inColumn = (g, cx, what) => check(g.box.l >= cx - CW / 2 - 0.01 && g.box.r <= cx + CW / 2 + 0.01, `${what} leaves its column`);

	// ---- the head: the two bodies, their names and tags, and the tide between them -----------------------------------
	const top = ORIGIN - 160;
	const nameH = await lbl('\\text{the hole}', HX, top, 0.5, 0);
	const nameM = await lbl('\\text{the moon}', MX, top, 0.5, 0);
	L.push(nameH, nameM);
	const cy = Math.max(nameH.box.b, nameM.box.b) + LABEL_GAP + 1.2 + R_MOON;
	// the hole: 11.1's near-black fill, a thin grey ring for its horizon
	S.raw(`<circle cx="${n2(HX)}" cy="${n2(cy)}" r="${n2(R_HOLE - RING / 2)}" fill="${HOLE}" stroke="${DIM}" stroke-width="${RING}"/>`, 2);
	S.mark(circlePts([HX, cy], R_HOLE - RING / 2), RING / 2, 'the hole');
	// the moon: matter's pale fill inside an edge of matter's colour
	S.raw(`<circle cx="${n2(MX)}" cy="${n2(cy)}" r="${n2(R_MOON - EDGE / 2)}" fill="${PALE}" stroke="${MATTER}" stroke-width="${EDGE}"/>`, 2);
	S.mark(circlePts([MX, cy], R_MOON - EDGE / 2), EDGE / 2, 'the moon');
	// the tags under the discs, two lines each, their first baselines shared
	const tagTop = cy + R_MOON + LABEL_GAP + 1.2;
	const probe = await lbl('\\text{0}', 0, 0, 0, 0);
	const tags = [[HX, ['0.905 K', '$r_s = 0.201$ mm']], [MX, ['3000 $\\mathrm{kg\\,m^{-3}}$', '$R_{\\rm m} = 2210$ km']]];
	// the first lines' baselines shared, the highest ink at tagTop
	let tagBase = -Infinity;
	for (const [x, lines] of tags) tagBase = Math.max(tagBase, tagTop - (await atBase(textOf(lines[0]), x, 0)).box.t);
	let headB = 0;
	for (const [x, lines] of tags) for (const g of await stack(lines.map(textOf), x, tagBase)) {
		L.push(g); inColumn(g, x, `the tag ${g.src}`);
		headB = Math.max(headB, g.box.b);
	}
	// the tide: a bell of strength against time, halfway between the columns, its foot a little below the discs' centres
	const BX = (HX + MX) / 2, foot = cy + 4;
	const bell = Array.from({ length: 61 }, (_, i) => { const u = -3 + i / 10; return [BX + (u * BELL.w) / 6, foot - BELL.h * Math.exp(-u * u / 2)]; });
	S.path(bell, { color: INK, width: BELL.width, layer: 2, what: 'the tide' });
	S.path([[BX - BELL.w / 2 - 1, foot], [BX + BELL.w / 2 + 1, foot]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the tide\'s time' });
	const second = await atBase(textOf('about a second'), BX, 0);
	// the two lines above the bell's top, their second's ink LABEL_GAP + 0.4 above it
	const peak = foot - BELL.h;
	const base2 = peak - LABEL_GAP - 0.4 - second.box.b;
	for (const [j, s] of ['one tide,', 'about a second'].entries()) L.push(await atBase(textOf(s), BX, base2 - (1 - j) * LEAD));
	// the arrows from the tide to each body, level with the discs' centres, and their words under them
	const aL = S.arrow([BX - BELL.w / 2 - ARROW.air, cy], [HX + R_HOLE + ARROW.air, cy], { color: DIM, width: HAIR + 0.1, head: ARROW.head, layer: 2, what: 'the arrow to the hole' });
	const aR = S.arrow([BX + BELL.w / 2 + ARROW.air, cy], [MX - R_MOON - ARROW.air, cy], { color: DIM, width: HAIR + 0.1, head: ARROW.head, layer: 2, what: 'the arrow to the moon' });
	check(aL.head === ARROW.head && aR.head === ARROW.head, 'an arrow from the tide is too short for a whole head');
	for (const [a, word] of [[aL, 'slow'], [aR, 'fast']]) {
		const g = await lbl(`\\text{${word}}`, (a.A[0] + a.B[0]) / 2, cy + HAIR + LABEL_GAP + 0.4, 0.5, 0);
		L.push(g);
		check(g.box.l > Math.min(a.A[0], a.B[0]) && g.box.r < Math.max(a.A[0], a.B[0]), `"${word}" overhangs its arrow`);
	}
	// the row's name, in the names' column, level with the discs: "the bodies", and under it "not to scale"
	L.push(await lbl('\\text{the bodies}', X0, cy - 2.2, 0, 1, INK));
	L.push(await lbl('\\text{not to scale}', X0, cy + 2.2, 0, 0, DIM));
	headB = Math.max(...L.map((g) => g.box.b));

	// ---- (d), the one row of the table that is a picture: under each body, its line of shells ----------------------
	const cap = await atBase('\\text{(a)}', 0, 0);
	const base = headB + D_GAP - cap.box.t;
	const nm = await atBase(textOf(ROWS[3][0]), X0, base, INK, true);
	L.push(nm);
	check(nm.box.r <= X0 + NW + 0.01, '(d)\'s name is wider than its column');
	const low = Math.max(await ruler(HX, base, 'hole'), await ruler(MX, base, 'moon'));
	check(low > base, '(d) is empty');
	S.checkAll(L);
	window[name] = { N, W, HX, MX };
	return finish(S, L, [330, 390]);

	// ---- (d): each body's line, its ticks at the shells' radii, the limit dashed, two numbers, and the test --------
	async function ruler(cx, base, who) {
		const hole = who === 'hole';
		const [r0, r1] = hole ? [1, 2] : [0.5, 1];
		const radii = hole ? HOLE_RADII : N.moonRadii, lim = hole ? N.limit : 1;
		const xa = cx - AXIS.len / 2, X = (r) => xa + ((r - r0) / (r1 - r0)) * AXIS.len;
		// the test's word on the first line
		const tg = await atBase(`\\text{${hole ? 'fails the test of positive mass' : 'passes the test of positive mass'}}`, cx, base);
		L.push(tg); inColumn(tg, cx, `(d)'s ${who} word`);
		// the two lines level: under the lower of the two words' ink (the moon's, whose p descends)
		const low0 = (await atBase('\\text{passes the test of positive mass}', cx, base)).box.b;
		check(tg.box.b <= low0 + 0.01, '(d): the hole\'s word descends below the moon\'s');
		const ya = low0 + LABEL_GAP + 0.6 + LIMIT.h;
		S.path([[xa, ya], [xa + AXIS.len, ya]], { color: INK, width: AXIS.width, cap: 'butt', layer: 1, what: `(d)'s ${who} line` });
		for (const [j, r] of radii.entries()) {
			const x = X(r);
			S.path([[x, ya - TICK.h], [x, ya + TICK.h]], { color: INK, width: TICK.width, cap: 'butt', layer: 2, what: `(d)'s ${who} tick ${j}` });
		}
		// the ticks apart enough to be seen as ticks
		for (let j = 1; j < radii.length; j++) check(X(radii[j]) - X(radii[j - 1]) >= 3.5, `(d): the ${who}'s ticks ${j - 1} and ${j} are too close`);
		const xl = X(lim);
		{
			const len = 2 * LIMIT.h, n = Math.round((len + LIMIT.dash[1]) / (LIMIT.dash[0] + LIMIT.dash[1])), f = (len + LIMIT.dash[1]) / (n * (LIMIT.dash[0] + LIMIT.dash[1]));
			S.raw(`<path d="M${n2(xl)},${n2(ya - LIMIT.h)}V${n2(ya + LIMIT.h)}" stroke="${INK}" stroke-width="${LIMIT.width}" stroke-dasharray="${n2(LIMIT.dash[0] * f)} ${n2(LIMIT.dash[1] * f)}" fill="none"/>`, 2);
			S.mark([[xl, ya - LIMIT.h], [xl, ya + LIMIT.h]], LIMIT.width / 2, `(d)'s ${who} limit`);
		}
		check(X(radii.at(-1)) < xl - 3 && xl <= xa + AXIS.len + 0.01, `(d): the ${who}'s last tick and its limit`);
		// the numbers under the first tick and the limit, their caps LABEL_GAP below the dashes' foot
		const nb = ya + LIMIT.h + LABEL_GAP + 0.4 + (probe.box.b - probe.box.t);
		let low = 0;
		// the line's ends, named beside it on its level
		for (const [x, s, ax] of [[xa, hole ? 'r_s' : 'R_{\\rm m}/2', 1], [xa + AXIS.len, hole ? '2r_s' : 'R_{\\rm m}', 0]]) {
			const g = await lbl(s, x + (ax ? -1 : 1) * (LABEL_GAP + 1), ya, ax, 0.5);
			L.push(g); inColumn(g, cx, `(d)'s ${who} end ${s}`);
		}
		for (const [x, s] of [[X(radii[0]), hole ? '1.02\\,r_s' : '0.775\\,R_{\\rm m}'], [xl, hole ? '1.91\\,r_s' : '\\text{surface}']]) {
			const g = await atBase(s, x, nb);
			L.push(g); inColumn(g, cx, `(d)'s ${who} number ${s}`);
			low = Math.max(low, g.box.b);
		}
		check(near(Number((hole ? 1.0175 : N.moonRadii[0]).toFixed(hole ? 2 : 3)), hole ? 1.02 : 0.775) && near(Number(lim.toFixed(2)), hole ? 1.91 : 1), `(d): the ${who}'s numbers`);
		return low;
	}
}
