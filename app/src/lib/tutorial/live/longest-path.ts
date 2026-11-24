/**
 * Chapter 7.1's tossed clock, made interactive. In a uniform field g, a clock goes from the throw, at the ground at
 * t = 0, to the catch, at the ground at t = T, along a path z(t). Its gain of proper time over a twin that stays on
 * the ground is the chapter's first-order
 *
 *   Δτ = (1/c²) ∫₀ᵀ (g z − ½ v²) dt,   v = dz/dt,
 *
 * computed here by the trapezoid rule on 400 steps. Free fall, z = ½ g t (T − t), gains g²T³/24c², which is
 * 3.57 × 10⁻¹⁶ s for T = 2 s on the Earth, and the path a·z(t) gains (2a − a²) times as much.
 *
 * The reader shapes the path with three handles, at t = T/4, T/2 and 3T/4. Their heights are kept as multiples of
 * free fall's highest point, gT²/8, so that changing T or g stretches the path with the parabola and keeps its
 * shape, and its ratio to free fall. Free fall's handles are at 3/4, 1 and 3/4 of that height.
 *
 * The curve through the two events and the three handles is the quartic through the five points (the polynomial of
 * least degree through them), with heights below the ground clamped to 0. Through five points on a parabola the
 * quartic is that parabola, exactly, so handles placed on free fall give free fall itself, and its gain; through
 * a times free fall's handles it is a times the parabola. Five points equally spaced are few enough that the
 * quartic does not ring between them.
 */

/** The speed of light, m s⁻¹, exact. */
export const C = 299_792_458;
/** The steps of the trapezoid rule. */
export const STEPS = 400;

/** The three places the field can be set to: g in m s⁻². */
export const BODIES = [
	{ name: 'Earth', g: 9.81 },
	{ name: 'Moon', g: 1.62 },
	{ name: 'neutron star', g: 1.3e12 }
] as const;
export type Body = 0 | 1 | 2;
export const EARTH: Body = 0;
export const MOON: Body = 1;
export const STAR: Body = 2;

/** The flight time, in tenths of a second, so that it is compared without rounding: 0.5 s to 4 s. */
export const TENTHS = { min: 5, max: 40 };
export const seconds = (tenths: number) => tenths / 10;

/** The heights of the three handles, as multiples of free fall's highest point gT²/8. */
export type Handles = readonly [number, number, number];
/** Free fall's handles: z(T/4) = z(3T/4) = 3gT²/32, three quarters of the highest point. */
export const FREE: Handles = [0.75, 1, 0.75];
/** The handles stay between the ground and twice free fall's highest point, the top of the drawing. */
export const TOP = 2;
/** The handles' places along the flight, as fractions of T. */
export const AT = [0.25, 0.5, 0.75] as const;

export const OPENING = { tenths: 20, body: EARTH, handles: FREE };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// --- the physics -------------------------------------------------------------------------------------------------------

/** Free fall's highest point, gT²/8, m. */
export const peak = (g: number, T: number) => (g * T * T) / 8;

/** Free fall's height, ½ g t (T − t), m. */
export const freeFall = (g: number, T: number, t: number) => 0.5 * g * t * (T - t);

/** The chapter's closed form for free fall's gain, g²T³/24c², s. */
export const tossed = (g: number, T: number) => (g * g * T ** 3) / (24 * C * C);

/** The closed form for the path a·z(t): (2a − a²) g²T³/24c², s. */
export const scaled = (a: number, g: number, T: number) => (2 * a - a * a) * tossed(g, T);

/**
 * The quartic through (0, 0), (¼, f₁), (½, f₂), (¾, f₃) and (1, 0), in s = t/T and in units of free fall's highest
 * point, written as q(s) = s(1 − s) p(s) with p the quadratic A + B(s − ½) + C(s − ½)² through p(¼) = 16f₁/3,
 * p(½) = 4f₂ and p(¾) = 16f₃/3. Its value and its slope dq/ds. For free fall's handles B = C = 0 exactly, and
 * q = 4s(1 − s).
 */
export function quartic(f: Handles, s: number): { q: number; dq: number } {
	const A = 4 * f[1];
	const B = (32 * (f[2] - f[0])) / 3;
	const Cq = (128 * (f[0] + f[2]) - 192 * f[1]) / 3;
	const u = s - 0.5;
	const p = A + B * u + Cq * u * u;
	const dp = B + 2 * Cq * u;
	return { q: s * (1 - s) * p, dq: (1 - 2 * s) * p + s * (1 - s) * dp };
}

/**
 * The path's height z and speed v = dz/dt at s = t/T, m and m s⁻¹. Where the quartic dips below the ground the path
 * keeps to it, at rest; at the two events it leaves and meets the ground at the quartic's own speed, unless the
 * quartic heads below it there.
 */
