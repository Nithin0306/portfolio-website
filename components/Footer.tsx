import Link from "next/link";
import { personalInfo, socialLinks } from "@/lib/portfolio";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="social-links">
                    <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-button"
                        aria-label="GitHub"
                    >
                        <i className="devicon-github-original" />
                    </a>
                    <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-button"
                        aria-label="LinkedIn"
                    >
                        <i className="devicon-linkedin-plain" />
                    </a>
                </div>
                <p>{personalInfo.copyright}</p>
            </div>
        </footer>
    );
}
