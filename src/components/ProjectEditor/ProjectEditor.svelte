<script lang="ts">
	import { convertFileSrc } from "@tauri-apps/api/core";
	import type { Project } from "@type/project";
	import { Save } from "lucide-svelte";
	import { open } from "@tauri-apps/plugin-dialog";
	import { saveImage, saveProject } from "$lib/project/project-saver";
	import { loadProjects } from "$lib/project/project-state.svelte";
	import { join } from "@tauri-apps/api/path";
	import { projectImage } from "$lib/project/project-image";

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

		// Get data from form
		const form = e.target;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries()) as Data;

		type Data = {
			title: string;
			githubUrl: string;
			description: string;
		};

		// Transfer all edited values to the project
		(Object.keys(data) as (keyof Data)[]).forEach((key) => {
			project[key] = data[key].trim();
		});

		// If image was changed, imagePath will not be null,
		// we update project's image path to the .pm/image.extension
		if (imagePath) {
			const split = imagePath.split(".");
			const extension = split[split.length - 1];
			project.image = await join(".pm", `image.${extension}`);
		}

		// Save config file
		await saveProject(project);
		// Save image to .pm folder
		if (imagePath) await saveImage(project, imagePath);

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

	// TODO try to read github url from .git if exists
</script>

<div class={`${show ? "block" : "hidden"} flex flex-col z-10 p-2 backdrop-blur bg-[#000000AA] absolute rounded-l top-0 right-0 h-full w-full`}>
	<form class="flex flex-col h-full" onsubmit={save}>
		<button onclick={getImage} class="text-start font-bold" type="button">
			Cover image
			{#if image.length === 0}
				<div class="h-50 flex items-center justify-center leading-none text-sm my-1">No image provided</div>
			{:else}
				<img src={image} class="w-full h-50 rounded my-1 object-cover" alt={project!.title} />
			{/if}
		</button>

		<label for="title">Title</label>
		<input type="text" name="title" id="title" class="rounded border-1 border-[#aaaaaa] px-2 py-1" defaultvalue={project.title} />
		<label for="description">Description</label>
		<textarea id="description" name="description" class="rounded border-1 border-[#aaaaaa] px-1 py-1 resize-none">{project.description} </textarea>
		<label for="githubUrl">Github URL</label>
		<input type="text" name="githubUrl" id="githubUrl" class="rounded border-1 border-[#aaaaaa] px-2 py-1" defaultvalue={project.githubUrl} />
		<button type="submit" class="flex gap-2 font-bold p-2 cursor-pointer justify-center items-center bg-zinc-800 w-full h-8 rounded mt-auto">
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
