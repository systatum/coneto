"use client";

import { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, CSSProp, css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";
import { Button, ButtonStylesProps, ButtonVariants } from "./button";
import { OverlayBlocker } from "./overlay-blocker";
import { Figure, FigureProps } from "./figure";
import { lightenColor } from "./../lib/lighten-color";
import { createRoot } from "react-dom/client";

const zoomIn = keyframes`from {transform: translate(-50%, -50%) scale(0.95); opacity: 0;} to {transform: translate(-50%, -50%) scale(1); opacity: 1;}`;
const zoomOut = keyframes`from {transform: translate(-50%, -50%) scale(1); opacity: 1;} to {transform: translate(-50%, -50%) scale(0.95); opacity: 0;}`;

function usePortal() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.body;
    setMounted(true);
  }, []);

  return { mounted, target: ref.current };
}

export interface DialogProps {
  children?: ReactNode;
  isOpen?: boolean;
  onVisibilityChange?: (isOpen?: boolean) => void;
  closable?: boolean;
  styles?: DialogStylesProps;
  onClick?: (args: { id: string; closeDialog: () => void }) => void;
  buttons?: DialogButtonProps[];
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: FigureProps;
  onClosed?: () => void;
}

export interface DialogStylesProps {
  overlayStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
  headerStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  buttonWrapperStyle?: CSSProp;
}

export interface DialogButtonProps extends Pick<ButtonVariants, "variant"> {
  id: string;
  caption: string;
  isLoading?: boolean;
  disabled?: boolean;
  styles?: ButtonStylesProps;
}

function Dialog({
  children,
  isOpen,
  onVisibilityChange,
  closable = true,
  styles,
  title,
  subtitle,
  buttons,
  onClick,
  icon,
  onClosed,
}: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { mounted, target } = usePortal();

  const closeDialog = () => {
    onVisibilityChange(false);
    if (onClosed) {
      onClosed();
    }
  };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) closeDialog();
    },
    [closeDialog]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted || !target || !isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <OverlayBlocker
        show={isOpen}
        styles={{ self: styles?.overlayStyle }}
        onClick={async ({ preventDefault, close }) => {
          await preventDefault();
          if (closable) {
            await onVisibilityChange(false);
            await close();

            if (onClosed) {
              await onClosed();
            }
          }
        }}
      />
      <Wrapper
        aria-label="dialog-wrapper"
        $isOpen={isOpen}
        $style={styles?.containerStyle}
      >
        {(icon || title || subtitle) && (
          <Header aria-label="dialog-head-wrapper" $style={styles?.headerStyle}>
            {icon &&
              (() => {
                const iconProps: FigureProps = {
                  ...icon,
                  size: icon?.size ?? 28,
                  styles: {
                    self: css`
                      min-width: ${icon?.size
                        ? `${icon?.size * 1.5}px`
                        : `42px`};
                      min-height: ${icon?.size
                        ? `${icon?.size * 1.5}px`
                        : `42px`};
                      background-color: ${lightenColor(
                        icon?.color ?? "black",
                        0.9
                      )};
                      border-radius: 99999px;
                      justify-content: center;
                      align-items: center;
                      display: flex;
                      overflow: hidden;
                      ${icon?.styles?.self}
                    `,
                  },
                };
                return <Figure {...iconProps} aria-label="dialog-icon" />;
              })()}

            {(title || subtitle) && (
              <TextWrapper
                aria-label="dialog-text-wrapper"
                $style={styles?.textWrapperStyle}
              >
                {title && (
                  <Title
                    aria-label={"dialog-title"}
                    $style={styles?.titleStyle}
                  >
                    {title}
                  </Title>
                )}

                {subtitle && (
                  <Subtitle
                    aria-label="dialog-subtitle"
                    $style={styles?.subtitleStyle}
                  >
                    {subtitle}
                  </Subtitle>
                )}
              </TextWrapper>
            )}
          </Header>
        )}

        {children && (
          <Body aria-label="dialog-content" $style={styles?.contentStyle}>
            {children}
          </Body>
        )}

        {buttons && (
          <Footer $style={styles?.buttonWrapperStyle}>
            {buttons.map((props, index) => (
              <Button
                key={index}
                isLoading={props.isLoading}
                disabled={props.disabled}
                variant={props.variant}
                onClick={() => onClick?.({ id: props.id, closeDialog })}
                styles={{
                  ...props?.styles,
                  self: css`
                    min-width: 100px;
                    ${props?.styles?.self}
                  `,
                }}
              >
                {props.caption}
              </Button>
            ))}
          </Footer>
        )}

        {closable && (
          <Button
            variant="transparent"
            onClick={() => closeDialog()}
            aria-label="close-dialog"
            styles={{
              containerStyle: css`
                position: absolute;
                top: 1rem;
                right: 1.2rem;
                cursor: pointer;
                transition: all 0.3s;
                border-radius: 2px;
                padding: 2px;
              `,
              self: css`
                width: 20px;
                height: 20px;
                padding: 2px;
                ${styles?.closeButtonStyle}
              `,
            }}
          >
            <RiCloseLine />
          </Button>
        )}
      </Wrapper>
    </>,
    target
  );
}

const Wrapper = styled.div<{ $isOpen: boolean; $style?: CSSProp }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9991999;
  background: white;
  padding: 1.5rem;
  border-radius: 2px;
  max-width: calc(100% - 2rem);
  width: 380px;
  justify-content: space-between;
  align-items: center;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${({ $isOpen }) => ($isOpen ? zoomIn : zoomOut)} 0.2s forwards;

  ${({ $style }) => $style}
`;

const Header = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  justify-content: center;
  align-items: center;

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  ${({ $style }) => $style}
`;

const Title = styled.h2<{
  $style?: CSSProp;
}>`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;

  ${({ $style }) => $style}
`;

const Subtitle = styled.h3<{ $style?: CSSProp }>`
  font-size: 13px;
  color: #5a606b;
  text-align: center;

  ${({ $style }) => $style}
`;

const Body = styled.div<{ $style?: CSSProp }>`
  height: 100%;
  font-size: 12px;
  width: 100%;
  padding-top: 0.5rem;

  ${({ $style }) => $style}
`;

const Footer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  gap: 10px;

  ${({ $style }) => $style}
`;

type DialogConfig = Omit<DialogProps, "isOpen" | "onVisibilityChange">;

let setDialogOpen: ((isOpen: boolean) => void) | null = null;

let mounted = false;

function DialogProvider(config: DialogConfig) {
  const [isOpen, setIsOpen] = useState(false);

  setDialogOpen = setIsOpen;

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      {...config}
      isOpen={isOpen}
      onVisibilityChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
      onClick={({ id }) => {
        config.onClick({ id, closeDialog });
      }}
      onClosed={() => {
        config.onClosed?.();
        closeDialog();
      }}
    />
  );
}

function ensureProvider(config: DialogConfig) {
  if (mounted) return;

  const el = document.createElement("div");
  document.body.appendChild(el);

  createRoot(el).render(<DialogProvider {...config} />);
  mounted = true;
}

const DialogController = {
  show(config: DialogConfig) {
    ensureProvider(config);
    // Introduce a slight delay to ensure the component is fully mounted
    // before triggering the open state, preserving animation consistency.
    setTimeout(() => {
      setDialogOpen?.(true);
    }, 50);
  },
  hide() {
    setDialogOpen?.(false);
  },
};

Dialog.show = DialogController.show;
Dialog.hide = DialogController.hide;

export { Dialog };
