/**
 * Reading chapter R11's camera with a black hole in it, against values found here by other means: the SI constants
 * written out afresh, the orbit from Kepler's third law in the form ω² = GM/r³, the gathered area by adding up the
 * rays that meet the detector one thin ring of impact parameters at a time, and the numbers the chapter prints.
 */
import { describe, expect, it } from 'vitest';
import {
	BEARABLE,
	DETECTOR,
	DISTANCE,
	LOG_DISTANCE,
	LOG_MASS,
	MASS,
	M_EQ,
	OPENING,
	PERSON_TIDE,
	SPAN,
	angle,
	bearableDistance,
	camera,
	distanceFromLog,
	equalDistance,
	hawkingTemperature,
	landing,
	length,
	massFromLog,
	massText,
	numTex,
	numText,
	speedTex,
	tideOf,
	timeTex
} from './black-hole-camera';

/** The SI constants, written out afresh. */
const G_SI = 6.6743e-11;
const C_SI = 299792458;
const HBAR_SI = 1.054571817e-34;
const KB_SI = 1.380649e-23;
const ARCSEC = Math.PI / (180 * 3600);

/** The chapter's hole and the camera's distance at the opening, found here from r³ = 2GM/(1 s⁻²). */
const M = 1.356e23;
const R0 = (2 * G_SI * M) ** (1 / 3);

/** Agreement to `rel`, relative. */
const near = (a: number, b: number, rel: number) => expect(Math.abs(a / b - 1)).toBeLessThan(rel);

describe('the hole', () => {
	it('is the chapter’s equilibrium mass, 1.356 × 10²³ kg, at 0.905 K', () => {
		expect(M_EQ).toBe(1.356e23);
		const T = (HBAR_SI * C_SI ** 3) / (8 * Math.PI * G_SI * M * KB_SI);
		near(hawkingTemperature(M_EQ), T, 1e-12);
		expect(hawkingTemperature(M_EQ).toFixed(3)).toBe('0.905');
		expect(camera(1, R0).T_H.toFixed(3)).toBe('0.905');
		// ten times the mass, a tenth of the temperature
		near(camera(10, R0).T_H, T / 10, 1e-12);
	});

	it('has a Schwarzschild radius of 0.2 mm', () => {
		const rs = (2 * G_SI * M) / C_SI ** 2;
		near(camera(1, R0).rs, rs, 1e-12);
		expect(length(rs).text).toBe('0.201 mm');
	});
});

describe('the opening', () => {
	const c = camera(OPENING.mu, OPENING.r);

	it('puts the camera where the tide is 1.0 s⁻², 26.3 km away', () => {
		expect(OPENING.mu).toBe(1);
		near(OPENING.r, R0, 1e-12);
		expect(length(OPENING.r).text).toBe('26.3 km');
		near(c.tide, 1, 1e-12);
		expect(numText(c.tide, 2)).toBe('1.0');
		// and at 26.3 km itself the tide still reads 1.0
		expect(numText(tideOf(M, 26.3e3), 2)).toBe('1.0');
	});

	it('sees a ring of 25.5″ whose rays pass b_E = 3.25 m from the hole', () => {
		const rs = (2 * G_SI * M) / C_SI ** 2;
		const theta = Math.sqrt((2 * rs) / R0);
		near(c.theta, theta, 1e-12);
		expect((c.theta / ARCSEC).toFixed(1)).toBe('25.5');
		expect(angle(c.theta).text).toBe('25.5″');
		near(c.bE, theta * R0, 1e-12);
		expect(length(c.bE).text).toBe('3.25 m');
	});

	it('orbits in 8.89 s at 18.6 km s⁻¹', () => {
		// Kepler: ω² = GM/r³, and the speed is ωr
		const omega = Math.sqrt((G_SI * M) / R0 ** 3);
		near(c.period, (2 * Math.PI) / omega, 1e-12);
		near(c.speed, omega * R0, 1e-12);
		// where the tide 2GM/r³ is 1 s⁻², ω² is ½ s⁻², so the period is 2π√2 s
		near(c.period, 2 * Math.PI * Math.SQRT2, 1e-12);
		expect(c.period.toFixed(2)).toBe('8.89');
		expect((c.speed / 1e3).toFixed(1)).toBe('18.6');
		expect(timeTex(c.period)).toBe('8.89\\,\\mathrm{s}');
		expect(speedTex(c.speed)).toBe('18.6\\,\\mathrm{km\\,s^{-1}}');
	});

	it('holds a patch of sky in focus for 0.350 ms a turn', () => {
		// the axis sweeps 2θ_E at the angular speed 2π/T
		const sweep = (2 * c.theta) / ((2 * Math.PI) / c.period);
		near(c.focus, sweep, 1e-12);
		expect((c.focus * 1e3).toFixed(3)).toBe('0.350');
		expect(timeTex(c.focus)).toBe('0.350\\,\\mathrm{ms}');
	});

	it('gathers 1.02 m², 130 times πa², for a = 5 cm: a dish 1.14 m across', () => {
		expect(DETECTOR).toBe(0.05);
		expect(c.area.toFixed(2)).toBe('1.02');
		expect(Math.round(c.gain)).toBe(130);
		expect(c.dish.toFixed(2)).toBe('1.14');
		near(c.gain, c.area / (Math.PI * 0.05 ** 2), 1e-12);
	});

	it('feels 1.07 × 10⁸ times the person’s tide', () => {
		const person = (2 * G_SI * 70) / 1 ** 3;
		near(PERSON_TIDE, person, 1e-12);
		expect(numText(PERSON_TIDE)).toBe('9.34 × 10⁻⁹');
		near(c.overPerson, 1 / person, 1e-12);
		expect(numText(c.overPerson)).toBe('1.07 × 10⁸');
		expect(numTex(c.overPerson)).toBe('1.07 \\times 10^{8}');
	});

	it('is outdone by the person only beyond 12,470 km', () => {
		const r = (M / 70) ** (1 / 3);
		near(equalDistance(M_EQ), r, 1e-12);
		expect(Math.round(r / 1e4) * 10).toBe(12470);
		near(tideOf(M, r), PERSON_TIDE, 1e-12);
		expect(length(r).text).toBe('12,500 km');
	});
});

