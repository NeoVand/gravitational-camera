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
		Image01Icon,
		Layers01Icon,
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
	import TidalReading from './TidalReading.svelte';
	import FieldLegend from './FieldLegend.svelte';
	import FieldLookControls from './FieldLookControls.svelte';
	import FieldOverlay from './FieldOverlay.svelte';
	import { fieldReference } from '../pixel/field-view';
	import { galaxySlices, holeSlices, logSlices } from '../pixel/slices';
	import { galaxyReading, holeReading } from '../pixel/tide-demos';
	import { galaxyField, holeField, holeHollow } from '../vistas/field';
	import { skyBasis } from '../vistas/sky';

	interface Props {
		title: string;
		slug: string;
		/** A black hole in front of the camera, toward this galactic longitude and latitude (degrees). */
		hole?: { l: number; b: number; distance: number };
		startRight?: 'waves' | 'primordial';
		look: { yaw: number; pitch: number; fov: number };
		intro: Snippet;
		/** The page in plain words, for a reader new to it: DemoShell's first tab. */
		plain?: Snippet;
		/** What there is to do on the page, in plain words: the head of DemoShell's Help tab. */
		help?: Snippet;
		physics: Snippet;
	}

	let {
		title,
		slug,
		hole,
		startRight = 'waves',
		look,
		intro,
		plain,
		help,
		physics: pagePhysics
	}: Props = $props();

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
	/** What the gravity side shows: the picture, or the tidal field about the camera. */
	let display = $state<'image' | 'field'>('image');
	/**
	 * The field is drawn at the points this far from the camera, on a logarithmic slider: in G M / c² about a hole
	 * (it starts on the sphere that passes through the hole), in kpc in the Galaxy (from 10 pc to 30 kpc).
	 */
	// svelte-ignore state_referenced_locally
	let logReach = $state(hole ? Math.log10(hole.distance) : Math.log10(4));
	const reach = $derived(10 ** logReach);
	let innerWidth = $state(1600);
	let innerHeight = $state(1000);

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
	// the tide where the camera is: the hole's, at this distance, or the Galaxy's at the Sun
	const tide = $derived(hole ? holeReading(direction, distance) : galaxyReading());
	// the tide at the points of a sphere about the camera, for the field view
	const tensorAt = $derived(
		hole
			? (n: Vec3) => holeField(direction, distance, reach, n)
			: (n: Vec3) => galaxyField(reach, n)
	);
	// inside the horizon there is none: the directions in which the sphere's point lies there
	const hollow = $derived(hole ? holeHollow(direction, distance, reach) : undefined);
	const camera = $derived({ ...skyBasis(view), tanY: Math.tan(view.fov / 2) });
	const fieldScale = $derived(
		fieldReference(tensorAt, { ...camera, tanX: (camera.tanY * innerWidth) / innerHeight })
	);
	const lengthText = (v: number) =>
		hole
			? `${v.toFixed(v < 10 ? 1 : 0)} GM/c²`
			: v < 1
				? `${(v * 1000).toFixed(0)} pc`
				: `${v.toFixed(v < 10 ? 1 : 0)} kpc`;
	// where the sphere of points meets something
	const slices = $derived(
		logSlices(hole ? holeSlices(distance) : galaxySlices(), hole ? -0.5 : -2, hole ? 2.9 : 1.48)
	);
	const sliceMarks = $derived(
		slices.marks.map((m) => ({ at: m.position, label: `${m.label}, ${lengthText(m.at)}` }))
	);
	const reachText = $derived(
		hole
			? `${reach.toFixed(reach < 10 ? 1 : 0)} GM/c²`
			: reach < 1
				? `${(reach * 1000).toFixed(0)} pc`
				: `${reach.toFixed(reach < 10 ? 1 : 0)} kpc`
	);

	/** Distances in kilometres for a hole of ten solar masses and for the one at the Galaxy's centre. */
	const GM_C2_SUN_KM = 1.4766;
	const stellarKm = $derived(distance * 10 * GM_C2_SUN_KM);
	const centreAu = $derived((distance * 4.3e6 * GM_C2_SUN_KM) / 1.496e8);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#snippet fieldKey()}
	<FieldLegend
		where="on a sphere {reachText} about {hole ? 'the camera' : 'the Sun'}"
		reference={fieldScale}
		full
	/>
{/snippet}

{#snippet status()}
	<FieldLegend
		where="on a sphere {reachText} about {hole ? 'the camera' : 'the Sun'}"
		reference={fieldScale}
	/>
{/snippet}

<DemoShell
	{plain}
	{help}
	{title}
	legend={display === 'field' ? fieldKey : undefined}
	foot={display === 'field' ? status : undefined}
	onreset={() => (view = { ...START })}
	onsave={() => skyView?.snapshot() ?? Promise.resolve(null)}
>
	{#snippet physics()}
		{@render pagePhysics()}
		<h4>The tidal field at the camera</h4>
		<TidalReading reading={tide} />
	{/snippet}
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
			rightIcon={display === 'field' ? Layers01Icon : right === 'waves' ? WavesIcon : SparklesIcon}
			rightLabel={display === 'field'
				? 'Gravity · tidal field'
				: right === 'waves'
					? 'Gravity · millihertz waves'
					: `Gravity · primordial, ${temperature.toFixed(3)} K`}
		>
			{#snippet overlay()}
				{#if display === 'field'}
					<FieldOverlay
						{tensorAt}
						{camera}
						reference={fieldScale}
						split={divider}
						beneath={hole || right === 'primordial' ? 0.75 : 0.1}
						{hollow}
					/>
				{/if}
			{/snippet}
		</SkyView>
	{/snippet}

	{#snippet controls()}
		<Group title="View">
			<Segmented
				label="What the gravity side shows"
				options={[
					{ value: 'image', label: 'Image', icon: Image01Icon },
					{ value: 'field', label: 'Tidal field', icon: Layers01Icon }
				]}
				bind:value={display}
			/>
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
		{#if display === 'field'}
			<FieldLookControls reference={fieldScale}>
				<Slider
					id="slice"
					label="Slice"
					icon={Layers01Icon}
					min={0}
					max={slices.scale.last}
					step={0.005}
					bind:value={
						() => slices.scale.toPosition(logReach), (p) => (logReach = slices.scale.toValue(p))
					}
					readout="{reachText} away"
					ends={['near', 'far']}
					marks={sliceMarks}
				/>
			</FieldLookControls>
		{/if}
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
		<p class="fine">
			“Tidal field” shows the field itself on the gravity side: the tidal tensor at the points of a
			sphere about {hole ? 'the camera' : 'the Sun'}, as far away as the slider sets. The colour is
			the direction of the stretch and the fine strokes lie along it; the ticks on the slider mark
			where the sphere meets something.
			{#if hole}
				The tensor is what observers held at rest outside a hole of ten Suns read, exactly. Points
				are placed as in flat space, and inside the horizon there is none.
			{:else}
				It is the field of the stars of the Galaxy’s model only: no gas and no dark matter.
			{/if}
			What one pixel reads at the camera is under “Physics”.
		</p>
	{/snippet}
</DemoShell>
