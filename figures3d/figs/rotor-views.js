// The paper's figure beside "The sense of turning" (paper/sections/05-waves.tex): a rotor seen from three directions,
// iota = 0, 60 and 90 degrees, iota the angle between the spin and the line from the rotor to the camera (as in
// fig:polarization), one column each, titled with its angle. Column width, 246 pt.
// Upper row: the rotor as the camera sees it, the paper's axes e_1 (along the projection of the spin) to the right and
// e_2 (a quarter turn from e_1, anticlockwise as the camera sees it) up: the rotor of fig:quadrupole (two steel spheres
// on an ink rod) at the instant 2 Omega u = 30 degrees; its orbit, a circle of unit radius seen as an ellipse with
// semi-axes |cos iota| along e_1 and 1 along e_2 (dashed; at 90 degrees the masses only go up and down the rod's
// line, shown by a double arrow beside it); an arrowhead on the orbit in the sense in which the masses move; the
// projection of the spin on the sky, a grey arrow along e_1 of length sin iota (none at 0 degrees).
// Lower row: the plane of the two strains, h_+/A across and h_x/A up, ticks at +-0.5 and +-1 (none where the curve meets
// its axis there; the tick at 1 numbered in the last column), and the curve traced by (h_+(t), h_x(t)) over a cycle, Eq. (rotor-amplitudes): an ellipse with semi-axes
// (1 + cos^2 iota)/2 and cos iota (a circle, 0.625 by 0.5, the segment from -0.5 to 0.5), in ink over a pale grey,
// with an arrowhead in the sense in which the point goes as u grows. Under each column, V/I, Eq. (circular).
//
// Everything that sets a sense is computed here, not assumed: the masses turn anticlockwise about +z (the spin);
// the paper's axes are built from the projection of the spin and checked to satisfy e_1 x e_2 = n (n from the rotor to
// the camera, so that e_2 is a quarter turn anticlockwise from e_1 as the camera sees it); the strains come from the
// second derivative of the masses' moment, projected on those axes and made transverse and trace-free (Eq.
// quadrupole), and are checked against h_+ cos 2 Omega u and h_x sin 2 Omega u of Eq. (rotor-amplitudes) at a common
// origin of u; each arrowhead points along the computed velocity (of the masses as seen, of the point in the plane of
// the strains); V/I is computed as the difference over the sum of the squared amplitudes of the anticlockwise and
// clockwise parts of h_+ + i h_x, checked against Eq. (circular) and against the printed values.
// Schematic: the spheres' size; the orbit's radius, drawn as long as the unit of A below it; the instant shown.
import { Panel, v3, figure, tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, checker, near, placed, boxOf, n2, AXIS, AXIS_HEAD, HAIR, DASH, SIZE, LABEL_GAP } from './tut-vec-lib.js';
import { planeAxes, STEEL } from './tut-five-lib.js';
import { dashes, drawDashes } from './tut-pol-lib.js';

const name = 'rotor-views';
const check = checker(name);

const W_FIG = 246;                        // the column
const MARGIN = 1.5;                       // the ink's margin on every side
const IOTAS = [0, 60, 90];                // degrees
const INSTANT = 30;                       // 2 Omega u at the instant drawn, degrees
const R = 20;                             // points per unit: the orbit's radius (upper row) and the unit of A (lower)
const BODY = 3.0;                         // a sphere's radius, points
const ROD = 0.7;                          // the rod (figs/quadrupole.js)
const REACH = 1.25;                       // the strain axes run to +-REACH
const EDGE = 0.6;                         // the traced ellipse's stroke
const SEG = 1.0;                          // the edge-on segment
const HEAD = 3.2;                         // arrowheads on curves
const DOUBLE = 0.35;                      // a double arrow's half-length, units
const DHEAD = 2.8;                        // its heads
const BESIDE = 6;                         // a double arrow's distance from the line it goes along, points
const TINT = 'light-dark(#ebe8e2, #2e2a26)';   // the traced curve's fill: a pale grey (ink at about 9% on the page,
                                               // and the site's pale ink at 12% on its dark ground)
