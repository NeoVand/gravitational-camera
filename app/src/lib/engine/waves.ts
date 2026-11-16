/**
 * Waves from spinning bodies, as a wave camera sees them
 * (reference/gravcam/waves.py has the derivations and the tests against a
 * brute-force projection).
 *
 * A rotor is a set of spheres sharing one spin. It radiates at twice its
 * rotation rate, with amplitude A = 4 G ΔI Ω² / (c⁴ r), where ΔI is the
 * difference of the two principal second moments of its mass in the plane of
 * rotation. At inclination ι, h₊ = A (1 + cos²ι) / 2 and hₓ = A cos ι, and the
 * circular part V / I is positive when the pattern turns anticlockwise as the
 * observer sees it.
 */
import { C, G, HBAR } from './physics/constants';
import type { AnalyzedObject, Vec3 } from './types';

export interface Rotor {
	members: string[];
	/** A point on the axis, m. */
	center: Vec3;
	/** Unit vector along the angular velocity. */
	axis: Vec3;
	/** Angular speed, rad/s. */
	omega: number;
	/** I₁ − I₂ in the plane of rotation, kg m². */
	deltaInertia: number;
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
const unit = (a: Vec3): Vec3 => {
	const n = Math.hypot(...a);
	return [a[0] / n, a[1] / n, a[2] / n];
};

/** Two unit vectors spanning the plane across `u`. */
function planeOf(u: Vec3): [Vec3, Vec3] {
	const k = [0, 1, 2].reduce((best, i) => (Math.abs(u[i]) < Math.abs(u[best]) ? i : best), 0);
	const e: Vec3 = [0, 0, 0];
	e[k] = 1;
	const along = dot(e, u);
	const e1 = unit([e[0] - along * u[0], e[1] - along * u[1], e[2] - along * u[2]]);
	return [e1, cross(u, e1)];
}

/** The scene's rotors: spinning spheres grouped by their spin; still ones are left out. */
export function rotors(objects: AnalyzedObject[]): Rotor[] {
	const groups = new Map<string, AnalyzedObject[]>();
	for (const o of objects) {
		if (!o.spin || o.spin.rate === 0) continue;
		const key = JSON.stringify([o.spin.center, o.spin.axis, o.spin.rate]);
		groups.set(key, [...(groups.get(key) ?? []), o]);
	}
	return [...groups.values()].map((members) => {
		const spin = members[0].spin!;
		const axis = unit(spin.axis);
		const [e1, e2] = planeOf(axis);
		let mxx = 0;
		let myy = 0;
		let mxy = 0;
		for (const o of members) {
			const p = o.parent >= 0 ? objects[o.parent] : undefined;
			const mass = (o.density - (p?.density ?? 0)) * (4 / 3) * Math.PI * o.radius ** 3;
			const offset = sub(o.center, spin.center);
			const x = dot(offset, e1);
			const y = dot(offset, e2);
			mxx += mass * x * x;
			myy += mass * y * y;
			mxy += mass * x * y;
		}
		const sense = spin.rate >= 0 ? 1 : -1;
		return {
			members: members.map((o) => o.id),
			center: [...spin.center] as Vec3,
			axis: [sense * axis[0], sense * axis[1], sense * axis[2]],
			omega: 2 * Math.PI * Math.abs(spin.rate),
			deltaInertia: Math.sqrt((mxx - myy) ** 2 + 4 * mxy * mxy)
		};
	});
}

/** Wavelength of a rotor's waves, m: λ = π c / Ω. */
export const wavelength = (r: Rotor, c = C) => (Math.PI * c) / r.omega;

/** Total power radiated, W: (32 / 5) G ΔI² Ω⁶ / c⁵. */
export const power = (r: Rotor, c = C) =>
	((32 / 5) * G * r.deltaInertia ** 2 * r.omega ** 6) / c ** 5;

/** Gravitons radiated per second. */
export const gravitonRate = (r: Rotor, c = C) => power(r, c) / (HBAR * 2 * r.omega);

export interface Seen {
	distance: number;
	/** Unit vector from the observer toward the rotor. */
	direction: Vec3;
	cosIota: number;
	amplitude: number;
	/** Energy flux, W m⁻². */
	flux: number;
	/** V / I. */
	circular: number;
	/** Q / I, in the basis of the projected axis. */
	linear: number;
}

/** What an observer at `observer` receives from a rotor. */
export function seenFrom(r: Rotor, observer: Vec3, c = C): Seen {
	const toward = sub(observer, r.center);
	const distance = Math.hypot(...toward);
	const n: Vec3 = [toward[0] / distance, toward[1] / distance, toward[2] / distance];
	const cosIota = dot(r.axis, n);
	const aPlus = 0.5 * (1 + cosIota * cosIota);
	const aCross = cosIota;
	const intensity = aPlus * aPlus + aCross * aCross;
	const amplitude = (4 * G * r.deltaInertia * r.omega ** 2) / (c ** 4 * distance);
	const flux =
		(c ** 3 / (16 * Math.PI * G)) * (2 * r.omega) ** 2 * amplitude ** 2 * (intensity / 2);
	return {
		distance,
		direction: [-n[0], -n[1], -n[2]],
		cosIota,
		amplitude,
		flux,
		circular: (2 * aPlus * aCross) / intensity,
		linear: (aPlus * aPlus - aCross * aCross) / intensity
	};
}

/** Bytes per wave source; must match `WaveSource` in wgsl/waves.wgsl. */
export const WAVE_STRIDE = 48;
export const MAX_WAVE_SOURCES = 16;

export interface PackedWaves {
	buffer: ArrayBuffer;
	count: number;
}

export interface WaveCamera {
	/** Speed of light (and of gravity) in this view, m/s. */
	c: number;
	/** Width of the camera's array, m. */
	aperture: number;
}

/**
 * Full width at half maximum of a point's image through a round aperture of
 * width D at wavelength λ: 1.029 λ / D radians (the Airy pattern).
 */
export const spotWidth = (lambda: number, aperture: number) => (1.029 * lambda) / aperture;

/**
 * Pack the rotors for the GPU: direction, spot size, brightness relative to
 * the brightest spot, and the circular part of the polarization.
 */
export function packWaves(list: Rotor[], observer: Vec3, camera: WaveCamera): PackedWaves {
	const buffer = new ArrayBuffer(WAVE_STRIDE * MAX_WAVE_SOURCES);
	const f = new Float32Array(buffer);
	const rows = list.slice(0, MAX_WAVE_SOURCES).map((r) => {
		const seen = seenFrom(r, observer, camera.c);
		const sigma = spotWidth(wavelength(r, camera.c), camera.aperture) / 2.355;
		// peak brightness of a spot carrying the flux: flux / (2π σ²)
		return { seen, sigma, peak: seen.flux / (2 * Math.PI * sigma * sigma), axis: r.axis };
	});
	const brightest = Math.max(1e-300, ...rows.map((r) => r.peak));
	rows.forEach((r, i) => {
		const k = (i * WAVE_STRIDE) / 4;
		f.set([...r.seen.direction, r.sigma], k);
		f.set([...r.axis, r.peak / brightest], k + 4);
		f.set([r.seen.circular, r.seen.linear, 0, 0], k + 8);
	});
	return { buffer, count: rows.length };
}
