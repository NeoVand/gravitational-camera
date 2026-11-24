// The tutorial, chapter 13.2 (tutorial/what-a-field-keeps/calderon.md), its third diagram: the ellipse of pairs of
// tides and the point they reach. Two panels on one scale, their horizontal axes on one line. Left, the plane of
// wavevectors across the camera, axes k_x and k_y in m^-1: the foci 0 and K = (1.1, 1.3) as dots, the ellipse
// |k| + |K - k| = 2.28 drawn exactly (semi-axes 1.141 and 0.760, the long axis along K), the text's pair as two arrows,
// k = (1.3, 0.4) from the origin and k' = K - k from its tip to K, and one other pair, pale, at a point of the ellipse
// on the other side of K. Right, the half-plane (K, kappa), kappa upward: the cone's
// line kappa = K, the region above it (the inside of the cone) shaded, the point (1.70, 2.28) marked, and on the cone's
// line the point (1.70, 1.70) with the note "the ellipse becomes a segment", a dotted line joining the two.
// Departures from the diagram's comment: the cone's line is ink and the inside a neutral grey shade, not the blue
// outline and orange inside of the paper's fig:two-readings, because in the tutorial orange and blue mean a stretch
// and a squeeze (tut-calderon-lib.js). The line is named "kappa = K"; the two points are joined by a dotted line at
// the same K, so that the shrinking is read at one K.
// Exact: the ellipse, the foci, both pairs, the cone's line, the points; the scales are equal, so the cone's line is
// at 45 degrees. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, beside, n2, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { TINT } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { text } from '../stone.js';
import { chapter, V, KV, KMOD, KAPPA, k1, onEllipse, T2, near } from './tut-calderon-lib.js';

