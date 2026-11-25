"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface GsapWindowRevealProps {
  children: ReactNode;
  mode?: "curtain" | "slide";
  delay?: number;
  className?: string;
}

export function GsapWindowReveal({
  children,
  mode = "slide",
  delay = 0,
  className = "",
}: GsapWindowRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (mode === "curtain") {
        const img = el.querySelector("img");

        gsap.fromTo(
          el,
          {
            clipPath: "inset(0% 18% 0% 18% round 20px)",
            opacity: 0.45,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            opacity: 1,
            duration: 0.85,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.07 },
            {
              scale: 1,
              duration: 1,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      } else {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay, mode]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
