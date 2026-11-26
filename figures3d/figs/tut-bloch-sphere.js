// The tutorial, section 8.4 (tutorial/quantum/spin.md), its first diagram: the Bloch sphere. One sphere, drawn as
// section 6.6 draws the sky (figs/tut-spin-lib.js, after figs/tut-maxwell-sky.js): a thin outline, a veil of the
// page's neutral tint over everything behind it, the equator solid and faint in front and dashed behind; thin grey axes
// x, y, z from its centre (z up). Two ink arrows from the centre to the sphere, |n1> at theta = 40 degrees and |n2> 60
// degrees further down in the same vertical plane, with a thin arc between them named "60 degrees" and, beside it,
// "|<n1|n2>|^2 = cos^2 30 = 0.75". Inside, a shorter grey arrow to b = (1/2, 0, 1/2), ending in a small open dot named
// "half |up>, half |+x>: |b| = 0.71". At the poles small dots named |up> and |down> (the south pole lies behind, under
// the veil), with the note "opposite points are orthogonal states". Ink and the page's greys only; no orange or blue.
// Departures from the diagram's comment: the two arrows' vertical plane is at the azimuth 140 degrees, not 30, so that
// it faces the reader (75 degrees round from the line of sight) and the angle between them shows near its size, and
// so that the mixture's arrow, toward (x + z)/2, falls on the other side of the z axis from them; at phi = 30 the two
// arrows would be foreshortened to half their length and the mixture's lie between them. Because that plane faces the
// reader, an arc on the sphere between the tips would run along the outline, so the arc is drawn outside the sphere,
// at 1.18 radii, joined to the tips by dotted extension lines, as a dimension is. The equator is solid in front and
// dashed behind, as 6.6's sky draws its great circles, so that front and back can be told apart. The mixture's name
// is set at the left, on a thin leader from its dot.
// Exact: every point (the directions, the states' overlap cos^2 30 = (1 + n1.n2)/2 = 0.75, the mixture's
// b = tr(rho sigma) = (1/2, 0, 1/2) of length 0.71, all asserted in tut-spin-lib.js against the chapter's text) and
// the view, an orthographic one from 17 degrees above the equator. Schematic: the axes' and the arc's reach, the
// dots' sizes.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, VEC, VEC_HEAD, AXIS, AXIS_HEAD, HAIR, n2 } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, near, rad, dir, dot, len, view, sky, THETA1, THETA2, APART } from './tut-spin-lib.js';

const name = 'tut-bloch-sphere';
const check = checker(name);

const R = 74;                        // the sphere's radius, points
const AZ = 65, EL = 17;              // the view: the camera's azimuth from x toward y, and its height, degrees
const PHI = AZ + 75;                 // the azimuth of the two arrows' vertical plane
const AX = 1.42;                     // the axes' reach, in radii
const ARC = 1.18, ARC_W = 0.5;       // the dimension arc: its radius, its stroke
const POLE = 1.5;                    // a pole's dot
const OPEN = 1.9, OPEN_W = 0.6;      // the mixture's open dot

