import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/lib/portfolio";

export const metadata: Metadata = {
    title: "Projects - Nithin",
    description:
        "All projects by Nithin — full-stack web apps and hackathon builds.",
};

export default function AllProjectsPage() {
    return (
        <>
            <Navbar />
            <main>
                <section className="all-projects-page" id="featured-projects">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">portfolio</span>
                            <h1 className="section-title">All Projects</h1>
                            <p
                                style={{
                                    color: "var(--text-secondary)",
                                    marginTop: "1.5rem",
                                    fontSize: "0.9rem",
                                }}
                            >
                                A showcase of my web development projects, built with modern
                                technologies and creative solutions.
                            </p>
                        </div>

                        <div className="projects-list">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
