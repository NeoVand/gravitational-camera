<script lang="ts">
	import ChapterPage from '#lib/tutorial/ChapterPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ChapterPage {data} noindex />
