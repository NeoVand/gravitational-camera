/** Chapter 2.6's narrow bump rebuilt from ripples: the coefficients, the convergence, the blur, and the numbers. */
import { describe, expect, it } from 'vitest';
import {
	MATCH,
	MOST,
	OPENING,
	PERIOD,
	WIDTHS,
	bump,
	bumpHalfWidth,
	coefficient,
	gap,
	kernel,
	lowest,
	partialSum,
	partialSums,
	peak,
	ripplesNeeded,
	sumHalfWidth,
	transform,
	wavenumber
} from './fourier-build';

/** (1/L) ∫ f(x) g(x) dx over one period by the midpoint rule on `m` points (spectral accuracy for smooth periodic f g). */
function overPeriod(f: (x: number) => number, m = 1 << 14): number {
	let s = 0;
	for (let j = 0; j < m; j++) s += f(-PERIOD / 2 + ((j + 0.5) * PERIOD) / m);
	return s / m;
}

describe('the period and its ripples', () => {
	it('is a metre, and its first ripple has crests a metre apart, k = 6.28 per metre', () => {
		expect(PERIOD).toBe(1);
		expect(wavenumber(1)).toBeCloseTo(6.283, 3);
		expect(wavenumber(10)).toBeCloseTo(62.83, 2); // crests 10 cm apart
	});

	it('offers the try’s two widths, 0.1 and 0.01 m, and up to 60 ripples', () => {
		expect(WIDTHS).toContain(0.1);
		expect(WIDTHS).toContain(0.01);
		expect(MOST).toBe(60);
		expect([...WIDTHS].sort((a, b) => a - b)).toEqual([...WIDTHS]);
	});
});

describe('the coefficients are the transform at the wavenumbers of the period, over L', () => {
	for (const eps of [0.01, 0.03, 0.1, 0.15]) {
		it(`at ε = ${eps} m, c_n = (1/L) ∫ bump e^{−ik_n x} dx = e^{−ε²k_n²/2}/L`, () => {
			for (const n of [0, 1, 2, 5, 17, 40, 60]) {
				const k = wavenumber(n);
				const re = overPeriod((x) => bump(eps, x) * Math.cos(k * x));
				const im = overPeriod((x) => -bump(eps, x) * Math.sin(k * x));
				expect(re).toBeCloseTo(coefficient(eps, n), 10);
				expect(im).toBeCloseTo(0, 12);
				expect(coefficient(eps, n)).toBeCloseTo(transform(eps, k) / PERIOD, 14);
			}
		});
	}

	it('starts with the mean, c_0 = 1/L, since the bump has area 1', () => {
		expect(coefficient(0.02, 0)).toBe(1 / PERIOD);
		expect(overPeriod((x) => bump(0.02, x))).toBeCloseTo(1 / PERIOD, 12);
	});
});

describe('the partial sums converge to the bump', () => {
	it('the gap shrinks as ripples are added, at every width', () => {
		for (const eps of WIDTHS) {
			let before = Infinity;
			for (const n of [1, 2, 4, 8, 16, 32, 60]) {
				const g = gap(eps, n, 1001);
				expect(g).toBeLessThanOrEqual(before + 1e-14);
				before = g;
			}
		}
	});

	it('with 60 ripples, every width from 0.012 m up is matched to better than a part in a thousand', () => {
		for (const eps of WIDTHS.filter((e) => e >= 0.012)) expect(gap(eps, MOST)).toBeLessThan(1e-3);
		expect(gap(0.03, MOST)).toBeLessThan(1e-12);
	});

	it('the fast sum agrees with the plain one', () => {
		const xs = [-0.5, -0.31, -0.02, 0, 0.004, 0.27, 0.5];
		const fast = partialSums(0.02, 37, xs);
		xs.forEach((x, i) => expect(fast[i]).toBeCloseTo(partialSum(0.02, 37, x), 10));
	});

	it('at the centre the sum falls short of the bump by the ripples left out', () => {
		const eps = 0.05;
		const n = 6;
		let missing = 0;
		for (let m = n + 1; m < 400; m++) missing += 2 * coefficient(eps, m);
		expect(bump(eps, 0) - partialSum(eps, n, 0)).toBeCloseTo(missing, 12);
	});
});

