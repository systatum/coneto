import { MessageboxVariantState } from "./../components/messagebox";
import { ButtonVariants } from "./../components/button";
import { ToolbarVariantType } from "./../components/toolbar";

export type ThemeMode = "light" | "dark";

// body.tsx
export interface BodyThemeConfig {
  backgroundColor?: string;
  textColor?: string;
}

// action-capsule
export interface ActionCapsuleThemeConfig {
  activeBackgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  boxShadow?: string;
  borderRadius?: string;
  capsuleFontSize?: string;
  tabTextColor?: string;
  tabBorderRadius?: string;
}

// action-button.tsx
export interface ActionButtonThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  disabledBackgroundColor?: string;
  disabledOpacity?: number;
  borderColor?: string;
  borderRadius?: string;

  toggleBackgroundColor?: string;
  toggleTextColor?: string;
  toggleHoverBackgroundColor?: string;
  toggleBorderColor?: string;
  toggleBorderRadius?: string;

  dividerColor?: string;

  dropdownWidth?: string;
}

// avatar.tsx
export interface AvatarThemeConfig {
  borderColor?: string;
  textColor?: string;
  overlayBackground?: string;
  overlayIconColor?: string;
}

// badge.tsx
export interface BadgeThemeConfig extends BodyThemeConfig {
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
export interface BoxbarThemeConfig extends BodyThemeConfig {
  borderColor?: string;
  toggleButtonColor?: string;
  toggleButtonHoverColor?: string;
}

// button.tsx
export interface ButtonThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
  focusBackgroundColor?: string;
}

export interface TipMenuContainerThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
}

// calendar.tsx
export interface CalendarThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  dayTextColor: string;

  disabledDateColor?: string;
  weekendDateColor?: string;

  rangeDateBackgroundColor?: string;
  rangeDateTextColor?: string;

  highlightedDateTextColor?: string;
  hightlightDateColor?: string;

  boxShadow?: string;
}

// capsule.tsx
export interface CapsuleThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;
  tab?: {
    textColor?: string;
    activeTextColor?: string;
  };
  active?: {
    backgroundColor?: string;
  };
  hover?: {
    borderColor?: string;
  };
}

// capsule-tab.tsx
export interface CapsuleTabThemeConfig {
  borderColor?: string;
  boxShadow?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
}

// card.tsx
export interface CardThemeConfig extends BodyThemeConfig {
  borderColor?: string;
  dividerColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  headerBackground?: string;
  footerBackground?: string;
  closeIconColor?: string;
  closeIconHoverBackground?: string;
}

// chips.tsx
export interface ChipsThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  mutedTextColor?: string;

  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;

  dividerColor?: string;

  boxShadow?: string;
}

// choice-group.tsx
export interface ChoiceGroupThemeConfig {
  borderColor?: string;
  dividerColor?: string;
  labelColor?: string;
  backgroundColor?: string;
  descriptionColor?: string;
}

// checkbox.tsx
export interface CheckboxThemeConfig {
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

// combobox.tsx
export interface ComboboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  groupBackgroundColor?: string;

  highlightBackgroundColor?: string;
  selectedBackgroundColor?: string;
  selectedTextColor?: string;

  disabledTextColor?: string;
  emptyTextColor?: string;

  dividerColor?: string;
  boxShadow?: string;
}

// colorbox.tsx
export interface ColorboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  prefixColor?: string;

  boxBackgroundColor?: string;
}

// crumb.tsx
export interface CrumbThemeConfig {
  textColor?: string;
  hoverColor?: string;
  lastTextColor?: string;
  arrowColor?: string;
  ellipsisColor?: string;
  ellipsisHoverColor?: string;
}

// dialog.tsx
export interface DialogThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;
  subtitleColor?: string;
}

// document-viewer.tsx
export interface DocumentViewerThemeConfig {
  backgroundColor?: string;
  toolbarBackgroundColor?: string;
  textColor?: string;
  errorColor?: string;
  hoverBoxTextColor?: string;
  hoverBoxBorderColor?: string;
  hoverBoxBackgroundColor?: string;
}

// dormant-text.tsx
export interface DormantTextThemeConfig {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  pencilColor?: string;
  actionButtonColor?: string;
  actionButtonHoverBackground?: string;
}

