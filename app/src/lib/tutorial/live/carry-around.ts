/**
 * Chapter 7.2's arrow carried round a loop. On a sphere of radius a, with ϑ the angle from the North Pole and φ the
 * longitude, the loop is a spherical polygon of three or four corners whose sides are arcs of great circles. An
 * arrow tangent to the sphere is carried along each side without turning, by integrating
 *
 *   dv/dt = −(v · dn/dt) n
 *
 * on the unit sphere, with n the outward normal (the point itself): the arrow changes only by what keeps it tangent.
 * Fourth-order Runge–Kutta in steps of at most half a degree, with no renormalization, so that the arrow's length
 * coming home checks the integration. It comes home turned by the area enclosed divided by a², in radians: Girard's
 * excess, the sum of the corner angles less (n − 2)π. Seen from outside, a loop that runs anticlockwise round the
 * area turns the arrow anticlockwise, as δv^α = −R^α_βγδ v^β s^γ q^δ gives for a small loop first along s (south)
 * and then along q (east).
 *
 * On the flat sheet the corners are points of a plane, in metres, joined by straight segments, and the arrow is
 * carried in polar labels, its components v^r and v^θ integrated with
 *
 *   dv^r/ds = −Γ^r_θθ v^θ dθ/ds,   dv^θ/ds = −Γ^θ_rθ (v^r dθ/ds + v^θ dr/ds),
 *
 * where Γ^r_θθ = −r and Γ^θ_rθ = 1/r. The components change on the way, but the arrow comes home unturned. The polar
 * labels fail at the centre, so the loop keeps CLEAR away from it.
 */

export type Vec = [number, number, number];
export type Surface = 'sphere' | 'sheet';
/** A corner on the sphere, in whole degrees: ϑ from the North Pole, 0 to 180, and φ east, −179 to 180. */
export type SphereCorner = { th: number; ph: number };
/** A corner on the sheet, in metres, on a grid of tenths. */
export type SheetCorner = { x: number; y: number };
/** The view of the sphere: the longitude and the elevation above the equator of the direction toward the reader. */
export type View = { lon: number; el: number };

export const DEG = Math.PI / 180;

/** The opening loop: the octant, from the pole down the meridian of Greenwich, east along the equator, back up. */
export const OCTANT: SphereCorner[] = [
	{ th: 0, ph: 0 },
	{ th: 90, ph: 0 },
	{ th: 90, ph: 90 }
];
/** The sheet's opening loop: two radial segments, r from 1 m to 3 m, at θ = 0 and 90°, and two chords. */
export const SHEET_OPENING: SheetCorner[] = [
	{ x: 1, y: 0 },
	{ x: 3, y: 0 },
	{ x: 0, y: 3 },
	{ x: 0, y: 1 }
];
/** The pole tilted toward the reader by 35°, seen from above 45° E, the middle of the octant: steep enough that
 * the turn at the pole reads clearly, though the chapter's static diagram tilts it by 25°. */
export const VIEW_OPENING: View = { lon: 45, el: 35 };
export const ELEVATION = 85;

/** The integration's longest step on the sphere, in radians, and the spacing of the faint copies. */
export const SPHERE_STEP = 0.5 * DEG;
export const SPHERE_COPIES = 10 * DEG;
/** On the sheet: the copies' spacing, the half-width of the drawn plane and the clearance from the centre, m. */
export const SHEET_COPIES = 0.5;
export const SHEET_LIMIT = 3.5;
export const CLEAR = 0.3;
/** The snap of a dragged corner onto the pole and the equator, degrees. */
export const SNAP = 2;

// --- vectors ------------------------------------------------------------------------------------------------------
export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec, b: Vec): Vec => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
export const add = (a: Vec, b: Vec, k = 1): Vec => [
	a[0] + k * b[0],
	a[1] + k * b[1],
	a[2] + k * b[2]
];
export const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
export const norm = (a: Vec) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a: Vec): Vec => scale(a, 1 / norm(a));
/** The angle between two directions, robust near 0 and π. */
export const between = (a: Vec, b: Vec) => Math.atan2(norm(cross(a, b)), dot(a, b));
/** An angle brought into (−π, π]. */
export function wrap(x: number): number {
	const y = x - 2 * Math.PI * Math.floor((x + Math.PI) / (2 * Math.PI));
	return y === -Math.PI ? Math.PI : y;
}

