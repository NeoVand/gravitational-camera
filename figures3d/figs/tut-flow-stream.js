// The tutorial, section 2.8 (tutorial/outside/flows.md), its third diagram: the two kinds of steady flow round an axis,
// in a ball cut in half through its axis and seen a little from above, so that the meridian section faces the reader
// and the back half of the ball shows as a crescent above it. Left, rolls: the contours of the chapter's example
// stream function chi = 4 K varpi^2 (1 - r^2 / R^2) / R^2 at 0.35, 0.65 and 0.9 of its greatest value K, one closed roll
// in each half of the section, with arrowheads where each crosses the equator on its side nearer the axis (the matter
// rises near the axis and sinks near the surface, as the stretch problem finds). A point P at the top of the outer
// roll drawn (chi = 0.35 K), in the left half, and the circle about the axis through it, drawn in the same view: its
// front half solid, in front of the section, its back half dashed, behind it; the front half of the disc it spans
// lightly shaded. The circle meets the section again at the top of the mirrored roll. 2 pi chi(P) is the mass that
// crosses that disc each second: named left of the ball, with a leader to the shaded disc. Right, a swirl: the same section, the matter coming out of the page on one side of the
// axis (dots) and going into it on the other (crosses), for a swirl that turns anticlockwise seen from above.
// Exact: the contours, drawn from the formula and checked against it at every point, and the flux they carry (the
// stretch problem's, checked in figs/tut-flow-lib.js); P on its contour, and chi below chi(P) everywhere on the
// disc's diameter in the section between the axis and P (both asserted); the circle through P and the section's
// outline, the axis and the crescent from the view (a turn of TILT degrees about the horizontal); the sense of the
// swirl's marks for Omega along +z. Chosen for the drawing: the three levels, the contour P is on, the swirl's marks and
// the view. Pictorial: the sawn face of the steel ball (sprites/hair/ball-face.png, as in section 2.5's figures),
// clipped to the section's exact outline, and the back half lit as the paper's balls are, in the stone's mean colour.
import { Panel, v3, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, HAIR, DASH, n2 } from './tut-vec-lib.js';
import { SHADE, STONE_INK, RIM, ballFace, stoneDefs, chi, meanColour, ballGradient, checkChapter } from './tut-flow-lib.js';
import { text } from '../stone.js';

const name = 'tut-flow-stream';
const check = checker(name);

// ---- the drawing (lengths in units of R) --------------------------------------------------------------------------
const S = 52;                       // points per R
const TILT = 18;                    // the view: the section seen this far from face on, from above (degrees)
const APART = 2.62;                 // the two balls' centres apart
const LEVELS = [0.35, 0.65, 0.9];    // the contours, in units of K
const P_ON = 0.35;                  // P, in the left half: the top of the contour at this level (the outermost drawn)
const AXIS_OUT = 0.22;              // the axis beyond the ball, top and bottom
const CONTOUR = 0.6;                // the contours' stroke
const HEAD = 3.4;                   // an arrowhead on a contour: its length, points
const SWIRL = [[0.52, 0.5], [0.6, 0], [0.52, -0.5]];   // the swirl's marks, [varpi, z]
const MARK = 3.1;                   // their radius, points
const DISC = 0.2;                   // the disc's shade
const LEAD_GAP = 12;                // the flux's name ends this far left of the ball
const LEAD_RISE = -6;               // and stands this far above the point of the disc its leader reaches

/** The contour chi = c in the half-plane varpi > 0: [varpi, z] points round it, closed, anticlockwise in (varpi, z). */
function contour(c, n = 360) {
	const zmax = Math.sqrt(1 - Math.sqrt(c));
	const w = (z, s) => Math.sqrt(((1 - z * z) + s * Math.sqrt(Math.max(0, (1 - z * z) ** 2 - c))) / 2);
	const pts = [];
	// the outer branch upward, then the inner branch downward, each sampled evenly in the angle phi, z = zmax sin phi
	for (let k = 0; k <= n; k++) { const z = zmax * Math.sin(-Math.PI / 2 + (Math.PI * k) / n); pts.push([w(z, 1), z]); }
	for (let k = 1; k < n; k++) { const z = zmax * Math.sin(Math.PI / 2 - (Math.PI * k) / n); pts.push([w(z, -1), z]); }
	pts.push(pts[0]);
	return pts;
}

