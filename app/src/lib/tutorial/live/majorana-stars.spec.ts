/**
 * The Majorana-stars figure's arithmetic (majorana-stars.ts): the presets' stars found by the engine and their
 * arrows, the chapter's check values read through the figure, the overlap readout, the gauge of the bars, places and
 * the keys, snapping, the view and its inverse, the three predictions, and the words.
 */
import { describe, expect, it } from 'vitest';
import {
	AWAY,
	EL_LIMIT,
	KINDS,
	OPENING,
	SNAP,
	TOGETHER,
	apart,
	basis,
	degrees,
	directionAt,
	fixed,
	gauged,
	loneLength,
	greatCircle,
	groupsOf,
	mWords,
	noteFirst,
	noteSecond,
	noteThird,
	oneAway,
	placeOf,
	placeStep,
	placeWords,
	presetStars,
	readingOf,
	screenOf,
	snapped,
	starsWords,
	stateOf,
	turned,
	twoOppositePairs,
	vecOf,
	viewStep,
	wrapPhi,
	type Place,
	type Vec3
} from './majorana-stars';

const N: Place = { theta: 0, phi: 0 };
const S: Place = { theta: 180, phi: 0 };
const at = (theta: number, phi: number): Place => ({ theta, phi });
const len = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);
const near = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('the presets', () => {
	it('opens on a body with a wave, the reading’s four stars', () => {
		expect(OPENING.kind).toBe('body-wave');
		expect(OPENING.light).toBe(false);
		const stars = presetStars(OPENING.kind, false);
		expect(stars).toHaveLength(4);
		// the opening answers none of the predictions
		const scene = { light: false, stars };
		expect(noteFirst(false, scene)).toBe(false);
		expect(noteSecond(false, scene)).toBe(false);
		expect(noteThird(false, scene)).toBe(false);
	});

	it('finds each preset’s stars from its reading, with its arrow', () => {
		const wave = presetStars('wave', false);
		expect(wave).toEqual([N, N, N, N]);
		expect(readingOf(wave, OPENING.probe).length).toBeCloseTo(1, 13);

		const body = presetStars('body', false);
		expect(body).toEqual([N, N, S, S]);
		expect(readingOf(body, OPENING.probe).length).toBe(0);

		const both = presetStars('body-wave', false);
		expect(both).toEqual([N, N, at(120, 0), at(120, 180)]);
		const r = readingOf(both, OPENING.probe);
		expect(r.length).toBeCloseTo(0.4, 12);
		expect(near(r.b, [0, 0, 0.4])).toBeLessThan(1e-12);
		expect(near(vecOf(both[2]), [Math.sqrt(3) / 2, 0, -0.5])).toBeLessThan(1e-12);

		const two = presetStars('two-bodies', false);
		expect(two).toHaveLength(4);
		expect(twoOppositePairs(two)).toBe(false);
		expect(groupsOf(two)).toHaveLength(4);
		// two opposite pairs: each star has its opposite among the others
		for (const s of two) expect(two.some((o) => apart(s, o) > 180 - 1e-6)).toBe(true);
		// in the x, z plane
		for (const s of two) expect(Math.abs(vecOf(s)[1])).toBeLessThan(1e-12);
		expect(readingOf(two, OPENING.probe).length).toBe(0);
	});

	it('gives light two stars: together for a wave, opposite for charges', () => {
		expect(presetStars('wave', true)).toEqual([N, N]);
		expect(presetStars('body', true)).toEqual([N, S]);
		const both = readingOf(presetStars('body-wave', true), OPENING.probe);
		// b = (−2/3, 0, 2/3): the Poynting vector of E = x̂ + ẑ, cB = ŷ, over c and the energy density
		expect(near(both.b, [-2 / 3, 0, 2 / 3])).toBeLessThan(1e-12);
		const two = presetStars('two-bodies', true);
		expect(apart(two[0], two[1])).toBeCloseTo(180, 9);
		expect(readingOf(two, OPENING.probe).length).toBe(0);
		for (const k of KINDS) expect(presetStars(k, true)).toHaveLength(2);
	});
});

