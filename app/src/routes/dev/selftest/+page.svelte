<script lang="ts">
	/**
	 * Runs the shaders on this device's GPU and compares them with the Python
	 * reference implementation. Single-precision arithmetic on the GPU sets the
	 * tolerances; the double-precision physics is tested separately.
	 */
	import fixture from '../../../../../reference/fixtures/sun-at-midnight.json';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import {
		Engine,
		MODE_LIGHT,
		MODE_THERMAL,
		analyzeScene,
		packPrims,
		referenceRadiance,
		type Scene
	} from '#lib/engine/index.js';
	import { scene, sunDirection } from '#lib/demos/sun-at-midnight.js';

	interface Row {
		name: string;
		pass: boolean;
		detail: string;
	}

	let rows: Row[] = $state([]);
	let summary = $state('running');

	type RefRay = { label: string; direction: number[]; number_radiance: number };
	const rays = fixture.rays as RefRay[];

	async function run(canvas: HTMLCanvasElement): Promise<Row[]> {
		const out: Row[] = [];
		const engine = await Engine.create(canvas);
		const objects = analyzeScene(scene as Scene);
		const observer = scene.observer.position;
		const nRef = referenceRadiance(objects, observer);
		engine.setPrims(packPrims(objects, observer, nRef, 0));

		// 1. the thermal line integral, ray by ray
		const dirs = new Float32Array(rays.length * 3);
		rays.forEach((r, i) => dirs.set(r.direction, i * 3));
		const gpu = await engine.probe(dirs);
		let worst = { label: '', error: 0 };
		let worstGrazing = { label: '', error: 0 };
		let failures = 0;
		rays.forEach((r, i) => {
			const value = gpu[i * 4 + 3] * nRef;
			const grazing = /limb|horizon/.test(r.label);
			// errors are judged against the larger of the ray's value and 0.1% of the scene scale
			const error = Math.abs(value - r.number_radiance) / Math.max(r.number_radiance, 1e-3 * nRef);
			const limit = grazing ? 5e-2 : 2e-3;
			if (error > limit) failures += 1;
			const slot = grazing ? worstGrazing : worst;
			if (error > slot.error) {
				slot.label = r.label;
				slot.error = error;
			}
		});
		out.push({
			name: `Thermal line integral, ${rays.length} rays against the reference`,
			pass: failures === 0,
			detail:
				`${failures} outside tolerance; worst ordinary ray ${worst.error.toExponential(1)} (${worst.label}), ` +
				`worst grazing ray ${worstGrazing.error.toExponential(1)} (${worstGrazing.label})`
		});

		// 2. a whole frame: both halves drawn, and different from one another
		const W = 96;
		const H = 54;
		const frame = await engine.readFrame(
			{
				view: { yaw: 0.28, pitch: -0.54, fov: 1.33 },
				divider: 0.5,
				left: MODE_LIGHT,
				right: MODE_THERMAL,
				exposure: 1.2,
				glarePixels: 0,
				sunDirection: sunDirection(0),
				timeSeconds: 0
			},
			W,
			H
		);
		const mean = (x0: number, x1: number) => {
			let s = 0;
			let n = 0;
			for (let y = H / 2; y < H; y++)
				for (let x = x0; x < x1; x++) {
					const k = (y * W + x) * 4;
					s += frame[k] + frame[k + 1] + frame[k + 2];
					n += 3;
				}
			return s / n;
		};
		const light = mean(0, W / 2);
		const thermal = mean(W / 2, W);
		out.push({
			name: 'Frame: night ground is dark in light, Earth glows in gravity',
			pass: light < 60 && thermal > 60 && thermal > 2 * light,
			detail: `mean level below the horizon: light ${light.toFixed(1)}, gravity ${thermal.toFixed(1)} (0–255)`
		});

		engine.destroy();
		return out;
	}

	function mount(canvas: HTMLCanvasElement) {
		run(canvas)
			.then((r) => {
				rows = r;
				summary = r.every((x) => x.pass) ? `all ${r.length} passed` : 'FAILED';
			})
			.catch((e: unknown) => {
				summary = 'FAILED';
				rows = [
					{ name: 'Engine', pass: false, detail: e instanceof Error ? e.message : String(e) }
				];
			});
	}
</script>

<svelte:head>
	<title>Self-test · The Gravitational Camera</title>
</svelte:head>

<SiteHeader />

<main>
	<h1>Engine self-test</h1>
	<p>
		Compares what this device's GPU computes with the independent Python reference. Result:
		<strong id="summary">{summary}</strong>
	</p>
	<table>
		<tbody>
			{#each rows as row (row.name)}
				<tr>
					<td class={{ pass: row.pass, fail: !row.pass }}>{row.pass ? 'pass' : 'FAIL'}</td>
					<td>{row.name}<br /><small>{row.detail}</small></td>
				</tr>
			{/each}
		</tbody>
	</table>
	<canvas {@attach mount} width="8" height="8" hidden></canvas>
</main>

<style>
	main {
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.2rem var(--gutter) 4rem;
	}

	h1 {
		font: 400 2.2rem/1.1 var(--font-serif);
		margin: 3rem 0 1rem;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	td {
		padding: 0.7rem 1rem 0.7rem 0;
		border-top: 1px solid var(--line);
		vertical-align: top;
	}

	small {
		color: var(--text-dim);
		font-family: var(--font-mono);
		font-size: 0.74rem;
	}

	.pass {
		color: var(--good);
	}

	.fail {
		color: var(--bad);
		font-weight: 600;
	}
</style>
