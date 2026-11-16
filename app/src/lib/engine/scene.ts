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
import type { AnalyzedObject, Scene, Shape, Vec3 } from './types';

const shapeVolume = (s: Shape) =>
	s.type === 'sphere' ? (4 / 3) * Math.PI * s.radius ** 3 : s.size[0] * s.size[1] * s.size[2];

/** Work out volumes and emissivities for every object. */
export function analyzeScene(scene: Scene): AnalyzedObject[] {
	const index = new Map(scene.objects.map((o, i) => [o.id, i]));
	const ownVolume = scene.objects.map((o) => shapeVolume(o.shape));
	for (const o of scene.objects) {
		if (o.parent === undefined) continue;
		const p = index.get(o.parent);
		if (p === undefined) throw new Error(`Object "${o.id}" names unknown parent "${o.parent}"`);
		ownVolume[p] -= shapeVolume(o.shape);
	}
	return scene.objects.map((o, i) => {
		const m = scene.materials[o.material];
		if (!m) throw new Error(`Object "${o.id}" names unknown material "${o.material}"`);
		const friction = m.friction ?? 0;
		const jE =
			m.luminosity !== undefined
				? energyEmissivityFromLuminosity(m.luminosity, ownVolume[i])
				: energyEmissivity(friction, m.temperature);
		const half: Vec3 | undefined =
			o.shape.type === 'box'
				? [o.shape.size[0] / 2, o.shape.size[1] / 2, o.shape.size[2] / 2]
				: undefined;
		return {
			id: o.id,
			parent: o.parent === undefined ? -1 : index.get(o.parent)!,
			center: [...o.shape.center] as Vec3,
			radius: o.shape.type === 'sphere' ? o.shape.radius : Math.hypot(...half!),
			half,
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

/**
 * Where a ray enters and leaves an object, as distances from its origin
 * (entry is 0 if the origin is inside). Undefined if the ray misses.
 */
export function crossing(o: AnalyzedObject, origin: Vec3, dir: Vec3): [number, number] | undefined {
	const c: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
	if (o.half) {
		let near = -Infinity;
		let far = Infinity;
		for (let k = 0; k < 3; k++) {
			if (dir[k] === 0) {
				if (Math.abs(c[k]) >= o.half[k]) return undefined;
				continue;
			}
			const a = (c[k] - o.half[k]) / dir[k];
			const b = (c[k] + o.half[k]) / dir[k];
			near = Math.max(near, Math.min(a, b));
			far = Math.min(far, Math.max(a, b));
		}
		return far > Math.max(near, 0) ? [Math.max(near, 0), far] : undefined;
	}
	const b = c[0] * dir[0] + c[1] * dir[1] + c[2] * dir[2];
	const lx = c[0] - b * dir[0];
	const ly = c[1] - b * dir[1];
	const lz = c[2] - b * dir[2];
	const h2 = o.radius * o.radius - (lx * lx + ly * ly + lz * lz);
	if (h2 <= 0) return undefined;
	const h = Math.sqrt(h2);
	const inside = c[0] * c[0] + c[1] * c[1] + c[2] * c[2] < o.radius * o.radius;
	if (inside) return [0, b + h];
	return b > 0 ? [b - h, b + h] : undefined;
}

/** Path length of a ray inside an object's full shape. */
export function chordThrough(o: AnalyzedObject, origin: Vec3, dir: Vec3): number {
	const hit = crossing(o, origin, dir);
	return hit ? hit[1] - hit[0] : 0;
}

export interface Columns {
	/** Number radiance, gravitons s⁻¹ m⁻² sr⁻¹. */
	numberRadiance: number;
	/** Mass column, kg/m². */
	massColumn: number;
	/** Tidal column: mass along the ray weighted by 1/distance, kg/m³. */
	tidalColumn: number;
}

export const DEFAULT_EXCLUSION = 0.25;

/**
 * Line integrals along one ray. A child replaces its parent's material, so each
 * object contributes its own path times (its value − its parent's value).
 */
export function columnsAlong(
	objects: AnalyzedObject[],
	origin: Vec3,
	dir: Vec3,
	exclusion = DEFAULT_EXCLUSION
): Columns {
	let numberRadiance = 0;
	let massColumn = 0;
	let tidalColumn = 0;
	for (const o of objects) {
		const hit = crossing(o, origin, dir);
		if (!hit) continue;
		const p = o.parent >= 0 ? objects[o.parent] : undefined;
		const chord = hit[1] - hit[0];
		numberRadiance += chord * (o.jN - (p?.jN ?? 0));
		massColumn += chord * (o.density - (p?.density ?? 0));
		if (hit[1] > exclusion) {
			tidalColumn +=
				(o.density - (p?.density ?? 0)) * Math.log(hit[1] / Math.max(hit[0], exclusion));
		}
	}
	return { numberRadiance, massColumn, tidalColumn };
}

/** Objects whose disc is at least this wide count as "extended" for exposure. */
const EXTENDED_ANGULAR_RADIUS = Math.PI / 180;

function towardCentres(objects: AnalyzedObject[], origin: Vec3): Vec3[] {
	const dirs: Vec3[] = [];
	for (const o of objects) {
		const d: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
		const dist = Math.hypot(d[0], d[1], d[2]);
		if (dist === 0) continue;
		if (dist > o.radius && Math.asin(o.radius / dist) < EXTENDED_ANGULAR_RADIUS) continue;
		dirs.push([d[0] / dist, d[1] / dist, d[2] / dist]);
	}
	return dirs;
}

/**
 * A brightness scale for the thermal view: the largest number radiance seen
 * when looking at the centre of any extended object. Point-like sources (the
 * Sun's core from Earth) are left out so they do not set the exposure.
 */
export function referenceRadiance(objects: AnalyzedObject[], origin: Vec3): number {
	return Math.max(
		0,
		...towardCentres(objects, origin).map((d) => columnsAlong(objects, origin, d).numberRadiance)
	);
}

/** The same for the near-field view: the largest tidal column toward an object's centre. */
export function referenceTidal(
	objects: AnalyzedObject[],
	origin: Vec3,
	exclusion = DEFAULT_EXCLUSION
): number {
	return Math.max(
		1e-300,
		...towardCentres(objects, origin).map(
			(d) => columnsAlong(objects, origin, d, exclusion).tidalColumn
		)
	);
}

/** Bytes per primitive record; must match `Prim` in wgsl/kernels.wgsl. */
export const PRIM_STRIDE = 96;
export const MAX_PRIMS = 64;

export const FLAG_FAR = 1;
export const FLAG_SURFACE = 2;
export const FLAG_EMISSIVE = 4;
export const FLAG_GLARE = 8;
export const SHAPE_SPHERE = 0;
export const SHAPE_BOX = 1;

export interface PackedPrims {
	buffer: ArrayBuffer;
	count: number;
}

export interface PackScales {
	/** Reference number radiance for the thermal view. */
	nRef: number;
	/** Reference tidal column for the near-field view. */
	sRef: number;
	/** Objects with a smaller angular radius also get a display glare. */
	glareAngle: number;
}

/**
 * Pack the scene for the GPU. Positions are taken relative to the observer in
 * double precision before rounding to float, and physical quantities are
 * divided by reference values, so the shaders only ever see moderate,
 * dimensionless numbers.
 */
export function packPrims(
	objects: AnalyzedObject[],
	origin: Vec3,
	scales: PackScales
): PackedPrims {
	if (objects.length > MAX_PRIMS) throw new Error(`Too many objects (${objects.length})`);
	const { nRef, sRef, glareAngle } = scales;
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
		if (!o.half && d2 > r2 && Math.asin(o.radius / Math.sqrt(d2)) < glareAngle && w > 0) {
			flags |= FLAG_GLARE;
		}

		f[k + 0] = cx;
		f[k + 1] = cy;
		f[k + 2] = cz;
		f[k + 3] = o.radius;
		f[k + 4] = d2 - r2;
		u[k + 5] = o.half ? SHAPE_BOX : SHAPE_SPHERE;
		u[k + 6] = flags;
		f[k + 7] = 0;
		f.set(o.half ?? [0, 0, 0], k + 8);
		f[k + 12] = w * o.color[0] - wp * (p?.color[0] ?? 0);
		f[k + 13] = w * o.color[1] - wp * (p?.color[1] ?? 0);
		f[k + 14] = w * o.color[2] - wp * (p?.color[2] ?? 0);
		f[k + 15] = w - wp;
		f[k + 16] = (o.density - (p?.density ?? 0)) / sRef;
		const lc = o.light?.color ?? [0.1, 0.1, 0.1];
		f[k + 20] = lc[0];
		f[k + 21] = lc[1];
		f[k + 22] = lc[2];
		f[k + 23] = o.light?.emissive ?? 0;
	});
	return { buffer, count: objects.length };
}
