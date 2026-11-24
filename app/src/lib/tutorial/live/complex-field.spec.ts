/**
 * Chapter 6.6's complex field: the figure's model against the textbook transformation of the fields and the field
 * tensor, and against every number the chapter's specification of the figure asks for: E′ₓ = 1.25E and
 * cB′_y = −0.75E at 0.6c along z, the Hermitian length 1 → 2.125 while F·F stays 1; the parallel frame
 * e^{2η} = |f|/|g| = 3, β = ½, E′ = (0.866, 0, 0); a wave's a′ = e^{∓η}a; the quadratic's roots, z = 0.9i ± 0.436
 * for the charge at 0.9c; and when each prediction is answered.
 */
import { describe, expect, it } from 'vitest';
import {
	AXES,
	CHARGE,
	CROSSED,
	HALF_LN3,
	K,
	LN2,
	NAMED,
	OPENING,
	RAPIDITY,
	acrossFound,
	amplitude,
	boostAxis,
	boostField,
	cabs,
	cmul,
	complexOf,
	complexWords,
	conj,
	cross,
	cx,
	direction,
	dot,
	etaWords,
	fieldOf,
	hermitian,
	invariants,
	keyed,
	landed,
	norm,
	nullVector,
	parallel,
	parallelFound,
	parallelFrame,
	principal,
	principalDirections,
	quadratic,
	reading,
	restField,
	square,
	stereo,
	three,
	turnField,
	turnVector,
	twentieth,
	unit,
	velocity,
	waveAmplitude,
	waveField,
	waveFound,
	withComponent,
	zOf,
	type C,
	type Field,
	type Setup,
	type V3
} from './complex-field';

// --- helpers -------------------------------------------------------------------------------------------------------

/** A small seeded generator, so that the random cases are the same on every run. */
function rng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}
const rand = rng(20261123);
const between = (lo: number, hi: number) => lo + (hi - lo) * rand();
const randomVec = (r = 2): V3 => [between(-r, r), between(-r, r), between(-r, r)];
const randomUnit = (): V3 => unit(randomVec(1));
const randomField = (): Field => ({ E: randomVec(), B: randomVec() });

const close = (a: number, b: number, tol = 1e-12) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const closeVec = (a: V3, b: V3, tol = 1e-12) => a.forEach((v, i) => close(v, b[i], tol));
const closeC = (a: C, b: C, tol = 1e-12) => {
	close(a.re, b.re, tol);
	close(a.im, b.im, tol);
};
const closeField = (a: Field, b: Field, tol = 1e-12) => {
	closeVec(a.E, b.E, tol);
	closeVec(a.B, b.B, tol);
};

/** The complex dot product without conjugates, a·b. */
const cdot = (a: C[], b: C[]) =>
	a.reduce((s, ai, i) => {
		const p = cmul(ai, b[i]);
		return { re: s.re + p.re, im: s.im + p.im };
	}, cx(0));

/** Jackson's (11.149): E′ = γ(E + β × cB) − γ²/(γ + 1) β(β·E), cB′ = γ(cB − β × E) − γ²/(γ + 1) β(β·cB). */
function textbook(f: Field, u: V3, eta: number): Field {
	const beta = Math.tanh(eta);
	const g = Math.cosh(eta);
	const b: V3 = [beta * u[0], beta * u[1], beta * u[2]];
	const k = (g * g) / (g + 1);
	const one = (v: V3, w: V3, sign: number): V3 => {
		const c = cross(b, w);
		const bv = dot(b, v);
		return [0, 1, 2].map((i) => g * (v[i] + sign * c[i]) - k * b[i] * bv) as V3;
	};
	return { E: one(f.E, f.B, 1), B: one(f.B, f.E, -1) };
}

/**
 * The field tensor of the chapter, F^{0i} = E_i/c and F^{ij} = ε_ijk B_k (with c = 1, so B is cB), carried by the
 * 4 × 4 boost Λ^μ_ν of a sensor moving at β û: F′ = Λ F Λᵀ.
 */
