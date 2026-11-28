// The tutorial, reading section R12b (tutorial/sky/reading-section-xi-2.md), its second diagram: the capstone, one hole
// of ten equilibrium masses against the 0.905 K graviton glow, seen by a camera at rest at r = 40 GM/c^2, in nine
// small panels, (a) to (i), the rows of the chapter's capstone table, in three rows of three (R11's capstone,
// figs/tut-read-vii-capstone.js, has two rows of a strip of seven; nine panels in one strip would not read on a phone),
// joined in reading order by thin grey arrows, each row's last panel to the next row's first by a return arrow out at
// the right, back along the gap between the rows; each panel with its numbers beneath it.
//  (a) the sky: a thermometer standing in a uniform glow. "0.905 K; 0.929 K seen".
//  (b) its gravitons: three wavelengths of the seen sky's mean wavelength, 5.74 mm, a dimension over the middle one.
//      "3.87 x 10^14 gravitons per s, m^2, sr; lambda = 5.74 mm".
//  (c) the hole: its capture disc, 2 sqrt(27) GM/c^2 = 1.05 cm across, in the page's tint with a grey edge, and in it
//      the horizon, r_s = 2GM/c^2, 11.1's near-black disc with an ink edge; "capture disc" named over the disc,
//      "horizon" under it with a leader up through the disc to the hole. "T_H = 0.0905 K; disc 1.05 cm across".
//  (d) the shadow: the camera's sky about the hole's direction as a disc of directions, out to 23 degrees, in the glow;
//      the shadow from rest, 7.27 degrees in radius, the near-black disc; dashed inside it, the falling camera's,
//      5.80 degrees. "7.27 deg; 5.80 deg falling".
//  (e) the ring: the same sky and shadow, the Einstein ring dashed at 20.2 degrees. "20.2 deg".
//  (f) how dark: two discs on the glow, darkened by the depth weighed in energy, 93%, and counted, 82%, each named under
//      it on the glow, "energy" and "count".
//      "93% by energy; 82% by count".
//  (g) with spin: the hole turning (an ink arrow round it) and the mode l = m = 2 turning with it (two arrows, half a
//      turn apart). "10.3 times the sky at 43.6 GHz".
//  (h) how deep: the hole, the camera at r (a dimension) and the thermometer at the camera. "r = 40 GM/c^2, read from
//      the sky seen 2.6% warmer".
//  (i) counting: two pixels back to back, gravitons arriving at each from opposite directions. "g2 = 2 if thermal;
//      2 + 1/n only if born in inflation".
// The colours: gravitons and the glow in the field's colour (12.2's, figs/tut-universe-*.js), the glow as a wash of it;
// the Einstein ring in the light role's colour (11.1's rings, figs/tut-schw-ring.js); the hole 11.1's fixed near-black
// disc with an ink edge, which the site does not swap; the falling shadow's dashes on it a fixed pale grey, likewise
// not swapped, so that they show on the near-black in both themes; everything else in ink and the page's greys.
// Orange and blue, which mean a stretch and a squeeze, are not used.
// Departures from the diagram's comment, where the chapter's text decides: the numbers printed are exactly the
// table's, 3.87 x 10^14 and 5.74 mm in (b), not 3.9 x 10^14 and 5.7 mm, with the words the table's terse cells
// leave out ("gravitons" in (b), "read from the sky seen ... warmer" in (h), "if thermal" in (i)); (b) draws the wavelength and not a square
// metre, since a square metre cannot stand at the wavelength's scale; (i) prints the table's second entry, 2 + 1/n
// only if born in inflation; three rows of three, not one strip; the caption writes GM/c^2 as the chapter does.
// The printed book (figureLayout 'book') keeps the three rows of three but makes each panel 128 points wide, not 104,
// so that the grid spans the text, and lower: each drawing's room 62 points high, not 72 (the glow of (a) 58 high, the
// angles of (d) and (e) at 1.3 points to the degree, not 1.5), 16 points between the rows, not 20, and the numbers of
// (b), (d), (f) and (i) set in fewer, wider lines, the same words.
// Exact: every number (computed here and asserted against the chapter's text: the glow's temperature from 3.91 and
// 106.75, the seen sky's, the count and the mean wavelength, the hole's mass, temperature and capture disc, the shadow
// by 11.1's arcsine and by 6.3's aberration, the ring by 11.1's rays integrated (figs/tut-schw-lib.js), the depths by
// section 11.3's greybody factors (figs/tut-hawking-lib.js, the capture area above x = 3), the spinning hole's
// threshold, temperature and gain, the distance read from 2.6%); the angles of (d) and (e), at one scale; the wavelength
// of (b) and the disc and horizon of (c), at one scale. Schematic: the glow's extent and wash, the thermometers and
// their reading, the discs of (f) (their darkness only follows the depths), the arrows of (g), the distance of (h),
// and the pixels and gravitons of (i).
import { tex, INK, DIM, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { turning } from './tut-flow-lib.js';
import { HBAR, KB, C, G, massAt, GRAVITON_SKY, X, share } from './tut-hawking-lib.js';
import { HOLE, DEG, shadowRadius, exactRing, impactOf } from './tut-schw-lib.js';
import { FIELD, LIGHT, palette, GRAV_FLAT, G_HOT, G_TODAY, T_GAMMA } from './tut-universe-lib.js';

const name = 'tut-read-xi-hole';
const check = checker(name);

// ---- the scene ------------------------------------------------------------------------------------------------------
const MU = 10;                              // the hole's mass in equilibrium masses
const R = 40;                               // the camera's distance, GM/c^2
const ZETA3 = 1.2020569031595942;
const MOON = 7.342e22;                      // kg (tut-hawking-lib's BODIES)
const CHI = 0.998, GAIN = 0.91, XSPIN = 0.92;  // (g): the spin, the stated peak gain of l = m = 2, the frequency chosen

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const SIZE = 9.6;                           // every label and number: R11's capstone's
const BOOK = globalThis.figureLayout === 'book';
const PW = BOOK ? 128 : 104;                // a panel's width
const GUT = 14;                             // between the panels: an arrow with a whole head
const ROWS = [
	[['a', 'the sky'], ['b', 'its gravitons'], ['c', 'the hole']],
	[['d', 'the shadow'], ['e', 'the ring'], ['f', 'how dark']],
	[['g', 'with spin'], ['h', 'how deep'], ['i', 'counting']]
];
const DH = BOOK ? 62 : 72;                  // a panel's drawing, its height under the letter
const LETTER_AIR = 3;                       // the letter's foot to the drawing's room
const NUM_AIR = 5;                          // the lowest mark of a row to its numbers' caps
const NUM_PITCH = 12;                       // baseline to baseline within a number
const ROW_AIR = BOOK ? 16 : 20;             // the lowest number of a row to the next row's letters
const HEAD = 3.6;                           // the grey arrows' heads
const END_AIR = 1.2;                        // an arrow stops this far short of a panel
const OUT = 7;                              // the return arrows run this far right of a row's last panel
const DROP_X = 11;                          // and come down this far left of the next row's first
const LINE = 0.55, EDGE = 0.45, WAVE = 0.6; // a drawn outline, the hole's ink edge, a graviton's line
const GLOW = 0.2;                           // the glow: the field's colour washed over the page
const MM = 3.5;                             // (b), (c): points per millimetre
const DEG_PT = BOOK ? 1.3 : 1.5;            // (d), (e): points per degree
const SKY = 23;                             // (d), (e): the disc of directions, degrees from the hole's direction
const PALE = '#ddd8cd';                     // the falling shadow's dashes on the near-black: fixed, not swapped
const CAMERA = 4.2;                         // the camera's square, as 11.1's
const FILL = '#eeebe5';                     // the neutral tint of the page (drawing.ts THEME)
const CAPTION = 'Look first at the arrows: each panel\'s number feeds the next. The angles depend only on the distance in units of $G\\matter M/c^2$; the mass sets how dark the disc is. Angles and the two lengths of (b) and (c) are to scale; the rest is schematic.';
const POINTER = '4.03 cm away in circumference radius (Figure [](#fig:read-xi-hole)).';

/** The numbers, computed and checked against the chapter's text. */
async function numbers() {
	const md = await (await fetch('/tutorial/sky/reading-section-xi-2.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;
	const sci = (x, d) => { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(d)}e${e}`; };

	// the scene
	const M = MU * massAt(GRAVITON_SKY), GM = G * M, len = GM / C ** 2;      // kg, m^3 s^-2, m
	check(sci(M, 3) === '1.356e24' && Math.round(M / MOON) === 18, `the hole ${M} kg`);
	check((R * len * 100).toFixed(2) === '4.03', `the camera at ${R * len} m`);
	has(r`A hole of ten equilibrium masses, $\matter M = 1.356\times10^{24}$ kg or 18 Moon masses, stands against the 0.905 K
glow, and the camera is at rest at $r = 40\,G\matter M/c^2$, 4.03 cm away in circumference radius`, 'the scene');

	// (a) the sky: 0.905 K, and seen from rest at r
	check(GRAV_FLAT.toFixed(4) === '0.3321' && G_HOT === 106.75 && G_TODAY.toFixed(2) === '3.91' && T_GAMMA === 2.7255, 'the glow\'s ratio');
	check((GRAV_FLAT * T_GAMMA).toFixed(3) === '0.905' && GRAVITON_SKY === 0.905, `the glow at ${GRAV_FLAT * T_GAMMA} K`);
	const T = GRAVITON_SKY, push = 1 / Math.sqrt(1 - 2 / R), seen = T * push;
	check(push.toFixed(3) === '1.026' && ((push - 1) * 100).toFixed(2) === '2.60' && seen.toFixed(4) === '0.9285' && seen.toFixed(3) === '0.929', `the seen sky ${seen}`);
	has('So $T_g = 0.3321\\times2.7255 = 0.905$ K', 'the glow');
	has('So the sky is 2.60% warmer, at 0.9285 K', 'the seen sky');
	has(r`| (a) the sky | $T_g = (3.91/106.75)^{1/3}T_\gamma$; seen, $T_g/\sqrt{1 - 2G\matter M/c^2r}$ | 0.905 K; 0.929 K | 12.2, 11.1 |`, '(a)');

	// (b) its gravitons: the count and the mean wavelength, far and seen
	const count = (t) => (ZETA3 * ((KB * t) / HBAR) ** 3) / (2 * Math.PI ** 3 * C ** 2);
	const mean = Math.PI ** 4 / (30 * ZETA3);
	const lambda = (t) => (2 * Math.PI * HBAR * C) / (mean * KB * t);
	check(mean.toFixed(2) === '2.70', `the mean energy ${mean} k_B T`);
	check(sci(count(T), 2) === '3.59e14' && sci(count(seen), 2) === '3.87e14' && ((count(seen) / count(T) - 1) * 100).toFixed(1) === '8.0', `the counts ${count(T)} ${count(seen)}`);
	check((lambda(T) * 1e3).toFixed(2) === '5.89' && (lambda(seen) * 1e3).toFixed(2) === '5.74' && ((1 - lambda(seen) / lambda(T)) * 100).toFixed(1) === '2.5', `the wavelengths ${lambda(T)} ${lambda(seen)}`);
	has('$3.59\\times10^{14}$ gravitons per second, per square metre and per steradian at 0.905 K', 'the far count');
	has(r`| (b) its gravitons | (a)'s 0.929 K in $N \propto T^3$ and $\lambda = 2\pi\hbar c/2.70\,\kB T$ | $3.87\times10^{14}$ per s, m², sr; 5.74 mm | 10.1, 12.2 |`, '(b)');
	has(r`In (b) the sky is seen 2.6% warmer, so the count rises as $T^3$, 8.0% above the far $3.59\times10^{14}$, and the
wavelength falls as $1/T$, 2.5% below the far 5.89 mm.`, 'the line under the table');

	// (c) the hole: its temperature and capture disc
	const TH = (HBAR * C ** 3) / (8 * Math.PI * GM * KB), disc = 2 * Math.sqrt(27) * len;
	check(TH.toFixed(4) === '0.0905' && (disc * 100).toFixed(2) === '1.05', `the hole ${TH} K, ${disc} m`);
	has(r`| (c) the hole | $T_H = \hbar c^3/8\pi G\matter M\kB$; disc $2\sqrt{27}\,G\matter M/c^2$ | 0.0905 K; 1.05 cm across | 11.3, 11.1 |`, '(c)');
	check(disc > lambda(seen), 'the disc is not wider than the wavelength');

	// (d) the shadow from rest, and falling: aberration at Newton's escape speed
	const rest = shadowRadius(R), beta = Math.sqrt(2 / R);
	const fall = Math.acos((Math.cos(rest) + beta) / (1 + beta * Math.cos(rest)));
	check((rest / DEG).toFixed(2) === '7.27' && (fall / DEG).toFixed(2) === '5.80' && beta.toFixed(3) === '0.224', `the shadows ${rest / DEG} ${fall / DEG}`);
	check(near(Math.sin(rest), (Math.sqrt(27) / R) * Math.sqrt(1 - 2 / R), 1e-15), 'the shadow is not 11.1\'s arcsine');
	has(r`$7.27°$ at $r = 40\,G\matter M/c^2$.`, 'the shadow');
	has(r`$5.80°$ instead
of $7.27°$ at $40\,G\matter M/c^2$, where $\obs v = 0.224c$`, 'the falling shadow');
	has(r`| (d) the shadow | at (a)'s $r$, 11.1's arcsine; falling, 6.3's aberration | $7.27°$; $5.80°$ falling | 11.1, 6.3 |`, '(d)');

	// (e) the ring: the ray that turns through 180 degrees
	const ring = exactRing(R, 1e-3);
	check((ring / DEG).toFixed(1) === '20.2' && impactOf(R, ring).toFixed(2) === '14.17', `the ring ${ring / DEG}, b = ${impactOf(R, ring)}`);
	has(r`$b = 14.17\,G\matter M/c^2$ and arrives $20.2°$ from the hole`, 'the ring');
	has('| (e) the ring | the ray that turns through 180° | $20.2°$ | 11.1, here |', '(e)');
	check(ring / DEG < SKY - 2, 'the ring leaves the disc of directions');

	// (f) how dark: the depth against the glow, in energy and in counts, from 11.3's greybody factors
	const depth = (mu, p) => {
		const k = 8 * Math.PI * (GRAVITON_SKY / mu) / T;     // hbar omega / k_B T of the sky, per unit x
		const sh = (x) => {
			if (x >= X[X.length - 1]) return 1;
			if (x <= X[0]) return share[0] * (x / X[0]) ** 4;
			const i = X.findIndex((v) => v >= x), t = (x - X[i - 1]) / (X[i] - X[i - 1]);
			return share[i - 1] * (1 - t) + share[i] * t;
		};
		let num = 0, den = 0;
		for (let x = 5e-4; x < 60 / k + 3; x += 1e-3) {
			const nb = 1 / Math.expm1(k * x), nh = 1 / Math.expm1(8 * Math.PI * x);
			num += sh(x) * (nb - nh) * x ** p; den += nb * x ** p;
		}
		return num / den;
	};
	const dE = depth(MU, 3), dN = depth(MU, 2);
	check(dE.toFixed(2) === '0.93' && dN.toFixed(2) === '0.82', `the depths ${dE} ${dN}`);
	check(depth(3, 3).toFixed(2) === '0.54' && depth(2, 3).toFixed(2) === '0.29' && depth(3, 2).toFixed(2) === '0.32' && depth(2, 2).toFixed(2) === '0.14', 'the depths at three and two masses');
	check(Math.abs(depth(1, 3)) < 1e-9 && Math.abs(depth(1, 2)) < 1e-9, 'a hole in balance leaves a mark');
	has('Against 0.905 K it is 0.93, 0.54 and 0.29 at ten, three and two equilibrium masses', 'the depths in energy');
	has('counted in gravitons 82%, 32% and 14%', 'the depths in counts');
	has(r`| (f) how dark | (c)'s 0.0905 K against (a), (b)'s wavelength against (c)'s disc: depth by energy; by count | 93%; 82% | 11.3, here |`, '(f)');

	// (g) with spin: the threshold, the temperature, the gain at x = 0.92, 43.6 GHz
	const rp = 1 + Math.sqrt(1 - CHI * CHI), omegaH = CHI / (2 * rp), kappa = Math.sqrt(1 - CHI * CHI) / (2 * rp);
	check(omegaH.toFixed(3) === '0.469' && kappa.toFixed(4) === '0.0297' && (kappa / 0.25).toFixed(3) === '0.119' && (2 * omegaH).toFixed(3) === '0.939', `the spinning hole ${omegaH} ${kappa}`);
	// the exponent as the chapter's equation reads it, with the threshold and kappa rounded to 0.939 and 0.0297 (unrounded
	// it is -3.94, and n_H -1.020)
	const expo = (2 * Math.PI * (XSPIN - Number((2 * omegaH).toFixed(3)))) / Number(kappa.toFixed(4)), nH = 1 / Math.expm1(expo);
	const ghz = (XSPIN * C ** 3) / GM / (2 * Math.PI) / 1e9;
	const nbg = 1 / Math.expm1((2 * Math.PI * HBAR * ghz * 1e9) / (KB * T)), out = nbg + GAIN * (nbg - nH);
	check(expo.toFixed(1) === '-4.0' && nH.toFixed(3) === '-1.018' && ghz.toFixed(1) === '43.6' && nbg.toFixed(3) === '0.110' && (nbg - nH).toFixed(3) === '1.128' && out.toFixed(2) === '1.14' && (out / nbg).toFixed(1) === '10.3', `the mode ${expo} ${nH} ${ghz} ${nbg} ${out}`);
	has(r`There the exponent is $-4.0$ and $n_H = 1/(e^{-4.0} - 1) = -1.018$. For ten equilibrium masses $x = 0.92$ is
43.6 GHz, where the 0.905 K sky holds $n_{\rm bg} = 0.110$, so the mode returns $0.110 + 0.91\times1.128 = 1.14$,
10.3 times the sky.`, 'the bright mode');
	has(r`| (g) with spin | (a)'s sky at $\chi = 0.998$, $\ell = m = 2$, $x = 0.92$: 43.6 GHz | 10.3 times the sky | 11.2, 11.3 |`, '(g)');

	// (h) how deep: the thermometer read backwards
	const back = 2 / (1 - (1 / 1.026) ** 2);
	check(Math.round(back) === R && near(2 / (1 - (T / seen) ** 2), R, 1e-9), `the distance read back ${back}`);
	has(r`| (h) how deep | (a) read backwards: $1 - 2G\matter M/c^2r = (T_g/T_{\rm seen})^2$ | $r = 40\,G\matter M/c^2$ from 2.6% | 11.1 |`, '(h)');

	// (i) counting
	has(r`| (i) counting | (a)'s thermal sky: $g^{(2)}$ per mode; opposite directions | 2; $2 + 1/\bar n$ only if born in inflation | 8.5, R8 |`, '(i)');
	has('a thermal sky gives 2 per mode, and inflation\'s pairs $2 + 1/\\bar n$ in opposite directions', 'the coincidences');

	// the caption and the pointer, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-xi-hole}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-xi-hole}`, 'the caption');
	if (drawn) has(POINTER, 'the pointer');
	return { M, len, seen, lambda: lambda(seen), disc, rs: 2 * len, rest, fall, ring, dE, dN };
}

export default async function () {
	const N = await numbers();
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	const lbl = (src, x, y, ax, ay, color = INK) => placed(src, x, y, ax, ay, color, SIZE);
	const widthOf = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const placedBase = async (src, x, y, color = INK) => {
		const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
		const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
		return { src, svg: g, box: boxOf(g) };
	};
	const circlePts = (c, rr, n = 96) => Array.from({ length: n + 1 }, (_, i) => [c[0] + rr * Math.cos((2 * Math.PI * i) / n), c[1] + rr * Math.sin((2 * Math.PI * i) / n)]);
	const circ = (c, rr) => `M${n2(c[0] + rr)},${n2(c[1])}A${n2(rr)},${n2(rr)} 0 1,0 ${n2(c[0] - rr)},${n2(c[1])}A${n2(rr)},${n2(rr)} 0 1,0 ${n2(c[0] + rr)},${n2(c[1])}Z`;
	// the hole: 11.1's near-black disc with an ink edge
	const hole = (c, rr, what) => {
		S.raw(`<path d="${circ(c, rr)}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 3);
		S.mark(circlePts(c, rr), EDGE / 2, what);
	};
	// a circle dashed with a whole number of dashes
	const dashed = (c, rr, color, width, [dash, gap], layer, what) => {
		const len = 2 * Math.PI * rr, n = Math.round(len / (dash + gap)), f = len / (n * (dash + gap));
		S.raw(`<path d="${circ(c, rr)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${n2(dash * f)} ${n2(gap * f)}"/>`, layer);
		S.mark(circlePts(c, rr), width / 2, what);
		return n;
	};
	// the glow: a wash of the field's colour
	const glowRect = (l, t, w, h) => S.raw(`<rect x="${n2(l)}" y="${n2(t)}" width="${n2(w)}" height="${n2(h)}" fill="${FIELD}" fill-opacity="${GLOW}"/>`, 0);
	const glowDisc = (c, rr) => S.raw(`<path d="${circ(c, rr)}" fill="${FIELD}" fill-opacity="${GLOW}"/>`, 0);
	const camera = (c, what) => {
		S.raw(`<rect x="${n2(c[0] - CAMERA / 2)}" y="${n2(c[1] - CAMERA / 2)}" width="${CAMERA}" height="${CAMERA}" fill="${INK}"/>`, 4);
		S.boxes.push({ box: { l: c[0] - CAMERA / 2, r: c[0] + CAMERA / 2, t: c[1] - CAMERA / 2, b: c[1] + CAMERA / 2 }, what });
	};
	// a thermometer: its bulb's centre at b, its tube up to `top`, filled with the field's colour up to `level`
	const thermometer = (b, top, level, what) => {
		const rb = 4.2, tw = 4.4, hw = tw / 2, join = b[1] - Math.sqrt(rb * rb - hw * hw);
		const outline = `M${n2(b[0] - hw)},${n2(join)}V${n2(top + hw)}A${hw},${hw} 0 0,1 ${n2(b[0] + hw)},${n2(top + hw)}V${n2(join)}` +
			`A${rb},${rb} 0 1,1 ${n2(b[0] - hw)},${n2(join)}Z`;
		S.raw(`<path d="${outline}" fill="${PAGE}" stroke="none"/>`, 2);
		const cw = 2.2, cr = 2.9;
		S.raw(`<path d="M${n2(b[0] - cw / 2)},${n2(b[1])}V${n2(level)}H${n2(b[0] + cw / 2)}V${n2(b[1])}Z" fill="${FIELD}"/>` +
			`<path d="${circ(b, cr)}" fill="${FIELD}"/>`, 2.5);
		S.raw(`<path d="${outline}" fill="none" stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round"/>`, 3);
		// ticks beside the tube, every 6 points from just above the bulb, as many as the tube holds
		for (let k = 0, y = join - 5; y > top + hw + 3; k++, y -= 6) {
			S.path([[b[0] + hw + 0.9, y], [b[0] + hw + 3.1, y]], { color: INK, width: HAIR, cap: 'butt', layer: 3, what: `${what}'s tick ${k}` });
		}
		check(level < join - 2 && level > top + hw + 2, `${what}: the reading is off the tube`);
		S.mark([[b[0] - hw, top], [b[0] + hw, top], [b[0] + rb, b[1] + rb], [b[0] - rb, b[1] + rb], [b[0] - hw, top]], LINE / 2, what);
	};
	// a graviton: a sine of the field's colour from A to B, `waves` wavelengths, amplitude `amp`, with a head at B
	const graviton = (A0, B0, waves, amp, what, head = 3) => {
		const Lw = Math.hypot(B0[0] - A0[0], B0[1] - A0[1]), u = [(B0[0] - A0[0]) / Lw, (B0[1] - A0[1]) / Lw], w = [-u[1], u[0]];
		const run = Lw - head * 0.8;
		const pts = Array.from({ length: 121 }, (_, i) => {
			// a packet: the swing grows over the first half wavelength and dies away over the last, so that the line
			// starts and meets its head straight on
			const s = (run * i) / 120, half = run / waves / 2, fade = Math.min(1, s / half, (run - s) / half);
			const y = amp * fade * fade * Math.sin((2 * Math.PI * waves * s) / run);
			return [A0[0] + u[0] * s + w[0] * y, A0[1] + u[1] * s + w[1] * y];
		});
		S.path(pts, { color: FIELD, width: WAVE, cap: 'butt', layer: 2, what });
		const base = [B0[0] - u[0] * head, B0[1] - u[1] * head], hw = 0.36 * head;
		S.raw(`<path d="M${n2(B0[0])},${n2(B0[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${FIELD}"/>`, 2);
		S.mark([B0, base], hw, `${what}'s head`);
	};

	// ---- the panels' places: letters, the room of each drawing, the numbers under each row ---------------------------
	const W = Math.max(...ROWS.map((row) => row.length * PW + (row.length - 1) * GUT));
	const x0 = ORIGIN - W / 2;
	const panels = [];
	const LT = (await lbl('\\text{(a) the sky}', 0, 0, 0, 0)).box;
	const letterH = LT.b - LT.t;
	const DRAW = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI };
	let py = ORIGIN - 220;
	const rowsDone = [];
	for (const [row, list] of ROWS.entries()) {
		let px = x0;
		const cy = py + letterH + LETTER_AIR + DH / 2;
		const pr = [];
		for (const [key, word] of list) {
			const p = { key, word, w: PW, px, py, cy, cx: px + PW / 2, row, top: cy - DH / 2, bot: cy + DH / 2 };
			p.m0 = S.marks.length; p.b0 = S.boxes.length; p.l0 = L.length; p.numLabels = [];
			L.push(await lbl(`\\text{(${key}) ${word}}`, px, py, 0, 0));
			await DRAW[key](p);
			p.m1 = S.marks.length; p.b1 = S.boxes.length; p.l1 = L.length;
			pr.push(p); panels.push(p);
			px += PW + GUT;
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

	// ---- the arrows: along each row at the drawings' middle, and back from each row's last panel to the next's first --
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
		const yg = (rowsDone[p.row].lowest + rowsDone[q.row].top) / 2;
		const xr = p.px + p.w + OUT, xl = q.px - DROP_X;
		const legs = [[p.px + p.w + END_AIR, p.cy], [xr, p.cy], [xr, yg], [xl, yg], [xl, q.cy]];
		for (let k = 0; k + 1 < legs.length; k++) arrowAir(legs[k], legs[k + 1], `the return arrow (${p.key})'s leg ${k + 1}`);
		S.path(legs, { color: DIM, width: HAIR, cap: 'butt', what: `the return arrow from (${p.key})` });
		const last = S.arrow([xl, q.cy], [q.px - END_AIR, q.cy], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the return arrow from (${p.key})'s last leg` });
		check(last.head === HEAD, `the return arrow from (${p.key})'s last leg is too short for a whole head`);
		check(yg - rowsDone[p.row].lowest >= 6 && rowsDone[q.row].top - yg >= 6, `the return arrow from (${p.key}) runs too near the rows`);
	}

	S.checkAll(L);
	window[name] = { N, W, panels: panels.map((p) => ({ key: p.key, px: p.px, w: p.w })) };
	return finish(S, L, BOOK ? [400, 450] : [350, 372]);

	// ======================================================================================================================
	// the nine drawings, each in its panel's room (p.px to p.px + p.w, p.top to p.bot), about p.cy
	async function drawA(p) {
		const gw = 76, gh = BOOK ? 58 : 66;
		glowRect(p.cx - gw / 2, p.cy - gh / 2, gw, gh);
		thermometer([p.cx, p.cy + 20], p.cy - 24, p.cy - 4, '(a)\'s thermometer');
	}

	async function drawB(p) {
		// three of the seen sky's mean wavelengths, at the scale of (c)'s disc; crests at both ends and between
		const lam = N.lambda * 1e3 * MM, amp = 4.5, X0 = p.cx - 1.5 * lam, yc = p.cy + 6;
		const pts = Array.from({ length: 241 }, (_, i) => { const x = X0 + (3 * lam * i) / 240; return [x, yc - amp * Math.cos((2 * Math.PI * (x - X0)) / lam)]; });
		S.path(pts, { color: FIELD, width: WAVE, cap: 'butt', layer: 2, what: '(b)\'s gravitons' });
		// one wavelength, crest to crest, dimensioned above the crests
		const yd = yc - amp - 4.2, xa = X0 + lam, xb = X0 + 2 * lam;
		S.path([[xa, yd], [xb, yd]], { color: INK, width: HAIR, cap: 'butt', layer: 2, what: 'the wavelength\'s dimension' });
		for (const x of [xa, xb]) S.path([[x, yd - 2.2], [x, yd + 2.2]], { color: INK, width: HAIR, cap: 'butt', layer: 2, what: 'the wavelength\'s ends' });
		check(near(xb - xa, N.lambda * 1e3 * MM, 1e-9) && near((N.disc * 1e3 * MM) / (xb - xa), N.disc / N.lambda, 1e-9), '(b): the wavelength is not to (c)\'s scale');
		L.push(await lbl('\\lambda', (xa + xb) / 2, yd - 2.2 - LABEL_GAP - 0.2, 0.5, 1));
	}

	async function drawC(p) {
		const c = [p.cx, p.cy], rc = (N.disc / 2) * 1e3 * MM, rh = N.rs * 1e3 * MM;
		S.raw(`<path d="${circ(c, rc)}" fill="${FILL}" stroke="${DIM}" stroke-width="${HAIR}"/>`, 1);
		S.mark(circlePts(c, rc), HAIR / 2, 'the capture disc');
		hole(c, rh, '(c)\'s hole');
		check(near(rc / rh, Math.sqrt(27) / 2, 1e-9), '(c): the disc and the horizon are not to scale');
		// the two circles named: the capture disc over it, the horizon under it with a leader up through the disc
		L.push(await lbl('\\text{capture disc}', c[0], c[1] - rc - HAIR / 2 - LABEL_GAP - 0.3, 0.5, 1));
		const hz = await lbl('\\text{horizon}', c[0], c[1] + rc + HAIR / 2 + LABEL_GAP + 0.3, 0.5, 0);
		L.push(hz);
		S.path([[c[0], hz.box.t - LABEL_GAP - 0.2], [c[0], c[1] + rh + EDGE / 2 + 0.8]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the horizon\'s leader' });
	}

	async function skyDisc(p, what) {
		const c = [p.cx, p.cy];
		glowDisc(c, SKY * DEG_PT);
		S.mark(circlePts(c, SKY * DEG_PT), 0, `${what}'s sky`);
		hole(c, (N.rest / DEG) * DEG_PT, `${what}'s shadow`);
		return c;
	}

	async function drawD(p) {
		const c = await skyDisc(p, '(d)');
		const n = dashed(c, (N.fall / DEG) * DEG_PT, PALE, 0.5, [1.3, 1.0], 4, 'the falling shadow');
		check(n >= 12, '(d): too few dashes on the falling shadow');
		check((N.rest - N.fall) / DEG * DEG_PT - EDGE / 2 - 0.25 >= 1.2, '(d): the falling shadow touches the shadow\'s edge');
	}

	async function drawE(p) {
		const c = await skyDisc(p, '(e)');
		dashed(c, (N.ring / DEG) * DEG_PT, LIGHT, 0.6, [2.2, 1.6], 2, 'the Einstein ring');
	}

	async function drawF(p) {
		const gw = 74, gh = BOOK ? 56 : 58, rr = 13, dx = 18, up = 5;
		glowRect(p.cx - gw / 2, p.cy - gh / 2, gw, gh);
		for (const [s, d, w] of [[-1, N.dE, 'energy'], [1, N.dN, 'count']]) {
			const c = [p.cx + s * dx, p.cy - up];
			S.raw(`<path d="${circ(c, rr)}" fill="${HOLE}" fill-opacity="${d.toFixed(2)}"/>`, 2);
			S.mark(circlePts(c, rr), 0, `the disc weighed in ${w}`);
			// each disc named under it, on the glow
			const nm = await placedBase(`\\text{${w}}`, c[0], c[1] + rr + LABEL_GAP + 7.2);
			check(nm.box.b <= p.cy + gh / 2 - 2, `(f): the name ${w} leaves the glow`);
			L.push(nm);
		}
		check(2 * dx - 2 * rr >= 8 && gw / 2 - dx - rr >= 6, '(f): the discs crowd');
	}

	async function drawG(p) {
		const c = [p.cx, p.cy];
		hole(c, 6.5, '(g)\'s hole');
		// the hole turns anticlockwise; the mode l = m = 2 turns with it, two crests half a turn apart
		const spin = turning(c[0], c[1], 11.5, -55 * DEG, 55 * DEG, INK, { width: LINE, head: 3.4 });
		S.raw(spin.svg, 4);
		S.mark(spin.pts, LINE / 2, 'the hole\'s turning');
		S.mark(spin.head, 0, 'the hole\'s turning\'s head');
		S.arrows.push({ L: spin.len, head: spin.hd, what: 'the hole\'s turning' });
		for (const a of [35, 215]) {
			const t = turning(c[0], c[1], 22, a * DEG, (a + 95) * DEG, FIELD, { width: WAVE + 0.15, head: 3.8 });
			S.raw(t.svg, 4);
			S.mark(t.pts, (WAVE + 0.15) / 2, `the mode's turning at ${a}`);
			S.mark(t.head, 0, `the mode's turning at ${a}'s head`);
			S.arrows.push({ L: t.len, head: t.hd, what: `the mode's turning at ${a}` });
		}
	}

	async function drawH(p) {
		const yc = p.cy + 12, hc = [p.px + 16, yc], cam = [p.px + p.w - 18, yc];
		hole(hc, 5, '(h)\'s hole');
		camera(cam, '(h)\'s camera');
		thermometer([cam[0], yc - 13.5], p.top + 2, yc - 30, '(h)\'s thermometer');
		// r, from the hole's centre to the camera
		const yd = yc + 10;
		S.path([[hc[0], yd], [cam[0], yd]], { color: INK, width: HAIR, cap: 'butt', layer: 2, what: 'r\'s dimension' });
		for (const x of [hc[0], cam[0]]) S.path([[x, yd - 2.2], [x, yd + 2.2]], { color: INK, width: HAIR, cap: 'butt', layer: 2, what: 'r\'s ends' });
		L.push(await lbl('r', (hc[0] + cam[0]) / 2, yd - 0.4 - LABEL_GAP, 0.5, 1));
	}

	async function drawI(p) {
		const side = CAMERA, gap = 1.2;
		const left = [p.cx - gap / 2 - side / 2, p.cy], right = [p.cx + gap / 2 + side / 2, p.cy];
		for (const [q, w] of [[left, 'left'], [right, 'right']]) {
			S.raw(`<rect x="${n2(q[0] - side / 2)}" y="${n2(q[1] - side / 2)}" width="${side}" height="${side}" fill="${INK}"/>`, 3);
			S.boxes.push({ box: { l: q[0] - side / 2, r: q[0] + side / 2, t: q[1] - side / 2, b: q[1] + side / 2 }, what: `the ${w} pixel` });
		}
		const reach = 40;
		graviton([p.cx - reach, p.cy], [left[0] - side / 2 - 1.4, p.cy], 2.5, 2.2, 'the graviton from the left');
		graviton([p.cx + reach, p.cy], [right[0] + side / 2 + 1.4, p.cy], 2.5, 2.2, 'the graviton from the right');
	}
}

// ---- the numbers under the panels: exactly the table's (asserted in numbers()) --------------------------------------
const NUMS_SITE = {
	a: ['0.905\\ \\mathrm{K};', '0.929\\ \\mathrm{K}\\text{ seen}'],
	b: ['3.87\\times10^{14}\\text{ gravitons}', '\\text{per s, m}^2\\text{, sr;}', '\\lambda = 5.74\\ \\mathrm{mm}'],
	c: ['T_H = 0.0905\\ \\mathrm{K};', '\\text{disc }1.05\\ \\mathrm{cm}\\text{ across}'],
	d: ['7.27^\\circ;', '5.80^\\circ\\text{ falling}'],
	e: ['20.2^\\circ'],
	f: ['93\\%\\text{ by energy;}', '82\\%\\text{ by count}'],
	g: ['10.3\\text{ times the sky}', '\\text{at }43.6\\ \\mathrm{GHz}'],
	h: ['r = 40\\,GM/c^2\\text{, read}', '\\text{from the sky}', '\\text{seen }2.6\\%\\text{ warmer}'],
	i: ['g^{(2)} = 2\\text{ if thermal;}', '2 + 1/\\bar n\\text{ only if}', '\\text{born in inflation}']
};
// the book's wider panels: the same words in fewer lines
const NUMS = !BOOK ? NUMS_SITE : {
	...NUMS_SITE,
	b: ['3.87\\times10^{14}\\text{ gravitons}', '\\text{per s, m}^2\\text{, sr; }\\lambda = 5.74\\ \\mathrm{mm}'],
	d: ['7.27^\\circ\\text{; }5.80^\\circ\\text{ falling}'],
	f: ['93\\%\\text{ by energy; }82\\%\\text{ by count}'],
	h: ['r = 40\\,GM/c^2\\text{, read from}', '\\text{the sky seen }2.6\\%\\text{ warmer}'],
	i: ['g^{(2)} = 2\\text{ if thermal; }2 + 1/\\bar n', '\\text{only if born in inflation}']
};
