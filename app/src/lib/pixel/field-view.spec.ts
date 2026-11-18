/**
 * The "Tidal field" view: the exact tensor at points inside and outside matter, against the Python reference, and
 * the rules by which every demo draws it (field-view.ts), which are those of engine/wgsl/field.wgsl.
 */
import { describe, expect, it } from 'vitest';
import safeJson from '../../../../scenes/locked-safe.scene.json';
import sunJson from '../../../../scenes/sun-at-midnight.scene.json';
import { G } from '../engine/physics/constants';
import { analyzeScene } from '../engine/scene';
import type { Scene, Vec3 } from '../engine/types';
import {
	DEFAULT_LOOK,
	FIELD_CELL,
	ORIGINAL_LOOK,
	SQUEEZE,
	STRETCH,
	fieldLevel,
	fieldMark,
	fieldReference,
	fieldSize,
	lookUniforms,
	rayThrough,
	scaleEnds,
	signHue,
	strengthRamp,
	stretchAxis,
	strokeHalf,
	strokeUniforms,
	toDisplay,
	traceless,
	washOver,
	type FieldCamera,
	type FieldLook
} from './field-view';
import { largest, sceneTide, sphereTide, type Mat3 } from './tide';

const safePoints = [
	{
		at: [0.9830869623865267, 0.27560987411859883, -3.128003971229857],
		E: [
			4.6322560046578816e-7, 1.4775526856360363e-7, 1.7794367675093464e-7, 3.3364098029989177e-7,
			-4.884495646341752e-7, 5.787064019460588e-6
		],
		extremes: [1.9098900433926553e-7, 5.83548892968858e-6]
	},
	{
		at: [0.7263001870593784, -0.9210006235312611, -2.421000623531261],
		E: [
			3.722200151744988e-8, -4.240611534316737e-9, 3.4745810088405934e-9, -5.483917458312315e-8,
			4.3004224641902086e-8, 1.7617173065673515e-8
		],
		extremes: [-7.509239671112576e-8, 3.8908707046147636e-8]
	},
	{
		at: [-1.5590239111558089, 1.8118047822311618, -3.1180478223116177],
		E: [
			3.327199499612988e-8, 4.3633227335425564e-8, 1.16656889868676e-8, -8.001861652955544e-8,
			-2.7545657789594284e-8, 4.6746621533425646e-8
		],
		extremes: [-1.0090549466451202e-7, 5.359863095140265e-8]
	}
];

const pack = (m: Mat3) => [m[0][0], m[0][1], m[0][2], m[1][1], m[1][2], m[2][2]];

function expectTensor(actual: Mat3, expected: number[], rel = 1e-10) {
	const top = Math.max(...expected.map(Math.abs));
	pack(actual).forEach((v, k) => expect(Math.abs(v - expected[k])).toBeLessThanOrEqual(rel * top));
}

