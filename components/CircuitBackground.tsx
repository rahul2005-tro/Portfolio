"use client";

import { useEffect, useRef } from "react";

// SVG-based PCB trace background with animated signal dots
// PERF: static grid is pre-drawn once to an offscreen canvas and blitted each frame
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

    // ── Offscreen canvas for static grid (drawn once, blitted every frame) ──
    let offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;

    const gridSize = 60;
    type Dot = { x: number; y: number; progress: number; speed: number; path: number[][] };
    let dots: Dot[] = [];

    function buildGrid() {
      const oc = offscreen.getContext("2d")!;
      oc.clearRect(0, 0, w, h);

      const hTraces: number[] = [];
      const vTraces: number[] = [];
      for (let y = gridSize; y < h; y += gridSize * 2) hTraces.push(y);
      for (let x = gridSize; x < w; x += gridSize * 2) vTraces.push(x);

      oc.strokeStyle = "rgba(0, 255, 65, 0.04)";
      oc.lineWidth = 1;
      oc.fillStyle = "rgba(0, 255, 65, 0.06)";

      hTraces.forEach((y) => {
        oc.beginPath();
        oc.moveTo(0, y);
        oc.lineTo(w, y);
        oc.stroke();
        for (let x = gridSize; x < w; x += gridSize * 2) {
          oc.beginPath();
          oc.arc(x, y, 2, 0, Math.PI * 2);
          oc.fill();
        }
      });

      vTraces.forEach((x) => {
        oc.beginPath();
        oc.moveTo(x, 0);
        oc.lineTo(x, h);
        oc.stroke();
        for (let y = gridSize; y < h; y += gridSize * 2) {
          oc.beginPath();
          oc.arc(x, y, 2, 0, Math.PI * 2);
          oc.fill();
        }
      });

      // Build dots
      dots = [];
      for (let i = 0; i < 12; i++) {
        const isH = Math.random() > 0.5;
        if (isH && hTraces.length) {
          const y = hTraces[Math.floor(Math.random() * hTraces.length)];
          dots.push({ x: 0, y, progress: Math.random(), speed: 0.0006 + Math.random() * 0.001, path: [[0, y], [w, y]] });
        } else if (vTraces.length) {
          const x = vTraces[Math.floor(Math.random() * vTraces.length)];
          dots.push({ x, y: 0, progress: Math.random(), speed: 0.0006 + Math.random() * 0.001, path: [[x, 0], [x, h]] });
        }
      }

      return hTraces;
    }

    buildGrid();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      offscreen.width = w;
      offscreen.height = h;
      buildGrid();
    };
    window.addEventListener("resize", resize);

    let animId: number;
    let frameCount = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frameCount++;
      // Run at ~30fps (skip every other frame) to halve GPU load
      if (frameCount % 2 !== 0) return;

      // Blit the pre-drawn static grid
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(offscreen, 0, 0);

      // Animate signal dots
      dots.forEach((dot) => {
        dot.progress += dot.speed;
        if (dot.progress > 1) dot.progress = 0;

        const [start, end] = dot.path;
        const cx = start[0] + (end[0] - start[0]) * dot.progress;
        const cy = start[1] + (end[1] - start[1]) * dot.progress;

        // Glow dot — use solid fill for inner, skip radial gradient for perf
        ctx.fillStyle = "rgba(0, 255, 65, 0.7)";
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Soft outer glow (single cheaper circle)
        ctx.fillStyle = "rgba(0, 255, 65, 0.15)";
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        const trailLen = 0.04;
        const trailStart = Math.max(0, dot.progress - trailLen);
        const tx0 = start[0] + (end[0] - start[0]) * trailStart;
        const ty0 = start[1] + (end[1] - start[1]) * trailStart;
        ctx.strokeStyle = "rgba(0, 255, 65, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });
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
