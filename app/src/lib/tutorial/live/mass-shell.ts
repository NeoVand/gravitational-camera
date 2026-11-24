/**
 * Chapter 6.4's mass shell in light-cone form. A body of rest mass m moves along z and across it, with the energy E,
 * the momentum p_z along z and p_⊥ across it, here along one sideways direction x, so that p_⊥ has a sign. Its
 * light-cone components are
 *
 *   q = E/c − p_z,   w = E/c + p_z,
 *
 * and the chapter's eq:lc-product says q w = m²c² + p_⊥², the mass shell. A boost along z multiplies q and w by
 * e^{±η}; a sideways kick that keeps q, as the paper's impulsive wave does, moves the body along a line of constant
 * q onto the shell of its new p_⊥, and gives it the energy ΔE = (c/2q)Δ(p_⊥²) of eq:kick. The wave's kick is
 * Δp_⊥ = ½q∇H, with ∇H the gradient of its profile across the front, a pure number.
 *
 * For a body of several particles a, Q = Σq_a, and the chapter's eq:mass-lc gives its rest mass as a sum and a
 * weighted variance, 𝓜²c² = Q Σ m_a²c²/q_a + Q² Var(p_⊥/q), with the weights q_a/Q. A wave and its reverse together
 * raise it by eq:even-mass, 𝓜₊² + 𝓜₋² − 2𝓜₀² = Q² Var(∇H)/2c² ≥ 0.
 *
 * Every quantity is in units of the body's own: momenta in mc, energies in mc², masses in m, so that c = m = 1.
 */

export const LN2 = Math.LN2;

/** The light-cone axes run from 0 to SPAN, in units of mc. */
export const SPAN = 3;

/** The rapidity slider: its range, its step, the arrow keys' step, Page Up's, and how near a named value it lands. */
export const RAPIDITY = { min: -2, max: 2, step: 0.01, key: 0.05, page: 0.5, snap: 0.0075 };
/** The rapidities the slider lands on exactly: 0.6c along −z, rest, and 0.6c along +z. */
export const NAMED = [-LN2, 0, LN2];
/** A momentum slider, p_⊥ or p_z, in units of mc. */
export const MOMENTUM = { min: -1.5, max: 1.5, step: 0.01, key: 0.05, page: 0.5 };
/** The slider for the size of the wave's gradient, |∇H|. */
export const GRADIENT = { min: 0, max: 2, step: 0.01, key: 0.05, page: 0.5 };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The whole number k with η = k ln 2, if η is one (to the last bits of a double), for |k| ≤ 8. */
export function lnTwos(eta: number): number | undefined {
	const k = Math.round(eta / LN2);
	if (Math.abs(k) > 8) return undefined;
	return Math.abs(eta - k * LN2) <= 1e-12 * Math.max(1, Math.abs(eta)) ? k : undefined;
}

/** e^η, exactly a power of two when η is a whole number of ln 2. */
export function expEta(eta: number): number {
	const k = lnTwos(eta);
	return k === undefined ? Math.exp(eta) : 2 ** k;
}

/** cosh η, sinh η and tanh η, from e^η: exact fractions at η = k ln 2, so cosh(ln 2) = 5/4 and sinh(ln 2) = 3/4. */
export function hyper(eta: number): { cosh: number; sinh: number; tanh: number } {
	if (lnTwos(eta) === undefined) {
		return { cosh: Math.cosh(eta), sinh: Math.sinh(eta), tanh: Math.tanh(eta) };
	}
	const e = expEta(eta);
	return { cosh: (e + 1 / e) / 2, sinh: (e - 1 / e) / 2, tanh: (e * e - 1) / (e * e + 1) };
}

// --- one body --------------------------------------------------------------------------------------------------------

/** A body on its mass shell, in units of mc: E/c, p_z, p_⊥, and its light-cone components q and w = E/c + p_z. */
export type Body = { m: number; e: number; pz: number; perp: number; q: number; w: number };

/** m²c² + p_⊥², the product q w that the shell requires. */
export const shellProduct = (m: number, perp: number) => m * m + perp * perp;

/** √(m²c² + p_⊥²): q and w at p_z = 0, and the scale of the hyperbola of a given p_⊥. */
export const transverseMass = (m: number, perp: number) => Math.sqrt(shellProduct(m, perp));

