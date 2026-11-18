/**
 * The "Tidal field" reading of each demo: the tidal tensor at the camera, in the demo's own axes and in s^-2, split
 * by source, with the magnetic part where mass moves. Every tensor is a closed form of lib/pixel/tide.ts or
 * quadrupole.ts, or a constant computed once from the reference; tide-demos.spec.ts pins each to the Python
 * reference. Drawn by lib/ui/TidalReading.svelte.
 */
import { C, G } from '../engine/physics/constants';
import type { AnalyzedObject, Vec3 } from '../engine/types';
import { rotors, spunAt, type Rotor } from '../engine/waves';
import { spinDipole } from './probe';
import { newtonQuadrupole, quadrupoleTerms, rotorQuadrupole, type ComplexMat3 } from './quadrupole';
import {
	add3,
	movingMagnetic,
	ownMagnetic,
	ownMass,
	ownTide,
	pointTide,
	scale3,
	size3,
	zero3,
	type Landmark,
	type Mat3
} from './tide';

export interface Source {
	label: string;
	/** The electric part, s^-2. */
	E: Mat3;
	/** The magnetic part, s^-2, where the source moves. */
	B?: Mat3;
	/** From the camera toward it, for naming directions. */
	toward?: Vec3;
	/** Taken away from the reading, as the empty room is when "Room" is off. */
	removed?: boolean;
	/** A line under its name: what it is, in numbers. */
	note?: string;
}

export interface RingSpec {
	label: string;
	E: Mat3;
	/** The tide the drawing is scaled to, s^-2, where it should not follow E from moment to moment. */
	scale?: number;
	/** That scale is the most the field reaches over a turn, not its size at this moment. */
	most?: boolean;
}

export interface Part {
	label: string;
	/** s^-2, at this moment. */
	now: number;
	/** s^-2, the most over a turn. */
	most?: number;
}

export interface Reading {
	sources: Source[];
	landmarks: Landmark[];
	rings: RingSpec[];
	/** The reading's parts in time, where it changes. */
	parts?: Part[];
	/** Sentences for the foot of the panel: what is computed, and what is not. */
	notes: string[];
	/** Which way is up, where a ring is drawn in the plane of its own two largest principal values. */
	upright?: Vec3;
}

/** The sum of the sources that are not taken away. */
export function total(reading: Reading): Mat3 {
	return add3(...reading.sources.filter((s) => !s.removed).map((s) => s.E));
}

/** The magnetic part of the same, if any source moves. */
export function totalMagnetic(reading: Reading): Mat3 | undefined {
	const moving = reading.sources.filter((s) => !s.removed && s.B);
	return moving.length ? add3(...moving.map((s) => s.B!)) : undefined;
}

// --- rooms ------------------------------------------------------------------------------------------------------------

export interface Group {
	label: string;
	ids: string[];
}

/**
 * The sources a room's reading is split into, by scene. Whatever is marked as background is "the room"; an object
 * named in `ignore` is a drawing device with no mass of its own.
 */
