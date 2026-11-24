/**
 * Chapter 6.3's moving sky. A camera moves with cβ through the frame of the sources, and a source that lies at the
 * angle α from the direction of motion in that frame is seen at α′, by the chapter's eq:source-angle,
 *
 *   cos α′ = (cos α + β)/(1 + β cos α),   or, in half angles,   tan(α′/2) = e^{−η} tan(α/2),
 *
 * with the rapidity η = artanh β; the half-angle form is the one computed, since it keeps its digits near 0 and 180°.
 * Its light is shifted by the Doppler factor of eq:doppler-seen,
 *
 *   ω′/ω = 1/[γ(1 − β cos α′)] = γ(1 + β cos α),
 *
 * which is e^{η} straight ahead and e^{−η} straight behind; a black body's temperature is multiplied by the same
 * factor in each direction (eq:moving-temperature). The whole sky is drawn on a disc in Lambert's equal-area
 * projection centred on the direction of motion: the radius of a direction is sin(α/2) of the disc's, so that the
 * fraction (1 − cos α)/2 of the sky within α of straight ahead covers the same fraction of the disc.
 *
 * The speed is kept as a whole number of hundredths of c, so that the readings the predictions wait for are decided
 * without rounding.
 */

export const DEG = Math.PI / 180;
/** Seconds of arc in a radian. */
export const ARCSEC = (180 * 3600) / Math.PI;

/** The speed slider, in hundredths of c: its range, and the steps of the arrow keys and of Page Up and Page Down. */
export const SPEED = { min: 0, max: 99, key: 1, page: 10 };

export type Sky = 'stars' | 'glow' | 'sun';

export const OPENING: { sky: Sky; hundredths: number } = { sky: 'stars', hundredths: 90 };

/** The Earth's speed on its orbit and the speed of light, km/s, and how many times the Sun's shift is drawn larger. */
export const EARTH = { v: 29.78, c: 299_792.458 };
export const MAGNIFY = 1000;
/** The Sun's angular radius, degrees: its 32′ across. */
export const SUN_RADIUS = 0.2666;
/** The round window of the Sun's sky: the sky within this many degrees of its centre. */
export const WINDOW = 6;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The speed of a whole number of hundredths of c. */
export const betaOf = (hundredths: number) => hundredths / 100;

/** The Earth's β = v/c. */
export const earthBeta = () => EARTH.v / EARTH.c;

/** A camera at the speed βc: γ, η, the cone of the forward half, and the Doppler factors ahead and behind. */
export function motion(beta: number) {
	const gamma = 1 / Math.sqrt(1 - beta * beta);
	const eta = Math.atanh(beta);
	return {
		beta,
		gamma,
		eta,
		/** The half-angle of the cone that holds the forward half of the sky, eq:cone: arccos β, radians. */
		cone: Math.acos(beta),
		/** The fraction of the sky inside that cone, (1 − β)/2. */
		forward: skyFraction(Math.acos(beta)),
		/** The Doppler factors straight ahead and straight behind, e^{±η}, and their ratio e^{2η}. */
		ahead: Math.exp(eta),
		behind: Math.exp(-eta),
		ratio: Math.exp(2 * eta)
	};
}

// --- the aberration -------------------------------------------------------------------------------------------------

/** The chapter's eq:source-angle as written: cos α′ from cos α. */
export const cosSeen = (cosAlpha: number, beta: number) =>
	(cosAlpha + beta) / (1 + beta * cosAlpha);

/** The angle α′ at which a camera moving at βc sees a source that lies at α in the sources' frame, radians. */
export function aberrate(alpha: number, beta: number): number {
	if (alpha <= 0) return 0;
	if (alpha >= Math.PI) return Math.PI;
	return 2 * Math.atan(Math.sqrt((1 - beta) / (1 + beta)) * Math.tan(alpha / 2));
}

/** The inverse: the angle α in the sources' frame of a source seen at α′, the same map with β reversed. */
export const unaberrate = (alphaSeen: number, beta: number) => aberrate(alphaSeen, -beta);

/** The Doppler factor ω′/ω of light seen at α′, eq:doppler-seen: 1/[γ(1 − β cos α′)]. */
export function doppler(alphaSeen: number, beta: number): number {
	const gamma = 1 / Math.sqrt(1 - beta * beta);
	return 1 / (gamma * (1 - beta * Math.cos(alphaSeen)));
}

/** The same factor from the angle α in the sources' frame, eq:ray-boost with β·k̂ = −β cos α: γ(1 + β cos α). */
export function dopplerAtRest(alpha: number, beta: number): number {
	const gamma = 1 / Math.sqrt(1 - beta * beta);
	return gamma * (1 + beta * Math.cos(alpha));
}

/** A black body's T(α′)/T, eq:moving-temperature: the Doppler factor of its direction. */
export const temperature = doppler;

/** The first-order dipole, T(α′)/T ≈ 1 + β cos α′. */
export const dipole = (alphaSeen: number, beta: number) => 1 + beta * Math.cos(alphaSeen);

