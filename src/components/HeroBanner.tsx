"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-width cinematic banner: the frame opens on load, the photo drifts
 * with the pointer and sinks slower than the page on scroll.
 */
export function HeroBanner({
  media,
  children,
}: {
  media: ReactNode;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const mediaEl = mediaRef.current;
    if (!root || !mediaEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        root,
        { clipPath: "inset(6% 8% 6% 8% round 6px)" },
        { clipPath: "inset(0% 0% 0% 0% round 6px)", duration: 1.2 }
      )
        .fromTo(mediaEl, { scale: 1.25 }, { scale: 1.08, duration: 1.6 }, 0)
        .fromTo(
          root.querySelectorAll("[data-hero-stagger]"),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          0.35
        )
        .fromTo(
          root.querySelectorAll("[data-hero-chip]"),
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.8)" },
          0.8
        );

      // photo sinks slower than the page
      gsap.to(mediaEl, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    // pointer parallax on the photo
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(mediaEl, { x: x * -30, y: y * -20, duration: 1.2, ease: "power2.out" });
    };
    root.addEventListener("pointermove", onMove);

    return () => {
      root.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative isolate overflow-hidden rounded-[2rem] bg-black"
    >
      <div ref={mediaRef} className="absolute inset-[-4%] -z-20 scale-[1.08]">
        <div className="hero-kenburns absolute inset-0">{media}</div>
      </div>
      {/* readability overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/5" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div className="hero-sweep absolute inset-0 -z-10" />
      {children}
    </div>
  );
}
