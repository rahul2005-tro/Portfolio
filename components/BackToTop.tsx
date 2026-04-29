"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full
                     bg-neon-green/10 border border-neon-green/30 backdrop-blur-sm
                     text-neon-green hover:bg-neon-green hover:text-dark-bg
                     transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]
                     flex items-center justify-center"
        >
          <FaChevronUp className="text-sm" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
