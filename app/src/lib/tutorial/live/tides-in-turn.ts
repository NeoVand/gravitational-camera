/**
 * Chapter 13.4's tides in turn, made live. A uniform ball of mass M = 1 and radius R = 1 as 400 particles, kicked at
 * t = 0 by a weak impulsive tide of profile g and read a time τ later by the moment Q_h = Σ m h(x), and then the other
 * way round. The two responses, per unit of the kick's strength ε, are
 *
 *     δ_g Q_h / ε = τ ∫ ρ ∇g·∇h dV + τ² Σ p·(∇∇h)∇g + O(τ³),
 *
 * and their difference over τ² tends to the bracket of the two rates, {Q̇_h, Q̇_g} = Σ p·[(∇∇h)∇g − (∇∇g)∇h].
 *
 * The body. The particles sit at Gauss–Legendre nodes: five in radius in the inner ball (0 to a) and five in the rest
 * (a to R), four in the cosine of the polar angle, and evenly round each ring, each particle paired with its
 * antipode. The sums over them then give the ball's integrals of r^(2k) sin^(2k)θ for k ≤ 3, inside a and outside it
 * separately, and of every polynomial of degree four, exactly: the integrals behind each bracket here. The number of
 * particles on each ring is fixed (from the opening radius a = 2^(−1/5)), so that a particle moves smoothly as a
 * changes, and its mass is its share of the ring's.
 *
 * The flows. At rest; turning rigidly at Ω; the hidden swirl, the inner ball at +Ω and the rest at −Ω; and the rolls
 * of chapter 2.8's stretch problem, V = K(1 − r²/R²)² ẑ, whose flow J = ∇×∇×V = 8K(xz, yz, 1 + z² − 2r²) has the
 * velocity (xz, yz, 1 − 2x² − 2y² − z²) ΩR when K = 3MΩ/32π: Ω is then the speed at the centre over R.
 *
 * The forces. Each particle of a turning flow is held on its circle by a pull toward the axis in proportion to its
 * distance, −mΩ_a²(x, y, 0), as strong as its own turning needs; along the axis it is free. Its motion and its
 * first-order change are then in closed form: the place turns by Ω_aτ, and a kick u moves it by u_⊥ sin(Ω_aτ)/Ω_a
 * across the axis and u_z τ along it. The particles of the rolls are held on the steady flow by the force that keeps
 * it steady, m(v·∇)v = m(x(1 − 2ϖ²), y(1 − 2ϖ²), 2z(z² − 1)), and their motion and its first-order change are
 * integrated together by velocity Verlet. Either way the response is exactly linear in ε: no ε is ever chosen.
 *
 * Units: M = R = Ω = 1. Times are in 1/Ω, the waits shown in periods 2π/Ω; a response of the pair of degrees m and n
 * is in M R^(m+n−2)/Ω, and a bracket in M Ω R^(m+n−2), or, for the rolls, in K R³.
 */
import { BALANCED, bracket } from '../../hair/flow';
import { gaussLegendre } from './first-and-second-order';

export type Vec = [number, number, number];
export type Flow = 'rest' | 'rigid' | 'swirl' | 'rolls';
export type Pair = 'quad' | 'oct' | 'four' | 'mixed';
/** 'gh': kick with g, read h; 'hg': kick with h, read g. */
export type Order = 'gh' | 'hg';

/** The number of the body's particles. */
export const COUNT = 400;
/** One period of the turning, 2π/Ω, in 1/Ω. */
export const PERIOD = 2 * Math.PI;
/** The longest wait, in periods, and the wait slider's range. */
export const WAIT = { min: 0.002, max: 0.05, step: 0.001, opening: 0.05 };
/** The longest wait, in 1/Ω. */
export const TAU_MAX = WAIT.max * PERIOD;
/** The waits at which the responses are found, 0 to TAU_MAX in SAMPLES equal steps. */
export const SAMPLES = 100;
/** Velocity Verlet's steps in each sample, for the rolls: 400 steps to the longest wait. */
export const SUBSTEPS = 4;
/** The radius of the inner ball: the slider, and its two marks. */
export const INNER = {
	min: 0.5,
	max: 0.98,
	step: 0.001,
	/** no angular momentum: 2^(−1/5) R */
	balanced: BALANCED,
	/** the octupolar bracket's zero: 2^(−1/7) R */
	octupolarZero: 2 ** (-1 / 7)
};
/** The rolls' K, in M Ω, that makes their speed at the centre Ω R. */
export const ROLLS_K = 3 / (32 * Math.PI);
/** The rolls' bracket for the quadrupole with the octupole, 36 ∫V_z dV, in K R³. */
export const ROLLS_BRACKET = (384 * Math.PI) / 35;

