/**
 * The quantum tremor's arithmetic (quantum-tremor.ts): the jitter by quadrature against the undamped closed form, the
 * damped closed form at absolute zero and the Matsubara sum when warm; one damped mode's share of the upper bound at
 * absolute zero for four widths; five modes an octave apart; the two carts; the bounds for random bodies at random
 * temperatures; the two orders and their average; the quantum thermometer; the slider with its stop at zero; the
 * predictions and the words.
 */
import { describe, expect, it } from 'vitest';
import {
	BALL,
	CARTS,
	COLD,
	DAMPING,
	HBAR,
	KB,
	OPENING,
	PRESETS,
	TEMPERATURE,
	WARM,
	bodyOf,
	boundCurves,
	classical,
	classicalThermometer,
	cothFactor,
	generator,
	imChi,
	imChiOverOmega,
	integrate,
	isZero,
	jitter,
	kelvinWords,
	linearAxis,
	lowerBound,
	modeJitter,
	noteFirst,
	noteSecond,
	occupation,
	octaveModes,
	omegaCoth,
	randomModes,
	reading,
	responseSum,
	rmsFrequency,
	single,
	snapTemperature,
	spanAt,
	spectrumSamples,
	staticCompliance,
	stepTemperature,
	strongest,
	symmetrized,
	thermometer,
	thermometers,
	thetaOf,
	thetaWords,
	three,
	undampedJitter,
	unsymmetrized,
	upperBound,
	widen,
	within,
	zeroPoint,
	type Mode
} from './quantum-tremor';

const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);
const mode = (q: number, x = 1, share = 1): Mode => ({ x, share, q });

/** A damped mode's jitter at absolute zero in closed form: (c²/2Ω)(1 − (2/π) arctan(Γ/2Ω)), Ω² = ω₀² − Γ²/4. */
function dampedZero(m: Mode) {
	const g = m.q * m.x;
	const W = Math.sqrt(m.x * m.x - (g * g) / 4);
	return ((m.share * m.x * m.x) / (2 * W)) * (1 - (2 / Math.PI) * Math.atan(g / (2 * W)));
}

/**
 * The same jitter when warm, as Matsubara's sum k_BT Σ_k χ(iν_k), ν_k = 2πk k_BT/ħ, with χ(iν) = c²/(ω₀² + ν² +
 * Γν) for ν ≥ 0: a different road to the same number, by the response at imaginary frequencies.
 */
function matsubara(ms: readonly Mode[], theta: number, K = 400000) {
	const chi = (nu: number) =>
		ms.reduce((s, m) => s + (m.share * m.x * m.x) / (m.x * m.x + nu * nu + m.q * m.x * nu), 0);
	let sum = 0;
	for (let k = K; k >= 1; k--) sum += chi(2 * Math.PI * k * theta);
	// the tail beyond K: A/ν_k² summed, Σ_{k>K} 1/k² ≈ 1/K − 1/2K² + 1/6K³
	const tail =
		(responseSum(ms) / (4 * Math.PI * Math.PI * theta * theta)) * (1 / K - 1 / (2 * K * K));
	return theta * (chi(0) + 2 * (sum + tail));
}

