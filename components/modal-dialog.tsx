"use client";

import { ModalDialogThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import {
  createDialogController,
  Dialog,
  DialogButton,
  DialogProps,
  DialogStyles,
} from "./dialog";
import styled, { css, CSSProp } from "styled-components";

export type ModalDialogProps = DialogProps;
export type ModalDialogStyles = DialogStyles;
export type ModalButton = DialogButton;

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
  const { currentTheme } = useTheme();
  const modalDialogTheme = currentTheme.modalDialog;

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
        text-align: start;
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
          color: ${modalDialogTheme?.subtitleColor};

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
      <Divider $theme={modalDialogTheme} aria-label="modal-dialog-divider" />

      <Body
        aria-label="modal-dialog-content"
        $theme={modalDialogTheme}
        $style={styles?.contentStyle}
      >
        {children}
      </Body>
    </Dialog>
  );
}

const Body = styled.div<{
  $style?: CSSProp;
  $theme?: ModalDialogThemeConfig;
}>`
  height: 100%;
  width: 100%;
  padding-right: 5px;
  padding-left: 5px;
  display: flex;
  flex-direction: column;
  color: ${({ $theme }) => $theme?.textColor};

  ${({ $style }) => $style}
`;

const Divider = styled.div<{
  $theme?: ModalDialogThemeConfig;
}>`
  height: 1px;
  width: 100%;
  margin-bottom: 25px;
  border: 1px solid ${({ $theme }) => $theme?.dividerColor ?? "#3b82f6"};
`;

const ModalDialogController = createDialogController(ModalDialog);

ModalDialog.show = ModalDialogController.show;
ModalDialog.hide = ModalDialogController.hide;

export { ModalDialog };
