/**
 * The near-to-far figure's arithmetic (near-to-far.ts): the paper's pair and the speed slider, the view and the probe
 * kept in metres, the map's phases, the readings, the keys and the predictions. The physics itself is checked in
 * ../../engine/multipole.spec.ts.
 */
import { describe, expect, it } from 'vitest';
import { C } from '../../engine/physics/constants';
import { planeAmplitude, planeTide } from '../../engine/multipole';
import {
	CROSSING,
	EDGE,
	LAW3,
	OPENING,
	PAIR,
	PROBE,
	SPEED,
	ZOOM,
	atCrossing,
	crossingAt,
	halvedFrom,
	hear,
	inView,
	kmWords,
	lambdaAt,
	lawWords,
	noteFirst,
	noteSecond,
	pairAt,
	phaseGrid,
	probeMetres,
	probePlace,
	reading,
	scaleBar,
	separationOverLambda,
	shade,
	snapTo,
	speedOverC,
	speedStep,
	stepped,
	texThree,
	three,
	widthFor,
	zoomFor
} from './near-to-far';

const close = (a: number, b: number, rel: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(rel * Math.max(Math.abs(a), Math.abs(b)));

describe('the paper’s pair and the speed slider', () => {
	it('opens on the paper’s numbers', () => {
		expect(three(PAIR.omega)).toBe('27.3');
		expect(three(speedOverC(0))).toBe('0.100');
		expect(kmWords(lambdaAt(0))).toBe('34,400 km');
		expect(kmWords(lambdaAt(0) * EDGE)).toBe('5,480 km');
		expect(kmWords(crossingAt(0))).toBe('10,800 km');
		expect(three(crossingAt(0) / PAIR.separation)).toBe('4.90');
	});

	it('halving the speed at the same separation doubles λ in metres and the crossing in km', () => {
		close(speedOverC(-1), speedOverC(0) / 2, 1e-14);
		close(pairAt(-1).separation, PAIR.separation, 0);
		close(lambdaAt(-1), 2 * lambdaAt(0), 1e-14);
		close(crossingAt(-1), 2 * crossingAt(0), 1e-14);
		expect(kmWords(crossingAt(-1))).toBe('21,600 km');
		// and the crossing stays at the same fraction of a wavelength
		close(crossingAt(-1) / lambdaAt(-1), CROSSING, 1e-14);
		close(crossingAt(1) / lambdaAt(1), CROSSING, 1e-14);
		// doubling it halves them
		close(crossingAt(1), crossingAt(0) / 2, 1e-14);
		// d/λ = 2v/πc
		close(separationOverLambda(0), (2 * speedOverC(0)) / Math.PI, 1e-12);
	});

	it('steps the speed in quarter octaves, from half to double', () => {
		expect(speedStep(-1.3)).toBe(-1);
		expect(speedStep(0.6)).toBe(0.5);
		expect(speedStep(-0.1)).toBe(0);
		expect(stepped(0, 'ArrowLeft', false, SPEED)).toBe(-0.25);
		expect(stepped(0, 'ArrowLeft', true, SPEED)).toBe(-0.5);
		expect(stepped(-1, 'ArrowLeft', false, SPEED)).toBe(-1);
	});
});

describe('the view and the probe, in metres', () => {
	it('opens 2λ across with the probe at 0.3λ', () => {
		close(widthFor(OPENING.zoom, 0), 2 * lambdaAt(0), 1e-12);
		close(probeMetres(OPENING.probe, 0), 0.3 * lambdaAt(0), 1e-12);
	});

	it('keeps the metres when the speed changes, so the wavelengths shown change', () => {
		const width = widthFor(OPENING.zoom, 0);
		// half the speed: twice the wavelength, so the same metres are 1λ across
		close(10 ** zoomFor(width, -1), 1, 1e-12);
		// and the probe, which stays put, is at 0.15λ
		close(10 ** probePlace(probeMetres(OPENING.probe, 0), -1), 0.15, 1e-12);
		// held to 0.02λ to 10λ
		expect(zoomFor(1e3 * lambdaAt(0), 0)).toBe(ZOOM.max);
		expect(zoomFor(1e-3 * lambdaAt(0), 0)).toBe(ZOOM.min);
		expect(probePlace(1e-3 * lambdaAt(0), 0)).toBe(PROBE.min);
	});

	it('draws a probe off the map at its edge, along its ray', () => {
		expect(inView(10, 5, 100, 50, 8)).toEqual({ x: 10, y: 5, inside: true });
		const off = inView(200, 50, 100, 50, 8);
		expect(off.inside).toBe(false);
		close(off.x, 92, 1e-12);
		close(off.y, 23, 1e-12);
		const up = inView(0, -500, 100, 50, 8);
		close(up.y, -42, 1e-12);
		expect(up.x).toBe(0);
	});

	it('snaps a dragged radius to the nearest circle within the tolerance', () => {
		const circles = [
			{ at: 51, value: 1 },
			{ at: 100, value: 2 }
		];
		expect(snapTo(97, circles, 6)).toBe(2);
		expect(snapTo(54, circles, 6)).toBe(1);
		expect(snapTo(75, circles, 6)).toBeUndefined();
	});

	it('steps the probe by hundredths of a decade, tenths with Shift, stopping at λ/2π, r⁻³ and the crossing', () => {
		// from 0.3λ the grid of hundredths, then the r⁻³ point at 0.310λ, then the crossing at 0.313λ
		let at = stepped(OPENING.probe, 'ArrowRight', false, PROBE)!;
		close(at, -0.52, 1e-12);
		at = stepped(at, 'ArrowRight', false, PROBE)!;
		close(at, -0.51, 1e-12);
		at = stepped(at, 'ArrowRight', false, PROBE)!;
		close(10 ** at, LAW3, 1e-12);
		at = stepped(at, 'ArrowRight', false, PROBE)!;
		close(10 ** at, CROSSING, 1e-12);
		expect(atCrossing(10 ** at)).toBe(true);
		close(stepped(at, 'ArrowRight', false, PROBE)!, -0.5, 1e-12);
		// and back down
		close(10 ** stepped(-0.5, 'ArrowLeft', false, PROBE)!, CROSSING, 1e-12);
		// with Shift a tenth of a decade, still stopping on the way
		close(10 ** stepped(-0.8, 'ArrowRight', true, PROBE)!, EDGE, 1e-12);
		close(stepped(Math.log10(EDGE), 'ArrowRight', true, PROBE)!, -0.7, 1e-12);
		expect(stepped(PROBE.max, 'ArrowUp', true, PROBE)).toBe(PROBE.max);
		expect(stepped(OPENING.probe, 'Home', false, PROBE)).toBe(PROBE.min);
		expect(stepped(OPENING.probe, 'x', false, PROBE)).toBeUndefined();
	});
});

describe('the readings at the probe', () => {
	it('reads the crossing: the laws equal, the exact field 3.08 times either', () => {
		const c = reading(CROSSING);
		close(c.farOverNear, 1, 1e-12);
		expect(c.overNear.toFixed(2)).toBe('3.08');
		expect(c.overFar.toFixed(2)).toBe('3.08');
		expect(c.kr.toFixed(2)).toBe('1.97');
	});

	it('reads the local law from −5 near the pair to −1 far away, −3 at 0.310λ', () => {
		expect(reading(0.02).law).toBeLessThan(-4.9);
		expect(reading(10).law).toBeGreaterThan(-1.01);
		close(reading(LAW3).law, -3, 1e-10);
		expect(lawWords(reading(LAW3).law)).toBe('−3.00');
		expect(lawWords(reading(0.3).law)).toBe('−3.09');
		expect(lawWords(reading(CROSSING).law)).toBe('−2.97');
	});

	it('reads r|𝓔_zz| in units of GΔIΩ⁴/c⁴: 4 far away, 60/(kr)⁴ near', () => {
		close(reading(1e3).strength, 4, 1e-6);
		close(reading(1e-3).strength, 60 / (2 * Math.PI * 1e-3) ** 4, 1e-4);
	});
});

describe('the map', () => {
	it('draws 𝓔_zz over its local strength, the pattern turning with the masses', () => {
		const n = 9;
		const m = 7;
		const w = 2;
		const h = 1.25;
		const { cos, sin } = phaseGrid(n, m, w, h);
		const pair = pairAt(0);
		const lambda = lambdaAt(0);
		for (const [i, j] of [
			[0, 0],
			[4, 1],
			[7, 5],
			[2, 6]
		]) {
			const x = ((i + 0.5) / n - 0.5) * w * lambda;
			const y = (0.5 - (j + 0.5) / m) * h * lambda;
			const r = Math.hypot(x, y);
			const phi = Math.atan2(y, x);
			for (const turn of [0, 0.4, 2]) {
				const t = turn / pair.omega;
				close(
					shade(cos[j * n + i], sin[j * n + i], turn),
					planeTide(pair, r, phi, t) / planeAmplitude(pair, r),
					1e-6
				);
			}
		}
	});

	it('is orange, a stretch, on the x axis near the pair at the start, where the masses stand across it', () => {
		const { cos, sin } = phaseGrid(101, 1, 0.04, 0.0004);
		// just right of the centre, at about 0.01λ
		expect(shade(cos[75], sin[75], 0)).toBeLessThan(-0.95);
		// a quarter turn later the masses lie along the x axis: blue, a squeeze
		expect(shade(cos[75], sin[75], Math.PI / 2)).toBeGreaterThan(0.95);
	});

	it('has a scale bar of 1, 2 or 5 times a power of ten, at most a fifth of the width', () => {
		expect(scaleBar(2)).toBe(0.2);
		expect(scaleBar(10)).toBe(2);
		expect(scaleBar(0.02)).toBe(0.002);
		close(scaleBar(3), 0.5, 1e-12);
	});
});

describe('the predictions', () => {
	it('answers the first once the probe stands at the crossing, not at λ/2π or where it opens', () => {
		expect(noteFirst(false, 0.3)).toBe(false);
		expect(noteFirst(false, EDGE)).toBe(false);
		expect(noteFirst(false, LAW3)).toBe(false);
		expect(noteFirst(false, CROSSING)).toBe(true);
		expect(noteFirst(false, CROSSING * 1.004)).toBe(true);
		expect(noteFirst(false, CROSSING * 1.01)).toBe(false);
		expect(noteFirst(true, 0.02)).toBe(true);
	});

	it('answers the second once the speed has been halved from one held before', () => {
		let heard = hear([], 0);
		expect(noteSecond(false, heard, 0)).toBe(false);
		heard = hear(heard, -0.25);
		heard = hear(heard, -0.5);
		expect(noteSecond(false, heard, -0.5)).toBe(false);
		heard = hear(heard, -1);
		expect(noteSecond(false, heard, -1)).toBe(true);
		expect(halvedFrom(heard, -1)).toBe(0);
		// doubling is not halving
		expect(noteSecond(false, hear([-1], 0), 0)).toBe(false);
		// from a doubled speed back to the paper's is a halving too
		expect(halvedFrom(hear([1], 0), 0)).toBe(1);
		expect(hear(heard, 0)).toBe(heard);
	});
});

describe('the words', () => {
	it('gives three figures, with the thousands apart', () => {
		expect(three(0.31333)).toBe('0.313');
		expect(three(3.0832)).toBe('3.08');
		expect(three(34437)).toBe('34,400');
		expect(texThree(34437)).toBe('34{,}400');
		expect(three(C / 1e8)).toBe('3.00');
	});
});
