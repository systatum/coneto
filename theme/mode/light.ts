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

// Light
const lightBody = createBodyTheme();

const lightFieldLane = createFieldLaneTheme(lightBody);

const lightActionButton = createActionButtonTheme(lightBody);

const lightActionCapsule = createActionCapsuleTheme(lightBody);

const lightAvatar = createAvatarTheme(lightBody, {
  borderColor: "#e5e7eb",
  overlayBackgroundColor: "rgba(0,0,0,0.4)",
});

const lightBadge = createBadgeTheme(lightBody);

const lightBoxbar = createBoxbarTheme(lightBody);

const lightButton = createButtonTheme();

const lightButtonTipMenuContainer = createTipMenuContainerTheme(lightBody);

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

const lightToggle = createToggleTheme(lightBody);

const lightToolbar = createToolbarTheme({
  default: lightButton.default,
  primary: lightButton.primary,
  danger: lightButton.danger,
  transparent: lightButton.transparent,
  success: lightButton.success,
});

const lightTooltip = createTooltipTheme();

const lightThumbField = createThumbFieldTheme(lightBody);

const lightTreeList = createTreeListTheme(lightBody);

const lightWindow = createWindowTheme(lightBody);

export const lightTheme: AppTheme = {
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
  toggle: lightToggle,
  toolbar: lightToolbar,
  tooltip: lightTooltip,
  treelist: lightTreeList,
  window: lightWindow,
};
