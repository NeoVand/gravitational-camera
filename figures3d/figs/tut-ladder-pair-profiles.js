// The tutorial, chapter 13.3 (tutorial/what-a-field-keeps/ladder.md), its third diagram: the paper's pair as four
// derivatives of a confined function. Three stacked panels on one radial axis r from 0 to 1.15 R, marked at 0, R/sqrt 2
// and R under the lowest, with the radius R dotted up through all three. Top: the difference delta rho = rho_B -
// rho_A, as arrows on the axis in matter's colour, their lengths in proportion to the masses: up at r = 0 (M/2, B's
// point), down at R/sqrt 2 (M, A's shell), up at R (M/2, B's shell). Middle: psi_1, with Lap psi_1 = 4 pi G delta rho,
// exact (it is Phi_B - Phi_A): (GM/2R)(2 sqrt 2 - 1 - R/r) inside R/sqrt 2, falling to minus infinity at the centre,
// drawn down to -0.42 GM/R and ended there by an arrowhead marked "-infinity"; (GM/2R)(R/r - 1) out to R, kinked at
// both shells; zero beyond. Bottom: psi_2, with Lap psi_2 = psi_1, zero outside R: (GMR)[(sqrt 2 - 1)/4 - r/4R + (2
// sqrt 2 - 1) r^2/12R^2] inside R/sqrt 2 and GM (R - r)^3/12Rr out to R, which meets zero at R with zero slope (and
// zero curvature) and leaves the centre with the finite slope -GM/4, a cone point. Both potentials in the field's
// colour, drawn on along the axis beyond R where they are zero. Each panel names its equation.
// Departures from the diagram's comment: "each panel on its own scale" is said once, in a small note under the axis,
// rather than at each panel. Since psi_2 meets zero with zero slope and zero curvature, at the true scale it looks flat
// well inside R; so it is drawn a second time, twenty times higher and dashed, from where that copy fits the panel to R,
// marked "x20", and the caption says so.
// Exact: the positions of the masses and the ratio of the arrows, the shapes of both curves (tut-ladder-lib.js
// asserts the closed forms: Lap psi_2 = psi_1 by differences, int psi_1 dV = 0, the zeros, slopes and kinks).
// Schematic: each panel's height scale, chosen for the drawing, and the depth at which psi_1 is cut.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS } from './tut-pot-lib.js';
import { Plot, xAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, MATTER, FIELD, MASSES, A, psi1, psi2, PSI1_PEAK, PSI2_CENTRE, PSI1_ZERO } from './tut-ladder-lib.js';

