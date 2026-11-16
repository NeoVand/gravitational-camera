<script lang="ts">
	import { ArrowHorizontalIcon, Radar01Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import './figure.css';
	import { nearFieldBlur, slicePointSpread } from '../../engine/resolution';

	/** Signal-to-noise ratio as a power of ten, and the separation of the masses over their depth. */
	let decades = $state(6);
	let separation = $state(0.5);

	// lengths in units of the depth z; the picture spans -SPAN..SPAN
	const SPAN = 2.2;
	const X0 = 60;
	const X1 = 700;
	const px = (u: number) => X0 + ((u + SPAN) / (2 * SPAN)) * (X1 - X0);
	const samples = Array.from({ length: 321 }, (_, i) => -SPAN + (i / 320) * 2 * SPAN);

	const sources = $derived([-separation / 2, separation / 2]);
	// full width at half maximum of the reconstruction of one mass, in units of the depth
	const blur = $derived(nearFieldBlur(decades, 'slice'));
	/** Left end of the scale bar that shows the blur, drawn to the picture's scale. */
	const barStart = $derived(X1 - (blur / (2 * SPAN)) * (X1 - X0));
	const pointSpread = $derived(slicePointSpread(decades, 2 * SPAN + 1.6, 0.005));

	/** Tidal field recorded at the sensors from line masses at depth 1 (a 2-D slice). */
	const recorded = $derived.by(() => {
		const v = samples.map((u) =>
			sources.reduce((s, c) => s + (1 - (u - c) ** 2) / ((u - c) ** 2 + 1) ** 2, 0)
		);
		const peak = Math.max(...v);
		return v.map((q) => q / peak);
	});

	/**
	 * Best reconstruction (the Wiener filter): each pattern kept in proportion to
	 * how far it stands above the noise, which removes the fine ones.
	 */
	const rebuilt = $derived.by(() => {
		const v = samples.map((u) => sources.reduce((s, c) => s + pointSpread.at(u - c), 0));
		const peak = Math.max(...v);
		return v.map((q) => q / peak);
	});

	// told apart when the reconstruction dips between the two masses
	const resolved = $derived.by(() => {
		const between = sources.reduce((s, c) => s + pointSpread.at(c), 0);
		const at = sources.reduce((s, c) => s + pointSpread.at(sources[1] - c), 0);
		return between < 0.97 * at;
	});

	const path = (v: number[], base: number, height: number) =>
		v
			.map(
				(q, i) =>
					`${i ? 'L' : 'M'} ${px(samples[i]).toFixed(1)} ${(base - Math.max(q, -0.5) * height).toFixed(1)}`
			)
			.join(' ');

	const superscript = (n: number) =>
		String(n).replace(/[-0-9.]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹·'['-0123456789.'.indexOf(c)]);
</script>

<div class="gfig">
	<svg
		viewBox="0 0 720 420"
		role="img"
		aria-label="Two masses below a row of pixels: the smooth signal the pixels record, and the reconstruction allowed by the noise"
	>
		<!-- what the pixels record -->
		<text class="strong" x={X0} y="18">What the pixels record</text>
		<line class="hair" x1={X0} y1="130" x2={X1} y2="130" />
		<path
			d="{path(recorded, 130, 92)} L {X1} 130 L {X0} 130 Z"
			fill="var(--accent-2)"
			opacity="0.16"
		/>
		<path d={path(recorded, 130, 92)} stroke="var(--accent-2)" stroke-width="2.2" fill="none" />
		{#each Array.from({ length: 33 }, (_, i) => X0 + (i / 32) * (X1 - X0)) as sx (sx)}
			<rect x={sx - 3} y="134" width="6" height="6" fill="var(--text-faint)" />
		{/each}
		<text class="small faint" x={X1} y="156" text-anchor="end">row of pixels</text>

		<!-- the scene: two masses at depth z -->
		<line class="hair" x1={px(-SPAN)} y1="150" x2={px(-SPAN)} y2="214" stroke-dasharray="2 4" />
		<text class="small" x={px(-SPAN) + 8} y="186">depth z</text>
		{#each sources as c (c)}
			<line class="hair" x1={px(c)} y1="146" x2={px(c)} y2="372" stroke-dasharray="3 5" />
			<circle cx={px(c)} cy="214" r="8" fill="var(--accent)" />
		{/each}
		<text class="small" x={px(separation / 2) + 14} y="218">two masses</text>

		<!-- the reconstruction -->
		<text class="strong" x={X0} y="262">The sharpest reconstruction the noise allows</text>
		<line class="hair" x1={X0} y1="372" x2={X1} y2="372" />
		<path d={path(rebuilt, 372, 88)} stroke="var(--accent)" stroke-width="2.2" fill="none" />
		<!-- a scale bar for the blur, clear of the curve -->
		<path
			class="ink"
			stroke-width="1.6"
			d="M {barStart} 271 v 10 M {barStart} 276 H {X1} M {X1} 271 v 10"
		/>
		<text class="small" x={X1} y="262" text-anchor="end">
			blur at signal-to-noise 10{superscript(decades)}: {((blur * 180) / Math.PI).toFixed(1)}°
		</text>
	</svg>

	<div class="controls">
		<Slider
			id="nearfield-sensitivity"
			label="Sensitivity"
			icon={Radar01Icon}
			min={1}
			max={60}
			step={0.5}
			bind:value={decades}
			readout="signal-to-noise 10{superscript(decades)}"
			ends={['10', '10⁶⁰']}
		/>
		<Slider
			id="nearfield-separation"
			label="Separation"
			icon={ArrowHorizontalIcon}
			min={0.05}
			max={1.5}
			step={0.01}
			bind:value={separation}
			readout="{separation.toFixed(2)} × depth"
			ends={['touching', '1.5 × depth']}
		/>
	</div>
	<p class="note">
		<span class="readout">blur = {blur.toFixed(2)} × depth</span>
		<span class="verdict" style:color={resolved ? 'var(--good)' : 'var(--bad)'}>
			{resolved ? 'The two masses are told apart.' : 'The two masses merge into one.'}
		</span>
	</p>
</div>
