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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    animate();

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "rgba(0, 255, 65, 0.8)";
        dot.style.transform = "translate(-50%, -50%) scale(1.8)";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(0, 255, 65, 0.5)";
        dot.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
