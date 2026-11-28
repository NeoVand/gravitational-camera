// The tutorial, section 8.1 (tutorial/quantum/states.md), its fourth diagram: a mass in two places behind a wall, a
// pixel outside that records where it is, and the fringes that the record leaves. Above, left: two thin rings, the
// traps, a distance d apart on a horizontal line, each holding a small ball of matter's colour, solid in L and outlined
// in R, with a bracket "d" and beneath it "(|L> + |R>)/sqrt 2". Middle: a grey wall, lightly hatched. Right, outside
// the wall, at the distance r from the middle of the two places (a dimension line above): a pixel, a ring of twelve
// free steel beads drawn twice, overlaid, on two slightly different ellipses: |e_L>, a solid line, the ring when the
// mass is at L, and |e_R>, dashed and fainter, when it is at R. Below, three small plots of P_R against phi, for the
// overlaps <e_R|e_L> = 1 (from 0 to 1), 0.5 (from 0.25 to 0.75) and 0 (flat at 1/2). Ink lines; no orange or blue.
// Departures from the diagram's comment: the places are named L and R above their traps, and the ball at L is the solid
// one and the record |e_L> the solid ellipse, so that each branch is drawn in one manner; the first plot alone names its
// axes and numbers its ends; the others carry the same ticks, name their axes P_R and phi again (the same axes) and
// number only their own extremes. The wall is named, "wall", under it. Each record's name has a thin ink leader to its
// own ring, met between two beads where that ring is the outer one (asserted): |e_L> to the solid ring near its top,
// |e_R> to the dashed ring at its right.
// Exact: the fringes, P_R = (1/2)(1 + cos theta cos phi) with the overlap cos theta, asserted against the four-entry
// state through the second mirror at every drawn point (tut-quantum-lib.js, `recordPR`), and their extremes 0 and 1,
// 0.25 and 0.75, and 1/2; the rings, the images of a circle under 1 - eps T, T = diag(-2, 1) (the tide of a point mass
// on the line, trace-free in the ring's plane), the ring for R stretched more along the line, since the mass at R is
// nearer (section 8.1's derivation: the difference of the tides is -12 G m d^2 / r^5 along the line). Schematic: every
// size and distance, and the rings' strains, hugely exaggerated (the caption says so).
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { STEEL, UNDISTURBED_W } from './tut-five-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, MATTER, recordPR, fringe, OVERLAPS } from './tut-quantum-lib.js';

const name = 'tut-mass-two-places';
const check = checker(name);
const TINT = '#eeebe5';                    // a neutral tint of the page (drawing.ts, THEME)

