/**
 * The "Tidal field" reading of every demo (tide-demos.ts), against the Python reference. Each expected tensor is
 * [xx, xy, xz, yy, yz, zz] in s^-2 in the demo's own axes, and each principal value is in s^-2, ascending; they are
 * copied from calls of reference/gravcam (run from reference/ with ../.venv/bin/python), named above each block.
 */
import { describe, expect, it } from 'vitest';
import beamJson from '../../../../scenes/beam-in-the-dark.scene.json';
import mirrorJson from '../../../../scenes/blank-mirror.scene.json';
import furnaceJson from '../../../../scenes/closed-furnace.scene.json';
import tanksJson from '../../../../scenes/full-or-empty.scene.json';
import honeyJson from '../../../../scenes/honey-and-water.scene.json';
import safeJson from '../../../../scenes/locked-safe.scene.json';
import flywheelJson from '../../../../scenes/sealed-flywheel.scene.json';
import sunJson from '../../../../scenes/sun-at-midnight.scene.json';
import drumsJson from '../../../../scenes/which-way.scene.json';
import { LATITUDE, objectsAt } from '../demos/sun-at-midnight';
import { C, G } from '../engine/physics/constants';
import { analyzeScene } from '../engine/scene';
import type { Scene, Vec3 } from '../engine/types';
import {
	GALAXY_TIDE,
	HOLE_SUNS,
	REAL_MASS,
	SUN_MASS,
	drumsReading,
	earthReading,
	galaxyReading,
	holeReading,
	holeTide,
	layeredBody,
	prepareDrums,
	roomReading,
	total,
	totalMagnetic,
	type Reading
} from './tide-demos';
import { principal, principalRows, size3, type Mat3 } from './tide';

const pack = (m: Mat3) => [m[0][0], m[0][1], m[0][2], m[1][1], m[1][2], m[2][2]];

/** Every component within `rel` of the expected tensor's largest. */
function expectTensor(actual: Mat3, expected: number[], rel = 1e-9) {
	const top = Math.max(...expected.map(Math.abs));
	pack(actual).forEach((v, k) => expect(Math.abs(v - expected[k])).toBeLessThanOrEqual(rel * top));
}

function expectPrincipal(actual: Mat3, expected: number[], rel = 1e-9) {
	const top = Math.max(...expected.map(Math.abs));
	principal(actual).forEach((p, k) =>
		expect(Math.abs(p.value - expected[k])).toBeLessThanOrEqual(rel * top)
	);
}

const source = (reading: Reading, label: string) => {
	const found = reading.sources.find((s) => s.label === label);
	if (!found) throw new Error(`no source "${label}"`);
	return found;
};

const scenes: Record<string, Scene> = {
	'locked-safe': safeJson as unknown as Scene,
	'full-or-empty': tanksJson as unknown as Scene,
	'blank-mirror': mirrorJson as unknown as Scene,
	'closed-furnace': furnaceJson as unknown as Scene,
	'honey-and-water': honeyJson as unknown as Scene,
	'sealed-flywheel': flywheelJson as unknown as Scene,
	'beam-in-the-dark': beamJson as unknown as Scene
};

