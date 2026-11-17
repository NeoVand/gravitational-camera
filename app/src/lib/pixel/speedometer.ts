/**
 * The speedometer in the dark (paper, Eq. polar): a pixel moving through a room of masses at rest reads its own
 * velocity, every component, from one reading, with no map of the room; if anything in the room moves, the
 * eigenvalues of W turn complex (the motion alarm). Light, in a room of charges, reads only the part of its velocity
 * across its local field. Velocities in units of c; positions in the room's frame. Used by the demo "The
 * speedometer in the dark" (routes/demo/speedometer).
 */
import { cross, dot, minus, norm, plus, times, unit, type CMat3, type Vec3 } from './complex';
import { C, motionAlarm, movingChargesF, movingMassesW, restFrameVelocity } from './pixel';

export interface Thing {
	position: Vec3;
	/** kg */
	mass: number;
	/** for light */
	charge: number;
	/** its velocity in the room, units of c */
	velocity?: Vec3;
}

const gammaOf = (v: Vec3) => 1 / Math.sqrt(1 - dot(v, v));

/** The velocity, seen from a frame moving with v through the room, of something moving with u in the room. */
export function relativeVelocity(u: Vec3, v: Vec3): Vec3 {
	const s = norm(v);
	if (s === 0) return u;
	const n = unit(v);
	const g = gammaOf(v);
	const along = dot(u, n);
	const perp = minus(u, times(n, along));
	const d = 1 - dot(u, v);
	return plus(times(n, (along - s) / d), times(perp, 1 / (g * d)));
}

/** Where a point of the room is, relative to the pixel, at the pixel's own moment: contracted along its motion. */
function inPixelFrame(p: Vec3, pixel: Vec3, v: Vec3): Vec3 {
	const r = minus(p, pixel);
	const s = norm(v);
	if (s === 0) return r;
	const n = unit(v);
	return minus(r, times(n, (1 - 1 / gammaOf(v)) * dot(r, n)));
}

export function reading(
	room: Thing[],
	pixel: Vec3,
	v: Vec3
): { W: CMat3; alarm: number; read: Vec3 } {
	const W = movingMassesW(
		room.map((t) => ({
			mass: t.mass,
			position: inPixelFrame(t.position, pixel, v),
			velocity: times(relativeVelocity(t.velocity ?? [0, 0, 0], v), C)
		}))
	);
	// the room's frame moves at -v relative to the pixel: the pixel's own velocity is minus the field's rest frame's
	const read = times(restFrameVelocity(W), -1);
	return { W, alarm: motionAlarm(W), read };
}

/**
 * Light's reading in a room of charges at rest: the frame in which its field is purely electric moves, relative to
 * the pixel, with the drift velocity E x B / E^2; any boost along E keeps it so. So light reads the pixel's velocity
 * across E, and nothing along it.
 */
export function lightReading(room: Thing[], pixel: Vec3, v: Vec3): { read: Vec3; along: Vec3 } {
	const F = movingChargesF(
		room.map((t) => ({
			charge: t.charge,
			position: inPixelFrame(t.position, pixel, v),
			velocity: times(relativeVelocity(t.velocity ?? [0, 0, 0], v), C)
		}))
	);
	const E: Vec3 = [F[0].re, F[1].re, F[2].re];
	const B: Vec3 = [F[0].im, F[1].im, F[2].im];
	// the exact drift: the frame where B vanishes, moving along E x B with speed s, tanh(2 eta) = 2 |E x B| / (E^2 + B^2)
	const ExB = cross(E, B);
	const size = norm(ExB);
	if (size === 0) return { read: [0, 0, 0], along: unit(E) };
	const eta = 0.5 * Math.atanh((2 * size) / (dot(E, E) + dot(B, B)));
	const drift = times(unit(ExB), Math.tanh(eta));
	return { read: times(drift, -1), along: unit(E) };
}
