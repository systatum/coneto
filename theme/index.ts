import { MessageboxVariantState } from "./../components/messagebox";
import { ButtonVariants } from "./../components/button";
import { ToolbarVariantType } from "./../components/toolbar";
import { SteplineItemState } from "./../constants/step-component-util";

export type ThemeMode = "light" | "dark";

// body
export interface BodyThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
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
export interface ActionButtonThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  disabledBackgroundColor?: string;
  disabledOpacity?: number;
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
export interface AvatarThemeConfig
  extends Omit<BodyThemeConfig, "backgroundColor"> {
  overlayBackgroundColor?: string;
  overlayIconColor?: string;
}

// badge.tsx
export interface BadgeThemeConfig extends BodyThemeConfig {
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
  toggleButtonColor?: string;
  toggleButtonHoverColor?: string;
}

// button.tsx
export interface ButtonThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  textDecoration?: string;
  focusBackgroundColor?: string;
  dividerColor?: string;
}

export interface TipMenuContainerThemeConfig extends BodyThemeConfig {
  boxShadow?: string;
}

// calendar.tsx
export interface CalendarThemeConfig extends BodyThemeConfig {
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
export interface CapsuleThemeConfig extends BodyThemeConfig {
  boxShadow?: string;
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
export interface CapsuleTabThemeConfig extends BodyThemeConfig {
  boxShadow?: string;
  activeBackgroundColor?: string;
}

// card.tsx
export interface CardThemeConfig extends BodyThemeConfig {
  dividerColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  headerBackground?: string;
  footerBackground?: string;
  closeIconColor?: string;
  closeIconHoverBackground?: string;
}

// chips.tsx
export interface ChipsThemeConfig extends BodyThemeConfig {
  mutedTextColor?: string;

  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;

  dividerColor?: string;

  boxShadow?: string;
}

// choice-group.tsx
export interface ChoiceGroupThemeConfig
  extends Omit<BodyThemeConfig, "textColor"> {
  dividerColor?: string;
  labelColor?: string;
  descriptionColor?: string;
}

// checkbox.tsx
export interface CheckboxThemeConfig
  extends Omit<BodyThemeConfig, "textColor"> {
  checkedBorderColor?: string;
  checkedBackgroundColor?: string;
  iconColor?: string;
  labelColor?: string;
  descriptionColor?: string;
  highlightBackgroundColor?: string;
  highlightHoverColor?: string;
}

// combobox.tsx
export interface ComboboxThemeConfig extends BodyThemeConfig {
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
export interface ColorboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  prefixColor?: string;

  boxBackgroundColor?: string;
}

// crumb.tsx
export interface CrumbThemeConfig
  extends Omit<BodyThemeConfig, "borderColor" | "backgroundColor"> {
  hoverColor?: string;
  lastTextColor?: string;
  arrowColor?: string;
  ellipsisColor?: string;
  ellipsisHoverColor?: string;
}

// dialog.tsx
export interface DialogThemeConfig extends BodyThemeConfig {
  boxShadow?: string;
  subtitleColor?: string;
}

// document-viewer.tsx
export interface DocumentViewerThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
  toolbarBackgroundColor?: string;
  errorColor?: string;
  hoverBoxTextColor?: string;
  hoverBoxBorderColor?: string;
  hoverBoxBackgroundColor?: string;
}

// dormant-text.tsx
export interface DormantTextThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  pencilColor?: string;
  actionButtonColor?: string;
  actionButtonHoverBackground?: string;
}

// drawer-tab.tsx
export interface DrawerTabThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  headerBackgroundColor?: string;
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
export interface FieldLaneThemeConfig
  extends Omit<BodyThemeConfig, "backgroundColor"> {
  buttonTextColor?: string;
  buttonBorderColor?: string;
  buttonErrorTextColor?: string;
  buttonErrorBorderColor?: string;

  highlightBackgroundColor: string;

  placeholderColor?: string;
  focusedBorderColor?: string;

  disabledOpacity?: number;
  disabledBorderColor?: string;
  disabledTextColor?: string;

  actionColor?: string;
  actionHoverColor?: string;

  errorColor?: string;
  errorBackground?: string;
  errorBorderColor?: string;
  errorForeground?: string;

  selectedBackgroundColor?: string;

  helperColor?: string;
  dividerColor?: string;
}

// file-input-box.tsx
export interface FileInputBoxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;
  errorBorderColor?: string;

  placeholderColor?: string;

  disabledTextColor?: string;

  disabledGradientColor?: string;
  errorGradientColor?: string;
  defaultGradientColor?: string;

  dragActiveColor?: string;
  dragActiveBackgroundColor?: string;
}

// file-drop-box.tsx

export interface FileDropBoxThemeConfig extends BodyThemeConfig {
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
export interface FrameThemeConfig extends Omit<BodyThemeConfig, "textColor"> {
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

export interface ImageboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

  draggingBackgroundColor?: string;
  draggingBorderColor?: string;
  draggingTextColor?: string;

  disabledBackgroundColor?: string;

  iconColor?: string;
}

// keynote.tsx
export interface KeynoteThemeConfig {
  keyColor?: string;
  valueColor?: string;
}

// list.tsx
export interface ListThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
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
  spinnerColor?: string;
  textColor?: string;
}