describe('ten times the mass', () => {
	it('makes the bearable distance 56.6 km', () => {
		const r = (2 * G_SI * 10 * M) ** (1 / 3);
		near(bearableDistance(10 * M_EQ), r, 1e-12);
		expect(length(r).text).toBe('56.6 km');
		near(camera(10, r).tide, BEARABLE, 1e-12);
		// at the opening's distance its tide is ten times larger
		near(camera(10, R0).tide, 10, 1e-12);
	});
});

describe('the laws', () => {
	it('grow the tide as 1/r³ and the ring as 1/√r', () => {
		const a = camera(1, R0);
		const b = camera(1, R0 / 2);
		near(b.tide / a.tide, 8, 1e-12);
		near(b.theta / a.theta, Math.SQRT2, 1e-12);
		near(b.bE / a.bE, Math.SQRT1_2, 1e-12);
	});

	it('gather through the annulus whose rays land on the detector', () => {
		for (const r of [1, 30, R0, 1e6]) {
			const c = camera(1, r);
			// the ends of the annulus land on the edge of the detector, on opposite sides
			near(landing(c.bPlus, c.bE), DETECTOR, 1e-9);
			near(landing(c.bMinus, c.bE), -DETECTOR, 1e-9);
			// add up the thin rings of impact parameter whose rays land within a of the axis
			const lo = 0;
			const hi = c.bE + 2 * DETECTOR;
			const n = 1000000;
			const db = (hi - lo) / n;
			let sum = 0;
			for (let i = 0; i < n; i++) {
				const b = lo + (i + 0.5) * db;
				if (Math.abs(landing(b, c.bE)) < DETECTOR) sum += 2 * Math.PI * b * db;
			}
			near(sum, c.area, 1e-3);
		}
	});
});

describe('the sliders and the plot', () => {
	it('run from 1 m to 10⁵ km and from 0.3 to 30 equilibrium masses, on scales of powers of ten', () => {
		expect(DISTANCE.min).toBe(1);
		expect(DISTANCE.max).toBe(1e8);
		expect(LOG_DISTANCE).toEqual({ low: 0, high: 8 });
		expect(DISTANCE.key).toBe(0.01);
		expect(DISTANCE.page).toBe(0.1);
		expect(MASS.min).toBe(0.3);
		expect(MASS.max).toBe(30);
		near(LOG_MASS.high - LOG_MASS.low, 2, 1e-12);
		expect(distanceFromLog(-1)).toBe(1);
		expect(distanceFromLog(9)).toBe(1e8);
		near(massFromLog(1), 10, 1e-12);
		near(massFromLog(3), 30, 1e-12);
		expect(massText(1)).toBe('1.00');
		expect(massText(10)).toBe('10.0');
	});

	it('keeps the tide on the plot at every setting', () => {
		const top = tideOf(MASS.max * M_EQ, DISTANCE.min);
		const bottom = tideOf(MASS.min * M_EQ, DISTANCE.max);
		expect(Math.log10(top)).toBeLessThan(SPAN.tide[1]);
		expect(Math.log10(bottom)).toBeGreaterThan(SPAN.tide[0]);
		expect(Math.log10(PERSON_TIDE)).toBeGreaterThan(SPAN.tide[0]);
	});
});

describe('the words', () => {
	it('write numbers, lengths, angles and times as the chapter does', () => {
		expect(numText(1.8e13)).toBe('1.80 × 10¹³');
		expect(numTex(0.35)).toBe('0.350');
		expect(numText(9.996, 3)).toBe('10.0');
		expect(length(0.05).text).toBe('5.00 cm');
		expect(length(6.04e-5).text).toBe('0.0604 mm');
		expect(length(1234.5).tex).toBe('1.23\\,\\mathrm{km}');
		expect(length(1e8).text).toBe('100,000 km');
		expect(length(1e8).tex).toBe('100{,}000\\,\\mathrm{km}');
		// a metre from one M_eq the ring is 1.15°
		const c = camera(1, 1);
		expect(angle(c.theta).text).toBe('1.15°');
		expect(numText(c.tide, 2)).toBe('1.8 × 10¹³');
		expect(angle(Math.PI / (180 * 60 * 2)).text).toBe('30.0″');
		expect(angle((2 * Math.PI) / (180 * 60)).text).toBe('2.00′');
		expect(timeTex(2e-6)).toBe('2.00\\,\\mu\\mathrm{s}');
		expect(timeTex(3 * 86400)).toBe('3.00\\,\\mathrm{days}');
		expect(speedTex(164)).toBe('164\\,\\mathrm{m\\,s^{-1}}');
		expect(speedTex(1.65e7)).toBe('16{,}500\\,\\mathrm{km\\,s^{-1}}');
		expect(timeTex(1.33e-8)).toBe('13.3\\,\\mathrm{ns}');
		expect(timeTex(3.81e-7)).toBe('0.381\\,\\mu\\mathrm{s}');
	});
});