const name = 'tut-ladder-pair-profiles';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const PER_R = 188;                         // points per R across
const TO = 1.15;                           // the axis's end, in R
const MASS = 28;                           // points per M, the arrows of delta rho
const PSI1 = 76;                           // points per GM/R, psi_1
const CLIP = -0.42;                        // where psi_1 is cut, in GM/R
const PSI2 = 420;                          // points per GMR, psi_2
const GAP = 13;                            // between one panel's lowest mark and the next one's highest
const CURVE = 0.7;                         // the potentials
const ZOOM = 20;                          // psi_2 near R drawn again, this many times higher
const ZOOM_W = 0.5, ZOOM_DASH = [2.2, 1.3];
const ARROW = 0.8, HEAD = 3.8;             // the masses
const caption = 'Look first at the bottom curve, which meets zero at the radius $R$ and stays there: the pair\'s difference is four derivatives, two Laplacians, of a function that vanishes outside the body. The top panel is the difference itself, two shells and a point; the middle one is its potential, which already vanishes outside $R$. The shapes are exact; the heights are schematic, and the dashed curve is the bottom one drawn twenty times higher.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'ladder-pair-profiles', caption);
	const S = new Sheet(name);
	const L = [];
	const M = `{\\color{${MATTER}}M}`, rho = `{\\color{${MATTER}}\\rho}`, drho = `{\\color{${MATTER}}\\delta\\rho}`, psi = `{\\color{${FIELD}}\\psi}`;
	const left = ORIGIN - (TO * PER_R) / 2, w = TO * PER_R;

	// ---- the three panels, top to bottom, each its own height scale
	const up0 = Math.max(...MASSES.map(([, m]) => m)) * MASS, down0 = -Math.min(...MASSES.map(([, m]) => m)) * MASS;
	const y0 = ORIGIN - 110;
	const P0 = new Plot({ left, top: y0 - up0, w, h: up0 + down0, x0: 0, x1: TO, y0: -down0 / MASS, y1: up0 / MASS });
	const up1 = PSI1_PEAK * PSI1, down1 = -CLIP * PSI1;
	const y1 = y0 + down0 + GAP + up1;
	const P1 = new Plot({ left, top: y1 - up1, w, h: up1 + down1, x0: 0, x1: TO, y0: CLIP, y1: PSI1_PEAK });
	const up2 = PSI2_CENTRE * PSI2;
	const y2 = y1 + down1 + GAP + up2;
	const P2 = new Plot({ left, top: y2 - up2, w, h: up2, x0: 0, x1: TO, y0: 0, y1: PSI2_CENTRE });
	check(near(P0.Y(0), y0, 1e-9) && near(P1.Y(0), y1, 1e-9) && near(P2.Y(0), y2, 1e-9), 'the baselines');

	// the radius R, dotted from the lowest axis up to the top baseline (where B's shell's arrow goes on)
	S.dots([P2.X(1), y2], [P0.X(1), y0], { color: FAINT, clear0: AXIS / 2 + 0.6, clear1: 0.4, layer: 0.5, what: 'the radius R' });

	// ---- top: delta rho, arrows on the axis
	S.path([[P0.X(0), y0], [P0.X(TO), y0]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the top baseline' });
	const tags = [];
	for (const [r, m] of MASSES) {
		const x = P0.X(r), tip = P0.Y(m);
		S.arrow([x, y0], [x, tip], { color: MATTER, width: ARROW, head: HEAD, layer: 3, what: `the mass at ${r}` });
		check(near(Math.abs(tip - y0), Math.abs(m) * MASS, 1e-9), 'an arrow\'s length');
		const src = m > 0 ? `\\tfrac12${M}` : `-${M}`;
		tags.push(await placed(src, x + LABEL_GAP + 1.6, m > 0 ? y0 - LABEL_GAP - 0.6 : y0 + LABEL_GAP + 0.6, 0, m > 0 ? 1 : 0, INK));
	}
	L.push(...tags);
	check(near(MASSES[1][1], -2 * MASSES[0][1]) && near(MASSES[2][1], MASSES[0][1]), 'the arrows are not in the ratio 1 : -2 : 1');
	L.push(await placed(`${drho} = ${rho}_B - ${rho}_A`, P0.X(0.06), y0 + LABEL_GAP + 1.2, 0, 0, INK));

	// ---- middle: psi_1
	{
		const rClip = 1 / (2 * ((2 * Math.SQRT2 - 1) / 2 - CLIP));      // where psi_1 = CLIP
		check(near(psi1(rClip), CLIP, 1e-12), 'the cut');
		const n = 600, inner = [], outer = [];
		for (let k = 0; k <= n; k++) { const r = rClip + ((A - rClip) * k) / n; inner.push(P1.at(r, psi1(r))); }
		for (let k = 0; k <= n; k++) { const r = A + ((1 - A) * k) / n; outer.push(P1.at(r, psi1(r))); }
		S.path([[P1.X(0), y1], [P1.X(TO), y1]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the middle baseline' });
		// the cut end: an arrowhead along the curve, pointing down towards the centre's minus infinity
		const back = inner.findIndex((p) => Math.hypot(p[0] - inner[0][0], p[1] - inner[0][1]) >= HEAD * 1.6);
		S.path(inner.slice(back), { color: FIELD, width: CURVE, layer: 2, what: 'psi_1 inside' });
		S.arrow(inner[back], inner[0], { color: FIELD, width: CURVE, head: HEAD, layer: 2, what: 'psi_1\'s cut end' });
		S.path(outer, { color: FIELD, width: CURVE, layer: 2, what: 'psi_1 between the shells' });
		S.path([P1.at(1, 0), P1.at(TO, 0)], { color: FIELD, width: CURVE, layer: 2, cap: 'butt', what: 'psi_1 outside' });
		L.push(await placed('-\\infty', inner[0][0] - LABEL_GAP - 2.2, inner[0][1], 1, 0.6, DIM));
		L.push(await placed(`\\nabla^2${psi}_1 = 4\\pi G\\,${drho}`, P1.X(0.03), P1.Y(PSI1_PEAK * 0.55), 0, 0.5, INK));
		check(PSI1_ZERO > rClip && PSI1_ZERO < A, 'psi_1 crosses zero outside the drawn part');
	}

	// ---- bottom: psi_2, its axis the shared r axis
	{
		const n = 800, pts = [];
		for (let k = 0; k <= n; k++) { const r = (k / n) * 1; pts.push(P2.at(r, psi2(r))); }
		S.path(pts, { color: FIELD, width: CURVE, layer: 2, what: 'psi_2' });
		S.path([P2.at(1, 0), P2.at(TO, 0)], { color: FIELD, width: CURVE, layer: 2, cap: 'butt', what: 'psi_2 outside' });
		// near R the cubic contact is too flat to see: psi_2 again, ZOOM times higher, from where it fits the panel to R
		let lo = 0.3, hi = 1;
		for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (ZOOM * psi2(m) > PSI2_CENTRE) lo = m; else hi = m; }
		const zs = hi, zoomed = [];
		for (let k = 0; k <= 400; k++) { const r = zs + ((1 - zs) * k) / 400; zoomed.push(P2.at(r, ZOOM * psi2(r))); }
		check(near(zoomed[0][1], P2.Y(PSI2_CENTRE), 1e-6) && near(zoomed.at(-1)[1], y2, 1e-9), 'the zoomed copy');
		S.path(zoomed, { color: FIELD, width: ZOOM_W, dash: ZOOM_DASH, cap: 'butt', layer: 1.8, what: 'psi_2 zoomed' });
		L.push(await placed(`{\\times}${ZOOM}`, P2.X(zs) + LABEL_GAP + 3.5, P2.Y(PSI2_CENTRE), 0, 0, DIM));
		// the slope at the centre, -GM/4 in these units, finite: a cone point
		check(near((psi2(1e-6) - psi2(0)) / 1e-6, -0.25, 1e-5), 'psi_2\'s slope at the centre');
		L.push(...(await xAxis(S, P2, { ticks: [0, A, 1], fmt: (t) => (t === 0 ? '0' : t === 1 ? 'R' : 'R/\\sqrt2'), what: 'the r axis' })));
		L.push(await placed('r', P2.X(TO) + LABEL_GAP + 1.2, y2, 0, 0.5, INK));
		L.push(await placed(`\\nabla^2${psi}_2 = ${psi}_1`, P2.X(0.3), P2.Y(PSI2_CENTRE * 0.5), 0, 1, INK));
	}
	// the note on the heights, under the axis at the right
	const lowest = Math.max(...L.map((l) => l.box.b));
	L.push(await placed('\\text{heights: each panel on its own scale}', P2.X(TO), lowest + 3.2, 1, 0, DIM, 7));

	S.checkAll(L);
	window[name + '-numbers'] = { psi2Centre: PSI2_CENTRE, psi1Peak: PSI1_PEAK };
	return finish(S, L, [220, 330]);
}
