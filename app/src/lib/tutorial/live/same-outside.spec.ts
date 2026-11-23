/** The live figure "same outside": bodies that pull alike outside, and the ∫ρ r² dV that tells them apart. */
import { describe, expect, it } from 'vitest';
import {
	BANDS,
	BALL_SECOND_MOMENT,
	EARTH_CORE_DENSITY,
	EARTH_CORE_KM,
	EARTH_MANTLE_DENSITY,
	EARTH_MEAN_DENSITY,
	EARTH_RADIUS_KM,
	EQUIPOTENTIALS,
	GOLD_NAMES,
	ROUND,
	ROUND_NAMES,
	S_MOST,
	S_PAPER,
	band,
	densities,
	flushDensity,
	flushPaths,
	flushSeries,
	flushTop,
	goldInertia,
	goldPotential,
	goldRelative,
	goldSecondMoment,
	inertia,
	isUniform,
	kickEnergy,
	kickRelative,
	massWithin,
	pull,
	roundName,
	secondMoment,
	skinDensity,
	skinPaths,
	skinTop,
	tremorFactor,
	tremorRelative,
	type Layered
} from './same-outside';

/** ∫ f from a to b by Gauss–Legendre on n panels of five points: exact for the polynomials, close for the rest. */
function gauss(f: (x: number) => number, a: number, b: number, n = 200) {
	const xs = [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664];
	const ws = [
		0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891,
		0.2369268850561891
	];
	const h = (b - a) / n;
	let sum = 0;
	for (let i = 0; i < n; i++) {
		const m = a + (i + 0.5) * h;
		for (let k = 0; k < 5; k++) sum += ws[k] * f(m + (xs[k] * h) / 2);
	}
	return (sum * h) / 2;
}

/** The Legendre polynomial P_ℓ(x). */
function legendre(l: number, x: number) {
	let p0 = 1;
	let p1 = x;
	if (l === 0) return 1;
	for (let k = 1; k < l; k++) [p0, p1] = [p1, ((2 * k + 1) * x * p1 - k * p0) / (k + 1)];
	return p1;
}

/** ∫ over the ball of (ρ̂/4π) g(r, cos θ) dV for an axisymmetric density ρ̂ in units of m/4πR³. */
function overBall(rho: (r: number, c: number) => number, g: (r: number, c: number) => number) {
	return gauss(
		(r) => gauss((c) => 2 * Math.PI * r * r * (rho(r, c) / (4 * Math.PI)) * g(r, c), -1, 1, 80),
		0,
		1,
		80
	);
}

/** ∫ over the unit sphere of (σ̂/4π) g(cos θ) dA for a surface density σ̂ in units of m/4πR². */
function overSphere(sigma: (c: number) => number, g: (c: number) => number) {
	return gauss((c) => 2 * Math.PI * (sigma(c) / (4 * Math.PI)) * g(c), -1, 1, 800);
}

const bodies: Layered[] = [
	...ROUND_NAMES.map((n) => ROUND[n].body),
	{ a: 0, f: 0 },
	{ a: 0, f: 0.3 },
	{ a: 0.3, f: 0.9 },
	{ a: 0.7, f: 0.1 },
	{ a: 1, f: 0.4 },
	{ a: 1, f: 1 }
];

