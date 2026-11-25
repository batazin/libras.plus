import { Sparkle } from "@phosphor-icons/react/dist/ssr";

const ITEMS = [
  "Interpretação simultânea",
  "Janela de Libras",
  "Eventos e congressos",
  "Tradução audiovisual",
  "Lives e transmissões",
  "Integrações de RH",
  "Bancas acadêmicas",
  "Espetáculos e cultura",
] as const;

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="marquee-track flex shrink-0 items-center gap-10 pr-10"
    >
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            {item}
          </span>
          <Sparkle
            size={22}
            weight="fill"
            aria-hidden="true"
            className="marquee-spark text-brand"
          />
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <section aria-label="Serviços em destaque" className="overflow-hidden py-6">
      {/* the tilted band is wider than the screen; the section clips it */}
      <div className="marquee group relative -mx-8 -rotate-1 border-y border-border bg-surface-card py-6">
        <div className="flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
