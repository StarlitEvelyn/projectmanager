import type { Project } from "@type/project";
import { discoverProjects } from "./project-loader";

export let projects: { projects: Project[]; loading: boolean } = $state({ projects: [], loading: false });

export const loadProjects = async () => {
	if (projects.loading) return;
	projects.loading = true;
	projects.projects = await discoverProjects();
	projects.loading = false;
};
