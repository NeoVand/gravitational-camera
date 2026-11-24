/**
 * Chapter 7.5's magnetic tide: the figure's model against the chapter. The magnetic part of one moving mass is
 * symmetric and trace-free, zero for motion along the line of sight, and √3 v⊥/c times the electric part in norm;
 * both it and the spin dipole follow from the flow rule (G/c)(∂_ib_j + ∂_jb_i), b = ∇ × A; the spin dipole is
 * trace-free, with its pole and equator values; the equator's reading is −7.15 × 10⁻¹² (1 − I/MR²) s⁻², from the
 * formula and from the two rules added; gyroscopes 1 m apart there turn at 1.6 × 10⁻²⁰ rad/s; and each prediction is
 * answered only once the reader has done what it asks.
 */
import { describe, expect, it } from 'vitest';
import {
	BALANCE,
	BALL_RATIO,
	BODY,
	C,
	EARTH,
	G,
	INNER,
	OPENING,
	PERSON,
	RATE,
	RATIO,
	SHELL_RATIO,
	SIGHT,
	SPEED,
	angularMomentum,
	asymmetry,
	atShell,
	cross,
	dot,
	dragged,
	electricPoint,
	equatorFactor,
	equatorParts,
	equatorReading,
	equatorTable,
	gyroPair,
	inUnits,
	landed,
	length,
	magneticPoint,
	norm,
	noteFirst,
	noteSecond,
	noteThird,
	passing,
	ratioRule,
	sideways,
	spinDipole,
	spinRatio,
	spinTable,
	spun,
	stepped,
	straightAt,
	texThree,
	three,
	trace,
	velocityKey,
	velocityVector,
	type Mat3,
	type Vec3
} from './magnetic-tide';

/** A few unit vectors and velocities in general position. */
const unit = (a: Vec3): Vec3 => a.map((x) => x / length(a)) as Vec3;
const DIRECTIONS: Vec3[] = [
	[1, 0, 0],
	unit([0.3, -0.8, 0.52]),
	unit([-0.6, 0.1, 0.79]),
	unit([0.2, 0.9, -0.4])
];
const VELOCITIES: Vec3[] = [
	[0, 1.4, 0],
	[0.7, -1.1, 2.3],
	[-2.2, 0.4, -0.9]
];

const close = (a: number, b: number, rel = 1e-9) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(rel * Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** The largest entry in size. */
const biggest = (t: Mat3) => Math.max(...t.flat().map(Math.abs));

/**
 * The flow rule's symmetric part, (G/c)(∂_ib_j + ∂_jb_i), with b = ∇ × A by central differences, at the pixel x;
 * A is the potential of the flow, kg s⁻¹.
 */
function fromFlow(A: (x: Vec3) => Vec3, x: Vec3, h = 1e-4): Mat3 {
	const shift = (p: Vec3, k: number, d: number): Vec3 =>
		p.map((v, i) => (i === k ? v + d : v)) as Vec3;
	const dA = (p: Vec3, k: number) => {
		const a = A(shift(p, k, h));
		const b = A(shift(p, k, -h));
		return a.map((v, i) => (v - b[i]) / (2 * h));
	};
	const curl = (p: Vec3): Vec3 => {
		const d = [0, 1, 2].map((k) => dA(p, k)); // d[k][i] = ∂_k A_i
		return [d[1][2] - d[2][1], d[2][0] - d[0][2], d[0][1] - d[1][0]];
	};
	const db = [0, 1, 2].map((k) => {
		const a = curl(shift(x, k, h));
		const b = curl(shift(x, k, -h));
		return a.map((v, i) => (v - b[i]) / (2 * h));
	}); // db[k][i] = ∂_k b_i
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (G / C) * (db[i][j] + db[j][i]))) as Mat3;
}

