import { ToolbarVariantType } from "./../components/toolbar";
import { ButtonVariants } from "./../components/button";
import {
  ActionButtonThemeConfig,
  ActionCapsuleThemeConfig,
  AppTheme,
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
    backgroundColor: body?.backgroundColor,
    toggleButtonColor: body?.textColor,
    borderColor: "#d1d5db",
    toggleButtonHoverColor: "#f3f4f6",
    textColor: body?.textColor,
  };

  return { ...defaultTheme, ...customTheme };
}

// button.tsx
export function createButtonTheme(
  body: BodyThemeConfig,
  customVariants: Partial<
    Record<ButtonVariants["variant"], ButtonThemeConfig>
  > = {}
): Record<string, ButtonThemeConfig> {
  const variants: Record<string, ButtonThemeConfig> = {
    default: {
      backgroundColor: "#ececec",
      textColor: "black",
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      textDecoration: "none",
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
      backgroundColor: "#dddddd",
      textColor: lightBody.textColor,
      hoverBackgroundColor: "#cccccc",
      activeBackgroundColor: "#b3b3b3",
      focusBackgroundColor: "#B4B4B480",
      dividerColor: "#e5e7eb",
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: lightBody.textColor,
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
      textColor: lightBody.textColor,
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
  custom: Partial<TipMenuContainerThemeConfig> = {}
): TipMenuContainerThemeConfig {
  return {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
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
    backgroundColor: body?.backgroundColor,
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
    backgroundColor: body?.backgroundColor,
    borderColor: "#d1d5db",
    textColor: body?.textColor,
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
    backgroundColor: body?.backgroundColor,
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
    backgroundColor: body?.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body?.textColor || "#1f2937",

    highlightBackgroundColor: fieldLane?.highlightBackgroundColor || "#dbeafe",
    selectedBackgroundColor: fieldLane?.selectedBackgroundColor || "#61a9f9",
    selectedTextColor: body?.backgroundColor || "#ffffff",

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
    backgroundColor: body?.backgroundColor,
    textColor: body?.textColor,
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
  body: { backgroundColor?: string; textColor?: string },
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
  body: { backgroundColor?: string; textColor?: string },
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
    cardBackgroundColor: body?.backgroundColor,
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
  body: BodyThemeConfig,
  customTheme: Partial<LoadingSpinnerThemeConfig> = {}
): LoadingSpinnerThemeConfig {
  const defaultTheme: LoadingSpinnerThemeConfig = {
    color: "#3b82f6",
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
      container: "#e7f2fc",
      text: "#2a63b4",
      active: "#1f4a89",
    },
    success: {
      container: "#e9f3e8",
      text: "#43843d",
      active: "#30602c",
    },
    danger: {
      container: "#f6e7e7",
      text: "#b92c25",
      active: "#891f1a",
    },
    warning: {
      container: "#fbf0e4",
      text: "#9e5b20",
      active: "#734418",
    },
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// moneybox.tsx
export function createMoneyboxTheme(
  body: { backgroundColor?: string; textColor?: string },
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
    backgroundColor: body?.backgroundColor,
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
  body: { backgroundColor?: string; textColor?: string },
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
    labelColor: body.textColor,
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
    backgroundColor: body?.backgroundColor || "#ffffff",
    activeBackgroundColor: body?.backgroundColor,
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
    titleColor: "#6b7280",
    backgroundTitleColor: body?.backgroundColor,
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
    backgroundColor: body?.backgroundColor,
    textColor: body?.textColor,
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
    textColor: body?.textColor || "#111827",
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

    colonColor: body?.textColor,
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
  body: BodyThemeConfig,
  customTheme: Partial<TipMenuThemeConfig> = {}
): TipMenuThemeConfig {
  const defaultTheme: TipMenuThemeConfig = {
    backgroundColor: body?.backgroundColor,
    textColor: body.textColor,

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
  body: BodyThemeConfig,
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

// window.tsx
export function createWindowTheme(
  body: BodyThemeConfig,
  customTheme: Partial<WindowThemeConfig> = {}
): WindowThemeConfig {
  const defaultTheme: WindowThemeConfig = {
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

const lightFieldLane = createFieldLaneTheme(lightBody);

const lightActionButton = createActionButtonTheme(lightBody);

const lightActionCapsule = createActionCapsuleTheme(lightBody);

const lightAvatar = createAvatarTheme(lightBody, {
  borderColor: "#e5e7eb",
  overlayBackground: "rgba(0,0,0,0.4)",
});

const lightBadge = createBadgeTheme(lightBody);

const lightBoxbar = createBoxbarTheme(lightBody);

const lightButton = createButtonTheme(lightBody);

const lightButtonTipMenuContainer = createTipMenuContainerTheme({
  backgroundColor: lightBody?.backgroundColor,
});

const lightCalendar = createCalendarTheme(lightBody, lightFieldLane);

const lightCapsule = createCapsuleTheme(lightBody);

const lightCapsuleTab = createCapsuleTabTheme(lightBody);

const lightCard = createCardTheme(lightBody, {
  backgroundColor: "#ffffff",
  borderColor: "#e5e7eb",
  subtitleColor: "#8b8e92",
  closeIconHoverBackground: "#e5e7eb",
});

const lightChips = createChipsTheme(lightBody);

const lightChoiceGroup = createChoiceGroupTheme(lightBody);

const lightCheckbox = createCheckboxTheme(lightBody);

const lightColorbox = createColorboxTheme(lightBody, lightFieldLane);

const lightCombobox = createComboboxTheme(lightBody, lightFieldLane);

const lightCrumb = createCrumbTheme(lightBody);

const lightDialog = createDialogTheme(lightBody);

const lightDocumentViewer = createDocumentViewerTheme(lightBody);

const lightDormantText = createDormantTextTheme(lightBody);

const lightDrawerTab = createDrawerTabTheme(lightBody);

const lightErrorSlate = createErrorSlateTheme({
  cubeFaceBackground: "#dd0b0b",
  cubeFaceBorder: "#a80000",
  cubeFaceText: "#ffffff",
  titleColor: "#111111",
});

const lightFileInputBox = createFileInputBoxTheme(lightBody, lightFieldLane);

const lightFileDropBox = createFileDropBoxTheme(lightBody, lightFieldLane);

const lightFrame = createFrameTheme(lightBody);

const lightGrid = createGridTheme(lightBody);

const lightImagebox = createImageboxTheme(lightBody, lightFieldLane);

const lightKeynote = createKeynoteTheme(lightBody);

const lightList = createListTheme(lightBody);

const lightLoadingSkeleton = createLoadingSkeletonTheme();

const lightLoadingSpinner = createLoadingSpinnerTheme(lightBody);

const lightOverlayBlocker = createOverlayBlockerTheme();

const lightMessagebox = createMessageboxTheme();

const lightMoneybox = createMoneyboxTheme(lightBody, lightFieldLane);

const lightModalDialog = createModalDialogTheme(lightBody);

const lightNavTab = createNavTabTheme(lightBody);

const lightPaperDialog = createPaperDialogTheme(lightBody);

const lightPagination = createPaginationTheme(lightBody, lightFieldLane);

const lightPinbox = createPinboxTheme(lightBody, lightFieldLane);

const lightPhonebox = createPhoneboxTheme(lightBody, lightFieldLane);

const lightRadio = createRadioTheme(lightBody);

const lightRating = createRatingTheme(lightBody, lightFieldLane);

const lightRichEditor = createRichEditorTheme(
  lightBody,
  lightFieldLane,
  lightButton?.default
);

const lightSearchbox = createSearchboxTheme(lightBody);

const lightSelectbox = createSelectboxTheme(lightBody, lightFieldLane);

const lightSeparator = createSeparatorTheme(lightBody);

const lightSignbox = createSignboxTheme(lightBody, lightFieldLane);

const lightSidebar = createSidebarTheme(lightBody);

const lightStatusbar = createStatusbarTheme();

const lightStatefulForm = createStatefulFormTheme(lightBody);

const lightStepline = createSteplineTheme(lightBody);

const lightTable = createTableTheme(lightBody);

const lightTextarea = createTextareaTheme(lightBody, lightFieldLane);

const lightTextbox = createTextboxTheme(lightBody, lightFieldLane);

const lightTimebox = createTimeboxTheme(lightBody, lightFieldLane);

const lightTimeline = createTimelineTheme(lightBody);

const lightTipMenu = createTipMenuTheme(lightBody, {
  dangerousBackgroundColor: lightButton.danger.backgroundColor,
  dangerousHoverBackgroundColor: lightButton.danger.hoverBackgroundColor,
  dangerousActiveBackgroundColor: lightButton.danger.activeBackgroundColor,
});

const lightTogglebox = createToggleboxTheme(lightBody);

const lightToolbar = createToolbarTheme({
  default: lightButton.default,
  primary: lightButton.primary,
  danger: lightButton.danger,
  transparent: lightButton.transparent,
  success: lightButton.success,
});

const lightThumbField = createThumbFieldTheme(lightBody);

const lightTreeList = createTreeListTheme(lightBody);

const lightWindow = createWindowTheme(lightBody);

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
  backgroundColor: "#111",
  textColor: "#caced4",
});

const darkFieldLane = createFieldLaneTheme(darkBody, {
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
  textColor: "black",
  overlayBackground: "rgba(0,0,0,0.6)",
});

const darkButton = createButtonTheme(darkBody, {
  default: {
    backgroundColor: "#272727",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "rgb(39 39 39 / 85%)",
    textDecoration: "none",
    dividerColor: "#363636",
  },
  primary: {
    backgroundColor: "rgb(60, 49, 110)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(72, 57, 141)",
    activeBackgroundColor: "rgb(50, 40, 90)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
    dividerColor: "#48398dbf",
  },
  danger: {
    backgroundColor: "rgb(177, 30, 66)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(147, 21, 52)",
    activeBackgroundColor: "rgb(130, 15, 45)",
    focusBackgroundColor: "rgba(177, 30, 66, 0.5)",
    dividerColor: "#9315348c",
  },
  success: {
    backgroundColor: "#107533",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#03973d",
    activeBackgroundColor: "#02662f",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
    dividerColor: "rgba(19, 156, 17, 0.69)",
  },
  secondary: {
    backgroundColor: "#2f2f2f",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#3a3a3a",
    activeBackgroundColor: "#1f1f1f",
    focusBackgroundColor: "#ffffff20",
    dividerColor: "#363636",
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: darkBody.textColor,
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
    textColor: darkBody.textColor,
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

const darkButtonTipMenuContainer = createTipMenuContainerTheme({
  backgroundColor: "rgb(35, 35, 35)",
  borderColor: "#303030",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
});

const darkBadge = createBadgeTheme(darkBody, {
  borderColor: "rgb(55, 55, 55)",
  circleColor: "#f9fafb",
  action: {
    hoverBackgroundColor: "#374151",
    activeBackgroundColor: "#4b5563",
    focusRingColor: "#ffffff33",
    disabledOpacity: 0.4,
  },
});

const darkBoxbar = createBoxbarTheme(darkBody, {
  borderColor: "#333333",
  toggleButtonColor: "#f5f5f5",
  toggleButtonHoverColor: "#222222",
});

const darkCalendar = createCalendarTheme(darkBody, darkFieldLane, {
  dayTextColor: "#d1d5db",
  disabledDateColor: "#4b5563",
  weekendDateColor: "#fca5a5",

  rangeDateBackgroundColor: "rgb(124, 101, 207)",
  rangeDateTextColor: "#ffffff",
  hightlightDateColor: "rgb(90, 94, 214)",
  highlightedDateTextColor: "#ffffff",

  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
});

const darkCapsule = createCapsuleTheme(darkBody, {
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

const darkCapsuleTab = createCapsuleTabTheme(darkBody, {
  backgroundColor: "#262627",
  borderColor: "#303030",
  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
  activeBackgroundColor: "#303030",
});

const darkCard = createCardTheme(darkBody, {
  backgroundColor: "rgb(31, 31, 33)",
  dividerColor: "transparent",
  borderColor: "#374151",
  titleColor: "#f9fafb",
  subtitleColor: "#9ca3af",
  closeIconColor: "#f9fafb",
  closeIconHoverBackground: "#374151",
});

const darkChips = createChipsTheme(darkBody, {
  backgroundColor: "rgb(35,35,35)",
  borderColor: "rgb(55,55,55)",
  textColor: darkBody?.textColor,
  mutedTextColor: "#9ca3af",

  hoverBackgroundColor: "rgba(80,80,120,0.4)",
  selectedBackgroundColor: "rgba(80,80,120,0.4)",

  dividerColor: "rgba(255,255,255,0.08)",

  boxShadow: "0 1px 2px rgba(0,0,0,0.8)",
});

const darkChoiceGroup = createChoiceGroupTheme(darkBody, {
  borderColor: "#374151",
  dividerColor: "#4b5563",
  labelColor: "#f9fafb",
  backgroundColor: "#1f2937",
  descriptionColor: "#d1d5db",
});

const darkCheckbox = createCheckboxTheme(darkBody, {
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

const darkColorbox = createColorboxTheme(darkBody, darkFieldLane);

const darkCombobox = createComboboxTheme(darkBody, darkFieldLane, {
  groupBackgroundColor: "rgb(35 37 41)",
});

export const darkCrumb = createCrumbTheme(darkBody, {
  hoverColor: darkButton?.primary?.hoverBackgroundColor,
  textColor: "rgb(160, 160, 160)",
  arrowColor: "#9ca3af",
  ellipsisColor: "#9ca3af",
  ellipsisHoverColor: darkButton?.primary?.hoverBackgroundColor,
});

const darkDialog = createDialogTheme(darkBody, {
  backgroundColor: "rgb(26, 26, 26)",
  borderColor: "#303030",
  boxShadow: "rgba(0, 0, 0, 0.65) 0px 8px 24px",
  subtitleColor: "#a3a3a3",
});

const darkDocumentViewer = createDocumentViewerTheme(darkBody, {
  backgroundColor: "#434345",
  toolbarBackgroundColor: "#020617",
  textColor: "#e5e7eb",
  hoverBoxBorderColor: "#3b82f6",
  hoverBoxTextColor: "#020617",
  hoverBoxBackgroundColor: "rgba(59, 130, 246, 0.15)",
});

const darkDormantText = createDormantTextTheme(darkBody, {
  hoverBackgroundColor: "rgb(26, 26, 26)",
  borderColor: "rgb(26, 26, 26)",
  pencilColor: "#ccc",
  actionButtonColor: "#ccc",
  actionButtonHoverBackground: "#363636",
});

const darkDrawerTab = createDrawerTabTheme(darkBody, {
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

const darkFileInputBox = createFileInputBoxTheme(darkBody, darkFieldLane, {
  defaultGradientColor: "#9ca3af",
  errorGradientColor: "#dc2626",
  disabledGradientColor: "#9ca3af",

  dragActiveColor: "#60a5fa",
  dragActiveBackgroundColor: "#eff6ff",
});

const darkFileDropBox = createFileDropBoxTheme(darkBody, darkFieldLane, {
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

const darkFrame = createFrameTheme(darkBody, {
  backgroundColor: "rgb(31, 32, 35)",
  borderColor: "#374151",
  titleColor: darkBody.textColor,
  titleBackgroundColor: "rgb(31, 32, 35)",
  overlayBackgroundColor: "rgb(31, 32, 35)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
});

const darkGrid = createGridTheme(darkBody, {
  cardBackgroundColor: "#1a1a1a",
  cardHoverBackgroundColor: "#2a2a2a",
  cardSelectedBackgroundColor: "#1e3a5f",
  cardBorderColor: "#333333",
  cardShadow: "0 1px 3px rgba(0,0,0,0.6)",
  thumbnailBackgroundColor: "#2a2a2a",
});

const darkImagebox = createImageboxTheme(darkBody, darkFieldLane, {
  draggingBackgroundColor: "#1e3a8a33",
  draggingBorderColor: "#60a5fa",
  draggingTextColor: "#60a5fa",

  iconColor: "#9ca3af",
});

const darkKeynote = createKeynoteTheme(darkBody, {
  keyColor: "rgb(243, 244, 246)",
  valueColor: "#f3f4f6",
});

const darkList = createListTheme(darkBody, {
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

const darkLoadingSpinner = createLoadingSpinnerTheme(darkBody, {
  color: "rgb(142 214 255)",
});

const darkMessagebox = createMessageboxTheme({
  primary: {
    container: "#1e293b",
    text: "#93c5fd",
    active: "#60a5fa",
  },
  success: {
    container: "#1f2d1f",
    text: "#86efac",
    active: "#4ade80",
  },
  danger: {
    container: "#2d1f1f",
    text: "#fca5a5",
    active: "#f87171",
  },
  warning: {
    container: "#2d241f",
    text: "#fdba74",
    active: "#fb923c",
  },
});

const darkMoneybox = createMoneyboxTheme(darkBody, darkFieldLane);

const darkModalDialog = createModalDialogTheme(darkBody, {
  backgroundColor: "#272727",
  borderColor: "#303030",
  textColor: darkBody.textColor,
  subtitleColor: "#9ca3af",
  dividerColor: "rgb(60, 49, 110)",
});

const darkNavTab = createNavTabTheme(darkBody, {
  backgroundColor: "rgb(35, 35, 35)",
  borderColor: "rgb(26, 26, 26)",
  textColor: darkBody.textColor,

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

const darkPaperDialog = createPaperDialogTheme(darkBody, {
  backgroundColor: darkBody.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  textColor: darkBody.textColor,
  actionHoverBackgroundColor: "#363636",
});

const darkPagination = createPaginationTheme(darkBody, darkFieldLane, {
  borderColor: "rgb(55, 65, 81)",
  activeBorderColor: darkFieldLane?.focusedBorderColor,
  hoverBorderColor: darkFieldLane?.focusedBorderColor,

  textColor: "#d1d5db",
  activeTextColor: "#fff",

  disabledBackgroundColor: "rgb(56, 58, 61)",
  disabledTextColor: "rgb(160, 160, 160)",
});

const darkPinbox = createPinboxTheme(darkBody, darkFieldLane);

const darkPhonebox = createPhoneboxTheme(darkBody, darkFieldLane);

const darkRadio = createRadioTheme(darkBody, {
  borderColor: "#374151",
  checkedBorderColor: "#1465d3bf",
  checkedOutsideBorderColor: "#374151",
  backgroundColor: "inherit",
  checkedBackgroundColor: "white",
  labelColor: "#ffffff",
  descriptionColor: "#d1d5db",

  highlightCheckedBackgroundColor: "#1465d333",
  highlightBackgroundColor: "#2563EB55",

  highlightBorderColor: "rgb(75, 85, 99)",
  highlightCheckedBorderColor: "#1465d3bf",
});

const darkRating = createRatingTheme(darkBody, darkFieldLane, {
  starFullColor: "#facc15",
  starEmptyColor: "#111827",
  starBorderColor: "#fbbf24",

  hoverStarColor: "#f59e0b",
});

const darkRichEditor = createRichEditorTheme(
  darkBody,
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

const darkSearchbox = createSearchboxTheme(darkBody, {
  backgroundColor: darkBody?.backgroundColor,
  textColor: darkBody?.textColor,
  activeBackgroundColor: "rgb(26, 26, 26)",
  borderColor: "#303030",
  focusBorderColor: "rgb(85, 65, 160)",
  focusShadow: "0 0 0 1px rgb(85, 65, 160)",
  iconColor: "#a1a1aa",
  clearIconColor: "#a1a1aa",
});

const darkSelectbox = createSelectboxTheme(darkBody, darkFieldLane);

const darkSeparator = createSeparatorTheme(darkBody, {
  containerColor: "#d1d5db",
  lineColor:
    "rgb(43, 43, 43) 0px 2px 2px inset, rgb(130, 130, 130) 0px -1px 1px inset",
  titleColor: "rgb(171, 171, 171)",
  backgroundTitleColor: "#1f2023",
});

const darkSignbox = createSignboxTheme(darkBody, darkFieldLane);

const darkSidebar = createSidebarTheme(darkBody, {
  backgroundColor: darkBody.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 0 8px rgba(0,0,0,0.4)",

  item: {
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "#404040",
  },

  toggle: {
    backgroundColor: darkBody.backgroundColor,
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

const darkStatefulForm = createStatefulFormTheme(darkBody, {
  rowFrameBackgroundColor: "rgb(48, 48, 48)",
});

const darkStepline = createSteplineTheme(darkBody, darkButton);

const darkTable = createTableTheme(darkBody, {
  textColor: darkBody.textColor,
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

const darkTextarea = createTextareaTheme(darkBody, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
  scrollbarThumbColor: "#52525b",
});

const darkTextbox = createTextboxTheme(darkBody, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
});

const darkTimebox = createTimeboxTheme(darkBody, darkFieldLane);

const darkTimeline = createTimelineTheme(darkBody, darkButton);

const darkTipMenu = createTipMenuTheme(darkBody, {
  hoverBackgroundColor: "#2a2a2a",
  activeBackgroundColor: "#333333",
  backgroundColor: "inherit",
  dangerousBackgroundColor: darkButton.danger.backgroundColor,
  dangerousHoverBackgroundColor: darkButton.danger.hoverBackgroundColor,
  dangerousActiveBackgroundColor: darkButton.danger.activeBackgroundColor,
});

const darkThumbField = createThumbFieldTheme(darkBody, {
  thumbsUpColor: "rgb(134, 111, 238)",
  thumbsDownColor: "rgb(236, 65, 108)",
  inactiveColor: "#6b7280",
  errorColor: "#f87171",
});

const darkTogglebox = createToggleboxTheme(darkBody, {
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

const darkTreeList = createTreeListTheme(darkBody, {
  textColor: "#f9fafb",
  backgroundColor: "#1f2023",
  hoverBackgroundColor: "#1f2937",
  selectedBackgroundColor: "#1f2937",
  highlightedText: "#374151",

  dividerHierarchyColor: "rgba(63, 62, 62, 0.35)",
  dividerHierarchyRelatedColor: "rgb(115, 115, 115)",
  dividerHierarchySelectedColor: "#485c7d",
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
