import Link from "next/link";
import Image from "next/image";
import { type Project } from "@/lib/portfolio";

interface Props {
    project: Project;
}

export default function ProjectCard({ project }: Props) {
    return (
        <div className="project-item">
            <div className="project-image">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                />
            </div>
            <div className="project-details">
                <div className="project-year-type">
                    {project.year} • {project.type}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <div className="project-tech">
                    {project.tech.map((t) => (
                        <span key={t}>{t}</span>
                    ))}
                </div>
                <p className="project-description">{project.description}</p>
                <a
                    href={project.github}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} project`}
                >
                    View Project
                </a>
            </div>
        </div>
    );
}
