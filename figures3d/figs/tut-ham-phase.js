// The tutorial, chapter 1.7 (tutorial/newton/hamilton.md), its first diagram: the phase space of the cart. A cart of
// 2 kg on a spring of 50 N/m, its distance q from the spring's relaxed place to the right and its momentum p up.
// Three nested ellipses, the curves H = p^2/2m + k q^2/2 = E for E = 0.0625, 0.25 and 0.5625 J, of half-axes
// sqrt(2E/k) = 0.05, 0.1, 0.15 m along q and sqrt(2mE) = 0.5, 1, 1.5 kg m/s along p. On a grid of 36 points, steps of
// 0.055 m and 0.55 kg m/s offset by half a step from the axes, the arrows of Hamilton's flow (dq/dt, dp/dt) = (dH/dp, -dH/dq) = (p/m, -k q), each
// multiplied by the same time TAU and drawn on the axes' scales, centred on its grid point: they turn clockwise,
// along the ellipses. One point is marked on the middle ellipse, the state at omega t = 60 degrees after the
// right-hand end of the swing, q = 0.05 m and p = -0.866 kg m/s; below the plane, on its track drawn to the same
// scale of q, the cart stands at that q, held by its spring to a wall, and the arrow above it is its velocity p/m
// multiplied by the same TAU, which is the horizontal part of the flow at the marked point.
// Exact: the ellipses (sampled every quarter of a point); the half-axes (asserted from E, k and m); each arrow, the
// flow at its grid point (asserted at right angles to the gradient of H, so along the level curve through it, and
// turning clockwise), all at one scale; the marked point on H = 0.25 J; the cart's place and its arrow on the scale
// of q. Chosen for the drawing: the two axes' scales (so the ellipses' shape on the page), the time TAU, the grid,
// the cart's size, its spring and the wall.
import { INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, AXIS_HEAD, HAIR, LINE, VEC, VEC_HEAD, TICK, DOT, DOT_STEP, n2 } from './tut-pot-lib.js';
import { STEEL } from './tut-five-lib.js';

const name = 'tut-ham-phase';
const check = checker(name);

// ---- the physics (SI) -------------------------------------------------------------------------------------------
export const MASS = 2;                         // kg
export const K = 50;                           // N/m
export const OMEGA = Math.sqrt(K / MASS);      // 1/s
export const ENERGIES = [0.0625, 0.25, 0.5625];   // J
export const H = (q, p) => (p * p) / (2 * MASS) + 0.5 * K * q * q;
/** Hamilton's flow: (dH/dp, -dH/dq). */
export const flow = (q, p) => [p / MASS, -K * q];
export const TAU = 0.04;                       // s: every arrow is the flow times this time
export const PHASE = Math.PI / 3;              // the marked point: omega t after the right-hand end of the swing
const A_MID = Math.sqrt((2 * ENERGIES[1]) / K);
export const MARK = [A_MID * Math.cos(PHASE), -MASS * OMEGA * A_MID * Math.sin(PHASE)];

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const SQ = 700;                                // points per metre, along q (and along the track)
const SP = 140 / 3;                            // points per kg m/s, along p
// the grid: steps of 0.055 m and 0.55 kg m/s, offset by half a step from the axes, so that no arrow lies along an
// ellipse (each clears every ellipse by more than 2.5 points, asserted below)
const GRID_Q = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * 0.055);
const GRID_P = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * 0.55);
const FLOW = 0.5, FLOW_HEAD = 3.2;            // the flow's arrows: stroke and head (or two fifths of the arrow)
const Q_AXIS = [-0.182, 0.192], P_AXIS = [-1.72, 1.86];
const MARK_R = 1.25;                           // the marked point
const TRACK_DROP = 106;                        // the track, this far below the q axis
const WALL_Q = -0.19;                          // the wall, metres
const BLOCK = [22, 11];                        // the cart's body, points
const WHEEL = 2.3, WHEEL_AT = 6.6;            // its wheels: radius, and distance from its centre
const SPRING = 0.45, COILS = 11, AMP = 2.1, LEAD = 7;   // the spring: stroke, corners, half-width, straight ends
const GAP = 2.2;                               // labels' air
const HAIRSPACE = 0.8;

