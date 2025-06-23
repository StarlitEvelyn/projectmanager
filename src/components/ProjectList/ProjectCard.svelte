<script lang="ts">
	import { projectImage } from "$lib/project/project-image";
	import type { Project } from "@type/project.ts";

	type Props = {
		project: Project;
		onclick: (event: MouseEvent) => void;
	};

	const { project, onclick }: Props = $props();
</script>

<button {onclick} class="flex flex-col text-left cursor-pointer bg-zinc-900 h-50 p-1.5 rounded text-white">
	{#if project.image.length === 0}
		<div class="w-full h-28 flex flex-col justify-center text-center font-bold text-zinc-400">No image provided</div>
	{:else}
		<img src={projectImage(project)} class="w-full h-28 object-cover rounded-t" alt={project.title} />
	{/if}
	<h1 class="font-bold overflow-hidden text-ellipsis text-nowrap text-lg" title={project.title}>
		{project.title}
	</h1>
	<p class="overflow-hidden text-ellipsis line-clamp-2" title={project.description}>{project.description}</p>
	<!-- TODO make tags appear on hover -->
</button>
