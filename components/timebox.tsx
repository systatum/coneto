import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { TimeboxThemeConfig } from "./../theme";

interface BaseTimeboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "style" | "placeholder" | "value" | "name"
  > {
  withSeconds?: boolean;
  editable?: boolean;
  styles?: TimeboxStyles;
  showError?: boolean;
  value?: string;
  name?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  placeholder?: TimeboxPlaceholderProps;
}

export interface TimeboxStyles {
  self?: CSSProp;
  inputWrapperStyle?: CSSProp;
}

export interface TimeboxPlaceholderProps {
  hour?: string;
  minute?: string;
  second?: string;
}

const BaseTimebox = forwardRef<HTMLInputElement, BaseTimeboxProps>(
  (
    {
      withSeconds = false,
      onChange,
      editable = true,
      disabled,
      showError,
      value,
      name,
      onKeyDown,
      placeholder,
      styles,
      id,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const timeboxTheme = currentTheme?.timebox;

    const {
      hour: placeholderHour = "HH",
      minute: placeholderMinute = "MM",
      second: placeholderSecond = "SS",
    } = placeholder ?? {};

    const stateValue = value ? value : "";

    const [valueLocal, setValueLocal] = useState<string>(stateValue);
    const [hour, setHour] = useState<string>("");
    const [minute, setMinute] = useState<string>("");
    const [second, setSecond] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);

    const hasBeenFocused = useRef(false);
    const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hourVal = useRef(hour);
    const minuteVal = useRef(minute);
    const secondVal = useRef(second);

    useImperativeHandle(ref, () => hourRef.current!);

    const dataType = withSeconds ? `timebox-with-second` : `timebox`;

    useEffect(() => {
      if (valueLocal) {
        const parts = valueLocal.split(":");
        const [hh, mm, ss] = parts;
        setHour(hh ?? "00");
        setMinute(mm ?? "00");
        setSecond(ss ?? "00");
      }
    }, []);

    const handleChange = (
      type: "hour" | "minute" | "second",
      value: string
    ) => {
      minuteVal.current = minute;
      hourVal.current = hour;
      secondVal.current = second;

      const newDigit = value.slice(-1);
      const numeric = /^\d$/.test(newDigit);

      if (!numeric && value !== "") return;

      const maxValues = { hour: 24, minute: 59, second: 59 };

      const refMap = {
        hour: hourRef,
        minute: minuteRef,
        second: secondRef,
      };

      const setters = {
        hour: setHour,
        minute: setMinute,
        second: setSecond,
      };

      let nextType: "minute" | "second" | null =
        type === "hour"
          ? "minute"
          : type === "minute" && withSeconds
            ? "second"
            : null;

      let nextHour = hour;
      let nextMinute = minute;
      let nextSecond = second;

      const setNext = (t: "hour" | "minute" | "second", val: string) => {
        if (t === "hour") {
          nextHour = val;
          hourVal.current = val;
        }
        if (t === "minute") {
          nextMinute = val;
          minuteVal.current = val;
        }
        if (t === "second") {
          nextSecond = val;
          secondVal.current = val;
        }
        setters[t](val);
      };

      const callOnChange = () => {
        const formatted = [
          (nextHour || "0").padStart(2, "0"),
          (nextMinute || "0").padStart(2, "0"),
          (nextSecond || "0").padStart(2, "0"),
        ].join(":");

        setValueLocal(formatted);
        if (onChange) {
          onChange({
            target: { name, value: formatted },
          } as ChangeEvent<HTMLInputElement>);
        }
      };

      if (value.length <= 2) {
        let num = Number(value);

        if (value.length === 2 && num > maxValues[type]) {
          const firstDigit = value[0];
          const secondDigit = value[1];

          setNext(type, firstDigit);

          if (nextType) {
            refMap[nextType].current?.focus();
            setNext(nextType, secondDigit);
          }

          callOnChange();
          return;
        } else if (value.length === 2) {
          setNext(type, value);
          if (nextType) {
            refMap[nextType].current?.focus();
          }
          callOnChange();
          return;
        }

        setNext(type, value);
      }

      if (value.length > 2) {
        const overflowDigit = value[value.length - 1];
        const trimmedCurrent = value.slice(0, 2);

        setNext(type, trimmedCurrent);

        if (nextType) {
          refMap[nextType].current?.focus();

          const base = nextType === "minute" ? nextMinute : nextSecond;
          const nextValue = (base + overflowDigit).slice(-2);
          setNext(nextType, nextValue);
        }
      }

      callOnChange();
    };

    const focusSmartField = () => {
      if (!hourVal.current || hourVal.current.length < 2) {
        hourRef.current?.focus();
      } else if (!minuteVal.current || minuteVal.current.length < 2) {
        minuteRef.current?.focus();
      } else if (
        withSeconds &&
        (!secondVal.current || secondVal.current.length < 2)
      ) {
        secondRef.current?.focus();
      } else {
        if (withSeconds) {
          secondRef.current?.focus();
        } else {
          minuteRef.current?.focus();
        }
      }
    };

    return (
      <InputGroup
        $style={styles?.inputWrapperStyle}
        $focused={isFocused}
        $error={!!showError}
        $disabled={disabled}
        $theme={timeboxTheme}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
        onBlur={() => {
          setIsFocused(false);
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          blurTimeout.current = setTimeout(() => {
            const anyFocused = [hourRef, minuteRef, secondRef].some(
              (r) => r.current === document.activeElement
            );
            if (!anyFocused) {
              hasBeenFocused.current = false;
            }
          }, 0);
        }}
      >
        <Input
          id={id}
          aria-label="timebox-hour"
          ref={hourRef}
          data-type={dataType}
          type="text"
          inputMode="numeric"
          placeholder={placeholderHour}
          disabled={!editable || disabled}
          value={hour}
          onChange={(e) => handleChange("hour", e.target.value)}
          $theme={timeboxTheme}
          onFocus={() => {
            setIsFocused(true);

            if (!hasBeenFocused.current) {
              hasBeenFocused.current = true;
              focusSmartField();
            }
          }}
          min={0}
          max={24}
          $inputStyle={styles?.self}
          onKeyDown={(e) => {
            const { selectionEnd, value } = e.currentTarget;

            if (e.key === "ArrowRight" && selectionEnd === value.length) {
              e.preventDefault();
              minuteRef.current?.focus();
            }

            if (e.key === ":") {
              e.preventDefault();
              minuteRef.current?.focus();
            }
          }}
        />
        <Colon $theme={timeboxTheme}>:</Colon>
        <Input
          aria-label="timebox-minute"
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          $theme={timeboxTheme}
          placeholder={placeholderMinute}
          disabled={!editable || disabled}
          value={minute}
          onChange={(e) => handleChange("minute", e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={0}
          max={59}
          $inputStyle={styles?.self}
          onKeyDown={(e) => {
            const { selectionStart, selectionEnd, value } = e.currentTarget;

            if (e.key === "Backspace" && selectionStart === 0) {
              e.preventDefault();
              hourRef.current?.focus();
            }

            if (e.key === "ArrowRight" && selectionEnd === value.length) {
              e.preventDefault();
              if (withSeconds) secondRef.current?.focus();
            }

            if (e.key === "ArrowLeft" && selectionStart === 0) {
              e.preventDefault();
              hourRef.current?.focus();
            }

            if (e.key === ":") {
              e.preventDefault();
              secondRef.current?.focus();
            }
          }}
        />
        {withSeconds && (
          <>
            <Colon $theme={timeboxTheme}>:</Colon>
            <Input
              aria-label="timebox-second"
              ref={secondRef}
              type="text"
              $theme={timeboxTheme}
              inputMode="numeric"
              placeholder={placeholderSecond}
              disabled={!editable || disabled}
              value={second}
              onChange={(e) => handleChange("second", e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              min={0}
              max={59}
              $inputStyle={styles?.self}
              onKeyDown={(e) => {
                const { selectionStart } = e.currentTarget;
                if (e.key === "Backspace" && selectionStart === 0) {
                  e.preventDefault();
                  minuteRef.current?.focus();
                }

                if (
                  e.key === "ArrowLeft" &&
                  e.currentTarget.selectionStart === 0
                ) {
                  e.preventDefault();
                  minuteRef.current?.focus();
                }
              }}
            />
          </>
        )}
      </InputGroup>
    );
  }
);

export interface TimeboxProps
  extends Omit<BaseTimeboxProps, "styles" | "inputId">,
    Omit<FieldLaneProps, "styles" | "inputId" | "type"> {
  styles?: TimeboxStyles & FieldLaneStyles;
}

const Timebox = forwardRef<HTMLInputElement, TimeboxProps>(
  ({ ...props }, ref) => {
    const {
      dropdowns,
      label,
      showError,
      styles,
      errorMessage,
      actions,
      helper,
      disabled,
      labelGap,
      labelWidth,
      labelPosition,
      ...rest
    } = props;

    const inputId = StatefulForm.sanitizeId({
      prefix: "timebox",
      name: props.name,
      id: props.id,
    });

    const { bodyStyle, containerStyle, controlStyle, labelStyle } =
      styles ?? {};

    return (
      <FieldLane
        id={inputId}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        helper={helper}
        disabled={disabled}
        required={rest.required}
        errorIconPosition="relative"
        styles={{
          bodyStyle,
          controlStyle,
          containerStyle,
          labelStyle,
        }}
      >
        <BaseTimebox
          {...rest}
          ref={ref}
          id={inputId}
          showError={showError}
          disabled={disabled}
          styles={{
            inputWrapperStyle: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${styles?.inputWrapperStyle}
            `,
            self: styles?.self,
          }}
        />
      </FieldLane>
    );
  }
);

const InputGroup = styled.div<{
  $focused: boolean;
  $error: boolean;
  $style?: CSSProp;
  $disabled?: boolean;
  $theme?: TimeboxThemeConfig;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  border: 1px solid;
  border-radius: 2px;

  border-color: ${({ $error, $focused, $theme }) =>
    $error
      ? $theme?.errorBorderColor || "#dc2626"
      : $focused
        ? $theme?.focusedBorderColor || "#61A9F9"
        : $theme?.borderColor || "#d1d5db"};

  background: ${({ $theme }) => $theme?.backgroundColor};

  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
          user-select: none;
        `
      : css`
          cursor: text;
        `};

  ${({ $style }) => $style}
`;

const Input = styled.input<{
  $inputStyle?: CSSProp;
  $theme?: TimeboxThemeConfig;
}>`
  min-width: 50px;
  max-width: 50px;
  height: 30px;
  font-size: 0.875rem;
  text-align: center;
  background: ${({ $theme }) => $theme?.backgroundColor};
  border: none;
  outline: none;
  cursor: inherit;

  appearance: none;
  -moz-appearance: textfield;

  &::placeholder {
    text-align: center;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }

  // Fix for autofill background
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px
      ${({ $theme }) => $theme?.backgroundColor} inset;
    -webkit-text-fill-color: ${({ $theme }) => $theme?.textColor};
    transition: background-color 5000s ease-in-out 0s;
  }

  ${({ $inputStyle }) => $inputStyle}
`;

const Colon = styled.span<{ $theme?: TimeboxThemeConfig }>`
  transform: translateY(-1px);
`;

export { Timebox };
