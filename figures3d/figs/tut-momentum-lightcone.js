// The tutorial, section 6.4 (tutorial/relativity/energy-and-momentum.md), its third diagram: light-cone components.
// One panel, units of mc at one scale on both axes. The ordinary axes, p_z across from -2.4 to 2.4 and E/c upward
// from 0 to 2.6, thin and faint, named "p_z" and "E/c". Over them the light-cone axes, two thick ink arrows at 45
// degrees from the origin: along (p_z, E/c) ~ (-1, 1), named "q = E/c - p_z", and along (1, 1), named "E/c + p_z";
// these are also the light lines, so beyond the arrows' heads they run on, dashed in the light role's colour, to the
// panel's edges. The mass shell with p_perp = 0, the upper branch of (E/c)^2 - p_z^2 = m^2 c^2, a thin stroke in
// matter's colour, from corner to corner; in the new axes the rectangular hyperbola q (E/c + p_z) = m^2 c^2. Three
// dots on it in matter's colour: at rest (0, 1), named "rest, q = mc"; at 0.6c along +z (0.75, 1.25), named
// "0.6c, q = mc/2"; at 0.6c along -z (-0.75, 1.25), named "q = 2mc". From the dot at 0.6c along +z, two thin dotted
// lines parallel to the light-cone axes down to each axis, where "x2" stands on the E/c + p_z axis and "x1/2" on the
// q axis. A curved arrow in the observer's colour beside the hyperbola from the rest dot to the dot at 0.6c, named
// "boost, eta = ln 2".
// Departures from the diagram's comment: the panel is not square, since at one scale on both axes the comment's
// ranges, 4.8 across and 2.6 upward, make it 1.85 times as wide as tall. Each light-cone axis carries two ticks,
// outward from it so that the dotted lines meet the axis and not a tick: at the rest dot's value, mc, named so, and at
// the foot of the dotted line, named x2 or x1/2, so that the factors are read from the rest dot's values; each name
// stands level with its tick, away from the cone. The light-cone axes are thick ink up to their heads at 3.2 mc and
// dashed in the light role's colour beyond, out to the panel's edge: the "first quadrant of the new axes" is the
// region above both lines, so within the panel the two rays are its edges, and the dashed part is where each leaves
// the stretch used as an axis. The names of the rest dot and the dot at 0.6c along +z stand in two lines, the first in the bowl under the
// hyperbola's vertex, the second above its dot, over the boost's name; "q = 2mc" stands above its dot. These are the
// only places near each dot that no line crosses. The boost's name stands in two lines right of the E/c axis. The
// boost's arrow runs 4.5 points outside the hyperbola, not on it, so that both can be seen.
// Exact: the light-cone axes at 45 degrees on the page (asserted), the hyperbola (sampled so that no two neighbouring
// points are more than a quarter of a point apart, every point asserted on it and on q (E/c + p_z) = 1), the dots on
// it, the dotted lines parallel to the axes and their feet at E/c + p_z = 2 and q = 1/2 (asserted, and in
// tut-momentum-lib.js against e^{+-ln 2}). The boost's arrow is schematic in its offset only.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { graph, longest, THIN } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, OBS, LIGHT, MATTER, shell, REST, ALONG, AGAINST, q, qbar, fromCone, ETA, BETA } from './tut-momentum-lib.js';

const name = 'tut-momentum-lightcone';
const check = checker(name);

const U = 54;                              // points per unit of mc
const X = 2.4, TOP = 2.6;                  // p_z from -X to X, E/c from 0 to TOP
const REACH = 3.2;                         // the light-cone axes' heads, in their own values (mc)
const POINT = DOT + 0.35;                  // a dot, radius (section 6.1's)
const CLEAR = 2.2;                         // the dotted lines start this far from the dot
const OFF = 4.5;                           // the boost's arrow, outside the hyperbola
const OUT_TICK = 3.6;                      // a tick on a light-cone axis, outward from it
const LINE_SKIP = 1.6;                     // between the two lines of a name

/** The lines `srcs` of one name, aligned by `ax` (0 left, 0.5 centre, 1 right), their joint box with its point (ax, ay)
 * at (x, y), then moved along `dir` as Sheet.clear moves one label, until the whole name clears every mark. */
