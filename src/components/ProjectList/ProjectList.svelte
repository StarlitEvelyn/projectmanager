<script lang="ts">
	import type { Project } from "@type/project";
	import ProjectCard from "./ProjectCard.svelte";
	import SearchBar from "./SearchBar.svelte";
	import { Settings } from "lucide-svelte";
	import { goto } from "$app/navigation";

	type Props = {
		projects: Project[];
		secletedIndex: number;
	};

	let { projects, secletedIndex = $bindable() }: Props = $props();

	let query = $state("");

	let search = (query: string) => {
		query = query.toLowerCase().trim();
		if (query.length === 0)
			return projects.map((p, i) => ({ project: p, index: i }));

		return projects
			.map((p, i) => ({ project: p, index: i }))
			.filter(
				({ project }) =>
					project.title.toLowerCase().includes(query) ||
					project.description.includes(query) ||
					project.tags.some((tag) => {
						return tag.toLowerCase().includes(query);
					}),
			);
	};
</script>

<div class="h-screen w-screen flex flex-col relative">
	<div class="flex items-center">
		<SearchBar bind:query />
		<button
			onclick={() => {
				goto("settings");
			}}
			class="flex justify-center items-center cursor-pointer rounded text-white bg-zinc-900 h-10 w-10"
		>
			<Settings />
		</button>
	</div>
	{#if projects.length > 0}
		<div
			class="h-max gap-2 p-2 grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] overflow-y-scroll"
		>
			{#each search(query) as { project, index }}
				<ProjectCard
					{project}
					onclick={() => {
						secletedIndex = index;
					}}
				/>
			{/each}
		</div>
	{:else}
		<div
			class="h-full w-full flex flex-col items-center justify-center text-center text-white"
		>
			<h1 class="text-xl">No projects found!</h1>
			<h2>
				Have you got a library? <a
					href="/settings"
					class="font-bold cursor-pointer">Set library</a
				>
			</h2>
		</div>
	{/if}
	<div
		class="flex flex-col text-center absolute bottom-2 right-2 text-white px-2 pb-1 rounded bg-zinc-800 border-1 border-black z-20"
	>
		{search(query).length} / {projects.length}
		<span class="text-xs">Showing</span>
	</div>
</div>
