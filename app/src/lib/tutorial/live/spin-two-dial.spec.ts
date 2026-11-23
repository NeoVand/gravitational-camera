/** The dial's rules, v′ = e^(−iθ) v and s′ = e^(−2iθ) s, against chapter 1.1's T′ = R T Rᵀ; and a rotor's wave. */
import { describe, expect, it } from 'vitest';
import { displaced, principal, type Table } from './ring-matrix';
import {
	ARROW,
	DEGREE,
	HALF,
	QUARTER,
	SHEAR,
	add,
	angleText,
	argument,
	at,
	bearing,
	circles,
	circular,
	complexTex,
	dragged,
	modulus,
	parts,
	principalAngle,
	rotor,
	rotorShear,
	shearOf,
	signed,
	tableOf,
	turnArrow,
	turnShear,
	wrap,
	type Complex
} from './spin-two-dial';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));
const same = (z: Complex, w: Complex, digits = 12) => {
	close(z.re, w.re, digits);
	close(z.im, w.im, digits);
};

/** A small generator of the same random numbers on every run. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}
const next = random(20261123);
const entry = (spread: number) => spread * (2 * next() - 1);

// chapter 1.1's rule, written out with no complex numbers: the rows of R are the new axes in the old components
type M = [[number, number], [number, number]];
const R = (theta: number): M => [
	[Math.cos(theta), Math.sin(theta)],
	[-Math.sin(theta), Math.cos(theta)]
];
const product = (p: M, q: M): M => [
	[p[0][0] * q[0][0] + p[0][1] * q[1][0], p[0][0] * q[0][1] + p[0][1] * q[1][1]],
	[p[1][0] * q[0][0] + p[1][1] * q[1][0], p[1][0] * q[0][1] + p[1][1] * q[1][1]]
];
const transpose = (p: M): M => [
	[p[0][0], p[1][0]],
	[p[0][1], p[1][1]]
];
const matrix = (t: Table): M => [
	[t.a, t.b],
	[t.b, t.d]
];
function turned(t: Table, theta: number): Table {
	const m = product(product(R(theta), matrix(t)), transpose(R(theta)));
	// a turned symmetric table stays symmetric
	close(m[0][1], m[1][0], 12);
	return { a: m[0][0], b: m[0][1], d: m[1][1] };
}
const arrowTurned = (v: Complex, theta: number): Complex => {
	const r = R(theta);
	return { re: r[0][0] * v.re + r[0][1] * v.im, im: r[1][0] * v.re + r[1][1] * v.im };
};

const tables: Table[] = Array.from({ length: 300 }, () => ({
	a: entry(3),
	b: entry(3),
	d: entry(3)
}));
const angles = [
	...Array.from({ length: 40 }, () => entry(4 * Math.PI)),
	0,
	Math.PI / 4,
	Math.PI / 2,
	Math.PI,
	2 * Math.PI
];

describe('turning the axes', () => {
	it('multiplies an arrow by e^(−iθ), as R v does', () => {
		for (let k = 0; k < 300; k++) {
			const v = { re: entry(5), im: entry(5) };
			for (const theta of angles) same(turnArrow(v, theta), arrowTurned(v, theta));
		}
	});

	it('multiplies the shear by e^(−2iθ), as T′ = R T Rᵀ does, for random tables and angles', () => {
		for (const t of tables)
			for (const theta of angles) same(shearOf(turned(t, theta)), turnShear(shearOf(t), theta));
	});

	it('keeps the trace and the size of the shear, and the arrow’s length', () => {
		for (const t of tables)
			for (const theta of angles) {
				const u = turned(t, theta);
				close(u.a + u.d, t.a + t.d);
				close(modulus(shearOf(u)), modulus(shearOf(t)));
			}
		close(modulus(turnArrow(ARROW, 1.234)), 1);
	});

	it('turns arg v back by θ and arg s back by 2θ', () => {
		for (const theta of [10, 30, 45, 100, 200, 300]) {
			close(principalAngle(argument(turnArrow(ARROW, theta * DEGREE)) - (30 - theta)), 0, 9);
			close(principalAngle(argument(turnShear(SHEAR, theta * DEGREE)) - (0 - 2 * theta)), 0, 9);
		}
	});

	it('gives the chapter’s numbers', () => {
		// 1 cm east, seen from axes turned by 45°: (0.707, −0.707)
		same(turnArrow({ re: 1, im: 0 }, Math.PI / 4), { re: Math.SQRT1_2, im: -Math.SQRT1_2 });
		// the north-east table of chapter 1.1, s = −3i, becomes diag(−2, 1), s = −3
		const ne = { a: -0.5, b: -1.5, d: -0.5 };
		same(shearOf(ne), { re: 0, im: -3 });
		same(turnShear(shearOf(ne), Math.PI / 4), { re: -3, im: 0 });
		const t = turned(ne, Math.PI / 4);
		close(t.a, -2);
		close(t.b, 0, 12);
		close(t.d, 1);
		// a turn by 30° multiplies the shear by e^(−iπ/3)
		same(turnShear({ re: 1, im: 0 }, 30 * DEGREE), { re: 0.5, im: -Math.sqrt(3) / 2 });
	});

	it('sends s to −s at a quarter turn, and back to s at a half turn, where v is −v', () => {
		for (const t of tables.slice(0, 50)) {
			const s = shearOf(t);
			same(turnShear(s, Math.PI / 2), { re: -s.re, im: -s.im }, 12);
			same(turnShear(s, Math.PI), s, 12);
			same(turnShear(s, Math.PI / 4), { re: s.im, im: -s.re }, 12);
		}
		same(turnArrow(ARROW, Math.PI), { re: -ARROW.re, im: -ARROW.im });
		same(turnArrow(ARROW, Math.PI / 2), { re: ARROW.im, im: -ARROW.re });
		expect(at(90, QUARTER)).toBe(true);
		expect(at(90.4, QUARTER)).toBe(true);
		expect(at(91, QUARTER)).toBe(false);
		expect(at(180, HALF)).toBe(true);
		expect(at(359.8, 0)).toBe(true);
	});
});

describe('the table drawn from a shear', () => {
	it('has no trace and gives back its shear', () => {
		for (let k = 0; k < 100; k++) {
			const s = { re: entry(4), im: entry(4) };
			const t = tableOf(s);
			close(t.a + t.d, 0);
			same(shearOf(t), s);
			same(shearOf(tableOf(s, 0.7)), s);
		}
	});

	it('opens on s = 2: a squeeze along x and a stretch along y, each of size |s|/2', () => {
		const [p, q] = principal(tableOf(SHEAR));
		expect(p.value).toBe(-1);
		expect(q.value).toBe(1);
		expect(p.axis).toEqual({ x: 0, y: 1 });
		expect(q.axis).toEqual({ x: 1, y: 0 });
		close(argument(ARROW), 30);
		close(modulus(ARROW), 1);
	});

	it('puts the squeeze axis at half the argument of s, whatever s', () => {
		for (let k = 0; k < 100; k++) {
			const s = { re: entry(4), im: entry(4) };
			const [, squeeze] = principal(tableOf(s));
			close(squeeze.value, modulus(s) / 2, 12);
			const half = argument(s) / 2;
			const axis = (Math.atan2(squeeze.axis.y, squeeze.axis.x) * 180) / Math.PI;
			// an axis has no head: equal up to a half turn
			close(Math.abs(Math.sin(((axis - half) * Math.PI) / 180)), 0, 9);
		}
	});

	it('looks the same after a half turn: the ball at φ + 180° is the ball at φ, turned', () => {
		const t = tableOf({ re: 0.8, im: -1.3 });
		for (let k = 0; k < 12; k++) {
			const phi = (k * Math.PI) / 6;
			const p = displaced(t, Math.cos(phi), Math.sin(phi), 0.25);
			const q = displaced(t, Math.cos(phi + Math.PI), Math.sin(phi + Math.PI), 0.25);
			close(q.x, -p.x);
			close(q.y, -p.y);
		}
	});
});

describe('the dial', () => {
	it('reads a pointer’s bearing anticlockwise, with y down the screen', () => {
		close(bearing(1, 0), 0);
		close(bearing(0, -1), 90);
		close(Math.abs(bearing(-1, 0)), 180);
		close(bearing(0, 1), -90);
	});

	it('follows the pointer, or turns the picture with it when the axes are held', () => {
		expect(dragged(0, 0, 30, 1)).toBe(30);
		expect(dragged(0, 0, 30, -1)).toBe(330);
		expect(dragged(350, 170, -170, 1)).toBe(10);
		expect(dragged(10, -170, 170, 1)).toBe(350);
		expect(dragged(45.4, 0, 0, 1)).toBe(45);
		for (let k = 0; k < 100; k++) {
			const d = dragged(360 * next(), entry(180), entry(180), next() < 0.5 ? 1 : -1);
			expect(d).toBeGreaterThanOrEqual(0);
			expect(d).toBeLessThan(360);
			expect(Number.isInteger(d)).toBe(true);
		}
	});

	it('wraps angles', () => {
		expect(wrap(-30)).toBe(330);
		expect(wrap(720)).toBe(0);
		expect(principalAngle(270)).toBe(-90);
		expect(principalAngle(180)).toBe(180);
		expect(principalAngle(-180)).toBe(180);
	});
});

describe('a rotor’s wave', () => {
	it('has the paper’s amplitudes: equal face on, h× = 0 edge on, (0.625, 0.5) at 60°', () => {
		const face = rotor(0);
		expect(face).toEqual({ plus: 1, cross: 1 });
		const edge = rotor(Math.PI / 2);
		close(edge.plus, 0.5);
		close(edge.cross, 0, 15);
		const sixty = rotor(60 * DEGREE);
		close(sixty.plus, 0.625);
		close(sixty.cross, 0.5);
		const r = circles(60 * DEGREE, 1);
		close(r.with, 0.5625);
		close(r.against, 0.0625);
		expect(circular(60 * DEGREE).toFixed(2)).toBe('0.98');
		close(circular(0), 1);
		close(circular(Math.PI / 2), 0, 15);
	});

	it('is the sum of two circles turning opposite ways', () => {
		for (let k = 0; k < 200; k++) {
			const iota = (Math.PI / 2) * next();
			const x = entry(10);
			const [p, q] = parts(iota, x);
			same(add(p, q), rotorShear(iota, x));
		}
	});

	it('keeps its size and turns at 2Ω face on, and swings along the real axis edge on', () => {
		for (const x of [0, 0.4, 1, 2.5, 4]) {
			const s = rotorShear(0, x);
			close(modulus(s), modulus(SHEAR));
			close(argument(s), principalAngle((x * 180) / Math.PI), 9);
			close(rotorShear(Math.PI / 2, x).im, 0, 15);
		}
		same(rotorShear(0.7, 0), { re: modulus(SHEAR) * rotor(0.7).plus, im: 0 });
	});
});

describe('the numbers', () => {
	it('are written with a true minus sign and never as −0.00', () => {
		expect(signed(-0.001)).toBe('0.00');
		expect(signed(-1.5)).toBe('−1.50');
		expect(complexTex({ re: 1.4142, im: -1.4142 })).toBe('1.41 - 1.41\\,i');
		expect(complexTex({ re: -0.0001, im: 0.0001 })).toBe('0.00 + 0.00\\,i');
		expect(complexTex({ re: -2, im: 0.5 })).toBe('-2.00 + 0.50\\,i');
		expect(angleText(-0.2)).toBe('0');
		expect(angleText(-179.7)).toBe('180');
		expect(angleText(-90)).toBe('-90');
		expect(angleText(400)).toBe('40');
	});
});
