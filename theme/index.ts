export type ThemeMode = "light" | "dark";

export interface BodyThemeConfiguration {
  backgroundColor: string;
  textColor: string;
}

export interface AppTheme {
  body: BodyThemeConfiguration;
}
