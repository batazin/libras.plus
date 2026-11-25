"use client";

import { gsap } from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

interface GsapHeroWindowProps {
  leftContent: ReactNode;
  rightMedia: ReactNode;
}

export function GsapHeroWindow({
  leftContent,
  rightMedia,
}: GsapHeroWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const textItems = gsap.utils.toArray<HTMLElement>("[data-hero-stagger]");
      const mediaBox = root.querySelector<HTMLElement>("[data-hero-window]");
      const mediaImg = root.querySelector<HTMLElement>("[data-hero-window] img");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (textItems.length > 0) {
        tl.fromTo(
          textItems,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }
        );
      }

      if (mediaBox) {
        tl.fromTo(
          mediaBox,
          {
            clipPath: "inset(8% 12% 8% 12% round 24px)",
            opacity: 0.4,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            opacity: 1,
            duration: 0.9,
          },
          0.08
        );
      }

      if (mediaImg) {
        tl.fromTo(
          mediaImg,
          { scale: 1.07 },
          { scale: 1, duration: 1.05 },
          0.08
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <div className="lg:col-span-6">{leftContent}</div>
      <div className="lg:col-span-6">{rightMedia}</div>
    </div>
  );
}
