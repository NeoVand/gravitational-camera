/**
 * Chapter 8.4's Majorana stars: a spin two (a reading 𝒲 = E + iB) or, by a switch, a spin one (light's F = E + icB)
 * drawn as its four or two stars on a sphere that the reader turns, with the Bloch vector b of any one of its spins one
 * half, b = P/u for a reading, and its components c_m with their phases. The state is built from the stars by the
 * symmetric product (../../engine/majorana.ts); the presets are readings and fields, whose stars the engine finds as
 * the roots of Majorana's polynomial. A click on the sphere chooses a direction n̂, and the figure reads the overlap
 * |⟨n̂|ψ⟩|² with the coherent state there.
 *
 * Settings, the view, snapping, the keys, the words and the three predictions are pure functions here; the component
 * only draws them.
 */
import {
	angleBetween,
	blochLength,
	bloch,
	coherent,
	componentsOfTable,
	componentsOfVector,
	fromStars,
	overlap,
	reading,
	starsOf,
	type Complex,
	type CVec3,
	type Vec3
} from '../../engine/majorana';

export type { Vec3 };

// --- places on the sphere -----------------------------------------------------------------------------------------

/** A direction as its polar angle ϑ from ẑ, 0 to 180, and its azimuth φ, −180 to 180 (degrees). */
export interface Place {
	theta: number;
	phi: number;
}

const RAD = Math.PI / 180;

/** n̂ = (sin ϑ cos φ, sin ϑ sin φ, cos ϑ), exact at the poles. */
export function vecOf(p: Place): Vec3 {
	if (p.theta <= 0) return [0, 0, 1];
	if (p.theta >= 180) return [0, 0, -1];
	const t = p.theta * RAD;
	const f = p.phi * RAD;
	return [Math.sin(t) * Math.cos(f), Math.sin(t) * Math.sin(f), Math.cos(t)];
}

/** A number kept to a millionth, so that 119.9999999 reads and steps as 120. */
const tidy = (x: number) => Math.round(x * 1e6) / 1e6 || 0;

/** An azimuth in (−180, 180]. */
export function wrapPhi(phi: number): number {
	let f = ((((phi + 180) % 360) + 360) % 360) - 180;
	if (f === -180) f = 180;
	return tidy(f);
}

/** The place of a direction; at a pole the azimuth `keep` is kept. */
export function placeOf(n: Vec3, keep = 0): Place {
	const r = Math.hypot(n[0], n[1], n[2]);
	const theta = tidy(Math.atan2(Math.hypot(n[0], n[1]), n[2] / r) / RAD);
	if (theta === 0 || theta === 180) return { theta, phi: wrapPhi(keep) };
	return { theta, phi: wrapPhi(Math.atan2(n[1], n[0]) / RAD) };
}

/** The angle between two places, degrees. */
export const apart = (a: Place, b: Place) => angleBetween(vecOf(a), vecOf(b)) / RAD;

// --- the presets ----------------------------------------------------------------------------------------------------

export type Kind = 'wave' | 'body' | 'body-wave' | 'two-bodies';

export const KINDS: Kind[] = ['wave', 'body', 'body-wave', 'two-bodies'];

const ZERO3 = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

/** A body on the axis `axis` with the tide w: w(1 − 3 ê êᵀ), which is w diag(1, 1, −2) for ẑ. */
function bodyTide(axis: 0 | 1 | 2, w: number): number[][] {
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? w * (1 - (i === axis ? 3 : 0)) : 0)));
}

const addTables = (a: number[][], b: number[][]) => a.map((r, i) => r.map((x, j) => x + b[i][j]));

/** The second body of the preset with two: on the y axis, with this share of the first one's tide. */
export const SECOND = 0.6;