function tensorBoost(f: Field, u: V3, eta: number): Field {
	const g = Math.cosh(eta);
	const gb = Math.sinh(eta);
	const L = [...Array(4)].map(() => Array(4).fill(0));
	L[0][0] = g;
	for (let i = 0; i < 3; i++) {
		L[0][i + 1] = -gb * u[i];
		L[i + 1][0] = -gb * u[i];
		for (let j = 0; j < 3; j++) L[i + 1][j + 1] = (i === j ? 1 : 0) + (g - 1) * u[i] * u[j];
	}
	const [Ex, Ey, Ez] = f.E;
	const [Bx, By, Bz] = f.B;
	const T = [
		[0, Ex, Ey, Ez],
		[-Ex, 0, Bz, -By],
		[-Ey, -Bz, 0, Bx],
		[-Ez, By, -Bx, 0]
	];
	const P = [...Array(4)].map(() => Array(4).fill(0));
	for (let m = 0; m < 4; m++)
		for (let n = 0; n < 4; n++)
			for (let a = 0; a < 4; a++)
				for (let b = 0; b < 4; b++) P[m][n] += L[m][a] * L[n][b] * T[a][b];
	return { E: [P[0][1], P[0][2], P[0][3]], B: [P[2][3], P[3][1], P[1][2]] };
}

const setup = (over: Partial<Setup>): Setup => ({ ...OPENING, ...over });

// --- the boost -----------------------------------------------------------------------------------------------------

