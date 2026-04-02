import { ButtonVariants } from "./../components/button";
import {
  ActionButtonThemeConfiguration,
  ActionCapsuleThemeConfiguration,
  AppTheme,
  AvatarThemeConfiguration,
  BadgeThemeConfiguration,
  BodyThemeConfiguration,
  BoxbarThemeConfiguration,
  ButtonThemeConfiguration,
  CardThemeConfiguration,
  CheckboxThemeConfiguration,
  ChoiceGroupThemeConfiguration,
  DocumentViewerThemeConfiguration,
  ErrorSlateThemeConfiguration,
  GridThemeConfiguration,
  KeynoteThemeConfiguration,
  ListThemeConfiguration,
  LoadingSkeletonThemeConfiguration,
  LoadingSpinnerThemeConfiguration,
  RadioThemeConfiguration,
  SeparatorThemeConfiguration,
  TableThemeConfiguration,
  TreeListThemeConfiguration,
  WindowThemeConfiguration,
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

// action-capsule
export function createActionCapsuleTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<ActionCapsuleThemeConfiguration> = {}
): ActionCapsuleThemeConfiguration {
  const defaultTheme: ActionCapsuleThemeConfiguration = {
    activeBackgroundColor: "rgb(226, 224, 224)",
    textColor: body.textColor || "#343434",
    capsuleWrapperBoxShadow: "none",
    capsuleWrapperMinHeight: "32px",
    capsuleWrapperMaxHeight: "32px",
    capsuleWrapperBorderRadius: "6px",
    capsuleFontSize: "14px",
    tabTextColor: "rgb(86, 85, 85)",
    tabBorderRadius: "6px",
    borderColor: "#ebebeb",
  };

  return { ...defaultTheme, ...customTheme };
}

