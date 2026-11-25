import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/content";
import { GsapHeroWindow } from "./GsapHeroWindow";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 md:pt-16 md:pb-20 lg:px-8"
    >
      <GsapHeroWindow
        leftContent={
          <div>
            <p
              data-hero-stagger
              className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text"
            >
              {BRAND.subtitle} em Libras
            </p>

            <h1
              id="hero-heading"
              data-hero-stagger
              className="mt-4 font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
            >
              Comunicação sem barreiras para conectar pessoas.
            </h1>

            <p
              data-hero-stagger
              className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Tradução e interpretação em Libras com rigor técnico para eventos, empresas, ensino e produções audiovisuais.
            </p>

            <div
              data-hero-stagger
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href="/orcamento"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
              >
                <span>{BRAND.primaryCta}</span>
                <ArrowRight size={17} weight="bold" aria-hidden="true" />
              </Link>

              <Link
                href="/servicos"
                className="inline-flex whitespace-nowrap items-center justify-center rounded-full border border-border bg-surface-card px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-150 hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
              >
                {BRAND.secondaryCta}
              </Link>
            </div>
          </div>
        }
        rightMedia={
          <div
            data-hero-window
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated"
          >
            <Image
              src="/images/hero-interpreter.jpg"
              alt="Intérprete de Libras atuando no palco de um auditório durante evento com público ao fundo."
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      />
    </section>
  );
}
