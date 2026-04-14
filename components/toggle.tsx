import { ChangeEvent, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { Figure, FigureProps } from "./figure";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { useTheme } from "../theme/provider";
import { ToggleThemeConfig } from "../theme";

interface BaseToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: FigureProps;
  isLoading?: boolean;
  name?: string;
  label?: string;
  description?: string;
  size?: number;
  styles?: BaseToggleStyles;
}

interface BaseToggleStyles {
  descriptionStyle?: CSSProp;
  rowStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  errorStyle?: CSSProp;
  labelStyle?: CSSProp;
  titleStyle?: CSSProp;
}

function BaseToggle({
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
  disabled,
  ...props
}: BaseToggleProps) {
  const { currentTheme } = useTheme();
  const toggleTheme = currentTheme.toggle;

  const { heightWrapper, widthWrapper, thumbShift, iconSize } =
    getToggleSize(size);

  return (
    <ToggleWrapper
      $theme={toggleTheme}
      $disabled={disabled}
      $style={styles?.rowStyle}
      aria-label="toggle-row-wrapper"
    >
      <StyledLabel
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        aria-label="toggle-wrapper"
        style={{
          width: widthWrapper,
          height: heightWrapper,
          minWidth: widthWrapper,
          minHeight: heightWrapper,
        }}
      >
        <StyledInput
          {...props}
          aria-label="toggle-input"
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        <ToggleBackground $checked={checked} $theme={toggleTheme} />
        <ToggleButton
          $theme={toggleTheme}
          aria-label="toggle-thumb"
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
                aria-label="toggle-icon"
                size={icon?.size ?? iconSize}
              />
            )
          )}
        </ToggleButton>
      </StyledLabel>

      {(label || description) && (
        <ToggleTextWrapper
          $style={styles?.textWrapperStyle}
          aria-label="toggle-text-wrapper"
        >
          {label && (
            <StatefulForm.Label
              htmlFor={disabled ? null : id}
              styles={{ self: styles?.labelStyle }}
              label={label}
            />
          )}
          {description && (
            <Description $theme={toggleTheme} $style={styles?.descriptionStyle}>
              {description}
            </Description>
          )}
        </ToggleTextWrapper>
      )}
    </ToggleWrapper>
  );
}

export type ToggleStyles = BaseToggleStyles & FieldLaneStyles;

export interface ToggleProps
  extends Omit<BaseToggleProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: ToggleStyles;
}

function Toggle({
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
  labelGap,
  labelWidth,
  labelPosition,
  ...rest
}: ToggleProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "toggle",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    titleStyle,
    ...toggleStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      actions={actions}
      helper={helper}
      disabled={disabled}
      label={title}
      required={rest.required}
      errorIconPosition="none"
      styles={{
        bodyStyle: css`
          align-items: center;
          min-height: 0;
          ${bodyStyle}
        `,
        controlStyle,
        containerStyle,
        labelStyle: titleStyle,
      }}
    >
      <BaseToggle
        {...rest}
        id={inputId}
        styles={toggleStyles}
        disabled={disabled}
        label={label}
        description={description}
      />
    </FieldLane>
  );
}

const getToggleSize = (size: number) => {
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

const ToggleWrapper = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
  $theme?: ToggleThemeConfig;
}>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  align-items: center;
  width: 100%;

  ${({ $disabled, $theme }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: ${$theme?.disabledOpacity ?? 0.5};
      user-select: none;
      pointer-events: none;
    `};

  ${({ $style }) => $style}
`;

const ToggleTextWrapper = styled.div<{ $style?: CSSProp }>`
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

const ToggleBackground = styled.div<{
  $checked: boolean;
  $theme?: ToggleThemeConfig;
}>`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: background-color 0.3s;

  background-color: ${({ $checked, $theme }) =>
    $checked ? $theme?.checkedBackgroundColor : $theme?.backgroundColor};
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
`;

const ToggleButton = styled(motion.div)<{
  $theme?: ToggleThemeConfig;
}>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: ${({ $theme }) => $theme?.thumbColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};
`;

const Description = styled.span<{
  $style?: CSSProp;
  $theme?: ToggleThemeConfig;
}>`
  font-size: 12px;
  width: 100%;
  color: ${({ $theme }) => $theme?.descriptionColor};
  ${({ $style }) => $style}
`;

export { Toggle };
