<script lang="ts">
	import type { Project } from "@type/project";
	import ProjectImage from "./ProjectImage.svelte";
	import ProjectTags from "./ProjectTags.svelte";
	import ProjectActions from "./ProjectActions.svelte";
	import ProjectEdit from "./ProjectEdit.svelte";
	import ProjectEditor from "@components/ProjectEditor/ProjectEditor.svelte";

	type Props = {
		project: Project | null;
	};
	let { project }: Props = $props();

	let show = $state(false);

	$effect(() => {
		show = false;
	});
</script>

<div class={`flex flex-col relative w-[26rem] h-full ml-2  p-2 text-white rounded-l-xl bg-zinc-900`}>
	{#if project == null}
		<div class="flex flex-col h-full justify-center">
			<div class="text-center">No project yet</div>
		</div>
	{:else}
		<ProjectEditor {project} bind:show />
		<ProjectEdit {project} bind:show />
		<ProjectImage {project} />
		<ProjectTags {project} />
		<h1 class="font-bold text-xl mt-2">{project.title}</h1>
		<p>{project.description}</p>
		<ProjectActions {project} />
	{/if}
</div>