function heightAt(f: Handles, g: number, T: number, s: number): { z: number; v: number } {
	const H = peak(g, T);
	const { q, dq } = quartic(f, s);
	const v = (H * dq) / T;
	if (s <= 0) return { z: 0, v: dq > 0 ? v : 0 };
	if (s >= 1) return { z: 0, v: dq < 0 ? v : 0 };
	return q > 0 ? { z: H * q, v } : { z: 0, v: 0 };
}

/** The path's height and speed at the time t, from 0 to T. */
export const pathAt = (f: Handles, g: number, T: number, t: number) =>
	heightAt(f, g, T, clamp(t / T, 0, 1));

/** The gain of proper time over the ground clock, (1/c²) ∫ (gz − ½v²) dt by the trapezoid rule, s. */
export function gain(f: Handles, g: number, T: number, steps = STEPS): number {
	const h = T / steps;
	let sum = 0;
	for (let i = 0; i <= steps; i++) {
		const { z, v } = heightAt(f, g, T, i / steps);
		const w = i === 0 || i === steps ? 0.5 : 1;
		sum += w * (g * z - 0.5 * v * v);
	}
	return (sum * h) / (C * C);
}

/** Free fall's gain, by the same rule as the reader's path. */
export const freeGain = (g: number, T: number) => gain(FREE, g, T);

/** The path's highest point, as a multiple of free fall's, from `count` samples. */
export function top(f: Handles, count = 200): number {
	let best = 0;
	for (let i = 0; i <= count; i++) best = Math.max(best, quartic(f, i / count).q);
	return best;
}

/** Points of the path for the drawing: t in s and z in m. */
export function pathPoints(f: Handles, g: number, T: number, count = 160) {
	return Array.from({ length: count + 1 }, (_, i) => {
		const t = (T * i) / count;
		return { t, z: pathAt(f, g, T, t).z };
	});
}

/** Points of free fall's parabola for the drawing. */
export function freePoints(g: number, T: number, count = 160) {
	return Array.from({ length: count + 1 }, (_, i) => {
		const t = (T * i) / count;
		return { t, z: freeFall(g, T, t) };
	});
}

// --- moving the handles --------------------------------------------------------------------------------------------------

export const same = (a: Handles, b: Handles) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/** One handle set to a new height, m, kept between the ground and the top of the drawing. */
export function placed(f: Handles, k: 0 | 1 | 2, z: number, g: number, T: number): Handles {
	const next = [...f] as [number, number, number];
	next[k] = clamp(z / peak(g, T), 0, TOP);
	return next;
}

/**
 * The arrow keys' step, m: 0.1 m, and 1 m with Shift, on the Earth and the Moon. At the neutron star free fall rises
 * some 10¹¹ m, so there a step is a fiftieth of free fall's highest point, and a fifth with Shift, about the share
 * that 0.1 m and 1 m are of the Earth's 4.9 m at T = 2 s.
 */
export function keyStep(body: Body, shift: boolean, g: number, T: number): number {
	if (body === STAR) return (peak(g, T) * (shift ? 1 : 0.1)) / 5;
	return shift ? 1 : 0.1;
}

/** One handle moved up or down by d metres; a step that ends within a millionth of a step of 0 lands on it. */
export function nudged(f: Handles, k: 0 | 1 | 2, d: number, g: number, T: number): Handles {
	let z = f[k] * peak(g, T) + d;
	if (Math.abs(z) < 1e-6 * Math.abs(d)) z = 0;
	return placed(f, k, z, g, T);
}

// --- the predictions -----------------------------------------------------------------------------------------------------

/** A path counts as rising higher than the thrown ball when its highest point is 10 per cent above the ball's. */
export const HIGHER = 1.1;

export const onGround = (f: Handles) => f[0] === 0 && f[1] === 0 && f[2] === 0;

/**
 * The first prediction is answered once the reader has tried both other kinds of path: one that stays on the
 * ground, and one that rises higher than the thrown ball. The opening shows the ball's own. The higher path last
 * seen is kept, for the answer's numbers.
 */
export type FirstSeen = {
	ground: boolean;
	higher: Handles | undefined;
	done: Handles | undefined;
};

export const FIRST_START: FirstSeen = { ground: false, higher: undefined, done: undefined };

export function noteFirst(seen: FirstSeen, f: Handles): FirstSeen {
	if (seen.done) return seen;
	const ground = seen.ground || onGround(f);
	const higher = top(f) >= HIGHER ? f : seen.higher;
	return { ground, higher, done: ground && higher ? higher : undefined };
}

