/** Chapter 5.1's damped wave: the leapfrog line against the exact steady train, d'Alembert's pulses and the chapter. */
import { describe, expect, it } from 'vitest';
import {
	DAMPING,
	DT,
	FREQUENCY,
	LENGTH,
	Line,
	MIDDLE,
	OPENING,
	SLAB,
	START,
	THICKNESS,
	WIDTH,
	advanceScene,
	amplitudeLength,
	arrival,
	attenuationLength,
	faceReflection,
	fitPhasor,
	hump,
	humpSlope,
	lagCycles,
	meeting,
	modulus,
	pulseDelay,
	scene,
	send,
	steady,
	steepest,
	total,
	wavelength,
	weakAmplitudeLength,
	type Complex
} from './damped-wave';

/** Runs a train to the time `until` and fits its phasor at each x over the next two periods. */
function trainPhasors(omega: number, Gamma: number, n: number, xs: number[], until = 60) {
	const line = new Line({ n, Gamma });
	line.drive(omega);
	line.advance(Math.round(until / DT));
	const times: number[] = [];
	const values: number[][] = xs.map(() => []);
	const steps = Math.round((2 * 2 * Math.PI) / omega / DT);
	for (let s = 0; s < steps; s++) {
		line.step();
		times.push(line.time);
		xs.forEach((x, j) => values[j].push(line.value(x)));
	}
	return xs.map((_, j) => fitPhasor(times, values[j], omega));
}

const cycles = (a: Complex, b: Complex) =>
	Math.atan2(a.im * b.re - a.re * b.im, a.re * b.re + a.im * b.im) / (2 * Math.PI);
/** The distance between x and the nearest whole number, for lags known only up to whole cycles. */
const offWhole = (x: number) => Math.abs(x - Math.round(x));

describe('the chapter’s numbers', () => {
	it('opens with weak damping, Γ/ω = 0.02, and no slab', () => {
		expect(OPENING.Gamma / OPENING.omega).toBeCloseTo(0.02, 12);
		expect(OPENING.n).toBe(1);
		expect(DAMPING.max).toBeCloseTo(0.2 * FREQUENCY.max, 12);
	});

	it('has c²k² = ω² + iΓω, so Im k ≈ Γ/2c at weak damping and the amplitude falls by e in 2c/Γ', () => {
		for (const omega of [0.5, 1, 2, 4]) {
			const exact = amplitudeLength(omega, 0.04);
			expect(Math.abs(exact / weakAmplitudeLength(0.04) - 1)).toBeLessThan(1e-3);
		}
		// at the strongest damping and the lowest frequency, Γ/ω = 1.6, the weak-damping rule is off by 20%
		expect(amplitudeLength(0.5, 0.8) / weakAmplitudeLength(0.8)).toBeCloseTo(1.2, 2);
		expect(attenuationLength(0.03)).toBeCloseTo(33.3, 1);
		expect(wavelength(1.5)).toBeCloseTo(4.19, 2);
	});

	it('gives the slab’s lag as (n − 1)ωL/2πc to within the faces’ echoes, r²/2π cycles', () => {
		for (const n of [1.1, 1.25, 1.5])
			for (const omega of [0.5, 1.5, 4]) {
				const exact = steady(omega, 0, n).lag;
				const bound = faceReflection(n) ** 2 / (2 * Math.PI);
				expect(Math.abs(exact - lagCycles(n, omega))).toBeLessThanOrEqual(1.05 * bound);
			}
		expect(lagCycles(1.5, 4)).toBeCloseTo(1.91, 2);
		expect(faceReflection(1.5)).toBeCloseTo(-0.2, 12);
	});

	it('meets the two pulses at the middle at 8.5 + 3n', () => {
		expect(meeting(1)).toBeCloseTo(11.5, 12);
		expect(meeting(1.5)).toBeCloseTo(13, 12);
		expect(arrival(LENGTH + 1, 1.2) - arrival(LENGTH + 1, 1)).toBeCloseTo(pulseDelay(1.2), 12);
	});
});

