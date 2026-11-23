<script lang="ts">
	/** The key to the colours of a chapter's equations: one line per role it uses, closed until opened. */
	import Tex from '#lib/ui/Tex.svelte';
	import { ROLE_INFO, ROLES, type Role } from './colour';

	interface Props {
		/** the roles to list; all five by default */
		roles?: readonly Role[];
		open?: boolean;
	}

	let { roles = ROLES, open = false }: Props = $props();

	/** The example symbols, coloured as the role colours them. */
	const coloured = (role: Role) => `\\htmlClass{q-${role}}{${ROLE_INFO[role].tex}}`;
</script>

<details class="legend" {open}>
	<summary>
		<span class="dots" aria-hidden="true">
			{#each roles as role (role)}<span class="dot q-{role}"></span>{/each}
		</span>
		The colours of the equations
	</summary>
	<ul>
		{#each roles as role (role)}
			<li>
				<span class="example"><Tex math={coloured(role)} trust /></span>
				<span class="name q-{role}">{ROLE_INFO[role].name}</span>
				<span class="meaning">{ROLE_INFO[role].meaning}</span>
			</li>
		{/each}
	</ul>
	<p class="note">
		Colour follows the kind of object, not its importance. Indices, numbers, constants and letters
		that could mean two things stay in the colour of the text. A symbol with a faint highlight on
		hover opens a card that says what it is.
	</p>
</details>

<style>
	.legend {
		margin: 1.4rem 0 2rem;
		font: 400 0.9rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}

	summary {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		list-style: none;
		cursor: pointer;
		font: italic 500 1rem/1.4 var(--font-serif);
		color: var(--text-dim);
		border-radius: 2px;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		color: var(--text);
	}

	summary:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}

	.dots {
		display: inline-flex;
		gap: 0.25rem;
	}

	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: currentColor;
	}

	ul {
		list-style: none;
		margin: 0.8rem 0 0;
		padding: 0.2rem 0 0.2rem 1rem;
		border-left: 1px solid var(--line-strong);
	}

	li {
		display: grid;
		grid-template-columns: 7.5rem 6rem minmax(0, 1fr);
		align-items: baseline;
		gap: 0.8rem;
		padding: 0.3rem 0;
	}

	.example {
		font-size: 1.05rem;
		color: var(--text);
	}

	.name {
		font-weight: 600;
	}

	.note {
		margin: 0.7rem 0 0 1rem;
		font-size: 0.82rem;
		color: var(--text-faint);
		max-width: 38rem;
	}

	@media (max-width: 560px) {
		li {
			grid-template-columns: 6.5rem minmax(0, 1fr);
			row-gap: 0;
		}

		.meaning {
			grid-column: 2;
		}
	}
</style>
