"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
  ComponentType,
} from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, CSSProp, css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";
import { Button, ButtonStyles, ButtonVariants } from "./button";
import { OverlayBlocker } from "./overlay-blocker";
import { Figure, FigureProps } from "./figure";
import { darkenColor, lightenColor } from "../lib/color";
import { createRoot } from "react-dom/client";
import {
  getThemeSnapshot,
  subscribeTheme,
  ThemeProvider,
  useTheme,
} from "./../theme/provider";
import { DialogThemeConfig } from "./../theme";

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
  styles?: DialogStyles;
  onClick?: (args: { id: string; closeDialog: () => void }) => void;
  buttons?: DialogButton[];
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: DialogIcon;
  onClosed?: () => void;
}

export type DialogIcon = FigureProps;

export interface DialogStyles {
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

export interface DialogButton extends Pick<ButtonVariants, "variant"> {
  id: string;
  caption: string;
  isLoading?: boolean;
  disabled?: boolean;
  styles?: ButtonStyles;
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
  const { currentTheme, mode } = useTheme();
  const dialogTheme = currentTheme.dialog;

  const [isVisible, setIsVisible] = useState(false);
  const { mounted, target } = usePortal();

  const closeDialog = () => {
    if (onVisibilityChange) {
      onVisibilityChange(false);
    }
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
        $theme={dialogTheme}
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
                      background-color: ${mode === "light"
                        ? lightenColor(
                            icon?.color ?? dialogTheme?.textColor,
                            0.9
                          )
                        : darkenColor(
                            icon?.color ?? dialogTheme?.textColor,
                            0.8
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
                    $theme={dialogTheme}
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
            <RiCloseLine size={16} />
          </Button>
        )}
      </Wrapper>
    </>,
    target
  );
}

const Wrapper = styled.div<{
  $isOpen: boolean;
  $style?: CSSProp;
  $theme?: DialogThemeConfig;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9992999;
  padding: 1.5rem;
  max-width: calc(100% - 2rem);
  width: 380px;
  justify-content: space-between;
  align-items: center;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  box-shadow: ${({ $theme }) =>
    $theme?.boxShadow ?? "0px 10px 20px rgba(0, 0, 0, 0.1)"};
  color: ${({ $theme }) => $theme?.textColor ?? "inherit"};
  background: ${({ $theme }) => $theme?.backgroundColor};
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
  color: inherit;
  background-color: inherit;

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

const Subtitle = styled.h3<{
  $style?: CSSProp;
  $theme?: DialogThemeConfig;
}>`
  font-size: 13px;
  text-align: center;
  color: ${({ $theme }) => $theme?.subtitleColor ?? "#5a606b"};

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

interface DialogMountState {
  mounted: boolean;
  root: ReturnType<typeof createRoot> | null;
  container: HTMLDivElement | null;
  setConfig?: (props: DialogConfig | null) => void;
  setIsOpen?: (isOpen: boolean) => void;
  onMounted?: () => void;
}

const mountedStates = new Map<ComponentType<DialogConfig>, DialogMountState>();

function DialogProvider({
  component: Dialog,
}: {
  component: ComponentType<DialogProps>;
}) {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const state = mountedStates.get(Dialog);
  if (state) {
    state.setConfig = setConfig;
    state.setIsOpen = setIsOpen;
  }

  useEffect(() => {
    mountedStates.get(Dialog)?.onMounted?.();
  }, []);

  if (!config) return null;

  const closeDialog = () => {
    // Closes the dialog by first updating the visibility state,
    // then delaying config cleanup to allow the exit animation
    setIsOpen(false);
    setTimeout(() => {
      setConfig(null);
    }, 200);
  };

  return (
    <Dialog
      {...config}
      isOpen={isOpen}
      onVisibilityChange={(open?: boolean) => {
        if (!open) closeDialog();
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

function ensureProvider(
  component: ComponentType<DialogProps>,
  onReady?: () => void
) {
  // If a container reference exists but is no longer attached to the DOM
  // reset all internal references so the provider can be recreated safely.
  if (!mountedStates.has(component)) {
    mountedStates.set(component, {
      mounted: false,
      root: null,
      container: null,
    });
  }

  const state = mountedStates.get(component)!;

  if (state.container && !document.body.contains(state.container)) {
    state.root?.unmount();
    state.root = null;
    state.container = null;
    state.mounted = false;
  }
  // If the provider is already mounted and valid, do nothing.
  // This ensures the modal system behaves as a singleton.
  if (state.mounted) {
    renderRoot(state, component);
    onReady();
    return;
  }

  state.onMounted = onReady;

  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  state.container = container;
  state.root = root;
  state.mounted = true;

  renderRoot(state, component);
}

function renderRoot(
  state: DialogMountState,
  component: ComponentType<DialogProps>
) {
  state.root?.render(<ThemeBridge component={component} />);
}

function ThemeBridge({
  component: Dialog,
}: {
  component: ComponentType<DialogProps>;
}) {
  const [theme, setTheme] = useState(getThemeSnapshot());

  useEffect(() => {
    return subscribeTheme(() => {
      setTheme(getThemeSnapshot());
    });
  }, []);

  return (
    <ThemeProvider mode={theme.mode} themes={theme.themes}>
      <DialogProvider component={Dialog} />
    </ThemeProvider>
  );
}

export function createDialogController(component: ComponentType<DialogProps>) {
  return {
    show(config: DialogConfig) {
      ensureProvider(component, () => {
        // Introduce a slight delay to ensure the component is fully mounted
        // before triggering the open state, preserving animation consistency.
        const state = mountedStates.get(component);

        setTimeout(() => {
          state?.setConfig?.(config);
          state?.setIsOpen?.(true);
        }, 10);
      });
    },

    hide() {
      const state = mountedStates.get(component);
      state?.setIsOpen?.(false);
    },

    destroy() {
      const state = mountedStates.get(component);
      if (!state) return;

      state.root?.unmount();
      state.container?.remove();
      mountedStates.delete(component);
    },
  };
}

const DialogController = createDialogController(Dialog);

Dialog.show = DialogController.show;
Dialog.hide = DialogController.hide;

export { Dialog };
