/**
 * The two-paths figure's arithmetic (two-paths.ts): the chapter's tables and their unitarity, the exits'
 * probabilities from multiplying the tables against the closed forms P_R = ½(1 + cos θ cos φ) and
 * P_L = ½(1 − cos θ cos φ) at the points the chapter names, the blocked path, the record's overlap, the arrows at
 * exit R, the fringes, the keys, the words and the three predictions.
 */
import { describe, expect, it } from 'vitest';
import {
	ENTRY,
	MIRROR,
	OPENING,
	PHI,
	RECORD,
	abs2,
	absorber,
	apply,
	arrows,
	closedPL,
	closedPR,
	cx,
	degrees,
	delay,
	expi,
	fringe,
	identity,
	instrument,
	kron,
	landed,
	multiply,
	noteFirst,
	noteSecond,
	noteThird,
	overlapOf,
	phiOf,
	phiTex,
	phiWords,
	plus,
	reading,
	recordOf,
	recorder,
	run,
	stepped,
	swingOf,
	thetaOf,
	times,
	two,
	twoEntry,
	unitarityError,
	type Complex,
	type Settings
} from './two-paths';

const close = (a: Complex, b: Complex, tol = 1e-14) => {
	expect(Math.abs(a.re - b.re)).toBeLessThan(tol);
	expect(Math.abs(a.im - b.im)).toBeLessThan(tol);
};
const at = (k: number, overlap = 1, blocked = false): Settings => ({ k, overlap, blocked });

describe('the tables', () => {
	it('the mirror is the chapter’s U = (1, i; i, 1)/√2', () => {
		const h = Math.SQRT1_2;
		close(MIRROR[0][0], cx(h));
		close(MIRROR[0][1], cx(0, h));
		close(MIRROR[1][0], cx(0, h));
		close(MIRROR[1][1], cx(h));
	});

	it('the mirror, the delay, the record and the products with the identity are unitary', () => {
		expect(unitarityError(MIRROR)).toBeLessThan(1e-15);
		for (let k = 0; k <= 24; k++) expect(unitarityError(delay(phiOf(k)))).toBeLessThan(1e-15);
		for (const c of [1, 0.75, 0.5, 0.25, 0])
			expect(unitarityError(recorder(thetaOf(c)))).toBeLessThan(1e-15);
		expect(unitarityError(kron(MIRROR, identity(2)))).toBeLessThan(1e-15);
		for (const c of [1, 0.5, 0])
			for (const k of [0, 5, 12])
				expect(unitarityError(instrument(phiOf(k), c, 'none'))).toBeLessThan(1e-14);
	});

	it('the absorber is not unitary, and takes away only its own path', () => {
		expect(unitarityError(absorber('R'))).toBeCloseTo(1, 15);
		expect(unitarityError(absorber('none'))).toBe(0);
		const v = [cx(1), cx(2), cx(3), cx(4)];
		expect(apply(absorber('R'), v).map((z) => z.re)).toEqual([1, 2, 0, 0]);
		expect(apply(absorber('L'), v).map((z) => z.re)).toEqual([0, 0, 3, 4]);
	});

	it('the product with the identity acts on the mass and leaves the record alone', () => {
		// (L0, L1, R0, R1): the mirror mixes L0 with R0 and L1 with R1
		const m = kron(MIRROR, identity(2));
		const out = apply(m, ENTRY);
		close(out[0], cx(Math.SQRT1_2));
		close(out[1], cx(0));
		close(out[2], cx(0, Math.SQRT1_2));
		close(out[3], cx(0));
	});

	it('the record turns |e_R⟩ to (cos θ, sin θ) and leaves |e_L⟩ = (1, 0)', () => {
		const t = thetaOf(0.5);
		const fromR = apply(recorder(t), [cx(0), cx(0), cx(1), cx(0)]);
		close(fromR[2], cx(0.5));
		close(fromR[3], cx(Math.sqrt(3) / 2));
		const fromL = apply(recorder(t), ENTRY);
		close(fromL[0], cx(1));
		close(fromL[1], cx(0));
		expect(thetaOf(0.5)).toBeCloseTo(Math.PI / 3, 15);
		expect(thetaOf(0)).toBeCloseTo(Math.PI / 2, 15);
		expect(degrees(0.5)).toBe(60);
	});

	it('multiplying UDU|L⟩ gives the chapter’s ½(e^{iφ} − 1, i(e^{iφ} + 1))', () => {
		for (let k = 0; k <= 24; k++) {
			const phi = phiOf(k);
			const e = expi(phi);
			const out = twoEntry(phi);
			close(out[0], cx((e.re - 1) / 2, e.im / 2));
			close(out[1], times(cx(0, 0.5), plus(e, cx(1))));
		}
	});

	it('the state between the mirrors is the chapter’s (e^{iφ}, 0, i cos θ, i sin θ)/√2', () => {
		const phi = 1.1;
		const t = thetaOf(0.3);
		const one = identity(2);
		const m = multiply(kron(delay(phi), one), multiply(recorder(t), kron(MIRROR, one)));
		const s = apply(m, ENTRY);
		const h = Math.SQRT1_2;
		close(s[0], times(cx(h), expi(phi)));
		close(s[1], cx(0));
		close(s[2], cx(0, h * Math.cos(t)));
		close(s[3], cx(0, h * Math.sin(t)));
	});
});

