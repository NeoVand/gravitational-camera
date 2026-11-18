/**
 * The camera at work (camera.ts): the scene's half makes the readings, the camera's half works from them alone.
 * Expected numbers come from the Python reference run on the same readings: this file's seeded exposures were
 * written out, and read in reference/ with ../.venv/bin/python by
 *   from gravcam.inversion import *; from scipy.optimize import nnls
 *   px = array_pixels(); cells = grid(); A = design(px, cells)
 * The call that gave each number is named above it.
 */
import { describe, expect, it } from 'vitest';
import {
	CONTENTS,
	GOLD_MASS,
	GOLD_TIDE,
	GRID_EXCESS,
	LAB_NOISE,
	REDRAWS,
	SPHERE_CENTRE,
	SPHERE_RADIUS,
	ambiguities,
	analyse,
	arrayCache,
	buildArray,
	decide,
	expose,
	gaussianImage,
	labSnr,
	positiveImage,
	trueReadings,
	work,
	type Request
} from './camera';
import { GOLD_DENSITY, RIGHT, noiseForSnr, readBox } from './inversion';
import {
	DOUBT,
	GROUND,
	chance,
	deviations,
	diverging,
	massWithError,
	odds,
	ratio,
	roundUp,
	shade
} from './present';

const model = buildArray(1, 11);
const sigmaAt = (snr: number) => noiseForSnr(snr, model.spacing);

describe('the scene’s half: what is in the safe, and the readings it gives', () => {
	it('an exposure is the true readings plus noise that depends on the seed alone', () => {
		const sigma = sigmaAt(1e3);
		const a = expose(model.pixels, 'bar-right', sigma, 7);
		expect(Array.from(a)).toEqual(Array.from(expose(model.pixels, 'bar-right', sigma, 7)));
		expect(Array.from(a)).not.toEqual(Array.from(expose(model.pixels, 'bar-right', sigma, 8)));
		// the same draw under other contents and at another noise level: (reading - truth) / sigma does not change
		const truth = trueReadings(model.pixels, 'bar-right');
		const none = expose(model.pixels, 'nothing', sigmaAt(10), 7);
		a.forEach((v, i) => expect((v - truth[i]) / sigma).toBeCloseTo(none[i] / sigmaAt(10), 6));
		// 605 readings whose noise has the standard deviation asked for
		expect(a.length).toBe(605);
		const rms = Math.sqrt(a.reduce((s, v, i) => s + (v - truth[i]) ** 2, 0) / a.length);
		expect(rms / sigma).toBeGreaterThan(0.9);
		expect(rms / sigma).toBeLessThan(1.1);
	});

	it('the sphere is gold of the bar’s mass, resting on the floor of the safe', () => {
		expect((4 / 3) * Math.PI * SPHERE_RADIUS ** 3 * GOLD_DENSITY).toBeCloseTo(GOLD_MASS, 9);
		expect(SPHERE_RADIUS).toBeCloseTo(0.1589, 4);
		// the safe's cavity runs from 5 cm to 95 cm above the ground, 70 cm wide
		expect(SPHERE_CENTRE[1] - SPHERE_RADIUS).toBeCloseTo(0.05, 12);
		expect(SPHERE_CENTRE[0]).toBe(RIGHT[0]);
	});

	it('a sphere and a point give the same readings, number for number, so the same exposure', () => {
		const sphere = trueReadings(model.pixels, 'sphere');
		const point = trueReadings(model.pixels, 'point');
		const top = Math.max(...point.map(Math.abs));
		sphere.forEach((v, i) => expect(Math.abs(v - point[i])).toBeLessThanOrEqual(1e-13 * top));
		const apart = ambiguities(model.pixels, sigmaAt(1e6));
		expect(apart.spherePoint).toBeLessThan(1e-7);
		expect(apart.spherePointRelative).toBeLessThan(1e-13);
		// and so the camera's whole analysis of the two is the same
		const sigma = sigmaAt(1e3);
		const a = analyse(model, expose(model.pixels, 'sphere', sigma, 3), sigma, false);
		const b = analyse(model, expose(model.pixels, 'point', sigma, 3), sigma, false);
		expect(a.image.right[0]).toBeCloseTo(b.image.right[0], 6);
		expect(a.decision.logRatio).toBeCloseTo(b.decision.logRatio, 6);
	});
});