export default async function () {
	// ---- the numbers the chapter prints
	const half = ENERGIES.map((E) => [Math.sqrt((2 * E) / K), Math.sqrt(2 * MASS * E)]);
	[[0.05, 0.5], [0.1, 1], [0.15, 1.5]].forEach(([a, b], i) => check(near(half[i][0], a, 1e-12) && near(half[i][1], b, 1e-12), `the half-axes of ellipse ${i} are ${half[i]}`));
	check(near(OMEGA, 5, 1e-12), 'omega is not 5 per second');
	check(near(Math.PI * half[1][0] * half[1][1], (2 * Math.PI * ENERGIES[1]) / OMEGA, 1e-12) && near(Math.PI * half[1][0] * half[1][1], 0.314, 0.0005), 'the middle ellipse\'s area is not 0.314 J s');
	check(near(H(...MARK), ENERGIES[1], 1e-12), 'the marked point is not on the middle ellipse');
	check(near(MARK[0], 0.05, 1e-12) && near(MARK[1], -0.866, 0.0005), `the marked point is ${MARK}`);

	const S = new Sheet(name);
	const X0 = ORIGIN, Y0 = ORIGIN - 60;
	const at = (q, p) => [X0 + SQ * q, Y0 - SP * p];
	const labels = [];

	// ---- the axes
	S.arrow(at(Q_AXIS[0], 0), at(Q_AXIS[1], 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the q axis' });
	S.arrow(at(0, P_AXIS[0]), at(0, P_AXIS[1]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: 'the p axis' });

	// ---- the ellipses: H = E, each one closed path, its points no more than a quarter of a point apart
	const ellipses = half.map(([a, b], i) => {
		const n = Math.ceil((2 * Math.PI * Math.max(SQ * a, SP * b)) / 0.2);
		const pts = Array.from({ length: n }, (_, k) => {
			const t = (2 * Math.PI * k) / n, q = a * Math.cos(t), p = b * Math.sin(t);
			check(near(H(q, p), ENERGIES[i], 1e-12), `a point of ellipse ${i} is off H = E`);
			return at(q, p);
		});
		for (let k = 0; k < n; k++) {
			const [u, v] = [pts[k], pts[(k + 1) % n]];
			check(Math.hypot(u[0] - v[0], u[1] - v[1]) <= 0.25, `ellipse ${i} is sampled too coarsely`);
		}
		S.path(pts, { color: INK, width: LINE, layer: 1, closed: true, what: `ellipse ${i}` });
		return pts;
	});

	// ---- the flow: on the grid, each arrow tau (dH/dp, -dH/dq), centred on its point
	const flowArrows = [];
	for (const q of GRID_Q) for (const p of GRID_P) {
		const [dq, dp] = flow(q, p);
		// along the level curve: at right angles to the gradient (k q, p/m) of H; and clockwise about the origin
		check(near(dq * K * q + dp * (p / MASS), 0, 1e-12), `the flow at (${q}, ${p}) is not along its level curve`);
		check(q * dp - p * dq < 0, `the flow at (${q}, ${p}) does not turn clockwise`);
		const c = at(q, p), d = [SQ * TAU * dq, -SP * TAU * dp];
		const A = [c[0] - d[0] / 2, c[1] - d[1] / 2], B = [c[0] + d[0] / 2, c[1] + d[1] / 2];
		const a = S.arrow(A, B, { color: DIM, width: FLOW, head: FLOW_HEAD, layer: 2, what: `the flow at (${q}, ${p})` });
		check(near(a.L, Math.hypot(...d), 1e-9), `the flow at (${q}, ${p}) is not at the common scale`);
		flowArrows.push({ q, p, A, B, L: a.L });
	}
	// every arrow clears every ellipse: none lies on a curve
	const segDist = (x, a, b) => {
		const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
		const t = l2 ? Math.max(0, Math.min(1, ((x[0] - a[0]) * d[0] + (x[1] - a[1]) * d[1]) / l2)) : 0;
		return Math.hypot(x[0] - a[0] - t * d[0], x[1] - a[1] - t * d[1]);
	};
	let closest = Infinity;
	for (const f of flowArrows) for (const e of ellipses) for (const x of e) {
		// the arrow's ink reaches 0.36 head to each side near its tip; the shaft FLOW / 2
		closest = Math.min(closest, segDist(x, f.A, f.B) - Math.min(FLOW_HEAD, 0.4 * f.L) * 0.36 - LINE / 2);
	}
	check(closest >= 2.5, `a flow arrow comes within ${closest.toFixed(2)} pt of an ellipse`);

	// ---- the marked point
	const M = at(...MARK);
	S.raw(`<circle cx="${n2(M[0])}" cy="${n2(M[1])}" r="${MARK_R}" fill="${INK}"/>`, 4);
	S.mark([M], MARK_R, 'the marked point');

	// ---- the track, the wall, the spring and the cart, on the q scale
	const yT = Y0 + TRACK_DROP;
	const xW = at(WALL_Q, 0)[0], xEnd = at(Q_AXIS[1], 0)[0];
	S.path([[xW, yT], [xEnd, yT]], { color: DIM, width: LINE, layer: 1, cap: 'butt', what: 'the track' });
	const wallTop = yT - BLOCK[1] - 2 * WHEEL - 7;
	S.path([[xW, yT + 0.3], [xW, wallTop]], { color: DIM, width: LINE, layer: 1, cap: 'butt', what: 'the wall' });
	// the wall's hatching: short strokes to its left, evenly spaced, each within the wall's height
	{
		const n = 6, step = (yT - 3 - wallTop) / (n - 1);
		for (let i = 0; i < n; i++) S.path([[xW - 0.3, wallTop + i * step], [xW - 3.3, wallTop + i * step + 3]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the wall\'s hatching' });
	}
	// the relaxed place, q = 0: a tick under the track
	const x0 = at(0, 0)[0];
	S.path([[x0, yT], [x0, yT + TICK + 0.6]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the tick at q = 0' });
	labels.push(await placed('0', x0, yT + TICK + 0.6 + GAP + 0.4, 0.5, 0, DIM));

	// the cart: wheels of steel on the track, a block of stone on them
	const xc = M[0];
	check(near(xc, at(MARK[0], 0)[0], 1e-9), 'the cart is not at the marked point\'s q');
	for (const s of [-1, 1]) S.sphere([xc + s * WHEEL_AT, yT - LINE / 2 - WHEEL], WHEEL, STEEL, { spec: 0.6, shininess: 36, layer: 4 }, 'a wheel');
	const bx = xc - BLOCK[0] / 2, by = yT - LINE / 2 - WHEEL - 0.6 - BLOCK[1];
	const slab = await stoneTexture(BLOCK[0], BLOCK[1]);
	const r = 1.4, box = { l: bx, r: bx + BLOCK[0], t: by, b: by + BLOCK[1] };
	const rect = `M${n2(bx + r)},${n2(by)}h${n2(BLOCK[0] - 2 * r)}a${r},${r} 0 0 1 ${r},${r}v${n2(BLOCK[1] - 2 * r)}a${r},${r} 0 0 1 ${-r},${r}h${n2(-(BLOCK[0] - 2 * r))}a${r},${r} 0 0 1 ${-r},${-r}v${n2(-(BLOCK[1] - 2 * r))}a${r},${r} 0 0 1 ${r},${-r}Z`;
	S.raw(`<clipPath id="${name}-cart"><path d="${rect}"/></clipPath>` +
		`<image class="art" href="${slab}" x="${n2(bx)}" y="${n2(by)}" width="${BLOCK[0]}" height="${BLOCK[1]}" preserveAspectRatio="none" clip-path="url(#${name}-cart)"/>` +
		`<path d="${rect}" fill="none" stroke="${INK}" stroke-width="${HAIR}"/>`, 3);
	S.boxes.push({ box, what: 'the cart' });

	// the spring, from the wall to the cart's left face, at the cart's middle height
	const ys = by + BLOCK[1] / 2, s0 = xW + 0.3, s1 = bx;
	const pts = [[s0, ys], [s0 + LEAD, ys]];
	for (let j = 1; j < 2 * COILS; j++) pts.push([s0 + LEAD + ((s1 - s0 - 2 * LEAD) * j) / (2 * COILS), ys + (j % 2 ? -AMP : AMP)]);
	pts.push([s1 - LEAD, ys], [s1, ys]);
	S.path(pts, { color: DIM, width: SPRING, layer: 2, what: 'the spring' });

	// the cart's velocity over the time tau, above it: the horizontal part of the flow at the marked point
	const v = SQ * TAU * flow(...MARK)[0];
	const yv = by - 4.2;
	const va = S.arrow([xc, yv], [xc + v, yv], { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the cart\'s velocity' });
	check(va.u[0] < 0 && near(va.L, Math.abs(v), 1e-9), 'the cart\'s arrow is not its velocity on the scale of q');

	// ---- the dotted line from the marked point down to the cart's arrow: it passes under the marks it meets
	{
		const A = [M[0], M[1] + MARK_R + 1.4], B = [xc, yv - 1.8];
		const L = B[1] - A[1], n = Math.round(L / DOT_STEP), step = L / n;
		const solid = S.marks.filter((m) => /^(ellipse|the flow|the q axis|the p axis)/.test(m.what));
		const clear = (x) => solid.every((m) => (m.pts.length === 1 ? Math.hypot(x[0] - m.pts[0][0], x[1] - m.pts[0][1])
			: Math.min(...m.pts.slice(1).map((p, i) => segDist(x, m.pts[i], p)))) - m.r - DOT / 2 >= HAIRSPACE);
		const dots = Array.from({ length: n + 1 }, (_, i) => [A[0], A[1] + i * step]).filter(clear);
		S.raw(`<path d="${dots.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${FAINT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 0.5);
		S.mark([A, B], DOT / 2, 'the dotted line');
	}

	// ---- labels: the axes' names at their tips; the half-axes of the outer ellipse where it crosses the axes
	const qTip = at(Q_AXIS[1], 0), pTip = at(0, P_AXIS[1]);
	labels.push(await placed('q\\ (\\mathrm{m})', qTip[0] + GAP, qTip[1], 0, 0.5, DIM));
	labels.push(await placed('p\\ (\\mathrm{kg\\,m\\,s^{-1}})', pTip[0], pTip[1] - GAP, 0.5, 1, DIM));
	for (const [i, [a, b]] of half.entries()) {
		labels.push(await tryAround(S, a.toString(), at(a, 0), [[1, 1], [1, -1]], DIM));
		labels.push(await tryAround(S, b.toString(), at(0, b), [[-1, -1], [1, -1]], DIM));
		void i;
	}

	S.checkAll(labels);
	window.tutHamPhase = { half, mark: MARK, tau: TAU, closest, longest: Math.max(...flowArrows.map((f) => f.L)), shortest: Math.min(...flowArrows.map((f) => f.L)) };
	return finish(S, labels, [240, 340]);
}

/** A label in the quadrant `dirs[i]` (signs, figure coordinates) beside the point x: its near corner GAP from x,
 * then moved out along the diagonal until it clears every mark; the first quadrant that needs least moving wins. */
async function tryAround(S, src, x, dirs, color) {
	let best = null;
	for (const [sx, sy] of dirs) {
		const probe = await placed(src, x[0] + sx * GAP, x[1] + sy * GAP, sx > 0 ? 0 : 1, sy > 0 ? 0 : 1, color);
		for (let s = 0; s < 30; s += 0.1) {
			const box = { l: probe.box.l + sx * s, r: probe.box.r + sx * s, t: probe.box.t + sy * s, b: probe.box.b + sy * s };
			if (S.clearance(box).d >= GAP + 0.2) {
				if (!best || s < best.s) best = { s, sx, sy };
				break;
			}
		}
	}
	if (!best) throw new Error(`${S.name}: no room for the label ${src}`);
	return placed(src, x[0] + best.sx * (GAP + best.s), x[1] + best.sy * (GAP + best.s), best.sx > 0 ? 0 : 1, best.sy > 0 ? 0 : 1, color);
}

/** The stone of the paper's slab (figures3d/sprites/slab.jpg), a piece of it at 8 pixels per point, as a JPEG. */
async function stoneTexture(w, h) {
	const img = new Image();
	img.src = '/figures3d/sprites/slab.jpg';
	await img.decode();
	const c = document.createElement('canvas');
	c.width = Math.round(w * 8); c.height = Math.round(h * 8);
	// a piece of the slab at its own resolution, about 3 of its pixels per point
	c.getContext('2d').drawImage(img, 200, 160, w * 3, h * 3, 0, 0, c.width, c.height);
	return c.toDataURL('image/jpeg', 0.86);
}
