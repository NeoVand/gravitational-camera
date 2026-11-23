/** Chapter 4.1's driven cart, against a numerical integration of the law of motion and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	DRIVE_MOST,
	FORCE,
	MASS,
	OMEGA,
	OPENING,
	QUALITIES,
	STATIC,
	STIFFNESS,
	carryOn,
	chi,
	damping,
	dampedFrequency,
	fallTime,
	force,
	free,
	freeReach,
	fromRest,
	gain,
	halfPower,
	line,
	lineArea,
	lineAxis,
	lineHeight,
	meanPower,
	modulusPeak,
	motion,
	perSwing,
	reach,
	ringPhasor,
	samples,
	swingsPerE,
	type Segment
} from './driven-cart';

const close = (a: number, b: number, tolerance = 1e-12) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.max(1, Math.abs(b)));
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * The law of motion m q̈ + mΓq̇ + kq = F(t), integrated by the classical fourth-order Runge–Kutta method with the
 * step h, from the segment's start to the time t.
 */
function integrate(g: Segment, t: number, h = 1e-3) {
	let q = g.q0;
	let v = g.v0;
	let s = g.t0;
	const a = (time: number, x: number, u: number) =>
		(force(g, time) - MASS * g.Gamma * u - STIFFNESS * x) / MASS;
	const n = Math.max(1, Math.round((t - g.t0) / h));
	const d = (t - g.t0) / n;
	for (let i = 0; i < n; i++) {
		const k1q = v;
		const k1v = a(s, q, v);
		const k2q = v + (d / 2) * k1v;
		const k2v = a(s + d / 2, q + (d / 2) * k1q, v + (d / 2) * k1v);
		const k3q = v + (d / 2) * k2v;
		const k3v = a(s + d / 2, q + (d / 2) * k2q, v + (d / 2) * k2v);
		const k4q = v + d * k3v;
		const k4v = a(s + d, q + d * k3q, v + d * k3v);
		q += (d / 6) * (k1q + 2 * k2q + 2 * k3q + k4q);
		v += (d / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
		s += d;
	}
	return { q, v };
}

describe("the chapter's cart with friction", () => {
	it('is 1.7’s cart: 2 kg, 50 N/m, ω₀ = 5 s⁻¹; F₀ = 0.1 N stretches it 2 mm', () => {
		close(MASS, 2);
		close(STIFFNESS, 50);
		close(OMEGA, 5);
		close(FORCE, 0.1);
		close(STATIC, 0.002);
	});

	it('at Q = 10 has Γ = 0.5 s⁻¹ and ω_d = 4.994 s⁻¹, and each swing ends with 73% of its swing', () => {
		const G = damping(10);
		close(G, 0.5);
		expect(dampedFrequency(G).toFixed(3)).toBe('4.994');
		expect((100 * perSwing(G)).toFixed(0)).toBe('73');
		// critical damping at Q = ½: Γ = 10 s⁻¹, no swing
		close(damping(0.5), 10);
		close(dampedFrequency(damping(0.5)), 0);
	});

	it('stops its slider at 0.5, the chapter’s 3, 5, 10 and 30, and 100, each step under a third', () => {
		for (const Q of [0.5, 3, 5, 10, 30, 100]) expect(QUALITIES).toContain(Q);
		expect(QUALITIES[0]).toBe(0.5);
		expect(QUALITIES[QUALITIES.length - 1]).toBe(100);
		for (let i = 1; i < QUALITIES.length; i++) {
			const r = QUALITIES[i] / QUALITIES[i - 1];
			expect(r).toBeGreaterThan(1.15);
			expect(r).toBeLessThan(1.34);
		}
	});
});

describe('the response function', () => {
	it('is 1/k for a slow push, iQ/k at ω₀ and −1/mω² far above, with Im χ > 0', () => {
		for (const Q of [0.5, 3, 10, 100]) {
			const G = damping(Q);
			const slow = chi(0, G);
			close(slow.re, 1 / STIFFNESS);
			close(slow.im, 0);
			const at = chi(OMEGA, G);
			close(at.re, 0, 1e-15);
			close(at.im, Q / STIFFNESS);
			close(deg(at.lag), 90);
			const fast = chi(1e4, G);
			close(fast.re, -1 / (MASS * 1e8), 1e-6);
			for (const w of [0.1, 1, 4.9, 5.1, 9, 15]) expect(chi(w, G).im).toBeGreaterThan(0);
		}
	});

	it('has Im χ = mΓω|χ|² and its modulus and argument agree with its parts', () => {
		for (const Q of [0.5, 2, 10, 100])
			for (const w of [0.5, 3, 5, 8, 14]) {
				const G = damping(Q);
				const c = chi(w, G);
				close(c.im, MASS * G * w * c.abs * c.abs);
				close(c.abs, Math.hypot(c.re, c.im));
				close(c.lag, Math.atan2(c.im, c.re));
			}
	});

	it('opens at k|χ| = 1.56 and a lag of 5.4°, and gives the chapter’s three phasors for F̃ = 1 N', () => {
		const G = damping(OPENING.Q);
		expect(OPENING).toEqual({ Q: 10, omega: 3 });
		expect(gain(3, G).toFixed(2)).toBe('1.56');
		expect(deg(chi(3, G).lag).toFixed(1)).toBe('5.4');
		expect(chi(3, G).abs.toFixed(4)).toBe('0.0311');
		expect(chi(5, G).abs.toFixed(3)).toBe('0.200');
		expect(deg(chi(5, G).lag).toFixed(1)).toBe('90.0');
		expect(chi(8, G).abs.toFixed(4)).toBe('0.0128');
		expect(deg(chi(8, G).lag).toFixed(1)).toBe('174.1');
	});

	it('at 5 s⁻¹ and Q = 10 swings ten times the static stretch, 2 cm, a quarter swing behind', () => {
		const G = damping(10);
		close(gain(5, G), 10);
		close(FORCE * chi(5, G).abs, 0.02);
		close(chi(5, G).lag, Math.PI / 2);
	});

	it('is largest at ω₀√(1 − 1/2Q²): 4.99 s⁻¹ at Q = 10, larger than Q/k by 0.1%', () => {
		for (const Q of [1, 3, 10, 30, 100]) {
			const G = damping(Q);
			const at = modulusPeak(Q);
			// a fine search for the largest |χ|
			let best = 0;
			let where = 0;
			for (let i = 0; i <= 200000; i++) {
				const w = (6 * i) / 200000;
				const a = chi(w, G).abs;
				if (a > best) {
					best = a;
					where = w;
				}
			}
			expect(Math.abs(where - at)).toBeLessThan(1e-4);
		}
		expect(modulusPeak(10).toFixed(2)).toBe('4.99');
		const ratio = chi(modulusPeak(10), damping(10)).abs / (10 / STIFFNESS);
		expect((100 * (ratio - 1)).toFixed(1)).toBe('0.1');
		// at Q = 3, 10 and 30 the peaks of the chapter's diagram
		expect(gain(modulusPeak(3), damping(3)).toFixed(2)).toBe('3.04');
		expect((modulusPeak(3) / OMEGA).toFixed(3)).toBe('0.972');
		expect(gain(modulusPeak(30), damping(30)).toFixed(2)).toBe('30.00');
		// below Q = 1/√2 the slow push is the largest
		close(modulusPeak(0.5), 0);
	});
});

describe('the line ω Im χ', () => {
	it('is largest exactly at ω₀, where it is 1/mΓ, and falls to half at the half-power points, Γ apart', () => {
		for (const Q of [0.5, 1, 3, 5, 10, 30, 100]) {
			const G = damping(Q);
			close(line(OMEGA, G), lineHeight(G));
			close(lineHeight(G), Q / (MASS * OMEGA));
			const h = halfPower(G);
			close(h.high - h.low, G);
			close(line(h.low, G), lineHeight(G) / 2, 1e-12);
			close(line(h.high, G), lineHeight(G) / 2, 1e-12);
			for (const d of [-0.3, -1e-3, 1e-3, 0.3])
				expect(line(OMEGA + d * G, G)).toBeLessThan(lineHeight(G));
		}
	});

	it('at Q = 10 has its half-power points at 4.756 and 5.256 s⁻¹, and at Q = 5 is half as high and twice as wide', () => {
		const h10 = halfPower(damping(10));
		expect(h10.low.toFixed(3)).toBe('4.756');
		expect(h10.high.toFixed(3)).toBe('5.256');
		close(lineHeight(damping(10)), 1);
		close(lineHeight(damping(5)), 0.5);
		const h5 = halfPower(damping(5));
		close(h5.high - h5.low, 1);
		close(h10.high - h10.low, 0.5);
		// the chapter's diagram: 0.9512 and 1.0512 in units of ω₀
		expect((h10.low / OMEGA).toFixed(4)).toBe('0.9512');
		expect((h10.high / OMEGA).toFixed(4)).toBe('1.0512');
	});

	it('encloses π/2m = 0.785 kg⁻¹ at every Q', () => {
		expect(lineArea().toFixed(3)).toBe('0.785');
		for (const Q of [0.5, 1, 5, 10, 100]) {
			const G = damping(Q);
			// ω = ω₀ tan u maps [0, ∞) to [0, π/2); Simpson's rule on a fine grid, closer near ω₀ for a sharp line
			const n = 400000;
			const h = Math.PI / 2 / n;
			let sum = 0;
			for (let i = 0; i <= n; i++) {
				const u = Math.min(i * h, Math.PI / 2 - 1e-12);
				const w = OMEGA * Math.tan(u);
				const f = line(w, G) * OMEGA * (1 + Math.tan(u) ** 2);
				sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * (Number.isFinite(f) ? f : 0);
			}
			close((sum * h) / 3, lineArea(), 1e-6);
		}
	});

	it('gives the mean power ½ ω Im χ F₀²: 5 mW at resonance for Q = 10, 0.0436 mW at the opening', () => {
		close(meanPower(OMEGA, damping(10)), 0.005);
		expect((1000 * meanPower(3, damping(10))).toFixed(4)).toBe('0.0436');
		close(meanPower(0, damping(10)), 0);
		// the stretch problem: at resonance one swing loses 2π/Q of the energy stored, ½k|q̃|²
		for (const Q of [3, 10, 173]) {
			const G = damping(Q);
			const stored = 0.5 * STIFFNESS * (FORCE * chi(OMEGA, G).abs) ** 2;
			close(((2 * Math.PI) / OMEGA) * meanPower(OMEGA, G), ((2 * Math.PI) / Q) * stored);
		}
	});

	it('is drawn on an axis that holds its peak with room, the same at Q = 10 and at Q = 5', () => {
		for (const Q of QUALITIES)
			expect(lineHeight(damping(Q))).toBeLessThanOrEqual(0.9 * lineAxis(damping(Q)).top);
		expect(lineAxis(damping(10)).top).toBe(lineAxis(damping(5)).top);
	});

	it('is sampled over 0 to 15 s⁻¹, finely enough near ω₀ for a line of width Γ', () => {
		for (const Q of [0.5, 10, 100]) {
			const G = damping(Q);
			const w = samples(G);
			expect(w[0]).toBe(0);
			expect(w[w.length - 1]).toBe(DRIVE_MOST);
			for (let i = 1; i < w.length; i++) expect(w[i]).toBeGreaterThan(w[i - 1]);
			const near = w.filter((x) => Math.abs(x - OMEGA) < G);
			for (let i = 1; i < near.length; i++)
				expect(near[i] - near[i - 1]).toBeLessThanOrEqual(G / 15);
		}
	});
});

describe('the motion: the steady state plus the ring-down', () => {
	const cases: [number, number][] = [
		[10, 3],
		[10, 5],
		[10, 8],
		[0.5, 3],
		[0.6, 5],
		[2, 0],
		[100, 5],
		[30, 4.7],
		[5, 15],
		// past critical damping, below the slider's range: the cosh and sinh forms
		[0.3, 5],
		[0.4, 1]
	];

	it('from rest agrees with a numerical integration of the law of motion', () => {
		for (const [Q, w] of cases) {
			const g = fromRest(damping(Q), w);
			for (const t of [0.37, 1.9, 6.2]) {
				const exact = motion(g, t);
				const num = integrate(g, t, 2e-4);
				expect(Math.abs(exact.q - num.q)).toBeLessThan(1e-10);
				expect(Math.abs(exact.v - num.v)).toBeLessThan(1e-9);
			}
			// it starts at rest
			close(motion(g, 0).q, 0, 1e-15);
			close(motion(g, 0).v, 0, 1e-15);
		}
	});

	it('settles to the steady swing F₀|χ| with the lag φ', () => {
		const G = damping(10);
		const g = fromRest(G, 3);
		// after 40 s the ring-down has fallen by e^{−10}; the largest q over a swing is the steady swing
		let most = 0;
		for (let i = 0; i < 2000; i++) most = Math.max(most, motion(g, 40 + (i * 2.1) / 2000).q);
		expect(Math.abs(most - FORCE * chi(3, G).abs)).toBeLessThan(
			1e-6 * STATIC + FORCE * chi(3, G).abs * 2e-5
		);
	});

	it('goes on without a jump when the settings change, and then agrees with the integration again', () => {
		const g = fromRest(damping(10), 3);
		const h = carryOn(g, 2.3, { omega: 5.2, Gamma: damping(4) });
		const a = motion(g, 2.3);
		const b = motion(h, 2.3);
		close(a.q, b.q, 1e-14);
		close(a.v, b.v, 1e-14);
		close(force(g, 2.3), force(h, 2.3), 1e-14);
		const num = integrate(h, 5.1, 2e-4);
		expect(Math.abs(motion(h, 5.1).q - num.q)).toBeLessThan(1e-10);
	});

	it('rings down freely when the hand lets go: the strike', () => {
		for (const Q of [0.3, 0.5, 0.6, 1, 10, 50, 100]) {
			const g = fromRest(damping(Q), 5);
			const s = carryOn(g, 4, { push: false });
			close(force(s, 6), 0);
			for (const t of [4.5, 7, 11]) {
				const num = integrate(s, t, 2e-4);
				expect(Math.abs(motion(s, t).q - num.q)).toBeLessThan(1e-10);
			}
		}
	});

	it('has a free motion whose envelope bounds it and whose phasor gives it', () => {
		const G = damping(10);
		const q0 = 0.013;
		const v0 = -0.04;
		const A = freeReach(G, q0, v0);
		for (let i = 0; i < 500; i++) {
			const t = i * 0.02;
			const f = free(G, q0, v0, t);
			expect(Math.abs(f.q)).toBeLessThanOrEqual(A * Math.exp((-G * t) / 2) + 1e-15);
			const p = ringPhasor(G, q0, v0, t)!;
			// Re[(re + i im) e^{−iω_d t}] = re cos + im sin
			close(p.re * Math.cos(p.angle) + p.im * Math.sin(p.angle), f.q, 1e-12);
		}
		// at and past critical damping the bound holds too
		const Gc = damping(0.5);
		const B = freeReach(Gc, 0.01, 0.2);
		for (let i = 0; i < 300; i++)
			expect(Math.abs(free(Gc, 0.01, 0.2, i * 0.01).q)).toBeLessThanOrEqual(B + 1e-15);
		expect(ringPhasor(Gc, 0.01, 0.2, 1)).toBeUndefined();
		const Go = damping(0.3);
		const C = freeReach(Go, -0.01, 0.3);
		for (let i = 0; i < 300; i++)
			expect(Math.abs(free(Go, -0.01, 0.3, i * 0.01).q)).toBeLessThanOrEqual(C + 1e-15);
		// critical damping is the limit of both sides, without a jump
		for (const t of [0.1, 0.5, 2]) {
			const c = free(10, 0.01, 0.2, t).q;
			expect(Math.abs(free(10 - 1e-7, 0.01, 0.2, t).q - c)).toBeLessThan(1e-9);
			expect(Math.abs(free(10 + 1e-7, 0.01, 0.2, t).q - c)).toBeLessThan(1e-9);
		}
	});

	it('never goes beyond its reach', () => {
		for (const [Q, w] of cases) {
			const g = fromRest(damping(Q), w);
			const R = reach(g, 0);
			for (let i = 0; i < 3000; i++)
				expect(Math.abs(motion(g, i * 0.01).q)).toBeLessThanOrEqual(R * (1 + 1e-12));
		}
	});

	it('at Q = 10 falls to about 60% in 2 s, 1.6 swings, between its first peak at 73% and its second at 53%', () => {
		const G = damping(10);
		// 60% is e^{−1/2} to two figures: the swing then has lasted 1/Γ
		expect(Math.exp(-0.5).toFixed(2)).toBe('0.61');
		close(fallTime(G, Math.exp(-0.5)), 1 / G);
		expect(fallTime(G, 0.6).toFixed(2)).toBe('2.04');
		expect(swingsPerE(G).toFixed(1)).toBe('1.6');
		expect((100 * perSwing(G)).toFixed(0)).toBe('73');
		expect((100 * perSwing(G) ** 2).toFixed(0)).toBe('53');
	});

	it('struck at resonance with Q = 50, falls to about 60% in about 8 swings, Q/2π = 7.96', () => {
		const G = damping(50);
		close(G, 0.1);
		expect((50 / (2 * Math.PI)).toFixed(2)).toBe('7.96');
		expect(swingsPerE(G).toFixed(2)).toBe('7.96');
		close(fallTime(G, Math.exp(-0.5)), 10);
		expect((100 * perSwing(G)).toFixed(0)).toBe('94');
		// the swing after 7 whole swings is 64%, after 8 it is 60% and after 9 it is 57%
		expect((100 * perSwing(G) ** 7).toFixed(0)).toBe('64');
		expect((100 * perSwing(G) ** 8).toFixed(0)).toBe('60');
		expect((100 * perSwing(G) ** 9).toFixed(0)).toBe('57');
		// and the turning points of the exact ring-down from the steady swing say the same
		const g = fromRest(G, OMEGA);
		const struck = carryOn(g, 200, { push: false });
		const start = freeReach(G, struck.q0, struck.v0);
		// the ring-down's swing as it starts is the steady swing, to within Γ/2ω₀ = 1%, by which friction bends the swing
		close(start, FORCE * chi(OMEGA, G).abs, 0.011 * FORCE * chi(OMEGA, G).abs);
		const peaks: { tau: number; share: number }[] = [];
		let prev = motion(struck, 200);
		let prev2 = prev;
		for (let i = 1; i < 14000; i++) {
			const now = motion(struck, 200 + i * 1e-3);
			if (Math.abs(prev.q) >= Math.abs(prev2.q) && Math.abs(prev.q) > Math.abs(now.q))
				peaks.push({ tau: (i - 1) * 1e-3, share: Math.abs(prev.q) / start });
			prev2 = prev;
			prev = now;
		}
		// each turning point lies on the envelope e^{−Γτ/2}
		for (const p of peaks)
			expect(Math.abs(p.share / Math.exp((-G * p.tau) / 2) - 1)).toBeLessThan(0.002);
		// the first below 60% comes within half a swing after 10.2 s, that is after 8.1 to 8.6 swings
		const first = peaks.find((p) => p.share < 0.6)!;
		const period = (2 * Math.PI) / dampedFrequency(G);
		expect(first.tau).toBeGreaterThan(fallTime(G, 0.6) - 0.01);
		expect(first.tau).toBeLessThan(fallTime(G, 0.6) + period / 2);
		expect(Math.floor(first.tau / period)).toBe(8);
	});
});
