/** The live figure "image charge": Kelvin's image, the mirror image, their Poisson kernels and the skin of balayage. */
import { describe, expect, it } from 'vitest';
import { grid, isolines } from './potential-map';
import {
	EQUIPOTENTIALS,
	PLANE_LEAST,
	PLANE_MOST,
	STEP_LEAST,
	STEP_MOST,
	S_MOST,
	S_OPEN,
	Z_OPEN,
	apollonius,
	ballBands,
	ballGreen,
	ballKernel,
	ballTerms,
	compareAt,
	ellipticK,
	kelvinImage,
	kernelBottom,
	kernelIntegral,
	kernelTop,
	nuggetPotential,
	sampleField,
	GREEN_LEVELS,
	planeBands,
	planeGreen,
	planeKernel,
	planeKernelIntegral,
	planeWidth,
	ringsMass,
	skinLine,
	skinPotential,
	skinPotentialAxial,
	skinRings,
	stepOf
} from './image-charge';

/** ∫ f from a to b by Gauss–Legendre on n panels of five points. */
function gauss(f: (x: number) => number, a: number, b: number, n = 200) {
	const xs = [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664];
	const ws = [
		0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891,
		0.2369268850561891
	];
	const h = (b - a) / n;
	let sum = 0;
	for (let k = 0; k < n; k++) {
		const mid = a + (k + 0.5) * h;
		for (let i = 0; i < 5; i++) sum += (h / 2) * ws[i] * f(mid + (h / 2) * xs[i]);
	}
	return sum;
}

/** Points round a circle of radius r about the origin. */
const round = (r: number, n = 36) =>
	Array.from({ length: n }, (_, k) => {
		const th = (2 * Math.PI * k) / n + 0.1;
		return { x: r * Math.cos(th), y: r * Math.sin(th) };
	});

describe("Kelvin's image in a ball", () => {
	it('lies at R²/s on the same ray, with the weight R/s', () => {
		const half = kelvinImage({ x: 0, y: 0.5 });
		expect(half.at!.x).toBeCloseTo(0, 15);
		expect(half.at!.y).toBeCloseTo(2, 14);
		expect(half.weight).toBeCloseTo(2, 14);
		// the chapter's check question: a point at 0.8 of the radius
		const p = kelvinImage({ x: 0.48, y: -0.64 });
		expect(p.distance).toBeCloseTo(1.25, 14);
		expect(p.weight).toBeCloseTo(1.25, 14);
		expect(p.at!.x / p.at!.y).toBeCloseTo(0.48 / -0.64, 14);
	});

	it('goes to infinity at the centre', () => {
		const c = kelvinImage({ x: 0, y: 0 });
		expect(c.at).toBeUndefined();
		expect(c.distance).toBe(Infinity);
	});

	it('makes the Dirichlet Green’s function vanish on the whole sphere, and only there', () => {
		for (const s of [
			{ x: 0, y: 0 },
			{ x: 0, y: 0.5 },
			{ x: 0.3, y: -0.4 },
			{ x: -0.9, y: 0.1 },
			{ x: 0, y: S_MOST }
		]) {
			for (const x of round(1)) {
				const terms = ballTerms(x, s);
				expect(Math.abs(ballGreen(x, s))).toBeLessThan(1e-12 * Math.abs(terms.source));
				expect(terms.source + terms.image).toBeCloseTo(ballGreen(x, s), 14);
			}
			// negative inside, where the source is, and positive outside
			expect(ballGreen({ x: 0.99 * Math.cos(1), y: 0.99 * Math.sin(1) }, s)).toBeLessThan(0);
			expect(ballGreen({ x: 1.01 * Math.cos(1), y: 1.01 * Math.sin(1) }, s)).toBeGreaterThan(0);
		}
	});

	it('puts the zero on the circle of Apollonius of s and s*, which is the ball', () => {
		for (const s of [
			{ x: 0, y: 0.5 },
			{ x: 0.2, y: 0.7 },
			{ x: -0.05, y: 0.02 }
		]) {
			const img = kelvinImage(s);
			const c = apollonius(s, img.at!, img.weight);
			expect(Math.hypot(c.centre.x, c.centre.y)).toBeLessThan(1e-12);
			expect(c.radius).toBeCloseTo(1, 12);
		}
	});

	it('has the Poisson kernel as its slope along the outward normal', () => {
		const h = 1e-5;
		for (const s of [
			{ x: 0, y: 0.5 },
			{ x: 0.6, y: 0.3 }
		]) {
			const t = Math.hypot(s.x, s.y);
			for (const x of round(1, 12)) {
				const slope =
					(ballGreen({ x: x.x * (1 + h), y: x.y * (1 + h) }, s) -
						ballGreen({ x: x.x * (1 - h), y: x.y * (1 - h) }, s)) /
					(2 * h);
				const mu = (x.x * s.x + x.y * s.y) / t;
				// 4π𝒢_D in units of 1/R, so its slope is 4π P in units of 1/R²: the kernel in units of 1/4πR²
				expect(slope).toBeCloseTo(ballKernel(mu, t), 6);
			}
		}
	});
});

