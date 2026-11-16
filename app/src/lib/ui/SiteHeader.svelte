<script lang="ts">
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BookOpen01Icon,
		GithubIcon,
		Moon02Icon,
		PlayCircleIcon,
		Sun03Icon
	} from '@hugeicons/core-free-icons';

	let { current }: { current?: 'paper' | 'demo' } = $props();

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

<header>
	<a class="brand" href={resolve('/')}>The Gravitational Camera</a>
	<nav aria-label="Site">
		<a href={resolve('/paper')} aria-current={current === 'paper' ? 'page' : undefined}>
			<HugeiconsIcon icon={BookOpen01Icon} size={18} strokeWidth={1.6} />
			<span>Paper</span>
		</a>
		<a href={resolve('/demo')} aria-current={current === 'demo' ? 'page' : undefined}>
			<HugeiconsIcon icon={PlayCircleIcon} size={18} strokeWidth={1.6} />
			<span>Demos</span>
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

	.brand {
		font: 500 1.05rem/1.2 var(--font-serif);
		text-decoration: none;
		letter-spacing: -0.005em;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	nav a,
	nav button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.65rem;
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

	@media (max-width: 560px) {
		nav a span {
			display: none;
		}

		.brand {
			font-size: 0.95rem;
		}
	}
</style>
