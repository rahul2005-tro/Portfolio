"use client";

import { motion } from "framer-motion";
import { achievements } from "@/data/profile";

const typeConfig = {
  winner: {
    border: "rgba(255,215,0,0.4)",
    bg: "rgba(255,215,0,0.05)",
    glow: "0 0 40px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.03)",
    label: "text-neon-gold",
    labelBg: "bg-neon-gold/10 border-neon-gold/30",
    badge: "WINNER",
  },
  finalist: {
    border: "rgba(0,212,255,0.25)",
    bg: "rgba(0,212,255,0.03)",
    glow: "0 0 20px rgba(0,212,255,0.08)",
    label: "text-cyber-cyan",
    labelBg: "bg-cyber-cyan/10 border-cyber-cyan/30",
    badge: "FINALIST",
  },
  recognition: {
    border: "rgba(159,0,255,0.3)",
    bg: "rgba(159,0,255,0.03)",
    glow: "0 0 20px rgba(159,0,255,0.1)",
    label: "text-neon-purple",
    labelBg: "bg-neon-purple/10 border-neon-purple/30",
    badge: "RECOGNITION",
  },
};

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-20 sm:py-28 px-4 sm:px-6">
      {/* Background glows */}
      <div className="absolute left-0 top-1/4 w-80 h-80 bg-neon-gold/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-cyber-cyan/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-tag mb-3">[ 05 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Achievements
            <span className="text-neon-gold">_</span>Log
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            National wins · Innovation recognition · Research
          </p>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Achievement Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((ach, i) => {
            const cfg = typeConfig[ach.type];
            return (
              <motion.div
                key={ach.event}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-xl p-6 border transition-all duration-300 relative overflow-hidden"
                style={{
                  borderColor: cfg.border,
                  background: cfg.bg,
                  boxShadow: cfg.glow,
                }}
              >
                {/* Holographic shimmer for winner */}
                {ach.type === "winner" && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,215,0,0.03) 0%, transparent 50%, rgba(255,215,0,0.03) 100%)",
                    }}
                  />
                )}

                {/* Top badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{ach.icon}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-1 rounded border ${cfg.labelBg} ${cfg.label}`}
                  >
                    {cfg.badge}
                  </span>
                </div>

                {/* Content */}
                <h3
                  className={`font-mono text-sm font-bold mb-1 ${
                    ach.type === "winner" ? "text-neon-gold" : "text-slate-100"
                  }`}
                  style={
                    ach.type === "winner"
                      ? { textShadow: "0 0 15px rgba(255,215,0,0.5)" }
                      : {}
                  }
                >
                  {ach.title}
                </h3>
                <p className="font-mono text-xs text-slate-400 mb-1">{ach.event}</p>
                <p className="font-mono text-xs text-slate-600 mb-3">{ach.org} · {ach.year}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{ach.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
