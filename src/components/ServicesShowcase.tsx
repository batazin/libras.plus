"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BRAND, SERVICES } from "@/lib/content";

export function ServicesShowcase() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const reduceMotion = useReducedMotion();
  const activeService =
    SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];

  return (
    <section
      aria-labelledby="servicos-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="max-w-2xl">
        <h2
          id="servicos-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Frentes de atendimento técnico
        </h2>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-ink-muted">
          Selecione uma frente para conferir escopo, entregáveis e formatos atendidos pela nossa equipe.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div
          role="tablist"
          aria-label="Frentes de serviço da Libras Plus"
          className="flex flex-col gap-3 lg:col-span-5"
        >
          {SERVICES.map((service) => {
            const isSelected = service.id === activeService.id;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                id={`tab-${service.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${service.id}`}
                onClick={() => setActiveId(service.id)}
                className={`group w-full rounded-md border p-5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.99] ${
                  isSelected
                    ? "border-brand bg-surface-card"
                    : "border-border bg-surface-elevated/60 hover:border-brand/50 hover:bg-surface-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {service.summary}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className={`mt-1 shrink-0 transition-transform duration-150 ${
                      isSelected
                        ? "translate-x-0.5 text-brand-text"
                        : "text-ink-muted group-hover:translate-x-0.5 group-hover:text-ink"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              role="tabpanel"
              id={`panel-${activeService.id}`}
              aria-labelledby={`tab-${activeService.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-md border border-border bg-surface-card"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-elevated">
                <Image
                  src={activeService.image}
                  alt={activeService.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold text-brand-text">
                  {activeService.formatNote}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                  {activeService.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {activeService.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink"
                    >
                      <CheckCircle
                        size={19}
                        weight="fill"
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-brand-text"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <span className="text-sm text-ink-muted">
                    Atendimento dimensionado sob medida para a sua demanda.
                  </span>
                  <Link
                    href="/orcamento"
                    className="inline-flex whitespace-nowrap items-center gap-2 led-border rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
                  >
                    <span>{BRAND.primaryCta}</span>
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
