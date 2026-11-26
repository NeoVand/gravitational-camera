// The tutorial, reading section R9b (tutorial/one-point/reading-section-viii-2.md), its second diagram: the capstone's
// desk, seen from above. A desk, a rounded rectangle in the page's neutral tint; at its centre the pixel, a ring, with
// its six neighbours b = 10 cm away: four as dots in the page, and the pair along the vertical, out of and into the
// page, as the dot in the pixel's ring; a bracket "b = 10 cm". To the left, 3 m away on a thin dimension line along
// the line of sight ("3 m" under it), the person, the stone figure of Part 1 (sprites/tut-person.png, as
// figs/tut-sql-pixel.js draws it), "70 kg" over its head, with a short arrow in matter's colour above the line for a
// walk of 1.4 m/s across the line of sight, "1.4 m/s" over the arrow. To the upper right, 3 m away on a second
// dimension line ("3 m" on its lower right, outside the desk), the rotor in matter's colour: its circle, the bar and
// its two masses, and a curved arrow for its turn, "2 x 1 kg, 12 cm, 50 turns/s" over it. Above the desk, the passing
// wave in the curvature's colour: three parallel fronts and an arrow along its travel, "100 Hz, h = 10^-21, rho = 12"
// to the left of the fronts. Beside the pixel a short arrow in ink, the pixel's own velocity on a cart, across the
// line to the person. The readings the capstone gives stand apart from the scene, in order, each step led once by its
// letter in a small circle (a second line of a step is indented under the first): (a) the person's rho; (b) the
// pixel's velocity on a cart; (c) the range and mass with the neighbours, and alone; (d) two people on one line; (e)
// the rotor against the wave; (f) the amplitude's error, 12% with the rotor fitted, not 8.3%; (g) the direction's,
// 6.8 degrees, not 4.8; (h) what tells the person from two standing waves. On the site they stand under the scene in
// two columns, (a) to (d) at the left and (e) to (h) at the right; in the printed book (figureLayout 'book') in one
// column at the scene's right, its middle level with the scene's, so that the figure is wide and low on the page. Ink
// and greys, matter's colour and the curvature's; no orange or blue.
// Departures from the diagram's comment, where the chapter's text decides: the rotor stands to the upper right and the
// wave comes from the upper right, not the rotor to the lower right, because the capstone's step (e) fixes both: the
// rotor turns in the plane of the page with the pixel in it at 30 degrees from x, and the wave comes from
// (-0.45, -0.35, 0.82); with x to the left along the line to the person (step (h)), y down the page and z out of it,
// the rotor lies 30 degrees above the line to the right and the wave comes from 37.9 degrees above it on the same side,
// and from above the desk. The person's numbers print rho = 4.24 x 10^6, as the text does; steps (d) and (h) have
// their own lines, since every step gives a number; the readings are gathered in columns rather than set beside their
// objects, where they crowded the scene; the cart's arrow is in ink, since Part 9's figures use no observer's colour;
// the caption gives the capstone's numbers and does not name the letters.
// Exact: every number, recomputed here from G, c, the masses, distances and noise of the capstone and asserted against
// its text; the rotor's 99 and 35.5 from the two masses' Newtonian tides at 100 Hz (Fourier component over a turn) and
// the wave's transverse traceless part for the stated direction, which also fixes the side of x on which the rotor
// stands (+30 degrees gives 35.5, -30 gives 41.4); the directions on the page of the person, the rotor and the wave's
// travel, in the frame above. Schematic: every distance and size (3 m and 10 cm are not to one scale), the wave's
// place (a plane wave has none), the rotor's phase and sense of turning, the arrows' lengths. Pictorial: the person.
import { tex, INK, DIM, FAINT, sprite } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, near, n2, HAIR, TICK, LABEL_GAP, SIZE } from './tut-pot-lib.js';
import { CURV, palette } from './tut-metric-lib.js';
import { MATTER } from './tut-lorentz-lib.js';

const name = 'tut-read-viii-2-desk';
const check = checker(name);

