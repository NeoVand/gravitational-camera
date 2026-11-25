/**
 * Chapter 7.5's magnetic tide. Three scenes, in SI units, to first order in v/c, outside the matter:
 *
 * A passing mass. A mass M at a distance r from a pixel, moving with velocity v, makes the paper's eq:magnetic-point,
 * 𝓑_ij = (3GM/cr³)[n̂_i(n̂ × v)_j + n̂_j(n̂ × v)_i], with n̂ the unit vector from the pixel toward the mass, beside the
 * tide of a point mass, 𝓔_ij = (GM/r³)(δ_ij − 3n̂_in̂_j). Only v⊥ = |n̂ × v| counts, and the Frobenius norms have the
 * ratio |𝓑|/|𝓔| = √3 v⊥/c.
 *
 * A spinning body. A round body whose spherical layers each turn rigidly, with angular momentum L, makes the spin
 * dipole 𝓑_ij = −(3G/cr⁴)[L_in̂_j + n̂_iL_j + (L·n̂)(δ_ij − 5n̂_in̂_j)]: a ball (C = ⅖MR²), a thin shell (⅔MR²), or a
 * uniform ball whose inner part, of radius a, turns against the shell outside it, L = ⅖MR²Ω(2(a/R)⁵ − 1), which is
 * zero at a = 2^(−1/5) R.
 *
 * The equator. A pixel at rest on the Earth's equator reads 𝓑_xz = −(3GMΩ/cR²)(1 − C/MR²): the 1 is its own motion
 * through the static field, C/MR² the planet's spin.
 *
 * Gyroscopes a small vector ξ apart turn relative to one another at δΩ_i = 𝓑_ij ξ_j / c.
 */

export type Vec3 = [number, number, number];
export type Mat3 = [Vec3, Vec3, Vec3];

/** G, m³ kg⁻¹ s⁻², and c, m s⁻¹, as the chapter takes them. */
export const G = 6.674e-11;
export const C = 2.998e8;

// --- small vector algebra ------------------------------------------------------------------------------------------

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
export const length = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);

/** A table from a rule for its entries. */
export const tableOf = (f: (i: number, j: number) => number): Mat3 =>
	[0, 1, 2].map((i) => [0, 1, 2].map((j) => f(i, j))) as Mat3;

export const delta = (i: number, j: number) => (i === j ? 1 : 0);

/** The Frobenius norm, √(Σ T_ij²). */
export const norm = (t: Mat3) => Math.sqrt(t.flat().reduce((s, v) => s + v * v, 0));

export const trace = (t: Mat3) => t[0][0] + t[1][1] + t[2][2];

/** The table applied to a vector, T_ij a_j. */
export const apply = (t: Mat3, a: Vec3): Vec3 => t.map((row) => dot(row, a)) as Vec3;

/** The largest size of T_ij − T_ji. */
export const asymmetry = (t: Mat3) =>
	Math.max(...[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => Math.abs(t[i][j] - t[j][i]))));

/** cos and sin of an angle in degrees, exact at the multiples of 90°, so that the line of sight gives exactly 0. */
export function cosDeg(deg: number): number {
	const d = ((deg % 360) + 360) % 360;
	if (d === 90 || d === 270) return 0;
	if (d === 0) return 1;
	if (d === 180) return -1;
	return Math.cos((d * Math.PI) / 180);
}
export const sinDeg = (deg: number) => cosDeg(deg - 90);

// --- the two tides of a point mass ---------------------------------------------------------------------------------

/** eq:magnetic-point: 𝓑_ij of a mass M at the distance r along n̂ from the pixel, moving with v; s⁻². */
export function magneticPoint(M: number, r: number, n: Vec3, v: Vec3, g = G, c = C): Mat3 {
	const w = cross(n, v);
	const k = (3 * g * M) / (c * r ** 3);
	return tableOf((i, j) => k * (n[i] * w[j] + n[j] * w[i]));
}

/** The tide of a point mass M at the distance r along n̂: 𝓔_ij = (GM/r³)(δ_ij − 3n̂_in̂_j); s⁻². */
export function electricPoint(M: number, r: number, n: Vec3, g = G): Mat3 {
	const k = (g * M) / r ** 3;
	return tableOf((i, j) => k * (delta(i, j) - 3 * n[i] * n[j]));
}

