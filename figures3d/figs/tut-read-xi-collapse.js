// The tutorial, reading chapter R12 (tutorial/sky/reading-sections-x-and-xi.md), its second diagram: the capstone, a
// core collapse ten kiloparsecs away as the camera reads it. At the left the star, a disc in matter's colour, with
// an arc of the shell of neutrinos leaving it; to its right four panels in a row, each a ring of free test masses as
// chapter 7.3's (figs/tut-einstein-three-balls.js): a dashed circle (the start), the ring's outline in ink with eight
// dots on it, the images of eight places equally spaced round the circle, and the crescents between them, orange
// where the outline reaches outside the circle (a stretch) and blue where it falls inside (a squeeze). The line to
// the star runs across the page, to the left.
//  (a) before: the tide of the original mass, (G M / r^3) diag(-2, 1, 1), the ring longer along the line.
//  (b) the shell passes: the squeeze of its flux, (G L / c^3 r^2)(delta - n n), the ring narrower across the line
//      and unchanged along it; an ink arrow at its centre, the antisymmetric part of B, points back to the star. The
//      panel stands on a faint wash of matter's colour, which runs down to the time line: the camera is inside the
//      shell for those ten seconds.
//  (c) after: the tide of the remnant, the same shape but weaker, the ring less long along the line; the outline of
//      (a) dotted in grey at the ends, where it stands outside the new one (across the line it lies within a point and
//      a half inside it, and is left out).
//  (d) uneven burst: two free balls (the stone of chapter 7.8's memory figure) across the line, 4 km apart, left
//      farther apart for good, their old places dashed.
// Under each panel its numbers, exactly the capstone table's; under the panels the time line at the camera, from the
// collapse (under the star, -32,600 years) through a break to t = 0, the shell's arrival, and 10 s, its passing (a
// thick stretch of the line in matter's colour), with the time's arrow; under that a logarithmic scale of tides from
// 10^-44 to 10^-6 s^-2 with the weighing (along and across the line), the squeeze (blue) and the person's tide a
// metre away.
// Departures from the diagram's comment, where the chapter's text decides or the house's rings do: the solar masses
// are the chapter's 0.168, not 0.17; in (c) the new outline is the solid one, as in every ring of the house, and the
// outline of (a) is the dotted one, outside it along the line; in (b) the ring shows the squeeze alone, since it is
// about 10^8 times the static tide of any progenitor (its change, 1.5 x 10^-42, is a percent or so of it); the balls of
// (d) stand across the line to the star, since the memory's strain is across the line of sight; the caption's "middle
// panel" is the tinted panel (b), of four.
// Exact: every number (computed here with G, c, 10 kpc and the paper's 3 x 10^46 J over 10 s, and asserted against the
// chapter's text); the scale of tides and its marks; each outline the image of the circle under 1 - EPS E / |E|, with
// E the tide's table in the page's two directions (along and across the line); the dots the images of their places.
// Schematic: EPS = 0.3 (the exaggeration), the fraction of the mass lost in (c) (a third, not a percent), the balls'
// step in (d), the sizes of the star, the rings and the balls, and the time line, which is not to scale.
// Pictorial: the balls, the stone of chapter 7.7's rotor (sprites/hair/ball-face.png, embedded once).
import { tex, INK, DIM, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, near, n2, AXIS, AXIS_HEAD, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { circle as circlePath } from '../stone.js';
import { ballFace, stoneDefs, stone as stoneOf, rim, MATTER } from './tut-null-lib.js';
import { RING, UNDISTURBED, UNDISTURBED_W } from './tut-five-lib.js';

const name = 'tut-read-xi-collapse';
const check = checker(name);

// ---- the scene (SI) ---------------------------------------------------------------------------------------------
const G = 6.674e-11, C = 299792458;
const KPC = 3.0857e19, YEAR = 3.15576e7, MSUN = 1.989e30;
const R_STAR = 10 * KPC;                    // m
const E_BURST = 3e46;                       // J, the paper's
const DT = 10;                              // s, the burst's duration
const Q = 0.01;                             // the burst's excess along its axis
const BALLS = 4000;                         // m, the two balls' distance
const PERSON = 70;                          // kg, a metre away

// ---- the drawing (figure points, y down) -------------------------------------------------------------------------
const SIZE = 9.6;                           // every label and number
const PITCH = 88;                           // from one panel's centre to the next
const STAR_COL = 40;                        // the star's column, left of the first panel's
const R = 25;                               // a ring's starting radius (schematic)
const EPS = 0.3;                            // the largest change drawn, as a fraction of the radius (7.3's)
const LOST = 1 / 3;                         // (c): the fraction of the mass drawn lost (schematic)
const DOT_R = 1.3, N_DOTS = 8, PHASE = Math.PI / 8;   // the dots on a ring (7.3's)
const ORANGE = '#f3dfcb', BLUE = '#dce7f3'; // the accents' faint tints: the stretch and the squeeze
const STAR_R = 6, SHELL_R = 12.5, SHELL_W = 0.9, SHELL_SPAN = 52;   // the star, and the arc of its shell (degrees each side)
const WASH_OPACITY = 0.08;                  // (b): the wash of matter's colour
const WASH_PAD = 5;                         // the wash reaches this far above the titles
const B_ARROW = 16, B_W = 0.6, B_HEAD = 3.4;          // (b): the arrow of B's antisymmetric part
const PREV_DOT = 0.7, PREV_STEP = 1.9, PREV_CLEAR = 1.4;   // (c): the dotted outline of (a), and its least air outside the new one
const BALL = 4.2, XI = 30, STEP_DRAWN = 5;  // (d): the balls' radius, distance and drawn step (each)
const GROUP_SHIFT = 16;                    // (d): the balls stand this far right of the panel's centre
const DIMX = 14, DIM_END = 1.8;             // (d): the dimension line, this far left of the balls' centres
const TITLE_AIR = 7;                        // a title's foot to its ring's dashed circle
const NUM_AIR = 7;                          // a ring's dashed circle to its numbers' first cap
const NUM_PITCH = 11.6;                     // baseline to baseline within the numbers
const AXIS_AIR = 9;                         // the lowest number to the time line
const BREAK = 2.2, BREAK_LEN = 6;           // the time line's break: half its gap, its strokes' length
const BAND = 2.6;                           // the shell's stretch of the time line
const SCALE_AIR = 22;                       // the time line to the scale of tides
const SCALE_X = 50;                         // the scale's left end, from the figure's left
const DECADES = [-44, -6];
const MARK_R = 1.05;                        // a mark on the scale
const MINOR = 1.6;                          // a decade's tick, below the scale

const CAPTION = 'Look first at the tinted panel: while the shell of neutrinos passes, its squeeze is a hundred billion times the change of tide it leaves. The tides on the scale are exact; the rings\' deformations and the balls\' step are exaggerated.';

/** v as TeX, a x 10^b with `d` significant figures. */
const sci = (v, d = 2) => { const [m, e] = v.toExponential(d - 1).split('e'); return `${m}\\times10^{${Number(e)}}`; };

export default async function () {
	// ---- the numbers, and the chapter -------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/sky/reading-sections-x-and-xi.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const years = R_STAR / C / YEAR;
	const dM = E_BURST / (C * C);
	const weighAlong = (2 * G * dM) / R_STAR ** 3, weighAcross = (G * dM) / R_STAR ** 3;
	const L = E_BURST / DT;
	const squeeze = (G * L) / (C ** 3 * R_STAR ** 2);
	const flux = L / (4 * Math.PI * R_STAR ** 2);
	const bSize = (4 * Math.PI * G * flux) / C ** 3;
	const memory = (Q * G * E_BURST) / (2 * C ** 4 * R_STAR);
	const apart = 0.5 * memory * BALLS;
	const person = (2 * G * PERSON) / 1 ** 3;
	const N = {
		years: (Math.round(years / 100) * 100).toLocaleString('en-GB'), suns: dM / MSUN,
		weighAlong: sci(weighAlong), weighAcross: sci(weighAcross), squeeze: sci(squeeze), memory: sci(memory),
		apart: sci(apart, 1), person: sci(person), ratio: sci(squeeze / weighAcross), ratioAlong: sci(squeeze / weighAlong)
	};
	check(N.years === '32,600' && near(N.suns, 0.168, 0.0005), `the years ${N.years} and the solar masses ${N.suns}`);
	check(N.weighAlong === '1.5\\times10^{-42}' && N.weighAcross === '7.6\\times10^{-43}', `the weighing ${N.weighAlong}, ${N.weighAcross}`);
	check(N.squeeze === '7.8\\times10^{-32}' && near(bSize, squeeze, 1e-40), `the squeeze ${N.squeeze} and B's size ${bSize}`);
	check(N.memory === '4.0\\times10^{-21}' && N.apart === '8\\times10^{-18}' && N.person === '9.3\\times10^{-9}', `the memory ${N.memory}, ${N.apart}, the person ${N.person}`);
	check(N.ratio === '1.0\\times10^{11}' && N.ratioAlong === '5.1\\times10^{10}', `the ratios ${N.ratio}, ${N.ratioAlong}`);
	has('32,600 years after the collapse', 'the years');
	has('| $0.168\\,M_\\odot$ | 12.1, 6.4 |', 'the solar masses');
	has('| $1.5\\times10^{-42}$, $7.6\\times10^{-43}\\unit{s^{-2}}$ | 11.1 |', 'the weighing');
	has('| $7.8\\times10^{-32}\\unit{s^{-2}}$; $5.1\\times10^{10}$ and $1.0\\times10^{11}$ times (b) |', 'the squeeze');
	has('size $7.8\\times10^{-32}\\unit{s^{-2}}$, back to the star', 'B\'s part');
	has('| $4.0\\times10^{-21}$ | 7.8 |', 'the memory');
	has('balls 4 km apart end $\\tfrac12\\times4.0\\times10^{-21}\\times4\\unit{km} = 8\\times10^{-18}$ m farther apart', 'the balls');
	has('makes $9.3\\times10^{-9}\\unit{s^{-2}}$', 'the person');
	has('$L = \\matter E/10\\unit{s} = 3\\times10^{45}$ W', 'the ten seconds');
	has('$\\curv\\tE_{ij} = (GL/c^3r^2)(\\delta_{ij} - \\hat n_i\\hat n_j)$', 'the squeeze\'s table');
	has('$\\Delta\\curv\\tE = 2G\\Delta\\matter M/r^3$ along the line', 'the weighing along the line');
	has('feels their squeeze a hundred billion times more strongly while they pass', 'the hundred billion');
	const drawn = flat.includes(`](${name}){#fig:read-xi-collapse}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-xi-collapse}`, 'the caption');
	if (drawn) has('through Parts 6 to 12 (Figure [](#fig:read-xi-collapse)).', 'the pointer');

	const S = new Sheet(name);
	const Lb = [];
	const lab = async (src, x, y, ax, ay, color = INK) => { const g = await placed(src, x, y, ax, ay, color, SIZE); Lb.push(g); return g; };
	const x0 = ORIGIN - (STAR_COL + 2 * PITCH);
	const xs = x0 + STAR_COL / 2;                                   // the star
	const xc = [0, 1, 2, 3].map((k) => x0 + STAR_COL + PITCH / 2 + k * PITCH);   // the panels' centres
	const t0 = (xc[0] + xc[1]) / 2, t10 = (xc[1] + xc[2]) / 2;      // the shell's arrival and passing, on the time line
	const yT = ORIGIN - 120;                                        // the titles' baseline

	// ---- the titles ---------------------------------------------------------------------------------------------------
	const titles = ['\\text{(a) before}', '\\text{(b) the shell passes}', '\\text{(c) after}', '\\text{(d) uneven burst}'];
	const T = [];
	for (const [k, src] of titles.entries()) {
		T.push(await baseline(src, xc[k], yT));
	}
	for (const g of T) Lb.push(g);
	const titleB = Math.max(...T.map((g) => g.box.b)), titleT = Math.min(...T.map((g) => g.box.t));
	const yc = titleB + TITLE_AIR + R + UNDISTURBED_W / 2;           // the rings' centres

	// ---- the rings ------------------------------------------------------------------------------------------------------
	// the drawn map along (x, the line to the star) and across (y): 1 - EPS E / |E|
	const before = [1 + EPS, 1 - EPS / 2];                           // diag(-2, 1) / 2: 1.3 and 0.85
	const during = [1, 1 - EPS];                                     // (0, 1): 1 and 0.7
	const after = [1 + EPS * (1 - LOST), 1 - (EPS / 2) * (1 - LOST)]; // (1 - LOST) diag(-2, 1) / 2
	check(near(before[0], 1.3, 1e-12) && near(before[1], 0.85, 1e-12) && near(during[1], 0.7, 1e-12) && near(after[0], 1.2, 1e-12) && near(after[1], 0.9, 1e-12), 'the rings\' maps');
	check(near(before[0] - 1, 2 * (1 - before[1]), 1e-12) && near(after[0] - 1, 2 * (1 - after[1]), 1e-12), 'the stretch along is not twice the squeeze across');
	const loop = (cx, a, b, n = 240) => Array.from({ length: n + 1 }, (_, i) => [cx + a * Math.cos((2 * Math.PI * i) / n), yc - b * Math.sin((2 * Math.PI * i) / n)]);
	const ellipse = (cx, a, b) => `M${n2(cx - a)},${n2(yc)}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;
	const ringAt = (k, [sx, sy]) => {
		const cx = xc[k], what = `ring ${'abc'[k]}`;
		const both = ellipse(cx, R * sx, R * sy) + circlePath(cx, yc, R);
		const inside = `${name}-in${k}`, outside = `${name}-out${k}`;
		S.raw(`<clipPath id="${inside}"><path d="${circlePath(cx, yc, R)}"/></clipPath>` +
			`<clipPath id="${outside}"><path clip-rule="evenodd" d="M${n2(cx - 3 * R)},${n2(yc - 3 * R)}H${n2(cx + 3 * R)}V${n2(yc + 3 * R)}H${n2(cx - 3 * R)}Z${circlePath(cx, yc, R)}"/></clipPath>` +
			`<path d="${both}" fill="${BLUE}" fill-rule="evenodd" clip-path="url(#${inside})"/>` +
			(sx > 1 ? `<path d="${both}" fill="${ORANGE}" fill-rule="evenodd" clip-path="url(#${outside})"/>` : ''), 0.6);
		// the start: a dashed circle, a whole number of dashes
		const total = 2 * Math.PI * R, [on, off] = UNDISTURBED, n = Math.round(total / (on + off)), period = total / n;
		S.raw(`<path d="${circlePath(cx, yc, R)}" fill="none" stroke="${DIM}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${(on * period / (on + off)).toFixed(3)} ${(off * period / (on + off)).toFixed(3)}"/>`, 1);
		S.mark(loop(cx, R, R), UNDISTURBED_W / 2, `${what}'s start`);
		S.raw(`<path d="${ellipse(cx, R * sx, R * sy)}" fill="none" stroke="${INK}" stroke-width="${RING}"/>`, 2);
		S.mark(loop(cx, R * sx, R * sy), RING / 2, `${what}'s outline`);
		for (let i = 0; i < N_DOTS; i++) {
			const t = PHASE + (2 * Math.PI * i) / N_DOTS;
			const q = [cx + R * sx * Math.cos(t), yc - R * sy * Math.sin(t)];
			check(near(((q[0] - cx) / (R * sx)) ** 2 + ((q[1] - yc) / (R * sy)) ** 2, 1, 1e-12), `${what}: dot ${i} is off the outline`);
			S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT_R}" fill="${INK}"/>`, 3);
			S.mark([q], DOT_R, `${what}'s dot ${i}`);
		}
	};
	ringAt(0, before);
	ringAt(1, during);
	ringAt(2, after);
	// (c): the outline of (a), dotted, outside the new one along the line
	{
		const cx = xc[2], a = R * before[0], b = R * before[1];
		const pts = loop(cx, a, b, 1440), s = [0];
		for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
		// drawn only where it stands clear outside the new outline (along the line); across it runs inside the new
		// outline, within a point and a half of it, and is left out there, as it is where it passes a dot
		const ea = R * after[0], eb = R * after[1];
		const clear = (q) => Math.hypot((q[0] - cx) / ea, (q[1] - yc) / eb) - 1 >= PREV_CLEAR / R;
		const dots = S.marks.filter((m) => m.what.startsWith('ring c\'s dot'));
		const free = (q) => dots.every((m) => Math.hypot(q[0] - m.pts[0][0], q[1] - m.pts[0][1]) >= DOT_R + PREV_DOT / 2 + 0.6);
		const n = Math.round(s.at(-1) / PREV_STEP), d = [], kept = [];
		for (let k = 0, i = 0; k < n; k++) {
			const at = (k * s.at(-1)) / n;
			while (s[i + 1] < at) i++;
			const f = (at - s[i]) / (s[i + 1] - s[i]);
			const q = [pts[i][0] + f * (pts[i + 1][0] - pts[i][0]), pts[i][1] + f * (pts[i + 1][1] - pts[i][1])];
			if (!clear(q) || !free(q)) continue;
			d.push(`M${n2(q[0])},${n2(q[1])}h0`);
			kept.push(q);
		}
		S.raw(`<path d="${d.join('')}" stroke="${DIM}" stroke-width="${PREV_DOT}" stroke-linecap="round" fill="none"/>`, 1.5);
		for (const q of kept) S.mark([q], PREV_DOT / 2, 'the outline of (a), in (c)');
		// clear of the new outline's dots
		for (const q of kept) for (const m of dots) check(Math.hypot(q[0] - m.pts[0][0], q[1] - m.pts[0][1]) >= DOT_R + PREV_DOT / 2 + 0.6, 'the dotted outline of (a) touches a dot of (c)');
		check(kept.length >= 16 && kept.every((q) => Math.abs(q[0] - cx) > R * 0.6), `the dotted outline of (a) keeps ${kept.length} dots, not only its ends`);
		check(R * (before[0] - after[0]) > 2, 'the two outlines of (c) are too near along the line');
	}
	// (b): the antisymmetric part of B, back to the star (to the left)
	{
		const y = yc + 3;
		S.arrow([xc[1] + B_ARROW / 2, y], [xc[1] - B_ARROW / 2, y], { color: INK, width: B_W, head: B_HEAD, layer: 3, what: 'B\'s arrow' });
		await lab('\\mathcal{B}', xc[1], y - B_W / 2 - LABEL_GAP - 0.4, 0.5, 1);
	}

	// ---- (d): two free balls across the line, 4 km apart, left farther apart ------------------------------------------
	{
		// the group (the dimension, its label and the balls) centred on the panel: the balls stand right of its centre
		const cx = xc[3] + GROUP_SHIFT;
		const art = await ballFace();
		S.raw(stoneDefs(`${name}-face`, art, BALL), 0);
		const olds = [yc - XI / 2, yc + XI / 2], news = [yc - XI / 2 - STEP_DRAWN, yc + XI / 2 + STEP_DRAWN];
		for (const [j, y] of olds.entries()) {
			S.raw(`<path d="${circlePath(cx, y, BALL)}" fill="none" stroke="${DIM}" stroke-width="0.4" stroke-dasharray="1.1 0.9"/>`, 2);
			S.mark([[cx, y]], BALL + 0.2, `the old place ${j}`);
		}
		for (const [j, y] of news.entries()) {
			S.raw(stoneOf(`${name}-ball${j}`, `${name}-face`, cx, y, BALL) + rim(cx, y, BALL), 3);
			S.mark([[cx, y]], BALL, `ball ${j}`);
		}
		check(news[1] + BALL <= yc + R + 0.01 && news[0] - BALL >= yc - R - 0.01, 'the balls leave the rings\' height');
		// the dimension: the old places, 4 km apart
		const xd = cx - DIMX;
		S.path([[xd, olds[0]], [xd, olds[1]]], { color: DIM, width: HAIR, cap: 'butt', what: 'the dimension' });
		for (const y of olds) S.path([[xd - DIM_END, y], [xd + DIM_END, y]], { color: DIM, width: HAIR, cap: 'butt', what: 'the dimension\'s end' });
		const km = await lab('\\text{4 km}', xd - DIM_END - LABEL_GAP - 0.3, yc, 1, 0.5);
		const mid = (km.box.l + cx + BALL) / 2;
		check(Math.abs(mid - xc[3]) < 2, `(d)'s group is centred ${(mid - xc[3]).toFixed(2)} pt off its panel`);
	}

	// ---- the star and its shell ------------------------------------------------------------------------------------------
	S.raw(`<circle cx="${n2(xs)}" cy="${n2(yc)}" r="${STAR_R}" fill="${MATTER}"/>`, 2);
	S.mark([[xs, yc]], STAR_R, 'the star');
	{
		const a = (SHELL_SPAN * Math.PI) / 180;
		const p = (t) => [xs + SHELL_R * Math.cos(t), yc - SHELL_R * Math.sin(t)];
		const [A, B] = [p(a), p(-a)];
		S.raw(`<path d="M${n2(A[0])},${n2(A[1])}A${SHELL_R},${SHELL_R} 0 0,1 ${n2(B[0])},${n2(B[1])}" fill="none" stroke="${MATTER}" stroke-width="${SHELL_W}" stroke-linecap="round"/>`, 2);
		S.mark(Array.from({ length: 41 }, (_, i) => p(a - (2 * a * i) / 40)), SHELL_W / 2, 'the shell');
	}

	// ---- the numbers under the panels and the star ----------------------------------------------------------------------
	const yN = yc + R + UNDISTURBED_W / 2 + NUM_AIR;                 // the first line's cap height
	const blocks = [
		[xs, ['\\text{star,}', '\\text{10 kpc}']],
		[xc[0], ['\\text{tide of the}', '\\text{original mass}']],
		[xc[1], ['\\text{squeeze across,}', `${N.squeeze}\\,\\mathrm{s^{-2}}\\text{,}`, '\\text{none along;}', '\\mathcal{B}\\text{ points to the star}']],
		[xc[2], [`${N.suns.toFixed(3)}\\,M_\\odot\\text{ lighter:}`, `${N.weighAlong}\\text{ along,}`, `${N.weighAcross}\\text{ across}`]],
		[xc[3], [`\\text{step }${N.memory}\\text{:}`, '\\text{4 km grows by}', `${N.apart}\\text{ m}`]]
	];
	// the lines' baselines, shared across the panels: each at least NUM_PITCH below the last, and low enough that
	// its tallest line clears the deepest line above it
	let low = 0;
	const capH = (await placed('\\text{H}', 0, 0, 0, 0, INK, SIZE)).box;
	const rows = Math.max(...blocks.map(([, lines]) => lines.length));
	const probes = [];
	for (const [, lines] of blocks) { const ps = []; for (const src of lines) ps.push(await baseline(src, 0, 0)); probes.push(ps); }
	let base = yN + (capH.b - capH.t), prevBase = null;
	for (let j = 0; j < rows; j++) {
		if (prevBase !== null) {
			const deepest = Math.max(...probes.map((ps) => (ps[j - 1] ? prevBase + ps[j - 1].box.b : -Infinity)));
			const tallest = Math.min(...probes.map((ps) => (ps[j] ? ps[j].box.t : Infinity)));
			base = Math.max(prevBase + NUM_PITCH, deepest + LABEL_GAP + 0.1 - tallest);
		}
		for (const [x, lines] of blocks) {
			if (!lines[j]) continue;
			const g = await baseline(lines[j], x, base);
			Lb.push(g);
			low = Math.max(low, g.box.b);
			const room = x === xs ? STAR_COL : PITCH - 6;
			check(g.box.r - g.box.l <= room, `the line ${lines[j]} is ${(g.box.r - g.box.l).toFixed(1)} pt wide, its room ${room}`);
		}
		prevBase = base;
	}

	// ---- the time line -----------------------------------------------------------------------------------------------
	const yA = low + AXIS_AIR;
	const xEnd = xc[3] + PITCH / 2 - 2;
	const xBreak = (xc[0] - R * before[0] + t0) / 2 + 2;
	const xBreakAt = Math.max(xBreak, xs + 34);
	S.path([[xs, yA], [xBreakAt - BREAK, yA]], { color: INK, width: AXIS, cap: 'butt', what: 'the time line, before the break' });
	const ar = S.arrow([xBreakAt + BREAK, yA], [xEnd, yA], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the time line' });
	check(ar.head === AXIS_HEAD, 'the time line\'s head');
	for (const s of [-1, 1]) {
		const cx = xBreakAt + s * BREAK, dx = (BREAK_LEN / 2) * Math.cos(Math.PI / 3), dy = (BREAK_LEN / 2) * Math.sin(Math.PI / 3);
		S.path([[cx - dx, yA + dy], [cx + dx, yA - dy]], { color: INK, width: AXIS, cap: 'butt', what: 'the break' });
	}
	S.path([[t0, yA], [t10, yA]], { color: MATTER, width: BAND, cap: 'butt', layer: 0.8, what: 'the shell\'s ten seconds' });
	for (const x of [xs, t0, t10]) S.path([[x, yA - TICK], [x, yA + TICK]], { color: INK, width: AXIS, cap: 'butt', layer: 2, what: 'a tick of the time line' });
	const tickY = yA + Math.max(TICK, BAND / 2) + LABEL_GAP + 0.3;
	const collapse = await lab('\\text{collapse, }{-}32{,}600\\text{ years}', xs - 3, tickY, 0, 0);
	await lab('0', t0, tickY, 0.5, 0);
	await lab('\\text{10 s}', t10, tickY, 0.5, 0);
	await lab('t', xEnd, yA - AXIS_HEAD * 0.36 - LABEL_GAP - 0.5, 1, 1);
	check(collapse.box.r < t0 - 8, 'the collapse\'s label reaches t = 0');

	// ---- (b)'s wash: the camera inside the shell, down to the time line ---------------------------------------------------
	{
		const t = titleT - WASH_PAD, b = yA;
		S.raw(`<rect x="${n2(t0)}" y="${n2(t)}" width="${n2(t10 - t0)}" height="${n2(b - t)}" fill="${MATTER}" fill-opacity="${WASH_OPACITY}"/>`, -1);
		check(near(t10 - t0, PITCH, 1e-9), 'the wash is not one panel wide');
	}

	// ---- the scale of tides ---------------------------------------------------------------------------------------------
	const yS = tickY + 9 + SCALE_AIR;
	const xL = x0 + SCALE_X, xR = xEnd;
	const X = (lg) => xL + ((lg - DECADES[0]) / (DECADES[1] - DECADES[0])) * (xR - xL);
	S.path([[xL, yS], [xR, yS]], { color: INK, width: AXIS, cap: 'butt', what: 'the scale' });
	for (let d = DECADES[0]; d <= DECADES[1]; d++) {
		const major = d % 10 === 0;
		S.path([[X(d), yS], [X(d), yS + (major ? TICK * 1.2 : MINOR)]], { color: INK, width: major ? AXIS : HAIR, cap: 'butt', what: `the decade ${d}` });
		if (major) await lab(`10^{${d}}`, X(d), yS + TICK * 1.2 + LABEL_GAP + 0.4, 0.5, 0);
	}
	await lab('\\text{tide, }\\mathrm{s^{-2}}', x0, yS, 0, 0.5);
	const marks = [
		{ v: weighAcross, color: INK, what: 'the weighing across' },
		{ v: weighAlong, color: INK, what: 'the weighing along' },
		{ v: squeeze, color: ACCENT2, what: 'the squeeze' },
		{ v: person, color: INK, what: 'the person' }
	];
	for (const m of marks) {
		m.x = X(Math.log10(m.v));
		check(m.x > xL + 3 && m.x < xR - 3, `${m.what} is off the scale`);
		S.raw(`<circle cx="${n2(m.x)}" cy="${n2(yS)}" r="${MARK_R}" fill="${m.color}"/>`, 3);
		S.mark([[m.x, yS]], MARK_R, m.what);
	}
	check(marks[1].x - marks[0].x > 2 * MARK_R + 0.2, 'the two weighings\' marks touch');
	const above = yS - MARK_R - LABEL_GAP - 0.4;
	await lab('\\text{weighing}', (marks[0].x + marks[1].x) / 2, above, 0.5, 1);
	await lab('\\text{squeeze}', marks[2].x, above, 0.5, 1, ACCENT2);
	await lab(`\\text{the person, 1 m: }${N.person}`, marks[3].x + 4, above, 1, 1);
	// the squeeze over the change of tide across the line
	check(near(Math.log10(squeeze / weighAcross), 11.01, 0.01), 'the ratio is not 10^11');

	S.checkAll(Lb);
	window[name + '-numbers'] = { ...N, yc, xc, t0, t10, drawn };
	return finish(S, Lb, [370, 395]);
}

/** A label with its baseline at y and its ink centred on x. */
async function baseline(src, x, y, color = INK) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
