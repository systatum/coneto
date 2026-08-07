import { css, CSSProp } from "styled-components";
import { Tooltip } from "./tooltip";
import { RiInformationLine } from "@remixicon/react";
import { applyClassName } from "./../constants/classname";
import { ReactNode } from "react";
import { Figure } from "./figure";

export interface HelperProps {
  value: ReactNode;
  showDelayPeriod?: number;
  className?: string;
  id?: string;
  styles?: HelperStyles;
}

export interface HelperStyles {
  self?: CSSProp;
  drawerStyle?: CSSProp;
  arrowStyle?: CSSProp;
}

function Helper({
  value,
  showDelayPeriod = 400,
  className,
  id,
  styles,
}: HelperProps) {
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
          `};
          ${placement?.endsWith("end") &&
          css`
            right: 5px;
          `};

          ${styles?.arrowStyle}
        `,
        drawerStyle: styles?.drawerStyle,
      }}
      showDelayPeriod={showDelayPeriod}
      dialog={value}
    >
      <Figure
        image={RiInformationLine}
        size={18}
        styles={{
          self: styles?.self,
        }}
      />
    </Tooltip>
  );
}

export { Helper };
