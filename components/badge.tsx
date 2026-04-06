import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, HTMLAttributes, MouseEvent } from "react";
import { strToColor } from "./../lib/code-color";
import { FigureProps } from "./figure";
import { Button, ButtonStylesProps } from "./button";
import { useTheme } from "./../theme/provider";
import { BadgeThemeConfiguration } from "theme";

export type BadgeVariantProps = null | "neutral" | "green" | "yellow" | "red";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  id?: string;
  metadata?: Record<string, unknown>;
  variant?: BadgeVariantProps;
  withCircle?: boolean;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
  circleColor?: string;
  onClick?: (
    e?: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>
  ) => void;
  actions?: BadgeActionProps[];
  styles?: BadgeStylesProps;
}

export interface BadgeStylesProps {
  self?: CSSProp;
  actionWrapperStyle?: CSSProp;
}

export interface BadgeActionProps {
  icon?: FigureProps;
  onClick?: (badge?: BadgeProps) => void;
  disabled?: boolean;
  size?: number;
  styles?: ButtonStylesProps;
  title?: string;
  hidden?: boolean;
}

const BADGE_BACKGROUND_COLORS: string[] = [
  "#FF0000",
  "#00cd00",
  "#1d1dd0",
  "#ce4118",
  "#FF00FF",
  "#60b1ac",
  "#800000",
  "#008000",
  "#9a6969",
  "#808000",
  "#800080",
  "#008080",
  "#FF8000",
  "#FF0080",
  "#444444",
  "#713609",
  "#8000FF",
  "#0080FF",
  "#FF8080",
  "#8080FF",
  "#FF80FF",
  "#80FFFF",
  "#e4e473",
  "#73738c",
  "#FF4080",
  "#48a467",
];

const VARIANTS_BADGE = {
  null: {
    bg: null,
    color: null,
  },
  neutral: {
    bg: "#363c41",
    color: "#ffffff",
  },
  green: {
    bg: "rgb(174 224 197)",
    color: "rgb(15, 19, 26)",
  },
  yellow: {
    bg: "rgb(255 215 112)",
    color: "rgb(15, 19, 26)",
  },
  red: {
    bg: "rgb(235 27 0)",
    color: "#3d1c1c",
  },
};

function Badge({
  variant = null,
  caption = "",
  withCircle = false,
  backgroundColor,
  textColor,
  circleColor,
  onClick,
  styles,
  id = "badge",
  actions,
  metadata,
  ...props
}: BadgeProps) {
  const { currentTheme } = useTheme();
  const badgeTheme = currentTheme.badge;

  const { bg: backgroundColorVariant, color: colorVariant } =
    VARIANTS_BADGE[variant];

  const circleColorLocal = strToColor(caption, BADGE_BACKGROUND_COLORS);

  const isInvalidColor = (color?: string | null) =>
    !color || color.trim() === "#";

  const badgeBackgroundColor = !isInvalidColor(backgroundColor)
    ? backgroundColor!
    : !isInvalidColor(backgroundColorVariant)
      ? backgroundColorVariant!
      : badgeTheme?.backgroundColor;

  const badgeTextColor = !isInvalidColor(textColor)
    ? textColor!
    : !isInvalidColor(colorVariant)
      ? colorVariant!
      : badgeTheme?.textColor;

  const badgeCircleColor = !isInvalidColor(circleColor)
    ? circleColor!
    : !isInvalidColor(textColor)
      ? textColor!
      : colorVariant
        ? colorVariant
        : (circleColorLocal ?? badgeTheme?.circleColor);

  const actionsWithStyles = actions
    ?.filter((action) => !action?.hidden)
    .map((action) => ({
      ...action,
      icon: {
        ...action.icon,
        size: action?.size ?? 14,
      },
      styles: {
        ...action?.styles,
        self: css`
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
          border-radius: 9999px;
          padding: 1px;
          opacity: 1;
          height: fit-content;
          background-color: transparent;

          &:hover {
            background-color: ${badgeTheme?.action?.hoverBackgroundColor};
          }

          &:active {
            background-color: ${badgeTheme?.action?.activeBackgroundColor};
          }

          &:focus-visible {
            outline: none;
            box-shadow: inset 0 0 0 2px ${badgeTheme?.action?.focusRingColor};
          }

          ${action?.disabled &&
          css`
            cursor: not-allowed;
            opacity: ${badgeTheme?.action?.disabledOpacity ?? 0.4};
          `};

          ${action?.icon?.styles?.self}
        `,
      },
    }));

  const hasActions = actionsWithStyles && actionsWithStyles.length > 0;

  return (
    <BadgeWrapper
      {...props}
      id={String(id)}
      onClick={onClick}
      aria-label="badge"
      $theme={badgeTheme}
      $backgroundColor={badgeBackgroundColor}
      $textColor={badgeTextColor}
      $hasCaption={caption.length > 0}
      $badgeStyle={styles?.self}
    >
      <BadgeContent $withCircle={withCircle}>
        {withCircle && (
          <BadgeCircle aria-label="badge-circle" $color={badgeCircleColor} />
        )}
        <BadgeLabel>{caption}</BadgeLabel>
      </BadgeContent>
      {hasActions && (
        <BadgeIconWrapper
          aria-label="badge-action-wrapper"
          $style={styles?.actionWrapperStyle}
        >
          {actionsWithStyles.map((action, index) => (
            <Button
              key={index}
              aria-label="badge-action"
              icon={action.icon}
              styles={action?.styles}
              title={action.title}
              onClick={(e) => {
                e.stopPropagation();
                if (action.onClick) {
                  action.onClick({
                    id,
                    caption,
                    metadata,
                    variant,
                    backgroundColor,
                    textColor,
                    circleColor,
                    withCircle,
                  });
                }
              }}
            />
          ))}
        </BadgeIconWrapper>
      )}
    </BadgeWrapper>
  );
}

const BadgeIconWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  gap: 2px;

  ${({ $style }) => $style};
`;

const BadgeWrapper = styled.div<{
  $backgroundColor: string;
  $textColor: string;
  $theme?: BadgeThemeConfiguration;
  $hasCaption: boolean;
  $badgeStyle: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.75rem;
  border-radius: 6px;
  width: fit-content;
  gap: 0.5rem;
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  user-select: none;
  word-break: break-word;
  min-height: ${({ $hasCaption }) => ($hasCaption ? "unset" : "22px")};
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  ${({ $badgeStyle }) => $badgeStyle};
`;

const BadgeLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`;

const BadgeContent = styled.div<{ $withCircle?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  gap: ${({ $withCircle }) => ($withCircle ? "0.5rem" : "0px")};
`;

const BadgeCircle = styled.span<{ $color: string }>`
  display: inline-block;
  border-radius: 9999px;
  min-width: 8px;
  max-width: 8px;
  min-height: 8px;
  max-height: 8px;
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color};
`;

export { Badge };
