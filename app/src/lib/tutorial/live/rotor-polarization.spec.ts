/**
 * Chapter 5.4's rotor: the figure's model against the chapter's equations, against a rotor's quadrupole computed
 * from the masses as drawn, and against every number the chapter's specification of the figure asks for.
 */
import { describe, expect, it } from 'vitest';
import { modulus, type Complex } from './spin-two-dial';
import {
	HALF_TILT,
	IOTA,
	IOTA_MARKS,
	NAMES,
	PHASE,
	SIGHT,
	THETA,
	THETA_MARKS,
	VIEW,
	amplitudes,
	ballMove,
	cameraAxes,
	circular,
	cross3,
	direction,
	dot,
	ellipseAxes,
	fixed,
	frame,
	halfAnswer,
	halfDone,
	helicities,
	keyed,
	masses,
	pastAnswer,
	pastDone,
	phaseDifference,
	power,
	project,
	sense,
	spot,
	stokes,
	stokesOf,
	strains,
	turnAnswer,
	turnDone,
	turnedAmplitudes,
	turnedHelicities,
	valueText,
	type Vec
} from './rotor-polarization';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));
const same = (z: Complex, w: Complex, digits = 12) => {
	close(z.re, w.re, digits);
	close(z.im, w.im, digits);
};
const DEG = Math.PI / 180;
const tilts = [0, 10, 30, 45, 60, 75, HALF_TILT, 82.2, 89.9, 90, 90.1, 100, 120, 150, 179.9, 180];
const turns = [0, 5, 22.5, 30, 45, 67.5, 90, 112.5, 135, 180];

/** What the readouts show: two decimals, three for V/I and the power. */
function readouts(iota: number, theta: number) {
	const { plus, cross } = turnedAmplitudes(iota, theta);
	const s = stokes(iota, theta);
	const d = phaseDifference(iota, theta);
	return {
		plus: fixed(modulus(plus)),
		cross: fixed(modulus(cross)),
		difference: d === undefined ? '—' : fixed(d, 1),
		Q: fixed(s.Q),
		U: fixed(s.U),
		I: fixed(s.I),
		V: fixed(s.V),
		ratio: fixed(s.V / s.I, 3),
		power: fixed(power(iota), 3)
	};
}