const GAP_ROWS = 7;                       // air between the upper row's ink and the lower row's names

const rad = (d) => (d * Math.PI) / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// ---- the physics, in the paper's conventions -------------------------------------------------------------------------
// G = c = r = 1, m = 1, d = 2 (the masses at distance 1 from the centre), Omega = 1: Delta I = m d^2 / 2 = 2 and
// A = 4 Delta I Omega^2 = 8. The masses at +-(cos t, sin t, 0): turning anticlockwise about +z, the spin.
const DELTA_I = 2, A = 4 * DELTA_I;
const place = (t) => [Math.cos(t), Math.sin(t), 0];
const moment = (t) => { const p = place(t); return [0, 1, 2].map((i) => [0, 1, 2].map((j) => 2 * p[i] * p[j])); };
const second = (t, dt = 1e-4) => { const a = moment(t + dt), b = moment(t), c = moment(t - dt); return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (a[i][j] - 2 * b[i][j] + c[i][j]) / (dt * dt))); };

function view(d) {
	const iota = rad(d), n = [Math.sin(iota), 0, Math.cos(iota)];          // from the rotor to the camera
	// e_1 along the projection of the spin on the sky (the limit iota -> 0+ when it vanishes), e_2 = n x e_1
	const proj = [0, 1, 2].map((i) => [0, 0, 1][i] - Math.cos(iota) * n[i]);
	const e1 = [-Math.cos(iota), 0, Math.sin(iota)], e2 = cross(n, e1);
	check(near(Math.hypot(...e1), 1, 1e-15) && near(dot(e1, n), 0, 1e-15), `${d}: e_1 is not a unit vector across the line of sight`);
	check(proj.every((v, i) => near(v, Math.sin(iota) * e1[i], 1e-15)), `${d}: e_1 is not along the projection of the spin`);
	check(cross(e1, e2).every((v, i) => near(v, n[i], 1e-15)), `${d}: e_1 x e_2 is not n: e_2 is not anticlockwise from e_1 as seen`);
	const hp = (1 + Math.cos(iota) ** 2) / 2, hx = Math.cos(iota);       // Eq. (rotor-amplitudes), over A
	// the strains from Eq. (quadrupole): h_ij = 2 I''_ij, transverse and trace-free on (e_1, e_2)
	const strains = (t) => {
		const dd = second(t), c11 = dot(e1, dd.map((r) => dot(r, e1))), c22 = dot(e2, dd.map((r) => dot(r, e2))), c12 = dot(e1, dd.map((r) => dot(r, e2)));
		return [(2 * (c11 - c22)) / 2 / A, (2 * c12) / A];
	};
	// u's origin: the strains are h_+ cos 2u and h_x sin 2u with t = u + pi/2 (one origin for every view)
	const T0 = Math.PI / 2;
	for (let k = 0; k < 24; k++) {
		const u = (2 * Math.PI * k) / 24 + 0.05, [a, b] = strains(u + T0);
		check(near(a, hp * Math.cos(2 * u), 2e-6) && near(b, hx * Math.sin(2 * u), 2e-6), `${d}: the strains at u = ${u} are not h_+ cos 2u, h_x sin 2u: ${a}, ${b}`);
	}
	// the masses as seen, (e_1 . x, e_2 . x), and their sense of turning
	const seen = (u, s = 1) => { const p = place(u + T0).map((v) => s * v); return [dot(e1, p), dot(e2, p)]; };
	const turnSeen = (u) => { const [a, b] = seen(u), [a1, b1] = seen(u + 1e-6); return a * (b1 - b) - b * (a1 - a); };
	const turnPlane = (u) => { const [a, b] = strains(u + T0), [a1, b1] = strains(u + T0 + 1e-3); return a * (b1 - b) - b * (a1 - a); };
	for (const u of [0.2, 1.1, 2.6, 4.0]) {
		check(Math.cos(iota) > 1e-9 ? turnSeen(u) > 0 : Math.abs(turnSeen(u)) < 1e-12, `${d}: the masses do not turn anticlockwise as seen`);
		check(Math.cos(iota) > 1e-9 ? turnPlane(u) > 0 : Math.abs(turnPlane(u)) < 1e-9, `${d}: the strains' point does not go anticlockwise`);
	}
	// V/I: the parts of h_+ + i h_x that turn anticlockwise (e^{2iu}) and clockwise (e^{-2iu}), by their Fourier sums
	let ar = 0, ai = 0, br = 0, bi = 0;
	const N = 720;
	for (let k = 0; k < N; k++) {
		const u = (2 * Math.PI * k) / N, [a, b] = strains(u + T0);
		// (a + i b) e^{-2iu} and (a + i b) e^{2iu}
		ar += a * Math.cos(2 * u) + b * Math.sin(2 * u); ai += b * Math.cos(2 * u) - a * Math.sin(2 * u);
		br += a * Math.cos(2 * u) - b * Math.sin(2 * u); bi += b * Math.cos(2 * u) + a * Math.sin(2 * u);
	}
	const L2 = (ar ** 2 + ai ** 2) / N ** 2, R2 = (br ** 2 + bi ** 2) / N ** 2;
	const vi = (L2 - R2) / (L2 + R2);
	check(near(vi, (2 * hp * hx) / (hp * hp + hx * hx), 1e-6), `${d}: V/I ${vi} is not Eq. (circular)`);
	return { d, iota, hp, hx, vi, seen, strains: (u) => strains(u + T0) };
}

