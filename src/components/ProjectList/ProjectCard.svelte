<script lang="ts">
	import type { Project } from "@type/project.ts";

	type Props = {
		project: Project;
		onclick: (event: MouseEvent) => void;
	};

	const { project, onclick }: Props = $props();
</script>

<button {onclick} class="flex flex-col text-left cursor-pointer bg-zinc-900 h-50 p-1.5 rounded text-white">
	<img src={project.image} class="w-full h-28 object-cover rounded-t" alt={project.title} />

	<h1 class="font-bold overflow-hidden text-ellipsis text-nowrap text-lg" title={project.title}>
		{project.title}
	</h1>
	<p class="overflow-hidden text-ellipsis line-clamp-2" title={project.description}>{project.description}</p>
	<!-- TODO make tags appear on hover -->
</button>
