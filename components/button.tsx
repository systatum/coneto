import * as React from "react";
import { LoadingSpinner } from "./loading-spinner";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "@remixicon/react";
import { TipMenu, TipMenuItemProps } from "./tip-menu";
import styled, { css, CSSProp } from "styled-components";

export type ButtonVariants = {
  variant?:
    | "link"
    | "outline"
    | "default"
    | "primary"
    | "danger"
    | "secondary"
    | "ghost";
  size?: "default" | "icon" | "sm" | "lg";
};

function Button({
  variant = "default",
  size = "default",
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
        setIsOpen(false);
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
    <ButtonWrapper ref={containerRef} $style={containerStyle}>
      <BaseButton
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
          <div
            aria-label="divider"
            style={{
              height:
                hovered === "main" || hovered === "dropdown" ? "100%" : "80%",
              borderRight: "1px solid black",
              borderColor: "gray",
              position: "absolute",
              transition: "height 100ms ease-in-out",
              right: "40px",
            }}
          />

          <BaseButtonToggle
            onClick={() => {
              setIsOpen(true);
            }}
            $variant={variant}
            $size={size}
            $tipMenu={tipMenu}
            $disabled={disabled}
            onMouseEnter={() => setHovered("dropdown")}
            onMouseLeave={() => setHovered("original")}
            $style={toggleStyle}
          >
            {isOpen ? (
              <OpenedIcon size={20} style={{ color: "#aaa" }} />
            ) : (
              <ClosedIcon size={20} style={{ color: "#aaa" }} />
            )}
          </BaseButtonToggle>
        </div>
      )}

      {isOpen && (
        <div
          onMouseEnter={() => setHovered("dropdown")}
          onMouseLeave={() => {
            setHovered("original");
            setIsOpen(false);
          }}
          style={{
            position: "absolute",
            top: "100%",
            transform: "translateY(-4px)",
            zIndex: 10,
            left: positionClass === "left" ? 0 : undefined,
            right: positionClass === "right" ? 0 : undefined,
          }}
        >
          <TipMenu
            setIsOpen={() => {
              setIsOpen(false);
              setHovered("original");
            }}
            style={dropdownStyle}
            subMenuList={subMenuList}
          />
        </div>
      )}
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  position: relative;
  align-items: center;

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

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return css`
          background-color: #569aec;
          color: white;

          &:hover {
            background-color: #3e7dd3;
          }
        `;
      case "danger":
        return css`
          background-color: #ce375d;
          color: white;

          &:hover {
            background-color: #a02a48;
          }
        `;
      case "outline":
        return css`
          background-color: white;
          color: black;
          border: 1px solid #ccc;

          &:hover {
            background-color: #f0f0f0;
          }
        `;
      case "secondary":
        return css`
          background-color: #dddddd;
          color: #111;

          &:hover {
            background-color: #cccccc;
          }
        `;
      case "ghost":
        return css`
          background-color: transparent;
          color: #111;

          &:hover {
            background-color: #f3f3f3;
          }
        `;
      case "link":
        return css`
          background-color: transparent;
          color: #408ee8;
          text-decoration: underline;

          &:hover {
            color: #2a73c3;
          }
        `;
      default:
        return css`
          background-color: #f3f3f3;
          color: black;

          &:hover {
            background-color: #e2e2e2;
          }
        `;
    }
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
}>`
  min-width: 40px;
  max-width: 40px;
  padding: 0;
  border-top-left-radius: ${({ $tipMenu }) => ($tipMenu ? 0 : "2px")};
  border-bottom-left-radius: ${({ $tipMenu }) => ($tipMenu ? 0 : "2px")};
  ${({ $style }) => $style}
`;

export { Button };
