// The tutorial, section 3.6 (tutorial/noise/bessel-and-airy.md), its fourth diagram: a lens draws a star as the
// square of the round opening's pattern. Left, against x from -12 to 12, the amplitude 2 J1(x) / x (first accent,
// orange) and the intensity (2 J1(x) / x)^2 (neutral ink), with the dotted lines at zero and at one half: the first
// dark ring at x = +-3.832, where both vanish, by dots on the zero line; the half maxima, +-2.215 for the amplitude and
// +-1.616 for the intensity, by dots on the half line, numbered on the right. The intensity is drawn only where it
// stands clear of the zero line: its rings, at most 1.75% of the peak, would run along it. Right, the intensity as an
// image in the plane, x_1 and x_2 from -12 to 12, on a logarithmic grey scale from 10^-4 (the page) to 1 (ink), so that
// the rings show, with the first dark ring circled (orange) at x = 3.832; beside it, the grey scale.
// Exact: both profiles (tut-bessel-lib.js), the zeros and half maxima (bisection), asserted against the chapter's
// numbers; the image, a radial gradient whose opacity is (log10 I + 4) / 4 times DEEP_GREY, clipped below 10^-4,
// within 0.003 of exact everywhere (asserted); the circle. Each curve is sampled every quarter of a point along its
// length. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { airy, mathematics, stops, TOL, DIM, INK, ACCENT, DOT, ZERO_LINE, ZERO_DASH, bisect, n2 } from './tut-bessel-lib.js';

const name = 'tut-bessel-airy';
const check = checker(name);

const XR = 12;
const PW = 172, UNIT = 77;               // the profiles: x from -12 to 12; points per unit
const TOP = 1.06, BOTTOM = -0.2;
const GAP = 26;                          // from the chart's right edge to the image
const BAR = 4.5, BAR_GAP = 6;            // the grey scale's width, and its distance from the image
const DEEP_GREY = 0.9;                   // the image's opacity at the peak
const EDGE = 0.4;
const RING = 0.45;                       // the circle's stroke
const LOG0 = -4;                         // the image's floor: 10^-4

const grey = (I) => DEEP_GREY * Math.max(0, Math.min(1, (Math.log10(I) - LOG0) / -LOG0));

