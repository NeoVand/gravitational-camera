// Shared numbers and marks for the four diagrams of the tutorial's chapter 5.6 (tutorial/waves/abel-transform.md):
// tut-abel-chords, tut-abel-three-glows, tut-abel-kink and tut-abel-peel. Not a figure itself. The sheet, the strokes,
// the labels and the cropping are chapter 1.2's (figs/tut-pot-lib.js), the axes chapter 3.1's (figs/tut-prob-lib.js),
// the sampling of curves chapter 2.6's (figs/tut-fourier-lib.js), the dashes chapter 3.6's (figs/tut-bessel-lib.js,
// DASH), the steel ball and its gold chapter 2.5's (figs/tut-null-lib.js), all imported, not copied. The colours: the
// Earth's shells are the paper's Figure fig:earth-glow's (figs/earth-glow.js, SHELLS), mixed with the page so that
// they stay pale in the light theme and dark in the dark one, under ink that the site swaps for its theme's; the
// gold, matter's colour of chapter 2.5; the errors of the peeling, chapter 3.1's colour of the noise (the second
// accent, blue). Everything else is neutral, as the comments ask.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the grazing angles
// arcsin(r/R) of the paper's Earth, 11.1, 33.1 and 63.5 degrees (also for the scene's inner core of 1221.5 km), and
// the discs 240 r/R site pixels, 46, 131 and 215; the chord of a uniform ball 2 sqrt(R^2 - b^2) and the diameter
// 12,742 km; the line toward the Sun's core, 4095 km from the centre; the core's chords 167 and 527 km; the spot, the
// dome and the ring, each closed form against a numerical integration of eq:abel-transform along the chord, and the
// ring's peak, at b = 0.95 R, sqrt(2R/t - 1) = 6.24 times its middle for t = 0.05 R (14 for 0.01 R); the two-shell
// planet's N(0) = 4.4, N(0.6 R) = 1.6 and N(R) = 0, the same against the numerical integral, its chords 0.8 R and
// 1.2 R and the peeling's j_1 = 1, j_2 = 3; and the five equal shells' peeling, whose glows come back exactly from
// exact readings and whose errors, each reading's 1% carried through the peeling, are 1.0, 1.6, 2.2, 3.1 and 5.8%.
import { DASH } from './tut-bessel-lib.js';
import { MATTER, SHADE } from './tut-null-lib.js';
import { normals } from './tut-prob-lib.js';

export { DASH, MATTER, SHADE };

// ---- the paper's Earth (km): the text's radii; the scene's inner core is 1221.5 km --------------------------------
export const EARTH = 6371;
export const BOUNDARIES = [
	{ key: 'inner core', r: 1222 },
	{ key: 'core', r: 3480 },
	{ key: 'lower mantle', r: 5701 }
];
export const SCENE_INNER = 1221.5;
/** The angle from straight down, in degrees, of the line that grazes the sphere of radius r. */
export const grazing = (r, R = EARTH) => (Math.asin(r / R) * 180) / Math.PI;

/** The paper's fig:earth-glow shell colours (figs/earth-glow.js, SHELLS), from the crust inward; the outer shell of
 * the tutorial's drawing, the upper mantle and the crust, takes the upper mantle's. */
export const PAPER_SHELLS = { crust: '#f1e9de', upper: '#f1d9bd', lower: '#ebc59c', outer: '#e2a86f', inner: '#d48a46' };
export const PALE = { day: 62, night: 30 };      // the share of the colour, the rest the page, in each theme
/** A shell's fill: the paper's colour mixed with the page (#fffffe, which the site turns into its --bg), more of the
 * colour in the light theme than in the dark, so that the ink over it reads in both. */
export const shellFill = (c) => `light-dark(color-mix(in srgb, ${c} ${PALE.day}%, #fffffe), color-mix(in srgb, ${c} ${PALE.night}%, #fffffe))`;

// ---- the round glows of the second section, in units of j and R ---------------------------------------------------
const root = (x) => Math.sqrt(Math.max(0, x));
export const NUGGET = 0.2;                 // the nugget's radius
export const SKIN = 0.05;                  // the skin's thickness
export const spot = (b) => 2 * root(NUGGET ** 2 - b * b);
export const dome = (b) => 2 * root(1 - b * b);
export const ring = (b, t = SKIN) => 2 * (root(1 - b * b) - root((1 - t) ** 2 - b * b));

