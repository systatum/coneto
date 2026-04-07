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
}

// card.tsx
export interface CardThemeConfiguration extends BodyThemeConfiguration {
  borderColor?: string;
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

  labelColor: string;
  labelDisabledColor: string;

  inputBorder: string;

  placeholderColor?: string;
  focusedBorderColor?: string;

  disabledOpacity: number;

  actionColor: string;
  actionHoverColor: string;

  errorColor: string;
  errorBackground: string;
  errorBorderColor?: string;
  errorForeground: string;

  helperColor: string;
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
  selectedBackgroundColor?: string;
  borderColor?: string;
  mutedTextColor?: string;
  dragLineColor?: string;
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

// radio.tsx
export interface RadioThemeConfiguration {
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

// separator.tsx
export interface SeparatorThemeConfiguration {
  containerColor?: string;
  lineColor?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
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
  dialog: DialogThemeConfiguration;
  documentViewer: DocumentViewerThemeConfiguration;
  dormantText: DormantTextThemeConfiguration;
  drawerTab: DrawerTabThemeConfiguration;
  errorSlate: ErrorSlateThemeConfiguration;
  fieldLane: FieldLaneThemeConfiguration;
  grid: GridThemeConfiguration;
  keynote: KeynoteThemeConfiguration;
  list: ListThemeConfiguration;
  loadingSkeleton: LoadingSkeletonThemeConfiguration;
  loadingSpinner: LoadingSpinnerThemeConfiguration;
  messagebox: MessageboxThemeConfiguration;
  modalDialog: ModalDialogThemeConfiguration;
  navTab: NavTabThemeConfiguration;
  overlayBlocker: OverlayBlockerThemeConfiguration;
  paperDialog: PaperDialogThemeConfiguration;
  radio: RadioThemeConfiguration;
  searchbox: SearchboxThemeConfiguration;
  separator: SeparatorThemeConfiguration;
  sidebar: SidebarThemeConfiguration;
  statusbar: StatusbarThemeConfiguration;
  thumbField: ThumbFieldThemeConfiguration;
  table: TableThemeConfiguration;
  tipmenu: TipMenuThemeConfiguration;
  timebox: TimeboxThemeConfiguration;
  toolbar: Record<ToolbarVariantType, ToolbarThemeConfiguration>;
  togglebox: ToggleboxThemeConfiguration;
  treelist: TreeListThemeConfiguration;
  window: WindowThemeConfiguration;
}
