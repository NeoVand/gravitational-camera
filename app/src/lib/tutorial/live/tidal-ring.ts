/**
 * The tide of chapter 1.4's ring: twelve free balls at the origin, beside one or two point masses in the ring's
 * plane. Everything is Newtonian and in SI units. The tidal tensor at the ring's centre is
 *
 *   E_ij = Σ G M (δ_ij − 3 n_i n_j) / r³,
 *
 * n̂ the unit vector from the centre toward a mass and r its distance, and a ball displaced by ξ from the centre
 * accelerates relative to it by ξ̈ = −E ξ (the tide is evaluated at the centre, as for a ring much smaller than
 * the distance to the masses). A negative principal value is a stretch, a positive one a squeeze.
 */

/** Newton's constant, m³ kg⁻¹ s⁻² (CODATA 2018). */
export const G = 6.6743e-11;

/** One eötvös, the unit of a tide: 10⁻⁹ s⁻². */
export const EOTVOS = 1e-9;

/** The chapter's person: 70 kg. */
export const PERSON = 70;

/** A point mass in the ring's plane: its position relative to the ring's centre, m, and its mass, kg. */
export interface Body {
	x: number;
	y: number;
	mass: number;
}

/** The tidal tensor at the centre, s⁻²: its part in the ring's plane, and the part across it. */
export interface Tide {
	xx: number;
	xy: number;
	yy: number;
	/** E_zz, across the plane of the ring: the masses lie in the plane, so n_z = 0. */
	zz: number;
}

export function tide(bodies: Body[]): Tide {
	const t: Tide = { xx: 0, xy: 0, yy: 0, zz: 0 };
	for (const b of bodies) {
		const r = Math.hypot(b.x, b.y);
		if (r === 0) continue;
		const nx = b.x / r;
		const ny = b.y / r;
		const k = (G * b.mass) / r ** 3;
		t.xx += k * (1 - 3 * nx * nx);
		t.xy += k * -3 * nx * ny;
		t.yy += k * (1 - 3 * ny * ny);
		t.zz += k;
	}
	return t;
}

/** The pull of the masses at the centre, m s⁻²: g = Σ G M n̂ / r², toward them. */
export function pull(bodies: Body[]): { x: number; y: number } {
	let x = 0;
	let y = 0;
	for (const b of bodies) {
		const r = Math.hypot(b.x, b.y);
		if (r === 0) continue;
		const k = (G * b.mass) / r ** 3;
		x += k * b.x;
		y += k * b.y;
	}
	return { x, y };
}

/** A principal value of the tide in the ring's plane, s⁻², and its axis, a unit vector. */
export interface Principal {
	value: number;
	axis: { x: number; y: number };
}

/**
 * The two principal values in the ring's plane, the smaller (the stronger stretch) first, with their axes. The
 * axes are at right angles; each is given with x ≥ 0, so that it does not flip as a mass crosses the vertical.
 */
export function principal(t: Tide): [Principal, Principal] {
	const mean = (t.xx + t.yy) / 2;
	const half = Math.hypot((t.xx - t.yy) / 2, t.xy);
	// the angle of the axis of the smaller value: tan 2φ = 2 xy / (xx − yy), turned by a right angle
	const phi = 0.5 * Math.atan2(2 * t.xy, t.xx - t.yy) + Math.PI / 2;
	const tidy = (a: { x: number; y: number }) =>
		a.x < -1e-12 || (Math.abs(a.x) <= 1e-12 && a.y < 0) ? { x: -a.x, y: -a.y } : a;
	const first = tidy({ x: Math.cos(phi), y: Math.sin(phi) });
	const second = tidy({ x: -first.y, y: first.x });
	return [
		{ value: mean - half, axis: first },
		{ value: mean + half, axis: second }
	];
}

/** The relative acceleration of a ball at ξ from the centre, m s⁻²: −E ξ. */
export function acceleration(t: Tide, x: number, y: number): { x: number; y: number } {
	return { x: -(t.xx * x + t.xy * y), y: -(t.xy * x + t.yy * y) };
}

/** The ring's balls at rest, a unit circle: n of them, the first on the +x axis, counter-clockwise. */
export function ring(n = 12): { x: number; y: number }[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (2 * Math.PI * i) / n;
		return { x: Math.cos(a), y: Math.sin(a) };
	});
}

/**
 * How far a ball moves in the first second of free fall from rest, as a fraction of the ring's radius, for a tide
 * whose largest principal value (in size) is `largest`: ½ |λ| (1 s)². The drawing enlarges this by a factor.
 */
export const firstSecond = (largest: number) => Math.abs(largest) / 2;

/** The enlargement that draws the largest change of the ring as `drawn` of its radius. */
export const enlargement = (largest: number, drawn: number) =>
	largest === 0 ? 0 : drawn / firstSecond(largest);

/** The larger of the two in-plane principal values in size. */
export const strongestOf = (t: Tide) => {
	const [a, b] = principal(t);
	return Math.abs(a.value) >= Math.abs(b.value) ? a.value : b.value;
};

/**
 * The ratio of the two principal values in the plane, the stronger stretch to the other, scaled so that the
 * second is ±1: −2 : 1 beside one mass. Undefined when the second is too small for a ratio to mean anything.
 */
export function ratio(t: Tide): [number, number] | undefined {
	const [a, b] = principal(t);
	if (Math.abs(b.value) < 1e-3 * Math.abs(a.value) || b.value === 0) return undefined;
	return [a.value / Math.abs(b.value), Math.sign(b.value)];
}
