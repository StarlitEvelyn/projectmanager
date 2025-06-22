<script lang="ts">
	import { initSettings } from '$lib/settings.svelte';

	const { children } = $props();


	initSettings();
</script>

{@render children()}
