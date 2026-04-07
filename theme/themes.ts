import { ToolbarVariantType } from "./../components/toolbar";
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
  CalendarThemeConfiguration,
  CapsuleTabThemeConfiguration,
  CapsuleThemeConfiguration,
  CardThemeConfiguration,
  CheckboxThemeConfiguration,
  ChipsThemeConfiguration,
  ChoiceGroupThemeConfiguration,
  ColorboxThemeConfiguration,
  ComboboxThemeConfiguration,
  DialogThemeConfiguration,
  DocumentViewerThemeConfiguration,
  DormantTextThemeConfiguration,
  DrawerTabThemeConfiguration,
  ErrorSlateThemeConfiguration,
  FieldLaneThemeConfiguration,
  GridThemeConfiguration,
  KeynoteThemeConfiguration,
  ListThemeConfiguration,
  LoadingSkeletonThemeConfiguration,
  LoadingSpinnerThemeConfiguration,
  MessageboxThemeConfiguration,
  ModalDialogThemeConfiguration,
  NavTabThemeConfiguration,
  OverlayBlockerThemeConfiguration,
  PaperDialogThemeConfiguration,
  RadioThemeConfiguration,
  SearchboxThemeConfiguration,
  SelectboxThemeConfiguration,
  SeparatorThemeConfiguration,
  SidebarThemeConfiguration,
  SignboxThemeConfiguration,
  StatusbarThemeConfiguration,
  TableThemeConfiguration,
  TextareaThemeConfiguration,
  TextboxThemeConfiguration,
  ThumbFieldThemeConfiguration,
  TimeboxThemeConfiguration,
  TipMenuContainerThemeConfiguration,
  TipMenuThemeConfiguration,
  ToggleboxThemeConfiguration,
  ToolbarThemeConfiguration,
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
  const defaultTextColor = body.textColor;

  const defaultTheme: BadgeThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  customTheme: Partial<BoxbarThemeConfiguration> = {}
): BoxbarThemeConfiguration {
  const defaultTheme: BoxbarThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  customVariants: Partial<
    Record<ButtonVariants["variant"], ButtonThemeConfiguration>
  > = {}
): Record<string, ButtonThemeConfiguration> {
  const variants: Record<string, ButtonThemeConfiguration> = {
    default: {
      backgroundColor: "#ececec",
      textColor: "black",
      hoverBackgroundColor: "#e2e2e2",
      activeBackgroundColor: "#cfcfcf",
      textDecoration: "none",
    },
  };

  return { ...variants, ...customVariants };
}

export function createTipMenuContainerTheme(
  custom: Partial<TipMenuContainerThemeConfiguration> = {}
): TipMenuContainerThemeConfiguration {
  return {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ...custom,
  };
}

// calendar.tsx
export function createCalendarTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<CalendarThemeConfiguration> = {}
): CalendarThemeConfiguration {
  const defaultTheme: CalendarThemeConfiguration = {
    backgroundColor: body.backgroundColor || "#ffffff",
    borderColor: fieldLane?.borderColor || "#d1d5db",
    textColor: body.textColor || "#111827",

    dayTextColor: "#6b7280",

    disabledDateColor: "#d1d5db",
    weekendDateColor: "#fca5a5",

    highlightedDateTextColor: "white",
    hightlightDateColor: "#61a9f9",
    rangeDateColor: "#dbeafe",

    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  };

  return { ...defaultTheme, ...custom };
}