// scene = load_scene('scenes/sun-at-midnight.scene.json'); tidal.scene_tidal_tensor(scene, at, ['earth']) as
// [xx, xy, xz, yy, yz, zz] in s^-2, at a point in each of the Earth's shells, two metres above the ground, and far off
const earth = {
	innerCore: {
		at: [300000.0, -800000.0, 400000.0],
		E: [3.6064842778309488e-6, 0.0, 0.0, 3.6064842778309488e-6, 0.0, 3.6064842778309488e-6]
	},
	outerCore: {
		at: [1000000.0, 2000000.0, -1500000.0],
		E: [
			3.1043684937266097e-6, -4.104257323478304e-8, 3.0781929926087284e-8, 3.0428046338744354e-6,
			6.156385985217457e-8, 3.0787168854548703e-6
		]
	},
	lowerMantle: {
		at: [-3000000.0, 3500000.0, 1000000.0],
		E: [
			1.2217413381372383e-6, 9.825582298023673e-7, 2.807309228006763e-7, 9.176161717698391e-7,
			-3.2751940993412237e-7, 1.9703571322723755e-6
		]
	},
	upperMantle: {
		at: [2000000.0, 5000000.0, -2500000.0],
		E: [
			1.4249931029866183e-6, -6.121894957641561e-7, 3.0609474788207806e-7, 1.3939516188189043e-7,
			7.652368697051952e-7, 1.2872504664396832e-6
		]
	},
	crust: {
		at: [1500000.0, 6000000.0, 1480000.0],
		E: [
			1.4093487872861966e-6, -5.021235115668e-7, -1.2385713285314397e-7, -4.736143810893033e-7,
			-4.954285314125759e-7, 1.4126739607627945e-6
		]
	},
	above: {
		at: [0.0, 6371002.0, 0.0],
		E: [1.5307341562786023e-6, 0.0, 0.0, -3.0614683125572046e-6, 0.0, 1.5307341562786023e-6]
	},
	far: {
		at: [20000000.0, -10000000.0, 30000000.0],
		E: [
			1.0795254956534975e-9, 3.2385764869604877e-9, -9.715729460881463e-9, 5.9373902260942305e-9,
			4.8578647304407315e-9, -7.01691572174772e-9
		]
	}
};
// tidal.uniform_sphere_tidal_tensor(at, [0, 0, 0], 1221500, 12900 * 4/3 * pi * 1221500^3): the inner core alone,
// at [1e5, 2e5, -3e5] inside it and at [1e6, 2e6, -3e5] outside
const ballInside = [
	3.606484277830949e-6, 0.0, 0.0, 3.606484277830949e-6, 0.0, 3.606484277830949e-6
];
const ballOutside = [
	2.3502620469168975e-7, -6.747163771053292e-7, 1.0120745656579937e-7, -7.77048360966304e-7,
	2.0241491313159875e-7, 5.420221562746145e-7
];

describe('the tide inside and outside nested uniform spheres', () => {
	const scene = sunJson as unknown as Scene;
	const shells = analyzeScene(scene).filter((o) => !/^(sun|moon)/.test(o.id));

	it('one uniform sphere: (4 pi G rho / 3) delta_ij inside, a point mass outside', () => {
		const inside = sphereTide(12900, [0, 0, 0], 1221500, [1e5, 2e5, -3e5]);
		expectTensor(inside, ballInside);
		expect(inside[0][0]).toBeCloseTo((4 * Math.PI * G * 12900) / 3, 18);
		expectTensor(sphereTide(12900, [0, 0, 0], 1221500, [1e6, 2e6, -3e5]), ballOutside);
	});

	it('the Earth of the scene, in every shell and outside, as the reference has it', () => {
		expect(shells).toHaveLength(5);
		for (const { at, E } of Object.values(earth)) expectTensor(sceneTide(shells, at as Vec3), E);
	});

	it('inside the inner core the squeeze is even; in a shell, the stretch is toward the centre and the trace is the density', () => {
		// in the inner core every shell is around the point: (4 pi G / 3) of the inner core's density, every way
		const core = sceneTide(shells, earth.innerCore.at as Vec3);
		expect(core[0][0]).toBeCloseTo((4 * Math.PI * G * 12900) / 3, 15);
		expect(largest(core).value).toBeCloseTo((4 * Math.PI * G * 12900) / 3, 15);
		// in the lower mantle the trace is 4 pi G times its density
		const mantle = sceneTide(shells, earth.lowerMantle.at as Vec3);
		expect(mantle[0][0] + mantle[1][1] + mantle[2][2]).toBeCloseTo(4 * Math.PI * G * 4900, 15);
		// the wash is coloured by the part without the trace: in the inner core there is none at all
		expect(fieldSize(core)).toBeLessThan(1e-20);
		// above the ground: 2 G M / r^3 along the vertical, a stretch
		expect(largest(sceneTide(shells, earth.above.at as Vec3)).value).toBeCloseTo(
			-3.0614683125572046e-6,
			15
		);
	});

	it('a room: the tensor the wash is coloured by, in front of the locked safe, is the reference’s', () => {
		const room = analyzeScene(safeJson as unknown as Scene);
		// tidal.scene_tidal_tensor(load_scene('scenes/locked-safe.scene.json'), at) at two points of the slice 3.5 m
		// from the camera, toward the gold and toward the floor, and numpy.linalg.eigvalsh of each
		for (const { at, E, extremes } of safePoints) {
			expectTensor(sceneTide(room, at as Vec3), E);
			const v = largest(sceneTide(room, at as Vec3)).value;
			const want = Math.abs(extremes[0]) > Math.abs(extremes[1]) ? extremes[0] : extremes[1];
			expect(Math.abs(v / want - 1)).toBeLessThan(1e-9);
		}
		// with the empty room taken away only what was brought in is left
		const without = sceneTide(room, safePoints[0].at as Vec3, true);
		expect(without[0][0]).not.toBeCloseTo(safePoints[0].E[0], 12);
	});
});

