import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/content";
import { GsapWindowReveal } from "./GsapWindowReveal";

const HOME_SECTORS_LIST = [
  {
    title: "Empresas e RH",
    detail: "Integrações, treinamentos, SIPAT e entrevistas acessíveis.",
  },
  {
    title: "Eventos e Ensino",
    detail: "Congressos, palestras, bancas acadêmicas e lives nacionais.",
  },
  {
    title: "Cultura e Editais",
    detail: "Espetáculos, museus, peças audiovisuais e documentação fiscal.",
  },
] as const;

export function HomeHighlights() {
  return (
    <>
      <section
        aria-labelledby="destaques-servicos-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <GsapWindowReveal mode="curtain" className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              <Image
                src="/images/corporate-inclusion.jpg"
                alt="Profissionais surdos e ouvintes em reunião corporativa mediada por intérprete de Libras."
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
          </GsapWindowReveal>

          <GsapWindowReveal delay={0.08} className="lg:col-span-6">
            <div>
              <h2
                id="destaques-servicos-heading"
                className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
              >
                Interpretação presencial e remota para equipes e eventos
              </h2>
              <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-ink-muted">
                Cobertura em dupla ou solo para congressos, reuniões corporativas, integrações de RH, simpósios e transmissões online com preparo terminológico prévio.
              </p>

              <div className="mt-7">
                <Link
                  href="/servicos"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand"
                >
                  <span>Explorar todos os serviços</span>
                  <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </GsapWindowReveal>
        </div>
      </section>

      <section
        aria-labelledby="manifesto-home-heading"
        className="border-y border-border bg-surface-elevated/60"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
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
                    className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand"
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

            <GsapWindowReveal delay={0.08} className="lg:col-span-6">
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface-card">
                {HOME_SECTORS_LIST.map((sector) => (
                  <div key={sector.title} className="p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {sector.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {sector.detail}
                    </p>
                  </div>
                ))}
              </div>
            </GsapWindowReveal>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cta-home-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <GsapWindowReveal>
          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-border bg-surface-contrast p-8 text-ink-contrast sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2
                id="cta-home-heading"
                className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Precisa de acessibilidade em Libras para o seu próximo projeto?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-contrast/80 sm:text-base">
                Envie data, duração e formato pelo formulário ou fale diretamente pelos canais oficiais da Libras Plus.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/orcamento"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
              >
                <span>{BRAND.primaryCta}</span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>

              <a
                href={BRAND.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-ink-contrast/25 px-5 py-3.5 text-sm font-semibold text-ink-contrast transition-colors hover:border-ink-contrast/60"
              >
                <span>Canais diretos</span>
                <ArrowSquareOut size={16} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>
        </GsapWindowReveal>
      </section>
    </>
  );
}
