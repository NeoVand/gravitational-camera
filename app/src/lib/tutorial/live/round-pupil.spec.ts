/** Chapter 3.6's round opening: the Bessel functions, the two patterns, their widths, and the map's colours. */
import { describe, expect, it } from 'vitest';
import {
	A_REACH,
	J1_ZERO,
	K_REACH,
	OPENING,
	RADIUS,
	SWITCH,
	airy,
	besselJ0,
	besselJ1,
	doubledFrom,
	firstRing,
	firstZero,
	halfPoint,
	lookUp,
	oklab,
	pattern,
	radialTable,
	radiusOf,
	ramp,
	rungOf,
	sinc,
	snapRadius,
	srgb,
	type Rgb
} from './round-pupil';

/**
 * The definitions as averages over half a turn, by the midpoint rule, which for a smooth periodic integrand converges
 * faster than any power of the step: J₀(u) = (1/π) ∫₀^π cos(u cos φ) dφ (eq:j0) and J₁(u) = (1/π) ∫₀^π cos(φ − u sin φ) dφ.
 */
function average(f: (phi: number) => number, m = 512): number {
	let s = 0;
	for (let j = 0; j < m; j++) s += f(((j + 0.5) * Math.PI) / m);
	return s / m;
}
const j0ByIntegral = (u: number) => average((p) => Math.cos(u * Math.cos(p)));
const j1ByIntegral = (u: number) => average((p) => Math.cos(p - u * Math.sin(p)));

/** The largest x drawn: a corner of the map at the largest radius. */
const DRAWN = K_REACH * Math.SQRT2 * RADIUS.most;

describe('the Bessel functions', () => {
	it('agree with the angular averages to 1e-11 over everything drawn, on both sides of the switch', () => {
		let worst = 0;
		for (let i = 0; i <= 4000; i++) {
			const u = (i / 4000) * (DRAWN + 1);
			worst = Math.max(
				worst,
				Math.abs(besselJ0(u) - j0ByIntegral(u)),
				Math.abs(besselJ1(u) - j1ByIntegral(u))
			);
		}
		expect(DRAWN).toBeGreaterThan(SWITCH);
		expect(worst).toBeLessThan(1e-11);
	});

	it('meet without a step where the series hands over to the far form', () => {
		// across a step of 2 × 10⁻⁹ the functions change by their slope times the step, J₀′ = −J₁ and
		// J₁′ = J₀ − J₁/u, and by nothing more
		const d = 1e-9;
		const u = SWITCH;
		const jump0 = besselJ0(u + d) - besselJ0(u - d) + 2 * d * besselJ1(u);
		const jump1 = besselJ1(u + d) - besselJ1(u - d) - 2 * d * (besselJ0(u) - besselJ1(u) / u);
		expect(Math.abs(jump0)).toBeLessThan(1e-11);
		expect(Math.abs(jump1)).toBeLessThan(1e-11);
	});

	it('give the chapter’s numbers and the tables’ values', () => {
		// J₀(2.7) = −0.1424493701 (the chapter's ten terms of the series), J₁(2.7) = 0.44160
		expect(besselJ0(2.7)).toBeCloseTo(-0.142449370046012, 12);
		expect(besselJ1(2.7)).toBeCloseTo(0.441601379118253, 12);
		expect(besselJ1(0.01)).toBeCloseTo(0.00499993750026042, 15);
		expect(besselJ0(1)).toBeCloseTo(0.765197686557967, 12);
		expect(besselJ0(10)).toBeCloseTo(-0.245935764451348, 11);
		expect(besselJ1(10)).toBeCloseTo(0.0434727461688614, 11);
		expect(besselJ0(20)).toBeCloseTo(0.167024664340583, 11);
		expect(besselJ1(30)).toBeCloseTo(-0.118751062616623, 11);
		expect(besselJ0(0)).toBe(1);
		expect(besselJ1(0)).toBe(0);
	});

	it('are even and odd', () => {
		for (const u of [0.3, 2.7, 9, 15]) {
			expect(besselJ0(-u)).toBe(besselJ0(u));
			expect(besselJ1(-u)).toBe(-besselJ1(u));
		}
	});

	it('vanish at the chapter’s zeros: 2.4048, 5.5201 for J₀ and 3.8317, 7.0156 for J₁', () => {
		expect(Math.abs(besselJ0(2.40482555769577))).toBeLessThan(1e-12);
		expect(Math.abs(besselJ0(5.52007811028631))).toBeLessThan(1e-12);
		expect(Math.abs(besselJ1(7.01558666981562))).toBeLessThan(1e-12);
		expect(J1_ZERO).toBeCloseTo(3.83170597020751, 11);
		// J₀'s deepest trough, −0.403, lies at J₁'s first zero
		expect(besselJ0(J1_ZERO)).toBeCloseTo(-0.4028, 4);
	});

	it('obey J₁ = −J₀′ and the integral ∫₀ᵘ J₀(t) t dt = u J₁(u)', () => {
		// the five-point derivative, with a step large enough that rounding does not dominate
		const h = 1e-3;
		for (const u of [0.5, 2.7, 6, 11.9, 12.1, 20]) {
			const slope =
				(besselJ0(u - 2 * h) - 8 * besselJ0(u - h) + 8 * besselJ0(u + h) - besselJ0(u + 2 * h)) /
				(12 * h);
			expect(slope).toBeCloseTo(-besselJ1(u), 8);
		}
		// Simpson's rule on 2000 pieces; at u = 2.7 the chapter gives 1.19232
		const u = 2.7;
		const m = 2000;
		let s = 0;
		for (let i = 0; i <= m; i++) {
			const t = (i / m) * u;
			s += (i === 0 || i === m ? 1 : i % 2 ? 4 : 2) * besselJ0(t) * t;
		}
		const integral = (s * u) / (3 * m);
		expect(integral).toBeCloseTo(u * besselJ1(u), 10);
		expect(integral).toBeCloseTo(1.19232, 5);
	});
});

