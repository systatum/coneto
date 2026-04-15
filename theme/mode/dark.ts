import { AppTheme } from "./../index";
import {
  createActionButtonTheme,
  createActionCapsuleTheme,
  createAvatarTheme,
  createBadgeTheme,
  createBodyTheme,
  createBoxbarTheme,
  createButtonTheme,
  createCalendarTheme,
  createCapsuleTheme,
  createCapsuleTabTheme,
  createCardTheme,
  createChipsTheme,
  createChoiceGroupTheme,
  createCheckboxTheme,
  createColorboxTheme,
  createComboboxTheme,
  createCrumbTheme,
  createDialogTheme,
  createDocumentViewerTheme,
  createDormantTextTheme,
  createDrawerTabTheme,
  createErrorSlateTheme,
  createFieldLaneTheme,
  createFileInputBoxTheme,
  createFileDropBoxTheme,
  createFrameTheme,
  createGridTheme,
  createImageboxTheme,
  createKeynoteTheme,
  createListTheme,
  createLoadingSkeletonTheme,
  createLoadingSpinnerTheme,
  createOverlayBlockerTheme,
  createMessageboxTheme,
  createMoneyboxTheme,
  createModalDialogTheme,
  createNavTabTheme,
  createPaperDialogTheme,
  createPaginationTheme,
  createPinboxTheme,
  createPhoneboxTheme,
  createRadioTheme,
  createRatingTheme,
  createRichEditorTheme,
  createSearchboxTheme,
  createSelectboxTheme,
  createSeparatorTheme,
  createSidebarTheme,
  createSignboxTheme,
  createStatefulFormTheme,
  createStatusbarTheme,
  createSteplineTheme,
  createTableTheme,
  createTextareaTheme,
  createTextboxTheme,
  createThumbFieldTheme,
  createTimeboxTheme,
  createTimelineTheme,
  createTipMenuContainerTheme,
  createTipMenuTheme,
  createToggleTheme,
  createToolbarTheme,
  createTreeListTheme,
  createWindowTheme,
  createTooltipTheme,
} from "./creator";

// Dark
const darkBody = createBodyTheme({
  backgroundColor: "#111",
  textColor: "#caced4",
  borderColor: "#4b5563",
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
  overlayBackgroundColor: "rgba(0,0,0,0.6)",
});

const darkButton = createButtonTheme(darkBody, {
  default: {
    backgroundColor: "#2f2f2f",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#363636",
    activeBackgroundColor: "#2f2f2f",
    textDecoration: "none",
    dividerColor: "#404040",
  },
  primary: {
    backgroundColor: "rgb(60, 49, 110)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(72, 57, 141)",
    activeBackgroundColor: "rgb(60, 49, 110)",
    focusBackgroundColor: "rgba(72, 57, 141, 0.5)",
    dividerColor: "#5a5280bf",
  },
  danger: {
    backgroundColor: "rgb(147, 21, 52)",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "rgb(177, 30, 66)",
    activeBackgroundColor: "rgb(147, 21, 52)",
    focusBackgroundColor: "rgba(177, 30, 66, 0.5)",
    dividerColor: "#c04e698c",
  },
  success: {
    backgroundColor: "#107533",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#03973d",
    activeBackgroundColor: "#107533",
    focusBackgroundColor: "rgba(3, 151, 61, 0.5)",
    dividerColor: "rgba(19, 156, 17, 0.69)",
  },
  secondary: {
    backgroundColor: "#272727",
    textColor: darkBody.textColor,
    hoverBackgroundColor: "#3a3a3a",
    activeBackgroundColor: "#272727",
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

const darkButtonTipMenuContainer = createTipMenuContainerTheme(darkBody, {
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

  rangeDateBackgroundColor: "rgb(52 55 135)",
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
  textColor: darkBody.textColor,
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
  selectedTextColor: darkBody.textColor,
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
  maxItemTextColor: "#9ca3af",
});

const darkLoadingSkeleton = createLoadingSkeletonTheme({
  baseColor: "#2b313a",
  highlightColor: "#3b424c",
});

const darkLoadingSpinner = createLoadingSpinnerTheme(darkBody, {
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
  textColor: "#ffffff",
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
  backgroundColor: darkBody.backgroundColor,
  textColor: darkBody.textColor,
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
  lineShadow:
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

const darkTimeline = createTimelineTheme(darkBody, darkButton, {
  outerCircle: {
    error: darkButton?.danger?.activeBackgroundColor || "#ff0000",
    completed: darkButton?.success?.activeBackgroundColor || "#00b62e",
    current: darkButton?.success?.activeBackgroundColor || "#00b62e",
    todo: "#595959",
  },
  innerCircle: {
    error: darkButton?.danger?.activeBackgroundColor || "#ff0000",
    completed: darkButton?.success?.activeBackgroundColor || "#00b62e",
    current: darkButton?.success?.activeBackgroundColor || "#00b62e",
    todo: "#595959",
  },
  line: {
    default: "#595959",
    completed: darkButton?.success?.backgroundColor || "#00b62e",
    error: darkButton?.error?.backgroundColor || "#b60000",
  },
});

const darkStepline = createSteplineTheme(darkBody, darkButton, {
  line: darkTimeline.line,
});

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

const darkToggle = createToggleTheme(darkBody, {
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
  ghost: darkButton.ghost,
  success: darkButton.success,
});

const darkTooltip = createTooltipTheme({
  arrowBackgroundColor: "#3e4143",
  literalStringBackgroundColor: "#292c2e",
  nodeElementBackgroundColor: "#292c2e",
  literalStringTextColor: darkBody?.textColor,
  nodeElementTextColor: darkBody?.textColor,
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

export const darkTheme: AppTheme = {
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
  toggle: darkToggle,
  toolbar: darkToolbar,
  tooltip: darkTooltip,
  treelist: darkTreeList,
  window: darkWindow,
};
