<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { openUrl } from "@tauri-apps/plugin-opener";
	import type { Project } from "@type/project";

	type Props = {
		project: Project;
	};
	const { project }: Props = $props();

	const openInEditor = async () => {
		await invoke("open_vscode", { path: project.path });
		console.log(`Opening ${project.path}`);
	};

	const openGitHub = async () => {
		await openUrl(project.githubUrl);
		console.log(`Opening ${project.githubUrl}`);
	};
</script>

<div class="flex gap-2 justify-evenly mt-auto flex-wrap">
	<button class="p-2 rounded cursor-pointer bg-zinc-800 flex-1/3 text-nowrap" onclick={openInEditor}>Open in Editor</button>
	<button class="p-2 rounded cursor-pointer bg-zinc-800 flex-1/3 text-nowrap" onclick={openGitHub}>Open on github</button>
</div>