const name = 'tut-cone-ellipse';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const S1 = 50;                         // points per m^-1, both panels
const LEFT = { x: [-0.62, 1.92], y: [-0.55, 2.62] };      // the left panel's axes, m^-1
const RIGHT = { K: 2.62, kap: 2.62 };                     // the right panel's axes, m^-1
const GAP = 20;                        // from the left panel's k_x name to the right panel's origin
const DOT_R = 1.35;                    // a focus, a point
const PALE_W = 0.5;                    // the pale pair
const ELL_W = 0.6;                     // the ellipse and the cone's line
const caption = 'Look first at the ellipse on the left: every wavevector $\\vect k$ on it, paired with $\\vect K - \\vect k$, reaches the same point of the transform, marked on the right inside the cone. On the cone itself the ellipse shrinks to the segment from $0$ to $\\vect K$. The two pairs drawn are examples.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'cone-ellipse', caption);
	const S = new Sheet(name);
	const L = [];
	const dot = (p, what, r = DOT_R, color = INK) => {
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${r}" fill="${color}"/>`, 4);
		S.mark([p], r, what);
	};

	// ---- left: the plane of k
	const OA = [ORIGIN - 160, ORIGIN];
	const A = ([x, y]) => [OA[0] + S1 * x, OA[1] - S1 * y];
	S.arrow(A([LEFT.x[0], 0]), A([LEFT.x[1], 0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the k_x axis' });
	S.arrow(A([0, LEFT.y[0]]), A([0, LEFT.y[1]]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the k_y axis' });
	L.push(await placed('k_x\\ (\\mathrm{m^{-1}})', A([LEFT.x[1], 0])[0] + LABEL_GAP + 0.4, OA[1], 0, 0.5, DIM));
	L.push(await placed('k_y\\ (\\mathrm{m^{-1}})', OA[0] + AXIS_HEAD * 0.36 + LABEL_GAP + 0.4, A([0, LEFT.y[1]])[1], 0, 0.5, DIM));
	// no ticks here: the ellipse crosses both axes near 1; the scale is the right panel's

	// the ellipse, exactly
	const ell = Array.from({ length: 721 }, (_, i) => A(onEllipse((i * Math.PI) / 360)));
	S.path(ell, { color: INK, width: ELL_W, layer: 2, closed: true, what: 'the ellipse' });
	// the foci
	dot(A([0, 0]), 'the focus 0');
	dot(A(KV), 'the focus K');
	// arrows that end at K stop short of its dot
	const SHORT = DOT_R + 0.8;
	const short = (a, b) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [b[0] - ((b[0] - a[0]) * SHORT) / d, b[1] - ((b[1] - a[1]) * SHORT) / d]; };
	const from0 = (b) => { const a = A([0, 0]), d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + ((b[0] - a[0]) * SHORT) / d, a[1] + ((b[1] - a[1]) * SHORT) / d]; };
	// the pale pair, under the other
	const k2 = onEllipse(T2);
	check(near(Math.hypot(...k2) + Math.hypot(KV[0] - k2[0], KV[1] - k2[1]), KAPPA, 1e-12), 'the pale pair');
	S.arrow(from0(A(k2)), A(k2), { color: FAINT, width: PALE_W, head: 3.6, layer: 2.5, what: 'the pale k' });
	S.arrow(A(k2), short(A(k2), A(KV)), { color: FAINT, width: PALE_W, head: 3.6, layer: 2.5, what: 'the pale k\'' });
	// the text's pair
	const a1 = S.arrow(from0(A(k1)), A(k1), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'k' });
	const a2 = S.arrow(A(k1), short(A(k1), A(KV)), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'k\'' });
	check(near(Math.hypot(...k1) + Math.hypot(KV[0] - k1[0], KV[1] - k1[1]), KAPPA, 1e-15), 'k is on the ellipse');
	const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
	const normal = (u, s = 1) => [s * u[1], -s * u[0]];         // a quarter turn of the page direction u
	L.push(await beside('\\mathbf k', mid(a1.A, a1.B), normal(a1.u, 1), LABEL_GAP + 0.6));
	L.push(await beside('\\mathbf k\'', mid(a2.A, a2.B), normal(a2.u, -1), LABEL_GAP + 0.6));
	L.push(await S.clear('0', OA[0] - 2.2, OA[1] + 2.2, 1, 0, [-0.7071, 0.7071], { color: DIM }));
	// K: beside its focus, across the long axis on the side away from k', where the ellipse is b^2/a away
	L.push(await beside('\\mathbf K', A(KV), [V[0], -V[1]], DOT_R + LABEL_GAP + 0.4));

	// ---- right: the half-plane (K, kappa)
	const OB = [L[0].box.r + GAP, OA[1]];
	const B = ([K, kap]) => [OB[0] + S1 * K, OB[1] - S1 * kap];
	// the inside of the cone, shaded, up to the top of the panel
	const top = 2.42;
	{
		const poly = [B([0, 0]), B([top, top]), B([0, top])];
		S.fill('M' + poly.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z', { l: poly[0][0], r: poly[1][0], t: poly[1][1], b: poly[0][1] }, { color: TINT, layer: 0.5, what: 'the inside', solid: false });
	}
	S.arrow(B([0, 0]), B([RIGHT.K, 0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the K axis' });
	S.arrow(B([0, 0]), B([0, RIGHT.kap]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the kappa axis' });
	L.push(await placed('K\\ (\\mathrm{m^{-1}})', B([RIGHT.K, 0])[0] + LABEL_GAP + 0.4, OB[1], 0, 0.5, DIM));
	L.push(await placed('\\kappa\\ (\\mathrm{m^{-1}})', OB[0] + AXIS_HEAD * 0.36 + LABEL_GAP + 0.4, B([0, RIGHT.kap])[1], 0, 0.5, DIM));
	for (const t of [1, 2]) {
		S.path([B([t, 0]), [B([t, 0])[0], OB[1] + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick K = ${t}` });
		L.push(await placed(String(t), B([t, 0])[0], OB[1] + TICK + 2.4, 0.5, 0, DIM));
	}
	// the cone's line, at 45 degrees since the scales are equal
	const cone = [B([0, 0]), B([top, top])];
	check(near(cone[1][0] - cone[0][0], cone[0][1] - cone[1][1], 1e-9), 'the cone\'s line is not at 45 degrees');
	S.path(cone, { color: INK, width: ELL_W, cap: 'butt', layer: 2, what: 'the cone' });
	L.push(await S.clear('\\kappa = K', cone[1][0] + 1.5, cone[1][1] + 3, 0, 0, [1, 0]));
	// the point inside, the point on the cone at the same K, and the dotted line between them
	const P2 = B([KMOD, KAPPA]), P1 = B([KMOD, KMOD]);
	S.dots(P1, P2, { color: DIM, clear0: DOT_R + 1.3, clear1: DOT_R + 1.3, layer: 2, what: 'the same K' });
	dot(P2, 'the point (K, kappa)');
	dot(P1, 'the point on the cone');
	const v = await placed(`(${KMOD.toFixed(2)},\\ ${KAPPA.toFixed(2)})`, P2[0] - DOT_R - LABEL_GAP - 0.6, P2[1], 1, 0.5);
	v.on = ['the inside'];
	L.push(v);
	// the note, in two lines, below the cone's line to the right of its point
	L.push(await placed('\\begin{array}{l}\\text{the ellipse}\\\\[-1pt]\\text{becomes a segment}\\end{array}', P1[0] + DOT_R + LABEL_GAP + 1.4, P1[1] + 1.2, 0, 0));

	S.checkAll(L);
	window[name + '-numbers'] = { K: KMOD, kappa: KAPPA, k2 };
	return finish(S, L, [280, 360]);
}
