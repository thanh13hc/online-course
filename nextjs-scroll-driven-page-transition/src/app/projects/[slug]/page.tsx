import projects from "@/data/project";
import { ProjectClient } from "./project-client";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];
  const nextProject = projects[Math.min(projectIndex + 1, projects.length - 1)];
  const prevProject = projects[Math.max(projectIndex - 1, 0)];

  return (
    <ProjectClient
      project={project}
      nextProject={nextProject}
      prevProject={prevProject}
    />
  );
}