// ---- the capstone, SI ------------------------------------------------------------------------------------------------
const G = 6.674e-11, C = 2.998e8;
const M = 70, R = 3, B = 0.1, SIGMA = 1e-16, WALK = 1.4;          // the person, its distance, the neighbours, noise, walk
const R2 = [3.0, 3.5];                                              // two people on one line
const ROTOR = { m: 1, d: 0.12, f: 50, r: 3, at: 30 };               // two masses, apart, turns/s, distance, degrees from x
const WAVE = { f: 100, h: 1e-21, rho: 12, from: [-0.45, -0.35, 0.82] };

/** The capstone's numbers. */
function numbers() {
	const w = (G * M) / R ** 3;
	const E = Math.sqrt(6) * w, rho = E / SIGMA;
	const cart = (C * SIGMA) / (Math.SQRT2 * 3 * w);
	const rhoE = Math.sqrt(7) * rho, rhoG = Math.sqrt(30) * rho * (B / R);
	const sr = Math.sqrt(1 / rhoE ** 2 + 1 / rhoG ** 2), sM = Math.sqrt(16 / rhoE ** 2 + 9 / rhoG ** 2);
	const rhoB = ((Math.sqrt(3) * WALK) / C) * rho;
	const reff = R2.reduce((s, r) => s + r ** -3, 0) / R2.reduce((s, r) => s + r ** -4, 0);
	const mid = (R2[0] + R2[1]) / 2, dl = R2[1] - R2[0];
	const rhoPair = (Math.sqrt(6) * G * M * R2.reduce((s, r) => s + r ** -3, 0)) / SIGMA;
	const apart = (0.7 * (mid ** 2 / B)) / Math.sqrt(rhoPair);
	const om = 2 * Math.PI * WAVE.f;
	const waveSize = Math.SQRT2 * 0.5 * om ** 2 * WAVE.h;
	return { w, E, rho, cart, rhoE, rhoG, sr, sM, rhoB, reff, mid, approx: mid - dl ** 2 / mid, rhoPair, apart, waveSize,
		amp: [Math.SQRT2 / WAVE.rho, 1 / WAVE.rho], dir: [(1 / WAVE.rho) * (180 / Math.PI), (Math.SQRT2 / WAVE.rho) * (180 / Math.PI)],
		across: (3 * B) / R, waves: (2 * Math.PI * B * WAVE.f) / C, steady: E / waveSize };
}

/** The rotor's tide at 100 Hz at the pixel (rotor at the origin, the pixel at `deg` from x in its plane): its size
 * against the wave's, and half its wave-shaped part (transverse and traceless to the wave's direction) against it. */
function rotor(deg, waveSize) {
	const { m, d, f, r } = ROTOR, a = d / 2, w2 = 2 * Math.PI * 2 * f;
	const p = [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180), 0];
	const N = 2000, T = 1 / f;
	const Re = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Im = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (let k = 0; k < N; k++) {
		const t = (k * T) / N;
		for (const s of [1, -1]) {
			const q = [s * a * Math.cos(2 * Math.PI * f * t), s * a * Math.sin(2 * Math.PI * f * t), 0];
			const x = p.map((v, i) => v - q[i]), rr = Math.hypot(...x);
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
				const e = (G * m * ((i === j ? rr * rr : 0) - 3 * x[i] * x[j])) / rr ** 5;
				Re[i][j] += ((2 / N) * e) * Math.cos(w2 * t);
				Im[i][j] += ((2 / N) * e) * Math.sin(w2 * t);
			}
		}
	}
	const fro = (A) => Math.sqrt(A.flat().reduce((s, v) => s + v * v, 0));
	const n0 = Math.hypot(...WAVE.from), k = WAVE.from.map((v) => v / n0);
	const P = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) - k[i] * k[j]));
	const mul = (A, Bm) => A.map((row, i) => [0, 1, 2].map((j) => row.reduce((s, _, l) => s + A[i][l] * Bm[l][j], 0)));
	const tt = (A) => { const Q = mul(mul(P, A), P), tr = Q[0][0] + Q[1][1] + Q[2][2]; return Q.map((row, i) => row.map((v, j) => v - 0.5 * P[i][j] * tr)); };
	const size = Math.hypot(fro(Re), fro(Im));
	return { ratio: size / waveSize, ignored: Math.hypot(fro(tt(Re)), fro(tt(Im))) / 2 / waveSize };
}

