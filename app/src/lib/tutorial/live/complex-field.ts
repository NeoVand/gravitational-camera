/**
 * Chapter 6.6's complex field at one point. A sensor of light reads the electric field E and c times the magnetic
 * field B, two real arrows in the same unit, and the chapter joins them into one complex arrow,
 *
 *   F = E + icB.
 *
 * A sensor that moves with the rapidity η along the unit vector û reads, by the chapter's eq:boost-F,
 *
 *   F′∥ = F∥,   F′⊥ = cosh η F⊥ − i sinh η û × F,
 *
 * and a sensor whose axes are turned by θ about û reads, by the same rule with cos θ and sin θ,
 *
 *   F′∥ = F∥,   F′⊥ = cos θ F⊥ − sin θ û × F.
 *
 * Both keep F·F = E² − c²B² + 2icE·B; only the turn keeps the Hermitian length F*·F = E² + c²B². Light's two
 * principal null directions are the roots of m(z)·F = 0, the quadratic (iF_y − F_x)z² − 2F_z z + (F_x + iF_y) = 0,
 * which coincide exactly when F·F = 0. The fields are in an arbitrary unit, the field of the opening charge being 1.
 * The rapidity lands exactly on ln 2, so that cosh η = 5/4 and sinh η = 3/4 as in the chapter.
 */
import { LN2, hyper, lnTwos, three } from './lorentz-diagram';

export { LN2, three };

// --- arrows and complex numbers --------------------------------------------------------------------------------------

export type V3 = [number, number, number];
export type C = { re: number; im: number };

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (k: number, a: V3): V3 => [k * a[0], k * a[1], k * a[2]];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
export const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a: V3): V3 => {
	const n = norm(a);
	return n > 0 ? scale(1 / n, a) : [0, 0, 0];
};

export const cx = (re: number, im = 0): C => ({ re, im });
export const cadd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
export const csub = (a: C, b: C): C => ({ re: a.re - b.re, im: a.im - b.im });
export const cmul = (a: C, b: C): C => ({
	re: a.re * b.re - a.im * b.im,
	im: a.re * b.im + a.im * b.re
});
export const cscale = (k: number, a: C): C => ({ re: k * a.re, im: k * a.im });
export const conj = (a: C): C => ({ re: a.re, im: -a.im });
export const cabs = (a: C) => Math.hypot(a.re, a.im);
export function cdiv(a: C, b: C): C {
	const d = b.re * b.re + b.im * b.im;
	return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
}
/** The square root with a non-negative real part. */
export function csqrt(a: C): C {
	const r = cabs(a);
	if (r === 0) return { re: 0, im: 0 };
	const re = Math.sqrt((r + a.re) / 2);
	const im = Math.sqrt(Math.max(0, (r - a.re) / 2));
	return { re, im: a.im < 0 ? -im : im };
}

/** The axes of the room, which are the sensor's axes before it turns. */
export type Axis = 'x' | 'y' | 'z';
export const AXES: Record<Axis, V3> = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };

// --- the field ---------------------------------------------------------------------------------------------------------

/** The two real arrows a sensor reads: E, and B as cB, in the unit of E. */
export type Field = { E: V3; B: V3 };

/** The three complex components of F = E + icB. */
export const complexOf = (f: Field): [C, C, C] => [
	cx(f.E[0], f.B[0]),
	cx(f.E[1], f.B[1]),
	cx(f.E[2], f.B[2])
];

/** The field with the complex components F. */
export const fieldOf = (F: [C, C, C]): Field => ({
	E: [F[0].re, F[1].re, F[2].re],
	B: [F[0].im, F[1].im, F[2].im]
});

/** F·F, without conjugates: E² − c²B² + 2icE·B, the same for every observer. */
export const square = (f: Field): C => cx(dot(f.E, f.E) - dot(f.B, f.B), 2 * dot(f.E, f.B));

/** The two real invariants, E² − c²B² and cE·B. */
export const invariants = (f: Field) => ({
	difference: dot(f.E, f.E) - dot(f.B, f.B),
	product: dot(f.E, f.B)
});

/** The Hermitian length F*·F = E² + c²B², twice the energy density over ε₀; not kept by a boost. */
export const hermitian = (f: Field) => dot(f.E, f.E) + dot(f.B, f.B);

/** E × cB, half of i F × F*: along the flow of energy. */
export const flow = (f: Field) => cross(f.E, f.B);