/** The sideways speed v⊥ = |n̂ × v|. */
export const sideways = (n: Vec3, v: Vec3) => length(cross(n, v));

/** The chapter's ratio of the norms, √3 v⊥/c. */
export const ratioRule = (vPerp: number, c = C) => (Math.sqrt(3) * vPerp) / c;

// --- the spin dipole -----------------------------------------------------------------------------------------------

/** eq:spin-dipole: 𝓑_ij of a round spinning body with angular momentum L, at the distance r along n̂; s⁻². */
export function spinDipole(L: Vec3, r: number, n: Vec3, g = G, c = C): Mat3 {
	const k = -(3 * g) / (c * r ** 4);
	const Ln = dot(L, n);
	return tableOf((i, j) => k * (L[i] * n[j] + n[i] * L[j] + Ln * (delta(i, j) - 5 * n[i] * n[j])));
}

/** The radius of the inner ball, as a fraction of R, at which it cancels the counter-turning shell: 2^(−1/5). */
export const BALANCE = 2 ** -0.2;

export type Body = 'ball' | 'shell' | 'counter';

/** C/MR² of a uniform ball and of a thin shell. */
export const BALL_RATIO = 2 / 5;
export const SHELL_RATIO = 2 / 3;

/**
 * L/(MR²Ω), signed along the spin: ⅖ for a ball, ⅔ for a shell, and for a uniform ball whose inner part of radius a
 * turns at Ω and whose shell outside it turns at −Ω, ⅖(2(a/R)⁵ − 1).
 */
export function spinRatio(body: Body, inner = 1): number {
	if (body === 'ball') return BALL_RATIO;
	if (body === 'shell') return SHELL_RATIO;
	if (inner === BALANCE) return 0;
	return BALL_RATIO * (2 * inner ** 5 - 1);
}

/** The figure's body: 1000 kg, radius 0.5 m, its centre 1.5 m from the pixel. */
export const BODY = { M: 1000, R: 0.5, r: 1.5 };

/** The angular momentum L = CΩ of the figure's body, kg m² s⁻¹, signed along the axis. */
export const angularMomentum = (body: Body, rate: number, inner = 1, b = BODY) =>
	spinRatio(body, inner) * b.M * b.R ** 2 * rate;

/** The moment of inertia, kg m², of the parts turning one way: for the counter-turning body, the whole ball's. */
export const inertia = (body: Body, b = BODY) =>
	(body === 'shell' ? SHELL_RATIO : BALL_RATIO) * b.M * b.R ** 2;

/**
 * The figure's spin dipole: the axis out of the screen, across the line, so L = L ẑ and n̂ = x̂ toward the body;
 * on the body's equator only 𝓑_xz = 𝓑_zx = −3GL/cr⁴ is left.
 */
export const spinTable = (body: Body, rate: number, inner = 1, b = BODY) =>
	spinDipole([0, 0, angularMomentum(body, rate, inner, b)], b.r, [1, 0, 0]);

/** The readouts of the spinning body: C, L, |𝓑|, |𝓔|, |𝓑| over a ball's at the same rate, and the gyroscopes' δΩ. */
export function spinning(body: Body, rate: number, inner = 1, b = BODY) {
	const B = spinTable(body, rate, inner, b);
	const E = electricPoint(b.M, b.r, SIGHT);
	const ball = norm(spinTable('ball', rate, 1, b));
	return {
		C: inertia(body, b),
		L: angularMomentum(body, rate, inner, b),
		B: norm(B),
		E: norm(E),
		overBall: ball > 0 ? norm(B) / ball : undefined,
		gyro: gyroPair(B, SIGHT)[2]
	};
}

// --- the equator ---------------------------------------------------------------------------------------------------

/** The Earth: GM, m³ s⁻²; Ω, s⁻¹; the equatorial radius, m; C/MR². */
export const EARTH = { GM: 3.986e14, omega: 7.292e-5, R: 6.378e6, ratio: 0.3307 };

