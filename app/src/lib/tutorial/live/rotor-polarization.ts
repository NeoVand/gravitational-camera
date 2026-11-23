/**
 * Chapter 5.4's rotor and its polarization. A rotor seen at the inclination ι sends the amplitudes
 * h₊ = A(1 + cos²ι)/2 and h× = A cos ι, a quarter cycle apart (eq:rotor): h₊(t) = h₊ cos x, h×(t) = h× sin x with
 * x = 2Ωu, the wave's phase. In the paper's convention e^(−iωt) their phasors are h̃₊ = h₊ and h̃× = i h×, and the
 * two helicities (eq:helicities) are h̃_a = (h₊ + h×)/2 = A cos⁴(ι/2), anticlockwise as the camera sees it, and
 * h̃_c = (h₊ − h×)/2 = A sin⁴(ι/2), clockwise. In axes turned anticlockwise by θ (eq:helicity-turn),
 * h̃′_a = e^(2iθ) h̃_a and h̃′_c = e^(−2iθ) h̃_c, so h̃′₊ = h̃′_a + h̃′_c and h̃′× = i(h̃′_a − h̃′_c). The Stokes
 * parameters (eq:stokes-helicity) are I = 2(|h̃_a|² + |h̃_c|²), V = 2(|h̃_a|² − |h̃_c|²) and Q + iU = 4 h̃′*_a h̃′_c,
 * which is e^(−4iθ)(h₊² − h×²). All amplitudes are in units of A, the Stokes parameters in units of A².
 *
 * The left panel's rotor is placed with the chapter's own frame: the spin along its z, the camera along
 * n̂ = (sin ι, 0, cos ι), the masses at ±(d/2)(−sin Ωt, cos Ωt, 0). The drawing's world has X toward the camera,
 * Y up and Z toward the reader, and the spin turns in the XY plane; it is drawn in light perspective by `project`.
 */
import { cis, modulus, scaled, times, type Complex } from './spin-two-dial';

export { DEGREE, type Complex } from './spin-two-dial';
const DEG = Math.PI / 180;

// --- the controls ----------------------------------------------------------------------------------------------------

/** The inclination ι, degrees: its range, its slider's step, and what the arrow keys and Page Up and Down move it. */
export const IOTA = { min: 0, max: 180, step: 0.1, key: 1, page: 10, opening: 0 } as const;
/** The turn θ of the camera's axes, degrees. The slider steps by half a degree, so that 22.5° can be reached. */
export const THETA = { min: 0, max: 180, step: 0.5, key: 1, page: 5, opening: 0 } as const;
/** The wave's phase 2Ωu, degrees. */
export const PHASE = { min: 0, max: 360, step: 1, key: 1, page: 10, opening: 0 } as const;

/** The accessible names of the controls, each with its unit. */
export const NAMES = {
	iota: 'Inclination ι, degrees',
	theta: 'Turn of the camera’s axes θ, degrees',
	phase: 'Wave phase 2Ωu, degrees',
	play: 'Play the wave',
	pause: 'Pause the wave'
} as const;

type Range = { min: number; max: number; step: number; key: number; page: number };

/** A value put on its range's grid of steps and kept within the range. */
export function onGrid(v: number, r: Pick<Range, 'min' | 'max' | 'step'>) {
	const s = Math.round(v / r.step) * r.step;
	return Math.max(r.min, Math.min(r.max, Math.round(s * 1e6) / 1e6));
}

/**
 * The value after a key: the arrows move it by the range's `key`, Page Up and Page Down by its `page`, Home and End
 * to its ends; undefined for any other key. From a value off the grid of the arrows (a mark such as 82.16°), a
 * press lands on that grid, short of the full step rather than past it.
 */
export function keyed(v: number, key: string, r: Range): number | undefined {
	const by: Record<string, number> = {
		ArrowRight: r.key,
		ArrowUp: r.key,
		ArrowLeft: -r.key,
		ArrowDown: -r.key,
		PageUp: r.page,
		PageDown: -r.page
	};
	if (key === 'Home') return r.min;
	if (key === 'End') return r.max;
	const d = by[key];
	if (d === undefined) return undefined;
	const grid = Math.abs(v / r.key - Math.round(v / r.key)) < 1e-6;
	const sum = v + d;
	const next = grid
		? sum
		: d > 0
			? Math.floor(sum / r.key) * r.key
			: Math.ceil(sum / r.key) * r.key;
	return onGrid(next, r);
}

