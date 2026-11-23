/**
 * Chapter 5.1's damped wave on a line, with a slab of slower speed in its middle third:
 *
 *   (n²/c²)(∂²u/∂t² + Γ ∂u/∂t) = ∂²u/∂x²,
 *
 * the chapter's eq:damped-wave in one dimension, with the speed c outside the slab (n = 1) and c/n inside it. Units
 * are arbitrary: c = 1, the line runs from x = 0 to 18, and the slab from 6 to 12, so L = 6.
 *
 * The line is integrated by leapfrog: second differences in space and time, the damping term centred, on a grid of
 * 0.01 with the step 0.01. Outside the slab that is a Courant number of exactly 1, where leapfrog is exact for the
 * undamped equation; inside the slab it is 1/n. The integrated line extends fifteen units beyond each drawn end, and
 * its ends absorb: each obeys the one-way equation of a wave leaving, ∂u/∂t ∓ c ∂u/∂x + (Γ/2)u = 0, centred in a box
 * (Mur's condition with the damping). Without damping nothing comes back from them; with it, less than 0.1% of a
 * pulse or a train, as ./damped-wave.spec.ts measures against a line with ends forty units away. The slab's faces do
 * reflect: a wave of amplitude 1 meeting a face sends back (1 − n)/(1 + n), a fifth at n = 1.5, and the figure shows
 * it.
 *
 * A wave train comes from a source at x = 0, a force spread over a narrow Gaussian, with a part spread as its slope
 * that cancels the wave it would send left, set so that the wave it sends right has the amplitude 1 at x = 0. A
 * pulse is set on the line as d'Alembert's right-moving hump u_R(x − ct), two and a half units outside the drawn line, and the two opposite
 * pulses add the equal dip −u_R(x + ct) moving left from beyond the right end. The steady train is also solved
 * exactly, by matching e^{±ikx} across the faces, for the envelope drawn and for the tests.
 */

/** The speed outside the slab, c. */
export const SPEED = 1;
/** The drawn line, from 0 to LENGTH. */
export const LENGTH = 18;
/** The slab, the middle third of the line. */
export const SLAB = { from: 6, to: 12 };
/** The slab's thickness L. */
export const THICKNESS = SLAB.to - SLAB.from;
/** How far the integrated line runs past each drawn end. */
export const BUFFER = 15;
/** The grid's spacing and the time step. */
export const DX = 0.01;
export const DT = 0.01;

/** The sliders: the source's angular frequency ω, the damping rate Γ (0 to 0.2 of the highest ω) and the slab's n. */
export const FREQUENCY = { min: 0.5, max: 4, step: 0.05 };
export const DAMPING = { min: 0, max: 0.2 * FREQUENCY.max, step: 0.01 };
export const INDEX = { min: 1, max: 1.5, step: 0.01 };
/** Where the figure opens: weak damping, Γ/ω = 0.02, and no slab. */
export const OPENING = { omega: 1.5, Gamma: 0.03, n: 1 };

/** The pulses' width w: u_R(ξ) = e^{−ξ²/2w²}. */
export const WIDTH = 0.5;
/** How far outside the drawn line each pulse starts. */
export const LAUNCH = 2.5;
/** The time over which the source swells to its full strength, as sin². */
export const RAMP = 3;
/** The source's spread, a Gaussian of this width about x = 0. */
export const SOURCE_SPREAD = 0.05;

// --- complex numbers ------------------------------------------------------------------------------------------------

