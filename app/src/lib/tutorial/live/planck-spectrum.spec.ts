/**
 * Chapter 10.1's black body, against Planck's law written out afresh in each variable, a numerical search for each
 * peak, numerical integrals for the totals, and the numbers the chapter prints.
 */
import { describe, expect, it } from 'vitest';
import {
	C,
	EV,
	F_AXIS,
	FACTOR_AXIS,
	H,
	HBAR,
	KB,
	MEAN_RATIO,
	MODE_ORDER,
	OPENING,
	PEAK_X,
	PRESETS,
	SIGMA_SB,
	T_MAX,
	T_MIN,
	TEMPERATURE,
	VISIBLE,
	Y_AXIS,
	count,
	frequencyText,
	logModes,
	logOccupation,
	logProduct,
	logQuantum,
	logSpectrum,
	logThermal,
	meanEnergy,
	numberText,
	numberTex,
	peak,
	planck,
	power,
	powers,
	presetOf,
	spectrum,
	temperatureText,
	wavelengthText,
	type Mode
} from './planck-spectrum';

// --- an independent Planck's law, written in each variable with h, not ħ ------------------------------------------------

/** B_ν per unit of the frequency ν, two polarizations, per steradian: 2hν³/c² · 1/(e^{hν/kT} − 1) (expm1 keeps
 * e^x − 1 exact where x is tiny). */
const Bnu = (nu: number, T: number) => (2 * H * nu ** 3) / C ** 2 / Math.expm1((H * nu) / (KB * T));
/** B_ω = B_ν dν/dω = B_ν/2π. */
const Bomega = (nu: number, T: number) => Bnu(nu, T) / (2 * Math.PI);
/** B_λ = 2hc²/λ⁵ · 1/(e^{hc/λkT} − 1), as a function of the wavelength. */
const Blambda = (lambda: number, T: number) =>
	(2 * H * C ** 2) / lambda ** 5 / Math.expm1((H * C) / (lambda * KB * T));
/** The count per unit of ω: B_ω/ħω = B_ω/hν. */
const Bcount = (nu: number, T: number) => Bomega(nu, T) / (H * nu);

/** The maximum of a function with one peak, by golden-section search in the logarithm of its argument. */
function argmax(fn: (v: number) => number, lo: number, hi: number): number {
	const g = (Math.sqrt(5) - 1) / 2;
	let a = Math.log(lo);
	let b = Math.log(hi);
	for (let i = 0; i < 200; i++) {
		const c = b - g * (b - a);
		const d = a + g * (b - a);
		if (fn(Math.exp(c)) > fn(Math.exp(d))) b = d;
		else a = c;
	}
	return Math.exp((a + b) / 2);
}

/** ∫ fn over (lo, hi) by Simpson's rule in the logarithm of the variable. */
function integrate(fn: (v: number) => number, lo: number, hi: number, n = 20000): number {
	const a = Math.log(lo);
	const b = Math.log(hi);
	const h = (b - a) / n;
	let s = 0;
	for (let i = 0; i <= n; i++) {
		const u = a + i * h;
		const v = Math.exp(u);
		const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
		s += w * fn(v) * v;
	}
	return (s * h) / 3;
}

const three = (x: number) => Number(x.toPrecision(3));
const four = (x: number) => Number(x.toPrecision(4));

describe('the constants', () => {
	it('are CODATA’s, with σ_SB = 5.670374419 × 10⁻⁸ W m⁻² K⁻⁴', () => {
		// CODATA prints ħ = 1.054571817… × 10⁻³⁴ J s, to ten figures
		expect(HBAR / 1.054571817e-34).toBeCloseTo(1, 8);
		expect(SIGMA_SB / 5.670374419e-8).toBeCloseTo(1, 9);
	});

	it('give the mean energy 2.701 k_BT', () => {
		expect(MEAN_RATIO).toBeCloseTo(2.701178, 6);
	});
});