/** The factor in front, 3GMΩ/cR², s⁻²: 7.15 × 10⁻¹². */
export const equatorFactor = (e = EARTH, c = C) => (3 * e.GM * e.omega) / (c * e.R ** 2);

/** The two parts of eq:earth: the pixel's motion, −3GMΩ/cR², and the planet's spin, +3GCΩ/cR⁴; s⁻². */
export const equatorParts = (ratio: number, e = EARTH) => ({
	motion: -equatorFactor(e),
	spin: equatorFactor(e) * ratio
});

/** eq:earth: 𝓑_xz = −(3GMΩ/cR²)(1 − C/MR²), s⁻². */
export const equatorReading = (ratio: number, e = EARTH) => -equatorFactor(e) * (1 - ratio);

/**
 * The same from the two rules, as the chapter adds them: a pixel moving with u = ΩR ŷ past the mass at rest reads
 * what a pixel at rest reads of the mass moving with −u; the spin dipole with L = C Ω ẑ, at n̂ = −x̂. Returns the
 * full table.
 */
export function equatorTable(ratio: number, e = EARTH, c = C): Mat3 {
	const M = e.GM / G;
	const n: Vec3 = [-1, 0, 0];
	const motion = magneticPoint(M, e.R, n, [0, -e.omega * e.R, 0], G, c);
	const spin = spinDipole([0, 0, ratio * M * e.R ** 2 * e.omega], e.R, n, G, c);
	return tableOf((i, j) => motion[i][j] + spin[i][j]);
}

/** The equator's readouts: the reading, its two parts, and gyroscopes 1 m apart, one above the other. */
export function equator(ratio: number, e = EARTH) {
	const reading = equatorReading(ratio, e);
	return { reading, ...equatorParts(ratio, e), gyro: Math.abs(reading) / C };
}

/** The planets the equator slider marks, C/MR². */
export const RATIO_MARKS = { earth: EARTH.ratio, uniform: BALL_RATIO, shell: SHELL_RATIO };

// --- gyroscopes ----------------------------------------------------------------------------------------------------

/** eq:gyro-pair: δΩ_i = 𝓑_ij ξ_j / c, rad s⁻¹, for gyroscopes ξ apart, in metres. */
export const gyroPair = (B: Mat3, xi: Vec3, c = C): Vec3 => apply(B, xi).map((v) => v / c) as Vec3;

// --- the passing mass ----------------------------------------------------------------------------------------------

/** The passing mass: the chapter's 70 kg person, 1 m from the pixel, to its right. */
export const PERSON = { M: 70, r: 1 };
/** The line of sight, from the pixel toward the mass. */
export const SIGHT: Vec3 = [1, 0, 0];

/** The mass's velocity in the plane of the screen: a speed, m s⁻¹, and a direction, degrees anticlockwise from n̂. */
export interface Velocity {
	speed: number;
	angle: number;
}

export const SPEED = { min: 0, max: 3, step: 0.05, key: 0.1, large: 0.5 };
/** An arrow key turns the arrow by 5°, with Shift by 15°. */
export const TURN = { key: 5, large: 15 };
/** A dragged arrow within this many degrees of the line of sight lands on it. */
export const LAND = 4;

export const velocityVector = (v: Velocity): Vec3 => [
	v.speed * cosDeg(v.angle),
	v.speed * sinDeg(v.angle),
	0
];

export const pointTables = (v: Velocity, p = PERSON) => ({
	B: magneticPoint(p.M, p.r, SIGHT, velocityVector(v)),
	E: electricPoint(p.M, p.r, SIGHT)
});

/** The readouts of the passing mass. */
export function passing(v: Velocity, p = PERSON) {
	const { B, E } = pointTables(v, p);
	const vPerp = sideways(SIGHT, velocityVector(v));
	const b = norm(B);
	const e = norm(E);
	// the gyroscopes sit on the line of sight, 1 m apart, and turn about the axis out of the screen
	const gyro = gyroPair(B, SIGHT)[2];
	return { B: b, E: e, ratio: b / e, rule: ratioRule(vPerp), vPerp, gyro };
}

