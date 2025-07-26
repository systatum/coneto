import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useEffect,
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
import clsx from "clsx";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearchLine,
} from "@remixicon/react";
import { COUNTRY_CODES } from "../constants/countries";
import { AsYouType, CountryCode } from "libphonenumber-js/max";

export interface CountryCodeProps {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export interface PhoneboxProps {
  label?: string;
  name?: string;
  className?: string;
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
      className,
      value = "",
      onChange,
      placeholder,
      disabled = false,
      showError = false,
      errorMessage,
      onKeyDown,
      countryCodeValue,
    },
    ref
  ) => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES[86];
    const countryCodeState = countryCodeValue ?? DEFAULT_COUNTRY_CODES;

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] =
      useState<CountryCodeProps>(countryCodeState);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
      let didFocusInitially = false;

      if (!didFocusInitially) {
        didFocusInitially = true;
        phoneInputRef.current?.focus();
      }
    }, []);

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
      <div ref={ref} className="flex w-full flex-col gap-1">
        {label && (
          <label className="text-xs" htmlFor={label}>
            {label}
          </label>
        )}
        <div
          className={clsx(
            "flex w-full min-w-[150px] rounded-xs min-h-[32px] items-center border border-gray-300",
            showError
              ? "border-red-500"
              : isOpen
                ? "border-gray-300"
                : "border-gray-300 focus-within:border-[#61A9F9]",
            disabled ? "opacity-50" : "",
            className
          )}
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
        >
          <button
            type="button"
            onClick={handleToggleDropdown}
            disabled={disabled}
            className={clsx(
              "flex flex-row min-h-[32px] items-center gap-1 rounded-l-xs border-gray-300 border-r px-2 text-xs",
              disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50"
            )}
            aria-label="Select country code"
            tabIndex={0}
          >
            <span className="text-xs">{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            {isOpen ? (
              <RiArrowUpSLine className="h-4 w-4 text-gray-500" />
            ) : (
              <RiArrowDownSLine className="h-4 w-4 text-gray-500" />
            )}
          </button>

          <input
            ref={phoneInputRef}
            type="tel"
            className={clsx(
              "w-full rounded-xs px-3 text-xs focus:outline-none text-black",
              disabled ? "cursor-not-allowed" : "bg-white"
            )}
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={(e) => {
              if (onKeyDown) {
                onKeyDown(e);
              }
            }}
            disabled={disabled}
            aria-label="Phone number input"
          />
        </div>

        {isOpen && (
          <div
            {...getFloatingProps({
              ref: refs.setFloating,
              id: "country-listbox",
              role: "listbox",
              style: {
                ...floatingStyles,
                width: refs.reference.current?.getBoundingClientRect().width,
                zIndex: 1000,
                maxHeight: 240,
                overflowY: "auto",
              },
              tabIndex: -1,
            })}
            className="absolute left-0 scrollbar-thin rounded-xs border border-gray-300 focus:border-[#61A9F9] bg-white shadow-xl md:min-w-[400px]"
          >
            <div className="sticky top-0 bg-white p-2">
              <div className="relative">
                <RiSearchLine className="absolute top-2 left-2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  ref={searchInputRef}
                  className="w-full rounded-xs border border-gray-300 py-2 pr-2 pl-8 text-xs focus:border-[#61A9F9] focus:outline-none"
                  placeholder="Search your country..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleDropdownKeyDown}
                  aria-label="Search countries"
                  autoComplete="off"
                />
              </div>
            </div>

            {FILTERED_COUNTRIES.length > 0 ? (
              FILTERED_COUNTRIES.map((country, index) => (
                <div
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
                  className={clsx(
                    "flex cursor-pointer items-center px-3 py-2 text-xs",
                    highlightedIndex === index ? "bg-blue-100" : ""
                  )}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-gray-500">{country.code}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-gray-500">
                No country found.
              </div>
            )}
          </div>
        )}

        {showError && errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

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
