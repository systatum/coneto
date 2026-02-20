"use client";

import { ReactNode } from "react";
import { Dialog } from "./dialog";
import { Button, ButtonStylesProps, ButtonVariants } from "./button";
import styled, { css, CSSProp } from "styled-components";

export interface ModalButtonProps extends Pick<ButtonVariants, "variant"> {
  id: string;
  caption: string;
  isLoading?: boolean;
  disabled?: boolean;
  styles?: ButtonStylesProps;
}

export interface ModalDialogProps {
  isOpen: boolean;
  onVisibilityChange: (isOpen: boolean) => void;
  title: string;
  subTitle?: string;
  hasCloseButton?: boolean;
  buttons?: ModalButtonProps[];
  children?: ReactNode;
  onClick?: (args: { id: string; closeDialog: () => void }) => void;
  styles?: ModalDialogStylesProps;
}

export interface ModalDialogStylesProps {
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

function ModalDialog({
  onVisibilityChange,
  isOpen,
  hasCloseButton,
  subTitle,
  title,
  buttons,
  children,
  styles,
  onClick,
}: ModalDialogProps) {
  const closeDialog = () => onVisibilityChange(false);

  return (
    <Dialog isOpen={isOpen} onVisibilityChange={onVisibilityChange}>
      <Dialog.Content
        styles={{
          self: css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            max-width: 500px;
            padding: 0px;
            border-radius: 0;
            ${styles?.containerStyle}
          `,
        }}
        hideClose={!hasCloseButton}
      >
        <Container>
          <Header
            aria-label="modal-dialog-text-wrapper"
            $style={styles?.textWrapperStyle}
          >
            <Dialog.Title
              ariaLabel="modal-dialog-title"
              style={css`
                font-size: 16px;
                font-weight: 500;
                ${styles?.titleStyle}
              `}
            >
              {title}
            </Dialog.Title>
            <Subtitle
              aria-label="modal-dialog-subtitle"
              $style={styles?.subtitleStyle}
            >
              {subTitle}
            </Subtitle>
          </Header>

          <Divider />

          <Body aria-label="modal-dialog-content" $style={styles?.contentStyle}>
            {children}
          </Body>
        </Container>

        <Footer>
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
                  min-width: 140px;
                  max-width: 140px;
                  align-items: flex-start;
                  justify-content: start;
                  padding-top: 1rem;
                  padding-bottom: 2.5rem;
                  padding-left: 1rem;
                  padding-right: 1rem;
                  ${props?.styles?.self}
                `,
              }}
            >
              {props.caption}
            </Button>
          ))}
        </Footer>
      </Dialog.Content>
    </Dialog>
  );
}

const Container = styled.div`
  padding: 0.75rem 1rem;
`;

const Header = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.5rem;
  padding-bottom: 1rem;
  padding-right: 30px;

  ${({ $style }) => $style}
`;

const Subtitle = styled.h3<{ $style?: CSSProp }>`
  font-size: 11px;
  color: #6b7280;
  text-align: justify;

  ${({ $style }) => $style}
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  border: 1px solid #3b82f6;
`;

const Body = styled.div<{ $style?: CSSProp }>`
  height: 100%;
  min-height: 250px;
  font-size: 12px;
  width: 100%;
  padding-top: 0.5rem;

  ${({ $style }) => $style}
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`;

export { ModalDialog };
