// The tutorial, section 6.3 (tutorial/relativity/aberration.md), its third diagram: the whole sky of a moving
// observer. Two round panels, one above the other (side by side in the book), each a disc showing the whole sky in
// the equal-area projection centred on the direction of motion: the centre is straight ahead, the rim straight
// behind, and a point at the angle alpha from the direction of motion lies sin(alpha/2) of the rim's radius out, so
// that equal areas of sky get equal areas of disc. Above, "at rest": 400 stars, small ink dots, equally spaced in area
// (a Fibonacci lattice on the sphere, which the projection turns into a sunflower), and the circle alpha = 90 degrees,
// the boundary of the forward half, thin and dashed, named "90 degrees". Below, "at 0.9c": the same stars moved by cos
// alpha' = (cos alpha + beta)/(1 + beta cos alpha), each keeping its azimuth, and each coloured by its Doppler factor
// 1/[gamma(1 - beta cos alpha')] on the paper's diverging scale (tut-aberration-lib.js, `shift`), blue above 1 and
// orange below, with a colour bar at its right from 0.23 to 4.36, the factors straight behind and straight ahead,
// e^{-+eta}; the image of the circle alpha = 90 degrees, at alpha' = 25.8 degrees, thin and dashed, named "25.8
// degrees".
// Departures from the diagram's comment: on the site the panels are stacked at every width, not side by side at
// 1440 px (as section 6.2's tut-vectors-gradient): side by side each disc would be about 150 points across and would be
// shrunk on a phone, where the crowded stars ahead would merge. In the printed book (figureLayout 'book') they stand
// side by side as the comment asks, "at rest" at the left and "at 0.9c" at the right with the colour bar at its right,
// the discs at the site's size, on one level, 26 points of air between their rims, the titles on one baseline. The
// colour bar is graded in proportion to the logarithm of the factor, so that a factor and its inverse lie equally far
// from 1, and is ticked at 0.23, 0.5, 1, 2 and 4.36. The middle of the scale, a factor of 1, is the neutral faint ink
// rather than the page's colour, which the paper's scale uses, so that the stars there are still seen. The stars are
// too close for a name to sit among them, so each dashed circle is named outside its disc, with a thin leader to the
// circle, at the azimuth where the leader passes farthest from the stars.
// Exact: every star's place on both discs (the lattice, the projection and eq:source-angle, asserted star by star),
// its colour (eq:doppler-seen, asserted against gamma(1 + beta cos alpha)), the two circles' radii, R sin 45 degrees
// and R sin 12.9 degrees, and the bar's ticks. Schematic: the dots' size.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK, SIZE, boxOf } from './tut-pot-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM, tex } from '../lib.js';
import { chapter, palette, STARS, N_STARS, BETA_SKY, GAMMA_SKY, ETA_SKY, seen, doppler, disc, shift, rad } from './tut-aberration-lib.js';

const name = 'tut-aberration-sky';
const check = checker(name);

const R = 92;                              // a disc's radius, points
const STAR = 0.65;                         // a star's radius, points
const APART = 18;                          // the site's: the air between the upper disc and the lower panel's title, points
const BOOK = globalThis.figureLayout === 'book';
const BESIDE = 26;                         // the book's: the air between the two discs' rims, points
const BAR = { w: 5.5, h: 1.5 * R, gap: 16 }; // the colour bar: its width, its height, its air from the lower disc
const STEPS = 90;                          // the bar's bands
const TICKS = [[Math.exp(-ETA_SKY), '0.23'], [0.5, '0.5'], [1, '1'], [2, '2'], [Math.exp(ETA_SKY), '4.36']];
const LEADER = 0.35;                       // a leader's stroke
const REACH = 9;                           // a leader's length outside the rim, points

