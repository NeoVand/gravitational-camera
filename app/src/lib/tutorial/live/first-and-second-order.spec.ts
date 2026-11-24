/**
 * Chapter 13.1's push and pass: the try spec's checks, each against values written here independently of the
 * module (closed forms, the chapter's printed numbers, and a direct numerical integration of the pull along the
 * path), and the module's planar series against them.
 */
import { describe, expect, it } from 'vitest';
import { abs, cx, type Complex } from '../../pixel/complex';
import {
	CHOICES,
	FARTHEST,
	LUMPS,
	NEAREST,
	OPENING,
	crossing,
	drawnDistance,
	energySeries,
	fromDrawn,
	gaussLegendre,
	internalEnergy,
	momentum,
	percent,
	planarMoment,
	reading,
	shown,
	type Lump,
	type Projected
} from './first-and-second-order';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

const [shellA, pointB] = CHOICES.pair.bodies;
const [ball, shellR] = CHOICES.ball.bodies;
const [lumps] = CHOICES.lumps.bodies;

/** A thin shell's energy (passing.ts's sum, written again): asin(a/b) / (a √(b² − a²)) per unit mass. */
const shellEnergy = (a: number, b: number) => Math.asin(a / b) / (a * Math.sqrt(b * b - a * a));

/** A uniform ball of radius 1, integrated by hand: 3 (1 − asin(1/b) √(b² − 1)). */
const ballEnergy = (b: number) => 3 * (1 - Math.asin(1 / b) * Math.sqrt(b * b - 1));

/** The places round a circle of passes, every tenth of a degree. */
const round = (distance: number, steps = 3600) =>
	Array.from({ length: steps }, (_, i) => crossing(distance, (360 * i) / steps));

describe('the paper’s pair at b = 1.5 R and the paper’s tonne', () => {
	const b = crossing(1.5, OPENING.turn);
	const a = reading(shellA, b, 1);
	const c = reading(pointB, b, 1);

	it('leaves 0.080 and 0.104 inside, in M C₀²/2R²', () => {
		expect(shown(a.energy)).toBe('0.080');
		expect(shown(c.energy)).toBe('0.104');
		relative(a.energy, shellEnergy(Math.SQRT1_2, 1.5) - 1 / 2.25, 1e-12);
		relative(c.energy, 0.5 / 2.25 + 0.5 * shellEnergy(1, 1.5) - 1 / 2.25, 1e-12);
		// the chapter's 30 per cent
		expect(Math.round(100 * (c.energy / a.energy - 1))).toBe(30);
	});

	it('hands both the same momentum, M C₀/|b|, and bends both by 2GM/|b|V²', () => {
		for (const r of [a, c]) {
			relative(r.size, 1 / 1.5, 1e-14);
			relative(r.angle, 1 / 1.5, 1e-14);
		}
		expect(shown(a.size)).toBe(shown(c.size));
		expect(shown(a.angle)).toBe(shown(c.angle));
		expect(a.parts.map(shown)).toEqual(c.parts.map(shown));
		expect(shown(a.rest)).toBe('0');
	});

	it('agrees in momentum and angle at every printed digit, wherever the bead is', () => {
		for (const distance of [NEAREST, 1.2, 2, 3, FARTHEST])
			for (const turn of [0, 37, 145, 290]) {
				const at = crossing(distance, turn);
				const [x, y] = [reading(shellA, at, 2.7), reading(pointB, at, 2.7)];
				expect(shown(x.size)).toBe(shown(y.size));
				expect(shown(x.angle)).toBe(shown(y.angle));
				expect(x.energy).not.toBeCloseTo(y.energy, 6);
			}
	});
});

describe('the ball and the shell of one mass and radius', () => {
	it('take passing.ts’s energies, the ball through 48 shells', () => {
		const { nodes, weights } = gaussLegendre(48);
		relative(
			weights.reduce((s, w) => s + w, 0),
			1,
			1e-14
		);
		relative(
			nodes.reduce((s, r, i) => s + weights[i] * r ** 9, 0),
			0.1,
			1e-13
		);
		for (const distance of [NEAREST, 1.1, 1.5, 2.5, FARTHEST]) {
			const at = crossing(distance, 0);
			relative(internalEnergy(ball, at), ballEnergy(distance) - 1 / distance ** 2, 1e-10);
			relative(internalEnergy(shellR, at), shellEnergy(1, distance) - 1 / distance ** 2, 1e-12);
		}
		// far away, (2/5)/b⁴ and (2/3)/b⁴
		relative(internalEnergy(ball, crossing(400, 0)) * 400 ** 4, 2 / 5, 1e-4);
		relative(internalEnergy(shellR, crossing(400, 0)) * 400 ** 4, 2 / 3, 1e-4);
	});
});

