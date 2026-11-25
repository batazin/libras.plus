import { ArrowSquareOut, InstagramLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { QuoteForm } from "@/components/QuoteForm";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solicitar Orçamento | Libras Plus",
  description:
    "Solicite orçamento para tradução e interpretação em Libras, tire dúvidas frequentes e acesse os canais diretos da Libras Plus.",
};

export default function OrcamentoPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <main>
        <PageHeader
          currentPage="Orçamento"
          title="Solicite um orçamento"
          description="Compartilhe os detalhes do seu evento, reunião corporativa ou produção audiovisual para dimensionarmos a equipe ideal."
        />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Dados da demanda
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                Preencha o formulário abaixo com data, duração e formato previsto.
              </p>

              <div className="mt-6">
                <QuoteForm />
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Perguntas frequentes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                Dúvidas comuns sobre prazos, atuação em dupla e documentação fiscal.
              </p>

              <div className="mt-6">
                <FaqAccordion />
              </div>

              <div className="mt-8 rounded-md border border-border bg-surface-elevated/60 p-6">
                <h3 className="font-display text-lg font-bold text-ink">
                  Canais oficiais
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                  <li className="flex items-center gap-2.5">
                    <MapPin size={18} weight="duotone" aria-hidden="true" className="text-brand-text" />
                    <span>{BRAND.city} e atendimento remoto nacional</span>
                  </li>
                  <li>
                    <a
                      href={BRAND.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 font-medium text-ink transition-colors hover:text-brand-text"
                    >
                      <InstagramLogo size={18} weight="duotone" aria-hidden="true" className="text-brand-text" />
                      <span>{BRAND.instagramHandle}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={BRAND.linktreeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 font-medium text-ink transition-colors hover:text-brand-text"
                    >
                      <ArrowSquareOut size={18} weight="duotone" aria-hidden="true" className="text-brand-text" />
                      <span>linktr.ee/libras.plus</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
