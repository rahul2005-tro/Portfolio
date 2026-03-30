"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from "react-icons/fa";
import { GitHubRepo } from "@/types";

const langColors: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export default function Projects() {
  const [repos, setRepos] = useState<(GitHubRepo & { techStack: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error();
        setRepos(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-tag mb-3">[ 03 ]</p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-neon-green/50">// </span>Projects
            <span className="text-neon-green">_</span>.git
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-3">
            Live from github/rahul2005-tro
          </p>
          <div className="neon-line w-24 mx-auto mt-4 opacity-50" />
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="font-mono text-neon-green animate-pulse text-sm">
              {">"} Fetching repositories from GitHub API...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="font-mono text-red-400 text-sm">
              {">"} Failed to fetch repositories. Check connection.
            </p>
          </div>
        )}

        {/* Repo Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-xl p-6 border border-neon-green/10 hover:border-neon-green/40 
                           flex flex-col gap-4 group transition-all duration-300
                           hover:shadow-[0_0_30px_rgba(0,255,65,0.1)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-neon-green/60 mb-1">~/repos/</p>
                    <h3 className="font-mono font-bold text-slate-100 group-hover:text-neon-green transition-colors truncate text-sm">
                      {repo.name}
                    </h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyber-cyan transition-colors text-sm"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-neon-green transition-colors text-base"
                    >
                      <FaGithub />
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed flex-1">
                  {repo.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {repo.techStack?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2 py-0.5 rounded border border-electric-blue/20 text-electric-blue/80 bg-electric-blue/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: langColors[repo.language] || "#aaaaaa" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <FaStar className="text-neon-amber/70" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <FaCodeBranch />
                    {repo.forks_count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
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
