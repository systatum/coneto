import { css } from "styled-components";
import { Tooltip } from "./tooltip";
import { RiInformationLine } from "@remixicon/react";

export default function Helper({ value }: { value: string }) {
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
      showDelayPeriod={700}
      dialog={value}
    >
      <RiInformationLine size={18} />
    </Tooltip>
  );
}
