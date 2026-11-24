/**
 * The memory-pattern figure's arithmetic (memory-pattern.ts): the patterns behind the buttons, the readings in units
 * of 4GE/c⁴r against the chapter's closed forms, the curves and their signs, the camera's angle, and the three
 * predictions. The sum of eq:memory-axes itself is checked in ../../engine/memory.spec.ts.
 */
import { describe, expect, it } from 'vitest';
import { total } from '../../engine/memory';
import {
	A,
	EVEN,
	JET_NEAR,
	KINDS,
	LOPSIDED,
	OPENING,
	Q,
	SPHERE_SPAN,
	THETA,
	UNIT,
	angleAt,
	closedFor,
	curveOf,
	drawnRadius,
	fixed3,
	landed,
	noteFirst,
	noteSecond,
	noteSphere,
	noteThird,
	patternOf,
	peakOf,
	percent,
	reading,
	ringsOf,
	scaleOf,
	signedRuns,
	snapAngle,
	sphereDone,
	stepped,
	texFixed3,
	two,
	type Kind,
	type Settings
} from './memory-pattern';

const at = (kind: Kind, theta: number, a = 0, q = 1): Settings => ({ kind, a, q, theta });

describe('the readings', () => {
	it('agree with the chapter’s closed form, for every pattern and direction, to 1e-12', () => {
		for (const kind of KINDS) {
			for (const a of [-1, -0.35, 0.6]) {
				for (const q of [-1, 0.4, 2]) {
					for (let theta = 0; theta <= 180; theta += 5) {
						const r = reading(at(kind, theta, a, q));
						expect(Math.abs(r.plus - r.closed)).toBeLessThan(1e-12);
						expect(Math.abs(r.cross)).toBeLessThan(1e-15);
					}
				}
			}
		}
	});

	it('are in units of 4GE/c⁴r, as the paper’s fig:memory(b)', () => {
		expect(UNIT).toBe(4);
		// one jet close to its line reads 1, two jets sharing E read ½, a sphere 0
		expect(reading(at('jet', 0.001)).plus).toBeCloseTo(1, 9);
		expect(reading(at('jets', 37)).plus).toBeCloseTo(0.5, 14);
		expect(Math.abs(reading(at('sphere', 37)).plus)).toBeLessThan(1e-16);
		// the merger edge-on, (17/24)GE/c⁴r, and 1 + qP₂ from the side, (q/2)GE/c⁴r
		expect(reading(at('merger', 90)).plus).toBeCloseTo(17 / 96, 14);
		expect(reading(at('quadrupole', 90, 0, 2)).plus).toBeCloseTo(0.25, 14);
	});

	it('the sphere and the dipole leave exactly nothing', () => {
		for (let theta = 0; theta <= 180; theta += 15) {
			expect(Math.abs(reading(at('sphere', theta)).plus)).toBeLessThan(1e-16);
			for (const a of [-1, 0.5, 1])
				expect(Math.abs(reading(at('dipole', theta, a)).plus)).toBeLessThan(1e-16);
		}
	});

	it('a single jet on its own line: zero by symmetry, the camera inside it, no division by zero', () => {
		const r = reading(at('jet', 0));
		expect(r.plus).toBe(0);
		expect(r.inside).toBe(true);
		expect(r.closed).toBe(0);
		// from behind, zero by the formula, and not inside
		const behind = reading(at('jet', 180));
		expect(behind.plus).toBeCloseTo(0, 14);
		expect(behind.inside).toBe(false);
		// two jets: inside one of them at either end
		expect(reading(at('jets', 0)).inside).toBe(true);
		expect(reading(at('jets', 180)).inside).toBe(true);
		expect(reading(at('jets', 1)).inside).toBe(false);
	});

	it('the share in degrees two and higher', () => {
		expect(reading(at('sphere', 90)).share).toBeCloseTo(0, 14);
		expect(reading(at('dipole', 90, 1)).share).toBeCloseTo(0, 14);
		expect(reading(at('merger', 90)).share).toBeCloseTo(103 / 355, 13);
		expect(reading(at('quadrupole', 90, 0, 1)).share).toBeCloseTo(1 / 6, 13);
		expect(reading(at('jet', 90)).share).toBe(1);
		expect(percent(103 / 355)).toBe('29.0%');
		expect(percent(1)).toBe('100%');
		expect(percent(0)).toBe('0%');
	});

	it('the closed form for the merger and 1 + qP₂ at the opening', () => {
		expect(closedFor('merger', 0, 1, 90)).toBeCloseTo(17 / 96, 15);
		expect(closedFor('quadrupole', 0, -1, 90)).toBeCloseTo(-1 / 8, 15);
		expect(closedFor('jets', 0, 1, 180)).toBe(0);
	});
});

