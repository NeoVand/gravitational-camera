/**
 * Chapter 11.4's friction of a horizon, against values found here by other means: the greybody factor read afresh
 * from the fixture's rows and set against Page's (256/225)x⁶ and the chapter's ratios, the response Im χ worked out
 * in SI units from 5c⁵Γ₂/16Gω⁵ and νω, ν from both of the paper's forms, the turning tide's 𝓔̇:𝓔̇ by differentiating
 * the tide itself numerically, and the power and the pair's waves from their own formulas; then the words.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GREYBODY, X } from './hole-against-sky-data';
import {
	DISTANCE,
	LOW,
	MASS,
	MOON_MASS,
	PAGE,
	PAGE_TOP,
	PEAK,
	SPAN,
	TABLE_START,
	friction,
	gamma2,
	imChi,
	law,
	lengthTex,
	moonPlace,
	numTex,
	numText,
	orbit,
	overPage,
	page,
	schwarzschild,
	tableX,
	tideX
} from './tidal-friction';

/** The SI constants, written out afresh. */
const G_SI = 6.6743e-11;
const C_SI = 299792458;
const M_SUN_SI = 1.98847e30;

/** Γ₂ at the table's i-th x, from the rows as the fixture's own words describe them. */
function rowGamma(i: number): number {
	const row = GREYBODY.find((r) => r.l === 2)!;
	if (i < row.from) return 0;
	if (i >= row.from + row.values.length) return 1;
	return row.values[i - row.from];
}

const at = (v: number) => X.findIndex((x) => Math.abs(x - v) < 1e-9);

/** Two significant figures. */
const two = (v: number) => Number(v.toPrecision(2));
const three = (v: number) => Number(v.toPrecision(3));

describe('Page’s line and the exact Γ₂', () => {
	it('Page’s coefficient is (16/5)(16/45)', () => {
		expect(PAGE).toBeCloseTo((16 / 5) * (16 / 45), 14);
		expect(page(0.1)).toBeCloseTo(1.1378e-6, 9);
		expect(PAGE_TOP ** 6 * PAGE).toBeCloseTo(1, 12);
	});

	it('meets the table at its own points', () => {
		for (const v of [0.01, 0.02, 0.1, 0.39, 0.5])
			expect(gamma2(v) / rowGamma(at(v))).toBeCloseTo(1, 12);
	});

	it('is 1.070 times Page’s at x = 0.01 and 2.7 times at x = 0.1 (the chapter), with Γ₂(0.1) = 3.1 × 10⁻⁶', () => {
		expect(three(overPage(0.01))).toBe(1.07);
		expect(overPage(0.01).toFixed(3)).toBe('1.070');
		expect(two(overPage(0.1))).toBe(2.7);
		expect(two(gamma2(0.1))).toBe(3.1e-6);
		// "at x = 0.01 the hole absorbs about 1.2 × 10⁻¹²", and Γ₂ = 0.98 at x = 0.5
		expect(two(gamma2(0.01))).toBe(1.2e-12);
		expect(two(gamma2(0.5))).toBe(0.98);
	});

	it('below the table, meets the solver’s 1.013 at x = 0.002 and 1.033 at 0.005, its excess near 2πx', () => {
		expect(overPage(0.002).toFixed(3)).toBe('1.013');
		expect(overPage(0.005).toFixed(3)).toBe('1.033');
		expect(Math.abs(LOW.a / (2 * Math.PI) - 1)).toBeLessThan(0.01);
		// continuous where the table starts, and Page's form in the limit
		expect(gamma2(TABLE_START * (1 - 1e-12))).toBeCloseTo(gamma2(TABLE_START), 20);
		expect(overPage(1e-7)).toBeCloseTo(1, 5);
	});

	it('rises steadily to 1 and stays there', () => {
		let last = 0;
		for (let x = 1e-4; x < 2; x *= 1.05) {
			const g = gamma2(x);
			expect(g).toBeGreaterThanOrEqual(last);
			expect(g).toBeLessThanOrEqual(1);
			last = g;
		}
		expect(gamma2(1)).toBe(1);
	});

	it('draws its computed curve on the table’s points up to 1', () => {
		const xs = tableX(1);
		expect(xs[0]).toBe(0.01);
		expect(xs.at(-1)).toBeLessThanOrEqual(1);
		expect(xs.length).toBeGreaterThan(70);
	});
});