/** The body with the light-cone component q and the sideways momentum p_⊥: w = (m²c² + p_⊥²)/q fixes the rest. */
export function fromQ(q: number, perp: number, m = 1): Body {
	const w = shellProduct(m, perp) / q;
	return { m, e: (q + w) / 2, pz: (w - q) / 2, perp, q, w };
}

/**
 * The body moving along z with the rapidity η and across it with p_⊥: E/c = m_⊥c cosh η and p_z = m_⊥c sinh η,
 * so that q = m_⊥c e^{−η} and w = m_⊥c e^{η}, with m_⊥c = √(m²c² + p_⊥²). Its velocity along z is c tanh η.
 */
export function fromRapidity(eta: number, perp: number, m = 1): Body {
	const mt = transverseMass(m, perp);
	const { cosh, sinh } = hyper(eta);
	const e = expEta(eta);
	return { m, e: mt * cosh, pz: mt * sinh, perp, q: mt / e, w: mt * e };
}

/** The body from its momenta: E/c = √(m²c² + p_⊥² + p_z²), and q, w formed without cancellation. */
export function fromMomenta(perp: number, pz: number, m = 1): Body {
	const s = shellProduct(m, perp);
	const e = Math.sqrt(s + pz * pz);
	// the larger of E/c ± p_z directly, the smaller as the product over it
	const q = pz <= 0 ? e - pz : s / (e + pz);
	const w = pz >= 0 ? e + pz : s / (e - pz);
	return { m, e, pz, perp, q, w };
}

/** The body's rapidity along z, ½ ln(w/q). */
export const rapidityOf = (b: Body) => 0.5 * Math.log(b.w / b.q);

/** The body's velocity along z over c, p_z c/E. */
export const betaZ = (b: Body) => b.pz / b.e;

/** The body's velocity across z over c, p_⊥c/E. */
export const betaPerp = (b: Body) => b.perp / b.e;

/** The shell's mismatch, q w − (m²c² + p_⊥²): zero on the shell. */
export const offShell = (b: Body) => b.q * b.w - shellProduct(b.m, b.perp);

/** The rest mass from the four-momentum, (E/c)² − p_z² − p_⊥², for a check against m². */
export const massSquared = (b: Body) => b.e * b.e - b.pz * b.pz - b.perp * b.perp;

/**
 * The same body for an observer moving along z with the rapidity η: by eq:lc-boost the light-cone components are
 * multiplied, q′ = e^{η}q and w′ = e^{−η}w, and p_⊥ is unchanged.
 */
export function boosted(b: Body, eta: number): Body {
	const e = expEta(eta);
	const q = b.q * e;
	const w = b.w / e;
	return { m: b.m, e: (q + w) / 2, pz: (w - q) / 2, perp: b.perp, q, w };
}

/** The same, by the boost table on (E/c, p_z): E′/c = cosh η E/c − sinh η p_z, p′_z = cosh η p_z − sinh η E/c. */
export function lorentz(b: Body, eta: number): { e: number; pz: number } {
	const { cosh, sinh } = hyper(eta);
	return { e: cosh * b.e - sinh * b.pz, pz: cosh * b.pz - sinh * b.e };
}

// --- the kick --------------------------------------------------------------------------------------------------------

export type KickMode = 'wave' | 'fixed';

/**
 * The sideways momentum a kick gives: the wave's Δp_⊥ = ½q∇H, or a fixed Δp_⊥ = ½mc∇H, the same for every body,
 * with ∇H signed along x.
 */
export const kickOf = (b: Body, gradient: number, mode: KickMode) =>
	0.5 * (mode === 'wave' ? b.q : b.m) * gradient;

/** The body after a sideways kick dp that keeps q and m: on the shell of p_⊥ + dp, along the line of its q. */
export const kicked = (b: Body, dp: number): Body => fromQ(b.q, b.perp + dp, b.m);

/** The chapter's eq:kick, ΔE = (c/2q)(|p_⊥ + Δp_⊥|² − p_⊥²), in units of mc². */
export function energyGain(b: Body, dp: number): number {
	const after = b.perp + dp;
	// (a² − b²) as (a − b)(a + b), so that a small kick is not lost to cancellation
	return (dp * (after + b.perp)) / (2 * b.q);
}

/** Newton's rule of chapter 1.7, v_⊥Δp_⊥ + |Δp_⊥|²/2m, with the body's sideways velocity v_⊥ = p_⊥c²/E. */
export const newtonGain = (b: Body, dp: number) => betaPerp(b) * dp + (dp * dp) / (2 * b.m);

