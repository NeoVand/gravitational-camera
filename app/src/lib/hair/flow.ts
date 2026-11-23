/**
 * A hidden flow (paper, Section XIII, "The flow", Eqs. flow-bracket and hidden-spin, Fig. hidden-flow;
 * reference/gravcam/figure_data.py, hidden_flow). A uniform sphere of mass M and radius R whose inner ball, out to
 * x R, turns about the z axis one way at the rate Omega and the rest the other way at the same rate. At x = 2^(-1/5)
 * the two halves of its angular momentum cancel: it has none, and no magnetic field outside if it is charged
 * uniformly. Its field outside, at any time, is that of a sphere at rest.
 *
 * Two tides applied in either order read the bracket of the rates of change of two moments,
 *
 *     {dQ_h/dt, dQ_g/dt} = int J . [(grad grad h) grad g - (grad grad g) grad h] dV,
 *
 * with J the density of momentum. For the pair of profiles h + i g = (x + i y)^n / n, with w = x + i y, the bracket
 * of the flow J = rho omega(r) (-y, x, 0) is -2 (n - 1) int rho omega varpi^(2n - 2) dV, varpi the distance from the
 * axis: for n = 2 it is -2 L_z, and vanishes with the angular momentum; for n = 3 it is
 * (32/35)(1 - 2 x^7) M Omega R^4, 0.221 M Omega R^4 at x = 2^(-1/5).
 *
 * Units: M = R = Omega = 1; the bracket of degree n is in units of M Omega R^(2n - 2). `sense` is +1 when the inner
 * ball turns counter-clockwise seen from +z (the paper's sign), -1 the other way.
 */

/** The inner radius at which the angular momentum vanishes: 2^(-1/5) R = 0.8706 R. */
export const BALANCED = 2 ** (-1 / 5);

/** The rate of turning at the distance r from the centre, in units of Omega. */
export const rate = (r: number, inner: number, sense = 1) => (r < inner ? sense : -sense);

/**
 * int rho varpi^(2k) dV over a uniform ball of radius a, per unit of M a^(2k + 3) / R^3:
 * 3 / (2 (2k + 3)) times int_0^pi sin^(2k + 1) = 2 (2k)!! / (2k + 1)!!. 2/5 for k = 1, 8/35 for k = 2.
 */
export function ballMoment(k: number): number {
	let s = 2;
	for (let j = 1; j <= k; j++) s *= (2 * j) / (2 * j + 1);
	return (3 / (2 * (2 * k + 3))) * s;
}

/** The angular momentum L_z, in units of M Omega R^2: (2/5)(2 x^5 - 1), zero at x = 2^(-1/5). */
export function angularMomentum(inner: number, sense = 1): number {
	return sense * ballMoment(1) * (2 * inner ** 5 - 1);
}

/**
 * The bracket for the pair h + i g = (x + i y)^n / n, in units of M Omega R^(2n - 2):
 * 2 (n - 1) c (1 - 2 x^(2n + 1)), c = ballMoment(n - 1). n = 2: (4/5)(1 - 2x^5) = -2 L_z. n = 3: (32/35)(1 - 2x^7).
 */
export function bracket(n: number, inner: number, sense = 1): number {
	return sense * 2 * (n - 1) * ballMoment(n - 1) * (1 - 2 * inner ** (2 * n + 1));
}

/**
 * The share of the radius r in that bracket, per unit of r: -2 (n - 1) omega(r) c (2n + 1) r^(2n). The inner ball
 * counts with one sign and the rest with the other, in proportion to r^(2n); its integral from 0 to 1 is the bracket.
 */
export function share(n: number, r: number, inner: number, sense = 1): number {
	return -2 * (n - 1) * rate(r, inner, sense) * ballMoment(n - 1) * (2 * n + 1) * r ** (2 * n);
}

/** The shares of n = 2 and of n = 3, each over its own greatest size, as the paper's figure draws them: at r = 1. */
export const greatestShare = (n: number) => 2 * (n - 1) * ballMoment(n - 1) * (2 * n + 1);
