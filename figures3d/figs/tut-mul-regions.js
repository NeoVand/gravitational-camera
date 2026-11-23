// The tutorial, chapter 2.3 (tutorial/outside/multipoles.md), its third diagram: where each expansion holds. Left,
// the exterior expansion: an irregular body about the origin O, inside the dashed circle of radius R about O, the
// smallest that holds it, which touches the body at its farthest point; outside that circle, the region where the
// potential is a sum of the fading harmonics Y_lm / r^(l+1), shaded and fading out. Right, the interior expansion: a
// camera at the origin, three bodies round it, and the dashed circle about the camera that reaches the nearest of
// them; inside it, the region where the potential is a sum of the growing harmonics r^l Y_lm, shaded. The two dashed
// circles are the boundaries of the regions where the chapter proves the series converge.
// Exact: each dashed circle is the one the chapter's assumption names, about the origin through the body's farthest
// point (left) and through the nearest point of the nearest body (right): its radius is the largest (smallest)
// distance from the origin to the bodies' outlines, found over the outlines sampled every quarter of a point and
// asserted to touch them without crossing. Schematic: the shapes, sizes and places of the bodies, and the fading of
// the shading outside the left circle (the region reaches to infinity). Pictorial: the stone, a picture from an image
// model (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, as in figs/hair.js), clipped here to
// each body's exact outline.
import { INK, DIM, sprite } from '../lib.js';
import { MARGIN, circle, STEEL, SPRITES } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, HAIR, LINE, n2 } from './tut-pot-lib.js';
import { STONE_INK } from './tut-orb-lib.js';

const name = 'tut-mul-regions';
const check = checker(name);
const TINT = '#eeebe5';             // a neutral tint of the page (app/src/lib/paper/drawing.ts)

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const GAP = 34;                     // between the two panels' circles' boxes
const FADE = 1.95;                  // the shading outside the left circle fades out at this many R
const DASH = [2.4, 1.8];
const CLEAR = 0.9;                  // the least air between a dash and a body's outline

/** The irregular body's outline about (cx, cy): a smooth closed curve, its radius from its own centre a sum of a few
 * harmonics of the angle, sampled every quarter of a point. */
function blob(cx, cy, a, terms, n = 1440) {
	return Array.from({ length: n }, (_, k) => {
		const t = (2 * Math.PI * k) / n;
		const r = a * (1 + terms.reduce((s, [c, m, ph]) => s + c * Math.cos(m * t + ph), 0));
		return [cx + r * Math.cos(t), cy - r * Math.sin(t)];
	});
}
/** A dashed circle about c of radius r: a whole number of dashes, the pattern stretched to close; a dash any point
 * of which `clash` finds too near a body is left out, so that the circle meets the body it touches in a gap. Returns
 * how many were left out. */
function dashedCircle(S, c, r, clash) {
	const n = Math.round((2 * Math.PI * r) / (DASH[0] + DASH[1])), step = (2 * Math.PI) / n, len = (step * DASH[0]) / (DASH[0] + DASH[1]);
	let left = 0;
	for (let k = 0; k < n; k++) {
		const seg = Array.from({ length: 9 }, (_, j) => { const t = k * step + (len * j) / 8; return [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)]; });
		if (seg.some(clash)) { left++; continue; }
		S.path(seg, { color: DIM, width: LINE * 0.9, layer: 1, cap: 'butt', what: 'a dashed circle' });
	}
	return left;
}
const pathOf = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);


/** The stone, embedded once: an <image> of unit size in the figure's defs, and each body a <use> of it, scaled and
 * clipped to the body's exact outline (as stone.js's picture(), which would embed the picture once for each body). */
