/** A hidden flow: the bracket of two moments' rates of change, for a sphere whose halves turn opposite ways. */
import { describe, expect, it } from 'vitest';
import { BALANCED, angularMomentum, ballMoment, bracket, rate, share } from './flow';

/** Gauss-Legendre nodes and weights on [lo, hi]. */
function gauss(n: number, lo: number, hi: number): [number[], number[]] {
	const x: number[] = [],
		w: number[] = [];
	for (let i = 1; i <= n; i++) {
		let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		let dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1,
				p1 = 0;
			for (let j = 1; j <= n; j++) [p1, p0] = [p0, ((2 * j - 1) * z * p0 - (j - 1) * p1) / j];
			dp = (n * (z * p0 - p1)) / (z * z - 1);
			const dz = p0 / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-15) break;
		}
		x.push(((hi - lo) * z + hi + lo) / 2);
		w.push((hi - lo) / ((1 - z * z) * dp * dp));
	}
	return [x, w];
}

/** Re and Im of (x + iy)^n / n. */
function profiles(n: number, x: number, y: number): [number, number] {
	let re = 1,
		im = 0;
	for (let i = 0; i < n; i++) [re, im] = [re * x - im * y, re * y + im * x];
	return [re / n, im / n];
}

/**
 * The bracket int J . [(grad grad h) grad g - (grad grad g) grad h] dV, straight from its definition: h and g are
 * differentiated numerically, and the integral over the uniform ball of unit mass and radius is taken by quadrature.
 */
function bracketByQuadrature(n: number, inner: number, sense = 1): number {
	const d = 1e-4;
	const grad = (f: (x: number, y: number) => number, x: number, y: number) => [
		(f(x + d, y) - f(x - d, y)) / (2 * d),
		(f(x, y + d) - f(x, y - d)) / (2 * d)
	];
	const hess = (f: (x: number, y: number) => number, x: number, y: number) => [
		[
			(f(x + d, y) - 2 * f(x, y) + f(x - d, y)) / (d * d),
			(f(x + d, y + d) - f(x + d, y - d) - f(x - d, y + d) + f(x - d, y - d)) / (4 * d * d)
		],
		[0, (f(x, y + d) - 2 * f(x, y) + f(x, y - d)) / (d * d)]
	];
	const h = (x: number, y: number) => profiles(n, x, y)[0];
	const g = (x: number, y: number) => profiles(n, x, y)[1];
	const rho = 3 / (4 * Math.PI);
	let sum = 0;
	// the radius in two pieces, so that the jump of the rate at the inner radius falls between nodes
	for (const [lo, hi] of [
		[0, inner],
		[inner, 1]
	]) {
		const [rs, rw] = gauss(24, lo, hi);
		const [cs, cw] = gauss(24, -1, 1);
		const PHI = 48;
		rs.forEach((r, i) =>
			cs.forEach((c, j) => {
				const s = Math.sqrt(1 - c * c);
				for (let k = 0; k < PHI; k++) {
					const phi = (2 * Math.PI * k) / PHI;
					const x = r * s * Math.cos(phi),
						y = r * s * Math.sin(phi);
					const omega = rate(r, inner, sense);
					const J = [-rho * omega * y, rho * omega * x];
					const H = hess(h, x, y),
						G = hess(g, x, y);
					H[1][0] = H[0][1];
					G[1][0] = G[0][1];
					const gh = grad(h, x, y),
						gg = grad(g, x, y);
					const v = [0, 1].map(
						(a) => H[a][0] * gg[0] + H[a][1] * gg[1] - (G[a][0] * gh[0] + G[a][1] * gh[1])
					);
					sum += rw[i] * cw[j] * ((2 * Math.PI) / PHI) * r * r * (J[0] * v[0] + J[1] * v[1]);
				}
			})
		);
	}
	return sum;
}

describe('the sphere whose halves turn opposite ways', () => {
	it('has no angular momentum when the inner ball reaches 2^(-1/5) of the radius', () => {
		expect(BALANCED).toBeCloseTo(0.8705505632961241, 15);
		expect(angularMomentum(BALANCED)).toBeCloseTo(0, 15);
		expect(angularMomentum(0.6)).toBeLessThan(0);
		expect(angularMomentum(0.95)).toBeGreaterThan(0);
		// a uniform ball turning as one: (2/5) M Omega R^2
		expect(angularMomentum(1)).toBeCloseTo(2 / 5, 15);
		expect(ballMoment(1)).toBeCloseTo(2 / 5, 15);
		expect(ballMoment(2)).toBeCloseTo(8 / 35, 15);
	});
});

describe('the bracket of two tides', () => {
	it('for degree three is (32/35)(1 - 2^(-2/5)) M Omega R^4 = 0.221 at the balance', () => {
		const exact = (32 / 35) * (1 - 2 ** (-2 / 5));
		expect(bracket(3, BALANCED)).toBeCloseTo(exact, 14);
		expect(bracket(3, BALANCED).toFixed(3)).toBe('0.221');
		// the reference implementation's value (results/figures/hidden-flow.json)
		expect(bracket(3, BALANCED)).toBeCloseTo(0.22138671245238947, 13);
		// and it changes sign with the sense of the turning
		expect(bracket(3, BALANCED, -1)).toBeCloseTo(-exact, 14);
	});

	it('for degree two is -2 L_z: it vanishes with the angular momentum', () => {
		for (const x of [0.4, 0.7, BALANCED, 0.95]) {
			expect(bracket(2, x)).toBeCloseTo(-2 * angularMomentum(x), 14);
		}
		expect(bracket(2, BALANCED)).toBeCloseTo(0, 14);
	});

	it('is the integral of J . [(grad grad h) grad g - (grad grad g) grad h], taken from the definition', () => {
		for (const n of [2, 3, 4]) {
			for (const x of [0.5, BALANCED]) {
				expect(bracketByQuadrature(n, x)).toBeCloseTo(bracket(n, x), 5);
			}
		}
	});

	it('is the sum of the shares of the radii, which go as r^(2n), of opposite signs inside and out', () => {
		for (const n of [2, 3]) {
			const [rs, ws] = gauss(40, 0, BALANCED);
			const [ro, wo] = gauss(40, BALANCED, 1);
			const total =
				rs.reduce((s, r, i) => s + ws[i] * share(n, r, BALANCED), 0) +
				ro.reduce((s, r, i) => s + wo[i] * share(n, r, BALANCED), 0);
			expect(total).toBeCloseTo(bracket(n, BALANCED), 12);
			expect(Math.sign(share(n, 0.5, BALANCED))).toBe(-1);
			expect(Math.sign(share(n, 0.95, BALANCED))).toBe(1);
			expect(share(n, 0.6, BALANCED) / share(n, 0.3, BALANCED)).toBeCloseTo(2 ** (2 * n), 12);
		}
	});
});
