"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (urlOrConfig: string | Record<string, unknown>) => unknown;
    };
  }
}

export function VLibrasWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const ensureDomAndInit = useCallback(() => {
    if (!containerRef.current) return;

    if (containerRef.current.childElementCount === 0) {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("vw", "");
      wrapper.className = "enabled";

      const accessButton = document.createElement("div");
      accessButton.setAttribute("vw-access-button", "");
      accessButton.className = "active";

      const pluginWrapper = document.createElement("div");
      pluginWrapper.setAttribute("vw-plugin-wrapper", "");

      const topWrapper = document.createElement("div");
      topWrapper.className = "vw-plugin-top-wrapper";

      pluginWrapper.appendChild(topWrapper);
      wrapper.appendChild(accessButton);
      wrapper.appendChild(pluginWrapper);
      containerRef.current.appendChild(wrapper);
    }

    if (
      !initializedRef.current &&
      typeof window !== "undefined" &&
      window.VLibras?.Widget
    ) {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    ensureDomAndInit();
  }, [ensureDomAndInit]);

  return (
    <>
      <div ref={containerRef} />
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={ensureDomAndInit}
      />
    </>
  );
}
