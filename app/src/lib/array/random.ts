/**
 * Seeded noise for the array's exposures. The same seed gives the same draws on every machine, so an exposure can
 * be shown again and the unit tests can pin what it gives. This is not numpy's generator: the reference's draws
 * (numpy.random.default_rng) are not reproduced, only their statistics.
 */

/** mulberry32: a 32-bit generator with a period of 2^32, as a function returning numbers in [0, 1). */
export function uniform(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** `count` independent standard normal numbers from a seed, by the Box-Muller transform. */
export function normals(seed: number, count: number): Float64Array {
	const next = uniform(seed);
	const out = new Float64Array(count);
	for (let i = 0; i < count; i += 2) {
		// 1 - u is in (0, 1], so the logarithm is finite
		const r = Math.sqrt(-2 * Math.log(1 - next()));
		const t = 2 * Math.PI * next();
		out[i] = r * Math.cos(t);
		if (i + 1 < count) out[i + 1] = r * Math.sin(t);
	}
	return out;
}