// drawer-tab.tsx
export interface DrawerTabThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  headerBackgroundColor?: string;
  textColor?: string;
  closeButtonHoverBackground?: string;
  dividerColor?: string;
}

// error-slate.tsx
export interface ErrorSlateThemeConfig {
  cubeFaceBackground?: string;
  cubeFaceBorder?: string;
  cubeFaceText?: string;
  titleColor?: string;
}

// field-lane.tsx
export interface FieldLaneThemeConfig {
  buttonTextColor: string;
  buttonBorderColor: string;
  buttonErrorTextColor: string;
  buttonErrorBorderColor: string;

  textColor: string;

  borderColor: string;
  highlightBackgroundColor: string;

  placeholderColor?: string;
  focusedBorderColor?: string;

  disabledOpacity: number;
  disabledBorderColor?: string;
  disabledTextColor?: string;

  actionColor: string;
  actionHoverColor: string;

  errorColor: string;
  errorBackground: string;
  errorBorderColor?: string;
  errorForeground: string;

  selectedBackgroundColor: string;

  helperColor: string;
  dividerColor: string;
}

// file-input-box.tsx
export interface FileInputBoxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  errorBorderColor?: string;

  textColor?: string;
  placeholderColor?: string;

  disabledTextColor?: string;

  disabledGradientColor?: string;
  errorGradientColor?: string;
  defaultGradientColor?: string;

  dragActiveColor?: string;
  dragActiveBackgroundColor?: string;
}

// file-drop-box.tsx

export interface FileDropBoxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;

  textColor?: string;
  placeholderColor?: string;

  defaultGradientColor?: string;
  dragActiveGradientColor?: string;
  errorGradientColor?: string;
  disabledGradientColor?: string;

  dragActiveBackgroundColor?: string;
  dragActiveTextColor?: string;

  iconColor?: string;

  disabledTextColor?: string;

  progressBackgroundColor?: string;
  progressBarColor?: string;
  progressTextColor?: string;
}

// frame.tsx
export interface FrameThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  titleColor?: string;
  titleBackgroundColor?: string;
  overlayBackgroundColor?: string;
  boxShadow?: string;
}

// grid.tsx
export interface GridThemeConfig {
  cardBackgroundColor?: string;
  cardHoverBackgroundColor?: string;
  cardSelectedBackgroundColor?: string;
  cardBorderColor?: string;
  cardShadow?: string;
  thumbnailBackgroundColor?: string;
}

// keynote.tsx
export interface KeynoteThemeConfig {
  keyColor?: string;
  valueColor?: string;
}

// list.tsx
export interface ListThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  mutedTextColor?: string;
  dragLineColor?: string;
  emptyHoverBackgroundColor?: string;
  toggleBackgroundColor?: string;
  badgeTextColor?: string;
  badgeBackgroundColor?: string;
  badgeBorderColor?: string;
}

// loading-skeleton.tsx
export interface LoadingSkeletonThemeConfig {
  baseColor?: string;
  highlightColor?: string;
}

// loading-spinner.tsx
export interface LoadingSpinnerThemeConfig {
  color?: string;
  textColor?: string;
}

// messagebox.tsx
export interface MessageboxVariantTheme {
  container: string;
  text: string;
  active: string;
}

export type MessageboxThemeConfig = {
  [K in MessageboxVariantState]: MessageboxVariantTheme;
};

// moneybox.tsx
export interface MoneyboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  errorBorderColor?: string;
  focusedBorderColor?: string;

  placeholderColor?: string;
  disabledTextColor?: string;

  inputPadding?: string;
  fontSize?: string;
  borderRadius?: string;
}

// modal-dialog.tsx
export interface ModalDialogThemeConfig extends DialogThemeConfig {
  dividerColor?: string;
}

// nav-tab.tsx
export interface NavTabThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  selectedBackgroundColor?: string;

  indicatorColor?: string;
  boxShadow?: string;

  activeInsetShadow?: string;
}

// overlay-blocker.tsx
export interface OverlayBlockerThemeConfig {
  backgroundColor?: string;
  backdropFilter?: string;
}

// paper-dialog.tsx
export interface PaperDialogThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;
  actionHoverBackgroundColor?: string;
}

// pagination.tsx
export interface PaginationThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  activeBorderColor?: string;
  hoverBorderColor?: string;

  textColor?: string;
  activeTextColor?: string;

  disabledBackgroundColor?: string;
  disabledTextColor?: string;
}

