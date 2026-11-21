// The reach of a tide of given degree. (a) Two bodies with the same field outside the radius R: a thin shell of
// mass M and radius R / sqrt 2, and a point of mass M / 2 at the centre of a thin shell of radius R that holds the
// other half. The field: outside R the pull of the two is the same, so the same ring of arrows is drawn twice. A
// tide of degree n: an impulsive tide of profile g = Re (x + iy)^n / n (x across the page, y up) gives the part at
// (x, y) the impulse grad g. Each bold arrow is that impulse, exact in direction and in length (one scale, K, for
// both bodies and both tides), with the part it belongs to at its middle; orange where the part moves outward,
// blue where inward. Arrows stand only where there is mass, in the 4n directions turned by 45 / n degrees from
// those in which the impulse is along the radius (so none where it is across the radius); the mass at the centre
// receives none. The heavy arrows outside are the tide itself: outward and inward in turn, 2n of them. The weight:
// each bar is the energy gained, the integral of rho |grad g|^2 over the body, from the reference implementation
// (reference/gravcam/figure_data.py, ladder): 1/3 and 1/3 for degree two, 2/15 and 4/15 for degree three.
// (b) The moments of the density that are reached, a bead for each: the floor j holds the moments against
// r^(L+2j) Y_LM, the 2L + 1 of each degree L in a row as in the figure of the hair (figs/hair.js), for L up to
// TOP_DEGREE. The field at one time holds the floor j = 0; tides of degree up to m add the floors j < m. The
// orange bead is the first at which the two bodies of (a) differ: L = 0, j = 2.
// Pictorial, and to be called so: the bodies cut open in the first column (pictures from an image model, as in
// figs/hair.js), the thickness of the shells' skins and the size of the mass at the centre. Schematic: the size of
// K, and the places and lengths of the grey arrows of the field and of the heavy arrows of the tide.
import { Panel, v3, figure, sprite, letter, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, SHELL_INNER, CORE_RADIUS, METAL, STEEL, IRON, HEAVY, text, n2, circle, picture, outline, bold } from '../stone.js';

// ---- the physics --------------------------------------------------------------------------------------
export const POINT = 0.12;          // the radius drawn for the mass at the centre, in units of R
export const K = 0.46;              // the length of a kick arrow, in units of R for an impulse of |grad g| = R^(n-1)
export const TOP_DEGREE = 4;        // the highest degree L drawn in panel (b)
export const FLOORS = 4;            // the floors drawn: j = 0 (the field) and tides of degree two, three and four

/** The gradient at (x, y), in the plane z = 0, of g = Re (x + iy)^n / n: Re and -Im of (x + iy)^(n-1). */
export function kick(n, x, y) {
	let re = 1, im = 0;
	for (let k = 1; k < n; k++) [re, im] = [re * x - im * y, re * y + im * x];
	return [re, -im];
}

/** Where the kicked parts of a ring are drawn for a tide of degree n: 4n directions, each 45 / n degrees from one
 * in which the impulse is along the radius. */
export const turned = (n) => Array.from({ length: 4 * n }, (_, m) => ((2 * m + 1) * Math.PI) / (4 * n));

/** The 2n directions of the tide itself: outward at the even ones, inward at the odd. */
export const lobes = (n) => Array.from({ length: 2 * n }, (_, m) => (m * Math.PI) / n);

// ---- the drawing --------------------------------------------------------------------------------------
const W = 504, H = 200;
const R = 26;                                   // points per R
const TOP = 1;                                  // the top of the letters and heads
const X1 = 44;                                  // the bodies cut open
const X = { 2: 132, 3: 269 };                   // the sections, for the tides of degree two and three
const XBAR = { 2: 181, 3: 318 };                // the left end of each tide's bars
const Y = [54, 149];                            // the two bodies' rows
const BAR = 96, BARH = 7;                       // points per unit of gain, and a bar's thickness
const FIELD = [1.15, 1.45], TIDE = [1.13, 1.52]; // the arrows outside, nearer and farther end, in units of R

const XB = 368;                                 // panel (b)
const XS = 430, YS = 106;                       // the stack's centre on the page
const PITCH = 6.6, ROWS = 6.2, BEAD = 2.6;      // the beads: spacing in a row, of the rows on the page, and radius
const RISE = 43, TILT = 52;                     // a floor above the last, on the page; the tilt of the view, degrees
const NAME = 6.5;                               // the floors' names
const PLATE = { field: ['#f0eee9', '#d9d5cb'], tide: ['#f6dfc8', '#e2bd96'] };   // the floors, top and edge: the field's, and those that tides add
const SLAB = 3.2;                               // a floor's thickness, in the stack's own space

