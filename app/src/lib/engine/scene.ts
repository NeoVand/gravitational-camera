/**
 * Turns a scene description into numbers: first the physics of each object in
 * double precision, then the single-precision records the shaders read.
 */
import { temperatureColor } from './physics/color';
import {
	absorptionCoefficient,
	energyEmissivity,
	energyEmissivityFromLuminosity,
	numberEmissivity
} from './physics/emission';
import type { AnalyzedObject, Scene, Vec3 } from './types';

const sphereVolume = (r: number) => (4 / 3) * Math.PI * r ** 3;

/** Work out volumes and emissivities for every object. */
export function analyzeScene(scene: Scene): AnalyzedObject[] {
	const index = new Map(scene.objects.map((o, i) => [o.id, i]));
	const ownVolume = scene.objects.map((o) => sphereVolume(o.shape.radius));
	for (const o of scene.objects) {
		if (o.parent === undefined) continue;
		const p = index.get(o.parent);
		if (p === undefined) throw new Error(`Object "${o.id}" names unknown parent "${o.parent}"`);
		ownVolume[p] -= sphereVolume(o.shape.radius);
	}
	return scene.objects.map((o, i) => {
		const m = scene.materials[o.material];
		if (!m) throw new Error(`Object "${o.id}" names unknown material "${o.material}"`);
		const friction = m.friction ?? 0;
		const jE =
			m.luminosity !== undefined
				? energyEmissivityFromLuminosity(m.luminosity, ownVolume[i])
				: energyEmissivity(friction, m.temperature);
		return {
			id: o.id,
			parent: o.parent === undefined ? -1 : index.get(o.parent)!,
			center: [...o.shape.center] as Vec3,
			radius: o.shape.radius,
			density: m.density,
			temperature: m.temperature,
			ownVolume: ownVolume[i],
			alpha: absorptionCoefficient(friction),
			jE,
			jN: numberEmissivity(jE, m.temperature),
			color: temperatureColor(m.temperature),
			light: m.light
		};
	});
}

/** Path length of a ray inside a sphere; the ray starts at `origin` and never ends. */
export function sphereChord(center: Vec3, radius: number, origin: Vec3, dir: Vec3): number {
	const cx = center[0] - origin[0];
	const cy = center[1] - origin[1];
	const cz = center[2] - origin[2];
	const b = cx * dir[0] + cy * dir[1] + cz * dir[2];
	const lx = cx - b * dir[0];
	const ly = cy - b * dir[1];
	const lz = cz - b * dir[2];
	const h2 = radius * radius - (lx * lx + ly * ly + lz * lz);
	if (h2 <= 0) return 0;
	const h = Math.sqrt(h2);
	const inside = cx * cx + cy * cy + cz * cz < radius * radius;
	if (inside) return b + h;
	return b > 0 ? 2 * h : 0;
}

export interface Columns {
	/** Number radiance, gravitons s⁻¹ m⁻² sr⁻¹. */
	numberRadiance: number;
	/** Mass column, kg/m². */
	massColumn: number;
}

/**
 * Line integrals along one ray. A child replaces its parent's material, so each
 * object contributes its chord times (its value − its parent's value).
 */
export function columnsAlong(objects: AnalyzedObject[], origin: Vec3, dir: Vec3): Columns {
	let numberRadiance = 0;
	let massColumn = 0;
	for (const o of objects) {
		const chord = sphereChord(o.center, o.radius, origin, dir);
		if (chord === 0) continue;
		const p = o.parent >= 0 ? objects[o.parent] : undefined;
		numberRadiance += chord * (o.jN - (p?.jN ?? 0));
		massColumn += chord * (o.density - (p?.density ?? 0));
	}
	return { numberRadiance, massColumn };
}

/** Objects whose disc is at least this wide count as "extended" for exposure. */
const EXTENDED_ANGULAR_RADIUS = Math.PI / 180;

/**
 * A brightness scale for the scene: the largest number radiance seen when
 * looking at the centre of any extended object. Point-like sources (the Sun's
 * core from Earth) are left out so they do not set the exposure.
 */
export function referenceRadiance(objects: AnalyzedObject[], origin: Vec3): number {
	let best = 0;
	for (const o of objects) {
		const d: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
		const dist = Math.hypot(d[0], d[1], d[2]);
		if (dist === 0) continue;
		const inside = dist < o.radius;
		if (!inside && Math.asin(o.radius / dist) < EXTENDED_ANGULAR_RADIUS) continue;
		const dir: Vec3 = [d[0] / dist, d[1] / dist, d[2] / dist];
		best = Math.max(best, columnsAlong(objects, origin, dir).numberRadiance);
	}
	return best;
}

/** Bytes per primitive record; must match `Prim` in wgsl/kernels.wgsl. */
export const PRIM_STRIDE = 64;
export const MAX_PRIMS = 64;

export const FLAG_FAR = 1;
export const FLAG_SURFACE = 2;
export const FLAG_EMISSIVE = 4;
export const FLAG_GLARE = 8;

export interface PackedPrims {
	buffer: ArrayBuffer;
	count: number;
}

/**
 * Pack the scene for the GPU. Positions are taken relative to the observer in
 * double precision before rounding to float, and emissivities are divided by
 * `nRef`, so the shaders only ever see moderate, dimensionless numbers.
 *
 * @param glareAngle objects with a smaller angular radius also get a display glare
 */
export function packPrims(
	objects: AnalyzedObject[],
	origin: Vec3,
	nRef: number,
	glareAngle: number
): PackedPrims {
	if (objects.length > MAX_PRIMS) throw new Error(`Too many objects (${objects.length})`);
	const buffer = new ArrayBuffer(PRIM_STRIDE * MAX_PRIMS);
	const f = new Float32Array(buffer);
	const u = new Uint32Array(buffer);
	objects.forEach((o, i) => {
		const k = (i * PRIM_STRIDE) / 4;
		const cx = o.center[0] - origin[0];
		const cy = o.center[1] - origin[1];
		const cz = o.center[2] - origin[2];
		const d2 = cx * cx + cy * cy + cz * cz;
		const r2 = o.radius * o.radius;
		const p = o.parent >= 0 ? objects[o.parent] : undefined;
		const w = o.jN / nRef;
		const wp = (p?.jN ?? 0) / nRef;

		let flags = 0;
		if (d2 > 16 * r2) flags |= FLAG_FAR;
		if (!p) flags |= FLAG_SURFACE;
		if (o.light?.emissive) flags |= FLAG_EMISSIVE;
		if (d2 > r2 && Math.asin(o.radius / Math.sqrt(d2)) < glareAngle && w > 0) flags |= FLAG_GLARE;

		f[k + 0] = cx;
		f[k + 1] = cy;
		f[k + 2] = cz;
		f[k + 3] = o.radius;
		f[k + 4] = d2 - r2;
		u[k + 5] = 0; // shape: sphere
		u[k + 6] = flags;
		f[k + 7] = 0;
		f[k + 8] = w * o.color[0] - wp * (p?.color[0] ?? 0);
		f[k + 9] = w * o.color[1] - wp * (p?.color[1] ?? 0);
		f[k + 10] = w * o.color[2] - wp * (p?.color[2] ?? 0);
		f[k + 11] = w - wp;
		const lc = o.light?.color ?? [0.1, 0.1, 0.1];
		f[k + 12] = lc[0];
		f[k + 13] = lc[1];
		f[k + 14] = lc[2];
		f[k + 15] = o.light?.emissive ?? 0;
	});
	return { buffer, count: objects.length };
}