describe('the constants and the bodies', () => {
	it('uses ħ = 1.0546 × 10⁻³⁴ J s, k_B = 1.380649 × 10⁻²³ J/K and Γ_n = 0.05 ω_n', () => {
		expect(HBAR).toBe(1.0546e-34);
		expect(KB).toBe(1.380649e-23);
		expect(DAMPING).toBe(0.05);
	});

	it('gives the steel ball 15.1 kHz, ħω = 1.0 × 10⁻²⁹ J and the zero point 7.5 × 10⁻²¹ m', () => {
		expect(BALL.omega / (2 * Math.PI)).toBeCloseTo(15099, 0);
		expect(HBAR * BALL.omega).toBeCloseTo(1.0e-29, 31);
		expect(BALL.mass).toBeCloseTo(9.87, 2);
		// x_zp = √(ħ/2mω)
		expect(Math.sqrt(HBAR / (2 * BALL.mass * BALL.omega))).toBeCloseTo(7.5e-21, 22);
	});

	it('gives the two carts lines at 5 and 8.66 s⁻¹ of weight 1/2m, χ₀ = 1/75 m/N, shares 3/4 and 1/4', () => {
		expect(CARTS.omegas[1]).toBeCloseTo(8.66, 2);
		expect(CARTS.c2).toBe(0.25);
		expect(CARTS.chi0).toBeCloseTo(1 / 75, 12);
		const b = bodyOf('carts');
		expect(b.modes.map((m) => m.share)).toEqual([
			expect.closeTo(0.75, 12),
			expect.closeTo(0.25, 12)
		]);
		expect(b.modes[1].x).toBeCloseTo(Math.sqrt(3), 12);
	});

	it('builds every preset with χ₀ = 1 and its lowest mode at ω₁', () => {
		const random = randomModes(generator(7));
		for (const p of PRESETS) {
			const b = bodyOf(p, random);
			expect(staticCompliance(b.modes)).toBeCloseTo(1, 12);
			expect(b.modes[0].x).toBe(1);
			expect(b.modes.every((m, i) => i === 0 || m.x >= b.modes[i - 1].x)).toBe(true);
			expect(b.most).toBeGreaterThan(b.modes[b.modes.length - 1].x);
		}
		expect(random).toHaveLength(5);
		expect(random.every((m) => m.x >= 1 && m.x <= 10 && m.q === DAMPING)).toBe(true);
		expect(single('ball') && single('one') && !single('carts') && !single('octaves')).toBe(true);
	});

	it('gives five modes an octave apart √(A/χ₀) = 8.26 ω₁', () => {
		expect(rmsFrequency(octaveModes())).toBeCloseTo(Math.sqrt(68.2), 12);
		expect(rmsFrequency(octaveModes())).toBeCloseTo(8.26, 2);
	});
});

describe('the factors of heat', () => {
	it('takes coth and n̄ to their limits at absolute zero and keeps 2n̄ + 1 = coth', () => {
		expect(cothFactor(1, 0)).toBe(1);
		expect(occupation(1, 0)).toBe(0);
		expect(omegaCoth(2, 0)).toBe(2);
		for (const theta of [0.01, 0.3, 1, 7, 100])
			for (const w of [1e-6, 0.01, 1, 3, 40])
				expect(rel(2 * occupation(w, theta) + 1, cothFactor(w, theta))).toBeLessThan(1e-9);
		expect(cothFactor(1, 1)).toBeCloseTo(1 / Math.tanh(0.5), 12);
		// ω coth(ħω/2k_BT) → 2k_BT/ħ at ω = 0, and is even
		expect(omegaCoth(0, 3)).toBe(6);
		expect(omegaCoth(-2, 1.5)).toBe(omegaCoth(2, 1.5));
	});
});

