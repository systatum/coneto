export type FalsyOr<T> = T | boolean | null | undefined;

export function isTruthy<T>(
  value: T
): value is Exclude<T, boolean | null | undefined> {
  return Boolean(value);
}
