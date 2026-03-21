"use client";
import { useEffect, useRef } from "react";

const CODING_CHARS =
    "01}{[]<>|&^%$#@!~`?/\\;:+-*/=_abcdefABCDEF0123456789";

export default function MatrixEffect() {
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const char = document.createElement("div");
            char.className = "matrix-char";
            char.innerText = CODING_CHARS[Math.floor(Math.random() * CODING_CHARS.length)];
            char.style.left = `${e.clientX}px`;
            char.style.top = `${e.clientY}px`;
            document.body.appendChild(char);
            setTimeout(() => char.remove(), 600);
        };

        // Scroll progress bar
        const progressBar = document.createElement("div");
        progressBar.className = "scroll-progress";
        document.body.appendChild(progressBar);

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${pct}%`;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            progressBar.remove();
        };
    }, []);

    return null;
}