describe('the specification’s numbers', () => {
	it('at ι = 60°, θ = 0', () => {
		const r = readouts(60, 0);
		expect([r.I, r.Q, r.U, r.V, r.ratio, r.power]).toEqual([
			'0.64',
			'0.14',
			'0.00',
			'0.63',
			'0.976',
			'0.320'
		]);
		expect([r.plus, r.cross, r.difference]).toEqual(['0.63', '0.50', '90.0']);
	});

	it('at ι = 60°, θ = 22.5°: Q = 0 and U = −0.14', () => {
		const r = readouts(60, 22.5);
		expect([r.Q, r.U]).toEqual(['0.00', '−0.14']);
	});

	it('at ι = 60°, θ = 45°: Q = −0.14, |h̃′₊| = 0.50, |h̃′×| = 0.63', () => {
		const r = readouts(60, 45);
		expect([r.Q, r.plus, r.cross]).toEqual(['−0.14', '0.50', '0.63']);
		expect([r.I, r.V, r.ratio, r.power]).toEqual(['0.64', '0.63', '0.976', '0.320']);
	});

	it('at θ = 90° every readout is as at θ = 0', () => {
		for (const iota of tilts) expect(readouts(iota, 90)).toEqual(readouts(iota, 0));
		for (const iota of tilts) expect(readouts(iota, 180)).toEqual(readouts(iota, 0));
	});

	it('V/I is one half at 82.2°, the mark, and just under it at 82.2° on the slider’s grid', () => {
		expect(HALF_TILT.toFixed(1)).toBe('82.2');
		expect(readouts(HALF_TILT, 0).ratio).toBe('0.500');
		close(circular(HALF_TILT), 0.5, 12);
		expect(readouts(82.2, 0).ratio).toBe('0.498');
		expect(readouts(82, 0).ratio).toBe('0.508');
	});

	it('at ι = 90°: I = 0.25, Q = 0.25, V = 0, power 0.125, and no sense of turning', () => {
		const r = readouts(90, 0);
		expect([r.I, r.Q, r.V, r.ratio, r.power]).toEqual(['0.25', '0.25', '0.00', '0.000', '0.125']);
		expect(stokes(90, 0).V).toBe(0);
		expect(sense(90)).toBe('none');
		expect(spot(90)).toEqual({ sense: 'none', depth: 0 });
	});

	it('at ι = 120°: V = −0.63, V/I = −0.976 and the spot green', () => {
		const r = readouts(120, 0);
		expect([r.V, r.ratio]).toEqual(['−0.63', '−0.976']);
		expect(sense(120)).toBe('clockwise');
		expect(spot(120).sense).toBe('clockwise');
		close(spot(120).depth, 0.97561, 5);
		expect(r.I).toBe(readouts(60, 0).I);
		expect(r.power).toBe(readouts(60, 0).power);
	});

	it('at ι = 180°, V/I = −1; face on, +1 and the spot fully magenta', () => {
		close(circular(180), -1);
		expect(readouts(180, 0).ratio).toBe('−1.000');
		close(circular(0), 1);
		expect(spot(0)).toEqual({ sense: 'anticlockwise', depth: 1 });
	});

	it('the chapter’s other numbers: 0.785 at 75°, 1 − 5 × 10⁻⁵ at 30°, the eighth edge on, half power at 47°', () => {
		expect(fixed(circular(75), 3)).toBe('0.785');
		close(1 - circular(30), 5e-5, 5);
		close(power(90), 1 / 8);
		expect(fixed(Math.acos(Math.sqrt(Math.sqrt(12) - 3)) / DEG, 0)).toBe('47');
		close(power(Math.acos(Math.sqrt(Math.sqrt(12) - 3)) / DEG), 0.5);
	});
});

