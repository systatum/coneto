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
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

interface BaseTimeboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "style" | "placeholder" | "value" | "name"
  > {
  withSeconds?: boolean;
  editable?: boolean;
  styles?: TimeboxStylesProps;
  showError?: boolean;
  value?: string;
  name?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  placeholder?: TimeboxPlaceholderProps;
}

export interface TimeboxStylesProps {
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

    return (
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
  }
);

export interface TimeboxProps
  extends Omit<BaseTimeboxProps, "styles" | "inputId">,
    Omit<FieldLaneProps, "styles" | "inputId" | "type"> {
  styles?: TimeboxStylesProps & FieldLaneStylesProps;
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
      ...rest
    } = props;
    const inputId = `Timebox-${props?.name}`;

    return (
      <FieldLane
        inputId={inputId}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        label={label}
        actions={actions}
        helper={helper}
        disabled={disabled}
        errorIconPosition="relative"
        styles={{
          containerStyle: css`
            width: fit-content;
            ${styles?.containerStyle}
          `,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BaseTimebox
          {...rest}
          id={inputId}
          showError={showError}
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
          ref={ref}
        />
      </FieldLane>
    );
  }
);

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