const stoneDefs = (id, s) => `<defs><image id="${id}" class="art" href="${s.href}" x="0" y="0" width="1" height="1" preserveAspectRatio="none"/></defs>`;
function stoneUse(id, clip, s, cx, cy, r, shape) {
	const half = (r * s.w) / (s.w - 2 * MARGIN);
	return `<clipPath id="${clip}"><path clip-rule="evenodd" d="${shape}"/></clipPath>` +
		`<g clip-path="url(#${clip})"><use href="#${id}" transform="translate(${n2(cx - half)},${n2(cy - half)}) scale(${n2(2 * half)})"/></g>`;
}

export default async function () {
	const S = new Sheet(name);
	const face = await sprite(SPRITES + 'ball-face.png');
	const STONE = 'tut-mul-regions-stone';
	S.raw(stoneDefs(STONE, face), -5);
	const L = [];
	const yc = ORIGIN;

	// ---- left: the body, about the origin O (which lies inside it, off its centre)
	const O1 = [ORIGIN - 85, yc];
	const body = blob(O1[0] + 6, yc + 3, 27, [[0.2, 2, 0.5], [0.09, 3, 2.2], [0.04, 5, 0.4]]);
	for (let i = 0; i < body.length; i++) check(dist(body[i], body[(i + 1) % body.length]) <= 0.25, 'the body\'s outline is sampled too coarsely');
	const far = body.reduce((p, q) => (dist(q, O1) > dist(p, O1) ? q : p));
	const R = dist(far, O1);
	check(body.every((q) => dist(q, O1) <= R + 1e-12), 'the body reaches outside its circle');
	// the shading: from the circle outward, fading
	const out = FADE * R;
	S.raw(`<radialGradient id="tut-mul-regions-fade" gradientUnits="userSpaceOnUse" cx="${n2(O1[0])}" cy="${n2(O1[1])}" r="${n2(out)}">` +
		`<stop offset="${(R / out).toFixed(4)}" stop-color="${TINT}"/><stop offset="${((R + 0.45 * (out - R)) / out).toFixed(4)}" stop-color="${TINT}" stop-opacity="0.8"/><stop offset="1" stop-color="${TINT}" stop-opacity="0"/></radialGradient>` +
		`<path fill-rule="evenodd" fill="url(#tut-mul-regions-fade)" d="${circle(O1[0], O1[1], out)}${circle(O1[0], O1[1], R)}"/>`, -2);
	S.raw(stoneUse(STONE, 'tut-mul-regions-body', face, O1[0] + 6, yc + 3, 1.45 * 27, pathOf(body)) +
		`<path d="${pathOf(body)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 0);
	S.mark([...body, body[0]], 0.2, 'the body');
	const offBody = dashedCircle(S, O1, R, (q) => body.some((b) => dist(b, q) < CLEAR));
	check(offBody >= 1 && offBody <= 5, `${offBody} dashes left out where the circle touches the body`);
	// the radius R, from O to where the circle touches the body
	S.raw(`<circle cx="${n2(O1[0])}" cy="${n2(O1[1])}" r="1" fill="${STONE_INK}"/>`, 3);
	const u1 = [(far[0] - O1[0]) / R, (far[1] - O1[1]) / R];
	S.path([[O1[0] + 2.2 * u1[0], O1[1] + 2.2 * u1[1]], far], { color: STONE_INK, width: HAIR, layer: 2, cap: 'butt', what: 'the radius R' });

	// ---- right: the camera at the origin, and three bodies round it
	const O2 = [O1[0] + R * FADE + GAP + 62, yc];
	const sources = [
		{ d: 52, a: 32, r: 12 },
		{ d: 44, a: 162, r: 9 },
		{ d: 58, a: 258, r: 13 }
	].map(({ d, a, r }) => ({ c: [O2[0] + d * Math.cos((a * Math.PI) / 180), O2[1] - d * Math.sin((a * Math.PI) / 180)], r }));
	const reach = Math.min(...sources.map((s) => dist(s.c, O2) - s.r));
	const nearest = sources.find((s) => near(dist(s.c, O2) - s.r, reach, 1e-12));
	check(sources.filter((s) => dist(s.c, O2) - s.r < reach + 3).length === 1, 'two bodies are about as near the camera');
	S.raw(`<path d="${circle(O2[0], O2[1], reach)}" fill="${TINT}"/>`, -2);
	const offSource = dashedCircle(S, O2, reach, (q) => sources.some((t) => dist(t.c, q) < t.r + CLEAR));
	check(offSource >= 1 && offSource <= 5, `${offSource} dashes left out where the circle touches the nearest body`);
	sources.forEach((s, i) => {
		S.raw(stoneUse(STONE, `tut-mul-regions-src${i}`, face, s.c[0], s.c[1], s.r, circle(s.c[0], s.c[1], s.r)) +
			`<path d="${circle(s.c[0], s.c[1], s.r)}" fill="none" stroke="${STONE_INK}" stroke-width="0.35"/>`, 0);
		S.mark([s.c], s.r, `the body ${i}`);
		check(dist(s.c, O2) - s.r >= reach - 1e-12, `the body ${i} reaches inside the circle`);
	});
	S.sphere([O2[0], O2[1]], 2.6, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, 'the camera');
	// the radius, from the camera to where the circle touches the nearest body
	const u2 = [(nearest.c[0] - O2[0]) / dist(nearest.c, O2), (nearest.c[1] - O2[1]) / dist(nearest.c, O2)];
	const touch = [O2[0] + reach * u2[0], O2[1] + reach * u2[1]];
	S.path([[O2[0] + 3.6 * u2[0], O2[1] + 3.6 * u2[1]], touch], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the radius to the nearest body' });

	// ---- labels
	// the two names on one line, above both panels
	const headY = O1[1] - 1.5 * R - 6;
	L.push(await placed('\\text{exterior}', O1[0], headY, 0.5, 1, INK));
	L.push(await placed('\\text{interior}', O2[0], headY, 0.5, 1, INK));
	// on the stone, in the stone's fixed ink, as the marks on it
	L.push(await S.clear('O', O1[0] - 2.5, O1[1] + 2, 1, 0, [-0.6, 0.8], { color: STONE_INK }));
	L.push(await S.clear('R', O1[0] + 0.55 * R * u1[0], O1[1] + 0.55 * R * u1[1], 0.5, 0.5, [u1[1], -u1[0]], { color: STONE_INK }));
	L.push(await S.clear('Y_{\\ell m}/r^{\\ell+1}', O1[0], O1[1] + R + 9, 0.5, 0.5, [0, 1], { color: INK }));
	L.push(await S.clear('r^{\\ell}\\,Y_{\\ell m}', O2[0] + 2, O2[1] - 0.5 * reach, 0.5, 0.5, [0, -1], { color: INK }));
	L.push(await S.clear('\\text{camera}', O2[0], O2[1] + 5, 0.5, 0, [0, 1], { color: INK, size: 7.5 }));

	// the labels on the stone lie wholly on it; each expansion's name lies in its own region
	const inside = ([x, y], poly) => {
		let c = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			const [xi, yi] = poly[i], [xj, yj] = poly[j];
			if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
		}
		return c;
	};
	const corners = (b) => [[b.l, b.t], [b.r, b.t], [b.l, b.b], [b.r, b.b]];
	for (const l of L.filter((x) => x.src === 'O' || x.src === 'R')) check(corners(l.box).every((q) => inside(q, body)), `the label ${l.src} is not wholly on the stone`);
	const ext = L.find((x) => x.src.startsWith('Y')), int = L.find((x) => x.src.startsWith('r^'));
	check(corners(ext.box).every((q) => dist(q, O1) > R + 2 && dist(q, O1) < R + 0.7 * (out - R)), 'the exterior\'s harmonic is not in the shaded region near the circle');
	check(corners(int.box).every((q) => dist(q, O2) < reach - 2), 'the interior\'s harmonic is not inside the circle');
	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
