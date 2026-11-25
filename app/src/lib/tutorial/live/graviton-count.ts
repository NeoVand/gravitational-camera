/**
 * The numbers of chapter 0.3's graviton count, for its live figure. Gravitons arrive one at a time and at random, so
 * the count in an exposure is a Poisson draw: its mean μ is the rate times the time, and it varies by √μ about it.
 * A part of a picture is told ten per cent brighter than a level known in advance at five standard deviations when
 * 5√N = 0.1 N, that is with N = (5/0.1)² = 2500 counts in it, so an exposure of mean count μ gives ⌊μ/2500⌋ picture
 * elements (paper, Section IX, *The graviton budget*). The rates are the paper's Table tab:budget, for a detector of
 * one square metre that collects from every direction.
 *
 * Besides those numbers this draws, from a seeded generator, one exposure: the counts of each picture element at a
 * hundred moments of it, and the arrivals as dots on a time line, thinned to at most 500.
 */

export const HOUR = 3600;
export const YEAR = 365.25 * 86400;
/** A lifetime, as the chapter and the paper take it. */
export const LIFETIME = 80 * YEAR;

/** The contrast to be seen, and at how many standard deviations. */
export const CONTRAST = 0.1;
export const SIGMAS = 5;
/** The counts a picture element needs: 5√N = 0.1 N. */
export const COUNTS_PER_ELEMENT = (SIGMAS / CONTRAST) ** 2;

export type SourceId = 'sun' | 'earth' | 'iron' | 'pair';

export interface Source {
	id: SourceId;
	/** A short name, for the choice. */
	name: string;
	/** What is counted, from the paper's table. */
	scene: string;
	/** One graviton per square metre every this many seconds. */
	every: number;
}

/**
 * The thermal and wave rows of the paper's table tab:budget. The hot iron's 1.1 × 10⁸ years is the block's
 * 5.4 × 10⁻¹⁴ gravitons a second spread over 4π(3.86 m)², the line of sight to its middle (chapter R10b).
 */
export const SOURCES: Record<SourceId, Source> = {
	sun: { id: 'sun', name: 'The Sun’s core', scene: 'the Sun’s core, at midnight', every: 1 },
	earth: {
		id: 'earth',
		name: 'The Earth below',
		scene: 'the whole Earth below, an upper bound',
		every: 20 * HOUR
	},
	iron: {
		id: 'iron',
		name: 'Hot iron',
		scene: 'the hot iron of the closed furnace, at 3.9 m',
		every: 1.1e8 * YEAR
	},
	pair: {
		id: 'pair',
		name: 'Turning pair',
		scene: 'one turning pair, at 4.5 m',
		every: 4e7 * YEAR
	}
};

/** The mean count μ on `area` square metres in `seconds`. */
export const expectedCount = (source: Source, area: number, seconds: number) =>
	(area * seconds) / source.every;

/** The picture elements a mean count allows, at ten per cent contrast and five standard deviations. */
export const pictureElements = (mu: number) => Math.floor((mu / COUNTS_PER_ELEMENT) * (1 + 1e-12));

/** The time a source takes, on `area`, to give a mean count of `count`. */
export const timeFor = (source: Source, area: number, count: number) =>
	(count * source.every) / area;

/** The chance of a count of exactly `k` when the mean is `mu`. */
export function poissonChance(k: number, mu: number): number {
	if (mu === 0) return k === 0 ? 1 : 0;
	return Math.exp(k * Math.log(mu) - mu - logFactorial(k));
}

// --- random numbers --------------------------------------------------------------------------------------------------

