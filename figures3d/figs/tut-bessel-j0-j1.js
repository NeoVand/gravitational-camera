// The tutorial, section 3.6 (tutorial/noise/bessel-and-airy.md), its second diagram: the two Bessel functions and
// their zeros. J0 (first accent, orange) and J1 (second accent, blue) against u from 0 to 15, with the dotted line at
// zero; their zeros marked by dots on it and labelled in their colours, J0's at 2.405, 5.520, 8.654 and 11.79 and J1's
// at 3.832, 7.016, 10.173 and 13.32, so that the two sets alternate; the deepest trough of J0, (3.832, -0.403), by a dot
// joined by a dotted line to J1's first zero straight above it; and the envelope of the far form, +-sqrt(2 / pi u),
// dashed in neutral grey from u = 1 on.
// Exact: both functions (tut-bessel-lib.js: the series below u = 12 and the far form beyond, checked against the
// average that defines J0 and against J1 = -J0'), every zero (bisection), the trough (golden sections, asserted to lie
// at J1's first zero to 1e-6) and the envelope, each asserted against the chapter's numbers. Every curve is sampled
// so that no two neighbouring points are more than a quarter of a point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { TICK } from './tut-pot-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { J0, J1, envelope, mathematics, DIM, FAINT, ACCENT, ACCENT2, DOT, ZERO_LINE, ZERO_DASH, n2 } from './tut-bessel-lib.js';

const name = 'tut-bessel-j0-j1';
const check = checker(name);

const UMAX = 15;
const PW = 288, UNIT = 72;                 // u from 0 to 15; points per unit of J
const TOP = 1.06, BOTTOM = -0.86;          // room for the envelope's lower branch, -0.798 at u = 1
const ENV_DASH = [1.8, 1.4];
const ENV = 0.45;                          // the envelope's stroke: a guide, thinner than the curves

export default async function () {
	const n = mathematics(name);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - ((TOP - BOTTOM) * UNIT) / 2, w: PW, h: (TOP - BOTTOM) * UNIT, x0: 0, x1: UMAX, y0: BOTTOM, y1: TOP });

	// ---- the zero line, the envelope, the curves
	S.path([[P.left, P.Y(0)], [P.right, P.Y(0)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the zero line' });
	check(-envelope(1) > BOTTOM + 3 / UNIT, 'the envelope\'s lower branch comes within 3 pt of the axis');
	for (const s of [1, -1]) {
		const pts = graph(P, (u) => s * envelope(u), 1, UMAX);
		check(longest(pts) <= 0.2501, `the envelope has a step of ${longest(pts)} pt`);
		S.path(pts, { color: FAINT, width: ENV, layer: 1.5, dash: ENV_DASH, cap: 'butt', what: s > 0 ? 'the upper envelope' : 'the lower envelope' });
	}
	for (const [f, color, what] of [[J0, ACCENT, 'J0'], [J1, ACCENT2, 'J1']]) {
		const pts = graph(P, f, 0, UMAX);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top && y <= P.bottom - 3), `${what} leaves the chart or comes near its axis`);
		S.path(pts, { color, width: CURVE, layer: 2, what });
	}
	// both functions stay inside the envelope once u is past 2 (where the far form starts to hold)
	for (let u = 2; u <= UMAX; u += 0.01) check(Math.abs(J0(u)) < envelope(u) + 0.02 && Math.abs(J1(u)) < envelope(u) + 0.02, `a curve leaves the envelope at ${u}`);

	// ---- the dots: the zeros on the zero line, the trough
	const dot = (u, v, color, what) => {
		const [x, y] = P.at(u, v);
		S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${color}"/>`, 3);
		S.mark([[x, y]], DOT, what);
		return [x, y];
	};
	const zeros = [
		...n.z0.slice(0, 4).map((u, i) => ({ u, color: ACCENT, text: ['2.405', '5.520', '8.654', '11.792'][i], f: J0 })),
		...n.z1.map((u, i) => ({ u, color: ACCENT2, text: ['3.832', '7.016', '10.173', '13.324'][i], f: J1 }))
	];
	for (const z of zeros) z.at = dot(z.u, 0, z.color, `the zero at ${z.text}`);
	// the trough of J0, joined by a dotted line to J1's first zero
	const T = dot(n.trough.x, n.trough.y, ACCENT, 'the trough');
	S.dots([T[0], T[1] - DOT - 0.8], [T[0], P.Y(0) + DOT + 0.8], { color: DIM, what: 'the line from the trough to the zero' });
	check(near(T[0], zeros[4].at[0], 1e-6), 'the trough is not straight below J1\'s first zero');

	L.push(await S.clear('-0.403', T[0], T[1] + DOT + LABEL_GAP + 0.3, 0.5, 0, [0, 1], { color: ACCENT }));

	// ---- the axes: the u axis carries the zeros as its ticks, their numbers in their functions' colours
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	const xl = await xAxis(S, P, { ticks: [0, ...zeros.map((z) => z.u), UMAX], fmt: (t) => (t === 0 || t === UMAX ? fmt(t) : null), what: 'the u axis' });
	for (const z of zeros) xl.push(await placed(z.text, P.X(z.u), P.bottom + TICK + NUM, 0.5, 0, z.color));
	L.push(...xl);
	const last = xl.find((l) => l.src === `${UMAX}`);
	L.push(await placed('u', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '\\tfrac12' : fmt(t)), what: 'the vertical axis' })));

	// ---- the curves' names
	L.push(await S.clear('J_0', P.X(0.62), P.Y(J0(0.62)) - LABEL_GAP, 0, 1, [1, 0], { color: ACCENT }));
	L.push(await S.clear('J_1', P.X(1.84), P.Y(J1(1.84)) - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: ACCENT2 }));
	L.push(await S.clear('\\pm\\sqrt{2/\\pi u}', P.X(12.6), P.Y(envelope(12.6)) - LABEL_GAP, 0.5, 1, [0, -1], { color: DIM }));

	S.checkAll(L);
	window.tutBesselJ0J1 = { zeros: zeros.map((z) => z.u), trough: n.trough };
	return finish(S, L, [240, 340]);
}
