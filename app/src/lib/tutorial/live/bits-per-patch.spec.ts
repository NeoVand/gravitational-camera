/** The numbers of chapter 3.8's live figure, against the numbers the chapter prints. */
import { describe, expect, it } from 'vitest';
import { cutoff } from '../../engine/resolution';
import {
	FIRST,
	INTEGRAL_MOST,
	KILOBYTE,
	LEAST,
	MILLION_FROM,
	MILLION_TO,
	MOST,
	bitTicks,
	count,
	cutText,
	firstKilobyte,
	integral,
	percent,
	plain,
	ripple,
	shortfall,
	size,
	tenths,
	tex,
	tile
} from './bits-per-patch';

/**
 * The integral by brute force, independently of the module's quadrature: composite Simpson on a grid even in ln q
 * up to q = 1, where the integrand varies on the scale of q itself, and even in q beyond it.
 */
function bruteForce(decades: number): number {
	const lnPiSnr = Math.log(Math.PI) + decades * Math.LN10;
	const integrand = (q: number) => {
		const x = 2 * (lnPiSnr + Math.log(q) - q);
		const ln = x > 0 ? x + Math.log1p(Math.exp(-x)) : Math.log1p(Math.exp(x));
		return (q * ln) / Math.LN2;
	};
	const simpson = (f: (x: number) => number, a: number, b: number, n: number) => {
		const h = (b - a) / n;
		let s = f(a) + f(b);
		for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
		return (s * h) / 3;
	};
	const top = cutoff(decades) + 60;
	const below = simpson((u) => integrand(Math.exp(u)) * Math.exp(u), -lnPiSnr - 40, 0, 40000);
	const above = simpson(integrand, 1, top, 2 * Math.ceil(top * 400));
	return (below + above) / (4 * Math.PI);
}

describe('the bits of one pattern', () => {
	it('are ½ log₂(1 + s²), as the chapter’s numbers give them', () => {
		// s = π SNR q e^(−q); choose q = 1 and SNR = e / π, so that s = 1: half a bit
		const decades = Math.log10(Math.E / Math.PI);
		expect(ripple(1, decades)).toBeCloseTo(0.5, 12);
		// s = 10 gives 3.33 bits, s = 1000 gives 9.97
		expect(ripple(1, Math.log10((10 * Math.E) / Math.PI))).toBeCloseTo(3.329, 3);
		expect(ripple(1, Math.log10((1000 * Math.E) / Math.PI))).toBeCloseTo(9.966, 3);
	});

	it('stay finite far above the noise and vanish far below it', () => {
		expect(ripple(1, 70)).toBeCloseTo(Math.log2(Math.PI * 1e70 * Math.exp(-1)), 9);
		expect(ripple(400, 70)).toBeLessThan(1e-50);
		expect(ripple(0, 3)).toBe(0);
	});

	it('are largest for the coarse patterns and fall towards the cut-off', () => {
		const qc = cutoff(3);
		expect(ripple(2, 3)).toBeGreaterThan(ripple(5, 3));
		expect(ripple(5, 3)).toBeGreaterThan(ripple(qc, 3));
		// at the cut-off s = 1, half a bit
		expect(ripple(qc, 3)).toBeCloseTo(0.5, 9);
	});
});

describe('the closed form', () => {
	it('gives the chapter’s numbers at 10³', () => {
		const c = count(3);
		expect(cutText(c.qc)).toBe('10.39');
		expect(tenths(c.patterns)).toBe('8.6');
		expect(tenths(c.each)).toBe('4.3');
		expect(plain(c.closed)).toBe('36.8');
	});

	it('gives the chapter’s numbers at 10⁶, 10¹⁰ and 10⁷⁰', () => {
		const six = count(6);
		expect(cutText(six.qc)).toBe('17.84');
		expect(six.patterns).toBeCloseTo(25.3, 1);
		expect(six.each).toBeCloseTo(7.86, 2);
		expect(six.closed).toBeCloseTo(199.1, 1);
		expect(Math.round(count(10).closed)).toBe(751);
		const seventy = count(70);
		expect(Math.round(seventy.qc)).toBe(167);
		expect(Math.round(seventy.patterns / 10) * 10).toBe(2230);
		expect(Math.round(seventy.each)).toBe(80);
	});

	it('is the patterns times the bits each', () => {
		for (const d of [1, 3, 17, 70]) {
			const { qc, patterns, each, closed } = count(d);
			expect(closed).toBeCloseTo(patterns * each, 9);
			expect(closed).toBeCloseTo((qc ** 3 / 3 - qc ** 2 / 2) / (4 * Math.PI * Math.LN2), 9);
		}
	});
});

