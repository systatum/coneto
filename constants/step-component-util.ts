import { ReactNode } from "react";

export interface SteplineItemState {
  title?: string;
  subtitle?: ReactNode[];
  variant?: "current" | "todo" | "error" | "completed";
  className?: string;
  onClick?: () => void;
  id?: number;
}

export const OUTER_CIRCLE_VARIANT_CLASS: Record<string, string> = {
  error: "bg-[#8f0751]",
  completed: "bg-[#2fe620]",
  current: "bg-[#2fe620]",
  todo: "bg-gray-400",
};

export const INNER_CIRCLE_VARIANT_CLASS: Record<string, string> = {
  error: "bg-[#ff0000]",
  completed: "bg-[#00b62e]",
  current: "bg-[#00b62e]",
  todo: "bg-gray-600",
};

export const TEXT_VARIANT_CLASS: Record<string, string> = {
  error: "text-[#ff0000]",
  completed: "",
  current: "",
  todo: "",
};
