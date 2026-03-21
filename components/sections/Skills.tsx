import { skills } from "@/lib/portfolio";

export default function Skills() {
    return (
        <section className="skills-section" id="skills-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">expertise</span>
                    <h2 className="section-title">Skills &amp; Technologies</h2>
                </div>

                <div className="skills-grid">
                    {skills.map((skill) => (
                        <div className="skill-card" key={skill.name}>
                            <i className={skill.icon} />
                            <span>{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
