"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { personalInfo } from "@/lib/portfolio";

const NAV_LINKS = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#skills-section", label: "Skills" },
    { href: "/#featured-projects", label: "Projects" },
    { href: "/#contact-section", label: "Contact" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <header className={scrolled ? "scrolled" : ""}>
            <div className="container nav-container">
                <div className="logo">
                    <Link href="/">
                        <span style={{ color: "var(--primary-color)" }}>&gt;</span>{" "}
                        {personalInfo.name}
                    </Link>
                </div>
                <nav>
                    <ul>
                        {NAV_LINKS.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href}>{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <button
                    className="mobile-menu-toggle"
                    aria-label="Toggle mobile menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
                <ul>
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <Link href={l.href} onClick={closeMenu}>
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
