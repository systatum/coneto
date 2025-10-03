import {
  arrow,
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useFloating,
} from "@floating-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";

export type TooltipProps = {
  dialog: ReactNode;
  children: ReactNode;
  showDialogOn?: "hover" | "click";
  hideDialogOn?: "hover" | "click";
  drawerStyle?: CSSProp;
  containerStyle?: CSSProp;
  arrowStyle?: CSSProp;
};

export function Tooltip({
  dialog,
  children,
  showDialogOn = "hover",
  hideDialogOn = "hover",
  drawerStyle,
  containerStyle,
  arrowStyle,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { floatingStyles, refs, placement } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(({ placement }) => {
        return placement === "top-start" ? 8 : 0;
      }),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (hideDialogOn !== "click" || !isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const floatingEl = refs.floating.current;
      const referenceEl = refs.reference.current;

      if (
        floatingEl instanceof HTMLElement &&
        !floatingEl.contains(event.target as Node) &&
        referenceEl instanceof HTMLElement &&
        !referenceEl.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, hideDialogOn, refs.floating, refs.reference]);

  return (
    <Wrapper
      onMouseEnter={() => {
        if (showDialogOn === "hover") setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (hideDialogOn === "hover") setIsOpen(false);
      }}
      ref={refs.setReference}
    >
      <ContentTrigger
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (showDialogOn === "click") {
            setIsOpen((prev) => !prev);
          }
        }}
        $showDialogOn={showDialogOn}
        $containerStyle={containerStyle}
      >
        {children}
      </ContentTrigger>
      {isOpen && (
        <>
          <Spacer $placement={placement} />
          <TooltipArrow
            ref={arrowRef}
            $placement={placement}
            aria-label="tooltip-arrow"
            $arrowStyle={arrowStyle}
          />
          <TooltipDrawer
            style={floatingStyles}
            $drawerStyle={drawerStyle}
            ref={refs.setFloating}
          >
            {dialog}
          </TooltipDrawer>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: fit-content;
  width: fit-content;
`;

const Spacer = styled.div<{ $placement?: Placement }>`
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 10px;

  ${({ $placement }) =>
    $placement.startsWith("top")
      ? css`
          bottom: 100%;
        `
      : css`
          top: 100%;
        `}
`;

const ContentTrigger = styled.div<{
  $showDialogOn: TooltipProps["showDialogOn"];
  $containerStyle?: CSSProp;
}>`
  ${({ $showDialogOn }) =>
    $showDialogOn === "hover"
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $containerStyle }) => $containerStyle}
`;

const TooltipArrow = styled.div<{
  $arrowStyle?: CSSProp;
  $placement?: Placement;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #4b5563;
  transform: translateX(-25%) rotate(45deg);
  z-index: 10;
  ${({ $placement }) =>
    $placement === "bottom-start"
      ? css`
          top: 100%;
          left: 25%;
          margin-top: 4px;
        `
      : $placement === "bottom-end"
        ? css`
            top: 100%;
            right: 25%;
            margin-top: 4px;
          `
        : $placement === "top-start"
          ? css`
              bottom: 100%;
              left: 25%;
              margin-bottom: 4px;
            `
          : $placement === "top-end"
            ? css`
                bottom: 100%;
                right: 25%;
                margin-bottom: 4px;
              `
            : null}

  ${({ $arrowStyle }) => $arrowStyle}
`;

const TooltipDrawer = styled.div<{
  $drawerStyle?: CSSProp;
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
  ${({ $drawerStyle }) => $drawerStyle}
`;