describe('the exits', () => {
	it('agree with the closed forms at every delay and overlap, and add to one', () => {
		for (let k = 0; k <= 24; k++)
			for (let j = 0; j <= 20; j++) {
				const c = j / 20;
				const phi = phiOf(k);
				const r = run(phi, c);
				expect(Math.abs(r.pR - closedPR(phi, c))).toBeLessThan(1e-14);
				expect(Math.abs(r.pL - closedPL(phi, c))).toBeLessThan(1e-14);
				expect(Math.abs(r.absorbed)).toBeLessThan(1e-14);
			}
	});

	it('with no record: P_R = 1, 0.5, 0 at φ = 0, π/2, π, and cos²(φ/2)', () => {
		expect(run(0, 1).pR).toBeCloseTo(1, 15);
		expect(run(Math.PI / 2, 1).pR).toBeCloseTo(0.5, 15);
		expect(run(Math.PI, 1).pR).toBeCloseTo(0, 15);
		for (let k = 0; k <= 24; k++) {
			const phi = phiOf(k);
			expect(run(phi, 1).pR).toBeCloseTo(Math.cos(phi / 2) ** 2, 14);
			expect(run(phi, 1).pL).toBeCloseTo(Math.sin(phi / 2) ** 2, 14);
			// the record that agrees is the instrument without one
			expect(run(phi, 1).pR).toBeCloseTo(abs2(twoEntry(phi)[1]), 14);
		}
	});

	it('with overlap 0.5: 0.75, 0.5, 0.25; with overlap 0: 0.5 at every delay', () => {
		expect(run(0, 0.5).pR).toBeCloseTo(0.75, 15);
		expect(run(Math.PI / 2, 0.5).pR).toBeCloseTo(0.5, 15);
		expect(run(Math.PI, 0.5).pR).toBeCloseTo(0.25, 15);
		for (let k = 0; k <= 24; k++) {
			expect(run(phiOf(k), 0).pR).toBeCloseTo(0.5, 15);
			expect(run(phiOf(k), 0).pL).toBeCloseTo(0.5, 15);
		}
	});

	it('with path R blocked: a quarter at each exit at every delay and overlap, half absorbed', () => {
		for (let k = 0; k <= 24; k++)
			for (const c of [1, 0.5, 0]) {
				const r = run(phiOf(k), c, 'R');
				expect(r.pR).toBeCloseTo(0.25, 15);
				expect(r.pL).toBeCloseTo(0.25, 15);
				expect(r.absorbed).toBeCloseTo(0.5, 15);
				expect(closedPR(phiOf(k), c, true)).toBe(0.25);
			}
	});

	it('the opening: φ = π/3, overlap 1, P_R = 0.75 and P_L = 0.25, the practice problem’s', () => {
		const r = reading(OPENING);
		expect(r.phi).toBeCloseTo(Math.PI / 3, 15);
		expect(r.pR).toBeCloseTo(0.75, 15);
		expect(r.pL).toBeCloseTo(0.25, 15);
	});
});

