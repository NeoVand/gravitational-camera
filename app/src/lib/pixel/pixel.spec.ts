/**
 * The site's pixel algebra against the Python reference (reference/fixtures/pixel.json, written by
 * `python -m gravcam.export_pixel`).
 */
import { describe, expect, it } from 'vitest';
import fixtures from '../../../../reference/fixtures/pixel.json';
import {
	abs,
	cmat,
	cx,
	fnorm,
	madd,
	mscale,
	norm,
	type CMat3,
	type CVec3,
	type Vec3
} from './complex';
import {
	bodyVelocity,
	eigenvalues,
	fourWaves,
	invariants,
	lightStars,
	lightTwoWaves,
	motionAlarm,
	movingChargesF,
	movingMassesW,
	nullFrame,
	petrov,
	planeWaveW,
	restFrameVelocity,
	stars
} from './pixel';

const mat = (W: { re: number[][]; im: number[][] }): CMat3 =>
	cmat((i, j) => cx(W.re[i][j], W.im[i][j]));
const cvec = (F: number[][]): CVec3 => F.map(([re, im]) => cx(re, im)) as CVec3;
const relDiff = (A: CMat3, B: CMat3) => fnorm(madd(A, mscale(B, cx(-1)))) / fnorm(B);

/** Two sets of directions, matched greedily: the largest distance between partners. */
function setDistance(a: Vec3[], b: number[][]): number {
	const left = b.map((v) => v as Vec3);
	let worst = 0;
	for (const v of a) {
		let k = 0;
		left.forEach((w, i) => {
			if (norm(v.map((x, j) => x - w[j]) as Vec3) < norm(v.map((x, j) => x - left[k][j]) as Vec3))
				k = i;
		});
		worst = Math.max(worst, norm(v.map((x, j) => x - left[k][j]) as Vec3));
		left.splice(k, 1);
	}
	return worst;
}

const bodies = (s: { masses: number[]; positions: number[][]; velocities: number[][] }) =>
	s.masses.map((mass, i) => ({
		mass,
		position: s.positions[i] as Vec3,
		velocity: s.velocities[i] as Vec3
	}));

describe('moving masses', () => {
	fixtures.scenes.forEach((s, n) => {
		it(`scene ${n}: W, invariants, type and stars match the reference`, () => {
			const W = movingMassesW(bodies(s));
			expect(relDiff(W, mat(s.W))).toBeLessThan(1e-10);
			const { I, J } = invariants(W);
			const scaleI = abs(cx(s.I[0], s.I[1])) || 1;
			expect(Math.abs(I.re - s.I[0]) + Math.abs(I.im - s.I[1])).toBeLessThan(1e-9 * scaleI);
			const scaleJ = abs(cx(s.J[0], s.J[1])) || 1;
			expect(Math.abs(J.re - s.J[0]) + Math.abs(J.im - s.J[1])).toBeLessThan(1e-9 * scaleJ);
			expect(petrov(W)).toBe(s.petrov);
			// double stars converge to about the square root of the working precision
			expect(setDistance(stars(W), s.stars)).toBeLessThan(s.petrov === 'D' ? 2e-6 : 1e-9);
			const alarm = motionAlarm(W);
			if (s.alarm < 1e-12) expect(alarm).toBeLessThan(1e-9);
			else expect(alarm).toBeCloseTo(s.alarm, 9);
			const w = eigenvalues(W);
			const ref = s.eigenvalues.map(([re, im]) => cx(re, im));
			for (const z of ref)
				expect(Math.min(...w.map((x) => abs(cx(x.re - z.re, x.im - z.im))))).toBeLessThan(
					1e-9 * Math.max(...ref.map(abs))
				);
		});
		if ('body_velocity' in s && s.body_velocity) {
			it(`scene ${n}: a single body's sideways velocity from its stars`, () => {
				const v = bodyVelocity(movingMassesW(bodies(s)));
				v.forEach((x, i) => expect(x).toBeCloseTo((s.body_velocity as number[])[i], 6));
			});
		}
		if ('rest_frame_velocity' in s && s.rest_frame_velocity) {
			it(`scene ${n}: the velocity of the field's rest frame`, () => {
				const v = restFrameVelocity(movingMassesW(bodies(s)));
				v.forEach((x, i) => expect(x).toBeCloseTo((s.rest_frame_velocity as number[])[i], 8));
			});
		}
	});
});

describe('plane waves', () => {
	for (const w of fixtures.waves) {
		it('a wave is a perfect square on m = nullFrame(k), with a quadruple star', () => {
			const m = nullFrame(w.k as Vec3);
			m.forEach((z, i) => {
				expect(z.re).toBeCloseTo(w.m[i][0], 10);
				expect(z.im).toBeCloseTo(w.m[i][1], 10);
			});
			const W = mat(w.W);
			// W = a m m^T: compare with a taken from the largest component
			let best = 0;
			const mm = planeWaveW(w.k as Vec3, cx(1));
			W.flat().forEach((z, i) => {
				if (abs(z) > abs(W.flat()[best])) best = i;
			});
			const a = (() => {
				const p = mm.flat()[best],
					q = W.flat()[best];
				const d = p.re * p.re + p.im * p.im;
				return cx((q.re * p.re + q.im * p.im) / d, (q.im * p.re - q.re * p.im) / d);
			})();
			expect(relDiff(planeWaveW(w.k as Vec3, a), W)).toBeLessThan(1e-10);
			expect(petrov(W)).toBe('N');
			expect(setDistance(stars(W), w.stars)).toBeLessThan(2e-3);
			for (const s of stars(W))
				expect(norm(s.map((x, i) => x - w.k[i]) as Vec3)).toBeLessThan(2e-3);
		});
	}
});

describe('light', () => {
	for (const q of fixtures.charges) {
		it(`${q.charges.length} charge(s): F and the two stars match the reference`, () => {
			const F = movingChargesF(
				q.charges.map((charge, i) => ({
					charge,
					position: q.positions[i] as Vec3,
					velocity: q.velocities[i] as Vec3
				}))
			);
			F.forEach((z, i) => {
				expect(z.re).toBeCloseTo(q.F[i][0], 10);
				expect(z.im).toBeCloseTo(q.F[i][1], 10);
			});
			expect(setDistance(lightStars(F), q.stars)).toBeLessThan(1e-9);
		});
	}
});

describe('separating waves', () => {
	it('four waves with any waveforms, over time', () => {
		const found = fourWaves(fixtures.four_waves.readings.map(mat));
		expect(setDistance(found, fixtures.four_waves.directions)).toBeLessThan(1e-8);
	});
	it("light's two", () => {
		const found = lightTwoWaves(fixtures.light_two_waves.readings.map(cvec));
		expect(setDistance(found, fixtures.light_two_waves.directions)).toBeLessThan(1e-9);
	});
});
