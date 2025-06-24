<script lang="ts">
	import type { Project } from "@type/project";
	import ProjectCard from "./ProjectCard.svelte";
	import SearchBar from "./SearchBar.svelte";

	type Props = {
		projects: Project[];
		secletedIndex: number;
	};

	let { projects, secletedIndex = $bindable() }: Props = $props();

	let query = $state("");

	let search = (query: string) => {
		query = query.toLowerCase().trim();
		if (query.length === 0) return projects.map((p, i) => ({ project: p, index: i }));

		return projects.map((p, i) => ({ project: p, index: i })).filter(({ project }) => project.title.toLowerCase().includes(query) || project.description.includes(query));
	};
</script>

<div class="h-screen w-screen flex flex-col">
	<SearchBar bind:query />
	<div class="h-max gap-2 p-2 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] overflow-y-scroll">
		{#each search(query) as { project, index }}
			<ProjectCard
				{project}
				onclick={() => {
					secletedIndex = index;
				}}
			/>
		{/each}
	</div>
</div>
