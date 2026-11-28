// The tutorial, section 3.9 (tutorial/noise/positivity.md), its first diagram: non-negative least squares with two
// cells. The plane of the two cell masses m1 (across) and m2 (up), drawn to one scale on both axes (60 pt a unit), as a
// chart: two scales at the window's left and foot, ticked and numbered (m1 at 0, 1, 2; m2 at -2, -1, 0, 1) clear of
// the bowl, and the lines m1 = 0 and m2 = 0 across the window, the edges of the quarter where both are positive, which
// is in the site's neutral tint. The misfit f(m) = |y - A m|^2 of the chapter's example, A = [[1, 0.6], [0.6, 1]] and
// y = (1, 0.3), has elliptic contours about the best signed scene (1.28, -0.47), outside the quarter (open circle, in
// the first accent, the colour of the linear image in the chapter's interactive figure). The best positive scene
// (0.87, 0) lies on the edge m2 = 0 (filled dot, in matter's colour, the colour of the positive image there), where the
// contour f = 0.066 touches the line m2 = 0 (drawn darker than the others). Each point's label carries its coordinates
// on a second line. From the positive minimum a short arrow points downhill, along minus the slopes (0, 0.28): straight
// down, out of the quarter, into negative m2. The window runs from -0.4 to 2.95 across and -2.12 to 1.2 up, so that it
// holds every contour whole, with air about it (asserted): the bowl is shown entire, nothing is clipped by the frame.
// Exact: the contours f = 0.066 s^2 for s = 1, 2.1 and 3.2, each the closed form m* + sqrt(f) A^{-1}(cos t, sin t)
// (A^T A = A^2), sampled every fifth of a point, cut only where they pass behind the two points' labels ("best
// positive" above its dot, slid along the line to where it cuts least; "best signed" beside its ring in the direction
// that cuts least) and where the touching contour runs within 0.55 pt of the line m2 = 0 (where the two strokes
// overlap); no contour comes near a scale's number (asserted); the two minima and the slopes, from the chapter's
// formulas and asserted against its numbers (1.28, -0.47; 0.87; 2.72 m1 - 2.36; (-0.13, 0.22); +0.28; 0.066), and the
// coordinates printed; the touching contour's tangency at (0.87, 0) and the slope at right angles to the line there.
// Schematic: the arrow's length (it is drawn shorter than the slope, so that it stays inside the touching contour), the
// choice of the contours (f0 times 1, 2.1^2 and 3.2^2) and of the window, chosen so that every contour is whole.
import { INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, VEC, LABEL_GAP, HAIR, TICK } from './tut-pot-lib.js';
import { longest } from './tut-fourier-lib.js';
import { MATTER } from './tut-null-lib.js';

const name = 'tut-pos-nnls';
const check = checker(name);

// ---- the mathematics ----------------------------------------------------------------------------------------------
export const A = [[1, 0.6], [0.6, 1]];
export const Y = [1, 0.3];
const mul = (B, [x, y]) => [B[0][0] * x + B[0][1] * y, B[1][0] * x + B[1][1] * y];
export const misfit = (m) => { const p = mul(A, m); return (Y[0] - p[0]) ** 2 + (Y[1] - p[1]) ** 2; };
/** The slopes of the misfit, 2 A^T (A m - y). */
export const slopes = (m) => { const p = mul(A, m); return mul(A, [2 * (p[0] - Y[0]), 2 * (p[1] - Y[1])]); };

