// The tutorial, chapter 6.1 (tutorial/relativity/lorentz.md), its third diagram: the distance to a moving body in
// the body's own frame. Two panels side by side at one scale, 100 site pixels (50 points) to the metre, x across and y
// up. Left, "pixel's frame, at the pixel's now": the pixel as a small ring of twelve ink dots at (0, 0); the body as a
// dot in matter's colour at (1.2, 1.6) m, with an arrow in the observer's colour from it along +x, named v = 0.6c; the
// vector r from the pixel to the body in ink, named r = 2.0 m beside its middle, off the line; its parts as thin
// dashed lines, r_par = 1.2 m along x (named under it) and r_perp = 1.6 m along y (named at its right). Right, "body's
// frame": the same with the part along x stretched by gamma = 1.25, the body at (1.5, 1.6) m and at rest (no arrow),
// the arrow from the pixel's event to it named R* = 2.19 m, and the dashed parts named gamma r_par = 1.5 m and
// r_perp = 1.6 m.
// Departure from the diagram's comment: the comment's "line from the pixel's event" to the body is drawn as an arrow,
// as r is, so that the two panels read alike.
// Exact: the body's places, (1.2, 1.6) and (gamma 1.2, 1.6) = (1.5, 1.6) m, the lengths 2.0 and 2.19 m on the page at
// one scale (asserted, R* also from the cross product in tut-lorentz-lib.js), the parts. Schematic: the pixel's ring
// and the body's dot (their sizes), and the length of the arrow v (a direction).
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, MATTER, R_BODY, GAMMA, rstar } from './tut-lorentz-lib.js';

const name = 'tut-lorentz-rstar';
const check = checker(name);

const K = 0.5;                             // points per site pixel of the comment
const PER_M = 100 * K;                     // points per metre
const PANEL = 320;                         // a panel's width, site pixels
const RING = 3.4, SPECK = 0.55;            // the pixel: its ring's radius and its dots', points
const BODY = 3;                            // the body's dot, radius, points
const CLEAR = 1.6;                         // the air between an arrow's ends and the pixel or the body
const V_LEN = 0.55;                        // the arrow v, metres

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const [par, perp] = R_BODY;
	// the pixel of each panel a quarter of the way across it, both on one baseline
	const X0 = ORIGIN - K * PANEL;
	const panel = (i) => ([x, y]) => [X0 + K * (i * PANEL + 0.27 * PANEL) + PER_M * x, ORIGIN + (PER_M * perp) / 2 - PER_M * y];
	const sides = [
		{ T: panel(0), body: [par, perp], what: 'the pixel\'s frame' },
		{ T: panel(1), body: [GAMMA * par, perp], what: 'the body\'s frame' }
	];
	check(near(sides[1].body[0], 1.5, 1e-15), 'the body\'s frame does not put the body at 1.5 m along x');

	for (const [i, { T, body, what }] of sides.entries()) {
		const o = T([0, 0]), q = T(body), corner = T([body[0], 0]);
		// ---- the pixel: twelve dots on a ring, turned by 15 degrees so that none lies on x, y or r
		for (let k = 0; k < 12; k++) {
			const t = ((15 + 30 * k) * Math.PI) / 180, p = [o[0] + RING * Math.cos(t), o[1] - RING * Math.sin(t)];
			S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${SPECK}" fill="${INK}"/>`, 3);
			S.mark([p], SPECK, `${what}: the pixel`);
		}
		// ---- the body
		S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${BODY}" fill="${MATTER}"/>`, 3);
		S.mark([q], BODY, `${what}: the body`);
		// ---- the parts, dashed: along x from the pixel to under the body, then up to the body
		const from = RING + SPECK + CLEAR;
		dashed(S, [o[0] + from, o[1]], corner, { color: DIM, width: THIN, dash: DASH, what: `${what}: the part along` });
		dashed(S, corner, [q[0], q[1] + BODY + CLEAR], { color: DIM, width: THIN, dash: DASH, what: `${what}: the part across` });
		// ---- the arrow from the pixel to the body, its length on the page the distance at one scale
		const d = Math.hypot(q[0] - o[0], q[1] - o[1]), u = [(q[0] - o[0]) / d, (q[1] - o[1]) / d];
		const want = i === 0 ? Math.hypot(par, perp) : rstar(R_BODY);
		check(near(d / PER_M, want, 1e-12), `${what}: the distance on the page is ${d / PER_M}`);
		S.arrow([o[0] + u[0] * from, o[1] + u[1] * from], [q[0] - u[0] * (BODY + CLEAR), q[1] - u[1] * (BODY + CLEAR)], { color: INK, width: VEC, head: VEC_HEAD, what: `${what}: the arrow` });
		const said = i === 0 ? 'r = 2.0\\ \\text{m}' : 'R_* = 2.19\\ \\text{m}';
		check(i === 0 ? (d / PER_M).toFixed(1) === '2.0' : (d / PER_M).toFixed(2) === '2.19', 'the printed distance');
		L.push(await beside(said, [(o[0] + q[0]) / 2, (o[1] + q[1]) / 2], [u[1], -u[0]], LABEL_GAP + 0.8, INK));
		// ---- the parts' names: under the part along, at the right of the part across
		const along = i === 0 ? 'r_\\parallel = 1.2\\ \\text{m}' : '\\gamma r_\\parallel = 1.5\\ \\text{m}';
		check(i === 0 ? par.toFixed(1) === '1.2' : (GAMMA * par).toFixed(1) === '1.5', 'the printed part along');
		L.push(await placed(along, (o[0] + corner[0]) / 2, o[1] + LABEL_GAP + 1.4, 0.5, 0, INK));
		L.push(await placed('r_\\perp = 1.6\\ \\text{m}', corner[0] + LABEL_GAP + 1.4, (corner[1] + q[1]) / 2, 0, 0.5, INK));
	}

	// ---- the body's velocity in the pixel's frame, along +x
	{
		const { T, body } = sides[0], q = T(body);
		const p = [q[0] + BODY + CLEAR, q[1]], e = [q[0] + BODY + CLEAR + V_LEN * PER_M, q[1]];
		S.arrow(p, e, { color: OBS, width: VEC, head: VEC_HEAD, what: 'the velocity' });
		L.push(await S.clear('v = 0.6c', (p[0] + e[0]) / 2, q[1] - LABEL_GAP - 1.4, 0.5, 1, [0, -1], { color: OBS }));
	}

	// ---- the titles, on one line over the panels, each centred over its pixel and body
	{
		const top = Math.min(...L.map((l) => l.box.t)) - 7;
		for (const [{ T, body }, title] of [[sides[0], "\\text{pixel's frame, at the pixel's now}"], [sides[1], "\\text{body's frame}"]]) {
			L.push(await placed(title, (T([0, 0])[0] + T(body)[0]) / 2, top, 0.5, 1, INK));
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
