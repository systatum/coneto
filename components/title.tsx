import { ElementType, Fragment, ReactNode } from "react";
import { Figure, FigureProps } from "./figure";
import styled, { css, CSSProp } from "styled-components";
import { TitleThemeConfig, useTheme } from "./../theme";
import { applyClassName } from "./../constants/classname";
import { darkenColor, lightenColor } from "./../lib/color";
import { Capsule, CapsuleProps } from "./capsule";
import { Button, ButtonStyles, ButtonVariant } from "./button";
import { BaseAction } from "./../constants/action";

export const TitleSize = {
  Small: "sm",
  Medium: "md",
  Large: "lg",
} as const;

export type TitleSize = (typeof TitleSize)[keyof typeof TitleSize];

export interface TitleProps extends BaseTitleProps {
  size?: TitleSize;
}

interface BaseTitleProps {
  text?: ReactNode;
  pretitle?: ReactNode;
  subtitle?: ReactNode;
  icon?: FigureProps;
  className?: string;
  id?: string;
  styles?: TitleStyles;
  leftSection?: TitleSection[];
  centerSection?: TitleSection[];
  rightSection?: TitleSection[];
}

export interface TitleStyles {
  containerStyle?: CSSProp;

  textContainerStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  titleStyle?: CSSProp;
  pretitleStyle?: CSSProp;
  subtitleStyle?: CSSProp;

  leftSectionStyle?: CSSProp;
  centerSectionStyle?: CSSProp;
  rightSectionStyle?: CSSProp;
}

function Title({
  size,
  text,
  pretitle,
  subtitle,
  icon,
  className,
  id,
  styles,
  leftSection,
  centerSection,
  rightSection,
}: TitleProps) {
  const isLarge = size === "lg";

  const textStyles: BaseAllTextStyles = {
    textContainerStyle: css`
      flex-direction: row;
      align-items: start;
      ${size === "lg" &&
      leftSection &&
      css`
        padding-left: 8px;
      `};
      ${styles?.textContainerStyle}
    `,
    titleStyle: styles?.titleStyle,
    pretitleStyle: styles?.pretitleStyle,
    subtitleStyle: styles?.subtitleStyle,
    textWrapperStyle: styles?.textWrapperStyle,
  };

  const hasText = text || subtitle || pretitle || icon;
  const hasSections = leftSection || centerSection || rightSection;

  return (
    <TitleContainer
      id={id}
      aria-label="title-container"
      className={applyClassName("title-container", className)}
      $style={css`
        flex-direction: ${isLarge ? "column" : "row"};
        ${styles?.containerStyle}
      `}
    >
      {isLarge ? (
        <>
          {hasSections && (
            <SectionWrapper aria-label="title-section-wrapper">
              <BaseTitleSection
                size={size}
                ariaLabel="title-left-section"
                sections={leftSection}
                style={styles?.leftSectionStyle}
              />

              <BaseTitleSection
                size={size}
                ariaLabel="title-center-section"
                sections={centerSection}
                style={styles?.centerSectionStyle}
              />

              <BaseTitleSection
                size={size}
                ariaLabel="title-right-section"
                sections={rightSection}
                style={styles?.rightSectionStyle}
              />
            </SectionWrapper>
          )}

          {hasText && (
            <BaseAllText
              text={text}
              pretitle={pretitle}
              subtitle={subtitle}
              icon={icon}
              size={size}
              styles={textStyles}
            />
          )}
        </>
      ) : (
        <>
          <BaseTitleSection
            size={size}
            ariaLabel="title-left-section"
            sections={leftSection}
            style={styles?.leftSectionStyle}
          />

          {hasText && (
            <BaseAllText
              text={text}
              pretitle={pretitle}
              subtitle={subtitle}
              icon={icon}
              size={size}
              styles={textStyles}
            />
          )}

          <BaseTitleSection
            size={size}
            ariaLabel="title-center-section"
            sections={centerSection}
            style={styles?.centerSectionStyle}
          />

          <BaseTitleSection
            size={size}
            ariaLabel="title-right-section"
            sections={rightSection}
            style={styles?.rightSectionStyle}
          />
        </>
      )}
    </TitleContainer>
  );
}

export type TitleSmallProps = BaseTitleProps;

function TitleSmall(props: TitleSmallProps) {
  return <Title {...props} size="sm" />;
}

export type TitleMediumProps = BaseTitleProps;

function TitleMedium(props: TitleMediumProps) {
  return <Title {...props} size="md" />;
}

