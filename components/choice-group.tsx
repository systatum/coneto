import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { RadioProps } from "./radio";
import { CheckboxProps } from "./checkbox";

export interface ChoiceGroupProps {
  children: ReactNode;
  containerStyle?: CSSProp;
  dividerStyle?: CSSProp;
  flexDirection?: "row" | "column";
}

function ChoiceGroup({
  children,
  containerStyle,
  dividerStyle,
  flexDirection = "column",
}: ChoiceGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <ChoiceGroupWrapper
      $isRowDirection={flexDirection === "row"}
      $containerStyle={containerStyle}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        const componentChild = child as ReactElement<
          RadioProps | CheckboxProps
        >;

        const modifiedChild = cloneElement(componentChild, {
          highlightOnChecked: true,
        });

        return (
          <Fragment key={index}>
            {modifiedChild}
            {!isLast && (
              <ChoiceGroupDivider
                $isRowDirection={flexDirection === "row"}
                aria-label="divider for choice group"
                $dividerStyle={dividerStyle}
              />
            )}
          </Fragment>
        );
      })}
    </ChoiceGroupWrapper>
  );
}

const ChoiceGroupWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $isRowDirection?: boolean;
}>`
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;

  ${({ $isRowDirection }) =>
    $isRowDirection
      ? css`
          flex-direction: row;
        `
      : css`
          flex-direction: column;
        `}
  ${({ $containerStyle }) => $containerStyle}
`;

const ChoiceGroupDivider = styled.div<{
  $dividerStyle?: CSSProp;
  $isRowDirection?: boolean;
}>`
  background-color: #e5e7eb;
  flex-shrink: 0;

  ${({ $isRowDirection }) =>
    $isRowDirection
      ? css`
          width: 1px;
          align-self: stretch;
        `
      : css`
          width: 100%;
          height: 1px;
        `}

  ${({ $dividerStyle }) => $dividerStyle}
`;

export { ChoiceGroup };
