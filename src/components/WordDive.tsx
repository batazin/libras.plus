"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { onMotion } from "@/lib/motionInput";
import { requestRefresh, setupScroll } from "@/lib/scrollSetup";

gsap.registerPlugin(ScrollTrigger);
// smooth pinning on touch devices + single merged refresh (see scrollSetup)
setupScroll();

/*
 * Scroll "dive" through a giant word (same effect as the home hero).
 * A photo is seen through the letters; scrolling pins the section and
 * zooms into one letter until the photo fills the screen, then the
 * final content (children) comes in over a dark shade.
 */
const VB_W = 1600;
const VB_H = 900;
const BASELINE = 600;

interface WordDiveProps {
  word: string;
  /** index of the letter to dive into (pick one with a solid vertical stroke, e.g. I) */
  focusIndex: number;
  image: string;
  imageAlt: string;
  /** CSS object-position for the photo */
  imagePosition?: string;
  labelledBy: string;
  /** plain-text labels shown around the word before the dive */
  topLeft?: ReactNode;
  topRight?: ReactNode;
  statement?: ReactNode;
  /** content of the final frame (over the photo, white text) */
  children: ReactNode;
  /** extra overlay shown with the final frame (e.g. picture-in-picture) */
  finalOverlay?: ReactNode;
}

export function WordDive({
  word,
  focusIndex,
  image,
  imageAlt,
  imagePosition = "center",
  labelledBy,
  topLeft,
  topRight,
  statement,
  children,
  finalOverlay,
}: WordDiveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const maskId = `dive-mask-${useId().replace(/:/g, "")}`;
  // fit the word to ~88% of the view width
  const fontSize = Math.min(400, (VB_W * 0.88) / (word.length * 0.66));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(q("[data-dive-intro], [data-dive-word]"), { autoAlpha: 0 });
      gsap.set(q("[data-dive-shade], [data-dive-item], [data-dive-overlay]"), {
        autoAlpha: 1,
      });
      gsap.set(q("[data-dive-final]"), { pointerEvents: "auto" });
      return;
    }

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const measure = section.querySelector<SVGTextElement>("[data-dive-measure]");
        let fx = VB_W / 2;
        let fy = BASELINE - fontSize * 0.36;
        try {
          const box = measure?.getExtentOfChar(focusIndex);
          if (box && box.width > 0) {
            fx = box.x + box.width / 2;
            fy = box.y + box.height * 0.55;
          }
        } catch {
          /* keep the estimate */
        }

        // letters rise in when the section comes into view
        gsap.from(q("[data-dive-intro-word]"), {
          y: 160,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top+=72",
            end: "+=170%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(q("[data-dive-intro]"), { autoAlpha: 0, y: -20, duration: 0.12 }, 0)
          .to(
            q("[data-dive-zoom]"),
            {
              scale: 42,
              x: VB_W / 2 - fx,
              y: VB_H / 2 - fy,
              svgOrigin: `${fx} ${fy}`,
              ease: "power2.in",
              duration: 0.62,
            },
            0
          )
          .fromTo(q("[data-dive-photo]"), { scale: 1.2 }, { scale: 1, duration: 0.7 }, 0)
          .to(q("[data-dive-word]"), { autoAlpha: 0, duration: 0.08 }, 0.56)
          .to(q("[data-dive-shade]"), { autoAlpha: 1, duration: 0.2 }, 0.58)
          .fromTo(
            q("[data-dive-item]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.2 },
            0.66
          )
          .fromTo(
            q("[data-dive-overlay]"),
            { autoAlpha: 0, scale: 0.6, x: 60 },
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.2, ease: "back.out(1.6)" },
            0.74
          )
          .set(q("[data-dive-final]"), { pointerEvents: "auto" }, 0.7)
          .to({}, { duration: 0.12 });

        requestRefresh();
      }, section);
    });

    // the photo drifts behind the letters with the pointer
    const photo = section.querySelector<HTMLElement>("[data-dive-move]");
    // mouse on desktop, gyroscope (or a slow drift) on phones
    const moveX = photo ? gsap.quickTo(photo, "x", { duration: 1.4, ease: "power3.out" }) : null;
    const moveY = photo ? gsap.quickTo(photo, "y", { duration: 1.4, ease: "power3.out" }) : null;
    const offMotion = onMotion((x, y) => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      moveX?.(x * -50);
      moveY?.(y * -30);
    });

    return () => {
      cancelled = true;
      offMotion();
      ctx?.revert();
    };
  }, [focusIndex, fontSize]);

  const textProps = {
    x: VB_W / 2,
    y: BASELINE,
    fontSize,
    textAnchor: "middle" as const,
    fontWeight: 800,
    className: "font-display",
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      className="relative h-[calc(100svh-4.5rem)] min-h-[560px] overflow-hidden bg-surface"
    >
      <div data-dive-move className="absolute inset-[-5%]">
        <div data-dive-photo className="hero-kenburns absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>
      </div>

      <div data-dive-shade className="invisible absolute inset-0 opacity-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
      </div>

      <svg
        data-dive-word
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-8000" y="-8000" width="17600" height="16900">
            <rect x="-8000" y="-8000" width="17600" height="16900" fill="white" />
            <g data-dive-intro-word>
              <g data-dive-zoom>
                <text {...textProps} fill="black">
                  {word}
                </text>
              </g>
            </g>
          </mask>
        </defs>
        <text data-dive-measure {...textProps} opacity={0}>
          {word}
        </text>
        <rect
          x="-8000"
          y="-8000"
          width="17600"
          height="16900"
          mask={`url(#${maskId})`}
          style={{ fill: "var(--surface)" }}
        />
      </svg>

      {/* plain-text labels around the word */}
      <div
        data-dive-intro
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl justify-between px-4 pt-8 text-sm text-ink-muted sm:px-6 lg:px-8"
      >
        <p>{topLeft}</p>
        <p className="hidden sm:block">{topRight}</p>
      </div>
      {statement && (
        <div
          data-dive-intro
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8"
        >
          <p className="max-w-[34ch] font-display text-lg font-semibold leading-snug text-ink sm:text-2xl">
            {statement}
          </p>
        </div>
      )}

      {finalOverlay && (
        <div data-dive-overlay className="invisible absolute right-4 top-6 opacity-0 sm:right-8 sm:top-10 lg:right-12">
          {finalOverlay}
        </div>
      )}

      <div data-dive-final className="pointer-events-none absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 text-white sm:px-6 md:pb-16 lg:px-8">
          {children}
        </div>
      </div>
    </section>
  );
}
