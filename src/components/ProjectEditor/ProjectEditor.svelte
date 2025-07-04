<script lang="ts">
	import { convertFileSrc, invoke } from "@tauri-apps/api/core";
	import type { Project } from "@type/project";
	import { Save } from "lucide-svelte";
	import { open } from "@tauri-apps/plugin-dialog";
	import { loadProjects } from "$lib/project/project-state.svelte";
	import { projectImage } from "$lib/project/project-image";
	import { saveData } from "$lib/project/project-saver";

	type Props = {
		project: Project;
		show: boolean;
	};
	let { project, show = $bindable() }: Props = $props();

	let imagePath: string | null = null;
	let image = $state(projectImage(project));

	const save = async (e: any) => {
		e.preventDefault();
		show = false;

		// Save all data
		saveData(e, project, imagePath);

		// Reload projects for updated data to be loaded
		await loadProjects();
	};

	const getImage = async () => {
		// Open dialog, requesting a png or a jpg
		imagePath = await open({
			muliple: false,
			directory: false,
			filters: [
				{
					name: "Image",
					extensions: ["png", "jpg"],
				},
			],
		});

		// Make sure a file was selected
		if (!imagePath) return;

		// Convert file to url for tauri to not complain
		const url = convertFileSrc(imagePath ?? "");
		image = url ?? image;
	};

	const getGitHub = async () => {
		let url: string = await invoke("get_git", { path: project.path });

		if (!url) return null;

		if (url.startsWith("https://")) return url;
		return url.replace(":", "/").replace("git@", "https://");
	};

	// Try to get github url if the project doesn't have one yet
	if (!project.githubUrl) {
		getGitHub().then((url) => {
			if (url) project.githubUrl = url;
		});
	}
</script>

<div
	class={`${show ? "block" : "hidden"} flex flex-col z-10 p-2 backdrop-blur bg-[#000000AA] absolute rounded-l top-0 right-0 h-full w-full`}
>
	<form class="flex flex-col h-full" onsubmit={save}>
		<button onclick={getImage} class="text-start font-bold" type="button">
			Cover image
			{#if !image}
				<div
					class="h-50 flex items-center justify-center leading-none text-sm my-1"
				>
					No image provided
				</div>
			{:else}
				<img
					src={image}
					class="w-full h-50 rounded my-1 object-cover"
					alt={project!.title}
				/>
			{/if}
		</button>

		<label for="title">Title</label>
		<input
			type="text"
			name="title"
			id="title"
			class="rounded border-1 border-[#aaaaaa] px-2 py-1"
			defaultvalue={project.title}
		/>
		<label for="tags">Tags</label>
		<input
			type="text"
			name="tags"
			id="tags"
			class="rounded border-1 border-[#aaaaaa] px-2 py-1"
			defaultvalue={project.tags.join(", ")}
		/>
		<label for="description">Description</label>
		<textarea
			id="description"
			name="description"
			class="rounded border-1 border-[#aaaaaa] px-1 py-1 resize-none"
			>{project.description}
		</textarea>
		<label for="githubUrl">Github URL</label>
		<input
			type="text"
			name="githubUrl"
			id="githubUrl"
			class="rounded border-1 border-[#aaaaaa] px-2 py-1"
			defaultvalue={project.githubUrl}
		/>
		<button
			type="submit"
			class="flex gap-2 font-bold p-2 cursor-pointer justify-center items-center bg-zinc-800 w-full h-8 rounded mt-auto"
		>
			<Save /> Save
		</button>
	</form>
</div>

<style>
	label {
		margin-top: 0.4rem;
		font-weight: bold;
	}
</style>
