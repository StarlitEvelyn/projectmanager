import { join } from "@tauri-apps/api/path";
import { copyFile, exists, mkdir, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Project } from "@type/project";
import type { Optional } from "@type/utils";

export async function saveData(e: any, project: Project, imagePath: string | null) {
	e.preventDefault();

	// Get data from form
	const form = e.target;
	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries()) as Data;

	type Data = {
		title: string;
		githubUrl: string;
		description: string;
	};

	// Transfer all edited values to the project
	(Object.keys(data) as (keyof Data)[]).forEach((key) => {
		project[key] = data[key].trim();
	});

	// If image was changed, imagePath will not be null,
	// we update project's image path to the .pm/image.extension
	if (imagePath) {
		const split = imagePath.split(".");
		const extension = split[split.length - 1];
		project.image = await join(".pm", `image.${extension}`);
	}

	// Save config file
	await saveProject(project);
	// Save image to .pm folder
	if (imagePath) await saveImage(project, imagePath);
}

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
