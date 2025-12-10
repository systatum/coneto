import { Placement } from "@floating-ui/react";

export type DialogPlacement =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export function getFloatingPlacement(position?: DialogPlacement): Placement {
  switch (position) {
    case "bottom-left":
      return "bottom-start";
    case "bottom-right":
      return "bottom-end";
    case "top-left":
      return "top-start";
    case "top-right":
      return "top-end";
    default:
      return "bottom-start";
  }
}
