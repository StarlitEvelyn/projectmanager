<script lang="ts">
	import {
		getSettings,
		setSettings,
		updateSettings,
	} from "$lib/settings.svelte";
	import { open } from "@tauri-apps/plugin-dialog";
	import { DotSquare, MoreHorizontal, Trash2 } from "lucide-svelte";

	let paths: string[] = $state([]);

	const load = async () => {
		const settings = await getSettings();
		paths = settings.searchPaths;
	};
	load();

	const deletePath = (path: string) => {
		// Remove path from array
		paths = paths.filter((value) => value !== path);

		// Save new array to disk
		updateSettings({ searchPaths: paths });
	};

	const selectPath = async () => {
		// Open dialog asking user for a folder
		const newPath = await open({ multiple: false, directory: true });

		// If no path is given return
		if (!newPath) return;

		// Save path to paths array
		paths.push(newPath);

		// Save to disk
		updateSettings({ searchPaths: paths });
	};

	const saveNewPath = () => {
		// Get path and add it to thei paths array
		const target = document.getElementById("pathAdd") as HTMLInputElement;
		paths.push(target.value);

		// Reset input to be empty
		target.value = "";

		// Save path to disk
		updateSettings({ searchPaths: paths });
	};
</script>

<div class="flex flex-col">
	<h2 class="font-bold text-lg">Library paths</h2>
	<div class="flex flex-col bg-zinc-900 w-full h-30 rounded-t">
		{#each paths as path}
			<div class="group flex p-1 px-1 hover:bg-zinc-700 rounded">
				<h1 class="w-full text-lg">{path}</h1>
				<button
					onclick={() => {
						deletePath(path);
					}}
					class="hidden group-hover:block hover:bg-red-500 cursor-pointer bg-zinc-800 px-1 rounded"
				>
					<Trash2 />
				</button>
			</div>
		{/each}
	</div>
	<div class="flex rounded-b bg-zinc-900">
		<input
			class="p-1 w-full"
			type="text"
			name="pathAdd"
			id="pathAdd"
			placeholder="Insert new path"
		/>
		<button
			onclick={selectPath}
			class="hover:bg-zinc-700 duration-75 cursor-pointer px-2"
		>
			<MoreHorizontal />
		</button>
		<button
			onclick={saveNewPath}
			class="px-2 hover:bg-zinc-700 duration-75 cursor-pointer">Save</button
		>
	</div>
</div>