/** The gain of a body that crosses the front head-on, p_⊥ = 0, under the wave's kick: ⅛cq|∇H|². */
export const headOnGain = (q: number, gradient: number) => (q * gradient * gradient) / 8;

// --- two lumps -------------------------------------------------------------------------------------------------------

/** One lump of the pair, set by its momenta in units of mc; each has the rest mass m. */
export type Lump = { perp: number; pz: number };

/** The pair of Appendix C: two lumps flying apart across z with |p_⊥| = ¾mc, and p_z = 0. */
export const APP_C: [Lump, Lump] = [
	{ perp: 0.75, pz: 0 },
	{ perp: -0.75, pz: 0 }
];

export const sameLumps = (a: Lump[], b: Lump[]) =>
	a.length === b.length && a.every((l, i) => l.perp === b[i].perp && l.pz === b[i].pz);

/** The weighted mean and variance of the values x_a with the weights w_a, which need not add up to 1. */
export function weighted(values: number[], weights: number[]): { mean: number; variance: number } {
	const total = weights.reduce((s, w) => s + w, 0);
	const mean = values.reduce((s, x, i) => s + weights[i] * x, 0) / total;
	// the mean square distance from the mean: never negative, as ⟨x²⟩ − ⟨x⟩² can be by rounding
	const variance = values.reduce((s, x, i) => s + weights[i] * (x - mean) ** 2, 0) / total;
	return { mean, variance };
}

/** What the chapter's readouts of a body of several particles hold, in units of mc and m²c². */
export type Stats = {
	/** Q = Σq_a. */
	Q: number;
	/** The first term, Q Σ m_a²c²/q_a. */
	first: number;
	/** The values p_⊥a/q_a, their weights q_a/Q, and their weighted mean and variance. */
	x: number[];
	weights: number[];
	mean: number;
	variance: number;
	/** Q² Var(p_⊥/q). */
	spread: number;
	/** 𝓜²c² from eq:mass-lc, the sum of the two terms, and from eq:system-mass, (ΣE/c)² − |Σp|². */
	sum: number;
	direct: number;
	/** 𝓜, in m, from each. */
	massSum: number;
	massDirect: number;
};

export function stats(bodies: Body[]): Stats {
	const Q = bodies.reduce((s, b) => s + b.q, 0);
	const first = Q * bodies.reduce((s, b) => s + (b.m * b.m) / b.q, 0);
	const x = bodies.map((b) => b.perp / b.q);
	const weights = bodies.map((b) => b.q / Q);
	const { mean, variance } = weighted(x, weights);
	const spread = Q * Q * variance;
	const sum = first + spread;
	const E = bodies.reduce((s, b) => s + b.e, 0);
	const pz = bodies.reduce((s, b) => s + b.pz, 0);
	const perp = bodies.reduce((s, b) => s + b.perp, 0);
	const direct = E * E - pz * pz - perp * perp;
	return {
		Q,
		first,
		x,
		weights,
		mean,
		variance,
		spread,
		sum,
		direct,
		massSum: Math.sqrt(sum),
		massDirect: Math.sqrt(Math.max(0, direct))
	};
}

export const lumpBodies = (lumps: Lump[], m = 1) => lumps.map((l) => fromMomenta(l.perp, l.pz, m));

/** The wave that stops the lumps' motion across z: ∇H = −2p_⊥/q at each, so that ½q∇H = −p_⊥. */
export const stoppingWave = (bodies: Body[]) => bodies.map((b) => (-2 * b.perp) / b.q);

/** The lumps after a wave with the gradient ∇H_a at each: the kick ½q_a∇H_a, which keeps every q_a. */
export const afterWave = (bodies: Body[], gradients: number[]) =>
	bodies.map((b, i) => kicked(b, 0.5 * b.q * gradients[i]));

export type Wave = 'none' | 'stop' | 'reverse';

/** The lumps under no wave, the wave that stops them, or its reverse, with −∇H. */
export function underWave(bodies: Body[], wave: Wave): Body[] {
	if (wave === 'none') return bodies;
	const g = stoppingWave(bodies);
	return afterWave(bodies, wave === 'stop' ? g : g.map((v) => -v));
}

/**
 * The chapter's eq:even-mass for the wave that stops the lumps: 𝓜₀², 𝓜₊² after the wave and 𝓜₋² after its reverse,
 * the left side 𝓜₊² + 𝓜₋² − 2𝓜₀², and the right side Q² Var(∇H)/2c², with the weights q_a/Q; all in m².
 */
