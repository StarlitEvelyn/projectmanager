<script lang="ts">
	import { DeleteIcon } from "lucide-svelte";

	let { query = $bindable() }: { query: string } = $props();
</script>

<div class="relative flex p-2 rounded m-2 gap-2 bg-zinc-900 text-white w-full">
	<input
		class="w-full outline-none"
		type="text"
		maxlength="255"
		bind:value={query}
	/>
	<!-- Max length of a filename in most filesystems -->
	<!--! If want search to work with paths, must increase limit!  -->
	<button
		onclick={() => {
			query = "";
		}}
		class="absolute right-2 top-1 cursor-pointer hover:bg-zinc-700 p-1 rounded"
	>
		<DeleteIcon />
	</button>
</div>
