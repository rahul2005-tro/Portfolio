"use client";

import { motion } from "framer-motion";
import { timelineItems } from "@/data/profile";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="absolute left-0 top-0 w-96 h-96 bg-neon-purple/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
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
            <span className="text-neon-green/50">// </span>Experience
            <span className="text-neon-green">_</span>& Research
          </h2>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-6 top-0 bottom-0 w-px timeline-line opacity-30" />

          <div className="flex flex-col gap-10">
            {timelineItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8 md:pl-20"
              >
                {/* Dot */}
                <div
                  className="absolute left-0 md:left-6 top-1.5 w-3 h-3 rounded-full border-2 border-neon-green bg-dark-bg
                               -translate-x-[5px] shadow-[0_0_8px_#00ff41]"
                />

                <div className="glass-card rounded-xl p-6 border border-neon-green/10 hover:border-neon-green/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-mono text-base font-bold text-slate-100">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-mono">
                        {item.organization}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-neon-green/80 border border-neon-green/20 px-3 py-1 rounded-full self-start shrink-0 bg-neon-green/5">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 rounded border border-cyber-cyan/20 text-cyber-cyan/70 bg-cyber-cyan/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
