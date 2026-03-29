"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaChevronDown, FaRocket } from "react-icons/fa";
import MatrixRain from "@/components/MatrixRain";

const TERMINAL_STEPS = [
  "> Initializing RahulOS v2.0...",
  "> Loading Modules: [AI] [IoT] [Embedded] [Robotics]",
  "> Mounting Dev Environment...",
  "> ✓ Access Granted. Welcome, Engineer.",
];

interface HeroProps {
  onLaunchOS: () => void;
}

export default function Hero({ onLaunchOS }: HeroProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < TERMINAL_STEPS.length) {
        setTerminalLines((prev) => [...prev, TERMINAL_STEPS[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowMain(true), 400);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 overflow-hidden">
      <MatrixRain />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,255,65,0.04),transparent)] pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
        {/* Terminal Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-lg p-4 mb-10 mx-auto max-w-xl text-left border border-neon-green/20"
        >
          <div className="flex items-center gap-2 mb-3 border-b border-neon-green/10 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
            <span className="font-mono text-xs text-slate-500 ml-2">rahul_g@RahulOS:~$</span>
          </div>
          <div className="space-y-1 min-h-[80px]">
            {terminalLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`font-mono text-xs ${
                  line && line.includes("✓") ? "text-neon-green font-bold" : "text-slate-400"
                }`}
              >
                {line}
              </motion.p>
            ))}
            {!showMain && (
              <span className="font-mono text-xs text-neon-green terminal-cursor"> </span>
            )}
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showMain ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-mono text-3xl sm:text-5xl md:text-8xl font-black mb-4 tracking-tight">
            <span className="text-slate-100">RAHUL</span>{" "}
            <span
              className="text-neon-green"
              style={{ textShadow: "0 0 30px #00ff41aa, 0 0 60px #00ff4155, 0 0 100px #00ff4122" }}
            >
              G
            </span>
          </h1>

          <div className="font-mono text-sm sm:text-lg md:text-2xl text-cyber-cyan mb-6 tracking-widest min-h-[2rem]">
            <TypeAnimation
              sequence={[
                "Engineer · Embedded Systems",
                1800,
                "AI · Machine Learning",
                1800,
                "IoT · Wireless Systems",
                1800,
                "Robotics · Control Systems",
                1800,
                "Engineer · Embedded Systems · AI · IoT Innovator",
                4000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ display: "inline-block" }}
            />
          </div>

          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Building the intersection of hardware and intelligence.{" "}
            <span className="text-neon-green/70">Real-world solutions</span> through elegant, efficient systems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 sm:px-8 py-3 font-mono font-bold text-sm sm:text-base text-neon-green border border-neon-green rounded-lg
                         hover:bg-neon-green hover:text-dark-bg transition-all duration-300 tracking-widest
                         hover:shadow-[0_0_30px_#00ff4166]"
            >
              {">"} View Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchOS}
              className="px-6 sm:px-8 py-3 font-mono font-bold text-sm sm:text-base text-neon-amber border border-neon-amber/60 rounded-lg
                         hover:bg-neon-amber hover:text-dark-bg transition-all duration-300 tracking-widest
                         hover:shadow-[0_0_30px_#ff950066] flex items-center gap-2 justify-center"
            >
              <FaRocket className="text-sm" /> Launch Dev Environment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 sm:px-8 py-3 font-mono font-bold text-sm sm:text-base text-cyber-cyan border border-cyber-cyan/60 rounded-lg
                         hover:bg-cyber-cyan hover:text-dark-bg transition-all duration-300 tracking-widest
                         hover:shadow-[0_0_30px_#00d4ff66]"
            >
              {">"} Contact Me
            </motion.button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-16">
            <a href="https://github.com/rahul2005-tro" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-neon-green text-2xl transition-all hover:scale-110">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/rahul-g-840425239/" target="_blank" rel="noopener noreferrer"
              className="text-slate-500 hover:text-cyber-cyan text-2xl transition-all hover:scale-110">
              <FaLinkedin />
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-neon-green/50 hover:text-neon-green transition-colors text-xl"
        >
          <FaChevronDown />
        </motion.button>
      </div>
    </section>
  );
}
