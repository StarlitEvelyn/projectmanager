<script lang="ts">
	import { discoverProjects } from "$lib/project/project-loader";
	import ProjectDetails from "@components/ProjectDetails.svelte";
	import ProjectList from "@components/ProjectList.svelte";
	import type { Project } from "@type/project";
	let index = $state(0);

	let projectPromise: Promise<Project[]> = discoverProjects();;

</script>

<main class="flex bg-zinc-800 w-full h-full overflow-hidden">
	{#await projectPromise}
		<p>Loading projects...</p>
	{:then projects}
		<ProjectList {projects} bind:index />
		<ProjectDetails project={projects[index] ?? null} />
	{:catch error}
		<p>Error loading projects: {error.message}</p>
	{/await}
</main>
