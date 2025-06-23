import { join } from "@tauri-apps/api/path";
import { copyFile, exists, mkdir, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Project } from "@type/project";
import type { Optional } from "@type/utils";

export async function saveProject(project: Optional<Project, "hasConfig">) {
	delete project.hasConfig;

	const config = project as any;

	config.type = "project";

	// Ensure .pm exists
	const FOLDER_PATH = await join(config.path, ".pm");
	if (!(await exists(FOLDER_PATH))) await mkdir(FOLDER_PATH);

	// Save config file to project
	const FILE_PATH = await join(config.path, ".pm", "config.json");
	await writeTextFile(FILE_PATH, JSON.stringify(config));

	return project;
}

export async function saveImage(project: Project, imagePath: string) {
	const split = imagePath.split(".");
	const extension = split[split.length - 1];

	const DEST_PATH = await join(project.path, ".pm", `image.${extension}`);
	await copyFile(imagePath, DEST_PATH);
}
