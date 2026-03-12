import { Placement } from "@floating-ui/react";

export type DialogPlacement =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "top-left"
  | "top-right"
  | "top-center"
  | "left-top"
  | "left-bottom"
  | "left-center"
  | "right-top"
  | "right-bottom"
  | "right-center";

export function getFloatingPlacement(placement: DialogPlacement): Placement {
  switch (placement) {
    case "bottom-left":
      return "bottom-start";
    case "bottom-right":
      return "bottom-end";
    case "bottom-center":
      return "bottom";

    case "top-left":
      return "top-start";
    case "top-right":
      return "top-end";
    case "top-center":
      return "top";

    case "left-top":
      return "left-start";
    case "left-bottom":
      return "left-end";
    case "left-center":
      return "left";

    case "right-top":
      return "right-start";
    case "right-bottom":
      return "right-end";
    case "right-center":
      return "right";

    default:
      return "bottom-start";
  }
}