// --- the rooms -----------------------------------------------------------------------------------------------------------
// For each scene, at scene.observer: each source is the sum, over the objects it names (tide-demos.ts, ROOM_SOURCES;
// "the empty room" is every object marked as background), of
//   density * [T(shape) - sum of T(child's shape)],  T = tidal.uniform_box_tidal_tensor(observer, center, size, 1.0)
//   or tidal.uniform_sphere_tidal_tensor(observer, center, radius, volume): each object's own matter at its own density.
// "total" is tidal.scene_tidal_tensor(scene, scene.observer). "principal" is numpy.linalg.eigvalsh of each.
const rooms = {
	'locked-safe': {
		'the gold': {
			E: [
				2.75336151182307e-10, 1.0689036794297826e-10, 2.720402746998284e-10, 2.280278224962983e-10,
				-3.394666436874239e-10, -5.033639736787483e-10
			],
			principal: [-7.22274202468873e-10, 3.6095456592599126e-10, 3.61319636542739e-10]
		},
		'the two safes': {
			E: [
				2.8354179939066827e-9, -6.6460332399859045e-15, -1.6914421180766763e-14,
				2.9907829763711214e-9, -2.7069032038476803e-9, -5.826200970278176e-9
			],
			principal: [-6.590921387164047e-9, 2.835417993937866e-9, 3.755503393225809e-9]
		},
		'the empty room': {
			E: [
				1.5033981696517192e-8, 0.0, 0.0, -3.9041790630549834e-8, -9.965079815084627e-9,
				2.400780893403259e-8
			],
			principal: [-4.057929290111869e-8, 1.5033981696517192e-8, 2.5545311204601445e-8]
		},
		total: {
			E: [
				1.8144735841606185e-8, 1.0688372190973827e-10, 2.7202336027864777e-10,
				-3.582297983168241e-8, -1.301144966261973e-8, 1.7678243990075665e-8
			],
			principal: [-3.881999918326644e-8, 1.8122440894890514e-8, 2.0697558288375397e-8]
		}
	},
	'full-or-empty': {
		'the mercury': {
			E: [
				4.118011478105519e-9, 2.117834474454266e-9, 7.412420660589932e-9, 5.8828735401507405e-9,
				-4.941613773726621e-9, -1.0000885018256256e-8
			],
			principal: [-1.458952637957383e-8, 7.294763189786916e-9, 7.29476318978692e-9]
		},
		'the water': {
			E: [
				6.819597700246583e-10, 0.0, 0.0, 5.275537843586978e-10, -5.404209498308613e-10,
				-1.2095135543833562e-9
			],
			principal: [-1.3639195400493165e-9, 6.819597700246583e-10, 6.819597700246583e-10]
		},
		'the three steel tanks': {
			E: [
				6.333405232400573e-10, -1.8777902832459527e-13, -6.572265991360834e-13,
				6.85683990303449e-10, -6.236870900857193e-10, -1.3190245135435054e-9
			],
			principal: [-1.4972210442851227e-9, 6.333407425286115e-10, 8.638803017565116e-10]
		},
		'the empty room': {
			E: [
				1.5033981696517192e-8, 0.0, 0.0, -3.9041790630549834e-8, -9.965079815084627e-9,
				2.400780893403259e-8
			],
			principal: [-4.057929290111869e-8, 1.5033981696517192e-8, 2.5545311204601445e-8]
		},
		total: {
			E: [
				2.0467293467887426e-8, 2.1176466954259416e-9, 7.411763433990796e-9, -3.1945679315736945e-8,
				-1.607080162872783e-8, 1.1478385847849471e-8
			],
			principal: [-3.757394013228459e-8, 1.21211218697045e-8, 2.5452818262580073e-8]
		}
	},
	'blank-mirror': {
		'the bronze ball': {
			E: [
				4.286397065020408e-11, -5.406050110031342e-12, -9.911091868390794e-11,
				8.726566222059483e-11, -1.1893310242068954e-11, -1.3012963287079884e-10
			],
			principal: [-1.7582877646759713e-10, 8.791438823379858e-11, 8.791438823379864e-11]
		},
		'the plinth': {
			E: [
				9.800059151364422e-11, -3.877797498399737e-11, -2.1507070971256127e-10,
				1.7939961703458796e-10, -8.531258849385531e-11, -2.7740020854823593e-10
			],
			principal: [-3.905666992972373e-10, 1.9480749086082224e-10, 1.9575920843641138e-10]
		},
		'the mirror, the page and the television': {
			E: [
				9.07841599505e-12, -2.508809502508404e-15, -2.318766143472226e-12, 1.0890276027046346e-11,
				2.4952340754889457e-13, -1.996869202212255e-11
			],
			principal: [-2.0154619043015105e-11, 9.262050006967329e-12, 1.0892569036021572e-11]
		},
		'the empty room': {
			E: [
				1.4845880013869143e-8, 0.0, 0.0, -2.597448570886746e-8, -1.6674403640909624e-8,
				1.1128605694998256e-8
			],
			principal: [-3.2366788641635776e-8, 1.4845880013869143e-8, 1.7520908627766573e-8]
		},
		total: {
			E: [
				1.499582299202804e-8, -4.4186533903531225e-11, -3.1650039453994147e-10,
				-2.5696930153585224e-8, -1.6771360016237996e-8, 1.07011071615571e-8
			],
			principal: [-3.224681833335759e-8, 1.4962382560537865e-8, 1.7284435772819627e-8]
		}
	},
	'closed-furnace': {
		'the hot iron': {
			E: [
				6.91055025245094e-10, 2.434035570880201e-10, 7.081895948028849e-10, 6.487892137206189e-10,
				-7.745361381215995e-10, -1.3398442389658953e-9
			],
			principal: [-1.8284846800974516e-9, 9.136160360000166e-10, 9.148686440972528e-10]
		},
		'the cold iron': {
			E: [
				6.91055025245094e-10, -2.434035570880201e-10, -7.081895948028849e-10, 6.487892137206189e-10,
				-7.745361381215995e-10, -1.3398442389658953e-9
			],
			principal: [-1.8284846800974516e-9, 9.136160360000166e-10, 9.148686440972528e-10]
		},
		'the two furnaces': {
			E: [
				3.338039412824863e-9, 0.0, 0.0, 3.5257498751362256e-9, -3.205915729296572e-9,
				-6.863789287960938e-9
			],
			principal: [-7.77340556157695e-9, 3.338039412824863e-9, 4.435366148752241e-9]
		},
		'the empty room': {
			E: [
				1.5033981696517192e-8, 0.0, 0.0, -3.9041790630549834e-8, -9.965079815084627e-9,
				2.400780893403259e-8
			],
			principal: [-4.057929290111869e-8, 1.5033981696517192e-8, 2.5545311204601445e-8]
		},
		total: {
			E: [
				1.9754131159832243e-8, 0.0, 0.0, -3.421846232797236e-8, -1.47200678206244e-8,
				1.4464331168139861e-8
			],
			principal: [-3.832322511490548e-8, 1.8569093955072975e-8, 1.9754131159832243e-8]
		}
	},
	'honey-and-water': {
		'the honey': {
			E: [
				8.027834215996611e-11, -8.634460249746811e-12, -3.824622191461611e-11,
				7.376596073390167e-11, -5.4274570203294284e-11, -1.5404430289387232e-10
			],
			principal: [-1.7239825118656942e-10, 8.603534323103938e-11, 8.636290795552559e-11]
		},
		'the water': {
			E: [
				5.7341672971396956e-11, 6.167471606962008e-12, 2.7318729939011508e-11, 5.26899719527869e-11,
				-3.8767550145210206e-11, -1.100316449241945e-10
			],
			principal: [-1.2314160799040693e-10, 6.14538165935996e-11, 6.168779139679676e-11]
		},
		'the two glass bottles': {
			E: [
				8.803062913827485e-11, 0.0, 0.0, 8.082688948453273e-11, -5.936876402702494e-11,
				-1.6885751862278447e-10
			],
			principal: [-1.8225505579816572e-10, 8.803062913827485e-11, 9.422442665991399e-11]
		},
		'the empty room': {
			E: [
				1.5288314344545092e-8, 0.0, 0.0, -3.884128055130086e-8, -1.0217015961511223e-8,
				2.3552966206755715e-8
			],
			principal: [-4.0471705394521644e-8, 1.5288314344545092e-8, 2.5183391049976502e-8]
		},
		total: {
			E: [
				1.551396498881473e-8, -2.4669886427848046e-12, -1.0927491975604603e-11,
				-3.8633997729129636e-8, -1.0369426845886753e-8, 2.3120032740314864e-8
			],
			principal: [-4.032867424457442e-8, 1.5513953705249532e-8, 2.4814720539324844e-8]
		}
	},
	'sealed-flywheel': {
		'the turning flywheel': {
			E: [
				1.2114625117680362e-9, 3.4643208742066894e-10, 1.2471555147144083e-9, 1.277599546639255e-9,
				-1.1337777406494622e-9, -2.4890620584072904e-9
			],
			principal: [-3.1850756158615437e-9, 1.5925378079307716e-9, 1.5925378079307723e-9]
		},
		'the still flywheel': {
			E: [
				1.2114625117680362e-9, -3.4643208742066894e-10, -1.2471555147144083e-9,
				1.277599546639255e-9, -1.1337777406494622e-9, -2.4890620584072904e-9
			],
			principal: [-3.1850756158615437e-9, 1.5925378079307716e-9, 1.5925378079307723e-9]
		},
		'the two housings': {
			E: [
				2.2879417746558205e-9, 0.0, 0.0, 2.4120653646664335e-9, -2.135795925500909e-9,
				-4.700007139321613e-9
			],
			principal: [-5.2921051740741e-9, 2.2879417746558205e-9, 3.004163399418919e-9]
		},
		'the empty room': {
			E: [
				1.0289601091000505e-8, 0.0, 0.0, -3.6565852553394534e-8, -9.572750605148312e-9,
				2.627625146239395e-8
			],
			principal: [-3.799171917466796e-8, 1.0289601091000505e-8, 2.7702118083667377e-8]
		},
		total: {
			E: [
				1.50004678891924e-8, 0.0, 0.0, -3.159858809544959e-8, -1.3976102011948144e-8,
				1.6598120206257756e-8
			],
			principal: [-3.5358125110804954e-8, 1.50004678891924e-8, 2.0357657221613117e-8]
		}
	},
	'beam-in-the-dark': {
		'the beam': {
			E: [
				8.793437717649945e-33, 0.0, 0.0, 9.547798800119571e-33, -1.5257595583055164e-33,
				-1.8341236517814637e-32
			],
			principal: [-1.84244597664565e-32, 8.793437717649945e-33, 9.631022048761435e-33]
		},
		'the empty room': {
			E: [
				1.0447774194146724e-8, 2.0966271850889694e-13, 6.9729547327265535e-12,
				-3.633959807242976e-8, -9.657119160375928e-9, 2.5891823878283e-8
			],
			principal: [-3.7803749314373143e-8, 1.0447771441197195e-8, 2.7355977873175927e-8]
		},
		total: {
			E: [
				1.0447774194146724e-8, 2.0966271850889653e-13, 6.9729547327265665e-12,
				-3.633959807242975e-8, -9.657119160375926e-9, 2.5891823878283e-8
			],
			principal: [-3.780374931437313e-8, 1.0447771441197195e-8, 2.7355977873175934e-8]
		}
	}
};

