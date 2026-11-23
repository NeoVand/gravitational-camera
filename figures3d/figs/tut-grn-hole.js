// The tutorial, chapter 2.4 (tutorial/outside/greens-functions.md), its first diagram: the region V of the proof that
// the Laplacian of 1/r is -4 pi times the delta function. In section: the shell between a small sphere of radius
// epsilon round the origin and a large sphere of radius L, tinted, with the small ball cut out of it; on the small
// sphere, six area elements dA, each pointing out of V, which there is toward the origin; the two radii, epsilon and
// L, drawn from the origin; the region named by the condition r > epsilon that the chapter's integral carries. In one
// neutral colour, the dA thin arrows (as the normals of chapter 2.1's figs/tut-lap-green.js).
// Exact: each dA stands on the small sphere and points along -x/r, toward the origin, which is out of V (asserted:
// a step along it leaves the tinted shell and enters the hole); the radii run from the origin to their spheres
// (asserted). Schematic: the ratio of the two radii (epsilon is drawn far from small, L far from large) and the
// arrows' length.
import { INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, n2 } from './tut-pot-lib.js';
import { TINT, EDGE } from './tut-gauss-lib.js';
import { ORIGIN_DOT } from './tut-vec-lib.js';

const name = 'tut-grn-hole';
const check = checker(name);

const RL = 122;                      // the large sphere's radius, points
const RE = 44;                       // the small sphere's radius, points
const ARROWS = [30, 90, 150, 210, 270, 330];   // where the dA stand, degrees from the right, anticlockwise
const LABELLED = 90;                 // the one that carries dA
const EPS_AT = 180, L_AT = 300;      // the radii's directions, degrees: between the dA, and not along one line
const ARROW = 16;                    // a dA's length, points
const ARROW_W = 0.5, ARROW_HEAD = 3.4;          // as tut-lap-green's normals
const STEP = 0.25;                   // the circles' sampling, points along the curve

export default async function () {
	const S = new Sheet(name);
	const at = (r, deg) => [ORIGIN + r * Math.cos((deg * Math.PI) / 180), ORIGIN - r * Math.sin((deg * Math.PI) / 180)];
	const ring = (r) => {
		const n = Math.ceil((2 * Math.PI * r) / STEP);
		return Array.from({ length: n }, (_, k) => at(r, (360 * k) / n));
	};
	const rd = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const outer = ring(RL), inner = ring(RE);

	// ---- the shell, tinted, with the small ball cut out
	S.raw(`<path d="${rd(outer)}${rd(inner)}" fill="${TINT}" fill-rule="evenodd"/>`, 0);
	S.path(outer, { color: INK, width: EDGE, layer: 1, closed: true, what: 'the large sphere' });
	S.path(inner, { color: INK, width: EDGE, layer: 1, closed: true, what: 'the small sphere' });
	/** Whether a figure point lies in the tinted shell. */
	const inV = ([x, y]) => { const r = Math.hypot(x - ORIGIN, y - ORIGIN); return r > RE && r < RL; };

	// ---- the origin and the two radii
	S.raw(`<circle cx="${ORIGIN}" cy="${ORIGIN}" r="${ORIGIN_DOT}" fill="${INK}"/>`, 3);
	S.mark([[ORIGIN, ORIGIN]], ORIGIN_DOT, 'the origin');
	const epsEnd = at(RE, EPS_AT), lEnd = at(RL, L_AT);
	S.path([[ORIGIN, ORIGIN], epsEnd], { color: INK, width: HAIR, layer: 2, what: 'the radius epsilon' });
	S.path([[ORIGIN, ORIGIN], lEnd], { color: INK, width: HAIR, layer: 2, what: 'the radius L' });
	check(near(Math.hypot(epsEnd[0] - ORIGIN, epsEnd[1] - ORIGIN), RE) && near(Math.hypot(lEnd[0] - ORIGIN, lEnd[1] - ORIGIN), RL), 'a radius does not reach its sphere');

	// ---- the dA, on the small sphere, toward the origin
	const arrows = {};
	for (const deg of ARROWS) {
		const p = at(RE, deg), q = at(RE - ARROW, deg);
		const u = [(q[0] - p[0]) / ARROW, (q[1] - p[1]) / ARROW];
		const xhat = [(p[0] - ORIGIN) / RE, (p[1] - ORIGIN) / RE];
		check(near(u[0], -xhat[0], 1e-12) && near(u[1], -xhat[1], 1e-12), `the dA at ${deg} does not point along -x/r`);
		check(inV([p[0] - 1.5 * u[0], p[1] - 1.5 * u[1]]) && !inV([p[0] + 1.5 * u[0], p[1] + 1.5 * u[1]]), `the dA at ${deg} does not point out of V`);
		arrows[deg] = S.arrow(p, q, { color: DIM, width: ARROW_W, head: ARROW_HEAD, layer: 2, what: `the dA at ${deg}` });
	}

	// ---- labels
	const L = [];
	L.push(await S.clear('\\varepsilon', ...at(RE / 2, EPS_AT), 0.5, 1, [0, -1]));
	// L beside its radius, on the side away from the dA, off the radius at right angles
	const lMid = at((RE + RL) / 2, L_AT), off = [Math.cos(((L_AT - 90) * Math.PI) / 180), -Math.sin(((L_AT - 90) * Math.PI) / 180)];
	L.push(await S.clear('L', ...lMid, off[0] > 0 ? 0 : 1, off[1] > 0 ? 0 : 1, off));
	L.push(await S.clear('r > \\varepsilon', ...at((RE + RL) / 2, 45), 0.5, 0.5, [1, 0]));
	// dA beside its arrow, on the right, level with the arrow's inner half (clear of the small sphere)
	const a = arrows[LABELLED];
	L.push(await S.clear('\\mathrm{d}\\boldsymbol{A}', a.A[0], a.A[1] + 0.68 * ARROW, 0, 0.5, [1, 0]));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
