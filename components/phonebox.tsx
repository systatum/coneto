import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
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
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearchLine,
} from "@remixicon/react";
import { COUNTRY_CODES } from "../constants/countries";
import { AsYouType, CountryCode } from "libphonenumber-js/max";
import styled, { css, CSSProp } from "styled-components";
import {
  FieldLane,
  FieldLaneDropdownOption,
  FieldLaneProps,
  FieldLaneStyles,
} from "./field-lane";
import { Figure } from "./figure";
import { StatefulForm } from "./stateful-form";
import { Searchbox } from "./searchbox";
import { PhoneboxThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";

export interface PhoneboxCountryCode {
  id: string;
  code: string;
  name: string;
  flag: string;
}

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

    const searchInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => phoneInputRef.current!);

    const FILTERED_COUNTRIES = COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

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

    const listRef = useRef<(HTMLDivElement | null)[]>([]);
    useEffect(() => {
      if (isOpen && listRef.current[highlightedIndex]) {
        listRef.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    const handleDropdownKeyDown = async (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (disabled) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) =>
          Math.min(prev + 1, FILTERED_COUNTRIES.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) await setIsOpen(true);
        await setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = FILTERED_COUNTRIES[highlightedIndex];
        if (selected) {
          await handleSelectCountry(selected);
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
          <DropdownContainer
            {...getFloatingProps({
              ref: refs.setFloating,
              id: "country-listbox",
              role: "listbox",
              style: {
                ...floatingStyles,
                width: refs.reference.current?.getBoundingClientRect().width,
              },
              tabIndex: -1,
            })}
            $theme={phoneboxTheme}
          >
            <Searchbox
              type="text"
              disabled={disabled}
              ref={searchInputRef}
              placeholder="Search your country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              styles={{
                containerStyle: css`
                  width: 100%;
                  position: sticky;
                  top: 0;
                  padding: 8px;
                  width: 100%;
                  min-width: 0;
                  background-color: ${phoneboxTheme?.backgroundColor};
                `,
                self: css`
                  border-radius: 2px;
                  max-height: 28px;
                  width: 100%;
                  min-width: 275px;
                `,
              }}
              onKeyDown={handleDropdownKeyDown}
              aria-label="search-countries"
              autoComplete="off"
            />

            {FILTERED_COUNTRIES.length > 0 ? (
              FILTERED_COUNTRIES.map((country, index) => (
                <CountryOption
                  key={country.id}
                  $theme={phoneboxTheme}
                  id={`country-option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  tabIndex={-1}
                  ref={(el) => {
                    listRef.current[index] = el;
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectCountry(country);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  $highlighted={highlightedIndex === index}
                >
                  <span style={{ marginRight: "8px" }}>{country.flag}</span>
                  <span>{country.name}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#6a7282",
                    }}
                  >
                    {country.code}
                  </span>
                </CountryOption>
              ))
            ) : (
              <EmptyOption>No country found.</EmptyOption>
            )}
          </DropdownContainer>
        )}
      </>
    );
  }
);

export interface PhoneboxProps
  extends Omit<BasePhoneboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "onChange"> {
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
      actions,
      type,
      helper,
      disabled,
      onChange,
      labelGap,
      labelWidth,
      labelPosition,
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
        actions={actions}
        type={type}
        helper={helper}
        disabled={disabled}
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
);

const InputWrapper = styled.div<{
  $hasError?: boolean;
  $isOpen?: boolean;
  $disabled?: boolean;
  $style?: CSSProp;
  $theme: PhoneboxThemeConfig;
}>`
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

const DropdownContainer = styled.div<{
  $theme: PhoneboxThemeConfig;
}>`
  position: absolute;
  left: 0;
  border-radius: var(--radius-xs);
  max-height: 240px;
  overflow-y: auto;
  z-index: 9992999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  border: 1px solid ${({ $theme }) => $theme?.borderColor};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }
`;

const CountryOption = styled.div<{
  $highlighted?: boolean;
  $theme: PhoneboxThemeConfig;
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  ${({ $highlighted, $theme }) =>
    $highlighted &&
    css`
      background-color: ${$theme?.optionHighlightedBackground};
    `}
`;

const EmptyOption = styled.div`
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
`;

function trimPhone(input: string): string {
  const onlyNumber = input.replace(/[^0-9]/g, "");
  return onlyNumber.startsWith("0") ? onlyNumber.slice(1) : onlyNumber;
}

function formatWithSimplePattern(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatPhoneboxNumber(
  phone: string,
  countryCode: CountryCode = "ID"
): string {
  const cleaned = phone.replace(/[^\d+]/g, "");

  const formatter = new AsYouType(countryCode);
  formatter.input(cleaned);

  const formattedInternational = formatter.getNumber()?.formatInternational();

  if (!formattedInternational) {
    return formatWithSimplePattern(cleaned);
  }

  const parts = formattedInternational.split(" ");
  if (parts.length < 2) return formattedInternational;

  const rest = parts.slice(1).join(" ");
  const restWithDash = rest.replace(/ /g, "-");

  return `${restWithDash}`;
}

export { Phonebox, formatPhoneboxNumber };
