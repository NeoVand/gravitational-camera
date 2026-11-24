/**
 * The square-of-a-vector figure's arithmetic (square-of-vector.ts): the five tables and light's three vectors, the
 * chapter's bars on and off the axis, rank and invariants, the direction read back, the overlaps, the paper problem,
 * the ring's turning, the keys and snapping, the two predictions, and the words.
 */
import { describe, expect, it } from 'vitest';
import { cx, mul, type CMat3 } from '../../pixel/complex';
import {
	AMPLITUDES,
	HELICITIES,
	OPENING,
	ZENITH,
	angleOf,
	bracket,
	coherentOverlap,
	crossing,
	complexTex,
	frameOf,
	fromSourcesOf,
	gravityBars,
	invariants,
	lengthOf,
	lightBars,
	lightWave,
	magneticOf,
	nextHelicity,
	noteFirst,
	noteSecond,
	nullOf,
	opposite,
	overlaps,
	placeAbout,
	prefactor,
	rankOf,
	scaledInvariants,
	readBack,
	readingOf,
	readingOfWaves,
	relativeOf,
	ringBalls,
	ringTide,
	secondFor,
	singularValues,
	snapped,
	squeezeAxis,
	stepAbout,
	tables,
	tideOf,
	tiltTo,
	vectors,
	waveReading,
	type Place,
	type Vec3
} from './square-of-vector';
import { apart } from './majorana-stars';

const at = (theta: number, phi: number): Place => ({ theta, phi });
const near = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const sizes = (bars: { size: number }[]) => bars.map((b) => b.size);
const maxAbs = (W: CMat3) => Math.max(...W.flat().map((z) => Math.hypot(z.re, z.im)));
const diff = (A: CMat3, B: CMat3) =>
	Math.max(
		...A.flatMap((r, i) => r.map((z, j) => Math.hypot(z.re - B[i][j].re, z.im - B[i][j].im)))
	);

/** Axes and directions to try: the poles, the equator, and places between. */
const PLACES: Place[] = [
	ZENITH,
	at(180, 0),
	at(90, 0),
	at(90, 90),
	at(60, 35),
	at(127, -150),
	at(13, 200 - 360)
];

/** Rodrigues' turn by ψ about the unit vector k, anticlockwise as seen from the side k points to. */
function turn(k: Vec3, psi: number): number[][] {
	const c = Math.cos(psi);
	const s = Math.sin(psi);
	const K = [
		[0, -k[2], k[1]],
		[k[2], 0, -k[0]],
		[-k[1], k[0], 0]
	];
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => (i === j ? c : 0) + s * K[i][j] + (1 - c) * k[i] * k[j])
	);
}

/** R T Rᵀ for a real R. */
const turned = (R: number[][], T: CMat3): CMat3 =>
	[0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => {
			let re = 0;
			let im = 0;
			for (let a = 0; a < 3; a++)
				for (let b = 0; b < 3; b++) {
					re += R[i][a] * T[a][b].re * R[j][b];
					im += R[i][a] * T[a][b].im * R[j][b];
				}
			return cx(re, im);
		})
	) as CMat3;

describe('the axes and the null vector', () => {
	it('has e₁ × e₂ = k̂, m·m = 0 and m·m* = 1 everywhere, the poles included', () => {
		for (const p of PLACES) {
			const { k, e1, e2 } = frameOf(p);
			const cr: Vec3 = [
				e1[1] * e2[2] - e1[2] * e2[1],
				e1[2] * e2[0] - e1[0] * e2[2],
				e1[0] * e2[1] - e1[1] * e2[0]
			];
			expect(near(cr, k)).toBeLessThan(1e-15);
			const m = nullOf(p);
			const mm = m.reduce((s, z) => ({ re: s.re + mul(z, z).re, im: s.im + mul(z, z).im }), cx(0));
			expect(Math.hypot(mm.re, mm.im)).toBeLessThan(1e-15);
			expect(m.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0)).toBeCloseTo(1, 15);
		}
		expect(frameOf(ZENITH)).toEqual({ k: [0, 0, 1], e1: [1, 0, 0], e2: [0, 1, 0] });
	});

	it('follows the chapter’s overlap section: k̂ = (sin ϑ, 0, cos ϑ) has m = (cos ϑ, i, −sin ϑ)/√2', () => {
		const m = nullOf(at(60, 0));
		const c = Math.cos(Math.PI / 3);
		const s = Math.sin(Math.PI / 3);
		expect(m[0].re).toBeCloseTo(c * Math.SQRT1_2, 15);
		expect(m[1].im).toBeCloseTo(Math.SQRT1_2, 15);
		expect(m[2].re).toBeCloseTo(-s * Math.SQRT1_2, 15);
	});
});

