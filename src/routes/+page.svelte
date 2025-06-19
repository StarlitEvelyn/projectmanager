<script lang="ts">
	import ProjectDetails from "@components/ProjectDetails.svelte";
	import ProjectList from "@components/ProjectList.svelte";
	import { readDir, readFile } from "@tauri-apps/plugin-fs";
	import type { Project } from "@type/project";
	let index = $state(0);

	let projects: Project[] = $state([]);

	const getProjects = async () => {
		const contents = await readDir("D:\\Projects");
		const folders = contents.filter((item) => item.isDirectory === true);
		folders.forEach(async (folder) => {
			const getPm = (await readDir(`D:\\Projects\\${folder.name}`)).find((item) => item.name === ".pm");
			if (!getPm) {
				projects.push({
					title: folder.name,
					image: "",
					description: "An unknown project",
					githubUrl: "",
					path: "",
				});
				return;
			}
			const getConfig = await readFile(`D:\\Projects\\${folder.name}\\.pm\\config.json`);

			const configStr = new TextDecoder().decode(getConfig);
			const readConfig = JSON.parse(configStr);

			projects.push({
				title: folder.name,
				image: readConfig.image ?? "",
				description: readConfig.description ?? "",
				githubUrl: readConfig.githubUrl ?? "",
				path: `D:\\Projects\\${folder.name}`,
			});
		});
		projects = projects; // Update state
		// Go through each folder and look for .pm folder
	};

	getProjects();

	/*const projects = [
		{
			title: "Project 123",
			image: "https://i.pinimg.com/736x/55/4b/5a/554b5a10f09b6b903750bb4be968ac1c.jpg",
			description: "A cool project with a very long description like very very long",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
		{
			title: "OwO projectirino",
			image: "https://i.pinimg.com/736x/5a/80/2b/5a802b7933aabe83e0a491f2040a0000.jpg",
			description: "A cool project with a slightly shorter description",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
		{
			title: "Oh no bulgie wulgie",
			image: "https://i.pinimg.com/736x/47/4a/13/474a136be00fa4a96b671738c1c70553.jpg",
			description: "A cool project",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
		{
			title: "I like cookies!",
			image: "https://i.pinimg.com/736x/ff/c9/84/ffc9840631fb375f6c0db4824673cfba.jpg",
			description: "A cool project",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
		{
			title: "I have depression",
			image: "https://i.pinimg.com/736x/77/29/a1/7729a1be9f3ab237151b971a120724c4.jpg",
			description: "A cool project",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
		{
			title: "Project 123",
			image: "https://i.pinimg.com/736x/6a/47/76/6a47761d0f1eb2555a41667865e5f5f5.jpg",
			description: "A cool project",
			githubUrl: "https://google.com",
			path: "D:\\Projects\\homedash",
		},
	];*/
</script>

<main class="flex bg-zinc-800 w-full h-full overflow-hidden">
	<ProjectList {projects} bind:index />
	<ProjectDetails project={projects[index] ?? null} />
</main>