describe('the spectra', () => {
	const ms = bodyOf('octaves').modes;

	it('averages the two orders to S̄, differs by 2ħ Im χ, and keeps detailed balance', () => {
		for (const theta of [0, 0.1, 1, 10])
			for (const w of [0.3, 1, 2.5, 16]) {
				const plus = unsymmetrized(ms, w, theta);
				const minus = unsymmetrized(ms, -w, theta);
				expect(rel((plus + minus) / 2, symmetrized(ms, w, theta))).toBeLessThan(1e-12);
				expect(rel(plus - minus, 2 * imChi(ms, w))).toBeLessThan(1e-12);
				if (theta > 0 && w / theta < 300)
					expect(rel(minus / plus, Math.exp(-w / theta))).toBeLessThan(1e-9);
			}
	});

	it('has no emission at absolute zero, where S̄ is ħ Im χ', () => {
		expect(unsymmetrized(ms, -1, 0)).toBe(0);
		expect(symmetrized(ms, 1, 0)).toBeCloseTo(imChi(ms, 1), 14);
		expect(classical(ms, 1, 0)).toBe(0);
	});

	it('meets the classical 2k_BT Im χ/ω when ħω ≪ k_BT, and stands above it by u coth u', () => {
		expect(rel(symmetrized(ms, 0.01, 100), classical(ms, 0.01, 100))).toBeLessThan(1e-8);
		const u = 1 / 2;
		expect(symmetrized(ms, 1, 1) / classical(ms, 1, 1)).toBeCloseTo(u / Math.tanh(u), 12);
		expect(symmetrized(ms, -1, 1)).toBe(symmetrized(ms, 1, 1));
		expect(imChi(ms, -2)).toBe(-imChi(ms, 2));
	});

	it('draws diagram tut-qfd-two-orders: peaks 3.164, 1.164 and 2.164 of ħ Im χ for Γ = 0.08 ω₀ at k_BT = ħω₀', () => {
		const cart = [mode(0.08)];
		const peak = imChi(cart, 1);
		expect(unsymmetrized(cart, 1, 1) / peak).toBeCloseTo(3.164, 3);
		expect(unsymmetrized(cart, -1, 1) / peak).toBeCloseTo(1.164, 3);
		expect(symmetrized(cart, 1, 1) / peak).toBeCloseTo(2.164, 3);
		expect(classical(cart, 1, 1) / peak).toBeCloseTo(2, 12);
		expect(unsymmetrized(cart, 1, 1) / unsymmetrized(cart, -1, 1)).toBeCloseTo(Math.E, 12);
		// the inset at k_BT = 0.1 ħω₀: the emission 9 × 10⁻⁵ of the peak, the symmetrized 1
		expect(unsymmetrized(cart, -1, 0.1) / peak).toBeCloseTo(9.08e-5, 6);
		expect(symmetrized(cart, 1, 0.1) / peak).toBeCloseTo(1, 3);
	});

	it('has a weight μ of total one whose mean of ω² is A/χ₀', () => {
		for (const ms2 of [bodyOf('one').modes, bodyOf('carts').modes, octaveModes(0.2)]) {
			let total = 0;
			let second = 0;
			for (const m of ms2) {
				const half = (m.q * m.x) / 2;
				const a = Math.atan(-m.x / half);
				const at = (phi: number, power: number) => {
					if (phi >= Math.PI / 2) return power === 0 ? 0 : (4 * m.share * m.x * m.x) / Math.PI;
					const tan = Math.tan(phi);
					const w = m.x + half * tan;
					return (2 / Math.PI) * imChiOverOmega([m], w) * w ** power * half * (1 + tan * tan);
				};
				total += integrate((p) => at(p, 0), a, Math.PI / 2, 1e-12);
				second += integrate((p) => at(p, 2), a, Math.PI / 2, 1e-12);
			}
			expect(total).toBeCloseTo(staticCompliance(ms2), 7);
			expect(second).toBeCloseTo(responseSum(ms2), 5);
		}
	});

	it('samples every line closely and stays on the axis', () => {
		const s = spectrumSamples(ms, 0, 20);
		expect(s[0]).toBe(0);
		expect(s[s.length - 1]).toBe(20);
		expect(s.filter((w) => Math.abs(w - 1) < 0.6).length).toBeGreaterThan(90);
		const two = spectrumSamples(ms, -20, 20);
		expect(two.filter((w) => Math.abs(w + 1) < 0.6).length).toBeGreaterThan(90);
		expect(two.every((w, i) => i === 0 || w > two[i - 1])).toBe(true);
	});
});

