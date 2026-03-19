"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Real Linux via v86 — full x86 PC emulator in WebAssembly.
  CRITICAL: v86 queries for existing <canvas> and <div> children
  inside screen_container — they MUST be pre-injected in the DOM.
  https://github.com/copy/v86
*/

interface V86Instance {
  add_listener: (event: string, cb: (...args: unknown[]) => void) => void;
  destroy: () => void;
}
interface V86Constructor {
  new(options: Record<string, unknown>): V86Instance;
}
declare global {
  interface Window { V86: V86Constructor; }
}

const V86_JS = "/v86/libv86.js";

const LOCAL = {
  wasm   : "/v86/v86.wasm",
  bios   : "/v86/seabios.bin",
  vgaBios: "/v86/vgabios.bin",
  iso    : "/v86/linux3.iso",
};

export default function LinuxEmulator() {
  const wrapRef  = useRef<HTMLDivElement>(null);   // outer wrapper
  const textRef  = useRef<HTMLDivElement>(null);   // text-mode div (pre-injected)
  const canvasRef= useRef<HTMLCanvasElement>(null);// VGA canvas (pre-injected)
  const emRef    = useRef<V86Instance | null>(null);
  const didInit  = useRef(false);

  const [phase, setPhase] = useState<"loading" | "booting" | "live">("loading");

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const boot = () => {
      setPhase("booting");
      try {
        emRef.current = new window.V86({
          wasm_path       : LOCAL.wasm,
          memory_size     : 128 * 1024 * 1024,
          vga_memory_size : 2   * 1024 * 1024,
          screen_container: wrapRef.current,
          bios            : { url: LOCAL.bios    },
          vga_bios        : { url: LOCAL.vgaBios },
          cdrom           : { url: LOCAL.iso, async: true },
          autostart       : true,
        });
        emRef.current.add_listener("screen-set-mode", () => setPhase("live"));
        // Fallback — show whatever has rendered after 20s
        setTimeout(() => setPhase("live"), 20_000);
      } catch (err) {
        console.error("[v86]", err);
        setPhase("live");
      }
    };

    if (document.getElementById("v86-script")) {
      window.V86 ? boot() : document.getElementById("v86-script")!.addEventListener("load", boot);
      return;
    }
    const s = document.createElement("script");
    s.id = "v86-script";
    s.src = V86_JS;
    s.async = true;
    s.onload = boot;
    s.onerror = () => setPhase("live");
    document.head.appendChild(s);

    return () => {
      try { emRef.current?.destroy(); } catch {}
      emRef.current = null;
      didInit.current = false;
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">

      {/* ── SCREEN AREA ── */}
      <div className="flex-1 relative overflow-auto bg-black">

        {/*
          v86 screen_container:
          v86 queries .querySelector("canvas") and .querySelector("div")
          inside the container — these MUST exist before init().
        */}
        <div
          ref={wrapRef}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "400px",
            position: "relative",
          }}
        >
          {/* Text-mode output div — v86 writes character cells here */}
          <div
            ref={textRef}
            style={{
              whiteSpace    : "pre",
              font          : "14px monospace",
              lineHeight    : "14px",
              color         : "#00ff41",
              background    : "#000",
              width         : "100%",
              minHeight     : "400px",
              padding       : "4px",
              boxSizing      : "border-box",
              overflowY     : "auto",
            }}
          />
          {/* VGA canvas — hidden in text mode, visible in graphics mode */}
          <canvas
            ref={canvasRef}
            style={{
              display  : "none",
              width    : "100%",
              height   : "100%",
              position : "absolute",
              top      : 0,
              left     : 0,
            }}
          />
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {phase !== "live" && (
            <motion.div
              key="overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="font-mono text-4xl font-black text-neon-green mb-4"
                style={{ textShadow: "0 0 30px #00ff41aa" }}
              >
                RAHUL_OS
              </div>
              <p className="font-mono text-[11px] text-slate-500 mb-6 text-center max-w-xs">
                {phase === "loading"
                  ? "Fetching v86 WebAssembly engine…"
                  : "Booting Buildroot Linux x86 · ~15 s"}
              </p>
              <div className="flex gap-1.5">
                {[0,1,2,3,4].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-neon-green"
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <p className="mt-6 font-mono text-[10px] text-slate-800">
                Powered by v86 · copy/v86 on GitHub
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-1.5 bg-[#0a0a14] border-t border-neon-green/10 font-mono text-[10px] text-slate-700">
        <span>v86 · Buildroot Linux x86 · 128 MB RAM</span>
        {phase === "live"
          ? <span className="text-neon-green/50">Click screen → type to interact</span>
          : <span className="animate-pulse text-slate-800">Booting…</span>
        }
      </div>
    </div>
  );
}
