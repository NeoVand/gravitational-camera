// The tutorial, section 1.8 (tutorial/newton/orbits-and-kicks.md), its second diagram: one ring of free beads carried
// round a circular orbit, drawn at four places a quarter of a turn apart. At each place the tide of the central mass
// stretches the ring along the line to the mass and squeezes it across, so its long axis points at the mass and turns
// once in each orbit, keeping pace with it. The orbit is seen face on, the ring lies in the plane of the orbit, and the
// central mass is a stone ball cut through that plane. Exact: the tide in the plane of the orbit, (GM/r^3)(delta_ij -
// 3 n_i n_j) with n the unit vector from the mass to the ring's centre, the table diag(-2, 1) along and across the
// line (section 1.4); each ring the image of its circle under 1 - eps E / (GM/r^3), with one eps for all four (the
// ellipse with semi-axes 1 + 2 eps along the line and 1 - eps across it, asserted turned to the line); the beads, the
// images of twelve equally spaced places, two on each axis; the arrows, -E xi at the beads on the axes, at one scale,
// each orange (the stretch, pointing out along the line) twice each blue (the squeeze, pointing in across it); the
// rings' centres on the orbit, equally spaced. Schematic: the rings' size against the orbit (a real ring must be far
// smaller than its distance from the mass for the table to hold), eps (exaggerated, as in section 1.4's figure), and
// the mass's size. Pictorial: the stone, a picture from an image model (design/prompts/hair-sprites.json, cut out by
// design/hair_sprites.py, as in figs/hair.js), clipped here to the exact circle.
import { Panel, v3, INK, DIM, sprite } from '../lib.js';
import { picture, circle, outline } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, AXIS } from './tut-vec-lib.js';
import { ring, eigen2, arc } from './tut-five-lib.js';

const name = 'tut-orb-ring';
const check = checker(name);

// ---- the physics ----------------------------------------------------------------------------------------------
/** The tide in the plane of the orbit, in units of GM/r^3, at the place in the direction n (a unit vector). */
export const tide = ([nx, ny]) => [[1 - 3 * nx * nx, -3 * nx * ny], [-3 * ny * nx, 1 - 3 * ny * ny]];
export const EPS = 0.25;                  // the rings' strain, exaggerated for the eye (section 1.4's figure)
export const PLACES = 4;                  // places round the orbit, a quarter of a turn apart

