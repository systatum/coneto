"use client";

import { Dialog, DialogProps } from "./dialog";
import styled, { css } from "styled-components";

export type ModalDialogProps = DialogProps;

function ModalDialog({
  onVisibilityChange,
  isOpen,
  subtitle,
  title,
  buttons,
  children,
  styles,
  onClick,
  closable = true,
  icon,
}: ModalDialogProps) {
  const customizeButtons = buttons.map((button) => ({
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
          align-items: center;
          justify-content: center;
          padding-bottom: 8px;
          ${styles?.headerStyle};
        `,
        textWrapperStyle: css`
          justify-content: start;
          align-items: start;
          gap: 6px;
          ${styles?.textWrapperStyle};
        `,
        contentStyle: css`
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: 20px;
          ${styles?.contentStyle};
        `,
        titleStyle: css`
          font-size: 16px;
          font-weight: 500;
          text-align: start;
          ${styles?.titleStyle};
        `,
        subtitleStyle: css`
          font-size: 11px;
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

export { ModalDialog };
