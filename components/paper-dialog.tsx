import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
} from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
} from "react";
import { Button, ButtonStyles, ButtonVariants } from "./button";
import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { OverlayBlocker } from "./overlay-blocker";
import { useTheme } from "./../theme/provider";
import { PaperDialogThemeConfig } from "./../theme";

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
  width?: string;
  styles?: PaperDialogStyles;
  onClosed?: () => void;
}

export interface PaperDialogStyles {
  self?: CSSProp;
  tabStyle?: CSSProp;
  tabCloseStyle?: CSSProp;
  paperDialogStyle?: CSSProp;
}

export interface PaperDialogTriggerProps {
  children?: ReactNode;
  setDialogState?: (dialogState: PaperDialogState) => void;
  icon?: FigureProps;
  variant?: ButtonVariants["variant"];
  styles?: PaperDialogTriggerStyles;
}

export type PaperDialogTriggerStyles = ButtonStyles;

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

const PaperDialogBase = forwardRef<PaperDialogRef, PaperDialogProps>(
  (
    { position = "right", children, closable = true, width, styles, onClosed },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const paperDialogTheme = currentTheme.paperDialog;

    const [dialogState, setDialogState] = useState<PaperDialogState>("closed");
    const controls = useAnimation();
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

    const handleToggleDrawer = (open: PaperDialogState) => {
      setDialogState(open);
      controls.start({
        x: open === "minimized" ? (isLeft ? "-100%" : "100%") : 0,
        transition: { type: "spring", stiffness: 400, damping: 40 },
      });
    };

    useImperativeHandle(ref, () => ({
      openDialog: async () => {
        await setDialogState("restored");
        await handleToggleDrawer("restored");
      },
      closeDialog: async () => {
        await setDialogState("closed");
        await handleToggleDrawer("closed");
        if (onClosed) {
          await onClosed();
        }
      },
      minimizeDialog: async () => {
        await setDialogState("minimized");
        await handleToggleDrawer("minimized");
      },
    }));

    const childArray = Children.toArray(children);

    const trigger = childArray.find(
      (child): child is ReactElement<PaperDialogTriggerProps> =>
        isValidElement(child) && child.type === PaperDialog.Trigger
    );

    const content = childArray.find(
      (child): child is ReactElement<PaperDialogContentProps> =>
        isValidElement(child) && child.type === PaperDialog.Content
    );

    return (
      <Fragment>
        {trigger &&
          cloneElement(trigger, {
            setDialogState: async () => {
              await setDialogState("restored");
              await handleToggleDrawer("restored");
            },
          })}

        {dialogState !== "closed" && (
          <DialogOverlay
            $dialogState={dialogState}
            $paperDialogStyle={styles?.paperDialogStyle}
          >
            {dialogState === "restored" && (
              <OverlayBlocker
                onClick={async ({ preventDefault, close }) => {
                  await preventDefault();
                  if (closable) {
                    await setDialogState("closed");
                    await close();

                    if (onClosed) {
                      await onClosed();
                    }
                  }
                }}
                show={dialogState === "restored"}
              />
            )}

            <MotionDialog
              aria-label="paper-dialog-wrapper"
              $width={width}
              initial={{ x: isLeft ? "-100%" : "100%" }}
              animate={controls}
              $isLeft={isLeft}
              $style={styles?.self}
              $theme={paperDialogTheme}
            >
              {closable && (
                <CloseButtonWrapper
                  $isLeft={isLeft}
                  $tabStyle={styles?.tabCloseStyle}
                >
                  <IconButton
                    $theme={paperDialogTheme}
                    $isLeft={isLeft}
                    aria-label="button-close"
                    onClick={() => {
                      setDialogState("closed");
                      if (onClosed) {
                        onClosed();
                      }
                    }}
                  >
                    <RiCloseLine size={20} />
                  </IconButton>
                </CloseButtonWrapper>
              )}

              <MinimizeButtonWrapper
                $isLeft={isLeft}
                $tabStyle={styles?.tabStyle}
              >
                <IconButton
                  $theme={paperDialogTheme}
                  $isLeft={isLeft}
                  aria-label="paper-dialog-toggle"
                  onClick={() =>
                    handleToggleDrawer(
                      dialogState === "minimized" ? "restored" : "minimized"
                    )
                  }
                >
                  {isLeft ? (
                    <RiArrowRightSLine
                      style={{
                        transition: "transform 0.5s ease-in-out",
                        transform:
                          dialogState === "restored"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                      size={20}
                    />
                  ) : (
                    <RiArrowLeftSLine
                      style={{
                        transition: "transform 0.5s ease-in-out",
                        transform:
                          dialogState === "restored"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                      size={20}
                    />
                  )}
                </IconButton>
              </MinimizeButtonWrapper>

              <Fragment>{content}</Fragment>
            </MotionDialog>
          </DialogOverlay>
        )}
      </Fragment>
    );
  }
);

const DialogOverlay = styled.div<{
  $dialogState: PaperDialogState;
  $paperDialogStyle?: CSSProp;
}>`
  position: fixed;
  z-index: 9991999;
  ${({ $dialogState }) =>
    $dialogState === "restored" &&
    css`
      inset: 0;
    `}

  ${({ $paperDialogStyle }) => $paperDialogStyle}
`;

const MotionDialog = styled(motion.div)<{
  $isLeft: boolean;
  $style?: CSSProp;
  $width?: string;
  $theme?: PaperDialogThemeConfig;
}>`
  position: fixed;
  top: 0;
  ${({ $isLeft }) =>
    $isLeft
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 16rem;
  min-width: ${({ $width }) => $width ?? "92vw"};
  padding-bottom: 1rem;
  z-index: 9991999;

  background-color: ${({ $theme }) => $theme?.backgroundColor};
  color: ${({ $theme }) => $theme?.textColor};
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $style }) => $style};
`;

const CloseButtonWrapper = styled.div<{
  $isLeft: boolean;
  $tabStyle?: CSSProp;
}>`
  position: absolute;
  top: 4px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: fit-content;

  ${({ $isLeft }) =>
    $isLeft
      ? css`
          left: 100%;
          translate: -4px;
        `
      : css`
          right: 100%;
          translate: 4px;
        `}

  ${({ $tabStyle }) => $tabStyle}
`;

const MinimizeButtonWrapper = styled.div<{
  $isLeft: boolean;
  $tabStyle?: CSSProp;
}>`
  position: absolute;
  z-index: 9999;
  top: 44px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  height: fit-content;
  ${({ $isLeft }) =>
    $isLeft
      ? css`
          left: 100%;
          translate: -4px;
        `
      : css`
          right: 100%;
          translate: 4px;
        `}
  ${({ $tabStyle }) => $tabStyle}
`;

const IconButton = styled.button<{
  $isLeft: boolean;
  $theme?: PaperDialogThemeConfig;
}>`
  position: relative;
  cursor: pointer;
  padding: 8px;
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  &:hover {
    background-color: ${({ $theme }) => $theme?.actionHoverBackgroundColor};
  }

  ${({ $isLeft }) =>
    $isLeft
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
`;

function PaperDialogTrigger({
  children,
  icon,
  setDialogState,
  variant = "default",
  styles,
}: PaperDialogTriggerProps) {
  return (
    <Button
      variant={variant}
      aria-label="paper-dialog-trigger"
      onClick={() => {
        setDialogState("restored");
      }}
      styles={styles}
    >
      {icon && <Figure {...icon} size={icon?.size ?? 20} />}
      {children}
    </Button>
  );
}

export function PaperDialogContent({
  children,
  styles,
}: PaperDialogContentProps) {
  const { currentTheme } = useTheme();
  const paperDialogTheme = currentTheme.paperDialog;

  return (
    <StyledDialogContent
      $theme={paperDialogTheme}
      aria-label="paper-dialog-content"
      $style={styles?.self}
    >
      {children}
    </StyledDialogContent>
  );
}

const StyledDialogContent = styled.div<{
  $style?: CSSProp;
  $theme?: PaperDialogThemeConfig;
}>`
  min-height: 100dvh;
  max-height: 100dvh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 9999;
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  color: ${({ $theme }) => $theme?.textColor};

  ${({ $style }) => $style}
`;

const PaperDialog = Object.assign(PaperDialogBase, {
  Trigger: PaperDialogTrigger,
  Content: PaperDialogContent,
});

export { PaperDialog };
