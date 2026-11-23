// Shared tools for the four diagrams of the tutorial's chapter 2.5 (tutorial/outside/null-space.md): tut-null-hero,
// tut-null-split, tut-null-flush and tut-null-moments. Not a figure itself. The mathematics of the chapter, each
// function checked against the chapter's printed numbers by the figures that use it, and the stone bodies drawn as
// chapter 2.4's figs/tut-grn-kelvin.js draws them: the sawn face of the steel ball (sprites/hair/ball-face.png),
// shaded in matter's colour (its light one, fixed on the stone), the nugget lit in matter's two colours, the skin a
// band shaded in steps that double.
import { sprite } from '../lib.js';
import { MARGIN, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { n2 } from './tut-pot-lib.js';

export { STONE_INK };

// ---- the mathematics --------------------------------------------------------------------------------------------
export const G = 6.674e-11;
export const R_BALL = 0.1;                // m
export const RHO0 = 7850;                 // kg m^-3, steel
export const MASS = (4 / 3) * Math.PI * R_BALL ** 3 * RHO0;

/** The three steel balls of the chapter's first section, as densities in units of rho0 at u = r / R. */
export const BALLS = [
	{ key: 'plus', rho: (u) => (5 / 3) * u * u },            // rho0 + delta rho
	{ key: 'uniform', rho: () => 1 },                          // rho0
	{ key: 'minus', rho: (u) => 2 - (5 / 3) * u * u }        // rho0 - delta rho
];

/** The integral of f(u) over 0 < u < 1 by Simpson's rule on n (even) intervals. */
export function simpson(f, n = 2000) {
	let s = f(0) + f(1);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(i / n);
	return s / (3 * n);
}

/** The mass of a ball of the density rho(u) (units of rho0), kg. */
export const massOf = (rho) => 4 * Math.PI * R_BALL ** 3 * RHO0 * simpson((u) => rho(u) * u * u);
/** Its moment of inertia about an axis through its centre, (2/3) int rho r^2 dV, kg m^2. */
export const inertiaOf = (rho) => (2 / 3) * 4 * Math.PI * R_BALL ** 5 * RHO0 * simpson((u) => rho(u) * u ** 4);
/** Its pull at the distance r >= R from its centre, m s^-2. */
export const pullOf = (rho, r) => (G * massOf(rho)) / r ** 2;

/** The flush of a nugget at s (units of R), at the point r (units of R) at the angle with cosine mu from the nugget's
 * direction, in units of m / 4 pi R^3: the chapter's closed form. */
export function flush(s, r, mu) {
	const t = s * r;
	return (3 - 10 * t * t + 8 * t ** 3 * mu - t ** 4) / (1 - 2 * t * mu + t * t) ** 2.5;
}
/** The same from the chapter's series, sum (2l + 1)(2l + 3) t^l P_l(mu), to `terms` terms. */
export function flushSeries(s, r, mu, terms = 400) {
	const t = s * r;
	let p0 = 1, p1 = mu, sum = 3 + 15 * t * mu;
	for (let l = 2; l < terms; l++) {
		const p2 = ((2 * l - 1) * mu * p1 - (l - 1) * p0) / l;
		sum += (2 * l + 1) * (2 * l + 3) * t ** l * p2;
		p0 = p1; p1 = p2;
	}
	return sum;
}
/** The skin of a nugget at s (units of R), at the angle g from the pole over it, in units of m / 4 pi R^2. */
export const skin = (s, g) => (1 - s * s) / (1 + s * s - 2 * s * Math.cos(g)) ** 1.5;
/** The angle from the pole at which that skin has the density `level`. */
export function skinAngle(s, level) {
	const d = ((1 - s * s) / level) ** (1 / 3);
	return Math.acos(Math.min(1, Math.max(-1, (1 + s * s - d * d) / (2 * s))));
}

// ---- the stone bodies -------------------------------------------------------------------------------------------
export const SHADE = '#533f03';           // matter's colour (app.css, --q-matter), its light one: fixed on the stone
export const GOLD_LIGHT = '#f1dc86';      // matter's dark-theme colour: the nugget's highlight
export const MATTER = 'light-dark(#533f03, #f1dc86)';   // matter's colour of each theme, for marks off the stone
export const RIM = 0.35;                  // a body's edge (figs/hair.js, figs/tut-grn-kelvin.js)
export const DEEPEST = 0.77;              // the darkest shade, as chapter 2.4's skin (0.12 + 0.13 k, k = 5)

/** The sawn face of the steel ball, once, for every body of a figure. */
export const ballFace = () => sprite('/figures3d/sprites/hair/ball-face.png');

/** The sawn face of the sprite `face`, once in a figure, its exact circle of radius r centred on (0, 0): `id` names it
 * for `stone`, which shows it wherever a body needs it, so that the picture is embedded once. */
export function stoneDefs(id, face, r) {
	const half = r * (face.w / (face.w - 2 * MARGIN));
	return `<defs><image id="${id}" class="art" href="${face.href}" x="${n2(-half)}" y="${n2(-half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none"/></defs>`;
}

/** The stone `ref` (from stoneDefs), its centre at (cx, cy), shown only inside the path `shape` (by default the
 * exact circle of radius r there; with `scale`, the picture grown or shrunk about its centre). */
export function stone(id, ref, cx, cy, r, shape = circlePath(cx, cy, r), scale = 1) {
	return `<clipPath id="${id}"><path clip-rule="evenodd" d="${shape}"/></clipPath>` +
		`<g clip-path="url(#${id})"><use href="#${ref}" transform="translate(${n2(cx)},${n2(cy)})${scale !== 1 ? ` scale(${scale})` : ''}"/></g>`;
}

/** A body's edge, in the stone's ink. */
export const rim = (cx, cy, r, width = RIM) => `<path d="${circlePath(cx, cy, r)}" fill="none" stroke="${STONE_INK}" stroke-width="${width}"/>`;

/** A radial veil of SHADE over the disc at (cx, cy) radius r, whose opacity at u = (distance / r) is alpha(u):
 * a radial gradient with `n` stops, so that a quadratic profile is followed to a part in n^2. */
export function radialVeil(id, cx, cy, r, alpha, n = 64) {
	const stops = Array.from({ length: n + 1 }, (_, k) => `<stop offset="${(k / n).toFixed(4)}" stop-color="${SHADE}" stop-opacity="${alpha(k / n).toFixed(4)}"/>`);
	return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}">${stops.join('')}</radialGradient>` +
		`<path d="${circlePath(cx, cy, r)}" fill="url(#${id})"/>`;
}

