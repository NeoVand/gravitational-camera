/**
 * A ring of twelve free balls under a symmetric table T = [[a, b], [b, d]], the tidal table restricted to a plane.
 * A ball at ξ on the unit circle is moved by −T ξ: where ξ · (−T ξ) > 0 it moves outward, a stretch, and where it
 * is negative, inward, a squeeze. The table's principal axes are its eigenvectors, at right angles, and along each
 * the ball moves straight out or straight in, by −λ times its distance.
 */

/** A symmetric 2 × 2 table: a = T_xx, b = T_xy = T_yx, d = T_yy. */
export interface Table {
	a: number;
	b: number;
	d: number;
}

/** The table the figure opens on: diag(−2, 1), the tide beside one mass on the x axis. */
export const OPENING: Table = { a: -2, b: 0, d: 1 };

/** The sliders' range for each entry, and their step. */
export const LEAST = -2;
export const MOST = 2;
export const STEP = 0.05;

/** The largest |λ| any table on the sliders can have: a = d = ±2, b = ±2 give λ = ±4. */
export const LARGEST = Math.abs(MOST) + Math.abs(MOST);

/** How far the drawing moves the ring for each unit of −T ξ: the largest move is 0.3 of the radius. */
export const SCALE = 0.3 / LARGEST;

/** A principal value and its axis, a unit vector with x ≥ 0 (and y > 0 when x = 0). */
export interface Principal {
	value: number;
	axis: { x: number; y: number };
}

/** An axis turned to the right-hand side, so that it does not flip as the table changes (+ 0: never a −0). */
const tidy = (v: { x: number; y: number }) =>
	v.x < -1e-12 || (Math.abs(v.x) <= 1e-12 && v.y < 0)
		? { x: -v.x + 0, y: -v.y + 0 }
		: { x: v.x + 0, y: v.y + 0 };

/**
 * The two principal values, the smaller first, with their axes, in closed form: λ = m ∓ h, with m = (a + d)/2 and
 * h = √(((a − d)/2)² + b²). The first axis is a row of T − λ₁ turned by a right angle, (b, λ₁ − a) or
 * (λ₁ − d, b), whichever is the longer (the other may vanish); the second is at right angles to it. When h = 0
 * every direction is principal; the axes are then x and y.
 */
export function principal(t: Table): [Principal, Principal] {
	const m = (t.a + t.d) / 2;
	const h = Math.hypot((t.a - t.d) / 2, t.b);
	const low = m - h;
	const u = { x: t.b, y: low - t.a };
	const w = { x: low - t.d, y: t.b };
	const v = Math.hypot(u.x, u.y) >= Math.hypot(w.x, w.y) ? u : w;
	const size = Math.hypot(v.x, v.y);
	const first = tidy(h === 0 || size === 0 ? { x: 1, y: 0 } : { x: v.x / size, y: v.y / size });
	const second = tidy({ x: -first.y, y: first.x });
	return [
		{ value: m - h, axis: first },
		{ value: m + h, axis: second }
	];
}

/** The angle of an axis from the x axis, degrees, in (−90, 90]. */
export const degrees = (axis: { x: number; y: number }) =>
	(Math.atan2(axis.y, axis.x) * 180) / Math.PI;

/** Whether the two principal values are equal, so that every direction is principal. */
export const round = (t: Table) => Math.hypot((t.a - t.d) / 2, t.b) < 1e-9;

export const trace = (t: Table) => t.a + t.d;
export const determinant = (t: Table) => t.a * t.d - t.b * t.b;

/** T ξ. */
export const apply = (t: Table, x: number, y: number) => ({
	x: t.a * x + t.b * y,
	y: t.b * x + t.d * y
});

/** The move of a ball at ξ: −T ξ. */
export function move(t: Table, x: number, y: number) {
	const v = apply(t, x, y);
	return { x: -v.x, y: -v.y };
}

/** Where the drawing puts a ball at rest at ξ: ξ − s T ξ. */
export function displaced(t: Table, x: number, y: number, s = SCALE) {
	const v = apply(t, x, y);
	return { x: x - s * v.x, y: y - s * v.y };
}

export type Kind = 'stretch' | 'squeeze' | 'still';

/**
 * Whether a ball at ξ moves outward (a stretch), inward (a squeeze) or along the ring: the sign of ξ · (−T ξ),
 * counted as zero within a twentieth of the table's largest principal value in size.
 */
export function kind(t: Table, x: number, y: number): Kind {
	const v = move(t, x, y);
	const radial = v.x * x + v.y * y;
	const [p, q] = principal(t);
	const edge = 0.05 * Math.max(Math.abs(p.value), Math.abs(q.value)) * (x * x + y * y);
	if (radial > edge) return 'stretch';
	if (radial < -edge) return 'squeeze';
	return 'still';
}

/** The ring's balls at rest, a unit circle: n of them, the first on the +x axis, counter-clockwise. */
export function ring(n = 12): { x: number; y: number }[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (2 * Math.PI * i) / n;
		return { x: Math.cos(a), y: Math.sin(a) };
	});
}
