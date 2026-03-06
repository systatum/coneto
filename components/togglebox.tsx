import { ChangeEvent, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import styled, { CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { Figure, FigureProps } from "./figure";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

interface BaseToggleboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: FigureProps;
  isLoading?: boolean;
  name?: string;
  label?: string;
  description?: string;
  size?: number;
  styles?: BaseToggleboxStylesProps;
}

interface BaseToggleboxStylesProps {
  descriptionStyle?: CSSProp;
  rowStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  errorStyle?: CSSProp;
  labelStyle?: CSSProp;
  titleStyle?: CSSProp;
}

function BaseTogglebox({
  name,
  checked = false,
  onChange,
  icon,
  isLoading = false,
  label,
  description,
  styles,
  size = 24,
  id,
  ...props
}: BaseToggleboxProps) {
  const { heightWrapper, widthWrapper, thumbShift, iconSize } =
    getToggleboxSize(size);

  return (
    <ToggleboxWrapper
      $style={styles?.rowStyle}
      aria-label="togglebox-row-wrapper"
    >
      <StyledLabel
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        aria-label="togglebox-wrapper"
        style={{
          width: widthWrapper,
          height: heightWrapper,
          minWidth: widthWrapper,
          minHeight: heightWrapper,
        }}
      >
        <StyledInput
          aria-label="togglebox-input"
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <ToggleBackground checked={checked} />
        <ToggleButton
          aria-label="togglebox-thumb"
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          animate={{
            x: checked ? thumbShift : 0,
          }}
          style={{
            width: size,
            height: size,
          }}
        >
          {isLoading ? (
            <LoadingSpinner iconSize={iconSize} />
          ) : (
            icon && (
              <Figure
                {...icon}
                aria-label="togglebox-icon"
                size={icon?.size ?? iconSize}
              />
            )
          )}
        </ToggleButton>
      </StyledLabel>

      {(label || description) && (
        <ToggleboxTextWrapper
          $style={styles?.textWrapperStyle}
          aria-label="togglebox-text-wrapper"
        >
          {label && (
            <StatefulForm.Label
              htmlFor={props.disabled ? null : id}
              style={styles?.labelStyle}
              label={label}
            />
          )}
          {description && (
            <Description $style={styles?.descriptionStyle}>
              {description}
            </Description>
          )}
        </ToggleboxTextWrapper>
      )}
    </ToggleboxWrapper>
  );
}

export type ToggleboxStylesProps = BaseToggleboxStylesProps &
  FieldLaneStylesProps;

export interface ToggleboxProps
  extends Omit<BaseToggleboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: ToggleboxStylesProps;
}

function Togglebox({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  title,
  description,
  ...rest
}: ToggleboxProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "togglebox",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    titleStyle,
    ...toggleboxStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      showError={showError}
      errorMessage={errorMessage}
      actions={actions}
      helper={helper}
      disabled={disabled}
      label={title}
      errorIconPosition="none"
      styles={{
        bodyStyle,
        controlStyle,
        containerStyle,
        labelStyle: titleStyle,
      }}
    >
      <BaseTogglebox
        {...rest}
        id={inputId}
        styles={toggleboxStyles}
        disabled={disabled}
        label={label}
        description={description}
      />
    </FieldLane>
  );
}

const getToggleboxSize = (size: number) => {
  const widthWrapper = size * 2;
  const heightWrapper = size * 1;
  const thumbShift = size * 1.02;
  const iconSize = size * 0.6;

  return {
    widthWrapper,
    heightWrapper,
    thumbShift,
    iconSize,
  };
};

const ToggleboxWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  align-items: center;
  width: 100%;

  ${({ $style }) => $style}
`;

const ToggleboxTextWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ $style }) => $style}
`;

const StyledLabel = styled(motion.label)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const ToggleBackground = styled.div<{ checked: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: background-color 0.3s;
  background-color: ${({ checked }) => (checked ? "#61A9F9" : "#D1D5DB")};
`;

const ToggleButton = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Description = styled.span<{ $style?: CSSProp }>`
  font-size: 12px;
  width: 100%;
  ${({ $style }) => $style}
`;

export { Togglebox };
