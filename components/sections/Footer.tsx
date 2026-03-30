"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neon-green/10 py-10 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="font-mono text-lg font-bold text-neon-green"
              style={{ textShadow: "0 0 15px #00ff4166" }}
            >
              RAHUL_G
            </p>
            <p className="font-mono text-xs text-slate-600 mt-1">
              Engineer · Embedded Systems · AI · IoT
            </p>
          </motion.div>

          {/* Center: copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="font-mono text-xs text-slate-600">
              © {year} Rahul G. Built with{" "}
              <FaHeart className="inline text-neon-green text-[10px] mx-0.5" />{" "}
              using Next.js & Framer Motion.
            </p>
            <p className="font-mono text-xs text-slate-700 mt-1">
              {">"} system.status = ONLINE ●
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <a
              href="https://github.com/rahul2005-tro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-neon-green transition-all hover:scale-110 text-xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-g-840425239/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyber-cyan transition-all hover:scale-110 text-xl"
            >
              <FaLinkedin />
            </a>
          </motion.div>
        </div>

        {/* Neon divider (top) */}
        <div className="neon-line absolute top-0 left-0 right-0 opacity-20" />
      </div>
    </footer>
  );
}
