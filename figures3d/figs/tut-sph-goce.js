// The tutorial, section 2.2 (tutorial/outside/spherical-harmonics.md), its fourth diagram: how fine degree 280 is.
// The Earth cut through a great circle, with the pattern of degree 280 along that circle drawn as a ripple of its
// rim, cos(280 alpha), 280 crests round it; GOCE's orbit, 254 km up, as a dashed circle; and an enlarged inset of the
// short arc at the top, inside the small window drawn there: the ground with the ripple, one wavelength between two
// crests, 143 km, and GOCE on its orbit 254 km above the ground, both to one scale.
// Exact: the Earth's radius, 6371 km, and the orbit's, 6371 + 254 km, to one scale (asserted in points); the 280
// crests (counted on the drawn rim); the wavelength 2 pi 6371 / 280 = 142.96 km, printed 143 km, and the height,
// 254 km, 1.8 times it, drawn to the inset's one scale (asserted in points, the wavelength as the chord between two
// crests, which is shorter than the arc by a part in 10^5); the inset is the window enlarged MAG times, every point
// of it the window's point (asserted at its corners), with the Earth's curvature and the orbit's. Schematic: the
// ripple's height, chosen for each view (its true height is not a length: the pattern is one of gravity), and the
// size of the satellite. Pictorial: the stone, a picture from an image model (design/prompts/hair-sprites.json, cut
// out by design/hair_sprites.py, as in the paper's figure on gravitational hair, figs/hair.js), clipped here to the
// rippled rim and to the inset's ground. The book's layout: the same drawing with the Earth's radius 88 points, not
// 110, and the inset 410 points wide, not 246, so that the two lines from the window fan out to an inset that spans the
// text; the inset's scale, K, is the same, so it shows more crests, each to the same scale.
import { INK, DIM, FAINT, sprite } from '../lib.js';
import { picture, STEEL } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, HAIR, TICK, n2 } from './tut-pot-lib.js';

const name = 'tut-sph-goce';
const check = checker(name);

// ---- the physics: the chapter's numbers ----------------------------------------------------------------------
export const EARTH = 6371;               // km
export const HEIGHT = 254;               // km, GOCE's height
export const DEGREE = 280;
export const WAVE = (2 * Math.PI * EARTH) / DEGREE;   // km, between crests

// ---- the drawing (points) -------------------------------------------------------------------------------------
// the printed book (figureLayout 'book') draws a smaller Earth under a wider inset, to fill the text's width at a
// height that is not shrunk; the site keeps the Earth as wide as the inset
const BOOK = globalThis.figureLayout === 'book';
const A = BOOK ? 88 : 110;               // points per Earth radius
const SM = A / EARTH;                    // points per km, the Earth
const K = 0.25;                          // points per km, the inset
const MAG = K / SM;                      // the inset's enlargement
const IW = BOOK ? 410 : 246, IH = 106;   // the inset, points: a little wider than the orbit (the site), or the text (the book)
const GROUND = 20;                       // the ground's mean level above the inset's bottom, points
const AMP_MAIN = 0.7, AMP_INSET = 3.2;   // the ripple's height in each view, points (schematic)
const RIM = 0.4;                         // the rippled rim's stroke
const ORBIT_DASH = [1.6, 1.4];
const BEAD = 2.6;                        // GOCE, a steel bead, radius in points
const FRAME = 0.4;                       // the inset's frame, the window and the lines joining them
const SPRITES = '/figures3d/sprites/hair/';

/** A piece w by h points cut from the middle of a sprite (its exact circle's inside), at the sprite's own pixels, as
 * a PNG: the stone without its rim. */
async function middle(s, w, h) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const k = (0.62 * img.width) / w;                              // the sprite's pixels per point in the piece
	const c = document.createElement('canvas');
	c.width = Math.round(w * 4); c.height = Math.round(h * 4);
	c.getContext('2d').drawImage(img, (img.width - w * k) / 2, (img.height - h * k) / 2, w * k, h * k, 0, 0, c.width, c.height);
	return c.toDataURL('image/png');
}