describe('the round bodies', () => {
	it('pull alike outside: GM/r², a quarter of the surface pull at 2R', () => {
		for (const b of bodies) {
			expect(pull(2, b)).toBe(0.25);
			for (const r of [1, 1.2, 1.7, 2.5, 3]) expect(pull(r, b)).toBe(1 / (r * r));
			expect(massWithin(1, b)).toBe(1);
		}
	});

	it('have the mass within r that their two densities give', () => {
		for (const b of bodies.filter((b) => b.a > 0 && b.a < 1)) {
			const { core, mantle } = densities(b);
			for (const r of [0.2, 0.5, 0.8, 0.999]) {
				// ρ in units of the mean density 3M/4πR³, so the mass within r is 3 ∫ ρ r² dr
				const m =
					3 * gauss((x) => core * x * x, 0, Math.min(r, b.a), 50) +
					(r > b.a ? 3 * gauss((x) => mantle * x * x, b.a, r, 50) : 0);
				expect(m).toBeCloseTo(massWithin(r, b), 12);
			}
		}
	});

	it('pull inside as the mass within them gives: GM r/R³ in the uniform ball, nothing in the shell', () => {
		for (const r of [0, 0.25, 0.6, 0.95]) expect(pull(r, ROUND.ball.body)).toBeCloseTo(r, 14);
		for (const r of [0, 0.3, 0.999]) expect(pull(r, ROUND.shell.body)).toBe(0);
		expect(pull(0, { a: 0, f: 0.3 })).toBe(Infinity);
		expect(pull(0.1, { a: 0, f: 0.3 })).toBeGreaterThan(30);
		// continuous at the core's surface
		const b = ROUND.cored.body;
		expect(pull(0.4 - 1e-9, b)).toBeCloseTo(pull(0.4 + 1e-9, b), 6);
		expect(pull(0.4, b)).toBeCloseTo(0.5 / 0.16, 12);
	});

	it('have ∫ρ r² dV equal to the integral of their densities', () => {
		for (const b of bodies.filter((b) => b.a > 0 && b.a < 1)) {
			const { core, mantle } = densities(b);
			const J =
				3 * gauss((x) => core * x ** 4, 0, b.a, 400) +
				3 * gauss((x) => mantle * x ** 4, b.a, 1, 400);
			expect(J).toBeCloseTo(secondMoment(b), 12);
		}
		// a point at the centre and a skin at the surface
		expect(secondMoment({ a: 0, f: 1 })).toBe(0);
		expect(secondMoment({ a: 1, f: 0 })).toBe(1);
		expect(secondMoment({ a: 1, f: 0.4 })).toBeCloseTo(0.4 * 0.6 + 0.6, 14);
	});

	it('are the uniform ball whenever f = a³, with 3/5 MR² and I = 2/5 MR²', () => {
		for (const a of [0, 0.2, 0.5, 0.9, 1]) {
			const b = { a, f: a ** 3 };
			expect(isUniform(b)).toBe(true);
			expect(roundName(b)).toBe('ball');
			expect(secondMoment(b)).toBeCloseTo(0.6, 14);
			expect(inertia(b)).toBeCloseTo(0.4, 14);
			expect(kickRelative(b)).toBeCloseTo(1, 14);
		}
		expect(BALL_SECOND_MOMENT).toBe(0.6);
	});

	it('read out the card’s numbers: 0.400, 0.616, 0.243 (0.365 MR²) and 0.331', () => {
		expect(inertia(ROUND.ball.body).toFixed(3)).toBe('0.400');
		expect(inertia(ROUND['hair-shell'].body).toFixed(3)).toBe('0.616');
		expect(inertia(ROUND.cored.body).toFixed(3)).toBe('0.243');
		expect(secondMoment(ROUND.cored.body).toFixed(3)).toBe('0.365');
		expect(inertia(ROUND.earth.body).toFixed(3)).toBe('0.331');
		expect(inertia(ROUND.earth.body).toFixed(4)).toBe('0.3307');
		expect(inertia(ROUND.shell.body)).toBe(2 / 3);
		// fig:hair's bars: 0.60, 0.92 and 0.37 MR²
		expect(secondMoment(ROUND.ball.body).toFixed(2)).toBe('0.60');
		expect(secondMoment(ROUND['hair-shell'].body).toFixed(2)).toBe('0.92');
		expect(secondMoment(ROUND.cored.body).toFixed(2)).toBe('0.37');
		// the cored ball's kick, the card's practice problem: 0.61 of the ball's
		expect(kickRelative(ROUND.cored.body).toFixed(2)).toBe('0.61');
	});

	it('give the paper’s two-layer Earth', () => {
		const e = ROUND.earth.body;
		expect(e.a).toBeCloseTo(0.5462, 4);
		expect(EARTH_CORE_KM / EARTH_RADIUS_KM).toBe(e.a);
		expect(Math.round(EARTH_MEAN_DENSITY)).toBe(5511);
		// the model's mass is the real 5.972e24 kg to 0.05 per cent
		expect(Math.abs(EARTH_MEAN_DENSITY / 5513 - 1)).toBeLessThan(5e-4);
		const { core, mantle } = densities(e);
		expect(core * EARTH_MEAN_DENSITY).toBeCloseTo(EARTH_CORE_DENSITY, 8);
		expect(mantle * EARTH_MEAN_DENSITY).toBeCloseTo(EARTH_MANTLE_DENSITY, 8);
		expect(roundName(e)).toBe('earth');
		// the core holds 37 per cent of the mass
		expect(e.f.toFixed(3)).toBe('0.370');
	});

	it('give a thin shell 5/3 of the ball’s kick and tremor: the ratio 3 : 5', () => {
		expect(kickRelative(ROUND.shell.body)).toBeCloseTo(5 / 3, 14);
		expect(tremorRelative(ROUND.shell.body)).toBeCloseTo(5 / 3, 14);
		expect(kickEnergy(ROUND.ball.body) / kickEnergy(ROUND.shell.body)).toBeCloseTo(3 / 5, 14);
		for (const b of bodies) expect(tremorRelative(b)).toBe(kickRelative(b));
	});

	it('take from the kick ½k²∫ρ(x² + y²) dV, which is (k²/3)∫ρ r² dV for a round body', () => {
		// a thin shell of radius r: x² + y² averages (2/3) r² over it
		const avg = gauss((c) => (1 - c * c) / 2, -1, 1, 10);
		expect(avg).toBeCloseTo(2 / 3, 14);
		for (const b of bodies.filter((b) => b.a > 0 && b.a < 1)) {
			const { core, mantle } = densities(b);
			const k = 1.7;
			const direct =
				0.5 *
				k *
				k *
				3 *
				(gauss((x) => core * x ** 4 * avg, 0, b.a, 200) +
					gauss((x) => mantle * x ** 4 * avg, b.a, 1, 200));
			expect(direct).toBeCloseTo(kickEnergy(b, k), 12);
		}
	});

	it('have quadrupole tremors that go as ∫ρ r² dV: Σ_m |∇(r² Y_2m)|² = (25/2π) r²', () => {
		expect(tremorFactor(2)).toBeCloseTo(25 / (2 * Math.PI), 14);
		const c1 = 0.5 * Math.sqrt(15 / Math.PI);
		const c0 = 0.25 * Math.sqrt(5 / Math.PI);
		const c2 = 0.25 * Math.sqrt(15 / Math.PI);
		// the gradients of the five real solid harmonics r² Y_2m
		const grads = (x: number, y: number, z: number) => [
			[c1 * y, c1 * x, 0],
			[0, c1 * z, c1 * y],
			[c1 * z, 0, c1 * x],
			[-2 * c0 * x, -2 * c0 * y, 4 * c0 * z],
			[2 * c2 * x, -2 * c2 * y, 0]
		];
		for (const [x, y, z] of [
			[0.3, -0.2, 0.7],
			[1, 0, 0],
			[-0.4, 0.9, 0.1]
		]) {
			const sum = grads(x, y, z).reduce((s, g) => s + g[0] ** 2 + g[1] ** 2 + g[2] ** 2, 0);
			expect(sum).toBeCloseTo(tremorFactor(2) * (x * x + y * y + z * z), 12);
		}
	});

	it('name the presets, and the shell is the most a body can have', () => {
		for (const n of ROUND_NAMES) expect(roundName(ROUND[n].body)).toBe(n);
		expect(roundName({ a: 0.6, f: 0.2 })).toBeUndefined();
		for (const b of bodies) {
			expect(secondMoment(b)).toBeGreaterThanOrEqual(0);
			expect(secondMoment(b)).toBeLessThanOrEqual(1 + 1e-15);
		}
		// moving the mass out raises it
		expect(secondMoment({ a: 0.5, f: 0.1 })).toBeGreaterThan(secondMoment({ a: 0.5, f: 0.4 }));
	});
});

