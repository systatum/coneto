import {
  DialogPlacement,
  getFloatingPlacement,
} from "./../lib/floating-placement";
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
import { useTheme } from "./../theme/provider";
import { TooltipThemeConfig } from "./../theme";

export const TooltipDialogPosition = {
  Hover: "hover",
  Click: "click",
} as const;

export type TooltipDialogPosition =
  (typeof TooltipDialogPosition)[keyof typeof TooltipDialogPosition];

export type TooltipProps = {
  dialog: ReactNode;
  children: ReactNode;
  showDialogOn?: TooltipDialogPosition;
  hideDialogOn?: TooltipDialogPosition;
  dialogPlacement?: DialogPlacement;
  onVisibilityChange?: (open?: boolean) => void;
  safeAreaAriaLabels?: string[];
  showDelayPeriod?: number;
  styles?: TooltipStyles;
  onClick?: (e: React.MouseEvent) => void;
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
      onClick,
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
            if (onClick) {
              onClick(e);
            }
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
              style={{ ...floatingStyles, zIndex: 9992999 }}
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

export interface TooltipContainerProps {
  placement?: Placement;
  styles?: TooltipContainerStyles;
  dialog?: ReactNode;
}

export interface TooltipContainerStyles {
  drawerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  arrowStyle?: CSSProp | ((placement?: Placement) => CSSProp);
  spacerStyle?: CSSProp | ((placement?: Placement) => CSSProp);
}

function TooltipContainer({
  placement,
  styles,
  dialog,
}: TooltipContainerProps) {
  const { currentTheme } = useTheme();
  const tooltipTheme = currentTheme?.tooltip;

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
        $theme={tooltipTheme}
        $placement={placement}
        aria-label="tooltip-arrow"
        $arrowStyle={
          typeof styles?.arrowStyle === "function"
            ? styles?.arrowStyle(placement as Placement)
            : styles?.arrowStyle
        }
      />
      <TooltipDrawer
        $theme={tooltipTheme}
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
  width: fit-content;

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
  width: fit-content;
  height: fit-content;

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
  $theme: TooltipThemeConfig;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${({ $theme }) => $theme?.arrowBackgroundColor};
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
        : $placement === "bottom"
          ? css`
              top: -4px;
              left: 50%;
              transform: translateX(-50%) rotate(45deg);
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
              : $placement === "top"
                ? css`
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                  `
                : $placement === "left-start"
                  ? css`
                      right: -2px;
                      top: 10%;
                    `
                  : $placement === "left-end"
                    ? css`
                        right: -2px;
                        bottom: 10%;
                      `
                    : $placement === "left"
                      ? css`
                          right: -2px;
                          top: 50%;
                          transform: translateY(-50%) rotate(45deg);
                        `
                      : $placement === "right-start"
                        ? css`
                            left: -2px;
                            top: 10%;
                          `
                        : $placement === "right-end"
                          ? css`
                              left: -2px;
                              bottom: 10%;
                            `
                          : $placement === "right"
                            ? css`
                                left: -2px;
                                top: 50%;
                                transform: translateY(-50%) rotate(45deg);
                              `
                            : null}

  ${({ $arrowStyle }) => $arrowStyle}
`;

const TooltipDrawer = styled.div<{
  $drawerStyle?: CSSProp;
  $theme: TooltipThemeConfig;
}>`
  position: relative;
  background-color: ${({ $theme }) => $theme.backgroundColor};
  color: ${({ $theme }) => $theme.textColor};
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: ${({ $theme }) =>
    $theme.boxShadow || "0 1px 2px rgba(0,0,0,0.1)"};

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
