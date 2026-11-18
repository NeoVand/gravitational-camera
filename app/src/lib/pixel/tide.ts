/**
 * The tidal field at one point, exactly: what a single pixel of the camera reads (paper, Section II).
 *
 * E_ij = d_i d_j Phi, in s^-2. Two free particles a small vector xi apart accelerate relative to one another by
 * -E_ij xi_j, so a negative component is a stretch along that axis and a positive one a squeeze. The tensors here are
 * closed forms, those of reference/gravcam/tidal.py (a uniform sphere, a uniform box) and gravitomagnetic.py (the
 * magnetic part B_ij of slowly moving mass), and the specs beside this file pin them to that reference.
 */
import { C, G } from '../engine/physics/constants';
import type { AnalyzedObject, Vec3 } from '../engine/types';
import { symmetricEigen } from './complex';
import { spinDipole } from './probe';

/** A symmetric 3 x 3 matrix, s^-2, as rows. */
export type Mat3 = number[][];

export const zero3 = (): Mat3 => [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

export const add3 = (...list: Mat3[]): Mat3 =>
	list.reduce((sum, m) => sum.map((row, i) => row.map((v, j) => v + m[i][j])), zero3());

export const scale3 = (m: Mat3, s: number): Mat3 => m.map((row) => row.map((v) => v * s));

/** u.M.v */
export const contract3 = (m: Mat3, u: Vec3, v: Vec3): number =>
	u.reduce((s, ui, i) => s + ui * (m[i][0] * v[0] + m[i][1] * v[1] + m[i][2] * v[2]), 0);

/** The sum of the products of matching components, A : B. */
export const inner3 = (a: Mat3, b: Mat3): number =>
	a.reduce((s, row, i) => s + row.reduce((t, v, j) => t + v * b[i][j], 0), 0);

// --- exact tensors of uniform bodies ----------------------------------------------------------------------------------

/** (G M / r^3) (delta_ij - 3 n_i n_j): a point mass, and any spherically symmetric body seen from outside. */
export function pointTide(mass: number, center: Vec3, at: Vec3): Mat3 {
	const x = [at[0] - center[0], at[1] - center[1], at[2] - center[2]];
	const r = Math.hypot(x[0], x[1], x[2]);
	const n = [x[0] / r, x[1] / r, x[2] / r];
	const k = (G * mass) / (r * r * r);
	// n_i n_j is multiplied first, so that the result is exactly symmetric
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => k * ((i === j ? 1 : 0) - 3 * (n[i] * n[j]))));
}

/** A uniform sphere: a point mass outside, (4 pi G rho / 3) delta_ij inside. */
export function sphereTide(density: number, center: Vec3, radius: number, at: Vec3): Mat3 {
	const r = Math.hypot(at[0] - center[0], at[1] - center[1], at[2] - center[2]);
	const volume = (4 / 3) * Math.PI * radius ** 3;
	if (r >= radius) return pointTide(density * volume, center, at);
	const k = (4 / 3) * Math.PI * G * density;
	return [
		[k, 0, 0],
		[0, k, 0],
		[0, 0, k]
	];
}

/** atan(a / b) in [-pi/2, pi/2]; a zero denominator gives +-pi/2 with the sign of a, and 0 / 0 gives 0. */
function atanRatio(a: number, b: number): number {
	if (b === 0) return a === 0 ? 0 : (Math.sign(a) * Math.PI) / 2;
	return Math.atan(a / b);
}

/** ln((zHigh + rHigh) / (zLow + rLow)) with r = sqrt(u2 + z^2), without the cancellation of z + r at negative z. */
function logRatioAlong(u2: number, zLow: number, zHigh: number): number {
	const rLow = Math.sqrt(u2 + zLow * zLow);
	const rHigh = Math.sqrt(u2 + zHigh * zHigh);
	if (zLow >= 0) return Math.log((zHigh + rHigh) / (zLow + rLow));
	if (zHigh < 0) return Math.log((rLow - zLow) / (rHigh - zHigh));
	return Math.log(((zHigh + rHigh) * (rLow - zLow)) / u2);
}

/**
 * A uniform box aligned with the axes, at a point not on its surface: the prism formulas of gravimetry, as in
 * reference/gravcam/tidal.py (uniform_box_tidal_tensor). The diagonal is a signed sum of arctangents over the eight
 * corners, the rest a signed sum of logarithms over the twelve edges.
 */
