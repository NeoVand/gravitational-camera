<script lang="ts">
	import './figure.css';

	const N = 20;
	const R = 60;
	const dots = Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI);

	// time, in seconds, advanced by the animation loop
	let t = $state(0.9);

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

	// beside a mass: the mass drifts nearer and farther; the tide goes as 1/r^3
	const massDistance = $derived(146 + 24 * Math.cos(t * 1.1));
	const tide = $derived(0.2 * (122 / massDistance) ** 3);
	// the mass is drawn nearer than its distance in the formula, to fit the panel
	const massX = $derived(-massDistance + 6);
	const wave = $derived(0.24 * Math.sin(t * 2.2));

	const beside = (a: number) => ({
		x: R * Math.cos(a) * (1 + 2 * tide),
		y: R * Math.sin(a) * (1 - tide)
	});
	const plus = (a: number) => ({
		x: R * Math.cos(a) * (1 + wave),
		y: R * Math.sin(a) * (1 - wave)
	});
	const cross = (a: number) => {
		// the plus pattern turned by 45 degrees
		const x = R * Math.cos(a);
		const y = R * Math.sin(a);
		return { x: x + wave * y, y: y + wave * x };
	};
</script>

<div class="gfig">
	<svg
		viewBox="3 28 720 233"
		role="img"
		aria-label="Rings of free particles distorted by a nearby mass and by the two polarizations of a gravitational wave"
		{@attach animate}
	>
		<!-- beside a mass -->
		<g transform="translate(205 112)">
			<circle class="hair" r={R} stroke-dasharray="3 5" />
			<circle cx={massX} cy="0" r="17" fill="var(--accent)" />
			<line
				class="hair"
				x1={-massDistance + 40}
				y1="0"
				x2={-R - 34}
				y2="0"
				stroke-dasharray="2 4"
			/>
			{#each dots as a (a)}
				{@const p = beside(a)}
				<circle cx={p.x} cy={p.y} r="3.6" fill="var(--text)" />
			{/each}
			<text class="strong" y="116" text-anchor="middle">Beside a mass</text>
			<text class="small" y="134" text-anchor="middle">stretched toward it, squeezed across</text>
		</g>

		<!-- plus -->
		<g transform="translate(440 112)">
			<circle class="hair" r={R} stroke-dasharray="3 5" />
			{#each dots as a (a)}
				{@const p = plus(a)}
				<circle cx={p.x} cy={p.y} r="3.6" fill="var(--text)" />
			{/each}
			<text class="strong" y="116" text-anchor="middle">A wave, “plus”</text>
			<text class="small" y="134" text-anchor="middle">passing through the page</text>
		</g>

		<!-- cross -->
		<g transform="translate(628 112)">
			<circle class="hair" r={R} stroke-dasharray="3 5" />
			{#each dots as a (a)}
				{@const p = cross(a)}
				<circle cx={p.x} cy={p.y} r="3.6" fill="var(--text)" />
			{/each}
			<text class="strong" y="116" text-anchor="middle">A wave, “cross”</text>
			<text class="small" y="134" text-anchor="middle">the same, turned by 45°</text>
		</g>
	</svg>
</div>
