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
export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  // Check sessionStorage: if we already booted this session, skip entirely
  const [shouldShow] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("rahulos_booted");
  });

  const [phase, setPhase] = useState<"rain" | "boot" | "reveal" | "done">(
    shouldShow ? "rain" : "done"
  );
  const [logLines, setLogLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [skipHint, setSkipHint] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const completedRef = useRef(false);

  const heading = useGlitch("RAHUL_G", phase === "boot" || phase === "reveal");

  const doComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rahulos_booted", "1");
    }
    setPhase("done");
    onComplete();
  }, [onComplete]);

  // If already booted this session, fire onComplete immediately
  useEffect(() => {
    if (!shouldShow) {
      doComplete();
    }
  }, [shouldShow, doComplete]);

  // Skip on click or key
  const skipNow = useCallback(() => {
    doComplete();
  }, [doComplete]);

  useEffect(() => {
    if (!shouldShow) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") skipNow(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [skipNow, shouldShow]);

  // Phase sequencing — auto-runs on mount, plays exactly once
  useEffect(() => {
    if (!shouldShow) return;

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
        setTimeout(() => doComplete(), 1000);
      }
    }, 280);

    return () => {
      clearTimeout(h1);
      clearTimeout(t1);
      clearInterval(lineInterval);
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
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-[#04040c] flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
        onClick={skipNow}
      >
        <HexRain />

        {/* Scanline overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Boot content */}
        <div className="relative z-20 w-full max-w-2xl px-6">
          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[10px] text-neon-green/40 tracking-[.3em] mb-2"
          >
            RAHULOS v2.0 — INITIALIZING
          </motion.p>

          {/* Glitch heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-5xl md:text-7xl font-black tracking-wider text-neon-green mb-6"
            style={{
              textShadow:
                "0 0 10px rgba(0,255,65,.6), 0 0 40px rgba(0,255,65,.25)",
            }}
          >
            {heading}
          </motion.h1>

          {/* Boot log */}
          <div className="font-mono text-[11px] text-neon-green/50 space-y-0.5 mb-6 h-44 overflow-hidden">
            {logLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neon-green/10 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-neon-green rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
              style={{ boxShadow: "0 0 12px rgba(0,255,65,.5)" }}
            />
          </div>

          {/* Bottom info line */}
          <div className="flex items-center justify-between font-mono text-[10px] text-neon-green/30">
            <span>{timestamp}</span>
            <span>{progress}% COMPLETE</span>
          </div>
        </div>

        {/* Skip hint */}
        <AnimatePresence>
          {skipHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 font-mono text-[10px] text-neon-green/30 tracking-widest"
            >
              [ CLICK / ENTER / SPACE TO SKIP ]
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
