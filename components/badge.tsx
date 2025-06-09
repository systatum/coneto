import { cn } from "./../lib/utils";
import { ReactNode } from "react";

export type BadgeTypeProps = "neutral" | "green" | "yellow" | "red";

export interface BadgeProps {
  variant?: BadgeTypeProps;
  withCircle?: boolean;
  children: ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
}

const VARIANTS_BADGE = {
  neutral: {
    bg: "#363c41",
    color: "#ffffff",
  },
  green: {
    bg: "rgb(52, 243, 140)",
    color: "rgb(15, 19, 26)",
  },
  yellow: {
    bg: "rgb(245, 184, 28)",
    color: "rgb(15, 19, 26)",
  },
  red: {
    bg: "rgb(255, 29, 0)",
    color: "#470707",
  },
};

export default function Badge({
  variant = "neutral",
  children,
  withCircle = false,
  className,
  bgColor,
  textColor,
}: BadgeProps) {
  const { bg, color } = VARIANTS_BADGE[variant];

  const classBadge = cn(
    `flex flex-row text-sm w-fit px-2 py-[2px] rounded-md items-center`,
    withCircle && "gap-[6px]",
    className
  );

  return (
    <div
      className={classBadge}
      style={{
        background: bgColor ? bgColor : bg,
        color: textColor ? textColor : color,
      }}
    >
      {withCircle && (
        <span
          className="rounded-full w-[7px] h-[7px] border"
          style={{
            borderColor: textColor ? textColor : color,
            backgroundColor: textColor ? textColor : color,
          }}
        />
      )}
      {children}
    </div>
  );
}
