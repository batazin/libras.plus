import { TRUST_PILLARS } from "@/lib/content";

export function TrustStrip() {
  return (
    <section
      aria-label="Diferenciais operacionais"
      className="border-y border-border bg-surface-elevated/50"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {TRUST_PILLARS.map((pillar, index) => (
            <div
              key={pillar.title}
              className={
                index > 0
                  ? "lg:border-l lg:border-border lg:pl-8 lg:pr-6"
                  : "lg:pr-6"
              }
            >
              <h2 className="font-display text-base font-bold text-ink">
                {pillar.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
