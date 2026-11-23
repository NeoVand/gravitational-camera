/** Chapter 5.6's onion peeling, against the chapter's formulas and numbers and the paper's Earth. */
import { describe, expect, it } from 'vitest';
import {
	COUNTS,
	EARTH_CORE,
	EARTH_EMISSIVITY,
	GLOW,
	GOLD,
	KM,
	MAX_SHELLS,
	PRESETS,
	THIN,
	brightness,
	chord,
	curveAngles,
	deg,
	draw,
	expectedCounts,
	fig,
	grazingAngles,
	impact,
	kinkAngles,
	leastCertain,
	lengths,
	moveEdge,
	niceTop,
	peel,
	peelErrors,
	presetOf,
	propagate,
	radius,
	readings,
	steepest,
	totalText,
	withShells,
	type Planet
} from './onion-peel';

const earth = PRESETS.earth.planet;
const two = PRESETS.two.planet;
const equal = (K: number): Planet => ({
	edges: Array.from({ length: K - 1 }, (_, i) => 1 - (i + 1) / K),
	glows: Array(K).fill(1)
});
const withGlow = (p: Planet, k: number, j: number): Planet => ({
	edges: p.edges,
	glows: p.glows.map((g, i) => (i === k ? j : g))
});

/** N(b) = 2∫_b^R j(r) r dr/√(r² − b²), by the substitution r = √(b² + s²) and the midpoint rule in s. */
function abelNumeric(p: Planet, b: number, n = 200000): number {
	const top = Math.sqrt(1 - b * b);
	const r = [1, ...p.edges, 0];
	const glowAt = (x: number) => {
		for (let k = p.glows.length - 1; k >= 0; k--) if (x < r[k]) return p.glows[k];
		return 0;
	};
	let s = 0;
	for (let i = 0; i < n; i++) {
		const z = ((i + 0.5) / n) * top;
		s += glowAt(Math.hypot(b, z));
	}
	return (2 * s * top) / n;
}

describe('the chord and the lengths L_i(b)', () => {
	it('gives the chord 2√(R² − b²) = 2R cos θ, the diameter straight down and nothing along the horizon', () => {
		expect(chord(1, 0)).toBe(2);
		expect(chord(1, 1)).toBe(0);
		for (const t of [5, 40, 63.5, 89])
			expect(chord(1, impact(t))).toBeCloseTo(2 * Math.cos(t * (Math.PI / 180)), 12);
		expect(chord(0.5, 0.7)).toBe(0);
	});

	it('shares the chord among the shells: Σ L_i(b) = 2√(R² − b²)', () => {
		for (const b of [0, 0.1, 0.3, 0.55, 0.6, 0.894836, 0.99, 1]) {
			const L = lengths(earth, b);
			expect(L.reduce((s, x) => s + x, 0)).toBeCloseTo(chord(1, b), 12);
			for (const x of L) expect(x).toBeGreaterThanOrEqual(0);
		}
	});

	it('agrees with the Abel transform integrated numerically', () => {
		for (const p of [earth, two, equal(5), GOLD.skin.planet])
			for (const b of [0, 0.2, 0.45, 0.7, 0.93]) {
				expect(brightness(p, b)).toBeCloseTo(abelNumeric(p, b), 3);
			}
	});

	it("has the chapter's two-shell numbers: N(0.6R) = 1.6R, N(0) = 4.4R", () => {
		expect(brightness(two, 0.6)).toBeCloseTo(1.6, 12);
		expect(brightness(two, 0)).toBeCloseTo(4.4, 12);
		expect(lengths(two, 0)[0]).toBeCloseTo(0.8, 12);
		expect(lengths(two, 0)[1]).toBeCloseTo(1.2, 12);
	});

	it('gives a skin 0.01 R thick a rim √199 = 14 times as bright as its middle', () => {
		const p = GOLD.skin.planet;
		expect(brightness(p, 0.99) / brightness(p, 0)).toBeCloseTo(Math.sqrt(199), 9);
	});
});

