export function isValidDateString(value: string): boolean {
  if (!value) return false;

  const parts = value.includes(",")
    ? value.split(",").map((s) => s.trim())
    : value.includes("-")
      ? value.split("-").map((s) => s.trim())
      : [value];

  return parts.every((p) => !isNaN(new Date(p).getTime()));
}

export function isValidSingleDate(v: string): boolean {
  return !isNaN(new Date(v).getTime());
}

export function getValidMultipleDate(raw: string): string[] {
  if (!raw) return [];
  return raw
    ?.split(",")
    ?.map((s) => s.trim())
    ?.filter(isValidSingleDate);
}

export function removeWeekend(dates: string[]): string[] {
  return dates.filter((d) => {
    const dd = new Date(d);
    const day = dd.getDay();
    return day !== 0 && day !== 6;
  });
}

export function isWeekend(dateToCheck: Date): boolean {
  const day = dateToCheck.getDay();
  return day === 0 || day === 6;
}
