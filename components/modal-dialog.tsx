"use client";

import { createRoot } from "react-dom/client";
import { Dialog, DialogProps, DialogStylesProps } from "./dialog";
import styled, { css } from "styled-components";
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

          ${styles?.contentStyle};
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
      <Divider />

      {children}
    </Dialog>
  );
}

const Divider = styled.div`
  height: 1px;
  width: 100%;
  border: 1px solid #3b82f6;
  margin-bottom: 8px;
`;

type ModalDialogConfig = Omit<
  ModalDialogProps,
  "isOpen" | "onVisibilityChange"
>;

let setDialogOpen: ((isOpen: boolean) => void) | null = null;

let mounted = false;

function ModalDialogProvider(config: ModalDialogConfig) {
  const [isOpen, setIsOpen] = useState(false);

  setDialogOpen = setIsOpen;

  const closeDialog = () => {
    setIsOpen(false);
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

function ensureProvider(config: ModalDialogConfig) {
  if (mounted) return;

  const el = document.createElement("div");
  document.body.appendChild(el);

  createRoot(el).render(<ModalDialogProvider {...config} />);
  mounted = true;
}

const ModalDialogController = {
  show(config: ModalDialogConfig) {
    ensureProvider(config);
    // Introduce a slight delay to ensure the component is fully mounted
    // before triggering the open state, preserving animation consistency.
    setTimeout(() => {
      setDialogOpen?.(true);
    }, 100);
  },
  hide() {
    setDialogOpen?.(false);
  },
};

ModalDialog.show = ModalDialogController.show;
ModalDialog.hide = ModalDialogController.hide;

export { ModalDialog };