describe('doubling the passing mass', () => {
	it('doubles the momenta, leaves the angles and multiplies the energies by four', () => {
		for (const body of [shellA, pointB, ball, shellR, lumps])
			for (const [distance, turn] of [
				[1.5, 0],
				[NEAREST, 100],
				[2.3, 215],
				[FARTHEST, 333]
			]) {
				const at = crossing(distance, turn);
				for (const tonnes of [1, 1.5, 2]) {
					const once = reading(body, at, tonnes);
					const twice = reading(body, at, 2 * tonnes);
					relative(twice.size, 2 * once.size, 1e-14);
					once.parts.forEach((part, q) => expect(twice.parts[q]).toBeCloseTo(2 * part, 14));
					relative(twice.angle, once.angle, 1e-15);
					relative(twice.energy, 4 * once.energy, 1e-14);
				}
			}
	});
});

describe('the lopsided body', () => {
	it('has its centre of mass at the origin, so m_01 = 0', () => {
		expect(abs(planarMoment(LUMPS, 0, 1))).toBeLessThan(1e-15);
		expect(abs(planarMoment(LUMPS, 0, 0))).toBeCloseTo(1, 15);
	});

	it('bends the passer by the closed form Σ m/(b* − w*): the boxed series to forty terms', () => {
		for (const at of [
			crossing(NEAREST, 200),
			crossing(1.5, 0),
			crossing(1.5, 90),
			crossing(4, 45)
		]) {
			const exact = LUMPS.reduce(
				(s, { mass, at: w }) => {
					// m / (b* − w*) = m (b − w) / |b − w|²
					const dx = at.re - w.re,
						dy = at.im - w.im;
					const q = dx * dx + dy * dy;
					return [s[0] + (mass * dx) / q, s[1] + (mass * dy) / q];
				},
				[0, 0]
			);
			const P = momentum(lumps, at);
			expect(P.re).toBeCloseTo(exact[0], 7);
			expect(P.im).toBeCloseTo(exact[1], 7);
		}
		// values computed apart from the module
		relative(reading(lumps, crossing(1.5, 0), 1).size, 0.7061064102014835, 1e-9);
		relative(reading(lumps, crossing(1.5, 90), 1).size, 0.6159795615048957, 1e-9);
		relative(reading(lumps, crossing(NEAREST, 200), 1).size, 0.9138769638771184, 1e-7);
	});

	it('changes its momentum round a circle only through the parts from m_01 to m_04', () => {
		for (const distance of [1.5, FARTHEST]) {
			const readings = round(distance, 360).map((at) => reading(lumps, at, 1));
			// the part from the mass is the same all round
			for (const r of readings) relative(r.parts[0], 1 / distance, 1e-14);
			expect(Math.max(...readings.map((r) => r.parts[1]))).toBeLessThan(1e-14);
			const sizes = readings.map((r) => r.size);
			expect(Math.max(...sizes) - Math.min(...sizes)).toBeGreaterThan(0.002 / distance);
			// the rest beyond m_04: under a ten-thousandth of the whole at 4 R
			if (distance === FARTHEST)
				for (const r of readings) expect(r.rest / r.size).toBeLessThan(1e-4);
		}
	});

	it('bends like a point mass to within −1.2 to +1.3% at 4 R and −7.8 to +12.7% at 1.5 R', () => {
		const spread = (distance: number) => {
			const off = round(distance).map((at) => {
				const r = reading(lumps, at, 1);
				return r.angle / r.pointAngle - 1;
			});
			return [percent(Math.min(...off)), percent(Math.max(...off))];
		};
		expect(spread(4)).toEqual(['−1.2%', '+1.3%']);
		expect(spread(1.5)).toEqual(['−7.8%', '+12.7%']);
	});

	it('changes its energy through every m_pq: a body with the same m_0q bends alike and is left with more', () => {
		// each lump spread on a ring of 48 points of radius 0.05 R: the same m_0q for q < 48, a larger m_11
		const spread: Lump[] = LUMPS.flatMap(({ mass, at }) =>
			Array.from({ length: 48 }, (_, j) => ({
				mass: mass / 48,
				at: cx(
					at.re + 0.05 * Math.cos((2 * Math.PI * j) / 48),
					at.im + 0.05 * Math.sin((2 * Math.PI * j) / 48)
				)
			}))
		);
		const twin: Projected = { kind: 'lumps', key: 'T', name: 'spread', lumps: spread };
		for (let q = 0; q < 6; q++) {
			const [m, n] = [planarMoment(LUMPS, 0, q), planarMoment(spread, 0, q)];
			expect(m.re).toBeCloseTo(n.re, 14);
			expect(m.im).toBeCloseTo(n.im, 14);
		}
		relative(planarMoment(spread, 1, 1).re - planarMoment(LUMPS, 1, 1).re, 0.05 ** 2, 1e-12);
		for (const at of round(1.5, 24)) {
			const [x, y] = [reading(lumps, at, 1), reading(twin, at, 1)];
			relative(y.size, x.size, 1e-12);
			expect(y.energy - x.energy).toBeGreaterThan(1e-4);
		}
		// and the energy itself changes round the circle
		const energies = round(1.5, 360).map((at) => reading(lumps, at, 1).energy);
		expect(Math.max(...energies) / Math.min(...energies)).toBeGreaterThan(1.5);
	});

	it('is left with a positive energy inside, the series less |ΔP|²/2M', () => {
		relative(internalEnergy(lumps, crossing(1.5, 0)), 0.027125159360311346, 1e-9);
		relative(internalEnergy(lumps, crossing(1.5, 90)), 0.035256846124013363, 1e-9);
		relative(internalEnergy(lumps, crossing(NEAREST, 200)), 0.25365907604402427, 1e-6);
		for (const at of round(NEAREST, 360)) expect(internalEnergy(lumps, at)).toBeGreaterThan(0);
	});
});

