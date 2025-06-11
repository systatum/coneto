import { cn } from "./../lib/utils";
import { ChangeEvent, MouseEvent } from "react";
import { getBackground, getCode } from "./avatar";

export type BadgeVariantProps = "N/A" | "neutral" | "green" | "yellow" | "red";

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

const VARIANTS_BADGE = {
  "N/A": {
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
  variant = "N/A",
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
  const backgroundColorLocal = getBackground(code);

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
