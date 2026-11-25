"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface GsapWindowRevealProps {
  children: ReactNode;
  mode?: "curtain" | "slide" | "tilt3d" | "stagger3d";
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
      if (mode === "tilt3d") {
        // Swings in from a 3D angle, tied to scroll position
        gsap.fromTo(
          el,
          {
            rotateY: -28,
            rotateX: 10,
            z: -160,
            opacity: 0.2,
            transformPerspective: 1300,
            transformOrigin: "left center",
          },
          {
            rotateY: 0,
            rotateX: 0,
            z: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 45%",
              scrub: 0.8,
            },
          }
        );
        return;
      }

      if (mode === "stagger3d") {
        // Children flip up one after another like cards
        const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.fromTo(
          items,
          {
            rotateX: -75,
            y: 40,
            opacity: 0,
            transformPerspective: 900,
            transformOrigin: "center top",
          },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay,
            stagger: 0.14,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          }
        );
        return;
      }

      if (mode === "curtain") {
        const img = el.querySelector("img");

        gsap.fromTo(
          el,
          {
            clipPath: "inset(0% 18% 0% 18% round 6px)",
            opacity: 0.45,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 6px)",
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
