"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { FAQS } from "@/lib/content";

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string>(FAQS[0].id);

  return (
    <div className="space-y-3">
      {FAQS.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-md border border-border bg-surface-card transition-colors"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              id={`faq-trigger-${item.id}`}
              onClick={() => setOpenId(isOpen ? "" : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="font-display text-base font-semibold text-ink">
                {item.question}
              </span>
              <CaretDown
                size={18}
                weight="bold"
                aria-hidden="true"
                className={`shrink-0 text-brand-text transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                className="border-t border-border/70 px-5 py-4 text-sm leading-relaxed text-ink-muted"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
