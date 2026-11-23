// The tutorial, chapter 3.9 (tutorial/noise/positivity.md), its second diagram: two masses on a line from four
// moments. Above, the line from -1 to 1 m with two upright bars in matter's colour, 2 kg at 0.3 m and 1 kg at -0.5 m,
// their heights in proportion to their masses. Beneath, on the same horizontal scale, the parabola
// p(x) = x^2 + 0.2x - 0.15 = (x - 0.3)(x + 0.5) over its zero line; thin dotted guides run from the foot of each bar
// straight down to the place where p crosses zero. At the upper right, the chapter's equation eq:hankel with the
// example's numbers: the Hankel matrix of the moments 3, 0.1 and 0.43 times (c0, c1) equals (0.43, -0.071).
// Exact: the bars' places and heights; the moments mu_n = sum m_i x_i^n (asserted against the chapter's 3, 0.1, 0.43,
// -0.071 and 0.0787); c0 and c1 solved from eq:hankel (asserted 0.15 and -0.2), the parabola x^2 - c1 x - c0 drawn from
// them (sampled every quarter of a point) and its roots asserted to be the bars' places; the guides at those places.
// Schematic: the vertical scales (points per kilogram for the bars, per unit of p for the parabola), chosen for room.
import { INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { MATTER } from './tut-null-lib.js';

const name = 'tut-pos-moments';
const check = checker(name);

// ---- the mathematics ----------------------------------------------------------------------------------------------
export const MASSES = [{ m: 2, x: 0.3 }, { m: 1, x: -0.5 }];

function mathematics() {
	const mu = [0, 1, 2, 3, 4].map((n) => MASSES.reduce((s, { m, x }) => s + m * x ** n, 0));
	const shown = mu.slice(0, 4).map((v) => +v.toFixed(3));
	check(shown.join() === '3,0.1,0.43,-0.071', `the moments ${mu}`);
	check(mu[4].toFixed(4) === '0.0787', `mu_4 = ${mu[4]}`);
	// eq:hankel: [[mu0, mu1], [mu1, mu2]] (c0, c1) = (mu2, mu3), by Cramer's rule
	const det = mu[0] * mu[2] - mu[1] * mu[1];
	const c0 = (mu[2] * mu[2] - mu[1] * mu[3]) / det, c1 = (mu[0] * mu[3] - mu[1] * mu[2]) / det;
	check(near(c0, 0.15, 1e-12) && near(c1, -0.2, 1e-12), `c0 = ${c0}, c1 = ${c1}`);
	const p = (x) => x * x - c1 * x - c0;
	for (const { x } of MASSES) check(near(p(x), 0, 1e-12), `p does not vanish at ${x}`);
	// the roots by the quadratic formula are exactly the two places
	const disc = Math.sqrt(c1 * c1 + 4 * c0);
	const roots = [(c1 - disc) / 2, (c1 + disc) / 2];
	check(near(roots[0], -0.5, 1e-12) && near(roots[1], 0.3, 1e-12), `the roots ${roots}`);
	// the combination of the chapter: mu4 + 0.4 mu3 - 0.26 mu2 - 0.06 mu1 + 0.0225 mu0 = sum m p(x)^2 = 0
	check(near(mu[4] + 0.4 * mu[3] - 0.26 * mu[2] - 0.06 * mu[1] + 0.0225 * mu[0], 0, 1e-12), 'the fifth moment\'s combination');
	return { mu, c0, c1, p, roots };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const W = 200;                  // the line from -1 to 1 m
const KG = 21;                  // points per kilogram, the bars
const BAR = 5;                  // a bar's width
const PY = 56;                  // points per unit of p, the parabola
const DROP = 84;                // from the scene's line down to the parabola's zero line
const SIZE_M = 8.5;

export default async function () {
	const n = mathematics();
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - W / 2, y0 = ORIGIN - DROP / 2, y1 = ORIGIN + DROP / 2;
	const X = (x) => left + ((x + 1) / 2) * W;

	// ---- the scene: its line, ticks at -1, 0 and 1 with their numbers, the bars
	S.path([[X(-1), y0], [X(1), y0]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the scene\'s line' });
	for (const t of [-1, 0, 1]) {
		S.path([[X(t), y0], [X(t), y0 + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${t}` });
		L.push(await placed(t < 0 ? `-${-t}` : `${t}`, X(t), y0 + TICK + NUM, 0.5, 0, DIM));
	}
	L.push(await placed('x\\ (\\mathrm{m})', X(1) + 5, y0, 0, 0.5, DIM));
	for (const { m, x } of n.roots.map((r) => MASSES.find((q) => near(q.x, r, 1e-12)))) {
		const h = m * KG, l = X(x) - BAR / 2;
		S.fill(`M${l},${y0}h${BAR}v${-h}h${-BAR}Z`, { l, r: l + BAR, t: y0 - h, b: y0 }, { color: MATTER, layer: 2, what: `the bar at ${x}` });
		L.push(await placed(`${m}\\,\\mathrm{kg}`, X(x), y0 - h - LABEL_GAP, 0.5, 1, MATTER));
	}

	// ---- the parabola over its zero line, on the same horizontal scale
	const P = new Plot({ left, top: y1 - PY * 1.2, w: W, h: PY * 1.2, x0: -1, x1: 1, y0: 0, y1: 1.2 });
	check(near(P.X(0.3), X(0.3), 1e-9) && near(P.Y(0), y1, 1e-9), 'the two drawings do not share their scale');
	S.path([[X(-1), y1], [X(1), y1]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the zero line' });
	const pts = graph(P, n.p, -1, 1);
	check(longest(pts) <= 0.2501, `the parabola has a step of ${longest(pts)} pt`);
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the parabola' });
	// the guides: from each bar's foot down to its root
	for (const r of n.roots) {
		check(near(P.Y(n.p(r)), y1, 1e-9), `the parabola does not cross zero below the bar at ${r}`);
		S.dots([X(r), y0 + 0.9], [X(r), y1 - 0.9], { color: DIM, what: `the guide at ${r}` });
	}
	// the parabola's name and formula, under its dip
	const xm = n.c1 / 2;
	L.push(await placed('p(x) = x^2 + 0.2x - 0.15', X(xm), P.Y(n.p(xm)) + LABEL_GAP + 0.8, 0.5, 0, INK));

	// ---- eq:hankel with the numbers, at the upper right, right of the larger bar's label and above the line
	const eq = '\\begin{pmatrix}3&0.1\\\\0.1&0.43\\end{pmatrix}\\!\\begin{pmatrix}c_0\\\\c_1\\end{pmatrix} = \\begin{pmatrix}0.43\\\\-0.071\\end{pmatrix}';
	L.push(await S.clear(eq, X(0.3) + 14, y0 - 2.6 * KG / 2 - 6, 0, 0.5, [0, -1], { color: INK, size: SIZE_M }));

	S.checkAll(L);
	window.tutPosMoments = { mu: n.mu, c0: n.c0, c1: n.c1 };
	return finish(S, L, [240, 340]);
}
