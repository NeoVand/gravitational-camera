// The flow that two tides find. (a) A uniform sphere in section through its equator, seen along the axis about
// which it turns: the inner ball, out to 2^(-1/5) of the radius, turns one way (orange) and the rest the other
// (blue), at the same rate. Each arrow is the path of a part in one interval of time: all span the same angle
// (SWEEP), so their lengths are in proportion to the speeds. The two parts have equal and opposite angular
// momenta, and the sphere has no magnetic part of its field outside.
// (b) What each part contributes to the bracket of the rates of two moments, by radius: the integrand, over the
// radius, of {dQ_h/dt, dQ_g/dt} for the pair h + ig = (x + iy)^n / n, which for a uniform sphere turning at
// Omega(r) is -c_n Omega(r) r^(2n) (c_2 = 4, c_3 = 32/5, in units of M, R and the rate). Each strip is drawn to its
// own greatest value. For n = 2, as for the angular momentum, the two areas are equal and the sum is zero; for
// n = 3 the outer part counts for more, and 0.221 remains. The areas and the sums are the reference
// implementation's (reference/gravcam/figure_data.py, hidden_flow), and the curves drawn are checked against them.
// Pictorial: the stone of the section (a picture from an image model, as in figs/hair.js). Schematic: the places
// of the arrows and the angle they span.
import { Panel, figure, sprite, letter, DIM, PAGE, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, text, n2, circle, picture, outline } from '../stone.js';

export const SWEEP = 36;                          // degrees turned by every part in the interval drawn
/** The rings on which the paths are drawn (radius in units of R, the angle of the first of its four, degrees). */
export const RINGS = [[0.34, 45], [0.66, 0]];
/** The coefficient c_n of the integrand: the bracket is the integral of -c_n Omega(r) r^(2n) over the radius. */
export const COEFFICIENT = { 2: 4, 3: 32 / 5 };

const TINT = { inner: '#f1c9a1', outer: '#c9d9ec' };   // the two parts' areas, as the caps and band of figs/sky-integral.js
const W = 246, H = 114;
const R = 38, CX = 41, CY = 61;                   // the section
const XA = 113, XB = 219;                         // panel (b): the radius from 0 to R
const AXIS = [39, 88], RISE = 26;                 // the two strips' zero lines, and the height of each strip's greatest value
const SCALE = 102;                                // the line that carries the scale of the radius

/** An arrow along the circle of radius r about (cx, cy) from the angle a0 to a1 (radians, anticlockwise positive,
 * y up): a shaft and a head with its tip at a1, and a halo of the page's colour to lay beneath them. */
function turning(cx, cy, r, a0, a1, color, { width, head, spread, halo = 0 }) {
	const dir = Math.sign(a1 - a0), neck = a1 - (dir * head) / r;
	const at = (a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
	const [x0, y0] = at(a0), [xn, yn] = at(neck), [xt, yt] = at(a1);
	const shaft = `M${x0.toFixed(3)},${y0.toFixed(3)}A${n2(r)},${n2(r)} 0 0,${dir > 0 ? 0 : 1} ${xn.toFixed(3)},${yn.toFixed(3)}`;
	const L = Math.hypot(xt - xn, yt - yn), nx = -(yt - yn) / L, ny = (xt - xn) / L;
	const tip = `M${xt.toFixed(3)},${yt.toFixed(3)}L${(xn + (nx * spread) / 2).toFixed(3)},${(yn + (ny * spread) / 2).toFixed(3)}L${(xn - (nx * spread) / 2).toFixed(3)},${(yn - (ny * spread) / 2).toFixed(3)}Z`;
	return {
		halo: halo ? `<path d="${shaft}" fill="none" stroke="${PAGE}" stroke-width="${n2(width + 2 * halo)}"/><path d="${tip}" fill="${PAGE}" stroke="${PAGE}" stroke-width="${n2(2 * halo)}" stroke-linejoin="round"/>` : '',
		arrow: `<path data-arrow="flow" d="${shaft}" fill="none" stroke="${color}" stroke-width="${n2(width)}"/><path d="${tip}" fill="${color}"/>`
	};
}

/** The make of a path L points long: as the kick arrows of figs/ladder.js. */
function make(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.4 * L);
	return { width, head, spread: 0.78 * head + 0.5 * width, halo: 0.5 * width };
}