describe('the arrows at exit R', () => {
	it('by way of L is ie^{iφ}/2, by way of R i cos θ/2 and i sin θ/2', () => {
		for (const k of [0, 3, 4, 12, 17])
			for (const c of [1, 0.5, 0.2, 0]) {
				const phi = phiOf(k);
				const a = arrows(phi, c, false);
				close(a.byL, times(cx(0, 0.5), expi(phi)));
				close(a.byR, cx(0, c / 2));
				close(a.other, cx(0, Math.sqrt(1 - c * c) / 2));
				close(a.sum, plus(a.byL, a.byR));
			}
	});

	it('the squared sum and the lone arrow make P_R, and each path alone gives a quarter', () => {
		for (const k of [0, 4, 9, 12])
			for (const c of [1, 0.5, 0]) {
				const r = reading(at(k, c));
				expect(abs2(r.sum) + abs2(r.other)).toBeCloseTo(r.pR, 14);
				expect(abs2(r.byL)).toBeCloseTo(0.25, 15);
				expect(abs2(r.byR) + abs2(r.other)).toBeCloseTo(0.25, 15);
				expect(r.alone).toBeCloseTo(0.5, 15);
			}
	});

	it('the interference term is ½ cos φ times the overlap, and none with path R blocked', () => {
		for (let k = 0; k <= 24; k++)
			for (const c of [1, 0.75, 0.5, 0]) {
				const r = reading(at(k, c));
				expect(r.term).toBeCloseTo(0.5 * Math.cos(phiOf(k)) * c, 14);
				const b = reading(at(k, c, true));
				expect(Math.abs(b.term)).toBeLessThan(1e-15);
				expect(abs2(b.byR)).toBe(0);
				expect(abs2(b.other)).toBe(0);
				expect(abs2(b.sum)).toBeCloseTo(0.25, 15);
			}
	});

	it('at φ = π with no record the two arrows cancel', () => {
		const r = reading(at(12));
		expect(abs2(r.sum)).toBeLessThan(1e-30);
		expect(r.closedR).toBeCloseTo(0, 15);
	});
});

describe('the fringes', () => {
	it('follow the closed form, and swing by the overlap', () => {
		for (const c of [1, 0.5, 0]) {
			for (const p of fringe(c, false, 48)) expect(p.p).toBeCloseTo(closedPR(p.phi, c), 14);
			const s = swingOf(c, false);
			expect(s.swing).toBeCloseTo(c, 14);
			expect(s.lo).toBeCloseTo(0.5 - c / 2, 14);
			expect(s.hi).toBeCloseTo(0.5 + c / 2, 14);
		}
		const half = swingOf(0.5, false);
		expect(half.lo).toBeCloseTo(0.25, 15);
		expect(half.hi).toBeCloseTo(0.75, 15);
	});

	it('are flat at a quarter with path R blocked', () => {
		for (const p of fringe(1, true, 24)) expect(p.p).toBeCloseTo(0.25, 15);
		expect(swingOf(1, true).swing).toBeCloseTo(0, 15);
		expect(fringe(1, false).length).toBe(97);
	});
});