describe('the steady train, integrated', () => {
	it('matches the exact solution along the line, slab and echoes and all, to under 0.5%', () => {
		const xs: number[] = [];
		for (let x = 0.5; x <= LENGTH; x += 0.5) xs.push(x);
		for (const [omega, Gamma, n] of [
			[2, 0.1, 1.5],
			[4, 0.03, 1.3],
			[0.5, 0.2, 1.5]
		]) {
			const fit = trainPhasors(omega, Gamma, n, xs);
			const exact = steady(omega, Gamma, n);
			let worst = 0;
			xs.forEach((x, j) => {
				const e = exact.at(x);
				worst = Math.max(worst, Math.hypot(fit[j].re - e.re, fit[j].im - e.im));
			});
			expect(worst).toBeLessThan(5e-3);
		}
	});

	it('dies out over the same distance when the frequency doubles: 2c/Γ for the amplitude, within 1%', () => {
		const Gamma = 0.2;
		const found: number[] = [];
		for (const omega of [1, 2, 4]) {
			const [near, far] = trainPhasors(omega, Gamma, 1, [2, 16]);
			const length = 14 / Math.log(modulus(near) / modulus(far));
			expect(Math.abs(length / amplitudeLength(omega, Gamma) - 1)).toBeLessThan(1e-3);
			expect(Math.abs(length / weakAmplitudeLength(Gamma) - 1)).toBeLessThan(0.01);
			found.push(length);
		}
		expect(Math.max(...found) / Math.min(...found) - 1).toBeLessThan(0.01);
	});

	it('sends the wave with the amplitude 1 from x = 0', () => {
		const [at0] = trainPhasors(1.5, 0.03, 1, [0.2]);
		const e = steady(1.5, 0.03, 1).at(0.2);
		expect(Math.hypot(at0.re - e.re, at0.im - e.im)).toBeLessThan(0.005);
	});

	it('sends nothing to its left: still to 10⁻⁶ without damping, and with it only the dying wake of its swell', () => {
		for (const omega of [0.5, 4]) {
			const [left] = trainPhasors(omega, 0, 1, [-3]);
			expect(modulus(left)).toBeLessThan(1e-6);
		}
		// with damping the switch-on leaves a slow wake, which the fit at ω picks up a little of; it dies away
		for (const [omega, Gamma] of [
			[0.5, 0.2],
			[2, 0.03]
		]) {
			const [early] = trainPhasors(omega, Gamma, 1, [-3]);
			const [late] = trainPhasors(omega, Gamma, 1, [-3], 120);
			expect(modulus(early)).toBeLessThan(3e-3);
			expect(modulus(late)).toBeLessThan(0.6 * modulus(early));
		}
	});

	it('lags past the slab by (n − 1)ωL/2πc cycles, against a reference line without it', () => {
		for (const [omega, n] of [
			[1.5, 1.2],
			[3, 1.5],
			[4, 1.35]
		]) {
			const [real] = trainPhasors(omega, 0, n, [15]);
			const [ref] = trainPhasors(omega, 0, 1, [15]);
			const lag = cycles(real, ref);
			expect(offWhole(lag - steady(omega, 0, n).lag)).toBeLessThan(3e-3);
			expect(offWhole(lag - lagCycles(n, omega))).toBeLessThan(0.01);
		}
	});
});