export default async function () {
	const d = await (await fetch('/reference/results/figures/hidden-flow.json')).json();
	const art = await sprite(SPRITES + 'ball-face.png');
	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });
	const draw = (svg, layer = 0) => page.items.push({ kind: 'raw', layer, depth: 0, svg });
	const u0 = d.inner_radius;
	if (Math.abs(u0 ** 5 - 0.5) > 1e-12) throw new Error('the inner ball does not hold half the moment of inertia');

	// ---- (a) the section, and the path of a part of each ring in one interval
	draw(picture('hidden-flow-face', art, CX, CY, R, circle(CX, CY, R)));
	draw(outline(CX, CY, u0 * R) + outline(CX, CY, R), 2);
	const sweep = (SWEEP * Math.PI) / 180;
	const paths = (r, first, sense, color, halo) => {
		for (let m = 0; m < 4; m++) {
			const mid = ((first + 90 * m) * Math.PI) / 180;
			const one = turning(CX, CY, r * R, mid - (sense * sweep) / 2, mid + (sense * sweep) / 2, color, { ...make(r * R * sweep), ...(halo ? {} : { halo: 0 }) });
			draw(one.halo, 1);
			draw(one.arrow, 3);
		}
	};
	for (const [r, first] of RINGS) {
		if (r >= u0) throw new Error('a ring of the inner ball lies outside it');
		paths(r, first, 1, ACCENT, true);
	}
	paths((1 + u0) / 2, 0, -1, ACCENT2, true);
	page.labels.push(letter('a', 0, 1));

	// ---- (b) the integrand of the bracket over the radius, for the pairs of degree two and three
	const X = (u) => XA + (XB - XA) * u;
	const strips = [[2, d.quadrupolar, text('degree two')], [3, d.octupolar, text('degree three')]];
	strips.forEach(([n, parts, name], i) => {
		const y0 = AXIS[i], c = COEFFICIENT[n];
		const Y = (v) => y0 - (RISE * v) / c;                              // the greatest value, at the surface, RISE above the line
		const curve = (a, b, sign) => Array.from({ length: 81 }, (_, k) => a + ((b - a) * k) / 80).map((u) => [X(u), Y(sign * c * u ** (2 * n))]);
		const area = (pts, a, b) => `M${n2(X(a))},${n2(y0)}L${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}L${n2(X(b))},${n2(y0)}Z`;
		const line = (pts) => `M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}`;
		// the inner ball turns at +Omega and counts as -c u^(2n); the rest turns at -Omega and counts as +c u^(2n)
		const inner = curve(0, u0, -1), outer = curve(u0, 1, 1);
		draw(`<path d="${area(inner, 0, u0)}" fill="${TINT.inner}"/><path d="${area(outer, u0, 1)}" fill="${TINT.outer}"/>`);
		draw(`<path d="${line(inner)}" fill="none" stroke="${ACCENT}" stroke-width="0.6"/><path d="${line(outer)}" fill="none" stroke="${ACCENT2}" stroke-width="0.6"/>`, 1);
		// where the turning changes sense, and the zero line
		draw(`<path d="M${n2(X(u0))},${n2(Y(-c * u0 ** (2 * n)))}L${n2(X(u0))},${n2(Y(c * u0 ** (2 * n)))}" stroke="${DIM}" stroke-width="0.35"/>`, 1);
		draw(`<path d="M${n2(XA)},${n2(y0)}L${n2(XB)},${n2(y0)}" stroke="${DIM}" stroke-width="0.4"/>`, 0.5);
		// the areas drawn are the reference implementation's shares
		const share = [-(c * u0 ** (2 * n + 1)) / (2 * n + 1), (c * (1 - u0 ** (2 * n + 1))) / (2 * n + 1)];
		if (share.some((s, k) => Math.abs(s - parts[k]) > 1e-9)) throw new Error(`degree ${n}: the areas ${share} against ${parts}`);
		const sum = parts[0] + parts[1];
		if (n === 3 && Math.abs(sum - d.bracket) > 1e-12) throw new Error('the octupolar sum');
		page.label(name, [XA + 1, y0 - RISE + 2], { size: 7, anchor: 'lt', color: DIM });
		page.label(Math.abs(sum) < 1e-12 ? '0' : sum.toFixed(3), [XB + 6, y0], { size: 8, anchor: 'lc' });
	});
	page.label(text('sum'), [XB + 6, AXIS[0] - RISE + 2], { size: 7, anchor: 'lt', color: DIM });
	// the scale of the radius
	draw(`<path d="M${n2(XA)},${SCALE}L${n2(XB)},${SCALE}" stroke="${DIM}" stroke-width="0.4"/>` +
		[0, u0, 1].map((u) => `<path d="M${n2(X(u))},${SCALE}L${n2(X(u))},${SCALE + 2.2}" stroke="${DIM}" stroke-width="0.4"/>`).join(''));
	page.label('0', [X(0), SCALE + 3.2], { size: 7, anchor: 'ct', color: DIM });
	page.label(u0.toFixed(2), [X(u0), SCALE + 3.2], { size: 7, anchor: 'ct', color: DIM });
	page.label('1', [X(1), SCALE + 3.2], { size: 7, anchor: 'ct', color: DIM });
	page.label('r/R', [X(0.45), SCALE + 3.2], { size: 7, anchor: 'ct', color: DIM });
	page.labels.push(letter('b', XA - 14, 1));

	return figure(W, H, [page]);
}