/** The point of the unit sphere at a corner: x toward 0° on the equator, y toward 90° E, z the North Pole. */
export function point(c: SphereCorner): Vec {
	const t = c.th * DEG;
	const p = c.ph * DEG;
	return [Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t)];
}

/** The unit vector along the sphere from a toward b, tangent at a. */
export function toward(a: Vec, b: Vec): Vec {
	return unit(add(b, a, -dot(a, b)));
}

// --- the area -----------------------------------------------------------------------------------------------------
/** The corner angles on the left of the loop as it runs, each in [0, 2π). */
export function leftAngles(ps: Vec[]): number[] {
	const n = ps.length;
	return ps.map((b, i) => {
		const tA = toward(b, ps[(i + n - 1) % n]);
		const tC = toward(b, ps[(i + 1) % n]);
		const a = Math.atan2(dot(b, cross(tC, tA)), dot(tC, tA));
		return a < 0 ? a + 2 * Math.PI : a;
	});
}

/** Girard's excess, the area on the left of a simple loop over a²: the corner angles less (n − 2)π, in (0, 4π). */
export function girard(ps: Vec[]): number {
	return leftAngles(ps).reduce((s, a) => s + a, 0) - (ps.length - 2) * Math.PI;
}

/** The signed solid angle of the small triangle abc, positive when it runs anticlockwise seen from outside. */
export function triangle(a: Vec, b: Vec, c: Vec): number {
	return 2 * Math.atan2(dot(a, cross(b, c)), 1 + dot(a, b) + dot(b, c) + dot(c, a));
}

/** The signed area over a² as a fan of triangles from the first corner; a loop that crosses itself counts each
 * lobe with its sense. */
export function fan(ps: Vec[]): number {
	let s = 0;
	for (let i = 1; i < ps.length - 1; i++) s += triangle(ps[0], ps[i], ps[i + 1]);
	return s;
}

/** Whether the great-circle arcs ab and cd, each shorter than half a turn, meet. */
export function arcsCross(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
	const n1 = cross(a, b);
	const n2 = cross(c, d);
	const l = cross(n1, n2);
	if (norm(l) < 1e-12) return false;
	const on = (p: Vec, u: Vec, v: Vec, n: Vec) =>
		dot(cross(u, p), n) > 1e-12 && dot(cross(p, v), n) > 1e-12;
	return [unit(l), scale(unit(l), -1)].some((p) => on(p, a, b, n1) && on(p, c, d, n2));
}

/** Whether a loop of four corners crosses itself: its opposite sides meet. */
export function crosses(ps: Vec[]): boolean {
	if (ps.length < 4) return false;
	return arcsCross(ps[0], ps[1], ps[2], ps[3]) || arcsCross(ps[1], ps[2], ps[3], ps[0]);
}

/** The area enclosed over a², signed by the sense in which the loop runs round it, in (−2π, 2π]: Girard's excess
 * for the side on the left, or minus the other side's when that is the smaller. */
export function enclosed(ps: Vec[]): number {
	const g = crosses(ps) ? fan(ps) : girard(ps);
	const s = g - 4 * Math.PI * Math.round(g / (4 * Math.PI));
	return s <= -2 * Math.PI ? s + 4 * Math.PI : s;
}

// --- carrying the arrow on the sphere -------------------------------------------------------------------------------
export type SphereSample = { p: Vec; v: Vec; s: number };
export type SphereCarry = {
	samples: SphereSample[];
	/** The index of the sample at each corner, the last back at the first. */
	corners: number[];
	start: Vec;
	end: Vec;
	/** The angle from the starting arrow to the returning one about the outward normal, in (−π, π]. */
	measured: number;
	length: number;
};