/** What a screen reader says for a value in degrees, with as many decimals as the control shows. */
export const valueText = (deg: number, digits: number) =>
	`${fixed(deg, digits).replace('−', 'minus ')} degrees`;

// --- the wave --------------------------------------------------------------------------------------------------------

/** The two amplitudes in units of A, at the inclination ι in degrees: h₊ = (1 + cos²ι)/2, h× = cos ι. */
export function amplitudes(iota: number) {
	const c = cosine(iota);
	return { plus: (1 + c * c) / 2, cross: c };
}

/** cos ι, with the exact zero at 90° (Math.cos gives 6 × 10⁻¹⁷ there, which would give V a sign). */
function cosine(iotaDeg: number) {
	if (Math.abs(iotaDeg - 90) < 1e-12) return 0;
	return Math.cos(iotaDeg * DEG);
}

/** The helicities in the first axes, units of A: anticlockwise h̃_a = (h₊ + h×)/2, clockwise h̃_c = (h₊ − h×)/2. */
export function helicities(iota: number) {
	const { plus, cross } = amplitudes(iota);
	return { a: (plus + cross) / 2, c: (plus - cross) / 2 };
}

/** The helicities in axes turned by θ (degrees): h̃′_a = e^(2iθ) h̃_a, h̃′_c = e^(−2iθ) h̃_c. */
export function turnedHelicities(iota: number, theta: number): { a: Complex; c: Complex } {
	const { a, c } = helicities(iota);
	return { a: scaled(a, cis(2 * theta * DEG)), c: scaled(c, cis(-2 * theta * DEG)) };
}

/** The phasors in the turned axes: h̃′₊ = h̃′_a + h̃′_c and h̃′× = i(h̃′_a − h̃′_c). */
export function turnedAmplitudes(iota: number, theta: number): { plus: Complex; cross: Complex } {
	const { a, c } = turnedHelicities(iota, theta);
	return {
		plus: { re: a.re + c.re, im: a.im + c.im },
		cross: times({ re: 0, im: 1 }, { re: a.re - c.re, im: a.im - c.im })
	};
}

/** The two strains at the phase x = 2Ωu (degrees), in the turned axes: Re[h̃′ e^(−ix)]. */
export function strains(iota: number, theta: number, phase: number) {
	const { plus, cross } = turnedAmplitudes(iota, theta);
	const turn = cis(-phase * DEG);
	return { plus: times(plus, turn).re, cross: times(cross, turn).re };
}

/**
 * The phase difference arg(h̃′×/h̃′₊), degrees in (−180, 180]; undefined when either amplitude is zero, so that
 * the timing between the two patterns has no meaning.
 */
export function phaseDifference(iota: number, theta: number): number | undefined {
	const { plus, cross } = turnedAmplitudes(iota, theta);
	if (modulus(plus) < 1e-9 || modulus(cross) < 1e-9) return undefined;
	const q = times(cross, { re: plus.re, im: -plus.im });
	const d = Math.atan2(q.im, q.re) / DEG;
	return d <= -180 + 1e-9 ? 180 : d;
}

/** The four Stokes parameters in units of A², from the helicities in the turned axes. */
export function stokes(iota: number, theta: number) {
	const { a, c } = turnedHelicities(iota, theta);
	const a2 = a.re * a.re + a.im * a.im;
	const c2 = c.re * c.re + c.im * c.im;
	const qu = scaled(4, times({ re: a.re, im: -a.im }, c));
	return { I: 2 * (a2 + c2), Q: qu.re, U: qu.im, V: 2 * (a2 - c2) };
}

/** The same four from the phasors of the two strains (eq:stokes), for a check: I, Q, U, V. */
export function stokesOf(plus: Complex, cross: Complex) {
	const p2 = plus.re * plus.re + plus.im * plus.im;
	const q2 = cross.re * cross.re + cross.im * cross.im;
	const pq = times({ re: plus.re, im: -plus.im }, cross);
	return { I: p2 + q2, Q: p2 - q2, U: 2 * pq.re, V: 2 * pq.im };
}

/** The circular fraction V/I = 2h₊h×/(h₊² + h×²), which no turn of the axes changes. */
export function circular(iota: number) {
	const { plus, cross } = amplitudes(iota);
	return (2 * plus * cross) / (plus * plus + cross * cross);
}

