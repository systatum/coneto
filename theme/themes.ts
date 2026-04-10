import { ToolbarVariantType } from "./../components/toolbar";
import { ButtonVariants } from "./../components/button";
import {
  ActionButtonThemeConfig,
  ActionCapsuleThemeConfig,
  AppTheme,
  AvatarThemeConfig,
  BadgeThemeConfig,
  BareThemeConfig,
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
  ToggleboxThemeConfig,
  ToolbarThemeConfig,
  TreeListThemeConfig,
  WindowThemeConfig,
} from "./index";

// Body
export function createBodyTheme(
  customTheme: Partial<BodyThemeConfig> = {}
): BodyThemeConfig {
  const defaultTheme = {
    backgroundColor: "#ffffff",
    textColor: "#000000",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Bare
export function createBareTheme(
  customTheme: Partial<BareThemeConfig> = {}
): BareThemeConfig {
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
  bare: BareThemeConfig,
  customTheme: Partial<ActionCapsuleThemeConfig> = {}
): ActionCapsuleThemeConfig {
  const defaultTheme: ActionCapsuleThemeConfig = {
    activeBackgroundColor: "rgb(226, 224, 224)",
    textColor: bare.textColor || "#343434",
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
  bare: BareThemeConfig,
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
  bare: BareThemeConfig,
  customTheme: Partial<AvatarThemeConfig> = {}
): AvatarThemeConfig {
  const defaultTheme = {
    borderColor: "#f3f4f6",
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  customTheme: Partial<BadgeThemeConfig> = {}
): BadgeThemeConfig {
  const defaultTextColor = bare.textColor;

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
  bare: BareThemeConfig,
  customTheme: Partial<BoxbarThemeConfig> = {}
): BoxbarThemeConfig {
  const defaultTheme: BoxbarThemeConfig = {
    backgroundColor: bare.backgroundColor,
    toggleButtonColor: bare.textColor,
    borderColor: "#d1d5db",
    toggleButtonHoverColor: "#f3f4f6",
    textColor: bare.textColor,
  };

  return { ...defaultTheme, ...customTheme };
}

// button.tsx
export function createButtonTheme(
  customVariants: Partial<
    Record<ButtonVariants["variant"], ButtonThemeConfig>
  > = {}
): Record<string, ButtonThemeConfig> {
  const variants: Record<string, ButtonThemeConfig> = {
    default: {
      backgroundColor: "#dddddd",
      textColor: lightBare.textColor,
      hoverBackgroundColor: "#cccccc",
      activeBackgroundColor: "#b3b3b3",
      focusBackgroundColor: "#B4B4B480",
      dividerColor: "#e5e7eb",
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
      textColor: "black",
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      textDecoration: "none",
      dividerColor: "#e5e7eb",
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: lightBare.textColor,
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
      textColor: lightBare.textColor,
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
  bare: BareThemeConfig,
  custom: Partial<TipMenuContainerThemeConfig> = {}
): TipMenuContainerThemeConfig {
  return {
    backgroundColor: bare?.backgroundColor || "#ffffff",
    borderColor: "#e5e7eb",
    textColor: bare?.textColor || "inherit",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ...custom,
  };
}

// calendar.tsx
export function createCalendarTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<CalendarThemeConfig> = {}
): CalendarThemeConfig {
  const defaultTheme: CalendarThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: bare.textColor || "#111827",

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
  bare: BareThemeConfig,
  custom: Partial<CapsuleThemeConfig> = {}
): CapsuleThemeConfig {
  const defaultTheme: CapsuleThemeConfig = {
    backgroundColor: bare.backgroundColor,
    borderColor: "#ebebeb",
    boxShadow: "0 1px 1px -2px #5b5b5b, 0 1px 1px rgba(0, 0, 0, 0.05)",
    textColor: bare.textColor,

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
  bare: BareThemeConfig,
  custom: Partial<CapsuleTabThemeConfig> = {}
): CapsuleTabThemeConfig {
  const defaultTheme: CapsuleTabThemeConfig = {
    backgroundColor: bare.backgroundColor,
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
  bare: BareThemeConfig,
  customTheme: Partial<CardThemeConfig> = {}
): CardThemeConfig {
  const defaultTheme: CardThemeConfig = {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    dividerColor: "transparent",
    titleColor: bare.textColor,
    subtitleColor: "#8b8e92",
    headerBackground: "transparent",
    footerBackground: "transparent",
    closeIconColor: bare.textColor,
    closeIconHoverBackground: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// chips.tsx
export function createChipsTheme(
  bare: BareThemeConfig,
  custom: Partial<ChipsThemeConfig> = {}
): ChipsThemeConfig {
  return {
    backgroundColor: bare.backgroundColor,
    borderColor: "#d1d5db",
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  customTheme: Partial<ChoiceGroupThemeConfig> = {}
): ChoiceGroupThemeConfig {
  const defaultTheme: ChoiceGroupThemeConfig = {
    borderColor: "#e5e7eb",
    dividerColor: "#e5e7eb",
    labelColor: bare.textColor,
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
  bare: BareThemeConfig,
  customTheme: Partial<CheckboxThemeConfig> = {}
): CheckboxThemeConfig {
  const defaultTheme: CheckboxThemeConfig = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: bare.backgroundColor,
    checkedBackgroundColor: "#61A9F9",
    iconColor: "#ffffff",
    labelColor: bare.textColor,
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ColorboxThemeConfig> = {}
): ColorboxThemeConfig {
  const defaultTheme: ColorboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: bare.textColor,

    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",

    errorBorderColor: fieldLane?.errorBorderColor || "#f87171",
    errorTextColor: fieldLane?.errorColor || "#dc2626",

    disabledBorderColor: fieldLane?.borderColor || "#d1d5db",
    disabledTextColor: fieldLane?.borderColor || "#d1d5db",

    prefixColor: fieldLane?.placeholderColor || "#6b7280",

    boxBackgroundColor: bare.backgroundColor || "#ffffff",
  };

  return { ...defaultTheme, ...custom };
}

// crumb.tsx
export function createCrumbTheme(
  bare: BareThemeConfig,
  custom: Partial<CrumbThemeConfig> = {}
): CrumbThemeConfig {
  const defaultTheme: CrumbThemeConfig = {
    textColor: "#4b5563",
    hoverColor: "#61a9f9",
    lastTextColor: bare.textColor,
    arrowColor: "#9ca3af",
    ellipsisColor: "#6b7280",
    ellipsisHoverColor: "#61a9f9",
  };

  return { ...defaultTheme, ...custom };
}

// combobox.tsx
export function createComboboxTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ComboboxThemeConfig> = {}
): ComboboxThemeConfig {
  const defaultTheme: ComboboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: bare.textColor || "#1f2937",

    highlightBackgroundColor: fieldLane?.highlightBackgroundColor || "#dbeafe",
    selectedBackgroundColor: fieldLane?.selectedBackgroundColor || "#61a9f9",
    selectedTextColor: bare.backgroundColor || "#ffffff",

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
  bare: BareThemeConfig,
  custom: DialogThemeConfig = {}
): DialogThemeConfig {
  const defaultTheme: DialogThemeConfig = {
    borderColor: "#ebebeb",
    textColor: bare.textColor,
    backgroundColor: bare.backgroundColor,
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
  bare: BareThemeConfig,
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
  bare: BareThemeConfig,
  custom: Partial<DormantTextThemeConfig> = {}
): DormantTextThemeConfig {
  const defaultTheme: DormantTextThemeConfig = {
    backgroundColor: bare.backgroundColor,
    hoverBackgroundColor: "#e9e9e9",
    borderColor: "transparent",
    textColor: bare.textColor,
    pencilColor: "#666666",
    actionButtonColor: "#666666",
    actionButtonHoverBackground: "#d1d5db",
  };

  return { ...defaultTheme, ...custom };
}

// drawer-tab.tsx
export function createDrawerTabTheme(
  bare: BareThemeConfig,
  custom: Partial<DrawerTabThemeConfig> = {}
): DrawerTabThemeConfig {
  const defaultTheme: DrawerTabThemeConfig = {
    backgroundColor: bare.backgroundColor,
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  custom: Partial<FieldLaneThemeConfig> = {}
): FieldLaneThemeConfig {
  const defaultTheme: FieldLaneThemeConfig = {
    buttonTextColor: bare.textColor,
    buttonBorderColor: "#d1d5db",
    buttonErrorBorderColor: "#ef4444",
    buttonErrorTextColor: "#b91c1c",

    textColor: bare.textColor,

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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<FileInputBoxThemeConfig> = {}
): FileInputBoxThemeConfig {
  const defaultTheme: FileInputBoxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane.focusedBorderColor || "#3b82f6",
    errorBorderColor: fieldLane.errorBorderColor || "#ef4444",
    textColor: bare.textColor || "#111827",
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<FileDropBoxThemeConfig> = {}
): FileInputBoxThemeConfig {
  const defaultTheme: FileDropBoxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",

    textColor: bare.textColor || "#111827",
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
  bare: BareThemeConfig,
  custom: Partial<FrameThemeConfig> = {}
): FrameThemeConfig {
  const defaultTheme: FrameThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: "#d1d5db",
    titleColor: "#999b9d",
    titleBackgroundColor: bare.backgroundColor || "#ffffff",
    overlayBackgroundColor: bare.backgroundColor || "#ffffff",
    boxShadow: "var(--shadow-xs)",
  };

  return { ...defaultTheme, ...custom };
}

// grid.tsx
export function createGridTheme(
  bare: BareThemeConfig,
  customTheme: Partial<GridThemeConfig> = {}
): GridThemeConfig {
  const defaultTheme: GridThemeConfig = {
    cardBackgroundColor: bare.backgroundColor,
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<ImageboxThemeConfig> = {}
): ImageboxThemeConfig {
  const defaultTheme: ImageboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",

    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#3b82f6",

    textColor: bare.textColor || "#6b7280",

    draggingBackgroundColor: "#eff6ff",
    draggingBorderColor: fieldLane?.focusedBorderColor || "#3b82f6",
    draggingTextColor: fieldLane?.focusedBorderColor || "#3b82f6",

    iconColor: "#c3c3c3",
  };

  return { ...defaultTheme, ...custom };
}

// keynote.tsx
export function createKeynoteTheme(
  bare: BareThemeConfig,
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
  bare: BareThemeConfig,
  customTheme: Partial<ListThemeConfig> = {}
): ListThemeConfig {
  const defaultTheme: ListThemeConfig = {
    backgroundColor: "transparent",
    textColor: bare.textColor,
    hoverBackgroundColor: "#dbeafe",
    hoverTextColor: bare.textColor,
    badgeBackgroundColor: "#488cac",
    borderColor: "#d1d5db",
    mutedTextColor: "#6b7280",
    dragLineColor: "#3b82f6",
    emptyHoverBackgroundColor: "#dbeafe",
    badgeTextColor: "white",
    badgeBorderColor: "#d1d5db",
    toggleBackgroundColor: "#c1d6f1",
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
  bare: BareThemeConfig,
  customTheme: Partial<LoadingSpinnerThemeConfig> = {}
): LoadingSpinnerThemeConfig {
  const defaultTheme: LoadingSpinnerThemeConfig = {
    spinnerColor: "#3b82f6",
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<MoneyboxThemeConfig> = {}
): MoneyboxThemeConfig {
  const defaultTheme: MoneyboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane.borderColor || "#d1d5db",

    focusedBorderColor: fieldLane.focusedBorderColor || "#61A9F9",
    errorBorderColor: fieldLane.errorBorderColor || "#ef4444",

    textColor: bare.textColor || "#111827",
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
  bare: BareThemeConfig,
  custom: Partial<ModalDialogThemeConfig> = {}
): ModalDialogThemeConfig {
  const defaultTheme: ModalDialogThemeConfig = {
    backgroundColor: bare.backgroundColor,
    borderColor: "#ebebeb",
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  custom: Partial<NavTabThemeConfig> = {}
): NavTabThemeConfig {
  return {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    textColor: bare.textColor,

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
  bare: BareThemeConfig,
  custom: Partial<PaperDialogThemeConfig> = {}
): PaperDialogThemeConfig {
  const defaultTheme: PaperDialogThemeConfig = {
    backgroundColor: bare.backgroundColor,
    borderColor: "rgb(235, 235, 235)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textColor: bare.textColor,
    actionHoverBackgroundColor: "#f3f4f6",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
}

// pagination.tsx

export function createPaginationTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PaginationThemeConfig> = {}
): PaginationThemeConfig {
  const defaultTheme: PaginationThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",

    borderColor: fieldLane.borderColor || "#f3f4f6",
    activeBorderColor: fieldLane.focusedBorderColor || "#61A9F9",
    hoverBorderColor: fieldLane.focusedBorderColor || "#61A9F9",

    textColor: bare.textColor || "#374151",
    activeTextColor: bare.textColor || "#111827",

    disabledBackgroundColor: bare.backgroundColor || "#ffffff",
    disabledTextColor: fieldLane.disabledTextColor || "#9ca3af",
  };

  return { ...defaultTheme, ...custom };
}

// pinbox.tsx
export function createPinboxTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PinboxThemeConfig> = {}
): PinboxThemeConfig {
  const defaultTheme: PinboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",
    textColor: bare.textColor || "#1f2937",

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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<PhoneboxThemeConfig> = {}
): PhoneboxThemeConfig {
  const defaultTheme: PhoneboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor: fieldLane?.focusedBorderColor || "#61A9F9",
    textColor: bare.textColor || "#1f2937",

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
  bare: BareThemeConfig,
  customTheme: Partial<RadioThemeConfig> = {}
): RadioThemeConfig {
  const defaultTheme: RadioThemeConfig = {
    borderColor: "#6b7280",
    checkedBorderColor: "#61A9F9",
    backgroundColor: "#ffffff",
    checkedBackgroundColor: "#ffffff",
    checkedOutsideBorderColor: "#61A9F9",
    iconColor: "#ffffff",
    textColor: bare.textColor,
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<RatingThemeConfig> = {}
): RatingThemeConfig {
  const defaultTheme: RatingThemeConfig = {
    starFullColor: "#facc15",
    starEmptyColor: "#ffffff",
    starBorderColor: "#facc15",

    hoverStarColor: "#f59e0b",

    labelTextColor: bare.textColor || "#111827",

    disabledStarColor: fieldLane?.borderColor || "#d1d5db",
    disabledLabelColor: fieldLane?.disabledTextColor || "#9ca3af",
  };

  return { ...defaultTheme, ...custom };
}

// rich-editor.tsx
export function createRichEditorTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  button: Partial<ButtonThemeConfig> = {},
  custom: Partial<RichEditorThemeConfig> = {}
): RichEditorThemeConfig {
  const defaultTheme: RichEditorThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    textColor: bare.textColor || "#111827",
    placeholderColor: fieldLane.placeholderColor || "#9ca3af",
    borderColor: fieldLane.borderColor || "#d1d5db",
    toolbarBackground: bare.backgroundColor || "#f9fafb",
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
  bare: BareThemeConfig,
  custom: Partial<SearchboxThemeConfig> = {}
): SearchboxThemeConfig {
  const defaultTheme: SearchboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    activeBackgroundColor: bare.backgroundColor,
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
  bare: BareThemeConfig,
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
      error: buttonTheme?.danger?.textColor || bare.textColor,
      completed: buttonTheme?.success?.textColor || bare.textColor,
      current: buttonTheme?.success?.textColor || bare.textColor,
      todo: buttonTheme?.default?.textColor || bare.textColor,
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<SelectboxThemeConfig> = {}
): SelectboxThemeConfig {
  const defaultTheme: SelectboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    textColor: bare.textColor || "#111827",

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
  bare: BareThemeConfig,
  customTheme: Partial<SeparatorThemeConfig> = {}
): SeparatorThemeConfig {
  const defaultTheme: SeparatorThemeConfig = {
    containerColor: "#6b7280",
    lineColor: "#111827",
    titleColor: "#6b7280",
    backgroundTitleColor: bare.backgroundColor,
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

export function createSidebarTheme(
  bare: BareThemeConfig,
  custom: Partial<SidebarThemeConfig> = {}
): SidebarThemeConfig {
  const defaultTheme: SidebarThemeConfig = {
    backgroundColor: bare.backgroundColor,
    borderColor: "#e5e7eb",
    boxShadow: "0 0 6px rgba(0,0,0,0.05)",
    textColor: bare.textColor,

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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<SignboxThemeConfig> = {}
): SignboxThemeConfig {
  const defaultTheme: SignboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: bare.textColor || "#111827",

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
  bare: BareThemeConfig,
  customTheme: Partial<StatefulFormThemeConfig> = {}
): StatefulFormThemeConfig {
  const defaultTheme: StatefulFormThemeConfig = {
    backgroundColor: bare.backgroundColor,
    textColor: bare.textColor,
    rowFrameBackgroundColor: "#f3f4f6",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// textarea.tsx
export function createTextareaTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TextareaThemeConfig> = {}
): TextareaThemeConfig {
  const defaultTheme: TextareaThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",

    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor:
      fieldLane?.focusedBorderColor || fieldLane?.placeholderColor,

    textColor: bare.textColor || "#1f2937",

    errorBorderColor: fieldLane?.errorBorderColor || "#ef4444",
    errorTextColor: fieldLane?.errorForeground || "#991b1b",

    disabledBorderColor: "#d1d5db",
    disabledTextColor: "#9ca3af",

    placeholderColor: fieldLane?.placeholderColor || "#9ca3af",
    scrollbarThumbColor: "#3f3f46",

    boxShadow: "0 0 0 1px transparent",
  };

  return { ...defaultTheme, ...custom };
}

// textbox.tsx
export function createTextboxTheme(
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TextboxThemeConfig> = {}
): TextboxThemeConfig {
  const defaultTheme: TextboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",

    borderColor: fieldLane?.borderColor || "#d1d5db",
    focusedBorderColor:
      fieldLane?.focusedBorderColor || fieldLane?.placeholderColor,

    textColor: bare.textColor || "#1f2937",

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
  bare: BareThemeConfig,
  customTheme: Partial<TableThemeConfig> = {}
): TableThemeConfig {
  const defaultTheme: TableThemeConfig = {
    textColor: bare.textColor || "#111827",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

    headerActionBackgroundColor: "linear-gradient(to bottom, #fbf9f9, #f0f0f0)",
    headerActionBorderColor: "rgb(229, 231, 235)",

    headerBackgroundColor: "linear-gradient(to bottom, #f0f0f0, #e4e4e4)",
    headerBorderColor: "rgb(229, 231, 235)",

    rowGroupBackgroundColor: "white",

    rowBackgroundColor: "white",
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
  bare: BareThemeConfig,
  fieldLane: Partial<FieldLaneThemeConfig> = {},
  custom: Partial<TimeboxThemeConfig> = {}
): TimeboxThemeConfig {
  const defaultTheme: TimeboxThemeConfig = {
    backgroundColor: bare.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: bare.textColor || "#111827",

    focusedBorderColor: fieldLane?.focusedBorderColor,

    errorBorderColor: fieldLane?.errorBorderColor,
    errorTextColor: fieldLane?.errorColor,

    colonColor: bare.textColor,
  };

  return { ...defaultTheme, ...custom };
}

// timeline.tsx
export function createTimelineTheme(
  bare: BareThemeConfig,
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
      error: buttonTheme?.danger?.textColor || bare.textColor,
      completed: buttonTheme?.success?.textColor || bare.textColor,
      current: buttonTheme?.success?.textColor || bare.textColor,
      todo: buttonTheme?.default?.textColor || bare.textColor,
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
  bare: BareThemeConfig,
  customTheme: Partial<TipMenuThemeConfig> = {}
): TipMenuThemeConfig {
  const defaultTheme: TipMenuThemeConfig = {
    backgroundColor: bare.backgroundColor,
    textColor: bare.textColor,

    hoverBackgroundColor: "#f2f2f2",
    activeBackgroundColor: "#e5e5e5",

    focusBorderColor: "#4f9cff",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// togglebox.tsx
export function createToggleboxTheme(
  bare: BareThemeConfig,
  custom: Partial<ToggleboxThemeConfig> = {}
): ToggleboxThemeConfig {
  const defaultTheme: ToggleboxThemeConfig = {
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
  baseButton: Record<ToolbarVariantType, ToolbarThemeConfig>,
  customVariants: Partial<Record<ToolbarVariantType, ToolbarThemeConfig>> = {}
): Record<ToolbarVariantType, ToolbarThemeConfig> {
  const variants: Record<ToolbarVariantType, ToolbarThemeConfig> = {
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
    transparent: {
      ...baseButton?.transparent,
      hoverBackgroundColor: baseButton?.transparent?.hoverBackgroundColor,
      activeBackgroundColor: baseButton?.transparent?.activeBackgroundColor,
      focusBackgroundColor: baseButton?.transparent?.focusBackgroundColor,
    },
  };

  return { ...variants, ...customVariants };
}

// thumb-field.tsx
export function createThumbFieldTheme(
  bare: BareThemeConfig,
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
  bare: BareThemeConfig,
  custom: Partial<TreeListThemeConfig> = {}
): TreeListThemeConfig {
  const defaultTheme: TreeListThemeConfig = {
    textColor: bare.textColor,
    backgroundColor: bare.backgroundColor,
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

// window.tsx
export function createWindowTheme(
  bare: BareThemeConfig,
  customTheme: Partial<WindowThemeConfig> = {}
): WindowThemeConfig {
  const defaultTheme: WindowThemeConfig = {
    backgroundColor: bare?.backgroundColor || "#ffffff",
    textColor: bare?.textColor || "#111827",
    dividerColor: "#d1d5db",
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// Light
const lightBody = createBodyTheme();

const lightBare = createBareTheme();

const lightFieldLane = createFieldLaneTheme(lightBare);

const lightActionButton = createActionButtonTheme(lightBare);

const lightActionCapsule = createActionCapsuleTheme(lightBare);

const lightAvatar = createAvatarTheme(lightBare, {
  borderColor: "#e5e7eb",
  overlayBackgroundColor: "rgba(0,0,0,0.4)",
});

const lightBadge = createBadgeTheme(lightBare);

const lightBoxbar = createBoxbarTheme(lightBare);

const lightButton = createButtonTheme();

const lightButtonTipMenuContainer = createTipMenuContainerTheme(lightBare);

const lightCalendar = createCalendarTheme(lightBare, lightFieldLane);

const lightCapsule = createCapsuleTheme(lightBare);

const lightCapsuleTab = createCapsuleTabTheme(lightBare);

const lightCard = createCardTheme(lightBare, {
  backgroundColor: "#ffffff",
  borderColor: "#e5e7eb",
  subtitleColor: "#8b8e92",
  closeIconHoverBackground: "#e5e7eb",
});

const lightChips = createChipsTheme(lightBare);

const lightChoiceGroup = createChoiceGroupTheme(lightBare);

const lightCheckbox = createCheckboxTheme(lightBare);

const lightColorbox = createColorboxTheme(lightBare, lightFieldLane);

const lightCombobox = createComboboxTheme(lightBare, lightFieldLane);

const lightCrumb = createCrumbTheme(lightBare);

const lightDialog = createDialogTheme(lightBare);

const lightDocumentViewer = createDocumentViewerTheme(lightBare);

const lightDormantText = createDormantTextTheme(lightBare);

const lightDrawerTab = createDrawerTabTheme(lightBare);

const lightErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#dd0b0b",
  cubeFaceBorder: "#a80000",
  cubeFaceText: "#ffffff",
  titleColor: "#111111",
});

const lightFileInputBox = createFileInputBoxTheme(lightBare, lightFieldLane);

const lightFileDropBox = createFileDropBoxTheme(lightBare, lightFieldLane);

const lightFrame = createFrameTheme(lightBare);

const lightGrid = createGridTheme(lightBare);

const lightImagebox = createImageboxTheme(lightBare, lightFieldLane);

const lightKeynote = createKeynoteTheme(lightBare);

const lightList = createListTheme(lightBare);

const lightLoadingSkeleton = createLoadingSkeletonTheme();

const lightLoadingSpinner = createLoadingSpinnerTheme(lightBare);

const lightOverlayBlocker = createOverlayBlockerTheme();

const lightMessagebox = createMessageboxTheme();

const lightMoneybox = createMoneyboxTheme(lightBare, lightFieldLane);

const lightModalDialog = createModalDialogTheme(lightBare);

const lightNavTab = createNavTabTheme(lightBare);

const lightPaperDialog = createPaperDialogTheme(lightBare);

const lightPagination = createPaginationTheme(lightBare, lightFieldLane);

const lightPinbox = createPinboxTheme(lightBare, lightFieldLane);

const lightPhonebox = createPhoneboxTheme(lightBare, lightFieldLane);

const lightRadio = createRadioTheme(lightBare);

const lightRating = createRatingTheme(lightBare, lightFieldLane);

const lightRichEditor = createRichEditorTheme(
  lightBare,
  lightFieldLane,
  lightButton?.default
);

const lightSearchbox = createSearchboxTheme(lightBare);

const lightSelectbox = createSelectboxTheme(lightBare, lightFieldLane);

const lightSeparator = createSeparatorTheme(lightBare);

const lightSignbox = createSignboxTheme(lightBare, lightFieldLane);

const lightSidebar = createSidebarTheme(lightBare);

const lightStatusbar = createStatusbarTheme();

const lightStatefulForm = createStatefulFormTheme(lightBare);

const lightStepline = createSteplineTheme(lightBare);

const lightTable = createTableTheme(lightBare);

const lightTextarea = createTextareaTheme(lightBare, lightFieldLane);

const lightTextbox = createTextboxTheme(lightBare, lightFieldLane);

const lightTimebox = createTimeboxTheme(lightBare, lightFieldLane);

const lightTimeline = createTimelineTheme(lightBare);

const lightTipMenu = createTipMenuTheme(lightBare, {
  dangerousBackgroundColor: lightButton.danger.backgroundColor,
  dangerousHoverBackgroundColor: lightButton.danger.hoverBackgroundColor,
  dangerousActiveBackgroundColor: lightButton.danger.activeBackgroundColor,
});

const lightTogglebox = createToggleboxTheme(lightBare);

const lightToolbar = createToolbarTheme({
  default: lightButton.default,
  primary: lightButton.primary,
  danger: lightButton.danger,
  transparent: lightButton.transparent,
  success: lightButton.success,
});

const lightThumbField = createThumbFieldTheme(lightBare);

const lightTreeList = createTreeListTheme(lightBare);

const lightWindow = createWindowTheme(lightBare);

const lightTheme: AppTheme = {
  body: lightBody,

  actionButton: lightActionButton,
  actionCapsule: lightActionCapsule,

  avatar: lightAvatar,
  badge: lightBadge,
  button: lightButton,
  buttonTipMenu: lightButtonTipMenuContainer,
  boxbar: lightBoxbar,
  calendar: lightCalendar,
  capsule: lightCapsule,
  capsuleTab: lightCapsuleTab,
  card: lightCard,
  chips: lightChips,
  choiceGroup: lightChoiceGroup,
  checkbox: lightCheckbox,
  colorbox: lightColorbox,
  combobox: lightCombobox,
  crumb: lightCrumb,
  dialog: lightDialog,
  documentViewer: lightDocumentViewer,
  dormantText: lightDormantText,
  drawerTab: lightDrawerTab,
  errorSlate: lightErrorSlate,
  fieldLane: lightFieldLane,
  fileInputBox: lightFileInputBox,
  fileDropBox: lightFileDropBox,
  frame: lightFrame,
  grid: lightGrid,
  imagebox: lightImagebox,
  keynote: lightKeynote,
  list: lightList,
  loadingSkeleton: lightLoadingSkeleton,
  loadingSpinner: lightLoadingSpinner,
  messagebox: lightMessagebox,
  moneybox: lightMoneybox,
  modalDialog: lightModalDialog,
  navTab: lightNavTab,
  overlayBlocker: lightOverlayBlocker,
  paperDialog: lightPaperDialog,
  pagination: lightPagination,
  pinbox: lightPinbox,
  phonebox: lightPhonebox,
  radio: lightRadio,
  rating: lightRating,
  richEditor: lightRichEditor,
  searchbox: lightSearchbox,
  selectbox: lightSelectbox,
  separator: lightSeparator,
  sidebar: lightSidebar,
  signbox: lightSignbox,
  statusbar: lightStatusbar,
  statefulForm: lightStatefulForm,
  stepline: lightStepline,
  table: lightTable,
  textarea: lightTextarea,
  textbox: lightTextbox,
  timebox: lightTimebox,
  timeline: lightTimeline,
  tipmenu: lightTipMenu,
  thumbField: lightThumbField,
  toolbar: lightToolbar,
  togglebox: lightTogglebox,
  treelist: lightTreeList,
  window: lightWindow,
};

// Dark
const darkBody = createBodyTheme({
  backgroundColor: "#1f2023",
  textColor: "white",
});

const darkBare = createBareTheme({
  backgroundColor: "#111",
  textColor: "#caced4",
  borderColor: "#4b5563",
});

const darkFieldLane = createFieldLaneTheme(darkBare, {
  disabledOpacity: 0.5,
  disabledBorderColor: "#374151",
  disabledTextColor: "#6b7280",

  buttonTextColor: "#e5e7eb",
  buttonBorderColor: "#4b5563",
  buttonErrorBorderColor: "#f87171",
  buttonErrorTextColor: "#fca5a5",

  borderColor: "#4b5563",

  actionColor: "#cbd5e1",
  actionHoverColor: "#616161",

  placeholderColor: "#9ca3af",
  focusedBorderColor: "rgb(105, 85, 193)",
  highlightBackgroundColor: "#0f215d33",
  selectedBackgroundColor: "rgb(105, 85, 193)",

  errorColor: "#f87171",
  errorBorderColor: "#f87171",
  errorBackground: "#991b1b",
  errorForeground: "#fee2e2",

  helperColor: "#9ca3af",
  dividerColor: "#6b7280",
});

const darkActionButton = createActionButtonTheme(darkBare, {
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

const darkActionCapsule = createActionCapsuleTheme(darkBare, {
  activeBackgroundColor: "rgb(57, 62, 65)",
  textColor: "#f9fafb",
  tabTextColor: "rgb(233, 233, 233)",
  borderColor: "#3a3a3f",
});

const darkAvatar = createAvatarTheme(darkBare, {
  textColor: "black",
  overlayBackgroundColor: "rgba(0,0,0,0.6)",
});

const darkButton = createButtonTheme({
  default: {
    backgroundColor: "#2f2f2f",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "#3a3a3a",
    activeBackgroundColor: "#1f1f1f",
    focusBackgroundColor: "#ffffff20",
    dividerColor: "#363636",
  },
  primary: {
    backgroundColor: "rgb(60, 49, 110)",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "rgb(72, 57, 141)",
    activeBackgroundColor: "rgb(50, 40, 90)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
    dividerColor: "#48398dbf",
  },
  danger: {
    backgroundColor: "rgb(177, 30, 66)",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "rgb(147, 21, 52)",
    activeBackgroundColor: "rgb(130, 15, 45)",
    focusBackgroundColor: "rgba(177, 30, 66, 0.5)",
    dividerColor: "#9315348c",
  },
  success: {
    backgroundColor: "#107533",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "#03973d",
    activeBackgroundColor: "#02662f",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
    dividerColor: "rgba(19, 156, 17, 0.69)",
  },
  secondary: {
    backgroundColor: "#272727",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "rgb(39 39 39 / 85%)",
    textDecoration: "none",
    dividerColor: "#363636",
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "#2a2a2a",
    activeBackgroundColor: "#1f1f1f",
    focusBackgroundColor: "#ffffff20",
    dividerColor: "#363636",
  },
  link: {
    backgroundColor: "transparent",
    textColor: "#7ab4ff",
    hoverBackgroundColor: "#1e3a5f",
    activeBackgroundColor: "#162c47",
    focusBackgroundColor: "#7ab4ff80",
    textDecoration: "underline",
    dividerColor: "#48398dbf",
  },
  transparent: {
    backgroundColor: "transparent",
    textColor: darkBare.textColor,
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "#1f1f1f",
    focusBackgroundColor: "#ffffff20",
    dividerColor: "#363636",
  },
  "outline-default": {
    backgroundColor: "transparent",
    textColor: "#a3a3a3",
    hoverBackgroundColor: "#2a2a2a",
    activeBackgroundColor: "#1f1f1f",
    focusBackgroundColor: "#ffffff30",
    borderColor: "#555",
    dividerColor: "#363636",
  },
  "outline-primary": {
    backgroundColor: "transparent",
    textColor: "rgb(120, 100, 220)",
    hoverBackgroundColor: "rgba(72, 57, 141, 0.2)",
    activeBackgroundColor: "rgba(50, 40, 90, 0.5)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
    borderColor: "rgb(72, 57, 141)",
    dividerColor: "#48398dbf",
  },
  "outline-danger": {
    backgroundColor: "transparent",
    textColor: "rgb(200, 60, 90)",
    hoverBackgroundColor: "rgba(147, 21, 52, 0.2)",
    activeBackgroundColor: "rgba(130, 15, 45, 0.5)",
    focusBackgroundColor: "rgba(177, 30, 66, 0.5)",
    borderColor: "rgb(177, 30, 66)",
    dividerColor: "#9315348c",
  },
  "outline-success": {
    backgroundColor: "transparent",
    textColor: "#2ecc71",
    hoverBackgroundColor: "rgba(3, 151, 61, 0.2)",
    activeBackgroundColor: "rgba(2, 102, 47, 0.5)",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
    borderColor: "#03973d",
    dividerColor: "rgba(19, 156, 17, 0.69)",
  },
});

const darkButtonTipMenuContainer = createTipMenuContainerTheme(darkBare, {
  backgroundColor: "rgb(35, 35, 35)",
  borderColor: "#303030",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
});

const darkBadge = createBadgeTheme(darkBare, {
  borderColor: "rgb(55, 55, 55)",
  circleColor: "#f9fafb",
  action: {
    hoverBackgroundColor: "#374151",
    activeBackgroundColor: "#4b5563",
    focusRingColor: "#ffffff33",
    disabledOpacity: 0.4,
  },
});

const darkBoxbar = createBoxbarTheme(darkBare, {
  borderColor: "#333333",
  toggleButtonColor: "#f5f5f5",
  toggleButtonHoverColor: "#222222",
});

const darkCalendar = createCalendarTheme(darkBare, darkFieldLane, {
  dayTextColor: "#d1d5db",
  disabledDateColor: "#4b5563",
  weekendDateColor: "#fca5a5",

  rangeDateBackgroundColor: "rgb(124, 101, 207)",
  rangeDateTextColor: "#ffffff",
  hightlightDateColor: "rgb(90, 94, 214)",
  highlightedDateTextColor: "#ffffff",

  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
});

const darkCapsule = createCapsuleTheme(darkBare, {
  borderColor: "#303030",
  boxShadow: "0 1px 2px rgba(0,0,0,0.4)",

  tab: {
    textColor: "#a3a3a3",
    activeTextColor: "#d4d4d4",
  },

  active: {
    backgroundColor: "#303030",
  },

  hover: {
    borderColor: "#303030",
  },
});

const darkCapsuleTab = createCapsuleTabTheme(darkBare, {
  backgroundColor: "#262627",
  borderColor: "#303030",
  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
  activeBackgroundColor: "#303030",
});

const darkCard = createCardTheme(darkBare, {
  backgroundColor: "rgb(31, 31, 33)",
  dividerColor: "transparent",
  borderColor: "#374151",
  titleColor: "#f9fafb",
  subtitleColor: "#9ca3af",
  closeIconColor: "#f9fafb",
  closeIconHoverBackground: "#374151",
});

const darkChips = createChipsTheme(darkBare, {
  backgroundColor: "rgb(35,35,35)",
  borderColor: "rgb(55,55,55)",
  textColor: darkBare.textColor,
  mutedTextColor: "#9ca3af",

  hoverBackgroundColor: "rgba(80,80,120,0.4)",
  selectedBackgroundColor: "rgba(80,80,120,0.4)",

  dividerColor: "rgba(255,255,255,0.08)",

  boxShadow: "0 1px 2px rgba(0,0,0,0.8)",
});

const darkChoiceGroup = createChoiceGroupTheme(darkBare, {
  borderColor: "#374151",
  dividerColor: "#4b5563",
  labelColor: "#f9fafb",
  backgroundColor: "#1f2937",
  descriptionColor: "#d1d5db",
});

const darkCheckbox = createCheckboxTheme(darkBare, {
  borderColor: "rgb(55, 59, 65)",
  backgroundColor: "rgb(32, 33, 35)",
  checkedBorderColor: "rgb(21, 82, 164)",
  checkedBackgroundColor: "#1465d3bf",
  iconColor: "#f9fafb",
  labelColor: "#f9fafb",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

const darkColorbox = createColorboxTheme(darkBare, darkFieldLane);

const darkCombobox = createComboboxTheme(darkBare, darkFieldLane, {
  groupBackgroundColor: "rgb(35 37 41)",
});

export const darkCrumb = createCrumbTheme(darkBare, {
  hoverColor: darkButton?.primary?.hoverBackgroundColor,
  textColor: "rgb(160, 160, 160)",
  arrowColor: "#9ca3af",
  ellipsisColor: "#9ca3af",
  ellipsisHoverColor: darkButton?.primary?.hoverBackgroundColor,
});

const darkDialog = createDialogTheme(darkBare, {
  backgroundColor: "rgb(26, 26, 26)",
  borderColor: "#303030",
  boxShadow: "rgba(0, 0, 0, 0.65) 0px 8px 24px",
  subtitleColor: "#a3a3a3",
});

const darkDocumentViewer = createDocumentViewerTheme(darkBare, {
  backgroundColor: "#434345",
  toolbarBackgroundColor: "#020617",
  textColor: "#e5e7eb",
  hoverBoxBorderColor: "#3b82f6",
  hoverBoxTextColor: "#020617",
  hoverBoxBackgroundColor: "rgba(59, 130, 246, 0.15)",
});

const darkDormantText = createDormantTextTheme(darkBare, {
  hoverBackgroundColor: "rgb(26, 26, 26)",
  borderColor: "rgb(26, 26, 26)",
  pencilColor: "#ccc",
  actionButtonColor: "#ccc",
  actionButtonHoverBackground: "#363636",
});

const darkDrawerTab = createDrawerTabTheme(darkBare, {
  borderColor: "#303030",
  hoverBackgroundColor: "#1f1f1f",
  headerBackgroundColor: "#1a1a1a",
  closeButtonHoverBackground: "#363636",
  dividerColor: "#3f3f46",
});

const darkErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#ff4d4f",
  cubeFaceBorder: "#a8071a",
  cubeFaceText: "#ffffff",
  titleColor: "#ffffff",
});

const darkFileInputBox = createFileInputBoxTheme(darkBare, darkFieldLane, {
  defaultGradientColor: "#9ca3af",
  errorGradientColor: "#dc2626",
  disabledGradientColor: "#9ca3af",

  dragActiveColor: "#60a5fa",
  dragActiveBackgroundColor: "#eff6ff",
});

const darkFileDropBox = createFileDropBoxTheme(darkBare, darkFieldLane, {
  defaultGradientColor: "#9ca3af",
  errorGradientColor: "#dc2626",
  dragActiveGradientColor: "#3b82f6",
  disabledGradientColor: "#9ca3af",

  progressBackgroundColor: "#374151",
  progressBarColor: "#60a5fa",
  progressTextColor: "#e5e7eb",

  iconColor: "#9ca3af",

  dragActiveBackgroundColor: "#1e3a8a",
  dragActiveTextColor: "#93c5fd",
});

const darkFrame = createFrameTheme(darkBare, {
  backgroundColor: "rgb(31, 32, 35)",
  borderColor: "#374151",
  titleColor: darkBare.textColor,
  titleBackgroundColor: "rgb(31, 32, 35)",
  overlayBackgroundColor: "rgb(31, 32, 35)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
});

const darkGrid = createGridTheme(darkBare, {
  cardBackgroundColor: "#1a1a1a",
  cardHoverBackgroundColor: "#2a2a2a",
  cardSelectedBackgroundColor: "#1e3a5f",
  cardBorderColor: "#333333",
  cardShadow: "0 1px 3px rgba(0,0,0,0.6)",
  thumbnailBackgroundColor: "#2a2a2a",
});

const darkImagebox = createImageboxTheme(darkBare, darkFieldLane, {
  draggingBackgroundColor: "#1e3a8a33",
  draggingBorderColor: "#60a5fa",
  draggingTextColor: "#60a5fa",

  iconColor: "#9ca3af",
});

const darkKeynote = createKeynoteTheme(darkBare, {
  keyColor: "rgb(243, 244, 246)",
  valueColor: "#f3f4f6",
});

const darkList = createListTheme(darkBare, {
  backgroundColor: "rgb(26, 26, 26)",
  textColor: "#e5e7eb",
  hoverBackgroundColor: "#212c37",
  borderColor: "#1f2937",
  mutedTextColor: "#9ca3af",
  dragLineColor: "#264c7b",
  badgeBackgroundColor: "rgb(13 21 25)",
  emptyHoverBackgroundColor: "#212c37",
  badgeTextColor: "white",
  badgeBorderColor: "#3f3f46",
  toggleBackgroundColor: "#1e3a5f",
  hoverTextColor: "#111111",
});

const darkLoadingSkeleton = createLoadingSkeletonTheme({
  baseColor: "#2b313a",
  highlightColor: "#3b424c",
});

const darkLoadingSpinner = createLoadingSpinnerTheme(darkBare, {
  spinnerColor: "rgb(142 214 255)",
});

const darkMessagebox = createMessageboxTheme({
  primary: {
    backgroundColor: "#1e293b",
    textColor: "#93c5fd",
    activeColor: "#60a5fa",
  },
  success: {
    backgroundColor: "#1f2d1f",
    textColor: "#86efac",
    activeColor: "#4ade80",
  },
  danger: {
    backgroundColor: "#2d1f1f",
    textColor: "#fca5a5",
    activeColor: "#f87171",
  },
  warning: {
    backgroundColor: "#2d241f",
    textColor: "#fdba74",
    activeColor: "#fb923c",
  },
});

const darkMoneybox = createMoneyboxTheme(darkBare, darkFieldLane);

const darkModalDialog = createModalDialogTheme(darkBare, {
  backgroundColor: "#272727",
  borderColor: "#303030",
  textColor: darkBare.textColor,
  subtitleColor: "#9ca3af",
  dividerColor: "rgb(60, 49, 110)",
});

const darkNavTab = createNavTabTheme(darkBare, {
  backgroundColor: "rgb(35, 35, 35)",
  borderColor: "rgb(26, 26, 26)",
  textColor: darkBare.textColor,

  hoverBackgroundColor: "rgba(52, 52, 52, 0.5)",
  activeBackgroundColor: "rgba(52, 52, 52, 0.8)",
  selectedBackgroundColor: "rgba(52, 52, 52, 0.5)",

  indicatorColor: "rgb(85, 65, 160)",
  boxShadow: "0 1px 4px -3px rgba(0,0,0,0.8)",

  activeInsetShadow: `
    inset 0 0.5px 3px rgba(255,255,255,0.06),
    inset 0 -0.5px 0.5px rgba(0,0,0,0.8)
  `,
});

const darkOverlayBlocker = createOverlayBlockerTheme({
  backgroundColor: "rgb(17 17 17 / 80%)",
  backdropFilter: "blur(1px)",
});

const darkPaperDialog = createPaperDialogTheme(darkBare, {
  backgroundColor: darkBare.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  textColor: darkBare.textColor,
  actionHoverBackgroundColor: "#363636",
});

const darkPagination = createPaginationTheme(darkBare, darkFieldLane, {
  borderColor: "rgb(55, 65, 81)",
  activeBorderColor: darkFieldLane?.focusedBorderColor,
  hoverBorderColor: darkFieldLane?.focusedBorderColor,

  textColor: "#d1d5db",
  activeTextColor: "#fff",

  disabledBackgroundColor: "rgb(56, 58, 61)",
  disabledTextColor: "rgb(160, 160, 160)",
});

const darkPinbox = createPinboxTheme(darkBare, darkFieldLane);

const darkPhonebox = createPhoneboxTheme(darkBare, darkFieldLane);

const darkRadio = createRadioTheme(darkBare, {
  borderColor: "#374151",
  checkedBorderColor: "#1465d3bf",
  checkedOutsideBorderColor: "#374151",
  backgroundColor: "inherit",
  checkedBackgroundColor: "white",
  textColor: "#ffffff",
  descriptionColor: "#d1d5db",

  highlightCheckedBackgroundColor: "#1465d333",
  highlightBackgroundColor: "#2563EB55",

  highlightBorderColor: "rgb(75, 85, 99)",
  highlightCheckedBorderColor: "#1465d3bf",
});

const darkRating = createRatingTheme(darkBare, darkFieldLane, {
  starFullColor: "#facc15",
  starEmptyColor: "#111827",
  starBorderColor: "#fbbf24",

  hoverStarColor: "#f59e0b",
});

const darkRichEditor = createRichEditorTheme(
  darkBare,
  darkFieldLane,
  darkButton?.default,
  {
    textColor: "#f9fafb",
    borderColor: "#374151",
    scrollThumb: "#52525b",
    toolbarBackground: darkButton?.default?.backgroundColor,
    preBackgroundColor: "#2D2D2D",
  }
);

const darkSearchbox = createSearchboxTheme(darkBare, {
  backgroundColor: darkBare.backgroundColor,
  textColor: darkBare.textColor,
  activeBackgroundColor: "rgb(26, 26, 26)",
  borderColor: "#303030",
  focusBorderColor: "rgb(85, 65, 160)",
  focusShadow: "0 0 0 1px rgb(85, 65, 160)",
  iconColor: "#a1a1aa",
  clearIconColor: "#a1a1aa",
});

const darkSelectbox = createSelectboxTheme(darkBare, darkFieldLane);

const darkSeparator = createSeparatorTheme(darkBare, {
  containerColor: "#d1d5db",
  lineColor:
    "rgb(43, 43, 43) 0px 2px 2px inset, rgb(130, 130, 130) 0px -1px 1px inset",
  titleColor: "rgb(171, 171, 171)",
  backgroundTitleColor: "#1f2023",
});

const darkSignbox = createSignboxTheme(darkBare, darkFieldLane);

const darkSidebar = createSidebarTheme(darkBare, {
  backgroundColor: darkBare.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 0 8px rgba(0,0,0,0.4)",

  item: {
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "#404040",
  },

  toggle: {
    backgroundColor: darkBare.backgroundColor,
    borderColor: "#303030",
    hoverBackgroundColor: "#363636",
  },
});

const darkStatusbar = createStatusbarTheme({
  backgroundColor: "#272727",
  borderColor: "#303030",
  boxShadow: "inset 0 0px 0.5px rgba(255,255,255,0.05)",
  textColor: "#d4d4d4",

  item: {
    activeBackgroundColor: "#363636",
    hoverBackgroundColor: "#404040",
  },
});

const darkStatefulForm = createStatefulFormTheme(darkBare, {
  rowFrameBackgroundColor: "rgb(48, 48, 48)",
});

const darkStepline = createSteplineTheme(darkBare, darkButton);

const darkTable = createTableTheme(darkBare, {
  textColor: darkBare.textColor,
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

  headerActionBackgroundColor:
    "linear-gradient(rgb(33, 33, 33), rgb(37, 38, 38))",
  headerActionBorderColor: "rgb(61, 61, 61)",

  headerBackgroundColor: "linear-gradient(rgb(42, 42, 42), rgb(41, 44, 46))",
  headerBorderColor: "rgb(39, 39, 48)",

  rowGroupBackgroundColor: "rgb(31, 31, 31)",

  rowBackgroundColor: "rgb(26, 26, 26)",
  rowBorderColor: "rgb(39, 39, 48)",
  rowHoverBackgroundColor: "#292c2e",
  rowSelectedBackgroundColor: "#303438",
  rowSubtitleTextColor: "#d1d5db",
  rowContentBackgroundColor:
    "linear-gradient(to bottom, #1a1a1a 0%, #222222 35%, #1f1f1f 100%)",
  rowContentBoxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 5px inset",

  summaryBackgroundColor: "linear-gradient(#29282b, #323232)",
  summaryBorderColor: "rgb(39, 39, 48)",

  toggleRowBackgroundColor: "#374151",
});

const darkTextarea = createTextareaTheme(darkBare, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
  scrollbarThumbColor: "#52525b",
});

const darkTextbox = createTextboxTheme(darkBare, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
});

const darkTimebox = createTimeboxTheme(darkBare, darkFieldLane);

const darkTimeline = createTimelineTheme(darkBare, darkButton);

const darkTipMenu = createTipMenuTheme(darkBare, {
  hoverBackgroundColor: "#2a2a2a",
  activeBackgroundColor: "#333333",
  backgroundColor: "inherit",
  dangerousBackgroundColor: darkButton.danger.backgroundColor,
  dangerousHoverBackgroundColor: darkButton.danger.hoverBackgroundColor,
  dangerousActiveBackgroundColor: darkButton.danger.activeBackgroundColor,
});

const darkThumbField = createThumbFieldTheme(darkBare, {
  thumbsUpColor: "rgb(134, 111, 238)",
  thumbsDownColor: "rgb(236, 65, 108)",
  inactiveColor: "#6b7280",
  errorColor: "#f87171",
});

const darkTogglebox = createToggleboxTheme(darkBare, {
  backgroundColor: "rgb(80, 80, 80)",
  checkedBackgroundColor: darkButton?.primary?.hoverBackgroundColor,
  thumbColor: "#f5f5f5",
  borderColor: "#303030",
  textColor: "#f5f5f5",
  descriptionColor: "#9ca3af",
  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
});

const darkToolbar = createToolbarTheme({
  default: darkButton.default,
  primary: darkButton.primary,
  danger: darkButton.danger,
  transparent: darkButton.transparent,
  success: darkButton.success,
});

const darkTreeList = createTreeListTheme(darkBare, {
  textColor: "#f9fafb",
  backgroundColor: "#1f2023",
  hoverBackgroundColor: "#1f2937",
  selectedBackgroundColor: "#1f2937",
  highlightedText: "#374151",

  dividerHierarchyColor: "rgba(63, 62, 62, 0.35)",
  dividerHierarchyRelatedColor: "rgb(115, 115, 115)",
  dividerHierarchySelectedColor: "#485c7d",
});

const darkWindow = createWindowTheme(darkBare, {
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
  buttonTipMenu: darkButtonTipMenuContainer,
  boxbar: darkBoxbar,
  calendar: darkCalendar,
  capsule: darkCapsule,
  capsuleTab: darkCapsuleTab,
  card: darkCard,
  chips: darkChips,
  choiceGroup: darkChoiceGroup,
  checkbox: darkCheckbox,
  colorbox: darkColorbox,
  combobox: darkCombobox,
  crumb: darkCrumb,
  dialog: darkDialog,
  documentViewer: darkDocumentViewer,
  dormantText: darkDormantText,
  drawerTab: darkDrawerTab,
  errorSlate: darkErrorSlate,
  fieldLane: darkFieldLane,
  fileInputBox: darkFileInputBox,
  fileDropBox: darkFileDropBox,
  frame: darkFrame,
  grid: darkGrid,
  imagebox: darkImagebox,
  keynote: darkKeynote,
  list: darkList,
  loadingSkeleton: darkLoadingSkeleton,
  loadingSpinner: darkLoadingSpinner,
  messagebox: darkMessagebox,
  moneybox: darkMoneybox,
  modalDialog: darkModalDialog,
  navTab: darkNavTab,
  overlayBlocker: darkOverlayBlocker,
  paperDialog: darkPaperDialog,
  pagination: darkPagination,
  pinbox: darkPinbox,
  phonebox: darkPhonebox,
  radio: darkRadio,
  rating: darkRating,
  richEditor: darkRichEditor,
  searchbox: darkSearchbox,
  selectbox: darkSelectbox,
  separator: darkSeparator,
  sidebar: darkSidebar,
  signbox: darkSignbox,
  statusbar: darkStatusbar,
  statefulForm: darkStatefulForm,
  stepline: darkStepline,
  table: darkTable,
  textarea: darkTextarea,
  textbox: darkTextbox,
  timebox: darkTimebox,
  timeline: darkTimeline,
  tipmenu: darkTipMenu,
  thumbField: darkThumbField,
  togglebox: darkTogglebox,
  toolbar: darkToolbar,
  treelist: darkTreeList,
  window: darkWindow,
};

// Themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