/** A dashed circle of radius r about c: a whole number of dashes, evenly spaced. */
function circle(S, c, r, what) {
	const per = DASH[0] + DASH[1], n = Math.round((2 * Math.PI * r) / per), on = (DASH[0] / per) * (2 * Math.PI / n);
	for (let k = 0; k < n; k++) {
		const t0 = (2 * Math.PI * k) / n, pts = Array.from({ length: 7 }, (_, j) => { const t = t0 + (on * j) / 6; return [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)]; });
		S.path(pts, { color: INK, width: THIN, layer: 4, cap: 'butt', what: `${what}, dash ${k}` });
	}
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - 40;

	// ---- the stars: at rest, and moving at 0.9c
	const moved = STARS.map((s) => ({ ...s, alpha: seen(s.alpha, BETA_SKY) }));
	moved.forEach((m, i) => {
		const c = Math.cos(STARS[i].alpha);
		check(near(Math.cos(m.alpha), (c + BETA_SKY) / (1 + BETA_SKY * c), 1e-13) && m.alpha <= STARS[i].alpha + 1e-15, `star ${i} is not moved by eq:source-angle`);
	});
	// equal area: the share of stars within alpha is (1 - cos alpha)/2 = sin^2(alpha/2), the disc's share of area
	for (const a of [30, 60, 90, 120, 150]) {
		const inside = STARS.filter((s) => s.alpha < rad(a)).length / N_STARS;
		check(Math.abs(inside - disc(rad(a)) ** 2) <= 1 / N_STARS + 1e-12, `the lattice is not equal-area at ${a} degrees`);
	}

	/** One panel: its title at the top, its disc under it. Returns the disc's centre and its bottom. */
	async function panel(top, title, stars, colour, ring, ringName, what, x = x0) {
		// in the book the two titles stand side by side, on one baseline at `top`, the discs 7 points under it
		let t, c;
		if (BOOK) {
			const g = await tex(title, [x, top], SIZE, 'cB', INK);
			t = { src: title, svg: g, box: boxOf(g) };
			c = [x, top + 7 + R];
		} else {
			t = await placed(title, x, top, 0.5, 0, INK);
			c = [x, t.box.b + 7 + R];
		}
		L.push(t);
		S.path(Array.from({ length: 241 }, (_, k) => [c[0] + R * Math.cos((2 * Math.PI * k) / 240), c[1] - R * Math.sin((2 * Math.PI * k) / 240)]), { color: DIM, width: HAIR, layer: 1, what: `${what}: the rim` });
		const pts = stars.map((s) => [c[0] + R * disc(s.alpha) * Math.cos(s.phi), c[1] - R * disc(s.alpha) * Math.sin(s.phi)]);
		pts.forEach((p, i) => {
			S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${STAR}" fill="${colour(stars[i])}"/>`, 3);
			S.mark([p], STAR, `${what}: a star`);
		});
		// the circle, and its name outside the rim along the azimuth whose leader passes farthest from the stars
		const r = R * disc(ring);
		circle(S, c, r, `${what}: the circle`);
		let best = { d: -1 };
		for (let a = 25; a <= 65; a += 0.25) {
			const u = [Math.cos(rad(a)), -Math.sin(rad(a))];
			let d = Infinity;
			for (const p of pts) {
				const s = Math.max(r, Math.min(R, (p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1]));
				d = Math.min(d, Math.hypot(p[0] - c[0] - u[0] * s, p[1] - c[1] - u[1] * s));
			}
			if (d > best.d) best = { d, a, u };
		}
		const { u } = best;
		const start = [c[0] + u[0] * (r + THIN), c[1] + u[1] * (r + THIN)], end = [c[0] + u[0] * (R + REACH), c[1] + u[1] * (R + REACH)];
		S.raw(`<path d="M${start[0].toFixed(2)},${start[1].toFixed(2)}L${end[0].toFixed(2)},${end[1].toFixed(2)}" stroke="${DIM}" stroke-width="${LEADER}" fill="none"/>`, 4);
		S.mark([[c[0] + u[0] * (R + 0.5), c[1] + u[1] * (R + 0.5)], end], LEADER / 2, `${what}: the leader`);
		L.push(await placed(ringName, end[0] + LABEL_GAP + 0.4, end[1] - 0.4, 0, 1, INK));
		window[`${name}-leader-${what}`] = { azimuth: best.a, air: best.d - STAR };
		return { c, bottom: c[1] + R };
	}

	// ---- above, at rest: all ink; the circle alpha = 90 degrees
	// (in the book: at the left, the moving sky at its right, the colour bar at the right of both)
	const up = await panel(BOOK ? ORIGIN - R - 20 : ORIGIN - 2 * R - 40, '\\text{at rest}', STARS, () => INK, rad(90), '90^\\circ', 'at rest', BOOK ? ORIGIN - R - BESIDE / 2 - 20 : x0);
	// ---- below, at 0.9c: coloured by the Doppler factor; the circle's image at alpha' = 25.8 degrees
	const cone = seen(rad(90), BETA_SKY);
	check((cone * 180 / Math.PI).toFixed(1) === '25.8' && near(cone * 180 / Math.PI, nums.cone, 1e-12), `the cone ${cone}`);
	check(near(disc(cone), Math.sqrt((1 - BETA_SKY) / 2), 1e-15), 'the cone\'s circle does not hold a twentieth of the disc');
	const factor = (s) => doppler(s.alpha, BETA_SKY);
	const down = BOOK
		? await panel(ORIGIN - R - 20, '\\text{at } 0.9c', moved, (s) => shift(factor(s)), cone, '25.8^\\circ', 'at 0.9c', up.c[0] + 2 * R + BESIDE)
		: await panel(up.bottom + APART, '\\text{at } 0.9c', moved, (s) => shift(factor(s)), cone, '25.8^\\circ', 'at 0.9c');
	if (BOOK) check(near(up.c[1], down.c[1], 1e-9), `the two discs are not on one level: ${up.c[1]}, ${down.c[1]}`);
	moved.forEach((m, i) => check(near(factor(m), GAMMA_SKY * (1 + BETA_SKY * Math.cos(STARS[i].alpha)), 1e-12), `star ${i}'s factor`));
	const factors = moved.map(factor);
	check(Math.max(...factors) <= nums.ahead + 1e-12 && Math.min(...factors) >= nums.behind - 1e-12, 'a factor outside the bar');

	// ---- the colour bar at the right of the lower disc: the logarithm of the factor, from e^{-eta} up to e^{eta}
	{
		const left = down.c[0] + R + BAR.gap, mid = down.c[1], h = BAR.h;
		const y = (D) => mid - (Math.log(D) / ETA_SKY) * (h / 2);
		check(near(y(nums.ahead), mid - h / 2, 1e-12) && near(y(nums.behind), mid + h / 2, 1e-12) && near(y(1), mid, 1e-15), 'the bar\'s ends');
		let bands = '';
		for (let k = 0; k < STEPS; k++) {
			const t0 = mid + h / 2 - (h * k) / STEPS, t1 = mid + h / 2 - (h * (k + 1)) / STEPS;
			const D = Math.exp((((k + 0.5) / STEPS) * 2 - 1) * ETA_SKY);
			// each band reaches 0.4 point into the next one up, which is drawn over it, so that no seam shows between them
			const over = k === STEPS - 1 ? 0 : 0.4;
			bands += `<rect x="${left.toFixed(2)}" y="${(t1 - over).toFixed(2)}" width="${BAR.w}" height="${(t0 - t1 + over).toFixed(2)}" fill="${shift(D)}"/>`;
		}
		S.raw(bands, 2);
		const box = { l: left, r: left + BAR.w, t: mid - h / 2, b: mid + h / 2 };
		S.boxes.push({ box, what: 'the colour bar' });
		for (const [D, text] of TICKS) {
			check(near(+text, D, 0.005), `the tick ${text} is not at ${D}`);
			const ty = y(D);
			S.path([[left + BAR.w, ty], [left + BAR.w + TICK + 0.5, ty]], { color: DIM, width: HAIR, cap: 'butt', what: `the tick ${text}` });
			L.push(await placed(text, left + BAR.w + TICK + 0.5 + LABEL_GAP + 0.3, ty, 0, 0.5, INK));
		}
		L.push(await placed("\\omega'/\\omega", left + BAR.w / 2, box.t - LABEL_GAP - 6.5, 0.5, 1, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, BOOK ? [400, 460] : [200, 300]);
}