describe('the boost', () => {
	it('is eq:boost-EB along x', () => {
		for (let n = 0; n < 20; n++) {
			const f = randomField();
			const eta = between(-2, 2);
			const c = Math.cosh(eta);
			const s = Math.sinh(eta);
			const b = boostField(f, AXES.x, eta);
			close(b.E[0], f.E[0]);
			close(b.B[0], f.B[0]);
			close(b.E[1], c * f.E[1] - s * f.B[2], 1e-11);
			close(b.B[2], c * f.B[2] - s * f.E[1], 1e-11);
			close(b.E[2], c * f.E[2] + s * f.B[1], 1e-11);
			close(b.B[1], c * f.B[1] + s * f.E[2], 1e-11);
		}
	});

	it('agrees with the textbook transformation and with the field tensor, for random fields and boosts', () => {
		for (let n = 0; n < 200; n++) {
			const f = randomField();
			const u = randomUnit();
			const eta = between(-2, 2);
			const ours = boostField(f, u, eta);
			closeField(ours, textbook(f, u, eta), 1e-10);
			closeField(ours, tensorBoost(f, u, eta), 1e-10);
		}
	});

	it('is the complex rule F′⊥ = cosh η F⊥ − i sinh η û × F', () => {
		for (let n = 0; n < 50; n++) {
			const f = randomField();
			const u = randomUnit();
			const eta = between(-2, 2);
			const F = complexOf(f);
			const along = cdot(
				F,
				u.map((v) => cx(v))
			);
			// û × F, component by component, for complex F
			const uxF = [0, 1, 2].map((i) => {
				const j = (i + 1) % 3;
				const k = (i + 2) % 3;
				return {
					re: u[j] * F[k].re - u[k] * F[j].re,
					im: u[j] * F[k].im - u[k] * F[j].im
				};
			});
			const want = [0, 1, 2].map((i) => {
				const perp = { re: F[i].re - along.re * u[i], im: F[i].im - along.im * u[i] };
				const minusI = { re: uxF[i].im, im: -uxF[i].re };
				return {
					re: along.re * u[i] + Math.cosh(eta) * perp.re + Math.sinh(eta) * minusI.re,
					im: along.im * u[i] + Math.cosh(eta) * perp.im + Math.sinh(eta) * minusI.im
				};
			});
			complexOf(boostField(f, u, eta)).forEach((c, i) => closeC(c, want[i], 1e-10));
		}
	});

	it('gives the chapter’s 0.6c: E′ₓ = 1.25E and cB′_y = −0.75E along z, Hermitian 1 → 2.125', () => {
		const b = boostField(CHARGE, AXES.z, LN2);
		expect(b.E).toEqual([1.25, 0, 0]);
		expect(b.B).toEqual([0, -0.75, 0]);
		expect(hermitian(CHARGE)).toBe(1);
		expect(hermitian(b)).toBe(2.125);
		expect(invariants(b)).toEqual({ difference: 1, product: 0 });
		// along y the magnetic field appears along z instead
		const y = boostField(CHARGE, AXES.y, LN2);
		expect(y.E).toEqual([1.25, 0, 0]);
		expect(y.B).toEqual([0, 0, 0.75]);
	});

	it('gives the check question’s 0.8c along y: F′ = (5, 0, 4i)', () => {
		const b = boostField({ E: [3, 0, 0], B: [0, 0, 0] }, AXES.y, Math.atanh(0.8));
		closeVec(b.E, [5, 0, 0], 1e-12);
		closeVec(b.B, [0, 0, 4], 1e-12);
	});

	it('makes the chapter’s two boosts at 0.6c, x then the first sensor’s y, into its P', () => {
		const column = (j: number) =>
			complexOf(
				boostField(
					boostField({ E: AXES[(['x', 'y', 'z'] as const)[j]], B: [0, 0, 0] }, AXES.x, LN2),
					AXES.y,
					LN2
				)
			);
		const P = [0, 1, 2].map(column);
		// columns of P = rows of the chapter's table transposed
		const want: C[][] = [
			[cx(1.25), cx(0), cx(0, 0.75)],
			[cx(-0.5625), cx(1.25), cx(0, -0.9375)],
			[cx(0, -0.9375), cx(0, 0.75), cx(1.5625)]
		];
		P.forEach((col, j) => col.forEach((c, i) => closeC(c, want[j][i], 1e-12)));
	});

	it('undoes itself with the opposite rapidity', () => {
		for (let n = 0; n < 20; n++) {
			const f = randomField();
			const u = randomUnit();
			const eta = between(-2, 2);
			closeField(boostField(boostField(f, u, eta), u, -eta), f, 1e-10);
		}
	});
});

// --- what is kept ----------------------------------------------------------------------------------------------------

describe('what every observer agrees on', () => {
	it('keeps F·F under boosts and turns', () => {
		for (let n = 0; n < 200; n++) {
			const f = randomField();
			const before = square(f);
			const b = boostField(f, randomUnit(), between(-2, 2));
			closeC(square(b), before, 1e-9 * Math.max(1, cabs(before)) + 1e-9);
			const t = turnField(f, randomUnit(), between(-180, 180));
			closeC(square(t), before, 1e-10);
		}
	});

	it('is F·F = E² − c²B² + 2icE·B', () => {
		const f = randomField();
		const F = complexOf(f);
		closeC(cdot(F, F), square(f), 1e-12);
		const inv = invariants(f);
		closeC(square(f), cx(inv.difference, 2 * inv.product), 1e-12);
	});

	it('keeps the Hermitian length under turns but not boosts: Λ†Λ is the boost by 2η', () => {
		for (let n = 0; n < 50; n++) {
			const f = randomField();
			const u = randomUnit();
			const eta = between(-2, 2);
			close(hermitian(turnField(f, u, between(-180, 180))), hermitian(f), 1e-10);
			const once = complexOf(boostField(f, u, eta));
			const twice = complexOf(boostField(f, u, 2 * eta));
			// F′*·F′ = F*·(Λ² F), with Λ Hermitian
			const lhs = cdot(once.map(conj), once);
			const rhs = cdot(complexOf(f).map(conj), twice);
			closeC(lhs, rhs, 1e-8 * Math.max(1, cabs(rhs)));
		}
	});

	it('turns an arrow as the chapter’s turn of the axes about z', () => {
		const v: V3 = [0.3, -0.7, 0.2];
		const t = turnVector(v, AXES.z, 30);
		const c = Math.cos(Math.PI / 6);
		const s = Math.sin(Math.PI / 6);
		closeVec(t, [v[0] * c + v[1] * s, -v[0] * s + v[1] * c, v[2]], 1e-15);
		expect(turnVector([1, 0, 0], AXES.z, 90)).toEqual([0, -1, 0]);
	});

	it('is a boost by an imaginary angle: the turn’s rule with cos(iη) and sin(iη)', () => {
		// the same arithmetic in complex form: cos θ F⊥ − sin θ û × F at θ = iη
		const f = randomField();
		const eta = 0.8;
		const b = complexOf(boostField(f, AXES.x, eta));
		const F = complexOf(f);
		const cosI = cx(Math.cosh(eta));
		const sinI = cx(0, Math.sinh(eta));
		// û = x̂: û × F = (0, −F_z, F_y), so F′_y = cos(iη) F_y + sin(iη) F_z
		const want = cmul(cosI, F[1]);
		const more = cmul(sinI, F[2]);
		closeC(b[1], { re: want.re + more.re, im: want.im + more.im }, 1e-12);
	});
});