// ---- the two-shell planet of the inversion section, glow 3 inside 0.6 R and 1 outside, in units of j R --------------
export const R0 = 0.6;
export const INNER = 3;
export const twoShell = (b) => 2 * root(1 - b * b) + 2 * (INNER - 1) * root(R0 * R0 - b * b);
export const outerOnly = (b) => 2 * root(1 - b * b);

// ---- shells, as the peeling section numbers them: shell i between radii[i] and radii[i - 1], radii[0] = R ----------
/** L_i(b): the length of the line of impact parameter b in shell i. */
export const length = (radii, i, b) => 2 * (root(radii[i - 1] ** 2 - b * b) - root(radii[i] ** 2 - b * b));
/** The brightness of the line b, sum j_i L_i(b). */
export const brightness = (radii, glows, b) => glows.reduce((s, j, k) => s + j * length(radii, k + 1, b), 0);
/** The peeling: the glows from the readings N_k of the lines that graze the bottom of each shell, b = radii[k]. */
export function peel(radii, readings) {
	const j = [];
	for (let k = 1; k < radii.length; k++) {
		let rest = readings[k - 1];
		for (let i = 1; i < k; i++) rest -= j[i - 1] * length(radii, i, radii[k]);
		j.push(rest / length(radii, k, radii[k]));
	}
	return j;
}
export const FIVE = [1, 0.8, 0.6, 0.4, 0.2, 0];
export const READING_ERROR = 0.01;
/** Each shell's error when each reading has the relative error READING_ERROR, independent: the peeling is linear in
 * the readings, so each reading's error is carried through it by peeling that reading's error alone, and the
 * contributions add in quadrature. Exact. */
export function peelErrors(radii = FIVE, glows = radii.slice(1).map(() => 1)) {
	const readings = radii.slice(1).map((b) => brightness(radii, glows, b));
	const v = glows.map(() => 0);
	readings.forEach((N, k) => {
		const one = readings.map((_, i) => (i === k ? READING_ERROR * N : 0));
		peel(radii, one).forEach((d, i) => { v[i] += d * d; });
	});
	return { readings, errors: v.map((x, i) => Math.sqrt(x) / glows[i]) };
}

/** N(b) = 2 int_0^sqrt(R^2 - b^2) j(sqrt(b^2 + s^2)) ds, by the midpoint rule on n steps: eq:abel-transform's first
 * form, the sum along the chord, with R = 1. */
