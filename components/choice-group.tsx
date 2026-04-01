import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { Radio, RadioProps } from "./radio";
import { Checkbox, CheckboxProps } from "./checkbox";
import { useTheme } from "./../theme/provider";

export interface ChoiceGroupProps {
  children: ReactNode;
  styles?: ChoiceGroupStylesProps;
}

export interface ChoiceGroupStylesProps {
  containerStyle?: CSSProp;
  dividerStyle?: CSSProp;
}

function ChoiceGroup({ children, styles }: ChoiceGroupProps) {
  const { currentTheme } = useTheme();
  const choiceGroupTheme = currentTheme.choiceGroup;

  const childArray = Children.toArray(children).filter(isValidElement);
  const isRadioButton = childArray.some((child) => {
    if (!isValidElement(child)) return false;
    if (isRadioElement(child)) return child.props.mode === "button";
    return false;
  });

  return (
    <ChoiceGroupWrapper
      $isRowDirection={isRadioButton}
      $style={styles?.containerStyle}
      $borderColor={choiceGroupTheme.borderColor}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;
        const componentChild = child as ReactElement<
          RadioProps | CheckboxProps
        >;

        const isRadio = componentChild.type === Radio;
        const isCheckbox = componentChild.type === Checkbox;

        const radioProps = isRadio
          ? (componentChild.props as RadioProps)
          : undefined;
        const checkboxProps = isCheckbox
          ? (componentChild.props as CheckboxProps)
          : undefined;

        const radioMode = radioProps?.mode ?? "radio";
        const isRadioButton = radioMode === "button";
        const isRadioNormal = radioMode === "radio";

        const modifiedChild = cloneElement(componentChild, {
          highlightOnChecked: true,
          ...(isRadioButton && {
            styles: {
              ...radioProps?.styles,
              containerStyle: css`
                border: 0.5px solid ${choiceGroupTheme.dividerColor};
                border-radius: 4px;
                overflow: hidden;
                ${radioProps?.styles?.containerStyle}
              `,
              textWrapperStyle: css`
                background-color: ${choiceGroupTheme.backgroundColor};
                ${radioProps?.styles?.textWrapperStyle}
              `,
              labelStyle: css`
                color: ${choiceGroupTheme.labelColor};
                ${radioProps?.styles?.labelStyle}
              `,
              descriptionStyle: css`
                color: ${choiceGroupTheme.descriptionColor};
                ${radioProps?.styles?.descriptionStyle}
              `,
            },
          }),
          ...(isRadioNormal && {
            styles: {
              ...radioProps?.styles,
              textWrapperStyle: css`
                ${radioProps?.styles?.textWrapperStyle}
              `,
              labelStyle: css`
                color: ${choiceGroupTheme.labelColor};
                ${radioProps?.styles?.labelStyle}
              `,
              descriptionStyle: css`
                ${radioProps?.styles?.descriptionStyle}
              `,
            },
          }),
          ...(isCheckbox && {
            styles: {
              ...checkboxProps?.styles,
              containerStyle: css`
                width: 100%;
                background-color: ${choiceGroupTheme.backgroundColor};
                ${checkboxProps?.styles?.containerStyle}
              `,
              labelStyle: css`
                font-size: 14px;
                color: ${choiceGroupTheme.labelColor};
                ${checkboxProps?.styles?.labelStyle}
              `,
              descriptionStyle: css`
                color: ${choiceGroupTheme.descriptionColor};
                ${checkboxProps?.styles?.descriptionStyle}
              `,
            },
          }),
        });

        return (
          <Fragment key={index}>
            {modifiedChild}
            {!isLast && !isRadioButton && (
              <ChoiceGroupDivider
                aria-label="divider for choice group"
                $style={styles?.dividerStyle}
                $dividerColor={choiceGroupTheme.dividerColor}
              />
            )}
          </Fragment>
        );
      })}
    </ChoiceGroupWrapper>
  );
}

const ChoiceGroupWrapper = styled.div<{
  $style?: CSSProp;
  $isRowDirection?: boolean;
  $borderColor: string;
}>`
  display: flex;
  position: relative;
  border: 1px solid ${({ $borderColor }) => $borderColor};
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
        `};

  ${({ $style }) => $style}
`;

const ChoiceGroupDivider = styled.div<{
  $style?: CSSProp;
  $dividerColor: string;
}>`
  background-color: ${({ $dividerColor }) => $dividerColor};
  flex-shrink: 0;

  width: 100%;
  height: 1px;

  ${({ $style }) => $style}
`;

function isRadioElement(
  el: ReactElement<RadioProps>
): el is ReactElement<RadioProps> {
  return "mode" in el.props;
}

export { ChoiceGroup };
