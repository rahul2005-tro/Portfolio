"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaShare, FaTimes, FaCopy, FaQrcode } from "react-icons/fa";

const SITE_URL = "https://rahulg-05portfolio.vercel.app";

// Direct QR image URL — works without Next.js Image (raw <img> tag)
const qrSrc = (size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(SITE_URL)}&bgcolor=05050e&color=00ff41&qzone=2&format=png`;

export default function QRCodeShare({ footerMode = false }: { footerMode?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = SITE_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    // Open directly — most browsers download PNG via anchor
    const a = document.createElement("a");
    a.href = qrSrc(500);
    a.download = "rahulg-portfolio-qr.png";
    a.target = "_blank";
    a.click();
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Rahul G — Engineer Portfolio",
          text: "Check out my portfolio! Embedded Systems · AI · IoT",
          url: SITE_URL,
        });
        return;
      } catch {
        // fallthrough to copy
      }
    }
    copyLink();
  };

  return (
    <>
      {/* ── Trigger button ── */}
      {footerMode ? (
        // Compact icon for footer — matches GitHub/LinkedIn style
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="text-slate-500 hover:text-neon-green transition-all text-xl"
          aria-label="Share QR code"
          title="Share via QR Code"
        >
          <FaQrcode />
        </motion.button>
      ) : (
        // Full-width button for Contact section
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-neon-green/25
                     font-mono text-xs text-neon-green hover:bg-neon-green/8 hover:border-neon-green/50
                     transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] w-full justify-center"
          aria-label="Open QR code share"
        >
          <FaQrcode className="text-sm" />
          Share via QR Code
        </motion.button>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9000]"
              style={{ background: "rgba(5,5,8,0.82)", backdropFilter: "blur(6px)" }}
              onClick={() => setOpen(false)}
            />

            {/* Card */}
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="fixed inset-0 z-[9001] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-xs rounded-2xl border border-neon-green/30 overflow-hidden"
                style={{
                  background: "rgba(8,8,18,0.98)",
                  boxShadow: "0 0 60px rgba(0,255,65,0.18), 0 25px 80px rgba(0,0,0,0.6)",
                }}
              >
                {/* Title bar */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b border-neon-green/10"
                  style={{ background: "rgba(0,255,65,0.05)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
                    <span className="ml-2 font-mono text-[10px] text-slate-600">share.qr · portfolio</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-600 hover:text-slate-300 transition-colors p-1"
                    aria-label="Close"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>

                <div className="p-5 flex flex-col items-center gap-4">
                  {/* Heading */}
                  <div className="text-center">
                    <p className="font-mono text-[10px] text-neon-green/50 tracking-widest mb-1">
                      SCAN TO VISIT PORTFOLIO
                    </p>
                    <p className="font-mono text-base font-bold text-slate-100">
                      Rahul<span className="text-neon-green">G</span>.dev
                    </p>
                  </div>

                  {/* QR image with neon frame */}
                  <div
                    className="relative p-2.5 rounded-xl border border-neon-green/25"
                    style={{
                      background: "rgba(0,255,65,0.03)",
                      boxShadow: "0 0 25px rgba(0,255,65,0.08)",
                    }}
                  >
                    {/* Corner accents */}
                    {(["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"] as const).map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-3 h-3`}>
                        <div className="absolute top-0 left-0 w-3 h-px bg-neon-green/70" />
                        <div className="absolute top-0 left-0 w-px h-3 bg-neon-green/70" />
                      </div>
                    ))}

                    {/* Loading skeleton */}
                    {!imgLoaded && (
                      <div
                        className="w-44 h-44 rounded-lg animate-pulse"
                        style={{ background: "rgba(0,255,65,0.05)" }}
                      />
                    )}

                    {/* The QR code itself — plain <img> avoids Next.js domain restrictions */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrSrc(220)}
                      alt="QR code — scan to visit rahulg-05portfolio.vercel.app"
                      width={176}
                      height={176}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgLoaded(true)}
                      className="block rounded-lg"
                      style={{
                        display: imgLoaded ? "block" : "none",
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>

                  {/* URL pill */}
                  <div className="flex items-center gap-2 w-full bg-neon-green/5 border border-neon-green/15 rounded-lg px-3 py-2">
                    <span className="font-mono text-[9px] text-slate-500 truncate flex-1">{SITE_URL}</span>
                    <button
                      onClick={copyLink}
                      className="shrink-0 text-neon-green/50 hover:text-neon-green transition-colors"
                      title="Copy link"
                    >
                      {copied
                        ? <span className="font-mono text-[10px] text-neon-green font-bold">✓ copied</span>
                        : <FaCopy className="text-xs" />}
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={downloadQR}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border
                                 border-neon-green/25 font-mono text-xs text-neon-green
                                 hover:bg-neon-green/10 hover:border-neon-green/50 transition-all"
                    >
                      <FaDownload className="text-[10px]" /> Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={nativeShare}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg
                                 font-mono text-xs font-bold text-dark-bg bg-neon-green
                                 hover:bg-neon-green/90 transition-all"
                    >
                      <FaShare className="text-[10px]" /> Share
                    </motion.button>
                  </div>

                  <p className="font-mono text-[9px] text-slate-700 text-center">
                    Works with any camera app · iOS & Android
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
