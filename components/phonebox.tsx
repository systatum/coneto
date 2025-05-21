import { ChangeEvent, useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import clsx from "clsx";
import { CountryCodeProps } from "../type/phonebox";
import { COUNTRY_CODES } from "../constants/countries";
import { AsYouType, CountryCode } from "libphonenumber-js/max";

export interface PhoneboxProps {
  label: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (
    field: "phone_number" | "country_code",
    value: string | CountryCodeProps
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  showError?: boolean;
  errorMessage?: string;
  phoneNumber: string;
}

export default function Phonebox({
  label,
  className,
  value = "",
  onChange,
  placeholder,
  disabled = false,
  showError = false,
  errorMessage,
}: PhoneboxProps) {
  const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find((data) => data.id === "US");

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeProps>(
    DEFAULT_COUNTRY_CODES
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const FILTERED_COUNTRIES = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value) {
      setPhoneNumber("");
      return;
    }
    const country = COUNTRY_CODES.find((c) => value.startsWith(c.code));
    if (country) {
      setSelectedCountry(country);
      const raw = value.substring(country.code.length);
      const formatted = formatPhoneNumber(raw, country.id as CountryCode);
      setPhoneNumber(formatted);
    } else {
      const formatted = formatPhoneNumber(
        value,
        selectedCountry.id as CountryCode
      );
      setPhoneNumber(formatted);
    }
  }, [value]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const trimmed = trimPhone(raw);
    const formatted = formatPhoneNumber(
      trimmed,
      selectedCountry.id as CountryCode
    );
    setPhoneNumber(formatted);
    if (onChange) onChange("phone_number", trimmed);
  };

  const handleSelectCountry = (country: CountryCodeProps) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
    if (onChange) onChange("country_code", country);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-xs" htmlFor={label}>
        {label}
      </label>
      <div
        className={clsx(
          "flex w-full min-w-[350px] md:min-w-[400px] rounded-xs border border-gray-300",
          showError ? "border-red-500" : "focus-within:border-blue-600",
          disabled ? "opacity-50" : "",
          className
        )}
        ref={dropdownRef}
      >
        <div className={clsx("relative")}>
          <button
            type="button"
            className={clsx(
              "flex flex-row items-center gap-1 rounded-l-xs border-gray-300 border-r px-2 py-[7px] text-xs",
              disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50"
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className="text-xs">{selectedCountry.flag}</span>
            <span className="">{selectedCountry.code}</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isOpen && (
            <div
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
              className="absolute left-0 z-10 mt-1 max-h-60 w-full min-w-[350px] overflow-auto rounded-sm border border-gray-300 bg-white shadow-xl md:min-w-[400px]"
            >
              <div className="sticky top-0 bg-white p-2">
                <div className="relative">
                  <Search className="absolute top-2 left-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full rounded-xs border border-gray-300 py-2 pr-2 pl-8 text-xs focus:border-blue-600 focus:outline-none"
                    placeholder="Search your country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="scrollbar-thin max-h-52 w-full overflow-y-auto">
                {FILTERED_COUNTRIES.length > 0 ? (
                  FILTERED_COUNTRIES.map((country) => (
                    <div
                      key={`${country.name}`}
                      className={clsx(
                        "flex w-full cursor-pointer items-center px-3 py-2 text-xs hover:bg-gray-100",
                        selectedCountry.id === country.id ? "bg-blue-50" : ""
                      )}
                      onClick={() => handleSelectCountry(country)}
                    >
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="ml-2 text-gray-500">{country.code}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-gray-500">
                    Country not found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          type="tel"
          className={clsx(
            "h-full w-full flex-1 rounded-xs px-3 py-[7px] text-xs focus:outline-none text-black",
            disabled ? "cursor-not-allowed bg-gray-300" : "bg-white"
          )}
          placeholder={placeholder}
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={disabled}
        />
      </div>

      {showError && errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

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

function formatPhoneNumber(
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
