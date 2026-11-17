<script lang="ts">
	import { DashboardSpeed01Icon, WaveIcon, Add01Icon } from '@hugeicons/core-free-icons';
	import { AtomIcon, Orbit01Icon, StarIcon, SparklesIcon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import BeyondEinstein from '#lib/ui/BeyondEinstein.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Toggle from '#lib/ui/controls/Toggle.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import type { Vec3 } from '#lib/pixel/complex.js';
	import {
		invertOneReading,
		metricWaveReading,
		waveOf,
		type Inversion
	} from '#lib/pixel/beyond.js';

	type Theory = 'einstein' | 'graviton' | 'scalar' | 'free';
	const K: Vec3 = [0.6, 0, 0.8];
	const OTHER: Vec3 = [-0.48, 0.6, 0.64];
	const KEYS = ['plus', 'cross', 'x', 'y', 'b', 'l'] as const;
	const LABELS = ['Plus', 'Cross', 'Vector x', 'Vector y', 'Breathing', 'Longitudinal'];

	let theory = $state<Theory>('einstein');
	let pol: Inversion['pol'] = $state({ plus: 0.8, cross: 0.4, x: 0, y: 0, b: 0, l: 0 });
	let speed = $state(1);
	let second = $state(false);

	/** A preset: the polarizations and speed of one kind of wave. */
	function choose(t: Theory) {
		theory = t;
		if (t === 'einstein') {
			pol = { plus: 0.8, cross: 0.4, x: 0, y: 0, b: 0, l: 0 };
			speed = 1;
		} else if (t === 'graviton') {
			const n = 0.8;
			pol = { plus: 0.3, cross: 0.2, x: 0, y: 0, b: 0.5, l: -2 * (1 - n * n) * 0.5 };
			speed = 1 / n;
		} else if (t === 'scalar') {
			const n = 0.8;
			pol = { plus: 0, cross: 0, x: 0, y: 0, b: 0.7, l: (1 - n * n) * 0.7 };
			speed = 1 / n;
		}
	}

	const reading = $derived.by(() => {
		const w = waveOf(pol, 1 / speed, K);
		const one = metricWaveReading(w.eps, w.n, w.k, 1, 0);
		if (!second) return one;
		const v = waveOf({ plus: 0.5, cross: -0.3, x: 0, y: 0, b: 0, l: 0 }, 1, OTHER);
		const two = metricWaveReading(v.eps, v.n, v.k, 1, 0.9);
		return {
			E: one.E.map((r, i) => r.map((x, j) => x + two.E[i][j])),
			B: one.B.map((r, i) => r.map((x, j) => x + two.B[i][j]))
		};
	});
	const read = $derived(invertOneReading(reading.E, reading.B));
	const ratio = $derived(
		Math.abs(read.pol.b) > 1e-9 * Math.hypot(...KEYS.map((k) => read.pol[k]))
			? read.pol.l / read.pol.b
			: NaN
	);
	const n = $derived(read.n);
	const verdict = $derived.by(() => {
		if (read.residual > 1e-6) return 'not one wave of the metric';
		const big = Math.hypot(...KEYS.map((k) => read.pol[k]));
		const scalarFree = Math.hypot(read.pol.x, read.pol.y, read.pol.b, read.pol.l) < 1e-6 * big;
		if (Math.abs(n - 1) < 1e-6 && scalarFree) return 'what general relativity allows';
		if (Number.isFinite(ratio) && Math.abs(ratio + 2 * (1 - n * n)) < 1e-6)
			return 'a massive graviton’s helicity-zero wave';
		if (Number.isFinite(ratio) && Math.abs(ratio - (1 - n * n)) < 1e-6)
			return 'a massive scalar’s wave';
		return 'a wave no theory here predicts';
	});

	function reset() {
		choose('einstein');
		second = false;
	}
</script>

<svelte:head>
	<title>Beyond Einstein · Gravitational Camera</title>
	<meta
		name="description"
		content="One reading of one gravitational pixel gives a wave's direction, its speed and all six polarizations a theory of gravity allows, and checks that they belong to one wave."
	/>
</svelte:head>

<DemoShell title="Beyond Einstein" onreset={reset}>
	{#snippet stage()}
		<BeyondEinstein E={reading.E} B={reading.B} set={pol} {read} {speed} />
	{/snippet}

	{#snippet controls()}
		<Group title="The wave">
			<Segmented
				label="Theory"
				options={[
					{ value: 'einstein', label: 'Einstein', icon: StarIcon },
					{ value: 'graviton', label: 'Massive', icon: AtomIcon },
					{ value: 'scalar', label: 'Scalar', icon: Orbit01Icon },
					{ value: 'free', label: 'Free', icon: SparklesIcon }
				]}
				bind:value={() => theory, choose}
			/>
			<Slider
				id="speed"
				label="Phase speed"
				icon={DashboardSpeed01Icon}
				min={0.7}
				max={1.5}
				step={0.005}
				bind:value={() => speed, (v) => ((speed = v), (theory = 'free'))}
				readout="{speed.toFixed(3)} c"
				ends={['slower', 'faster than light']}
			/>
			{#each KEYS as k, i (k)}
				<Slider
					id="pol-{k}"
					label={LABELS[i]}
					icon={WaveIcon}
					min={-1}
					max={1}
					step={0.01}
					bind:value={() => pol[k], (v) => ((pol = { ...pol, [k]: v }), (theory = 'free'))}
					readout={pol[k].toFixed(2)}
				/>
			{/each}
		</Group>
		<Group title="The reading">
			<Toggle
				icon={Add01Icon}
				label="A second wave"
				bind:checked={second}
				hint="Add a wave from another direction"
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			Einstein’s gravity has waves of two polarizations, plus and cross, that travel at the speed of
			light. Other theories allow up to six, and other speeds. One pixel tells them apart from
			<strong>one reading</strong>.
		</p>
		<p>
			For any wave of the metric, whatever theory makes it, the geometry alone ties the two halves
			of the reading together: <Tex
				math={'\\mathcal{B} = (c/v_p)\\,[\\hat k]_\\times\\mathcal{E}'}
			/>. So the reading gives the direction of the wave, its speed, and all six polarizations, and
			five numbers left over must agree, or the reading was not one wave. Add a second wave and
			watch them fail.
		</p>
		<dl>
			<div>
				<dt>The reading says</dt>
				<dd>{verdict}</dd>
			</div>
			{#if Number.isFinite(ratio)}
				<div>
					<dt>Longitudinal over breathing · massive graviton · scalar</dt>
					<dd>
						<Tex
							math={`${ratio.toFixed(3)} \\cdot ${(-2 * (1 - n * n)).toFixed(3)} \\cdot ${(1 - n * n).toFixed(3)}`}
						/>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="fine">
			The curvature is computed in closed form from the metric of the wave, as in the paper’s
			reference implementation, which checks it against finite differences. A massive graviton and a
			massive scalar differ even in sign. Testing general relativity this way at the level of
			present bounds would need extraordinary signal-to-noise ratios; what is new is that it needs
			only one point.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>One identity, any theory</h4>
		<p>
			A plane wave of the metric, <Tex
				math={'h_{ab} = \\epsilon_{ab}\\cos(\\omega t - n\\omega\\hat k\\cdot\\mathbf x/c)'}
			/>, of any polarization and phase speed <Tex math={'c/n'} />, has curvature whose electric and
			magnetic parts obey, by the second Bianchi identity alone,
		</p>
		<Tex display math={'\\mathcal{B}_{ij} = n\\,\\epsilon_{ipq}\\hat k_p\\,\\mathcal{E}_{qj} .'} />
		<p>
			So <Tex math={'\\hat k'} /> is the null vector of <Tex math={'\\mathcal{B}'} /> from the left,
			<Tex math={'n'} /> is the ratio of the two halves, and <Tex math={'\\mathcal{E}'} /> in the wave’s
			frame holds the six polarizations: plus and cross, two vector modes, breathing and longitudinal.
			Of the fourteen numbers read, five remain as checks.
		</p>
		<p>
			For a Fierz–Pauli massive graviton the helicity-zero wave has
			<Tex math={'\\mathcal{E}_l/\\mathcal{E}_b = -2(1 - n^2)'} />; for a massive scalar,
			<Tex math={'+(1 - n^2)'} />.
		</p>
	{/snippet}
</DemoShell>
