// The tutorial, section 6.3 (tutorial/relativity/aberration.md), its fourth diagram: Appendix C's two frames. Two
// panels (one above the other on the site, side by side in the book), at one scale, with beta = 0.6 along x and n0
// at 60 degrees from x; the x axis is drawn turned 8 degrees up from the horizontal, so that the velocities point
// "right and slightly up" and "left and slightly down", as the comment asks. Above (left), "body's frame": the pixel as
// a small ring of twelve ink dots (section 6.1's) at the lower left, named "pixel", the body as a dot in matter's
// colour R* n0 from it, at the upper right, named "body"; from the pixel an arrow in the observer's colour along beta,
// named "c beta", two ink arrows along +-n0, named "+n0" and "-n0", and a thin dashed ink line on to the body, named
// "R* n0". Below (right), "pixel's
// frame": the pixel at rest at the lower left, the body at its present position r = R*(a/(gamma beta) beta^ + n_perp),
// closer along the motion by the factor gamma, with an arrow in the observer's colour from it, named "v = -c beta"; a
// thin dashed ink line from the pixel to it, named "r, present position" three quarters of the way along; the pixel
// and the body named as above; from the pixel the rest directions +-n0 again, thin faint grey arrows one unit long,
// named "+n0" and "-n0" in grey, so that the lean of p+ and p- from them toward v is seen in the one panel (solid, not
// dashed: +n0 runs 5 degrees from the dashed r); and the aberrated directions p+
// and p- (eq:proof-stars), arrows in the observer's colour, both leaning toward -beta, and their half sum, a short
// thick arrow named "v_perp/c", whose tip is the middle of a dotted chord between the tips of p+ and p-.
// Departures from the diagram's comment: on the site the panels are stacked at every width (as section 6.2's
// tut-vectors-gradient), so that the drawing is not shrunk on a phone; in the printed book (figureLayout 'book') they
// stand side by side, "body's frame" at the left and "pixel's frame" at the right, the two pixels on one level and
// each title centred over its panel, drawn 1.45 times larger (the arrows' and R*'s points per unit; the strokes,
// heads and labels unchanged) so that the pair fills more of the text width; the dotted chord between the tips of p+
// and p- is added, so that the half sum is seen to be one; the frame is turned by 8 degrees, as above.
// Exact: every direction (n0, beta, p+, p-, the half sum, r) and every length in units of c or of R*: the arrows
// p+ and p- and +-n0 are one unit long, c beta and v 0.6 units and the half sum |v_perp|/c = 0.545 units, at one
// scale; the body R* away in the body's frame and |r| = 0.954 R* in the pixel's (asserted here and in
// tut-aberration-lib.js). Schematic: the ring's and the dot's sizes, the scale of R* against that of the arrows.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, OBS, MATTER, BETA, GAMMA, frames, rad } from './tut-aberration-lib.js';

const name = 'tut-aberration-frames';
const check = checker(name);

