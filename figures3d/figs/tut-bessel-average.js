// The tutorial, chapter 3.6 (tutorial/noise/bessel-and-airy.md), its first diagram: the circular ripple is the
// average of a plane ripple over its directions. Left, the plane ripple cos(k . a) as a map on a square, ka_1 and ka_2
// from -7 to 7, with its wavevector k as an arrow across the crests: orange where the ripple is above zero and blue
// where it is below (chapter 3.2's scale, the opacity in proportion to the value, up to DEEP at one), its zero lines as
// hairlines. Beside it, six faint copies of the same ripple turned through 0, 30, 60, 90, 120 and 150 degrees, each with
// its own arrow (turning on through 180 to 330 degrees repeats them, because the cosine is even). Right, their
// average J0(ka) on the same square and the same colour scale: orange inside the first zero at ka = 2.405, blue out to
// 5.520, orange again out to 8.654 in the corners, the rings fading as J0 does (1 at the centre, -0.403, then 0.300);
// its zero circles as hairlines. Under each square, the horizontal through its centre as an axis.
// Exact: both maps, drawn as gradients (tut-bessel-lib.js, stops: within 0.003 of the exact opacity everywhere,
// asserted), the plane ripple a repeating linear gradient across its crests and J0 a radial one; the zero lines (at
// ka_1 = (n + 1/2) pi) and circles (at the zeros of J0, asserted against the chapter's numbers); the turns of the
// copies. Schematic: the length of the arrows, and the copies drawn smaller and fainter than the squares.
import { Sheet, ORIGIN, finish, checker, placed, near, AXIS, HAIR, TICK, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { Plot, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { J0, mathematics, stops, DEEP, TOL, INK, DIM, ACCENT, ACCENT2, PAGE, n2 } from './tut-bessel-lib.js';

const name = 'tut-bessel-average';
const check = checker(name);

const REACH = 7;                    // each square runs from -7 to 7 in ka_1 and ka_2
const SQ = 104;                     // a square's side, points
const TH = 32, TGAP = 4;            // a copy's side, and the air between copies
const GAP_A = 11, GAP_B = 15;       // from the left square to the copies, and from the copies to the right square
const FAINT_COPY = 0.5;             // the copies' opacity
const ZERO = 0.3;                   // the zero lines' stroke
const EDGE = 0.4;                   // a square's outline
const HALO = 0.9;                   // the page-coloured air around the arrow on the left square
const TURNS = [0, 30, 60, 90, 120, 150];

/** A repeating linear gradient of cos across crests `period` points apart, its crest through (cx, cy), turned so that
 * k points at `deg` degrees above the horizontal. */
function rippleGradient(id, cx, cy, period, deg) {
	// phase -pi .. pi across one period: a trough, a zero, the crest, a zero, a trough
	const op = (t) => DEEP * Math.abs(Math.cos(-Math.PI + 2 * Math.PI * t));
	const col = (t) => (Math.cos(-Math.PI + 2 * Math.PI * t) >= 0 ? ACCENT : ACCENT2);
	const g = stops(op, col, [0.25, 0.75]);
	check(g.worst < 2 * TOL, `the ripple's gradient is ${g.worst} off`);
	const rot = deg ? ` gradientTransform="rotate(${-deg} ${n2(cx)} ${n2(cy)})"` : '';
	return { svg: `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n2(cx - period / 2)}" y1="${n2(cy)}" x2="${n2(cx + period / 2)}" y2="${n2(cy)}" spreadMethod="repeat"${rot}>${g.svg}</linearGradient>`, g };
}

/** A radial gradient of J0(ka) about (cx, cy), `s` points per unit of ka, out to the radius `R` (units). */
function besselGradient(id, cx, cy, s, R, zeros) {
	const op = (t) => DEEP * Math.abs(J0(t * R));
	const col = (t) => (J0(t * R) >= 0 ? ACCENT : ACCENT2);
	const g = stops(op, col, zeros.filter((z) => z < R).map((z) => z / R));
	check(g.worst < 2 * TOL, `the average's gradient is ${g.worst} off`);
	return { svg: `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(R * s)}" fx="${n2(cx)}" fy="${n2(cy)}">${g.svg}</radialGradient>`, g };
}

export default async function () {
	const n = mathematics(name);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const W = SQ + GAP_A + 2 * TH + TGAP + GAP_B + SQ;
	const left = ORIGIN - W / 2, top = ORIGIN - SQ / 2;
	const A = new Plot({ left, top, w: SQ, h: SQ, x0: -REACH, x1: REACH, y0: -REACH, y1: REACH });
	const B = new Plot({ left: left + SQ + GAP_A + 2 * TH + TGAP + GAP_B, top, w: SQ, h: SQ, x0: -REACH, x1: REACH, y0: -REACH, y1: REACH });
	check(near(3 * TH + 2 * TGAP, SQ, 1e-9), 'the copies are not as tall as the squares');
	const s = SQ / (2 * REACH);
	const rect = (P, fill, what, extra = '') => {
		S.raw(`<rect x="${n2(P.left)}" y="${n2(P.top)}" width="${n2(P.w)}" height="${n2(P.h)}" fill="url(#${fill})"${extra}/>`, 0.5);
		S.boxes.push({ box: { l: P.left, r: P.right, t: P.top, b: P.bottom }, what });
	};
	const outline = (P, what) => S.path([[P.left, P.top], [P.right, P.top], [P.right, P.bottom], [P.left, P.bottom]], { color: DIM, width: EDGE, closed: true, layer: 1.2, cap: 'butt', what });

	// ---- left: the plane ripple, its zero lines, its arrow
	const [acx, acy] = A.at(0, 0);
	const ga = rippleGradient(`${name}-ripple`, acx, acy, 2 * Math.PI * s, 0);
	defs += ga.svg;
	rect(A, `${name}-ripple`, 'the plane ripple');
	for (let m = -3; m <= 2; m++) {
		const u = (m + 0.5) * Math.PI;
		if (Math.abs(u) >= REACH) continue;
		S.path([A.at(u, -REACH), A.at(u, REACH)], { color: DIM, width: ZERO, layer: 1, cap: 'butt', what: `the zero line at ${u}` });
	}
	// the arrow, across the central crest
	const arrow = (P, cx, cy, len, deg, o = {}) => {
		const c = Math.cos((deg * Math.PI) / 180), sn = -Math.sin((deg * Math.PI) / 180);
		const a = [cx - (c * len) / 2, cy - (sn * len) / 2], b = [cx + (c * len) / 2, cy + (sn * len) / 2];
		if (o.halo) {
			const hd = Math.min(VEC_HEAD, 0.4 * len), hw = 0.36 * hd, base = [b[0] - c * hd, b[1] - sn * hd];
			const w = [-sn, c];
			S.raw(`<path d="M${n2(a[0])},${n2(a[1])}L${n2(base[0])},${n2(base[1])}" stroke="${PAGE}" stroke-width="${VEC + 2 * o.halo}" stroke-linecap="round" fill="none"/>` +
				`<path d="M${n2(b[0])},${n2(b[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${PAGE}" stroke="${PAGE}" stroke-width="${2 * o.halo}" stroke-linejoin="round"/>`, 1.8);
		}
		return S.arrow(a, b, { color: o.color ?? INK, width: o.width ?? VEC, head: o.head ?? VEC_HEAD, what: o.what ?? 'an arrow' });
	};
	arrow(A, acx, acy, 0.7 * Math.PI * s, 0, { what: 'the wavevector' });

	// ---- the copies, turned
	const cl = A.right + GAP_A;
	for (const [i, deg] of TURNS.entries()) {
		const col = i % 2, row = Math.floor(i / 2);
		const C = new Plot({ left: cl + col * (TH + TGAP), top: top + row * (TH + TGAP), w: TH, h: TH, x0: -REACH, x1: REACH, y0: -REACH, y1: REACH });
		const [cx, cy] = C.at(0, 0);
		const id = `${name}-copy${deg}`;
		const g = rippleGradient(id, cx, cy, (2 * Math.PI * TH) / (2 * REACH), deg);
		defs += g.svg;
		rect(C, id, `the copy at ${deg}`, ` opacity="${FAINT_COPY}"`);
		S.path([[C.left, C.top], [C.right, C.top], [C.right, C.bottom], [C.left, C.bottom]], { color: DIM, width: 0.3, closed: true, layer: 1.2, cap: 'butt', what: `the copy's outline at ${deg}` });
		arrow(C, cx, cy, 0.44 * TH, deg, { width: 0.55, head: 3.4, color: INK, what: `the arrow at ${deg}` });
	}

	// ---- right: the average, its zero circles
	const [bcx, bcy] = B.at(0, 0);
	const R = REACH * Math.SQRT2 + 0.05;
	const gb = besselGradient(`${name}-average`, bcx, bcy, s, R, n.z0);
	defs += gb.svg;
	rect(B, `${name}-average`, 'the average');
	check(n.z0[1] < REACH && n.z0[2] > REACH && n.z0[2] < REACH * Math.SQRT2 && n.z0[3] > REACH * Math.SQRT2, 'the zeros do not fall as the drawing expects');
	for (const z of n.z0.filter((z) => z < R)) {
		// the circle, in arcs that stay on the square
		const N = Math.ceil((2 * Math.PI * z * s) / 0.25);
		let arc = [];
		const flush = () => { if (arc.length > 1) S.path(arc, { color: DIM, width: ZERO, layer: 1, cap: 'butt', what: `the zero circle at ${z}` }); arc = []; };
		for (let i = 0; i <= N; i++) {
			const t = (2 * Math.PI * i) / N, x = z * Math.cos(t), y = z * Math.sin(t);
			if (Math.abs(x) <= REACH && Math.abs(y) <= REACH) arc.push(B.at(x, y)); else flush();
		}
		flush();
	}

	// ---- the outlines and the axes along the squares' bottoms
	outline(A, 'the left square');
	outline(B, 'the right square');
	const ticks = async (P, list, nameSrc, what) => {
		for (const [t, f, color] of list) {
			const x = P.X(t);
			S.path([[x, P.bottom], [x, P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `${what}'s tick at ${t}` });
			if (f !== null) L.push(await placed(f, x, P.bottom + TICK + NUM, 0.5, 0, color ?? DIM));
		}
		L.push(await placed(nameSrc, P.right + 4, P.bottom + TICK + NUM + 3.1, 0, 0.5, DIM));
	};
	await ticks(A, [[-2 * Math.PI, '-2\\pi'], [0, '0'], [2 * Math.PI, '2\\pi']], 'ka_1', 'the left axis');
	await ticks(B, [[0, '0'], [n.z0[0], '2.405', ACCENT], [n.z0[1], '5.520', ACCENT2]], 'ka_1', 'the right axis');

	// ---- the names, above the squares
	L.push(await placed('\\cos(\\boldsymbol k\\cdot\\boldsymbol a)', A.X(0), A.top - LABEL_GAP - 1.6, 0.5, 1, INK));
	L.push(await placed('J_0(ka)', B.X(0), B.top - LABEL_GAP - 1.6, 0.5, 1, INK));

	S.checkAll(L);
	window.tutBesselAverage = { stops: [ga.g.count, gb.g.count], worst: [ga.g.worst, gb.g.worst] };
	return finish(S, L, [240, 340], defs);
}
