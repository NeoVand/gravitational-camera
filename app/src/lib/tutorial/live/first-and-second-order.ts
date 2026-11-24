/**
 * Chapter 13.1's push and pass, made live: a mass μ flies past a body on a straight line, crossing the plane across
 * it at the complex point b. The parts over the point w of that plane receive C(b − w)/|b − w|², with C = 2Gμ/V, so
 * the body takes the momentum (the chapter's boxed series)
 *
 *     ΔP = C Σ_q m_0q / (b*)^(q+1),
 *
 * which the passer loses sideways, and gains the energy
 *
 *     ΔE = (C²/2) Σ_{p,q} m_pq / (b^(p+1) (b*)^(q+1)),
 *
 * with m_pq = ∫ w^p (w*)^q Σ d²s the planar moments of the projected body. The first is first order in μ and holds
 * only the m_0q; the second is second order and holds them all.
 *
 * Units, as in lib/hair/passing.ts: lengths in R, masses in M (every body here has M = 1), C in C₀, the tonne's C.
 * Then |ΔP| is in M C₀/R, the angle |ΔP|/μV in 2GM/RV², and an energy in M C₀²/2R². The round bodies take their
 * energies from passing.ts (bodyF less recoilF); the two lumps take theirs from the planar series, to forty terms in
 * each of p and q, less the recoil |ΔP|²/2M of the whole body.
 */
import { abs, add, conj, cx, div, mul, scale, sub, ZERO, type Complex } from '../../pixel/complex';
import type { Body } from '../../hair/ladder';
import { PAPER_PASS, TWINS, bodyF, mass, recoilF } from '../../hair/passing';

export type { Complex };

// --- the ranges -----------------------------------------------------------------------------------------------------

/** The bead cannot enter the circle |b| = 1.05 R, and goes out to 4 R; it opens at the paper's 1.5 R. */
export const NEAREST = 1.05;
export const FARTHEST = 4;
export const OPENING = { distance: PAPER_PASS, turn: 0 };

/** The passing mass, in tonnes: the paper's tonne to four of them. */
export const MASS = { min: 1, max: 4, step: 0.1, opening: 1 };

/** The bead's keys: left and right turn φ by 5°, up and down change |b| by 0.05 R. */
export const TURN_STEP = 5;
export const DISTANCE_STEP = 0.05;

/** How many terms of the planar series are summed, in each of p and q. */
export const TERMS = 40;

/** The parts of the momentum listed under it, m_00 to m_04. */
export const LISTED = 5;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// --- the bodies ------------------------------------------------------------------------------------------------------

/** A point lump of the projected body: its mass, in M, and its place w, in R. */
export interface Lump {
	mass: number;
	at: Complex;
}

/** A projected body: round, made of thin shells (ladder.ts), or a few point lumps. */
export type Projected =
	| {
			kind: 'round';
			key: string;
			name: string;
			body: Body;
			/** Σ in closed form, for the shading of a body of many shells, to any constant factor */
			sigma?: (s: number) => number;
	  }
	| { kind: 'lumps'; key: string; name: string; lumps: Lump[] };

/**
 * The Gauss–Legendre nodes and weights on [0, 1], with n points: exact for polynomials of degree 2n − 1. Newton's
 * method on the Legendre polynomial from the usual first guesses.
 */
export function gaussLegendre(n: number): { nodes: number[]; weights: number[] } {
	const nodes: number[] = [];
	const weights: number[] = [];
	for (let i = 0; i < n; i++) {
		let x = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
		let derivative = 1;
		for (let iteration = 0; iteration < 100; iteration++) {
			let p0 = 1,
				p1 = x;
			for (let k = 2; k <= n; k++) {
				const p2 = ((2 * k - 1) * x * p1 - (k - 1) * p0) / k;
				p0 = p1;
				p1 = p2;
			}
			derivative = (n * (x * p1 - p0)) / (x * x - 1);
			const dx = p1 / derivative;
			x -= dx;
			if (Math.abs(dx) < 1e-16) break;
		}
		nodes.push((1 - x) / 2);
		weights.push(1 / ((1 - x * x) * derivative * derivative));
	}
	return { nodes, weights };
}

/**
 * A uniform ball of mass M and radius R as thin shells for passing.ts: the shells at the Gauss–Legendre nodes in r,
 * each holding its weight of 3r² dr. Its energy is a smooth function of r out to the pass, so 48 shells give it to
 * the last digit for every pass beyond 1.05 R.
 */
export function uniformBall(shells = 48): Body {
	const { nodes, weights } = gaussLegendre(shells);
	return {
		name: 'a uniform ball of radius R',
		shells: nodes.map((r, i) => ({ mass: 3 * r * r * weights[i], radius: r }))
	};
}

