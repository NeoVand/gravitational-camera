/**
 * Chapter 11.1's shadow and ring. A camera at the circumference radius r from a hole of mass M, at rest or falling
 * from far away; lengths in units of GM/c², so that r_s = 2 and b_c = √27.
 *
 * The rays are the exact null geodesics of the Schwarzschild metric, integrated afresh here rather than taken from a
 * closed form: with u = 1/r, a ray in its plane obeys
 *
 *   d²u/dφ² + u = 3u²,   (du/dφ)² = 1/b² − u²(1 − 2u),
 *
 * which fourth-order Runge–Kutta steps in φ until the ray reaches the horizon (u = 1/2) or infinity (u = 0, where
 * u(φ) crosses zero at the ray's asymptotic angle). A camera at rest sees a ray of impact parameter b at the angle ψ
 * from the direction of the hole with sin ψ = (b/r)√(1 − 2/r), and traced back from the camera it starts with
 * du/dφ = √(1 − 2/r) cot ψ / r, inward for ψ < 90°. The exact ring is where the point straight behind the hole
 * appears, the ψ whose ray sweeps through 180° on its way back to infinity; the weak-field ring is √(2r_s/d) with
 * d = r. The shadow's radius and the blueshift are app/src/lib/vistas/lens.ts's, which the tests compare with these
 * rays, along with its elliptic-integral sweep. A camera falling from rest far away passes r at β = √(2/r) toward the
 * hole, and sees each direction moved by chapter 6.3's aberration and each frequency multiplied by 1/(1 − β cos ψ′).
 */
import { B_CRITICAL, blueshift, shadowRadius } from '../../vistas/lens';

export { B_CRITICAL, blueshift } from '../../vistas/lens';

export const DEG = Math.PI / 180;
/** The horizon r_s and the photon sphere, in GM/c². */
export const HORIZON = 2;
export const PHOTON_SPHERE = 3;

/** The slider: the camera's distance on a scale of powers of ten, 2.05 to 200 GM/c², opening at 40. */
export const DISTANCE = {
	min: 2.05,
	max: 200,
	opening: 40,
	/** Steps in log₁₀ r: the native slider's, the arrow keys' and Page Up and Page Down's. */
	step: 0.001,
	key: 0.01,
	page: 0.1
};
export const LOG_DISTANCE = { low: Math.log10(DISTANCE.min), high: Math.log10(DISTANCE.max) };

export type Motion = 'rest' | 'falling';
export const OPENING: { r: number; motion: Motion } = { r: DISTANCE.opening, motion: 'rest' };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const clampDistance = (r: number) => clamp(r, DISTANCE.min, DISTANCE.max);
export const distanceFromLog = (v: number) =>
	clampDistance(10 ** clamp(v, LOG_DISTANCE.low, LOG_DISTANCE.high));

// --- light's barrier -----------------------------------------------------------------------------------------------

/** Light's barrier (1 − r_s/r)/r²: a ray of impact parameter b reaches r only where it is below 1/b². */
export const barrier = (r: number) => (1 - HORIZON / r) / (r * r);

/** The top of the barrier, by golden-section search: the photon sphere. */
export function barrierPeak(): number {
	const g = (Math.sqrt(5) - 1) / 2;
	let a = 2.0001;
	let b = 20;
	for (let i = 0; i < 200; i++) {
		const c = b - g * (b - a);
		const d = a + g * (b - a);
		if (barrier(c) > barrier(d)) b = d;
		else a = c;
	}
	return (a + b) / 2;
}

// --- the rays ------------------------------------------------------------------------------------------------------

export type Fate = 'horizon' | 'infinity' | 'winding';

export interface Ray {
	fate: Fate;
	/** The angle swept to where the ray ends: the horizon, infinity, or the edge of a drawing. */
	phi: number;
	/** The smallest r on the way. */
	rMin: number;
	/** Points (x, y) = (r cos φ, r sin φ), if asked for. */
	points: [number, number][];
}

interface TraceOptions {
	/** The step in φ, radians. */
	step?: number;
	/** Give up (fate "winding") once the ray has swept this much. */
	maxPhi?: number;
	/** Stop, as at infinity, once r exceeds this. */
	rOut?: number;
	/** Keep the points for a drawing. */
	keep?: boolean;
}

