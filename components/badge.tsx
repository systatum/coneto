import { cn } from "./../lib/utils";
import { ReactNode } from "react";

export type BadgeVariantProps = "neutral" | "green" | "yellow" | "red";

export interface BadgeProps {
  id?: number;
  variant?: BadgeVariantProps;
  withCircle?: boolean;
  caption?: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  circleColor?: string;
}

const VARIANTS_BADGE = {
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
  variant = "neutral",
  caption,
  withCircle = false,
  className,
  backgroundColor,
  textColor,
  circleColor,
}: BadgeProps) {
  const { bg, color } = VARIANTS_BADGE[variant];

  const classBadge = cn(
    `flex flex-row text-xs w-fit px-2 py-[2px] rounded-md items-center  break-all`,
    withCircle && "gap-2",
    className
  );

  return (
    <div
      style={{
        background: backgroundColor ? backgroundColor : bg,
        color: textColor ? textColor : color,
      }}
      className={classBadge}
    >
      {withCircle && (
        <span
          className="rounded-full w-[8px] h-[8px] border"
          style={{
            borderColor: circleColor ? circleColor : color,
            backgroundColor: circleColor ? circleColor : color,
          }}
        />
      )}
      {caption}
    </div>
  );
}