/** The lopsided body: 0.7 M and 0.3 M, placed so that the origin is their centre of mass. */
export const LUMPS: Lump[] = [
	{ mass: 0.7, at: cx(0.27, -0.09) },
	{ mass: 0.3, at: cx(-0.63, 0.21) }
];

export type Choice = 'pair' | 'ball' | 'lumps';

export const CHOICES: Record<Choice, { label: string; bodies: Projected[] }> = {
	pair: {
		label: 'The paper’s pair',
		bodies: [
			{ kind: 'round', key: 'A', name: 'a shell of radius R/√2', body: TWINS.a },
			{
				kind: 'round',
				key: 'B',
				name: 'half at the centre, half on a shell of radius R',
				body: TWINS.b
			}
		]
	},
	ball: {
		label: 'A ball and a shell',
		bodies: [
			{
				kind: 'round',
				key: 'A',
				name: 'a uniform ball of radius R',
				body: uniformBall(),
				sigma: (s) => Math.sqrt(Math.max(0, 1 - s * s))
			},
			{
				kind: 'round',
				key: 'B',
				name: 'a thin shell of radius R',
				body: { name: 'a thin shell of radius R', shells: [{ mass: 1, radius: 1 }] }
			}
		]
	},
	lumps: {
		label: 'Two lumps',
		bodies: [{ kind: 'lumps', key: 'L', name: 'two lumps, 0.7 M and 0.3 M', lumps: LUMPS }]
	}
};

// --- the planar moments and the two series -------------------------------------------------------------------------

/** A complex number to a whole power. */
export function power(z: Complex, n: number): Complex {
	let out = cx(1);
	for (let k = 0; k < n; k++) out = mul(out, z);
	return out;
}

/** The planar moment m_pq = Σ m w^p (w*)^q of a body of lumps, in M R^(p+q). */
export function planarMoment(lumps: Lump[], p: number, q: number): Complex {
	return lumps.reduce(
		(sum, { mass, at }) => add(sum, scale(mul(power(at, p), power(conj(at), q)), mass)),
		ZERO
	);
}

/** The bending's moments m_00 to m_0(n − 1). A round body has m_00 = M and every other m_0q zero. */
export function bendingMoments(body: Projected, n = TERMS): Complex[] {
	if (body.kind === 'round')
		return Array.from({ length: n }, (_, q) => (q === 0 ? cx(mass(body.body)) : ZERO));
	return momentTable(body.lumps, Math.max(n, TERMS))[0].slice(0, n);
}

/** The parts of ΔP, m_0q / (b*)^(q+1) for q = 0 to n − 1, in M C/R. */
export function momentumParts(body: Projected, b: Complex, n = TERMS): Complex[] {
	const bStar = conj(b);
	return bendingMoments(body, n).map((m, q) => div(m, power(bStar, q + 1)));
}

/** The body's momentum ΔP from the boxed series, to forty terms, in M C/R. The passer takes −ΔP. */
export function momentum(body: Projected, b: Complex, n = TERMS): Complex {
	return momentumParts(body, b, n).reduce(add, ZERO);
}

/** The table of m_pq for p, q < n, computed once for each body of lumps. */
const tables = new WeakMap<Lump[], { n: number; m: Complex[][] }>();

export function momentTable(lumps: Lump[], n = TERMS): Complex[][] {
	const known = tables.get(lumps);
	if (known && known.n === n) return known.m;
	const m = Array.from({ length: n }, (_, p) =>
		Array.from({ length: n }, (_, q) => planarMoment(lumps, p, q))
	);
	tables.set(lumps, { n, m });
	return m;
}

/**
 * The energy the lumps gain, from the planar series to n terms in each of p and q, in M C²/2R²: the sum of
 * m_pq / (b^(p+1) (b*)^(q+1)), real because m_qp = m_pq*.
 */
export function energySeries(lumps: Lump[], b: Complex, n = TERMS): number {
	const m = momentTable(lumps, n);
	// 1/b^(p+1) for p < n; the powers of 1/b* are their conjugates
	const inverse: Complex[] = [div(cx(1), b)];
	for (let k = 1; k < n; k++) inverse.push(mul(inverse[k - 1], inverse[0]));
	let sum = 0;
	for (let p = 0; p < n; p++)
		for (let q = 0; q < n; q++) sum += mul(m[p][q], mul(inverse[p], conj(inverse[q]))).re;
	return sum;
}

/**
 * The energy left inside the body, in M C²/2R² for C = C₀: for a round body passing.ts's bodyF less recoilF; for the
 * lumps the planar series less the whole body's recoil, |ΔP|²/2M, which for a round body is recoilF.
 */
