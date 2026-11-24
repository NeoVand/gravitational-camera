/**
 * Chapter 11.3's hole against a warm sky, against values found here by other means: the fixture's greybody factors
 * read afresh from its rows and checked at both ends (0 for long waves, Page's (256/225)x⁶ for ℓ = 2, and 1 for short
 * waves), the partial-wave sum added up here and set against the capture area 27πG²M²/c⁴, and the chapter's shadow
 * depths recomputed from the fixture by a quadrature of their own (Simpson's rule on a fine even grid, with the sky's
 * integral done numerically too, not from ζ), then the numbers the chapter prints.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GREYBODY, X } from './hole-against-sky-data';
import {
	DEGREES,
	MASS,
	M_EQ,
	OPENING,
	PAPER_MASSES,
	SHARE,
	SKY_LUMINANCE,
	STOPS,
	captureDiameter,
	depth,
	depthText,
	discGrey,
	drawnX,
	grey,
	greybodyAt,
	hawkingTemperature,
	holePeak,
	massAt,
	share,
	skyPeakWavelength,
	skyPeakX,
	spectrum,
	stopOf,
	tau,
	thermalMoment,
	thermalTail,
	ticks
} from './hole-against-sky';

/** The SI constants, written out afresh. */
const G_SI = 6.6743e-11;
const C_SI = 299792458;
const HBAR_SI = 1.054571817e-34;
const KB_SI = 1.380649e-23;
const M_SUN_SI = 1.98847e30;

// --- the fixture, read afresh ----------------------------------------------------------------------------------------

/** Γ_ℓ at the table's i-th x, from the rows as the fixture's own words describe them. */
function gamma(l: number, i: number): number {
	const row = GREYBODY.find((r) => r.l === l);
	if (!row) return 0;
	if (i < row.from) return 0;
	if (i >= row.from + row.values.length) return 1;
	return row.values[i - row.from];
}

/** The index of the table's x nearest v. */
const at = (v: number) => {
	let best = 0;
	X.forEach((x, i) => {
		if (Math.abs(x - v) < Math.abs(X[best] - v)) best = i;
	});
	return best;
};

/** σ_abs/27π(GM/c²)² at the table's i-th x: (π/x²) Σ (2ℓ + 1) Γ_ℓ over 27π. */
function partialWaves(i: number): number {
	let sum = 0;
	for (let l = 2; l <= 40; l++) sum += (2 * l + 1) * gamma(l, i);
	return ((Math.PI / X[i] ** 2) * sum) / (27 * Math.PI);
}

/** The sum at each of the table's x, once. */
const PW = X.map((_, i) => partialWaves(i));

/** The same at any x, a straight line between the table's points, 0 at x = 0 and 1 beyond the table. */
function sigmaShare(x: number): number {
	if (x <= 0) return 0;
	if (x > X[X.length - 1]) return 1;
	let lo = 0;
	let hi = X.length - 1;
	if (x <= X[0]) return (x / X[0]) * PW[0];
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (X[mid] <= x) lo = mid;
		else hi = mid;
	}
	return PW[lo] + ((x - X[lo]) / (X[hi] - X[lo])) * (PW[hi] - PW[lo]);
}

/** Simpson's rule for f on [a, b] with n (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, n: number): number {
	const h = (b - a) / n;
	let s = f(a) + f(b);
	for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * f(a + k * h);
	return (s * h) / 3;
}

/** 1/(e^z − 1). */
const n = (z: number) => 1 / Math.expm1(z);

/**
 * The depth recomputed here: Simpson on [0, 6] at a step of 0.0025 (each table interval split evenly), the capture
 * area beyond to where the sky has nothing left, and the sky's integral done the same way.
 */
function depthHere(mu: number, p: number): number {
	const aSky = (8 * Math.PI) / mu;
	const aHole = 8 * Math.PI;
	const f = (x: number) => (x === 0 ? 0 : sigmaShare(x) * (n(aSky * x) - n(aHole * x)) * x ** p);
	const g = (x: number) => (x === 0 ? 0 : n(aSky * x) * x ** p);
	const end = Math.max(6, 80 / aSky);
	const top = simpson(f, 0, 6, 2400) + simpson(f, 6, end, 20000);
	const bottom = simpson(g, 0, 6, 2400) + simpson(g, 6, end, 20000);
	return top / bottom;
}

