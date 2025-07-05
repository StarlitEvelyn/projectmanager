<script lang="ts">
	type Props = {
		categories: string[];
	};
	const { categories }: Props = $props();
</script>

<div class="flex flex-col gap-2 w-40 ml-2">
	{#each categories as category}
		<div class="bg-zinc-900 w-full p-1 px-4 rounded text-center">
			<h1>{category}</h1>
		</div>
	{/each}
</div>
