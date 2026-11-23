/** The physics of chapter 1.6's turning pixel, against the equation of the turning frame and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import { G } from './tidal-ring';
import {
	EARTH,
	FASTEST,
	LONGEST,
	MOON,
	PERSON_K,
	REACH,
	UNIT,
	apply,
	centrifugal,
	coriolis,
	drift,
	eigenvalues,
	faceOn,
	inertial,
	launch,
	personTide,
	pseudoTide,
	ring,
	runLength,
	standing,
	trace,
	turn,
	turning,
	turningVelocity,
	type Release,
	type Table,
	type Vec
} from './turning-pixel';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));
const closeVec = (a: Vec, b: Vec, digits = 12) => {
	close(a.x, b.x, digits);
	close(a.y, b.y, digits);
	close(a.z, b.z, digits);
};
const add = (a: Vec, b: Vec, k = 1): Vec => ({
	x: a.x + k * b.x,
	y: a.y + k * b.y,
	z: a.z + k * b.z
});

/** The turning frame's equation, ẍ = −2Ω × ẋ − Ω × (Ω × x), integrated by fourth-order Runge–Kutta. */
function integrate(x0: Vec, v0: Vec, omega: number, t: number, steps = 4000) {
	const acc = (x: Vec, v: Vec) => add(coriolis(v, omega), centrifugal(x, omega));
	let x = x0;
	let v = v0;
	const h = t / steps;
	for (let i = 0; i < steps; i++) {
		const a1 = acc(x, v);
		const x2 = add(x, v, h / 2);
		const v2 = add(v, a1, h / 2);
		const a2 = acc(x2, v2);
		const x3 = add(x, v2, h / 2);
		const v3 = add(v, a2, h / 2);
		const a3 = acc(x3, v3);
		const x4 = add(x, v3, h);
		const v4 = add(v, a3, h);
		const a4 = acc(x4, v4);
		x = add(
			x,
			{
				x: v.x + 2 * v2.x + 2 * v3.x + v4.x,
				y: v.y + 2 * v2.y + 2 * v3.y + v4.y,
				z: v.z + 2 * v2.z + 2 * v3.z + v4.z
			},
			h / 6
		);
		v = add(
			v,
			{
				x: a1.x + 2 * a2.x + 2 * a3.x + a4.x,
				y: a1.y + 2 * a2.y + 2 * a3.y + a4.y,
				z: a1.z + 2 * a2.z + 2 * a3.z + a4.z
			},
			h / 6
		);
	}
	return { x, v };
}

describe('the balls seen from outside', () => {
	it('move in straight lines: tangent to the ring if let go on the turntable, not at all if let go at rest', () => {
		const omega = 0.4;
		for (const p of ring()) {
			const a = inertial(p, omega, 1, 'turntable');
			const b = inertial(p, omega, 3, 'turntable');
			// equal steps along one line, at right angles to the radius
			closeVec(add(b, p, -1), { x: 3 * (a.x - p.x), y: 3 * (a.y - p.y), z: 0 });
			close((a.x - p.x) * p.x + (a.y - p.y) * p.y, 0);
			close(Math.hypot(a.x - p.x, a.y - p.y), omega);
			closeVec(inertial(p, omega, 5, 'still'), p);
		}
	});
});