/** A root of f between lo and hi, where f changes sign, by bisection. */
function bisect(f: (x: number) => number, lo: number, hi: number, steps = 60): number {
	let a = lo;
	let b = hi;
	const fa = f(a);
	for (let i = 0; i < steps; i++) {
		const m = (a + b) / 2;
		if (f(m) * fa > 0) a = m;
		else b = m;
	}
	return (a + b) / 2;
}

describe('the fixture', () => {
	it('holds 400 values of x, 0.01 to 2 in hundredths and 2.02 to 6 in fiftieths', () => {
		expect(X.length).toBe(400);
		for (let i = 0; i < 200; i++) expect(X[i]).toBeCloseTo((i + 1) / 100, 12);
		for (let i = 0; i < 200; i++) expect(X[200 + i]).toBeCloseTo(2.02 + i / 50, 12);
	});

	it('holds the degrees 2 to 33, each a stretch inside the table with values between 0 and 1', () => {
		expect(GREYBODY.map((r) => r.l)).toEqual(Array.from({ length: 32 }, (_, k) => k + 2));
		expect(DEGREES).toEqual(GREYBODY.map((r) => r.l));
		for (const r of GREYBODY) {
			expect(r.from).toBeGreaterThanOrEqual(0);
			expect(r.from + r.values.length).toBeLessThanOrEqual(400);
			for (const v of r.values) {
				expect(v).toBeGreaterThanOrEqual(0);
				expect(v).toBeLessThanOrEqual(1);
			}
		}
	});

	it('is read by the module as it says', () => {
		for (const l of [2, 3, 7, 20, 33, 34, 40])
			for (const i of [0, 50, 120, 250, 399]) expect(greybodyAt(l, i)).toBe(gamma(l, i));
	});

	it('is a size the page can carry', () => {
		const bytes = readFileSync('src/lib/tutorial/live/hole-against-sky-data.ts').length;
		expect(bytes).toBeLessThan(40_000);
	});
});

describe('the greybody factors', () => {
	it('vanish for long waves: every degree takes less than 10⁻¹¹ at x = 0.01', () => {
		for (let l = 2; l <= 40; l++) expect(gamma(l, 0)).toBeLessThan(1e-11);
		// and a degree is shut while x² is well under its barrier's top, about (ℓ + ½)²/27
		for (let l = 5; l <= 33; l++)
			expect(gamma(l, at((0.4 * (l + 0.5)) / Math.sqrt(27)))).toBeLessThan(1e-5);
	});

	it('tend to 1 for short waves: every degree to 28 takes all but 10⁻⁶ at x = 6', () => {
		for (let l = 2; l <= 28; l++) expect(gamma(l, 399)).toBeGreaterThan(1 - 1e-6);
		// and a degree is open once x² is well over its barrier's top
		for (let l = 2; l <= 20; l++)
			expect(gamma(l, at((1.6 * (l + 0.5)) / Math.sqrt(27)))).toBeGreaterThan(0.9999);
	});

	it('rise with x and fall with ℓ', () => {
		for (let l = 2; l <= 33; l++)
			for (let i = 1; i < 400; i++)
				expect(gamma(l, i)).toBeGreaterThanOrEqual(gamma(l, i - 1) - 1e-6);
		for (let l = 2; l < 33; l++)
			for (let i = 0; i < 400; i++) expect(gamma(l + 1, i)).toBeLessThanOrEqual(gamma(l, i) + 1e-6);
	});

	it('tend to Page’s (256/225)x⁶ for ℓ = 2: the chapter’s 1.07 at x = 0.01, falling toward 1', () => {
		const page = (x: number) => (256 / 225) * x ** 6;
		const ratio = (i: number) => gamma(2, i) / page(X[i]);
		expect(ratio(0)).toBeCloseTo(1.07, 2);
		// the ratio falls as x falls, and its straight line through x = 0.01 and 0.02 meets x = 0 near 1
		for (let i = 1; i < 10; i++) expect(ratio(i)).toBeGreaterThan(ratio(i - 1));
		const slope = (ratio(1) - ratio(0)) / (X[1] - X[0]);
		expect(ratio(0) - slope * X[0]).toBeCloseTo(1, 1);
		expect(Math.abs(ratio(0) - slope * X[0] - 1)).toBeLessThan(0.02);
		// the sixth power: from x = 0.01 to 0.02, Γ₂ grows about 2⁶ = 64-fold
		expect(Math.log(gamma(2, 1) / gamma(2, 0)) / Math.log(2)).toBeGreaterThan(5.9);
		expect(Math.log(gamma(2, 1) / gamma(2, 0)) / Math.log(2)).toBeLessThan(6.2);
	});

	it('give the chapter’s Γ₂: 3.1 × 10⁻⁶ at x = 0.1, 0.2% at 0.22 and 0.055 at 0.3', () => {
		expect(gamma(2, at(0.1)) / 1e-6).toBeCloseTo(3.1, 1);
		expect(100 * gamma(2, at(0.22))).toBeCloseTo(0.2, 1);
		expect(gamma(2, at(0.3))).toBeCloseTo(0.055, 3);
	});
});