/** A filled arrowhead `hd` long with its tip at the figure point `tip`, pointing along the unit vector u (figure). */
function headAt(ink, tip, u, color, layer, what, hd = HEAD) {
	const w = [-u[1], u[0]], hw = 0.36 * hd, b = [tip[0] - u[0] * hd, tip[1] - u[1] * hd];
	const tri = [tip, [b[0] + w[0] * hw, b[1] + w[1] * hw], [b[0] - w[0] * hw, b[1] - w[1] * hw]];
	ink.P.items.push({ kind: 'raw', layer, depth: 0, svg: `<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${color}"/>` });
	ink.mark([...tri, tri[0]], 0, what);
}

/** An arrowhead on the curve f(s) (figure points), its tip at s1 and its base on the curve HEAD behind, so that it
 * points along the chord of its own length in the sense of growing s; returns the tip and the base. */
function headOn(ink, f, s1, color, layer, what) {
	const tip = f(s1);
	let s0 = s1;
	while (Math.hypot(f(s0)[0] - tip[0], f(s0)[1] - tip[1]) < HEAD) s0 -= 1e-4;
	const b = f(s0), L = Math.hypot(tip[0] - b[0], tip[1] - b[1]), u = [(tip[0] - b[0]) / L, (tip[1] - b[1]) / L];
	headAt(ink, tip, u, color, layer, what);
	return { tip, b, u };
}

/** A straight double arrow from a to b (figure points), heads DHEAD at both ends. */
function double(ink, a, b, color, width, layer, what) {
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
	check(2 * DHEAD <= 0.5 * L, `${what}: the heads take more than half the arrow`);
	const s0 = [a[0] + u[0] * DHEAD * 0.8, a[1] + u[1] * DHEAD * 0.8], s1 = [b[0] - u[0] * DHEAD * 0.8, b[1] - u[1] * DHEAD * 0.8];
	ink.P.items.push({ kind: 'raw', layer, depth: 0, svg: `<path d="M${n2(s0[0])},${n2(s0[1])}L${n2(s1[0])},${n2(s1[1])}" stroke="${color}" stroke-width="${width}" fill="none"/>` });
	ink.mark([s0, s1], width / 2, what);
	headAt(ink, b, u, color, layer, what + "'s head", DHEAD);
	headAt(ink, a, [-u[0], -u[1]], color, layer, what + "'s other head", DHEAD);
}

/** A TeX label with its baseline at y and centred on x. */
async function onBaseline(src, x, y, color = INK) {
	const g = await tex(src, [x, y], SIZE, 'cB', color);
	return { src, svg: g, box: boxOf(g) };
}

