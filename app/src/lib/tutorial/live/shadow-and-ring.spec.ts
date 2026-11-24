/**
 * Chapter 11.1's shadow and ring, against values found here by other means: the barrier's top by calculus, the
 * critical impact parameter by bisection on the rays themselves, an independent quadrature of the orbit integral
 * written out afresh, app/src/lib/vistas/lens.ts's elliptic-integral sweep, and the numbers the chapter and its card
 * print (the card's p11_lens.py and p11_rays.py).
 */
import { describe, expect, it } from 'vitest';
import { shadowRadius, sweep } from '../../vistas/lens';
import {
	B_CRITICAL,
	DEG,
	DISTANCE,
	FAN,
	LOG_DISTANCE,
	MIN_SPAN,
	TONE,
	aberrate,
	angleOf,
	barrier,
	barrierPeak,
	blueshift,
	camera,
	deflection,
	degrees,
	distanceFromLog,
	distanceText,
	exactRing,
	factorText,
	fallingSpeed,
	fan,
	hovering,
	impactOf,
	lambert,
	planeWindow,
	rayFrom,
	reachable,
	ringRay,
	scaleBar,
	shadowEdge,
	skyColour,
	skyLightness,
	tone,
	trace,
	warming,
	weakDeflection,
	weakRing
} from './shadow-and-ring';

/** The SI constants, for the neutron star: G, c and the Sun's mass. */
const G = 6.6743e-11;
const C = 299792458;
const M_SUN = 1.98847e30;

/** Gauss–Legendre nodes and weights on [−1, 1], written out afresh. */
function gauss(n: number) {
	const x: number[] = [];
	const w: number[] = [];
	for (let i = 1; i <= n; i++) {
		let t = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		let d = 0;
		for (let k = 0; k < 100; k++) {
			let p0 = 1;
			let p1 = t;
			for (let j = 2; j <= n; j++) [p0, p1] = [p1, ((2 * j - 1) * t * p1 - (j - 1) * p0) / j];
			d = (n * (t * p1 - p0)) / (t * t - 1);
			const s = p1 / d;
			t -= s;
			if (Math.abs(s) < 1e-15) break;
		}
		x.push(t);
		w.push(2 / ((1 - t * t) * d * d));
	}
	return { x, w };
}
const GL = gauss(200);

/**
 * The exact deflection by quadrature: 2∫₀^{u₂} du/√P(u) − π with P = 1/b² − u² + 2u³ = 2(u − u₁)(u₂ − u)(u₃ − u),
 * the turning point u₂ found by bisection, and u = u₂(1 − s²) to take the square root's zero out of the integrand.
 */
function quadratureDeflection(b: number): number {
	const P = (u: number) => 1 / (b * b) - u * u + 2 * u ** 3;
	let lo = 0;
	let hi = 1 / 3;
	for (let i = 0; i < 200; i++) {
		const m = (lo + hi) / 2;
		if (P(m) > 0) lo = m;
		else hi = m;
	}
	const u2 = lo;
	// the other two roots, from P/(u − u2) = 2u² + (2u2 − 1)u + (2u2² − u2) = 0
	const qa = 2;
	const qb = 2 * u2 - 1;
	const qc = 2 * u2 * u2 - u2;
	const disc = Math.sqrt(qb * qb - 4 * qa * qc);
	const u1 = (-qb - disc) / (2 * qa);
	const u3 = (-qb + disc) / (2 * qa);
	let sum = 0;
	for (let i = 0; i < GL.x.length; i++) {
		const s = 0.5 * (GL.x[i] + 1);
		const u = u2 * (1 - s * s);
		// du/√P = 2u₂s ds / √(2(u − u₁)(u₃ − u)·u₂s²)
		sum += (0.5 * GL.w[i] * 2 * Math.sqrt(u2)) / Math.sqrt(2 * (u - u1) * (u3 - u));
	}
	return 2 * sum - Math.PI;
}

const round = (x: number, d: number) => Number(x.toFixed(d));

describe('light’s barrier', () => {
	it('peaks at the photon sphere, 3GM/c² = 1.5 r_s, where d/dr[(1 − 2/r)/r²] = (6 − 2r)/r⁴ vanishes', () => {
		expect(barrierPeak()).toBeCloseTo(3, 7);
		expect(barrierPeak() / 2).toBeCloseTo(1.5, 7);
		// the derivative's sign on either side
		expect(barrier(2.99)).toBeLessThan(barrier(3));
		expect(barrier(3.01)).toBeLessThan(barrier(3));
	});

	it('has the height 1/27, so b_c = √27 GM/c² = 5.196', () => {
		expect(barrier(3)).toBeCloseTo(1 / 27, 14);
		expect(1 / Math.sqrt(barrier(barrierPeak()))).toBeCloseTo(B_CRITICAL, 7);
		expect(round(B_CRITICAL, 3)).toBe(5.196);
	});
});

