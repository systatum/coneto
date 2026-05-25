import { ToolbarVariant } from "./../../components/toolbar";
import { ButtonVariants } from "./../../components/button";
import {
  ActionButtonThemeConfig,
  ActionCapsuleThemeConfig,
  AvatarThemeConfig,
  BadgeThemeConfig,
  BodyThemeConfig,
  BoxbarThemeConfig,
  ButtonThemeConfig,
  CalendarThemeConfig,
  CapsuleTabThemeConfig,
  CapsuleThemeConfig,
  CardThemeConfig,
  CheckboxThemeConfig,
  ChipsThemeConfig,
  ChoiceGroupThemeConfig,
  ColorboxThemeConfig,
  ComboboxThemeConfig,
  CrumbThemeConfig,
  DialogThemeConfig,
  DocumentViewerThemeConfig,
  DormantTextThemeConfig,
  DrawerTabThemeConfig,
  ErrorSlateThemeConfig,
  FieldLaneThemeConfig,
  FileDropBoxThemeConfig,
  FileInputBoxThemeConfig,
  FrameThemeConfig,
  GridThemeConfig,
  ImageboxThemeConfig,
  KeynoteThemeConfig,
  ListThemeConfig,
  LoadingSkeletonThemeConfig,
  LoadingSpinnerThemeConfig,
  MessageboxThemeConfig,
  ModalDialogThemeConfig,
  MoneyboxThemeConfig,
  NavTabThemeConfig,
  OverlayBlockerThemeConfig,
  PaginationThemeConfig,
  PaperDialogThemeConfig,
  PhoneboxThemeConfig,
  PinboxThemeConfig,
  RadioThemeConfig,
  RatingThemeConfig,
  RichEditorThemeConfig,
  SearchboxThemeConfig,
  SelectboxThemeConfig,
  SeparatorThemeConfig,
  SidebarThemeConfig,
  SignboxThemeConfig,
  SplitPaneThemeConfig,
  StatefulFormThemeConfig,
  StatusbarThemeConfig,
  SteplineThemeConfig,
  TableThemeConfig,
  TextareaThemeConfig,
  TextboxThemeConfig,
  ThumbFieldThemeConfig,
  TimeboxThemeConfig,
  TimelineThemeConfig,
  TipMenuContainerThemeConfig,
  TipMenuThemeConfig,
  TitleThemeConfig,
  ToggleThemeConfig,
  ToolbarThemeConfig,
  TooltipThemeConfig,
  TreeListThemeConfig,
  WheelThemeConfig,
} from "./../index";
import { TipMenuVariant } from "./../../components/tip-menu";

// body
export function createBodyTheme(
  themeConfigurations: Partial<BodyThemeConfig> = {}
): BodyThemeConfig {
  const defaultTheme = {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    borderColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...themeConfigurations,
  };
}