export type Complex = { re: number; im: number };
const cx = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex) => cx(a.re + b.re, a.im + b.im);
const sub = (a: Complex, b: Complex) => cx(a.re - b.re, a.im - b.im);
const mul = (a: Complex, b: Complex) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (a: Complex, s: number) => cx(a.re * s, a.im * s);
function div(a: Complex, b: Complex) {
	const d = b.re * b.re + b.im * b.im;
	return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
}
/** e^{iz}. */
function expi(z: Complex) {
	const m = Math.exp(-z.im);
	return cx(m * Math.cos(z.re), m * Math.sin(z.re));
}
/** The square root with a positive real part. */
function sqrt(z: Complex) {
	const r = Math.hypot(z.re, z.im);
	const re = Math.sqrt((r + z.re) / 2);
	const im = Math.sign(z.im || 1) * Math.sqrt(Math.max(0, (r - z.re) / 2));
	return cx(re, im);
}
export const modulus = (z: Complex) => Math.hypot(z.re, z.im);
export const argument = (z: Complex) => Math.atan2(z.im, z.re);

// --- the steady wave, exactly --------------------------------------------------------------------------------------

/**
 * The complex wavenumber of a wave driven at the real ω in the damped medium outside the slab:
 * c²k² = ω² + iΓω, so k = (ω/c)√(1 + iΓ/ω) ≈ ω/c + iΓ/2c. Inside the slab it is n times as large.
 */
export const wavenumber = (omega: number, Gamma: number, c = SPEED) =>
	scale(sqrt(cx(1, Gamma / omega)), omega / c);

/** The distance over which the amplitude falls by e, exactly: 1/Im k. Infinite without damping. */
export function amplitudeLength(omega: number, Gamma: number) {
	const k = wavenumber(omega, Gamma);
	return k.im > 0 ? 1 / k.im : Infinity;
}

/** The same at weak damping, 2c/Γ, whatever the frequency. */
export const weakAmplitudeLength = (Gamma: number, c = SPEED) => (2 * c) / Gamma;

/** The attenuation length 1/α = c/Γ, over which the energy falls by e. */
export const attenuationLength = (Gamma: number, c = SPEED) => c / Gamma;

/** The wavelength 2πc/ω outside the slab; inside it, n times shorter. */
export const wavelength = (omega: number, c = SPEED) => (2 * Math.PI * c) / omega;

/** The slab's phase lag in cycles, the chapter's (n − 1)ωL/2πc. */
export const lagCycles = (n: number, omega: number, L = THICKNESS, c = SPEED) =>
	((n - 1) * omega * L) / (2 * Math.PI * c);

/** The delay of a pulse that crosses the slab, behind one that does not: (n − 1)L/c. */
export const pulseDelay = (n: number, L = THICKNESS, c = SPEED) => ((n - 1) * L) / c;

/** The amplitude a wave keeps when it meets the slab's face from outside, (1 − n)/(1 + n), and the share of energy. */
export const faceReflection = (n: number) => (1 - n) / (1 + n);
export const faceEnergyShare = (n: number) => faceReflection(n) ** 2;

/**
 * The steady train exactly, as the complex amplitude ũ(x) of u = Re[ũ e^{−iωt}] on the drawn line, x ≥ 0, with the
 * wave the source sends of amplitude 1 at x = 0. Outside the slab ũ = e^{ik₁x} + R e^{−ik₁x} before it and
 * T e^{ik₁x} after it; inside, C e^{ik₂x} + D e^{−ik₂x} with k₂ = nk₁; u and ∂u/∂x are continuous at each face. The
 * wave reflected back passes the source and leaves by the left end. `reference` is the same line without the slab.
 */