describe('the response Im χ', () => {
	it('is 5c⁵Γ₂/16Gω⁵ in units of M r_s²(GM/c³)², and its law is νω', () => {
		const M = 10 * M_SUN_SI;
		const rs = (2 * G_SI * M) / C_SI ** 2;
		const unit = M * rs ** 2 * ((G_SI * M) / C_SI ** 3) ** 2;
		const nu = (M * rs ** 5) / (90 * C_SI ** 3);
		for (const x of [0.003, 0.05, 0.2, 0.39]) {
			const w = (x * C_SI ** 3) / (G_SI * M);
			expect(imChi(x) / ((5 * C_SI ** 5 * gamma2(x)) / (16 * G_SI * w ** 5) / unit)).toBeCloseTo(
				1,
				9
			);
			expect(law(x) / ((nu * w) / unit)).toBeCloseTo(1, 9);
		}
	});

	it('is the friction law for long waves', () => {
		expect(imChi(1e-6) / law(1e-6)).toBeCloseTo(1, 4);
		expect(imChi(0.1) / law(0.1)).toBeCloseTo(overPage(0.1), 12);
	});

	it('peaks at x = 0.39, at 150 times the law', () => {
		expect(PEAK.x).toBe(0.39);
		expect(two(PEAK.times)).toBe(150);
		// a fine scan of the curve finds no higher point
		for (let x = 0.2; x < 0.7; x += 0.0005)
			expect(imChi(x)).toBeLessThanOrEqual(PEAK.value * (1 + 1e-12));
	});
});

describe('the hole and its moon', () => {
	it('has ν = (16/45)G⁵M⁶/c¹³ = M r_s⁵/90c³: 1.9 × 10⁻²³ J s⁵ at 1.36 × 10²³ kg, 1.8 × 10²⁶ at 10 M_⊙, 1.3 × 10²⁹ at 30', () => {
		for (const M of [1.36e23, 10 * M_SUN_SI, 1e9 * M_SUN_SI]) {
			const rs = (2 * G_SI * M) / C_SI ** 2;
			expect(friction(M) / ((M * rs ** 5) / (90 * C_SI ** 3))).toBeCloseTo(1, 10);
		}
		expect(three(friction(1.36e23))).toBe(1.89e-23);
		expect(two(friction(10 * M_SUN_SI))).toBe(1.8e26);
		expect(two(friction(30 * M_SUN_SI))).toBe(1.3e29);
		expect(schwarzschild(10 * M_SUN_SI)).toBeCloseTo(29533, -1);
	});

	it('feels a turning tide with 𝓔̇:𝓔̇ = 18Ω²(Gm/d³)², found by differentiating the tide', () => {
		const o = orbit(10 * M_SUN_SI, 30);
		const k = (G_SI * MOON_MASS) / o.d ** 3;
		const tide = (t: number) => {
			const n = [Math.cos(o.omega * t), Math.sin(o.omega * t), 0];
			return n.map((ni, i) => n.map((nj, j) => k * ((i === j ? 1 : 0) - 3 * ni * nj)));
		};
		const h = 1e-6 / o.omega;
		const a = tide(0.37 / o.omega + h);
		const b = tide(0.37 / o.omega - h);
		let sum = 0;
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) sum += ((a[i][j] - b[i][j]) / (2 * h)) ** 2;
		expect(o.rate / sum).toBeCloseTo(1, 6);
	});

	it('gives the power (32/5)G⁸M⁷m²/c¹³d⁹ and a ratio to the waves of (GM/c²d)⁴ = 1/16n⁴', () => {
		for (const [mu, n] of [
			[1, 3],
			[10, 30],
			[4e6, 500],
			[1e9, 1e4]
		]) {
			const M = mu * M_SUN_SI;
			const o = orbit(M, n);
			const d = (n * 2 * G_SI * M) / C_SI ** 2;
			const P = ((32 / 5) * G_SI ** 8 * M ** 7 * MOON_MASS ** 2) / (C_SI ** 13 * d ** 9);
			expect(o.power / P).toBeCloseTo(1, 9);
			expect(o.ratio * 16 * n ** 4).toBeCloseTo(1, 9);
			expect(o.ratio / ((G_SI * M) / (C_SI ** 2 * d)) ** 4).toBeCloseTo(1, 9);
		}
	});

	it('sets the tide’s frequency by d/r_s alone: x = 2(2n)^{−3/2}, 0.136 at 3 r_s and 7.07 × 10⁻⁷ at 10⁴', () => {
		for (const mu of [1, 1e3, 1e9]) {
			const o = orbit(mu * M_SUN_SI, 30);
			expect(o.x / tideX(30)).toBeCloseTo(1, 10);
			// and with Ω = √(GM/d³) worked out afresh
			const d = (30 * 2 * G_SI * mu * M_SUN_SI) / C_SI ** 2;
			const W = Math.sqrt((G_SI * mu * M_SUN_SI) / d ** 3);
			expect(o.x / ((G_SI * mu * M_SUN_SI * 2 * W) / C_SI ** 3)).toBeCloseTo(1, 9);
		}
		expect(three(tideX(3))).toBe(0.136);
		expect(three(tideX(1e4))).toBe(7.07e-7);
		// both ends of the slider fall inside the drawn span
		expect(Math.log10(tideX(1e4))).toBeGreaterThan(SPAN.x[0]);
		expect(Math.log10(tideX(3))).toBeLessThan(SPAN.x[1]);
		expect(Math.log10(page(10 ** SPAN.x[0]))).toBeGreaterThan(SPAN.gamma[0]);
		expect(Math.log10(law(10 ** SPAN.x[0]))).toBeGreaterThan(SPAN.chi[0]);
		expect(Math.log10(PEAK.value)).toBeLessThan(SPAN.chi[1]);
	});
});