describe('the balls seen from the turning frame', () => {
	const cases: [Release, number][] = [
		['turntable', 0.3],
		['turntable', FASTEST],
		['still', 0.45],
		['still', FASTEST]
	];

	it('obey ẍ = −2Ω × ẋ + Ω² x⊥ exactly: the turned-back straight line is the integrated motion', () => {
		for (const [release, omega] of cases)
			for (const p0 of [...ring(5), { x: 0.6, y: -0.3, z: 0.8 }]) {
				const t = runLength(omega);
				// the velocity in the turning frame at the start: zero on the turntable, −Ω × x₀ for a ball still outside
				const v0 = turningVelocity(p0, omega, 0, release);
				if (release === 'turntable') closeVec(v0, { x: 0, y: 0, z: 0 });
				const { x, v } = integrate(p0, v0, omega, t);
				closeVec(turning(p0, omega, t, release), x, 9);
				closeVec(turningVelocity(p0, omega, t, release), v, 9);
			}
	});

	it('have the velocity that the positions change at', () => {
		const h = 1e-5;
		for (const [release, omega] of cases) {
			const p0 = { x: 0.3, y: 0.9, z: -0.2 };
			const t = 1.7;
			const a = turning(p0, omega, t - h, release);
			const b = turning(p0, omega, t + h, release);
			closeVec(
				turningVelocity(p0, omega, t, release),
				{ x: (b.x - a.x) / (2 * h), y: (b.y - a.y) / (2 * h), z: (b.z - a.z) / (2 * h) },
				8
			);
		}
	});

	it('let go on the turntable, drift out to √(1 + Ω²t²) and fall behind the turning by Ωt − arctan Ωt', () => {
		const omega = 0.37;
		for (const t of [0, 0.8, 2.5, 5]) {
			for (const p0 of ring()) {
				const p = turning(p0, omega, t, 'turntable');
				close(Math.hypot(p.x, p.y), drift(omega, t));
				const lag = Math.atan2(p0.y, p0.x) + Math.atan(omega * t) - omega * t;
				closeVec(p, {
					x: drift(omega, t) * Math.cos(lag),
					y: drift(omega, t) * Math.sin(lag),
					z: 0
				});
			}
		}
	});

	it('let go at rest outside, wheel round backwards at Ω without moving out: centrifugal out, Coriolis twice as hard in', () => {
		const omega = 0.5;
		for (const p0 of ring()) {
			const t = 2.2;
			const p = turning(p0, omega, t, 'still');
			closeVec(p, turn(p0, -omega * t));
			const v = turningVelocity(p0, omega, t, 'still');
			const a = add(centrifugal(p, omega), coriolis(v, omega));
			closeVec(coriolis(v, omega), {
				x: -2 * omega * omega * p.x,
				y: -2 * omega * omega * p.y,
				z: 0
			});
			closeVec(a, { x: -omega * omega * p.x, y: -omega * omega * p.y, z: 0 });
		}
	});

	it('never move along the axis', () => {
		for (const [release, omega] of cases)
			for (const p0 of standing())
				for (const t of [0.5, 2, runLength(omega)]) close(turning(p0, omega, t, release).z, p0.z);
	});
});

describe('the pseudo-tide', () => {
	it('is −Ω² across the axis and 0 along it: diag(−Ω², −Ω², 0) for the z axis', () => {
		const omega = 0.4;
		const w2 = omega * omega;
		expect(pseudoTide(omega)).toEqual([
			[-w2, 0, 0],
			[0, -w2, 0],
			[0, 0, 0]
		]);
	});

	it('for any axis: symmetric, zero on Ω̂, −Ω² on every direction across it, eigenvalues (−Ω², −Ω², 0), trace −2Ω²', () => {
		const omega = 7.3e-5;
		const w2 = omega * omega;
		for (const axis of [
			{ x: 0, y: 0, z: 1 },
			{ x: 1, y: 2, z: -2 },
			{ x: -0.3, y: 0.1, z: 0.9 }
		]) {
			const T = pseudoTide(omega, axis);
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(T[i][j], T[j][i], 30);
			closeVec(apply(T, axis), { x: 0, y: 0, z: 0 }, 22);
			// a direction across the axis
			const across = { x: axis.y, y: -axis.x, z: 0 };
			const n = Math.hypot(across.x, across.y) || 1;
			const u = { x: across.x / n || 1, y: across.y / n, z: 0 };
			closeVec(apply(T, u), { x: -w2 * u.x, y: -w2 * u.y, z: 0 }, 22);
			const [a, b, c] = eigenvalues(T);
			expect(Math.abs(a / w2 + 1)).toBeLessThan(1e-9);
			expect(Math.abs(b / w2 + 1)).toBeLessThan(1e-9);
			expect(Math.abs(c / w2)).toBeLessThan(1e-9);
			expect(trace(T) / w2).toBeCloseTo(-2, 12);
		}
	});

	it('is the difference of the centrifugal accelerations of two balls at rest in the turning frame, as −E ξ', () => {
		const omega = 0.5;
		const T = pseudoTide(omega);
		const x = { x: 0.7, y: -0.2, z: 0.4 };
		for (const xi of [
			{ x: 1e-3, y: 0, z: 0 },
			{ x: 0, y: 0, z: 1e-3 },
			{ x: 3e-4, y: -6e-4, z: 2e-4 }
		]) {
			const d = add(centrifugal(add(x, xi), omega), centrifugal(x, omega), -1);
			const e = apply(T, xi);
			closeVec(d, { x: -e.x, y: -e.y, z: -e.z }, 15);
		}
	});

	it('cannot be made by mass: the person’s tide is diag(−2, 1, 1) GM/r³ with trace 0', () => {
		const P = personTide();
		const [a, b, c] = eigenvalues(P);
		close(a / PERSON_K, -2);
		close(b / PERSON_K, 1);
		close(c / PERSON_K, 1);
		close(trace(P) / PERSON_K, 0, 14);
	});

	it('has its eigenvalues found for any symmetric table', () => {
		const tables: Table[] = [
			[
				[2, 1, 0.5],
				[1, -1, 0.3],
				[0.5, 0.3, 0.4]
			],
			[
				[-1, 0.2, 0],
				[0.2, -1, 0],
				[0, 0, 3]
			]
		];
		for (const T of tables) {
			const v = eigenvalues(T);
			close(v[0] + v[1] + v[2], trace(T));
			expect(v[0]).toBeLessThanOrEqual(v[1]);
			expect(v[1]).toBeLessThanOrEqual(v[2]);
			// each makes T − λI singular
			for (const l of v) {
				const [[a, b, c], [, d, e], [, , f]] = T;
				const det =
					(a - l) * ((d - l) * (f - l) - e * e) -
					b * (b * (f - l) - e * c) +
					c * (b * e - (d - l) * c);
				expect(Math.abs(det)).toBeLessThan(1e-10);
			}
		}
	});
});

