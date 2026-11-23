<script lang="ts">
	/**
	 * A working page, not linked and not indexed: the three candidate palettes for the colour roles of the tutorial's
	 * equations, on the cream and the umber grounds, with each colour's contrast and the view of a reader with
	 * deuteranopia or protanopia. Neo picks one; A is the default in app.css.
	 */
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import {
		DEFAULT_PALETTE,
		GROUNDS,
		INK,
		LIMITS,
		PALETTES,
		RESERVED,
		ROLE_INFO,
		ROLES,
		audit,
		simulate,
		type Role,
		type Theme,
		type Vision
	} from '#lib/tutorial/colour.js';

	type Key = keyof typeof PALETTES;
	const KEYS = Object.keys(PALETTES) as Key[];
	let chosen: Key = $state(DEFAULT_PALETTE);

	const THEMES: { theme: Theme; name: string }[] = [
		{ theme: 'dark', name: 'Umber' },
		{ theme: 'light', name: 'Cream' }
	];
	const VISIONS: { vision: Vision; name: string }[] = [
		{ vision: 'normal', name: 'Full colour vision' },
		{ vision: 'deuteranopia', name: 'Deuteranopia (no green cones)' },
		{ vision: 'protanopia', name: 'Protanopia (no red cones)' }
	];

	const r = (role: Role, tex: string) => `\\htmlClass{q-${role}}{${tex}}`;
	const SAMPLES = [
		`${r('curv', '\\mathcal{E}')}_{ij} = \\partial_i \\partial_j ${r('field', '\\Phi')}`,
		`\\nabla^2 ${r('field', '\\Phi')} = 4\\pi G ${r('matter', '\\rho')}`,
		`\\ddot{\\xi}^i = -${r('curv', '\\mathcal{E}')}_{ij}\\, \\xi^j`,
		`${r('curv', 'R')}_{\\mu\\nu} - \\tfrac12 ${r('curv', 'R')}\\, ${r('field', 'g')}_{\\mu\\nu} = \\frac{8\\pi G}{c^4}\\, ${r('matter', 'T')}_{\\mu\\nu}`,
		`\\mathrm{d}${r('obs', '\\tau')}^2 = \\Bigl(1 - \\frac{${r('obs', 'v')}^2}{c^2}\\Bigr)\\mathrm{d}t^2, \\qquad ${r('obs', 'u')}^\\mu = \\frac{\\mathrm{d}x^\\mu}{\\mathrm{d}${r('obs', '\\tau')}}`,
		`${r('light', 'F')} = ${r('light', 'E')} + ic\\,${r('light', 'B')}, \\qquad ${r('curv', '\\mathcal{W}')} = ${r('curv', '\\mathcal{E}')} + i\\,${r('curv', '\\mathcal{B}')}`
	];

	/** The variables of one panel: the ground and ink of a theme, and the role colours, as one reader sees them. */
	function panel(key: Key, theme: Theme, vision: Vision): string {
		const g = GROUNDS[theme];
		const s = (hex: string) => simulate(hex, vision);
		const vars = [
			`--bg: ${s(g.bg)}`,
			`--bg-raised: ${s(g['bg-raised'])}`,
			`--text: ${s(INK[theme])}`,
			...ROLES.map((role) => `--q-${role}: ${s(PALETTES[key][theme][role])}`)
		];
		return vars.join('; ');
	}

	const audits = $derived(
		Object.fromEntries(
			KEYS.map((k) => [k, { dark: audit(PALETTES[k], 'dark'), light: audit(PALETTES[k], 'light') }])
		) as Record<Key, Record<Theme, ReturnType<typeof audit>>>
	);

	const ok = (k: Key) =>
		THEMES.every(({ theme }) => {
			const a = audits[k][theme];
			return (
				a.minContrast >= LIMITS.contrast &&
				a.fromReserved >= LIMITS.reserved &&
				a.fromInk >= LIMITS.ink &&
				a.separation.normal >= LIMITS.separation.normal &&
				a.separation.deuteranopia >= LIMITS.separation.deuteranopia &&
				a.separation.protanopia >= LIMITS.separation.protanopia
			);
		});

	const fmt = (x: number, digits = 2) => x.toFixed(digits);
