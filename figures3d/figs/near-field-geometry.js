// The geometry of the near field. A block of ground cut open beneath a flat camera, whose pixels are b apart. Its
// sawn face is divided into the cells of one size in the metric (dx^2 + dy^2 + dz^2) / z^2: those of the level n
// lie between the depths b 2^n and b 2^(n+1) and are b 2^n across, squares as wide as their tops are deep, and the
// same cells are marked on the side of the block. Two equal masses lie at the middles of two cells (the paler
// squares). Above the front row of pixels, what that row records of each, -E_zz, drawn to its own greatest value
// and between the two places where it changes sign (sqrt 2 of the depth to either side; beyond them it is negative
// and small, at most 0.018 of the greatest value): a pattern as wide at half its height as its mass is deep (1.001
// of the depth), so that a change of depth is a change of scale across the camera.
// The cells, the masses, the two patterns and that width are the reference implementation's
// (reference/gravcam/figure_data.py, near_field_geometry). The block is drawn in an oblique projection: its sawn
// face in true shape, what lies behind it receding at ANGLE degrees and at half its length.
// Pictorial: the stone (a slab made by design/stone_slab.py from the grain of the bodies of figs/hair.js).
// Schematic: the depth of the block behind its face, and the number of rows of pixels drawn.
import { Panel, v3, figure, sprite, tex, DIM, ACCENT2 } from '../lib.js';
import { IRON, text, n2 } from '../stone.js';

export const ANGLE = 35, SHORTEN = 0.5;      // the oblique projection
export const ROWS = 8;                       // the rows of pixels drawn behind the front one's place

const BAND = '#c9d9ec';                      // under the recorded patterns, as the band of figs/sky-integral.js
const PLATE = '#f4f2ec';                     // the camera
// What is drawn on the stone and on the camera keeps its own dark ink on the site's dark theme too, where the stone
// and the plate stay pale (the site swaps the paper's ink, lib.js INK and DIM, for its theme's).
const CUT = '#2b2418', DOT = '#5c5952';
const PALER = '#ffffff';                     // the veil over a cell that holds a mass: white, not the page's colour, which the site makes dark
const W = 246, H = 129;
const S = 49;                                // points per unit, the unit being eight times the pixels' spacing
const X0 = 25.5, Y0 = 25;                    // the upper left corner of the sawn face
const RISE = 22;                             // the height of a recorded pattern's greatest value
const BEAD = 2.5;                            // a mass