/** Where an SVG has ink, [l, r, t, b] in its units, painted at K pixels per unit (tut-vec-lib.js, inkOf). */
const K = 12;
async function inkOf(svg, w, h) {
	const img = new Image();
	img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await img.decode();
	const c = document.createElement('canvas');
	c.width = Math.ceil(w * K); c.height = Math.ceil(h * K);
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0, c.width, c.height);
	const a = ctx.getImageData(0, 0, c.width, c.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (a[(y * c.width + x) * 4 + 3] > 8) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l: l / K, r: (r + 1) / K, t: t / K, b: (b + 1) / K };
}

export default async function () {
	const views = IOTAS.map(view);
	// the printed values, from Eq. (circular)
	const shown = ['1', '0.976', '0'];
	views.forEach((v, i) => check(String(+v.vi.toFixed(3)) === shown[i], `V/I at ${v.d}: ${v.vi}`));
	check(views.map((v) => `${+v.hp.toFixed(3)},${+v.hx.toFixed(3)}`).join(' ') === '1,1 0.625,0.5 0.5,0', 'the semi-axes');

	// the pitch: the leftmost ink is the first column's h_+ axis, the rightmost the last column's name h_+/A
	const probe = await placed('h_+/A', 0, 0, 0.5, 0.5, DIM, SIZE);
	const nameW = probe.box.r - probe.box.l;
	const PITCH = (W_FIG - 2 * MARGIN - (2 * REACH * R + LABEL_GAP + nameW)) / 2;

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	const L = [];
	const UPPER = 0;
	// the lower row's centre: the upper row's lowest ink (a sphere at its lowest), GAP_ROWS of air, the name h_x/A,
	// LABEL_GAP of air, the vertical axis's tip
	const nameH = (await placed('h_\\times/A', 0, 0, 0.5, 0.5, DIM, SIZE)).box;
	const lowestSeen = Math.max(...views.map((v) => Math.max(...[1, -1].map((s) => -v.seen(rad(INSTANT) / 2, s)[1]))));
	const LOWER = UPPER - (lowestSeen * R + BODY + GAP_ROWS + (nameH.b - nameH.t) + LABEL_GAP + REACH * R);
	const cols = [];
	for (const [i, v] of views.entries()) {
		const c = Math.cos(v.iota), s = Math.sin(v.iota);
		const X = (i - 1) * PITCH;
		const at = (a, b) => ink.at(v3(X + R * a, UPPER + R * b, 0));
		const C = ink.at(v3(X, UPPER, 0));
		// ---- the upper row: the masses at the instant, the rod, the orbit as seen
		const u0 = rad(INSTANT) / 2;
		const mAt = [1, -1].map((sg) => at(...v.seen(u0, sg)));
		raw(`<path d="M${n2(mAt[0][0])},${n2(mAt[0][1])}L${n2(mAt[1][0])},${n2(mAt[1][1])}" stroke="${INK}" stroke-width="${ROD}" stroke-linecap="butt"/>`, 2);
		ink.mark(mAt, ROD / 2, `${v.d}: the rod`);
		mAt.forEach((m, k) => {
			P.sphere(v3(m[0] - ORIGIN, ORIGIN - m[1], 0), BODY, STEEL, { layer: 3, spec: 0.6 });
			ink.mark([m], BODY, `${v.d}: mass ${k}`);
		});
		// the projection of the spin, sin(iota) e_1 from the centre
		let onProj = () => false;
		if (s > 1e-9) {
			const tipP = v3(X + R * s, UPPER, 0);
			ink.arrow(v3(X, UPPER, 0), tipP, { color: DIM, width: HAIR + 0.05, head: AXIS_HEAD, layer: 1.5, what: `${v.d}: the projection of the spin` });
			const xe = ink.at(tipP)[0];
			onProj = (q) => Math.abs(q[1] - C[1]) < AXIS_HEAD * 0.36 + 1.2 && q[0] > C[0] && q[0] < xe + 1.2;
		}
		const underMass = (q) => mAt.some((m) => Math.hypot(q[0] - m[0], q[1] - m[1]) < BODY + 1);
		if (c > 1e-9) {
			// the orbit, the path of the first mass over a turn; the head just past its left-hand point (u = -pi/2), pointing
			// along its motion as u grows
			const orbit = (u) => at(...v.seen(u));
			const F = Array.from({ length: 721 }, (_, k) => orbit((2 * Math.PI * k) / 720));
			const h = headOn(ink, orbit, -Math.PI / 2 + 0.12, DIM, 2.5, `${v.d}: the orbit's head`);
			check(h.u[1] > 0.9, `${v.d}: the orbit's head at the left does not point down (anticlockwise)`);
			const nearHead = (q) => Math.hypot(q[0] - h.tip[0], q[1] - h.tip[1]) < HEAD + 1 || Math.hypot(q[0] - h.b[0], q[1] - h.b[1]) < 1.6;
			drawDashes(ink, dashes(F, { dash: DASH, skip: (q) => underMass(q) || onProj(q) || nearHead(q) }), { color: DIM, width: HAIR + 0.1, layer: 1, what: `${v.d}: the orbit` });
		} else {
			// edge-on: the masses go up and down the rod's line; a double arrow beside it, on the side away from the
			// projection of the spin
			check(views[i].seen(0.3)[0] === 0 || Math.abs(views[i].seen(0.3)[0]) < 1e-15, 'edge-on, the masses leave the line');
			double(ink, at(-BESIDE / R, -DOUBLE), at(-BESIDE / R, DOUBLE), DIM, AXIS, 2.5, `${v.d}: the masses' double arrow`);
		}

		// ---- the lower row: the plane of the strains
		const O = v3(X, LOWER, 0);
		// ticks at +-0.5 and +-1, but none where the traced curve meets its axis at a tick and runs along it (it would
		// thicken the curve there): at 0 degrees the ticks at +-1, at 60 degrees those of h_x at +-0.5
		const TICKS = [-1, -0.5, 0.5, 1];
		const meets = (t, semi) => v.hx > 1e-9 && near(Math.abs(t), semi, 1e-9);
		const ax = planeAxes(ink, O, R, { h: { lo: -REACH, hi: REACH, ticks: TICKS.filter((t) => !meets(t, v.hp)) }, v: { lo: -REACH, hi: REACH, ticks: TICKS.filter((t) => !meets(t, v.hx)) }, layer: 0 });
		const pt = (a, b) => ink.at(v3(X + R * a, LOWER + R * b, 0));
		if (v.hx > 1e-9) {
			const curve = (u) => pt(...v.strains(u));
			const E = Array.from({ length: 721 }, (_, k) => curve((2 * Math.PI * k) / 720));
			// the traced curve is the ellipse with the semi-axes of Eq. (rotor-amplitudes)
			for (const q of E) {
				const x = (q[0] - pt(0, 0)[0]) / R, y = -(q[1] - pt(0, 0)[1]) / R;
				check(near((x / v.hp) ** 2 + (y / v.hx) ** 2, 1, 1e-4), `${v.d}: the traced curve is not the ellipse`);
			}
			const d = 'M' + E.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
			raw(`<path d="${d}" fill="${TINT}" stroke="none"/>`, -0.5);
			raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, 1.2);
			ink.mark(E, EDGE / 2, `${v.d}: the traced curve`);
			// the head at 2u = 50 degrees, pointing as u grows
			const h = headOn(ink, curve, rad(50) / 2, INK, 1.3, `${v.d}: the traced curve's head`);
			check(h.u[0] < 0, `${v.d}: the traced curve's head in the upper right does not point left (anticlockwise)`);
		} else {
			check(near(v.hp, 0.5, 1e-15) && Math.abs(v.hx) < 1e-15, 'the edge-on segment is not from -0.5 to 0.5');
			const a = pt(-v.hp, 0), b = pt(v.hp, 0);
			raw(`<path d="M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}" stroke="${INK}" stroke-width="${SEG}" stroke-linecap="butt"/>`, 1.2);
			ink.mark([a, b], SEG / 2, `${v.d}: the segment`);
			double(ink, pt(-DOUBLE, BESIDE / R), pt(DOUBLE, BESIDE / R), INK, AXIS + 0.1, 1.3, `${v.d}: the segment's double arrow`);
		}
		cols.push({ X, v, ax });
	}
	// ---- the names: the axes' in every column, the unit's tick numbered in the last
	for (const { ax } of cols) {
		L.push(await ink.label('h_+/A', ink.at(ax.h.tip), [1, 0], LABEL_GAP, DIM, SIZE));
		L.push(await ink.label('h_\\times/A', ink.at(ax.v.tip), [0, -1], LABEL_GAP, DIM, SIZE));
	}
	{
		const { ax } = cols[2];
		for (const t of ax.h.ticks.filter((q) => q.t === 1)) L.push(await ink.label(`${t.t}`, ink.at(t.q), [0, 1], LABEL_GAP, DIM, SIZE));
	}
	// the titles over the upper row and V/I under the lower, each row on one baseline
	const top = Math.min(...ink.marks.map((m) => Math.min(...m.pts.map((q) => q[1] - m.r))), ...L.map((l) => l.box.t));
	const bottom = Math.max(...ink.marks.map((m) => Math.max(...m.pts.map((q) => q[1] + m.r))), ...L.map((l) => l.box.b));
	const t0 = await onBaseline('\\iota = 0^\\circ', 0, 0), v0 = await onBaseline('V/I = 0', 0, 0);
	const titleBase = top - 5 - t0.box.b, viBase = bottom + 5 - v0.box.t;
	for (const [i, { X, v }] of cols.entries()) {
		const x = ink.at(v3(X, 0, 0))[0];
		L.push(await onBaseline(`\\iota = ${v.d}^\\circ`, x, titleBase));
		L.push(await onBaseline(`V/I = ${shown[i]}`, x, viBase));
	}
	ink.checkAll(L);

	// ---- the figure: 246 pt wide, cropped to its ink with the same margin on every side
	const CANVAS = 440;
	const rawSvg = await figure(CANVAS, CANVAS, [P], L.map((l) => Promise.resolve(l.svg)));
	const box = await inkOf(rawSvg, CANVAS, CANVAS);
	const head = rawSvg.slice(0, rawSvg.indexOf('</defs>') + 7), rest = rawSvg.slice(rawSvg.indexOf('</defs>') + 7, rawSvg.lastIndexOf('</svg>'));
	const wrap = (Wd, Hd, dx, dy) => head.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/, `width="${Wd}pt" height="${Hd}pt" viewBox="0 0 ${Wd} ${Hd}"`) + `<g transform="translate(${dx},${dy})">${rest}</g></svg>`;
	const m = (W_FIG - (box.r - box.l)) / 2;
	let dx = n2(m - box.l), dy = n2(m - box.t), H = n2(box.b - box.t + 2 * m);
	let svg = wrap(W_FIG, H, dx, dy), out = await inkOf(svg, W_FIG, H);
	dx = n2(dx + (out.l + (W_FIG - out.r)) / 2 - out.l); dy = n2(dy + m - out.t);
	H = n2(out.b - out.t + 2 * m);
	svg = wrap(W_FIG, H, dx, dy);
	out = await inkOf(svg, W_FIG, H);
	const margins = [out.l, out.t, W_FIG - out.r, H - out.b];
	const tol = 1.5 / K + 0.02;
	check(margins.every((q) => near(q, m, tol)), `the margins are not equal: ${margins.map((q) => q.toFixed(2)).join(', ')}`);
	check(near(m, MARGIN, 0.3), `the margin ${m} is far from ${MARGIN}`);
	window[name] = { W: W_FIG, H, margins: margins.map(n2), pitch: PITCH };
	window[name + '-numbers'] = { views: views.map((v) => ({ d: v.d, hp: v.hp, hx: v.hx, vi: v.vi })) };
	return svg;
}
