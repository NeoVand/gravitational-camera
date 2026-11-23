/**
 * Chapter 4.2's warm molecule, for its live figure. Six masses lie at the corners of a regular hexagon of side 1, in
 * the plane, each joined to its two neighbours and its two next neighbours by springs whose rest lengths are the
 * hexagon's, 1 and √3: twelve springs in all. Two opposite masses, 0 and 3, can be made heavier; the other four keep
 * the mass 1. The units are arbitrary: lengths in sides of the hexagon, masses in the light mass, energies in the
 * k_BT at which the figure opens. The springs then have the stiffness k = 100 at ×1, so that heat stretches a side
 * by about a tenth of itself, √(k_BT/k).
 *
 * The molecule sits in a heat bath, the Langevin bath of chapter 4.6: each mass feels the friction −mΓv, with Γ the
 * damping rate of chapter 4.1, and a random force whose strength matches it, so that the bath brings the molecule
 * to the temperature T. Its motion is integrated by the splitting scheme BAOAB (Leimkuhler and Matthews, 2013): a
 * half kick by the springs (B), half a drift (A), the bath's friction and random kick taken exactly over the whole
 * step (O), half a drift and a half kick. Γ is a fifth of the highest mode's angular frequency, and the step a fifth
 * of the inverse of it.
 *
 * The figure's readouts are running averages. Each step samples the velocities just after the bath's step, together
 * with the positions at that half step. There BAOAB's velocities follow the Maxwell distribution exactly for a
 * harmonic body; at the end of the step a mode of angular frequency ω would be too slow by the fraction h²ω²/4 in
 * mean square. The moments are taken about the molecule's centre of mass, which wanders: Q_x = M X and
 * Q_xy = Σ m (x − X)(y − Y), so
 *
 *   Q̇_x = Σ m v_x,      Q̇_xy = Σ m [v_x (y − Y) + v_y (x − X)],
 *
 * the terms in the centre's own velocity cancelling exactly because Σ m (x − X) = 0. The chapter's equation then
 * says ⟨Q̇_x²⟩ = k_BT M and ⟨Q̇_xy²⟩ = k_BT ⟨Σ m (x² + y²)⟩, with x and y measured from the centre. Standard errors
 * come from the means of blocks of steps, each much longer than the time in which the velocities forget themselves.
 */

// --- the molecule ------------------------------------------------------------------------------------------------

/** The number of masses, at the corners of the hexagon. */
export const CORNERS = 6;
/** The rest lengths of the springs: a side, and the distance to the next neighbour but one. */
export const SIDE = 1;
export const ACROSS = Math.sqrt(3);
/** The springs: the two masses each joins, and its rest length. Six sides, then six next neighbours. */
export const SPRINGS: readonly (readonly [number, number, number])[] = [
	...Array.from({ length: CORNERS }, (_, a) => [a, (a + 1) % CORNERS, SIDE] as const),
	...Array.from({ length: CORNERS }, (_, a) => [a, (a + 2) % CORNERS, ACROSS] as const)
];
/** The two opposite masses that can be made heavier, and the four that keep the mass 1. */
export const HEAVY: readonly number[] = [0, 3];
export const LIGHT: readonly number[] = [1, 2, 4, 5];
/** The springs' stiffness at ×1, with the light mass 1 and k_BT = 1. */
export const STIFFNESS = 100;

/** The steps of the three controls: the heavy pair's mass, the springs' stiffness and k_BT, each as a factor. */
export const HEAVIER: readonly number[] = [1, 2, 4, 8, 16];
export const STIFFER: readonly number[] = [0.1, 0.2, 0.5, 1, 2, 5, 10];
export const WARMER: readonly number[] = [0.25, 0.5, 1, 2, 4];

export interface Settings {
	/** The mass of the heavy pair, in light masses. */
	heavy: number;
	/** The springs' stiffness, as a factor of k = 100. */
	stiffness: number;
	/** k_BT, as a factor of the opening's. */
	temperature: number;
}

/** Where the figure opens: equal masses, stiffness ×1, k_BT = 1. */
export const OPENING: Settings = { heavy: 1, stiffness: 1, temperature: 1 };

/** Γ as a share of the highest mode's angular frequency, and the step h as a share of its inverse. */
export const DAMPING_SHARE = 0.2;
export const STEP_SHARE = 0.2;
/** The seed of the random force, the same at every restart. */
export const SEED = 2;

