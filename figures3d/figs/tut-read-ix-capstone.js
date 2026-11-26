// The tutorial, reading section R10b (tutorial/glow/reading-section-ix.md), its second diagram: the capstone's Earth.
// The cut-away globe of the paper's Figure fig:earth-glow (figs/earth-glow.js) redrawn flat as a half disc, its five
// shells to scale (the scene's radii: 6371, 6346, 5701, 3480 and 1221.5 km, scenes/sun-at-midnight.scene.json) in the
// paper's shell colours (figs/earth-glow.js SHELLS, through section 5.6's PAPER_SHELLS and shellFill,
// figs/tut-abel-lib.js, mixed with the page as 5.6 mixes them), the camera at the top of the cut, as in 5.6's
// tut-abel-chords. Three lines of sight from the camera graze the lower mantle, the core and the inner core, at
// arcsin(r/R), each named by its angle at the end of a dotted leader that carries it beyond the surface, as the
// paper's figure carries its lines; a fourth, dashed, leaves 40 degrees from straight down toward the Sun's core at
// the lower left, with a dot and the ground's number radiance where it leaves the Earth. Beside the lower half of the
// cut, each shell's name, its share of the placeholder and its j_N (aligned on the times signs), under a header row,
// joined to the shell's middle on the cut by a grey leader. Beside the upper half, a single bar split in the shells'
// colours by their shares of a lifetime's count, under "35,800 in 80 years": the crust's 12 gravitons a tick over the
// bar's left end, the inner core's 3.2% over its right end, the other three shares under their parts. The two tags of
// the 33.1 degree line under its angle. Neutral ink otherwise: no orange or blue, which mean a stretch and a squeeze.
// Departures from the diagram's comment, where the drawing decides: the shells' labels stand beside the lower half of
// the cut, since the crust meets the cut only at its two ends and the camera stands on the upper one, so they read
// from the crust in going up, from the Earth's bottom to its centre, and each also names its shell; the bar stands
// beside the upper half rather than under the disc, which keeps the figure near the comment's 640 x 420 px; the two
// tags stand under the 33.1 degrees at the line's far end, since inside the disc no gap beside the line holds them;
// the Sun is the astronomers' sign, a circle with a dot, in ink, named "Sun's core".
// Exact: the shells' radii, the grazing lines' angles arcsin(r/R) (asserted 63.5, 33.1 and 11.05 degrees from the
// chapter's radii) and their tangency, each line's end on the surface, the 40 degree line and its chords (asserted
// 65, 1763 and 7932 km), the bar's parts (the shares of a lifetime's count, integrated here from the table's j_N and
// the chords, asserted to round to the table's 12 gravitons, 7.5, 62, 27 and 3.2%), every number printed (asserted
// against the chapter's text and recomputed where the chapter computes it: the shares and j_N from 10.3's bound, the
// 0.107 degrees, 4.0 x 10^5 and 3.7 x 10^-6). Schematic: the camera's glyph, the Sun's size and distance. The crust,
// 25 km, is drawn to scale, thinner than the surface's line, so its lower boundary is not drawn.
import { Sheet, ORIGIN, finish, checker, beside, boxOf, near, n2, HAIR, LINE, LABEL_GAP } from './tut-pot-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { PAPER_SHELLS, shellFill, DASH } from './tut-abel-lib.js';

const name = 'tut-read-ix-capstone';
const check = checker(name);

