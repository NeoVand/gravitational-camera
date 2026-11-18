/**
 * What a camera that counts gravitons records of a thermal scene (paper, Section "A first image"): over an exposure
 * of collecting area A for a time tau, each picture element of the view receives a Poisson number of gravitons whose
 * mean is A tau times the integral of the number radiance N over the element's solid angle. The thermal image is
 * sharp (its wavelengths are microns), so the elements are a choice of binning, not a limit of the optics.
 *
 * `countRates` cuts the view's tangent plane into square elements and samples each on a grid of rays with the same
 * line integrals as the engine (engine/scene.ts), weighted by their solid angles as the reference's
 * camera.pixel_solid_angles; a ball too small for the samples (the Sun's core, the Moon) is counted whole in the
 * element that holds its centre. reference/gravcam/export_fixtures.py does the same with the reference's own code,
 * and counts.spec.ts holds the two together. `poisson` draws the counts.
 */
import { uniform } from '../array/random';
import { ballOverSky, crossing } from '../engine/scene';
import type { AnalyzedObject, Vec3 } from '../engine/types';

/** A Julian year, s. */
export const YEAR = 365.25 * 86400;
/** The paper's lifetime, eighty years, s. */
export const LIFETIME = 80 * YEAR;
/** The age of the universe, s. */
export const UNIVERSE = 1.38e10 * YEAR;
/**
 * Gravitons an element needs to show a difference of ten per cent at five standard deviations, as the paper counts:
 * (5 / 0.1)^2.
 */
export const ENOUGH = 2500;

export interface CountGrid {
	/** Elements across and up; row 0 at the top. */
	nx: number;
	ny: number;
	/** Expected gravitons per second per square metre of collecting area, per element. */
	rate: Float64Array;
	/** The same with only the extended sources, the small balls counted whole left out. */
	extended: Float64Array;
	/** The same, each graviton weighted by the temperature colour of what sent it (linear RGB): three per element. */
	colour: Float64Array;
	/** The balls counted whole, by id. */
	points: string[];
	/** The side of an element on the tangent plane (its solid angle at the centre of the view, its square). */
	side: number;
}

/**
 * Gravitons per second per square metre of collecting area from each element of a view: `nx` elements across, as
 * many up as make them square, each sampled on `samples` x `samples` rays. The view is the tangent plane spanned by
 * `basis`, from -tanX to tanX across and -tanY to tanY up. With `subtractRoom`, the empty room is left out.
 */
export function countRates(
	objects: AnalyzedObject[],
	origin: Vec3,
	basis: { right: Vec3; up: Vec3; forward: Vec3 },
	tanX: number,
	tanY: number,
	nx: number,
	samples = 3,
	subtractRoom = false
): CountGrid {
	const ny = Math.max(1, Math.round((nx * tanY) / tanX));
	const dx = (2 * tanX) / nx;
	const dy = (2 * tanY) / ny;
	const step = Math.min(dx, dy) / samples;
	const { right, up, forward } = basis;
	const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	const gone = (o: AnalyzedObject) => subtractRoom && o.background;
	const parentOf = (o: AnalyzedObject) => (o.parent >= 0 ? objects[o.parent] : undefined);

	// balls narrower than a sample's spacing, counted whole at their centres
	const small = new Set<number>();
	objects.forEach((o, k) => {
		if (o.half || gone(o)) return;
		const c: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
		const dist = Math.hypot(...c);
		if (dist > o.radius && o.radius / dist < step) small.add(k);
	});

	const rate = new Float64Array(nx * ny);
	const extended = new Float64Array(nx * ny);
	const colour = new Float64Array(3 * nx * ny);
	// every other object with its emissivity over its parent's, plain and coloured, as packPrims weighs them
	const sampled = objects
		.map((o, k) => {
			const p = parentOf(o);
			const w = gone(o) ? 0 : o.jN;
			const wp = gone(o) ? 0 : (p?.jN ?? 0);
			return {
				o,
				k,
				weight: w - wp,
				rgb: [0, 1, 2].map((c) => w * o.color[c] - wp * (p?.color[c] ?? 0))
			};
		})
		.filter(({ k, weight, rgb }) => !small.has(k) && (weight !== 0 || rgb.some((v) => v !== 0)));

	const d: Vec3 = [0, 0, 0];
	for (let j = 0; j < ny; j++)
		for (let i = 0; i < nx; i++) {
			const e = j * nx + i;
			for (let b = 0; b < samples; b++)
				for (let a = 0; a < samples; a++) {
					const x = -tanX + (i + (a + 0.5) / samples) * dx;
					const y = tanY - (j + (b + 0.5) / samples) * dy;
					for (let k = 0; k < 3; k++) d[k] = forward[k] + x * right[k] + y * up[k];
					const n = Math.hypot(d[0], d[1], d[2]);
					const dir: Vec3 = [d[0] / n, d[1] / n, d[2] / n];
					const q = 1 + x * x + y * y;
					const solid = ((dx / samples) * (dy / samples)) / (q * Math.sqrt(q));
					for (const s of sampled) {
						const hit = crossing(s.o, origin, dir);
						if (!hit) continue;
						const chord = (hit[1] - hit[0]) * solid;
						rate[e] += chord * s.weight;
						for (let c = 0; c < 3; c++) colour[3 * e + c] += chord * s.rgb[c];
					}
				}
			extended[e] = rate[e];
		}

	for (const k of small) {
		const o = objects[k];
		const p = parentOf(o);
		const c: Vec3 = [o.center[0] - origin[0], o.center[1] - origin[1], o.center[2] - origin[2]];
		const ahead = dot(c, forward);
		if (ahead <= 0) continue;
		const x = dot(c, right) / ahead;
		const y = dot(c, up) / ahead;
		const i = Math.floor((x + tanX) / dx);
		const j = Math.floor((tanY - y) / dy);
		if (i < 0 || i >= nx || j < 0 || j >= ny) continue;
		const sky = ballOverSky(o.radius, Math.hypot(...c));
		const e = j * nx + i;
		rate[e] += (o.jN - (p?.jN ?? 0)) * sky;
		for (let q = 0; q < 3; q++)
			colour[3 * e + q] += (o.jN * o.color[q] - (p?.jN ?? 0) * (p?.color[q] ?? 0)) * sky;
	}
	return {
		nx,
		ny,
		rate,
		extended,
		colour,
		points: [...small].map((k) => objects[k].id),
		side: Math.min(dx, dy)
	};
}

