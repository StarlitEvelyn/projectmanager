<script lang="ts">
	type Props = {
		categories: string[];
		selected: string;
	};
	let { categories, selected = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-2 w-40 ml-2">
	{#each categories as category}
		<button
			onclick={() => {}}
			class="cursor-pointer bg-zinc-900 w-full p-1 px-4 rounded text-center"
		>
			<h1>{category}</h1>
		</button>
	{/each}
</div>