describe('the model', () => {
	it('has the paper’s amplitudes and the chapter’s helicities A cos⁴(ι/2), A sin⁴(ι/2)', () => {
		for (const iota of tilts) {
			const c = Math.cos(iota * DEG);
			const { plus, cross } = amplitudes(iota);
			close(plus, (1 + c * c) / 2);
			close(cross, c);
			const h = helicities(iota);
			close(h.a, Math.cos((iota * DEG) / 2) ** 4);
			close(h.c, Math.sin((iota * DEG) / 2) ** 4);
		}
	});

	it('turns the helicities’ phases and not their sizes', () => {
		for (const iota of tilts)
			for (const theta of turns) {
				const h = helicities(iota);
				const t = turnedHelicities(iota, theta);
				close(modulus(t.a), Math.abs(h.a));
				close(modulus(t.c), Math.abs(h.c));
			}
	});

	it('gives h′₊(t) + i h′×(t) = e^(−2iθ)(h₊(t) + i h×(t)) at every instant (eq:h-turn)', () => {
		for (const iota of tilts)
			for (const theta of turns)
				for (const x of [0, 17, 90, 133, 200, 300]) {
					const first = strains(iota, 0, x);
					const now = strains(iota, theta, x);
					const c = Math.cos(2 * theta * DEG);
					const s = Math.sin(2 * theta * DEG);
					same(
						{ re: now.plus, im: now.cross },
						{
							re: c * first.plus + s * first.cross,
							im: c * first.cross - s * first.plus
						}
					);
				}
	});

	it('in the first axes, h₊(t) = h₊ cos x and h×(t) = h× sin x (eq:rotor)', () => {
		for (const iota of tilts)
			for (const x of [0, 30, 90, 180, 250]) {
				const { plus, cross } = amplitudes(iota);
				const s = strains(iota, 0, x);
				close(s.plus, plus * Math.cos(x * DEG));
				close(s.cross, cross * Math.sin(x * DEG));
			}
	});

	it('gives the same Stokes parameters from the helicities and from the two strains (eq:stokes)', () => {
		for (const iota of tilts)
			for (const theta of turns) {
				const a = stokes(iota, theta);
				const { plus, cross } = turnedAmplitudes(iota, theta);
				const b = stokesOf(plus, cross);
				close(a.I, b.I);
				close(a.Q, b.Q);
				close(a.U, b.U);
				close(a.V, b.V);
			}
	});

	it('has Q + iU = e^(−4iθ)(h₊² − h×²), I = h₊² + h×², V = 2h₊h×, I² = Q² + U² + V²', () => {
		for (const iota of tilts)
			for (const theta of turns) {
				const { plus, cross } = amplitudes(iota);
				const s = stokes(iota, theta);
				const lin = plus * plus - cross * cross;
				close(s.Q, Math.cos(4 * theta * DEG) * lin);
				close(s.U, -Math.sin(4 * theta * DEG) * lin);
				close(s.I, plus * plus + cross * cross);
				close(s.V, 2 * plus * cross);
				close(s.I * s.I, s.Q * s.Q + s.U * s.U + s.V * s.V);
				close(power(iota), s.I / 2);
			}
	});

	it('at 45° swaps the sizes of the two amplitudes; a quarter cycle apart in the first axes', () => {
		for (const iota of tilts) {
			const { plus, cross } = amplitudes(iota);
			const t = turnedAmplitudes(iota, 45);
			close(modulus(t.plus), Math.abs(cross));
			close(modulus(t.cross), plus);
			const d = phaseDifference(iota, 0);
			if (Math.abs(iota - 90) < 1e-9) expect(d).toBeUndefined();
			else close(d!, cross > 0 ? 90 : -90);
		}
	});

	it('traces an ellipse of semi-axes (1 + cos²ι)/2 and |cos ι|, in the rotor’s sense as seen', () => {
		for (const iota of tilts)
			for (const theta of [0, 30, 45]) {
				const { major, minor } = ellipseAxes(iota);
				const pts = Array.from({ length: 720 }, (_, i) => strains(iota, theta, i / 2));
				const r = pts.map((p) => Math.hypot(p.plus, p.cross));
				close(Math.max(...r), major, 5);
				close(Math.min(...r), minor, 5);
				// the signed area swept: anticlockwise positive
				let area = 0;
				for (let i = 0; i < pts.length; i++) {
					const p = pts[i];
					const q = pts[(i + 1) % pts.length];
					area += (p.plus * q.cross - q.plus * p.cross) / 2;
				}
				close(area, Math.PI * amplitudes(iota).plus * amplitudes(iota).cross, 4);
				const want = iota < 90 - 1e-9 ? 'anticlockwise' : iota > 90 + 1e-9 ? 'clockwise' : 'none';
				expect(sense(iota)).toBe(want);
			}
	});
});

describe('the ring', () => {
	it('moves a ball by ½ h ξ, outward along the stretch and inward along the squeeze', () => {
		// face on at x = 0: the plus pattern alone, at the drawn size 0.3
		const m = ballMove(1, 0, 1, 0);
		close(m.x, 0.15);
		close(m.y, 0);
		expect(direction(1, 0, 1, 0)).toBe('stretch');
		expect(direction(1, 0, 0, 1)).toBe('squeeze');
		expect(direction(0, 1, Math.SQRT1_2, Math.SQRT1_2)).toBe('stretch');
		expect(direction(0, 1, 1, 0)).toBe('still');
	});
});