// action-button.tsx
export function createActionButtonTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<ActionButtonThemeConfiguration> = {}
): ActionButtonThemeConfiguration {
  const defaultTheme: ActionButtonThemeConfiguration = {
    backgroundColor: "transparent",
    textColor: "rgb(86, 85, 85)",
    hoverBackgroundColor: "#f3f4f6",
    disabledBackgroundColor: "#e5e7eb",
    disabledOpacity: 0.5,
    borderColor: "#ebebeb",
    borderRadius: "6px",

    toggleBackgroundColor: "transparent",
    toggleTextColor: "rgb(86, 85, 85)",
    toggleHoverBackgroundColor: "#f3f4f6",
    toggleBorderColor: "#e5e7eb",
    toggleBorderRadius: "6px",

    dividerColor: "#e5e7eb",

    dropdownWidth: "170px",
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

// document-viewer.tsx
export function createDocumentViewerTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<DocumentViewerThemeConfiguration> = {}
): DocumentViewerThemeConfiguration {
  const defaultTheme: DocumentViewerThemeConfiguration = {
    backgroundColor: "#525659",
    toolbarBackgroundColor: "#323639",
    textColor: "white",
    errorColor: "#ff6b6b",
    hoverBoxBorderColor: "#4daaf5",
    hoverBoxBackgroundColor: "rgba(77, 170, 245, 0.2)",
    hoverBoxTextColor: "#323639",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// error-slate.tsx
export function createErrorSlateTheme(
  custom: Partial<ErrorSlateThemeConfiguration> = {}
): ErrorSlateThemeConfiguration {
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
  customTheme: Partial<GridThemeConfiguration> = {}
): GridThemeConfiguration {
  const defaultTheme: GridThemeConfiguration = {
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
  customTheme: Partial<KeynoteThemeConfiguration> = {}
): KeynoteThemeConfiguration {
  const defaultTheme: KeynoteThemeConfiguration = {
    keyColor: "#374151",
    valueColor: "#111827",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// list.tsx
export function createListTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<ListThemeConfiguration> = {}
): ListThemeConfiguration {
  const defaultTheme: ListThemeConfiguration = {
    backgroundColor: "transparent",
    textColor: body.textColor,
    hoverBackgroundColor: "#dbeafe",
    hoverTextColor: body.textColor,
    selectedBackgroundColor: "#dbeafe",
    borderColor: "#d1d5db",
    mutedTextColor: "#6b7280",
    dragLineColor: "#3b82f6",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// loading-skeleton.tsx
export function createLoadingSkeletonTheme(
  customTheme: Partial<LoadingSkeletonThemeConfiguration> = {}
): LoadingSkeletonThemeConfiguration {
  const defaultTheme: LoadingSkeletonThemeConfiguration = {
    baseColor: "#eeeeee",
    highlightColor: "#dddddd",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// loading-spinner.tsx
export function createLoadingSpinnerTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<LoadingSpinnerThemeConfiguration> = {}
): LoadingSpinnerThemeConfiguration {
  const defaultTheme: LoadingSpinnerThemeConfiguration = {
    color: "#3b82f6",
    textColor: body.textColor,
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
  customTheme: Partial<SeparatorThemeConfiguration> = {}
): SeparatorThemeConfiguration {
  const defaultTheme: SeparatorThemeConfiguration = {
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

// table.tsx
export function createTableTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<TableThemeConfiguration> = {}
): TableThemeConfiguration {
  const defaultTheme: TableThemeConfiguration = {
    textColor: body?.textColor || "#111827",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

    headerActionBackgroundColor: "linear-gradient(to bottom, #fbf9f9, #f0f0f0)",

    headerBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    headerBorderColor: "#d1d5db",

    rowBackgroundColor: "white",
    rowBorderColor: "#e5e7eb",
    rowSubtitleTextColor: "#1f2937",
    rowHoverBackgroundColor: "#e7f2fc",
    rowSelectedBackgroundColor: "#dbeafe",
    rowContentBackgroundColor:
      "linear-gradient(to bottom, #ececec 0%, #f6f6f6 35%, #f0f0f0 100%)",

    summaryBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    summaryBorderColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// treelist.tsx
export function createTreeListTheme(
  body: BodyThemeConfiguration,
  custom: Partial<TreeListThemeConfiguration> = {}
): TreeListThemeConfiguration {
  const defaultTheme: TreeListThemeConfiguration = {
    textColor: body.textColor,
    backgroundColor: body.backgroundColor,
    hoverBackgroundColor: "#f3f4f6",
    selectedBackgroundColor: "#e5e7eb",
    borderColor: "#e5e7eb",
    expandIconColor: "#2563eb",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// window.tsx
export function createWindowTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<WindowThemeConfiguration> = {}
): WindowThemeConfiguration {
  const defaultTheme: WindowThemeConfiguration = {
    backgroundColor: "#ffffff",
    textColor: "#111827",
    dividerColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Light
const lightBody = createBodyTheme();

const lightActionButton = createActionButtonTheme(lightBody);

const lightActionCapsule = createActionCapsuleTheme(lightBody);

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

const lightDocumentViewer = createDocumentViewerTheme(lightBody);

const lightErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#dd0b0b",
  cubeFaceBorder: "#a80000",
  cubeFaceText: "#ffffff",
  titleColor: "#111111",
});

const lightGrid = createGridTheme(lightBody);

const lightKeynote = createKeynoteTheme(lightBody);

const lightList = createListTheme(lightBody);

const lightLoadingSkeleton = createLoadingSkeletonTheme();

const lightLoadingSpinner = createLoadingSpinnerTheme(lightBody);

const lightRadio = createRadioTheme(lightBody);

const lightSeparator = createSeparatorTheme(lightBody);

const lightTreeList = createTreeListTheme(lightBody);

const lightTable = createTableTheme(lightBody);

const lightWindow = createWindowTheme(lightBody);

const lightTheme: AppTheme = {
  body: lightBody,

  actionButton: lightActionButton,
  actionCapsule: lightActionCapsule,
  avatar: lightAvatar,
  badge: lightBadge,
  button: lightButton,
  boxbar: lightBoxbar,
  card: lightCard,
  choiceGroup: lightChoiceGroup,
  checkbox: lightCheckbox,
  documentViewer: lightDocumentViewer,
  errorSlate: lightErrorSlate,
  grid: lightGrid,
  keynote: lightKeynote,
  list: lightList,
  loadingSkeleton: lightLoadingSkeleton,
  loadingSpinner: lightLoadingSpinner,
  radio: lightRadio,
  separator: lightSeparator,
  table: lightTable,
  treelist: lightTreeList,
  window: lightWindow,
};

// Dark
const darkBody = createBodyTheme({
  backgroundColor: "#111",
  textColor: "#fff",
});

const darkActionButton = createActionButtonTheme(darkBody, {
  backgroundColor: "transparent",
  textColor: "#f9fafb",
  hoverBackgroundColor: "#292c2e",
  disabledBackgroundColor: "#1f1f21",
  borderColor: "#3a3a3f",

  toggleBackgroundColor: "transparent",
  toggleTextColor: "#f9fafb",
  toggleHoverBackgroundColor: "#292c2e",
  toggleBorderColor: "#3a3a3f",

  dividerColor: "#3a3a3f",
  dropdownWidth: "170px",
});

const darkActionCapsule = createActionCapsuleTheme(darkBody, {
  activeBackgroundColor: "rgb(57, 62, 65)",
  textColor: "#f9fafb",
  tabTextColor: "rgb(233, 233, 233)",
  borderColor: "#3a3a3f",
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
  checkedBorderColor: "#2a3243",
  backgroundColor: "#1f2937",
  checkedBackgroundColor: "#2a3243",
  iconColor: "#f9fafb",
  labelColor: "#f9fafb",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

const darkDocumentViewer = createDocumentViewerTheme(darkBody, {
  backgroundColor: "#0f172a",
  toolbarBackgroundColor: "#020617",
  textColor: "#e5e7eb",
  hoverBoxBorderColor: "#3b82f6",
  hoverBoxTextColor: "#020617",
  hoverBoxBackgroundColor: "rgba(59, 130, 246, 0.15)",
});

const darkErrorSlate = createErrorSlateTheme({
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

const darkList = createListTheme(darkBody, {
  backgroundColor: "#020617",
  textColor: "#e5e7eb",
  hoverBackgroundColor: "#1e293b",
  selectedBackgroundColor: "#1e40af",
  borderColor: "#1f2937",
  mutedTextColor: "#9ca3af",
  dragLineColor: "#264c7b",
});

const darkLoadingSkeleton = createLoadingSkeletonTheme({
  baseColor: "#1f2937",
  highlightColor: "#374151",
});

const darkLoadingSpinner = createLoadingSpinnerTheme(darkBody, {
  color: "#2a3243",
  textColor: "#e5e7eb",
});

const darkRadio = createRadioTheme(darkBody, {
  borderColor: "#374151",
  checkedBorderColor: "#2a3243",
  backgroundColor: "inherit",
  checkedBackgroundColor: "#2a3243",
  labelColor: "#ffffff",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

const darkSeparator = createSeparatorTheme(darkBody, {
  containerColor: "#d1d5db",
  lineColor: "#e5e7eb",
  titleColor: "#f9fafb",
  backgroundTitleColor: "#1f2023",
});

export const darkTable: TableThemeConfiguration = createTableTheme(darkBody, {
  textColor: darkBody.textColor,
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

  headerActionBackgroundColor: "linear-gradient(to bottom, #2c2c2c, #1f1f1f)",

  headerBackgroundColor: "linear-gradient(#29282b, #323232)",
  headerBorderColor: "rgb(39, 39, 48)",

  rowBackgroundColor: "rgb(31, 31, 33)",
  rowBorderColor: "rgb(39, 39, 48)",
  rowHoverBackgroundColor: "#292c2e",
  rowSelectedBackgroundColor: "#182350",
  rowSubtitleTextColor: "#d1d5db",
  rowContentBackgroundColor:
    "linear-gradient(to bottom, #1a1a1a 0%, #222222 35%, #1f1f1f 100%)",

  summaryBackgroundColor: "linear-gradient(#29282b, #323232)",
  summaryBorderColor: "rgb(39, 39, 48)",
});

const darkTreeList = createTreeListTheme(darkBody, {
  textColor: "#f9fafb",
  backgroundColor: "#111827",
  hoverBackgroundColor: "#1f2937",
  selectedBackgroundColor: "#374151",
  borderColor: "#374151",
  expandIconColor: "#3b82f6",
});

const darkWindow = createWindowTheme(darkBody, {
  backgroundColor: "#111827",
  textColor: "#f9fafb",
  dividerColor: "#374151",
});

const darkTheme: AppTheme = {
  body: darkBody,

  actionButton: darkActionButton,
  actionCapsule: darkActionCapsule,

  avatar: darkAvatar,
  badge: darkBadge,
  button: darkButton,
  boxbar: darkBoxbar,
  card: darkCard,
  choiceGroup: darkChoiceGroup,
  checkbox: darkCheckbox,
  documentViewer: darkDocumentViewer,
  errorSlate: darkErrorSlate,
  grid: darkGrid,
  keynote: darkKeynote,
  list: darkList,
  loadingSkeleton: darkLoadingSkeleton,
  loadingSpinner: darkLoadingSpinner,
  radio: darkRadio,
  separator: darkSeparator,
  table: darkTable,
  treelist: darkTreeList,
  window: darkWindow,
};

// Themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
