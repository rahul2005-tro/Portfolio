"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function KonamiEaster() {
  const [seq, setSeq] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSeq((prev) => {
        const next = [...prev, e.key].slice(-10);
        if (JSON.stringify(next) === JSON.stringify(KONAMI)) {
          setActive(true);
          setTimeout(() => setActive(false), 6000);
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
        >
          <div className="relative text-center">
            {/* Matrix rain overlay effect */}
            <div className="absolute inset-0 bg-dark-bg/80 rounded-2xl -m-8 backdrop-blur-sm" />
            <div className="relative z-10 p-12">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <div
                className="font-mono text-3xl font-black text-neon-green mb-3"
                style={{ textShadow: "0 0 40px #00ff41, 0 0 80px #00ff4155" }}
              >
                CHEAT CODE UNLOCKED!
              </div>
              <div className="font-mono text-sm text-cyber-cyan mb-2">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </div>
              <div className="font-mono text-xs text-slate-500 mb-6">
                You found the secret! SIH 2025 National Winner 🚀
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono text-slate-400">
                {["15+ Projects", "25+ Technologies", "7+ Achievements", "National Winner", "Patent Holder", "AI · IoT · Embedded"].map((s) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    className="border border-neon-green/20 px-3 py-1.5 rounded text-neon-green/70"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