/**
 * The reading of each preset, with the body of tide w = 1 on the z axis and the wave along +ẑ with the tide E₊ = w:
 * E = diag(E₊, −E₊, 0) and B = E₊(x̂ŷᵀ + ŷx̂ᵀ). Two bodies: the second on the y axis with SECOND of the tide, so that the stars lie in the x, z plane.
 */
export function presetReading(kind: Kind) {
	const waveE = [
		[1, 0, 0],
		[0, -1, 0],
		[0, 0, 0]
	];
	const waveB = [
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 0]
	];
	switch (kind) {
		case 'wave':
			return reading(waveE, waveB);
		case 'body':
			return reading(bodyTide(2, 1), ZERO3);
		case 'body-wave':
			return reading(addTables(bodyTide(2, 1), waveE), waveB);
		case 'two-bodies':
			return reading(addTables(bodyTide(2, 1), bodyTide(1, SECOND)), ZERO3);
	}
}

/**
 * Light's F = E + icB for each preset: a wave along +ẑ, F = E₀(x̂ + iŷ); a charge on the z axis, whose field at the
 * point is along ẑ; both, with |E| equal; two charges at rest, the second's field at the point along x̂ with SECOND of the first's, so that the pair lies in
 * the x, z plane.
 */
export function presetField(kind: Kind): CVec3 {
	const c = (re: number, im = 0): Complex => ({ re, im });
	switch (kind) {
		case 'wave':
			return [c(1), c(0, 1), c(0)];
		case 'body':
			return [c(0), c(0), c(1)];
		case 'body-wave':
			return [c(1), c(0, 1), c(1)];
		case 'two-bodies':
			return [c(SECOND), c(0), c(1)];
	}
}

/** The stars of a preset, found by the engine as the roots of Majorana's polynomial, as places. */
export function presetStars(kind: Kind, light: boolean): Place[] {
	const c = light ? componentsOfVector(presetField(kind)) : componentsOfTable(presetReading(kind));
	return starsOf(c).all.map((n) => placeOf(n));
}

/** The figure opens on a body with a wave, the reading's four stars, and n̂ at ϑ = 60°, φ = 90°. */
export const OPENING = {
	kind: 'body-wave' as Kind,
	light: false,
	probe: { theta: 60, phi: 90 } as Place,
	view: { az: -82, el: 14 }
};

// --- the state and its numbers ----------------------------------------------------------------------------------------

/** The state of the stars, its components lowest m first, scaled to length one. */
export const stateOf = (stars: Place[]): Complex[] => fromStars(stars.map(vecOf));

/**
 * The components with their overall phase chosen so that the largest is real and positive, as the bars draw them; an
 * overall phase has no effect.
 */
export function gauged(c: Complex[]): Complex[] {
	let big = 0;
	c.forEach((x, k) => {
		if (Math.hypot(x.re, x.im) > Math.hypot(c[big].re, c[big].im) + 1e-12) big = k;
	});
	const r = Math.hypot(c[big].re, c[big].im);
	const u = { re: c[big].re / r, im: -c[big].im / r };
	return c.map((x) => {
		const re = x.re * u.re - x.im * u.im;
		const im = x.re * u.im + x.im * u.re;
		return { re: Math.abs(re) < 1e-14 ? 0 : re, im: Math.abs(im) < 1e-14 ? 0 : im };
	});
}

/** What the figure reads from its stars. */
export interface Reading {
	/** The components c_m, gauged, lowest m first. */
	c: Complex[];
	/** |c_m| and arg c_m (radians, undefined where c_m is negligible). */
	bars: { m: number; size: number; phase: number | undefined }[];
	/** One spin's Bloch vector b (= P/u for a reading) and its length. */
	b: Vec3;
	length: number;
	/** |⟨n̂|ψ⟩|² with the coherent state at the probe n̂. */
	overlap: number;
}

/** The smallest |c_m| whose phase is drawn. */
export const PHASE_FLOOR = 0.005;

