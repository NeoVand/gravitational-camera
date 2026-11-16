<script lang="ts">
	import './figure.css';

	// plot area and scales: log10 of frequency (Hz) and of distance (m)
	const X0 = 96;
	const X1 = 700;
	const Y0 = 30;
	const Y1 = 372;
	const F0 = -7;
	const F1 = 19;
	const R0 = -1;
	const R1 = 12;
	const x = (logF: number) => X0 + ((logF - F0) / (F1 - F0)) * (X1 - X0);
	const y = (logR: number) => Y1 - ((logR - R0) / (R1 - R0)) * (Y1 - Y0);

	// edge of the near zone: r = c / (2 pi f)
	const EDGE = Math.log10(299792458 / (2 * Math.PI));
	const fTop = EDGE - R1; // where the edge leaves through the top
	const fBottom = EDGE - R0; // ... and through the bottom

	const nearZone = `M ${x(F0)} ${y(R1)} L ${x(fTop)} ${y(R1)} L ${x(fBottom)} ${y(R0)} L ${x(F0)} ${y(R0)} Z`;
	const waveZone = `M ${x(fTop)} ${y(R1)} L ${x(F1)} ${y(R1)} L ${x(F1)} ${y(R0)} L ${x(fBottom)} ${y(R0)} Z`;

	const fTicks = [
		[-6, '10⁻⁶'],
		[-3, '10⁻³'],
		[0, '1'],
		[4, '10⁴'],
		[8, '10⁸'],
		[12, '10¹²'],
		[16, '10¹⁶']
	] as const;
	const rTicks = [
		[0, '1 m'],
		[3, '1 km'],
		[6, '1,000 km'],
		[9, '10⁶ km'],
		[12, '10⁹ km']
	] as const;

	interface Source {
		f: number;
		r: number;
		/** One or two lines of text. */
		label: string[];
		dx: number;
		dy: number;
		anchor?: 'start' | 'middle' | 'end';
		thermal?: boolean;
	}
	const sources: Source[] = [
		{ f: -4.65, r: 8.58, label: ['the Moon’s tide'], dx: 0, dy: 22, anchor: 'middle' },
		{
			f: -1.5,
			r: 6.0,
			label: ['an earthquake’s', 'gravity signal'],
			dx: -10,
			dy: -3,
			anchor: 'end'
		},
		{ f: -0.5, r: 1.5, label: ['a passing lorry'], dx: 10, dy: -6 },
		{ f: 0, r: 0.5, label: ['a person walking'], dx: 10, dy: 1 },
		{ f: 1.5, r: 0.18, label: ['a calibration rotor at LIGO'], dx: -10, dy: 17, anchor: 'end' },
		{
			f: 12.8,
			r: 0.5,
			label: ['a warm object', 'in the room'],
			dx: -10,
			dy: -14,
			anchor: 'end',
			thermal: true
		},
		{
			f: 14.0,
			r: 6.5,
			label: ['the Earth’s interior'],
			dx: -10,
			dy: 5,
			anchor: 'end',
			thermal: true
		},
		{ f: 17.5, r: 11.18, label: ['the Sun’s core'], dx: -10, dy: 5, anchor: 'end', thermal: true }
	];
</script>

<div class="gfig">
	<svg
		viewBox="0 0 720 440"
		role="img"
		aria-label="Map of sources by frequency and distance, divided into the near zone and the wave zone"
	>
		<path d={nearZone} fill="var(--accent-2)" opacity="0.13" />
		<path d={waveZone} fill="var(--accent)" opacity="0.11" />

		{#each fTicks as [f, label] (f)}
			<line class="grid" x1={x(f)} y1={Y0} x2={x(f)} y2={Y1} />
			<text class="small" x={x(f)} y={Y1 + 20} text-anchor="middle">{label}</text>
		{/each}
		{#each rTicks as [r, label] (r)}
			<line class="grid" x1={X0} y1={y(r)} x2={X1} y2={y(r)} />
			<text class="small" x={X0 - 10} y={y(r) + 4} text-anchor="end">{label}</text>
		{/each}
		<rect class="hair" x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} />

		<line
			x1={x(fTop)}
			y1={y(R1)}
			x2={x(fBottom)}
			y2={y(R0)}
			stroke="var(--text)"
			stroke-width="1.6"
		/>
		<line class="hair" x1={x(5.2)} y1={y(EDGE - 5.2)} x2={x(8.2)} y2={y(3.55)} />
		<text class="small strong" x={x(8.4)} y={y(3.6)}>edge of the near zone:</text>
		<text class="small" x={x(8.4)} y={y(3.6) + 16}>one sixth of a wavelength away</text>

		<text class="accent2 strong" x={X0 + 14} y={y(3.7)} letter-spacing="1.5">NEAR FIELD</text>
		<text class="accent strong" x={X1 - 14} y={Y1 - 14} text-anchor="end" letter-spacing="1.5">
			WAVE ZONE
		</text>

		{#each sources as s (s.label)}
			<circle
				cx={x(s.f)}
				cy={y(s.r)}
				r="5"
				fill={s.thermal ? 'var(--accent)' : 'var(--accent-2)'}
			/>
			{#each s.label as line, i (line)}
				<text x={x(s.f) + s.dx} y={y(s.r) + s.dy + i * 17} text-anchor={s.anchor ?? 'start'}>
					{line}
				</text>
			{/each}
		{/each}

		<!-- far off the top of the chart -->
		<path
			d="M {x(2)} {Y0 + 34} L {x(2)} {Y0 + 8} m -5 7 l 5 -7 l 5 7"
			class="ink"
			stroke-width="1.4"
		/>
		<text class="small" x={x(2) + 9} y={Y0 + 30}>merging neutron stars,</text>
		<text class="small" x={x(2) + 9} y={Y0 + 45}>10¹² times farther up</text>

		<text x={(X0 + X1) / 2} y={Y1 + 46} text-anchor="middle">frequency of the source (hertz)</text>
		<text transform="translate(18 {(Y0 + Y1) / 2}) rotate(-90)" text-anchor="middle">
			distance from the camera
		</text>
	</svg>
</div>