describe('the partial-wave sum', () => {
	it('is the module’s σ_abs at every x of the table', () => {
		for (let i = 0; i < 400; i++) expect(SHARE[i]).toBeCloseTo(partialWaves(i), 12);
		for (const x of [0.005, 0.255, 1.234, 3.01, 5.99])
			expect(share(x)).toBeCloseTo(sigmaShare(x), 12);
	});

	it('tends to the capture area 27πG²M²/c⁴: within 4.5% of it beyond x = 1.5, and 1 on the average', () => {
		for (let i = at(1.5); i < 400; i++) expect(Math.abs(partialWaves(i) - 1)).toBeLessThan(0.045);
		const late = X.map((_, i) => i).filter((i) => X[i] >= 2);
		const mean = late.reduce((s, i) => s + partialWaves(i), 0) / late.length;
		expect(Math.abs(mean - 1)).toBeLessThan(0.01);
	});

	it('gives the chapter’s 0.76 at x = 0.5, 0.985 at 1.08, 1.004 at 1.65 and 0.970 at 1.94', () => {
		expect(partialWaves(at(0.5))).toBeCloseTo(0.76, 2);
		expect(partialWaves(at(1.08))).toBeCloseTo(0.985, 3);
		expect(partialWaves(at(1.65))).toBeCloseTo(1.004, 3);
		expect(partialWaves(at(1.94))).toBeCloseTo(0.97, 3);
	});

	it('is small for long waves, where ℓ = 2 alone matters', () => {
		const i = at(0.1);
		expect(partialWaves(i)).toBeCloseTo((5 * gamma(2, i)) / (27 * X[i] ** 2), 8);
		expect(partialWaves(i)).toBeLessThan(1e-4);
	});
});

