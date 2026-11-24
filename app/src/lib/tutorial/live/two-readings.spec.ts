/**
 * Chapter 13.2's two readings as one transform: the try spec's checks, each against values written here independently
 * of the module (the chapter's printed numbers, closed forms worked by hand, a power series for the bump's integral,
 * and a separate Simpson's-rule transform of the null density ∇²ψ/4πG itself), then the module's own pieces.
 */
import { describe, expect, it } from 'vitest';
import {
	BUMP,
	CELLS,
	G,
	HALF,
	NULL_LARGEST,
	NULL_MAP,
	OPENING,
	POINT,
	SNAP,
	bumpIntegral,
	ellipse,
	kept,
	largest,
	map,
	nullTransform,
	pair,
	pointEdge,
	readouts,
	second,
	shade,
	sig,
	sigTex,
	snapped,
	snrText,
	type Vec
} from './two-readings';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

describe('the try spec’s checks', () => {
	it('at the defaults: K = 1.70, κ = 2.28 m⁻¹, semi-axes 1.14 and 0.760 m⁻¹, factor 1.154 m⁻²', () => {
		// by hand: K = (1.1, 1.3), |K| = √2.9; κ = √1.85 + √0.85; |k||k′| − k·k′ = √(1.85 × 0.85) − 0.10
		const K = Math.sqrt(2.9);
		const kappa = Math.sqrt(1.85) + Math.sqrt(0.85);
		const factor = Math.sqrt(1.85 * 0.85) - 0.1;
		const r = readouts(OPENING.k, OPENING.kp, 'point', POINT.depth.opening, 1e3);
		relative(r.K, K, 1e-14);
		relative(r.kappa, kappa, 1e-14);
		relative(r.factor, factor, 1e-13);
		relative(r.factor, (kappa * kappa - K * K) / 2, 1e-12);
		relative(r.major, kappa / 2, 1e-14);
		relative(r.minor, Math.sqrt(kappa * kappa - K * K) / 2, 1e-12);
		expect(r.text).toMatchObject({
			K: '1.70',
			kappa: '2.28',
			major: '1.14',
			minor: '0.760',
			factor: '1.154'
		});
		// the chapter's numbers to the figures it prints
		expect(r.factor).toBeCloseTo(1.154, 3);
		expect(r.minor).toBeCloseTo(0.76, 3);
	});

	it('parallel k and k′ put the dot on the cone, with semi-minor axis 0', () => {
		for (const [k, kp] of [
			[OPENING.k, { x: 0.65, y: 0.2 }],
			[
				{ x: 1, y: 0 },
				{ x: 2.5, y: 0 }
			],
			[
				{ x: -0.3, y: 0.9 },
				{ x: -1, y: 3 }
			],
			[
				{ x: 0.15, y: 0.15 },
				{ x: 2.95, y: 2.95 }
			]
		] as [Vec, Vec][]) {
			const p = pair(k, kp);
			expect(p.K).toBe(p.kappa);
			expect(p.minor).toBe(0);
			expect(p.factor).toBe(0);
			expect(readouts(k, kp, 'point', 1, 1e3).text.minor).toBe('0');
		}
		// opposite directions are as far from the cone as a pair can be: K = ||k| − |k′||
		const p = pair({ x: 1, y: 0 }, { x: -2, y: 0 });
		expect(p.K).toBeCloseTo(1, 14);
		expect(p.kappa).toBeCloseTo(3, 14);
		expect(p.factor).toBeCloseTo(4, 14);
	});

	it('a dragged tip near the other arrow’s line lands on it, and only on its side', () => {
		const k = OPENING.k;
		const along = { x: 0.65 + 0.4 * 0.01, y: 0.2 - 1.3 * 0.01 };
		const s = snapped(along, k);
		expect(Math.abs(s.x * k.y - s.y * k.x)).toBeLessThan(1e-15);
		expect(pair(k, s).minor).toBe(0);
		// beyond SNAP, or behind the origin, it stays where it was dropped
		const far = { x: 0.65 + 0.4 * SNAP, y: 0.2 - 1.3 * SNAP };
		expect(snapped(far, k)).toEqual(far);
		expect(snapped({ x: -0.65, y: -0.2 }, k)).toEqual({ x: -0.65, y: -0.2 });
	});

	it('the point mass at z₀ = 2 m with k = (1, 0), k′ = (0, 1) reads 1.83 kg m⁻²', () => {
		// the chapter's practice problem: ½(4 − 2) × 100 e⁻⁴
		const expected = 100 * Math.exp(-4);
		const r = readouts({ x: 1, y: 0 }, { x: 0, y: 1 }, 'point', 2, 1e3);
		relative(r.reading, expected, 1e-12);
		expect(r.text.reading).toBe('1.83');
		expect(r.text.K).toBe('1.41');
		expect(r.text.kappa).toBe('2.00');
		expect(r.text.major).toBe('1.00');
		expect(r.text.minor).toBe('0.707');
		// the same number from the bracket's side, m(|k||k′| − k·k′) e^{−κz₀}
		relative(second('point', Math.SQRT2, 2, 2), POINT.m * (1 - 0) * Math.exp(-2 * 2), 1e-12);
	});

	it('the null-space scene is exactly zero on the cone and bright inside it', () => {
		for (const K of [0, 0.3, 1, 1.7, 2.9, 4.4, 6]) {
			expect(nullTransform(K, K)).toBe(0);
			expect(second('null', K, K, 0)).toBe(0);
		}
		// on the cell row where κ = K, the map is zero; just inside the cone it is not
		for (let i = 0; i < CELLS; i++) {
			expect(NULL_MAP[i * CELLS + i]).toBe(0);
			if (i + 1 < CELLS) expect(NULL_MAP[(i + 1) * CELLS + i]).toBeGreaterThan(0);
		}
		// and a pair on the cone reads nothing of it, while the defaults read it
		const parallel = readouts(OPENING.k, { x: 0.65, y: 0.2 }, 'null', 0, 1e6);
		expect(parallel.reading).toBe(0);
		expect(parallel.above).toBe(false);
		const inside = readouts(OPENING.k, OPENING.kp, 'null', 0, 1e3);
		expect(inside.reading).toBeGreaterThan(inside.floor);
		expect(inside.above).toBe(true);
	});

	it('raising the slider tenfold moves the readable edge outward by about ln 10/z₀', () => {
		for (const z0 of [0.5, 1, 2, 3]) {
			const law = Math.LN10 / z0;
			for (const [from, to] of [
				[1e3, 1e4],
				[1e5, 1e6]
			]) {
				const shift = pointEdge(z0, 0, to) - pointEdge(z0, 0, from);
				// the exponential sets the step; the factor ½(κ² − K²) adds a little, 1/(1 − 2/κz₀)
				expect(shift).toBeGreaterThan(law);
				expect(shift).toBeLessThan(1.25 * law);
			}
		}
		// 2.3 m⁻¹ at z₀ = 1 m, to the chapter's "about"
		const shift = pointEdge(1, 0, 1e4) - pointEdge(1, 0, 1e3);
		expect(Math.abs(shift - 2.3) / 2.3).toBeLessThan(0.2);
		// and the law itself is the limit of high sensitivity
		const late = pointEdge(1, 0, 1e30) - pointEdge(1, 0, 1e29);
		expect(Math.abs(late / Math.LN10 - 1)).toBeLessThan(0.05);
		// at the edge the reading equals the floor
		const edge = pointEdge(2, 1, 1e3);
		relative(second('point', 1, edge, 2), largest('point', 2) / 1e3, 1e-9);
	});
});