describe('the level lines the figure traces', () => {
	it('trace the zero of 𝒢_D on the ball’s own circle, and on the plane', () => {
		const sheet = grid({ left: -2.6, top: 2.6, width: 5.2, height: 5.2, step: 0.02 });
		expect(GREEN_LEVELS).toContain(0);
		for (const s of [
			{ x: 0, y: 0.5 },
			{ x: 0.5, y: -0.6 },
			{ x: 0, y: 0 }
		]) {
			sampleField(sheet, (p) => ballGreen(p, s), 60);
			const loops = isolines(sheet, 0);
			let n = 0;
			for (const loop of loops)
				for (let k = 0; k < loop.length; k += 2) {
					expect(Math.abs(Math.hypot(loop[k], loop[k + 1]) - 1)).toBeLessThan(2e-3);
					n++;
				}
			expect(n).toBeGreaterThan(300);
		}
		sampleField(sheet, (p) => planeGreen(p, { x: 0.3, y: 0.5 }), 60);
		// inside the frame; the line closes round the top half on the ring of nodes outside it, which the figure clips
		let m = 0;
		for (const loop of isolines(sheet, 0))
			for (let k = 0; k < loop.length; k += 2)
				if (Math.abs(loop[k]) < 2.6 - 1e-9 && loop[k + 1] < 2.6 - 1e-9) {
					expect(Math.abs(loop[k + 1])).toBeLessThan(1e-9);
					m++;
				}
		expect(m).toBeGreaterThan(200);
	});
});

describe('the Poisson kernel of the ball', () => {
	it('integrates to 1 over the sphere', () => {
		for (const t of [0, 0.25, 0.5, 0.8, 0.9, S_MOST]) {
			expect(kernelIntegral(t)).toBeCloseTo(1, 12);
			// independently, on 4000 even panels: ½ ∫ P dμ
			expect(0.5 * gauss((mu) => ballKernel(mu, t), -1, 1, 4000)).toBeCloseTo(1, 9);
		}
	});

	it('gives the chapter’s numbers: 6, then 190, over the source; 0.22 opposite', () => {
		expect(kernelTop(0.5)).toBeCloseTo(6, 12);
		expect(ballKernel(1, 0.5)).toBeCloseTo(6, 12);
		expect(kernelTop(0.9)).toBeCloseTo(190, 9);
		expect(kernelBottom(0.5)).toBeCloseTo(0.22, 2);
		expect(ballKernel(-1, 0.5)).toBeCloseTo(2 / 9, 12);
		expect(kernelBottom(0.9)).toBeCloseTo(0.028, 3);
	});

	it('is uniform, 1/4πR², with the source at the centre: the mean value property', () => {
		for (const mu of [-1, -0.3, 0, 0.7, 1]) expect(ballKernel(mu, 0)).toBe(1);
		expect(kernelTop(0)).toBe(1);
		expect(kernelBottom(0)).toBe(1);
	});

	it('has its centre of mass at the source (the stretch problem): 0.500 R at s = R/2', () => {
		const first = 0.5 * gauss((mu) => mu * ballKernel(mu, 0.5), -1, 1, 4000);
		expect(first).toBeCloseTo(0.5, 9);
	});
});

