import { describe, expect, it } from 'vitest';
import {
	GYRO_PAIRS,
	K_HAT,
	OPENING,
	RING,
	armDifference,
	armFormula,
	armPeak,
	armsTurned,
	circular,
	displacement,
	gyroTurn,
	levi,
	magnetic,
	magneticStrain,
	noteFirst,
	noteSecond,
	noteThird,
	parts,
	plusOnly,
	polarization,
	size,
	strainNow,
	strainTable,
	strains,
	stretchAxis,
	tide,
	turned,
	watch,
	type Mat3,
	type Settings
} from './wave-rings';

const at = (s: Partial<Settings>): Settings => ({ ...OPENING, ...s });

const expectTable = (a: Mat3, b: Mat3, digits = 12) =>
	a.forEach((row, i) => row.forEach((v, j) => expect(v).toBeCloseTo(b[i][j], digits)));

/** The turn from axis a to axis b, folded into [0, π). */
const axisGap = (a: number, b: number) => (((b - a) % Math.PI) + Math.PI) % Math.PI;
/** How far apart two axes are, either way round, in [0, π/2]. */
const axisApart = (a: number, b: number) => Math.min(axisGap(a, b), Math.PI - axisGap(a, b));

const SAMPLES: Settings[] = [
	at({}),
	at({ plus: 0.6, cross: 0.25, lag: 0, phase: 0.3 }),
	at({ plus: 1, cross: 1, lag: 90, phase: 1.1 }),
	at({ plus: 0.35, cross: 0.8, lag: 230, phase: 4.2 }),
	at({ plus: 0, cross: 1, lag: 45, phase: 2.5 })
];

describe('the strain', () => {
	it('is symmetric, trace-free and transverse to the direction of travel', () => {
		for (const s of SAMPLES) {
			const h = strainNow(s);
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) expect(h[i][j]).toBe(h[j][i]);
			expect(h[0][0] + h[1][1] + h[2][2]).toBeCloseTo(0, 14);
			for (let i = 0; i < 3; i++)
				expect(h[i][0] * K_HAT[0] + h[i][1] * K_HAT[1] + h[i][2] * K_HAT[2]).toBe(0);
		}
	});

	it('is h₊ = A₊ cos ωt and h× = A× cos(ωt − φ): a quarter period behind is A× sin ωt', () => {
		const s = at({ plus: 0.7, cross: 0.4, lag: 90, phase: 0.9 });
		expect(strains(s).plus).toBeCloseTo(0.7 * Math.cos(0.9), 14);
		expect(strains(s).cross).toBeCloseTo(0.4 * Math.sin(0.9), 14);
	});

	it('has the plus pattern diag(1, −1) and the cross pattern 1 in the places 12 and 21', () => {
		expectTable(strainTable(1, 0), [
			[1, 0, 0],
			[0, -1, 0],
			[0, 0, 0]
		]);
		expectTable(strainTable(0, 1), [
			[0, 1, 0],
			[1, 0, 0],
			[0, 0, 0]
		]);
	});
});

describe('the balls', () => {
	it('move by ½ h_ij ξ_j', () => {
		const h = strainTable(0.6, 0.2);
		for (const xi of RING) {
			const d = displacement(h, xi);
			expect(d[0]).toBeCloseTo(0.5 * (0.6 * xi[0] + 0.2 * xi[1]), 14);
			expect(d[1]).toBeCloseTo(0.5 * (0.2 * xi[0] - 0.6 * xi[1]), 14);
		}
	});

	it('in a plus wave at its peak: out along e₁ and in along e₂ by half the strain, the reverse half a period later', () => {
		const now = strainNow(at({ phase: 0 }));
		expect(displacement(now, [1, 0])).toEqual([0.5, 0]);
		expect(displacement(now, [0, 1])[1]).toBeCloseTo(-0.5, 14);
		const later = strainNow(at({ phase: Math.PI }));
		expect(displacement(later, [1, 0])[0]).toBeCloseTo(-0.5, 14);
		expect(displacement(later, [0, 1])[1]).toBeCloseTo(0.5, 14);
	});

	it('are twelve, the first on e₁, anticlockwise', () => {
		expect(RING).toHaveLength(12);
		expect(RING[0]).toEqual([1, 0]);
		expect(RING[3][0]).toBeCloseTo(0, 14);
		expect(RING[3][1]).toBeCloseTo(1, 14);
	});
});

