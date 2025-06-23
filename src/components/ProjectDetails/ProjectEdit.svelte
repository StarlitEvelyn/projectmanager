<script lang="ts">
	import type { Project } from "@type/project";
	import { Cross, Edit, Import, Save, X } from "lucide-svelte";

	type Props = {
		project: Project;
		show: boolean;
	};

	let { project, show = $bindable() }: Props = $props();

	const openProjectEditor = () => {
		show = true;
	};

	const closeProjectEditor = () => {
		show = false;
	};
</script>

{#if !show}
	<button onclick={openProjectEditor} class="flex gap-2 p-2 cursor-pointer justify-center items-center absolute bg-zinc-800 w-max h-8 rounded right-3 top-3">
		{#if project.hasConfig}
			<Edit /> Edit
		{:else}
			<Import /> Import
		{/if}
	</button>
{:else}
	<button onclick={closeProjectEditor} class="flex gap-2 z-20 cursor-pointer justify-center items-center absolute bg-zinc-800 h-8 w-8 rounded right-1 top-1">
		<X />
	</button>
{/if}
