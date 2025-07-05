<script lang="ts">
	import "../styles/global.css";
	import { initSettings } from "$lib/settings.svelte";

	const { children } = $props();

	initSettings();
</script>

{@render children()}
