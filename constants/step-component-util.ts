import { ReactNode } from "react";
import { CSSProp } from "styled-components";

export interface SteplineItemState {
  title?: string;
  subtitle?: ReactNode[];
  variant?: "current" | "todo" | "error" | "completed";
  containerStyle?: CSSProp;
  active?: boolean;
  onClick?: () => void;
  id?: number;
}

export const OUTER_CIRCLE_VARIANT_COLOR: Record<string, string> = {
  error: "#8f0751",
  completed: "#2fe620",
  current: "#2fe620",
  todo: "#9ca3af",
};

export const INNER_CIRCLE_VARIANT_COLOR: Record<string, string> = {
  error: "#ff0000",
  completed: "#00b62e",
  current: "#00b62e",
  todo: "#4b5563",
};

export const TEXT_VARIANT_COLOR: Record<string, string> = {
  error: "#ff0000",
  completed: "",
  current: "",
  todo: "",
};
