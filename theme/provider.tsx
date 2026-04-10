import React, { createContext, useContext, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { AppTheme, ThemeMode } from "./index";
import { themes } from "./mode";

interface ThemeContextValue {
  mode: ThemeMode;
  themes?: Record<string, AppTheme>;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

let _mode: ThemeMode = "light";
let _themes: Record<string, AppTheme> = themes;

// Outside React tree — use the snapshot (imperative)
export function getThemeSnapshot() {
  return { mode: _mode, themes: _themes };
}

// Internal subscriber list for theme change events.
// These listeners are used by external systems (e.g. portals, dialogs, or
// manually mounted React roots) that exist outside the normal React context tree.
let listeners: (() => void)[] = [];

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

export function ThemeProvider({
  mode,
  children,
  themes: themesContent = themes,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
  themes?: Record<string, AppTheme>;
}) {
  useEffect(() => {
    _mode = mode;
    _themes = themesContent;

    notifyThemeChange();
  }, [mode, themesContent]);

  const theme = themesContent[mode];

  return (
    <ThemeContext.Provider value={{ mode, themes: themesContent }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const { mode, themes } = useThemeMode();
  const currentTheme = themes[mode];

  return {
    currentTheme,
    mode,
  };
}
