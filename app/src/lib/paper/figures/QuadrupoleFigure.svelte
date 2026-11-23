<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { DashboardSpeed01Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import './figure.css';

	/** Speed of the moving parts, as log10 of metres per second. */
	let logSpeed = $state(1.5);
	let t = $state(0.6);

	function animate() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		const start = performance.now();
		const tick = (now: number) => {
			t = (now - start) / 1000;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}

	// power per solid angle from a rotating pair, against the angle from the axis
	const CX = 180;
	const CY = 172;
	const RMAX = 128;
	const pattern = (theta: number) => (1 + 6 * Math.cos(theta) ** 2 + Math.cos(theta) ** 4) / 8;
	const lobe = Array.from({ length: 181 }, (_, i) => {
		const theta = (i / 180) * 2 * Math.PI;
		const r = RMAX * pattern(theta);
		return `${i ? 'L' : 'M'} ${(CX + r * Math.sin(theta)).toFixed(1)} ${(CY - r * Math.cos(theta)).toFixed(1)}`;
	}).join(' ');

	/**
	 * The mark for circular polarization: a clockwise arc with a gap, ending in an
	 * arrowhead that follows the circle (the way the pair turns, seen from above).
	 */
	const turning = (() => {
		const cx = CX + 50;
		const cy = 44;
		const r = 10;
		const at = (deg: number, radius = r) => {
			const a = (deg * Math.PI) / 180;
			return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)].map((v) => v.toFixed(2));
		};
		// from just above the right-hand side, clockwise round to the top left
		const start = -25;
		const base = start + 255;
		const tip = base + 46;
		const [sx, sy] = at(start);
		const [bx, by] = at(base + 4);
		return {
			arc: `M ${sx} ${sy} A ${r} ${r} 0 1 1 ${bx} ${by}`,
			head: `M ${at(tip).join(' ')} L ${at(base, r + 4.6).join(' ')} L ${at(base, r - 4.6).join(' ')} Z`
		};
	})();

	// the two masses, circling in the horizontal plane, seen slightly from above
	const orbit = $derived({ x: 26 * Math.cos(t * 2.4), y: 8 * Math.sin(t * 2.4) });

	const C = 299792458;
	const speed = $derived(10 ** logSpeed);
	const ratio = $derived(((Math.PI / 2) * C) / speed); // wavelength / size
	const WAVE = 300; // drawn length of one wavelength
	const sizePx = $derived(Math.max(1.2, WAVE / ratio));

	/** A number as a mantissa and a power of ten, the power to be set as a superscript in the drawing. */
	const sci = (v: number) => {
		if (v < 1000) return { mantissa: v.toFixed(v < 10 ? 1 : 0), power: undefined };
		const e = Math.floor(Math.log10(v));
		return { mantissa: `${(v / 10 ** e).toFixed(1)} × 10`, power: e };
	};
	const size = $derived(sci(ratio));
	const speedLabel = $derived(
		speed < 1000
			? `${speed.toFixed(speed < 10 ? 1 : 0)} m/s`
			: speed < C / 100
				? `${(speed / 1000).toFixed(speed < 1e4 ? 1 : 0)} km/s`
				: `${((speed / C) * 100).toFixed(0)}% of light speed`
	);
	/**
	 * On a phone the two panels are stacked, the wavelength's under the pattern's, so that the drawing is shown at
	 * about its own size and its words are read at the size they are set; side by side it would be halved.
	 */
	const phone = new MediaQuery('max-width: 560px', false);
	const PHONE_SHIFT = { x: -360, y: 236 };
	const viewBox = $derived(phone.current ? '28 -2 310 608' : '30 -2 720 351');

	const wave = Array.from({ length: 121 }, (_, i) => {
		const u = i / 120;
		return `${i ? 'L' : 'M'} ${(390 + u * WAVE).toFixed(1)} ${(150 - 30 * Math.sin(u * 2 * Math.PI)).toFixed(1)}`;
	}).join(' ');
</script>