describe('the patterns behind the buttons', () => {
	it('each carries the whole energy and is never negative', () => {
		for (const kind of KINDS)
			for (const a of [-1, 1])
				for (const q of [-1, 2]) {
					const p = patternOf(kind, a, q);
					expect(total(p)).toBeCloseTo(1, 13);
					if (p.smooth)
						for (let x = -1; x <= 1; x += 0.05) expect(p.smooth(x)).toBeGreaterThanOrEqual(-1e-17);
				}
	});

	it('are drawn to one scale: the sphere a third, 1 + 2P₂ the whole, the merger 5/6', () => {
		expect(drawnRadius(patternOf('sphere', 0, 0), 0.3)).toBeCloseTo(EVEN, 15);
		expect(drawnRadius(patternOf('quadrupole', 0, 2), 1)).toBeCloseTo(1, 15);
		expect(drawnRadius(patternOf('merger', 0, 0), 1)).toBeCloseTo(5 / 6, 15);
		expect(drawnRadius(patternOf('dipole', 1, 0), 1)).toBeCloseTo(2 / 3, 15);
		expect(drawnRadius(patternOf('jet', 0, 0), 1)).toBe(0);
		// nothing of the figure's ranges goes past the edge
		for (const q of [-1, 2])
			for (let x = -1; x <= 1; x += 0.01)
				expect(drawnRadius(patternOf('quadrupole', 0, q), x)).toBeLessThanOrEqual(1 + 1e-12);
	});
});

describe('the curve over the camera’s directions', () => {
	it('draws a single jet’s cardioid ½(1 + cos θ), with the limit 1 on its line and a hole there', () => {
		const { values, holes } = curveOf(patternOf('jet', 0, 0));
		expect(values).toHaveLength(181);
		expect(values[0].value).toBeCloseTo(1, 12);
		expect(values[90].value).toBeCloseTo(0.5, 14);
		expect(values[180].value).toBeCloseTo(0, 12);
		expect(holes).toEqual([0]);
		expect(peakOf(values)).toBeCloseTo(1, 12);
	});

	it('draws two jets as a circle ½ with holes at both poles; smooth patterns have none', () => {
		const { values, holes } = curveOf(patternOf('jets', 0, 0));
		for (const v of values) expect(v.value).toBeCloseTo(0.5, 12);
		expect(holes).toEqual([0, 180]);
		expect(curveOf(patternOf('merger', 0, 0)).holes).toEqual([]);
	});

	it('cuts the curve into runs of one sign', () => {
		// 1 + qP₂ with q < 0: negative all round, one dashed run from pole to pole
		const neg = signedRuns(curveOf(patternOf('quadrupole', 0, -1)).values);
		expect(neg).toHaveLength(1);
		expect(neg[0].negative).toBe(true);
		expect(neg[0].points[0].theta).toBe(0);
		expect(neg[0].points.at(-1)!.theta).toBe(180);
		// the merger positive; an octupole-like sign change at 90° gives two runs meeting there
		const pos = signedRuns(curveOf(patternOf('merger', 0, 0)).values);
		expect(pos).toHaveLength(1);
		expect(pos[0].negative).toBe(false);
		const flip = signedRuns(
			[0, 30, 60, 90, 120, 150, 180].map((t) => ({
				theta: t,
				value: Math.cos((t * Math.PI) / 180)
			}))
		);
		expect(flip.map((r) => r.negative)).toEqual([false, true]);
		expect(flip[0].points.at(-1)!.theta).toBeCloseTo(90, 12);
		expect(flip[1].points[0].theta).toBeCloseTo(90, 12);
		// the sphere: nothing to draw
		expect(signedRuns(curveOf(patternOf('sphere', 0, 0)).values)).toEqual([]);
	});

	it('scales the plot: 1 for the jets, a quarter otherwise, with four rings', () => {
		expect(scaleOf('jet')).toBe(1);
		expect(scaleOf('jets')).toBe(1);
		expect(scaleOf('merger')).toBe(0.25);
		expect(ringsOf(0.25)).toEqual([0.0625, 0.125, 0.1875, 0.25]);
		// every smooth pattern of the sliders' ranges fits inside its scale
		for (const q of [-1, 2])
			expect(peakOf(curveOf(patternOf('quadrupole', 0, q)).values)).toBeLessThanOrEqual(
				0.25 + 1e-12
			);
		expect(peakOf(curveOf(patternOf('merger', 0, 0)).values)).toBeCloseTo(17 / 96, 12);
	});
});