export function alongChord(j, b, n = 200000) {
	const half = root(1 - b * b), ds = half / n;
	let sum = 0;
	for (let i = 0; i < n; i++) { const s = (i + 0.5) * ds; sum += j(Math.hypot(b, s)); }
	return 2 * sum * ds;
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the grazing angles and the discs
	const angles = BOUNDARIES.map(({ r }) => grazing(r));
	check(angles.map((a) => a.toFixed(1)).join() === '11.1,33.1,63.5', `the grazing angles ${angles}`);
	check(grazing(SCENE_INNER).toFixed(1) === '11.1', 'the scene\'s inner core');
	const discs = BOUNDARIES.map(({ r }) => (240 * r) / EARTH);
	check(discs.map((d) => d.toFixed(0)).join() === '46,131,215', `the discs ${discs}`);
	// b = R sin theta, and the chord 2 sqrt(R^2 - b^2) = 2 R cos theta
	for (const a of angles) {
		const t = (a * Math.PI) / 180;
		check(near(2 * root(1 - Math.sin(t) ** 2), 2 * Math.cos(t), 1e-14), 'the chord is not 2 R cos theta');
	}
	check(2 * EARTH === 12742, 'the diameter');
	check(Math.round(EARTH * Math.sin((40 * Math.PI) / 180)) === 4095 && EARTH * Math.sin((40 * Math.PI) / 180) > 3480, 'the line toward the Sun\'s core');
	// the text's 2 sqrt(2 x 3480 x 1) = 167 km; the exact chords 1 km and 10 km inside the core's edge, 167 and 527 km
	// (2 sqrt(2 r0 d) would give 528 for the second)
	check(Math.round(2 * Math.sqrt(2 * 3480 * 1)) === 167, 'the core\'s chord 167 km');
	for (const [d, km] of [[1, 167], [10, 527]]) check(Math.round(2 * Math.sqrt(3480 ** 2 - (3480 - d) ** 2)) === km, `the exact chord ${d} km inside`);
	check(((Math.asin(3480 / EARTH) - Math.asin(3479 / EARTH)) * 180 / Math.PI).toFixed(3) === '0.011', 'the 0.011 degrees');

	// ---- the spot, the dome and the ring against the sum along the chord
	const glows = {
		spot: [(r) => (r < NUGGET ? 1 : 0), spot],
		dome: [() => 1, dome],
		ring: [(r) => (r > 1 - SKIN ? 1 : 0), (b) => ring(b)]
	};
	for (const [key, [j, N]] of Object.entries(glows))
		for (const b of [0, 0.1, 0.19, 0.3, 0.5, 0.9, 0.94, 0.96, 0.99]) check(near(alongChord(j, b), N(b), 2e-5), `the ${key} at b = ${b}: ${alongChord(j, b)} against ${N(b)}`);
	// the ring: 2t through the middle, 2 sqrt(2Rt - t^2) at b = R - t, its largest value, sqrt(2R/t - 1) times the middle
	check(near(ring(0), 2 * SKIN, 1e-15) && near(ring(1 - SKIN), 2 * Math.sqrt(2 * SKIN - SKIN ** 2), 1e-15), 'the ring\'s middle and edge');
	let best = 0, at = 0;
	for (let i = 0; i <= 1e6; i++) { const b = i / 1e6; if (ring(b) > best) { best = ring(b); at = b; } }
	const ratio = best / ring(0);
	check(near(at, 1 - SKIN, 1e-6) && near(ratio, Math.sqrt(2 / SKIN - 1), 1e-9) && ratio.toFixed(2) === '6.24' && ratio.toFixed(1) === '6.2', `the ring's peak ${ratio} at ${at}`);
	check(Math.sqrt(2 / 0.01 - 1).toFixed(0) === '14' && near(Math.sqrt(2 / 0.01 - 1), Math.sqrt(199), 1e-15), 'the ring of 0.01 R');

	// ---- the two-shell planet
	const N0 = twoShell(0), Nr = twoShell(R0), N1 = twoShell(1);
	check(near(N0, 4.4, 1e-14) && near(Nr, 1.6, 1e-14) && N1 === 0, `the two-shell N ${N0}, ${Nr}, ${N1}`);
	const two = (r) => (r < R0 ? INNER : 1);
	for (const b of [0, 0.2, 0.5, 0.58, 0.6, 0.61, 0.8, 0.99]) check(near(alongChord(two, b), twoShell(b), 3e-5), `the two-shell N at ${b}`);
	const radii2 = [1, R0, 0];
	check(near(length(radii2, 1, R0), 1.6, 1e-14) && near(length(radii2, 1, 0), 0.8, 1e-14) && near(length(radii2, 2, 0), 1.2, 1e-14), 'the two-shell chords');
	const j2 = peel(radii2, [twoShell(R0), twoShell(0)]);
	check(near(j2[0], 1, 1e-14) && near(j2[1], 3, 1e-14), `the two-shell peeling ${j2}`);
	check(near(N0 - 0.8, 3.6, 1e-14) && near(3.6 / 1.2, 3, 1e-14), 'the 3.6 R and 3.6/1.2');
	// the slope just inside r0: -2 (INNER - 1) b / sqrt(r0^2 - b^2) of the inner part grows as (r0 - b)^(-1/2)
	for (const d of [1e-4, 1e-6]) {
		const b = R0 - d, slope = (-2 * (INNER - 1) * b) / Math.sqrt(R0 * R0 - b * b);
		check(near(slope / (-(INNER - 1) * Math.sqrt((2 * R0) / d)), 1, 2 * d), `the slope near r0 at ${d}`);
	}

	// ---- the five equal shells
	const { readings, errors } = peelErrors();
	const back = peel(FIVE, readings);
	check(back.every((j) => near(j, 1, 1e-13)), `the peeling of exact readings ${back}`);
	check(errors.map((e) => (100 * e).toFixed(1)).join() === '1.0,1.6,2.2,3.1,5.8', `the peeling's errors ${errors}`);
	check(near(errors[0], READING_ERROR, 1e-15) && (errors[4] / READING_ERROR).toFixed(0) === '6', 'the outer shell\'s error is the reading\'s, the centre\'s six times it');
	// the same errors from many peelings of noisy readings (seeded): within 2% of the exact ones
	{
		const z = normals(56), n = 40000, sums = errors.map(() => 0);
		for (let m = 0; m < n; m++) {
			const j = peel(FIVE, readings.map((N) => N * (1 + READING_ERROR * z())));
			j.forEach((x, i) => { sums[i] += (x - 1) ** 2; });
		}
		sums.forEach((s, i) => check(Math.abs(Math.sqrt(s / n) / errors[i] - 1) < 0.02, `the sampled error of shell ${i + 1}`));
	}
	return { angles, discs, ratio, N0, Nr, errors, readings };
}
