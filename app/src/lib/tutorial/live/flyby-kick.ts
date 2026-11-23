/**
 * Chapter 1.8's flyby: a mass μ passes a body on a straight line at the steady speed V, and the parts of the body do
 * not move while it passes (the impulse approximation). Everything is Newtonian, in SI units, and exact within that
 * approximation; nothing is integrated step by step.
 *
 * A part at the distance B from the path, which the passing mass passes closest at the time t₀ = z/V (z the part's
 * place along the path), feels per unit mass the pull
 *
 *   across:  G μ B / (B² + V²τ²)^(3/2),     along:  G μ V τ / (B² + V²τ²)^(3/2),     τ = t − t₀,
 *
 * the first toward the path, the second toward the passing mass. By the time t the part has gained
 *
 *   across:  (G μ / B V) [1 + V τ / √(B² + V²τ²)],     along:  −G μ / (V √(B² + V²τ²)),
 *
 * which after the pass is 2 G μ / B V toward the path and nothing along it: the kick of eq:kick, the same wherever the
 * part lies along the path. In the plane across the path, a part over the point s, the path crossing at b, gets
 * C (b − s) / |b − s|², C = 2 G μ / V (the paper's eq:pass), and a body at rest gains
 *
 *   ΔE(b) = (C² / 2) ∫ Σ(s) / |b − s|² d²s.
 *
 * For the chapter's steel ball, uniform, of radius R and mass M, that integral has the closed form
 *
 *   ∫ Σ / |b − s|² d²s = (3 M / R³) [R − a arctan(R / a)],     a = √(b² − R²),
 *
 * of which M / b² is the recoil of the whole ball (the shell theorem in the plane) and the rest is left inside it.
 */
import { G } from './tidal-ring';

export { G };

/** The passing mass of the paper's scene, kg: a tonne. */
export const TONNE = 1000;
/** The steel ball: density, kg m⁻³, and radius, m. */
export const STEEL = 7850;
export const RADIUS = 0.5;
/** The ball's mass, kg: 4110. */
export const BALL = ((4 * Math.PI) / 3) * STEEL * RADIUS ** 3;

/** The paper's pass: 1.5 m from the ball's centre, so 1 m from its edge, at 44 km s⁻¹. */
export const PAPER_PASS = 1.5;
export const PAPER_SPEED = 44e3;
/** The figure's range of the distance of the pass from the centre, m, and of the speed, m s⁻¹. */
export const NEAREST = 0.6;
export const FARTHEST = 4;
export const SLOWEST = 1e3;
export const FASTEST = 100e3;

/** The period of the ball's slowest ringing, s: §IV's 15 kHz at 10 cm, scaled as 1/R to 0.5 m, about 3 kHz. */
export const RINGING = 330e-6;

/**
 * The frozen-ball check: the longest pass, 2 (b + R) / V at the ball's far side, should last under this fraction of
 * the ringing period for the parts to stay nearly still while the tonne passes. The paper's pass, 91 μs, is 0.28.
 */
export const FROZEN = 1 / 3;

/** A point of a plane, m. */
export type Point = [number, number];

/** The strength of a pass, C = 2 G μ / V, m² s⁻¹. */
export const strength = (mu: number, V: number) => (2 * G * mu) / V;

/** The kick of a part at the distance B from the path, after the pass: 2 G μ / B V, m s⁻¹, toward the path. */
export const kick = (mu: number, B: number, V: number) => (2 * G * mu) / (B * V);

/** The greatest sideways pull, at closest approach: G μ / B², m s⁻². */
export const peak = (mu: number, B: number) => (G * mu) / (B * B);

/**
 * The duration of the pass at a part at the distance B from the path, s: 2 B / V, how long the peak pull would have to
 * act to give the same kick (the kick is the peak pull times it). For the paper's pass, 45 μs at the ball's near edge
 * and 91 μs at its far side.
 */
export const passDuration = (B: number, V: number) => (2 * B) / V;

/**
 * The pull per unit mass on a part at the distance B from the path, τ after the passing mass is closest to it, m s⁻²:
 * across, toward the path, and along it, toward the passing mass.
 */
export function pull(mu: number, B: number, V: number, tau: number) {
	const r2 = B * B + V * V * tau * tau;
	const k = (G * mu) / (r2 * Math.sqrt(r2));
	return { across: k * B, along: k * V * tau };
}

/**
 * The velocity a part at the distance B from the path has gained by τ after the passing mass is closest to it, m s⁻¹:
 * across, toward the path, and along it. τ = ±∞ gives before and after the pass.
 */
export function kickSoFar(mu: number, B: number, V: number, tau: number) {
	if (tau === Infinity) return { across: kick(mu, B, V), along: 0 };
	if (tau === -Infinity) return { across: 0, along: 0 };
	const r = Math.sqrt(B * B + V * V * tau * tau);
	return {
		across: ((G * mu) / (B * V)) * (1 + (V * tau) / r),
		along: -(G * mu) / (V * r)
	};
}

/** The kick after the pass of a part over the point s of the plane across the path, the path crossing at b: C (b − s) / |b − s|². */
export function kickAt(C: number, b: Point, s: Point): Point {
	const dx = b[0] - s[0];
	const dy = b[1] - s[1];
	const d2 = dx * dx + dy * dy;
	return [(C * dx) / d2, (C * dy) / d2];
}

/**
 * What a pass at the distance b from the centre of a uniform ball of mass M and radius R leaves in it, J: the total of
 * eq:pass, the recoil (C² / 2) M / b² of the ball as a whole, and the rest, left inside.
 */
export function ballEnergy(C: number, b: number, M = BALL, R = RADIUS) {
	const a = Math.sqrt(b * b - R * R);
	const total = ((C * C) / 2) * ((3 * M) / R ** 3) * (R - a * Math.atan(R / a));
	const recoil = ((C * C) / 2) * (M / (b * b));
	return { total, recoil, inside: total - recoil };
}

/** The angle by which a body of mass M bends the passing mass's path, rad: 2 G M / b V². */
export const deflection = (M: number, b: number, V: number) => (2 * G * M) / (b * V * V);

/** The fraction of its speed that the passing mass loses when it gives the energy E: E / μ V². */
export const slowing = (E: number, mu: number, V: number) => E / (mu * V * V);

/**
 * The parts drawn, m about the ball's centre: a square grid a quarter of the radius apart, those within the ball. In
 * the side view the first number is the distance toward the path and the second the place along it; seen along the
 * path, the two directions across it. The row through the centre holds five.
 */
export const PARTS: Point[] = (() => {
	const step = RADIUS / 2;
	const out: Point[] = [];
	for (let i = 2; i >= -2; i--)
		for (let j = -2; j <= 2; j++) if (i * i + j * j <= 4) out.push([i * step, j * step]);
	return out;
})();

/** Steps for an axis between lo and hi with about `count` ticks: 1, 2 or 5 times a power of ten. */
export function tickStep(span: number, count: number) {
	const raw = span / count;
	const e = 10 ** Math.floor(Math.log10(raw));
	const m = raw / e;
	return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e;
}
