"use client";

import dynamic from "next/dynamic";

/* WebGL only runs in the browser; keep it out of the server bundle. */
export const HeroSceneLazy = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export const SigningHandLazy = dynamic(() => import("./SigningHand"), {
  ssr: false,
  loading: () => null,
});
