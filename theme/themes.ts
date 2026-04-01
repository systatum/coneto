import { AppTheme, BodyThemeConfiguration } from "./index";

function createBodyTheme(
  custom: Partial<BodyThemeConfiguration> = {}
): BodyThemeConfiguration {
  return {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    ...custom,
  };
}

const lightBody = createBodyTheme();

export const lightTheme: AppTheme = {
  body: lightBody,
};

const darkBody = createBodyTheme({
  backgroundColor: "#111",
  textColor: "#fff",
});

export const darkTheme: AppTheme = {
  body: darkBody,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