/** An angle held to [0, 360). */
export const turned = (deg: number) => (((deg % 360) + 360) % 360) % 360;

/**
 * The velocity a drag sets: the arrow from the mass to the pointer, in metres per second (y up), its speed held to
 * the range on a grid of 0.05 m s⁻¹, its direction to whole degrees, landing on the line of sight within LAND°.
 */
export function dragged(dx: number, dy: number, before: Velocity): Velocity {
	const raw = Math.hypot(dx, dy);
	const speed = Math.min(SPEED.max, Math.round(raw / SPEED.step) * SPEED.step);
	if (speed === 0) return { speed: 0, angle: before.angle };
	let angle = turned(Math.round((Math.atan2(dy, dx) * 180) / Math.PI));
	for (const line of [0, 180, 360]) if (Math.abs(angle - line) <= LAND) angle = turned(line);
	return { speed: Math.round(speed * 100) / 100, angle };
}

/**
 * The velocity after a key on the arrow: Left and Right turn it anticlockwise and clockwise by 5° onto the grid of
 * that step (Shift 15°); Up and Down change the speed by 0.1 m s⁻¹ (Shift 0.5). Undefined for any other key.
 */
export function velocityKey(v: Velocity, key: string, shift: boolean): Velocity | undefined {
	if (key === 'ArrowLeft' || key === 'ArrowRight') {
		const size = shift ? TURN.large : TURN.key;
		const k =
			key === 'ArrowLeft'
				? Math.floor(v.angle / size + 1e-9) + 1
				: Math.ceil(v.angle / size - 1e-9) - 1;
		return { ...v, angle: turned(k * size) };
	}
	if (key === 'ArrowUp' || key === 'ArrowDown') {
		const r = { ...SPEED, step: SPEED.key };
		const next = stepped(v.speed, key, shift, r);
		return next === undefined ? undefined : { ...v, speed: next };
	}
	return undefined;
}

// --- the sliders ---------------------------------------------------------------------------------------------------

/** A slider's range: its own step, an arrow key's step and a step with Shift, and values a step stops at. */
export interface Range {
	min: number;
	max: number;
	step: number;
	key: number;
	large: number;
	stops?: number[];
}

/** The spin rate Ω, s⁻¹. */
export const RATE: Range = { min: 0, max: 100, step: 1, key: 1, large: 10 };
/** The inner ball's radius a/R; a step stops at the balance 2^(−1/5). */
export const INNER: Range = {
	min: 0.5,
	max: 1,
	step: 0.01,
	key: 0.01,
	large: 0.05,
	stops: [BALANCE]
};
/** The equator's C/MR², to the shell's ⅔; a step stops at the Earth's 0.3307. */
export const RATIO: Range = {
	min: 0,
	max: SHELL_RATIO,
	step: 1 / 300,
	key: 0.01,
	large: 0.05,
	stops: [EARTH.ratio, BALL_RATIO, SHELL_RATIO]
};

/**
 * A slider's value after a key: the arrows by a step, with Shift (or Page Up and Page Down) by a large one, onto the
 * grid of that step, stopping at any of the range's stops on the way; Home and End to the ends. Undefined for any
 * other key.
 */
export function stepped(v: number, key: string, shift: boolean, r: Range): number | undefined {
	if (key === 'Home') return r.min;
	if (key === 'End') return r.max;
	const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[
		key
	];
	if (dir === undefined) return undefined;
	const size = shift || key.startsWith('Page') ? r.large : r.key;
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	let next = Math.round(k * size * 1e9) / 1e9;
	for (const s of r.stops ?? [])
		if (dir > 0 ? s > v + 1e-9 && s < next : s < v - 1e-9 && s > next) next = s;
	return Math.max(r.min, Math.min(r.max, next));
}

/** A dragged slider's value: held to the range, landing on a stop within half a step of it, else on the step. */
export function landed(v: number, r: Range): number {
	const x = Math.max(r.min, Math.min(r.max, v));
	for (const s of r.stops ?? []) if (Math.abs(x - s) <= r.step / 2 + 1e-9) return s;
	if (x === r.max) return r.max;
	return Math.round((Math.round((x - r.min) / r.step) * r.step + r.min) * 1e9) / 1e9;
}