function mathematics() {
	const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
	const inv = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]];
	const signed = mul(inv, Y);
	check(signed[0].toFixed(2) === '1.28' && signed[1].toFixed(2) === '-0.47' && near(misfit(signed), 0, 1e-15), `the signed minimum ${signed}`);
	// on the edge m2 = 0: f = (1 - m1)^2 + (0.3 - 0.6 m1)^2, whose slope is 2.72 m1 - 2.36
	const k1 = 2 * (A[0][0] ** 2 + A[1][0] ** 2), k0 = 2 * (A[0][0] * Y[0] + A[1][0] * Y[1]);
	check(near(k1, 2.72, 1e-12) && near(k0, 2.36, 1e-12), 'the slope on the edge is not 2.72 m1 - 2.36');
	const pos = [k0 / k1, 0];
	check(pos[0].toFixed(2) === '0.87', `the positive minimum ${pos}`);
	const res = mul(A, pos).map((v, i) => v - Y[i]);
	check(res[0].toFixed(2) === '-0.13' && res[1].toFixed(2) === '0.22', `A m - y = ${res}`);
	const g = slopes(pos);
	check(near(g[0], 0, 1e-12) && g[1].toFixed(2) === '0.28' && g[1] > 0, `the slopes at the positive minimum ${g}`);
	const f0 = misfit(pos);
	check(f0.toFixed(3) === '0.066', `the misfit ${f0}`);
	// the KKT conditions hold, and no point of the quarter has a lower misfit (a grid search)
	for (let i = 0; i <= 160; i++) for (let j = 0; j <= 160; j++) check(misfit([i / 100, j / 100]) >= f0 - 1e-12, 'a positive scene fits better');
	// downhill is minus the slopes: straight down, toward negative m2
	const down = [-g[0], -g[1]];
	check(near(down[0], 0, 1e-12) && down[1] < 0, 'downhill does not point to negative m2');
	return { inv, signed, pos, f0, g, down };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const U = 60;                                // points per unit of mass, on both axes
const WIN = { x: [-0.4, 2.95], y: [-2.12, 1.2] };  // the window: it holds every contour whole, with air about it
const OUT = 0.1;                             // the scales stand this far outside the window, units
const AIR = 0.05;                            // the least room, units, between a contour and the window's edge
const TINT = '#eeebe5';                      // the site's neutral tint of the page (drawing.ts THEME)
const SCALES = [1, 2.1, 3.2];                // the contours, f = f0 s^2
const LINE = 0.5, LINE_TOUCH = 0.6;          // the contours' strokes
const NEAR = 0.55;                           // points: the touching contour is left out this near the axis
const DOT = 2.1, RING = 2.3, RING_W = 0.6;   // the positive minimum's dot; the signed minimum's ring
const DOWN = 0.18;                           // the arrow's length, units (schematic)
const CUT = LABEL_GAP + 0.4;                 // a contour stops this far from a label
const NUM = 2.4;                             // from a tick's end to its number

