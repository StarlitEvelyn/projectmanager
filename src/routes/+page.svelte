<script lang="ts">
	import { loadProjects, projects } from "$lib/project/project-state.svelte";
	import ProjectDetails from "@components/ProjectDetails/ProjectDetails.svelte";
	import ProjectList from "@components/ProjectList/ProjectList.svelte";
	import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window";
	let index = $state(0);

	// Make sure is at least 600px by 600px
	const setWindowSize = async () => {
		await getCurrentWindow().setMinSize(new PhysicalSize(600, 600));
	};
	setWindowSize();

	loadProjects();
</script>

<main class="flex bg-zinc-800 w-full h-full overflow-hidden">
	{#if projects.loading}
		<div class="flex justify-center items-center text-white w-full h-full">Loading projects...</div>
	{:else}
		<ProjectList projects={projects.projects} bind:index />
		{#key index}
			<ProjectDetails project={projects.projects[index] ?? null} />
		{/key}
	{/if}
	<!-- <div class="flex justify-center items-center text-white w-full h-full">Error loading projects: {error.message}</div> -->
</main>