<div class="gfig">
	<svg
		{viewBox}
		role="img"
		aria-label="Radiation pattern of a rotating pair of masses, and the wavelength compared with the size of the source"
		{@attach animate}
	>
		<defs>
			<marker
				id="quad-arrow"
				viewBox="0 0 10 10"
				refX="7"
				refY="5"
				markerWidth="6.5"
				markerHeight="6.5"
				orient="auto-start-reverse"
			>
				<path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text)" />
			</marker>
		</defs>

		<!-- radiation pattern -->
		<line class="hair" x1={CX} y1="24" x2={CX} y2="320" stroke-dasharray="3 5" />
		<path d={lobe} fill="var(--accent)" opacity="0.14" />
		<path d={lobe} stroke="var(--accent)" stroke-width="2.2" fill="none" />
		<ellipse class="hair" cx={CX} cy={CY} rx="26" ry="8" />
		<circle cx={CX + orbit.x} cy={CY + orbit.y} r="5" fill="var(--text)" />
		<circle cx={CX - orbit.x} cy={CY - orbit.y} r="5" fill="var(--text)" />

		<!-- polarization glyphs: a turning arrow for circular, a double arrow for linear -->
		<path d={turning.arc} class="ink" stroke-width="1.7" stroke-linecap="round" />
		<path d={turning.head} fill="var(--text)" stroke="var(--text)" stroke-width="0.6" />
		<text class="small" x={CX + 70} y="41">strongest,</text>
		<text class="small" x={CX + 70} y="56">circular</text>
		<line
			class="ink"
			x1={CX + 44}
			y1={CY - 14}
			x2={CX + 44}
			y2={CY + 14}
			stroke-width="1.7"
			marker-start="url(#quad-arrow)"
			marker-end="url(#quad-arrow)"
		/>
		<text class="small" x={CX + 56} y={CY - 2}>8× weaker,</text>
		<text class="small" x={CX + 56} y={CY + 13}>linear</text>
		<text class="small faint" x={CX - 10} y="20" text-anchor="end">axis of rotation</text>
		<text class="strong" x={CX} y="336" text-anchor="middle">Power sent in each direction</text>

		<!-- wavelength against size -->
		<g transform={phone.current ? `translate(${PHONE_SHIFT.x} ${PHONE_SHIFT.y})` : undefined}>
			<path d={wave} stroke="var(--accent-2)" stroke-width="2.2" fill="none" />
			<line class="hair" x1="390" y1="196" x2="690" y2="196" />
			<path class="ink" d="M 390 190 v 12 M 690 190 v 12" stroke-width="1.4" />
			<text class="small" x="540" y="216" text-anchor="middle">one wavelength</text>
			<rect x={390} y="232" width={sizePx} height="12" fill="var(--text)" />
			<!-- beside the source, however wide it grows (at most 127, leaving the words inside the wavelength's
			     span); on a phone under it, where the column is narrower -->
			<text class="small" x={phone.current ? 390 : 390 + sizePx + 10} y={phone.current ? 262 : 243}
				>the source, to the same scale</text
			>
			{#if phone.current}
				<!-- two lines: in one the words would be wider than the column -->
				<text class="strong" x="540" y="296" text-anchor="middle">
					wavelength = {size.mantissa}<tspan dy="-6" font-size="11">{size.power ?? ''}</tspan>
				</text>
				<text class="strong" x="540" y="315" text-anchor="middle">× the size of the source</text>
			{:else}
				<text class="strong" x="540" y="282" text-anchor="middle">
					wavelength = {size.mantissa}<tspan dy="-6" font-size="11">{size.power ?? ''}</tspan><tspan
						dy="6">&nbsp;× the size of the source</tspan
					>
				</text>
			{/if}
			<text class="small" x="540" y={phone.current ? 335 : 302} text-anchor="middle">
				for moving parts at {speedLabel}
			</text>
			<text class="strong" x="540" y={phone.current ? 362 : 336} text-anchor="middle"
				>Wavelength against size</text
			>
		</g>
	</svg>

	<div class="controls single">
		<Slider
			id="quadrupole-speed"
			label="Speed of the moving parts"
			icon={DashboardSpeed01Icon}
			min={0}
			max={8.3}
			step={0.05}
			bind:value={logSpeed}
			readout={speedLabel}
			ends={['1 m/s', 'two-thirds of light']}
		/>
	</div>
</div>
