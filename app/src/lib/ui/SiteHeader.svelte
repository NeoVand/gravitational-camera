<script lang="ts">
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BookOpen01Icon,
		Chart01Icon,
		GeologyCrustIcon,
		GithubIcon,
		Moon02Icon,
		PlayCircleIcon,
		Sun03Icon
	} from '@hugeicons/core-free-icons';

	interface Props {
		current?: 'paper' | 'demo' | 'figures';
		/** Lay the header over a dark picture: no background, light text. */
		overlay?: boolean;
	}

	let { current, overlay = false }: Props = $props();

	function toggleTheme() {
		const root = document.documentElement;
		const now =
			root.dataset.theme ??
			(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
		const next = now === 'light' ? 'dark' : 'light';
		root.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			/* storage unavailable: the choice lasts for this page only */
		}
	}
</script>

<header class={{ overlay }}>
	<a class="brand" href={resolve('/')}>
		<HugeiconsIcon icon={GeologyCrustIcon} size={22} strokeWidth={1.5} />
		<span>Gravitational Camera</span>
	</a>
	<nav aria-label="Site">
		<a href={resolve('/paper')} aria-current={current === 'paper' ? 'page' : undefined}>
			<HugeiconsIcon icon={BookOpen01Icon} size={18} strokeWidth={1.6} />
			<span>Paper</span>
		</a>
		<a href={resolve('/demo')} aria-current={current === 'demo' ? 'page' : undefined}>
			<HugeiconsIcon icon={PlayCircleIcon} size={18} strokeWidth={1.6} />
			<span>Demos</span>
		</a>
		<a href={resolve('/figures')} aria-current={current === 'figures' ? 'page' : undefined}>
			<HugeiconsIcon icon={Chart01Icon} size={18} strokeWidth={1.6} />
			<span>Figures</span>
		</a>
		<a
			href="https://github.com/NeoVand/gravitational-camera"
			aria-label="Source code on GitHub"
			title="Source code"
		>
			<HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.6} />
		</a>
		<button type="button" onclick={toggleTheme} aria-label="Switch between light and dark">
			<span class="to-light"><HugeiconsIcon icon={Sun03Icon} size={18} strokeWidth={1.6} /></span>
			<span class="to-dark"><HugeiconsIcon icon={Moon02Icon} size={18} strokeWidth={1.6} /></span>
		</button>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.6rem var(--gutter);
		background: color-mix(in srgb, var(--bg) 86%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
		font-size: 0.86rem;
	}

	header.overlay {
		position: absolute;
		inset: 0 0 auto 0;
		background: linear-gradient(rgb(0 0 0 / 0.55), transparent);
		backdrop-filter: none;
		border-bottom: 0;
	}

	header.overlay nav a:hover {
		background: rgb(255 255 255 / 0.1);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font: 500 1.05rem/1.2 var(--font-serif);
		text-decoration: none;
		letter-spacing: -0.005em;
	}

	.brand :global(svg) {
		flex: none;
		color: var(--accent);
	}

	/* the serif sets its capitals higher in the line than the sans of the other items:
	   lower it so that its capitals are centred on the icons, as theirs are */
	.brand span {
		position: relative;
		top: 0.11em;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	/* every item is one line of 18px icon height, so that they line up */
	nav a,
	nav button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2.1rem;
		padding: 0 0.65rem;
		line-height: 1;
		border: 0;
		border-radius: 8px;
		background: none;
		color: var(--text-dim);
		text-decoration: none;
		cursor: pointer;
	}

	nav a:hover,
	nav button:hover {
		color: var(--text);
		background: var(--bg-raised);
	}

	nav a[aria-current='page'] {
		color: var(--text);
	}

	/* an icon set inline would sit on the text baseline, above the middle */
	nav :global(svg) {
		display: block;
	}

	@media (max-width: 560px) {
		nav a span {
			display: none;
		}

		.brand {
			font-size: 0.95rem;
		}
	}

	@media (max-width: 380px) {
		nav a,
		nav button {
			padding: 0 0.45rem;
		}
	}
</style>