export function boxTide(density: number, center: Vec3, half: Vec3, at: Vec3): Mat3 {
	const lo = [0, 1, 2].map((k) => center[k] - half[k] - at[k]);
	const hi = [0, 1, 2].map((k) => center[k] + half[k] - at[k]);
	const X = [lo[0], hi[0]];
	const Y = [lo[1], hi[1]];
	const Z = [lo[2], hi[2]];
	let xx = 0;
	let yy = 0;
	let zz = 0;
	for (let i = 0; i < 2; i++)
		for (let j = 0; j < 2; j++)
			for (let k = 0; k < 2; k++) {
				const sign = (i + j + k) % 2 === 1 ? 1 : -1;
				const r = Math.hypot(X[i], Y[j], Z[k]);
				xx += sign * atanRatio(Y[j] * Z[k], X[i] * r);
				yy += sign * atanRatio(Z[k] * X[i], Y[j] * r);
				zz += sign * atanRatio(X[i] * Y[j], Z[k] * r);
			}
	let xy = 0;
	let yz = 0;
	let zx = 0;
	for (let i = 0; i < 2; i++)
		for (let j = 0; j < 2; j++) {
			const sign = i === j ? 1 : -1;
			xy -= sign * logRatioAlong(X[i] * X[i] + Y[j] * Y[j], Z[0], Z[1]);
			yz -= sign * logRatioAlong(Y[i] * Y[i] + Z[j] * Z[j], X[0], X[1]);
			zx -= sign * logRatioAlong(Z[i] * Z[i] + X[j] * X[j], Y[0], Y[1]);
		}
	const k = G * density;
	return [
		[k * xx, k * xy, k * zx],
		[k * xy, k * yy, k * yz],
		[k * zx, k * yz, k * zz]
	];
}

/** An object's whole shape filled with one density. */
function shapeTide(o: AnalyzedObject, density: number, at: Vec3): Mat3 {
	return o.half
		? boxTide(density, o.center, o.half, at)
		: sphereTide(density, o.center, o.radius, at);
}

/**
 * The tide of an object's own matter: its shape less its children, at its own density. Summed over every object of a
 * scene this is the scene's tensor, the same as the reference's sum of density contrasts (scene_tidal_tensor).
 */
export function ownTide(objects: AnalyzedObject[], index: number, at: Vec3): Mat3 {
	const o = objects[index];
	let total = shapeTide(o, o.density, at);
	objects.forEach((child) => {
		if (child.parent === index) total = add3(total, shapeTide(child, -o.density, at));
	});
	return total;
}

/** The mass of an object's own matter, kg. */
export const ownMass = (o: AnalyzedObject): number => o.density * o.ownVolume;

// --- the magnetic part ------------------------------------------------------------------------------------------------

/**
 * B of a body moving uniformly with velocity v, to first order in v / c, from its tide E at rest:
 * B_ij = (1 / c) [eps_ikl v_k E_lj + eps_jkl v_k E_li]. For a point mass this is the reference's magnetic_point,
 * (3 G M / c r^3) [n (n x v) + (n x v) n]; being linear in the mass, it holds for a body of any shape.
 */
export function movingMagnetic(E: Mat3, v: Vec3): Mat3 {
	const vE = [
		[0, 1, 2].map((j) => v[1] * E[2][j] - v[2] * E[1][j]),
		[0, 1, 2].map((j) => v[2] * E[0][j] - v[0] * E[2][j]),
		[0, 1, 2].map((j) => v[0] * E[1][j] - v[1] * E[0][j])
	];
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (vE[i][j] + vE[j][i]) / C));
}

/**
 * The magnetic part of an object's own matter, where it moves: a body carried along at `velocity`, or a sphere
 * turning rigidly about an axis, which is its centre's motion and a spin about its own centre (exactly a spin dipole
 * outside it, with angular momentum (2/5) M R^2 omega). Undefined for matter at rest.
 */
