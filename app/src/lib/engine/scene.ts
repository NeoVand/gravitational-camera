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
			light: m.light,
			background: o.background === true,
			spin: o.spin,
			velocity: o.velocity,
			cutaway: o.cutaway === true
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
 *
 * With `subtractRoom`, objects marked as background are left out. Pull and
 * glow both add linearly, so this is exactly the image with the empty room's
 * contribution removed; a child of a background object still counts its
 * difference from that object.
 */
export function columnsAlong(
	objects: AnalyzedObject[],
	origin: Vec3,
	dir: Vec3,
	exclusion = DEFAULT_EXCLUSION,
	subtractRoom = false
): Columns {
	let numberRadiance = 0;
	let massColumn = 0;
	let tidalColumn = 0;
	for (const o of objects) {
		if (subtractRoom && o.background) continue;
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

function towardCentres(objects: AnalyzedObject[], origin: Vec3, subtractRoom = false): Vec3[] {
	const dirs: Vec3[] = [];
	for (const o of objects) {
		if (subtractRoom && o.background) continue;
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
export function referenceRadiance(
	objects: AnalyzedObject[],
	origin: Vec3,
	subtractRoom = false
): number {
	return Math.max(
		0,
		...towardCentres(objects, origin, subtractRoom).map(
			(d) => columnsAlong(objects, origin, d, DEFAULT_EXCLUSION, subtractRoom).numberRadiance
		)
	);
}

/** The same for the near-field view: the largest tidal column toward an object's centre. */
export function referenceTidal(
	objects: AnalyzedObject[],
	origin: Vec3,
	exclusion = DEFAULT_EXCLUSION,
	subtractRoom = false
): number {
	return Math.max(
		1e-300,
		...towardCentres(objects, origin, subtractRoom).map(
			(d) => columnsAlong(objects, origin, d, exclusion, subtractRoom).tidalColumn
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
export const FLAG_MIRROR = 16;
export const FLAG_SCREEN = 32;
export const FLAG_PRINT = 64;
/** Surface patterns of the light view, by name; must match TEX_* in wgsl/light.wgsl. */
const TEXTURES: Record<string, number> = { wood: 1, metal: 2, plaster: 3, concrete: 4, fabric: 5 };
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
	/** Leave background objects out of the gravity views (they still show in light). */
	subtractRoom?: boolean;
	/** Cut away the objects marked `cutaway` in the light view, showing what they hold. */
	cutaway?: boolean;
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
	const { nRef, sRef, glareAngle, subtractRoom = false, cutaway = false } = scales;
	/** Whether the light view draws an object: a root, or, cut away, the first not cut away. */
	const surface = (o: AnalyzedObject): boolean => {
		if (o.light?.hidden) return false;
		if (!cutaway) return o.parent < 0;
		if (o.cutaway) return false;
		for (let a = o.parent; a >= 0; a = objects[a].parent) if (!objects[a].cutaway) return false;
		return true;
	};
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
		// a subtracted object keeps its shape for the light view but no longer
		// pulls or glows; a child of it still counts its difference from it
		const gone = subtractRoom && o.background;
		const w = gone ? 0 : o.jN / nRef;
		const wp = gone ? 0 : (p?.jN ?? 0) / nRef;

		let flags = 0;
		if (d2 > 16 * r2) flags |= FLAG_FAR;
		if (surface(o)) flags |= FLAG_SURFACE;
		if (o.light?.emissive) flags |= FLAG_EMISSIVE;
		if (o.light?.finish === 'mirror') flags |= FLAG_MIRROR;
		if (o.light?.finish === 'screen') flags |= FLAG_SCREEN;
		if (o.light?.finish === 'print') flags |= FLAG_PRINT;
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
		f[k + 7] = TEXTURES[o.light?.texture ?? ''] ?? 0;
		f.set(o.half ?? [0, 0, 0], k + 8);
		f[k + 12] = w * o.color[0] - wp * (p?.color[0] ?? 0);
		f[k + 13] = w * o.color[1] - wp * (p?.color[1] ?? 0);
		f[k + 14] = w * o.color[2] - wp * (p?.color[2] ?? 0);
		f[k + 15] = w - wp;
		f[k + 16] = gone ? 0 : (o.density - (p?.density ?? 0)) / sRef;
		const lc = o.light?.color ?? [0.1, 0.1, 0.1];
		f[k + 20] = lc[0];
		f[k + 21] = lc[1];
		f[k + 22] = lc[2];
		f[k + 23] = o.light?.emissive ?? 0;
	});
	return { buffer, count: objects.length };
}

/**
 * The chord through a ball of radius R, integrated over the solid angle it fills as seen from a distance D > R
 * of its centre: the integral of dV / r² over the ball, 2πR − π (D² − R²)/D · ln((D + R)/(D − R)). For a small
 * ball that is a difference of nearly equal numbers, so its series is summed instead; the first term is V / D².
 */
export function ballOverSky(R: number, D: number): number {
	const x = R / D;
	if (x >= 0.1) {
		return 2 * Math.PI * R - ((Math.PI * (D * D - R * R)) / D) * Math.log((D + R) / (D - R));
	}
	let sum = 0;
	for (let k = 0, p = 1; k < 12; k++, p *= x * x) sum += p / ((2 * k + 1) * (2 * k + 3));
	return 4 * Math.PI * R * x * x * sum;
}

/**
 * Gravitons per second that everything in a view sends to a detector of one
 * square metre facing it: the number radiance integrated over the picture's
 * solid angle.
 *
 * Most of it is added up on a grid of directions. A grid misses what is small:
 * the Sun's core from the Earth is a twentieth of a cell across. So a ball seen
 * from outside whose disc lies wholly in the view is added exactly instead,
 * and a body too small for the grid that crosses the edge of the view (or is
 * a box) counts whole, as a point, when its centre is in view. Neither is then
 * sampled, so nothing is counted twice.
 */
export function gravitonsInView(
	objects: AnalyzedObject[],
	origin: Vec3,
	basis: { right: Vec3; up: Vec3; forward: Vec3 },
	tanHalfWidth: number,
	tanHalfHeight: number,
	subtractRoom = false
): number {
	const nx = 64;
	const ny = 40;
	const dx = (2 * tanHalfWidth) / nx;
	const dy = (2 * tanHalfHeight) / ny;
	const { right, up, forward } = basis;
	const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	// inward unit normals of the four planes that bound the view
	const sides = [
		[tanHalfWidth, -1, 0],
		[tanHalfWidth, 1, 0],
		[tanHalfHeight, 0, -1],
		[tanHalfHeight, 0, 1]
	].map(([f, r, u]) => {
		const n = Math.hypot(f, r, u);
		return [0, 1, 2].map((k) => (f * forward[k] + r * right[k] + u * up[k]) / n) as Vec3;
	});

	let total = 0;
	/** What is left to the grid: each object with its emissivity over its parent's. */
	const sampled: [AnalyzedObject, number][] = [];
	for (const o of objects) {
		if (subtractRoom && o.background) continue;
		const weight = o.jN - (o.parent >= 0 ? objects[o.parent].jN : 0);
		if (weight === 0) continue;
		const c: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
		const dist = Math.hypot(c[0], c[1], c[2]);
		if (dist > o.radius) {
			// sines of its angular radius, and of the angle from its centre to the nearest edge (positive inside)
			const sine = o.radius / dist;
			const margin = Math.min(...sides.map((n) => dot(n, c))) / dist;
			if (margin <= -sine) continue; // wholly out of view
			if (!o.half && margin >= sine) {
				total += weight * ballOverSky(o.radius, dist);
				continue;
			}
			const ahead = dot(c, forward);
			if (ahead > 0) {
				const x = dot(c, right) / ahead;
				const y = dot(c, up) / ahead;
				// how far across the grid's plane it reaches, at most
				const across = 2 * Math.asin(sine) * (1 + x * x + y * y);
				if (across < Math.min(dx, dy)) {
					if (margin < 0) continue;
					if (!o.half) total += weight * ballOverSky(o.radius, dist);
					else {
						// a small box: V / D², and the next term of dV / r² about its centre
						const h = o.half;
						const along = (c[0] * h[0]) ** 2 + (c[1] * h[1]) ** 2 + (c[2] * h[2]) ** 2;
						const next = ((4 * along) / (dist * dist) - dot(h, h)) / (3 * dist * dist);
						total += ((weight * 8 * h[0] * h[1] * h[2]) / (dist * dist)) * (1 + next);
					}
					continue;
				}
			}
		}
		sampled.push([o, weight]);
	}

	for (let j = 0; j < ny; j++)
		for (let i = 0; i < nx; i++) {
			const x = -tanHalfWidth + (i + 0.5) * dx;
			const y = -tanHalfHeight + (j + 0.5) * dy;
			const d: Vec3 = [0, 1, 2].map((k) => forward[k] + x * right[k] + y * up[k]) as Vec3;
			const n = Math.hypot(...d);
			const dir: Vec3 = [d[0] / n, d[1] / n, d[2] / n];
			// solid angle of a cell of the tangent plane: dx dy / (1 + x² + y²)^(3/2)
			const solid = (dx * dy) / (1 + x * x + y * y) ** 1.5;
			let radiance = 0;
			for (const [o, weight] of sampled) radiance += chordThrough(o, origin, dir) * weight;
			total += radiance * solid;
		}
	return total;
}
