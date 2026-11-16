/**
 * Rays near a black hole, for the vista demos: the exact null geodesics of the
 * Schwarzschild metric, as in reference/gravcam/schwarzschild.py, which the
 * tests compare against.
 *
 * Lengths are in units of G M / c^2. A static observer at radius r who sees a
 * ray arrive at angle psi from the direction of the hole measures the impact
 * parameter b = r sin(psi) / sqrt(1 - 2/r). Traced back, the ray falls in if it
 * heads inward with b < sqrt(27) (the shadow); otherwise it came from
 * infinity after sweeping the angle int du / sqrt(1/b^2 - u^2 + 2u^3), which
 * is a sum of incomplete elliptic integrals of the first kind.
 */

export const B_CRITICAL = Math.sqrt(27);

/** Angular radius of the shadow seen from rest at radius r > 3, radians. */
export function shadowRadius(r: number): number {
	return Math.asin((B_CRITICAL * Math.sqrt(1 - 2 / r)) / r);
}

/** Factor by which frequencies from far away arrive raised at rest at radius r. */
export function blueshift(r: number): number {
	return 1 / Math.sqrt(1 - 2 / r);
}

/** Carlson's symmetric elliptic integral R_F(x, y, z). */
function carlsonRF(x: number, y: number, z: number): number {
	for (let i = 0; i < 200; i++) {
		const sx = Math.sqrt(x);
		const sy = Math.sqrt(y);
		const sz = Math.sqrt(z);
		const l = sx * sy + sy * sz + sz * sx;
		x = (x + l) / 4;
		y = (y + l) / 4;
		z = (z + l) / 4;
		const a = (x + y + z) / 3;
		const dx = 1 - x / a;
		const dy = 1 - y / a;
		const dz = 1 - z / a;
		if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) < 1e-4) {
			const e2 = dx * dy - dz * dz;
			const e3 = dx * dy * dz;
			return (1 - e2 / 10 + e3 / 14 + (e2 * e2) / 24 - (3 * e2 * e3) / 44) / Math.sqrt(a);
		}
	}
	return NaN;
}

/** Incomplete elliptic integral of the first kind, F(phi | m), 0 <= phi <= pi/2. */
function ellipF(phi: number, m: number): number {
	const s = Math.sin(phi);
	const c = Math.cos(phi);
	return s * carlsonRF(c * c, 1 - m * s * s, 1);
}

/** The roots u1 < u2 < u3 of 2u^3 - u^2 + 1/b^2 for b > sqrt(27). */
function roots(b: number): [number, number, number] {
	const q = 1 / (2 * b * b) - 1 / 108;
	const phi = Math.acos(Math.max(-1, Math.min(1, -108 * q)));
	const u = [0, 1, 2]
		.map((k) => 1 / 6 + Math.cos((phi - 2 * Math.PI * k) / 3) / 3)
		.sort((p, r) => p - r);
	// far from the hole arccos loses precision near 1: polish with Newton's method
	const c0 = 1 / (b * b);
	for (let i = 0; i < 3; i++) {
		for (let k = 0; k < 3; k++) {
			const f = 2 * u[k] ** 3 - u[k] ** 2 + c0;
			const df = 6 * u[k] ** 2 - 2 * u[k];
			if (Math.abs(df) < 1e-300) continue;
			const t = u[k] - f / df;
			if (Math.abs(2 * t ** 3 - t ** 2 + c0) < Math.abs(f)) u[k] = t;
		}
	}
	return [u[0], u[1], u[2]];
}

/** int from uFrom to the turning point u2 of du / sqrt(P(u)), for b > sqrt(27). */
function upToTurning(b: number, uFrom: number): number {
	const [u1, u2, u3] = roots(b);
	const m = (u2 - u1) / (u3 - u1);
	const scale = Math.SQRT2 / Math.sqrt(u3 - u1);
	const from = Math.asin(Math.sqrt(Math.max(0, Math.min(1, (uFrom - u1) / (u2 - u1)))));
	return scale * (ellipF(Math.PI / 2, m) - ellipF(from, m));
}

/** Gauss-Legendre nodes and weights on [-1, 1]. */
function gaussLegendre(n: number): { x: number[]; w: number[] } {
	const x: number[] = [];
	const w: number[] = [];
	for (let i = 1; i <= n; i++) {
		let t = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		let dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1;
			let p1 = t;
			for (let k = 2; k <= n; k++) {
				const p2 = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k;
				p0 = p1;
				p1 = p2;
			}
			dp = (n * (t * p1 - p0)) / (t * t - 1);
			const step = p1 / dp;
			t -= step;
			if (Math.abs(step) < 1e-15) break;
		}
		x.push(t);
		w.push(2 / ((1 - t * t) * dp * dp));
	}
	return { x, w };
}

const GL = gaussLegendre(96);

/** int_0^uObs du / sqrt(P(u)) for b <= sqrt(27), where the integrand is smooth. */
function outward(b: number, uObs: number): number {
	let sum = 0;
	for (let i = 0; i < GL.x.length; i++) {
		const u = 0.5 * uObs * (GL.x[i] + 1);
		sum += GL.w[i] / Math.sqrt(1 / (b * b) - u * u + 2 * u ** 3);
	}
	return 0.5 * uObs * sum;
}

/**
 * The angle a ray seen at angle psi from the hole sweeps on its way back to
 * infinity, for an observer at rest at radius r; NaN if it falls in.
 */
export function sweep(r: number, psi: number): number {
	const b = Math.max((r * Math.sin(psi)) / Math.sqrt(1 - 2 / r), 1e-12);
	const uObs = 1 / r;
	if (psi < Math.PI / 2) {
		if (b <= B_CRITICAL) return NaN;
		return upToTurning(b, uObs) + upToTurning(b, 0);
	}
	if (b > B_CRITICAL) return upToTurning(b, 0) - upToTurning(b, uObs);
	return outward(b, uObs);
}

/**
 * The sweep at `n` evenly spaced angles from 0 to pi, for the shader to
 * interpolate; -1 where the ray falls in.
 */
export function sweepTable(r: number, n = 2048): Float32Array {
	const out = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const d = sweep(r, (i / (n - 1)) * Math.PI);
		out[i] = Number.isFinite(d) ? d : -1;
	}
	return out;
}
