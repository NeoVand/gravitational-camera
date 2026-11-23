/**
 * The numbers of the figure "same outside": bodies of one mass whose steady pull outside is the same, and the one
 * number that tells them apart, ∫ρ r² dV, which the moment of inertia, the energy a quadrupolar kick leaves and the
 * thermal tremor of the quadrupole all contain. Two families, in units G = R = 1.
 *
 * Round bodies of mass M (= 1): a core of radius aR holding a fraction f of the mass, inside a mantle that holds the
 * rest, each of uniform density. Every such body pulls outside as a point of mass M at its centre (the shell
 * theorem), and
 *
 *   ∫ρ r² dV / MR² = (3/5) [ f a² + (1 − f)(1 − a⁵)/(1 − a³) ],
 *
 * 3/5 for the uniform ball (f = a³) and 1 for the thin shell (a = 1, f = 0). The quotient is written
 * (1 + a + a² + a³ + a⁴)/(1 + a + a²), which has no trouble at a = 1, where the mantle is a skin at the surface.
 *
 * Gold of mass m (= 1) in a steel ball of radius R, the steel's share common to all and left out (the paper's
 * fig:same-outside): a nugget at the distance s from the centre, its harmonic projection (the flush, eq.
 * harmonic-point) and its balayage onto the surface (the skin). All three have the gold's potential −Gm/|x − s|
 * outside the ball; their ∫ρ r² dV are m s², (3/5) mR² and mR².
 */

// --- round bodies ------------------------------------------------------------------------------------------------

/** A round body: its core's radius a (in units of R) and the fraction f of the mass the core holds. */
export interface Layered {
	a: number;
	f: number;
}

/** The two-layer Earth of the paper's Section IV: a core of 3480 km in 6371 km, of 12,500 and 4150 kg m⁻³. */
export const EARTH_RADIUS_KM = 6371;
export const EARTH_CORE_KM = 3480;
export const EARTH_CORE_DENSITY = 12500;
export const EARTH_MANTLE_DENSITY = 4150;
const qE = EARTH_CORE_KM / EARTH_RADIUS_KM;
/** The model Earth's mean density, kg m⁻³: 5510.8, the real 5513 to 0.05 per cent. */
export const EARTH_MEAN_DENSITY =
	EARTH_CORE_DENSITY * qE ** 3 + EARTH_MANTLE_DENSITY * (1 - qE ** 3);

export type RoundName = 'ball' | 'shell' | 'hair-shell' | 'cored' | 'earth';

/** The round bodies the figure offers, with their names. */
export const ROUND: Record<RoundName, { body: Layered; name: string; short: string }> = {
	ball: { body: { a: 0.5, f: 0.125 }, name: 'Uniform ball', short: 'Ball' },
	shell: { body: { a: 1, f: 0 }, name: 'Thin shell', short: 'Shell' },
	'hair-shell': { body: { a: 0.92, f: 0 }, name: 'Shell, 8% thick', short: '8% shell' },
	cored: { body: { a: 0.4, f: 0.5 }, name: "The paper's cored ball", short: 'Cored' },
	earth: {
		body: { a: qE, f: (EARTH_CORE_DENSITY * qE ** 3) / EARTH_MEAN_DENSITY },
		name: 'Two-layer Earth',
		short: 'Earth'
	}
};

export const ROUND_NAMES = Object.keys(ROUND) as RoundName[];

/** Whether a body is uniform: its core as dense as its mantle, f = a³. */
export function isUniform(b: Layered): boolean {
	return Math.abs(b.f - b.a ** 3) < 1e-9;
}

/** The preset a body is, if it is one: any body with f = a³ is the uniform ball. */
export function roundName(b: Layered): RoundName | undefined {
	if (isUniform(b)) return 'ball';
	return ROUND_NAMES.find(
		(n) => Math.abs(ROUND[n].body.a - b.a) < 1e-9 && Math.abs(ROUND[n].body.f - b.f) < 1e-9
	);
}

/** M_enc(r)/M, the fraction of the mass within r of the centre (r in units of R). */
export function massWithin(r: number, b: Layered): number {
	if (r >= 1) return 1;
	if (r <= 0) return 0;
	const { a, f } = b;
	if (r < a) return f * (r / a) ** 3;
	// in the mantle, which is uniform from a to 1
	return f + ((1 - f) * (r ** 3 - a ** 3)) / (1 - a ** 3);
}

/**
 * The pull g(r) = G M_enc(r)/r², in units of GM/R², toward the centre. Outside, 1/r² for every body. A core of no
 * size (a = 0) holding mass is a point, whose pull grows without bound at the centre.
 */
export function pull(r: number, b: Layered): number {
	if (r > 0) return massWithin(r, b) / (r * r);
	return b.a === 0 && b.f > 0 ? Infinity : 0;
}

/**
 * The densities of the core and the mantle, in units of the mean density 3M/4πR³. A core of no size holding mass
 * is a point (Infinity); a mantle of no thickness holding mass is a skin at the surface (Infinity).
 */
