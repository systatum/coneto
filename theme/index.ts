import { MessageboxVariantState } from "./../components/messagebox";
import { ButtonVariants } from "./../components/button";
import { ToolbarVariantType } from "./../components/toolbar";

export type ThemeMode = "light" | "dark";

// body.tsx
export interface BodyThemeConfiguration {
  backgroundColor?: string;
  textColor?: string;
}

// action-capsule
export interface ActionCapsuleThemeConfiguration {
  activeBackgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  capsuleWrapperBoxShadow?: string;
  capsuleWrapperMinHeight?: string;
  capsuleWrapperMaxHeight?: string;
  capsuleWrapperBorderRadius?: string;
  capsuleFontSize?: string;
  tabTextColor?: string;
  tabBorderRadius?: string;
}

// action-button.tsx
export interface ActionButtonThemeConfiguration {
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
export interface AvatarThemeConfiguration {
  borderColor?: string;
  textColor?: string;
  overlayBackground?: string;
  overlayIconColor?: string;
}

// badge.tsx
export interface BadgeThemeConfiguration extends BodyThemeConfiguration {
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
export interface BoxbarThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
  toggleButtonColor?: string;
  toggleButtonHoverColor?: string;
}

// button.tsx
export interface ButtonThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
  focusBackgroundColor?: string;
}

export interface TipMenuContainerThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
}

// calendar.tsx
export interface CalendarThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  dayTextColor: string;

  disabledDateColor?: string;
  weekendDateColor?: string;

  rangeDateColor?: string;
  highlightedDateTextColor?: string;
  hightlightDateColor?: string;

  boxShadow?: string;
}

// capsule.tsx
export interface CapsuleThemeConfiguration {
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
export interface CapsuleTabThemeConfiguration {
  borderColor?: string;
  boxShadow?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
}

// card.tsx
export interface CardThemeConfiguration extends BodyThemeConfiguration {
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
export interface ChipsThemeConfiguration {
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
export interface ChoiceGroupThemeConfiguration {
  borderColor?: string;
  dividerColor?: string;
  labelColor?: string;
  backgroundColor?: string;
  descriptionColor?: string;
}

// checkbox.tsx
export interface CheckboxThemeConfiguration {
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
export interface ComboboxThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  highlightBackgroundColor?: string;
  selectedBackgroundColor?: string;
  selectedTextColor?: string;

  disabledTextColor?: string;
  emptyTextColor?: string;

  dividerColor?: string;
  boxShadow?: string;
}

// colorbox.tsx
export interface ColorboxThemeConfiguration {
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

// dialog.tsx
export interface DialogThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;
  subtitleColor?: string;
}

// document-viewer.tsx
export interface DocumentViewerThemeConfiguration {
  backgroundColor?: string;
  toolbarBackgroundColor?: string;
  textColor?: string;
  errorColor?: string;
  hoverBoxTextColor?: string;
  hoverBoxBorderColor?: string;
  hoverBoxBackgroundColor?: string;
}

// dormant-text.tsx
export interface DormantTextThemeConfiguration {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  pencilColor?: string;
  actionButtonColor?: string;
  actionButtonHoverBackground?: string;
}

// drawer-tab.tsx
export interface DrawerTabThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  headerBackgroundColor?: string;
  textColor?: string;
  closeButtonHoverBackground?: string;
  dividerColor?: string;
}

// error-slate.tsx
export interface ErrorSlateThemeConfiguration {
  cubeFaceBackground?: string;
  cubeFaceBorder?: string;
  cubeFaceText?: string;
  titleColor?: string;
}

// field-lane.tsx
export interface FieldLaneThemeConfiguration {
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
export interface FileInputBoxThemeConfiguration {
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

export interface FileDropBoxThemeConfiguration {
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
export interface FrameThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  titleColor?: string;
  titleBackgroundColor?: string;
  overlayBackgroundColor?: string;
  boxShadow?: string;
}

// grid.tsx
export interface GridThemeConfiguration {
  cardBackgroundColor?: string;
  cardHoverBackgroundColor?: string;
  cardSelectedBackgroundColor?: string;
  cardBorderColor?: string;
  cardShadow?: string;
  thumbnailBackgroundColor?: string;
}

// keynote.tsx
export interface KeynoteThemeConfiguration {
  keyColor?: string;
  valueColor?: string;
}

// list.tsx
export interface ListThemeConfiguration {
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
export interface LoadingSkeletonThemeConfiguration {
  baseColor?: string;
  highlightColor?: string;
}

// loading-spinner.tsx
export interface LoadingSpinnerThemeConfiguration {
  color?: string;
  textColor?: string;
}

// messagebox.tsx
export interface MessageboxVariantTheme {
  container: string;
  text: string;
  active: string;
}

export type MessageboxThemeConfiguration = {
  [K in MessageboxVariantState]: MessageboxVariantTheme;
};

// moneybox.tsx
export interface MoneyboxThemeConfiguration {
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
export interface ModalDialogThemeConfiguration
  extends DialogThemeConfiguration {
  dividerColor?: string;
}

// nav-tab.tsx
export interface NavTabThemeConfiguration {
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
export interface OverlayBlockerThemeConfiguration {
  backgroundColor?: string;
  backdropFilter?: string;
}

// paper-dialog.tsx
export interface PaperDialogThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  boxShadow?: string;
  textColor?: string;
  actionHoverBackgroundColor?: string;
}

//pinbox.tsx
export interface PinboxThemeConfiguration {
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
export interface PhoneboxThemeConfiguration {
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
export interface RadioThemeConfiguration {
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
export interface RatingThemeConfiguration {
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

export interface RichEditorThemeConfiguration {
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
export interface SearchboxThemeConfiguration {
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
export interface SelectboxThemeConfiguration {
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
export interface SeparatorThemeConfiguration {
  containerColor?: string;
  lineColor?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
}

// signbox.tsx
export interface SignboxThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  errorBorderColor?: string;