// gravitomagnetic.spin_dipole(L, center - observer) for the right-hand flywheel of scenes/sealed-flywheel.scene.json
const flywheelB = [
	3.499954783090446e-17, 2.1107183450655104e-17, 5.819719525866738e-17, 3.902910103512044e-17,
	-5.290654114424306e-17, -7.402864886602485e-17
];

describe('the rooms: the tide at the camera, by source', () => {
	for (const [name, expected] of Object.entries(rooms)) {
		it(`${name}: every source, and their sum, as the reference has them`, () => {
			const scene = scenes[name];
			const reading = roomReading(name, analyzeScene(scene), scene.observer.position);
			const labels = Object.keys(expected).filter((l) => l !== 'total');
			expect(reading.sources.map((s) => s.label).sort()).toEqual([...labels].sort());
			for (const label of labels) {
				const want = expected[label as keyof typeof expected] as Expected;
				expectTensor(source(reading, label).E, want.E);
				expectPrincipal(source(reading, label).E, want.principal);
			}
			const all = (expected as Record<string, Expected>).total;
			expectTensor(total(reading), all.E);
			expectPrincipal(total(reading), all.principal);
		});
	}

	it('the locked safe: the gold is 7.2e-10 s^-2, the safes 6.6e-9, the room 4.1e-8', () => {
		const scene = scenes['locked-safe'];
		const reading = roomReading('locked-safe', analyzeScene(scene), scene.observer.position);
		expect(size3(source(reading, 'the gold').E)).toBeCloseTo(7.22e-10, 12);
		expect(size3(source(reading, 'the two safes').E)).toBeCloseTo(6.59e-9, 11);
		expect(size3(source(reading, 'the empty room').E)).toBeCloseTo(4.06e-8, 10);
		// the gold's stretch is named by the line to it
		const rows = principalRows(source(reading, 'the gold').E, reading.landmarks);
		expect(rows[0].direction).toBe('along the line to the gold');
		// one ring, of everything; and one line saying whose reading this is
		expect(reading.rings).toHaveLength(1);
		expect(reading.notes[0]).toMatch(/one pixel at the camera/);
	});

	it('with the room taken away, what is left is what was brought in', () => {
		const scene = scenes['locked-safe'];
		const objects = analyzeScene(scene);
		const reading = roomReading('locked-safe', objects, scene.observer.position, true);
		expect(source(reading, 'the empty room').removed).toBe(true);
		const left = rooms['locked-safe'];
		const sum = left['the gold'].E.map((v, k) => v + left['the two safes'].E[k]);
		expectTensor(total(reading), sum);
		expect(reading.rings[0].label).toBe('With the empty room taken away');
	});

	it('the closed furnace: the hot iron and the cold read the same, mirrored', () => {
		const scene = scenes['closed-furnace'];
		const reading = roomReading('closed-furnace', analyzeScene(scene), scene.observer.position);
		const hot = principal(source(reading, 'the hot iron').E).map((p) => p.value);
		const cold = principal(source(reading, 'the cold iron').E).map((p) => p.value);
		hot.forEach((v, k) => expect(Math.abs(v - cold[k])).toBeLessThan(1e-12 * Math.abs(hot[0])));
		expect(source(reading, 'the hot iron').E[0][1]).toBeCloseTo(
			-source(reading, 'the cold iron').E[0][1],
			22
		);
	});

	it('the sealed flywheel: the turning wheel has a magnetic part, the still one none', () => {
		const scene = scenes['sealed-flywheel'];
		const reading = roomReading('sealed-flywheel', analyzeScene(scene), scene.observer.position);
		// gravitomagnetic.spin_dipole(L, center - observer), L = (2/5) M R^2 * 2 pi * 50 along the axis
		expectTensor(source(reading, 'the turning flywheel').B!, flywheelB);
		expect(source(reading, 'the still flywheel').B).toBeUndefined();
		expectTensor(totalMagnetic(reading)!, flywheelB);
		expect(size3(totalMagnetic(reading)!)).toBeCloseTo(1.197e-16, 19);
	});

	it('behind the wall: the walker’s magnetic part is the boost of a box’s tide', () => {
		const room = scenes['locked-safe'];
		const scene: Scene = {
			...room,
			name: 'behind-the-wall',
			materials: { ...room.materials, person: { density: 985, temperature: 310, friction: 0.001 } },
			objects: [
				...room.objects.filter((o) => o.background),
				{
					id: 'walking',
					shape: { type: 'box', center: [0.6, 0.85, -5.6], size: [0.36, 1.7, 0.2] },
					material: 'person',
					velocity: [1.4, 0, 0]
				}
			]
		};
		const reading = roomReading('behind-the-wall', analyzeScene(scene), [0, 1.5, 0], true);
		// the "walker" block of tide.spec.ts: tidal.uniform_box_tidal_tensor, and magnetic_point over its cells
		expectTensor(
			source(reading, 'the person walking').E,
			[
				4.220693703709107e-11, 1.5215069149428018e-12, 1.3597100561833434e-11,
				4.115374248939198e-11, -1.4216914670723522e-11, -8.33606795264469e-11
			]
		);
		expectTensor(
			source(reading, 'the person walking').B!,
			[
				0, -6.349706364705406e-20, 7.10528108396848e-21, 1.3278306380195738e-19,
				5.814695672634033e-19, -1.3278306380195738e-19
			],
			1e-8
		);
	});

	it('a scene with no entry is split by what was brought into the room', () => {
		const scene = scenes['locked-safe'];
		const reading = roomReading('unnamed', analyzeScene(scene), scene.observer.position);
		expect(reading.sources.map((s) => s.label).sort()).toEqual([
			'the empty room',
			'the safe left',
			'the safe right'
		]);
		expectTensor(total(reading), rooms['locked-safe'].total.E);
	});
});

