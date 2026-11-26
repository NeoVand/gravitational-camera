// The tutorial, section 6.3 (tutorial/relativity/aberration.md), its second diagram: where a moving body is now, and
// where its light left it. One panel, 112 points to the closest distance b, the pixel's frame, x across and y up. The
// pixel P as a small ring of twelve ink dots (section 6.1's pixel) at the origin, named "pixel" under it. The body's
// straight path, a thin ink line at the height b, ending in a short arrow in the observer's colour named "v = 0.6c".
// The present position, a filled dot in matter's colour at (0, b), named "now"; the retarded position, an open circle
// in matter's colour at (-0.75 b, b), named "where the light left". The light, an arrow in the light role's colour
// from the open circle to P, named "light, travel time 1.25 b/c" outside the triangle; a thin dashed ink line from P up
// to the filled dot. A dimension line over the path between the two dots, named "gamma beta b = 0.75 b", and one at the
// right of the dashed line, from the pixel's height up to the path (which ends it, so it has a tick at its foot only),
// named "b". The angle delta at P between the two lines, an arc named "delta = 36.9 degrees".
// Departures from the diagram's comment: the light is drawn as an arrow, not a line, so that it is seen to run from
// the body to the pixel; the body's velocity is an arrow in the observer's colour that continues the ink path (chapter
// 6.1's tut-lorentz-rstar colours a body's v so, and the chapter colours v so in its text); the ring is named "pixel".
// Exact: the two places, (0, b) and (-gamma beta b, b) = (-0.75 b, b), the light's path of length gamma b = 1.25 b on
// the page (asserted, with c^2 dt^2 = b^2 + v^2 dt^2, in tut-aberration-lib.js), the angle arctan 0.75 = 36.9 degrees.
// Schematic: the ring's and the dots' sizes, the arc's radius, the length of the velocity's arrow (a direction).
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, AXIS, VEC, VEC_HEAD, HAIR, TICK } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { measure } from './tut-rad-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, OBS, LIGHT, MATTER, BETA, GAMMA, BEHIND, DELAY } from './tut-aberration-lib.js';

const name = 'tut-aberration-retarded';
const check = checker(name);