// --- the parallel frame ----------------------------------------------------------------------------------------------

describe('the parallel frame', () => {
	it('is the chapter’s example: f = 1.5/√2, g = 0.5/√2, e^{2η} = 3, β = ½, E′ = (0.866, 0, 0)', () => {
		const p = parallelFrame(CROSSED)!;
		closeC(p.f, cx(1.5 / Math.SQRT2), 1e-15);
		closeC(p.g, cx(0.5 / Math.SQRT2), 1e-15);
		close(Math.exp(2 * p.eta), 3, 1e-14);
		close(p.beta, 0.5, 1e-15);
		closeVec(p.u, [0, 0, 1], 0);
		const b = boostField(CROSSED, p.u, p.eta);
		closeVec(b.E, [Math.sqrt(3) / 2, 0, 0], 1e-15);
		closeVec(b.B, [0, 0, 0], 1e-15);
		close(square(b).re, 0.75, 1e-15);
		expect(three(b.E[0])).toBe('0.866');
	});

	it('makes the fields parallel for random fields, along E × B, with F·F = 2fg', () => {
		for (let n = 0; n < 100; n++) {
			const f = randomField();
			const p = parallelFrame(f)!;
			expect(p.eta).toBeGreaterThan(0);
			expect(dot(p.u, cross(f.E, f.B))).toBeGreaterThan(0);
			closeC(cmul(cx(2), cmul(p.f, p.g)), square(f), 1e-10);
			const b = boostField(f, p.u, p.eta);
			expect(norm(cross(b.E, b.B))).toBeLessThan(1e-9 * hermitian(b));
			expect(parallel(b)).toBe(true);
		}
	});

	it('does not exist for a null field, nor for fields already parallel', () => {
		expect(parallelFrame(waveField(cx(1, 0.4)))).toBeUndefined();
		expect(parallelFrame(CHARGE)).toBeUndefined();
		expect(parallelFrame({ E: [1, 0, 0], B: [0.6, 0, 0] })).toBeUndefined();
	});

	it('hides a boost along its axis: in the parallel frame it changes nothing', () => {
		const p = parallelFrame(CROSSED)!;
		const there = boostField(CROSSED, p.u, p.eta);
		for (const eta of [-1.3, 0.4, LN2, 2]) closeField(boostField(there, AXES.x, eta), there, 1e-15);
		closeField(turnField(there, AXES.x, 70), there, 1e-15);
	});
});

// --- the plane wave --------------------------------------------------------------------------------------------------

