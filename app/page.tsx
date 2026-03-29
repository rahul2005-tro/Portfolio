"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollReveal from "@/components/ScrollReveal";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import ProjectWindows from "@/components/sections/ProjectWindows";
import Deployments from "@/components/sections/Deployments";
import Achievements from "@/components/sections/Achievements";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import TerminalWidget from "@/components/TerminalWidget";
import RahulOSModal from "@/components/RahulOSModal";
import SignalWave from "@/components/SignalWave";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [osOpen, setOsOpen] = useState(false);

  /* Listen for custom event from terminal / navbar */
  useEffect(() => {
    const handler = () => setOsOpen(true);
    window.addEventListener("launch-dev-env", handler);
    return () => window.removeEventListener("launch-dev-env", handler);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <main
        className="relative z-10"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <Hero onLaunchOS={() => setOsOpen(true)} />

        <SignalWave color="#00ff41" className="opacity-50" />
        <ScrollReveal direction="up">
          <About />
        </ScrollReveal>

        <SignalWave color="#00d4ff" className="opacity-40" />
        <ScrollReveal direction="up" delay={0.1}>
          <Skills />
        </ScrollReveal>

        <SignalWave color="#ff9500" className="opacity-40" />
        <ScrollReveal direction="left">
          <ProjectWindows />
        </ScrollReveal>

        <SignalWave color="#00d4ff" className="opacity-35" />
        <ScrollReveal direction="up">
          <Deployments />
        </ScrollReveal>

        <SignalWave color="#9f00ff" className="opacity-35" />
        <ScrollReveal direction="right">
          <Achievements />
        </ScrollReveal>

        <SignalWave color="#00d4ff" className="opacity-30" />
        <ScrollReveal direction="up" delay={0.1}>
          <Experience />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <Contact />
        </ScrollReveal>

        <Footer />

        <TerminalWidget />
        <RahulOSModal open={osOpen} onClose={() => setOsOpen(false)} />
      </main>
    </>
  );
}