export default async function () {
	// ---- the chapter's numbers
	check(Math.round(WAVE) === 143 && near(WAVE, 142.96, 0.005), `the wavelength is ${WAVE} km, not 143`);
	check(Math.round((Math.PI * EARTH) / DEGREE) === 71, 'the features of degree 280 are not 71 km wide');
	check((HEIGHT / WAVE).toFixed(1) === '1.8', 'the height is not 1.8 wavelengths');
	check(near((DEGREE * HEIGHT) / EARTH, 11.2, 0.05) && Math.exp(-(DEGREE * HEIGHT) / EARTH).toExponential(1) === '1.4e-5', 'kz is not 11.2');
	check(Math.round((2 * Math.PI * EARTH) / 300) === 133, 'the wavelength of degree 300 is not 133 km');

	const S = new Sheet(name);
	const C = [ORIGIN - 50, ORIGIN + 70];                         // the Earth's centre on the provisional page
	// a point at the angle a from the top, clockwise, and r km from the centre, on the Earth's view
	const main = (a, r) => [C[0] + SM * r * Math.sin(a), C[1] - SM * r * Math.cos(a)];
	const rim = (a, amp) => EARTH + (amp / SM) * Math.cos(DEGREE * a);   // km: the ripple, amp points high in the view

	// ---- the inset: the window at the top of the Earth, enlarged MAG times, centred above the Earth and as wide as
	// the orbit; the mean ground GROUND points above its bottom
	const hc = (IH / 2 - GROUND) / K;                             // km: the window's centre above the ground
	const Wc = main(0, EARTH + hc);
	const I = { l: C[0] - IW / 2, b: C[1] - A - 24 };             // the inset's lower left corner
	I.r = I.l + IW; I.t = I.b - IH;
	const Ic = [(I.l + I.r) / 2, (I.t + I.b) / 2];
	const enlarge = (p) => [Ic[0] + MAG * (p[0] - Wc[0]), Ic[1] + MAG * (p[1] - Wc[1])];
	const win = { l: Wc[0] - IW / 2 / MAG, r: Wc[0] + IW / 2 / MAG, t: Wc[1] - IH / 2 / MAG, b: Wc[1] + IH / 2 / MAG };
	for (const [x, y] of [[win.l, win.t], [win.r, win.b]]) {
		const q = enlarge([x, y]);
		check(near(q[0], x === win.l ? I.l : I.r, 1e-9) && near(q[1], y === win.t ? I.t : I.b, 1e-9), 'the inset is not the window enlarged');
	}
	const inset = (a, r) => enlarge(main(a, r));

	// ---- the Earth: the stone clipped to the rippled rim, the rim drawn, its crests counted
	const N = 20 * DEGREE;                                         // samples round the rim: twenty to a crest
	const ring = Array.from({ length: N }, (_, i) => main((2 * Math.PI * i) / N, rim((2 * Math.PI * i) / N, AMP_MAIN)));
	const radius = ring.map(([x, y]) => Math.hypot(x - C[0], y - C[1]));
	let crests = 0;
	for (let i = 0; i < N; i++) if (radius[i] > radius[(i + N - 1) % N] && radius[i] >= radius[(i + 1) % N]) crests++;
	check(crests === DEGREE, `the rim has ${crests} crests, not ${DEGREE}`);
	for (let i = 0; i < N; i++) check(Math.hypot(ring[i][0] - ring[(i + 1) % N][0], ring[i][1] - ring[(i + 1) % N][1]) <= 0.25, 'the rim is sampled too coarsely');
	const d = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const face = await sprite(SPRITES + 'ball-face.png');
	S.raw(picture(`${name}-earth`, face, C[0], C[1], A + AMP_MAIN, d(ring)), 0);
	S.path(ring, { color: INK, width: RIM, layer: 1, closed: true, what: 'the rim' });

	// ---- the orbit, dashed, to scale
	const RO = (EARTH + HEIGHT) * SM;
	check(near(RO / A, (EARTH + HEIGHT) / EARTH, 1e-12), 'the orbit is not to scale');
	const M = Math.ceil((2 * Math.PI * RO) / 0.25);
	const orbit = Array.from({ length: M }, (_, i) => main((2 * Math.PI * i) / M, EARTH + HEIGHT));
	S.raw(`<path d="${d(orbit)}" fill="none" stroke="${DIM}" stroke-width="${HAIR}" stroke-dasharray="${ORBIT_DASH.join(' ')}"/>`, 1);
	S.mark([...orbit, orbit[0]], HAIR / 2, 'the orbit');

	// ---- the window, and the lines that join it to the inset
	const box = (b) => [[b.l, b.t], [b.r, b.t], [b.r, b.b], [b.l, b.b]];
	S.path(box(win), { color: FAINT, width: FRAME, layer: 3, closed: true, cap: 'butt', what: 'the window' });
	S.path([[win.l, win.t], [I.l, I.b]], { color: FAINT, width: FRAME, layer: 3, cap: 'butt', what: 'a line to the inset' });
	S.path([[win.r, win.t], [I.r, I.b]], { color: FAINT, width: FRAME, layer: 3, cap: 'butt', what: 'a line to the inset' });
	// the two lines pass clear of the orbit
	for (const [a, b] of [[[win.l, win.t], [I.l, I.b]], [[win.r, win.t], [I.r, I.b]]]) for (let t = 0.05; t <= 1; t += 0.01) {
		const q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
		check(Math.hypot(q[0] - C[0], q[1] - C[1]) > (EARTH + HEIGHT) * SM + 1, 'a line to the inset crosses the orbit');
	}
	check(Math.hypot(win.r - C[0], win.b - C[1]) < A, 'the window does not reach the ground');

	// ---- the inset: ground, ripple, orbit and GOCE, clipped to the frame
	const half = (IW / 2 + 4) / MAG / A;                          // the angle the inset spans either side, and a little
	const steps = Math.ceil((2 * half * A * MAG) / 0.2);
	const ground = Array.from({ length: steps + 1 }, (_, i) => { const a = -half + (2 * half * i) / steps; return inset(a, rim(a, AMP_INSET / MAG)); });
	const clipId = `${name}-inset`;
	const frame = d(box(I));
	const below = d([...ground, [ground[ground.length - 1][0], I.b + 40], [ground[0][0], I.b + 40]]);
	// the stone below the ground: a piece cut from the middle of the same picture, at about the Earth's grain, clipped to
	// the frame and the ground
	const piece = await middle(face, IW, GROUND + 2 * AMP_INSET + 2);
	S.raw(`<clipPath id="${clipId}"><path d="${frame}"/></clipPath><clipPath id="${clipId}-ground"><path d="${below}"/></clipPath>` +
		`<g clip-path="url(#${clipId})"><image class="art" href="${piece}" x="${n2(I.l)}" y="${n2(I.b - GROUND - 2 * AMP_INSET - 2)}" width="${IW}" height="${n2(GROUND + 2 * AMP_INSET + 2)}" preserveAspectRatio="none" clip-path="url(#${clipId}-ground)"/></g>`, 0);
	const inside = (pts) => pts.filter(([x, y]) => x >= I.l - 1e-9 && x <= I.r + 1e-9 && y >= I.t && y <= I.b);
	S.raw(`<g clip-path="url(#${clipId})"><path d="M${ground.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${INK}" stroke-width="${RIM + 0.15}"/></g>`, 1);
	S.mark(inside(ground), (RIM + 0.15) / 2, 'the ground');
	const orbitIn = Array.from({ length: steps + 1 }, (_, i) => inset(-half + (2 * half * i) / steps, EARTH + HEIGHT));
	S.raw(`<g clip-path="url(#${clipId})"><path d="M${orbitIn.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${DIM}" stroke-width="${HAIR + 0.1}" stroke-dasharray="${ORBIT_DASH.map((v) => v * 1.6).join(' ')}"/></g>`, 1);
	S.mark(inside(orbitIn), (HAIR + 0.1) / 2, 'the orbit in the inset');
	S.path(box(I), { color: FAINT, width: FRAME, layer: 3, closed: true, cap: 'butt', what: 'the inset\'s frame' });

	// ---- one wavelength: between the crest at the top and the one before it, a dimension line above them
	// the crests' places on the mean ground, and their tops
	const crest0 = inset(-(2 * Math.PI) / DEGREE, EARTH), crest1 = inset(0, EARTH);
	const top0 = inset(-(2 * Math.PI) / DEGREE, rim(-(2 * Math.PI) / DEGREE, AMP_INSET / MAG)), top1 = inset(0, rim(0, AMP_INSET / MAG));
	const lam = Math.hypot(crest1[0] - crest0[0], crest1[1] - crest0[1]);
	check(near(lam, WAVE * K, WAVE * K * 1e-4), `the wavelength is drawn ${lam} pt, not ${WAVE * K}`);
	const L = [];
	const yDim = Math.min(top0[1], top1[1]) - 7;
	S.path([[crest0[0], yDim], [crest1[0], yDim]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the wavelength' });
	for (const x of [crest0[0], crest1[0]]) S.path([[x, yDim - TICK], [x, yDim + TICK]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the wavelength\'s end' });
	L.push(await placed('143\\,\\mathrm{km}', (crest0[0] + crest1[0]) / 2, yDim - 2.6, 0.5, 1, INK));

	// ---- GOCE, above the node of the ripple just after the crest at the top, and its height down to the ground there
	const aG = Math.PI / (2 * DEGREE);
	check(near(Math.cos(DEGREE * aG), 0, 1e-12), 'GOCE is not above a node of the ripple');
	const foot = inset(aG, EARTH), sat = inset(aG, EARTH + HEIGHT);
	const h = Math.hypot(sat[0] - foot[0], sat[1] - foot[1]);
	check(near(h, HEIGHT * K, 1e-9), `the height is drawn ${h} pt, not ${HEIGHT * K}`);
	check(near(h / lam, HEIGHT / WAVE, 1e-4), 'the height and the wavelength are not to one scale');
	S.path([foot, [sat[0], sat[1] + BEAD]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the height' });
	const ux = [(sat[1] - foot[1]) / -h, (sat[0] - foot[0]) / h];      // along the ground, at right angles to the height
	S.path([[foot[0] - ux[0] * TICK, foot[1] - ux[1] * TICK], [foot[0] + ux[0] * TICK, foot[1] + ux[1] * TICK]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the height\'s foot' });
	S.sphere(sat, BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 4 }, 'GOCE');
	L.push(await placed('254\\,\\mathrm{km}', foot[0] + 3.4, (foot[1] + sat[1]) / 2, 0, 0.5, INK));
	L.push(await placed('\\text{GOCE}', sat[0] + BEAD + 2.6, sat[1] + BEAD + 1.8, 0, 0, INK));

	// ---- the degree, beside the Earth at the lower right
	L.push(await placed('\\ell = 280', C[0] + 0.98 * A, C[1] + 0.98 * A, 1, 1, INK));

	S.checkAll(L);
	window.tutSphGoce = { WAVE, MAG, lam, h, crests };
	return finish(S, L, BOOK ? [400, 450] : [240, 340]);
}
