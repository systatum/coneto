import { ReactNode } from "react";
import { CSSProp } from "styled-components";

export interface SteplineItemState {
  title?: ReactNode;
  subtitle?: ReactNode;
  variant?: "current" | "todo" | "error" | "completed";
  line?: "dash" | "dot" | "solid";
  styles?: { self?: CSSProp };
  active?: boolean;
  onClick?: () => void;
  id?: number | string;
}
