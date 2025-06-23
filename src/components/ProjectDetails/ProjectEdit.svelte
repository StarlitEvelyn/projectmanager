<script lang="ts">
	import type { Project } from "@type/project";
	import { Edit, Import, Save } from "lucide-svelte";

	type Props = {
		project: Project;
		show: boolean;
	};

	let { project, show = $bindable() }: Props = $props();

	const openProjectEditor = () => {
		console.log("TODO: make project editor");
		show = true;
	};
</script>

{#if !show}
	<button onclick={openProjectEditor} class="flex gap-2 p-2 z-20 cursor-pointer justify-center items-center absolute bg-zinc-800 w-max h-8 rounded right-3 top-3">
		{#if project.hasConfig}
			<Edit /> Edit
		{:else}
			<Import /> Import
		{/if}
	</button>
{/if}
