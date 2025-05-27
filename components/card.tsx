import { cn } from "./../lib/utils";
import { ReactNode } from "react";

interface CardProps {
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  radius?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  padding?:
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10";
  children: ReactNode;
  className?: string;
}

const SHADOW_MAP: Record<NonNullable<CardProps["shadow"]>, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

const RADIUS_MAP: Record<NonNullable<CardProps["radius"]>, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const PADDING_MAP: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-1",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-10",
  "3xl": "p-12",
  "4": "p-4",
  "5": "p-5",
  "6": "p-6",
  "7": "p-7",
  "8": "p-8",
  "9": "p-9",
  "10": "p-10",
};

export default function Card({
  children,
  shadow = "sm",
  radius = "xs",
  padding = "sm",
  className,
}: CardProps) {
  const cardClass = cn(
    "border border-gray-100 bg-white w-fit",
    PADDING_MAP[padding],
    RADIUS_MAP[radius],
    SHADOW_MAP[shadow],
    className
  );
  return <div className={cardClass}>{children}</div>;
}