export function ownMagnetic(objects: AnalyzedObject[], index: number, at: Vec3): Mat3 | undefined {
	const o = objects[index];
	let total: Mat3 | undefined;
	const v = o.velocity;
	if (v && (v[0] || v[1] || v[2])) total = movingMagnetic(ownTide(objects, index, at), v);
	if (o.spin && o.spin.rate !== 0 && !o.half) {
		const len = Math.hypot(...o.spin.axis);
		const omega = o.spin.axis.map((a) => (2 * Math.PI * o.spin!.rate * a) / len) as Vec3;
		const arm = o.center.map((c, k) => c - o.spin!.center[k]);
		const carried: Vec3 = [
			omega[1] * arm[2] - omega[2] * arm[1],
			omega[2] * arm[0] - omega[0] * arm[2],
			omega[0] * arm[1] - omega[1] * arm[0]
		];
		const mass = o.density * (4 / 3) * Math.PI * o.radius ** 3;
		const L = omega.map((w) => 0.4 * mass * o.radius ** 2 * w) as Vec3;
		total = add3(
			total ?? zero3(),
			movingMagnetic(pointTide(mass, o.center, at), carried),
			spinDipole(L, o.center, at)
		);
	}
	return total;
}

// --- what a reading says -----------------------------------------------------------------------------------------------

export interface Principal {
	/** s^-2: negative is a stretch along the axis, positive a squeeze. */
	value: number;
	/** A unit vector along the axis (its sign means nothing). */
	axis: Vec3;
}

/** The three principal values and their axes, the strongest stretch first (ascending). */
export function principal(E: Mat3): Principal[] {
	const { values, vectors } = symmetricEigen(E);
	return values.map((value, n) => ({
		value,
		axis: [vectors[0][n], vectors[1][n], vectors[2][n]] as Vec3
	}));
}

/** The principal value of largest size, with its sign. */
export function largest(E: Mat3): Principal {
	return principal(E).reduce((a, b) => (Math.abs(b.value) > Math.abs(a.value) ? b : a));
}

/** The size of a tensor: its largest principal value, without the sign. */
export const size3 = (E: Mat3): number => Math.abs(largest(E).value);

/** A source's part along the total, (E_k : E) / (E : E): the shares of all the sources add up to one. */
export const share = (part: Mat3, total: Mat3): number =>
	inner3(part, total) / inner3(total, total);

export interface RingPoint {
	/** Where the particle sits on the unit ring, in the plane's two axes. */
	x: number;
	y: number;
	/** Its acceleration relative to the centre per unit of the ring's radius, s^-2, in the plane. */
	ax: number;
	ay: number;
	/** The part of that along the radius: positive moves it outward (a stretch). */
	radial: number;
}

/**
 * A ring of free particles in the plane of the unit vectors u and v, as the field moves them: the particle at xi
 * accelerates by -E.xi; the part of that in the plane is returned (the part across it is not drawn).
 */
export function ring(E: Mat3, u: Vec3, v: Vec3, count = 12): RingPoint[] {
	const uu = contract3(E, u, u);
	const uv = contract3(E, u, v);
	const vv = contract3(E, v, v);
	return Array.from({ length: count }, (_, k) => {
		const t = (2 * Math.PI * k) / count;
		const x = Math.cos(t);
		const y = Math.sin(t);
		const ax = -(uu * x + uv * y);
		const ay = -(uv * x + vv * y);
		return { x, y, ax, ay, radial: ax * x + ay * y };
	});
}

/** The plane of the two principal values of largest size: its two axes, the larger first. */
export function principalPlane(E: Mat3): [Principal, Principal] {
	const sorted = principal(E).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
	return [sorted[0], sorted[1]];
}

/** How far the largest displacement of a ring is drawn, as a fraction of its radius. */
export const DRAWN = 0.3;

export interface Exaggeration {
	/** The largest change of the ring in one second of free fall from rest, as a fraction of its radius: E / 2. */
	inOneSecond: number;
	/** How many times larger than that it is drawn. */
	factor: number;
	/** The time of free fall after which the ring would look as drawn, s (to first order in the change). */
	fallTime: number;
}

/** How much a drawing that shows a tide of size `tide` (s^-2) as `drawn` of the ring's radius exaggerates. */
export function exaggeration(tide: number, drawn = DRAWN): Exaggeration {
	const inOneSecond = tide / 2;
	return { inOneSecond, factor: drawn / inOneSecond, fallTime: Math.sqrt((2 * drawn) / tide) };
}

// --- directions in words -----------------------------------------------------------------------------------------------

export interface Landmark {
	/** How an axis along it reads: "up-down", "toward the Sun". */
	along: string;
	/** How it reads after "from": "the vertical", "the line to the Sun". */
	from: string;
	dir: Vec3;
	/** How the plane across it reads, if not "across " and `from`: "every horizontal direction". */
	across?: string;
	/** One of the demo's own axes, which an angle may be counted from; a line to some body is not. */
	frame?: boolean;
}

