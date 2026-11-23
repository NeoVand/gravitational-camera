/**
 * Chapter 1.5b's dial: what a turn of the axes does to the numbers of an arrow and of a shear. An arrow in the plane
 * is the complex number v = v_x + i v_y; the trace-free part of a 2 × 2 tidal table is the shear
 * s = (T_xx − T_yy) + 2i T_xy. Turning the axes anticlockwise by θ multiplies the first by e^(−iθ) and the second by
 * e^(−2iθ): the arrow has spin one and the shear spin two. The spec checks both against chapter 1.1's rule
 * T′ = R T Rᵀ. A rotor's wave, seen at the inclination ι, gives a shear that moves in time as h₊ cos x + i h× sin x,
 * x = 2Ωu, the sum of two circles turning opposite ways.
 */
import type { Table } from './ring-matrix';

export interface Complex {
	re: number;
	im: number;
}

export const DEGREE = Math.PI / 180;

export const add = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
export const times = (a: Complex, b: Complex): Complex => ({
	re: a.re * b.re - a.im * b.im,
	im: a.re * b.im + a.im * b.re
});
export const scaled = (k: number, z: Complex): Complex => ({ re: k * z.re, im: k * z.im });

/** e^(iφ), φ in radians. */
export const cis = (phi: number): Complex => ({ re: Math.cos(phi), im: Math.sin(phi) });

export const modulus = (z: Complex) => Math.hypot(z.re, z.im);

/** The argument in degrees, in (−180, 180]; 0 for the number 0. */
export function argument(z: Complex) {
	if (z.re === 0 && z.im === 0) return 0;
	const a = (Math.atan2(z.im, z.re) * 180) / Math.PI;
	return a <= -180 ? a + 360 : a;
}

/** An angle in degrees brought into [0, 360). */
export const wrap = (deg: number) => ((deg % 360) + 360) % 360;

/** An angle in degrees brought into (−180, 180]. */
export function principalAngle(deg: number) {
	const w = wrap(deg);
	return w > 180 ? w - 360 : w;
}

/** An arrow's number in axes turned anticlockwise by θ (radians): v′ = e^(−iθ) v. */
export const turnArrow = (v: Complex, theta: number) => times(cis(-theta), v);

/** A shear's number in axes turned anticlockwise by θ (radians): s′ = e^(−2iθ) s. */
export const turnShear = (s: Complex, theta: number) => times(cis(-2 * theta), s);

/** The shear of a symmetric table: s = (T_xx − T_yy) + 2i T_xy. */
export const shearOf = (t: Table): Complex => ({ re: t.a - t.d, im: 2 * t.b });

/** The trace-free table whose shear is s, with half its trace `mean` added along the diagonal. */
export const tableOf = (s: Complex, mean = 0): Table => ({
	a: mean + s.re / 2,
	b: s.im / 2,
	d: mean - s.re / 2
});

/** The shear and the arrow the figure opens on: s = 2, a squeeze along x and a stretch along y, and v = e^(i 30°). */
export const SHEAR: Complex = { re: 2, im: 0 };
export const ARROW: Complex = cis(30 * DEGREE);

// --- the dial --------------------------------------------------------------------------------------------------------

/** The direction from the centre of a drawing to (x, y), y running down the screen: degrees anticlockwise. */
export const bearing = (x: number, y: number) => (Math.atan2(-y, x) * 180) / Math.PI;

/**
 * θ after a drag from the bearing `from` to the bearing `to`, both degrees, begun at θ = `start`: the axes follow
 * the pointer when `sign` is 1; when the axes are held still and the picture turns by −θ instead, `sign` is −1, so
 * that the picture follows the pointer. Rounded to whole degrees, in [0, 360).
 */
export const dragged = (start: number, from: number, to: number, sign: 1 | -1) =>
	wrap(Math.round(start + sign * (to - from)));

/** The turns worth marking, degrees, and how near the dial must come to one to count as there. */
export const QUARTER = 90;
export const HALF = 180;
export const NEAR = 0.5;
export const at = (theta: number, mark: number) =>
	Math.abs(principalAngle(theta - mark)) <= NEAR + 1e-9;

// --- a rotor's wave --------------------------------------------------------------------------------------------------

/**
 * The amplitudes of a rotor's two polarizations at the inclination ι (radians), over their value A face on (the
 * paper's eq. rotor-amplitudes): h₊ = (1 + cos²ι)/2, h× = cos ι.
 */
export function rotor(iota: number) {
	const c = Math.cos(iota);
	return { plus: (1 + c * c) / 2, cross: c };
}

/** The rotor's shear at the phase x = 2Ωu, for a face-on size `size`: size (h₊ cos x + i h× sin x). */
export function rotorShear(iota: number, x: number, size = modulus(SHEAR)): Complex {
	const { plus, cross } = rotor(iota);
	return { re: size * plus * Math.cos(x), im: size * cross * Math.sin(x) };
}

/**
 * The two circles the rotor's shear is the sum of, for a face-on size `size`: radius size (h₊ + h×)/2 turning
 * anticlockwise, with the rotor, and radius size (h₊ − h×)/2 turning clockwise, each at the rate of x.
 */
export function circles(iota: number, size = modulus(SHEAR)) {
	const { plus, cross } = rotor(iota);
	return { with: (size * (plus + cross)) / 2, against: (size * (plus - cross)) / 2 };
}

/** The two circles' parts of the rotor's shear at the phase x: the first anticlockwise, the second clockwise. */
export function parts(iota: number, x: number, size = modulus(SHEAR)): [Complex, Complex] {
	const r = circles(iota, size);
	return [scaled(r.with, cis(x)), scaled(r.against, cis(-x))];
}

/** The paper's circular fraction, 2 h₊ h× / (h₊² + h×²): 1 face on, 0 edge on. */
export function circular(iota: number) {
	const { plus, cross } = rotor(iota);
	return (2 * plus * cross) / (plus * plus + cross * cross);
}

// --- the numbers -----------------------------------------------------------------------------------------------------

/** A value to two decimals with a true minus sign, never −0.00. */
export function signed(v: number, digits = 2) {
	const s = v.toFixed(digits);
	return Number(s) === 0 ? (0).toFixed(digits) : s.replace('-', '−');
}

/** A complex number as a + bi in LaTeX, to two decimals, never −0.00. */
export function complexTex(z: Complex) {
	const re = signed(z.re).replace('−', '-');
	const im = signed(z.im);
	const sign = im.startsWith('−') ? '-' : '+';
	return `${re} ${sign} ${im.replace('−', '')}\\,i`;
}

/** An angle in degrees, whole, in (−180, 180], never −0. */
export function angleText(deg: number) {
	const a = Math.round(principalAngle(deg));
	const b = a === -180 ? 180 : a;
	return b === 0 ? '0' : String(b);
}