export function readingOf(stars: Place[], probe: Place): Reading {
	const raw = stateOf(stars);
	const c = gauged(raw);
	const N = stars.length;
	const s = N / 2;
	const b = bloch(raw).map((x) => (Math.abs(x) < 1e-13 ? 0 : x)) as Vec3;
	return {
		c,
		bars: c.map((x, k) => {
			const size = Math.hypot(x.re, x.im);
			return {
				m: k - s,
				size,
				phase: size < PHASE_FLOOR ? undefined : Math.atan2(x.im, x.re)
			};
		}),
		b,
		length: blochLength(raw) < 1e-13 ? 0 : blochLength(raw),
		overlap: overlap(coherent(vecOf(probe), N), raw)
	};
}

// --- the view -------------------------------------------------------------------------------------------------------

/** The sphere seen from the azimuth `az` and the elevation `el`, degrees: ẑ up when `el` is 0. */
export interface View {
	az: number;
	el: number;
}

/** The highest and lowest elevation the sphere is turned to. */
export const EL_LIMIT = 80;

/** The screen's right, up and toward-the-viewer directions in the sphere's axes. */
export function basis(v: View): { right: Vec3; up: Vec3; toward: Vec3 } {
	const a = v.az * RAD;
	const e = v.el * RAD;
	return {
		right: [-Math.sin(a), Math.cos(a), 0],
		up: [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)],
		toward: [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)]
	};
}

const dot3 = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** A point of the sphere's space on the screen, `R` drawing units to one, y down; `z` > 0 is in front. */
export function screenOf(v: View, n: Vec3, R: number) {
	const { right, up, toward } = basis(v);
	return { x: R * dot3(n, right), y: -R * dot3(n, up), z: dot3(n, toward) };
}

/**
 * The direction on the sphere under a point of the screen, (x, y) in units of the radius with y down, on the half
 * `front` (toward the viewer) or the half behind; outside the disc, the nearest point of its rim.
 */
export function directionAt(v: View, x: number, y: number, front = true): Vec3 {
	const { right, up, toward } = basis(v);
	let qx = x;
	let qy = -y;
	const r2 = qx * qx + qy * qy;
	let qz = 0;
	if (r2 <= 1) qz = (front ? 1 : -1) * Math.sqrt(1 - r2);
	else {
		const r = Math.sqrt(r2);
		qx /= r;
		qy /= r;
	}
	return [0, 1, 2].map((i) => qx * right[i] + qy * up[i] + qz * toward[i]) as Vec3;
}

/** A great circle as two paths on the screen, the half in front and the half behind. */
export function greatCircle(v: View, normal: Vec3, R: number, cx = 0, cy = 0) {
	const r = Math.hypot(...normal);
	const n = normal.map((x) => x / r) as Vec3;
	const a: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
	const k = dot3(a, n);
	const u0 = [a[0] - k * n[0], a[1] - k * n[1], a[2] - k * n[2]];
	const ul = Math.hypot(...u0);
	const u = u0.map((x) => x / ul) as Vec3;
	const w: Vec3 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
	let front = '';
	let back = '';
	let prev: boolean | undefined;
	for (let i = 0; i <= 144; i++) {
		const t = (2 * Math.PI * i) / 144;
		const p = screenOf(v, [0, 1, 2].map((j) => Math.cos(t) * u[j] + Math.sin(t) * w[j]) as Vec3, R);
		const isFront = p.z >= 0;
		const cmd = prev === isFront ? 'L' : 'M';
		const pt = `${cmd}${(cx + p.x).toFixed(1)},${(cy + p.y).toFixed(1)}`;
		if (isFront) front += pt;
		else back += pt;
		prev = isFront;
	}
	return { front, back };
}

/** The view after the sphere is dragged by (dx, dy) drawing units on a sphere of radius R. */
export function turned(v: View, dx: number, dy: number, R: number): View {
	return {
		az: wrapPhi(v.az - (dx / R) * 57.3),
		el: Math.max(-EL_LIMIT, Math.min(EL_LIMIT, tidy(v.el + (dy / R) * 57.3)))
	};
}

