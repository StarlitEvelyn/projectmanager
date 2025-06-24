import { convertFileSrc } from "@tauri-apps/api/core";
import type { Project } from "@type/project";

export function projectImage(project: Project) {
	if (project.image) return convertFileSrc(`${project.path}\\${project.image}`);
	return null;
}
