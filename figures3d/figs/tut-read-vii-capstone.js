// The tutorial, reading section R11 (tutorial/black-holes/reading-section-vii.md), its second diagram: the capstone,
// one hole of section 11.3's equilibrium mass followed as the camera's lens in seven small panels, (a) to (g), the
// rows of the chapter's capstone table, in two rows, four and three, joined in reading order by thin grey arrows (the
// fourth to the fifth by a return arrow out at the right, back along the gap between the rows), each panel with its
// numbers beneath it.
//  (a) mass: the hole, a dot (11.1's near-black disc with an ink edge), beside the Moon's disc in matter's colour.
//      "1.356 x 10^23 kg, 0.905 K".
//  (b) lens: a logarithmic wavelength scale, 5 um to 20 cm, ticked at the decades; the energy per unit frequency of
//      the glow of matter at 293 K and of the graviton sky at 0.905 K, x^3 / (e^x - 1) with x = hc / lambda k_B T, each
//      scaled to its own peak (so peaking at 17.4 um and 5.6 mm, sections 10.1's and 11.3's peaks at 2.82 k_B T); the
//      waves shorter than 4 pi r_s = 2.53 mm, which the hole focuses, shaded in the page's tint, the cut-off an ink
//      line. "r_s = 0.201 mm; above 118 GHz".
//  (c) orbit: the camera (a small ink square, as 11.1's) on a circle round the hole, a curved arrow for its motion and
//      a grey radius. "26.3 km, 8.9 s".
//  (d) view: rays from a far source above (in the light role's colour, as 11.1's), passing the hole at b_E on either
//      side, turned toward the axis and meeting at the camera; the axis dotted; b_E dimensioned at the hole's plane
//      and theta_E marked at the camera. "theta_E = 25.5'', b_E = 3.25 m".
//  (e) gathers: the hole face on and round it the annulus of the rays that reach a detector of radius a = 5 cm, between
//      b_+- = (sqrt(a^2 + 4 b_E^2) +- a)/2 = 3.2751 and 3.2251 m for b_E = 3.25 m, in the light role's colour, drawn
//      with an eight times larger a. "1.02 m^2 = 130 x pi a^2".
//  (f) costs: the tide against the distance, log-log, 10 km to 10^5 km and 10^-12 to 10^2 s^-2: the hole's 2GM/r^3
//      in ink, the person's 2Gm/(1 m)^3 for 70 kg dashed in grey, the camera at 26.3 km where the hole's is 1 s^-2, a
//      grey double arrow from the person's tide up to the camera (a factor of 1.07 x 10^8), and an open circle where
//      the two are equal. "10^8 x the person's tide, out to 12,470 km".
//  (g) adds: five pixels, their records led into one sum, the computed lens. "classically nothing; a quantum image
//      from counts".
// The colours, as sections 11.1's and 11.3's figures (figs/tut-schw-*.js, figs/tut-hawking-*.js): the hole's fill
// fixed near black with an ink edge, the Moon in matter's colour, the rays and the annulus in the light role's colour;
// everything else in ink and the page's greys. Orange and blue, which mean a stretch and a squeeze, are not used.
// Departures from the diagram's comment, where the chapter's text decides: r_s is printed as the chapter's 0.201 mm,
// not 0.20; the numbers printed are exactly the table's and the section's (1.356 x 10^23 kg, 0.905 K, 0.201 mm,
// 118 GHz, 2.53 mm, 26.3 km, 8.9 s, 25.5'', 3.25 m, 1.02 m^2, 130, 12,470 km, 10^8), with the scale's decades named
// at 10 um and 1 mm; the annulus's radii are 3.2251 and 3.2751 m, not the comment's 3.227 and 3.277 m; the Moon's
// ratio of 1.85 is not printed; the two rows are kept at every width, since the site shows one drawing; the caption
// says which marks are exact, since (b) and (f) are drawn to scale.
// Exact: every number (computed here with the chapter's M = 1.356 x 10^23 kg and asserted against its text); the
// wavelength scale, the two spectra, their peaks and the cut-off in (b); the geometry of the rays in (d) (each turned
// at the hole's plane straight to the camera); the radii of (e) for the exaggerated a; every line, point and the
// double arrow of (f). Schematic: the sizes of the hole, the Moon, the orbit, the camera and the pixels; the
// proportions of (d) (b_E against d); the annulus's width, eight times too large.
import { tex, INK, DIM, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, near, HAIR, AXIS, LABEL_GAP } from './tut-pot-lib.js';
import { turning } from './tut-flow-lib.js';
import { bose, ENERGY, H } from './tut-planck-lib.js';
import { G, C, KB, LIGHT, HOLE, MATTER, palette, massAt, GRAVITON_SKY } from './tut-hawking-lib.js';

const name = 'tut-read-vii-capstone';
const check = checker(name);

