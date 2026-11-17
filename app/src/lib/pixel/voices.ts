/**
 * One ear, many voices: plane waves from fixed directions, each with its own waveform in both polarizations, read
 * by one pixel over time; the directions found from the readings alone (paper, Eq. four-waves). Gravity separates up
 * to four, light two. Used by the demo "One pixel, four voices" (routes/demo/four-voices).
 */
import {
	abs,
	add,
	cdot,
	cx,
	hermitianEigen,
	mul,
	conj,
	norm,
	ZERO,
	type CMat3,
	type Complex,
	type CVec3,
	type Vec3
} from './complex';
import { lightStars, mat5, nullFrame, stars, vec5 } from './pixel';

/** The waveforms of the voices, complex (the two polarizations), at time t in seconds. */
const VOICES: ((t: number) => Complex)[] = [
	// a rising and falling chirp, circularly polarized
	(t) => {
		const ph = 2 * Math.PI * (1.1 * t + 0.35 * Math.sin(0.9 * t));
		return cx(Math.cos(ph), Math.sin(ph));
	},
	// bursts, mostly in one polarization
	(t) => {
		const s = ((t % 3.2) + 3.2) % 3.2;
		const env = Math.exp(-(((s - 1.6) / 0.45) ** 2)) + 0.08;
		return cx(env * Math.cos(2 * Math.PI * 2.3 * t), 0.4 * env * Math.sin(2 * Math.PI * 2.3 * t));
	},
	// a slow hum, linearly polarized
	(t) => cx(0.8 * Math.sin(2 * Math.PI * 0.37 * t + 0.4), 0),
	// a rumble: a few incommensurate tones
	(t) =>
		cx(
			0.35 * Math.sin(2.1 * t + 0.3) +
				0.3 * Math.sin(3.7 * t + 1.9) +
				0.25 * Math.sin(5.3 * t + 0.7),
			0.3 * Math.sin(1.7 * t + 2.2) + 0.3 * Math.sin(4.4 * t + 0.1)
		),
	// a fifth, for showing what happens when there are too many
	(t) => cx(0.6 * Math.cos(2 * Math.PI * 0.8 * t + 1.1), 0.5 * Math.sin(2 * Math.PI * 1.3 * t))
];

export const VOICE_COUNT = VOICES.length;
export const voice = (i: number, t: number) => VOICES[i](t);

/** A deterministic normal deviate per (sample, channel), so that the noise does not flicker between frames. */
function gauss(seed: number): number {
	const h = (x: number) => {
		const s = Math.sin(x * 12.9898 + 78.233) * 43758.5453;
		return s - Math.floor(s);
	};
	const u = Math.max(1e-12, h(seed)),
		v = h(seed + 0.5);
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface Reading {
	t: number;
	W: CMat3;
	F: CVec3;
}

/**
 * What the pixel reads at time t from waves arriving from `from` (unit directions toward the sources), each with the
 * matching voice: gravity's W = sum a m m^T and light's F = sum a m, with m = nullFrame(-n); and white noise of
 * size `noise` on each of the five (three) complex numbers.
 */
export function read(from: Vec3[], t: number, noise = 0, step = 0): Reading {
	const ms = from.map((n) => nullFrame([-n[0], -n[1], -n[2]]));
	const a = from.map((_, i) => voice(i, t));
	const W5: Complex[] = [0, 1, 2, 3, 4].map(() => ZERO);
	const F: CVec3 = [ZERO, ZERO, ZERO];
	ms.forEach((m, i) => {
		const mm = vec5([0, 1, 2].map((r) => [0, 1, 2].map((c) => mul(m[r], m[c]))) as CMat3);
		mm.forEach((z, k) => (W5[k] = add(W5[k], mul(z, a[i]))));
		m.forEach((z, k) => (F[k] = add(F[k], mul(z, a[i]))));
	});
	if (noise > 0) {
		W5.forEach(
			(z, k) => (W5[k] = add(z, cx(noise * gauss(step * 31 + k), noise * gauss(step * 31 + k + 7))))
		);
		F.forEach(
			(z, k) =>
				(F[k] = add(z, cx(noise * gauss(step * 37 + k + 13), noise * gauss(step * 37 + k + 19))))
		);
	}
	return { t, W: mat5(W5), F };
}

export interface Found {
	/** directions toward the sources found */
	directions: Vec3[];
	/** how many independent combinations of the numbers stay at zero: 5 - waves (gravity), 3 - waves (light) */
	silent: number;
	/** the annihilators: the map of the sky is the sum of |m^T A m|^2 (or |m . a|^2) over them */
	map: (n: Vec3) => number;
}

/**
 * The silent combinations of a series of readings (rows): the eigenvectors of R^H R whose eigenvalues are below
 * `floor` times the largest, or, with noise sigma per number, below four times the noise's share.
 */
function silent(rows: Complex[][], sigma: number, floor = 1e-9): Complex[][] {
	const n = rows[0].length;
	const H = Array.from({ length: n }, (_, i) =>
		Array.from({ length: n }, (_, j) => rows.reduce((s, r) => add(s, mul(conj(r[i]), r[j])), ZERO))
	);
	const { values, vectors } = hermitianEigen(H);
	const top = values[values.length - 1];
	const limit = Math.max(floor * top, 4 * rows.length * 2 * sigma * sigma);
	return vectors.filter((_, k) => values[k] < limit);
}

const unitNull = (n: Vec3) => {
	const m = nullFrame([-n[0], -n[1], -n[2]]);
	const len = Math.sqrt(m.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0));
	return m.map((z) => cx(z.re / len, z.im / len)) as CVec3;
};

/** Gravity: the directions of up to four waves from their readings. */
export function findGravity(readings: Reading[], sigma = 0): Found {
	const null5 = silent(
		readings.map((r) => vec5(r.W)),
		sigma
	);
	const As = null5.map(mat5);
	const map = (n: Vec3) => {
		const m = unitNull(n);
		return As.reduce((s, A) => {
			const q = cdot(m, [0, 1, 2].map((i) => cdot(A[i], m)) as CVec3);
			return s + q.re * q.re + q.im * q.im;
		}, 0);
	};
	return {
		directions: common(As.length ? stars(As[0]) : [], map, As.length),
		silent: As.length,
		map
	};
}

/** Light: the directions of up to two waves from their readings. */
export function findLight(readings: Reading[], sigma = 0): Found {
	const null3 = silent(
		readings.map((r) => r.F),
		sigma
	);
	const map = (n: Vec3) => {
		const m = unitNull(n);
		return null3.reduce((s, a) => s + abs(cdot(m, a as CVec3)) ** 2, 0);
	};
	return {
		directions: common(null3.length ? lightStars(null3[0] as CVec3) : [], map, null3.length),
		silent: null3.length,
		map
	};
}

/** Of the candidate directions of travel, those where every silent combination vanishes, as source directions. */
function common(candidates: Vec3[], map: (n: Vec3) => number, count: number): Vec3[] {
	if (!count) return [];
	const out: Vec3[] = [];
	for (const k of candidates) {
		const n: Vec3 = [-k[0], -k[1], -k[2]];
		if (
			map(n) < 1e-3 * count &&
			!out.some((o) => norm([o[0] - n[0], o[1] - n[1], o[2] - n[2]]) < 0.02)
		)
			out.push(n);
	}
	return out;
}
