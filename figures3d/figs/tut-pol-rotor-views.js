// The tutorial, section 5.4 (tutorial/waves/polarization.md), its fourth diagram: a rotor seen from three directions,
// iota = 0, 60 and 90 degrees, one column each, titled with its angle. Upper row: the rotor as the camera sees it, e_1
// to the right and e_2 up: the two masses (the nugget of section 2.5, lit in matter's two colours) on their rod at the
// instant 2 Omega u = 30 degrees, and their dashed orbit, a circle of radius 1 seen as an ellipse with semi-axes
// |cos iota| along e_1 and 1 along e_2 (a circle, an ellipse of semi-axis 0.5, a line); an arrowhead on the orbit
// showing the sense of turning as seen (anticlockwise at 0 and 60 degrees; at 90 degrees a double arrow beside the
// line, the masses only going up and down it); the spin's shadow on the sky, a thin grey arrow along -e_1 of length
// sin iota (absent at 0 degrees), named in the last column. Lower row: the plane of the two amplitudes, h_+ across
// and h_x up, in units of A, ticks at +-0.5 and +-1 (numbered in the last column), and the ellipse traced by the point
// (h_+(t), h_x(t)) over one cycle, semi-axes (1 + cos^2 iota)/2 and cos iota: 1 and 1, 0.625 and 0.5, 0.5 and 0;
// filled in the observer's magenta (tut-pol-lib.js, MAGENTA: the role the paper's ad hoc rose of figs/quadrupole.js
// becomes in the book's palette) with the paper's opacity 0.12 + 0.4 V/I for V/I = 1 and 0.976,
// with an arrowhead showing that the point goes anticlockwise; edge-on the segment from -0.5 to 0.5 in ink, with a
// double arrow over it. Under each, its V/I.
// Departures from the diagram's comment: the fill's opacity is the paper's affine 0.12 + 0.4 V/I, as the caption's
// "follows the paper's fig:quadrupole" asks, rather than strictly in proportion; the edge-on columns carry a double
// arrow, where the point and the masses only go back and forth; each column's V/I is printed under it; the spin's
// shadow is named once, and the ticks numbered once, both in the last column, where there is room.
// Exact: the orbit as seen and the masses on it at 2 Omega u = 30 degrees (asserted against the projection of their
// places on e_1 and e_2); the sense of turning (asserted from the projected motion); the shadow's length sin iota;
// each ellipse from the boxed amplitudes, which tut-pol-lib.js asserts against the turning table projected on the
// camera's axes; V/I. Schematic: the masses' size; the orbit's radius, drawn as long as the unit of A below it.
import { Panel, v3, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, AXIS, AXIS_HEAD, HAIR, DASH } from './tut-vec-lib.js';
import { planeAxes } from './tut-five-lib.js';
import { chapter, cameraAxes, rad, nugget, depth, MAGENTA_PAINT as MAGENTA, dashes, drawDashes, INSTANT_2OMEGA_U } from './tut-pol-lib.js';

const name = 'tut-pol-rotor-views';
const check = checker(name);

const PITCH = 112;                        // points between the columns' centres
const RT = 31;                            // the orbit's radius, points (upper row): the lower row's unit, so that the
                                          // face-on orbit and the face-on circle below it are one size
const MASS = 4.6;                         // a mass's radius, points
const ROD = 0.7;
const SB = RT;                            // points per unit of A (lower row)
const REACH = 1.28;                       // the amplitude axes run to +-REACH
const UPPER = 47, LOWER = -52;            // the rows' centres
const EDGE = 0.6;                         // the ellipse's edge
const SEG = 1.0;                          // the edge-on segment
const HEAD = 3.4;                         // the arrowheads on curves
const DOUBLE = 0.32;                      // a double arrow's half-length, units of RT or of A
const BESIDE = 7;                         // a double arrow's distance from the line it goes along, points

/** A filled arrowhead with its tip at the figure point `tip`, pointing along the unit vector u (figure). */
function headAt(ink, tip, u, color, layer, what, hd = HEAD) {
	const w = [-u[1], u[0]], hw = 0.36 * hd, b = [tip[0] - u[0] * hd, tip[1] - u[1] * hd];
	const tri = [tip, [b[0] + w[0] * hw, b[1] + w[1] * hw], [b[0] - w[0] * hw, b[1] - w[1] * hw]];
	ink.P.items.push({ kind: 'raw', layer, depth: 0, svg: `<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${color}"/>` });
	ink.mark([...tri, tri[0]], 0, what);
}

