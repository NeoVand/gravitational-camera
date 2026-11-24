// The tutorial, chapter 13.1 (tutorial/what-a-field-keeps/push-and-pass.md), its first diagram: the two orders of one
// pass. The pair of the paper's fig:passing side by side, as the paper's figs/ladder.js draws them cut open (the stone of
// sprites/hair/shell.png, an octant removed): left, a thin shell of mass M and radius R/sqrt 2, inside the faint dotted
// circle of radius R; right, M/2 at the centre of a shell of radius R that holds the other half, the iron point seen in
// the cut. Each under its own copy of one pass at b = 1.5 R, seen from the side: a long straight path, a steel bead at
// its start, that leaves bent toward the body, its straight line continued dashed and the angle between the two marked
// by a thin arc. One label above both, "first order: the same", with "(angles exaggerated)". Below each body a bar of
// the internal energy the pass leaves, in matter's colour, to one scale, with its value: 0.080 and 0.104 (units of
// M C^2 / 2 R^2), and one label below both, "second order: different".
// Departures from the diagram's comment: none. The angle carries no symbol, since the chapter names it only in words.
// Exact: the bars and their values (tut-pass-lib.js: the closed form for thin shells, asserted against the paper's
// code, app/src/lib/hair/passing.ts, read out, and against the chapter's planar series), b = 1.5 R and the radii; the
// path's shape for the drawn angle A, y(x) = b - (A/2)(x + sqrt(x^2 + b^2)), the straight-line (impulse) path of a
// passer bent by a point mass, which both bodies are outside b; it is the same for both, as the text derives. Schematic:
// the size of the angle, A = 0.16 rad against the steel ball's 1.9 x 10^-16 (the label and the caption say so).
// Pictorial: the cut-open stone and the iron point (the paper's), the thickness of the skins, the bead.
import { INK, DIM, FAINT } from '../lib.js';
import { STEEL, IRON, text, circle as circlePath } from '../stone.js';
import { stoneDefs, stone } from './tut-null-lib.js';
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, LINE, HAIR, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { sprite } from '../lib.js';
import { POINT } from './ladder.js';
import { chapter, TWINS, PASS, MATTER, STONE_INK, near } from './tut-pass-lib.js';

const name = 'tut-pass-two-orders';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const R = 27;                              // points per R
const APART = 158;                         // between the bodies' centres
const FROM = -2.25, TO = 2.75;             // the path's ends, in R from above the centre
const ANGLE = 0.16;                        // the drawn angle, rad
const ARC = 2.05;                          // the arc's radius, in R, about the point where the asymptotes cross
const BEAD = 2.3;                          // the passer
const RIM = 0.35;
const BAR = 520, BAR_H = 6.2;              // points per unit of energy, a bar's thickness
const BAR_GAP = 13;                        // from a body's bottom (at R) to its bar
const caption = 'Look first at the two bars: one pass leaves 0.080 and 0.104, in units of $\\matter MC^2/2R^2$, inside two bodies that the pass bends by exactly the same angle. Left, a thin shell of radius $R/\\sqrt2$; right, half the mass at the centre of a shell of radius $R$. The bending is drawn much larger than it is, alike for both, and the cutaway bodies are pictures.';

/** The path's height above the centre, in R, at x (in R) along it: the straight-line path bent by a point mass. */
const pathY = (x) => { const h = Math.hypot(x, PASS); return PASS - (ANGLE / 2) * (x < 0 ? (PASS * PASS) / (h - x) : x + h); };
const slope = (x) => -(ANGLE / 2) * (1 + x / Math.sqrt(x * x + PASS * PASS));