/** The power sent toward ι, relative to face on (eq:pattern): (1 + 6cos²ι + cos⁴ι)/8. */
export function power(iota: number) {
	const c2 = cosine(iota) ** 2;
	return (1 + 6 * c2 + c2 * c2) / 8;
}

/** The ellipse traced by (h₊(t), h×(t)): its semi-axes in units of A, (1 + cos²ι)/2 and |cos ι|. */
export function ellipseAxes(iota: number) {
	const { plus, cross } = amplitudes(iota);
	return { major: plus, minor: Math.abs(cross) };
}

export type Sense = 'anticlockwise' | 'clockwise' | 'none';

/** The sense in which the pattern, and the point (h₊(t), h×(t)), go round, as the camera sees them. */
export function sense(iota: number): Sense {
	const v = stokes(iota, 0).V;
	return v > 1e-12 ? 'anticlockwise' : v < -1e-12 ? 'clockwise' : 'none';
}

/** The spot of the paper's fig:which-way: magenta anticlockwise, green clockwise, grey for none; depth |V/I|. */
export function spot(iota: number) {
	const s = sense(iota);
	return { sense: s, depth: s === 'none' ? 0 : Math.abs(circular(iota)) };
}

/**
 * The inclination at which V/I is one half, degrees: there (h₊ − 2h×)² = 3h×², so h₊/h× = 2 + √3, and with
 * h₊ = (1 + c²)/2 and h× = c, c² − 2(2 + √3)c + 1 = 0. The clockwise power is then a third of the anticlockwise.
 */
export const HALF_TILT = (() => {
	const r = 2 + Math.sqrt(3);
	return Math.acos(r - Math.sqrt(r * r - 1)) / DEG;
})();

/** The tilts the inclination's slider marks, with their words. */
export const IOTA_MARKS = [
	{ at: 0, label: 'face on' },
	{ at: 60, label: '60°' },
	{ at: HALF_TILT, label: 'V/I = ½' },
	{ at: 90, label: 'edge on' },
	{ at: 120, label: '120°' },
	{ at: 180, label: 'spin away' }
];

/** The turns the slider of θ marks. */
export const THETA_MARKS = [
	{ at: 22.5, label: '22.5°: Q and U trade places' },
	{ at: 45, label: '45°: Q changes sign' },
	{ at: 90, label: '90°: all as at 0°' }
];

// --- the ring ---------------------------------------------------------------------------------------------------------

/** The exaggerated strain of the drawing: the ring's strain is this times h/A, so 0.3 face on. */
export const DRAWN = 0.3;

/**
 * The move of a ball at rest at ξ = (x, y) on the unit ring, in the first axes, under the strains h₊(t), h×(t) in
 * the first axes, in units of A: δξ = ½ h ξ, h = DRAWN (h₊ e⁺ + h× e×).
 */
export function ballMove(plus: number, cross: number, x: number, y: number, k = DRAWN) {
	return { x: (k / 2) * (plus * x + cross * y), y: (k / 2) * (cross * x - plus * y) };
}

/** Whether a ball moves outward, inward, or along the ring (within a hundredth of the largest move). */
export function direction(plus: number, cross: number, x: number, y: number) {
	const m = ballMove(plus, cross, x, y, 1);
	const radial = m.x * x + m.y * y;
	const edge = 0.01 * Math.hypot(plus, cross);
	return radial > edge ? 'stretch' : radial < -edge ? 'squeeze' : 'still';
}

// --- the rotor in its world ---------------------------------------------------------------------------------------------

export type Vec = [number, number, number];

export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a: Vec, b: Vec): Vec => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
const plus3 = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const times3 = (k: number, a: Vec): Vec => [k * a[0], k * a[1], k * a[2]];

/** The line of sight, from the rotor to the camera: X in the drawing's world. */
export const SIGHT: Vec = [1, 0, 0];

/** The chapter's frame in the drawing's world at the inclination ι: its x, y and z (the spin). */
export function frame(iota: number): { x: Vec; y: Vec; z: Vec } {
	const c = cosine(iota);
	const s = Math.sin(iota * DEG);
	// n̂ = sin ι x̂ + cos ι ẑ is X, and ŷ = ẑ × x̂
	return { x: [s, -c, 0], y: [0, 0, -1], z: [c, s, 0] };
}

