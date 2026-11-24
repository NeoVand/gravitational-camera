<script lang="ts">
	/**
	 * Chapter 9.2's Jordan explorer. A trace-free complex symmetric table 𝒲, shown as a grid of its nine entries, from
	 * five presets (one mass, the two masses of the paper's Figure stars, one wave, a mass with a wave along its line,
	 * the paper's type III table) and three sliders that add a wave along ẑ, a wave along x̂ and a second mass on +x̂.
	 * Left: the complex plane of its eigenvalues, equal ones drawn as touching dots. Right: I and J, 1 − 6J²/I³, the
	 * rank and the singular values, whether (𝒲 − w)(𝒲 + 2w), 𝒲² and 𝒲³ vanish, and the shape, a leaf of the chapter's
	 * tree with its Petrov letter and the questions asked on the way. Two predictions at the top are answered once the
	 * reader has done what each asks. The arithmetic is ./jordan-explorer.ts.
	 */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Atom01Icon,
		AudioWave01Icon,
		CircleIcon,
		CirclePlusIcon,
		GridIcon,
		RefreshIcon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { fixed } from './majorana-stars';
	import {
		LEAVES,
		MASS_MAX,
		OPENING,
		PRESETS,
		QUESTIONS,
		SLIDER_STEP,
		TOL,
		WAVE_MAX,
		amounts,
		analyse,
		complexTex,
		complexText,
		eigenWords,
		entryOf,
		extentOf,
		figures,
		figuresOf,
		gathered,
		noteFirst,
		noteSecond,
		pathWords,
		presetOf,
		readingOf,
		sceneOf,
		summaryOf,
		type PresetKey,
		type Scene,
		type Sliders
	} from './jordan-explorer';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let scene = $state<Scene>({ ...OPENING });
	const preset = $derived(presetOf(scene.preset));
	const amount = $derived(amounts(scene));

	function setPreset(key: PresetKey) {
		scene = sceneOf(key);
		note();
	}
	function setSlider(which: keyof Sliders, v: number) {
		scene = { ...scene, [which]: v };
		note();
	}
	function reset() {
		scene = { ...OPENING };
		note();
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	const revealed = $derived(step === 1 ? first : second);

	function note() {
		first = noteFirst(first, scene);
		second = noteSecond(second, scene);
	}

	/** The chapter's numbers for the second answer, from the same arithmetic: w = 0.125 with c₂′ = 0.05 across. */
	const across = (() => {
		const b = analyse(readingOf({ ...sceneOf('mass-wave'), z: 0, x: WAVE_MAX }));
		return {
			eigen: b.eigenvalues.map((w) => figures(w.re)),
			ratio: b.ratio ? figures(b.ratio.re, 2) : ''
		};
	})();

	// --- the numbers --------------------------------------------------------------------------------------------------
	const a = $derived(analyse(readingOf(scene)));
	const groups = $derived(gathered(a.eigenvalues));
	const leaf = $derived(LEAVES[a.shape]);
	const sv = $derived(a.singular.map((s) => (s <= TOL * a.singular[0] ? 0 : s)));
	const unitWords: Record<PresetKey, string> = {
		mass: 'in units of GM/r³',
		two: 'in the figure’s units',
		wave: 'in any unit of tide',
		'mass-wave': 'in any unit of tide',
		three: 'in any unit of tide'
	};

	// --- the plane ------------------------------------------------------------------------------------------------------
	const PW = 340;
	const PH = 252;
	const O = { x: 170, y: 136 };
	/** Pixels from the origin to the extent T. */
	const SPAN = 125;
	let u = $state(1);
	const f1 = (n: number) => n.toFixed(1);
	const T = $derived(extentOf(a.eigenvalues, preset.unit));
	const k = $derived(SPAN / T);
	const reTicks = $derived([-1, -0.5, 0.5, 1].map((t) => t * T));
	const imTicks = $derived([-0.5, 0.5].map((t) => t * T));
	const R = $derived(4.4 * u);
	const dots = $derived(
		groups.flatMap((g, gi) =>
			Array.from({ length: g.count }, (_, j) => ({
				key: `${gi}-${j}`,
				x: O.x + k * g.at.re + (j - (g.count - 1) / 2) * 2 * R,
				y: O.y - k * g.at.im
			}))
		)
	);
	/** A thin ring round each set of equal eigenvalues, so that touching dots are never two near ones. */
	const rings = $derived(
		groups
			.map((g, gi) => ({ key: gi, count: g.count, x: O.x + k * g.at.re, y: O.y - k * g.at.im }))
			.filter((g) => g.count > 1)
	);
	const coincide = $derived.by(() => {
		const counts = groups.map((g) => g.count);
		if (counts.includes(3)) return 'all three equal';
		if (counts.includes(2)) return 'two equal';
		return 'three different';
	});

	// --- the words ------------------------------------------------------------------------------------------------------
	const planeWords = $derived(
		`The complex plane of the eigenvalues, Re w across with ticks at ${reTicks.map((t) => figures(t)).join(', ')}, and Im w up. The eigenvalues are ${eigenWords(a.eigenvalues)}: ${coincide}${groups.some((g) => g.count > 1) ? ', drawn as touching dots' : ''}.`
	);
	const yesNo = (b: boolean) => (b ? 'yes' : 'no');
	const sizeTex = (x: number | undefined) =>
		x === undefined ? '' : x <= TOL ? '0' : figuresOf(x).tex;

	const waveMarks = (name: string) => [
		{ at: 0, label: 'none' },
		{
			at: WAVE_MAX,
			label: `${name} = ${figures(WAVE_MAX * preset.unit)}${scene.preset === 'mass-wave' ? ', the chapter’s' : ''}`
		}
	];
	const massMarks = $derived([
		{ at: 0, label: 'none' },
		{
			at: MASS_MAX,
			label:
				scene.preset === 'mass'
					? 'as heavy as the first'
					: `GM/r³ = ${figures(MASS_MAX * preset.unit)}`
		}
	]);
</script>

<div class="jordan-explorer">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Add a weak wave along the line to a single mass. Do the eigenvalues move?
			{:else}
				Add the wave across the line instead. What happens to the eigenvalues?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>No: they stay <Tex math="w" />, <Tex math="w" /> and <Tex math="-2w" />, but the table
					stops being diagonalizable, type II.</strong
				>
				The wave’s term <Tex math={'c_2\\,\\boldsymbol m\\boldsymbol m^{\\mathsf T}'} /> adds nothing
				to the traces, because <Tex
					math="\boldsymbol m\cdot\hat z = \boldsymbol m\cdot\boldsymbol m = 0"
				/>, so <Tex math="I" /> and <Tex math="J" /> stay those of the mass. But
				<Tex
					math={'(\\mathcal W - w)(\\mathcal W + 2w) = 3wc_2\\,\\boldsymbol m\\boldsymbol m^{\\mathsf T}'}
				/>
				is no longer zero; for the chapter’s <Tex math="w = 0.125" /> and <Tex math="c_2 = 0.05" /> its
				entries have the size 0.0094.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>They split into three different ones: type I.</strong> The wave along
				<Tex math="\hat x" /> has <Tex math="\boldsymbol m' = (0, 1, i)/\sqrt2" />, and
				<Tex math="\boldsymbol m'\cdot\hat z = i/\sqrt2" /> is not zero, so its term enters the traces:
				<Tex math="I = 6w^2 + 3wc_2'" />. For the chapter’s <Tex math="w = 0.125" /> and
				<Tex math="c_2' = 0.05" /> the eigenvalues are {across.eigen.join(', ')}, and
				<Tex math={`1 - 6J^2/I^3 = ${across.ratio}`} />.
			{:else if step === 1}
				The answer appears once a single mass has a wave along its line and nothing else: choose One
				mass and move “Add a wave along z”, or choose Mass + wave along its line.
			{:else}
				The answer appears once a single mass has the wave across its line instead: with One mass or
				Mass + wave along its line, move “Add a wave along x” and set the wave along z to zero.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="left">
			<svg
				class="plane"
				viewBox="0 0 {PW} {PH}"
				role="img"
				aria-label={planeWords}
				{@attach fitText((value) => (u = value))}
			>
				<text class="title" x="2" y="14">The eigenvalues, {unitWords[scene.preset]}</text>

				<!-- the axes, their ticks and names -->
				<line class="axis" x1={O.x - 1.2 * SPAN} x2={O.x + 1.2 * SPAN} y1={O.y} y2={O.y} />
				<line class="axis" x1={O.x} x2={O.x} y1={O.y + 0.8 * SPAN} y2={O.y - 0.8 * SPAN} />
				{#each reTicks as t (t)}
					<line class="tick" x1={O.x + k * t} x2={O.x + k * t} y1={O.y - 3} y2={O.y + 3} />
					<text class="small dim mid" x={f1(O.x + k * t)} y={f1(O.y + 15 * u)}>{figures(t)}</text>
				{/each}
				<text class="small dim end" x={f1(O.x - 5 * u)} y={f1(O.y + 17 * u)}>0</text>
				{#each imTicks as t (t)}
					<line class="tick" x1={O.x - 3} x2={O.x + 3} y1={O.y - k * t} y2={O.y - k * t} />
					<text class="small dim end halo" x={f1(O.x - 6 * u)} y={f1(O.y - k * t + 4 * u)}
						>{complexText({ re: 0, im: t })}</text
					>
				{/each}
				<text class="axis-name end" x={O.x + 1.2 * SPAN} y={f1(O.y - 7 * u)}
					>Re <tspan class="it">w</tspan></text
				>
				<text class="axis-name start" x={O.x + 6} y={O.y - 0.8 * SPAN + 2}
					>Im <tspan class="it">w</tspan></text
				>

				<!-- the eigenvalues: equal ones as touching dots in a ring -->
				{#each rings as g (g.key)}
					<rect
						class="ring"
						x={f1(g.x - g.count * R - 3 * u)}
						y={f1(g.y - R - 3 * u)}
						width={f1(2 * g.count * R + 6 * u)}
						height={f1(2 * R + 6 * u)}
						rx={f1(R + 3 * u)}
					/>
				{/each}
				{#each dots as d (d.key)}
					<circle class="dot" cx={f1(d.x)} cy={f1(d.y)} r={f1(R)} />
				{/each}

				<text class="small dim end" x={PW - 2} y={PH - 4}>Σ = 0 · {coincide}</text>
			</svg>

			<div class="table-wrap">
				<span class="lhs"><Tex math="\mathcal W =" /></span>
				<table class="matrix">
					<caption class="sr-only">
						The table 𝒲 {unitWords[scene.preset]}, row by row, each entry with its real part above
						its imaginary part.
					</caption>
					<tbody>
						{#each a.W as row, i (i)}
							<tr>
								{#each row as z, j (j)}
									{@const e = entryOf(z, a.length)}
									<td
										aria-label="row {i + 1}, column {j + 1}: {complexText({
											re: e.reZero ? 0 : z.re,
											im: e.imZero ? 0 : z.im
										})}"
									>
										<span class={['re', { faint: e.reZero }]} aria-hidden="true">{e.re}</span>
										<span class={['im', { faint: e.imZero }]} aria-hidden="true">{e.im}</span>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<dl class="readouts">
			<div class="row">
				<dt>The eigenvalues</dt>
				<dd>
					<span class="eq"
						><Tex math={`w = ${a.eigenvalues.map((w) => complexTex(w)).join(',\\ ')}`} /></span
					>
					<span class="also">{coincide}</span>
				</dd>
			</div>
			<div class="row">
				<dt>The invariants</dt>
				<dd>
					<span class="eq"><Tex math={`I = ${complexTex(a.I)}`} /></span>
					<span class="eq"><Tex math={`J = ${complexTex(a.J)}`} /></span>
				</dd>
			</div>
			<div class="row">
				<dt>The repeated-eigenvalue test</dt>
				<dd>
					{#if a.ratio}
						<span class="eq"><Tex math={`1 - 6J^2/I^3 = ${complexTex(a.ratio)}`} /></span>
					{:else}
						<span class="eq"><Tex math="1 - 6J^2/I^3" />&nbsp;undefined</span>
						<span class="also">
							<Tex math="I" /> is zero, below <Tex math={'10^{-9}|\\mathcal W|^2'} />
						</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Rank and singular values</dt>
				<dd>
					<span class="eq"><Tex math={`\\mathrm{rank}\\,\\mathcal W = ${a.rank}`} /></span>
					<span class="eq"
						><Tex math={`s_1, s_2, s_3 = ${sv.map((s) => figuresOf(s).tex).join(',\\ ')}`} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>What vanishes</dt>
				<dd class="tests">
					<span class="test">
						{#if a.w && a.productSize !== undefined}
							<span class="eq"
								><Tex
									math={`(\\mathcal W - w)(\\mathcal W + 2w) ${a.productSize <= TOL ? '= 0' : '\\neq 0'}`}
								/></span
							>
							<span class="also"
								>with <Tex math={`w = -J/I = ${complexTex(a.w)}`} />{#if a.productSize > TOL}; size
									<Tex math={`${sizeTex(a.productSize)}\\,|\\mathcal W|^2`} />, largest entry {figures(
										a.productLargest ?? 0,
										2
									)}{/if}</span
							>
						{:else}
							<span class="eq"><Tex math="(\mathcal W - w)(\mathcal W + 2w)" /></span>
							<span class="also"><Tex math="w = -J/I" /> undefined</span>
						{/if}
					</span>
					<span class="test">
						<span class="eq"
							><Tex math={`\\mathcal W^2 ${a.squareSize <= TOL ? '= 0' : '\\neq 0'}`} /></span
						>
						{#if a.squareSize > TOL}<span class="also"
								>size <Tex math={`${sizeTex(a.squareSize)}\\,|\\mathcal W|^2`} /></span
							>{/if}
					</span>
					<span class="test">
						<span class="eq"
							><Tex math={`\\mathcal W^3 ${a.cubeSize <= TOL ? '= 0' : '\\neq 0'}`} /></span
						>
						{#if a.cubeSize > TOL}<span class="also"
								>size <Tex math={`${sizeTex(a.cubeSize)}\\,|\\mathcal W|^3`} /></span
							>{/if}
					</span>
				</dd>
			</div>
			<div class="row shape">
				<dt>The shape</dt>
				<dd>
					<div class="leaf">
						<span class="letter">{a.shape}</span>
						<span class="leaf-words">
							<span class="leaf-name">type {a.shape} · {leaf.words}</span>
							<span class="leaf-example">{leaf.example}</span>
							<span class="leaf-poly"
								>minimal polynomial <Tex math={leaf.minimal} />{#if leaf.atRest}<span class="rest"
										>· possible at rest</span
									>{/if}</span
							>
						</span>
					</div>
					<ol class="path" aria-label="The questions of the chapter’s tree: {pathWords(a.path)}">
						{#each a.path as s (s.question)}
							<li aria-hidden="true">
								<Tex math={`${QUESTIONS[s.question]}\\,?`} />
								<span class="answer-word">{yesNo(s.yes)}</span>
							</li>
						{/each}
					</ol>
				</dd>
			</div>
		</dl>
	</div>

	<div class="bar-controls">
		<div class="groups">
			<div class="slot wide">
				<Segmented
					label="Presets"
					options={PRESETS.map((p) => ({
						value: p.key,
						label: p.label,
						icon:
							p.key === 'mass'
								? CircleIcon
								: p.key === 'two'
									? Atom01Icon
									: p.key === 'wave'
										? WaveIcon
										: p.key === 'mass-wave'
											? AudioWave01Icon
											: GridIcon,
						wide: p.key === 'three'
					}))}
					bind:value={() => scene.preset, setPreset}
				/>
			</div>
			<div class="slot">
				<Slider
					id="{uid}-z"
					label="Add a wave along z"
					icon={WaveIcon}
					min={0}
					max={WAVE_MAX}
					step={SLIDER_STEP}
					bind:value={() => scene.z, (v: number) => setSlider('z', v)}
					readout="{fixed(scene.z)} · c₂ = {figures(amount.c2)}"
					marks={waveMarks('c₂')}
					marksHint="in units of the preset’s largest eigenvalue"
				/>
			</div>
			<div class="slot">
				<Slider
					id="{uid}-x"
					label="Add a wave along x"
					icon={WaveIcon}
					min={0}
					max={WAVE_MAX}
					step={SLIDER_STEP}
					bind:value={() => scene.x, (v: number) => setSlider('x', v)}
					readout="{fixed(scene.x)} · c₂′ = {figures(amount.c2x)}"
					marks={waveMarks('c₂′')}
					marksHint="in units of the preset’s largest eigenvalue"
				/>
			</div>
			<div class="slot">
				<Slider
					id="{uid}-mass"
					label="Add a second mass"
					icon={CirclePlusIcon}
					min={0}
					max={MASS_MAX}
					step={SLIDER_STEP}
					bind:value={() => scene.mass, (v: number) => setSlider('mass', v)}
					readout="{fixed(scene.mass)} · GM/r³ = {figures(amount.mu)}"
					marks={massMarks}
					marksHint="on +x at unit distance"
				/>
			</div>
			<div class="slot controls">
				<button type="button" class="action" onclick={reset}>
					<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
					Back to the opening
				</button>
			</div>
		</div>
		<p class="hint">
			Tab reaches the presets and then the sliders; the arrow keys step a slider by {SLIDER_STEP}.
			Each slider counts in units of the preset’s largest eigenvalue, {figures(preset.unit)} here (1 for
			one wave and for the type III table, whose eigenvalues all vanish).
		</p>
	</div>

	<div class="notes">
		<p class="sr-only" aria-live="polite">{summaryOf(a)}</p>
		<ul class="legend" aria-hidden="true">
			<li><span class="dot-key"></span>an eigenvalue</li>
			<li>
				<span class="pair-key"><span class="dot-key"></span><span class="dot-key"></span></span>two
				equal eigenvalues
			</li>
			<li><span class="faint-key">0</span>a zero entry</li>
		</ul>
		<p class="note">
			The sliders add <Tex math={'c_2\\,\\boldsymbol m\\boldsymbol m^{\\mathsf T}'} />, a wave along
			<Tex math="\hat z" /> with <Tex math="\boldsymbol m = (1, i, 0)/\sqrt2" />;
			<Tex math={"c_2'\\,\\boldsymbol m'\\boldsymbol m'^{\\mathsf T}"} />, the same wave along
			<Tex math="\hat x" /> with <Tex math="\boldsymbol m' = (0, 1, i)/\sqrt2" />; and a mass on
			<Tex math="+\hat x" /> at unit distance, <Tex
				math={'(G M/r^3)(1 - 3\\hat x\\hat x^{\\mathsf T})'}
			/>. A quantity of degree <Tex math="k" /> in <Tex math="\mathcal W" /> counts as zero below
			<Tex math={'10^{-9}|\\mathcal W|^k'} />, with
			<Tex math={'|\\mathcal W| = \\sqrt{\\langle\\mathcal W|\\mathcal W\\rangle}'} /> and
			<Tex math={'\\langle T|U\\rangle = \\mathrm{tr}(T^\\dagger U)'} />; the singular values are
			the square roots of the eigenvalues of <Tex math="\mathcal W^\dagger\mathcal W" />. Where an
			eigenvalue repeats, the three are drawn as <Tex math="w" />, <Tex math="w" />, <Tex
				math="-2w"
			/> with
			<Tex math="w = -J/I" />. The Petrov letters are explained in chapter 9.4.
		</p>
	</div>
</div>

<style>
	.jordan-explorer {
		container-type: inline-size;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	/* --- the predictions ---------------------------------------------------------------- */

	.predict {
		padding: 0.75rem 0.9rem 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.steps {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.35rem;
	}

	.tag {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.pick {
		display: inline-flex;
		gap: 3px;
		padding: 2px;
		border-radius: 9px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.pick button {
		min-width: 1.9rem;
		min-height: 1.7rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.78rem/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.pick button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.pick button:focus-visible,
	.next:focus-visible,
	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.predict p {
		margin: 0;
		text-wrap: pretty;
	}

	.question {
		font: 500 0.9rem/1.45 var(--font-sans);
	}

	.answer {
		margin-top: 0.3rem !important;
		font: 400 0.8rem/1.5 var(--font-sans);
		color: var(--text-faint);
	}

	.answer.shown {
		color: var(--text-dim);
	}

	.answer strong {
		color: var(--text);
		font-weight: 600;
	}

	.next {
		margin-left: 0.3rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 330px) minmax(0, 1fr);
		justify-content: center;
		gap: 0.6rem 1.2rem;
		padding: 0.7rem 0.9rem 0.75rem;
		background: radial-gradient(circle at 30% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.left {
		display: grid;
		align-content: start;
		gap: 0.7rem;
		min-width: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.small {
		font-size: calc(10.5px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	.axis-name {
		font-size: calc(12px * var(--u, 1));
		fill: var(--text-dim);
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	tspan.it {
		font-size: 1.1em;
	}

	.mid {
		text-anchor: middle;
	}

	.start {
		text-anchor: start;
	}

	.end {
		text-anchor: end;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the plane: thin grey axes, ink dots, as in the chapter's diagram */
	.axis {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ring {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the table, between two thin brackets */
	.table-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.lhs {
		flex: none;
		font-size: 0.95rem;
	}

	.matrix {
		border-collapse: separate;
		border-spacing: 0;
		border-left: 1.4px solid var(--text);
		border-right: 1.4px solid var(--text);
		border-radius: 9px;
		padding: 0.1rem 0.25rem;
		font-size: 0.76rem;
		line-height: 1.25;
		font-variant-numeric: tabular-nums;
	}

	.matrix td {
		padding: 0.25rem 0.45rem;
		text-align: right;
		white-space: nowrap;
		vertical-align: top;
		border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
	}

	.matrix span {
		display: block;
	}

	.matrix .re {
		color: var(--text);
	}

	.matrix .im {
		color: var(--text-dim);
	}

	.matrix .faint {
		color: var(--text-faint);
		opacity: 0.7;
	}

	/* --- the readouts ------------------------------------------------------------------------- */

	.readouts {
		margin: 0;
		display: grid;
		align-content: start;
		gap: 0.5rem;
		font-size: 0.8rem;
		line-height: 1.4;
		min-width: 0;
	}

	.row {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.15rem 0.8rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.readouts dd.tests {
		display: grid;
		gap: 0.2rem;
	}

	.test {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.1rem 0.6rem;
	}

	.eq {
		display: inline-flex;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		font-weight: 600;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.shape dd {
		display: grid;
		gap: 0.35rem;
	}

	.leaf {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--text);
		border-radius: 8px;
		background: color-mix(in srgb, var(--text) 4%, transparent);
	}

	.letter {
		flex: none;
		min-width: 2.2rem;
		font: 700 1.5rem/1 var(--font-serif);
		text-align: center;
	}

	.leaf-words {
		display: grid;
		gap: 0.05rem;
		min-width: 0;
	}

	.leaf-name {
		font-weight: 600;
	}

	.leaf-example,
	.leaf-poly {
		color: var(--text-dim);
		font-size: 0.74rem;
	}

	.rest {
		margin-left: 0.35rem;
	}

	.path {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.path li {
		display: inline-flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	.path li:not(:last-child)::after {
		content: '→';
		margin-left: 0.25rem;
		color: var(--text-faint);
	}

	.answer-word {
		font-style: italic;
		color: var(--text);
	}

	/* --- the controls and the notes ----------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.1rem;
		align-items: center;
	}

	.slot {
		min-width: 0;
	}

	.slot.wide {
		grid-column: 1 / -1;
	}

	.slot.controls {
		display: flex;
		align-items: center;
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.notes {
		padding: 0.65rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0 0 0.5rem;
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

	.dot-key {
		flex: none;
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 50%;
		background: var(--text);
	}

	.pair-key {
		display: inline-flex;
		padding: 2px;
		border: 0.9px solid var(--text);
		border-radius: 0.6rem;
	}

	.faint-key {
		color: var(--text-faint);
		opacity: 0.7;
		font-variant-numeric: tabular-nums;
	}

	.note {
		margin: 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	/* on a phone the readouts sit under the plane */
	@container (max-width: 640px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			padding: 0.5rem 0.6rem 0.7rem;
		}

		.left,
		.readouts {
			width: 100%;
			max-width: 420px;
		}

		.groups {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
