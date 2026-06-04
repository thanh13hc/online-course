import projects from "@/data/project";
import Link from "next/link";

export default function Projects() {
  return (
    <ul className="project-list">
      {projects.map((p) => (
        <li key={p.id}>
          <div className="link">
            <span>&#8594;</span>
            <Link href={`/projects/${p.slug}`}>{p.title}</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
