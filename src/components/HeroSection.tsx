"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/content";
import { onMotion } from "@/lib/motionInput";
import { Magnetic } from "./effects/Magnetic";
import { requestRefresh, setupScroll } from "@/lib/scrollSetup";

gsap.registerPlugin(ScrollTrigger);
// smooth pinning on touch devices + single merged refresh (see scrollSetup)
setupScroll();

/*
 * "Dive through the word" hero.
 * The interpreter photo is seen through the letters of a giant LIBRAS+.
 * Scrolling pins the section and zooms into the letter I until the photo
 * fills the screen, then the headline and calls to action come in.
 *
 * The word is an SVG mask (viewBox units), so the zoom stays sharp.
 * Phones use the same single line with a tighter frame so it fills the width.
 */
interface WordLayout {
  vbW: number;
  vbH: number;
  font: number;
  lines: { text: string; x: number; y: number; len: number }[];
  plus: { x: number; y: number };
}

const LAYOUTS: Record<"d" | "m", WordLayout> = {
  d: {
    vbW: 1600,
    vbH: 900,
    font: 380,
    lines: [{ text: "LIBRAS", x: 90, y: 600, len: 1170 }],
    plus: { x: 1284, y: 600 },
  },
  // phones: the same single line, framed tightly so it fills the screen width
  m: {
    vbW: 1450,
    vbH: 900,
    font: 380,
    lines: [{ text: "LIBRAS", x: 15, y: 560, len: 1170 }],
    plus: { x: 1200, y: 560 },
  },
};

