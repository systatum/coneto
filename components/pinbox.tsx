import { RiErrorWarningLine } from "@remixicon/react";
import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp, keyframes } from "styled-components";

interface PinboxProps {
  fontSize?: number;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  masked?: boolean;
  parts?: PinboxState[];
  name?: string;
  onChange?: (
    data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string;
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}

export interface PinboxState {
  type?: PinboxTypeState;
  text?: string;
}

type PinboxTypeState = "static" | "digit" | "alphabet" | "alphanumeric";

function Pinbox({
  fontSize = 16,
  label,
  errorMessage,
  masked,
  parts,
  showError,
  labelStyle,
  name = "pinbox",
  value,
  onChange,
  containerStyle,
}: PinboxProps) {
  const getDefaultValue = () => {
    let valIndex = 0;
    return parts.map((p) => {
      if (p.type === "static") {
        return p.text ?? "";
      }
      const char = value?.[valIndex] ?? "";
      valIndex++;
      return char;
    });
  };

  const [valueLocal, setValueLocal] = useState<string[]>(getDefaultValue());

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [maskedIndices, setMaskedIndices] = useState<Set<number>>(new Set());
  const maskTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const moveToNextInput = (currentIndex: number) => {
    let nextIndex = currentIndex + 1;
    while (parts[nextIndex] && parts[nextIndex].type === "static") {
      nextIndex++;
    }
    if (parts[nextIndex]) {
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const moveToPrevInput = (currentIndex: number) => {
    let prevIndex = currentIndex - 1;
    while (parts[prevIndex] && parts[prevIndex].type === "static") {
      prevIndex--;
    }
    if (inputsRef.current[prevIndex]) {
      inputsRef.current[prevIndex]?.focus();
    }
  };

  useEffect(() => {
    return () => {
      maskTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;
    const type = parts[index].type;

    if (
      type === "digit" &&
      !/[0-9]/.test(key) &&
      !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
      e.preventDefault();
      return;
    }
    if (
      type === "alphabet" &&
      !/[A-Za-z]/.test(key) &&
      !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
      e.preventDefault();
      return;
    }
    if (
      type === "alphanumeric" &&
      !/[A-Za-z0-9]/.test(key) &&
      !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key)
    ) {
      e.preventDefault();
      return;
    }

    if (key.length === 1) {
      e.preventDefault();
      updateValue(index, key);
      moveToNextInput(index);
    }

    if (key === "Backspace") {
      if (valueLocal[index]) {
        updateValue(index, "");
        moveToPrevInput(index);
      } else {
        moveToPrevInput(index);
      }
    }

    if (key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      moveToNextInput(index);
    }

    if (key === "Tab" && e.shiftKey) {
      e.preventDefault();
      moveToPrevInput(index);
    }

    if (key === "ArrowLeft") {
      moveToPrevInput(index);
    }

    if (key === "ArrowRight") {
      moveToNextInput(index);
    }
  };

  const updateValue = (index: number, newChar: string) => {
    const finalValue = [...valueLocal];
    finalValue[index] = newChar;
    setValueLocal(finalValue);

    if (masked && newChar) {
      const existingTimeout = maskTimeoutsRef.current.get(index);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      setMaskedIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      const timeout = setTimeout(() => {
        setMaskedIndices((prev) => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        maskTimeoutsRef.current.delete(index);
      }, 500);

      maskTimeoutsRef.current.set(index, timeout);
    }

    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: finalValue
            .filter((_, i) => parts[i].type !== "static")
            .join(""),
        },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const getDisplayChar = (index: number) => {
    const char = valueLocal[index] || "";

    if (!masked || !char || parts[index].type === "static") {
      return char;
    }

    return maskedIndices.has(index) ? "•" : char;
  };

  const inputElements: ReactElement = (
    <PinboxInputWrapper>
      {parts.map((part, index) => {
        const isStatic = part.type === "static";

        const displayChar = getDisplayChar(index);
        const { type, pattern } = switchInputBox(part.type);
        const isAnimate = Boolean(
          masked && !isStatic && !maskedIndices.has(index) && valueLocal[index]
        );

        return (
          <PinboxInputContent
            $fontSize={fontSize}
            $isStatic={isStatic}
            key={index}
          >
            <PinboxInput
              $error={showError}
              ref={(el: HTMLInputElement) => {
                inputsRef.current[index] = el;
                if (el) el.value = displayChar;
              }}
              pattern={pattern}
              type={type}
              maxLength={1}
              value={displayChar}
              onKeyDown={(e) => handleKeyDown(e, index)}
              readOnly={true}
              $isStatic={isStatic}
              $fontSize={fontSize}
              $isAnimate={isAnimate}
            />
            <PinboxIndicator $error={showError} />
          </PinboxInputContent>
        );
      })}
      {showError && (
        <RiErrorWarningLine
          size={fontSize * 1.5}
          style={{
            display: "flex",
            marginLeft: fontSize * 0.7,
            borderRadius: "9999px",
            background: "#dc2626",
            color: "white",
          }}
        />
      )}
    </PinboxInputWrapper>
  );

  const inputId = `textbox-${name}`;

  return (
    <Container $containerStyle={containerStyle}>
      {label && (
        <Label $style={labelStyle} htmlFor={inputId}>
          {label}
        </Label>
      )}
      {inputElements}
      {showError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
}

const Container = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  gap: 8px;
  font-size: 12px;

  ${({ $containerStyle }) => $containerStyle}
`;

const PinboxInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  justify-content: center;
  align-items: center;
`;

const PinboxInputContent = styled.div<{
  $fontSize?: number;
  $isStatic?: boolean;
}>`
  ${({ $fontSize }) =>
    $fontSize &&
    css`
      width: ${`${$fontSize * 2}px`};
      height: ${`${$fontSize * 2.5}px`};
    `};

  display: flex;
  position: relative;
`;

const PinboxIndicator = styled.div<{ $error?: boolean }>`
  width: 70%;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  display: none;

  ${({ $error }) =>
    $error
      ? css`
          color: #991b1b;
          border-color: #f87171;
          box-shadow: 0 0 0 0.5px #f87171;
        `
      : css`
          border-color: #61a9f9;
          box-shadow: 0 0 0 0.5px #61a9f9;
          z-index: 9999;
        `};
`;

const PinboxInput = styled.input<{
  $fontSize?: number;
  $error?: boolean;
  $isStatic?: boolean;
  $isAnimate?: boolean;
}>`
  ${({ $fontSize, $isStatic }) =>
    $isStatic
      ? css`
          width: ${`${$fontSize * 2}px`};
          font-size: ${`${$fontSize * 1.5}px`};
          display: flex;
          align-items: center;
          appearance: none;
        `
      : css`
          width: ${`${$fontSize * 2}px`};
          height: ${`${$fontSize * 2.5}px`};
          font-size: ${$fontSize};
        `};

  border: 0.5px solid black;
  border-radius: 0px;
  outline: none;
  text-align: center;
  caret-color: transparent;

  ${({ $error }) =>
    $error
      ? css`
          color: #991b1b;
          border: 0.5px solid #f87171;

          &:focus {
            box-shadow: 0 0 0 0.5px #f87171;
          }
        `
      : css`
          &:focus {
            border-color: #61a9f9;
            box-shadow: 0 0 0 0.5px #61a9f9;
            z-index: 9999;
          }
        `};

  ${({ $isStatic }) =>
    $isStatic
      ? css`
          border: 0px;
          user-select: none;
          pointer-events: none;
        `
      : css`
          &:focus + ${PinboxIndicator} {
            display: flex;
          }
        `}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

const switchInputBox = (type: PinboxTypeState) => {
  switch (type) {
    case "static":
      return {
        type: "text",
      };

    case "digit":
      return {
        type: "tel",
        pattern: "[0-9]",
      };

    case "alphabet":
      return {
        type: "text",
        pattern: "[A-Za-z]",
      };

    case "alphanumeric":
      return {
        type: "text",
        pattern: "[A-Za-z0-9]",
      };

    default:
      return {
        type: "text",
      };
  }
};

export { Pinbox };
