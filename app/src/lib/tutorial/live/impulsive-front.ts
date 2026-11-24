/**
 * Chapter 13.5's impulsive front, made live. A body of 200 particles, seeded and fixed, in a disc of radius R on the
 * plane of the front, meets the wave ds² = −du dv + H(x⊥) δ(u) du² + dx⊥² with one of three profiles harmonic across
 * the front:
 *
 *     Aichelburg and Sexl's   H = −k ln|x⊥ − b|,            k = 8Gp/c³, the field of a particle without mass;
 *     the quadrupolar         H = (x² − y²)/2f;
 *     13.2's pair, real part  H = A Re e^{ζ₊·x⊥},          ζ₊ = ½(iξ + η), η ⟂ ξ and as long.
 *
 * Each particle keeps q = E/c − p_z and takes the sideways momentum ½q∇H where it crosses (the chapter's boxed kick).
 * Its energy changes by the paper's eq:proof-shock,
 *
 *     ΔE = (c/2q) (|p⊥ + ½q∇H|² − p⊥²),
 *
 * and the reverse wave, of profile −H, gives the same with ∇H reversed. Summed over the body, E₊ + E₋ − 2E₀ is
 * ¼Σ c q_a |∇H(x_a)|², the paper's ¼∫|∇H|²𝒩 with 𝒩 = c Σ q_a δ²(x⊥ − x_a); and the rest mass changes by the paper's
 * eq:proof-mass, M₊² + M₋² − 2M₀² = Q² Var(∇H)/2c², with Q = Σq_a and the variance weighted by q_a/Q.
 *
 * Units: lengths in R, speeds in c, masses in the body's M = Σ m_a (so c = R = M = 1). Momenta are then in Mc,
 * energies in Mc², and H in R; ∇H is a pure number. The body's parts drift slowly sideways, each with q = mc when the
 * body is at rapidity 0 (their tiny p_z = p⊥²/2mc makes it so), and the body as a whole moves along z with the
 * rapidity r, which multiplies every q by e^r: r < 0 moves with the front, r > 0 against it.
 */
import { uniform } from '../../array/random';

// --- the ranges ------------------------------------------------------------------------------------------------------

/** The plane of the front is drawn from −3R to 3R in x and in y. */
export const VIEW = 3;
/** The number of the body's particles, its seed, and the root-mean-square speed of their drift across the front. */
export const COUNT = 200;
export const SEED = 13_05;
export const STIR = 3e-4;

/** The crossing point b: kept at least NEAREST from the body's centre, inside the view; it opens at (1.5R, 0). */
export const NEAREST = 1.12;
export const EDGE = 2.85;
export const OPENING_B: Vec = [1.5, 0];
/** The arrow keys move b by 0.05 R. */
export const B_STEP = 0.05;

/** The strength, the largest |∇H| on the body, as log₁₀: 10⁻⁴ to 10⁻². */
export const STRENGTH = { min: -4, max: -2, step: 0.05, opening: -3 };
/** The body's rapidity along −z: q/mc = e^r. */
export const RAPIDITY = { min: -3, max: 3, step: 0.05, opening: 0 };
/** 13.2's |ξ|, in 1/R, and its direction, in degrees anticlockwise from x. */
export const XI = { min: 0.5, max: 6, step: 0.05, opening: 2 };
export const TURN = { min: 0, max: 355, step: 5, opening: 30 };

export type Vec = [number, number];
export type Profile = 'as' | 'quad' | 'pair';
export type Sign = 1 | -1;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// --- the body ------------------------------------------------------------------------------------------------------

/** A particle of the body: its place on the front, its mass, and its sideways momentum, in M, R and Mc. */
export interface Particle {
	x: number;
	y: number;
	m: number;
	px: number;
	py: number;
}

/**
 * The seeded body: places uniform in the unit disc, masses from 0.6 to 1.4 of the mean, scaled to add to 1, and
 * sideways velocities with a normal spread of STIR c in each direction, less their mass-weighted mean, so that the
 * body as a whole has no sideways momentum.
 */
