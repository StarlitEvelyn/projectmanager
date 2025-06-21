import { getSettings } from '$lib/settings.svelte';
import { join } from '@tauri-apps/api/path';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import type { Project } from '@type/project';

export async function discoverProjects(): Promise<Project[]> {
	const settings = await getSettings();
	const paths = settings.searchPaths;

	const projects = await Promise.all(
		paths.map(async (path) => {
			try {
				return await discoverProjectsInPath(path);
			} catch (error) {
				console.error(
					`Error discovering projects in path ${path}:`,
					error,
				);
				return [];
			}
		}),
	);

	return projects.flat();
}

const defaulProjectProperties: Project = {
	title: 'Unknown Project',
	image: '',
	description: 'An unknown project',
	githubUrl: '',
	path: '',
};

async function discoverProjectsInPath(path: string): Promise<Project[]> {
	const contents = await readDir(path);
	const folders = contents.filter((item) => item.isDirectory);

	let ignoredFolders: string[] = [];
	const hasIgnoreList = contents.some(
		(item) => item.isFile && item.name === '.pmignore',
	);
	if (hasIgnoreList) {
		const ignoreListPath = await join(path, '.pmignore');
		const ignoreListRaw = await readTextFile(ignoreListPath);
		ignoredFolders = ignoreListRaw.split('\n').map((line) => line.trim());
	}

	let projects: Project[] = [];

	for (const folder of folders) {
		const folderPath = await join(path, folder.name);
		const fileContents = await readDir(folderPath);
		const shouldBeIgnored = ignoredFolders.includes(folder.name);
		if (shouldBeIgnored) {
			continue;
		}

		const hasPmConfig = fileContents.some(
			(item) => item.name === '.pm' && item.isDirectory,
		);

		if (!hasPmConfig) {
			projects.push({
				...defaulProjectProperties,
				title: folder.name,
				path: folderPath,
			});
			continue;
		}

		const pmConfigPath = await join(folderPath, '.pm', 'config.json');
		const pmConfigRaw = await readTextFile(pmConfigPath);

		if (!pmConfigRaw) {
			projects.push({
				...defaulProjectProperties,
				title: folder.name,
				path: folderPath,
			});
			continue;
		}

		const pmConfig = JSON.parse(pmConfigRaw);

		projects.push({
			title: folder.name,
			image: pmConfig.image ?? '',
			description: pmConfig.description ?? 'No description',
			githubUrl: pmConfig.githubUrl ?? '',
			path: folderPath,
		});
	}

	return projects;
}
