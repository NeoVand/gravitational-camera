/**
 * Chapter 5.6's onion peeling. A round planet of radius R is made of K uniform shells, numbered 1, 2, … from the
 * outside in, shell k between the radii R_k and R_{k−1}, with R_0 = R and R_K = 0, and glowing with j_k. A camera on
 * the surface looks down at the angle θ from straight down; its line of sight misses the centre by the impact
 * parameter b = R sin θ and crosses shell i for the total length
 *
 *   L_i(b) = 2[√(R_{i−1}² − b²) − √(R_i² − b²)],
 *
 * a square root of a negative number read as zero. Its brightness is N(b) = Σ j_i L_i(b). The line that grazes the
 * bottom of shell k, b = R_k, crosses shells 1 to k only, so the glows come back one at a time from the outside in:
 *
 *   j_k = [N(R_k) − Σ_{i<k} j_i L_i(R_k)] / L_k(R_k).
 *
 * The noise is Poisson's: a chosen number of counts in all is shared among the K grazing lines in proportion to
 * their brightness, as a camera that looks along each for the same time would collect them, and each line's count
 * is drawn from a seeded generator. Each line's brightness is then its count times the brightness per count, and its
 * variance is that brightness times the brightness per count. The peeling is linear, so the variances are carried
 * through it exactly, by the inverse of its triangular matrix. Lengths are in units of R throughout; the glows are
 * in arbitrary units, and N in units of the glow times R.
 */
import { generator, poisson } from './graviton-count';

export const DEG = Math.PI / 180;

/** A planet: the radii of the boundaries R_1 > … > R_{K−1}, in units of R, and the glows j_1 … j_K. */
export type Planet = { edges: number[]; glows: number[] };

/** The radii R_0 = 1, R_1, …, R_{K−1}, R_K = 0. */
export const bounds = (p: Planet) => [1, ...p.edges, 0];

/** The number of shells, K. */
export const shellCount = (p: Planet) => p.glows.length;

/** The length of the chord of the sphere of radius r cut by the line of impact parameter b: 2√(r² − b²), or 0. */
export const chord = (r: number, b: number) => (r > b ? 2 * Math.sqrt((r - b) * (r + b)) : 0);

/** The impact parameter of the line at θ degrees from straight down, b = R sin θ, in units of R. */
export const impact = (theta: number) => Math.sin(theta * DEG);

/** The angle from straight down of the line of impact parameter b, in degrees. */
export const angleOf = (b: number) => Math.asin(Math.max(0, Math.min(1, b))) / DEG;

/** The lengths L_i(b) of the line inside each shell, in units of R. */
export function lengths(p: Planet, b: number): number[] {
	const r = bounds(p);
	return p.glows.map((_, i) => Math.max(0, chord(r[i], b) - chord(r[i + 1], b)));
}

/** The brightness N(b) = Σ j_i L_i(b), in units of the glow times R. */
export function brightness(p: Planet, b: number): number {
	const L = lengths(p, b);
	return p.glows.reduce((s, j, i) => s + j * L[i], 0);
}

/** The angles at which the lines graze the boundaries, arcsin(R_k/R), k = 1 … K − 1, in degrees: the kinks. */
export const kinkAngles = (p: Planet) => p.edges.map(angleOf);

/** The impact parameters of the K lines the peeling reads, b = R_k, k = 1 … K: the last is straight down. */
export const grazingImpacts = (p: Planet) => [...p.edges, 0];

/** Their angles, in degrees. */
export const grazingAngles = (p: Planet) => grazingImpacts(p).map(angleOf);

/** The brightnesses of the grazing lines, N(R_k). */
export const readings = (p: Planet) => grazingImpacts(p).map((b) => brightness(p, b));

/** The peeling's matrix, A_{ki} = L_i(R_k): lower triangular, since the line at R_k misses the shells below k. */
export const peelMatrix = (p: Planet) => grazingImpacts(p).map((b) => lengths(p, b));

/** The onion peeling: the glows j_k from the brightnesses N_k of the grazing lines, from the outside in. */
export function peel(p: Planet, N: number[]): number[] {
	const A = peelMatrix(p);
	const j: number[] = [];
	for (let k = 0; k < N.length; k++) {
		let rest = N[k];
		for (let i = 0; i < k; i++) rest -= j[i] * A[k][i];
		j.push(rest / A[k][k]);
	}
	return j;
}

