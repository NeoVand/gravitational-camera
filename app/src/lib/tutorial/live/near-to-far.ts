/**
 * Chapter 7.7's near-to-far figure: the changing tide across the plane of a circular orbit, 𝓔_zz, from Newton's
 * quadrupole near the pair to the wave far away, for the paper's two black holes (30 M☉ each, 2200 km apart). The
 * physics is in ../../engine/multipole.ts; this file holds the figure's settings, its view, its probe, its map's phases
 * and its predictions, all as pure functions.
 *
 * Distances are kept in metres, so that halving the orbital speed at the same separation, which halves Ω and doubles
 * λ = πc/Ω, moves the crossing out over the same metres. The zoom and the probe are read in wavelengths of the speed
 * now.
 */
import {
	CROSSING,
	LAW3,
	M_SUN,
	boundPair,
	localLaw,
	orbitalSpeed,
	overFar,
	overNear,
	farOverNear,
	patternPhase,
	scaledExact,
	wavelength,
	type Pair
} from '../../engine/multipole';
import { C } from '../../engine/physics/constants';

export { CROSSING, LAW3 };

/** The paper's pair, on Kepler's orbit: Ω = 27.3 s⁻¹, v = 0.100c, λ = 34,400 km. */
export const PAIR: Pair = boundPair(30 * M_SUN, 2.2e6);
/** Its speed, m/s. */
export const V0 = orbitalSpeed(PAIR);

/** λ/2π in wavelengths. */
export const EDGE = 1 / (2 * Math.PI);

/** A slider's range: its ends and grid, the arrow keys' step, Shift's larger step, and values a step stops at. */
export interface Range {
	min: number;
	max: number;
	step: number;
	key: number;
	large: number;
	stops?: number[];
}

/** The zoom: log₁₀ of the width of the map in wavelengths, from 0.02λ to 10λ. */
export const ZOOM: Range = { min: Math.log10(0.02), max: 1, step: 0.01, key: 0.01, large: 0.1 };
/** The orbital speed at the same separation: log₂(v/v₀), from half to double, in quarter octaves. */
export const SPEED: Range = { min: -1, max: 1, step: 0.25, key: 0.25, large: 0.5 };
/**
 * The probe's distance: log₁₀ of r/λ, over the lower panel's 0.02λ to 10λ. A step stops at λ/2π, at the local law's
 * r⁻³ and at the crossing.
 */
export const PROBE: Range = {
	min: Math.log10(0.02),
	max: 1,
	step: 0.001,
	key: 0.01,
	large: 0.1,
	stops: [Math.log10(EDGE), Math.log10(LAW3), Math.log10(CROSSING)]
};

/** Where the figure opens: 2λ across the map, the paper's speed, the probe at 0.3λ on the x axis, playing. */
export const OPENING = { zoom: Math.log10(2), octaves: 0, probe: Math.log10(0.3), phi: 0 };

/** Seconds on the screen for one turn of the pair; the pattern repeats every half turn. */
export const TURN_S = 8;

// --- the pair at a speed --------------------------------------------------------------------------------------------

/** The pair at so many octaves of speed from the paper's, at the same separation: Ω = 2v/d grows with v. */
export const pairAt = (octaves: number): Pair => ({ ...PAIR, omega: PAIR.omega * 2 ** octaves });
/** Its orbital speed over c. */
export const speedOverC = (octaves: number) => (V0 * 2 ** octaves) / C;
/** Its wavelength, m. */
export const lambdaAt = (octaves: number) => wavelength(pairAt(octaves).omega);
/** Where the two laws cross in the plane, m: 0.313λ. */
export const crossingAt = (octaves: number) => CROSSING * lambdaAt(octaves);
/** The separation over the wavelength, d/λ = 2v/πc. */
export const separationOverLambda = (octaves: number) => PAIR.separation / lambdaAt(octaves);

// --- the keys -------------------------------------------------------------------------------------------------------

/**
 * A slider's value after a key: the arrows by a step, with Shift (or Page Up and Page Down) by a large one, onto the
 * grid of that step, stopping at any of the range's stops on the way; Home and End to the ends. Undefined for any
 * other key.
 */
export function stepped(v: number, key: string, shift: boolean, r: Range): number | undefined {
	if (key === 'Home') return r.min;
	if (key === 'End') return r.max;
	const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[
		key
	];
	if (dir === undefined) return undefined;
	const size = shift || key.startsWith('Page') ? r.large : r.key;
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	let next = Math.round(k * size * 1e9) / 1e9;
	for (const s of r.stops ?? [])
		if (dir > 0 ? s > v + 1e-9 && s < next : s < v - 1e-9 && s > next) next = s;
	return Math.max(r.min, Math.min(r.max, next));
}

/** A value held to a range. */
export const clampTo = (v: number, r: Range) => Math.max(r.min, Math.min(r.max, v));

/** A speed held to its range and its quarter octaves. */
export const speedStep = (v: number) =>
	Math.round(clampTo(v, SPEED) / SPEED.step) * SPEED.step || 0;

// --- the view and the probe, kept in metres ----------------------------------------------------------------------

/** The map's width in metres for a zoom (log₁₀ of the width in wavelengths). */
export const widthFor = (zoom: number, octaves: number) => 10 ** zoom * lambdaAt(octaves);
/** The zoom for a width in metres, held to 0.02λ to 10λ of the speed now. */
export const zoomFor = (width: number, octaves: number) =>
	clampTo(Math.log10(width / lambdaAt(octaves)), ZOOM);

