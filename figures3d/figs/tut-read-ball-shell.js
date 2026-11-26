// The tutorial, reading section R13 (tutorial/what-a-field-keeps/reading-sections-xii-and-xiii.md), its second diagram:
// the capstone, section 13.1's steel ball (radius 0.5 m, 4110 kg) and a thin shell of the same mass and radius
// followed through Part 13's readings in seven small panels, (a) to (g), the rows of the chapter's capstone table, in
// two rows, four and three (as R11's capstone, figs/tut-read-vii-capstone.js), each panel with the ball above and the
// shell below, drawn alike at one radius, and its numbers beneath it, the ball's before the shell's.
//  (a) one time: grey arrows of pull, the same round both bodies; "ball" and "shell" named at the left.
//      "1176 bits, both".
//  (b) heat: a few short ink arrows of the parts' thermal motion in each (the same pattern of directions is not
//      implied: they are drawn at fixed pseudo-random places). "tremor k_B T x 411 : 685 kg m^2".
//  (c) a push: the impulses of the profile g = (x^2 - y^2)/2, along (x, -y): orange outward along x and blue inward
//      along y (a true stretch and squeeze), and beside each body a grey bar of its energy gained, in the ratio
//      2.06 : 3.43 (3 : 5). "2.06 : 3.43 x 10^-18 J".
//  (d) one ripple: crisp, lightly tinted bands, the crests of cos(xi x) with |xi| R = pi (where it is positive), one
//      metre apart and to scale, across both bodies, a crest through their centres. "1250 kg against 0; span e^pi = 23".
//  (e) the tonne's pass: its straight path at b = 1.5 m = 3R from each centre, to scale, a bead at the closest point,
//      b dimensioned on the ball's. "4.55 : 4.70 x 10^-33 of its speed; inside 2.1 : 3.5 x 10^-34".
//  (f) light: a flash on the same line, a thin dashed ray in the light role's colour. "the same reading at
//      3.1 x 10^23 J".
//  (g) the 1/c^2 bracket: the counter-turning ball, its inner part out to 2^(-1/5) R in the pale tone of matter's
//      colour and its outer part in a deeper tone, small curved ink arrows turning each way, named +Omega and -Omega;
//      the shell at rest. "0.111 M Omega R^4 / c^2 against 0".
// Under each row, a thin grey arrow carries a panel's quantity into the next where the next reuses it: the profile g
// from (b) to (c), and C from (e) to (f).
// The colours: the bodies in matter's colour (the ball's fill matter's light gold mixed with the page, as chapter
// 4.2's and 10.1's fills, figs/tut-glow-lib.js; its edge and the shell's ring matter's colour); orange and blue only
// for the stretch and the squeeze of (c); the light role's colour for (f)'s ray; everything else in ink and greys. In
// (g) the two parts turn in opposite senses, which is not a stretch and a squeeze, so they are two tones of matter's
// colour with direct labels, not orange and blue.
// Departures from the diagram's comment, where the chapter's text decides: every tag gives the ball's number and then
// the shell's, as the table does (so (e) gives 4.55 : 4.70 x 10^-33 and 2.1 : 3.5 x 10^-34, not the ball's alone); (b)'s
// numbers are the tremor over k_B T, in kg m^2, so the tag says "k_B T x"; the inner part of (g) is pale and the outer
// deep, not orange and blue; the reuse arrows run under each row, since the strip has two; the caption says which
// marks are to scale (the bands, the bars and the paths are) and which tag comes first.
// Exact: every number (computed here with R = 0.5 m, steel's 7850 kg m^-3, G and c, and asserted against the
// chapter's text); the ratio of the bars; the bands' spacing and phase against the bodies' radius; b = 3R; the inner
// part's radius in (g). Schematic: the lengths and places of the arrows and the bead's size.
import { tex, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { turning } from './tut-flow-lib.js';
import { G, C as LIGHTSPEED, LIGHT, MATTER, palette } from './tut-hawking-lib.js';

const name = 'tut-read-ball-shell';
const check = checker(name);

// ---- the scene (SI) -------------------------------------------------------------------------------------------------
const R = 0.5;                              // m, the radius of both
const STEEL = 7850;                         // kg m^-3, section 1.8's steel
const M = (4 / 3) * Math.PI * R ** 3 * STEEL;   // kg, 4110
const SNR = 1e6, RC = 3;                    // (a): the signal-to-noise ratio, the camera's distance in radii
const EPS = 1e-10;                          // s^-1, (c)'s strength
const MU = 1000, V = 44e3, B = 1.5;         // (e): the tonne, its speed, the distance of its path
const OMEGA = 100;                          // s^-1, (g)'s rate of turning
const SPLIT = 2 ** (-1 / 5);                // (g): the inner ball's radius, in R

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const SIZE = 9.6;                           // every label and number: R11's capstone
const GUT = 12;                             // between the panels
const RB = 19;                              // a body's radius on the page
const D = 32;                               // the ball's and the shell's centres, above and below the drawing's middle
const DH = 2 * (D + RB + 11);               // a panel's drawing, its height under the letter
const ROWS = [
	[['a', 'one time', 84, 54], ['b', 'heat', 80, 40], ['c', 'a push', 76, 31], ['d', 'one ripple', 96, 48]],
	[['e', 'the tonne\'s pass', 100, 30], ['f', 'light', 84, 23], ['g', 'the $1/c^2$ bracket', 90, 24]]
];                                          // [key, word, width, the bodies' centre from the panel's left]
const LETTER_AIR = 3;                       // the letter's foot to the drawing's room
const NUM_AIR = 5;                          // the drawing's room to its numbers' caps
const NUM_PITCH = 12;                       // baseline to baseline within a number
const CARRY_AIR = 6.5;                      // the lowest number of a row to the carrying arrow under it
const ROW_AIR = 16;                         // the carrying arrow's label to the next row's letters
const EDGE = 0.6;                           // the ball's edge, in matter's colour
const RING = 1.7;                           // the shell's ring, in matter's colour
const PULL = { from: 10, to: 2.4, head: 2.8, width: 0.5 };          // (a): the arrows of pull, from and to the surface
const JIG = { len: 6.6, head: 2.4, width: 0.5 };                     // (b): the arrows of thermal motion
const KICK = { from: 1.2, to: 10.2, head: 3.4, width: 0.75 };       // (c): the impulses, from and to the surface
const BAR = { gap: 5.5, w: 3, top: 2 };                          // (c): the bars, beside the impulses; the shell's spans 2R - top
const BAND_OPACITY = 0.09;                  // (d): the crests' flat tint, ink over everything
const BEAD = 2.2;                           // (e): the tonne
const PATH = { over: 6.5, width: 0.5, head: 3, dash: [2.2, 1.6] };   // (e), (f): the paths run this far past the body
const SPIN = { inner: 0.56, width: 0.45, head: 2.5, band: 0.35, bandHead: 2 };   // (g): the inner arrows' radius (of R) and strokes; the outer part's, thinner, to keep to its band
const CARRY = { head: 3.4 };

const PALE = 'light-dark(color-mix(in srgb, #f1dc86 72%, #fffffe), color-mix(in srgb, #f1dc86 20%, #fffffe))';   // matter's pale fill (figs/tut-glow-lib.js)
const DEEP = 'light-dark(color-mix(in srgb, #533f03 55%, #fffffe), color-mix(in srgb, #f1dc86 40%, #fffffe))';   // (g): a deeper tone of matter's colour
const CAPTION = 'Look first at panel (a), where the two bodies cannot be told apart, and then at (b) and (c), where heat and one push separate them by three to five. Each tag gives the ball\'s number before the shell\'s. The numbers are exact; the bands, bars and paths are to scale, and the arrows are schematic.';
const POINTER = 'through Part 13\'s readings (Figure [](#fig:read-ball-shell)).';

/** The numbers, computed and checked against the chapter's text. */
async function numbers() {
	const md = await (await fetch('/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sci = (x, d) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(d)}e${e}`; };
	// the bodies
	check(M.toFixed(0) === '4110', `the ball's mass ${M}`);
	has('The capstone follows section 13.1\'s steel ball, 1 m across and 4110 kg, and a thin shell of the same mass and radius, $R = 0.5$ m', 'the bodies');
	const ch18 = (await (await fetch('/tutorial/newton/orbits-and-kicks.md')).text()).replace(/\s+/g, ' ');
	check(ch18.includes('The ball is steel, of density $7850\\unit{kg\\,m^{-3}}$, radius 0.5 m and mass 4110 kg'), 'section 1.8\'s steel ball');
	// (a) the bits of one reading from 3R at 10^6
	const L = Math.log(SNR), Lam = Math.log(RC), H = (L ** 3 / (3 * Lam * Lam) + (L * L) / (2 * Lam)) / Math.LN2;
	check(H.toFixed(0) === '1176', `H = ${H}`);
	has('| (a) one time | the bits of one reading from $3R$ at $10^6$ | 1176 bits | the same | 2.5, 3.8 |', '(a)');
	has('(a) At one time the two bodies are one scene, to every bit.', '(a)\'s note');
	// (b) the tremor over k_B T: the integral of rho |grad g|^2 = rho (x^2 + y^2), two thirds of the integral of rho r^2
	const IB = (2 / 3) * (3 / 5) * M * R * R, IS = (2 / 3) * M * R * R;
	check(IB.toFixed(0) === '411' && IS.toFixed(0) === '685' && near(IB / IS, 0.6), `the tremors ${IB} ${IS}`);
	has('| (b) heat | $\\langle\\matter{\\dot Q_g}^2\\rangle = \\kB T\\int\\matter\\rho\\,\\lvert\\nabla g\\rvert^2\\,\\dd V$, $g = \\tfrac12(x^2 - y^2)$ | $411\\unit{kg\\,m^2}$ | $685\\unit{kg\\,m^2}$ | 4.2 |', '(b)');
	has('(b) Heat breaks the tie: the tremors are 3 : 5.', '(b)\'s note');
	// (c) the push with the same profile g: its energy, and its weight
	const EB = 0.5 * EPS * EPS * IB, ES = 0.5 * EPS * EPS * IS;
	check(sci(EB, 2) === '2.06e-18' && sci(ES, 2) === '3.43e-18', `the energies ${EB} ${ES}`);
	check(sci(EB / LIGHTSPEED ** 2, 2) === '2.29e-35' && sci(ES / LIGHTSPEED ** 2, 2) === '3.81e-35', 'the weights');
	has('| (c) a push | $\\tfrac12\\epsilon^2\\int\\matter\\rho\\,\\lvert\\nabla g\\rvert^2\\,\\dd V$, $\\epsilon = 10^{-10}\\unit{s^{-1}}$; over $c^2$ | $2.06 \\times 10^{-18}$ J, $2.29 \\times 10^{-35}$ kg | $3.43 \\times 10^{-18}$ J, $3.81 \\times 10^{-35}$ kg | 1.7, 6.4 |', '(c)');
	has('This profile stretches along $x$ as much as it squeezes along $y$', 'the profile\'s stretch and squeeze');
	has('The impulses along $(x, -y)$ are the gradient of the profile $\\tfrac12(x^2 - y^2)$ (section 1.7)', 'the impulses\' direction');
	// (d) one ripple at |xi| R = pi: the ball's transform 3M/pi^2, the shell's M sin(pi)/pi = 0, crests 1 m apart
	const x = Math.PI, TB = (3 * M * (Math.sin(x) - x * Math.cos(x))) / x ** 3, TS = (M * Math.sin(x)) / x;
	check(near(TB, (3 * M) / (Math.PI ** 2), 1e-9) && TB.toPrecision(3) === '1.25e+3' && Math.abs(TS) < 1e-9, `the transforms ${TB} ${TS}`);
	check(near((2 * Math.PI) / (x / R), 1, 1e-12) && Math.exp(Math.PI).toFixed(0) === '23', 'the crests are not a metre apart');
	has('| (d) one ripple | $\\matter{\\tilde\\rho}(\\vect\\xi) = \\int\\matter\\rho\\,e^{i\\vect\\xi\\cdot\\vect x}\\,\\dd V$ at $x = \\lvert\\vect\\xi\\rvert R = \\pi$: $3\\matter M(\\sin x - x\\cos x)/x^3$ and $\\matter M\\sin x/x$ | $3\\matter M/\\pi^2$, 1250 kg | 0 | 13.2 |', '(d)');
	has('(d) With crests 1 m apart, the ripple averages to zero over a sphere of radius $R$', '(d)\'s crests');
	has('the exponentials span only $e^{\\pi} = 23$', '(d)\'s span');
	// (e) the tonne's pass: F(b) for the ball, shell by shell, and for the shell; slowing and interior over mu V^2
	const Cpass = (2 * G * MU) / V;
	const Fshell = (r) => { const q = Math.sqrt(B * B - r * r); return r < 1e-12 ? 1 / (B * B) : Math.atan(r / q) / (r * q); };
	let Fball = 0;
	{
		const n = 20000;
		for (let i = 0; i <= n; i++) { const r = (R * i) / n, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; Fball += w * ((3 * r * r) / R ** 3) * Fshell(r); }
		Fball *= R / n / 3;
	}
	const slow = (F) => (0.5 * Cpass * Cpass * M * F) / (MU * V * V);
	const SB = slow(Fball), SS = slow(Fshell(R)), IBp = slow(Fball - 1 / (B * B)), ISp = slow(Fshell(R) - 1 / (B * B)), REC = slow(1 / (B * B));
	check(sci(SB, 2) === '4.55e-33' && sci(SS, 2) === '4.70e-33' && sci(IBp, 1) === '2.1e-34' && sci(ISp, 1) === '3.5e-34' && sci(REC, 2) === '4.34e-33', `the pass ${SB} ${SS} ${IBp} ${ISp} ${REC}`);
	has('| (e) the tonne\'s pass | $b = 1.5$ m, $V = 44\\unit{km\\,s^{-1}}$; slowing $\\Delta E/\\matter\\mu V^2$ | $4.55 \\times 10^{-33}$, $2.1 \\times 10^{-34}$ inside | $4.70 \\times 10^{-33}$, $3.5 \\times 10^{-34}$ inside | 1.8, 13.1 |', '(e)');
	has('(e) The tonne\'s recoil, $4.34 \\times 10^{-33}$ of its speed, is the same for both; the interiors take nearly 3 : 5 again.', '(e)\'s note');
	check(near(B / R, 3), 'the pass is not at 3R');
	// (f) light on the same line: C = 4Gp/c^2 = 2G mu/V, so E = pc = mu c^3/2V
	const p = (MU * LIGHTSPEED ** 2) / (2 * V), E = p * LIGHTSPEED;
	check(near((4 * G * p) / LIGHTSPEED ** 2, Cpass, 1e-24) && sci(E, 1) === '3.1e23', `the flash ${E}`);
	has('| (f) light | $C = 4Gp/c^2 = 2G\\matter\\mu/V$, so $E = pc = \\matter\\mu c^3/2V$ | $3.1 \\times 10^{23}$ J | the same | 13.5 |', '(f)');
	has('The particle without mass has $H = -(8Gp/c^3)\\ln|\\vect x_\\perp - \\vect b|$', 'the flash\'s path');
	// (g) the bracket of the energy's quadrupoles for the counter-turning ball, against the shell at rest
	const k = (16 / 35) * (1 - 2 ** (-2 / 5)), Q = (k * M * OMEGA * R ** 4) / LIGHTSPEED ** 2;
	check(k.toFixed(3) === '0.111' && sci(Q, 1) === '3.2e-14', `the bracket ${k} ${Q}`);
	has('| (g) the $1/c^2$ bracket | $\\{\\matter{Q_{x^2-y^2}}, \\matter{Q_{2xy}}\\}$, swirl at $\\Omega = 100\\unit{s^{-1}}$ against rest | $3.2 \\times 10^{-14}\\unit{kg\\,m^2\\,s}$ | 0 | 13.4, 13.6 |', '(g)');
	has('(g) The ball\'s two parts turn against each other and show no flow outside, yet its bracket is $0.111\\,\\matter M\\Omega R^4/c^2$.', '(g)\'s note');
	has('the sphere of section 2.8, whose inner ball out to $2^{-1/5}R$ turns one way and the rest the other', 'the inner ball\'s radius');
	// the steps' names, the table's first column
	const steps = [...text.matchAll(/^\| \(([a-g])\) ([^|]*?) \|/gm)].map((m) => `${m[1]} ${m[2]}`);
	check(steps.join() === 'a one time,b heat,c a push,d one ripple,e the tonne\'s pass,f light,g the $1/c^2$ bracket', `the steps ${steps}`);
	check(ROWS.flat().map((r) => `${r[0]} ${r[1]}`).join() === steps.join(), 'the panels are not the table\'s steps');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-ball-shell}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-ball-shell}`, 'the caption');
	if (drawn) has(POINTER, 'the pointer');
	return { H, IB, IS, EB, ES, TB, SB, SS, IBp, ISp, E, k };
}

// ---- the numbers under the panels: exactly the chapter's (asserted in numbers()) ------------------------------------
const NUMS = {
	a: ['1176\\ \\text{bits,}', '\\text{both}'],
	b: ['\\text{tremor } k_BT\\,\\times', '411 : 685\\ \\mathrm{kg\\,m^2}'],
	c: ['2.06 : 3.43', '\\times10^{-18}\\ \\mathrm{J}'],
	d: ['1250\\ \\mathrm{kg}\\text{ against 0;}', '\\text{span }e^{\\pi} = 23'],
	e: ['4.55 : 4.70\\times10^{-33}', '\\text{of its speed; inside}', '2.1 : 3.5\\times10^{-34}'],
	f: ['\\text{the same reading}', '\\text{at }3.1\\times10^{23}\\ \\mathrm{J}'],
	g: ['0.111\\,M\\Omega R^4/c^2', '\\text{against 0}']
};
// the quantities carried from one panel into the next: [from, to, the label]
const CARRIED = [['b', 'c', 'g'], ['e', 'f', 'C']];

export default async function () {
	const N = await numbers();
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const DEFS = [];

	const lbl = (src, x, y, ax, ay, color = INK) => placed(src, x, y, ax, ay, color, SIZE);
	const widthOf = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const placedBase = async (src, x, y, color = INK) => {
		const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
		const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
		return { src, svg: g, box: boxOf(g) };
	};
	const circlePts = (c, rr, n = 96) => Array.from({ length: n + 1 }, (_, i) => [c[0] + rr * Math.cos((2 * Math.PI * i) / n), c[1] + rr * Math.sin((2 * Math.PI * i) / n)]);
	const disc = (c, rr, fill, layer, what) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(rr)}" fill="${fill}"/>`, layer);
		S.mark(circlePts(c, rr), 0, what);
	};
	// the ball: matter's pale fill inside an edge of matter's colour, its outer edge at RB
	const ball = (c, what, fill = PALE) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(RB - EDGE / 2)}" fill="${fill}" stroke="${MATTER}" stroke-width="${EDGE}"/>`, 2);
		S.mark(circlePts(c, RB - EDGE / 2), EDGE / 2, what);
	};
	// the shell: a thin ring in matter's colour, its outer edge at RB
	const shell = (c, what) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(RB - RING / 2)}" fill="none" stroke="${MATTER}" stroke-width="${RING}"/>`, 2);
		S.mark(circlePts(c, RB - RING / 2), RING / 2, what);
	};
	const bodies = (p) => {
		const bc = [p.bx, p.cy - D], sc = [p.bx, p.cy + D];
		if (p.key !== 'g') ball(bc, `(${p.key})'s ball`);
		shell(sc, `(${p.key})'s shell`);
		return [bc, sc];
	};

	// ---- the panels' places: letters, the room of each drawing, the numbers under each row ---------------------------
	const W = Math.max(...ROWS.map((row) => row.reduce((s, q) => s + q[2], 0) + (row.length - 1) * GUT));
	const x0 = ORIGIN - W / 2;
	const panels = [];
	const LT = (await lbl('\\text{(a) one time}', 0, 0, 0, 0)).box;
	const letterH = LT.b - LT.t;
	const DRAW = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };
	let py = ORIGIN - 170;
	const rowsDone = [];
	for (const [row, list] of ROWS.entries()) {
		const rowW = list.reduce((s, q) => s + q[2], 0) + (list.length - 1) * GUT;
		let px = x0 + (W - rowW) / 2;
		const cy = py + letterH + LETTER_AIR + DH / 2;
		const pr = [];
		for (const [key, word, w, bx] of list) {
			const p = { key, word, w, px, py, cy, cx: px + w / 2, bx: px + bx, row, top: cy - DH / 2, bot: cy + DH / 2 };
			p.m0 = S.marks.length; p.b0 = S.boxes.length; p.l0 = L.length; p.numLabels = [];
			L.push(await lbl(`\\text{(${key}) }${word.split(/(\$[^$]*\$)/).filter(Boolean).map((s) => (s.startsWith('$') ? s.slice(1, -1) : `\\text{${s}}`)).join('')}`, px, py, 0, 0));
			await DRAW[key](p);
			p.m1 = S.marks.length; p.b1 = S.boxes.length; p.l1 = L.length;
			pr.push(p); panels.push(p);
			px += w + GUT;
		}
		// every drawing keeps to its room
		for (const p of pr) {
			const ys = [...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.flatMap((q) => [q[1] - m.r, q[1] + m.r])), ...S.boxes.slice(p.b0, p.b1).flatMap((b) => [b.box.t, b.box.b]), ...L.slice(p.l0 + 1, p.l1).flatMap((g) => [g.box.t, g.box.b])];
			check(Math.min(...ys) >= p.top - 0.01 && Math.max(...ys) <= p.bot + 0.01, `(${p.key})'s drawing leaves its room: ${(Math.min(...ys) - p.top).toFixed(2)}, ${(p.bot - Math.max(...ys)).toFixed(2)}`);
		}
		// the numbers: under the row's room, each panel's lines centred on its bodies, the rows' baselines shared
		const capTop = cy + DH / 2 + NUM_AIR;
		const probe = await lbl('\\text{0}', 0, 0, 0, 0);
		const base0 = capTop + (probe.box.b - probe.box.t);
		let lowest = 0;
		for (const p of pr) {
			let prevB = -Infinity, prevBase = -Infinity;
			for (const [j, s] of NUMS[p.key].entries()) {
				const wd = await widthOf(s);
				check(wd <= p.w - 2, `(${p.key}): the number's line ${s} is ${wd.toFixed(1)} pt, wider than its panel`);
				// centred on the panel, or in (a), whose names stand at its left, on the bodies
				const tx = p.key === 'a' ? p.bx : p.cx;
				const pr0 = await placedBase(s, tx, 0);
				const base = j === 0 ? base0 : Math.max(prevBase + NUM_PITCH, prevB + LABEL_GAP + 0.1 - pr0.box.t);
				const g = await placedBase(s, tx, base);
				prevB = g.box.b; prevBase = base;
				L.push(g); p.numLabels.push(g);
				lowest = Math.max(lowest, g.box.b);
			}
		}
		// the quantity carried along the row: a grey arrow under the numbers, its label under its middle
		let bottom = lowest;
		for (const [from, to, q] of CARRIED) {
			const a = pr.find((p) => p.key === from), b = pr.find((p) => p.key === to);
			if (!a || !b) continue;
			const y = lowest + CARRY_AIR;
			const ar = S.arrow([a.cx, y], [b.cx, y], { color: DIM, width: HAIR, head: CARRY.head, layer: 2, what: `the arrow carrying ${q}` });
			check(ar.head === CARRY.head, `the arrow carrying ${q} is too short for a whole head`);
			const g = await lbl(q, (a.cx + b.cx) / 2, y + HAIR / 2 + LABEL_GAP + 0.2, 0.5, 0);
			L.push(g);
			bottom = Math.max(bottom, g.box.b);
		}
		rowsDone.push({ cy, lowest, bottom, top: py });
		py = bottom + ROW_AIR;
	}

	// ---- every panel keeps to its own column --------------------------------------------------------------------------
	for (const p of panels) {
		const xs = [
			...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.flatMap((q) => [q[0] - m.r, q[0] + m.r])),
			...S.boxes.slice(p.b0, p.b1).flatMap((b) => [b.box.l, b.box.r]),
			...[...L.slice(p.l0, p.l1), ...p.numLabels].flatMap((g) => [g.box.l, g.box.r])
		];
		check(Math.min(...xs) >= p.px - 0.01 && Math.max(...xs) <= p.px + p.w + 0.01, `(${p.key}) leaves its column: ${(Math.min(...xs) - p.px).toFixed(2)}, ${(p.px + p.w - Math.max(...xs)).toFixed(2)}`);
	}
	// the gutters keep their air: no two panels' ink nearer than 6 pt
	for (const row of [0, 1]) {
		const pr = panels.filter((p) => p.row === row);
		for (let i = 0; i + 1 < pr.length; i++) {
			const right = (p) => Math.max(...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.map((q) => q[0] + m.r)), ...[...L.slice(p.l0, p.l1), ...p.numLabels].map((g) => g.box.r));
			const left = (p) => Math.min(...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.map((q) => q[0] - m.r)), ...[...L.slice(p.l0, p.l1), ...p.numLabels].map((g) => g.box.l));
			check(left(pr[i + 1]) - right(pr[i]) >= 6, `(${pr[i].key}) and (${pr[i + 1].key}) are ${(left(pr[i + 1]) - right(pr[i])).toFixed(2)} pt apart`);
		}
	}

	S.checkAll(L);
	window[name] = { N, W, panels: panels.map((p) => ({ key: p.key, px: p.px, w: p.w })) };
	return finish(S, L, [330, 390], DEFS.join(''));

	// ======================================================================================================================
	// the seven drawings, each in its panel's room (p.px to p.px + p.w, p.top to p.bot), the bodies at p.bx
	async function drawA(p) {
		const [bc, sc] = bodies(p);
		for (const [c, who] of [[bc, 'ball'], [sc, 'shell']]) {
			for (let k = 0; k < 8; k++) {
				const a = ((22.5 + 45 * k) * Math.PI) / 180, u = [Math.cos(a), -Math.sin(a)];
				const A0 = [c[0] + (RB + PULL.from) * u[0], c[1] + (RB + PULL.from) * u[1]], B0 = [c[0] + (RB + PULL.to) * u[0], c[1] + (RB + PULL.to) * u[1]];
				const ar = S.arrow(A0, B0, { color: DIM, width: PULL.width, head: PULL.head, layer: 3, what: `the pull on the ${who}, ${k}` });
				check(ar.head === PULL.head, '(a): a pull\'s head is not whole');
			}
			// the body's name at the left, level with its centre
			L.push(await lbl(`\\text{${who}}`, p.px, c[1], 0, 0.5));
		}
	}

	async function drawB(p) {
		const [bc, sc] = bodies(p);
		// fixed pseudo-random places and directions, in units of R and degrees: inside the ball, on the shell's ring
		const inBall = [[-0.46, -0.14, 200], [-0.02, -0.5, 75], [0.46, -0.12, 320], [-0.12, 0.08, 35], [0.22, 0.44, 250], [-0.4, 0.3, 130]];
		for (const [j, [ux, uy, deg]] of inBall.entries()) {
			const A0 = [bc[0] + ux * RB, bc[1] + uy * RB], d = [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)];
			const B0 = [A0[0] + JIG.len * d[0], A0[1] + JIG.len * d[1]];
			check(Math.hypot(B0[0] - bc[0], B0[1] - bc[1]) <= RB - EDGE - 1.2 && Math.hypot(A0[0] - bc[0], A0[1] - bc[1]) <= RB - EDGE - 1.2, `(b): the ball's arrow ${j} leaves the ball`);
			S.arrow(A0, B0, { color: INK, width: JIG.width, head: JIG.head, layer: 3, what: `(b)'s ball's arrow ${j}` });
		}
		// on the ring: [where, the direction from the outward radial], each well off the ring's own direction
		const onShell = [[25, 35], [100, 160], [165, -30], [235, -40], [305, 15]].map(([at, rel]) => [at, at + rel]);
		for (const [j, [at, deg]] of onShell.entries()) {
			const a = (at * Math.PI) / 180, A0 = [sc[0] + (RB - RING / 2) * Math.cos(a), sc[1] - (RB - RING / 2) * Math.sin(a)];
			const d = [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)];
			S.arrow(A0, [A0[0] + JIG.len * d[0], A0[1] + JIG.len * d[1]], { color: INK, width: JIG.width, head: JIG.head, layer: 3, what: `(b)'s shell's arrow ${j}` });
		}
		// the arrows are many directions, not one: no two within 30 degrees on one body
		for (const list of [inBall.map((q) => q[2]), onShell.map((q) => q[1])])
			for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) check(Math.abs(((list[i] - list[j] + 540) % 360) - 180) >= 30, '(b): two arrows point alike');
	}

	async function drawC(p) {
		const [bc, sc] = bodies(p);
		for (const [c, who, E] of [[bc, 'ball', N.EB], [sc, 'shell', N.ES]]) {
			// the impulses of g = (x^2 - y^2)/2, along (x, -y): out along x (orange), in along y (blue)
			for (const s of [1, -1]) {
				S.arrow([c[0] + s * (RB + KICK.from), c[1]], [c[0] + s * (RB + KICK.to), c[1]], { color: ACCENT, width: KICK.width, head: KICK.head, layer: 3, what: `(c)'s ${who}'s stretch ${s}` });
				S.arrow([c[0], c[1] + s * (RB + KICK.to)], [c[0], c[1] + s * (RB + KICK.from)], { color: ACCENT2, width: KICK.width, head: KICK.head, layer: 3, what: `(c)'s ${who}'s squeeze ${s}` });
			}
			// the energy gained: a grey bar beside the stretch, its foot level with the body's foot
			const h = (E / N.ES) * (2 * RB - BAR.top), xl = c[0] + RB + KICK.to + BAR.gap, foot = c[1] + RB;
			S.fill(`M${n2(xl)},${n2(foot)}H${n2(xl + BAR.w)}V${n2(foot - h)}H${n2(xl)}Z`, { l: xl, r: xl + BAR.w, t: foot - h, b: foot }, { color: DIM, layer: 2, what: `(c)'s ${who}'s bar` });
			p[who] = h;
			// the bars named once, over the ball's
			if (who === 'ball') L.push(await lbl('\\Delta E', xl + BAR.w / 2, foot - h - LABEL_GAP - 0.3, 0.5, 1));
		}
		check(near(p.ball / p.shell, 0.6, 1e-3), '(c): the bars are not 3 : 5');
	}

	async function drawD(p) {
		const [bc, sc] = bodies(p);
		// the ripple cos(xi x), |xi| R = pi: its crests, where it is positive, as crisp bands of one light tint, laid over
		// the bodies so that they show across both: one through the centres and one a metre (2R) to each side, each half
		// a metre wide
		const wl = 2 * RB, top = bc[1] - RB - 3.5, bot = sc[1] + RB + 3.5;
		for (const k of [-1, 0, 1]) {
			const x0 = bc[0] + k * wl - wl / 4, x1 = bc[0] + k * wl + wl / 4;
			check(near(Math.cos((2 * Math.PI * (x0 - bc[0])) / wl), 0, 1e-9) && near(Math.cos((2 * Math.PI * (x1 - bc[0])) / wl), 0, 1e-9), `(d): crest ${k} does not end where the ripple crosses zero`);
			S.raw(`<path d="M${n2(x0)},${n2(top)}H${n2(x1)}V${n2(bot)}H${n2(x0)}Z" fill="${INK}" fill-opacity="${BAND_OPACITY}"/>`, 4);
		}
		for (const k of [-1, 0, 1]) S.boxes.push({ box: { l: bc[0] + k * wl - wl / 4, r: bc[0] + k * wl + wl / 4, t: top, b: bot }, what: `(d)'s crest ${k}` });
		check(near(((2 * Math.PI) / (Math.PI / R) / R) * RB, wl), '(d): the crests are not a metre apart on the page');
	}

	async function pass(p, light) {
		const [bc, sc] = bodies(p);
		for (const [c, who] of [[bc, 'ball'], [sc, 'shell']]) {
			const xb = c[0] + (B / R) * RB, y0 = c[1] - RB - PATH.over, y1 = c[1] + RB + PATH.over;
			if (!light) {
				S.arrow([xb, y0], [xb, y1], { color: INK, width: PATH.width, head: PATH.head, layer: 2, what: `(e)'s path by the ${who}` });
				S.raw(`<circle cx="${n2(xb)}" cy="${n2(c[1])}" r="${BEAD}" fill="${INK}"/>`, 3);
				S.mark([[xb, c[1]]], BEAD, `(e)'s tonne by the ${who}`);
			} else {
				// a dashed ray, a whole number of dashes, to its head
				const len = y1 - PATH.head - y0, n = Math.round((len + PATH.dash[1]) / (PATH.dash[0] + PATH.dash[1])), f = (len + PATH.dash[1]) / (n * (PATH.dash[0] + PATH.dash[1]));
				S.raw(`<path d="M${n2(xb)},${n2(y0)}V${n2(y1 - PATH.head)}" stroke="${LIGHT}" stroke-width="${PATH.width}" stroke-dasharray="${n2(PATH.dash[0] * f)} ${n2(PATH.dash[1] * f)}" fill="none"/>`, 2);
				S.mark([[xb, y0], [xb, y1 - PATH.head]], PATH.width / 2, `(f)'s ray by the ${who}`);
				const hw = 0.36 * PATH.head;
				S.raw(`<path d="M${n2(xb)},${n2(y1)}L${n2(xb - hw)},${n2(y1 - PATH.head)}L${n2(xb + hw)},${n2(y1 - PATH.head)}Z" fill="${LIGHT}"/>`, 2);
				S.mark([[xb, y1], [xb - hw, y1 - PATH.head], [xb + hw, y1 - PATH.head], [xb, y1]], 0, `(f)'s ray's head by the ${who}`);
			}
			// b, on the ball's: a dotted grey line from the centre to the path, named above, between the edge and the path
			if (who === 'ball') {
				const end = xb - (light ? PATH.width / 2 : BEAD) - 0.8;
				S.dots([c[0], c[1]], [end, c[1]], { color: DIM, what: `(${p.key})'s b` });
				S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="0.9" fill="${DIM}"/>`, 3);
				L.push(await placed('b', (c[0] + RB + end) / 2, c[1] - 0.6 - LABEL_GAP - 0.2, 0.5, 1, INK, SIZE));
			}
		}
	}
	async function drawE(p) { await pass(p, false); }
	async function drawF(p) { await pass(p, true); }

	async function drawG(p) {
		const bc = [p.bx, p.cy - D], sc = [p.bx, p.cy + D];
		// the counter-turning ball: the outer part's deeper tone, the inner ball's pale one out to 2^(-1/5) R
		S.raw(`<circle cx="${n2(bc[0])}" cy="${n2(bc[1])}" r="${n2(RB - EDGE / 2)}" fill="${DEEP}" stroke="${MATTER}" stroke-width="${EDGE}"/>`, 2);
		S.mark(circlePts(bc, RB - EDGE / 2), EDGE / 2, '(g)\'s ball');
		const ra = SPLIT * RB;
		S.raw(`<circle cx="${n2(bc[0])}" cy="${n2(bc[1])}" r="${n2(ra)}" fill="${PALE}" stroke="${MATTER}" stroke-width="0.3"/>`, 2.1);
		S.mark(circlePts(bc, ra), 0.15, '(g)\'s inner ball');
		check(near(ra / RB, 0.8706, 1e-4), '(g): the inner ball is not 0.871 R');
		shell(sc, '(g)\'s shell');
		// the curved arrows: the inner ball anticlockwise, the outer part clockwise, on the middle of its band
		const DEG = Math.PI / 180;
		const arcs = [
			[SPIN.inner * RB, 50, 130, 'inner, top'], [SPIN.inner * RB, 230, 310, 'inner, bottom'],
			[(ra + RB - EDGE) / 2, 125, 55, 'outer, top'], [(ra + RB - EDGE) / 2, 305, 235, 'outer, bottom']
		];
		for (const [r, a0, a1, what] of arcs) {
			const outer = what.startsWith('outer'), w = outer ? SPIN.band : SPIN.width;
			const t = turning(bc[0], bc[1], r, a0 * DEG, a1 * DEG, INK, { width: w, head: outer ? SPIN.bandHead : SPIN.head });
			// the outer part's arrows keep to its band, between the inner ball and the edge
			if (outer) check(Math.max(...t.head.map((q) => Math.hypot(q[0] - bc[0], q[1] - bc[1]))) <= RB - EDGE + 0.05 && Math.min(...t.head.map((q) => Math.hypot(q[0] - bc[0], q[1] - bc[1]))) >= ra - 0.05, `(g): the ${what} arrow leaves the band`);
			S.raw(t.svg, 4);
			S.mark(t.pts, w / 2, `(g)'s ${what} arrow`);
			S.mark(t.head, 0, `(g)'s ${what} arrow's head`);
			S.arrows.push({ L: t.len, head: t.hd, what: `(g)'s ${what} arrow` });
		}
		// direct labels: +Omega for the inner ball, -Omega for the outer part, each with a grey leader; the shell at rest
		const lx = bc[0] + RB + 7;
		const leader = async (src, y, to, what) => {
			const g = await lbl(src, lx + 1.8, y, 0, 0.5);
			g.on = [what];
			L.push(g);
			S.path([[g.box.l - 1.4, y], to], { color: DIM, width: HAIR, cap: 'butt', layer: 5, what });
		};
		const ain = -8 * DEG, aout = -28 * DEG, rm = (ra + RB - EDGE) / 2;
		await leader('+\\Omega', bc[1] - 9, [bc[0] + 0.32 * RB * Math.cos(ain) + 1, bc[1] - 0.32 * RB * Math.sin(ain)], '(g)\'s leader to the inner ball');
		await leader('-\\Omega', bc[1] + 9, [bc[0] + rm * Math.cos(aout), bc[1] - rm * Math.sin(aout)], '(g)\'s leader to the outer part');
		L.push(await lbl('\\text{at rest}', sc[0] + RB + 4, sc[1], 0, 0.5));
	}
}