export function steady(omega: number, Gamma: number, n: number) {
	const k1 = wavenumber(omega, Gamma);
	const k2 = scale(k1, n);
	const { from: a, to: b } = SLAB;
	const L = b - a;
	// with the wave after the slab written e^{ik₁(x − b)}
	const ratio = div(k1, k2);
	const C = scale(add(cx(1), ratio), 0.5);
	const D = scale(sub(cx(1), ratio), 0.5);
	const back = expi(scale(k2, -L));
	const fore = expi(scale(k2, L));
	const U = add(mul(C, back), mul(D, fore));
	const dU = mul(k2, sub(mul(C, back), mul(D, fore)));
	const P = scale(add(U, div(dU, k1)), 0.5);
	const Q = scale(sub(U, div(dU, k1)), 0.5);
	// the incoming wave is P e^{ik₁(x − a)}; scale so that it is 1 at x = 0
	const s = div(expi(scale(k1, a)), P);

	function at(x: number): Complex {
		if (x < a) {
			const e = expi(scale(k1, x - a));
			return mul(s, add(mul(P, e), div(Q, e)));
		}
		if (x <= b) {
			const e = expi(scale(k2, x - b));
			return mul(s, add(mul(C, e), div(D, e)));
		}
		return mul(s, expi(scale(k1, x - b)));
	}
	const reference = (x: number) => expi(scale(k1, x));
	/** The amplitude the reflected wave has at the slab's first face, over the incoming wave's there. */
	const reflection = div(Q, P);
	/** The crossing's lag in cycles, exactly, past the slab: arg(ũ/ũ_ref)/2π, on the branch nearest the formula. */
	const raw = argument(div(at(b + 1), reference(b + 1))) / (2 * Math.PI);
	const guess = lagCycles(n, omega);
	const lag = raw + Math.round(guess - raw);
	/** What the wave keeps past the slab, over the reference's amplitude there. */
	const kept = modulus(div(at(b + 1), reference(b + 1)));
	return { k1, k2, at, reference, reflection, lag, kept };
}

// --- the pulses ------------------------------------------------------------------------------------------------------

/** The hump u_R(ξ) = e^{−ξ²/2w²} and its slope. */
export const hump = (xi: number, w = WIDTH) => Math.exp((-xi * xi) / (2 * w * w));
export const humpSlope = (xi: number, w = WIDTH) => (-xi / (w * w)) * hump(xi, w);
/** The steepest slope of the hump, 1/(w√e), at ξ = ±w. */
export const steepest = (w = WIDTH) => 1 / (w * Math.sqrt(Math.E));

/** Where the pulses start: the hump left of the line, the dip right of it. */
export const START = { hump: -LAUNCH, dip: LENGTH + LAUNCH };

/**
 * When the hump reaches a point x, from its start: at the speed c outside the slab and c/n inside it. The two
 * opposite pulses meet at the middle, x = 9, at the time arrival(9, n) = 8.5 + 3n.
 */
export function arrival(x: number, n: number, c = SPEED) {
	const outside = Math.min(x, SLAB.from) - START.hump;
	const inside = Math.max(0, Math.min(x, SLAB.to) - SLAB.from);
	const after = Math.max(0, x - SLAB.to);
	return (outside + n * inside + after) / c;
}
export const MIDDLE = LENGTH / 2;
export const meeting = (n: number) => arrival(MIDDLE, n);

// --- the integrator ---------------------------------------------------------------------------------------------------

export type LineOptions = {
	n?: number;
	Gamma?: number;
	buffer?: number;
	dx?: number;
	dt?: number;
};

/**
 * The line, integrated by leapfrog from the field now, `u`, and one step ago, `old`. The update at each inner node is
 *
 *   u⁺ (1 + Γdt/2) = 2u − (1 − Γdt/2) u⁻ + (dt²/ρ)(c² δ²u/dx² + S),
 *
 * with ρ = n² averaged over the node's cell, so that a node on a face takes the mean of the two sides, and S the
 * source's force. The two end nodes take Mur's condition with the damping.
 */
export class Line {
	readonly dx: number;
	readonly dt: number;
	readonly buffer: number;
	readonly start: number;
	readonly count: number;
	readonly rho: Float64Array;
	u: Float64Array;
	old: Float64Array;
	private next: Float64Array;
	private spread: Float64Array;
	private slope: Float64Array;
	private spreadFrom = 0;
	n = 1;
	Gamma = 0;
	steps = 0;
	/** The train's source, if it is on: its ω, its phase θ and when it started. */
	source: { omega: number; theta: number; began: number } | undefined;