export const ROOM_SOURCES: Record<string, { groups: Group[]; ignore?: string[] }> = {
	'locked-safe': {
		groups: [
			{ label: 'the gold', ids: ['safe-right-gold'] },
			{
				label: 'the two safes',
				ids: ['safe-left', 'safe-left-cavity', 'safe-right', 'safe-right-cavity']
			}
		]
	},
	'full-or-empty': {
		groups: [
			{ label: 'the mercury', ids: ['tank-right-contents'] },
			{ label: 'the water', ids: ['tank-middle-contents'] },
			{
				label: 'the three steel tanks',
				ids: ['tank-left', 'tank-left-contents', 'tank-middle', 'tank-right']
			}
		]
	},
	'blank-mirror': {
		groups: [
			{ label: 'the bronze ball', ids: ['ball'] },
			{ label: 'the plinth', ids: ['plinth'] },
			{ label: 'the mirror, the page and the television', ids: ['mirror', 'page', 'television'] }
		]
	},
	'closed-furnace': {
		groups: [
			{ label: 'the hot iron', ids: ['furnace-right-charge'] },
			{ label: 'the cold iron', ids: ['furnace-left-charge'] },
			{
				label: 'the two furnaces',
				ids: ['furnace-left', 'furnace-left-lining', 'furnace-right', 'furnace-right-lining']
			}
		]
	},
	'honey-and-water': {
		groups: [
			{ label: 'the honey', ids: ['bottle-left-contents'] },
			{ label: 'the water', ids: ['bottle-right-contents'] },
			{ label: 'the two glass bottles', ids: ['bottle-left', 'bottle-right'] }
		]
	},
	'sealed-flywheel': {
		groups: [
			{ label: 'the turning flywheel', ids: ['flywheel-right'] },
			{ label: 'the still flywheel', ids: ['flywheel-left'] },
			{
				label: 'the two housings',
				ids: ['housing-left', 'housing-left-inside', 'housing-right', 'housing-right-inside']
			}
		]
	},
	'beam-in-the-dark': { groups: [{ label: 'the beam', ids: ['beam'] }] },
	'behind-the-wall': {
		groups: [
			{ label: 'the person walking', ids: ['walking'] },
			{ label: 'the person standing', ids: ['standing'] }
		]
	},
	'where-it-is': {
		groups: [
			{ label: 'the ball', ids: ['ball-mass'] },
			{ label: 'the plinth', ids: ['plinth'] }
		],
		// the copy of the ball that light shows: the scene gives it almost no mass
		ignore: ['ball-seen']
	},
	'which-way': {
		groups: [
			{
				label: 'the three drums',
				ids: [
					'drum-top',
					'drum-top-inside',
					'drum-middle',
					'drum-middle-inside',
					'drum-bottom',
					'drum-bottom-inside'
				]
			},
			{
				label: 'the shelf',
				ids: ['shelf-post-left', 'shelf-post-right', 'shelf-lower', 'shelf-upper', 'shelf-top']
			},
			{ label: 'the still pair', ids: ['drum-bottom-ball-a', 'drum-bottom-ball-b'] }
		]
	}
};

/** The axes of a room, in words: +y up, +x to the right of the first view, -z toward the far wall. */
export const ROOM_AXES: Landmark[] = [
	{
		along: 'up-down',
		from: 'the vertical',
		dir: [0, 1, 0],
		across: 'every horizontal direction',
		frame: true
	},
	{ along: 'left-right', from: 'the left-right line', dir: [1, 0, 0], frame: true },
	{ along: 'near-far', from: 'the near-far line', dir: [0, 0, 1], frame: true }
];

/** The sources of a scene with no entry above: each thing brought into the room, with what it holds. */
function defaultGroups(objects: AnalyzedObject[]): Group[] {
	const root = (i: number): number => (objects[i].parent >= 0 ? root(objects[i].parent) : i);
	const byRoot: Record<number, string[]> = {};
	objects.forEach((o, i) => {
		const r = root(i);
		if (!objects[r].background) (byRoot[r] ??= []).push(o.id);
	});
	return Object.entries(byRoot).map(([r, ids]) => ({
		label: `the ${objects[Number(r)].id.replace(/-/g, ' ')}`,
		ids
	}));
}

/** From `at` toward the centre of mass of some objects' own matter. */
function towardGroup(objects: AnalyzedObject[], indices: number[], at: Vec3): Vec3 | undefined {
	let mass = 0;
	const sum = [0, 0, 0];
	for (const i of indices) {
		const m = Math.abs(ownMass(objects[i]));
		mass += m;
		for (let k = 0; k < 3; k++) sum[k] += m * objects[i].center[k];
	}
	if (mass === 0) return undefined;
	const d = sum.map((v, k) => v / mass - at[k]);
	const n = Math.hypot(...d);
	return n > 0 ? (d.map((v) => v / n) as Vec3) : undefined;
}