/** The second is answered once the flight time has been doubled to 4 s on the Earth. */
export const noteSecond = (done: boolean, tenths: number, body: Body) =>
	done || (tenths === 40 && body === EARTH);

/** The third once the field is the Moon's, with T = 2 s. */
export const noteThird = (done: boolean, tenths: number, body: Body) =>
	done || (tenths === 20 && body === MOON);

/** The first answer's numbers, for the higher path that answered it, on the Earth at T = 2 s. */
export function firstAnswer(f: Handles) {
	const g = BODIES[EARTH].g;
	const T = 2;
	const free = freeGain(g, T);
	const mine = gain(f, g, T);
	return {
		free,
		half: scaled(0.5, g, T),
		top: top(f) * peak(g, T),
		peak: peak(g, T),
		gain: mine,
		ratio: mine / free
	};
}

/** The second's: free fall's gain at T = 2 s and 4 s on the Earth, and their ratio. */
export function secondAnswer() {
	const g = BODIES[EARTH].g;
	const two = freeGain(g, 2);
	const four = freeGain(g, 4);
	return { two, four, ratio: four / two };
}

/** The third's: the Moon's gain at T = 2 s, and its ratio to the Earth's, (1.62/9.81)². */
export function thirdAnswer() {
	const earth = freeGain(BODIES[EARTH].g, 2);
	const moon = freeGain(BODIES[MOON].g, 2);
	return { earth, moon, ratio: moon / earth, squared: (BODIES[MOON].g / BODIES[EARTH].g) ** 2 };
}

// --- the words -------------------------------------------------------------------------------------------------------

/** A number to three figures, with a true minus sign; zero as 0. */
export function three(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	return v.toPrecision(3).replace('-', '−');
}

/** The same for LaTeX. */
export const threeTex = (v: number) => three(v).replace('−', '-');

const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const superscript = (n: number) =>
	String(n).replace(/[-0-9]/g, (c) => (c === '-' ? '⁻' : SUPER[Number(c)]));

/** A number to three figures as mantissa and power of ten: 6.27 × 10⁶. */
export function sci(v: number): { mantissa: string; power: number } {
	if (Math.abs(v) < 1e-300) return { mantissa: '0', power: 0 };
	let power = Math.floor(Math.log10(Math.abs(v)));
	let m = Number((v / 10 ** power).toPrecision(3));
	if (Math.abs(m) >= 10) {
		power += 1;
		m /= 10;
	}
	return { mantissa: m.toFixed(2).replace('-', '−'), power };
}

/** As words: "6.27 × 10⁶", or the plain number when the power is 0. */
export function sciWords(v: number): string {
	const { mantissa, power } = sci(v);
	return power === 0 ? mantissa : `${mantissa} × 10${superscript(power)}`;
}

/** As LaTeX: 6.27 \times 10^{6}. */
export function sciTex(v: number): string {
	const { mantissa, power } = sci(v);
	const m = mantissa.replace('−', '-');
	return power === 0 ? m : `${m} \\times 10^{${power}}`;
}

/**
 * A gain as the readouts give it: in units of 10⁻¹⁶ s, to three figures, on the Earth and the Moon; in seconds at
 * the neutron star, where it is millions of them.
 */
export function gainReading(
	v: number,
	body: Body
): { number: string; tex: string; unit: '1e-16' | 's' } {
	if (body === STAR) return { number: sciWords(v), tex: sciTex(v), unit: 's' };
	const n = v / 1e-16;
	return { number: three(n), tex: threeTex(n), unit: '1e-16' };
}

/** A height in metres, to three figures, or as a power of ten past ten kilometres. */
export const metres = (z: number) => (Math.abs(z) >= 1e4 ? sciWords(z) : three(z));

// --- the drawing ---------------------------------------------------------------------------------------------------------

/**
 * Ticks for an axis from 0 to max: a step of 1, 2 or 5 times a power of ten giving three to six ticks, in units of
 * 10^power when max is past ten kilometres, so that the labels stay short.
 */
export function ticks(max: number): { values: number[]; step: number; power: number } {
	const power = max >= 1e4 ? Math.floor(Math.log10(max)) : 0;
	const unit = 10 ** power;
	const span = max / unit;
	const raw = span / 4;
	const mag = 10 ** Math.floor(Math.log10(raw));
	const step = [1, 2, 5, 10].map((k) => k * mag).find((s) => span / s <= 5.0001) ?? 10 * mag;
	const values: number[] = [];
	for (let i = 0; i * step <= span * (1 + 1e-9); i++)
		values.push(Number((i * step).toPrecision(6)));
	return { values, step, power };
}

/** A tick's label: whole numbers as they are, others to the step's decimals. */
export function tickLabel(v: number, step: number): string {
	const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
	return v.toFixed(decimals);
}