describe('the Earth’s rate', () => {
	it('is 7.29 × 10⁻⁵ s⁻¹, Ω² = 5.3 × 10⁻⁹ s⁻², and the slider’s fastest rate in its time unit of 2.39 hours', () => {
		expect(EARTH / 1e-5).toBeCloseTo(7.292, 3);
		expect((EARTH * EARTH) / 1e-9).toBeCloseTo(5.32, 2);
		close(FASTEST / UNIT, EARTH);
		expect(UNIT / 3600).toBeCloseTo(2.39, 2);
	});

	it('gives a pseudo-tide 0.57 of the person’s stretch at a metre, comparable to their 4.67 × 10⁻⁹ s⁻²', () => {
		expect(PERSON_K / 1e-9).toBeCloseTo(4.67, 2);
		expect((2 * PERSON_K) / 1e-9).toBeCloseTo(9.34, 2);
		expect((EARTH * EARTH) / (2 * PERSON_K)).toBeCloseTo(0.57, 2);
		const [stretch] = eigenvalues(pseudoTide(EARTH));
		expect(stretch / 1e-9).toBeCloseTo(-5.32, 2);
	});

	it('is 31,000 times the Moon’s tide and would need a density of −12.7 kg m⁻³', () => {
		expect(Math.round((EARTH * EARTH) / MOON / 1000)).toBe(31);
		expect(-(EARTH * EARTH) / (2 * Math.PI * G)).toBeCloseTo(-12.7, 1);
	});
});

describe('the drawing', () => {
	it('shows the standing ring face-on: wider across the axis, no taller along it', () => {
		const omega = 0.5;
		const t = 2.6;
		for (const p0 of standing()) {
			const on = faceOn(p0, omega, t, 'turntable');
			close(on.across, p0.x * drift(omega, t));
			close(on.along, p0.z);
			const still = faceOn(p0, omega, t, 'still');
			close(still.across, p0.x);
			close(still.along, p0.z);
		}
	});

	it('ends a run when the balls let go on the turntable have drifted out to twice their distance', () => {
		for (const omega of [0.2, FASTEST]) close(drift(omega, runLength(omega)), REACH);
		expect(runLength(0)).toBe(LONGEST);
		expect(runLength(0.01)).toBe(LONGEST);
	});

	it('lets the balls go with the turntable’s velocity, Ω ẑ × x₀', () => {
		closeVec(launch({ x: 1, y: 0, z: 0 }, 0.3, 'turntable'), { x: 0, y: 0.3, z: 0 });
		closeVec(launch({ x: 1, y: 0, z: 0 }, 0.3, 'still'), { x: 0, y: 0, z: 0 });
	});
});
