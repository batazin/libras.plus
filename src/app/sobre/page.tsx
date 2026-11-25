import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { ProcessSection } from "@/components/ProcessSection";

export const metadata: Metadata = {
  title: "Sobre | Libras Plus",
  description:
    "Conheça a Libras Plus, nossa missão em acessibilidade comunicacional e metodologia de trabalho em São Carlos - SP e todo o Brasil.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <main>
        <PageHeader
          currentPage="Sobre"
          title="Sobre a Libras Plus"
          description="Sediada em São Carlos - SP, a Libras Plus atua para tornar eventos, empresas, conteúdos digitais e instituições acessíveis em Língua Brasileira de Sinais."
        />

        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Comunicação acessível com preparação e responsabilidade
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                Cada contexto traz termos específicos, ritmo próprio e necessidades distintas de enquadramento ou mediação. Por isso, trabalhamos com planejamento prévio junto ao cliente e respeito integral à cultura surda.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                Realizamos atendimentos presenciais em São Carlos e região, além de interpretações remotas e gravações de janela de Libras em estúdio para projetos em todo o país.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-surface-elevated">
                <Image
                  src="/images/studio-translation.jpg"
                  alt="Estúdio de gravação da Libras Plus preparado para tradução audiovisual em janela de Libras."
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <ProcessSection />
      </main>

      <Footer />
    </div>
  );
}
