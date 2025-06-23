<script lang="ts">
	import { convertFileSrc } from "@tauri-apps/api/core";
	import { copyFile } from "@tauri-apps/plugin-fs";
	import type { Project } from "@type/project";
	import { Save } from "lucide-svelte";
	import { open } from "@tauri-apps/plugin-dialog";

	type Props = {
		project: Project;
		show: boolean;
	};
	let { project, show = $bindable() }: Props = $props();

	const save = (e: any) => {
		e.preventDefault();
		show = false;

		const form = e.target;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries()) as Data;

		type Data = {
			title: string;
			githubUrl: string;
			description: string;
		};

		(Object.keys(data) as (keyof Data)[]).forEach((key) => {
			project[key] = data[key];
		});

		console.log(data);
		// TODO save data
	};

	let image = $state(project!.image);

	const getImage = async () => {
		const path = await open({
			muliple: false,
			directory: false,
			filters: [
				{
					name: "Image",
					extensions: ["png", "jpg"],
				},
			],
		});

		if (!path) return; // Make sure a file was selected

		const url = convertFileSrc(path ?? "");
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
		<label for="githubURL">Github URL</label>
		<input type="text" name="githubURL" id="githubUrl" class="rounded border-1 border-[#aaaaaa] px-2 py-1" defaultvalue={project.githubUrl} />
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
