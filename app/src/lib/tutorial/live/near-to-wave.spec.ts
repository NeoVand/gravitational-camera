/** Chapter 5.2's near part and wave part of the slope, against the exact derivative and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	C,
	FREQUENCY,
	LEAD,
	OPENING,
	RANGE,
	SPAN,
	boundary,
	crossing,
	drawnField,
	drawnNear,
	drawnSlope,
	drawnWave,
	edge,
	envelope,
	field,
	fitWindow,
	frequency,
	krAt,
	nearPart,
	nearSize,
	nearSizeK2,
	peaks,
	placeOf,
	ratio,
	slope,
	wavePart,
	waveSize,
	waveSizeK2,
	wavelength,
	wavenumber,
	windowFrom
} from './near-to-wave';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

/** The largest of f over a whole cycle of ωt, sampled finely. */
function peak(f: (wt: number) => number) {
	let best = -Infinity;
	let at = 0;
	for (let j = 0; j < 100_000; j++) {
		const wt = (2 * Math.PI * j) / 100_000;
		const v = f(wt);
		if (v > best) {
			best = v;
			at = wt;
		}
	}
	return { best, at };
}

const K = wavenumber(1);
const DISTANCES = [0.01, 0.1, 0.3, 1, 3, 10].map((kr) => kr / K);

describe('the two parts of the slope', () => {
	it('have the sizes 1/r² and k/r', () => {
		for (const r of DISTANCES) {
			relative(peak((wt) => nearPart(r, K, wt)).best, nearSize(r), 1e-8);
			relative(peak((wt) => wavePart(r, K, wt)).best, waveSize(r, K), 1e-8);
			relative(nearSize(r), 1 / r ** 2, 1e-15);
			relative(waveSize(r, K), K / r, 1e-15);
		}
	});

	it('are 1/(kr)² and 1/kr in units of k², and the wave part is kr times the near part', () => {
		for (const kr of [0.01, 0.3, 1, 2.2, 50]) {
			const r = kr / K;
			relative(nearSizeK2(kr), nearSize(r) / K ** 2, 1e-12);
			relative(waveSizeK2(kr), waveSize(r, K) / K ** 2, 1e-12);
			relative(ratio(kr), kr, 1e-12);
			relative(waveSize(r, K) / nearSize(r), kr, 1e-12);
		}
	});

	it('are equal at kr = 1, r = λ/2π, and on either side the right one wins', () => {
		const f = frequency(0);
		const r = boundary(wavenumber(f));
		relative(nearSize(r), waveSize(r, wavenumber(f)), 1e-14);
		relative(r, wavelength(f) / (2 * Math.PI), 1e-14);
		relative(r / wavelength(f), 0.159155, 1e-5);
		expect(nearSizeK2(0.99)).toBeGreaterThan(waveSizeK2(0.99));
		expect(waveSizeK2(1.01)).toBeGreaterThan(nearSizeK2(1.01));
	});

	it('add to the exact derivative of the field', () => {
		for (const r of DISTANCES)
			for (const wt of [0, 0.4, 1.9, 3.7, 5.5]) {
				const h = r * 1e-5;
				const numeric = (field(r + h, K, wt) - field(r - h, K, wt)) / (2 * h);
				const exact = slope(r, K, wt);
				expect(Math.abs(numeric - exact)).toBeLessThanOrEqual(
					1e-8 * (nearSize(r) + waveSize(r, K))
				);
				expect(slope(r, K, wt)).toBe(nearPart(r, K, wt) + wavePart(r, K, wt));
			}
	});

	it('are drawn multiplied by r²: the near part of envelope 1, the wave part of envelope kr', () => {
		for (const r of DISTANCES) {
			const kr = K * r;
			for (const wt of [0, 1, 2.5, 4]) {
				relative(drawnNear(kr, wt), r * r * nearPart(r, K, wt), 1e-12);
				relative(drawnWave(kr, wt), r * r * wavePart(r, K, wt), 1e-12);
				relative(drawnSlope(kr, wt), r * r * slope(r, K, wt), 1e-10);
				relative(drawnField(kr, wt), r * field(r, K, wt), 1e-12);
			}
			relative(peak((wt) => drawnNear(kr, wt)).best, envelope(kr).near, 1e-9);
			relative(peak((wt) => drawnWave(kr, wt)).best, envelope(kr).wave, 1e-9);
			relative(peak((wt) => drawnSlope(kr, wt)).best, envelope(kr).sum, 1e-8);
		}
		// the envelopes cross where the parts are equal
		expect(envelope(1).near).toBe(envelope(1).wave);
	});

	it('near the source add to the static slope of the source as it is now, to order (kr)²', () => {
		// the source b = cos ωt; its static slope is −b/r², so r² × slope should be −cos ωt (1 + ½(kr)²)
		for (const kr of [1e-3, 1e-2, 3e-2]) {
			for (const wt of [0, 0.7, 2]) {
				const drawn = drawnSlope(kr, wt);
				const now = -Math.cos(wt) * (1 + 0.5 * kr * kr);
				expect(Math.abs(drawn - now)).toBeLessThan(kr ** 3);
				// the delay alone would be off by kr itself
				if (Math.abs(Math.sin(wt)) > 0.5)
					expect(Math.abs(drawnNear(kr, wt) + Math.cos(wt))).toBeGreaterThan(0.4 * kr);
			}
		}
	});
});