describe('the chapter’s check values, through the figure', () => {
	it('all four together: |b| = 1; two at each pole: 0', () => {
		for (const p of [N, at(35, 80), at(120, -150), S]) {
			const r = readingOf([p, p, p, p], OPENING.probe);
			expect(r.length).toBeCloseTo(1, 13);
			expect(near(r.b, vecOf(p))).toBeLessThan(1e-12);
		}
		expect(readingOf([N, N, S, S], OPENING.probe).length).toBe(0);
	});

	it('E₊ = 3w and two pairs 120° apart', () => {
		expect(readingOf([N, N, at(90, 0), at(90, 180)], OPENING.probe).length).toBeCloseTo(6 / 7, 12);
		const r = readingOf([at(60, 0), at(60, 0), at(60, 180), at(60, 180)], OPENING.probe);
		expect(fixed(r.length)).toBe('0.91');
		expect(near(r.b.map((x) => x / r.length) as Vec3, [0, 0, 1])).toBeLessThan(1e-12);
	});

	it('moving one star from the other three shortens the arrow, slowly: 0.98 at 90°, 0.5 opposite', () => {
		for (const d of [1, 10, 30, 45, 60, 72, 90, 120, 150, 180]) {
			const r = readingOf([N, N, N, at(d, 40)], OPENING.probe);
			expect(r.length).toBeLessThan(1);
			expect(r.length).toBeCloseTo(loneLength(d), 12);
		}
		// about 3α⁴/1024 for a small α
		const a = 0.05;
		expect((1 - loneLength((a * 180) / Math.PI) ** 2) / ((3 * a ** 4) / 1024)).toBeCloseTo(1, 2);
		expect(fixed(loneLength(AWAY))).toBe('0.98');
		expect(fixed(loneLength(60))).toBe('1.00');
		expect(loneLength(180)).toBeCloseTo(0.5, 14);
		// the arrow turns toward the lone star as it goes
		const b = readingOf([N, N, N, at(90, 0)], OPENING.probe).b;
		expect(b[0]).toBeCloseTo(0.4, 12);
		expect(b[2]).toBeCloseTo(0.9, 12);
	});

	it('reads the overlap with the coherent state at n̂: cos⁸(ϑ/2), 0.32 at 60°', () => {
		const r = readingOf([N, N, N, N], at(60, 90));
		expect(r.overlap).toBeCloseTo(Math.cos(Math.PI / 6) ** 8, 13);
		expect(fixed(r.overlap)).toBe('0.32');
		expect(readingOf([N, N, N, N], N).overlap).toBeCloseTo(1, 13);
		expect(readingOf([N, N, N, N], S).overlap).toBeCloseTo(0, 13);
		// light: cos⁴(ϑ/2)
		expect(readingOf([N, N], at(60, 0)).overlap).toBeCloseTo(Math.cos(Math.PI / 6) ** 4, 13);
	});
});

describe('the bars', () => {
	it('are |c_m|, with the largest real and positive', () => {
		const r = readingOf(presetStars('body-wave', false), OPENING.probe);
		expect(r.bars.map((b) => b.m)).toEqual([-2, -1, 0, 1, 2]);
		expect(r.bars[2].size).toBeCloseTo(Math.sqrt(6 / 10), 12);
		expect(r.bars[4].size).toBeCloseTo(Math.sqrt(4 / 10), 12);
		expect(r.bars[2].phase).toBe(0);
		expect(Math.abs(r.bars[4].phase!)).toBeCloseTo(Math.PI, 12);
		expect(r.bars[0].phase).toBeUndefined();
		expect(r.bars.reduce((s, b) => s + b.size ** 2, 0)).toBeCloseTo(1, 13);
	});

	it('change only by an overall phase under the gauge', () => {
		const c = stateOf([at(20, 30), at(100, -60), at(150, 10), at(70, 170)]);
		const g = gauged(c);
		const ratio = (k: number) => {
			const d = c[k].re ** 2 + c[k].im ** 2;
			return {
				re: (g[k].re * c[k].re + g[k].im * c[k].im) / d,
				im: (g[k].im * c[k].re - g[k].re * c[k].im) / d
			};
		};
		const first = ratio(0);
		expect(Math.hypot(first.re, first.im)).toBeCloseTo(1, 13);
		for (let k = 1; k < 5; k++) {
			expect(ratio(k).re).toBeCloseTo(first.re, 12);
			expect(ratio(k).im).toBeCloseTo(first.im, 12);
		}
	});

	it('give light three, m = −1 to 1', () => {
		expect(readingOf([N, S], N).bars.map((b) => b.m)).toEqual([-1, 0, 1]);
	});
});

