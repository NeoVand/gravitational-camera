/**
 * Chapter 6.5's table T^{μν}: the figure's model against the chapter's numbers. Each content's table; the boost by
 * 6.2's rule against a direct product Λ T Λᵀ for random boosts; the trace the same for every observer; the beam's
 * e^{−2η}, ¼ at 0.6c along itself; the bound contents' stresses adding up to zero; T_{μν}k^μk^ν of each content along
 * ±z (ρc² + p for a fluid, 0 and 4F/c for the beam, 4u < 0 along the Casimir plates' normal); and when each
 * prediction is answered.
 */
import { describe, expect, it } from 'vitest';
import {
	ALONG,
	BOOST,
	CASIMIR_U,
	CONTENTS,
	GAS_P,
	LN2,
	OPENING,
	ORDER,
	alongRay,
	alongRayFull,
	blockOf,
	boostMatrix,
	boosted,
	etaTex,
	etaWords,
	firstDone,
	frameWords,
	hundredths,
	integrated,
	keyed,
	ownIntegral,
	partSums,
	secondAnswer,
	secondDone,
	shrink,
	signOf,
	source,
	speed,
	strength,
	tableOf,
	tableWords,
	three,
	trace,
	two,
	type Content,
	type Direction,
	type Table
} from './stress-energy-table';

/** The direct product Λ T Λᵀ, sixteen sums of sixteen terms, written independently of the module's rule. */
function product(L: Table, T: Table): Table {
	const out: Table = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
	for (let m = 0; m < 4; m++)
		for (let n = 0; n < 4; n++) {
			let s = 0;
			for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) s += L[m][a] * L[n][b] * T[a][b];
			out[m][n] = s;
		}
	return out;
}

/** A small deterministic generator, so that the random boosts are the same at every run. */
function generator(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

const randomSymmetric = (next: () => number): Table => {
	const t: Table = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
	for (let i = 0; i < 4; i++)
		for (let j = i; j < 4; j++) {
			const v = 4 * next() - 2;
			t[i][j] = v;
			t[j][i] = v;
		}
	return t;
};

const close = (a: Table, b: Table, tol: number) => {
	for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) expect(a[i][j]).toBeCloseTo(b[i][j], tol);
};

const maxDiff = (a: Table, b: Table) =>
	Math.max(...a.flatMap((row, i) => row.map((v, j) => Math.abs(v - b[i][j]))));

const symmetric = (t: Table) => t.every((row, i) => row.every((v, j) => v === t[j][i]));

describe('the speeds', () => {
	it('gives γ, γβ and η = artanh β', () => {
		for (const beta of [-0.9, -0.37, 0, 0.21, 0.85]) {
			const s = speed(beta);
			expect(s.gamma).toBeCloseTo(1 / Math.sqrt(1 - beta * beta), 14);
			expect(s.gammaBeta).toBeCloseTo(beta / Math.sqrt(1 - beta * beta), 14);
			expect(s.eta).toBeCloseTo(Math.atanh(beta), 14);
		}
	});

	it('is exact at 0.6c: γ = 5/4, γβ = 3/4, η = ln 2', () => {
		expect(speed(0.6)).toEqual({ beta: 0.6, gamma: 1.25, gammaBeta: 0.75, eta: LN2 });
		expect(speed(-0.6)).toEqual({ beta: -0.6, gamma: 1.25, gammaBeta: -0.75, eta: -LN2 });
		expect(speed(0)).toEqual({ beta: 0, gamma: 1, gammaBeta: 0, eta: 0 });
	});

	it('words the rapidity as ln 2 at 0.6c', () => {
		expect(etaWords(speed(0.6).eta)).toBe('ln 2 = 0.693');
		expect(etaWords(speed(-0.6).eta)).toBe('−ln 2 = −0.693');
		expect(etaWords(0)).toBe('0');
		expect(etaWords(speed(0.5).eta)).toBe('0.549');
		expect(etaTex(speed(-0.6).eta)).toBe('-\\ln 2 = -0.693');
	});
});

