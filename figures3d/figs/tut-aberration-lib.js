// Shared numbers and colours for the four diagrams of the tutorial's chapter 6.3 (tutorial/relativity/aberration.md):
// tut-aberration-ray, tut-aberration-retarded, tut-aberration-sky and tut-aberration-frames. Not a figure itself. The
// colours, the speed 0.6c and its gamma are chapter 6.1's (figs/tut-lorentz-lib.js: the observer's colour, the light
// role's and matter's, read from app.css), and the sheet, strokes, labels and cropping those of 6.1's and 6.2's
// diagrams, all imported, not copied.
//
// The diverging scale of the Doppler factor is the paper's (app/src/lib/vistas/sky.wgsl, `diverging`; in the
// tutorial's figures figs/tut-noise-lib.js): its two ends are the paper's accents, the blue ACCENT2 and the orange
// ACCENT (drawing.ts maps them to each theme's --accent-2 and --accent), in proportion to the logarithm of the factor,
// full at the factors e^{+-eta} straight ahead and straight behind. Its middle, a factor of one, is the neutral FAINT
// ink instead of the page, so that a star there is still seen (on the page's own colour it would vanish).
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints:
//  - the ray (eq:ray-boost) at 0.6c: k = (0, -1) from a source at alpha = 90 degrees goes to (omega'/omega) k' =
//    (-0.75, -1), of length 1.25 = gamma, k' = (-0.6, -0.8) a unit vector, seen along (0.6, 0.8), at alpha' = 53.1
//    degrees (cos alpha' = 0.6, eq:source-angle), 36.9 degrees further forward;
//  - the retarded position at 0.6c: Delta t = gamma b/c = 1.25 b/c, gamma beta b = 0.75 b behind, tan delta = 0.75,
//    delta = 36.9 degrees, sin delta = 0.6, and Pythagoras c^2 Delta t^2 = b^2 + v^2 Delta t^2;
//  - the sky at 0.9c: the cone arccos 0.9 = 25.8 degrees (and 53.1 at 0.6c, 8.1 at 0.99c), sin = 1/gamma, the
//    fraction 0.05 of the sky, the factors e^{-eta} = 0.23 behind and e^{eta} = 4.36 ahead, each 1/[gamma(1 -+ beta)],
//    the factor gamma on the cone, and the circle of a factor of one at alpha' = 51.2 degrees (alpha = 128.8);
//  - the frames at 0.6c, n0 at 60 degrees from beta: a = 0.3, p+ and p- from eq:ray-boost and from the paper's
//    eq:proof-stars, both unit vectors leaning toward -beta, the present position r = R*(a/(gamma beta) beta^ +
//    n_perp), the half sum v_perp/c and the half difference along r of length (1 - v_perp^2/c^2)^{1/2}; and the
//    problem at 0.9c, a = 0: the half sum -beta, of length 0.9, the half difference n0/gamma, of length 0.436.
import { OBS, LIGHT, MATTER, palette, BETA, GAMMA } from './tut-lorentz-lib.js';
import { ACCENT, ACCENT2, FAINT } from '../lib.js';

export { OBS, LIGHT, MATTER, palette, BETA, GAMMA };

const DEG = Math.PI / 180;
export const deg = (r) => r / DEG;
export const rad = (d) => d * DEG;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);

/** eq:ray-boost in the plane: the light's direction of travel k (a unit vector) in the frame through which the
 * observer moves with velocity c b (a vector); returns the Doppler factor D = omega'/omega and the new direction k'. */
export function rayBoost(k, b) {
	const B = len(b), g = 1 / Math.sqrt(1 - B * B), h = [b[0] / B, b[1] / B];
	const par = dot(h, k), kPar = [par * h[0], par * h[1]], kPerp = [k[0] - kPar[0], k[1] - kPar[1]];
	const D = g * (1 - dot(b, k));
	const num = [kPerp[0] + g * (kPar[0] - b[0]), kPerp[1] + g * (kPar[1] - b[1])];
	return { D, k: [num[0] / D, num[1] / D], num };
}

