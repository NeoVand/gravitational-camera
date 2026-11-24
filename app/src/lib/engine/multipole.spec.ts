/**
 * The all-zone tide in the plane (multipole.ts) against its closed form, its two asymptotes, Newton's law for the two
 * masses, the closed-form tide of a turning quadrupole (../pixel/quadrupole.ts, itself checked against the reference's
 * finite differences of the metric), and the table behind the paper's fig:binary-field (reference/fixtures/vistas.json).
 */
import { describe, expect, it } from 'vitest';
import vistas from '../../../../reference/fixtures/vistas.json';
import { quadrupoleTerms, turningQuadrupole } from '../pixel/quadrupole';
import type { Vec3 } from './types';
import { C, G } from './physics/constants';
import {
	CROSSING,
	CROSSING_KR,
	LAW3,
	LAW3_KR,
	M_SUN,
	boundPair,
	bracket,
	bracketPhase,
	bracketSquared,
	crossingDistance,
	deltaI,
	farLaw,
	farOverNear,
	lawAt,
	localLaw,
	nearLaw,
	orbitalSpeed,
	overFar,
	overNear,
	pairAngle,
	patternPhase,
	planeAmplitude,
	planeTide,
	scaledExact,
	scaledFar,
	scaledNear,
	wavelength,
	wavenumber,
	type Pair
} from './multipole';

