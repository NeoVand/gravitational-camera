/** The shared scene format (see /scenes/README.md). All quantities are SI. */

export type Vec3 = [number, number, number];

export interface LightMaterial {
	/** Linear RGB reflectance (or emitted colour when emissive). */
	color: Vec3;
	/** 1 if the surface shines by its own light. */
	emissive?: number;
	/** How the surface looks: plain, a mirror, a lit picture, or a printed page. */
	finish?: 'matte' | 'mirror' | 'screen' | 'print';
}

export interface Material {
	/** kg/m³ */
	density: number;
	/** K */
	temperature: number;
	/** Effective shear viscosity at thermal frequencies, Pa·s. */
	friction?: number;
	/** Total graviton power of the object, W. Overrides friction for emission. */
	luminosity?: number;
	light?: LightMaterial;
}

export interface SphereShape {
	type: 'sphere';
	center: Vec3;
	radius: number;
}

export interface BoxShape {
	type: 'box';
	center: Vec3;
	/** Full extent along x, y and z; the box is aligned with the axes. */
	size: Vec3;
}

export type Shape = SphereShape | BoxShape;

/**
 * Steady rotation of a sphere about an axis through `center`. `rate` is in
 * revolutions per second, positive anticlockwise seen from the tip of `axis`.
 */
export interface Spin {
	center: Vec3;
	axis: Vec3;
	rate: number;
}

export interface SceneObject {
	id: string;
	parent?: string;
	shape: Shape;
	material: string;
	/** Only spheres may spin, in the plane through the spin centre across the axis. */
	spin?: Spin;
	/**
	 * Part of the empty room (floor, walls, furniture fixed in place). Its pull
	 * and glow are known in advance, so a view can subtract them.
	 */
	background?: boolean;
}

export interface Scene {
	name: string;
	title: string;
	description?: string;
	frame?: string;
	/** `exclusion`: radius around the observer ignored by the near-field image, metres. */
	observer: { position: Vec3; exclusion?: number };
	/** Affects only the ordinary-light view. */
	environment?: 'night-sky' | 'room';
	materials: Record<string, Material>;
	objects: SceneObject[];
	assumptions?: string[];
}

/** A scene object with its physics worked out in double precision. */
export interface AnalyzedObject {
	id: string;
	/** Index of the parent in the analyzed list, or -1. */
	parent: number;
	center: Vec3;
	/** Sphere radius; for a box, the radius of the sphere that encloses it. */
	radius: number;
	/** Half extents of a box; undefined for a sphere. */
	half?: Vec3;
	density: number;
	temperature: number;
	/** Volume of the shape minus its children, m³. */
	ownVolume: number;
	/** Absorption coefficient, 1/m. */
	alpha: number;
	/** Energy emissivity, W m⁻³ sr⁻¹. */
	jE: number;
	/** Number emissivity, gravitons s⁻¹ m⁻³ sr⁻¹. */
	jN: number;
	/** Display colour for this temperature, linear RGB with peak 1. */
	color: Vec3;
	light?: LightMaterial;
	/** Part of the empty room; see `SceneObject.background`. */
	background: boolean;
	/** Steady rotation, for the wave view. */
	spin?: Spin;
}