describe('the rules of the view, as in field.wgsl', () => {
	const camera: FieldCamera = {
		right: [1, 0, 0],
		up: [0, 1, 0],
		forward: [0, 0, -1],
		tanX: 0.8,
		tanY: 0.5
	};
	// a body straight ahead: stretched along the line of sight, squeezed across it
	const ahead: Mat3 = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, -2]
	];

	it('the strength is the size of the traceless part, and the trace does not count', () => {
		expect(fieldSize(ahead)).toBeCloseTo(Math.sqrt(3), 12);
		const dense = ahead.map((row, i) => row.map((v, j) => v + (i === j ? 7 : 0)));
		expect(fieldSize(dense)).toBeCloseTo(Math.sqrt(3), 12);
		expect(traceless(dense)[2][2]).toBeCloseTo(-2, 12);
		expect(Math.abs(stretchAxis(dense)[2])).toBeCloseTo(1, 12);
	});

	it('the scale is logarithmic: nothing two decades under the reference, full 0.6 over it', () => {
		expect(fieldLevel(0.01, 1)).toBe(0);
		expect(fieldLevel(10 ** 0.6, 1)).toBe(1);
		// at the reference itself: smoothstep(-2, 0.6, 0)
		const t = 2 / 2.6;
		expect(fieldLevel(1, 1)).toBeCloseTo(t * t * (3 - 2 * t), 12);
	});

	it('the reference is the median over the picture, and a ray through its centre is the way it looks', () => {
		expect(rayThrough(camera, 0, 0)).toEqual([0, 0, -1]);
		const corner = rayThrough(camera, 1, 1);
		expect(corner[0] / -corner[2]).toBeCloseTo(0.8, 12);
		expect(corner[1] / -corner[2]).toBeCloseTo(0.5, 12);
		expect(fieldReference(() => ahead, camera)).toBeCloseTo(Math.sqrt(3), 12);
		// points with no field (inside a horizon) are left out of the median
		expect(fieldReference((d) => (d[0] > 0 ? ahead : undefined), camera)).toBeCloseTo(
			Math.sqrt(3),
			12
		);
	});

	it('a stroke lies along the stretch as it crosses the picture; looked along, it has no length', () => {
		const along = fieldMark(ahead, camera, Math.sqrt(3));
		expect(along.inPlane).toBeCloseTo(0, 10);
		expect(strokeHalf(along)).toBeLessThan(1e-6);
		// blue: the stretch is along the line of sight
		expect(along.tone[2]).toBeGreaterThan(along.tone[0]);
		// a body overhead: the stroke is vertical and green leads
		const overhead: Mat3 = [
			[1, 0, 0],
			[0, -2, 0],
			[0, 0, 1]
		];
		const up = fieldMark(overhead, camera, Math.sqrt(3));
		expect(Math.abs(up.across[1])).toBeCloseTo(1, 12);
		expect(up.tone[1]).toBeGreaterThan(up.tone[0]);
		expect(strokeHalf(up)).toBeCloseTo(0.42 * 26 * up.level, 12);
	});
});