describe('the gold: a nugget, its flush and its skin', () => {
	it('sums the paper’s series for the flush', () => {
		for (const s of [0.2, S_PAPER, 0.7])
			for (const r of [0, 0.4, 0.8, 1])
				for (const c of [-1, -0.3, 0.5, 1])
					expect(flushDensity(r, c, s)).toBeCloseTo(flushSeries(r, c, s), 10);
	});

	it('is 46 m/4πR³ at the near wall and dips just below zero at the far wall, for s = R/2', () => {
		expect(flushTop(S_PAPER)).toBeCloseTo(46, 12);
		const far = flushDensity(1, -1, S_PAPER);
		expect(far).toBeLessThan(0);
		expect(far).toBeGreaterThan(-0.1);
		// fifteen times the nugget's mass spread evenly, 3 m/4πR³
		expect(Math.round(flushTop(S_PAPER) / 3)).toBe(15);
		// the gold spread evenly when the nugget is at the centre
		for (const [r, c] of [
			[0.3, 0.2],
			[1, -1]
		])
			expect(flushDensity(r, c, 0)).toBe(3);
	});

	it('gives the skin 6 m/4πR² over the nugget, for s = R/2', () => {
		expect(skinTop(S_PAPER)).toBeCloseTo(6, 14);
		expect(skinDensity(1, 0)).toBe(1);
	});

	it('gives the three the same mass and the same moments r^ℓ P_ℓ, so the same field outside', () => {
		for (const s of [0.25, S_PAPER, 0.7]) {
			for (let l = 0; l <= 6; l++) {
				const flush = overBall(
					(r, c) => flushDensity(r, c, s),
					(r, c) => r ** l * legendre(l, c)
				);
				const skin = overSphere(
					(c) => skinDensity(c, s),
					(c) => legendre(l, c)
				);
				// the nugget's own moment
				expect(flush).toBeCloseTo(s ** l, 8);
				expect(skin).toBeCloseTo(s ** l, 8);
			}
		}
	});

	it('has the potential −Gm/|x − s| outside, the same for the three', () => {
		// the axisymmetric exterior potential is Σ q_ℓ P_ℓ/r^(ℓ+1), with q_ℓ = s^ℓ as tested above
		for (const [x, y] of [
			[1.3, 0.4],
			[-1.1, 0.8],
			[0.2, -1.5]
		]) {
			const r = Math.hypot(x, y);
			let series = 0;
			for (let l = 0; l < 120; l++) series -= (S_PAPER ** l * legendre(l, x / r)) / r ** (l + 1);
			expect(goldPotential(x, y, 0, S_PAPER)).toBeCloseTo(series, 12);
		}
		// the equipotentials are circles about the nugget, wider each step out, and some part of each is outside
		for (let i = 1; i < EQUIPOTENTIALS.length; i++)
			expect(EQUIPOTENTIALS[i]).toBeGreaterThan(EQUIPOTENTIALS[i - 1]);
		expect(EQUIPOTENTIALS[0] + S_MOST).toBeGreaterThan(1);
	});

	it('has ∫ρ r² dV = m s², 3/5 mR² and mR²', () => {
		for (const s of [0, 0.3, S_PAPER, 0.75]) {
			expect(goldSecondMoment('nugget', s)).toBeCloseTo(s * s, 15);
			const flush = overBall(
				(r, c) => flushDensity(r, c, s),
				(r) => r * r
			);
			expect(flush).toBeCloseTo(0.6, 8);
			expect(goldSecondMoment('flush', s)).toBe(0.6);
			const skin = overSphere(
				(c) => skinDensity(c, s),
				() => 1
			);
			expect(skin).toBeCloseTo(1, 8);
			expect(goldSecondMoment('skin', s)).toBe(1);
		}
	});

	it('gives the gold’s shares of the moment of inertia, 0.25, 0.483 and 0.75 mR² at s = R/2', () => {
		expect(goldInertia('nugget', S_PAPER)).toBeCloseTo(0.25, 15);
		expect(goldInertia('flush', S_PAPER)).toBeCloseTo(0.4 + 1 / 12, 15);
		expect(goldInertia('flush', S_PAPER).toFixed(3)).toBe('0.483');
		expect(goldInertia('skin', S_PAPER)).toBeCloseTo(0.75, 15);
		// directly: about an axis across the nugget's line, ∫ρ (r² − x²) dV with x across, ½ r² sin²θ on average
		for (const s of [0.3, S_PAPER, 0.7]) {
			const across = (r: number, c: number) => r * r - (r * r * (1 - c * c)) / 2;
			const flush = overBall((r, c) => flushDensity(r, c, s), across);
			expect(flush).toBeCloseTo(goldInertia('flush', s), 8);
			const skin = overSphere(
				(c) => skinDensity(c, s),
				(c) => across(1, c)
			);
			expect(skin).toBeCloseTo(goldInertia('skin', s), 8);
			// the nugget lies on the line, at the distance s from the axis
			expect(goldInertia('nugget', s)).toBeCloseTo(s * s, 14);
		}
	});

	it('gives the kicks and the tremors in the ratios of ∫ρ r² dV, the skin 5/3 of the flush', () => {
		expect(goldRelative('flush', S_PAPER)).toBe(1);
		expect(goldRelative('skin', S_PAPER)).toBeCloseTo(5 / 3, 14);
		expect(goldRelative('nugget', S_PAPER)).toBeCloseTo(5 / 12, 14);
		expect(goldRelative('nugget', 0)).toBe(0);
		for (const k of GOLD_NAMES) expect(goldRelative(k, 0.4)).toBeGreaterThanOrEqual(0);
	});
});

