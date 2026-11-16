import type { Vec3 } from '../types';

/**
 * Colour stops: log10 of temperature in kelvin, then linear RGB.
 *
 * Gravitational radiation has no colour of its own, so this is a mapping we
 * choose. It follows the colours of glowing matter (deep red, orange, yellow,
 * white) up to about 10⁴ K, stretched so that Earth's layers are easy to tell
 * apart, and continues through blue-white to violet so that a 10⁷ K source
 * reads differently from a 10⁴ K one.
 */
const STOPS: [number, Vec3][] = [
	[2.0, [0.25, 0.0, 0.02]],
	[2.85, [0.75, 0.04, 0.0]],
	[3.23, [1.0, 0.16, 0.01]],
	[3.45, [1.0, 0.36, 0.03]],
	[3.65, [1.0, 0.62, 0.14]],
	[3.74, [1.0, 0.8, 0.42]],
	[4.0, [1.0, 0.95, 0.88]],
	[4.6, [0.72, 0.82, 1.0]],
	[6.0, [0.45, 0.55, 1.0]],
	[7.2, [0.62, 0.42, 1.0]]
];

/** Display colour for a source temperature: linear RGB with its peak channel at 1. */
export function temperatureColor(kelvin: number): Vec3 {
	const x = Math.log10(Math.max(kelvin, 1));
	let rgb: Vec3;
	if (x <= STOPS[0][0]) rgb = STOPS[0][1];
	else if (x >= STOPS[STOPS.length - 1][0]) rgb = STOPS[STOPS.length - 1][1];
	else {
		const i = STOPS.findIndex(([s]) => s > x);
		const [x0, a] = STOPS[i - 1];
		const [x1, b] = STOPS[i];
		const k = (x - x0) / (x1 - x0);
		rgb = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
	}
	const peak = Math.max(rgb[0], rgb[1], rgb[2]);
	return [rgb[0] / peak, rgb[1] / peak, rgb[2] / peak];
}