describe('the mirror image above a plane', () => {
	it('makes the Dirichlet Green’s function vanish on the plane', () => {
		for (const x of [
			{ x: 0, y: Z_OPEN },
			{ x: 1.3, y: 2 }
		])
			for (const a of [-3, -0.4, 0, 0.7, 2.5])
				expect(Math.abs(planeGreen({ x: a, y: 0 }, x))).toBeLessThan(1e-15);
	});

	it('has the half-space kernel as its slope along the outward normal, which points down', () => {
		const h = 1e-6;
		const x = { x: 0.3, y: 0.7 };
		for (const a of [-2, -0.5, 0.3, 1.1]) {
			const slope = -(planeGreen({ x: a, y: h }, x) - planeGreen({ x: a, y: -h }, x)) / (2 * h);
			expect(slope / (4 * Math.PI)).toBeCloseTo(planeKernel(a - x.x, x.y), 7);
		}
	});

	it('has a kernel of area 1, height 1/2πz² and full width 1.53z', () => {
		for (const z of [0.4, 0.5, 0.7, 1, 2]) {
			expect(planeKernelIntegral(z)).toBeCloseTo(1, 12);
			// independently, 2π ∫ P_z a da out to 10⁴ z, and the tail beyond, z/(10⁴ z)
			const near = gauss((a) => 2 * Math.PI * a * planeKernel(a, z), 0, 1e4 * z, 200000);
			expect(near + 1e-4).toBeCloseTo(1, 8);
			const w = planeWidth(z);
			expect(planeKernel(w / 2, z) / planeKernel(0, z)).toBeCloseTo(0.5, 12);
		}
		expect(planeKernel(0, 0.5)).toBeCloseTo(0.64, 2);
		expect(planeKernel(0, 1)).toBeCloseTo(0.16, 2);
		expect(planeWidth(0.5)).toBeCloseTo(0.77, 2);
		expect(planeWidth(1)).toBeCloseTo(1.53, 2);
	});

	it('continues a person’s potential from the plane up 0.5 m to its value at 1.5 m', () => {
		// −1/√(a² + 1) on the plane, the person 1 m below; continued to z = 0.5 above a = 0
		const f = (a: number) => 2 * Math.PI * a * planeKernel(a, 0.5) * (-1 / Math.sqrt(a * a + 1));
		// beyond 2000 m the integrand is −z/a³, whose tail −z/2a² is 6 × 10⁻⁸
		const sum = gauss(f, 0, 2000, 400000) - 0.5 / (2 * 2000 ** 2);
		expect(sum).toBeCloseTo(-1 / 1.5, 6);
	});
});