	constructor(options: LineOptions = {}) {
		this.dx = options.dx ?? DX;
		this.dt = options.dt ?? DT;
		this.buffer = options.buffer ?? BUFFER;
		this.start = -this.buffer;
		this.count = Math.round((LENGTH + 2 * this.buffer) / this.dx) + 1;
		this.rho = new Float64Array(this.count);
		this.u = new Float64Array(this.count);
		this.old = new Float64Array(this.count);
		this.next = new Float64Array(this.count);
		this.Gamma = options.Gamma ?? 0;
		this.setIndex(options.n ?? 1);
		// the source's spread, a normalized Gaussian about x = 0, kept over ±6 widths
		const reach = Math.ceil((6 * SOURCE_SPREAD) / this.dx);
		const centre = this.index(0);
		this.spreadFrom = centre - reach;
		this.spread = new Float64Array(2 * reach + 1);
		this.slope = new Float64Array(2 * reach + 1);
		const norm = 1 / (SOURCE_SPREAD * Math.sqrt(2 * Math.PI));
		for (let j = 0; j < this.spread.length; j++) {
			const x = this.position(this.spreadFrom + j);
			this.spread[j] = norm * Math.exp((-x * x) / (2 * SOURCE_SPREAD * SOURCE_SPREAD));
			this.slope[j] = (-x / (SOURCE_SPREAD * SOURCE_SPREAD)) * this.spread[j];
		}
	}

	get time() {
		return this.steps * this.dt;
	}

	position(i: number) {
		return this.start + i * this.dx;
	}

	index(x: number) {
		return Math.round((x - this.start) / this.dx);
	}

	/** Sets the slab's index: ρ = n² over the slab, averaged over each node's cell. */
	setIndex(n: number) {
		this.n = n;
		const h = this.dx / 2;
		for (let i = 0; i < this.count; i++) {
			const x = this.position(i);
			const overlap = Math.max(0, Math.min(x + h, SLAB.to) - Math.max(x - h, SLAB.from));
			this.rho[i] = 1 + (overlap / this.dx) * (n * n - 1);
		}
	}

	setDamping(Gamma: number) {
		this.Gamma = Gamma;
	}

	/** The line at rest and the source off; the clock goes on. */
	clear() {
		this.u.fill(0);
		this.old.fill(0);
		this.source = undefined;
	}

	/**
	 * Adds a pulse `height` · u_R(x − x₀ ∓ ct), moving right (+1) or left (−1), as d'Alembert's solution now and one
	 * step ago.
	 */
	launch(centre: number, direction: 1 | -1, height = 1, w = WIDTH) {
		const back = direction * SPEED * this.dt;
		for (let i = 0; i < this.count; i++) {
			const x = this.position(i);
			this.u[i] += height * hump(x - centre, w);
			this.old[i] += height * hump(x - centre + back, w);
		}
	}

	/** Turns the train on at ω, or changes its ω; the phase goes on without a jump. */
	drive(omega: number) {
		if (this.source) this.source.omega = omega;
		else this.source = { omega, theta: 0, began: this.time };
	}

	/**
	 * The force the source puts in at the time t, as two parts: ramp · Re[F̃ e^{−iθ}] spread as g(x), and
	 * ramp · Re[G̃ e^{−iθ}] spread as g′(x). A force F̃g + G̃g′ sends the waves ĝ(k)(F̃ ± ikG̃) e^{±ikx}/(−2ic²k) to the
	 * right and to the left, with ĝ(k) = e^{−k²σ²/2} the spread's transform; G̃ = F̃/ik silences the left one, and
	 * F̃ = −ic²k/ĝ(k) makes the right one e^{i(kx − θ)}, of amplitude 1 at x = 0. So the source sends its train one
	 * way only, and the line to its left carries only what the slab sends back.
	 */
	private force() {
		const s = this.source;
		if (!s) return undefined;
		const k = wavenumber(s.omega, this.Gamma);
		const k2 = mul(k, k);
		const q = 0.5 * SOURCE_SPREAD * SOURCE_SPREAD;
		const g = Math.exp(-q * k2.re);
		const spreadT = cx(g * Math.cos(-q * k2.im), g * Math.sin(-q * k2.im));
		const F = div(mul(cx(0, -SPEED * SPEED), k), spreadT);
		const G = div(F, mul(cx(0, 1), k));
		const tau = this.time - s.began;
		const ramp = tau >= RAMP ? 1 : Math.sin((Math.PI * tau) / (2 * RAMP)) ** 2;
		const c = Math.cos(s.theta);
		const n = Math.sin(s.theta);
		return { mono: ramp * (F.re * c + F.im * n), di: ramp * (G.re * c + G.im * n) };
	}

