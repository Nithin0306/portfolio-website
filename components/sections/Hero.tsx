import Link from "next/link";
import Terminal from "@/components/Terminal";
import { personalInfo, socialLinks } from "@/lib/portfolio";

export default function Hero() {
    return (
        <section className="hero-section" id="home">
            <div className="hero-orb-2" aria-hidden="true" />
            <div className="container">
                <div className="hero-content-wrapper">
                    <div className="profile-content">
                        <p className="hero-eyebrow">Hello, world!</p>
                        <h1>I&apos;m {personalInfo.firstName}</h1>
                        <h2>{personalInfo.tagline}</h2>
                        <p>{personalInfo.shortBio}</p>

                        <div className="profile-buttons">
                            <a
                                href={socialLinks.github}
                                className="profile-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="devicon-github-original" /> GitHub
                            </a>
                            <a
                                href={socialLinks.linkedin}
                                className="profile-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="devicon-linkedin-plain" /> LinkedIn
                            </a>
                            <a
                                href={socialLinks.cv}
                                className="profile-button"
                                download="NITHIN_CV.pdf"
                            >
                                <i className="fas fa-download" /> Download CV
                            </a>
                        </div>

                        <div className="scroll-down">
                            <a href="#about" aria-label="Scroll to About section">
                                <i className="fas fa-chevron-down" />
                            </a>
                        </div>
                    </div>

                    {/* Terminal Widget */}
                    <Terminal />
                </div>
            </div>
        </section>
    );
}