/** The camera's axes in the drawing's world, e₁ = cos ι x̂ − sin ι ẑ and e₂ = ŷ (with e₁ × e₂ = n̂). */
export function cameraAxes(iota: number): { e1: Vec; e2: Vec } {
	const f = frame(iota);
	const c = cosine(iota);
	const s = Math.sin(iota * DEG);
	return { e1: plus3(times3(c, f.x), times3(-s, f.z)), e2: f.y };
}

/** The masses of a rotor of length `d` at the phase x = 2Ωu (degrees), so Ωt = x/2: ±(d/2)(−sin Ωt, cos Ωt, 0). */
export function masses(iota: number, phase: number, d = 1): [Vec, Vec] {
	const f = frame(iota);
	const w = (phase * DEG) / 2;
	const p = plus3(times3((-d / 2) * Math.sin(w), f.x), times3((d / 2) * Math.cos(w), f.y));
	return [p, times3(-1, p)];
}

/** The point at the angle `deg` from the line of sight toward the spin's side, in the XY plane: the spin at ι. */
export const inPlane = (deg: number, r = 1): Vec => [r * cosine(deg), r * Math.sin(deg * DEG), 0];

// --- light perspective -------------------------------------------------------------------------------------------------

/** Where the drawing's viewer stands: turned 18° to the left of the reader and raised 15°, 9 units away. */
export const VIEW = { yaw: 18, pitch: 15, distance: 9 } as const;

const toViewer = (): Vec => {
	const y = VIEW.yaw * DEG;
	const p = VIEW.pitch * DEG;
	return [-Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p)];
};
const W_AXIS = toViewer();
const RIGHT: Vec = [Math.cos(VIEW.yaw * DEG), 0, Math.sin(VIEW.yaw * DEG)];
const UP = cross3(W_AXIS, RIGHT);

/**
 * A point of the world on the screen, by a pinhole at the viewer: x right and y down, in units of the world at the
 * origin's depth, with its depth toward the viewer and the scale of things there.
 */
export function project(p: Vec) {
	const depth = dot(p, W_AXIS);
	const k = VIEW.distance / (VIEW.distance - depth);
	return { x: k * dot(p, RIGHT), y: -k * dot(p, UP), depth, scale: k };
}

// --- the numbers ---------------------------------------------------------------------------------------------------------

/**
 * A value to `digits` decimals, halves rounded away from zero (0.625 reads 0.63 even when the arithmetic gives
 * 0.6249999…), with a true minus sign and never −0.
 */
export function fixed(v: number, digits = 2) {
	const k = 10 ** digits;
	const n = Math.round(Math.abs(v) * k + 1e-7) / k;
	const s = n.toFixed(digits);
	return v < 0 && n > 0 ? `−${s}` : s;
}

/** The numbers each prediction's answer rests on. */
export function halfAnswer() {
	const { a, c } = helicities(HALF_TILT);
	return {
		tilt: HALF_TILT,
		at60: circular(60),
		at75: circular(75),
		atHalf: circular(HALF_TILT),
		at30: circular(30),
		/** The clockwise power over the anticlockwise: a third. */
		share: (c * c) / (a * a)
	};
}

export function pastAnswer() {
	const s = stokes(120, 0);
	return { V: s.V, I: s.I, ratio: circular(120), cross: amplitudes(120).cross, power: power(120) };
}

export function turnAnswer(iota: number) {
	const before = turnedAmplitudes(iota, 0);
	const after = turnedAmplitudes(iota, 45);
	const s0 = stokes(iota, 0);
	const s1 = stokes(iota, 45);
	return {
		iota,
		plus: [modulus(before.plus), modulus(after.plus)],
		cross: [modulus(before.cross), modulus(after.cross)],
		Q: [s0.Q, s1.Q],
		U: [s0.U, s1.U],
		I: s1.I,
		V: s1.V,
		ratio: circular(iota),
		power: power(iota)
	};
}

/** When each prediction counts as done. */
export const halfDone = (iota: number) => Math.abs(circular(iota) - 0.5) <= 0.01;
export const pastDone = (iota: number) => Math.abs(iota - 120) <= 0.5;
export const turnDone = (iota: number, theta: number) =>
	Math.abs(theta - 45) <= 0.5 && iota >= 1 && iota <= 179;