describe('the exact rays', () => {
	it('separate at b_c: bisection on whether a ray from far away is captured finds √27', () => {
		let lo = 4;
		let hi = 7;
		for (let i = 0; i < 40; i++) {
			const b = (lo + hi) / 2;
			if (trace(0, 1 / b, { step: 1e-3, maxPhi: 40 * Math.PI }).fate === 'horizon') lo = b;
			else hi = b;
		}
		expect((lo + hi) / 2).toBeCloseTo(Math.sqrt(27), 5);
	});

	it('wind toward the photon sphere as b falls to b_c', () => {
		const near = trace(0, 1 / (B_CRITICAL * (1 + 1e-6)), { step: 1e-3, maxPhi: 40 * Math.PI });
		expect(near.fate).toBe('infinity');
		expect(near.rMin).toBeCloseTo(3, 2);
		expect(near.phi).toBeGreaterThan(4 * Math.PI);
	});

	it('pass at the turning point of 1/b² = u²(1 − 2u), with (du/dφ)² = 1/b² − u²(1 − 2u) kept along the way', () => {
		const b = 12;
		const ray = trace(0, 1 / b, { step: 1e-3, keep: true });
		// the turning point from the cubic, by bisection
		let lo = 0;
		let hi = 1 / 3;
		for (let i = 0; i < 100; i++) {
			const m = (lo + hi) / 2;
			if (1 / (b * b) - m * m * (1 - 2 * m) > 0) lo = m;
			else hi = m;
		}
		expect(ray.rMin).toBeCloseTo(1 / lo, 5);
		// the first integral, from consecutive points
		const [p, q] = [ray.points[400], ray.points[401]];
		const u = (pt: [number, number]) => 1 / Math.hypot(pt[0], pt[1]);
		const phi = (pt: [number, number]) => Math.atan2(pt[1], pt[0]);
		const slope = (u(q) - u(p)) / (phi(q) - phi(p));
		const mid = (u(p) + u(q)) / 2;
		expect(slope ** 2).toBeCloseTo(1 / (b * b) - mid * mid * (1 - 2 * mid), 6);
	});

	it('bend by what an independent quadrature of the orbit integral gives', () => {
		for (const b of [6, 7.17, 10, 20, 100, 1000])
			expect(Math.abs(deflection(b) - quadratureDeflection(b))).toBeLessThan(
				2e-8 * Math.max(1, 1 / b)
			);
	});

	it('bend by 1.003, 1.031 and 1.18 times 4GM/bc² at b = 1000, 100 and 20 GM/c² (the chapter’s 1.0030, 1.0306, 1.181)', () => {
		const ratio = (b: number) => deflection(b) / weakDeflection(b);
		expect(round(ratio(1000), 4)).toBe(1.003);
		expect(round(ratio(100), 4)).toBe(1.0306);
		expect(round(ratio(20), 3)).toBe(1.181);
		expect(round(ratio(1000), 3)).toBe(1.003);
		expect(round(ratio(100), 3)).toBe(1.031);
		expect(round(ratio(20), 2)).toBe(1.18);
	});

	it('beyond 4GM/bc², mostly by the second order 15π(GM/c²b)²/4', () => {
		for (const b of [20, 100, 1000]) {
			const extra = deflection(b) - 4 / b;
			const second = (15 * Math.PI) / (4 * b * b);
			expect(second / extra).toBeGreaterThan(0.6);
			expect(second / extra).toBeLessThan(1.01);
		}
		expect((15 * Math.PI) / (4 * 1000 ** 2) / (deflection(1000) - 4 / 1000)).toBeCloseTo(1, 1);
	});

	it('bend a ray grazing a neutron star of 1.4 M_☉ and 12 km by 1.07 rad, against 0.56 rad from 4GM/bc²', () => {
		const R = 12e3 / ((G * 1.4 * M_SUN) / C ** 2);
		const b = reachable(R);
		expect(round(b, 2)).toBe(7.17);
		expect(trace(0, 1 / b).rMin).toBeCloseTo(R, 6);
		expect(round(deflection(b), 3)).toBe(1.069);
		expect(round(weakDeflection(b), 3)).toBe(0.558);
		expect(round(deflection(b), 2)).toBe(1.07);
		expect(round(weakDeflection(b), 2)).toBe(0.56);
	});

	it('sweep from a camera at rest to infinity as lens.ts’s elliptic integrals say, on both sides of the hole', () => {
		for (const r of [3.5, 6, 10, 40, 200]) {
			const edge = shadowRadius(r);
			for (const f of [1.0005, 1.01, 1.1, 1.5, 3, 6, 12]) {
				const psi = Math.min(edge * f, Math.PI * 0.999);
				const ray = rayFrom(r, psi, { step: 1e-3 });
				expect(ray.fate).toBe('infinity');
				expect(Math.abs(ray.phi - sweep(r, psi))).toBeLessThan(1e-7 * Math.max(1, ray.phi));
			}
			// inside the shadow the ray came out of the horizon, as lens.ts says too
			expect(rayFrom(r, edge * 0.999).fate).toBe('horizon');
			expect(Number.isNaN(sweep(r, edge * 0.999))).toBe(true);
		}
	});
});