describe('the two patterns', () => {
	it('start at one and fall as the chapter says', () => {
		expect(airy(0)).toBe(1);
		expect(sinc(0)).toBe(1);
		expect(airy(1e-7)).toBeCloseTo(1, 12);
		expect(airy(2)).toBeCloseTo(besselJ1(2), 12);
		expect(pattern('disc', 'intensity', 2)).toBeCloseTo(airy(2) ** 2, 14);
		expect(pattern('slit', 'amplitude', 2)).toBeCloseTo(Math.sin(2) / 2, 14);
	});

	it('are first zero at 3.832 for the disc and π for the slit, 22% earlier', () => {
		expect(firstZero('disc')).toBeCloseTo(3.8317, 4);
		expect(firstZero('slit')).toBe(Math.PI);
		expect(firstZero('disc') / firstZero('slit')).toBeCloseTo(1.22, 2);
	});

	it('fall to one half at 2.2151 and 1.616 for the disc, and 1.896 for the slit’s amplitude', () => {
		expect(halfPoint('disc', 'amplitude')).toBeCloseTo(2.2151, 4);
		expect(halfPoint('disc', 'intensity')).toBeCloseTo(1.6163, 4);
		expect(halfPoint('slit', 'amplitude')).toBeCloseTo(1.8955, 4);
		expect(halfPoint('slit', 'intensity')).toBeCloseTo(1.3916, 4);
		for (const [shape, measure] of [
			['disc', 'amplitude'],
			['disc', 'intensity'],
			['slit', 'amplitude'],
			['slit', 'intensity']
		] as const)
			expect(pattern(shape, measure, halfPoint(shape, measure))).toBeCloseTo(0.5, 12);
	});

	it('give full widths at half height of 4.43 and 3.23 in units of 1/R: the amplitude 1.37 times as wide', () => {
		const amp = 2 * halfPoint('disc', 'amplitude');
		const int = 2 * halfPoint('disc', 'intensity');
		expect(amp.toFixed(2)).toBe('4.43');
		expect(int.toFixed(2)).toBe('3.23');
		expect((amp / int).toFixed(2)).toBe('1.37');
		// the slit's amplitude has chapter 3.5's width, 3.79
		expect((2 * halfPoint('slit', 'amplitude')).toFixed(2)).toBe('3.79');
	});

	it('ring to −0.132 at 5.136 for the disc, 1.75% in intensity, and to −0.217 at 4.493 for the slit', () => {
		const disc = firstRing('disc');
		expect(disc.x).toBeCloseTo(5.136, 3);
		expect(disc.amplitude).toBeCloseTo(-0.1323, 4);
		expect((100 * disc.amplitude ** 2).toFixed(2)).toBe('1.75');
		const slit = firstRing('slit');
		expect(slit.x).toBeCloseTo(4.4934, 4);
		expect(slit.amplitude).toBeCloseTo(-0.2172, 4);
	});

	it('halve their widths, in m⁻¹, when the radius doubles', () => {
		const zeroAt = (r: number) => firstZero('disc') / r;
		expect(zeroAt(2) / zeroAt(1)).toBe(0.5);
		expect(zeroAt(1)).toBeCloseTo(3.83, 2);
		expect(zeroAt(2)).toBeCloseTo(1.92, 2);
	});
});

