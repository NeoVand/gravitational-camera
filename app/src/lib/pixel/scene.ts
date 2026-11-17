/**
 * One scene read by two pixels at the same point: one of gravity, one of light. The sources are bodies (a mass and a
 * charge each, so that the two readings are of the same arrangement) and at most one plane wave. Used by the demo
 * "The four stars" (routes/demo/four-stars).
 */
import {
	abs,
	cx,
	dot,
	madd,
	minus,
	norm,
	plus,
	times,
	unit,
	type CMat3,
	type CVec3,
	type Vec3
} from './complex';
import {
	C,
	G,
	bodyVelocity,
	lightStars,
	lightWaveF,
	movingChargesF,
	movingMassesW,
	petrov,
	planeWaveW,
	speciality,
	stars
} from './pixel';

export interface Source {
	/** present position, in metres (the drawing's unit: the sky has radius 1) */
	position: Vec3;
	/** kg, for gravity */
	mass: number;
	/** for light, in units with E = q R / r^3 */
	charge: number;
	/** in units of c */
	velocity: Vec3;
}

export interface Wave {
	/** direction of travel */
	k: Vec3;
	/** relative to the pull (or, for light, the field) of the first source at the pixel; 1 if there is none */
	strength: number;
}

export interface Star {
	direction: Vec3;
	/** how many of the field's stars coincide here */
	count: number;
}

/** Coincident stars merged, within `tol` (radians, near enough). */
export function groupStars(dirs: Vec3[], tol = 0.02): Star[] {
	const out: { sum: Vec3; count: number }[] = [];
	for (const d of dirs) {
		const g = out.find((s) => norm(minus(unit(s.sum), d)) < tol);
		if (g) {
			g.sum = plus(g.sum, d);
			g.count++;
		} else out.push({ sum: d, count: 1 });
	}
	return out.map((s) => ({ direction: unit(s.sum), count: s.count }));
}

function scaleOf(sources: Source[], power: number, weight: (s: Source) => number): number {
	if (!sources.length) return 1;
	const s = sources[0];
	return weight(s) / norm(s.position) ** power;
}

export interface GravityReading {
	W: CMat3;
	stars: Star[];
	type: string;
	/** |1 - 6 J^2 / I^3|: zero for one body, NaN for a pure wave */
	speciality: number;
	/** v_perp / c read from the stars, when the field is that of one body */
	read?: Vec3;
}

export function readGravity(sources: Source[], wave?: Wave): GravityReading {
	let W = movingMassesW(
		sources.map((s) => ({ mass: s.mass, position: s.position, velocity: times(s.velocity, C) }))
	);
	if (wave) {
		const a = wave.strength * (sources.length ? scaleOf(sources, 3, (s) => G * s.mass) : 1);
		W = madd(W, planeWaveW(wave.k, cx(a)));
	}
	const type = petrov(W, 1e-9);
	const sp = speciality(W);
	return {
		W,
		stars: groupStars(stars(W)),
		type,
		speciality: abs(sp),
		read: type === 'D' && sources.length === 1 && !wave ? bodyVelocity(W) : undefined
	};
}

export interface LightReading {
	F: CVec3;
	stars: Star[];
}

export function readLight(sources: Source[], wave?: Wave): LightReading {
	let F = movingChargesF(
		sources.map((s) => ({ charge: s.charge, position: s.position, velocity: times(s.velocity, C) }))
	);
	if (wave) {
		const a = wave.strength * (sources.length ? scaleOf(sources, 2, (s) => s.charge) : 1);
		const Fw = lightWaveF(wave.k, cx(a));
		F = [0, 1, 2].map((i) => cx(F[i].re + Fw[i].re, F[i].im + Fw[i].im)) as CVec3;
	}
	return { F, stars: groupStars(lightStars(F)) };
}

/** A source's velocity across the line from it to the pixel (at the origin), in units of c. */
export function sideways(s: Source): Vec3 {
	const n = unit(times(s.position, -1));
	return minus(s.velocity, times(n, dot(s.velocity, n)));
}
