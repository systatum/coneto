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

export interface TimeboxProps {
  withSeconds?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  containerStyle?: CSSProp;
  inputStyle?: CSSProp;
  labelStyle?: CSSProp;
  errorStyle?: CSSProp;
  disabled?: boolean;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  value?: string;
  name?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  placeholder?: TimeboxPlaceholderProps;
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
      containerStyle,
      inputStyle,
      labelStyle,
      disabled,
      label,
      errorMessage,
      showError,
      value,
      name,
      onKeyDown,
      errorStyle,
      placeholder,
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
      const isDelete = value === "";
      const isInvalid = newDigit === "" || isNaN(Number(newDigit));

      const setters = { hour: setHour, minute: setMinute, second: setSecond };
      const values = { hour, minute, second };
      const maxValues = { hour: 24, minute: 59, second: 59 };

      if (isDelete) {
        setters[type]("");
      } else if (!isInvalid) {
        const oldVal = values[type];
        const newVal = oldVal.length >= 2 ? newDigit : oldVal + newDigit;
        if (parseInt(newVal, 10) > maxValues[type]) return;
        setters[type](newVal);
        values[type] = newVal;
      } else {
        return;
      }

      const hh = type === "hour" ? (isDelete ? "" : values.hour) : hour;
      const mm = type === "minute" ? (isDelete ? "" : values.minute) : minute;
      const ss = type === "second" ? (isDelete ? "" : values.second) : second;

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
        $focused={isFocused}
        $error={!!showError}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      >
        <Input
          ref={hourRef}
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
          $inputStyle={inputStyle}
          onKeyDown={(e) => {
            if (
              e.key === "ArrowRight" &&
              e.currentTarget.selectionEnd === e.currentTarget.value.length
            ) {
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
          $inputStyle={inputStyle}
          onKeyDown={(e) => {
            const { selectionStart, selectionEnd, value } = e.currentTarget;

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
              $inputStyle={inputStyle}
              onKeyDown={(e) => {
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

    const inputId = `textbox-${name}`;
    const dataType = withSeconds ? `timebox-with-second` : `timebox`;

    return (
      <InputWrapper
        data-type={dataType}
        ref={ref}
        $containerStyle={containerStyle}
        $disabled={disabled}
      >
        {label && (
          <Label $style={labelStyle} htmlFor={inputId}>
            {label}
          </Label>
        )}
        <InputContent>
          {inputElement}
          {showError && errorMessage && (
            <ErrorText $style={errorStyle}>{errorMessage}</ErrorText>
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

const InputGroup = styled.div<{ $focused: boolean; $error: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  border: 1px solid;
  border-radius: 2px;

  border-color: ${({ $error, $focused }) =>
    $error ? "#dc2626" : $focused ? "#61A9F9" : "#d1d5db"};
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const Label = styled.label<{ $style?: CSSProp }>`
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
