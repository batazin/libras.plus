"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { onMotion } from "@/lib/motionInput";
import { requestRefresh, setupScroll } from "@/lib/scrollSetup";

gsap.registerPlugin(ScrollTrigger);
// smooth pinning on touch devices + single merged refresh (see scrollSetup)
setupScroll();

const SLICES = 7;
// where each strip starts (in % of its own height): alternating up/down
const OFFSETS = [-60, 46, -34, 68, -52, 38, -72];
// how strongly each strip follows the pointer
const DEPTH = [18, -26, 34, -14, 28, -32, 20];

/*
 * "Pieces coming together": the meeting photo is cut into vertical strips
 * scattered up and down. Scrolling pins the section and the strips slide
 * into place, forming the whole picture over the word INCLUSÃO.
 */
export function InclusionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(q("[data-inc-slice]"), { yPercent: 0, scaleX: 1 });
      gsap.set(q("[data-inc-intro], [data-inc-word]"), { autoAlpha: 0 });
      gsap.set(q("[data-inc-shade], [data-inc-item]"), { autoAlpha: 1 });
      gsap.set(q("[data-inc-final]"), { pointerEvents: "auto" });
      return;
    }

    // how much the strips follow the pointer/tilt (1 = scattered, 0 = assembled)
    const drift = { k: 1 };
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // registered after fonts, like the other pinned sections, to keep page order
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.set(q("[data-inc-slice]"), {
          yPercent: (i) => OFFSETS[i],
          scaleX: 0.82,
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

        tl.to(q("[data-inc-intro]"), { autoAlpha: 0, duration: 0.1 }, 0)
          .to(
            q("[data-inc-slice]"),
            {
              yPercent: 0,
              ease: "power3.inOut",
              duration: 0.45,
              stagger: { each: 0.03, from: "edges" },
            },
            0
          )
          .to(drift, { k: 0, duration: 0.5, onUpdate: () => applyDrift() }, 0)
          .to(q("[data-inc-slice]"), { scaleX: 1.002, duration: 0.15, ease: "power2.out" }, 0.48)
          .to(q("[data-inc-word]"), { scale: 0.7, autoAlpha: 0, duration: 0.3 }, 0.3)
          .fromTo(q("[data-inc-img]"), { scale: 1.15 }, { scale: 1, duration: 0.65 }, 0)
          .to(q("[data-inc-shade]"), { autoAlpha: 1, duration: 0.2 }, 0.58)
          .fromTo(
            q("[data-inc-item]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.2 },
            0.66
          )
          .set(q("[data-inc-final]"), { pointerEvents: "auto" }, 0.7)
          .to({}, { duration: 0.12 });

        requestRefresh();
      }, section);
    });

    // each strip drifts at its own depth with the pointer
    const moverEls = Array.from(section.querySelectorAll<HTMLElement>("[data-inc-move]"));
    // mouse on desktop, gyroscope (or a slow drift) on phones
    const movers = moverEls.map((m) => ({
      x: gsap.quickTo(m, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(m, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const last = { x: 0, y: 0 };
    const applyDrift = () => {
      const k = drift.k;
      movers.forEach((m, i) => {
        m.x(last.x * 6 * k);
        m.y(last.y * DEPTH[i] * k);
      });
    };
    const offMotion = onMotion((x, y) => {
      last.x = x;
      last.y = y;
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      applyDrift();
    });

    return () => {
      cancelled = true;
      offMotion();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="destaques-servicos-heading"
      className="relative h-[calc(100svh-4.5rem)] min-h-[560px] overflow-hidden bg-surface"
    >
      {/* the word behind the strips */}
      <p
        data-inc-word
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden font-display text-[16vw] font-extrabold leading-none tracking-tight text-ink sm:text-[15vw]"
      >
        {"INCLUSÃO".split("").map((l, i) => (
          <span key={i} className="inline-block">
            {l}
          </span>
        ))}
      </p>

      {/* photo strips */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: SLICES }).map((_, i) => (
          <div key={i} data-inc-slice className="relative -mr-px h-full flex-1">
            <div data-inc-move className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-y-0"
                style={{ width: `${SLICES * 100}%`, left: `${-i * 100}%` }}
              >
                <div data-inc-img className="absolute inset-[-3%]">
                  <Image
                    src="/images/corporate-inclusion.jpg"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-[63%_45%] sm:object-[55%_center]"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">
        Profissionais surdos e ouvintes em reunião corporativa mediada por intérprete de Libras.
      </p>

      <div data-inc-shade className="pointer-events-none invisible absolute inset-0 opacity-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 sm:from-black/75 sm:via-transparent" />
        <div className="absolute inset-0 bg-black/35 sm:hidden" />
      </div>

      {/* plain-text labels */}
      <div
        data-inc-intro
        className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto flex max-w-7xl justify-between px-4 pt-8 text-sm font-medium text-white mix-blend-difference sm:px-6 lg:px-8"
      >
        <p>Interpretação presencial e remota</p>
        <p className="hidden sm:block">Role para unir as peças</p>
      </div>

      {/* final frame */}
      <div
        data-inc-final
        className="pointer-events-none absolute inset-0 flex items-center sm:items-end"
      >
        <div className="mx-auto w-full max-w-7xl px-4 text-white sm:px-6 sm:pb-12 md:pb-16 lg:px-8">
          <h2
            id="destaques-servicos-heading"
            data-inc-item
            className="invisible max-w-3xl font-display text-[2.1rem] font-bold leading-[1.02] tracking-tight opacity-0 sm:text-5xl lg:text-6xl"
          >
            Interpretação presencial e remota para{" "}
            <span className="text-gradient-animated">equipes e eventos</span>
          </h2>
          <p
            data-inc-item
            className="invisible mt-5 max-w-[58ch] text-base leading-relaxed text-white/80 opacity-0 sm:text-lg"
          >
            Congressos, reuniões corporativas, integrações de RH, simpósios e transmissões online,
            com intérpretes em dupla ou solo e glossário alinhado antes de cada evento.
          </p>
          <div data-inc-item className="invisible mt-8 flex flex-wrap gap-3.5 opacity-0">
            <Link
              href="/servicos"
              className="led-border btn-shine group inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover"
            >
              <span>Explorar todos os serviços</span>
              <ArrowRight
                size={16}
                weight="bold"
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
