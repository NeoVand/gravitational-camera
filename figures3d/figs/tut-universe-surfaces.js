// The tutorial, section 12.2 (tutorial/sky/universe.md), its fourth diagram: the two surfaces we see, and which spots
// they share. A half-disc slice of space with us at the centre of its straight edge; two concentric arcs, the light's
// last-scattering surface at 13.86 Gpc in the light role's colour and the gravitons' surface at 14.14 Gpc in the
// field's, the 0.28 Gpc between them drawn ten times too wide and dimensioned so. Upper left, the large spot: a soft
// round patch, 3 Gpc in radius, centred midway between the arcs so that it lies across both, its value
// cos(pi rho / 2R) at rho from its centre, drawn as a radial gradient of the rule's grey that follows that value; each
// arc is drawn heavier where it crosses the spot, the same warm patch on both. Upper right, a short wave (wavelength
// 0.187 Gpc, drawn ten times longer with the gap) running toward us, drawn as a curve, cos(2 pi (s - light) / lambda)
// at the distance s from us, about a dotted axis along its direction, its wavelength dimensioned "lambda" between two
// crests inside the light's arc. The light's arc lies on a crest and the gravitons' a wavelength and a half farther out
// in a trough: the curve's crest touches the light's arc and its trough the gravitons', each tip named ("crest",
// "trough") by a hairline leader; the light's arc is drawn heavier across the strip (1.25 Gpc either side of the axis)
// where the wave's crest lies on it, the gravitons' arc not. Each arc's weight rises with the value on it.
// Departures from the diagram's comment: the short wave is drawn ten times longer, with the gap, so that its crests
// show; the caption says so. The waves are drawn only near the two surfaces. (An earlier drawing showed both as pale
// flat bands, which read neither as a spot nor as a wave.)
// Exact: the two radii (13.86 and 13.86 + 10 x 0.28 Gpc on one scale, from tut-universe-lib.js's integral), the short
// wave's phases on the arcs (crest on the light's arc and trough on the gravitons', asserted, its tips asserted to touch
// them), its wavelength's dimension (between two crests, asserted); the spot lying across both arcs with an equal
// patch on each (asserted). Schematic: the waves' directions, the spot's size and profile, the curve's height (the
// wave's amplitude has no scale here), the half-disc.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, LIGHT, FIELD } from './tut-universe-lib.js';

const name = 'tut-universe-surfaces';
const check = checker(name);

// ---- the drawing (points, and Gpc on the page's scale) --------------------------------------------------------------
const K = 9.2;                          // points per Gpc
const STRETCH = 10;                     // the gap's exaggeration
const ARC = 0.75, HEAVY = 2.6;          // an arc's stroke, and its weight on a warm patch's crest
const SPOT = { deg: 132, r: 3 };        // the large spot: its direction from us, its radius (Gpc); centred midway between the arcs
const SPOT_STOPS = 9;                   // the spot's soft edge: its radial gradient's stops, following its value
const SHORT = { deg: 50, lambda: 0.187 * STRETCH, half: 1.25, amp: 0.62 };   // the short wave: direction, drawn wavelength, the strip's half-width and the curve's height (Gpc)
const SHORT_W = 0.6;                    // the short wave's curve
const AXIS_W = 0.4;                     // its axis, dotted
const TIP_LEAD = [13, 1.5];               // the crest's and the trough's names: their offsets from the tips (points)
const WL_OUT = 0.5;                     // the wavelength's dimension, this far (Gpc) beyond the crests
const DIM_DROP = 4.5;                   // the gap's dimension, under the straight edge
const END = 2;                          // half a dimension line's end
const caption = 'Look first at the large spot: it lies across both surfaces, so both skies show it. A wave shorter than the gap prints different patterns on the two surfaces. The gap, and the short wave with it, are drawn ten times too wide.';

