"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isTouchDevice, onMotion } from "@/lib/motionInput";

/**
 * Sets --mx/--my on every `.spotlight-item` so each can draw a glow that
 * follows the cursor across the whole grid. On touch devices the light
 * travels across the grid with the device tilt (or a slow drift).
 */
export function SpotlightGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [touch, setTouch] = useState(false);

  const lightAt = (clientX: number, clientY: number) => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".spotlight-item").forEach((item) => {
      const r = item.getBoundingClientRect();
      item.style.setProperty("--mx", `${clientX - r.left}px`);
      item.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  useEffect(() => {
    const root = ref.current;
    if (!root || !isTouchDevice()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTouch(true);
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);
    const off = onMotion((x, y) => {
      if (!visible) return;
      const r = root.getBoundingClientRect();
      lightAt(r.left + r.width * (0.5 + x * 1.6), r.top + r.height * (0.5 + y * 1.6));
    });
    return () => {
      off();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => e.pointerType === "mouse" && lightAt(e.clientX, e.clientY)}
      className={`spotlight-grid ${touch ? "is-touch" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
