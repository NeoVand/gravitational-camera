// Shared numbers and marks for the five diagrams of the tutorial's section 5.4 (tutorial/waves/polarization.md):
// tut-pol-patterns, tut-pol-instants, tut-pol-geometry, tut-pol-rotor-views and tut-pol-poincare. Not a figure itself.
// The sheet, strokes, heads, labels and the cropping are section 1.1's (figs/tut-vec-lib.js); the ring of twelve free
// steel beads, its dashed undisturbed circle and ink ellipse, and the orange of a stretch and the blue of a squeeze are
// Part 1's (figs/tut-five-lib.js, figs/tut-tides.js), all imported, not copied. The sense of turning is drawn as the
// paper draws it (figs/quadrupole.js and make_figures.py, which_way: magenta for V/I = +1, a fill of opacity
// 0.12 + 0.4 V/I), but in the book's own magenta, the observer's (app.css --q-obs: #9b2d7f by day, #e26c8c at night;
// the handedness is the one seen from the camera), not the paper's ad hoc #c2255c, which is none of the palette's
// roles; the rotor's masses are the tutorial's nugget, lit in matter's two colours (figs/tut-null-lib.js).
//
// A ring here is moved by the wave itself: the bead whose undisturbed place is R xi is drawn at R (xi + delta xi),
// delta xi = (1/2) h xi with h = h_+ e^+ + h_x e^x in the plane of e_1 (right) and e_2 (up), so that the ring is the
// image of the circle under 1 + h/2, an exact ellipse.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the ring's
// semi-axes 1.18 and 0.82 at h = 0.36, along e_1 and e_2 for the plus pattern and along the diagonals for the cross;
// the stretch axis at half the argument of h_+ + i h_x, checked against the direction in which the ring is moved out
// most, 22.5 degrees per eighth of a cycle when a = b and along e_1 or e_2 (or round) when b = 0; the camera's axes at
// iota = 50 degrees, e_1 x e_2 = n and the spin's shadow -sin(iota) e_1, 0.31 long at 0.4; the rotor's strains from
// the turning table projected on those axes, (1 + cos^2 iota)/2 and cos iota, its orbit seen with semi-axes 1 and
// |cos iota|, turning anticlockwise as seen when cos iota > 0; V/I = 1, 0.976, 0.785, 0.50 and 0 at 0, 60, 75, 82.2
// and 90 degrees, -0.976 at 120 and 1 - 5e-5 at 30, and the factor eight between face-on and edge-on; and the Stokes
// parameters of the rotor at 75 degrees, (Q, U, V)/I = (0.62, 0, 0.785) on the sphere of radius 1, carried by a turn
// of the axes of 22.5 degrees to (0, -0.62, 0.785) for the gravitational wave (-4 theta) and to (0.44, -0.44, 0.785)
// for light (-2 theta), each found by turning the strains or the field and computing the parameters anew.
import { Panel, v3, THREE, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { near, n2 } from './tut-vec-lib.js';
import { STEEL, RING, UNDISTURBED, UNDISTURBED_W } from './tut-five-lib.js';
import { nugget } from './tut-null-lib.js';
import { STONE_INK } from './tut-orb-lib.js';

export { STEEL, STONE_INK, nugget };

export const H = 0.36;                    // the drawn strain, exaggerated
export const MAGENTA = '#9b2d7f';         // anticlockwise as seen, V/I > 0: the observer's magenta (app.css --q-obs, day)
export const MAGENTA_NIGHT = '#e26c8c';   // the same at night (app.css --q-obs, dark)
export const MAGENTA_PAINT = `light-dark(${MAGENTA}, ${MAGENTA_NIGHT})`;   // a stroke or fill in a drawing the site shows in both themes
/** The fill's opacity for a circular share V/I (figs/quadrupole.js). */
export const depth = (vi) => 0.12 + 0.4 * vi;
export const rad = (d) => (d * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;

// ---- the wave on a ring -----------------------------------------------------------------------------------------
/** delta xi / |xi| for the strains (hp, hx) at the unit place xi = [x, y]: (1/2) h xi. */
export const shift = (hp, hx, [x, y]) => [0.5 * (hp * x + hx * y), 0.5 * (hx * x - hp * y)];
/** The direction of strongest stretch, radians from e_1, or null for a round ring. */
export const stretchAxis = (hp, hx) => (Math.hypot(hp, hx) < 1e-12 ? null : 0.5 * Math.atan2(hx, hp));

// ---- the rotor ---------------------------------------------------------------------------------------------------
/** The rotor's two amplitudes in units of A, seen at the inclination iota (radians). */
export const amplitudes = (iota) => ({ hp: (1 + Math.cos(iota) ** 2) / 2, hx: Math.cos(iota) });
/** Its Stokes parameters over I: phasors h+ = hp, hx = i hx. */
export function stokesOf(p, q) {
	// p, q complex [re, im]: the phasors of h_+ and h_x (eq:stokes)
	const I = p[0] ** 2 + p[1] ** 2 + q[0] ** 2 + q[1] ** 2;
	const Q = p[0] ** 2 + p[1] ** 2 - q[0] ** 2 - q[1] ** 2;
	// p* q = (p0 - i p1)(q0 + i q1)
	const re = p[0] * q[0] + p[1] * q[1], im = p[0] * q[1] - p[1] * q[0];
	return { I, Q, U: 2 * re, V: 2 * im };
}
export const circularShare = (iota) => { const { hp, hx } = amplitudes(iota); return (2 * hp * hx) / (hp * hp + hx * hx); };

/** The camera's axes at the inclination iota: n, e_1, e_2 (eq. of the chapter's section on the view). */
export const cameraAxes = (iota) => ({
	n: [Math.sin(iota), 0, Math.cos(iota)],
	e1: [Math.cos(iota), 0, -Math.sin(iota)],
	e2: [0, 1, 0]
});
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** The phasor of a real signal f(t) = Re[f~ e^{-i w t}] of period 2 pi (w = 1), by the mean of 2 f(t) e^{i t}. */
function phasor(f, n = 720) {
	let re = 0, im = 0;
	for (let k = 0; k < n; k++) { const t = (2 * Math.PI * k) / n, v = f(t); re += v * Math.cos(t); im += v * Math.sin(t); }
	return [(2 * re) / n, (2 * im) / n];
}

/** The Stokes parameters, over I, after the camera's axes turn anticlockwise by theta: the strains turned by
 * e^{-2 i theta} (eq:h-turn) for a gravitational wave (spin 2), the field by e^{-i theta} for light (spin 1), from
 * the phasors p (of h_+ or E_1) and q (of h_x or E_2); computed from the turned signals, not from the rule. */
export function turned(p, q, theta, spin) {
	const sig = (z) => (t) => z[0] * Math.cos(t) + z[1] * Math.sin(t);     // Re[(z0 + i z1)(cos t - i sin t)]
	const a = sig(p), b = sig(q), c = Math.cos(spin * theta), s = Math.sin(spin * theta);
	// (a' + i b') = e^{-i spin theta} (a + i b)
	const p2 = phasor((t) => c * a(t) + s * b(t)), q2 = phasor((t) => -s * a(t) + c * b(t));
	const st = stokesOf(p2, q2);
	return { Q: st.Q / st.I, U: st.U / st.I, V: st.V / st.I, I: st.I };
}

// ---- the chapter's numbers ---------------------------------------------------------------------------------------
export const INSTANTS = Array.from({ length: 8 }, (_, k) => 45 * k);        // omega t, degrees
export const IOTA_GEOMETRY = 50, IOTA_VIEWS = [0, 60, 90], IOTA_P = 75, THETA = 22.5;
export const INSTANT_2OMEGA_U = 30;      // the rotor's instant in tut-pol-rotor-views: 2 Omega u, degrees

export function chapter(check) {
	// ---- the ring: the image of the circle under 1 + h/2 has semi-axes 1 +- h/2, along the pattern's axes
	for (const [key, hp, hx, along] of [['plus', H, 0, 0], ['cross', 0, H, 45]]) {
		let max = { r: 0 }, min = { r: 9 };
		for (let k = 0; k < 36000; k++) {
			const t = (2 * Math.PI * k) / 36000, xi = [Math.cos(t), Math.sin(t)], d = shift(hp, hx, xi);
			const r = Math.hypot(xi[0] + d[0], xi[1] + d[1]);
			if (r > max.r) max = { r, t }; if (r < min.r) min = { r, t };
		}
		check(max.r.toFixed(2) === '1.18' && min.r.toFixed(2) === '0.82' && near(max.r, 1 + H / 2, 1e-9) && near(min.r, 1 - H / 2, 1e-9), `${key}: the semi-axes ${max.r}, ${min.r}`);
		check(near(Math.abs(Math.cos(max.t - rad(along))), 1, 1e-6) && near(Math.abs(Math.cos(min.t - rad(along + 90))), 1, 1e-6), `${key}: the long axis is not at ${along} degrees`);
		// every bead moves by h/2 of its distance: e^A is a reflection
		for (let k = 0; k < 12; k++) { const t = rad(30 * k + 15 * (hx !== 0)); check(near(Math.hypot(...shift(hp, hx, [Math.cos(t), Math.sin(t)])), H / 2, 1e-15), `${key}: bead ${k}'s shift`); }
	}
	// ---- the stretch axis: half the argument, and the direction in which the ring moves out most
	const outward = (hp, hx, phi) => 0.5 * (hp * Math.cos(2 * phi) + hx * Math.sin(2 * phi));
	const axisOf = (hp, hx) => {
		let best = 0;
		for (let k = 0; k < 18000; k++) { const phi = (Math.PI * k) / 18000; if (outward(hp, hx, phi) > outward(hp, hx, best)) best = phi; }
		return best;
	};
	const instants = INSTANTS.map((w) => {
		const c = { hp: H * Math.cos(rad(w)), hx: H * Math.sin(rad(w)) }, l = { hp: H * Math.cos(rad(w)), hx: 0 };
		return { w, c, l, ac: stretchAxis(c.hp, c.hx), al: stretchAxis(l.hp, Math.abs(l.hp) < 1e-12 ? 0 : l.hx) };
	});
	for (const { w, c, l, ac, al } of instants) {
		// circular: the axis at w/2, 22.5 degrees a step, a steady size
		const off = (((deg(ac) - w / 2) % 180) + 180) % 180;
		check(off < 1e-9 || 180 - off < 1e-9, `circular at ${w}: the axis ${deg(ac)}, not ${w / 2}`);
		check(near(Math.abs(Math.cos(axisOf(c.hp, c.hx) - ac)), 1, 1e-6), `circular at ${w}: the most outward direction`);
		check(near(Math.hypot(c.hp, c.hx), H, 1e-15), `circular at ${w}: the size`);
		// linear: along e_1 at 0, 45, 315; round at 90, 270; along e_2 at 135, 180, 225
		const want = { 0: 0, 45: 0, 90: null, 135: 90, 180: 90, 225: 90, 270: null, 315: 0 }[w];
		if (want === null) check(Math.abs(l.hp) < 1e-12, `linear at ${w}: not round`);
		else {
			check(near(Math.abs(Math.cos(al - rad(want))), 1, 1e-12), `linear at ${w}: the axis ${deg(al)}`);
			check(near(Math.abs(Math.cos(axisOf(l.hp, l.hx) - rad(want))), 1, 1e-6), `linear at ${w}: the most outward direction`);
		}
	}
	for (let k = 1; k < 8; k++) check(near(deg(instants[k].ac) - deg(instants[k - 1].ac), 22.5, 1e-9) || near(deg(instants[k].ac) - deg(instants[k - 1].ac), 22.5 - 180, 1e-9), `the circular axis turns 22.5 degrees at step ${k}`);

	// ---- the camera's axes at 50 degrees
	const g = cameraAxes(rad(IOTA_GEOMETRY));
	check(g.n.map((v) => v.toFixed(3)).join() === '0.766,0.000,0.643' && g.e1.map((v) => v.toFixed(3)).join() === '0.643,0.000,-0.766', `the axes at 50: ${g.n}, ${g.e1}`);
	const x = cross3(g.e1, g.e2);
	check(x.every((v, i) => near(v, g.n[i], 1e-15)), 'e_1 x e_2 is not n');
	const zc = dot3([0, 0, 1], g.n), shadow = [0, 1, 2].map((i) => [0, 0, 1][i] - zc * g.n[i]);
	check(shadow.every((v, i) => near(v, -Math.sin(rad(IOTA_GEOMETRY)) * g.e1[i], 1e-15)), 'the spin\'s shadow is not -sin(iota) e_1');
	check((0.4 * Math.sin(rad(IOTA_GEOMETRY))).toFixed(2) === '0.31', 'the shadow\'s drawn length');

	// ---- the rotor: the turning table projected, against the boxed amplitudes; its orbit as seen
	const rotor = (iota) => {
		const { e1, e2 } = cameraAxes(iota), { hp, hx } = amplitudes(iota);
		// masses at +-(-sin Wt, cos Wt, 0) (d/2 = 1, m = 1): I_ij = 2 x_i x_j; units with G/c^4 r = 1 and A = 1
		const second = (W) => { const p = [-Math.sin(W), Math.cos(W), 0]; return [0, 1, 2].map((i) => [0, 1, 2].map((j) => 2 * p[i] * p[j])); };
		const dt = 1e-4;
		for (const W of [0.1, 0.7, 1.9, 2.8, 4.4]) {
			const dd = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (second(W + dt)[i][j] - 2 * second(W)[i][j] + second(W - dt)[i][j]) / (dt * dt)));
			// Omega = 1: A = 4 Delta I Omega^2 = 4 (m d^2 / 2) = 4 (2 m (d/2)^2) = 8; strains over A
			const c11 = dot3(e1, dd.map((r) => dot3(r, e1))), c22 = dot3(e2, dd.map((r) => dot3(r, e2))), c12 = dot3(e1, dd.map((r) => dot3(r, e2)));
			const hpT = (c11 - c22) / 8, hxT = (2 * c12) / 8;
			check(near(hpT, hp * Math.cos(2 * W), 1e-5) && near(hxT, hx * Math.sin(2 * W), 1e-5), `the rotor at ${deg(iota)}: the strains at ${W}`);
		}
		// as seen: (e_1 . p, e_2 . p) = (-cos(iota) sin Wt, cos Wt); anticlockwise when cos iota > 0
		const seen = (W) => { const p = [-Math.sin(W), Math.cos(W), 0]; return [dot3(e1, p), dot3(e2, p)]; };
		for (const W of [0.3, 1.2, 2.5]) {
			const [a, b] = seen(W), [a1, b1] = seen(W + 1e-6);
			check(near(a, -Math.cos(iota) * Math.sin(W), 1e-15) && near(b, Math.cos(W), 1e-15), 'the orbit as seen');
			const turn = a * (b1 - b) - b * (a1 - a);
			check(Math.cos(iota) > 1e-9 ? turn > 0 : Math.abs(turn) < 1e-15, `the rotor at ${deg(iota)} turns the wrong way as seen`);
		}
		return { hp, hx, vi: circularShare(iota), seen };
	};
	const views = IOTA_VIEWS.map((d) => ({ d, ...rotor(rad(d)) }));
	check(views.map((v) => `${+v.hp.toFixed(3)},${+v.hx.toFixed(3)}`).join(' ') === '1,1 0.625,0.5 0.5,0', `the semi-axes ${views.map((v) => [v.hp, v.hx])}`);
	check(views.map((v) => v.vi.toFixed(3)).join() === '1.000,0.976,0.000', `V/I ${views.map((v) => v.vi)}`);
	check(near(views[2].hx, 0, 1e-15) || Math.abs(views[2].hx) < 1e-16, 'edge-on h_x');
	// the text's numbers
	check(circularShare(rad(75)).toFixed(3) === '0.785' && circularShare(rad(82.2)).toFixed(2) === '0.50' && circularShare(rad(120)).toFixed(3) === '-0.976', 'V/I at 75, 82.2, 120');
	check((1 - circularShare(rad(30))).toExponential(0) === '5e-5', `1 - V/I at 30: ${1 - circularShare(rad(30))}`);
	{
		const I = (iota) => { const { hp, hx } = amplitudes(iota); return hp * hp + hx * hx; };
		check(near(I(0) / I(Math.PI / 2), 8, 1e-12), 'face-on is not eight times edge-on');
	}

	// ---- Poincare: the rotor at 75 degrees, and a turn of the axes by 22.5 degrees
	const a75 = amplitudes(rad(IOTA_P));
	const p = [a75.hp, 0], q = [0, a75.hx];                 // h_+ = hp, h_x = i hx
	const s0 = stokesOf(p, q);
	const P = { Q: s0.Q / s0.I, U: s0.U / s0.I, V: s0.V / s0.I };
	check(P.V.toFixed(3) === '0.785' && P.Q.toFixed(2) === '0.62' && Math.abs(P.U) < 1e-15, `P ${P.Q}, ${P.U}, ${P.V}`);
	check(near(P.Q, Math.sqrt(1 - P.V ** 2), 1e-12) && Math.sqrt(1 - 0.785 ** 2).toFixed(2) === '0.62', 'P is not on the sphere at sqrt(1 - 0.785^2)');
	const gw = turned(p, q, rad(THETA), 2), light = turned(p, q, rad(THETA), 1);
	const rot = (a) => ({ Q: P.Q * Math.cos(a) - P.U * Math.sin(a), U: P.Q * Math.sin(a) + P.U * Math.cos(a) });
	const want4 = rot(rad(-4 * THETA)), want2 = rot(rad(-2 * THETA));
	check(near(gw.Q, want4.Q, 1e-9) && near(gw.U, want4.U, 1e-9) && near(gw.V, P.V, 1e-9), `the turned wave: ${gw.Q}, ${gw.U}, ${gw.V}`);
	check(Math.abs(gw.Q) < 1e-9 && gw.U.toFixed(2) === '-0.62', 'P\' is not at (0, -0.62)');
	check(near(light.Q, want2.Q, 1e-9) && near(light.U, want2.U, 1e-9) && near(light.V, P.V, 1e-9), `the turned light: ${light.Q}, ${light.U}`);
	check(light.Q.toFixed(2) === '0.44' && light.U.toFixed(2) === '-0.44', 'P\'\' is not at (0.44, -0.44)');
	check(near(gw.I, s0.I, 1e-9) && near(light.I, s0.I, 1e-9), 'I changed');
	return { instants, views, P, Pgw: { ...want4, V: P.V }, Plight: { ...want2, V: P.V } };
}