describe('the five tables', () => {
	it('are symmetric, without trace, orthogonal, with the squared lengths 1, 2, 6, 2, 1', () => {
		for (const axis of PLACES) {
			const T = tables(axis);
			T.forEach((A, m) => {
				for (let i = 0; i < 3; i++)
					for (let j = 0; j < 3; j++) {
						expect(A[i][j].re).toBeCloseTo(A[j][i].re, 15);
						expect(A[i][j].im).toBeCloseTo(A[j][i].im, 15);
					}
				const tr = A[0][0].re + A[1][1].re + A[2][2].re;
				expect(Math.abs(tr)).toBeLessThan(1e-14);
				T.forEach((B, n) => {
					const b = bracket(A, B);
					if (m === n) {
						expect(b.re).toBeCloseTo([1, 2, 6, 2, 1][m], 13);
						expect(Math.abs(b.im)).toBeLessThan(1e-14);
					} else expect(Math.hypot(b.re, b.im)).toBeLessThan(1e-14);
				});
			});
		}
		// T₀ = diag(−1, −1, 2) about ẑ
		const T0 = tables(ZENITH)[2];
		expect([T0[0][0].re, T0[1][1].re, T0[2][2].re]).toEqual([-1, -1, 2]);
	});

	it('are multiplied by e^{−imψ} when the field is turned by ψ about the axis', () => {
		for (const axis of PLACES) {
			const T = tables(axis);
			const psi = 0.7;
			const R = turn(frameOf(axis).k, psi);
			T.forEach((A, i) => {
				const m = i - 2;
				const want = A.map((r) =>
					r.map((z) => mul(z, cx(Math.cos(m * psi), -Math.sin(m * psi))))
				) as CMat3;
				expect(diff(turned(R, A), want)).toBeLessThan(1e-14);
			});
		}
	});

	it('give light three orthonormal vectors of weights −1, 0, 1', () => {
		for (const axis of PLACES) {
			const V = vectors(axis);
			V.forEach((a, i) =>
				V.forEach((b, j) => {
					let re = 0;
					let im = 0;
					for (let k = 0; k < 3; k++) {
						re += a[k].re * b[k].re + a[k].im * b[k].im;
						im += a[k].re * b[k].im - a[k].im * b[k].re;
					}
					expect(re).toBeCloseTo(i === j ? 1 : 0, 14);
					expect(Math.abs(im)).toBeLessThan(1e-14);
				})
			);
		}
	});

	it('read a mass on the axis as weight 0 alone, and a mass across it as 2, 0 and −2', () => {
		// 𝒲 = −(GM/r³)T₀; across the axis 1 − 3e₁e₁ᵀ = ½T₀ − (3/2)(T₂ + T₋₂)
		const onAxis = readingOf(
			[
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, -2]
			],
			[
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			]
		);
		expect(sizes(gravityBars(onAxis, ZENITH)).map((x) => +x.toFixed(12))).toEqual([0, 0, 1, 0, 0]);
		expect(rankOf(onAxis)).toBe(3);
		const across = readingOf(
			[
				[-2, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			],
			[
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			]
		);
		const c = gravityBars(across, ZENITH).map((b) => b.c.re);
		expect(c[0]).toBeCloseTo(-1.5, 14);
		expect(c[2]).toBeCloseTo(0.5, 14);
		expect(c[4]).toBeCloseTo(-1.5, 14);
		expect(Math.abs(c[1]) + Math.abs(c[3])).toBeLessThan(1e-14);
	});
});