describe('places and keys', () => {
	it('turns places into directions and back, exact at the poles', () => {
		expect(vecOf(N)).toEqual([0, 0, 1]);
		expect(vecOf(S)).toEqual([0, 0, -1]);
		expect(placeOf([0, 0, 1], 30)).toEqual({ theta: 0, phi: 30 });
		expect(placeOf([0, 0, -1])).toEqual({ theta: 180, phi: 0 });
		for (const p of [at(120, 0), at(120, 180), at(45, -90), at(10, 175)])
			expect(placeOf(vecOf(p))).toEqual(p);
		expect(wrapPhi(-180)).toBe(180);
		expect(wrapPhi(190)).toBe(-170);
		expect(wrapPhi(-365)).toBe(-5);
	});

	it('steps a star on its grid, Up toward ẑ and Right about it, with Shift by 15°', () => {
		expect(placeStep(at(120, 0), 'ArrowUp', false)).toEqual(at(115, 0));
		expect(placeStep(at(121.3, 0), 'ArrowUp', false)).toEqual(at(120, 0));
		expect(placeStep(at(121.3, 0), 'ArrowDown', true)).toEqual(at(135, 0));
		expect(placeStep(at(3, 0), 'ArrowUp', false)).toEqual(at(0, 0));
		expect(placeStep(at(0, 0), 'ArrowUp', false)).toEqual(at(0, 0));
		expect(placeStep(at(178, 0), 'ArrowDown', false)).toEqual(at(180, 0));
		expect(placeStep(at(60, 175), 'ArrowRight', false)).toEqual(at(60, 180));
		expect(placeStep(at(60, 180), 'ArrowRight', false)).toEqual(at(60, -175));
		expect(placeStep(at(60, 0), 'ArrowLeft', true)).toEqual(at(60, -15));
		expect(placeStep(at(60, 10), 'Home', false)).toEqual(at(0, 10));
		expect(placeStep(at(60, 10), 'End', false)).toEqual(at(180, 10));
		expect(placeStep(at(60, 10), 'a', false)).toBeUndefined();
	});

	it('brings three stars of the opening together with the keys alone', () => {
		// from (120°, 180°) to (120°, 0°): twelve steps of 15° about ẑ
		let p = at(120, 180);
		for (let i = 0; i < 12; i++) p = placeStep(p, 'ArrowRight', true)!;
		expect(p).toEqual(at(120, 0));
		// and up to the pole
		for (let i = 0; i < 8; i++) p = placeStep(p, 'ArrowUp', true)!;
		expect(p.theta).toBe(0);
	});

	it('snaps a dragged star onto another or a pole within SNAP', () => {
		const others = [at(60, 30), at(120, -100)];
		expect(snapped(at(61, 32), others)).toEqual(at(60, 30));
		expect(snapped(at(60 + SNAP + 1, 30), others)).toEqual(at(60 + SNAP + 1, 30));
		expect(snapped(at(2, 50), others)).toEqual(at(0, 50));
		expect(snapped(at(177, 50), others)).toEqual(at(180, 50));
		expect(snapped(at(40, 10), others)).toEqual(at(40, 10));
		// a star at a pole whatever its azimuth
		expect(snapped(at(1, 0), [at(0, 90)])).toEqual(at(0, 90));
	});

	it('groups stars that sit together', () => {
		expect(groupsOf([N, at(0, 90), S, at(60, 0)])).toEqual([[0, 1], [2], [3]]);
		expect(groupsOf([at(60, 0), at(60, TOGETHER * 2)])).toEqual([[0], [1]]);
	});
});

describe('the view', () => {
	const views = [OPENING.view, { az: 0, el: 0 }, { az: 135, el: -40 }, { az: -170, el: EL_LIMIT }];

	it('has an orthonormal screen basis, ẑ up at zero elevation', () => {
		for (const v of views) {
			const { right, up, toward } = basis(v);
			expect(len(right)).toBeCloseTo(1, 14);
			expect(len(up)).toBeCloseTo(1, 14);
			expect(len(toward)).toBeCloseTo(1, 14);
			expect(right[0] * up[0] + right[1] * up[1] + right[2] * up[2]).toBeCloseTo(0, 14);
			expect(right[0] * toward[0] + right[1] * toward[1] + right[2] * toward[2]).toBeCloseTo(0, 14);
		}
		const flat = screenOf({ az: 0, el: 0 }, [0, 0, 1], 100);
		expect(flat.x).toBeCloseTo(0, 12);
		expect(flat.y).toBeCloseTo(-100, 12);
	});

	it('finds the direction under a point of the screen again', () => {
		for (const v of views)
			for (const p of [at(30, 40), at(100, -120), at(170, 10), at(80, 170)]) {
				const n = vecOf(p);
				const s = screenOf(v, n, 1);
				const back = directionAt(v, s.x, s.y, s.z >= 0);
				expect(near(back, n)).toBeLessThan(1e-12);
			}
		// outside the disc, the rim
		const rim = directionAt(OPENING.view, 3, 0);
		expect(len(rim)).toBeCloseTo(1, 14);
		expect(screenOf(OPENING.view, rim, 1).z).toBeCloseTo(0, 14);
	});

	it('draws great circles in two halves', () => {
		const c = greatCircle(OPENING.view, [0, 0, 1], 100);
		expect(c.front.startsWith('M')).toBe(true);
		expect(c.back.length).toBeGreaterThan(0);
	});

	it('turns with a drag and with the keys, the elevation held', () => {
		expect(turned({ az: 0, el: 0 }, 0, 1e4, 100).el).toBe(EL_LIMIT);
		expect(turned({ az: 0, el: 0 }, -10, 0, 100).az).toBeGreaterThan(0);
		expect(viewStep({ az: 0, el: 0 }, 'ArrowLeft', false)).toEqual({ az: 5, el: 0 });
		expect(viewStep({ az: 0, el: 78 }, 'ArrowUp', true)).toEqual({ az: 0, el: EL_LIMIT });
		expect(viewStep({ az: 0, el: 0 }, 'x', false)).toBeUndefined();
	});
});

