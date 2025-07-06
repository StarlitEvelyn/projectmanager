<script lang="ts">
	import SettingsLibraryPaths from "./settingCards/SettingsLibraryPaths.svelte";

	type Props = {
		selected: string;
	};

	const { selected }: Props = $props();

	const settingsArray: Record<string, any[]> = {
		General: [SettingsLibraryPaths],
	};
</script>

<div class="w-full h-full mr-2">
	{#each settingsArray[selected] as SettingComponent}
		<SettingComponent />
	{/each}
</div>
