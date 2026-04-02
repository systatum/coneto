import * as React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { TipMenu, TipMenuItemProps, TipMenuItemVariantType } from "./tip-menu";
import styled, { css, CSSProp } from "styled-components";
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useFloating,
  size as floatingSize,
} from "@floating-ui/react";
import { Tooltip } from "./tooltip";
import { createPortal } from "react-dom";
import {
  DialogPlacement,
  getFloatingPlacement,
} from "./../lib/floating-placement";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";

export type ButtonVariants = {
  variant?:
    | "link"
    | "default"
    | "primary"
    | "danger"
    | "secondary"
    | "ghost"
    | "transparent"
    | "success"
    | "outline-default"
    | "outline-success"
    | "outline-primary"
    | "outline-danger";
  size?: "icon" | "xs" | "md" | "sm" | "lg";
};

export interface SubMenuButtonProps {
  list?: (
    subMenuList: TipMenuItemProps[],
    withFilter?: { withFilter?: boolean }
  ) => React.ReactNode;
  show?: (
    children: React.ReactNode,
    item?: { withArrow?: boolean; arrowStyle?: CSSProp; drawerStyle?: CSSProp }
  ) => React.ReactNode;
  render?: (children?: React.ReactNode) => React.ReactNode;
}

export type ButtonProps = Omit<React.ComponentProps<"button">, "style"> &
  ButtonVariants & {
    isLoading?: boolean;
    subMenu?: (props: SubMenuButtonProps) => React.ReactNode;
    openedIcon?: FigureProps["image"];
    closedIcon?: FigureProps["image"];
    showSubMenuOn?: "caret" | "self";
    tipMenuSize?: TipMenuItemVariantType;
    safeAreaAriaLabels?: string[];
    dialogPlacement?: DialogPlacement;
    onOpen?: (prop: boolean) => void;
    open?: boolean;
    styles?: ButtonStylesProps;
    anchorRef?: React.RefObject<HTMLElement>;
    icon?: FigureProps;
    pressed?: boolean;
    activeBackgroundColor?: string;
    hoverBackgroundColor?: string;
    displayLabel?: "flex" | "ellipsis";
  };

export interface ButtonStylesProps {
  dropdownStyle?: CSSProp | ((placement: Placement) => CSSProp);
  self?: CSSProp;
  toggleStyle?: CSSProp;
  containerStyle?: CSSProp;
  dividerStyle?: CSSProp;
}

