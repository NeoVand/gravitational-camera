<script lang="ts">
	/**
	 * The frame shared by every demo: the picture, and beside it one docked sidebar that holds everything else.
	 * Nothing floats over the picture.
	 *
	 * The sidebar is a panel and, at the window's edge, a rail. The rail holds the tabs (About, Physics, Controls,
	 * and where a demo has them Pixel and Key, then Help) and the tools (reset the view, save a still, full screen,
	 * hide the interface). One tab is open at a time; pressing the open tab's icon puts the panel away, and the
	 * picture takes its width. With the panel put away, the Key tab still opens it at the colour key (its tip shows the
	 * key in brief). On a phone the rail is a bar along the bottom, the tabs in one row and the tools, named, in a row
	 * beneath, and the panel a sheet above it. Whether the panel is open, and at which tab, is kept from one demo to
	 * the next.
	 *
	 * Keys: N about, C controls, K the colour key (where the picture has one), R reset the view, S save a still,
	 * F full screen, H hide everything but the picture, ? help.
	 */
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		ArrowLeft02Icon,
		ArrowRight01Icon,
		Atom02Icon,
		Camera01Icon,
		HelpCircleIcon,
		InformationCircleIcon,
		FullScreenIcon,
		Key01Icon,
		MinimizeScreenIcon,
		SlidersHorizontalIcon,
		Target02Icon,
		CenterFocusIcon,
		ViewIcon,
		ViewOffIcon
	} from '@hugeicons/core-free-icons';
	import { demos } from '../demos';
	import { figures } from '../figures';

	type TabName = 'about' | 'physics' | 'controls' | 'pixel' | 'key' | 'help';

	interface Props {
		title: string;
		stage: Snippet;
		controls: Snippet;
		notes: Snippet;
		/** The physics behind the demo, with its equations. */
		physics?: Snippet;
		/** What one pixel at the camera reads, where the demo shows it: the Pixel tab. */
		pixel?: Snippet;
		/** The key to what the picture shows now, where it needs one: the Key tab. */
		legend?: Snippet;
		/** A line or two about the picture as it is now, kept in sight at the foot of the panel whatever the tab. */
		foot?: Snippet;
		/** Return the view to where it started. */
		onreset?: () => void;
		/** A still of the picture, to download. */
		onsave?: () => Promise<Blob | null>;
		/** Which list the page belongs to, for the way back: the demos or the interactive figures. */
		section?: 'demos' | 'figures';
	}

	let {
		title,
		stage,
		controls,
		notes,
		physics,
		pixel,
		legend,
		foot,
		onreset,
		onsave,
		section = 'demos'
	}: Props = $props();

	const kicker = $derived(
		(section === 'figures' ? figures : demos).find((d) => d.title === title)?.affordance
	);
	const fileName = $derived(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
	const home = $derived(section === 'figures' ? resolve('/figures') : resolve('/demo'));
	const homeName = $derived(section === 'figures' ? 'All figures' : 'All demos');

	interface Tab {
		name: TabName;
		label: string;
		icon: IconSvgElement;
		/** Its key on the keyboard, if it has one. */
		key?: string;
	}

	const tabs = $derived<Tab[]>([
		{ name: 'about', label: 'About', icon: InformationCircleIcon, key: 'N' },
		...(physics ? [{ name: 'physics' as const, label: 'Physics', icon: Atom02Icon }] : []),
		{ name: 'controls', label: 'Controls', icon: SlidersHorizontalIcon, key: 'C' },
		...(pixel ? [{ name: 'pixel' as const, label: 'Pixel', icon: CenterFocusIcon }] : []),
		...(legend ? [{ name: 'key' as const, label: 'Key', icon: Key01Icon, key: 'K' }] : []),
		{ name: 'help', label: 'Help', icon: HelpCircleIcon, key: '?' }
	]);

	/** Whether the panel is open, and the tab last chosen. */
	let open = $state(true);
	let chosen = $state<TabName>('controls');
	// a tab this demo does not have gives way to the controls
	const current = $derived(tabs.some((t) => t.name === chosen) ? chosen : 'controls');

	let bare = $state(false);
	let fullscreen = $state(false);
	let saving = $state(false);
	/** On a phone the rail lies along the bottom. */
	let flat = $state(false);
	/** Set once what was kept has been read, so that it is not written over first. */
	let ready = $state(false);

	const KEPT = 'gravitational-camera:sidebar';
	/** Narrower than this, the panel would leave too little picture to start open. */
	const ROOMY = 960;

	/** Start as the reader left it: the last tab, and on a roomy window whether the panel was open. */
	function start() {
		let kept: { open?: unknown; tab?: unknown } = {};
		try {
			kept = JSON.parse(localStorage.getItem(KEPT) ?? '{}') ?? {};
		} catch {
			// nothing kept, or nothing can be: start with the controls open
		}
		if (typeof kept.tab === 'string') chosen = kept.tab as TabName;
		open = window.innerWidth >= ROOMY && kept.open !== false;
		ready = true;
		const phone = window.matchMedia('(max-width: 720px)');
		const lay = () => (flat = phone.matches);
		lay();
		phone.addEventListener('change', lay);
		return () => phone.removeEventListener('change', lay);
	}

	$effect(() => {
		const state = { open, tab: chosen };
		if (!ready) return;
		try {
			// on a small screen the panel always starts put away, so what is done there is not kept as a wish
			const before = JSON.parse(localStorage.getItem(KEPT) ?? '{}') ?? {};
			const keep = window.innerWidth >= ROOMY ? state : { ...before, tab: state.tab };
			localStorage.setItem(KEPT, JSON.stringify(keep));
		} catch {
			// not remembered, which is fine
		}
	});

	/** Open the panel at a tab; the open tab's own icon puts the panel away. */
	function choose(name: TabName) {
		if (open && current === name) open = false;
		else {
			chosen = name;
			open = true;
		}
	}

	/** Show a tab, whatever is open now. */
	export function show(name: TabName) {
		chosen = name;
		open = true;
	}

	/** Arrow keys walk the tabs, as in any list of tabs; the one reached is opened. */
	function walk(e: KeyboardEvent) {
		const at = tabs.findIndex((t) => t.name === current);
		const last = tabs.length - 1;
		const to =
			e.key === 'ArrowDown' || e.key === 'ArrowRight'
				? (at + 1) % tabs.length
				: e.key === 'ArrowUp' || e.key === 'ArrowLeft'
					? (at + last) % tabs.length
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? last
							: -1;
		if (to < 0) return;
		e.preventDefault();
		e.stopPropagation();
		show(tabs[to].name);
		(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')[to]?.focus();
	}

	async function toggleFullscreen() {
		if (document.fullscreenElement) await document.exitFullscreen();
		else await document.documentElement.requestFullscreen?.();
	}

	async function save() {
		if (!onsave || saving) return;
		saving = true;
		try {
			const blob = await onsave();
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${fileName}.png`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} finally {
			saving = false;
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		const t = e.target as HTMLElement | null;
		if (t?.isContentEditable || t?.tagName === 'TEXTAREA') return;
		if (t instanceof HTMLInputElement && !['range', 'checkbox'].includes(t.type)) return;
		const key = e.key.toLowerCase();
		if (key === 'n') choose('about');
		else if (key === 'c') choose('controls');
		else if (key === 'k' && legend) choose('key');
		else if (key === 'r' && onreset) onreset();
		else if (key === 's' && onsave) save();
		else if (key === 'f') toggleFullscreen();
		else if (key === 'h') bare = !bare;
		else if (key === '?') choose('help');
		else return;
		e.preventDefault();
	}
</script>

<svelte:window onkeydown={onKey} />
<svelte:document onfullscreenchange={() => (fullscreen = !!document.fullscreenElement)} />

<main class={['always-dark', { bare, open }]} data-ready={ready || undefined} {@attach start}>
	<div class="stage">{@render stage()}</div>

	{#if !bare}
		<aside class="side" aria-label="About the demo, its controls and its tools">
			{#if open}
				<section class="panel">
					<header>
						<div class="titles">
							{#if kicker}<p class="kicker">{kicker}</p>{/if}
							<h1>{title}</h1>
						</div>
						<button
							type="button"
							class="away"
							aria-label="Put the panel away"
							title="Put the panel away"
							onclick={() => (open = false)}
						>
							<HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={1.8} />
						</button>
					</header>
					{#key current}
						<div
							class={['scroll', current]}
							role="tabpanel"
							id="shell-panel"
							aria-labelledby="shell-tab-{current}"
							tabindex="0"
						>
							{#if current === 'about'}
								{@render notes()}
							{:else if current === 'physics' && physics}
								{@render physics()}
							{:else if current === 'pixel' && pixel}
								{@render pixel()}
							{:else if current === 'key' && legend}
								{@render legend()}
							{:else if current === 'help'}
								<dl class="keys">
									<dt>Drag the picture</dt>
									<dd>look around</dd>
									<dt>Scroll</dt>
									<dd>zoom</dd>
									<dt>Drag the line</dt>
									<dd>move between light and gravity (arrow keys when it is selected)</dd>
									<dt><kbd>N</kbd> <kbd>C</kbd> <kbd>?</kbd></dt>
									<dd>about, controls, this help; the same key again puts the panel away</dd>
									{#if legend}
										<dt><kbd>K</kbd></dt>
										<dd>the key to the colours of the picture</dd>
									{/if}
									<dt><kbd>R</kbd> <kbd>S</kbd></dt>
									<dd>reset the view, save a still</dd>
									<dt><kbd>F</kbd> <kbd>H</kbd></dt>
									<dd>full screen, hide everything but the picture</dd>
								</dl>
							{:else}
								{@render controls()}
								<!-- The numbers that answer the controls are kept beside them: the lists of readings in
								     the demo's notes, and nothing else of the notes (see .answers below). -->
								<section class="readings" aria-label="Readings">
									<h3>Readings</h3>
									<div class="answers">{@render notes()}</div>
								</section>
							{/if}
						</div>
					{/key}
					{#if foot}<footer>{@render foot()}</footer>{/if}
				</section>
			{/if}

			<nav class="rail" aria-label="Panels and tools">
				{#if !open}<h1 class="unseen">{title}</h1>{/if}
				<!-- the way back keeps its place whether the panel is open or not -->
				<a class="tool back" href={home} aria-label={homeName}>
					<HugeiconsIcon icon={ArrowLeft02Icon} size={18} strokeWidth={2} />
					<span class="tip" aria-hidden="true">{homeName}</span>
				</a>
				<div
					class="tabs"
					role="tablist"
					aria-label="Panels"
					aria-orientation={flat ? 'horizontal' : 'vertical'}
					tabindex="-1"
					onkeydown={walk}
				>
					{#each tabs as t (t.name)}
						<button
							type="button"
							role="tab"
							id="shell-tab-{t.name}"
							aria-selected={open && current === t.name}
							aria-controls={open ? 'shell-panel' : undefined}
							tabindex={current === t.name ? 0 : -1}
							title={t.name === 'key' && !open
								? undefined
								: t.key
									? `${t.label} (${t.key})`
									: t.label}
							onclick={() => choose(t.name)}
						>
							<HugeiconsIcon icon={t.icon} size={19} strokeWidth={1.6} />
							<span>{t.label}</span>
							{#if t.name === 'key' && !open}
								<!-- with the panel away, the key in brief, and what opens it in full -->
								<span class="tip wide" aria-hidden="true">
									<span class="open-key">Open the key <kbd>K</kbd></span>
									{#if foot}{@render foot()}{/if}
								</span>
							{/if}
						</button>
					{/each}
				</div>
				<span class="sep" aria-hidden="true"></span>
				<div class="tools">
					{#if onreset}{@render tool(Target02Icon, 'Reset the view', 'Reset', 'R', onreset)}{/if}
					{#if onsave}{@render tool(Camera01Icon, 'Save a still', 'Save', 'S', save)}{/if}
					{@render tool(
						fullscreen ? MinimizeScreenIcon : FullScreenIcon,
						fullscreen ? 'Leave full screen' : 'Full screen',
						fullscreen ? 'Leave full' : 'Full screen',
						'F',
						toggleFullscreen
					)}
					{@render tool(ViewOffIcon, 'Hide the interface', 'Hide', 'H', () => (bare = true))}
				</div>
			</nav>
		</aside>
	{:else}
		<button
			type="button"
			class="unhide"
			onclick={() => (bare = false)}
			transition:fade={{ duration: 150 }}
		>
			<HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={1.8} /> Show the interface <kbd>H</kbd>
		</button>
	{/if}
</main>

{#snippet tool(
	icon: IconSvgElement,
	label: string,
	short: string,
	key: string,
	onclick: () => void
)}
	<button type="button" class="tool" aria-label={label} {onclick}>
		<HugeiconsIcon {icon} size={19} strokeWidth={1.6} />
		<!-- on a phone, where nothing hovers, the tools are named -->
		<span class="name" aria-hidden="true">{short}</span>
		<span class="tip" aria-hidden="true">{label} <kbd>{key}</kbd></span>
	</button>
{/snippet}

<style>
	main {
		position: fixed;
		inset: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		background: #000;
		color: var(--text);
		font-family: var(--font-sans);
		--surface: #1c150e;
		--line: rgb(255 255 255 / 0.09);
		--rail: 3.9rem;
	}

	/* the picture has the window but for the sidebar: nothing lies over it */
	.stage {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		/* what a stage that is a page to read keeps clear at its edges */
		--clear-top: 1.2rem;
		--clear-bottom: 1.2rem;
		--clear-left: 1.2rem;
		--clear-right: 1.2rem;
	}

	.side {
		display: flex;
		min-height: 0;
		background: var(--surface);
		border-left: 1px solid var(--line);
	}

	/* --- the panel ---------------------------------------------------------------- */

	.panel {
		display: flex;
		flex-direction: column;
		width: min(23rem, calc(100vw - var(--rail) - 16rem));
		min-height: 0;
		border-right: 1px solid var(--line);
	}

	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.95rem 1rem 0.9rem;
		border-bottom: 1px solid var(--line);
	}

	.titles {
		min-width: 0;
	}

	/* the way back, at the head of the rail: the one light thing in the sidebar */
	.tool.back {
		margin-bottom: 0.45rem;
		background: #d2dde7;
		color: #2d2218;
	}

	.away {
		display: grid;
		place-items: center;
		flex: none;
		width: 2rem;
		height: 2rem;
		margin: -0.25rem -0.35rem 0 0;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-faint);
		cursor: pointer;
	}

	.away:hover {
		background: rgb(255 255 255 / 0.08);
		color: var(--text);
	}

	.away:focus-visible,
	.tool:focus-visible,
	.tabs button:focus-visible,
	.scroll:focus-visible,
	.unhide:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.scroll:focus-visible {
		outline-offset: -2px;
	}

	.kicker {
		margin: 0 0 0.3rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	h1 {
		margin: 0;
		font: 400 1.45rem/1.12 var(--font-serif);
		letter-spacing: -0.005em;
		text-wrap: balance;
	}

	.unseen {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1rem 1rem 1.2rem;
		scrollbar-width: thin;
		scrollbar-color: rgb(255 255 255 / 0.18) transparent;
		animation: arrive 0.14s ease-out;
	}

	@keyframes arrive {
		from {
			opacity: 0;
		}
	}

	footer {
		padding: 0.6rem 1rem 0.7rem;
		border-top: 1px solid var(--line);
		background: rgb(255 255 255 / 0.025);
		font-size: 0.72rem;
		line-height: 1.45;
		color: var(--text-dim);
	}

	/* --- what the tabs hold --------------------------------------------------------- */

	.about,
	.pixel,
	.key {
		font-size: 0.86rem;
		line-height: 1.55;
	}

	.about :global(p),
	.key :global(p) {
		margin: 0 0 0.8rem;
		text-wrap: pretty;
	}

	.about :global(strong),
	.key :global(strong) {
		color: #fff;
		font-weight: 600;
	}

	.about :global(dl),
	.answers :global(dl) {
		margin: 0.9rem 0;
		display: grid;
		gap: 0.55rem;
		padding: 0.75rem 0.8rem;
		border-radius: 10px;
		background: rgb(255 255 255 / 0.04);
	}

	.about :global(dt),
	.answers :global(dt) {
		color: var(--text-faint);
		font-size: 0.72rem;
	}

	.about :global(dd),
	.answers :global(dd) {
		margin: 0.1rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text);
	}

	/* under the controls, the notes' lists of readings and no other part of the notes */
	.readings {
		margin-top: 1.1rem;
	}

	.readings:not(:has(dl)) {
		display: none;
	}

	.readings h3 {
		margin: 0 0 0.6rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--text-faint);
	}

	.answers > :global(:not(dl)) {
		display: none;
	}

	.answers :global(dl) {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.55;
	}

	.answers :global(dl + dl) {
		margin-top: 0.6rem;
	}

	.about :global(.fine) {
		color: var(--text-faint);
		font-size: 0.76rem;
		margin: 0;
	}

	.about :global(.fine + .fine) {
		margin-top: 0.6rem;
	}

	/* the physics tab: set like the paper, for reading */
	.physics {
		font: 400 0.95rem/1.6 var(--font-serif);
		color: var(--text);
	}

	.physics :global(h4) {
		margin: 1.1rem 0 0.35rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.physics :global(h4:first-child) {
		margin-top: 0.1rem;
	}

	.physics :global(p) {
		margin: 0 0 0.7rem;
	}

	.physics :global(.numbers) {
		margin: 0.9rem 0 0;
		font-family: var(--font-sans);
	}

	.keys {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.7rem 1rem;
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.keys dt {
		color: var(--text);
		white-space: nowrap;
	}

	.keys dd {
		margin: 0;
		color: var(--text-dim);
	}

	/* --- the rail: the tabs, then the tools ------------------------------------------ */

	.rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		width: var(--rail);
		padding: 0.6rem 0;
	}

	.tabs,
	.tools {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
	}

	.tabs button {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 0.28rem;
		width: 3.3rem;
		padding: 0.5rem 0 0.42rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--text-faint);
		font: 500 0.6rem/1 var(--font-sans);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	/* a finger leaves no pointer behind: only a pointer that hovers lights what it is over */
	@media (hover: hover) {
		.tabs button:hover {
			background: rgb(255 255 255 / 0.06);
			color: var(--text);
		}

		.tool:hover {
			background: rgb(255 255 255 / 0.08);
			color: var(--text);
		}

		.tool.back:hover {
			background: #e8eef3;
			color: #2d2218;
		}
	}

	.tabs button[aria-selected='true'] {
		background: rgb(255 255 255 / 0.08);
		color: var(--text);
	}

	.tabs button[aria-selected='true'] :global(svg) {
		color: var(--accent);
	}

	/* the open tab is tied to its panel by a mark on the edge they share */
	.tabs button[aria-selected='true']::before {
		content: '';
		position: absolute;
		left: -0.3rem;
		top: 0.5rem;
		bottom: 0.5rem;
		width: 2px;
		border-radius: 1px;
		background: var(--accent);
	}

	.sep {
		width: 1.6rem;
		height: 1px;
		margin: 0.45rem 0;
		background: var(--line);
	}

	.tool {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.tip {
		position: absolute;
		right: calc(100% + 12px);
		top: 50%;
		translate: 4px -50%;
		z-index: 2;
		padding: 0.4rem 0.55rem;
		border-radius: 8px;
		background: rgb(20 23 30 / 0.97);
		border: 1px solid var(--line);
		color: var(--text);
		font: 400 0.72rem/1.4 var(--font-sans);
		text-align: left;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.12s,
			translate 0.12s;
	}

	.tip.wide {
		width: 19rem;
		white-space: normal;
	}

	.open-key {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.35rem;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid var(--line);
		color: var(--accent);
		font-weight: 600;
	}

	.tool .name {
		display: none;
	}

	.tool:hover .tip,
	.tool:focus-visible .tip,
	.tabs button:hover .tip,
	.tabs button:focus-visible .tip {
		opacity: 1;
		translate: 0 -50%;
	}

	kbd {
		display: inline-block;
		min-width: 1.3em;
		padding: 0.05em 0.35em;
		border-radius: 4px;
		border: 1px solid rgb(255 255 255 / 0.18);
		font: 500 0.66rem/1.4 var(--font-mono);
		color: var(--text-dim);
		text-align: center;
	}

	.unhide {
		position: absolute;
		left: 50%;
		bottom: 1rem;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgb(12 15 21 / 0.5);
		color: var(--text-dim);
		font-size: 0.74rem;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.unhide:hover,
	.unhide:focus-visible {
		opacity: 1;
	}

	/* --- a narrower window: a narrower panel ------------------------------------------ */

	@media (max-width: 1100px) {
		.panel {
			width: min(20.5rem, calc(100vw - var(--rail) - 12rem));
		}
	}

	/* --- phones: the rail is a bar along the bottom, the panel a sheet above it --------- */

	@media (max-width: 720px) {
		main {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: minmax(0, 1fr) auto;
		}

		.side {
			flex-direction: column;
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.panel {
			width: auto;
			height: 46svh;
			border-right: 0;
			border-bottom: 1px solid var(--line);
		}

		header {
			align-items: center;
			padding: 0.5rem 0.75rem 0.55rem;
		}

		.tool.back {
			margin: 0 0.3rem 0 0;
		}

		.away {
			margin: 0 -0.2rem 0 0;
		}

		.away :global(svg) {
			rotate: 90deg;
		}

		.kicker {
			margin-bottom: 0.2rem;
		}

		h1 {
			font-size: 1.15rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.scroll {
			padding: 0.8rem 0.85rem 1rem;
		}

		footer {
			padding: 0.45rem 0.85rem 0.5rem;
		}

		/* two rows that fit any phone: the way back and the tabs, sharing the width; beneath them the tools */
		.rail {
			flex-direction: row;
			flex-wrap: wrap;
			width: auto;
			gap: 0.1rem 0.2rem;
			padding: 0.3rem 0.4rem calc(0.25rem + env(safe-area-inset-bottom));
		}

		.tabs,
		.tools {
			flex-direction: row;
			gap: 0.1rem;
		}

		.tabs {
			flex: 1 1 0;
			min-width: 0;
			justify-content: space-around;
		}

		.tabs button {
			flex: 1 1 0;
			min-width: 0;
			max-width: 4.4rem;
			width: auto;
			min-height: 2.75rem;
			white-space: nowrap;
		}

		.tabs button[aria-selected='true']::before {
			left: 0.7rem;
			right: 0.7rem;
			top: -0.3rem;
			bottom: auto;
			width: auto;
			height: 2px;
		}

		.sep {
			display: none;
		}

		.tool {
			flex: none;
			width: 2.75rem;
			height: 2.75rem;
		}

		.tools {
			flex: 1 0 100%;
			justify-content: space-around;
			padding-top: 0.2rem;
			border-top: 1px solid var(--line);
		}

		.tools .tool {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.25rem;
			flex: 1 1 auto;
			min-width: 0;
			max-width: 8rem;
			width: auto;
			height: 2.4rem;
		}

		.tools .tool :global(svg) {
			flex: none;
		}

		.tools .tool .name {
			display: inline;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			font: 500 0.62rem/1.2 var(--font-sans);
			white-space: nowrap;
		}

		.tip {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll {
			animation: none;
		}

		.tip,
		.tool,
		.tabs button {
			transition: none;
		}
	}
</style>
