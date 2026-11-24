/**
 * Chapter 7.8's memory-pattern figure: a burst the same all round an axis ẑ, its emission pattern dE/d²n̂′ as a polar
 * curve, a camera direction N̂ at the angle θ from ẑ, and the memory |Δh| over all camera directions. The physics, the
 * sum of eq:memory-axes over the sky, is in ../../engine/memory.ts; this file holds the figure's patterns, settings,
 * readings, curves, keys and predictions, all as pure functions.
 *
 * The engine works in units of GE/c⁴r, the chapter's; the figure reads in 4GE/c⁴r, as the paper's fig:memory(b) does,
 * so that one jet seen from close to its line reads 1 and two jets sharing E read ½ everywhere.
 */
import {
	closed,
	dipole,
	highShare,
	memory,
	merger,
	oneJet,
	quadrupole,
	sphere,
	twoJets,
	type Pattern
} from '../../engine/memory';
import { stepped, three, type Range } from './near-to-far';

export { stepped, three, type Range };

/** The patterns, as the buttons name them. */
export type Kind = 'merger' | 'jet' | 'jets' | 'sphere' | 'dipole' | 'quadrupole';
export const KINDS: Kind[] = ['merger', 'jet', 'jets', 'sphere', 'dipole', 'quadrupole'];

/** The settings: the pattern, the dipole's a, the asymmetry q, and the camera's angle θ from ẑ in degrees. */
export interface Settings {
	kind: Kind;
	a: number;
	q: number;
	theta: number;
}

/** The figure opens on the merger's pattern, the camera edge-on; the dipole at a = 0, so the reader makes it lopsided. */
export const OPENING: Settings = { kind: 'merger', a: 0, q: 1, theta: 90 };

/** The dipole's a, from −1 to 1. */
export const A: Range = { min: -1, max: 1, step: 0.05, key: 0.05, large: 0.25, stops: [0] };
/** The asymmetry q of 1 + qP₂, from −1 to 2, where the pattern stays positive. */
export const Q: Range = { min: -1, max: 2, step: 0.05, key: 0.05, large: 0.25, stops: [0] };
/** The camera's angle θ from ẑ, degrees: 1° a press, 10° with Shift, stopping edge-on at 90°. */
export const THETA: Range = { min: 0, max: 180, step: 1, key: 1, large: 10, stops: [90] };

/** The readings' unit, 4GE/c⁴r, in the engine's GE/c⁴r. */
export const UNIT = 4;

const rad = (d: number) => (d * Math.PI) / 180;

/** The pattern for the settings. */
export function patternOf(kind: Kind, a: number, q: number): Pattern {
	switch (kind) {
		case 'merger':
			return merger();
		case 'jet':
			return oneJet();
		case 'jets':
			return twoJets();
		case 'sphere':
			return sphere();
		case 'dipole':
			return dipole(a);
		case 'quadrupole':
			return quadrupole(q);
	}
}

/** The chapter's closed form for the settings, in units of 4GE/c⁴r: what the quadrature should give. */
export function closedFor(kind: Kind, a: number, q: number, theta: number): number {
	const t = rad(theta);
	const jetLine = theta <= 0 || (kind === 'jets' && theta >= 180);
	switch (kind) {
		case 'merger':
			return closed.merger(t) / UNIT;
		case 'jet':
			return jetLine ? 0 : closed.oneJet(t) / UNIT;
		case 'jets':
			return jetLine ? 0 : closed.twoJets() / UNIT;
		case 'sphere':
			return closed.sphere() / UNIT;
		case 'dipole':
			return closed.dipole() / UNIT;
		case 'quadrupole':
			return closed.quadrupole(t, q) / UNIT;
	}
}

/** What the readouts show: Δh₊ and Δh× in units of 4GE/c⁴r, whether the camera is inside a jet, and the share ℓ ≥ 2. */
export function reading(s: Settings) {
	const p = patternOf(s.kind, s.a, s.q);
	const m = memory(p, rad(s.theta));
	return {
		plus: m.plus / UNIT,
		cross: m.cross / UNIT,
		inside: m.inside,
		closed: closedFor(s.kind, s.a, s.q, s.theta),
		share: highShare(p)
	};
}

/** The polar plot's outer ring, in units of 4GE/c⁴r: 1 for the jets, a quarter for the smooth patterns. */
export const scaleOf = (kind: Kind) => (kind === 'jet' || kind === 'jets' ? 1 : 0.25);
/** Its rings: four, evenly, out to the scale. */
export const ringsOf = (scale: number) => [0.25, 0.5, 0.75, 1].map((k) => k * scale);

/** A camera exactly on a jet's line is read this close to it for the curve, which draws the limit there. */
const NEAR_LINE = 1e-7;

/**
 * Δh₊ over the camera's directions, in units of 4GE/c⁴r, at every `step` degrees from 0° to 180°. On a jet's line
 * the curve takes the limit from beside it, and `holes` lists the angles where the value itself is zero instead.
 */
export function curveOf(p: Pattern, step = 1) {
	const values: { theta: number; value: number }[] = [];
	const holes: number[] = [];
	for (let d = 0; d <= 180 + 1e-9; d += step) {
		const t = Math.min(Math.PI - NEAR_LINE, Math.max(NEAR_LINE, rad(d)));
		values.push({ theta: d, value: memory(p, t).plus / UNIT });
		if (memory(p, rad(d)).inside) holes.push(d);
	}
	return { values, holes };
}

