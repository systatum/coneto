import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiSubtractLine,
} from "@remixicon/react";
import { motion, useDragControls } from "framer-motion";
import {
  ReactNode,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ButtonStyles, ButtonVariants } from "./button";
import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { OverlayBlocker } from "./overlay-blocker";
import { useTheme } from "./../theme/provider";
import { PaperDialogThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import { Title } from "./title";

export const PaperDialogState = {
  Restored: "restored",
  Closed: "closed",
  Minimized: "minimized",
} as const;

export type PaperDialogState =
  (typeof PaperDialogState)[keyof typeof PaperDialogState];

export const PaperDialogPosition = {
  Left: "left",
  Right: "right",
} as const;

export type PaperDialogPosition =
  (typeof PaperDialogPosition)[keyof typeof PaperDialogPosition];

export interface PaperDialogProps {
  position?: PaperDialogPosition;
  children?: ReactNode;
  closable?: boolean;
  styles?: PaperDialogStyles;
  onClosed?: () => void;
  icons?: PaperDialogIcons;
  id?: string;
  className?: string;
  mobile?: boolean;
  controls?: Array<"minimize" | "close">;
  height?: string;
  width?: string;
  title?: string;
  subtitle?: string;
  resizable?: boolean | PaperDialogResizable;
  onResize?: (size: { width?: number; height?: number }) => void;
  onResizeComplete?: (size: { width?: number; height?: number }) => void;
}

export interface PaperDialogResizable {
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface PaperDialogIcons {
  closeIcon?: FigureProps;
  restoreIcon?: FigureProps;
}

export interface PaperDialogStyles {
  containerStyle?: CSSProp;
  indicatorStyle?: CSSProp;
  contentStyle?: CSSProp;
  minimizeButtonStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
  overlayStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

export interface PaperDialogTriggerProps {
  children?: ReactNode;
  setDialogState?: (dialogState: PaperDialogState) => void;
  icon?: FigureProps;
  variant?: ButtonVariants["variant"];
  styles?: ButtonStyles;
}

export interface PaperDialogContentProps {
  children?: ReactNode;
  styles?: PaperDialogContentStyles;
}

export interface PaperDialogContentStyles {
  self?: CSSProp;
}

export interface PaperDialogRef {
  openDialog: () => void;
  closeDialog: (withTimeout?: boolean) => void;
  minimizeDialog: () => void;
}

const PaperDialog = forwardRef<PaperDialogRef, PaperDialogProps>(
  (
    {
      position = "right",
      children,
      styles,
      onClosed,
      icons,
      className,
      title,
      subtitle,
      id,
      mobile,
      closable = true,
      controls = ["minimize", closable ? "close" : ""],
      width,
      height,
      resizable: _resizable = false,
      onResize,
      onResizeComplete,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const paperDialogTheme = currentTheme.paperDialog;
    const dragControls = useDragControls();

    const resizable = resolveResizable(_resizable);

    const [showTitlebar, setShowTitlebar] = useState(false);
    const [dialogState, setDialogState] = useState<PaperDialogState>("closed");

    const [resizeWidth, setResizeWidth] = useState<number | null>(null);
    const [resizeHeight, setResizeHeight] = useState<number | null>(null);

    const isResizingDesktop = useRef(false);
    const isResizingMobile = useRef(false);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);
    const resizeStartY = useRef(0);
    const resizeStartHeight = useRef(0);

    // Track last pointer Y and timestamp for velocity-based minimize on mobile resize
    const lastPointerY = useRef(0);
    const lastPointerTime = useRef(0);
    const velocityRef = useRef(0);

    const dialogRef = useRef<HTMLDivElement>(null);

    const isLeft = position === "left";

    const widthRef = useRef<number | null>(null);
    const heightRef = useRef<number | null>(null);

    const handleDesktopResizePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!resizable || mobile) return;
        e.preventDefault();
        e.stopPropagation();
        isResizingDesktop.current = true;
        resizeStartX.current = e.clientX;
        resizeStartWidth.current =
          dialogRef.current?.getBoundingClientRect().width ??
          window.innerWidth * 0.92;

        const minPx = parsePx(resizable.minWidth);
        const maxPx = parsePx(resizable.maxWidth);

        const onMove = (ev: PointerEvent) => {
          if (!isResizingDesktop.current) return;
          const delta = isLeft
            ? ev.clientX - resizeStartX.current
            : resizeStartX.current - ev.clientX;
          const next = Math.min(
            maxPx,
            Math.max(minPx, resizeStartWidth.current + delta)
          );

          // Write to ref, batch via rAF
          widthRef.current = next;
        };

        let rafId: number;
        const loop = () => {
          if (widthRef.current !== null) {
            setResizeWidth(widthRef.current);
            onResize?.({ width: widthRef.current });
            widthRef.current = null;
          }
          if (isResizingDesktop.current) rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        const onUp = () => {
          isResizingDesktop.current = false;
          cancelAnimationFrame(rafId);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);

          const finalWidth =
            dialogRef.current?.getBoundingClientRect().width ??
            resizeStartWidth.current;
          onResizeComplete?.({ width: finalWidth });
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [resizable, mobile, isLeft, onResize, onResizeComplete]
    );

    const handleMobileResizePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!resizable || !mobile) return;
        e.preventDefault();
        e.stopPropagation();
        isResizingMobile.current = true;
        resizeStartY.current = e.clientY;

        // Read from DOM once, store in ref — not state
        const initialHeight =
          dialogRef.current?.getBoundingClientRect().height ??
          resizeHeight ??
          window.innerHeight * 0.88;
        resizeStartHeight.current = initialHeight;

        lastPointerY.current = e.clientY;
        lastPointerTime.current = performance.now();

        const maxPx = parsePx(resizable.maxHeight);
        const minPx = parsePx(resizable.minHeight);

        const onMove = (ev: PointerEvent) => {
          if (!isResizingMobile.current) return;
          const delta = resizeStartY.current - ev.clientY;

          const next = Math.min(
            maxPx,
            Math.max(minPx, resizeStartHeight.current + delta)
          );

          //  Write to ref first, batch the state update via rAF
          heightRef.current = next;

          const now = performance.now();
          const dt = now - lastPointerTime.current;
          if (dt > 0) {
            velocityRef.current = (ev.clientY - lastPointerY.current) / dt;
          }
          lastPointerY.current = ev.clientY;
          lastPointerTime.current = now;
        };

        // rAF loop drives state updates — decoupled from pointermove frequency
        let rafId: number;
        const loop = () => {
          if (heightRef.current !== null) {
            setResizeHeight(heightRef.current);
            onResize?.({ height: heightRef.current });
            heightRef.current = null;
          }
          if (isResizingMobile.current) rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        const onUp = () => {
          isResizingMobile.current = false;
          cancelAnimationFrame(rafId);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);

          if (velocityRef.current > 0.5) {
            setDialogState("minimized");
            setShowTitlebar(true);
            setTimeout(() => setResizeHeight(null), 300);
          } else {
            const finalHeight =
              dialogRef.current?.getBoundingClientRect().height ??
              resizeStartHeight.current;
            onResizeComplete?.({ height: finalHeight });
          }
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      // `resizeHeight` from deps — read from DOM/ref instead
      [resizable, mobile, onResize, onResizeComplete]
    );

    const resolvedWidth = resizeWidth != null ? `${resizeWidth}px` : width;
    const resolvedHeight = resizeHeight != null ? `${resizeHeight}px` : height;

    const closeDialog = useCallback(
      async (withTimeout: boolean = true) => {
        const close = async () => await setDialogState("closed");

        await setResizeHeight(null);
        await setResizeWidth(null);

        if (mobile) {
          await setDialogState("minimized");

          if (withTimeout) {
            setTimeout(close, 400);
          } else {
            await close();
          }
        } else {
          await close();
        }

        if (onClosed) {
          await onClosed();
        }
      },
      [mobile, onClosed]
    );

    useImperativeHandle(ref, () => ({
      openDialog: async () => {
        await setDialogState("restored");
      },
      closeDialog: (withTimeout?: boolean) => closeDialog(withTimeout),
      minimizeDialog: async () => {
        await setDialogState("minimized");
      },
    }));

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (
          e.key === "Escape" &&
          closable &&
          (dialogState === "restored" || dialogState === "minimized")
        ) {
          closeDialog();
          setShowTitlebar(false);
          if (onClosed) {
            onClosed();
          }
        }
      },
      [setDialogState, dialogState]
    );

    useEffect(() => {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [handleEscape]);

    return (
      dialogState !== "closed" && (
        <DialogOverlay
          id={id}
          className={applyClassName("paper-dialog", className)}
          $dialogState={dialogState}
        >
          {dialogState === "restored" && (
            <OverlayBlocker
              onClick={async ({ preventDefault, close }) => {
                await preventDefault();
                if (closable) {
                  await setShowTitlebar(false);
                  await closeDialog();
                  await close();
                }
              }}
              styles={{ self: styles?.overlayStyle }}
              show={dialogState === "restored"}
            />
          )}

          {mobile && showTitlebar && dialogState === "minimized" && title && (
            <MiniTitleBar
              $theme={paperDialogTheme}
              onClick={() => {
                setDialogState("restored");
                setShowTitlebar(false);
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <MiniDragPill $theme={paperDialogTheme} />
              <Title
                size="sm"
                text={title ?? "Dialog"}
                styles={{
                  containerStyle: css`
                    align-items: center;
                  `,
                }}
                rightSection={[
                  {
                    styles: {
                      toggleActionStyle: css`
                        padding: 2px;
                        height: 20px;
                        width: 20px;
                        border-radius: 2px;

                        ${mobile &&
                        css`
                          user-select: none;
                          &:hover {
                            background-color: transparent;
                          }
                        `}
                      `,
                    },
                    type: "actions",
                    actions: [
                      {
                        icon: {
                          image: icons?.closeIcon?.image ?? RiCloseLine,
                          size: icons?.closeIcon?.size ?? 18,
                        },
                        onClick: () => {
                          setDialogState("closed");
                        },
                      },
                    ],
                  },
                ]}
              />
            </MiniTitleBar>
          )}

          <MotionDialog
            ref={dialogRef}
            $mobile={mobile}
            aria-label="paper-dialog-wrapper"
            $width={resolvedWidth}
            $height={resolvedHeight}
            $style={css`
              ${mobile &&
              css`
                gap: 0px;
              `}
              ${styles?.containerStyle}
            `}
            initial={mobile ? { y: "100%" } : { x: isLeft ? "-100%" : "100%" }}
            animate={
              dialogState === "minimized"
                ? mobile
                  ? { y: "100%" }
                  : { x: isLeft ? "-100%" : "100%" }
                : mobile
                  ? { y: 0 }
                  : { x: 0 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            $isLeft={isLeft}
            $theme={paperDialogTheme}
            drag={mobile ? "y" : false}
            dragListener={false}
            dragDirectionLock
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) {
                setDialogState("minimized");
                setShowTitlebar(true);
              }
            }}
            whileDrag={{ cursor: "grabbing", userSelect: "none" }}
          >
            {resizable && !mobile && (
              <DesktopResizeHandle
                $isLeft={isLeft}
                onPointerDown={handleDesktopResizePointerDown}
                aria-label="paper-dialog-resize-handle"
              />
            )}

            {closable && controls?.includes("close") && (
              <ActionButtonWrapper
                $indexAction={0}
                $mobile={mobile}
                $top={4}
                $isLeft={isLeft}
              >
                <IconButton
                  $mobile={mobile}
                  $theme={paperDialogTheme}
                  $isLeft={isLeft}
                  $style={styles?.closeButtonStyle}
                  aria-label="paper-dialog-toggle-close"
                  onClick={() => {
                    closeDialog();
                  }}
                >
                  <Figure
                    {...icons?.closeIcon}
                    aria-label="paper-dialog-close-icon"
                    image={icons?.closeIcon?.image ?? RiCloseLine}
                    size={icons?.closeIcon?.size ?? 18}
                  />
                </IconButton>
              </ActionButtonWrapper>
            )}

            {controls?.includes("minimize") && (
              <ActionButtonWrapper
                $indexAction={1}
                $mobile={mobile}
                $top={44}
                $isLeft={isLeft}
              >
                <IconButton
                  $mobile={mobile}
                  $theme={paperDialogTheme}
                  $style={styles?.minimizeButtonStyle}
                  $isLeft={isLeft}
                  aria-label="paper-dialog-toggle-restore"
                  onClick={() => {
                    setDialogState(
                      dialogState === "minimized" ? "restored" : "minimized"
                    );
                    setShowTitlebar(true);
                  }}
                >
                  <Figure
                    {...icons?.restoreIcon}
                    image={
                      icons?.restoreIcon?.image ??
                      (mobile
                        ? RiSubtractLine
                        : isLeft
                          ? RiArrowRightSLine
                          : RiArrowLeftSLine)
                    }
                    aria-label="paper-dialog-restore-icon"
                    size={icons?.restoreIcon?.size ?? 18}
                    styles={{
                      self: css`
                        display: flex;
                        transition: transform 0.5s ease-in-out;
                        transform: ${mobile
                          ? "rotate(0deg)"
                          : dialogState === "restored"
                            ? "rotate(180deg)"
                            : "rotate(0deg)"};
                      `,
                    }}
                  />
                </IconButton>
              </ActionButtonWrapper>
            )}

            {mobile && (
              <DragIndicatorWrapper
                aria-label="paper-dialog-drag-indicator"
                $resizable={!!resizable}
                onPointerDown={(e) => {
                  if (resizable) {
                    handleMobileResizePointerDown(e);
                  } else if (closable) {
                    dragControls.start(e);
                  }
                }}
              >
                <DragIndicator
                  $theme={paperDialogTheme}
                  $resizable={!!resizable}
                />
              </DragIndicatorWrapper>
            )}

            <PaperDialogContent
              $height={resolvedHeight}
              $theme={paperDialogTheme}
              aria-label="paper-dialog-content"
              $style={styles?.contentStyle}
              $mobile={mobile}
            >
              {(title || subtitle) && (
                <Title
                  styles={{
                    titleStyle: styles?.titleStyle,
                    subtitleStyle: styles?.subtitleStyle,
                  }}
                  text={title}
                  subtitle={subtitle}
                  size="lg"
                />
              )}

              {children}
            </PaperDialogContent>
          </MotionDialog>
        </DialogOverlay>
      )
    );
  }
);

/**
 * Convert a CSS size string to pixels at the current viewport.
 * Handles: px | dvw | vw | dvh | vh  — falls back to parseInt for bare numbers.
 */
function parsePx(value: string): number {
  const n = parseFloat(value);
  if (value.endsWith("dvw") || value.endsWith("vw"))
    return (n / 100) * window.innerWidth;
  if (value.endsWith("dvh") || value.endsWith("vh"))
    return (n / 100) * window.innerHeight;
  return n;
}

/** Resolve the `resizable` prop into a normalised config (or null when disabled). */
function resolveResizable(
  resizable: boolean | PaperDialogResizable | undefined
): Required<PaperDialogResizable> | null {
  if (!resizable) return null;
  const defaults: Required<PaperDialogResizable> = {
    minWidth: "20dvw",
    maxWidth: "90dvw",
    minHeight: "20dvh",
    maxHeight: "90dvh",
  };
  if (resizable === true) return defaults;
  return { ...defaults, ...resizable };
}

const DialogOverlay = styled.div<{
  $dialogState: PaperDialogState;
  $style?: CSSProp;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  position: fixed;
  z-index: 9991999;
  ${({ $dialogState }) =>
    $dialogState === "restored" &&
    css`
      inset: 0;
    `}

  ${({ $style }) => $style}
`;

const MotionDialog = styled(motion.div)<{
  $isLeft: boolean;
  $style?: CSSProp;
  $theme?: PaperDialogThemeConfig;
  $mobile?: boolean;
  $width?: string;
  $height?: string;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  position: fixed;

  ${({ $mobile, $isLeft }) =>
    $mobile
      ? css`
          left: 0;
          right: 0;
          margin-inline: auto;
          bottom: 0;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          user-select: none;
        `
      : $isLeft
        ? css`
            top: 0;
            left: 0;
          `
        : css`
            top: 0;
            right: 0;
          `}

  ${({ $width, $mobile, $height }) =>
    $mobile
      ? css`
          max-height: ${$height ?? "88dvh"};
          min-height: ${$height ?? "88dvh"};
          min-width: ${$width ?? "100dvw"};
          max-width: ${$width ?? "100dvw"};
        `
      : css`
          max-height: ${$height ?? "100dvh"};
          min-height: ${$height ?? "100dvh"};
          min-width: ${$width ?? "92dvw"};
          max-width: ${$width ?? "92dvw"};
        `}

  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9991999;

  background-color: ${({ $theme }) => $theme?.backgroundColor};
  color: ${({ $theme }) => $theme?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $style }) => $style};
`;

const DesktopResizeHandle = styled.div<{ $isLeft: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  z-index: 10000;
  cursor: col-resize;
  transition: background-color 0.15s ease;

  ${({ $isLeft }) =>
    $isLeft
      ? css`
          right: 0;
          border-right: 2px solid transparent;
        `
      : css`
          left: 0;
          border-left: 2px solid transparent;
        `}

  &:hover,
  &:active {
    background-color: rgba(128, 128, 128, 0.18);
  }
`;

const ActionButtonWrapper = styled.div<{
  $isLeft: boolean;
  $top: number;
  $style?: CSSProp;
  $mobile?: boolean;
  $indexAction?: number;
}>`
  position: absolute;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: fit-content;

  ${({ $isLeft, $mobile, $top, $indexAction }) =>
    $mobile
      ? css`
          top: -30.5px;
          user-select: none;

          ${$isLeft
            ? css`
                left: ${`${$indexAction * 42 + 30}px`};
              `
            : css`
                right: ${`${$indexAction * 42 + 30}px`};
              `}
        `
      : css`
          top: ${`${$top}px`};

          ${$isLeft
            ? css`
                left: 100%;
                translate: -4px;
              `
            : css`
                right: 100%;
                translate: 4px;
              `}
        `}
`;

const IconButton = styled.button<{
  $isLeft: boolean;
  $theme?: PaperDialogThemeConfig;
  $style?: CSSProp;
  $mobile?: boolean;
}>`
  position: relative;
  cursor: pointer;
  padding: 8px;
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  ${({ $mobile, $theme }) =>
    !$mobile &&
    css`
      &:hover {
        background-color: ${$theme?.actionHoverBackgroundColor};
      }
    `}

  ${({ $isLeft, $mobile, $theme }) =>
    $mobile
      ? css`
          border: 1px solid ${$theme?.borderColor};
          border-top-width: 1px;
          border-right-width: 1px;
          border-left-width: 1px;
          border-bottom-width: 0px;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 6px;
        `
      : css`
          border: 1px solid ${$theme?.borderColor};
          box-shadow: ${$theme?.boxShadow};

          ${$isLeft
            ? css`
                border-right-width: 1px;
                border-top-width: 1px;
                border-bottom-width: 1px;
                border-radius: 0 0.75rem 0.75rem 0;
              `
            : css`
                border-left-width: 1px;
                border-top-width: 1px;
                border-bottom-width: 1px;
                border-radius: 0.75rem 0 0 0.75rem;
              `}
        `};

  ${({ $style }) => $style}
`;

const PaperDialogContent = styled.div<{
  $style?: CSSProp;
  $theme?: PaperDialogThemeConfig;
  $height?: string;
  $mobile?: boolean;
}>`
  height: ${({ $height }) => $height ?? "100dvh"};
  max-height: ${({ $height }) => $height ?? "100dvh"};
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 9999;
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  color: ${({ $theme }) => $theme?.textColor};
  ${({ $mobile }) =>
    $mobile &&
    css`
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0px 20px 20px 20px;
      border-radius: 1rem 1rem 0 0;
      margin-top: 4px;
    `}

  ${({ $style }) => $style}
`;

const DragIndicatorWrapper = styled(motion.div)<{
  $theme?: PaperDialogThemeConfig;
  $style?: CSSProp;
  $resizable?: boolean;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  position: sticky;

  display: flex;
  top: 0;
  justify-content: center;

  cursor: ${({ $resizable }) => ($resizable ? "ns-resize" : "grab")};
  width: 100dvw;
  height: 60px;
  z-index: 9992999;
  align-items: center;
  border-radius: 1.2rem 1.2rem 0 0;
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  &:active {
    cursor: ${({ $resizable }) => ($resizable ? "ns-resize" : "grabbing")};
  }

  ${({ $style }) => $style}
`;

const DragIndicator = styled(motion.div)<{
  $theme?: PaperDialogThemeConfig;
  $resizable?: boolean;
}>`
  display: flex;
  width: 48px;
  height: 5px;
  border-radius: 999px;
  background-color: ${({ $theme }) => $theme?.textColor};
  opacity: ${({ $resizable }) => ($resizable ? 0.5 : 0.3)};
  transition:
    opacity 0.2s ease,
    width 0.2s ease;
`;

const MiniTitleBar = styled(motion.div)<{
  $theme?: PaperDialogThemeConfig;
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9994999;
  align-items: center;
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  border-top: 1px solid ${({ $theme }) => $theme?.borderColor};
  border-radius: 12px 12px 0 0;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  user-select: none;
`;

const MiniDragPill = styled.div<{ $theme?: PaperDialogThemeConfig }>`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background-color: ${({ $theme }) => $theme?.textColor};
  opacity: 0.3;
`;

export { PaperDialog };
