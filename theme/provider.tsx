import React, { createContext, useContext } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { themes } from "./themes";
import { ThemeMode } from "./index";

interface ThemeContextValue {
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
}) {
  const theme = themes[mode];

  return (
    <ThemeContext.Provider value={{ mode }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