export default async function () {
	const nums = chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const L = [];
	const W = rad(INSTANT_2OMEGA_U) / 2;     // Omega u
	const cols = [];
	for (const [i, view] of nums.views.entries()) {
		const iota = rad(view.d), c = Math.cos(iota), s = Math.sin(iota);
		const X = (i - 1) * PITCH;
		const C = v3(X, UPPER, 0);
		const at = (a, b) => ink.at(v3(X + RT * a, UPPER + RT * b, 0));
		// ---- the upper row: the orbit as seen, dashed; a line when edge-on
		const F = Array.from({ length: 721 }, (_, k) => { const t = (2 * Math.PI * k) / 720; return at(Math.abs(c) * Math.cos(t), Math.sin(t)); });
		const { e1, e2 } = cameraAxes(iota);
		const placeOf = (sign) => { const p = [-Math.sin(W) * sign, Math.cos(W) * sign, 0]; return [e1[0] * p[0] + e1[1] * p[1] + e1[2] * p[2], e2[0] * p[0] + e2[1] * p[1] + e2[2] * p[2]]; };
		const masses = [1, -1].map((sg) => placeOf(sg));
		for (const [k, m] of masses.entries()) {
			const want = view.seen(W).map((v) => v * (k ? -1 : 1));
			check(near(m[0], want[0], 1e-15) && near(m[1], want[1], 1e-15), `iota ${view.d}: mass ${k} is not where the camera sees it`);
			check(near((Math.abs(c) > 1e-12 ? (m[0] / Math.abs(c)) ** 2 : 0) + m[1] ** 2, Math.abs(c) > 1e-12 ? 1 : Math.cos(W) ** 2, 1e-12), `iota ${view.d}: mass ${k} is off its orbit as seen`);
		}
		const mAt = masses.map((m) => at(...m));
		const underMass = (q) => mAt.some((m) => Math.hypot(q[0] - m[0], q[1] - m[1]) < MASS + 0.5);
		// the sense of turning: an arrowhead at the orbit's right-hand point, pointing up (anticlockwise), or a double
		// arrow beside the line
		let skip = underMass;
		if (Math.abs(c) > 1e-9) {
			// the head along the orbit's chord of its own length, ending at the parameter 0.13 (radians)
			const tip = at(Math.abs(c) * Math.cos(0.13), Math.sin(0.13));
			let t0 = 0.13;
			while (Math.hypot(at(Math.abs(c) * Math.cos(t0), Math.sin(t0))[0] - tip[0], at(Math.abs(c) * Math.cos(t0), Math.sin(t0))[1] - tip[1]) < HEAD) t0 -= 1e-4;
			const b = at(Math.abs(c) * Math.cos(t0), Math.sin(t0)), u = [(tip[0] - b[0]) / HEAD, (tip[1] - b[1]) / HEAD];
			headAt(ink, tip, u, DIM, 2.5, `iota ${view.d}: the orbit's head`);
			// anticlockwise as seen (asserted for the masses' motion in tut-pol-lib.js): up at the right-hand side
			check(u[1] < 0 && view.hx > 0, `iota ${view.d}: the orbit's head does not point up`);
			skip = (q) => underMass(q) || Math.hypot(q[0] - tip[0], q[1] - tip[1]) < HEAD + 1 || Math.hypot(q[0] - b[0], q[1] - b[1]) < 1.6;
		} else {
			const A = at(0, -DOUBLE);
			const off = [BESIDE, 0];
			ink.arrow(v3(X + BESIDE, UPPER - DOUBLE * RT, 0), v3(X + BESIDE, UPPER + DOUBLE * RT, 0), { color: DIM, width: AXIS, head: HEAD - 0.4, layer: 2.5, what: `iota ${view.d}: the double arrow` });
			headAt(ink, [A[0] + off[0], A[1]], [0, 1], DIM, 2.5, `iota ${view.d}: the double arrow's lower head`, HEAD - 0.4);
		}
		// no dash across the spin's shadow, which runs from the centre along -e_1
		const yC = ink.at(C)[1], xS = ink.at(v3(X - RT * s, UPPER, 0))[0];
		const onShadow = (q) => s > 1e-9 && Math.abs(q[1] - yC) < AXIS_HEAD * 0.36 + 1 && q[0] > xS - 1 && q[0] < ink.at(C)[0];
		drawDashes(ink, dashes(F, { dash: DASH, skip: (q) => skip(q) || onShadow(q) }), { color: DIM, width: HAIR + 0.1, layer: 1, what: `iota ${view.d}: the orbit` });
		// the spin's shadow: -sin(iota) e_1, from the centre
		if (s > 1e-9) {
			const tipS = v3(X - RT * s, UPPER, 0);
			check(near(-RT * s, RT * -Math.sin(iota), 1e-12), 'the shadow\'s length');
			ink.arrow(C, tipS, { color: DIM, width: HAIR + 0.05, head: AXIS_HEAD, layer: 1.5, what: `iota ${view.d}: the spin's shadow` });
			if (i === 2) L.push(await ink.label('\\text{spin\'s shadow}', ink.at(tipS), [0, 1], 2.4, DIM, 7.5));
		}
		// the rod and the masses
		raw(`<path d="M${n2(mAt[0][0])},${n2(mAt[0][1])}L${n2(mAt[1][0])},${n2(mAt[1][1])}" stroke="${INK}" stroke-width="${ROD}" stroke-linecap="butt"/>`, 2);
		ink.mark(mAt, ROD / 2, `iota ${view.d}: the rod`);
		mAt.forEach((m, k) => { raw(nugget(`${name}-m${i}${k}`, m[0], m[1], MASS), 3); ink.mark([m], MASS, `iota ${view.d}: mass ${k}`); });

		// ---- the lower row: the plane of the amplitudes
		const O = v3(X, LOWER, 0);
		const ax = planeAxes(ink, O, SB, { h: { lo: -REACH, hi: REACH, ticks: [-1, -0.5, 0.5, 1] }, v: { lo: -REACH, hi: REACH, ticks: [-1, -0.5, 0.5, 1] }, layer: 0 });
		const pt = (a, b) => ink.at(v3(X + SB * a, LOWER + SB * b, 0));
		if (view.hx > 1e-9) {
			const E = Array.from({ length: 361 }, (_, k) => { const t = (2 * Math.PI * k) / 360; return pt(view.hp * Math.cos(t), view.hx * Math.sin(t)); });
			const d = 'M' + E.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
			raw(`<path d="${d}" fill="${MAGENTA}" fill-opacity="${depth(view.vi).toFixed(4)}" stroke="none"/>`, -0.5);
			raw(`<path d="${d}" fill="none" stroke="${MAGENTA}" stroke-width="${EDGE}"/>`, 1.2);
			ink.mark(E, EDGE / 2, `iota ${view.d}: the ellipse`);
			// the arrowhead at the parameter 50 degrees, pointing as t grows: anticlockwise
			const t1 = rad(50);
			const tip = pt(view.hp * Math.cos(t1), view.hx * Math.sin(t1));
			let t0 = t1;
			while (Math.hypot(pt(view.hp * Math.cos(t0), view.hx * Math.sin(t0))[0] - tip[0], pt(view.hp * Math.cos(t0), view.hx * Math.sin(t0))[1] - tip[1]) < HEAD) t0 -= 1e-4;
			const b = pt(view.hp * Math.cos(t0), view.hx * Math.sin(t0)), u = [(tip[0] - b[0]) / HEAD, (tip[1] - b[1]) / HEAD];
			headAt(ink, tip, u, MAGENTA, 1.3, `iota ${view.d}: the ellipse's head`);
			// the point (h_+(t), h_x(t)) = (hp cos 2 Omega t, hx sin 2 Omega t) goes anticlockwise: its turn is positive
			check(view.hp * view.hx > 0, `iota ${view.d}: the point does not go anticlockwise`);
		} else {
			const A = pt(-view.hp, 0), B = pt(view.hp, 0);
			check(near(view.hp, 0.5, 1e-15), 'the edge-on segment is not from -0.5 to 0.5');
			raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" stroke="${INK}" stroke-width="${SEG}" stroke-linecap="butt"/>`, 1.2);
			ink.mark([A, B], SEG / 2, `iota ${view.d}: the segment`);
			const y = LOWER + BESIDE;
			ink.arrow(v3(X - DOUBLE * SB, y, 0), v3(X + DOUBLE * SB, y, 0), { color: INK, width: AXIS, head: HEAD - 0.4, layer: 1.3, what: `iota ${view.d}: the segment's double arrow` });
			headAt(ink, ink.at(v3(X - DOUBLE * SB, y, 0)), [-1, 0], INK, 1.3, `iota ${view.d}: the segment's left head`, HEAD - 0.4);
		}
		cols.push({ X, view, ax });
	}
	// ---- the names: the axes' names in every column, the ticks' numbers in the last
	for (const { ax } of cols) {
		L.push(await ink.label('h_+/A', ink.at(ax.h.tip), [1, 0], 2.4, DIM, 7.5));
		L.push(await ink.label('h_\\times/A', ink.at(ax.v.tip), [0, -1], 2.4, DIM, 7.5));
	}
	{
		const { ax } = cols[2];
		for (const t of ax.h.ticks.filter((q) => q.t > 0)) L.push(await ink.label(`${t.t}`, ink.at(t.q), [0, 1], 3.2, DIM, 7));
	}
	// the titles over the upper row, on one line; V/I under the lower row, on one line
	const top = Math.min(...ink.marks.map((m) => Math.min(...m.pts.map((q) => q[1] - m.r))), ...L.map((l) => l.box.t));
	const bottom = Math.max(...ink.marks.map((m) => Math.max(...m.pts.map((q) => q[1] + m.r))), ...L.map((l) => l.box.b));
	const shown = ['1', '0.976', '0'];
	for (const [i, { X, view }] of cols.entries()) {
		const x = ink.at(v3(X, 0, 0))[0];
		check(view.vi.toFixed(3) === ['1.000', '0.976', '0.000'][i], `V/I at ${view.d}`);
		L.push(await placed(`\\iota = ${view.d}^\\circ`, x, top - 5, 0.5, 1, INK));
		L.push(await placed(`V/I = ${shown[i]}`, x, bottom + 4.5, 0.5, 0, INK));
	}
	ink.checkAll(L);
	window[name + '-numbers'] = { views: nums.views.map((v) => ({ d: v.d, hp: v.hp, hx: v.hx, vi: v.vi, opacity: depth(v.vi) })) };
	return finish(name, P, L, [240, 340]);
}