export type TitleLargeProps = BaseTitleProps;

function TitleLarge(props: TitleLargeProps) {
  return <Title {...props} size="lg" />;
}

const TitleContainer = styled.div<{
  $style?: CSSProp;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;

  ${({ $style }) => $style};
`;

export interface TitleSection {
  type: "actions" | "capsule" | "custom";
  capsule?: CapsuleProps;
  actions?: TitleSectionAction[];
  render?: ReactNode;
  maxShown?: number;
  styles?: TitleSectionStyles;
}

export interface TitleSectionAction extends BaseAction {
  icon?: TitleSectionActionIcon;
  variant?: TitleSectionActionVariant;
  styles?: TitleSectionActionStyles;
  id?: string;
  className?: string;
  mobile?: boolean;
}

export type TitleSectionActionIcon = FigureProps;
export type TitleSectionActionVariant = Exclude<
  ButtonVariant,
  "outline-default" | "outline-success" | "outline-primary" | "outline-danger"
>;
export type TitleSectionActionStyles = ButtonStyles;

export interface TitleSectionStyles {
  toggleActionStyle?: CSSProp;
}

interface BaseTitleSectionProps {
  sections?: TitleSection[];
  style?: CSSProp;
  ariaLabel?: string;
  size?: TitleSize;
}

function BaseTitleSection({
  sections,
  style,
  ariaLabel,
  size,
}: BaseTitleSectionProps) {
  const { currentTheme } = useTheme();
  const titleTheme = currentTheme?.title;

  if (!sections?.length && size === "lg") {
    return <div aria-label="title-empty-section" />;
  } else if (!sections?.length) {
    return;
  }

  return (
    <Section aria-label={ariaLabel} $style={style}>
      {sections?.map((section, index) => {
        if (section.type === "capsule" && section.capsule) {
          return <Capsule key={index} {...section.capsule} />;
        }

        if (section.type === "custom" && section.render) {
          return <Fragment key={index}>{section.render}</Fragment>;
        }

        if (section.type === "actions" && section.actions) {
          const filteredActions = section.maxShown
            ? section.actions?.slice(0, section.maxShown)
            : section.actions;

          const resolvedIconSize = ICON_SIZE[size] * 0.8;

          const filteredActionsWithSize = filteredActions
            ?.filter((action) => !action?.hidden)
            ?.map((action) => ({
              ...action,
              icon: {
                ...action.icon,
                size: action?.icon?.size ?? resolvedIconSize,
              },
            }));

          return filteredActionsWithSize.map((action, actionIndex) => {
            const variant = action?.variant ?? "ghost";

            return (
              <Button
                key={actionIndex}
                {...action}
                aria-label="title-action"
                variant={variant}
                styles={{
                  self: css`
                    width: ${resolvedIconSize * 1.4}px;
                    height: ${resolvedIconSize * 1.4}px;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: ${variant === "ghost" &&
                    titleTheme?.icon?.backgroundColor};

                    ${section?.styles?.toggleActionStyle}
                    ${action.styles?.self}
                  `,
                  containerStyle: action.styles?.containerStyle,
                }}
                hoverBackgroundColor={
                  variant === "ghost" && titleTheme?.icon?.hoverBackgroundColor
                }
                activeBackgroundColor={
                  variant === "ghost" && titleTheme?.icon?.hoverBackgroundColor
                }
                icon={action?.icon}
              />
            );
          });
        }

        return null;
      })}
    </Section>
  );
}

const SectionWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  gap: 4px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ $style }) => $style}
`;

const Section = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  gap: 4px;
  width: fit-content;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;

  ${({ $style }) => $style}
`;

interface BaseAllTextProps
  extends Pick<TitleProps, "text" | "pretitle" | "subtitle" | "icon" | "size"> {
  styles?: BaseAllTextStyles;
}

interface BaseAllTextStyles
  extends Pick<
    TitleStyles,
    | "textContainerStyle"
    | "textWrapperStyle"
    | "titleStyle"
    | "pretitleStyle"
    | "subtitleStyle"
  > {}

interface TextVariant {
  as?: ElementType;
  ariaLabel: string;
  style: CSSProp;
  size: Record<TitleSize, ReturnType<typeof css>>;
  customStyle?: CSSProp;
  content?: ReactNode;
}

function BaseAllText({
  text,
  pretitle,
  subtitle,
  icon,
  size = "md",
  styles,
}: BaseAllTextProps) {
  const { currentTheme, mode } = useTheme();
  const titleTheme = currentTheme.title;

  const TEXT_VARIANTS: Record<string, TextVariant> = {
    pretitle: {
      as: "span",
      ariaLabel: "title-pretitle",
      style: css`
        font-weight: ${titleTheme?.pretitle?.fontWeight};
        opacity: ${titleTheme?.pretitle?.opacity};
        color: ${titleTheme?.pretitle?.textColor};
      `,
      size: PRETITLE_SIZE,
      customStyle: styles?.pretitleStyle,
      content: pretitle,
    },
    title: {
      as: "h2",
      ariaLabel: "title-title",
      style: css`
        font-weight: ${titleTheme?.title?.fontWeight};
        color: ${titleTheme?.title?.textColor};
      `,
      size: TITLE_SIZE,
      customStyle: styles?.titleStyle,
      content: text,
    },
    subtitle: {
      as: "p",
      ariaLabel: "title-subtitle",
      style: css`
        font-weight: ${titleTheme?.subtitle?.fontWeight};
        color: ${titleTheme?.subtitle?.textColor};
      `,
      size: SUBTITLE_SIZE,
      customStyle: styles?.subtitleStyle,
      content: subtitle,
    },
  };

  return (
    <TextContainer
      aria-label="title-text-container"
      $style={styles?.textContainerStyle}
    >
      {icon &&
        (() => {
          const resolvedIconSize = icon?.size ?? ICON_SIZE[size];

          const iconProps: FigureProps = {
            ...icon,
            size: resolvedIconSize,
            styles: {
              self: css`
                min-width: ${resolvedIconSize * 1.5}px;
                min-height: ${resolvedIconSize * 1.5}px;
                background-color: ${titleTheme?.icon?.backgroundColor ??
                (mode === "light"
                  ? lightenColor(icon?.color, 0.9)
                  : darkenColor(icon?.color, 0.8))};
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
        <TextWrapper
          aria-label="title-text-wrapper"
          $style={css`
            gap: ${size === "lg" ? "0px" : size === "md" ? "0px" : "1px"};
            ${styles?.textWrapperStyle};
          `}
        >
          {Object?.values(TEXT_VARIANTS)?.map(
            ({ as, ariaLabel, style, size: sizeStyle, customStyle, content }) =>
              content && (
                <BaseText
                  key={ariaLabel}
                  as={as}
                  aria-label={ariaLabel}
                  $theme={titleTheme}
                  $size={size}
                  $type={
                    ariaLabel.split("-")[1] as "pretitle" | "title" | "subtitle"
                  }
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
  );
}

const TextContainer = styled(TitleContainer)`
  flex-direction: column;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;

  ${({ $style }) => $style}
`;

const BaseText = styled.div<{
  $size: TitleSize;
  $theme?: TitleThemeConfig;
  $style: CSSProp;
  $type: "pretitle" | "title" | "subtitle";
}>`
  width: 100%;
  display: flex;
  align-items: center;

  color: ${({ $theme, $type }) => $theme?.[$type]?.textColor || "#111"};

  ${({ $size }) => TITLE_SIZE[$size]}

  ${({ $style }) => $style}
`;

const TITLE_SIZE: Record<TitleSize, ReturnType<typeof css>> = {
  [TitleSize.Small]: css`
    font-size: 17px;
  `,
  [TitleSize.Medium]: css`
    font-size: 24px;
  `,
  [TitleSize.Large]: css`
    font-size: 28px;
  `,
};

const SUBTITLE_SIZE: Record<TitleSize, ReturnType<typeof css>> = {
  [TitleSize.Small]: css`
    font-size: 14px;
  `,
  [TitleSize.Medium]: TITLE_SIZE[TitleSize.Small],
  [TitleSize.Large]: css`
    font-size: 16px;
    margin-bottom: 3px;
  `,
};

const PRETITLE_SIZE: Record<TitleSize, ReturnType<typeof css>> = {
  [TitleSize.Small]: css`
    font-size: 12px;
  `,
  [TitleSize.Medium]: SUBTITLE_SIZE[TitleSize.Small],
  [TitleSize.Large]: css`
    font-size: 15px;
  `,
};
const ICON_SIZE: Record<TitleSize, number> = {
  [TitleSize.Small]: 28,
  [TitleSize.Medium]: 36,
  [TitleSize.Large]: 40,
};

Title.Small = TitleSmall;
Title.Medium = TitleMedium;
Title.Large = TitleLarge;

export { Title };