/** Carries an arrow, by default the unit arrow along the first side, round the loop of unit vectors ps. */
export function carrySphere(ps: Vec[], start?: Vec, step = SPHERE_STEP): SphereCarry {
	const v0 = start ?? toward(ps[0], ps[1]);
	let v = v0;
	let s = 0;
	const samples: SphereSample[] = [{ p: ps[0], v, s }];
	const corners = [0];
	for (let i = 0; i < ps.length; i++) {
		const a = ps[i];
		const b = ps[(i + 1) % ps.length];
		const angle = between(a, b);
		if (angle > 1e-12) {
			// the great circle p(t) = a cos t + e sin t, with its unit tangent T(t), and dv/dt = −(v · T) p
			const e = toward(a, b);
			const at = (t: number): Vec => add(scale(a, Math.cos(t)), e, Math.sin(t));
			const tan = (t: number): Vec => add(scale(a, -Math.sin(t)), e, Math.cos(t));
			const f = (t: number, w: Vec): Vec => scale(at(t), -dot(w, tan(t)));
			const n = Math.max(1, Math.ceil(angle / step));
			const h = angle / n;
			for (let k = 0; k < n; k++) {
				const t = k * h;
				const k1 = f(t, v);
				const k2 = f(t + h / 2, add(v, k1, h / 2));
				const k3 = f(t + h / 2, add(v, k2, h / 2));
				const k4 = f(t + h, add(v, k3, h));
				v = add(v, add(add(k1, k4), add(k2, k3), 2), h / 6);
				s += h;
				samples.push({ p: k === n - 1 ? b : at(t + h), v, s });
			}
		}
		corners.push(samples.length - 1);
	}
	const n0 = ps[0];
	const measured = Math.atan2(dot(n0, cross(v0, v)), dot(v0, v));
	return { samples, corners, start: v0, end: v, measured, length: s };
}

export type SphereReading = {
	/** The turn, in degrees, taken nearest the area among the angles a whole turn apart. */
	turn: number;
	/** The area enclosed over a², in degrees, signed by the loop's sense. */
	area: number;
	difference: number;
	/** The area as a fraction of the sphere's 4πa². */
	fraction: number;
	crossed: boolean;
	carry: SphereCarry;
};

export function readSphere(corners: SphereCorner[]): SphereReading {
	const ps = corners.map(point);
	const carry = carrySphere(ps);
	const area = enclosed(ps);
	const difference = wrap(carry.measured - area);
	return {
		turn: (area + difference) / DEG,
		area: area / DEG,
		difference: difference / DEG,
		fraction: Math.abs(area) / (4 * Math.PI),
		crossed: crosses(ps),
		carry
	};
}

// --- carrying the arrow on the sheet --------------------------------------------------------------------------------
/** The sheet's Christoffel symbols at radius r, from the metric ds² = dr² + r² dθ² by the chapter's formula, with
 * the derivative of g_θθ = r² taken numerically: Γ^r_θθ = −½ g^rr ∂_r g_θθ and Γ^θ_rθ = ½ g^θθ ∂_r g_θθ. */
export function polarChristoffel(r: number): { rThTh: number; thRTh: number } {
	const gThTh = (x: number) => x * x;
	const d = 1e-5 * Math.max(1, r);
	const dg = (gThTh(r + d) - gThTh(r - d)) / (2 * d);
	return { rThTh: -0.5 * 1 * dg, thRTh: (0.5 * dg) / gThTh(r) };
}

export type SheetSample = {
	p: [number, number];
	/** The arrow in fixed straight axes, rebuilt from its polar components. */
	v: [number, number];
	vr: number;
	vth: number;
	s: number;
};
export type SheetCarry = {
	samples: SheetSample[];
	corners: number[];
	start: [number, number];
	end: [number, number];
	measured: number;
	length: number;
};

const polar = (x: number, y: number) => {
	const r = Math.hypot(x, y);
	return { r, er: [x / r, y / r] as const, eth: [-y / r, x / r] as const };
};

/** The least distance of the segment pq from the centre. */
export function clearance(p: SheetCorner, q: SheetCorner): number {
	const dx = q.x - p.x;
	const dy = q.y - p.y;
	const l2 = dx * dx + dy * dy;
	const t = l2 ? Math.max(0, Math.min(1, -(p.x * dx + p.y * dy) / l2)) : 0;
	return Math.hypot(p.x + t * dx, p.y + t * dy);
}

