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
  ToggleThemeConfig,
  ToolbarThemeConfig,
  TooltipThemeConfig,
  TreeListThemeConfig,
} from "./../index";
import { TipMenuVariant } from "./../../components/tip-menu";

// body
export function createBodyTheme(
  customTheme: Partial<BodyThemeConfig> = {}
): BodyThemeConfig {
  const defaultTheme = {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    borderColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// action-capsule
export function createActionCapsuleTheme(
  body: BodyThemeConfig,
  customTheme: Partial<ActionCapsuleThemeConfig> = {}
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

  return { ...defaultTheme, ...customTheme };
}

// action-button.tsx
export function createActionButtonTheme(
  body: BodyThemeConfig,
  customTheme: Partial<ActionButtonThemeConfig> = {}
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

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// avatar.tsx
export function createAvatarTheme(
  body: BodyThemeConfig,
  customTheme: Partial<AvatarThemeConfig> = {}
): AvatarThemeConfig {
  const defaultTheme = {
    borderColor: "#f3f4f6",
    textColor: body.textColor,
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayIconColor: "#ffffff",
  };
  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// badge.tsx
export function createBadgeTheme(
  body: BodyThemeConfig,
  customTheme: Partial<BadgeThemeConfig> = {}
): BadgeThemeConfig {
  const defaultTextColor = body.textColor;

  const defaultTheme: BadgeThemeConfig = {
    backgroundColor: "transparent",
    textColor: defaultTextColor,
    circleColor: "#111",
    borderColor: "#e5e7eb",

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
  body: BodyThemeConfig,
  customTheme: Partial<BoxbarThemeConfig> = {}
): BoxbarThemeConfig {
  const defaultTheme: BoxbarThemeConfig = {
    backgroundColor: body.backgroundColor,
    toggleButtonColor: body.textColor,
    borderColor: "#d1d5db",
    toggleButtonHoverColor: "#f3f4f6",
    textColor: body.textColor,
  };

  return { ...defaultTheme, ...customTheme };
}

// button.tsx
export function createButtonTheme(
  body: BodyThemeConfig = {},
  customVariants: Partial<
    Record<ButtonVariants["variant"], ButtonThemeConfig>
  > = {}
): Record<string, ButtonThemeConfig> {
  const variants: Record<string, ButtonThemeConfig> = {
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

  return { ...variants, ...customVariants };
}

export function createTipMenuContainerTheme(
  body: BodyThemeConfig,
  custom: Partial<TipMenuContainerThemeConfig> = {}
): TipMenuContainerThemeConfig {
  return {
    backgroundColor: body?.backgroundColor || "#ffffff",
    borderColor: "#e5e7eb",
    textColor: body?.textColor || "inherit",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ...custom,
  };
}

// calendar.tsx
export function createCalendarTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<CalendarThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// capsule.tsx
export function createCapsuleTheme(
  body: BodyThemeConfig,
  custom: Partial<CapsuleThemeConfig> = {}
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
    ...custom,
    tab: {
      ...defaultTheme.tab,
      ...custom.tab,
    },
    active: {
      ...defaultTheme.active,
      ...custom.active,
    },
    hover: {
      ...defaultTheme.hover,
      ...custom.hover,
    },
  };
}

// capsule-tab.tsx
export function createCapsuleTabTheme(
  body: BodyThemeConfig,
  custom: Partial<CapsuleTabThemeConfig> = {}
): CapsuleTabThemeConfig {
  const defaultTheme: CapsuleTabThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#ebebeb",
    boxShadow: "0 1px 3px -3px #5b5b5b",
    activeBackgroundColor: "black",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// card.tsx
export function createCardTheme(
  body: BodyThemeConfig,
  customTheme: Partial<CardThemeConfig> = {}
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

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// chips.tsx
export function createChipsTheme(
  body: BodyThemeConfig,
  custom: Partial<ChipsThemeConfig> = {}
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

    ...custom,
  };
}

// choice-group.tsx
export function createChoiceGroupTheme(
  body: BodyThemeConfig,
  customTheme: Partial<ChoiceGroupThemeConfig> = {}
): ChoiceGroupThemeConfig {
  const defaultTheme: ChoiceGroupThemeConfig = {
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
  body: BodyThemeConfig,
  customTheme: Partial<CheckboxThemeConfig> = {}
): CheckboxThemeConfig {
  const defaultTheme: CheckboxThemeConfig = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: body.backgroundColor,
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

// colorbox.tsx
export function createColorboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ColorboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// crumb.tsx
export function createCrumbTheme(
  body: BodyThemeConfig,
  custom: Partial<CrumbThemeConfig> = {}
): CrumbThemeConfig {
  const defaultTheme: CrumbThemeConfig = {
    textColor: "#4b5563",
    hoverColor: "#61a9f9",
    lastTextColor: body.textColor,
    arrowColor: "#9ca3af",
    ellipsisColor: "#6b7280",
    ellipsisHoverColor: "#61a9f9",
  };

  return { ...defaultTheme, ...custom };
}

// combobox.tsx
export function createComboboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ComboboxThemeConfig> = {}
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
  };

  return { ...defaultTheme, ...custom };
}

// dialog.tsx
export function createDialogTheme(
  body: BodyThemeConfig,
  custom: DialogThemeConfig = {}
): DialogThemeConfig {
  const defaultTheme: DialogThemeConfig = {
    borderColor: "#ebebeb",
    textColor: body.textColor,
    backgroundColor: body.backgroundColor,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    subtitleColor: "#5a606b",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// document-viewer.tsx
export function createDocumentViewerTheme(
  body: BodyThemeConfig,
  customTheme: Partial<DocumentViewerThemeConfig> = {}
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

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// dormant-text.tsx
export function createDormantTextTheme(
  body: BodyThemeConfig,
  custom: Partial<DormantTextThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// drawer-tab.tsx
export function createDrawerTabTheme(
  body: BodyThemeConfig,
  custom: Partial<DrawerTabThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// error-slate.tsx
export function createErrorSlateTheme(
  custom: Partial<ErrorSlateThemeConfig> = {}
): ErrorSlateThemeConfig {
  return {
    cubeFaceBackground: "#dd0b0b",
    cubeFaceBorder: "#a80000",
    cubeFaceText: "#ffffff",
    titleColor: "#111111",
    ...custom,
  };
}

// field-lane.tsx
export function createFieldLaneTheme(
  body: BodyThemeConfig,
  custom: Partial<FieldLaneThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// file-input-box.tsx
export function createFileInputBoxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<FileInputBoxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

export function createFileDropBoxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<FileDropBoxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// frame.tsx
export function createFrameTheme(
  body: BodyThemeConfig,
  custom: Partial<FrameThemeConfig> = {}
): FrameThemeConfig {
  const defaultTheme: FrameThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: "#d1d5db",
    titleColor: "#999b9d",
    titleBackgroundColor: body.backgroundColor || "#ffffff",
    overlayBackgroundColor: body.backgroundColor || "#ffffff",
    boxShadow: "var(--shadow-xs)",
  };

  return { ...defaultTheme, ...custom };
}

// grid.tsx
export function createGridTheme(
  body: BodyThemeConfig,
  customTheme: Partial<GridThemeConfig> = {}
): GridThemeConfig {
  const defaultTheme: GridThemeConfig = {
    cardBackgroundColor: body.backgroundColor,
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

// imagebox.tsx
export function createImageboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ImageboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// keynote.tsx
export function createKeynoteTheme(
  body: BodyThemeConfig,
  customTheme: Partial<KeynoteThemeConfig> = {}
): KeynoteThemeConfig {
  const defaultTheme: KeynoteThemeConfig = {
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
  body: BodyThemeConfig,
  customTheme: Partial<ListThemeConfig> = {}
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

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// loading-skeleton.tsx
export function createLoadingSkeletonTheme(
  customTheme: Partial<LoadingSkeletonThemeConfig> = {}
): LoadingSkeletonThemeConfig {
  const defaultTheme: LoadingSkeletonThemeConfig = {
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
  body: BodyThemeConfig,
  customTheme: Partial<LoadingSpinnerThemeConfig> = {}
): LoadingSpinnerThemeConfig {
  const defaultTheme: LoadingSpinnerThemeConfig = {
    spinnerColor: "#3b82f6",
    textColor: body.textColor,
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// messagebox.tsx
export function createMessageboxTheme(
  customTheme: Partial<MessageboxThemeConfig> = {}
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
    ...defaultTheme,
    ...customTheme,
  };
}

// moneybox.tsx
export function createMoneyboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<MoneyboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// modal-dialog.tsx
export function createModalDialogTheme(
  body: BodyThemeConfig,
  custom: Partial<ModalDialogThemeConfig> = {}
): ModalDialogThemeConfig {
  const defaultTheme: ModalDialogThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "#ebebeb",
    textColor: body.textColor,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    subtitleColor: "#6b7280",
    dividerColor: "#3b82f6",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// nav-tab.tsx
export function createNavTabTheme(
  body: BodyThemeConfig,
  custom: Partial<NavTabThemeConfig> = {}
): NavTabThemeConfig {
  return {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    textColor: body.textColor,

    hoverBackgroundColor: "rgb(243 244 246 / 50%)",
    activeBackgroundColor: "rgb(243 244 246 / 80%)",
    selectedBackgroundColor: "rgb(243 244 246 / 50%)",

    indicatorColor: "rgb(59, 130, 246)",
    boxShadow: "0 1px 4px -3px rgba(0,0,0,0.2)",

    activeInsetShadow:
      "inset 0 0.5px 4px rgb(243 244 246 / 100%), inset 0 -0.5px 0.5px rgb(243 244 246 / 80%)",

    ...custom,
  };
}

// overlay-blocker.tsx
export function createOverlayBlockerTheme(
  customTheme: Partial<OverlayBlockerThemeConfig> = {}
): OverlayBlockerThemeConfig {
  const defaultTheme: OverlayBlockerThemeConfig = {
    backgroundColor: "rgba(3, 3, 3, 0.2)",
    backdropFilter: "blur(2px)",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// paper-dialog.tsx
export function createPaperDialogTheme(
  body: BodyThemeConfig,
  custom: Partial<PaperDialogThemeConfig> = {}
): PaperDialogThemeConfig {
  const defaultTheme: PaperDialogThemeConfig = {
    backgroundColor: body.backgroundColor,
    borderColor: "rgb(235, 235, 235)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textColor: body.textColor,
    actionHoverBackgroundColor: "#f3f4f6",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// pagination.tsx

export function createPaginationTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PaginationThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// pinbox.tsx
export function createPinboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PinboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// phonebox.tsx
export function createPhoneboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PhoneboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// radio.tsx
export function createRadioTheme(
  body: BodyThemeConfig,
  customTheme: Partial<RadioThemeConfig> = {}
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
    highlightBackgroundColor: "#DBEAFE",
    highlightBorderColor: "#e5e7eb",
    highlightCheckedBackgroundColor: "#E7F2FC",
    highlightCheckedBorderColor: "#e5e7eb",
  };

  return { ...defaultTheme, ...customTheme };
}

// rating.tsx
export function createRatingTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<RatingThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// rich-editor.tsx
export function createRichEditorTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  button: Partial<ButtonThemeConfig> = {},
  custom: Partial<RichEditorThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// searchbox.tsx
export function createSearchboxTheme(
  body: BodyThemeConfig,
  custom: Partial<SearchboxThemeConfig> = {}
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

  return {
    ...defaultTheme,
    ...custom,
  };
}

// stepline.tsx
export function createSteplineTheme(
  body: BodyThemeConfig,
  buttonTheme?: Record<ButtonVariants["variant"], ButtonThemeConfig>,
  customTheme: Partial<SteplineThemeConfig> = {}
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

  return { ...defaultTheme, ...customTheme };
}

// selectbox.tsx
export function createSelectboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<SelectboxThemeConfig> = {}
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
    clearIconHoverBackground: fieldLane.actionHoverColor || "#e5e7eb",

    dividerColor: fieldLane.dividerColor || "#9ca3af",
    disabledOpacity: fieldLane.disabledOpacity,
  };

  return { ...defaultTheme, ...custom };
}

// separator.tsx
export function createSeparatorTheme(
  body: BodyThemeConfig,
  customTheme: Partial<SeparatorThemeConfig> = {}
): SeparatorThemeConfig {
  const defaultTheme: SeparatorThemeConfig = {
    containerColor: "#6b7280",
    lineColor: "#111827",
    lineShadow: "inset 0 2px 2px #ffffff, inset 0 -1px 1px #7a7a7a",
    titleColor: "#6b7280",
    backgroundTitleColor: body.backgroundColor,
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

export function createSidebarTheme(
  body: BodyThemeConfig,
  custom: Partial<SidebarThemeConfig> = {}
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
    ...custom,
    item: {
      ...defaultTheme.item,
      ...custom.item,
    },
    toggle: {
      ...defaultTheme.toggle,
      ...custom.toggle,
    },
  };
}

// signbox.tsx
export function createSignboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<SignboxThemeConfig> = {}
): SignboxThemeConfig {
  const defaultTheme: SignboxThemeConfig = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#111827",

    errorBorderColor: fieldLane?.errorBorderColor || "#f87171",

    clearIconColor: fieldLane?.actionColor || "#6b7280",
    clearIconHoverBackground: fieldLane?.actionHoverColor || "#e5e7eb",
  };

  return { ...defaultTheme, ...custom };
}

// statusbar.tsx
export function createStatusbarTheme(
  customTheme: Partial<StatusbarThemeConfig> = {}
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
    ...customTheme,
  };
}

// stateful-form.tsx
export function createStatefulFormTheme(
  body: BodyThemeConfig,
  customTheme: Partial<StatefulFormThemeConfig> = {}
): StatefulFormThemeConfig {
  const defaultTheme: StatefulFormThemeConfig = {
    backgroundColor: body.backgroundColor,
    textColor: body.textColor,
    rowFrameBackgroundColor: "#f3f4f6",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// textarea.tsx
export function createTextareaTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TextareaThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// textbox.tsx
export function createTextboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TextboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// table.tsx
export function createTableTheme(
  body: BodyThemeConfig,
  customTheme: Partial<TableThemeConfig> = {}
): TableThemeConfig {
  const defaultTheme: TableThemeConfig = {
    textColor: body.textColor || "#111827",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

    headerActionBackgroundColor: "linear-gradient(to bottom, #fbf9f9, #f0f0f0)",
    headerActionBorderColor: "rgb(229, 231, 235)",

    headerBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    headerBorderColor: "rgb(229, 231, 235)",

    rowGroupBackgroundColor: "rgb(249, 250, 251)",

    rowBackgroundColor: "rgb(249, 250, 251)",
    rowBorderColor: "#e5e7eb",
    rowSubtitleTextColor: "#1f2937",
    rowHoverBackgroundColor: "#e7f2fc",
    rowSelectedBackgroundColor: "#dbeafe",
    rowContentBackgroundColor:
      "linear-gradient(to bottom, #ececec 0%, #f6f6f6 35%, #f0f0f0 100%)",
    rowContentBoxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 5px inset",

    summaryBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    summaryBorderColor: "#d1d5db",

    toggleRowBackgroundColor: "#d4d4d4",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// timebox.tsx
export function createTimeboxTheme(
  body: BodyThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TimeboxThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// timeline.tsx
export function createTimelineTheme(
  body: BodyThemeConfig,
  buttonTheme?: Record<ButtonVariants["variant"], ButtonThemeConfig>,
  customTheme: Partial<TimelineThemeConfig> = {}
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

  return { ...defaultTheme, ...customTheme };
}

// tipmenu.tsx
export function createTipMenuTheme(
  buttonTheme?: Record<Partial<ButtonVariants["variant"]>, ButtonThemeConfig>,
  customTheme: Partial<TipMenuThemeConfig> = {}
): Record<TipMenuVariant, TipMenuThemeConfig> {
  const defaultTheme: Record<TipMenuVariant, TipMenuThemeConfig> = {
    default: {
      focusBackgroundColor: buttonTheme?.ghost?.focusBackgroundColor,
      backgroundColor: buttonTheme?.ghost?.backgroundColor,
      textColor: buttonTheme?.ghost?.textColor,
      activeBackgroundColor: buttonTheme?.ghost?.activeBackgroundColor,
      hoverBackgroundColor: buttonTheme?.ghost?.hoverBackgroundColor,
    },
    danger: {
      focusBackgroundColor: buttonTheme?.danger?.focusBackgroundColor,
      backgroundColor: buttonTheme?.danger?.backgroundColor,
      textColor: buttonTheme?.danger?.textColor,
      activeBackgroundColor: buttonTheme?.danger?.activeBackgroundColor,
      hoverBackgroundColor: buttonTheme?.danger?.hoverBackgroundColor,
    },
    success: {
      focusBackgroundColor: buttonTheme?.success?.focusBackgroundColor,
      backgroundColor: buttonTheme?.success?.backgroundColor,
      textColor: buttonTheme?.success?.textColor,
      activeBackgroundColor: buttonTheme?.success?.activeBackgroundColor,
      hoverBackgroundColor: buttonTheme?.success?.hoverBackgroundColor,
    },
    primary: {
      focusBackgroundColor: buttonTheme?.primary?.focusBackgroundColor,
      backgroundColor: buttonTheme?.primary?.backgroundColor,
      textColor: buttonTheme?.primary?.textColor,
      activeBackgroundColor: buttonTheme?.primary?.activeBackgroundColor,
      hoverBackgroundColor: buttonTheme?.primary?.hoverBackgroundColor,
    },
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// toggle.tsx
export function createToggleTheme(
  body: BodyThemeConfig,
  custom: Partial<ToggleThemeConfig> = {}
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

  return { ...defaultTheme, ...custom };
}

// toolbar.tsx
export function createToolbarTheme(
  baseButton: Record<ToolbarVariant, ToolbarThemeConfig>,
  customVariants: Partial<Record<ToolbarVariant, ToolbarThemeConfig>> = {}
): Record<ToolbarVariant, ToolbarThemeConfig> {
  const variants: Record<ToolbarVariant, ToolbarThemeConfig> = {
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

  return { ...variants, ...customVariants };
}

// tooltip.tsx
export function createTooltipTheme(
  customTheme: Partial<TooltipThemeConfig> = {}
): TooltipThemeConfig {
  const defaultTheme: TooltipThemeConfig = {
    literalStringBackgroundColor: "#e7e7e7",
    literalStringTextColor: "#111827",
    nodeElementBackgroundColor: "#e7e7e7",
    nodeElementTextColor: "#111827",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    arrowBackgroundColor: "#b9babc",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// thumb-field.tsx
export function createThumbFieldTheme(
  body: BodyThemeConfig,
  custom: Partial<ThumbFieldThemeConfig> = {}
): ThumbFieldThemeConfig {
  const defaultTheme: ThumbFieldThemeConfig = {
    thumbsUpColor: "#61A9F9",
    thumbsDownColor: "rgb(206, 55, 93)",
    inactiveColor: "#9ca3af",
    errorColor: "#dc2626",
    disabledOpacity: 0.5,
  };
  return { ...defaultTheme, ...custom };
}

// treelist.tsx
export function createTreeListTheme(
  body: BodyThemeConfig,
  custom: Partial<TreeListThemeConfig> = {}
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
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// split-pane.tsx
export function createSplitPaneTheme(
  body: BodyThemeConfig,
  customTheme: Partial<SplitPaneThemeConfig> = {}
): SplitPaneThemeConfig {
  const defaultTheme: SplitPaneThemeConfig = {
    backgroundColor: body?.backgroundColor || "#ffffff",
    textColor: body?.textColor || "#111827",
    dividerColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}