describe('a wave’s bars', () => {
	it('fill one bar along the axis, m = 2 for gravity and m = 1 for light; m = −2 and −1 opposite', () => {
		for (const axis of PLACES) {
			const along = { ...axis };
			expect(sizes(gravityBars(waveReading(along), axis)).map((x) => +x.toFixed(12))).toEqual([
				0, 0, 0, 0, 1
			]);
			expect(sizes(lightBars(lightWave(along), axis)).map((x) => +x.toFixed(12))).toEqual([
				0, 0, 1
			]);
			const back = opposite(axis);
			expect(sizes(gravityBars(waveReading(back), axis)).map((x) => +x.toFixed(12))).toEqual([
				1, 0, 0, 0, 0
			]);
			expect(sizes(lightBars(lightWave(back), axis)).map((x) => +x.toFixed(12))).toEqual([1, 0, 0]);
		}
	});

	it('fill all five at 60°: 0.0625, 0.2165, 0.4593, 0.6495, 0.5625, and light’s 0.25, 0.612, 0.75', () => {
		const want = [
			Math.sin(Math.PI / 6) ** 4,
			(0.5 * Math.sin(Math.PI / 3)) / 2,
			Math.sqrt(3 / 8) * 0.75,
			(1.5 * Math.sin(Math.PI / 3)) / 2,
			Math.cos(Math.PI / 6) ** 4
		];
		expect(want.map((x) => +x.toFixed(4))).toEqual([0.0625, 0.2165, 0.4593, 0.6495, 0.5625]);
		for (const axis of PLACES)
			for (const t of [0, 77, -140]) {
				const wave = placeAbout(axis, 60, t);
				expect(angleOf(wave, axis)).toBeCloseTo(60, 5);
				const g = sizes(gravityBars(waveReading(wave), axis));
				// places are kept to a millionth of a degree
				g.forEach((x, i) => expect(x).toBeCloseTo(want[i], 7));
				const l = sizes(lightBars(lightWave(wave), axis));
				expect(l.map((x) => +x.toFixed(3))).toEqual([0.25, 0.612, 0.75]);
			}
	});

	it('have squares that add to one, for one wave or two, any amplitude', () => {
		const pairs: Place[][] = [[at(40, 35)], [at(40, 35), at(20, -145)], [at(170, 10), at(90, 90)]];
		for (const axis of PLACES)
			for (const waves of pairs) {
				const { W, F } = readingOfWaves(waves);
				const sum = (b: { size: number }[]) => b.reduce((s, x) => s + x.size * x.size, 0);
				expect(sum(gravityBars(W, axis))).toBeCloseTo(1, 13);
				expect(sum(lightBars(F, axis))).toBeCloseTo(1, 13);
				expect(sum(gravityBars(waveReading(waves[0], cx(-2.5, 0.3)), axis))).toBeCloseTo(1, 13);
			}
	});

	it('give the share of the weight 2 as cos⁴(ϑ/2), and nothing for a missing reading', () => {
		for (const t of [10, 45, 60, 120]) {
			const g = gravityBars(waveReading(at(t, 0)), ZENITH);
			expect(g[4].size).toBeCloseTo(Math.cos((t * Math.PI) / 360) ** 4, 13);
		}
		const zero = waveReading(ZENITH, cx(0));
		expect(gravityBars(zero, ZENITH).every((b) => b.size === 0 && b.phase === undefined)).toBe(
			true
		);
	});
});

