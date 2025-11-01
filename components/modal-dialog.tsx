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
  open: boolean;
  onVisibilityChange: (data: boolean) => void;
  title: string;
  subTitle?: string;
  hasCloseButton?: boolean;
  buttons?: ModalButtonProps[];
  style?: CSSProp;
  children?: ReactNode;
  onClick?: (args: { id: string; closeDialog: () => void }) => void;
}

function ModalDialog({
  onVisibilityChange,
  open,
  hasCloseButton,
  subTitle,
  title,
  buttons,
  children,
  style,
  onClick,
}: ModalDialogProps) {
  const closeDialog = () => onVisibilityChange(false);

  return (
    <Dialog open={open} onVisibilityChange={onVisibilityChange}>
      <Dialog.Content
        style={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          max-width: 500px;
          padding: 0px;
          border-radius: 0;
          ${style}
        `}
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

          <Body>{children}</Body>
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

const Body = styled.div`
  height: 100%;
  min-height: 250px;
  font-size: 12px;
  width: 100%;
  padding-top: 0.5rem;
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
