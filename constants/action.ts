import React from "react";
import { FigureProps } from "../components/figure";

export interface BaseAction {
  id: string;
  caption?: string;
  onClick?: (e?: React.MouseEvent) => void;
  icon?: FigureProps;
  disabled?: boolean;
  hidden?: boolean;
}
