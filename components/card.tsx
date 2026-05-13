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
import { applyClassName } from "./../constants/classname";
import { Title, TitleSection } from "./title";

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
  id,
  className,
  ...props
}: CardProps) {
  const { currentTheme } = useTheme();
  const cardTheme = currentTheme.card;

  const filteredHeaderActions = Array.isArray(headerActions)
    ? headerActions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredHeaderActions.length > 0;

  const renderHeaderActions: TitleSection[] = [
    {
      type: "custom",
      render: hasActions
        ? filteredHeaderActions.map((action, index) => (
            <ActionButton key={index} {...action} />
          ))
        : undefined,
    },
    ...(toggleable
      ? [
          {
            type: "custom" as const,
            render: (
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
            ),
          },
        ]
      : []),
  ];

  return (
    <CardContainer
      {...props}
      $shadow={shadow}
      $radius={radius}
      $padding={padding}
      id={id}
      className={applyClassName("card", className)}
      $containerStyle={styles?.containerStyle}
      $theme={cardTheme}
    >
      {(title || subtitle || headerActions) && (
        <Title
          text={title}
          size="sm"
          subtitle={subtitle}
          styles={{
            containerStyle: css`
              align-items: center;
              padding: 0.75rem 1.5rem;
              border-bottom: 1px solid ${cardTheme?.dividerColor ?? "#d1d5db"};

              ${styles?.headerStyle}
            `,
            rightSectionStyle: css`
              align-items: center;
              ${styles?.actionContainerStyle}
            `,
            titleStyle: css`
              font-size: 16px;
              font-weight: 400;
              line-height: 18px;
              color: ${cardTheme?.titleColor ?? "#000000"};
              ${styles?.titleStyle}
            `,
            subtitleStyle: css`
              font-size: 14px;
              color: ${cardTheme?.subtitleColor ?? "#6b7280"};
              ${styles?.subtitleStyle}
            `,
            textContainerStyle: css`
              gap: 2px;
              ${styles?.textContainerStyle}
            `,
          }}
          rightSection={renderHeaderActions}
        />
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