/** eq:source-angle: the angle alpha' (radians) at which an observer moving at beta c sees a source at alpha. */
export const seen = (alpha, b) => Math.acos((Math.cos(alpha) + b) / (1 + b * Math.cos(alpha)));
/** eq:doppler-seen: the Doppler factor of a source seen at alpha'. */
export const doppler = (alphaSeen, b) => 1 / ((1 / Math.sqrt(1 - b * b)) * (1 - b * Math.cos(alphaSeen)));

// ---- the ray -------------------------------------------------------------------------------------------------------
export const RAY = { k: [0, -1], beta: [BETA, 0] };

// ---- the retarded position, units of b ---------------------------------------------------------------------------------
export const DELAY = GAMMA;                  // Delta t, units of b/c
export const BEHIND = GAMMA * BETA;          // the retarded position behind the present one, units of b

// ---- the sky --------------------------------------------------------------------------------------------------------
export const BETA_SKY = 0.9;
export const GAMMA_SKY = 1 / Math.sqrt(1 - BETA_SKY ** 2);
export const ETA_SKY = Math.atanh(BETA_SKY);
export const N_STARS = 400;
/** The stars, equally spaced in area on the sky (a Fibonacci lattice: cos alpha uniform, the golden angle in azimuth). */
export const STARS = Array.from({ length: N_STARS }, (_, i) => ({ alpha: Math.acos(1 - (2 * i + 1) / N_STARS), phi: i * Math.PI * (3 - Math.sqrt(5)) }));
/** The equal-area projection centred straight ahead: the radius, a fraction of the rim's, of a point at alpha. */
export const disc = (alpha) => Math.sin(alpha / 2);

/** The paper's diverging scale for a Doppler factor D: a CSS colour, blue above one, orange below, neutral at one. */
export function shift(D) {
	const v = Math.max(-1, Math.min(1, Math.log(D) / ETA_SKY));
	const end = v >= 0 ? ACCENT2 : ACCENT, p = Math.round(Math.abs(v) * 100);
	return p === 0 ? FAINT : p === 100 ? end : `color-mix(in srgb, ${end} ${p}%, ${FAINT})`;
}

