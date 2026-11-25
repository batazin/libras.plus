"use client";

import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

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

export function GsapWindowShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [specsOpen, setSpecsOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const img = frame.querySelector("img");

      gsap.fromTo(
        frame,
        {
          clipPath: "inset(9% 14% 9% 14% round 24px)",
          scale: 0.9,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "center 48%",
            scrub: 0.75,
          },
        }
      );

      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "center 48%",
              scrub: 0.75,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!specsOpen || !drawerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        drawerRef.current,
        {
          clipPath: "inset(0% 0% 100% 0% round 16px)",
          opacity: 0,
          y: -8,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        }
      );
    }, drawerRef);

    return () => ctx.revert();
  }, [specsOpen]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="janela-libras-heading"
      className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 md:pt-24 md:pb-12 lg:px-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2
            id="janela-libras-heading"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Janela de Libras com enquadramento de estúdio
          </h2>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-muted">
            Gravação dedicada para vídeos institucionais, cursos, campanhas e projetos culturais em todo o Brasil.
          </p>
        </div>

        <button
          type="button"
          aria-expanded={specsOpen}
          aria-controls="janela-specs-drawer"
          onClick={() => setSpecsOpen((prev) => !prev)}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98] sm:self-auto"
        >
          <span>{specsOpen ? "Fechar especificações" : "Abrir especificações"}</span>
          <CaretDown
            size={15}
            weight="bold"
            aria-hidden="true"
            className={`transition-transform duration-200 ${
              specsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {specsOpen && (
        <div
          id="janela-specs-drawer"
          ref={drawerRef}
          className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface-card p-6 md:grid-cols-3"
        >
          {WINDOW_SPECS.map((spec) => (
            <div key={spec.label}>
              <h3 className="font-display text-sm font-bold text-brand-text">
                {spec.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        ref={frameRef}
        className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated"
      >
        <Image
          src="/images/studio-translation.jpg"
          alt="Intérprete gravando janela de Libras em estúdio com câmera e iluminação profissional."
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-muted">
          Produção audiovisual sincronizada e pronta para edição ou publicação direta.
        </p>
        <Link
          href="/servicos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-text hover:underline"
        >
          <span>Conhecer serviços audiovisuais</span>
          <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