export function makeBody(seed = SEED, count = COUNT, stir = STIR): Particle[] {
	const next = uniform(seed);
	const raw = Array.from({ length: count }, () => {
		const r = Math.sqrt(next());
		const t = 2 * Math.PI * next();
		const m = 0.6 + 0.8 * next();
		// Box–Muller, two normals from two draws; 1 − u is in (0, 1]
		const g = Math.sqrt(-2 * Math.log(1 - next()));
		const a = 2 * Math.PI * next();
		return {
			x: r * Math.cos(t),
			y: r * Math.sin(t),
			m,
			vx: stir * g * Math.cos(a),
			vy: stir * g * Math.sin(a)
		};
	});
	const total = raw.reduce((s, p) => s + p.m, 0);
	const mx = raw.reduce((s, p) => s + p.m * p.vx, 0) / total;
	const my = raw.reduce((s, p) => s + p.m * p.vy, 0) / total;
	return raw.map((p) => {
		const m = p.m / total;
		return { x: p.x, y: p.y, m, px: m * (p.vx - mx), py: m * (p.vy - my) };
	});
}

export const BODY = makeBody();

// --- the profiles ----------------------------------------------------------------------------------------------------

/** A profile of unit amplitude: H and its gradient across the front. */
export interface Shape {
	H: (x: number, y: number) => number;
	grad: (x: number, y: number) => Vec;
}

/** Aichelburg and Sexl's profile with k = 1: H = −ln|x⊥ − b|, ∇H = (b − x⊥)/|x⊥ − b|². */
export function logarithm(b: Vec): Shape {
	return {
		H: (x, y) => -0.5 * Math.log((x - b[0]) ** 2 + (y - b[1]) ** 2),
		grad: (x, y) => {
			const [dx, dy] = [b[0] - x, b[1] - y];
			const d2 = dx * dx + dy * dy;
			return [dx / d2, dy / d2];
		}
	};
}

/** The quadrupolar profile with f = 1: H = (x² − y²)/2, ∇H = (x, −y). */
export const QUADRUPOLE: Shape = {
	H: (x, y) => 0.5 * (x * x - y * y),
	grad: (x, y) => [x, -y]
};

/** ξ of length |ξ| at the angle θ (degrees), and η, ξ turned a quarter anticlockwise. */
export function wavevectors(size: number, turn: number): { xi: Vec; eta: Vec } {
	const t = (turn * Math.PI) / 180;
	const [c, s] = [Math.cos(t), Math.sin(t)];
	return { xi: [size * c, size * s], eta: [-size * s, size * c] };
}

/**
 * The real part of 13.2's h₊ = e^{ζ₊·x⊥}, ζ₊ = ½(iξ + η): H = e^{η·x/2} cos(ξ·x/2), and ∇H = Re(ζ₊ h₊) =
 * e^{η·x/2} (½η cos(ξ·x/2) − ½ξ sin(ξ·x/2)).
 */
export function pair(size: number, turn: number): Shape {
	const { xi, eta } = wavevectors(size, turn);
	const parts = (x: number, y: number) => {
		const grow = Math.exp(0.5 * (eta[0] * x + eta[1] * y));
		const phase = 0.5 * (xi[0] * x + xi[1] * y);
		return { grow, cos: Math.cos(phase), sin: Math.sin(phase) };
	};
	return {
		H: (x, y) => {
			const p = parts(x, y);
			return p.grow * p.cos;
		},
		grad: (x, y) => {
			const p = parts(x, y);
			return [
				0.5 * p.grow * (eta[0] * p.cos - xi[0] * p.sin),
				0.5 * p.grow * (eta[1] * p.cos - xi[1] * p.sin)
			];
		}
	};
}

