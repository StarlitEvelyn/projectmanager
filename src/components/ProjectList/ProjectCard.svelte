<script lang="ts">
	import { projectImage } from "$lib/project/project-image";
	import type { Project } from "@type/project.ts";
	import { AlertOctagon, AlertTriangle, FileWarning, LucideFileWarning, MessageSquareWarning } from "lucide-svelte";
	import ProjectTag from "./ProjectTag.svelte";

	type Props = {
		project: Project;
		onclick: (event: MouseEvent) => void;
	};

	const { project, onclick }: Props = $props();

	// List of all valid background colors
	const ValidColors = ["#00d3ff", "#ffa6b6", "#ffffff", "#ff6c04", "#ce7dda"];

	// Create a short title for projects without an image
	const shortTitle = Array.from((project.title.charAt(0).toUpperCase() + project.title.slice(1)).matchAll(/[A-Z]/g), (m) => m[0]).join("");
</script>

<button {onclick} class="relative flex flex-col text-left cursor-pointer bg-zinc-900 h-50 p-1.5 rounded text-white">
	{#if !project.hasConfig}
		<div title="This project is not imported!" class="w-10 h-10 flex justify-center items-center bg-yellow-500 text-black border-black border-1 absolute rounded-lg top-2 right-2 z-10">
			<AlertTriangle size={26} />
		</div>
	{/if}
	<div class="relative">
		{#if project.image.length === 0}
			<div class="w-full h-28 flex flex-col justify-center text-center font-bold text-zinc-800 text-4xl rounded" style={`background-color: ${ValidColors[Math.round(Math.random() * (ValidColors.length - 1))]}`}>
				{shortTitle}
			</div>
		{:else}
			<img src={projectImage(project)} class="w-full h-28 object-cover rounded-t" alt={project.title} />
		{/if}
		<div class="flex gap-2 absolute bottom-0 left-0 p-1 overflow-hidden w-full h-min">
			{#each project.tags.slice(0, 3) as tag}
				<ProjectTag {tag} />
			{/each}
		</div>
	</div>
	<h1 class="font-bold overflow-hidden text-ellipsis text-nowrap text-lg" title={project.title}>
		{project.title}
	</h1>
	<p class="overflow-hidden text-ellipsis line-clamp-2" title={project.description}>{project.description}</p>

	<!-- TODO make tags appear on hover -->
</button>
