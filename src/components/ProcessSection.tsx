import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { BRAND, PROCESS_STAGES } from "@/lib/content";
import { GsapWindowReveal } from "./GsapWindowReveal";

export function ProcessSection() {
  return (
    <section
      aria-labelledby="processo-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2
            id="processo-heading"
            className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Inclusão que conecta na prática
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-ink-muted">
            Na Libras Plus, acessibilidade comunicacional vai além de cumprir normas. Planejamos cada escala e material com respeito à Língua Brasileira de Sinais e à clareza da sua mensagem.
          </p>

          <blockquote className="mt-8 border-l-4 border-brand pl-5">
            <p className="font-display text-xl font-semibold text-ink">
              &ldquo;Aqui, a comunicação é para todos!&rdquo;
            </p>
            <footer className="mt-1.5 text-sm text-ink-muted">
              Compromisso institucional Libras Plus - São Carlos, SP
            </footer>
          </blockquote>

          <div className="mt-8">
            <Link
              href="/orcamento"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
            >
              <span>{BRAND.primaryCta}</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROCESS_STAGES.map((stage, index) => (
              <GsapWindowReveal key={stage.title} delay={index * 0.05}>
                <li className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface-card p-6">
                  <div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-bold text-brand-text">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-ink">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {stage.detail}
                    </p>
                  </div>
                </li>
              </GsapWindowReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