/** The nugget: a lit ball of matter's two colours (figs/tut-grn-kelvin.js), at (cx, cy), radius r. */
export function nugget(id, cx, cy, r) {
	const key = [-0.55, 0.72, 0.62], kl = Math.hypot(...key), hl = [key[0] / kl, key[1] / kl, key[2] / kl + 1], hn = Math.hypot(...hl);
	const fx = 0.5 + 0.5 * (hl[0] / hn) * 0.9, fy = 0.5 - 0.5 * (hl[1] / hn) * 0.9;
	const mix = (a, b, t) => '#' + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, '0')).join('');
	const stops = [[0, GOLD_LIGHT], [0.22, mix(GOLD_LIGHT, SHADE, 0.55)], [0.5, SHADE], [0.85, mix(SHADE, '#000000', 0.3)], [1, mix(SHADE, '#000000', 0.45)]];
	return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5" fx="${fx.toFixed(3)}" fy="${fy.toFixed(3)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>` +
		`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="url(#${id})"/>`;
}

/** Nested regions, each holding the next, shaded so that the k-th band shows at 0.12 + 0.13 k (as the paper's
 * fig:same-outside and chapter 2.4's skin): `shapes` the regions' path data, outermost first. */
export function steps(shapes) {
	let shown = 0;
	return shapes.map((d, k) => {
		const want = 0.12 + 0.13 * k, alpha = 1 - (1 - want) / (1 - shown);
		shown = want;
		return `<path d="${d}" fill="${SHADE}" fill-opacity="${alpha.toFixed(4)}" fill-rule="evenodd"/>`;
	}).join('');
}
