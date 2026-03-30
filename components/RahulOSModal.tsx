"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFolder, FaTerminal, FaCode, FaGithub, FaLinkedin, FaLinux } from "react-icons/fa";
import dynamic from "next/dynamic";

const LinuxEmulator = dynamic(() => import("@/components/LinuxEmulator"), { ssr: false });

/* ──────────────────────────────────────────────
   CUSTOM NexusOS SIMULATOR – no iframe needed
   A fully interactive fake OS with a terminal, 
   file browser, and about panel.
────────────────────────────────────────────── */

const BOOT_STEPS = [
  "[ OK ]  Initialising NexusOS v2.0 Kernel",
  "[ OK ]  Loading Hardware Abstraction Layer",
  "[ OK ]  Mounting /dev/embedded ── ESP32 · STM32 · RPi",
  "[ OK ]  Starting AI Inference Engine ── TensorFlow · YOLOv3",
  "[ OK ]  Connecting to /dev/github ── rahul2005-tro",
  "[ OK ]  Launching Desktop Environment",
];

const FS = {
  "~/projects/hardware": ["smart_water_kit.py", "ai_rail_monitor.c", "bike_health.cpp", "esp32_cam_yolo.py", "vicharah_els.cpp"],
  "~/projects/software": ["tevron_microgrid/", "rf_cognisant.py", "motor_dashboard.html", "air_monitor.html"],
  "~/documents": ["resume_rahul_g.pdf", "patent_certificate.pdf", "sih2025_winner.jpg"],
  "~/config": [".bashrc", "gpio_config.json", "ai_model_config.yaml"],
};

const TERM_COMMANDS: Record<string, () => string> = {
  help: () => `  Available commands:
  ls            list directory contents
  cd <dir>      change directory
  cat <file>    view file contents
  whoami        current user info
  uname -a      system information
  neofetch      system summary
  clear         clear terminal
  exit          close the OS and return to main page`,
  whoami: () => "rahul_g",
  "uname -a": () => "NexusOS 2.0.0 #1 SMP x86_64 embedded-ai-iot GNU/Linux",
  neofetch: () => `       ██████    rahul_g@NexusOS
       ████████   ─────────────────
      ██  ██  ██  OS: NexusOS v2.0.0
     ███████████  Kernel: Embedded-AI-4.19
    ██ ███████ ██ Shell: zsh 5.9
   ████████████████ CPU: ESP32 @ 240MHz
                    GPU: Matrix Rain Accelerator
                    Memory: 1337 MB / 4096 MB
                    Projects: 15+ deployed`,
  pwd: () => "~/projects/hardware",
  ls: () => Object.values(FS).flat().join("\n"),
  date: () => new Date().toUTCString(),
  echo: () => "Usage: echo <text>",
};

