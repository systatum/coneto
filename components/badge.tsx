import { getBackground, getCode } from "./../lib/code-color";
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

export default function Badge({
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

  const code = getCode(caption);
  const backgroundColorLocal = getBackground(code, BADGE_BACKGROUND_COLORS);

  const classBadge = cn(
    `flex flex-row text-xs w-fit px-2 py-[2px] border border-gray-100 rounded-md items-center select-none break-all`,
    caption.length === 0 && "min-h-[22px]",
    withCircle && "gap-2",
    className
  );

  return (
    <div
      onClick={onClick}
      style={{
        background: backgroundColor
          ? backgroundColor
          : backgroundColorVariant
            ? backgroundColorVariant
            : "transparent",
        color: textColor ? textColor : colorVariant ? colorVariant : "black",
      }}
      className={classBadge}
    >
      {withCircle && (
        <span
          className="rounded-full w-[8px] h-[8px] border"
          style={{
            borderColor: circleColor
              ? circleColor
              : textColor
                ? textColor
                : colorVariant
                  ? colorVariant
                  : backgroundColorLocal
                    ? backgroundColorLocal
                    : "black",
            backgroundColor: circleColor
              ? circleColor
              : textColor
                ? textColor
                : colorVariant
                  ? colorVariant
                  : backgroundColorLocal
                    ? backgroundColorLocal
                    : "black",
          }}
        />
      )}
      {caption}
    </div>
  );
}
