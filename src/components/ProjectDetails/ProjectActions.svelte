<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import { join } from "@tauri-apps/api/path";
	import { readDir } from "@tauri-apps/plugin-fs";
	import { openUrl } from "@tauri-apps/plugin-opener";
	import type { Project } from "@type/project";

	type Props = {
		project: Project;
	};
	const { project }: Props = $props();

	const openInEditor = async () => {
		let openPath = project.path;

		// Check if there's a .code-workspace file
		const projectFiles = await readDir(project.path);
		const workspaceFile = projectFiles.find((file) => {
			const fileExtension =
				file.name.split(".")[file.name.split(".").length - 1];

			return fileExtension === "code-workspace";
		});

		// If there is a .code-workspace file update path to open it
		if (workspaceFile) openPath = await join(project.path, workspaceFile.name);

		// If not open folder in VSC
		await invoke("open_vscode", { path: openPath });
		console.log(`Opening ${openPath}`);
	};

	const openGitHub = async () => {
		await openUrl(project.githubUrl);
		console.log(`Opening ${project.githubUrl}`);
	};
</script>

<div class="flex gap-2 justify-evenly mt-auto flex-wrap">
	<button
		class="p-2 rounded cursor-pointer bg-zinc-800 flex-1/3 text-nowrap"
		onclick={openInEditor}>Open in Editor</button
	>
	<button
		class="p-2 rounded cursor-pointer bg-zinc-800 flex-1/3 text-nowrap"
		onclick={openGitHub}>Open on github</button
	>
</div>