/** The volume of a sphere of the scene, m^3. */
const ballVolume = (o: AnalyzedObject) => (4 / 3) * Math.PI * o.radius ** 3;

/** An immersed sphere's mass over that of what it moves through, as a point at its centre. */
function excessTide(objects: AnalyzedObject[], index: number, at: Vec3): Mat3 {
	const o = objects[index];
	const around = o.parent >= 0 ? objects[o.parent].density : 0;
	return pointTide((o.density - around) * ballVolume(o), o.center, at);
}

/**
 * The tide of some objects' own matter. A sphere in `immersed` (a ball moving through the air of a drum) counts as
 * its excess over what surrounds it, and is not carved out of its parent, so that the parent's part stays steady as
 * the ball moves. The sum over a whole scene is the same either way.
 */
export function groupTide(
	objects: AnalyzedObject[],
	indices: number[],
	at: Vec3,
	immersed: Set<number> = new Set()
): Mat3 {
	let sum = zero3();
	for (const i of indices) {
		if (immersed.has(i)) {
			sum = add3(sum, excessTide(objects, i, at));
			continue;
		}
		sum = add3(sum, ownTide(objects, i, at));
		// put back what ownTide carved out for an immersed child: its shape at this object's density
		objects.forEach((child, c) => {
			if (child.parent === i && immersed.has(c))
				sum = add3(sum, pointTide(objects[i].density * ballVolume(child), child.center, at));
		});
	}
	return sum;
}

const landmarkTo = (label: string, dir: Vec3): Landmark => ({
	along: `along the line to ${label}`,
	from: `the line to ${label}`,
	dir
});

/** The static sources of a room: its groups and the room itself, with the magnetic part of whatever moves. */
function roomSources(
	name: string,
	objects: AnalyzedObject[],
	at: Vec3,
	subtractRoom: boolean,
	immersed: Set<number> = new Set()
): Source[] {
	const entry = ROOM_SOURCES[name];
	const groups = entry?.groups ?? defaultGroups(objects);
	const ignore = new Set(entry?.ignore ?? []);
	const index = new Map(objects.map((o, i) => [o.id, i]));
	const used = new Set<number>();
	const sources: Source[] = [];
	for (const g of groups) {
		const indices = g.ids.map((id) => index.get(id)).filter((i): i is number => i !== undefined);
		if (!indices.length) continue;
		indices.forEach((i) => used.add(i));
		const moving = indices
			.map((i) => ownMagnetic(objects, i, at))
			.filter((b): b is Mat3 => b !== undefined);
		sources.push({
			label: g.label,
			E: groupTide(objects, indices, at, immersed),
			B: moving.length ? add3(...moving) : undefined,
			toward: towardGroup(objects, indices, at)
		});
	}
	// everything else is the room, or (for a scene not listed) is added to it
	const rest = objects
		.map((_, i) => i)
		.filter((i) => !used.has(i) && !ignore.has(objects[i].id) && !immersed.has(i));
	if (rest.length)
		sources.push({
			label: 'the empty room',
			E: groupTide(objects, rest, at, immersed),
			removed: subtractRoom,
			note: subtractRoom ? 'known in advance' : 'its floor and walls, and what is fixed to them'
		});
	return sources;
}

const ONE_PIXEL = 'This is what one pixel at the camera reads. An image needs an array of them.';

/** The reading of a room demo. */
export function roomReading(
	name: string,
	objects: AnalyzedObject[],
	at: Vec3,
	subtractRoom = false
): Reading {
	const sources = roomSources(name, objects, at, subtractRoom);
	const reading: Reading = {
		sources,
		landmarks: [
			...ROOM_AXES,
			...sources.filter((s) => s.toward).map((s) => landmarkTo(s.label, s.toward!))
		],
		rings: [],
		notes: [ONE_PIXEL]
	};
	reading.rings = [
		{ label: subtractRoom ? 'With the empty room taken away' : 'All of it', E: total(reading) }
	];
	if (name === 'where-it-is')
		reading.notes.push(
			'The ball’s field is taken at rest, where gravity shows it. In slowed light it would also be squeezed along its motion; that is left out, as in the picture.'
		);
	if (sources.some((s) => s.B))
		reading.notes.push(
			'The magnetic part is computed to first order in the speed of the mass over that of light, at the true speed of light.'
		);
	return reading;
}