describe('the depths', () => {
	it('recomputed here are the chapter’s by energy: 0.93, 0.54 and 0.29 at 10, 3 and 2 equilibrium masses', () => {
		expect(depthHere(10, 3)).toBeCloseTo(0.93, 2);
		expect(depthHere(3, 3)).toBeCloseTo(0.54, 2);
		expect(depthHere(2, 3)).toBeCloseTo(0.29, 2);
	});

	it('recomputed here are the chapter’s by count: 82%, 32% and 14%', () => {
		expect(Math.round(100 * depthHere(10, 2))).toBe(82);
		expect(Math.round(100 * depthHere(3, 2))).toBe(32);
		expect(Math.round(100 * depthHere(2, 2))).toBe(14);
	});

	it('recomputed here reach 99% at 27 times the equilibrium mass', () => {
		const mu = bisect((m) => depthHere(m, 3) - 0.99, 10, 60, 30);
		expect(Math.round(mu)).toBe(27);
	});

	it('are the module’s, to 10⁻⁴', () => {
		for (const mu of [0.3, 0.5, 1.5, 2, 3, 10, 27, 100])
			for (const p of [2, 3] as const)
				expect(
					Math.abs(depth(mu, 'gravitons', p === 3 ? 'energy' : 'count') - depthHere(mu, p))
				).toBeLessThan(1e-4);
	});

	it('vanish at the equilibrium mass, are negative below it and black far above it', () => {
		expect(Math.abs(depth(1, 'gravitons', 'energy'))).toBeLessThan(1e-12);
		expect(Math.abs(depth(1, 'gravitons', 'count'))).toBeLessThan(1e-12);
		expect(depth(0.5, 'gravitons', 'energy')).toBeLessThan(0);
		expect(depth(0.9, 'gravitons', 'count')).toBeLessThan(0);
		expect(depth(100, 'gravitons', 'energy')).toBeGreaterThan(0.999);
		expect(depth(300, 'gravitons', 'energy')).toBeLessThan(1);
		// by count paler than by energy, for every shadow
		for (const mu of [1.5, 2, 3, 10, 30])
			expect(depth(mu, 'gravitons', 'count')).toBeLessThan(depth(mu, 'gravitons', 'energy'));
	});

	it('against light, in geometric optics, are 1 − τ⁴ by energy and 1 − τ³ by count', () => {
		for (const mu of [0.3, 1, 2, 10]) {
			const t = tau(mu, 'light');
			expect(depth(mu, 'light', 'energy')).toBeCloseTo(1 - t ** 4, 12);
			expect(depth(mu, 'light', 'count')).toBeCloseTo(1 - t ** 3, 12);
		}
		const muLight = massAt(2.7255) / M_EQ;
		expect(Math.abs(depth(muLight, 'light', 'energy'))).toBeLessThan(1e-12);
	});
});

describe('the quadrature’s parts', () => {
	it('the sky’s integral is p! ζ(p + 1)/a^{p+1}', () => {
		for (const a of [0.1, 1, 8 * Math.PI])
			for (const p of [2, 3] as const) {
				const num = simpson((x) => (x === 0 ? 0 : x ** p * n(a * x)), 0, 80 / a, 40000);
				expect(thermalMoment(a, p) / num).toBeCloseTo(1, 8);
			}
	});

	it('the tail beyond c is the integral beyond c', () => {
		for (const [a, c] of [
			[0.1, 6],
			[1, 6],
			[8 * Math.PI, 6],
			[0.05, 2]
		])
			for (const p of [2, 3] as const) {
				const num = simpson((x) => x ** p * n(a * x), c, c + 80 / a, 40000);
				expect(thermalTail(a, c, p) / num).toBeCloseTo(1, 8);
			}
	});
});

describe('the hole', () => {
	it('has the chapter’s numbers: 1.356 × 10²³ kg at 0.905 K, 4.5 × 10²² kg at 2.7255 K, 6.2 × 10⁻⁸ K for the Sun', () => {
		const k = (HBAR_SI * C_SI ** 3) / (8 * Math.PI * G_SI * KB_SI);
		expect(M_EQ).toBeCloseTo(k / 0.905, -18);
		expect(M_EQ / 1e23).toBeCloseTo(1.356, 3);
		expect(massAt(2.7255) / 1e22).toBeCloseTo(4.5, 1);
		expect(hawkingTemperature(M_SUN_SI) / 1e-8).toBeCloseTo(6.17, 2);
		expect(hawkingTemperature(1.36e23)).toBeCloseTo(0.902, 3);
	});

	it('at twice the equilibrium mass has a capture disc 2.1 mm across; the sky peaks at x = 0.22 and 5.6 mm', () => {
		expect(captureDiameter(2) * 1e3).toBeCloseTo(2.1, 1);
		expect(skyPeakX(2, 'gravitons')).toBeCloseTo(0.22, 2);
		expect(skyPeakWavelength('gravitons') * 1e3).toBeCloseTo(5.6, 1);
	});
});

