import { GsapWindowReveal } from "./GsapWindowReveal";
import { HandSpeller } from "./HandSpeller";
import { HeroSceneLazy } from "./three/HeroSceneLazy";

/** Mid-page showcase: a 3D hand fingerspelling L-I-B-R-A-S. */
export function HandSection() {
  return (
    <section
      aria-labelledby="alfabeto-heading"
      className="relative isolate overflow-hidden py-16 md:py-24"
    >
      {/* particle wave background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-glow absolute inset-0" />
        <HeroSceneLazy />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <GsapWindowReveal className="lg:col-span-5">
          <h2
            id="alfabeto-heading"
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl"
          >
            A Libras na <span className="text-gradient-animated">palma da mão</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            Cada letra do alfabeto manual tem uma configuração de mão própria. Veja como se soletra
            LIBRAS e clique nas letras para ver cada uma.
          </p>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
            A datilologia é usada para nomes próprios e termos sem sinal, e por isso o preparo
            terminológico antes de cada evento faz diferença.
          </p>
        </GsapWindowReveal>

        <GsapWindowReveal delay={0.1} className="lg:col-span-7">
          <HandSpeller />
        </GsapWindowReveal>
      </div>
    </section>
  );
}