const TURN = 8;                            // the x axis on the page, degrees above the horizontal
const BOOK = globalThis.figureLayout === 'book';
const SCALE = BOOK ? 1.45 : 1;             // the book's panels side by side, drawn larger to fill the text width
const UNIT = 50 * SCALE;                   // points per unit of the arrows (a unit vector; c for a velocity)
const RSTAR = 96 * SCALE;                  // points per R*
const RING = 3.4, SPECK = 0.55;            // the pixel (section 6.1's)
const BODY = 3;                            // the body's dot, radius
const CLEAR = 1.6;                         // the air between an arrow's foot and the pixel or the body
const THICK = 1.2, THICK_HEAD = 5.2;       // the half sum's stroke and head
const CHORD = 0.6, CHORD_STEP = 1.8;       // the dotted chord: its dots and their spacing
const APART = 20;                          // the site's: the air between the upper panel's ink and the lower's title
const BESIDE = 34;                         // the book's: the air between the left panel's ink and the right's
const TITLE = 18;                          // the air between a title and its panel's highest point
const GHOST = { width: 0.5, head: 3.4 };
const R_NAME = 0.75;                       // r's name, this far along it (clear of the faint +n0's name, under it)   // the rest directions +-n0 in the pixel's frame, faint

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const F = frames();
	const c = Math.cos(rad(TURN)), s = Math.sin(rad(TURN));
	/** The page offset of a frame vector (x along beta, y across it, y up), k points per unit. */
	const page = ([x, y], k) => [k * (x * c - y * s), -k * (x * s + y * c)];
	const plus = (p, d) => [p[0] + d[0], p[1] + d[1]];
	const unit = (d) => { const l = Math.hypot(...d); return [d[0] / l, d[1] / l]; };
	const ring = RING + SPECK;
	const rPage = page(F.r, RSTAR);

	/** One panel's drawing on the sheet S, its labels pushed to L, the pixel at o. */
	function tools(S) {
		function pixel(o, what) {
			for (let k = 0; k < 12; k++) {
				const t = ((15 + 30 * k) * Math.PI) / 180, p = [o[0] + RING * Math.cos(t), o[1] - RING * Math.sin(t)];
				S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${SPECK}" fill="${INK}"/>`, 3);
				S.mark([p], SPECK, `${what}: the pixel`);
			}
		}
		function body(q, what) {
			S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${BODY}" fill="${MATTER}"/>`, 3);
			S.mark([q], BODY, `${what}: the body`);
		}
		/** An arrow from the point o along the frame vector v (units), its foot `foot` points out; checks its length. */
		function ray(o, v, { color, width = VEC, head = VEC_HEAD, foot = ring + CLEAR, what }) {
			const d = page(v, UNIT), u = unit(d);
			const A = S.arrow(plus(o, [u[0] * foot, u[1] * foot]), plus(o, d), { color, width, head, what });
			check(near(Math.hypot(A.B[0] - o[0], A.B[1] - o[1]) / UNIT, Math.hypot(...v), 1e-12), `${what}: its length`);
			return { ...A, d, u };
		}
		/** A label beside the point q, moved out along the unit vector n until it clears every mark. */
		const off = (src, q, n, color) => S.clear(src, q[0] + n[0] * (LABEL_GAP + 1), q[1] + n[1] * (LABEL_GAP + 1), n[0] > 0.3 ? 0 : n[0] < -0.3 ? 1 : 0.5, n[1] > 0.3 ? 0 : n[1] < -0.3 ? 1 : 0.5, n, { color });
		return { pixel, body, ray, off };
	}

	// ================= the body's frame (above on the site, at the left in the book) =================
	async function bodyFrame(S, L, o1) {
		const { pixel, body, ray, off } = tools(S);
		pixel(o1, 'body\'s frame');
		const b1 = plus(o1, page(F.n0, RSTAR));
		body(b1, 'body\'s frame');
		check(near(Math.hypot(b1[0] - o1[0], b1[1] - o1[1]) / RSTAR, 1, 1e-12), 'the body is not R* away in its frame');
		const beta1 = ray(o1, [BETA, 0], { color: OBS, what: 'c beta' });
		const np = ray(o1, F.n0, { color: INK, what: '+n0' });
		const nm = ray(o1, [-F.n0[0], -F.n0[1]], { color: INK, what: '-n0' });
		// the dashed line on from the tip of +n0 to the body
		dashed(S, plus(np.B, [np.u[0] * (CLEAR + 0.6), np.u[1] * (CLEAR + 0.6)]), plus(b1, [-np.u[0] * (BODY + CLEAR), -np.u[1] * (BODY + CLEAR)]), { color: INK, width: THIN, dash: DASH, what: 'R* n0' });
		const right = [-np.u[1], np.u[0]];               // the normal to n0 on the side of beta
		check(right[0] > 0, 'the normal is not on beta\'s side');
		const m = plus(o1, [np.d[0] + (b1[0] - o1[0] - np.d[0]) / 2, np.d[1] + (b1[1] - o1[1] - np.d[1]) / 2]);
		L.push(await off('R_*\\,\\hat n_0', m, right, INK));
		L.push(await off('+\\hat n_0', plus(o1, [np.d[0] * 0.55, np.d[1] * 0.55]), [-right[0], -right[1]], INK));
		L.push(await off('-\\hat n_0', nm.B, nm.u, INK));
		L.push(await off('c\\boldsymbol\\beta', plus(o1, [beta1.d[0] * 0.55, beta1.d[1] * 0.55]), [-beta1.u[1], beta1.u[0]], OBS));
		L.push(await off('\\text{pixel}', o1, [-1, 0], DIM));
		L.push(await off('\\text{body}', b1, [1, 0], DIM));
		return { bottom: nm.B[1], top: b1[1] - BODY };
	}

	// ================= the pixel's frame (below on the site, at the right in the book) =================
	async function pixelFrame(S, L, o2) {
		const { pixel, body, ray, off } = tools(S);
		pixel(o2, 'pixel\'s frame');
		const b2 = plus(o2, rPage);
		body(b2, 'pixel\'s frame');
		check(near(Math.hypot(...rPage) / RSTAR, Math.hypot(...F.r), 1e-12) && Math.hypot(...F.r).toFixed(3) === '0.954', `|r| = ${Math.hypot(...F.r)} R*`);
		check(near(F.r[0] * GAMMA, F.n0[0], 1e-15) && near(F.r[1], F.n0[1], 1e-15), 'the body is not gamma closer along the motion');
		// the body's velocity, from it
		const vel = ray(b2, F.v, { color: OBS, foot: BODY + CLEAR, what: 'v' });
		// the dashed line from the pixel to the body
		const ru = unit(rPage);
		dashed(S, plus(o2, [ru[0] * (ring + CLEAR), ru[1] * (ring + CLEAR)]), plus(b2, [-ru[0] * (BODY + CLEAR), -ru[1] * (BODY + CLEAR)]), { color: INK, width: THIN, dash: DASH, what: 'r' });
		// the rest directions +-n0, faint, from the same pixel, so that the lean of p+ and p- from them is seen
		const gp = ray(o2, F.n0, { color: FAINT, width: GHOST.width, head: GHOST.head, what: 'the ghost +n0' });
		const gm = ray(o2, [-F.n0[0], -F.n0[1]], { color: FAINT, width: GHOST.width, head: GHOST.head, what: 'the ghost -n0' });
		// the two directions, the chord between their tips and the half sum
		const pp = ray(o2, F.plus, { color: OBS, what: 'p+' });
		const pm = ray(o2, F.minus, { color: OBS, what: 'p-' });
		{
			const a = pp.B, b = pm.B;
			S.dots(a, b, { color: DIM, clear0: 4, clear1: 4.5, what: 'the chord' });
			const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
			check(near(mid[0], o2[0] + page(F.half, UNIT)[0], 1e-9) && near(mid[1], o2[1] + page(F.half, UNIT)[1], 1e-9), 'the half sum does not end at the chord\'s middle');
		}
		const half = ray(o2, F.half, { color: OBS, width: THICK, head: THICK_HEAD, what: 'the half sum' });
		check(Math.hypot(...F.half).toFixed(3) === '0.545' && near(F.half[0], F.vPerp[0], 1e-15) && near(F.half[1], F.vPerp[1], 1e-15), 'the half sum is not v_perp/c');
		const n = [-ru[1], ru[0]];                        // the normal to r on the side away from p+
		L.push(await off('\\boldsymbol r,\\ \\text{present position}', plus(o2, [rPage[0] * R_NAME, rPage[1] * R_NAME]), n[0] > 0 ? n : [-n[0], -n[1]], INK));
		L.push(await off('\\boldsymbol v = -c\\boldsymbol\\beta', plus(b2, [vel.d[0] * 0.5, vel.d[1] * 0.5]), [0.14, -0.99], OBS));
		L.push(await off('\\hat p_+', pp.B, pp.u, OBS));
		L.push(await off('\\hat p_-', pm.B, pm.u, OBS));
		// the half sum's name beyond its tip, outside the chord
		L.push(await off('\\boldsymbol v_\\perp/c', half.B, half.u, OBS));
		// the rest directions' names beyond their tips, on the side away from p+ and p-
		L.push(await off('+\\hat n_0', gp.B, [1, 0], FAINT));
		L.push(await off('-\\hat n_0', gm.B, gm.u, FAINT));
		L.push(await off('\\text{pixel}', o2, [1, 0.35].map((v) => v / Math.hypot(1, 0.35)), DIM));
		L.push(await off('\\text{body}', b2, [1, 0], DIM));
	}

	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - 30;
	if (!BOOK) {
		const t1 = await placed("\\text{body's frame}", x0, ORIGIN - 260, 0.5, 0, INK);
		L.push(t1);
		const o1 = [x0, t1.box.b + TITLE - page(F.n0, RSTAR)[1]];
		const p1 = await bodyFrame(S, L, o1);
		const top1 = Math.max(...L.map((l) => l.box.b), p1.bottom);
		const t2 = await placed("\\text{pixel's frame}", x0, top1 + APART, 0.5, 0, INK);
		L.push(t2);
		await pixelFrame(S, L, [x0, t2.box.b + TITLE - rPage[1]]);
	} else {
		// side by side, the two pixels on one level and the two titles on one line, each centred over its panel's ink
		const TOP = ORIGIN - 160;
		const probe = await placed("\\text{body's frame}", 0, TOP, 0.5, 0, INK);
		const y = probe.box.b + TITLE + Math.max(-page(F.n0, RSTAR)[1], -rPage[1]);
		/** The horizontal extent of a sheet's marks and labels. */
		const span = (T, LT) => [Math.min(...LT.map((l) => l.box.l), ...T.marks.flatMap((m) => m.pts.map((p) => p[0] - m.r))),
			Math.max(...LT.map((l) => l.box.r), ...T.marks.flatMap((m) => m.pts.map((p) => p[0] + m.r)))];
		const o1 = [ORIGIN - 200, y];
		await bodyFrame(S, L, o1);
		const s1 = span(S, L);
		// the right panel's extent from its pixel, measured on a sheet that is thrown away
		const T = new Sheet(name), LT = [];
		await pixelFrame(T, LT, [ORIGIN, y]);
		const s2 = span(T, LT).map((x) => x - ORIGIN);
		const o2 = [s1[1] + BESIDE - s2[0], y];
		await pixelFrame(S, L, o2);
		L.push(await placed("\\text{body's frame}", (s1[0] + s1[1]) / 2, TOP, 0.5, 0, INK));
		L.push(await placed("\\text{pixel's frame}", o2[0] + (s2[0] + s2[1]) / 2, TOP, 0.5, 0, INK));
	}
	check(BETA === 0.6 && near(F.a, 0.3, 1e-15), 'beta and a');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, a: F.a, half: F.half };
	return finish(S, L, BOOK ? [280, 400] : [130, 300]);
}