/**
 * A ray from u = u0, du/dφ = v0 at φ = 0, followed in φ until it reaches the horizon, infinity (or rOut), or has swept
 * maxPhi.
 */
export function trace(u0: number, v0: number, options: TraceOptions = {}): Ray {
	const { step = 2e-3, maxPhi = 8 * Math.PI, rOut = Infinity, keep = false } = options;
	const uOut = Number.isFinite(rOut) ? 1 / rOut : 0;
	const uIn = 1 / HORIZON;
	const acc = (u: number) => -u + 3 * u * u;
	let u = u0;
	let v = v0;
	let phi = 0;
	let uMax = u0;
	const points: [number, number][] = [];
	const push = (uu: number, p: number) => {
		if (keep) points.push([Math.cos(p) / uu, Math.sin(p) / uu]);
	};
	if (u0 > uOut) push(u0, 0);
	// a ray that starts at infinity heading in is not yet at its end
	let started = u0 > uOut || v0 > 0;
	while (phi < maxPhi) {
		// a ray that heads almost straight along the radius sweeps little φ: take smaller steps
		const h = Math.min(step, (0.05 * Math.max(u, 1e-3)) / Math.max(Math.abs(v), 1e-12));
		const k1u = v;
		const k1v = acc(u);
		const k2u = v + 0.5 * h * k1v;
		const k2v = acc(u + 0.5 * h * k1u);
		const k3u = v + 0.5 * h * k2v;
		const k3v = acc(u + 0.5 * h * k2u);
		const k4u = v + h * k3v;
		const k4v = acc(u + h * k3u);
		const un = u + (h / 6) * (k1u + 2 * k2u + 2 * k3u + k4u);
		const vn = v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
		const pn = phi + h;
		if (un >= uIn) {
			// where it crosses the horizon, on the cubic through the two ends with their slopes
			const t = crossing(u, v, un, vn, h, uIn);
			const pc = phi + t * h;
			push(uIn, pc);
			return { fate: 'horizon', phi: pc, rMin: HORIZON, points };
		}
		if (started && un <= uOut) {
			const t = crossing(u, v, un, vn, h, uOut);
			const pc = phi + t * h;
			if (uOut > 0) push(uOut, pc);
			return { fate: 'infinity', phi: pc, rMin: 1 / Math.max(uMax, un), points };
		}
		if (un > uOut) started = true;
		u = un;
		v = vn;
		phi = pn;
		if (u > uMax) uMax = u;
		push(u, phi);
	}
	return { fate: 'winding', phi, rMin: 1 / uMax, points };
}

