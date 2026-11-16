<script lang="ts">
	/**
	 * A vista demo of the whole sky: light on one side, gravitational waves on
	 * the other, and, if asked, a black hole in front of the camera bending
	 * both by exact Schwarzschild rays (lib/vistas).
	 */
	import type { Snippet } from 'svelte';
	import {
		BlackHoleIcon,
		GalaxyIcon,
		RulerIcon,
		SparklesIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import { posters } from '../demos/posters';
	import { blueshift, shadowRadius, sweepTable } from '../vistas/lens';
	import { primordial } from '../vistas/pair';
	import type { SkyView as View, Vec3 } from '../vistas/sky';
	import DemoShell from './DemoShell.svelte';
	import SkyView from './SkyView.svelte';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import Tex from './Tex.svelte';

	interface Props {
		title: string;
		slug: string;
		/** A black hole in front of the camera, toward this galactic longitude and latitude (degrees). */
		hole?: { l: number; b: number; distance: number };
		startRight?: 'waves' | 'primordial';
		look: { yaw: number; pitch: number; fov: number };
		intro: Snippet;
		physics: Snippet;
	}

	let { title, slug, hole, startRight = 'waves', look, intro, physics }: Props = $props();

	const DEG = Math.PI / 180;
	// the demo starts from these and the visitor takes it from there
	// svelte-ignore state_referenced_locally
	const START: View = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: look.fov * DEG };
	let view: View = $state({ ...START });
	let divider = $state(0.5);
	// svelte-ignore state_referenced_locally
	let right: 'waves' | 'primordial' = $state(startRight);
	// the distance to the hole, in units of G M / c^2, on a logarithmic slider
	// svelte-ignore state_referenced_locally
	let logDistance = $state(Math.log10(hole?.distance ?? 40));
	let skyView: SkyView | undefined = $state();

	const distance = $derived(10 ** logDistance);
	const direction = $derived.by((): Vec3 => {
		const l = (hole?.l ?? 0) * DEG;
		const b = (hole?.b ?? 0) * DEG;
		return [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
	});
	const shadow = $derived(hole ? shadowRadius(distance) : 0);
	const table = $derived(hole ? sweepTable(distance) : undefined);
	const temperature = $derived(primordial.temperature * (hole ? blueshift(distance) : 1));
	const range = $derived(primordial.beta * temperature * 1.05);
	const dipole = primordial.dipole as Vec3;

	/** Distances in kilometres for a hole of ten solar masses and for the one at the Galaxy's centre. */
	const GM_C2_SUN_KM = 1.4766;
	const stellarKm = $derived(distance * 10 * GM_C2_SUN_KM);
	const centreAu = $derived((distance * 4.3e6 * GM_C2_SUN_KM) / 1.496e8);
</script>

<DemoShell
	{title}
	{physics}
	onreset={() => (view = { ...START })}
	onsave={() => skyView?.snapshot() ?? Promise.resolve(null)}
>
	{#snippet stage()}
		<SkyView
			bind:this={skyView}
			bind:view
			bind:divider
			poster={posters[slug]}
			{right}
			hole={hole && table ? { direction, shadow, table } : undefined}
			{temperature}
			{dipole}
			beta={primordial.beta}
			{range}
			rightIcon={right === 'waves' ? WavesIcon : SparklesIcon}
			rightLabel={right === 'waves'
				? 'Gravity · millihertz waves'
				: `Gravity · primordial, ${temperature.toFixed(3)} K`}
		/>
	{/snippet}

	{#snippet controls()}
		<Group title="View">
			{#if !hole}
				<Segmented
					label="What the gravity side shows"
					options={[
						{ value: 'waves', label: 'The Galaxy', icon: GalaxyIcon },
						{ value: 'primordial', label: 'The first light', icon: SparklesIcon }
					]}
					bind:value={right}
				/>
			{/if}
			<Slider
				id="fov"
				label="Field of view"
				icon={RulerIcon}
				min={2}
				max={110}
				step={1}
				bind:value={() => view.fov / DEG, (v) => (view = { ...view, fov: v * DEG })}
				readout="{(view.fov / DEG).toFixed(0)}°"
				ends={['narrow', 'wide']}
			/>
		</Group>
		{#if hole}
			<Group title="Black hole">
				<Slider
					id="distance"
					label="Distance"
					icon={BlackHoleIcon}
					min={0.7}
					max={2.6}
					step={0.01}
					bind:value={logDistance}
					readout="{distance.toFixed(distance < 10 ? 1 : 0)} GM/c² · shadow {(shadow / DEG).toFixed(
						1
					)}°"
					ends={['close', 'far']}
				/>
			</Group>
		{/if}
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		{#if hole}
			<dl>
				<div>
					<dt>Angular radius of the shadow</dt>
					<dd><Tex math={`${(shadow / DEG).toFixed(2)}^\\circ`} /></dd>
				</div>
				<div>
					<dt>Temperature of the first light, seen from here</dt>
					<dd><Tex math={`${temperature.toFixed(4)}\\,\\mathrm{K}`} /></dd>
				</div>
				<div>
					<dt>This distance, for a hole of ten Suns · for the one at the Galaxy’s centre</dt>
					<dd>
						<Tex
							math={`${stellarKm.toFixed(0)}\\,\\mathrm{km}\\ \\cdot\\ ${centreAu.toFixed(1)}\\,\\mathrm{AU}`}
						/>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</DemoShell>