describe('the three peaks', () => {
	it('are at x = 2.821, 4.965 and 1.594, the roots of x = n(1 − e^{−x})', () => {
		expect(PEAK_X.frequency).toBeCloseTo(2.821439372, 9);
		expect(PEAK_X.wavelength).toBeCloseTo(4.965114232, 9);
		expect(PEAK_X.count).toBeCloseTo(1.59362426, 9);
	});

	it('agree with a search for the maximum of each curve written out afresh, at every preset', () => {
		for (const T of [...Object.values(PRESETS), T_MIN, T_MAX]) {
			const nu = argmax((v) => Bomega(v, T), 1e6, 1e21);
			expect(peak('frequency', T).f / nu).toBeCloseTo(1, 7);
			const lam = argmax((l) => Blambda(l, T), 1e-13, 10);
			expect(peak('wavelength', T).lambda / lam).toBeCloseTo(1, 7);
			const nc = argmax((v) => Bcount(v, T), 1e6, 1e21);
			expect(peak('count', T).f / nc).toBeCloseTo(1, 7);
		}
	});

	it('at 293 K: 17.2 THz and 17.4 µm in energy, 9.73 THz (30.8 µm) in count, 9.89 µm per unit wavelength', () => {
		const e = peak('frequency', 293);
		expect(three(e.f / 1e12)).toBe(17.2);
		expect(three(e.lambda / 1e-6)).toBe(17.4);
		expect(frequencyText(e.f)).toEqual({ value: '17.2', unit: 'THz' });
		expect(wavelengthText(e.lambda).value + ' ' + wavelengthText(e.lambda).unit).toBe('17.4 µm');
		const n = peak('count', 293);
		expect(three(n.f / 1e12)).toBe(9.73);
		expect(three(n.lambda / 1e-6)).toBe(30.8);
		// the chapter's footnote: "9.9 µm"
		expect(three(peak('wavelength', 293).lambda / 1e-6)).toBe(9.89);
	});

	it('at the chapter’s other temperatures', () => {
		// 300 K: 17.6 THz; 0.905 K: 53 GHz, 5.6 mm; 2800 K: the count at 93 THz; the Sun's core: 0.39 nm
		expect(three(peak('frequency', 300).f / 1e12)).toBe(17.6);
		expect(Math.round(peak('frequency', 0.905).f / 1e9)).toBe(53);
		expect(Number((peak('frequency', 0.905).lambda / 1e-3).toFixed(1))).toBe(5.6);
		expect(Math.round(peak('count', 2800).f / 1e12)).toBe(93);
		expect(Number((peak('frequency', 1.3e7).lambda / 1e-9).toFixed(2))).toBe(0.39);
		// the practice problem at 5500 K: 323 THz, 0.927 µm; the count at 183 THz
		expect(Math.round(peak('frequency', 5500).f / 1e12)).toBe(323);
		expect(three(peak('frequency', 5500).lambda / 1e-6)).toBe(0.927);
		expect(Math.round(peak('count', 5500).f / 1e12)).toBe(183);
	});

	it('hold the occupations 0.0633, 0.00703 and 0.255, the same at every temperature', () => {
		expect(three(peak('frequency', 293).occupation)).toBe(0.0633);
		expect(three(peak('wavelength', 293).occupation)).toBe(0.00703);
		expect(three(peak('count', 293).occupation)).toBe(0.255);
		for (const m of MODE_ORDER) {
			expect(peak(m, 0.905).occupation).toBe(peak(m, 1.3e7).occupation);
		}
	});

	it('are the heights of the shapes x³, x⁵ and x² over e^x − 1 times their constants', () => {
		// 1.4214 at 2.821 and 0.6476 at 1.594, the chapter's numbers for 10.3
		const x3 = PEAK_X.frequency ** 3 / Math.expm1(PEAK_X.frequency);
		const x2 = PEAK_X.count ** 2 / Math.expm1(PEAK_X.count);
		expect(Number(x3.toFixed(4))).toBe(1.4214);
		expect(Number(x2.toFixed(4))).toBe(0.6476);
		const T = 293;
		const s = (KB * T) / HBAR;
		expect(
			peak('frequency', T).height / ((HBAR / (4 * Math.PI ** 3 * C ** 2)) * s ** 3 * x3)
		).toBeCloseTo(1, 10);
	});
});