describe('the camera’s direction', () => {
	it('is read from ẑ, the same either side of it', () => {
		expect(angleAt(0, 1)).toBeCloseTo(0, 14);
		expect(angleAt(1, 0)).toBeCloseTo(90, 14);
		expect(angleAt(-1, 0)).toBeCloseTo(90, 14);
		expect(angleAt(0, -1)).toBeCloseTo(180, 14);
		expect(angleAt(-1, 1)).toBeCloseTo(45, 14);
	});

	it('lands on 0°, 90° and 180° within 3°, and on whole degrees elsewhere', () => {
		expect(snapAngle(2.4)).toBe(0);
		expect(snapAngle(88)).toBe(90);
		expect(snapAngle(178.1)).toBe(180);
		expect(snapAngle(4.4)).toBe(4);
		expect(snapAngle(46.6)).toBe(47);
	});

	it('steps with the keys, 1° a press, 10° with Shift, stopping at 90°', () => {
		expect(stepped(90, 'ArrowRight', false, THETA)).toBe(91);
		expect(stepped(85, 'ArrowUp', true, THETA)).toBe(90);
		expect(stepped(90, 'ArrowUp', true, THETA)).toBe(100);
		expect(stepped(3, 'ArrowLeft', true, THETA)).toBe(0);
		expect(stepped(0, 'ArrowLeft', false, THETA)).toBe(0);
		expect(stepped(42, 'End', false, THETA)).toBe(180);
		expect(stepped(42, 'Home', false, THETA)).toBe(0);
		expect(stepped(42, 'a', false, THETA)).toBeUndefined();
	});

	it('steps the sliders onto their grids', () => {
		expect(stepped(0, 'ArrowRight', false, A)).toBeCloseTo(0.05, 12);
		expect(stepped(0.4, 'ArrowRight', true, A)).toBe(0.5);
		expect(stepped(-0.9, 'ArrowLeft', true, A)).toBe(-1);
		expect(stepped(1.9, 'ArrowRight', true, Q)).toBe(2);
		expect(landed(0.30000000000000004, A)).toBe(0.3);
		expect(landed(-0.02, A)).toBe(0);
		expect(Object.is(landed(-0.02, A), -0)).toBe(false);
		expect(landed(7, Q)).toBe(2);
	});
});

describe('the predictions', () => {
	it('opens on the merger, edge-on, the dipole even, none answered', () => {
		expect(OPENING).toEqual({ kind: 'merger', a: 0, q: 1, theta: 90 });
		expect(noteFirst(false, noteSphere(undefined, OPENING.kind, OPENING.theta))).toBe(false);
		expect(noteSecond(false, OPENING.kind, OPENING.theta)).toBe(false);
		expect(noteThird(false, OPENING.kind, OPENING.a)).toBe(false);
	});

	it('the first, once the camera has turned 45° round the sphere', () => {
		let span = noteSphere(undefined, 'merger', 10);
		expect(span).toBeUndefined();
		span = noteSphere(span, 'sphere', 90);
		expect(sphereDone(span)).toBe(false);
		span = noteSphere(span, 'sphere', 120);
		expect(sphereDone(span)).toBe(false);
		// directions seen round another pattern do not count
		span = noteSphere(span, 'jet', 20);
		expect(span).toEqual({ lo: 90, hi: 120 });
		span = noteSphere(span, 'sphere', 90 + SPHERE_SPAN);
		expect(sphereDone(span)).toBe(true);
		expect(noteFirst(false, span)).toBe(true);
		expect(noteFirst(true, undefined)).toBe(true);
	});

	it('the second, once the camera stands within 10° of a single jet’s line', () => {
		expect(noteSecond(false, 'jet', JET_NEAR + 1)).toBe(false);
		expect(noteSecond(false, 'jet', JET_NEAR)).toBe(true);
		expect(noteSecond(false, 'jet', 0)).toBe(true);
		// two jets do not count, nor a jet seen from behind
		expect(noteSecond(false, 'jets', 0)).toBe(false);
		expect(noteSecond(false, 'jet', 175)).toBe(false);
		expect(noteSecond(true, 'merger', 90)).toBe(true);
	});

	it('the third, once the dipole’s a reaches ±0.5', () => {
		expect(noteThird(false, 'dipole', 0)).toBe(false);
		expect(noteThird(false, 'dipole', 0.45)).toBe(false);
		expect(noteThird(false, 'dipole', LOPSIDED)).toBe(true);
		expect(noteThird(false, 'dipole', -0.5)).toBe(true);
		// a lopsided a counts only while the dipole is shown
		expect(noteThird(false, 'quadrupole', 1)).toBe(false);
		expect(noteThird(true, 'sphere', 0)).toBe(true);
	});
});

describe('the words', () => {
	it('reads to three decimals with a true minus and no negative zero', () => {
		expect(fixed3(17 / 96)).toBe('0.177');
		expect(fixed3(-0.125)).toBe('−0.125');
		expect(fixed3(-1e-17)).toBe('0');
		expect(fixed3(1)).toBe('1.000');
		expect(texFixed3(-0.125)).toBe('-0.125');
		expect(two(-0.5)).toBe('−0.50');
		expect(two(-1e-12)).toBe('0.00');
		expect(two(2)).toBe('2.00');
	});
});