describe('the shadow', () => {
	it('is 7.27° at 40 GM/c², 27.7° at 10 and 90° at the photon sphere', () => {
		expect(round(shadowEdge(40) / DEG, 3)).toBe(7.274);
		expect(round(shadowEdge(10) / DEG, 2)).toBe(27.69);
		expect(shadowEdge(3) / DEG).toBeCloseTo(90, 6);
	});

	it('is lens.ts’s outside the photon sphere and wider than 90° inside it', () => {
		for (const r of [3.2, 5, 40, 200]) expect(shadowEdge(r)).toBe(shadowRadius(r));
		for (const r of [2.05, 2.5, 2.9]) expect(shadowEdge(r)).toBeGreaterThan(Math.PI / 2);
	});

	it('has its edge where the rays traced back from the camera stop falling in, at every distance', () => {
		for (const r of [2.05, 2.5, 2.9, 3.1, 10, 40, 200]) {
			const edge = shadowEdge(r);
			expect(rayFrom(r, edge - 1e-4, { maxPhi: 40 * Math.PI }).fate).toBe('horizon');
			expect(rayFrom(r, edge + 1e-4, { maxPhi: 40 * Math.PI }).fate).toBe('infinity');
		}
	});

	it('shrinks to 5.80° for a camera falling past 40 GM/c², and toward 42.1° at the horizon (chapter 6.3)', () => {
		expect(round(aberrate(shadowEdge(40), fallingSpeed(40)) / DEG, 2)).toBe(5.8);
		expect(round(Math.cos(aberrate(shadowEdge(40), fallingSpeed(40))), 5)).toBe(0.99489);
		const near = aberrate(shadowEdge(2.00001), fallingSpeed(2.00001));
		expect(near / DEG).toBeCloseTo(Math.acos(23 / 31) / DEG, 1);
		expect(round(Math.acos(23 / 31) / DEG, 1)).toBe(42.1);
	});
});

describe('the ring', () => {
	it('is 20.20° at 40 GM/c², with b = 14.2 GM/c², against the weak field’s 18.12°', () => {
		const ring = exactRing(40);
		expect(round(ring / DEG, 2)).toBe(20.2);
		expect(round(impactOf(40, ring), 1)).toBe(14.2);
		expect(round(weakRing(40) / DEG, 2)).toBe(18.12);
	});

	it('is where lens.ts’s sweep is exactly 180°', () => {
		for (const r of [3.5, 10, 40, 200]) expect(sweep(r, exactRing(r))).toBeCloseTo(Math.PI, 7);
	});

	it('has the weak field 10% short at 40 GM/c² and still 5% short at 200', () => {
		const short = (r: number) => 1 - weakRing(r) / exactRing(r);
		expect(Math.round(100 * short(40))).toBe(10);
		expect(Math.round(100 * short(200))).toBe(5);
		// closing on it all the way out
		const radii = [2.05, 3, 5, 10, 20, 40, 80, 120, 200];
		for (let i = 1; i < radii.length; i++)
			expect(short(radii[i])).toBeLessThan(short(radii[i - 1]));
	});

	it('lies outside the shadow at every distance, beyond 90° inside the photon sphere', () => {
		for (const r of [2.05, 2.3, 2.9, 3, 3.5, 10, 40, 200]) {
			expect(exactRing(r)).toBeGreaterThan(shadowEdge(r));
			expect(exactRing(r)).toBeLessThan(Math.PI);
		}
		expect(exactRing(2.5)).toBeGreaterThan(Math.PI / 2);
	});

	it('is the same with a finer step', () => {
		for (const r of [2.05, 40, 200]) expect(exactRing(r, 5e-4)).toBeCloseTo(exactRing(r), 7);
	});
});