describe('the curves', () => {
	it('agree with Planck’s law written out, per unit frequency, wavelength and count', () => {
		for (const T of [0.905, 293, 5500, 1.3e7]) {
			for (let lf = F_AXIS.low; lf <= F_AXIS.high; lf += 0.25) {
				const nu = 10 ** lf;
				const x = (H * nu) / (KB * T);
				if (x > 600) continue; // where the direct law underflows
				expect(spectrum('frequency', nu, T) / Bomega(nu, T)).toBeCloseTo(1, 9);
				expect(planck(2 * Math.PI * nu, T) / Bomega(nu, T)).toBeCloseTo(1, 9);
				expect(spectrum('wavelength', nu, T) / Blambda(C / nu, T)).toBeCloseTo(1, 9);
				expect(spectrum('count', nu, T) / Bcount(nu, T)).toBeCloseTo(1, 9);
			}
		}
	});

	it('stay finite in the logarithm far down the Wien tail, where the law itself underflows', () => {
		const ly = logSpectrum('frequency', F_AXIS.high, T_MIN);
		expect(Number.isFinite(ly)).toBe(true);
		expect(ly).toBeLessThan(-1e8);
		// n̄ = e^{−x} there, to every figure
		expect(logOccupation(1000)).toBeCloseTo(-1000 * Math.LOG10E, 9);
		expect(logOccupation(1e-6)).toBeCloseTo(6, 6);
	});

	it('are the product of the three factors, (c/4π) · ω²/π²c³ · n̄ · ħω', () => {
		for (const T of [0.905, 293, 1.3e7]) {
			for (let lf = F_AXIS.low; lf <= F_AXIS.high; lf += 0.5) {
				const ly = logSpectrum('frequency', lf, T);
				expect(Math.abs(logProduct(lf, T) - ly)).toBeLessThan(1e-12 * Math.max(1, Math.abs(ly)));
			}
		}
	});
});

describe('the totals', () => {
	it('at 293 K: σ_SB T⁴ = 417.9 W m⁻², and 418.8 at 293.15 K', () => {
		expect(four(power(293))).toBe(417.9);
		expect(four(power(293.15))).toBe(418.8);
		expect(numberText(power(293), 4)).toBe('417.9');
	});

	it('σ_SB T⁴ is π times the integral of B_ω, found numerically', () => {
		for (const T of [0.905, 293, 5500, 1.3e7]) {
			const total = integrate(
				(nu) => Bomega(nu, T) * 2 * Math.PI,
				(1e-4 * (KB * T)) / H,
				(80 * (KB * T)) / H
			);
			expect((Math.PI * total) / power(T)).toBeCloseTo(1, 8);
		}
	});

	it('N_bb is the integral of B_ω/ħω: 3.59 × 10¹⁴ for the 0.905 K graviton sky', () => {
		for (const T of [0.905, 293, 1.3e7]) {
			const n = integrate(
				(nu) => Bcount(nu, T) * 2 * Math.PI,
				(1e-6 * (KB * T)) / H,
				(80 * (KB * T)) / H
			);
			expect(n / count(T)).toBeCloseTo(1, 7);
		}
		expect(three(count(0.905))).toBe(3.59e14);
	});

	it('the mean energy is their ratio, 2.701 k_BT', () => {
		const T = 293;
		const e = integrate((nu) => Bomega(nu, T), (1e-6 * (KB * T)) / H, (80 * (KB * T)) / H);
		const n = integrate((nu) => Bcount(nu, T), (1e-6 * (KB * T)) / H, (80 * (KB * T)) / H);
		expect(e / n / meanEnergy(T)).toBeCloseTo(1, 7);
		// the chapter's 1.09 × 10⁻²⁰ J, 0.068 eV; 1.05 eV at 4500 K; 4.85 × 10⁻¹⁶ J in the Sun's core;
		// 0.349 eV at 1500 K; 2.05 × 10⁻¹⁹ J = 1.28 eV at 5500 K
		expect(three(meanEnergy(293))).toBe(1.09e-20);
		expect(Number((meanEnergy(293) / EV).toFixed(3))).toBe(0.068);
		expect(three(meanEnergy(4500) / EV)).toBe(1.05);
		expect(three(meanEnergy(1.3e7))).toBe(4.85e-16);
		expect(three(meanEnergy(1500) / EV)).toBe(0.349);
		expect(three(meanEnergy(5500))).toBe(2.05e-19);
		expect(three(meanEnergy(5500) / EV)).toBe(1.28);
	});
});

