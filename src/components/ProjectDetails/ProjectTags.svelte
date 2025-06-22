<script lang="ts">
	import type { Project } from "@type/project";

	type Props = {
		project: Project;
	};
	const { project }: Props = $props();
</script>

<div class="flex gap-2 mt-2">
	{#each project.tags as tag}
		<span class="bg-zinc-800 text-zinc-400 rounded px-2 py-1 text-sm">{tag}</span>
	{/each}
</div>
