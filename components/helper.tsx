import { css } from "styled-components";
import { Tooltip } from "./tooltip";
import { RiInformationLine } from "@remixicon/react";

export interface HelperProps {
  value: string;
  showDelayPeriod?: number;
}

function Helper({ value, showDelayPeriod = 400 }: HelperProps) {
  return (
    <Tooltip
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