describe('one moving mass, eq:magnetic-point', () => {
	it('is symmetric and trace-free', () => {
		for (const n of DIRECTIONS)
			for (const v of VELOCITIES) {
				const B = magneticPoint(70, 1.3, n, v);
				expect(asymmetry(B)).toBeLessThanOrEqual(1e-12 * biggest(B));
				expect(Math.abs(trace(B))).toBeLessThanOrEqual(1e-12 * biggest(B));
			}
	});

	it('is zero for motion along the line of sight, either way', () => {
		for (const n of DIRECTIONS)
			for (const s of [1.4, -2.5]) {
				const B = magneticPoint(70, 1, n, n.map((x) => s * x) as Vec3);
				expect(biggest(B)).toBeLessThanOrEqual(1e-30);
			}
	});

	it('sees only the sideways speed', () => {
		const n = DIRECTIONS[1];
		const v = VELOCITIES[1];
		const along = n.map((x) => dot(n, v) * x) as Vec3;
		const across = v.map((x, i) => x - along[i]) as Vec3;
		const a = magneticPoint(70, 1, n, v);
		const b = magneticPoint(70, 1, n, across);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(a[i][j], b[i][j], 1e-12);
		close(sideways(n, v), length(across), 1e-12);
	});

	it('has |𝓑|/|𝓔| = √3 v⊥/c, with |𝓑| = 3√2 GMv⊥/cr³ and |𝓔| = √6 GM/r³', () => {
		for (const n of DIRECTIONS)
			for (const v of VELOCITIES) {
				const B = magneticPoint(70, 2, n, v);
				const E = electricPoint(70, 2, n);
				const vp = sideways(n, v);
				close(norm(B) / norm(E), ratioRule(vp), 1e-12);
				close(norm(B), (3 * Math.SQRT2 * G * 70 * vp) / (C * 8), 1e-12);
				close(norm(E), (Math.sqrt(6) * G * 70) / 8, 1e-12);
			}
	});

	it('is the symmetric part of the flow rule for A = Mv/|x − y|, n̂ from the pixel toward the mass', () => {
		const M = 1e9;
		const v: Vec3 = [0.4, 1.2, -0.7];
		const A = (x: Vec3): Vec3 => v.map((c) => (M * c) / length(x)) as Vec3;
		const x: Vec3 = [-0.8, 0.5, 0.3];
		const B = fromFlow(A, x);
		const want = magneticPoint(M, length(x), unit(x.map((c) => -c) as Vec3), v);
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				expect(Math.abs(B[i][j] - want[i][j])).toBeLessThan(1e-6 * biggest(want));
	});

	it('gives the figure its opening numbers: 9.26 × 10⁻¹⁷, 1.14 × 10⁻⁸ and 8.09 × 10⁻⁹ twice', () => {
		const p = passing(OPENING.velocity);
		expect(inUnits(p.B, -17)).toBe('9.26');
		expect(inUnits(p.E, -8)).toBe('1.14');
		expect(three(p.ratio)).toBe('8.09 × 10⁻⁹');
		expect(three(p.rule)).toBe('8.09 × 10⁻⁹');
		close(p.vPerp, 1.4, 1e-12);
		// the chapter's entry 3GMv/cr³ = 6.54 × 10⁻¹⁷, and its gyroscopes 1 m apart along the line
		const B = magneticPoint(PERSON.M, PERSON.r, SIGHT, velocityVector(OPENING.velocity));
		expect(three(B[0][2])).toBe('6.54 × 10⁻¹⁷');
		expect(three(p.gyro)).toBe('2.18 × 10⁻²⁵');
	});

	it('reads zero, with the stretch unchanged, when the mass comes straight at the pixel', () => {
		const p = passing({ speed: 1.4, angle: 180 });
		expect(p.B).toBe(0);
		expect(p.ratio).toBe(0);
		expect(p.rule).toBe(0);
		expect(p.gyro).toBe(0);
		close(p.E, passing(OPENING.velocity).E, 1e-15);
	});
});