describe('the jitter by quadrature', () => {
	it('meets the closed form ½ħ(c²/ω₀) coth(ħω₀/2k_BT) as the line narrows', () => {
		for (const theta of [0, 0.05, 0.3, 1, 3, 30]) {
			const exact = 0.5 * cothFactor(1, theta);
			expect(rel(modeJitter(mode(1e-4), theta), exact)).toBeLessThan(1e-4);
			expect(rel(modeJitter(mode(1e-3), theta), exact)).toBeLessThan(1e-3);
			expect(modeJitter(mode(0), theta)).toBe(exact);
		}
	});

	it('meets the damped closed form at absolute zero', () => {
		for (const q of [0.001, 0.01, 0.05, 0.1, 0.5, 1.5])
			for (const [x, share] of [
				[1, 1],
				[3.7, 0.3]
			]) {
				const m = mode(q, x, share);
				expect(rel(modeJitter(m, 0), dampedZero(m))).toBeLessThan(1e-8);
			}
	});

	it('meets Matsubara’s sum when warm', () => {
		for (const ms of [[mode(0.05)], [mode(0.5)], bodyOf('carts').modes, octaveModes()])
			for (const theta of [0.2, 1, 5])
				expect(rel(jitter(ms, theta), matsubara(ms, theta))).toBeLessThan(1e-7);
	});

	it('puts one damped mode at 0.984 of the upper bound at absolute zero, closer when warm', () => {
		const share = (q: number, theta = 0) => jitter([mode(q)], theta) / upperBound([mode(q)], theta);
		expect(share(0.05)).toBeCloseTo(0.984, 3);
		expect(share(0.05).toFixed(2)).toBe('0.98');
		// the chapter's footnote: 0.997, 0.969 and 0.867 at Γ/ω₀ = 0.01, 0.1 and 0.5
		expect(share(0.01).toFixed(3)).toBe('0.997');
		expect(share(0.1).toFixed(3)).toBe('0.969');
		expect(share(0.5).toFixed(3)).toBe('0.867');
		let last = share(0.05);
		for (const theta of [0.1, 0.3, 1, 3, 10, 100]) {
			const s = share(0.05, theta);
			expect(s).toBeLessThan(1);
			expect(s).toBeGreaterThanOrEqual(last - 1e-12);
			last = s;
		}
	});

	it('gives five modes an octave apart 0.751 of the upper bound at zero undamped, 0.739 damped', () => {
		const undamped = octaveModes(0);
		expect((zeroPoint(undamped) / upperBound(undamped, 0)).toFixed(3)).toBe('0.751');
		const damped = octaveModes();
		expect((jitter(damped, 0) / upperBound(damped, 0)).toFixed(3)).toBe('0.739');
		// diagram tut-qfd-bounds, undamped, in units of ħω₁χ₀
		expect(zeroPoint(undamped)).toBeCloseTo(3.1, 12);
		expect(upperBound(undamped, 0)).toBeCloseTo(4.129, 3);
		const at = [
			[1, 3.29],
			[3, 4.45],
			[10, 10.55],
			[100, 100.06]
		];
		for (const [theta, v] of at) expect(undampedJitter(undamped, theta)).toBeCloseTo(v, 2);
	});

	it('gives the two carts at k_BT = ħ × 5 s⁻¹ 1.121 against 1.122 of k_BTχ₀', () => {
		const b = bodyOf('carts');
		const theta = 1; // k_BT/ħω₁ with ω₁ = 5 s⁻¹
		const undamped = b.modes.map((m) => ({ ...m, q: 0 }));
		expect((undampedJitter(undamped, theta) / lowerBound(undamped, theta)).toFixed(3)).toBe(
			'1.121'
		);
		expect((upperBound(b.modes, theta) / lowerBound(b.modes, theta)).toFixed(3)).toBe('1.122');
		// with the lines' width 0.05 ω_n, as the figure draws them, the jitter is 1.120; the bound does not change
		expect((jitter(b.modes, theta) / lowerBound(b.modes, theta)).toFixed(3)).toBe('1.120');
	});

	it('never breaks the bounds, for random bodies at random temperatures', () => {
		const random = generator(2026);
		for (let trial = 0; trial < 60; trial++) {
			const q = [0.01, 0.05, 0.2, 0.6][trial % 4];
			const ms = randomModes(random, q);
			for (let k = 0; k < 4; k++) {
				const theta = k === 0 ? 0 : 10 ** (-2 + 4 * random());
				const j = jitter(ms, theta);
				expect(j).toBeGreaterThanOrEqual(lowerBound(ms, theta) * (1 - 1e-9));
				expect(j).toBeLessThanOrEqual(upperBound(ms, theta) * (1 + 1e-9));
				expect(j).toBeGreaterThan(0);
			}
		}
	});

	it('keeps the zero point at absolute zero and meets k_BTχ₀ when hot', () => {
		const ms = octaveModes();
		expect(lowerBound(ms, 0)).toBe(0);
		expect(jitter(ms, 0)).toBeGreaterThan(3);
		expect(rel(jitter(ms, 100), 100)).toBeLessThan(0.002);
		expect(rel(upperBound(ms, 100), 100)).toBeLessThan(0.0006);
	});

	it('draws the curves for the right panel, the jitter always between the bounds', () => {
		const c = boundCurves(octaveModes());
		expect(c.points).toHaveLength(161);
		expect(c.points[0].t).toBe(-2);
		expect(c.points[160].t).toBe(2);
		expect(c.zero.lower).toBe(0);
		for (const p of [...c.points, c.zero]) {
			expect(p.jitter).toBeGreaterThanOrEqual(p.lower);
			expect(p.jitter).toBeLessThanOrEqual(p.upper);
		}
	});
});

