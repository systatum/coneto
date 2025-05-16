import { AsYouType, CountryCode } from "libphonenumber-js/max";

export function trimPhone(input: string): string {
  const onlyNumber = input.replace(/[^0-9]/g, "");
  return onlyNumber.startsWith("0") ? onlyNumber.slice(1) : onlyNumber;
}

export function formatWithSimplePattern(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function formatPhoneNumber(
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
