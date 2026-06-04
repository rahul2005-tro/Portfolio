import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CursorGlow from "@/components/CursorGlow";
import CircuitBackground from "@/components/CircuitBackground";
import ScrollProgress from "@/components/ScrollProgress";
import KonamiEaster from "@/components/KonamiEaster";
import FloatingStickers from "@/components/FloatingStickers";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import VisitTracker from "@/components/VisitTracker";

const siteUrl = "https://rahulg-05portfolio.vercel.app";

export const metadata: Metadata = {
  title: "Rahul G — Engineer | Embedded Systems | AI | IoT",
  description:
    "Portfolio of Rahul G — Mechanical Engineering student specializing in Embedded Systems, AI, IoT, and Robotics. SIH 2025 National Winner. Building the intersection of hardware and intelligence.",
  keywords: [
    "Rahul G", "Embedded Systems", "IoT", "AI", "Robotics", "Portfolio",
    "ESP32", "Python", "SIH 2025", "Smart India Hackathon", "Freelance",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Rahul G — Engineer | Embedded Systems | AI | IoT",
    description: "OS-level futuristic portfolio. SIH 2025 National Winner. Building the intersection of hardware and intelligence.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rahul G — Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul G — Engineer | Embedded Systems | AI | IoT",
    description: "OS-level futuristic portfolio. SIH 2025 National Winner.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    other: {
      "vc-domain-verify": ["rahul-portfolio-vercel.app,8ec0cd39de4d85ffcb4f"],
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#050508" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-bg text-slate-200 antialiased">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rahul G",
              url: siteUrl,
              jobTitle: "Engineer — Embedded Systems, AI & IoT",
              description: "Mechanical Engineering student specializing in Embedded Systems, AI, IoT, and Robotics. SIH 2025 National Winner.",
              sameAs: [
                "https://github.com/rahul2005-tro",
                "https://www.linkedin.com/in/rahul-g-840425239/",
              ],
              knowsAbout: ["Embedded Systems", "IoT", "AI", "Machine Learning", "Robotics", "ESP32", "Python"],
            }),
          }}
        />
        {/* Skip to main content — accessibility */}
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-neon-green focus:text-dark-bg focus:px-4 focus:py-2 focus:rounded-lg focus:font-mono focus:text-sm"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <CircuitBackground />
        <CursorGlow />
        <Navbar />
        <KonamiEaster />
        <FloatingStickers />
        <BackToTop />
        <VisitTracker />
        {children}
        {/* Vercel Analytics — tracks all page views automatically */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