describe('the square', () => {
	it('has rank one and tr 𝒲² = tr 𝒲³ = 0 for any single wave', () => {
		for (const p of PLACES) {
			const W = waveReading(p, cx(0.8, -1.3));
			expect(rankOf(W)).toBe(1);
			const s = singularValues(W);
			expect(s[0]).toBeCloseTo(lengthOf(W), 13);
			expect(s[1]).toBeLessThan(1e-14);
			const { I, J } = invariants(W);
			expect(Math.hypot(I.re, I.im)).toBeLessThan(1e-14);
			expect(Math.hypot(J.re, J.im)).toBeLessThan(1e-14);
		}
	});

	it('is 2(𝓔₊ − i𝓔×) m mᵀ, built from 𝓔 and 7.6’s 𝓑, and −P/|𝓔|² = −k̂ for every polarization', () => {
		const pols = [
			[1, 0],
			[0, 1],
			[0.6, -0.8],
			[-2, 0.3]
		];
		for (const p of PLACES)
			for (const [ep, ex] of pols) {
				const f = frameOf(p);
				const E = tideOf(f, ep, ex);
				const W = readingOf(E, magneticOf(f.k, E));
				expect(diff(W, waveReading(p, cx(2 * ep, -2 * ex)))).toBeLessThan(1e-14);
				const r = readBack(W);
				expect(r).toBeDefined();
				expect(near(r!.n, f.k.map((x) => -x) as Vec3)).toBeLessThan(1e-13);
				expect(r!.length).toBeCloseTo(1, 13);
			}
	});

	it('works the chapter’s practice problem: along x̂ with 𝓔× = 1, 𝒲 = −2i m mᵀ and n̂ = −x̂', () => {
		const f = { k: [1, 0, 0] as Vec3, e1: [0, 1, 0] as Vec3, e2: [0, 0, 1] as Vec3 };
		const E = tideOf(f, 0, 1);
		const B = magneticOf(f.k, E);
		expect(B).toEqual([
			[0, 0, 0],
			[0, -1, 0],
			[0, 0, 1]
		]);
		const W = readingOf(E, B);
		expect([W[1][1], W[1][2], W[2][2]]).toEqual([cx(0, -1), cx(1, 0), cx(0, 1)]);
		expect(near(readBack(W)!.n, [-1, 0, 0])).toBeLessThan(1e-15);
	});

	it('reads its direction at every instant of the ring, for each helicity', () => {
		const p = at(40, 35);
		for (const h of HELICITIES)
			for (const theta of [0, 0.4, 1.1, 2.5]) {
				const W = waveReading(p, prefactor(h, theta));
				const r = readBack(W);
				if (h === 'linear' && Math.abs(Math.cos(theta)) < 1e-9) continue;
				expect(near(r!.n, frameOf(p).k.map((x) => -x) as Vec3)).toBeLessThan(1e-12);
			}
		// at t = 0 all three settings give the same reading m mᵀ
		for (const h of HELICITIES) {
			const z = prefactor(h, 0);
			expect(z.re).toBeCloseTo(1, 15);
			expect(z.im).toBe(0);
		}
	});
});

describe('two waves', () => {
	it('overlap 0.316 for gravity and 0.5625 for light at 60°, as cos⁸ and cos⁴ of half the angle', () => {
		const a = OPENING.wave;
		const b = secondFor(a);
		expect(angleOf(a, b)).toBeCloseTo(60, 6);
		const o = overlaps(a, b);
		expect(o.gravity).toBeCloseTo(0.31640625, 9);
		expect(+o.gravity.toFixed(3)).toBe(0.316);
		expect(o.light).toBeCloseTo(0.5625, 9);
		for (const [p, q] of [
			[at(0, 0), at(90, 0)],
			[at(30, 10), at(150, -100)],
			[at(70, 20), at(75, 25)]
		]) {
			const ang = apart(p, q);
			const oo = overlaps(p, q);
			expect(oo.gravity).toBeCloseTo(coherentOverlap(ang, 2), 12);
			expect(oo.light).toBeCloseTo(coherentOverlap(ang, 1), 12);
		}
		expect(coherentOverlap(60, 2)).toBeCloseTo(0.3164, 4);
		expect(coherentOverlap(0, 2)).toBe(1);
		expect(coherentOverlap(180, 1)).toBeLessThan(1e-30);
	});

	it('have rank two and invariants that do not vanish', () => {
		const { W } = readingOfWaves([OPENING.wave, secondFor(OPENING.wave)]);
		expect(rankOf(W)).toBe(2);
		const { I } = invariants(W);
		expect(Math.hypot(I.re, I.im)).toBeGreaterThan(0.1);
		const scaled = scaledInvariants(W);
		expect(scaled.I.re).toBeCloseTo(I.re / lengthOf(W) ** 2, 14);
		expect(scaledInvariants(waveReading(ZENITH, cx(0))).I).toEqual(cx(0));
		// two along the same line add to one square, of rank one
		expect(rankOf(readingOfWaves([at(40, 35), at(40, 35)]).W)).toBe(1);
	});

	it('give the paper problem’s −P/|𝓔|² = −(0.5, 0, 0.5), between the two sources and not of length one', () => {
		// the chapter's axes: along ẑ with x̂, ŷ, and along x̂ with ŷ, ẑ, both plus polarization of strength one
		const f1 = { k: [0, 0, 1] as Vec3, e1: [1, 0, 0] as Vec3, e2: [0, 1, 0] as Vec3 };
		const f2 = { k: [1, 0, 0] as Vec3, e1: [0, 1, 0] as Vec3, e2: [0, 0, 1] as Vec3 };
		const E1 = tideOf(f1, 1, 0);
		const E2 = tideOf(f2, 1, 0);
		const E = E1.map((r, i) => r.map((x, j) => x + E2[i][j]));
		const B1 = magneticOf(f1.k, E1);
		const B2 = magneticOf(f2.k, E2);
		const B = B1.map((r, i) => r.map((x, j) => x + B2[i][j]));
		expect(E).toEqual([
			[1, 0, 0],
			[0, 0, 0],
			[0, 0, -1]
		]);
		expect(B).toEqual([
			[0, 1, 0],
			[1, 0, 1],
			[0, 1, 0]
		]);
		const r = readBack(readingOf(E, B))!;
		expect(near(r.n, [-0.5, 0, -0.5])).toBeLessThan(1e-15);
		expect(r.length).toBeCloseTo(Math.SQRT1_2, 15);
		// the figure's own axes for the same two directions give the same answer, 45° from each source
		const fig = readBack(readingOfWaves([ZENITH, at(90, 0)]).W)!;
		expect(near(fig.n, [-0.5, 0, -0.5])).toBeLessThan(1e-14);
		const [a1, a2] = fromSourcesOf(fig.n, [ZENITH, at(90, 0)]);
		expect(a1).toBeCloseTo(45, 12);
		expect(a2).toBeCloseTo(45, 12);
	});
});