describe('the rotor as drawn', () => {
	it('puts the camera along n̂, with e₁ × e₂ = n̂ and the spin’s shadow along −sin ι e₁', () => {
		for (const iota of tilts) {
			const f = frame(iota);
			const { e1, e2 } = cameraAxes(iota);
			const n = [
				Math.sin(iota * DEG) * f.x[0] + Math.cos(iota * DEG) * f.z[0],
				Math.sin(iota * DEG) * f.x[1] + Math.cos(iota * DEG) * f.z[1],
				Math.sin(iota * DEG) * f.x[2] + Math.cos(iota * DEG) * f.z[2]
			];
			for (let k = 0; k < 3; k++) close(n[k], SIGHT[k]);
			const e = cross3(e1, e2);
			for (let k = 0; k < 3; k++) close(e[k], SIGHT[k]);
			// the chapter's frame is right-handed
			const z = cross3(f.x, f.y);
			for (let k = 0; k < 3; k++) close(z[k], f.z[k]);
			const c = dot(f.z, SIGHT);
			close(c, Math.cos(iota * DEG));
			const shadow = f.z.map((v, k) => v - c * SIGHT[k]);
			for (let k = 0; k < 3; k++) close(shadow[k], -Math.sin(iota * DEG) * e1[k]);
		}
	});

	it('sends the wave of the model: the strain computed from the drawn masses’ second moment', () => {
		// two unit masses a distance 2 apart, Ω = 1, G/c⁴r = 1: ΔI = 2 and A = 4ΔIΩ² = 8
		const second = (iota: number, t: number) => {
			const [p, q] = masses(iota, 2 * (t / DEG), 2);
			const m = [0, 1, 2].map((i) => [0, 1, 2].map((j) => p[i] * p[j] + q[i] * q[j]));
			return m;
		};
		const dt = 1e-3;
		for (const iota of [0, 30, 60, 90, 120, 160])
			for (const t of [0.1, 0.7, 1.9]) {
				const a = second(iota, t - dt);
				const b = second(iota, t);
				const c = second(iota, t + dt);
				const dd = a.map((row, i) => row.map((v, j) => (v - 2 * b[i][j] + c[i][j]) / (dt * dt)));
				const { e1, e2 } = cameraAxes(iota);
				const on = (u: Vec, v: Vec) =>
					u.reduce((sum, ui, i) => sum + ui * v.reduce((s, vj, j) => s + dd[i][j] * vj, 0), 0);
				const hPlus = on(e1, e1) - on(e2, e2);
				const hCross = 2 * on(e1, e2);
				const want = strains(iota, 0, 2 * (t / DEG));
				close(hPlus / 8, want.plus, 5);
				close(hCross / 8, want.cross, 5);
			}
	});

	it('projects the origin to the centre and keeps a straight line straight', () => {
		const o = project([0, 0, 0]);
		close(o.x, 0);
		close(o.y, 0);
		close(o.scale, 1);
		const a: Vec = [1.2, -0.4, 0.7];
		const b: Vec = [-0.5, 1.1, -0.9];
		const pa = project(a);
		const pb = project(b);
		for (const t of [0.2, 0.5, 0.8]) {
			const pm = project([0, 1, 2].map((k) => a[k] + t * (b[k] - a[k])) as Vec);
			const area = (pb.x - pa.x) * (pm.y - pa.y) - (pb.y - pa.y) * (pm.x - pa.x);
			close(area, 0, 10);
		}
		// nearer things are drawn larger, in light perspective
		const near = project([0, 0, 1]);
		expect(near.scale).toBeGreaterThan(1);
		expect(near.scale).toBeLessThan(1.15);
		expect(VIEW.distance).toBeGreaterThan(5);
	});
});

