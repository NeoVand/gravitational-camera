// Figure 12: two ways of forming a picture. A camera's line of sight passes through a closed door, an iron
// furnace with a hot iron block inside, and a person. In light it ends where it meets the door's face. In
// gravity it runs on: through the door's thickness, through the furnace (cut open in the drawing to show the
// block) and through the person; where a body hides it, it is dashed. The pixel reports the sum along the line
// of each body's number emissivity times the length of the line inside it. Exact: the line is straight, at
// one height. Schematic: the objects (engraved illustrations), their sizes (chosen so that the line passes
// through the middle of each), and the glow of each (illustrative: the hot iron brightest).
import { figure, sprite, tex, INK, DIM, RULE, ACCENT, ACCENT2 } from '../lib.js';

const TINT = { door: '#f1cfa9', iron: '#e5873a', person: '#eab489' };
const LINE_FRACTION = 0.39;          // the hot block's centre, as a fraction of the furnace's height above the ground

export default async function () {
	const [camera, door, furnace, open, person] = await Promise.all(
		['camera', 'door', 'furnace', 'furnace-open', 'person'].map((n) => sprite(`/figures3d/sprites/${n}.png`))
	);
	const HF = 112, lineH = LINE_FRACTION * HF;
	const lensRow = camera.rightmostRow();
	const size = { camera: lineH / (1 - lensRow), door: 2 * lineH, furnace: HF, person: 2 * lineH };
	const left = { camera: 22, door: 116, furnace: 186, person: 336 };
	const width = (s, h) => (h * s.w) / s.h;
	const RH = 128, W = 504, parts = [], labels = [];
	// a body's extent along the line, in figure points, from its drawing
	const across = (s, k, ground, lineY) => {
		const h = size[k], fy = 1 - (ground - lineY) / h, sp = s.span(fy);
		return [left[k] + sp[0] * width(s, h), left[k] + sp[1] * width(s, h)];
	};
	const seg = (x0, x1, y, dashed, color = ACCENT, w = 0.7) =>
		`<path d="M${x0.toFixed(2)},${y.toFixed(2)}L${x1.toFixed(2)},${y.toFixed(2)}" stroke="${color}" stroke-width="${w}"${dashed ? ' stroke-dasharray="2.2 1.6"' : ''}/>`;
	for (const [row, gravity] of [[0, false], [1, true]]) {
		const ground = row * RH + RH - 8, y = ground - lineH;
		const lensX = left.camera + width(camera, size.camera);
		parts.push(`<path d="M16,${ground}L${W - 12},${ground}" stroke="${RULE}" stroke-width="0.4"/>`);
		parts.push(camera.place(left.camera, ground, size.camera));
		parts.push(door.place(left.door, ground, size.door));
		parts.push((gravity ? open : furnace).place(left.furnace, ground, size.furnace, gravity ? 1 : 0.35));
		parts.push(person.place(left.person, ground, size.person, gravity ? 1 : 0.35));
		labels.push(tex(gravity ? '\\textit{gravity}' : '\\textit{light}', [8, row * RH + 8], 10, 'lt', gravity ? ACCENT : ACCENT2));
		// the door: the line meets its face at the middle, crosses its thickness, and leaves by its far side
		const [dl, dr] = across(door, 'door', ground, y);
		const face = dr - dl, E = dl + 0.43 * face, E2 = E + 0.13 * face;
		if (!gravity) {
			parts.push(seg(lensX, E, y, false, ACCENT2, 1.0));
			parts.push(`<circle cx="${E.toFixed(2)}" cy="${y.toFixed(2)}" r="2.1" fill="${ACCENT2}" stroke="#fffffe" stroke-width="0.6"/>`);
			continue;
		}
		const [fl, fr] = across(open, 'furnace', ground, y);
		const [pl, pr] = across(person, 'person', ground, y);
		// the glowing block, where the line crosses it in the open furnace
		const fw = width(open, size.furnace), fy = 1 - (ground - y) / size.furnace;
		const shut = furnace.row(fy), lit = open.row(fy);
		let bl = Infinity, br = -Infinity;
		lit.forEach(([r, g, b, a], x) => {
			const [r2, g2, b2] = shut[x];
			if (a > 200 && r > 230 && g > 100 && b < 90 && Math.abs(r - r2) + Math.abs(g - g2) + Math.abs(b - b2) > 90) { bl = Math.min(bl, x); br = Math.max(br, x); }
		});
		const B0 = left.furnace + (bl / open.w) * fw, B1 = left.furnace + ((br + 1) / open.w) * fw;
		const opening = left.furnace + 0.245 * fw;          // the cut in the side wall ends here; beyond, the front hides the line
		parts.push(seg(lensX, E, y, false));
		parts.push(seg(E2, dr, y, true));                    // hidden behind the door
		parts.push(seg(dr, fl, y, false));
		parts.push(seg(fl, B0, y, false));                   // inside the furnace, seen through the cut
		parts.push(seg(Math.max(B1, opening), fr, y, true)); // hidden behind its front
		parts.push(seg(fr, pl, y, false));
		parts.push(seg(pr, pr + 24, y, false));
		const spans = [['door', E, E2, 1.0], ['iron', B0, B1, 5.0], ['person', pl, pr, 1.6]];
		for (const [k, a, b, j] of spans) {
			const t = 1.6 + 0.55 * j;
			parts.push(`<rect x="${a.toFixed(2)}" y="${(y - t / 2).toFixed(2)}" width="${(b - a).toFixed(2)}" height="${t}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
		}
		parts.push(`<circle cx="${E.toFixed(2)}" cy="${y.toFixed(2)}" r="2.1" fill="${ACCENT}" stroke="#fffffe" stroke-width="0.6"/>`);
		// the pixel's value: each body's glow times its length, added
		const vals = spans.map(([k, a, b, j]) => [k, j * (b - a)]);
		const total = vals.reduce((s, [, v]) => s + v, 0);
		const unit = 66 / total, bw = 9;
		let x = 384;
		vals.forEach(([k, v], i) => {
			parts.push(`<rect x="${x}" y="${(ground - v * unit).toFixed(2)}" width="${bw}" height="${(v * unit).toFixed(2)}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
			labels.push(tex(`\\text{${k}}`, [x + bw / 2, ground + 2], 6.5, 'ct', DIM));
			x += bw;
			labels.push(tex(i < 2 ? '+' : '=', [x + 6, ground - 10], 9, 'cc'));
			x += 12;
		});
		let base = ground;
		for (const [k, v] of vals) {
			parts.push(`<rect x="${x}" y="${(base - v * unit).toFixed(2)}" width="${bw + 3}" height="${(v * unit).toFixed(2)}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
			base -= v * unit;
		}
		labels.push(tex('N(\\hat n)', [x + (bw + 3) / 2, ground + 2], 7.5, 'ct'));
	}
	const lab = await Promise.all(labels);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}pt" height="${2 * RH + 6}pt" viewBox="0 0 ${W} ${2 * RH + 6}">${parts.join('')}${lab.join('')}</svg>`;
}