// --- the Sun at midnight -----------------------------------------------------------------------------------------------

/** The Earth's rate of turning against the stars, rad/s (one turn in 86 164.0905 s). */
export const EARTH_SPIN = (2 * Math.PI) / 86164.0905;
/** Real masses, kg, to say how the scene's bodies compare. */
export const REAL_MASS = { earth: 5.9722e24, moon: 7.342e22, sun: 1.98847e30 };

/** A body of nested spheres about one centre: its mass and its moment of inertia, from the scene's shells. */
export function layeredBody(
	objects: AnalyzedObject[],
	ids: string[]
): { mass: number; inertia: number } {
	let mass = 0;
	let inertia = 0;
	for (const o of objects) {
		if (!ids.includes(o.id)) continue;
		const around =
			o.parent >= 0 && ids.includes(objects[o.parent].id) ? objects[o.parent].density : 0;
		const m = (o.density - around) * (4 / 3) * Math.PI * o.radius ** 3;
		mass += m;
		inertia += 0.4 * m * o.radius ** 2;
	}
	return { mass, inertia };
}

/**
 * The magnetic part read by a pixel at rest on the ground of a turning planet (paper, Section II): the planet moves
 * past the pixel at minus the ground's speed, and turns; together a moving mass and a spin dipole. At the equator
 * its principal values are +-(3 G M W / c R^2) (1 - I / M R^2).
 */
export function turningPlanetMagnetic(
	body: { mass: number; inertia: number },
	center: Vec3,
	pole: Vec3,
	spin: number,
	at: Vec3
): Mat3 {
	const w = pole.map((p) => p * spin) as Vec3;
	const r = at.map((v, k) => v - center[k]);
	// the ground's velocity, w x r; the planet's, seen from the pixel, is its opposite
	const past: Vec3 = [
		-(w[1] * r[2] - w[2] * r[1]),
		-(w[2] * r[0] - w[0] * r[2]),
		-(w[0] * r[1] - w[1] * r[0])
	];
	const L = w.map((v) => v * body.inertia) as Vec3;
	return add3(movingMagnetic(pointTide(body.mass, center, at), past), spinDipole(L, center, at));
}

const EARTH_IDS = ['earth', 'upper-mantle', 'lower-mantle', 'outer-core', 'inner-core'];

/** A scene's mass against the real body's: within half a per cent they are called the same. */
const against = (ratio: number, body: string) =>
	Math.abs(ratio - 1) < 0.005
		? `the real ${body}’s mass`
		: `${(100 * ratio).toFixed(ratio >= 0.95 ? 1 : 0)}% of the real ${body}’s`;

/** A number as text that will not break across lines: "5.93 × 10²⁴". */
function sciText(x: number): string {
	const e = Math.floor(Math.log10(Math.abs(x)));
	const sup = String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
	return `${(x / 10 ** e).toFixed(2)}\u00a0×\u00a010${sup}`;
}

const kg = (m: number) => `${sciText(m)}\u00a0kg`;

const altitude = (toward: Vec3) => {
	const deg = (Math.asin(toward[1]) * 180) / Math.PI;
	return `${Math.abs(deg).toFixed(0)}° ${deg < 0 ? 'below' : 'above'} the horizon`;
};

/**
 * The reading on the ground of the scene's Earth: the planet underfoot (a point just outside a layered sphere, so
 * 2 G M / R^3 along the vertical), the Moon and the Sun, each where the scene has it at this hour.
 * `pole` is the unit vector along the Earth's axis in the scene's axes (+y up, -z north, +x east).
 */