describe('the ring', () => {
	it('is the tide across k̂ of Re(z m mᵀ), in the axes e₁, e₂', () => {
		const p = at(40, 35);
		const { e1, e2 } = frameOf(p);
		for (const h of HELICITIES)
			for (const theta of [0, 0.9, 2.2]) {
				const W = waveReading(p, prefactor(h, theta));
				const E = W.map((r) => r.map((z) => z.re));
				const proj = (a: Vec3, b: Vec3) =>
					[0, 1, 2].reduce(
						(s, i) => s + [0, 1, 2].reduce((t, j) => t + a[i] * E[i][j] * b[j], 0),
						0
					);
				const R = ringTide(h, theta);
				expect(R[0][0]).toBeCloseTo(proj(e1, e1), 14);
				expect(R[0][1]).toBeCloseTo(proj(e1, e2), 14);
				expect(R[1][1]).toBeCloseTo(proj(e2, e2), 14);
			}
	});

	it('squeezes along e₁ at t = 0, since a positive entry of the tide squeezes', () => {
		const E = ringTide('plus', 0);
		expect(E[0][0]).toBe(0.5);
		const balls = ringBalls(E);
		expect(balls[0].kind).toBe('squeeze');
		expect(balls[0].ax).toBeCloseTo(-0.5, 15);
		expect(balls[3].kind).toBe('stretch');
		expect(balls[3].ay).toBeCloseTo(0.5, 15);
		// a quarter period later the squeeze is along the diagonal at 45°
		expect(squeezeAxis(ringTide('plus', Math.PI / 2))).toBeCloseTo(Math.PI / 4, 14);
	});

	it('turns anticlockwise, seen from the camera’s side, for the helicity +2, clockwise for −2, not at all for linear', () => {
		for (const theta of [0.2, 0.8, 1.4]) {
			expect(squeezeAxis(ringTide('plus', theta))).toBeCloseTo(theta / 2, 14);
			expect(squeezeAxis(ringTide('minus', theta))).toBeCloseTo(-theta / 2, 14);
			expect(squeezeAxis(ringTide('linear', theta))).toBeCloseTo(0, 14);
		}
		expect(squeezeAxis(ringTide('linear', Math.PI / 2))).toBeUndefined();
		// half a turn of the pattern in one period, and the same pattern after it
		const a = ringTide('plus', 0);
		const b = ringTide('plus', 2 * Math.PI);
		expect(b[0][0]).toBeCloseTo(a[0][0], 14);
		expect(b[0][1]).toBeCloseTo(a[0][1], 14);
		expect(AMPLITUDES.linear.plus + AMPLITUDES.linear.minus).toBe(1);
		expect(nextHelicity('plus')).toBe('minus');
		expect(nextHelicity('linear')).toBe('plus');
	});
});