describe('the camera’s half: from the readings alone', () => {
	it('what cannot be told apart: worked_case(1e3) bar_point 0.58, gold_none 177', () => {
		// worked_case(1e3)["bar_point"], ["gold_none"]
		const apart = ambiguities(model.pixels, sigmaAt(1e3));
		expect(apart.barPoint).toBeCloseTo(0.5798149285891406, 9);
		expect(apart.goldNone).toBeCloseTo(177.37592318474103, 8);
		expect(apart.spherePoint).toBeLessThan(1e-9);
	});

	it('the decision: distance and chance of error are worked_case’s, at SNR 10 and 34', () => {
		// worked_case(10): left_right 1.8111554511736525, error 0.18257970146405988; worked_case(34): 6.15792853399042,
		// 0.001038607973512946
		for (const [snr, d, error] of [
			[10, 1.8111554511736525, 0.18257970146405988],
			[34, 6.15792853399042, 0.001038607973512946]
		]) {
			const sigma = sigmaAt(snr);
			const made = decide(model, expose(model.pixels, 'bar-right', sigma, 1), sigma);
			expect(made.distance).toBeCloseTo(d, 10);
			expect(made.error / error).toBeCloseTo(1, 9);
			expect(made.errorLog10).toBeCloseTo(Math.log10(error), 9);
		}
		// where the chance underflows its logarithm does not: Phi(-90.56) is 1 in 10^1783
		const far = decide(model, model.right, sigmaAt(1e3));
		expect(far.error).toBe(0);
		expect(far.errorLog10).toBeCloseTo(-1783.2, 0);
	});

	it('at SNR 10 the decision is wrong 18% of the time, whichever safe holds the gold', () => {
		const sigma = sigmaAt(10);
		const trials = 4000;
		let wrong = 0;
		for (let seed = 1; seed <= trials; seed++) {
			const inside = seed % 2 ? 'bar-right' : 'bar-left';
			const made = decide(model, expose(model.pixels, inside, sigma, seed), sigma);
			if (made.choice !== (seed % 2 ? 'right' : 'left')) wrong++;
		}
		// 0.1826 +- 0.0061 over 4000 exposures: within three standard deviations
		expect(Math.abs(wrong / trials - 0.18257970146405988)).toBeLessThan(0.0184);
	});

	it('the decision notices when neither possibility is what is there', () => {
		const sigma = sigmaAt(1e3);
		const empty = decide(model, expose(model.pixels, 'nothing', sigma, 7), sigma);
		expect(empty.fit.poor).toBe(true);
		// about gold_none^2: the readings are 177 standard deviations from either bar
		expect(empty.fit.chi2).toBeGreaterThan(3e4);
		const full = decide(model, expose(model.pixels, 'bar-right', sigma, 7), sigma);
		expect(full.choice).toBe('right');
		expect(full.fit.poor).toBe(false);
		expect(full.fit.count).toBe(605);
		// at SNR 10 it cannot notice: no gold at all is 1.8 standard deviations from a bar
		const dim = decide(model, expose(model.pixels, 'nothing', sigmaAt(10), 7), sigmaAt(10));
		expect(dim.fit.poor).toBe(false);
	});

	// exposure seed 7 of the bar in the right safe: y written out; then in Python
	//   mean, cov = posterior(A, y, sigma, GOLD_MASS); region_mass(mean, cov, cells, RIGHT), region_mass(..., LEFT)
	//   x, _ = nnls(A / sigma, y / sigma, maxiter=5000); x[footprint(cells, RIGHT)].sum(), x[footprint(cells, LEFT)].sum()
	//   C = sigma**2 * np.eye(605) + GOLD_MASS**2 * A @ A.T; y @ np.linalg.solve(C, y)
	const sevens = [
		{
			snr: 10,
			right: [58.198123007665934, 947.0477092987627],
			left: 242.07696141710161,
			positive: [0, 0],
			chi2: 590.5841719857272
		},
		{
			snr: 34,
			right: [73.180356719851, 879.9815739371658],
			left: 318.5826258124927,
			positive: [329.5252614980966, 0],
			chi2: 587.7245476230291
		},
		{
			snr: 1e3,
			right: [383.0670270470964, 728.6228582760165],
			left: 199.3863254612814,
			positive: [299.8621274999964, 0],
			chi2: 574.2133461393689
		}
	];

	it.each(sevens)(
		'exposure 7 at SNR $snr: the Gaussian image and the positive fit are the reference’s on the same readings',
		({ snr, right, left, positive, chi2 }) => {
			const sigma = sigmaAt(snr);
			const y = expose(model.pixels, 'bar-right', sigma, 7);
			const image = gaussianImage(model, y, sigma);
			expect(image.right[0]).toBeCloseTo(right[0], 6);
			expect(image.right[1]).toBeCloseTo(right[1], 6);
			expect(image.left[0]).toBeCloseTo(left, 6);
			expect(image.left[1]).toBeCloseTo(right[1], 6);
			expect(image.fit.chi2).toBeCloseTo(chi2, 6);
			expect(image.fit.poor).toBe(false);
			expect(image.mass.length).toBe(231);
			// no cell is known worse than its prior
			for (const s of image.spread) expect(s).toBeLessThanOrEqual(GOLD_MASS * (1 + 1e-12));
			const fit = positiveImage(model, y, sigma, 0);
			expect(fit.right[0]).toBeCloseTo(positive[0], 6);
			expect(fit.left[0]).toBeCloseTo(positive[1], 6);
			for (const m of fit.mass) expect(m).toBeGreaterThanOrEqual(0);
		}
	);

	it('the Gaussian image at SNR 1e3 knows a safe’s contents to +-730 kg, whatever is inside', () => {
		const sigma = sigmaAt(1e3);
		for (const contents of CONTENTS) {
			const image = gaussianImage(model, expose(model.pixels, contents, sigma, 2), sigma);
			expect(image.right[1]).toBeCloseTo(728.6228582760165, 6);
			expect(image.left[1]).toBeCloseTo(728.6228582760151, 6);
			// and the mass it gives is within three errors of the truth
			expect(Math.abs(image.right[0])).toBeLessThan(GOLD_MASS + 3 * 728.7);
		}
		// at SNR 1e6 still +-490 kg (worked_case(1e6)["right"][1] = 489.488)
		const sharp = sigmaAt(1e6);
		expect(
			gaussianImage(model, expose(model.pixels, 'bar-right', sharp, 2), sharp).right[1]
		).toBeCloseTo(489.4875, 3);
	});

	it('with positivity at SNR 1e3 the gold is found in the right safe, and its spread is the reference’s kind', () => {
		// positive_case(1e3): 317 +- 16 kg right, 0.06 +- 0.29 kg left, the spread taken about the true scene. Here it
		// is taken about the camera's own fit, over the same number of redraws; seeds 1 to 8 of the reference give
		// spreads from 14 to 34 kg.
		const sigma = sigmaAt(1e3);
		const found: number[] = [];
		const spreads: number[] = [];
		for (let seed = 1; seed <= 12; seed++) {
			const image = positiveImage(
				model,
				expose(model.pixels, 'bar-right', sigma, seed),
				sigma,
				REDRAWS,
				seed
			);
			found.push(image.right[0]);
			spreads.push(image.right[1]);
			expect(image.left[0]).toBeLessThan(15);
			expect(image.fit.poor).toBe(false);
		}
		const mean = found.reduce((a, b) => a + b, 0) / found.length;
		// within the stated error of the stated value, and each exposure's own error of the stated size
		expect(Math.abs(mean - 317)).toBeLessThan(16);
		const typical = spreads.sort((a, b) => a - b)[6];
		expect(typical).toBeGreaterThan(8);
		expect(typical).toBeLessThan(40);
		// against +-730 kg without positivity
		expect(typical * 15).toBeLessThan(728.6);
	});

	it('a bar fitted as points comes out 1% heavy, and at SNR 1e6 the fit says the grid is wrong', () => {
		// x, _ = nnls(A / sigma, read_box(px, RIGHT) / sigma, maxiter=5000); x[footprint(cells, RIGHT)].sum() = 327.664
		const clean = positiveImage(model, readBox(model.pixels, RIGHT), sigmaAt(1e3), 0);
		expect(clean.right[0]).toBeCloseTo(327.6639863186257, 6);
		expect(clean.right[0] / GOLD_MASS - 1).toBeCloseTo(GRID_EXCESS, 3);
		const sigma = sigmaAt(1e6);
		const sharp = positiveImage(model, expose(model.pixels, 'bar-right', sigma, 7), sigma, 8);
		expect(sharp.fit.poor).toBe(true);
		// the noise's spread is far smaller than the grid's error of 3.4 kg: the view says so when `fit.poor`
		expect(sharp.right[1]).toBeLessThan(0.5);
		expect(sharp.right[0] - GOLD_MASS).toBeGreaterThan(3);
	});

	it('nothing in the camera’s half is given the contents: the same readings, the same analysis', () => {
		const sigma = sigmaAt(34);
		const y = expose(model.pixels, 'bar-left', sigma, 5);
		const once = analyse(model, y, sigma, true, 9);
		const again = analyse(model, Float64Array.from(y), sigma, true, 9);
		expect(again).toEqual(once);
		// the functions take the array, the readings and the noise, and nothing else
		expect(decide.length).toBe(3);
		expect(gaussianImage.length).toBe(3);
		expect(analyse.length).toBeLessThanOrEqual(5);
	});
});

