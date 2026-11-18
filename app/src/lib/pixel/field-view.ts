/**
 * The rules of the "Tidal field" view, the same in every demo: the tidal tensor at the points of a sphere about the
 * camera, drawn as engine/wgsl/field.wgsl draws it. At each pixel the tensor at its own point gives a wash: its
 * colour is the direction of the stretch (the axis of the most negative principal value of the part without the
 * trace), its strength the size of that part, sqrt(sum of squares / 2), on a logarithmic scale against the median
 * over the picture. Over the wash, one fine stroke to a cell lies along the stretch as it crosses the picture.
 *
 * How it looks can be set: a `FieldLook`. `DEFAULT_LOOK` is the picture as it was first drawn, but for a hairline
 * of shade about each stroke. The demos whose pictures the engine does not draw (the Galaxy, a black hole) use these
 * functions with ui/FieldOverlay.svelte; field-view.spec.ts holds them to the shader's arithmetic.
 */
import type { Vec3 } from '../engine/types';
import { principal, type Mat3 } from './tide';

/** What the wash is coloured by. */
export type ColourBy = 'direction' | 'strength' | 'sign';

/** How the view looks: each number is 1, or the value given, in the picture as first drawn. */
export interface FieldLook {
	/** How strongly the wash's colour answers: 1 is 0.72 of the way from grey to the hue. */
	contrast: number;
	/** Decades added to the strength before it is put on the scale: above 0 brings up the weak, below tames the strong. */
	shift: number;
	/** Direction of the stretch (red across, green up and down, blue along the view), strength, or stretch against squeeze. */
	colour: ColourBy;
	/** How far the wash covers the picture beneath where the field is at the top of the scale, 0 to 1 (first 0.5). */
	opacity: number;
	/** Whether strokes are drawn. */
	strokes: boolean;
	/** Strokes to a length of picture: 1 is one to 26 pixels. */
	density: number;
	/** A stroke's length: 1 is 0.42 of a cell each way at the top of the scale. */
	length: number;
	/** A stroke's weight: 1 is 1.6 pixels. */
	weight: number;
	/** The darkness of the hairline about a stroke, 0 to 1. */
	edge: number;
}

/** The picture as first drawn, with nothing about the strokes. */
export const ORIGINAL_LOOK: FieldLook = {
	contrast: 1,
	shift: 0,
	colour: 'direction',
	opacity: 0.5,
	strokes: true,
	density: 1,
	length: 1,
	weight: 1,
	edge: 0
};

/**
 * The look the view starts with, and "Reset look" returns to: the first picture with a little more colour in the
 * wash and a hairline of shade about each stroke, so that both read at a glance. Nothing the first picture showed
 * is lost; a contrast of 1 brings back its wash.
 */
export const DEFAULT_LOOK: FieldLook = { ...ORIGINAL_LOOK, contrast: 1.2, edge: 0.5 };

const COLOUR_BY: ColourBy[] = ['direction', 'strength', 'sign'];

/** A cell's side in pixels (0 for no strokes), a stroke's half length in cells and its half weight in pixels. */
export const strokeUniforms = (look: FieldLook): [number, number, number] => [
	look.strokes ? FIELD_CELL / look.density : 0,
	Math.min(0.5, 0.42 * look.length),
	0.8 * look.weight
];

/** The look as the shader takes it: frame.look and frame.strokes of engine/wgsl/kernels.wgsl. */
export const lookUniforms = (
	look: FieldLook
): { look: [number, number, number, number]; strokes: [number, number, number] } => ({
	look: [look.contrast, look.shift, COLOUR_BY.indexOf(look.colour), look.edge],
	strokes: strokeUniforms(look)
});

/** One stroke of the lattice per cell of this many pixels, as FIELD_CELL in field.wgsl. */
export const FIELD_CELL = 26;

/** The picture's axes and the tangents of half its field of view, across and up. */
export interface FieldCamera {
	right: Vec3;
	up: Vec3;
	forward: Vec3;
	tanX: number;
	tanY: number;
}

/** The unit vector seen at (sx, sy), each from -1 to 1 across the picture, sy upward. */
export function rayThrough(camera: FieldCamera, sx: number, sy: number): Vec3 {
	const { right, up, forward, tanX, tanY } = camera;
	const d = [0, 1, 2].map((k) => forward[k] + sx * tanX * right[k] + sy * tanY * up[k]);
	const n = Math.hypot(d[0], d[1], d[2]);
	return [d[0] / n, d[1] / n, d[2] / n];
}

/** The directions within an angle of a unit vector `axis`: those whose cosine with it is at least `cos`. */
export interface Cone {
	axis: Vec3;
	cos: number;
}

/**
 * A cone of directions as it falls on a picture `width` by `height` pixels (the camera's axes at right angles, its
 * pixels square), for a region that has to be cut out of the view along its own edge and not along the lattice the
 * wash is worked out on. Points are in pixels from the picture's top left corner, a pixel's centre at its half.
 */