/**
 * The reading of a sensor that moves with the rapidity η along the unit vector û, by eq:boost-F. With
 * û × F = û × E + i û × cB, the rule −i sinh η û × F gives sinh η û × cB to E and −sinh η û × E to cB.
 */
export function boostField(f: Field, u: V3, eta: number): Field {
	if (eta === 0) return f;
	const { cosh, sinh } = hyper(eta);
	const part = (v: V3, w: V3, sign: number): V3 => {
		const along = scale(dot(v, u), u);
		const across = sub(v, along);
		return add(add(along, scale(cosh, across)), scale(sign * sinh, cross(u, w)));
	};
	return { E: part(f.E, f.B, 1), B: part(f.B, f.E, -1) };
}

/** cos θ and sin θ of an angle in degrees, exact at whole quarter turns. */
export function turnTrig(deg: number): { cos: number; sin: number } {
	const q = deg / 90;
	if (Number.isInteger(q)) {
		const k = ((q % 4) + 4) % 4;
		return { cos: [1, 0, -1, 0][k], sin: [0, 1, 0, -1][k] };
	}
	const t = (deg * Math.PI) / 180;
	return { cos: Math.cos(t), sin: Math.sin(t) };
}

/** An arrow read by a sensor whose axes are turned by θ (degrees) about û: v∥ kept, v⊥ → cos θ v⊥ − sin θ û × v. */
export function turnVector(v: V3, u: V3, deg: number): V3 {
	if (deg === 0) return v;
	const { cos, sin } = turnTrig(deg);
	const along = scale(dot(v, u), u);
	return add(add(along, scale(cos, sub(v, along))), scale(-sin, cross(u, v)));
}

export const turnField = (f: Field, u: V3, deg: number): Field => ({
	E: turnVector(f.E, u, deg),
	B: turnVector(f.B, u, deg)
});

// --- the parallel frame ------------------------------------------------------------------------------------------------

/**
 * The frame in which E and B are parallel, by eq:aligned: with ẑ along E × B and m = (e₁ + ie₂)/√2 across it,
 * F = f m + g m*, f = F·m*, g = F·m, and the boost along E × B with e^{2η} = |f|/|g|. None for a null field, nor
 * for one whose fields are parallel already (or zero).
 */
export function parallelFrame(
	f: Field
): { u: V3; eta: number; beta: number; f: C; g: C } | undefined {
	const h = hermitian(f);
	const w = flow(f);
	if (h === 0 || norm(w) <= 1e-12 * h) return undefined;
	if (cabs(square(f)) <= 1e-12 * h) return undefined;
	const n = unit(w);
	const e1 = unit(norm(f.E) > 0 ? f.E : f.B);
	const e2 = cross(n, e1);
	const r = Math.SQRT1_2;
	const fm = cx(r * (dot(f.E, e1) + dot(f.B, e2)), r * (dot(f.B, e1) - dot(f.E, e2)));
	const gm = cx(r * (dot(f.E, e1) - dot(f.B, e2)), r * (dot(f.B, e1) + dot(f.E, e2)));
	const eta = 0.5 * Math.log(cabs(fm) / cabs(gm));
	return { u: n, eta, beta: Math.tanh(eta), f: fm, g: gm };
}

/** Whether E and cB lie along one line (or one is zero), to `tol` of the Hermitian length. */
export function parallel(f: Field, tol = 0.005): boolean {
	const h = hermitian(f);
	return h > 0 && norm(flow(f)) <= tol * h;
}

// --- the plane wave ----------------------------------------------------------------------------------------------------

/** The wave travels along k̂ = ẑ, with e₁ = x̂ and e₂ = ŷ, so m = (1, i, 0)/√2. */
export const K: V3 = [0, 0, 1];
/** A circularly polarized wave of field 1, E₁ + iE₂ = e^{−iωt}: a = √2 e^{iωt}. */
export const WAVE_SIZE = Math.SQRT2;

/** The wave's amplitude at the phase ωt (degrees): a = √2 e^{iωt}. */
export function waveAmplitude(phase: number): C {
	const { cos, sin } = turnTrig(phase);
	return cx(WAVE_SIZE * cos, WAVE_SIZE * sin);
}

/** F = a m with m = (1, i, 0)/√2: E = (Re a, −Im a, 0)/√2 and cB = (Im a, Re a, 0)/√2 = k̂ × E. */
export function waveField(a: C): Field {
	const r = Math.SQRT1_2;
	return { E: [r * a.re, -r * a.im, 0], B: [r * a.im, r * a.re, 0] };
}