// ---- the chapter's text -----------------------------------------------------------------------------------------------
const CAPTION = 'Look first at the two objects 3 m from the pixel. With its six neighbours the pixel weighs the person to a quarter of a gram and finds the distance to 3.9 µm; alone it cannot find the distance at all. It reads the wave beneath a rotor 99 times stronger at a price of $\\sqrt2$: the amplitude to 12% instead of 8.3%, and the direction to 6.8° instead of 4.8°. Distances not to scale.';

async function chapter(n) {
	await palette(check);
	const md = await (await fetch('/tutorial/one-point/reading-section-viii-2.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	has('A pixel on a desk has six neighbours 10 cm away. A person of 70 kg stands 3 m away, a rotor turns 3 m away with the pixel in its plane, and a wave at 100 Hz of strain $10^{-21}$ passes', 'the scene');
	has('$\\sigma_n = 10^{-16}\\unit{s^{-2}}$ on each coefficient', 'the noise');
	has('whole reading has $\\rho = |\\curv{\\mathcal W}|/\\sigma_n = 12$', 'the wave\'s rho');
	has('two 1 kg masses 12 cm apart turning fifty times a second', 'the rotor');
	// (a)
	check(n.w.toExponential(2) === '1.73e-10' && n.E.toExponential(2) === '4.24e-10' && n.rho.toExponential(2) === '4.24e+6', `(a) ${n.w} ${n.E} ${n.rho}`);
	has('gives $\\rho = 4.24\\times10^6$', '(a)');
	// (b)
	check(Math.round(n.cart) === 41, `(b) ${n.cart}`);
	has('41\\unit{m\\,s^{-1}}$, and the one along it not at all', '(b)');
	// (c)
	check(n.rhoE.toExponential(2) === '1.12e+7' && n.rhoG.toExponential(2) === '7.74e+5', `(c) rho_E ${n.rhoE}, rho_G ${n.rhoG}`);
	check((n.sr * R * 1e6).toFixed(1) === '3.9' && (n.sM * M * 1e3).toFixed(2) === '0.27' && n.rhoB.toFixed(3) === '0.034' && Math.round(1 / n.rhoB) === 29, `(c) ${n.sr * R} ${n.sM * M} ${n.rhoB}`);
	has('$\\rho_E = 1.12\\times10^7$ and $\\rho_G = 7.74\\times10^5$', '(c)');
	has('which is 3.9 µm, and $\\sigma_M/\\matter M = 3.9\\times10^{-6}$, 0.27 g', '(c)');
	has('walking past at $1.4\\unit{m\\,s^{-1}}$, $\\rho_B = 0.034$', '(c)');
	has('$\\sigma_r/r = 29$: no range at all', '(c)');
	// (d)
	check(n.reff.toFixed(3) === '3.175' && n.approx.toFixed(3) === '3.173' && n.rhoPair.toExponential(1) === '6.9e+6' && (n.apart * 100).toFixed(1) === '2.8', `(d) ${n.reff} ${n.approx} ${n.rhoPair} ${n.apart}`);
	has('At 3.0 m and 3.5 m they read as one body at $r_{\\rm eff} = 3.175$ m', '(d)');
	has('$0.7(r^2/b)/\\rho^{1/2} = 2.8$ cm, against their 50 cm', '(d)');
	// (e)
	check(n.waveSize.toExponential(2) === '2.79e-16' && Math.round(n.steady / 1e5) / 10 === 1.5, `(e) ${n.waveSize} ${n.steady}`);
	has('The rotor\'s changes at 100 Hz, at 99 times the wave\'s', '(e)');
	has('a wave 35 times the true one for a wave from $(-0.45, -0.35, 0.82)$, with the rotor turning in the $xy$ plane and the pixel in it at 30° from $\\hat x$', '(e)');
	// (f), (g)
	check((n.amp[0] * 100).toFixed(1) === '11.8' && Math.round(n.amp[0] * 100) === 12 && (n.amp[1] * 100).toFixed(1) === '8.3', `(f) ${n.amp}`);
	check(n.dir[0].toFixed(1) === '4.8' && n.dir[1].toFixed(1) === '6.8', `(g) ${n.dir}`);
	has('$\\sqrt2/\\rho = 11.8$ per cent instead of $1/\\rho = 8.3$ per cent', '(f)');
	has('$1/\\rho = 0.083$ rad, 4.8°; fitting the rotor costs the same $\\sqrt2$, 6.8°', '(g)');
	// (h)
	check(n.across.toFixed(2) === '0.10' && n.waves.toExponential(0) === '2e-7', `(h) ${n.across} ${n.waves}`);
	has('With the line to the person along $\\hat x$', '(h)');
	has('$3b/r = 10$ per cent, read at $\\rho_G = 7.7\\times10^5$, and the waves\' by $2\\pi bf/c = 2\\times10^{-7}$', '(h)');
	for (const l of 'abcdefgh') has(`**(${l}) `, `step (${l})`);
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-viii-2-desk}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) has(`![${CAPTION}](${name}){#fig:read-viii-2-desk}`, 'the caption');
	return drawn;
}

