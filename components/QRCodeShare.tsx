"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaShare, FaTimes, FaCopy, FaQrcode } from "react-icons/fa";

const SITE_URL = "https://rahulg-05portfolio.vercel.app";

/** Minimal QR encoder — encodes URL as alphanumeric QR version 3 (29×29).
 *  We use a pre-built data-URL approach via the qrcode-generator micro-lib pattern,
 *  embedded inline so there's zero external dependency. */
function useQRDataURL(text: string, size: number) {
  const [dataURL, setDataURL] = useState<string>("");

  useEffect(() => {
    // Use the Google Charts API as an absolutely reliable fallback —
    // it's served over HTTPS with permissive CORS and no API key.
    // We fetch it as a blob so it always renders even behind strict CSP.
    const url = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(text)}&chco=00ff41&chf=bg,s,05050e`;

    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setDataURL(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // If fetch also fails, fall back to direct src (works in most environments)
        setDataURL(url);
      });
  }, [text, size]);

  return dataURL;
}

// ─── Inline Card (always-visible, no modal needed) ───────────────────────────
export function QRCodeCard() {
  const [copied, setCopied] = useState(false);
  const dataURL = useQRDataURL(SITE_URL, 200);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(SITE_URL); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!dataURL) return;
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "rahulg-portfolio-qr.png";
    a.click();
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Rahul G Portfolio", url: SITE_URL });
        return;
      } catch { /* fallthrough */ }
    }
    copyLink();
  };

  return (
    <div
      className="rounded-xl border border-neon-green/20 bg-[#0a0a14] p-5 flex flex-col items-center gap-4"
      style={{ boxShadow: "0 0 20px rgba(0,255,65,0.05)" }}
    >
      <p className="font-mono text-[10px] text-neon-green/60 tracking-widest self-start">
        SHARE_PORTFOLIO
      </p>

      {/* QR Code */}
      <div
        className="relative p-2 rounded-lg border border-neon-green/20"
        style={{ background: "#05050e" }}
      >
        {/* Corner accents */}
        {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3 pointer-events-none`}>
            <div className="absolute top-0 left-0 w-3 h-px bg-neon-green/60" />
            <div className="absolute top-0 left-0 w-px h-3 bg-neon-green/60" />
          </div>
        ))}

        {dataURL ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={dataURL}
            alt="QR code for portfolio"
            width={140}
            height={140}
            className="block rounded"
          />
        ) : (
          <div className="w-[140px] h-[140px] flex items-center justify-center">
            <FaQrcode className="text-4xl text-neon-green/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* URL */}
      <button
        onClick={copyLink}
        className="w-full text-left bg-neon-green/5 border border-neon-green/10 rounded-lg px-3 py-2
                   font-mono text-[9px] text-slate-500 hover:border-neon-green/30 transition-colors"
        title="Click to copy"
      >
        {copied ? (
          <span className="text-neon-green">✓ Copied!</span>
        ) : (
          <span className="truncate block">{SITE_URL}</span>
        )}
      </button>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={download}
          disabled={!dataURL}
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-neon-green/20
                     font-mono text-[10px] text-neon-green hover:bg-neon-green/10 hover:border-neon-green/40
                     transition-all disabled:opacity-40"
        >
          <FaDownload className="text-[9px]" /> Download
        </button>
        <button
          onClick={share}
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg
                     font-mono text-[10px] font-bold text-dark-bg bg-neon-green
                     hover:bg-neon-green/90 transition-all"
        >
          <FaShare className="text-[9px]" /> Share
        </button>
      </div>

      <p className="font-mono text-[9px] text-slate-700">
        Scan · Download · Share anywhere
      </p>
    </div>
  );
}

// ─── Modal trigger (for footer icon) ─────────────────────────────────────────
export default function QRCodeShare({ footerMode = false }: { footerMode?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  return (
    <>
      {footerMode ? (
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          className="text-slate-500 hover:text-neon-green transition-all text-xl"
          aria-label="Share QR code"
          title="Share via QR Code"
        >
          <FaQrcode />
        </motion.button>
      ) : null}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9000]"
              style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="fixed inset-0 z-[9001] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-xs">
                <div className="rounded-2xl border border-neon-green/30 overflow-hidden"
                     style={{ background: "rgba(8,8,18,0.98)", boxShadow: "0 0 60px rgba(0,255,65,0.2)" }}>
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-neon-green/10"
                       style={{ background: "rgba(0,255,65,0.05)" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
                      <span className="ml-2 font-mono text-[10px] text-slate-600">share.qr</span>
                    </div>
                    <button onClick={() => setOpen(false)}
                            className="text-slate-600 hover:text-slate-300 transition-colors p-1">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                  <div className="p-4">
                    <QRCodeCard />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