async function lines(S, srcs, x, y, ax, ay, dir, color, others = []) {
	const set = async (dx, dy) => {
		const parts = [];
		for (const src of srcs) parts.push(await placed(src, 0, 0, ax, 0, color));
		// stack them, each LINE_SKIP under the last, aligned at x = 0
		let top = 0;
		const moved = [];
		for (const p of parts) { moved.push({ ...p, dy: top - p.box.t }); top += p.box.b - p.box.t + LINE_SKIP; }
		const H = top - LINE_SKIP;
		const W = Math.max(...parts.map((p) => p.box.r - p.box.l));
		const ox = x + dx, oy = y + dy - ay * H;
		const svg = moved.map((p) => `<g transform="translate(${(ox).toFixed(2)},${(oy + p.dy).toFixed(2)})">${p.svg}</g>`).join('');
		const l = ox - ax * W;
		return { src: srcs.join(' '), svg, box: { l, r: l + W, t: oy, b: oy + H } };
	};
	for (let s = 0; s < 60; s += 0.05) {
		const c = await set(dir[0] * s, dir[1] * s);
		const apart = others.every((o) => c.box.r + LABEL_GAP <= o.box.l || o.box.r + LABEL_GAP <= c.box.l || c.box.b + LABEL_GAP <= o.box.t || o.box.b + LABEL_GAP <= c.box.t);
		if (apart && S.clearance(c.box).d >= LABEL_GAP + 0.2) return c;
	}
	throw new Error(`${S.name}: no room for the name ${srcs.join(' ')}`);
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - X * U, top: ORIGIN - (TOP * U) / 2, w: 2 * X * U, h: TOP * U, x0: -X, x1: X, y0: 0, y1: TOP });
	const at = ([p, e]) => P.at(p, e);
	const o = at([0, 0]);

	// ---- the ordinary axes, thin and faint
	const pA = S.arrow(at([-X, 0]), at([X, 0]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the p_z axis' });
	const eA = S.arrow(o, at([0, TOP]), { color: FAINT, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the E/c axis' });
	L.push(await placed('p_z', pA.B[0] - 1, pA.B[1] - LABEL_GAP - 2.5, 1, 1, DIM));
	L.push(await placed('E/c', eA.B[0] + LABEL_GAP + 2, eA.B[1] + 1, 0, 0, DIM));

	// ---- the light-cone axes, thick ink to REACH, then the light lines dashed to the panel's edge
	const cone = {};
	for (const [key, s] of [['qbar', 1], ['q', -1]]) {
		// q = 0 along (1, 1): the axis of E/c + p_z; E/c + p_z = 0 along (-1, 1): the axis of q
		const head = s > 0 ? fromCone(0, REACH) : fromCone(REACH, 0);
		check(near(Math.abs(head[0]), REACH / 2, 1e-15) && near(head[1], REACH / 2, 1e-15), 'a head is off its axis');
		const A = S.arrow(o, at(head), { color: INK, width: VEC, head: VEC_HEAD, layer: 2.2, what: `the ${key} axis` });
		check(near(Math.abs(A.B[0] - o[0]), o[1] - A.B[1], 1e-9), 'a light-cone axis is not at 45 degrees');
		dashed(S, [A.B[0] + s * 1.2 / Math.SQRT2, A.B[1] - 1.2 / Math.SQRT2], at([s * X, X]), { color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: `the light line ${s}` });
		cone[key] = A;
	}
	/** The page point of the value v along a light-cone axis. */
	const onQ = (v) => at(fromCone(v, 0)), onQbar = (v) => at(fromCone(0, v));
	/** A tick across the axis at the page point c. */
	const tick = (c, s, what) => {
		const n = [s / Math.SQRT2, 1 / Math.SQRT2];    // across the axis, outward (down and away from the cone)
		// outward only, so that a dotted line arriving from inside the cone meets the axis, not the tick
		S.path([[c[0], c[1]], [c[0] + n[0] * OUT_TICK, c[1] + n[1] * OUT_TICK]], { color: INK, width: HAIR, cap: 'butt', layer: 2.3, what });
		return n;
	};

	// ---- the mass shell, from corner to corner
	check(near(shell(X), TOP, 1e-15), `the hyperbola does not reach the corners: ${shell(X)}`);
	const curve = graph(P, shell, -X, X);
	check(longest(curve) <= 0.2501, 'the hyperbola is coarse');
	for (const [px, py] of curve) {
		const p = (px - P.left) / U - X, e = (P.bottom - py) / U;
		check(near(e * e - p * p, 1, 1e-9) && near(q([p, e]) * qbar([p, e]), 1, 1e-9), 'a point of the hyperbola is off it');
	}
	S.path(curve, { color: MATTER, width: LINE, layer: 2, cap: 'butt', what: 'the hyperbola' });

	// ---- the dotted lines from the dot at 0.6c along +z, parallel to the axes, to their feet
	const footBar = fromCone(0, qbar(ALONG)), footQ = fromCone(q(ALONG), 0);
	check(near(footBar[0], 1, 1e-15) && near(footBar[1], 1, 1e-15) && near(footQ[0], -0.25, 1e-15) && near(footQ[1], 0.25, 1e-15), 'the feet are not at (1, 1) and (-0.25, 0.25)');
	// parallel: the first keeps E/c + p_z (runs along the q axis), the second keeps q
	check(near(qbar(footBar), qbar(ALONG), 1e-15) && near(q(footQ), q(ALONG), 1e-15), 'a dotted line is not parallel to its axis');
	const m = at(ALONG);
	S.dots(m, at(footBar), { color: DIM, clear0: CLEAR, clear1: VEC / 2 + 0.8, layer: 1.5, what: 'the dotted line to E/c + p_z' });
	S.dots(m, at(footQ), { color: DIM, clear0: CLEAR, clear1: VEC / 2 + 0.8, layer: 1.5, what: 'the dotted line to q' });

	// ---- the ticks: the rest dot's values and the feet
	{
		const nb = tick(onQbar(qbar(REST)), 1, 'the tick at mc on E/c + p_z');
		tick(onQbar(qbar(ALONG)), 1, 'the tick at 2mc on E/c + p_z');
		const nq = tick(onQ(q(REST)), -1, 'the tick at mc on q');
		tick(onQ(q(ALONG)), -1, 'the tick at mc/2 on q');
		// each name level with its tick's outer end, beside it, away from the cone
		const off = (c, n, src, color) => {
			const e = [c[0] + n[0] * OUT_TICK, c[1] + n[1] * OUT_TICK], s = Math.sign(n[0]);
			return S.clear(src, e[0] + s * (LABEL_GAP + 0.4), e[1], s > 0 ? 0 : 1, 0.5, [s, 0], { color });
		};
		L.push(await off(onQbar(qbar(REST)), nb, 'mc', DIM));
		// the factors, from the components: e^{+-eta} = 2 and 1/2
		check(qbar(ALONG) / qbar(REST) === 2 && q(ALONG) / q(REST) === 0.5, 'the factors are not 2 and 1/2');
		L.push(await off(onQbar(qbar(ALONG)), nb, '\\times 2', INK));
		L.push(await off(onQ(q(REST)), nq, 'mc', DIM));
		L.push(await off(onQ(q(ALONG)), nq, '\\times \\tfrac12', INK));
	}

	// ---- the boost: an arrow OFF outside the hyperbola from the rest dot to the dot at 0.6c
	{
		const pts = graph(P, shell, REST[0], ALONG[0], 0.1);
		const out = pts.map((c, i) => {
			const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
			const t = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...t);
			return [c[0] + (t[1] / l) * OFF, c[1] - (t[0] / l) * OFF];     // the normal to the upper left
		});
		// trim the ends: start clear of the rest dot, end with the head clear of the dot at 0.6c
		const r = at(REST);
		const from = out.findIndex((c) => Math.hypot(c[0] - r[0], c[1] - r[1]) >= POINT + 4.8);
		let to = out.length - 1;
		while (Math.hypot(out[to][0] - m[0], out[to][1] - m[1]) < POINT + 4.8) to--;
		let back = to;
		while (Math.hypot(out[back][0] - out[to][0], out[back][1] - out[to][1]) < VEC_HEAD + 1.2) back--;
		const body = out.slice(from, back + 1);
		S.path(body, { color: OBS, width: VEC, layer: 3, cap: 'butt', what: 'the boost' });
		S.arrow(out[back - 3], out[to], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the boost\'s head' });
		for (const c of body) {
			const p = (c[0] - P.left) / U - X, e = (P.bottom - c[1]) / U;
			check(e > shell(p) && near((e - shell(p)) * U * Math.cos(Math.atan(p / shell(p))), OFF, 0.06), 'the boost is not 4.5 points outside the hyperbola');
		}
		const eAxis = o[0] + AXIS / 2 + LABEL_GAP + 0.6;
		check(near(ETA, Math.log(2), 1e-15), 'eta is not ln 2');
		// right of the E/c axis, over the arrow's first half
		L.push(await lines(S, ['\\text{boost,}', '\\eta = \\ln 2'], eAxis, body[0][1] - LABEL_GAP, 0, 1, [0, -1], OBS));
	}

	// ---- the dots, then their names
	for (const [p, what] of [[REST, 'the rest dot'], [ALONG, 'the dot along +z'], [AGAINST, 'the dot along -z']]) {
		const c = at(p);
		check(near(shell(p[0]), p[1], 1e-15), `${what} is off the hyperbola`);
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${POINT}" fill="${MATTER}"/>`, 4);
		S.mark([c], POINT, what);
	}
	// the names' q, mc, mc/2 and 2mc, from the components
	check(q(REST) === 1 && q(ALONG) === 0.5 && q(AGAINST) === 2 && BETA === 0.6, 'the names\' q and speed');
	{
		// the rest dot's: in the bowl under the vertex, left of the E/c axis
		const r = at(REST);
		L.push(await lines(S, ['\\text{rest,}', 'q = mc'], r[0] - LABEL_GAP - 1, r[1] + POINT + LABEL_GAP + 0.3, 1, 0, [0, 1], MATTER));
		// the others above their dots, clear of the curve and the boost
		const g = at(AGAINST);
		L.push(await lines(S, ['q = 2mc'], g[0], g[1] - POINT - LABEL_GAP, 0.5, 1, [0, -1], MATTER));
		L.push(await lines(S, ['0.6c,', 'q = mc/2'], m[0], m[1] - POINT - LABEL_GAP, 0.5, 1, [0, -1], MATTER, L));
	}
	// the axes' names, beside their heads, outside the cone
	L.push(await S.clear('E/c + p_z', cone.qbar.B[0] + 2, cone.qbar.B[1] + LABEL_GAP, 0, 0, [0.7071, 0.7071], { color: INK }));
	L.push(await S.clear('q = E/c - p_z', cone.q.B[0] - 2, cone.q.B[1] + LABEL_GAP, 1, 0, [-0.7071, 0.7071], { color: INK }));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 320]);
}