/** The angle α′ at which a moving camera finds the glow at its own temperature, where γ(1 − β cos α′) = 1. */
export function unchanged(beta: number): number | undefined {
	if (beta <= 0) return undefined;
	const gamma = 1 / Math.sqrt(1 - beta * beta);
	return Math.acos((gamma - 1) / (gamma * beta));
}

/** The shift α − α′ toward the direction of motion of a source at α, radians. */
export const shift = (alpha: number, beta: number) => alpha - aberrate(alpha, beta);

/** The first-order shift of eq:small-aberration, v⊥/c = β sin α, radians. */
export const smallShift = (alpha: number, beta: number) => beta * Math.sin(alpha);

// --- the projection -------------------------------------------------------------------------------------------------

/** The fraction (1 − cos α)/2 of the sky within α of a direction. */
export const skyFraction = (alpha: number) => (1 - Math.cos(alpha)) / 2;

/** The radius on the disc, in disc radii, of a direction at α from its centre: sin(α/2). */
export const radiusOf = (alpha: number) => Math.sin(alpha / 2);

/** The angle α of a radius on the disc: 2 arcsin r. */
export const angleOf = (r: number) => 2 * Math.asin(clamp(r, 0, 1));

/** The fraction of the disc's area within the radius of α: sin²(α/2). */
export const discFraction = (alpha: number) => radiusOf(alpha) ** 2;

/** A direction (α from the centre, φ round it) on the unit disc; y is up. */
export function project(alpha: number, phi: number): { x: number; y: number } {
	const r = radiusOf(alpha);
	return { x: r * Math.cos(phi), y: r * Math.sin(phi) };
}

/** The direction of a point of the unit disc. */
export function unproject(x: number, y: number): { alpha: number; phi: number } {
	return { alpha: angleOf(Math.hypot(x, y)), phi: Math.atan2(y, x) };
}

// --- the skies ------------------------------------------------------------------------------------------------------

export const STAR_COUNT = 400;

export type Star = { alpha: number; phi: number; size: 0 | 1 | 2 };

/**
 * A field of stars equally spaced in area: the sunflower lattice, cos α = 1 − (2i + 1)/n and φ = i times the golden
 * angle, so that each star stands for 4π/n of the sky. Their sizes are a fixed hash of their number, a third each.
 */
export function stars(n = STAR_COUNT): Star[] {
	const golden = Math.PI * (3 - Math.sqrt(5));
	const out: Star[] = [];
	for (let i = 0; i < n; i++) {
		const cosAlpha = 1 - (2 * i + 1) / n;
		const phi = (i * golden) % (2 * Math.PI);
		const hash = Math.imul(i + 1, 2654435761) >>> 0;
		out.push({ alpha: Math.acos(cosAlpha), phi, size: (hash % 3) as 0 | 1 | 2 });
	}
	return out;
}

/** The star as the camera sees it: its α′, and its Doppler factor. */
export function seenStar(star: Star, beta: number) {
	const alpha = aberrate(star.alpha, beta);
	return { alpha, phi: star.phi, factor: doppler(alpha, beta) };
}

// --- the colours ------------------------------------------------------------------------------------------------------

/**
 * The colour scale's end, in rapidity: the scale runs from e^{−end} to e^{end}, the factors behind and ahead, but never
 * nearer 1 than e^{∓0.1}, so that the sky of a slow camera is nearly uniform rather than painted at full strength.
 */
export const END_FLOOR = 0.1;
export const scaleEnd = (eta: number) => Math.max(eta, END_FLOOR);

/** Where a factor falls on the diverging scale, −1 (red) to 1 (blue): its logarithm over the end. */
export const tone = (factor: number, end: number) => clamp(Math.log(factor) / end, -1, 1);

/**
 * The colour of a tone, as CSS, in the paper's diverging scale: the pale middle mixed toward the blue above 1 and the
 * red below, in the screen's own colours as the paper's map is. The three colours are the stylesheet's, per theme.
 */
export function colour(t: number): string {
	const p = Math.round(Math.abs(t) * 1000) / 10;
	if (p === 0) return 'var(--sky-mid)';
	return `color-mix(in srgb, var(${t > 0 ? '--sky-blue' : '--sky-red'}) ${p}%, var(--sky-mid))`;
}

// --- the Sun at the Earth's speed ----------------------------------------------------------------------------------

/** The Sun seen across the Earth's motion: its shift, radians and seconds of arc, and as drawn, degrees. */
export function sun(beta = earthBeta()) {
	const delta = shift(90 * DEG, beta);
	return {
		beta,
		delta,
		arcsec: delta * ARCSEC,
		first: smallShift(90 * DEG, beta),
		shown: (MAGNIFY * delta) / DEG
	};
}

// --- the predictions ----------------------------------------------------------------------------------------------

