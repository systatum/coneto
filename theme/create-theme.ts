import {
  AppTheme,
  ThemeMode,
  themes as builtinThemes,
  getRegistry,
  registerTheme,
} from "./../theme";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };

  for (const key in source) {
    const targetValue = output[key];
    const sourceValue = source[key];

    if (
      typeof targetValue === "object" &&
      targetValue !== null &&
      typeof sourceValue === "object" &&
      sourceValue !== null &&
      !Array.isArray(sourceValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return output;
}

export function createTheme(
  themeName: string,
  baseTheme: ThemeMode = "light",
  customizations: Partial<AppTheme> = {}
) {
  const base: AppTheme =
    getRegistry()[baseTheme] ??
    builtinThemes[baseTheme] ??
    builtinThemes["light"];

  const resolved: AppTheme = deepMerge(base, customizations);

  registerTheme(themeName, resolved);
}
