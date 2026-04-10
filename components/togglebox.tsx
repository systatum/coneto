import { ChangeEvent, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { Figure, FigureProps } from "./figure";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { ToggleboxThemeConfig } from "./../theme";

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
  styles?: BaseToggleboxStyles;
}

interface BaseToggleboxStyles {
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
  disabled,
  ...props
}: BaseToggleboxProps) {
  const { currentTheme } = useTheme();
  const toggleboxTheme = currentTheme.togglebox;

  const { heightWrapper, widthWrapper, thumbShift, iconSize } =
    getToggleboxSize(size);

  return (
    <ToggleboxWrapper
      $theme={toggleboxTheme}
      $disabled={disabled}
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
          {...props}
          aria-label="togglebox-input"
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        <ToggleBackground $checked={checked} $theme={toggleboxTheme} />
        <ToggleButton
          $theme={toggleboxTheme}
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
              htmlFor={disabled ? null : id}
              styles={{ self: styles?.labelStyle }}
              label={label}
            />
          )}
          {description && (
            <Description
              $theme={toggleboxTheme}
              $style={styles?.descriptionStyle}
            >
              {description}
            </Description>
          )}
        </ToggleboxTextWrapper>
      )}
    </ToggleboxWrapper>
  );
}

export type ToggleboxStyles = BaseToggleboxStyles & FieldLaneStyles;

export interface ToggleboxProps
  extends Omit<BaseToggleboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: ToggleboxStyles;
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
  labelGap,
  labelWidth,
  labelPosition,
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

const ToggleboxWrapper = styled.div<{
  $style?: CSSProp;
  $disabled?: boolean;
  $theme?: ToggleboxThemeConfig;
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

const ToggleBackground = styled.div<{
  $checked: boolean;
  $theme?: ToggleboxThemeConfig;
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
  $theme?: ToggleboxThemeConfig;
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
  $theme?: ToggleboxThemeConfig;
}>`
  font-size: 12px;
  width: 100%;
  color: ${({ $theme }) => $theme?.descriptionColor};
  ${({ $style }) => $style}
`;

export { Togglebox };
