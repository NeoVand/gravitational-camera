/**
 * Chapter 6.3's moving sky: the figure's model against the chapter's equations and every number its specification
 * asks for: the aberration map and its inverse; the equal-area projection; the cone arccos β of 53.1°, 25.8° and 8.1°
 * at 0.6, 0.9 and 0.99c; the forward half squeezed into 0.2 of the sky at 0.6c; the Doppler factors e^{±η} ahead and
 * behind, their ratio 4 at 0.6c; the first-order dipole; the Earth's 20.5″; and when the predictions are answered.
 */
import { describe, expect, it } from 'vitest';
import {
	ARCSEC,
	DEG,
	EARTH,
	END_FLOOR,
	FIRST_START,
	MAGNIFY,
	OPENING,
	STAR_COUNT,
	aberrate,
	angleOf,
	betaOf,
	colour,
	cosSeen,
	degrees,
	dipole,
	discFraction,
	doppler,
	dopplerAtRest,
	earthBeta,
	motion,
	noteFirst,
	noteSecond,
	placeLabels,
	project,
	radiusOf,
	scaleEnd,
	seenStar,
	shift,
	skyFraction,
	smallShift,
	stars,
	sun,
	temperature,
	three,
	threeTex,
	tone,
	unaberrate,
	unchanged,
	unproject
} from './moving-sky';

const ANGLES = Array.from({ length: 37 }, (_, i) => i * 5 * DEG);
const SPEEDS = [0, 0.01, 0.3, 0.6, 0.9, 0.99];

describe('the aberration of eq:source-angle', () => {
	it('agrees with cos α′ = (cos α + β)/(1 + β cos α)', () => {
		for (const beta of SPEEDS)
			for (const alpha of ANGLES)
				expect(Math.cos(aberrate(alpha, beta))).toBeCloseTo(cosSeen(Math.cos(alpha), beta), 12);
	});

	it('is undone by its inverse, and the inverse by it', () => {
		for (const beta of SPEEDS)
			for (const alpha of ANGLES) {
				expect(unaberrate(aberrate(alpha, beta), beta)).toBeCloseTo(alpha, 12);
				expect(aberrate(unaberrate(alpha, beta), beta)).toBeCloseTo(alpha, 12);
			}
	});

	it('moves every source toward the direction of motion, except those ahead and behind', () => {
		for (const beta of SPEEDS.slice(1)) {
			expect(aberrate(0, beta)).toBe(0);
			expect(aberrate(Math.PI, beta)).toBe(Math.PI);
			for (const alpha of ANGLES.slice(1, -1)) expect(aberrate(alpha, beta)).toBeLessThan(alpha);
		}
	});

	it('leaves the sky alone at rest', () => {
		for (const alpha of ANGLES) expect(aberrate(alpha, 0)).toBeCloseTo(alpha, 14);
	});

	it('sees a source at 90° at 53.1° for 0.6c, with the Doppler factor γ = 1.25', () => {
		expect(aberrate(90 * DEG, 0.6) / DEG).toBeCloseTo(53.13, 2);
		expect(dopplerAtRest(90 * DEG, 0.6)).toBeCloseTo(1.25, 14);
		expect(doppler(aberrate(90 * DEG, 0.6), 0.6)).toBeCloseTo(1.25, 12);
	});

	it('shrinks angles as tan(α/2)/γ for a fast camera', () => {
		const beta = 0.9999;
		const gamma = motion(beta).gamma;
		for (const alpha of [30, 90, 150].map((a) => a * DEG))
			expect(aberrate(alpha, beta) / (Math.tan(alpha / 2) / gamma)).toBeCloseTo(1, 3);
	});
});