describe('the controls', () => {
	it('name every control and its unit', () => {
		expect(NAMES.iota).toBe('Inclination ι, degrees');
		expect(NAMES.theta).toBe('Turn of the camera’s axes θ, degrees');
		expect(NAMES.phase).toBe('Wave phase 2Ωu, degrees');
		expect([NAMES.play, NAMES.pause]).toEqual(['Play the wave', 'Pause the wave']);
		expect(valueText(82.16, 1)).toBe('82.2 degrees');
		expect(valueText(22.5, 1)).toBe('22.5 degrees');
	});

	it('steps ι by 1° with the arrows and 10° with Page Up and Down, within 0° to 180°', () => {
		expect(keyed(60, 'ArrowUp', IOTA)).toBe(61);
		expect(keyed(60, 'ArrowLeft', IOTA)).toBe(59);
		expect(keyed(60, 'PageUp', IOTA)).toBe(70);
		expect(keyed(5, 'PageDown', IOTA)).toBe(0);
		expect(keyed(175, 'PageUp', IOTA)).toBe(180);
		expect(keyed(60, 'End', IOTA)).toBe(180);
		expect(keyed(60, 'Home', IOTA)).toBe(0);
		expect(keyed(60, 'a', IOTA)).toBeUndefined();
		// from the mark at 82.16°, onto the grid
		expect(keyed(HALF_TILT, 'ArrowUp', IOTA)).toBe(83);
		expect(keyed(HALF_TILT, 'ArrowDown', IOTA)).toBe(82);
		expect(keyed(60.3, 'ArrowUp', IOTA)).toBe(61);
	});

	it('steps θ by 1° and 5°, within 0° to 180°; the phase by 1°', () => {
		expect(keyed(0, 'ArrowRight', THETA)).toBe(1);
		expect(keyed(0, 'PageUp', THETA)).toBe(5);
		expect(keyed(22.5, 'ArrowUp', THETA)).toBe(23);
		expect(keyed(22.5, 'ArrowDown', THETA)).toBe(22);
		expect(keyed(178, 'PageUp', THETA)).toBe(180);
		expect(keyed(359, 'ArrowUp', PHASE)).toBe(360);
	});

	it('mark the tilts and turns the chapter names', () => {
		expect(IOTA_MARKS.map((m) => m.at.toFixed(1))).toEqual([
			'0.0',
			'60.0',
			'82.2',
			'90.0',
			'120.0',
			'180.0'
		]);
		expect(IOTA_MARKS.map((m) => m.label)).toEqual(
			expect.arrayContaining(['face on', 'V/I = ½', 'edge on', 'spin away'])
		);
		expect(THETA_MARKS.map((m) => m.at)).toEqual([22.5, 45, 90]);
		expect([IOTA.opening, THETA.opening, PHASE.opening]).toEqual([0, 0, 0]);
	});
});

describe('the predictions', () => {
	it('are answered only once the reader has done what each asks', () => {
		expect(halfDone(IOTA.opening)).toBe(false);
		expect(halfDone(82)).toBe(true);
		expect(halfDone(HALF_TILT)).toBe(true);
		expect(halfDone(80)).toBe(false);
		expect(halfDone(98)).toBe(false);
		expect(pastDone(IOTA.opening)).toBe(false);
		expect(pastDone(120)).toBe(true);
		expect(pastDone(110)).toBe(false);
		expect(turnDone(IOTA.opening, 45)).toBe(false);
		expect(turnDone(60, THETA.opening)).toBe(false);
		expect(turnDone(60, 45)).toBe(true);
	});

	it('rest on the model’s numbers', () => {
		const h = halfAnswer();
		expect(fixed(h.tilt, 1)).toBe('82.2');
		expect([fixed(h.at60, 3), fixed(h.at75, 3), fixed(h.atHalf, 3)]).toEqual([
			'0.976',
			'0.785',
			'0.500'
		]);
		close(h.share, 1 / 3);
		const p = pastAnswer();
		expect([fixed(p.V), fixed(p.ratio, 3), fixed(p.cross), fixed(p.power, 3)]).toEqual([
			'−0.63',
			'−0.976',
			'−0.50',
			'0.320'
		]);
		const t = turnAnswer(60);
		expect(t.plus.map((v) => fixed(v))).toEqual(['0.63', '0.50']);
		expect(t.cross.map((v) => fixed(v))).toEqual(['0.50', '0.63']);
		expect(t.Q.map((v) => fixed(v))).toEqual(['0.14', '−0.14']);
		expect(t.U.map((v) => fixed(v))).toEqual(['0.00', '0.00']);
		expect([fixed(t.I), fixed(t.V), fixed(t.ratio, 3), fixed(t.power, 3)]).toEqual([
			'0.64',
			'0.63',
			'0.976',
			'0.320'
		]);
	});
});

describe('the numbers as written', () => {
	it('round halves away from zero, with a true minus and never −0', () => {
		expect(fixed(0.625)).toBe('0.63');
		expect(fixed(0.6249999999999)).toBe('0.63');
		expect(fixed(-0.625)).toBe('−0.63');
		expect(fixed(-1e-17)).toBe('0.00');
		expect(fixed(0.12, 3)).toBe('0.120');
	});
});
