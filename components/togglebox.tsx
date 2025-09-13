import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { motion } from "framer-motion";
import { RemixiconComponentType } from "@remixicon/react";
import { LoadingSpinner } from "./loading-spinner";
import styled, { css, CSSProp } from "styled-components";

export interface ToggleboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: RemixiconComponentType | null;
  isLoading?: boolean;
  name?: string;
  label?: string;
  description?: string;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  showError?: boolean;
  errorMessage?: string;
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
  labelStyle,
  showError,
  errorMessage,
  ...props
}: ToggleboxProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <ToggleboxWrapper
        $containerStyle={containerStyle}
        $description={description}
      >
        <StyledLabel
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          aria-label="togglebox"
        >
          <StyledInput
            id={props.id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <ToggleBackground checked={checked} />
          <ToggleButton
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            animate={{
              x: checked ? 25 : 0,
            }}
          >
            {isLoading ? (
              <span style={{ position: "relative", width: "100%" }}>
                <LoadingSpinner
                  iconSize={14}
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                  }}
                />
              </span>
            ) : (
              Icon && (
                <Icon
                  size={13}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: checked ? "#61A9F9" : undefined,
                  }}
                />
              )
            )}
          </ToggleButton>
        </StyledLabel>

        {(label || description) && (
          <TextGroup>
            {label && <Label $labelStyle={labelStyle}>{label}</Label>}
            {description && <Description>{description}</Description>}
          </TextGroup>
        )}
      </ToggleboxWrapper>
      {showError && <ErrorText>{errorMessage}</ErrorText>}
    </div>
  );
}

const ToggleboxWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $description?: string;
}>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  font-size: 0.75rem;
  ${({ $description }) =>
    !$description
      ? css`
          align-items: center;
        `
      : css`
          align-items: flex-start;
        `};

  ${({ $containerStyle }) => $containerStyle}
`;

const StyledLabel = styled(motion.label)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  width: 3rem;
  height: 1.5rem;
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const ToggleButton = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

const ToggleBackground = styled.div<{ checked: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: background-color 0.3s;
  background-color: ${({ checked }) => (checked ? "#61A9F9" : "#D1D5DB")};

  &:active {
    background-color: ${({ checked }) => (checked ? "#3B82F6" : "#9CA3AF")};
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.span`
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
`;

const Label = styled.span<{ $labelStyle?: CSSProp }>`
  font-weight: 500;
  ${({ $labelStyle }) => $labelStyle}
`;

const Description = styled.span``;

export { Togglebox };
