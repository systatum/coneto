import React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import clsx from "clsx";
import { formatPhoneDisplay, phoneTrim } from "../constants/Phonebox";
import { CountryCodeProps } from "../type/Phonebox";
import { COUNTRY_CODE_WITH_FLAGS } from "../constants/CountryCode";

interface PhoneboxProps {
  label: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (
    field: "phone_number" | "country_code",
    value: string | CountryCodeProps,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function Phonebox({
  label,
  className,
  value = "",
  onChange,
  placeholder,
  disabled = false,
  error = false,
  helperText,
}: PhoneboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeProps>(
    COUNTRY_CODE_WITH_FLAGS[205],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRY_CODE_WITH_FLAGS.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm),
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      const country = COUNTRY_CODE_WITH_FLAGS.find((country) =>
        value.startsWith(country.code),
      );

      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.code.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleSelectCountry = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");

    if (onChange) {
      onChange("country_code", country);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value;
    const phoneValue = phoneTrim(cleaned);

    const limitedPhoneValue = phoneValue.slice(0, 15);

    setPhoneNumber(limitedPhoneValue);

    if (onChange) {
      onChange("phone_number", limitedPhoneValue);
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-xs" htmlFor={label}>
        {label}
      </label>
      <div
        className={clsx(
          "flex w-full rounded-xs border",
          error ? "border-red-500" : "focus-within:border-blue-600",
          disabled ? "opacity-50" : "",
          className,
        )}
        ref={dropdownRef}
      >
        <div className="relative">
          <button
            type="button"
            className={clsx(
              "flex flex-row items-center gap-1 rounded-l-xs border-r px-2 py-[7px] text-xs",
              disabled
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50",
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span>{selectedCountry.flag}</span>
            <span className="text-xs">{selectedCountry.code}</span>
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
              className="absolute left-0 z-10 mt-1 max-h-60 w-full min-w-[350px] overflow-auto rounded-xs border border-gray-200 bg-white text-xs shadow-lg md:min-w-[400px]"
            >
              <div className="sticky top-0 bg-white p-2">
                <div className="relative">
                  <Search className="absolute top-2 left-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full rounded-xs border border-gray-200 py-2 pr-2 pl-8 text-xs focus:border-blue-600 focus:outline-none"
                    placeholder="Search your country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="scrollbar-thin max-h-52 w-full overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={`${country.name}`}
                      className={clsx(
                        "flex w-full cursor-pointer items-center px-3 py-2 hover:bg-gray-100",
                        selectedCountry.id === country.id ? "bg-blue-50" : "",
                      )}
                      onClick={() => handleSelectCountry(country)}
                    >
                      <span className="mr-2 text-lg">{country.flag}</span>
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
            "h-full w-full flex-1 rounded-xs px-3 py-[7px] text-xs focus:outline-none",
            disabled ? "cursor-not-allowed bg-gray-50" : "bg-white",
          )}
          placeholder={placeholder}
          value={formatPhoneDisplay(phoneNumber)}
          onChange={handlePhoneChange}
          disabled={disabled}
        />
      </div>

      {error && helperText && (
        <p className="mt-1 text-xs text-red-500">{helperText}</p>
      )}
    </div>
  );
}
