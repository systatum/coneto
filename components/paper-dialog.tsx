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

export const PaperDialogTrigger = {
  API: "api",
  Overlay: "overlay",
  Escape: "escape",
  Drag: "drag",
  Resize: "resize",
  Control: "control",
} as const;

export type PaperDialogTrigger =
  (typeof PaperDialogTrigger)[keyof typeof PaperDialogTrigger];

export const PaperDialogPosition = {
  Left: "left",
  Right: "right",
} as const;

export type PaperDialogPosition =
  (typeof PaperDialogPosition)[keyof typeof PaperDialogPosition];

export interface PaperDialogProps {
  position?: PaperDialogPosition;
  children?: ReactNode;
  closable?: boolean | PaperDialogClosable;
  styles?: PaperDialogStyles;
  onChange?: (state: PaperDialogState, trigger?: PaperDialogTrigger) => void;
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
  initialDialogState?: PaperDialogState;
  skipInitialAnimation?: boolean;
}

export interface PaperDialogClosable {
  withOverlay?: boolean;
  withEscape?: boolean;
  withButton?: boolean;
  withIndicator?: boolean;
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
  closeDialog: (props?: PaperDialogCloseOption) => void;
  minimizeDialog: () => void;
}
export interface PaperDialogCloseOption {
  withMinimize?: boolean;
  withTimeout?: boolean;
}

