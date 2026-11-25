<script lang="ts">
	/**
	 * Chapter 13.8's readable cells. Left, a section of the stone, a disc of radius a, cut into square cells of side
	 * d = (4π/3N₂)^⅓ a, redrawn as the sliders move; right, the readouts: N₁ = (⌊L/Λ⌋ + 1)², the numbers looking
	 * reads, in the field colour; N₂, the cells that pushing in pairs resolves, in the matter colour; d/a; and N₂/N₁.
	 * Sliders set log₁₀ SNR, 3 to 122, and R_c/a, 1.2 to 10; a choice of region places the ceiling S_BH/2π on the
	 * SNR slider; a toggle replaces the stone by a black hole and its seven numbers, whatever the sliders say.
	 *
	 * N₂ is the exact singular-value count of the chapter's model, from ./readable-cells.ts. Most settings take a few
	 * milliseconds; the slowest, near R_c/a = 1.2 and SNR = 10¹²², take a few hundred, so the count runs in slices of
	 * a frame, a new setting stopping the last, and the counts made are kept. The chapter's try box asks the reader to
	 * predict, so the figure states no answer: it shows live values only. Orange and blue are the tutorial's stretch and
	 * squeeze, so the drawing is in the neutrals and the matter colour. Nothing moves by itself, so reduced motion
	 * changes nothing.
	 */
	import {
		BlackHoleIcon,
		EarthIcon,
		GalaxyIcon,
		RadarIcon,
		RulerIcon,
		SignalIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		RADII,
		REGIONS,
		SNR,
		ceiling,
		gridLines,
		grouped,
		keptLog,
		keptRadius,
		readings,
		settingCount,
		settingCountSteps,
		snrTex,
		snrWords,
		type RegionId
	} from './readable-cells';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------------
	let logSnr = $state(SNR.opening);
	let radius = $state(RADII.opening);
	let region = $state<RegionId>('metre');
	let hole = $state(false);

	/** On the grid of tenths, except the ceiling's own tick, kept exactly. */
	const setLog = (v: number) => (logSnr = v === ceilingAt ? v : keptLog(v));
	const setRadius = (v: number) => (radius = keptRadius(v));

	/** The arrows step SNR by a power of ten and the Page keys by ten; R_c/a's Page keys step it by one. */
	function keys(e: KeyboardEvent) {
		const input = e.target;
		if (!(input instanceof HTMLInputElement) || input.type !== 'range') return;
		if (input.id === `${uid}-snr`) {
			const by = {
				ArrowRight: SNR.arrow,
				ArrowUp: SNR.arrow,
				ArrowLeft: -SNR.arrow,
				ArrowDown: -SNR.arrow,
				PageUp: SNR.page,
				PageDown: -SNR.page
			}[e.key];
			if (by === undefined) return;
			e.preventDefault();
			setLog(logSnr + by);
		} else if (input.id === `${uid}-radius`) {
			const by = { PageUp: RADII.page, PageDown: -RADII.page }[e.key];
			if (by === undefined) return;
			e.preventDefault();
			setRadius(radius + by);
		}
	}

	// --- the count ------------------------------------------------------------------------------------------------------
	/** The opening count, a few milliseconds, made at once so that the page is drawn with it. */
	const OPENING = {
		log: SNR.opening,
		radius: RADII.opening,
		count: settingCount(SNR.opening, RADII.opening)
	};
	/** The work done in one slice, in ms, before the page is let go. */
	const SLICE = 12;

	/** The latest count finished; while a new one runs, the last is shown, dimmed. */
	let result = $state(OPENING);
	const counting = $derived(result.log !== logSnr || result.radius !== radius);

	/** Each new setting is counted in slices of a frame (at once if counted before), stopping the last. */
	$effect(() => {
		const [log, at] = [logSnr, radius];
		const steps = settingCountSteps(log, at);
		let stopped = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const slice = () => {
			const start = performance.now();
			while (!stopped) {
				const next = steps.next();
				if (next.done) {
					result = { log, radius: at, count: next.value };
					return;
				}
				if (performance.now() - start > SLICE) {
					timer = setTimeout(slice, 0);
					return;
				}
			}
		};
		slice();
		return () => {
			stopped = true;
			clearTimeout(timer);
		};
	});

	const r = $derived(readings(logSnr, radius, result.count));
	const shown = $derived(readings(result.log, result.radius, result.count));
	const ceilingAt = $derived(
		Math.log10(ceiling(REGIONS.find((g) => g.id === region)?.radius ?? 1))
	);
	const regionName = $derived(
		{
			metre: 'of radius one metre',
			earth: 'of the Earth’s radius',
			hubble: 'of the Hubble radius'
		}[region]
	);

	const ceilingWords = $derived(`the ceiling in a region ${regionName}, ${snrWords(ceilingAt)}`);

	// --- the drawing ----------------------------------------------------------------------------------------------------
	const W = 360;
	const C = W / 2;
	const R = 160;
	let u = $state(1);
	const f1 = (x: number) => x.toFixed(1);

	/** Below this spacing on the screen, in CSS pixels, the lines would merge and beat: the cells are shown as a tone. */
	const FINEST = 2.5;

	/** The cells' lines, cut at the rim; their spacing on the screen sets how strongly they are drawn. */
	const grid = $derived.by(() => {
		const side = shown.side;
		const pixels = (side * R) / u;
		const fine = pixels < FINEST;
		let d = '';
		if (!fine) {
			for (const x of gridLines(side)) {
				const half = Math.sqrt(Math.max(0, 1 - x * x)) * R;
				const X = C + x * R;
				d += `M${f1(X)},${f1(C - half)}V${f1(C + half)}`;
				d += `M${f1(C - half)},${f1(C + x * R)}H${f1(C + half)}`;
			}
		}
		return {
			d,
			fine,
			width: Math.min(1.1, Math.max(0.35, 0.12 * pixels)) * u,
			opacity: Math.min(1, Math.max(0.4, pixels / 8)),
			// the one cell is kept a pixel across at least
			cell: Math.max(side * R, u)
		};
	});

	/** The hole's seven beads, in rows of one, three and three, as in the paper's Figure fig:hair(b). */
	const BEAD = 15;
	const GAP = 37;
	const ROWS = [
		{ name: 'mass', n: 1 },
		{ name: 'place', n: 3 },
		{ name: 'spin', n: 3 }
	];
	const beads = ROWS.flatMap((row, i) =>
		Array.from({ length: row.n }, (_, k) => ({
			x: C - 30 + (k - (row.n - 1) / 2) * GAP,
			y: C - GAP + i * GAP,
			id: `${row.name}-${k}`
		}))
	);
	const rowNames = ROWS.map((row, i) => ({
		name: row.name,
		x: C - 30 + 1.5 * GAP + 8,
		y: C - GAP + i * GAP
	}));

	// --- the words ------------------------------------------------------------------------------------------------------
	const REGION_OPTIONS = [
		{ value: 'metre' as const, label: 'A metre', icon: RulerIcon },
		{ value: 'earth' as const, label: 'The Earth', icon: EarthIcon },
		{ value: 'hubble' as const, label: 'The Hubble radius', icon: GalaxyIcon }
	];

	const N1 = '\\htmlClass{q-field}{N_1}';
	const N2 = '\\htmlClass{q-matter}{N_2}';
	const side = (x: number) => x.toPrecision(2);
	const ratio = (x: number) => x.toFixed(1);

	const stoneLabel = $derived(
		`A section through the centre of the stone, a disc of radius a, cut into square cells of side ${side(shown.side)} a, about ${Math.round(2 / shown.side)} across a diameter.`
	);
	const holeLabel =
		'A black hole drawn as a dark disc, with seven beads for the seven numbers its field shows: one for its mass, three for its place and three for its spin.';
