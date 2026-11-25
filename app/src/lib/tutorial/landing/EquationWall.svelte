<script lang="ts">
	/**
	 * The paper's numbered equations, one tile each in the paper's order, toned by the part of the chapter that
	 * derives it. A filled tile is derived in the tutorial; an outlined one is stated in the paper, and its chapter
	 * reads it. Pointing at a tile, or reaching it with the keyboard, names the chapter; each tile links there.
	 */
	import { resolve } from '$app/paths';
	import { rove } from './rove';

	interface Tile {
		number: string;
		derived: boolean;
		chapter: string;
		title: string;
		part: string;
		href?: string;
	}

	let { tiles }: { tiles: Tile[] } = $props();

	let active = $state<Tile | undefined>(undefined);

	const say = (t: Tile) =>
		`Equation ${t.number}: ${t.derived ? 'derived' : 'read'} in ${t.chapter}, ${t.title}`;
</script>

<div class="wall">
	<ol aria-label="The paper's numbered equations" {@attach rove({ grid: true })}>
		{#each tiles as t (t.number)}
			<li>
				{#if t.href}
					<a
						href={resolve(t.href as '/')}
						class={['tile', { derived: t.derived, on: active === t }]}
						style:--k={Number(t.part) / 13}
						data-rove
						aria-label={say(t)}
						onpointerenter={() => (active = t)}
						onpointerleave={() => (active = undefined)}
						onfocus={() => (active = t)}
						onblur={() => (active = undefined)}>{t.number}</a
					>
				{:else}
					<span class={['tile', 'planned', { derived: t.derived }]} style:--k={Number(t.part) / 13}
						>{t.number}</span
					>
				{/if}
			</li>
		{/each}
	</ol>
	<p class="reading" aria-hidden="true">
		{#if active}
			<span class="what">({active.number})</span>
			{active.derived ? 'derived in' : 'stated in the paper, read in'}
			<span class="id">{active.chapter}</span>
			{active.title}
		{:else}
			<span class="hint pointer">Point at an equation to see where it is derived.</span>
			<span class="hint touch">Each tile opens the chapter that derives the equation.</span>
		{/if}
	</p>
</div>

<style>
	ol {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
		gap: 0.3rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.tile {
		--tone: color-mix(in oklab, var(--accent) calc(var(--k) * 100%), var(--accent-2));
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		border: 1px solid var(--tone);
		color: var(--text-dim);
		font: 400 0.92rem/1 var(--font-serif);
		font-variant-numeric: tabular-nums lining-nums;
		text-decoration: none;
		transition:
			background-color 0.12s,
			color 0.12s;
	}

	.tile.derived {
		border-color: transparent;
		background: color-mix(in oklab, var(--tone) 30%, var(--bg));
		color: var(--text);
	}

	.tile.on,
	a.tile:hover {
		background: var(--tone);
		color: var(--bg);
	}

	.tile.planned {
		opacity: 0.45;
	}

	a.tile:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 1px;
	}

	.reading {
		min-height: 1.5em;
		margin: 0.9rem 0 0;
		color: var(--text);
		font: 400 1.02rem/1.45 var(--font-serif);
	}

	.reading .what,
	.reading .id {
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.reading .hint {
		color: var(--text-faint);
		font-style: italic;
	}

	.hint.touch {
		display: none;
	}

	@media (hover: none) {
		.hint.pointer {
			display: none;
		}

		.hint.touch {
			display: inline;
		}
	}

	@media (max-width: 44rem) {
		ol {
			grid-template-columns: repeat(auto-fill, minmax(2.05rem, 1fr));
			gap: 0.25rem;
		}

		.tile {
			font-size: 0.84rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tile {
			transition: none;
		}
	}
</style>
