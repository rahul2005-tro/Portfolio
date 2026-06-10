"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQrcode, FaDownload, FaShare, FaTimes, FaCopy } from "react-icons/fa";

const SITE_URL = "https://rahulg-05portfolio.vercel.app";

// QR generated via api.qrserver.com — free, no API key needed
const QR_API = (size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(SITE_URL)}&bgcolor=050508&color=00ff41&qzone=1&format=png`;

export default function QRCodeShare() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = async () => {
    try {
      const res = await fetch(QR_API(400));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rahulg-portfolio-qr.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab
      window.open(QR_API(400), "_blank");
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Rahul G — Engineer Portfolio",
        text: "Check out my portfolio! Embedded Systems · AI · IoT",
        url: SITE_URL,
      });
    } else {
      copyLink();
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-neon-green/25
                   font-mono text-xs text-neon-green hover:bg-neon-green/8 hover:border-neon-green/50
                   transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] w-full justify-center"
      >
        <FaQrcode className="text-sm" />
        Share via QR Code
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-2xl border border-neon-green/25 overflow-hidden"
              style={{
                background: "rgba(8,8,14,0.98)",
                boxShadow: "0 0 60px rgba(0,255,65,0.15), 0 0 120px rgba(0,255,65,0.05)",
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-neon-green/10"
                   style={{ background: "rgba(0,255,65,0.04)" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
                  <span className="ml-2 font-mono text-[10px] text-slate-500">share.qr</span>
                </div>
                <button onClick={() => setOpen(false)}
                        className="text-slate-600 hover:text-slate-300 transition-colors">
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center gap-5">
                {/* Heading */}
                <div className="text-center">
                  <p className="font-mono text-[10px] text-neon-green/60 tracking-widest mb-1">[ SCAN TO VISIT ]</p>
                  <h3 className="font-mono text-lg font-bold text-slate-100">
                    Rahul<span className="text-neon-green">_</span>G Portfolio
                  </h3>
                </div>

                {/* QR Code */}
                <div className="relative p-3 rounded-xl border border-neon-green/20"
                     style={{ background: "rgba(0,255,65,0.03)", boxShadow: "0 0 30px rgba(0,255,65,0.08)" }}>
                  {/* Corner accents */}
                  {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-4 h-4`}>
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-neon-green/60" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-neon-green/60" />
                    </div>
                  ))}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={QR_API(200)}
                    alt="QR code for Rahul G Portfolio"
                    width={200}
                    height={200}
                    className="block rounded-lg"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>

                {/* URL pill */}
                <div className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/15 rounded-lg px-3 py-2 w-full">
                  <span className="font-mono text-[10px] text-slate-400 truncate flex-1">{SITE_URL}</span>
                  <button onClick={copyLink}
                          className="shrink-0 text-neon-green/60 hover:text-neon-green transition-colors"
                          title="Copy link">
                    {copied ? <span className="font-mono text-[10px] text-neon-green">✓</span> : <FaCopy className="text-xs" />}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neon-green/25
                               font-mono text-xs text-neon-green hover:bg-neon-green/10 hover:border-neon-green/50
                               transition-all duration-200"
                  >
                    <FaDownload className="text-xs" /> Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={nativeShare}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg
                               font-mono text-xs text-dark-bg bg-neon-green hover:bg-neon-green/90
                               transition-all duration-200 font-bold"
                  >
                    <FaShare className="text-xs" /> Share
                  </motion.button>
                </div>

                <p className="font-mono text-[10px] text-slate-600 text-center">
                  Scan with any camera app · Works on iOS & Android
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
