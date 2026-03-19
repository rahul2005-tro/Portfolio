"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/* Scroll progress bar at top + section tracker */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 z-[200] h-[2px]"
      aria-hidden
    >
      <div
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, #00ff41, #00d4ff, #9f00ff)",
          boxShadow: "0 0 10px #00ff41aa",
        }}
      />
    </motion.div>
  );
}