describe('the skin of balayage', () => {
	it('holds the nugget’s mass', () => {
		for (const t of [0, 0.1, S_OPEN, 0.9, S_MOST])
			expect(ringsMass(skinRings(t))).toBeCloseTo(1, 12);
	});

	it('uses rings whose potential is the elliptic integral', () => {
		expect(ellipticK(0)).toBeCloseTo(Math.PI / 2, 15);
		expect(ellipticK(0.5)).toBeCloseTo(1.8540746773013719, 14);
		expect(ellipticK(0.99)).toBeCloseTo(3.6956373629898747, 12);
	});

	it('pulls at (2R, 0, R) as the nugget does: 0.485071 Gm/R', () => {
		const s = { x: 0, y: S_OPEN };
		const c = compareAt(skinRings(S_OPEN), s, { x: 2, y: 1 });
		expect(-c.nugget).toBeCloseTo(0.485071, 6);
		expect(Math.abs(c.skin - c.nugget)).toBeLessThan(1e-12);
	});

	it('agrees with a plain quadrature over the sphere in angle and azimuth', () => {
		// the skin's potential at a point off the axis, summed over μ and φ without rings
		const t = 0.7;
		const along = 0.4;
		const off = 1.6;
		const direct = gauss(
			(mu) => {
				const rr = Math.sqrt(1 - mu * mu);
				const ring = gauss(
					(phi) => -1 / Math.hypot(off - rr * Math.cos(phi), rr * Math.sin(phi), along - mu),
					0,
					2 * Math.PI,
					40
				);
				return (0.5 * ballKernel(mu, t) * ring) / (2 * Math.PI);
			},
			-1,
			1,
			2000
		);
		expect(skinPotentialAxial(skinRings(t), along, off)).toBeCloseTo(direct, 10);
	});

	it('has the nugget’s field everywhere outside the ball, to high precision', () => {
		for (const t of [0, 0.3, S_OPEN, 0.9, S_MOST]) {
			const r = skinRings(t);
			const s = { x: t * Math.cos(0.7), y: t * Math.sin(0.7) };
			for (const radius of [1.05, 1.2, 1.6, 2.5, 6])
				for (const q of round(radius, 24)) {
					const skin = skinPotential(r, s, q);
					const nugget = nuggetPotential(s, q);
					expect(Math.abs(skin - nugget) / Math.abs(nugget)).toBeLessThan(1e-9);
				}
			// close to the sphere, inside where the drawing stops, still to 10⁻⁵
			for (const q of round(1.02, 72)) expect(compareAt(r, s, q).apart).toBeLessThan(1e-5);
		}
	});

	it('does not have the nugget’s potential inside the ball: there it is the Kelvin image’s', () => {
		const t = 0.5;
		const s = { x: 0, y: t };
		const r = skinRings(t);
		for (const p of [
			{ x: 0, y: 0 },
			{ x: 0.3, y: -0.2 }
		]) {
			const img = kelvinImage(s);
			const kelvin = -img.weight / Math.hypot(p.x - img.at!.x, p.y - img.at!.y);
			expect(skinPotential(r, s, p)).toBeCloseTo(kelvin, 9);
			expect(Math.abs(skinPotential(r, s, p) - nuggetPotential(s, p))).toBeGreaterThan(0.1);
		}
	});

	it('draws its own equipotentials on the nugget’s circles, broken where they would enter the ball', () => {
		const s = { x: 0.2, y: 0.85 };
		const r = skinRings(Math.hypot(s.x, s.y));
		for (const d of EQUIPOTENTIALS) {
			const line = skinLine(r, s, d, 1.03);
			for (const run of line.runs)
				for (const p of run) {
					expect(Math.hypot(p.x - s.x, p.y - s.y)).toBeCloseTo(d, 9);
					expect(Math.hypot(p.x, p.y)).toBeGreaterThanOrEqual(1.03);
				}
		}
		// the smallest circle crosses the sphere and is broken; the largest lies outside whole
		expect(skinLine(r, s, EQUIPOTENTIALS[0], 1.03).closed).toBe(false);
		expect(skinLine(r, s, EQUIPOTENTIALS[EQUIPOTENTIALS.length - 1], 1.03).closed).toBe(true);
		expect(skinLine(r, s, EQUIPOTENTIALS[0], 1.03).runs).toHaveLength(1);
	});
});

describe('the shading, in steps that double', () => {
	it('puts the chapter’s values in their steps', () => {
		expect(stepOf(1)).toBe(0);
		expect(stepOf(6)).toBe(2);
		expect(stepOf(190)).toBe(STEP_MOST);
		expect(stepOf(0.22)).toBe(-3);
		expect(stepOf(0.001)).toBe(STEP_LEAST);
		expect(stepOf(0.64, PLANE_LEAST, PLANE_MOST)).toBe(-1);
		expect(stepOf(3, PLANE_LEAST, PLANE_MOST)).toBe(PLANE_MOST);
	});

	it('shades a uniform skin in one step, and the skin at R/2 from step 2 down to step −3', () => {
		const uniform = ballBands(0);
		expect(uniform.filter((p) => p).length).toBe(1);
		expect(uniform[-STEP_LEAST]).not.toBe('');
		const half = ballBands(0.5);
		const used = half.map((p, k) => (p ? k + STEP_LEAST : NaN)).filter((k) => !Number.isNaN(k));
		expect(Math.max(...used)).toBe(2);
		expect(Math.min(...used)).toBe(-3);
		expect(planeBands(0.5, 2.6, 0.1)).toHaveLength(PLANE_MOST - PLANE_LEAST + 1);
	});
});
