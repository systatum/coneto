import { ReactNode, useEffect, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";

export type TooltipProps = {
  children: ReactNode;
  text: ReactNode;
  openOn?: "hover" | "click";
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  arrowStyle?: CSSProp;
  underline?: "underline" | "underline-dot" | "transparent" | "blue" | "gray";
};

export function Tooltip({
  children,
  text,
  openOn = "hover",
  drawerStyle,
  containerStyle,
  arrowStyle,
  underline = "underline",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const triggerProps =
    openOn === "hover"
      ? {
          onMouseEnter: () => setIsOpen(true),
          onMouseLeave: () => setIsOpen(false),
        }
      : {
          onClick: () => setIsOpen((prev) => !prev),
        };

  useEffect(() => {
    if (openOn !== "click" || !isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, openOn]);

  return (
    <Wrapper ref={tooltipRef}>
      <TextTrigger
        {...triggerProps}
        $underline={underline}
        $open_on={openOn}
        $container_Style={containerStyle}
      >
        {text}
      </TextTrigger>
      {isOpen && (
        <>
          <TooltipArrow aria-label="tooltip-arrow" $arrow_Style={arrowStyle} />
          <TooltipDrawer $drawer_Style={drawerStyle}>{children}</TooltipDrawer>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const TextTrigger = styled.div<{
  $underline: TooltipProps["underline"];
  $open_on: TooltipProps["openOn"];
  $container_Style?: CSSProp;
}>`
  ${({ $open_on }) =>
    $open_on === "hover"
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $underline }) => {
    switch ($underline) {
      case "underline":
        return css`
          text-decoration: underline;
          text-decoration-color: black;
        `;
      case "underline-dot":
        return css`
          text-decoration: underline dotted;
          text-decoration-color: black;
        `;
      case "transparent":
        return css`
          text-decoration: none;
        `;
      case "blue":
        return css`
          text-decoration: underline;
          text-decoration-color: #3b82f6;
        `;
      case "gray":
        return css`
          text-decoration: underline;
          text-decoration-color: #6b7280;
        `;
      default:
        return null;
    }
  }}

  ${({ $container_Style }) => $container_Style}
`;

const TooltipArrow = styled.div<{
  $arrow_Style?: CSSProp;
}>`
  position: absolute;
  top: 100%;
  left: 25%;
  margin-top: 4px;
  width: 8px;
  height: 8px;
  background-color: #4b5563;
  transform: translateX(-25%) rotate(45deg);
  z-index: 10;
  ${({ $arrow_Style }) => $arrow_Style}
`;

const TooltipDrawer = styled.div<{
  $drawer_Style?: CSSProp;
}>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background-color: #4b5563;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 50;
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  ${({ $drawer_Style }) => $drawer_Style}
`;