/**
 * The curve cut into runs of one sign: |Δh| is drawn, solid where Δh₊ > 0 and dashed where Δh₊ < 0, with each run's
 * ends where the sign changes found by straight interpolation.
 */
export function signedRuns(values: { theta: number; value: number }[]) {
	const runs: { negative: boolean; points: { theta: number; value: number }[] }[] = [];
	const sign = (v: number) => (v < -1e-12 ? -1 : v > 1e-12 ? 1 : 0);
	let run: (typeof runs)[number] | undefined;
	for (let i = 0; i < values.length; i++) {
		const p = values[i];
		const s = sign(p.value);
		if (s === 0) {
			if (run) run.points.push({ theta: p.theta, value: 0 });
			run = undefined;
			continue;
		}
		if (run && run.negative !== s < 0) {
			const q = values[i - 1];
			const at = q.theta + ((p.theta - q.theta) * q.value) / (q.value - p.value);
			run.points.push({ theta: at, value: 0 });
			run = { negative: s < 0, points: [{ theta: at, value: 0 }] };
			runs.push(run);
		} else if (!run) {
			const q = values[i - 1];
			run = { negative: s < 0, points: q ? [{ theta: q.theta, value: 0 }] : [] };
			runs.push(run);
		}
		run.points.push(p);
	}
	return runs.filter((r) => r.points.length > 1);
}

/** The largest |Δh| over the sky, in units of 4GE/c⁴r, as the curve has it. */
export const peakOf = (values: { theta: number; value: number }[]) =>
	values.reduce((m, p) => Math.max(m, Math.abs(p.value)), 0);

/**
 * The emission pattern's radius as drawn, a fraction of the largest: 4πf/3, so that the brightest smooth pattern of
 * the figure, 1 + 2P₂ along its axis, fills it and the sphere's circle is a third of it.
 */
export const drawnRadius = (p: Pattern, x: number) =>
	p.smooth ? (4 * Math.PI * p.smooth(x)) / 3 : 0;

/** The sphere's circle as drawn, for comparison: a third of the largest. */
export const EVEN = 1 / 3;

// --- the camera's direction -----------------------------------------------------------------------------------------

/** The angle from ẑ, degrees, of a point (dx, dy) from the centre, y up; the two sides of ẑ are the same. */
export const angleAt = (dx: number, dy: number) => (Math.atan2(Math.abs(dx), dy) * 180) / Math.PI;

/** A dragged angle lands on 0°, 90° or 180° within `tolerance` degrees, and on whole degrees otherwise. */
export function snapAngle(theta: number, tolerance = 3): number {
	for (const s of [0, 90, 180]) if (Math.abs(theta - s) <= tolerance) return s;
	return Math.max(0, Math.min(180, Math.round(theta)));
}

/** A slider's value held to its range and its grid. */
export function landed(v: number, r: Range): number {
	const k = Math.round(Math.max(r.min, Math.min(r.max, v)) / r.step);
	return Math.round(k * r.step * 1e9) / 1e9 || 0;
}

// --- the predictions ------------------------------------------------------------------------------------------------

/** The sphere's directions seen so far, degrees. */
export interface Span {
	lo: number;
	hi: number;
}

/** The first is answered once the camera has turned through this many degrees round a sphere. */
export const SPHERE_SPAN = 45;
/** The second, once the camera stands within this many degrees of a single jet's line. */
export const JET_NEAR = 10;
/** The third, once the dipole's a has reached this far from zero. */
export const LOPSIDED = 0.5;

/** The directions seen round the sphere, after one more. */
export function noteSphere(span: Span | undefined, kind: Kind, theta: number): Span | undefined {
	if (kind !== 'sphere') return span;
	if (!span) return { lo: theta, hi: theta };
	return { lo: Math.min(span.lo, theta), hi: Math.max(span.hi, theta) };
}

export const sphereDone = (span: Span | undefined) =>
	span !== undefined && span.hi - span.lo >= SPHERE_SPAN - 1e-9;

export const noteFirst = (done: boolean, span: Span | undefined) => done || sphereDone(span);

export const noteSecond = (done: boolean, kind: Kind, theta: number) =>
	done || (kind === 'jet' && theta <= JET_NEAR + 1e-9);

export const noteThird = (done: boolean, kind: Kind, a: number) =>
	done || (kind === 'dipole' && Math.abs(a) >= LOPSIDED - 1e-9);

// --- the words ------------------------------------------------------------------------------------------------------

/** A reading to three decimals, with a true minus sign and no "−0.000": "0.177", "−0.125", "0". */
export function fixed3(x: number): string {
	const r = Math.round(x * 1000) / 1000;
	if (r === 0) return '0';
	return (r < 0 ? '−' : '') + Math.abs(r).toFixed(3);
}

/** The same in LaTeX. */
export const texFixed3 = (x: number) => fixed3(x).replace('−', '-');

/** A slider's value to two decimals, with a true minus sign: "−0.50", "1.00". */
export const two = (x: number) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(2);

/** A share as a percentage, to three figures: "29.0%". */
export const percent = (s: number) => `${three(100 * s)}%`;