describe('the keys, the tilt and snapping', () => {
	it('moves a dot about the axis by a degree, toward it with Up, onto it with Home', () => {
		const axis = at(30, 60);
		const wave = placeAbout(axis, 20, 45);
		const up = stepAbout(wave, axis, 'ArrowUp', false)!;
		expect(relativeOf(up, axis).tilt).toBeCloseTo(19, 6);
		const right = stepAbout(wave, axis, 'ArrowRight', true)!;
		expect(relativeOf(right, axis).tilt).toBeCloseTo(20, 6);
		expect(relativeOf(right, axis).turn).toBeCloseTo(55, 4);
		expect(stepAbout(wave, axis, 'Home', false)).toEqual(axis);
		// onto ẑ the azimuth is kept, and Down leaves it the way it came
		const home = stepAbout(at(40, 35), ZENITH, 'Home', false)!;
		expect(home).toEqual(at(0, 35));
		expect(stepAbout(home, ZENITH, 'ArrowDown', false)).toEqual(at(1, 35));
		expect(angleOf(stepAbout(wave, axis, 'End', false)!, axis)).toBe(180);
		expect(stepAbout(wave, axis, 'a', false)).toBeUndefined();
		// the axis itself moves about ẑ
		const a2 = stepAbout(ZENITH, ZENITH, 'ArrowDown', false)!;
		expect(a2).toEqual(at(1, 0));
	});

	it('tilts a wave to an angle keeping its turn, and snaps a drag onto the axis and whole 30°', () => {
		const axis = ZENITH;
		const w = tiltTo(at(40, 35), axis, 60);
		expect(w).toEqual(at(60, 35));
		expect(snapped(at(2, 80), axis)).toEqual(ZENITH);
		expect(snapped(at(178.5, 80), axis)).toEqual(opposite(ZENITH));
		expect(snapped(at(60.8, 80), axis)).toEqual(at(60, 80));
		expect(snapped(at(47, 80), axis)).toEqual(at(47, 80));
	});
});

describe('carrying a dot over the rim', () => {
	it('stays on its side inside the disc and changes sides after leaving it and coming back', () => {
		expect(crossing(1, false, 0.5)).toEqual({ side: 1, out: false });
		expect(crossing(1, false, 1.02)).toEqual({ side: 1, out: true });
		expect(crossing(1, true, 0.98)).toEqual({ side: -1, out: false });
		expect(crossing(-1, true, 0.98)).toEqual({ side: 1, out: false });
	});
});

describe('the predictions', () => {
	const scene = (wave: Place, mode: 'one' | 'two' = 'one') => ({ mode, wave, axis: OPENING.axis });

	it('opens answering neither', () => {
		expect(noteFirst(false, scene(OPENING.wave))).toBe(false);
		expect(noteSecond(false, scene(OPENING.wave))).toBe(false);
	});

	it('answers the first once the wave points along the axis, as Home does', () => {
		const home = stepAbout(OPENING.wave, OPENING.axis, 'Home', false)!;
		expect(noteFirst(false, scene(home))).toBe(true);
		expect(noteFirst(false, scene(home, 'two'))).toBe(false);
		expect(noteFirst(true, scene(OPENING.wave))).toBe(true);
	});

	it('answers the second once the wave is tilted by 60°, by the keys or the slider', () => {
		let w: Place = OPENING.wave;
		for (let i = 0; i < 20; i++) w = stepAbout(w, OPENING.axis, 'ArrowDown', false)!;
		expect(angleOf(w, OPENING.axis)).toBe(60);
		expect(noteSecond(false, scene(w))).toBe(true);
		expect(noteSecond(false, scene(tiltTo(OPENING.wave, OPENING.axis, 61)))).toBe(true);
		expect(noteSecond(false, scene(tiltTo(OPENING.wave, OPENING.axis, 63)))).toBe(false);
		expect(noteSecond(false, scene(w, 'two'))).toBe(false);
	});
});

describe('the words', () => {
	it('writes complex numbers to two decimals, with no −0', () => {
		expect(complexTex(cx(0, 0))).toBe('0');
		expect(complexTex(cx(-1e-9, 1e-9))).toBe('0');
		expect(complexTex(cx(0.25, 0))).toBe('0.25');
		expect(complexTex(cx(0, -0.5))).toBe('-0.50i');
		expect(complexTex(cx(0.5, 0.433))).toBe('0.50 + 0.43i');
		expect(complexTex(cx(-0.5, -0.433))).toBe('-0.50 - 0.43i');
	});

	it('gives a sum of two squares its length', () => {
		const { W } = readingOfWaves([ZENITH, at(90, 0)]);
		// |𝒲|² = 2 + 2 Re (m₁*·m₂)², and m₁*·m₂ = ½ for ẑ and x̂
		expect(maxAbs(W)).toBeGreaterThan(0);
		expect(lengthOf(W) ** 2).toBeCloseTo(2.5, 14);
	});
});
