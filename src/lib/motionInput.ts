"use client";

/**
 * One motion source for every interactive effect.
 *
 * - Desktop: the mouse position.
 * - Phones/tablets: the gyroscope (tilting the device). iOS asks for
 *   permission, which is requested on the first touch.
 * - Touch devices without gyroscope data: a slow automatic drift, so
 *   the effects never look frozen.
 *
 * Values are normalised to roughly -0.5 … 0.5 on both axes.
 */
type Listener = (x: number, y: number) => void;

const listeners = new Set<Listener>();
let started = false;
let lastGyro = 0;
let base: { beta: number; gamma: number } | null = null;
let driftRaf = 0;

const emit = (x: number, y: number) => listeners.forEach((l) => l(x, y));
const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));

export function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function onPointer(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  emit(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
}

function onOrientation(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return;
  // first reading becomes the neutral position (however the phone is held)
  if (!base) base = { beta: e.beta, gamma: e.gamma };
  lastGyro = performance.now();
  emit(clamp((e.gamma - base.gamma) / 50), clamp((e.beta - base.beta) / 50));
}

function requestIOSPermission() {
  const DOE = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  if (typeof DOE?.requestPermission !== "function") return;
  DOE.requestPermission()
    .then((state) => {
      if (state === "granted") window.addEventListener("deviceorientation", onOrientation);
    })
    .catch(() => {});
}

function startDrift() {
  const t0 = performance.now();
  const loop = (now: number) => {
    // only drift while the gyroscope is silent
    if (now - lastGyro > 1500) {
      const t = (now - t0) / 1000;
      emit(Math.sin(t * 0.45) * 0.35, Math.cos(t * 0.32) * 0.25);
    }
    driftRaf = requestAnimationFrame(loop);
  };
  driftRaf = requestAnimationFrame(loop);
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener("pointermove", onPointer, { passive: true });

  if (isTouchDevice()) {
    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("touchend", requestIOSPermission, { once: true });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) startDrift();
  }
}

/** Subscribe to motion; returns the unsubscribe function. */
export function onMotion(listener: Listener) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