interface Expected {
	E: number[];
	principal: number[];
}

// --- the Sun at midnight ---------------------------------------------------------------------------------------------------
// scene = load_scene('scenes/sun-at-midnight.scene.json'); for root in earth, moon, sun:
//   mass      tidal.scene_mass(scene, [root])
//   E         tidal.scene_tidal_tensor(scene, scene.observer, [root])
// and for the Earth: inertia = sum of (2/5) m R^2 over tidal.uniform_bodies(scene, ['earth']); surface = 2 G M / R^3
// with R = 6 371 000 m; B = gravitomagnetic.magnetic_point(M, -observer, -(W pole x observer))
// + gravitomagnetic.spin_dipole(I W pole, -observer), W = 2 pi / 86164.0905 s, pole = [0, sin 40, -cos 40];
// equator = (3 G M W / c R^2) (1 - I / M R^2), the paper's 4.8e-12 s^-2.
// "afternoon": tidal.point_mass_tidal_tensor(observer, centre, mass) with the Sun and the Moon where the demo puts
// them at 15.5 h (lib/demos/sun-at-midnight.ts: AU and 384 400 km along skyDirection).
const sun = {
	earth: {
		mass: 5.930854552720513e24,
		E: [1.5307341562786023e-6, 0.0, 0.0, -3.0614683125572046e-6, 0.0, 1.5307341562786023e-6],
		principal: [-3.0614683125572046e-6, 1.5307341562786023e-6, 1.5307341562786023e-6],
		inertia: 7.99502205505774e37,
		B: [
			1.5192037817474154e-12, 0.0, 0.0, -3.038407563494831e-12, 3.640978119239894e-12,
			1.5192037817474154e-12
		],
		Bprincipal: [-5.054910606013271e-12, 1.5192037817474154e-12, 3.535706824265855e-12],
		surface: 3.0614711957491118e-6,
		equator: 4.752960877388487e-12
	},
	moon: {
		mass: 7.346352466722738e22,
		E: [
			7.133494450299125e-14, 5.468758665895069e-14, 4.0382980712923445e-14, -7.257577453194521e-14,
			-1.1987240267078653e-13, 1.2408300289539378e-15
		],
		principal: [-1.7951653107004358e-13, 8.975826553502179e-14, 8.975826553502184e-14]
	},
	sun: {
		mass: 1.9884694698174032e30,
		E: [
			3.963709995737719e-14, 0.0, 0.0, -3.014566689918458e-14, -5.855189975936226e-14,
			-9.491433058192622e-15
		],
		principal: [-7.92741999147544e-14, 3.963709995737719e-14, 3.963709995737719e-14]
	},
	afternoon: {
		hours: 15.5,
		sun: [
			-3.521564899220561e-14, 4.399880490846094e-14, 3.692275287576163e-14, 1.378328497486304e-14,
			-2.1701454886897786e-14, 2.143236401734257e-14
		],
		moon: [
			-1.3013618717127836e-13, 6.173392077978391e-14, 6.983066104707496e-14, 6.754112018411285e-14,
			-2.001610631352708e-14, 6.259506698716551e-14
		]
	}
};