export default async function () {
	const { state, E } = await chapter(check);
	state(name, 'pass-two-orders', caption);
	const S = new Sheet(name);
	const L = [];
	const shell = await sprite('/figures3d/sprites/hair/shell.png');
	S.raw(stoneDefs(`${name}-shell`, shell, R), 0);
	const top = ORIGIN - 2.35 * R;              // the shared label's top
	const yc = ORIGIN;                          // the bodies' centres
	// the path's shape: far before the body it is the straight line at b, far after it turns by ANGLE
	check(near(pathY(-1e6), PASS, 1e-6) && near(-slope(1e7), ANGLE, 1e-6), 'the path\'s asymptotes');
	check(Array.from({ length: 501 }, (_, k) => FROM + ((TO - FROM) * k) / 500).every((x) => Math.hypot(x, pathY(x)) > 1.3), 'the path comes near the body');

	const arcs = [];
	for (const [i, b] of TWINS.entries()) {
		const cx = ORIGIN + (i - 0.5) * APART;
		const P = (x, y) => [cx + x * R, yc - y * R];
		const outer = Math.max(...b.shells.map(([, r]) => r)), r = outer * R;
		check(i === 0 ? near(outer, Math.SQRT1_2, 1e-15) : outer === 1 && b.shells.some(([, rr]) => rr === 0), `the body ${b.key}`);
		// ---- the body cut open (figs/ladder.js), the point at the centre
		// the picture embedded once (tut-null-lib.js), shown at each body's size
		S.raw(stone(`${name}-${i}`, `${name}-shell`, cx, yc, r, circlePath(cx, yc, r), outer) +
			`<path d="${circlePath(cx, yc, r)}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 1);
		S.mark(Array.from({ length: 181 }, (_, k) => P(outer * Math.cos((k * Math.PI) / 90), outer * Math.sin((k * Math.PI) / 90))), RIM / 2, `body ${i}`);
		if (b.shells.some(([, rr]) => rr === 0)) S.sphere([cx, yc], POINT * R, IRON, { spec: 0.45, shininess: 30, layer: 2 }, 'the point');
		if (outer < 1) {
			S.raw(`<circle cx="${n2(cx)}" cy="${n2(yc)}" r="${R}" fill="none" stroke="${FAINT}" stroke-width="0.35" stroke-dasharray="1.1 1.7"/>`, 0.5);
			S.mark(Array.from({ length: 181 }, (_, k) => P(Math.cos((k * Math.PI) / 90), Math.sin((k * Math.PI) / 90))), 0.2, `the circle R ${i}`);
		}

		// ---- the path: the curve, a bead at its start, a head at its end
		const n = 400, xs = Array.from({ length: n + 1 }, (_, k) => FROM + ((TO - FROM) * k) / n);
		const pts = xs.map((x) => P(x, pathY(x)));
		const headAt = pts.findIndex((q) => Math.hypot(pts[n][0] - q[0], pts[n][1] - q[1]) <= VEC_HEAD * 1.5);
		S.path(pts.slice(0, headAt + 1), { color: INK, width: LINE, layer: 2, what: `path ${i}` });
		S.arrow(pts[headAt], pts[n], { color: INK, width: LINE, head: VEC_HEAD, layer: 2, what: `path ${i}'s head` });
		S.sphere(pts[0], BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `the passer ${i}`);
		// the straight line continued, dashed, its dashes kept clear of the path
		const clash = (q, gap) => pts.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < gap + LINE / 2);
		const from = P(-0.4, PASS), to = P(TO, PASS);
		const dashes = dashed(S, from, to, { clash, color: DIM, width: HAIR, layer: 1.5, dash: [2.0, 1.6], what: `the straight line ${i}` });
		S.mark([from, to], HAIR / 2, `the straight line ${i}`);
		// the angle: an arc about the point where the two asymptotes cross (above the centre, at b), from the straight
		// line down to the path
		const O = [0, PASS];
		// its radius: the middle of the dash nearest ARC, so that the arc stands on a dash
		const foot = dashes.map(([a, b]) => (a + b) / 2 / R - 0.4).reduce((best, m) => (Math.abs(m - ARC) < Math.abs(best - ARC) ? m : best));
		check(Math.abs(foot - ARC) < 0.1, 'no dash near the arc');
		const ARC_R = foot;
		let lo = 0, hi = 0.5;
		const below = (t) => { const x = ARC_R * Math.cos(t), y = PASS - ARC_R * Math.sin(t); return y < pathY(x); };
		for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (below(m)) hi = m; else lo = m; }
		const t1 = lo - (LINE / 2 + 0.05) / (ARC_R * R);     // stop where the arc meets the path's edge
		const arc = Array.from({ length: 41 }, (_, k) => { const t = (t1 * k) / 40; return P(O[0] + ARC_R * Math.cos(t), O[1] - ARC_R * Math.sin(t)); });
		S.path(arc, { color: DIM, width: HAIR, layer: 1.6, cap: 'butt', what: `the arc ${i}` });
		arcs.push(t1);

		// ---- the bar of the energy left inside
		const y = yc + R + BAR_GAP, x0 = cx - R, w = E[i] * BAR;
		S.fill(`M${n2(x0)},${n2(y)}h${n2(w)}v${BAR_H}h${n2(-w)}Z`, { l: x0, r: x0 + w, t: y, b: y + BAR_H }, { color: MATTER, layer: 1, what: `bar ${i}` });
		L.push(await placed(E[i].toFixed(3), x0 + w + LABEL_GAP + 0.6, y + BAR_H / 2, 0, 0.5, INK));
	}
	check(near(arcs[0], arcs[1], 1e-12), 'the two angles are not drawn alike');
	check(E.every((e) => e * BAR < 2.2 * R), 'a bar is longer than its panel');

	// ---- the two shared labels
	{
		// "first order: the same" and, dim, "(angles exaggerated)", on one baseline, centred together
		const a = await placed(text('first order: the same'), 0, 0, 0, 0, INK), b = await placed(text('(angles exaggerated)'), 0, 0, 0, 0, DIM);
		const space = 4.2, wa = a.box.r - a.box.l, wb = b.box.r - b.box.l, x0 = ORIGIN - (wa + space + wb) / 2;
		L.push(await placed(text('first order: the same'), x0, top, 0, 0, INK));
		L.push(await placed(text('(angles exaggerated)'), x0 + wa + space, top, 0, 0, DIM));
	}
	const barBottom = yc + R + BAR_GAP + BAR_H;
	L.push(await placed(text('second order: different'), ORIGIN, barBottom + 9, 0.5, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { energies: E, angle: ANGLE };
	return finish(S, L, [280, 360]);
}