export default async function () {
	const n = mathematics();
	// the two points' labels carry their coordinates, as the chapter gives them
	const POS = `\\begin{array}{c}\\text{best positive}\\\\(${n.pos[0].toFixed(2)}, ${n.pos[1].toFixed(0)})\\end{array}`;
	const SIGNED = `\\begin{array}{c}\\text{best signed}\\\\(${n.signed[0].toFixed(2)}, ${n.signed[1].toFixed(2)})\\end{array}`;
	check(POS.includes('(0.87, 0)') && SIGNED.includes('(1.28, -0.47)'), 'the coordinates printed are not the chapter\'s');
	const S = new Sheet(name);
	const at = ([x, y]) => [ORIGIN + U * x, ORIGIN - U * y];
	const L = [];

	// ---- the quarter; the lines m1 = 0 and m2 = 0, its edges, across the window; and the two scales, at the window's
	// left and foot, as a chart's axes, ticked and numbered, so that the coordinates can be read off clear of the bowl
	const q0 = at([0, 0]), q1 = at([WIN.x[1], WIN.y[1]]);
	S.raw(`<rect x="${q0[0]}" y="${q1[1]}" width="${q1[0] - q0[0]}" height="${q0[1] - q1[1]}" fill="${TINT}"/>`, 0);
	const [xa, ya] = at([WIN.x[0] - OUT, WIN.y[0] - OUT]);          // the scales' axes, page
	const [xr, yt] = at([WIN.x[1], WIN.y[1]]);
	S.path([[xa, q0[1]], [xr, q0[1]]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the line m2 = 0' });
	S.path([[q0[0], ya], [q0[0], yt]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the line m1 = 0' });
	S.path([[xa, ya], [xr, ya]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the m1 scale' });
	S.path([[xa, ya], [xa, yt]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the m2 scale' });
	const nums = [];
	for (const t of [0, 1, 2]) {
		const x = at([t, 0])[0];
		S.path([[x, ya], [x, ya + 2 * TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the m1 scale's tick at ${t}` });
		nums.push(await placed(`${t}`, x, ya + 2 * TICK + NUM, 0.5, 0, DIM));
	}
	for (const t of [-2, -1, 0, 1]) {
		const y = at([0, t])[1];
		S.path([[xa, y], [xa - 2 * TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the m2 scale's tick at ${t}` });
		nums.push(await placed(t < 0 ? `-${-t}` : `${t}`, xa - 2 * TICK - NUM, y, 1, 0.5, DIM));
	}
	const n2r = nums.find((g) => g.src === '2');
	L.push(await placed('m_1', xr + 4, (n2r.box.t + n2r.box.b) / 2, 0, 0.5, MATTER));
	L.push(await placed('m_2', xa, yt - LABEL_GAP - 1, 0.5, 1, MATTER));
	L.push(...nums);

	// ---- the two minima and the arrow
	const ps = at(n.signed), pp = at(n.pos);
	S.raw(`<circle cx="${ps[0]}" cy="${ps[1]}" r="${RING}" fill="none" stroke="${ACCENT}" stroke-width="${RING_W}"/>`, 4);
	S.mark([ps], RING + RING_W / 2, 'the signed minimum');
	const len = Math.hypot(...n.down);
	const tip = at([n.pos[0] + (DOWN * n.down[0]) / len, n.pos[1] + (DOWN * n.down[1]) / len]);
	S.arrow(pp, tip, { color: INK, width: VEC, head: 4.4, layer: 3, what: 'the downhill arrow' });
	S.raw(`<circle cx="${pp[0]}" cy="${pp[1]}" r="${DOT}" fill="${MATTER}"/>`, 4);
	S.mark([pp], DOT, 'the positive minimum');
	// the arrow stays inside the touching contour: along it the misfit falls
	check(misfit([n.pos[0], n.pos[1] - DOWN]) < n.f0, 'the arrow leaves the touching contour');

	// ---- the labels beside the two points: "best positive" above its dot, in the quarter; "best signed" beside its
	// ring, in the direction (searched every 2 degrees) where it comes nearest to clearing the contours, so that as few
	// as possible are cut for it
	const inWin = ([x, y]) => x >= at([WIN.x[0], 0])[0] && x <= at([WIN.x[1], 0])[0] && y <= at([0, WIN.y[0]])[1] && y >= at([0, WIN.y[1]])[1];
	const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));
	const coarse = SCALES.flatMap((s) => Array.from({ length: 3000 }, (_, k) => {
		const d = mul(n.inv, [n.f0 ** 0.5 * s * Math.cos((2 * Math.PI * k) / 3000), n.f0 ** 0.5 * s * Math.sin((2 * Math.PI * k) / 3000)]);
		return at([n.signed[0] + d[0], n.signed[1] + d[1]]);
	})).filter(inWin);
	const air = (b) => Math.min(...coarse.map((p) => toBox(b, p) - LINE_TOUCH / 2), S.clearance(b).d);
	// "best positive" above its dot, slid along the axis (its anchor from a third to nine tenths of its width) to where
	// it stands clearest of the contours
	let bp = null;
	for (let ax = 0.3; ax <= 0.9 + 1e-9; ax += 0.02) {
		const g = await placed(POS, pp[0], pp[1] - DOT - LABEL_GAP - 0.6, ax, 1, MATTER);
		const a = air(g.box);
		if (!bp || a > bp.a) bp = { a, g };
	}
	L.push(bp.g);
	const probe = await placed(SIGNED, 0, 0, 0.5, 0.5, ACCENT);
	const hw = (probe.box.r - probe.box.l) / 2, hh = (probe.box.b - probe.box.t) / 2;
	let best = null;
	for (let extra = 0; extra <= 0; extra += 0.5) for (let deg = 0; deg < 360; deg += 2) {
		const u = [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)];
		const reach = RING + LABEL_GAP + 0.6 + extra + Math.abs(u[0]) * hw + Math.abs(u[1]) * hh;
		const c = [ps[0] + u[0] * reach, ps[1] + u[1] * reach];
		const b = { l: c[0] - hw, r: c[0] + hw, t: c[1] - hh, b: c[1] + hh };
		const a = air(b);
		if (!best || a > best.a) best = { a, c, deg, extra };
	}
	L.push(await placed(SIGNED, best.c[0], best.c[1], 0.5, 0.5, ACCENT));
	const boxes = L.slice(2).filter((l) => !nums.includes(l)).map((l) => l.box);
	for (const g of nums) { const d = Math.min(...coarse.map((p) => toBox(g.box, p))); check(d >= CUT, `a contour passes near the number ${g.src} (${d} pt)`); }

	// ---- the contours
	for (const s of SCALES) {
		const f = n.f0 * s * s, r = Math.sqrt(f);
		const m = (t) => { const d = mul(n.inv, [r * Math.cos(t), r * Math.sin(t)]); return [n.signed[0] + d[0], n.signed[1] + d[1]]; };
		const page = (t) => at(m(t));
		const touch = s === 1;
		const keep = (t) => {
			const p = page(t);
			if (!inWin(p)) return false;
			if (boxes.some((b) => toBox(b, p) < CUT)) return false;
			if (touch && Math.abs(p[1] - q0[1]) < NEAR) return false;
			return true;
		};
		// sample t until every step is under a fifth of a point
		let ts = Array.from({ length: 1441 }, (_, k) => (2 * Math.PI * k) / 1440);
		for (let pass = 0; pass < 14; pass++) {
			const next = [ts[0]];
			for (let k = 1; k < ts.length; k++) {
				const a = page(ts[k - 1]), b = page(ts[k]);
				if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.2) next.push((ts[k - 1] + ts[k]) / 2);
				next.push(ts[k]);
			}
			if (next.length === ts.length) break;
			ts = next;
		}
		for (const t of ts) check(near(misfit(m(t)), f, 1e-12), `a point off the contour ${s}`);
		// the whole ellipse lies inside the window, at least AIR units from its edges: nothing is cut by the frame
		for (const t of ts) {
			const [x, y] = m(t);
			check(x > WIN.x[0] + AIR && x < WIN.x[1] - AIR && y > WIN.y[0] + AIR && y < WIN.y[1] - AIR, `the contour ${s} leaves the window at (${x}, ${y})`);
		}
		// runs of kept points; each end found by bisection on t
		const edge = (a, b) => { let ka = keep(a); for (let i = 0; i < 50; i++) { const c = (a + b) / 2; if (keep(c) === ka) a = c; else b = c; } return ka ? a : b; };
		const runs = [];
		let run = null;
		for (let k = 0; k < ts.length; k++) {
			const kk = keep(ts[k]);
			if (kk && !run) run = k > 0 ? [page(edge(ts[k - 1], ts[k]))] : [];
			if (kk) run.push(page(ts[k]));
			if (!kk && run) { run.push(page(edge(ts[k - 1], ts[k]))); runs.push(run); run = null; }
		}
		if (run) {
			// a run that reaches t = 2 pi joins the one that starts at t = 0
			if (runs.length && keep(0) && keep(ts[1])) runs[0] = [...run, ...runs[0]];
			else runs.push(run);
		}
		for (const pts of runs) {
			if (pts.length < 2) continue;
			check(longest(pts) <= 0.2 + 1e-6, `the contour ${s} has a step of ${longest(pts)} pt`);
			S.path(pts, { color: touch ? INK : FAINT, width: touch ? LINE_TOUCH : LINE, layer: 2, what: `the contour ${s}` });
		}
	}
	// the touching contour meets the edge m2 = 0 only at the positive minimum, where it is tangent: its highest point
	const top = mul(n.inv, mul(n.inv, [0, 1]));            // (A^T A)^{-1} e2, the direction to the highest point
	const k = Math.sqrt(n.f0 / top[1]);
	check(near(n.signed[0] + k * top[0], n.pos[0], 1e-12) && near(n.signed[1] + k * top[1], 0, 1e-12), 'the touching contour is not tangent to the axis at the positive minimum');

	S.checkAll(L);
	void DIM;
	window.tutPosNnls = { label: best, signed: n.signed, pos: n.pos, f0: n.f0, slope: n.g };
	return finish(S, L, [200, 340]);
}
