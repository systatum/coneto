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
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearchLine,
} from "@remixicon/react";
import { COUNTRY_CODES } from "../constants/countries";
import { AsYouType, CountryCode } from "libphonenumber-js/max";
import styled, { css, CSSProp } from "styled-components";

export interface CountryCodeProps {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export interface PhoneboxProps {
  label?: string;
  name?: string;
  style?: CSSProp;
  labelStyle?: CSSProp;
  value?: string;
  onChange?: (
    e:
      | { target: { name: string; value: CountryCodeProps } }
      | ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  showError?: boolean;
  errorMessage?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  countryCodeValue?: CountryCodeProps;
}

const Phonebox = forwardRef<HTMLInputElement, PhoneboxProps>(
  (
    {
      label,
      style,
      value = "",
      onChange,
      placeholder,
      disabled = false,
      showError = false,
      errorMessage,
      onKeyDown,
      countryCodeValue,
      labelStyle,
    },
    ref
  ) => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES[205];
    const countryCodeState = countryCodeValue ?? DEFAULT_COUNTRY_CODES;

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] =
      useState<CountryCodeProps>(countryCodeState);
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

    const handleSelectCountry = async (country: CountryCodeProps) => {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
        }}
      >
        {label && (
          <Label $style={labelStyle} htmlFor={label}>
            {label}
          </Label>
        )}
        <InputWrapper
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
          $style={style}
        >
          <CountryButton
            type="button"
            onClick={handleToggleDropdown}
            disabled={disabled}
            $disabled={disabled}
            aria-label="Select country code"
            tabIndex={0}
            $style={style}
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            {isOpen ? <ArrowUp /> : <ArrowDown />}
          </CountryButton>

          <PhoneInput
            ref={phoneInputRef}
            type="tel"
            $style={style}
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={(e) => onKeyDown?.(e)}
            disabled={disabled}
            $disabled={disabled}
            aria-label="Phone number input"
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
          >
            <StickyHeader>
              <SearchWrapper>
                <RiSearchLine
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.5rem",
                    width: "1rem",
                    height: "1rem",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <SearchInput
                  type="text"
                  ref={searchInputRef}
                  placeholder="Search your country..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleDropdownKeyDown}
                  aria-label="search-countries"
                  autoComplete="off"
                />
              </SearchWrapper>
            </StickyHeader>

            {FILTERED_COUNTRIES.length > 0 ? (
              FILTERED_COUNTRIES.map((country, index) => (
                <CountryOption
                  key={country.id}
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

        {showError && <ErrorText>{errorMessage}</ErrorText>}
      </div>
    );
  }
);

const InputWrapper = styled.div<{
  $hasError?: boolean;
  $isOpen?: boolean;
  $disabled?: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  width: 100%;
  min-height: 32px;
  align-items: center;
  border-radius: var(--radius-xs);
  border: 1px solid
    ${({ $hasError, $isOpen }) =>
      $hasError ? "#ef4444" : $isOpen ? "#d1d5db" : "#d1d5db"};
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
    `}
  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? "#ef4444" : "#61A9F9")};
  }

  ${({ $style }) => $style}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  ${({ $style }) => $style}
`;

const CountryButton = styled.button<{ $disabled?: boolean; $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  min-height: 32px;
  align-items: center;
  gap: 4px;
  border-right: 1px solid #d1d5db;
  padding: 0 8px;
  font-size: 12px;
  border-top-left-radius: var(--radius-xs);
  border-bottom-left-radius: var(--radius-xs);
  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: #f9fafb;
          }
        `}

  ${({ $style }) => $style}
`;

const IconStyled = (icon: RemixiconComponentType) => styled(icon)`
  width: 1rem;
  height: 1rem;
  color: #6b7280;
`;

const ArrowUp = IconStyled(RiArrowUpSLine);
const ArrowDown = IconStyled(RiArrowDownSLine);

const PhoneInput = styled.input<{ $disabled?: boolean; $style?: CSSProp }>`
  width: 100%;
  padding: 0 12px;
  font-size: 12px;
  border-radius: var(--radius-xs);
  outline: none;
  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          background-color: white;
        `}

  ${({ $style }) => $style}
`;

const DropdownContainer = styled.div`
  position: absolute;
  left: 0;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-xs);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;

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

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  padding: 8px;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 8px 8px 8px 32px;
  font-size: 12px;
  border-radius: var(--radius-xs);
  outline: none;

  &:focus {
    border-color: #61a9f9;
  }
`;

const CountryOption = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  ${({ $highlighted }) =>
    $highlighted &&
    css`
      background-color: #dbeafe;
    `}
`;

const EmptyOption = styled.div`
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
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
