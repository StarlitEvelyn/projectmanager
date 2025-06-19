<script lang="ts">
	import ProjectDetails from "@components/ProjectDetails.svelte";
	import ProjectList from "@components/ProjectList.svelte";
	import { readDir, readFile } from "@tauri-apps/plugin-fs";
	import type { Project } from "@type/project";
	let index = $state(0);

	let projects: Project[] = $state([]);

	const addUnknownProject = (folderName: string) => {
		projects.push({
			title: folderName,
			image: "",
			description: "An unknown project",
			githubUrl: "",
			path: `D:\\Projects\\${folderName}`,
		});
	};

	const getProjects = async () => {
		const contents = await readDir("D:\\Projects");
		const folders = contents.filter((item) => item.isDirectory === true);
		// Go through each folder and look for .pm folder
		folders.forEach(async (folder) => {
			const getPm = (await readDir(`D:\\Projects\\${folder.name}`)).find((item) => item.name === ".pm");
			// If folder not found, mark as an unknown project
			if (!getPm) return addUnknownProject(folder.name);

			// if folder was found, get data
			const getConfig = await readFile(`D:\\Projects\\${folder.name}\\.pm\\config.json`);

			// If config is missing, add project as an unknown project
			if (!getConfig) return addUnknownProject(folder.name);

			// Convert config to a JSON
			const configStr = new TextDecoder().decode(getConfig);
			const readConfig = JSON.parse(configStr);

			// Add project to list of projects
			projects.push({
				title: folder.name,
				image: readConfig.image ?? "",
				description: readConfig.description ?? "",
				githubUrl: readConfig.githubUrl ?? "",
				path: `D:\\Projects\\${folder.name}`,
			});
		});

		projects = projects; // Update state
	};

	getProjects();
</script>

<main class="flex bg-zinc-800 w-full h-full overflow-hidden">
	<ProjectList {projects} bind:index />
	<ProjectDetails project={projects[index] ?? null} />
</main>
