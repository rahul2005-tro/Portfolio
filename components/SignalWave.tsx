"use client";

import { motion } from "framer-motion";

interface SignalWaveProps {
  color?: string;
  className?: string;
}

export default function SignalWave({ color = "#00ff41", className = "" }: SignalWaveProps) {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 500;
    const y = 50 + Math.sin((i / 39) * Math.PI * 4) * 30;
    return `${x},${y}`;
  }).join(" ");

  const filterId = `glow-${color.replace("#", "")}`;

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: "40px" }}>
      <svg
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base wave — static */}
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity={0.12}
          vectorEffect="non-scaling-stroke"
        />

        {/* Pulsing glow wave */}
        <motion.polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${filterId})`}
          animate={{ opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