export default async function () {
	checkChapter(name);
	const P = new Panel({ x: ORIGIN + 50, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: 0 });   // room at the left for the flux's name
	const ink = new Sheet(P, name);
	const cos = Math.cos((TILT * Math.PI) / 180);
	const face = await ballFace();
	const tan = await meanColour(face);
	const raw = (svg, layer) => P.items.push({ kind: 'raw', layer, depth: 0, svg });
	raw(stoneDefs(`${name}-face`, face, S), -5);
	raw(ballGradient(`${name}-lit`, tan, { ambient: 0.5, key: 0.62, spec: 0.2 }), -5);

	const balls = [-1, 1].map((s) => v3((s * APART) / 2, 0, 0));
	const L = [];
	for (const [k, C] of balls.entries()) {
		// a point of the section: varpi across (signed), z up, on the face (world z = 0)
		const sec = (w, z) => C.clone().add(v3(w, z, 0));
		const [cx, cy] = ink.at(C);
		check(near(ink.at(sec(0, 1))[1], cy - S * cos, 1e-9), 'the section is not foreshortened by cos TILT');
		// ---- the back half: where it shows, between the ball's upper rim and the section's upper edge (nothing of it
		// lies below the section's lower edge: a point behind the section is seen higher on the page), lit
		const ellipse = `M${n2(cx - S)},${n2(cy)}a${S},${n2(S * cos)} 0 1,0 ${2 * S},0a${S},${n2(S * cos)} 0 1,0 ${-2 * S},0Z`;
		const disc = `M${n2(cx - S)},${n2(cy)}a${S},${S} 0 1,0 ${2 * S},0a${S},${S} 0 1,0 ${-2 * S},0Z`;
		const crescent = `M${n2(cx - S)},${n2(cy)}a${S},${S} 0 0,1 ${2 * S},0a${S},${n2(S * cos)} 0 0,0 ${-2 * S},0Z`;
		raw(`<clipPath id="${name}-back${k}"><path d="${crescent}"/></clipPath>` +
			`<path d="${disc}" fill="url(#${name}-lit)" clip-path="url(#${name}-back${k})"/>`, -4);
		// ---- the section: the sawn face, foreshortened, clipped to its exact ellipse
		raw(`<clipPath id="${name}-sec${k}"><path d="${ellipse}"/></clipPath>` +
			`<g clip-path="url(#${name}-sec${k})"><use href="#${name}-face" transform="translate(${n2(cx)},${n2(cy)}) scale(1,${cos.toFixed(5)})"/></g>`, -3);
		// the outlines: the ball's upper rim (the back half's), the section's ellipse
		const rimPts = Array.from({ length: 181 }, (_, i) => { const t = (i * Math.PI) / 180; return [cx + S * Math.cos(t), cy - S * Math.sin(t)]; });
		raw(`<path d="M${rimPts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>` +
			`<path d="${ellipse}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 5);
		ink.mark(rimPts, RIM / 2, 'the rim');
		ink.mark(Array.from({ length: 361 }, (_, i) => { const t = (i * Math.PI) / 180; return [cx + S * Math.cos(t), cy - S * cos * Math.sin(t)]; }), RIM / 2, 'the section\'s edge');

		// ---- the axis, dashed: on the stone in its ink (over the crescent, up to the ball's top on the page), beyond in the page's
		const top = 1 / cos;               // the axis's height whose image is the ball's top on the page
		ink.line(sec(0, -1), sec(0, top), { color: STONE_INK, width: HAIR, layer: 1, dash: DASH, what: 'the axis on the stone' });
		// beyond the stone, a gap of one dash's space first, so that no two dashes of the two colours run together
		const gap = DASH[1] / S / cos;
		ink.line(sec(0, top + gap), sec(0, top + AXIS_OUT), { color: DIM, width: HAIR, layer: 1, dash: DASH, what: 'the axis above' });
		ink.line(sec(0, -1 - AXIS_OUT), sec(0, -1 - gap), { color: DIM, width: HAIR, layer: 1, dash: DASH, what: 'the axis below' });

		if (k === 0) {
			// ---- rolls: the contours of chi, mirrored into the left half, with an arrowhead where each crosses z = 0 nearer the axis
			for (const c of LEVELS) {
				const pts = contour(c);
				for (const [w, z] of pts) check(near(chi(w, z), c, 1e-9), `the contour ${c} is off chi`);
				for (const side of [1, -1]) {
					ink.curve(pts.map(([w, z]) => sec(side * w, z)), { color: SHADE, width: CONTOUR, layer: 2, what: `the contour ${c}` });
					const w0 = Math.sqrt((1 - Math.sqrt(1 - c)) / 2);               // the inner crossing of z = 0
					check(near(chi(w0, 0), c, 1e-12), 'the arrowhead is not on its contour');
					const tip = ink.at(sec(side * w0, 0.5 * HEAD / S / cos)), base = ink.at(sec(side * w0, -0.5 * HEAD / S / cos));
					const hw = 0.36 * HEAD;
					P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(base[0] - hw)},${n2(base[1])}L${n2(base[0] + hw)},${n2(base[1])}Z" fill="${SHADE}"/>` });
					ink.mark([tip, [base[0] - hw, base[1]], [base[0] + hw, base[1]], tip], 0, `the arrowhead on ${c}`);
				}
			}
			// the matter rises near the axis: the flux on the inner crossing points up (J_z > 0)
			// ---- P, on the middle contour, and its circle about the axis
			// the top of the contour chi = P_ON, where it runs level: z = sqrt(1 - sqrt(c)), varpi^2 = (1 - z^2) / 2
			const P_Z = Math.sqrt(1 - Math.sqrt(P_ON)), wP = Math.sqrt((1 - P_Z * P_Z) / 2);
			check(LEVELS.includes(P_ON) && near(chi(wP, P_Z), P_ON, 1e-12), 'P is not on a drawn contour');
			for (let i = 1; i < 100; i++) check(chi((wP * i) / 100, P_Z) < P_ON, 'the disc crosses the contour through P');
			const ring = (t) => C.clone().add(v3(-wP * Math.cos(t), P_Z, wP * Math.sin(t)));   // t = 0 at P (left), t in (0, pi) in front
			const front = Array.from({ length: 181 }, (_, i) => ring((i * Math.PI) / 180));
			const back = Array.from({ length: 181 }, (_, i) => ring(Math.PI + (i * Math.PI) / 180));
			for (const p of front) check(p.z - C.z >= -1e-12, 'the front half of the circle is behind the section');
			ink.curve(front, { color: STONE_INK, width: 0.5, layer: 4, what: 'the circle, in front' });
			P.curve(back, { color: STONE_INK, width: HAIR, layer: 1.5, dash: [1.6, 1.4], cap: 'butt' });
			ink.mark(back.map((p) => ink.at(p)), HAIR / 2, 'the circle, behind');
			P.polygon(front, { fill: SHADE, opacity: DISC, layer: 3.5 });
			const pp = ink.at(sec(-wP, P_Z));
			raw(`<circle cx="${n2(pp[0])}" cy="${n2(pp[1])}" r="1.15" fill="${STONE_INK}"/>`, 6);
			ink.mark([pp], 1.15, 'P');
			L.push(await ink.label('P', pp, [-0.25, -1], 2.2, STONE_INK));
			// what crosses the disc: named left of the ball, a leader from the name to the middle of the disc's front half
			const mid = ink.at(C.clone().add(v3(-wP / 2, P_Z, wP / 2)));
			const flux = await placed('2\\pi\\chi(P)\\ \\text{through the disc}', cx - S - LEAD_GAP, mid[1] - LEAD_RISE, 1, 0.5, INK);
			const from = [flux.box.r + 2, (flux.box.t + flux.box.b) / 2];
			raw(`<path d="M${n2(from[0])},${n2(from[1])}L${n2(mid[0])},${n2(mid[1])}" stroke="${INK}" stroke-width="${HAIR}" fill="none"/>`, 6);
			raw(`<circle cx="${n2(mid[0])}" cy="${n2(mid[1])}" r="0.7" fill="${INK}"/>`, 6);
			L.push(flux);
		} else {
			// ---- a swirl about +z, anticlockwise seen from above: out of the page (toward the viewer) on the left, in on the right
			const omega = v3(0, 1, 0);
			for (const [w, z] of SWIRL) for (const side of [-1, 1]) {
				const v = omega.clone().cross(v3(side * w, z, 0));
				const out = v.z > 0;
				check(out === (side < 0), 'the swirl\'s marks have the wrong sense');
				const [x, y] = ink.at(sec(side * w, z));
				const ry = MARK * cos;
				const d = MARK * 0.62;
				raw(`<ellipse cx="${n2(x)}" cy="${n2(y)}" rx="${MARK}" ry="${n2(ry)}" fill="none" stroke="${SHADE}" stroke-width="0.55"/>` +
					(out ? `<ellipse cx="${n2(x)}" cy="${n2(y)}" rx="0.95" ry="${n2(0.95 * cos)}" fill="${SHADE}"/>`
						: `<path d="M${n2(x - d * 0.7071)},${n2(y - d * 0.7071 * cos)}L${n2(x + d * 0.7071)},${n2(y + d * 0.7071 * cos)}M${n2(x - d * 0.7071)},${n2(y + d * 0.7071 * cos)}L${n2(x + d * 0.7071)},${n2(y - d * 0.7071 * cos)}" stroke="${SHADE}" stroke-width="0.55"/>`), 3);
				ink.mark([[x, y]], MARK + 0.3, 'a mark of the swirl');
			}
		}
		// ---- the panel's name, beneath
		const low = ink.at(sec(0, -1 - AXIS_OUT));
		L.push(await ink.label(text(k ? 'a swirl' : 'rolls'), [cx, low[1]], [0, 1], 3.5, DIM));
	}

	ink.checkAll(L);
	return finish(name, P, L, [240, 380]);
}
