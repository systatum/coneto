import { RiErrorWarningLine } from "@remixicon/react";
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { PinboxThemeConfig } from "./../theme";

interface BasePinboxProps {
  fontSize?: number;
  label?: string;
  helper?: string;
  showError?: boolean;
  errorMessage?: string;
  masked?: boolean;
  parts?: PinboxState[];
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  value?: string;
  disabled?: boolean;
  styles?: BasePinboxStylesProps;
  id?: string;
  required?: boolean;
}

interface BasePinboxStylesProps {}

export interface PinboxState {
  type?: PinboxTypeState;
  text?: string;
}

type PinboxTypeState = "static" | "digit" | "alphabet" | "alphanumeric";

const BasePinbox = forwardRef<HTMLInputElement, BasePinboxProps>(
  (
    {
      fontSize = 24,
      errorMessage,
      masked,
      parts,
      showError,
      name = "pinbox",
      value,
      onChange,
      disabled,
      id,
      onBlur,
      required,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const pinboxTheme = currentTheme?.pinbox;

    const getDefaultValue = () => {
      let valIndex = 0;
      return parts.map((p) => {
        if (p.type === "static") {
          return p.text ?? "";
        }

        while (
          value &&
          valIndex < value.length &&
          parts[valIndex]?.type === "static"
        ) {
          valIndex++;
        }

        const char = value?.[valIndex] ?? "";
        valIndex++;
        return char.toUpperCase();
      });
    };

    const [valueLocal, setValueLocal] = useState<string[]>(getDefaultValue());

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [maskedIndices, setMaskedIndices] = useState<Set<number>>(new Set());
    const maskTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
      new Map()
    );

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleBlurCapture = (e: React.FocusEvent) => {
      const next = e.relatedTarget as Node;

      if (!wrapperRef.current?.contains(next)) {
        onBlur?.();
      }
    };

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

    /** Check whether a character is valid for a given part type */
    const isCharValidForType = (
      char: string,
      type: PinboxTypeState
    ): boolean => {
      if (type === "static") return false;
      if (type === "digit") return /^[0-9]$/.test(char);
      if (type === "alphabet") return /^[A-Za-z]$/.test(char);
      if (type === "alphanumeric") return /^[A-Za-z0-9]$/.test(char);
      return true;
    };

    /**
     * Handle paste event on any input box.
     * Distributes the pasted text across editable boxes starting from
     * the focused index, skipping static parts and invalid characters.
     */
    const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>,
      startIndex: number
    ) => {
      e.preventDefault();

      const pasted = e.clipboardData.getData("text");
      if (!pasted) return;

      const finalValue = [...valueLocal];
      let pastePos = 0;

      // Walk parts from startIndex, aligning pasted chars.
      // For static parts: if the pasted string includes the static char (case-insensitive),
      // consume it. If it omits it (e.g. pasting "A2DL" skipping the leading "S"),
      // just skip the static slot without consuming a pasted char.
      // Either way, a mismatch where the user pastes a *different* char in a static slot aborts.
      let index = startIndex;

      while (index < parts.length && pastePos < pasted.length) {
        const part = parts[index];

        if (part.type === "static") {
          const pastedChar = pasted[pastePos];
          const staticChar = part.text ?? "";

          if (pastedChar.toUpperCase() === staticChar.toUpperCase()) {
            // Pasted string includes the static char — consume it and move on.
            pastePos++;
          }
          // Static slot is always skipped regardless.
          index++;
          continue;
        }

        const char = pasted[pastePos];
        if (isCharValidForType(char, part.type!)) {
          const normalized =
            part.type === "alphabet" || part.type === "alphanumeric"
              ? char.toUpperCase()
              : char;
          finalValue[index] = normalized;

          if (masked) {
            const existingTimeout = maskTimeoutsRef.current.get(index);
            if (existingTimeout) clearTimeout(existingTimeout);

            setMaskedIndices((prev) => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            });

            const timeout = setTimeout(() => {
              setMaskedIndices((prev) => {
                const next = new Set(prev);
                next.add(index);
                return next;
              });
              maskTimeoutsRef.current.delete(index);
            }, 500);

            maskTimeoutsRef.current.set(index, timeout);
          }

          pastePos++;
        } else {
          // Invalid char for this editable slot — stop.
          break;
        }

        index++;
      }

      setValueLocal(finalValue);

      // Focus the next unfilled editable slot after the paste.
      while (index < parts.length && parts[index].type === "static") index++;
      if (index < parts.length) inputsRef.current[index]?.focus();

      if (onChange) {
        onChange({
          target: { name, value: finalValue.join("") },
        } as ChangeEvent<HTMLInputElement>);
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      const key = e.key;
      const type = parts[index].type;

      if (type === "static") {
        const isSystemShortcut =
          (e.ctrlKey || e.metaKey) && ["v", "a"].includes(key.toLowerCase());
        if (isSystemShortcut) return;
        if (key === "ArrowLeft") moveToPrevInput(index);
        if (key === "Backspace") moveToPrevInput(index);
        if (key === "ArrowRight") moveToNextInput(index);
        if (key === "Tab") moveToNextInput(index);
        e.preventDefault();
        return;
      }

      // Allow browser paste (Ctrl+V / Meta+V) and select-all (Ctrl+A) to
      // pass through so the native onPaste event fires correctly.
      const isSystemShortcut =
        (e.ctrlKey || e.metaKey) && ["v", "a"].includes(key.toLowerCase());

      if (
        type === "digit" &&
        !/[0-9]/.test(key) &&
        !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key) &&
        !isSystemShortcut
      ) {
        e.preventDefault();
        return;
      }
      if (
        type === "alphabet" &&
        !/[A-Za-z]/.test(key) &&
        !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key) &&
        !isSystemShortcut
      ) {
        e.preventDefault();
        return;
      }
      if (
        type === "alphanumeric" &&
        !/[A-Za-z0-9]/.test(key) &&
        !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key) &&
        !isSystemShortcut
      ) {
        e.preventDefault();
        return;
      }

      if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        updateValue(index, key);
        moveToNextInput(index);
      }

      if (key === "Backspace") {
        if (valueLocal[index]) {
          updateValue(index, "");
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
      const type = parts[index].type;
      if (type === "alphabet" || type === "alphanumeric") {
        if (/[a-z]/.test(newChar)) {
          newChar = newChar.toUpperCase();
        }
      }

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

      const outputValue = finalValue
        .map((char, i) => (parts[i].type === "static" ? char : char))
        .join("");

      if (onChange) {
        onChange({
          target: { name, value: outputValue },
        } as ChangeEvent<HTMLInputElement>);
      }
    };

    const getDisplayChar = (index: number) => {
      const char = valueLocal[index] || "";

      if (!masked || !char || parts[index].type === "static") {
        return char;
      }

      return maskedIndices.has(index) ? "•" : char;
    };

    return (
      <PinboxInputWrapper
        ref={wrapperRef}
        onBlurCapture={handleBlurCapture}
        $disabled={disabled}
      >
        {parts.map((part, index) => {
          const isStatic = part.type === "static";

          const displayChar = getDisplayChar(index);
          const { type, pattern } = switchInputBox(part.type);
          const isAnimate = Boolean(
            masked &&
              !isStatic &&
              !maskedIndices.has(index) &&
              valueLocal[index]
          );

          const firstEditableIndex = parts.findIndex(
            (p) => p.type !== "static"
          );

          return (
            <PinboxInputContent
              $fontSize={fontSize}
              $isStatic={isStatic}
              key={index}
            >
              <PinboxInput
                id={index === firstEditableIndex ? id : undefined}
                $theme={pinboxTheme}
                onChange={() => {}}
                aria-label="pinbox-input"
                $error={showError}
                ref={(el: HTMLInputElement) => {
                  inputsRef.current[index] = el;

                  if (index === 0 && typeof ref === "function") {
                    ref(el);
                  } else if (index === 0 && ref) {
                    (
                      ref as React.MutableRefObject<HTMLInputElement | null>
                    ).current = el;
                  }
                }}
                onPaste={(e) => handlePaste(e, index)}
                required={required}
                disabled={disabled}
                pattern={pattern}
                type={type}
                maxLength={1}
                value={displayChar}
                onKeyDown={(e) => handleKeyDown(e, index)}
                $isStatic={isStatic}
                $fontSize={fontSize}
                $isAnimate={isAnimate}
              />
              <PinboxIndicator $theme={pinboxTheme} $error={showError} />
            </PinboxInputContent>
          );
        })}
        {showError && errorMessage && (
          <RiErrorWarningLine
            size={fontSize * 1.25}
            style={{
              display: "flex",
              marginLeft: fontSize * 0.4,
              borderRadius: "9999px",
              background: "#dc2626",
              color: "white",
            }}
          />
        )}
      </PinboxInputWrapper>
    );
  }
);