/** The inverse of the peeling's matrix, column by column: the glows are j = M N. */
export function peelInverse(p: Planet): number[][] {
	const K = shellCount(p);
	const columns = Array.from({ length: K }, (_, c) =>
		peel(
			p,
			Array.from({ length: K }, (_, r) => (r === c ? 1 : 0))
		)
	);
	return Array.from({ length: K }, (_, r) => columns.map((col) => col[r]));
}

/** The standard deviations of the peeled glows, from independent errors σ_k of the grazing brightnesses. */
export function propagate(p: Planet, sigmas: number[]): number[] {
	const M = peelInverse(p);
	return M.map((row) => Math.sqrt(row.reduce((s, m, k) => s + (m * sigmas[k]) ** 2, 0)));
}

// --- the noise ------------------------------------------------------------------------------------------------------

/** The total number of counts, 10² to 10⁶ on a scale of powers of ten; the figure opens with noise off. */
export const COUNTS = { low: 2, high: 6, step: 0.1, page: 1, opening: 4 };

/** The counts each grazing line is expected to collect, of `total` in all, in proportion to its brightness. */
export function expectedCounts(p: Planet, total: number): number[] {
	const N = readings(p);
	const sum = N.reduce((s, n) => s + n, 0);
	return N.map((n) => (sum > 0 ? (total * n) / sum : 0));
}

/** The brightness one count stands for: the grazing lines' total brightness over the counts. */
export function perCount(p: Planet, total: number): number {
	const sum = readings(p).reduce((s, n) => s + n, 0);
	return sum / total;
}

/** One draw of the counts, by the seed, and the brightnesses they give. */
export function draw(p: Planet, total: number, seed: number) {
	const random = generator(seed);
	const per = perCount(p, total);
	const counts = expectedCounts(p, total).map((mu) => poisson(mu, random));
	return { counts, readings: counts.map((c) => c * per) };
}

/** The standard deviations of the grazing brightnesses: each √(count) counts, so σ_k² = N_k × per count. */
export function readingErrors(p: Planet, total: number): number[] {
	const per = perCount(p, total);
	return readings(p).map((n) => Math.sqrt(n * per));
}

/** The standard deviations of the peeled glows, for `total` counts in all, from the counts expected. */
export const peelErrors = (p: Planet, total: number) => propagate(p, readingErrors(p, total));

/**
 * The shell that comes back least certain: the largest standard deviation relative to its true glow, among the
 * shells that glow. Undefined if none does.
 */
export function leastCertain(p: Planet, total: number): number | undefined {
	const s = peelErrors(p, total);
	let worst: number | undefined;
	let most = -1;
	p.glows.forEach((j, k) => {
		if (j <= 0) return;
		if (s[k] / j > most) {
			most = s[k] / j;
			worst = k;
		}
	});
	return worst;
}

/** A shell thinner than this, in units of R, is "very thin". */
export const THIN = 0.02;

// --- the curve ------------------------------------------------------------------------------------------------------

/**
 * The angles at which to draw the curve: every tenth of a degree, every kink exactly, and, just inside each, a few
 * points closing on it, where the curve rises as the square root of the distance from it.
 */
export function curveAngles(p: Planet): number[] {
	const out: number[] = [];
	for (let i = 0; i <= 900; i++) out.push(i / 10);
	for (const k of kinkAngles(p)) {
		out.push(k);
		for (const d of [0.002, 0.008, 0.02, 0.05]) if (k - d > 0) out.push(k - d);
	}
	return out.sort((a, z) => a - z).filter((t, i, all) => i === 0 || t - all[i - 1] > 1e-9);
}

/** A round number at least as large as v, from 1, 2, 2.5 and 5 times a power of ten: the top of an axis. */
export function niceTop(v: number): number {
	if (!(v > 0)) return 1;
	const e = Math.floor(Math.log10(v));
	for (const m of [1, 2, 2.5, 5, 10]) if (m * 10 ** e >= v * (1 - 1e-12)) return m * 10 ** e;
	return 10 ** (e + 1);
}

// --- changing the planet --------------------------------------------------------------------------------------------

/** Each glow from 0 to 10, in arbitrary units: the arrows step a hundredth, the page keys one. */
export const GLOW = { low: 0, high: 10, step: 0.01, page: 1 };
export const MAX_SHELLS = 5;

/** The units the radii are given in: the planet's radius in them, and the steps of the arrows and of Shift. */
export type Units = { R: number; name: string; coarse: number; fine: number };
export const KM: Units = { R: 6371, name: 'km', coarse: 10, fine: 1 };
export const MM: Units = { R: 100, name: 'mm', coarse: 0.5, fine: 0.1 };
export const UNIT_R: Units = { R: 1, name: 'R', coarse: 0.01, fine: 0.001 };