describe('one exposure, from the scene to the camera', () => {
	const request: Request = {
		snr: 1e3,
		side: 1,
		n: 11,
		seed: 1,
		positive: false,
		contents: 'bar-right'
	};

	it('the same request gives the same exposure, and an array is factored once', () => {
		const arrays = arrayCache();
		const a = work(request, arrays);
		const b = work(request, arrays);
		expect(arrays.size).toBe(1);
		expect(Array.from(b.readings)).toEqual(Array.from(a.readings));
		expect(b.analysis.image.right).toEqual(a.analysis.image.right);
		expect(a.sigma).toBeCloseTo(3.533183725714286e-11, 24);
		expect([a.across, a.up, a.spacing]).toEqual([21, 11, 0.1]);
		expect(a.analysis.decision.choice).toBe('right');
		expect(a.analysis.image.right[1]).toBeCloseTo(728.6228582760165, 6);
	});

	it('the error of the decision falls as the SNR rises, and the image’s error with it, slowly', () => {
		const arrays = arrayCache();
		const at = (snr: number) => work({ ...request, snr }, arrays).analysis;
		const errors = [1, 10, 34, 100].map((snr) => at(snr).decision.error);
		for (let k = 1; k < errors.length; k++) expect(errors[k]).toBeLessThan(errors[k - 1]);
		// worked_case(1)["error_left_right"] = 0.463921993312027
		expect(errors[0]).toBeCloseTo(0.463921993312027, 10);
		const widths = [10, 1e3, 1e6].map((snr) => at(snr).image.right[1]);
		expect(widths[0]).toBeCloseTo(947.0477, 3);
		expect(widths[1]).toBeCloseTo(728.6229, 3);
		expect(widths[2]).toBeCloseTo(489.4875, 3);
	});

	it('every array the controls allow can be worked, from 5 x 5 to 21 x 21 and 25 cm to 4 m', () => {
		const arrays = arrayCache();
		for (const [side, n] of [
			[0.25, 5],
			[4, 5],
			[0.25, 21],
			[4, 21],
			[2, 6]
		]) {
			const shot = work({ ...request, side, n, positive: true }, arrays);
			expect(shot.readings.length).toBe(5 * n * n);
			expect(Number.isFinite(shot.analysis.image.right[0])).toBe(true);
			expect(Number.isFinite(shot.analysis.image.right[1])).toBe(true);
			expect(shot.analysis.decision.distance).toBeGreaterThan(0);
		}
	}, 30_000);

	it('the premise: a 0.02 E gradiometer reads the gold at 50 to 1, which is SNR 1,767 for this array', () => {
		// noise_for_snr(1, 3.5) = 2 G m / z^3 = 1.009481064489796e-09; noise_for_snr(2e-11, 0.1) = 1766.591862857143
		expect(GOLD_TIDE).toBeCloseTo(1.009481064489796e-9, 21);
		expect(GOLD_TIDE / LAB_NOISE).toBeCloseTo(50.47, 2);
		expect(labSnr(0.1)).toBeCloseTo(1766.591862857143, 8);
		// by its definition: at that SNR the noise per component is the gradiometer's
		expect(noiseForSnr(labSnr(0.25), 0.25)).toBeCloseTo(LAB_NOISE, 22);
	});
});