function WordSvg({ variant }: { variant: "d" | "m" }) {
  const L = LAYOUTS[variant];
  const maskId = `hero-word-mask-${variant}`;
  const text = (
    line: WordLayout["lines"][number],
    extra: Record<string, unknown> = {},
  ) => (
    <text
      key={line.text}
      x={line.x}
      y={line.y}
      fontSize={L.font}
      textLength={line.len}
      lengthAdjust="spacingAndGlyphs"
      className="font-display"
      fontWeight={800}
      {...extra}
    >
      {line.text}
    </text>
  );

  return (
    <div
      data-word-in
      data-variant={variant}
      className={`absolute inset-0 ${variant === "d" ? "hidden sm:block" : "sm:hidden"}`}
    >
      <svg
        data-word
        aria-hidden="true"
        className="h-full w-full"
        viewBox={`0 0 ${L.vbW} ${L.vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask
            id={maskId}
            data-cover
            maskUnits="userSpaceOnUse"
            x="-8000"
            y="-8000"
            width="17600"
            height="16900"
          >
            <rect
              data-cover
              x="-8000"
              y="-8000"
              width="17600"
              height="16900"
              fill="white"
            />
            <g data-mask-intro>
              <g data-mask-word>
                {L.lines.map((line) => text(line, { fill: "black" }))}
              </g>
            </g>
          </mask>
          {variant === "m" && (
            /* brand tint blended over the photo inside the letters */
            <linearGradient id="hero-word-tint-m" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2a65a" />
              <stop offset="1" stopColor="#e07828" />
            </linearGradient>
          )}
        </defs>
        {/* invisible twin of the first line, used to measure where the letter I sits */}
        {text(L.lines[0], { "data-measure": true, opacity: 0 })}
        <rect
          data-cover
          x="-8000"
          y="-8000"
          width="17600"
          height="16900"
          mask={`url(#${maskId})`}
          style={{ fill: "var(--surface)" }}
        />
        {variant === "m" && (
          <g data-outline style={{ mixBlendMode: "screen", opacity: 0.6 }}>
            {L.lines.map((line) => text(line, { fill: "url(#hero-word-tint-m)" }))}
          </g>
        )}
        <g data-plus-out>
          <text
            data-plus
            x={L.plus.x}
            y={L.plus.y}
            fontSize={L.font}
            fontWeight={800}
            className="font-display"
            style={{ fill: "var(--brand)" }}
          >
            +
          </text>
        </g>
      </svg>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      gsap.set(q("[data-intro-out], [data-word]"), { autoAlpha: 0 });
      gsap.set(q("[data-final], [data-shade]"), { autoAlpha: 1 });
      return;
    }

    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;

    // wait for the display font so the letter positions are final
    document.fonts.ready.then(() => {
      if (cancelled) return;
      mm = gsap.matchMedia(section);
      mm.add(
        { mobile: "(max-width: 639px)", desktop: "(min-width: 640px)" },
        (mctx) => {
          const variant = mctx.conditions?.mobile ? "m" : "d";
          const L = LAYOUTS[variant];
          const v = (sel: string) => q(`[data-variant="${variant}"] ${sel}`);
          const svg = section.querySelector<SVGSVGElement>(
            `[data-variant="${variant}"] svg`,
          );

          /* zoom target: the centre of the letter I, measured in viewBox units */
          const measure = section.querySelector<SVGTextElement>(
            `[data-variant="${variant}"] [data-measure]`,
          );
          const first = L.lines[0];
          let ix = first.x + first.len * 0.25;
          let iy = first.y - L.font * 0.36;
          try {
            const box = measure?.getExtentOfChar(1);
            if (box && box.width > 0) {
              ix = box.x + box.width / 2;
              iy = box.y + box.height * 0.55;
            }
          } catch {
            /* keep the estimate */
          }

          const isMobile = variant === "m";

          /* load-in */
          if (isMobile) {
            gsap.from(q(`[data-word-in][data-variant="m"]`), {
              y: 80,
              opacity: 0,
              duration: 1.2,
              ease: "power4.out",
            });
          } else {
            gsap.from(v("[data-mask-intro]"), {
              y: 140,
              opacity: 0,
              duration: 1.2,
              ease: "power4.out",
            });
          }
          gsap.from(v("[data-plus]"), {
            rotate: -90,
            scale: 0.3,
            opacity: 0,
            svgOrigin: `${L.plus.x + 110} ${L.plus.y - L.font * 0.3}`,
            duration: 1,
            delay: 0.35,
            ease: "back.out(2)",
          });
          gsap.from(q("[data-intro]"), {
            opacity: 0,
            y: 16,
            duration: 0.8,
            delay: 0.5,
            stagger: 0.1,
          });

          /*
           * PHONES ONLY — camera: zoom 1 -> 42x into the letter I while sliding
           * it to the centre, done with the viewBox (mobile Safari does not
           * repaint masks whose content is transformed). Desktop keeps scaling
           * the letters inside the mask, as it always did.
           */
          const zoom = { p: 0 };
          const covers = svg
            ? Array.from(svg.querySelectorAll<SVGElement>("[data-cover]"))
            : [];
          const setCamera = () => {
            if (!svg) return;
            const s = 1 + 41 * zoom.p;
            const w = L.vbW / s;
            const h = L.vbH / s;
            const cx = ((L.vbW / 2 - ix) * (1 - zoom.p)) / s + ix;
            const cy = ((L.vbH / 2 - iy) * (1 - zoom.p)) / s + iy;
            svg.setAttribute(
              "viewBox",
              `${cx - w / 2} ${cy - h / 2} ${w} ${h}`,
            );
            // Keep the mask and the cover rect just a bit larger than what is
            // on screen. Huge masks blow past Safari's buffer limits when
            // zoomed in, and the letters stop showing the photo.
            const m = Math.max(w, h) * 2;
            covers.forEach((el) => {
              el.setAttribute("x", String(cx - m));
              el.setAttribute("y", String(cy - m));
              el.setAttribute("width", String(m * 2));
              el.setAttribute("height", String(m * 2));
            });
          };
          if (isMobile) setCamera();

          /* scroll dive */
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top+=72",
              end: "+=180%",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.to(
            q("[data-intro-out]"),
            { autoAlpha: 0, y: -20, duration: 0.12 },
            0,
          )
            .to(
              v("[data-plus-out]"),
              { autoAlpha: 0, x: 160, duration: 0.18 },
              0,
            )
            .to(
              isMobile ? zoom : v("[data-mask-word]"),
              isMobile
                ? {
                    p: 1,
                    ease: "power2.in",
                    duration: 0.62,
                    onUpdate: setCamera,
                  }
                : {
                    scale: 42,
                    x: L.vbW / 2 - ix,
                    y: L.vbH / 2 - iy,
                    svgOrigin: `${ix} ${iy}`,
                    ease: "power2.in",
                    duration: 0.62,
                  },
              0,
            );
          if (isMobile) {
            tl.fromTo(
              q("[data-photo]"),
              {
                scale: 1.3,
                yPercent: 20,
                filter: "brightness(1.45) saturate(1.1)",
              },
              {
                scale: 1,
                yPercent: 0,
                filter: "brightness(1) saturate(1)",
                duration: 0.7,
              },
              0,
            );
            // the brand tint only helps legibility at rest; the dive reveals the real colours
            tl.to(v("[data-outline]"), { autoAlpha: 0, duration: 0.15 }, 0);
          }

          tl.to(q("[data-word]"), { autoAlpha: 0, duration: 0.08 }, 0.56)
            .to(q("[data-shade]"), { autoAlpha: 1, duration: 0.2 }, 0.58)
            .fromTo(
              q("[data-final-item]"),
              { y: 50, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.2 },
              0.68,
            )
            .set(q("[data-final]"), { pointerEvents: "auto" }, 0.7)
            .to({}, { duration: 0.12 }); // hold the final frame a little

          return () => svg?.setAttribute("viewBox", `0 0 ${L.vbW} ${L.vbH}`);
        },
      );
      requestRefresh();
    });

    /* the photo drifts behind the letters: mouse on desktop, gyroscope on phones */
    const photo = section.querySelector<HTMLElement>("[data-photo-move]");
    const moveX = photo
      ? gsap.quickTo(photo, "x", { duration: 1.4, ease: "power3.out" })
      : null;
    const moveY = photo
      ? gsap.quickTo(photo, "y", { duration: 1.4, ease: "power3.out" })
      : null;
    const offMotion = onMotion((x, y) => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      moveX?.(x * -50);
      moveY?.(y * -30);
    });

    return () => {
      cancelled = true;
      offMotion();
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative h-[calc(100svh-4.5rem)] min-h-[560px] overflow-hidden bg-surface"
    >
      {/* photo layer */}
      <div data-photo-move className="absolute inset-[-5%]">
        <div data-photo className="absolute inset-0">
          <div className="hero-kenburns absolute inset-0">
            <Image
              src="/images/hero-interpreter.jpg"
              alt="Intérprete de Libras sinalizando no palco de um auditório, com o público assistindo ao fundo."
              fill
              priority
              sizes="100vw"
              className="object-cover object-[66%_32%]"
            />
          </div>
        </div>
      </div>

      {/* readability shade for the final frame */}
      <div data-shade className="invisible absolute inset-0 opacity-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 sm:from-black/75 sm:via-transparent" />
        {/* phones: copy sits in the middle, so darken the photo evenly */}
        <div className="absolute inset-0 bg-black/35 sm:hidden" />
      </div>

      {/* the word: surface colour everywhere except inside the letters */}
      <WordSvg variant="d" />
      <WordSvg variant="m" />

      {/* intro copy around the word (plain text, no tags) */}
      <div
        data-intro-out
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl justify-between px-4 pt-8 text-sm text-ink-muted sm:px-6 lg:px-8"
      >
        <p data-intro>{BRAND.subtitle} em Libras</p>
        <p data-intro className="hidden sm:block">
          {BRAND.city} · todo o Brasil
        </p>
      </div>
      <div
        data-intro-out
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end justify-between px-4 pb-8 sm:px-6 lg:px-8"
      >
        <p
          data-intro
          className="max-w-[30ch] font-display text-lg font-semibold leading-snug text-ink sm:text-2xl"
        >
          Comunicação sem barreiras para conectar pessoas.
        </p>
        <div
          data-intro
          className="flex flex-col items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-muted"
        >
          <span>Role</span>
          <span className="scroll-cue relative block h-14 w-px overflow-hidden bg-border" />
        </div>
      </div>

      {/* final frame */}
      <div
        data-final
        className="pointer-events-none absolute inset-0 flex items-center sm:items-end"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 sm:pb-12 md:pb-16 lg:px-8">
          <h1
            id="hero-heading"
            data-final-item
            className="invisible max-w-4xl font-display text-[2.15rem] font-bold leading-[1.02] tracking-tight text-white opacity-0 sm:text-6xl lg:text-[5.4rem]"
          >
            Comunicação{" "}
            <span className="text-gradient-animated">sem barreiras</span> para
            conectar pessoas.
          </h1>
          <p
            data-final-item
            className="invisible mt-6 max-w-[50ch] text-base leading-relaxed text-white/80 opacity-0 sm:text-lg"
          >
            Tradução e interpretação em Libras com rigor técnico para eventos,
            empresas, ensino e produções audiovisuais.
          </p>
          <div
            data-final-item
            className="invisible mt-9 flex flex-wrap items-center gap-3.5 opacity-0"
          >
            <Magnetic>
              <Link
                href="/orcamento"
                className="btn-shine group inline-flex items-center gap-2 whitespace-nowrap led-border rounded-sm bg-brand px-7 py-4 text-sm font-semibold text-brand-ink shadow-[0_10px_40px_-8px_var(--brand)] transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>{BRAND.primaryCta}</span>
                <ArrowRight
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link
                href="/servicos"
                className="inline-flex items-center whitespace-nowrap led-border led-brand rounded-sm border border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {BRAND.secondaryCta}
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