function Button({
  variant = "default",
  size = "md",
  isLoading,
  openedIcon = RiArrowDownSLine,
  closedIcon = RiArrowUpSLine,
  children,
  disabled,
  styles,
  onClick,
  tipMenuSize,
  subMenu,
  showSubMenuOn = "caret",
  safeAreaAriaLabels,
  activeBackgroundColor,
  dialogPlacement = "bottom-left",
  onOpen,
  open,
  anchorRef,
  pressed,
  icon,
  hoverBackgroundColor,
  displayLabel = "ellipsis",
  ...props
}: ButtonProps) {
  const [isOpenLocal, setIsOpenLocal] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : isOpenLocal;
  const setIsOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setIsOpenLocal(next);
      }
      onOpen?.(next);
    },
    [isControlled, onOpen]
  );

  const [hovered, setHovered] = React.useState<
    "main" | "original" | "dropdown"
  >("original");

  const { refs, floatingStyles, placement } = useFloating({
    placement: getFloatingPlacement(dialogPlacement),
    open: isOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 40 }),
      shift(),
      ...(anchorRef
        ? [
            floatingSize({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
  });

  React.useEffect(() => {
    if (anchorRef) {
      refs.setReference(anchorRef.current);
    }
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const safeAreaAriaLabelsLocal: string[] = [
    "combobox-drawer-month",
    "combobox-drawer-year",
    "tip-menu",
    "list-container",
    ...(safeAreaAriaLabels || []),
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const el = target as HTMLElement;

      if (
        Array.isArray(safeAreaAriaLabelsLocal) &&
        safeAreaAriaLabelsLocal.some((label) =>
          el.closest(`[aria-label="${label}"]`)
        )
      ) {
        return;
      }

      if (refs.floating.current?.contains(target)) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
        setHovered("original");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [safeAreaAriaLabelsLocal]);

  return (
    <ButtonWrapper
      $disabled={disabled}
      ref={(node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (!anchorRef) {
          refs.setReference(node);
        }
      }}
      $style={styles?.containerStyle}
      $isOpen={isOpen}
      $variant={variant}
    >
      <BaseButton
        onClick={(e) => {
          if (onClick && showSubMenuOn === "caret") {
            onClick(e);
          }
          if (subMenu && showSubMenuOn === "self") {
            e.stopPropagation();
            setIsOpen(!isOpen);
          } else {
            setIsOpen(false);
          }
        }}
        {...props}
        $pressed={pressed}
        $hoverBackgroundColor={hoverBackgroundColor}
        $activeBackgroundColor={activeBackgroundColor}
        $variant={variant}
        $size={size}
        disabled={disabled}
        $disabled={disabled}
        $isOpen={showSubMenuOn === "self" && isOpen}
        $tipMenu={subMenu && showSubMenuOn === "caret" ? true : false}
        onMouseEnter={(e) => {
          setHovered("main");
          if (props.onMouseEnter) {
            props.onMouseEnter(e);
          }
        }}
        onMouseLeave={(e) => {
          setHovered("original");
          if (props.onMouseLeave) {
            props.onMouseLeave(e);
          }
        }}
        $style={styles?.self}
      >
        {icon && (
          <Figure
            {...icon}
            color={variant === "danger" ? "white" : icon?.color}
            aria-label="action-button-icon"
            size={icon?.size ?? 14}
          />
        )}
        {children && (
          <ButtonLabel
            $withFlex={displayLabel === "flex"}
            aria-label="button-label"
          >
            {children}
          </ButtonLabel>
        )}
        {isLoading && <LoadingSpinner />}
      </BaseButton>

      {showSubMenuOn === "caret" && subMenu && (
        <div
          style={{
            position: "relative",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Divider
            aria-label="divider"
            $hovered={hovered === "main" || hovered === "dropdown" || isOpen}
            $variant={variant}
            $isOpen={isOpen}
            $style={styles?.dividerStyle}
          />

          <BaseButtonToggle
            aria-label="button-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            $variant={variant}
            $isOpen={isOpen}
            $size={size}
            $tipMenu={subMenu ? true : false}
            $disabled={disabled}
            onMouseEnter={(e) => {
              setHovered("dropdown");
              if (props.onMouseEnter) {
                props.onMouseEnter(e);
              }
            }}
            onMouseLeave={(e) => {
              setHovered("original");
              if (props.onMouseLeave) {
                props.onMouseLeave(e);
              }
            }}
            $style={styles?.toggleStyle}
          >
            {isOpen ? (
              <Figure image={openedIcon} size={20} />
            ) : (
              <Figure image={closedIcon} size={20} />
            )}
          </BaseButtonToggle>
        </div>
      )}

      {isOpen &&
        createPortal(
          <DropdownWrapper
            aria-label="button-dropdown-wrapper"
            ref={refs.setFloating}
            style={{ ...floatingStyles }}
            $style={
              typeof styles?.dropdownStyle === "function"
                ? styles?.dropdownStyle(placement)
                : styles?.dropdownStyle
            }
            onMouseEnter={() => setHovered("dropdown")}
          >
            {subMenu({
              list: (subMenuList, { withFilter } = {}) => (
                <TipMenu
                  setIsOpen={() => {
                    setIsOpen(false);

                    setHovered("original");
                  }}
                  withFilter={withFilter ?? false}
                  subMenuList={subMenuList}
                  variant={tipMenuSize}
                />
              ),
              show: (children, { withArrow, arrowStyle, drawerStyle } = {}) => (
                <Tooltip.Container
                  styles={{
                    arrowStyle: css`
                      ${!withArrow
                        ? css`
                            display: none;
                          `
                        : css`
                            background-color: gray;
                            ${arrowStyle}
                          `}
                    `,
                    drawerStyle: css`
                      padding: 0px;
                      color: black;
                      ${drawerStyle}
                    `,
                  }}
                  placement={placement}
                  dialog={children}
                />
              ),
              render: (children) => children,
            })}
          </DropdownWrapper>,
          document.body
        )}
    </ButtonWrapper>
  );
}

const DropdownWrapper = styled.div<{ $style?: CSSProp }>`
  z-index: 9992999;

  ${({ $style }) => $style};
`;

const ButtonLabel = styled.span<{
  $withFlex?: boolean;
}>`
  ${({ $withFlex }) =>
    $withFlex &&
    css`
      display: flex;
    `};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`;

export interface ButtonTipMenuContainerStylesProps {
  self?: CSSProp;
}

function ButtonTipMenuContainer({
  styles,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "style"> & {
  styles?: ButtonTipMenuContainerStylesProps;
  children?: React.ReactNode;
}) {
  const { currentTheme } = useTheme();
  const buttonTheme = currentTheme.card;

  return (
    <TipMenuContainer
      {...props}
      $backgroundColor={buttonTheme.backgroundColor}
      onClick={(e) => {
        if (props.onClick) props.onClick?.(e);
      }}
      aria-label="button-tip-menu-container"
      $style={styles?.self}
    >
      {children}
    </TipMenuContainer>
  );
}

const TipMenuContainer = styled.div<{
  $style?: CSSProp;
  $backgroundColor?: string;
}>`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  padding: 4px;
  gap: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation-duration: 200ms;
  background-color: ${({ $backgroundColor }) => $backgroundColor};

  ${({ $style }) => $style}
`;

const ButtonWrapper = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
  $isOpen?: boolean;
  $variant?: ButtonVariants["variant"];
}>`
  display: flex;
  position: relative;
  align-items: center;
  width: fit-content;

  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $isOpen, $variant }) => {
    const { border } = getButtonColors($variant, $isOpen);
    return css`
      ${$variant?.startsWith("outline") &&
      css`
        border: ${border};
        border-radius: 2px;
      `}
    `;
  }}

  ${({ $style }) => $style}
`;

const getVariantTextColor = (variant: string) => {
  if (variant === "link") return "white";
  if (variant === "outline-default") return "black";
  if (variant.startsWith("outline")) return "white";
  return undefined;
};

const SIZE_STYLES: Record<NonNullable<ButtonProps["size"]>, CSSProp> = {
  xs: css`
    height: 28px;
    padding: 0 6px;
  `,
  sm: css`
    height: 32px;
    padding: 0 12px;
  `,
  md: css`
    height: 36px;
    padding: 0 16px;
  `,
  lg: css`
    height: 40px;
    padding: 0 24px;
  `,
  icon: css`
    width: 36px;
    height: 36px;
    padding: 0;
  `,
};

const getSizeStyles = (size?: ButtonProps["size"]) => {
  return SIZE_STYLES[size ?? "md"];
};

const BaseButton = styled.button<{
  $tipMenu?: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $variant: NonNullable<ButtonVariants["variant"]>;
  $size: NonNullable<ButtonVariants["size"]>;
  $isOpen?: boolean;
  $activeBackgroundColor?: string;
  $pressed?: boolean;
  $hoverBackgroundColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  border: none;
  outline: none;
  border-radius: 2px;

  transition: all 0.2s ease-in-out;
  user-select: none;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  ${({ $size }) => getSizeStyles($size)}

  ${({
    $variant,
    $isOpen,
    $activeBackgroundColor,
    $hoverBackgroundColor,
    $pressed,
  }) => {
    const { backgroundColor, color, textDecoration } = getButtonColors(
      $variant,
      $isOpen,
      $activeBackgroundColor
    );

    const activeBg = $activeBackgroundColor
      ? $activeBackgroundColor
      : getActiveColor($variant);

    const hoverBg = $hoverBackgroundColor
      ? $hoverBackgroundColor
      : getHoverColor($variant);

    const textColor = getVariantTextColor($variant);

    return css`
      background-color: ${backgroundColor};
      color: ${color};
      text-decoration: ${textDecoration};

      ${$isOpen &&
      css`
        position: relative;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          overflow: hidden;
          box-shadow:
            inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
            inset 0 -0.5px 0.5px ${getActiveColor($variant)};
        }
      `}

      ${$pressed
        ? css`
            background-color: ${activeBg};
            color: ${textColor};
            box-shadow:
              inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
              inset 0 -0.5px 0.5px ${getActiveColor($variant)};
          `
        : css`
            ${!$isOpen &&
            css`
              &:hover {
                background-color: ${hoverBg};
                color: ${textColor};
              }
            `}

            &:active {
              background-color: ${activeBg};
              box-shadow:
                inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
                inset 0 -0.5px 0.5px ${getActiveColor($variant)};
            }

            &:focus-visible {
              box-shadow: inset 0 0 0 2px ${getFocusColor($variant)};
            }
          `};
    `;
  }};

  ${({ $tipMenu }) =>
    $tipMenu &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `};

  ${({ $style }) => $style}
`;

const BaseButtonToggle = styled(BaseButton)<{
  $style?: CSSProp;
  $isOpen?: boolean;
}>`
  min-width: 40px;
  max-width: 40px;
  padding: 0;

  border-top-left-radius: ${({ $tipMenu }) => ($tipMenu ? 0 : "2px")};
  border-bottom-left-radius: ${({ $tipMenu }) => ($tipMenu ? 0 : "2px")};
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;

  ${({ $style }) => $style}
`;

const Divider = styled.div<{
  $hovered?: boolean;
  $variant: ButtonVariants["variant"];
  $isOpen?: boolean;
  $style?: CSSProp;
}>`
  height: ${({ $hovered }) => ($hovered ? "100%" : "80%")};
  border-right: 1px solid;
  position: absolute;
  transition: height 100ms ease-in-out;
  right: 40px;

  ${({ $variant, $isOpen }) => {
    const { color } = getButtonColors($variant, $isOpen);
    return css`
      border-color: ${$variant === "default" ||
      $variant === "ghost" ||
      $variant === "outline-default"
        ? "gray"
        : color};
    `;
  }}

  ${({ $style }) => $style}
`;

const getButtonColors = (
  variant: ButtonVariants["variant"] = "default",
  isOpen?: boolean,
  customActiveColor?: string
) => {
  const { currentTheme } = useTheme();

  const outlineMatch = variant?.match(/^outline-(.+)$/);
  const baseVariant = outlineMatch
    ? (outlineMatch[1] as ButtonVariants["variant"])
    : variant;

  const themeButton =
    currentTheme.button[variant] ||
    currentTheme.button[baseVariant] ||
    currentTheme.button.default;

  const backgroundColor = isOpen
    ? (customActiveColor ?? themeButton.activeBackgroundColor)
    : themeButton.backgroundColor;

  const color = themeButton.textColor;

  const border = themeButton.borderColor
    ? `1px solid ${themeButton.borderColor}`
    : undefined;

  const textDecoration = themeButton.textDecoration;

  return {
    backgroundColor,
    color,
    border,
    textDecoration,
  };
};

const getHoverColor = (variant: ButtonVariants["variant"]) => {
  const { currentTheme } = useTheme();

  const outlineMatch = variant?.match(/^outline-(.+)$/);
  if (outlineMatch) {
    const baseVariant = outlineMatch[1] as ButtonVariants["variant"];
    return getHoverColor(baseVariant);
  }

  return currentTheme.button[variant ?? "default"]?.hoverBackgroundColor;
};

const getActiveColor = (variant: ButtonVariants["variant"]) => {
  const { currentTheme } = useTheme();

  const outlineMatch = variant?.match(/^outline-(.+)$/);
  if (outlineMatch) {
    const baseVariant = outlineMatch[1] as ButtonVariants["variant"];
    return getActiveColor(baseVariant);
  }

  return currentTheme.button[variant ?? "default"]?.activeBackgroundColor;
};

const getFocusColor = (variant: ButtonVariants["variant"]) => {
  const { currentTheme } = useTheme();

  const outlineMatch = variant?.match(/^outline-(.+)$/);
  if (outlineMatch) {
    const baseVariant = outlineMatch[1] as ButtonVariants["variant"];
    return getFocusColor(baseVariant);
  }

  return currentTheme.button[variant ?? "default"]?.focusBackgroundColor;
};

Button.TipMenuContainer = ButtonTipMenuContainer;

export { Button };