const PaperDialog = forwardRef<PaperDialogRef, PaperDialogProps>(
  (
    {
      position = "right",
      children,
      styles,
      onChange,
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
      initialDialogState = "closed",
      skipInitialAnimation,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const paperDialogTheme = currentTheme.paperDialog;

    // `closable` supports:
    // - `false`: disable all closing behaviors.
    // - `true` or `undefined`: enable all closing behaviors.
    // - `{ withEscape, withOverlay, withButton }`: configure each behavior individually.
    // withTimeout meaning can close without animation, if true, it would
    // use animation inside of close behavior
    const {
      withEscape = true,
      withOverlay = true,
      withButton = true,
      withIndicator = true,
    } = typeof closable === "object" ? closable : {};

    const canCloseWithEscape =
      closable !== false && (typeof closable !== "object" || withEscape);
    const canCloseWithOverlay =
      closable !== false && (typeof closable !== "object" || withOverlay);
    const canCloseWithButton =
      closable !== false && (typeof closable !== "object" || withButton);
    const canCloseWithIndicator =
      closable !== false && (typeof closable !== "object" || withIndicator);

    const contentRef = useRef<HTMLDivElement>(null);

    const dragControls = useDragControls();

    const resizable = resolveResizable(_resizable);

    const [showTitlebar, setShowTitlebar] = useState(false);
    const [dialogState, setDialogState] =
      useState<PaperDialogState>(initialDialogState);

    const [resizeWidth, setResizeWidth] = useState<number | null>(null);
    const [resizeHeight, setResizeHeight] = useState<number | null>(null);

    const isResizingDesktop = useRef(false);
    const isResizingMobile = useRef(false);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);
    const resizeStartY = useRef(0);
    const resizeStartHeight = useRef(0);

    // Track last pointer Y and timestamp for velocity-based snap on mobile resize
    const velocityRef = useRef(0);

    const dialogRef = useRef<HTMLDivElement>(null);

    const isLeft = position === "left";

    const handleDesktopResizePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!resizable || mobile) return;
        e.preventDefault();
        e.stopPropagation();

        isResizingDesktop.current = true;
        resizeStartX.current = e.clientX;
        // Read width once at drag start — never read DOM again during move
        resizeStartWidth.current =
          dialogRef.current?.getBoundingClientRect().width ??
          window.innerWidth * 0.92;

        const minPx = parsePx(resizable.minWidth);
        const maxPx = parsePx(resizable.maxWidth);

        let pendingX = e.clientX;
        let rafId: number | null = null;

        const onMove = (ev: PointerEvent) => {
          if (!isResizingDesktop.current) return;

          // Store latest pointer position — no DOM work here
          pendingX = ev.clientX;

          // Multiple pointermove events between frames collapse into one write
          if (rafId !== null) return;

          rafId = requestAnimationFrame(() => {
            rafId = null;
            if (!isResizingDesktop.current || !dialogRef.current) return;

            const delta = isLeft
              ? pendingX - resizeStartX.current
              : resizeStartX.current - pendingX;

            const next = Math.min(
              maxPx,
              Math.max(minPx, resizeStartWidth.current + delta)
            );

            // Write directly to DOM — bypasses React, styled-components, and
            // Framer Motion entirely. Zero re-renders during the drag.
            dialogRef.current.style.minWidth = `${next}px`;
            dialogRef.current.style.maxWidth = `${next}px`;
            onResize?.({ width: next });
          });
        };

        const onUp = () => {
          isResizingDesktop.current = false;

          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }

          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);

          // Read final width from DOM once, then hand back to React
          const finalWidth =
            dialogRef.current?.getBoundingClientRect().width ??
            resizeStartWidth.current;

          // Clear inline styles first so styled-components doesn't conflict
          if (dialogRef.current) {
            dialogRef.current.style.minWidth = "";
            dialogRef.current.style.maxWidth = "";
          }

          setResizeWidth(finalWidth);
          onResizeComplete?.({ width: finalWidth });
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [resizable, mobile, onResize, onResizeComplete, isLeft]
    );

    const handleMobileResizePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!resizable || !mobile) return;
        e.preventDefault();
        e.stopPropagation();

        isResizingMobile.current = true;
        resizeStartY.current = e.clientY;
        // Read height once at drag start — never read it again during move
        resizeStartHeight.current =
          dialogRef.current?.getBoundingClientRect().height ??
          window.innerHeight * 0.88;

        const maxPx = parsePx(resizable.maxHeight);
        const minPx = parsePx(resizable.minHeight);

        let pendingY = e.clientY;
        let rafId: number | null = null;

        // Velocity tracking runs on every event — not inside rAF
        // so fast flicks are not missed between frames
        let lastVelocityY = e.clientY;
        let lastVelocityTime = performance.now();
        velocityRef.current = 0;

        const onMove = (ev: PointerEvent) => {
          if (!isResizingMobile.current) return;

          // Track velocity on every event for accuracy
          const now = performance.now();
          const dy = ev.clientY - lastVelocityY;
          const dt = now - lastVelocityTime;
          if (dt > 0) velocityRef.current = dy / dt;
          lastVelocityY = ev.clientY;
          lastVelocityTime = now;

          // Store latest Y — actual DOM work happens in rAF
          pendingY = ev.clientY;

          // Multiple pointermove events between frames collapse into one write
          if (rafId !== null) return;

          rafId = requestAnimationFrame(() => {
            rafId = null;
            if (!isResizingMobile.current || !dialogRef.current) return;

            const delta = resizeStartY.current - pendingY;
            const next = Math.min(
              maxPx,
              Math.max(minPx, resizeStartHeight.current + delta)
            );

            // Target both the dialog wrapper and the content element

            dialogRef.current.style.minHeight = `${next}px`;
            dialogRef.current.style.maxHeight = `${next}px`;

            contentRef.current.style.height = `${next}px`;
            contentRef.current.style.maxHeight = `${next}px`;

            onResize?.({ height: next });
          });
        };

        const onUp = () => {
          isResizingMobile.current = false;

          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }

          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);

          if (velocityRef.current > 0.5) {
            if (canCloseWithIndicator) {
              handleChangeDialog(
                PaperDialogState.Minimized,
                PaperDialogTrigger.Resize
              );
              setShowTitlebar(true);
              setTimeout(() => {
                // Clear inline styles so Framer Motion takes back control
                if (dialogRef.current) {
                  dialogRef.current.style.minHeight = "";
                  dialogRef.current.style.maxHeight = "";
                }

                if (contentRef.current) {
                  contentRef.current.style.height = "";
                  contentRef.current.style.maxHeight = "";
                }
                setResizeHeight(null);
              }, 300);
            }

            // Fast flick upward → animate smoothly to max height
          } else if (velocityRef.current < -0.5) {
            if (!dialogRef.current || !contentRef.current) return;

            // Apply smooth spring-like transition before snapping to max
            const easing = "cubic-bezier(0.32, 0.72, 0, 1)";
            const duration = "0.55s";
            dialogRef.current.style.transition = `min-height ${duration} ${easing}, max-height ${duration} ${easing}`;
            contentRef.current.style.transition = `height ${duration} ${easing}, max-height ${duration} ${easing}`;

            dialogRef.current.style.minHeight = `${maxPx}px`;
            dialogRef.current.style.maxHeight = `${maxPx}px`;
            contentRef.current.style.height = `${maxPx}px`;
            contentRef.current.style.maxHeight = `${maxPx}px`;

            onResize?.({ height: maxPx });

            // After transition ends, clear inline styles and hand off to React
            setTimeout(() => {
              if (dialogRef.current) {
                dialogRef.current.style.transition = "";
                dialogRef.current.style.minHeight = "";
                dialogRef.current.style.maxHeight = "";
              }
              if (contentRef.current) {
                contentRef.current.style.transition = "";
                contentRef.current.style.height = "";
                contentRef.current.style.maxHeight = "";
              }
              setResizeHeight(maxPx);
              onResizeComplete?.({ height: maxPx });
            }, 580);
          } else {
            // Read final height from DOM once, then hand back to React
            const finalHeight =
              dialogRef.current?.getBoundingClientRect().height ??
              resizeStartHeight.current;

            // Clear inline styles first so styled-components doesn't conflict
            if (dialogRef.current) {
              dialogRef.current.style.minHeight = "";
              dialogRef.current.style.maxHeight = "";
            }

            setResizeHeight(finalHeight);
            onResizeComplete?.({ height: finalHeight });
          }
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [resizable, mobile, onResize, onResizeComplete]
    );

    const resolvedWidth = resizeWidth != null ? `${resizeWidth}px` : width;
    const resolvedHeight = resizeHeight != null ? `${resizeHeight}px` : height;

    const handleChangeDialog = useCallback(
      (state: PaperDialogState, trigger: PaperDialogTrigger) => {
        setDialogState(state);
        if (onChange) {
          onChange(state, trigger);
        }
      },
      [setDialogState, onChange]
    );

    const closeDialog = useCallback(
      async (
        { withMinimize, withTimeout }: PaperDialogCloseOption,
        trigger: PaperDialogTrigger
      ) => {
        const close = async () =>
          await handleChangeDialog(PaperDialogState.Closed, trigger);

        await setResizeHeight(null);
        await setResizeWidth(null);

        if (withMinimize) {
          await handleChangeDialog(PaperDialogState.Minimized, trigger);

          if (withTimeout) {
            setTimeout(close, 400);
          } else {
            await close();
          }
        } else {
          await close();
        }
      },
      [mobile, handleChangeDialog]
    );

    useImperativeHandle(ref, () => ({
      openDialog: () => {
        handleChangeDialog(PaperDialogState.Restored, PaperDialogTrigger.API);
      },
      closeDialog: ({ withMinimize, withTimeout }: PaperDialogCloseOption) =>
        closeDialog(
          {
            withMinimize,
            withTimeout,
          },
          PaperDialogTrigger.API
        ),
      minimizeDialog: () => {
        handleChangeDialog(PaperDialogState.Minimized, PaperDialogTrigger.API);
      },
    }));

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (
          e.key === "Escape" &&
          canCloseWithEscape &&
          (dialogState === "restored" || dialogState === "minimized")
        ) {
          closeDialog(
            { withMinimize: false, withTimeout: false },
            PaperDialogTrigger.Escape
          );
          setShowTitlebar(false);
        }
      },
      [dialogState]
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
                if (canCloseWithOverlay) {
                  await setShowTitlebar(false);
                  await closeDialog(
                    { withMinimize: true, withTimeout: true },
                    PaperDialogTrigger.Overlay
                  );
                  await close();
                }
              }}
              styles={{ self: styles?.overlayStyle }}
              show={dialogState === PaperDialogState.Restored}
            />
          )}

          {mobile && showTitlebar && dialogState === "minimized" && title && (
            <MiniTitleBar
              $theme={paperDialogTheme}
              onClick={() => {
                handleChangeDialog(
                  PaperDialogState.Restored,
                  PaperDialogTrigger.Control
                );
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
                          closeDialog(
                            { withMinimize: false, withTimeout: false },
                            PaperDialogTrigger.Control
                          );
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
            initial={
              skipInitialAnimation
                ? false
                : mobile
                  ? { y: "100%" }
                  : { x: isLeft ? "-100%" : "100%" }
            }
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
            whileDrag={{ cursor: "grabbing", userSelect: "none" }}
            onDragEnd={(_, info) => {
              // For non-resizable dialogs, only allow swipe-to-minimize
              // when the indicator is enabled.
              if (
                (info.offset.y > 120 || info.velocity.y > 500) &&
                canCloseWithIndicator
              ) {
                handleChangeDialog(
                  PaperDialogState.Minimized,
                  PaperDialogTrigger.Drag
                );
                setShowTitlebar(true);
              }
            }}
          >
            {resizable && !mobile && (
              <DesktopResizeHandle
                $isLeft={isLeft}
                $style={styles?.indicatorStyle}
                onPointerDown={handleDesktopResizePointerDown}
                aria-label="paper-dialog-resize-handle"
              />
            )}

            {canCloseWithButton && controls?.includes("close") && (
              <ActionButtonWrapper
                $indexAction={0}
                $mobile={mobile}
                $top={4}
                $isLeft={isLeft}
                $theme={paperDialogTheme}
                onClick={() => {
                  closeDialog(
                    { withMinimize: false, withTimeout: false },
                    PaperDialogTrigger.Control
                  );
                }}
                $style={styles?.closeButtonStyle}
                aria-label="paper-dialog-toggle-close"
              >
                <Figure
                  {...icons?.closeIcon}
                  aria-label="paper-dialog-close-icon"
                  image={icons?.closeIcon?.image ?? RiCloseLine}
                  size={icons?.closeIcon?.size ?? 18}
                />
              </ActionButtonWrapper>
            )}

            {controls?.includes("minimize") && (
              <ActionButtonWrapper
                $indexAction={1}
                $mobile={mobile}
                $top={44}
                $isLeft={isLeft}
                aria-label="paper-dialog-toggle-restore"
                $style={styles?.minimizeButtonStyle}
                onClick={() => {
                  handleChangeDialog(
                    dialogState === PaperDialogState.Minimized
                      ? PaperDialogState.Restored
                      : PaperDialogState.Minimized,
                    PaperDialogTrigger.Control
                  );
                  setShowTitlebar(true);
                }}
                $theme={paperDialogTheme}
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
              </ActionButtonWrapper>
            )}

            {mobile && (
              <DragIndicatorWrapper
                aria-label="paper-dialog-drag-indicator"
                $resizable={!!resizable}
                $style={styles?.indicatorStyle}
                onPointerDown={(e) => {
                  if (resizable) {
                    handleMobileResizePointerDown(e);
                  } else if (canCloseWithButton) {
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
              ref={contentRef}
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

const DesktopResizeHandle = styled.div<{ $isLeft: boolean; $style?: CSSProp }>`
  touch-action: none;
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

  ${({ $style }) => $style}
`;

const ActionButtonWrapper = styled.div<{
  $isLeft: boolean;
  $top: number;
  $style?: CSSProp;
  $mobile?: boolean;
  $indexAction?: number;
  $theme?: PaperDialogThemeConfig;
}>`
  position: absolute;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
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

  ${({ $isLeft, $mobile, $theme, $indexAction, $top }) =>
    $mobile
      ? css`
          border: 1px solid ${$theme?.borderColor};
          border-top-width: 1px;
          border-right-width: 1px;
          border-left-width: 1px;
          border-bottom-width: 0px;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 6px;
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

          border: 1px solid ${$theme?.borderColor};
          box-shadow: ${$theme?.boxShadow};

          ${$isLeft
            ? css`
                right: 0;
                transform: translateX(30px);
                border-right-width: 1px;
                border-top-width: 1px;
                border-bottom-width: 1px;
                border-radius: 0 0.75rem 0.75rem 0;
              `
            : css`
                left: 0;
                transform: translateX(-30px);
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

  touch-action: none;

  cursor: ${({ $resizable }) => ($resizable ? "ns-resize" : "grab")};
  width: 100dvw;
  height: 60px;
  align-items: center;
  border-radius: 1.2rem 1.2rem 0 0;
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  &:active {
    cursor: ${({ $resizable }) => ($resizable ? "ns-resize" : "grabbing")};
  }

  ${({ $style }) => $style};
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
