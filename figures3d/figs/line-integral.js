// Figure 12: two ways of forming a picture. A camera's line of sight passes through a closed door, a closed
// iron furnace with a hot iron block inside (on a brick hearth), and a person. In light it ends where it
// meets the middle of the door's face. In gravity it runs on through everything; where a body hides it, it
// is dashed. The hot block shows through the furnace's walls, translucent. The pixel reports the sum along
// the line of each body's number emissivity times the length of the line inside it. Exact: the line is
// straight and level, leaving the centre of the lens. Schematic: the objects (engraved illustrations), the
// block's place, and the glow of each (illustrative: the hot iron brightest). The sizes keep true
// proportion between door and person; the hearth raises the furnace so that the line crosses its middle.
import { sprite, tex, DIM, RULE, ACCENT, ACCENT2 } from '../lib.js';

const TINT = { door: '#f1cfa9', iron: '#e5873a', person: '#eab489' };
const BODY_CENTRE = 0.6;           // the furnace's body (without hearth or chimney), its centre as a fraction of its height
const FACE = 0.87;                 // the door's face, as a fraction of its drawn width; the rest is its thickness

export default async function () {
	const [camera, door, furnace, person] = await Promise.all(
		['camera', 'door', 'furnace', 'person'].map((n) => sprite(`/figures3d/sprites/${n}.png`))
	);
	const HD = 84, lineH = HD / 2;
	const lens = camera.lensRow();
	const size = { camera: lineH / (1 - lens), door: HD, furnace: lineH / BODY_CENTRE, person: (1.75 / 2.1) * HD };
	const left = { camera: 8, door: 64, furnace: 120, person: 196 };
	const width = (s, h) => (h * s.w) / s.h;
	const RH = HD + 14, W = 246, SUM = 32, parts = [], labels = [];
	const across = (s, k, ground, y) => {
		const h = size[k], sp = s.span(1 - (ground - y) / h);
		return [left[k] + sp[0] * width(s, h), left[k] + sp[1] * width(s, h)];
	};
	const seg = (x0, x1, y, dashed, color = ACCENT, w = 0.75) =>
		`<path d="M${x0.toFixed(2)},${y.toFixed(2)}L${x1.toFixed(2)},${y.toFixed(2)}" stroke="${color}" stroke-width="${w}"${dashed ? ' stroke-dasharray="2.4 1.8"' : ''}/>`;
	const dot = (x, y, color) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.1" fill="${color}" stroke="#fffffe" stroke-width="0.4"/>`;
	for (const [row, gravity] of [[0, false], [1, true]]) {
		const ground = row * RH + RH - 6, y = ground - lineH;
		const [, lensX] = across(camera, 'camera', ground, y);
		parts.push(`<path d="M4,${ground}L${W - 4},${ground}" stroke="${RULE}" stroke-width="0.4"/>`);
		parts.push(camera.place(left.camera, ground, size.camera));
		parts.push(door.place(left.door, ground, size.door));
		parts.push(furnace.place(left.furnace, ground, size.furnace, gravity ? 1 : 0.35));
		parts.push(person.place(left.person, ground, size.person, gravity ? 1 : 0.35));
		labels.push(tex(gravity ? '\\textit{gravity}' : '\\textit{light}', [4, row * RH + 4], 8.5, 'lt', gravity ? ACCENT : ACCENT2));
		// the door: the line meets its face at the middle and leaves by its far side
		const [dl, dr] = across(door, 'door', ground, y);
		const E = dl + 0.5 * FACE * (dr - dl);
		if (!gravity) {
			parts.push(seg(lensX, E, y, false, ACCENT2, 1.0));
			parts.push(dot(E, y, ACCENT2));
			continue;
		}
		const [fl, fr] = across(furnace, 'furnace', ground, y);
		const [pl, pr] = across(person, 'person', ground, y);
		// the hot block, seen through the furnace's walls: translucent, outlined in dots
		const fw = fr - fl, bx = fl + 0.3 * fw, bw = 0.4 * fw, bh = 0.2 * size.furnace;
		parts.push(`<rect x="${bx.toFixed(2)}" y="${(y - bh / 2).toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="2" fill="${TINT.iron}" fill-opacity="0.55" stroke="${ACCENT}" stroke-width="0.6" stroke-dasharray="0.6 1.4" stroke-linecap="round"/>`);
		parts.push(seg(lensX, E, y, false));
		parts.push(seg(E, dr, y, true));            // through the door, and hidden behind it
		parts.push(seg(dr, fl, y, false));
		parts.push(seg(fl, fr, y, true));           // through the furnace
		parts.push(seg(fr, pl, y, false));
		parts.push(seg(pl, pr, y, true));           // through the person
		parts.push(seg(pr, Math.min(W - 6, pr + 26), y, false));
		// the pixel's value, N = door + iron + person: each body's glow times its length, as a bar beneath it
		const vals = [['door', 1.0 * (1 - FACE) * (dr - dl), (dl + dr) / 2], ['iron', 5.0 * bw, (fl + fr) / 2], ['person', 1.6 * (pr - pl), (pl + pr) / 2]];
		const vmax = Math.max(...vals.map(([, v]) => v));
		const base = 2 * RH + 8 + 22, bw0 = 10, hmax = 20;
		const [, camR] = across(camera, 'camera', ground, y);
		labels.push(tex('N(\\hat n) =', [(left.camera + camR) / 2, base - 6], 8, 'cc'));
		vals.forEach(([k, v, cx], i) => {
			const h = Math.max(0.8, (v / vmax) * hmax);
			parts.push(`<rect x="${(cx - bw0 / 2).toFixed(2)}" y="${(base - h).toFixed(2)}" width="${bw0}" height="${h.toFixed(2)}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
			labels.push(tex(`\\text{${k}}`, [cx, base + 6.5], 6.5, 'cB', DIM));     // the three on one baseline
			if (i < 2) labels.push(tex('+', [(cx + vals[i + 1][2]) / 2, base - 6], 8, 'cc'));
		});
		parts.push(`<path d="M${(left.door - 6).toFixed(2)},${base}L${(W - 6).toFixed(2)},${base}" stroke="${RULE}" stroke-width="0.4"/>`);
	}
	const lab = await Promise.all(labels);
	const Ht = 2 * RH + 8 + SUM;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}pt" height="${Ht}pt" viewBox="0 0 ${W} ${Ht}">${parts.join('')}${lab.join('')}</svg>`;
}