export type PinboxStylesProps = BasePinboxStylesProps & FieldLaneStylesProps;

export interface PinboxProps
  extends Omit<BasePinboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: PinboxStylesProps;
}

const Pinbox = forwardRef<HTMLInputElement, PinboxProps>(
  (
    {
      label,
      showError,
      styles,
      errorMessage,
      actions,
      helper,
      disabled,
      name,
      id,
      labelGap,
      labelWidth,
      labelPosition,
      ...rest
    },
    ref
  ) => {
    const inputId = StatefulForm.sanitizeId({
      prefix: "pinbox",
      name,
      id,
    });

    const {
      bodyStyle,
      controlStyle,
      containerStyle,
      labelStyle,
      ...pinboxStyles
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
        label={label}
        errorIconPosition="none"
        required={rest.required}
        styles={{
          bodyStyle,
          controlStyle,
          containerStyle,
          labelStyle,
        }}
      >
        <BasePinbox
          {...rest}
          ref={ref}
          id={inputId}
          showError={showError}
          errorMessage={errorMessage}
          disabled={disabled}
          styles={pinboxStyles}
          label={label}
        />
      </FieldLane>
    );
  }
);

const PinboxInputWrapper = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: relative;

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
    `}
`;

const PinboxInputContent = styled.div<{
  $fontSize?: number;
  $isStatic?: boolean;
}>`
  ${({ $fontSize }) =>
    $fontSize &&
    css`
      width: ${`${$fontSize * 1.5}px`};
      height: ${`${$fontSize * 1.75}px`};
    `};

  display: flex;
  position: relative;
`;

