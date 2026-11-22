"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference.
 *
 * Motion's `useReducedMotion` reads the media query during the first client
 * render, so components that render a different (completed) state under
 * reduced motion no longer match the server HTML (React error #418). This
 * returns `false` for the server render and hydration, then the real value
 * immediately after, and stays in sync if the user changes the setting.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
