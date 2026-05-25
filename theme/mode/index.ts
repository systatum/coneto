import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeMode = keyof typeof themes;

export * from "./creator";
export * from "./dark";
export * from "./light";
