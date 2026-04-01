import { ButtonVariants } from "./../components/button";

export type ThemeMode = "light" | "dark";

export interface BodyThemeConfiguration {
  backgroundColor?: string;
  textColor?: string;
}

// Avatar.tsx
export interface AvatarThemeConfiguration {
  borderColor?: string;
  textColor?: string;
  overlayBackground?: string;
  overlayIconColor?: string;
}

// Badge.tsx
export interface BadgeThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
  circleColor?: string;
  action?: {
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
    focusRingColor?: string;
    disabledOpacity?: number;
  };
}

// Boxbar.tsx
export interface BoxbarThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
  toggleButtonColor?: string;
  toggleButtonHoverColor?: string;
}

// Button.tsx
export interface ButtonThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
  focusBackgroundColor?: string;
}

export interface AppTheme {
  body: BodyThemeConfiguration;
  avatar: AvatarThemeConfiguration;
  badge: BadgeThemeConfiguration;
  button: Record<ButtonVariants["variant"], ButtonThemeConfiguration>;
  boxbar: BoxbarThemeConfiguration;
}
