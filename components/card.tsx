import {
  PADDING_MAP,
  RADIUS_MAP,
  SHADOW_MAP,
} from "./../constants/global-style";
import { RiCloseLine } from "@remixicon/react";
import { HTMLAttributes, ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";
import { ActionButton, ActionButtonProps } from "./action-button";
import { Toggle } from "./toggle";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./../theme/provider";
import { CardThemeConfig } from "./../theme";

export const CardShadow = {
  None: "none",
  Small: "sm",
  Medium: "md",
  Large: "lg",
  ExtraLarge: "xl",
  ExtraExtraLarge: "2xl",
} as const;

export type CardShadow = (typeof CardShadow)[keyof typeof CardShadow];

export const CardBorderRadius = {
  None: "none",
  ExtraSmall: "xs",
  Small: "sm",
  Medium: "md",
  Large: "lg",
  ExtraLarge: "xl",
  ExtraExtraLarge: "2xl",
  ExtraExtraExtraLarge: "3xl",
  Full: "full",
} as const;

export type CardBorderRadius =
  (typeof CardBorderRadius)[keyof typeof CardBorderRadius];

export const CardPadding = {
  None: "none",
  Small: "sm",
  Medium: "md",
  Large: "lg",
  ExtraLarge: "xl",
  ExtraExtraLarge: "2xl",
  ExtraExtraExtraLarge: "3xl",
} as const;

export type CardPadding = (typeof CardPadding)[keyof typeof CardPadding];

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style"> {
  shadow?: CardShadow;
  radius?: CardBorderRadius;
  padding?: CardPadding;
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  footerContent?: ReactNode;
  closable?: boolean;
  onCloseRequest?: () => void;
  headerActions?: ActionButtonProps[];
  styles?: CardStyles;
  toggleable?: boolean;
  onToggleChange?: (isOpen?: boolean) => void;
  open?: boolean;
}

export interface CardStyles {
  textContainerStyle?: CSSProp;
  actionContainerStyle?: CSSProp;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  headerStyle?: CSSProp;
  footerStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

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
  toggleable,
  onToggleChange,
  open = true,
  ...props
}: CardProps) {
  const { currentTheme } = useTheme();
  const cardTheme = currentTheme.card;

  const filteredHeaderActions = Array.isArray(headerActions)
    ? headerActions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredHeaderActions.length > 0;

  return (
    <CardContainer
      {...props}
      $shadow={shadow}
      $radius={radius}
      $padding={padding}
      $containerStyle={styles?.containerStyle}
      $theme={cardTheme}
    >
      {(title || subtitle || headerActions) && (
        <Header $theme={cardTheme} $headerStyle={styles?.headerStyle}>
          {(title || subtitle) && (
            <HeaderTextContainer $style={styles?.textContainerStyle}>
              {title && (
                <HeaderTitle $style={styles?.titleStyle} $theme={cardTheme}>
                  {title}
                </HeaderTitle>
              )}
              {subtitle && (
                <HeaderSubtitle
                  $style={styles?.subtitleStyle}
                  $theme={cardTheme}
                >
                  {subtitle}
                </HeaderSubtitle>
              )}
            </HeaderTextContainer>
          )}
          {(headerActions || toggleable) && (
            <HeaderActionGroup $style={styles?.actionContainerStyle}>
              {hasActions &&
                filteredHeaderActions.map((props, index) => (
                  <ActionButton key={index} {...props} />
                ))}
              {toggleable && (
                <Toggle
                  styles={{
                    bodyStyle: css`
                      min-height: 0;
                    `,
                  }}
                  name="card-toggle"
                  checked={open}
                  onChange={(e) => onToggleChange(e.target.checked)}
                />
              )}
            </HeaderActionGroup>
          )}
        </Header>
      )}

      <AnimatePresence initial={false}>
        {open && children && (
          <Contain
            key="card-content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            aria-label="card-content"
            $style={styles?.contentStyle}
            variants={EXPAND_COLLAPSE_VARIANTS}
            transition={EXPAND_COLLAPSE_TRANSITION}
          >
            {children}
          </Contain>
        )}

        {open && footerContent && (
          <Footer
            key="card-footer"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            aria-label="card-footer"
            $footerStyle={styles?.footerStyle}
            variants={EXPAND_COLLAPSE_VARIANTS}
            transition={EXPAND_COLLAPSE_TRANSITION}
          >
            {footerContent}
          </Footer>
        )}
      </AnimatePresence>

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

const EXPAND_COLLAPSE_VARIANTS = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.8 },
    },
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: "easeInOut" },
      opacity: { duration: 0.15 },
    },
  },
} as const;

const EXPAND_COLLAPSE_TRANSITION = {
  duration: 0.3,
  ease: "easeInOut",
} as const;

const CardContainer = styled.div<{
  $shadow: CardProps["shadow"];
  $radius: CardProps["radius"];
  $padding: CardProps["padding"];
  $containerStyle?: CSSProp;
  $theme: CardThemeConfig;
}>`
  display: flex;
  flex-direction: column;
  background: ${({ $theme }) => $theme?.backgroundColor ?? "#ffffff"};
  border: 1px solid ${({ $theme }) => $theme?.borderColor ?? "#d1d5db"};
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
  $theme?: CardThemeConfig;
}>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ $theme }) => $theme?.dividerColor ?? "#d1d5db"};

  ${({ $headerStyle }) => $headerStyle}
`;

const HeaderTitle = styled.span<{
  $theme: CardThemeConfig;
  $style?: CSSProp;
}>`
  font-size: 1rem;
  color: ${({ $theme }) => $theme?.titleColor ?? "#000000"};

  ${({ $style }) => $style}
`;

const HeaderSubtitle = styled.span<{
  $theme: CardThemeConfig;
  $style?: CSSProp;
}>`
  font-size: 0.8rem;
  font-weight: 400;
  color: ${({ $theme }) => $theme?.subtitleColor ?? "#6b7280"};

  ${({ $style }) => $style}
`;

const Contain = styled(motion.div)<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
`;

const Footer = styled(motion.div)<{
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

const HeaderActionGroup = styled.div<{ $style?: CSSProp }>`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-direction: row;
  align-items: center;

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
