"use client";
import { useEffect, useRef, useCallback } from "react";
import { terminalConfig, projects, socialLinks } from "@/lib/portfolio";

type CommandMap = { [key: string]: string | (() => string) };

export default function Terminal() {
    const terminalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        currentInput: "",
        commandHistory: [] as string[],
        historyIndex: -1,
        currentPath: "~",
        terminalFocused: false,
    });

    const buildCommands = useCallback((): CommandMap => {
        const cfg = terminalConfig;
        const base: CommandMap = {};
        Object.entries(cfg.commands).forEach(([k, v]) => {
            if (v === "__DATE__") {
                base[k] = () => new Date().toString();
            } else {
                base[k] = v;
            }
        });
        base["history"] = () => stateRef.current.commandHistory.join("\n");
        return base;
    }, []);

    const executeCommand = useCallback(
        (cmd: string, commands: CommandMap): string => {
            const st = stateRef.current;
            const trimmed = cmd.trim().toLowerCase();
            if (trimmed === "") return "";

            st.commandHistory.push(cmd);
            st.historyIndex = st.commandHistory.length;

            if (trimmed === "clear") return "clear";

            // cd handling
            if (trimmed.startsWith("cd ")) {
                const dir = cmd.split(" ")[1];
                if (dir === "projects") {
                    st.currentPath = "~/projects";
                    return "";
                } else if (dir === ".." && st.currentPath === "~/projects") {
                    st.currentPath = "~";
                    return "";
                } else if (dir === "~" || dir === "" || dir === undefined) {
                    st.currentPath = "~";
                    return "";
                }
                return `cd: ${dir}: No such file or directory`;
            }
            if (trimmed === "cd") { st.currentPath = "~"; return ""; }

            // ls in projects
            if (trimmed === "ls" && st.currentPath === "~/projects") {
                return terminalConfig.projectLsOutput;
            }

            // echo
            if (trimmed.startsWith("echo ")) {
                return cmd.slice(5);
            }

            // open <project_id>
            if (trimmed.startsWith("open ")) {
                const id = trimmed.slice(5).trim();
                const proj = projects.find((p) => p.id === id);
                if (proj) {
                    window.open(proj.github, "_blank");
                    return `Opening ${proj.title} on GitHub...`;
                }
                const ids = projects.map((p) => p.id).join(", ");
                return `No project with id '${id}'. Available: ${ids}`;
            }

            // check commands map
            if (commands[trimmed]) {
                const val = commands[trimmed];
                return typeof val === "function" ? val() : val;
            }

            return `Command '${cmd}' not found. Type 'help' for available commands.`;
        },
        []
    );

    useEffect(() => {
        const terminal = terminalRef.current;
        const content = contentRef.current;
        if (!terminal || !content) return;

        // Non-null aliases for use inside nested functions
        const t = terminal as HTMLDivElement;
        const c = content as HTMLDivElement;

        const commands = buildCommands();
        const st = stateRef.current;

        function scrollToBottom() {
            t.scrollTop = t.scrollHeight;
        }

        function createPromptLine() {
            const line = document.createElement("div");
            line.className = "terminal-line";

            const promptSpan = document.createElement("span");
            promptSpan.className = "prompt";
            const pathSpan = document.createElement("span");
            pathSpan.className = "prompt-path";
            pathSpan.textContent = st.currentPath;

            promptSpan.innerHTML = `<span style="color:var(--accent-color)">${terminalConfig.username}</span><span style="color:var(--text-secondary)">@</span><span style="color:var(--primary-color)">${terminalConfig.hostname}</span><span style="color:var(--text-secondary)">:</span>`;
            promptSpan.appendChild(pathSpan);

            const dollarSpan = document.createElement("span");
            dollarSpan.className = "prompt";
            dollarSpan.textContent = "$ ";

            const inputSpan = document.createElement("span");
            inputSpan.className = "terminal-input";

            const cursorSpan = document.createElement("span");
            cursorSpan.className = "cursor";
            cursorSpan.textContent = "▋";

            line.appendChild(promptSpan);
            line.appendChild(dollarSpan);
            line.appendChild(inputSpan);
            line.appendChild(cursorSpan);

            return { line, inputSpan, cursorSpan };
        }

        function addOutput(text: string) {
            if (text === "clear") {
                c.innerHTML = "";
                return;
            }
            const out = document.createElement("div");
            out.className = "terminal-output";
            out.textContent = text;
            c.appendChild(out);
        }

        // Welcome message
        const welcome = document.createElement("div");
        welcome.className = "terminal-output";
        welcome.innerHTML = `<span style="color:var(--primary-color);font-weight:700">${terminalConfig.welcomeText}</span>
<span style="color:var(--text-secondary)">Last login: ${new Date().toLocaleString()}</span>
Type <span style="color:var(--accent-color)">'help'</span> for commands or <span style="color:var(--accent-color)">'about'</span> to know me!
`;
        c.appendChild(welcome);

        let { line, inputSpan, cursorSpan } = createPromptLine();
        c.appendChild(line);
        scrollToBottom();

        // Cursor blink
        const blinkInterval = setInterval(() => {
            const cur = c.querySelector<HTMLElement>(".terminal-line:last-child .cursor");
            if (cur) {
                cur.style.opacity = cur.style.opacity === "0" ? "1" : "0";
            }
        }, 530);

        // Click to focus
        t.addEventListener("click", () => {
            st.terminalFocused = true;
            t.setAttribute("tabindex", "0");
            t.focus();
        });

        // Key handler
        const onKeyDown = (e: KeyboardEvent) => {
            const active = document.activeElement;
            const isForm =
                active &&
                (active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    (active as HTMLElement).contentEditable === "true");
            if (isForm) return;

            const terminalClicked = t.contains(e.target as Node) || st.terminalFocused;
            if (!terminalClicked && active && active !== document.body) return;

            const curLine = c.querySelector<HTMLElement>(".terminal-line:last-child");
            const curInput = curLine?.querySelector<HTMLElement>(".terminal-input");
            const curCursor = curLine?.querySelector<HTMLElement>(".cursor");
            if (!curInput || !curCursor) return;

            switch (e.key) {
                case "Enter": {
                    e.preventDefault();
                    curCursor.style.display = "none";
                    const result = executeCommand(st.currentInput, commands);

                    if (result !== "") addOutput(result);
                    st.currentInput = "";
                    const next = createPromptLine();
                    line = next.line;
                    inputSpan = next.inputSpan;
                    cursorSpan = next.cursorSpan;
                    c.appendChild(next.line);
                    scrollToBottom();
                    break;
                }
                case "Backspace":
                    e.preventDefault();
                    if (st.currentInput.length > 0) {
                        st.currentInput = st.currentInput.slice(0, -1);
                        curInput.textContent = st.currentInput;
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if (st.historyIndex > 0) {
                        st.historyIndex--;
                        st.currentInput = st.commandHistory[st.historyIndex];
                        curInput.textContent = st.currentInput;
                    }
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (st.historyIndex < st.commandHistory.length - 1) {
                        st.historyIndex++;
                        st.currentInput = st.commandHistory[st.historyIndex];
                        curInput.textContent = st.currentInput;
                    } else {
                        st.historyIndex = st.commandHistory.length;
                        st.currentInput = "";
                        curInput.textContent = "";
                    }
                    break;
                case "Tab": {
                    e.preventDefault();
                    const available = Object.keys(commands).concat([
                        "clear", "echo", "open", "cd", "history",
                        "neofetch",
                    ]);
                    const matches = available.filter((c) =>
                        c.startsWith(st.currentInput)
                    );
                    if (matches.length === 1) {
                        st.currentInput = matches[0];
                        curInput.textContent = st.currentInput;
                    } else if (matches.length > 1) {
                        addOutput(matches.join("  "));
                        const next = createPromptLine();
                        next.inputSpan.textContent = st.currentInput;
                        c.appendChild(next.line);
                    }
                    break;
                }
                default:
                    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                        e.preventDefault();
                        st.currentInput += e.key;
                        curInput.textContent = st.currentInput;
                        scrollToBottom();
                    }
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            clearInterval(blinkInterval);
        };
    }, [buildCommands, executeCommand]);

    return (
        <div className="profile-image">
            <div className="terminal-box" ref={terminalRef} tabIndex={0}>
                <div className="terminal-topbar">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                    <span className="terminal-title">
                        {terminalConfig.username}@{terminalConfig.hostname}: ~
                    </span>
                </div>
                <div className="terminal-content" ref={contentRef} />
            </div>
        </div>
    );
}
