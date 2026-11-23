// The tutorial, chapter 1.3 (tutorial/newton/gauss-and-poisson.md), its fifth diagram: the pillbox across a uniform
// sheet. A flat sheet (a pale band: its top face, seen nearly edge-on), and a pillbox standing across it: a short
// upright cylinder with flat ends of area A at the heights z and -z, drawn in true 3D (an orthographic view tilted as
// lib.js's Panel does; the half of the lower end hidden by the cylinder dashed). The disc of the sheet inside the
// pillbox, of mass sigma A, is shaded (orange). The field points toward the sheet from above and from below: blue
// arrows cross the two ends (inward, so that each end has the flux -gA), and grey arrows beside the curved side run
// parallel to it (no flux). Exact: all arrows have the same length (asserted in 3D and as drawn: they are upright,
// so the view shortens them all by the same factor) and point toward the sheet; the end arrows cross the ends at
// their middles, at right angles; the side arrows are parallel to the side's axis; the ends are at the heights
// +z and -z, the same distance from the sheet; the ellipses are circles in 3D, sampled every quarter of a point.
// Schematic: the proportions, the arrows' length, and the sheet's extent.
import { Panel, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, AXIS, AXIS_HEAD, VEC, VEC_HEAD, DASH } from './tut-vec-lib.js';
import { TINT, TINT_ACCENT, EDGE, face, cameraAxes } from './tut-gauss-lib.js';

export const RHO = 0.6;                    // the pillbox's radius, units
export const H = 0.64;                     // z, the height of each end above or below the sheet
export const LEN = 0.46;                   // every arrow's length
const ENDS_AT = [-0.42, 0.42];             // the end arrows, across the end, fractions of the radius
const SIDE_AT = 0.32;                      // the side arrows, this far outside the side, units
const SHEET = { x: 1.5, z: 0.8 };          // the sheet's half-extent, units
const TILT = 13;                           // the view, degrees
const S = 92;                              // points per unit
const name = 'tut-gauss-pillbox';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: 0 });
	const ink = new Sheet(P, name);
	const [, , toward] = cameraAxes(P);
	const up = v3(0, 1, 0);

	// ---- the sheet: its top face, a pale band beneath everything
	face(ink, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => v3(i * SHEET.x, 0, j * SHEET.z)), TINT, -6);

	// ---- the circles: the two ends and the disc of the sheet inside the pillbox
	const circle = (y) => {
		const n = 2 * Math.ceil((Math.PI * RHO * S) / 0.25);
		return Array.from({ length: n + 1 }, (_, k) => v3(RHO * Math.cos((2 * Math.PI * k) / n), y, RHO * Math.sin((2 * Math.PI * k) / n)));
	};
	// the front half (toward the viewer: z >= 0, the first half of the circle's points) and the back half, each one run
	const halves = (pts) => {
		const m = (pts.length - 1) / 2;
		check(Number.isInteger(m), 'a circle\'s points do not split in two halves');
		const front = pts.slice(0, m + 1), back = pts.slice(m);
		check(front.every((p) => p.dot(toward) - p.y * toward.y >= -1e-12) && back.every((p) => p.dot(toward) - p.y * toward.y <= 1e-12), 'a half of a circle is not the near or the far half');
		return { front, back };
	};
	const disc = circle(0);
	face(ink, disc, TINT_ACCENT, -5);
	ink.curve(disc, { color: ACCENT, width: HAIR, layer: -4, what: 'the disc\'s edge' });
	const top = circle(H), bottom = circle(-H);
	ink.curve(top, { color: INK, width: EDGE, layer: 1, what: 'the top end' });
	const hb = halves(bottom);
	ink.curve(hb.front, { color: INK, width: EDGE, layer: 1, what: 'the bottom end, in front' });
	// the back half dashed: dashes of the pattern's length along the curve as drawn
	ink.P.curve(hb.back, { color: INK, width: HAIR, layer: 0, dash: DASH, cap: 'butt' });
	ink.mark(hb.back.map((p) => ink.at(p)), HAIR / 2, 'the bottom end, behind');
	// the curved side: its two outlines, where the side turns away from the viewer
	for (const s of [-1, 1]) ink.line(v3(s * RHO, -H, 0), v3(s * RHO, H, 0), { color: INK, width: EDGE, layer: 1, what: `the side ${s}` });
	check(near(v3(1, 0, 0).dot(toward), 0, 1e-12), 'the side\'s outlines are not where it turns away from the viewer');

	// ---- the arrows: all LEN long, pointing toward the sheet, centred at the ends' heights: those across the ends on
	// the ends themselves, those beside the side a little outside it
	const arrows = [];
	for (const s of [1, -1]) {
		for (const f of ENDS_AT) {
			const c = v3(f * RHO, s * H, 0);
			arrows.push({ a: c.clone().addScaledVector(up, (s * LEN) / 2), b: c.clone().addScaledVector(up, (-s * LEN) / 2), color: ACCENT2, width: VEC, head: VEC_HEAD, what: `an arrow across the ${s > 0 ? 'top' : 'bottom'} end` });
		}
		for (const side of [-1, 1]) {
			const c = v3(side * (RHO + SIDE_AT), s * H, 0);
			arrows.push({ a: c.clone().addScaledVector(up, (s * LEN) / 2), b: c.clone().addScaledVector(up, (-s * LEN) / 2), color: DIM, width: VEC, head: VEC_HEAD, what: `an arrow beside the side ${side}, ${s > 0 ? 'above' : 'below'}` });
		}
	}
	const drawn = arrows.map((x) => ink.arrow(x.a, x.b, { color: x.color, width: x.width, head: x.head, layer: 3, what: x.what }));
	for (const [k, x] of arrows.entries()) {
		const d = x.b.clone().sub(x.a);
		check(near(d.length(), LEN, 1e-12) && near(drawn[k].L, drawn[0].L, 1e-9), 'the arrows are not all the same length');
		check(d.clone().normalize().dot(v3(0, -Math.sign(x.a.y), 0)) > 1 - 1e-12, 'an arrow does not point straight at the sheet');
		check(Math.min(Math.abs(x.a.y), Math.abs(x.b.y)) > 0.15, 'an arrow reaches the sheet');
	}

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('A', sc(v3(0, H, 0)), unit(0, 1), 0, INK));
	L.push(await ink.label('\\sigma A', sc(v3(0, 0, 0)), unit(0, 1), 0, ACCENT));
	L.push(await ink.label('z', sc(v3(RHO, H, 0)), unit(1, 0), 2.2, INK));
	L.push(await ink.label('-z', sc(v3(RHO, -H, 0)), unit(1, 0), 2.2, INK));
	L.push(await ink.label('g', sc(v3(-RHO - SIDE_AT, H, 0)), unit(-1, 0), 2.4, DIM));
	void AXIS; void AXIS_HEAD;

	ink.checkAll(L);
	return finish(name, P, L, [240, 320]);
}