const angleBetween = (a: Vec3, b: Vec3): number => {
	const c =
		Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b));
	return Math.acos(Math.min(1, c));
};

/** The landmark nearest to an axis (a line: the sign of either means nothing), and the angle between them. */
export function nearestLandmark(axis: Vec3, marks: Landmark[]): { mark: Landmark; angle: number } {
	return marks
		.map((mark) => ({ mark, angle: angleBetween(axis, mark.dir) }))
		.reduce((a, b) => (b.angle < a.angle ? b : a));
}

/**
 * An axis in words: the nearest landmark's name within `tolerance` (radians), else its angle from the nearest of
 * the demo's own axes (from the nearest landmark of any kind, if the demo names no axes).
 */
export function nameAxis(axis: Vec3, marks: Landmark[], tolerance = (3 * Math.PI) / 180): string {
	if (!marks.length) return '';
	const near = nearestLandmark(axis, marks);
	if (near.angle <= tolerance) return near.mark.along;
	const frame = marks.filter((m) => m.frame);
	const { mark, angle } = frame.length ? nearestLandmark(axis, frame) : near;
	if (Math.PI / 2 - angle <= tolerance) return `across ${mark.from}`;
	return `${Math.round((angle * 180) / Math.PI)}° from ${mark.from}`;
}

/** The plane across an axis in words. */
export function nameAcross(axis: Vec3, marks: Landmark[], tolerance = (3 * Math.PI) / 180): string {
	if (!marks.length) return '';
	const { mark, angle } = nearestLandmark(axis, marks);
	if (angle <= tolerance) return mark.across ?? `every direction across ${mark.from}`;
	return `every direction across the first axis`;
}

export interface PrincipalRow {
	value: number;
	/** How many of the three principal values this row stands for: two where they are equal. */
	times: 1 | 2;
	direction: string;
}

/**
 * The principal values as rows to print, the largest in size first. Two that agree to a part in a million of the
 * largest have no axes of their own, only a plane: they are given as one row, twice.
 */
export function principalRows(E: Mat3, marks: Landmark[]): PrincipalRow[] {
	const p = principal(E);
	const top = Math.max(...p.map((q) => Math.abs(q.value)));
	if (top === 0) return [];
	const same = (a: number, b: number) => Math.abs(p[a].value - p[b].value) <= 1e-6 * top;
	const rows: PrincipalRow[] = [];
	const pair = same(0, 1) ? [0, 1, 2] : same(1, 2) ? [1, 2, 0] : undefined;
	if (pair && !same(0, 2)) {
		const [a, b, alone] = pair;
		rows.push({ value: p[alone].value, times: 1, direction: nameAxis(p[alone].axis, marks) });
		rows.push({
			value: (p[a].value + p[b].value) / 2,
			times: 2,
			direction: nameAcross(p[alone].axis, marks)
		});
	} else {
		for (const q of p) rows.push({ value: q.value, times: 1, direction: nameAxis(q.axis, marks) });
	}
	return rows.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

// --- familiar tides, for scale (paper, Section II) -----------------------------------------------------------------------

/** The Earth's own tide at its surface, 2 G M / R^3 with the real Earth's mass and mean radius: 3.1e-6 s^-2. */
export const EARTH_TIDE = (2 * G * 5.9722e24) / 6.371e6 ** 3;
/** A person of 70 kg one metre away, 2 G M / r^3: 9e-9 s^-2. */
export const PERSON_TIDE = 2 * G * 70;

/**
 * The tide of a whole scene at any point, in matter or out of it: every object's own matter (reference:
 * tidal.scene_tidal_tensor). Inside a uniform sphere its own part is (4 pi G rho / 3) delta_ij, so inside nested
 * spheres the shells a point lies within give no stretch at all, and only what lies deeper does.
 */
export function sceneTide(objects: AnalyzedObject[], at: Vec3, subtractRoom = false): Mat3 {
	let sum = zero3();
	for (const o of objects) {
		// as the engine has it: each shape whole, at its density over its parent's; the empty room may be left out
		if (subtractRoom && o.background) continue;
		const around = o.parent >= 0 ? objects[o.parent].density : 0;
		sum = add3(sum, shapeTide(o, o.density - around, at));
	}
	return sum;
}
