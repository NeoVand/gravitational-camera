/** The Legendre polynomials, the spherical harmonics and the cap of chapter 2.2, against the chapter's own numbers. */
import { describe, expect, it } from 'vitest';
import {
	CAP,
	MOST_BUILD,
	MOST_DEGREE,
	associated,
	cap,
	capCoefficient,
	capCoefficients,
	capSquare,
	degrees,
	edge,
	harmonic,
	hemisphereIntegral,
	largest,
	latitudeZeros,
	leftoverShare,
	legendre,
	legendreList,
	meridianZeros,
	norm,
	patternsUpTo,
	polar,
	radians,
	readTable,
	realPart,
	rebuilt,
	ringing,
	sampleTheta,
	sharpDegree
} from './sky-patterns';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

/** Gauss–Legendre nodes and weights on [−1, 1], by Newton's method on P_n. */
function gauss(n: number) {
	const nodes: number[] = [];
	const weights: number[] = [];
	for (let i = 1; i <= n; i++) {
		let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		for (let k = 0; k < 100; k++) {
			const p = legendreList(n, x);
			const dp = (n * (x * p[n] - p[n - 1])) / (x * x - 1);
			const dx = p[n] / dp;
			x -= dx;
			if (Math.abs(dx) < 1e-16) break;
		}
		const p = legendreList(n, x);
		const dp = (n * (x * p[n] - p[n - 1])) / (x * x - 1);
		nodes.push(x);
		weights.push(2 / ((1 - x * x) * dp * dp));
	}
	return { nodes, weights };
}

/** ∮ g dΩ for a pattern g(ϑ, φ): Gauss–Legendre in μ = cos ϑ, equal steps in φ, exact for patterns of low degree. */
function sky(g: (theta: number, phi: number) => number, n = 48, k = 96) {
	const { nodes, weights } = gauss(n);
	let s = 0;
	for (let i = 0; i < n; i++)
		for (let j = 0; j < k; j++)
			s += weights[i] * ((2 * Math.PI) / k) * g(Math.acos(nodes[i]), (2 * Math.PI * j) / k);
	return s;
}

