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

const WINDOW_SPECS = [
  {
    label: "Enquadramento",
    value: "Proporção conforme ABNT NBR 15290 sem cortes nos sinais.",
  },
  {
    label: "Contraste",
    value: "Fundo neutro e vestimenta planejada para leitura visual limpa.",
  },
  {
    label: "Entrega",
    value: "Arquivo sincronizado com o vídeo ou camada alpha separada.",
  },
] as const;

/* timecode HH:MM:SS:FF at 30 fps */
function timecode(frames: number) {
  const f = Math.floor(frames);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `00:${pad(Math.floor(f / 1800) % 60)}:${pad(Math.floor(f / 30) % 60)}:${pad(f % 30)}`;
}

/*
 * "Opening the window": a small camera viewfinder in the middle of the
 * screen shows the studio. Scrolling pins the section and the window
 * grows to full screen, pushing JANELA / DE LIBRAS out of the way;
 * then the copy and a picture-in-picture Libras window come in.
 */
export function GsapWindowShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const photo = section.querySelector<HTMLElement>("[data-win-photo]");
    const frame = section.querySelector<HTMLElement>("[data-win-frame]");
    const top = section.querySelector<HTMLElement>("[data-win-top]");
    const bottom = section.querySelector<HTMLElement>("[data-win-bottom]");
    const tc = section.querySelector<HTMLElement>("[data-win-tc]");
    if (!photo || !frame || !top || !bottom || !tc) return;

    const mobile = window.innerWidth < 640;
    const start = { hx: mobile ? 8 : 31, vy: mobile ? 32 : 28 };
    const state = { ...start, t: 0 };

    const apply = () => {
      const { hx, vy } = state;
      photo.style.clipPath = `inset(${vy}% ${hx}% ${vy}% ${hx}% round 6px)`;
      frame.style.inset = `${vy}% ${hx}%`;
      // the words ride on the window edges
      top.style.bottom = `calc(${100 - vy}% + 0.15em)`;
      bottom.style.top = `calc(${100 - vy}% + 0.1em)`;
      tc.textContent = timecode(412 + state.t * 900);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.hx = 0;
      state.vy = 0;
      apply();
      gsap.set(q("[data-win-intro], [data-win-frame], [data-win-word]"), {
        autoAlpha: 0,
      });
      gsap.set(q("[data-win-shade], [data-win-item], [data-win-pip]"), {
        autoAlpha: 1,
      });
      gsap.set(q("[data-win-final]"), { pointerEvents: "auto" });
      return;
    }

    apply();

    // Create the ScrollTriggers after the fonts are ready, like the other
    // pinned sections, so they are registered in page order and the pin
    // spacing of the sections above is accounted for.
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // the window opens slightly when the section arrives
        gsap.from(q("[data-win-frame-in]"), {
          scale: 0.6,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
        });
        gsap.from(q("[data-win-word]"), {
          yPercent: (i) => (i === 0 ? 60 : -60),
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
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

        tl.to(q("[data-win-intro]"), { autoAlpha: 0, duration: 0.1 }, 0)
          .to(
            state,
            {
              hx: 0,
              vy: 0,
              t: 1,
              ease: "power2.inOut",
              duration: 0.6,
              onUpdate: apply,
            },
            0,
          )
          .fromTo(
            q("[data-win-img]"),
            { scale: 1.35 },
            { scale: 1, duration: 0.65 },
            0,
          )
          .to(q("[data-win-frame]"), { autoAlpha: 0, duration: 0.08 }, 0.55)
          .to(q("[data-win-shade]"), { autoAlpha: 1, duration: 0.2 }, 0.55)
          .fromTo(
            q("[data-win-item]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.2 },
            0.64,
          )
          .fromTo(
            q("[data-win-pip]"),
            { autoAlpha: 0, scale: 0.5, x: 80, y: -40 },
            {
              autoAlpha: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.2,
              ease: "back.out(1.6)",
            },
            0.72,
          )
          .set(q("[data-win-final]"), { pointerEvents: "auto" }, 0.7)
          .to({}, { duration: 0.12 });

        requestRefresh();
      }, section);
    });

    // pointer parallax inside the window
    const img = section.querySelector<HTMLElement>("[data-win-move]");
    // mouse on desktop, gyroscope (or a slow drift) on phones
    const moveX = img ? gsap.quickTo(img, "x", { duration: 1.4, ease: "power3.out" }) : null;
    const moveY = img ? gsap.quickTo(img, "y", { duration: 1.4, ease: "power3.out" }) : null;
    const offMotion = onMotion((x, y) => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      moveX?.(x * -40);
      moveY?.(y * -24);
    });

    return () => {
      cancelled = true;
      offMotion();
      ctx?.revert();
    };
  }, []);

  const corner = "absolute size-7 border-brand sm:size-9";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="janela-libras-heading"
      className="relative h-[calc(100svh-4.5rem)] min-h-[560px] overflow-hidden bg-surface"
    >
      {/* the studio, clipped to the window */}
      <div data-win-photo className="absolute inset-0 overflow-hidden">
        <div data-win-move className="absolute inset-[-4%]">
          <div data-win-img className="absolute inset-0">
            <Image
              src="/images/studio-translation.jpg"
              alt="Intérprete gravando janela de Libras em estúdio com câmera e iluminação profissional."
              fill
              sizes="100vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        </div>
        <div data-win-shade className="invisible absolute inset-0 opacity-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
        </div>
      </div>

      {/* camera viewfinder drawn on the window edge */}
      <div
        data-win-frame
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <div data-win-frame-in className="absolute inset-0">
          <span className={`${corner} -left-3 -top-3 border-l-2 border-t-2`} />
          <span className={`${corner} -right-3 -top-3 border-r-2 border-t-2`} />
          <span
            className={`${corner} -bottom-3 -left-3 border-b-2 border-l-2`}
          />
          <span
            className={`${corner} -bottom-3 -right-3 border-b-2 border-r-2`}
          />
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-white/70" />
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-white/70" />
          <span
            data-win-tc
            className="absolute bottom-3 left-3 font-mono text-[11px] tracking-wider text-white/90 drop-shadow"
          />
        </div>
      </div>

      {/* words pushed away by the opening window */}
      <p
        data-win-top
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 text-center font-display text-[17vw] font-extrabold leading-[0.8] tracking-tight text-ink sm:text-[9vw]"
      >
        <span data-win-word className="inline-block">
          JANELA
        </span>
      </p>
      <p
        data-win-bottom
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 text-center font-display text-[15vw] font-extrabold leading-[0.8] tracking-tight sm:text-[9vw]"
      >
        <span data-win-word className="inline-block text-brand">
          DE LIBRAS
        </span>
      </p>

      {/* plain-text labels */}
      <div
        data-win-intro
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl justify-between px-4 pt-8 text-sm text-ink-muted sm:px-6 lg:px-8"
      >
        <p>Produção audiovisual</p>
        <p className="hidden sm:block">Role para abrir a janela</p>
      </div>

      {/* picture-in-picture Libras window */}
      <div
        data-win-pip
        className="invisible absolute right-4 top-6 opacity-0 sm:right-8 sm:top-10 lg:right-12"
      >
        <div className="w-[120px] sm:w-[170px] lg:w-[210px]">
          <div className="pip-frame relative aspect-[4/5] overflow-hidden rounded-md border-2 border-brand shadow-2xl">
            <Image
              src="/images/hero-interpreter.jpg"
              alt="Exemplo de janela de Libras sobreposta ao vídeo, com a intérprete em destaque."
              fill
              sizes="210px"
              className="object-cover object-[66%_30%]"
            />
          </div>
          <p className="mt-2 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-white drop-shadow">
            Janela de Libras
          </p>
        </div>
      </div>

      {/* final frame */}
      <div
        data-win-final
        className="pointer-events-none absolute inset-0 flex items-end"
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 text-white sm:px-6 md:pb-16 lg:px-8">
          <h2
            id="janela-libras-heading"
            data-win-item
            className="invisible max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight opacity-0 sm:text-5xl lg:text-6xl"
          >
            Janela de Libras com enquadramento de{" "}
            <span className="text-gradient-animated">estúdio</span>
          </h2>
          <p
            data-win-item
            className="invisible mt-5 max-w-[56ch] text-base leading-relaxed text-white/80 opacity-0 sm:text-lg"
          >
            Gravação dedicada para vídeos institucionais, cursos, campanhas e
            projetos culturais, sincronizada e pronta para edição ou publicação
            direta.
          </p>
          <dl
            data-win-item
            className="invisible mt-8 hidden max-w-4xl grid-cols-3 gap-8 border-t border-white/15 pt-6 opacity-0 md:grid"
          >
            {WINDOW_SPECS.map((spec) => (
              <div key={spec.label}>
                <dt className="font-display text-sm font-bold text-brand">
                  {spec.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-white/75">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
          <div data-win-item className="invisible mt-8 opacity-0">
            <Link
              href="/servicos"
              className="led-border led-brand group inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/70"
            >
              <span>Conhecer serviços audiovisuais</span>
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