describe('the kinks', () => {
	it("lie at the paper's 11.1°, 33.1° and 63.5° for the Earth, and the crust's at 84.9°", () => {
		expect(kinkAngles(earth).map((t) => t.toFixed(1))).toEqual(['84.9', '63.5', '33.1', '11.1']);
		expect(grazingAngles(earth)[4]).toBe(0);
	});

	it("show the core's edge at 33.1°, found from the curve alone, whatever the core's glow", () => {
		const kink = Math.asin(3480 / 6371) / (Math.PI / 180);
		expect(kink.toFixed(1)).toBe('33.1');
		for (const j of [0.5, 1, earth.glows[EARTH_CORE], 6, 10]) {
			const p = withGlow(earth, EARTH_CORE, j);
			const found = steepest(p, 30, 36);
			expect(Math.abs(found - kink)).toBeLessThan(0.002);
			expect(found.toFixed(1)).toBe('33.1');
		}
	});

	it("does not move when the core's glow doubles: only the climb at it changes", () => {
		const j = earth.glows[EARTH_CORE];
		const before = earth;
		const after = withGlow(earth, EARTH_CORE, 2 * j);
		expect(steepest(after, 30, 36)).toBe(steepest(before, 30, 36));
		expect(kinkAngles(after)).toEqual(kinkAngles(before));
		// outside the core nothing changes; inside it the curve climbs higher
		for (const t of [34, 40, 60, 80])
			expect(brightness(after, impact(t))).toBe(brightness(before, impact(t)));
		expect(brightness(after, impact(30))).toBeGreaterThan(brightness(before, impact(30)));
		// a kink also where the inner layer is fainter, and none where the glow does not change
		expect(steepest(withGlow(earth, EARTH_CORE, 0.2), 30, 36).toFixed(1)).toBe('33.1');
	});

	it("doubles the paper's brightness between 63.5° and 63°, inside the edge of the lower mantle", () => {
		const ratio = brightness(earth, impact(63)) / brightness(earth, impact(63.5));
		expect(ratio).toBeGreaterThan(1.9);
		expect(ratio).toBeLessThan(2.1);
	});

	it('draws the curve at every kink and just inside it', () => {
		const a = curveAngles(earth);
		for (const k of kinkAngles(earth)) {
			expect(a).toContain(k);
			expect(a.some((t) => t < k && k - t < 0.005)).toBe(true);
		}
		expect(a[0]).toBe(0);
		expect(a[a.length - 1]).toBe(90);
		for (let i = 1; i < a.length; i++) expect(a[i]).toBeGreaterThan(a[i - 1]);
	});
});

describe('the peeling', () => {
	it("returns the chapter's two-shell planet, j₁ = 1 and j₂ = 3", () => {
		const j = peel(two, readings(two));
		expect(j[0]).toBeCloseTo(1, 12);
		expect(j[1]).toBeCloseTo(3, 12);
	});

	it('returns every preset exactly from its own curve', () => {
		for (const p of [
			earth,
			two,
			GOLD.nugget.planet,
			GOLD.flush.planet,
			GOLD.skin.planet,
			equal(5)
		]) {
			const j = peel(p, readings(p));
			j.forEach((v, k) => expect(v).toBeCloseTo(p.glows[k], 10));
		}
	});

	it("carries 1% errors through five equal shells to the chapter's 1.0, 1.6, 2.2, 3.1 and 5.8%", () => {
		const p = equal(5);
		const s = propagate(
			p,
			readings(p).map((n) => 0.01 * n)
		);
		expect(s.map((x) => (100 * x).toFixed(1))).toEqual(['1.0', '1.6', '2.2', '3.1', '5.8']);
	});
});

describe('the noise', () => {
	it('shares the counts among the grazing lines in proportion to their brightness', () => {
		const n = expectedCounts(earth, 1e4);
		expect(n.reduce((s, x) => s + x, 0)).toBeCloseTo(1e4, 9);
		const N = readings(earth);
		for (let k = 1; k < n.length; k++) expect(n[k] / n[0]).toBeCloseTo(N[k] / N[0], 9);
	});

	it('repeats a draw from its seed, and changes it with a new seed', () => {
		const a = draw(earth, 1e4, 11);
		expect(draw(earth, 1e4, 11)).toEqual(a);
		expect(draw(earth, 1e4, 12).counts).not.toEqual(a.counts);
		for (const c of a.counts) expect(Number.isInteger(c)).toBe(true);
	});

	it('scatters the peeled glows as the errors carried through the peeling say', () => {
		const p = equal(3);
		const total = 1e4;
		const s = peelErrors(p, total);
		const n = 4000;
		const sums = [0, 0, 0];
		const squares = [0, 0, 0];
		for (let seed = 1; seed <= n; seed++) {
			const j = peel(p, draw(p, total, seed).readings);
			j.forEach((v, k) => {
				sums[k] += v;
				squares[k] += v * v;
			});
		}
		for (let k = 0; k < 3; k++) {
			const mean = sums[k] / n;
			const sd = Math.sqrt(squares[k] / n - mean * mean);
			expect(Math.abs(mean - 1)).toBeLessThan(4 * (s[k] / Math.sqrt(n)));
			expect(Math.abs(sd / s[k] - 1)).toBeLessThan(0.06);
		}
	});

	it('brings the innermost of equal shells back least certain, at any number of counts', () => {
		for (let K = 2; K <= MAX_SHELLS; K++)
			for (const total of [1e2, 1e4, 1e6]) {
				const p = equal(K);
				expect(leastCertain(p, total)).toBe(K - 1);
				const s = peelErrors(p, total);
				for (let k = 1; k < K; k++) expect(s[k]).toBeGreaterThan(s[k - 1]);
			}
	});

	it('brings a very thin outer shell back least certain: it sends few counts', () => {
		const p: Planet = { edges: [0.99, 0.6], glows: [1, 1, 1] };
		expect(1 - p.edges[0]).toBeLessThan(THIN);
		expect(leastCertain(p, 1e4)).toBe(0);
		// thicken it, and the innermost is again the least certain
		expect(leastCertain({ edges: [0.9, 0.6], glows: [1, 1, 1] }, 1e4)).toBe(2);
	});

	it("brings the paper's Earth's crust back least certain, to 7.1% of 10⁶ counts, of which it gets 196", () => {
		const total = 1e6;
		expect(leastCertain(earth, total)).toBe(0);
		const s = peelErrors(earth, total).map((x, k) => x / earth.glows[k]);
		expect((100 * s[0]).toFixed(1)).toBe('7.1');
		expect(Math.round(expectedCounts(earth, total)[0])).toBe(196);
		// below the mantle the errors grow inward: the inner core is the least certain of the core and the lower mantle
		expect(s[4]).toBeGreaterThan(s[3]);
		expect(s[3]).toBeGreaterThan(s[2]);
	});
});

