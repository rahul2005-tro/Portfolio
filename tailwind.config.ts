/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#00ff41",
        "cyber-cyan": "#00d4ff",
        "electric-blue": "#0080ff",
        "dark-bg": "#050508",
        "card-bg": "#0c0c14",
        "border-glow": "#00ff4133",
        "neon-purple": "#9f00ff",
        "neon-amber": "#ff9500",
        "neon-gold": "#ffd700",
        "pcb-green": "#003310",
        "hw-accent": "#ff6b00",
        "sw-accent": "#00d4ff",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-green": "0 0 20px #00ff4166, 0 0 40px #00ff4133",
        "neon-cyan": "0 0 20px #00d4ff66, 0 0 40px #00d4ff33",
        "neon-blue": "0 0 20px #0080ff66, 0 0 40px #0080ff33",
        "neon-amber": "0 0 20px #ff950066, 0 0 40px #ff950033",
        "neon-gold": "0 0 30px #ffd70088, 0 0 60px #ffd70044",
        "card-hover": "0 0 30px #00ff4122, inset 0 0 30px #00ff410a",
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #00ff41, #00d4ff)",
        "gradient-cyber": "linear-gradient(135deg, #0c0c14 0%, #050508 100%)",
        "pcb-pattern":
          "repeating-linear-gradient(0deg, transparent, transparent 39px, #00ff410a 39px, #00ff410a 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #00ff410a 39px, #00ff410a 40px)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "signal-travel": "signal-travel 3s linear infinite",
        "waveform": "waveform 2s ease-in-out infinite",
        "scan-h": "scan-h 4s linear infinite",
        scanline: "scanline 8s linear infinite",
        "border-rotate": "border-rotate 4s linear infinite",
        "terminal-blink": "terminal-blink 1s step-end infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "signal-travel": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(200%)", opacity: "0" },
        },
        "waveform": {
          "0%, 100%": { d: "path('M0,20 Q25,0 50,20 Q75,40 100,20')" },
          "50%": { d: "path('M0,20 Q25,40 50,20 Q75,0 100,20')" },
        },
        "scan-h": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        scanline: {
          "0%": { top: "-2px" },
          "100%": { top: "100vh" },
        },
        "border-rotate": {
          "0%": { "--angle": "0deg" } as Record<string, string>,
          "100%": { "--angle": "360deg" } as Record<string, string>,
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