export function internalEnergy(body: Projected, b: Complex): number {
	const distance = abs(b);
	if (body.kind === 'round') return bodyF(body.body, distance) - recoilF(body.body, distance);
	const total = body.lumps.reduce((s, l) => s + l.mass, 0);
	return energySeries(body.lumps, b) - abs(momentum(body, b)) ** 2 / total;
}

// --- the readings -------------------------------------------------------------------------------------------------

/** What one pass gives one body, for a passing mass of `tonnes` times the paper's. */
export interface Reading {
	/** ΔP, the body's, in M C₀/R; the passer's is its negative */
	momentum: Complex;
	/** |ΔP| in M C₀/R */
	size: number;
	/** the sizes of the parts from m_00 to m_04, and of the rest, in M C₀/R */
	parts: number[];
	rest: number;
	/** the angle |ΔP|/μV in 2GM/RV², and a point mass's at the same |b| */
	angle: number;
	pointAngle: number;
	/** the energy left inside, in M C₀²/2R² */
	energy: number;
}

export function reading(body: Projected, b: Complex, tonnes: number): Reading {
	const all = momentumParts(body, b);
	const whole = all.reduce(add, ZERO);
	const listed = all.slice(0, LISTED);
	const rest = sub(whole, listed.reduce(add, ZERO));
	return {
		momentum: scale(whole, tonnes),
		size: tonnes * abs(whole),
		parts: listed.map((part) => tonnes * abs(part)),
		rest: tonnes * abs(rest),
		angle: abs(whole),
		pointAngle: 1 / abs(b),
		energy: tonnes * tonnes * internalEnergy(body, b)
	};
}

/** The crossing point from its distance, in R, and its angle φ, in degrees. */
export const crossing = (distance: number, turn: number): Complex =>
	cx(distance * Math.cos((turn * Math.PI) / 180), distance * Math.sin((turn * Math.PI) / 180));

/** An angle in degrees brought into [0, 360). */
export const wrap = (turn: number) => ((turn % 360) + 360) % 360;

// --- the drawing -----------------------------------------------------------------------------------------------------

/**
 * The bead's drawn distance from the centre, in R: 1 + A ln |b|, so that it is nearly to scale close to the body
 * and 4 R is drawn at 2.25 R. The body itself, and the bead's direction, are drawn to scale.
 */
const SPREAD = 1.25 / Math.log(FARTHEST);
export const drawnDistance = (distance: number) => 1 + SPREAD * Math.log(distance);
export const fromDrawn = (drawn: number) => Math.exp((drawn - 1) / SPREAD);

/** The circles drawn round the body, at these |b|. */
export const RINGS = [1.5, 2, 3, 4];

/**
 * The shading of a projected round body, as stops of a radial gradient: the opacity in proportion to Σ, against its
 * value at 0.96 of the outer radius, at most 1. A thin shell of radius a has Σ ∝ 1/√(a² − s²), a uniform ball
 * Σ ∝ √(R² − s²), given in closed form because its 48 shells would shade in bands; a point at the centre is drawn as
 * a dot.
 */
export function shading(
	body: Body,
	closed?: (s: number) => number,
	samples = 24
): { offset: number; opacity: number }[] {
	const outer = Math.max(...body.shells.map((s) => s.radius));
	const sigma = (s: number) =>
		closed?.(s) ??
		body.shells.reduce((sum, shell) => {
			const r = shell.radius;
			if (r === 0 || s >= r) return sum;
			return sum + shell.mass / (2 * Math.PI * r * Math.sqrt(r * r - s * s));
		}, 0);
	const top = Math.max(...Array.from({ length: 97 }, (_, i) => sigma((0.96 * outer * i) / 96)));
	return Array.from({ length: samples + 1 }, (_, i) => {
		const offset = i / samples;
		const s = Math.min(offset, 0.999) * outer;
		return { offset, opacity: Math.min(1, sigma(s) / top) };
	});
}

// --- the words ---------------------------------------------------------------------------------------------------

/** A reading to show: three decimals from a hundredth up, two figures below, and 0 for zero. */
export function shown(x: number): string {
	if (Math.abs(x) < 5e-13) return '0';
	if (Math.abs(x) >= 0.01) return x.toFixed(3);
	const places = Math.min(12, 1 - Math.floor(Math.log10(Math.abs(x))));
	return x.toFixed(places);
}

/** A signed percentage to one decimal, with a true minus sign. */
export function percent(x: number): string {
	const p = (100 * x).toFixed(1);
	if (p === '0.0' || p === '-0.0') return '0.0%';
	return x > 0 ? `+${p}%` : `−${p.slice(1)}%`;
}