/** The probe's distance in metres for log₁₀(r/λ). */
export const probeMetres = (place: number, octaves: number) => 10 ** place * lambdaAt(octaves);
/** log₁₀(r/λ) for a distance in metres, held to 0.02λ to 10λ. */
export const probePlace = (r: number, octaves: number) =>
	clampTo(Math.log10(r / lambdaAt(octaves)), PROBE);

/**
 * Where a point at (x, y) from the centre of a map of half-sizes (hw, hh) is drawn, all in the same units: at itself
 * if it lies more than `margin` inside the edges, and otherwise where its ray from the centre meets that margin, as an
 * edge marker.
 */
export function inView(x: number, y: number, hw: number, hh: number, margin: number) {
	const w = Math.max(1e-9, hw - margin);
	const h = Math.max(1e-9, hh - margin);
	const s = Math.min(1, w / Math.max(1e-12, Math.abs(x)), h / Math.max(1e-12, Math.abs(y)));
	return { x: x * s, y: y * s, inside: s >= 1 };
}

/** A dragged radius lands on a circle within `tolerance` of it (all in pixels): the nearest such, else undefined. */
export function snapTo(at: number, circles: { at: number; value: number }[], tolerance: number) {
	let best: { at: number; value: number } | undefined;
	for (const c of circles)
		if (Math.abs(c.at - at) <= tolerance && (!best || Math.abs(c.at - at) < Math.abs(best.at - at)))
			best = c;
	return best?.value;
}

// --- the probe's numbers --------------------------------------------------------------------------------------------

/** The readings at a distance of r/λ: kr, the local law and the ratios of the exact field to the two laws. */
export function reading(rOverLambda: number) {
	const x = 2 * Math.PI * rOverLambda;
	return {
		kr: x,
		law: localLaw(x),
		overNear: overNear(x),
		overFar: overFar(x),
		farOverNear: farOverNear(x),
		strength: scaledExact(x)
	};
}

// --- the map --------------------------------------------------------------------------------------------------------

/**
 * The phase ψ = kr + 2φ + arg(bracket) at the centres of an n × m grid over a map w wavelengths wide and h high, the
 * pair at its centre, rows from the top; as its cosine and sine, so that a frame needs one rotation: 𝓔_zz/|𝓔_zz| =
 * cos(ψ − 2Ωt) = cos ψ cos 2Ωt + sin ψ sin 2Ωt. The radial factor does not change with time; only this phase turns.
 */
export function phaseGrid(n: number, m: number, w: number, h: number) {
	const cos = new Float32Array(n * m);
	const sin = new Float32Array(n * m);
	for (let j = 0; j < m; j++) {
		const y = (0.5 - (j + 0.5) / m) * h;
		for (let i = 0; i < n; i++) {
			const x = ((i + 0.5) / n - 0.5) * w;
			const r = Math.hypot(x, y);
			const psi = patternPhase(2 * Math.PI * Math.max(r, 1e-9), Math.atan2(y, x));
			cos[j * n + i] = Math.cos(psi);
			sin[j * n + i] = Math.sin(psi);
		}
	}
	return { cos, sin };
}

/** The drawn value at one point of the grid, 𝓔_zz over its local strength: −1 a full stretch, +1 a full squeeze. */
export const shade = (cosPsi: number, sinPsi: number, turn: number) =>
	cosPsi * Math.cos(2 * turn) + sinPsi * Math.sin(2 * turn);

/** A scale bar for a map w wavelengths wide: the largest of 1, 2 and 5 times a power of ten not above w/5. */
export function scaleBar(w: number): number {
	const target = w / 5;
	const e = Math.floor(Math.log10(target));
	let best = 10 ** e;
	for (const m of [2, 5]) if (m * 10 ** e <= target * (1 + 1e-9)) best = m * 10 ** e;
	return best;
}

// --- the predictions ------------------------------------------------------------------------------------------------

/** The probe stands at the crossing when within this many decades of it, half a per cent: closer than the r⁻³ point, 0.310λ. */
export const AT_CROSSING = 0.002;
export const atCrossing = (rOverLambda: number) =>
	Math.abs(Math.log10(rOverLambda / CROSSING)) <= AT_CROSSING;

/** The first, once the probe has stood where the two laws are equal. */
export const noteFirst = (done: boolean, rOverLambda: number) => done || atCrossing(rOverLambda);

/** The speeds held, in octaves, after one more. */
export const hear = (heard: number[], octaves: number) =>
	heard.some((o) => Math.abs(o - octaves) < 1e-9) ? heard : [...heard, octaves];

/** The speed held before that the speed now halves, if any. */
export const halvedFrom = (heard: number[], octaves: number) =>
	heard.find((o) => Math.abs(o - (octaves + 1)) < 1e-9);

/** The second, once the speed has been halved from one held before, at the same separation. */
export const noteSecond = (done: boolean, heard: number[], octaves: number) =>
	done || halvedFrom(heard, octaves) !== undefined;

// --- the words ------------------------------------------------------------------------------------------------------

/** A number to three figures, plainly: "0.313", "3.08", "27.3", "34,400". */
export function three(x: number): string {
	if (x === 0 || !Number.isFinite(x)) return '0';
	const r = Number(x.toPrecision(3));
	const a = Math.abs(r);
	if (a >= 1000) return r.toLocaleString('en-US');
	return r.toFixed(Math.max(0, 2 - Math.floor(Math.log10(a))));
}

/** The same in LaTeX, with the thousands kept apart: "34{,}400". */
export const texThree = (x: number) => three(x).replace(/,/g, '{,}');

/** A distance in kilometres to three figures: "10,800 km". */
export const kmWords = (m: number) => `${three(m / 1e3)} km`;

/** A local law as a power, to two decimals: "−3.00". */
export const lawWords = (n: number) => (n < 0 ? '−' : '') + Math.abs(n).toFixed(2);