	/** One step of the leapfrog. */
	step() {
		const { u, old, next, rho, count, dt, dx } = this;
		const nu2 = (SPEED * dt) ** 2 / (dx * dx);
		const damp = (this.Gamma * dt) / 2;
		const inv = 1 / (1 + damp);
		const keep = 1 - damp;
		for (let i = 1; i < count - 1; i++) {
			next[i] =
				(2 * u[i] - keep * old[i] + (nu2 / rho[i]) * (u[i + 1] - 2 * u[i] + u[i - 1])) * inv;
		}
		const F = this.force();
		if (F) {
			const a = dt * dt * F.mono * inv;
			const b = dt * dt * F.di * inv;
			for (let j = 0; j < this.spread.length; j++)
				next[this.spreadFrom + j] +=
					(a * this.spread[j] + b * this.slope[j]) / rho[this.spreadFrom + j];
		}
		// the ends: ∂u/∂t ∓ c∂u/∂x + (Γ/2)u = 0, centred in the box between the last two nodes and the two times
		const nu = (SPEED * dt) / dx;
		const g = (this.Gamma * dt) / 4;
		const end = (a: number, b: number) => {
			next[a] =
				(-next[b] * (1 - nu + g) + u[a] * (1 - nu - g) + u[b] * (1 + nu - g)) / (1 + nu + g);
		};
		end(0, 1);
		end(count - 1, count - 2);
		this.old = u;
		this.u = next;
		this.next = old;
		this.steps += 1;
		if (this.source) this.source.theta += this.source.omega * dt;
	}

	advance(steps: number) {
		for (let s = 0; s < steps; s++) this.step();
	}

	/** The field at x, between the nodes linearly. */
	value(x: number) {
		const f = (x - this.start) / this.dx;
		const i = Math.max(0, Math.min(this.count - 2, Math.floor(f)));
		const t = f - i;
		return (1 - t) * this.u[i] + t * this.u[i + 1];
	}

	/** The velocity ∂u/∂t at a node, half a step ago: (u − u⁻)/dt. */
	velocity(i: number) {
		return (this.u[i] - this.old[i]) / this.dt;
	}

	/**
	 * The energy of the line half a step ago, per unit of the medium's ρ/n²: Σ ½ρ(∂u/∂t)² dx + Σ ½c²(δu⁺)(δu)/dx,
	 * which the leapfrog keeps exactly without damping, while nothing reaches the ends.
	 */
	energy() {
		const { u, old, rho, count, dt, dx } = this;
		let kinetic = 0;
		let elastic = 0;
		for (let i = 0; i < count; i++) {
			const v = (u[i] - old[i]) / dt;
			kinetic += 0.5 * rho[i] * v * v;
		}
		for (let i = 0; i < count - 1; i++)
			elastic += (0.5 * SPEED * SPEED * (u[i + 1] - u[i]) * (old[i + 1] - old[i])) / (dx * dx);
		return (kinetic + elastic) * dx;
	}
}

/**
 * The figure's four lines: the wave from the left and the wave from the right, each with the slab and without it, so
 * that the two opposite pulses can be drawn apart and summed, and the reference drawn behind.
 */
