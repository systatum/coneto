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
    | "ghost";
  size?: "icon" | "xs" | "md" | "sm" | "lg";
};

function Button({
  variant = "default",
  size = "md",
  isLoading,
  tipMenu,
  subMenuList,
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
  tipMenuVariant,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariants & {
    isLoading?: boolean;
    tipMenu?: boolean;
    subMenuList?: TipMenuItemProps[];
    dropdownStyle?: CSSProp;
    openedIcon?: RemixiconComponentType;
    closedIcon?: RemixiconComponentType;
    buttonStyle?: CSSProp;
    toggleStyle?: CSSProp;
    containerStyle?: CSSProp;
    dividerStyle?: CSSProp;
    tipMenuVariant?: TipMenuItemVariantType;
  }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<
    "main" | "original" | "dropdown"
  >("original");
  const [positionClass, setPositionClass] = React.useState<"left" | "right">(
    "left"
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setTimeout(() => {
          setIsOpen(false);
          setHovered("original");
        }, 100);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          if (onClick) {
            onClick(event);
          }
          if (tipMenu) {
            setIsOpen(false);
          }
        }}
        {...props}
        $variant={variant}
        $size={size}
        disabled={disabled}
        $disabled={disabled}
        $tipMenu={tipMenu}
        onMouseEnter={() => setHovered("dropdown")}
        onMouseLeave={() => setHovered("original")}
        $style={buttonStyle}
      >
        {children}
        {isLoading && <LoadingSpinner />}
      </BaseButton>

      {tipMenu && (
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
            $tipMenu={tipMenu}
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
            style={{
              position: "absolute",
              top: containerRef.current?.getBoundingClientRect().bottom ?? 0,
              left:
                positionClass === "left"
                  ? containerRef.current?.getBoundingClientRect().left
                  : undefined,
              right:
                positionClass === "right"
                  ? window.innerWidth -
                    (containerRef.current?.getBoundingClientRect().right ?? 0)
                  : undefined,
              zIndex: 9999,
            }}
            onMouseEnter={() => setHovered("dropdown")}
          >
            <TipMenu
              setIsOpen={() => {
                setIsOpen(false);
                setHovered("original");
              }}
              style={dropdownStyle}
              subMenuList={subMenuList}
              variant={tipMenuVariant}
            />
          </div>,
          document.body
        )}
    </ButtonWrapper>
  );
}

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
    return (
      $variant === "outline" &&
      css`
        border: ${border};
        border-radius: 2px;
      `
    );
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
  switch (variant) {
    case "primary":
      return { bg: isOpen ? "#3e7dd3" : "#569aec", color: "white" };
    case "danger":
      return { bg: isOpen ? "#a02a48" : "#ce375d", color: "white" };
    case "outline":
      return {
        bg: isOpen ? "#f0f0f0" : "white",
        color: "black",
        border: "1px solid #ccc",
      };
    case "secondary":
      return { bg: isOpen ? "#cccccc" : "#dddddd", color: "#111" };
    case "ghost":
      return { bg: isOpen ? "#f3f3f3" : "transparent", color: "#111" };
    case "link":
      return {
        bg: isOpen ? "#e6f0ff" : "transparent",
        color: "#408ee8",
        underline: true,
      };
    default:
      return { bg: isOpen ? "#e2e2e2" : "#f3f3f3", color: "black" };
  }
};

const getHoverColor = (variant: string) => {
  switch (variant) {
    case "primary":
      return "#3e7dd3";
    case "danger":
      return "#a02a48";
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

export { Button };