const PinboxIndicator = styled.div<{
  $error?: boolean;
  $theme: PinboxThemeConfig;
}>`
  width: 70%;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  display: none;

  border-color: ${({ $theme, $error }) =>
    $error ? $theme.errorBorderColor : $theme.focusedBorderColor};
  box-shadow: 0 0 0 0.5px
    ${({ $theme, $error }) =>
      $error ? $theme.errorBorderColor : $theme.focusedBorderColor};
  color: ${({ $theme, $error }) =>
    $error ? $theme.errorTextColor : $theme.textColor};
  z-index: 9999;
`;

const PinboxInput = styled.input<{
  $fontSize?: number;
  $error?: boolean;
  $isStatic?: boolean;
  $isAnimate?: boolean;
  $theme: PinboxThemeConfig;
}>`
  ${({ $fontSize, $isStatic }) =>
    $isStatic
      ? css`
          width: ${`${$fontSize * 1.5}px`};
          font-size: ${`${$fontSize}px`};
          display: flex;
          align-items: center;
          appearance: none;
        `
      : css`
          width: ${`${$fontSize * 1.5}px`};
          height: ${`${$fontSize * 1.75}px`};
          font-size: ${`${$fontSize}px`};
        `};

  border-radius: 0px;
  outline: none;
  text-align: center;
  caret-color: transparent;
  border: 1px solid
    ${({ $theme, $error }) =>
      $error
        ? $theme?.errorBorderColor || "#f87171"
        : $theme?.borderColor || "#d1d5db"};

  &:focus {
    border-color: ${({ $theme }) => $theme?.focusedBorderColor || "#61A9F9"};
    box-shadow: 0 0 0 0.5px
      ${({ $theme }) => $theme?.focusedBorderColor || "#61A9F9"};
    z-index: 9999;
  }

  color: ${({ $theme, $error }) =>
    $error
      ? $theme?.errorTextColor || "#991b1b"
      : $theme?.textColor || "#1f2937"};

  background-color: ${({ $theme }) => $theme?.backgroundColor || "#ffffff"};

  ${({ $isStatic }) =>
    $isStatic
      ? css`
          user-select: none;
          &:disabled {
            opacity: 0.6;
            user-select: none;
            border-color: rgba(0, 0, 0, 0.3);
            cursor: not-allowed;
          }
          &:focus + ${PinboxIndicator} {
            display: flex;
          }
        `
      : css`
          &:focus + ${PinboxIndicator} {
            display: flex;
          }
          &:disabled {
            opacity: 0.6;
            user-select: none;
            border-color: rgba(0, 0, 0, 0.3);
            cursor: not-allowed;
          }
        `};
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