/** The six masses. */
export function masses(heavy: number): Float64Array {
	const m = new Float64Array(CORNERS).fill(1);
	for (const a of HEAVY) m[a] = heavy;
	return m;
}

/** The total mass M. */
export const totalMass = (heavy: number) => LIGHT.length + HEAVY.length * heavy;

/** The hexagon at rest, centred on the origin, mass 0 on the positive x axis: x₀, y₀, x₁, y₁, … */
export function hexagon(): Float64Array {
	const x = new Float64Array(2 * CORNERS);
	for (let a = 0; a < CORNERS; a++) {
		const t = (a * Math.PI) / 3;
		x[2 * a] = SIDE * Math.cos(t);
		x[2 * a + 1] = SIDE * Math.sin(t);
	}
	return x;
}

// --- the modes -----------------------------------------------------------------------------------------------------

/** The eigenvalues of a symmetric matrix, by Jacobi's rotations, in increasing order. */
export function eigenvalues(matrix: number[][]): number[] {
	const n = matrix.length;
	const a = matrix.map((row) => row.slice());
	for (let sweep = 0; sweep < 100; sweep++) {
		let off = 0;
		for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
		if (off < 1e-24) break;
		for (let p = 0; p < n; p++)
			for (let q = p + 1; q < n; q++) {
				if (Math.abs(a[p][q]) < 1e-300) continue;
				const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
				const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
				const c = 1 / Math.sqrt(t * t + 1);
				const s = t * c;
				for (let k = 0; k < n; k++) {
					const akp = a[k][p];
					const akq = a[k][q];
					a[k][p] = c * akp - s * akq;
					a[k][q] = s * akp + c * akq;
				}
				for (let k = 0; k < n; k++) {
					const apk = a[p][k];
					const aqk = a[q][k];
					a[p][k] = c * apk - s * aqk;
					a[q][k] = s * apk + c * aqk;
				}
			}
	}
	return a.map((row, i) => row[i]).sort((x, y) => x - y);
}

/**
 * The angular frequencies of the molecule's twelve modes about the hexagon at rest, in increasing order: three zero
 * (two of moving as a whole, one of turning) and nine of changing shape. They are the square roots of the
 * eigenvalues of M^{−1/2} K M^{−1/2}, where K is the springs' matrix of second derivatives of the energy.
 */
export function modes(s: Settings): number[] {
	const k = STIFFNESS * s.stiffness;
	const m = masses(s.heavy);
	const x = hexagon();
	const K = Array.from({ length: 2 * CORNERS }, () => new Array<number>(2 * CORNERS).fill(0));
	for (const [a, b] of SPRINGS) {
		const dx = x[2 * b] - x[2 * a];
		const dy = x[2 * b + 1] - x[2 * a + 1];
		const r = Math.hypot(dx, dy);
		const n = [dx / r, dy / r];
		for (let i = 0; i < 2; i++)
			for (let j = 0; j < 2; j++) {
				const e = k * n[i] * n[j];
				K[2 * a + i][2 * a + j] += e;
				K[2 * b + i][2 * b + j] += e;
				K[2 * a + i][2 * b + j] -= e;
				K[2 * b + i][2 * a + j] -= e;
			}
	}
	const D = K.map((row, i) => row.map((e, j) => e / Math.sqrt(m[i >> 1] * m[j >> 1])));
	return eigenvalues(D).map((l) => Math.sqrt(Math.max(0, l)));
}

/** The highest mode's angular frequency. */
export const highest = (s: Settings) => modes(s)[2 * CORNERS - 1];
/** The bath's damping rate Γ: a fifth of the highest mode's angular frequency. */
export const damping = (s: Settings) => DAMPING_SHARE * highest(s);
/** The step h: a fifth of the inverse of the highest mode's angular frequency. */
export const timeStep = (s: Settings) => STEP_SHARE / highest(s);

// --- the moments -------------------------------------------------------------------------------------------------

/** The centre of mass of the positions `x` with the masses `m`. */
export function centre(x: ArrayLike<number>, m: ArrayLike<number>): { X: number; Y: number } {
	let M = 0;
	let X = 0;
	let Y = 0;
	for (let a = 0; a < m.length; a++) {
		M += m[a];
		X += m[a] * x[2 * a];
		Y += m[a] * x[2 * a + 1];
	}
	return { X: X / M, Y: Y / M };
}