export interface Settings {
	profile: Profile;
	b: Vec;
	/** log₁₀ of the largest |∇H| on the body */
	strength: number;
	sign: Sign;
	rapidity: number;
	/** |ξ| in 1/R, and its direction in degrees */
	xi: number;
	turn: number;
}

export const OPENING: Settings = {
	profile: 'as',
	b: OPENING_B,
	strength: STRENGTH.opening,
	sign: 1,
	rapidity: RAPIDITY.opening,
	xi: XI.opening,
	turn: TURN.opening
};

export function unitShape(s: Pick<Settings, 'profile' | 'b' | 'xi' | 'turn'>): Shape {
	if (s.profile === 'as') return logarithm(s.b);
	if (s.profile === 'quad') return QUADRUPOLE;
	return pair(s.xi, s.turn);
}

/**
 * The wave on the body: the unit profile scaled so that its largest |∇H| over the particles is 10^strength, times
 * the sign. `amplitude` is k (in R) for Aichelburg and Sexl's profile, 1/f (in 1/R) for the quadrupole and A (in R)
 * for the pair, before the sign; `largest` is the particle where |∇H| is largest.
 */
export function wave(s: Settings, body: Particle[] = BODY) {
	const unit = unitShape(s);
	let most = 0;
	let largest = 0;
	body.forEach((p, i) => {
		const g = unit.grad(p.x, p.y);
		const size = Math.hypot(g[0], g[1]);
		if (size > most) [most, largest] = [size, i];
	});
	const amplitude = 10 ** s.strength / most;
	const scale = s.sign * amplitude;
	const shape: Shape = {
		H: (x, y) => scale * unit.H(x, y),
		grad: (x, y) => {
			const g = unit.grad(x, y);
			return [scale * g[0], scale * g[1]];
		}
	};
	return { shape, amplitude, largest };
}

// --- the kicks and the energies --------------------------------------------------------------------------------------

/** q/mc for the body at the rapidity r. */
export const qOverMc = (rapidity: number) => Math.exp(rapidity);

/**
 * The energy a particle of light-cone component q and sideways momentum p gains from the kick k = ½q∇H: the paper's
 * eq:proof-shock, (c/2q)(|p + k|² − |p|²), with the difference of squares written k·(2p + k) so that nothing is lost
 * to rounding when k is small beside p.
 */
export function shockEnergy(q: number, p: Vec, k: Vec) {
	return (k[0] * (2 * p[0] + k[0]) + k[1] * (2 * p[1] + k[1])) / (2 * q);
}

export interface Reading {
	/** for each particle: its q, ∇H where it crosses, and its kick ½q∇H divided by its mass, in c */
	q: number[];
	grad: Vec[];
	kick: Vec[];
	/** E₊ − E₀ and E₋ − E₀, summed from eq:proof-shock per particle, and their sum E₊ + E₋ − 2E₀, in Mc² */
	plus: number;
	minus: number;
	sum: number;
	/** ¼ Σ c q_a |∇H(x_a)|², the paper's ¼∫|∇H|²𝒩, in Mc² */
	crossing: number;
	/** M₊² + M₋² − 2M₀², from the momenta, and Q² Var(∇H)/2c², in M² */
	restMass: number;
	variance: number;
}

