/**
 * The "Tidal field" view of the vista demos (vistas/field.ts): the Galaxy's table against the Python reference, and
 * the tide about a black hole.
 */
import { describe, expect, it } from 'vitest';
import { G } from '../engine/physics/constants';
import { GALAXY_TIDE, SUN_MASS, holeTide } from '../pixel/tide-demos';
import { principal } from '../pixel/tide';
import { coneOnPicture, rayThrough, type FieldCamera } from '../pixel/field-view';
import { R_SUN, Z_SUN, galaxyCylindrical, galaxyField, holeField, holeHollow } from './field';
import { GALAXY_TABLE } from './galaxy-table';

const KPC = 3.085677581491367e19;

// The same integral as the table's (galaxy-table.ts), from the reference's galaxy.stellar_density, on a finer grid
// (14-point Gauss-Legendre panels in latitude, longitude and distance): [E_RR, E_phiphi, E_zz, E_Rz] in s^-2 at
// four of the grid's points, [R, z] in kpc.
const FINER: [number, number, number[]][] = [
	[
		8.2,
		0.02,
		[-7.82393171255778e-31, 4.797293762616411e-31, 3.538036361257256e-30, -2.680802372987882e-32]
	],
	[
		0.2,
		0.05,
		[6.87865542561639e-29, 9.472598567655785e-29, 1.96910232218421e-28, -1.2099340263263673e-29]
	],
	[3.0, 0.0, [-5.371045965788067e-30, 4.827262377244412e-30, 2.793370421651793e-29, 0]],
	[
		1.0,
		2.0,
		[3.9579599792501084e-30, 5.79247603581412e-30, -8.759404640998951e-30, -5.026784554009881e-30]
	],
	[
		20.0,
		12.0,
		[-2.1214486815945053e-32, 1.948486091495898e-32, 1.7296264545706175e-33, -2.755410170369712e-32]
	]
];

/** The reference's model (galaxy.py), ported here only to check the table: solar masses per kpc^3. */
function stellarDensity(x: number, y: number, z: number): number {
	const R = Math.hypot(x, y);
	const disc = (mass: number, length: number, height: number) =>
		(mass / (2 * Math.PI * length ** 2) / (2 * height)) *
		Math.exp(-R / length - Math.abs(z) / height);
	const bulge = (1.5e10 / (8 * Math.PI * 0.6 * 0.5 ** 3)) * Math.exp(-Math.hypot(R, z / 0.6) / 0.5);
	return disc(3.5e10, 2.6, 0.3) + disc(0.6e10, 2.0, 0.9) + bulge;
}

/** Gauss-Legendre nodes and weights on each of the panels between `edges`. */
function panels(edges: number[], n: number): { x: number[]; w: number[] } {
	const nodes: number[] = [];
	const weights: number[] = [];
	for (let i = 1; i <= n; i++) {
		let t = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		let dp = 1;
		for (let it = 0; it < 50; it++) {
			let p0 = 1;
			let p1 = t;
			for (let k = 2; k <= n; k++) [p0, p1] = [p1, ((2 * k - 1) * t * p1 - (k - 1) * p0) / k];
			dp = (n * (t * p1 - p0)) / (t * t - 1);
			t -= p1 / dp;
		}
		nodes.push(t);
		weights.push(2 / ((1 - t * t) * dp * dp));
	}
	const x: number[] = [];
	const w: number[] = [];
	for (let k = 0; k + 1 < edges.length; k++) {
		const [a, b] = [edges[k], edges[k + 1]];
		nodes.forEach((t, i) => {
			x.push(0.5 * (b - a) * t + 0.5 * (a + b));
			w.push(0.5 * (b - a) * weights[i]);
		});
	}
	return { x, w };
}

/** The pull toward the Galaxy's axis at (R, z), in G M_sun / kpc^2: the column of stars summed over the sky. */
function pullInward(R: number, z: number): number {
	const lat = panels([0, 0.002, 0.006, 0.02, 0.05, 0.12, 0.3, 0.7, Math.PI / 2], 8);
	const lon = panels([0, 0.002, 0.006, 0.02, 0.05, 0.12, 0.3, 0.7, 1.2, 2, Math.PI], 8);
	const D = Math.hypot(R, z);
	const reach = [0, 0.02, 0.05, 0.1, 0.2, 0.4, 0.8, 1.5, 3, 5, 7, 9, 11, 14, 20, 30, 45, 70, 120]
		.concat([0.9 * D, 0.97 * D, D, 1.03 * D, 1.1 * D])
		.sort((p, q) => p - q);
	let g = 0;
	for (const sign of [-1, 1])
		lat.x.forEach((b0, i) => {
			const b = sign * b0;
			lon.x.forEach((l, j) => {
				const n = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
				// the plane of the disc, where the density has a corner, gets a panel edge of its own
				const cross = n[2] < 0 && z > 0 ? -z / n[2] : Infinity;
				const edges = cross < 120 ? [...reach, cross].sort((p, q) => p - q) : reach;
				const along = panels(edges, 8);
				let column = 0;
				along.x.forEach((s, k) => {
					column += along.w[k] * stellarDensity(-R + s * n[0], s * n[1], z + s * n[2]);
				});
				g += 2 * lat.w[i] * Math.cos(b) * lon.w[j] * n[0] * column;
			});
		});
	return g;
}