/** Σ m (x² + y²), with x and y measured from the centre of mass. */
export function spread(x: ArrayLike<number>, m: ArrayLike<number>): number {
	const { X, Y } = centre(x, m);
	let s = 0;
	for (let a = 0; a < m.length; a++) s += m[a] * ((x[2 * a] - X) ** 2 + (x[2 * a + 1] - Y) ** 2);
	return s;
}

/** The two rates of change: Q̇_x = Σ m v_x, and Q̇_xy = Σ m [v_x (y − Y) + v_y (x − X)] about the centre. */
export function rates(
	x: ArrayLike<number>,
	v: ArrayLike<number>,
	m: ArrayLike<number>
): { qx: number; qxy: number } {
	const { X, Y } = centre(x, m);
	let qx = 0;
	let qxy = 0;
	for (let a = 0; a < m.length; a++) {
		qx += m[a] * v[2 * a];
		qxy += m[a] * (v[2 * a] * (x[2 * a + 1] - Y) + v[2 * a + 1] * (x[2 * a] - X));
	}
	return { qx, qxy };
}

// --- the running averages ----------------------------------------------------------------------------------------

/** What each step samples, in this order. */
export const Q = {
	/** ½ m v² of a light mass, averaged over the four, in units of k_BT. */
	LightEnergy: 0,
	/** ½ m v² of a heavy mass, averaged over the two, in units of k_BT. */
	HeavyEnergy: 1,
	/** Q̇_x², in units of k_BT M. */
	CentreRate: 2,
	/** Q̇_xy². */
	ShapeRate: 3,
	/** k_BT Σ m (x² + y²), about the centre. */
	Spread: 4
} as const;
export type Quantity = (typeof Q)[keyof typeof Q];
const QUANTITIES = 5;

/** A number and its standard error. */
export interface Estimate {
	mean: number;
	error: number;
}

/** The steps averaged into one block; the standard errors come from the scatter of the blocks' means. */
export const BLOCK = 1000;
/** The steps left out at the start, while the springs come to the bath's temperature. */
export const SETTLE = 2000;
/** The fewest blocks for which a standard error is given. */
export const FEWEST_BLOCKS = 20;
/** The steps after which the averages stop: their standard error on ⟨Q̇_xy²⟩ is then about 0.08%. */
export const MOST_STEPS = 5e7;

/**
 * k_BT ⟨Σ m (x² + y²)⟩ about the centre, with equal masses at k_BT = 1, at stiffness ×0.1, ×1 and ×10: the chapter's
 * numbers, which the spec checks against long runs. The rigid hexagon has 6; heat stretches the springs and adds a
 * little, the less the stiffer they are.
 */
export const SPREADS: readonly { stiffness: number; value: number }[] = [
	{ stiffness: 0.1, value: 6.13 },
	{ stiffness: 1, value: 6.02 },
	{ stiffness: 10, value: 6.0 }
];
/** How much smaller ⟨Q̇_xy²⟩ is at stiffness ×10 than at ×1, with equal masses at k_BT = 1: 0.3%. */
export const SHRINK = 0.003;

/** Running averages of the five sampled quantities, by blocks. */
export class Tally {
	/** The steps taken, including those left out at the start. */
	steps = 0;
	/** The blocks completed. */
	blocks = 0;
	private readonly block = new Float64Array(QUANTITIES);
	private inBlock = 0;
	private readonly sum = new Float64Array(QUANTITIES);
	private readonly products = new Float64Array(QUANTITIES * QUANTITIES);

	/** Adds one step's sample; the steps of the first SETTLE are only counted. */
	add(sample: Float64Array) {
		this.steps++;
		if (this.steps <= SETTLE) return;
		for (let i = 0; i < QUANTITIES; i++) this.block[i] += sample[i];
		if (++this.inBlock < BLOCK) return;
		for (let i = 0; i < QUANTITIES; i++) {
			const bi = this.block[i] / BLOCK;
			this.sum[i] += bi;
			for (let j = 0; j <= i; j++)
				this.products[i * QUANTITIES + j] += (bi * this.block[j]) / BLOCK;
		}
		this.block.fill(0);
		this.inBlock = 0;
		this.blocks++;
	}

	/** The mean of a quantity over the completed blocks. */
	mean(i: Quantity): number {
		return this.blocks ? this.sum[i] / this.blocks : NaN;
	}

