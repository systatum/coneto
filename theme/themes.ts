import { ButtonVariants } from "./../components/button";
import {
  AppTheme,
  AvatarThemeConfiguration,
  BadgeThemeConfiguration,
  BodyThemeConfiguration,
  BoxbarThemeConfiguration,
  ButtonThemeConfiguration,
  CardThemeConfiguration,
  CheckboxThemeConfiguration,
  ChoiceGroupThemeConfiguration,
  ErrorSlateTheme,
  GridTheme,
  KeynoteTheme,
  RadioThemeConfiguration,
  SeparatorTheme,
} from "./index";

// Body
export function createBodyTheme(
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

// avatar.tsx
export function createAvatarTheme(
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

// badge.tsx
export function createBadgeTheme(
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

// boxbar.tsx
export function createBoxbarTheme(
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

// button.tsx
export function createButtonTheme(
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

// card.tsx
export function createCardTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<CardThemeConfiguration> = {}
): CardThemeConfiguration {
  const defaultTheme: CardThemeConfiguration = {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    titleColor: body.textColor,
    subtitleColor: "#8b8e92",
    headerBackground: "transparent",
    footerBackground: "transparent",
    closeIconColor: body.textColor,
    closeIconHoverBackground: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// choice-group.tsx
export function createChoiceGroupTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<ChoiceGroupThemeConfiguration> = {}
): ChoiceGroupThemeConfiguration {
  const defaultTheme: ChoiceGroupThemeConfiguration = {
    borderColor: "#e5e7eb",
    dividerColor: "#e5e7eb",
    labelColor: body.textColor,
    backgroundColor: "#fff",
    descriptionColor: "#4b5563",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// checkbox.tsx
export function createCheckboxTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<CheckboxThemeConfiguration> = {}
): CheckboxThemeConfiguration {
  const defaultTheme: CheckboxThemeConfiguration = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: "#ffffff",
    checkedBackgroundColor: "#61A9F9",
    iconColor: "#ffffff",
    labelColor: body.textColor,
    descriptionColor: "#4b5563",
    highlightBackgroundColor: "#DBEAFE",
    highlightHoverColor: "#E7F2FC",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// error-slate.tsx
export function createErrorSlateTheme(
  custom: Partial<ErrorSlateTheme> = {}
): ErrorSlateTheme {
  return {
    cubeFaceBackground: "#dd0b0b",
    cubeFaceBorder: "#a80000",
    cubeFaceText: "#ffffff",
    titleColor: "#111111",
    ...custom,
  };
}

// grid.tsx
export function createGridTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<GridTheme> = {}
): GridTheme {
  const defaultTheme: GridTheme = {
    cardBackgroundColor: "#ffffff",
    cardHoverBackgroundColor: "#f3f3f3",
    cardSelectedBackgroundColor: "#e6f0ff",
    cardBorderColor: "#e5e5e5",
    cardShadow: "0 1px 3px rgba(0,0,0,0.1)",
    thumbnailBackgroundColor: "#e5e5e5",
  };
  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// keynote.tsx
export function createKeynoteTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<KeynoteTheme> = {}
): KeynoteTheme {
  const defaultTheme: KeynoteTheme = {
    keyColor: "#374151",
    valueColor: "#111827",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// radio.tsx
export function createRadioTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<RadioThemeConfiguration> = {}
): RadioThemeConfiguration {
  const defaultTheme: RadioThemeConfiguration = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: "#ffffff",
    checkedBackgroundColor: "#61A9F9",
    iconColor: "#ffffff",
    labelColor: body.textColor,
    descriptionColor: "#4b5563",
    highlightBackgroundColor: "#DBEAFE",
    highlightHoverColor: "#E7F2FC",
  };

  return { ...defaultTheme, ...customTheme };
}

// separator.tsx
export function createSeparatorTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<SeparatorTheme> = {}
): SeparatorTheme {
  const defaultTheme: SeparatorTheme = {
    containerColor: "#6b7280",
    lineColor: "#111827",
    titleColor: "#111827",
    backgroundTitleColor: body?.backgroundColor,
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Light
const lightBody = createBodyTheme();

const lightAvatar = createAvatarTheme(lightBody, {
  borderColor: "#e5e7eb",
  overlayBackground: "rgba(0,0,0,0.4)",
});

const lightBadge = createBadgeTheme(lightBody);

const lightBoxbar = createBoxbarTheme(lightBody);

const lightButton = createButtonTheme(lightBody, {
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

const lightCard = createCardTheme(lightBody, {
  backgroundColor: "#ffffff",
  borderColor: "#e5e7eb",
  subtitleColor: "#8b8e92",
  closeIconHoverBackground: "#e5e7eb",
});

const lightChoiceGroup = createChoiceGroupTheme(lightBody);

const lightCheckbox = createCheckboxTheme(lightBody);

export const lightErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#dd0b0b",
  cubeFaceBorder: "#a80000",
  cubeFaceText: "#ffffff",
  titleColor: "#111111",
});

const lightGrid = createGridTheme(lightBody);

const lightKeynote = createKeynoteTheme(lightBody);

const lightRadio = createRadioTheme(lightBody);

const lightSeparator = createSeparatorTheme(lightBody);

const lightTheme: AppTheme = {
  body: lightBody,
  avatar: lightAvatar,
  badge: lightBadge,
  button: lightButton,
  boxbar: lightBoxbar,
  card: lightCard,
  choiceGroup: lightChoiceGroup,
  checkbox: lightCheckbox,
  errorSlate: lightErrorSlate,
  grid: lightGrid,
  keynote: lightKeynote,
  radio: lightRadio,
  separator: lightSeparator,
};

// Dark
const darkBody = createBodyTheme({
  backgroundColor: "#111",
  textColor: "#fff",
});

const darkAvatar = createAvatarTheme(darkBody, {
  textColor: "#f9fafb",
  overlayBackground: "rgba(0,0,0,0.6)",
});

const darkButton = createButtonTheme(darkBody, {
  primary: {
    backgroundColor: "#3e7dd3",
    textColor: "white",
    hoverBackgroundColor: "#2a5ea9",
    activeBackgroundColor: "#1f4682",
    focusBackgroundColor: "#3e7dd380",
  },
  danger: {
    backgroundColor: "#a12f4b",
    textColor: "white",
    hoverBackgroundColor: "#802036",
    activeBackgroundColor: "#60182a",
    focusBackgroundColor: "#A12F4B80",
  },
  success: {
    backgroundColor: "#2b8c29",
    textColor: "white",
    hoverBackgroundColor: "#146512",
    activeBackgroundColor: "#0b3d09",
    focusBackgroundColor: "#0b3d0980",
  },
  secondary: {
    backgroundColor: "#222222",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#333333",
    activeBackgroundColor: "#444444",
    focusBackgroundColor: "#33333380",
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: "#bbbbbb",
    hoverBackgroundColor: "#222222",
    activeBackgroundColor: "#111111",
    focusBackgroundColor: "#ffffff33",
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
    textColor: "#bbbbbb",
    hoverBackgroundColor: "#222222",
    activeBackgroundColor: "#111111",
    focusBackgroundColor: "#333333",
  },
  "outline-default": {
    backgroundColor: "#111111",
    textColor: "#bbbbbb",
    hoverBackgroundColor: "#222222",
    activeBackgroundColor: "#333333",
    focusBackgroundColor: "#ffffff40",
    borderColor: "#bbbbbb",
  },
  "outline-primary": {
    backgroundColor: "#111111",
    textColor: "#3e7dd3",
    hoverBackgroundColor: "#1a3e6a",
    activeBackgroundColor: "#102b4b",
    focusBackgroundColor: "#3E7DD380",
    borderColor: "#3e7dd3",
  },
  "outline-danger": {
    backgroundColor: "#111111",
    textColor: "#a12f4b",
    hoverBackgroundColor: "#802036",
    activeBackgroundColor: "#60182a",
    focusBackgroundColor: "#A12F4B80",
    borderColor: "#a12f4b",
  },
  "outline-success": {
    backgroundColor: "#111111",
    textColor: "#2b8c29",
    hoverBackgroundColor: "#146512",
    activeBackgroundColor: "#0b3d09",
    focusBackgroundColor: "#0b3d0980",
    borderColor: "#2b8c29",
  },
});

const darkBadge = createBadgeTheme(darkBody, {
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

const darkBoxbar = createBoxbarTheme(darkBody, {
  backgroundColor: "#111",
  borderColor: "#333333",
  toggleButtonColor: "#f5f5f5",
  toggleButtonHoverColor: "#ccc",
});

const darkCard = createCardTheme(darkBody, {
  backgroundColor: "#1f2937",
  borderColor: "#374151",
  titleColor: "#f9fafb",
  subtitleColor: "#9ca3af",
  closeIconColor: "#f9fafb",
  closeIconHoverBackground: "#374151",
});

const darkChoiceGroup = createChoiceGroupTheme(darkBody, {
  borderColor: "#374151",
  dividerColor: "#4b5563",
  labelColor: "#f9fafb",
  backgroundColor: "#1f2937",
  descriptionColor: "#d1d5db",
});

const darkCheckbox = createCheckboxTheme(lightBody, {
  borderColor: "#374151",
  checkedBorderColor: "#3B82F6",
  backgroundColor: "#1f2937",
  checkedBackgroundColor: "#3B82F6",
  iconColor: "#f9fafb",
  labelColor: "#f9fafb",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

export const darkErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#ff4d4f",
  cubeFaceBorder: "#a8071a",
  cubeFaceText: "#ffffff",
  titleColor: "#ffffff",
});

const darkGrid = createGridTheme(darkBody, {
  cardBackgroundColor: "#1a1a1a",
  cardHoverBackgroundColor: "#2a2a2a",
  cardSelectedBackgroundColor: "#1e3a5f",
  cardBorderColor: "#333333",
  cardShadow: "0 1px 3px rgba(0,0,0,0.6)",
  thumbnailBackgroundColor: "#2a2a2a",
});

const darkKeynote = createKeynoteTheme(darkBody, {
  keyColor: "#9ca3af",
  valueColor: "#f3f4f6",
});

const darkRadio = createRadioTheme(darkBody, {
  borderColor: "#374151",
  checkedBorderColor: "#3b82f6",
  backgroundColor: "#1f2937",
  checkedBackgroundColor: "#3b82f6",
  labelColor: "#ffffff",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

const darkSeparator = createSeparatorTheme(darkBody, {
  containerColor: "#d1d5db",
  lineColor: "#e5e7eb",
  titleColor: "#f9fafb",
  backgroundTitleColor: "#111111",
});

const darkTheme: AppTheme = {
  body: darkBody,
  avatar: darkAvatar,
  badge: darkBadge,
  button: darkButton,
  boxbar: darkBoxbar,
  card: darkCard,
  choiceGroup: darkChoiceGroup,
  checkbox: darkCheckbox,
  errorSlate: darkErrorSlate,
  grid: darkGrid,
  keynote: darkKeynote,
  radio: darkRadio,
  separator: darkSeparator,
};

// Themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
