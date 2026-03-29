"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaRocket } from "react-icons/fa";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Deployed", href: "#deployments" },
  { label: "Achievements", href: "#achievements" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setActiveSection(href);
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-neon-green/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-xl font-bold text-neon-green text-glow-green tracking-widest hover:opacity-80 transition-opacity"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-slate-500">{">"}</span> RAHUL_G
          <span className="terminal-cursor text-neon-green text-sm"> </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`font-mono text-sm tracking-wider transition-all duration-200 relative group ${
                activeSection === link.href
                  ? "text-neon-green"
                  : "text-slate-400 hover:text-neon-green"
              }`}
            >
              <span className="text-neon-green/40 mr-1">./</span>
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-green group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Dev Env + Social Icons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("launch-dev-env"));
            }}
            className="font-mono text-xs tracking-wider text-amber-400 border border-amber-400/40 px-3 py-1.5 rounded-lg
                       hover:bg-amber-400 hover:text-dark-bg transition-all duration-300
                       hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] flex items-center gap-1.5"
          >
            <FaRocket className="text-[10px]" /> Dev Env
          </button>
          <a
            href="https://github.com/rahul2005-tro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-neon-green transition-colors text-xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/rahul-g-840425239/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyber-cyan transition-colors text-xl"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 bg-neon-green transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-neon-green transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-neon-green transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-neon-green/10"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-mono text-sm text-left text-slate-300 hover:text-neon-green transition-colors py-2 border-b border-white/5"
                >
                  <span className="text-neon-green mr-2">$</span>
                  {link.label}
                </button>
              ))}
              <div className="flex gap-4 pt-2 items-center">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("launch-dev-env"));
                  }}
                  className="font-mono text-xs text-amber-400 border border-amber-400/40 px-3 py-1.5 rounded-lg
                             hover:bg-amber-400 hover:text-dark-bg transition-all flex items-center gap-1.5"
                >
                  <FaRocket className="text-[10px]" /> Dev Env
                </button>
                <a href="https://github.com/rahul2005-tro" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-neon-green text-xl"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/rahul-g-840425239/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-cyan text-xl"><FaLinkedin /></a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