/** The view after a key on the sphere: the arrows turn it by 5°, with Shift by 15°. */
export function viewStep(v: View, key: string, shift: boolean): View | undefined {
	const s = shift ? 15 : 5;
	switch (key) {
		case 'ArrowLeft':
			return { az: wrapPhi(v.az + s), el: v.el };
		case 'ArrowRight':
			return { az: wrapPhi(v.az - s), el: v.el };
		case 'ArrowUp':
			return { az: v.az, el: Math.min(EL_LIMIT, v.el + s) };
		case 'ArrowDown':
			return { az: v.az, el: Math.max(-EL_LIMIT, v.el - s) };
	}
	return undefined;
}

// --- moving a star ----------------------------------------------------------------------------------------------------

/** A dragged star comes to rest on another star, or on a pole, nearer than this (degrees). */
export const SNAP = 4;

/**
 * A dragged star's place: onto another star or a pole within SNAP, so that stars can be put together exactly, and
 * otherwise where it is.
 */
export function snapped(p: Place, others: Place[]): Place {
	let best: Place | undefined;
	let near = SNAP;
	for (const o of others) {
		const d = apart(p, o);
		if (d < near) {
			near = d;
			best = o;
		}
	}
	if (best) return { ...best };
	if (p.theta < SNAP) return { theta: 0, phi: p.phi };
	if (p.theta > 180 - SNAP) return { theta: 180, phi: p.phi };
	return p;
}

/** The keys' steps: 5°, with Shift 15°, onto the grid of that step. */
export const KEY_STEP = 5;
export const KEY_LARGE = 15;

/** One step of `size` from v in the direction dir, onto the grid of that size. */
function gridStep(v: number, dir: 1 | -1, size: number) {
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	return tidy(k * size);
}

/**
 * A star (or n̂) after a key: Up and Down move it along its meridian toward ẑ or away, Left and Right turn it about ẑ,
 * Home and End take it to the poles. Undefined for any other key.
 */
export function placeStep(p: Place, key: string, shift: boolean): Place | undefined {
	const size = shift ? KEY_LARGE : KEY_STEP;
	switch (key) {
		case 'ArrowUp':
			return { theta: Math.max(0, gridStep(p.theta, -1, size)), phi: p.phi };
		case 'ArrowDown':
			return { theta: Math.min(180, gridStep(p.theta, 1, size)), phi: p.phi };
		case 'ArrowLeft':
			return { theta: p.theta, phi: wrapPhi(gridStep(p.phi, -1, size)) };
		case 'ArrowRight':
			return { theta: p.theta, phi: wrapPhi(gridStep(p.phi, 1, size)) };
		case 'Home':
			return { theta: 0, phi: p.phi };
		case 'End':
			return { theta: 180, phi: p.phi };
	}
	return undefined;
}

/** Stars nearer than this (degrees) are drawn as touching dots, and counted together. */
export const TOGETHER = 0.5;

/** The stars gathered into groups that sit together, each with the indices of its members. */
export function groupsOf(stars: Place[]): number[][] {
	const groups: number[][] = [];
	stars.forEach((s, i) => {
		const g = groups.find((members) => apart(stars[members[0]], s) < TOGETHER);
		if (g) g.push(i);
		else groups.push([i]);
	});
	return groups;
}

// --- the predictions --------------------------------------------------------------------------------------------------

/** What the predictions look at: whether light is shown, and the reading's four stars. */
export interface Scene {
	light: boolean;
	stars: Place[];
}

/** The first, once all four of the reading's stars sit together. */
export const noteFirst = (done: boolean, s: Scene) =>
	done || (!s.light && s.stars.length === 4 && groupsOf(s.stars).length === 1);

