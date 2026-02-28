<script lang="ts">
	import SettingsCategories from "@components/settings/SettingsCategories.svelte";
	import SettingsMenu from "@components/settings/SettingsMenu.svelte";
	import TitleBar from "@components/settings/TitleBar.svelte";

	const categories = ["General"];
	let selected = $state("General");
</script>

<main
	class="flex flex-col text-white bg-zinc-800 w-full h-full overflow-hidden"
>
	<TitleBar />
	<div class="flex gap-2 mt-2 h-full">
		<SettingsCategories {categories} bind:selected />
		<SettingsMenu {selected} />
	</div>
</main>