// ---- the scene (SI) -------------------------------------------------------------------------------------------------
const M = 1.356e23;                         // kg, the chapter's equilibrium mass, used throughout
const PERSON = 70;                          // kg, at 1 m
const A = 0.05;                             // m, the detector's radius
const BE_ANNULUS = 3.25;                    // m, b_E as the chapter prints it, for the annulus's radii
const ROOM = 293;                           // K, section 10.1's room temperature
const DEG = Math.PI / 180;

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const SIZE = 9.6;                           // every label and number: about 9 px on a phone
const GUT = 12;                             // between the panels: an arrow with a whole head
const ROWS = [
	[['a', 'mass', 68], ['b', 'lens', 128], ['c', 'orbit', 64], ['d', 'view', 80]],
	[['e', 'gathers', 76], ['f', 'costs', 120], ['g', 'adds', 100]]
];
const DH = 58;                              // a panel's drawing, its height under the letter
const LETTER_AIR = 3;                       // the letter's foot to the drawing's room
const NUM_AIR = 5;                          // the lowest mark of a row to its numbers' caps
const NUM_PITCH = 12;                       // baseline to baseline within a number
const ROW_AIR = 20;                         // the lowest number of the first row to the second row's letters
const HEAD = 3.6;                           // the grey arrows' heads
const END_AIR = 1.2;                        // an arrow stops this far short of a panel
const OUT = 7;                              // the return arrow runs this far right of the fourth panel
const DROP_X = 11;                          // and comes down this far left of the fifth
const HOLE_R = 2.6, EDGE = 0.45;            // the hole: its radius on the page and its ink edge
const CAMERA = 4.2;                         // the camera's square, as 11.1's
const RAY = 0.6, LINE = 0.55, DOT = 0.5, DOT_STEP = 1.6;
const MOON_R = 15;                          // (a)
const DEC = 23, LAMBDA = [5e-6, 0.2], HUMP = 15.5, FLOOR = 0.06, BAND = 40.5;   // (b): points per decade, the scale's ends (m), a spectrum's height, where it stops (of its peak), the shading's height
const TICK = 2.5;                           // (b): the decades' ticks, below the scale
const ORBIT = 21;                           // (c): the orbit's radius
const SPIN = { r: 25.5, from: -20, to: 26, width: 0.6, head: 3.4 };   // (c): the camera's motion, degrees anticlockwise from the right
const CAM_AT = -35;                         // (c): the camera's place on the orbit, degrees anticlockwise from the right
const VIEW = { be: 19, hole: -12, cam: 25, arc: 13 };                 // (d): b_E, the hole's and the camera's heights from the centre, theta_E's arc
const RING = 22, EXAGGERATE = 8;           // (e): b_E on the page, and the factor on a
const PLOT = { left: 12, right: 12, top: -17, bottom: 21, x: [4, 8], y: [-12, 2] };   // (f): from the panel's sides and centre; log10 ranges (m, s^-2)
const DASH = [2.2, 1.6];
const PIXELS = { x: 24, step: 8, side: 3.6, sum: 70, r: 7.5 };      // (g)
const FILL = '#eeebe5';                     // the neutral tint of the page (drawing.ts THEME)
const CAPTION = 'Look first at the arrows: each panel\'s number feeds the next. The wavelengths of (b) and the tides of (f) are drawn to scale; the annulus\'s width is exaggerated eight times, and the other sizes are schematic.';