/** ln Gamma(x) for x > 0, by Lanczos' approximation (g = 7, nine terms): to about 1e-15. */
export function logGamma(x: number): number {
	const g = 7;
	const c = [
		0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
		-176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
		1.5056327351493116e-7
	];
	if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
	const z = x - 1;
	let a = c[0];
	const t = z + g + 0.5;
	for (let i = 1; i < g + 2; i++) a += c[i] / (z + i);
	return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * One Poisson number of mean `mean`, from uniform numbers in [0, 1). Below a mean of 30, by inversion; up to 10^12,
 * by Hormann's transformed rejection (PTRS, 1993), which is exact; beyond, where the relative difference from a
 * normal number of the same mean and variance is below a millionth, by that.
 */
export function poisson(mean: number, next: () => number): number {
	if (!(mean > 0)) return 0;
	if (mean < 30) {
		let p = Math.exp(-mean);
		let total = p;
		let k = 0;
		const u = next();
		while (u > total && k < 1000) {
			k++;
			p *= mean / k;
			total += p;
		}
		return k;
	}
	if (mean > 1e12) {
		// Box-Muller
		const r = Math.sqrt(-2 * Math.log(1 - next()));
		return Math.max(0, Math.round(mean + Math.sqrt(mean) * r * Math.cos(2 * Math.PI * next())));
	}
	const root = Math.sqrt(mean);
	const logMean = Math.log(mean);
	const b = 0.931 + 2.53 * root;
	const a = -0.059 + 0.02483 * b;
	const inverseAlpha = 1.1239 + 1.1328 / (b - 3.4);
	const vr = 0.9277 - 3.6224 / (b - 2);
	for (;;) {
		const u = next() - 0.5;
		const v = next();
		const us = 0.5 - Math.abs(u);
		const k = Math.floor(((2 * a) / us + b) * u + mean + 0.43);
		if (us >= 0.07 && v <= vr) return k;
		if (k < 0 || (us < 0.013 && v > us)) continue;
		if (
			Math.log(v) + Math.log(inverseAlpha) - Math.log(a / (us * us) + b) <=
			-mean + k * logMean - logGamma(k + 1)
		)
			return k;
	}
}

export interface CountPicture {
	/** The picture for the engine's counts view: each element's colour times its count over the scale. */
	image: { width: number; height: number; data: Float32Array };
	/** Gravitons expected from the whole view over the exposure. */
	expected: number;
	/** Gravitons counted in this draw, if it is a draw. */
	counted?: number;
	/** Elements that counted at least one. */
	lit?: number;
	/** The expected count of the brightest element of what is extended (small balls left out). */
	brightest: number;
	/** The square-metre-seconds that give the brightest extended element ENOUGH gravitons. */
	needed: number;
	/** The count that is drawn at the scale's full brightness: never less than one graviton. */
	scale: number;
}

/**
 * What the counts view draws for an exposure of `areaTime` square-metre-seconds: the expected counts, or one Poisson
 * draw of them from `seed`. Brightness is the count against the expected count of an element at the scene's
 * reference brightness `reference` (the number radiance the thermal view's own scale is set by), and never against
 * less than one graviton: so the expected-count picture of a long enough exposure is the thermal image itself, and
 * where a single graviton is not even expected the picture is dark and one that arrives is bright.
 *
 * Each element draws from its own stream of the seed (lib/array/random.ts), and below a mean of thirty from one
 * number of it: so for one seed a longer exposure only adds gravitons, as it would.
 */
export function countPicture(
	grid: CountGrid,
	areaTime: number,
	reference: number,
	show: 'expected' | 'draw',
	seed: number
): CountPicture {
	const { nx, ny, rate, extended, colour, side } = grid;
	const scale = Math.max(1, reference * side * side * areaTime);
	const data = new Float32Array(4 * nx * ny);
	let expected = 0;
	let counted = 0;
	let lit = 0;
	let top = 0;
	for (let e = 0; e < nx * ny; e++) {
		const mean = rate[e] * areaTime;
		expected += mean;
		top = Math.max(top, extended[e]);
		const value =
			show === 'draw' ? poisson(mean, uniform((Math.imul(seed, 0x9e3779b1) ^ e) >>> 0)) : mean;
		if (show === 'draw') {
			counted += value;
			if (value > 0) lit++;
		}
		if (!(rate[e] > 0) || !(value > 0)) continue;
		for (let c = 0; c < 3; c++) data[4 * e + c] = (colour[3 * e + c] / rate[e]) * (value / scale);
	}
	return {
		image: { width: nx, height: ny, data },
		expected,
		counted: show === 'draw' ? counted : undefined,
		lit: show === 'draw' ? lit : undefined,
		brightest: top * areaTime,
		needed: top > 0 ? ENOUGH / top : Infinity,
		scale
	};
}
