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
}

export interface PaperDialogIcons {
  closeIcon?: FigureProps;
  restoreIcon?: FigureProps;
}

export interface PaperDialogStyles {
  contentStyle?: CSSProp;
  minimizeButtonStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
  overlayStyle?: CSSProp;
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
  closeDialog: () => void;
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
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const paperDialogTheme = currentTheme.paperDialog;
    const dragControls = useDragControls();

    useImperativeHandle(ref, () => ({
      openDialog: async () => {
        await setDialogState("restored");
      },
      closeDialog: async () => {
        if (mobile) {
          await setDialogState("minimized");
          setTimeout(() => {
            setDialogState("closed");
          }, 400);
        } else {
          await setDialogState("closed");
        }
        if (onClosed) {
          await onClosed();
        }
      },
      minimizeDialog: async () => {
        await setDialogState("minimized");
      },
    }));

    const [dialogState, setDialogState] = useState<PaperDialogState>("closed");

    const isLeft = position === "left";

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && closable) {
          setDialogState("closed");
          if (onClosed) {
            onClosed();
          }
        }
      },
      [setDialogState]
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
                  if (mobile) {
                    await setDialogState("minimized");
                    setTimeout(() => {
                      setDialogState("closed");
                    }, 400);
                  } else {
                    await setDialogState("closed");
                  }
                  await close();

                  if (onClosed) {
                    await onClosed();
                  }
                }
              }}
              styles={{
                self: styles?.overlayStyle,
              }}
              show={dialogState === "restored"}
            />
          )}

          <MotionDialog
            $mobile={mobile}
            aria-label="paper-dialog-wrapper"
            $width={width}
            $height={height}
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
            dragElastic={{
              top: 0,
              bottom: 0.6,
            }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) {
                setDialogState("minimized");
                setTimeout(() => {
                  setDialogState("closed");

                  if (onClosed) {
                    onClosed();
                  }
                }, 400);
              }
            }}
            whileDrag={{
              cursor: "grabbing",
              userSelect: "none",
            }}
          >
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
                    setDialogState("closed");
                    if (onClosed) {
                      onClosed();
                    }
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
                  onClick={() =>
                    setDialogState(
                      dialogState === "minimized" ? "restored" : "minimized"
                    )
                  }
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

            <PaperDialogContent
              $height={height}
              $theme={paperDialogTheme}
              aria-label="paper-dialog-content"
              $style={styles?.contentStyle}
              $mobile={mobile}
            >
              {(title || subtitle) && (
                <Title text={title} subtitle={subtitle} size="lg" />
              )}
              {mobile && closable && (
                <DragIndicatorWrapper
                  aria-label="paper-dialog-drag-indicator"
                  onPointerDown={(e) => dragControls.start(e)}
                  $theme={paperDialogTheme}
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

const DialogOverlay = styled.div<{
  $dialogState: PaperDialogState;
  $style?: CSSProp;
}>`
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
          max-height: ${$height ?? "72dvh"};
          min-height: ${$height ?? "72dvh"};
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
          top: -27px;

          ${$isLeft
            ? css`
                left: ${`${$indexAction * 32 + 18}px`};
              `
            : css`
                right: ${`${$indexAction * 32 + 18}px`};
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

  &:hover {
    background-color: ${({ $theme }) => $theme?.actionHoverBackgroundColor};
  }

  ${({ $isLeft, $mobile, $theme }) =>
    $mobile
      ? css`
          border: 1px solid ${$theme?.borderColor};
          border-top-width: 1px;
          border-right-width: 1px;
          border-left-width: 1px;
          border-bottom-width: 0px;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 4px;
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
      padding: 40px 20px 20px 20px;
      border-radius: 1rem 1rem 0 0;
      margin-top: 4px;
    `}

  ${({ $style }) => $style}
`;

const DragIndicatorWrapper = styled(motion.div)<{
  $theme?: PaperDialogThemeConfig;
}>`
  display: flex;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 5px;
  border-radius: 999px;
  background-color: ${({ $theme }) => $theme?.textColor};
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

export { PaperDialog };
