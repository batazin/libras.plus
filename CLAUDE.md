# Libras Plus — regras do projeto

Site institucional da Libras Plus (tradução e interpretação em Libras).
Next.js 15 (App Router) + Tailwind 4 + GSAP + three.js / @react-three/fiber. Gerenciador: pnpm.

## Regras de design (definidas pelo cliente — seguir sempre)

1. **Cantos pouco arredondados.** Nada de cantos grandes nem botões em formato de pílula.
   - Cards, imagens, blocos: `rounded-md` (6px) no máximo.
   - Botões, inputs, caixas de ícone: `rounded-sm` (4px).
   - `rounded-full` só para círculos de verdade (pontinhos indicadores, logo).
   - Em clip-path do GSAP, usar `round 6px` no máximo.
2. **Sem tags/badges em formato de pílula.** Não usar rótulos pequenos com fundo/borda
   arredondada (ex.: "● Interpretação ao vivo", "Tradução e interpretação em Libras",
   "REC", selos flutuantes). Se precisar de um rótulo, usar texto simples.
3. **3D e efeitos têm que ter relação com o tema** (Libras, mãos, comunicação, intérprete).
   Nada de formas geométricas aleatórias.
4. **A home deve ser chamativa e inovadora**, com efeitos interativos e passivos, sem
   parecer template genérico.
5. **Acessibilidade:** respeitar `prefers-reduced-motion`, canvases 3D com `aria-hidden`
   e descrição em texto (`sr-only`), contraste de texto sobre imagem garantido por overlay.
6. **Mobile mantém o máximo de efeito possível.** Efeitos que dependem do mouse usam
   `onMotion` de `src/lib/motionInput.ts` (mouse no desktop, giroscópio no celular, drift
   automático como fallback) em vez de `pointermove`. A palavra gigante do topo fica em
   **uma linha só** também no celular (não quebrar em duas linhas).
   No celular, não animar elementos dentro de `<mask>` SVG (Safari/iOS não redesenha):
   para zoom, animar o `viewBox` (ver HeroSection, só no mobile).
   **Ajustes pedidos para o mobile não podem alterar o desktop.**
7. **Nunca causar scroll horizontal** (`html, body { overflow-x: clip }` já está no globals.css;
   elementos rotacionados/escalados ficam dentro de um container com `overflow-hidden`).

## Estrutura útil

- `src/components/three/SigningHand.tsx` — mão 3D realista (modelo `public/models/hand-right.glb`,
  licença em `public/models/LICENSE-hand.md`). Letras em `HANDSHAPES`.
- `src/components/effects/` — TiltCard, Magnetic, SpotlightGrid.
- Cores/tokens em `src/app/globals.css` (`--brand`, `--surface`, …), com tema claro/escuro.