export default async function () {
	const n = mathematics(name);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const H = (TOP - BOTTOM) * UNIT;
	const W = PW + GAP + H + BAR_GAP + BAR;
	const left = ORIGIN - W / 2, top = ORIGIN - H / 2;
	const P = new Plot({ left, top, w: PW, h: H, x0: -XR, x1: XR, y0: BOTTOM, y1: TOP });
	const M = new Plot({ left: P.right + GAP, top, w: H, h: H, x0: -XR, x1: XR, y0: -XR, y1: XR });
	const I = (x) => airy(x) ** 2;

	// ---- left: the reference lines, the two profiles
	for (const v of [0, 0.5]) S.path([[P.left, P.Y(v)], [P.right, P.Y(v)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: v ? 'the half line' : 'the zero line' });
	const amp = graph(P, airy, -XR, XR);
	check(longest(amp) <= 0.2501 && amp.every(([, y]) => y >= P.top && y <= P.bottom - 4), 'the amplitude');
	S.path(amp, { color: ACCENT, width: CURVE, layer: 2, what: 'the amplitude' });
	// the intensity, down to where it would merge with the zero line (the line's and the curve's half-widths apart)
	const clear = ((CURVE + ZERO_LINE) / 2 / P.h) * (P.y1 - P.y0);
	const xEnd = bisect((x) => I(x) - clear, 2, n.z1[0]);
	check(n.dipDisc.y ** 2 > clear, 'the first ring is not above the merge level: then it could be drawn');
	const int = graph(P, I, -xEnd, xEnd);
	check(longest(int) <= 0.2501, 'the intensity\'s step');
	S.path(int, { color: INK, width: CURVE, layer: 2.1, what: 'the intensity' });
	void merge;

	const dot = (x, v, color, what) => {
		const [px, py] = P.at(x, v);
		S.raw(`<circle cx="${n2(px)}" cy="${n2(py)}" r="${DOT}" fill="${color}"/>`, 3);
		S.mark([[px, py]], DOT, what);
		return [px, py];
	};
	const dark = [-1, 1].map((s) => dot(s * n.z1[0], 0, INK, 'the dark ring'));
	const hA = [-1, 1].map((s) => dot(s * n.halfDisc, 0.5, ACCENT, 'the amplitude\'s half'));
	const hI = [-1, 1].map((s) => dot(s * n.halfAiry, 0.5, INK, 'the intensity\'s half'));
	check(near(airy(n.z1[0]), 0, 1e-12) && near(I(n.halfAiry), 0.5, 1e-12) && near(airy(n.halfDisc), 0.5, 1e-12), 'the dots');

	// ---- right: the image, its outline, the circle
	const [cx, cy] = M.at(0, 0);
	const s = H / (2 * XR);
	const Rg = XR * Math.SQRT2 + 0.05;
	const g = stops((t) => grey(I(t * Rg)), () => INK, [], TOL);
	check(g.worst < 2 * TOL, `the image is ${g.worst} off`);
	defs += `<radialGradient id="${name}-image" gradientUnits="userSpaceOnUse" cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(Rg * s)}" fx="${n2(cx)}" fy="${n2(cy)}">${g.svg}</radialGradient>`;
	S.raw(`<rect x="${n2(M.left)}" y="${n2(M.top)}" width="${n2(H)}" height="${n2(H)}" fill="url(#${name}-image)"/>`, 0.5);
	S.boxes.push({ box: { l: M.left, r: M.right, t: M.top, b: M.bottom }, what: 'the image' });
	S.path([[M.left, M.top], [M.right, M.top], [M.right, M.bottom], [M.left, M.bottom]], { color: DIM, width: EDGE, closed: true, layer: 1.2, cap: 'butt', what: 'the image\'s outline' });
	const rr = n.z1[0] * s;
	S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(rr)}" fill="none" stroke="${ACCENT}" stroke-width="${RING}"/>`, 2);
	// the image's ticks along its bottom
	for (const t of [-XR, 0, XR]) {
		const x = M.X(t);
		S.path([[x, M.bottom], [x, M.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the image's tick at ${t}` });
		L.push(await placed(t < 0 ? `-${-t}` : `${t}`, x, M.bottom + TICK + NUM, 0.5, 0, DIM));
	}
	// the grey scale: opacity linear in log10 I, from the floor at the bottom to 1 at the top
	const bx = M.right + BAR_GAP;
	defs += `<linearGradient id="${name}-scale" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(M.bottom)}" x2="0" y2="${n2(M.top)}"><stop offset="0" stop-color="${INK}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity="${DEEP_GREY}"/></linearGradient>`;
	check(near(grey(1), DEEP_GREY, 1e-12) && near(grey(1e-4), 0, 1e-12) && near(grey(1e-2), DEEP_GREY / 2, 1e-12), 'the grey scale is not linear in log10 I');
	S.raw(`<rect x="${n2(bx)}" y="${n2(M.top)}" width="${BAR}" height="${n2(H)}" fill="url(#${name}-scale)" stroke="${DIM}" stroke-width="${EDGE}"/>`, 1);
	S.boxes.push({ box: { l: bx, r: bx + BAR, t: M.top, b: M.bottom }, what: 'the grey scale' });
	for (const [e, src] of [[0, '1'], [-2, '10^{-2}'], [-4, '10^{-4}']]) {
		const y = M.bottom - ((e - LOG0) / -LOG0) * H;
		S.path([[bx + BAR, y], [bx + BAR + TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the scale's tick at ${e}` });
		L.push(await placed(src, bx + BAR + TICK + NUM, y, 0, 0.5, DIM));
	}

	// ---- the chart's axes
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	const xl = await xAxis(S, P, { ticks: [-XR, -6, 0, 6, XR], fmt, what: 'the x axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('x', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '\\tfrac12' : fmt(t)), what: 'the vertical axis' })));

	// ---- the numbers, on the right-hand side
	const gp = DOT + LABEL_GAP + 0.3;
	L.push(await S.clear('2.215', hA[1][0] + 0.8, hA[1][1] - gp, 0, 1, [1, 0], { color: ACCENT }));
	L.push(await S.clear('1.616', hI[1][0] - 0.8, hI[1][1] + gp, 1, 0, [-1, 0], { color: INK }));
	L.push(await S.clear('3.832', dark[1][0] + 0.8, dark[1][1] - gp, 0, 1, [1, 0], { color: INK }));

	// ---- the names
	L.push(await S.clear('2J_1(x)/x', P.X(1.4), P.Y(0.86), 0, 0.5, [1, 0], { color: ACCENT }));
	L.push(await S.clear('\\bigl(2J_1(x)/x\\bigr)^2', P.X(-1.4), P.Y(0.86), 1, 0.5, [-1, 0], { color: INK }));

	S.checkAll(L);
	window.tutBesselAiry = { xEnd, stops: g.count, worst: g.worst };
	return finish(S, L, [240, 340], defs);
}