/** Carries the unit arrow along the first side round the loop of the sheet, in polar components. */
export function carrySheet(cs: SheetCorner[]): SheetCarry {
	const first = cs[0];
	const second = cs[1];
	const l0 = Math.hypot(second.x - first.x, second.y - first.y);
	const start: [number, number] = [(second.x - first.x) / l0, (second.y - first.y) / l0];
	const at0 = polar(first.x, first.y);
	let vr = start[0] * at0.er[0] + start[1] * at0.er[1];
	let vth = (start[0] * at0.eth[0] + start[1] * at0.eth[1]) / at0.r;
	let s = 0;
	const cartesian = (x: number, y: number, a: number, b: number): [number, number] => {
		const q = polar(x, y);
		return [a * q.er[0] + q.r * b * q.eth[0], a * q.er[1] + q.r * b * q.eth[1]];
	};
	const samples: SheetSample[] = [{ p: [first.x, first.y], v: start, vr, vth, s }];
	const corners = [0];
	for (let i = 0; i < cs.length; i++) {
		const p = cs[i];
		const q = cs[(i + 1) % cs.length];
		const len = Math.hypot(q.x - p.x, q.y - p.y);
		if (len > 1e-12) {
			const d = [(q.x - p.x) / len, (q.y - p.y) / len];
			// the rates dr/ds and dθ/ds along the segment, and the transport law in polar labels
			const f = (u: number, a: number, b: number): [number, number] => {
				const o = polar(p.x + u * d[0], p.y + u * d[1]);
				const dr = d[0] * o.er[0] + d[1] * o.er[1];
				const dth = (d[0] * o.eth[0] + d[1] * o.eth[1]) / o.r;
				const g = polarChristoffel(o.r);
				return [-g.rThTh * b * dth, -g.thRTh * (a * dth + b * dr)];
			};
			const h0 = Math.min(0.02, 0.05 * Math.max(clearance(p, q), 1e-3));
			const n = Math.max(1, Math.ceil(len / h0));
			const h = len / n;
			for (let k = 0; k < n; k++) {
				const u = k * h;
				const k1 = f(u, vr, vth);
				const k2 = f(u + h / 2, vr + (h / 2) * k1[0], vth + (h / 2) * k1[1]);
				const k3 = f(u + h / 2, vr + (h / 2) * k2[0], vth + (h / 2) * k2[1]);
				const k4 = f(u + h, vr + h * k3[0], vth + h * k3[1]);
				vr += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
				vth += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
				s += h;
				const x = k === n - 1 ? q.x : p.x + (u + h) * d[0];
				const y = k === n - 1 ? q.y : p.y + (u + h) * d[1];
				samples.push({ p: [x, y], v: cartesian(x, y, vr, vth), vr, vth, s });
			}
		}
		corners.push(samples.length - 1);
	}
	const end = samples[samples.length - 1].v;
	const measured = Math.atan2(
		start[0] * end[1] - start[1] * end[0],
		start[0] * end[0] + start[1] * end[1]
	);
	return { samples, corners, start, end, measured, length: s };
}

/** The sheet's signed area by the shoelace, m², positive anticlockwise. */
export function sheetArea(cs: SheetCorner[]): number {
	let s = 0;
	for (let i = 0; i < cs.length; i++) {
		const p = cs[i];
		const q = cs[(i + 1) % cs.length];
		s += p.x * q.y - q.x * p.y;
	}
	return s / 2;
}

// --- moving the corners ---------------------------------------------------------------------------------------------
/** A loop on the sphere is kept drawable: no side shorter than 1° or longer than 178°, where the great circle
 * through two nearly opposite corners stops being fixed by them. */
export function sphereValid(cs: SphereCorner[]): boolean {
	const ps = cs.map(point);
	return ps.every((p, i) => {
		const a = between(p, ps[(i + 1) % ps.length]) / DEG;
		return a >= 1 - 1e-9 && a <= 178 + 1e-9;
	});
}

/** A loop on the sheet stays on the drawn plane, keeps CLEAR from the centre and has no side of zero length. */
export function sheetValid(cs: SheetCorner[]): boolean {
	return cs.every((p, i) => {
		const q = cs[(i + 1) % cs.length];
		return (
			Math.abs(p.x) <= SHEET_LIMIT + 1e-9 &&
			Math.abs(p.y) <= SHEET_LIMIT + 1e-9 &&
			Math.hypot(q.x - p.x, q.y - p.y) > 1e-9 &&
			clearance(p, q) >= CLEAR - 1e-9
		);
	});
}