export function earthReading(objects: AnalyzedObject[], at: Vec3, pole: Vec3): Reading {
	const index = new Map(objects.map((o, i) => [o.id, i]));
	const pick = (ids: string[]) => ids.map((id) => index.get(id)!).filter((i) => i !== undefined);
	const earth = layeredBody(objects, EARTH_IDS);
	const moon = layeredBody(objects, ['moon', 'moon-core']);
	const sun = layeredBody(objects, ['sun', 'sun-core']);
	const toMoon = towardGroup(objects, pick(['moon']), at)!;
	const toSun = towardGroup(objects, pick(['sun']), at)!;
	const eMoon = groupTide(objects, pick(['moon', 'moon-core']), at);
	const eSun = groupTide(objects, pick(['sun', 'sun-core']), at);
	const ratio = size3(eMoon) / size3(eSun);
	const sources: Source[] = [
		{
			label: 'the Earth underfoot',
			E: groupTide(objects, pick(EARTH_IDS), at),
			B: turningPlanetMagnetic(earth, objects[index.get('earth')!].center, pole, EARTH_SPIN, at),
			note: `the scene’s Earth, ${kg(earth.mass)}: ${against(earth.mass / REAL_MASS.earth, 'Earth')}`
		},
		{
			label: 'the Moon',
			E: eMoon,
			toward: toMoon,
			note: `${altitude(toMoon)}; ${kg(moon.mass)}, ${against(moon.mass / REAL_MASS.moon, 'Moon')}`
		},
		{
			label: 'the Sun',
			E: eSun,
			toward: toSun,
			note: `${altitude(toSun)}; ${kg(sun.mass)}, ${against(sun.mass / REAL_MASS.sun, 'Sun')}`
		}
	];
	const reading: Reading = {
		sources,
		landmarks: [
			{
				along: 'up-down',
				from: 'the vertical',
				dir: [0, 1, 0],
				across: 'every horizontal direction',
				frame: true
			},
			{ along: 'east-west', from: 'the east-west line', dir: [1, 0, 0], frame: true },
			{ along: 'north-south', from: 'the north-south line', dir: [0, 0, 1], frame: true },
			{ along: 'toward the Moon', from: 'the line to the Moon', dir: toMoon },
			{ along: 'toward the Sun', from: 'the line to the Sun', dir: toSun }
		],
		rings: [],
		notes: [
			ONE_PIXEL,
			`The Moon’s and the Sun’s parts are the tide that raises the oceans. Here the Moon’s is ${ratio.toFixed(1)} times the Sun’s.`,
			'The magnetic part is the Earth’s alone: the planet turns beneath a camera that the ground carries along, at latitude 40°. At the equator it would be 4.8 × 10⁻¹² s⁻². Those of the Moon and the Sun are not computed.',
			'The camera is taken not to turn with the ground: a frame turning once a day would add a false tide of 5 × 10⁻⁹ s⁻².'
		]
	};
	reading.rings = [
		{ label: 'All of it', E: total(reading) },
		{ label: 'The Moon and the Sun alone', E: add3(eMoon, eSun) }
	];
	return reading;
}

// --- which way it turns --------------------------------------------------------------------------------------------------

interface PreparedPair {
	label: string;
	rotor: Rotor;
	members: number[];
	q: ComplexMat3;
	/** The average over a turn of Newton's field of the pair. */
	steady: Mat3;
	/** The most the turning part and the wave part reach over a turn, s^-2. */
	turningMost: number;
	waveMost: number;
}

export interface PreparedDrums {
	name: string;
	objects: AnalyzedObject[];
	at: Vec3;
	immersed: Set<number>;
	pairs: PreparedPair[];
	/** The most the turning parts, and the wave parts, of all the pairs together reach over a turn, s^-2. */
	turningMost: number;
	waveMost: number;
}