describe('the arms', () => {
	it('read ½(h′₁₁ − h′₂₂) = h₊ cos 2ψ + h× sin 2ψ', () => {
		for (const s of SAMPLES)
			for (const psi of [0, 10, 22.5, 45, 60, 90]) {
				const h = strains(s);
				expect(armDifference(strainNow(s), psi)).toBeCloseTo(armFormula(h.plus, h.cross, psi), 12);
			}
	});

	it('read h₊ along e₁ and e₂, h× at 45°, and −h₊ when swapped', () => {
		const h = strainTable(0.8, 0.3);
		expect(armDifference(h, 0)).toBeCloseTo(0.8, 14);
		expect(armDifference(h, 45)).toBeCloseTo(0.3, 14);
		expect(armDifference(h, 90)).toBeCloseTo(-0.8, 14);
	});

	it('each change by half the strain, opposite ways, as the chapter says of LIGO', () => {
		const h = strainTable(1, 0);
		const d1 = armDifference(h, 0);
		expect(d1).toBe(1);
		expect(displacement(h, [1, 0])[0]).toBe(0.5);
		expect(displacement(h, [0, 1])[1]).toBe(-0.5);
	});

	it('read nothing of a plus wave at 45°', () => {
		for (const phase of [0, 0.7, 2])
			expect(armDifference(strainNow(at({ arms: 45, phase })), 45)).toBeCloseTo(0, 14);
	});

	it('peak at √(α² + β² + 2αβ cos φ) over a period', () => {
		for (const s of SAMPLES)
			for (const arms of [0, 20, 45, 70]) {
				let best = 0;
				for (let i = 0; i < 3600; i++) {
					const t = at({ ...s, arms, phase: (2 * Math.PI * i) / 3600 });
					best = Math.max(best, Math.abs(armDifference(strainNow(t), arms)));
				}
				expect(armPeak({ ...s, arms })).toBeCloseTo(best, 5);
			}
	});
});