const tenth = (v: number) => Math.round(v * 10) / 10;
const lon = (ph: number) => {
	const p = ((((Math.round(ph) + 180) % 360) + 360) % 360) - 180;
	return p === -180 ? 180 : p;
};

function replace<T>(cs: T[], k: number, c: T): T[] {
	return cs.map((x, i) => (i === k ? c : x));
}

/** Moves corner k by whole degrees of ϑ and φ; a move that would spoil the loop is refused. At a pole the
 * longitude only chooses the meridian a later step of ϑ follows. */
export function movedSphere(
	cs: SphereCorner[],
	k: number,
	dTh: number,
	dPh: number
): SphereCorner[] {
	const c = cs[k];
	const next = { th: Math.max(0, Math.min(180, c.th + dTh)), ph: lon(c.ph + dPh) };
	const out = replace(cs, k, next);
	return sphereValid(out) ? out : cs;
}

/** Places corner k at the point p of the sphere, in whole degrees, snapping onto the poles and the equator. */
export function placedSphere(cs: SphereCorner[], k: number, p: Vec): SphereCorner[] {
	const q = unit(p);
	let th = Math.round(Math.acos(Math.max(-1, Math.min(1, q[2]))) / DEG);
	if (th <= SNAP) th = 0;
	else if (th >= 180 - SNAP) th = 180;
	else if (Math.abs(th - 90) <= SNAP) th = 90;
	const ph = th === 0 || th === 180 ? cs[k].ph : lon(Math.atan2(q[1], q[0]) / DEG);
	const out = replace(cs, k, { th, ph });
	return sphereValid(out) ? out : cs;
}

export function movedSheet(cs: SheetCorner[], k: number, dx: number, dy: number): SheetCorner[] {
	const c = cs[k];
	const out = replace(cs, k, { x: tenth(c.x + dx), y: tenth(c.y + dy) });
	return sheetValid(out) ? out : cs;
}

export function placedSheet(cs: SheetCorner[], k: number, x: number, y: number): SheetCorner[] {
	const lim = (v: number) => Math.max(-SHEET_LIMIT, Math.min(SHEET_LIMIT, tenth(v)));
	const out = replace(cs, k, { x: lim(x), y: lim(y) });
	return sheetValid(out) ? out : cs;
}

/** A fourth corner, halfway along the last side, where it does not change the loop's area. */
export function addSphereCorner(cs: SphereCorner[]): SphereCorner[] {
	if (cs.length >= 4) return cs;
	const a = point(cs[cs.length - 1]);
	const b = point(cs[0]);
	const m = unit(add(a, b));
	const th = Math.round(Math.acos(Math.max(-1, Math.min(1, m[2]))) / DEG);
	const ph = th === 0 || th === 180 ? 0 : lon(Math.atan2(m[1], m[0]) / DEG);
	const out = [...cs, { th, ph }];
	return sphereValid(out) ? out : cs;
}

export function addSheetCorner(cs: SheetCorner[]): SheetCorner[] {
	if (cs.length >= 4) return cs;
	const a = cs[cs.length - 1];
	const b = cs[0];
	const out = [...cs, { x: tenth((a.x + b.x) / 2), y: tenth((a.y + b.y) / 2) }];
	return sheetValid(out) ? out : cs;
}

/** Removing the fourth corner; refused if the three that are left would not make a loop. */
export function removeCorner<T extends SphereCorner | SheetCorner>(
	cs: T[],
	valid: (c: T[]) => boolean
): T[] {
	if (cs.length <= 3) return cs;
	const out = cs.slice(0, 3);
	return valid(out) ? out : cs;
}

export const sameSphere = (a: SphereCorner[], b: SphereCorner[]) =>
	a.length === b.length && a.every((c, i) => c.th === b[i].th && c.ph === b[i].ph);
export const sameSheet = (a: SheetCorner[], b: SheetCorner[]) =>
	a.length === b.length &&
	a.every((c, i) => Math.abs(c.x - b[i].x) < 1e-9 && Math.abs(c.y - b[i].y) < 1e-9);

