<script lang="ts">
	import { Edit } from "lucide-svelte";

	const openProjectEditor = () => {
		console.log("TODO: make project editor");
	};
</script>

<button onclick={openProjectEditor} class="flex flex-col cursor-pointer justify-center items-center absolute bg-zinc-800 w-8 h-8 rounded right-3 top-3">
	<Edit />
</button>
