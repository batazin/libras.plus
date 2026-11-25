import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { TRUST_PILLARS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Serviços | Libras Plus",
  description:
    "Interpretação simultânea e consecutiva, janela de Libras em estúdio, acessibilidade corporativa e eventos acadêmicos em São Carlos e todo o Brasil.",
};

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <main>
        <PageHeader
          currentPage="Serviços"
          title="Serviços de tradução e interpretação em Libras"
          description="Soluções técnicas para eventos presenciais, transmissões online, vídeos institucionais e rotinas corporativas."
        />

        <ServicesShowcase />

        <section
          aria-labelledby="normas-heading"
          className="border-t border-border bg-surface-elevated/50"
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <h2
              id="normas-heading"
              className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Padrão técnico adotado em cada entrega
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_PILLARS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface-card p-6"
                >
                  <h3 className="font-display text-lg font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
