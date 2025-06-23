<script lang="ts">
	import { projectImage } from "$lib/project/project-image";
	import { convertFileSrc } from "@tauri-apps/api/core";
	import type { Project } from "@type/project";

	type Props = {
		project: Project;
	};
	const { project }: Props = $props();
</script>

<div class="w-full h-60 flex flex-col justify-center text-center font-bold text-zinc-400 overflow-hidden rounded">
	{#if project.image.length === 0}
		<div class="h-full flex items-center justify-center leading-none text-sm p-0 m-0">No image provided</div>
	{:else}
		<img src={projectImage(project)} class="w-full h-full object-cover" alt={project.title} />
	{/if}
</div>
