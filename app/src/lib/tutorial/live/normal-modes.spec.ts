/** Chapter 4.3's disc of masses on springs, against its definitions and the numbers the chapter's figure quotes. */
import { describe, expect, it } from 'vitest';
import {
	BALL,
	COORDS,
	COUNT,
	EDGE,
	EDGE_PULL,
	FIRST_RINGING,
	HIGHEST,
	LOWEST,
	MODES,
	NOTES,
	SITES,
	SPRINGS,
	SQUASH,
	amplitudes,
	edgePulledOut,
	eigenSymmetric,
	noteShares,
	outward,
	pull,
	rayleigh,
	shares,
	squash,
	stiffnessMatrix,
	swing
} from './normal-modes';

const close = (a: number, b: number, tolerance = 1e-12) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.max(1, Math.abs(b)));

/** A seeded uniform generator in [0, 1), so that the random shapes are the same every run. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const times = (K: number[][], v: ArrayLike<number>) =>
	K.map((row) => row.reduce((s, x, k) => s + x * v[k], 0));
const dot = (u: ArrayLike<number>, w: ArrayLike<number>) => {
	let s = 0;
	for (let i = 0; i < u.length; i++) s += u[i] * w[i];
	return s;
};

describe('the disc', () => {
	it('has 19 masses in a hexagon of side two spacings, 42 springs and 38 coordinates', () => {
		expect(SITES).toHaveLength(19);
		expect(COUNT).toBe(19);
		expect(COORDS).toBe(38);
		expect(SPRINGS).toHaveLength(42);
		expect(EDGE).toHaveLength(12);
		for (const [x, y] of SITES) expect(Math.hypot(x, y)).toBeLessThanOrEqual(2 + 1e-12);
		const sx = SITES.reduce((s, [x]) => s + x, 0);
		const sy = SITES.reduce((s, [, y]) => s + y, 0);
		close(sx, 0);
		close(sy, 0);
	});

	it('has a symmetric stiffness matrix whose rows add up to zero', () => {
		const K = stiffnessMatrix();
		for (let i = 0; i < COORDS; i++) {
			for (let j = 0; j < COORDS; j++) close(K[i][j], K[j][i]);
			// a slide stretches nothing, so every row of 𝐊 adds up to zero over the x (and over the y) entries
			close(
				K[i].reduce((s, x, k) => s + (k % 2 === 0 ? x : 0), 0),
				0
			);
		}
	});
});

describe("Jacobi's method", () => {
	it('diagonalizes a symmetric matrix with close eigenvalues', () => {
		const rng = random(7);
		const n = 12;
		const A = Array.from({ length: n }, () => new Array<number>(n).fill(0));
		for (let i = 0; i < n; i++) for (let j = i; j < n; j++) A[i][j] = A[j][i] = rng() - 0.5;
		const { values, vectors } = eigenSymmetric(A);
		for (let i = 1; i < n; i++) expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
		vectors.forEach((v, i) => {
			const Av = times(A, v);
			for (let k = 0; k < n; k++) close(Av[k], values[i] * v[k], 1e-12);
			vectors.forEach((w, j) => close(dot(v, w), i === j ? 1 : 0, 1e-12));
		});
		// the trace and the sum of the eigenvalues agree
		close(
			values.reduce((s, x) => s + x, 0),
			A.reduce((s, row, i) => s + row[i], 0),
			1e-12
		);
	});
});

describe('the modes', () => {
	const K = stiffnessMatrix();

	it('are 38 perpendicular eigenvectors of D, with 𝐊𝐯 = ω²𝐌𝐯', () => {
		expect(MODES).toHaveLength(38);
		MODES.forEach((m, i) => {
			expect(m.index).toBe(i);
			const Kv = times(K, m.v);
			for (let k = 0; k < COORDS; k++) close(Kv[k], m.omega ** 2 * m.v[k], 1e-12);
			MODES.forEach((n, j) => close(dot(m.e, n.e), i === j ? 1 : 0, 1e-12));
		});
	});

	it('include exactly three zero modes, the two slides and the turn', () => {
		const zero = eigenSymmetric(K).values.filter((x) => Math.abs(x) < 1e-10);
		expect(zero).toHaveLength(3);
		expect(MODES.slice(0, 3).map((m) => m.kind)).toEqual(['slide-x', 'slide-y', 'turn']);
		expect(MODES.slice(3).every((m) => m.kind === 'ring' && m.omega > 0.5)).toBe(true);
		// the turn moves each mass at right angles to its place
		const turn = MODES[2].v;
		SITES.forEach(([x, y], a) => close(x * turn[2 * a] + y * turn[2 * a + 1], 0));
	});

	it('have the frequencies the chapter lists, in units of √(k/m)', () => {
		const listed = [
			[0.603, 2],
			[0.68, 2],
			[0.806, 1],
			[0.915, 2],
			[0.917, 1],
			[0.937, 1]
		];
		const ringing = NOTES.filter((n) => !n.zero);
		listed.forEach(([omega, size], i) => {
			expect(Number(ringing[i].omega.toFixed(3))).toBe(omega);
			expect(ringing[i].size).toBe(size);
		});
		expect(Number(HIGHEST.toFixed(3))).toBe(2.295);
		expect(ringing[ringing.length - 1].size).toBe(2);
		expect(Number(LOWEST.toFixed(3))).toBe(0.603);
		expect(NOTES.reduce((s, n) => s + n.size, 0)).toBe(38);
		expect(NOTES.filter((n) => !n.zero).reduce((s, n) => s + n.size, 0)).toBe(35);
	});

	it('put the squash along the axes first in the lowest pair, and the squash at 45° second', () => {
		const a = amplitudes(squash());
		expect(Math.abs(a[3])).toBeGreaterThan(1);
		close(a[4], 0, 1e-12);
		const diagonal = Float64Array.from(SITES.flatMap(([x, y]) => [y, x]));
		const b = amplitudes(diagonal);
		close(b[3], 0, 1e-12);
		expect(Math.abs(b[4])).toBeGreaterThan(1);
	});

	it('are the same, sign and all, every time they are built', () => {
		const sum = MODES.reduce((s, m) => s + m.v.reduce((t, x, k) => t + x * (k + 1), 0), 0);
		expect(Number.isFinite(sum)).toBe(true);
		MODES.forEach((m) => {
			let big = 0;
			for (const x of m.e) big = Math.max(big, Math.abs(x));
			const lead = Array.from(m.e).find((x) => Math.abs(x) >= big * (1 - 1e-6));
			expect(lead).toBeGreaterThan(0);
		});
	});
});

describe('the shares and the quotient', () => {
	it('give shares that add up to one, and zero for the shape at rest', () => {
		const rng = random(3);
		for (let trial = 0; trial < 20; trial++) {
			const q = Float64Array.from({ length: COORDS }, () => rng() - 0.5);
			close(
				shares(amplitudes(q)).reduce((s, x) => s + x, 0),
				1,
				1e-12
			);
			close(
				noteShares(shares(amplitudes(q))).reduce((s, x) => s + x, 0),
				1,
				1e-12
			);
		}
		expect(shares(amplitudes(new Float64Array(COORDS))).every((x) => x === 0)).toBe(true);
		expect(rayleigh(new Float64Array(COORDS)).omega).toBeUndefined();
	});

	it('is the share-weighted average of ω_n² over the ringing modes', () => {
		const rng = random(11);
		for (let trial = 0; trial < 20; trial++) {
			const q = Float64Array.from({ length: COORDS }, () => rng() - 0.5);
			const s = shares(amplitudes(q));
			let w = 0;
			let total = 0;
			for (let n = FIRST_RINGING; n < COORDS; n++) {
				w += s[n] * MODES[n].omega ** 2;
				total += s[n];
			}
			const r = rayleigh(q);
			close(r.omega ?? NaN, Math.sqrt(w / total), 1e-12);
			close(r.zeroShare, 1 - total, 1e-12);
		}
	});

	it('is never below the lowest note, for random shapes smooth and jagged', () => {
		const rng = random(5);
		for (let trial = 0; trial < 2000; trial++) {
			const smooth = trial % 2 === 0;
			const [kx, ky] = [rng() * 2, rng() * 2];
			const q = Float64Array.from({ length: COORDS }, (_, k) => {
				const [x, y] = SITES[k >> 1];
				return smooth ? Math.cos(kx * x + ky * y + k) * (rng() + 0.5) : rng() - 0.5;
			});
			const { omega } = rayleigh(q);
			expect(omega).toBeDefined();
			expect(omega!).toBeGreaterThanOrEqual(LOWEST * (1 - 1e-12));
			expect(omega!).toBeLessThanOrEqual(HIGHEST * (1 + 1e-12));
		}
		// and a lowest mode gives exactly the lowest note
		close(rayleigh(MODES[3].v).omega ?? NaN, LOWEST, 1e-12);
		close(rayleigh(MODES[4].v).omega ?? NaN, LOWEST, 1e-12);
	});

	it('leaves out the zero modes: a slide or a turn added to a shape changes nothing', () => {
		const q = squash(0.1);
		const moved = Float64Array.from(q, (x, k) => x + 0.3 * MODES[0].v[k] - 0.2 * MODES[2].v[k]);
		close(rayleigh(moved).omega ?? NaN, rayleigh(q).omega ?? NaN, 1e-12);
		expect(rayleigh(moved).zeroShare).toBeGreaterThan(0);
		expect(rayleigh(MODES[1].v).omega).toBeUndefined();
	});
});

describe("the figure's numbers", () => {
	it('give the squash 0.661, 9.6% above the lowest note, with 89% in the lowest pair', () => {
		expect(SQUASH.omega.toFixed(3)).toBe('0.661');
		// the quotient of the squash is exactly 7/16
		close(SQUASH.omega ** 2, 7 / 16, 1e-12);
		expect((100 * SQUASH.above).toFixed(1)).toBe('9.6');
		expect(Math.round(100 * SQUASH.lowest)).toBe(89);
		expect(rayleigh(squash()).zeroShare).toBeLessThan(1e-24);
	});

	it('give one edge mass pulled straight outward 2.09 times the lowest note, whichever edge mass it is', () => {
		expect(EDGE_PULL.ratio.toFixed(2)).toBe('2.09');
		close(EDGE_PULL.zeroShare, 1 / 19, 1e-12);
		for (const a of EDGE) {
			const [ox, oy] = outward(a);
			const q = pull(a, 0.2 * ox, 0.2 * oy);
			close((rayleigh(q).omega ?? NaN) / LOWEST, EDGE_PULL.ratio, 1e-10);
			expect(edgePulledOut(q)).toBe(a);
		}
		expect(BALL).toEqual({ above: 0.14, share: 0.85 });
	});

	it('count a pull as one edge mass pulled outward only when it is', () => {
		const a = EDGE[0];
		const [ox, oy] = outward(a);
		expect(edgePulledOut(pull(a, 0.2 * ox, 0.2 * oy))).toBe(a);
		// sideways, inward, too small, an inner mass, or two masses
		expect(edgePulledOut(pull(a, -0.2 * oy, 0.2 * ox))).toBeUndefined();
		expect(edgePulledOut(pull(a, -0.2 * ox, -0.2 * oy))).toBeUndefined();
		expect(edgePulledOut(pull(a, 0.01 * ox, 0.01 * oy))).toBeUndefined();
		const inner = SITES.findIndex(([x, y]) => Math.hypot(x, y) < 1.5 && Math.hypot(x, y) > 0.5);
		expect(edgePulledOut(pull(inner, 0.2, 0))).toBeUndefined();
		const two = pull(a, 0.2 * ox, 0.2 * oy);
		two[2 * inner] = 0.1;
		expect(edgePulledOut(two)).toBeUndefined();
	});
});

describe('the swing', () => {
	it('starts from the released shape, keeps the zero-mode parts and follows 𝐌q̈ = −𝐊q', () => {
		const q0 = Float64Array.from(squash(0.1), (x, k) => x + 0.05 * MODES[0].v[k]);
		const a = amplitudes(q0);
		const out = new Float64Array(COORDS);
		swing(a, 0, out);
		for (let k = 0; k < COORDS; k++) close(out[k], q0[k], 1e-12);
		// the second derivative by differences, against −𝐊q/m
		const K = stiffnessMatrix();
		const t = 3.7;
		const h = 1e-3;
		const at = (s: number) => Float64Array.from(swing(a, s, new Float64Array(COORDS)));
		const [before, now, after] = [at(t - h), at(t), at(t + h)];
		const force = times(K, now);
		for (let k = 0; k < COORDS; k++)
			close((after[k] - 2 * now[k] + before[k]) / (h * h), -force[k], 1e-5);
		// the slide part stays: the mean displacement along x is the same at every time
		const meanX = (q: Float64Array) => q.reduce((s, x, k) => s + (k % 2 === 0 ? x : 0), 0);
		close(meanX(now), meanX(q0), 1e-12);
	});
});
