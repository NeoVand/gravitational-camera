/**
 * Chapter 1.6's turning pixel: free balls seen from an inertial frame and from a frame that turns steadily at Ω
 * about the z axis. Nothing is integrated. A ball let go at x₀ with velocity v₀ moves, seen from outside, in the
 * straight line
 *
 *   X(t) = x₀ + v₀ t,
 *
 * and the turning frame, whose axes have turned by Ωt, sees it at x(t) = R(−Ωt) X(t). A ball let go at rest on the
 * turntable has v₀ = Ω ẑ × x₀; one at rest outside has v₀ = 0. In the turning frame these satisfy
 *
 *   ẍ = −2 Ω × ẋ − Ω × (Ω × x),
 *
 * the Coriolis and centrifugal accelerations, with no true force. Two balls at rest in the turning frame a
 * separation ξ apart accelerate apart by Ω² ξ_⊥, which in chapter 1.4's form ξ̈ = −E ξ is the pseudo-tide
 *
 *   E^pseudo_ij = −Ω² (δ_ij − Ω̂_i Ω̂_j),
 *
 * with eigenvalues −Ω², −Ω² across the axis and 0 along it, and trace −2Ω²: no mass in empty space makes it.
 *
 * Time is counted in units of one tenth of a sidereal day, so that the slider's fastest rate, one turn in ten
 * units, is the Earth's.
 */
import { G, PERSON } from './tidal-ring';

export type Vec = { x: number; y: number; z: number };
export type Table = [[number, number, number], [number, number, number], [number, number, number]];

/** The Earth's sidereal day, s. */
export const SIDEREAL_DAY = 86164.1;
/** The Earth's rate of turning, s⁻¹: 7.29 × 10⁻⁵. */
export const EARTH = (2 * Math.PI) / SIDEREAL_DAY;
/** The figure's time unit, s: a tenth of a sidereal day, 2.39 hours. */
export const UNIT = SIDEREAL_DAY / 10;
/** The fastest rate the slider allows, per time unit: one turn in ten units, the Earth's. */
export const FASTEST = (2 * Math.PI) / 10;
/** The person's tide at a metre, GM/r³ for 70 kg, s⁻²: 4.67 × 10⁻⁹. */
export const PERSON_K = (G * PERSON) / 1 ** 3;
/** The Moon's tide at the Earth, s⁻², as chapter 1.4 gives it. */
export const MOON = 1.7e-13;

/** How the balls are let go: at rest on the turntable (moving with it) or at rest outside. */
export type Release = 'turntable' | 'still';

const cross = (a: Vec, b: Vec): Vec => ({
	x: a.y * b.z - a.z * b.y,
	y: a.z * b.x - a.x * b.z,
	z: a.x * b.y - a.y * b.x
});

/** The vector Ω = Ω ẑ, the axis of turning. */
const omegaVec = (omega: number): Vec => ({ x: 0, y: 0, z: omega });

/** A vector turned by `angle` about the z axis. */
export function turn(p: Vec, angle: number): Vec {
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	return { x: c * p.x - s * p.y, y: s * p.x + c * p.y, z: p.z };
}

/** The velocity a ball at x₀ is let go with, seen from outside. */
export const launch = (p0: Vec, omega: number, release: Release): Vec =>
	release === 'turntable' ? cross(omegaVec(omega), p0) : { x: 0, y: 0, z: 0 };

/** Where a ball let go at x₀ is at time t, seen from outside: a straight line. */
export function inertial(p0: Vec, omega: number, t: number, release: Release): Vec {
	const v = launch(p0, omega, release);
	return { x: p0.x + v.x * t, y: p0.y + v.y * t, z: p0.z + v.z * t };
}

/** Where the same ball is at time t, seen from the turning frame: the outside position turned back by Ωt. */
export const turning = (p0: Vec, omega: number, t: number, release: Release): Vec =>
	turn(inertial(p0, omega, t, release), -omega * t);

/** Its velocity in the turning frame: the outside velocity less Ω × X, turned back by Ωt. */
export function turningVelocity(p0: Vec, omega: number, t: number, release: Release): Vec {
	const v = launch(p0, omega, release);
	const w = cross(omegaVec(omega), inertial(p0, omega, t, release));
	return turn({ x: v.x - w.x, y: v.y - w.y, z: v.z - w.z }, -omega * t);
}

/** The centrifugal acceleration at x in the turning frame: −Ω × (Ω × x) = Ω² x_⊥, straight away from the axis. */
export const centrifugal = (p: Vec, omega: number): Vec => ({
	x: omega * omega * p.x,
	y: omega * omega * p.y,
	z: 0
});

/** The Coriolis acceleration of a ball moving at v in the turning frame: −2 Ω × v, at right angles to v. */
export function coriolis(v: Vec, omega: number): Vec {
	const w = cross(omegaVec(omega), v);
	return { x: -2 * w.x, y: -2 * w.y, z: -2 * w.z };
}