export const OPENING = {
	flow: 'rigid' as Flow,
	pair: 'quad' as Pair,
	inner: BALANCED,
	wait: WAIT.opening
};

/** The degrees of the two profiles, h and g. */
export const DEGREES: Record<Pair, [number, number]> = {
	quad: [2, 2],
	oct: [3, 3],
	four: [4, 4],
	mixed: [2, 3]
};

/** The power of R in the unit of a bracket, M Ω R^(m + n − 2). */
export const power = (pair: Pair) => DEGREES[pair][0] + DEGREES[pair][1] - 2;

/** The wait of the k-th sample, in 1/Ω. */
export const tauAt = (k: number) => (k * TAU_MAX) / SAMPLES;

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

// --- the body ----------------------------------------------------------------------------------------------------

export interface Particle {
	x: number;
	y: number;
	z: number;
	m: number;
	/** its distance from the centre */
	r: number;
	/** whether it belongs to the inner ball, r < a */
	inside: boolean;
}

const RADIAL = gaussLegendre(5);
/** The positive nodes of Gauss–Legendre in μ = cos θ on [−1, 1], with their weights (adding to 1). */
const POLAR = (() => {
	const { nodes, weights } = gaussLegendre(4);
	return nodes
		.map((t, i) => ({ mu: 2 * t - 1, w: 2 * weights[i] }))
		.filter((node) => node.mu > 0)
		.sort((p, q) => q.mu - p.mu);
})();

/** The shells of the two parts at the inner radius a: radius and mass, inner ball first. */
function shells(a: number) {
	const list: { r: number; mass: number; inside: boolean }[] = [];
	for (const inside of [true, false]) {
		const [from, span] = inside ? [0, a] : [a, 1 - a];
		RADIAL.nodes.forEach((t, i) => {
			const r = from + span * t;
			// the shell's share of 3 r² dr, the mass of a uniform ball of mass 1 between r and r + dr
			list.push({ r, mass: 3 * r * r * span * RADIAL.weights[i], inside });
		});
	}
	return list;
}

/** Whole numbers near `targets`, each at least `least`, adding to `total`: the largest remainders round up. */
function apportion(targets: number[], total: number, least: number): number[] {
	const counts = targets.map((t) => Math.max(least, Math.floor(t)));
	let left = total - counts.reduce((s, c) => s + c, 0);
	const order = targets
		.map((t, i) => ({ i, rest: t - Math.floor(t) }))
		.sort((p, q) => q.rest - p.rest);
	for (let k = 0; left > 0; k = (k + 1) % order.length, left--) counts[order[k].i]++;
	// a ring raised to the least may leave too many: take them from the fullest rings
	while (left < 0) {
		const fullest = counts.indexOf(Math.max(...counts));
		counts[fullest]--;
		left++;
	}
	return counts;
}

/** The particles on each ring of positive μ (each with its antipode on the ring of −μ), fixed at the opening a. */
const RING_COUNTS = (() => {
	const targets: number[] = [];
	for (const shell of shells(BALANCED))
		for (const node of POLAR) targets.push((COUNT / 2) * shell.mass * node.w);
	return apportion(targets, COUNT / 2, 2);
})();