	/** The covariance of the means of two quantities, from the scatter of the blocks. */
	private covariance(i: Quantity, j: Quantity): number {
		const n = this.blocks;
		if (n < 2) return NaN;
		const [p, q] = i >= j ? [i, j] : [j, i];
		return (this.products[p * QUANTITIES + q] / n - this.mean(i) * this.mean(j)) / (n - 1);
	}

	/** A quantity's mean and its standard error. */
	estimate(i: Quantity): Estimate {
		return { mean: this.mean(i), error: Math.sqrt(Math.max(0, this.covariance(i, i))) };
	}

	/** The ratio of two means, with its standard error to first order. */
	ratio(i: Quantity, j: Quantity, scale = 1): Estimate {
		const a = this.mean(i);
		const b = this.mean(j);
		const r = a / b;
		const v =
			this.covariance(i, i) / (a * a) +
			this.covariance(j, j) / (b * b) -
			(2 * this.covariance(i, j)) / (a * b);
		return { mean: scale * r, error: Math.abs(scale * r) * Math.sqrt(Math.max(0, v)) };
	}

	/** Whether there are blocks enough for a standard error. */
	get ready(): boolean {
		return this.blocks >= FEWEST_BLOCKS;
	}
}

/** The root mean square speed of a heavy mass over a light one's: √(⟨v²⟩_heavy/⟨v²⟩_light) = √(E_h m_l/E_l m_h). */
export function speedRatio(t: Tally, heavy: number): Estimate {
	const r = t.ratio(Q.HeavyEnergy, Q.LightEnergy, 1 / heavy);
	const mean = Math.sqrt(r.mean);
	return { mean, error: r.error / (2 * mean) };
}

// --- the motion ----------------------------------------------------------------------------------------------------

/** The springs, flat: the first mass, the second, and the rest length, for the inner loop. */
const FROM = Int32Array.from(SPRINGS, ([a]) => 2 * a);
const TO = Int32Array.from(SPRINGS, ([, b]) => 2 * b);
const REST = Float64Array.from(SPRINGS, ([, , r]) => r);
const LIGHT_SET = new Uint8Array(CORNERS).map((_, a) => (LIGHT.includes(a) ? 1 : 0));

/**
 * The molecule in its bath: positions, velocities, the springs' forces and the random force's generator, a seeded
 * mulberry32 (the generator of ./graviton-count.ts) with Gaussian numbers by Marsaglia's polar method.
 */
export class Molecule {
	readonly x = hexagon();
	readonly v = new Float64Array(2 * CORNERS);
	private readonly f = new Float64Array(2 * CORNERS);
	private readonly invMass = new Float64Array(2 * CORNERS);
	private m = masses(1);
	private M = CORNERS;
	private k = STIFFNESS;
	private kT = 1;
	/** The bath's damping rate Γ, and the step h that the run takes. */
	gamma = 0;
	h = 0;
	/** The step last used, and the bath's factors for it: e^{−Γh}, and the random kick's size for each mass. */
	private used = 0;
	private fade = 0;
	private readonly kick = new Float64Array(CORNERS);
	private seed: number;
	private readonly sample = new Float64Array(QUANTITIES);
	/** The time the molecule has run, in the figure's units. */
	time = 0;

	constructor(s: Settings, seed = SEED) {
		this.seed = seed >>> 0;
		this.set(s);
		// the velocities start in the bath's distribution, the shape at rest
		const g = new Float64Array(2 * CORNERS);
		this.normals(g);
		for (let i = 0; i < 2 * CORNERS; i++) this.v[i] = Math.sqrt(this.kT / this.m[i >> 1]) * g[i];
	}

	/** New settings, keeping the molecule where it is and as fast as it is. */
	set(s: Settings) {
		this.m = masses(s.heavy);
		this.M = totalMass(s.heavy);
		for (let i = 0; i < 2 * CORNERS; i++) this.invMass[i] = 1 / this.m[i >> 1];
		this.k = STIFFNESS * s.stiffness;
		this.kT = s.temperature;
		const w = highest(s);
		this.gamma = DAMPING_SHARE * w;
		this.h = STEP_SHARE / w;
		this.used = 0;
		this.forces();
	}

	get mass(): Float64Array {
		return this.m;
	}

