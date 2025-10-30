import * as React from "react";
import { LoadingSpinner } from "./loading-spinner";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "@remixicon/react";
import { TipMenu, TipMenuItemProps, TipMenuItemVariantType } from "./tip-menu";
import styled, { css, CSSProp } from "styled-components";
import { createPortal } from "react-dom";

export type ButtonVariants = {
  variant?:
    | "link"
    | "outline"
    | "default"
    | "primary"
    | "danger"
    | "secondary"
    | "ghost"
    | "transparent";
  size?: "icon" | "xs" | "md" | "sm" | "lg";
};

export interface SubMenuButtonProps {
  list?: (subMenuList: TipMenuItemProps[]) => React.ReactNode;
  show?: (children: React.ReactNode) => React.ReactNode;
  render?: (children?: React.ReactNode) => React.ReactNode;
}

export type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariants & {
    isLoading?: boolean;
    subMenu?: (props: SubMenuButtonProps) => React.ReactNode;
    dropdownStyle?: CSSProp;
    openedIcon?: RemixiconComponentType;
    closedIcon?: RemixiconComponentType;
    buttonStyle?: CSSProp;
    toggleStyle?: CSSProp;
    containerStyle?: CSSProp;
    dividerStyle?: CSSProp;
    showSubMenuOn?: "caret" | "self";
    tipMenuSize?: TipMenuItemVariantType;
    isSafeAreaActive?: string[];
  };

function Button({
  variant = "default",
  size = "md",
  isLoading,
  dropdownStyle,
  openedIcon: OpenedIcon = RiArrowDownSLine,
  closedIcon: ClosedIcon = RiArrowUpSLine,
  children,
  disabled,
  containerStyle,
  buttonStyle,
  toggleStyle,
  onClick,
  dividerStyle,
  tipMenuSize,
  subMenu,
  showSubMenuOn = "caret",
  isSafeAreaActive,
  ...props
}: ButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<
    "main" | "original" | "dropdown"
  >("original");
  const [positionClass, setPositionClass] = React.useState<"left" | "right">(
    "left"
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const el = target as HTMLElement;

      if (
        Array.isArray(isSafeAreaActive) &&
        isSafeAreaActive.some((label) => el.closest(`[aria-label="${label}"]`))
      ) {
        return;
      }

      if (
        containerRef.current &&
        dropdownRef.current &&
        !containerRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        setTimeout(() => {
          setIsOpen(false);
          setHovered("original");
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSafeAreaActive]);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const half = window.innerWidth / 2;
      setPositionClass(rect.left > half ? "right" : "left");
    }
  }, [isOpen]);

  return (
    <ButtonWrapper
      $disabled={disabled}
      ref={containerRef}
      $style={containerStyle}
      $isOpen={isOpen}
      $variant={variant}
    >
      <BaseButton
        onClick={(event) => {
          if (onClick && showSubMenuOn === "caret") {
            onClick(event);
          }
          if (subMenu && showSubMenuOn === "self") {
            setIsOpen((prev) => !prev);
          } else {
            setIsOpen(false);
          }
        }}
        {...props}
        $variant={variant}
        $size={size}
        disabled={disabled}
        $disabled={disabled}
        $tipMenu={subMenu && showSubMenuOn === "caret" ? true : false}
        onMouseEnter={() => setHovered("dropdown")}
        onMouseLeave={() => setHovered("original")}
        $style={buttonStyle}
      >
        {children}
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
            $style={dividerStyle}
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
            onMouseEnter={() => setHovered("dropdown")}
            onMouseLeave={() => setHovered("original")}
            $style={toggleStyle}
          >
            {isOpen ? <OpenedIcon size={20} /> : <ClosedIcon size={20} />}
          </BaseButtonToggle>
        </div>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top:
                (containerRef.current?.getBoundingClientRect().bottom ?? 0) +
                window.scrollY,
              left:
                positionClass === "left"
                  ? (containerRef.current?.getBoundingClientRect().left ?? 0) +
                    window.scrollX
                  : undefined,
              right:
                positionClass === "right"
                  ? window.innerWidth -
                    (containerRef.current?.getBoundingClientRect().right ?? 0) -
                    window.scrollX
                  : undefined,

              zIndex: 9999,
            }}
            onMouseEnter={() => setHovered("dropdown")}
          >
            {subMenu({
              list: (subMenuList) => (
                <TipMenu
                  setIsOpen={() => {
                    setIsOpen(false);
                    setHovered("original");
                  }}
                  style={dropdownStyle}
                  subMenuList={subMenuList}
                  variant={tipMenuSize}
                />
              ),
              show: (children) => (
                <ButtonTipMenuContainer>{children}</ButtonTipMenuContainer>
              ),
              render: (children) => children,
            })}
          </div>,
          document.body
        )}
    </ButtonWrapper>
  );
}

