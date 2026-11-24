// The tutorial, chapter 7.8 (tutorial/geometry/wave-energy.md), its second diagram: the directions and angles of the
// memory. Drawn in true 3D, in orthographic projection, from the direction (0.45, 0.20, 0.87) in the camera's frame
// (N-hat, e_1, e_2), the view turned about its own axis so that N-hat runs straight to the right. A small filled dot,
// the source, in matter's colour. From it two thin ink arrows of one length in space: N-hat, "N-hat, to the camera",
// ending before a small camera in the observer's colour, and n' at beta = 40 degrees from N-hat and psi = 35 degrees
// round it from e_1, "n', emission"; the arc of beta between them. At 0.6 of the arrows' length along N-hat a thin
// circle across N-hat, centred on it, of radius 0.6 tan(beta), so that n' passes through it: the cone of directions at
// beta from N-hat, cut. From its centre the short axes e_1 (up) and e_2 (toward the viewer, drawn down and to the
// left), a dashed radius to the point where n' crosses the circle, and the arc of psi from e_1 to it. Through the
// source, a fainter dashed axis z-hat = cos(theta) N-hat + sin(theta) e_1 at theta = 115 degrees, on the e_1 side of
// N-hat, "z-hat, the burst's axis", with the arc of theta from z-hat to N-hat and the arc of theta' from z-hat to n'.
// No orange or blue.
// Departures from the diagram's comment: the dashed line in the circle's plane ends where n' itself crosses that
// plane, not at the foot of n's shadow: the circle is drawn with the radius that makes the two the same direction from
// the centre, so that the circle is the cone of all directions at beta from N-hat and the dashed radius is n's part
// across N-hat (asserted). That radius, 0.6 tan(40 degrees) of the arrows' length, would fill the drawing if the
// circle stood at two thirds of N-hat's length with N-hat ending at the camera; it stands at 0.6 of the arrows'
// length, which leaves room under N-hat, beyond the circle, for N-hat's name. Where a line passes in front of another
// it is cut clear of it by a halo of the page's colour: N-hat in front of the circle at one crossing and behind it at
// the other, n' in front of the circle where it leaves it and in front of the arc of theta (each decided by depth).
// Exact: every point is the orthographic image of the chapter's vectors (tut-memory-lib.js, `chapter`, asserts
// e_1 x e_2 = N-hat, n' = cos(beta) N-hat + sin(beta)(cos(psi) e_1 + sin(psi) e_2), z-hat = cos(theta) N-hat +
// sin(theta) e_1, cos(theta') = cos(theta) cos(beta) + sin(theta) sin(beta) cos(psi), psi the turn from e_1 toward
// e_2 of n's part across N-hat); e_2 points toward the reader; each arc lies in the plane of its two directions, at its
// own radius about the source or the circle's centre (asserted); the arcs measure 40, 35, 115 and theta' = 81.2
// degrees (asserted). Schematic: the lengths, the camera's distance and the camera itself (a rounded body, a round lens toward the source
// and a viewfinder, drawn here: the paper's camera, figures3d/sprites/camera.png, is an engraving, not a glyph in the
// observer's colour). N-hat's name reaches past the camera, so that the camera never stands at the figure's edge.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, VEC, VEC_HEAD, AXIS, AXIS_HEAD, HAIR } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { stack } from './tut-curvature-lib.js';
import { INK, DIM, FAINT, PAGE } from '../lib.js';
import { chapter, palette, OBS, MATTER, FRAME, DRAWN, emission, axisZ, dot, cross, comb, angle, rad, deg } from './tut-memory-lib.js';

const name = 'tut-memory-angles';
const check = checker(name);