describe('the plane wave', () => {
	it('is F = a m, null, with cB = k̂ × E', () => {
		for (const phase of [0, 30, 135, 270]) {
			const a = waveAmplitude(phase);
			const f = waveField(a);
			close(cabs(square(f)), 0, 1e-15);
			closeVec(f.B, cross(K, f.E), 1e-15);
			close(hermitian(f), cabs(a) ** 2, 1e-15);
			closeC(amplitude(f)!.a, a, 1e-15);
		}
		const f = waveField(waveAmplitude(0));
		closeVec(f.E, [1, 0, 0], 1e-15);
		closeVec(f.B, [0, 1, 0], 1e-15);
	});

	it('gives a′ = e^{−η}a running with the wave and e^{η}a against it', () => {
		for (let n = 0; n < 30; n++) {
			const a = cx(between(-2, 2), between(-2, 2));
			const eta = between(-2, 2);
			const f = waveField(a);
			const withIt = amplitude(boostField(f, K, eta))!;
			closeC(withIt.a, { re: Math.exp(-eta) * a.re, im: Math.exp(-eta) * a.im }, 1e-11);
			closeVec(withIt.k, K, 1e-12);
			const against = amplitude(boostField(f, [0, 0, -1], eta))!;
			closeC(against.a, { re: Math.exp(eta) * a.re, im: Math.exp(eta) * a.im }, 1e-11);
		}
	});

	it('halves at 0.6c with the wave, a quarter of the energy, and turns its phase under a turn about k̂', () => {
		const a = waveAmplitude(0);
		const b = amplitude(boostField(waveField(a), K, LN2))!;
		expect(b.a.re).toBe(a.re / 2);
		close(b.a.im, 0, 0);
		expect(cabs(b.a) ** 2 / cabs(a) ** 2).toBe(0.25);
		const t = amplitude(turnField(waveField(a), K, 40))!;
		const e = { re: Math.cos((40 * Math.PI) / 180), im: Math.sin((40 * Math.PI) / 180) };
		closeC(t.a, cmul(e, a), 1e-15);
	});

	it('keeps one double direction, along its travel, for every sensor', () => {
		for (let n = 0; n < 30; n++) {
			const f = boostField(waveField(waveAmplitude(between(0, 360))), randomUnit(), between(-2, 2));
			const d = principalDirections(f)!;
			expect(d.double).toBe(true);
			expect(d.dirs).toHaveLength(1);
			closeVec(d.dirs[0].n, unit(cross(f.E, f.B)), 1e-8);
		}
		const d = principalDirections(waveField(waveAmplitude(0)))!;
		closeVec(d.dirs[0].n, [0, 0, 1], 1e-15);
	});
});

// --- light's two directions --------------------------------------------------------------------------------------------