export function densities(b: Layered): { core: number; mantle: number } {
	const { a, f } = b;
	const core = a > 0 ? f / a ** 3 : f > 0 ? Infinity : 0;
	const mantle = a < 1 ? (1 - f) / (1 - a ** 3) : f < 1 ? Infinity : 0;
	return { core, mantle };
}

/** ∫ρ r² dV in units of MR²: (3/5)[f a² + (1 − f)(1 + a + a² + a³ + a⁴)/(1 + a + a²)]. */
export function secondMoment(b: Layered): number {
	const { a, f } = b;
	const mantle = (1 + a + a * a + a ** 3 + a ** 4) / (1 + a + a * a);
	return 0.6 * (f * a * a + (1 - f) * mantle);
}

/** The moment of inertia of a round body about any axis through its centre, I = (2/3)∫ρ r² dV, in units of MR². */
export function inertia(b: Layered): number {
	return (2 / 3) * secondMoment(b);
}

/** ∫ρ r² dV of the uniform ball, 3/5 MR², against which the kick and the tremor are measured. */
export const BALL_SECOND_MOMENT = 0.6;

/**
 * The energy a quadrupolar impulsive tide leaves, against the uniform ball's under the same tide. The tide with
 * impulse potential ½k(x² − y²) gives each piece the velocity k(−x, y, 0), so it leaves ½k² ∫ρ(x² + y²) dV, which
 * for a round body is (k²/3)∫ρ r² dV: the ratio of the bodies' ∫ρ r² dV.
 */
export function kickRelative(b: Layered): number {
	return secondMoment(b) / BALL_SECOND_MOMENT;
}

/**
 * The thermal tremor of the quadrupole, Σ_m ⟨|Q̇_2m|²⟩ = (25/2π) k_B T ∫ρ r² dV (eq. thermal-multipole at ℓ = 2),
 * against the uniform ball's at the same temperature: again the ratio of the ∫ρ r² dV.
 */
export function tremorRelative(b: Layered): number {
	return secondMoment(b) / BALL_SECOND_MOMENT;
}

/** The kick energy ½k² ∫ρ(x² + y²) dV for a round body, (k²/3)∫ρ r² dV, in units of M R² k². */
export function kickEnergy(b: Layered, k = 1): number {
	return ((k * k) / 3) * secondMoment(b);
}

/** The factor ℓ(2ℓ + 1)²/4π of the multipole tremor, eq. thermal-multipole: 25/2π for the quadrupole. */
export function tremorFactor(l: number): number {
	return (l * (2 * l + 1) ** 2) / (4 * Math.PI);
}

// --- the gold: a nugget, its flush and its skin --------------------------------------------------------------------

export type GoldName = 'nugget' | 'flush' | 'skin';

export const GOLD: Record<GoldName, { name: string; short: string }> = {
	nugget: { name: 'A gold nugget', short: 'Nugget' },
	flush: { name: 'Its harmonic flush', short: 'Flush' },
	skin: { name: 'Its skin', short: 'Skin' }
};

export const GOLD_NAMES = Object.keys(GOLD) as GoldName[];

/** The nugget's distances from the centre the figure offers (units of R), and the paper's. */
export const S_LEAST = 0;
export const S_MOST = 0.8;
export const S_PAPER = 0.5;

/**
 * The flush: the density harmonic in the ball with the nugget's field outside, in units of m/4πR³, at the distance
 * r from the centre and the angle θ from the nugget's direction. With t = s r/R²,
 * (3 − 10t² + 8t³ cos θ − t⁴)/(1 − 2t cos θ + t²)^(5/2), the sum of eq. harmonic-point.
 */
export function flushDensity(r: number, cos: number, s: number): number {
	const t = s * r;
	return (3 - 10 * t * t + 8 * t ** 3 * cos - t ** 4) / (1 - 2 * t * cos + t * t) ** 2.5;
}

/** The flush as the paper's series, Σ (2ℓ+1)(2ℓ+3) t^ℓ P_ℓ(cos θ), to the order given (for the tests). */
export function flushSeries(r: number, cos: number, s: number, order = 200): number {
	const t = s * r;
	let p0 = 1;
	let p1 = cos;
	let sum = 3 + 15 * t * cos;
	let tl = t;
	for (let l = 1; l < order; l++) {
		const p2 = ((2 * l + 1) * cos * p1 - l * p0) / (l + 1);
		tl *= t;
		sum += (2 * l + 3) * (2 * l + 5) * tl * p2;
		p0 = p1;
		p1 = p2;
	}
	return sum;
}

/**
 * The skin: the nugget's mass swept onto the surface (Poincaré's balayage), surface density
 * m(R² − s²)/4πR|x − s|³, in units of m/4πR², at the angle θ from the nugget's direction.
 */
export function skinDensity(cos: number, s: number): number {
	return (1 - s * s) / (1 - 2 * s * cos + s * s) ** 1.5;
}

/** The gold's ∫ρ r² dV in units of mR²: s², 3/5 and 1. The flush's is 3/5 for every s (the mean-value property). */
export function goldSecondMoment(kind: GoldName, s: number): number {
	return kind === 'nugget' ? s * s : kind === 'flush' ? 0.6 : 1;
}

