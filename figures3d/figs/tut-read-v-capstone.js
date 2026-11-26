// The tutorial, reading section R7b (tutorial/geometry/reading-section-v.md), its second diagram: the capstone, one
// sealed rotor (two 1 kg masses 1 m apart, sixteen turns a second, anticlockwise seen from above) followed outward in
// eight small panels, (a) to (h), in two rows of four, each with its one number beneath it.
//  (a) The rotor seen from above (x right, y up): two stones on a rod at the instant Omega t = -60 degrees (the rod at
//      30 degrees from x), a curved arrow anticlockwise; beside it one cycle of its 32 Hz wave in the field's colour,
//      a dimension line under it one wavelength long. "lambda = 9370 km".
//  (b) The pixel 10 m away in the rotor's plane, a ring of twelve free balls (as tut-gw-lib.js's freeRing, in
//      tut-gw-turned, but with arrows at the four beads on its axes only) in the upright plane through the line to the rotor (x, to the right: the rotor lies to the left,
//      named by a grey arrow "10 m") and the spin (z, up), drawn at the instant the rod lies across that line, when the
//      tide stretches the ring along the spin (orange) and squeezes it along the line (blue), and half a cycle later
//      (the pale ring). "E_zz = 1.25 x 10^-15 s^-2".
//  (c) Two gyroscopes 1 m apart along the line to the rotor, their axles along the spin, seen a little from above, a
//      tick on each disc; the right one's tick turned a little about its axle. "|B| = 9.8 x 10^-21 s^-2".
//  (d) Section 7.7's crossover plot (tut-crossover) in miniature: r |E_zz| against r on log-log axes, the near law
//      r^-5 and the wave's law r^-1 in ink at half weight, the all-zone curve in the curvature's colour, an open circle
//      where the laws cross. "2930 km, in the plane".
//  (e) The camera 10^4 km away on the axis, looking down: its ring face on (x right, y up), filled with the page's
//      neutral tint, drawn at
//      Omega (t - r/c) = 60 degrees; its stretch axis, an orange bar, at 0, 30 and 60 degrees (the earlier two paler);
//      a curved arrow anticlockwise. "A = 1.7 x 10^-47, V/I = +1".
//  (f) Section 5.4's power pattern, (1 + 6 cos^2 iota + cos^4 iota)/8, a polar curve about the dashed spin axis, and a
//      small square of wave front with the flux's arrows through it. "9.1 x 10^-56 W m^-2".
//  (g) A counter reading 1 beside a clock face. "14.8 years".
//  (h) The camera at the same distance in the rotor's plane: its ring (freeRing) stretched along its first axis, the
//      spin's shadow (up the page), and squeezed across it, and half a cycle later the reverse (the pale ring); no
//      fill. "h_+ = A/2 = 8.3 x 10^-48, V/I = 0".
// One drawing serves the desktop and the phone: the site shows the same drawing at every width, so the two rows of
// four that the comment asks for at 1440 px are kept at 390 px too, and every label is set at 9.6 points (where the
// other diagrams use 8.5) so that on a phone, where the drawing is 358 px wide, each is about 9.5 px.
// Departures from the diagram's comment: the ring of (b) stands in the upright plane through the line to the rotor
// and the spin, not facing the rotor: in the plane facing it the near tide's two entries, E_yy = (7/5) E_zz, have the
// same sign, so that ring would be squeezed (or stretched) both ways at once, never stretched along the spin and
// squeezed across it; in the plane through the line, E_xx = -(12/5) E_zz, and the ring does what the comment says. The
// masses are the stone of 7.7's rotor (sprites/hair/ball-face.png, as tut-rotor-stress), not a flat fill of matter's
// colour. (e)'s ring is filled with the neutral LIGHT, not with 5.4's magenta for V/I (a pale pink in print, outside
// the book's palette): V/I = +1 is read from its label, and the orange bars read on the neutral.
// The gyroscopes of (c) stand in a panel of their own, beside the ring of (b). The ring of (b) carries arrows at its
// four beads on the axes only: at the others the near tide (E_xx = 2.4 |E_zz|) pushes nearly along the ring, and
// their short arrows crowd the beads; (h), whose pushes are all clearly out or in, keeps all twelve. The number of
// (h) is the mathematics': A/2 = 8.35 x 10^-48, which is 8.4 x 10^-48 to two figures, not the 8.3 the comment and
// the chapter had (corrected in the chapter).
// Exact: every number (asserted against the chapter's text); the near tide's three entries and the magnetic part from
// the all-zone solution (the paper's eq:multipole, M = L = 0) by 7.2's linearized curvature and finite differences,
// with B_ij = (1/2) eps_ipq R_pq0j checked on a moving point mass against 7.5's formula; the direction of every
// stretch and squeeze; the sense of turning of the rotor and of the stretch axis on the axis (the wave's strain the
// transverse trace-free part of 2 G I-double-dot / c^4 r, I-double-dot by finite differences of the turning second
// moment); the strains edge-on in 5.4's camera axes; the relative sizes of the rings' strains in (e) and (h); the
// curves of (d) and (f). Schematic: the rings', gyroscopes', counter's and clock's sizes, the tick's turn, the stones,
// the exaggeration of every ring (its largest change 16 per cent of its radius in (b), 18 in (e)).
import { INK, DIM, FAINT, PAGE, RULE, sprite } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, AXIS, LABEL_GAP, boxOf } from './tut-pot-lib.js';
import { tex } from '../lib.js';
import { picture, circle as circlePath } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { turning } from './tut-flow-lib.js';
import { freeRing, RING, project, STEEL } from './tut-gw-lib.js';
import { Plot } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { chapter, palette, CURV, FIELD, ACCENT, ACCENT2, G, C, exact, nearLaw, farLaw, X_CROSS, secondMoment, uHat, YEAR } from './tut-quadrupole-lib.js';
import { HBAR } from './tut-einstein-lib.js';
import { riemann } from './tut-linear-lib.js';
import { circularShare, amplitudes, cameraAxes, dashes, drawDashes } from './tut-pol-lib.js';
import { UNDISTURBED_W } from './tut-five-lib.js';

const name = 'tut-read-v-capstone';
const check = checker(name);

// ---- the rotor (SI) ------------------------------------------------------------------------------------------------
const MASS = 1, D = 1, TURNS = 16;
const OM = 2 * Math.PI * TURNS;
const DI = 0.5 * MASS * D * D;             // kg m^2
const R_PIX = 10, R_CAM = 1e7;             // m

