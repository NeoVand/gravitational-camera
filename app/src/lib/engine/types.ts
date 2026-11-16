/** The shared scene format (see /scenes/README.md). All quantities are SI. */

export type Vec3 = [number, number, number];

export interface LightMaterial {
	/** Linear RGB reflectance (or emitted colour when emissive). */
	color: Vec3;
	/** 1 if the surface shines by its own light. */
	emissive?: number;
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

export type Shape = SphereShape;

export interface SceneObject {
	id: string;
	parent?: string;
	shape: Shape;
	material: string;
}

export interface Scene {
	name: string;
	title: string;
	description?: string;
	frame?: string;
	observer: { position: Vec3 };
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
	radius: number;
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
}
