"use client";

import { createRoot } from "react-dom/client";
import { Dialog, DialogProps, DialogStylesProps } from "./dialog";
import styled, { css, CSSProp } from "styled-components";
import { useState } from "react";

export type ModalDialogProps = DialogProps;
export type ModalDialogStylesProps = DialogStylesProps;

function ModalDialog({
  onVisibilityChange,
  isOpen,
  subtitle,
  title,
  buttons,
  children,
  styles,
  onClick,
  onClosed,
  closable = true,
  icon,
}: ModalDialogProps) {
  const customizeButtons = buttons?.map((button) => ({
    ...button,
    styles: {
      ...button?.styles,
      self: css`
        min-width: 140px;
        max-width: 140px;
        align-items: flex-start;
        justify-content: start;
        padding-top: 1rem;
        padding-bottom: 2.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        ${button?.styles?.self}
      `,
    },
  }));
  return (
    <Dialog
      closable={closable}
      isOpen={isOpen}
      buttons={customizeButtons}
      icon={icon}
      title={title}
      onClick={onClick}
      onVisibilityChange={onVisibilityChange}
      onClosed={onClosed}
      subtitle={subtitle}
      styles={{
        ...styles,
        containerStyle: css`
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 500px;
          padding: 0px;
          border-radius: 0;
          justify-content: start;
          gap: 0;
          ${styles?.containerStyle}
        `,
        headerStyle: css`
          padding: 20px;
          flex-direction: row;
          padding-bottom: 8px;
          ${subtitle &&
          css`
            align-items: start;
            justify-content: start;
          `}
          ${styles?.headerStyle};
        `,
        textWrapperStyle: css`
          justify-content: start;
          align-items: start;
          gap: 6px;
          ${icon &&
          css`
            padding-left: 5px;
          `}
          ${styles?.textWrapperStyle};
        `,
        contentStyle: css`
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: 20px;
          min-height: 200px;
        `,
        titleStyle: css`
          font-size: 18px;
          font-weight: 500;
          text-align: start;
          ${styles?.titleStyle};
        `,
        subtitleStyle: css`
          font-size: 11px;
          text-align: start;
          color: #6b7280;
          ${styles?.subtitleStyle}
        `,
        buttonWrapperStyle: css`
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          gap: 0px;
          ${styles?.buttonWrapperStyle}
        `,
      }}
    >
      <Divider aria-label="modal-dialog-divider" />

      <Body aria-label="modal-dialog-content" $style={styles?.contentStyle}>
        {children}
      </Body>
    </Dialog>
  );
}

const Body = styled.div<{ $style?: CSSProp }>`
  height: 100%;
  width: 100%;
  padding-right: 5px;
  padding-left: 5px;
  display: flex;
  flex-direction: column;

  ${({ $style }) => $style}
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  border: 1px solid #3b82f6;
  margin-bottom: 25px;
`;

type ModalDialogConfig = Omit<
  ModalDialogProps,
  "isOpen" | "onVisibilityChange"
>;

let setConfigState: ((config: ModalDialogConfig | null) => void) | null = null;
let setDialogOpen: ((isOpen: boolean) => void) | null = null;

let mounted = false;
let root: ReturnType<typeof createRoot> | null = null;
let container: HTMLDivElement | null = null;

function ModalDialogProvider() {
  const [config, setConfig] = useState<ModalDialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  setConfigState = setConfig;
  setDialogOpen = setIsOpen;

  if (!config) return null;

  const closeDialog = () => {
    // Closes the dialog by first updating the visibility state,
    // then delaying config cleanup to allow the exit animation
    setIsOpen(false);
    setTimeout(() => {
      setConfig(null);
    }, 300);
  };

  return (
    <ModalDialog
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

function ensureProvider() {
  // If a container reference exists but is no longer attached to the DOM
  // reset all internal references so the provider can be recreated safely.
  if (container && !document.body.contains(container)) {
    root = null;
    container = null;
    mounted = false;
  }

  // If the provider is already mounted and valid, do nothing.
  // This ensures the modal system behaves as a singleton.
  if (mounted) return;

  container = document.createElement("div");
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(<ModalDialogProvider />);

  mounted = true;
}

const ModalDialogController = {
  show(config: ModalDialogConfig) {
    ensureProvider();
    setTimeout(() => {
      // Introduce a slight delay to ensure the component is fully mounted
      // before triggering the open state, preserving animation consistency.
      setConfigState?.(config);
      setDialogOpen?.(true);
    }, 50);
  },
  hide() {
    setConfigState?.(null);
  },
};

ModalDialog.show = ModalDialogController.show;
ModalDialog.hide = ModalDialogController.hide;

export { ModalDialog };
