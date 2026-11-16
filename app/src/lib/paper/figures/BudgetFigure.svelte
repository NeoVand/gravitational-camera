<script lang="ts">
	import './figure.css';

	// Gravitons emitted per second by the whole object. Values are computed in
	// calc/orders_of_magnitude.py; the Sun's follows from 1e8 W at 1.3e7 K.
	interface Row {
		name: string;
		rate: number;
		words: string;
		thermal: boolean;
	}
	const rows: Row[] = [
		{ name: 'The Sun', rate: 2.1e23, words: '2 × 10²³ every second', thermal: true },
		{
			name: 'The Earth’s interior (assumed friction)',
			rate: 5.2e10,
			words: '5 × 10¹⁰ every second',
			thermal: true
		},
		{
			name: '490-tonne steel beam, spun to breaking',
			rate: 3.8e3,
			words: '4,000 every second',
			thermal: false
		},
		{
			name: 'Two 1-tonne masses, 48 turns a second',
			rate: 8.1,
			words: '8 every second',
			thermal: false
		},
		{
			name: 'Two 1-kg masses, 16 turns a second',
			rate: 2.1e-9,
			words: 'one every 15 years',
			thermal: false
		},
		{ name: 'A person', rate: 1.6e-15, words: 'one every 20 million years', thermal: true },
		{
			name: 'A litre of boiling water',
			rate: 3.9e-17,
			words: 'one every 800 million years',
			thermal: true
		}
	];

	const X0 = 300;
	const X1 = 700;
	const L0 = -19;
	const L1 = 24;
	const x = (log: number) => X0 + ((log - L0) / (L1 - L0)) * (X1 - X0);
	const marks = [
		{ log: 0, label: 'one a second' },
		{ log: -7.5, label: 'one a year' },
		{ log: -17.64, label: 'one in the age of the universe' }
	];
	const ROW = 34;
	const TOP = 64;
</script>

<div class="gfig">
	<svg
		viewBox="0 0 720 {TOP + rows.length * ROW + 44}"
		role="img"
		aria-label="Gravitons emitted per second by seven objects, on a logarithmic scale"
	>
		{#each marks as m, i (m.label)}
			<line
				class="hair"
				x1={x(m.log)}
				y1={TOP - 12 - i * 14}
				x2={x(m.log)}
				y2={TOP + rows.length * ROW}
				stroke-dasharray="3 5"
			/>
			<text class="small" x={x(m.log) + 6} y={TOP - 14 - i * 14}>{m.label}</text>
		{/each}

		{#each rows as r, i (r.name)}
			{@const y = TOP + i * ROW}
			<text x={X0 - 14} y={y + 19} text-anchor="end">{r.name}</text>
			<rect
				x={X0}
				y={y + 6}
				width={x(Math.log10(r.rate)) - X0}
				height="18"
				rx="3"
				fill={r.thermal ? 'var(--accent)' : 'var(--accent-2)'}
				opacity="0.85"
			/>
			<text
				class="small strong"
				x={x(Math.log10(r.rate)) + 8}
				y={y + 19}
				text-anchor={Math.log10(r.rate) > 12 ? 'end' : 'start'}
				dx={Math.log10(r.rate) > 12 ? -16 : 0}
				style:fill={Math.log10(r.rate) > 12 ? 'var(--bg)' : undefined}
			>
				{r.words}
			</text>
		{/each}

		<line class="hair" x1={X0} y1={TOP - 4} x2={X0} y2={TOP + rows.length * ROW} />
		<g transform="translate({X0} {TOP + rows.length * ROW + 26})">
			<rect width="14" height="10" y="-9" rx="2" fill="var(--accent)" opacity="0.85" />
			<text class="small" x="20" y="0">thermal glow</text>
			<rect x="130" width="14" height="10" y="-9" rx="2" fill="var(--accent-2)" opacity="0.85" />
			<text class="small" x="150" y="0">bulk motion</text>
		</g>
	</svg>
</div>
