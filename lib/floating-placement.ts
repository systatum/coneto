import { Placement } from "@floating-ui/react";

export type DialogPlacement =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";

export function getFloatingPlacement(placement: DialogPlacement): Placement {
  switch (placement) {
    case "bottom-left":
      return "bottom-start";
    case "bottom-right":
      return "bottom-end";

    case "top-left":
      return "top-start";
    case "top-right":
      return "top-end";

    case "left-top":
      return "left-start";
    case "left-bottom":
      return "left-end";

    case "right-top":
      return "right-start";
    case "right-bottom":
      return "right-end";

    default:
      return "bottom-start";
  }
}