/** The two ways of pairing four stars that differ from the first, and the first: (01)(23), (02)(13), (03)(12). */
const PAIRINGS = [
	[
		[0, 1],
		[2, 3]
	],
	[
		[0, 2],
		[1, 3]
	],
	[
		[0, 3],
		[1, 2]
	]
];

/** Two pairs of the reading's stars, each pair together, at opposite points: two at each pole, or anywhere else. */
export function twoOppositePairs(stars: Place[]): boolean {
	if (stars.length !== 4) return false;
	return PAIRINGS.some(
		([[a, b], [c, d]]) =>
			apart(stars[a], stars[b]) < TOGETHER &&
			apart(stars[c], stars[d]) < TOGETHER &&
			apart(stars[a], stars[c]) > 180 - TOGETHER
	);
}

/** The second, once two stars sit at each pole (or at any two opposite points). */
export const noteSecond = (done: boolean, s: Scene) =>
	done || (!s.light && twoOppositePairs(s.stars));

/**
 * How far the lone star must be from the other three for the third (degrees). The arrow shortens only slowly, by
 * 1 − |b|² = 3 sin⁴(α/2)/4(1 + 3cos²(α/2))² at the angle α (`loneLength`), so that its readout leaves 1.00 only past
 * about 72°; at 90° it reads 0.98.
 */
export const AWAY = 90;

/** |b| for three stars together and the fourth at the angle α from them (degrees). */
export function loneLength(alpha: number): number {
	const s2 = Math.sin((alpha * RAD) / 2) ** 2;
	const c2 = 1 - s2;
	return Math.sqrt(1 - (3 * s2 * s2) / (4 * (1 + 3 * c2) ** 2));
}

/** Three of the reading's stars together and the fourth at least AWAY from them. */
export function oneAway(stars: Place[]): boolean {
	if (stars.length !== 4) return false;
	return stars.some((lone, i) => {
		const rest = stars.filter((_, j) => j !== i);
		return groupsOf(rest).length === 1 && apart(lone, rest[0]) >= AWAY;
	});
}

/** The third, once one of the four stars has been moved away from the other three. */
export const noteThird = (done: boolean, s: Scene) => done || (!s.light && oneAway(s.stars));

// --- the words ------------------------------------------------------------------------------------------------------

/** A number to the given decimals, with a true minus sign and no "−0.00". */
export function fixed(x: number, places = 2): string {
	const f = 10 ** places;
	const r = Math.round(x * f) / f;
	if (r === 0) return (0).toFixed(places);
	return r.toFixed(places).replace('-', '−');
}

/** An angle in whole degrees, or to a tenth where it is not whole. */
export function degrees(x: number): string {
	const r = Math.round(x * 10) / 10;
	const s = Number.isInteger(r) ? r.toFixed(0) : r.toFixed(1);
	return (r === 0 ? '0' : s).replace('-', '−') + '°';
}

/** A place in words: "the north pole", "ϑ = 120°, φ = 0°". */
export function placeWords(p: Place): string {
	if (p.theta === 0) return 'the north pole, +ẑ';
	if (p.theta === 180) return 'the south pole, −ẑ';
	return `ϑ = ${degrees(p.theta)}, φ = ${degrees(p.phi)}`;
}

/** The stars in words, those that sit together counted together. */
export function starsWords(stars: Place[]): string {
	return groupsOf(stars)
		.map((g) => {
			const where = placeWords(stars[g[0]]);
			return g.length === 1
				? `one at ${where}`
				: `${['', 'one', 'two', 'three', 'four'][g.length]} together at ${where}`;
		})
		.join('; ');
}

/** b in words, its components to two decimals. */
export const vecWords = (b: Vec3) => `(${b.map((x) => fixed(x)).join(', ')})`;

/** m as written under a bar: "−2", "0", "+1". */
export const mWords = (m: number) => (m === 0 ? '0' : m > 0 ? `+${m}` : `−${-m}`);
