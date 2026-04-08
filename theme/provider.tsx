import React, { createContext, useContext } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { AppTheme, ThemeMode } from "./index";
import { themes } from "./themes";

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

export function ThemeProvider({
  mode,
  children,
  themes: themesContent = themes,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
  themes?: Record<string, AppTheme>;
}) {
  _mode = mode;
  _themes = themesContent;

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
