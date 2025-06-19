<script lang="ts">
	import type { Project } from "@type/project";
	import ProjectCard from "./ProjectList/ProjectCard.svelte";
	import SearchBar from "./ProjectList/SearchBar.svelte";

	type Props = {
		projects: Project[];
		index: number;
	};

	let { projects, index = $bindable() }: Props = $props();

	let query = $state("");

	let search = (query: string) => {
		query = query.toLowerCase().trim();
		if (query.length === 0) return projects;

		return projects.filter((project) => {
			return project.title.toLowerCase().trim().includes(query) || project.description.includes(query);
		});
	};
</script>

<div class="h-screen w-screen flex flex-col">
	<SearchBar bind:query />
	<div class="h-max gap-2 p-2 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] overflow-y-scroll">
		{#each search(query) as project, i}
			<ProjectCard
				{project}
				onclick={() => {
					index = i;
				}}
			/>
		{/each}
	</div>
</div>
