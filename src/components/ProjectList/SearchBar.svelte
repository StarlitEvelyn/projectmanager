<script lang="ts">
	import { SlidersHorizontal } from "lucide-svelte";
	let { query = $bindable() }: { query: string } = $props();
</script>

<div class="flex p-2 rounded m-2 gap-2 bg-zinc-900 text-white">
	<input class="w-full outline-none" type="text" maxlength="255" bind:value={query} />
	<!-- Max length of a filename in most filesystems -->
	<!--! If want search to work with paths, must increase limit!  -->
	<button class="cursor-pointer bg-zinc-800 p-1 rounded"><SlidersHorizontal /></button>
</div>
