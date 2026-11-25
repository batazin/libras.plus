import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface PageHeaderProps {
  currentPage: string;
  title: string;
  description: string;
}

export function PageHeader({
  currentPage,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-surface-elevated/55">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <nav aria-label="Caminho de navegação" className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Início
          </Link>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
          <span className="text-brand-text">{currentPage}</span>
        </nav>

        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