</script>

<svelte:head>
	<title>Equation palettes · Tutorial · Gravitational Camera</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<SiteHeader current="tutorial" />

<main>
	<header>
		<p class="kicker">Tutorial · working page</p>
		<h1>The colours of the equations</h1>
		<p class="lede">
			Three candidate palettes for the five colour roles. Each is shown on the umber and the cream
			grounds, as seen with full colour vision and with the two common red-green deficiencies.
			Palette {DEFAULT_PALETTE} is the site's default until one is chosen.
		</p>
	</header>

	<div class="choose" role="radiogroup" aria-label="Palette">
		{#each KEYS as k (k)}
			<button
				type="button"
				role="radio"
				aria-checked={chosen === k}
				class="candidate"
				data-palette={k}
				onclick={() => (chosen = k)}
			>
				<span class="letter">{k}</span>
				<span class="name">{PALETTES[k].name}</span>
				<span class="swatches" aria-hidden="true">
					{#each THEMES as { theme } (theme)}
						<span class="ground" style:background={GROUNDS[theme].bg}>
							{#each ROLES as role (role)}
								<span class="dot" style:background={PALETTES[k][theme][role]}></span>
							{/each}
						</span>
					{/each}
				</span>
				<span class={['verdict', { pass: ok(k) }]}
					>{ok(k) ? 'meets every limit' : 'misses a limit'}</span
				>
			</button>
		{/each}
	</div>

	<p class="note">{PALETTES[chosen].note}</p>

	<section class="grid" aria-label="Palette {chosen} on both grounds">
		{#each VISIONS as { vision, name } (vision)}
			<h2 class="vision">{name}</h2>
			<div class="pair">
				{#each THEMES as { theme, name: ground } (theme)}
					<div class="panel" style={panel(chosen, theme, vision)} data-theme-panel={theme}>
						<p class="ground-name">{ground}</p>
						{#each SAMPLES as tex (tex)}
							<Tex math={tex} display trust />
						{/each}
						<p class="prose">
							The tide <Tex math={r('curv', '\\mathcal{E}_{ij}')} trust /> of a mass
							<Tex math={r('matter', 'M')} trust /> is the Hessian of its potential
							<Tex math={r('field', '\\Phi')} trust />, measured by an observer moving at
							<Tex math={r('obs', 'v')} trust />.
						</p>
					</div>
				{/each}
			</div>
		{/each}
	</section>

	<section aria-labelledby="numbers">
		<h2 id="numbers">The numbers</h2>
		<p class="key">
			Contrast is the WCAG ratio, at least {LIMITS.contrast} : 1 on the page, a raised card and a sunken
			well. Distances are in OKLab: between roles at least {LIMITS.separation.normal} with full colour
			vision and
			{LIMITS.separation.deuteranopia} with either deficiency (simulated as Machado, Oliveira and Fernandes,
			2009); from the accent, the figures' orange and blue at least {LIMITS.reserved}; from the ink
			at least {LIMITS.ink}.
		</p>
		{#each THEMES as { theme, name } (theme)}
			{@const a = audits[chosen][theme]}
			<h3>{name}</h3>
			<div class="table">
				<table>
					<thead>
						<tr>
							<th>Role</th>
							<th>Colour</th>
							<th class="right">on page</th>
							<th class="right">on card</th>
							<th class="right">in well</th>
						</tr>
					</thead>
					<tbody>
						{#each a.contrasts as c (c.role)}
							<tr>
								<td>{ROLE_INFO[c.role].name}</td>
								<td
									><span class="chip" style:background={PALETTES[chosen][theme][c.role]}
									></span><code>{PALETTES[chosen][theme][c.role]}</code></td
								>
								{#each ['bg', 'bg-raised', 'bg-sunken'] as const as g (g)}
									<td class={['right', { low: c.ratios[g] < LIMITS.contrast }]}
										>{fmt(c.ratios[g])}</td
									>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="summary">
				Least distance between roles: {fmt(a.separation.normal, 3)} (full), {fmt(
					a.separation.deuteranopia,
					3
				)}
				(deuteranopia), {fmt(a.separation.protanopia, 3)} (protanopia). From the reserved colours ({Object.keys(
					RESERVED[theme]
				).join(', ')}): {fmt(a.fromReserved, 3)}. From the ink: {fmt(a.fromInk, 3)}.
			</p>
		{/each}
	</section>
</main>

<style>
	main {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 var(--gutter) 6rem;
		box-sizing: content-box;
		font: 400 1.05rem/1.6 var(--font-serif);
	}

	header {
		max-width: 44rem;
		margin: 4rem 0 2rem;
	}

	.kicker {
		margin: 0 0 0.8rem;
		font: italic 400 1.05rem/1.2 var(--font-serif);
		color: var(--accent);
	}

	h1 {
		margin: 0 0 1rem;
		font: 400 clamp(2.2rem, 5.5vw, 3.2rem) / 1.05 var(--font-serif);
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0;
		color: var(--text-dim);
	}

	.choose {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.8rem;
	}

	.candidate {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.3rem 0.7rem;
		padding: 0.8rem 0.9rem;
		text-align: left;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 10px;
		cursor: pointer;
	}

	.candidate[aria-checked='true'] {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent);
	}

	.letter {
		grid-row: span 2;
		font: 500 1.8rem/1 var(--font-serif);
		color: var(--text-faint);
	}

	.candidate[aria-checked='true'] .letter {
		color: var(--accent);
	}

	.name {
		font: 500 1rem/1.3 var(--font-serif);
	}

	.swatches {
		display: flex;
		gap: 0.4rem;
	}

	.ground {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.3rem 0.4rem;
		border: 1px solid var(--line);
		border-radius: 6px;
	}

	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
	}

	.verdict {
		grid-column: 2;
		font: 400 0.75rem/1.3 var(--font-sans);
		color: var(--bad);
	}

	.verdict.pass {
		color: var(--good);
	}

	.note {
		max-width: 44rem;
		margin: 1rem 0 0;
		font-style: italic;
		color: var(--text-dim);
	}

	.vision {
		margin: 2.2rem 0 0.6rem;
		font: italic 500 1.05rem/1.3 var(--font-serif);
		color: var(--text-dim);
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
		gap: 0.8rem;
	}

	.panel {
		padding: 0.6rem 1.2rem 1rem;
		background: var(--bg);
		color: var(--text);
		border: 1px solid var(--line-strong);
		border-radius: 12px;
		font-size: 1.15rem;
	}

	.panel :global(.display) {
		margin: 0.15rem 0;
	}

	.panel :global(.katex-display) {
		margin: 0.35rem 0;
	}

	.ground-name {
		margin: 0.2rem 0 0;
		font: 500 0.72rem/1.4 var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	.panel .prose {
		margin: 0.6rem 0 0;
		font-size: 1rem;
	}

	h2#numbers {
		margin: 3rem 0 0.5rem;
		font: 500 1.6rem/1.2 var(--font-serif);
	}

	.key {
		max-width: 44rem;
		margin: 0 0 1rem;
		font-size: 0.95rem;
		color: var(--text-dim);
	}

	h3 {
		margin: 1.6rem 0 0.4rem;
		font: 500 1.15rem/1.3 var(--font-serif);
	}

	.table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		max-width: 44rem;
		border-collapse: collapse;
		font: 400 0.88rem/1.4 var(--font-sans);
	}

	th,
	td {
		padding: 0.45rem 0.8rem 0.45rem 0;
		text-align: left;
		border-bottom: 1px solid var(--line);
		white-space: nowrap;
	}

	th {
		font-weight: 500;
		font-style: italic;
		color: var(--text-dim);
		border-bottom-color: var(--line-strong);
	}

	.right {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.low {
		color: var(--bad);
		font-weight: 600;
	}

	.chip {
		display: inline-block;
		width: 0.8rem;
		height: 0.8rem;
		margin-right: 0.5rem;
		border-radius: 3px;
		vertical-align: -0.1rem;
	}

	code {
		font: 400 0.82rem var(--font-mono);
	}

	.summary {
		max-width: 44rem;
		margin: 0.6rem 0 0;
		font: 400 0.85rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}
</style>