describe('the axes', () => {
	it('hold every peak, at either end of the slider, with room above it', () => {
		for (const m of MODE_ORDER as Mode[]) {
			const axis = Y_AXIS[m];
			for (const T of [T_MIN, T_MAX]) {
				const p = peak(m, T);
				const lf = Math.log10(p.f);
				expect(lf).toBeGreaterThan(F_AXIS.low + 1.5);
				expect(lf).toBeLessThan(F_AXIS.high - 0.5);
				const ly = Math.log10(p.height);
				expect(ly).toBeGreaterThan(axis.low + 5);
				expect(ly).toBeLessThan(axis.high - 2);
			}
			expect(powers(axis).length).toBeGreaterThanOrEqual(4);
		}
	});

	it('hold the factors across the axis', () => {
		expect(logModes(F_AXIS.low)).toBeGreaterThan(FACTOR_AXIS.modes.low);
		expect(logModes(F_AXIS.high)).toBeLessThan(FACTOR_AXIS.modes.high);
		expect(logQuantum(F_AXIS.low)).toBeGreaterThan(FACTOR_AXIS.quantum.low);
		expect(logQuantum(F_AXIS.high)).toBeLessThan(FACTOR_AXIS.quantum.high);
		expect(logThermal(T_MIN)).toBeGreaterThan(FACTOR_AXIS.quantum.low);
		expect(logThermal(T_MAX)).toBeLessThan(FACTOR_AXIS.quantum.high);
		// k_BT lies above the quantum at the left end at every temperature, so its label there is clear
		expect(logThermal(T_MIN)).toBeGreaterThan(logQuantum(F_AXIS.low) + 1);
	});

	it('mark visible light at 400 to 700 nm, 428 to 749 THz', () => {
		expect(Math.round(10 ** VISIBLE.low / 1e12)).toBe(428);
		expect(Math.round(10 ** VISIBLE.high / 1e12)).toBe(749);
	});
});

describe('the controls', () => {
	it('run from 0.5 K to 2 × 10⁷ K and open at 293 K per unit frequency', () => {
		expect(10 ** TEMPERATURE.low).toBeCloseTo(0.5, 12);
		expect(10 ** TEMPERATURE.high / 2e7).toBeCloseTo(1, 12);
		expect(OPENING).toEqual({ T: 293, mode: 'frequency' });
		for (const T of Object.values(PRESETS)) {
			expect(T).toBeGreaterThanOrEqual(T_MIN);
			expect(T).toBeLessThanOrEqual(T_MAX);
		}
	});

	it('know a preset when they see one', () => {
		expect(presetOf(293)).toBe('room');
		expect(presetOf(0.905)).toBe('sky');
		expect(presetOf(1.3e7)).toBe('sun');
		expect(presetOf(294)).toBeUndefined();
	});
});

describe('words and numbers', () => {
	it('write numbers to their figures', () => {
		expect(numberText(1.2175e22, 4)).toBe('1.218 × 10²²');
		expect(numberTex(1.2175e22, 4)).toBe('1.218 \\times 10^{22}');
		expect(numberText(0.0633, 3)).toBe('0.0633');
		expect(numberText(0.0682, 4)).toBe('0.06820');
		expect(numberText(1.0927e-20, 4)).toBe('1.093 × 10⁻²⁰');
	});

	it('write temperatures, frequencies and wavelengths in the chapter’s units', () => {
		expect(temperatureText(0.905)).toBe('0.905 K');
		expect(temperatureText(293)).toBe('293 K');
		expect(temperatureText(4500)).toBe('4500 K');
		expect(temperatureText(1.3e7)).toBe('1.30 × 10⁷ K');
		expect(frequencyText(peak('frequency', 0.905).f)).toEqual({ value: '53.2', unit: 'GHz' });
		expect(wavelengthText(peak('frequency', 0.905).lambda).unit).toBe('mm');
		expect(wavelengthText(peak('frequency', 1.3e7).lambda)).toMatchObject({
			value: '0.392',
			unit: 'nm'
		});
	});
});
