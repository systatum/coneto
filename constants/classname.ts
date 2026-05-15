export function applyClassName(component: string = "", className?: string) {
  return `coneto-${component}${className ? ` ${className}` : ""}`;
}