/** The numbers, computed and checked against the chapter's text. */
async function numbers() {
	const md = await (await fetch('/tutorial/black-holes/reading-section-vii.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sci = (x) => { const e = Math.floor(Math.log10(x)); return [(x / 10 ** e).toFixed(3), e]; };
	// (a) the mass, the hole as warm as the graviton sky
	check(massAt(GRAVITON_SKY).toPrecision(4) === '1.356e+23' && sci(M).join() === '1.356,23', 'the equilibrium mass is not 1.356 x 10^23 kg');
	has('The capstone follows one hole, of the equilibrium mass $1.356\\times10^{23}$ kg, through Part 11', 'the mass used');
	has('| (a) mass | $\\matter M = \\hbar c^3/8\\pi G\\kB T$, $T = 0.905$ K | $1.356\\times10^{23}$ kg; unstable | 11.3 |', '(a)');
	// (b) the lens: r_s, the cut-off 4 pi r_s and its frequency
	const rs = (2 * G * M) / C ** 2, cut = 4 * Math.PI * rs, ghz = C / cut / 1e9;
	check((rs * 1e3).toFixed(3) === '0.201' && (cut * 1e3).toFixed(2) === '2.53' && ghz.toFixed(0) === '118', `r_s ${rs}, 4 pi r_s ${cut}, ${ghz} GHz`);
	has('Its $r_s$ is 0.201 mm. By the **wave-optics cut-off** of section 11.1, a mass focuses only waves shorter than $4\\pi r_s$: 2.53 mm, or frequencies above 118 GHz', 'the cut-off');
	has('| (b) lens | $r_s = 2G\\matter M/c^2$; focuses $\\lambda < 4\\pi r_s$ | 0.201 mm; above 118 GHz, the warm glow | 11.1 |', '(b)');
	// the two spectra's peaks: the energy per unit frequency peaks at 2.82 k_B T
	const peak = (T) => (H * C) / (ENERGY * KB * T);
	check(ENERGY.toFixed(2) === '2.82' && (peak(ROOM) * 1e6).toFixed(1) === '17.4' && (peak(GRAVITON_SKY) * 1e3).toFixed(1) === '5.6', `the peaks ${peak(ROOM)} ${peak(GRAVITON_SKY)}`);
	check(((ENERGY * KB * GRAVITON_SKY) / H / 1e9).toFixed(0) === '53', 'the graviton sky does not peak at 53 GHz');
	check(peak(ROOM) < cut && peak(GRAVITON_SKY) > cut, 'the glow and the sky are not on either side of the cut-off');
	has('So the hole focuses the glow of room-temperature matter, which peaks at tens of micrometres', 'the warm glow');
	has('the 0.905 K graviton sky peaks near 53 GHz, below the cut-off.', 'the graviton sky');
	// (c) the orbit: where the hole's tide is 1 s^-2, and the period there
	const r = Math.cbrt(2 * G * M), T = 2 * Math.PI * Math.sqrt(r ** 3 / (G * M));
	check((r / 1e3).toFixed(1) === '26.3' && T.toFixed(1) === '8.9' && near(T, 2 * Math.PI * Math.SQRT2, 1e-9), `the orbit ${r} m, ${T} s`);
	has('It falls to $1\\unit{s^{-2}}$ at 26.3 km', 'the orbit\'s radius');
	has('| (c) orbit | $2G\\matter M/r^3 = 1\\unit{s^{-2}}$; period $T = 2\\pi\\sqrt{r^3/G\\matter M}$ | 26.3 km; 8.9 s | 11.1, 1.8 |', '(c)');
	// (d) the view: the ring's angle and b_E
	const th = Math.sqrt((2 * rs) / r), arcsec = th / DEG * 3600, be = th * r;
	check(arcsec.toFixed(1) === '25.5' && be.toFixed(2) === '3.25', `the view ${arcsec}'' ${be} m`);
	has('| (d) view | $\\theta_E = \\sqrt{2r_s/r}$, $b_E = \\theta_Er$, $\\theta_ET/\\pi$ | $25.5\'\'$, 3.25 m, 0.35 ms a turn | here |', '(d)');
	// (e) the area gathered, and the annulus's radii for b_E = 3.25 m
	const area = Math.PI * A * Math.sqrt(A * A + 4 * be * be), gain = area / (Math.PI * A * A);
	check(area.toFixed(2) === '1.02' && gain.toFixed(0) === '130', `the area ${area} m^2, ${gain}`);
	const radii = (a, b) => { const s = Math.sqrt(a * a + 4 * b * b); return [(s - a) / 2, (s + a) / 2]; };
	const [bm, bp] = radii(A, BE_ANNULUS);
	check(bm.toFixed(4) === '3.2251' && bp.toFixed(4) === '3.2751', `the annulus ${bm} ${bp}`);
	check(near(bp - bm, A, 1e-12) && near(bp * bm, BE_ANNULUS ** 2, 1e-12), 'the annulus is not a wide, about b_E');
	for (const b of [bm, bp]) check(near(Math.abs(b - BE_ANNULUS ** 2 / b), A, 1e-12), 'the annulus\'s edges do not land on the detector\'s edge');
	check(near(Math.PI * (bp * bp - bm * bm), Math.PI * A * Math.sqrt(A * A + 4 * BE_ANNULUS ** 2), 1e-12) && (Math.PI * (bp * bp - bm * bm)).toFixed(2) === '1.02', 'the annulus\'s area');
	has('between $b_\\pm = \\tfrac12[\\sqrt{a^2 + 4b_E^2} \\pm a]$', 'the annulus\'s radii');
	has('For $a = 5$ cm it is 1.02 m², 130 times $\\pi a^2$', 'the area gathered');
	has('| (e) gathers | $\\pi a\\sqrt{a^2 + 4b_E^2}$, $a = 5$ cm; peak $\\pi w$ | 1.02 m², 130 times; 795 | here |', '(e)');
	// (f) the cost: the person's tide, the factor at 26.3 km, and where the two tides are equal
	const person = (2 * G * PERSON) / 1 ** 3, ratio = 1 / person, equal = Math.cbrt(M / PERSON);
	check(person.toPrecision(2) === '9.3e-9' && ratio.toPrecision(3) === '1.07e+8' && Math.round(Math.log10(ratio)) === 8, `the person ${person}, ${ratio}`);
	check((Math.round(equal / 1e4) * 10).toLocaleString('en-US') === '12,470', `the tides are equal at ${equal} m`);
	has('A person of 70 kg a metre away raises the tide $9.3\\times10^{-9}\\unit{s^{-2}}$', 'the person');
	has('at 26.3 km the hole\'s is $1.07\\times10^8$ times larger', 'the factor');
	has('at 12,470 km.', 'where the tides are equal');
	has('| (f) costs | $r^3 = (\\matter M/70\\unit{kg})\\,\\mathrm{m^3}$ | the person\'s tide wins beyond 12,470 km | 1.4, here |', '(f)');
	// (g) what a lens adds
	has('| (g) adds | an image from counted gravitons | classically nothing | R8 |', '(g)');
	has('Classically a lens adds nothing, because an array does its sum by computation (below).', 'the computed lens');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-vii-capstone}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-vii-capstone}`, 'the caption');
	if (drawn) has('through Part 11 (Figure [](#fig:read-vii-capstone)).', 'the pointer');
	return { rs, cut, r, T, th, be, area, gain, person, ratio, equal, peak };
}

export default async function () {
	const N = await numbers();
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	const lbl = (src, x, y, ax, ay, color = INK) => placed(src, x, y, ax, ay, color, SIZE);
	const clr = (src, x, y, ax, ay, dir, color = INK) => S.clear(src, x, y, ax, ay, dir, { color, size: SIZE });
	const widthOf = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const placedBase = async (src, x, y, color = INK) => {
		const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
		const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
		return { src, svg: g, box: boxOf(g) };
	};
	const circlePts = (c, rr, n = 96) => Array.from({ length: n + 1 }, (_, i) => [c[0] + rr * Math.cos((2 * Math.PI * i) / n), c[1] + rr * Math.sin((2 * Math.PI * i) / n)]);
	const hole = (c, what) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${HOLE_R}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 3);
		S.mark(circlePts(c, HOLE_R), EDGE / 2, what);
	};
	const camera = (c, what) => {
		S.raw(`<rect x="${n2(c[0] - CAMERA / 2)}" y="${n2(c[1] - CAMERA / 2)}" width="${CAMERA}" height="${CAMERA}" fill="${INK}"/>`, 4);
		S.boxes.push({ box: { l: c[0] - CAMERA / 2, r: c[0] + CAMERA / 2, t: c[1] - CAMERA / 2, b: c[1] + CAMERA / 2 }, what });
	};
	const dotted = (A0, B0, what, skip = () => false) => {
		const len = Math.hypot(B0[0] - A0[0], B0[1] - A0[1]), n = Math.round(len / DOT_STEP);
		const pts = Array.from({ length: n + 1 }, (_, i) => [A0[0] + ((B0[0] - A0[0]) * i) / n, A0[1] + ((B0[1] - A0[1]) * i) / n]).filter((q) => !skip(q));
		S.raw(`<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
		S.mark([A0, B0], DOT / 2, what);
	};

	// ---- the panels' places: letters, the room of each drawing, the numbers under each row ---------------------------
	const W = Math.max(...ROWS.map((row) => row.reduce((s, p) => s + p[2], 0) + (row.length - 1) * GUT));
	const x0 = ORIGIN - W / 2;
	const panels = [];
	const LT = (await lbl('\\text{(a) mass}', 0, 0, 0, 0)).box;
	const letterH = LT.b - LT.t;
	const DRAW = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };
	let py = ORIGIN - 120;
	const rowsDone = [];
	for (const [row, list] of ROWS.entries()) {
		const rowW = list.reduce((s, p) => s + p[2], 0) + (list.length - 1) * GUT;
		let px = x0 + (W - rowW) / 2;
		const cy = py + letterH + LETTER_AIR + DH / 2;
		const pr = [];
		for (const [key, word, w] of list) {
			const p = { key, word, w, px, py, cy, cx: px + w / 2, row, top: cy - DH / 2, bot: cy + DH / 2 };
			p.m0 = S.marks.length; p.b0 = S.boxes.length; p.l0 = L.length; p.numLabels = [];
			L.push(await lbl(`\\text{(${key}) ${word}}`, px, py, 0, 0));
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
		// the numbers: under the row's room, each panel's lines centred on it, the rows' baselines shared
		const capTop = cy + DH / 2 + NUM_AIR;
		const probe = await lbl('\\text{0}', 0, 0, 0, 0);
		const base0 = capTop + (probe.box.b - probe.box.t);
		let lowest = 0;
		for (const p of pr) {
			let prevB = -Infinity, prevBase = -Infinity;
			for (const [j, s] of NUMS[p.key].entries()) {
				const wd = await widthOf(s);
				check(wd <= p.w - 2, `(${p.key}): the number's line ${s} is ${wd.toFixed(1)} pt, wider than its panel`);
				const pr0 = await placedBase(s, p.cx, 0);
				const base = j === 0 ? base0 : Math.max(prevBase + NUM_PITCH, prevB + LABEL_GAP + 0.1 - pr0.box.t);
				const g = await placedBase(s, p.cx, base);
				prevB = g.box.b; prevBase = base;
				L.push(g); p.numLabels.push(g);
				lowest = Math.max(lowest, g.box.b);
			}
		}
		rowsDone.push({ cy, lowest, top: py });
		py = lowest + ROW_AIR;
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

	// ---- the arrows: along each row at the drawings' middle, and back from the fourth panel to the fifth -------------
	const arrowAir = (a, b, what) => {
		const box = { l: Math.min(a[0], b[0]), r: Math.max(a[0], b[0]), t: Math.min(a[1], b[1]), b: Math.max(a[1], b[1]) };
		const c = S.clearance(box, (w) => w.startsWith('the arrow') || w.startsWith('the return'));
		check(c.d >= 2.5, `${what} runs ${c.d.toFixed(2)} pt from ${c.what}`);
	};
	for (let i = 0; i + 1 < panels.length; i++) {
		const p = panels[i], q = panels[i + 1];
		if (p.row === q.row) {
			const A0 = [p.px + p.w + END_AIR, p.cy], B0 = [q.px - END_AIR, q.cy];
			arrowAir(A0, B0, `the arrow from (${p.key})`);
			const ar = S.arrow(A0, B0, { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from (${p.key})` });
			check(ar.head === HEAD, `the arrow from (${p.key}) is too short for a whole head`);
			continue;
		}
		const yg = (rowsDone[0].lowest + rowsDone[1].top) / 2;
		const xr = p.px + p.w + OUT, xl = q.px - DROP_X;
		const legs = [[p.px + p.w + END_AIR, p.cy], [xr, p.cy], [xr, yg], [xl, yg], [xl, q.cy]];
		for (let k = 0; k + 1 < legs.length; k++) arrowAir(legs[k], legs[k + 1], `the return arrow's leg ${k + 1}`);
		S.path(legs, { color: DIM, width: HAIR, cap: 'butt', what: 'the return arrow' });
		const last = S.arrow([xl, q.cy], [q.px - END_AIR, q.cy], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the return arrow\'s last leg' });
		check(last.head === HEAD, 'the return arrow\'s last leg is too short for a whole head');
		check(yg - rowsDone[0].lowest >= 6 && rowsDone[1].top - yg >= 6, 'the return arrow runs too near the rows');
	}

	S.checkAll(L);
	window[name] = { N, W, panels: panels.map((p) => ({ key: p.key, px: p.px, w: p.w })) };
	return finish(S, L, [350, 390]);

	// ======================================================================================================================
	// the seven drawings, each in its panel's room (p.px to p.px + p.w, p.top to p.bot), about p.cy
	async function drawA(p) {
		const hc = [p.px + 11, p.cy - 4], mc = [p.px + 41, p.cy - 4];
		hole(hc, '(a)\'s hole');
		S.raw(`<circle cx="${n2(mc[0])}" cy="${n2(mc[1])}" r="${MOON_R}" fill="${MATTER}"/>`, 2);
		S.mark(circlePts(mc, MOON_R), 0, 'the Moon');
		check(mc[0] - MOON_R - (hc[0] + HOLE_R) >= 10, '(a): the hole sits on the Moon');
		L.push(await lbl('\\text{Moon}', mc[0], mc[1] + MOON_R + LABEL_GAP + 0.3, 0.5, 0));
	}

	async function drawB(p) {
		const X0 = p.px + 7, Y = p.cy + 12;
		const xOf = (lam) => X0 + DEC * Math.log10(lam / LAMBDA[0]);
		const X1 = xOf(LAMBDA[1]), xc = xOf(N.cut);
		const top = Y - BAND;
		// the waves the hole focuses, shorter than 4 pi r_s: the page's tint, from the scale's start to the cut-off
		S.fill(`M${n2(X0)},${n2(top)}H${n2(xc)}V${n2(Y)}H${n2(X0)}Z`, { l: X0, r: xc, t: top, b: Y }, { color: FILL, layer: 0, what: '(b)\'s shading', solid: false });
		// the scale, its decades ticked below it
		S.path([[X0, Y], [X1, Y]], { color: INK, width: AXIS, cap: 'butt', layer: 2, what: '(b)\'s scale' });
		const decades = [1e-5, 1e-4, 1e-3, 1e-2, 1e-1];
		for (const d of decades) S.path([[xOf(d), Y], [xOf(d), Y + TICK]], { color: INK, width: HAIR, cap: 'butt', layer: 2, what: `(b)'s tick at ${d}` });
		// the cut-off, through the scale and up the shading's edge
		S.path([[xc, Y + TICK], [xc, top]], { color: INK, width: LINE, cap: 'butt', layer: 2.5, what: '(b)\'s cut-off' });
		// the two spectra: x^3 / (e^x - 1), x = hc / lambda k_B T, each over its peak, where above FLOOR of it
		const top3 = bose(3, ENERGY);
		const spectrum = (T, what) => {
			const pts = [];
			for (let i = 0; i <= 600; i++) {
				const lam = LAMBDA[0] * (LAMBDA[1] / LAMBDA[0]) ** (i / 600);
				const f = bose(3, (H * C) / (lam * KB * T)) / top3;
				if (f >= FLOOR) pts.push([xOf(lam), Y - HUMP * f]);
			}
			check(pts[0][0] > X0 + 0.01 && pts.at(-1)[0] < X1 - 0.01, `(b): the ${what} is cut by the scale's ends`);
			S.path(pts, { color: INK, width: LINE, layer: 2, what: `(b)'s ${what}` });
			return pts;
		};
		const glow = spectrum(ROOM, 'warm glow'), sky = spectrum(GRAVITON_SKY, 'graviton sky');
		const peakOf = (pts) => pts.reduce((a, q) => (q[1] < a[1] ? q : a));
		check(Math.abs(peakOf(glow)[0] - xOf(N.peak(ROOM))) < 0.3 && Math.abs(peakOf(sky)[0] - xOf(N.peak(GRAVITON_SKY))) < 0.3, '(b): the spectra do not peak at 17.4 um and 5.6 mm');
		check(peakOf(glow)[0] < xc && peakOf(sky)[0] > xc, '(b): the peaks are not on either side of the cut-off');
		// the names: the scale's 10 um and the cut-off below it; "focused" in the shading, at the cut-off; the spectra
		const under = Y + TICK + LABEL_GAP + 0.5;
		L.push(await lbl('10\\ \\mathrm{\\mu m}', xOf(1e-5), under, 0.5, 0));
		L.push(await lbl('2.53\\ \\mathrm{mm}', xc, under, 0.5, 0));
		const foc = await lbl('\\text{focused}', xc - LABEL_GAP - 0.4, top + 2.6, 1, 0);
		L.push(foc);
		L.push(await clr('\\text{warm glow}', X0 + 2.6, Y - HUMP - LABEL_GAP, 0, 1, [0, -1]));
		L.push(await lbl('\\text{graviton sky}', xc + LABEL_GAP + 0.4, top + 2.6, 0, 0));
	}

	async function drawC(p) {
		const c = [p.cx, p.cy];
		hole(c, '(c)\'s hole');
		S.path(circlePts(c, ORBIT, 180), { color: INK, width: AXIS, layer: 1, what: 'the orbit' });
		const u = [Math.cos(CAM_AT * DEG), -Math.sin(CAM_AT * DEG)];
		const cam = [c[0] + ORBIT * u[0], c[1] + ORBIT * u[1]];
		camera(cam, '(c)\'s camera');
		S.path([[c[0] + (HOLE_R + 1) * u[0], c[1] + (HOLE_R + 1) * u[1]], [cam[0] - (CAMERA / 2 + 1.4) * u[0] * Math.SQRT2, cam[1] - (CAMERA / 2 + 1.4) * u[1] * Math.SQRT2]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the orbit\'s radius' });
		const t = turning(c[0], c[1], SPIN.r, SPIN.from * DEG, SPIN.to * DEG, INK, { width: SPIN.width, head: SPIN.head });
		S.raw(t.svg, 4);
		S.mark(t.pts, SPIN.width / 2, 'the camera\'s motion');
		S.mark(t.head, 0, 'the camera\'s motion\'s head');
		S.arrows.push({ L: t.len, head: t.hd, what: 'the camera\'s motion' });
		check(SPIN.from > CAM_AT && SPIN.to > SPIN.from, '(c): the motion does not run on ahead of the camera, anticlockwise');
	}

	async function drawD(p) {
		const top = p.top + 0.5, hy = p.cy + VIEW.hole, cy = p.cy + VIEW.cam;
		const h = [p.cx, hy], cam = [p.cx, cy];
		hole(h, '(d)\'s hole');
		camera(cam, '(d)\'s camera');
		const meet = [p.cx, cy - CAMERA / 2 - 0.2];
		// the axis, dotted, from the far source above through the hole to the camera
		dotted([p.cx, top + 0.3], [p.cx, meet[1] - 0.8], 'the axis', (q) => Math.hypot(q[0] - h[0], q[1] - h[1]) < HOLE_R + 1.4);
		// the rays at b_E on either side: straight down to the hole's plane, then straight to the camera
		const d = meet[1] - hy;
		for (const s of [1, -1]) {
			const pts = [[p.cx + s * VIEW.be, top], [p.cx + s * VIEW.be, hy], meet];
			S.path(pts, { color: LIGHT, width: RAY, layer: 2, cap: 'butt', what: `the ray at ${s > 0 ? '+' : '-'}b_E` });
		}
		// b_E, from the hole's edge to the right ray, at the hole's plane, named above it
		const yd = hy;
		S.path([[p.cx + HOLE_R + 0.8, yd], [p.cx + VIEW.be - RAY / 2, yd]], { color: INK, width: HAIR, cap: 'butt', layer: 2.5, what: 'b_E\'s dimension' });
		L.push(await lbl('b_E', p.cx + (HOLE_R + VIEW.be) / 2 + 0.6, yd - LABEL_GAP - 0.3, 0.5, 1));
		// theta_E at the camera, between the axis and the right ray, named beside the ray
		const th = Math.atan(VIEW.be / d);
		const arc = Array.from({ length: 41 }, (_, i) => { const a = (th * i) / 40; return [meet[0] + VIEW.arc * Math.sin(a), meet[1] - VIEW.arc * Math.cos(a)]; });
		S.path(arc, { color: INK, width: HAIR, cap: 'butt', layer: 2.5, what: 'theta_E\'s arc' });
		const am = [meet[0] + VIEW.arc * Math.sin(th / 2), meet[1] - VIEW.arc * Math.cos(th / 2)];
		L.push(await clr('\\theta_E', am[0] + 3, am[1], 0, 0.5, [1, 0]));
	}

	async function drawE(p) {
		const c = [p.cx, p.cy];
		const k = RING / BE_ANNULUS;                    // points per metre
		const a = EXAGGERATE * A, s = Math.sqrt(a * a + 4 * BE_ANNULUS ** 2);
		const [ri, ro] = [(s - a) / 2 * k, (s + a) / 2 * k];
		check(near(ri * ro, RING * RING, 1e-9) && near(ro - ri, a * k, 1e-9), '(e): the annulus is not about b_E');
		const ring = (rr) => `M${n2(c[0] + rr)},${n2(c[1])}A${n2(rr)},${n2(rr)} 0 1,0 ${n2(c[0] - rr)},${n2(c[1])}A${n2(rr)},${n2(rr)} 0 1,0 ${n2(c[0] + rr)},${n2(c[1])}Z`;
		S.raw(`<path d="${ring(ro)}${ring(ri)}" fill="${LIGHT}" fill-rule="evenodd"/>`, 2);
		S.mark(circlePts(c, ro), 0, 'the annulus\'s outer edge');
		S.mark(circlePts(c, ri), 0, 'the annulus\'s inner edge');
		hole(c, '(e)\'s hole');
	}

	async function drawF(p) {
		const xl = p.px + PLOT.left, xr = p.px + p.w - PLOT.right, yt = p.cy + PLOT.top, yb = p.cy + PLOT.bottom;
		const xOf = (r) => xl + ((Math.log10(r) - PLOT.x[0]) / (PLOT.x[1] - PLOT.x[0])) * (xr - xl);
		const yOf = (t) => yb - ((Math.log10(t) - PLOT.y[0]) / (PLOT.y[1] - PLOT.y[0])) * (yb - yt);
		const tide = (r) => (2 * G * M) / r ** 3;
		S.path([[xl, yt], [xl, yb], [xr, yb]], { color: INK, width: AXIS, cap: 'butt', layer: 1, what: '(f)\'s axes' });
		// the hole's tide, a straight line on log-log axes, across the whole range
		const r0 = 10 ** PLOT.x[0], r1 = 10 ** PLOT.x[1];
		check(tide(r0) < 10 ** PLOT.y[1] && tide(r1) > 10 ** PLOT.y[0], '(f): the hole\'s tide leaves the axes');
		S.path([[xOf(r0), yOf(tide(r0))], [xOf(r1), yOf(tide(r1))]], { color: INK, width: LINE, cap: 'butt', layer: 2, what: 'the hole\'s tide' });
		// the person's, dashed, a whole number of dashes
		const yp = yOf(N.person);
		{
			const len = xr - xl - 1, n = Math.round((len + DASH[1]) / (DASH[0] + DASH[1])), f = (len + DASH[1]) / (n * (DASH[0] + DASH[1]));
			S.raw(`<path d="M${n2(xl + 1)},${n2(yp)}H${n2(xr)}" stroke="${DIM}" stroke-width="${LINE}" stroke-dasharray="${n2(DASH[0] * f)} ${n2(DASH[1] * f)}" fill="none"/>`, 1.5);
			S.mark([[xl + 1, yp], [xr, yp]], LINE / 2, 'the person\'s tide');
		}
		// the camera where the hole's tide is 1 s^-2, and the factor 10^8 below it
		const cam = [xOf(N.r), yOf(1)];
		check(near(tide(N.r), 1, 1e-12), '(f): the camera is not where the tide is 1 s^-2');
		camera(cam, '(f)\'s camera');
		const xm = cam[0], mid = (yp + cam[1] + CAMERA / 2) / 2;
		S.arrow([xm, mid], [xm, cam[1] + CAMERA / 2 + 0.9], { color: DIM, width: HAIR, head: 3, layer: 2, what: 'the factor\'s upper arrow' });
		S.arrow([xm, mid], [xm, yp - LINE / 2 - 0.5], { color: DIM, width: HAIR, head: 3, layer: 2, what: 'the factor\'s lower arrow' });
		check(near(Math.log10(1 / N.person), (yp - cam[1]) / ((yb - yt) / (PLOT.y[1] - PLOT.y[0])), 1e-9), '(f): the double arrow does not span the factor');
		// where the two tides are equal
		const eq = [xOf(N.equal), yp];
		check(near(tide(N.equal), N.person, 1e-20), '(f): the circle is not where the tides are equal');
		S.raw(`<circle cx="${n2(eq[0])}" cy="${n2(eq[1])}" r="1.9" fill="${PAGE}" stroke="${INK}" stroke-width="${LINE}"/>`, 3);
		S.mark(circlePts(eq, 1.9), LINE / 2, 'the tides\' meeting');
		// the names: the axes, the two tides
		L.push(await lbl('\\text{tide}', xl, yt - LABEL_GAP - 0.3, 0.5, 1));
		L.push(await lbl('r', xr + LABEL_GAP + 0.3, yb, 0, 0.5));
		const along = [xOf(r1) - xOf(r0), yOf(tide(r1)) - yOf(tide(r0))], ln = Math.hypot(...along);
		const nrm = [-along[1] / ln, along[0] / ln].map((v) => -v);   // up and to the right of the line
		const at = [xOf(3e5), yOf(tide(3e5))];
		L.push(await clr('\\text{hole}', at[0] + nrm[0] * 3, at[1] + nrm[1] * 3, 0, 1, nrm));
		L.push(await clr('\\text{person}', xr, yp - LINE / 2 - LABEL_GAP - 0.3, 1, 1, [0, -1]));
	}

	async function drawG(p) {
		const sc = [p.px + PIXELS.sum, p.cy];
		S.raw(`<circle cx="${n2(sc[0])}" cy="${n2(sc[1])}" r="${PIXELS.r}" fill="none" stroke="${INK}" stroke-width="${LINE}"/>`, 2);
		S.mark(circlePts(sc, PIXELS.r), LINE / 2, 'the sum');
		const sig = await lbl('\\Sigma', sc[0], sc[1], 0.5, 0.5);
		sig.on = ['the sum'];
		L.push(sig);
		check(sig.box.r - sig.box.l <= 2 * PIXELS.r - 2 * 2.2 && sig.box.b - sig.box.t <= 2 * PIXELS.r - 2 * 2.2, '(g): the sum\'s sign does not fit its circle');
		for (let i = -2; i <= 2; i++) {
			const q = [p.px + PIXELS.x, p.cy + i * PIXELS.step];
			S.raw(`<rect x="${n2(q[0] - PIXELS.side / 2)}" y="${n2(q[1] - PIXELS.side / 2)}" width="${PIXELS.side}" height="${PIXELS.side}" fill="${INK}"/>`, 3);
			S.boxes.push({ box: { l: q[0] - PIXELS.side / 2, r: q[0] + PIXELS.side / 2, t: q[1] - PIXELS.side / 2, b: q[1] + PIXELS.side / 2 }, what: `pixel ${i}` });
			const from = [q[0] + PIXELS.side / 2 + 1, q[1]];
			const u = [sc[0] - from[0], sc[1] - from[1]], lu = Math.hypot(...u);
			const to = [sc[0] - (u[0] / lu) * (PIXELS.r + 0.9), sc[1] - (u[1] / lu) * (PIXELS.r + 0.9)];
			S.path([from, to], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the record of pixel ${i}` });
		}
	}
}

// ---- the numbers under the panels: exactly the chapter's (asserted in numbers()) ------------------------------------
const NUMS = {
	a: ['1.356\\times10^{23}\\ \\mathrm{kg},', '0.905\\ \\mathrm{K}'],
	b: ['r_s = 0.201\\ \\mathrm{mm};', '\\text{above }118\\ \\mathrm{GHz}'],
	c: ['26.3\\ \\mathrm{km},', '8.9\\ \\mathrm{s}'],
	d: ['\\theta_E = 25.5\'\',', 'b_E = 3.25\\ \\mathrm{m}'],
	e: ['1.02\\ \\mathrm{m^2}', '= 130\\times\\pi a^2'],
	f: ['10^8\\times\\text{the person\'s tide,}', '\\text{out to }12{,}470\\ \\mathrm{km}'],
	g: ['\\text{classically nothing;}', '\\text{a quantum image}', '\\text{from counts}']
};