export function coneOnPicture(
	cone: Cone,
	camera: FieldCamera,
	width: number,
	height: number
): {
	/** The share of the pixel centred at (px, py) that lies within the cone, 0 to 1: its edge is one pixel wide. */
	cover: (px: number, py: number) => number;
	/** Whether (px, py) may lie within `pixels` of the cone: never false for a point that does. */
	near: (px: number, py: number, pixels: number) => boolean;
} {
	const { right, up, forward, tanX, tanY } = camera;
	const dot = (a: Vec3) => a[0] * cone.axis[0] + a[1] * cone.axis[1] + a[2] * cone.axis[2];
	const f = dot(forward);
	const r = dot(right);
	const u = dot(up);
	// what one pixel is on the plane a unit length before the camera; no pixel spans a greater angle than this
	const stepX = (2 * tanX) / width;
	const stepY = (2 * tanY) / height;
	const step = Math.max(stepX, stepY);
	const angle = Math.acos(Math.max(-1, Math.min(1, cone.cos)));
	return {
		cover: (px, py) => {
			// the ray through the point is forward + x right + y up; its cosine with the axis is along / n
			const x = px * stepX - tanX;
			const y = tanY - py * stepY;
			const n2 = 1 + x * x + y * y;
			const n = Math.sqrt(n2);
			const along = f + x * r + y * u;
			// the distance to the edge in pixels, to first order: the cosine's excess over its slope across the picture
			const sx = ((r - (along * x) / n2) / n) * stepX;
			const sy = ((u - (along * y) / n2) / n) * stepY;
			return clamp01(0.5 + (along / n - cone.cos) / Math.max(Math.sqrt(sx * sx + sy * sy), 1e-300));
		},
		near: (px, py, pixels) => {
			const x = px * stepX - tanX;
			const y = tanY - py * stepY;
			const c = (f + x * r + y * u) / Math.sqrt(1 + x * x + y * y);
			return Math.acos(Math.max(-1, Math.min(1, c))) - angle <= pixels * step;
		}
	};
}

/** A tensor without its trace. */
export function traceless(E: Mat3): Mat3 {
	const t = (E[0][0] + E[1][1] + E[2][2]) / 3;
	return E.map((row, i) => row.map((v, j) => (i === j ? v - t : v)));
}

/** The strength the view draws: the size of the traceless part, sqrt(sum of squares / 2), s^-2. */
export function fieldSize(E: Mat3): number {
	const m = traceless(E);
	return Math.sqrt(0.5 * m.reduce((s, row) => s + row.reduce((t, v) => t + v * v, 0), 0));
}

/** The axis along which free particles are pulled apart: that of the most negative principal value. */
export function stretchAxis(E: Mat3): Vec3 {
	return principal(traceless(E))[0].axis;
}

