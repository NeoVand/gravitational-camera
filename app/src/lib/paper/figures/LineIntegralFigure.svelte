<script lang="ts">
	import './figure.css';
</script>

<div class="gfig">
	<svg
		viewBox="0 0 720 336"
		role="img"
		aria-label="A line of sight in light stops at the first surface; in gravity it passes through every body and adds up their glow"
	>
		<defs>
			<marker
				id="lif-arrow"
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="7"
				markerHeight="7"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text)" />
			</marker>
		</defs>

		{#each [{ y: 78, gravity: false }, { y: 236, gravity: true }] as row (row.y)}
			<g transform="translate(0 {row.y})">
				<!-- the camera -->
				<rect
					x="32"
					y="-16"
					width="40"
					height="32"
					rx="6"
					fill="none"
					stroke="var(--text)"
					stroke-width="1.8"
				/>
				<circle cx="52" cy="0" r="8" fill="none" stroke="var(--text)" stroke-width="1.8" />

				<!-- the scene: a wall, a warm ball, a large body -->
				<rect
					x="236"
					y="-58"
					width="22"
					height="116"
					fill="var(--text-faint)"
					opacity={row.gravity ? 0.35 : 0.9}
				/>
				<circle
					cx="392"
					cy="0"
					r="36"
					fill="var(--accent)"
					opacity={row.gravity ? 0.3 : 0.12}
					stroke="var(--accent)"
					stroke-opacity={row.gravity ? 0.9 : 0.25}
					stroke-width="1.4"
				/>
				<circle
					cx="590"
					cy="0"
					r="62"
					fill="var(--accent)"
					opacity={row.gravity ? 0.22 : 0.08}
					stroke="var(--accent)"
					stroke-opacity={row.gravity ? 0.9 : 0.25}
					stroke-width="1.4"
				/>

				{#if row.gravity}
					<line
						x1="74"
						y1="0"
						x2="700"
						y2="0"
						stroke="var(--text)"
						stroke-width="1.4"
						marker-end="url(#lif-arrow)"
					/>
					<!-- the parts of the path that lie inside matter -->
					<line
						x1="236"
						y1="0"
						x2="258"
						y2="0"
						stroke="var(--accent)"
						stroke-width="7"
						stroke-linecap="butt"
					/>
					<line x1="356" y1="0" x2="428" y2="0" stroke="var(--accent)" stroke-width="7" />
					<line x1="528" y1="0" x2="652" y2="0" stroke="var(--accent)" stroke-width="7" />
					<text class="small accent" x="247" y="-66" text-anchor="middle">+ wall</text>
					<text class="small accent" x="392" y="-46" text-anchor="middle">+ warm body</text>
					<text class="small accent" x="590" y="-70" text-anchor="middle">+ everything behind</text>
					<text class="small" x="700" y="84" text-anchor="end">
						a pixel reports the sum along the whole line of sight
					</text>
				{:else}
					<line x1="74" y1="0" x2="232" y2="0" stroke="var(--text)" stroke-width="1.4" />
					<circle cx="236" cy="0" r="5" fill="var(--accent-2)" />
					<text class="small accent2" x="226" y="-66" text-anchor="end"
						>stops at the first surface</text
					>
				{/if}
			</g>
		{/each}

		<text class="strong" x="32" y="22">Light</text>
		<text class="strong" x="32" y="180">Gravity</text>
	</svg>
</div>