/**
 * The amplitude a of a null field, read in the axes of its own direction of travel: k̂ along E × cB, e₁ the part
 * of x̂ across k̂ (of ŷ when x̂ lies along k̂), e₂ = k̂ × e₁, and a = F·m* with m = (e₁ + ie₂)/√2. For the room's
 * wave and any sensor moving or turning about k̂ this is the chapter's a, with k̂ = ẑ, e₁ = x̂, e₂ = ŷ.
 */
export function amplitude(f: Field): { a: C; k: V3 } | undefined {
	const w = flow(f);
	if (norm(w) <= 1e-12 * Math.max(hermitian(f), 1e-300)) return undefined;
	const k = unit(w);
	let e1 = sub(AXES.x, scale(k[0], k));
	if (norm(e1) < 1e-6) e1 = sub(AXES.y, scale(k[1], k));
	e1 = unit(e1);
	const e2 = cross(k, e1);
	const r = Math.SQRT1_2;
	return {
		a: cx(r * (dot(f.E, e1) + dot(f.B, e2)), r * (dot(f.B, e1) - dot(f.E, e2))),
		k
	};
}

// --- light's two directions --------------------------------------------------------------------------------------------

/** A direction on the sky as the projective pair [p : q], z = p/q; q = 0 is z = ∞, the direction −ẑ. */
export type Root = { p: C; q: C };

/** The unit vector of the stereographic coordinate z: (2 Re z, 2 Im z, 1 − |z|²)/(1 + |z|²). */
export function direction(r: Root): V3 {
	const pq = cmul(r.p, conj(r.q));
	const pp = r.p.re ** 2 + r.p.im ** 2;
	const qq = r.q.re ** 2 + r.q.im ** 2;
	const s = pp + qq;
	return [(2 * pq.re) / s, (2 * pq.im) / s, (qq - pp) / s];
}

/** z = p/q, or undefined for z = ∞. */
export const zOf = (r: Root): C | undefined =>
	cabs(r.q) <= 1e-12 * cabs(r.p) ? undefined : cdiv(r.p, r.q);

/** The stereographic coordinate of a direction: z = (n_x + i n_y)/(1 + n_z); undefined at −ẑ. */
export function stereo(n: V3): C | undefined {
	const d = 1 + n[2];
	if (d <= 1e-12) return undefined;
	return cx(n[0] / d, n[1] / d);
}

/** m(z) = (1 − z², i(1 + z²), −2z), the paper's null vector for the direction of z. */
export function nullVector(z: C): [C, C, C] {
	const z2 = cmul(z, z);
	return [csub(cx(1), z2), cmul(cx(0, 1), cadd(cx(1), z2)), cscale(-2, z)];
}

/** The quadratic's coefficients, A z² + B z + C: A = iF_y − F_x, B = −2F_z, C = F_x + iF_y. */
export function quadratic(f: Field): { A: C; B: C; C: C } {
	const [Fx, Fy, Fz] = complexOf(f);
	const iFy = cmul(cx(0, 1), Fy);
	return { A: csub(iFy, Fx), B: cscale(-2, Fz), C: cadd(Fx, iFy) };
}

/**
 * Light's principal null directions: the roots of m(z)·F = 0, as projective pairs so that a root at infinity is
 * no special case. A quarter of the discriminant is F·F, so the two coincide when the field is null, to 1e-9 of its
 * Hermitian length. None for no field at all.
 */
export function principal(f: Field): { roots: Root[]; double: boolean } | undefined {
	const h = hermitian(f);
	if (h === 0) return undefined;
	const { A, B, C: c } = quadratic(f);
	if (cabs(square(f)) <= 1e-9 * h) {
		const root =
			cabs(A) >= cabs(c)
				? { p: cscale(-1, B), q: cscale(2, A) }
				: { p: cscale(2, c), q: cscale(-1, B) };
		return { roots: [root], double: true };
	}
	// the stable form: Q = −½(B ± √(B² − 4AC)), with the sign that makes it larger; roots Q/A and C/Q
	const s = csqrt(csub(cmul(B, B), cscale(4, cmul(A, c))));
	const plus = cadd(B, s);
	const minus = csub(B, s);
	const Q = cscale(-0.5, cabs(plus) >= cabs(minus) ? plus : minus);
	return {
		roots: [
			{ p: Q, q: A },
			{ p: c, q: Q }
		],
		double: false
	};
}

