import {
  Broadcast,
  BookOpenText,
  Scales,
  UsersThree,

} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { TRUST_PILLARS } from "@/lib/content";
import { GsapWindowReveal } from "./GsapWindowReveal";
import { SpotlightGrid } from "./effects/SpotlightGrid";
import { TiltCard } from "./effects/TiltCard";

const ICONS: Icon[] = [Broadcast, Scales, UsersThree, BookOpenText];

export function TrustStrip() {
  return (
    <section aria-label="Diferenciais operacionais" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GsapWindowReveal mode="stagger3d">
        <SpotlightGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((pillar, index) => {
            const IconCmp = ICONS[index % ICONS.length];
            return (
              <div key={pillar.title} data-reveal-item className="h-full">
              <TiltCard className="h-full rounded-md" max={12}>
              <div className="spotlight-item group relative h-full overflow-hidden rounded-md border border-border bg-surface-card p-6">
                <span className="grid size-11 place-items-center rounded-sm bg-brand-soft text-brand-text transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <IconCmp size={22} weight="duotone" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-base font-bold text-ink">
                  {pillar.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {pillar.description}
                </p>
              </div>
              </TiltCard>
              </div>
            );
          })}
        </SpotlightGrid>
        </GsapWindowReveal>
      </div>
    </section>
  );
}