describe('the pulses', () => {
	it('meet as a flat line moving with −2c u_R′, and come out unchanged, when Γ = 0 and n = 1', () => {
		const s = scene(1, 0, 1);
		send(s, 'pair', 1);
		const meet = Math.round(meeting(1) / DT);
		advanceScene(s, meet);
		const i0 = s.hump.index(0);
		const i1 = s.hump.index(LENGTH);
		let flat = 0;
		let velocity = 0;
		for (let i = i0; i <= i1; i++) {
			const { u, v } = total(s, i);
			flat = Math.max(flat, Math.abs(u));
			// the velocity is half a step behind the time of the meeting
			const x = s.hump.position(i);
			velocity = Math.max(velocity, Math.abs(v + 2 * humpSlope(x - MIDDLE)));
		}
		expect(flat).toBeLessThan(1e-9);
		expect(velocity / (2 * steepest())).toBeLessThan(1e-3);
		// six time units later: the hump at 15 and the dip at 3, as they went in
		advanceScene(s, Math.round(6 / DT));
		let off = 0;
		for (let i = i0; i <= i1; i++) {
			const x = s.hump.position(i);
			off = Math.max(off, Math.abs(total(s, i).u - hump(x - 15) + hump(x - 3)));
		}
		expect(off).toBeLessThan(1e-9);
	});

	it('is held back by the slab by (n − 1)L/c', () => {
		const at = (n: number) => {
			const line = new Line({ n });
			line.launch(START.hump, 1);
			const x = 16;
			let best = 0;
			let when = 0;
			for (let s = 0; s < Math.round(24 / DT); s++) {
				line.step();
				const u = line.value(x);
				if (u > best) {
					best = u;
					when = line.time;
				}
			}
			return { when, best };
		};
		const slow = at(1.5);
		const fast = at(1);
		expect(Math.abs(slow.when - fast.when - pulseDelay(1.5))).toBeLessThan(0.02);
		// the two faces pass (1 − r²) of it: 4n/(1 + n)² = 0.96
		expect(slow.best).toBeCloseTo(0.96, 2);
	});

	it('keeps its energy without damping, through the slab and its echoes', () => {
		const line = new Line({ n: 1.5 });
		line.launch(3, 1);
		line.step();
		const before = line.energy();
		line.advance(Math.round(9 / DT));
		expect(Math.abs(line.energy() / before - 1)).toBeLessThan(1e-8);
	});

	it('loses its energy as e^{−Γt} with damping', () => {
		const Gamma = 0.1;
		const line = new Line({ Gamma });
		line.launch(2, 1);
		line.step();
		const before = line.energy();
		line.advance(Math.round(10 / DT));
		expect(Math.abs(line.energy() / before / Math.exp(-Gamma * 10) - 1)).toBeLessThan(0.01);
	});
});

describe('the ends', () => {
	/** The largest difference on the drawn line between the line and one with ends 40 units away. */
	function echo(setup: (l: Line) => void, Gamma: number, until: number) {
		const near = new Line({ Gamma });
		const far = new Line({ Gamma, buffer: 40 });
		setup(near);
		setup(far);
		let worst = 0;
		for (let s = 0; s < Math.round(until / DT); s++) {
			near.step();
			far.step();
			for (let x = 0; x <= LENGTH; x += 0.1)
				worst = Math.max(worst, Math.abs(near.value(x) - far.value(x)));
		}
		return worst;
	}

	it('send back less than 0.1% of a pulse, with damping or without', () => {
		for (const Gamma of [0, 0.3, DAMPING.max]) {
			const out = echo((l) => l.launch(START.hump, 1), Gamma, 40);
			expect(out).toBeLessThan(1e-3);
		}
	});

	it('send back less than 0.1% of a train, at the lowest and the highest frequency', () => {
		for (const [omega, Gamma] of [
			[FREQUENCY.min, DAMPING.max],
			[FREQUENCY.min, 0],
			[FREQUENCY.max, 0]
		]) {
			const out = echo((l) => l.drive(omega), Gamma, 45);
			expect(out).toBeLessThan(1e-3);
		}
	});
});

describe('the geometry', () => {
	it('puts the slab in the middle third', () => {
		expect(SLAB.from).toBe(LENGTH / 3);
		expect(SLAB.to).toBe((2 * LENGTH) / 3);
		expect(THICKNESS).toBe(6);
		expect(WIDTH).toBe(0.5);
	});
});
