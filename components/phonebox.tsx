import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
  Placement,
} from "@floating-ui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { COUNTRY_CODES } from "../constants/countries";
import { CountryCode, groupDigits } from "../lib/phone";
import styled, { css, CSSProp } from "styled-components";
import {
  FieldLane,
  FieldLaneDropdownOption,
  FieldLaneProps,
  FieldLaneStyles,
} from "./field-lane";
import { Figure } from "./figure";
import { StatefulForm } from "./stateful-form";
import { PhoneboxThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import { applyClassName } from "./../constants/classname";
import { Combobox, ComboboxDrawerProps, ComboboxOption } from "./combobox";
import { SelectboxOption, SelectboxSelectedOptions } from "./selectbox";

export interface PhoneboxCountryCode {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export type PhoneboxComponent = React.ForwardRefExoticComponent<
  PhoneboxProps & React.RefAttributes<HTMLInputElement>
> & {
  formatPhoneNumber: typeof formatPhoneboxNumber;
};

interface BasePhoneboxProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (
    e:
      | { target: { name: string; value: PhoneboxCountryCode } }
      | ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  helper?: string;
  disabled?: boolean;
  showError?: boolean;
  errorMessage?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  countryCodeValue?: PhoneboxCountryCode;
  styles?: PhoneboxStyles;
  id?: string;
  required?: boolean;
  mobile?: boolean;
}

export interface PhoneboxStyles {
  self?: CSSProp;
  inputWrapperStyle?: CSSProp;
  toggleStyle?: CSSProp;
}

export type PhoneboxDropdownOption = FieldLaneDropdownOption;

const BasePhonebox = forwardRef<HTMLInputElement, BasePhoneboxProps>(
  (
    {
      value = "",
      onChange,
      placeholder,
      disabled = false,
      showError = false,
      onKeyDown,
      countryCodeValue,
      styles,
      id,
      required,
      onBlur,
      mobile,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const phoneboxTheme = currentTheme?.phonebox;

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES[205];
    const countryCodeState = countryCodeValue ?? DEFAULT_COUNTRY_CODES;

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] =
      useState<PhoneboxCountryCode>(countryCodeState);
    const [phoneNumber, setPhoneNumber] = useState("");

    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [interactionMode, setInteractionMode] = useState<
      "mouse" | "keyboard"
    >("keyboard");
    const [hasInteracted, setHasInteracted] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => phoneInputRef.current!);

    const FINAL_COUNTRY_OPTIONS: ComboboxOption[] = useMemo(
      () =>
        COUNTRY_CODES.map((country) => ({
          value: country.id,
          text: `${country.code}-${country.flag}`,
          render: (
            <>
              <span style={{ marginRight: "8px" }}>{country.flag}</span>
              <span>{country.name}</span>
              <span style={{ marginLeft: "auto", color: "#6a7282" }}>
                {country.code}
              </span>
            </>
          ),
        })),
      []
    );

    const FILTERED_COUNTRY_OPTIONS: ComboboxOption[] = useMemo(() => {
      if (!hasInteracted || !searchTerm) return FINAL_COUNTRY_OPTIONS;

      const search = searchTerm.toLowerCase();

      return FINAL_COUNTRY_OPTIONS.filter((opt) => {
        const country = COUNTRY_CODES.find((c) => c.id === opt.value);
        if (!country) return false;
        return (
          country.name.toLowerCase().includes(search) ||
          country.code.includes(searchTerm)
        );
      });
    }, [hasInteracted, searchTerm, FINAL_COUNTRY_OPTIONS]);

    const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start" as Placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(4), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const dismiss = useDismiss(context);
    const { getFloatingProps, getReferenceProps } = useInteractions([dismiss]);

    useEffect(() => {
      if (!isOpen) {
        setSearchTerm("");
        setHighlightedIndex(0);
      }
    }, [isOpen]);

    useEffect(() => {
      if (!value) {
        setPhoneNumber("");
        return;
      }

      const formatted = formatPhoneboxNumber(
        value,
        selectedCountry.id as CountryCode
      );
      setPhoneNumber(formatted);
    }, [value]);

    const listRef = useRef<(HTMLLIElement | null)[]>([]);

    // Keep the highlighted option visible while navigating the list.
    useEffect(() => {
      if (isOpen && listRef.current[highlightedIndex]) {
        listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      setInteractionMode("keyboard");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) =>
          Math.min(prev + 1, FILTERED_COUNTRY_OPTIONS.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedOption = FILTERED_COUNTRY_OPTIONS[highlightedIndex];
        const selectedCountry = COUNTRY_CODES.find(
          (country) => country.id === selectedOption.value
        );
        if (selectedCountry) {
          await handleSelectCountry(selectedCountry);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        await setIsOpen(false);
      }
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const raw = e.target.value;
      const trimmed = trimPhone(raw);
      const formatted = formatPhoneboxNumber(
        trimmed,
        selectedCountry.id as CountryCode
      );
      setPhoneNumber(formatted);
      if (onChange) {
        const syntheticEvent = {
          target: {
            name: "phone",
            value: trimmed,
          },
        } as ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    };

    const handleSelectCountry = async (country: PhoneboxCountryCode) => {
      if (disabled) return;

      await setSelectedCountry(country);
      await setIsOpen(false);
      await setSearchTerm("");
      await setHighlightedIndex(0);

      if (onChange) {
        const syntheticEvent = {
          target: {
            name: "country_code",
            value: country,
          },
        };
        await onChange(syntheticEvent);
      }

      phoneInputRef.current?.focus();
    };

    const handleToggleDropdown = () => {
      if (disabled) return;
      setIsOpen((prev) => {
        const newState = !prev;
        if (newState) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
        return newState;
      });
    };

    return (
      <>
        <InputWrapper
          $theme={phoneboxTheme}
          $hasError={showError}
          $isOpen={isOpen}
          $disabled={disabled}
          {...getReferenceProps({
            ref: refs.setReference,
            tabIndex: -1,
            "aria-expanded": isOpen,
            "aria-haspopup": "listbox",
            role: "combobox",
            "aria-controls": "country-listbox",
            "aria-activedescendant": isOpen
              ? `country-option-${highlightedIndex}`
              : undefined,
          })}
          $style={styles?.inputWrapperStyle}
        >
          <CountryButton
            type="button"
            $isOpen={isOpen}
            $theme={phoneboxTheme}
            onClick={handleToggleDropdown}
            disabled={disabled}
            $disabled={disabled}
            aria-label="Select country code"
            tabIndex={0}
            $hasError={showError}
            $style={styles?.toggleStyle}
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            {isOpen ? (
              <Figure image={RiArrowUpSLine} />
            ) : (
              <Figure image={RiArrowDownSLine} />
            )}
          </CountryButton>

          <PhoneInput
            $theme={phoneboxTheme}
            ref={phoneInputRef}
            required={required}
            id={id}
            type="tel"
            $style={styles?.self}
            onBlur={onBlur}
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={(e) => onKeyDown?.(e)}
            disabled={disabled}
            $disabled={disabled}
            aria-label="phonebox-number"
          />
        </InputWrapper>

        {isOpen && (
          <Combobox.Drawer
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refs={refs as unknown as ComboboxDrawerProps["refs"]}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            selectedOptions={countryCodeValue.id}
            selectedOptionsLocal={{
              text: searchTerm,
              value: "",
            }}
            onChange={async (selectedOptions?: SelectboxSelectedOptions) => {
              const selectedCountry = await COUNTRY_CODES.find(
                (c) => c.id === selectedOptions
              );
              if (selectedCountry) {
                await handleSelectCountry(selectedCountry);
              }
            }}
            setSelectedOptionsLocal={(
              selectedOptionsLocal?: SelectboxOption
            ) => {
              setSearchTerm(selectedOptionsLocal?.text);
            }}
            setHasInteracted={setHasInteracted}
            options={FILTERED_COUNTRY_OPTIONS}
            navigableOptions={FILTERED_COUNTRY_OPTIONS}
            inputRef={searchInputRef}
            mobile={mobile}
            withSearchbox
            floatingStyles={floatingStyles}
            getFloatingProps={getFloatingProps}
            listRef={listRef}
            handleKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  }
);

export interface PhoneboxProps
  extends Omit<BasePhoneboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "onChange" | "actions"> {
  styles?: PhoneboxStyles & FieldLaneStyles;
}

const Phonebox = forwardRef<HTMLInputElement, PhoneboxProps>(
  ({ ...props }, ref) => {
    const {
      dropdowns,
      label,
      showError,
      styles,
      errorMessage,
      type,
      helper,
      disabled,
      onChange,
      labelGap,
      labelWidth,
      labelPosition,
      className,
      ...rest
    } = props;

    const inputId = StatefulForm.sanitizeId({
      prefix: "phonebox",
      name: props.name,
      id: props.id,
    });

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
        type={type}
        helper={helper}
        disabled={disabled}
        className={applyClassName("phonebox", className)}
        required={rest.required}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
        }}
      >
        <BasePhonebox
          {...rest}
          id={inputId}
          showError={showError}
          disabled={disabled}
          styles={{
            self: styles?.self,
            toggleStyle: styles?.toggleStyle,
            inputWrapperStyle: css`
              ${dropdowns &&
              css`
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              `}
              ${styles?.self}
            `,
          }}
          onChange={onChange}
          ref={ref}
        />
      </FieldLane>
    );
  }
) as PhoneboxComponent;

const InputWrapper = styled.div<{
  $hasError?: boolean;
  $isOpen?: boolean;
  $disabled?: boolean;
  $style?: CSSProp;
  $theme: PhoneboxThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0;
  }

  display: flex;
  width: 100%;
  min-height: 32px;
  align-items: center;
  border-radius: var(--radius-xs);
  border: 1px solid
    ${({ $hasError, $isOpen, $theme }) =>
      $hasError
        ? $theme?.errorBorderColor
        : $isOpen
          ? $theme?.borderColor
          : $theme?.borderColor};

  &:focus-within {
    border-color: ${({ $hasError, $disabled, $theme }) =>
      $disabled
        ? $theme?.disabledBorderColor
        : $hasError
          ? $theme?.errorBorderColor
          : $theme?.focusedBorderColor};
  }

  ${({ $disabled, $theme }) =>
    $disabled &&
    css`
      border-color: ${$theme?.disabledBorderColor};
    `};

  border-radius: 2px;

  ${({ $style }) => $style};
`;

const CountryButton = styled.button<{
  $disabled?: boolean;
  $hasError?: boolean;
  $style?: CSSProp;
  $theme?: PhoneboxThemeConfig;
  $isOpen?: boolean;
}>`
  display: flex;
  flex-direction: row;
  min-height: 32px;
  align-items: center;
  gap: 4px;
  border-right: 1px solid
    ${({ $hasError, $theme }) =>
      $hasError ? $theme?.errorBorderColor : $theme?.borderColor};

  ${InputWrapper}:focus-within & {
    border-color: ${({ $hasError, $disabled, $theme }) =>
      $disabled
        ? $theme?.disabledBorderColor
        : $hasError
          ? $theme?.errorBorderColor
          : $theme?.focusedBorderColor};
  }

  padding: 0 8px;
  font-size: 12px;
  border-top-left-radius: var(--radius-xs);
  border-bottom-left-radius: var(--radius-xs);

  ${({ $disabled, $isOpen, $theme }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : $isOpen
        ? css`
            background-color: ${$theme?.backgroundColor};
          `
        : css`
            cursor: pointer;
            &:hover {
              background-color: ${$theme?.backgroundColor};
            }
          `}

  ${({ $style }) => $style}
`;

const PhoneInput = styled.input<{
  $disabled?: boolean;
  $style?: CSSProp;
  $theme: PhoneboxThemeConfig;
}>`
  width: 100%;
  padding: 0 12px;
  font-size: 12px;
  border-radius: var(--radius-xs);
  outline: none;
  height: 32px;

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  &::placeholder {
    color: ${({ $theme }) => $theme?.placeholderColor};
  }

  ${({ $style }) => $style}
`;

function trimPhone(input: string): string {
  const onlyNumber = input.replace(/[^0-9]/g, "");
  return onlyNumber.startsWith("0") ? onlyNumber.slice(1) : onlyNumber;
}

/**
 * Formats a national phone number string for display.
 *
 * - Strips everything except digits (no leading + or dial code expected)
 * - Groups digits using the country's real libphonenumber patterns
 * - During partial input (typing), picks the largest pattern that fits
 * - Falls back to a sane default if the country has no pattern
 *
 * @example
 * formatPhoneboxNumber("081234567890", "ID")  // "0812-3456-7890"
 * formatPhoneboxNumber("2025551234",   "US")  // "202-555-1234"
 * formatPhoneboxNumber("0612345678",   "FR")  // "06-12-34-56-78"
 */
function formatPhoneboxNumber(
  phone: string,
  countryCode: CountryCode = "ID"
): string {
  // Keep digits only — no dial code, no +
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  return groupDigits(digits, countryCode).replace(/ /g, "-");
}

Phonebox.formatPhoneNumber = formatPhoneboxNumber;

export { Phonebox };