describe('the sliders and their keys', () => {
	it('φ in twelfths of π: a twelfth a press, a quarter with Shift, 0 to 2π', () => {
		expect(stepped(4, 'ArrowRight', false, PHI)).toBe(5);
		expect(stepped(4, 'ArrowLeft', true, PHI)).toBe(3);
		expect(stepped(4, 'ArrowRight', true, PHI)).toBe(6);
		expect(stepped(24, 'ArrowRight', false, PHI)).toBe(24);
		expect(stepped(1, 'ArrowLeft', true, PHI)).toBe(0);
		expect(stepped(9, 'Home', false, PHI)).toBe(0);
		expect(stepped(9, 'End', false, PHI)).toBe(24);
		expect(stepped(9, 'a', false, PHI)).toBeUndefined();
		expect(phiOf(24)).toBeCloseTo(2 * Math.PI, 15);
	});

	it('the record from none to perfect, stopping half-way', () => {
		expect(stepped(0, 'ArrowRight', false, RECORD)).toBeCloseTo(0.05, 12);
		expect(stepped(0, 'ArrowRight', true, RECORD)).toBe(0.25);
		expect(stepped(0.45, 'ArrowRight', true, RECORD)).toBe(0.5);
		expect(stepped(0.55, 'ArrowLeft', true, RECORD)).toBe(0.5);
		expect(stepped(0.9, 'ArrowRight', true, RECORD)).toBe(1);
	});

	it('the record’s slider and the overlap are each other’s complement, on a clean grid', () => {
		expect(overlapOf(0)).toBe(1);
		expect(overlapOf(1)).toBe(0);
		expect(overlapOf(0.5)).toBe(0.5);
		expect(overlapOf(0.05)).toBe(0.95);
		expect(overlapOf(0.95)).toBe(0.05);
		expect(overlapOf(0.333)).toBe(0.65);
		for (let j = 0; j <= 20; j++) expect(overlapOf(recordOf(j / 20))).toBe(landed(j / 20, RECORD));
	});
});

describe('the words', () => {
	it('the delay in lowest terms', () => {
		expect(phiWords(0)).toBe('0');
		expect(phiWords(1)).toBe('π/12');
		expect(phiWords(4)).toBe('π/3');
		expect(phiWords(5)).toBe('5π/12');
		expect(phiWords(6)).toBe('π/2');
		expect(phiWords(8)).toBe('2π/3');
		expect(phiWords(12)).toBe('π');
		expect(phiWords(18)).toBe('3π/2');
		expect(phiWords(24)).toBe('2π');
		expect(phiTex(5)).toBe('5\\pi/12');
	});

	it('two decimals with a true minus and no −0.00', () => {
		expect(two(0.75)).toBe('0.75');
		expect(two(-0.25)).toBe('−0.25');
		expect(two(-1e-17)).toBe('0.00');
		expect(two(1)).toBe('1.00');
	});
});

describe('the predictions', () => {
	it('none is answered at the opening', () => {
		expect(noteFirst(false, OPENING)).toBe(false);
		expect(noteSecond(false, OPENING)).toBe(false);
		expect(noteThird(false, OPENING)).toBe(false);
	});

	it('the first needs a perfect record and no delay, with both paths open', () => {
		expect(noteFirst(false, at(0, 0))).toBe(true);
		expect(noteFirst(false, at(24, 0))).toBe(true);
		expect(noteFirst(false, at(1, 0))).toBe(false);
		expect(noteFirst(false, at(0, 0.05))).toBe(false);
		expect(noteFirst(false, at(0, 0, true))).toBe(false);
		expect(noteFirst(true, OPENING)).toBe(true);
		expect(noteFirst(false, at(0, overlapOf(1)))).toBe(true);
	});

	it('the second needs the record half-way, overlap 0.5, with both paths open', () => {
		expect(noteSecond(false, at(4, 0.5))).toBe(true);
		expect(noteSecond(false, at(4, overlapOf(0.5)))).toBe(true);
		expect(noteSecond(false, at(4, 0.55))).toBe(false);
		expect(noteSecond(false, at(4, 0.5, true))).toBe(false);
		expect(noteSecond(true, OPENING)).toBe(true);
	});

	it('the third needs path R blocked', () => {
		expect(noteThird(false, at(4, 1, true))).toBe(true);
		expect(noteThird(false, at(4, 0.5))).toBe(false);
		expect(noteThird(true, OPENING)).toBe(true);
	});
});