// action-capsule
export function createActionCapsuleTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ActionCapsuleThemeConfig> = {},
  themeConfigurations: Partial<ActionCapsuleThemeConfig> = {}
): ActionCapsuleThemeConfig {
  const defaultTheme: ActionCapsuleThemeConfig = {
    activeBackgroundColor: "rgb(226, 224, 224)",
    textColor: body.textColor || "#343434",
    boxShadow: "none",
    borderRadius: "6px",
    capsuleFontSize: "14px",
    tabTextColor: "rgb(86, 85, 85)",
    tabBorderRadius: "6px",
    borderColor: "#ebebeb",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// action-button.tsx
export function createActionButtonTheme(
  baseVariants: Partial<ActionButtonThemeConfig> = {},
  themeConfigurations: Partial<ActionButtonThemeConfig> = {}
): ActionButtonThemeConfig {
  const defaultTheme: ActionButtonThemeConfig = {
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

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// avatar.tsx
export function createAvatarTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<AvatarThemeConfig> = {},
  themeConfigurations: Partial<AvatarThemeConfig> = {}
): AvatarThemeConfig {
  const defaultTheme = {
    borderColor: "#f3f4f6",
    textColor: body.textColor,
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayIconColor: "#ffffff",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// badge.tsx
export function createBadgeTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<BadgeThemeConfig> = {},
  themeConfigurations: Partial<BadgeThemeConfig> = {}
): BadgeThemeConfig {
  const defaultTheme: BadgeThemeConfig = {
    backgroundColor: "transparent",
    textColor: body.textColor,
    circleColor: "#111",
    borderColor: "#e5e7eb",
    action: {
      hoverBackgroundColor: "#d1d5db",
      activeBackgroundColor: "#9ca3af",
      focusRingColor: "#00000033",
      disabledOpacity: 0.4,
    },
  };

  return {
    ...defaultTheme,
    ...baseVariants,
    ...themeConfigurations,
    action: {
      ...defaultTheme.action,
      ...baseVariants.action,
      ...themeConfigurations.action,
    },
  };
}

// boxbar.tsx
export function createBoxbarTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<BoxbarThemeConfig> = {},
  themeConfigurations: Partial<BoxbarThemeConfig> = {}
): BoxbarThemeConfig {
  const defaultTheme: BoxbarThemeConfig = {
    backgroundColor: body.backgroundColor,
    toggleButtonColor: body.textColor,
    borderColor: "#d1d5db",
    toggleButtonHoverColor: "#f3f4f6",
    textColor: body.textColor,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// button.tsx
export function createButtonTheme(
  body: BodyThemeConfig = {},
  baseVariants: Partial<Record<string, ButtonThemeConfig>> = {},
  themeConfigurations: Partial<Record<string, ButtonThemeConfig>> = {}
): Record<string, ButtonThemeConfig> {
  const defaultVariants: Record<string, ButtonThemeConfig> = {
    default: {
      backgroundColor: "#dddddd",
      textColor: body.textColor || "rgb(17, 17, 17)",
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      textDecoration: "none",
      dividerColor: "#c7c7c7",
    },
    primary: {
      backgroundColor: "#569aec",
      textColor: "white",
      hoverBackgroundColor: "#3e7dd3",
      activeBackgroundColor: "#2a73c3",
      focusBackgroundColor: "#569AEC80",
      dividerColor: "rgb(80, 145, 223)",
    },
    danger: {
      backgroundColor: "#ce375d",
      textColor: "white",
      hoverBackgroundColor: "#a12f4b",
      activeBackgroundColor: "#802036",
      focusBackgroundColor: "#CE375D80",
      dividerColor: "#a12f4b4a",
    },
    success: {
      backgroundColor: "#42A340",
      textColor: "white",
      hoverBackgroundColor: "#2B8C29",
      activeBackgroundColor: "#146512",
      focusBackgroundColor: "#0f4f0e",
      dividerColor: "rgba(19, 156, 17, 0.69)",
    },
    secondary: {
      backgroundColor: "#ececec",
      textColor: body.textColor || "rgb(17, 17, 17)",
      hoverBackgroundColor: "#cccccc",
      activeBackgroundColor: "#b3b3b3",
      focusBackgroundColor: "#B4B4B480",
      dividerColor: "#e5e7eb",
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: body.textColor || "rgb(17, 17, 17)",
      hoverBackgroundColor: "#f3f3f3",
      activeBackgroundColor: "#eaeaea",
      focusBackgroundColor: "#00000033",
      dividerColor: "#e5e7eb",
    },
    link: {
      backgroundColor: "transparent",
      textColor: "#408ee8",
      hoverBackgroundColor: "#2a73c3",
      activeBackgroundColor: "#1e5ba8",
      focusBackgroundColor: "#408EE880",
      textDecoration: "underline",
      dividerColor: "rgb(80, 145, 223)",
    },
    transparent: {
      backgroundColor: "transparent",
      textColor: body.textColor || "rgb(17, 17, 17)",
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      focusBackgroundColor: "#cfcfcf",
      dividerColor: "#e5e7eb",
    },
    "outline-default": {
      backgroundColor: "white",
      textColor: "#9b9b9b",
      hoverBackgroundColor: "#f0f0f0",
      activeBackgroundColor: "#e6e6e6",
      focusBackgroundColor: "#00000040",
      borderColor: "#9b9b9b",
      dividerColor: "#e5e7eb",
    },
    "outline-primary": {
      backgroundColor: "white",
      textColor: "#569aec",
      hoverBackgroundColor: "#e6f0ff",
      activeBackgroundColor: "#cce0ff",
      focusBackgroundColor: "#569AEC80",
      borderColor: "#569aec",
      dividerColor: "rgb(80, 145, 223)",
    },
    "outline-danger": {
      backgroundColor: "white",
      textColor: "#ce375d",
      hoverBackgroundColor: "#fce0eb",
      activeBackgroundColor: "#f9c0d2",
      focusBackgroundColor: "#CE375D80",
      borderColor: "#ce375d",
      dividerColor: "#a12f4b4a",
    },
    "outline-success": {
      backgroundColor: "white",
      textColor: "#42A340",
      hoverBackgroundColor: "#e6f2e6",
      activeBackgroundColor: "#cce0cc",
      focusBackgroundColor: "#0f4f0e",
      borderColor: "#42A340",
      dividerColor: "rgba(19, 156, 17, 0.69)",
    },
  };

  const allKeys = new Set([
    ...Object.keys(defaultVariants),
    ...Object.keys(baseVariants),
    ...Object.keys(themeConfigurations),
  ]);

  const merged: Record<string, ButtonThemeConfig> = {};
  for (const key of allKeys) {
    merged[key] = {
      ...defaultVariants[key],
      ...baseVariants[key],
      ...themeConfigurations[key],
    };
  }

  return merged;
}

// tip-menu-container.tsx
export function createTipMenuContainerTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<TipMenuContainerThemeConfig> = {},
  themeConfigurations: Partial<TipMenuContainerThemeConfig> = {}
): TipMenuContainerThemeConfig {
  return {
    backgroundColor: body?.backgroundColor || "#ffffff",
    borderColor: "#e5e7eb",
    textColor: body?.textColor || "inherit",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ...baseVariants,
    ...themeConfigurations,
  };
}

// calendar.tsx
export function createCalendarTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<CalendarThemeConfig> = {},
  themeConfigurations: Partial<CalendarThemeConfig> = {}
): CalendarThemeConfig {
  const defaultTheme: CalendarThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#111827",

    dayTextColor: "#6b7280",

    disabledDateColor: "#d1d5db",
    weekendDateColor: "#fca5a5",

    highlightedDateTextColor: "white",
    hightlightDateColor: "#61a9f9",
    rangeDateBackgroundColor: "#dbeafe",
    rangeDateTextColor: "#61a9f9",

    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// capsule.tsx
export function createCapsuleTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<CapsuleThemeConfig> = {},
  themeConfigurations: Partial<CapsuleThemeConfig> = {}
): CapsuleThemeConfig {
  const defaultTheme: CapsuleThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#ebebeb",
    boxShadow: "0 1px 1px -2px #5b5b5b, 0 1px 1px rgba(0, 0, 0, 0.05)",
    textColor: body.textColor,
    tab: {
      textColor: "#111827",
      activeTextColor: "#ffffff",
    },
    active: {
      backgroundColor: "oklch(54.6% .245 262.881)",
    },
    hover: {
      borderColor: "oklch(54.6% .245 262.881)",
    },
  };

  return {
    ...defaultTheme,
    ...baseVariants,
    ...themeConfigurations,
    tab: {
      ...defaultTheme.tab,
      ...baseVariants.tab,
      ...themeConfigurations.tab,
    },
    active: {
      ...defaultTheme.active,
      ...baseVariants.active,
      ...themeConfigurations.active,
    },
    hover: {
      ...defaultTheme.hover,
      ...baseVariants.hover,
      ...themeConfigurations.hover,
    },
  };
}

// capsule-tab.tsx
export function createCapsuleTabTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<CapsuleTabThemeConfig> = {},
  themeConfigurations: Partial<CapsuleTabThemeConfig> = {}
): CapsuleTabThemeConfig {
  const defaultTheme: CapsuleTabThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#ebebeb",
    boxShadow: "0 1px 3px -3px #5b5b5b",
    activeBackgroundColor: "black",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// card.tsx
export function createCardTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<CardThemeConfig> = {},
  themeConfigurations: Partial<CardThemeConfig> = {}
): CardThemeConfig {
  const defaultTheme: CardThemeConfig = {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    dividerColor: "transparent",
    titleColor: body.textColor,
    subtitleColor: "#8b8e92",
    headerBackground: "transparent",
    footerBackground: "transparent",
    closeIconColor: body.textColor,
    closeIconHoverBackground: "#d1d5db",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// chips.tsx
export function createChipsTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ChipsThemeConfig> = {},
  themeConfigurations: Partial<ChipsThemeConfig> = {}
): ChipsThemeConfig {
  return {
    backgroundColor: body.backgroundColor,
    borderColor: "#d1d5db",
    textColor: body.textColor,
    mutedTextColor: "#4b5563",

    hoverBackgroundColor: "#bfdbfe",
    selectedBackgroundColor: "#bfdbfe",

    dividerColor: "#d1d5db",

    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",

    ...baseVariants,
    ...themeConfigurations,
  };
}

// choice-group.tsx
export function createChoiceGroupTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ChoiceGroupThemeConfig> = {},
  themeConfigurations: Partial<ChoiceGroupThemeConfig> = {}
): ChoiceGroupThemeConfig {
  const defaultTheme: ChoiceGroupThemeConfig = {
    borderColor: "#e5e7eb",
    dividerColor: "#e5e7eb",
    labelColor: body.textColor,
    backgroundColor: body.backgroundColor || "#fff",
    descriptionColor: "#4b5563",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// checkbox.tsx
export function createCheckboxTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<CheckboxThemeConfig> = {},
  themeConfigurations: Partial<CheckboxThemeConfig> = {}
): CheckboxThemeConfig {
  const defaultTheme: CheckboxThemeConfig = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: body.backgroundColor,
    checkedBackgroundColor: "#61A9F9",
    iconColor: "#ffffff",
    labelColor: body.textColor,
    descriptionColor: "#4b5563",
    highlightCheckedBackgroundColor: "#DBEAFE",
    highlightHoverBackgroundColor: "#E7F2FC",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// colorbox.tsx
export function createColorboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<ColorboxThemeConfig> = {},
  themeConfigurations: Partial<ColorboxThemeConfig> = {}
): ColorboxThemeConfig {
  const defaultTheme: ColorboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor,

    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",

    errorBorderColor: fieldLane?.errorBorderColor || "#f87171",
    errorTextColor: fieldLane?.errorColor || "#dc2626",

    disabledBorderColor: fieldLane?.borderColor || "#d1d5db",
    disabledTextColor: fieldLane?.borderColor || "#d1d5db",

    prefixColor: fieldLane?.placeholderColor || "#6b7280",

    boxBackgroundColor: body.backgroundColor || "#ffffff",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// crumb.tsx
export function createCrumbTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<CrumbThemeConfig> = {},
  themeConfigurations: Partial<CrumbThemeConfig> = {}
): CrumbThemeConfig {
  const defaultTheme: CrumbThemeConfig = {
    textColor: "#4b5563",
    hoverColor: "#61a9f9",
    lastTextColor: body.textColor,
    arrowColor: "#9ca3af",
    ellipsisColor: "#6b7280",
    ellipsisHoverColor: "#61a9f9",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// combobox.tsx
export function createComboboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<ComboboxThemeConfig> = {},
  themeConfigurations: Partial<ComboboxThemeConfig> = {}
): ComboboxThemeConfig {
  const defaultTheme: ComboboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#1f2937",
    highlightBackgroundColor: fieldLane?.highlightBackgroundColor || "#dbeafe",
    selectedBackgroundColor: fieldLane?.selectedBackgroundColor || "#61a9f9",
    selectedTextColor: body.backgroundColor || "#ffffff",
    disabledTextColor: fieldLane?.disabledTextColor || "#9ca3af",
    emptyTextColor: fieldLane?.helperColor || "#6b7280",
    dividerColor: fieldLane?.dividerColor || "#d1d5db",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    groupBackgroundColor: "rgb(249, 250, 251)",
    scrollThumbColor: "#9ca3af",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// dialog.tsx
export function createDialogTheme(
  body: BodyThemeConfig,
  baseVariants: DialogThemeConfig = {},
  themeConfigurations: DialogThemeConfig = {}
): DialogThemeConfig {
  const defaultTheme: DialogThemeConfig = {
    borderColor: "#ebebeb",
    textColor: body.textColor,
    backgroundColor: body.backgroundColor,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    subtitleColor: "#5a606b",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// document-viewer.tsx
export function createDocumentViewerTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<DocumentViewerThemeConfig> = {},
  themeConfigurations: Partial<DocumentViewerThemeConfig> = {}
): DocumentViewerThemeConfig {
  const defaultTheme: DocumentViewerThemeConfig = {
    backgroundColor: "#525659",
    toolbarBackgroundColor: "#323639",
    textColor: "white",
    errorColor: "#ff6b6b",
    hoverBoxBorderColor: "#4daaf5",
    hoverBoxBackgroundColor: "rgba(77, 170, 245, 0.2)",
    hoverBoxTextColor: "#323639",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// dormant-text.tsx
export function createDormantTextTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<DormantTextThemeConfig> = {},
  themeConfigurations: Partial<DormantTextThemeConfig> = {}
): DormantTextThemeConfig {
  const defaultTheme: DormantTextThemeConfig = {
    backgroundColor: body.backgroundColor,
    hoverBackgroundColor: "#e9e9e9",
    borderColor: "transparent",
    textColor: body.textColor,
    pencilColor: "#666666",
    actionButtonColor: "#666666",
    actionButtonHoverBackground: "#d1d5db",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// drawer-tab.tsx
export function createDrawerTabTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<DrawerTabThemeConfig> = {},
  themeConfigurations: Partial<DrawerTabThemeConfig> = {}
): DrawerTabThemeConfig {
  const defaultTheme: DrawerTabThemeConfig = {
    backgroundColor: body.backgroundColor,
    textColor: body.textColor,
    borderColor: "#d1d5db",
    hoverBackgroundColor: "#f3f4f6",
    headerBackgroundColor: "#f3f4f6",
    closeButtonHoverBackground: "#d1d5db",
    dividerColor: "#e5e7eb",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// error-slate.tsx
export function createErrorSlateTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ErrorSlateThemeConfig> = {},
  themeConfigurations: Partial<ErrorSlateThemeConfig> = {}
): ErrorSlateThemeConfig {
  const defaultTheme: ErrorSlateThemeConfig = {
    cubeFaceBackground: "#dd0b0b",
    cubeFaceBorder: "#a80000",
    cubeFaceText: "#ffffff",
    titleColor: body?.textColor,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// field-lane.tsx
export function createFieldLaneTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<FieldLaneThemeConfig> = {},
  themeConfigurations: Partial<FieldLaneThemeConfig> = {}
): FieldLaneThemeConfig {
  const defaultTheme: FieldLaneThemeConfig = {
    buttonTextColor: body.textColor,
    buttonBorderColor: "#d1d5db",
    buttonErrorBorderColor: "#ef4444",
    buttonErrorTextColor: "#b91c1c",

    textColor: body.textColor,

    disabledOpacity: 0.5,
    disabledBorderColor: "#d1d5db",
    disabledTextColor: "#9ca3af",

    borderColor: "#d1d5db",

    actionColor: "#6b7280",
    actionHoverColor: "#374151",
    actionHoverBackgroundColor: "#e5e7eb",

    placeholderColor: "rgb(107, 114, 128)",
    focusedBorderColor: "#61A9F9",
    highlightBackgroundColor: "#dbeafe",
    selectedBackgroundColor: "#61A9F9",

    errorColor: "#b91c1c",
    errorBorderColor: "#ef4444",
    errorBackground: "#fee2e2",
    errorForeground: "#991b1b",

    helperColor: "#6b7280",
    dividerColor: "#9ca3af",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// file-input-box.tsx
export function createFileInputBoxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<FileInputBoxThemeConfig> = {},
  themeConfigurations: Partial<FileInputBoxThemeConfig> = {}
): FileInputBoxThemeConfig {
  const defaultTheme: FileInputBoxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane.focusedBorderColor || "#3b82f6",
    errorBorderColor: fieldLane.errorBorderColor || "#ef4444",
    textColor: body.textColor || "#111827",
    placeholderColor: fieldLane.placeholderColor || "#6b7280",
    disabledTextColor: fieldLane.disabledTextColor || "#9ca3af",

    defaultGradientColor: "#9ca3af",
    errorGradientColor: "#dc2626",
    disabledGradientColor: "#9ca3af",

    dragActiveColor: "#3b82f6",
    dragActiveBackgroundColor: "#eff6ff",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// file-drop-box.tsx
export function createFileDropBoxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<FileDropBoxThemeConfig> = {},
  themeConfigurations: Partial<FileDropBoxThemeConfig> = {}
): FileInputBoxThemeConfig {
  const defaultTheme: FileDropBoxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",

    textColor: body.textColor || "#111827",
    placeholderColor: fieldLane.placeholderColor || "#9ca3af",

    defaultGradientColor: "#9ca3af",
    dragActiveGradientColor: "#60a5fa",
    errorGradientColor: "#dc2626",
    disabledGradientColor: "#9ca3af",

    dragActiveBackgroundColor: "#eff6ff",
    dragActiveTextColor: "#3b82f6",

    iconColor: "#6b7280",

    progressBackgroundColor: "#d1d5db",
    progressBarColor: "#93c5fd",
    progressTextColor: "#111827",

    disabledTextColor: fieldLane.disabledTextColor || "#9ca3af",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// frame.tsx
export function createFrameTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<FrameThemeConfig> = {},
  themeConfigurations: Partial<FrameThemeConfig> = {}
): FrameThemeConfig {
  const defaultTheme: FrameThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: "#d1d5db",
    titleColor: "#999b9d",
    titleBackgroundColor: body.backgroundColor || "#ffffff",
    overlayBackgroundColor: body.backgroundColor || "#ffffff",
    boxShadow: "var(--shadow-xs)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// grid.tsx
export function createGridTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<GridThemeConfig> = {},
  themeConfigurations: Partial<GridThemeConfig> = {}
): GridThemeConfig {
  const defaultTheme: GridThemeConfig = {
    cardBackgroundColor: body.backgroundColor,
    cardHoverBackgroundColor: "#f3f3f3",
    cardSelectedBackgroundColor: "#e6f0ff",
    cardBorderColor: "#e5e5e5",
    cardShadow: "0 1px 3px rgba(0,0,0,0.1)",
    thumbnailBackgroundColor: "#e5e5e5",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// imagebox.tsx
export function createImageboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<ImageboxThemeConfig> = {},
  themeConfigurations: Partial<ImageboxThemeConfig> = {}
): ImageboxThemeConfig {
  const defaultTheme: ImageboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",

    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#3b82f6",

    textColor: body.textColor || "#6b7280",

    draggingBackgroundColor: "#eff6ff",
    draggingBorderColor: fieldLane?.focusedBorderColor || "#3b82f6",
    draggingTextColor: fieldLane?.focusedBorderColor || "#3b82f6",

    iconColor: "#c3c3c3",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// keynote.tsx
export function createKeynoteTheme(
  baseVariants: Partial<KeynoteThemeConfig> = {},
  themeConfigurations: Partial<KeynoteThemeConfig> = {}
): KeynoteThemeConfig {
  const defaultTheme: KeynoteThemeConfig = {
    keyColor: "#374151",
    valueColor: "#111827",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// list.tsx
export function createListTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ListThemeConfig> = {},
  themeConfigurations: Partial<ListThemeConfig> = {}
): ListThemeConfig {
  const defaultTheme: ListThemeConfig = {
    backgroundColor: "transparent",
    textColor: body.textColor,
    hoverBackgroundColor: "#dbeafe",
    hoverTextColor: body.textColor,
    badgeBackgroundColor: "#488cac",
    borderColor: "#d1d5db",
    dragLineColor: "#3b82f6",
    emptyHoverBackgroundColor: "#dbeafe",
    badgeTextColor: "white",
    badgeBorderColor: "#d1d5db",
    toggleBackgroundColor: "#c1d6f1",
    mutedTextColor: "#6b7280",
    maxItemTextColor: "rgb(97, 97, 97)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// loading-skeleton.tsx
export function createLoadingSkeletonTheme(
  baseVariants: Partial<LoadingSkeletonThemeConfig> = {},
  themeConfigurations: Partial<LoadingSkeletonThemeConfig> = {}
): LoadingSkeletonThemeConfig {
  const defaultTheme: LoadingSkeletonThemeConfig = {
    baseColor: "#eeeeee",
    highlightColor: "#dddddd",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// loading-spinner.tsx
export function createLoadingSpinnerTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<LoadingSpinnerThemeConfig> = {},
  themeConfigurations: Partial<LoadingSpinnerThemeConfig> = {}
): LoadingSpinnerThemeConfig {
  const defaultTheme: LoadingSpinnerThemeConfig = {
    spinnerColor: "#3b82f6",
    textColor: body.textColor,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// messagebox.tsx
export function createMessageboxTheme(
  baseVariants: Partial<MessageboxThemeConfig> = {},
  themeConfigurations: Partial<MessageboxThemeConfig> = {}
): MessageboxThemeConfig {
  const defaultTheme: MessageboxThemeConfig = {
    primary: {
      backgroundColor: "#e7f2fc",
      textColor: "#2a63b4",
      activeColor: "#1f4a89",
    },
    success: {
      backgroundColor: "#e9f3e8",
      textColor: "#43843d",
      activeColor: "#30602c",
    },
    danger: {
      backgroundColor: "#f6e7e7",
      textColor: "#b92c25",
      activeColor: "#891f1a",
    },
    warning: {
      backgroundColor: "#fbf0e4",
      textColor: "#9e5b20",
      activeColor: "#734418",
    },
  };

  return {
    primary: {
      ...defaultTheme.primary,
      ...baseVariants.primary,
      ...themeConfigurations.primary,
    },
    success: {
      ...defaultTheme.success,
      ...baseVariants.success,
      ...themeConfigurations.success,
    },
    danger: {
      ...defaultTheme.danger,
      ...baseVariants.danger,
      ...themeConfigurations.danger,
    },
    warning: {
      ...defaultTheme.warning,
      ...baseVariants.warning,
      ...themeConfigurations.warning,
    },
  };
}

// moneybox.tsx
export function createMoneyboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<MoneyboxThemeConfig> = {},
  themeConfigurations: Partial<MoneyboxThemeConfig> = {}
): MoneyboxThemeConfig {
  const defaultTheme: MoneyboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",

    focusedBorderColor: fieldLane.focusedBorderColor || "#61A9F9",
    errorBorderColor: fieldLane.errorBorderColor || "#ef4444",

    textColor: body.textColor || "#111827",
    placeholderColor: fieldLane.placeholderColor || "#9ca3af",
    disabledTextColor: fieldLane.disabledTextColor || "#9ca3af",

    inputPadding: "10px 12px",
    fontSize: "0.75rem",
    borderRadius: "2px",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// modal-dialog.tsx
export function createModalDialogTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<ModalDialogThemeConfig> = {},
  themeConfigurations: Partial<ModalDialogThemeConfig> = {}
): ModalDialogThemeConfig {
  const defaultTheme: ModalDialogThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#ebebeb",
    textColor: body.textColor,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    subtitleColor: "#6b7280",
    dividerColor: "#3b82f6",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// nav-tab.tsx
export function createNavTabTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<NavTabThemeConfig> = {},
  themeConfigurations: Partial<NavTabThemeConfig> = {}
): NavTabThemeConfig {
  const defaultTheme: NavTabThemeConfig = {
    backgroundColor: body?.backgroundColor || "#ffffff",
    borderColor: "#e0e0e0",
    textColor: body.textColor,

    hoverBackgroundColor: "rgb(243 244 246 / 50%)",
    activeBackgroundColor: "rgb(243 244 246 / 80%)",
    selectedBackgroundColor: "rgb(243 244 246 / 50%)",

    indicatorColor: "rgb(59, 130, 246)",
    boxShadow: "0 1px 4px -3px rgba(0,0,0,0.2)",

    activeInsetShadow:
      "inset 0 0.5px 4px rgb(243 244 246 / 100%), inset 0 -0.5px 0.5px rgb(243 244 246 / 80%)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// overlay-blocker.tsx
export function createOverlayBlockerTheme(
  baseVariants: Partial<OverlayBlockerThemeConfig> = {},
  themeConfigurations: Partial<OverlayBlockerThemeConfig> = {}
): OverlayBlockerThemeConfig {
  const defaultTheme: OverlayBlockerThemeConfig = {
    backgroundColor: "rgba(3, 3, 3, 0.2)",
    backdropFilter: "blur(2px)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// paper-dialog.tsx
export function createPaperDialogTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<PaperDialogThemeConfig> = {},
  themeConfigurations: Partial<PaperDialogThemeConfig> = {}
): PaperDialogThemeConfig {
  const defaultTheme: PaperDialogThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "rgb(235, 235, 235)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textColor: body.textColor,
    actionHoverBackgroundColor: "#f3f4f6",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// pagination.tsx
export function createPaginationTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<PaginationThemeConfig> = {},
  themeConfigurations: Partial<PaginationThemeConfig> = {}
): PaginationThemeConfig {
  const defaultTheme: PaginationThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",

    borderColor: fieldLane.borderColor || "#f3f4f6",
    activeBorderColor: fieldLane.focusedBorderColor || "#61A9F9",
    hoverBorderColor: fieldLane.focusedBorderColor || "#61A9F9",

    textColor: body.textColor || "#374151",
    activeTextColor: body.textColor || "#111827",

    disabledBackgroundColor: body.backgroundColor || "#ffffff",
    disabledTextColor: fieldLane.disabledTextColor || "#9ca3af",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// pinbox.tsx
export function createPinboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<PinboxThemeConfig> = {},
  themeConfigurations: Partial<PinboxThemeConfig> = {}
): PinboxThemeConfig {
  const defaultTheme: PinboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",
    textColor: body.textColor || "#1f2937",

    errorBorderColor: fieldLane?.errorBorderColor || "#ef4444",
    errorTextColor: fieldLane?.errorForeground || "#991b1b",

    disabledBorderColor: fieldLane?.disabledBorderColor || "#d1d5db",
    disabledTextColor: fieldLane?.disabledTextColor || "#9ca3af",

    placeholderColor: fieldLane?.placeholderColor || "#9ca3af",
    boxShadow: "0 0 0 0.5px transparent",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// phonebox.tsx
export function createPhoneboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<PhoneboxThemeConfig> = {},
  themeConfigurations: Partial<PhoneboxThemeConfig> = {}
): PhoneboxThemeConfig {
  const defaultTheme: PhoneboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",
    textColor: body.textColor || "#1f2937",

    errorBorderColor: fieldLane?.errorBorderColor || "#ef4444",
    errorTextColor: fieldLane?.errorForeground || "#991b1b",

    disabledBorderColor: fieldLane?.disabledBorderColor || "#d1d5db",
    disabledTextColor: fieldLane?.disabledTextColor || "#9ca3af",

    boxShadow: "0 0 0 0.5px transparent",

    placeholderColor: fieldLane?.placeholderColor,

    optionHighlightedBackground:
      fieldLane?.highlightBackgroundColor || "#dbeafe",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// radio.tsx
export function createRadioTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<RadioThemeConfig> = {},
  themeConfigurations: Partial<RadioThemeConfig> = {}
): RadioThemeConfig {
  const defaultTheme: RadioThemeConfig = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: "#ffffff",
    checkedBackgroundColor: "#ffffff",
    checkedOutsideBorderColor: "#61A9F9",
    iconColor: "#ffffff",
    textColor: body.textColor,
    descriptionColor: "#4b5563",
    highlightBackgroundColor: "#E7F2FC",
    highlightBorderColor: "#e5e7eb",
    highlightCheckedBackgroundColor: "#DBEAFE",
    highlightCheckedBorderColor: "#e5e7eb",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// rating.tsx
export function createRatingTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<RatingThemeConfig> = {},
  themeConfigurations: Partial<RatingThemeConfig> = {}
): RatingThemeConfig {
  const defaultTheme: RatingThemeConfig = {
    starFullColor: "#facc15",
    starEmptyColor: "#ffffff",
    starBorderColor: "#facc15",

    hoverStarColor: "#f59e0b",

    labelTextColor: body.textColor || "#111827",

    disabledStarColor: fieldLane?.borderColor || "#d1d5db",
    disabledLabelColor: fieldLane?.disabledTextColor || "#9ca3af",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// rich-editor.tsx
export function createRichEditorTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  button: Partial<ButtonThemeConfig> = {},
  baseVariants: Partial<RichEditorThemeConfig> = {},
  themeConfigurations: Partial<RichEditorThemeConfig> = {}
): RichEditorThemeConfig {
  const defaultTheme: RichEditorThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    textColor: body.textColor || "#111827",
    placeholderColor: fieldLane.placeholderColor || "#9ca3af",
    borderColor: fieldLane.borderColor || "#d1d5db",
    toolbarBackground: body.backgroundColor || "#f9fafb",
    toolbarButtonActive: button?.activeBackgroundColor,
    toolbarButtonHover: button?.hoverBackgroundColor,
    toolbarButtonFocused: button?.hoverBackgroundColor,
    scrollThumb: "#9ca3af",
    preBackgroundColor: "#D3D3D3",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// searchbox.tsx
export function createSearchboxTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<SearchboxThemeConfig> = {},
  themeConfigurations: Partial<SearchboxThemeConfig> = {}
): SearchboxThemeConfig {
  const defaultTheme: SearchboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    activeBackgroundColor: body.backgroundColor,
    borderColor: "#d1d5db",

    focusBorderColor: "#61a9f9",
    focusShadow: "0 0 0 1px #61a9f9",
    iconColor: "#9ca3af",
    clearIconColor: "#9ca3af",
    textColor: "#111827",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// stepline.tsx
export function createSteplineTheme(
  body: BodyThemeConfig,
  buttonTheme?: Record<ButtonVariants["variant"], ButtonThemeConfig>,
  baseVariants: Partial<SteplineThemeConfig> = {},
  themeConfigurations: Partial<SteplineThemeConfig> = {}
): SteplineThemeConfig {
  const defaultTheme: SteplineThemeConfig = {
    outerCircle: {
      error: buttonTheme?.danger?.hoverBackgroundColor || "#8f0751",
      completed: buttonTheme?.success?.hoverBackgroundColor || "#2fe620",
      current: buttonTheme?.success?.hoverBackgroundColor || "#2fe620",
      todo: buttonTheme?.default?.hoverBackgroundColor || "#9ca3af",
    },
    innerCircle: {
      error: buttonTheme?.danger?.backgroundColor || "#ff0000",
      completed: buttonTheme?.success?.backgroundColor || "#00b62e",
      current: buttonTheme?.success?.backgroundColor || "#00b62e",
      todo: buttonTheme?.default?.backgroundColor || "#4b5563",
    },
    text: {
      error: buttonTheme?.danger?.textColor || body.textColor,
      completed: buttonTheme?.success?.textColor || body.textColor,
      current: buttonTheme?.success?.textColor || body.textColor,
      todo: buttonTheme?.default?.textColor || body.textColor,
    },
    line: {
      default: buttonTheme?.default?.activeBackgroundColor || "#9ca3af",
      completed: buttonTheme?.success?.backgroundColor || "#00b62e",
      error: buttonTheme?.danger?.backgroundColor || "#b60000",
    },
  };

  return {
    outerCircle: {
      ...defaultTheme.outerCircle,
      ...baseVariants.outerCircle,
      ...themeConfigurations.outerCircle,
    },
    innerCircle: {
      ...defaultTheme.innerCircle,
      ...baseVariants.innerCircle,
      ...themeConfigurations.innerCircle,
    },
    text: {
      ...defaultTheme.text,
      ...baseVariants.text,
      ...themeConfigurations.text,
    },
    line: {
      ...defaultTheme.line,
      ...baseVariants.line,
      ...themeConfigurations.line,
    },
  };
}

// selectbox.tsx
export function createSelectboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<SelectboxThemeConfig> = {},
  themeConfigurations: Partial<SelectboxThemeConfig> = {}
): SelectboxThemeConfig {
  const defaultTheme: SelectboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    textColor: body.textColor || "#111827",

    borderColor: fieldLane.borderColor || "#d1d5db",
    hoverBorderColor: fieldLane.focusedBorderColor || "#61a9f9",
    focusedBorderColor: fieldLane.focusedBorderColor || "#61a9f9",

    errorBorderColor: fieldLane.errorBorderColor || "#ef4444",

    placeholderColor: fieldLane.placeholderColor || "#9ca3af",

    iconColor: fieldLane.actionColor || "#9ca3af",
    iconActiveColor: fieldLane.focusedBorderColor || "#61a9f9",

    clearIconColor: fieldLane.actionColor || "#9ca3af",
    clearIconBackground: "transparent",
    clearIconHoverBackground: fieldLane.actionHoverBackgroundColor || "#e5e7eb",

    dividerColor: fieldLane.dividerColor || "#9ca3af",
    disabledOpacity: fieldLane.disabledOpacity,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// separator.tsx
export function createSeparatorTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<SeparatorThemeConfig> = {},
  themeConfigurations: Partial<SeparatorThemeConfig> = {}
): SeparatorThemeConfig {
  const defaultTheme: SeparatorThemeConfig = {
    containerColor: "#6b7280",
    lineColor: "#111827",
    lineShadow: "inset 0 2px 2px #ffffff, inset 0 -1px 1px #7a7a7a",
    titleColor: "#6b7280",
    backgroundTitleColor: body.backgroundColor,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// sidebar.tsx
export function createSidebarTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<SidebarThemeConfig> = {},
  themeConfigurations: Partial<SidebarThemeConfig> = {}
): SidebarThemeConfig {
  const defaultTheme: SidebarThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#e5e7eb",
    boxShadow: "0 0 6px rgba(0,0,0,0.05)",
    textColor: body.textColor,
    item: {
      hoverBackgroundColor: "#f3f3f3",
      activeBackgroundColor: "#e5e7eb",
    },
    toggle: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      hoverBackgroundColor: "#f3f3f3",
    },
  };

  return {
    ...defaultTheme,
    ...baseVariants,
    ...themeConfigurations,
    item: {
      ...defaultTheme.item,
      ...baseVariants.item,
      ...themeConfigurations.item,
    },
    toggle: {
      ...defaultTheme.toggle,
      ...baseVariants.toggle,
      ...themeConfigurations.toggle,
    },
  };
}

// signbox.tsx
export function createSignboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<SignboxThemeConfig> = {},
  themeConfigurations: Partial<SignboxThemeConfig> = {}
): SignboxThemeConfig {
  const defaultTheme: SignboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#111827",

    errorBorderColor: fieldLane?.errorBorderColor || "#f87171",

    clearIconColor: fieldLane?.actionColor || "#6b7280",
    clearIconHoverBackground: fieldLane?.actionHoverColor || "#e5e7eb",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// statusbar.tsx
export function createStatusbarTheme(
  baseVariants: Partial<StatusbarThemeConfig> = {},
  themeConfigurations: Partial<StatusbarThemeConfig> = {}
): StatusbarThemeConfig {
  const defaultTheme: StatusbarThemeConfig = {
    backgroundColor: "#ececec",
    borderColor: "#dedddd",
    boxShadow: "inset 0 0px 0.5px rgba(0,0,0,0.06)",
    textColor: "#111827",
    item: {
      activeBackgroundColor: "#d1d5db",
      hoverBackgroundColor: "#e5e7eb",
    },
  };

  return {
    ...defaultTheme,
    ...baseVariants,
    ...themeConfigurations,
    item: {
      ...defaultTheme.item,
      ...baseVariants.item,
      ...themeConfigurations.item,
    },
  };
}

// stateful-form.tsx
export function createStatefulFormTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<StatefulFormThemeConfig> = {},
  themeConfigurations: Partial<StatefulFormThemeConfig> = {}
): StatefulFormThemeConfig {
  const defaultTheme: StatefulFormThemeConfig = {
    backgroundColor: body.backgroundColor,
    textColor: body.textColor,
    rowFrameBackgroundColor: "#f3f4f6",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// textarea.tsx
export function createTextareaTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<TextareaThemeConfig> = {},
  themeConfigurations: Partial<TextareaThemeConfig> = {}
): TextareaThemeConfig {
  const defaultTheme: TextareaThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",

    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor:
      fieldLane?.focusedBorderColor || fieldLane?.placeholderColor,

    textColor: body.textColor || "#1f2937",

    errorBorderColor: fieldLane?.errorBorderColor || "#ef4444",
    errorTextColor: fieldLane?.errorForeground || "#991b1b",

    disabledBorderColor: fieldLane?.disabledBorderColor || "#d1d5db",
    disabledTextColor: "#9ca3af",

    placeholderColor: fieldLane?.placeholderColor || "#9ca3af",
    scrollbarThumbColor: "#3f3f46",

    boxShadow: "0 0 0 1px transparent",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// textbox.tsx
export function createTextboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<TextboxThemeConfig> = {},
  themeConfigurations: Partial<TextboxThemeConfig> = {}
): TextboxThemeConfig {
  const defaultTheme: TextboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor:
      fieldLane?.focusedBorderColor || fieldLane?.placeholderColor,
    textColor: body.textColor || "#1f2937",
    errorBorderColor: fieldLane?.errorBorderColor || "#ef4444",
    errorTextColor: fieldLane?.errorForeground || "#991b1b",
    disabledBorderColor: fieldLane?.disabledBorderColor || "#d1d5db",
    disabledTextColor: fieldLane?.disabledTextColor || "#9ca3af",
    placeholderColor: fieldLane?.placeholderColor || "#9ca3af",
    boxShadow: "0 0 0 0.5px transparent",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// table.tsx
export function createTableTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<TableThemeConfig> = {},
  themeConfigurations: Partial<TableThemeConfig> = {}
): TableThemeConfig {
  const defaultTheme: TableThemeConfig = {
    textColor: body.textColor || "#111827",
    backgroundColor: body?.backgroundColor,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    headerActionBackgroundColor: "linear-gradient(to bottom, #fbf9f9, #f0f0f0)",
    headerActionBorderColor: "rgb(229, 231, 235)",
    headerBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    headerBorderColor: "rgb(229, 231, 235)",
    rowGroupBackgroundColor: "rgb(249, 250, 251)",
    rowGroupSubtitleTextColor: "#1f2937",
    rowBackgroundColor: "rgb(249, 250, 251)",
    rowBorderColor: "#e5e7eb",
    rowHoverBackgroundColor: "#e7f2fc",
    rowSelectedBackgroundColor: "#dbeafe",
    rowContentBackgroundColor:
      "linear-gradient(to bottom, #ececec 0%, #f6f6f6 35%, #f0f0f0 100%)",
    rowContentBoxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 5px inset",
    summaryBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    summaryBorderColor: "#d1d5db",
    scrollbarThumbColor: "rgba(145, 142, 142, 0.3)",
    scrollbarTrackColor: "rgba(168, 167, 167, 0.1)",
    toggleRowBackgroundColor: "#d4d4d4",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// timebox.tsx
export function createTimeboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  baseVariants: Partial<TimeboxThemeConfig> = {},
  themeConfigurations: Partial<TimeboxThemeConfig> = {}
): TimeboxThemeConfig {
  const defaultTheme: TimeboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#111827",
    focusedBorderColor: fieldLane?.focusedBorderColor,
    errorBorderColor: fieldLane?.errorBorderColor,
    errorTextColor: fieldLane?.errorColor,
    colonColor: body.textColor,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// timeline.tsx
export function createTimelineTheme(
  body: BodyThemeConfig,
  buttonTheme?: Record<ButtonVariants["variant"], ButtonThemeConfig>,
  baseVariants: Partial<TimelineThemeConfig> = {},
  themeConfigurations: Partial<TimelineThemeConfig> = {}
): TimelineThemeConfig {
  const defaultTheme: TimelineThemeConfig = {
    outerCircle: {
      error: buttonTheme?.danger?.backgroundColor || "#8f0751",
      completed: buttonTheme?.success?.backgroundColor || "#2fe620",
      current: buttonTheme?.success?.backgroundColor || "#2fe620",
      todo: buttonTheme?.default?.backgroundColor || "#9ca3af",
    },
    innerCircle: {
      error: buttonTheme?.danger?.activeBackgroundColor || "#ff0000",
      completed: buttonTheme?.success?.activeBackgroundColor || "#00b62e",
      current: buttonTheme?.success?.activeBackgroundColor || "#00b62e",
      todo: buttonTheme?.default?.activeBackgroundColor || "#4b5563",
    },
    text: {
      error: buttonTheme?.danger?.textColor || body.textColor,
      completed: buttonTheme?.success?.textColor || body.textColor,
      current: buttonTheme?.success?.textColor || body.textColor,
      todo: buttonTheme?.default?.textColor || body.textColor,
    },
    line: {
      default: buttonTheme?.default?.activeBackgroundColor || "#9ca3af",
      completed: buttonTheme?.success?.backgroundColor || "#00b62e",
      error: buttonTheme?.danger?.backgroundColor || "#b60000",
    },
  };

  return {
    outerCircle: {
      ...defaultTheme.outerCircle,
      ...baseVariants.outerCircle,
      ...themeConfigurations.outerCircle,
    },
    innerCircle: {
      ...defaultTheme.innerCircle,
      ...baseVariants.innerCircle,
      ...themeConfigurations.innerCircle,
    },
    text: {
      ...defaultTheme.text,
      ...baseVariants.text,
      ...themeConfigurations.text,
    },
    line: {
      ...defaultTheme.line,
      ...baseVariants.line,
      ...themeConfigurations.line,
    },
  };
}

// tipmenu.tsx
export function createTipMenuTheme(
  buttonTheme?: Record<Partial<ButtonVariants["variant"]>, ButtonThemeConfig>,
  baseVariants: Partial<
    Record<TipMenuVariant, Partial<TipMenuThemeConfig>>
  > = {},
  themeConfigurations: Partial<
    Record<TipMenuVariant, Partial<TipMenuThemeConfig>>
  > = {}
): Record<TipMenuVariant, TipMenuThemeConfig> {
  const variantMap: Record<TipMenuVariant, ButtonVariants["variant"]> = {
    default: "ghost",
    danger: "danger",
    success: "success",
    primary: "primary",
  };

  return Object.fromEntries(
    (Object.keys(variantMap) as TipMenuVariant[]).map((variant) => {
      const buttonKey = variantMap[variant];
      const defaultConfig: TipMenuThemeConfig = {
        focusBackgroundColor: buttonTheme?.[buttonKey]?.focusBackgroundColor,
        backgroundColor: buttonTheme?.[buttonKey]?.backgroundColor,
        textColor: buttonTheme?.[buttonKey]?.textColor,
        activeBackgroundColor: buttonTheme?.[buttonKey]?.activeBackgroundColor,
        hoverBackgroundColor: buttonTheme?.[buttonKey]?.hoverBackgroundColor,
      };

      return [
        variant,
        {
          ...defaultConfig,
          ...baseVariants[variant],
          ...themeConfigurations[variant],
        },
      ];
    })
  ) as Record<TipMenuVariant, TipMenuThemeConfig>;
}

// title.tsx
export function createTitleTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<TitleThemeConfig> = {},
  themeConfigurations: Partial<TitleThemeConfig> = {}
): TitleThemeConfig {
  const defaultTheme: TitleThemeConfig = {
    pretitle: {
      textColor: body.textColor,
      opacity: 0.7,
      fontWeight: 400,
    },
    title: {
      textColor: body.textColor,
      fontWeight: 500,
    },
    subtitle: {
      textColor: body.textColor,
      fontWeight: 400,
    },
    icon: {
      textColor: body.textColor,
    },
  };

  return {
    ...defaultTheme,
    ...baseVariants,
    ...themeConfigurations,
    pretitle: {
      ...defaultTheme.pretitle,
      ...baseVariants.pretitle,
      ...themeConfigurations.pretitle,
    },
    title: {
      ...defaultTheme.title,
      ...baseVariants.title,
      ...themeConfigurations.title,
    },
    subtitle: {
      ...defaultTheme.subtitle,
      ...baseVariants.subtitle,
      ...themeConfigurations.subtitle,
    },
    icon: {
      ...defaultTheme.icon,
      ...baseVariants.icon,
      ...themeConfigurations.icon,
    },
  };
}

// toggle.tsx
export function createToggleTheme(
  baseVariants: Partial<ToggleThemeConfig> = {},
  themeConfigurations: Partial<ToggleThemeConfig> = {}
): ToggleThemeConfig {
  const defaultTheme: ToggleThemeConfig = {
    backgroundColor: "#D1D5DB",
    checkedBackgroundColor: "#61A9F9",
    thumbColor: "#ffffff",
    borderColor: "#d1d5db",
    textColor: "#111827",
    descriptionColor: "#6b7280",
    disabledOpacity: 0.5,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// toolbar.tsx
export function createToolbarTheme(
  baseButton: Record<ToolbarVariant, ToolbarThemeConfig>,
  baseVariants: Partial<Record<ToolbarVariant, ToolbarThemeConfig>> = {},
  themeConfigurations: Partial<Record<ToolbarVariant, ToolbarThemeConfig>> = {}
): Record<ToolbarVariant, ToolbarThemeConfig> {
  const defaultVariants: Record<ToolbarVariant, ToolbarThemeConfig> = {
    default: {
      ...baseButton?.default,
      hoverBackgroundColor:
        baseButton?.default?.hoverBackgroundColor ?? "#f5f5f5",
      activeBackgroundColor:
        baseButton?.default?.activeBackgroundColor ?? "#e8e8e8",
      focusBackgroundColor:
        baseButton?.default?.focusBackgroundColor ?? "#66666633",
      borderColor:
        baseButton?.default?.borderColor ??
        baseButton?.default?.backgroundColor,
    },
    primary: {
      ...baseButton?.primary,
      hoverBackgroundColor:
        baseButton?.primary?.hoverBackgroundColor ?? "#408ee8",
      activeBackgroundColor:
        baseButton?.primary?.activeBackgroundColor ?? "#2a73c3",
      focusBackgroundColor:
        baseButton?.primary?.focusBackgroundColor ?? "#569AEC80",
    },
    danger: {
      ...baseButton?.danger,
      hoverBackgroundColor:
        baseButton?.danger?.hoverBackgroundColor ?? "#a12f4b",
      activeBackgroundColor:
        baseButton?.danger?.activeBackgroundColor ?? "#802036",
      focusBackgroundColor:
        baseButton?.danger?.focusBackgroundColor ?? "#CE375D80",
    },
    success: {
      ...baseButton?.success,
      hoverBackgroundColor:
        baseButton?.success?.hoverBackgroundColor ?? "#2fe620",
      activeBackgroundColor:
        baseButton?.success?.activeBackgroundColor ?? "#1db417",
      focusBackgroundColor:
        baseButton?.success?.focusBackgroundColor ?? "#2FE62080",
    },
    ghost: {
      ...baseButton?.ghost,
      hoverBackgroundColor: baseButton?.ghost?.hoverBackgroundColor,
      activeBackgroundColor: baseButton?.ghost?.activeBackgroundColor,
      focusBackgroundColor: baseButton?.ghost?.focusBackgroundColor,
    },
  };

  const allKeys = new Set([
    ...Object.keys(defaultVariants),
    ...Object.keys(baseVariants),
    ...Object.keys(themeConfigurations),
  ]) as Set<ToolbarVariant>;

  const merged = {} as Record<ToolbarVariant, ToolbarThemeConfig>;
  for (const key of allKeys) {
    merged[key] = {
      ...defaultVariants[key],
      ...baseVariants[key],
      ...themeConfigurations[key],
    };
  }

  return merged;
}

// tooltip.tsx
export function createTooltipTheme(
  baseVariants: Partial<TooltipThemeConfig> = {},
  themeConfigurations: Partial<TooltipThemeConfig> = {}
): TooltipThemeConfig {
  const defaultTheme: TooltipThemeConfig = {
    literalStringBackgroundColor: "#b9babc",
    literalStringTextColor: "#111827",
    nodeElementBackgroundColor: "#b9babc",
    nodeElementTextColor: "#111827",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    arrowBackgroundColor: "#b9babc",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// thumb-field.tsx
export function createThumbFieldTheme(
  baseVariants: Partial<ThumbFieldThemeConfig> = {},
  themeConfigurations: Partial<ThumbFieldThemeConfig> = {}
): ThumbFieldThemeConfig {
  const defaultTheme: ThumbFieldThemeConfig = {
    thumbsUpColor: "#61A9F9",
    thumbsDownColor: "rgb(206, 55, 93)",
    inactiveColor: "#9ca3af",
    errorColor: "#dc2626",
    disabledOpacity: 0.5,
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// treelist.tsx
export function createTreeListTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<TreeListThemeConfig> = {},
  themeConfigurations: Partial<TreeListThemeConfig> = {}
): TreeListThemeConfig {
  const defaultTheme: TreeListThemeConfig = {
    textColor: body.textColor,
    backgroundColor: body.backgroundColor,
    hoverBackgroundColor: "#f3f4f6",
    selectedBackgroundColor: "#f3f4f6",
    highlightedText: "#e5e7eb",
    dividerHierarchyColor: "rgb(243 243 243)",
    dividerHierarchyRelatedColor: "#d7d6d6",
    dividerHierarchySelectedColor: "#3b82f6",
    rowActionBackgroundColor: "rgb(193, 214, 241)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// split-pane.tsx
export function createSplitPaneTheme(
  body: BodyThemeConfig,
  baseVariants: Partial<SplitPaneThemeConfig> = {},
  themeConfigurations: Partial<SplitPaneThemeConfig> = {}
): SplitPaneThemeConfig {
  const defaultTheme: SplitPaneThemeConfig = {
    backgroundColor: body?.backgroundColor || "#ffffff",
    textColor: body?.textColor || "#111827",
    dividerColor: "#d1d5db",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}

// wheel.tsx
export function createWheelTheme(
  baseVariants: Partial<WheelThemeConfig> = {},
  themeConfigurations: Partial<WheelThemeConfig> = {}
): WheelThemeConfig {
  const defaultTheme: WheelThemeConfig = {
    backgroundColor: "#ffffff",
    overlayBackgroundColor: "rgba(0,0,0,0.04)",
    overlayBorderColor: "rgba(0,0,0,0.08)",
    fadeColor: "#efefef",
    textColor: "#111827",
    inactiveTextColor: "rgba(17,24,39,0.35)",
    separatorColor: "rgba(17,24,39,0.45)",
  };

  return { ...defaultTheme, ...baseVariants, ...themeConfigurations };
}
