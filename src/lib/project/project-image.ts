import { convertFileSrc } from "@tauri-apps/api/core";
import type { Project } from "@type/project";

export function projectImage(project: Project) {
	return convertFileSrc(`${project.path}\\${project.image}`);
}