// ---- the frames: the pixel moves at 0.6c through the body's frame, n0 at 60 degrees ---------------------------------
export const N0_ANGLE = 60;
export function frames(b = BETA, angle = N0_ANGLE) {
	const g = 1 / Math.sqrt(1 - b * b), bv = [b, 0];
	const n0 = [Math.cos(rad(angle)), Math.sin(rad(angle))];
	const a = dot(bv, n0), nPerp = [0, n0[1]];
	const plus = rayBoost(n0, bv).k, minus = rayBoost([-n0[0], -n0[1]], bv).k;
	// the paper's eq:proof-stars, upper and lower signs
	const paper = (s) => [(g * (s * a / b - b)) / (g * (1 - s * a)), (s * nPerp[1]) / (g * (1 - s * a))];
	const r = [a / (g * b), nPerp[1]];            // the present position, units of R*
	const v = [-b, 0];                            // the body's velocity over c, in the pixel's frame
	const rh = [r[0] / len(r), r[1] / len(r)];
	const vPerp = [v[0] - dot(v, rh) * rh[0], v[1] - dot(v, rh) * rh[1]];
	const half = [(plus[0] + minus[0]) / 2, (plus[1] + minus[1]) / 2], diff = [(plus[0] - minus[0]) / 2, (plus[1] - minus[1]) / 2];
	return { g, n0, a, plus, minus, paper, r, v, rh, vPerp, half, diff };
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (x, y, tol) => Math.abs(x - y) <= tol;
	const f1 = (x) => x.toFixed(1), f2 = (x) => x.toFixed(2);
	// ---- the ray at 0.6c
	const ray = rayBoost(RAY.k, RAY.beta);
	check(near(ray.D, 1.25, 1e-15) && f2(ray.D) === '1.25' && near(ray.D, GAMMA, 1e-15), `the Doppler factor ${ray.D}`);
	check(near(ray.num[0], -0.75, 1e-15) && near(ray.num[1], -1, 1e-15), `(omega'/omega) k' is ${ray.num}`);
	check(near(len(ray.num), 1.25, 1e-15), 'the observer\'s arrow is not 1.25 long');
	check(near(ray.k[0], -0.6, 1e-15) && near(ray.k[1], -0.8, 1e-15) && near(len(ray.k), 1, 1e-15), `k' is ${ray.k}`);
	const a90 = rad(90), a53 = seen(a90, BETA);
	check(near(Math.cos(a53), 0.6, 1e-15) && f1(deg(a53)) === '53.1' && f1(90 - deg(a53)) === '36.9', `alpha' ${deg(a53)}`);
	check(near(Math.acos(-ray.k[0]), a53, 1e-15), 'the direction of view is not at alpha\'');
	// the check of the first section: k' has length one for every direction
	for (const t of [0, 0.4, 1.3, 2.2, 3.1]) check(near(len(rayBoost([Math.cos(t), Math.sin(t)], RAY.beta).k), 1, 1e-14), `|k'| at ${t}`);
	// cos alpha' - cos alpha = beta sin^2 alpha / (1 + beta cos alpha) >= 0
	for (const t of [0.2, 1, 2, 3]) check(near(Math.cos(seen(t, BETA)) - Math.cos(t), (BETA * Math.sin(t) ** 2) / (1 + BETA * Math.cos(t)), 1e-14) && seen(t, BETA) <= t, `forward at ${t}`);
	// ---- the retarded position at 0.6c
	check(near(DELAY, 1.25, 1e-15) && near(BEHIND, 0.75, 1e-15) && near(DELAY ** 2, 1 + BEHIND ** 2, 1e-14), 'Pythagoras of the retarded position');
	check(near(BETA * DELAY, BEHIND, 1e-15), 'v Delta t is not gamma beta b');
	const delta = Math.atan(BEHIND);
	check(f1(deg(delta)) === '36.9' && near(Math.sin(delta), BETA, 1e-15) && near(Math.sinh(Math.atanh(BETA)), BEHIND, 1e-15), `delta ${deg(delta)}`);
	// the two frames agree: delta is the angle of eq:source-angle at alpha = 90 degrees, 90 - alpha'
	check(near(delta, a90 - a53, 1e-15), 'the retarded angle is not the aberration of the same ray');
	// ---- the sky at 0.9c
	const cone = (b) => deg(Math.acos(b));
	check(f1(cone(BETA_SKY)) === '25.8' && f1(cone(BETA)) === '53.1' && f1(cone(0.99)) === '8.1', 'the cones');
	check(near(Math.sin(Math.acos(BETA_SKY)), 1 / GAMMA_SKY, 1e-15), 'sin of the cone is not 1/gamma');
	check(near(deg(seen(a90, BETA_SKY)), cone(BETA_SKY), 1e-12), 'the 90 degree circle does not go to the cone');
	check(f2((1 - BETA_SKY) / 2) === '0.05' && f1((1 - BETA) / 2) === '0.2', 'the forward half\'s share of the sky');
	const ahead = doppler(0, BETA_SKY), behind = doppler(Math.PI, BETA_SKY);
	check(near(ahead, Math.exp(ETA_SKY), 1e-14) && near(behind, Math.exp(-ETA_SKY), 1e-14), 'the factors are not e^{+-eta}');
	check(f2(ahead) === '4.36' && f2(behind) === '0.23', `the factors ${ahead} and ${behind}`);
	check(near(ahead, 1 / (GAMMA_SKY * (1 - BETA_SKY)), 1e-14) && near(behind, 1 / (GAMMA_SKY * (1 + BETA_SKY)), 1e-14), 'the factors are not 1/[gamma(1 -+ beta)]');
	check(near(doppler(Math.acos(BETA_SKY), BETA_SKY), GAMMA_SKY, 1e-13), 'the factor on the cone is not gamma');
	// at 0.6c the factors are 2 and 1/2 (the try's second question), their ratio e^{2 eta} = 4
	check(near(doppler(0, BETA), 2, 1e-14) && near(doppler(Math.PI, BETA), 0.5, 1e-14), 'the factors at 0.6c');
	// the circle of a factor of one: alpha' = 51.2 degrees, from alpha = 128.8 at rest
	const one = Math.acos((1 - 1 / GAMMA_SKY) / BETA_SKY), oneRest = Math.acos((1 / GAMMA_SKY - 1) / BETA_SKY);
	check(near(doppler(one, BETA_SKY), 1, 1e-14) && near(seen(oneRest, BETA_SKY), one, 1e-13), 'the circle of a factor of one');
	check(f1(deg(one)) === '51.2' && f1(deg(oneRest)) === '128.8', `the factor of one at ${deg(one)}, from ${deg(oneRest)}`);
	// the factor also from the rest angle, gamma (1 + beta cos alpha): every star of the forward half is blueshifted
	for (const s of STARS) check(near(doppler(seen(s.alpha, BETA_SKY), BETA_SKY), GAMMA_SKY * (1 + BETA_SKY * Math.cos(s.alpha)), 1e-12), 'the factor of a star');
	check(STARS.filter((s) => s.alpha <= a90).every((s) => doppler(seen(s.alpha, BETA_SKY), BETA_SKY) >= GAMMA_SKY - 1e-12), 'a forward star that is not blueshifted');
	check(STARS.filter((s) => s.alpha <= a90).length === N_STARS / 2, 'the forward half does not hold half the stars');
	// ---- the frames at 0.6c
	const F = frames();
	check(near(F.a, 0.3, 1e-15), `a = ${F.a}`);
	for (const [p, s] of [[F.plus, 1], [F.minus, -1]]) {
		const q = F.paper(s);
		check(near(p[0], q[0], 1e-15) && near(p[1], q[1], 1e-15), `eq:proof-stars, sign ${s}`);
		check(near(len(p), 1, 1e-15), `p ${s} is not a unit vector`);
	}
	// both lean toward -beta from +-n0: their x parts are less than those of +-n0
	check(F.plus[0] < F.n0[0] && F.minus[0] < -F.n0[0], 'the directions do not lean toward -beta');
	check(near(F.plus[0], -1 / 7, 1e-15) && near(F.minus[0], -11 / 13, 1e-15), `p+ ${F.plus}, p- ${F.minus}`);
	check(near(F.r[0], 0.4, 1e-15) && near(F.r[1], Math.sqrt(3) / 2, 1e-15) && near(F.r[0] * GAMMA, F.n0[0], 1e-15), 'the present position is not gamma closer along beta');
	check(near(F.half[0], F.vPerp[0], 1e-15) && near(F.half[1], F.vPerp[1], 1e-15), `the half sum ${F.half} is not v_perp/c ${F.vPerp}`);
	check(near(F.diff[0] * F.rh[1] - F.diff[1] * F.rh[0], 0, 1e-15) && dot(F.diff, F.rh) > 0, 'the half difference is not along r');
	check(near(len(F.diff), Math.sqrt(1 - dot(F.vPerp, F.vPerp)), 1e-15), 'the half difference is not (1 - v_perp^2/c^2)^{1/2} long');
	// the problem at 0.9c, a body at right angles
	{
		const P = frames(0.9, 90);
		check(near(P.a, 0, 1e-15) && near(P.half[0], -0.9, 1e-15) && near(P.half[1], 0, 1e-15) && near(len(P.half), 0.9, 1e-15), 'the problem\'s half sum');
		check(near(P.diff[0], 0, 1e-15) && len(P.diff).toFixed(3) === '0.436' && near(len(P.diff), Math.sqrt(1 - 0.81), 1e-15), 'the problem\'s half difference');
	}
	return { D: ray.D, alphaSeen: deg(a53), delta: deg(delta), cone: cone(BETA_SKY), ahead, behind, one: deg(one) };
}
