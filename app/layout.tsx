import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CursorGlow from "@/components/CursorGlow";
import CircuitBackground from "@/components/CircuitBackground";
import ScrollProgress from "@/components/ScrollProgress";
import KonamiEaster from "@/components/KonamiEaster";
import FloatingStickers from "@/components/FloatingStickers";

export const metadata: Metadata = {
  title: "Rahul G — Engineer | Embedded Systems | AI | IoT",
  description:
    "Portfolio of Rahul G — Mechanical Engineering student specializing in Embedded Systems, AI, IoT, and Robotics. SIH 2025 National Winner. Building the intersection of hardware and intelligence.",
  keywords: [
    "Rahul G", "Embedded Systems", "IoT", "AI", "Robotics", "Portfolio",
    "ESP32", "Python", "SIH 2025", "Smart India Hackathon", "Freelance",
  ],
  openGraph: {
    title: "Rahul G — Engineer | Embedded Systems | AI | IoT",
    description: "OS-level futuristic portfolio. SIH 2025 National Winner.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-bg text-slate-200 antialiased">
        <ScrollProgress />
        <CircuitBackground />
        <CursorGlow />
        <Navbar />
        <KonamiEaster />
        <FloatingStickers />
        {children}
      </body>
    </html>
  );
}