/** The thinnest a shell may be, in units of R: one fine step of the units. */
export const minGap = (u: Units) => u.fine / u.R;

/** The planet with boundary k (0-based among R_1 … R_{K−1}) moved to r, kept between its neighbours. */
export function moveEdge(p: Planet, k: number, r: number, u: Units): Planet {
	const gap = minGap(u);
	const above = k === 0 ? 1 : p.edges[k - 1];
	const below = k === p.edges.length - 1 ? 0 : p.edges[k + 1];
	const at = Math.max(below + gap, Math.min(above - gap, r));
	const edges = p.edges.slice();
	edges[k] = at;
	return { edges, glows: p.glows };
}

/** The planet with `count` shells: more by halving the thickest, each half keeping its glow; fewer by merging the
 *  innermost into the shell above it. */
export function withShells(p: Planet, count: number): Planet {
	let edges = p.edges.slice();
	let glows = p.glows.slice();
	while (glows.length > count && glows.length > 1) {
		edges = edges.slice(0, -1);
		glows = glows.slice(0, -1);
	}
	while (glows.length < count) {
		const r = [1, ...edges, 0];
		let widest = 0;
		for (let i = 1; i < glows.length; i++)
			if (r[i] - r[i + 1] > r[widest] - r[widest + 1]) widest = i;
		const mid = (r[widest] + r[widest + 1]) / 2;
		edges = [...edges.slice(0, widest), mid, ...edges.slice(widest)];
		glows = [...glows.slice(0, widest + 1), glows[widest], ...glows.slice(widest + 1)];
	}
	return { edges, glows };
}

// --- the presets ----------------------------------------------------------------------------------------------------

/**
 * The paper's Earth. The radii are the chapter's: the crust above 6346 km, the upper mantle above 5701 km, the lower
 * mantle above 3480 km, the outer core above 1222 km and the inner core, of R = 6371 km. The glows are in the ratios
 * of the number emissivities of the paper's fig:earth-glow, which paper/figures/make_figures.py (earth_glow) takes
 * from reference/gravcam's emission.number_emissivities for scenes/sun-at-midnight.scene.json, in gravitons
 * s⁻¹ m⁻³ sr⁻¹, crust to inner core, at 700, 1700, 2800, 4500 and 5500 K. (The scene's inner core reaches 1221.5 km;
 * the chapter rounds it to 1222.) They are scaled so that the inner core's is 10.
 */
export const EARTH_EMISSIVITY = [
	4.196213969614367e-15, 7.313262879663213e-14, 4.4715517532363525e-13, 8.67685011719474e-13,
	2.356261016397316e-12
];
export const EARTH_RADII = [6346, 5701, 3480, 1222];
export const EARTH_NAMES = ['crust', 'upper mantle', 'lower mantle', 'outer core', 'inner core'];
/** The Earth's outer core: the shell whose top is the edge of the core. */
export const EARTH_CORE = 3;

export type GoldForm = 'nugget' | 'flush' | 'skin';
export type PresetName = 'earth' | 'gold' | 'two';
export type Preset = { planet: Planet; units: Units; names: string[] };

/**
 * Gold in a steel ball, if only the gold glows: the same mass of gold as a central nugget of radius 0.2 R, spread
 * through the ball, or as a skin 0.01 R thick, each glowing in proportion to its density of gold. The nugget's glow
 * is 10, so the flush's is 10 × 0.2³ = 0.08 and the skin's 0.08/(1 − 0.99³) = 2.69. The ball's radius is 10 cm.
 */
export const NUGGET = 0.2;
export const SKIN = 0.01;
export const GOLD: Record<GoldForm, Preset> = {
	nugget: {
		planet: { edges: [NUGGET], glows: [0, 10] },
		units: MM,
		names: ['steel', 'gold nugget']
	},
	flush: {
		planet: { edges: [], glows: [10 * NUGGET ** 3] },
		units: MM,
		names: ['steel with gold']
	},
	skin: {
		planet: { edges: [1 - SKIN], glows: [(10 * NUGGET ** 3) / (1 - (1 - SKIN) ** 3), 0] },
		units: MM,
		names: ['gold skin', 'steel']
	}
};
export const GOLD_ORDER: readonly GoldForm[] = ['nugget', 'flush', 'skin'];