describe('the predictions', () => {
	const g = (stars: Place[]) => ({ light: false, stars });

	it('the first, once all four stars sit together', () => {
		expect(noteFirst(false, g([at(40, 10), at(40, 10), at(40, 10), at(40, 10)]))).toBe(true);
		expect(noteFirst(false, g([N, at(0, 90), N, N]))).toBe(true);
		expect(noteFirst(false, g([N, N, N, at(5, 0)]))).toBe(false);
		expect(noteFirst(false, { light: true, stars: [N, N] })).toBe(false);
		expect(noteFirst(true, g([N, N, S, S]))).toBe(true);
	});

	it('the second, once two stars sit at each pole, or at any opposite points', () => {
		expect(noteSecond(false, g([N, S, N, S]))).toBe(true);
		expect(noteSecond(false, g([at(60, 30), at(60, 30), at(120, -150), at(120, -150)]))).toBe(true);
		expect(noteSecond(false, g([N, N, S, at(170, 0)]))).toBe(false);
		expect(noteSecond(false, g([N, N, at(170, 0), at(170, 0)]))).toBe(false);
		expect(noteSecond(false, { light: true, stars: [N, S] })).toBe(false);
	});

	it('the third, once one star is moved away from the other three', () => {
		expect(oneAway([N, N, N, at(AWAY, 0)])).toBe(true);
		expect(oneAway([at(AWAY + 20, 0), N, N, N])).toBe(true);
		expect(oneAway([N, N, N, at(AWAY - 1, 0)])).toBe(false);
		expect(oneAway([N, N, N, at(45, 0)])).toBe(false);
		expect(oneAway([N, N, at(30, 0), at(60, 0)])).toBe(false);
		expect(noteThird(false, g([at(80, 20), at(80, 20), S, at(80, 20)]))).toBe(true);
		expect(noteThird(false, g([at(80, 20), at(80, 20), at(120, 20), at(80, 20)]))).toBe(false);
		expect(noteThird(false, { light: true, stars: [N, S] })).toBe(false);
		expect(noteThird(true, g([N, N, S, S]))).toBe(true);
	});

	it('are each answered by the presets that do what they ask, and only those', () => {
		const wave = g(presetStars('wave', false));
		const body = g(presetStars('body', false));
		expect([noteFirst(false, wave), noteSecond(false, wave), noteThird(false, wave)]).toEqual([
			true,
			false,
			false
		]);
		expect([noteFirst(false, body), noteSecond(false, body), noteThird(false, body)]).toEqual([
			false,
			true,
			false
		]);
		const two = g(presetStars('two-bodies', false));
		expect([noteFirst(false, two), noteSecond(false, two), noteThird(false, two)]).toEqual([
			false,
			false,
			false
		]);
	});
});

describe('the words', () => {
	it('writes numbers, angles, places and m', () => {
		expect(fixed(0.4)).toBe('0.40');
		expect(fixed(-0.001)).toBe('0.00');
		expect(fixed(-0.25)).toBe('−0.25');
		expect(degrees(120)).toBe('120°');
		expect(degrees(50.76848)).toBe('50.8°');
		expect(degrees(-90)).toBe('−90°');
		expect(placeWords(N)).toBe('the north pole, +ẑ');
		expect(placeWords(at(120, 180))).toBe('ϑ = 120°, φ = 180°');
		expect(mWords(-2)).toBe('−2');
		expect(mWords(0)).toBe('0');
		expect(mWords(1)).toBe('+1');
	});

	it('counts the stars that sit together', () => {
		expect(starsWords(presetStars('body-wave', false))).toBe(
			'two together at the north pole, +ẑ; one at ϑ = 120°, φ = 0°; one at ϑ = 120°, φ = 180°'
		);
		expect(starsWords([N, N, N, N])).toBe('four together at the north pole, +ẑ');
	});
});
