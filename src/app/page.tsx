import { Footer } from "@/components/Footer";
import { GsapWindowShowcase } from "@/components/GsapWindowShowcase";
import { HeroSection } from "@/components/HeroSection";
import { HomeHighlights } from "@/components/HomeHighlights";
import { Navbar } from "@/components/Navbar";
import { TrustStrip } from "@/components/TrustStrip";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-ink"
      >
        Ir para o conteúdo principal
      </a>

      <Navbar />

      <main id="conteudo-principal">
        <HeroSection />
        <TrustStrip />
        <GsapWindowShowcase />
        <HomeHighlights />
      </main>

      <Footer />
    </div>
  );
}
