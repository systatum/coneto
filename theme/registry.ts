// theme/registry.ts
import { AppTheme } from "./index";
import { themes as builtinThemes } from "./mode";

// Starts pre-loaded with "light" and "dark"
const themeRegistry: Record<string, AppTheme> = { ...builtinThemes };

// Internal subscriber list for theme change events.
// These listeners are used by external systems (e.g. portals, dialogs, or
// manually mounted React roots) that exist outside the normal React context tree.
let listeners: (() => void)[] = [];

export function registerTheme(name: string, theme: AppTheme) {
  themeRegistry[name] = theme;
  listeners.forEach((cb) => cb());
}

export function getRegistry(): Record<string, AppTheme> {
  return themeRegistry;
}

/**
 * Subscribe to theme changes.
 *
 * This is used for external React roots or non-context consumers that need
 * to react to theme updates (since they cannot rely on React context directly).
 *
 * Returns an unsubscribe function to remove the listener.
 */
export function subscribeTheme(cb: () => void) {
  listeners.push(cb);

  return () => {
    // Remove the callback from the listener list to prevent memory leaks
    // and avoid triggering updates for unmounted consumers.
    listeners = listeners.filter((l) => l !== cb);
  };
}

/**
 * Notify all subscribers that the theme has changed.
 *
 * This is typically called after updating internal theme state,
 * ensuring all external consumers (dialogs, portals, etc.) stay in sync.
 */
export function notifyThemeChange() {
  listeners.forEach((cb) => cb());
}
