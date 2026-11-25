"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isTouchDevice, onMotion } from "@/lib/motionInput";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

/**
 * 3D tilt with a moving glare highlight.
 * Desktop: follows the mouse over the card.
 * Phones: follows the device tilt (gyroscope) or a slow drift while visible.
 * Children can use `[transform:translateZ(..)]` to pop out in depth.
 */
export function TiltCard({ children, className = "", max = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const set = (px: number, py: number, glare: number) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      el.style.setProperty("--glare", String(glare));
    });
  };

  // touch devices: drive the tilt from the gyroscope while the card is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el || !isTouchDevice()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const off = onMotion((x, y) => {
      if (visible) set(0.5 + x * 1.2, 0.5 + y * 1.2, 0.8);
    });
    return () => {
      off();
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    set((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height, 1);
  };

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    set(0.5, 0.5, 0);
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`tilt-card relative [transform-style:preserve-3d] ${className}`}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glare,0)] transition-opacity duration-300 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(255,255,255,0.28),transparent_55%)] mix-blend-soft-light"
        />
      </div>
    </div>
  );
}