// capsule.tsx
export function createCapsuleTheme(
  body: BodyThemeConfiguration,
  custom: Partial<CapsuleThemeConfiguration> = {}
): CapsuleThemeConfiguration {
  const defaultTheme: CapsuleThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<CapsuleTabThemeConfiguration> = {}
): CapsuleTabThemeConfiguration {
  const defaultTheme: CapsuleTabThemeConfiguration = {
    backgroundColor: body?.backgroundColor,
    borderColor: "#ebebeb",
    boxShadow: "0 1px 3px -3px #5b5b5b",
  };

  return {
    ...defaultTheme,
    ...custom,
  };
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

// chips.tsx
export function createChipsTheme(
  body: BodyThemeConfiguration,
  custom: Partial<ChipsThemeConfiguration> = {}
): ChipsThemeConfiguration {
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
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<ColorboxThemeConfiguration> = {}
): ColorboxThemeConfiguration {
  const defaultTheme: ColorboxThemeConfiguration = {
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

// combobox.tsx
export function createComboboxTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<ComboboxThemeConfiguration> = {}
): ComboboxThemeConfiguration {
  const defaultTheme: ComboboxThemeConfiguration = {
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
  };

  return { ...defaultTheme, ...custom };
}

// dialog.tsx
export function createDialogTheme(
  body: BodyThemeConfiguration,
  custom: DialogThemeConfiguration = {}
): DialogThemeConfiguration {
  const defaultTheme: DialogThemeConfiguration = {
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

// dormant-text.tsx
export function createDormantTextTheme(
  body: BodyThemeConfiguration,
  custom: Partial<DormantTextThemeConfiguration> = {}
): DormantTextThemeConfiguration {
  const defaultTheme: DormantTextThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<DrawerTabThemeConfiguration> = {}
): DrawerTabThemeConfiguration {
  const defaultTheme: DrawerTabThemeConfiguration = {
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

// field-lane.tsx
export function createFieldLaneTheme(
  body: BodyThemeConfiguration,
  custom: Partial<FieldLaneThemeConfiguration> = {}
): FieldLaneThemeConfiguration {
  const defaultTheme: FieldLaneThemeConfiguration = {
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

    placeholderColor: "#9ca3af",
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

// grid.tsx
export function createGridTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<GridThemeConfiguration> = {}
): GridThemeConfiguration {
  const defaultTheme: GridThemeConfiguration = {
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

// messagebox.tsx
export function createMessageboxTheme(
  customTheme: Partial<MessageboxThemeConfiguration> = {}
): MessageboxThemeConfiguration {
  const defaultTheme: MessageboxThemeConfiguration = {
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

// modal-dialog.tsx
export function createModalDialogTheme(
  body: BodyThemeConfiguration,
  custom: Partial<ModalDialogThemeConfiguration> = {}
): ModalDialogThemeConfiguration {
  const defaultTheme: ModalDialogThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<NavTabThemeConfiguration> = {}
): NavTabThemeConfiguration {
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
  customTheme: Partial<OverlayBlockerThemeConfiguration> = {}
): OverlayBlockerThemeConfiguration {
  const defaultTheme: OverlayBlockerThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<PaperDialogThemeConfiguration> = {}
): PaperDialogThemeConfiguration {
  const defaultTheme: PaperDialogThemeConfiguration = {
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

// searchbox.tsx
export function createSearchboxTheme(
  body: BodyThemeConfiguration,
  custom: Partial<SearchboxThemeConfiguration> = {}
): SearchboxThemeConfiguration {
  const defaultTheme: SearchboxThemeConfiguration = {
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

// selectbox.tsx
export function createSelectboxTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<SelectboxThemeConfiguration> = {}
): SelectboxThemeConfiguration {
  const defaultTheme: SelectboxThemeConfiguration = {
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

export function createSidebarTheme(
  body: BodyThemeConfiguration,
  custom: Partial<SidebarThemeConfiguration> = {}
): SidebarThemeConfiguration {
  const defaultTheme: SidebarThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<SignboxThemeConfiguration> = {}
): SignboxThemeConfiguration {
  const defaultTheme: SignboxThemeConfiguration = {
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
  customTheme: Partial<StatusbarThemeConfiguration> = {}
): StatusbarThemeConfiguration {
  const defaultTheme: StatusbarThemeConfiguration = {
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

// textarea.tsx
export function createTextareaTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<TextareaThemeConfiguration> = {}
): TextareaThemeConfiguration {
  const defaultTheme: TextareaThemeConfiguration = {
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

    boxShadow: "0 0 0 1px transparent",
  };

  return { ...defaultTheme, ...custom };
}

// textbox.tsx
export function createTextboxTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<TextboxThemeConfiguration> = {}
): TextboxThemeConfiguration {
  const defaultTheme: TextboxThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  customTheme: Partial<TableThemeConfiguration> = {}
): TableThemeConfiguration {
  const defaultTheme: TableThemeConfiguration = {
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
  };

  return {
    ...defaultTheme,
    ...customTheme,
  };
}

// timebox.tsx
export function createTimeboxTheme(
  body: BodyThemeConfiguration,
  fieldLane: Partial<FieldLaneThemeConfiguration> = {},
  custom: Partial<TimeboxThemeConfiguration> = {}
): TimeboxThemeConfiguration {
  const defaultTheme: TimeboxThemeConfiguration = {
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

// tipmenu.tsx
export function createTipMenuTheme(
  body: BodyThemeConfiguration,
  customTheme: Partial<TipMenuThemeConfiguration> = {}
): TipMenuThemeConfiguration {
  const defaultTheme: TipMenuThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<ToggleboxThemeConfiguration> = {}
): ToggleboxThemeConfiguration {
  const defaultTheme: ToggleboxThemeConfiguration = {
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
  baseButton: Record<ToolbarVariantType, ToolbarThemeConfiguration>,
  customVariants: Partial<
    Record<ToolbarVariantType, ToolbarThemeConfiguration>
  > = {}
): Record<ToolbarVariantType, ToolbarThemeConfiguration> {
  const variants: Record<ToolbarVariantType, ToolbarThemeConfiguration> = {
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
  body: BodyThemeConfiguration,
  custom: Partial<ThumbFieldThemeConfiguration> = {}
): ThumbFieldThemeConfiguration {
  const defaultTheme: ThumbFieldThemeConfiguration = {
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
  body: BodyThemeConfiguration,
  custom: Partial<TreeListThemeConfiguration> = {}
): TreeListThemeConfiguration {
  const defaultTheme: TreeListThemeConfiguration = {
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
const lightFieldLane = createFieldLaneTheme(lightBody);

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
    hoverBackgroundColor: "#e2e2e2",
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

const lightGrid = createGridTheme(lightBody);

const lightKeynote = createKeynoteTheme(lightBody);

const lightList = createListTheme(lightBody);

const lightLoadingSkeleton = createLoadingSkeletonTheme();

const lightLoadingSpinner = createLoadingSpinnerTheme(lightBody);

const lightOverlayBlocker = createOverlayBlockerTheme();

const lightMessagebox = createMessageboxTheme();

const lightModalDialog = createModalDialogTheme(lightBody);

const lightNavTab = createNavTabTheme(lightBody);

const lightPaperDialog = createPaperDialogTheme(lightBody);

const lightRadio = createRadioTheme(lightBody);

const lightSearchbox = createSearchboxTheme(lightBody);

const lightSelectbox = createSelectboxTheme(lightBody, lightFieldLane);

const lightSeparator = createSeparatorTheme(lightBody);

const lightSignbox = createSignboxTheme(lightBody, lightFieldLane);

const lightSidebar = createSidebarTheme(lightBody);

const lightStatusbar = createStatusbarTheme();

const lightTable = createTableTheme(lightBody);

const lightTextarea = createTextareaTheme(lightBody, lightFieldLane);

const lightTextbox = createTextboxTheme(lightBody, lightFieldLane);

const lightTimebox = createTimeboxTheme(lightBody, lightFieldLane);

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
  dialog: lightDialog,
  documentViewer: lightDocumentViewer,
  dormantText: lightDormantText,
  drawerTab: lightDrawerTab,
  errorSlate: lightErrorSlate,
  fieldLane: lightFieldLane,
  grid: lightGrid,
  keynote: lightKeynote,
  list: lightList,
  loadingSkeleton: lightLoadingSkeleton,
  loadingSpinner: lightLoadingSpinner,
  messagebox: lightMessagebox,
  modalDialog: lightModalDialog,
  navTab: lightNavTab,
  overlayBlocker: lightOverlayBlocker,
  paperDialog: lightPaperDialog,
  radio: lightRadio,
  searchbox: lightSearchbox,
  selectbox: lightSelectbox,
  separator: lightSeparator,
  sidebar: lightSidebar,
  signbox: lightSignbox,
  statusbar: lightStatusbar,
  table: lightTable,
  textarea: lightTextarea,
  textbox: lightTextbox,
  timebox: lightTimebox,
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
    activeBackgroundColor: "#404040",
    textDecoration: "none",
  },
  primary: {
    backgroundColor: "rgb(60, 49, 110)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(72, 57, 141)",
    activeBackgroundColor: "rgb(85, 65, 160)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
  },
  danger: {
    backgroundColor: "rgb(167, 7, 43)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(147, 21, 52)",
    activeBackgroundColor: "rgb(130, 18, 46)",
    focusBackgroundColor: "rgba(167, 7, 43, 0.5)",
  },
  success: {
    backgroundColor: "#107533",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#03973d",
    activeBackgroundColor: "#02b347",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
  },

  secondary: {
    backgroundColor: "#2f2f2f",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#3a3a3a",
    activeBackgroundColor: "#444",
    focusBackgroundColor: "#ffffff20",
  },

  ghost: {
    backgroundColor: "transparent",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#2a2a2a",
    activeBackgroundColor: "#333",
    focusBackgroundColor: "#ffffff20",
  },

  link: {
    backgroundColor: "transparent",
    textColor: "#7ab4ff",
    hoverBackgroundColor: "#1e3a5f",
    activeBackgroundColor: "#162c47",
    focusBackgroundColor: "#7ab4ff80",
    textDecoration: "underline",
  },

  transparent: {
    backgroundColor: "transparent",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "#404040",
    focusBackgroundColor: "#ffffff20",
  },

  "outline-default": {
    backgroundColor: "transparent",
    textColor: "#a3a3a3",
    hoverBackgroundColor: "#2a2a2a",
    activeBackgroundColor: "#333",
    focusBackgroundColor: "#ffffff30",
    borderColor: "#555",
  },

  "outline-primary": {
    backgroundColor: "transparent",
    textColor: "rgb(120, 100, 220)",
    hoverBackgroundColor: "rgba(72, 57, 141, 0.2)",
    activeBackgroundColor: "rgba(72, 57, 141, 0.35)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
    borderColor: "rgb(72, 57, 141)",
  },

  "outline-danger": {
    backgroundColor: "transparent",
    textColor: "rgb(200, 60, 90)",
    hoverBackgroundColor: "rgba(147, 21, 52, 0.2)",
    activeBackgroundColor: "rgba(147, 21, 52, 0.35)",
    focusBackgroundColor: "rgba(167, 7, 43, 0.5)",
    borderColor: "rgb(167, 7, 43)",
  },

  "outline-success": {
    backgroundColor: "transparent",
    textColor: "#2ecc71",
    hoverBackgroundColor: "rgba(3, 151, 61, 0.2)",
    activeBackgroundColor: "rgba(3, 151, 61, 0.35)",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
    borderColor: "#03973d",
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

  rangeDateColor: "rgb(124, 101, 207)",
  hightlightDateColor: "rgb(79, 61, 142)",
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
    backgroundColor: "#363636",
  },

  hover: {
    borderColor: "#404040",
  },
});

const darkCapsuleTab = createCapsuleTabTheme(darkBody, {
  backgroundColor: darkBody?.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
});

const darkCard = createCardTheme(darkBody, {
  backgroundColor: "rgb(31, 31, 33)",
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
  borderColor: "#374151",
  backgroundColor: "rgb(32, 33, 35)",
  checkedBorderColor: "#374151",
  checkedBackgroundColor: "#2a3243",
  iconColor: "#f9fafb",
  labelColor: "#f9fafb",
  descriptionColor: "#d1d5db",
  highlightBackgroundColor: "#2563EB33",
  highlightHoverColor: "#2563EB55",
});

const darkColorbox = createColorboxTheme(darkBody, darkFieldLane);

const darkCombobox = createComboboxTheme(darkBody, darkFieldLane);

const darkDialog = createDialogTheme(darkBody, {
  borderColor: "#303030",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  subtitleColor: "#a3a3a3",
});

const darkDocumentViewer = createDocumentViewerTheme(darkBody, {
  backgroundColor: "#0f172a",
  toolbarBackgroundColor: "#020617",
  textColor: "#e5e7eb",
  hoverBoxBorderColor: "#3b82f6",
  hoverBoxTextColor: "#020617",
  hoverBoxBackgroundColor: "rgba(59, 130, 246, 0.15)",
});

const darkDormantText = createDormantTextTheme(darkBody, {
  hoverBackgroundColor: "#1a1a1a",
  borderColor: "#303030",
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
  backgroundColor: "rgb(26, 26, 26)",
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
  backgroundColor: "rgba(20, 20, 20, 0.5)",
  backdropFilter: "blur(2px)",
});

const darkPaperDialog = createPaperDialogTheme(darkBody, {
  backgroundColor: darkBody.backgroundColor,
  borderColor: "#303030",
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  textColor: darkBody.textColor,
  actionHoverBackgroundColor: "#363636",
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
  lineColor: "#e5e7eb",
  titleColor: "#f9fafb",
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

export const darkTable: TableThemeConfiguration = createTableTheme(darkBody, {
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
});

const darkTextarea = createTextareaTheme(darkBody, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
});

const darkTextbox = createTextboxTheme(darkBody, darkFieldLane, {
  boxShadow: "0 0 0 0.5px transparent",
});

const darkTimebox = createTimeboxTheme(darkBody, darkFieldLane);

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
  checkedBackgroundColor: "rgb(60, 49, 110)",
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
});

const darkTreeList = createTreeListTheme(darkBody, {
  textColor: "#f9fafb",
  backgroundColor: "#1f2023",
  hoverBackgroundColor: "#1f2937",
  selectedBackgroundColor: "#1f2937",
  highlightedText: "#374151",

  dividerHierarchyColor: "rgb(62, 65, 67)",
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
  dialog: darkDialog,
  documentViewer: darkDocumentViewer,
  dormantText: darkDormantText,
  drawerTab: darkDrawerTab,
  errorSlate: darkErrorSlate,
  fieldLane: darkFieldLane,
  grid: darkGrid,
  keynote: darkKeynote,
  list: darkList,
  loadingSkeleton: darkLoadingSkeleton,
  loadingSpinner: darkLoadingSpinner,
  messagebox: darkMessagebox,
  modalDialog: darkModalDialog,
  navTab: darkNavTab,
  overlayBlocker: darkOverlayBlocker,
  paperDialog: darkPaperDialog,
  radio: darkRadio,
  searchbox: darkSearchbox,
  selectbox: darkSelectbox,
  separator: darkSeparator,
  sidebar: darkSidebar,
  signbox: darkSignbox,
  statusbar: darkStatusbar,
  table: darkTable,
  textarea: darkTextarea,
  textbox: darkTextbox,
  timebox: darkTimebox,
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
