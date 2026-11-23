/**
 * Chapter 1.7's cart: a mass m on a straight track, held by a spring of stiffness k, with the Hamiltonian
 *
 *   H = p² / 2m + ½ k q²,     ω = √(k / m),
 *
 * whose state (q, p) goes clockwise round the ellipse H = E, drawn with q to the right and p upward. The motion is the
 * closed form q = A cos θ, p = −m ω A sin θ, with θ = ω t + φ; nothing is integrated step by step.
 *
 * A sudden tide of profile g kicks the cart where it stands: p → p + ε m g′(q), q unchanged (eq:tide-kick, for one
 * part on a line). It leaves the energy
 *
 *   ΔE = ε p g′(q) + ½ ε² m g′(q)²,
 *
 * eq:kick-energy with v = p / m and J = ε m g′(q). Two copies prepared alike, kicked by ε and by −ε, gain on average
 * the second part alone, and half the difference of their gains is the first.
 */

/** The chapter's cart: 2 kg on a spring of 50 N m⁻¹, so ω = 5 s⁻¹. */
export const MASS = 2;
export const STIFFNESS = 50;
export const OMEGA = Math.sqrt(STIFFNESS / MASS);
/** One swing there and back, s: 2π / ω = 1.26 s. */
export const PERIOD = (2 * Math.PI) / OMEGA;

/** The chapter's energy, J: a swing of 0.1 m to each side, 1 kg m s⁻¹ at the centre. */
export const CHAPTER_ENERGY = 0.25;
/** The range of the energy as prepared, J, and its step. */
export const LEAST_ENERGY = 0.02;
export const MOST_ENERGY = 0.6;
export const ENERGY_STEP = 0.01;

/** A state of the cart: its distance q from where the spring is relaxed, m, and its momentum p, kg m s⁻¹. */
export type State = { q: number; p: number };

/** The two tides: uniform, g = x, and tidal, g = ½ x². */
export type Tide = 'uniform' | 'tidal';

/**
 * The strength ε of each tide: its range and step, and where it starts. For g = x, ε is a velocity, m s⁻¹, and the
 * kick adds ε m to p; for g = ½ x², ε is in s⁻¹ and the kick adds ε m q. The two start with the same kick at the end
 * of the chapter's swing, 0.4 kg m s⁻¹.
 */
export const STRENGTH: Record<Tide, { most: number; step: number; start: number; unit: string }> = {
	uniform: { most: 0.5, step: 0.01, start: 0.2, unit: 'm/s' },
	tidal: { most: 5, step: 0.1, start: 2, unit: 's⁻¹' }
};

/** The energy of a state, J: p² / 2m + ½ k q². */
export const energy = (s: State, m = MASS, k = STIFFNESS) =>
	(s.p * s.p) / (2 * m) + 0.5 * k * s.q * s.q;

/** Hamilton's equations for the cart: q̇ = ∂H/∂p = p / m, ṗ = −∂H/∂q = −k q. */
export const rates = (s: State, m = MASS, k = STIFFNESS) => ({ q: s.p / m, p: -k * s.q });

/** The half-axes of the ellipse H = E: √(2E/k) along q, the ends of the swing, and √(2mE) along p. */
export const halfAxes = (E: number, m = MASS, k = STIFFNESS) => ({
	q: Math.sqrt((2 * E) / k),
	p: Math.sqrt(2 * m * E)
});

/** The area inside the ellipse H = E, J s: π times its half-axes, which is 2π E / ω. */
export const area = (E: number, m = MASS, k = STIFFNESS) => {
	const h = halfAxes(E, m, k);
	return Math.PI * h.q * h.p;
};

/** The state of energy E at the angle θ round its ellipse: q = A cos θ, p = −m ω A sin θ; θ = 0 is the right-hand end. */
export function stateAt(E: number, theta: number, m = MASS, k = STIFFNESS): State {
	const A = Math.sqrt((2 * E) / k);
	const w = Math.sqrt(k / m);
	return { q: A * Math.cos(theta), p: -m * w * A * Math.sin(theta) };
}

/** The angle of a state round its ellipse, the inverse of stateAt: it grows clockwise, as time does. */
export function angleOf(s: State, m = MASS, k = STIFFNESS) {
	const w = Math.sqrt(k / m);
	return Math.atan2(-s.p / (m * w), s.q);
}

/** The state a time t after s, by the closed form: q = q₀ cos ωt + (p₀/mω) sin ωt, p = p₀ cos ωt − m ω q₀ sin ωt. */
export function evolve(s: State, t: number, m = MASS, k = STIFFNESS): State {
	const w = Math.sqrt(k / m);
	const c = Math.cos(w * t);
	const n = Math.sin(w * t);
	return { q: s.q * c + (s.p / (m * w)) * n, p: s.p * c - m * w * s.q * n };
}

/** The profile g of a tide at x, and its slope g′(x). */
export const profile = (tide: Tide, x: number) => (tide === 'uniform' ? x : 0.5 * x * x);
export const slope = (tide: Tide, x: number) => (tide === 'uniform' ? 1 : x);

/** The change of momentum a tide of strength ε gives the cart at q: ε m g′(q), kg m s⁻¹. */
export const impulse = (tide: Tide, eps: number, q: number, m = MASS) => eps * m * slope(tide, q);

/** The state after the kick: the momentum changed by ε m g′(q), the place not at all. */
export const kick = (s: State, tide: Tide, eps: number, m = MASS): State => ({
	q: s.q,
	p: s.p + impulse(tide, eps, s.q, m)
});

/**
 * The energy a kick leaves, J, in its two parts: ε p g′(q), which depends on how the cart was moving and can have
 * either sign, and ½ ε² m g′(q)², which does not and is never negative.
 */
export function gain(s: State, tide: Tide, eps: number, m = MASS) {
	const g1 = slope(tide, s.q);
	const motion = eps * s.p * g1;
	const alone = 0.5 * eps * eps * m * g1 * g1;
	return { motion, alone, total: motion + alone };
}

/**
 * Two copies prepared alike in the state s, one kicked by ε and one by −ε: their gains, the average of the two, which
 * is ½ ε² m g′(q)², and half their difference, which is ε p g′(q).
 */
export function copies(s: State, tide: Tide, eps: number, m = MASS) {
	const plus = gain(s, tide, eps, m).total;
	const minus = gain(s, tide, -eps, m).total;
	return { plus, minus, average: (plus + minus) / 2, halfDifference: (plus - minus) / 2 };
}

/**
 * The half-width of the phase plane as drawn, along q, m: the least of 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6 and 8 times a
 * power of ten that is at least `need`. Its half-height along p is m ω times as much, so that ellipses of the cart
 * are drawn as circles and the point goes round at an even pace.
 */
export function viewSpan(need: number) {
	const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
	const e = 10 ** Math.floor(Math.log10(need));
	for (const s of steps) if (s * e >= need * (1 - 1e-12)) return s * e;
	return 10 * e;
}

/** A step for ticks over a span with about `count` of them: 1, 2 or 5 times a power of ten. */
export function tickStep(span: number, count: number) {
	const raw = span / count;
	const e = 10 ** Math.floor(Math.log10(raw));
	const m = raw / e;
	return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e;
}
