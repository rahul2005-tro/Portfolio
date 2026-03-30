"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTerminal } from "react-icons/fa";

const WELCOME = [
  "RAHUL_G PORTFOLIO OS v2.0",
  "Type 'help' for available commands.",
  "──────────────────────────────────",
];

type Line = { text: string; type: "output" | "command" | "error" | "success" };

/** Scroll to a section, offset for fixed navbar, and close terminal safely */
function scrollToSection(id: string, close: () => void) {
  // Defer close to next tick — prevents AnimatePresence removeChild crash
  // that occurs when setOpen(false) is called during the same render cycle
  setTimeout(() => close(), 0);
  setTimeout(() => {
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  }, 400);
}

export default function TerminalWidget() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(
    WELCOME.map((text) => ({ text, type: "output" as const }))
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const close      = useCallback(() => setOpen(false), []);

  /* Build commands inside the component so they have access to `close` */
  const COMMANDS: Record<string, { desc: string; action: () => string[] }> =
    {
      help: {
        desc: "List available commands",
        action: () => [
          "┌─ COMMANDS ───────────────────────────────┐",
          "  help          Show this help menu",
          "  launch        Launch Dev Environment",
          "  about         About Rahul G",
          "  skills        Navigate to skills section",
          "  projects      Navigate to projects section",
          "  deployments   Navigate to deployed projects",
          "  achievements  Navigate + list achievements",
          "  experience    Navigate to experience",
          "  contact       Navigate to contact",
          "  github        Open GitHub profile",
          "  linkedin      Open LinkedIn profile",
          "  clear         Clear terminal",
          "└──────────────────────────────────────────┘",
        ],
      },
      launch: {
        desc: "Launch Dev Environment",
        action: () => {
          setTimeout(() => {
            close();
            window.dispatchEvent(new CustomEvent("launch-dev-env"));
          }, 300);
          return [
            ">> Launching Dev Environment...",
            "   Loading NexusOS v2.0...",
            "   ✓ Terminal, File Explorer, System Monitor ready.",
          ];
        },
      },
      about: {
        desc: "About Rahul G",
        action: () => [
          "┌─ ABOUT ──────────────────────────────────┐",
          "  Name:   Rahul G",
          "  Role:   Mechanical Engineering Student",
          "  Focus:  Embedded Systems · AI · IoT",
          "  Email:  rahul.jet10@gmail.com",
          "  Status: Open to Opportunities ●",
          "└──────────────────────────────────────────┘",
        ],
      },
      skills: {
        desc: "Go to skills",
        action: () => {
          scrollToSection("#skills", close);
          return [
            ">> Navigating to Skills...",
            "  [GREEN]  Python · C++ · Java · SQL",
            "  [AMBER]  ESP32 · STM32 · Arduino · RPi",
            "  [PURPLE] TensorFlow · OpenCV · YOLOv3",
            "  [CYAN]   React · Node.js · MongoDB",
          ];
        },
      },
      projects: {
        desc: "Go to projects",
        action: () => {
          scrollToSection("#projects", close);
          return [">> Navigating to Projects..."];
        },
      },
      deployments: {
        desc: "Go to deployed projects",
        action: () => {
          scrollToSection("#deployments", close);
          return [">> Navigating to Deployed Projects..."];
        },
      },
      achievements: {
        desc: "Go to achievements",
        action: () => {
          scrollToSection("#achievements", close);
          return [
            ">> Navigating to Achievements...",
            "  🏆 SIH 2025 — NATIONAL WINNER",
            "  🥈 SIH 2024 — Finalist",
            "  🌟 KPIT Sparkle — Finalist",
            "  🚀 StartupTN — Finalist",
            "  🥇 Atal Tinkering Lab — State 1st",
            "  🛸 ISRO — Recognition Award",
          ];
        },
      },
      experience: {
        desc: "Go to experience",
        action: () => {
          scrollToSection("#experience", close);
          return [">> Navigating to Experience..."];
        },
      },
      contact: {
        desc: "Go to contact",
        action: () => {
          scrollToSection("#contact", close);
          return [">> Navigating to Contact..."];
        },
      },
      github: {
        desc: "Open GitHub",
        action: () => {
          setTimeout(() => window.open("https://github.com/rahul2005-tro", "_blank"), 300);
          return [">> Opening GitHub: github.com/rahul2005-tro"];
        },
      },
      linkedin: {
        desc: "Open LinkedIn",
        action: () => {
          setTimeout(
            () => window.open("https://www.linkedin.com/in/rahul-g-840425239/", "_blank"),
            300
          );
          return [">> Opening LinkedIn profile..."];
        },
      },
      clear: {
        desc: "Clear terminal",
        action: () => {
          setLines(WELCOME.map((t) => ({ text: t, type: "output" as const })));
          return [];
        },
      },
    };

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "clear") {
      setLines(WELCOME.map((t) => ({ text: t, type: "output" })));
      setInput("");
      return;
    }

    const newLines: Line[] = [...lines, { text: `$ ${cmd}`, type: "command" }];
    const command = COMMANDS[trimmed];

    if (!trimmed) {
      setLines(newLines);
    } else if (command) {
      const result = command.action();
      result.forEach((text) => newLines.push({ text, type: "output" }));
      setLines(newLines);
    } else {
      newLines.push({
        text: `'${trimmed}': command not found. Type 'help'.`,
        type: "error",
      });
      setLines(newLines);
    }

    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistIdx(-1);
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((k) =>
        k.startsWith(input.toLowerCase())
      );
      if (matches.length === 1) setInput(matches[0]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-full bg-card-bg border border-neon-green/40
                   flex items-center justify-center text-neon-green hover:bg-neon-green/10
                   hover:border-neon-green hover:shadow-[0_0_20px_#00ff4166] transition-all duration-200"
        title="Toggle Terminal (type help)"
      >
        <FaTerminal className="text-sm" />
      </motion.button>

      {/* Terminal Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-[60] w-[420px] max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden
                       border border-neon-green/25 shadow-[0_0_40px_rgba(0,255,65,0.15)] max-h-[80vh]"
            style={{ height: "380px", display: "flex", flexDirection: "column" }}
          >
            {/* Title Bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a12] border-b border-neon-green/15 shrink-0">
              <button
                onClick={close}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-neon-green/80" />
              <span className="font-mono text-xs text-neon-green flex-1 text-center">
                rahul_g@terminal:~$
              </span>
              <button onClick={close} className="text-slate-600 hover:text-slate-400 text-xs">
                <FaTimes />
              </button>
            </div>

            {/* Output Area */}
            <div
              className="flex-1 overflow-y-auto p-3 bg-[#050508] font-mono text-xs space-y-0.5"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`leading-5 whitespace-pre-wrap ${
                    line.type === "command"
                      ? "text-cyber-cyan"
                      : line.type === "error"
                      ? "text-red-400"
                      : line.type === "success"
                      ? "text-neon-green"
                      : "text-slate-400"
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#080810] border-t border-neon-green/10 shrink-0">
              <span className="font-mono text-xs text-neon-green shrink-0">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent font-mono text-[16px] md:text-xs text-slate-200 outline-none
                           placeholder-slate-700 caret-neon-green"
                placeholder="type a command… (Tab to autocomplete)"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