describe('the scenes', () => {
	it('the point mass’s largest reading is 2m e⁻²/z₀² at κ = 2/z₀, K = 0', () => {
		for (const z0 of [0.5, 1, 2, 3])
			relative(largest('point', z0), (2 * POINT.m * Math.exp(-2)) / (z0 * z0), 1e-9);
		const values = map('point', 1);
		expect(Math.max(...values)).toBeLessThanOrEqual(largest('point', 1));
	});

	it('the bump’s integral matches its power series, and 16a³/315 at s = 0', () => {
		const a = BUMP.a;
		relative(bumpIntegral(0), (16 * a ** 3) / 315, 1e-14);
		// sinh(x)/x = Σ x²ⁿ/(2n + 1)!, and ∫₀¹ (1 − u²)³ u²ⁿ⁺² du = 1/(2n+3) − 3/(2n+5) + 3/(2n+7) − 1/(2n+9)
		const series = (s: number) => {
			let total = 0;
			let term = 1; // (sa)^{2n}/(2n+1)!
			for (let n = 0; n < 40; n++) {
				const m = 2 * n;
				total += term * (1 / (m + 3) - 3 / (m + 5) + 3 / (m + 7) - 1 / (m + 9));
				term *= (s * a) ** 2 / ((m + 2) * (m + 3));
			}
			return a ** 3 * total;
		};
		for (const s of [0.01, 0.5, 1, 2.5, 4, 6]) relative(bumpIntegral(s), series(s), 1e-13);
	});

	it('the null transform is the transform of ∇²ψ/4πG, by Green’s identity', () => {
		// ∇²ψ for ψ = ψ₀(1 − u)³, u = r²/a²: −6ψ₀(1 − u)(3 − 7u)/a²; its transform at (K, κ) by Simpson's rule in r
		const { psi0, a, depth } = BUMP;
		const laplacian = (r: number) => {
			const u = (r * r) / (a * a);
			return (-6 * psi0 * (1 - u) * (3 - 7 * u)) / (a * a);
		};
		const direct = (K: number, kappa: number) => {
			const s = Math.sqrt(kappa * kappa - K * K);
			const n = 4000;
			const h = a / n;
			let sum = 0;
			for (let i = 0; i <= n; i++) {
				const r = i * h;
				const x = s * r;
				const f = laplacian(r) * r * r * (x === 0 ? 1 : Math.sinh(x) / x);
				sum += f * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
			}
			return ((Math.exp(-kappa * depth) * 4 * Math.PI * (sum * h)) /
				3 /
				(4 * Math.PI * G)) as number;
		};
		for (const [K, kappa] of [
			[0, 1],
			[1.7, 2.28],
			[0.5, 4],
			[3, 5.5],
			[0, 6]
		])
			relative(nullTransform(K, kappa), direct(K, kappa), 1e-9);
		// and the null density has no mass: at (0, 0) the transform vanishes
		expect(Math.abs(direct(0, 1e-9))).toBeLessThan(1e-10 * Math.abs(direct(0, 1)));
	});

	it('the null map’s largest value is the top of its cells', () => {
		const top = Math.max(...NULL_MAP);
		expect(top).toBeLessThanOrEqual(NULL_LARGEST);
		expect(top).toBeGreaterThan(0.995 * NULL_LARGEST);
	});

	it('a cell is shaded only above the floor, brighter toward the top', () => {
		const top = 10;
		expect(shade(0, top, 1e3)).toBe(0);
		expect(shade(top / 1e3 / 1.01, top, 1e3)).toBe(0);
		expect(shade(top / 1e3, top, 1e3)).toBeCloseTo(0.14, 12);
		expect(shade(top, top, 1e3)).toBeCloseTo(1, 12);
		expect(shade(top / 1e3 / 1.01, top, 1e4)).toBeGreaterThan(0);
		expect(shade(1, top, 1e3)).toBeGreaterThan(shade(0.1, top, 1e3));
	});
});