const smoothstep = (a: number, b: number, x: number) => {
	const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

/** Strength on the view's scale, 0 to 1: two decades under the reference to 0.6 over it, moved by `shift` decades. */
export const fieldLevel = (size: number, reference: number, shift = 0): number =>
	smoothstep(-2, 0.6, Math.log10(Math.max(size, 1e-300) / reference) + shift);

/** The strengths at the two ends of the scale, s^-2: nothing shows below `none`, everything is full at `full`. */
export const scaleEnds = (reference: number, shift = 0) => ({
	none: reference * 10 ** (-2 - shift),
	full: reference * 10 ** (0.6 - shift)
});

/**
 * The typical strength over the picture: the median over a 7 x 5 grid of directions (as engine/tidal.ts
 * sliceReference). `tensorAt` gives the tensor at the point seen along a direction, or nothing where there is none.
 */
export function fieldReference(
	tensorAt: (direction: Vec3) => Mat3 | undefined,
	camera: FieldCamera
): number {
	const sizes: number[] = [];
	for (let j = 0; j < 5; j++)
		for (let i = 0; i < 7; i++) {
			const E = tensorAt(rayThrough(camera, (i / 6) * 2 - 1, (j / 4) * 2 - 1));
			if (E) sizes.push(fieldSize(E));
		}
	sizes.sort((a, b) => a - b);
	return Math.max(sizes[Math.floor(sizes.length / 2)] ?? 0, 1e-300);
}

/** A colour in linear light, each part 0 to 1. */
export type Rgb = [number, number, number];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const mix3 = (a: Rgb, b: Rgb, t: number): Rgb => [
	a[0] + (b[0] - a[0]) * t,
	a[1] + (b[1] - a[1]) * t,
	a[2] + (b[2] - a[2]) * t
];

/** The paper's orange for a stretch and blue for a squeeze, in linear light. */
export const STRETCH: Rgb = [0.812, 0.379, 0.101];
export const SQUEEZE: Rgb = [0.2157, 0.465, 1.0];
/** The paper's pale, #f7f3ec, for zero between them, where a picture has one (the map of two black holes). */
export const PALE: Rgb = [0.9324, 0.8992, 0.8433];

/** Colour by strength: from a deep violet through red to a pale yellow. */
export function strengthRamp(level: number): Rgb {
	const low: Rgb = [0.0103, 0.0037, 0.0529];
	const mid: Rgb = [0.497, 0.0382, 0.089];
	const high: Rgb = [0.973, 1.0, 0.371];
	return mix3(mix3(low, mid, clamp01(2 * level)), high, clamp01(2 * level - 1));
}

/**
 * Colour by stretch against squeeze: by which of the least principal value (a stretch where negative) and the
 * greatest is the larger in size, the trace counted, so that inside matter, where everything is squeezed, it is
 * blue. A point mass's field outside it, (-2, 1, 1), is full orange.
 */
export function signHue(E: Mat3): Rgb {
	const values = principal(E).map((p) => p.value);
	const low = values[0];
	const high = values[2];
	const balance =
		(Math.abs(low) - Math.abs(high)) / Math.max(Math.abs(low) + Math.abs(high), 1e-300);
	const pulled = low < 0 ? balance : -1;
	return mix3(SQUEEZE, STRETCH, clamp01(0.5 + 1.5 * pulled));
}

export interface FieldMark {
	/** Strength, 0 to 1. */
	level: number;
	/** The tone of the wash in linear light, 0 to 1 each. */
	tone: Rgb;
	/** How far the wash covers what is beneath it, 0 to 1. */
	cover: number;
	/** The stretch axis across the picture, as (right, down) parts of a unit vector; and how much of it lies across. */
	across: [number, number];
	inPlane: number;
}

/** What the view draws at one point: the wash's tone and cover, and the stroke's direction and length (field_view). */
export function fieldMark(
	E: Mat3,
	camera: FieldCamera,
	reference: number,
	look: FieldLook = DEFAULT_LOOK
): FieldMark {
	const level = fieldLevel(fieldSize(E), reference, look.shift);
	const axis = stretchAxis(E);
	const dot = (a: Vec3) => axis[0] * a[0] + axis[1] * a[1] + axis[2] * a[2];
	return markOf(level, [dot(camera.right), dot(camera.up), dot(camera.forward)], look, () =>
		signHue(E)
	);
}

/**
 * The same from what it rests on, for a picture that finds them its own way: the strength on the scale, 0 to 1; the
 * stretch axis in the picture's axes (right, up, along the view), a unit vector; and, for colour by sign, the hue.
 */
export function markOf(level: number, screen: Vec3, look: FieldLook, sign: () => Rgb): FieldMark {
	// written out part by part, without arrays to spare: a picture may ask for it at every point, every frame
	const [s0, s1, s2] = screen;
	let h0: number, h1: number, h2: number;
	if (look.colour === 'strength') [h0, h1, h2] = strengthRamp(level);
	else if (look.colour === 'sign') [h0, h1, h2] = sign();
	else {
		// red across, green up and down, blue along the line of sight, the strongest part full
		const top = Math.max(Math.abs(s0), Math.abs(s1), Math.abs(s2), 1e-6);
		h0 = Math.abs(s0) / top;
		h1 = Math.abs(s1) / top;
		h2 = Math.abs(s2) / top;
	}
	// muted, so the picture underneath still reads
	const saturation = clamp01(0.72 * look.contrast);
	const shade = 1 + (level - 1) * clamp01(0.6 * look.contrast);
	const tone: Rgb = [
		(0.62 + (h0 - 0.62) * saturation) * shade,
		(0.62 + (h1 - 0.62) * saturation) * shade,
		(0.62 + (h2 - 0.62) * saturation) * shade
	];
	const inPlane = Math.hypot(s0, s1);
	return {
		level,
		tone,
		cover: look.opacity * level,
		across: inPlane > 0 ? [s0 / inPlane, -s1 / inPlane] : [1, 0],
		inPlane
	};
}

/** The wash over a colour beneath it, in linear light, as the shader mixes them. */
export const washOver = (beneath: Rgb, mark: FieldMark): Rgb =>
	mix3([beneath[0] * 0.85, beneath[1] * 0.85, beneath[2] * 0.85], mark.tone, mark.cover);

/** Half the length of a cell's stroke, pixels; under one pixel it is not drawn. */
export function strokeHalf(mark: FieldMark, look: FieldLook = DEFAULT_LOOK): number {
	const [cell, half] = strokeUniforms(look);
	return half * cell * mark.level * mark.inPlane;
}

/** A linear value as the screen shows it, 0 to 1 (to_display in the shader). */
export const toDisplay = (c: number): number => clamp01(c) ** (1 / 2.2);