// ---- the drawing (points, y down, the pixel at the origin) ----------------------------------------------------------
const D = 116;                     // 3 m on the page (schematic)
const DESK = { w: 122, h: 56, r: 5 };
const NB = 17;                     // the neighbours' distance on the page
const RING = 3.1, RING_W = 0.6, CORE = 0.85, NB_R = 1.5;
const STATURE = 70;                // the person's height on the page (schematic)
const RES = 600;                   // the person's picture, pixels tall
const ROTOR_R = 12, MASS_R = 2.1, BAR = 0.8, TURN_R = 16, TURN_SPAN = 64, TURN_FROM = -34, PHASE = 118;
const FRONT = 24, FRONT_GAP = 6, FRONT_W = 0.6, WAVE_AT = [22, -66], WAVE_ARROW = 15;
const ARROW_W = 0.6, ARROW_HEAD = 3.4;
const SMALL = 7;                   // the circled letters
const DISC = 3.5;                  // their circles' radius
const DISC_GAP = 2.4;              // from a circle to its line
const LEAD = 10.6;                 // between the baselines of a reading's lines
const STEP_GAP = 2.6;              // and more between two readings
const DESK_EDGE = 0.45;
const WALK_FROM = 4, WALK_LEN = 18;   // the walk's arrow, from above the line of sight, up
const BOOK = globalThis.figureLayout === 'book';
const COLUMN_GAP = 16;             // the book's column of readings, from the scene
const ROWS_GAP = 13;               // the site's columns of readings, under the scene

