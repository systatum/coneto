import {
  RemixiconComponentType,
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
} from "react";
import { Button, ButtonVariants } from "./button";
import styled, { css, CSSProp } from "styled-components";

export type DialogState = "restore" | "close" | "minimize";

export interface PaperDialogProps {
  position?: "left" | "right";
  children: ReactNode;
  closable?: boolean;
  width?: string;
  styles?: PaperDialogStylesProps;
}

export interface PaperDialogStylesProps {
  self?: CSSProp;
  tabStyle?: CSSProp;
  tabCloseStyle?: CSSProp;
  paperDialogStyle?: CSSProp;
}

interface PaperDialogTriggerProps {
  children?: ReactNode;
  setDialogState?: (dialogState: DialogState) => void;
  icon?: RemixiconComponentType;
  style?: CSSProp;
  variant?: ButtonVariants["variant"];
}

interface PaperDialogContentProps {
  children?: ReactNode;
  style?: CSSProp;
}

export interface PaperDialogRef {
  openDialog: () => void;
  closeDialog: () => void;
  minimizeDialog: () => void;
}

const PaperDialogBase = forwardRef<PaperDialogRef, PaperDialogProps>(
  ({ position = "right", children, closable, width, styles }, ref) => {
    const [dialogState, setDialogState] = useState<DialogState>("close");
    const controls = useAnimation();
    const isLeft = position === "left";

    const handleToggleDrawer = (open: DialogState) => {
      setDialogState(open);
      controls.start({
        x: open === "minimize" ? (isLeft ? "-100%" : "100%") : 0,
        transition: { type: "spring", stiffness: 400, damping: 40 },
      });
    };

    useImperativeHandle(ref, () => ({
      openDialog: async () => {
        await setDialogState("restore");
        await handleToggleDrawer("restore");
      },
      closeDialog: async () => {
        await setDialogState("close");
        await handleToggleDrawer("close");
      },
      minimizeDialog: async () => {
        await setDialogState("minimize");
        await handleToggleDrawer("minimize");
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
              await setDialogState("restore");
              await handleToggleDrawer("restore");
            },
          })}

        {dialogState !== "close" && (
          <DialogOverlay
            $dialogState={dialogState}
            $paperDialogStyle={styles?.paperDialogStyle}
          >
            {dialogState === "restore" && <BackgroundBlur aria-hidden="true" />}

            <MotionDialog
              aria-label="paper-dialog-content"
              $width={width}
              initial={{ x: isLeft ? "-100%" : "100%" }}
              animate={controls}
              $isLeft={isLeft}
              $style={styles?.self}
            >
              {closable && (
                <CloseButtonWrapper
                  $isLeft={isLeft}
                  $tabStyle={styles?.tabCloseStyle}
                >
                  <IconButton
                    $isLeft={isLeft}
                    aria-label="button-close"
                    onClick={() => setDialogState("close")}
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
                  $isLeft={isLeft}
                  aria-label="paper-dialog-toggle"
                  onClick={() =>
                    handleToggleDrawer(
                      dialogState === "minimize" ? "restore" : "minimize"
                    )
                  }
                >
                  {isLeft ? (
                    <RiArrowRightSLine
                      style={{
                        transition: "transform 0.5s ease-in-out",
                        transform:
                          dialogState === "restore"
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
                          dialogState === "restore"
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
  $dialogState: DialogState;
  $paperDialogStyle?: CSSProp;
}>`
  position: fixed;
  z-index: 9999;
  ${({ $dialogState }) =>
    $dialogState === "restore" &&
    css`
      inset: 0;
    `}

  ${({ $paperDialogStyle }) => $paperDialogStyle}
`;

const BackgroundBlur = styled.div`
  position: absolute;
  inset: 0;
  background-color: #f3f4f6;
  opacity: 0.7;
  transition: all 0.5s ease;
  backdrop-filter: blur(2px);
`;

const MotionDialog = styled(motion.div)<{
  $isLeft: boolean;
  $style?: CSSProp;
  $width?: string;
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
  background-color: white;
  border: 1px solid #ebebeb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;

  ${({ $style }) => $style}
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

const IconButton = styled.button<{ $isLeft: boolean }>`
  position: relative;
  background-color: white;
  border: 1px solid #ebebeb;
  cursor: pointer;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #f3f4f6;
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
  icon: Icon,
  setDialogState,
  variant = "default",
  style,
}: PaperDialogTriggerProps) {
  return (
    <Button
      variant={variant}
      aria-label="paper-dialog-trigger"
      onClick={() => {
        setDialogState("restore");
      }}
      styles={{ self: style }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </Button>
  );
}

export function PaperDialogContent({
  children,
  style,
}: PaperDialogContentProps) {
  return (
    <StyledDialogContentWrapper>
      <StyledDialogContent $style={style}>{children}</StyledDialogContent>
    </StyledDialogContentWrapper>
  );
}

const StyledDialogContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 9999;
  background-color: white;
`;

const StyledDialogContent = styled.div<{ $style?: CSSProp }>`
  min-height: 100vh;

  ${({ $style }) => $style}
`;

const PaperDialog = Object.assign(PaperDialogBase, {
  Trigger: PaperDialogTrigger,
  Content: PaperDialogContent,
});

export { PaperDialog };