/** A small seeded generator, for each ring's turn about the axis. */
function uniform(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const RING_TURNS = (() => {
	const next = uniform(1304);
	return RING_COUNTS.map(() => next());
})();

/** The body for the inner radius a, in units of R: 400 particles, their masses adding to 1. */
export function body(a: number): Particle[] {
	const list: Particle[] = [];
	let ring = 0;
	for (const shell of shells(a))
		for (const node of POLAR) {
			const n = RING_COUNTS[ring];
			const m = (shell.mass * node.w) / 2 / n;
			const across = shell.r * Math.sqrt(1 - node.mu * node.mu);
			for (let k = 0; k < n; k++) {
				const phi = (2 * Math.PI * (k + RING_TURNS[ring])) / n;
				const [x, y, z] = [across * Math.cos(phi), across * Math.sin(phi), shell.r * node.mu];
				list.push({ x, y, z, m, r: shell.r, inside: shell.inside });
				list.push({ x: -x, y: -y, z: -z, m, r: shell.r, inside: shell.inside });
			}
			ring++;
		}
	return list;
}

// --- the flows -----------------------------------------------------------------------------------------------------

/** The rate at which a particle turns about the axis, in Ω, for a turning flow. */
export function rate(flow: Flow, p: Particle): number {
	if (flow === 'rigid') return 1;
	if (flow === 'swirl') return p.inside ? 1 : -1;
	return 0;
}

/** The rolls' velocity at x, in Ω R. */
export function rollsVelocity([x, y, z]: Vec): Vec {
	return [x * z, y * z, 1 - 2 * x * x - 2 * y * y - z * z];
}

/** The rolls' acceleration (v·∇)v at x, which the holding force supplies. */
export function rollsAcceleration([x, y, z]: Vec): Vec {
	const across = 1 - 2 * (x * x + y * y);
	return [x * across, y * across, 2 * z * (z * z - 1)];
}

/** The change of that acceleration with place, applied to d: ∇[(v·∇)v] d. */
function rollsTangent([x, y, z]: Vec, [dx, dy, dz]: Vec): Vec {
	return [
		(1 - 6 * x * x - 2 * y * y) * dx - 4 * x * y * dy,
		-4 * x * y * dx + (1 - 2 * x * x - 6 * y * y) * dy,
		(6 * z * z - 2) * dz
	];
}

/** A particle's velocity at the place x, in Ω R. */
export function velocity(flow: Flow, p: Particle, at: Vec = [p.x, p.y, p.z]): Vec {
	if (flow === 'rolls') return rollsVelocity(at);
	const w = rate(flow, p);
	return [-w * at[1], w * at[0], 0];
}

// --- the profiles --------------------------------------------------------------------------------------------------

/** (x + iy)^k as [re, im]. */
function wPower(x: number, y: number, k: number): [number, number] {
	let [re, im] = [1, 0];
	for (let j = 0; j < k; j++) [re, im] = [re * x - im * y, re * y + im * x];
	return [re, im];
}

/** The gradient of the profile h or g of the pair at x. */
export function gradient(pair: Pair, which: 'h' | 'g', [x, y, z]: Vec): Vec {
	if (pair === 'mixed') {
		// h = z² − (x² + y²)/2, g = z³ − (3/2) z (x² + y²)
		return which === 'h'
			? [-x, -y, 2 * z]
			: [-3 * x * z, -3 * y * z, 3 * z * z - 1.5 * (x * x + y * y)];
	}
	// h + ig = f(w) = w^n / n, f' = w^(n − 1): ∇h = (Re f', −Im f'), ∇g = (Im f', Re f')
	const [re, im] = wPower(x, y, DEGREES[pair][0] - 1);
	return which === 'h' ? [re, -im, 0] : [im, re, 0];
}

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// --- the responses ---------------------------------------------------------------------------------------------------

export interface Responses {
	/** δ_g Q_h / ε at each sample */
	gh: Float64Array;
	/** δ_h Q_g / ε at each sample */
	hg: Float64Array;
}

/** A turning flow's particle at the wait τ: turned by Ω_a τ about the axis. */
function turned(p: Particle, w: number, tau: number): Vec {
	const [c, s] = [Math.cos(w * tau), Math.sin(w * tau)];
	return [c * p.x - s * p.y, s * p.x + c * p.y, p.z];
}

/** The responses of a turning flow (or the body at rest), in closed form. */
function turningResponses(flow: Flow, pair: Pair, particles: Particle[]): Responses {
	const out: Responses = { gh: new Float64Array(SAMPLES + 1), hg: new Float64Array(SAMPLES + 1) };
	for (const p of particles) {
		const w = rate(flow, p);
		const x0: Vec = [p.x, p.y, p.z];
		const kick = { gh: gradient(pair, 'g', x0), hg: gradient(pair, 'h', x0) };
		for (let k = 1; k <= SAMPLES; k++) {
			const tau = tauAt(k);
			const across = w === 0 ? tau : Math.sin(w * tau) / w;
			const x = turned(p, w, tau);
			for (const order of ['gh', 'hg'] as const) {
				const u = kick[order];
				const moved: Vec = [u[0] * across, u[1] * across, u[2] * tau];
				const read = gradient(pair, order === 'gh' ? 'h' : 'g', x);
				out[order][k] += p.m * dot(read, moved);
			}
		}
	}
	return out;
}

/** The rolls' particles at each sample, from velocity Verlet: [sample][particle] places. */
export function rollsPaths(particles: Particle[]): Vec[][] {
	const dt = TAU_MAX / (SAMPLES * SUBSTEPS);
	const x = particles.map((p): Vec => [p.x, p.y, p.z]);
	const v = x.map(rollsVelocity);
	const a = x.map(rollsAcceleration);
	const paths: Vec[][] = [x.map((q): Vec => [...q])];
	for (let k = 1; k <= SAMPLES; k++) {
		for (let s = 0; s < SUBSTEPS; s++)
			for (let i = 0; i < x.length; i++) {
				const [q, u, f] = [x[i], v[i], a[i]];
				for (let j = 0; j < 3; j++) q[j] += u[j] * dt + 0.5 * f[j] * dt * dt;
				const g = rollsAcceleration(q);
				for (let j = 0; j < 3; j++) u[j] += 0.5 * (f[j] + g[j]) * dt;
				a[i] = g;
			}
		paths.push(x.map((q): Vec => [...q]));
	}
	return paths;
}

/**
 * The responses of the rolls: velocity Verlet applied to the motion and to its first-order change together, the
 * change starting at rest in place and with the kick's velocity. The response at each sample is Σ m ∇h·δx.
 */
function rollsResponses(pair: Pair, particles: Particle[]): Responses {
	const out: Responses = { gh: new Float64Array(SAMPLES + 1), hg: new Float64Array(SAMPLES + 1) };
	const dt = TAU_MAX / (SAMPLES * SUBSTEPS);
	for (const p of particles) {
		const x: Vec = [p.x, p.y, p.z];
		const v = rollsVelocity(x);
		let a = rollsAcceleration(x);
		const change = (['gh', 'hg'] as const).map((order) => ({
			order,
			dx: [0, 0, 0] as Vec,
			dv: gradient(pair, order === 'gh' ? 'g' : 'h', x),
			da: [0, 0, 0] as Vec
		}));
		for (let k = 1; k <= SAMPLES; k++) {
			for (let s = 0; s < SUBSTEPS; s++) {
				for (let j = 0; j < 3; j++) x[j] += v[j] * dt + 0.5 * a[j] * dt * dt;
				const next = rollsAcceleration(x);
				for (let j = 0; j < 3; j++) v[j] += 0.5 * (a[j] + next[j]) * dt;
				a = next;
				for (const c of change) {
					for (let j = 0; j < 3; j++) c.dx[j] += c.dv[j] * dt + 0.5 * c.da[j] * dt * dt;
					const dnext = rollsTangent(x, c.dx);
					for (let j = 0; j < 3; j++) c.dv[j] += 0.5 * (c.da[j] + dnext[j]) * dt;
					c.da = dnext;
				}
			}
			for (const c of change)
				out[c.order][k] += p.m * dot(gradient(pair, c.order === 'gh' ? 'h' : 'g', x), c.dx);
		}
	}
	return out;
}

/** The two responses at every sample, for the flow, the pair and the body. */
export function responses(flow: Flow, pair: Pair, particles: Particle[]): Responses {
	return flow === 'rolls'
		? rollsResponses(pair, particles)
		: turningResponses(flow, pair, particles);
}

/** The places of the particles at the wait of the k-th sample, for drawing. */
export function placesAt(flow: Flow, particles: Particle[], k: number, paths?: Vec[][]): Vec[] {
	if (flow === 'rolls' && paths) return paths[clamp(Math.round(k), 0, SAMPLES)];
	const tau = tauAt(k);
	return particles.map((p) => turned(p, rate(flow, p), tau));
}

// --- the readings ----------------------------------------------------------------------------------------------------

/**
 * The bracket {Q̇_h, Q̇_g}, exact: lib/hair/flow.ts's for the pairs (x + iy)^n / n on the turning flows, in M Ω
 * R^(2n − 2); zero for the quadrupole with the octupole on a turning flow, whose vector (6xz, 6yz, −6z² − 6ϖ²) is at
 * right angles to every turning; for the rolls, in K R³, 36 ∫V_z dV for that pair and zero for the others.
 */
export function exactBracket(flow: Flow, pair: Pair, inner: number): number {
	if (flow === 'rest') return 0;
	if (flow === 'rolls') return pair === 'mixed' ? ROLLS_BRACKET : 0;
	if (pair === 'mixed') return 0;
	return bracket(DEGREES[pair][0], flow === 'rigid' ? 1 : inner);
}

/** The difference of the two responses over τ², at the k-th sample, in the bracket's unit (K R³ for the rolls). */
export function measured(flow: Flow, r: Responses, k: number): number {
	const tau = tauAt(k);
	const value = (r.gh[k] - r.hg[k]) / (tau * tau);
	return flow === 'rolls' ? value / ROLLS_K : value;
}

/**
 * The plots' common scale, in M R^(m + n − 2)/Ω: a little over the largest response at the longest wait of the
 * pair's largest case, rigid turning for the three pairs of equal degree and the rolls for the quadrupole with the
 * octupole.
 */
export const SCALE: Record<Pair, number> = { quad: 0.05, oct: 0.05, four: 0.05, mixed: 0.06 };

/** A reading for the reader: three places, or one when it is ten or more; a true minus sign; no negative zero. */
export function shown(x: number): string {
	const places = Math.abs(x) >= 9.995 ? 1 : 3;
	const digits = Math.abs(x).toFixed(places);
	return x < 0 && Number(digits) !== 0 ? `−${digits}` : digits;
}
