"use client";

import { useRef, useState } from "react";
import type { HandControl } from "./three/SigningHand";
import { SigningHandLazy } from "./three/HeroSceneLazy";

const WORD = "LIBRAS";

/** 3D hand fingerspelling L-I-B-R-A-S, with clickable letters. */
export function HandSpeller() {
  const [active, setActive] = useState(-1);
  const control = useRef<HandControl>({ jump: null });

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-square w-full max-w-[520px]">
        {/* halo behind the hand */}
        <div
          aria-hidden="true"
          className="hand-halo absolute inset-[12%] rounded-full"
        />
        <div
          aria-hidden="true"
          className="hand-ring absolute inset-[6%] rounded-full border border-dashed border-brand/30"
        />
        <SigningHandLazy
          mode="spell"
          word={WORD}
          control={control}
          onLetter={setActive}
        />
        <p className="sr-only">
          Mão em 3D soletrando a palavra LIBRAS no alfabeto manual da Língua
          Brasileira de Sinais.
        </p>
      </div>

      <div className="relative -mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-card/85 p-1.5 shadow-lg backdrop-blur">
          {WORD.split("").map((letter, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Mostrar a letra ${letter} em Libras`}
              aria-pressed={active === i}
              onClick={() => {
                control.current.jump = i;
              }}
              className={`grid size-10 place-items-center rounded-sm font-display text-lg font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand sm:size-11 ${
                active === i
                  ? "-translate-y-1 scale-110 bg-brand text-brand-ink shadow-[0_8px_24px_-6px_var(--brand)]"
                  : "text-ink-muted hover:bg-brand-soft hover:text-ink"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-muted">
          Alfabeto manual de Libras · clique numa letra
        </p>
      </div>
    </div>
  );
}