export default async function () {
	const { overlap, mix } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const v = view(AZ, EL);
	const K = sky(S, check, [ORIGIN, ORIGIN], R, v);
	const { at, front } = K;
	const C = at([0, 0, 0]);
	const d1 = dir(THETA1, PHI), d2 = dir(THETA2, PHI), b = mix;
	check(front(d1) && front(d2), 'an arrow\'s tip is behind the sphere');
	check(near(Math.acos(dot(d1, d2)), rad(APART), 1e-12), 'the arrows are not 60 degrees apart');
	check(near(overlap, Math.cos(rad(30)) ** 2), 'the overlap');
	check(near(len(b), Math.SQRT1_2), 'the mixture');

	// ---- behind: the equator's back half, the south pole; then the veil and the outline
	K.equator();
	const south = K.dot([0, 0, -1], POLE, { fill: INK, stroke: 'none', width: 0, what: 'the south pole' });
	check(!front([0, 0, -1]) && front([0, 0, 1]), 'the poles do not lie as drawn');
	K.veil();

	// ---- the axes
	const tips = {};
	for (const [k, d] of [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]]) {
		check(front(d), `the ${k} axis points behind`);
		tips[k] = S.arrow(C, at(d.map((c) => c * AX)), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1.2, what: `the ${k} axis` });
	}
	const north = K.dot([0, 0, 1], POLE, { fill: INK, stroke: 'none', width: 0, what: 'the north pole' });

	// ---- the two states, and the arc between them
	const a1 = S.arrow(C, at(d1), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: '|n1>' });
	const a2 = S.arrow(C, at(d2), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: '|n2>' });
	const inPlane = (t) => dir(t, PHI).map((c) => c * ARC);
	const arcPts = Array.from({ length: 241 }, (_, k) => at(inPlane(THETA1 + (APART * k) / 240)));
	S.path(arcPts, { color: INK, width: ARC_W, layer: 2, cap: 'butt', what: 'the arc' });
	for (const [t, A] of [[THETA1, a1], [THETA2, a2]]) {
		const e = at(inPlane(t)), u = [(e[0] - A.B[0]), (e[1] - A.B[1])], l = Math.hypot(...u);
		S.dots(A.B, e, { color: DIM, clear0: 2.2, clear1: 0, layer: 1.5, what: `the extension at ${t}` });
		check(l > 6, 'an extension line is too short');
	}

	// ---- the mixture: a grey arrow to b, ending at a small open dot
	const q = at(b);
	{
		const u = [q[0] - C[0], q[1] - C[1]], l = Math.hypot(...u), e = [q[0] - (u[0] / l) * (OPEN + OPEN_W / 2 + 0.3), q[1] - (u[1] / l) * (OPEN + OPEN_W / 2 + 0.3)];
		S.arrow(C, e, { color: DIM, width: VEC - 0.1, head: VEC_HEAD - 0.6, layer: 2.5, what: 'b' });
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${OPEN}" fill="${PAGE}" stroke="${DIM}" stroke-width="${OPEN_W}"/>`, 4);
		S.mark([q], OPEN + OPEN_W / 2, 'the mixture\'s dot');
	}

	// ---- the names
	const lab = async (src, x, y, ax, ay, color = INK) => { const l = await placed(src, x, y, ax, ay, color); L.push(l); return l; };
	await lab('x', tips.x.B[0] - LABEL_GAP - 0.6, tips.x.B[1], 1, 0.5, DIM);
	await lab('y', tips.y.B[0] + LABEL_GAP + 0.4, tips.y.B[1] + 1.2, 0, 0.5, DIM);
	await lab('z', tips.z.B[0], tips.z.B[1] - LABEL_GAP - 0.4, 0.5, 1, DIM);
	L.push(await S.clear('|{\\uparrow}\\rangle', north[0] - 3.2, north[1] - 3, 1, 1, [-0.6, -0.8]));
	const down = await lab('|{\\downarrow}\\rangle', south[0], C[1] + R + LABEL_GAP + 0.6, 0.5, 0);
	{
		// |n1> just left of its head, inside the sphere; |n2> under the end of the arc
		const t = a1.B;
		L.push(await S.clear('|\\hat n_1\\rangle', t[0] - 3, t[1] - 1, 1, 0.5, [-1, 0]));
		const s = at(inPlane(THETA2));
		L.push(await S.clear('|\\hat n_2\\rangle', s[0], s[1] + 3, 0.5, 0, [0, 1]));
	}
	{
		// 60 degrees outside the arc's middle; the overlap beside it, right of the whole arc
		const m = at(inPlane(THETA1 + APART / 2)), u = [m[0] - C[0], m[1] - C[1]], l = Math.hypot(...u);
		const deg60 = await S.clear('60^\\circ', m[0] + (u[0] / l) * 3, m[1] + (u[1] / l) * 3, 0, 1, [u[0] / l, u[1] / l]);
		L.push(deg60);
		check((Math.cos(rad(APART / 2)) ** 2).toFixed(2) === '0.75', 'the printed overlap');
		const right = Math.max(...arcPts.map((p) => p[0]), deg60.box.l);
		const f1 = await S.clear('|\\langle\\hat n_1|\\hat n_2\\rangle|^2', right + LABEL_GAP + 1, deg60.box.b + 3.4, 0, 0, [1, 0]);
		L.push(f1);
		L.push(await S.clear('= \\cos^2 30^\\circ = 0.75', f1.box.l + 4, f1.box.b + 2.6, 0, 0, [1, 0]));
	}
	{
		// the mixture's name at the left, on a level leader from its dot
		check(len(b).toFixed(2) === '0.71', 'the printed |b|');
		const y = q[1], x1 = C[0] - R - 8;
		S.path([[q[0] - OPEN - OPEN_W / 2 - 0.8, y], [x1, y]], { color: DIM, width: HAIR, layer: 1.6, cap: 'butt', what: 'the mixture\'s leader' });
		const t1 = await lab('\\text{half }|{\\uparrow}\\rangle\\text{, half }|{+}x\\rangle\\text{:}', x1 - LABEL_GAP - 0.4, y - 1.6, 1, 1);
		await lab('|\\mathbf b| = 0.71', x1 - LABEL_GAP - 0.4, t1.box.b + 2.6, 1, 0);
	}
	{
		// the note on |down>'s line, left of it, below the sphere
		L.push(await placed('\\text{opposite points are orthogonal states}', down.box.l - 9, (down.box.t + down.box.b) / 2, 1, 0.5));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { d1, d2, b, overlap };
	return finish(S, L, [240, 340]);
}
