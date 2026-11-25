/**
 * A black hole's response (paper, Section XIV, "The weight of a black hole's response", Eq. hole-sum-rule and
 * Fig. hole-response; reference/gravcam/holeresponse.py). For a round body the sum over frequency of the response to
 * a tide of degree l, (2/pi) int omega Im chi_l d omega, is [l (2l + 1) / 4 pi] int rho r^(2l - 2) dV: one radial
 * moment of the mass for each degree. A hole's sums, found from the fraction of each wave it absorbs, are written as
 * the radius R_l of the thin shell of the hole's mass that has the same sum:
 *
 *     int rho r^(2l - 2) dV = M R_l^(2l - 2).
 *
 * They are 1.02, 1.46, 1.61, 1.69 and 1.73 r_s for l = 2 to 6, and tend to (3 sqrt 3 / e) r_s = 1.91 r_s. For any
 * distribution of positive mass, int rho r^2 (r^2 - a)^2 dV >= 0 for every a; with the hole's sums for l = 2, 3 and 4
 * it is M (R_4^6 - 2 a R_3^4 + a^2 R_2^2), which falls to -2.04 M r_s^6 at a = 4.34 r_s^2. So no body has them.
 *
 * Units: r_s for lengths, M for masses.
 */

/**
 * R_l / r_s for l = 2 to 8, from the reference implementation (holeresponse.degree_shell_radius, the sums of
 * Gamma_l / x^(2l) found from the Regge-Wheeler equation). Four places are needed for the test below: its minimum is
 * M (R_4^6 - R_3^8 / R_2^2), and the paper's two places move R_3^8 by two and a half per cent, which takes the minimum
 * from -2.04 to -2.43 M r_s^6.
 */
export const HOLE_RADII: Record<number, number> = {
	2: 1.0174643409453468,
	3: 1.4555090113354818,
	4: 1.6100253369693853,
	5: 1.6867888617185482,
	6: 1.7324117426592052,
	7: 1.7626025918635315,
	8: 1.784053180213854
};

/** The same, as the paper prints them, for l = 2 to 6. */
export const PAPER_RADII: Record<number, number> = { 2: 1.02, 3: 1.46, 4: 1.61, 5: 1.69, 6: 1.73 };

/** The degrees the figure offers. */
export const DEGREES = [2, 3, 4, 5, 6, 7, 8] as const;

/** R_l / r_s as l grows without end, for the hole and for any absorber that takes every wave below a sharp edge. */
export const SHARP_LIMIT = (3 * Math.sqrt(3)) / Math.E;

/**
 * The moments a body would need, m_k = int rho r^(2k) dV / M = R_(k+1)^(2k), k = 0, 1, 2, ...; m_0 = 1, the mass,
 * which the tide of degree one reads.
 */
export function moments(radii: Record<number, number> = HOLE_RADII): number[] {
	const m = [1];
	for (let l = 2; radii[l] !== undefined; l++) m.push(radii[l] ** (2 * l - 2));
	return m;
}

/**
 * int rho r^(2k - 2) (r^2 - a)^2 dV / M = m_(k+1) - 2 a m_k + a^2 m_(k-1), never negative for positive mass. k = 2
 * uses the tides of degree 2, 3 and 4: int rho r^2 (r^2 - a)^2 dV.
 */
export function positivity(a: number, m: number[] = moments(), k = 2): number {
	return m[k + 1] - 2 * a * m[k] + a * a * m[k - 1];
}

/** Where that quadratic is least, and its value there: a = m_k / m_(k-1), m_(k+1) - m_k^2 / m_(k-1). */
export function least(m: number[] = moments(), k = 2): { a: number; value: number } {
	const a = m[k] / m[k - 1];
	return { a, value: m[k + 1] - (m[k] * m[k]) / m[k - 1] };
}

/** The moments m_k of a round body of thin shells (mass, radius), in units of its mass. */
export function bodyMoments(shells: { mass: number; radius: number }[], count = 4): number[] {
	const total = shells.reduce((s, shell) => s + shell.mass, 0);
	return Array.from(
		{ length: count },
		(_, k) => shells.reduce((s, shell) => s + shell.mass * shell.radius ** (2 * k), 0) / total
	);
}
