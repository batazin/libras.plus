"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let configured = false;

/**
 * Shared ScrollTrigger setup for the pinned sections.
 *
 * Touch-only devices: `normalizeScroll` routes the native momentum scroll
 * through ScrollTrigger, so pinned sections don't jump when they pin or
 * unpin and the mobile address bar doesn't resize the page mid-scroll.
 * Desktop scrolling is left untouched.
 */
export function setupScroll() {
  if (configured || typeof window === "undefined") return;
  configured = true;
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (ScrollTrigger.isTouch === 1) {
    ScrollTrigger.normalizeScroll(true);
  }
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Ask for one ScrollTrigger refresh. Several sections call this as they
 * finish setting up; the calls are merged into a single refresh so the
 * page doesn't jump repeatedly right after load.
 */
export function requestRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
}
