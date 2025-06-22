<script lang="ts">
	import type { Project } from "@type/project";
	import ProjectImage from "./ProjectDetails/ProjectImage.svelte";
	import ProjectTags from "./ProjectDetails/ProjectTags.svelte";
	import ProjectActions from "./ProjectDetails/ProjectActions.svelte";
	import ProjectEdit from "./ProjectDetails/ProjectEdit.svelte";

	type Props = {
		project: Project | null;
	};
	const { project }: Props = $props();
</script>

<div class="flex flex-col relative w-[26rem] h-full ml-2 p-2 text-white rounded-l-xl bg-zinc-900">
	{#if project == null}
		<div class="flex flex-col h-full justify-center">
			<div class="text-center">No project yet</div>
		</div>
	{:else}
		<ProjectEdit />
		<ProjectImage {project} />
		<ProjectTags {project} />
		<h1 class="font-bold text-xl mt-2">{project.title}</h1>
		<p>{project.description}</p>
		<ProjectActions {project} />
	{/if}
</div>