</script>

<div class="readable-cells">
	<div class="panels">
		<section class="panel" aria-label="The drawing">
			<div class="stage">
				<p class="heading">
					{#if hole}
						A black hole, and a bead for each number its field shows
					{:else}
						A section of the stone, radius <i>a</i>, cut into cells of side <i>d</i>
					{/if}
				</p>
				<svg
					viewBox="0 0 {W} {W}"
					role="img"
					aria-label={hole ? holeLabel : stoneLabel}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<radialGradient id="{uid}-bead" cx="0.36" cy="0.32" r="0.75">
							<stop offset="0" stop-color="#b9b9b9" />
							<stop offset="0.55" stop-color="#6e6e6e" />
							<stop offset="1" stop-color="#3a3a3a" />
						</radialGradient>
					</defs>
					{#if hole}
						<circle class="hole" cx={C} cy={C} r={R} />
						{#each beads as b (b.id)}
							<circle cx={f1(b.x)} cy={f1(b.y)} r={BEAD} fill="url(#{uid}-bead)" />
						{/each}
						{#each rowNames as row (row.name)}
							<text class="bead-name" x={f1(row.x)} y={f1(row.y)}>{row.name}</text>
						{/each}
					{:else}
						<g class={{ stale: counting }}>
							<circle class={['stone', { fine: grid.fine }]} cx={C} cy={C} r={R} />
							<rect
								class="one"
								x={C}
								y={f1(C - grid.cell)}
								width={f1(grid.cell)}
								height={f1(grid.cell)}
							/>
							<path
								class="cells"
								d={grid.d}
								style:stroke-width={grid.width}
								style:opacity={grid.opacity}
							/>
							<circle class="rim" cx={C} cy={C} r={R} />
						</g>
					{/if}
				</svg>
				{#if hole}
					<ul class="legend" aria-hidden="true">
						<li><span class="swatch bead-key"></span>a bead for each number</li>
					</ul>
				{:else}
					<ul class="legend" aria-hidden="true">
						<li><span class="swatch cell-key"></span>one cell, of side <i>d</i></li>
						{#if grid.fine}
							<li><span class="swatch fine-key"></span>cells finer than the screen, as a tone</li>
						{/if}
						<li><span class="swatch rim-key"></span>the stone’s rim, radius <i>a</i></li>
					</ul>
				{/if}
			</div>
		</section>

		<section class="panel readings" aria-label="The readouts">
			<p class="context">
				<Tex math={`\\mathrm{SNR} = ${snrTex(logSnr)}`} />, <Tex
					math={`R_c = ${radius.toFixed(1)}\\,a`}
				/>
				<span class="also">
					<Tex math={`L = \\ln\\mathrm{SNR} = ${r.lnSnr.toFixed(1)}`} />, <Tex
						math={`\\Lambda = \\ln(R_c/a) = ${r.lam.toFixed(3)}`}
					/>
				</span>
			</p>
			{#if hole}
				<dl class="readouts">
					<div>
						<dt>The numbers its field shows</dt>
						<dd><span class="number">7</span></dd>
					</div>
					<div class="faint">
						<dt>its mass, its place and its spin, whatever the sliders say</dt>
						<dd></dd>
					</div>
				</dl>
			{:else}
				<dl class="readouts" aria-live="polite" aria-busy={counting}>
					<div>
						<dt>Looking: the numbers read, <Tex math={N1} trust /></dt>
						<dd><span class="number field">{grouped(r.looking)}</span></dd>
					</div>
					<div class={{ stale: counting }}>
						<dt>
							Pushing in pairs: the cells resolved, <Tex math={N2} trust />
							{#if counting}<span class="status">counting…</span>{/if}
						</dt>
						<dd><span class="number matter">{grouped(shown.pushing)}</span></dd>
					</div>
					<div class={{ stale: counting }}>
						<dt>The side of a cell, <Tex math="d/a" /></dt>
						<dd><span class="number">{side(shown.side)}</span></dd>
					</div>
					<div class={{ stale: counting }}>
						<dt><Tex math={`${N2}/${N1}`} trust /></dt>
						<dd><span class="number">{ratio(shown.ratio)}</span></dd>
					</div>
					<div class={['small', { stale: counting }]}>
						<dt>
							<Tex math={`${N2}/(L/\\Lambda)^3`} trust />, and its large-<Tex math="L" /> limit <Tex
								math="\kappa"
							/>
						</dt>
						<dd>
							{(shown.pushing / (shown.lnSnr / shown.lam) ** 3).toFixed(3)}, <Tex
								math={`\\kappa = ${r.kappa.toFixed(3)}`}
							/>
						</dd>
					</div>
				</dl>
			{/if}
		</section>
	</div>

	<div class="bar">
		<div class="sliders" onkeydowncapture={keys} role="presentation">
			<Slider
				id="{uid}-snr"
				label="Signal-to-noise ratio"
				icon={SignalIcon}
				min={SNR.min}
				max={SNR.max}
				step={SNR.step}
				bind:value={() => logSnr, setLog}
				readout="SNR = {snrWords(logSnr)}"
				ends={['10³', '10¹²²']}
				marks={[{ at: ceilingAt, label: ceilingWords }]}
				marksHint="the tick: {ceilingWords}"
			/>
			<Slider
				id="{uid}-radius"
				label="Radius of the camera sphere"
				icon={RadarIcon}
				min={RADII.min}
				max={RADII.max}
				step={RADII.step}
				bind:value={() => radius, setRadius}
				readout="{radius.toFixed(1)} a"
				ends={['1.2', '10']}
			/>
		</div>
		<div class="choices">
			<Segmented label="Region for the ceiling" options={REGION_OPTIONS} bind:value={region} />
			<Toggle icon={BlackHoleIcon} label="Black hole" bind:checked={hole} />
		</div>
		<p class="hint">
			Drag a slider, or Tab to it: on the signal-to-noise ratio the arrow keys step one power of ten
			and the Page keys ten; on <i>R<sub>c</sub></i>/<i>a</i> the arrows step 0.1 and the Page keys 1.
		</p>
	</div>

	<p class="note">
		Exact: <Tex math={`${N1} = (\\lfloor L/\\Lambda\\rfloor + 1)^2`} trust />; <Tex
			math={N2}
			trust
		/>, the singular-value count of the chapter’s model with the masses held in pairs on the sphere <Tex
			math="R_c"
		/>, each singular value of <Tex math="WGW" /> above the largest over SNR counted <Tex
			math="2\ell + 1"
		/> times, found in double precision by an elimination that keeps the Cauchy structure of <Tex
			math="G"
		/> and by one-sided Jacobi, and equal to the reference scripts’ multiple-precision count wherever
		they were compared (the rung-by-rung count is not used); <Tex
			math={'d/a = (4\\pi/3N_2)^{1/3}'}
		/>; <Tex math="\kappa" />, by quadrature; and each ceiling, <Tex
			math={'S_{\\rm BH}/2\\pi = \\ell_{\\rm r}^2/2\\ell_P^2'}
		/>. Schematic: the cells, drawn as equal squares on a section through the centre, while the
		count fixes only their number; and the black hole’s disc and beads, a bead for each number.
	</p>
</div>

<style>
	.readable-cells {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panels {
		display: grid;
		grid-template-columns: minmax(0, 11fr) minmax(0, 9fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.7rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.45rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	svg {
		display: block;
		width: 100%;
		max-width: 26rem;
		height: auto;
		margin: 0 auto;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		pointer-events: none;
	}

	/* --- the stone and its cells -------------------------------------------------------------- */

	.stone {
		fill: color-mix(in srgb, var(--q-matter) 16%, transparent);
	}

	.stone.fine {
		fill: color-mix(in srgb, var(--q-matter) 38%, transparent);
	}

	.cells {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 80%, transparent);
	}

	.one {
		fill: color-mix(in srgb, var(--q-matter) 55%, transparent);
	}

	.rim {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.stale {
		opacity: 0.55;
		transition: opacity 0.2s;
	}

	/* --- the hole ------------------------------------------------------------------------------ */

	/* black in both themes, with a rim so that it stands out from the dark ground */
	.hole {
		fill: #050403;
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.bead-name {
		font-size: calc(14px * var(--u, 1));
		dominant-baseline: middle;
		fill: #c4beb6;
	}

	/* --- the legend ---------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem 1rem;
		margin: 0.45rem 0.2rem 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		flex: none;
		display: inline-block;
	}

	.cell-key {
		width: 0.7rem;
		height: 0.7rem;
		background: color-mix(in srgb, var(--q-matter) 55%, transparent);
		border: 1px solid color-mix(in srgb, var(--q-matter) 80%, transparent);
	}

	.fine-key {
		width: 0.7rem;
		height: 0.7rem;
		background: color-mix(in srgb, var(--q-matter) 38%, transparent);
	}

	.bead-key {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: radial-gradient(circle at 36% 32%, #b9b9b9, #6e6e6e 55%, #3a3a3a);
	}

	.rim-key {
		width: 1.2rem;
		border-top: 1.4px solid var(--text-dim);
	}

	/* --- the readouts -------------------------------------------------------------------------- */

	.readings {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.context {
		margin: 0;
		padding: 0.5rem 0.65rem 0.55rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--well);
		color: var(--text);
	}

	.context .also {
		display: block;
		margin-top: 0.2rem;
		color: var(--text-dim);
	}

	.readouts {
		display: grid;
		gap: 0.6rem;
		margin: 0;
	}

	.readouts div {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	dt {
		margin: 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	dd {
		margin: 0;
		text-align: right;
		white-space: nowrap;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.number {
		font-size: 1.05rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.number.field {
		color: var(--q-field);
	}

	.number.matter {
		color: var(--q-matter);
		font-weight: 650;
	}

	.readouts .small {
		padding-top: 0.5rem;
		border-top: 1px solid var(--line);
		font-size: 0.74rem;
	}

	.readouts .faint dt {
		font-size: 0.74rem;
		color: var(--text-faint);
	}

	.status {
		display: block;
		font-size: 0.72rem;
		color: var(--text-faint);
	}

	/* --- the controls and the note ----------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
	}

	.choices {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(9rem, 1fr);
		gap: 0.6rem 1.2rem;
		align-items: stretch;
	}

	/* on a phone the three regions share a narrow row: a long name takes two lines rather than spilling out */
	@media (max-width: 560px) {
		.choices :global(.segmented button) {
			white-space: normal;
			text-align: left;
		}

		.choices :global(.segmented button svg) {
			flex: none;
		}
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.note {
		margin: 0;
		padding: 0.7rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (prefers-reduced-motion: reduce) {
		.stale {
			transition: none;
		}
	}

	@media (max-width: 680px) {
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		svg {
			max-width: 22rem;
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.readings {
			padding: 0.6rem 0.6rem 0.75rem;
		}

		.sliders,
		.choices {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