/** The body's energies and rest masses after the wave of gradient `grads[a]` at each particle, and after its reverse. */
export function readGradients(grads: Vec[], rapidity: number, body: Particle[] = BODY): Reading {
	const ratio = qOverMc(rapidity);
	const q = body.map((p) => p.m * ratio);
	const kick: Vec[] = [];
	let plus = 0;
	let minus = 0;
	let crossing = 0;
	// the rest mass: M²c² = Q Σ (m²c² + p⊥²)/q − |Σ p⊥|², in which Q is kept, so only the p⊥ change
	const Q = q.reduce((s, x) => s + x, 0);
	let P: Vec = [0, 0];
	let K: Vec = [0, 0];
	let squares = { plus: 0, minus: 0 };
	body.forEach((p, a) => {
		const g = grads[a];
		const k: Vec = [0.5 * q[a] * g[0], 0.5 * q[a] * g[1]];
		const back: Vec = [-k[0], -k[1]];
		const momentum: Vec = [p.px, p.py];
		kick.push([k[0] / p.m, k[1] / p.m]);
		plus += shockEnergy(q[a], momentum, k);
		minus += shockEnergy(q[a], momentum, back);
		crossing += 0.25 * q[a] * (g[0] * g[0] + g[1] * g[1]);
		const change = (d: Vec) =>
			(d[0] * (2 * momentum[0] + d[0]) + d[1] * (2 * momentum[1] + d[1])) / q[a];
		squares = { plus: squares.plus + change(k), minus: squares.minus + change(back) };
		P = [P[0] + p.px, P[1] + p.py];
		K = [K[0] + k[0], K[1] + k[1]];
	});
	const whole = (d: Vec) => d[0] * (2 * P[0] + d[0]) + d[1] * (2 * P[1] + d[1]);
	const restMass = Q * squares.plus - whole(K) + (Q * squares.minus - whole([-K[0], -K[1]]));
	// Var(∇H) with the weights q_a/Q: the mean of |∇H − its mean|²
	const mean = grads.reduce<Vec>(
		(s, g, a) => [s[0] + (q[a] / Q) * g[0], s[1] + (q[a] / Q) * g[1]],
		[0, 0]
	);
	const spread = grads.reduce(
		(s, g, a) => s + (q[a] / Q) * ((g[0] - mean[0]) ** 2 + (g[1] - mean[1]) ** 2),
		0
	);
	return {
		q,
		grad: grads,
		kick,
		plus,
		minus,
		sum: plus + minus,
		crossing,
		restMass,
		variance: (Q * Q * spread) / 2
	};
}

/** Everything the figure shows for one setting. */
export function reading(s: Settings, body: Particle[] = BODY) {
	const w = wave(s, body);
	const grads = body.map((p) => w.shape.grad(p.x, p.y));
	const r = readGradients(grads, s.rapidity, body);
	// Newton's kick, for a mass p/c passing at c, on the part nearest the path and at rest: (2Gp/c²)(b − s)/|b − s|²,
	// with 2Gp/c² = kc/4; drawn only for Aichelburg and Sexl's profile, and turned with the sign
	let newton: { at: number; kick: Vec } | undefined;
	if (s.profile === 'as') {
		const at = w.largest;
		const p = body[at];
		const [dx, dy] = [s.b[0] - p.x, s.b[1] - p.y];
		const d2 = dx * dx + dy * dy;
		const c = (s.sign * w.amplitude) / 4;
		newton = { at, kick: [(c * dx) / d2, (c * dy) / d2] };
	}
	return { ...r, ...w, newton };
}

// --- the test particles -----------------------------------------------------------------------------------------------

/**
 * Three test particles crossing the front at one place, where the gradient is g: a slow grain (q = mc), a photon
 * along +z (q = 0) and one along −z (q = 2E/c). For each, its sideways velocity after the front, in c (for the
 * photon against the front, its turn in radians times c), and its gain ΔE/E, both from ½q∇H with p⊥ = 0 before.
 */
export function testParticles(g: Vec) {
	const size = Math.hypot(g[0], g[1]);
	return {
		grain: { velocity: 0.5 * size, gain: (size * size) / 8 },
		along: { velocity: 0, gain: 0 },
		against: { turn: size, gain: (size * size) / 4 }
	};
}

// --- the drawing --------------------------------------------------------------------------------------------------------

/** The crossing point, kept outside the body and inside the view. */
export function keepOut(b: Vec): Vec {
	let [x, y] = [clamp(b[0], -EDGE, EDGE), clamp(b[1], -EDGE, EDGE)];
	const r = Math.hypot(x, y);
	if (r < NEAREST) {
		const [ux, uy] = r > 1e-9 ? [x / r, y / r] : [1, 0];
		[x, y] = [ux * NEAREST, uy * NEAREST];
	}
	return [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000];
}