describe('the cone of the forward half, eq:cone', () => {
	it('is arccos β: 53.1°, 25.8° and 8.1° at 0.6, 0.9 and 0.99c', () => {
		expect(motion(0.6).cone / DEG).toBeCloseTo(53.13, 2);
		expect(motion(0.9).cone / DEG).toBeCloseTo(25.84, 2);
		expect(motion(0.99).cone / DEG).toBeCloseTo(8.11, 2);
		expect(degrees(motion(0.6).cone)).toBe('53.1');
		expect(degrees(motion(0.9).cone)).toBe('25.8');
		expect(degrees(motion(0.99).cone)).toBe('8.11');
	});

	it('is where the stars at right angles go, and its sine is 1/γ', () => {
		for (const beta of SPEEDS) {
			const m = motion(beta);
			expect(aberrate(90 * DEG, beta)).toBeCloseTo(m.cone, 12);
			expect(Math.sin(m.cone)).toBeCloseTo(1 / m.gamma, 12);
		}
	});

	it('holds the forward half of the sky in (1 − β)/2: 0.2 at 0.6c, half a per cent at 0.99c', () => {
		expect(motion(0.6).forward).toBeCloseTo(0.2, 14);
		expect(motion(0.99).forward).toBeCloseTo(0.005, 14);
		expect(motion(0).forward).toBeCloseTo(0.5, 14);
	});

	it('holds the forward half of the star field, counted', () => {
		const field = stars();
		for (const beta of [0.6, 0.9]) {
			const cone = motion(beta).cone;
			const inside = field.filter((s) => s.alpha <= 90 * DEG).length;
			const seenInside = field.filter((s) => seenStar(s, beta).alpha <= cone + 1e-12).length;
			expect(inside).toBe(STAR_COUNT / 2);
			expect(seenInside).toBe(inside);
		}
	});
});

describe('the equal-area projection', () => {
	it('puts the fraction of the sky within α on the same fraction of the disc', () => {
		for (const alpha of ANGLES) expect(discFraction(alpha)).toBeCloseTo(skyFraction(alpha), 14);
	});

	it('has a Jacobian proportional to the sphere’s area element: dA_disc = (sin α / 4) dα dφ', () => {
		const h = 1e-6;
		for (const alpha of ANGLES.slice(1, -1))
			for (const phi of [0, 1, 2.5, 4]) {
				const a = project(alpha, phi);
				const da = project(alpha + h, phi);
				const dp = project(alpha, phi + h);
				const det = ((da.x - a.x) * (dp.y - a.y) - (da.y - a.y) * (dp.x - a.x)) / (h * h);
				// the whole sphere, 4π, onto the unit disc, π: a quarter of the area element sin α dα dφ
				expect(det / Math.sin(alpha)).toBeCloseTo(0.25, 5);
			}
	});

	it('is undone by its inverse', () => {
		for (const alpha of ANGLES.slice(1, -1))
			for (const phi of [-3, -1, 0, 1, 3]) {
				const p = project(alpha, phi);
				const back = unproject(p.x, p.y);
				expect(back.alpha).toBeCloseTo(alpha, 10);
				expect(back.phi).toBeCloseTo(phi, 10);
			}
		expect(angleOf(radiusOf(1.234))).toBeCloseTo(1.234, 12);
	});

	it('puts straight ahead at the centre, 90° at 1/√2 and straight behind on the rim', () => {
		expect(radiusOf(0)).toBe(0);
		expect(radiusOf(90 * DEG)).toBeCloseTo(Math.SQRT1_2, 14);
		expect(radiusOf(Math.PI)).toBeCloseTo(1, 14);
	});

	it('gives the star field equal areas: a quarter of the stars within each quarter of the disc’s area', () => {
		const field = stars();
		for (const q of [0.25, 0.5, 0.75]) {
			const n = field.filter((s) => radiusOf(s.alpha) ** 2 <= q).length;
			expect(Math.abs(n - q * STAR_COUNT)).toBeLessThanOrEqual(1);
		}
	});
});

