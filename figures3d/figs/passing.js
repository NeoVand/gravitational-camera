// A mass that passes. (a) The two bodies of figs/ladder.js, seen along the straight path of a point mass that flies
// past them: a thin shell of mass M at R / sqrt 2 (inside the dotted circle of radius R), and M / 2 at the centre of
// a shell of radius R that holds the other half; each in section through its centre, across the path. The bead is
// where the path crosses that plane, at b = 1.5 R. Each bold arrow is the impulse a part of the shell receives less
// the recoil of the whole body, C (b - s) / |b - s|^2 - C b / b^2, exact in direction and in length (one scale, K,
// for both bodies), with the part it belongs to at its middle; orange where it points away from the centre, blue
// where toward it. Arrows stand at the four places on each shell where the impulse lies along the radius: towards b,
// away from it, and the two between (77 and 71 degrees from b), where it points in; the mass at the centre receives
// none. Each bar is the energy left in the body, (C^2 / 2) [F(b) - M / b^2], in units of
// M C^2 / 2 R^2: 0.0803 and 0.1041, one scale.
// (b) That energy against b / R, on logarithmic axes: the shell at R / sqrt 2 dashed, the other solid; the orange
// dots are the pass of (a). Far away both go as (1/3) (R / b)^4 and differ by (2/15) (R / b)^6.
// The impulses, the energies and the curves are the reference implementation's (reference/gravcam/figure_data.py,
// passing_mass), and what is drawn is checked against them.
// Pictorial, and to be called so: the stone of the sections (pictures from an image model, as in figs/hair.js), the
// thickness of the skins and the size of the mass at the centre and of the bead. Schematic: the size of K.
import { Panel, v3, figure, sprite, letter, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, SHELL_INNER, CORE_RADIUS, METAL, STEEL, text, n2, circle, picture, outline, bold } from '../stone.js';
import { POINT } from './ladder.js';

export const K = 0.7;                  // the length of a kick arrow, in units of R for an impulse of C / R

// What is drawn on the stone keeps its own dark ink on the site's dark theme, where the stone stays pale (as in
// figs/near-field-geometry.js): the site swaps the paper's INK for its theme's.
const CUT = '#2b2418';
const W = 246, H = 129.4;
const R = 28;                           // points per R
const BASE = 7;                         // the baseline of the letters and of the labels beside them
const CX = 30.5, Y = [39.8, 99];          // the sections
const XBAR = 84, BAR = 540, BARH = 6;   // the bars: left end, points per unit of energy, thickness
const BEAD = 2.0;                       // where the path crosses the page
const XB = 146;                         // panel (b)
const AX = 165.5, AXR = 243.6;          // the axis of b / R, from 1 to 4
const TOPV = 16, BOTV = 111;            // the axis of the energy, from 1 to 0.001
const B_RANGE = [1, 4], E_RANGE = [1e-3, 1];

/** The internal energy of a round body of (mass, radius) shells, for a pass at b, in units of M C^2 / 2 R^2. */
const internal = (shells, b) => shells.reduce((s, [m, r]) => s + (r === 0 ? m / b ** 2 : (m * Math.asin(r / b)) / (r * Math.sqrt(b * b - r * r))), 0) - 1 / b ** 2;

/** The make of a kick arrow L points long: as figs/ladder.js makes them. */
function slender(L) {
	const width = 0.9 * Math.min(1, L / 6.5) ** 0.4;
	const head = Math.min(3.8, 0.4 * L);
	return { width, head, spread: 0.78 * head + 0.5 * width };
}