/**
 * The gold's share of the moment of inertia about an axis through the centre across the line to the nugget, in
 * units of mR². I_x = (2/3)∫ρ r² dV + ∫ρ (r²/3 − x²) dV, and the second integral is harmonic, the same for the three:
 * m s²/3. So s², (2/3)(3/5) + s²/3 and 2/3 + s²/3: 0.25, 0.483 and 0.75 at s = R/2.
 */
export function goldInertia(kind: GoldName, s: number): number {
	return (2 / 3) * goldSecondMoment(kind, s) + (s * s) / 3;
}

/**
 * The gold's share of the energy the five quadrupolar kicks leave, and of the quadrupole's tremor, against the
 * gold's spread evenly through the ball (whose ∫ρ r² dV is 3/5 mR², as the flush's is): both go as ∫ρ r² dV, since
 * Σ_m |∇(r² Y_2m)|² = (25/2π) r².
 */
export function goldRelative(kind: GoldName, s: number): number {
	return goldSecondMoment(kind, s) / BALL_SECOND_MOMENT;
}

/** The flush's density at the near wall, its largest, in units of m/4πR³: 46 at s = R/2. */
export function flushTop(s: number): number {
	return flushDensity(1, 1, s);
}

/** The skin's surface density over the nugget, its largest, in units of m/4πR²: (1 + s)/(1 − s)², 6 at s = R/2. */
export function skinTop(s: number): number {
	return skinDensity(1, s);
}

// --- the drawing ---------------------------------------------------------------------------------------------------

/** How many bands the gold is shaded in, each half as dense as the one before (as the paper's figure is). */
export const BANDS = 6;

/** The band of a density against the densest: 0 for the top half, 1 for the next, …; −1 below the last, or none. */
export function band(value: number, top: number): number {
	if (!(value > 0) || !(top > 0)) return -1;
	const k = Math.floor(Math.log2(top / value) + 1e-12);
	return k < BANDS ? Math.max(0, k) : -1;
}

/**
 * The flush cut through the nugget's axis, as squares of a grid over the ball grouped by band: for each band, an SVG
 * path of its squares, in units of R, the nugget on the +x axis. Squares whose centre is a little outside the ball
 * are kept, for the drawing to clip at the surface.
 */
export function flushPaths(s: number, cells = 64): string[] {
	const h = 2 / cells;
	const top = flushTop(s);
	const paths: string[][] = Array.from({ length: BANDS }, () => []);
	const n = (v: number) => String(Math.round(v * 1e4) / 1e4);
	for (let i = 0; i < cells; i++) {
		for (let j = 0; j < cells; j++) {
			const x = -1 + (i + 0.5) * h;
			const y = -1 + (j + 0.5) * h;
			const r = Math.hypot(x, y);
			if (r > 1 + h) continue;
			const rr = Math.min(r, 1);
			const k = band(flushDensity(rr, r > 0 ? x / r : 1, s), top);
			if (k < 0) continue;
			paths[k].push(`M${n(x - h / 2)} ${n(y - h / 2)}h${n(h)}v${n(h)}h${n(-h)}z`);
		}
	}
	return paths.map((p) => p.join(''));
}

/**
 * The skin as a band just inside the surface, from radius `inner` to 1, cut into arcs grouped by band of surface
 * density: for each band, an SVG path of its arcs, in units of R, the nugget on the +x axis.
 */
export function skinPaths(s: number, inner = 0.88, pieces = 144): string[] {
	const top = skinTop(s);
	const paths: string[][] = Array.from({ length: BANDS }, () => []);
	const n = (v: number) => String(Math.round(v * 1e4) / 1e4);
	for (let i = 0; i < pieces; i++) {
		const t0 = (2 * Math.PI * i) / pieces;
		const t1 = (2 * Math.PI * (i + 1)) / pieces;
		const k = band(skinDensity(Math.cos((t0 + t1) / 2), s), top);
		if (k < 0) continue;
		const [c0, s0, c1, s1] = [Math.cos(t0), Math.sin(t0), Math.cos(t1), Math.sin(t1)];
		paths[k].push(
			`M${n(c0)} ${n(s0)}A1 1 0 0 1 ${n(c1)} ${n(s1)}L${n(inner * c1)} ${n(inner * s1)}` +
				`A${inner} ${inner} 0 0 0 ${n(inner * c0)} ${n(inner * s0)}z`
		);
	}
	return paths.map((p) => p.join(''));
}

/**
 * The radii of the equipotentials of the gold's share of the field, circles about the nugget: the potential
 * −Gm/d on the circle of radius d. Their levels are fixed, Gm/d = 1/d in units of Gm/R, so the circles do not
 * depend on how the gold is spread; only their parts outside the ball are drawn.
 */
export const EQUIPOTENTIALS = [0.6, 0.78, 1.0, 1.26, 1.58];

/** The gold's potential outside the ball, −Gm/|x − s| in units of Gm/R, the nugget at (s, 0, 0). */
export function goldPotential(x: number, y: number, z: number, s: number): number {
	return -1 / Math.hypot(x - s, y, z);
}
