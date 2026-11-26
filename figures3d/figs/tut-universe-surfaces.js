// The tutorial, section 12.2 (tutorial/sky/universe.md), its fourth diagram: the two surfaces we see, and which spots
// they share. A half-disc slice of space with us at the centre of its straight edge; two concentric arcs, the light's
// last-scattering surface at 13.86 Gpc in the light role's colour and the gravitons' surface at 14.14 Gpc in the
// field's, the 0.28 Gpc between them drawn ten times too wide and dimensioned so. Upper left, one crest of a long wave
// (wavelength 8 Gpc, its crest lines running toward us) as a band across both arcs, the region where the wave is
// positive: each arc is drawn heavier where the band crosses it, the same warm patch on both. Upper right, a short wave
// (wavelength 0.187 Gpc, drawn ten times longer with the gap) running toward us, its crests as bands across a strip: the
// light's arc lies on a crest, the gravitons' arc a wavelength and a half farther out in a trough, so only the light's
// arc is drawn heavier there. The crests are crisp bands in the page's neutral tint, from 0.7 to 1.4 times the light's
// radius (the short wave's whole crests only); each arc's weight rises with the wave's value, cos(2 pi s / lambda), on it.
// Departures from the diagram's comment: the short wave is drawn ten times longer, with the gap, so that its crests
// show; the caption says so. The waves are drawn only near the two surfaces, and their crests flat and crisp-edged
// rather than graded, so that they read as bands and not as smudges.
// Exact: the two radii (13.86 and 13.86 + 10 x 0.28 Gpc on one scale, from tut-universe-lib.js's integral), the waves'
// phases on the arcs (crest on the light's arc and trough on the gravitons' for the short wave; the patches where the
// long wave's crest crosses each arc). Schematic: the waves' directions, the long wave's wavelength, the half-disc.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, LIGHT, FIELD } from './tut-universe-lib.js';

const name = 'tut-universe-surfaces';
const check = checker(name);

// ---- the drawing (points, and Gpc on the page's scale) --------------------------------------------------------------
const K = 9.2;                          // points per Gpc
const STRETCH = 10;                     // the gap's exaggeration
const ARC = 0.75, HEAVY = 2.6;          // an arc's stroke, and its weight on a warm patch's crest
const TINT = '#eeebe5';                 // a crest's tint: the page's neutral tint (drawing.ts)
const LONG = { deg: 132, lambda: 8 };   // the long wave: its crest's direction from us, its wavelength (Gpc)
const SHORT = { deg: 50, lambda: 0.187 * STRETCH, half: 1.25 };   // the short wave: direction, drawn wavelength, half-width (Gpc)
const REACH = [0.7, 1.4];               // a wave's crests from this times the light's radius to this times it
const DIM_DROP = 4.5;                   // the gap's dimension, under the straight edge
const END = 2;                          // half a dimension line's end
const caption = 'Look first at the large spot: it lies across both surfaces, so both skies show it. A wave shorter than the gap prints different patterns on the two surfaces. The gap, and the short wave with it, are drawn ten times too wide.';