describe('the principal null directions', () => {
	it('uses the paper’s null vector m(z), null and of Hermitian length 2(1 + |z|²)², along n̂(z)', () => {
		for (let n = 0; n < 30; n++) {
			const z = cx(between(-2, 2), between(-2, 2));
			const m = nullVector(z);
			close(cabs(cdot(m, m)), 0, 1e-12);
			const len = cdot(m.map(conj), m);
			close(len.re, 2 * (1 + cabs(z) ** 2) ** 2, 1e-10);
			// n̂(z) = i m × m*/|m|²: from the real and imaginary parts, i m × m* = 2 Re m × Im m
			const re: V3 = m.map((c) => c.re) as V3;
			const im: V3 = m.map((c) => c.im) as V3;
			const k = unit(cross(re, im));
			closeVec(k, direction({ p: z, q: cx(1) }), 1e-12);
			closeC(stereo(direction({ p: z, q: cx(1) }))!, z, 1e-10);
		}
	});

	it('solves m(z)·F = 0, the chapter’s quadratic, for random fields', () => {
		for (let n = 0; n < 100; n++) {
			const f = randomField();
			const { A, B, C: c } = quadratic(f);
			const d = principal(f)!;
			expect(d.double).toBe(false);
			expect(d.roots).toHaveLength(2);
			for (const r of d.roots) {
				const z = zOf(r)!;
				const val = cdot(nullVector(z), complexOf(f));
				expect(cabs(val)).toBeLessThan(1e-9 * (1 + cabs(z) ** 2) * norm([1, 1, 1]) * 4);
				// A z² + B z + C = 0 too
				const poly = [cmul(A, cmul(z, z)), cmul(B, z), c].reduce((s, t) => ({
					re: s.re + t.re,
					im: s.im + t.im
				}));
				expect(cabs(poly)).toBeLessThan(1e-9 * (1 + cabs(z) ** 2) * 8);
			}
			// a quarter of the discriminant is F·F
			const disc = { re: cmul(B, B).re - 4 * cmul(A, c).re, im: cmul(B, B).im - 4 * cmul(A, c).im };
			closeC({ re: disc.re / 4, im: disc.im / 4 }, square(f), 1e-10);
		}
	});

	it('moves with the sensor: the directions of a boosted field are the roots of its own quadratic', () => {
		const f = randomField();
		const b = boostField(f, randomUnit(), 1.1);
		const d = principalDirections(b)!;
		for (const dir of d.dirs) {
			const z = stereo(dir.n)!;
			expect(cabs(cdot(nullVector(z), complexOf(b)))).toBeLessThan(1e-8);
		}
	});

	it('points along ±x for the opening charge, and 0 and ∞ for a charge along z', () => {
		const d = principalDirections(CHARGE)!;
		const xs = d.dirs.map((q) => q.n[0]).sort();
		expect(xs).toEqual([-1, 1]);
		d.dirs.forEach((q) => closeVec(q.n, [q.n[0], 0, 0], 1e-15));
		const zd = principalDirections({ E: [0, 0, 1], B: [0, 0, 0] })!;
		const zs = zd.dirs.map((q) => q.z);
		expect(zs.filter((z) => z === undefined)).toHaveLength(1);
		closeC(
			zs.find((z) => z !== undefined)!,
			cx(0),
			1e-15
		);
		const ns = zd.dirs.map((q) => q.n[2]).sort();
		expect(ns).toEqual([-1, 1]);
	});

	it('folds toward the motion for the charge at 0.9c: z = 0.9i ± 0.436, n̂ = (±0.436, 0.9, 0)', () => {
		const f: Field = { E: [-1, 0, 0], B: [0, 0, 0.9] };
		const { A, B, C: c } = quadratic(f);
		closeC(A, cx(1), 0);
		closeC(B, cx(0, -1.8), 1e-15);
		closeC(c, cx(-1), 0);
		const d = principalDirections(f)!;
		const zs = d.dirs.map((q) => q.z!).sort((p, q) => p.re - q.re);
		const s = Math.sqrt(1 - 0.81);
		closeC(zs[0], cx(-s, 0.9), 1e-14);
		closeC(zs[1], cx(s, 0.9), 1e-14);
		expect(three(s)).toBe('0.436');
		zs.forEach((z) => close(cabs(z), 1, 1e-14));
		const ns = d.dirs.map((q) => q.n).sort((p, q) => p[0] - q[0]);
		closeVec(ns[0], [-s, 0.9, 0], 1e-14);
		closeVec(ns[1], [s, 0.9, 0], 1e-14);
		// half sum: the velocity across the line over c; half difference along the line, of length √(1 − 0.9²)
		closeVec(ns[0].map((v, i) => (v + ns[1][i]) / 2) as V3, [0, 0.9, 0], 1e-14);
		close(norm(ns[1].map((v, i) => (v - ns[0][i]) / 2) as V3), s, 1e-14);
		// and it is the boost of the charge at rest at +x, read by a sensor moving at −0.9c along y
		const b = boostField({ E: [-1, 0, 0], B: [0, 0, 0] }, [0, -1, 0], Math.atanh(0.9));
		const g = b.E[0] / -1;
		closeVec(b.E, [-g, 0, 0], 1e-12);
		closeVec(b.B, [0, 0, 0.9 * g], 1e-12);
	});
});

