/** The ring under a symmetric table: its principal values and axes, and how the drawing moves and colours it. */
import { describe, expect, it } from 'vitest';
import {
	LARGEST,
	LEAST,
	MOST,
	OPENING,
	SCALE,
	STEP,
	apply,
	degrees,
	determinant,
	displaced,
	kind,
	move,
	principal,
	ring,
	round,
	trace,
	type Table
} from './ring-matrix';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

/** A small generator of the same random tables on every run. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

const next = random(20261123);
const entry = (spread: number) => spread * (2 * next() - 1);
const tables: Table[] = [
	...Array.from({ length: 400 }, () => ({ a: entry(2), b: entry(2), d: entry(2) })),
	...Array.from({ length: 100 }, () => ({ a: entry(1e3), b: entry(1e-3), d: entry(1e3) })),
	{ a: 1, b: 0, d: 1 },
	{ a: 0, b: 0, d: 0 },
	{ a: 0, b: 2, d: 0 },
	{ a: 2, b: 0, d: -2 },
	{ a: 1, b: 1e-9, d: 1 },
	OPENING
];

describe('the principal values and axes', () => {
	it('satisfy T v = λ v for random tables', () => {
		for (const t of tables) {
			const size = Math.max(Math.abs(t.a), Math.abs(t.b), Math.abs(t.d), 1);
			for (const p of principal(t)) {
				const v = apply(t, p.axis.x, p.axis.y);
				expect(Math.abs(v.x - p.value * p.axis.x)).toBeLessThan(1e-12 * size);
				expect(Math.abs(v.y - p.value * p.axis.y)).toBeLessThan(1e-12 * size);
			}
		}
	});

	it('have unit axes at right angles, on the right-hand side, the smaller value first', () => {
		for (const t of tables) {
			const [p, q] = principal(t);
			close(Math.hypot(p.axis.x, p.axis.y), 1);
			close(Math.hypot(q.axis.x, q.axis.y), 1);
			close(p.axis.x * q.axis.x + p.axis.y * q.axis.y, 0);
			expect(p.value).toBeLessThanOrEqual(q.value);
			for (const { axis } of [p, q]) {
				expect(axis.x).toBeGreaterThanOrEqual(-1e-12);
				const angle = degrees(axis);
				expect(angle).toBeGreaterThan(-90);
				expect(angle).toBeLessThanOrEqual(90 + 1e-9);
			}
		}
	});

	it('keep the trace and the determinant', () => {
		for (const t of tables) {
			const [p, q] = principal(t);
			const size = Math.max(Math.abs(t.a), Math.abs(t.b), Math.abs(t.d), 1);
			expect(Math.abs(p.value + q.value - trace(t))).toBeLessThan(1e-12 * size);
			expect(Math.abs(p.value * q.value - determinant(t))).toBeLessThan(1e-12 * size * size);
		}
	});

	it('open on diag(−2, 1): a stretch of −2 along x and a squeeze of 1 along y', () => {
		const [p, q] = principal(OPENING);
		expect(p.value).toBe(-2);
		expect(q.value).toBe(1);
		expect(degrees(p.axis)).toBe(0);
		close(degrees(q.axis), 90);
		expect(trace(OPENING)).toBe(-1);
	});

	it('turn the axes by half the angle of the shear: b alone puts them on the diagonals', () => {
		const [p, q] = principal({ a: 0, b: 1, d: 0 });
		close(p.value, -1);
		close(q.value, 1);
		close(degrees(p.axis), -45);
		close(degrees(q.axis), 45);
		// a table turned by θ has its axes turned by θ
		for (const theta of [0.3, 1, -0.7, 1.4]) {
			const c = Math.cos(theta);
			const s = Math.sin(theta);
			const [l1, l2] = [-1.5, 0.8];
			const t = {
				a: l1 * c * c + l2 * s * s,
				b: (l1 - l2) * c * s,
				d: l1 * s * s + l2 * c * c
			};
			const [first] = principal(t);
			close(first.value, l1);
			close(degrees(first.axis), (theta * 180) / Math.PI, 9);
		}
	});

	it('take x and y for axes when the two values are equal', () => {
		const t = { a: 0.7, b: 0, d: 0.7 };
		expect(round(t)).toBe(true);
		expect(round(OPENING)).toBe(false);
		const [p, q] = principal(t);
		expect(p.value).toBe(0.7);
		expect(q.value).toBe(0.7);
		expect(p.axis).toEqual({ x: 1, y: 0 });
		expect(q.axis).toEqual({ x: 0, y: 1 });
	});
});

describe('the drawing', () => {
	const corners: Table[] = [];
	for (const a of [LEAST, 0, MOST])
		for (const b of [LEAST, 0, MOST]) for (const d of [LEAST, 0, MOST]) corners.push({ a, b, d });

	it('moves the ring by at most 0.3 of its radius anywhere on the sliders, so that it never folds', () => {
		expect(STEP).toBe(0.05);
		const most = Math.max(...corners.flatMap((t) => principal(t).map((p) => Math.abs(p.value))));
		expect(most).toBe(LARGEST);
		close(SCALE * LARGEST, 0.3);
		for (const t of corners)
			for (const p of principal(t)) {
				expect(Math.abs(SCALE * p.value)).toBeLessThanOrEqual(0.3 + 1e-12);
				expect(1 - SCALE * p.value).toBeGreaterThan(0.69);
			}
	});

	it('draws each ball at ξ − s T ξ, out along a stretch axis and in along a squeeze axis', () => {
		const balls = ring();
		expect(balls).toHaveLength(12);
		const east = displaced(OPENING, balls[0].x, balls[0].y);
		close(east.x, 1 + 2 * SCALE);
		close(east.y, 0);
		const north = displaced(OPENING, balls[3].x, balls[3].y);
		close(north.x, 0, 15);
		close(north.y, 1 - SCALE);
		for (const t of tables.slice(0, 50))
			for (const b of balls) {
				const p = displaced(t, b.x, b.y, 0.1);
				const m = move(t, b.x, b.y);
				close(p.x, b.x + 0.1 * m.x);
				close(p.y, b.y + 0.1 * m.y);
			}
	});

	it('colours an arrow by the sign of ξ · (−T ξ): orange outward, blue inward', () => {
		const balls = ring();
		// diag(−2, 1): the balls on x move out, those on y in; at 30° from x still out, at 60° in
		expect(kind(OPENING, balls[0].x, balls[0].y)).toBe('stretch');
		expect(kind(OPENING, balls[6].x, balls[6].y)).toBe('stretch');
		expect(kind(OPENING, balls[1].x, balls[1].y)).toBe('stretch');
		expect(kind(OPENING, balls[2].x, balls[2].y)).toBe('squeeze');
		expect(kind(OPENING, balls[3].x, balls[3].y)).toBe('squeeze');
		// a pure shear: out along one diagonal, in along the other, and only sideways on the axes
		const shear = { a: 0, b: 1, d: 0 };
		expect(kind(shear, Math.SQRT1_2, -Math.SQRT1_2)).toBe('stretch');
		expect(kind(shear, Math.SQRT1_2, Math.SQRT1_2)).toBe('squeeze');
		expect(kind(shear, 1, 0)).toBe('still');
		expect(kind({ a: 0, b: 0, d: 0 }, 1, 0)).toBe('still');
		for (const t of tables.slice(0, 100))
			for (const b of balls) {
				const m = move(t, b.x, b.y);
				const radial = m.x * b.x + m.y * b.y;
				const k = kind(t, b.x, b.y);
				if (k === 'stretch') expect(radial).toBeGreaterThan(0);
				if (k === 'squeeze') expect(radial).toBeLessThan(0);
			}
	});
});