// --- the opening ---------------------------------------------------------------------------------------------------

export type Mode = 'passing' | 'spinning' | 'equator';

export const OPENING = {
	mode: 'passing' as Mode,
	velocity: { speed: 1.4, angle: 90 } as Velocity,
	body: 'ball' as Body,
	rate: 50,
	inner: 0.75,
	ratio: EARTH.ratio
};

/**
 * How much the ring's stretch is exaggerated: it is drawn as it is after 1 s, ξ → ξ(1 − ½𝓔 (1 s)²), times this
 * factor. Returns a, the drawn squeeze across; the stretch along the line is 2a.
 */
export const STRETCH = { passing: 5e7, spinning: 1e7 };
export const ringStretch = (M: number, r: number, factor: number, g = G) =>
	0.5 * ((g * M) / r ** 3) * factor;

/** How much faster than life the drawing turns the gyroscopes, and how much slower it spins the body. */
export const GYRO_FAST = { passing: 1e25, spinning: 1e24 };
export const SPIN_SLOW = 25;

// --- the predictions -----------------------------------------------------------------------------------------------

/** The first, once the mass moves straight at the pixel: a speed, along −n̂. */
export const straightAt = (v: Velocity) => v.speed > 0 && v.angle === 180;
export const noteFirst = (done: boolean, v: Velocity) => done || straightAt(v);

/** The rates at which the reader has last spun a ball and a shell. */
export interface Spun {
	ball?: number;
	shell?: number;
}

/** What has been spun, after the body and rate now shown. */
export function spun(before: Spun, body: Body, rate: number): Spun {
	if (rate <= 0 || body === 'counter') return before;
	return { ...before, [body]: rate };
}

/** The second, once a ball and a shell have been spun at the same rate. */
export const sameRate = (s: Spun) => s.ball !== undefined && s.ball === s.shell;
export const noteSecond = (done: boolean, s: Spun) => done || sameRate(s);

/** The third, once the slider has been taken to its end, the shell's ⅔. */
export const atShell = (ratio: number) => ratio >= SHELL_RATIO - 1e-12;
export const noteThird = (done: boolean, ratio: number) => done || atShell(ratio);

// --- the words -----------------------------------------------------------------------------------------------------

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const sup = (n: number) =>
	(n < 0 ? '⁻' : '') +
	String(Math.abs(n))
		.split('')
		.map((c) => SUP[Number(c)])
		.join('');

/** A number to three figures in a given power of ten, for a readout in fixed units: 9.256e-17 in 10⁻¹⁷ is "9.26". */
export const inUnits = (x: number, power: number) => {
	const m = x / 10 ** power;
	return (Math.abs(m) < 5e-4 ? 0 : m).toFixed(m !== 0 && Math.abs(m) < 0.995 ? 3 : 2);
};

/** Mantissa and exponent to three figures: 9.256e-17 is [9.26, −17]. */
export function figures(x: number): [number, number] {
	const a = Math.abs(x);
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toFixed(2));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return [x < 0 ? -m : m, e];
}

/** A number to three figures, in plain text: "9.26 × 10⁻¹⁷", "−4.79 × 10⁻¹²", "0"; between 0.01 and 1000 plainly. */
export function three(x: number): string {
	if (x === 0 || !Number.isFinite(x)) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1000) {
		const r = Number(a.toPrecision(3));
		return sign + r.toFixed(Math.max(0, 2 - Math.floor(Math.log10(r))));
	}
	const [m, e] = figures(a);
	return `${sign}${m.toFixed(2)} × 10${sup(e)}`;
}

/** The same in LaTeX. */
export const texThree = (x: number) => {
	if (x === 0 || !Number.isFinite(x)) return '0';
	const a = Math.abs(x);
	const sign = x < 0 ? '-' : '';
	if (a >= 0.01 && a < 1000) return sign + three(a);
	const [m, e] = figures(a);
	return `${sign}${m.toFixed(2)}\\times10^{${e}}`;
};

/** A ratio to three decimals, as the equator slider reads: "0.331". */
export const ratioWords = (v: number) => v.toFixed(3);
