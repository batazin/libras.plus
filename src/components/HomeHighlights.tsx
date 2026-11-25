import {
  ArrowRight,
  Briefcase,
  ChalkboardTeacher,
  MaskHappy,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { GsapWindowReveal } from "./GsapWindowReveal";
import { ClosingCta } from "./ClosingCta";
import { InclusionSection } from "./InclusionSection";

const HOME_SECTORS_LIST: { title: string; detail: string; icon: Icon }[] = [
  {
    title: "Empresas e RH",
    detail: "Integrações, treinamentos, SIPAT e entrevistas acessíveis.",
    icon: Briefcase,
  },
  {
    title: "Eventos e Ensino",
    detail: "Congressos, palestras, bancas acadêmicas e lives nacionais.",
    icon: ChalkboardTeacher,
  },
  {
    title: "Cultura e Editais",
    detail: "Espetáculos, museus, peças audiovisuais e documentação fiscal.",
    icon: MaskHappy,
  },
];

export function HomeHighlights() {
  return (
    <>
      <InclusionSection />

      <section
        aria-labelledby="manifesto-home-heading"
        className="border-y border-border bg-surface-elevated/60"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <GsapWindowReveal className="lg:col-span-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">
                  São Carlos - SP e Brasil
                </p>
                <h2
                  id="manifesto-home-heading"
                  className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
                >
                  Inclusão que conecta empresas, público e instituições
                </h2>
                <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-ink-muted">
                  Nascemos com o propósito de tornar a comunicação acessível em qualquer ambiente, unindo técnica, ética profissional e respeito à comunidade surda.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href="/sobre"
                    className="inline-flex whitespace-nowrap items-center gap-2 led-border led-brand rounded-sm border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand"
                  >
                    <span>Conhecer nossa metodologia</span>
                    <ArrowRight size={15} weight="bold" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/atuacao"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text hover:underline"
                  >
                    <span>Ver áreas de atuação</span>
                    <ArrowRight size={15} weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </GsapWindowReveal>

            <GsapWindowReveal mode="stagger3d" className="lg:col-span-6">
              <ul className="flex flex-col gap-3">
                {HOME_SECTORS_LIST.map((sector, i) => {
                  const IconCmp = sector.icon;
                  return (
                    <li key={sector.title} data-reveal-item>
                      <div className="sector-row group flex items-center gap-5 overflow-hidden rounded-md border border-border bg-surface-card p-5 sm:p-6">
                        <span className="grid size-12 shrink-0 place-items-center rounded-md bg-brand-soft text-brand-text transition-transform duration-500 group-hover:rotate-[360deg]">
                          <IconCmp size={24} weight="duotone" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-lg font-bold text-ink">
                            {sector.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                            {sector.detail}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="font-display text-3xl font-bold text-border transition-colors group-hover:text-brand"
                        >
                          0{i + 1}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </GsapWindowReveal>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