// ---- the scene (points, y down) ----------------------------------------------------------------------------------
const D = 40;                              // the two places apart
const BALL = 4.2, TRAP = 9.5;              // the ball's radius and its trap's
const TRAP_W = 0.45;
const WALL = { w: 11, h: 66, gap: 22, hatch: 4.2 };   // the wall: its width and height, from the R trap to it, the hatching's pitch
const RING = 19;                           // the pixel's ring, its undisturbed radius
const EPS = { L: 0.05, R: 0.12 };          // the rings' strains (exaggerated)
const BEAD = 1.7;
const PIXEL_GAP = 34;                      // from the wall to the pixel's centre
const BRACKET = { width: 0.5, hook: 2.2, off: 4 };
const LEAD = { L: 75, R: -15, len: 9 };     // the records' leaders: where each meets its ring (degrees from the line), and their reach
const LEAD_AIR = 2.6;                      // a leader stops this far short of its name's anchor
// ---- the fringes
const PW = 66, PH = 30, PLOT_GAP = 26;     // each plot's size, and the air between them
const STRIP = 20;                          // from the scene's lowest mark to the plots' tops

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const circle = (cx, cy, r) => `M${n2(cx - r)},${n2(cy)}a${n2(r)},${n2(r)} 0 1,0 ${n2(2 * r)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-2 * r)},0Z`;
	const loop = (cx, cy, r, n = 240) => Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);

	// ---- the two places, their traps and the ball in each
	const y = ORIGIN - 40;
	const xL = ORIGIN - 130, xR = xL + D, mid = (xL + xR) / 2;
	for (const [x, solid, key] of [[xL, true, 'L'], [xR, false, 'R']]) {
		S.raw(`<path d="${circle(x, y, TRAP)}" fill="none" stroke="${DIM}" stroke-width="${TRAP_W}"/>`, 1);
		S.mark(loop(x, y, TRAP), TRAP_W / 2, `the trap ${key}`);
		S.raw(solid
			? `<path d="${circle(x, y, BALL)}" fill="${MATTER}"/>`
			: `<path d="${circle(x, y, BALL - 0.3)}" fill="none" stroke="${MATTER}" stroke-width="0.6"/>`, 2);
		S.mark(loop(x, y, BALL), 0, `the ball ${key}`);
		L.push(await placed(key, x, y - TRAP - TRAP_W / 2 - LABEL_GAP - 0.3, 0.5, 1, INK));
	}
	// the bracket d, under the traps, between the balls' centres
	const by = y + TRAP + TRAP_W / 2 + BRACKET.off;
	S.path([[xL, by - BRACKET.hook], [xL, by], [xR, by], [xR, by - BRACKET.hook]], { color: DIM, width: BRACKET.width, cap: 'butt', layer: 2, what: 'the bracket d' });
	check(near(xR - xL, D), 'the bracket is not d');
	const dLabel = await placed('d', mid, by + BRACKET.width / 2 + LABEL_GAP, 0.5, 0, INK);
	L.push(dLabel);
	L.push(await placed('(|L\\rangle + |R\\rangle)/\\sqrt2', mid, dLabel.box.b + 4, 0.5, 0, INK));

	// ---- the wall: a grey slab, lightly hatched
	const wl = xR + TRAP + WALL.gap, wr = wl + WALL.w, wt = y - WALL.h / 2, wb = y + WALL.h / 2;
	{
		const id = `${name}-wall`;
		let d = '';
		for (let s = -WALL.h; s < WALL.w + WALL.h; s += WALL.hatch) d += `M${n2(wl + s)},${n2(wb)}L${n2(wl + s + WALL.h)},${n2(wt)}`;
		S.raw(`<clipPath id="${id}"><rect x="${n2(wl)}" y="${n2(wt)}" width="${WALL.w}" height="${WALL.h}"/></clipPath>` +
			`<rect x="${n2(wl)}" y="${n2(wt)}" width="${WALL.w}" height="${WALL.h}" fill="${TINT}"/>` +
			`<path d="${d}" clip-path="url(#${id})" stroke="${FAINT}" stroke-width="0.3" fill="none"/>` +
			`<rect x="${n2(wl)}" y="${n2(wt)}" width="${WALL.w}" height="${WALL.h}" fill="none" stroke="${DIM}" stroke-width="${AXIS}"/>`, 1);
		S.mark([[wl, wt], [wr, wt], [wr, wb], [wl, wb], [wl, wt]], AXIS / 2, 'the wall');
		S.boxes.push({ box: { l: wl, r: wr, t: wt, b: wb }, what: 'the wall' });
		L.push(await placed('\\text{wall}', (wl + wr) / 2, wb + AXIS / 2 + LABEL_GAP + 0.4, 0.5, 0, INK));
	}

	// ---- the pixel: the ring of twelve beads under each record, 1 - eps T with T = diag(-2, 1) along the line
	const px = wr + PIXEL_GAP + RING;
	const shape = (eps) => [1 + 2 * eps, 1 - eps];               // along the line, across it
	for (const key of ['L', 'R']) check(near(shape(EPS[key])[0] - 1 + 2 * (shape(EPS[key])[1] - 1), 0, 1e-12), 'a ring is not trace-free');
	check(EPS.R > EPS.L, 'the ring for R is not stretched more: the mass at R is nearer');
	const ell = {};
	for (const key of ['R', 'L']) {
		const [a, b] = shape(EPS[key]).map((s) => s * RING);
		const pts = Array.from({ length: 721 }, (_, k) => { const t = (k * Math.PI) / 360; return [px + a * Math.cos(t), y + b * Math.sin(t)]; });
		const solid = key === 'L';
		let dash = '';
		if (!solid) {
			// a whole number of dashes round the ellipse
			let len = 0;
			for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
			const n = Math.round(len / 3.4), p = len / n;
			dash = ` stroke-dasharray="${(0.6 * p).toFixed(3)} ${(0.4 * p).toFixed(3)}"`;
		}
		S.raw(`<path d="M${pts.map(([u, v]) => `${n2(u)},${n2(v)}`).join('L')}Z" fill="none" stroke="${solid ? INK : DIM}" stroke-width="${solid ? 0.55 : UNDISTURBED_W}"${dash}/>`, 1);
		S.mark(pts, 0.3, `the ring ${key}`);
		for (let k = 0; k < 12; k++) {
			const t = (2 * Math.PI * k) / 12, c = [px + a * Math.cos(t), y + b * Math.sin(t)];
			check(near(((c[0] - px) / a) ** 2 + ((c[1] - y) / b) ** 2, 1, 1e-12), `a bead of ring ${key} is off its ellipse`);
			S.sphere(c, BEAD, STEEL, { spec: 0.6, shininess: 36, layer: solid ? 3 : 2, opacity: solid ? 1 : 0.55 }, `a bead of ring ${key}`);
		}
		ell[key] = { a, b };
	}
	check(ell.R.a > ell.L.a && ell.L.b > ell.R.b, 'the rings do not part as drawn');
	// each record's name with a leader to its own ring, between two beads, where that ring is the outer one: |e_L> to
	// the solid ring above, |e_R> to the dashed ring at the right
	const onRing = (key, deg) => { const t = (deg * Math.PI) / 180; return [px + ell[key].a * Math.cos(t), y - ell[key].b * Math.sin(t)]; };
	const lead = async (src, key, deg, end, ax, ay) => {
		const q = onRing(key, deg), other = onRing(key === 'L' ? 'R' : 'L', deg);
		check(Math.hypot(q[0] - px, q[1] - y) > Math.hypot(other[0] - px, other[1] - y), `the leader to ${key} does not meet its ring where it is outside`);
		const lab = await placed(src, end[0], end[1], ax, ay, INK);
		const u = [end[0] - q[0], end[1] - q[1]], l = Math.hypot(...u);
		const from = [q[0] + (u[0] / l) * 0.9, q[1] + (u[1] / l) * 0.9], to = [end[0] - (u[0] / l) * LEAD_AIR, end[1] - (u[1] / l) * LEAD_AIR];
		S.path([from, to], { color: INK, width: HAIR, cap: 'butt', layer: 4, what: `the leader to ${key}` });
		L.push(lab);
	};
	{
		const qL = onRing('L', LEAD.L), qR = onRing('R', LEAD.R);
		await lead('|e_L\\rangle', 'L', LEAD.L, [qL[0] + LEAD.len * 0.55, qL[1] - LEAD.len], 0, 1);
		await lead('|e_R\\rangle', 'R', LEAD.R, [qR[0] + LEAD.len, qR[1] + LEAD.len * 0.75], 0, 0);
	}

	// ---- the distance r: a dimension line above the wall, from the middle of the places to the pixel's centre
	const ry = wt - 9;
	S.path([[mid, ry], [px, ry]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the dimension r' });
	for (const x of [mid, px]) S.path([[x, ry - TICK], [x, ry + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'a tick of r' });
	S.dots([px, ry + TICK + 1.2], [px, y - ell.L.b - BEAD - 15], { color: DIM, layer: 1, what: 'the extension at the pixel' });
	S.dots([mid, ry + TICK + 1.2], [mid, y - 3], { color: DIM, layer: 1, what: 'the extension at the places' });
	L.push(await placed('r', (mid + px) / 2, ry - HAIR / 2 - LABEL_GAP, 0.5, 1, INK));

	// ---- the fringes: three plots under the scene
	const low = Math.max(wb, ...L.map((l) => l.box.b));
	const total = 3 * PW + 2 * PLOT_GAP;
	const left0 = (xL - TRAP + px + ell.R.a) / 2 - total / 2;
	for (const [i, o] of OVERLAPS.entries()) {
		const P = new Plot({ left: left0 + i * (PW + PLOT_GAP), top: low + STRIP, w: PW, h: PH, x0: 0, x1: 2 * Math.PI, y0: 0, y1: 1 });
		S.path([[P.X(0), P.Y(0)], [P.X(2 * Math.PI), P.Y(0)]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: `plot ${i}: phi` });
		S.path([[P.X(0), P.Y(0)], [P.X(0), P.Y(1)]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: `plot ${i}: P` });
		for (const t of [0, Math.PI, 2 * Math.PI]) S.path([[P.X(t), P.Y(0)], [P.X(t), P.Y(0) + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `plot ${i}: a tick` });
		for (const v of [0, 0.5, 1]) S.path([[P.X(0), P.Y(v)], [P.X(0) - TICK, P.Y(v)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `plot ${i}: a tick` });
		const f = (phi) => fringe(phi, o);
		const pts = graph(P, f, 0, 2 * Math.PI);
		check(longest(pts) <= 0.2501, 'a fringe is too coarse');
		const theta = Math.acos(o);
		for (const [x] of pts) { const phi = ((x - P.left) / P.w) * 2 * Math.PI; check(Math.abs(recordPR(phi, theta) - f(phi)) < 1e-12, `plot ${i}: the four-entry state disagrees at ${phi}`); }
		S.path(pts, { color: INK, width: CURVE, layer: 2, what: `plot ${i}: the fringe` });
		// the numbers
		const hi = f(0), lo = f(Math.PI);
		if (i === 0) {
			check(hi === 1 && lo === 0, 'overlap 1');
			for (const [v, src] of [[0, '0'], [1, '1']]) L.push(await placed(src, P.X(0) - TICK - 2.8, P.Y(v), 1, 0.5, DIM));
			for (const [t, src] of [[0, '0'], [2 * Math.PI, '2\\pi']]) L.push(await placed(src, P.X(t), P.Y(0) + TICK + 2.6, 0.5, 0, DIM));
			L.push(await S.clear('P_R', P.X(0), P.Y(1) - 6, 0.5, 1, [0, -1]));
			{
				const twoPi = L.find((l) => l.src === '2\\pi').box;
				L.push(await placed('\\phi', twoPi.r + LABEL_GAP + 1, (twoPi.t + twoPi.b) / 2, 0, 0.5, DIM));
			}
		} else {
			// the same axes as the first: their names again, not their numbers
			L.push(await S.clear('P_R', P.X(0), P.Y(1) - 6, 0.5, 1, [0, -1]));
			L.push(await placed('\\phi', P.X(2 * Math.PI) + LABEL_GAP + 1, P.Y(0), 0, 0.5, DIM));
		}
		if (i === 1) {
			check(hi.toFixed(2) === '0.75' && lo.toFixed(2) === '0.25', 'overlap 0.5');
			L.push(await S.clear('0.75', P.X(2 * Math.PI) + CURVE / 2 + LABEL_GAP, P.Y(hi), 0, 0.5, [1, 0], { color: DIM }));
			L.push(await S.clear('0.25', P.X(Math.PI), P.Y(lo) - CURVE / 2 - LABEL_GAP, 0.5, 1, [0, -1], { color: DIM }));
		} else if (i === 2) {
			check(hi === 0.5 && lo === 0.5, 'overlap 0');
			L.push(await S.clear('1/2', P.X(2 * Math.PI) + CURVE / 2 + LABEL_GAP, P.Y(0.5), 0, 0.5, [1, 0], { color: DIM }));
		}
		const ov = o === 0.5 ? '0.5' : String(o);
		L.push(await placed(`\\langle e_R|e_L\\rangle = ${ov}`, P.X(Math.PI), P.Y(0) + TICK + 13, 0.5, 0, INK));
	}

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