describe('the spin dipole, eq:spin-dipole', () => {
	const L = 5000;

	it('is symmetric and trace-free for any spin', () => {
		for (const n of DIRECTIONS)
			for (const s of VELOCITIES) {
				const B = spinDipole(s, 1.7, n);
				expect(asymmetry(B)).toBeLessThanOrEqual(1e-12 * biggest(B));
				expect(Math.abs(trace(B))).toBeLessThanOrEqual(1e-12 * biggest(B));
			}
	});

	it('over a pole has 𝓑ₙₙ = 6G(L·n̂)/cr⁴ and −3GL/cr⁴ across', () => {
		const n: Vec3 = [0, 0, 1];
		const r = 1.5;
		const k = (G * L) / (C * r ** 4);
		const up = spinDipole([0, 0, -L], r, n); // the pixel above the north pole: n̂ toward the body is −L̂
		close(up[2][2], -6 * k, 1e-12);
		close(up[0][0], 3 * k, 1e-12);
		const down = spinDipole([0, 0, L], r, n);
		close(down[2][2], 6 * k, 1e-12);
		close(down[1][1], -3 * k, 1e-12);
	});

	it('on the equator has 𝓑ₙₙ = 0 and only 𝓑_nL = −3GL/cr⁴, so |𝓑| = 3√2 GL/cr⁴', () => {
		const B = spinTable('ball', 50);
		const Lz = angularMomentum('ball', 50);
		const k = (G * Lz) / (C * BODY.r ** 4);
		expect(Math.abs(B[0][0])).toBe(0);
		close(B[0][2], -3 * k, 1e-12);
		close(B[2][0], -3 * k, 1e-12);
		close(norm(B), 3 * Math.SQRT2 * k, 1e-12);
	});

	it('is the flow rule for A = L × x/2r³', () => {
		const Lv: Vec3 = [3e9, -1e9, 2e9];
		const A = (x: Vec3): Vec3 => cross(Lv, x).map((c) => c / (2 * length(x) ** 3)) as Vec3;
		const x: Vec3 = [0.9, -0.4, 1.1];
		const B = fromFlow(A, x);
		const want = spinDipole(Lv, length(x), unit(x.map((c) => -c) as Vec3));
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				expect(Math.abs(B[i][j] - want[i][j])).toBeLessThan(1e-6 * biggest(want));
	});

	it('is 5/3 larger for a shell than for a ball of the same mass, size and rate', () => {
		close(norm(spinTable('shell', 37)) / norm(spinTable('ball', 37)), 5 / 3, 1e-12);
		expect(spinRatio('ball')).toBe(BALL_RATIO);
		expect(spinRatio('shell')).toBe(SHELL_RATIO);
		close(angularMomentum('ball', 50), 5000, 1e-12);
	});

	it('vanishes for a ball of radius 2^(−1/5) R = 0.871 R inside a counter-turning shell', () => {
		expect(three(BALANCE)).toBe('0.871');
		expect(angularMomentum('counter', 80, BALANCE)).toBe(0);
		expect(norm(spinTable('counter', 80, BALANCE))).toBe(0);
		// a whole ball turning one way is the plain ball; a small one inside is outweighed by the shell
		close(spinRatio('counter', 1), BALL_RATIO, 1e-12);
		expect(spinRatio('counter', 0.5)).toBeLessThan(0);
		expect(spinRatio('counter', 0.9)).toBeGreaterThan(0);
		expect(Math.abs(spinRatio('counter', 0.87055))).toBeLessThan(1e-4);
	});
});