describe('numbers as text', () => {
	it('a mass with its error, to the digits the error has', () => {
		expect(massWithError(383.07, 728.6)).toBe('383 ± 729 kg');
		expect(massWithError(-195.6, 728.6)).toBe('−196 ± 729 kg');
		expect(massWithError(316.77, 15.77)).toBe('317 ± 16 kg');
		expect(massWithError(327.53, 0.77)).toBe('327.53 ± 0.77 kg');
		expect(massWithError(327.661, 0.025)).toBe('327.661 ± 0.025 kg');
		expect(massWithError(-0.2, 729)).toBe('0 ± 729 kg');
	});

	it('a chance, from its logarithm', () => {
		expect(chance(Math.log10(0.463921993312027))).toBe('46%');
		expect(chance(Math.log10(0.18257970146405988))).toBe('18%');
		expect(chance(Math.log10(0.018))).toBe('1.8%');
		expect(chance(Math.log10(0.001038607973512946))).toBe('0.10%');
		expect(chance(Math.log10(4.2e-6))).toBe('1 in 2.4 × 10⁵');
		expect(chance(-1783.2)).toBe('1 in 10¹⁷⁸³');
		expect(chance(-1.78e9)).toBe('1 in 10ⁿ with n = 1.8 × 10⁹');
	});

	it('standard deviations, likelihood ratios and signal-to-noise ratios', () => {
		expect(deviations(0)).toBe('0.000');
		expect(deviations(0.5798)).toBe('0.58');
		expect(deviations(1.8112)).toBe('1.81');
		expect(deviations(24.42)).toBe('24.4');
		expect(deviations(181.1)).toBe('181');
		expect(deviations(181115)).toBe('1.8 × 10⁵');
		expect(odds(Math.log(1.6))).toBe('1.6 to 1');
		expect(odds(Math.log(440))).toBe('440 to 1');
		expect(odds(16158)).toBe('10⁷⁰¹⁷ to 1');
		expect(ratio(1)).toBe('1');
		expect(ratio(34)).toBe('34');
		expect(ratio(1000)).toBe('1,000');
		expect(ratio(1e6)).toBe('1.0 × 10⁶');
	});

	it('a scale’s end is rounded up, never down, and colours run from the ground to full', () => {
		expect(roundUp(1.234e-9)).toBeCloseTo(1.3e-9, 20);
		expect(roundUp(4.5e-10)).toBeCloseTo(4.5e-10, 20);
		expect(roundUp(9.91e-9)).toBeCloseTo(1e-8, 19);
		expect(roundUp(0)).toBe(1);
		expect(shade(DOUBT, 0)).toEqual(GROUND);
		expect(shade(DOUBT, 1)).toEqual(DOUBT);
		// beyond the scale's end the colour stays at full: nothing is drawn brighter than the scale shows
		expect(shade(DOUBT, 7)).toEqual(DOUBT);
		expect(diverging([1, 2, 3], [200, 100, 50], -5, 5)).toEqual([1, 2, 3]);
		expect(diverging([1, 2, 3], [200, 100, 50], 0, 5)).toEqual(GROUND);
	});
});