// --- the keys ---------------------------------------------------------------------------------------------------------
/** A corner's step on the sphere: up is north (ϑ less), right is east; 1°, or 10° with Shift. */
export function sphereKey(key: string, shift: boolean): [number, number] | undefined {
	const d = shift ? 10 : 1;
	const m: Record<string, [number, number]> = {
		ArrowUp: [-d, 0],
		ArrowDown: [d, 0],
		ArrowRight: [0, d],
		ArrowLeft: [0, -d]
	};
	return m[key];
}

/** A corner's step on the sheet, along the page: 0.1 m, or 0.5 m with Shift. */
export function sheetKey(key: string, shift: boolean): [number, number] | undefined {
	const d = shift ? 0.5 : 0.1;
	const m: Record<string, [number, number]> = {
		ArrowUp: [0, d],
		ArrowDown: [0, -d],
		ArrowRight: [d, 0],
		ArrowLeft: [-d, 0]
	};
	return m[key];
}

/** The sphere turned as though its surface were pushed: right turns the front rightward, up turns it upward. */
export function viewKey(view: View, key: string, shift: boolean): View | undefined {
	const d = shift ? 15 : 5;
	const m: Record<string, [number, number]> = {
		ArrowRight: [d, 0],
		ArrowLeft: [-d, 0],
		ArrowUp: [0, -d],
		ArrowDown: [0, d]
	};
	const k = m[key];
	return k ? turned(view, k[0], k[1]) : undefined;
}

/** The view after the front of the sphere has been pushed right by dx degrees and down by dy. */
export function turned(view: View, dx: number, dy: number): View {
	const l = (((view.lon - dx + 180) % 360) + 360) % 360;
	return { lon: l - 180, el: Math.max(-ELEVATION, Math.min(ELEVATION, view.el + dy)) };
}

// --- the projection ---------------------------------------------------------------------------------------------------
/** The reader's axes: right, up and toward the reader. */
export function axes(view: View): { r: Vec; u: Vec; c: Vec } {
	const l = view.lon * DEG;
	const e = view.el * DEG;
	return {
		r: [-Math.sin(l), Math.cos(l), 0],
		u: [-Math.sin(e) * Math.cos(l), -Math.sin(e) * Math.sin(l), Math.cos(e)],
		c: [Math.cos(e) * Math.cos(l), Math.cos(e) * Math.sin(l), Math.sin(e)]
	};
}

/** A point of space in the reader's axes: x right, y up, z toward the reader (z > 0 on the near side). */
export function project(p: Vec, view: View): Vec {
	const { r, u, c } = axes(view);
	return [dot(p, r), dot(p, u), dot(p, c)];
}

/** The point of the near side of the unit sphere under (x, y), or on its rim beyond it. */
export function unproject(x: number, y: number, view: View): Vec {
	const { r, u, c } = axes(view);
	let X = x;
	let Y = y;
	const q = Math.hypot(X, Y);
	if (q > 0.999) {
		X *= 0.999 / q;
		Y *= 0.999 / q;
	}
	const Z = Math.sqrt(Math.max(0, 1 - X * X - Y * Y));
	return add(add(scale(r, X), u, Y), c, Z);
}

/** Points along the great-circle arc from a to b, about one a degree. */
export function arcPoints(a: Vec, b: Vec): Vec[] {
	const angle = between(a, b);
	const n = Math.max(1, Math.ceil(angle / DEG));
	const e = toward(a, b);
	return Array.from({ length: n + 1 }, (_, k) => {
		const t = (k / n) * angle;
		return add(scale(a, Math.cos(t)), e, Math.sin(t));
	});
}

/** A circle of latitude, ϑ in degrees, or a meridian, φ in degrees, as points a degree apart. */
export const parallel = (th: number): Vec[] =>
	Array.from({ length: 361 }, (_, k) => point({ th, ph: k }));
export const meridian = (ph: number): Vec[] =>
	Array.from({ length: 181 }, (_, k) => point({ th: k, ph }));

/** A polyline cut into its runs on the near and far sides. */
export function sides(pts: Vec[]): { near: Vec[][]; far: Vec[][] } {
	const near: Vec[][] = [];
	const far: Vec[][] = [];
	let run: Vec[] = [];
	let front: boolean | undefined;
	for (const p of pts) {
		const f = p[2] >= 0;
		if (front !== undefined && f !== front) {
			(front ? near : far).push([...run, p]);
			run = [];
		}
		run.push(p);
		front = f;
	}
	if (run.length > 1) (front ? near : far).push(run);
	return { near, far };
}