describe('the Sun at midnight: the Earth underfoot, the Moon and the Sun', () => {
	const scene = sunJson as unknown as Scene;
	const at = scene.observer.position;
	const pole: Vec3 = [0, Math.sin(LATITUDE), -Math.cos(LATITUDE)];
	const midnight = earthReading(analyzeScene(scene), at, pole);

	it('each body’s tide, from the scene’s own shells and distances: the Sun’s is 7.93e-14 s^-2', () => {
		expectTensor(source(midnight, 'the Earth underfoot').E, sun.earth.E, 1e-12);
		expectTensor(source(midnight, 'the Moon').E, sun.moon.E, 1e-12);
		expectTensor(source(midnight, 'the Sun').E, sun.sun.E, 1e-12);
		expectPrincipal(source(midnight, 'the Moon').E, sun.moon.principal, 1e-12);
		expectPrincipal(source(midnight, 'the Sun').E, sun.sun.principal, 1e-12);
	});

	it('the vertical stretch is 2 G M / R^3 for the scene’s Earth, which is 99.3% of the real one', () => {
		const earth = layeredBody(analyzeScene(scene), [
			'earth',
			'upper-mantle',
			'lower-mantle',
			'outer-core',
			'inner-core'
		]);
		expect(Math.abs(earth.mass / sun.earth.mass - 1)).toBeLessThan(1e-12);
		expect(Math.abs(earth.inertia / sun.earth.inertia - 1)).toBeLessThan(1e-12);
		expect(earth.mass / REAL_MASS.earth).toBeCloseTo(0.9931, 4);
		const stretch = -source(midnight, 'the Earth underfoot').E[1][1];
		// the camera stands two metres above the ground: 2 G M / r^3 there, and 2 G M / R^3 to a part in a million
		expect(Math.abs(stretch / ((2 * G * earth.mass) / at[1] ** 3) - 1)).toBeLessThan(1e-12);
		expect(Math.abs(stretch / sun.earth.surface - 1)).toBeLessThan(1e-6);
		expect(stretch).toBeCloseTo(3.0615e-6, 10);
		// the real Earth's would be 3.08e-6
		expect((2 * G * REAL_MASS.earth) / 6.371e6 ** 3).toBeCloseTo(3.083e-6, 9);
		const rows = principalRows(total(midnight), midnight.landmarks);
		expect(rows[0]).toMatchObject({ times: 1, direction: 'up-down' });
		expect(rows[1]).toMatchObject({ times: 2, direction: 'every horizontal direction' });
		expect(rows[1].value).toBeCloseTo(1.5307e-6, 10);
	});

	it('the Moon’s tide is 1.80e-13 s^-2 and the Sun’s 7.93e-14: 2.3 to 1, with the Sun at its standard mass', () => {
		const moon = size3(source(midnight, 'the Moon').E);
		const sunTide = size3(source(midnight, 'the Sun').E);
		expect(moon).toBeCloseTo(1.795e-13, 16);
		expect(sunTide).toBeCloseTo(7.927e-14, 17);
		expect(moon / sunTide).toBeCloseTo(2.2645, 4);
		// the scene's Sun is the standard solar mass, 1.98847e30 kg, to three parts in ten million
		expect(Math.abs(sun.sun.mass / SUN_MASS - 1)).toBeLessThan(1e-6);
		const text = [...midnight.notes, ...midnight.sources.map((s) => s.note ?? '')].join(' ');
		expect(text).toMatch(/the Moon’s is 2\.3 times the Sun’s\./);
		expect(source(midnight, 'the Sun').note).toMatch(
			/1\.99\u00a0×\u00a010³⁰\u00a0kg, the real Sun’s mass$/
		);
		// nothing says any longer that the Sun is short of mass
		expect(text).not.toMatch(/too small|71%|with the real Sun/);
		expect(midnight.rings.map((r) => r.label)).toEqual(['All of it', 'The Moon and the Sun alone']);
		// the second ring is the two of them, without the ground
		expectTensor(
			midnight.rings[1].E,
			sun.moon.E.map((v, k) => v + sun.sun.E[k]),
			1e-12
		);
	});

	it('the Earth’s turning gives a magnetic part of 5.1e-12 s^-2 at latitude 40', () => {
		const B = source(midnight, 'the Earth underfoot').B!;
		expectTensor(B, sun.earth.B, 1e-12);
		expectPrincipal(B, sun.earth.Bprincipal, 1e-12);
		expectTensor(totalMagnetic(midnight)!, sun.earth.B, 1e-12);
		// at the equator the same two terms give the paper's 4.8e-12
		expect(sun.earth.equator).toBeCloseTo(4.75e-12, 14);
	});

	it('through the day the Sun, at its standard mass, and the Moon turn, and their tides with them', () => {
		const later = earthReading(objectsAt(sun.afternoon.hours), at, pole);
		expectTensor(source(later, 'the Sun').E, sun.afternoon.sun, 1e-10);
		expectTensor(source(later, 'the Moon').E, sun.afternoon.moon, 1e-10);
		// the ground's part does not change
		expectTensor(source(later, 'the Earth underfoot').E, sun.earth.E, 1e-12);
		// at midnight the demo's own placing agrees with the scene file's, whose positions are rounded
		const now = earthReading(objectsAt(0), at, pole);
		expectTensor(source(now, 'the Moon').E, sun.moon.E, 1e-4);
		expectTensor(source(now, 'the Sun').E, sun.sun.E, 1e-4);
	});
});