describe('the look: each control drives one part of the mapping from a tensor to a colour and a stroke', () => {
	const camera: FieldCamera = {
		right: [1, 0, 0],
		up: [0, 1, 0],
		forward: [0, 0, -1],
		tanX: 0.8,
		tanY: 0.5
	};
	// a body overhead, of the reference's own strength: stretched up and down, squeezed across
	const overhead: Mat3 = [
		[1, 0, 0],
		[0, -2, 0],
		[0, 0, 1]
	];
	const reference = Math.sqrt(3);
	const look = (changed: Partial<FieldLook>): FieldLook => ({ ...ORIGINAL_LOOK, ...changed });
	const near = (a: number[], b: number[]) => a.forEach((v, k) => expect(v).toBeCloseTo(b[k], 12));
	const atReference = (() => {
		const t = 2 / 2.6;
		return t * t * (3 - 2 * t);
	})();

	it('the first picture: 0.72 of the way from grey to the hue, shaded from 0.4, half covered, a stroke to 26 pixels', () => {
		const mark = fieldMark(overhead, camera, reference, ORIGINAL_LOOK);
		expect(mark.level).toBeCloseTo(atReference, 12);
		// the stretch is up and down: green full, red and blue none
		const shade = 0.4 + 0.6 * atReference;
		expect(mark.tone[1]).toBeCloseTo((0.62 + 0.38 * 0.72) * shade, 12);
		expect(mark.tone[0]).toBeCloseTo(0.62 * 0.28 * shade, 12);
		expect(mark.tone[2]).toBeCloseTo(mark.tone[0], 12);
		expect(mark.cover).toBeCloseTo(0.5 * atReference, 12);
		expect(strokeUniforms(ORIGINAL_LOOK)).toEqual([26, 0.42, 0.8]);
		expect(lookUniforms(ORIGINAL_LOOK).look).toEqual([1, 0, 0, 0]);
		expect(strokeHalf(mark, ORIGINAL_LOOK)).toBeCloseTo(0.42 * 26 * atReference, 12);
	});

	it('the look it starts with differs from the first picture only in contrast and in the strokes’ hairline', () => {
		expect(DEFAULT_LOOK).toEqual({ ...ORIGINAL_LOOK, contrast: 1.2, edge: 0.5 });
		expect(lookUniforms(DEFAULT_LOOK).look).toEqual([1.2, 0, 0, 0.5]);
		expect(strokeUniforms(DEFAULT_LOOK)).toEqual(strokeUniforms(ORIGINAL_LOOK));
	});

	it('contrast: none leaves an even grey, more takes the wash to the full hue and deepens its shading', () => {
		const flat = fieldMark(overhead, camera, reference, look({ contrast: 0 }));
		expect(flat.tone).toEqual([0.62, 0.62, 0.62]);
		const strong = fieldMark(overhead, camera, reference, look({ contrast: 1.4 }));
		// 0.72 * 1.4 is past 1: the hue itself, shaded by 1 - 0.84 * (1 - level)
		const shade = 1 - 0.84 * (1 - atReference);
		expect(strong.tone[1]).toBeCloseTo(shade, 12);
		expect(strong.tone[0]).toBeCloseTo(0, 12);
		// the strokes and the cover do not change
		expect(strong.cover).toBe(fieldMark(overhead, camera, reference, ORIGINAL_LOOK).cover);
	});

	it('strength scale: a shift of d decades draws a field as one 10^d times stronger', () => {
		expect(fieldLevel(1, 1, 0.5)).toBeCloseTo(fieldLevel(10 ** 0.5, 1), 12);
		expect(fieldLevel(1, 1, -1)).toBeCloseTo(fieldLevel(0.1, 1), 12);
		const up = fieldMark(overhead, camera, reference, look({ shift: 0.6 }));
		expect(up.level).toBe(1);
		// the ends of the scale, in the reference's units: two decades under to 0.6 over, moved against the shift
		expect(scaleEnds(1e-7).none).toBeCloseTo(1e-9, 20);
		expect(scaleEnds(1e-7).full).toBeCloseTo(1e-7 * 10 ** 0.6, 18);
		expect(scaleEnds(1e-7, 1).full).toBeCloseTo(1e-8 * 10 ** 0.6, 19);
		expect(lookUniforms(look({ shift: -0.5 })).look[1]).toBe(-0.5);
	});

	it('colour by strength: the ramp runs from violet to yellow with the level, whatever the direction', () => {
		expect(strengthRamp(0)).toEqual([0.0103, 0.0037, 0.0529]);
		expect(strengthRamp(0.5)).toEqual([0.497, 0.0382, 0.089]);
		expect(strengthRamp(1)).toEqual([0.973, 1.0, 0.371]);
		const across: Mat3 = [
			[-2, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
		const a = fieldMark(overhead, camera, reference, look({ colour: 'strength' }));
		const b = fieldMark(across, camera, reference, look({ colour: 'strength' }));
		a.tone.forEach((t, k) => expect(t).toBeCloseTo(b.tone[k], 12));
		expect(lookUniforms(look({ colour: 'strength' })).look[2]).toBe(1);
	});

	it('colour by stretch against squeeze: orange outside a mass, blue inside matter, between where they balance', () => {
		// outside a point mass, (-2, 1, 1): the stretch leads by a third, which is full orange
		near(signHue(overhead), STRETCH);
		// inside matter everything is squeezed, however unevenly
		near(
			signHue([
				[3, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			]),
			SQUEEZE
		);
		// between two masses side by side, (-1, -1, 2): the squeeze leads
		near(
			signHue([
				[-1, 0, 0],
				[0, -1, 0],
				[0, 0, 2]
			]),
			SQUEEZE
		);
		// a stretch and a squeeze of one size: half way
		const even = signHue([
			[-1, 0, 0],
			[0, 0, 0],
			[0, 0, 1]
		]);
		even.forEach((c, k) => expect(c).toBeCloseTo((STRETCH[k] + SQUEEZE[k]) / 2, 12));
		expect(lookUniforms(look({ colour: 'sign' })).look[2]).toBe(2);
	});

	it('wash opacity: none leaves the picture beneath, dimmed as in the first picture; all of it covers by the level', () => {
		const beneath: [number, number, number] = [0.5, 0.4, 0.3];
		const none = fieldMark(overhead, camera, reference, look({ opacity: 0 }));
		expect(washOver(beneath, none)).toEqual([0.5 * 0.85, 0.4 * 0.85, 0.3 * 0.85]);
		const all = fieldMark(overhead, camera, reference, look({ opacity: 1, shift: 0.6 }));
		expect(all.cover).toBe(1);
		expect(washOver(beneath, all)).toEqual(all.tone);
		// the screen's curve, as the shader's to_display
		expect(toDisplay(0.5)).toBeCloseTo(0.5 ** (1 / 2.2), 12);
	});

	it('strokes: off, there is no cell; density sets the cell, length and weight the stroke', () => {
		expect(strokeUniforms(look({ strokes: false }))[0]).toBe(0);
		expect(strokeUniforms(look({ density: 2 }))[0]).toBe(FIELD_CELL / 2);
		expect(strokeUniforms(look({ density: 0.5 }))[0]).toBe(52);
		// a stroke never reaches into the next cell
		expect(strokeUniforms(look({ length: 1.19 }))[1]).toBeCloseTo(0.4998, 12);
		expect(strokeUniforms(look({ length: 3 }))[1]).toBe(0.5);
		expect(strokeUniforms(look({ weight: 2 }))[2]).toBe(1.6);
		const mark = fieldMark(overhead, camera, reference, ORIGINAL_LOOK);
		expect(strokeHalf(mark, look({ density: 2, length: 0.5 }))).toBeCloseTo(
			0.21 * 13 * atReference,
			12
		);
		expect(strokeHalf(mark, look({ strokes: false }))).toBe(0);
	});
});