/** The directions themselves, with z for each (undefined at infinity). */
export function principalDirections(f: Field) {
	const pr = principal(f);
	if (!pr) return undefined;
	return {
		double: pr.double,
		dirs: pr.roots.map((r) => ({ n: direction(r), z: zOf(r) }))
	};
}

// --- the figure's settings ---------------------------------------------------------------------------------------------

export type Mode = 'static' | 'wave';
/** The boost's direction: an axis, or along E × B of the field the sensor at rest reads. */
export type Direction = Axis | 'flow';

export type Setup = {
	mode: Mode;
	/** The field a sensor at rest reads, in the static mode. */
	rest: Field;
	/** The wave's phase ωt, degrees, in the wave mode. */
	phase: number;
	direction: Direction;
	eta: number;
	turnAxis: Axis;
	/** The turn of the sensor's axes, degrees. */
	turn: number;
};

/** The field of a charge at rest on the x axis, on its −x side, so that its field points along +x; strength 1. */
export const CHARGE: Field = { E: [1, 0, 0], B: [0, 0, 0] };
/** The chapter's crossed fields, E = (1, 0, 0) and cB = (0, ½, 0). */
export const CROSSED: Field = { E: [1, 0, 0], B: [0, 0.5, 0] };

export const OPENING: Setup = {
	mode: 'static',
	rest: CHARGE,
	phase: 0,
	direction: 'z',
	eta: 0,
	turnAxis: 'z',
	turn: 0
};

/** The field a sensor at rest reads: the static field, or the wave at its phase. */
export const restField = (s: Setup): Field =>
	s.mode === 'wave' ? waveField(waveAmplitude(s.phase)) : s.rest;

/** The boost's unit vector, and whether "along E × B" fell back to ẑ because E × B is zero. */
export function boostAxis(s: Setup): { u: V3; fallback: boolean } {
	if (s.direction !== 'flow') return { u: AXES[s.direction], fallback: false };
	const rest = restField(s);
	const w = flow(rest);
	if (norm(w) <= 1e-12 * Math.max(hermitian(rest), 1e-300)) return { u: AXES.z, fallback: true };
	return { u: unit(w), fallback: false };
}

/** What the sensor reads: the field at rest, boosted, then read in its turned axes. */
export function reading(s: Setup): Field {
	const { u } = boostAxis(s);
	return turnField(boostField(restField(s), u, s.eta), AXES[s.turnAxis], s.turn);
}

/** The sensor's velocity through the room over c, in its own (turned) axes. */
export function velocity(s: Setup): V3 {
	const { u } = boostAxis(s);
	return turnVector(scale(hyper(s.eta).tanh, u), AXES[s.turnAxis], s.turn);
}

/** The values of the field's sliders: twentieths, to the last bits. */
export const FIELD_STEP = 0.05;
export const twentieth = (v: number) => Math.round(v / FIELD_STEP) / 20;

export const sameField = (a: Field, b: Field, tol = 1e-9) =>
	a.E.every((v, i) => Math.abs(v - b.E[i]) <= tol) &&
	a.B.every((v, i) => Math.abs(v - b.B[i]) <= tol);

/** One component of a field set: which arrow and which axis. */
export function withComponent(f: Field, which: 'E' | 'B', i: number, v: number): Field {
	const next: V3 = [...f[which]];
	next[i] = v;
	return which === 'E' ? { E: next, B: f.B } : { E: f.E, B: next };
}

// --- the rapidity slider -----------------------------------------------------------------------------------------------

export const RAPIDITY = { min: -2, max: 2, step: 0.01, key: 0.05, page: 0.5, snap: 0.0075 };
/** ½ ln 3, where β = ½ exactly: the chapter's parallel frame. */
export const HALF_LN3 = Math.log(3) / 2;
/** The rapidities the slider lands on exactly: rest, ±0.6c, ±½c and two boosts of 0.6c. */
export const NAMED = [-2 * LN2, -LN2, -HALF_LN3, 0, HALF_LN3, LN2, 2 * LN2];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** A rapidity the reader asks for, kept in range and landing exactly on a named one within the snap. */
export function landed(v: number): number {
	const eta = clamp(v, RAPIDITY.min, RAPIDITY.max);
	for (const name of NAMED) if (Math.abs(eta - name) < RAPIDITY.snap) return name;
	return Math.round(eta * 1e6) / 1e6;
}

