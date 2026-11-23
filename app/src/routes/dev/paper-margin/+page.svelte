<script lang="ts">
	import PaperPage from '../../paper/+page.svelte';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaperPage {data} {params} form={undefined} />
