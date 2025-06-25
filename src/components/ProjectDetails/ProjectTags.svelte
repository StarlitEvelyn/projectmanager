<script lang="ts">
	import type { Project } from "@type/project";

	type Props = {
		project: Project;
	};
	const { project }: Props = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] gap-2 mt-2">
	{#each project.tags as tag}
		<div class="bg-zinc-800 px-2 py-1 rounded text-white font-semibold overflow-hidden overflow-ellipsis" title={tag}>{tag}</div>
	{/each}
</div>