describe('the Galaxy’s tidal field, on its grid', () => {
	it('the table is the reference’s integral: a finer grid changes it by parts in a million', () => {
		for (const [R, z, want] of FINER) {
			const got = galaxyCylindrical(R, z);
			const top = Math.max(...want.map(Math.abs));
			got.forEach((v, k) => expect(Math.abs(v - want[k])).toBeLessThan(1e-5 * top));
		}
		expect(GALAXY_TABLE.E).toHaveLength(GALAXY_TABLE.R.length);
		expect(GALAXY_TABLE.E.every((row) => row.length === GALAXY_TABLE.z.length)).toBe(true);
	});

	it('everywhere on the grid its trace is 4 pi G times the density of stars', () => {
		GALAXY_TABLE.R.forEach((R, i) =>
			GALAXY_TABLE.z.forEach((z, j) => {
				const [rr, pp, zz] = GALAXY_TABLE.E[i][j];
				const rho = (stellarDensity(R, 0, z) * SUN_MASS) / KPC ** 3;
				const top = Math.max(Math.abs(rr), Math.abs(pp), Math.abs(zz));
				expect(Math.abs(rr + pp + zz - 4 * Math.PI * G * rho)).toBeLessThan(2e-5 * top);
			})
		);
	});

	it('around the axis it is the pull toward the axis over the distance, g / R', () => {
		for (const [R, z] of [
			[3, 0.5],
			[13, 2]
		]) {
			const want = (G * SUN_MASS * pullInward(R, z)) / KPC ** 3 / R;
			// the sum over the sky here is the coarser of the two: it is good to a few parts in ten thousand
			expect(Math.abs(galaxyCylindrical(R, z)[1] / want - 1)).toBeLessThan(1e-3);
		}
	});

	it('at the Sun it is the reading of the Milky Way demo', () => {
		const E = galaxyField(0, [1, 0, 0]);
		const sum = (k: number) => Object.values(GALAXY_TIDE).reduce((s, part) => s + part[k], 0);
		[E[0][0], E[1][1], E[2][2], E[0][2]].forEach((v, k) =>
			expect(Math.abs(v / sum(k) - 1)).toBeLessThan(1e-5)
		);
		expect(E[0][1]).toBe(0);
		expect([R_SUN, Z_SUN]).toEqual([8.2, 0.02]);
	});

	it('far outside it is the tide of one mass at the centre, 5.6e10 Suns', () => {
		// 45 kpc out in the plane: stretched along the line to the centre by 2 G M / r^3, to a few per cent
		const [rr, pp, zz] = galaxyCylindrical(45, 0);
		const k = (G * 5.6e10 * SUN_MASS) / (45 * KPC) ** 3;
		expect(rr / (-2 * k)).toBeGreaterThan(0.97);
		expect(rr / (-2 * k)).toBeLessThan(1.1);
		expect(pp / k).toBeGreaterThan(0.97);
		expect(pp / k).toBeLessThan(1.1);
		expect(zz / k).toBeGreaterThan(0.97);
		expect(zz / k).toBeLessThan(1.1);
	});

	it('below the plane the picture is the mirror of the one above', () => {
		const up = galaxyCylindrical(5, 0.4);
		const down = galaxyCylindrical(5, -0.4);
		expect(down.slice(0, 3)).toEqual(up.slice(0, 3));
		expect(down[3]).toBe(-up[3]);
		// between grid points the value lies between its neighbours'
		const mid = galaxyCylindrical(4.5, 0.3)[2];
		const a = galaxyCylindrical(4, 0.3)[2];
		const b = galaxyCylindrical(5, 0.3)[2];
		expect(mid).toBeCloseTo((a + b) / 2, 40);
		expect(Math.abs(mid - (a + b) / 2)).toBeLessThan(1e-12 * Math.abs(a));
	});
});