describe('the equator, eq:earth', () => {
	it('has the factor 7.15 × 10⁻¹² and the readings 4.79, 4.29 and 2.38', () => {
		expect(three(equatorFactor())).toBe('7.15 × 10⁻¹²');
		expect(three(equatorReading(EARTH.ratio))).toBe('−4.79 × 10⁻¹²');
		expect(three(equatorReading(BALL_RATIO))).toBe('−4.29 × 10⁻¹²');
		expect(three(equatorReading(SHELL_RATIO))).toBe('−2.38 × 10⁻¹²');
		close(equatorReading(SHELL_RATIO), -equatorFactor() / 3, 1e-12);
	});

	it('is the sum of the pixel’s motion and the planet’s spin', () => {
		for (const q of [0, 0.2, EARTH.ratio, 0.5, SHELL_RATIO]) {
			const p = equatorParts(q);
			close(p.motion + p.spin, equatorReading(q), 1e-12);
			expect(p.motion).toBeLessThan(0);
			expect(p.spin).toBeGreaterThanOrEqual(0);
		}
		expect(three(equatorParts(EARTH.ratio).spin)).toBe('2.36 × 10⁻¹²');
	});

	it('follows from the moving-mass rule with −u and the spin dipole, with every other entry zero', () => {
		for (const q of [0, EARTH.ratio, BALL_RATIO, SHELL_RATIO]) {
			const B = equatorTable(q);
			close(B[0][2], equatorReading(q), 1e-9);
			close(B[2][0], equatorReading(q), 1e-9);
			for (const [i, j] of [
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 2],
				[2, 2]
			])
				expect(Math.abs(B[i][j])).toBeLessThanOrEqual(1e-12 * Math.abs(B[0][2]));
		}
	});

	it('never reaches zero for a round body: the reading at ⅔ is a third of the factor', () => {
		for (let q = 0; q <= SHELL_RATIO + 1e-12; q += 1 / 300)
			expect(equatorReading(q)).toBeLessThan(0);
		expect(RATIO.max).toBe(SHELL_RATIO);
	});

	it('turns two gyroscopes 1 m apart, one above the other, at 1.6 × 10⁻²⁰ rad/s', () => {
		const B = equatorTable(EARTH.ratio);
		const d = gyroPair(B, [1, 0, 0]); // the second gyroscope 1 m farther from the centre
		expect(d[0]).toBe(0);
		expect(three(Math.abs(d[2]))).toBe('1.60 × 10⁻²⁰');
		// the upper one turns clockwise seen from above the north pole: negative about z
		expect(d[2]).toBeLessThan(0);
		close(Math.abs(d[2]), Math.abs(equatorReading(EARTH.ratio)) / C, 1e-9);
	});
});

describe('the controls', () => {
	it('step the sliders onto their grids and stop at their marks', () => {
		expect(stepped(50, 'ArrowRight', false, RATE)).toBe(51);
		expect(stepped(50, 'ArrowLeft', true, RATE)).toBe(40);
		expect(stepped(100, 'ArrowUp', false, RATE)).toBe(100);
		expect(stepped(0.86, 'ArrowRight', false, INNER)).toBe(0.87);
		expect(stepped(0.87, 'ArrowRight', false, INNER)).toBe(BALANCE);
		expect(stepped(BALANCE, 'ArrowRight', false, INNER)).toBe(0.88);
		expect(stepped(BALANCE, 'ArrowLeft', false, INNER)).toBe(0.87);
		expect(stepped(0.33, 'ArrowRight', false, RATIO)).toBe(EARTH.ratio);
		expect(stepped(EARTH.ratio, 'ArrowRight', false, RATIO)).toBe(0.34);
		expect(stepped(EARTH.ratio, 'ArrowLeft', false, RATIO)).toBe(0.33);
		expect(stepped(0.66, 'ArrowRight', false, RATIO)).toBe(SHELL_RATIO);
		expect(stepped(SHELL_RATIO, 'ArrowLeft', false, RATIO)).toBe(0.66);
		expect(stepped(0.62, 'ArrowRight', true, RATIO)).toBe(0.65);
		expect(stepped(0.3, 'End', false, RATIO)).toBe(SHELL_RATIO);
		expect(stepped(0.3, 'a', false, RATIO)).toBeUndefined();
	});

	it('land a dragged slider on its marks', () => {
		expect(landed(0.33, RATIO)).toBe(EARTH.ratio);
		expect(landed(200 / 300, RATIO)).toBe(SHELL_RATIO);
		expect(landed(0.9, RATIO)).toBe(SHELL_RATIO);
		expect(landed(0.87, INNER)).toBe(BALANCE);
		expect(landed(0.874, INNER)).toBe(BALANCE);
		expect(landed(0.86, INNER)).toBe(0.86);
	});

	it('turn and speed the velocity arrow with the keys', () => {
		const v = OPENING.velocity;
		expect(velocityKey(v, 'ArrowLeft', false)).toEqual({ speed: 1.4, angle: 95 });
		expect(velocityKey(v, 'ArrowRight', true)).toEqual({ speed: 1.4, angle: 75 });
		expect(velocityKey(v, 'ArrowUp', false)).toEqual({ speed: 1.5, angle: 90 });
		expect(velocityKey(v, 'ArrowDown', true)).toEqual({ speed: 1, angle: 90 });
		expect(velocityKey({ speed: 2.9, angle: 0 }, 'ArrowUp', true)?.speed).toBe(SPEED.max);
		expect(velocityKey({ speed: 1, angle: 0 }, 'ArrowRight', false)?.angle).toBe(355);
		expect(velocityKey(v, 'Enter', false)).toBeUndefined();
		// six large turns anticlockwise bring the mass straight at the pixel
		let w = v;
		for (let i = 0; i < 6; i++) w = velocityKey(w, 'ArrowLeft', true)!;
		expect(straightAt(w)).toBe(true);
	});

	it('drag the velocity arrow on whole degrees and land it on the line of sight', () => {
		expect(dragged(0, 1.4, OPENING.velocity)).toEqual({ speed: 1.4, angle: 90 });
		expect(dragged(-1.4, 0.07, OPENING.velocity)).toEqual({ speed: 1.4, angle: 180 });
		expect(dragged(1, -0.05, OPENING.velocity).angle).toBe(0);
		expect(dragged(-5, 0, OPENING.velocity).speed).toBe(SPEED.max);
		expect(dragged(0.01, 0, OPENING.velocity)).toEqual({ speed: 0, angle: 90 });
	});
});