describe('the map’s table', () => {
	it('looks values up to within 1e-5 of the pattern, and gives zero beyond its reach', () => {
		const reach = DRAWN;
		const table = radialTable('disc', 'amplitude', reach, 4096);
		let worst = 0;
		for (let i = 0; i <= 999; i++) {
			const x = (i / 999) * reach * 0.999;
			worst = Math.max(worst, Math.abs(lookUp(table, reach, x) - airy(x)));
		}
		expect(worst).toBeLessThan(1e-5);
		expect(lookUp(table, reach, reach + 1)).toBe(0);
		expect(lookUp(table, reach, -1)).toBeCloseTo(airy(1), 5);
	});
});

describe('the slider and the second prediction', () => {
	it('runs from 0.5 to 2 m and opens on the disc’s amplitude at 1 m', () => {
		expect(OPENING).toEqual({ shape: 'disc', measure: 'amplitude', radius: 1 });
		expect(rungOf(RADIUS.least)).toBe(10);
		expect(rungOf(RADIUS.most)).toBe(40);
		expect(radiusOf(23)).toBe(1.15);
		expect(snapRadius(0.1)).toBe(0.5);
		expect(snapRadius(1.0249)).toBe(1);
		expect(snapRadius(9)).toBe(2);
		// the largest disc fits in the opening's panel
		expect(A_REACH).toBeGreaterThan(RADIUS.most);
	});

	it('recognizes a doubling of a radius visited before, and nothing else', () => {
		const visited = new Set([rungOf(1)]);
		expect(doubledFrom(visited, 2)).toBe(1);
		expect(doubledFrom(visited, 1.9)).toBeUndefined();
		expect(doubledFrom(visited, 0.5)).toBeUndefined();
		visited.add(rungOf(0.65));
		expect(doubledFrom(visited, 1.3)).toBe(0.65);
	});
});

describe('the colours', () => {
	it('go to OKLab and back unchanged', () => {
		for (const c of [
			[232, 164, 90],
			[143, 182, 221],
			[24, 18, 12],
			[244, 238, 226]
		] as Rgb[]) {
			const back = srgb(oklab(c));
			for (let i = 0; i < 3; i++) expect(back[i]).toBeCloseTo(c[i], 1);
		}
		expect(oklab([255, 255, 255])[0]).toBeCloseTo(1, 4);
	});

	it('change lightness evenly with the value, from the ground at zero to each end', () => {
		const zero: Rgb = [17, 13, 8];
		const positive: Rgb = [232, 164, 90];
		const negative: Rgb = [143, 182, 221];
		const colour = ramp(zero, positive, negative);
		const lightness = (v: number) => oklab(colour(v))[0];
		const L0 = oklab(zero)[0];
		const L1 = oklab(positive)[0];
		for (const v of [0, 0.25, 0.5, 0.75, 1])
			expect(lightness(v)).toBeCloseTo(L0 + v * (L1 - L0), 3);
		expect(colour(0)).toEqual(srgb(oklab(zero)));
		expect(oklab(colour(-1))[0]).toBeCloseTo(oklab(negative)[0], 4);
		expect(colour(3)).toEqual(colour(1));
	});
});
