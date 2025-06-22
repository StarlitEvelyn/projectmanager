<script lang="ts">
	import type { Project } from "@type/project";
	import { openUrl } from "@tauri-apps/plugin-opener";
	import { invoke } from "@tauri-apps/api/core";
	type Props = {
		project: Project | null;
	};
	const { project }: Props = $props();

	const openInEditor = async () => {
		await invoke("open_vscode", { path: project!.path });
		console.log(`Opening ${project!.path}`);
	};

	const openGitHub = async () => {
		await openUrl(project!.githubUrl);
		console.log(`Opening ${project!.githubUrl}`);
	};
</script>

<div class="flex flex-col w-[26rem] h-full ml-2 p-2 text-white rounded-l-xl bg-zinc-900">
	{#if project == null}
		<div class="flex flex-col h-full justify-center">
			<div class="text-center">No project yet</div>
		</div>
	{:else}
		<div class="w-full h-60 flex flex-col justify-center text-center font-bold text-zinc-400 overflow-hidden rounded">
			{#if project.image.length === 0}
				<div class="h-full flex items-center justify-center leading-none text-sm p-0 m-0">No image provided</div>
			{:else}
				<img src={project.image} class="w-full h-full object-cover" alt={project.title} />
			{/if}
		</div>
		<div class="flex gap-1">
			{#each project.tags as tag}
				<span class="bg-zinc-800 text-zinc-400 rounded px-2 py-1 text-sm">{tag}</span>
			{/each}
		</div>
		<h1 class="font-bold text-xl mt-2">{project.title}</h1>
		<p>{project.description}</p>
		<div class="flex gap-2 justify-evenly mt-auto">
			<button class="p-2 rounded cursor-pointer bg-zinc-800" onclick={openInEditor}>Open in Editor</button>
			<button class="p-2 rounded cursor-pointer bg-zinc-800" onclick={openGitHub}>Open on github</button>
		</div>
	{/if}
</div>