/**
 * The first is answered once the reader, on the Stars sky, has slid the speed to 0, where the stars beside the camera
 * are on the dashed circle at 90°, and then back to 0.9c. It keeps whether the speed has been 0.
 */
export type FirstSeen = { rest: boolean; done: boolean };
export const FIRST_START: FirstSeen = { rest: false, done: false };

export function noteFirst(seen: FirstSeen, sky: Sky, hundredths: number): FirstSeen {
	if (seen.done || sky !== 'stars') return seen;
	if (hundredths === 0) return { rest: true, done: false };
	if (seen.rest && hundredths === 90) return { rest: true, done: true };
	return seen;
}

/**
 * The second is answered once the reader, with the second question open, has moved the slider to 0.6c, where the
 * factor ahead, e^η = 2, is four times the factor behind. A speed it was already at when the question opened does not
 * count: only a move to it.
 */
export function noteSecond(
	done: boolean,
	step: 1 | 2,
	sky: Sky,
	hundredths: number,
	changed: boolean
): boolean {
	if (done) return true;
	return step === 2 && changed && sky !== 'sun' && hundredths === 60;
}

// --- the drawing ------------------------------------------------------------------------------------------------------

/**
 * Places for labels beside rings of the disc, each kept off the dots and off the labels placed before it. A label is
 * a box w × h just outside its ring (radius r about the centre c), or just inside it where it fits, at one of the
 * candidate angles, so that it never sits on the ring's line; each box costs the dots within `margin` of it, a great
 * deal more for overlapping a box placed earlier or for crossing the disc's rim (radius `rim`), and a little for
 * straying from the first candidate or for standing inside. Angles are on the screen, y down.
 */
export function placeLabels(
	dots: { x: number; y: number }[],
	labels: { r: number; w: number; h: number }[],
	c: { x: number; y: number },
	rim: number,
	angles: number[],
	margin = 2
): { x: number; y: number }[] {
	const placed: { x: number; y: number; w: number; h: number }[] = [];
	const out: { x: number; y: number }[] = [];
	for (const label of labels) {
		let best: { x: number; y: number; cost: number } | undefined;
		for (const side of [1, -1])
			angles.forEach((theta, k) => {
				const ux = Math.cos(theta);
				const uy = Math.sin(theta);
				const extent = Math.abs(ux) * (label.w / 2) + Math.abs(uy) * (label.h / 2) + 3;
				const reach = label.r + side * extent;
				const x = c.x + ux * reach;
				const y = c.y + uy * reach;
				const box = {
					x0: x - label.w / 2,
					x1: x + label.w / 2,
					y0: y - label.h / 2,
					y1: y + label.h / 2
				};
				const corners = [
					[box.x0, box.y0],
					[box.x1, box.y0],
					[box.x0, box.y1],
					[box.x1, box.y1]
				].map(([px, py]) => Math.hypot(px - c.x, py - c.y));
				// inside the ring, the box must clear the ring at every corner, and stays off the centre
				if (side < 0 && (Math.max(...corners) > label.r - 2 || reach < extent)) return;
				let cost = 0.01 * k + (side < 0 ? 0.5 : 0);
				for (const d of dots) {
					if (
						d.x >= box.x0 - margin &&
						d.x <= box.x1 + margin &&
						d.y >= box.y0 - margin &&
						d.y <= box.y1 + margin
					)
						cost += 1;
				}
				for (const p of placed) {
					if (
						Math.abs(p.x - x) < (p.w + label.w) / 2 + 2 &&
						Math.abs(p.y - y) < (p.h + label.h) / 2 + 2
					)
						cost += 1000;
				}
				if (Math.max(...corners) > rim - 2) cost += 500;
				if (!best || cost < best.cost) best = { x, y, cost };
			});
		const at = best ?? { x: c.x, y: c.y - label.r };
		placed.push({ x: at.x, y: at.y, w: label.w, h: label.h });
		out.push({ x: at.x, y: at.y });
	}
	return out;
}

// --- the words ------------------------------------------------------------------------------------------------------

const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const raised = (n: number) =>
	String(n)
		.replace('-', '⁻')
		.replace(/[0-9]/g, (d) => SUPER[Number(d)]);

/** A number to three figures, with a true minus sign; below a thousandth as "9.93 × 10⁻⁵"; zero as 0. */
export function three(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	if (Math.abs(v) < 1e-3) {
		const [m, e] = v.toExponential(2).split('e');
		return `${m.replace('-', '−')} × 10${raised(Number(e))}`;
	}
	return v.toPrecision(3).replace('-', '−');
}

/** The same for LaTeX: "9.93\times10^{-5}". */
export function threeTex(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	if (Math.abs(v) < 1e-3) {
		const [m, e] = v.toExponential(2).split('e');
		return `${m}\\times10^{${Number(e)}}`;
	}
	return v.toPrecision(3);
}

/** An angle in radians as degrees to three figures: "25.8", "8.10", "90.0". */
export const degrees = (rad: number) => three(rad / DEG);
