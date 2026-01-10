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
  styles?: ChoiceGroupStylesProps;
}

export interface ChoiceGroupStylesProps {
  containerStyle?: CSSProp;
  dividerStyle?: CSSProp;
}

function ChoiceGroup({ children, styles }: ChoiceGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const isRadioButton = childArray.some((child) => {
    if (!isValidElement(child)) return false;

    if (isRadioElement(child)) {
      return child.props.mode === "button";
    }

    return false;
  });

  return (
    <ChoiceGroupWrapper
      $isRowDirection={isRadioButton}
      $containerStyle={styles?.containerStyle}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        const componentChild = child as ReactElement<
          RadioProps | CheckboxProps
        >;

        const modifiedChild = cloneElement(componentChild, {
          highlightOnChecked: true,
          ...(isRadioButton
            ? {
                styles: {
                  containerStyle:
                    componentChild.props.styles?.containerStyle ??
                    css`
                      border: 0.5px solid rgba(229, 231, 235, 0.6);
                      border-radius: 4px;
                      overflow: hidden;
                    `,
                },
              }
            : {}),
        });

        return (
          <Fragment key={index}>
            {modifiedChild}
            {!isLast && !isRadioButton && (
              <ChoiceGroupDivider
                aria-label="divider for choice group"
                $dividerStyle={styles?.dividerStyle}
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
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;

  ${({ $isRowDirection }) =>
    $isRowDirection
      ? css`
          display: grid;
          border: none;
          border-radius: none;
          gap: 2px;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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

  width: 100%;
  height: 1px;

  ${({ $dividerStyle }) => $dividerStyle}
`;

function isRadioElement(
  el: ReactElement<RadioProps | CheckboxProps>
): el is ReactElement<RadioProps> {
  return "mode" in el.props;
}

export { ChoiceGroup };
