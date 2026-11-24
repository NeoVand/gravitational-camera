<script lang="ts">
	/**
	 * Chapter 6.5's stress–energy tensor as a table. A grid of sixteen cells T^{μν}, rows and columns 0, x, y, z, on
	 * three faint blocks (the energy density; the energy flux over c and c times the momentum density, shaded alike
	 * to show the symmetry; the momentum flux), each cell its value to three figures in the content's units, tinted
	 * orange when positive and blue when negative, as the figures tint a stretch and a squeeze, and faint when zero.
	 * A selector of seven contents, a boost slider β from −0.9 to 0.9 and its direction, x or z; the table follows
	 * 6.2's rule. Beside it the readouts: T⁰⁰, the trace, the source T⁰⁰ + T¹¹ + T²² + T³³, the integrated stresses of
	 * a bound body, and T_{μν}k^μk^ν along ±z. Everything is computed in ./stress-energy-table.ts. Two predictions at
	 * the top are answered once the reader has done what each asks. Nothing moves by itself, so reduced motion
	 * changes nothing but the cells' fades.
	 */
	import {
		AlignVerticalSpaceBetweenIcon,
		BoxIcon,
		BubblesIcon,
		Cylinder01Icon,
		DashboardSpeed02Icon,
		FlashlightIcon,
		RulerIcon,
		WindIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import {
		ALONG,
		BOOST,
		CONTENTS,
		INDEX,
		OPENING,
		ORDER,
		alongRay,
		blockOf,
		etaTex,
		etaWords,
		firstDone,
		frameWords,
		hundredths,
		integrated,
		keyed,
		largest,
		partSums,
		secondAnswer,
		secondDone,
		signOf,
		source,
		speed,
		strength,
		tableOf,
		tableWords,
		three,
		threeTex,
		trace,
		two,
		type Content,
		type Direction,
		type Ray
	} from './stress-energy-table';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let content = $state<Content>(OPENING.content);
	let beta = $state(OPENING.beta);
	let direction = $state<Direction>(OPENING.direction);
	let ray = $state<Ray>(1);

	function setContent(c: Content) {
		content = c;
		note();
	}

	function setBeta(v: number) {
		const next = hundredths(v);
		if (next === beta) return;
		beta = next;
		note();
	}

	function setDirection(d: Direction) {
		direction = d;
		note();
	}

	/** The arrow keys step the slider by 0.05, and Page Up and Page Down by 0.3. */
	function sliderKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const d = {
			ArrowRight: BOOST.key,
			ArrowUp: BOOST.key,
			ArrowLeft: -BOOST.key,
			ArrowDown: -BOOST.key,
			PageUp: BOOST.page,
			PageDown: -BOOST.page
		}[e.key];
		if (d === undefined) return;
		e.preventDefault();
		setBeta(keyed(beta, Math.sign(d), Math.abs(d)));
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	const revealed = $derived(step === 1 ? first : second);
	const answer2 = secondAnswer();

	function note() {
		const s = { content, beta, direction };
		first = firstDone(first, s);
		second = secondDone(second, s);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const T = '\\htmlClass{q-matter}{T}';
	const BETA = '\\htmlClass{q-obs}{\\beta}';
	const GAMMA = '\\htmlClass{q-obs}{\\gamma}';
	const ETA = '\\htmlClass{q-obs}{\\eta}';
	const METRIC = '\\htmlClass{q-field}{\\eta}';
	const RHO = '\\htmlClass{q-matter}{\\rho}';
	const PRESSURE = '\\htmlClass{q-matter}{p}';
	const U = '\\htmlClass{q-matter}{\\mathcal U}';
	const UP = (a: string, b: string) => `${T}^{${a}${b}}`;
	const STRESSES = `${UP('1', '1')} + ${UP('2', '2')} + ${UP('3', '3')}`;

	const info = $derived(CONTENTS[content]);
	const table = $derived(tableOf(content, beta, direction));
	const max = $derived(largest(table));
	const sp = $derived(speed(beta));
	const integral = $derived(info.bound ? integrated(content, beta, direction) : undefined);
	const parts = $derived(partSums(content));
	const moving = $derived(beta !== 0);

	/** A value in the content's units, in LaTeX; zero bare. */
	const inUnits = (v: number, unit = info.unit) =>
		signOf(v) === 'zero' ? '0' : `${threeTex(v)}\\,${unit}`;
	const signed = (v: number) => (v > 0 ? '+' : '') + threeTex(v);

	const t00 = $derived(table[0][0]);
	const tr = $derived(trace(table));
	const src = $derived(source(table));
	const null_ = $derived(alongRay(table, ray));
	const flowSum = $derived(integral ? integral[1][1] + integral[2][2] + integral[3][3] : 0);

	const BLOCKS = [
		{ name: 'energy', area: '2 / 2 / 3 / 3' },
		{ name: 'flux', area: '2 / 3 / 3 / 6' },
		{ name: 'flux', area: '3 / 2 / 6 / 3' },
		{ name: 'momentum', area: '3 / 3 / 6 / 6' }
	];

	// --- the words --------------------------------------------------------------------------------------------------
	const description = $derived(
		`The table T^μν of ${info.words}, ${frameWords(beta, direction)}, in units of ${info.unitWords}, rows and columns 0, x, y, z: ${tableWords(table)}. ` +
			`Positive entries are tinted orange, negative ones blue, and zeros are faint. ` +
			`The trace is ${three(tr)} and the source T⁰⁰ + T¹¹ + T²² + T³³ is ${three(src)}.`
	);

	const ICONS = {
		dust: BubblesIcon,
		gas: WindIcon,
		shell: Cylinder01Icon,
		beam: FlashlightIcon,
		bench: RulerIcon,
		box: BoxIcon,
		casimir: AlignVerticalSpaceBetweenIcon
	};
	const OPTIONS = ORDER.map((c) => ({
		value: c,
		label: CONTENTS[c].label,
		icon: ICONS[c],
		wide: c === 'casimir'
	}));
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="stress-table">
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
				Put the beam’s light in a mirrored box. Does the box pull twice as hard as its light’s
				energy, as the beam did?
			{:else}
				Boost the beam along itself at <Tex math="0.6c" />. By what factor does every entry fall?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No.</strong> The light’s pressure, <Tex math={`\\tfrac13${U}`} trust /> each way, gives
				<Tex math={`\\int(${STRESSES})\\,dV = +E`} trust />, and the walls’ tension gives
				<Tex math="-E" />, so the integral of the stresses is zero and the box pulls with
				<Tex math="E/c^2" /> (and the walls’ own mass), not <Tex math="2E/c^2" />. Its source is <Tex
					math="1.00\,E/V"
				/>, its energy density alone; the free beam’s was <Tex math="2.00\,F/c" />, twice its <Tex
					math={UP('0', '0')}
					trust
				/>.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>Four.</strong> At <Tex math="0.6c" />, <Tex
					math={`${ETA} = \\operatorname{artanh} 0.6 = \\ln 2`}
					trust
				/>, and every entry is multiplied by <Tex
					math={`${GAMMA}^2(1 - ${BETA})^2 = e^{-2${ETA}} = \\tfrac14`}
					trust
				/>: chapter 6.3’s Doppler factor <Tex math={`e^{-${ETA}}`} trust /> for each photon’s energy,
				times the same for the number of photons met each second. The four entries fall together from
				<Tex math="1.00" /> to <Tex math={`${threeTex(answer2.factors[0])}\\,F/c`} />, the trace
				stays <Tex math={threeTex(answer2.trace)} />, and the source falls from <Tex math="2.00" /> to
				<Tex math={`${threeTex(answer2.source)}\\,F/c`} />. Against the beam, at <Tex
					math="-0.6c"
				/>, they grow fourfold.
			{:else if step === 1}
				The answer appears once you have chosen “Light in a box”, with the boost at 0.
			{:else}
				The answer appears once you have chosen “Beam along z”, the direction z, and the boost at
				0.60, along the beam.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="side">
			<p class="title">
				<Tex math={`${T}^{\\mu\\nu}`} trust /> of {info.words}, {frameWords(beta, direction)}, in
				units of <Tex math={info.unit} trust />
			</p>
			<div class="tensor" role="img" aria-label={description}>
				{#each BLOCKS as b, i (i)}
					<div class="block {b.name}" style:grid-area={b.area} aria-hidden="true"></div>
				{/each}
				<span class="head corner" aria-hidden="true"
					><span class="it">μ</span>\<span class="it">ν</span></span
				>
				{#each INDEX as name, c (name)}
					<span class="head" style:grid-area="1 / {c + 2}" aria-hidden="true"
						><span class={{ it: c > 0 }}>{name}</span></span
					>
					<span class="head row" style:grid-area="{c + 2} / 1" aria-hidden="true"
						><span class={{ it: c > 0 }}>{name}</span></span
					>
				{/each}
				{#each table as row, r (r)}
					{#each row as v, c (c)}
						{@const sign = signOf(v)}
						<span
							class={['cell', sign, blockOf(r, c)]}
							style:grid-area="{r + 2} / {c + 2}"
							style:--k={strength(v, max)}
							aria-hidden="true">{three(v)}</span
						>
					{/each}
				{/each}
			</div>
			<ul class="legend" aria-hidden="true">
				<li><span class="key energy"></span>energy density</li>
				<li><span class="key flux"></span>energy flux / c and c × momentum density</li>
				<li><span class="key momentum"></span>momentum flux</li>
				<li><span class="key positive"></span>positive</li>
				<li><span class="key negative"></span>negative</li>
				<li><span class="key zero"></span>zero</li>
			</ul>
			<p class="small">
				The indices <span class="it">x</span>, <span class="it">y</span>, <span class="it">z</span>
				are 1, 2, 3. The spatial block is the flow of momentum: <Tex math={`+${PRESSURE}`} trust /> for
				a gas, a negative number for a tension.
			</p>
		</div>

		<dl class="readouts">
			<div class="row">
				<dt>The boost</dt>
				<dd>
					{@render eq([`${BETA} = ${two(beta).replace('−', '-')}`])}
					{@render eq([`${GAMMA} = ${threeTex(sp.gamma)}`])}
					{@render eq([`${ETA} = \\operatorname{artanh}${BETA} = ${etaTex(sp.eta)}`])}
				</dd>
			</div>
			<div class="row">
				<dt>Energy density</dt>
				<dd>{@render eq([UP('0', '0'), `= ${inUnits(t00)}`])}</dd>
			</div>
			<div class="row">
				<dt>The trace</dt>
				<dd>
					{@render eq([
						`${METRIC}_{\\mu\\nu}${T}^{\\mu\\nu} = -${UP('0', '0')} + ${STRESSES}`,
						`= ${inUnits(tr)}`
					])}
					<span class="mark">same for every observer</span>
				</dd>
			</div>
			<div class="row">
				<dt>The source</dt>
				<dd>
					{@render eq([`${UP('0', '0')} + ${STRESSES}`, `= ${inUnits(src)}`])}
					<span class="mark">what gravitates, in this frame</span>
					{#if signOf(t00) !== 'zero'}
						<span class="also"
							>{three(src / t00)} times <Tex
								math={UP('0', '0')}
								trust
							/>{#if info.bound && !moving}: the body pulls with its energy over <Tex
									math="c^2"
								/>{/if}.</span
						>
					{/if}
				</dd>
			</div>
			{#if info.bound && integral}
				<div class="row">
					<dt>
						The stresses, {info.bound.measure === 'perMetre' ? 'per metre' : 'over the body'}
					</dt>
					<dd>
						<span class="also"
							>In its own frame:
							{#each parts as p, i (p.name)}{p.name}
								<Tex math={`${signed(p.sum)}\\,${info.bound.integral}`} />{i < parts.length - 1
									? ', '
									: ''}{/each}, so <Tex
								math={`\\int ${T}^{ij}\\,${info.bound.measure === 'perMetre' ? 'dA' : 'dV'} = 0`}
								trust
							/> for all nine.</span
						>
						{#if moving}
							{@render eq([
								`\\int(${STRESSES})\\,${info.bound.measure === 'perMetre' ? 'dA' : 'dV'}`,
								`= ${inUnits(flowSum, info.bound.integral)}`
							])}
							<span class="also"
								>in this frame, where the body moves and carries its momentum along.</span
							>
						{/if}
					</dd>
				</div>
			{/if}
			<div class="row">
				<dt>Along a ray</dt>
				<dd>
					<div class="pick" role="group" aria-label="Direction of the ray">
						{#each [1, -1] as const as r (r)}
							<button
								type="button"
								aria-pressed={ray === r}
								aria-label="Ray along {r > 0 ? '+' : '−'}z"
								onclick={() => (ray = r)}>{r > 0 ? '+' : '−'}<span class="it">z</span></button
							>
						{/each}
					</div>
					{@render eq([
						`${T}_{\\mu\\nu}k^\\mu k^\\nu = ${UP('0', '0')} ${ray > 0 ? '-' : '+'} 2${UP('0', 'z')} + ${UP('z', 'z')}`,
						`= ${inUnits(null_)}`
					])}
					<span class="also"
						>with <Tex
							math={`k^\\mu = (1, 0, 0, ${ray > 0 ? '1' : '-1'})`}
						/>{#if signOf(null_) === 'negative' && content === 'casimir'}: negative, so the null
							energy condition fails; a real ray also crosses the plates, whose mass keeps its <Tex
								math="\mathcal N"
							/> positive{:else if signOf(null_) === 'negative'}: negative only because the bench’s
							own mass, far larger than its tension, is left out{:else if signOf(null_) === 'zero' && content === 'beam'}:
							zero for light moving with the ray{/if}.</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<div class="bar">
		<Segmented label="Contents" options={OPTIONS} bind:value={() => content, setContent} />
		<div class="controls">
			<div class="slot" onkeydowncapture={sliderKeys} role="presentation">
				<Slider
					id="{uid}-beta"
					label="Boost"
					icon={DashboardSpeed02Icon}
					min={BOOST.min}
					max={BOOST.max}
					step={BOOST.step}
					bind:value={() => beta, setBeta}
					readout="β = {two(beta)}, η = {etaWords(sp.eta)}"
					ends={['−0.9', '0.9']}
					marks={[
						{ at: -ALONG, label: 'β = −0.6, η = −ln 2' },
						{ at: 0, label: 'β = 0, at rest' },
						{ at: ALONG, label: 'β = 0.6, η = ln 2' }
					]}
					marksHint="the ticks mark rest and 0.6c either way"
				/>
			</div>
			<div class="pick" role="group" aria-label="Direction of the boost">
				{#each ['x', 'z'] as const as d (d)}
					<button type="button" aria-pressed={direction === d} onclick={() => setDirection(d)}
						>along <span class="it">{d}</span></button
					>
				{/each}
			</div>
		</div>
		<p class="hint">
			The slider sets the speed <Tex math={`${BETA}c`} trust /> of an observer moving along <Tex
				math="x"
			/> or <Tex math="z" />, who sees the contents move the other way; the table follows chapter
			6.2’s rule, <Tex
				math={`${T}'^{\\mu\\nu} = \\Lambda^\\mu{}_\\alpha\\Lambda^\\nu{}_\\beta${T}^{\\alpha\\beta}`}
				trust
			/>. It takes the arrow keys after Tab, a step of 0.05, and Page Up and Page Down a step of
			0.3.
		</p>
	</div>

	<p class="note">
		{#if content === 'dust'}
			Dust is grains that exert no forces on one another, of density <Tex math={RHO} trust /> in their
			own frame, with <Tex math={`${T}^{\\mu\\nu} = ${RHO}\\,u^\\mu u^\\nu`} trust />. Boosted at <Tex
				math="0.6c"
			/>, its entries are <Tex math="1.5625" />, <Tex math="0.9375" /> and <Tex math="0.5625" /> times
			<Tex math={`${RHO}c^2`} trust />, with the sign of the energy flux that of the dust’s motion.
		{:else if content === 'gas'}
			A gas at rest has <Tex
				math={`\\mathrm{diag}(${RHO}c^2, ${PRESSURE}, ${PRESSURE}, ${PRESSURE})`}
				trust
			/>. Here <Tex math={`${PRESSURE} = 0.1\\,${RHO}c^2`} trust />, as at a neutron star’s centre,
			so that it shows; the air in a room has about <Tex math={'10^{-15}'} /> of its <Tex
				math={`${RHO}c^2`}
				trust
			/>.
		{:else if content === 'shell'}
			The chapter’s ball of gas in a thin steel shell, averaged over the whole body: <Tex
				math={`\\langle ${T}^{\\mu\\nu}\\rangle = (1/V)\\int ${T}^{\\mu\\nu}\\,dV`}
				trust
			/>, in units of its energy <Tex math="E" /> over its volume <Tex math="V" />. The gas’s
			pressure gives <Tex math={`+3${PRESSURE}V`} trust /> and the steel’s tension <Tex
				math={`-3${PRESSURE}V`}
				trust
			/>, here exaggerated to <Tex math="0.15\,E" /> so that they show. The average follows 6.2’s rule
			exactly, because the body’s table does not change in time.
		{:else if content === 'beam'}
			A beam of light along <Tex math="+z" /> with the energy flux <Tex math="F" />, in watts per
			square metre: <Tex math={`${T}^{\\mu\\nu} = (F/c)\\,k^\\mu k^\\nu`} trust /> with <Tex
				math="k^\mu = (1, 0, 0, 1)"
			/>, null dust. No wall cancels its pressure, so its source is twice its energy density.
		{:else if content === 'bench'}
			A beam of power <Tex math="P" /> along <Tex math="+z" /> and the bench that holds the laser and
			the absorber apart, which the beam’s push puts in tension: a momentum flux of <Tex
				math="-P/c"
			/> over its cross-section, a line of <Tex math="-P/c^3" /> per metre. Both are averaged over a cross-section
			<Tex math="A" /> that holds them, per metre of their length; the bench’s own mass is left out. A
			pixel reads <Tex math="2P/c^3" /> per metre only when the bench is much farther from it than the
			beam.
		{:else if content === 'box'}
			Light of energy <Tex math="E" /> in a box with mirrored walls, averaged over the box. The light,
			many beams in every direction, has the pressure <Tex math={`\\tfrac13${U}`} trust /> each way, so
			<Tex math="+\tfrac13E" /> along each axis; the walls’ tension gives <Tex math="-\tfrac13E" />.
			The walls’ own mass is left out.
		{:else}
			The vacuum between two flat metal plates <Tex math="a = 1\,\mu\mathrm m" /> apart, their normal
			along
			<Tex math="z" />: <Tex math={`${T}^{\\mu\\nu} = u\\,(1, -1, -1, 3)`} trust /> on the diagonal, with
			<Tex math={'u = -\\pi^2\\hbar c/720a^4 = -4.3\\times10^{-4}\\,\\mathrm{J\\,m^{-3}}'} />, in
			units of <Tex math="|u|" />. Across the plates the momentum flux <Tex math="3u" /> is a tension,
			since they attract.
		{/if}
	</p>
</div>

<style>
	.stress-table {
		/* positive entries in the figures' orange, negative in their blue, as a stretch and a squeeze */
		--plus: var(--accent);
		--minus: var(--accent-2);
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
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

	.pick {
		display: inline-flex;
		flex: none;
		gap: 3px;
		padding: 2px;
		border-radius: 9px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.pick button {
		min-width: 1.9rem;
		min-height: 1.7rem;
		padding: 0 0.45rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.78rem/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		cursor: pointer;
	}

	.pick button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.pick button:focus-visible,
	.next:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	/* --- the table ----------------------------------------------------------------------- */

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 1rem 1.4rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 30% 40%, var(--bg-raised) 0%, var(--bg-sunken) 90%);
	}

	.side {
		min-width: 0;
	}

	.title {
		margin: 0 0 0.5rem;
		font: 500 0.8rem/1.4 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.tensor {
		display: grid;
		grid-template-columns: 1.7rem repeat(4, minmax(0, 1fr));
		grid-template-rows: 1.5rem repeat(4, 2.5rem);
		gap: 6px;
		padding: 0 4px 4px 0;
	}

	/* the blocks reach into the gaps around their cells, so that each reads as one patch */
	.block {
		margin: -2px;
		border-radius: 8px;
	}

	.block.energy {
		background: color-mix(in srgb, var(--text) 11%, transparent);
	}

	.block.flux {
		background: color-mix(in srgb, var(--text) 6.5%, transparent);
	}

	.block.momentum {
		background: color-mix(in srgb, var(--text) 3%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 8%, transparent);
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: center;
		font: 500 0.82rem/1 var(--font-sans);
		color: var(--text-dim);
	}

	.head.row {
		justify-content: flex-end;
		padding-right: 0.35rem;
	}

	.corner {
		grid-area: 1 / 1;
		font-size: 0.72rem;
		color: var(--text-faint);
	}

	.cell {
		/* the block's patch shows round each cell, whose own tint is its sign */
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 3px;
		border-radius: 6px;
		border: 1px solid transparent;
		font: 500 0.84rem/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		color: var(--text);
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.cell.positive {
		background: color-mix(in srgb, var(--plus) calc(var(--k) * 38%), transparent);
		border-color: color-mix(in srgb, var(--plus) calc(25% + var(--k) * 50%), transparent);
	}

	.cell.negative {
		background: color-mix(in srgb, var(--minus) calc(var(--k) * 38%), transparent);
		border-color: color-mix(in srgb, var(--minus) calc(25% + var(--k) * 50%), transparent);
	}

	.cell.zero {
		color: var(--text-faint);
		font-weight: 400;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.9rem;
		margin: 0.55rem 0 0;
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

	.key {
		display: inline-block;
		flex: none;
		width: 0.9rem;
		height: 0.7rem;
		border-radius: 3px;
		border: 1px solid transparent;
	}

	.key.energy {
		background: color-mix(in srgb, var(--text) 11%, transparent);
	}

	.key.flux {
		background: color-mix(in srgb, var(--text) 6.5%, transparent);
	}

	.key.momentum {
		background: color-mix(in srgb, var(--text) 3%, transparent);
		border-color: color-mix(in srgb, var(--text) 10%, transparent);
	}

	.key.positive {
		background: color-mix(in srgb, var(--plus) 38%, transparent);
		border-color: color-mix(in srgb, var(--plus) 75%, transparent);
	}

	.key.negative {
		background: color-mix(in srgb, var(--minus) 38%, transparent);
		border-color: color-mix(in srgb, var(--minus) 75%, transparent);
	}

	.key.zero {
		border: 1px dashed color-mix(in srgb, var(--text) 30%, transparent);
	}

	.small {
		margin: 0.45rem 0 0;
		font-size: 0.72rem;
		line-height: 1.45;
		color: var(--text-faint);
		text-wrap: pretty;
	}

	/* --- the readouts -------------------------------------------------------------------- */

	.readouts {
		margin: 0;
		display: grid;
		align-content: start;
		gap: 0.55rem;
		min-width: 0;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.row {
		display: grid;
		gap: 0.1rem;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
		font-size: 0.74rem;
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

	.readouts dd .pick {
		align-self: center;
	}

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
	}

	.mark {
		font: italic 500 0.78rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	/* --- the controls ---------------------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.7rem 1.2rem;
		align-items: center;
	}

	.slot {
		min-width: 0;
	}

	.controls > .pick {
		justify-self: start;
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.note {
		margin: 0;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	@media (max-width: 640px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			padding: 0.7rem 0.6rem 0.8rem;
		}
	}

	@media (max-width: 420px) {
		.tensor {
			grid-template-columns: 1.4rem repeat(4, minmax(0, 1fr));
			gap: 4px;
		}

		.block {
			margin: -1px;
		}

		.cell {
			margin: 2px;
			font-size: 0.78rem;
		}

		.controls {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cell {
			transition: none;
		}
	}
</style>