const B = 112;                             // points per b
const RING = 3.4, SPECK = 0.55;            // the pixel: its ring's radius and its dots' (section 6.1's)
const BODY = 3;                            // the body's dots, radius
const OPEN = 0.7;                          // the open circle's stroke
const CLEAR = 1.6;                         // the air between a line's end and the pixel or a body
const PATH = [-1.15, 0.5];                // the ink path, units of b
const V = [0.5, 0.85];                     // the velocity's arrow along the path, units of b
const OVER = 10;                           // the dimension line over the path, points
const RIGHT_OF = 11;                       // the dimension line b, points right of the dashed line
const ARC_R = 48, ARC = 0.5;               // the arc of delta: radius and stroke, points

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const o = [ORIGIN, ORIGIN + B / 2];
	const at = ([x, y]) => [o[0] + B * x, o[1] - B * y];
	const now = at([0, 1]), was = at([-BEHIND, 1]);
	check(near(BEHIND, GAMMA * BETA, 1e-15) && near(BEHIND, 0.75, 1e-15), 'the retarded position is not 0.75 b back');

	// ---- the pixel
	for (let k = 0; k < 12; k++) {
		const t = ((15 + 30 * k) * Math.PI) / 180, p = [o[0] + RING * Math.cos(t), o[1] - RING * Math.sin(t)];
		S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${SPECK}" fill="${INK}"/>`, 3);
		S.mark([p], SPECK, 'the pixel');
	}
	const ring = RING + SPECK;

	// ---- the path and the velocity
	S.path([at([PATH[0], 1]), at([PATH[1], 1])], { color: INK, width: AXIS, layer: 1, cap: 'butt', what: 'the path' });
	const v = S.arrow(at([V[0], 1]), at([V[1], 1]), { color: OBS, width: VEC, head: VEC_HEAD, what: 'the velocity' });

	// ---- the two places: now filled, where the light left open (filled with the page, so that the path stops at it)
	S.raw(`<circle cx="${now[0]}" cy="${now[1]}" r="${BODY}" fill="${MATTER}"/>`, 3);
	S.mark([now], BODY, 'now');
	S.raw(`<circle cx="${was[0]}" cy="${was[1]}" r="${BODY - OPEN / 2}" fill="${PAGE}" stroke="${MATTER}" stroke-width="${OPEN}"/>`, 3);
	S.mark([was], BODY, 'where the light left');

	// ---- the light, from the open circle to P, and the dashed line from P up to the filled dot
	const d = Math.hypot(was[0] - o[0], was[1] - o[1]), u = [(o[0] - was[0]) / d, (o[1] - was[1]) / d];
	check(near(d / B, DELAY, 1e-12) && near(DELAY, 1.25, 1e-15), `the light's path on the page is ${d / B} b`);
	const light = S.arrow([was[0] + u[0] * (BODY + CLEAR), was[1] + u[1] * (BODY + CLEAR)], [o[0] - u[0] * (ring + CLEAR), o[1] - u[1] * (ring + CLEAR)], { color: LIGHT, width: THIN + 0.1, head: VEC_HEAD, what: 'the light' });
	dashed(S, [o[0], o[1] - ring - CLEAR], [now[0], now[1] + BODY + CLEAR], { color: INK, width: THIN, dash: DASH, what: 'the line to now' });

	// ---- the angle delta at P, from the vertical to the light
	const delta = Math.atan2(o[0] - was[0], o[1] - was[1]);
	check((delta * 180 / Math.PI).toFixed(1) === '36.9' && near(delta * 180 / Math.PI, nums.delta, 1e-12), `delta on the page ${delta}`);
	{
		const n = 60, pts = Array.from({ length: n + 1 }, (_, i) => { const t = (delta * i) / n; return [o[0] - ARC_R * Math.sin(t), o[1] - ARC_R * Math.cos(t)]; });
		S.path(pts, { color: DIM, width: ARC, what: 'the arc of delta' });
		const w = delta / 2;
		L.push(await S.clear('\\delta = 36.9^\\circ', o[0] - (ARC_R + 8) * Math.sin(w), o[1] - (ARC_R + 8) * Math.cos(w), 0.5, 0.5, [-Math.sin(w), -Math.cos(w)]));
	}

	// ---- the dimension lines: 0.75 b over the path, b at the right of the dashed line
	measure(S, [was[0], was[1] - OVER], [now[0], now[1] - OVER], { color: DIM, what: 'gamma beta b' });
	L.push(await placed('\\gamma\\beta\\, b = 0.75\\, b', (was[0] + now[0]) / 2, now[1] - OVER - LABEL_GAP - 3, 0.5, 1, INK));
	// b: from the pixel's height up to the path, which ends it; a tick at its foot only, since one at its top would lie
	// along the path
	S.path([[o[0] + RIGHT_OF, o[1]], [now[0] + RIGHT_OF, now[1] + AXIS / 2]], { color: DIM, width: HAIR + 0.1, cap: 'butt', what: 'b' });
	S.path([[o[0] + RIGHT_OF - TICK, o[1]], [o[0] + RIGHT_OF + TICK, o[1]]], { color: DIM, width: HAIR + 0.1, cap: 'butt', what: 'b\'s foot' });
	L.push(await placed('b', o[0] + RIGHT_OF + LABEL_GAP + 3, (o[1] + now[1]) / 2, 0, 0.5, INK));

	// ---- the names
	L.push(await S.clear('\\text{now}', now[0] + BODY + LABEL_GAP + 3, now[1] - LABEL_GAP - 1, 0, 1, [1, 0], { color: INK }));
	L.push(await S.clear('\\text{where the light left}', was[0] - BODY - LABEL_GAP - 3, was[1] - LABEL_GAP - 1, 1, 1, [-1, 0], { color: INK }));
	L.push(await placed('v = 0.6c', (v.A[0] + v.B[0]) / 2 - 3, v.A[1] - LABEL_GAP - 1.4, 0.5, 1, OBS));
	L.push(await placed('\\text{pixel}', o[0], o[1] + ring + LABEL_GAP + 1.2, 0.5, 0, INK));
	{
		// outside the triangle: the normal to the light pointing down and to the left
		const n = [-u[1], u[0]];
		check(n[0] < 0 && n[1] > 0, 'the light\'s name is not outside the triangle');
		const m = [(light.A[0] + light.B[0]) / 2, (light.A[1] + light.B[1]) / 2];
		L.push(await beside('\\text{light, travel time } 1.25\\, b/c', m, n, LABEL_GAP + 0.6, LIGHT));
	}
	check(DELAY.toFixed(2) === '1.25' && BEHIND.toFixed(2) === '0.75', 'the printed numbers');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [200, 320]);
}