describe('the drawing', () => {
	it('draws areas in the ratio of the depth by energy', () => {
		for (const mu of [0.3, 0.5, 2, 3, 10]) {
			const pts = spectrum(mu, 'gravitons', 4000);
			let top = 0;
			let bottom = 0;
			for (let k = 1; k < pts.length; k++) {
				const h = pts[k].x - pts[k - 1].x;
				top += (h * (pts[k].removed + pts[k - 1].removed)) / 2;
				bottom += (h * (pts[k].sky + pts[k - 1].sky)) / 2;
			}
			// the sky beyond the drawn span holds 0.2% of its energy, and a hotter hole's span grows with it
			const D = depth(mu, 'gravitons', 'energy');
			expect(Math.abs(top / bottom - D)).toBeLessThan(0.004 * Math.max(1, Math.abs(D)));
		}
	});

	it('puts the sky’s peak at 1 and the hole’s at τ³', () => {
		for (const mu of [0.5, 2]) {
			const pts = spectrum(mu, 'gravitons', 6000);
			expect(Math.max(...pts.map((p) => p.sky))).toBeCloseTo(1, 4);
			const hole = Math.max(...pts.map((p) => p.hole));
			if (holePeak(mu, 'gravitons') < 1) expect(hole).toBeCloseTo(holePeak(mu, 'gravitons'), 4);
		}
		expect(drawnX(2, 'gravitons')).toBeCloseTo(12 / (4 * Math.PI), 12);
	});

	it('has ticks on 1, 2 or 5 times a power of ten', () => {
		expect(ticks(0.955)).toEqual([0, 0.2, 0.4, 0.6, 0.8]);
		expect(ticks(4.77)).toEqual([0, 1, 2, 3, 4]);
		expect(ticks(143)).toEqual([0, 50, 100]);
		expect(ticks(1.15, 3)).toEqual([0, 0.5, 1]);
		expect(ticks(42, 3)).toEqual([0, 20, 40]);
	});

	it('draws the disc as the sky where it vanishes, black where black, brighter where it glows', () => {
		expect(discGrey(0)).toBe(grey(SKY_LUMINANCE));
		expect(discGrey(1)).toBe('#000000');
		const level = (s: string) => parseInt(s.slice(1, 3), 16);
		expect(level(discGrey(-0.4))).toBeGreaterThan(level(discGrey(0)));
		expect(level(discGrey(0.3))).toBeLessThan(level(discGrey(0)));
		expect(discGrey(1 - 1 / SKY_LUMINANCE - 3)).toBe('#ffffff');
	});
});

describe('the controls', () => {
	it('run from 0.3 to 300 equilibrium masses, a hundredth of a power of ten apart, and open at 2', () => {
		expect(STOPS[0]).toBe(0.3);
		expect(STOPS[STOPS.length - 1]).toBe(300);
		for (let i = 1; i < STOPS.length; i++) {
			expect(STOPS[i]).toBeGreaterThan(STOPS[i - 1]);
			expect(STOPS[i] / STOPS[i - 1]).toBeLessThan(1.03);
		}
		for (const m of [...PAPER_MASSES, 1, 0.5, 100]) expect(STOPS[stopOf(m)]).toBe(m);
		expect(STOPS[OPENING.stop]).toBe(MASS.opening);
		expect(OPENING.sky).toBe('gravitons');
	});

	it('write the depth with a true minus and three decimals', () => {
		expect(depthText(0.29163)).toBe('0.292');
		expect(depthText(-0.4395)).toBe('−0.440');
		expect(depthText(-12.345)).toBe('−12.3');
		expect(depthText(-0.0001)).toBe('0.000');
	});
});

describe('the figure', () => {
	it('prints none of the try box’s answers', () => {
		const source = readFileSync('src/lib/tutorial/live/HoleAgainstSky.svelte', 'utf8');
		// the depth at twice the mass, where the hole vanishes, and where the shadow reaches 99%
		for (const answer of [
			'29%',
			'0.29',
			'0.293',
			'27 ',
			'27×',
			'99%',
			'0.99',
			'vanish',
			'invisible'
		])
			expect(source).not.toContain(answer);
		// and the slider does not mark the equilibrium mass
		expect(PAPER_MASSES).not.toContain(1);
		expect(PAPER_MASSES).not.toContain(27);
	});
});