/**
 * The pass integrated directly: the passer moves along z at the speed V through the point b of the plane, and the
 * pull G μ / d² on a lump at w is added up along the path, with the passer tan θ beyond it and Simpson's rule in θ. In the
 * module's units (G μ / V = 1/2, so that C = 1) the lump's velocity is half the integral of the pull's components.
 */
function directPass(lumps: Lump[], b: Complex, steps = 4000) {
	let P: [number, number, number] = [0, 0, 0];
	let energy = 0;
	for (const { mass, at } of lumps) {
		const [dx, dy] = [b.re - at.re, b.im - at.im];
		const v: [number, number, number] = [0, 0, 0];
		const h = Math.PI / steps;
		// the ends, θ = ±π/2, add nothing across the path, and cancel along it
		for (let i = 1; i < steps; i++) {
			const theta = -Math.PI / 2 + i * h;
			// u: the passer's place along the path, less the lump's
			const u = Math.tan(theta);
			const du = 1 / Math.cos(theta) ** 2;
			const d2 = dx * dx + dy * dy + u * u;
			const pull = du / (d2 * Math.sqrt(d2));
			const weight = (i % 2 === 1 ? 4 : 2) * (h / 3);
			// the lump is pulled toward the passer
			v[0] += 0.5 * weight * pull * dx;
			v[1] += 0.5 * weight * pull * dy;
			v[2] += 0.5 * weight * pull * u;
		}
		P = [P[0] + mass * v[0], P[1] + mass * v[1], P[2] + mass * v[2]];
		energy += mass * (v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
	}
	return { P, energy };
}

describe('the planar series against the pass integrated directly', () => {
	it('gives the same momentum and the same energy for the lumps', () => {
		for (const at of [
			crossing(NEAREST, 15),
			crossing(1.2, 161.6),
			crossing(1.5, 0),
			crossing(1.5, 82.9),
			crossing(2.5, 250),
			crossing(FARTHEST, 300)
		]) {
			const direct = directPass(LUMPS, at);
			const P = momentum(lumps, at);
			expect(P.re).toBeCloseTo(direct.P[0], 7);
			expect(P.im).toBeCloseTo(direct.P[1], 7);
			expect(Math.abs(direct.P[2])).toBeLessThan(1e-9);
			relative(energySeries(LUMPS, at), direct.energy, 1e-6);
			// and what is left inside
			const inside = direct.energy - (direct.P[0] ** 2 + direct.P[1] ** 2);
			expect(internalEnergy(lumps, at)).toBeCloseTo(inside, 6);
		}
	});
});

describe('the drawing and the words', () => {
	it('draws the bead nearly to scale close in and 4 R at 2.25 R, and back', () => {
		expect(drawnDistance(1)).toBe(1);
		relative(drawnDistance(FARTHEST), 2.25, 1e-14);
		for (const d of [NEAREST, 1.5, 2, 3.3, FARTHEST])
			relative(fromDrawn(drawnDistance(d)), d, 1e-14);
	});

	it('prints three decimals, two figures below a hundredth, and 0 for zero', () => {
		expect(shown(0.08033)).toBe('0.080');
		expect(shown(0.00133)).toBe('0.0013');
		expect(shown(0)).toBe('0');
		expect(percent(-0.0781)).toBe('−7.8%');
		expect(percent(0.1267)).toBe('+12.7%');
	});
});