/**
 * The arrows' scale: an arrow BASE R long is a kick of ½ × 10^strength c, the largest at rapidity 0, divided by a
 * power of ten when the body runs fast enough against the front that the longest arrow would pass LONGEST R.
 */
export const BASE = 0.36;
export const LONGEST = 0.75;
export function arrowScale(strength: number, rapidity: number) {
	const tenths = Math.max(0, Math.ceil(Math.log10((BASE * qOverMc(rapidity)) / LONGEST) - 1e-9));
	const unit = 0.5 * 10 ** strength * 10 ** tenths;
	return { unit, perC: BASE / unit, tenths };
}

/** A pleasant step near x: 1, 2 or 5 times a power of ten. */
export function niceStep(x: number) {
	const e = Math.floor(Math.log10(x));
	const f = x / 10 ** e;
	return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * 10 ** e;
}

/**
 * Contours of H at equal steps, by marching squares on an n × n grid over the view: about six steps across the
 * body, and no more than SPREAD steps beyond the body's range. Each level k, at H = k × step, comes back as segments in
 * R. Drawn from the unit profile, they do not change with the strength, and the sign only turns k into −k.
 */
export const SPREAD = 4;
export function contours(shape: Shape, n = 84) {
	const h = (2 * VIEW) / n;
	const grid: number[][] = [];
	for (let j = 0; j <= n; j++) {
		const row: number[] = [];
		for (let i = 0; i <= n; i++) row.push(shape.H(-VIEW + i * h, -VIEW + j * h));
		grid.push(row);
	}
	// the range of H over the body's disc, sampled on rings
	let [lo, hi] = [Infinity, -Infinity];
	for (let r = 0; r <= 1.0001; r += 0.125)
		for (let t = 0; t < 64; t++) {
			const v = shape.H(r * Math.cos((t * Math.PI) / 32), r * Math.sin((t * Math.PI) / 32));
			lo = Math.min(lo, v);
			hi = Math.max(hi, v);
		}
	const step = niceStep(Math.max(hi - lo, 1e-12) / 6);
	const first = Math.ceil(lo / step) - SPREAD;
	const last = Math.floor(hi / step) + SPREAD;
	const levels = new Map<number, [Vec, Vec][]>();
	const at = (i: number, j: number, t: number, i2: number, j2: number): Vec => [
		-VIEW + (i + t * (i2 - i)) * h,
		-VIEW + (j + t * (j2 - j)) * h
	];
	for (let j = 0; j < n; j++)
		for (let i = 0; i < n; i++) {
			const corners: [number, number, number][] = [
				[i, j, grid[j][i]],
				[i + 1, j, grid[j][i + 1]],
				[i + 1, j + 1, grid[j + 1][i + 1]],
				[i, j + 1, grid[j + 1][i]]
			];
			const values = corners.map((c) => c[2]);
			if (!values.every(Number.isFinite)) continue;
			// only the levels that pass through this cell
			const from = Math.max(first, Math.ceil(Math.min(...values) / step));
			const to = Math.min(last, Math.floor(Math.max(...values) / step));
			for (let k = from; k <= to; k++) {
				const level = k * step;
				const cuts: Vec[] = [];
				for (let e = 0; e < 4; e++) {
					const [ia, ja, va] = corners[e];
					const [ib, jb, vb] = corners[(e + 1) % 4];
					if (va < level !== vb < level) cuts.push(at(ia, ja, (level - va) / (vb - va), ib, jb));
				}
				if (cuts.length < 2) continue;
				const list = levels.get(k) ?? [];
				list.push([cuts[0], cuts[1]]);
				if (cuts.length === 4) list.push([cuts[2], cuts[3]]);
				levels.set(k, list);
			}
		}
	return {
		step,
		levels: [...levels.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([level, segments]) => ({ level, segments }))
	};
}
