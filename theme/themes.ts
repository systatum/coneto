import { ButtonVariants } from "./../components/button";
import {
  AppTheme,
  AvatarThemeConfiguration,
  BadgeThemeConfiguration,
  BodyThemeConfiguration,
  BoxbarThemeConfiguration,
  ButtonThemeConfiguration,
} from "./index";

// Body
export function createBodyThemes(
  customTheme: Partial<BodyThemeConfiguration> = {}
): BodyThemeConfiguration {
  const defaultTheme = {
    backgroundColor: "#ffffff",
    textColor: "#000000",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Avatar.tsx
export function createAvatarThemes(
  body: BodyThemeConfiguration,
  customTheme: Partial<AvatarThemeConfiguration> = {}
): AvatarThemeConfiguration {
  const defaultTheme = {
    borderColor: "#f3f4f6",
    textColor: body.textColor,
    overlayBackground: "rgba(0,0,0,0.5)",
    overlayIconColor: "#ffffff",
  };
  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Badge.tsx
export function createBadgeThemes(
  body: BodyThemeConfiguration,
  customTheme: Partial<BadgeThemeConfiguration> = {}
): BadgeThemeConfiguration {
  const defaultBackgroundColor = body.backgroundColor;
  const defaultTextColor = body.textColor;

  const defaultTheme: BadgeThemeConfiguration = {
    backgroundColor: defaultBackgroundColor,
    textColor: defaultTextColor,
    circleColor: "#111",

    action: {
      hoverBackgroundColor: "#d1d5db",
      activeBackgroundColor: "#9ca3af",
      focusRingColor: "#00000033",
      disabledOpacity: 0.4,
    },
  };

  return { ...defaultTheme, ...customTheme };
}

// Boxbar.tsx
export function createBoxbarThemes(
  body: BodyThemeConfiguration,
  customTheme: Partial<BoxbarThemeConfiguration> = {}
): BoxbarThemeConfiguration {
  const defaultTextColor = body.textColor;

  const defaultTheme: BoxbarThemeConfiguration = {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    toggleButtonColor: defaultTextColor,
    toggleButtonHoverColor: "#555555",
    textColor: "#000000",
  };

  return { ...defaultTheme, ...customTheme };
}

// Button.tsx
export function createButtonThemes(
  body: BodyThemeConfiguration,
  customVariants: Partial<
    Record<ButtonVariants["variant"], ButtonThemeConfiguration>
  > = {}
): Record<string, ButtonThemeConfiguration> {
  const defaultTextColor = body.textColor;

  const variants: Record<string, ButtonThemeConfiguration> = {
    default: {
      backgroundColor: "#ececec",
      textColor: defaultTextColor,
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      textDecoration: "none",
    },
  };

  return { ...variants, ...customVariants };
}

// Light
const lightBody = createBodyThemes();

const lightAvatar = createAvatarThemes(lightBody, {
  borderColor: "#e5e7eb",
  overlayBackground: "rgba(0,0,0,0.4)",
});

const lightBadge = createBoxbarThemes(lightBody);

const lightBoxbar = createBoxbarThemes(lightBody);

const lightButton = createButtonThemes(lightBody, {
  primary: {
    backgroundColor: "#569aec",
    textColor: "white",
    hoverBackgroundColor: "#3e7dd3",
    activeBackgroundColor: "#2a73c3",
    focusBackgroundColor: "#569AEC80",
  },
  danger: {
    backgroundColor: "#ce375d",
    textColor: "white",
    hoverBackgroundColor: "#a12f4b",
    activeBackgroundColor: "#802036",
    focusBackgroundColor: "#CE375D80",
  },
  success: {
    backgroundColor: "#42A340",
    textColor: "white",
    hoverBackgroundColor: "#2B8C29",
    activeBackgroundColor: "#146512",
    focusBackgroundColor: "#0f4f0e",
  },
  secondary: {
    backgroundColor: "#dddddd",
    textColor: lightBody.textColor,
    hoverBackgroundColor: "#cccccc",
    activeBackgroundColor: "#b3b3b3",
    focusBackgroundColor: "#B4B4B480",
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: lightBody.textColor,
    hoverBackgroundColor: "#f3f3f3",
    activeBackgroundColor: "#eaeaea",
    focusBackgroundColor: "#00000033",
  },
  link: {
    backgroundColor: "transparent",
    textColor: "#408ee8",
    hoverBackgroundColor: "#2a73c3",
    activeBackgroundColor: "#1e5ba8",
    focusBackgroundColor: "#408EE880",
    textDecoration: "underline",
  },
  transparent: {
    backgroundColor: "transparent",
    textColor: lightBody.textColor,
    hoverBackgroundColor: "#f0f0f0",
    activeBackgroundColor: "#cfcfcf",
    focusBackgroundColor: "#cfcfcf",
  },
  "outline-default": {
    backgroundColor: "white",
    textColor: "#9b9b9b",
    hoverBackgroundColor: "#f0f0f0",
    activeBackgroundColor: "#e6e6e6",
    focusBackgroundColor: "#00000040",
    borderColor: "#9b9b9b",
  },
  "outline-primary": {
    backgroundColor: "white",
    textColor: "#569aec",
    hoverBackgroundColor: "#e6f0ff",
    activeBackgroundColor: "#cce0ff",
    focusBackgroundColor: "#569AEC80",
    borderColor: "#569aec",
  },
  "outline-danger": {
    backgroundColor: "white",
    textColor: "#ce375d",
    hoverBackgroundColor: "#fce0eb",
    activeBackgroundColor: "#f9c0d2",
    focusBackgroundColor: "#CE375D80",
    borderColor: "#ce375d",
  },
  "outline-success": {
    backgroundColor: "white",
    textColor: "#42A340",
    hoverBackgroundColor: "#e6f2e6",
    activeBackgroundColor: "#cce0cc",
    focusBackgroundColor: "#0f4f0e",
    borderColor: "#42A340",
  },
});

export const lightTheme: AppTheme = {
  body: lightBody,
  avatar: lightAvatar,
  badge: lightBadge,
  button: lightButton,
  boxbar: lightBoxbar,
};

// Dark
const darkBody = createBodyThemes({
  backgroundColor: "#111",
  textColor: "#fff",
});

const darkAvatar = createAvatarThemes(darkBody, {
  textColor: "#f9fafb",
  overlayBackground: "rgba(0,0,0,0.6)",
});

const darkButton = createButtonThemes(darkBody);

const darkBadge = createBadgeThemes(darkBody, {
  backgroundColor: "#1f2937",
  textColor: "#f9fafb",
  borderColor: "#374151",
  circleColor: "#f9fafb",
  action: {
    hoverBackgroundColor: "#374151",
    activeBackgroundColor: "#4b5563",
    focusRingColor: "#ffffff33",
    disabledOpacity: 0.4,
  },
});

const darkBoxbar = createBoxbarThemes(darkBody, {
  backgroundColor: "#111",
  borderColor: "#333333",
  toggleButtonColor: "#f5f5f5",
  toggleButtonHoverColor: "#ccc",
});

export const darkTheme: AppTheme = {
  body: darkBody,
  avatar: darkAvatar,
  badge: darkBadge,
  button: darkButton,
  boxbar: darkBoxbar,
};

// Themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