//pinbox.tsx
export interface PinboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  textColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  placeholderColor?: string;
  boxShadow?: string;
}

// phonebox.tsx
export interface PhoneboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  focusedBorderColor?: string;
  textColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  placeholderColor: string;

  boxShadow?: string;

  optionHighlightedBackground?: string;
}

// radio.tsx
export interface RadioThemeConfig {
  borderColor?: string;
  checkedBorderColor?: string;
  backgroundColor?: string;
  checkedOutsideBorderColor?: string;
  checkedBackgroundColor?: string;
  iconColor?: string;
  labelColor?: string;
  descriptionColor?: string;

  highlightCheckedBackgroundColor?: string;
  highlightBackgroundColor?: string;

  highlightCheckedBorderColor?: string;
  highlightBorderColor?: string;
}

// rating.tsx
export interface RatingThemeConfig {
  starFullColor?: string;
  starEmptyColor?: string;
  starBorderColor?: string;

  labelTextColor?: string;

  disabledStarColor?: string;
  disabledLabelColor?: string;

  hoverStarColor?: string;
  sizeMap?: { sm: number; md: number; lg: number };
}

// rich-editor.tsx

export interface RichEditorThemeConfig {
  backgroundColor: string;
  textColor: string;
  placeholderColor: string;
  borderColor: string;

  toolbarBackground: string;
  toolbarButtonActive: string;
  toolbarButtonHover: string;
  toolbarButtonFocused: string;
  scrollThumb: string;

  preBackgroundColor: string;
}

// searchbox.tsx
export interface SearchboxThemeConfig {
  backgroundColor?: string;
  activeBackgroundColor?: string;
  borderColor?: string;
  focusBorderColor?: string;
  focusShadow?: string;
  iconColor?: string;
  textColor?: string;
  clearIconColor?: string;
}

// selectbox.tsx
export interface SelectboxThemeConfig {
  backgroundColor: string;
  textColor: string;

  borderColor: string;
  hoverBorderColor: string;
  focusedBorderColor: string;

  errorBorderColor: string;

  placeholderColor: string;

  iconColor: string;
  iconActiveColor: string;

  clearIconColor: string;
  clearIconBackground: string;
  clearIconHoverBackground: string;

  dividerColor: string;
  disabledOpacity: number;
}

// separator.tsx
export interface SeparatorThemeConfig {
  containerColor?: string;
  lineColor?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
}

// signbox.tsx
export interface SignboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  errorBorderColor?: string;

  clearIconColor?: string;
  clearIconHoverBackground?: string;
}

// sidebar.tsx
export interface SidebarThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;

  item?: {
    hoverBackgroundColor?: string;
    activeBackgroundColor?: string;
  };

  toggle?: {
    backgroundColor?: string;
    borderColor?: string;
    hoverBackgroundColor?: string;
  };
}

// statusbar.tsx
export interface StatusbarThemeConfig {
  backgroundColor: string;
  borderColor: string;
  boxShadow: string;
  textColor: string;
  item: {
    activeBackgroundColor: string;
    hoverBackgroundColor: string;
  };
}

export interface StatefulFormThemeConfig {
  backgroundColor: string;
  textColor: string;
  rowFrameBackgroundColor: string;
}

// table.tsx
export interface TableThemeConfig {
  textColor?: string;
  boxShadow?: string;

  headerActionBackgroundColor?: string;
  headerActionBorderColor?: string;

  headerBackgroundColor?: string;
  headerBorderColor?: string;

  rowGroupBackgroundColor?: string;

  rowSubtitleTextColor?: string;
  rowBackgroundColor?: string;
  rowBorderColor?: string;
  rowHoverBackgroundColor?: string;
  rowSelectedBackgroundColor?: string;
  rowContentBackgroundColor?: string;
  rowContentBoxShadow?: string;

  summaryBackgroundColor?: string;
  summaryBorderColor?: string;

  toggleRowBackgroundColor?: string;
}

// timebox.tsx
export interface TimeboxThemeConfig {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;
  colonColor?: string;
}

// textbox.tsx
export interface TextboxThemeConfig {
  backgroundColor?: string;

  borderColor?: string;
  focusedBorderColor?: string;

  textColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  placeholderColor?: string;

  boxShadow?: string;
}

// textarea.tsx
export interface TextareaThemeConfig extends TextboxThemeConfig {
  scrollbarThumbColor?: string;
}