/** The indices of the samples at every spacing of the way round, for the faint copies. */
export function copies(samples: { s: number }[], spacing: number): number[] {
	const out: number[] = [];
	let next = spacing;
	for (let i = 1; i < samples.length - 1; i++) {
		if (samples[i].s >= next - 1e-9) {
			out.push(i);
			next += spacing;
		}
	}
	return out;
}

/** The last sample at or before the length s along the way. */
export function sampleAt(samples: { s: number }[], s: number): number {
	let lo = 0;
	let hi = samples.length - 1;
	if (s >= samples[hi].s) return hi;
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (samples[mid].s <= s) lo = mid;
		else hi = mid;
	}
	return lo;
}

// --- the predictions --------------------------------------------------------------------------------------------------
const pairwise = (cs: SphereCorner[]) => {
	const ps = cs.map(point);
	return [between(ps[0], ps[1]), between(ps[1], ps[2]), between(ps[2], ps[0])].map((a) => a / DEG);
};

/** An octant anywhere: three corners, each a right angle from the other two. */
export function isOctant(cs: SphereCorner[]): boolean {
	return cs.length === 3 && pairwise(cs).every((a) => Math.abs(a - 90) < 1e-6);
}

/** The octant with one side on the equator halved: two sides of 90° and one of 45°. */
export function isHalfOctant(cs: SphereCorner[]): boolean {
	if (cs.length !== 3) return false;
	const a = pairwise(cs).sort((x, y) => x - y);
	return Math.abs(a[0] - 45) < 1e-6 && Math.abs(a[1] - 90) < 1e-6 && Math.abs(a[2] - 90) < 1e-6;
}

/** The first is answered once the arrow has been carried round an octant. */
export const noteFirst = (done: boolean, cs: SphereCorner[], carried: boolean) =>
	done || (carried && isOctant(cs));
/** The second once the loop is the octant with its corner at 90° E moved to 45° E. */
export const noteSecond = (done: boolean, cs: SphereCorner[]) => done || isHalfOctant(cs);
/** The third once a loop of the reader's own has been made on the flat sheet. */
export const noteThird = (done: boolean, surface: Surface, cs: SheetCorner[]) =>
	done || (surface === 'sheet' && !sameSheet(cs, SHEET_OPENING));

// --- the words --------------------------------------------------------------------------------------------------------
/** An angle in degrees to three figures, at most three decimals: 90.0, 45.0, 0.610, 0.000. */
export function degrees(v: number): string {
	const a = Math.abs(v);
	const d = a >= 99.95 ? 0 : a >= 9.995 ? 1 : a >= 0.9995 ? 2 : 3;
	const t = v.toFixed(d);
	return (Number(t) === 0 ? Math.abs(v).toFixed(d) : t).replace('-', '−');
}

/** Three figures: 0.125, 1.00, 12.3. */
export function three(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	return v.toPrecision(3).replace('-', '−');
}

/** A number to a fixed count of decimals, with a true minus and no "−0". */
export function fixed(v: number, d: number): string {
	const t = v.toFixed(d);
	return (Number(t) === 0 ? Math.abs(v).toFixed(d) : t).replace('-', '−');
}

/** The same for LaTeX. */
export const tex = (s: string) => s.replace('−', '-');

export function longitude(ph: number): string {
	if (ph === 0) return '0°';
	if (ph === 180) return '180°';
	return ph > 0 ? `${ph}° E` : `${-ph}° W`;
}

export function cornerWords(c: SphereCorner): string {
	if (c.th === 0) return 'at the North Pole';
	if (c.th === 180) return 'at the South Pole';
	if (c.th === 90) return `on the equator at ${longitude(c.ph)}`;
	return `${c.th}° from the North Pole, at ${longitude(c.ph)}`;
}

export function sheetWords(c: SheetCorner): string {
	const r = Math.hypot(c.x, c.y);
	const th = Math.round(Math.atan2(c.y, c.x) / DEG);
	return `at x = ${fixed(c.x, 1)} m, y = ${fixed(c.y, 1)} m, that is r = ${fixed(r, 2)} m and θ = ${fixed(th, 0)}°`;
}
