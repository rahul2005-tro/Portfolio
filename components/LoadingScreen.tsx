"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── GLITCH TEXT HOOK ─── */
function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|[]{}";
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((c, i) =>
            i < iter ? c : c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
      iter += 0.4;
      if (iter >= text.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [active, text]);
  return display;
}

/* ─── HEX RAIN CANVAS ─── */
function HexRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const cols = Math.floor(w / 18);
    const drops = Array.from({ length: cols }, () => Math.random() * -h);
    const chars = "0123456789ABCDEF".split("");

    let id: number;
    const draw = () => {
      ctx.fillStyle = "rgba(4,4,12,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = "13px 'JetBrains Mono', monospace";
      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() * 0.6 + 0.1;
        // Brightest at head
        ctx.fillStyle = `rgba(0,255,65,${alpha})`;
        ctx.fillText(char, i * 18, drop);
        if (drop > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 14;
      });
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 z-0 opacity-40" />;
}

/* ─── BOOT LOG LINES ─── */
const BOOT_LOG = [
  "[ BIOS ]  Firmware v2.0 — Rahul Engineering Systems",
  "[ INIT ]  CPU: Embedded-AI-Core @ 4.2GHz",
  "[ MEM  ]  RAM: 32GB DDR5 — OK",
  "[ DISK ]  NVMe 0: Projects_v2 — MOUNTED",
  "[ NET  ]  Connecting to github.com/rahul2005-tro — OK",
  "[ AI   ]  Loading TensorFlow 2.14 inference engine...",
  "[ IOT  ]  ESP32 · STM32 · LoRa drivers — ONLINE",
  "[ SYS  ]  All subsystems nominal. Booting Shell...",
  "[ AUTH ]  Identity: RAHUL G — VERIFIED ✓",
];

/* ─── MAIN LOADING SCREEN ─── */
// Module-level guard: NEVER reset. Prevents StrictMode double-fire
// and ensures the boot sequence runs exactly once per full page load.
let _bootFired = false;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"rain" | "boot" | "reveal" | "done">("rain");
  const [logLines, setLogLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [skipHint, setSkipHint] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  const heading = useGlitch("RAHUL_G", phase === "boot" || phase === "reveal");

  // Skip on click or key — go straight to done and notify parent
  const skipNow = useCallback(() => {
    setPhase("done");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") skipNow(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [skipNow]);

  // Phase sequencing — _bootFired prevents StrictMode double-fire
  useEffect(() => {
    if (_bootFired) return;
    _bootFired = true;

    setTimestamp(new Date().toISOString().slice(0, 19).replace("T", " "));

    const h1 = setTimeout(() => setSkipHint(true), 1000);
    const t1 = setTimeout(() => setPhase("boot"), 1200);

    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      if (lineIdx < BOOT_LOG.length) {
        setLogLines((p) => [...p, BOOT_LOG[lineIdx]]);
        setProgress(Math.round(((lineIdx + 1) / BOOT_LOG.length) * 100));
        lineIdx++;
      } else {
        clearInterval(lineInterval);
        setTimeout(() => setPhase("reveal"), 400);
        setTimeout(() => { setPhase("done"); onComplete(); }, 1000);
      }
    }, 280);

    return () => {
      clearTimeout(h1);
      clearTimeout(t1);
      clearInterval(lineInterval);
      // Do NOT reset _bootFired here — that's what caused the double load
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;


  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={phase === "reveal" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={skipNow}
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
        style={{ background: "#04040c" }}
      >
        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          }}
        />

        {/* CRT vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Hex rain background */}
        <HexRain />

        {/* Center Content */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-2xl px-8">

          {/* Giant glitch heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-mono font-black mb-2 tracking-[0.15em] text-center relative"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 9rem)",
              color: "#00ff41",
              textShadow:
                phase === "reveal"
                  ? "0 0 80px #00ff41, 0 0 160px #00ff41bb"
                  : "0 0 40px #00ff41aa, 0 0 80px #00ff4155",
            }}
          >
            {heading}
            {/* Glitch layers */}
            {(phase === "boot" || phase === "reveal") && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 font-mono font-black text-center"
                  style={{
                    color: "#ff004f",
                    clipPath: "inset(30% 0 60% 0)",
                    transform: `translateX(${Math.random() > 0.5 ? -4 : 4}px)`,
                    opacity: 0.5,
                    animation: "glitch-r 0.12s infinite alternate",
                  }}
                >
                  {heading}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 font-mono font-black text-center"
                  style={{
                    color: "#00d4ff",
                    clipPath: "inset(60% 0 10% 0)",
                    transform: `translateX(${Math.random() > 0.5 ? 3 : -3}px)`,
                    opacity: 0.5,
                    animation: "glitch-b 0.18s infinite alternate",
                  }}
                >
                  {heading}
                </span>
              </>
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-mono text-xs text-slate-600 tracking-[0.4em] mb-10 text-center"
          >
            EMBEDDED_SYSTEMS · AI · IOT · ROBOTICS
          </motion.p>

          {/* Boot Log */}
          <AnimatePresence>
            {phase !== "rain" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full rounded-lg border border-neon-green/15 bg-black/60 backdrop-blur-sm p-4 mb-6 font-mono text-[11px] space-y-1 min-h-[200px]"
              >
                {logLines.filter(Boolean).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={
                      line?.includes("✓") || line?.includes("OK")
                        ? "text-neon-green"
                        : line?.includes("BIOS") || line?.includes("AUTH")
                        ? "text-neon-gold"
                        : "text-slate-500"
                    }
                  >
                    {line}
                  </motion.div>
                ))}
                {logLines.length < BOOT_LOG.length && (
                  <span className="text-neon-green animate-pulse">▋</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence>
            {phase !== "rain" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full mb-3"
              >
                <div className="flex justify-between font-mono text-[10px] text-slate-600 mb-1.5">
                  <span>SYSTEM BOOT</span>
                  <span className="text-neon-green">{progress}%</span>
                </div>
                <div className="w-full h-0.5 bg-neon-green/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #00ff41, #00d4ff)",
                      boxShadow: "0 0 10px #00ff41aa",
                      transition: "width 0.28s ease",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status line */}
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            RAHULOS v2.0 — INITIALIZING
            {skipHint && (
              <span className="ml-4 text-slate-700 border border-slate-800 px-2 py-0.5 rounded">
                CLICK or ENTER to skip
              </span>
            )}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-5 font-mono text-[10px] text-neon-green/20 z-20">
          SYS://BOOT/RAHULOS_v2.0
        </div>
        <div className="absolute top-4 right-5 font-mono text-[10px] text-neon-green/20 z-20 tabular-nums">
          {timestamp}
        </div>
        <div className="absolute bottom-4 left-5 font-mono text-[10px] text-slate-800 z-20">
          KERNEL: AI-EMBEDDED-4.19 · ARCH: x86_64
        </div>
        <div className="absolute bottom-4 right-5 font-mono text-[10px] text-slate-800 z-20">
          MEM: 1337MB / 4096MB
        </div>
      </motion.div>

      {/* Glitch keyframes */}
      <style>{`
        @keyframes glitch-r {
          0%   { transform: translateX(-4px) skewX(-1deg); }
          100% { transform: translateX(4px) skewX(1deg); }
        }
        @keyframes glitch-b {
          0%   { transform: translateX(3px) skewX(1deg); }
          100% { transform: translateX(-3px) skewX(-1deg); }
        }
      `}</style>
    </AnimatePresence>
  );
}