// --- which way it turns ------------------------------------------------------------------------------------------------------
// scene = load_scene('scenes/which-way.scene.json'), at scene.observer.
// statics: sums over tidal.uniform_bodies(scene) of contrast * T(shape) (T as for the rooms): the drums with their
//   air whole, the shelf, the room, and the still pair as its balls' mass over the air's.
// pairs: binary.Pair(m, 0.44, 2 pi * rate), m = excessMass = (7850 - 1.2) * (4/3) pi 0.1^3 kg, rate -1 for the top
//   drum (clockwise as the camera sees it) and +1 for the middle one; x = observer - the drum's centre; t = 0.137 s:
//     newton      pair.newtonian_tidal(t, x)          wave      pair.wave_tidal(t, x)
//     steady      the mean of newtonian_tidal over a turn (64 instants)
//     turningMost the largest |principal value| of newtonian_tidal - steady over a turn (48 instants)
//     waveMost    the same of wave_tidal
//     B           gravitomagnetic.magnetic_point(M, offset, w x arm) + spin_dipole((2/5) M R^2 w, offset) for each
//                 ball, M = 7850 * (4/3) pi 0.1^3 kg
// turningMostTogether, waveMostTogether: the same largest values for the two pairs' sum.
// totalAtZero: tidal.scene_tidal_tensor(scene, scene.observer), the balls where the scene file has them.
const whichWay = {
	t: 0.137,
	excessMass: 32.87697655932743,
	statics: {
		'the three drums': {
			E: [
				1.3304730888297634e-9, 0.0, 0.0, 1.199762923995491e-9, 1.0733672951612072e-11,
				-2.530236012824552e-9
			],
			principal: [-2.5302669004422e-9, 1.1997938116131387e-9, 1.3304730888297634e-9]
		},
		'the shelf': {
			E: [
				1.6409291110121998e-10, 0.0, 0.0, 1.5386449161886744e-10, 1.8745567528483822e-11,
				-3.1795740272008517e-10
			],
			principal: [-3.1870099553740987e-10, 1.5460808443619211e-10, 1.6409291110121998e-10]
		},
		'the still pair': {
			E: [
				4.418722090861601e-11, 0.0, 0.0, 3.792153005211192e-11, -2.8836338223078808e-11,
				-8.21087509607279e-11
			],
			principal: [-8.867702800042919e-11, 4.418722090861601e-11, 4.44898070918132e-11]
		},
		'the empty room': {
			E: [
				9.965241279089641e-9, 0.0, 0.0, -3.6588435092830364e-8, -8.729553951640741e-9,
				2.6623193813740732e-8
			],
			principal: [-3.7771835626337665e-8, 9.965241279089641e-9, 2.7806594347248027e-8]
		}
	},
	pairs: {
		'the pair turning clockwise': {
			newton: [
				4.419013920707209e-11, 1.1004279756221559e-13, 1.6473702977227946e-13,
				3.731885197997073e-11, 2.930776067277101e-11, -8.150899118704283e-11
			],
			wave: [
				1.0378823640400764e-41, 6.647737407968268e-41, 1.5585251034236719e-41,
				-9.838081391475012e-42, -2.3064835262235862e-42, -5.407422489257519e-43
			],
			steady: [
				4.416471898613321e-11, 0.0, 0.0, 3.7327802407670536e-11, 2.932820803800467e-11,
				-8.14925213938038e-11
			],
			turningMost: 2.2359818454640937e-13,
			waveMost: 6.908834196930886e-41,
			B: [
				-2.6439790423593617e-20, 2.4394851425122895e-20, 1.8772470312400634e-20,
				-2.5883282347182338e-20, -2.95494968463004e-20, 5.2323072770775946e-20
			]
		},
		'the pair turning anticlockwise': {
			newton: [
				4.7841605835718566e-11, -1.696746817541531e-13, -2.8212932133822505e-15,
				4.7788464989100884e-11, 4.754427104090597e-13, -9.563007082481944e-11
			],
			wave: [
				1.0945248825923735e-41, -7.203162282935794e-41, -2.401054094311915e-43,
				-1.0945127213399143e-41, -3.64837573779969e-44, -1.2161252459332222e-46
			],
			steady: [
				4.7815821657622126e-11, 0.0, 0.0, 4.781424489222565e-11, 4.758713890186752e-13,
				-9.563006654984778e-11
			],
			turningMost: 1.716555259238764e-13,
			waveMost: 7.285884167388367e-41,
			B: [
				3.0177408744421836e-20, 3.1995076491814957e-20, 3.1852767072700615e-22,
				3.989876930796776e-20, 5.14084030479523e-22, -7.00761780523896e-20
			]
		}
	},
	turningMostTogether: 3.4144069640786177e-13,
	waveMostTogether: 1.4194718364318993e-40,
	totalAtZero: [
		1.1595633760441756e-8, 0.0, 0.0, -3.511151263374727e-8, -8.698967769213264e-9,
		2.3515878873306236e-8
	]
};