describe('the camera', () => {
	it('sees the sky at rest warmer by 1/√(1 − r_s/r): 1.0260 at 40 GM/c²', () => {
		expect(round(blueshift(40), 4)).toBe(1.026);
		expect(round(0.905 * blueshift(40), 4)).toBe(0.9285);
		expect(warming(0.3, 40, 'rest')).toBe(blueshift(40));
	});

	it('falls past 40 GM/c² at 0.2236c and past the photon sphere at 0.8165c', () => {
		expect(round(fallingSpeed(40), 4)).toBe(0.2236);
		expect(round(fallingSpeed(3), 4)).toBe(0.8165);
	});

	it('needs (GM/r²)/√(1 − r_s/r) to hover: 6.41 × 10⁻⁴ c⁴/GM at 40 GM/c², without limit at the horizon', () => {
		expect(Number(hovering(40).toPrecision(3))).toBe(6.41e-4);
		expect(hovering(2.0001)).toBeGreaterThan(10);
		// 1.36 × 10²³ kg is not needed: the unit c⁴/GM carries the mass
		expect(hovering(1e6) * 1e12).toBeCloseTo(1, 5);
	});

	it('falling, sees the blueshift times the Doppler factor, 1/(1 − β cos ψ′), and the sky’s own temperature at 90°', () => {
		for (const r of [2.05, 3, 40, 200]) {
			const beta = fallingSpeed(r);
			const gamma = 1 / Math.sqrt(1 - beta * beta);
			for (const psi of [0.3, 1, 2, 3]) {
				const seen = aberrate(psi, beta);
				// the Doppler factor as chapter 6.3 writes it, in the moving frame
				expect(warming(seen, r, 'falling')).toBeCloseTo(
					blueshift(r) / (gamma * (1 - beta * Math.cos(seen))),
					10
				);
			}
			expect(warming(Math.PI / 2, r, 'falling')).toBeCloseTo(1, 12);
			expect(warming(Math.PI, r, 'falling')).toBeCloseTo(1 / (1 + beta), 12);
		}
	});

	it('brings the readouts together, aberrated only when falling', () => {
		const rest = camera(40, 'rest');
		expect(rest.shadowSeen).toBe(rest.shadow);
		expect(rest.ringSeen).toBe(rest.ring);
		expect(rest.warmest).toBe(rest.coolest);
		const falling = camera(40, 'falling');
		expect(round(falling.shadowSeen / DEG, 2)).toBe(5.8);
		expect(falling.ringSeen).toBeLessThan(falling.ring);
		expect(falling.warmest).toBeGreaterThan(1);
		expect(falling.coolest).toBeLessThan(1);
	});
});

describe('aberration', () => {
	it('is chapter 6.3’s cos ψ′ = (cos ψ + β)/(1 + β cos ψ), keeping the hole and the point behind it', () => {
		for (const beta of [0.2236, 0.6, 0.99])
			for (const psi of [0.1, 1, 1.6, 2.5, 3.1]) {
				expect(Math.cos(aberrate(psi, beta))).toBeCloseTo(
					(Math.cos(psi) + beta) / (1 + beta * Math.cos(psi)),
					12
				);
			}
		expect(aberrate(0, 0.5)).toBe(0);
		expect(aberrate(Math.PI, 0.5)).toBeCloseTo(Math.PI, 12);
	});
});