/** Newton's field of a rotor's spheres where they are at time t: each its mass over the air's, as a point. */
function pairNewton(objects: AnalyzedObject[], members: number[], at: Vec3, t: number): Mat3 {
	const now = spunAt(objects, t);
	return add3(...members.map((i) => excessTide(now, i, at)));
}

/** The exact field of a turning pair at time t, to the quadrupole in what light's delay changes. */
function pairParts(objects: AnalyzedObject[], p: PreparedPair, at: Vec3, t: number) {
	const x = at.map((v, k) => v - p.rotor.center[k]) as Vec3;
	const w = 2 * p.rotor.omega;
	const terms = quadrupoleTerms(p.q, w, x, t);
	const newton = pairNewton(objects, p.members, at, t);
	// what the delay of light adds to Newton's quadrupole: every term of the closed form, less its limit without delay
	const delay = add3(...terms, scale3(newtonQuadrupole(p.q, w, x, t), -1));
	return {
		field: add3(newton, delay),
		turning: add3(newton, scale3(p.steady, -1), delay),
		wave: terms[4]
	};
}

const TURN_SAMPLES = 48;

/** What does not change through a turn, worked out once: the rotors, their steady fields and their largest parts. */
export function prepareDrums(name: string, objects: AnalyzedObject[], at: Vec3): PreparedDrums {
	const index = new Map(objects.map((o, i) => [o.id, i]));
	const found = rotors(objects);
	const immersed = new Set<number>();
	objects.forEach((o, i) => {
		if (o.spin && !o.half && o.parent >= 0) immersed.add(i);
	});
	const pairs: PreparedPair[] = found.map((rotor) => {
		const members = rotor.members.map((id) => index.get(id)!);
		const period = (2 * Math.PI) / rotor.omega;
		const q = rotorQuadrupole(objects, rotor);
		let steady = zero3();
		for (let k = 0; k < 16; k++)
			steady = add3(steady, scale3(pairNewton(objects, members, at, (k * period) / 16), 1 / 16));
		// as the camera sees it: anticlockwise if the angular velocity points toward the camera
		const toCamera = at.reduce((sum, v, k) => sum + (v - rotor.center[k]) * rotor.axis[k], 0);
		const sense = toCamera >= 0 ? 'anticlockwise' : 'clockwise';
		const pair: PreparedPair = {
			label: `the pair turning ${sense}`,
			rotor,
			members,
			q,
			steady,
			turningMost: 0,
			waveMost: 0
		};
		for (let k = 0; k < TURN_SAMPLES; k++) {
			const parts = pairParts(objects, pair, at, (k * period) / TURN_SAMPLES);
			pair.turningMost = Math.max(pair.turningMost, size3(parts.turning));
			pair.waveMost = Math.max(pair.waveMost, size3(parts.wave));
		}
		return pair;
	});
	let turningMost = 0;
	let waveMost = 0;
	if (pairs.length) {
		const period = (2 * Math.PI) / Math.min(...pairs.map((p) => p.rotor.omega));
		for (let k = 0; k < TURN_SAMPLES; k++) {
			const parts = pairs.map((p) => pairParts(objects, p, at, (k * period) / TURN_SAMPLES));
			turningMost = Math.max(turningMost, size3(add3(...parts.map((q) => q.turning))));
			waveMost = Math.max(waveMost, size3(add3(...parts.map((q) => q.wave))));
		}
	}
	return { name, objects, at, immersed, pairs, turningMost, waveMost };
}

/**
 * The reading in front of the drums at time t (s), at the true speed of light: the steady tide of everything in the
 * room, the part of the turning pairs' field that changes twice each turn, and the wave part, which is the term of
 * the same exact field that falls only as the inverse of the distance.
 */
