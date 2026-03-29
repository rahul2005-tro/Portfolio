"use client";

import { motion } from "framer-motion";

/* Themed floating stickers for blank hero/section areas.
   Each sticker is a mini terminal/badge that subtly floats. */

const STICKERS = [
  /* ─── Left side ─── */
  {
    id: "esp32",
    x: "3%", y: "18%",
    content: ["ESP32", "@ 240MHz"],
    color: "#ff9500",
    delay: 0,
  },
  {
    id: "patent",
    x: "2%", y: "42%",
    content: ["[PATENT]", "VICHARAH ELS"],
    color: "#9f00ff",
    delay: 0.4,
  },
  {
    id: "sih",
    x: "1%", y: "68%",
    content: ["🏆 SIH 2025", "WINNER"],
    color: "#ffd700",
    delay: 0.8,
  },

  /* ─── Right side ─── */
  {
    id: "ai",
    x: "88%", y: "20%",
    content: ["TensorFlow", "v2.14 ✓"],
    color: "#00d4ff",
    delay: 0.2,
  },
  {
    id: "lora",
    x: "89%", y: "44%",
    content: ["LoRa SX1278", "RF ◈"],
    color: "#00ff41",
    delay: 0.6,
  },
  {
    id: "stm",
    x: "87%", y: "70%",
    content: ["STM32 ●", "ONLINE"],
    color: "#ff9500",
    delay: 1.0,
  },

  /* ─── Mid floating chips ─── */
  {
    id: "yolo",
    x: "6%", y: "88%",
    content: ["YOLOv3", "99.2% acc"],
    color: "#9f00ff",
    delay: 0.3,
  },
  {
    id: "firebase",
    x: "86%", y: "88%",
    content: ["Firebase", "LIVE ●"],
    color: "#ff9500",
    delay: 0.7,
  },
];

interface StickerProps {
  content: string[];
  color: string;
  delay: number;
}

function Sticker({ content, color, delay }: StickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: [0, 1, 1, 1],
        scale: [0.7, 1, 1, 1],
        y: [0, -6, 0, -6, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5 },
        y:       { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute pointer-events-none"
      aria-hidden
    >
      <div
        className="rounded-lg px-2.5 py-1.5 font-mono text-[9px] leading-tight backdrop-blur-sm"
        style={{
          border: `1px solid ${color}30`,
          background: `${color}08`,
          color: `${color}bb`,
          boxShadow: `0 0 12px ${color}15`,
          minWidth: "72px",
          textAlign: "center",
        }}
      >
        {content.map((line, i) => (
          <div key={i} className={i === 0 ? "font-bold" : "opacity-70"}>
            {line}
          </div>
        ))}
        {/* pulse dot */}
        <div className="flex justify-center mt-1">
          <motion.div
            className="w-1 h-1 rounded-full"
            style={{ background: color }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: delay }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function FloatingStickers() {
  return (
    <div className="hidden lg:block fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {STICKERS.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{ left: s.x, top: s.y }}
        >
          <Sticker content={s.content} color={s.color} delay={s.delay} />
        </div>
      ))}
    </div>
  );
}