describe('the drawing', () => {
	it('opens at 40 GM/c², at rest, with a slider from 2.05 to 200 on a scale of powers of ten', () => {
		expect(DISTANCE.opening).toBe(40);
		expect(distanceFromLog(Math.log10(40))).toBeCloseTo(40, 12);
		expect(distanceFromLog(LOG_DISTANCE.low - 1)).toBe(2.05);
		expect(distanceFromLog(LOG_DISTANCE.high + 1)).toBeCloseTo(200, 10);
	});

	it('keeps the camera and the hole in the window, the hole never more than a tenth of the span across', () => {
		for (let v = LOG_DISTANCE.low; v <= LOG_DISTANCE.high; v += 0.02) {
			const r = distanceFromLog(v);
			for (const aspect of [300 / 420, 250 / 360]) {
				const w = planeWindow(r, aspect);
				expect(w.xMin).toBeLessThan(-3);
				expect(w.xMax).toBeGreaterThan(r + 2);
				expect(w.span).toBeGreaterThanOrEqual(MIN_SPAN);
				expect(4 / w.span).toBeLessThanOrEqual(0.1);
			}
		}
	});

	it('marks a scale of 1, 2 or 5 times a power of ten', () => {
		expect(scaleBar(40)).toBe(10);
		expect(scaleBar(60)).toBe(10);
		expect(scaleBar(300)).toBe(50);
		expect(scaleBar(20)).toBe(5);
	});

	it('fans rays from 0.5 b_c to 3 b_c: inside b_c into the horizon, outside it round the hole', () => {
		expect(FAN[0]).toBe(0.5);
		expect(FAN[FAN.length - 1]).toBe(3);
		const rays = fan(40, 200);
		expect(rays).toHaveLength(FAN.length);
		for (const ray of rays) {
			expect(ray.fate).toBe(ray.k < 1 ? 'horizon' : 'infinity');
			// each starts on the camera, at the angle sin ψ = (b/r)√(1 − r_s/r)
			expect(ray.points[0][0]).toBeCloseTo(40, 10);
			expect(ray.points[0][1]).toBeCloseTo(0, 10);
			expect(Math.sin(ray.psi)).toBeCloseTo((ray.b / 40) * Math.sqrt(1 - 2 / 40), 12);
			const end = ray.points[ray.points.length - 1];
			expect(Math.hypot(end[0], end[1])).toBeCloseTo(ray.fate === 'horizon' ? 2 : 200, 6);
		}
	});

	it('inside the photon sphere, ends every ray from the side of the hole on the horizon, and drops those that cannot reach', () => {
		const rays = fan(2.5, 100);
		expect(rays.length).toBeLessThan(FAN.length);
		for (const ray of rays) {
			expect(ray.fate).toBe('horizon');
			expect(ray.b).toBeLessThanOrEqual(reachable(2.5));
			expect(angleOf(2.5, ray.b)).toBeLessThanOrEqual(Math.PI / 2);
		}
	});

	it('draws the ring’s ray swinging round to the far side of the hole', () => {
		const pts = ringRay(40, 300);
		const end = pts[pts.length - 1];
		expect(Math.hypot(end[0], end[1])).toBeCloseTo(300, 6);
		// far away it heads back along the axis, straight behind the hole: its height there is close to b
		expect(end[0]).toBeLessThan(-280);
		expect(Math.abs(end[1])).toBeLessThan(2 * impactOf(40, exactRing(40)));
	});

	it('projects the sky by equal areas: 90° at √½ of the radius, the point behind the hole on the rim', () => {
		expect(lambert(0)).toBe(0);
		expect(lambert(Math.PI / 2)).toBeCloseTo(Math.SQRT1_2, 14);
		expect(lambert(Math.PI)).toBe(1);
		// the area inside ψ, 2π(1 − cos ψ) of 4π, against the disc's π(R sin(ψ/2))² of πR²
		for (const psi of [0.2, 1, 2])
			expect(lambert(psi) ** 2).toBeCloseTo((1 - Math.cos(psi)) / 2, 14);
	});

	it('colours the sky by its warming in a neutral grey, brighter where warmer, on a scale from 1/2 to 100', () => {
		expect(tone(TONE.low)).toBe(0);
		expect(tone(TONE.high)).toBeCloseTo(1, 14);
		expect(tone(1000)).toBe(1);
		expect(skyLightness(2)).toBeGreaterThan(skyLightness(1));
		expect(skyColour(1)).toMatch(/^oklch\(0\.\d{4} 0\.012 80\)$/);
	});
});

describe('the words', () => {
	it('print angles to two decimals, distances to three figures and factors near 1 to four', () => {
		expect(degrees(exactRing(40))).toBe('20.20');
		expect(distanceText(2.05)).toBe('2.05');
		expect(distanceText(40)).toBe('40.0');
		expect(distanceText(200)).toBe('200');
		expect(factorText(blueshift(40))).toBe('1.026');
		expect(factorText(6.4)).toBe('6.40');
		expect(factorText(81.47)).toBe('81.5');
	});
});
