"use client";

import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/content";
import { Magnetic } from "./effects/Magnetic";
import { requestRefresh, setupScroll } from "@/lib/scrollSetup";

gsap.registerPlugin(ScrollTrigger);
// smooth pinning on touch devices + single merged refresh (see scrollSetup)
setupScroll();

const HEADLINE = [
  { w: "Precisa" },
  { w: "de" },
  { w: "acessibilidade" },
  { w: "em" },
  { w: "Libras", accent: true },
  { w: "para" },
  { w: "o" },
  { w: "seu" },
  { w: "próximo" },
  { w: "projeto?" },
];

// optimized copy of the hero photo, used as the fill of the closing word
const PHOTO = "/_next/image?url=%2Fimages%2Fhero-interpreter.jpg&w=1920&q=75";

/*
 * Closing call to action, in the same language as the rest of the home:
 * full-bleed, plain-text labels, a headline whose words light up with the
 * scroll, LED buttons, and the site bookended by LIBRAS+ with the
 * interpreter photo moving inside the letters.
 */
export function ClosingCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(section);

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // words light up one by one
        gsap.fromTo(
          q("[data-cta-word]"),
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: q("[data-cta-headline]")[0],
              start: "top 85%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          }
        );

        gsap.from(q("[data-cta-rise]"), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-cta-rise]")[0], start: "top 90%", once: true },
        });

        // the closing word slides up and the photo travels inside it
        const word = q("[data-cta-bigword]")[0];
        gsap.fromTo(
          word,
          { yPercent: 35 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          }
        );
        gsap.fromTo(
          q("[data-cta-fill]"),
          { backgroundPosition: "50% 0%" },
          {
            backgroundPosition: "50% 45%",
            ease: "none",
            scrollTrigger: { trigger: word, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }, section);
      requestRefresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="cta-home-heading" className="relative overflow-hidden bg-surface">
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <div className="flex justify-between border-t border-border pt-6 text-sm text-ink-muted">
          <p>Vamos conversar</p>
          <p className="hidden sm:block">{BRAND.city} · todo o Brasil</p>
        </div>

        <h2
          id="cta-home-heading"
          data-cta-headline
          className="mt-14 max-w-6xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[5.6rem]"
        >
          {HEADLINE.map(({ w, accent }, i) => (
            <span key={i}>
              <span data-cta-word className={accent ? "text-gradient-animated" : undefined}>
                {w}
              </span>{" "}
            </span>
          ))}
        </h2>

        <div className="mt-12 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <p data-cta-rise className="max-w-[46ch] text-base leading-relaxed text-ink-muted sm:text-lg lg:col-span-6">
            Envie data, duração e formato pelo formulário ou fale diretamente pelos canais oficiais da
            Libras Plus.
          </p>
          <div data-cta-rise className="flex flex-wrap items-center gap-3.5 lg:col-span-6 lg:justify-end">
            <Magnetic>
              <Link
                href="/orcamento"
                className="led-border btn-shine group inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-brand px-7 py-4 text-sm font-semibold text-brand-ink shadow-[0_10px_40px_-8px_var(--brand)] transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
              <a
                href={BRAND.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="led-border led-brand inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-border bg-surface-card px-7 py-4 text-sm font-semibold text-ink transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span>Canais diretos</span>
                <ArrowSquareOut size={17} weight="bold" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* bookend: LIBRAS+ with the interpreter inside the letters */}
      <div aria-hidden="true" className="mt-20 overflow-hidden md:mt-28">
        <p
          data-cta-bigword
          className="select-none whitespace-nowrap text-center font-display text-[24vw] font-extrabold leading-[0.78] tracking-tighter"
        >
          <span
            data-cta-fill
            className="bg-cover bg-clip-text text-transparent [-webkit-background-clip:text]"
            style={{ backgroundImage: `url(${PHOTO})`, backgroundPosition: "50% 0%" }}
          >
            LIBRAS
          </span>
          <span className="text-brand">+</span>
        </p>
      </div>
    </section>
  );
}
