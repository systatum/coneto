"use client";

import { ReactNode } from "react";
import { Dialog } from "./dialog";
import { Button, ButtonVariants } from "./button";
import styled, { css, CSSProp } from "styled-components";

export interface ModalButtonProps extends Pick<ButtonVariants, "variant"> {
  id: string;
  caption: string;
  isLoading?: boolean;
  disabled?: boolean;
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
          style: css`
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
          <Header>
            <Dialog.Title
              style={{
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              {title}
            </Dialog.Title>
            <Subtitle>{subTitle}</Subtitle>
          </Header>

          <Divider />

          <Body aria-label="modal-dialog-content" $style={styles?.contentStyle}>
            {children}
          </Body>
        </Container>

        <Footer>
          {buttons.map((data, index) => (
            <StyledButton
              key={index}
              isLoading={data.isLoading}
              disabled={data.disabled}
              variant={data.variant}
              onClick={() => onClick?.({ id: data.id, closeDialog })}
            >
              {data.caption}
            </StyledButton>
          ))}
        </Footer>
      </Dialog.Content>
    </Dialog>
  );
}

const Container = styled.div`
  padding: 0.75rem 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0.5rem;
  padding-bottom: 1rem;
`;

const Subtitle = styled.h3`
  font-size: 11px;
  color: #6b7280;
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

const StyledButton = styled(Button)`
  width: 140px;
  min-width: 100px;
  align-items: flex-start;
  padding-top: 1rem;
  padding-right: 5rem;
  padding-bottom: 2.5rem;
  padding-left: 1rem;
  display: flex;
`;

export { ModalDialog };
