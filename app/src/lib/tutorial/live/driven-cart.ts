/**
 * Chapter 4.1's driven cart: chapter 1.7's cart (./phase-space.ts), 2 kg on a spring of 50 N m⁻¹, ω₀ = 5 s⁻¹, with
 * the friction −mΓq̇ and a hand that pushes it as F = F₀ cos θ, θ advancing at the drive's ω:
 *
 *   m q̈ + m Γ q̇ + k q = F(t),     Γ = ω₀ / Q.
 *
 * The steady answer is q = Re[q̃ e^{−iθ}] with q̃ = χ(ω) F₀, the response function in the paper's convention,
 *
 *   χ(ω) = 1 / m(ω₀² − ω² − iΓω),
 *
 * whose argument φ, between 0 and π, is how far the cart is behind the push (eq:chi). The rest of the motion is a
 * free ring-down, which makes up the difference between the state the cart had and the steady state; both parts are
 * closed forms, so nothing is integrated step by step. The mean power is ½ ω Im χ F₀² (eq:power), a line of height
 * 1/mΓ at ω₀ and width exactly Γ, whose area is π/2m at every Q.
 */
import { MASS, OMEGA, STIFFNESS, type State } from './phase-space';

export { MASS, OMEGA, STIFFNESS };

/** The size of the hand's push, N. */
export const FORCE = 0.1;
/** The static stretch F₀/k, m: how far a steady push of F₀ moves the cart, 2 mm. */
export const STATIC = FORCE / STIFFNESS;

/**
 * The quality factors the slider stops at, from critical damping, ½, to 100: 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6 and 8
 * times a power of ten, so that each is about a quarter of a power of two from the next, and the chapter's 3, 5, 10
 * and 30 are among them.
 */
export const QUALITIES = [
	0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100
];
/** The drive's range and step, s⁻¹. */
export const DRIVE_MOST = 15;
export const DRIVE_STEP = 0.1;
/** Where the figure opens: Q = 10, a push at 3 s⁻¹. */
export const OPENING = { Q: 10, omega: 3 };

/** The damping rate of a quality factor, s⁻¹: Γ = ω₀ / Q. */
export const damping = (Q: number) => OMEGA / Q;

/** The response function χ(ω) = 1 / m(ω₀² − ω² − iΓω), m N⁻¹, with its modulus and its argument φ in [0, π]. */
export function chi(omega: number, Gamma: number, m = MASS, k = STIFFNESS) {
	const a = k / m - omega * omega;
	const b = Gamma * omega;
	const d = m * (a * a + b * b);
	return {
		re: a / d,
		im: b / d,
		abs: 1 / (m * Math.hypot(a, b)),
		lag: Math.atan2(b, a)
	};
}

/** The swing in units of the static stretch, k|χ|: 1 for a slow push, Q at ω₀. */
export const gain = (omega: number, Gamma: number) => STIFFNESS * chi(omega, Gamma).abs;

/** The line ω Im χ(ω), s kg⁻¹: largest at ω₀, where it is 1/mΓ. */
export const line = (omega: number, Gamma: number) => omega * chi(omega, Gamma).im;

/** The mean power the hand delivers, W: ½ ω Im χ |F̃|². */
export const meanPower = (omega: number, Gamma: number, F = FORCE) =>
	0.5 * line(omega, Gamma) * F * F;

/** The height of the line, 1/mΓ, s kg⁻¹. */
export const lineHeight = (Gamma: number, m = MASS) => 1 / (m * Gamma);

/** The two half-power points, where |ω₀² − ω²| = Γω: √(ω₀² + Γ²/4) ∓ Γ/2. They are exactly Γ apart. */
export function halfPower(Gamma: number, w0 = OMEGA) {
	const c = Math.sqrt(w0 * w0 + (Gamma * Gamma) / 4);
	return { low: c - Gamma / 2, high: c + Gamma / 2 };
}

/** The area under ω Im χ from 0 to ∞, kg⁻¹: π/2m, whatever the friction. */
export const lineArea = (m = MASS) => Math.PI / (2 * m);

/** Where |χ| is largest, s⁻¹: ω₀ √(1 − 1/2Q²) when Q > 1/√2, and a slow push otherwise. */
export function modulusPeak(Q: number, w0 = OMEGA) {
	const r = 1 - 1 / (2 * Q * Q);
	return r > 0 ? w0 * Math.sqrt(r) : 0;
}

