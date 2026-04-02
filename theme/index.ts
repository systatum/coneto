import { ButtonVariants } from "./../components/button";

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

// error-slate.tsx
export interface ErrorSlateThemeConfiguration {
  cubeFaceBackground?: string;
  cubeFaceBorder?: string;
  cubeFaceText?: string;
  titleColor?: string;
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

// separator.tsx
export interface SeparatorThemeConfiguration {
  containerColor?: string;
  lineColor?: string;
  titleColor?: string;
  backgroundTitleColor?: string;
}

// table.tsx
export interface TableThemeConfiguration {
  textColor?: string;
  boxShadow?: string;
  headerActionBackgroundColor?: string;
  headerBackgroundColor?: string;
  headerBorderColor?: string;
  rowSubtitleTextColor?: string;
  rowBackgroundColor?: string;
  rowBorderColor?: string;
  rowHoverBackgroundColor?: string;
  rowContentBackgroundColor?: string;
  summaryBackgroundColor?: string;
  summaryBorderColor?: string;
}

// treelist.tsx
export interface TreeListThemeConfiguration extends BodyThemeConfiguration {
  hoverBackgroundColor?: string;
  selectedBackgroundColor?: string;
  borderColor?: string;
  expandIconColor?: string;
}

// window.tsx
export interface WindowThemeConfiguration extends BodyThemeConfiguration {
  dividerColor: string;
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
  card: CardThemeConfiguration;
  choiceGroup: ChoiceGroupThemeConfiguration;
  checkbox: CheckboxThemeConfiguration;
  documentViewer: DocumentViewerThemeConfiguration;
  errorSlate: ErrorSlateThemeConfiguration;
  grid: GridThemeConfiguration;
  keynote: KeynoteThemeConfiguration;
  list: ListThemeConfiguration;
  loadingSkeleton: LoadingSkeletonThemeConfiguration;
  loadingSpinner: LoadingSpinnerThemeConfiguration;
  radio: RadioThemeConfiguration;
  separator: SeparatorThemeConfiguration;
  table: TableThemeConfiguration;
  treelist: TreeListThemeConfiguration;
  window: WindowThemeConfiguration;
}
