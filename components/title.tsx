import { ElementType, ReactNode } from "react";
import { Figure, FigureProps } from "./figure";
import styled, { css, CSSProp } from "styled-components";
import { BodyThemeConfig, useTheme } from "./../theme";
import { applyClassName } from "./../constants/classname";
import { darkenColor, lightenColor } from "./../lib/color";
import { CapsuleProps } from "./capsule";
import { BaseAction } from "./../constants/action";

export const TitleSize = {
  ExtraSmall: "xs",
  Small: "sm",
  Medium: "md",
  Large: "lg",
} as const;

export type TitleSize = (typeof TitleSize)[keyof typeof TitleSize];

export interface TitleProps {
  text?: ReactNode;
  pretitle?: ReactNode;
  subtitle?: ReactNode;
  icon?: FigureProps;
  className?: string;
  id?: string;
  size?: TitleSize;
  styles?: TitleStyles;
  //   section
  leftSection?: TitleSection[];
  centerSection?: TitleSection[];
  rightSection?: TitleSection[];
}

export interface TitleSection extends BaseAction {
  type?: "actions" | "capsule" | "custom";
  capsule?: CapsuleProps;
  maxShown?: number;
  render?: ReactNode;
}

export interface TitleStyles {
  containerStyle?: CSSProp;
  textStyle?: CSSProp;
  pretitleStyle?: CSSProp;
  subtitleStyle?: CSSProp;

  leftSectionStyle?: CSSProp;
  centerSectionStyle?: CSSProp;
  rightSectionStyle?: CSSProp;
}

interface TextVariant {
  as?: ElementType;
  ariaLabel: string;
  style: CSSProp;
  size: typeof TITLE_SIZE;
  customStyle?: CSSProp;
  content?: ReactNode;
}

function Title({
  text,
  pretitle,
  subtitle,
  icon,
  size = "md",
  className,
  id,
  styles,
}: TitleProps) {
  const { currentTheme, mode } = useTheme();
  const bodyTheme = currentTheme.body;

  const TEXT_VARIANTS: Record<string, TextVariant> = {
    pretitle: {
      as: "span",
      ariaLabel: "title-pretitle",
      style: css`
        font-weight: 400;
        opacity: 0.7;
        letter-spacing: 0.08em;
      `,
      size: PRETITLE_SIZE,
      customStyle: styles?.pretitleStyle,
      content: pretitle,
    },

    title: {
      as: "h2",
      ariaLabel: "main-title",
      style: css`
        font-weight: 600;
      `,
      size: TITLE_SIZE,
      customStyle: styles?.textStyle,
      content: text,
    },

    subtitle: {
      as: "p",
      ariaLabel: "title-subtitle",
      style: css`
        font-weight: 400;
        opacity: 0.8;
      `,
      size: SUBTITLE_SIZE,
      customStyle: styles?.subtitleStyle,
      content: subtitle,
    },
  };

  return (
    <TitleContainer
      id={id}
      className={applyClassName("title-container", className)}
      $style={styles?.containerStyle}
    >
      <TextContainer aria-label="title-text-container">
        {icon &&
          (() => {
            const iconProps: FigureProps = {
              ...icon,
              size: icon?.size ?? 28,
              styles: {
                self: css`
                  min-width: ${icon?.size ? `${icon?.size * 1.5}px` : `42px`};
                  min-height: ${icon?.size ? `${icon?.size * 1.5}px` : `42px`};
                  background-color: ${mode === "light"
                    ? lightenColor(icon?.color ?? bodyTheme?.textColor, 0.9)
                    : darkenColor(icon?.color ?? bodyTheme?.textColor, 0.8)};
                  border-radius: 99999px;
                  justify-content: center;
                  align-items: center;
                  display: flex;
                  overflow: hidden;
                  ${icon?.styles?.self}
                `,
              },
            };
            return <Figure {...iconProps} aria-label="title-icon" />;
          })()}

        {(pretitle || text || subtitle) && (
          <TextWrapper aria-label="title-text-wrapper">
            {Object?.values(TEXT_VARIANTS)?.map(
              ({
                as,
                ariaLabel,
                style,
                size: sizeStyle,
                customStyle,
                content,
              }) =>
                content && (
                  <BaseText
                    key={ariaLabel}
                    as={as}
                    aria-label={ariaLabel}
                    $theme={bodyTheme}
                    $size={size}
                    $style={css`
                      ${style};
                      ${sizeStyle[size]};
                      ${customStyle};
                    `}
                  >
                    {content}
                  </BaseText>
                )
            )}
          </TextWrapper>
        )}
      </TextContainer>
    </TitleContainer>
  );
}

const TitleContainer = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: row;
  align-items: start;

  ${({ $style }) => $style}
`;

const TextContainer = styled(TitleContainer)`
  flex-direction: column;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  ${({ $style }) => $style}
`;

const BaseText = styled.div<{
  $size: TitleSize;
  $theme?: BodyThemeConfig;
  $style: CSSProp;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  color: ${({ $theme }) => $theme?.textColor || "#111"};

  ${({ $size }) => TITLE_SIZE[$size]}

  ${({ $style }) => $style}
`;

const TITLE_SIZE = {
  [TitleSize.ExtraSmall]: css`
    font-size: 14px;
    line-height: 20px;
  `,
  [TitleSize.Small]: css`
    font-size: 18px;
    line-height: 28px;
  `,
  [TitleSize.Medium]: css`
    font-size: 24px;
    line-height: 32px;
  `,
  [TitleSize.Large]: css`
    font-size: 32px;
    line-height: 40px;
  `,
};

const SUBTITLE_SIZE = {
  [TitleSize.ExtraSmall]: TITLE_SIZE[TitleSize.ExtraSmall],
  [TitleSize.Small]: TITLE_SIZE[TitleSize.ExtraSmall],
  [TitleSize.Medium]: TITLE_SIZE[TitleSize.Small],
  [TitleSize.Large]: TITLE_SIZE[TitleSize.Medium],
};

const PRETITLE_SIZE = {
  [TitleSize.ExtraSmall]: css`
    font-size: 12px;
    line-height: 16px;
  `,
  [TitleSize.Small]: TITLE_SIZE[TitleSize.ExtraSmall],
  [TitleSize.Medium]: TITLE_SIZE[TitleSize.ExtraSmall],
  [TitleSize.Large]: TITLE_SIZE[TitleSize.Small],
};

export { Title };