// ---- the drawing (points: the panel's scale is one point per unit) --------------------------------------------
const R_ORBIT = 90;                       // the orbit's radius
const R_RING = 23;                        // the undisturbed ring's radius (schematic)
const BEAD = 2.3;                         // a bead's radius
const REACH = 7.6;                        // an arrow's length per unit of |E xi| / (GM/r^3)
const R_MASS = 15;                        // the central mass (schematic)
const ORBIT_CLEAR = 2.6;                  // the orbit's line stops this far outside each ring's dashed circle
const HEAD = 3.4;                         // the orbit's arrowhead
const STONE_INK = '#3b3024';              // the stone's rim (tut-motion-earths)
const SPRITES = '/figures3d/sprites/hair/';

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const eh = v3(1, 0, 0), ev = v3(0, 1, 0);

	// ---- the table: diag(-2, 1) along and across the line, trace-free in the plane's normal too
	for (const th of [0, 0.7, 2]) {
		const n = [Math.cos(th), Math.sin(th)], T = tide(n);
		const along = n[0] * (T[0][0] * n[0] + T[0][1] * n[1]) + n[1] * (T[1][0] * n[0] + T[1][1] * n[1]);
		const t = [-n[1], n[0]];
		const across = t[0] * (T[0][0] * t[0] + T[0][1] * t[1]) + t[1] * (T[1][0] * t[0] + T[1][1] * t[1]);
		check(near(along, -2, 1e-12) && near(across, 1, 1e-12), 'the tide is not -2 along the line and 1 across it');
		check(near(T[0][0] + T[1][1] + 1, 0, 1e-12), 'the tide with its entry 1 out of the plane is not trace-free');
	}

	// ---- the central mass: the stone, cut through the plane of the orbit
	const face = await sprite(SPRITES + 'ball-face.png');
	const [mx, my] = ink.at(v3(0, 0, 0));
	P.items.push({ kind: 'raw', layer: -2, depth: 0, svg: picture('tut-orb-ring-mass', face, mx, my, R_MASS, circle(mx, my, R_MASS)) + outline(mx, my, R_MASS, 0.35, STONE_INK) });
	ink.mark([[mx, my]], R_MASS, 'the mass');

	// ---- the rings, at the places 0, 90, 180 and 270 degrees, each under the tide of its place
	const rings = [];
	for (let k = 0; k < PLACES; k++) {
		const th = (2 * Math.PI * k) / PLACES;
		const n = [Math.cos(th), Math.sin(th)];
		const c = v3(R_ORBIT * n[0], R_ORBIT * n[1], 0);
		const T = tide(n);
		const r = ring(ink, { c, eh, ev, R: R_RING, T, eps: EPS, phase: th, bead: BEAD, reach: REACH, layer: 0, what: `ring ${k}` });
		// the long axis lies along the line to the mass, the short one across it
		const [a, b] = eigen2(T);
		const stretch = a.l < b.l ? a : b;
		check(near(Math.abs(stretch.e[0] * n[0] + stretch.e[1] * n[1]), 1, 1e-12), `ring ${k}'s stretch is not along the line to the mass`);
		const far = Math.max(...r.loop.map((q) => q.distanceTo(c)));
		const near_ = Math.min(...r.loop.map((q) => q.distanceTo(c)));
		check(near(far, R_RING * (1 + 2 * EPS), 1e-9) && near(near_, R_RING * (1 - EPS), 1e-6), `ring ${k} is not 1 + 2 eps by 1 - eps`);
		const tip = r.loop.reduce((p, q) => (q.distanceTo(c) > p.distanceTo(c) ? q : p));
		const dir = tip.clone().sub(c).normalize();
		check(near(Math.abs(dir.x * n[0] + dir.y * n[1]), 1, 1e-6), `ring ${k}'s long axis does not point at the mass`);
		// the orange arrows point out along the line, the blue ones in across it, each orange twice each blue
		const orange = r.arrows.filter((x) => x.stretch), blue = r.arrows.filter((x) => !x.stretch);
		check(orange.length === 2 && blue.length === 2, `ring ${k} has not two arrows of each kind`);
		for (const o of orange) for (const bl of blue) check(near(o.L / bl.L, 2, 1e-9), `ring ${k}: an orange arrow is not twice a blue one`);
		rings.push({ th, c, r });
	}
	// the inner orange arrows stop clear of the mass
	for (const { r, c } of rings) for (const a of r.arrows.filter((x) => x.stretch)) {
		const [x, y] = a.B;
		check(Math.hypot(x - mx, y - my) > R_MASS + 6, 'an orange arrow reaches the mass');
		void c;
	}

	// ---- the orbit: arcs between the rings, each stopping ORBIT_CLEAR outside the rings' dashed circles; the turning
	// counterclockwise, shown by one head halfway along the first arc
	const gap = Math.asin((R_RING + ORBIT_CLEAR) / (2 * R_ORBIT)) * 2;      // the angle from a ring's centre to where the arc stops
	const O = v3(0, 0, 0);
	let head;
	for (let k = 0; k < PLACES; k++) {
		const a0 = rings[k].th + gap, a1 = rings[k].th + (2 * Math.PI) / PLACES - gap;
		if (k === 0) {
			const mid = (a0 + a1) / 2;
			arc(ink, O, R_ORBIT, a0, mid, { color: DIM, width: AXIS, head: HEAD, layer: -1, what: 'the orbit, with its head' });
			arc(ink, O, R_ORBIT, mid, a1, { color: DIM, width: AXIS, layer: -1, what: 'the orbit after its head' });
			head = { mid };
		} else {
			arc(ink, O, R_ORBIT, a0, a1, { color: DIM, width: AXIS, layer: -1, what: `the orbit's arc ${k}` });
		}
		// where the arc stops: ORBIT_CLEAR outside the dashed circle
		const end = v3(R_ORBIT * Math.cos(a0), R_ORBIT * Math.sin(a0), 0);
		check(near(end.distanceTo(rings[k].c), R_RING + ORBIT_CLEAR, 1e-9), `the orbit's arc ${k} does not stop clear of its ring`);
	}
	// the arc's ends clear the rings' beads and arrows (the blue arrows lie along the orbit)
	for (const { r } of rings) for (const a of r.arrows) check(Math.hypot(a.A[0] - mx, a.A[1] - my) < R_ORBIT + 1e3, 'unreachable');

	// ---- labels: the mass, and the rate of turning beside the orbit's head
	const L = [];
	L.push(await ink.label('M', [mx + R_MASS * Math.SQRT1_2, my + R_MASS * Math.SQRT1_2], [Math.SQRT1_2, Math.SQRT1_2], 2.4, INK));
	const hp = ink.at(v3(R_ORBIT * Math.cos(head.mid), R_ORBIT * Math.sin(head.mid), 0));
	L.push(await ink.label('\\Omega', hp, [Math.cos(head.mid), -Math.sin(head.mid)], 2.6, INK));

	ink.checkAll(L);
	void HAIR;
	window.tutOrbRing = { rings: rings.map(({ th, r }) => ({ th, arrows: r.arrows.map((a) => +a.L.toFixed(3)) })) };
	return finish(name, P, L, [240, 340]);
}