// ---- the drawing (figure points, y down) ---------------------------------------------------------------------------
const SIZE = 9.6;                          // every label and number: about 9.5 px on a phone
const PW = 84, GUTTER = 8;                 // a panel's width, and between the panels
const DH = 76;                             // a panel's drawing, its height under the letter
const LETTER_AIR = 2;                      // the letter's foot to the drawing's room
const NUM_AIR = 5;                         // the lowest mark of a row to its numbers' caps
const NUM_PITCH = 12;                      // baseline to baseline within a number
const ROW_AIR = 12;                        // the lowest number of the first row to the second row's letters
const RS = 6, HR = 14;                     // (a): a stone's radius, centre to a stone's centre
const ROD = 1.1;
const SPIN = { r: 9.5, from: 65, to: 172, width: 0.7, head: 3.4 };   // (a): the curved arrow, degrees from x
const SINE = { w: 36, amp: 7 };            // (a): one wavelength across, its height
const RR = 22;                             // a ring's undisturbed radius
const B_EPS = 0.16, B_REACH = 11.5;          // (b): the largest change of the ring, the arrows' points per unit
const STRAIN = 0.36;                       // (e), (h): the drawn change for a strain A (5.4's H)
const H_REACH = 14;                        // (h): the arrows' points per unit
const BAR = 0.9, BAR_HALF = 14.5;          // (e): the stretch bars, their half-length
const BAR_OP = [0.35, 0.65, 1];
const TURN = { r: 32, from: 18, to: 72, width: 0.7, head: 3.4 };     // (e): the curved arrow
const GYRO = { x: [21, 63], axle: 14, axleW: 0.7, disc: [11.5, 3.6], line: 0.45, tick: [0.5, 0.95], turn: 12 };
const PLOT = { left: 15, w: 58, top: -30, h: 52, x: [Math.log10(0.02), 1], y: [-0.5, 6] };
const RING_D = 1.9, RING_DW = 0.55;        // (d): the open circle
const POLAR = 31;                          // (f): points per unit of the pattern
const LIGHT = '#eeebe5';                   // a neutral tint of the page (drawing.ts THEME)

const lg = Math.log10;
const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-300);
/** v as TeX in scientific notation with `d` decimals: "1.25\times10^{-15}". */
const sci = (v, d) => { const [m, e] = v.toExponential(d).split('e'); return `${m}\\times10^{${Number(e)}}`; };
/** The same as the chapter writes it. */
const sciMd = (v, d) => { const [m, e] = v.toExponential(d).split('e'); return `${m}\\times10^{${Number(e)}}`; };

// ---- linearized curvature of the all-zone solution -----------------------------------------------------------------
const ETA = [-1, 1, 1, 1];
const levi = (i, j, k) => ((i - j) * (j - k) * (k - i)) / 2;
/** h_mn from the trace-reversed hbar(X) (a 4 x 4 table at the event X). */
const fromBar = (hbar) => (m, n, X) => { const T = hbar(X), tr = [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * T[a][a], 0); return T[m][n] - (m === n ? 0.5 * ETA[m] * tr : 0); };
/** The tide E_ij = R_0i0j and the magnetic part B_ij = (1/2) eps_ipq R_pq0j at X (c = 1). */
function tides(h, X) {
	const E = [0, 1, 2].map((i) => [0, 1, 2].map((j) => riemann(h, X, 0, i + 1, 0, j + 1)));
	const B = [0, 1, 2].map((i) => [0, 1, 2].map((j) => {
		let s = 0;
		for (let p = 0; p < 3; p++) for (let q = 0; q < 3; q++) { const e = levi(i, p, q); if (e) s += e * riemann(h, X, p + 1, q + 1, 0, j + 1); }
		return 0.5 * s;
	}));
	return { E, B };
}
/** The all-zone solution of the turning table (G = c = Delta I = 1), its trace-reversed perturbation, as
 * tut-quadrupole-lib.js's allZoneTide but at any Omega. */
function rotorBar(W) {
	const c2 = (u) => Math.cos(2 * W * u), s2 = (u) => Math.sin(2 * W * u);
	const I = (u) => [[-0.5 * c2(u), -0.5 * s2(u), 0], [-0.5 * s2(u), 0.5 * c2(u), 0], [0, 0, 0]];
	const I1 = (u) => [[W * s2(u), -W * c2(u), 0], [-W * c2(u), -W * s2(u), 0], [0, 0, 0]];
	const I2 = (u) => [[2 * W * W * c2(u), 2 * W * W * s2(u), 0], [2 * W * W * s2(u), -2 * W * W * c2(u), 0], [0, 0, 0]];
	return (X) => {
		const s = Math.hypot(X[1], X[2], X[3]), n = [X[1] / s, X[2] / s, X[3] / s], u = X[0] - s;
		const A = I(u), B1 = I1(u), B2 = I2(u);
		let h00 = 0;
		const h0 = [0, 0, 0];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
			h00 += 2 * ((3 * n[i] * n[j] - (i === j ? 1 : 0)) * (A[i][j] / s ** 3 + B1[i][j] / s ** 2) + (n[i] * n[j] * B2[i][j]) / s);
			h0[i] += 2 * ((B1[i][j] * n[j]) / s ** 2 + (B2[i][j] * n[j]) / s);
		}
		const T = [[h00, -h0[0], -h0[1], -h0[2]], [-h0[0], 0, 0, 0], [-h0[1], 0, 0, 0], [-h0[2], 0, 0, 0]];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) T[i + 1][j + 1] = (2 * B2[i][j]) / s;
		return T;
	};
}
/** Each entry's amplitude, from the table at two instants a quarter cycle of 2 Omega apart. */
const amps = (P, Q) => P.map((row, i) => row.map((v, j) => Math.hypot(v, Q[i][j])));
const size = (T) => Math.sqrt(T.flat().reduce((s, v) => s + v * v, 0));

