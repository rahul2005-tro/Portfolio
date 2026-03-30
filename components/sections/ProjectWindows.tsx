"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaMicrochip, FaCode } from "react-icons/fa";
import { hardwareProjects, softwareProjects } from "@/data/profile";
import { GitHubRepo } from "@/types";

// Mini waveform SVG
function MiniWave({ color }: { color: string }) {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const x = (i / 19) * 100;
    const y = 50 + Math.sin((i / 19) * Math.PI * 3) * 35;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-6 opacity-30">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// PCB corner decoration
function PCBCorner({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-20">
      <path d="M0,20 L10,20 L10,10 L20,10" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="20" r="2" fill={color} />
      <circle cx="20" cy="10" r="2" fill={color} />
    </svg>
  );
}

interface WindowProps {
  type: "hardware" | "software";
  extraRepos?: GitHubRepo[];
}

function ProjectWindow({ type, extraRepos = [] }: WindowProps) {
  const isHW = type === "hardware";
  const color = isHW ? "#ff9500" : "#00d4ff";
  const title = isHW ? "HARDWARE_PROJECTS.exe" : "SOFTWARE_PROJECTS.exe";
  const [booting, setBooting] = useState(true);
  const [bootLine, setBootLine] = useState(0);

  const hwBootLines = ["Initializing Hardware Modules...", "Loading Sensor Drivers...", "Ready."];
  const swBootLines = ["Compiling Systems...", "Deploying Services...", "Ready."];
  const bootLines = isHW ? hwBootLines : swBootLines;

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      idx++;
      setBootLine(idx);
      if (idx >= bootLines.length) {
        clearInterval(t);
        setTimeout(() => setBooting(false), 400);
      }
    }, 600);
    return () => clearInterval(t);
  }, []);

  const projects = isHW ? hardwareProjects : softwareProjects;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden border flex flex-col min-h-[auto] sm:min-h-[560px]"
      style={{
        borderColor: `${color}25`,
        background: "rgba(8,8,14,0.95)",
        boxShadow: `0 0 40px ${color}15`,
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: `${color}20`, background: `${color}08` }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full rounded-full" style={{ background: color, opacity: 0.7 }} />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs" style={{ color }}>
          {isHW ? <FaMicrochip className="text-sm" /> : <FaCode className="text-sm" />}
          {title}
        </div>
        <div className="font-mono text-xs text-slate-600">●</div>
      </div>

      {/* PCB corner decorations */}
      <div className="absolute top-10 left-0 opacity-0 group-hover:opacity-100">
        <PCBCorner color={color} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {booting ? (
            <motion.div
              key="boot"
              exit={{ opacity: 0 }}
              className="p-6 flex flex-col gap-2"
            >
              {bootLines.slice(0, bootLine).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-xs"
                  style={{ color: line === "Ready." ? color : "#64748b" }}
                >
                  {line === "Ready." ? `✓ ${line}` : `> ${line}`}
                </motion.p>
              ))}
              <span className="font-mono text-xs animate-pulse" style={{ color }}>▋</span>
            </motion.div>
          ) : (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="p-4 flex flex-col gap-3"
            >
              {projects.map((proj, i) => (
                <motion.div
                  key={proj.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg p-4 border transition-all duration-300 group/card"
                  style={{
                    borderColor: `${color}15`,
                    background: `${color}05`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}15`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}15`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-lg shrink-0">{proj.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="font-mono text-xs font-bold text-slate-100 group-hover/card:text-white">
                          {proj.title}
                        </h4>
                        {"badge" in proj && proj.badge && (
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              color,
                              borderColor: `${color}30`,
                              border: "1px solid",
                              background: `${color}10`,
                            }}
                          >
                            {proj.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{proj.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            color: `${color}bb`,
                            border: `1px solid ${color}20`,
                            background: `${color}08`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {"github" in proj && proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-neon-green transition-colors text-sm"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {"live" in proj && proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors text-sm"
                          style={{ color: `${color}88` }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = `${color}88`)}
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Waveform footer */}
      <div className="px-4 pb-1 shrink-0 border-t" style={{ borderColor: `${color}10` }}>
        <MiniWave color={color} />
      </div>
    </motion.div>
  );
}

export default function ProjectWindows() {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setGithubRepos(d))
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,255,65,0.02),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 glass-section p-6 sm:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="section-tag mb-3">[ 03 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Project
            <span className="text-neon-green">_</span>System
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            Dual environment · Hardware + Software modules
          </p>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Dual Windows */}
        <div className="grid lg:grid-cols-2 gap-6 relative">
          <ProjectWindow type="hardware" />
          <ProjectWindow type="software" extraRepos={githubRepos} />
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/rahul2005-tro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-slate-400
                       hover:text-neon-green transition-colors border border-slate-700/50
                       hover:border-neon-green/40 px-6 py-3 rounded-lg"
          >
            <FaGithub /> View all on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