export function evenMass(bodies: Body[]) {
	const g = stoppingWave(bodies);
	const zero = stats(bodies);
	const plus = stats(afterWave(bodies, g));
	const minus = stats(
		afterWave(
			bodies,
			g.map((v) => -v)
		)
	);
	const { variance } = weighted(
		g,
		bodies.map((b) => b.q)
	);
	return {
		gradients: g,
		zero: zero.sum,
		plus: plus.sum,
		minus: minus.sum,
		left: plus.sum + minus.sum - 2 * zero.sum,
		right: (zero.Q * zero.Q * variance) / 2,
		gradientVariance: variance
	};
}

// --- the sliders -----------------------------------------------------------------------------------------------------

/** A rapidity the reader asks for, kept in range and landing exactly on a named one within the snap. */
export function landed(v: number): number {
	const eta = clamp(v, RAPIDITY.min, RAPIDITY.max);
	for (const name of NAMED) if (Math.abs(eta - name) < RAPIDITY.snap) return name;
	return Math.round(eta * 1e6) / 1e6;
}

/** A value on a slider's grid of hundredths, within its range. */
export const hundredths = (v: number, range: { min: number; max: number }) =>
	Math.round(clamp(v, range.min, range.max) * 100) / 100;

/** One press of a key on a slider: the next point of the key's grid, with step the key's size. */
export function keyed(v: number, direction: number, step: number): number {
	const next = Math.round((v + direction * step) / step) * step;
	return Math.round(next * 1e9) / 1e9;
}

// --- the predictions -------------------------------------------------------------------------------------------------

/** A slow body: |v_z| at most a tenth of c. A fast one along the wave's direction: v_z at least 0.6c, the chapter's. */
export const SLOW = 0.1;
export const FAST = 0.6;

/** What the reader has set in the first tab. */
export type OneSettings = {
	eta: number;
	perp: number;
	gradient: number;
	mode: KickMode;
	kick: boolean;
};

/** A gain seen: the body's rapidity, its q and the energy the wave gave it. */
export type Gain = { eta: number; q: number; gain: number };

/**
 * The first prediction is answered once the reader has kicked, with the wave's kick and one |∇H| > 0, a body with no
 * sideways motion both slow and fast along +z. The record is kept for one |∇H| and starts again when it changes; of
 * the slow bodies it keeps the slowest.
 */
export type FirstSeen = {
	gradient: number;
	slow: Gain | undefined;
	fast: Gain | undefined;
	done: { gradient: number; slow: Gain; fast: Gain } | undefined;
};

export const FIRST_START: FirstSeen = {
	gradient: 0,
	slow: undefined,
	fast: undefined,
	done: undefined
};

export function noteFirst(seen: FirstSeen, s: OneSettings): FirstSeen {
	if (seen.done) return seen;
	if (!s.kick || s.mode !== 'wave' || s.perp !== 0 || s.gradient <= 0) return seen;
	const base = seen.gradient === s.gradient ? seen : { ...FIRST_START, gradient: s.gradient };
	const b = fromRapidity(s.eta, 0);
	const gain: Gain = { eta: s.eta, q: b.q, gain: energyGain(b, kickOf(b, s.gradient, 'wave')) };
	const beta = betaZ(b);
	// the slowest body seen stands for the slow one
	const slower = !base.slow || Math.abs(s.eta) <= Math.abs(base.slow.eta);
	const slow = Math.abs(beta) <= SLOW && slower ? gain : base.slow;
	const fast = beta >= FAST - 1e-12 ? gain : base.fast;
	const done = slow && fast ? { gradient: s.gradient, slow, fast } : undefined;
	return { gradient: s.gradient, slow, fast, done };
}

/** The numbers of the first answer: the two gains, their ratio, which is the ratio of the q's, and the 0.6c case. */
export function firstAnswer(done: { gradient: number; slow: Gain; fast: Gain }) {
	const rest = headOnGain(1, done.gradient);
	const atLn2 = headOnGain(fromRapidity(LN2, 0).q, done.gradient);
	return {
		gradient: done.gradient,
		slow: done.slow,
		fast: done.fast,
		ratio: done.fast.gain / done.slow.gain,
		rest,
		atLn2
	};
}

/**
 * The second is answered once the reader has applied, to one pair whose lumps move apart across z, both the wave
 * that stops them and its reverse. The record is forgotten when the pair moves.
 */
export type SecondSeen = {
	stop: boolean;
	reverse: boolean;
	done: Lump[] | undefined;
};