/** Where, as a fraction t of the step h, the cubic Hermite through (u0, v0) and (u1, v1) takes the value target. */
function crossing(
	u0: number,
	v0: number,
	u1: number,
	v1: number,
	h: number,
	target: number
): number {
	const at = (t: number) => {
		const t2 = t * t;
		const t3 = t2 * t;
		return (
			(2 * t3 - 3 * t2 + 1) * u0 +
			(t3 - 2 * t2 + t) * h * v0 +
			(-2 * t3 + 3 * t2) * u1 +
			(t3 - t2) * h * v1 -
			target
		);
	};
	let lo = 0;
	let hi = 1;
	const rising = at(1) > at(0);
	for (let i = 0; i < 60; i++) {
		const mid = (lo + hi) / 2;
		if (at(mid) < 0 === rising) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/** The angle at which a camera at rest at r sees a ray of impact parameter b, on the side of the hole (ψ ≤ 90°). */
export const angleOf = (r: number, b: number) =>
	Math.asin(clamp((b / r) * Math.sqrt(1 - HORIZON / r), 0, 1));

/** The impact parameter of the ray a camera at rest at r sees at the angle ψ from the hole. */
export const impactOf = (r: number, psi: number) =>
	(r * Math.sin(psi)) / Math.sqrt(1 - HORIZON / r);

/** The largest impact parameter whose ray reaches r at all, r/√(1 − 2/r) (ψ = 90°). */
export const reachable = (r: number) => r / Math.sqrt(1 - HORIZON / r);

/** The ray a camera at rest at r sees at ψ from the hole, traced back from the camera. */
export function rayFrom(r: number, psi: number, options: TraceOptions = {}): Ray {
	const v0 = (Math.sqrt(1 - HORIZON / r) * Math.cos(psi)) / (r * Math.max(Math.sin(psi), 1e-300));
	return trace(1 / r, v0, options);
}

/** The exact deflection of a ray of impact parameter b > b_c that comes in from infinity and leaves to it. */
export function deflection(b: number, step = 1e-3): number {
	const ray = trace(0, 1 / b, { step });
	return ray.fate === 'infinity' ? ray.phi - Math.PI : NaN;
}

/** The weak-field deflection 4GM/bc² = 2r_s/b. */
export const weakDeflection = (b: number) => 4 / b;

/** The shadow's radius α_h seen from rest at any r > r_s: larger than 90° inside the photon sphere. */
export function shadowEdge(r: number): number {
	// lens.ts's arcsin beyond the photon sphere; at it, rounding can carry the sine past 1
	const a =
		r > PHOTON_SPHERE
			? shadowRadius(r)
			: Math.asin(Math.min(1, (B_CRITICAL * Math.sqrt(1 - HORIZON / r)) / r));
	return r >= PHOTON_SPHERE ? a : Math.PI - a;
}

/**
 * The exact ring: the angle ψ from the hole at which a camera at rest at r sees the point straight behind the hole,
 * whose ray sweeps through 180° on its way back to infinity. Found by bisection between the shadow's edge and 180°.
 */
export function exactRing(r: number, step = 2e-3): number {
	let lo = shadowEdge(r);
	let hi = Math.PI;
	for (let i = 0; i < 56; i++) {
		const mid = (lo + hi) / 2;
		const ray = rayFrom(r, mid, { step, maxPhi: 4 * Math.PI });
		if (ray.fate !== 'infinity' || ray.phi > Math.PI) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/** The weak-field ring √(2r_s/d), with d = r. */
export const weakRing = (r: number) => Math.sqrt((2 * HORIZON) / r);

// --- the camera ----------------------------------------------------------------------------------------------------

/** The speed of a body falling from rest far away, as a static camera at r measures it, in units of c: √(2GM/rc²). */
export const fallingSpeed = (r: number) => Math.sqrt(HORIZON / r);

/** The acceleration that holds a camera at rest at r, (GM/r²)/√(1 − r_s/r), in units of c⁴/GM. */
export const hovering = (r: number) => 1 / (r * r * Math.sqrt(1 - HORIZON / r));

/** A direction at ψ from the hole for the camera at rest, as the falling camera sees it (chapter 6.3's aberration). */
export function aberrate(psi: number, beta: number): number {
	return Math.atan2(Math.sin(psi) * Math.sqrt(1 - beta * beta), Math.cos(psi) + beta);
}

/** The camera's angle ψ′ of a direction the camera at rest sees at ψ, for either motion. */
export const seenAt = (psi: number, r: number, motion: Motion) =>
	motion === 'rest' ? psi : aberrate(psi, fallingSpeed(r));

/**
 * The factor by which the sky's temperature is raised in the direction ψ′ from the hole, as the camera sees it:
 * 1/√(1 − r_s/r) at rest, and 1/(1 − β cos ψ′) falling (the blueshift times 6.3's Doppler factor, since γ = 1/√(1 − r_s/r)).
 */
export function warming(psiSeen: number, r: number, motion: Motion): number {
	if (motion === 'rest') return blueshift(r);
	return 1 / (1 - fallingSpeed(r) * Math.cos(psiSeen));
}

/** Everything the figure prints and draws for one camera. */
export function camera(r: number, motion: Motion) {
	const beta = fallingSpeed(r);
	const shadow = shadowEdge(r);
	const ring = exactRing(r);
	const weak = weakRing(r);
	const shadowSeen = seenAt(shadow, r, motion);
	return {
		r,
		motion,
		beta,
		shadow,
		shadowFalling: aberrate(shadow, beta),
		shadowSeen,
		ring,
		ringFalling: aberrate(ring, beta),
		ringSeen: seenAt(ring, r, motion),
		weak,
		weakSeen: weak < Math.PI ? seenAt(weak, r, motion) : NaN,
		blueshift: blueshift(r),
		hovering: hovering(r),
		/** The sky's warming at the shadow's edge and straight away from the hole, as this camera sees it. */
		warmest: warming(shadowSeen, r, motion),
		coolest: warming(Math.PI, r, motion)
	};
}
export type Camera = ReturnType<typeof camera>;

// --- the drawing of the plane --------------------------------------------------------------------------------------

/** The fan's impact parameters, in units of b_c: one ray just outside b_c winds round the photon sphere. */
export const FAN = [0.5, 0.75, 0.9, 1.005, 1.05, 1.2, 1.45, 1.75, 2.1, 2.5, 3];

/** The narrowest stretch of the plane drawn, in GM/c², so that the hole never fills the panel. */
export const MIN_SPAN = 40;

/**
 * The window onto the plane, in GM/c², for a panel `aspect` = height/width: wide enough for the camera, with the hole
 * at about a quarter of the way across when the camera is far, and midway between the edges and the camera when near.
 */
export function planeWindow(r: number, aspect: number) {
	const span = Math.max(MIN_SPAN, r / 0.66);
	const xMin = Math.min(-0.28 * span, r / 2 - span / 2);
	const xMax = xMin + span;
	const height = span * aspect;
	return { xMin, xMax, yMin: -height / 2, yMax: height / 2, span };
}

/** A length for the scale bar near a fifth of the span: 1, 2 or 5 times a power of ten. */
export function scaleBar(span: number): number {
	const target = span / 5;
	const e = 10 ** Math.floor(Math.log10(target));
	const m = target / e;
	return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e;
}

export interface FanRay {
	/** b over b_c. */
	k: number;
	b: number;
	psi: number;
	fate: Fate;
	points: [number, number][];
}

/** The fan's rays that reach a camera at r from the side of the hole, traced back until they leave the window. */
export function fan(r: number, rOut: number, step = 0.01): FanRay[] {
	const out: FanRay[] = [];
	for (const k of FAN) {
		const b = k * B_CRITICAL;
		if (b > reachable(r)) continue;
		const psi = angleOf(r, b);
		const ray = rayFrom(r, psi, { step, rOut, keep: true, maxPhi: 6 * Math.PI });
		out.push({ k, b, psi, fate: ray.fate, points: ray.points });
	}
	return out;
}

/** The ray of the exact ring, traced back from the camera. */
export function ringRay(r: number, rOut: number, step = 0.01): [number, number][] {
	return rayFrom(r, exactRing(r), { step, rOut, keep: true }).points;
}

// --- the sky -------------------------------------------------------------------------------------------------------

/** Lambert's azimuthal equal-area projection about the hole: ψ from the hole lies at sin(ψ/2) of the disc's radius. */
export const lambert = (psi: number) => Math.sin(clamp(psi, 0, Math.PI) / 2);

/** The colour scale of the sky's warming, on a scale of powers of ten from 1/2 to 100. */
export const TONE = { low: 0.5, high: 100 };
export const TONE_TICKS = [
	{ at: 0.5, text: '1/2' },
	{ at: 1, text: '1' },
	{ at: 2, text: '2' },
	{ at: 5, text: '5' },
	{ at: 10, text: '10' },
	{ at: 20, text: '20' },
	{ at: 50, text: '50' },
	{ at: 100, text: '100' }
];

/** Where a factor lies on the scale, 0 to 1. */
export const tone = (factor: number) =>
	clamp(Math.log(factor / TONE.low) / Math.log(TONE.high / TONE.low), 0, 1);

/**
 * The sky's colour at a factor: a neutral grey, brighter where the sky is warmer (a temperature is neutral, and the
 * figures' orange and blue are kept for stretch and squeeze). OKLCH lightness from 0.30 to 0.96.
 */
export const skyLightness = (factor: number) => 0.3 + 0.66 * tone(factor);
export const skyColour = (factor: number) => `oklch(${skyLightness(factor).toFixed(4)} 0.012 80)`;

// --- the words -----------------------------------------------------------------------------------------------------

/** An angle in degrees, to two decimals: "20.20". */
export const degrees = (a: number) => (a / DEG).toFixed(2);

/** A distance in GM/c², to three figures: "2.05", "40.0", "200". */
export function distanceText(r: number): string {
	if (r >= 99.95) return r.toFixed(0);
	if (r >= 9.995) return r.toFixed(1);
	return r.toFixed(2);
}

/** A pure number to three figures, or four for a factor close to 1: "1.026", "6.41". */
export function factorText(x: number): string {
	if (x < 1.1 && x > 0.9) return x.toFixed(3);
	return x.toPrecision(3);
}
