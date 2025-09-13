import styled, { css, CSSProp } from "styled-components";
import {
  RemixiconComponentType,
  RiCloseLine,
  RiInformation2Fill,
} from "@remixicon/react";
import { ReactNode } from "react";
import { Button } from "./button";

interface MessageboxProps {
  variant?: "primary" | "success" | "danger" | "warning";
  title: string;
  icon?: RemixiconComponentType;
  children: ReactNode;
  actionLinks?: ActionLinkProps[];
  closable?: boolean;
  onCloseRequest?: () => void;
  style?: CSSProp;
}

interface ActionLinkProps {
  caption: string;
  onClick?: () => void;
  href?: string;
  type: "button" | "link";
}

const VARIATION_STYLES = {
  primary: {
    container: "#e7f2fc",
    text: "#2a63b4",
    active: "#1f4a89",
  },
  success: {
    container: "#e9f3e8",
    text: "#43843d",
    active: "#30602c",
  },
  danger: {
    container: "#f6e7e7",
    text: "#b92c25",
    active: "#891f1a",
  },
  warning: {
    container: "#fbf0e4",
    text: "#9e5b20",
    active: "#734418",
  },
} as const;

function Messagebox({
  variant = "primary",
  title,
  icon: Icon = RiInformation2Fill,
  children,
  actionLinks,
  onCloseRequest,
  closable = false,
  style,
}: MessageboxProps) {
  return (
    <Wrapper $variant={variant} $style={style}>
      <BorderAccent $variant={variant} />
      {Icon && (
        <IconWrapper $variant={variant}>
          <Icon size={16} />
        </IconWrapper>
      )}
      <Content>
        <span
          style={{
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: "14px",
          }}
        >
          {children}
        </span>
        {actionLinks && (
          <ActionList>
            {actionLinks.map((action, index) =>
              action.type === "button" ? (
                <ActionItem
                  key={index}
                  onClick={action.onClick}
                  $variant={variant}
                >
                  {action.caption}
                </ActionItem>
              ) : (
                <ActionLink
                  key={index}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  $variant={variant}
                >
                  {action.caption}
                </ActionLink>
              )
            )}
          </ActionList>
        )}
      </Content>
      {closable && (
        <Button
          variant="transparent"
          containerStyle={css`
            position: absolute;
            top: 1rem;
            right: 0.5rem;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 2px;
            padding: 2px;
            width: fit-content;
            height: fit-content;
          `}
          buttonStyle={css`
            width: fit-content;
            height: fit-content;
            padding: 2px;
            color: ${VARIATION_STYLES[variant].text};
          `}
        >
          <RiCloseLine
            role="button"
            aria-label="closable-request"
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              onCloseRequest?.();
            }}
          />
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $style?: CSSProp;
  $variant: keyof typeof VARIATION_STYLES;
}>`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  padding: 11px 12px 20px;
  border-top-width: 1px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  height: 100%;

  background-color: ${({ $variant }) => VARIATION_STYLES[$variant].container};
  color: ${({ $variant }) => VARIATION_STYLES[$variant].text};
  ${({ $style }) => $style};
`;

const BorderAccent = styled.div<{
  $variant: keyof typeof VARIATION_STYLES;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-top: 2px solid ${({ $variant }) => VARIATION_STYLES[$variant].text};
`;

const IconWrapper = styled.div<{
  $variant: keyof typeof VARIATION_STYLES;
}>`
  margin-top: 4px;
  color: ${({ $variant }) => VARIATION_STYLES[$variant].text};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span.text {
    font-size: 0.875rem;
  }

  span.title {
    font-weight: 600;
  }
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ActionItem = styled.button<{
  $variant: keyof typeof VARIATION_STYLES;
}>`
  cursor: pointer;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $variant }) => VARIATION_STYLES[$variant].text};
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    color: ${({ $variant }) => VARIATION_STYLES[$variant].active};
  }
`;

const ActionLink = styled.a<{
  $variant: keyof typeof VARIATION_STYLES;
}>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $variant }) => VARIATION_STYLES[$variant].text};
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    color: ${({ $variant }) => VARIATION_STYLES[$variant].active};
  }
`;

export { Messagebox };