export function drumsReading(prepared: PreparedDrums, t: number, subtractRoom = false): Reading {
	const { name, objects, at, immersed, pairs } = prepared;
	const sources = roomSources(name, objects, at, subtractRoom, immersed);
	const now = spunAt(objects, t);
	let turningNow = zero3();
	let waveNow = zero3();
	for (const p of pairs) {
		const parts = pairParts(objects, p, at, t);
		turningNow = add3(turningNow, parts.turning);
		waveNow = add3(waveNow, parts.wave);
		const moving = p.members
			.map((i) => ownMagnetic(now, i, at))
			.filter((b): b is Mat3 => b !== undefined);
		sources.push({
			label: p.label,
			E: parts.field,
			B: moving.length ? add3(...moving) : undefined,
			toward: towardGroup(objects, p.members, at),
			note: `turning part at most ${tidalText(p.turningMost)}; wave part ${tidalText(p.waveMost)}`
		});
	}
	const reading: Reading = {
		sources,
		landmarks: [
			...ROOM_AXES,
			...sources.filter((s) => s.toward).map((s) => landmarkTo(s.label, s.toward!))
		],
		rings: [],
		notes: [
			ONE_PIXEL,
			'Computed at the true speed of light, whatever the teaching slider is set to, and shown at the pairs’ true rate: one turn a second.',
			'The wave part is the term of the pairs’ exact field that falls as the inverse of the distance. No drawing could show it beside the rest.',
			'The magnetic part is computed to first order in the speed of the balls over that of light.'
		]
	};
	const all = total(reading);
	const steadyAll = add3(all, scale3(turningNow, -1));
	reading.rings = [
		{
			label: subtractRoom ? 'With the empty room taken away' : 'All of it',
			E: all,
			scale: size3(steadyAll)
		},
		{ label: 'What turns, alone', E: turningNow, scale: prepared.turningMost, most: true }
	];
	reading.parts = [
		{ label: 'Steady: the average over a turn', now: size3(steadyAll) },
		{
			label: 'Turning: it changes twice each turn',
			now: size3(turningNow),
			most: prepared.turningMost
		},
		{
			label: 'Wave',
			now: size3(waveNow),
			most: prepared.waveMost
		}
	];
	return reading;
}

/** A tide as text, "1.72 × 10⁻¹³ s⁻²" (for notes built here; the panel formats its own numbers). */
const tidalText = (x: number) => (x === 0 ? '0\u00a0s⁻²' : `${sciText(x)}\u00a0s⁻²`);

// --- a black hole ------------------------------------------------------------------------------------------------------

/** The Sun's mass, kg (reference/gravcam/constants.py). */
export const SUN_MASS = 1.98847e30;

/**
 * G M / r^3 at r = `distance` G M / c^2 from a hole of `suns` solar masses: c^6 / (G^2 M^2 distance^3), s^-2. A camera
 * at rest there reads exactly -2 of this along the line to the hole and +1 across it (the Schwarzschild metric in
 * the frame of an observer at rest, with r the radius that gives a sphere its area 4 pi r^2).
 */
export function holeTide(suns: number, distance: number): number {
	const m = suns * SUN_MASS;
	return C ** 6 / (G * G * m * m * distance ** 3);
}

/** The masses the demo quotes its distances for: a hole of ten Suns, and the one at the Galaxy's centre. */
export const HOLE_SUNS = { stellar: 10, centre: 4.3e6 };