const close = (a: number, b: number, rel: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(rel * Math.max(Math.abs(a), Math.abs(b)));

/** The paper's pair: thirty Suns each, 2200 km apart, on Kepler's orbit. */
const holes = boundPair(30 * M_SUN, 2.2e6);
const lambda = wavelength(holes.omega);
const k = wavenumber(holes.omega);

const xs = [0.01, 0.05, 0.2, 0.7, 1, 1.5, CROSSING_KR, 3, 7, 20, 100];

describe('the bracket', () => {
	it('has the closed-form squared size', () => {
		for (const x of xs) {
			const [re, im] = bracket(x);
			close(bracketSquared(x), re * re + im * im, 1e-14);
		}
	});

	it('is −15 near the pair and (kr)⁴ far away', () => {
		close(bracket(1e-4)[0], -15, 1e-7);
		expect(Math.abs(bracketPhase(1e-6) - Math.PI)).toBeLessThan(1e-5);
		close(bracket(1e3)[0], 1e12, 1e-5);
		// far away the phase falls as 2/kr
		close(bracketPhase(1e4), 2e-4, 1e-4);
	});

	it('has no first-order term once the retarded phase is put back: −15(1 − ikr)e^{ikr} = −15 + O((kr)²)', () => {
		// the bracket times e^{ikr}, to first order in kr, is −15 − 15ikr + 15ikr = −15
		for (const x of [1e-3, 3e-3]) {
			const [re, im] = bracket(x);
			const c = Math.cos(x);
			const s = Math.sin(x);
			const total: [number, number] = [re * c - im * s, re * s + im * c];
			expect(Math.abs(total[1])).toBeLessThan(20 * x ** 2);
			expect(Math.abs(total[0] + 15)).toBeLessThan(20 * x ** 2);
		}
	});
});

describe('the field of the pair', () => {
	const times = Array.from({ length: 64 }, (_, i) => (i / 64) * (Math.PI / holes.omega));

	it('swings with the closed-form amplitude', () => {
		for (const x of xs) {
			const r = x / k;
			for (const phi of [0, 0.7, 2]) {
				// over one wave period the field is a cos(2Ωt) + b sin(2Ωt)
				const a = planeTide(holes, r, phi, 0);
				const b = planeTide(holes, r, phi, Math.PI / (4 * holes.omega));
				close(Math.hypot(a, b), planeAmplitude(holes, r), 1e-12);
				const peak = Math.max(...times.map((t) => Math.abs(planeTide(holes, r, phi, t))));
				expect(peak).toBeLessThanOrEqual(planeAmplitude(holes, r) * (1 + 1e-12));
				expect(peak).toBeGreaterThan(planeAmplitude(holes, r) * Math.cos(Math.PI / 64));
			}
		}
	});

	it('is the closed-form tide of the turning quadrupole, 𝓔_zz, at every place and time', () => {
		// the masses on the y axis at t = 0, as in the chapter's turning table
		const half = holes.separation / 2;
		const q = turningQuadrupole(
			[
				{ mass: holes.mass, offset: [0, half, 0] },
				{ mass: holes.mass, offset: [0, -half, 0] }
			],
			[0, 0, 1]
		);
		// q = −½ΔI (1 i; i −1)
		close(q.re[0][0], -deltaI(holes) / 2, 1e-12);
		close(q.im[0][1], -deltaI(holes) / 2, 1e-12);
		for (const x of xs)
			for (const phi of [0, 0.4, 1.3, 2.9, -2])
				for (const t of [0, 0.0123, 0.09]) {
					const r = x / k;
					const at: Vec3 = [r * Math.cos(phi), r * Math.sin(phi), 0];
					const terms = quadrupoleTerms(q, 2 * holes.omega, at, t);
					const zz = terms.reduce((s, m) => s + m[2][2], 0);
					expect(Math.abs(planeTide(holes, r, phi, t) - zz)).toBeLessThanOrEqual(
						1e-10 * planeAmplitude(holes, r)
					);
				}
	});

	it('near the pair is Newton’s changing tide of the two masses where they are now, turning with them', () => {
		// a slow light (c very large) removes the delay; at 60 separations the higher multipoles are below 10⁻³
		const slow = 1e40;
		const r = 60 * holes.separation;
		const newton = (phi: number, t: number) => {
			const a = pairAngle(holes, t);
			const x = r * Math.cos(phi);
			const y = r * Math.sin(phi);
			let e = 0;
			for (const s of [1, -1]) {
				const rho = Math.hypot(
					x - (s * holes.separation * Math.cos(a)) / 2,
					y - (s * holes.separation * Math.sin(a)) / 2
				);
				e += (G * holes.mass) / rho ** 3;
			}
			return e;
		};
		const n = 360;
		for (const phi of [0, 0.5, 2.2]) {
			const mean =
				Array.from({ length: n }, (_, i) => newton(phi, (i / n) * (Math.PI / holes.omega))).reduce(
					(s, v) => s + v,
					0
				) / n;
			for (const t of [0, 0.004, 0.017, 0.05]) {
				const changing = newton(phi, t) - mean;
				expect(Math.abs(planeTide(holes, r, phi, t, slow) - changing)).toBeLessThan(
					2e-3 * nearLaw(holes, r)
				);
			}
		}
		// at (r, 0, 0) and t = 0 the masses stand across the line to the pixel: −(15/4)GΔI/r⁵, a stretch
		close(planeTide(holes, r, 0, 0, slow), -nearLaw(holes, r), 1e-9);
		// the field at (r, φ) at time t is the field at (r, 0) at t − φ/Ω: the pattern turns with the masses
		for (const phi of [0.3, 1.1])
			close(
				planeTide(holes, 3 * r, phi, 0.02),
				planeTide(holes, 3 * r, 0, 0.02 - phi / holes.omega),
				1e-12
			);
	});

	it('runs from Newton’s law near the pair to the wave far away', () => {
		close(planeAmplitude(holes, 1e-4 / k), nearLaw(holes, 1e-4 / k), 1e-7);
		close(planeAmplitude(holes, 1e4 / k), farLaw(holes, 1e4 / k), 1e-7);
		// and the far law is 4GΔIΩ⁴/c⁴r, the near law's (kr)⁴/15
		for (const x of [0.3, 2, 9])
			close(farLaw(holes, x / k) / nearLaw(holes, x / k), farOverNear(x), 1e-12);
		// the exact field never falls below either law
		for (const x of xs) {
			expect(overNear(x)).toBeGreaterThanOrEqual(1);
			expect(overFar(x)).toBeGreaterThanOrEqual(1);
		}
	});

	it('gives the crossover diagram’s units: r|𝓔_zz| over GΔIΩ⁴/c⁴', () => {
		const unit = (G * deltaI(holes) * holes.omega ** 4) / C ** 4;
		for (const x of xs) {
			const r = x / k;
			close((r * planeAmplitude(holes, r)) / unit, scaledExact(x), 1e-12);
			close((r * nearLaw(holes, r)) / unit, scaledNear(x), 1e-12);
			close((r * farLaw(holes, r)) / unit, scaledFar(), 1e-12);
		}
	});

	it('matches the table of the paper’s figure, from the reference’s finite differences', () => {
		// strength: r A in units of its value in the waves, which is the exact field over the wave's law
		const table = vistas.pair;
		const pick = [0, 30, 60, 90, 120, 150, 180, 210, table.x.length - 1];
		for (const i of pick) close(table.strength[i], overFar(2 * Math.PI * table.x[i]), 1e-6);
		// its phase: E_zz = A cos(2Ωt − 2φ + δ) with the masses on the x axis at t = 0 and η = δ + 2πx, which is
		// −arg(−bracket) up to a constant; the constant is set by the table's η = 0 at its far end
		const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
		const eta = (x: number) => {
			const [re, im] = bracket(2 * Math.PI * x);
			return -Math.atan2(-im, -re);
		};
		const offset = table.eta[0] - eta(table.x[0]);
		for (const i of pick)
			expect(Math.abs(wrap(table.eta[i] - eta(table.x[i]) - offset))).toBeLessThan(1e-6);
		// the same φ and t dependence: the chapter's time is the table's less a quarter turn
		const r = 0.4 * lambda;
		const phi = 0.8;
		const t = 0.011;
		const tTable = t + Math.PI / (2 * holes.omega);
		const x = r / lambda;
		const a = planeAmplitude(holes, r);
		const delta = -Math.atan2(-bracket(k * r)[1], -bracket(k * r)[0]) - 2 * Math.PI * x;
		close(
			planeTide(holes, r, phi, t),
			a * Math.cos(2 * holes.omega * tTable - 2 * phi + delta),
			1e-12
		);
	});

	it('draws its pattern with the phase ψ = kr + 2φ + arg(bracket)', () => {
		for (const x of [0.2, 2, 8])
			for (const phi of [0, 1, 2.5])
				for (const t of [0, 0.01]) {
					const r = x / k;
					close(
						planeTide(holes, r, phi, t) / planeAmplitude(holes, r),
						Math.cos(patternPhase(x, phi) - 2 * holes.omega * t),
						1e-12
					);
				}
	});
});

describe('the crossover', () => {
	it('is at (kr)⁴ = 15: kr = 1.97, 0.313λ, twice λ/2π', () => {
		expect(CROSSING_KR.toFixed(2)).toBe('1.97');
		expect(CROSSING.toFixed(3)).toBe('0.313');
		close(CROSSING_KR ** 4, 15, 1e-14);
		close(crossingDistance(holes.omega), (15 / 16) ** 0.25 * (C / holes.omega), 1e-14);
		expect((CROSSING * 2 * Math.PI).toFixed(2)).toBe('1.97');
		close(nearLaw(holes, CROSSING_KR / k), farLaw(holes, CROSSING_KR / k), 1e-13);
	});

	it('has the exact field three times either law there: 3.08', () => {
		expect(overNear(CROSSING_KR).toFixed(2)).toBe('3.08');
		close(overNear(CROSSING_KR), overFar(CROSSING_KR), 1e-14);
	});

	it('has the local law run from r⁻⁵ to r⁻¹, through r⁻³ at 0.310λ', () => {
		close(localLaw(1e-5), -5, 1e-8);
		close(localLaw(1e5), -1, 1e-8);
		let last = localLaw(1e-3);
		for (let lx = -3; lx <= 3; lx += 0.01) {
			const v = localLaw(10 ** lx);
			expect(v).toBeGreaterThanOrEqual(last - 1e-12);
			last = v;
		}
		close(localLaw(LAW3_KR), -3, 1e-12);
		expect(LAW3.toFixed(3)).toBe('0.310');
		expect(lawAt(-5)).toBeNaN();
		expect(lawAt(-0.5)).toBeNaN();
	});

	it('has the local law as the slope of the exact field on log–log axes', () => {
		for (const x of xs) {
			const h = 1e-5;
			const p: Pair = holes;
			const at = (lx: number) => Math.log(planeAmplitude(p, Math.exp(lx) / k));
			const slope = (at(Math.log(x) + h) - at(Math.log(x) - h)) / (2 * h);
			expect(Math.abs(slope - localLaw(x))).toBeLessThan(1e-7);
		}
	});
});

describe('the paper’s pair of black holes', () => {
	it('turns at 27.3 s⁻¹ at a tenth of the speed of light', () => {
		expect(holes.omega.toFixed(1)).toBe('27.3');
		expect((orbitalSpeed(holes) / C).toFixed(3)).toBe('0.100');
		expect((holes.omega / Math.PI).toFixed(1)).toBe('8.7');
	});

	it('sends waves 34,400 km long and crosses over at 10,800 km, five separations out', () => {
		expect(Math.round(lambda / 1e5) * 100).toBe(34400);
		expect(Math.round(lambda / (2 * Math.PI) / 1e5) * 100).toBe(5500);
		expect(Math.round(crossingDistance(holes.omega) / 1e5) * 100).toBe(10800);
		expect(Math.round(crossingDistance(holes.omega) / holes.separation)).toBe(5);
	});

	it('at half the speed and the same separation has twice the wavelength and twice the crossing', () => {
		const half: Pair = { ...holes, omega: holes.omega / 2 };
		close(orbitalSpeed(half), orbitalSpeed(holes) / 2, 1e-14);
		close(wavelength(half.omega), 2 * lambda, 1e-14);
		close(crossingDistance(half.omega), 2 * crossingDistance(holes.omega), 1e-14);
		close(crossingDistance(half.omega) / wavelength(half.omega), CROSSING, 1e-14);
	});
});
