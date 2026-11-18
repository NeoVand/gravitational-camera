/**
 * The camera sees the present (paper, Section VIII): a body crossing a scene in a straight line, with light slowed so
 * that the body moves at a good fraction of its speed. The tidal field everywhere points at where the body is now;
 * light shows where it was. If the body stops, the news spreads at the speed of light: outside the sphere it has
 * reached, the field still points at where the body would have been. Used by the demo "Now and then"
 * (routes/demo/now-and-then). Units: the scene's own, with light's speed `c` in scene units per second.
 */
import { minus, norm, plus, symmetricEigen, type Vec3 } from './complex';
import { C as LIGHT, movingMassesW } from './pixel';

export interface Crossing {
	/** where the body is at t = 0 */
	start: Vec3;
	/** its velocity, as a fraction of light's speed, along +x */
	beta: number;
	/** light's speed, scene units per second */
	c: number;
	/** when it stops, if it does */
	stop?: number;
}

/** Where the body is at time t. */
export function position(k: Crossing, t: number): Vec3 {
	const until = k.stop === undefined ? t : Math.min(t, k.stop);
	return plus(k.start, [k.beta * k.c * until, 0, 0]);
}

/** Where it would be had it not stopped. */
export function extrapolated(k: Crossing, t: number): Vec3 {
	return plus(k.start, [k.beta * k.c * t, 0, 0]);
}

/** Where light reaching x at time t left the body (solved by bisection on the time of emission). */
export function retarded(k: Crossing, x: Vec3, t: number): Vec3 {
	let lo = t - 1e3 / k.c,
		hi = t;
	for (let i = 0; i < 100; i++) {
		const mid = 0.5 * (lo + hi);
		// light that left at `mid` would not have arrived by t: what arrives now left earlier
		if (norm(minus(x, position(k, mid))) > k.c * (t - mid)) hi = mid;
		else lo = mid;
	}
	return position(k, 0.5 * (lo + hi));
}

/** Whether the news of the stop has reached x by time t. */
export function informed(k: Crossing, x: Vec3, t: number): boolean {
	if (k.stop === undefined || t < k.stop) return false;
	return norm(minus(x, position(k, k.stop))) < k.c * (t - k.stop);
}

/**
 * The tidal field at x and time t, linearized gravity: the field of the body moving steadily from its extrapolated
 * position until the news of a stop arrives, then the field of the body at rest. (The shell where the news is
 * passing carries the wave that joins the two; it is not drawn.)
 */
export function stretchAxis(k: Crossing, x: Vec3, t: number): { axis: Vec3; strength: number } {
	const moving = !informed(k, x, t) && !(k.stop !== undefined && t >= k.stop && k.beta === 0);
	const p = moving ? extrapolated(k, t) : position(k, t);
	const v: Vec3 = moving ? [k.beta * LIGHT, 0, 0] : [0, 0, 0];
	// the field's shape depends only on positions in units of the scene; its size is irrelevant here
	const W = movingMassesW([{ mass: 1e9, position: p, velocity: v }], x);
	const { values, vectors } = symmetricEigen(W.map((r) => r.map((z) => z.re)));
	return { axis: [vectors[0][0], vectors[1][0], vectors[2][0]], strength: Math.abs(values[0]) };
}

/** The angle between two lines (sign free). */
export function lineAngle(a: Vec3, b: Vec3): number {
	const c = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (norm(a) * norm(b));
	return Math.acos(Math.min(1, c));
}
