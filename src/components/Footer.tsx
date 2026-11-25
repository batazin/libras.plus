import { InstagramLogo, LinkSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-border">
                <Image
                  src="/images/logo-libras-plus.png"
                  alt="Logo Libras Plus"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-cover"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-ink">
                  LIBRAS <span className="text-brand-text">PLUS</span>
                </span>
                <span className="text-xs text-ink-muted">{BRAND.subtitle}</span>
              </span>
            </Link>

            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
              Serviços de tradução, interpretação em Libras e acessibilidade comunicacional para empresas, eventos, instituições de ensino e setor público.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display text-sm font-bold text-ink">
              Páginas
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/orcamento"
                  className="text-sm font-semibold text-brand-text hover:underline"
                >
                  {BRAND.primaryCta}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-display text-sm font-bold text-ink">
              Canais e localização
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2.5">
                <MapPin size={18} weight="duotone" aria-hidden="true" className="shrink-0 text-brand-text" />
                <span>{BRAND.city} e atendimento remoto nacional</span>
              </li>
              <li>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                >
                  <InstagramLogo size={18} weight="duotone" aria-hidden="true" className="shrink-0 text-brand-text" />
                  <span>{BRAND.instagramHandle}</span>
                </a>
              </li>
              <li>
                <a
                  href={BRAND.linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                >
                  <LinkSimple size={18} weight="duotone" aria-hidden="true" className="shrink-0 text-brand-text" />
                  <span>linktr.ee/libras.plus</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
          </p>
          <p>Tradução, interpretação e inclusão em Libras.</p>
        </div>
      </div>
    </footer>
  );
}