function ButtonTipMenuContainer({
  style,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "style"> & {
  style?: CSSProp;
  children?: React.ReactNode;
}) {
  return (
    <TipMenuContainer
      {...props}
      onClick={(e) => {
        if (props.onClick) props.onClick?.(e);
      }}
      aria-label="button-tip-menu-container"
      $style={style}
    >
      {children}
    </TipMenuContainer>
  );
}

const TipMenuContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  border: 1px solid #f3f4f6;
  padding: 4px;
  background-color: white;
  gap: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation-duration: 200ms;

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
      ${$variant === "outline" &&
      css`
        border: ${border};
        border-radius: 2px;
      `}
    `;
  }}

  ${({ $style }) =>
    $style
      ? $style
      : css`
          width: fit-content;
          height: fit-content;
        `}
`;

const BaseButton = styled.button<{
  $tipMenu?: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $variant: NonNullable<ButtonVariants["variant"]>;
  $size: NonNullable<ButtonVariants["size"]>;
  $isOpen?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  user-select: none;
  outline: none;
  border: none;
  border-radius: 2px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  ${({ $size }) => {
    switch ($size) {
      case "xs":
        return css`
          height: 28px;
          padding: 0 6px;
        `;
      case "sm":
        return css`
          height: 32px;
          padding: 0 12px;
        `;
      case "lg":
        return css`
          height: 40px;
          padding: 0 24px;
        `;
      case "icon":
        return css`
          width: 36px;
          height: 36px;
          padding: 0;
        `;
      default:
        return css`
          height: 36px;
          padding: 0 16px;
        `;
    }
  }}

  ${({ $variant, $isOpen }) => {
    const { bg, color, underline } = getButtonColors($variant, $isOpen);
    return css`
      background-color: ${bg};
      color: ${color};

      ${$isOpen &&
      css`
        position: relative;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow:
            inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
            inset 0 -0.5px 0.5px ${getActiveColor($variant)};
          border-radius: inherit;
          pointer-events: none;
        }
      `}

      ${underline
        ? css`
            text-decoration: underline;
          `
        : ""}

      &:hover {
        ${!$isOpen &&
        css`
          background-color: ${getHoverColor($variant)};
        `}
      }
    `;
  }}

  &:active {
    background-color: ${({ $variant }) => getActiveColor($variant)};
    box-shadow:
      inset 0 0.5px 4px rgba(0, 0, 0, 0.2),
      inset 0 -0.5px 0.5px ${({ $variant }) => getActiveColor($variant)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ $variant }) => getFocusColor($variant)};
    transition: box-shadow 0.2s ease;
  }

  ${({ $style }) =>
    $style &&
    css`
      ${$style}
    `}

  ${({ $tipMenu }) =>
    $tipMenu &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}
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
      $variant === "outline"
        ? "gray"
        : color};
    `;
  }}

  ${({ $style }) => $style}
`;

const getButtonColors = (
  variant: ButtonVariants["variant"],
  isOpen?: boolean
) => {
  const activeColor = getActiveColor(variant);

  switch (variant) {
    case "primary":
      return { bg: isOpen ? activeColor : "#569aec", color: "white" };
    case "danger":
      return { bg: isOpen ? activeColor : "#ce375d", color: "white" };
    case "outline":
      return {
        bg: isOpen ? activeColor : "white",
        color: "black",
        border: "1px solid #ccc",
      };
    case "secondary":
      return { bg: isOpen ? activeColor : "#dddddd", color: "#111" };
    case "ghost":
      return { bg: isOpen ? activeColor : "transparent", color: "#111" };
    case "link":
      return {
        bg: isOpen ? activeColor : "transparent",
        color: "#408ee8",
        underline: true,
      };
    case "transparent":
      return {
        bg: isOpen ? activeColor : "transparent",
        color: "black",
      };
    default:
      return { bg: isOpen ? activeColor : "#f3f3f3", color: "black" };
  }
};

const getHoverColor = (variant: ButtonVariants["variant"]) => {
  switch (variant) {
    case "primary":
      return "#3e7dd3";
    case "danger":
      return "#a12f4b";
    case "outline":
      return "#f0f0f0";
    case "secondary":
      return "#cccccc";
    case "ghost":
      return "#f3f3f3";
    case "link":
      return "#2a73c3";
    default:
      return "#e2e2e2";
  }
};

const getActiveColor = (variant: ButtonVariants["variant"]) => {
  switch (variant) {
    case "primary":
      return "#2a73c3";
    case "danger":
      return "#802036";
    case "outline":
      return "#e6e6e6";
    case "secondary":
      return "#b3b3b3";
    case "ghost":
      return "#eaeaea";
    case "link":
      return "#1e5ba8";
    case "transparent":
      return "#cfcfcf";
    default:
      return "#cfcfcf";
  }
};

const getFocusColor = (variant: ButtonVariants["variant"]) => {
  switch (variant) {
    case "primary":
      return "#569AEC80";
    case "danger":
      return "#CE375D80";
    case "outline":
      return "#00000040";
    case "secondary":
      return "#B4B4B480";
    case "ghost":
      return "#00000033";
    case "link":
      return "#408EE880";
    default:
      return "#00000033";
  }
};

Button.TipMenuContainer = ButtonTipMenuContainer;

export { Button };