// thumb-field.tsx
export interface ThumbFieldThemeConfig {
  thumbsUpColor?: string;
  thumbsDownColor?: string;
  inactiveColor?: string;
  errorColor?: string;
  disabledOpacity?: number;
}

// togglebox.tsx
export interface ToggleboxThemeConfig {
  backgroundColor?: string;
  checkedBackgroundColor?: string;
  thumbColor?: string;
  borderColor?: string;
  textColor?: string;
  descriptionColor?: string;
  disabledOpacity?: number;
  boxShadow?: string;
}

// toolbar.tsx
export interface ToolbarThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  focusBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
}

// tip-menu.tsx
export interface TipMenuThemeConfig {
  backgroundColor?: string;
  textColor?: string;

  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;

  dangerousBackgroundColor?: string;
  dangerousHoverBackgroundColor?: string;
  dangerousActiveBackgroundColor?: string;

  focusBorderColor?: string;
}

// treelist.tsx
export interface TreeListThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;

  highlightedText?: string;

  dividerHierarchyColor?: string;
  dividerHierarchySelectedColor?: string;
  dividerHierarchyRelatedColor?: string;
}

// window.tsx
export interface WindowThemeConfig extends BodyThemeConfig {
  dividerColor?: string;
}

// app-theme.tsx
export interface AppTheme {
  body: BodyThemeConfig;

  actionCapsule: ActionCapsuleThemeConfig;
  actionButton: ActionButtonThemeConfig;

  avatar: AvatarThemeConfig;
  badge: BadgeThemeConfig;
  boxbar: BoxbarThemeConfig;
  button: Record<ButtonVariants["variant"], ButtonThemeConfig>;
  buttonTipMenu: TipMenuContainerThemeConfig;
  calendar: CalendarThemeConfig;
  capsule: CapsuleThemeConfig;
  capsuleTab: CapsuleTabThemeConfig;
  card: CardThemeConfig;
  chips: ChipsThemeConfig;
  choiceGroup: ChoiceGroupThemeConfig;
  checkbox: CheckboxThemeConfig;
  colorbox: ColorboxThemeConfig;
  combobox: ComboboxThemeConfig;
  crumb: CrumbThemeConfig;
  dialog: DialogThemeConfig;
  documentViewer: DocumentViewerThemeConfig;
  dormantText: DormantTextThemeConfig;
  drawerTab: DrawerTabThemeConfig;
  errorSlate: ErrorSlateThemeConfig;
  fieldLane: FieldLaneThemeConfig;
  fileInputBox: FileInputBoxThemeConfig;
  fileDropBox: FileDropBoxThemeConfig;
  frame: FrameThemeConfig;
  grid: GridThemeConfig;
  keynote: KeynoteThemeConfig;
  list: ListThemeConfig;
  loadingSkeleton: LoadingSkeletonThemeConfig;
  loadingSpinner: LoadingSpinnerThemeConfig;
  messagebox: MessageboxThemeConfig;
  moneybox: MoneyboxThemeConfig;
  modalDialog: ModalDialogThemeConfig;
  navTab: NavTabThemeConfig;
  overlayBlocker: OverlayBlockerThemeConfig;
  paperDialog: PaperDialogThemeConfig;
  pagination: PaginationThemeConfig;
  pinbox: PinboxThemeConfig;
  phonebox: PhoneboxThemeConfig;
  radio: RadioThemeConfig;
  rating: RatingThemeConfig;
  richEditor: RichEditorThemeConfig;
  searchbox: SearchboxThemeConfig;
  selectbox: SelectboxThemeConfig;
  separator: SeparatorThemeConfig;
  sidebar: SidebarThemeConfig;
  signbox: SignboxThemeConfig;
  statusbar: StatusbarThemeConfig;
  statefulForm: StatefulFormThemeConfig;
  textbox: TextboxThemeConfig;
  textarea: TextareaThemeConfig;
  thumbField: ThumbFieldThemeConfig;
  table: TableThemeConfig;
  tipmenu: TipMenuThemeConfig;
  timebox: TimeboxThemeConfig;
  toolbar: Record<ToolbarVariantType, ToolbarThemeConfig>;
  togglebox: ToggleboxThemeConfig;
  treelist: TreeListThemeConfig;
  window: WindowThemeConfig;
}