describe('the presets', () => {
	it("give the paper's Earth its radii and its glows in the paper's ratios", () => {
		expect(earth.edges.map((r) => Math.round(r * KM.R))).toEqual([6346, 5701, 3480, 1222]);
		expect(earth.glows[4]).toBe(10);
		earth.glows.forEach((g, k) =>
			expect(g / earth.glows[0]).toBeCloseTo(EARTH_EMISSIVITY[k] / EARTH_EMISSIVITY[0], 9)
		);
		expect(earth.glows.map((g) => fig(g))).toEqual(['0.0178', '0.31', '1.9', '3.68', '10']);
		for (const g of earth.glows) expect(g).toBeLessThanOrEqual(GLOW.high);
		// doubling the core's glow stays on its slider
		expect(2 * earth.glows[EARTH_CORE]).toBeLessThanOrEqual(GLOW.high);
	});

	it('put the same mass of gold in the nugget, the flush and the skin', () => {
		const mass = (p: Planet) => {
			const r = [1, ...p.edges, 0];
			return p.glows.reduce((s, j, k) => s + j * (r[k] ** 3 - r[k + 1] ** 3), 0);
		};
		expect(mass(GOLD.flush.planet)).toBeCloseTo(mass(GOLD.nugget.planet), 12);
		expect(mass(GOLD.skin.planet)).toBeCloseTo(mass(GOLD.nugget.planet), 12);
	});

	it('are recognised, and lose their name when changed', () => {
		expect(presetOf(earth)).toEqual({ name: 'earth' });
		expect(presetOf(two)).toEqual({ name: 'two' });
		expect(presetOf(GOLD.skin.planet)).toEqual({ name: 'gold', form: 'skin' });
		expect(presetOf(withGlow(earth, 0, 1))).toBeUndefined();
	});
});

describe('changing the planet', () => {
	it('keeps a boundary between its neighbours', () => {
		const p = moveEdge(earth, 2, 0.95, KM);
		expect(p.edges[2]).toBeCloseTo(5700 / 6371, 12);
		const q = moveEdge(earth, 3, -1, KM);
		expect(q.edges[3]).toBeCloseTo(1 / 6371, 12);
	});

	it('adds a shell by halving the thickest, and takes one away by merging the innermost upward', () => {
		const p = withShells(two, 3);
		expect(p.edges).toEqual([0.6, 0.3]);
		expect(p.glows).toEqual([1, 3, 3]);
		expect(withShells(p, 2)).toEqual(two);
		expect(withShells(earth, 1)).toEqual({ edges: [], glows: [earth.glows[0]] });
		expect(withShells(GOLD.flush.planet, MAX_SHELLS).glows).toHaveLength(MAX_SHELLS);
	});
});

describe('words and numbers', () => {
	it('writes the numbers as the figure shows them', () => {
		expect(deg(33.112)).toBe('33.1°');
		expect(radius(3480 / 6371, KM)).toBe('3480 km');
		expect(radius(0.99, GOLD.skin.units)).toBe('99 mm');
		expect(radius(0.6, PRESETS.two.units)).toBe('0.6 R');
		expect(fig(0.000203)).toBe('2.03 × 10⁻⁴');
		expect(fig(-2.5)).toBe('−2.5');
		expect(totalText(COUNTS.opening)).toBe('10⁴');
		expect(totalText(4.5)).toBe('31 600');
		expect(niceTop(7.85)).toBe(10);
		expect(niceTop(4.4)).toBe(5);
		expect(niceTop(0.27)).toBe(0.5);
		expect(niceTop(2)).toBe(2);
	});
});