const SCALE = 150;                         // points per unit length in space
const LN = 1.35;                           // N-hat's and n's arrows, one length in space
const VIEW = [0.45, 0.2];                  // the view's direction toward the reader: its N-hat and e_1 parts
const PLANE = 0.6;                         // the circle's plane, along N-hat
const AX = 0.28;                           // e_1 and e_2, in space
const Z_REACH = [-0.3, 0.86];              // the axis z-hat, from and to, in space
const ARC = { theta: 0.15, beta: 0.29, thetaP: 0.41, psi: 0.2 };   // the arcs' radii, in space
const SOURCE = 2.2;                        // the source's dot, points
const CAM = { w: 12, h: 8, round: 1.7, lens: 3, glass: 1.5, bump: [4.4, 1.9, 0.7], gap: 2.2, room: 4 };   // the
// camera: its body (width, height, corner radius), the lens's radius and the glass's within it, the viewfinder (width,
// height, corner radius), the air from N-hat's tip to the lens, and the label's overhang beyond the body's right edge
const TP_AT = 0.5;                         // where theta's name stands along its arc, from z-hat
const N_AT = 0.62;                         // where n's name stands along its shaft, a fraction of its length
const HALO = 1.6;                          // the page's colour each side of a line that passes in front
const THIN = 0.5;                          // the circle and the dashed lines

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const { N, e1, e2 } = FRAME;
	const beta = rad(DRAWN.beta), psi = rad(DRAWN.psi), theta = rad(DRAWN.theta);
	const np = emission(beta, psi), z = axisZ(theta);
	const thetaP = angle(z, np);
	check(near(Math.cos(thetaP), Math.cos(theta) * Math.cos(beta) + Math.sin(theta) * Math.sin(beta) * Math.cos(psi), 1e-14) && deg(thetaP).toFixed(1) === '81.2', `theta' = ${deg(thetaP)}`);

	// ---- the view: D toward the reader; right along N-hat's image; up = D x right
	const D = (() => { const d = [VIEW[0], VIEW[1], Math.sqrt(1 - VIEW[0] ** 2 - VIEW[1] ** 2)]; return d; })();
	const Rt = (() => { const r = comb([1, N], [-dot(N, D), D]); const l = Math.sqrt(dot(r, r)); return r.map((v) => v / l); })();
	const Up = cross(D, Rt);
	check(near(dot(D, D), 1, 1e-14) && near(dot(Rt, Up), 0, 1e-14) && near(dot(Up, Up), 1, 1e-14) && near(dot(cross(Rt, Up), D), 1, 1e-14), 'the view\'s frame');
	const O = [ORIGIN - 110, ORIGIN + 30];
	const P = (p) => [O[0] + SCALE * dot(p, Rt), O[1] - SCALE * dot(p, Up)];
	const depth = (p) => dot(p, D);
	const pg = (v) => [dot(v, Rt), -dot(v, Up)];             // a direction on the page (y down), unnormalised
	const unit2 = (v) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l]; };
	check(near(pg(N)[1], 0, 1e-14) && pg(N)[0] > 0 && pg(e1)[1] < 0 && pg(e2)[0] < 0 && pg(e2)[1] > 0, 'N-hat is not to the right, e_1 up, e_2 down and to the left');
	check(depth(e2) > 0, 'e_2 does not point toward the reader');

	// ---- the circle across N-hat: radius PLANE tan(beta), so that n' crosses it
	const C3 = N.map((v) => PLANE * v), rho = PLANE * Math.tan(beta);
	const onCircle = (a) => comb([1, C3], [rho * Math.cos(a), e1], [rho * Math.sin(a), e2]);
	const crossing = np.map((v) => (PLANE / Math.cos(beta)) * v);           // where n' meets the circle's plane
	check(near(dot(crossing, N), PLANE, 1e-14) && near(Math.hypot(...comb([1, crossing], [-1, C3])), rho, 1e-12), 'n\' does not cross the circle');
	check(near(Math.hypot(...comb([1, crossing], [-1, onCircle(psi)])), 0, 1e-12), 'n\' crosses the circle elsewhere than at psi');
	const circle = Array.from({ length: 1441 }, (_, k) => P(onCircle((2 * Math.PI * k) / 1440)));
	S.path(circle, { color: INK, width: THIN, layer: 1, closed: true, what: 'the circle' });

	// ---- the arrows N-hat and n', one length in space
	const tipN = N.map((v) => LN * v), tipP = np.map((v) => LN * v);
	check(PLANE / Math.cos(beta) < 1, 'n\' ends before the circle');
	const aN = S.arrow(P([0, 0, 0]), P(tipN), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'N-hat' });
	const aP = S.arrow(P([0, 0, 0]), P(tipP), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'n\'' });
	// N-hat and the circle: where they cross on the page, the nearer is cut clear of the farther
	{
		// U.(C3 + rho (cos a e1 + sin a e2)) = 0, with U.C3 = 0: tan a = -(U.e1)/(U.e2)
		const a0 = Math.atan2(-dot(Up, e1), dot(Up, e2));
		for (const a of [a0, a0 + Math.PI]) {
			const c = onCircle(a), q = P(c);
			check(near(q[1], O[1], 1e-9), 'the crossing is not on N-hat');
			const s = dot(c, Rt) / dot(N, Rt), along = N.map((v) => s * v);   // the point of N-hat seen there
			const front = depth(along) > depth(c) ? 'N-hat' : 'circle';
			const t = front === 'N-hat' ? [1, 0] : unit2(pg(comb([-Math.sin(a), e1], [Math.cos(a), e2])));
			const h = 4.2, A = [q[0] - t[0] * h, q[1] - t[1] * h], B = [q[0] + t[0] * h, q[1] + t[1] * h];
			if (front === 'N-hat') S.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${PAGE}" stroke-width="${VEC + 2 * HALO}" stroke-linecap="butt"/>`, 2.5);
			else {
				const piece = Array.from({ length: 41 }, (_, k) => P(onCircle(a + ((k - 20) / 20) * (h / (SCALE * rho)) * 1.6)));
				S.raw(`<path d="M${piece.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" stroke="${PAGE}" stroke-width="${THIN + 2 * HALO}" fill="none" stroke-linecap="butt"/>`, 3.5);
				S.raw(`<path d="M${piece.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" stroke="${INK}" stroke-width="${THIN}" fill="none" stroke-linecap="butt"/>`, 3.6);
			}
			S.crossings = [...(S.crossings ?? []), front];
		}
		check(S.crossings.includes('N-hat') && S.crossings.includes('circle'), `the crossings: ${S.crossings}`);
	}
	// n' and the circle: besides the point where n' meets it in space, n' crosses its image once more on the page
	{
		const A0 = P([0, 0, 0]), u = aP.u, Lp = aP.L;
		const found = [];
		const K = 2880;
		for (let k = 0; k < K; k++) {
			const a = (2 * Math.PI * k) / K, b = (2 * Math.PI * (k + 1)) / K, p = P(onCircle(a)), q = P(onCircle(b));
			// the segment p q against the line A0 + s u: the signed distances change sign
			const side = (r) => (r[0] - A0[0]) * u[1] - (r[1] - A0[1]) * u[0];
			if (side(p) * side(q) > 0) continue;
			const f = side(p) / (side(p) - side(q)), ang = a + f * (b - a), r = P(onCircle(ang));
			const s = (r[0] - A0[0]) * u[0] + (r[1] - A0[1]) * u[1];
			if (s < 0 || s > Lp) continue;
			if (!found.some((c) => Math.abs(c.ang - ang) < 1e-3)) found.push({ ang, s, r });
		}
		const meet = found.filter((c) => Math.hypot(...comb([1, onCircle(c.ang)], [-1, crossing])) < 1e-3);
		const other = found.filter((c) => !meet.includes(c));
		check(meet.length === 1 && other.length === 1, `n' crosses the circle's image ${found.length} times`);
		const c = other[0], onN = np.map((v) => (c.s / (SCALE * Math.hypot(...pg(np)))) * v);
		const front = depth(onN) > depth(onCircle(c.ang)) ? 'n\'' : 'circle';
		const h = 4.2;
		if (front === 'n\'') {
			const A = [A0[0] + u[0] * (c.s - h), A0[1] + u[1] * (c.s - h)], B = [A0[0] + u[0] * (c.s + h), A0[1] + u[1] * (c.s + h)];
			S.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${PAGE}" stroke-width="${VEC + 2 * HALO}" stroke-linecap="butt"/>`, 2.5);
		} else {
			const piece = Array.from({ length: 41 }, (_, k) => P(onCircle(c.ang + ((k - 20) / 20) * (h / (SCALE * rho)) * 1.6)));
			S.raw(`<path d="M${piece.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" stroke="${PAGE}" stroke-width="${THIN + 2 * HALO}" fill="none" stroke-linecap="butt"/>`, 3.5);
			S.raw(`<path d="M${piece.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" stroke="${INK}" stroke-width="${THIN}" fill="none" stroke-linecap="butt"/>`, 3.6);
		}
		window[name + '-front'] = front;
	}

	// ---- the source and the camera
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${SOURCE}" fill="${MATTER}"/>`, 5);
	S.mark([O], SOURCE, 'the source');
	const cam = (() => {
		// a rounded body, a round lens on the face toward the source and a small viewfinder on top, in the observer's
		// colour; the glass a disc of the page's colour inside the lens
		const y = O[1], cx = aN.B[0] + CAM.gap + CAM.lens, bl = cx + CAM.lens * 0.45;
		const box = { l: bl, r: bl + CAM.w, t: y - CAM.h / 2, b: y + CAM.h / 2 };
		const vf = { l: bl + CAM.w - CAM.bump[0] - 1.8, t: box.t - CAM.bump[1] };
		const R = CAM.round, r = CAM.bump[2];
		S.raw(`<rect x="${n2(box.l)}" y="${n2(box.t)}" width="${CAM.w}" height="${CAM.h}" rx="${R}" fill="${OBS}"/>` +
			`<rect x="${n2(vf.l)}" y="${n2(vf.t)}" width="${CAM.bump[0]}" height="${n2(CAM.bump[1] + R + 0.5)}" rx="${r}" fill="${OBS}"/>` +
			`<circle cx="${n2(cx)}" cy="${n2(y)}" r="${CAM.lens}" fill="${OBS}"/>` +
			`<circle cx="${n2(cx)}" cy="${n2(y)}" r="${CAM.glass}" fill="${PAGE}"/>`, 4);
		const ink = { l: cx - CAM.lens, r: box.r, t: vf.t, b: box.b };
		S.boxes.push({ box: ink, what: 'the camera' });
		check(ink.l - aN.B[0] >= CAM.gap - 1e-9 && CAM.lens <= CAM.h / 2, 'the camera touches N-hat or its lens overhangs the body');
		return ink;
	})();

	// ---- e_1 and e_2 from the circle's centre, the dashed radius, and the arc of psi
	const cP = P(C3);
	const a1 = S.arrow(cP, P(comb([1, C3], [AX, e1])), { color: INK, width: AXIS + 0.1, head: AXIS_HEAD, layer: 3, what: 'e_1' });
	const a2 = S.arrow(cP, P(comb([1, C3], [AX, e2])), { color: INK, width: AXIS + 0.1, head: AXIS_HEAD, layer: 3, what: 'e_2' });
	dashed(S, cP, P(crossing), { color: DIM, width: THIN, layer: 2, dash: [1.6, 1.2], what: 'the radius' });
	const arc3 = (C, a, b, r, n = 240) => {
		const ang = angle(a, b), w = (() => { const v = comb([1, b], [-dot(a, b), a]); const l = Math.sqrt(dot(v, v)); return v.map((x) => x / l); })();
		const pts = Array.from({ length: n + 1 }, (_, k) => { const t = (ang * k) / n; return comb([1, C], [r * Math.cos(t), a], [r * Math.sin(t), w]); });
		for (const p of pts) check(near(Math.hypot(...comb([1, p], [-1, C])), r, 1e-12) && near(dot(comb([1, p], [-1, C]), cross(a, b)), 0, 1e-12), 'an arc leaves its plane or radius');
		return { pts, ang, mid: pts[n / 2], pg: pts.map(P) };
	};
	const across = (() => { const v = comb([1, crossing], [-1, C3]); return v.map((x) => x / rho); })();
	const psiArc = arc3(C3, e1, across, ARC.psi);
	check(near(psiArc.ang, psi, 1e-12), 'the arc of psi');
	S.path(psiArc.pg, { color: DIM, width: HAIR, layer: 2, what: 'the arc of psi' });

	// ---- z-hat, faint and dashed, through the source
	const zA = P(z.map((v) => Z_REACH[0] * v)), zB = P(z.map((v) => Z_REACH[1] * v));
	dashed(S, zA, zB, { color: FAINT, width: THIN, layer: 1, dash: [2.2, 1.6], clash: (q) => Math.hypot(q[0] - O[0], q[1] - O[1]) < SOURCE + 1.2, what: 'z-hat' });

	// ---- the arcs at the source: theta (z-hat to N-hat), beta (N-hat to n'), theta' (z-hat to n')
	const at0 = [0, 0, 0];
	const thArc = arc3(at0, z, N, ARC.theta), bArc = arc3(at0, N, np, ARC.beta), tpArc = arc3(at0, z, np, ARC.thetaP);
	check(near(thArc.ang, theta, 1e-12) && near(bArc.ang, beta, 1e-12) && near(tpArc.ang, thetaP, 1e-12), 'the arcs\' angles');
	for (const [arc, what] of [[thArc, 'theta'], [bArc, 'beta'], [tpArc, 'theta\'']]) S.path(arc.pg, { color: DIM, width: HAIR, layer: 1, what: `the arc of ${what}` });
	// n' passes in front of the arc of theta: a halo cuts the arc clear of it
	{
		const r = ARC.theta;
		const k = thArc.pg.reduce((best, q, i) => { const d = Math.abs((q[0] - O[0]) * aP.u[1] - (q[1] - O[1]) * aP.u[0]); return d < best.d ? { d, i } : best; }, { d: Infinity, i: 0 }).i;
		const q = thArc.pg[k], s = (q[0] - O[0]) * aP.u[0] + (q[1] - O[1]) * aP.u[1];
		check(depth(np.map((v) => (s / Math.hypot(...pg(np)) / SCALE) * v)) > depth(thArc.pts[k]), 'n\' is not in front of the arc of theta');
		const h = 3.5, A = [O[0] + aP.u[0] * (s - h), O[1] + aP.u[1] * (s - h)], B = [O[0] + aP.u[0] * (s + h), O[1] + aP.u[1] * (s + h)];
		S.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${PAGE}" stroke-width="${VEC + 2 * HALO}" stroke-linecap="butt"/>`, 2.5);
		check(r > 0, 'the arc of theta');
	}

	// ---- the names
	const out = (arc, k = 1) => { const m = P(arc.mid); return unit2([m[0] - O[0], m[1] - O[1]]).map((v) => v * k); };
	const name2 = async (src, q, dir, color = INK, ax = 0.5, ay = 0.5) => {
		const lab = await S.clear(src, q[0] + dir[0] * 3, q[1] + dir[1] * 3, ax, ay, dir, { color });
		L.push(lab);
		return lab;
	};
	{
		const d = out(bArc); await name2('\\beta', P(bArc.mid), d);
		const kt = Math.round(TP_AT * (tpArc.pts.length - 1)), mt = tpArc.pg[kt];
		await name2("\\theta'", mt, unit2([mt[0] - O[0], mt[1] - O[1]]));
		const dth = out(thArc); await name2('\\theta', P(thArc.mid), dth);
		const m = P(psiArc.mid), dp = unit2([m[0] - cP[0], m[1] - cP[1]]); await name2('\\psi', m, dp);
	}
	await name2('\\boldsymbol e_1', a1.B, [0.6, -0.8]);
	await name2('\\boldsymbol e_2', a2.B, unit2(pg(e2)));
	await name2("\\hat n'\\text{, emission}", aP.B, [1, 0], INK, 0, 0.5);
	await name2('\\hat z\\text{, the burst’s axis}', zB, unit2(pg(z)), INK, 0.5, 1);
	{
		const lab = await S.clear('\\hat N\\text{, to the camera}', cam.r + CAM.room, O[1] + VEC / 2 + LABEL_GAP + 1, 1, 0, [0, 1]);
		check(lab.box.r >= cam.r + CAM.room - 1e-6, 'the camera is the rightmost ink');
		L.push(lab);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { thetaP: deg(thetaP), rho, D, right: Rt, up: Up };
	return finish(S, L, [240, 340]);
}