/** One press of an arrow key: the next point of the key's grid, then landed. */
export function keyed(eta: number, direction: number, step = RAPIDITY.key): number {
	const next = Math.round((eta + direction * step) / step) * step;
	return landed(Math.round(next * 1e9) / 1e9);
}

/** β = tanh η and γ = cosh η, exact at whole numbers of ln 2. */
export function speed(eta: number) {
	const h = hyper(eta);
	return { beta: h.tanh, gamma: h.cosh, gammaBeta: h.sinh };
}

/** The turn's slider, degrees. */
export const TURN = { min: -180, max: 180, step: 5 };

// --- the predictions ---------------------------------------------------------------------------------------------------

/**
 * The first is answered once the reader has boosted the sensor, at rest in the charge's field and with its axes
 * unturned, across the field at 0.6c either way: η = ±ln 2 along a direction at right angles to E.
 */
export function acrossFound(s: Setup) {
	if (s.mode !== 'static' || !sameField(s.rest, CHARGE) || s.turn !== 0) return undefined;
	const k = lnTwos(s.eta);
	if (k !== 1 && k !== -1) return undefined;
	const { u } = boostAxis(s);
	if (Math.abs(dot(u, s.rest.E)) > 1e-12) return undefined;
	const f = reading(s);
	return { u, eta: s.eta, reading: f, hermitian: hermitian(f), ...invariants(f) };
}

/**
 * The second is answered once the reader, with E = (1, 0, 0) and cB = (0, ½, 0) at rest, has boosted the sensor
 * until the two fields it reads lie along one line, |E′ × cB′| within 0.005 of E′² + c²B′².
 */
export function parallelFound(s: Setup) {
	if (s.mode !== 'static' || !sameField(s.rest, CROSSED) || s.eta === 0) return undefined;
	const f = reading(s);
	if (!parallel(f)) return undefined;
	const { u } = boostAxis(s);
	return { u, eta: s.eta, beta: speed(s.eta).beta, reading: f };
}

/** The third is answered once the reader has run with the wave, along k̂ = ẑ, at 0.6c: η = ln 2. */
export function waveFound(s: Setup) {
	if (s.mode !== 'wave' || lnTwos(s.eta) !== 1) return undefined;
	const { u } = boostAxis(s);
	if (Math.abs(dot(u, K) - 1) > 1e-12) return undefined;
	const a = waveAmplitude(s.phase);
	const after = amplitude(reading(s));
	if (!after) return undefined;
	return {
		a,
		after: after.a,
		factor: cabs(after.a) / cabs(a),
		energy: (cabs(after.a) / cabs(a)) ** 2
	};
}

// --- the words ---------------------------------------------------------------------------------------------------------

/** A rapidity in words: "ln 2 = 0.693", "½ ln 3 = 0.549", or the value alone. */
export function etaWords(eta: number): string {
	const k = lnTwos(eta);
	const neg = eta < 0 ? '−' : '';
	if (k === 0 || eta === 0) return '0';
	if (k !== undefined && Math.abs(k) <= 2)
		return `${neg}${Math.abs(k) === 1 ? 'ln 2' : 'ln 4'} = ${three(eta)}`;
	if (Math.abs(Math.abs(eta) - HALF_LN3) < 1e-12) return `${neg}½ ln 3 = ${three(eta)}`;
	return three(eta);
}

/** A complex number to three figures, "1.25 − 0.750i", in plain text; zero parts left out. */
export function complexWords(z: C): string {
	const re = three(z.re);
	const im = three(Math.abs(z.im));
	const hasIm = im !== '0';
	if (re === '0' && !hasIm) return '0';
	if (!hasIm) return re;
	const imPart = `${im === '1.00' ? '' : im}i`;
	if (re === '0') return `${z.im < 0 ? '−' : ''}${imPart}`;
	return `${re} ${z.im < 0 ? '−' : '+'} ${imPart}`;
}

/** The same in LaTeX. */
export const complexTex = (z: C) => complexWords(z).replace(/−/g, '-');

/** An arrow to three figures, "(1.25, 0, 0)". */
export const vecWords = (v: V3) => `(${v.map((c) => three(c)).join(', ')})`;
export const vecTex = (v: V3) => vecWords(v).replace(/−/g, '-');

/** A root's z in words, "∞" at infinity. */
export const zWords = (z: C | undefined) => (z ? complexWords(z) : '∞');