describe('which way it turns: the steady tide, the turning part and the wave', () => {
	const scene = drumsJson as unknown as Scene;
	const at = scene.observer.position;
	const prepared = prepareDrums('which-way', analyzeScene(scene), at);
	const reading = drumsReading(prepared, whichWay.t);

	it('what stands still, by source', () => {
		for (const [label, want] of Object.entries(whichWay.statics)) {
			expectTensor(source(reading, label).E, want.E);
			expectPrincipal(source(reading, label).E, want.principal);
		}
		expectTensor(total(drumsReading(prepared, 0)), whichWay.totalAtZero);
	});

	it('each turning pair: Newton’s field now, its average, its turning part and its wave', () => {
		expect(prepared.pairs.map((p) => p.label).sort()).toEqual(Object.keys(whichWay.pairs).sort());
		for (const pair of prepared.pairs) {
			const want = whichWay.pairs[pair.label as keyof typeof whichWay.pairs];
			// the delay of light changes the field by parts in 10^14 here
			expectTensor(source(reading, pair.label).E, want.newton);
			expectTensor(pair.steady, want.steady);
			expect(Math.abs(pair.turningMost / want.turningMost - 1)).toBeLessThan(1e-9);
			expect(Math.abs(pair.waveMost / want.waveMost - 1)).toBeLessThan(1e-9);
			expectTensor(source(reading, pair.label).B!, want.B);
		}
	});

	it('the three parts: 3.6e-8 s^-2 steady, 3.4e-13 turning, 1.4e-40 in the wave', () => {
		const [steady, turning, wave] = reading.parts!;
		expect(steady.now).toBeCloseTo(3.638e-8, 11);
		expect(Math.abs(turning.most! / whichWay.turningMostTogether - 1)).toBeLessThan(1e-9);
		expect(Math.abs(wave.most! / whichWay.waveMostTogether - 1)).toBeLessThan(1e-9);
		expect(turning.most!).toBeCloseTo(3.41e-13, 15);
		expect(wave.most!).toBeCloseTo(1.42e-40, 42);
		expect(turning.now).toBeLessThanOrEqual(turning.most! * (1 + 1e-9));
		// the wave now, of both pairs: the sum of the reference's two
		const pairs = Object.values(whichWay.pairs);
		const waveNow = pairs[0].wave.map((v, k) => v + pairs[1].wave[k]);
		expect(Math.abs(wave.now / Math.max(...eigenSizes(waveNow)) - 1)).toBeLessThan(1e-9);
		// the second ring is what turns, drawn to one scale through the turn
		expect(reading.rings[1]).toMatchObject({
			label: 'What turns, alone',
			scale: turning.most,
			most: true
		});
	});

	it('half a turn later the pairs look the same, and so does the reading', () => {
		const later = drumsReading(prepared, whichWay.t + 0.5);
		expectTensor(total(later), pack(total(reading)), 1e-12);
	});
});

/** The sizes of the principal values of a packed tensor. */
function eigenSizes(e: number[]): number[] {
	return principal([
		[e[0], e[1], e[2]],
		[e[1], e[3], e[4]],
		[e[2], e[4], e[5]]
	]).map((p) => Math.abs(p.value));
}

// --- a black hole ------------------------------------------------------------------------------------------------------------
// lens.tide(suns * M_sun, distance * G * suns * M_sun / c^2): 2 G M / d^3 for a hole of `suns` Suns, `distance` G M / c^2 away
const hole = [
	{
		suns: 10,
		distance: 40.0,
		tide: 12880.26224869496
	},
	{
		suns: 10,
		distance: 10.0,
		tide: 824336.7839164775
	},
	{
		suns: 10,
		distance: 5.0,
		tide: 6594694.27133182
	},
	{
		suns: 4300000.0,
		distance: 40.0,
		tide: 6.966069361111392e-8
	},
	{
		suns: 4300000.0,
		distance: 10.0,
		tide: 4.458284391111291e-6
	},
	{
		suns: 4300000.0,
		distance: 5.0,
		tide: 3.5666275128890326e-5
	}
];

describe('a black hole: the tide where the camera rests', () => {
	it('2 G M / r^3 along the line to the hole, as the reference’s lens.tide', () => {
		for (const { suns, distance, tide } of hole) {
			expect(Math.abs((2 * holeTide(suns, distance)) / tide - 1)).toBeLessThan(1e-12);
		}
		expect(HOLE_SUNS).toEqual({ stellar: 10, centre: 4.3e6 });
		expect(2 * holeTide(10, 40)).toBeCloseTo(12880.26, 2);
		expect(2 * holeTide(4.3e6, 40)).toBeCloseTo(6.966e-8, 11);
	});

	it('the reading: a stretch toward the hole, half as much squeeze across it, eight times at half the distance', () => {
		const b = (9 * Math.PI) / 180;
		const toward: Vec3 = [Math.cos(b), 0, Math.sin(b)];
		const reading = holeReading(toward, 40);
		const rows = principalRows(total(reading), reading.landmarks);
		expect(rows[0]).toMatchObject({ times: 1, direction: 'toward the hole' });
		expect(rows[0].value / hole[0].tide).toBeCloseTo(-1, 12);
		expect(rows[1]).toMatchObject({ times: 2 });
		expect(rows[1].value / hole[0].tide).toBeCloseTo(0.5, 12);
		const closer = holeReading(toward, 20);
		expect(size3(total(closer)) / size3(total(reading))).toBeCloseTo(8, 12);
		expect(totalMagnetic(reading)).toBeUndefined();
		// G M / c^2 for the Sun is 1.4766 km, as the demo's notes use
		expect((G * SUN_MASS) / C ** 2 / 1000).toBeCloseTo(1.4766, 3);
	});
});

