import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import Helper from "./helper";

export interface TimeboxProps {
  withSeconds?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  styles?: TimeboxStylesProps;
  disabled?: boolean;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  value?: string;
  name?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  placeholder?: TimeboxPlaceholderProps;
  helper?: string;
}

export interface TimeboxStylesProps {
  containerStyle?: CSSProp;
  self?: CSSProp;
  inputWrapperStyle?: CSSProp;
  labelStyle?: CSSProp;
  errorStyle?: CSSProp;
}

interface TimeboxPlaceholderProps {
  hour?: string;
  minute?: string;
  second?: string;
}

const Timebox = forwardRef<HTMLInputElement, TimeboxProps>(
  (
    {
      withSeconds = false,
      onChange,
      editable = true,
      disabled,
      label,
      errorMessage,
      showError,
      value,
      name,
      onKeyDown,
      placeholder,
      helper,
      styles,
    },
    ref
  ) => {
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

    useImperativeHandle(ref, () => hourRef.current!);

    const inputId = `timebox-${name}`;
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
      const newDigit = value.slice(-1);
      const numeric = /^\d$/.test(newDigit);

      if (!numeric && value !== "") {
        return;
      }

      const setters = { hour: setHour, minute: setMinute, second: setSecond };
      const values = { hour, minute, second };
      const maxValues = { hour: 24, minute: 59, second: 59 };

      let nextType: "minute" | "second" | null =
        type === "hour"
          ? "minute"
          : type === "minute" && withSeconds
            ? "second"
            : null;

      if (value.length <= 2) {
        let num = Number(value);
        const refMap = {
          hour: hourRef,
          minute: minuteRef,
          second: secondRef,
        };

        if (value.length === 2 && num > maxValues[type]) {
          const firstDigit = value[0];
          const secondDigit = value[1];
          setters[type](firstDigit);

          if (nextType) {
            refMap[nextType].current?.focus();
            setters[nextType](secondDigit);
          }

          return;
        } else if (value.length === 2) {
          setters[type](value);
          if (nextType) {
            refMap[nextType].current?.focus();
          }
          return;
        }

        setters[type](value);
      }

      if (value.length > 2) {
        const overflowDigit = value[value.length - 1];
        const trimmedCurrent = value.slice(0, 2);
        setters[type](trimmedCurrent);

        if (nextType) {
          const refMap = {
            hour: hourRef,
            minute: minuteRef,
            second: secondRef,
          };
          refMap[nextType].current?.focus();

          const nextValue = values[nextType] + overflowDigit;
          setters[nextType](nextValue.slice(-2));
        }
      }

      const hh = type === "hour" ? values.hour : hour;
      const mm = type === "minute" ? values.minute : minute;
      const ss = type === "second" ? values.second : second;

      const formatted = [
        (hh || "0").padStart(2, "0"),
        (mm || "0").padStart(2, "0"),
        (ss || "0").padStart(2, "0"),
      ].join(":");

      onChange?.({
        target: {
          name,
          value: formatted,
        },
      } as ChangeEvent<HTMLInputElement>);
      setValueLocal(formatted);
    };

    const inputElement: ReactElement = (
      <InputGroup
        $style={styles?.inputWrapperStyle}
        $focused={isFocused}
        $error={!!showError}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      >
        <Input
          id={inputId}
          aria-label="timebox-hour"
          ref={hourRef}
          data-type={dataType}
          type="text"
          inputMode="numeric"
          placeholder={placeholderHour}
          disabled={!editable || disabled}
          value={hour}
          onChange={(e) => handleChange("hour", e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
        <Colon>:</Colon>
        <Input
          aria-label="timebox-minute"
          ref={minuteRef}
          type="text"
          inputMode="numeric"
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
            <Colon>:</Colon>
            <Input
              aria-label="timebox-second"
              ref={secondRef}
              type="text"
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

    return (
      <InputWrapper
        ref={ref}
        $containerStyle={styles?.containerStyle}
        $disabled={disabled}
      >
        {label && (
          <Label $style={styles?.labelStyle} htmlFor={inputId}>
            {label}

            {helper && <Helper value={helper} />}
          </Label>
        )}
        <InputContent>
          {inputElement}
          {showError && errorMessage && (
            <ErrorText $style={styles?.errorStyle}>{errorMessage}</ErrorText>
          )}
        </InputContent>
      </InputWrapper>
    );
  }
);

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $containerStyle }) => $containerStyle}
`;

const InputGroup = styled.div<{
  $focused: boolean;
  $error: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  border: 1px solid;
  border-radius: 2px;

  border-color: ${({ $error, $focused }) =>
    $error ? "#dc2626" : $focused ? "#61A9F9" : "#d1d5db"};

  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  ${({ $style }) => $style}
`;

const ErrorText = styled.span<{ $style?: CSSProp }>`
  color: #dc2626;
  font-size: 0.75rem;
  ${({ $style }) => $style}
`;

const Input = styled.input<{ $inputStyle?: CSSProp }>`
  min-width: 50px;
  max-width: 50px;
  height: 30px;
  font-size: 0.875rem;
  text-align: center;
  background: white;
  border: none;
  outline: none;

  appearance: none;
  -moz-appearance: textfield;

  &::placeholder {
    text-align: center;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }

  ${({ $inputStyle }) => $inputStyle}
`;

const Colon = styled.span`
  transform: translateY(-1px);
`;

export { Timebox };