export default async function () {
	const d = await (await fetch('/reference/results/figures/passing.json')).json();
	const names = ['shell-face', 'core-metal'];
	const art = Object.fromEntries(await Promise.all(names.map(async (n) => [n, await sprite(SPRITES + n + '.png')])));
	const page = new Panel({ x: 0, y: 0, w: W, h: H, scale: 1 });
	const fp = (px, py) => v3(px - W / 2, H / 2 - py, 0);
	const draw = (svg, layer = 0) => page.items.push({ kind: 'raw', layer, depth: 0, svg });
	const b = d.b, skin = (1 + SHELL_INNER) / 2;
	if (Math.abs(skin - d.skin) > 1e-12) throw new Error('the parts are not where the reference implementation put them');
	if (Math.abs(d.recoil[0] - 1 / b) > 1e-15 || d.recoil[1] !== 0) throw new Error('the recoil');

	const bodies = d.bodies.map((shells, i) => ({
		key: 'ab'[i], shells,
		rings: shells.filter(([, r]) => r > 0).map(([, r]) => r),
		point: shells.some(([, r]) => r === 0),
		outer: Math.max(...shells.map(([, r]) => r))
	}));
	if (bodies[0].rings.length !== 1 || Math.abs(bodies[0].rings[0] ** 2 - 0.5) > 1e-12 || bodies[0].point) throw new Error('the first body');
	if (bodies[1].rings.length !== 1 || bodies[1].rings[0] !== 1 || !bodies[1].point) throw new Error('the second body');

	// ---- (a)
	const name = ['\\text{shell at } R/\\sqrt{2}', text('half at the centre')];
	bodies.forEach((body, i) => {
		const y = Y[i], r = body.outer * R;
		const at = (px, py) => [CX + R * px, y - R * py];
		const here = `passing-${body.key}`;
		draw(picture(here, art['shell-face'], CX, y, r, circle(CX, y, r) + circle(CX, y, SHELL_INNER * r)));
		draw(outline(CX, y, SHELL_INNER * r, undefined, CUT) + outline(CX, y, r, undefined, CUT), 2);
		if (body.point) {
			draw(picture(here + '-point', art['core-metal'], CX, y, POINT * R, circle(CX, y, POINT * R), METAL / CORE_RADIUS));
			draw(outline(CX, y, POINT * R, undefined, CUT), 2);
		}
		if (body.outer < 1) draw(`<circle cx="${CX}" cy="${y}" r="${R}" fill="none" stroke="${FAINT}" stroke-width="0.35" stroke-dasharray="1.1 1.7"/>`, 0.5);
		// the impulse of each part of the skin less the recoil, with the part at the arrow's middle
		const rings = d.kicks[i];
		body.shells.forEach(([, rr], k) => {
			if (rr === 0) {
				if (rings[k].kick[0].some((v) => Math.abs(v) > 1e-15)) throw new Error('the mass at the centre moves with the body');
				return;
			}
			const mid = skin * rr;
			if (rings[k].angle_deg.length !== 4) throw new Error('four places on each shell');
			rings[k].angle_deg.forEach((a, j) => {
				const t = (a * Math.PI) / 180, px = mid * Math.cos(t), py = mid * Math.sin(t);
				const dx = b - px, dy = -py, q = dx * dx + dy * dy;
				const vx = dx / q - 1 / b, vy = dy / q;
				const [jx, jy] = rings[k].kick[j];
				if (Math.hypot(vx - jx, vy - jy) > 1e-12) throw new Error(`the impulse of body ${body.key} at ${a}`);
				const size = Math.hypot(vx, vy), outward = (px * vx + py * vy) / (mid * size);
				if (Math.abs(Math.abs(outward) - 1) > 1e-12 || Math.sign(outward) !== (j % 2 ? -1 : 1)) throw new Error('an impulse not along the radius, at ' + a);
				const one = bold('kick', at(px - (K / 2) * vx, py - (K / 2) * vy), at(px + (K / 2) * vx, py + (K / 2) * vy),
					outward > 0 ? ACCENT : ACCENT2, slender(K * size * R));
				draw(one.arrow, 3);
			});
		});
		// where the path crosses the page
		page.sphere(fp(CX + b * R, y), BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 4 });
		page.label('b', [CX + b * R, y + BEAD + 1.6], { size: 7, anchor: 'ct' });
		// the energy left
		const e = internal(body.shells, b);
		if (Math.abs(e - d.energies[i]) > 1e-12) throw new Error('the energy of body ' + body.key);
		draw(`<rect data-bar="${body.key}" x="${n2(XBAR)}" y="${n2(y - BARH / 2)}" width="${n2(e * BAR)}" height="${BARH}" fill="${ACCENT}"/>`);
		page.label(name[i], [XBAR, y - BARH / 2 - 2.8], { size: 7, anchor: 'lB', color: DIM });
	});
	if (Math.abs(d.energies[1] / d.energies[0] - 1 - d.excess) > 1e-12 || Math.round(100 * d.excess) !== 30) throw new Error('the excess');
	page.labels.push(letter('a', 0, 1));
	page.label(text('seen along the path'), [14, BASE], { size: 7, anchor: 'lB', color: DIM });
	page.label(text('energy left'), [XBAR + (BAR * Math.max(...d.energies)) / 2, BASE], { size: 7, anchor: 'cB', color: DIM });

	// ---- (b)
	const X = (x) => AX + ((AXR - AX) * Math.log(x / B_RANGE[0])) / Math.log(B_RANGE[1] / B_RANGE[0]);
	const Yv = (v) => BOTV - ((BOTV - TOPV) * Math.log(v / E_RANGE[0])) / Math.log(E_RANGE[1] / E_RANGE[0]);
	const xs = d.curve_b;
	bodies.forEach((body, i) => {
		xs.forEach((x, k) => {
			if (Math.abs(internal(body.shells, x) - d.curves[i][k]) > 1e-12) throw new Error(`the curve of body ${body.key} at ${x}`);
		});
		const line = 'M' + xs.map((x, k) => `${n2(X(x))},${n2(Yv(d.curves[i][k]))}`).join('L');
		draw(`<path d="${line}" fill="none" stroke="${i ? INK : FAINT}" stroke-width="0.6" stroke-linejoin="round"/>`, 1 + i / 2);
		draw(`<circle cx="${n2(X(b))}" cy="${n2(Yv(d.energies[i]))}" r="1.15" fill="${ACCENT}"/>`, 2);
	});
	// the far limits: the common part, and the difference
	const far = 40, [ea, eb] = bodies.map((body) => internal(body.shells, far));
	if (Math.abs(ea * far ** 4 / d.far.common - 1) > 1e-2 || Math.abs(((eb - ea) * far ** 6) / d.far.difference - 1) > 1e-2) throw new Error('the far limits');
	// the axes
	const tick = 2.2, dim = `stroke="${DIM}" stroke-width="0.4"`;
	draw(`<path d="M${n2(AX)},${n2(TOPV)}L${n2(AX)},${n2(BOTV)}L${n2(AXR)},${n2(BOTV)}" fill="none" ${dim}/>`, 0.5);
	for (const x of [1, 1.5, 2, 3, 4]) {
		draw(`<path d="M${n2(X(x))},${n2(BOTV)}L${n2(X(x))},${n2(BOTV + tick)}" ${dim}/>`, 0.5);
		page.label(String(x), [X(x), BOTV + tick + 1], { size: 7, anchor: 'ct', color: DIM });
	}
	page.label('b/R', [(AX + AXR) / 2, BOTV + tick + 8.4], { size: 7, anchor: 'ct', color: DIM });
	for (const [v, s] of [[1, '1'], [0.1, '0.1'], [0.01, '0.01'], [0.001, '0.001']]) {
		draw(`<path d="M${n2(AX)},${n2(Yv(v))}L${n2(AX - tick)},${n2(Yv(v))}" ${dim}/>`, 0.5);
		page.label(s, [AX - tick - 1.2, Yv(v)], { size: 7, anchor: 'rc', color: DIM });
	}
	page.label(text('half at the centre'), [178, 21], { size: 7, anchor: 'lc', color: DIM });
	// the first body's name to the left of its curve, its upper right corner 3 points clear of it
	const level = 0.0075, k0 = d.curves[0].findIndex((v) => v < level);   // where the curve meets the label's top
	const bl = xs[k0 - 1] * (xs[k0] / xs[k0 - 1]) ** (Math.log(level / d.curves[0][k0 - 1]) / Math.log(d.curves[0][k0] / d.curves[0][k0 - 1]));
	page.label('\\text{shell at } R/\\sqrt{2}', [X(bl) - 3, Yv(level)], { size: 7, anchor: 'rt', color: DIM });
	page.labels.push(letter('b', XB, 1));
	page.label(text('energy left'), [AX, BASE], { size: 7, anchor: 'lB', color: DIM });

	return figure(W, H, [page]);
}