export default async function () {
	const n = numbers();
	const drawn = await chapter(n);
	// the rotor: its 99, and the 35.5 that fixes the side of x on which it stands
	const plus = rotor(ROTOR.at, n.waveSize), minus = rotor(-ROTOR.at, n.waveSize);
	check(Math.round(plus.ratio) === 99 && plus.ignored.toFixed(1) === '35.5' && minus.ignored.toFixed(1) === '41.4' && Math.round(plus.ratio / 2) === 49, `the rotor: ${plus.ratio}, ${plus.ignored}, ${minus.ignored}`);

	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN, ORIGIN];
	// the frame on the page: x to the left (along the line to the person), y down, z out of the page (right-handed)
	const page = ([x, y]) => [-x, y];
	check(near(page([1, 0])[0] * page([0, 1])[1] - page([1, 0])[1] * page([0, 1])[0], -1, 1e-12), 'the frame is not right-handed with z out of the page');
	const at = (v, s = 1) => [O[0] + v[0] * s, O[1] + v[1] * s];
	const rad = (deg) => (deg * Math.PI) / 180;
	const personDir = page([1, 0]);                                                       // the person along +x
	const rotorDir = page([-Math.cos(rad(ROTOR.at)), -Math.sin(rad(ROTOR.at))]);          // the pixel at +30 deg from x, seen from the rotor
	const fromN = Math.hypot(WAVE.from[0], WAVE.from[1]);
	const travel = page([-WAVE.from[0] / fromN, -WAVE.from[1] / fromN]);                  // the wave's travel, projected
	check(rotorDir[0] > 0 && rotorDir[1] < 0 && travel[0] < 0 && travel[1] > 0, 'the rotor is not to the upper right, or the wave does not come from it');

	// ---- the desk
	const dk = { l: O[0] - DESK.w / 2, r: O[0] + DESK.w / 2, t: O[1] - DESK.h / 2, b: O[1] + DESK.h / 2 };
	const rr = DESK.r;
	const deskPath = `M${n2(dk.l + rr)},${n2(dk.t)}H${n2(dk.r - rr)}A${rr},${rr} 0 0 1 ${n2(dk.r)},${n2(dk.t + rr)}V${n2(dk.b - rr)}A${rr},${rr} 0 0 1 ${n2(dk.r - rr)},${n2(dk.b)}H${n2(dk.l + rr)}A${rr},${rr} 0 0 1 ${n2(dk.l)},${n2(dk.b - rr)}V${n2(dk.t + rr)}A${rr},${rr} 0 0 1 ${n2(dk.l + rr)},${n2(dk.t)}Z`;
	S.raw(`<path d="${deskPath}" fill="#eeebe5" stroke="${FAINT}" stroke-width="${DESK_EDGE}"/>`, 0);
	S.mark([[dk.l, dk.t], [dk.r, dk.t], [dk.r, dk.b], [dk.l, dk.b], [dk.l, dk.t]], DESK_EDGE / 2, 'the desk');

	// ---- the pixel and its neighbours: a ring with the pair along z as its dot, four dots in the page
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${RING}" fill="none" stroke="${INK}" stroke-width="${RING_W}"/><circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${CORE}" fill="${INK}"/>`, 3);
	S.mark([O], RING + RING_W / 2, 'the pixel');
	const nbs = [[1, 0], [-1, 0], [0, 1], [0, -1]].map((u) => at(u, NB));
	for (const [k, q] of nbs.entries()) {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${NB_R}" fill="${INK}"/>`, 3);
		S.mark([q], NB_R, `neighbour ${k}`);
	}
	// the bracket b under the right-hand neighbour's segment, its words to the right
	{
		const y = O[1] + 5.2, hook = 2.2, a = O[0] + 0.6, b = O[0] + NB - 0.6;
		S.path([[a, y - hook], [a, y], [b, y], [b, y - hook]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket b' });
		L.push(await placed('b = 10\\ \\mathrm{cm}', b + 2.6, y + HAIR / 2 + LABEL_GAP + 0.2, 0, 0, INK));
	}
	// the pixel's own velocity on a cart: across the line to the person, beside the ring
	{
		const x = O[0] - 7.2;
		S.arrow([x, O[1] + 9.5], [x, O[1] - 9.5], { color: INK, width: ARROW_W, head: ARROW_HEAD, layer: 4, what: 'the cart\'s arrow' });
	}

	// ---- the person, 3 m along +x, facing the pixel
	const P = at(personDir, D);
	const person = await sprite('/figures3d/sprites/tut-person.png');
	const ink = await inkOf(person);
	const px = STATURE / (ink.b - ink.t);
	const small = await resample(person, RES);
	const sole = P[1] + STATURE / 2;
	const left = P[0] - ((ink.l + ink.r) / 2) * px, top = sole - ink.b * px;
	S.raw(`<image class="art" href="${small}" x="${n2(left)}" y="${n2(top)}" width="${n2(person.w * px)}" height="${n2(person.h * px)}" preserveAspectRatio="none"/>`, 3);
	const body = { l: left + ink.l * px, r: left + ink.r * px, t: sole - STATURE, b: sole };
	S.boxes.push({ box: body, what: 'the person' });
	// the walk: across the line of sight, in front of the person and above the line, its speed over its head
	const walkX = body.r + 5;
	const walk = S.arrow([walkX, P[1] - WALK_FROM], [walkX, P[1] - WALK_FROM - WALK_LEN], { color: MATTER, width: ARROW_W, head: ARROW_HEAD, layer: 4, what: 'the walk' });
	L.push(await placed('1.4\\ \\mathrm{m/s}', walkX - 1.5, walk.B[1] - LABEL_GAP - 0.6, 0, 1, INK));
	// the dimension along the line of sight, from the person's front to the left neighbour, "3 m" under it
	{
		const y = O[1], a = walkX + 4.5, b = nbs[1][0] - NB_R - 1.6;
		S.path([[a, y], [b, y]], { color: DIM, width: HAIR, cap: 'butt', what: 'the person\'s dimension' });
		S.path([[a, y - TICK], [a, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'a tick of the person\'s dimension' });
		L.push(await placed('3\\ \\mathrm m', (a + dk.l) / 2, y + HAIR / 2 + LABEL_GAP + 0.4, 0.5, 0, INK));
	}
	L.push(await placed('70\\ \\mathrm{kg}', P[0], body.t - LABEL_GAP - 0.6, 0.5, 1, INK));

	// ---- the rotor, 3 m away, the pixel in its plane at 30 degrees from x
	const Rc = at(rotorDir, D);
	S.raw(`<circle cx="${n2(Rc[0])}" cy="${n2(Rc[1])}" r="${ROTOR_R}" fill="none" stroke="${MATTER}" stroke-width="${HAIR}"/>`, 2);
	S.mark([Rc], ROTOR_R + HAIR / 2, 'the rotor\'s circle');
	{
		const u = [Math.cos(rad(PHASE)), -Math.sin(rad(PHASE))];
		const e1 = [Rc[0] + u[0] * ROTOR_R, Rc[1] + u[1] * ROTOR_R], e2 = [Rc[0] - u[0] * ROTOR_R, Rc[1] - u[1] * ROTOR_R];
		S.path([e1, e2], { color: MATTER, width: BAR, cap: 'butt', layer: 2, what: 'the rotor\'s bar' });
		for (const e of [e1, e2]) { S.raw(`<circle cx="${n2(e[0])}" cy="${n2(e[1])}" r="${MASS_R}" fill="${MATTER}"/>`, 3); S.mark([e], MASS_R, 'a rotor mass'); }
		// the turn: an arc outside the circle, counter-clockwise on the page, ending in a head
		const a0 = TURN_FROM, a1 = a0 + TURN_SPAN, head = 3.2, pts = [];
		const onArc = (deg) => [Rc[0] + TURN_R * Math.cos(rad(deg)), Rc[1] - TURN_R * Math.sin(rad(deg))];
		// the head: its tip at the arc's end, along the arc's tangent there (counter-clockwise on the page)
		const tip = onArc(a1), tan = [-Math.sin(rad(a1)), -Math.cos(rad(a1))], nrm = [-tan[1], tan[0]];
		const base = [tip[0] - tan[0] * head, tip[1] - tan[1] * head], hw = 0.36 * head;
		// the arc stops where it comes nearest the head's base (it bends away from the tangent by head^2 / 2R)
		let stop = a1;
		for (let d = a1; d > a1 - 30; d -= 0.01) if (Math.hypot(onArc(d)[0] - base[0], onArc(d)[1] - base[1]) < Math.hypot(onArc(stop)[0] - base[0], onArc(stop)[1] - base[1])) stop = d;
		for (let k = 0; k <= 48; k++) pts.push(onArc(a0 + ((stop - a0) * k) / 48));
		S.path(pts, { color: MATTER, width: HAIR, cap: 'butt', layer: 2, what: 'the rotor\'s turn' });
		const tri = [tip, [base[0] + nrm[0] * hw, base[1] + nrm[1] * hw], [base[0] - nrm[0] * hw, base[1] - nrm[1] * hw]];
		S.raw(`<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${MATTER}"/>`, 2);
		S.mark([...tri, tip], 0, 'the rotor\'s turn\'s head');
		check(Math.hypot(...[0, 1].map((i) => onArc(stop)[i] - base[i])) < 0.35, 'the turn does not meet its head');
	}
	// the rotor's dimension, along the line of sight from the pixel's ring to the circle
	{
		const a = at(rotorDir, NB + 4), b = at(rotorDir, D - ROTOR_R - 2);
		S.path([a, b], { color: DIM, width: HAIR, cap: 'butt', what: 'the rotor\'s dimension' });
		const nrm = [rotorDir[1], -rotorDir[0]];                       // across the line, toward the upper left
		const tick = (q) => S.path([[q[0] - nrm[0] * TICK, q[1] - nrm[1] * TICK], [q[0] + nrm[0] * TICK, q[1] + nrm[1] * TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'a tick of the rotor\'s dimension' });
		tick(b);
		// "3 m" on the lower right of the line, at the middle of its part outside the desk, as the person's is under its line
		const out = (O[1] - dk.t) / -rotorDir[1];                       // where the line leaves the desk, through its top
		check(at(rotorDir, out)[0] < dk.r, 'the rotor\'s line does not leave the desk through its top');
		const m = at(rotorDir, (out + D - ROTOR_R - 2) / 2), side = [-nrm[0], -nrm[1]];
		L.push(await S.clear('3\\ \\mathrm m', m[0] + side[0] * (HAIR / 2 + LABEL_GAP), m[1] + side[1] * (HAIR / 2 + LABEL_GAP), 0, 0, side, { color: INK }));
	}

	// ---- the wave: three fronts across its travel, an arrow along it
	const Wc = [O[0] + WAVE_AT[0], O[1] + WAVE_AT[1]];
	const along = [-travel[1], travel[0]];
	for (let k = -1; k <= 1; k++) {
		const c0 = [Wc[0] + travel[0] * k * FRONT_GAP, Wc[1] + travel[1] * k * FRONT_GAP];
		S.path([[c0[0] - along[0] * FRONT / 2, c0[1] - along[1] * FRONT / 2], [c0[0] + along[0] * FRONT / 2, c0[1] + along[1] * FRONT / 2]], { color: CURV, width: FRONT_W, cap: 'round', layer: 2, what: `the wave's front ${k}` });
	}
	{
		const s0 = FRONT_GAP + 2.2, s1 = s0 + WAVE_ARROW;
		S.arrow([Wc[0] + travel[0] * s0, Wc[1] + travel[1] * s0], [Wc[0] + travel[0] * s1, Wc[1] + travel[1] * s1], { color: CURV, width: ARROW_W, head: ARROW_HEAD + 0.4, layer: 3, what: 'the wave\'s arrow' });
	}

	// ---- the numbers: the givens beside their objects, the readings in columns, each led by its step's circled letter --
	const sci = (v, d) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(d)}\\times10^{${e}}`; };
	// the givens, beside their objects: the rotor's over it, the wave's to the left of its fronts
	const rLab = await placed(`2\\times1\\ \\mathrm{kg},\\ 12\\ \\mathrm{cm},\\ 50\\ \\text{turns/s}`, Rc[0], Rc[1] - TURN_R - LABEL_GAP - 1.5, 0.5, 1, INK);
	L.push(rLab);
	const wLab = await S.clear(`100\\ \\mathrm{Hz},\\ h = 10^{-21},\\ \\rho = ${WAVE.rho}`, Wc[0] - FRONT / 2, Wc[1] - FRONT_GAP, 1, 0.5, [-1, 0]);
	L.push(wLab);
	// the readings, step by step, each led by its letter: one column at the right in the book, two under the scene on
	// the site (a to d, the person and the desk; e to h, the wave)
	const steps = [
		['a', [`\\text{the person: }\\rho = ${sci(n.rho, 2)}`]],
		['b', [`\\text{on a cart: }${Math.round(n.cart)}\\ \\mathrm{m/s}\\text{ across,}`, '\\text{nothing along}']],
		['c', [`\\sigma_r = ${(n.sr * R * 1e6).toFixed(1)}\\,\\mu\\mathrm{m},\\ \\sigma_M = ${(n.sM * M * 1e3).toFixed(2)}\\ \\mathrm g\\text{;}`, `\\text{alone: }\\rho_B = ${n.rhoB.toFixed(3)}\\text{, no range}`]],
		['d', ['\\text{two in line: told apart}', `\\text{beyond ${(n.apart * 100).toFixed(1)} cm}`]],
		['e', [`\\text{the rotor: }${Math.round(plus.ratio)}{\\times}\\text{ the wave}`]],
		['f', [`\\text{amplitude: }${Math.round(n.amp[0] * 100)}\\%\\text{, not }${(n.amp[1] * 100).toFixed(1)}\\%`]],
		['g', [`\\text{direction: }${n.dir[1].toFixed(1)}^\\circ\\text{, not }${n.dir[0].toFixed(1)}^\\circ`]],
		['h', [`\\text{across }b\\text{: person ${Math.round(n.across * 100)}\\%,}`, `\\text{waves }${n.waves.toExponential(0).replace(/e-(\d+)/, '\\times10^{-$1}')}`]]
	];
	check(steps.map(([l]) => l).join('') === 'abcdefgh', 'the steps are not a to h, each once');
	const column = async (list, x, y0) => {
		const out = [];
		let y = y0;
		for (const [step, lines] of list) {
			for (const [i, src] of lines.entries()) { out.push(await stepLine(S, i ? null : step, src, x, y)); y += LEAD; }
			y += STEP_GAP;
		}
		for (let i = 1; i < out.length; i++) check(out[i].box.t - out[i - 1].box.b >= 0.3, `the lines ${out[i - 1].src} and ${out[i].src} touch`);
		// a column is one label
		return { src: out.map((g) => g.src).join(' / '), svg: out.map((g) => g.svg).join(''),
			box: { l: Math.min(...out.map((g) => g.box.l)), r: Math.max(...out.map((g) => g.box.r)), t: out[0].box.t, b: out[out.length - 1].box.b } };
	};
	const sceneR = Math.max(rLab.box.r, Rc[0] + TURN_R + 2), sceneT = Math.min(rLab.box.t, wLab.box.t, ...L.map((l) => l.box.t));
	if (BOOK) {
		// one column at the right of the scene, its middle level with the scene's
		const probe = await column(steps, 0, 0), h = probe.box.b - probe.box.t;
		L.push(await column(steps, sceneR + COLUMN_GAP, (sceneT + body.b) / 2 - h / 2 - probe.box.t));
	} else {
		// two columns under the scene: a to d from the person's left, e to h ending at the scene's right
		const top = Math.max(body.b, dk.b) + ROWS_GAP;
		const left = await column(steps.slice(0, 4), body.l - 1, 0), right = await column(steps.slice(4), 0, 0);
		L.push(await column(steps.slice(0, 4), body.l - 1, top - left.box.t));
		L.push(await column(steps.slice(4), sceneR - right.box.r, top - right.box.t));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, rotor: plus, other: minus, drawn };
	return finish(S, L, BOOK ? [380, 460] : [270, 350]);
}

/** One line of numbers: a circled step letter (or none, with the same indent) and the line, its baseline at y. */
async function stepLine(S, step, src, x, y) {
	const g = await tex(src, [x + 2 * DISC + DISC_GAP, y], SIZE, 'lB', INK);
	const box = boxOf(g);
	let svg = g;
	const xh = y - 0.43 * SIZE / 2 - 0.4;            // the circle's centre at the middle of the x-height
	if (step) {
		const cx = x + DISC;
		const lt = await tex(`\\text{${step}}`, [0, 0], SMALL, 'lB', DIM);
		const lb = boxOf(lt);
		const dx = cx - (lb.l + lb.r) / 2, dy = xh - (lb.t + lb.b) / 2;
		svg = `<circle cx="${n2(cx)}" cy="${n2(xh)}" r="${DISC}" fill="none" stroke="${DIM}" stroke-width="${HAIR}"/><g transform="translate(${n2(dx)},${n2(dy)})">${lt}</g>` + svg;
	}
	return { src, svg, box: { l: x - HAIR / 2, r: box.r, t: Math.min(box.t, xh - DISC - HAIR / 2), b: Math.max(box.b, xh + DISC + HAIR / 2) } };
}

/** Where a sprite has ink (alpha at least half): [left, right, top, bottom] in pixels. */
async function inkOf(s) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const a = ctx.getImageData(0, 0, img.width, img.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (a[(y * img.width + x) * 4 + 3] >= 128) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l, r: r + 1, t, b: b + 1 };
}

/** The picture resampled to `h` pixels tall, as a data URL. */
async function resample(s, h) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.height = h; c.width = Math.round((h * img.width) / img.height);
	const ctx = c.getContext('2d');
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, 0, 0, c.width, c.height);
	return c.toDataURL('image/png');
}
