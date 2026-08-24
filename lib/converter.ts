export type SelectboxSelectedOptions = number | string | number[] | string[];

export function castValue<T extends SelectboxSelectedOptions>(
  value: any,
  original: T
): T {
  if (Array.isArray(original)) {
    if (Array.isArray(value)) {
      return value.map((v) =>
        typeof original[0] === "number" ? Number(v) : String(v)
      ) as T;
    }
    return [value] as T;
  }

  // an empty selection (eg. clearing the field, or committing with no
  // options/matches available) is signalled as `undefined` - stringifying
  // it here would otherwise produce the literal text "undefined" as the
  // field's value instead of leaving it empty
  if (value === undefined) {
    return undefined as unknown as T;
  }

  if (typeof original === "number") {
    return Number(value) as T;
  }

  return String(value) as T;
}
