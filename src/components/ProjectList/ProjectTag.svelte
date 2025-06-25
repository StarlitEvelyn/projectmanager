<script lang="ts">
	type Props = {
		tag: string;
	};
	const { tag }: Props = $props();
</script>

<div class="bg-zinc-800 px-2 py-1 rounded text-white font-semibold max-w-1/3 overflow-hidden overflow-ellipsis" title={tag}>{tag}</div>