describe('the drawing and the words', () => {
	it('every point of the ellipse has distances to 0 and K that add to κ', () => {
		for (const [k, kp] of [
			[OPENING.k, OPENING.kp],
			[
				{ x: 1, y: 0 },
				{ x: -1, y: 0 }
			],
			[
				{ x: 2, y: -1 },
				{ x: 0.3, y: 2.2 }
			]
		] as [Vec, Vec][]) {
			const p = pair(k, kp);
			for (const q of ellipse(p, 64)) {
				const d = Math.hypot(q.x, q.y) + Math.hypot(p.sum.x - q.x, p.sum.y - q.y);
				expect(d).toBeCloseTo(p.kappa, 12);
			}
		}
	});

	it('the tips stay on the plane and on the keys’ grid', () => {
		expect(kept({ x: 4, y: -3.2 })).toEqual({ x: 3, y: -3 });
		let v = OPENING.kp;
		for (let i = 0; i < 17; i++) v = kept({ x: v.x + 0.05, y: v.y });
		expect(v.x).toBe(0.65);
	});

	it('the dot never leaves the half-plane’s range by more than √2', () => {
		const p = pair({ x: 3, y: 3 }, { x: 3, y: 3 });
		expect(p.kappa).toBeCloseTo(6 * Math.SQRT2, 12);
		expect(p.kappa).toBeGreaterThan(HALF);
	});

	it('numbers read as the chapter prints them', () => {
		expect(sig(1.8315638888734, 3)).toBe('1.83');
		expect(sig(0.7596, 3)).toBe('0.760');
		expect(sig(0.0002707, 3)).toBe('2.71 × 10⁻⁴');
		expect(sig(9999.7, 3)).toBe('1.00 × 10⁴');
		expect(sig(123456, 3)).toBe('1.23 × 10⁵');
		expect(sig(0, 3)).toBe('0');
		expect(sigTex(0.0002707, 3)).toBe('2.71\\times 10^{-4}');
		expect(snrText(3)).toBe('10³');
		expect(snrText(3.5)).toBe('3.2 × 10³');
	});
});