/** A small generator of the same random numbers on every run. */
function source(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

describe('the Legendre polynomials', () => {
	it('are the chapter’s first four', () => {
		for (const mu of [-0.9, -0.3, 0, 0.4, 0.77, 1]) {
			close(legendre(0, mu), 1);
			close(legendre(1, mu), mu);
			close(legendre(2, mu), 0.5 * (3 * mu * mu - 1));
			close(legendre(3, mu), 0.5 * (5 * mu ** 3 - 3 * mu));
		}
	});

	it('come from the generating function: 1.08465 at t = 0.3, μ = 0.4, sixty terms to fifteen digits', () => {
		const t = 0.3;
		const mu = 0.4;
		const left = 1 / Math.sqrt(1 - 2 * t * mu + t * t);
		expect(left.toFixed(5)).toBe('1.08465');
		const p = legendreList(59, mu);
		let sum = 0;
		for (let l = 0; l < 60; l++) sum += t ** l * p[l];
		close(sum, left, 15);
	});

	it('are 1 at μ = 1 and have the parity of their degree', () => {
		for (let l = 0; l <= 20; l++) {
			close(legendre(l, 1), 1);
			close(legendre(l, -0.37), (-1) ** l * legendre(l, 0.37));
		}
	});

	it('are orthogonal, with ∫ P_ℓ² dμ = 2/(2ℓ + 1)', () => {
		const { nodes, weights } = gauss(40);
		for (let l = 0; l <= 12; l++)
			for (let k = 0; k <= 12; k++) {
				let s = 0;
				for (let i = 0; i < nodes.length; i++)
					s += weights[i] * legendre(l, nodes[i]) * legendre(k, nodes[i]);
				close(s, l === k ? 2 / (2 * l + 1) : 0, 14);
			}
	});

	it('put the zero of P₂ at 54.7°, and −2P₂(cos 0.9) = 1 − 3cos² 0.9 = −0.159', () => {
		const [first, second] = latitudeZeros(2, 0);
		expect(degrees(first).toFixed(1)).toBe('54.7');
		expect(degrees(second).toFixed(1)).toBe('125.3');
		close(Math.cos(first), 1 / Math.sqrt(3));
		expect((-2 * legendre(2, Math.cos(0.9))).toFixed(3)).toBe('-0.159');
		close(-2 * legendre(2, Math.cos(0.9)), 1 - 3 * Math.cos(0.9) ** 2);
	});

	it('give P₁₀ ten zeros, at 13°, 30°, 47°, 64°, …, 17° apart', () => {
		const z = latitudeZeros(10, 0).map(degrees);
		expect(z).toHaveLength(10);
		expect(z.slice(0, 4).map((d) => Math.round(d))).toEqual([13, 30, 47, 64]);
		for (let i = 1; i < 5; i++) expect(Math.round(z[i] - z[i - 1])).toBe(17);
	});

	it('give the hemisphere ½, −⅛, 1/16 for ℓ = 1, 3, 5 and nothing for even ℓ', () => {
		close(hemisphereIntegral(1), 1 / 2);
		close(hemisphereIntegral(3), -1 / 8);
		close(hemisphereIntegral(5), 1 / 16);
		for (const l of [2, 4, 6, 8]) close(hemisphereIntegral(l), 0);
	});
});

describe('the spherical harmonics', () => {
	it('are the chapter’s written forms up to degree two, with its constants', () => {
		expect(norm(0, 0).toFixed(3)).toBe('0.282');
		expect(Math.sqrt(3 / (4 * Math.PI)).toFixed(3)).toBe('0.489');
		expect(Math.sqrt(3 / (8 * Math.PI)).toFixed(3)).toBe('0.345');
		expect(Math.sqrt(5 / (16 * Math.PI)).toFixed(3)).toBe('0.315');
		expect(Math.sqrt(15 / (8 * Math.PI)).toFixed(3)).toBe('0.773');
		expect(Math.sqrt(15 / (32 * Math.PI)).toFixed(3)).toBe('0.386');
		const next = source(22);
		for (let i = 0; i < 30; i++) {
			const t = Math.PI * next();
			const p = 2 * Math.PI * next();
			const s = Math.sin(t);
			const c = Math.cos(t);
			const want: Record<string, [number, number]> = {
				'0,0': [Math.sqrt(1 / (4 * Math.PI)), 0],
				'1,0': [Math.sqrt(3 / (4 * Math.PI)) * c, 0],
				'1,1': [
					-Math.sqrt(3 / (8 * Math.PI)) * s * Math.cos(p),
					-Math.sqrt(3 / (8 * Math.PI)) * s * Math.sin(p)
				],
				'1,-1': [
					Math.sqrt(3 / (8 * Math.PI)) * s * Math.cos(p),
					-Math.sqrt(3 / (8 * Math.PI)) * s * Math.sin(p)
				],
				'2,0': [Math.sqrt(5 / (16 * Math.PI)) * (3 * c * c - 1), 0],
				'2,1': [
					-Math.sqrt(15 / (8 * Math.PI)) * s * c * Math.cos(p),
					-Math.sqrt(15 / (8 * Math.PI)) * s * c * Math.sin(p)
				],
				'2,-1': [
					Math.sqrt(15 / (8 * Math.PI)) * s * c * Math.cos(p),
					-Math.sqrt(15 / (8 * Math.PI)) * s * c * Math.sin(p)
				],
				'2,2': [
					Math.sqrt(15 / (32 * Math.PI)) * s * s * Math.cos(2 * p),
					Math.sqrt(15 / (32 * Math.PI)) * s * s * Math.sin(2 * p)
				],
				'2,-2': [
					Math.sqrt(15 / (32 * Math.PI)) * s * s * Math.cos(2 * p),
					-Math.sqrt(15 / (32 * Math.PI)) * s * s * Math.sin(2 * p)
				]
			};
			for (const [key, [re, im]] of Object.entries(want)) {
				const [l, m] = key.split(',').map(Number);
				const y = harmonic(l, m, t, p);
				close(y.re, re);
				close(y.im, im);
				close(realPart(l, m, t, p), re);
			}
		}
	});

	it('agree with P_ℓ^m = (−1)^m (1 − μ²)^{m/2} d^m P_ℓ/dμ^m, checked against explicit forms', () => {
		const mu = 0.43;
		const s = Math.sqrt(1 - mu * mu);
		close(associated(3, 0, mu), legendre(3, mu));
		close(associated(3, 1, mu), -s * 0.5 * (15 * mu * mu - 3));
		close(associated(3, 2, mu), s * s * 15 * mu);
		close(associated(3, 3, mu), -(s ** 3) * 15);
		close(associated(4, 2, mu), s * s * 0.5 * (105 * mu * mu - 15));
	});

	it('are orthonormal over the sky up to degree twelve', () => {
		const list: [number, number][] = [];
		for (let l = 0; l <= MOST_DEGREE; l++) for (let m = -l; m <= l; m++) list.push([l, m]);
		const { nodes, weights } = gauss(30);
		const K = 64;
		// the samples of every pattern on one grid, then every inner product from them
		const samples = list.map(([l, m]) => {
			const re: number[] = [];
			const im: number[] = [];
			for (const x of nodes)
				for (let j = 0; j < K; j++) {
					const y = harmonic(l, m, Math.acos(x), (2 * Math.PI * j) / K);
					re.push(y.re);
					im.push(y.im);
				}
			return { re, im };
		});
		const w = nodes.flatMap((_, i) =>
			Array.from({ length: K }, () => (weights[i] * 2 * Math.PI) / K)
		);
		let worst = 0;
		for (let a = 0; a < list.length; a++)
			for (let b = a; b < list.length; b++) {
				let re = 0;
				let im = 0;
				const p = samples[a];
				const q = samples[b];
				for (let i = 0; i < w.length; i++) {
					re += w[i] * (p.re[i] * q.re[i] + p.im[i] * q.im[i]);
					im += w[i] * (p.re[i] * q.im[i] - p.im[i] * q.re[i]);
				}
				worst = Math.max(worst, Math.abs(re - (a === b ? 1 : 0)), Math.abs(im));
			}
		expect(list).toHaveLength(patternsUpTo(MOST_DEGREE));
		expect(worst).toBeLessThan(1e-13);
	});

	it('satisfy ∇²_Ω Y = −ℓ(ℓ + 1) Y, checked by differences', () => {
		const h = 1e-4;
		for (const [l, m, t, p] of [
			[2, 0, 0.7, 0.2],
			[3, 2, 1.1, 0.9],
			[7, -4, 0.6, 2.3],
			[12, 5, 1.9, 4.1]
		]) {
			const f = (a: number, b: number) => realPart(l, m, a, b);
			const dt = (f(t + h, p) - f(t - h, p)) / (2 * h);
			const dtt = (f(t + h, p) - 2 * f(t, p) + f(t - h, p)) / (h * h);
			const dpp = (f(t, p + h) - 2 * f(t, p) + f(t, p - h)) / (h * h);
			const lap = dtt + (Math.cos(t) / Math.sin(t)) * dt + dpp / Math.sin(t) ** 2;
			expect(Math.abs(lap + l * (l + 1) * f(t, p))).toBeLessThan(
				2e-5 * l * (l + 1) * largest(l, m)
			);
		}
	});

	it('obey the addition theorem: Σ_m |Y_ℓm|² = (2ℓ + 1)/4π everywhere, 0.398 for ℓ = 2', () => {
		const next = source(7);
		for (let l = 0; l <= MOST_DEGREE; l++)
			for (let i = 0; i < 5; i++) {
				const t = Math.PI * next();
				const p = 2 * Math.PI * next();
				let s = 0;
				for (let m = -l; m <= l; m++) {
					const y = harmonic(l, m, t, p);
					s += y.re * y.re + y.im * y.im;
				}
				close(s, (2 * l + 1) / (4 * Math.PI));
			}
		expect((5 / (4 * Math.PI)).toFixed(3)).toBe('0.398');
	});

	it('count (ℓ + 1)² patterns up to degree ℓ: 25 to four, 169 to twelve', () => {
		expect(patternsUpTo(2)).toBe(9);
		expect(patternsUpTo(4)).toBe(25);
		expect(patternsUpTo(12)).toBe(169);
	});

	it('vanish on ℓ − |m| circles of latitude and |m| great circles through the poles', () => {
		for (let l = 0; l <= MOST_DEGREE; l++)
			for (let m = -l; m <= l; m++) {
				const z = latitudeZeros(l, m);
				expect(z).toHaveLength(l - Math.abs(m));
				for (const t of z) expect(Math.abs(polar(l, Math.abs(m), t))).toBeLessThan(1e-12);
				const g = meridianZeros(m);
				expect(g).toHaveLength(2 * Math.abs(m));
				for (const p of g) expect(Math.abs(realPart(l, m, 1.0, p))).toBeLessThan(1e-12);
			}
	});

	it('give the tidal weight 1 − 3cos²ϑ the single coefficient a₂₀ = −3.17', () => {
		const w = (t: number) => 1 - 3 * Math.cos(t) ** 2;
		for (let l = 0; l <= 4; l++)
			for (let m = -l; m <= l; m++) {
				const a = sky((t, p) => harmonic(l, m, t, p).re * w(t));
				if (l === 2 && m === 0) {
					close(a, -2 * Math.sqrt((4 * Math.PI) / 5), 12);
					expect(a.toFixed(2)).toBe('-3.17');
				} else close(a, 0, 12);
			}
	});

	it('read back from a sampled table to well within a pixel’s colour', () => {
		const tab = sampleTheta(2048, (t) => polar(12, 0, t));
		const end = largest(12, 0);
		for (let i = 0; i < 200; i++) {
			const t = (Math.PI * (i + 0.37)) / 200;
			expect(Math.abs(readTable(tab, t) - polar(12, 0, t))).toBeLessThan(2e-3 * end);
		}
	});
});

describe('the cap rebuilt from its degrees', () => {
	it('has the coefficients ∮ Y_ℓ0 f dΩ, and none with m ≠ 0', () => {
		close(capCoefficient(0), Math.sqrt(Math.PI) * (1 - Math.cos(CAP)));
		expect(capCoefficient(0).toFixed(3)).toBe('0.237');
		const a = capCoefficients(8);
		for (let l = 0; l <= 8; l++) {
			// the cap's edge makes the quadrature slow, so a fine one, and the agreement asked for is modest
			const q = sky((t) => polar(l, 0, t) * cap(t), 4000, 1);
			expect(Math.abs(q - a[l])).toBeLessThan(2e-3);
			close(a[l], capCoefficient(l));
		}
		const off = sky((t, p) => harmonic(3, 2, t, p).re * cap(t), 400, 16);
		expect(Math.abs(off)).toBeLessThan(1e-12);
	});

	it('holds all of ∮ f² dΩ = 2π(1 − cos 30°) = 0.842 in its degrees', () => {
		expect(capSquare().toFixed(3)).toBe('0.842');
		expect(leftoverShare(0)).toBeCloseTo(1 - (1 - Math.cos(CAP)) / 2, 12);
		expect(leftoverShare(2000)).toBeLessThan(2e-3);
		let before = 1;
		for (let L = 0; L <= MOST_BUILD; L++) {
			const s = leftoverShare(L);
			expect(s).toBeLessThanOrEqual(before + 1e-15);
			before = s;
		}
	});

	it('is f_L = Σ a_ℓ0 Y_ℓ0, half the cap’s height at the edge', () => {
		const L = 30;
		const a = capCoefficients(L);
		const t = 0.4;
		let f = 0;
		for (let l = 0; l <= L; l++) f += a[l] * polar(l, 0, t);
		close(rebuilt(L, t), f);
		expect(Math.abs(rebuilt(200, CAP) - 0.5)).toBeLessThan(0.02);
	});

	it('has an edge narrower than 10° from L = 16 on, near the estimate 180°/10 = 18', () => {
		const e15 = edge(15);
		const e16 = edge(16);
		const e18 = edge(18);
		expect(e15 && degrees(e15.width)).toBeGreaterThan(10);
		expect(e16 && degrees(e16.width)).toBeLessThan(10);
		expect(e16 && degrees(e16.width).toFixed(1)).toBe('9.2');
		expect(e18 && degrees(e18.width).toFixed(1)).toBe('8.2');
		expect(sharpDegree(radians(10))).toBe(16);
		expect(edge(0)).toBeUndefined();
		const e4 = edge(4);
		expect(e4 && degrees(e4.width)).toBeGreaterThan(25);
		for (let L = 17; L <= MOST_BUILD; L++) {
			const e = edge(L);
			expect(e && degrees(e.width)).toBeLessThan(10);
		}
	});

	it('rings by about a tenth of its height either side of the edge, however high L goes', () => {
		for (const L of [16, 19, 24, 40, 80, 120]) {
			const { crest, trough } = ringing(L);
			expect(crest.value).toBeGreaterThan(1.08);
			expect(crest.value).toBeLessThan(1.14);
			expect(trough.value).toBeLessThan(-0.06);
			expect(trough.value).toBeGreaterThan(-0.1);
			expect(crest.at).toBeLessThan(CAP);
			expect(trough.at).toBeGreaterThan(CAP);
		}
	});
});
