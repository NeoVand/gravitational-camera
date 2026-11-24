// The tutorial, chapter 12.2 (tutorial/sky/universe.md), its fourth diagram: the two surfaces we see, and which spots
// they share. A half-disc slice of space with us at the centre of its straight edge; two concentric arcs, the light's
// last-scattering surface at 13.86 Gpc in the light role's colour and the gravitons' surface at 14.14 Gpc in the
// field's, the 0.28 Gpc between them drawn ten times too wide and dimensioned so. Upper left, one crest of a long wave
// (wavelength 8 Gpc, its crest lines running toward us) as a shaded band across both arcs: each arc is drawn heavier where
// the band crosses it, the same warm patch on both. Upper right, a short wave (wavelength 0.187 Gpc, drawn ten times
// longer with the gap) running toward us, its crests shaded in a strip across both arcs: the light's arc lies on a crest,
// the gravitons' arc a wavelength and a half farther out in a trough, so only the light's arc is drawn heavier there.
// The shading of each wave is its crests, cos(2 pi s / lambda) where positive, at most 0.2 of the ink; each arc's weight
// rises with the wave's value on it.
// Departures from the diagram's comment: the short wave is drawn ten times longer, with the gap, so that its crests
// show; the caption says so. Each wave is shaded only near the two surfaces, fading in and out over a few points.
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
const SHADE = 0.2;                      // a crest's strongest shading
const LONG = { deg: 132, lambda: 8 };   // the long wave: its crest's direction from us, its wavelength (Gpc)
const SHORT = { deg: 50, lambda: 0.187 * STRETCH, half: 1.25 };   // the short wave: direction, drawn wavelength, half-width (Gpc)
const FADE = 1.6;                       // Gpc over which a wave's shading fades in and out
const REACH = [0.7, 1.4];               // a wave's shading from this times the light's radius to this times it
const DIM_DROP = 4.5;                   // the gap's dimension, under the straight edge
const END = 2;                          // half a dimension line's end
const STEPS = 64;                       // gradient stops across a band
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
	let defs = '';

	// ---- a wave's shading: a band along the direction deg (from us), across which the value is f(u) (u in Gpc, across
	// for the long wave's crest, along for the short wave's), faded in and out along its length
	const band = (key, deg, half, valueAt) => {
		const r0 = REACH[0] * Rl, r1 = REACH[1] * Rl, f = FADE * K;
		const a = P(r0, deg), b = P(r1, deg);
		const n = [Math.cos(rad(deg + 90)), -Math.sin(rad(deg + 90))];        // across the band, on the page
		const corners = [[-1, 0], [1, 0], [1, 1], [-1, 1]].map(([s, t]) => { const p = t ? b : a; return [p[0] + s * n[0] * half * K, p[1] + s * n[1] * half * K]; });
		const id = `${name}-${key}`;
		// the value: a gradient across (long) or along (short) the band
		const stops = Array.from({ length: STEPS + 1 }, (_, k) => k / STEPS);
		const across = valueAt.across;
		const [g0, g1] = across ? [[a[0] - n[0] * half * K, a[1] - n[1] * half * K], [a[0] + n[0] * half * K, a[1] + n[1] * half * K]] : [a, b];
		const grad = `<linearGradient id="${id}-v" gradientUnits="userSpaceOnUse" x1="${n2(g0[0])}" y1="${n2(g0[1])}" x2="${n2(g1[0])}" y2="${n2(g1[1])}">` +
			stops.map((t) => `<stop offset="${t.toFixed(4)}" stop-color="${INK}" stop-opacity="${(SHADE * Math.max(0, valueAt(across ? (t - 0.5) * 2 * half : (r0 + t * (r1 - r0)) / K))).toFixed(4)}"/>`).join('') + '</linearGradient>';
		// the fade along the band, as a mask
		const fade = `<linearGradient id="${id}-f" gradientUnits="userSpaceOnUse" x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(b[0])}" y2="${n2(b[1])}">` +
			[[0, 0], [f / (r1 - r0), 1], [1 - f / (r1 - r0), 1], [1, 0]].map(([o, v]) => `<stop offset="${o.toFixed(4)}" stop-color="#fff" stop-opacity="${v}"/>`).join('') + '</linearGradient>';
		const d = 'M' + corners.map((p) => `${n2(p[0])},${n2(p[1])}`).join('L') + 'Z';
		defs += grad + fade + `<mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="700" height="700"><path d="${d}" fill="url(#${id}-f)"/></mask>`;
		S.raw(`<path d="${d}" fill="url(#${id}-v)" mask="url(#${id}-m)"/>`, 0.5);
		return { a, b, n, corners };
	};

	// ---- the long wave: one crest across the band, cos(2 pi u / lambda) for |u| < lambda / 4
	const longValue = Object.assign((u) => Math.cos((2 * Math.PI * u) / LONG.lambda), { across: true });
	const longBand = band('long', LONG.deg, LONG.lambda / 4, longValue);
	// ---- the short wave: crests across the strip, cos(2 pi (s - light) / lambda), s the distance from us along it
	const shortValue = Object.assign((s) => Math.cos((2 * Math.PI * (s - light)) / SHORT.lambda), { across: false });
	const shortBand = band('short', SHORT.deg, SHORT.half, shortValue);
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
	void longBand; void shortBand;

	S.checkAll(L);
	window[name + '-numbers'] = { light, gravitons, Rl, Rg };
	return finish(S, L, [290, 345], defs);
}
