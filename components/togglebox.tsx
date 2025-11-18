import { ChangeEvent, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { RemixiconComponentType } from "@remixicon/react";
import { LoadingSpinner } from "./loading-spinner";
import styled, { css, CSSProp } from "styled-components";

export interface ToggleboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: RemixiconComponentType | null;
  isLoading?: boolean;
  name?: string;
  label?: string;
  description?: string;
  containerStyle?: CSSProp;
  descriptionStyle?: CSSProp;
  rowStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  errorStyle?: CSSProp;
  labelStyle?: CSSProp;
  showError?: boolean;
  errorMessage?: string;
  size?: number;
}

function Togglebox({
  name,
  checked = false,
  onChange,
  icon: Icon = null,
  isLoading = false,
  label,
  description,
  containerStyle,
  showError,
  errorStyle,
  errorMessage,
  descriptionStyle,
  rowStyle,
  textWrapperStyle,
  labelStyle,
  size = 24,
  ...props
}: ToggleboxProps) {
  const { heightWrapper, widthWrapper, thumbShift, iconSize } =
    getToggleboxSize(size);

  return (
    <ToggleboxContainer $style={containerStyle}>
      <ToggleboxWrapper $style={rowStyle} aria-label="togglebox-row-wrapper">
        <StyledLabel
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          aria-label="togglebox-wrapper"
          style={{
            width: widthWrapper,
            height: heightWrapper,
          }}
        >
          <StyledInput
            aria-label="togglebox-input"
            id={props.id}
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
              Icon && <Icon aria-label="togglebox-icon" size={iconSize} />
            )}
          </ToggleButton>
        </StyledLabel>

        {(label || description) && (
          <ToggleboxTextWrapper
            $style={textWrapperStyle}
            aria-label="togglebox-text-wrapper"
          >
            {label && <Label $style={labelStyle}>{label}</Label>}
            {description && (
              <Description $style={descriptionStyle}>{description}</Description>
            )}
          </ToggleboxTextWrapper>
        )}
      </ToggleboxWrapper>
      {showError && errorMessage && (
        <ErrorText $style={errorStyle}>{errorMessage}</ErrorText>
      )}
    </ToggleboxContainer>
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

const ToggleboxContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  width: 100%;

  ${({ $style }) => $style}
`;

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

const Label = styled.span<{ $style?: CSSProp }>`
  width: 100%;

  ${({ $style }) => $style}
`;

const Description = styled.span<{ $style?: CSSProp }>`
  font-size: 12px;
  width: 100%;
  ${({ $style }) => $style}
`;

const ErrorText = styled.span<{ $style?: CSSProp }>`
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
  ${({ $style }) => $style}
`;

export { Togglebox };