describe('the Doppler factor, eq:doppler-seen and eq:head-on', () => {
	it('is the same from either angle: 1/[γ(1 − β cos α′)] = γ(1 + β cos α)', () => {
		for (const beta of SPEEDS)
			for (const alpha of ANGLES)
				expect(doppler(aberrate(alpha, beta), beta)).toBeCloseTo(dopplerAtRest(alpha, beta), 10);
	});

	it('is e^{η} ahead and e^{−η} behind', () => {
		for (const beta of SPEEDS) {
			const m = motion(beta);
			expect(doppler(0, beta)).toBeCloseTo(Math.exp(m.eta), 10);
			expect(doppler(Math.PI, beta)).toBeCloseTo(Math.exp(-m.eta), 10);
			expect(m.ahead).toBeCloseTo(Math.sqrt((1 + beta) / (1 - beta)), 10);
		}
	});

	it('is 2 ahead and 1/2 behind at 0.6c, a ratio of 4 at η = ln 2', () => {
		const m = motion(0.6);
		expect(m.eta).toBeCloseTo(Math.LN2, 14);
		expect(m.ahead).toBeCloseTo(2, 14);
		expect(m.behind).toBeCloseTo(0.5, 14);
		expect(m.ratio).toBeCloseTo(4, 13);
		expect(doppler(0, 0.6) / doppler(Math.PI, 0.6)).toBeCloseTo(4, 13);
		// and 0.6c is the only hundredth where it is 4
		for (let n = 0; n <= 99; n++)
			if (n !== 60) expect(Math.abs(motion(betaOf(n)).ratio - 4)).toBeGreaterThan(0.1);
	});

	it('runs from 0.229 to 4.36 at 0.9c, the colour bar’s ends', () => {
		const m = motion(0.9);
		expect(three(m.behind)).toBe('0.229');
		expect(three(m.ahead)).toBe('4.36');
	});

	it('is 1/γ = 0.8 at α′ = 90° for 0.6c: the transverse shift', () => {
		expect(doppler(90 * DEG, 0.6)).toBeCloseTo(0.8, 14);
	});
});

describe('the moving black body, eq:moving-temperature', () => {
	it('is the Doppler factor in each direction', () => {
		for (const alpha of ANGLES) expect(temperature(alpha, 0.6)).toBe(doppler(alpha, 0.6));
	});

	it('has the first-order dipole 1 + β cos α′, wrong only at order β²', () => {
		for (const beta of [1e-4, 1e-3, 0.01])
			for (const alpha of ANGLES)
				expect(Math.abs(temperature(alpha, beta) - dipole(alpha, beta))).toBeLessThanOrEqual(
					1.01 * beta * beta
				);
	});

	it('gives the microwave background’s ±3.36 mK at 370 km/s', () => {
		const beta = 370 / EARTH.c;
		expect(2.7255e3 * (dipole(0, beta) - 1)).toBeCloseTo(3.36, 2);
	});

	it('is unchanged at the angle where γ(1 − β cos α′) = 1, and hotter inside it', () => {
		for (const beta of [0.3, 0.6, 0.9]) {
			const at = unchanged(beta)!;
			expect(temperature(at, beta)).toBeCloseTo(1, 12);
			expect(temperature(at - 0.01, beta)).toBeGreaterThan(1);
		}
		expect(unchanged(0.6)! / DEG).toBeCloseTo(70.53, 2);
		expect(unchanged(0)).toBeUndefined();
	});
});

describe('the Sun at the Earth’s speed, eq:small-aberration', () => {
	it('is shifted by 20.5″ at 29.78 km/s', () => {
		const s = sun();
		expect(earthBeta()).toBeCloseTo(9.93e-5, 7);
		expect(s.arcsec).toBeCloseTo(20.49, 2);
		expect(s.delta).toBeCloseTo(9.93e-5, 7);
		expect(s.first * ARCSEC).toBeCloseTo(s.arcsec, 6);
	});

	it('is drawn a thousand times larger as 5.7°', () => {
		expect(MAGNIFY).toBe(1000);
		expect(sun().shown).toBeCloseTo(5.69, 2);
	});

	it('is the first-order shift β sin α everywhere, within the second-order β²/4', () => {
		const beta = earthBeta();
		for (const alpha of ANGLES)
			expect(Math.abs(shift(alpha, beta) - smallShift(alpha, beta))).toBeLessThanOrEqual(
				(1.001 * (beta * beta)) / 4
			);
	});
});

describe('the colours', () => {
	it('put 1 in the middle and the ends at e^{∓η}', () => {
		const m = motion(0.9);
		const end = scaleEnd(m.eta);
		expect(tone(1, end)).toBe(0);
		expect(tone(m.ahead, end)).toBeCloseTo(1, 12);
		expect(tone(m.behind, end)).toBeCloseTo(-1, 12);
		expect(tone(100, end)).toBe(1);
	});

	it('keep a slow camera’s sky pale', () => {
		expect(scaleEnd(motion(0.01).eta)).toBe(END_FLOOR);
		expect(tone(motion(0.01).ahead, scaleEnd(motion(0.01).eta))).toBeCloseTo(0.1, 3);
	});

	it('are blue above 1 and red below', () => {
		expect(colour(0)).toBe('var(--sky-mid)');
		expect(colour(1)).toBe('color-mix(in srgb, var(--sky-blue) 100%, var(--sky-mid))');
		expect(colour(-0.5)).toBe('color-mix(in srgb, var(--sky-red) 50%, var(--sky-mid))');
	});
});

