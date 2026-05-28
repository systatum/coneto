import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import { AppTheme, BodyThemeConfig } from "./index";
import { ThemeMode, themes as builtinThemes } from "./mode";
import { getRegistry, notifyThemeChange, subscribeTheme } from "./registry";

interface ThemeContextValue {
  mode: ThemeMode | string;
  themes?: Record<string, AppTheme>;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  themes: builtinThemes,
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

let _mode: ThemeMode | string = "light";
let _themes: Record<string, AppTheme> = getRegistry();

// Outside React tree — use the snapshot (imperative)
export function getThemeSnapshot() {
  return { mode: _mode, themes: _themes };
}

export function ThemeProvider({
  mode,
  children,
  themes: themesContent,
}: {
  mode: ThemeMode | string;
  children: React.ReactNode;
  themes?: Record<string, AppTheme>;
}) {
  // If caller passes explicit themes prop, use it; otherwise pull from registry.
  // useState so re-renders happen when registry changes.
  const [registrySnapshot, setRegistrySnapshot] = useState<
    Record<string, AppTheme>
  >(() => themesContent ?? getRegistry());

  document.body.setAttribute("data-theme", mode);

  useEffect(() => {
    // If a fixed themes override is provided, skip registry subscription
    if (themesContent) {
      setRegistrySnapshot(themesContent);
      return;
    }

    // Re-read registry whenever createTheme() is called
    const unsub = subscribeTheme(() => {
      setRegistrySnapshot({ ...getRegistry() });
    });

    return unsub;
  }, [themesContent]);

  useEffect(() => {
    _mode = mode;
    _themes = registrySnapshot;

    notifyThemeChange();
  }, [mode]);

  const themes = registrySnapshot;
  const theme = themes[mode] ?? themes["light"];

  return (
    <ThemeContext.Provider value={{ mode, themes }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const { mode, themes } = useThemeMode();
  const currentTheme = themes?.[mode];

  return {
    currentTheme,
    mode,
  };
}

export function Theme({
  mode,
  children,
  themes: themesContent,
}: {
  mode: ThemeMode | string;
  children: React.ReactNode;
  themes?: Record<string, AppTheme>;
}) {
  const theme = themesContent?.[mode];

  return (
    <ThemeProvider mode={mode} themes={themesContent}>
      <BodyWrapper $theme={theme?.body}>{children}</BodyWrapper>
    </ThemeProvider>
  );
}

const BodyWrapper = styled.div<{
  $theme: BodyThemeConfig;
}>`
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background-color: ${({ $theme }) => $theme?.backgroundColor || "transparent"};
  color: ${({ $theme }) => $theme?.textColor || "inherit"};

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
`;

export * from "./registry";