// ---- the physics: SI, CODATA 2018 --------------------------------------------------------------------------------
const G = 6.6743e-11, c = 299792458, kB = 1.380649e-23, hbar = 1.054571817e-34;
const SIGMA = (Math.PI ** 2 * kB ** 4) / (60 * hbar ** 3 * c ** 2);
const MEAN = 2.7012;                         // 10.1's mean energy of a thermal graviton, in k_B T
const YEAR = 365.25 * 86400;
// the shells, from the crust in: [name, outer radius (km), T (K), relaxing stiffness (GPa), the table's share, j_N,
// chord straight down (km), share of the count]
const SHELLS = [
	['crust', 6371, 700, 44, '0.203', '4.2\\times10^{-15}', 50, '12 gravitons'],
	['upper mantle', 6346, 1700, 130, '0.247', '7.3\\times10^{-14}', 1290, '7.5\\%'],
	['lower mantle', 5701, 2800, 293, '0.338', '4.47\\times10^{-13}', 4442, '62\\%'],
	['outer core', 3480, 4500, 220, '0.158', '8.68\\times10^{-13}', 4517, '27\\%'],
	['inner core', 1221.5, 5500, 400, '0.235', '2.36\\times10^{-12}', 2443, '3.2\\%']
];
const COLOURS = [PAPER_SHELLS.crust, PAPER_SHELLS.upper, PAPER_SHELLS.lower, PAPER_SHELLS.outer, PAPER_SHELLS.inner];
const EARTH = SHELLS[0][1];
const GRAZED = [[2, '63.5'], [3, '33.1'], [4, '11.05']];       // the shell whose top each line grazes, its angle
const SUN_ANGLE = 40;
const CAPTION = 'Look first at the bar: a lifetime\'s 35,800 gravitons, mostly from the lower mantle. The grazing lines place the boundaries whatever the frictions, and the line to the Sun\'s core passes between the kinks at 63° and 33°. Sizes of the Sun and distances schematic; every number from the capstone.';

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const R = 96;                     // the Earth's radius
const SIZE = 8.5;
const CAM = { h: 6.2, w: 6.4 };    // the camera: section 5.6's triangle, its apex on the surface
const MARK = 1.05;                 // the dot where the Sun's line leaves the Earth
const SUN = { r: 6, dot: 1.15, s: 2.82, air: 1.4 };   // the Sun's sign: its radius, its dot, its distance from the camera
// (Earth radii), and the dashed line's air before it
const EXT = [8, 35, 8];           // the dotted leaders beyond the surface, to each angle
const BASE_PITCH = 10.6;           // from one baseline to the next, under the 33.1 degrees (R10's map's)
const HEAD_DROP = 4.2;            // from the header's baseline to the top of the first row's ink
const GROUND = { dx: 3.4, dy: 3.2 };    // the ground's label: its corner this far left of and above the dot
const LEAD = 14;                   // the table's left edge, this far right of the cut
const COL_GAP = 7;                 // between the table's columns
const PITCH = 12.2;                // the least step between two rows of the table
const BAR = { h: 7.5, tick: 3, top: 0.66 };   // the bar: its height, the crust's tick above it, and the top of its title,
// in Earth radii above the centre; it is as wide as the table under it   // the bar, its height, the crust's tick above it

