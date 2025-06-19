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
	};
</script>

<div class="flex flex-col w-[26rem] h-full ml-2 p-2 text-white rounded-l-xl bg-zinc-900">
	{#if project == null}
		<div class="flex flex-col h-full justify-center">
			<div class="text-center">No project yet</div>
		</div>
	{:else}
		<img src={project.image} class="w-full h-60 object-cover rounded" alt={project.title} />
		<h1 class="font-bold text-xl mt-2">{project.title}</h1>
		<p>{project.description}</p>
		<div class="flex h-full"></div>
		<div class="flex gap-2 justify-evenly">
			<button class="p-2 rounded cursor-pointer bg-zinc-800" onclick={openInEditor}>Open in Editor</button>
			<button class="p-2 rounded cursor-pointer bg-zinc-800" onclick={openGitHub}>Open on github</button>
		</div>
	{/if}
</div>
