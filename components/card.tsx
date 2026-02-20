import {
  PADDING_MAP,
  RADIUS_MAP,
  SHADOW_MAP,
} from "./../constants/global-style";
import { RiCloseLine } from "@remixicon/react";
import { HTMLAttributes, ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";
import { ActionButton, ActionButtonProps } from "./action-button";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style"> {
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
  title?: ReactNode;
  subtitle?: ReactNode;
  footerContent?: ReactNode;
  closable?: boolean;
  onCloseRequest?: () => void;
  headerActions?: CardActionsProps[];
  styles?: CardStylesProps;
}

export interface CardStylesProps {
  textContainerStyle?: CSSProp;
  actionContainerStyle?: CSSProp;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  headerStyle?: CSSProp;
  footerStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

export type CardActionsProps = ActionButtonProps;

function Card({
  children,
  shadow = "sm",
  radius = "xs",
  padding = "sm",
  styles,
  title,
  subtitle,
  footerContent,
  onCloseRequest,
  headerActions,
  closable = false,
  ...props
}: CardProps) {
  return (
    <CardContainer
      {...props}
      $shadow={shadow}
      $radius={radius}
      $padding={padding}
      $containerStyle={styles?.containerStyle}
    >
      {(title || subtitle || headerActions) && (
        <Header $headerStyle={styles?.headerStyle}>
          {(title || subtitle) && (
            <HeaderTextContainer $style={styles?.textContainerStyle}>
              {title && (
                <HeaderTitle $style={styles?.titleStyle}>{title}</HeaderTitle>
              )}
              {subtitle && (
                <HeaderSubitle $style={styles?.subtitleStyle}>
                  {subtitle}
                </HeaderSubitle>
              )}
            </HeaderTextContainer>
          )}
          {headerActions && (
            <ActionGroup $style={styles?.actionContainerStyle}>
              {headerActions.map((props, index) => (
                <ActionButton key={index} {...props} />
              ))}
            </ActionGroup>
          )}
        </Header>
      )}

      <Contain $style={styles?.contentStyle}>{children}</Contain>

      {footerContent && (
        <Footer $footerStyle={styles?.footerStyle}>{footerContent}</Footer>
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

const Header = styled.div<{
  $headerStyle?: CSSProp;
}>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ $headerStyle }) => $headerStyle}
`;

const HeaderTitle = styled.span<{ $style?: CSSProp }>`
  font-size: 1rem;
  ${({ $style }) => $style}
`;

const HeaderSubitle = styled.span<{ $style?: CSSProp }>`
  font-size: 0.8rem;
  font-weight: 400;
  color: #8b8e92;

  ${({ $style }) => $style}
`;

const Contain = styled.span<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
`;

const Footer = styled.div<{
  $footerStyle?: CSSProp;
}>`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;

  ${({ $footerStyle }) => $footerStyle}
`;

const HeaderTextContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ $style }) => $style}
`;

const ActionGroup = styled.div<{ $style?: CSSProp }>`
  display: flex;
  gap: 0.5rem;
  ${({ $style }) => $style}
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

Card.Action = ActionButton;

export { Card };
