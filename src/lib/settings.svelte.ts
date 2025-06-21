import { LazyStore } from '@tauri-apps/plugin-store';

export const defaultSettings = {
	searchPaths: [
		'D:\\Projects',
		'D:\\Dokumenty\\Programovani\\Projekty',
	] as string[],
};

export type Settings = typeof defaultSettings;

const settings = new LazyStore('settings.json', {
	autoSave: 100,
});

export const settingsStore = $state<{ value: Settings }>({
	value: defaultSettings,
});

export async function initSettings() {
	settingsStore.value = await getSettings();
}

export async function getSettings(): Promise<Settings> {
	const data = await settings.get<Settings>('settings');
	return {
		...defaultSettings,
		...data,
	};
}

export async function setSettings(newSettings: Settings): Promise<Settings> {
	await settings.set('settings', newSettings);
	settingsStore.value = newSettings;
	return newSettings;
}

export async function updateSettings(
	updates: Partial<Settings>,
): Promise<Settings> {
	const currentSettings = await getSettings();
	const newSettings = { ...currentSettings, ...updates };
	return setSettings(newSettings);
}
