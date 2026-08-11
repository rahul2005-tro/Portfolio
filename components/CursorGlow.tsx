"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;
    let scheduled = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Move the dot immediately via transform (compositor-only, no layout)
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      scheduled = false;
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      // Skip update if movement is negligible
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) return;
      ringX += dx * 0.12;
      ringY += dy * 0.12;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      scheduled = true;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Use event delegation on body instead of attaching to every link/button
    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, [data-cursor]")) return;
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.borderColor = "rgba(0, 255, 65, 0.8)";
      dot.style.scale = "1.8";
    };
    const onLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, [data-cursor]")) return;
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "rgba(0, 255, 65, 0.5)";
      dot.style.scale = "1";
    };

    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Use transform instead of left/top to avoid layout reflow */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ left: 0, top: 0, transition: "scale 0.1s ease" }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ left: 0, top: 0 }}
      />
    </>
  );
}
