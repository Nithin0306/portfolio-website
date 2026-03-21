import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/portfolio";

export default function Projects() {
    const featured = projects.filter((p) => p.featured);

    return (
        <section className="featured-projects" id="featured-projects">
            <div className="container">
                <div className="featured-projects__header">
                    <div>
                        <span className="section-tag">work</span>
                        <h2 className="section-title" style={{ textAlign: "left" }}>
                            Featured Projects
                        </h2>
                        <p
                            style={{
                                color: "var(--text-secondary)",
                                marginTop: "1rem",
                                fontSize: "0.9rem",
                            }}
                        >
                            A curated selection of my best work.
                        </p>
                    </div>
                    <Link href="/projects" className="see-all-button">
                        See all
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="projects-list">
                    {featured.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
