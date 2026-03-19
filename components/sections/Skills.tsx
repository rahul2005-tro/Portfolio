"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/profile";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-cyber-cyan/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <p className="section-tag mb-3">[ 02 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Skill
            <span className="text-neon-green">_</span>Set.exe
          </h2>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: ci * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl p-5 border transition-all duration-300"
              style={{ borderColor: `${cat.color}15` }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${cat.color}55`;
                el.style.boxShadow = `0 0 30px ${cat.color}15, inset 0 0 20px ${cat.color}05`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${cat.color}15`;
                el.style.boxShadow = "";
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-lg" style={{ color: cat.color }}>
                  {cat.icon}
                </span>
                <h3
                  className="font-mono text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </h3>
              </div>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: ci * 0.05 + si * 0.04 }}
                    className="text-xs font-mono px-2.5 py-1 rounded-full border cursor-default transition-all duration-200"
                    style={{
                      color: cat.color,
                      borderColor: `${cat.color}30`,
                      backgroundColor: `${cat.color}08`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLSpanElement;
                      el.style.backgroundColor = `${cat.color}20`;
                      el.style.boxShadow = `0 0 10px ${cat.color}55`;
                      el.style.borderColor = `${cat.color}70`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLSpanElement;
                      el.style.backgroundColor = `${cat.color}08`;
                      el.style.boxShadow = "";
                      el.style.borderColor = `${cat.color}30`;
                    }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
