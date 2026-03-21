import { about, education } from "@/lib/portfolio";

export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="container">
                <div className="about-wrapper">
                    <div className="about-left">
                        <h3>About Me</h3>
                        {about.paragraphs.map((para, i) => (
                            <p
                                key={i}
                                dangerouslySetInnerHTML={{ __html: para }}
                            />
                        ))}
                    </div>

                    <div className="about-right">
                        <h3>Education &amp; Certification</h3>
                        {education.map((edu, i) => (
                            <div className="education-card" key={i}>
                                <div className="education-icon">
                                    <i className="fas fa-graduation-cap" />
                                </div>
                                <div className="education-details">
                                    <h4>{edu.degree}</h4>
                                    <p>
                                        {edu.institution} <span>({edu.year})</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