describe('the tide about a black hole', () => {
	const toHole: [number, number, number] = [1, 0, 0];

	it('at the camera it is the demo’s reading: 2 G M / r^3 toward the hole, half of it across', () => {
		const E = holeField(toHole, 40, 0, [0, 0, 1])!;
		// reference: lens.tide(10 * M_sun, 40 * G * 10 * M_sun / c^2) = 12880.26224869496 s^-2
		expect(E[0][0] / -12880.26224869496).toBeCloseTo(1, 12);
		expect(E[1][1] / 12880.26224869496).toBeCloseTo(0.5, 12);
		expect(E[2][2] / 12880.26224869496).toBeCloseTo(0.5, 12);
	});

	it('at any point it stretches along the line to the hole, by 2 G M / r^3 at that point', () => {
		// 30 from the camera, straight up: the hole is then 50 away, along (40, 0, -30) / 50
		const E = holeField(toHole, 40, 30, [0, 0, 1])!;
		const p = principal(E);
		expect(p[0].value / (-2 * holeTide(10, 50))).toBeCloseTo(1, 12);
		expect(Math.abs(p[0].axis[0])).toBeCloseTo(0.8, 12);
		expect(Math.abs(p[0].axis[2])).toBeCloseTo(0.6, 12);
		expect(p[0].axis[0] * p[0].axis[2]).toBeLessThan(0);
		expect(p[1].value / holeTide(10, 50)).toBeCloseTo(1, 12);
	});

	it('inside the horizon nothing rests, and there is no reading', () => {
		expect(holeField(toHole, 40, 40, [1, 0, 0])).toBeUndefined();
		expect(holeField(toHole, 40, 38.5, [1, 0, 0])).toBeUndefined();
		expect(holeField(toHole, 40, 37.9, [1, 0, 0])).toBeDefined();
	});

	it('the directions with no reading are a cone about the line to the hole, where the sphere enters the horizon', () => {
		// through the hole's centre: r = 2 where the angle from the line is 2 asin(1 / 40)
		expect(Math.acos(holeHollow(toHole, 40, 40)!.cos)).toBeCloseTo(2 * Math.asin(1 / 40), 12);
		expect(holeHollow(toHole, 40, 40)!.axis).toEqual(toHole);
		// short of the horizon and beyond it there is no such direction; just within it, a narrow cone
		expect(holeHollow(toHole, 40, 37.9)).toBeUndefined();
		expect(holeHollow(toHole, 40, 38)).toBeUndefined();
		expect(holeHollow(toHole, 40, 42.1)).toBeUndefined();
		expect(holeHollow(toHole, 40, 38.01)!.cos).toBeGreaterThan(0.9999);
		expect(holeHollow(toHole, 40, 41.99)!.cos).toBeGreaterThan(0.9999);
	});

	it('on a picture the cone is cut pixel by pixel: where the field gives nothing, with an edge one pixel wide', () => {
		// a picture 300 by 200, 50 degrees high, the hole up and to the right of its middle
		const tilt = 0.12;
		const camera: FieldCamera = {
			forward: [Math.cos(tilt), Math.sin(tilt), 0],
			right: [Math.sin(tilt), -Math.cos(tilt), 0],
			up: [0, 0, 1],
			tanX: Math.tan((25 * Math.PI) / 180) * 1.5,
			tanY: Math.tan((25 * Math.PI) / 180)
		};
		const [w, h] = [300, 200];
		for (const reach of [38.3, 40, 41.6]) {
			const cone = holeHollow(toHole, 40, reach)!;
			const { cover, near } = coneOnPicture(cone, camera, w, h);
			let inside = 0;
			let edge = 0;
			for (let y = 0; y < h; y++)
				for (let x = 0; x < w; x++) {
					const c = cover(x + 0.5, y + 0.5);
					const ray = rayThrough(camera, ((x + 0.5) / w) * 2 - 1, 1 - ((y + 0.5) / h) * 2);
					const none = holeField(toHole, 40, reach, ray) === undefined;
					// the pixel's centre is in the cone where it is more than half covered
					if (Math.abs(c - 0.5) > 1e-9) expect(c > 0.5, `${reach}: ${x}, ${y}`).toBe(none);
					if (c > 0) expect(near(x + 0.5, y + 0.5, 1)).toBe(true);
					if (c > 0.5) inside++;
					if (c > 0 && c < 1) edge++;
				}
			// a disc on the picture, near enough: its edge pixels are those within half a pixel of its rim
			const radius = Math.sqrt(inside / Math.PI);
			expect(inside).toBeGreaterThan(20);
			expect(edge / (2 * Math.PI * radius)).toBeGreaterThan(0.8);
			expect(edge / (2 * Math.PI * radius)).toBeLessThan(1.6);
			// far from the cone nothing is near it
			expect(near(0, h, 3)).toBe(false);
		}
		// straight across the rim (the hole is at the picture's mid height) the cover rises from none to all in a pixel
		const { cover } = coneOnPicture(holeHollow(toHole, 40, 40)!, camera, w, h);
		const row = Array.from({ length: 8 * w }, (_, i) => cover(i / 8, h / 2));
		const first = row.findIndex((c) => c > 0);
		const full = row.findIndex((c) => c === 1);
		expect(first).toBeGreaterThan(0);
		expect((full - first) / 8).toBeGreaterThan(0.8);
		expect((full - first) / 8).toBeLessThan(1.2);
	});
});