/** The pseudo-tide −Ω² (δ_ij − Ω̂_i Ω̂_j), s⁻² if Ω is in s⁻¹, for an axis along `axis` (any length). */
export function pseudoTide(omega: number, axis: Vec = { x: 0, y: 0, z: 1 }): Table {
	const n = Math.hypot(axis.x, axis.y, axis.z);
	const u = [axis.x / n, axis.y / n, axis.z / n];
	const w2 = omega * omega;
	return [0, 1, 2].map((i) =>
		// + 0: no entry is a negative zero
		[0, 1, 2].map((j) => -w2 * ((i === j ? 1 : 0) - u[i] * u[j]) + 0)
	) as Table;
}

/** The person's tide at distance r, s⁻²: GM (δ_ij − 3 n_i n_j)/r³ with n̂ along x, so diag(−2, 1, 1) GM/r³. */
export function personTide(r = 1, mass = PERSON): Table {
	const k = (G * mass) / r ** 3;
	return [
		[-2 * k, 0, 0],
		[0, k, 0],
		[0, 0, k]
	];
}

export const trace = (t: Table) => t[0][0] + t[1][1] + t[2][2];

/** The table applied to a vector. */
export const apply = (t: Table, v: Vec): Vec => ({
	x: t[0][0] * v.x + t[0][1] * v.y + t[0][2] * v.z,
	y: t[1][0] * v.x + t[1][1] * v.y + t[1][2] * v.z,
	z: t[2][0] * v.x + t[2][1] * v.y + t[2][2] * v.z
});

/**
 * The three eigenvalues of a symmetric table, smallest (the strongest stretch) first, by the trigonometric solution
 * of the characteristic cubic.
 */
export function eigenvalues(t: Table): [number, number, number] {
	const [[a, b, c], [, d, e], [, , f]] = t;
	const off = b * b + c * c + e * e;
	const q = (a + d + f) / 3;
	const scale = Math.max(Math.abs(a), Math.abs(d), Math.abs(f), Math.sqrt(off), 1e-300);
	if (off <= 1e-30 * scale * scale) {
		const v = [a, d, f].sort((x, y) => x - y);
		return [v[0], v[1], v[2]];
	}
	const p2 = (a - q) ** 2 + (d - q) ** 2 + (f - q) ** 2 + 2 * off;
	const p = Math.sqrt(p2 / 6);
	// B = (T − qI)/p, and r = det(B)/2
	const A = a - q;
	const D = d - q;
	const F = f - q;
	const det = A * (D * F - e * e) - b * (b * F - e * c) + c * (b * e - D * c);
	const r = Math.max(-1, Math.min(1, det / (2 * p ** 3)));
	const phi = Math.acos(r) / 3;
	const big = q + 2 * p * Math.cos(phi);
	const small = q + 2 * p * Math.cos(phi + (2 * Math.PI) / 3);
	return [small, 3 * q - big - small, big];
}

/** The ring's balls at rest, a unit circle across the axis: n of them, the first on +x, counter-clockwise. */
export function ring(n = 12): Vec[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (2 * Math.PI * i) / n;
		return { x: Math.cos(a), y: Math.sin(a), z: 0 };
	});
}

/** A second ring, standing through the axis: a unit circle in the plane of x and the axis. */
export function standing(n = 12): Vec[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (2 * Math.PI * i) / n;
		return { x: Math.cos(a), y: 0, z: Math.sin(a) };
	});
}

/**
 * The standing ring seen face-on at time t, in the turning frame: each ball's signed distance from the axis, within
 * the ring's own plane, and its height along the axis. Both halves of the ring turn about the axis by the same
 * angle, so the balls stay in one plane through it, and the view follows that plane. Distances are the same in
 * every frame, so the face-on shape is the same from outside.
 */
export function faceOn(p0: Vec, omega: number, t: number, release: Release) {
	const p = turning(p0, omega, t, release);
	// the plane's direction across the axis: where the ball let go at +x has gone
	const e = turning({ x: 1, y: 0, z: 0 }, omega, t, release);
	const n = Math.hypot(e.x, e.y);
	return { across: (p.x * e.x + p.y * e.y) / n, along: p.z };
}

/** How far across the axis a ball let go on the turntable has drifted, in units of its first distance: √(1 + Ω²t²). */
export const drift = (omega: number, t: number) => Math.hypot(1, omega * t);

/** The drift at which a run ends, in units of the first distance, and the longest run, time units. */
export const REACH = 2;
export const LONGEST = 24;

/** How long a run lasts at rate Ω, time units: until the balls let go on the turntable have drifted out to REACH. */
export const runLength = (omega: number) =>
	omega <= 0 ? LONGEST : Math.min(LONGEST, Math.sqrt(REACH * REACH - 1) / omega);
