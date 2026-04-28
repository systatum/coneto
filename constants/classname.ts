export function applyConetoClassName(
  component: string = "",
  className?: string
) {
  return `coneto-${component}${className ? ` ${className}` : ""}`;
}
