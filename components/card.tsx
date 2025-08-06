import { RiCloseLine } from "@remixicon/react";
import { ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";

export interface CardProps {
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  radius?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  padding?:
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10";
  children: ReactNode;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  headerStyle?: CSSProp;
  footerStyle?: CSSProp;
  title?: string;
  rightSideActions?: ReactNode[];
  leftSideActions?: ReactNode[];
  closable?: boolean;
  onCloseRequest?: () => void;
}

const SHADOW_MAP = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
};

const RADIUS_MAP = {
  none: "0px",
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

const PADDING_MAP = {
  none: "0rem",
  sm: "0.25rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
};

function Card({
  children,
  shadow = "sm",
  radius = "xs",
  padding = "sm",
  containerStyle,
  contentStyle,
  headerStyle,
  footerStyle,
  title,
  leftSideActions,
  rightSideActions,
  onCloseRequest,
  closable = false,
}: CardProps) {
  return (
    <CardContainer
      $shadow={shadow}
      $radius={radius}
      $padding={padding}
      $containerStyle={containerStyle}
    >
      {title && <Header $headerStyle={headerStyle}>{title}</Header>}

      <Contain $contentStyle={contentStyle}>{children}</Contain>

      {(leftSideActions || rightSideActions) && (
        <Footer $footerStyle={footerStyle}>
          <ActionGroup>
            {leftSideActions &&
              leftSideActions.map((action, i) => <span key={i}>{action}</span>)}
          </ActionGroup>
          <ActionGroup>
            {rightSideActions &&
              rightSideActions.map((action, i) => (
                <span key={i}>{action}</span>
              ))}
          </ActionGroup>
        </Footer>
      )}

      {closable && (
        <CloseIcon
          role="button"
          aria-label="Close"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            onCloseRequest?.();
          }}
        />
      )}
    </CardContainer>
  );
}

const CardContainer = styled.div<{
  $shadow: CardProps["shadow"];
  $radius: CardProps["radius"];
  $padding: CardProps["padding"];
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  position: relative;
  width: fit-content;
  ${({ $shadow, $radius, $padding }) => css`
    box-shadow: ${SHADOW_MAP[$shadow!]};
    border-radius: ${RADIUS_MAP[$radius!]};
    padding: ${PADDING_MAP[$padding!]};
  `}
  ${({ $containerStyle }) => $containerStyle}
`;

const Header = styled.span<{
  $headerStyle?: CSSProp;
}>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-bottom: 1px solid #d1d5db;
  ${({ $headerStyle }) => $headerStyle}
`;

const Contain = styled.span<{
  $contentStyle?: CSSProp;
}>`
  ${({ $contentStyle }) => $contentStyle}
`;

const Footer = styled.div<{
  $footerStyle?: CSSProp;
}>`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  border-top: 1px solid #d1d5db;
  ${({ $footerStyle }) => $footerStyle}
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CloseIcon = styled(RiCloseLine)`
  position: absolute;
  top: 1rem;
  right: 0.75rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #d1d5db;
  }
`;

export { Card };