export default async function () {
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN, ORIGIN];
	const P = ([x, y]) => [O[0] + R * x, O[1] - R * y];
	const md = await (await fetch('/tutorial/glow/reading-section-ix.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const says = (s) => check(flat.includes(s), `the chapter does not say ${s}`);

	// ---- the numbers, recomputed and checked against the chapter -------------------------------------------------
	const radii = SHELLS.map((s) => s[1] / EARTH);
	says('$R = 6371$ km the Earth\'s radius: $\\arcsin(5701/6371) = 63.5°$, $\\arcsin(3480/6371) = 33.1°$ and $\\arcsin(1221.5/6371) = 11.05°$');
	const angles = GRAZED.map(([k]) => (Math.asin(radii[k]) * 180) / Math.PI);
	check(angles.map((a, i) => a.toFixed(GRAZED[i][1].split('.')[1].length)).join() === GRAZED.map((g) => g[1]).join(), `the grazing angles ${angles}`);
	const jN = SHELLS.map(([, , T, dmu]) => (5.18 * G * dmu * 1e9 * (kB * T) ** 2) / (hbar ** 2 * c ** 5) / (4 * Math.PI));
	const placeholder = SHELLS.map(([, , T]) => (16 * G * 1e-3 * SIGMA * T ** 3) / (c ** 3 * MEAN * kB));
	const tex2num = (s) => Number(s.replace(/\\times10\^\{(-?\d+)\}/, 'e$1'));
	SHELLS.forEach((s, k) => {
		check((jN[k] / placeholder[k]).toFixed(3) === s[4], `the share of the ${s[0]}: ${jN[k] / placeholder[k]}`);
		const digits = s[5].split('\\times')[0].length - 2;
		check(jN[k].toExponential(digits) === tex2num(s[5]).toExponential(digits), `the j_N of the ${s[0]}: ${jN[k]}`);
		const row = `| ${s[0][0].toUpperCase() + s[0].slice(1)} | ${s[2]} | ${s[3]} | ${s[4]} | $${s[5]}$ | ${s[6]} | ${s[7].replace('\\%', '%')} |`;
		says(row);
	});
	// the chord of shell k along the line whose distance from the centre is b (units of R), and the brightness
	const root = (x) => Math.sqrt(Math.max(0, x));
	const chord = (k, b) => 2 * (root(radii[k] ** 2 - b * b) - root((radii[k + 1] ?? 0) ** 2 - b * b));
	SHELLS.forEach((s, k) => check(Math.round(chord(k, 0) * EARTH) === s[6], `the ${s[0]}'s chord straight down`));
	const parts = (th) => SHELLS.map((_, k) => jN[k] * chord(k, Math.sin(th)) * EARTH * 1e3);
	check(near(parts(0).reduce((a, b) => a + b), 1.18e-5, 0.005e-5), 'straight down, 1.18 x 10^-5');
	// the count: the integral over the half sphere below, 2 pi sin(theta) d(theta), by the midpoint rule
	const n = 200000, count = SHELLS.map(() => 0);
	for (let i = 0; i < n; i++) {
		const th = ((i + 0.5) / n) * (Math.PI / 2);
		parts(th).forEach((p, k) => { count[k] += p * 2 * Math.PI * Math.sin(th) * (Math.PI / 2 / n); });
	}
	const rate = count.reduce((a, b) => a + b);
	const lifetime = rate * 80 * YEAR, share = count.map((x) => x / rate);
	check(Math.round(lifetime / 100) * 100 === 35800 && rate.toFixed(7) === '0.0000142', `the count ${rate}, ${lifetime}`);
	says('one graviton every 19.6 hours, 447 a year and 35,800 in eighty years');
	check(Math.round(share[0] * lifetime) === 12 && (100 * share[1]).toFixed(1) === '7.5' && (100 * share[2]).toFixed(0) === '62' &&
		(100 * share[3]).toFixed(0) === '27' && (100 * share[4]).toFixed(1) === '3.2', `the shares of the count ${share}`);
	// the line to the Sun: its chords and its brightness
	const ts = (SUN_ANGLE * Math.PI) / 180, bs = Math.sin(ts);
	const sunChords = SHELLS.map((_, k) => chord(k, bs) * EARTH);
	check(sunChords.slice(0, 3).map((x) => x.toFixed(0)).join() === '65,1763,7932' && sunChords[3] === 0 && sunChords[4] === 0, `the chords at 40 degrees ${sunChords}`);
	says('through 65 km of crust, 1763 km of upper mantle and 7932 km of lower mantle, where the ground reads $3.7\\times10^{-6}$');
	check(parts(ts).reduce((a, b) => a + b).toExponential(1) === '3.7e-6', 'the ground at 40 degrees');
	check(angles[1] < SUN_ANGLE && SUN_ANGLE < angles[0], 'the line to the Sun does not pass between the kinks');
	says('The line to the Sun leaves at 40°, between the kinks at 63° and 33°');
	// the Sun's core: a ball of radius 1.39 x 10^8 m at one astronomical unit, sending 10^8 W in gravitons of 2.70 k_B T
	const rc = 1.3914e8, AU = 1.496e11, Ndot = 1e8 / (2.70 * kB * 1.3e7);
	check(((2 * rc) / AU * 180 / Math.PI).toFixed(3) === '0.107' && ((3 * Ndot) / (8 * Math.PI ** 2 * rc ** 2)).toExponential(1) === '4.0e+5', 'the Sun\'s core');
	says('$= 0.107°$ across'); says('N_{\\rm centre} = \\frac{3\\dot N}{8\\pi^2r_{\\rm c}^2} = 4.0\\times10^5');
	says('places the top of the lower mantle to 5.2 km and the core\'s boundary to 28.9 km');
	says('At 33° the colour steps by $0.91/0.172 = 5.3$ to $1.04/0.089 = 11.7$: a factor of five to twelve.');
	check((0.91 / 0.172).toFixed(1) === '5.3' && (1.04 / 0.089).toFixed(1) === '11.7', 'the colour\'s step');
	// the caption, once drawn, and the sentence that points to it
	const drawn = flat.includes(`](${name}){#fig:read-ix-capstone}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-ix-capstone}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes('with the Sun at an equinox (Figure [](#fig:read-ix-capstone)).'), 'the capstone does not point to its figure');

	// ---- the shells: half discs, the left half, from the outside in; the boundaries; the surface and the cut -------
	const half = (r) => {
		const [x, y0] = P([0, r]), [, y1] = P([0, -r]);
		return `M${n2(x)},${n2(y0)}A${n2(R * r)},${n2(R * r)} 0 0 0 ${n2(x)},${n2(y1)}Z`;
	};
	const arc = (r, m = 360) => Array.from({ length: m + 1 }, (_, k) => P([-r * Math.sin((Math.PI * k) / m), r * Math.cos((Math.PI * k) / m)]));
	radii.forEach((r, k) => S.raw(`<path d="${half(r)}" fill="${shellFill(COLOURS[k])}"/>`, 0.1 + 0.01 * k));
	// the crust, 25 km, is thinner than the surface's line: its lower boundary is not drawn
	check(R * (radii[0] - radii[1]) < LINE, 'the crust is wider than the surface\'s line');
	for (let k = 2; k < radii.length; k++) {
		const [x, y0] = P([0, radii[k]]), [, y1] = P([0, -radii[k]]);
		S.raw(`<path d="M${n2(x)},${n2(y0)}A${n2(R * radii[k])},${n2(R * radii[k])} 0 0 0 ${n2(x)},${n2(y1)}" fill="none" stroke="${DIM}" stroke-width="${HAIR}"/>`, 0.5);
		S.mark(arc(radii[k]), HAIR / 2, `the top of the ${SHELLS[k][0]}`);
	}
	S.raw(`<path d="${half(1)}" fill="none" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="miter"/>`, 0.6);
	S.mark(arc(1), LINE / 2, 'the surface');
	S.mark([P([0, 1]), P([0, -1])], LINE / 2, 'the cut');

	// ---- the lines of sight from the camera ------------------------------------------------------------------------
	const C = [0, 1];
	const dir = (deg) => { const t = (deg * Math.PI) / 180; return [-Math.sin(t), -Math.cos(t)]; };
	const ends = GRAZED.map(([k], i) => {
		const t = (angles[i] * Math.PI) / 180, d = dir(angles[i]);
		const M = [C[0] + d[0] * Math.cos(t), C[1] + d[1] * Math.cos(t)], E = [C[0] + 2 * d[0] * Math.cos(t), C[1] + 2 * d[1] * Math.cos(t)];
		check(near(Math.hypot(...E), 1, 1e-14) && near(Math.hypot(...M), radii[k], 1e-14), `the line at ${GRAZED[i][1]} does not graze the ${SHELLS[k][0]}`);
		S.path([P(C), P(E)], { color: INK, width: LINE, layer: 2, cap: 'butt', what: `the line at ${GRAZED[i][1]}` });
		return { d, M, E };
	});
	// the line to the Sun, dashed, out through the surface to the Sun's sign
	const ds = dir(SUN_ANGLE), Es = [C[0] + 2 * ds[0] * Math.cos(ts), C[1] + 2 * ds[1] * Math.cos(ts)];
	check(near(Math.hypot(...Es), 1, 1e-14), 'the line to the Sun does not leave through the surface');
	const pc = P(C), pe = P(Es);
	const sc = P([C[0] + ds[0] * SUN.s, C[1] + ds[1] * SUN.s]);
	{
		const u = [ds[0], -ds[1]], reach = Math.hypot(sc[0] - pc[0], sc[1] - pc[1]) - SUN.r - SUN.air;
		S.path([pc, [pc[0] + u[0] * reach, pc[1] + u[1] * reach]], { color: INK, width: LINE, dash: DASH, layer: 2, cap: 'butt', what: 'the line to the Sun' });
	}
	S.raw(`<circle cx="${n2(sc[0])}" cy="${n2(sc[1])}" r="${SUN.r}" fill="#eeebe5" stroke="${INK}" stroke-width="${LINE}"/><circle cx="${n2(sc[0])}" cy="${n2(sc[1])}" r="${SUN.dot}" fill="${INK}"/>`, 3);
	S.mark([sc], SUN.r + LINE / 2, 'the Sun');
	S.raw(`<circle cx="${n2(pe[0])}" cy="${n2(pe[1])}" r="${MARK}" fill="${INK}"/>`, 3);
	S.mark([pe], MARK, 'the ground\'s dot');

	// ---- the camera -------------------------------------------------------------------------------------------------
	{
		const [x, y] = pc;
		const tri = [[x, y], [x - CAM.w / 2, y - CAM.h], [x + CAM.w / 2, y - CAM.h]];
		S.fill('M' + tri.map((q) => `${n2(q[0])},${n2(q[1])}`).join('L') + 'Z', { l: x - CAM.w / 2, r: x + CAM.w / 2, t: y - CAM.h, b: y }, { color: INK, layer: 4, what: 'the camera' });
		L.push(await S.clear('\\text{camera}', x - CAM.w / 2 - LABEL_GAP - 0.5, y - LABEL_GAP - 0.8, 1, 1, [-1, 0], { color: INK }));
	}

	// ---- the angles, each at the end of a dotted leader that carries its line beyond the surface -------------------
	const angleLabels = [];
	for (const [i, { d, E }] of ends.entries()) {
		const q = P(E), v = [d[0], -d[1]];
		const far = [q[0] + v[0] * EXT[i], q[1] + v[1] * EXT[i]];
		S.dots([q[0] + v[0] * 0.9, q[1] + v[1] * 0.9], far, { color: DIM, what: `the leader of ${GRAZED[i][1]}` });
		const probe = await beside(`${GRAZED[i][1]}^\\circ`, far, v, LABEL_GAP);
		const g = await S.clear(`${GRAZED[i][1]}^\\circ`, (probe.box.l + probe.box.r) / 2, (probe.box.t + probe.box.b) / 2, 0.5, 0.5, v);
		angleLabels.push(g);
		L.push(g);
	}
	// the two tags under the 33.1 degrees, left-aligned with it, a line apart (its digits sit on their baseline)
	{
		const a = angleLabels[1];
		L.push(await onBase('\\text{core edge }{\\pm}29\\text{ km}', a.box.l, a.box.b + BASE_PITCH, 0, DIM));
		L.push(await onBase('\\text{colour step }{\\times}5\\text{\u2013}12', a.box.l, a.box.b + 2 * BASE_PITCH, 0, DIM));
	}
	// the ground, left of the dot, over the line; the Sun's core, right of its sign, its figures centred on the sign
	L.push(await S.clear('\\text{ground }3.7\\times10^{-6}', pe[0] - GROUND.dx, pe[1] - GROUND.dy, 1, 1, [-0.6, -0.8]));
	const figH = await (async () => { const b = boxOf(await tex('0123456789', [0, 0], SIZE, 'lB', INK)); return -b.t; })();
	L.push(await onBase('\\text{Sun\'s core: }0.107^\\circ\\!,\\ 4.0\\times10^{5}', sc[0] + SUN.r + LINE / 2 + LABEL_GAP + 0.6, sc[1] + figH / 2, 0, INK));

	// ---- the table beside the lower half of the cut: header, rows from the crust (lowest) in, leaders --------------
	// each row on a baseline, its figures' middle level with its leader's end; the j_N aligned on their times signs
	let tableRight = 0;
	{
		const mids = radii.map((r, k) => -(r + (radii[k + 1] ?? 0)) / 2);       // each shell's middle on the cut, below O
		const width = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
		const nameW = Math.max(...(await Promise.all(SHELLS.map((s) => width(`\\text{${s[0]}}`)))));
		const shareW = Math.max(...(await Promise.all(SHELLS.map((s) => width(s[4])))));
		const mant = SHELLS.map((s) => s[5].split('\\times')[0]), pow = SHELLS.map((s) => '{}\\times' + s[5].split('\\times')[1]);
		const mantW = Math.max(...(await Promise.all(mant.map((m) => width(m)))));
		const x0 = O[0] + LEAD, x1 = x0 + nameW + COL_GAP, xm = x1 + shareW + COL_GAP + mantW;
		// the rows' middles: at their shells' middles where they can be, the crust's and upper mantle's pair spread to
		// PITCH about their two shells' middles, and each row above at least PITCH over the one below
		const ys = mids.map((m) => P([0, m])[1]);
		const rows = [...ys];
		const pair = (ys[0] + ys[1]) / 2;
		rows[0] = Math.max(ys[0], pair + PITCH / 2); rows[1] = rows[0] - PITCH;
		for (let k = 2; k < rows.length; k++) rows[k] = Math.min(ys[k], rows[k - 1] - PITCH);
		for (const [k, s] of SHELLS.entries()) {
			const base = rows[k] + figH / 2;
			L.push(await onBase(`\\text{${s[0]}}`, x0, base, 0, DIM));
			L.push(await onBase(s[4], x1, base, 0, INK));
			const m = await tex(mant[k], [xm, base], SIZE, 'rB', INK), pw = await tex(pow[k], [xm, base], SIZE, 'lB', INK);
			L.push({ src: mant[k], svg: m, box: boxOf(m) }, { src: pow[k], svg: pw, box: boxOf(pw) });
			S.path([[O[0] + LINE / 2, ys[k]], [x0 - LABEL_GAP - 0.4, rows[k]]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: `the leader of the ${s[0]}` });
			check(Math.abs(rows[k] - ys[k]) < 6, `the row of the ${s[0]} is far from its shell`);
		}
		tableRight = Math.max(...L.slice(-20).map((g) => g.box.r));
		const top = Math.min(...L.slice(-4).map((g) => g.box.t));
		const head = top - HEAD_DROP;
		L.push(await onBase('\\text{share}', x1, head, 0, DIM));
		L.push(await onBase('j_N', xm - mantW, head, 0, DIM));
	}

	// ---- the bar beside the upper half: a lifetime's count, in the shells' colours ----------------------------------
	{
		const x0 = O[0] + LEAD, BW = tableRight - x0;
		const over = O[1] - R * BAR.top;                    // the baseline of the title, the 12 and the 3.2%
		const y0 = over + LABEL_GAP + 0.8 + BAR.tick;       // the bar's top
		const under = y0 + BAR.h + LABEL_GAP + 0.9 + figH;  // the baseline of the parts' shares
		const xs = [x0];
		share.forEach((s) => xs.push(xs.at(-1) + s * BW));
		check(near(xs.at(-1), x0 + BW, 1e-9), 'the bar\'s parts do not add to the bar');
		share.forEach((_, k) => S.raw(`<path d="M${n2(xs[k])},${n2(y0)}H${n2(xs[k + 1])}V${n2(y0 + BAR.h)}H${n2(xs[k])}Z" fill="${shellFill(COLOURS[k])}"/>`, 1));
		for (let k = 2; k < xs.length - 1; k++) S.path([[xs[k], y0], [xs[k], y0 + BAR.h]], { color: DIM, width: HAIR, layer: 1.2, cap: 'butt', what: `the bar's part ${k}` });
		S.path([[x0, y0], [x0 + BW, y0], [x0 + BW, y0 + BAR.h], [x0, y0 + BAR.h]], { color: INK, width: HAIR, closed: true, cap: 'butt', layer: 1.3, what: 'the bar' });
		S.path([[x0, y0 - BAR.tick], [x0, y0]], { color: INK, width: HAIR, layer: 1.3, cap: 'butt', what: 'the crust\'s tick' });
		L.push(await onBase('\\text{35,800 in 80 years}', x0 + BW / 2, over, 0.5, INK));
		L.push(await onBase('12', x0, over, 0.5, INK));
		// the three wide parts named under the bar; the inner core's, 3.2%, over its end, as the crust's 12 over the other
		for (let k = 1; k < share.length - 1; k++) L.push(await onBase(SHELLS[k][7], (xs[k] + xs[k + 1]) / 2, under, 0.5, INK));
		L.push(await onBase(SHELLS[4][7], (xs[4] + xs[5]) / 2, over, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { angles, jN, share, lifetime, sunChords };
	return finish(S, L, [240, 345]);
}

/** A TeX label with its baseline at y and the point ax of its ink's width (0 left, 1 right) at x. */
async function onBase(src, x, y, ax, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + ax * (probe.r - probe.l)), y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