/** The free frequency of the ring-down, ω_d = √(ω₀² − Γ²/4), s⁻¹; zero at critical damping and below. */
export const dampedFrequency = (Gamma: number, w0 = OMEGA) =>
	Math.sqrt(Math.max(0, w0 * w0 - (Gamma * Gamma) / 4));

/**
 * The free motion from q₀ and the velocity v₀ after a time τ, m and m s⁻¹:
 *
 *   q = e^{−Γτ/2} [q₀ C(τ) + (v₀ + Γq₀/2) S(τ)],
 *
 * with C = cos ω_d τ and S = sin(ω_d τ)/ω_d, which become cosh and sinh past critical damping and 1 and τ at it.
 */
export function free(Gamma: number, q0: number, v0: number, tau: number, w0 = OMEGA) {
	const s = Gamma / 2;
	const w2 = w0 * w0 - s * s;
	const x = w2 * tau * tau;
	let C: number;
	let S: number;
	if (Math.abs(x) < 1e-6) {
		C = 1 - x / 2 + (x * x) / 24;
		S = tau * (1 - x / 6 + (x * x) / 120);
	} else if (w2 > 0) {
		const w = Math.sqrt(w2);
		C = Math.cos(w * tau);
		S = Math.sin(w * tau) / w;
	} else {
		const kappa = Math.sqrt(-w2);
		C = Math.cosh(kappa * tau);
		S = Math.sinh(kappa * tau) / kappa;
	}
	const e = Math.exp(-s * tau);
	const b = v0 + s * q0;
	return {
		q: e * (q0 * C + b * S),
		v: e * (-s * (q0 * C + b * S) - w2 * q0 * S + b * C)
	};
}

/**
 * The largest the free motion from q₀, v₀ can be at the time τ or later, m. Below critical damping it is the
 * envelope A e^{−Γτ/2}, with A = √(q₀² + ((v₀ + Γq₀/2)/ω_d)²) the swing as it starts; at and past it, a bound found
 * by looking ahead.
 */
export function freeReach(Gamma: number, q0: number, v0: number, tau = 0, w0 = OMEGA) {
	const s = Gamma / 2;
	const w2 = w0 * w0 - s * s;
	if (w2 > 1e-9) {
		const b = (v0 + s * q0) / Math.sqrt(w2);
		return Math.hypot(q0, b) * Math.exp(-s * tau);
	}
	let most = 0;
	const span = 12 / s;
	for (let i = 0; i <= 120; i++)
		most = Math.max(most, Math.abs(free(Gamma, q0, v0, tau + (span * i) / 120, w0).q));
	return most;
}

/**
 * A stretch of the motion with one setting: from the time t₀, where the cart had the state q₀, v₀ and the hand's
 * phase was θ₀, with the damping rate Γ and the drive ω, the hand pushing or not.
 */
export type Segment = {
	t0: number;
	q0: number;
	v0: number;
	theta0: number;
	Gamma: number;
	omega: number;
	push: boolean;
};

/** The cart at rest where the spring is relaxed, the hand starting to push at the time t₀. */
export const fromRest = (Gamma: number, omega: number, t0 = 0): Segment => ({
	t0,
	q0: 0,
	v0: 0,
	theta0: 0,
	Gamma,
	omega,
	push: true
});

/** The hand's phase θ at the time t: its push is F₀ cos θ. */
export const handAngle = (g: Segment, t: number) => g.theta0 + g.omega * (t - g.t0);

/** The hand's push at the time t, N. */
export const force = (g: Segment, t: number, F = FORCE) =>
	g.push ? F * Math.cos(handAngle(g, t)) : 0;

/** The steady state at the time t: q = F₀|χ| cos(θ − φ), and its velocity; nothing when the hand does not push. */
export function steady(g: Segment, t: number, F = FORCE) {
	if (!g.push) return { q: 0, v: 0 };
	const c = chi(g.omega, g.Gamma);
	const A = F * c.abs;
	const a = handAngle(g, t) - c.lag;
	return { q: A * Math.cos(a), v: -g.omega * A * Math.sin(a) };
}

/** The ring-down part of a segment: what the cart's starting state has beyond the steady state then. */
export function transient(g: Segment, F = FORCE) {
	const s = steady(g, g.t0, F);
	return { q0: g.q0 - s.q, v0: g.v0 - s.v };
}

