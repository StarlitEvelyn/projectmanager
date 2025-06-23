<script lang="ts">
	import { discoverProjects } from "$lib/project/project-loader";
	import ProjectDetails from "@components/ProjectDetails/ProjectDetails.svelte";
	import ProjectList from "@components/ProjectList/ProjectList.svelte";
	import type { Project } from "@type/project";
	let index = $state(0);

	let projectPromise: Promise<Project[]> = discoverProjects();
</script>

<main class="flex bg-zinc-800 w-full h-full overflow-hidden">
	{#await projectPromise}
		<div class="flex justify-center items-center text-white w-full h-full">Loading projects...</div>
	{:then projects}
		<ProjectList {projects} bind:index />
		{#key index}
			<ProjectDetails project={projects[index] ?? null} />
		{/key}
	{:catch error}
		<div class="flex justify-center items-center text-white w-full h-full">Error loading projects: {error.message}</div>
	{/await}
</main>