export default async function () {
	const { state, light, gravitons } = await chapter(check);
	state(name, 'universe-surfaces', caption);

	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const gap = gravitons - light;
	const Rl = light * K, Rg = (light + STRETCH * gap) * K;
	check(light.toFixed(2) === '13.86' && gravitons.toFixed(2) === '14.14' && gap.toFixed(2) === '0.28', 'the surfaces');
	const C = [ORIGIN, ORIGIN + Rg / 2];
	const rad = (d) => (d * Math.PI) / 180;
	const P = (r, d) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))];
	const arcPts = (r, d0, d1) => { const n = Math.max(2, Math.ceil((r * rad(Math.abs(d1 - d0))) / 0.25)); return Array.from({ length: n + 1 }, (_, i) => P(r, d0 + ((d1 - d0) * i) / n)); };

	const outer = light + STRETCH * gap;
	const at = (deg, along, across) => [C[0] + K * (along * Math.cos(rad(deg)) - across * Math.sin(rad(deg))), C[1] - K * (along * Math.sin(rad(deg)) + across * Math.cos(rad(deg)))];

	// ---- the large spot: a soft round patch, its value cos(pi rho / 2 R) at rho from its centre (Gpc), midway between
	// the arcs, so that it lies across both; drawn as a radial gradient of the rule's grey following that value
	const spotC = (light + outer) / 2;
	const spotValue = (rho) => (rho < SPOT.r ? Math.cos((Math.PI * rho) / (2 * SPOT.r)) : 0);
	{
		const c = at(SPOT.deg, spotC, 0), id = `${name}-spot`;
		const stops = Array.from({ length: SPOT_STOPS }, (_, i) => { const f = i / (SPOT_STOPS - 1); return `<stop offset="${n2(f)}" stop-color="${RULE}" stop-opacity="${n2(spotValue(f * SPOT.r))}"/>`; }).join('');
		defs += `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(SPOT.r * K)}">${stops}</radialGradient>`;
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(SPOT.r * K)}" fill="url(#${id})"/>`, 0.5);
		S.mark(Array.from({ length: 97 }, (_, i) => [c[0] + SPOT.r * K * Math.cos((i * Math.PI) / 48), c[1] + SPOT.r * K * Math.sin((i * Math.PI) / 48)]), 0, 'the large spot');
		check(SPOT.r > STRETCH * gap / 2 + 0.5, 'the large spot does not lie across both arcs');
	}

	// ---- the short wave, running along SHORT.deg toward us: its value cos(2 pi (s - light) / lambda) at the distance s
	// from us, drawn as a curve about a dotted axis along its direction, the crests to one side; the light's arc lies
	// on a crest, the gravitons' arc in a trough
	const shortValue = (s) => Math.cos((2 * Math.PI * (s - light)) / SHORT.lambda);
	check(near(shortValue(light), 1, 1e-12), 'the light\'s arc is not on a crest of the short wave');
	check(shortValue(outer) < -0.99, `the gravitons' arc is not in a trough of the short wave: ${shortValue(outer)}`);
	check(SHORT.lambda / STRETCH < gap && 2 * SPOT.r > 10 * gap, 'the waves\' sizes against the gap');
	const [w0, w1] = [light - 2.25 * SHORT.lambda, outer + 1.25 * SHORT.lambda];
	{
		const n = 400, pts = Array.from({ length: n + 1 }, (_, i) => { const sv = w0 + ((w1 - w0) * i) / n; return at(SHORT.deg, sv, SHORT.amp * shortValue(sv)); });
		S.dots(at(SHORT.deg, w0, 0), at(SHORT.deg, w1, 0), { color: DIM, layer: 1, what: 'the short wave\'s axis' });
		S.path(pts, { color: INK, width: SHORT_W, cap: 'butt', layer: 2.6, what: 'the short wave' });
		void AXIS_W;
	}
	// its wavelength, dimensioned beyond the crests between the two crests inside the light's arc
	{
		const u = SHORT.amp + WL_OUT;
		const a = at(SHORT.deg, light - 2 * SHORT.lambda, u), b = at(SHORT.deg, light - SHORT.lambda, u);
		const e = (q, sg) => at(SHORT.deg, q, u + sg * 0.22);
		S.path([a, b], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the wavelength\'s dimension' });
		for (const q of [light - 2 * SHORT.lambda, light - SHORT.lambda]) S.path([e(q, -1), e(q, 1)], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the wavelength\'s end' });
		check(near(shortValue(light - SHORT.lambda), 1, 1e-12) && near(shortValue(light - 2 * SHORT.lambda), 1, 1e-12), 'the wavelength\'s ends are not at crests');
		const m = at(SHORT.deg, light - 1.5 * SHORT.lambda, u + 0.25);
		L.push(await S.clear('\\lambda', m[0], m[1], 0.5, 1, [-Math.sin(rad(SHORT.deg)), -Math.cos(rad(SHORT.deg))], { color: INK }));
	}

	// ---- the arcs, heavier where a wave's crest lies on them: the value at each point of the arc
	const waveOn = (r, d) => {
		// the long wave across its band; the short one along its strip; each only inside its band
		const p = [r * Math.cos(rad(d)), r * Math.sin(rad(d))];
		const along = (deg) => p[0] * Math.cos(rad(deg)) + p[1] * Math.sin(rad(deg));
		const across = (deg) => -p[0] * Math.sin(rad(deg)) + p[1] * Math.cos(rad(deg));
		let v = 0;
		const sc = at(SPOT.deg, spotC, 0), rho = Math.hypot(C[0] + p[0] - sc[0], C[1] - p[1] - sc[1]) / K;
		v = Math.max(v, spotValue(rho));
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
	// the short wave's patch: heavy on the light's arc, bare on the gravitons'; the large spot's on both, equally
	check(waveOn(Rl, SHORT.deg) > 0.99 && waveOn(Rg, SHORT.deg) === 0, 'the short wave\'s patches');
	check(waveOn(Rl, SPOT.deg) > 0.6 && near(waveOn(Rl, SPOT.deg), waveOn(Rg, SPOT.deg), 1e-9), 'the large spot\'s patches');

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
	// ---- the waves' names: the spot's beyond its outer edge; the short wave's beyond its outer end; where the short
	// wave meets each arc, "crest" and "trough", inside the light's arc and outside the gravitons'
	{
		const e = at(SPOT.deg, spotC + SPOT.r + 0.3, 0);
		L.push(await S.clear('\\text{large spot}', e[0], e[1], 1, 1, [-Math.SQRT1_2, -Math.SQRT1_2], { color: INK }));
		const f = at(SHORT.deg, w1 + 0.3, 0);
		L.push(await S.clear('\\text{short wave}', f[0], f[1], 0, 1, [Math.SQRT1_2, -Math.SQRT1_2], { color: INK }));
		// "crest" and "trough", each with a hairline leader to the tip of the curve where it touches its arc
		const tip = async (sAlong, side, dx, dy, src) => {
			const q = at(SHORT.deg, sAlong, side * SHORT.amp);
			const lb = await placed(src, q[0] + dx, q[1] + dy, dx < 0 ? 1 : 0, 0.5, INK);
			const from = [dx < 0 ? lb.box.r + LABEL_GAP + 0.3 : lb.box.l - LABEL_GAP - 0.3, q[1] + dy];
			const u = [q[0] - from[0], q[1] - from[1]], lu = Math.hypot(...u);
			S.path([from, [q[0] - (u[0] / lu) * 1.2, q[1] - (u[1] / lu) * 1.2]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: `the leader of ${src}` });
			L.push(lb);
			return q;
		};
		const qc = await tip(light, 1, -TIP_LEAD[0], -TIP_LEAD[1], '\\text{crest}');
		const qt = await tip(outer, -1, TIP_LEAD[0], TIP_LEAD[1], '\\text{trough}');
		check(Math.abs(Math.hypot(qc[0] - C[0], qc[1] - C[1]) - Rl) < 0.3 && Math.abs(Math.hypot(qt[0] - C[0], qt[1] - C[1]) - Rg) < 0.3, 'the crest and the trough do not touch their arcs');
	}

	S.checkAll(L);
	window[name + '-numbers'] = { light, gravitons, Rl, Rg };
	return finish(S, L, [290, 345], defs);
}
