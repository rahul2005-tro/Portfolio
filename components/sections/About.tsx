"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6">
      {/* Decorative glow */}
      <div className="absolute left-0 top-1/3 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 glass-section p-6 sm:p-10">
        {/* Section Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-16 text-center">
          <p className="section-tag mb-3">[ 01 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>About
            <span className="text-neon-green">_</span>Me
          </h2>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Text */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="glass-card rounded-xl p-8 border border-neon-green/10">
              <p className="text-sm font-mono text-neon-green mb-4">
                &lt;about&gt;
              </p>
              {profile.about.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-slate-300 leading-relaxed text-base mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
              <p className="text-sm font-mono text-neon-green mt-4">
                &lt;/about&gt;
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {profile.stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, borderColor: "rgba(0,255,65,0.4)" }}
                className="glass-card rounded-xl p-6 border border-neon-green/10 text-center"
              >
                <p
                  className="font-mono text-3xl font-black text-neon-green mb-1"
                  style={{ textShadow: "0 0 20px #00ff4166" }}
                >
                  {stat.value}
                </p>
                <p className="text-slate-500 text-sm tracking-wider uppercase font-mono">
                  {stat.label}
                </p>
              </motion.div>
            ))}

            {/* Interests */}
            <div className="glass-card rounded-xl p-6 border border-cyber-cyan/10 mt-2">
              <p className="font-mono text-xs text-cyber-cyan mb-3 tracking-widest">
                INTERESTS
              </p>
              <div className="flex flex-wrap gap-2">
                {["Aerodynamics", "Embedded Systems", "AI / ML", "IoT", "Robotics", "Signal Processing"].map(
                  (item) => (
                    <span
                      key={item}
                      className="text-xs font-mono px-2 py-1 rounded border border-cyber-cyan/20 text-cyber-cyan/80 bg-cyber-cyan/5"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