  clearIconColor?: string;
  clearIconHoverBackground?: string;
}

// sidebar.tsx
export interface SidebarThemeConfiguration {
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
export interface StatusbarThemeConfiguration {
  backgroundColor: string;
  borderColor: string;
  boxShadow: string;
  textColor: string;
  item: {
    activeBackgroundColor: string;
    hoverBackgroundColor: string;
  };
}

export interface StatefulFormThemeConfiguration {
  backgroundColor: string;
  textColor: string;
  rowFrameBackgroundColor: string;
}

// table.tsx
export interface TableThemeConfiguration {
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
export interface TimeboxThemeConfiguration {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  focusedBorderColor?: string;

  errorBorderColor?: string;
  errorTextColor?: string;
  colonColor?: string;
}

// textbox.tsx
export interface TextboxThemeConfiguration {
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
export interface TextareaThemeConfiguration extends TextboxThemeConfiguration {
  scrollbarThumbColor?: string;
}

// thumb-field.tsx
export interface ThumbFieldThemeConfiguration {
  thumbsUpColor?: string;
  thumbsDownColor?: string;
  inactiveColor?: string;
  errorColor?: string;
  disabledOpacity?: number;
}

// togglebox.tsx
export interface ToggleboxThemeConfiguration {
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
export interface ToolbarThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  focusBackgroundColor?: string;
  borderColor?: string;
  textDecoration?: string;
}

// tip-menu.tsx
export interface TipMenuThemeConfiguration {
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
export interface TreeListThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;

  highlightedText?: string;

  dividerHierarchyColor?: string;
  dividerHierarchySelectedColor?: string;
  dividerHierarchyRelatedColor?: string;
}

// window.tsx
export interface WindowThemeConfiguration extends BodyThemeConfiguration {
  dividerColor?: string;
}

// app-theme.tsx
export interface AppTheme {
  body: BodyThemeConfiguration;

  actionCapsule: ActionCapsuleThemeConfiguration;
  actionButton: ActionButtonThemeConfiguration;

  avatar: AvatarThemeConfiguration;
  badge: BadgeThemeConfiguration;
  boxbar: BoxbarThemeConfiguration;
  button: Record<ButtonVariants["variant"], ButtonThemeConfiguration>;
  buttonTipMenu: TipMenuContainerThemeConfiguration;
  calendar: CalendarThemeConfiguration;
  capsule: CapsuleThemeConfiguration;
  capsuleTab: CapsuleTabThemeConfiguration;
  card: CardThemeConfiguration;
  chips: ChipsThemeConfiguration;
  choiceGroup: ChoiceGroupThemeConfiguration;
  checkbox: CheckboxThemeConfiguration;
  colorbox: ColorboxThemeConfiguration;
  combobox: ComboboxThemeConfiguration;
  dialog: DialogThemeConfiguration;
  documentViewer: DocumentViewerThemeConfiguration;
  dormantText: DormantTextThemeConfiguration;
  drawerTab: DrawerTabThemeConfiguration;
  errorSlate: ErrorSlateThemeConfiguration;
  fieldLane: FieldLaneThemeConfiguration;
  fileInputBox: FileInputBoxThemeConfiguration;
  fileDropBox: FileDropBoxThemeConfiguration;
  frame: FrameThemeConfiguration;
  grid: GridThemeConfiguration;
  keynote: KeynoteThemeConfiguration;
  list: ListThemeConfiguration;
  loadingSkeleton: LoadingSkeletonThemeConfiguration;
  loadingSpinner: LoadingSpinnerThemeConfiguration;
  messagebox: MessageboxThemeConfiguration;
  moneybox: MoneyboxThemeConfiguration;
  modalDialog: ModalDialogThemeConfiguration;
  navTab: NavTabThemeConfiguration;
  overlayBlocker: OverlayBlockerThemeConfiguration;
  paperDialog: PaperDialogThemeConfiguration;
  pinbox: PinboxThemeConfiguration;
  phonebox: PhoneboxThemeConfiguration;
  radio: RadioThemeConfiguration;
  rating: RatingThemeConfiguration;
  richEditor: RichEditorThemeConfiguration;
  searchbox: SearchboxThemeConfiguration;
  selectbox: SelectboxThemeConfiguration;
  separator: SeparatorThemeConfiguration;
  sidebar: SidebarThemeConfiguration;
  signbox: SignboxThemeConfiguration;
  statusbar: StatusbarThemeConfiguration;
  statefulForm: StatefulFormThemeConfiguration;
  textbox: TextboxThemeConfiguration;
  textarea: TextareaThemeConfiguration;
  thumbField: ThumbFieldThemeConfiguration;
  table: TableThemeConfiguration;
  tipmenu: TipMenuThemeConfiguration;
  timebox: TimeboxThemeConfiguration;
  toolbar: Record<ToolbarVariantType, ToolbarThemeConfiguration>;
  togglebox: ToggleboxThemeConfiguration;
  treelist: TreeListThemeConfiguration;
  window: WindowThemeConfiguration;
}
