import type { Metadata } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/dm-sans";
import { VLibrasWidget } from "@/components/VLibrasWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Libras Plus | Tradução e Interpretação em Libras",
  description:
    "Serviços de tradução, interpretação em Libras e acessibilidade comunicacional para eventos, empresas, ensino e setor público. São Carlos - SP e todo o Brasil.",
  icons: {
    icon: "/images/logo-libras-plus.png",
  },
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('libras-plus-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-surface text-ink antialiased selection:bg-brand selection:text-brand-ink">
        {children}
        <VLibrasWidget />
      </body>
    </html>
  );
}
