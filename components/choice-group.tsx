import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import styled, { CSSProp } from "styled-components";
import { RadioProps } from "./radio";
import { CheckboxProps } from "./checkbox";

export interface ChoiceGroupProps {
  children: ReactNode;
  containerStyle?: CSSProp;
  dividerStyle?: CSSProp;
}

function ChoiceGroup({
  children,
  containerStyle,
  dividerStyle,
}: ChoiceGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <ChoiceGroupWrapper $container_style={containerStyle}>
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        const componentChild = child as ReactElement<
          RadioProps | CheckboxProps
        >;

        const modifiedChild = cloneElement(componentChild, {
          highlightOnChecked: true,
        });

        return (
          <div key={index}>
            {modifiedChild}
            {!isLast && (
              <ChoiceGroupDivider
                aria-label="divider for choice group"
                $divider_style={dividerStyle}
              />
            )}
          </div>
        );
      })}
    </ChoiceGroupWrapper>
  );
}

const ChoiceGroupWrapper = styled.div<{
  $container_style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  ${({ $container_style }) => $container_style}
`;

const ChoiceGroupDivider = styled.div<{
  $divider_style?: CSSProp;
}>`
  height: 1px;
  background-color: #e5e7eb;
  ${({ $divider_style }) => $divider_style}
`;

export { ChoiceGroup };
