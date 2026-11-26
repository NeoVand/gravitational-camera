// The tutorial, section 9.3 (tutorial/one-point/the-matrix-w.md), its first diagram: a pixel at rest and a pixel moving
// at 0.6c read the same three eigenvalues. Two panels side by side, the same room seen from above: the two stone masses
// of the paper's fig:stars, faint, and the pixel at the origin. Left, "pixel at rest": a ring of twelve free stone balls
// deformed by the tide Re W of the room, orange arrows for its stretch and blue for its squeeze, and at its centre one
// small grey gyroscope, still. Right, "pixel moving at 0.6c" (an arrow in the observer's colour): the ring deformed by
// Re(Lambda W Lambda^T), more strongly, and two small gyroscopes that turn relative to one another by
// Im(Lambda W Lambda^T), thin curved ink arrows. Under each panel the size |E|^2 + |B|^2 of the reading, the three
// eigenvalues in the curvature's colour, and I and J. Orange and blue only for the stretch and the squeeze.
// Departures from the diagram's comment: the two gyroscopes stand side by side, along x, not one above the other: by
// section 7.5's eq:gyro-pair, delta Omega = B xi / c, and for this reading a pair separated up the page (along y)
// turns relative to one another almost only about x, a turn that tilts the axles out of the page and that a view from
// above cannot show ((B y)_z / |B y| = 0.06), while a pair along x turns mostly about the axis out of the page
// ((B x)_z / |B x| = 0.88, asserted above 0.85), which turns the axles in the page; the panels stay side by side at
// every width, one drawing about 300 points wide, so that a phone shows the same figure; each panel names its
// |E|^2 + |B|^2 above the eigenvalues (0.468 and 2.27, the comment's "more strongly"); I and J are set in the page's
// dim ink at the size of every label, not smaller, so that they stay readable on a phone; the observer's arrow is the
// heading's shadow on the floor (0.30, 0.80), named v.
// Exact: the masses' places (fig:stars's, seen from above: x across, y up the page); every bead at
// (1 - EPS T) xi for T the 2 x 2 block (x, y) of Re W (left) or Re(Lambda W Lambda^T) (right), the shadow of the
// three-dimensional drift of a ring lying in the floor's plane; the arrows -T xi at the beads on T's eigen-axes, one
// scale in both panels, orange out (a negative eigenvalue) and blue in; the senses of the curved arrows, from
// (B x)_z with B = Im(Lambda W Lambda^T) (the right one clockwise); the printed numbers (figs/tut-matrix-w-lib.js,
// asserted against the chapter). Schematic: the sizes of the masses, the ring, the balls and the gyroscopes (the ring
// is far larger than the room's scale would make it); exaggerated: EPS, the arrows' scale and the turning's sweep.
// Pictorial: the stone, the picture of the published tutorial figures (sprites/hair/ball-face.png) lit as a sphere by
// the studio of lib.js, as in tut-one-point-hero.js.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { INK, DIM, FAINT, sprite } from '../lib.js';
import { MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { UNDISTURBED, UNDISTURBED_W, eigen2 } from './tut-five-lib.js';
import { turning } from './tut-flow-lib.js';
import { palette, OBS, CURV, ACCENT, ACCENT2 } from './tut-gravitomag-lib.js';
import { chapter, PAIR, U_HAT, BETA } from './tut-matrix-w-lib.js';

const name = 'tut-same-eigenvalues';
const check = checker(name);

// ---- the room and the ring, points ------------------------------------------------------------------------------------
const K = 50;                              // points per unit of the room
const MASS_R = 11.5;                       // the larger mass's radius; the smaller's by the cube root of the masses' ratio
const FAINT_STONE = 0.6;                   // the masses' opacity
const R = 23;                              // the ring's undisturbed radius
const EPS = 0.3;                           // the tide's exaggeration, per unit of the figure's tide
const BEAD = 1.7;                          // a ball's radius
const REACH = 28;                          // an arrow's length per unit of |T xi|
const RING_W = 0.4;                        // the ring's outline (tut-one-point-hero)
const PUSH = 0.55, PUSH_HEAD = 3, TAIL = 0.9;   // the ring's arrows (tut-one-point-hero)
// ---- the gyroscopes (section 7.5's, tut-magnetic-crossing, a little smaller) ------------------------------------------
const AXLE = 7.5, AXLE_W = 0.6, DISC = [5.4, 1.7], DISC_LINE = 0.4;
const GX = 12;                             // the moving pixel's gyroscopes, left and right of the centre
const TURN_R = AXLE + 2.8, TURN_SWEEP = 80, TURN_W = 0.5, TURN_HEAD = 3.2;
// ---- the layout ---------------------------------------------------------------------------------------------------------
const GAP = 14;                            // between the two panels' ink
const V_FROM = [-44, 31], V_LEN = 21;      // the observer's arrow: its tail from the pixel, its length
const TITLE_UP = 10;                       // a panel's title: its ink's foot this far above the larger mass's top
const UNDER = 9;                           // from the lowest mark of the panels to the first line under them
const SKIP = 2.6;                          // between the lines under a panel, ink to ink

const rgbDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit3 = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const KEY = unit3([-0.55, 0.72, 0.62]), FILL = unit3([0.85, -0.15, 0.5]), HALF = unit3([KEY[0], KEY[1], KEY[2] + 1]);

export default async function () {
	const nums = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	let defs = '';

	// ---- the stone, lit as a sphere (tut-one-point-hero's litBall)
	const face = await sprite('/figures3d/sprites/hair/ball-face.png');
	defs += `<image id="${name}-bead" class="art" href="${await litBall(face, 120)}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	defs += `<image id="${name}-mass" class="art" href="${await litBall(face, 360)}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	let clip = 0;
	const stone = ([X, Y], r, id, layer, what, opacity = 1) => {
		const c = `${name}-c${clip++}`;
		defs += `<clipPath id="${c}"><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(r)}"/></clipPath>`;
		S.raw(`<g${opacity < 1 ? ` opacity="${opacity}"` : ''}><g clip-path="url(#${c})"><use href="#${name}-${id}" transform="translate(${n2(X)},${n2(Y)}) scale(${n2(r)})"/></g><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(r)}" fill="none" stroke="${STONE_INK}" stroke-width="${id === 'mass' ? 0.4 : 0.25}"/></g>`, layer);
		S.mark([[X, Y]], r, what);
	};

	// ---- the two readings: the 2 x 2 blocks (x, y) of their real parts, and the moving one's magnetic part
	const block = (W) => [[W[0][0][0], W[0][1][0]], [W[1][0][0], W[1][1][0]]];
	const panels = [
		{ key: 'rest', T: block(nums.room), title: '\\text{pixel at rest}', size: nums.sizes[0].toFixed(3) },
		{ key: 'moving', T: block(nums.moving), title: '\\text{pixel moving at }0.6c', size: nums.sizes[1].toFixed(2) }
	];
	const B = nums.moving.map((r) => r.map((z) => z[1]));
	const Bx = [B[0][0], B[1][0], B[2][0]], By = [B[0][1], B[1][1], B[2][1]];
	check(Math.abs(Bx[2]) / Math.hypot(...Bx) > 0.85 && Math.abs(By[2]) / Math.hypot(...By) < 0.1, `the pair's turn: B x = ${Bx}, B y = ${By}`);
	// delta Omega = B xi / c (section 7.5's eq:gyro-pair): the right gyroscope relative to the left one turns about z by
	// (B x)_z; relative to the pixel each turns by half of it, the right one with its sign, the left one against it
	const rightSense = Math.sign(Bx[2]);
	check(rightSense < 0, 'the right gyroscope does not turn clockwise');
	check(nums.room.every((r) => r.every((z) => z[1] === 0)), 'the room at rest has a magnetic part');

	// the panels' horizontal reach from their pixel, so that they can be set side by side GAP apart
	const massR = [MASS_R, MASS_R * Math.cbrt(PAIR.masses[1] / PAIR.masses[0])];
	const place = (p) => [K * p[0], -K * p[1]];
	const reachL = Math.min(...PAIR.places.map((p, a) => place(p)[0] - massR[a]));
	const reachR = Math.max(...PAIR.places.map((p, a) => place(p)[0] + massR[a]));
	const y0 = ORIGIN;
	const xs = [ORIGIN - (reachR - reachL + GAP) / 2 - reachR, 0];
	xs[1] = xs[0] + reachR + GAP - reachL;

	const drawn = [];
	let lowest = -Infinity;
	for (const [k, p] of panels.entries()) {
		const what = `panel ${p.key}`;
		const O = [xs[k], y0];
		const at = ([x, y]) => [O[0] + x, O[1] - y];               // ring coordinates (points, y up) to the page

		// ---- the room: the two masses, faint
		PAIR.places.forEach((q, a) => stone([O[0] + place(q)[0], O[1] + place(q)[1]], massR[a], 'mass', 1, `${what}'s mass ${a}`, FAINT_STONE));

		// ---- the ring: the dashed undisturbed circle, the outline, twelve balls, the arrows on the eigen-axes
		const T = p.T;
		check(near(T[0][1], T[1][0], 1e-14), `${what}: the block is not symmetric`);
		const axes = eigen2(T);
		for (const { l } of axes) check(1 - EPS * l > 0.6, `${what}: the ring folds`);
		const image = ([x, y]) => [x - EPS * (T[0][0] * x + T[0][1] * y), y - EPS * (T[1][0] * x + T[1][1] * y)];
		const phase = Math.atan2(axes[0].e[1], axes[0].e[0]);
		{
			const total = 2 * Math.PI * R, [on, off] = UNDISTURBED, m = Math.round(total / (on + off)), period = total / m;
			S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${R}" fill="none" stroke="${DIM}" stroke-width="${UNDISTURBED_W}" stroke-dasharray="${((on * period) / (on + off)).toFixed(3)} ${((off * period) / (on + off)).toFixed(3)}"/>`, 2);
			S.mark(Array.from({ length: 361 }, (_, i) => at([R * Math.cos((i * Math.PI) / 180), R * Math.sin((i * Math.PI) / 180)])), UNDISTURBED_W / 2, `${what}'s dashed circle`);
		}
		const outline = Array.from({ length: 721 }, (_, i) => at(image([R * Math.cos((i * Math.PI) / 360), R * Math.sin((i * Math.PI) / 360)])));
		S.path(outline, { color: INK, width: RING_W, layer: 3, what: `${what}'s ring` });
		let arrows = 0;
		for (let j = 0; j < 12; j++) {
			const t = phase + (j * Math.PI) / 6, xi = [Math.cos(t), Math.sin(t)];
			const q = image([R * xi[0], R * xi[1]]);
			stone(at(q), BEAD, 'bead', 4, `${what}'s ball ${j}`);
			const on = axes.find(({ e }) => near(Math.abs(e[0] * xi[0] + e[1] * xi[1]), 1, 1e-9));
			if (!on) continue;
			const push = [-(T[0][0] * xi[0] + T[0][1] * xi[1]), -(T[1][0] * xi[0] + T[1][1] * xi[1])];
			check(near(push[0], -on.l * xi[0], 1e-12) && near(push[1], -on.l * xi[1], 1e-12), `${what}: ball ${j} is not on an eigen-axis`);
			const stretch = on.l < 0;
			const u = [Math.sign(-on.l) * xi[0], Math.sign(-on.l) * xi[1]];
			const a0 = [q[0] + u[0] * (BEAD + TAIL), q[1] + u[1] * (BEAD + TAIL)];
			const a1 = [a0[0] + u[0] * REACH * Math.abs(on.l), a0[1] + u[1] * REACH * Math.abs(on.l)];
			const A = S.arrow(at(a0), at(a1), { color: stretch ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 5, what: `${what}'s ${stretch ? 'stretch' : 'squeeze'} at ball ${j}` });
			check(near(A.L, REACH * Math.abs(on.l), 1e-9), `${what}: an arrow is not at the common scale`);
			drawn.push({ panel: p.key, stretch, l: on.l, L: A.L });
			arrows++;
		}
		check(arrows === 4, `${what}: the ring does not carry four arrows`);
		check(axes[0].l > 0 && axes[1].l < 0, `${what}: not one stretch and one squeeze in the floor`);

		// ---- the gyroscopes: one, still, at the centre of the pixel at rest; two, side by side along x, turning
		// relative to one another, at the moving pixel's
		const gyro = (gx, sense) => {
			const [X, Y] = at([gx, 0]), gw = `${what}'s gyroscope at ${gx}`;
			const ell = (a, b) => `M${n2(X - a)},${n2(Y)}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;
			S.path([[X, Y], [X, Y + AXLE]], { color: INK, width: AXLE_W, layer: 3.5, what: `${gw}'s axle, below` });
			S.raw(`<path d="${ell(DISC[0], DISC[1])}" fill="${FAINT}" stroke="${INK}" stroke-width="${DISC_LINE}"/>`, 3.6);
			S.mark(Array.from({ length: 181 }, (_, i) => [X + DISC[0] * Math.cos((i * Math.PI) / 90), Y + DISC[1] * Math.sin((i * Math.PI) / 90)]), DISC_LINE / 2, `${gw}'s disc`);
			S.boxes.push({ box: { l: X - DISC[0], r: X + DISC[0], t: Y - DISC[1], b: Y + DISC[1] }, what: `${gw}'s disc` });
			S.path([[X, Y - DISC[1]], [X, Y - AXLE]], { color: INK, width: AXLE_W, layer: 3.7, what: `${gw}'s axle, above` });
			if (!sense) return;
			const mid = Math.PI / 2, half = (TURN_SWEEP * Math.PI) / 360;
			const t = turning(X, Y, TURN_R, mid - sense * half, mid + sense * half, INK, { width: TURN_W, head: TURN_HEAD });
			S.raw(t.svg, 5);
			S.mark(t.pts, TURN_W / 2, `${gw}'s turn`);
			S.mark(t.head, 0, `${gw}'s turn's head`);
			check(t.hd <= 0.4 * t.len + 1e-9, `${gw}: the curved arrow's head is longer than two fifths of it`);
		};
		if (p.key === 'rest') gyro(0, 0);
		else { gyro(-GX, -rightSense); gyro(GX, rightSense); }

		// ---- the title, centred over the panel, above the higher mass
		const top = Math.min(...PAIR.places.map((q, a) => O[1] + place(q)[1] - massR[a]));
		const title = await placed(p.title, O[0] + (reachL + reachR) / 2, top - TITLE_UP, 0.5, 1, INK);
		L.push(title);

		// ---- the observer's arrow: the heading's shadow on the floor
		if (p.key === 'moving') {
			const d = [U_HAT[0], U_HAT[1]], dl = Math.hypot(...d);
			const a0 = at(V_FROM), a1 = at([V_FROM[0] + (V_LEN * d[0]) / dl, V_FROM[1] + (V_LEN * d[1]) / dl]);
			const va = S.arrow(a0, a1, { color: OBS, width: VEC, head: VEC_HEAD, layer: 5, what: 'the velocity' });
			check(near(va.u[0], d[0] / dl, 1e-12) && near(va.u[1], -d[1] / dl, 1e-12), 'the velocity is not the heading\'s shadow');
			L.push(await S.clear('\\boldsymbol v', a0[0] - LABEL_GAP - 0.4, (a0[1] + a1[1]) / 2 + 3, 1, 0.5, [-1, 0], { color: OBS }));
		}
		lowest = Math.max(lowest, ...S.marks.filter((m) => m.what.startsWith(what) || m.what === 'the velocity').flatMap((m) => m.pts.map((q) => q[1] + m.r)));
		p.centre = O[0] + (reachL + reachR) / 2;
	}
	// the stretch is drawn stronger for the moving pixel
	const longest = (key) => Math.max(...drawn.filter((d) => d.panel === key && d.stretch).map((d) => d.L));
	check(longest('moving') > 1.5 * longest('rest'), 'the moving pixel\'s stretch is not drawn stronger');

	// ---- under each panel: the reading's size, the eigenvalues, I and J
	const w = nums.wRoom.map((z) => z[0].toFixed(3).replace('-', '{-}'));
	const wm = nums.wMoving.map((z) => z[0].toFixed(3).replace('-', '{-}'));
	check(w.join() === wm.join(), 'the two panels would print different eigenvalues');
	const I = nums.iRoom.I[0].toFixed(3), J = nums.iRoom.J[0].toFixed(4).replace('-', '{-}');
	for (const p of panels) {
		const lines = [
			[`|\\mathcal E|^2 + |\\mathcal B|^2 = ${p.size}`, INK],
			[`w = ${(p.key === 'rest' ? w : wm).join(',\\ ')}`, CURV],
			[`I = ${I},\\ J = ${J}`, DIM]
		];
		let t = lowest + UNDER;
		for (const [src, color] of lines) { const q = await placed(src, p.centre, t, 0.5, 0, color); L.push(q); t = q.box.b + SKIP; }
	}
	check(panels[0].size === '0.468' && panels[1].size === '2.27', `the sizes ${panels.map((p) => p.size)}`);

	S.checkAll(L);
	window[name + '-numbers'] = { sizes: nums.sizes, w: nums.wRoom, I: nums.iRoom, drawn, Bx, By, beta: BETA };
	return finish(S, L, [280, 340], defs);
}

/** A stone ball lit by the studio (tut-one-point-hero's litBall, itself tut-lorentz-hero's): the picture `face` (its
 * exact circle inside MARGIN pixels of canvas) as the albedo, seen face on; a JPEG of N pixels across. */
async function litBall(face, N) {
	const img = new Image(); img.src = face.href; await img.decode();
	const src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = N; c.height = N;
	const ctx = c.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const s = 0.97;
		const tx = Math.round(cx + s * r0 * x), ty = Math.round(cy - s * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (rgbDot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, rgbDot(n, FILL));
		const spec = 0.18 * Math.max(0, rgbDot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/jpeg', 0.9);
}