// messagebox.tsx
export interface MessageboxVariantTheme
  extends Omit<BodyThemeConfig, "borderColor"> {
  activeColor: string;
}

export type MessageboxThemeConfig = {
  [K in MessageboxVariantState]: MessageboxVariantTheme;
};

// moneybox.tsx
export interface MoneyboxThemeConfig extends BodyThemeConfig {
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
export interface NavTabThemeConfig extends BodyThemeConfig {
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
export interface PaperDialogThemeConfig extends BodyThemeConfig {
  boxShadow?: string;
  actionHoverBackgroundColor?: string;
}

// pagination.tsx
export interface PaginationThemeConfig extends BodyThemeConfig {
  activeBorderColor?: string;
  hoverBorderColor?: string;

  activeTextColor?: string;

  disabledBackgroundColor?: string;
  disabledTextColor?: string;
}

//pinbox.tsx
export interface PinboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  placeholderColor?: string;
  boxShadow?: string;
}

// phonebox.tsx
export interface PhoneboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;

  disabledBorderColor?: string;
  disabledTextColor?: string;

  placeholderColor?: string;

  boxShadow?: string;

  optionHighlightedBackground?: string;
}

// radio.tsx
export interface RadioThemeConfig extends BodyThemeConfig {
  checkedBorderColor?: string;

  checkedOutsideBorderColor?: string;
  checkedBackgroundColor?: string;
  iconColor?: string;
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
}

// rich-editor.tsx

export interface RichEditorThemeConfig extends BodyThemeConfig {
  placeholderColor?: string;
  toolbarBackground?: string;
  toolbarButtonActive?: string;
  toolbarButtonHover?: string;
  toolbarButtonFocused?: string;
  scrollThumb?: string;
  preBackgroundColor?: string;
}

// searchbox.tsx
export interface SearchboxThemeConfig extends BodyThemeConfig {
  activeBackgroundColor?: string;
  focusBorderColor?: string;
  focusShadow?: string;
  iconColor?: string;
  clearIconColor?: string;
}

// selectbox.tsx
export interface SelectboxThemeConfig extends BodyThemeConfig {
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
  lineShadow?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
}

// signbox.tsx
export interface SignboxThemeConfig extends BodyThemeConfig {
  errorBorderColor?: string;

  clearIconColor?: string;
  clearIconHoverBackground?: string;
}

// sidebar.tsx
export interface SidebarThemeConfig extends BodyThemeConfig {
  boxShadow?: string;

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

// stepline.tsx
export interface SteplineThemeConfig {
  outerCircle: Record<SteplineItemState["variant"], string>;
  innerCircle: Record<SteplineItemState["variant"], string>;
  text: Record<SteplineItemState["variant"], string>;
  line?: {
    default: string;
    completed: string;
    error: string;
  };
}
// statusbar.tsx
export interface StatusbarThemeConfig extends BodyThemeConfig {
  boxShadow: string;
  item: {
    activeBackgroundColor: string;
    hoverBackgroundColor: string;
  };
}

export interface StatefulFormThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
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
export interface TimeboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;
  colonColor?: string;
}

// textbox.tsx
export interface TextboxThemeConfig extends BodyThemeConfig {
  focusedBorderColor?: string;

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

// tooltip.tsx
export interface TooltipThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
  boxShadow?: string;
  arrowBackgroundColor: string;
}

// timeline.tsx
export interface TimelineThemeConfig extends SteplineThemeConfig {}

// thumb-field.tsx
export interface ThumbFieldThemeConfig {
  thumbsUpColor?: string;
  thumbsDownColor?: string;
  inactiveColor?: string;
  errorColor?: string;
  disabledOpacity?: number;
}

// togglebox.tsx
export interface ToggleboxThemeConfig extends BodyThemeConfig {
  checkedBackgroundColor?: string;
  thumbColor?: string;
  descriptionColor?: string;
  disabledOpacity?: number;
  boxShadow?: string;
}

// toolbar.tsx
export interface ToolbarThemeConfig extends BodyThemeConfig {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  focusBackgroundColor?: string;
  textDecoration?: string;
  dividerColor?: string;
}

// tip-menu.tsx
export interface TipMenuThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;

  dangerousBackgroundColor?: string;
  dangerousHoverBackgroundColor?: string;
  dangerousActiveBackgroundColor?: string;

  focusBorderColor?: string;
}

// treelist.tsx
export interface TreeListThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;

  highlightedText?: string;

  dividerHierarchyColor?: string;
  dividerHierarchySelectedColor?: string;
  dividerHierarchyRelatedColor?: string;
}

// window.tsx
export interface WindowThemeConfig
  extends Omit<BodyThemeConfig, "borderColor"> {
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
  imagebox: ImageboxThemeConfig;
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
  stepline: SteplineThemeConfig;
  table: TableThemeConfig;
  textbox: TextboxThemeConfig;
  textarea: TextareaThemeConfig;
  thumbField: ThumbFieldThemeConfig;
  timeline: TimelineThemeConfig;
  tipmenu: TipMenuThemeConfig;
  timebox: TimeboxThemeConfig;
  togglebox: ToggleboxThemeConfig;
  toolbar: Record<ToolbarVariantType, ToolbarThemeConfig>;
  tooltip: TooltipThemeConfig;
  treelist: TreeListThemeConfig;
  window: WindowThemeConfig;
}