/** The cart's state at the time t ≥ t₀: the steady state plus the ring-down, exactly. */
export function motion(g: Segment, t: number, F = FORCE): State & { v: number } {
	// State is phase-space.ts's (q, p); v = p/m is kept beside it for the law of motion
	const s = steady(g, t, F);
	const r = transient(g, F);
	const f = free(g.Gamma, r.q0, r.v0, t - g.t0);
	const q = s.q + f.q;
	const v = s.v + f.v;
	return { q, v, p: MASS * v };
}

/** A new segment from the state at the time t, with new settings; the hand's phase goes on without a jump. */
export function carryOn(
	g: Segment,
	t: number,
	change: Partial<Pick<Segment, 'Gamma' | 'omega' | 'push'>>,
	F = FORCE
): Segment {
	const now = motion(g, t, F);
	return {
		t0: t,
		q0: now.q,
		v0: now.v,
		theta0: handAngle(g, t),
		Gamma: change.Gamma ?? g.Gamma,
		omega: change.omega ?? g.omega,
		push: change.push ?? g.push
	};
}

/** The largest |q| the cart can reach at the time t or later in a segment, m: the steady swing plus the ring-down's reach. */
export function reach(g: Segment, t: number, F = FORCE) {
	const A = g.push ? F * chi(g.omega, g.Gamma).abs : 0;
	const r = transient(g, F);
	return A + freeReach(g.Gamma, r.q0, r.v0, Math.max(0, t - g.t0));
}

/**
 * The swing of a free ring-down as a turning complex number, at the time τ after it starts: the phasor
 * A e^{iα} e^{−Γτ/2} whose real part, turned by e^{−iω_d τ}, is the motion. Below critical damping only.
 */
export function ringPhasor(Gamma: number, q0: number, v0: number, tau: number, w0 = OMEGA) {
	const s = Gamma / 2;
	const wd = dampedFrequency(Gamma, w0);
	if (wd <= 0) return undefined;
	// q = e^{−sτ}[q₀ cos ω_d τ + (b/ω_d) sin ω_d τ] = Re[(q₀ + i b/ω_d) e^{−sτ} e^{−iω_d τ}]
	const re = q0;
	const im = (v0 + s * q0) / wd;
	const e = Math.exp(-s * tau);
	return { re: re * e, im: im * e, angle: wd * tau };
}

/** The share of the swing left after one full swing of a ring-down: e^{−πΓ/ω_d}. */
export const perSwing = (Gamma: number) => Math.exp((-Math.PI * Gamma) / dampedFrequency(Gamma));

/** The time for the swing of a ring-down to fall to the share r of its start, s: 2 ln(1/r)/Γ. */
export const fallTime = (Gamma: number, r: number) => (2 * Math.log(1 / r)) / Gamma;

/** The swings a ring-down makes in the time 1/Γ, while its energy falls by e and its swing to e^{−1/2}: ω_d/2πΓ. */
export const swingsPerE = (Gamma: number) => dampedFrequency(Gamma) / (2 * Math.PI * Gamma);

/** The top of the axis for the line ω Im χ, s kg⁻¹: the least of a short ladder that leaves a tenth of room. */
export const LINE_TOPS = [
	{ top: 0.15, step: 0.05 },
	{ top: 0.4, step: 0.1 },
	{ top: 1.2, step: 0.5 },
	{ top: 4, step: 1 },
	{ top: 12, step: 5 }
];
export function lineAxis(Gamma: number) {
	const h = lineHeight(Gamma);
	return LINE_TOPS.find((r) => h <= 0.9 * r.top) ?? LINE_TOPS[LINE_TOPS.length - 1];
}

/**
 * The frequencies at which the curves are drawn, s⁻¹: evenly over 0 to `most`, and closer near ω₀, where a line of
 * width Γ needs points a small fraction of Γ apart.
 */
export function samples(Gamma: number, most = DRIVE_MOST, w0 = OMEGA) {
	const out: number[] = [];
	for (let i = 0; i <= 300; i++) out.push((most * i) / 300);
	const lo = Math.max(0, w0 - 8 * Gamma);
	const hi = Math.min(most, w0 + 8 * Gamma);
	// 320 more over ω₀ ± 8Γ: at Q = 100 they are Γ/20 apart
	for (let i = 0; i <= 320; i++) out.push(lo + ((hi - lo) * i) / 320);
	out.sort((a, b) => a - b);
	return out.filter((w, i) => w >= 0 && w <= most && (i === 0 || w - out[i - 1] > 1e-9));
}