// --- the figure ------------------------------------------------------------------------------------------------------

describe('the figure’s settings', () => {
	it('opens on the charge at rest, read by a sensor at rest', () => {
		expect(OPENING.mode).toBe('static');
		expect(OPENING.eta).toBe(0);
		expect(reading(OPENING)).toEqual(CHARGE);
		expect(velocity(OPENING)).toEqual([0, 0, 0]);
	});

	it('boosts along E × B of the field at rest, and along z when that is zero', () => {
		expect(boostAxis(setup({ rest: CROSSED, direction: 'flow' }))).toEqual({
			u: [0, 0, 1],
			fallback: false
		});
		expect(boostAxis(setup({ direction: 'flow' }))).toEqual({ u: [0, 0, 1], fallback: true });
		closeVec(boostAxis(setup({ mode: 'wave', direction: 'flow', phase: 77 })).u, [0, 0, 1], 1e-15);
	});

	it('reads the boost first and then the turned axes', () => {
		const s = setup({ eta: LN2, direction: 'z', turnAxis: 'z', turn: 90 });
		// (1.25, −0.75i, 0) read in axes turned a quarter turn about z: x′ = y, y′ = −x
		const f = reading(s);
		closeVec(f.E, [0, -1.25, 0], 0);
		closeVec(f.B, [-0.75, 0, 0], 0);
		closeVec(velocity(s), [0, 0, 0.6], 1e-15);
	});

	it('reads the wave at its phase in the wave mode', () => {
		expect(restField(setup({ mode: 'wave', phase: 0 }))).toEqual(waveField(cx(Math.SQRT2, 0)));
	});

	it('sets the sliders’ fields on twentieths', () => {
		expect(twentieth(-1 + 30 * 0.05)).toBe(0.5);
		expect(twentieth(0.4999999)).toBe(0.5);
		expect(withComponent(CHARGE, 'B', 1, 0.5)).toEqual(CROSSED);
	});

	it('lands the rapidity on rest, ±ln 2, ±½ ln 3 and ±ln 4, and steps it by 0.05', () => {
		expect(landed(0.69)).toBe(LN2);
		expect(landed(0.55)).toBe(HALF_LN3);
		expect(landed(0.54)).toBe(0.54);
		expect(landed(-3)).toBe(RAPIDITY.min);
		expect(keyed(0.65, 1)).toBe(LN2);
		expect(keyed(LN2, 1)).toBe(0.75);
		expect(keyed(0.5, 1)).toBe(HALF_LN3);
		expect(keyed(HALF_LN3, -1)).toBe(0.5);
		expect(NAMED).toContain(-LN2);
		expect(etaWords(LN2)).toBe('ln 2 = 0.693');
		expect(etaWords(-HALF_LN3)).toBe('−½ ln 3 = −0.549');
		expect(etaWords(2 * LN2)).toBe('ln 4 = 1.39');
		expect(etaWords(0)).toBe('0');
		expect(etaWords(0.3)).toBe('0.300');
	});

	it('writes complex numbers to three figures', () => {
		expect(complexWords(cx(1.25, -0.75))).toBe('1.25 − 0.750i');
		expect(complexWords(cx(0, 0.75))).toBe('0.750i');
		expect(complexWords(cx(0, -1))).toBe('−i');
		expect(complexWords(cx(1, 0))).toBe('1.00');
		expect(complexWords(cx(0, 0))).toBe('0');
		expect(complexWords(complexOf(CROSSED)[0])).toBe('1.00');
		expect(complexWords(cx(1, 0.5))).toBe('1.00 + 0.500i');
		expect(fieldOf(complexOf(CROSSED))).toEqual(CROSSED);
	});
});

