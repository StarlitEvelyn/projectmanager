<script lang="ts">
	import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
	import { onMount } from "svelte";

	type Props = {
		categories: string[];
		selected: string;
	};

	let version = $state("");
	let tauriVersion = $state("");
	onMount(async () => {
		version = await getVersion();
		tauriVersion = await getTauriVersion();
	});

	let { categories, selected = $bindable() }: Props = $props();
</script>

<div class="flex flex-col gap-2 w-40 ml-2">
	{#each categories as category}
		<button
			onclick={() => {
				selected = category;
			}}
			class="cursor-pointer bg-zinc-900 w-full p-1 px-4 rounded text-center"
		>
			<h1>{category}</h1>
		</button>
	{/each}
	<div class="mt-auto text-zinc-300 text-xs pb-1">
		<p>Stable {version}</p>
		<p>Tauri {tauriVersion}</p>
	</div>
</div>