/** A small seeded generator (mulberry32), uniform on [0, 1): the same seed gives the same draw on the server and here. */
export function generator(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** ln k!, exactly from a table below 256 and by Stirling's series above. */
const FACTORIALS = (() => {
	const table = new Float64Array(256);
	for (let k = 2; k < 256; k++) table[k] = table[k - 1] + Math.log(k);
	return table;
})();

export function logFactorial(k: number): number {
	if (k < 256) return FACTORIALS[k];
	const x = k + 1;
	return (
		(x - 0.5) * Math.log(x) -
		x +
		0.5 * Math.log(2 * Math.PI) +
		1 / (12 * x) -
		1 / (360 * x ** 3) +
		1 / (1260 * x ** 5)
	);
}

/** A standard normal number, by Box and Muller. */
function normal(random: () => number): number {
	const u = 1 - random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

/**
 * One Poisson count of mean `mu`: by multiplying uniforms below a mean of 30, by Hörmann's transformed rejection
 * (PTRS) up to 10⁹, and above that by the normal law, which is then exact to far better than one count in √μ.
 */
export function poisson(mu: number, random: () => number): number {
	if (!(mu > 0)) return 0;
	if (mu < 30) {
		const limit = Math.exp(-mu);
		let k = 0;
		let p = random();
		while (p > limit) {
			k++;
			p *= random();
		}
		return k;
	}
	if (mu > 1e9) return Math.max(0, Math.round(mu + Math.sqrt(mu) * normal(random)));
	const slam = Math.sqrt(mu);
	const logMu = Math.log(mu);
	const b = 0.931 + 2.53 * slam;
	const a = -0.059 + 0.02483 * b;
	const invAlpha = 1.1239 + 1.1328 / (b - 3.4);
	const vr = 0.9277 - 3.6224 / (b - 2);
	for (;;) {
		const u = random() - 0.5;
		const v = random();
		const us = 0.5 - Math.abs(u);
		const k = Math.floor(((2 * a) / us + b) * u + mu + 0.43);
		if (us >= 0.07 && v <= vr) return k;
		if (k < 0 || (us < 0.013 && v > us)) continue;
		if (
			Math.log(v) + Math.log(invAlpha) - Math.log(a / (us * us) + b) <=
			-mu + k * logMu - logFactorial(k)
		)
			return k;
	}
}

// --- the picture ----------------------------------------------------------------------------------------------------

/** A tile of the picture, in a unit square, y downwards. */
export interface Tile {
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * `count` tiles of equal area that fill the unit square: about √count rows, the tiles shared among them as evenly as
 * can be, and each row as tall as its share of the tiles, so that every tile has the area 1/count.
 */
export function tiling(count: number): Tile[] {
	const n = Math.max(1, Math.floor(count));
	const rows = Math.max(1, Math.round(Math.sqrt(n)));
	const base = Math.floor(n / rows);
	const extra = n - base * rows;
	const tiles: Tile[] = [];
	let y = 0;
	for (let r = 0; r < rows; r++) {
		// the rows with one tile more go to the bottom
		const inRow = base + (r >= rows - extra ? 1 : 0);
		const h = inRow / n;
		for (let c = 0; c < inRow; c++) tiles.push({ x: c / inRow, y, w: 1 / inRow, h });
		y += h;
	}
	return tiles;
}

/** The rings of the scene, from the outside in: radius in half-widths of the picture, and relative brightness. */
export const RINGS = [
	{ r: Infinity, level: 1 },
	{ r: 0.78, level: 1 + CONTRAST },
	{ r: 0.52, level: 1 + 2 * CONTRAST },
	{ r: 0.26, level: 1 + 3 * CONTRAST }
];

/** The scene's brightness at (x, y) in the unit square: rings ten per cent apart about its centre. */
export function scene(x: number, y: number): number {
	const r = Math.hypot(2 * x - 1, 2 * y - 1);
	let level = RINGS[0].level;
	for (const ring of RINGS) if (r < ring.r) level = ring.level;
	return level;
}

/** The mean brightness of the scene over a tile, from a grid of samples. */
export function tileBrightness(tile: Tile, samples = 12): number {
	let sum = 0;
	for (let i = 0; i < samples; i++)
		for (let j = 0; j < samples; j++)
			sum += scene(
				tile.x + ((i + 0.5) / samples) * tile.w,
				tile.y + ((j + 0.5) / samples) * tile.h
			);
	return sum / samples ** 2;
}

// --- one exposure ----------------------------------------------------------------------------------------------------

/** The moments at which the counts are kept: the exposure in this many equal steps. */
export const STEPS = 100;
/** The most picture elements drawn; beyond it each drawn tile stands for several. */
export const MOST_TILES = 1024;
/** The most arrivals drawn as dots. */
export const MOST_DOTS = 500;

export interface Exposure {
	/** The mean count over the whole exposure. */
	mu: number;
	/** The count drawn. */
	total: number;
	/** The picture elements the mean count allows. */
	elements: number;
	tiles: (Tile & {
		/** The scene's mean brightness over the tile. */
		truth: number;
		/** The tile's mean count over the whole exposure. */
		mean: number;
		/** Its count by the end of each step: `counts[j]` after j steps, `counts[0] = 0`. */
		counts: Float64Array;
	})[];
	/** The whole count by the end of each step. */
	counts: Float64Array;
	/** The arrivals drawn, at times in [0, 1) of the exposure, with a height in [0, 1) to spread them on a line. */
	dots: { t: number; lift: number }[];
	/** How many arrivals each dot stands for, on average: 1 unless thinned. */
	perDot: number;
}

/**
 * One exposure of mean count `mu`, drawn from `seed`. The picture is cut into as many tiles as it has picture
 * elements (at least one, at most MOST_TILES); each tile collects in proportion to the scene's brightness over it,
 * and its count grows step by step by independent Poisson draws, so that the whole count is a Poisson draw of mean
 * `mu` too.
 */
export function expose(mu: number, seed: number): Exposure {
	const random = generator(seed);
	const elements = pictureElements(mu);
	const shapes = tiling(Math.min(MOST_TILES, Math.max(1, elements)));
	const truths = shapes.map((t) => tileBrightness(t));
	const weight = truths.reduce((s, b) => s + b, 0);

	const counts = new Float64Array(STEPS + 1);
	const tiles = shapes.map((shape, i) => {
		const mean = (mu * truths[i]) / weight;
		const own = new Float64Array(STEPS + 1);
		for (let j = 1; j <= STEPS; j++) {
			own[j] = own[j - 1] + poisson(mean / STEPS, random);
			counts[j] += own[j] - own[j - 1];
		}
		return { ...shape, truth: truths[i], mean, counts: own };
	});
	// so far each step's own arrivals: added up, the count by the end of each step
	for (let j = 1; j <= STEPS; j++) counts[j] += counts[j - 1];
	const total = counts[STEPS];

	// the dots: every arrival while there are few, otherwise MOST_DOTS shared among the steps by their counts
	const share = new Array<number>(STEPS).fill(0);
	if (total <= MOST_DOTS) {
		for (let j = 0; j < STEPS; j++) share[j] = counts[j + 1] - counts[j];
	} else {
		const exact = Array.from(
			{ length: STEPS },
			(_, j) => ((counts[j + 1] - counts[j]) / total) * MOST_DOTS
		);
		for (let j = 0; j < STEPS; j++) share[j] = Math.floor(exact[j]);
		let left = MOST_DOTS - share.reduce((s, k) => s + k, 0);
		const order = exact
			.map((e, j) => ({ j, rest: e - Math.floor(e) }))
			.sort((p, q) => q.rest - p.rest || p.j - q.j);
		for (const { j } of order) {
			if (left <= 0) break;
			share[j]++;
			left--;
		}
	}
	const dots: { t: number; lift: number }[] = [];
	for (let j = 0; j < STEPS; j++) {
		const inStep = Array.from({ length: share[j] }, () => (j + random()) / STEPS).sort(
			(p, q) => p - q
		);
		for (const t of inStep) dots.push({ t, lift: random() });
	}

	return {
		mu,
		total,
		elements,
		tiles,
		counts,
		dots,
		perDot: dots.length ? total / dots.length : 1
	};
}

/** The count by the fraction `u` of the exposure: exact while every arrival is a dot, between the steps otherwise. */
export function countBy(exposure: Exposure, u: number): number {
	const at = Math.max(0, Math.min(1, u));
	if (exposure.total <= MOST_DOTS) return exposure.dots.filter((d) => d.t <= at).length;
	const j = Math.min(STEPS - 1, Math.floor(at * STEPS));
	const inStep = exposure.counts[j + 1] - exposure.counts[j];
	return exposure.counts[j] + Math.round((at * STEPS - j) * inStep);
}

/**
 * A tile's brightness as its counts by the fraction `u` tell it, relative to the scene's mean: its count over the
 * count it would have at the scene's mean brightness. Undefined before the first step has ended.
 */
export function tileEstimate(
	exposure: Exposure,
	tile: Exposure['tiles'][number],
	u: number
): number | undefined {
	const j = Math.floor(Math.max(0, Math.min(1, u)) * STEPS + 1e-9);
	if (j === 0 || tile.mean === 0) return undefined;
	return (tile.counts[j] / ((tile.mean * j) / STEPS)) * tile.truth;
}