describe('the tide and its magnetic part', () => {
	it('is −½ ∂²_t h, which for a steady wave is ½ ω² h', () => {
		for (const s of SAMPLES) {
			const dt = 1e-4;
			const h = (p: number) => strainNow({ ...s, phase: p });
			const E = tide(s);
			const [a, b, c] = [h(s.phase - dt), h(s.phase), h(s.phase + dt)];
			for (let i = 0; i < 3; i++)
				for (let j = 0; j < 3; j++) {
					expect(E[i][j]).toBeCloseTo((-0.5 * (a[i][j] - 2 * b[i][j] + c[i][j])) / dt ** 2, 5);
					expect(E[i][j]).toBeCloseTo(0.5 * b[i][j], 14);
				}
		}
	});

	it('uses the Levi-Civita symbol with ε₁₂₃ = 1', () => {
		expect(levi(0, 1, 2)).toBe(1);
		expect(levi(1, 2, 0)).toBe(1);
		expect(levi(1, 0, 2)).toBe(-1);
		expect(levi(0, 2, 1)).toBe(-1);
		expect(levi(0, 0, 1)).toBe(0);
	});

	it('is the chapter’s table: 𝓑₊ = −𝓔× and 𝓑× = 𝓔₊', () => {
		const E = strainTable(0.6, 0.25);
		const B = magnetic(E);
		expectTable(B, strainTable(-0.25, 0.6), 14);
	});

	it('is symmetric, trace-free, transverse, and equal in size to 𝓔', () => {
		for (const s of SAMPLES) {
			const E = tide(s);
			const B = magnetic(E);
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) expect(B[i][j]).toBe(B[j][i]);
			expect(B[0][0] + B[1][1] + B[2][2]).toBeCloseTo(0, 14);
			expect(B[2]).toEqual([0, 0, 0]);
			expect(size(B)).toBeCloseTo(size(E), 14);
		}
	});

	it('is 𝓔 turned anticlockwise by 45° about the direction of travel, as the reader sees it', () => {
		for (const s of SAMPLES) {
			const E = tide(s);
			expectTable(magnetic(E), turned(E, Math.PI / 4));
			// not clockwise, unless the pattern is zero
			if (size(E) > 0) {
				const B = magnetic(E);
				const wrong = turned(E, -Math.PI / 4);
				expect(Math.hypot(B[0][0] - wrong[0][0], B[0][1] - wrong[0][1])).toBeGreaterThan(1e-3);
			}
		}
	});

	it('has its stretch axis 45° anticlockwise of 𝓔’s, and its shear i times 𝓔’s', () => {
		const E = strainTable(0.6, 0.25);
		const B = magnetic(E);
		expect(axisGap(stretchAxis(E)!, stretchAxis(B)!)).toBeCloseTo(Math.PI / 4, 12);
		const e = parts(E);
		const b = parts(B);
		// 2(B₊ + iB×) = i · 2(E₊ + iE×): B₊ = −E×, B× = E₊; the chapter's 1.2 + 0.5i and −0.5 + 1.2i
		expect(2 * b.plus).toBeCloseTo(-2 * e.cross, 14);
		expect(2 * b.cross).toBeCloseTo(2 * e.plus, 14);
		expect([2 * e.plus, 2 * e.cross]).toEqual([1.2, 0.5]);
		expect([2 * b.plus, 2 * b.cross]).toEqual([-0.5, 1.2]);
	});

	it('is drawn as a ring with the strain 2𝓑/ω², h turned by 45°', () => {
		for (const s of SAMPLES) expectTable(magneticStrain(s), turned(strainNow(s), Math.PI / 4));
	});

	it('turns a gyroscope at ξ relative to the centre by 𝓑ξ, opposite for its partner at −ξ', () => {
		const B = magnetic(tide(at({ plus: 1, phase: 0 })));
		expect(GYRO_PAIRS).toHaveLength(6);
		for (const [a, b] of GYRO_PAIRS) {
			const wa = gyroTurn(B, a);
			const wb = gyroTurn(B, b);
			expect(wa[0]).toBeCloseTo(-wb[0], 14);
			expect(wa[1]).toBeCloseTo(-wb[1], 14);
			expect(wa[0]).toBeCloseTo(B[0][0] * a[0] + B[0][1] * a[1], 14);
		}
		// a plus tide of ½ at its peak: 𝓑 = ½ e×, so the gyroscope on e₁ turns about e₂
		const w = gyroTurn(B, [1, 0]);
		expect(w[0]).toBeCloseTo(0, 14);
		expect(w[1]).toBeCloseTo(0.5, 14);
	});

	it('are both 1/√2 ω²h at the peak of a plus wave of 1', () => {
		const E = tide(at({}));
		expect(size(E)).toBeCloseTo(Math.SQRT1_2, 14);
		expect(size(magnetic(E))).toBeCloseTo(Math.SQRT1_2, 14);
	});
});

describe('circular polarization', () => {
	const c = at({ plus: 1, cross: 1, lag: 90 });

	it('keeps its shape: the size of the pattern stays the same', () => {
		for (let i = 0; i < 24; i++) {
			const s = { ...c, phase: (2 * Math.PI * i) / 24 };
			expect(size(strainNow(s))).toBeCloseTo(Math.SQRT2, 12);
			expect(size(tide(s))).toBeCloseTo(Math.SQRT1_2, 12);
		}
	});

	it('turns anticlockwise at half the wave’s angular frequency', () => {
		for (let i = 0; i < 24; i++) {
			const phase = (2 * Math.PI * i) / 24;
			const axis = stretchAxis(strainNow({ ...c, phase }))!;
			expect(axisApart(phase / 2, axis)).toBeCloseTo(0, 10);
			// the whole pattern is the opening's turned by ωt/2
			expectTable(strainNow({ ...c, phase }), turned(strainNow({ ...c, phase: 0 }), phase / 2));
		}
	});

	it('turns clockwise with h× three quarters of a period behind', () => {
		const back = { ...c, lag: 270 };
		const phase = 0.8;
		expectTable(
			strainNow({ ...back, phase }),
			turned(strainNow({ ...back, phase: 0 }), -phase / 2)
		);
	});

	it('only pulses when linear: the axis stays on e₁ or e₂', () => {
		for (let i = 0; i < 24; i++) {
			const axis = stretchAxis(strainNow(at({ phase: (2 * Math.PI * i + 0.1) / 24 })));
			if (axis !== undefined)
				expect(Math.min(axisApart(axis, 0), axisApart(axis, Math.PI / 2))).toBeCloseTo(0, 12);
		}
	});
});

