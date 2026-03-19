"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
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
        <About />
        <SignalWave color="#00d4ff" className="opacity-40" />
        <Skills />
        <SignalWave color="#ff9500" className="opacity-40" />
        <ProjectWindows />
        <SignalWave color="#00d4ff" className="opacity-35" />
        <Deployments />
        <SignalWave color="#9f00ff" className="opacity-35" />
        <Achievements />
        <SignalWave color="#00d4ff" className="opacity-30" />
        <Experience />
        <Contact />
        <Footer />

        <TerminalWidget />
        <RahulOSModal open={osOpen} onClose={() => setOsOpen(false)} />
      </main>
    </>
  );
}