// ---- drawing: a ring of twelve beads moved by a wave ------------------------------------------------------------
export const ARROW = 0.55;                // a displacement arrow's stroke (tut-five-lib's PUSH)
export const ARROW_HEAD = 3.2;            // its head, or two fifths of the arrow if that is less
export const BAR = 0.9;                   // the stretch and squeeze bars of the instants

/** A closed or open curve of figure points, dashed in `dash` (a whole number of periods if closed, else a dash at
 * each end), as SVG path data; `skip(q)` leaves out a dash any of whose points it finds. Returns the dashes. */
export function dashes(F, { dash = UNDISTURBED, closed = true, skip = () => false } = {}) {
	const s = [0];
	for (let i = 1; i < F.length; i++) s.push(s[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
	const total = s[s.length - 1];
	const [on, off] = dash;
	let n, period, len, start;
	if (closed) { n = Math.round(total / (on + off)); period = total / n; len = (on * period) / (on + off); start = -len / 2; }
	else { n = Math.max(1, Math.round((total + off) / (on + off))); const f = total / (n * on + (n - 1) * off); len = on * f; period = (on + off) * f; start = 0; }
	const atS = (x) => {
		if (closed) x = ((x % total) + total) % total;
		x = Math.min(total, Math.max(0, x));
		let i = 1;
		while (i < s.length - 1 && s[i] < x) i++;
		const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
		return [F[i - 1][0] + f * (F[i][0] - F[i - 1][0]), F[i - 1][1] + f * (F[i][1] - F[i - 1][1])];
	};
	const out = [];
	for (let k = 0; k < n; k++) {
		const x0 = start + k * period;
		const seg = Array.from({ length: 9 }, (_, j) => atS(x0 + (len * j) / 8));
		if (seg.some(skip)) continue;
		out.push(seg);
	}
	return out;
}

/** Draws dashed figure-point polylines on the Sheet `ink`, remembering them. */
export function drawDashes(ink, segs, { color = DIM, width = UNDISTURBED_W, layer = 0, what = 'a dash' } = {}) {
	if (!segs.length) return;
	const d = segs.map((seg) => 'M' + seg.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')).join('');
	ink.P.items.push({ kind: 'raw', layer, depth: 0, svg: `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="round"/>` });
	for (const seg of segs) ink.mark(seg, width / 2, what);
}

/**
 * A ring of twelve free beads at the world point c (the page's plane, e_1 right and e_2 up), undisturbed radius R
 * (points), moved by the strains (hp, hx): the bead at R xi drawn at R (xi + (1/2) h xi). Beads at phase + k 30
 * degrees. With `arrows`, an arrow at each bead from its undisturbed place to it, stopping `gap` short of the bead,
 * orange where the bead moved outward and blue where inward. With `bars` (a length in points per unit of |h|), an
 * orange bar through the centre along the stretch axis and a blue one across it, both |h| bars long.
 */
export function waveRing(ink, check, { c, R, hp, hx, phase = 0, bead, arrows = false, gap = 0.6, bars = 0, ringWidth = RING, layer = 0, what = 'the ring' }) {
	const P = ink.P;
	const world = ([x, y]) => v3(c.x + R * x, c.y + R * y, 0);
	const image = (xi) => { const d = shift(hp, hx, xi); return [xi[0] + d[0], xi[1] + d[1]]; };
	// the ring: the image of the circle, an ellipse (asserted on its semi-axes 1 +- |h|/2 along the stretch axis)
	const N = 360;
	const loop = Array.from({ length: N + 1 }, (_, k) => world(image([Math.cos((2 * Math.PI * k) / N), Math.sin((2 * Math.PI * k) / N)])));
	const ax = stretchAxis(hp, hx), size = Math.hypot(hp, hx);
	if (ax !== null) {
		const r0 = Math.hypot(...image([Math.cos(ax), Math.sin(ax)])), r1 = Math.hypot(...image([-Math.sin(ax), Math.cos(ax)]));
		check(near(r0, 1 + size / 2, 1e-12) && near(r1, 1 - size / 2, 1e-12), `${what}: the semi-axes are not 1 +- |h|/2 along the stretch axis`);
	}
	ink.curve(loop, { color: INK, width: ringWidth, layer: layer + 1, what: `${what}'s ellipse` });
	const beads = [], drawn = [];
	for (let k = 0; k < 12; k++) {
		const t = phase + (2 * Math.PI * k) / 12, xi = [Math.cos(t), Math.sin(t)];
		const q = image(xi), p = world(q);
		const d = shift(hp, hx, xi), out = d[0] * xi[0] + d[1] * xi[1];
		beads.push({ k, xi, p, out });
		P.sphere(p, bead, STEEL, { spec: 0.6, shininess: 36, layer: layer + 3 });
		ink.mark([ink.at(p)], bead * P.scale, `${what}'s bead ${k}`);
		if (arrows) {
			check(Math.abs(out) > 1e-6, `${what}: bead ${k} moves along the ring, neither out nor in`);
			const from = world(xi), u = v3(d[0], d[1], 0).normalize();
			const to = p.clone().addScaledVector(u, -(bead + gap) / P.scale);
			check(near(from.clone().add(v3(d[0] * R, d[1] * R, 0)).distanceTo(p), 0, 1e-9), `${what}: arrow ${k} does not point from the place to the bead`);
			const a = ink.arrow(from, to, { color: out > 0 ? ACCENT : ACCENT2, width: ARROW, head: ARROW_HEAD, layer: layer + 4, what: `${what}'s arrow at bead ${k}` });
			drawn.push({ k, out, A: a.A, B: a.B, L: a.L, head: a.head });
		}
	}
	// the undisturbed circle, dashed, no dash within reach of an arrow
	const F = Array.from({ length: 721 }, (_, k) => ink.at(world([Math.cos((2 * Math.PI * k) / 720), Math.sin((2 * Math.PI * k) / 720)])));
	const clearOf = 0.36 * ARROW_HEAD + ARROW / 2 + 0.9;
	const nearArrow = (q) => drawn.some(({ A, B }) => {
		const dd = [B[0] - A[0], B[1] - A[1]], t = Math.max(0, Math.min(1, ((q[0] - A[0]) * dd[0] + (q[1] - A[1]) * dd[1]) / (dd[0] ** 2 + dd[1] ** 2)));
		return Math.hypot(q[0] - A[0] - t * dd[0], q[1] - A[1] - t * dd[1]) < clearOf;
	});
	drawDashes(ink, dashes(F, { skip: nearArrow }), { layer, what: `${what}'s undisturbed circle` });
	// the bars: along the stretch axis (orange) and across it (blue), |h| bars long, crossing at the centre
	const barsDrawn = [];
	if (bars && ax !== null) {
		const half = (bars * size) / 2;
		for (const [key, a, color, l] of [['squeeze', ax + Math.PI / 2, ACCENT2, layer + 2], ['stretch', ax, ACCENT, layer + 2.1]]) {
			const u = v3(Math.cos(a), Math.sin(a), 0);
			const A = c.clone().addScaledVector(u, -half / P.scale), B = c.clone().addScaledVector(u, half / P.scale);
			P.curve([A, B], { color, width: BAR, layer: l, cap: 'butt' });
			ink.mark([ink.at(A), ink.at(B)], BAR / 2, `${what}'s ${key} bar`);
			barsDrawn.push({ key, a, half });
		}
	}
	return { beads, arrows: drawn, loop, bars: barsDrawn, world };
}

// ---- drawing: a view in light perspective ------------------------------------------------------------------------
/** A Panel seen from a camera at the distance `dist` (world units) along the unit vector `toward` (world, y up),
 * looking at the panel's centre: the orthographic panel of lib.js with each point's offset across the view divided
 * by the depth, f = dist / (dist - z), so that what is nearer is drawn larger. */
export class View extends Panel {
	constructor({ toward, dist, ...o }) {
		const d = toward.clone().normalize();
		const turn = Math.atan2(-d.x, d.z);
		const d1 = d.clone().applyMatrix4(new THREE.Matrix4().makeRotationY(turn));
		const tilt = Math.atan2(d1.y, d1.z);
		super({ ...o, tilt: deg(tilt), turn: deg(turn) });
		this.dist = dist;
		const back = this.cam(d.clone().add(this.centre));
		if (!(Math.abs(back.x) < 1e-12 && Math.abs(back.y) < 1e-12 && back.z > 0)) throw new Error('the view does not look along its direction');
	}
	f(p) { return this.dist / (this.dist - this.cam(p).z); }
	at(p) {
		const q = this.cam(p), f = this.dist / (this.dist - q.z);
		return [this.x + this.w / 2 + q.x * f * this.scale, this.y + this.h / 2 - q.y * f * this.scale];
	}
	sphere(c, r, color, o = {}) { return super.sphere(c, r * this.f(c), color, o); }
}

/** The page's world (y up, z toward the first view) from the physics' (x, y, z), z up: x -> x, z -> y, y -> -z. */
export const up = (x, y, z) => v3(x, z, -y);