export default async function () {
	const { state, light, gravitons } = await chapter(check);
	state(name, 'universe-surfaces', caption);

	const S = new Sheet(name);
	const L = [];
	const gap = gravitons - light;
	const Rl = light * K, Rg = (light + STRETCH * gap) * K;
	check(light.toFixed(2) === '13.86' && gravitons.toFixed(2) === '14.14' && gap.toFixed(2) === '0.28', 'the surfaces');
	const C = [ORIGIN, ORIGIN + Rg / 2];
	const rad = (d) => (d * Math.PI) / 180;
	const P = (r, d) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))];
	const arcPts = (r, d0, d1) => { const n = Math.max(2, Math.ceil((r * rad(Math.abs(d1 - d0))) / 0.25)); return Array.from({ length: n + 1 }, (_, i) => P(r, d0 + ((d1 - d0) * i) / n)); };

	// ---- a wave's crests: crisp bands in the page's neutral tint, each a rectangle along the direction deg (from us),
	// from s0 to s1 (Gpc from us) along it and `half` (Gpc) to each side of it
	const crest = (deg, s0, s1, half, what) => {
		const n = [Math.cos(rad(deg + 90)), -Math.sin(rad(deg + 90))];        // across the band, on the page
		const a = P(s0 * K, deg), b = P(s1 * K, deg);
		const corners = [[-1, a], [1, a], [1, b], [-1, b]].map(([sg, p]) => [p[0] + sg * n[0] * half * K, p[1] + sg * n[1] * half * K]);
		S.raw(`<path d="M${corners.map((p) => `${n2(p[0])},${n2(p[1])}`).join('L')}Z" fill="${TINT}"/>`, 0.5);
		S.mark([...corners, corners[0]], 0, what);
		return corners;
	};
	const [s0, s1] = [REACH[0] * light, REACH[1] * light];

	// ---- the long wave: one crest across its band, where cos(2 pi u / lambda) > 0, |u| < lambda / 4
	const longValue = (u) => Math.cos((2 * Math.PI * u) / LONG.lambda);
	crest(LONG.deg, s0, s1, LONG.lambda / 4, 'the long wave\'s crest');
	// ---- the short wave: its crests across the strip, where cos(2 pi (s - light) / lambda) > 0, s the distance from
	// us along it; only the whole crests between s0 and s1
	const shortValue = (s) => Math.cos((2 * Math.PI * (s - light)) / SHORT.lambda);
	const crests = [];
	for (let k = -20; k <= 20; k++) {
		const [c0, c1] = [light + (k - 0.25) * SHORT.lambda, light + (k + 0.25) * SHORT.lambda];
		if (c0 >= s0 && c1 <= s1) { crests.push([c0, c1]); crest(SHORT.deg, c0, c1, SHORT.half, `the short wave's crest ${k}`); }
	}
	check(crests.length >= 4 && crests.every(([c0, c1]) => shortValue(c0) < 1e-9 && shortValue(c1) < 1e-9 && shortValue((c0 + c1) / 2) > 1 - 1e-9), 'the short wave\'s crests');
	check(near(shortValue(light), 1, 1e-12), 'the light\'s arc is not on a crest of the short wave');
	const outer = light + STRETCH * gap;
	check(shortValue(outer) < -0.99, `the gravitons' arc is not in a trough of the short wave: ${shortValue(outer)}`);
	check(SHORT.lambda / STRETCH < gap && LONG.lambda > 10 * gap, 'the waves\' lengths against the gap');

	// ---- the arcs, heavier where a wave's crest lies on them: the value at each point of the arc
	const waveOn = (r, d) => {
		// the long wave across its band; the short one along its strip; each only inside its band
		const p = [r * Math.cos(rad(d)), r * Math.sin(rad(d))];
		const along = (deg) => p[0] * Math.cos(rad(deg)) + p[1] * Math.sin(rad(deg));
		const across = (deg) => -p[0] * Math.sin(rad(deg)) + p[1] * Math.cos(rad(deg));
		let v = 0;
		const ul = across(LONG.deg) / K;
		if (Math.abs(ul) < LONG.lambda / 4) v = Math.max(v, longValue(ul));
		const us = across(SHORT.deg) / K;
		if (Math.abs(us) < SHORT.half) v = Math.max(v, shortValue(along(SHORT.deg) / K));
		return v;
	};
	const arc = (r, color, what) => {
		S.path(arcPts(r, 0, 180), { color, width: ARC, cap: 'butt', layer: 2, what });
		// the heavier patch: a filled ribbon about the arc, its half-width ARC/2 + (HEAVY - ARC)/2 times the value
		const n = Math.ceil((r * Math.PI) / 0.2);
		const out = [], inn = [];
		let any = false;
		for (let i = 0; i <= n; i++) {
			const d = (180 * i) / n, w = ((HEAVY - ARC) / 2) * Math.max(0, waveOn(r, d));
			if (w > 0) any = true;
			out.push(P(r + ARC / 2 + w, d)); inn.push(P(r - ARC / 2 - w, d));
		}
		check(any, `${what}: no warm patch`);
		const pts = [...out, ...inn.reverse()];
		S.raw(`<path d="M${pts.map((p) => `${n2(p[0])},${n2(p[1])}`).join('L')}Z" fill="${color}"/>`, 2);
		S.mark(arcPts(r, 0, 180), HEAVY / 2, what + '\'s patches');
	};
	arc(Rl, LIGHT, 'the light\'s surface');
	arc(Rg, FIELD, 'the gravitons\' surface');
	// the short wave's patch: heavy on the light's arc, bare on the gravitons'; the long wave's on both
	check(waveOn(Rl, SHORT.deg) > 0.99 && waveOn(Rg, SHORT.deg) === 0, 'the short wave\'s patches');
	check(waveOn(Rl, LONG.deg) > 0.99 && waveOn(Rg, LONG.deg) > 0.99, 'the long wave\'s patches');

	// ---- the straight edge and us
	S.path([P(Rg + 4, 180), P(Rg + 4, 0)], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the straight edge' });
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="1.5" fill="${INK}"/>`, 3);
	S.mark([C], 1.5, 'us');
	L.push(await placed('\\text{us}', C[0], C[1] + 1.5 + LABEL_GAP + 0.4, 0.5, 0, INK));

	// ---- the gap's dimension, under the straight edge at the right, and the arcs' names above and below the top
	{
		const y = C[1] + DIM_DROP;
		const a = [C[0] + Rl, y], b = [C[0] + Rg, y];
		S.path([a, b], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the gap\'s dimension' });
		for (const q of [a, b]) S.path([[q[0], q[1] - END], [q[0], q[1] + END]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the dimension\'s end' });
		L.push(await placed('0.28\\,\\mathrm{Gpc}\\text{, drawn }{\\times}10', (a[0] + b[0]) / 2, y + END + LABEL_GAP + 0.2, 0.5, 0, DIM));
		const top = P(Rg + HEAVY / 2, 90), low = P(Rl - HEAVY / 2, 90);
		L.push(await placed(`\\text{gravitons' surface, }${gravitons.toFixed(2)}\\,\\mathrm{Gpc}`, top[0], top[1] - LABEL_GAP - 0.6, 0.5, 1, FIELD));
		L.push(await S.clear(`\\text{light's surface, }${light.toFixed(2)}\\,\\mathrm{Gpc}`, low[0], low[1] + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: LIGHT }));
	}
	// ---- the waves' names, beyond the bands' outer ends
	{
		const e = P(REACH[1] * Rl + 2, LONG.deg);
		L.push(await S.clear('\\text{large spot}', e[0], e[1], 1, 1, [-Math.SQRT1_2, -Math.SQRT1_2], { color: INK }));
		const f = P(REACH[1] * Rl + 2, SHORT.deg);
		L.push(await S.clear('\\text{short wave}', f[0], f[1], 0, 1, [Math.SQRT1_2, -Math.SQRT1_2], { color: INK }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { light, gravitons, Rl, Rg };
	return finish(S, L, [290, 345]);
}