	/** The bath's factors for the step `h`. */
	private use(h: number) {
		if (h === this.used) return;
		this.used = h;
		this.fade = Math.exp(-this.gamma * h);
		const spread = Math.sqrt(1 - this.fade * this.fade);
		for (let a = 0; a < CORNERS; a++) this.kick[a] = spread * Math.sqrt(this.kT / this.m[a]);
	}

	/** Fills `out` with standard Gaussian numbers, two at a time, by Marsaglia's polar method. */
	private normals(out: Float64Array) {
		let s = this.seed;
		for (let i = 0; i < out.length; i += 2) {
			let u: number;
			let w: number;
			let r: number;
			do {
				s = (s + 0x6d2b79f5) >>> 0;
				let t = s;
				t = Math.imul(t ^ (t >>> 15), t | 1);
				t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
				u = (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
				s = (s + 0x6d2b79f5) >>> 0;
				t = s;
				t = Math.imul(t ^ (t >>> 15), t | 1);
				t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
				w = (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
				r = u * u + w * w;
			} while (r >= 1 || r === 0);
			const c = Math.sqrt((-2 * Math.log(r)) / r);
			out[i] = u * c;
			out[i + 1] = w * c;
		}
		this.seed = s;
	}

	/** The springs' forces at the present positions. */
	private forces() {
		const { x, f, k } = this;
		f.fill(0);
		for (let j = 0; j < FROM.length; j++) {
			const a = FROM[j];
			const b = TO[j];
			const dx = x[b] - x[a];
			const dy = x[b + 1] - x[a + 1];
			const r = Math.sqrt(dx * dx + dy * dy);
			const s = (k * (r - REST[j])) / r;
			f[a] += s * dx;
			f[a + 1] += s * dy;
			f[b] -= s * dx;
			f[b + 1] -= s * dy;
		}
	}

	/** Takes `n` steps of BAOAB of the size `h`, adding each step's sample to `tally` if given. */
	run(n: number, tally?: Tally, h = this.h) {
		this.use(h);
		const { x, v, f, invMass, fade, kick, sample } = this;
		const half = h / 2;
		const n2 = 2 * CORNERS;
		const g = new Float64Array(n2);
		for (let step = 0; step < n; step++) {
			for (let i = 0; i < n2; i++) {
				v[i] += half * f[i] * invMass[i];
				x[i] += half * v[i];
			}
			this.normals(g);
			for (let i = 0; i < n2; i++) v[i] = fade * v[i] + kick[i >> 1] * g[i];
			if (tally) {
				this.measure(sample);
				tally.add(sample);
			}
			for (let i = 0; i < n2; i++) x[i] += half * v[i];
			this.forces();
			for (let i = 0; i < n2; i++) v[i] += half * f[i] * invMass[i];
		}
		this.time += n * h;
	}

	/** Runs for the time `duration`, in steps no longer than the run's own, without sampling: for the drawing. */
	advance(duration: number) {
		if (duration <= 0) return;
		const n = Math.ceil(duration / this.h - 1e-9);
		this.run(n, undefined, duration / n);
	}

	/** The five quantities at this instant, into `out`. */
	measure(out: Float64Array) {
		const { x, v, m, M, kT } = this;
		let light = 0;
		let heavy = 0;
		let px = 0;
		let X = 0;
		let Y = 0;
		for (let a = 0; a < CORNERS; a++) {
			const e = 0.5 * m[a] * (v[2 * a] * v[2 * a] + v[2 * a + 1] * v[2 * a + 1]);
			if (LIGHT_SET[a]) light += e;
			else heavy += e;
			px += m[a] * v[2 * a];
			X += m[a] * x[2 * a];
			Y += m[a] * x[2 * a + 1];
		}
		X /= M;
		Y /= M;
		let qxy = 0;
		let r2 = 0;
		for (let a = 0; a < CORNERS; a++) {
			const dx = x[2 * a] - X;
			const dy = x[2 * a + 1] - Y;
			qxy += m[a] * (v[2 * a] * dy + v[2 * a + 1] * dx);
			r2 += m[a] * (dx * dx + dy * dy);
		}
		out[Q.LightEnergy] = light / LIGHT.length / kT;
		out[Q.HeavyEnergy] = heavy / HEAVY.length / kT;
		out[Q.CentreRate] = (px * px) / (kT * M);
		out[Q.ShapeRate] = qxy * qxy;
		out[Q.Spread] = kT * r2;
	}
}