// ─── Terminal App ───
function OSTerminal({ onExit }: { onExit: () => void }) {
  const [lines, setLines] = useState<{ text: string; isCmd: boolean }[]>([
    { text: "NexusOS v2.0 — Type 'help' for commands", isCmd: false },
    { text: "rahul_g@NexusOS:~$", isCmd: false },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~/projects");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const run = (cmd: string) => {
    const trimmed = cmd.trim();
    const out: { text: string; isCmd: boolean }[] = [
      { text: `${cwd}$ ${cmd}`, isCmd: true },
    ];

    if (trimmed === "clear") {
      setLines([{ text: "rahul_g@NexusOS:~$", isCmd: false }]);
      return;
    }
    if (trimmed === "exit") {
      onExit();
      return;
    }

    const [base, arg] = trimmed.split(" ");
    if (trimmed.startsWith("cd ")) {
      const dir = Object.keys(FS).find((k) => k.includes(arg));
      if (dir) {
        setCwd(dir);
        out.push({ text: `Changed to ${dir}`, isCmd: false });
      } else {
        out.push({ text: `cd: no such directory: ${arg}`, isCmd: false });
      }
    } else if (trimmed.startsWith("ls")) {
      const files = FS[cwd as keyof typeof FS] || Object.values(FS).flat();
      out.push({ text: files.join("  "), isCmd: false });
    } else if (trimmed.startsWith("echo ")) {
      out.push({ text: trimmed.slice(5), isCmd: false });
    } else if (TERM_COMMANDS[trimmed]) {
      out.push({ text: TERM_COMMANDS[trimmed](), isCmd: false });
    } else if (trimmed === "") {
      // empty
    } else {
      out.push({ text: `rahul_g: command not found: ${trimmed}\nType 'help' for commands.`, isCmd: false });
    }

    setLines((prev) => [...prev, ...out]);
    setInput("");
  };

  return (
    <div
      className="h-full flex flex-col bg-[#050508] font-mono text-xs"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="p-1.5 pb-0 flex-1 overflow-y-auto space-y-0.5 text-[11px]">
        {lines.map((l, i) => (
          <div key={i} className={l.isCmd ? "text-neon-green" : "text-slate-400 whitespace-pre-wrap"}>
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-1 px-2 py-1.5 border-t border-neon-green/10 bg-[#080812]">
        <span className="text-neon-green shrink-0 text-[11px]">{cwd}$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(input)}
          className="flex-1 bg-transparent text-slate-200 outline-none caret-neon-green text-[11px]"
          autoFocus
        />
      </div>
    </div>
  );
}

// ─── File Browser ───
function FileBrowser() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="h-full flex flex-col md:flex-row bg-[#050508] text-[11px] font-mono overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-neon-green/10 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-thin">
        {Object.keys(FS).map((dir) => (
          <button
            key={dir}
            onClick={() => setSelected(dir)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-all ${
              selected === dir ? "bg-neon-green/15 text-neon-green" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <FaFolder className="text-neon-green/60 shrink-0" />
            <span className="truncate">{dir.replace("~/", "")}</span>
          </button>
        ))}
      </div>
      {/* Files */}
      <div className="flex-1 p-3 overflow-y-auto">
        {selected ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FS[selected as keyof typeof FS].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 p-2 rounded border border-neon-green/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all cursor-default"
              >
                <FaCode className="text-neon-green/60 shrink-0 text-[10px]" />
                <span className="text-slate-400 text-[10px] truncate">{f}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center mt-8">Select a folder to browse files</p>
        )}
      </div>
    </div>
  );
}

// ─── About Panel ───
function AboutPanel() {
  return (
    <div className="h-full bg-[#050508] p-4 font-mono text-[11px] overflow-y-auto space-y-4">
      <div className="border border-neon-green/20 rounded-lg p-4 bg-neon-green/3">
        <p className="text-neon-green font-bold mb-3">SYSTEM INFO</p>
        {[
          ["User", "Rahul G"],
          ["Role", "Embedded Systems Engineer"],
          ["OS", "NexusOS v2.0"],
          ["Kernel", "AI-Embedded 4.19"],
          ["Projects", "15+ Deployed"],
          ["Achievements", "SIH 2025 National Winner"],
          ["Status", "Open to Opportunities"],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3 py-0.5">
            <span className="text-slate-500 w-24 shrink-0">{k}:</span>
            <span className="text-slate-300">{v}</span>
          </div>
        ))}
      </div>
      <div className="border border-cyber-cyan/20 rounded-lg p-4 bg-cyber-cyan/3">
        <p className="text-cyber-cyan font-bold mb-2">INSTALLED PACKAGES</p>
        {["python3 · 3.11", "tensorflow · 2.14", "openCV · 4.8", "node.js · 20.x", "esp-idf · 5.1", "solidworks · 2024"].map((pkg) => (
          <div key={pkg} className="text-slate-500 py-0.5">● {pkg}</div>
        ))}
      </div>
      <div className="flex gap-3">
        <a href="https://github.com/rahul2005-tro" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neon-green/30 text-neon-green hover:bg-neon-green/10 transition-all">
          <FaGithub /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/rahul-g-840425239/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all">
          <FaLinkedin /> LinkedIn
        </a>
      </div>
    </div>
  );
}

// ─── Main Modal ───
interface Props { open: boolean; onClose: () => void; }

type AppId = "terminal" | "files" | "about" | "linux";
interface AppWindow { id: AppId; title: string; icon: React.ReactNode; minimized: boolean; }

const APPS: { id: AppId; label: string; icon: React.ReactNode }[] = [
  { id: "terminal", label: "Terminal",   icon: <FaTerminal /> },
  { id: "files",    label: "Files",      icon: <FaFolder /> },
  { id: "about",    label: "About",      icon: <FaCode /> },
  { id: "linux",    label: "Linux OS",   icon: <FaLinux className="text-orange-400" /> },
];

export default function RahulOSModal({ open, onClose }: Props) {
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [activeApp, setActiveApp] = useState<AppId>("terminal");

  useEffect(() => {
    if (!open) { setBooting(true); setBootStep(0); setWindows([]); return; }
    
    // Push history state to capture Android/Mobile "back" button
    window.history.pushState({ modalOpen: true }, "", "#nexus-os");

    const onPopState = () => {
      onClose();
    };
    window.addEventListener("popstate", onPopState);

    /* Lock body scroll robustly */
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    
    BOOT_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setBootStep(i + 1);
        if (i === BOOT_STEPS.length - 1) setTimeout(() => {
          setBooting(false);
          setWindows([{ id: "terminal", title: "Terminal", icon: <FaTerminal />, minimized: false }]);
        }, 600);
      }, i * 500);
    });
    return () => { 
      window.removeEventListener("popstate", onPopState);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = ""; 
    };
  }, [open, onClose]);

  const handleClose = () => {
    onClose();
    // If we pushed state, let's silently go back in history to clean up the stack
    // without triggering another UI change since we already called onClose()
    if (typeof window !== "undefined" && window.location.hash === "#nexus-os") {
      window.history.back();
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && open) handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  const openApp = (id: AppId) => {
    setActiveApp(id);
    if (!windows.find((w) => w.id === id)) {
      const app = APPS.find((a) => a.id === id)!;
      setWindows((w) => [...w, { id, title: app.label, icon: app.icon, minimized: false }]);
    }
  };

  const closeApp = (id: AppId) => setWindows((w) => w.filter((x) => x.id !== id));

  const activeWindow = windows.find((w) => w.id === activeApp && !w.minimized);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-[#0a0a14] border-b border-neon-green/20 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-neon-green" style={{ textShadow: "0 0 15px #00ff41aa" }}>
                NEXUS_OS
              </span>
              <span className="font-mono text-[10px] text-slate-600 border border-slate-800 px-1.5 py-0.5 rounded">v2.0</span>
            </div>
            <div className="hidden md:flex items-center gap-1 font-mono text-[10px] text-slate-600">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
              <span className="ml-2 text-neon-green">●</span>
            </div>
            <button onClick={handleClose} className="font-mono text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
              <FaTimes /> CLOSE OS
            </button>
          </div>

          <AnimatePresence mode="wait">
            {booting ? (
              /* BOOT SCREEN */
              <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-12 text-center">
                  <div className="font-mono text-6xl font-black text-neon-green mb-2"
                    style={{ textShadow: "0 0 60px #00ff41aa" }}>NEXUS_OS</div>
                  <div className="font-mono text-xs text-slate-600 tracking-widest">EMBEDDED · AI · IOT WORKSPACE v2.0</div>
                </motion.div>
                <div className="space-y-1.5 text-left w-full max-w-lg px-4 sm:px-6 font-mono text-[10px] sm:text-xs">
                  {BOOT_STEPS.slice(0, bootStep).map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                      className={line.startsWith("[ OK ]") ? "text-neon-green" : "text-slate-400"}>
                      {line}
                    </motion.div>
                  ))}
                  {bootStep < BOOT_STEPS.length && (
                    <span className="text-neon-green animate-pulse">▋</span>
                  )}
                </div>
                <div className="mt-10 w-64 h-0.5 bg-neon-green/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-neon-green" style={{ boxShadow: "0 0 10px #00ff41" }}
                    animate={{ width: `${(bootStep / BOOT_STEPS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </motion.div>
            ) : (
              /* DESKTOP */
              <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col overflow-hidden">

                {/* App Bar (tabs) */}
                <div className="flex items-center gap-1 px-4 py-1.5 bg-[#0a0a14] border-b border-neon-green/10 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-thin">
                  {APPS.map((app) => {
                    const isOpen = windows.some((w) => w.id === app.id);
                    const isActive = activeApp === app.id && isOpen;
                    return (
                      <button key={app.id} onClick={() => openApp(app.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs transition-all ${
                          isActive ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}>
                        {app.icon} {app.label}
                        {isOpen && <span className="w-1 h-1 rounded-full bg-current ml-0.5 opacity-60" />}
                      </button>
                    );
                  })}
                  <div className="ml-auto font-mono text-[10px] text-slate-700">
                    {windows.filter(w => !w.minimized).length} window{windows.filter(w => !w.minimized).length !== 1 ? "s" : ""} open
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative overflow-hidden">
                  {/* Wallpaper */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,255,65,0.02),transparent)]" />

                  {windows.filter((w) => !w.minimized).map((win) => (
                    win.id === activeApp && (
                      <motion.div key={win.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-4 flex flex-col rounded-xl overflow-hidden border border-neon-green/20"
                        style={{ background: "#070710", boxShadow: "0 0 60px rgba(0,255,65,0.08)" }}>
                        {/* Window title */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d1a] border-b border-neon-green/15 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 cursor-pointer" onClick={() => closeApp(win.id)} />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
                          <span className="font-mono text-xs text-slate-500 ml-2 flex items-center gap-1.5">
                            {win.icon} {win.title}
                          </span>
                        </div>
                        {/* Window content */}
                        <div className="flex-1 overflow-hidden">
                          {win.id === "terminal" && <OSTerminal onExit={handleClose} />}
                          {win.id === "files"    && <FileBrowser />}
                          {win.id === "about"    && <AboutPanel />}
                          {win.id === "linux"    && <LinuxEmulator />}
                        </div>
                      </motion.div>
                    )
                  ))}

                  {windows.filter(w => !w.minimized).length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center font-mono text-slate-700">
                        <p className="text-4xl mb-3">⬡</p>
                        <p className="text-sm">Open an app from the taskbar above</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