// --- the Milky Way -------------------------------------------------------------------------------------------------------------
// The whole Galaxy's tide at the Sun, [xx, yy, zz, xz] in s^-2, from the reference's density galaxy.stellar_density
// (the three parts of GALAXY_TIDE together), by the integral described in tide-demos.ts, at its finest grid
// (16-point Gauss-Legendre panels in latitude, longitude and distance):
const GALAXY_TOTAL = [
	-7.823931530444188e-31, 4.797293671704729e-31, 3.538036352137058e-30, 2.68080236927378e-32
];
// numpy.linalg.eigvalsh of it
const GALAXY_PRINCIPAL = [-7.825594889297334e-31, 4.797293671704731e-31, 3.538202688022372e-30];

/** The reference's model (galaxy.py), ported here only to check the shipped constants: solar masses per kpc^3. */
const KPC = 3.085677581491367e19;
const R_SUN = 8.2;
const Z_SUN = 0.02;
function stellarDensity(x: number, y: number, z: number): number {
	const R = Math.hypot(x, y);
	const disc = (mass: number, length: number, height: number) =>
		(mass / (2 * Math.PI * length ** 2) / (2 * height)) *
		Math.exp(-R / length - Math.abs(z) / height);
	const m = Math.hypot(R, z / 0.6);
	const bulge = (1.5e10 / (8 * Math.PI * 0.6 * 0.5 ** 3)) * Math.exp(-m / 0.5);
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

describe('the Milky Way: the tide of the Galaxy’s stars at the Sun', () => {
	const reading = galaxyReading();

	it('the shipped constants are the reference’s integral, to seven figures', () => {
		const all = total(reading);
		const got = [all[0][0], all[1][1], all[2][2], all[0][2]];
		got.forEach((v, k) => expect(Math.abs(v / GALAXY_TOTAL[k] - 1)).toBeLessThan(1e-6));
		expect(all[0][1]).toBe(0);
		expect(all[1][2]).toBe(0);
		principal(all).forEach((p, k) =>
			expect(Math.abs(p.value / GALAXY_PRINCIPAL[k] - 1)).toBeLessThan(1e-6)
		);
		expect(Object.keys(GALAXY_TIDE)).toEqual(['the thin disc', 'the thick disc', 'the bulge']);
		// stretched toward the centre, squeezed through the disc: of order 1e-30 s^-2
		const rows = principalRows(all, reading.landmarks);
		expect(rows[0].value).toBeCloseTo(3.538e-30, 33);
		expect(rows[0].direction).toBe('through the disc');
		expect(rows[1].value).toBeCloseTo(-7.826e-31, 34);
		expect(rows[1].direction).toBe('toward the Galaxy’s centre');
		expect(rows[2].direction).toBe('along the Sun’s orbit');
	});

	it('its trace is 4 pi G times the density of stars at the Sun', () => {
		const all = total(reading);
		const rho = (stellarDensity(-R_SUN, 0, Z_SUN) * SUN_MASS) / KPC ** 3;
		expect(
			Math.abs((all[0][0] + all[1][1] + all[2][2]) / (4 * Math.PI * G * rho) - 1)
		).toBeLessThan(1e-6);
	});

	it('across the line to the centre it is the pull toward the centre over the distance, g / R', () => {
		// g_x = G * integral dOmega n_x * integral rho ds: the column of the picture's "waves", summed over the sky
		const lat = panels([0, 0.002, 0.006, 0.02, 0.05, 0.12, 0.3, 0.7, Math.PI / 2], 8);
		const lon = panels([0, 0.002, 0.006, 0.02, 0.05, 0.12, 0.3, 0.7, 1.2, 2, Math.PI], 8);
		const reach = [
			0, 0.02, 0.05, 0.1, 0.2, 0.4, 0.8, 1.5, 3, 5, 7, 8, 8.4, 9, 11, 14, 20, 30, 45, 70
		];
		let gx = 0;
		for (const sign of [-1, 1])
			lat.x.forEach((b0, i) => {
				const b = sign * b0;
				lon.x.forEach((l, j) => {
					const n = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
					// the plane of the disc, where the density has a corner, gets a panel edge of its own
					const cross = n[2] < 0 ? -Z_SUN / n[2] : Infinity;
					const edges = cross < 70 ? [...reach, cross].sort((p, q) => p - q) : reach;
					const along = panels(edges, 8);
					let column = 0;
					along.x.forEach((s, k) => {
						column += along.w[k] * stellarDensity(-R_SUN + s * n[0], s * n[1], Z_SUN + s * n[2]);
					});
					// both halves of the sky in longitude
					gx += 2 * lat.w[i] * Math.cos(b) * lon.w[j] * n[0] * column;
				});
			});
		const yy = (G * SUN_MASS * gx) / KPC ** 3 / R_SUN;
		expect(Math.abs(yy / total(reading)[1][1] - 1)).toBeLessThan(1e-4);
	});
});
