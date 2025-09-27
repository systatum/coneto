import styled, { css, CSSProp } from "styled-components";
import { ChangeEvent, MouseEvent } from "react";
import { strToColor } from "./../lib/code-color";
import { RemixiconComponentType } from "@remixicon/react";

export type BadgeVariantProps = null | "neutral" | "green" | "yellow" | "red";

export interface BadgeProps {
  id?: number;
  variant?: BadgeVariantProps;
  withCircle?: boolean;
  caption?: string;
  backgroundColor?: string;
  textColor?: string;
  circleColor?: string;
  onClick?: (
    e?: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>
  ) => void;
  badgeStyle?: CSSProp;
  actions?: BadgeActionProps[];
}

export interface BadgeActionProps {
  icon?: RemixiconComponentType;
  onClick?: (badge?: BadgeProps) => void;
  disabled?: boolean;
  title?: string;
  style?: CSSProp;
  size?: number;
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
    color: "#ffd4d4",
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
  badgeStyle,
  id,
  actions,
}: BadgeProps) {
  const { bg: backgroundColorVariant, color: colorVariant } =
    VARIANTS_BADGE[variant];

  const circleColorLocal = strToColor(caption, BADGE_BACKGROUND_COLORS);

  const isInvalidColor = (color?: string | null) =>
    !color || color.trim() === "#";

  const badgeBackgroundColor = !isInvalidColor(backgroundColor)
    ? backgroundColor!
    : !isInvalidColor(backgroundColorVariant)
      ? backgroundColorVariant!
      : "transparent";

  const badgeTextColor = !isInvalidColor(textColor)
    ? textColor!
    : !isInvalidColor(colorVariant)
      ? colorVariant!
      : "black";

  const badgeCircleColor = !isInvalidColor(circleColor)
    ? circleColor!
    : !isInvalidColor(textColor)
      ? textColor!
      : colorVariant
        ? colorVariant
        : (circleColorLocal ?? "black");

  return (
    <BadgeWrapper
      id={String(id)}
      onClick={onClick}
      $backgroundColor={badgeBackgroundColor}
      $textColor={badgeTextColor}
      $hasCaption={caption.length > 0}
      $badgeStyle={badgeStyle}
    >
      <BadgeContent $withCircle={withCircle}>
        {withCircle && (
          <BadgeCircle aria-label="badge-circle" $color={badgeCircleColor} />
        )}
        {caption}
      </BadgeContent>
      {actions && (
        <BadgeIconWrapper>
          {actions.map((data, index) => (
            <BadgeIcon
              key={index}
              aria-label="badge-action"
              as={data.icon}
              $style={data.style}
              $size={data.size}
              $disabled={data.disabled}
              onClick={(e) => {
                e.stopPropagation();
                if (data.onClick) data.onClick();
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

  & > *:not(:last-child) {
    margin-right: 2px;
  }

  ${({ $style }) => $style};
`;

const BadgeIcon = styled.div<{
  $disabled?: boolean;
  $style?: CSSProp;
  $size?: number;
}>`
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  border-radius: 9999px;
  padding: 1px;

  &:hover {
    background-color: #d1d5db;
  }

  &:active {
    background-color: #999999;
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #00000033;
    transition: box-shadow 0.2s ease;
  }

  ${({ $size }) =>
    $size &&
    css`
      width: ${`${$size}px`};
      height: ${`${$size}px`};
    `};

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 40%;
    `};

  ${({ $style }) => $style}
`;

const BadgeWrapper = styled.div<{
  $backgroundColor: string;
  $textColor: string;
  $hasCaption: boolean;
  $badgeStyle: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  width: fit-content;
  gap: 0.5rem;
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  user-select: none;
  word-break: break-word;
  min-height: ${({ $hasCaption }) => ($hasCaption ? "unset" : "22px")};
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  ${({ $badgeStyle }) => $badgeStyle};
`;

const BadgeContent = styled.div<{ $withCircle?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
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