describe('the predictions', () => {
	it('answer the first once the mass moves straight at the pixel', () => {
		expect(noteFirst(false, OPENING.velocity)).toBe(false);
		expect(noteFirst(false, { speed: 1.4, angle: 0 })).toBe(false);
		expect(noteFirst(false, { speed: 0, angle: 180 })).toBe(false);
		expect(noteFirst(false, { speed: 1.4, angle: 175 })).toBe(false);
		expect(noteFirst(false, { speed: 0.5, angle: 180 })).toBe(true);
		expect(noteFirst(true, OPENING.velocity)).toBe(true);
	});

	it('answer the second once a ball and a shell have spun at the same rate', () => {
		let s = spun({}, 'ball', OPENING.rate);
		expect(noteSecond(false, s)).toBe(false);
		s = spun(s, 'shell', 60);
		expect(noteSecond(false, s)).toBe(false);
		s = spun(s, 'counter', 50);
		expect(noteSecond(false, s)).toBe(false);
		s = spun(s, 'shell', 0);
		expect(noteSecond(false, s)).toBe(false);
		s = spun(s, 'shell', 50);
		expect(noteSecond(false, s)).toBe(true);
		expect(noteSecond(true, {})).toBe(true);
	});

	it('answer the third once the equator slider reaches the shell’s ⅔', () => {
		expect(noteThird(false, OPENING.ratio)).toBe(false);
		expect(noteThird(false, 0.66)).toBe(false);
		expect(atShell(SHELL_RATIO)).toBe(true);
		expect(noteThird(false, SHELL_RATIO)).toBe(true);
		expect(noteThird(true, 0)).toBe(true);
	});
});

describe('the words', () => {
	it('write numbers to three figures', () => {
		expect(three(0)).toBe('0');
		expect(three(-4.7855e-12)).toBe('−4.79 × 10⁻¹²');
		expect(three(9.9999e-5)).toBe('1.00 × 10⁻⁴');
		expect(three(0.3307)).toBe('0.331');
		expect(three(5000)).toBe('5.00 × 10³');
		expect(three(100)).toBe('100');
		expect(texThree(-4.7855e-12)).toBe('-4.79\\times10^{-12}');
		expect(inUnits(0, -17)).toBe('0.00');
	});
});