describe('the contents in their own frames', () => {
	it('dust is ρc² alone', () => {
		expect(CONTENTS.dust.rest).toEqual([
			[1, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	});

	it('a gas at rest is diag(ρc², p, p, p), with p positive', () => {
		const t = CONTENTS.gas.rest;
		expect(t[0][0]).toBe(1);
		for (const i of [1, 2, 3]) expect(t[i][i]).toBe(GAS_P);
		expect(GAS_P).toBeGreaterThan(0);
		expect(trace(t)).toBeCloseTo(-1 + 3 * GAS_P, 15);
	});

	it('the beam has four equal entries F/c, trace 0 and source 2F/c', () => {
		const t = CONTENTS.beam.rest;
		expect([t[0][0], t[0][3], t[3][0], t[3][3]]).toEqual([1, 1, 1, 1]);
		expect(t.flat().filter((v) => v !== 0)).toHaveLength(4);
		expect(trace(t)).toBe(0);
		expect(source(t)).toBe(2);
	});

	it('the Casimir gap is u(1, −1, −1, 3) with u < 0, the normal along z, and traceless', () => {
		const u = -1;
		const t = CONTENTS.casimir.rest;
		expect([t[0][0], t[1][1], t[2][2], t[3][3]]).toEqual([u, -u, -u, 3 * u]);
		expect(trace(t)).toBe(0);
		expect(source(t)).toBe(2 * u);
		// the chapter's −4.3×10⁻⁴ J m⁻³ at a = 1 μm
		expect(three(CASIMIR_U)).toBe('−0.000433');
	});

	it('the bound bodies average to their energy alone', () => {
		for (const c of ['shell', 'box'] as Content[]) {
			const t = CONTENTS[c].rest;
			expect(t).toEqual([
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			]);
			expect(source(t)).toBe(1);
		}
		// the beam and its bench: the beam's energy and its flux, the bench's tension cancelling Tᶻᶻ
		const b = CONTENTS.bench.rest;
		expect([b[0][0], b[0][3], b[3][0], b[3][3]]).toEqual([1, 1, 1, 0]);
		expect(source(b)).toBe(1);
	});

	it('every table is symmetric', () => {
		for (const c of ORDER) expect(symmetric(CONTENTS[c].rest)).toBe(true);
	});
});

describe('the boost by 6.2’s rule', () => {
	it('agrees with the direct product Λ T Λᵀ for random tables and boosts', () => {
		const next = generator(65);
		for (let n = 0; n < 400; n++) {
			const t = randomSymmetric(next);
			const beta = 1.98 * next() - 0.99;
			const d: Direction = next() < 0.5 ? 'x' : 'z';
			const rule = boosted(t, beta, d);
			const direct = product(boostMatrix(beta, d), t);
			expect(maxDiff(rule, direct)).toBeLessThan(
				1e-11 * Math.max(1, ...direct.flat().map(Math.abs))
			);
			expect(symmetric(rule)).toBe(true);
		}
	});

	it('agrees with the direct product for every content, both directions, along the slider', () => {
		for (const c of ORDER)
			for (const d of ['x', 'z'] as Direction[])
				for (let k = -90; k <= 90; k += 5) {
					const beta = k / 100;
					close(tableOf(c, beta, d), product(boostMatrix(beta, d), CONTENTS[c].rest), 12);
				}
	});

	it('keeps the trace to 1e-12 for random tables and boosts', () => {
		const next = generator(6);
		for (let n = 0; n < 400; n++) {
			const t = randomSymmetric(next);
			const beta = 1.98 * next() - 0.99;
			const d: Direction = next() < 0.5 ? 'x' : 'z';
			expect(Math.abs(trace(boosted(t, beta, d)) - trace(t))).toBeLessThan(1e-12 * 50);
		}
		for (const c of ORDER)
			for (const d of ['x', 'z'] as Direction[])
				for (let k = -90; k <= 90; k++) {
					const t = tableOf(c, k / 100, d);
					expect(Math.abs(trace(t) - trace(CONTENTS[c].rest))).toBeLessThan(1e-12);
				}
	});

	it('undoes itself: a boost and its reverse give the table back', () => {
		const next = generator(2);
		for (let n = 0; n < 100; n++) {
			const t = randomSymmetric(next);
			const beta = 1.8 * next() - 0.9;
			close(boosted(boosted(t, beta, 'z'), -beta, 'z'), t, 12);
		}
	});

	it('gives the dust ρu^μu^ν: at 0.6c, 1.5625, 0.9375 and 0.5625 times ρc²', () => {
		// an observer moving along +x sees the dust go along −x
		const t = tableOf('dust', -0.6, 'x');
		expect(t[0][0]).toBe(1.5625);
		expect(t[0][1]).toBe(0.9375);
		expect(t[1][1]).toBe(0.5625);
		for (const beta of [-0.8, -0.3, 0.45, 0.9]) {
			const { gamma } = speed(beta);
			const u = [gamma, -gamma * beta, 0, 0];
			close(
				tableOf('dust', beta, 'x'),
				u.map((a) => u.map((b) => a * b)),
				12
			);
		}
	});

	it('gives the fluid (ρ + p/c²)u^μu^ν + pη^{μν}', () => {
		for (const beta of [-0.7, 0.33, 0.9]) {
			const { gamma } = speed(beta);
			const u = [gamma, 0, 0, -gamma * beta];
			const eta = [-1, 1, 1, 1];
			const expected = u.map((a, m) =>
				u.map((b, n) => (1 + GAS_P) * a * b + (m === n ? GAS_P * eta[m] : 0))
			);
			close(tableOf('gas', beta, 'z'), expected, 12);
		}
	});

	it('multiplies every entry of the beam by e^{−2η} along itself: exactly ¼ at 0.6c', () => {
		const t = tableOf('beam', 0.6, 'z');
		expect([t[0][0], t[0][3], t[3][0], t[3][3]]).toEqual([0.25, 0.25, 0.25, 0.25]);
		expect(trace(t)).toBe(0);
		for (let k = -90; k <= 90; k++) {
			const beta = k / 100;
			const f = Math.exp(-2 * Math.atanh(beta));
			const m = tableOf('beam', beta, 'z');
			for (const v of [m[0][0], m[0][3], m[3][0], m[3][3]]) expect(v / f).toBeCloseTo(1, 12);
			expect(m[1][1]).toBe(0);
		}
		// against the beam, four times larger
		expect(tableOf('beam', -0.6, 'z')[0][0]).toBe(4);
	});

	it('leaves the lab’s view of the Casimir gap along its plates unchanged in the stresses across z', () => {
		const t = tableOf('casimir', 0.5, 'x');
		expect(t[2][2]).toBe(1);
		expect(t[3][3]).toBe(-3);
	});
});

describe('the bound contents', () => {
	it('their stresses add up to zero in their own frame, part by part', () => {
		for (const c of ['shell', 'bench', 'box'] as Content[]) {
			const own = ownIntegral(c)!;
			for (const row of own) for (const v of row) expect(Math.abs(v)).toBeLessThan(1e-15);
			const parts = partSums(c);
			expect(parts).toHaveLength(2);
			expect(parts[0].sum).toBeGreaterThan(0);
			expect(parts[0].sum + parts[1].sum).toBeCloseTo(0, 15);
			// and the average's own spatial block agrees
			const rest = CONTENTS[c].rest;
			for (let i = 1; i < 4; i++) for (let j = 1; j < 4; j++) expect(rest[i][j]).toBe(0);
		}
	});

	it('the box of light: the pressure ⅓𝒰 each way, E in all, cancelled by the walls', () => {
		const parts = partSums('box');
		expect(parts[0].name).toBe('the light');
		expect(parts[0].sum).toBeCloseTo(1, 15);
		expect(parts[1].sum).toBeCloseTo(-1, 15);
		for (const s of CONTENTS.box.bound!.parts[0].stresses) expect(s).toBeCloseTo(1 / 3, 15);
	});

	it('the gas in a steel shell: +3pV for the gas and −3pV for the steel', () => {
		const parts = partSums('shell');
		expect(parts[0].sum).toBeCloseTo(0.15, 15);
		expect(parts[1].sum).toBeCloseTo(-0.15, 15);
	});

	it('the bench: the beam’s +P/c along z, the bench’s −P/c', () => {
		const p = CONTENTS.bench.bound!.parts;
		expect(p[0].stresses).toEqual([0, 0, 1]);
		expect(p[1].stresses).toEqual([0, 0, -1]);
	});

	it('only the dust, gas, beam and Casimir gap are unbound', () => {
		for (const c of ['dust', 'gas', 'beam', 'casimir'] as Content[]) {
			expect(CONTENTS[c].bound).toBeUndefined();
			expect(ownIntegral(c)).toBeUndefined();
		}
	});

	it('moving, a body carries its momentum along: ∫ΣT^{ii}dV = γβ²E', () => {
		for (const c of ['shell', 'box'] as Content[])
			for (const d of ['x', 'z'] as Direction[])
				for (const beta of [-0.6, 0.3, 0.9]) {
					const { gamma } = speed(beta);
					const t = integrated(c, beta, d);
					expect(t[1][1] + t[2][2] + t[3][3]).toBeCloseTo(gamma * beta * beta, 12);
					// the energy γE and the momentum −γβE/c, times c, of a body seen to move the other way
					const i = d === 'x' ? 1 : 3;
					expect(t[0][0]).toBeCloseTo(gamma, 12);
					expect(t[0][i]).toBeCloseTo(-gamma * beta, 12);
				}
		expect(integrated('shell', 0, 'x')).toEqual(CONTENTS.shell.rest);
	});

	it('the volume shrinks by γ, but the bench’s cross-section only across its length', () => {
		expect(shrink('box', 0.6, 'x')).toBe(0.8);
		expect(shrink('shell', 0.6, 'z')).toBe(0.8);
		expect(shrink('bench', 0.6, 'z')).toBe(1);
		expect(shrink('bench', 0.6, 'x')).toBe(0.8);
		expect(shrink('beam', 0.6, 'x')).toBe(1);
	});
});

describe('T_{μν}k^μk^ν along ±z', () => {
	it('is T⁰⁰ ∓ 2T⁰ᶻ + Tᶻᶻ, the full sum with the lowered indices', () => {
		const next = generator(9);
		for (let n = 0; n < 100; n++) {
			const t = randomSymmetric(next);
			for (const r of [1, -1] as const) expect(alongRay(t, r)).toBeCloseTo(alongRayFull(t, r), 13);
		}
	});

	it('is ρc² + p for a fluid at rest, along either', () => {
		for (const r of [1, -1] as const) {
			expect(alongRay(CONTENTS.gas.rest, r)).toBeCloseTo(1 + GAS_P, 15);
			expect(alongRay(CONTENTS.dust.rest, r)).toBe(1);
		}
	});

	it('is 0 for the beam along +z and 4F/c along −z', () => {
		expect(alongRay(CONTENTS.beam.rest, 1)).toBe(0);
		expect(alongRay(CONTENTS.beam.rest, -1)).toBe(4);
	});

	it('is 4u < 0 along the Casimir plates’ normal, either way', () => {
		for (const r of [1, -1] as const) {
			expect(alongRay(CONTENTS.casimir.rest, r)).toBe(-4);
		}
	});

	it('for the bound bodies at rest', () => {
		expect(alongRay(CONTENTS.box.rest, 1)).toBe(1);
		expect(alongRay(CONTENTS.shell.rest, -1)).toBe(1);
		// the beam and its bench: 1 − 2 + 0 along the beam, 1 + 2 + 0 against it
		expect(alongRay(CONTENTS.bench.rest, 1)).toBe(-1);
		expect(alongRay(CONTENTS.bench.rest, -1)).toBe(3);
	});

	it('keeps its sign under a boost along z, scaled by e^{±2η}', () => {
		for (const c of ORDER)
			for (const r of [1, -1] as const)
				for (const beta of [-0.9, -0.4, 0.6, 0.8]) {
					const f = Math.exp(2 * r * Math.atanh(beta));
					expect(alongRay(tableOf(c, beta, 'z'), r)).toBeCloseTo(
						f * alongRay(CONTENTS[c].rest, r),
						11
					);
				}
	});
});

describe('the cells', () => {
	it('are coloured by sign, zero faint', () => {
		expect(signOf(0.25)).toBe('positive');
		expect(signOf(-3)).toBe('negative');
		expect(signOf(0)).toBe('zero');
		expect(signOf(1e-14)).toBe('zero');
		expect(strength(0, 2)).toBe(0);
		expect(strength(2, 2)).toBe(1);
		expect(strength(-1, 2)).toBeCloseTo(0.625, 15);
	});

	it('sit in three blocks, the flux block shaded alike either side of the diagonal', () => {
		expect(blockOf(0, 0)).toBe('energy');
		expect(blockOf(0, 3)).toBe('flux');
		expect(blockOf(2, 0)).toBe('flux');
		expect(blockOf(1, 3)).toBe('momentum');
	});

	it('read three figures', () => {
		expect(three(1)).toBe('1.00');
		expect(three(-0.75)).toBe('−0.750');
		expect(three(0.25)).toBe('0.250');
		expect(three(0)).toBe('0');
		expect(two(-0)).toBe('0.00');
		expect(two(-0.6)).toBe('−0.60');
	});

	it('are described row by row', () => {
		expect(tableWords(CONTENTS.beam.rest)).toBe(
			'row 0: 0 1.00, x 0, y 0, z 1.00; row x: 0 0, x 0, y 0, z 0; row y: 0 0, x 0, y 0, z 0; row z: 0 1.00, x 0, y 0, z 1.00'
		);
		expect(frameWords(0, 'z')).toBe('at rest');
		expect(frameWords(-0.6, 'x')).toBe('for an observer moving at 0.60c along −x');
	});
});

describe('the slider', () => {
	it('lands on hundredths within ±0.9', () => {
		expect(hundredths(0.6049)).toBe(0.6);
		expect(hundredths(2)).toBe(BOOST.max);
		expect(hundredths(-2)).toBe(BOOST.min);
	});

	it('steps by 0.05 with the arrow keys, on the grid of 0.05, and stops at the ends', () => {
		let b = 0;
		for (let n = 0; n < 12; n++) b = keyed(b, 1, BOOST.key);
		expect(b).toBe(0.6);
		expect(keyed(0.62, 1, BOOST.key)).toBe(0.65);
		expect(keyed(0.62, -1, BOOST.key)).toBe(0.6);
		expect(keyed(0.9, 1, BOOST.key)).toBe(0.9);
		expect(keyed(-0.9, -1, BOOST.key)).toBe(-0.9);
		expect(keyed(0, 1, BOOST.page)).toBe(0.3);
		expect(keyed(0.3, 1, BOOST.page)).toBe(0.6);
	});
});

describe('the predictions', () => {
	it('open on the beam along z at rest, neither answered', () => {
		expect(OPENING).toEqual({ content: 'beam', beta: 0, direction: 'z' });
		expect(firstDone(false, OPENING)).toBe(false);
		expect(secondDone(false, OPENING)).toBe(false);
	});

	it('the first is answered by the light in a box, at rest', () => {
		expect(firstDone(false, { content: 'box', beta: 0, direction: 'z' })).toBe(true);
		expect(firstDone(false, { content: 'box', beta: 0.3, direction: 'z' })).toBe(false);
		expect(firstDone(false, { content: 'shell', beta: 0, direction: 'z' })).toBe(false);
		expect(firstDone(true, OPENING)).toBe(true);
	});

	it('the second by the beam boosted along itself at 0.6c', () => {
		expect(secondDone(false, { content: 'beam', beta: ALONG, direction: 'z' })).toBe(true);
		expect(secondDone(false, { content: 'beam', beta: keyed(0.55, 1, 0.05), direction: 'z' })).toBe(
			true
		);
		expect(secondDone(false, { content: 'beam', beta: -0.6, direction: 'z' })).toBe(false);
		expect(secondDone(false, { content: 'beam', beta: 0.6, direction: 'x' })).toBe(false);
		expect(secondDone(false, { content: 'bench', beta: 0.6, direction: 'z' })).toBe(false);
		expect(secondDone(true, OPENING)).toBe(true);
	});

	it('the second answer: every entry falls by four, e^{−2η} with η = ln 2; the trace stays 0', () => {
		const a = secondAnswer();
		expect(a.factors).toEqual([0.25, 0.25, 0.25]);
		expect(a.expected).toBeCloseTo(0.25, 15);
		expect(a.eta).toBe(LN2);
		expect(a.trace).toBe(0);
		expect(a.source).toBe(0.5);
	});
});
