"use client";
import { useState, useRef, useCallback } from "react";
import { contact, socialLinks } from "@/lib/portfolio";

export default function Contact() {
    const [modalOpen, setModalOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [errors, setErrors] = useState({ name: false, email: false, message: false });
    const [showPopup, setShowPopup] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const validateName = (v: string) => v.trim().length >= 4;
    const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const validateMessage = (v: string) =>
        v.trim().split(/\s+/).filter((w) => w).length >= 10;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = formRef.current!;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

        const newErrors = {
            name: !validateName(name),
            email: !validateEmail(email),
            message: !validateMessage(message),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        setSending(true);
        try {
            const formData = new FormData(form);
            const res = await fetch(
                `https://formsubmit.co/ajax/${contact.formsubmitKey}`,
                { method: "POST", body: formData }
            );
            if (res.ok) {
                form.reset();
                setErrors({ name: false, email: false, message: false });
                setModalOpen(false);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3500);
            } else {
                alert("Failed to send. Please try again later.");
            }
        } catch {
            alert("Error sending. Please check your connection.");
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact-section" className="contact">
            <div className="container">
                <div className="contact-header">
                    <span className="section-tag">get in touch</span>
                    <h2>{contact.heading}</h2>
                    <p>{contact.subheading}</p>
                    <button
                        className="contact-button"
                        onClick={() => setModalOpen(true)}
                    >
                        <i className="fas fa-envelope" /> Get in Touch
                    </button>
                </div>

                <hr className="contact-divider" />

                <div className="contact-buttons">
                    <p>Or connect with me directly:</p>
                    <div className="social-links">
                        <a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button"
                        >
                            <i className="devicon-github-original" /> GitHub
                        </a>
                        <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button"
                        >
                            <i className="devicon-linkedin-plain" /> LinkedIn
                        </a>
                        <a
                            href={socialLinks.cv}
                            download="NITHIN_CV.pdf"
                            className="social-button"
                        >
                            <i className="fas fa-download" /> Download CV
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Contact Modal ── */}
            <div
                className={`modal${modalOpen ? " active" : ""}`}
                onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
            >
                <div className="modal-content">
                    <span
                        className="close-modal"
                        onClick={() => setModalOpen(false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setModalOpen(false)}
                    >
                        &times;
                    </span>

                    <div className="contact__form">
                        <h3>Send me a message</h3>
                        <form ref={formRef} onSubmit={handleSubmit} noValidate>
                            {/* FormSubmit hidden fields */}
                            <input type="hidden" name="_subject" value={contact.formSubject} />
                            <input type="hidden" name="_captcha" value="false" />
                            <input type="text" name="_honey" style={{ display: "none" }} />
                            <input type="hidden" name="_blacklist" value={contact.blacklist} />
                            <input type="hidden" name="_autoresponse" value={contact.autoresponse} />

                            <div className={`form-group${errors.name ? " error" : ""}`}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    onChange={(e) =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            name: !validateName(e.target.value),
                                        }))
                                    }
                                />
                                <span className="error-message">
                                    Please enter your name (min 4 characters)
                                </span>
                            </div>

                            <div className={`form-group${errors.email ? " error" : ""}`}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    onChange={(e) =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: !validateEmail(e.target.value),
                                        }))
                                    }
                                />
                                <span className="error-message">
                                    Please enter a valid email address
                                </span>
                            </div>

                            <div className={`form-group${errors.message ? " error" : ""}`}>
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    onChange={(e) =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            message: !validateMessage(e.target.value),
                                        }))
                                    }
                                />
                                <span className="error-message">
                                    Please enter a message (min 10 words)
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Success Popup ── */}
            <div className={`popup${showPopup ? " show" : ""}`}>
                ✓ Message sent successfully!
            </div>
        </section>
    );
}
