import styled, { CSSProp } from "styled-components";
import { ChangeEvent, MouseEvent } from "react";
import { strToColor } from "./../lib/code-color";

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
      onClick={onClick}
      $backgroundColor={badgeBackgroundColor}
      $textColor={badgeTextColor}
      $withCircle={withCircle}
      $hasCaption={caption.length > 0}
      $badgeStyle={badgeStyle}
    >
      {withCircle && <BadgeCircle $color={badgeCircleColor} />}
      {caption}
    </BadgeWrapper>
  );
}

const BadgeWrapper = styled.div<{
  $backgroundColor: string;
  $textColor: string;
  $withCircle: boolean;
  $hasCaption: boolean;
  $badgeStyle: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ $withCircle }) => ($withCircle ? "0.5rem" : "0")};
  padding: 2px 8px;
  font-size: 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  width: fit-content;
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  user-select: none;
  word-break: break-word;
  min-height: ${({ $hasCaption }) => ($hasCaption ? "unset" : "22px")};
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  ${({ $badgeStyle }) => $badgeStyle};
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
