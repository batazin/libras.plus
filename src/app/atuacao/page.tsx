import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { SectorsBento } from "@/components/SectorsBento";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: "Áreas de Atuação | Libras Plus",
  description:
    "Atendimento em Libras para empresas, eventos, instituições de ensino, produções culturais, editais e setor público.",
};

export default function AtuacaoPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <main>
        <PageHeader
          currentPage="Atuação"
          title="Onde atuamos com acessibilidade comunicacional"
          description="Adaptamos escala, vocabulário técnico e formato de entrega conforme as exigências de cada setor."
        />

        <SectorsBento />

        <section className="border-t border-border bg-surface-elevated/50">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:py-16 lg:px-8">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-ink">
                Precisa de dimensionamento para o seu setor?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                Envie os detalhes do evento, reunião ou edital para receber uma proposta alinhada ao formato necessário.
              </p>
            </div>
            <Link
              href="/orcamento"
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-2 led-border rounded-sm bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-hover"
            >
              <span>{BRAND.primaryCta}</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
