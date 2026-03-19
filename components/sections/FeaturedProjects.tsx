"use client";

import { motion } from "framer-motion";
import { featuredProjects } from "@/data/profile";

export default function FeaturedProjects() {
  return (
    <section id="featured" className="relative py-28 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,255,65,0.03),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-tag mb-3">[ 04 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Featured
            <span className="text-neon-green">_</span>Projects
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            Flagship engineering innovations
          </p>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Featured Cards */}
        <div className="flex flex-col gap-8">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.01 }}
              className="relative animated-border group cursor-default"
            >
              <div
                className={`rounded-xl p-8 md:p-10 bg-gradient-to-br ${project.gradient} 
                             glass border border-neon-green/10 group-hover:border-neon-green/30
                             transition-all duration-500`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon */}
                  <div
                    className="text-5xl md:text-6xl shrink-0 flex items-center justify-center
                                 w-20 h-20 rounded-2xl bg-neon-green/5 border border-neon-green/15
                                 group-hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] transition-all duration-300"
                  >
                    {project.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div>
                        <p className="font-mono text-xs text-neon-green/70 mb-1">
                          {project.subtitle}
                        </p>
                        <h3 className="font-mono text-xl md:text-2xl font-bold text-slate-100">
                          {project.title}
                        </h3>
                      </div>
                      <span
                        className="font-mono text-xs px-3 py-1 rounded-full border 
                                       shrink-0 self-start"
                        style={{
                          borderColor:
                            project.status === "Deployed"
                              ? "#00ff4140"
                              : project.status === "Research"
                              ? "#00d4ff40"
                              : "#ffaa0040",
                          color:
                            project.status === "Deployed"
                              ? "#00ff41"
                              : project.status === "Research"
                              ? "#00d4ff"
                              : "#ffaa00",
                          backgroundColor:
                            project.status === "Deployed"
                              ? "#00ff4110"
                              : project.status === "Research"
                              ? "#00d4ff10"
                              : "#ffaa0010",
                        }}
                      >
                        ● {project.status}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-5">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-3 py-1 rounded-full border 
                                     border-neon-green/20 text-neon-green/80 bg-neon-green/5
                                     group-hover:border-neon-green/40 transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