describe('the predictions', () => {
	it('answers the first once the sensor at rest in the charge’s field is boosted across it at 0.6c', () => {
		expect(acrossFound(OPENING)).toBeUndefined();
		const z = acrossFound(setup({ eta: LN2 }))!;
		expect(z.reading).toEqual({ E: [1.25, 0, 0], B: [0, -0.75, 0] });
		expect(z.hermitian).toBe(2.125);
		expect(z.difference).toBe(1);
		expect(z.product).toBe(0);
		expect(acrossFound(setup({ eta: -LN2, direction: 'y' }))!.reading.B).toEqual([0, 0, -0.75]);
		expect(acrossFound(setup({ eta: LN2, direction: 'flow' }))).toBeDefined();
		// along the field, at another speed, turned, or with another field: not yet
		expect(acrossFound(setup({ eta: LN2, direction: 'x' }))).toBeUndefined();
		expect(acrossFound(setup({ eta: 0.7 }))).toBeUndefined();
		expect(acrossFound(setup({ eta: LN2, turn: 10 }))).toBeUndefined();
		expect(acrossFound(setup({ eta: LN2, rest: CROSSED }))).toBeUndefined();
		expect(acrossFound(setup({ eta: LN2, mode: 'wave' }))).toBeUndefined();
	});

	it('answers the second once the crossed fields are boosted until they lie along one line', () => {
		expect(parallelFound(setup({ rest: CROSSED }))).toBeUndefined();
		const found = parallelFound(setup({ rest: CROSSED, eta: HALF_LN3 }))!;
		close(found.beta, 0.5, 1e-15);
		closeVec(found.reading.E, [Math.sqrt(3) / 2, 0, 0], 1e-15);
		expect(parallelFound(setup({ rest: CROSSED, eta: HALF_LN3, direction: 'flow' }))).toBeDefined();
		expect(parallelFound(setup({ rest: CROSSED, eta: -HALF_LN3, direction: 'z' }))).toBeUndefined();
		expect(parallelFound(setup({ rest: CROSSED, eta: 0.54 }))).toBeUndefined();
		expect(parallelFound(setup({ rest: CROSSED, eta: HALF_LN3, direction: 'x' }))).toBeUndefined();
		// a turn does not spoil it
		expect(
			parallelFound(setup({ rest: CROSSED, eta: HALF_LN3, turnAxis: 'y', turn: 35 }))
		).toBeDefined();
		// the charge's own field is parallel already, but that is not the task
		expect(parallelFound(setup({ eta: LN2, direction: 'x' }))).toBeUndefined();
	});

	it('then a boost along the common axis, x, changes nothing', () => {
		const found = parallelFound(setup({ rest: CROSSED, eta: HALF_LN3 }))!;
		const next = setup({ rest: found.reading, eta: 1.3, direction: 'x' });
		closeField(reading(next), found.reading, 1e-15);
	});

	it('answers the third once the reader runs with the wave at 0.6c: a halves, a quarter of the energy', () => {
		expect(waveFound(setup({ mode: 'wave' }))).toBeUndefined();
		const w = waveFound(setup({ mode: 'wave', eta: LN2 }))!;
		expect(w.factor).toBe(0.5);
		expect(w.energy).toBe(0.25);
		expect(
			waveFound(setup({ mode: 'wave', eta: LN2, direction: 'flow', phase: 60 }))!.factor
		).toBeCloseTo(0.5, 14);
		expect(waveFound(setup({ mode: 'wave', eta: -LN2 }))).toBeUndefined();
		expect(waveFound(setup({ mode: 'wave', eta: LN2, direction: 'x' }))).toBeUndefined();
		expect(waveFound(setup({ eta: LN2 }))).toBeUndefined();
	});
});
