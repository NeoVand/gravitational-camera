<script lang="ts">
	import { RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import './figure.css';

	/** Width of the array in wavelengths; index 0 is a single pixel. */
	const WIDTHS = [0, 1, 2, 5, 10, 30, 100];
	let index = $state(3);
	const width = $derived(WIDTHS[index]);

	// Bessel function J1 from its integral form
	function besselJ1(v: number): number {
		const n = Math.max(64, Math.ceil(4 * Math.abs(v)));
		let s = 0;
		for (let i = 0; i <= n; i++) {
			const tau = (i / n) * Math.PI;
			s += (i === 0 || i === n ? 0.5 : 1) * Math.cos(tau - v * Math.sin(tau));
		}
		return s / n;
	}

	// Legendre polynomials P_0..P_4
	const legendre = (u: number) => [
		1,
		u,
		(3 * u * u - 1) / 2,
		(5 * u ** 3 - 3 * u) / 2,
		(35 * u ** 4 - 30 * u * u + 3) / 8
	];

	/**
	 * Reconstructed brightness of one point source, against the angle from it.
	 * One pixel: everything up to spherical-harmonic degree four. An aperture of
	 * width D: the Airy pattern.
	 */
	function response(gammaDeg: number, d: number): number {
		const g = (gammaDeg * Math.PI) / 180;
		if (d === 0) {
			return legendre(Math.cos(g)).reduce((s, p, l) => s + (2 * l + 1) * p, 0) / 25;
		}
		const v = Math.PI * d * Math.sin(g);
		return Math.abs(v) < 1e-6 ? 1 : ((2 * besselJ1(v)) / v) ** 2;
	}

	const X0 = 60;
	const X1 = 700;
	const BASE = 250;
	const TOP = 60;
	const HALF = (BASE + TOP) / 2;
	const px = (deg: number) => X0 + ((deg + 90) / 180) * (X1 - X0);
	const angles = Array.from({ length: 1441 }, (_, i) => -90 + i / 8);

	const curve = $derived(angles.map((a) => response(a, width)));
	const path = $derived(
		curve
			.map(
				(v, i) =>
					`${i ? 'L' : 'M'} ${px(angles[i]).toFixed(1)} ${(BASE - Math.max(v, -0.12) * (BASE - TOP)).toFixed(1)}`
			)
			.join(' ')
	);
	/** Full width at half maximum, in degrees. */
	const fwhm = $derived.by(() => {
		for (let a = 0; a <= 90; a += 0.01) if (response(a, width) < 0.5) return 2 * a;
		return 180;
	});

	const pixels = Array.from({ length: 13 }, (_, i) => i);
</script>

<div class="gfig">
	<svg
		viewBox="0 4 720 303"
		role="img"
		aria-label="Response of the computed image to a single point source, for a single pixel and for arrays of increasing width"
	>
		<!-- the array, drawn to suggest its width -->
		<g transform="translate(360 22)">
			{#if width === 0}
				<rect x="-5" y="-5" width="10" height="10" fill="var(--text)" />
				<text class="small" x="14" y="4">one pixel</text>
			{:else}
				{@const half = 20 + 34 * Math.log10(width + 1)}
				{#each pixels as p (p)}
					<rect
						x={-half + (p / 12) * 2 * half - 3}
						y="-3"
						width="6"
						height="6"
						fill="var(--text)"
					/>
				{/each}
				<text class="small" x={half + 12} y="4"
					>array {width} wavelength{width === 1 ? '' : 's'} wide</text
				>
			{/if}
		</g>

		<line class="hair" x1={X0} y1={BASE} x2={X1} y2={BASE} />
		{#each [-90, -60, -30, 0, 30, 60, 90] as a (a)}
			<line class="grid" x1={px(a)} y1={TOP - 6} x2={px(a)} y2={BASE} />
			<text class="small" x={px(a)} y={BASE + 20} text-anchor="middle">{a}°</text>
		{/each}
		<path d="{path} L {X1} {BASE} L {X0} {BASE} Z" fill="var(--accent)" opacity="0.14" />
		<path d={path} stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-linejoin="round" />
		<!-- the blur: the width of the curve at half its height -->
		<path
			class="ink"
			stroke-width="1.4"
			d="M {px(-fwhm / 2)} {HALF - 5} v 10 M {px(-fwhm / 2)} {HALF} H {px(fwhm / 2)} M {px(
				fwhm / 2
			)} {HALF - 5} v 10"
		/>
		<text class="small" x={Math.min(px(fwhm / 2) + 10, X1 - 96)} y={HALF + 4}>
			blur {fwhm >= 10 ? fwhm.toFixed(0) : fwhm.toFixed(1)}° wide
		</text>
		<text x={(X0 + X1) / 2} y={BASE + 44} text-anchor="middle">angle away from the source</text>
		<text
			class="small"
			transform="translate(22 {(BASE + TOP) / 2}) rotate(-90)"
			text-anchor="middle"
		>
			brightness in the image
		</text>
	</svg>

	<div class="controls single">
		<Slider
			id="array-width"
			label="Width of the array"
			icon={RulerIcon}
			min={0}
			max={WIDTHS.length - 1}
			step={1}
			bind:value={index}
			readout={width === 0 ? 'a single pixel' : `${width} wavelength${width === 1 ? '' : 's'}`}
			ends={['one pixel', '100 wavelengths']}
		/>
	</div>
</div>
