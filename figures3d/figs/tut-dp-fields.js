// The tutorial, chapter 13.8 (tutorial/what-a-field-keeps/holography.md), its fourth diagram: the fields of a ball and
// a shell of one mass and radius. One panel: across, r/R from 0 to 2.5 (ticks every 0.5); up, the field g in units of
// G M / R^2 (ticks 0, 0.5, 1). The ball's field, solid in matter's colour, rises linearly to 1 at r = R and then falls
// as 1/r^2; the shell's, dashed in matter's colour, is zero inside and jumps to 1 at R; outside the two are one curve,
// drawn once. The triangle between them inside R is a pale tint of matter's colour, named g_1 - g_2 inside it. In the
// empty upper right, a small inset of the integrand (r/R)^4 on 0 <= r/R <= 1, the same tint under it, its area 1/5
// printed in it.
// Departures from the diagram's comment: the axis up starts a little below zero, so that the shell's zero field inside
// is a dashed line of its own and not drawn along the axis; the two fields are named "ball, g_1" and "shell, g_2",
// the chapter's names, and the common curve outside "both, 1/(r/R)^2"; the inset's curve is ink, being the square of
// the shaded difference, not a field.
// Exact: both fields (tut-holo-lib.js asserts them against the chapter's G M r / R^3 and zero inside), the triangle,
// the inset's curve and its area (Simpson's rule, asserted to be 1/5, and E_G = G M^2 / 10 R from it against the
// chapter's boxed result). Schematic: nothing; the inset's place.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, MATTER, gBall, FIFTH } from './tut-holo-lib.js';

const name = 'tut-dp-fields';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const U0 = 0, U1 = 2.5, G0 = -0.09, G1 = 1.1;
const DX = 104, DY = 150;                       // points per unit
const CURVE = 0.8, DASH = [3.2, 2];
const VEIL = 0.17;                              // the tint's opacity
const INSET = { u: 1.42, g: 0.6, w: 70, h: 48 };   // the inset's lower left (data) and size (points)
const SMALL = 7.2;
const caption = 'Look first at the shaded triangle: the two fields differ only inside, and the square of that difference, integrated, is $E_G = G\\matter M^2/10R$. Exact curves.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'dp-fields', caption);
	const S = new Sheet(name);
	const L = [];
	const W = (U1 - U0) * DX, H = (G1 - G0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: U0, x1: U1, y0: G0, y1: G1 });

	// ---- the triangle, under everything
	{
		const pts = [P.at(0, 0), P.at(1, 0), P.at(1, 1)];
		S.raw(`<path d="M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${MATTER}" fill-opacity="${VEIL}"/>`, 0.3);
	}

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [0, 0.5, 1, 1.5, 2, 2.5], what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('r/R', P.X(1.25), below + 4, 0.5, 0, DIM));
	L.push(await placed('g\\ \\ \\text{(units of }GM/R^2\\text{)}', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the fields: the ball's, solid, inside and out; the shell's, dashed, inside and its jump
	const n = 600;
	const ball = Array.from({ length: n + 1 }, (_, k) => U0 + ((U1 - U0) * k) / n).map((u) => P.at(u, gBall(u)));
	check(ball.every(([, y]) => y >= P.top && y <= P.bottom), 'the ball\'s field leaves the panel');
	S.path(ball, { color: MATTER, width: CURVE, layer: 2, what: 'the ball\'s field' });
	// the shell's zero inside, dashed, stopping short of the ball's line at the origin; its jump at R, dashed
	{
		const gap = 2.4;                        // points of air between the dashes' ends and the solid line
		S.path([[P.X(0) + 0.3, P.Y(0)], [P.X(1), P.Y(0)], [P.X(1), P.Y(1) + gap]], { color: MATTER, width: CURVE, dash: DASH, cap: 'butt', layer: 2.1, what: 'the shell\'s field' });
		check(P.Y(G0) - P.Y(0) > 12, 'the shell\'s zero lies on the axis');
	}

	// ---- the names
	L.push({ ...(await placed('g_1 - g_2', P.X(0.69), P.Y(0.31), 0.5, 0.5, INK)), on: ['the triangle'] });
	{
		// inside the triangle, clear of its edges
		const lab = L.at(-1).box;
		check(lab.l > P.X(0.31 + 0.13) && lab.r < P.X(1) - 3 && lab.b < P.Y(0) - 3, 'g_1 - g_2 leaves the triangle');
	}
	L.push(await S.clear('\\text{ball, }g_1', P.X(0.5), P.Y(0.58), 1, 1, [-0.8, -0.6], { color: INK }));
	L.push(await S.clear('\\text{shell, }g_2', P.X(1) + 4, P.Y(0.2), 0, 0.5, [1, 0], { color: INK }));
	L.push(await S.clear('\\text{both, }1/(r/R)^2', P.X(1.95), P.Y(gBall(1.95)) + 3, 0, 0, [0.3, 1], { color: INK }));

	// ---- the inset: (r/R)^4 on [0, 1], its area shaded and printed
	{
		const x0 = P.X(INSET.u), y0 = P.Y(INSET.g);
		const Q = new Plot({ left: x0, top: y0 - INSET.h, w: INSET.w, h: INSET.h, x0: 0, x1: 1, y0: 0, y1: 1 });
		check(Q.right < P.right - 2 && Q.top > P.top - 4, 'the inset leaves the panel');
		// it stands clear of the field outside, which falls through its lower left
		check(P.Y(gBall(INSET.u)) - y0 > 10, 'the inset touches the field outside');
		const pts = Array.from({ length: 201 }, (_, k) => k / 200).map((u) => Q.at(u, u ** 4));
		S.raw(`<path d="M${n2(Q.X(0))},${n2(Q.Y(0))}L${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}L${n2(Q.X(1))},${n2(Q.Y(0))}Z" fill="${MATTER}" fill-opacity="${VEIL}"/>`, 0.3);
		S.path(pts, { color: INK, width: 0.6, layer: 2, what: 'the integrand' });
		S.path([[Q.X(0), Q.Y(1)], [Q.X(0), Q.Y(0)], [Q.X(1), Q.Y(0)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the inset\'s axes' });
		for (const u of [1]) S.path([[Q.X(u), Q.Y(0)], [Q.X(u), Q.Y(0) + TICK * 0.8]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the inset\'s tick' });
		S.path([[Q.X(0), Q.Y(1)], [Q.X(0) - TICK * 0.8, Q.Y(1)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the inset\'s tick up' });
		L.push(await placed('1', Q.X(1), Q.Y(0) + TICK * 0.8 + 2.4, 0.5, 0, DIM, SMALL));
		L.push(await placed('1', Q.X(0) - TICK * 0.8 - 2.4, Q.Y(1), 1, 0.5, DIM, SMALL));
		L.push(await placed('r/R', Q.X(0.5), Q.Y(0) + 2.4, 0.5, 0, DIM, SMALL));
		L.push(await S.clear('(r/R)^4', Q.X(0.6), Q.Y(0.6 ** 4), 1, 1, [-0.6, -0.8], { color: INK, size: SMALL }));
		check(near5(FIFTH), `the area is ${FIFTH}`);
		L.push(await placed('\\text{area }\\tfrac15', Q.X(1) + 3, Q.Y(0.3), 0, 0.5, INK, SMALL));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { fifth: FIFTH };
	return finish(S, L, [260, 340]);
}

const near5 = (v) => Math.abs(v - 0.2) < 1e-12;
