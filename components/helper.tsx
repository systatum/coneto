import { css } from "styled-components";
import { Tooltip } from "./tooltip";
import { RiInformationLine } from "@remixicon/react";
import { applyClassName } from "./../constants/classname";

export interface HelperProps {
  value: string;
  showDelayPeriod?: number;
  className?: string;
  id?: string;
}

function Helper({ value, showDelayPeriod = 400, className, id }: HelperProps) {
  return (
    <Tooltip
      id={id}
      className={applyClassName("helper", className)}
      styles={{
        containerStyle: css`
          width: fit-content;
        `,
        arrowStyle: (placement) => css`
          ${placement?.endsWith("start") &&
          css`
            left: 5px;
          `}
          ${placement?.endsWith("end") &&
          css`
            right: 5px;
          `}
        `,
      }}
      showDelayPeriod={showDelayPeriod}
      dialog={value}
    >
      <RiInformationLine
        style={{
          cursor: "help",
        }}
        size={18}
      />
    </Tooltip>
  );
}

export { Helper };