describe('the predictions', () => {
	it('open on the Stars sky at 0.9c, unanswered', () => {
		expect(OPENING).toEqual({ sky: 'stars', hundredths: 90 });
		expect(noteFirst(FIRST_START, OPENING.sky, OPENING.hundredths).done).toBe(false);
	});

	it('answer the first once the speed has been 0 and then 0.9c, on the Stars sky', () => {
		let s = FIRST_START;
		for (const n of [80, 50, 0]) s = noteFirst(s, 'stars', n);
		expect(s).toEqual({ rest: true, done: false });
		for (const n of [10, 50, 89]) s = noteFirst(s, 'stars', n);
		expect(s.done).toBe(false);
		s = noteFirst(s, 'stars', 90);
		expect(s.done).toBe(true);
		// and keep it
		expect(noteFirst(s, 'glow', 30)).toBe(s);
	});

	it('do not answer the first on another sky, nor at 0.9c without rest', () => {
		expect(noteFirst(FIRST_START, 'stars', 90).done).toBe(false);
		expect(noteFirst(FIRST_START, 'glow', 0).rest).toBe(false);
		const rested = noteFirst(FIRST_START, 'stars', 0);
		expect(noteFirst(rested, 'glow', 90).done).toBe(false);
	});

	it('answer the second only for a move to 0.6c with the second question open', () => {
		expect(noteSecond(false, 2, 'stars', 60, true)).toBe(true);
		expect(noteSecond(false, 2, 'glow', 60, true)).toBe(true);
		expect(noteSecond(false, 1, 'stars', 60, true)).toBe(false);
		expect(noteSecond(false, 2, 'stars', 60, false)).toBe(false);
		expect(noteSecond(false, 2, 'stars', 59, true)).toBe(false);
		expect(noteSecond(false, 2, 'sun', 60, true)).toBe(false);
		expect(noteSecond(true, 1, 'stars', 20, false)).toBe(true);
	});
});

describe('the words and the labels', () => {
	it('give three figures, and small numbers in powers of ten', () => {
		expect(three(0.9)).toBe('0.900');
		expect(three(2.2941573)).toBe('2.29');
		expect(three(0)).toBe('0');
		expect(three(-0.5)).toBe('−0.500');
		expect(three(9.933e-5)).toBe('9.93 × 10⁻⁵');
		expect(threeTex(9.933e-5)).toBe('9.93\\times10^{-5}');
		expect(threeTex(1.4722)).toBe('1.47');
	});

	it('keep labels off the dots and off each other', () => {
		const c = { x: 0, y: 0 };
		// dots fill the upper half of a ring of radius 50; the label goes below
		const dots = Array.from({ length: 60 }, (_, i) => ({
			x: 60 * Math.cos(Math.PI + (i / 59) * Math.PI),
			y: 60 * Math.sin(Math.PI + (i / 59) * Math.PI)
		}));
		const angles = Array.from({ length: 24 }, (_, k) => -Math.PI / 2 + (k * Math.PI) / 12);
		const [a, b] = placeLabels(
			dots,
			[
				{ r: 50, w: 30, h: 12 },
				{ r: 50, w: 30, h: 12 }
			],
			c,
			200,
			angles
		);
		expect(a.y).toBeGreaterThan(0);
		expect(b.y).toBeGreaterThan(0);
		expect(Math.abs(a.x - b.x) >= 32 || Math.abs(a.y - b.y) >= 14).toBe(true);
	});
});

describe('the labels near the rim', () => {
	it('go inside a ring that lies close to the rim, never across the rim or the ring', () => {
		const c = { x: 0, y: 0 };
		const angles = Array.from({ length: 24 }, (_, k) => -Math.PI / 2 + (k * Math.PI) / 12);
		const [a] = placeLabels([], [{ r: 185, w: 34, h: 15 }], c, 200, angles);
		// inside the ring: its far corners within 183 of the centre
		expect(Math.abs(a.y) + 7.5).toBeLessThan(185);
		expect(Math.hypot(Math.abs(a.x) + 17, Math.abs(a.y) + 7.5)).toBeLessThanOrEqual(183);
	});
});
