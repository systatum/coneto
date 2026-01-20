import { getFloatingPlacement } from "./../lib/floating-placement";
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  useFloating,
} from "@floating-ui/react";
import React, {
  forwardRef,
  Fragment,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled, { css, CSSProp } from "styled-components";

export type TooltipProps = {
  dialog: ReactNode;
  children: ReactNode;
  showDialogOn?: "hover" | "click";
  hideDialogOn?: "hover" | "click";
  dialogPlacement?: DialogPlacement;
  onVisibilityChange?: (open?: boolean) => void;
  safeAreaAriaLabels?: string[];
  showDelayPeriod?: number;
  styles?: TooltipStyles;
};

export interface TooltipStyles {
  containerStyle?: CSSProp;
  triggerStyle?: CSSProp;
  spacerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  drawerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  arrowStyle?: CSSProp | ((placement?: Placement) => CSSProp);
}

export type TooltipRef = {
  open: () => void;
  close: () => void;
};

type DialogPlacement =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

const TooltipBase = forwardRef<TooltipRef, TooltipProps>(
  (
    {
      dialog,
      children,
      showDialogOn = "hover",
      hideDialogOn = "hover",
      dialogPlacement = "bottom-left",
      onVisibilityChange,
      safeAreaAriaLabels,
      showDelayPeriod = 0,
      styles,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        if (onVisibilityChange) {
          onVisibilityChange(true);
        }
      },
      close: () => {
        setIsOpen(false);
        if (onVisibilityChange) {
          onVisibilityChange(false);
        }
      },
    }));

    const { floatingStyles, refs, placement } = useFloating({
      placement: getFloatingPlacement(dialogPlacement),
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(8), flip()],
      whileElementsMounted: autoUpdate,
    });

    const safeAreaAriaLabelsLocal: string[] = [
      "combobox-drawer-month",
      "combobox-drawer-year",
      ...(safeAreaAriaLabels || []),
    ];

    useEffect(() => {
      if (hideDialogOn !== "click" || !isOpen) return;

      function handleClickOutside(event: MouseEvent) {
        const floatingEl = refs.floating.current;
        const referenceEl = refs.reference.current;

        if (
          Array.isArray(safeAreaAriaLabelsLocal) &&
          safeAreaAriaLabelsLocal.some((label) =>
            floatingEl.closest(`[aria-label="${label}"]`)
          )
        ) {
          return;
        }

        if (
          floatingEl instanceof HTMLElement &&
          !floatingEl.contains(event.target as Node) &&
          referenceEl instanceof HTMLElement &&
          !referenceEl.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onVisibilityChange(false);
        }
      }

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isOpen, hideDialogOn, refs.floating, refs.reference]);

    return (
      <Wrapper
        $style={styles?.containerStyle}
        onMouseEnter={() => {
          if (showDialogOn === "hover") {
            delayTimeoutRef.current = setTimeout(() => {
              setIsOpen(true);
              if (onVisibilityChange) {
                onVisibilityChange(true);
              }
            }, showDelayPeriod);
          }
        }}
        onMouseLeave={() => {
          if (hideDialogOn === "hover") {
            clearTimeout(delayTimeoutRef.current);

            setIsOpen(false);
            if (onVisibilityChange) {
              onVisibilityChange(false);
            }
          }
        }}
        ref={refs.setReference}
      >
        <ContentTrigger
          aria-label="tooltip-trigger"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (showDialogOn === "click") {
              setIsOpen((prev) => {
                const next = !prev;
                if (onVisibilityChange) {
                  onVisibilityChange(next);
                }
                return next;
              });
            }
          }}
          $showDialogOn={showDialogOn}
          $style={styles?.triggerStyle}
        >
          {children}
        </ContentTrigger>
        {isOpen &&
          dialog &&
          createPortal(
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 12000 }}
            >
              <TooltipContainer
                placement={placement}
                styles={{
                  arrowStyle:
                    typeof styles?.arrowStyle === "function"
                      ? styles?.arrowStyle(placement as Placement)
                      : styles?.arrowStyle,
                  drawerStyle:
                    typeof styles?.drawerStyle === "function"
                      ? styles?.drawerStyle(placement as Placement)
                      : styles?.drawerStyle,
                  spacerStyle:
                    typeof styles?.spacerStyle === "function"
                      ? styles?.spacerStyle(placement as Placement)
                      : styles?.spacerStyle,
                }}
                dialog={dialog}
              />
            </div>,
            document.body
          )}
      </Wrapper>
    );
  }
);

interface TooltipContainerProps {
  placement?: Placement;
  styles?: TooltipContainerStylesProps;
  dialog?: ReactNode;
}
interface TooltipContainerStylesProps {
  drawerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  arrowStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  spacerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
}

function TooltipContainer({
  placement,
  styles,
  dialog,
}: TooltipContainerProps) {
  return (
    <Fragment>
      <Spacer
        aria-label="tooltip-spacer"
        $placement={placement}
        $spacerStyle={
          typeof styles?.spacerStyle === "function"
            ? styles?.spacerStyle(placement as Placement)
            : styles?.spacerStyle
        }
      />
      <TooltipArrow
        $placement={placement}
        aria-label="tooltip-arrow"
        $arrowStyle={
          typeof styles?.arrowStyle === "function"
            ? styles?.arrowStyle(placement as Placement)
            : styles?.arrowStyle
        }
      />
      <TooltipDrawer
        aria-label="tooltip-drawer"
        $drawerStyle={
          typeof styles?.drawerStyle === "function"
            ? styles?.drawerStyle(placement as Placement)
            : styles?.drawerStyle
        }
      >
        {dialog}
      </TooltipDrawer>
    </Fragment>
  );
}

const Wrapper = styled.div<{ $style?: CSSProp }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: fit-content;
  width: 100%;

  ${({ $style }) => $style}
`;

const Spacer = styled.div<{ $placement?: Placement; $spacerStyle?: CSSProp }>`
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 30px;
  left: 0;

  ${({ $placement }) =>
    $placement?.startsWith("top")
      ? css`
          bottom: -18px;
        `
      : css`
          top: -8px;
        `}

  ${({ $spacerStyle }) => $spacerStyle}
`;

const ContentTrigger = styled.div<{
  $showDialogOn: TooltipProps["showDialogOn"];
  $style?: CSSProp;
}>`
  width: 100%;
  ${({ $showDialogOn }) =>
    $showDialogOn === "hover"
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $style }) => $style}
`;

const TooltipArrow = styled.div<{
  $arrowStyle?: CSSProp;
  $placement?: Placement;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #4b5563;
  transform: rotate(45deg);
  z-index: -1;
  pointer-events: none;

  ${({ $placement }) =>
    $placement === "bottom-start"
      ? css`
          top: -4px;
          left: 10%;
        `
      : $placement === "bottom-end"
        ? css`
            top: -4px;
            right: 10%;
          `
        : $placement === "top-start"
          ? css`
              bottom: -4px;
              left: 10%;
            `
          : $placement === "top-end"
            ? css`
                bottom: -4px;
                right: 10%;
              `
            : null}

  ${({ $arrowStyle }) => $arrowStyle}
`;

const TooltipDrawer = styled.div<{
  $drawerStyle?: CSSProp;
}>`
  position: relative;
  background-color: #4b5563;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  ${({ $drawerStyle }) => $drawerStyle}
`;

type TooltipComponent = React.ForwardRefExoticComponent<
  TooltipProps & React.RefAttributes<TooltipRef>
> & {
  Container: typeof TooltipContainer;
};

const Tooltip = TooltipBase as TooltipComponent;
Tooltip.Container = TooltipContainer;

export { Tooltip };