describe('the integral', () => {
	it('gives 37.85 at 10³ and 200.9 at 10⁶', () => {
		expect(integral(3)).toBeCloseTo(37.853, 3);
		expect(integral(6)).toBeCloseTo(200.861, 3);
		expect(plain(integral(3))).toBe('37.9');
		expect(plain(integral(6))).toBe('201');
		expect(plain(integral(10))).toBe('754');
	});

	it('is accurate to 10⁻⁶ over the whole slider', () => {
		for (const d of [1, 2, 3, 4, 6, 9, 10, 15, 30, 50, 70]) {
			const exact = bruteForce(d);
			expect(Math.abs(integral(d) / exact - 1)).toBeLessThan(1e-6);
		}
	});

	it('gives the chapter’s 1.55 × 10⁴ at 10³⁰ and 1.78 × 10⁵ at 10⁷⁰, 22 kilobytes', () => {
		expect(plain(integral(30))).toBe('1.55 × 10⁴');
		expect(plain(integral(70))).toBe('1.78 × 10⁵');
		expect(tex(integral(70))).toBe('1.78 \\times 10^{5}');
		expect(size(integral(70))).toBe('22.3 kilobytes');
	});

	it('lies above the closed form by the chapter’s percentages', () => {
		expect(percent(shortfall(1))).toBe('15%');
		expect(percent(shortfall(2))).toBe('5.4%');
		expect(percent(shortfall(3))).toBe('2.9%');
		expect(percent(shortfall(6))).toBe('0.9%');
		expect(percent(shortfall(10))).toBe('0.36%');
		// beyond 10¹⁰, within half a per cent, as the paper claims
		for (let d = INTEGRAL_MOST; d <= MOST; d++) expect(shortfall(d)).toBeLessThan(0.005);
	});
});

describe('the predictions', () => {
	it('a million times the sensitivity buys from 38 to 571 bits', () => {
		expect(MILLION_TO - MILLION_FROM).toBe(6);
		expect(FIRST).toBe(MILLION_FROM);
		expect(Math.round(integral(MILLION_FROM))).toBe(38);
		expect(Math.round(integral(MILLION_TO))).toBe(571);
		const from = count(MILLION_FROM).qc;
		const to = count(MILLION_TO).qc;
		expect(from.toFixed(1)).toBe('10.4');
		expect(to.toFixed(1)).toBe('25.1');
		expect(Math.round((to / from) ** 3)).toBe(14);
	});

	it('the picture reaches a kilobyte near 10²⁴, and holds 621 bytes at 10²⁰', () => {
		expect(firstKilobyte()).toBe(24);
		expect(count(23).closed).toBeLessThan(KILOBYTE);
		expect(count(24).closed).toBeGreaterThanOrEqual(KILOBYTE);
		expect(plain(count(20).closed)).toBe('4970');
		expect(Math.round(integral(20))).toBe(4970);
		expect(size(count(20).closed)).toBe('621 bytes');
	});
});

describe('the tile', () => {
	it('holds about q_c² / 4π cells within the cut-off', () => {
		for (const d of [3, 10, 30, 70]) {
			const { n, radius } = tile(d);
			let inside = 0;
			for (let j = 0; j < n; j++)
				for (let i = 0; i < n; i++) if (Math.hypot(i + 0.5, j + 0.5) < radius) inside++;
			const patterns = count(d).patterns;
			// a lattice count wanders about the area by a few per cent at most
			expect(Math.abs(inside - patterns)).toBeLessThan(1 + 0.04 * patterns);
		}
	});

	it('subdivides as the patterns grow, from 2 × 2 at 10 to 54 × 54 at 10⁷⁰', () => {
		expect(tile(LEAST).n).toBe(2);
		expect(tile(3).n).toBe(4);
		expect(tile(MOST).n).toBe(54);
		for (let d = LEAST; d < MOST; d++) expect(tile(d + 1).n).toBeGreaterThanOrEqual(tile(d).n);
	});

	it('gives its cells bits that add up to the integral', () => {
		for (const d of [3, 6, 30, 70]) {
			const { bits } = tile(d);
			let sum = 0;
			for (const b of bits) sum += b;
			expect(Math.abs(sum / integral(d) - 1)).toBeLessThan(0.01);
		}
	});

	it('gives the coarse corner the most bits', () => {
		const { n, bits, most } = tile(10);
		expect(bits[0]).toBe(most);
		expect(bits[n * n - 1]).toBeLessThan(0.5);
		for (let i = 1; i < n; i++) expect(bits[i]).toBeLessThan(bits[i - 1]);
	});

	it('has from three to six ticks on its scale', () => {
		for (let d = LEAST; d <= MOST; d++) {
			const most = tile(d).most;
			const t = bitTicks(most);
			expect(t[0]).toBe(0);
			expect(t.length).toBeGreaterThanOrEqual(3);
			expect(t.length).toBeLessThanOrEqual(6);
			expect(t[t.length - 1]).toBeLessThanOrEqual(most);
		}
	});
});

describe('the formats', () => {
	it('write numbers readably across 70 decades', () => {
		expect(plain(3.514)).toBe('3.51');
		expect(plain(9990)).toBe('9990');
		expect(plain(9996)).toBe('1.00 × 10⁴');
		expect(plain(15526)).toBe('1.55 × 10⁴');
		expect(plain(99_960)).toBe('1.00 × 10⁵');
		expect(tenths(2231.2)).toBe('2230');
		expect(size(3.51)).toBe('less than a byte');
		expect(size(36.77)).toBe('4.6 bytes');
		expect(size(7999)).toBe('1000 bytes');
		expect(size(8000)).toBe('1.00 kilobytes');
		expect(size(8268)).toBe('1.03 kilobytes');
	});
});
