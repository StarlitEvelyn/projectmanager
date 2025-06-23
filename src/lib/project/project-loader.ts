import { getSettings } from "$lib/settings.svelte";
import { join } from "@tauri-apps/api/path";
import { readDir, readTextFile } from "@tauri-apps/plugin-fs";
import type { Project } from "@type/project";

export async function discoverProjects(): Promise<Project[]> {
	const settings = await getSettings();
	const paths = settings.searchPaths;

	const projects = await Promise.all(
		paths.map(async (path) => {
			try {
				return await discoverProjectsInPath(path);
			} catch (error) {
				console.error(`Error discovering projects in path ${path}:`, error);
				return [];
			}
		}),
	);

	return projects.flat();
}

const defaulProjectProperties: Project = {
	title: "Unknown Project",
	image: "",
	description: "An unknown project",
	githubUrl: "",
	path: "",
	tags: [],
	hasConfig: false,
};

type ProjectConfig = {
	type: "project";
	title: string;
	image?: string;
	description?: string;
	githubUrl?: string;
	tags?: string[];
};

type LibraryConfig = {
	type: "library";
	ignore: string[];
	tags?: string[];
};

type PmConfig = ProjectConfig | LibraryConfig;

async function discoverProjectsInPath(path: string, tags: string[] = []): Promise<Project[]> {
	const contents = await readDir(path);
	const folders = contents.filter((item) => item.isDirectory);

	let ignoredFolders: string[] = [];
	if (folders.some((item) => item.name === ".pm")) {
		// If the .pm folder is present, we are in a project root
		const pmConfigPath = await join(path, ".pm", "config.json");
		const pmConfigRaw = await readTextFile(pmConfigPath);
		const pmConfig = JSON.parse(pmConfigRaw) as PmConfig;

		if (pmConfig.type === "project") {
			return [];
		}

		if (pmConfig.type === "library") {
			ignoredFolders = pmConfig.ignore || [];
			tags = [...(pmConfig.tags || []), ...tags];
		}
	}

	let projects: Project[] = [];

	for (const folder of folders) {
		if (folder.name === ".pm") {
			continue;
		}

		const folderPath = await join(path, folder.name);
		const fileContents = await readDir(folderPath);
		const shouldBeIgnored = ignoredFolders.includes(folder.name);
		if (shouldBeIgnored) {
			continue;
		}

		const hasPmConfig = fileContents.some((item) => item.name === ".pm" && item.isDirectory);

		if (!hasPmConfig) {
			projects.push({
				...defaulProjectProperties,
				title: folder.name,
				path: folderPath,
			});
			continue;
		}

		const pmConfigPath = await join(folderPath, ".pm", "config.json");
		const pmConfigRaw = await readTextFile(pmConfigPath);

		if (!pmConfigRaw) {
			projects.push({
				...defaulProjectProperties,
				title: folder.name,
				path: folderPath,
			});
			continue;
		}

		const pmConfig = JSON.parse(pmConfigRaw) as PmConfig;
		const projectTags = [...(pmConfig.tags || []), ...tags];

		if (pmConfig.type === "library") {
			const subprojects = await discoverProjectsInPath(folderPath, tags);
			projects.push(...subprojects);
			continue;
		}

		if (pmConfig.type !== "project") {
			projects.push({
				...defaulProjectProperties,
				title: folder.name,
				path: folderPath,
				tags: projectTags,
			});
			continue;
		}

		projects.push({
			title: folder.name,
			image: pmConfig.image ?? "",
			description: pmConfig.description ?? "No description",
			githubUrl: pmConfig.githubUrl ?? "",
			path: folderPath,
			tags: pmConfig.tags ?? [],
			hasConfig: true,
		});
	}

	return projects;
}
