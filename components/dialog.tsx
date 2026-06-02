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
import { FigureProps } from "./figure";
import { createRoot } from "react-dom/client";
import {
  getThemeSnapshot,
  subscribeTheme,
  ThemeProvider,
  useTheme,
} from "./../theme/provider";
import { DialogThemeConfig } from "./../theme";
import { BaseAction } from "../constants/action";
import { applyClassName } from "./../constants/classname";
import { Title } from "./title";

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
  onClick?: (args: { buttonId: string; closeDialog: () => void }) => void;
  actions?: DialogAction[];
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: FigureProps;
  onClosed?: () => void;
  className?: string;
  mobile?: boolean;
  id?: string;
}

export interface DialogStyles {
  overlayStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
  headerStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  actionWrapperStyle?: CSSProp;
}

export interface DialogAction
  extends Omit<BaseAction, "onClick">, Pick<ButtonVariants, "variant"> {
  id: string;
  isLoading?: boolean;
  styles?: ButtonStyles;
  className?: string;
}

function Dialog({
  children,
  isOpen,
  onVisibilityChange,
  closable = true,
  styles,
  title,
  subtitle,
  actions,
  onClick,
  icon,
  onClosed,
  className,
  mobile,
  id,
}: DialogProps) {
  const { currentTheme } = useTheme();
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

  const hasModalDialog = className?.includes("coneto-modal-dialog");

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
        id={id}
        className={
          hasModalDialog ? className : applyClassName("dialog", className)
        }
        $theme={dialogTheme}
        aria-label="dialog-wrapper"
        $isOpen={isOpen}
        $style={css`
          ${mobile &&
          css`
            padding: 0px;
            gap: 0px;
            user-select: none;
          `}
          ${styles?.containerStyle};
        `}
      >
        {(icon || title || subtitle) && (
          <Title
            styles={{
              textContainerStyle: css`
                flex-direction: column;
                justify-content: center;
                align-items: center;
                ${styles?.headerStyle}
              `,
              textWrapperStyle: css`
                ${mobile &&
                css`
                  gap: 4px;
                `};
                flex-direction: column;
                justify-content: center;
                align-items: center;
                ${styles?.textWrapperStyle}
              `,
              titleStyle: css`
                font-size: 18px;
                width: fit-content;
                text-align: center;
                ${styles?.titleStyle}
              `,
              subtitleStyle: css`
                font-size: 13px;
                width: fit-content;
                text-align: center;

                ${dialogTheme?.subtitleColor ?? "#5a606b"};
                ${styles?.subtitleStyle}
              `,
              rightSectionStyle: css`
                position: absolute;
                top: 1rem;
                right: 1rem;
                cursor: pointer;
                border-radius: 2px;
                padding: 2px;
              `,
              containerStyle: css`
                ${mobile &&
                css`
                  padding: 20px 30px;
                  user-select: none;
                `};
              `,
            }}
            rightSection={
              closable && [
                {
                  styles: {
                    toggleActionStyle: css`
                      width: 20px;
                      height: 20px;
                      padding: 10px;
                      border-radius: 4px;
                    `,
                  },
                  type: "actions",
                  actions: [
                    {
                      icon: { image: RiCloseLine, size: 14 },
                      caption: "Close Modal",
                      onClick: () => closeDialog(),
                    },
                  ],
                },
              ]
            }
            icon={{ ...icon, size: icon?.size ?? 28 }}
            text={title}
            subtitle={subtitle}
          />
        )}

        {children && (
          <Body aria-label="dialog-content" $style={styles?.contentStyle}>
            {children}
          </Body>
        )}

        {actions && (
          <Footer
            $style={css`
              ${mobile &&
              css`
                gap: 0px;
              `};
              ${styles?.actionWrapperStyle}
            `}
          >
            {actions.map((action, index) => {
              if (action.disabled) return;
              return (
                <Button
                  key={index}
                  isLoading={action.isLoading}
                  disabled={action.disabled}
                  variant={action.variant}
                  onClick={() =>
                    onClick?.({ buttonId: action.id, closeDialog })
                  }
                  styles={{
                    ...action?.styles,
                    containerStyle: css`
                      ${mobile &&
                      css`
                        width: 100%;
                      `};
                      ${action?.styles?.containerStyle};
                    `,
                    self: css`
                      ${mobile &&
                      css`
                        width: 100%;
                        height: 44px;
                        border-radius: 0px;
                      `};
                      min-width: 100px;

                      ${action?.styles?.self}
                    `,
                  }}
                >
                  {action.caption}
                </Button>
              );
            })}
          </Footer>
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
  $mobile?: boolean;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

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
  user-select: ${({ $mobile }) => ($mobile ? "none" : "inherit")};

  ${({ $style }) => $style};
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
      onClick={({ buttonId }) => {
        config.onClick({ buttonId, closeDialog });
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