describe('the drawing', () => {
	it('shades in bands that each halve the density', () => {
		expect(band(46, 46)).toBe(0);
		expect(band(23.01, 46)).toBe(0);
		expect(band(23, 46)).toBe(1);
		expect(band(46 / 2 ** BANDS, 46)).toBe(-1);
		expect(band(46 / 2 ** BANDS + 1e-9, 46)).toBe(BANDS - 1);
		expect(band(-0.07, 46)).toBe(-1);
		expect(band(0, 46)).toBe(-1);
	});

	it('draws the flush densest at the near wall, and the skin densest over the nugget', () => {
		const flush = flushPaths(S_PAPER, 32);
		expect(flush).toHaveLength(BANDS);
		expect(flush[0].length).toBeGreaterThan(0);
		// the densest squares are on the nugget's side, x > 0
		const xs = [...flush[0].matchAll(/M(-?[\d.]+) /g)].map((m) => Number(m[1]));
		expect(Math.min(...xs)).toBeGreaterThan(0.3);
		const skin = skinPaths(S_PAPER);
		expect(skin).toHaveLength(BANDS);
		const sx = [...skin[0].matchAll(/M(-?[\d.]+) /g)].map((m) => Number(m[1]));
		expect(Math.min(...sx)).toBeGreaterThan(0.8);
		// the gold spread evenly is one band all over
		expect(
			flushPaths(0, 16)
				.slice(1)
				.every((p) => p === '')
		).toBe(true);
		expect(
			skinPaths(0)
				.slice(1)
				.every((p) => p === '')
		).toBe(true);
	});
});
