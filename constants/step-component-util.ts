import { ReactNode } from "react";
import { CSSProp } from "styled-components";

export const SteplineVariant = {
  Current: "current",
  Todo: "todo",
  Error: "error",
  Completed: "completed",
} as const;

export type SteplineVariant =
  (typeof SteplineVariant)[keyof typeof SteplineVariant];

export const SteplineLine = {
  Dash: "dash",
  Dot: "dot",
  Solid: "solid",
} as const;

export type SteplineLine = (typeof SteplineLine)[keyof typeof SteplineLine];

export interface SteplineItem {
  title?: ReactNode;
  subtitle?: ReactNode;
  variant?: SteplineVariant;
  line?: SteplineLine;
  styles?: { self?: CSSProp };
  active?: boolean;
  onClick?: () => void;
  id?: number | string;
}