export type Scene = {
	mode: 'train' | 'pulse' | 'pair';
	hump: Line;
	dip: Line;
	humpRef: Line;
	dipRef: Line;
};

export function scene(omega: number, Gamma: number, n: number): Scene {
	const make = (index: number) => new Line({ n: index, Gamma });
	const s: Scene = {
		mode: 'train',
		hump: make(n),
		dip: make(n),
		humpRef: make(1),
		dipRef: make(1)
	};
	s.hump.drive(omega);
	s.humpRef.drive(omega);
	return s;
}

const lines = (s: Scene) => [s.hump, s.dip, s.humpRef, s.dipRef];

/** The clock, shared by the four lines. */
export const sceneTime = (s: Scene) => s.hump.time;

export function setIndex(s: Scene, n: number) {
	s.hump.setIndex(n);
	s.dip.setIndex(n);
}

export function setDamping(s: Scene, Gamma: number) {
	for (const l of lines(s)) l.setDamping(Gamma);
}

export function setFrequency(s: Scene, omega: number) {
	if (s.mode !== 'train') return;
	s.hump.drive(omega);
	s.humpRef.drive(omega);
}

/** Replaces what is on the line with a new train, a pulse or the two opposite pulses. */
export function send(s: Scene, mode: Scene['mode'], omega: number) {
	for (const l of lines(s)) l.clear();
	s.mode = mode;
	if (mode === 'train') {
		s.hump.drive(omega);
		s.humpRef.drive(omega);
		return;
	}
	s.hump.launch(START.hump, 1);
	s.humpRef.launch(START.hump, 1);
	if (mode === 'pair') {
		s.dip.launch(START.dip, -1, -1);
		s.dipRef.launch(START.dip, -1, -1);
	}
}

/** Steps the scene; the lines from the right only while they carry the dip. */
export function advanceScene(s: Scene, steps: number) {
	for (let k = 0; k < steps; k++) {
		s.hump.step();
		s.humpRef.step();
		if (s.mode === 'pair') {
			s.dip.step();
			s.dipRef.step();
		} else {
			s.dip.steps += 1;
			s.dipRef.steps += 1;
		}
	}
}

/** The line's displacement and velocity at a node, summed over the waves from the two sides. */
export function total(s: Scene, i: number, reference = false) {
	const a = reference ? s.humpRef : s.hump;
	const b = reference ? s.dipRef : s.dip;
	const pair = s.mode === 'pair';
	return {
		u: a.u[i] + (pair ? b.u[i] : 0),
		v: a.velocity(i) + (pair ? b.velocity(i) : 0)
	};
}

/**
 * Fits a + b cos ωt + c sin ωt to samples u(t) over whole numbers of steps, by least squares, and returns the
 * complex amplitude ũ = b + ic of u = Re[ũ e^{−iωt}].
 */
export function fitPhasor(times: number[], values: number[], omega: number): Complex {
	// the normal equations of the three columns 1, cos, sin
	const M = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	const r = [0, 0, 0];
	for (let j = 0; j < times.length; j++) {
		const row = [1, Math.cos(omega * times[j]), Math.sin(omega * times[j])];
		for (let p = 0; p < 3; p++) {
			r[p] += row[p] * values[j];
			for (let q = 0; q < 3; q++) M[p][q] += row[p] * row[q];
		}
	}
	// Gaussian elimination
	for (let p = 0; p < 3; p++) {
		for (let q = p + 1; q < 3; q++) {
			const f = M[q][p] / M[p][p];
			for (let k = p; k < 3; k++) M[q][k] -= f * M[p][k];
			r[q] -= f * r[p];
		}
	}
	const x = [0, 0, 0];
	for (let p = 2; p >= 0; p--) {
		let sum = r[p];
		for (let k = p + 1; k < 3; k++) sum -= M[p][k] * x[k];
		x[p] = sum / M[p][p];
	}
	return cx(x[1], x[2]);
}
