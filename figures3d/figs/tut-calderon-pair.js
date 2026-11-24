// The tutorial, chapter 13.2 (tutorial/what-a-field-keeps/calderon.md), its first diagram: Calderón's pair. One plane
// containing xi and eta, eta to the right and xi up: a body's disc of radius R, drawn faint. Above and below it, across
// exactly the disc's width, the two real growths |h_+| = e^{eta.x/2} and |h_-| = e^{-eta.x/2} as two grey ramps of
// shading that rise in opposite directions along eta, each from e^{-|xi|R/2} to e^{|xi|R/2} across the disc, on one
// log scale (the shade linear in the logarithm), with |xi| R = 6 for the drawing. Across the disc, the crests of
// cos xi.x as thin lines at right angles to xi, 2 pi/|xi| = 1.047 R apart exactly, the middle one named "cos xi.x = 1"
// and the spacing marked. Inset at the lower right: xi and eta from one point, at right angles, of equal length,
// labelled, and zeta_+- = (i xi +- eta)/2 named beside them. No label is on a ramp.
// Departures from the diagram's comment: the ramps are drawn as two bands above and below the disc, each exactly as
// wide as the disc, rather than behind it, so that both can be seen at once and the crests do not run along the seam
// between them; faint dotted lines tie their ends to the disc's edges. The radius R is marked.
// Exact: the ramps (their shade linear in log|h|, with the ends' values), the crests' spacing for |xi| R = 6, the right
// angle and equal lengths of xi and eta, the directions (h_+ grows along eta). Schematic: |xi| R = 6 and the body's
// size, chosen for the drawing (the caption says so); the depth of the shading.
import { Sheet, ORIGIN, finish, checker, placed, beside, n2, LABEL_GAP, VEC, VEC_HEAD, HAIR, RIGHT } from './tut-pot-lib.js';
import { TINT } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, XI_R, CREST, logH, near } from './tut-calderon-lib.js';