describe('the sliders and the drawing', () => {
	it('open at 10 solar masses and 30 r_s, within their ranges', () => {
		expect(10 ** MASS.opening).toBeCloseTo(10, 12);
		expect(10 ** DISTANCE.opening).toBeCloseTo(30, 12);
		expect(10 ** DISTANCE.min).toBeCloseTo(3, 12);
		expect(10 ** DISTANCE.max).toBe(1e4);
		expect(10 ** MASS.max).toBe(1e9);
		// the opening lies on the distance slider's own steps, counted from its least value
		const steps = (DISTANCE.opening - DISTANCE.min) / DISTANCE.step;
		expect(Math.abs(steps - Math.round(steps))).toBeLessThan(1e-9);
	});

	it('draws the moon nearer as it comes in', () => {
		expect(moonPlace(DISTANCE.min)).toBe(0);
		expect(moonPlace(DISTANCE.max)).toBe(1);
		expect(moonPlace(1)).toBeGreaterThan(moonPlace(0.8));
	});
});

describe('the words', () => {
	it('write numbers to three figures', () => {
		expect(numText(1.8423e26)).toBe('1.84 × 10²⁶');
		expect(numText(7.716e-8)).toBe('7.72 × 10⁻⁸');
		expect(numText(29.533)).toBe('29.5');
		expect(numTex(0.0043033)).toBe('0.00430');
		expect(numTex(3.0551e-6, 2)).toBe('3.1 \\times 10^{-6}');
		expect(numText(9.9996e8)).toBe('1.00 × 10⁹');
		expect(lengthTex(886001)).toBe('886\\,\\mathrm{km}');
		expect(lengthTex(8.86)).toBe('8.86\\,\\mathrm{m}');
	});

	it('print none of the try box’s answers', () => {
		const source = readFileSync('src/lib/tutorial/live/TidalFriction.svelte', 'utf8');
		for (const answer of [
			'10⁻⁴⁹',
			'10^{-49}',
			'e-49',
			'terawatt',
			'TW',
			'no bulge',
			'does not bulge',
			'k_2 = 0\\',
			'k₂ = 0 ',
			'more energy',
			'less energy'
		])
			expect(source).not.toContain(answer);
		// the slider cannot reach a hole of the Earth's mass
		expect(10 ** MASS.min * M_SUN_SI).toBeGreaterThan(1e5 * 5.97e24);
	});
});