describe('the thermometer', () => {
	it('returns the set temperature from the strongest line, at every temperature on the slider', () => {
		const random = randomModes(generator(3));
		for (const p of PRESETS) {
			const ms = bodyOf(p, random).modes;
			for (let v = TEMPERATURE.min; v <= TEMPERATURE.max + 1e-9; v += 0.25) {
				const theta = thetaOf(v);
				const t = thermometers(ms, theta);
				// a line with ħω > 700 k_BT has an emission of e^-700 of its absorption, below what a double holds
				expect(t.frozen).toBe(t.w / theta > 700);
				if (!t.frozen) expect(rel(t.quantum, theta)).toBeLessThan(1e-9);
				// the classical one reads (ω/2) coth(ħω/2k_BT) in these units, never less than the truth
				expect(rel(t.classical, (t.w / 2) * cothFactor(t.w, theta))).toBeLessThan(1e-12);
				expect(t.classical).toBeGreaterThanOrEqual(theta);
			}
			// at absolute zero: the quantum one reads 0, the classical one the zero point ħω/2k_B
			const t = thermometers(ms, 0);
			expect(t.quantum).toBe(0);
			expect(t.frozen).toBe(false);
			expect(t.classical).toBeCloseTo(t.w / 2, 12);
		}
	});

	it('picks the line of the largest share, the lowest of equals', () => {
		expect(strongest(octaveModes()).x).toBe(1);
		expect(strongest(bodyOf('carts').modes).x).toBe(1);
		expect(strongest([mode(0.05, 1, 0.2), mode(0.05, 3, 0.5), mode(0.05, 5, 0.3)]).x).toBe(3);
	});

	it('reads silicon’s Raman line at 300 K as 300 K, where the classical one reads 442 K', () => {
		// 15.6 THz at 300 K: u = ħω/2k_BT = 1.248, ħ Im χ/S̄ = tanh u = 0.848
		const w = 2 * Math.PI * 15.6e12;
		const u = (HBAR * w) / (2 * KB * 300);
		expect(u).toBeCloseTo(1.248, 3);
		expect(Math.tanh(u)).toBeCloseTo(0.848, 3);
		// in units with ħω = 1 the thermometer's reading is k_BT/ħω
		const theta = 1 / (2 * u);
		const im = 1;
		const sbar = 1 / Math.tanh(u);
		expect(thermometer(1, im, sbar) * ((HBAR * w) / KB)).toBeCloseTo(300, 6);
		expect(classicalThermometer(1, im, sbar) * ((HBAR * w) / KB)).toBeCloseTo(441.6, 1);
		expect(theta).toBeGreaterThan(0);
	});

	it('keeps its figures in a frozen line, from the emission', () => {
		const ms = [mode(0.05)];
		const t = thermometers(ms, 0.01);
		// tanh 50 is 1 to every figure a double holds: z alone would read absolute zero
		expect(t.im / t.sbar).toBe(1);
		expect(thermometer(t.w, t.im, t.sbar)).toBe(0);
		expect(rel(t.quantum, 0.01)).toBeLessThan(1e-9);
	});
});

describe('the readings', () => {
	it('reads ⟨δy²⟩/k_BTχ₀ as infinite at absolute zero and the jitter over the upper bound', () => {
		const r = reading(bodyOf('octaves'), 0);
		expect(r.overLower).toBe(Infinity);
		expect(r.overUpper.toFixed(3)).toBe('0.739');
		expect(r.rms).toBeCloseTo(8.258, 3);
		expect(r.kelvin).toBeUndefined();
		const warm = reading(bodyOf('carts'), 1);
		expect(warm.overLower.toFixed(3)).toBe('1.120');
		expect((warm.upper / warm.lower).toFixed(3)).toBe('1.122');
		expect(warm.rmsPerSecond).toBeCloseTo(Math.sqrt(37.5), 10);
	});

	it('gives the steel ball its temperature in kelvin and its swing in metres', () => {
		const one = reading(bodyOf('ball'), 1);
		expect(one.kelvin).toBeCloseTo(7.247e-7, 9);
		expect(kelvinWords(one.kelvin!)).toBe('725 nK');
		const cold = reading(bodyOf('ball'), 0);
		// the damped line keeps 0.984 of the zero point's square: √0.984 × 7.50 × 10⁻²¹ m
		expect(cold.rmsReading! / 1e-21).toBeCloseTo(7.445, 3);
		expect(cold.rmsPerSecond).toBeCloseTo(BALL.omega, 6);
	});
});

