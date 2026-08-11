"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const fontSize = 14;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = chars.split("");

    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -50)
    );

    let animFrameId: number;
    let frameCount = 0;

    const draw = () => {
      animFrameId = requestAnimationFrame(draw);
      frameCount++;
      // ~20fps throttle: skip 2 out of every 3 frames
      if (frameCount % 3 !== 0) return;

      ctx.fillStyle = "rgba(5, 5, 8, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(0, 255, 65, 0.15)";
      ctx.globalAlpha = 1;

      cols = Math.floor(canvas.width / fontSize);

      for (let i = 0; i < Math.min(drops.length, cols); i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        if (drops[i] > 0) {
          ctx.fillText(char, x, y);
        }
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.25, willChange: "contents" }}
    />
  );
}