export const SECOND_START: SecondSeen = { stop: false, reverse: false, done: undefined };

/** Var(p_⊥/q) below this is no spread: the stopping wave then does nothing. */
export const NO_SPREAD = 1e-12;

export function noteSecond(
	seen: SecondSeen,
	wave: Wave,
	lumps: Lump[],
	moved: boolean
): SecondSeen {
	if (seen.done) return seen;
	const base = moved ? SECOND_START : seen;
	const spread = stats(lumpBodies(lumps)).variance > NO_SPREAD;
	const stop = base.stop || (spread && wave === 'stop');
	const reverse = base.reverse || (spread && wave === 'reverse');
	return { stop, reverse, done: stop && reverse ? lumps.map((l) => ({ ...l })) : undefined };
}

/** The numbers of the second answer, for the pair that answered it, in m. */
export function secondAnswer(lumps: Lump[]) {
	const e = evenMass(lumpBodies(lumps));
	return {
		zero: Math.sqrt(e.zero),
		plus: Math.sqrt(e.plus),
		minus: Math.sqrt(e.minus),
		left: e.left,
		right: e.right,
		appC: sameLumps(lumps, APP_C)
	};
}

// --- the words -------------------------------------------------------------------------------------------------------

/** A number to three figures, with a true minus sign; zero as 0. */
export function three(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	return v.toPrecision(3).replace('-', '−');
}

/** The same for LaTeX. */
export const threeTex = (v: number) => three(v).replace('−', '-');

/** A rapidity, as "ln 2" when it is one, in LaTeX. */
export function etaTex(eta: number): string {
	const k = lnTwos(eta);
	if (k === undefined) return threeTex(eta);
	if (k === 0) return '0';
	const name = Math.abs(k) === 1 ? '\\ln 2' : `\\ln ${2 ** Math.abs(k)}`;
	return `${k < 0 ? '-' : ''}${name} = ${threeTex(eta)}`;
}

/** The same in plain words, with a true minus sign. */
export const etaWords = (eta: number) => etaTex(eta).replace('\\ln ', 'ln ').replace(/-/g, '−');

/** A slider's value to two decimals, with a true minus sign. */
export function two(v: number): string {
	const s = v.toFixed(2);
	return (s === '-0.00' ? '0.00' : s).replace('-', '−');
}

// --- the drawing -----------------------------------------------------------------------------------------------------

/**
 * The drawing's ordinary coordinates of a point of light-cone components (q, w): p_z = (w − q)/2 across and
 * E/c = (q + w)/2 up, so that the q axis runs up and to the left and the w axis up and to the right, at 45°.
 */
export const toPlane = (q: number, w: number) => ({ pz: (w - q) / 2, e: (q + w) / 2 });

/** The panel shows p_z from −HALF to HALF across and E/c from 0 to SPAN up, in units of mc. */
export const HALF = SPAN / 2;

/**
 * The hyperbola q w = s across the panel, as points (q, w), evenly spaced in the rapidity t = ½ ln(w/q), with
 * p_z = √s sinh t and E/c = √s cosh t, out to the panel's edges; none when it lies above the panel.
 */
export function shellCurve(s: number, count = 96, span = SPAN): { q: number; w: number }[] {
	const r = Math.sqrt(s);
	if (r >= span) return [];
	const hi = Math.min(Math.asinh(span / 2 / r), Math.acosh(span / r));
	const out: { q: number; w: number }[] = [];
	for (let j = 0; j <= count; j++) {
		const t = -hi + (2 * hi * j) / count;
		out.push({ q: r * Math.exp(-t), w: r * Math.exp(t) });
	}
	return out;
}

/** Whether the point of light-cone components (q, w) lies on the panel, within a small margin. */
export function onPanel(q: number, w: number, span = SPAN): boolean {
	const { pz, e } = toPlane(q, w);
	return Math.abs(pz) <= span / 2 + 1e-9 && e <= span + 1e-9;
}

/** The place drawn for a point off the panel: on its edge, along the line from the panel's centre, in (p_z, E/c). */
export function pinned(q: number, w: number, span = SPAN): { pz: number; e: number; off: boolean } {
	const p = toPlane(q, w);
	if (onPanel(q, w, span)) return { ...p, off: false };
	const c = span / 2;
	const dz = p.pz;
	const de = p.e - c;
	const k = c / Math.max(Math.abs(dz), Math.abs(de));
	return { pz: dz * k, e: c + de * k, off: true };
}
