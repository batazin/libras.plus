import {
  Buildings,
  FilmSlate,
  GraduationCap,
  MicrophoneStage,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { SECTORS } from "@/lib/content";
import { GsapWindowReveal } from "./GsapWindowReveal";

function SectorIcon({ id }: { id: string }) {
  switch (id) {
    case "empresas":
      return <Buildings size={22} weight="duotone" aria-hidden="true" />;
    case "eventos":
      return <MicrophoneStage size={22} weight="duotone" aria-hidden="true" />;
    case "ensino":
      return <GraduationCap size={22} weight="duotone" aria-hidden="true" />;
    case "cultura":
      return <UsersThree size={22} weight="duotone" aria-hidden="true" />;
    default:
      return <FilmSlate size={22} weight="duotone" aria-hidden="true" />;
  }
}

export function SectorsBento() {
  const [empresas, eventos, ensino, cultura, audiovisual] = SECTORS;

  return (
    <section
      aria-labelledby="atuacao-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="max-w-2xl">
        <h2
          id="atuacao-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Contextos atendidos pela nossa equipe
        </h2>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-ink-muted">
          Da rotina corporativa de equipes mistas até produções culturais e transmissões ao vivo em todo o país.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-6">
        <GsapWindowReveal mode="curtain" className="md:col-span-4">
          <article className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface-card">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-elevated">
              <Image
                src="/images/corporate-inclusion.jpg"
                alt="Profissionais surdos e ouvintes colaborando em reunião corporativa com apoio de intérprete de Libras."
                fill
                sizes="(min-width: 768px) 62vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="inline-flex items-center gap-2 text-brand-text">
                  <SectorIcon id={empresas.id} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {empresas.highlight}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                  {empresas.title}
                </h3>
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
                  {empresas.description}
                </p>
              </div>
            </div>
          </article>
        </GsapWindowReveal>

        <GsapWindowReveal delay={0.05} className="md:col-span-2">
          <article className="flex h-full flex-col justify-between rounded-md bg-surface-contrast p-6 text-ink-contrast sm:p-7">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-brand/20 text-brand-text">
                <SectorIcon id={eventos.id} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold">
                {eventos.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-contrast/80">
                {eventos.description}
              </p>
            </div>
            <p className="mt-6 border-t border-ink-contrast/15 pt-4 text-xs font-semibold uppercase tracking-wider text-brand-text">
              {eventos.highlight}
            </p>
          </article>
        </GsapWindowReveal>

        <GsapWindowReveal delay={0.08} className="md:col-span-2">
          <article className="flex h-full flex-col justify-between rounded-md border border-border bg-surface-card p-6 sm:p-7">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-brand-soft text-brand-text">
                <SectorIcon id={ensino.id} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {ensino.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {ensino.description}
              </p>
            </div>
            <p className="mt-6 text-xs font-semibold text-brand-text">
              {ensino.highlight}
            </p>
          </article>
        </GsapWindowReveal>

        <GsapWindowReveal delay={0.11} className="md:col-span-2">
          <article className="flex h-full flex-col justify-between rounded-md border border-border bg-surface-elevated p-6 sm:p-7">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-surface-card text-brand-text">
                <SectorIcon id={cultura.id} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {cultura.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {cultura.description}
              </p>
            </div>
            <p className="mt-6 text-xs font-semibold text-brand-text">
              {cultura.highlight}
            </p>
          </article>
        </GsapWindowReveal>

        <GsapWindowReveal delay={0.14} className="md:col-span-2">
          <article className="flex h-full flex-col justify-between rounded-md border border-brand/35 bg-brand-soft p-6 sm:p-7">
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-surface-card text-brand-text">
                <SectorIcon id={audiovisual.id} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {audiovisual.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {audiovisual.description}
              </p>
            </div>
            <p className="mt-6 text-xs font-semibold text-brand-text">
              {audiovisual.highlight}
            </p>
          </article>
        </GsapWindowReveal>
      </div>
    </section>
  );
}