const name = 'tut-calderon-pair';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const R = 46;                          // points per R
const REACH = 1.22;                    // the crests run from -REACH R to REACH R
const BAND = [1.34, 1.64];             // a ramp's band, in R from the centre
const SHADE = [0.035, 0.5];            // the ink's opacity at log|h| = -|xi|R/2 and +|xi|R/2
const STOPS = 2;                       // the shade is linear in log|h|, which is linear along eta: two stops are exact
const CREST_W = 0.5;                   // a crest
const RIM = 0.45;                      // the disc's outline
const INSET = 0.5;                     // the inset's vectors, in R
const caption = 'Look first at the two grey ramps: one harmonic exponential grows along $\\vect\\eta$ and the other along $-\\vect\\eta$, so their product has no growth at all. What is left is the ripple whose crests cross the disc, at right angles to $\\vect\\xi$. The size of the body and the length of $\\vect\\xi$ are chosen for the drawing.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'calderon-pair', caption);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const C = [ORIGIN - 20, ORIGIN];
	const P = (s, t) => [C[0] + s * R, C[1] - t * R];         // s along eta, t along xi, in R

	// ---- the disc, faint
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${R}" fill="${TINT}" stroke="${FAINT}" stroke-width="${RIM}"/>`, 0.5);
	S.mark(Array.from({ length: 181 }, (_, k) => P(Math.cos((k * Math.PI) / 90), Math.sin((k * Math.PI) / 90))), RIM / 2, 'the disc');

	// ---- the crests of cos xi.x: xi.x = 2 pi n, at t = n CREST
	const crests = [-1, 0, 1].map((n) => n * CREST);
	check(near(crests[2] - crests[1], (2 * Math.PI) / XI_R, 1e-15), 'the crests\' spacing');
	check(crests[2] > 1 && crests[2] < BAND[0] - 0.2, 'the outer crests are not between the disc and the bands');
	for (const t of crests) S.path([P(-REACH, t), P(REACH, t)], { color: INK, width: CREST_W, cap: 'butt', layer: 2, what: `the crest at ${t}` });
	L.push(await placed('\\cos\\boldsymbol\\xi\\cdot\\mathbf x = 1', P(REACH, 0)[0] + LABEL_GAP + 0.6, C[1], 0, 0.5));
	// the spacing, marked on the left between the middle crest and the one above it
	{
		const x = P(-REACH, 0)[0] - 4.2;
		const top = P(0, crests[2])[1], bot = C[1];
		S.path([[x, top + CREST_W / 2], [x, bot - CREST_W / 2]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the spacing' });
		for (const y of [top, bot]) S.path([[x - 2.2, y], [x + 2.2, y]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the spacing\'s end' });
		L.push(await placed('2\\pi/|\\boldsymbol\\xi|', x - 2.2 - LABEL_GAP - 0.4, (top + bot) / 2, 1, 0.5, DIM));
	}
	// the radius, down and to the right
	{
		const a = (-38 * Math.PI) / 180, e = P(Math.cos(a), Math.sin(a));
		S.path([C, e], { color: DIM, width: HAIR, cap: 'butt', layer: 1.5, what: 'the radius' });
		// beside its middle, on the side away from the centre's lower left: a quarter turn of its page direction
		const u = [Math.cos(a), -Math.sin(a)];
		L.push(await beside('R', [(C[0] + e[0]) / 2, (C[1] + e[1]) / 2], [u[1], -u[0]], LABEL_GAP + 0.3, DIM));
	}

	// ---- the two ramps: bands across the disc's width, the shade linear in log|h| on one scale
	const shade = (lg) => SHADE[0] + ((SHADE[1] - SHADE[0]) * (lg + XI_R / 2)) / XI_R;
	for (const [sign, band, key] of [[1, [BAND[0], BAND[1]], 'plus'], [-1, [-BAND[1], -BAND[0]], 'minus']]) {
		const id = `${name}-${key}`;
		const stops = Array.from({ length: STOPS }, (_, k) => k / (STOPS - 1));
		defs += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n2(P(-1, 0)[0])}" y1="0" x2="${n2(P(1, 0)[0])}" y2="0">` +
			stops.map((f) => `<stop offset="${f}" stop-color="${INK}" stop-opacity="${shade(logH(sign, -1 + 2 * f)).toFixed(4)}"/>`).join('') + '</linearGradient>';
		const [a, b] = [P(-1, band[1]), P(1, band[0])];
		S.raw(`<rect x="${n2(a[0])}" y="${n2(a[1])}" width="${n2(b[0] - a[0])}" height="${n2(b[1] - a[1])}" fill="url(#${id})" stroke="${FAINT}" stroke-width="${HAIR * 0.75}"/>`, 1);
		S.boxes.push({ box: { l: a[0] - 0.15, r: b[0] + 0.15, t: a[1] - 0.15, b: b[1] + 0.15 }, what: `the ramp ${key}` });
		// the ends' values, outside the band: the low end where log|h| = -|xi|R/2
		const mid = (a[1] + b[1]) / 2;
		const lo = '\\vphantom{e^{|\\boldsymbol\\xi|R/2}}e^{-|\\boldsymbol\\xi|R/2}', hi = '\\vphantom{e^{-|\\boldsymbol\\xi|R/2}}e^{|\\boldsymbol\\xi|R/2}';
		L.push(await placed(sign > 0 ? lo : hi, a[0] - LABEL_GAP - 0.6, mid, 1, 0.5, DIM));
		L.push(await placed(sign > 0 ? hi : lo, b[0] + LABEL_GAP + 0.6, mid, 0, 0.5, DIM));
		// the name, above the upper band and below the lower one
		const src = sign > 0 ? '|h_+| = e^{\\boldsymbol\\eta\\cdot\\mathbf x/2}' : '|h_-| = e^{-\\boldsymbol\\eta\\cdot\\mathbf x/2}';
		L.push(await placed(src, C[0], sign > 0 ? a[1] - LABEL_GAP - 0.8 : b[1] + LABEL_GAP + 0.8, 0.5, sign > 0 ? 1 : 0));
		// the shade at the ends is the log scale's, and the two ramps are mirror images
		check(near(shade(logH(sign, sign)), SHADE[1]) && near(shade(logH(sign, -sign)), SHADE[0]), 'a ramp\'s ends');
	}
	check(near(shade(logH(1, 0.3)) + shade(logH(-1, 0.3)), SHADE[0] + SHADE[1], 1e-12), 'the two ramps do not add to a constant');
	// faint dotted lines tie the bands' ends to the disc's edges
	for (const s of [-1, 1]) for (const [t0, t1] of [[BAND[0], 0], [-BAND[0], 0]]) {
		S.dots(P(s, t0), P(s, t1), { color: FAINT, clear0: 1.6, clear1: 2.2, layer: 0.8, what: `the edge ${s} ${t0}` });
	}

	// ---- the inset: xi and eta from one point, at right angles, equal, and zeta_+- named
	{
		const O = P(REACH + 0.42, -0.86);
		const xi = [O[0], O[1] - INSET * R], eta = [O[0] + INSET * R, O[1]];
		check(near(Math.hypot(xi[0] - O[0], xi[1] - O[1]), Math.hypot(eta[0] - O[0], eta[1] - O[1])), 'xi and eta are not equal');
		S.arrow(O, xi, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'xi' });
		S.arrow(O, eta, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'eta' });
		S.path([[O[0], O[1] - RIGHT], [O[0] + RIGHT, O[1] - RIGHT], [O[0] + RIGHT, O[1]]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the right angle' });
		L.push(await placed('\\boldsymbol\\xi', xi[0] - 0.36 * VEC_HEAD - LABEL_GAP - 0.6, xi[1] + 3.2, 1, 0.5));
		L.push(await placed('\\boldsymbol\\eta', eta[0] - 3.2, eta[1] + 0.36 * VEC_HEAD + LABEL_GAP + 0.6, 0.5, 0));
		L.push(await placed('\\boldsymbol\\zeta_\\pm = \\tfrac12\\,(i\\boldsymbol\\xi \\pm \\boldsymbol\\eta)', O[0] + RIGHT + 4.5, O[1] - INSET * R * 0.55, 0, 0.5));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { crest: CREST, ends: [Math.exp(-XI_R / 2), Math.exp(XI_R / 2)] };
	return finish(S, L, [220, 360], defs);
}
