/**
 * Where the "Tidal field" view is worth looking: the distances from the camera at which its sphere of points meets
 * something, worked out from each demo's own scene. They become the ticks of the "Slice" slider.
 */
import type { AnalyzedObject, Vec3 } from '../engine/types';

export interface SliceMark {
	/** Distance from the camera, in the demo's own unit of length. */
	at: number;
	label: string;
}

const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const SIDES = new Set(['left', 'right', 'middle', 'top', 'bottom', 'upper', 'lower']);
/** "safe-left" as "the left safe". */
function named(id: string): string {
	const words = id.split('-');
	if (words.length > 1 && SIDES.has(words[words.length - 1])) words.unshift(words.pop()!);
	return `the ${words.join(' ')}`;
}
/** "a", "a and b", "a, b and c". */
const listed = (names: string[]) =>
	names.length < 2
		? names.join('')
		: `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
/** "moon" as "the Moon": a body in the sky has a name. */
const body = (id: string) => `the ${id.charAt(0).toUpperCase()}${id.slice(1).replace(/-/g, ' ')}`;

/**
 * For a camera on a planet of nested spheres (the object `planet` and the spheres within it about its centre):
 * straight down, the ground and the top of each shell beneath it, the centre, and the far side; and every other
 * body of the scene at its own distance. Metres.
 */
export function planetSlices(objects: AnalyzedObject[], at: Vec3, planet = 'earth'): SliceMark[] {
	const root = objects.findIndex((o) => o.id === planet);
	if (root < 0) return [];
	const within = (i: number): boolean => i === root || (i >= 0 && within(objects[i].parent));
	const centre = objects[root].center;
	const height = distance(at, centre);
	const marks: SliceMark[] = [];
	objects.forEach((o, i) => {
		if (!within(i) || o.half) return;
		const depth = height - o.radius;
		if (depth > 0)
			marks.push({ at: depth, label: i === root ? 'the ground' : `the top of ${named(o.id)}` });
	});
	marks.push({ at: height, label: `${body(planet)}’s centre` });
	marks.push({ at: height + objects[root].radius, label: `the far side of ${body(planet)}` });
	objects.forEach((o, i) => {
		if (o.parent < 0 && i !== root) marks.push({ at: distance(at, o.center), label: body(o.id) });
	});
	return marks.sort((a, b) => a.at - b.at);
}

/** The nearest point of a box to a point outside it. */
function nearestOnBox(o: AnalyzedObject, at: Vec3): Vec3 {
	return at.map((v, k) =>
		Math.max(o.center[k] - o.half![k], Math.min(o.center[k] + o.half![k], v))
	) as Vec3;
}

/**
 * For a camera in a room: each thing brought into it at the distance of its centre, and each wall and the floor at
 * its nearest point. Marks closer together than `apart` are given as one, at the nearest of them. `groups` names
 * things made of several objects ("the two safes"); the distances are always worked out here. Metres.
 */
export function roomSlices(
	objects: AnalyzedObject[],
	at: Vec3,
	apart = 0.15,
	groups: { label: string; ids: string[] }[] = []
): SliceMark[] {
	const name = (id: string) => groups.find((g) => g.ids.includes(id))?.label ?? named(id);
	const all = objects
		.filter((o) => o.parent < 0)
		.map((o) => ({
			at: o.background && o.half ? distance(at, nearestOnBox(o, at)) : distance(at, o.center),
			label: name(o.id)
		}))
		.sort((a, b) => a.at - b.at);
	const marks: { at: number; names: string[] }[] = [];
	for (const m of all) {
		const last = marks[marks.length - 1];
		if (last && m.at - last.at < apart) {
			if (!last.names.includes(m.label)) last.names.push(m.label);
		} else marks.push({ at: m.at, names: [m.label] });
	}
	return marks.map((m) => ({ at: m.at, label: listed(m.names) }));
}

/**
 * For a camera at rest `distance` G M / c^2 from a black hole: where the sphere of points first touches the photon
 * sphere (r = 3) and the horizon (r = 2), passes through the hole's centre, and leaves them on the far side.
 */
export function holeSlices(distance: number): SliceMark[] {
	return [
		{ at: distance - 3, label: 'the photon sphere, near side' },
		{ at: distance - 2, label: 'the horizon, near side' },
		{ at: distance, label: 'the hole’s centre: the camera’s own distance' },
		{ at: distance + 2, label: 'the horizon, far side' },
		{ at: distance + 3, label: 'the photon sphere, far side' }
	].filter((m) => m.at > 0);
}

/** The radius, in scale lengths, within which an exponential disc holds this share of its mass. */
export function discRadius(share: number): number {
	// 1 - (1 + x) e^-x = share, by bisection
	let lo = 0;
	let hi = 50;
	for (let i = 0; i < 80; i++) {
		const x = 0.5 * (lo + hi);
		if (1 - (1 + x) * Math.exp(-x) < share) lo = x;
		else hi = x;
	}
	return 0.5 * (lo + hi);
}

/**
 * For a camera at the Sun in the Galaxy's model (reference/gravcam/galaxy.py: the Sun `sun` kpc from the axis and
 * `above` kpc over the plane; the thin disc with scale length `length` and height `scaleHeight`): the plane of the
 * disc, one scale height out of it, the Galaxy's centre, and the disc's edge, taken as the radius that holds 95% of
 * the thin disc's stars, on the near side and the far. Kiloparsecs.
 */
export function galaxySlices(
	sun = 8.2,
	above = 0.02,
	length = 2.6,
	scaleHeight = 0.3
): SliceMark[] {
	const edge = discRadius(0.95) * length;
	return [
		{ at: above, label: 'the plane of the disc' },
		{ at: scaleHeight, label: 'one scale height of the thin disc' },
		{ at: edge - sun, label: 'the edge of the disc, on the near side' },
		{ at: Math.hypot(sun, above), label: 'the Galaxy’s centre' },
		{ at: edge + sun, label: 'the edge of the disc, on the far side' }
	].filter((m) => m.at > 0);
}

/**
 * A slider's scale that gives each stretch between marked values the same length of track, so that marks which
 * crowd together on a plain scale (the Earth's shells against the distance of the Sun) can each be reached. Between
 * two marks the value runs evenly. `anchors` are the ends of the scale and the marks between them, rising; a
 * position runs from 0 to their number less one.
 */
export function evenScale(anchors: number[]): {
	last: number;
	toPosition: (value: number) => number;
	toValue: (position: number) => number;
} {
	const a = anchors.filter((v, k) => k === 0 || v > anchors[k - 1]);
	const last = a.length - 1;
	return {
		last,
		toPosition(value) {
			if (value <= a[0]) return 0;
			if (value >= a[last]) return last;
			let k = 0;
			while (a[k + 1] < value) k++;
			return k + (value - a[k]) / (a[k + 1] - a[k]);
		},
		toValue(position) {
			const p = Math.max(0, Math.min(last, position));
			const k = Math.min(last - 1, Math.floor(p));
			return a[k] + (p - k) * (a[k + 1] - a[k]);
		}
	};
}

/**
 * The marks of a slider that runs on the logarithm of the distance, from `min` to `max` (both logarithms), and the
 * even scale through them: marks outside the range, or within a hundredth of a decade of its ends, are left out.
 */
export function logSlices(marks: SliceMark[], min: number, max: number) {
	const inside = marks
		.map((m) => ({ ...m, log: Math.log10(m.at) }))
		.filter((m) => m.log > min + 0.01 && m.log < max - 0.01)
		.sort((p, q) => p.log - q.log);
	const scale = evenScale([min, ...inside.map((m) => m.log), max]);
	return { scale, marks: inside.map((m) => ({ ...m, position: scale.toPosition(m.log) })) };
}