export default async function () {
	const d = await (await fetch('/reference/results/figures/ladder.json')).json();
	const names = ['shell', 'shell-face', 'core-metal'];
	const art = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await sprite(SPRITES + n + '.png')])));
	const panels = [];
	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });   // figure coordinates
	const fp = (px, py) => v3(px - W / 2, H / 2 - py, 0);
	const draw = (svg, layer = 0) => page.items.push({ kind: 'raw', layer, depth: 0, svg });

	// the two bodies, as the reference implementation has them: shells of (mass, radius), a radius of zero a point
	const bodies = d.bodies.map((shells, i) => ({
		key: 'ab'[i],
		rings: shells.filter(([, r]) => r > 0).map(([, r]) => r),
		point: shells.some(([, r]) => r === 0),
		outer: Math.max(...shells.map(([, r]) => r))
	}));
	if (bodies[0].rings.length !== 1 || Math.abs(bodies[0].rings[0] ** 2 - 0.5) > 1e-12 || bodies[0].point) throw new Error('the first body');
	if (bodies[1].rings.length !== 1 || bodies[1].rings[0] !== 1 || !bodies[1].point) throw new Error('the second body');

	// ---- (a)
	bodies.forEach((b, i) => {
		const y = Y[i], r = b.outer * R;
		// the field: the body cut open, and the same pull outside each
		draw(picture(`ladder-${b.key}`, art.shell, X1, y, r, circle(X1, y, r)) + outline(X1, y, r, 0.35));
		if (b.point) page.sphere(fp(X1, y), POINT * R, IRON, { spec: 0.45, shininess: 30, layer: 1 });
		const F = new Panel({ x: X1 - FIELD[1] * R - 2, y: y - FIELD[1] * R - 2, w: 2 * FIELD[1] * R + 4, h: 2 * FIELD[1] * R + 4, scale: R });
		panels.push(F);
		for (let m = 0; m < 24; m++) {
			const t = (m * Math.PI) / 12, u = v3(Math.cos(t), Math.sin(t), 0);
			F.arrow(u.clone().multiplyScalar(FIELD[1]), u.clone().multiplyScalar(FIELD[0]), { color: FAINT, width: 0.5, head: 2.8 });
		}
		for (const tide of d.tides) {
			const n = tide.degree, x = X[n];
			const at = (px, py) => [x + R * px, y - R * py];
			// the body in section, exact: each skin a ring of the sprite's stone, the mass at the centre a disc of its metal
			const here = `ladder-${b.key}-${n}`;
			draw(picture(here, art['shell-face'], x, y, r, circle(x, y, r) + circle(x, y, SHELL_INNER * r)));
			draw(outline(x, y, SHELL_INNER * r) + outline(x, y, r), 2);
			if (b.point) {
				draw(picture(here + '-point', art['core-metal'], x, y, POINT * R, circle(x, y, POINT * R), METAL / CORE_RADIUS));
				draw(outline(x, y, POINT * R), 2);
			}
			// the kick of each part of the skin, with the part at the arrow's middle
			const mid = ((1 + SHELL_INNER) / 2) * b.outer;
			for (const t of turned(n)) {
				const px = mid * Math.cos(t), py = mid * Math.sin(t);
				const [vx, vy] = kick(n, px, py);
				const size = Math.hypot(vx, vy), outward = (px * vx + py * vy) / (mid * size);   // cos nt
				if (Math.abs(outward) < 0.7) throw new Error('a kick with no clear sense, at ' + t);
				const one = bold('kick', at(px - (K / 2) * vx, py - (K / 2) * vy), at(px + (K / 2) * vx, py + (K / 2) * vy),
					outward > 0 ? ACCENT : ACCENT2, slender(K * size * R));
				draw(one.arrow, 3);
			}
			// the tide itself
			lobes(n).forEach((t, m) => {
				const u = [Math.cos(t), Math.sin(t)];
				const near = at(TIDE[0] * u[0], TIDE[0] * u[1]), far = at(TIDE[1] * u[0], TIDE[1] * u[1]);
				draw((m % 2 ? bold('tide', far, near, ACCENT2, HEAVY) : bold('tide', near, far, ACCENT, HEAVY)).arrow, 3);
			});
			// the weight
			const gain = tide.gain[i];
			draw(`<rect data-bar="${b.key}${n}" x="${n2(XBAR[n])}" y="${n2(y - BARH / 2)}" width="${n2(gain * BAR)}" height="${BARH}" fill="${ACCENT}"/>`);
		}
		// the radius R, inside which the first body's mass lies deeper
		if (b.outer < 1) for (const x of [X1, X[2], X[3]]) draw(`<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${FAINT}" stroke-width="0.35" stroke-dasharray="1.1 1.7"/>`, 0.5);
	});
	// the arrows of the drawing are the reference implementation's impulses
	for (const tide of d.tides) tide.angle_deg.forEach((a, k) => {
		const t = (a * Math.PI) / 180, [vx, vy] = kick(tide.degree, Math.cos(t), Math.sin(t));
		if (Math.hypot(vx - tide.kick[k][0], vy - tide.kick[k][1]) > 1e-12) throw new Error('the kick of degree ' + tide.degree + ' at ' + a);
	});
	page.label(text('the field'), [X1, TOP], { size: 8, anchor: 'ct' });
	page.label(text('a tide of degree two'), [X[2], TOP], { size: 8, anchor: 'ct' });
	page.label(text('a tide of degree three'), [X[3], TOP], { size: 8, anchor: 'ct' });
	for (const n of [2, 3]) page.label(text('the weight'), [XBAR[n], TOP], { size: 8, anchor: 'lt' });
	page.labels.push(letter('a', 0, TOP));
	// what the two bodies are
	const under = (i) => Y[i] + FIELD[1] * R + 3;
	page.label(`M \\text{ at } R/\\sqrt{2}`, [X1, under(0)], { size: NAME, anchor: 'ct', color: DIM });
	page.label(`\\tfrac{1}{2}M \\text{ at the centre, } \\tfrac{1}{2}M \\text{ at } R`, [X1, under(1)], { size: NAME, anchor: 'ct', color: DIM });

	// ---- (b)
	const S = new Panel({ x: XS - 60, y: YS - 100, w: 120, h: 200, scale: 1, tilt: TILT });
	panels.push(S);
	const cos = Math.cos((TILT * Math.PI) / 180);
	const rise = RISE / cos;                                           // a floor above the last, in the stack's own space
	const y0 = -((FLOORS - 1) * rise) / 2;
	const deep = ROWS / Math.sin((TILT * Math.PI) / 180);               // a row behind the last, in the stack's own space
	const place = (L, M, j) => v3(M * PITCH, y0 + j * rise, (L - TOP_DEGREE / 2) * deep);
	const floors = [text('the field'), text('degree two'), text('degree three'), text('degree four')];
	let count = Array.from({ length: FLOORS }, () => 0);
	for (let j = 0; j < FLOORS; j++) {
		// the floor: a pale plate, a little larger than the triangle of its beads
		const corners = [place(0, 0, j), place(TOP_DEGREE, -TOP_DEGREE, j), place(TOP_DEGREE, TOP_DEGREE, j)];
		const c = corners.reduce((s, p) => s.add(p), v3(0, 0, 0)).divideScalar(3);
		const grow = 1 + (BEAD + 2.2) / inradius(corners);
		const plate = corners.map((p) => c.clone().add(p.clone().sub(c).multiplyScalar(grow)));
		const [top, edge] = j ? PLATE.tide : PLATE.field;
		// its front edge, seen from above, and its top
		S.polygon([plate[1], plate[2], plate[2].clone().add(v3(0, -SLAB, 0)), plate[1].clone().add(v3(0, -SLAB, 0))], { fill: edge, stroke: edge, width: 0.3, layer: 2 * j });
		S.polygon(plate, { fill: top, stroke: edge, width: 0.3, layer: 2 * j + 0.5 });
		for (let L = 0; L <= TOP_DEGREE; L++) for (let M = -L; M <= L; M++, count[j]++) {
			const first = j === 2 && L === 0;                              // where the two bodies of (a) first differ
			S.sphere(place(L, M, j), BEAD, first ? ACCENT : STEEL, { spec: 0.6, shininess: 36, layer: 2 * j + 1 });
		}
		const [, yl] = S.at(place(TOP_DEGREE / 2, 0, j));
		page.label(floors[j], [XS + TOP_DEGREE * PITCH + BEAD + 9, yl], { size: NAME, anchor: 'lc', color: DIM });
	}
	// the beads drawn are the polynomials the reference implementation counts: of each degree d, those with
	// Lap^m P = 0 are the beads of degree L = d - 2j on the floors j < m
	for (const [m, dims] of Object.entries(d.dimension)) dims.forEach((dim, deg) => {
		let beads = 0;
		for (let j = 0; j < Math.min(+m, FLOORS); j++) if (deg - 2 * j >= 0 && deg - 2 * j <= TOP_DEGREE) beads += 2 * (deg - 2 * j) + 1;
		if (beads !== dim) throw new Error(`degree ${deg}, tides up to ${m}: ${beads} beads for ${dim} polynomials`);
	});
	if (count.some((n) => n !== (TOP_DEGREE + 1) ** 2)) throw new Error('the floors: ' + count);
	page.labels.push(letter('b', XB, TOP));

	return figure(W, H, [...panels, page]);
}

/** The make of a kick arrow L points long, as figs/hair.js makes them, but with a head of at most two fifths of
 * the arrow, so that the shortest, on the smaller shell, still show a shaft. */
function slender(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.4 * L);
	return { width, head, spread: 0.78 * head + 0.5 * width };
}

/** The radius of the circle inscribed in a triangle. */
function inradius([a, b, c]) {
	const A = a.distanceTo(b), B = b.distanceTo(c), C = c.distanceTo(a), s = (A + B + C) / 2;
	return Math.sqrt(((s - A) * (s - B) * (s - C)) / s);
}