describe('keeping N ripples is a blur, by the convolution theorem', () => {
	it('the sum is the repeated bump blurred by D_N(x) = sin((2N+1)πx/L) / (L sin(πx/L))', () => {
		const eps = 0.04;
		const n = 7;
		for (const x of [0, 0.03, 0.11, -0.26, 0.5]) {
			const blurred = overPeriod((u) => kernel(n, x - u) * bump(eps, u)) * PERIOD;
			expect(blurred).toBeCloseTo(partialSum(eps, n, x), 9);
		}
	});

	it('the kernel is the sum of the kept ripples, and has area 1 over a period', () => {
		const x = 0.137;
		let s = 1;
		for (let m = 1; m <= 9; m++) s += 2 * Math.cos(wavenumber(m) * x);
		expect(kernel(9, x)).toBeCloseTo(s / PERIOD, 12);
		expect(kernel(9, 0)).toBe(19 / PERIOD);
		expect(overPeriod((u) => kernel(9, u)) * PERIOD).toBeCloseTo(1, 12);
	});
});

describe('the chapter’s numbers', () => {
	it('a bump 1 cm wide holds k = 100 per metre at 61% and k = 300 per metre at 1.1%', () => {
		expect(transform(0.01, 100)).toBeCloseTo(0.607, 3);
		expect(transform(0.01, 300)).toBeCloseTo(Math.exp(-4.5), 12);
		expect(Math.round(transform(0.01, 300) * 1000) / 10).toBe(1.1);
	});

	it('the bump has area 1 and its height is 1/(√(2π) ε): 3.99 per metre at ε = 0.1 m', () => {
		expect(peak(0.1)).toBeCloseTo(3.989, 3);
		expect(bump(0.1, 0)).toBeCloseTo(peak(0.1), 6);
		expect(bumpHalfWidth(0.1)).toBeCloseTo(0.2355, 4);
	});

	it('a bump ten times narrower needs about ten times as many ripples: 4 at 0.1 m, 41 at 0.01 m', () => {
		expect(MATCH).toBe(0.01);
		expect(ripplesNeeded(0.1)).toBe(4);
		expect(ripplesNeeded(0.01)).toBe(41);
		expect(gap(0.1, 3)).toBeGreaterThan(MATCH);
		expect(gap(0.01, 40)).toBeGreaterThan(MATCH);
	});

	it('the ripples needed reach a wavenumber of about 2.5/ε, ten times farther for a bump ten times narrower', () => {
		for (const eps of WIDTHS) {
			const n = ripplesNeeded(eps)!;
			expect(n).toBeLessThanOrEqual(MOST);
			const reach = wavenumber(n) * eps;
			expect(reach).toBeGreaterThan(2.2);
			expect(reach).toBeLessThan(2.9);
		}
	});

	it('opens close but ringing: 2.5% from the bump, dipping 1.8% below zero', () => {
		expect(OPENING).toEqual({ width: 0.1, ripples: 3 });
		expect(gap(0.1, 3)).toBeCloseTo(0.0254, 4);
		expect(lowest(0.1, 3)).toBeCloseTo(-0.0181, 4);
	});

	it('cut short, the sum widens and rings: at 0.01 m with 10 ripples, 5.9 cm wide against 2.4, dipping 9%', () => {
		expect(sumHalfWidth(0.01, 10)).toBeCloseTo(0.0594, 4);
		expect(bumpHalfWidth(0.01)).toBeCloseTo(0.0235, 4);
		expect(lowest(0.01, 10)).toBeCloseTo(-0.0923, 4);
		// once matched, the sum is as wide as the bump
		expect(sumHalfWidth(0.01, 41) / bumpHalfWidth(0.01)).toBeCloseTo(1.02, 2);
	});
});
