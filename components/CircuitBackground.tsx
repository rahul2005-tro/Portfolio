"use client";

import { useEffect, useRef } from "react";

// SVG-based PCB trace background with animated signal dots
export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    // Generate PCB trace paths
    const gridSize = 60;
    type Dot = { x: number; y: number; progress: number; speed: number; path: number[][] };
    const dots: Dot[] = [];

    // Create horizontal and vertical trace paths
    const hTraces: number[] = [];
    const vTraces: number[] = [];
    for (let y = gridSize; y < h; y += gridSize * 2) hTraces.push(y);
    for (let x = gridSize; x < w; x += gridSize * 2) vTraces.push(x);

    // Create moving signal dots
    for (let i = 0; i < 18; i++) {
      const isH = Math.random() > 0.5;
      if (isH && hTraces.length) {
        const y = hTraces[Math.floor(Math.random() * hTraces.length)];
        dots.push({
          x: 0, y,
          progress: Math.random(),
          speed: 0.0008 + Math.random() * 0.0012,
          path: [[0, y], [w, y]],
        });
      } else if (vTraces.length) {
        const x = vTraces[Math.floor(Math.random() * vTraces.length)];
        dots.push({
          x, y: 0,
          progress: Math.random(),
          speed: 0.0008 + Math.random() * 0.0012,
          path: [[x, 0], [x, h]],
        });
      }
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw PCB grid lines
      ctx.strokeStyle = "rgba(0, 255, 65, 0.04)";
      ctx.lineWidth = 1;

      hTraces.forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        // Draw pads at corners
        for (let x = gridSize; x < w; x += gridSize * 2) {
          ctx.fillStyle = "rgba(0, 255, 65, 0.06)";
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      vTraces.forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        // Draw pads at corners
        for (let y = gridSize; y < h; y += gridSize * 2) {
          ctx.fillStyle = "rgba(0, 255, 65, 0.06)";
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Animate signal dots
      dots.forEach((dot) => {
        dot.progress += dot.speed;
        if (dot.progress > 1) dot.progress = 0;

        const [start, end] = dot.path;
        const cx = start[0] + (end[0] - start[0]) * dot.progress;
        const cy = start[1] + (end[1] - start[1]) * dot.progress;

        // Glow dot
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
        grad.addColorStop(0, "rgba(0, 255, 65, 0.8)");
        grad.addColorStop(0.4, "rgba(0, 255, 65, 0.3)");
        grad.addColorStop(1, "rgba(0, 255, 65, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        const trailLen = 0.05;
        const trailStart = Math.max(0, dot.progress - trailLen);
        const tx0 = start[0] + (end[0] - start[0]) * trailStart;
        const ty0 = start[1] + (end[1] - start[1]) * trailStart;
        const tGrad = ctx.createLinearGradient(tx0, ty0, cx, cy);
        tGrad.addColorStop(0, "rgba(0, 255, 65, 0)");
        tGrad.addColorStop(1, "rgba(0, 255, 65, 0.4)");
        ctx.strokeStyle = tGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
