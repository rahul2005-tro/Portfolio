"use client";

import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaCheckCircle } from "react-icons/fa";

/* Vercel Deployments Showcase
   Shows freelancing / client projects that are live on Vercel.
   Add your real Vercel live links here. */
const DEPLOYMENTS = [
  {
    title: "TVC Drone Control System",
    client: "Autonomous Robotics",
    description:
      "Thrust Vector Control system for autonomous drone stabilization with PID control loops, sensor fusion (IMU + GPS), and custom flight firmware for real-time attitude correction.",
    tech: ["JavaScript", "Embedded C", "PID Control", "IMU", "GPS", "Robotics"],
    live: "#",
    github: "https://github.com/rahul2005-tro/TVC",
    category: "Robotics",
    status: "development",
    year: "2025",
    accent: "#bf00ff",
  },
  {
    title: "Motor Protection Controller",
    client: "Industrial IoT Client",
    description:
      "Real-time motor health monitoring dashboard with threshold-based alerts, predictive maintenance analytics, and Firebase live data streaming.",
    tech: ["HTML", "JavaScript", "Firebase", "IoT", "Real-time"],
    live: "https://mpc-iot.vercel.app",
    github: "https://github.com/rahul2005-tro/MPC-IOT",
    category: "IoT Dashboard",
    status: "live",
    year: "2024",
    accent: "#00ff41",
  },
  {
    title: "Air Purification Monitor",
    client: "Smart Home Client",
    description:
      "Smart air quality monitoring portal displaying real-time PM2.5, CO₂, and VOC sensor readings with historical trend charts and alert system.",
    tech: ["HTML", "CSS", "JavaScript", "Sensors", "Charts"],
    live: "https://air-purification-website.vercel.app",
    github: "https://github.com/rahul2005-tro/air-purification-website",
    category: "Environmental IoT",
    status: "live",
    year: "2024",
    accent: "#00d4ff",
  },
  {
    title: "Rasavijanana — AI Electronic Tongue",
    client: "SIH 2025 Winner",
    description:
      "AI-powered electronic tongue for objective taste analysis. Combines NIR spectroscopy, electrochemical sensing, and ML for 99% accurate real-time taste classification and phytochemical profiling.",
    tech: ["ESP32", "Raspberry Pi", "ML", "Python", "Firebase", "React"],
    live: "https://sih-project-6f63a.web.app/",
    github: "https://github.com/rahul2005-tro",
    category: "AI + Healthcare",
    status: "deployed",
    year: "2025",
    accent: "#ffd700",
  },
  {
    title: "TEVRON Microgrid Analytics",
    client: "Renewable Energy",
    description:
      "Intelligent renewable energy analytics platform for microgrids with AI-driven predictive maintenance, digital twin simulation, anomaly detection, and reinforcement learning for load optimization. Supports online, offline, and hybrid modes.",
    tech: ["ESP32", "Raspberry Pi", "LoRa", "Python", "ML", "React"],
    live: "https://tevron-microgrid.vercel.app/",
    github: "https://github.com/rahul2005-tro",
    category: "Energy Tech",
    status: "live",
    year: "2025",
    accent: "#ff9500",
  },
  {
    title: "RF Cognisant Environment",
    client: "Research Lab",
    description:
      "Long-range RF signal intelligence platform using LoRa SX1278 with Raspberry Pi 4. AI-driven pattern recognition and anomaly detection in the RF spectrum.",
    tech: ["Python", "LoRa", "Raspberry Pi", "AI", "RF"],
    live: "#",
    github: "https://github.com/rahul2005-tro/Lora-with-Raspberry-PI",
    category: "RF Intelligence",
    status: "research",
    year: "2024",
    accent: "#9f00ff",
  },
  {
    title: "Smart Water Testing Kit",
    client: "Municipal Water Authority",
    description:
      "Portable IoT device measuring turbidity, pH, TDS, and temperature. Firebase-backed real-time dashboard with data logging and compliance reporting.",
    tech: ["ESP32", "Firebase", "Python", "Sensors", "IoT"],
    live: "#",
    github: "https://github.com/rahul2005-tro",
    category: "Environmental IoT",
    status: "deployed",
    year: "2024",
    accent: "#00d4ff",
  },
  {
    title: "Bike Health Monitor",
    client: "Automotive OEM",
    description:
      "Embedded diagnostics system for two-wheelers monitoring engine vibration, RPM patterns, and thermal conditions with predictive maintenance triggers.",
    tech: ["ESP32", "STM32", "Embedded C", "BLE", "Sensors"],
    live: "#",
    github: "https://github.com/rahul2005-tro",
    category: "Automotive IoT",
    status: "development",
    year: "2025",
    accent: "#ff9500",
  },
];

const statusConfig = {
  live: { label: "● LIVE", color: "#00ff41", bg: "rgba(0,255,65,0.1)" },
  deployed: { label: "✓ DEPLOYED", color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
  development: { label: "⚙ IN PROGRESS", color: "#ff9500", bg: "rgba(255,149,0,0.1)" },
  research: { label: "◈ RESEARCH", color: "#9f00ff", bg: "rgba(159,0,255,0.1)" },
};

export default function Deployments() {
  return (
    <section id="deployments" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="absolute left-0 top-1/3 w-80 h-80 bg-neon-green/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 glass-section p-6 sm:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-xs text-neon-green/60 tracking-widest mb-3">[ 04 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Deployed
            <span className="text-neon-green">_</span>Projects
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            Freelance · Client work · Live productions
          </p>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
        </motion.div>

        {/* Vercel badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/50 bg-[#0a0a14] font-mono text-xs text-slate-500">
            <span className="text-slate-300">▲</span> Deployed on Vercel
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          </div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPLOYMENTS.map((project, i) => {
            const sc = statusConfig[project.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group rounded-xl border bg-[#0a0a14] flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  borderColor: `${project.accent}15`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${project.accent}40`;
                  el.style.boxShadow = `0 20px 60px ${project.accent}10`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${project.accent}15`;
                  el.style.boxShadow = "";
                }}
              >
                {/* Card Header */}
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: `${project.accent}10`, background: `${project.accent}05` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                      style={{ color: project.accent, background: `${project.accent}15`, border: `1px solid ${project.accent}30` }}
                    >
                      {project.category}
                    </span>
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: sc.color, background: sc.bg }}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-5">
                  <h3 className="font-mono text-sm font-bold text-slate-100 mb-1 group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[10px] text-slate-600 mb-3">
                    {project.client} · {project.year}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded border"
                        style={{
                          color: `${project.accent}aa`,
                          borderColor: `${project.accent}20`,
                          background: `${project.accent}08`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 pb-5 flex items-center gap-3">
                  {project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all"
                      style={{ color: project.accent, border: `1px solid ${project.accent}40`, background: `${project.accent}10` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${project.accent}20`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${project.accent}10`; }}
                    >
                      <FaExternalLinkAlt className="text-[10px]" /> Live Demo
                    </a>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs text-slate-500
                               border border-slate-700/50 hover:text-neon-green hover:border-neon-green/40 transition-all"
                  >
                    <FaGithub /> Source
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