/** Every number the figure shows, computed, and checked against the chapter. */
async function numbers() {
	const n7 = chapter(check);                 // section 7.7's numbers: the power, the graviton, A r, the crossing
	const md = await (await fetch('/tutorial/geometry/reading-section-v.md')).text();
	const has = (s, what) => check(md.includes(s), `the chapter does not say ${what}: ${s}`);

	// (a) the wave
	const lam = (Math.PI * C) / OM, k = (2 * OM) / C;
	const lamKm = Math.round(lam / 1e4) * 10;
	check(lamKm === 9370 && Math.round(lam / (2 * Math.PI) / 1e4) * 10 === 1490, `lambda ${lam}`);
	has(`\\lambda = ${lamKm}$ km`, 'the wavelength');

	// a point mass moving across the line of sight: this B against 7.5's 3 sqrt 2 G M v / c r^3, E against sqrt 6 G M / r^3
	{
		const v = [0, 1e-3, 0];
		const hbar = (X) => {
			const p = [X[1] - v[0] * X[0], X[2] - v[1] * X[0], X[3] - v[2] * X[0]], s = Math.hypot(...p);
			const T = [[4 / s, -4 * v[0] / s, -4 * v[1] / s, -4 * v[2] / s], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
			for (let i = 1; i < 4; i++) T[i][0] = T[0][i];
			return T;
		};
		const { E, B } = tides(fromBar(hbar), [0, 1, 0, 0]);
		check(rel(size(E), Math.sqrt(6), 1e-5) && rel(size(B), 3 * Math.sqrt(2) * 1e-3, 1e-5), `the point mass: |E| ${size(E)}, |B| ${size(B)}`);
	}

	// (b), (c) near the rotor: G = c = Delta I = 1, the field point at r = 1 and Omega = x / 2, so that k r = x; at
	// x = 0.01 the near zone's leading terms (the next are smaller by x^2)
	const X0 = 0.01, W0 = X0 / 2, h0 = fromBar(rotorBar(W0));
	const at = (t) => tides(h0, [t, 1, 0, 0]);
	const t0 = at(0), tq = at(Math.PI / (4 * W0));
	const Ea = amps(t0.E, tq.E), Ba = amps(t0.B, tq.B);
	check(rel(Ea[2][2], 15 / 4, 1e-3), `E_zz is not (15/4) G Delta I / r^5: ${Ea[2][2]}`);
	// at t = 0 the rod lies along y, across the line to the pixel: E_zz < 0 (a stretch along the spin), E_xx > 0
	check(near(uHat(0)[0], 0, 1e-15) && uHat(0)[1] === 1, 'at t = 0 the rod is not along y');
	const Eb = t0.E;
	check(Eb[2][2] < 0 && rel(Eb[2][2], -Ea[2][2], 1e-3) && rel(Eb[0][0] / Eb[2][2], -12 / 5, 1e-3) && rel(Eb[1][1] / Eb[2][2], 7 / 5, 1e-3), `the near tide at t = 0: ${Eb.map((r) => r.join()).join(' | ')}`);
	check(Math.abs(Eb[0][2]) < 1e-6 * Ea[2][2] && Math.abs(Eb[1][2]) < 1e-6 * Ea[2][2], 'the near tide has entries across the plane');
	// half a cycle of the 32 Hz tide later it is reversed
	const th = at(Math.PI / (2 * W0)).E;
	check(rel(th[2][2], -Eb[2][2], 1e-3) && rel(th[0][0], -Eb[0][0], 1e-3), 'half a cycle later the tide is not reversed');
	const kappa = size(Ba) / X0;               // |B| r^5 / (G Delta I k r)
	const ratioPlane = size(Ba) / size(Ea) / X0;
	check((kappa / (15 / 4)).toFixed(2) === '1.17' && ratioPlane.toFixed(2) === '0.31', `|B| = ${kappa / 3.75} k r E_zz, ${ratioPlane} k r |E|`);
	// on the axis the two are equal (the chapter's note), and the gyroscopes 1 m apart along the line turn about z
	{
		const a0 = tides(h0, [0, 0, 0, 1]), aq = tides(h0, [Math.PI / (4 * W0), 0, 0, 1]);
		check((size(amps(a0.B, aq.B)) / size(amps(a0.E, aq.E)) / X0).toFixed(2) === '1.00', 'on the axis |B| / |E| is not k r');
	}
	check(Ba[2][0] > 0.5 * size(Ba) && Ba[0][0] < 1e-6 * size(Ba) && Ba[1][0] < 1e-6 * size(Ba), `B x-hat is not along z: ${Ba.map((r) => r.join()).join(' | ')}`);
	const kr = k * R_PIX;
	const Ezz = ((15 / 4) * G * DI) / R_PIX ** 5;
	const Bsize = (kappa * kr * G * DI) / R_PIX ** 5;
	check(kr.toExponential(1) === '6.7e-6' && Ezz.toExponential(2) === '1.25e-15' && Bsize.toExponential(1) === '9.8e-21', `E_zz ${Ezz}, |B| ${Bsize}, k r ${kr}`);
	has(`= ${sciMd(Ezz, 2)}\\unit{s^{-2}}$`, 'E_zz');
	has(`= ${sciMd(Bsize, 1)}\\unit{s^{-2}}$`, '|B|');
	check((Bsize / C).toExponential(0) === '3e-29', 'the gyroscopes\' turn');

	// (d) the crossing in the plane
	const cross = n7.rCross * lam;
	const crossKm = Math.round(cross / 1e4) * 10;
	check(crossKm === 2930, `the crossing ${cross}`);
	has(`0.313\\lambda = ${crossKm}$ km`, 'the crossing');

	// (e) on the axis: A, the wave's strain from I-double-dot, its stretch axis turning anticlockwise as seen from above
	const A = (4 * G * DI * OM * OM) / (C ** 4 * R_CAM);
	check(rel(A * R_CAM, (4 * G * DI * OM * OM) / C ** 4, 1e-14) && A.toExponential(1) === '1.7e-47', `A ${A}`);
	has(`= ${sciMd(A, 1)}$`, 'A');
	const strain = (n, t) => {
		const e = 1e-5, Ip = secondMoment(MASS, OM, D, t + e), I0 = secondMoment(MASS, OM, D, t), Im = secondMoment(MASS, OM, D, t - e);
		const dd = Ip.map((row, i) => row.map((v, j) => (v - 2 * I0[i][j] + Im[i][j]) / (e * e)));
		return project(n, dd).map((row) => row.map((v) => (2 * G * v) / (C ** 4 * R_CAM)));
	};
	const PHASES = [0, 30, 60];                // Omega (t - r/c), degrees: the three moments of (e)
	const axisAngles = PHASES.map((d) => {
		const h = strain([0, 0, 1], (d * Math.PI) / 180 / OM);
		check(rel(Math.hypot(h[0][0], h[0][1]), A, 1e-6) && rel(h[0][0], -h[1][1], 1e-6), `the strain on the axis at ${d} degrees`);
		// the stretch axis: the direction of the larger eigenvalue of h in the camera's x (right) and y (up)
		return (0.5 * Math.atan2(2 * h[0][1], h[0][0] - h[1][1]) * 180) / Math.PI;
	});
	check(axisAngles.every((a, i) => near(a, PHASES[i], 1e-3)), `the stretch axis is not at the phases: ${axisAngles}`);
	// the rotor turns the same way: the rod's angle grows with time
	{
		const ang = (t) => Math.atan2(uHat(OM * t)[1], uHat(OM * t)[0]);
		check(ang(0.001) > ang(0), 'the rotor does not turn anticlockwise seen from above');
	}
	const viAxis = circularShare(0), viEdge = circularShare(Math.PI / 2);
	check(viAxis === 1 && Math.abs(viEdge) < 1e-15, `V/I ${viAxis}, ${viEdge}`);
	has('$V/I = +1$ for this camera above it', 'V/I = +1');

	// (f) the flux on the axis, and the power pattern
	const P = (G / (5 * C ** 5)) * 32 * DI * DI * OM ** 6;
	const flux = (C ** 3 * (2 * OM) ** 2 * A * A) / (16 * Math.PI * G);
	check(P.toExponential(2) === '4.55e-41' && rel(flux, P / (1.6 * Math.PI * R_CAM ** 2), 1e-12) && flux.toExponential(1) === '9.1e-56', `the flux ${flux}`);
	has(`= ${sciMd(flux, 1)}\\unit{W\\,m^{-2}}$`, 'the flux');
	const pattern = (iota) => (1 + 6 * Math.cos(iota) ** 2 + Math.cos(iota) ** 4) / 8;
	for (const iota of [0, 0.4, 1.1, Math.PI / 2, 2.5]) { const a = amplitudes(iota); check(rel(pattern(iota), (a.hp ** 2 + a.hx ** 2) / 2, 1e-14), `the pattern at ${iota}`); }
	check(pattern(0) === 1 && rel(pattern(Math.PI / 2), 1 / 8, 1e-15), 'the pattern is not 1 on the axis and 1/8 edge-on');

	// (g) the graviton
	const years = (2 * HBAR * OM) / P / YEAR;
	check(years.toFixed(1) === '14.8', `one graviton every ${years} years`);
	has(`every ${years.toFixed(1)} years`, 'the graviton');

	// (h) edge-on, in 5.4's camera axes at iota = 90 degrees: h_+ = A/2, h_x = 0
	const { n: nEdge, e1, e2 } = cameraAxes(Math.PI / 2);
	const inAxes = (h) => { const q = (a, b) => a.reduce((s, ai, i) => s + ai * b.reduce((t, bj, j) => t + h[i][j] * bj, 0), 0); return { hp: (q(e1, e1) - q(e2, e2)) / 2, hx: q(e1, e2) }; };
	const edge0 = inAxes(strain(nEdge, 0)), edgeQ = inAxes(strain(nEdge, Math.PI / 4 / OM));
	check(rel(Math.hypot(edge0.hp, edgeQ.hp), A / 2, 1e-6) && Math.hypot(edge0.hx, edgeQ.hx) < 1e-9 * A, `edge-on: ${edge0.hp}, ${edge0.hx}`);
	check(edge0.hp > 0 && rel(edge0.hp, A / 2, 1e-6), 'edge-on, at t = 0, h_+ is not +A/2');
	check(near(e1[2], -1, 1e-15) && near(e2[1], 1, 1e-15) && near(nEdge[0], 1, 1e-15), 'the edge-on camera\'s axes');
	check((A / 2).toExponential(1) === '8.4e-48', `A / 2 = ${A / 2}`);
	has(`\\field A/2 =\n${sciMd(A / 2, 1)}$`, 'h_+ edge-on');
	has('so $V/I = 0$', 'V/I = 0');

	return { n7, lam, lamKm, Ezz, Eb, Bsize, cross, crossKm, A, axisAngles, PHASES, flux, years, pattern, viAxis, viEdge, edge: edge0, kr };
}

export default async function () {
	const N = await numbers();
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const W = 4 * PW + 3 * GUTTER;
	const x0 = ORIGIN - W / 2;
	const PANELS = 'abcdefgh';
	const DRAW = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH };
	const panels = [];

	/** A label with its baseline at y and its ink centred on x. */
	const placedBase = async (src, x, y, color = INK) => {
		const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
		const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
		return { src, svg: g, box: boxOf(g) };
	};
	const widthOf = async (src) => { const b = boxOf(await tex(src, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const lbl = (src, x, y, ax, ay, color = INK) => placed(src, x, y, ax, ay, color, SIZE);
	const clr = (src, x, y, ax, ay, dir, color = INK) => S.clear(src, x, y, ax, ay, dir, { color, size: SIZE });
	const ellipse = (cx, cy, a, b) => `M${n2(cx - a)},${n2(cy)}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;
	const loop = (cx, cy, a, b, n = 180) => Array.from({ length: n + 1 }, (_, i) => [cx + a * Math.cos((2 * Math.PI * i) / n), cy - b * Math.sin((2 * Math.PI * i) / n)]);
	const curved = (c, sp, color, what) => {
		const t = turning(c[0], c[1], sp.r, (sp.from * Math.PI) / 180, (sp.to * Math.PI) / 180, color, { width: sp.width, head: sp.head });
		S.raw(t.svg, 4);
		S.mark(t.pts, sp.width / 2, what);
		S.mark(t.head, 0, `${what}'s head`);
		S.arrows.push({ L: t.len, head: t.hd, what });
		check(sp.to > sp.from, `${what} does not turn anticlockwise`);
		return t;
	};

	/** A ring of twelve free steel beads pushed by the tide T (2 x 2, the page's right and up, in units of its largest
	 * entry), as tut-gw-lib.js's freeRing: the ring at 1 - eps T, the pale ring of half a cycle later at 1 + eps T, the
	 * dashed circle undisturbed; but an arrow, -T xi at `reach` points per unit, only at the four beads on the table's
	 * axes, where the push is straight out or in (at the others the near tide's push runs nearly along the ring). */
	const axisRing = (c, T, eps, reach, what) => {
		const mul = (M, [x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
		check(T[0][1] === 0 && T[1][0] === 0, `${what}: the table is not diagonal in the page's axes`);
		const fp = ([x, y]) => [c[0] + RR * x, c[1] - RR * y];
		const image = (xi, sgn) => { const t = mul(T, xi); return [xi[0] - sgn * eps * t[0], xi[1] - sgn * eps * t[1]]; };
		const circ = (k, n) => [Math.cos((2 * Math.PI * k) / n), Math.sin((2 * Math.PI * k) / n)];
		const ring = Array.from({ length: 361 }, (_, k) => fp(image(circ(k, 360), 1)));
		const pale = Array.from({ length: 361 }, (_, k) => fp(image(circ(k, 360), -1)));
		S.raw(`<path d="M${ring.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="none" stroke="${INK}" stroke-width="${RING.stroke}"/>`, 2);
		S.mark(ring, RING.stroke / 2, `${what}'s ring`);
		const arrows = [];
		for (let k = 0; k < 12; k++) {
			const xi = circ(k, 12), pt = fp(image(xi, 1)), q = fp(image(xi, -1));
			S.sphere(q, RING.bead, STEEL, { layer: 1, opacity: 0.3, spec: 0.3 }, `${what}'s pale bead ${k}`);
			S.sphere(pt, RING.bead, STEEL, { layer: 3, spec: 0.6, shininess: 36 }, `${what}'s bead ${k}`);
			if (k % 3) continue;
			const a = mul(T, xi).map((v) => -v), out = a[0] * xi[0] + a[1] * xi[1];
			check(near(Math.abs(out), Math.hypot(...a), 1e-12), `${what}: bead ${k}'s push is not along its radius`);
			const u = [a[0] / Math.hypot(...a), -a[1] / Math.hypot(...a)];
			const from = [pt[0] + u[0] * (RING.bead + RING.tail), pt[1] + u[1] * (RING.bead + RING.tail)];
			const len = Math.hypot(...a) * reach;
			const drawn = S.arrow(from, [from[0] + u[0] * len, from[1] + u[1] * len], { color: out > 0 ? ACCENT : ACCENT2, width: RING.width, head: RING.head, layer: 4, what: `${what}'s arrow ${k}` });
			arrows.push({ k, out, L: drawn.L, from, to: drawn.B });
		}
		// inward arrows from opposite beads stop short of one another
		const ins = arrows.filter((a) => a.out < 0);
		for (let i = 0; i < ins.length; i++) for (let j = i + 1; j < ins.length; j++) check(Math.hypot(ins[i].to[0] - ins[j].to[0], ins[i].to[1] - ins[j].to[1]) > 4, `${what}: two inward arrows meet`);
		const segs = arrows.map((a) => [a.from, a.to]);
		const clearOf = 0.36 * RING.head + RING.width / 2 + 0.6;
		const nearArrow = (q) => segs.some(([P0, P1]) => {
			const dd = [P1[0] - P0[0], P1[1] - P0[1]], t = Math.max(0, Math.min(1, ((q[0] - P0[0]) * dd[0] + (q[1] - P0[1]) * dd[1]) / (dd[0] ** 2 + dd[1] ** 2)));
			return Math.hypot(q[0] - P0[0] - t * dd[0], q[1] - P0[1] - t * dd[1]) < clearOf;
		});
		drawDashes(S, dashes(Array.from({ length: 721 }, (_, k) => fp(circ(k, 720))), { skip: nearArrow }), { layer: 0, width: UNDISTURBED_W, what: `${what}'s undisturbed circle` });
		drawDashes(S, dashes(pale, { dash: RING.pale, skip: nearArrow }), { color: RULE, layer: 0, width: 0.5, what: `${what}'s pale ring` });
		return { ring, pale, arrows };
	};

	// ---- the panels' places: letters, and the room of each drawing
	const LT = (await lbl('\\text{(a)}', 0, 0, 0, 0)).box;
	const letterH = LT.b - LT.t;
	const rowTop = [ORIGIN - 150];
	for (let i = 0; i < 8; i++) panels.push({ key: PANELS[i], px: x0 + (i % 4) * (PW + GUTTER), row: Math.floor(i / 4) });

	const marksFrom = () => S.marks.length;
	const rowsDone = [];
	for (let row = 0; row < 2; row++) {
		const py = rowTop[row];
		const cy = py + letterH + LETTER_AIR + DH / 2;
		for (const p of panels.filter((q) => q.row === row)) {
			p.py = py; p.cy = cy; p.cx = p.px + PW / 2;
			p.m0 = marksFrom(); p.b0 = S.boxes.length; p.l0 = L.length; p.numLabels = [];
			const letter = await lbl(`\\text{(${p.key})}`, p.px, py, 0, 0);
			L.push(letter);
			await DRAW[p.key](p);
			p.m1 = marksFrom(); p.b1 = S.boxes.length; p.l1 = L.length;
		}
		// the numbers: under the row's lowest mark, each panel's lines centred on it, packed greedily into the width
		const pr = panels.filter((q) => q.row === row);
		const low = Math.max(...pr.flatMap((p) => [
			...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.map((q) => q[1] + m.r)),
			...S.boxes.slice(p.b0, p.b1).map((b) => b.box.b),
			...L.slice(p.l0 + 1, p.l1).map((g) => g.box.b)
		]));
		const capTop = low + NUM_AIR;
		const probe = await lbl('\\text{0}', 0, 0, 0, 0);
		const base0 = capTop + (probe.box.b - probe.box.t);
		let lowest = 0;
		for (const p of pr) {
			const lines = [];
			let line = '';
			for (const atom of p.num) {
				const next = line ? `${line}\\ ${atom}` : atom;
				if (line && (await widthOf(next)) > PW - 2) { lines.push(line); line = atom; } else line = next;
			}
			lines.push(line);
			let base = base0, prevB = -Infinity, prevBase = -Infinity;
			for (const [j, s] of lines.entries()) {
				check((await widthOf(s)) <= PW - 2, `(${p.key}): the number's line ${s} is wider than its panel`);
				// the next baseline NUM_PITCH under the last, or lower, so that the lines keep LABEL_GAP of air
				const pr0 = await placedBase(s, p.cx, 0);
				base = j === 0 ? base0 : Math.max(prevBase + NUM_PITCH, prevB + LABEL_GAP + 0.1 - pr0.box.t);
				const g = await placedBase(s, p.cx, base);
				prevB = g.box.b; prevBase = base;
				L.push(g);
				p.numLabels.push(g);
				lowest = Math.max(lowest, g.box.b);
			}
			p.lines = lines;
		}
		rowsDone.push({ capTop, lowest });
		if (row === 0) rowTop.push(lowest + ROW_AIR);
	}

	// ---- every panel keeps to its own column
	for (const p of panels) {
		const xs = [
			...S.marks.slice(p.m0, p.m1).flatMap((m) => m.pts.flatMap((q) => [q[0] - m.r, q[0] + m.r])),
			...S.boxes.slice(p.b0, p.b1).flatMap((b) => [b.box.l, b.box.r]),
			...[...L.slice(p.l0, p.l1), ...p.numLabels].flatMap((g) => [g.box.l, g.box.r])
		];
		check(Math.min(...xs) >= p.px - 0.5 && Math.max(...xs) <= p.px + PW + 0.5, `(${p.key}) leaves its column: ${Math.min(...xs) - p.px}, ${Math.max(...xs) - p.px - PW}`);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...N, n7: undefined, panels: panels.map((p) => ({ key: p.key, lines: p.lines })) };
	return finish(S, L, [340, 375]);

	// ======================================================================================================================
	// the eight drawings, each about its panel's centre (p.cx, p.cy)
	async function drawA(p) {
		// the rotor, seen from above: x right, y up, at Omega t = -60 degrees (the rod at 30 degrees from x)
		const ph = -Math.PI / 3, u3 = uHat(ph);
		check(near(Math.atan2(u3[1], u3[0]), Math.PI / 6, 1e-12), 'the rod is not at 30 degrees');
		const u = [u3[0], -u3[1]];
		const O = [p.px + HR * Math.cos(Math.PI / 6) + RS + 1, p.cy];
		const at = (s) => [O[0] + s * u[0], O[1] + s * u[1]];
		S.path([at(-(HR - RS + 0.6)), at(HR - RS + 0.6)], { color: INK, width: ROD, cap: 'butt', layer: 1, what: 'the rod' });
		for (const [k, s] of [1, -1].entries()) {
			const c = at(s * HR);
			S.raw(picture(`${name}-stone${k}`, art, c[0], c[1], RS, circlePath(c[0], c[1], RS)) + `<path d="${circlePath(c[0], c[1], RS)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 3);
			S.mark([c], RS, `stone ${k}`);
		}
		// the curved arrow clears both stones and the rod
		curved(O, SPIN, INK, 'the turning');
		for (const a of [SPIN.from, SPIN.to]) for (const s of [1, -1]) {
			const q = [O[0] + SPIN.r * Math.cos((a * Math.PI) / 180), O[1] - SPIN.r * Math.sin((a * Math.PI) / 180)];
			check(Math.hypot(q[0] - at(s * HR)[0], q[1] - at(s * HR)[1]) > RS + 1.2, 'the curved arrow touches a stone');
		}
		// one wavelength of the wave, and its dimension line
		const sx = p.px + PW - 1 - SINE.w, sy = p.cy - 3;
		const P = new Plot({ left: sx, top: sy - SINE.amp, w: SINE.w, h: 2 * SINE.amp, x0: 0, x1: 1, y0: -1, y1: 1 });
		const pts = graph(P, (t) => Math.sin(2 * Math.PI * t), 0, 1);
		check(longest(pts) <= 0.2501, 'the wave is coarse');
		S.path(pts, { color: FIELD, width: CURVE, cap: 'butt', layer: 2, what: 'the wave' });
		const yd = sy + SINE.amp + 6;
		S.path([[sx, yd], [sx + SINE.w, yd]], { color: DIM, width: HAIR, cap: 'butt', what: 'the wavelength' });
		for (const x of [sx, sx + SINE.w]) S.path([[x, yd - 2.2], [x, yd + 2.2]], { color: DIM, width: HAIR, cap: 'butt', what: 'the wavelength\'s end' });
		check(sx - (O[0] + HR + RS) >= 4, 'the wave touches the rotor');
		p.num = [`\\lambda = ${N.lamKm}\\ \\mathrm{km}`];
	}

	async function drawB(p) {
		// the plane through the line to the rotor (x, right) and the spin (z, up); at t = 0 the near tide is
		// diag(E_xx, E_zz) there, E_xx = -(12/5) E_zz > 0
		const c = [p.px + 52, p.cy + 1];
		const Ex = N.Eb[0][0], Ez = N.Eb[2][2];
		const T = [[1, 0], [0, Ez / Ex]];        // in units of E_xx: the page's x (right) and z (up)
		const r = axisRing(c, T, B_EPS, B_REACH, 'the pixel\'s ring');
		// stretched along the spin (orange at the top and bottom), squeezed along the line (blue at the sides)
		check(r.arrows.find((a) => a.k === 3).out > 0 && r.arrows.find((a) => a.k === 0).out < 0, 'the ring is not stretched along the spin and squeezed along the line');
		check(near(r.arrows.find((a) => a.k === 3).L / r.arrows.find((a) => a.k === 0).L, 5 / 12, 1e-3), 'the arrows are not in the ratio of E_zz to E_xx');
		// the rotor lies to the left, 10 m away
		const y = c[1];
		const left = Math.min(...r.pale.map((q) => q[0])) - RING.bead - 2.2;
		const a = S.arrow([left, y], [p.px + 1, y], { color: DIM, width: HAIR + 0.1, head: 3.2, layer: 2, what: 'the way to the rotor' });
		check(a.L >= 10, 'the arrow to the rotor is too short');
		L.push(await clr('10\\ \\mathrm{m}', (p.px + 1 + left) / 2, y - 1.6 - LABEL_GAP, 0.5, 1, [0, -1]));
		p.num = [`{\\color{${CURV}}\\mathcal E_{zz}} =`, `${sci(N.Ezz, 2)}\\,\\mathrm{s^{-2}}`];
	}

	async function drawC(p) {
		// two gyroscopes 1 m apart along the line to the rotor, axles along the spin, seen a little from above; a tick on
		// each disc's near rim, the right one's turned about its axle (B x-hat is along z: the relative turn is about it)
		const gy = p.cy - 2;
		for (const [j, dx] of GYRO.x.entries()) {
			const gx = p.px + dx, gw = `gyroscope ${j}`;
			S.path([[gx, gy], [gx, gy + GYRO.axle]], { color: INK, width: GYRO.axleW, cap: 'round', layer: 1, what: `${gw}'s axle, below` });
			S.raw(`<path d="${ellipse(gx, gy, GYRO.disc[0], GYRO.disc[1])}" fill="${LIGHT}" stroke="${INK}" stroke-width="${GYRO.line}"/>`, 2);
			S.mark(loop(gx, gy, GYRO.disc[0], GYRO.disc[1]), GYRO.line / 2, `${gw}'s disc`);
			S.boxes.push({ box: { l: gx - GYRO.disc[0], r: gx + GYRO.disc[0], t: gy - GYRO.disc[1], b: gy + GYRO.disc[1] }, what: `${gw}'s disc` });
			S.path([[gx, gy - GYRO.disc[1] + 0.6], [gx, gy - GYRO.axle]], { color: INK, width: GYRO.axleW, cap: 'round', layer: 3, what: `${gw}'s axle, above` });
			// the tick: on the near rim (55 degrees right of the nearest point, seen from above), the right one turned anticlockwise
			const ang = ((-55 + (j === 1 ? GYRO.turn : 0)) * Math.PI) / 180;
			const tp = (f) => [gx + f * GYRO.disc[0] * Math.cos(ang), gy - f * GYRO.disc[1] * Math.sin(ang)];
			S.raw(`<path d="M${n2(tp(GYRO.tick[0])[0])},${n2(tp(GYRO.tick[0])[1])}L${n2(tp(GYRO.tick[1])[0])},${n2(tp(GYRO.tick[1])[1])}" stroke="${INK}" stroke-width="0.6" stroke-linecap="butt"/>`, 3);
		}
		// the dimension: 1 m between the axles, under their feet
		const yd = gy + GYRO.axle + 4.5, [g0, g1] = GYRO.x.map((dx) => p.px + dx);
		S.path([[g0, yd], [g1, yd]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the gyroscopes\' dimension' });
		for (const g of [g0, g1]) S.path([[g, yd - 2.2], [g, yd + 2.2]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the dimension\'s end' });
		L.push(await lbl('1\\ \\mathrm{m}', (g0 + g1) / 2, yd + 2.2 + LABEL_GAP + 0.4, 0.5, 0));
		p.num = [`|{\\color{${CURV}}\\mathcal B}| =`, `${sci(N.Bsize, 1)}\\,\\mathrm{s^{-2}}`];
	}

	async function drawD(p) {
		const P = new Plot({ left: p.px + PLOT.left, top: p.cy + PLOT.top, w: PLOT.w, h: PLOT.h, x0: PLOT.x[0], x1: PLOT.x[1], y0: PLOT.y[0], y1: PLOT.y[1] });
		const curve = (f) => (t) => lg(f(2 * Math.PI * 10 ** t));
		const AIR = 1.2;
		const lowest = P.y0 + (AIR + (CURVE + AXIS) / 2) / (P.h / (P.y1 - P.y0)), highest = P.y1;
		const span = (f) => { let a = P.x0, b = P.x1; while (f(a) > highest) a += 1e-5; while (f(b) < lowest) b -= 1e-5; return [a, b]; };
		const lines = [
			{ key: 'near law', f: curve(nearLaw), color: INK, width: CURVE / 2, layer: 1 },
			{ key: 'far law', f: curve(farLaw), color: INK, width: CURVE / 2, layer: 1 },
			{ key: 'all-zone curve', f: curve(exact), color: CURV, width: CURVE, layer: 2 }
		];
		for (const { key, f, color, width, layer } of lines) {
			const [a, b] = span(f);
			const pts = graph(P, f, a, b);
			check(longest(pts) <= 0.2501, `the ${key} is coarse`);
			S.path(pts, { color, width, layer, cap: 'butt', what: `the ${key}` });
		}
		for (let t = P.x0; t <= P.x1; t += 0.01) check(curve(exact)(t) >= Math.max(curve(nearLaw)(t), curve(farLaw)(t)) - 1e-12, `the curve dips below a law at ${t}`);
		// the crossing, at 0.313 lambda
		const tc = lg(N.n7.rCross);
		check(near(curve(nearLaw)(tc), curve(farLaw)(tc), 1e-12) && near(N.n7.rCross, X_CROSS / (2 * Math.PI), 1e-15), 'the laws do not cross at the circle');
		const [cx, cy] = P.at(tc, lg(4));
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${RING_D}" fill="${PAGE}" stroke="${INK}" stroke-width="${RING_DW}"/>`, 3);
		S.mark([[cx, cy]], RING_D + RING_DW / 2, 'the crossing');
		// the axes
		S.path([[P.left, P.top], [P.left, P.bottom], [P.right, P.bottom]], { color: DIM, width: AXIS, cap: 'butt', what: 'the axes' });
		L.push(await lbl('r', P.right + LABEL_GAP + 0.6, P.bottom, 0, 0.5, DIM));
		L.push(await lbl(`r|{\\color{${CURV}}\\mathcal E_{zz}}|`, P.left - 1.5, P.top - LABEL_GAP - 0.2, 0, 1, DIM));
		// the laws' names, beside their lines
		L.push(await clr('r^{-5}', P.left + AXIS / 2 + LABEL_GAP + 9, P.top + 1, 0, 0, [1, 0]));
		L.push(await clr('r^{-1}', P.right, P.Y(lg(4)) - CURVE / 4 - LABEL_GAP - 0.4, 1, 1, [0, -1]));
		p.num = [`${N.crossKm}\\ \\mathrm{km},`, '\\text{in the plane}'];
	}

	async function drawE(p) {
		// face on, looking down the spin: x right, y up; the ring at the last moment, filled with the neutral tint
		const c = [p.px + 40, p.cy + 2];
		const last = (N.PHASES[2] * Math.PI) / 180;
		// the strain in units of A at that moment: h = (cos 2a, sin 2a; sin 2a, -cos 2a) with the stretch axis at a
		const h = [[Math.cos(2 * last), Math.sin(2 * last)], [Math.sin(2 * last), -Math.cos(2 * last)]];
		const image = (xi) => [xi[0] + (STRAIN / 2) * (h[0][0] * xi[0] + h[0][1] * xi[1]), xi[1] + (STRAIN / 2) * (h[1][0] * xi[0] + h[1][1] * xi[1])];
		const fp = ([x, y]) => [c[0] + RR * x, c[1] - RR * y];
		const ring = Array.from({ length: 361 }, (_, k) => fp(image([Math.cos((2 * Math.PI * k) / 360), Math.sin((2 * Math.PI * k) / 360)])));
		const d = 'M' + ring.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${LIGHT}" stroke="none"/>`, 0);
		S.raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${RING.stroke}"/>`, 2);
		S.mark(ring, RING.stroke / 2, 'the face-on ring');
		// its semi-axes 1 +- STRAIN/2 along the stretch axis at 60 degrees
		{
			const ax = [Math.cos(last), Math.sin(last)], im = image(ax), across = image([-ax[1], ax[0]]);
			check(near(Math.hypot(...im), 1 + STRAIN / 2, 1e-12) && near(Math.hypot(...across), 1 - STRAIN / 2, 1e-12), 'the face-on ring\'s semi-axes');
		}
		for (let k = 0; k < 12; k++) {
			const t = (2 * Math.PI * k) / 12, q = fp(image([Math.cos(t), Math.sin(t)]));
			S.sphere(q, RING.bead, STEEL, { layer: 3, spec: 0.6, shininess: 36 }, `the face-on ring's bead ${k}`);
		}
		const F = Array.from({ length: 721 }, (_, k) => fp([Math.cos((2 * Math.PI * k) / 720), Math.sin((2 * Math.PI * k) / 720)]));
		drawDashes(S, dashes(F), { layer: 0, width: UNDISTURBED_W, what: 'the face-on ring\'s undisturbed circle' });
		// the stretch axis at the three moments, the earlier ones paler
		for (const [i, deg] of N.axisAngles.entries()) {
			const a = (deg * Math.PI) / 180, u = [Math.cos(a), -Math.sin(a)];
			const A0 = [c[0] - BAR_HALF * u[0], c[1] - BAR_HALF * u[1]], B0 = [c[0] + BAR_HALF * u[0], c[1] + BAR_HALF * u[1]];
			S.raw(`<path d="M${n2(A0[0])},${n2(A0[1])}L${n2(B0[0])},${n2(B0[1])}" stroke="${ACCENT}" stroke-opacity="${BAR_OP[i]}" stroke-width="${BAR}" stroke-linecap="butt"/>`, 2.5 + i / 10);
			S.mark([A0, B0], BAR / 2, `the stretch axis at ${deg}`);
		}
		check(N.axisAngles[1] > N.axisAngles[0] && N.axisAngles[2] > N.axisAngles[1], 'the stretch axis does not turn anticlockwise');
		// the bars' ends stay clear of the ring and its beads
		for (const deg of N.axisAngles) for (const s of [1, -1]) {
			const a = (deg * Math.PI) / 180, e = [c[0] + s * BAR_HALF * Math.cos(a), c[1] - s * BAR_HALF * Math.sin(a)];
			check(Math.min(...ring.map((q) => Math.hypot(q[0] - e[0], q[1] - e[1]))) > RING.bead + BAR / 2 + 0.8, `the bar at ${deg} degrees reaches the ring`);
		}
		curved(c, TURN, INK, 'the turning of the pattern');
		p.num = [`{\\color{${FIELD}}A} = ${sci(N.A, 1)},`, `V/I = +${N.viAxis}`];
	}

	async function drawF(p) {
		// 5.4's power pattern about the spin (up the page), and a square of wave front with the flux through it
		const O = [p.px + 22, p.cy + 2];
		const pts = [];
		for (let i = 0; i <= 1440; i++) { const t = (2 * Math.PI * i) / 1440, f = N.pattern(t); pts.push([O[0] + POLAR * f * Math.sin(t), O[1] - POLAR * f * Math.cos(t)]); }
		check(longest(pts) <= 0.25, 'the pattern is coarse');
		const d = 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${LIGHT}" stroke="none"/>`, 0);
		S.path(pts, { color: INK, width: CURVE, layer: 2, cap: 'butt', what: 'the power pattern' });
		// the spin's axis, dashed, beyond the pattern at both ends
		const reach = POLAR + 5;
		const n = 9, step = (2 * reach) / (2 * n - 1);
		for (let k = 0; k < n; k++) {
			const y0 = O[1] - reach + 2 * k * step;
			S.path([[O[0], y0], [O[0], y0 + step]], { color: FAINT, width: HAIR, cap: 'butt', layer: 1, what: 'the spin axis' });
		}
		// the square of wave front: a horizontal square seen a little from the side, three arrows up through it
		const q = [p.px + 63, p.cy - 4];
		const sq = [[-11, 2.5], [5, 2.5], [11, -2.5], [-5, -2.5]].map(([x, y]) => [q[0] + x, q[1] + y]);
		S.fill('M' + sq.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z', { l: q[0] - 11, r: q[0] + 11, t: q[1] - 2.5, b: q[1] + 2.5 }, { color: LIGHT, layer: 1, what: 'the wave front', solid: false });
		S.path(sq, { color: INK, width: 0.45, closed: true, cap: 'butt', layer: 2, what: 'the wave front' });
		// each arrow meets the square's plane on its middle line: below it, it passes under the square's fill; above, over
		for (const dx of [-5.5, 0, 5.5]) {
			S.path([[q[0] + dx, q[1] + 17], [q[0] + dx, q[1]]], { color: INK, width: 0.55, cap: 'butt', layer: 0, what: 'a flux arrow, below' });
			S.arrow([q[0] + dx, q[1]], [q[0] + dx, q[1] - 17], { color: INK, width: 0.55, head: 3.2, layer: 3, what: 'a flux arrow' });
		}
		check(q[0] - 11 - 6 > O[0] + POLAR * Math.max(...pts.map((pt) => (pt[0] - O[0]) / POLAR)), 'the square touches the pattern');
		p.num = [`${sci(N.flux, 1)}`, '\\mathrm{W\\,m^{-2}}'];
	}

	async function drawG(p) {
		// a counter reading 1, and a clock
		const c = [p.px + 20, p.cy];
		const box = { l: c[0] - 15, r: c[0] + 15, t: c[1] - 11, b: c[1] + 11 };
		S.raw(`<rect x="${n2(box.l)}" y="${n2(box.t)}" width="${n2(box.r - box.l)}" height="${n2(box.b - box.t)}" rx="2.6" fill="${LIGHT}" stroke="${INK}" stroke-width="0.6"/>`, 1);
		S.mark([[box.l, box.t], [box.r, box.t], [box.r, box.b], [box.l, box.b], [box.l, box.t]], 0.3, 'the counter');
		const one = await placed('1', c[0], c[1], 0.5, 0.5, INK, 16);
		one.on = ['the counter'];
		L.push(one);
		const k = [p.px + 62, p.cy], R = 16;
		S.raw(`<circle cx="${n2(k[0])}" cy="${n2(k[1])}" r="${R}" fill="${PAGE}" stroke="${INK}" stroke-width="0.6"/>`, 1);
		S.mark(loop(k[0], k[1], R, R), 0.3, 'the clock');
		for (let i = 0; i < 12; i++) {
			const a = (i * Math.PI) / 6, len = i % 3 === 0 ? 3.2 : 2;
			S.path([[k[0] + (R - 0.3) * Math.cos(a), k[1] - (R - 0.3) * Math.sin(a)], [k[0] + (R - 0.3 - len) * Math.cos(a), k[1] - (R - 0.3 - len) * Math.sin(a)]], { color: INK, width: i % 3 === 0 ? 0.6 : HAIR, cap: 'butt', layer: 2, what: 'an hour' });
		}
		const hand = (deg, len, w) => S.path([k, [k[0] + len * Math.cos((deg * Math.PI) / 180), k[1] - len * Math.sin((deg * Math.PI) / 180)]], { color: INK, width: w, cap: 'round', layer: 3, what: 'a hand' });
		hand(90, R - 5.5, 0.7);
		hand(150, R - 8, 1.1);
		S.raw(`<circle cx="${n2(k[0])}" cy="${n2(k[1])}" r="1.1" fill="${INK}"/>`, 3);
		p.num = [`${N.years.toFixed(1)}\\text{ years}`];
	}

	async function drawH(p) {
		// edge-on, the camera's e_1 (the first axis) down the page and e_2 to the right: at t = 0, h_+ = A/2, so the
		// ring is stretched along e_1 (vertical) and squeezed along e_2; T = -h / A in the page's axes (right, up)
		const c = [p.px + 42, p.cy + 1];
		const hp = N.edge.hp / N.A;
		check(near(hp, 0.5, 1e-6), `edge-on h_+ / A = ${hp}`);
		const T = [[hp, 0], [0, -hp]];           // -h: h along the page's right (e_2) is -h_+, up (-e_1) is +h_+
		const r = freeRing(S, check, { c, R: RR, T, eps: STRAIN / 2, phase: 0, reach: H_REACH, what: 'the edge-on ring' });
		const top = r.beads.find((b) => b.k === 3), side = r.beads.find((b) => b.k === 0);
		check(top.out > 0 && side.out < 0, 'the edge-on ring is not stretched along its first axis');
		// half the change of (e)'s ring: semi-axes 1 +- STRAIN/4
		const ys = r.ring.map((q) => q[1]);
		check(near((Math.max(...ys) - Math.min(...ys)) / (2 * RR), 1 + STRAIN / 4, 1e-4), 'the edge-on ring is not half as changed as the face-on one');
		p.num = [`{\\color{${FIELD}}h_+} = {\\color{${FIELD}}A}/2`, `= ${sci(N.A / 2, 1)},`, `V/I = ${N.viEdge === 0 ? 0 : N.viEdge.toFixed(0)}`];
	}
}