export default async function () {
	const d = await (await fetch('/reference/results/figures/near-field-geometry.json')).json();
	const slab = await sprite('/figures3d/sprites/slab.jpg');
	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });
	const fp = (px, py) => v3(px - W / 2, H / 2 - py, 0);
	const draw = (svg, layer = 0) => page.items.push({ kind: 'raw', layer, depth: 0, svg });

	const p = d.pitch, wide = d.width, deep = 2 * d.tops[d.tops.length - 1];
	if (d.tops.some((t, n) => Math.abs(t - p * 2 ** n) > 1e-12)) throw new Error('the levels do not double');
	if (d.cell_areas.some((a) => Math.abs(a - d.cell_areas[0]) > 1e-12)) throw new Error('the cells are not of one size');
	if (Math.abs(d.width_at_half_height - 1) > 0.005) throw new Error('the pattern is not as wide as its mass is deep');
	const a = (ANGLE * Math.PI) / 180;
	const back = (ROWS * p);                                             // how far the block reaches behind its face
	const off = (zb) => [S * SHORTEN * zb * Math.cos(a), -S * SHORTEN * zb * Math.sin(a)];
	/** A point of the block: x across from its middle, the depth below the camera, and how far behind the face. */
	const at = (x, depth, zb = 0) => { const [ox, oy] = off(zb); return [X0 + S * (x + wide / 2) + ox, Y0 + S * depth + oy]; };
	const path = (pts, close = false) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + (close ? 'Z' : '');
	const line = (pts, width = 0.3, extra = '', color = CUT) => `<path d="${path(pts)}" fill="none" stroke="${color}" stroke-width="${width}"${extra}/>`;

	// ---- the side of the block: the same stone, in shade
	const [OX, OY] = off(back), L = Math.hypot(OX, OY), [XR, YR] = at(wide / 2, 0);
	draw(`<image class="art" href="${slab.href}" x="0" y="0" width="${n2(L)}" height="${n2(S * deep)}" preserveAspectRatio="xMidYMid slice" transform="matrix(${(OX / L).toFixed(5)},${(OY / L).toFixed(5)},0,1,${n2(XR)},${n2(YR)})"/>`);
	const side = [at(wide / 2, 0), at(wide / 2, 0, back), at(wide / 2, deep, back), at(wide / 2, deep)];
	draw(`<path d="${path(side, true)}" fill="#3a2a10" fill-opacity="0.17"/>`, 0.2);
	// ---- the sawn face, in true shape
	draw(`<image class="art" href="${slab.href}" x="${n2(X0)}" y="${n2(Y0)}" width="${n2(S * wide)}" height="${n2(S * deep)}" preserveAspectRatio="none"/>`);
	// the cells in which the masses lie, a little paler
	for (const [place, depth] of d.masses) {
		const n = Math.floor(Math.log2(depth / p) + 1e-9), t = d.tops[n];
		const x0 = -wide / 2 + t * Math.floor((place + wide / 2) / t);
		draw(`<path d="${path([at(x0, t), at(x0 + t, t), at(x0 + t, 2 * t), at(x0, 2 * t)], true)}" fill="${PALER}" fill-opacity="0.45"/>`, 0.3);
	}
	// ---- the cells: on the face, and the same on the side
	d.tops.forEach((t) => {
		draw(line([at(-wide / 2, t), at(wide / 2, t), at(wide / 2, t, back)]), 1);
		for (let m = 1; m < Math.round(wide / t); m++) draw(line([at(-wide / 2 + m * t, t), at(-wide / 2 + m * t, 2 * t)]), 1);
		for (let m = 1; m < Math.round(back / t); m++) draw(line([at(wide / 2, t, m * t), at(wide / 2, 2 * t, m * t)]), 1);
	});
	// ---- the camera: the top of the block, with its pixels
	const top = [at(-wide / 2, 0), at(wide / 2, 0), at(wide / 2, 0, back), at(-wide / 2, 0, back)];
	draw(`<path d="${path(top, true)}" fill="${PLATE}"/>`, 0.5);
	let dots = '';
	for (let j = 0; j < ROWS; j++) for (let i = 0; i < Math.round(wide / p); i++) {
		const [x, y] = at(-wide / 2 + (i + 0.5) * p, 0, (j + 0.5) * p);
		dots += `<circle cx="${n2(x)}" cy="${n2(y)}" r="0.55"/>`;
	}
	draw(`<g fill="${DOT}">${dots}</g>`, 1);
	// the block's edges
	draw(line([...top, top[0]], 0.4, ' stroke-linejoin="round"') +
		line([at(-wide / 2, 0), at(-wide / 2, deep), at(wide / 2, deep), at(wide / 2, 0)], 0.4, ' stroke-linejoin="round"') +
		line([at(wide / 2, deep), at(wide / 2, deep, back), at(wide / 2, 0, back)], 0.4, ' stroke-linejoin="round"'), 2);

	// ---- what the front row records of each mass, the deeper first so that the shallower stands before it
	const order = d.masses.map((m, i) => i).sort((i, j) => d.masses[j][1] - d.masses[i][1]);
	for (const i of order) {
		const [place, depth] = d.masses[i], reach = Math.SQRT2 * depth;      // where -E_zz changes sign
		const from = Math.max(-wide / 2, place - reach), to = Math.min(wide / 2, place + reach);
		const inside = d.row.map((x, k) => [x, d.recorded[i][k]]).filter(([x, v]) => x > from && x < to && v > 0);
		const ends = [from, to].map((x) => [x, x === place - reach || x === place + reach ? 0 : inside[x === from ? 0 : inside.length - 1][1]]);
		const pts = [ends[0], ...inside, ends[1]].map(([x, v]) => { const [X, Y] = at(x, 0); return [X, Y - RISE * v]; });
		draw(`<path d="${path([at(from, 0), ...pts, at(to, 0)], true)}" fill="${BAND}" fill-opacity="0.72"/>`, 3);
		// the curves over both areas, so that neither is veiled by the other's
		draw(`<path d="${path(pts)}" fill="none" stroke="${ACCENT2}" stroke-width="0.7" stroke-linejoin="round"/>`, 3.5);
	}
	// ---- the masses, and a line from each to the top of its pattern
	for (const [place, depth] of d.masses) {
		const [x, y] = at(place, depth);
		draw(`<path d="${path([[x, y - BEAD], [x, Y0 - RISE]])}" fill="none" stroke="${CUT}" stroke-width="0.35" stroke-dasharray="1.4 1.6"/>`, 4);
		page.sphere(fp(x, y), BEAD, IRON, { spec: 0.45, shininess: 30, layer: 5 });
	}

	// ---- the depths of the levels, in units of the pixels' spacing b (the paper's name for it; `pitch` in the data)
	const [xl] = at(-wide / 2, 0);
	[...d.tops.slice(1), deep].forEach((t) => {
		const [, y] = at(0, t);
		draw(line([[xl - 2.4, y], [xl, y]], 0.4, '', DIM), 2);
		page.label(`${Math.round(t / p)}b`, [xl - 3.6, y], { size: 6.5, anchor: 'rc', color: DIM });
	});
	const ym = Y0 + (S * deep) / 2;
	page.labels.push(tex(text('depth'), [6.5, ym], 7, 'cc', DIM).then((g) => `<g transform="rotate(-90 6.5 ${ym})">${g}</g>`));
	const [xc, yc] = at(wide / 2, 0, back);
	page.label(text('the camera'), [xc, yc - 2], { size: 7, anchor: 'rb', color: DIM });

	return figure(W, H, [page]);
}
