<script lang="ts">
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

	// the two masses, circling in the horizontal plane, seen slightly from above
	const orbit = $derived({ x: 26 * Math.cos(t * 2.4), y: 8 * Math.sin(t * 2.4) });

	const C = 299792458;
	const speed = $derived(10 ** logSpeed);
	const ratio = $derived(((Math.PI / 2) * C) / speed); // wavelength / size
	const WAVE = 300; // drawn length of one wavelength
	const sizePx = $derived(Math.max(1.2, WAVE / ratio));

	const sci = (v: number) => {
		if (v < 1000) return v.toFixed(v < 10 ? 1 : 0);
		const e = Math.floor(Math.log10(v));
		const sup = String(e).replace(/[0-9]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]);
		return `${(v / 10 ** e).toFixed(1)} × 10${sup}`;
	};
	const speedLabel = $derived(
		speed < 1000
			? `${speed.toFixed(speed < 10 ? 1 : 0)} m/s`
			: speed < C / 100
				? `${(speed / 1000).toFixed(speed < 1e4 ? 1 : 0)} km/s`
				: `${((speed / C) * 100).toFixed(0)}% of light speed`
	);
	const wave = Array.from({ length: 121 }, (_, i) => {
		const u = i / 120;
		return `${i ? 'L' : 'M'} ${(390 + u * WAVE).toFixed(1)} ${(150 - 30 * Math.sin(u * 2 * Math.PI)).toFixed(1)}`;
	}).join(' ');
</script>

<div class="gfig">
	<svg
		viewBox="0 0 720 340"
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
		<path
			d="M {CX + 54} 46 a 11 11 0 1 1 -8 -5.6"
			class="ink"
			stroke-width="1.7"
			marker-end="url(#quad-arrow)"
		/>
		<text class="small" x={CX + 68} y="46">strongest,</text>
		<text class="small" x={CX + 68} y="61">circular</text>
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
		<path d={wave} stroke="var(--accent-2)" stroke-width="2.2" fill="none" />
		<line class="hair" x1="390" y1="196" x2="690" y2="196" />
		<path class="ink" d="M 390 190 v 12 M 690 190 v 12" stroke-width="1.4" />
		<text class="small" x="540" y="216" text-anchor="middle">one wavelength</text>
		<rect x={390} y="232" width={sizePx} height="12" fill="var(--text)" />
		<text class="small" x={Math.min(390 + sizePx + 10, 600)} y="243"
			>the source, to the same scale</text
		>
		<text class="strong" x="540" y="290" text-anchor="middle">
			wavelength = {sci(ratio)} × the size of the source
		</text>
		<text class="strong" x="540" y="336" text-anchor="middle">Wavelength against size</text>
	</svg>

	<div class="controls">
		<label>
			Speed of the moving parts
			<input type="range" min="0" max="8.3" step="0.05" bind:value={logSpeed} />
		</label>
		<span class="readout">{speedLabel}</span>
	</div>
</div>
