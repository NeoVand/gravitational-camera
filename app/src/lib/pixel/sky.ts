/**
 * What one pixel sees of the sky (paper, Eq. sky-count): from second moments, exactly the spherical harmonics of the
 * sky's brightness of degree four and below; from fourth moments (sources that are not Gaussian), up to degree
 * eight. Twelve sources at the corners of an icosahedron, a spherical design of degree five, give a pixel the same
 * second moments as a uniform sky; six at the corners of an octahedron, a design of degree three, do not. Used by
 * the demo "One pixel's sky" (routes/demo/one-pixel-sky).
 */
import { add, conj, cx, dot, mul, unit, ZERO, type Complex, type Vec3 } from './complex';
import { steeringOf } from './pixel';

export interface Source {
	direction: Vec3;
	weight: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;

export const SKIES: Record<string, { label: string; sources: Source[] | 'uniform' }> = {
	icosahedron: {
		label: 'Twelve, at the corners of an icosahedron',
		sources: [-1, 1].flatMap((s) =>
			[-1, 1].flatMap((t) =>
				(
					[
						[0, s, t * PHI],
						[s, t * PHI, 0],
						[t * PHI, 0, s]
					] as Vec3[]
				).map((d) => ({ direction: unit(d), weight: 1 }))
			)
		)
	},
	uniform: { label: 'A uniform sky', sources: 'uniform' },
	octahedron: {
		label: 'Six, at the corners of an octahedron',
		sources: (
			[
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1]
			] as Vec3[]
		).map((d) => ({ direction: d, weight: 2 }))
	},
	two: {
		label: 'Two sources',
		sources: [
			{ direction: unit([0.5, 0.6, 0.62]), weight: 6 },
			{ direction: unit([-0.7, -0.2, 0.68]), weight: 6 }
		]
	}
};

/** Legendre polynomials P_0 .. P_lmax at x. */
function legendre(x: number, lmax: number): number[] {
	const p = [1, x];
	for (let l = 1; l < lmax; l++) p.push(((2 * l + 1) * x * p[l] - l * p[l - 1]) / (l + 1));
	return p.slice(0, lmax + 1);
}

/** The sky's brightness kept to its harmonics of degree lmax and below, at direction n (per steradian). */
export function lowPass(sources: Source[] | 'uniform', lmax: number, n: Vec3): number {
	if (sources === 'uniform') return 12 / (4 * Math.PI);
	let sum = 0;
	for (const s of sources) {
		const p = legendre(dot(n, s.direction), lmax);
		for (let l = 0; l <= lmax; l++) sum += (s.weight * (2 * l + 1) * p[l]) / (4 * Math.PI);
	}
	return sum;
}

/**
 * The pixel's spectral matrix in one helicity, 5x5 Hermitian: the sum over independent sources of their steering
 * vectors' outer products. A uniform sky of the same total gives (total / 5) times the identity.
 */
export function spectralMatrix(sources: Source[] | 'uniform'): Complex[][] {
	if (sources === 'uniform')
		return Array.from({ length: 5 }, (_, i) =>
			Array.from({ length: 5 }, (_, j) => cx(i === j ? 12 / 5 : 0))
		);
	const S = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ZERO));
	for (const s of sources) {
		const a = steeringOf(s.direction);
		for (let i = 0; i < 5; i++)
			for (let j = 0; j < 5; j++) S[i][j] = add(S[i][j], mul(cx(s.weight), mul(a[i], conj(a[j]))));
	}
	return S;
}

/** How far a sky's spectral matrix is from a uniform sky's of the same total, relative to it. */
export function distanceFromUniform(sources: Source[] | 'uniform'): number {
	const S = spectralMatrix(sources);
	const U = spectralMatrix('uniform');
	let d = 0,
		u = 0;
	for (let i = 0; i < 5; i++)
		for (let j = 0; j < 5; j++) {
			d += (S[i][j].re - U[i][j].re) ** 2 + (S[i][j].im - U[i][j].im) ** 2;
			u += U[i][j].re ** 2 + U[i][j].im ** 2;
		}
	return Math.sqrt(d / u);
}