describe('the temperature slider', () => {
	it('has a stop at exactly zero below its left end', () => {
		expect(thetaOf(TEMPERATURE.zero)).toBe(0);
		expect(isZero(TEMPERATURE.zero)).toBe(true);
		expect(isZero(TEMPERATURE.min)).toBe(false);
		expect(thetaOf(TEMPERATURE.min)).toBeCloseTo(0.01, 14);
		expect(thetaOf(0)).toBe(1);
		expect(thetaOf(2)).toBe(100);
	});

	it('snaps a drag onto the stop, the ends and its grid of hundredths', () => {
		expect(snapTemperature(-2.2)).toBe(TEMPERATURE.zero);
		expect(snapTemperature(-2.1)).toBe(-2);
		expect(snapTemperature(-2.004)).toBe(-2);
		expect(snapTemperature(0.123)).toBe(0.12);
		expect(snapTemperature(-0.004)).toBe(0);
		expect(snapTemperature(5)).toBe(2);
		expect(snapTemperature(Number.NaN)).toBe(TEMPERATURE.zero);
	});

	it('steps by a twentieth of a decade, a quarter with Shift, onto the stop and off it', () => {
		expect(stepTemperature(0, 'ArrowRight', false)).toBe(0.05);
		expect(stepTemperature(0.12, 'ArrowLeft', false)).toBe(0.1);
		expect(stepTemperature(0, 'ArrowUp', true)).toBe(0.25);
		expect(stepTemperature(0, 'PageDown', false)).toBe(-0.25);
		expect(stepTemperature(-2, 'ArrowLeft', false)).toBe(TEMPERATURE.zero);
		expect(stepTemperature(-1.97, 'ArrowLeft', false)).toBe(-2);
		expect(stepTemperature(TEMPERATURE.zero, 'ArrowRight', false)).toBe(-2);
		expect(stepTemperature(TEMPERATURE.zero, 'ArrowLeft', false)).toBe(TEMPERATURE.zero);
		expect(stepTemperature(1.98, 'ArrowRight', true)).toBe(2);
		expect(stepTemperature(1, 'Home', false)).toBe(TEMPERATURE.zero);
		expect(stepTemperature(1, 'End', false)).toBe(2);
		expect(stepTemperature(1, 'a', false)).toBeUndefined();
	});
});

describe('the predictions', () => {
	it('answers the first once the body is at absolute zero', () => {
		expect(noteFirst(false, OPENING.t)).toBe(false);
		expect(noteFirst(false, -2)).toBe(false);
		expect(noteFirst(false, TEMPERATURE.zero)).toBe(true);
		expect(noteFirst(true, 1)).toBe(true);
	});

	it('answers the second once a single mode has been both cold and warm', () => {
		let s = spanAt(0);
		expect(noteSecond(false, 'one', s)).toBe(false);
		s = widen(s, -1);
		expect(noteSecond(false, 'one', s)).toBe(false);
		s = widen(s, 1);
		expect(noteSecond(false, 'one', s)).toBe(true);
		expect(noteSecond(false, 'ball', s)).toBe(true);
		expect(noteSecond(false, 'octaves', s)).toBe(false);
		expect(noteSecond(false, 'one', widen(spanAt(TEMPERATURE.zero), 1.5))).toBe(true);
		expect(noteSecond(false, 'one', widen(spanAt(-0.9), 2))).toBe(false);
		expect(noteSecond(true, 'carts', spanAt(0))).toBe(true);
		expect(COLD).toBe(-1);
		expect(WARM).toBe(1);
	});

	it('widens the span only when the slider leaves it', () => {
		const s = spanAt(0);
		expect(widen(s, 0)).toBe(s);
		expect(widen(widen(s, 0.5), -0.5)).toEqual({ low: -0.5, high: 0.5 });
		expect(within({ low: -0.5, high: 0.5 }, 0.2)).toBe(true);
		expect(within({ low: -0.5, high: 0.5 }, 0.7)).toBe(false);
	});
});

describe('the words and the axes', () => {
	it('writes numbers and temperatures', () => {
		expect(three(3.10456)).toBe('3.1');
		expect(thetaWords(0)).toBe('0');
		expect(thetaWords(0.0316)).toBe('0.0316');
		expect(kelvinWords(0)).toBe('0 K');
		expect(kelvinWords(7.25e-9)).toBe('7.25 nK');
		expect(kelvinWords(300)).toBe('300 K');
	});

	it('fits a linear axis with ticks at 1, 2 or 5 × 10^k', () => {
		expect(linearAxis(43)).toEqual({ top: 50, step: 10, ticks: [0, 10, 20, 30, 40, 50] });
		const a = linearAxis(0.0042);
		expect(a.step).toBeCloseTo(0.001, 12);
		expect(a.top).toBeGreaterThanOrEqual(0.0042);
		expect(linearAxis(20).top).toBeGreaterThanOrEqual(20);
	});
});
