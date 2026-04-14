import { Placement } from "@floating-ui/react";

export const DialogPlacement = {
  BottomLeft: "bottom-left",
  BottomRight: "bottom-right",
  BottomCenter: "bottom-center",

  TopLeft: "top-left",
  TopRight: "top-right",
  TopCenter: "top-center",

  LeftTop: "left-top",
  LeftBottom: "left-bottom",
  LeftCenter: "left-center",

  RightTop: "right-top",
  RightBottom: "right-bottom",
  RightCenter: "right-center",
} as const;

export type DialogPlacement =
  (typeof DialogPlacement)[keyof typeof DialogPlacement];

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