describe('the polarization', () => {
	it('names what the pattern does, in chapter 5.4’s sense of turning', () => {
		expect(polarization({ ...OPENING, plus: 0 })).toBe('none');
		expect(polarization(OPENING)).toBe('plus');
		expect(polarization({ ...OPENING, plus: 0, cross: 1 })).toBe('cross');
		expect(polarization({ ...OPENING, cross: 1, lag: 0 })).toBe('linear');
		expect(polarization({ ...OPENING, cross: 0.5, lag: 180 })).toBe('linear');
		expect(polarization({ ...OPENING, cross: 1 })).toBe('circular');
		expect(polarization({ ...OPENING, cross: 1, lag: 270 })).toBe('circular-back');
		expect(polarization({ ...OPENING, cross: 0.5 })).toBe('elliptical');
		expect(polarization({ ...OPENING, cross: 1, lag: 45 })).toBe('elliptical');
		expect(polarization({ ...OPENING, cross: 1, lag: 300 })).toBe('elliptical-back');
	});

	it('turns anticlockwise for an elliptical wave with h× less than half a period behind', () => {
		const k = { ...OPENING, cross: 0.5, lag: 60 };
		// the stretch axis's average turn over a period is half a turn, anticlockwise
		let total = 0;
		let last = stretchAxis(strainNow({ ...k, phase: 0 }))!;
		for (let i = 1; i <= 720; i++) {
			const a = stretchAxis(strainNow({ ...k, phase: (2 * Math.PI * i) / 720 }))!;
			let d = a - last;
			if (d > Math.PI / 2) d -= Math.PI;
			if (d < -Math.PI / 2) d += Math.PI;
			total += d;
			last = a;
		}
		expect(total).toBeCloseTo(Math.PI, 6);
	});
});

describe('the predictions', () => {
	it('know a plus wave, a circular wave, and arms turned in a plus wave', () => {
		expect(plusOnly(OPENING)).toBe(true);
		expect(plusOnly({ ...OPENING, cross: 0.05 })).toBe(false);
		expect(plusOnly({ ...OPENING, plus: 0 })).toBe(false);
		expect(circular({ ...OPENING, cross: 1 })).toBe(true);
		expect(circular({ ...OPENING, cross: 1, lag: 85 })).toBe(false);
		expect(circular({ ...OPENING, cross: 0.95 })).toBe(false);
		expect(circular({ ...OPENING, plus: 0.5, cross: 0.5 })).toBe(true);
		expect(armsTurned({ ...OPENING, arms: 45 })).toBe(true);
		expect(armsTurned({ ...OPENING, arms: 44 })).toBe(false);
		expect(armsTurned({ ...OPENING, arms: 45, cross: 1 })).toBe(false);
	});

	it('answer the first after half a period of a plus wave alone', () => {
		let w = 0;
		for (let i = 0; i < 9; i++) w = watch(w, plusOnly(OPENING), Math.PI / 10);
		expect(noteFirst(false, OPENING, w)).toBe(false);
		w = watch(w, plusOnly(OPENING), Math.PI / 10);
		expect(noteFirst(false, OPENING, w)).toBe(true);
		// watching another wave does not count
		expect(watch(0, plusOnly({ ...OPENING, cross: 1 }), 5)).toBe(0);
		expect(noteFirst(false, { ...OPENING, cross: 1 }, 10)).toBe(false);
		expect(noteFirst(true, { ...OPENING, cross: 1 }, 0)).toBe(true);
	});

	it('answer the second after a quarter period of the circular wave', () => {
		const k = { ...OPENING, cross: 1 };
		expect(noteSecond(false, k, Math.PI / 2 - 0.01)).toBe(false);
		expect(noteSecond(false, k, Math.PI / 2)).toBe(true);
		expect(noteSecond(false, OPENING, 10)).toBe(false);
		expect(noteSecond(true, OPENING, 0)).toBe(true);
	});

	it('answer the third once the arms are at 45° in a plus wave', () => {
		expect(noteThird(false, OPENING)).toBe(false);
		expect(noteThird(false, { ...OPENING, arms: 45 })).toBe(true);
		expect(noteThird(true, OPENING)).toBe(true);
	});
});