describe('the timing at one distance', () => {
	it('puts the wave part a quarter cycle ahead of the near part, both delayed by kr', () => {
		for (const kr of [0.05, 0.3, 1, 2.5, 7]) {
			const near = peak((wt) => drawnNear(kr, wt)).at;
			const wave = peak((wt) => drawnWave(kr, wt)).at;
			const lead = ((((near - wave) / (2 * Math.PI)) % 1) + 1) % 1;
			expect(Math.abs(lead - LEAD)).toBeLessThan(1e-4);
			expect(Math.abs(near - peaks(kr).near)).toBeLessThan(1e-4);
			expect(Math.abs(wave - peaks(kr).wave)).toBeLessThan(1e-4);
			// the field drawn as r u = cos(kr − ωt) peaks at ωt = kr, the source's peak delayed by r/c
			const u = peak((wt) => drawnField(kr, wt)).at;
			expect(Math.abs(u - (kr % (2 * Math.PI)))).toBeLessThan(1e-4);
		}
	});
});

describe('the edge', () => {
	it('is the chapter’s 47,700 km at 1 Hz and 47.7 km at 1 kHz', () => {
		relative(edge(1), C / (2 * Math.PI), 1e-15);
		expect(Math.round(edge(1) / 1e5) * 100).toBe(47_700);
		expect(Math.round(edge(1000) / 100) / 10).toBe(47.7);
	});

	it('moves twice as far out when the frequency halves', () => {
		for (const octaves of [-0.5, 0, 0.25, 1]) {
			const f = frequency(octaves);
			relative(edge(f / 2), 2 * edge(f), 1e-14);
			relative(edge(frequency(octaves - 1)), 2 * edge(f), 1e-14);
		}
		// at a fixed distance in metres kr halves, so the probe's ratio of the parts halves
		const place = placeOf(0.3, 0);
		relative(krAt(place, -1), 0.15, 1e-12);
	});

	it('the higher derivatives cross at kr = 1, 1.41, 1.82 and 2.21', () => {
		expect([1, 2, 3, 4].map((n) => Number(crossing(n).toFixed(2)))).toEqual([1, 1.41, 1.82, 2.21]);
		relative(crossing(2), Math.SQRT2, 1e-14);
	});
});

describe('the window', () => {
	it('opens at 0.03λ to 3λ, with the probe at kr = 0.3', () => {
		relative(10 ** OPENING.from, 0.03, 1e-12);
		relative(10 ** (OPENING.from + SPAN), 3, 1e-12);
		relative(krAt(placeOf(OPENING.kr, OPENING.octaves), OPENING.octaves), 0.3, 1e-12);
	});

	it('keeps its metres when the frequency changes, inside 0.01λ to 10λ', () => {
		const inner = OPENING.from;
		for (let o = FREQUENCY.min; o <= FREQUENCY.max; o += FREQUENCY.step) {
			expect(fitWindow(inner, o)).toBeCloseTo(inner, 12);
			const from = windowFrom(fitWindow(inner, o), o);
			expect(from).toBeGreaterThanOrEqual(RANGE.min - 1e-12);
			expect(from + SPAN).toBeLessThanOrEqual(1 + 1e-12);
		}
		// at the window's outer limit, doubling the frequency moves the window in, to stay inside 10λ
		const outer = RANGE.max;
		expect(windowFrom(fitWindow(outer, 1), 1)).toBeCloseTo(RANGE.max, 12);
	});
});
