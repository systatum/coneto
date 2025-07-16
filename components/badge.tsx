import { strToColor } from "./../lib/code-color";
import { cn } from "./../lib/utils";
import { ChangeEvent, MouseEvent } from "react";

export type BadgeVariantProps = null | "neutral" | "green" | "yellow" | "red";

export interface BadgeProps {
  id?: number;
  variant?: BadgeVariantProps;
  withCircle?: boolean;
  caption?: string;
  className?: string;
  backgroundColor?: string | null;
  textColor?: string | null;
  circleColor?: string | null;
  onClick?: (
    e?: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>
  ) => void;
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
  caption,
  withCircle = false,
  className,
  backgroundColor,
  textColor,
  circleColor,
  onClick,
}: BadgeProps) {
  const { bg: backgroundColorVariant, color: colorVariant } =
    VARIANTS_BADGE[variant];

  const circleColorLocal = strToColor(caption, BADGE_BACKGROUND_COLORS);

  const classBadge = cn(
    `flex flex-row text-xs w-fit px-2 py-[2px] border border-gray-100 rounded-md items-center select-none break-all`,
    caption.length === 0 && "min-h-[22px]",
    withCircle && "gap-2",
    className
  );
  const badgeBackgroundColor = backgroundColor
    ? backgroundColor
    : backgroundColorVariant
      ? backgroundColorVariant
      : "transparent";

  const badgeTextColor = textColor
    ? textColor
    : colorVariant
      ? colorVariant
      : "black";
  const badgeCircleColor = circleColor
    ? circleColor
    : textColor
      ? textColor
      : colorVariant
        ? colorVariant
        : circleColorLocal
          ? circleColorLocal
          : "black";

  return (
    <div
      onClick={onClick}
      style={{
        background: badgeBackgroundColor,
        color: badgeTextColor,
      }}
      className={classBadge}
    >
      {withCircle && (
        <span
          className="rounded-full w-[8px] h-[8px] border"
          style={{
            borderColor: badgeCircleColor,
            backgroundColor: badgeCircleColor,
          }}
        />
      )}
      {caption}
    </div>
  );
}

export { Badge };
