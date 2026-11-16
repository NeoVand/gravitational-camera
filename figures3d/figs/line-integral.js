// Figure 12: two ways of forming a picture. A camera's line of sight passes through a closed door, a
// closed iron furnace with a hot iron block inside, and a person. In light it ends at the door. In
// gravity it runs through everything, and the pixel reports the sum along it of each body's number
// emissivity times the length of the line inside it. Exact: the line is straight, and each glowing
// stretch spans exactly where the line crosses that body's drawing. Schematic: the objects (engraved
// illustrations), the iron block's place, and the glow of each (illustrative: the hot iron brightest).
import { Panel, figure, sprite, tex, INK, DIM, RULE, ACCENT, ACCENT2 } from '../lib.js';

const TINT = { door: '#f1cfa9', iron: '#e5873a', person: '#eab489' };

export default async function () {
	const [camera, door, furnace, person] = await Promise.all(
		['camera', 'door', 'furnace', 'person'].map((n) => sprite(`/figures3d/sprites/${n}.png`))
	);
	const RH = 120, W = 504;
	const place = { camera: [30, 54], door: [134, 88], furnace: [206, 92], person: [334, 94] };   // left x, height
	const parts = [], labels = [];
	const lensRow = camera.rightmostRow();
	for (const [row, gravity] of [[0, false], [1, true]]) {
		const ground = row * RH + RH - 8;
		const lensY = ground - place.camera[1] * (1 - lensRow);
		const lensX = place.camera[0] + (place.camera[1] * camera.w) / camera.h;
		const ghost = gravity ? 0.5 : 0.22;
		parts.push(`<path d="M18,${ground}L${W - 14},${ground}" stroke="${RULE}" stroke-width="0.4"/>`);
		parts.push(camera.place(place.camera[0], ground, place.camera[1]));
		parts.push(door.place(place.door[0], ground, place.door[1], gravity ? ghost : 1));
		parts.push(furnace.place(place.furnace[0], ground, place.furnace[1], ghost));
		parts.push(person.place(place.person[0], ground, place.person[1], ghost));
		// where the line of sight crosses each body, from its drawing
		const cross = (s, [x0, h]) => {
			const width = (h * s.w) / s.h;
			const fy = 1 - (ground - lensY) / h;
			const sp = s.span(fy);
			return sp ? [x0 + sp[0] * width, x0 + sp[1] * width] : null;
		};
		const dd = cross(door, place.door), ff = cross(furnace, place.furnace), pp = cross(person, place.person);
		labels.push(tex(gravity ? '\\textit{gravity}' : '\\textit{light}', [8, row * RH + 8], 10, 'lt', gravity ? ACCENT : ACCENT2));
		if (!gravity) {
			parts.push(`<path d="M${lensX},${lensY}L${dd[0]},${lensY}" stroke="${ACCENT2}" stroke-width="1"/>`);
			parts.push(`<circle cx="${dd[0]}" cy="${lensY}" r="1.6" fill="${ACCENT2}"/>`);
			continue;
		}
		// the hot block, seen through the furnace's walls
		const fw = ff[1] - ff[0], bx0 = ff[0] + 0.3 * fw, bx1 = ff[1] - 0.3 * fw;
		parts.push(`<rect x="${bx0}" y="${lensY - 7}" width="${bx1 - bx0}" height="14" rx="1.5" fill="${TINT.iron}" stroke="${ACCENT}" stroke-width="0.5" stroke-dasharray="1.6 1.2"/>`);
		const end = pp[1] + 26;
		parts.push(`<path d="M${lensX},${lensY}L${end},${lensY}" stroke="${ACCENT}" stroke-width="0.7"/>`);
		const spans = [['door', dd[0], dd[1], 1.0], ['iron', bx0, bx1, 5.0], ['person', pp[0], pp[1], 1.6]];
		for (const [k, a, b, j] of spans) {
			const t = 1.6 + 0.55 * j;
			parts.push(`<rect x="${a}" y="${lensY - t / 2}" width="${b - a}" height="${t}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
		}
		// the pixel's value: each body's glow times its length, added
		const vals = spans.map(([k, a, b, j]) => [k, j * (b - a)]);
		const total = vals.reduce((s, [, v]) => s + v, 0);
		const unit = 62 / total, bw = 9, x0 = 384;
		let x = x0;
		vals.forEach(([k, v], i) => {
			parts.push(`<rect x="${x}" y="${ground - v * unit}" width="${bw}" height="${v * unit}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
			labels.push(tex(`\\text{${k}}`, [x + bw / 2, ground + 2], 6.5, 'ct', DIM));
			x += bw;
			labels.push(tex(i < 2 ? '+' : '=', [x + 6, ground - 10], 9, 'cc'));
			x += 12;
		});
		let base = ground;
		for (const [k, v] of vals) {
			parts.push(`<rect x="${x}" y="${base - v * unit}" width="${bw + 3}" height="${v * unit}" fill="${TINT[k]}" stroke="${ACCENT}" stroke-width="0.4"/>`);
			base -= v * unit;
		}
		labels.push(tex('N(\\hat n)', [x + (bw + 3) / 2, ground + 2], 7.5, 'ct'));
	}
	const lab = await Promise.all(labels);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}pt" height="${2 * RH + 6}pt" viewBox="0 0 ${W} ${2 * RH + 6}">${parts.join('')}${lab.join('')}</svg>`;
}
