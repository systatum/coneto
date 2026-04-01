import { ButtonVariants } from "./../components/button";

export type ThemeMode = "light" | "dark";

export interface BodyThemeConfiguration {
  backgroundColor?: string;
  textColor?: string;
}

// avatar.tsx
export interface AvatarThemeConfiguration {
  borderColor?: string;
  textColor?: string;
  overlayBackground?: string;
  overlayIconColor?: string;
}

// badge.tsx
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

// boxbar.tsx
export interface BoxbarThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
  toggleButtonColor?: string;
  toggleButtonHoverColor?: string;
}

// button.tsx
export interface ButtonThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
  focusBackgroundColor?: string;
}

// card.tsx
export interface CardThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  headerBackground?: string;
  footerBackground?: string;
  closeIconColor?: string;
  closeIconHoverBackground?: string;
}

// choice-group.tsx
export interface ChoiceGroupThemeConfiguration {
  borderColor?: string;
  dividerColor?: string;
  labelColor?: string;
  backgroundColor?: string;
  descriptionColor?: string;
}

// checkbox.tsx
export interface CheckboxThemeConfiguration {
  borderColor?: string;
  checkedBorderColor?: string;
  backgroundColor?: string;
  checkedBackgroundColor?: string;
  iconColor?: string;
  labelColor?: string;
  descriptionColor?: string;
  highlightBackgroundColor?: string;
  highlightHoverColor?: string;
}

// error-slate.tsx
export interface ErrorSlateTheme {
  cubeFaceBackground?: string;
  cubeFaceBorder?: string;
  cubeFaceText?: string;
  titleColor?: string;
}

// grid.tsx
export interface GridTheme {
  cardBackgroundColor?: string;
  cardHoverBackgroundColor?: string;
  cardSelectedBackgroundColor?: string;
  cardBorderColor?: string;
  cardShadow?: string;
  thumbnailBackgroundColor?: string;
}

// keynote.tsx
export interface KeynoteTheme {
  keyColor?: string;
  valueColor?: string;
}

// radio.tsx
export interface RadioThemeConfiguration {
  borderColor?: string;
  checkedBorderColor?: string;
  backgroundColor?: string;
  checkedBackgroundColor?: string;
  iconColor?: string;
  labelColor?: string;
  descriptionColor?: string;
  highlightBackgroundColor?: string;
  highlightHoverColor?: string;
}

// separator.tsx
export interface SeparatorTheme {
  containerColor?: string;
  lineColor?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
}

export interface AppTheme {
  body: BodyThemeConfiguration;

  avatar: AvatarThemeConfiguration;
  badge: BadgeThemeConfiguration;
  boxbar: BoxbarThemeConfiguration;
  button: Record<ButtonVariants["variant"], ButtonThemeConfiguration>;
  card: CardThemeConfiguration;
  choiceGroup: ChoiceGroupThemeConfiguration;
  checkbox: CheckboxThemeConfiguration;
  errorSlate: ErrorSlateTheme;
  grid: GridTheme;
  keynote: KeynoteTheme;
  radio: RadioThemeConfiguration;
  separator: SeparatorTheme;
}