/** The reading of a camera at rest `distance` G M / c^2 from a hole, which lies toward `direction`. */
export function holeReading(direction: Vec3, distance: number): Reading {
	const tensor = (suns: number): Mat3 => {
		const k = holeTide(suns, distance);
		return [0, 1, 2].map((i) =>
			[0, 1, 2].map((j) => k * ((i === j ? 1 : 0) - 3 * direction[i] * direction[j]))
		);
	};
	const E = tensor(HOLE_SUNS.stellar);
	const metres = (distance * G * HOLE_SUNS.stellar * SUN_MASS) / (C * C);
	return {
		sources: [
			{
				label: 'the hole, of ten Suns',
				E,
				toward: direction,
				note: `${kg(HOLE_SUNS.stellar * SUN_MASS)}, ${Math.round(metres / 1000).toLocaleString('en-US')} km away`
			}
		],
		landmarks: [{ along: 'toward the hole', from: 'the line to the hole', dir: direction }],
		rings: [{ label: 'The hole of ten Suns', E }],
		notes: [
			ONE_PIXEL,
			`Beside the hole at the Galaxy’s centre, of 4.3 million Suns, the same number of GM/c² away: ${tidalText(2 * holeTide(HOLE_SUNS.centre, distance))} along the line to it. At a fixed number of GM/c² the tide falls as the inverse square of the mass.`,
			'It grows as the inverse cube of the distance: eight times at half the distance. Exact for a camera held at rest; a hole that does not turn has no magnetic part there.'
		]
	};
}

// --- the Milky Way -----------------------------------------------------------------------------------------------------

/**
 * The tide of the Galaxy's stars at the Sun, s^-2, as [xx, yy, zz, xz] in galactic axes (x toward the centre, y the
 * way the Galaxy turns, z north; xy and yz vanish by symmetry), one entry for each part of the model of the picture
 * (reference/gravcam/galaxy.py: THIN, THICK and BULGE, the Sun 8.2 kpc out and 0.02 kpc above the plane).
 *
 * The site has no port of the model's potential, so these were computed once in Python from the reference's density,
 * galaxy._disc and galaxy._bulge (their sum is galaxy.stellar_density), as
 *   E_ij = (4 pi G rho_Sun / 3) delta_ij + G * integral dOmega (delta_ij - 3 n_i n_j) * integral rho ds / s
 * over directions n from the Sun and distances s along them (Gauss-Legendre panels, refined until seven figures
 * held), and checked two ways: E_yy against g_x / R with g_x from galaxy.sky's own column, to 2 parts in 10^8, and
 * E_zz against differences of g_z, to 2 parts in 10^9. tide-demos.spec.ts pins them, and repeats the first check.
 */
export const GALAXY_TIDE: Record<string, [number, number, number, number]> = {
	'the thin disc': [-4.418739e-31, 3.027944e-31, 3.252389e-30, 2.454051e-32],
	'the thick disc': [-8.70899e-32, 5.218535e-32, 1.569337e-31, 1.294073e-33],
	'the bulge': [-2.534293e-31, 1.247496e-31, 1.287138e-31, 9.734413e-34]
};

/** The reading of a camera at the Sun, from the stars of the Galaxy's model. */
export function galaxyReading(): Reading {
	const sources: Source[] = Object.entries(GALAXY_TIDE).map(([label, [xx, yy, zz, xz]]) => ({
		label,
		E: [
			[xx, 0, xz],
			[0, yy, 0],
			[xz, 0, zz]
		]
	}));
	const reading: Reading = {
		sources,
		landmarks: [
			{
				along: 'toward the Galaxy’s centre',
				from: 'the line to the Galaxy’s centre',
				dir: [1, 0, 0],
				frame: true
			},
			{
				along: 'along the Sun’s orbit',
				from: 'the direction of the Sun’s orbit',
				dir: [0, 1, 0],
				frame: true
			},
			{
				along: 'through the disc',
				from: 'the line through the disc',
				dir: [0, 0, 1],
				across: 'every direction in the disc',
				frame: true
			}
		],
		rings: [],
		notes: [
			ONE_PIXEL,
			'Only the stars of the model behind the picture are counted: two discs and a bulge. The real Galaxy’s gas and dark matter would add to it.',
			'The Sun is inside the disc, so the three values do not add up to zero: their sum is 4πG times the density of stars there.',
			'Computed once from the model’s density and kept as constants. The waves of the picture are not in it: this is the steady pull of the Galaxy’s mass.'
		]
	};
	reading.rings = [{ label: 'All of it', E: total(reading) }];
	// north up, as in the picture
	reading.upright = [0, 0, 1];
	return reading;
}
