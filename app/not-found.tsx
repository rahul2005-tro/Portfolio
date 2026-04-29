"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Glitch title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="font-mono text-8xl md:text-9xl font-black text-neon-green mb-4"
          style={{ textShadow: "0 0 40px #00ff41aa, 0 0 80px #00ff4133" }}
        >
          404
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md"
      >
        {/* Terminal-style error */}
        <div className="glass rounded-lg p-6 border border-neon-green/20 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3 border-b border-neon-green/10 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
            <span className="font-mono text-xs text-slate-500 ml-2">
              error@NexusOS:~$
            </span>
          </div>
          <p className="font-mono text-xs text-red-400 mb-1">
            {">"} ERROR: Page not found
          </p>
          <p className="font-mono text-xs text-slate-500 mb-1">
            {">"} The requested route does not exist in this filesystem.
          </p>
          <p className="font-mono text-xs text-neon-green">
            {">"} Redirecting to home directory...
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 font-mono font-bold text-sm text-neon-green border border-neon-green rounded-lg
                     hover:bg-neon-green hover:text-dark-bg transition-all duration-300 tracking-widest
                     hover:shadow-[0_0_30px_#00ff4166]"
        >
          {">"} Return Home
        </Link>
      </motion.div>
    </main>
  );
}