export const PRESETS: Record<'earth' | 'two', Preset> = {
	earth: {
		planet: {
			edges: EARTH_RADII.map((r) => r / KM.R),
			glows: EARTH_EMISSIVITY.map((e) => (10 * e) / EARTH_EMISSIVITY[4])
		},
		units: KM,
		names: EARTH_NAMES
	},
	/** The chapter's planet: 3 inside 0.6 R, 1 outside it. */
	two: {
		planet: { edges: [0.6], glows: [1, 3] },
		units: UNIT_R,
		names: ['outer shell', 'inner shell']
	}
};
export const PRESET_ORDER: readonly PresetName[] = ['earth', 'gold', 'two'];

const same = (a: number[], b: number[]) =>
	a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
const samePlanet = (a: Planet, b: Planet) => same(a.edges, b.edges) && same(a.glows, b.glows);

/** Which preset a planet is, if any, and which form of the gold. */
export function presetOf(p: Planet): { name: PresetName; form?: GoldForm } | undefined {
	if (samePlanet(p, PRESETS.earth.planet)) return { name: 'earth' };
	if (samePlanet(p, PRESETS.two.planet)) return { name: 'two' };
	const form = GOLD_ORDER.find((f) => samePlanet(p, GOLD[f].planet));
	return form ? { name: 'gold', form } : undefined;
}

/** Where the figure opens: the paper's Earth, the line at 40° from straight down, toward the Sun's core. */
export const OPENING = { theta: 40, preset: 'earth' as const };

// --- the predictions ------------------------------------------------------------------------------------------------

/** The first is answered once the line stands within half a degree of the kink of the core's edge. */
export const NEAR_KINK = 0.5;
/** The second once the core's glow is at least this many times what it was when it was asked. */
export const DOUBLED = 1.95;

/** The angle of steepest rise of the curve between lo and hi degrees, found from N alone on a grid of `step`. */
export function steepest(p: Planet, lo: number, hi: number, step = 0.001): number {
	let best = lo;
	let most = -1;
	for (let t = lo; t + step <= hi; t += step) {
		const s = Math.abs(brightness(p, impact(t + step)) - brightness(p, impact(t))) / step;
		if (s > most) {
			most = s;
			best = t + step / 2;
		}
	}
	return best;
}

// --- words and numbers ----------------------------------------------------------------------------------------------

const SUPER: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
};

/** A number to `figures` significant figures, with a true minus sign and no trailing zeros. */
export function fig(x: number, figures = 3): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 1e-3 && a < 1e5) return sign + String(Number(a.toPrecision(figures)));
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toPrecision(figures));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	const power = `10${[...String(e)].map((c) => SUPER[c]).join('')}`;
	return sign + (m === 1 ? power : `${m} × ${power}`);
}

/** The same as LaTeX: "2.03 \times 10^{-4}". */
export function figTex(x: number, figures = 3): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '-' : '';
	const a = Math.abs(x);
	if (a >= 1e-3 && a < 1e5) return sign + String(Number(a.toPrecision(figures)));
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toPrecision(figures));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return sign + (m === 1 ? `10^{${e}}` : `${m} \\times 10^{${e}}`);
}

/** A radius as a bare number in the units: "3480", "0.6". */
export function radiusValue(r: number, u: Units): string {
	const places = Math.max(0, -Math.floor(Math.log10(u.fine) + 1e-9));
	return Number((r * u.R).toFixed(places)).toString();
}

/** An angle in degrees to a tenth: "33.1°". */
export const deg = (t: number) => `${t.toFixed(1)}°`;

/** A radius in the units: "3480 km", "99 mm", "0.6 R". */
export const radius = (r: number, u: Units) => `${radiusValue(r, u)} ${u.name}`;

/** A count, with thin spaces between thousands: "10 000". */
export const countText = (n: number) =>
	Math.round(n)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** The total of counts as text: a power of ten as "10⁴", anything else in figures, "31 600". */
export function totalText(log: number): string {
	if (Math.abs(log - Math.round(log)) < 1e-9)
		return `10${[...String(Math.round(log))].map((c) => SUPER[c]).join('')}`;
	return countText(Number((10 ** log).toPrecision(3)));
}

/** A share as a percentage: "7.1%", "0.25%". */
export function percent(x: number): string {
	const p = 100 * x;
	if (!Number.isFinite(p)) return '∞';
	if (p >= 10) return `${Math.round(p)}%`;
	return `${Number(p.toPrecision(2))}%`;
}
